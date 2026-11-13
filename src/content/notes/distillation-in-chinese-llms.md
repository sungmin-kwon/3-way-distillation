---
title: Distillation as Chinese LLM labs use it
summary: What DeepSeek, Qwen and their accusers mean by distillation, and what the technique can and cannot transmit. The note separates Hinton's logit distillation from the sampling distillation the labs actually use, derives the sampling-error bound that makes the two different, and reads the OpenAI dispute as a fight over the data source rather than the operation.
date: 2026-11-13
tags: [ml/llm]
distillate: The word distillation names two different operations. Logit distillation (Hinton et al., 2015) trains a student on the teacher's full output distribution, softened by a temperature T whose T² gradient scaling keeps the loss comparable across T. Sampling distillation trains it on draws from that distribution, and a draw carries almost no distributional information; estimating one probability of 0.42 to within ±0.02 takes about 609 samples of the same context, so 800,000 samples spread over distinct prompts transmit the teacher's per-context behaviour, not its per-context probabilities. That is the operation the Chinese labs use and document. DeepSeek-R1 fine-tuned six open Qwen and Llama models on 800,000 of its own samples with SFT only, and Qwen3's small models are built by strong-to-weak distillation from its flagship at a tenth of the GPU hours, both labs reporting that distillation beats RL at small scale. OpenAI alleges DeepSeek distilled from OpenAI's models in violation of their terms; DeepSeek has not responded, and the dispute is about whose teacher, not about the operation, which OpenAI's own ecosystem pioneered on text-davinci-003 with Alpaca.
model: [GLM-5.3]
---

In January 2025, days after DeepSeek's R1 reasoning model made the front pages, OpenAI said it was "aware of and reviewing indications that DeepSeek may have inappropriately distilled our models" (Axios, 2025). A year later, a memo to the U.S. House Select Committee accused DeepSeek employees of writing "code to access U.S. AI models and obtain outputs for distillation in programmatic ways" (Reuters, 2026). The word in both statements is the same one DeepSeek and Alibaba's Qwen team use, approvingly, in their own papers. This note is about what the word actually denotes when these labs use it: which operation it is, what it can transmit from teacher to student, and which part of the resulting dispute is technical and which is contractual.

## Two operations called distillation

The original operation, from Hinton, Vinyals and Dean (2015), trains a small **student** on the large **teacher's** whole output distribution rather than on hard labels. The teacher's probabilities $p_i$ are flattened at a temperature $T$, $p_i^{(T)} \propto p_i^{1/T}$, the student matches them by cross-entropy, and the loss is scaled by $T^2$ to keep the gradients comparable across temperatures. The construction exists because the softened distribution carries information the hard label throws away, and because one forward pass through the teacher reads all of it: every probability, exactly.

The second operation needs no logits, only outputs. **Sampling distillation** draws completions from the teacher and fine-tunes the student on the draws. It was demonstrated at Stanford, not in China: Alpaca was fine-tuned from LLaMA 7B on 52,000 instruction demonstrations generated from OpenAI's text-davinci-003, with data generation costing under $500, and behaved qualitatively similarly to its teacher (Taori et al., 2023). A closed model served over an API can be distilled only this way, since the API returns samples, not logits. Everything the Chinese labs document, and everything OpenAI alleges, is this second operation.

## What a sample can transmit

A draw from a distribution carries much less than the distribution. If the teacher, at one context, would emit token $a$ with probability $p$, then $n$ independent samples estimate $p$ with standard error $\sqrt{p(1-p)/n}$; to pin $p$ down to within $\varepsilon$ takes

$$
n \approx \frac{p(1-p)}{\varepsilon^2}
$$

samples of that same context. For the toy teacher's $p = 0.42$ that is about 97 samples to $\pm 0.05$, 609 to $\pm 0.02$, and 2,436 to $\pm 0.01$, all computed below. Logit distillation gets the same number to full precision in one call.

A real distillation budget cannot pay that price per context. DeepSeek-R1's distillation dataset is 800,000 samples (DeepSeek-AI, 2025). If each of 800,000 prompts appears once, the student sees a single draw per context and learns nothing about any per-context probability beyond that draw; even 100 draws per prompt, which would use the whole budget on 8,000 prompts, leaves a standard error of about 0.05 on a probability of 0.42. So sampling distillation transmits the teacher's typical behaviour, prompt by prompt, and leaves its per-context uncertainty behind. Two consequences follow, and both show up in the labs' recipes.

First, the data is filtered, which narrows what is transmitted further. DeepSeek-R1's reasoning data was generated "by performing rejection sampling" from an intermediate checkpoint (DeepSeek-AI, 2025): the student sees the teacher's successful traces and never its failures. That is the right choice for verifiable domains like mathematics and code, where the student needs the mode of the teacher's behaviour and nothing else, and the R1 paper reports that models distilled this way "consistently outperform those trained directly on human-generated data".

Second, the student's ceiling is the teacher. On the distillation data the student can at best match what the teacher drew, and reinforcement learning does not have that ceiling, which is the trade the labs navigate explicitly.

## What the labs actually do

DeepSeek-R1's recipe is the cleanest documented case. The teacher is R1 itself, a model trained by reinforcement learning from the DeepSeek-V3 base. From it, the team fine-tuned six open-source base models, four from Qwen and two from Llama, on the 800,000 samples, with supervised fine-tuning only: "For distilled models, we apply only SFT and do not include an RL stage" (DeepSeek-AI, 2025). The results: DeepSeek-R1-Distill-Qwen-1.5B scores 28.9 pass@1 on AIME 2024 against GPT-4o-0513's 9.3, and the distilled series beats the same bases trained on human data. The paper's cost table totals $294,000 for the reinforcement-learning pipeline that produced the teacher, R1-Zero and R1 together, plus the SFT data; the V3 base model's pretraining is not part of that table.

The same paper explains why the students were distilled rather than trained the hard way: reinforcement learning from a base model "is highly dependent on the underlying model capacity". A 7B dense model and a 16B mixture-of-experts model "consistently failed to yield meaningful improvements" under R1's RL, collapsing into repetition; the gains appeared at 32B and above (DeepSeek-AI, 2025). Below that line, the cheap route to a capable small model is a teacher that already reasoned.

Qwen3 reached the same conclusion with its own teacher. Its small models, from 0.6B to 14B dense plus a 30B mixture-of-experts, are built by **strong-to-weak distillation** from the flagship, in two phases: an off-policy phase on teacher outputs, then an on-policy phase in which the student generates and is corrected against the teacher (Qwen Team, 2025). The report claims distillation "significantly outperforms reinforcement learning in performance and training efficiency", at about one tenth of the GPU hours of the full four-stage post-training, and that distilling teacher logits directly worked in preliminary experiments. Qwen3-1.7B outscores DeepSeek-R1-Distill-Qwen-1.5B on the report's general benchmarks, 73.9 against 45.4 on MMLU-Redux.

Both labs distilled from their own teachers, which is why the practice itself is uncontested. The contested question is whose teacher.

## The dispute, as of November 2026

OpenAI's terms of use forbid using its models' outputs "to develop models that compete with OpenAI". In January 2025 its spokesperson said it had evidence of "distillation" by groups in China replicating U.S. models, and that it would work with the U.S. government to protect "the most capable models" (Axios, 2025). David Sacks, the White House AI czar, went further on Fox News at the time: "There's substantial evidence that what DeepSeek did here is they distilled knowledge out of OpenAI models" (Axios, 2025). The February 2026 memo to the House committee alleged obfuscated third-party routing around OpenAI's access controls and programmatic collection of outputs (Reuters, 2026). DeepSeek has not publicly responded to these allegations, and neither side has published the evidence in detail; Reuters noted at the time that DeepSeek and its parent High-Flyer did not respond to requests for comment.

Two things are worth separating. The operation is standard, published, and used everywhere: Alpaca distilled text-davinci-003 through OpenAI's API, DeepSeek distilled its own R1 into Qwen and Llama bases, and Qwen distilled its flagship into its small models. What OpenAI alleges is a contract violation, a specific teacher used without permission. Axios's reporting also noted the irony that OpenAI faces its own lawsuits over training data from publishers, a fight about provenance rather than about the technique. A student trained on samples is also, in the strict sense above, a weaker copy: it inherits the teacher's typical behaviour and its ceiling, which is a reason a lab with a strong teacher of its own, like DeepSeek with R1, prefers it.

## Where the machinery breaks

Sampling distillation cannot transmit what a sample does not contain: the tails of the teacher's distribution, its calibration, its per-context uncertainty. A student distilled on rejection-sampled successes never sees the teacher's failure modes, and it inherits the base model's gaps along with the teacher's habits. The ceiling is the teacher on the distillation data, while RL can pass the teacher; the capacity floor runs the other way, since RL below roughly 32B failed in DeepSeek's experiments while distillation worked on a 1.5B base. Qwen's on-policy phase is a partial fix for the mismatch, scoring the student's own generations instead of the teacher's. And the whole pipeline is only as clean as the teacher: whatever the teacher gets wrong in its typical behaviour, the student learns to reproduce.

## The calculations

```python
import numpy as np

p = np.array([0.42, 0.38, 0.15, 0.05])   # teacher over 4 next-tokens, one context
for T in (1, 2, 5):
    q = p**(1/T); q = q/q.sum()
    print(f"T={T}:", np.round(q, 3))

p1 = p[0]
for eps in (0.05, 0.02, 0.01):
    print(f"p=0.42, eps=+/-{eps}: n = {p1*(1-p1)/eps**2:,.0f} samples")

B = 800_000                                # DeepSeek-R1's distillation budget
for M in (800_000, 8_000):
    se = np.sqrt(p1*(1-p1)/(B/M))
    print(f"{M:,} prompts, {B/M:g} draws each: SE on p=0.42 = {se:.3f}")
```

```
T=1: [0.42  0.38  0.15  0.05]
T=2: [0.346 0.329 0.207 0.119]
T=5: [0.29  0.284 0.236 0.19 ]
p=0.42, eps=+/-0.05: n = 97 samples
p=0.42, eps=+/-0.02: n = 609 samples
p=0.42, eps=+/-0.01: n = 2,436 samples
800,000 prompts, 1 draws each: SE on p=0.42 = 0.494
8,000 prompts, 100 draws each: SE on p=0.42 = 0.049
```

## Sources

- G. Hinton, O. Vinyals, J. Dean, "Distilling the Knowledge in a Neural Network", arXiv:1503.02531 (2015). [arXiv:1503.02531](https://arxiv.org/abs/1503.02531)
- R. Taori, I. Gulrajani, T. Zhang, Y. Dubois, X. Li, C. Guestrin, P. Liang, T. B. Hashimoto, "Alpaca: A Strong, Replicable Instruction-Following Model", Stanford CRFM blog (2023). [crfm.stanford.edu/2023/03/13/alpaca.html](https://crfm.stanford.edu/2023/03/13/alpaca.html)
- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning", *Nature* 645, 633–638 (2025). [arXiv:2501.12948](https://arxiv.org/abs/2501.12948), [doi:10.1038/s41586-025-09422-z](https://doi.org/10.1038/s41586-025-09422-z)
- Qwen Team, "Qwen3 Technical Report", arXiv:2505.09388 (2025). [arXiv:2505.09388](https://arxiv.org/abs/2505.09388)
- A. Singh, "OpenAI says DeepSeek may have 'inappropriately' used its models' output", Axios (Jan 29, 2025). [axios.com/2025/01/29/openai-deepseek-ai-models-data-training](https://www.axios.com/2025/01/29/openai-deepseek-ai-models-data-training)
- Reuters, "OpenAI says China's DeepSeek trained its AI by distilling U.S. models, memo shows", The Asahi Shimbun (Feb 13, 2026). [asahi.com/ajw/articles/16351384](https://www.asahi.com/ajw/articles/16351384)
