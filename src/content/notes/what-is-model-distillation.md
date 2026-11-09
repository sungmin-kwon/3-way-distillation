---
title: What is model distillation?
summary: Knowledge distillation for LLMs, formally — soft targets, temperature scaling, the composite loss, what gets transferred, forward vs. reverse KL, and why evaluation is the hard part.
date: 2026-11-09
tags: [model]
distillate: A small student model is trained to match a large teacher's whole output distribution, not just its answers. Writing the loss is easy; knowing whether the student really behaves like the teacher is the hard part.
---

Large language models are powerful but expensive: hundreds of billions of parameters, slow decoding, real serving cost. **Knowledge distillation** trains a small *student* model $q_\theta$ to imitate a large *teacher* model $p$ — similar behavior at a fraction of the parameters.

## The formal setup

For an input $x$ with true label $y$, the teacher defines a distribution over the whole vocabulary, $p(\cdot \mid x)$. With temperature $T$, the softened distribution is

$$
p_i^T = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}
$$

where $z_i$ are the teacher's logits. As $T \to 1$ this approaches the hard argmax; as $T \to \infty$ it approaches uniform. The student is trained on the composite loss

$$
L = (1-\lambda)\,\mathrm{CE}(y, q_\theta) + \lambda\, T^2\, \mathrm{KL}\bigl(p^T \,\big\|\, q_\theta^T\bigr)
$$

The $T^2$ factor compensates for the gradient shrinkage that softening causes (gradients of the KL term scale roughly as $1/T^2$), keeping its effective weight stable. $\lambda$ balances fidelity to the ground-truth label against fidelity to the teacher.

```python
import torch
import torch.nn.functional as F

def soft_targets(logits: torch.Tensor, temperature: float = 2.0) -> torch.Tensor:
    return F.softmax(logits / temperature, dim=-1)
```

The KL term is where the "dark knowledge" lives: the teacher's relative probabilities over *wrong* tokens encode how it generalizes — e.g., that "king" is closer to "queen" than to "potato".

## What can be transferred

- **Logits / soft targets** (Hinton et al., 2015): the classic setup above. DistilBERT reached ~97% of BERT's performance with 40% fewer parameters and 60% faster inference this way.
- **Hidden states** (FitNets, 2015): the student regresses onto intermediate teacher activations, not just the output layer.
- **Attention maps** (Zagoruyko & Komodakis, 2017): match *where* the two models attend.
- **Full sequences** (sequence-level KD): for decoder-only LLMs, match the teacher's next-token distribution at *every* position under teacher forcing. This is how most open small models (TinyLlama, MiniCPM, the small Qwen and Phi variants) are trained. Distilling reasoning traces from reasoning models (e.g., DeepSeek-R1 → Qwen/Llama) is a special case where the "sequence" includes chain-of-thought.

## Forward vs. reverse KL

Forward KL, $\mathrm{KL}(p \,\|\, q)$, is *mean-seeking*: the student covers all of the teacher's modes and averages where the teacher is uncertain — safe for classification, risky for generation, since it can produce bland or hallucinated text in the gaps. Reverse KL, $\mathrm{KL}(q \,\|\, p)$ as in MiniLLM, is *mode-seeking*: the student commits to one high-probability mode — sharper output, but it can drop modes entirely. The choice is a modeling decision, not an implementation detail.

## Distillation vs. pruning and quantization

Pruning and quantization compress one fixed model. Distillation *trains a new, smaller architecture from scratch* with the teacher acting as the loss. The two compose: distill to a small architecture first, then quantize (AWQ, GPTQ) or prune further.

## Why distillation beats from-scratch training at small scale

A 7B student distilled from a strong teacher often beats a 7B model trained from scratch on the same compute budget, because the teacher's outputs are denser supervision than raw text: every token carries a full distribution, and synthetic teacher-generated data can be filtered and deduplicated for quality. The cost is distributional — the student inherits the teacher's blind spots and can degrade on inputs outside the teacher's output distribution.

## Evaluation is the hard part

A low KL loss does not imply behavioral equivalence. Serious pipelines measure held-out KL to the teacher, task benchmarks (MMLU, HumanEval, …), human preference evals, and robustness to the distribution shift between teacher-generated training data and real user queries. "Behaves like the teacher" is an empirical claim, not a loss value.

## Open questions I want to work through

- How much teacher capability survives at 1B vs. 3B vs. 7B parameters, per task family
- Token-level vs. sequence-level losses for decoder-only models, and the effect of temperature on long-horizon coherence
- When distillation loses to from-scratch training on real (non-synthetic) data — math and code, where teacher-generated traces may be noisier than curated data
