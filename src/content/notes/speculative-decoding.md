---
title: Speculative decoding
summary: How a small draft model speeds up a large one without changing its output, worked through on the same next-token example as the distillation note — the accept/reject rule, why it is exact, acceptance as one minus total variation, expected speedup, and why a distilled draft helps.
date: 2026-11-10
tags: [ml/llm]
distillate: A cheap draft model proposes several tokens, and the large target model checks them all in one forward pass, accepting each with probability min(1, p/q) and resampling from the leftover distribution on the first rejection, so the output follows the target's distribution exactly. In the six-token example the draft is accepted 71.1% of the time, and with 4 drafted tokens and a draft costing 5% of the target that gives 2.83 tokens per target pass and a 2.36× speedup. The gain depends entirely on how closely the draft matches the target and on decoding being memory-bound, so it shrinks at large batch sizes.
model: [Claude Opus 5.5]
---

Generating text from a large language model is slow for a mechanical reason: each new token needs a full forward pass, and at small batch sizes that pass is limited by reading the weights from memory, not by arithmetic. Checking several tokens in one pass costs about the same as producing one. **Speculative decoding** uses that slack: a small *draft* model guesses a few tokens ahead, and the large *target* model verifies them in parallel. Leviathan, Kalman and Matias (2023) and Chen et al. (2023, under the name *speculative sampling*) published the method independently; Stern, Shazeer and Uszkoreit's blockwise parallel decoding (2018) did the greedy version earlier.[^papers]

It is the natural partner of [model distillation](note:what-is-model-distillation). Distillation replaces the big model with a small one and accepts some loss of quality. Speculative decoding keeps the big model's output distribution exactly and uses the small one only to save time. The better the small model imitates the big one, the more time it saves.

Throughout, the note uses the next-token example from the distillation note, sampled at temperature 1, with the teacher as the target and the undistilled student as the draft:

| | value |
| --- | --- |
| prompt | *"The capital of France is"* |
| candidate tokens | Paris, Lyon, the, a, Berlin, banana |
| target logits | 9.0, 5.0, 4.5, 4.0, 3.5, −1.0 |
| draft logits | 7.0, 6.0, 3.0, 3.0, 4.5, 0.0 |
| tokens drafted per step $\gamma$ | 4 |
| draft cost per token, relative to target $c$ | 0.05 |

## The two distributions

Write $p$ for the target's next-token distribution and $q$ for the draft's. Taking the softmax of the logits above:

| | Paris | Lyon | the | a | Berlin | banana |
| --- | --- | --- | --- | --- | --- | --- |
| target $p$ | 0.961 | 0.018 | 0.011 | 0.006 | 0.004 | 0.000 |
| draft $q$ | 0.672 | 0.247 | 0.012 | 0.012 | 0.055 | 0.001 |

The draft agrees on the top token but puts a quarter of its mass on "Lyon" and 5.5% on "Berlin", where the target has 1.8% and 0.4%.

## The accept/reject rule

The draft samples a token $x \sim q$. The target then accepts it with probability

$$
\min\!\left(1,\ \frac{p(x)}{q(x)}\right)
$$

If the draft *underrates* $x$ ($q(x) \le p(x)$), it is always accepted. If the draft *overrates* $x$, it is accepted only in proportion to how much the target agrees. On rejection, a replacement is drawn from the **residual distribution**

$$
r(x) = \frac{\max\bigl(0,\ p(x) - q(x)\bigr)}{\sum_{x'} \max\bigl(0,\ p(x') - q(x')\bigr)}
$$

which puts mass only where the target wants more than the draft gave.

In the example the acceptance probabilities are 1 for "Paris" (the draft underrates it), 0.867 for "the", 0.526 for "a", and 0.071 for "Lyon", "Berlin" and "banana". Every token except "Paris" has $q > p$, so the residual is entirely on "Paris": whenever a draft token is rejected, the target puts "Paris" in its place.

## Why the output is exact

The probability of emitting a token $x$ is the chance the draft proposes and the target accepts it, plus the chance of any rejection followed by drawing $x$ from the residual. The first part is $q(x)\min(1, p(x)/q(x)) = \min(p(x), q(x))$. The total rejection probability is $1 - \sum_{x'} \min(p(x'), q(x'))$, which equals $\sum_{x'} \max(0,\ p(x') - q(x'))$, the residual's normalizer. So

$$
P(\text{emit } x) = \min\bigl(p(x), q(x)\bigr) + \max\bigl(0,\ p(x) - q(x)\bigr) = p(x)
$$

for every $x$. The text is distributed exactly as if the target had generated it alone, which is what makes the method lossless. With greedy decoding the rule reduces to: accept the draft token if it is the target's argmax.

A short simulation confirms it:

```python
import numpy as np

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def speculative_step(p, q, rng):
    """One draft token from q, verified against p. Returns the emitted token."""
    x = rng.choice(len(q), p=q)                  # draft proposes x ~ q
    if rng.random() < min(1.0, p[x] / q[x]):     # accept with prob min(1, p/q)
        return x
    r = np.maximum(p - q, 0.0)                   # on rejection, resample from
    return rng.choice(len(p), p=r / r.sum())     # the normalized residual

p = softmax(np.array([9.0, 5.0, 4.5, 4.0, 3.5, -1.0]))   # target
q = softmax(np.array([7.0, 6.0, 3.0, 3.0, 4.5, 0.0]))    # draft

rng = np.random.default_rng(0)
n = 200_000
counts = np.bincount([speculative_step(p, q, rng) for _ in range(n)], minlength=6)
print("target p:  ", p.round(3))
print("empirical: ", (counts / n).round(3))
print("acceptance:", np.minimum(p, q).sum().round(3))
```

The empirical frequencies match $p$ to within sampling noise, even though only 71.1% of the draft's proposals survive.

## Acceptance is one minus total variation

The probability that a draft token is accepted is

$$
\beta = \sum_x \min\bigl(p(x), q(x)\bigr) = 1 - \mathrm{TV}(p, q)
$$

where $\mathrm{TV}(p, q) = \tfrac12 \sum_x |p(x) - q(x)|$ is the total variation distance. In the example $\beta = 0.711$ and $\mathrm{TV} = 0.289$. This is the single number that decides how much the method saves, and it is a direct measure of how well the draft imitates the target at that position.

## Several tokens per step

In practice the draft proposes $\gamma$ tokens in a row, and the target scores all $\gamma + 1$ positions in one forward pass. Tokens are checked left to right; at the first rejection the rest are thrown away and one token is drawn from the residual. If all $\gamma$ are accepted, the target's last position gives one extra token for free. Each step therefore yields between 1 and $\gamma + 1$ tokens.

Leviathan et al. model this with the simplifying assumption that each token is accepted independently with the same probability $\alpha$, the average of $\beta$ over positions. The expected number of tokens per target pass is then

$$
\mathbb{E}[\text{tokens}] = \frac{1 - \alpha^{\gamma+1}}{1 - \alpha}
$$

and, if one draft forward pass costs $c$ times a target pass, the expected speedup in wall-clock time is

$$
S = \frac{1 - \alpha^{\gamma+1}}{(1 - \alpha)(\gamma c + 1)}
$$

Taking $\alpha = 0.711$ from the example, with $\gamma = 4$ and $c = 0.05$:

$$
\mathbb{E}[\text{tokens}] = \frac{1 - 0.711^{5}}{0.289} = 2.83,
\qquad
S = \frac{2.83}{1 + 4 \times 0.05} = 2.36
$$

Drafting more tokens has diminishing returns, because a token at position $k$ only counts if all $k - 1$ before it were accepted. With the same $\alpha$ and $c$:

| $\gamma$ | tokens per target pass | speedup |
| --- | --- | --- |
| 1 | 1.71 | 1.63× |
| 2 | 2.22 | 2.02× |
| 4 | 2.83 | 2.36× |
| 6 | 3.14 | 2.42× |
| 8 | 3.30 | 2.36× |

The optimum here is $\gamma = 6$, but the curve is flat between 4 and 8. A better draft moves the optimum out and raises it a lot: at $\alpha = 0.9$ the speedup is still climbing at $\gamma = 10$, where it reaches 4.57×.

<svg viewBox="0 0 500 390" role="img" aria-label="Expected speedup against the number of drafted tokens gamma, from 0 to 10, for draft cost 0.05 and acceptance rates 0.6, 0.711 and 0.9. At 0.6 the speedup peaks at 1.92 at gamma 4; at 0.711 it peaks at 2.42 at gamma 6; at 0.9 it is still rising at gamma 10, reaching 4.57." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Expected speedup against drafted tokens for three acceptance rates</title>
  <rect x="64" y="36" width="400" height="300" fill="none" style="stroke: var(--rule)"/>
  <line x1="64" y1="261" x2="464" y2="261" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="186" x2="464" y2="186" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="111" x2="464" y2="111" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <text x="56" y="340" text-anchor="end" font-size="11" fill="currentColor">1×</text>
  <text x="56" y="265" text-anchor="end" font-size="11" fill="currentColor">2×</text>
  <text x="56" y="190" text-anchor="end" font-size="11" fill="currentColor">3×</text>
  <text x="56" y="115" text-anchor="end" font-size="11" fill="currentColor">4×</text>
  <text x="56" y="40" text-anchor="end" font-size="11" fill="currentColor">5×</text>
  <text x="64" y="354" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="144" y="354" text-anchor="middle" font-size="11" fill="currentColor">2</text>
  <text x="224" y="354" text-anchor="middle" font-size="11" fill="currentColor">4</text>
  <text x="304" y="354" text-anchor="middle" font-size="11" fill="currentColor">6</text>
  <text x="384" y="354" text-anchor="middle" font-size="11" fill="currentColor">8</text>
  <text x="464" y="354" text-anchor="middle" font-size="11" fill="currentColor">10</text>
  <text x="264" y="378" text-anchor="middle" font-size="12" fill="currentColor">γ, tokens drafted per step</text>
  <text transform="translate(20 186) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">expected speedup</text>
  <polyline points="64.0,336.0 104.0,296.7 144.0,277.4 184.0,269.1 224.0,266.9 264.0,268.0 304.0,270.8 344.0,274.4 384.0,278.4 424.0,282.5 464.0,286.5" fill="none" style="stroke: var(--muted)" stroke-width="1.75"/>
  <polyline points="64.0,336.0 104.0,288.8 144.0,259.9 184.0,243.0 224.0,234.0 264.0,230.2 304.0,229.7 344.0,231.3 384.0,234.2 424.0,237.9 464.0,242.1" fill="none" style="stroke: var(--accent)" stroke-width="2"/>
  <polyline points="64.0,336.0 104.0,275.3 144.0,226.2 184.0,186.7 224.0,155.1 264.0,129.9 304.0,110.0 344.0,94.6 384.0,82.8 424.0,74.1 464.0,67.9" fill="none" style="stroke: var(--ink)" stroke-width="1.75"/>
  <circle cx="224.0" cy="234.0" r="3.5" style="fill: var(--accent)"/>
  <text x="458" y="300" text-anchor="end" font-size="11" style="fill: var(--muted)">α = 0.6</text>
  <text x="458" y="256" text-anchor="end" font-size="11" style="fill: var(--accent)">α = 0.711 (example)</text>
  <text x="458" y="62" text-anchor="end" font-size="11" style="fill: var(--ink)">α = 0.9</text>
</svg>

*Expected speedup $S$ for a draft costing 5% of the target. The dot is the worked example: γ = 4, 2.36×. Each curve starts at 1× for γ = 0, which is plain decoding.*

The two published results fit this range. Leviathan et al. report 2–3× on T5-XXL, and Chen et al. report 2–2.5× on Chinchilla 70B in a distributed setup, both without any change to the outputs.[^speedups]

## Why a distilled draft helps

Since the speedup depends only on $\alpha$ and $c$, and $c$ is fixed once the draft's size is chosen, the way to go faster is to raise $\alpha$, which means making $q$ closer to $p$ in total variation. That is a distillation problem with an unusual target metric.

Ordinary forward-KL distillation already pushes in the right direction. Pinsker's inequality bounds total variation by the KL divergence:

$$
\mathrm{TV}(p, q) \le \sqrt{\tfrac12\,\mathrm{KL}(p \,\|\, q)}
$$

In the example $\mathrm{KL}(p\|q) = 0.28$ nats, so the bound is $\sqrt{0.14} = 0.374$, and the actual $\mathrm{TV}$ is 0.289. Driving the KL toward zero forces the acceptance rate toward 1. The bound is loose, though, so the divergence that gives the best student by quality is not necessarily the one that gives the best draft. DistillSpec (Zhou et al., 2024) trains the draft by distillation specifically for this job, on sequences the draft itself generates, and compares several divergences, including total variation directly. It reports 10–45% further speedups over speculative decoding with an undistilled draft,[^distillspec] and finds that the best divergence depends on the task and decoding strategy.

On-policy data matters here for the same reason as in the distillation note: the draft is only ever evaluated on prefixes it helped write, so those are the prefixes it should be trained on.

## What the draft can be

- **A smaller model from the same family**, which shares the tokenizer automatically. The draft and target must agree on the vocabulary, since the rule compares $p(x)$ and $q(x)$ token by token.
- **Extra heads on the target itself**, as in Medusa (Cai et al., 2024) and EAGLE (Li et al., 2024).[^heads] These predict several future tokens from the target's own hidden states, so there is no separate model to serve. Some of these variants relax the acceptance rule to accept more tokens, and then the output is no longer exactly the target's distribution.
- **No model at all**: copying a span from the prompt (useful for editing or retrieval-heavy tasks) is a draft with $c \approx 0$, accepted when the target would have produced the same text.

## Limits

The speedup comes from spare compute during memory-bound decoding. At large batch sizes the target's forward pass becomes compute-bound, verifying $\gamma + 1$ positions is no longer nearly free, and the gain shrinks or disappears. Serving systems that already batch heavily see less benefit than single-stream decoding.

The constant-$\alpha$ formula is an approximation. Real acceptance varies a lot by position: near 1 on boilerplate and predictable continuations, much lower on content words and at high sampling temperatures. The cost ratio $c$ is also not just the parameter ratio, since the draft has its own fixed overheads, and the draft's weights and KV cache take memory alongside the target's.

The method changes only latency, never quality. If the target is wrong, the output is wrong in exactly the same way, just sooner.

## Open questions

- How much of the acceptance rate distillation can buy for a 1B draft and a 70B target, and whether that varies more by task or by temperature
- How the speedup actually scales with batch size on one GPU, measured rather than modeled

[^papers]: Leviathan, Kalman and Matias, [Fast inference from transformers via speculative decoding](https://arxiv.org/abs/2211.17192), ICML 2023 (arXiv November 2022). Chen et al., [Accelerating large language model decoding with speculative sampling](https://arxiv.org/abs/2302.01318), arXiv February 2023. Stern, Shazeer and Uszkoreit, Blockwise parallel decoding for deep autoregressive models, NeurIPS 2018; Leviathan et al. note that it "only supports greedy decoding (temperature=0)".
[^speedups]: From the abstracts. Leviathan et al.: "a 2X-3X acceleration compared to the standard T5X implementation, with identical outputs." Chen et al.: "a 2-2.5x decoding speedup in a distributed setup, without compromising the sample quality."
[^distillspec]: Zhou et al., [DistillSpec: improving speculative decoding via knowledge distillation](https://arxiv.org/abs/2310.08461), arXiv October 2023. The abstract gives 10–45%; section 5.1 of the same paper says 10–46%.
[^heads]: Cai et al., [Medusa](https://arxiv.org/abs/2401.10774), ICML 2024; Li et al., [EAGLE](https://arxiv.org/abs/2401.15077), arXiv January 2024. Medusa's lossy variant is its "typical acceptance" scheme; Medusa with the standard rule is lossless.
