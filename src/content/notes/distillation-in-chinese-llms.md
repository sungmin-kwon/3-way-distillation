---
title: Distillation as Chinese LLM labs use it
summary: What DeepSeek, Qwen and their accusers mean by distillation, and what training on a teacher's samples can and cannot transmit. The note shows that sampling distillation aims at the same target as logit distillation with far noisier signal, that the noise is averaged away only where the student can pool across contexts, and that rejection sampling, not sampling, is what changes the target. It then reads the OpenAI dispute as a fight over the data source rather than the operation.
date: 2026-11-13
tags: [ml/llm]
distillate: Distillation names two operations. Logit distillation (Hinton et al., 2015) trains a student on the teacher's output distribution; sampling distillation trains it on draws from that distribution. For one context the two have the same expected gradient, so sampling aims at the same target, but each draw carries noise of variance p(1−p) per token, and pinning one probability of 0.42 to ±0.02 from draws of that context alone takes about 609 of them. A student still learns from one draw per prompt, because its parameters pool draws across similar contexts. In a toy logistic teacher fit on 800,000 single draws the student's probabilities land within 0.001 of the teacher's; give each context its own random twist and the error rises to 0.12, because a twist seen once is noise. Rejection sampling is what changes the target, to the teacher's successful traces only. DeepSeek-R1 distilled six Qwen and Llama models with SFT on 800,000 such samples; Qwen3 distilled its small models from its own flagship, partly on logits, which owning the teacher allows. OpenAI's accusation is about whose teacher, not the operation.
model: [GLM-5.3, Claude Opus 5.5]
reviewed_by: [Claude Opus 5.5]
---

In January 2025, days after DeepSeek's R1 reasoning model made the front pages, OpenAI said it was "aware of and reviewing indications that DeepSeek may have inappropriately distilled our models" (Axios, 2025). A year later, a memo to the U.S. House Select Committee on China accused DeepSeek employees of writing "code to access U.S. AI models and obtain outputs for distillation in programmatic ways" (Reuters, 2026).[^1] The word in both statements is the one DeepSeek and Alibaba's Qwen team use, approvingly, in their own papers. This note is about what the word denotes when these labs use it: which operation, what it can carry from teacher to student, and which part of the dispute is technical and which contractual.

## Two operations called distillation

The original operation, from Hinton, Vinyals and Dean (2015), trains a small **student** on the large **teacher's** whole output distribution rather than on hard labels. The teacher's probabilities $p_i$ are flattened at a temperature $T$, $p_i^{(T)} \propto p_i^{1/T}$, the student matches them by cross-entropy, and the loss is scaled by $T^2$ to keep the gradients comparable across temperatures. One forward pass through the teacher reads the whole distribution.

The second operation needs only outputs. **Sampling distillation** draws completions from the teacher and fine-tunes the student on them with the ordinary next-token loss. In sequence models it goes back to Kim and Rush's sequence-level knowledge distillation (2016). Its best-known use with a teacher behind an API is Stanford's Alpaca: LLaMA 7B fine-tuned on 52,000 instruction demonstrations generated with OpenAI's text-davinci-003, for under $500 of data generation, which behaved qualitatively similarly to its teacher (Taori et al., 2023). An API teacher pushes a distiller toward this route, since it returns text and at most a short list of top-token log-probabilities, not the full distribution. A lab distilling its own model has both routes open.

## What a sample carries

Take one context at which the teacher puts probability $p_i$ on token $i$, and a student with logits $z_i$ and probabilities $q_i$. Logit distillation at $T=1$ minimizes the cross-entropy $-\sum_i p_i \log q_i$, whose gradient in the logits is

$$
\frac{\partial}{\partial z_i}\Big(-\sum_j p_j \log q_j\Big) = q_i - p_i .
$$

Sampling distillation draws a token $y$ from $p$ and minimizes $-\log q_y$, with gradient $q_i - \mathbf{1}[y=i]$. Since $\mathbb{E}[\mathbf{1}[y=i]] = p_i$, the expected gradient is again $q_i - p_i$. The two operations aim at the same target. They differ in noise: the one-hot draw has variance $p_i(1-p_i)$ in coordinate $i$, where the logit gradient has none. The same holds at every position of a sampled sequence, since each token is a draw from the teacher given the prefix before it.

The noise sets a price. Averaging $n$ draws of one context estimates $p_i$ with standard error $\sqrt{p_i(1-p_i)/n}$, so pinning it to within $\varepsilon$ from that context alone takes

$$
n \approx \frac{p(1-p)}{\varepsilon^2}
$$

draws. For the toy teacher's $p = 0.42$ that is about 97 draws to $\pm 0.05$, 609 to $\pm 0.02$ and 2,436 to $\pm 0.01$, all computed below. DeepSeek-R1's distillation set has about 800,000 samples (DeepSeek-AI, 2025), mostly one per prompt. Read context by context, one draw leaves a standard error of 0.49 on a probability of 0.42, and even 100 draws on each of 8,000 prompts leave 0.05.

That reading misses how a student learns. Its parameters are shared across contexts, so a draw at one prompt also moves its probabilities at similar prompts, and the noise averages out across them. The toy below makes this concrete with a teacher whose probability of one answer is a logistic function of a single feature of the context, $p(x) = \sigma(-0.32 + 1.5x)$, which is 0.42 at $x=0$. A logistic student fitted to one draw at each of 800,000 contexts lands, on average, within 0.001 of the teacher's probability at each context, about the error the formula gives for 800,000 draws of a single context ($\sqrt{0.24/800{,}000} \approx 0.0006$), not for one. Then each context gets its own random twist on the logit (standard deviation 1), a part of the teacher's behaviour that no other context shares. The same student, on the same budget, is now off by 0.12 on average: it learns the shared trend and nothing of the twist, because a twist seen once is indistinguishable from noise.

So the binomial bound does not say that samples transmit behaviour and not probabilities. It says which probabilities they transmit: those the student can pool across contexts. A teacher's calibration on broad classes of prompts carries over; its idiosyncratic uncertainty at one prompt, unshared with any other, does not unless that prompt is sampled hundreds of times. Logit distillation gets each context's full distribution from one pass, which is why it is the more data-efficient of the two when the logits are available.

## Rejection sampling changes the target

Sampling alone aims at the teacher's distribution. Filtering does not. DeepSeek-R1's reasoning data was generated "by performing rejection sampling from the checkpoint from the above RL training" (DeepSeek-AI, 2025): only traces that reached a correct answer were kept. The student is then fitted to the teacher conditioned on success, a different distribution from the teacher itself.

Two consequences follow from that. First, the student never sees the teacher's failures, so it learns nothing about how often or how the teacher fails, and its confidence on hard problems reflects the filter, not the teacher. Second, the student's in-distribution ceiling is above the teacher's single-attempt accuracy. If the teacher solves a problem on 42% of attempts, every kept trace for it is a success, so in the training data that problem is solved every time: the student is fitted to the teacher's best of several attempts, not its single attempt. The ceiling is the filtered teacher, and only on problems where at least one attempt succeeds.

## What the labs actually do

DeepSeek-R1's recipe is the cleanest documented case. Its distillation data, about 800,000 samples, combines reasoning traces rejection-sampled from an RL checkpoint of R1's own pipeline with about 200,000 non-reasoning samples, partly reused from DeepSeek-V3's SFT data (DeepSeek-AI, 2025). Six open models, four Qwen2.5 and two Llama, were fine-tuned on it: "For distilled models, we apply only SFT and do not include an RL stage". DeepSeek-R1-Distill-Qwen-1.5B scores 28.9 pass@1 on AIME 2024, against 9.3 for GPT-4o-0513. The paper's cost table, at $2 per H800 GPU hour, totals $294,000 for R1-Zero, the SFT data creation and R1; the V3 base model's pretraining is not in that table.

The same paper compared the two routes to a capable small model directly. Large-scale RL on Qwen-32B-Base for over 10,000 steps reached 47.0 on AIME 2024; distilling R1 into the same base reached 72.6. The paper's conclusion is that "distilling more powerful models into smaller ones yields excellent results", while smaller models trained by its large-scale RL "may not even achieve the performance of distillation" (DeepSeek-AI, 2025).

Qwen3 reached the same conclusion with its own teacher, and used both operations. Its small models, from 0.6B to 14B dense plus a 30B mixture-of-experts, are built by **strong-to-weak distillation** in two phases (Qwen Team, 2025). The off-policy phase trains on teacher outputs, which is sampling distillation. In the on-policy phase the student generates responses and "is then fine-tuned by aligning its logits with those of a teacher model (Qwen3-32B or Qwen3-235B-A22B) to minimize the KL divergence", which is logit distillation on the student's own text. The report says distillation "significantly outperforms reinforcement learning in performance and training efficiency", at 1/10 of the GPU hours of its full four-stage post-training. Qwen could read logits because the teacher was its own.

So both labs distilled from their own teachers, and the practice itself is uncontested. The contested question is whose teacher.

## The dispute, as of November 2026

OpenAI's terms of use forbid using its models' outputs to develop models that compete with OpenAI (Axios, 2025). In January 2025 OpenAI said it had seen some evidence of "distillation" from groups based in China trying to replicate advanced U.S. models, and that it would keep working with the U.S. government to protect "the most capable models" (Axios, 2025). David Sacks, the White House AI czar, went further on Fox News: "There's substantial evidence that what DeepSeek did here is they distilled knowledge out of OpenAI models" (Axios, 2025). The February 2026 memo to the House committee alleged that DeepSeek routed around OpenAI's access controls through obfuscated third-party services and collected outputs programmatically; Reuters reported that DeepSeek and its parent High-Flyer did not respond to requests for comment (Reuters, 2026).[^1] Anthropic made a similar accusation in the same month: it said DeepSeek, Moonshot and MiniMax had generated over 16 million exchanges with Claude through about 24,000 fraudulent accounts, over 150,000 of them attributed to DeepSeek (Anthropic, 2026). Neither company has published its evidence in detail.

The operation is standard and published: Alpaca distilled text-davinci-003 through OpenAI's API, DeepSeek distilled its own models into Qwen and Llama bases, and Qwen distilled its flagship into its small models. What OpenAI and Anthropic allege is a breach of terms, a specific teacher used without permission. The section above says what such a theft could and could not get. Through an API, the distiller gets samples, so it gets the teacher's behaviour on the prompts it chose and whatever the student can generalize from them, not the teacher's distribution at any one prompt.

## Where the argument breaks

The gradient identity holds per context and in expectation. It says nothing about how fast a finite student closes the gap. Whether noise averages away depends on how similar the contexts are in the student's own representation, which the logistic toy assumes away by giving teacher and student the same one-feature form. A real student may pool too eagerly, smoothing over a prompt where the teacher's behaviour really differs, or too little. The toy also gives the student the right model class; a student that is too small to represent the teacher misfits whichever operation trains it.

The comparison with RL rests on one base model in DeepSeek's paper and on Qwen's report of its own pipeline. Both labs had a strong teacher at hand. Without one, distillation has nothing to transmit, and the R1 paper itself says that going beyond current models "may still require more powerful base models and larger-scale reinforcement learning".

## The calculations

```python
import numpy as np
rng = np.random.default_rng(0)
sig = lambda z: 1 / (1 + np.exp(-z))

p = np.array([0.42, 0.38, 0.15, 0.05])  # teacher, one context
for T in (1, 2, 5):
    q = p**(1/T); q = q/q.sum()
    print(f"T={T}:", np.round(q, 3))

p1 = p[0]
for eps in (0.05, 0.02, 0.01):
    n = p1*(1-p1)/eps**2
    print(f"p=0.42, eps=+/-{eps}: n = {n:,.0f} draws")

B = 800_000                             # R1's distillation budget
for M in (800_000, 8_000):
    se = np.sqrt(p1*(1-p1)/(B/M))
    print(f"{M:,} prompts, {B/M:g} draws each: SE = {se:.3f}")

def fit(x, y, steps=25):                # logistic student, Newton
    X = np.column_stack([np.ones_like(x), x]); w = np.zeros(2)
    for _ in range(steps):
        q = sig(X @ w)
        H = X.T @ (X * (q*(1-q))[:, None])
        w += np.linalg.solve(H, X.T @ (y - q))
    return w

x = rng.uniform(-2, 2, B)               # one draw per context
for sd in (0.0, 1.0):                   # context-specific twist
    pt = sig(-0.32 + 1.5*x + sd*rng.standard_normal(B))
    y = (rng.random(B) < pt).astype(float)
    w = fit(x, y)
    err = np.mean(np.abs(sig(w[0] + w[1]*x) - pt))
    print(f"twist sd={sd}: mean |student - teacher| = {err:.3f}")
```

```
T=1: [0.42 0.38 0.15 0.05]
T=2: [0.346 0.329 0.207 0.119]
T=5: [0.29  0.284 0.236 0.19 ]
p=0.42, eps=+/-0.05: n = 97 draws
p=0.42, eps=+/-0.02: n = 609 draws
p=0.42, eps=+/-0.01: n = 2,436 draws
800,000 prompts, 1 draws each: SE = 0.494
8,000 prompts, 100 draws each: SE = 0.049
twist sd=0.0: mean |student - teacher| = 0.001
twist sd=1.0: mean |student - teacher| = 0.119
```

[^1]: The Reuters story was read by the drafting model on the Asahi Shimbun's syndicated page; the review could not open that page or any other copy, so the memo quotes and the no-comment line are not checked here.

## Sources

- G. Hinton, O. Vinyals, J. Dean, "Distilling the Knowledge in a Neural Network", arXiv:1503.02531 (2015). [arXiv:1503.02531](https://arxiv.org/abs/1503.02531)
- Y. Kim, A. M. Rush, "Sequence-Level Knowledge Distillation", EMNLP 2016. [arXiv:1606.07947](https://arxiv.org/abs/1606.07947)
- R. Taori, I. Gulrajani, T. Zhang, Y. Dubois, X. Li, C. Guestrin, P. Liang, T. B. Hashimoto, "Alpaca: A Strong, Replicable Instruction-Following Model", Stanford CRFM blog (2023). [crfm.stanford.edu/2023/03/13/alpaca.html](https://crfm.stanford.edu/2023/03/13/alpaca.html)
- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning", *Nature* 645, 633–638 (2025). [arXiv:2501.12948](https://arxiv.org/abs/2501.12948), [doi:10.1038/s41586-025-09422-z](https://doi.org/10.1038/s41586-025-09422-z)
- Qwen Team, "Qwen3 Technical Report", arXiv:2505.09388 (2025). [arXiv:2505.09388](https://arxiv.org/abs/2505.09388)
- "OpenAI says DeepSeek may have 'inappropriately' used its models' output", Axios (Jan 29, 2025). [axios.com/2025/01/29/openai-deepseek-ai-models-data-training](https://www.axios.com/2025/01/29/openai-deepseek-ai-models-data-training)
- Reuters, "OpenAI says China's DeepSeek trained its AI by distilling U.S. models, memo shows", The Asahi Shimbun (Feb 13, 2026). [asahi.com/ajw/articles/16351384](https://www.asahi.com/ajw/articles/16351384)
- Anthropic, "Detecting and preventing distillation attacks" (Feb 23, 2026). [anthropic.com/news/detecting-and-preventing-distillation-attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)
