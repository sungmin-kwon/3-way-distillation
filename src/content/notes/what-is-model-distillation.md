---
title: What is model distillation?
summary: Knowledge distillation for language models, worked through on one next-token example — soft targets and temperature, the T² factor, token- vs. sequence-level KD, forward vs. reverse KL, on-policy distillation, and why evaluation is the hard part.
date: 2026-11-09
tags: [ml/llm]
distillate: A small student model is trained to match a large teacher's whole output distribution, not just its top answer, because the probabilities the teacher gives to wrong answers carry information about how it generalizes. Writing the loss is easy; choosing which divergence to minimize, on whose samples, and checking that the student really behaves like the teacher are the hard parts.
model: [Mistral Vibe, Claude Opus 5.5]
---

Large language models are expensive to serve: billions of parameters, memory-bound decoding, real cost per token. **Knowledge distillation** trains a small *student* model $q_\theta$ to imitate a large *teacher* $p$, aiming for most of the teacher's behavior at a fraction of the size. The name is Hinton, Vinyals and Dean's (2015), but the idea goes back to Buciluǎ, Caruana and Niculescu-Mizil's "model compression" (2006).

## Why match a distribution and not just the answer

A one-hot label says *which* token is right. A teacher's distribution also says how wrong every other token is, and that ranking is learned structure. Hinton's example: an image of a BMW might be given probability $10^{-6}$ of being a garbage truck and $10^{-9}$ of being a carrot. Both are tiny, but the ratio tells the student that trucks and cars are related. That information in the wrong-answer probabilities is what the paper called **dark knowledge**.

The catch is that a confident teacher hides it. Its wrong-answer probabilities are so small that they contribute almost nothing to a cross-entropy loss. Temperature is the knob that brings them back up.

## Soft targets and temperature

With teacher logits $z_i$ and temperature $T$, the softened distribution is

$$
p_i^{T} = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}
$$

$T = 1$ is the ordinary softmax. As $T \to 0$ it approaches a one-hot argmax; as $T \to \infty$ it approaches uniform. The student's distribution $q^T$ is softened the same way.

### A worked example

Suppose the prompt is *"The capital of France is"* and we look at six candidate next tokens. (A real vocabulary has ~100k entries; six keeps the arithmetic visible.) The teacher's logits are

| token | Paris | Lyon | the | a | Berlin | banana |
| --- | --- | --- | --- | --- | --- | --- |
| teacher logit $z_i$ | 9.0 | 5.0 | 4.5 | 4.0 | 3.5 | −1.0 |
| $p^{T}$ at $T = 0.5$ | 0.999 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| $p^{T}$ at $T = 1$ | 0.961 | 0.018 | 0.011 | 0.006 | 0.004 | 0.000 |
| $p^{T}$ at $T = 2$ | 0.718 | 0.097 | 0.076 | 0.059 | 0.046 | 0.005 |
| $p^{T}$ at $T = 4$ | 0.432 | 0.159 | 0.140 | 0.124 | 0.109 | 0.035 |

At $T = 1$ only 4% of the mass is off "Paris", and the student would learn almost nothing beyond "say Paris". At $T = 2$ it is 28%, and the teacher's ranking is legible: another French city first, then function words that could start a longer answer ("the city of…"), then a wrong capital, with "banana" far behind. At $T = 4$ the entropy has risen from 0.21 to 1.55 nats, and "banana" is getting a share it doesn't deserve. This is why $T$ is usually tuned in a small range around 1–4.

## The loss

For classification-style KD the student minimizes

$$
L = (1-\lambda)\,\mathrm{CE}\bigl(y,\ q_\theta^{1}\bigr) + \lambda\, T^2\, \mathrm{KL}\bigl(p^{T} \,\big\|\, q_\theta^{T}\bigr)
$$

The first term fits the ground-truth label $y$ at $T = 1$; the second fits the teacher's softened distribution. Minimizing $\mathrm{KL}(p^T \| q^T)$ over $\theta$ is the same as minimizing the cross-entropy $H(p^T, q^T)$, since the teacher's entropy is a constant.

**Why $T^2$.** The gradient of the KL term with respect to the student's logit $v_i$ is

$$
\frac{\partial}{\partial v_i}\,\mathrm{KL}\bigl(p^T \,\|\, q^T\bigr) = \frac{1}{T}\left(q_i^{T} - p_i^{T}\right)
$$

and at high temperature $q_i^T - p_i^T$ itself shrinks roughly like $(v_i - z_i)/(N T)$ for $N$ classes, so the gradient falls off like $1/T^2$. Multiplying by $T^2$ keeps the soft term's weight roughly constant when you change $T$, so $\lambda$ means the same thing across runs.

Continuing the example, give the student logits $(7.0,\ 6.0,\ 3.0,\ 3.0,\ 4.5,\ 0.0)$. It has the right top token but overrates "Lyon" and "Berlin":

| | Paris | Lyon | the | a | Berlin | banana |
| --- | --- | --- | --- | --- | --- | --- |
| student $q^T$ at $T = 2$ | 0.456 | 0.276 | 0.062 | 0.062 | 0.131 | 0.014 |
| gradient $(q^T - p^T)/T$ | −0.131 | +0.090 | −0.007 | +0.001 | +0.042 | +0.004 |

Gradient descent raises "Paris" and lowers "Lyon" and "Berlin" most strongly. Here $\mathrm{KL}(p^T\|q^T) = 0.184$ nats and the $T^2$-scaled term is 0.735. With hard labels only, the student would get the same push toward "Paris" but no signal at all about whether "Berlin" should sit above or below "the".

For a decoder-only LLM the same loss is applied at every position of a sequence, summed over the vocabulary and averaged over real (non-padding) tokens:

```python
import torch
import torch.nn.functional as F

def kd_loss(student_logits, teacher_logits, labels, T=2.0, lam=0.5, ignore_index=-100):
    """student_logits, teacher_logits: [batch, seq, vocab]; labels: [batch, seq]."""
    mask = labels != ignore_index                      # [batch, seq]
    s = student_logits[mask]                           # [tokens, vocab]
    t = teacher_logits[mask].detach()                  # the teacher is not trained

    # Hard-label term at T = 1.
    ce = F.cross_entropy(s, labels[mask])

    # Soft term: KL(p_T || q_T), summed over the vocabulary, averaged over tokens.
    # F.kl_div expects log-probabilities for the input and probabilities for the target.
    kl = F.kl_div(
        F.log_softmax(s / T, dim=-1),
        F.softmax(t / T, dim=-1),
        reduction="batchmean",
    )
    return (1 - lam) * ce + lam * (T ** 2) * kl
```

Two practical notes. Teacher and student must share a tokenizer for this token-by-token matching to make sense; cross-tokenizer distillation needs extra alignment machinery. And storing full teacher distributions is heavy (vocab × tokens), so pipelines often keep only the teacher's top-k logits per position and renormalize.

## What can be transferred

- **Output distributions** (Hinton et al., 2015): the setup above. DistilBERT (Sanh et al., 2019) combined it with the masked-LM loss and a cosine loss on hidden states, initialized the student from every other teacher layer, and kept about 97% of BERT's GLUE score with 40% fewer parameters and 60% faster inference.
- **Hidden states** (FitNets, Romero et al., 2015): the student regresses onto intermediate teacher activations through a learned projection, since the widths usually differ.
- **Attention maps** (Zagoruyko and Komodakis, 2017): match *where* the two models attend.
- **Token-level KD on sequences**: under teacher forcing, match the teacher's next-token distribution at every position of the training text. Meta reports using Llama 3.1 8B and 70B logits as token-level targets for Llama 3.2 1B and 3B, and Gemma 2's 2B and 9B models were trained by distillation from a larger teacher. NVIDIA's Minitron models prune a trained model first, then recover quality by distilling from the unpruned original.
- **Sequence-level KD** (Kim and Rush, 2016): let the teacher *generate* outputs and train the student on them with ordinary cross-entropy. No logits are needed, so it works through an API. DeepSeek-R1-Distill is this kind: Qwen and Llama models were fine-tuned on about 800k samples generated by R1, including the long chains of thought.

## Forward vs. reverse KL

The loss above uses **forward KL**, $\mathrm{KL}(p\,\|\,q) = \sum_i p_i \log (p_i/q_i)$. It is heavily penalized wherever the teacher has mass and the student doesn't, so it is *mass-covering*: the student spreads probability over everything the teacher considers plausible. A small student that can't represent every mode ends up putting mass in the gaps between them, which for generation means sampling text that the teacher itself would rarely produce.

**Reverse KL**, $\mathrm{KL}(q\,\|\,p)$, is heavily penalized wherever the *student* puts mass that the teacher doesn't, so it is *mode-seeking*: the student concentrates on a subset of the teacher's high-probability outputs. MiniLLM (Gu et al., 2024) argues this is the better fit for generative students; the cost is lower diversity and possibly dropped modes.

In the example, forward KL at $T = 1$ is 0.28 nats and reverse KL is 0.57, because the student puts 25% on "Lyon" where the teacher has 2%. Reverse KL punishes exactly that overreach. Which one to minimize is a modeling decision, and there are intermediate choices (Jensen–Shannon, skew KL) for anyone who wants neither extreme.

## On-policy distillation

Token-level KD on a fixed corpus has a train–test mismatch: the student learns from prefixes written by humans or the teacher, then at inference it conditions on its own, slightly wrong prefixes, and errors compound. **On-policy distillation** (GKD, Agarwal et al., 2024; MiniLLM uses a related idea) samples sequences from the *student*, has the teacher score every position, and trains on the divergence along the student's own trajectories. It costs a teacher forward pass per student sample, but it targets the states the student will actually visit.

## Distillation vs. pruning and quantization

Pruning and quantization compress one existing model. Distillation trains a *different*, usually smaller model with the teacher as the training signal. They combine well: Minitron prunes then distills, and a distilled model can be quantized afterwards (GPTQ, AWQ) for serving.

## Why it helps at small scale

Every training token carries a full distribution instead of a single correct token, so the student gets far more bits of supervision per token, and the teacher's distribution is smoother than the empirical one. That is why distilled small models can beat same-size models trained from scratch on the same token budget, which is the argument made in the Gemma 2 report. The cost is that the student inherits the teacher's blind spots and errors, and it can never exceed the teacher on whatever the teacher gets wrong.

## Evaluation is the hard part

A low distillation loss does not mean behavioral equivalence. The KL is averaged over the training distribution, so a student can match the teacher well on average and still diverge on rare, important cases: long contexts, multi-step reasoning, refusals, tool use. Useful checks are held-out KL on real user-like prompts (not just the training mix), task benchmarks, side-by-side preference evaluations, and agreement rate with the teacher's own outputs. "Behaves like the teacher" is an empirical claim, not a loss value.

## Open questions

- How much teacher capability survives at 1B vs. 3B vs. 7B parameters, per task family
- Forward vs. reverse KL vs. on-policy for long-form generation, and how temperature interacts with long-horizon coherence
- When sequence-level distillation on teacher traces loses to training on curated real data, especially for math and code where traces can be confidently wrong
