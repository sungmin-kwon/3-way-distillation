---
title: Running a language model on your own machine
summary: What decides how fast a language model generates text on consumer hardware, worked through on Llama 3.1 8B — why decoding is limited by memory bandwidth, a tokens-per-second bound from two numbers, 4-bit quantization and its cost, the KV cache, splitting a model between GPU and CPU, unified memory, the runtimes, and the hardware of November 2026.
date: 2026-11-11
tags: [ml/llm]
distillate: "Generating each token means reading every weight from memory once, so at batch size 1 the speed limit is memory bandwidth divided by model size: Llama 3.1 8B at 4.89 bits per weight is 4.92 GB, which caps it at 18 tokens/s on dual-channel DDR5, 62 on an Apple M5 Pro and 364 on an RTX 5090, and measured runs reach 64–83% of such bounds. Quantizing to about 4.5 bits with a separate scale for every 32 weights keeps the rounding error small, and 4-bit precision is close to the best use of a fixed memory budget. The limits are capacity and the slowest memory a model touches: a 70B model split between a 24 GB GPU and system RAM runs at 3.7 tokens/s, because the part left in system RAM takes 92% of the time."
model: [Claude Opus 5.5]
---

A language model running on a laptop or a desktop GPU is slow or fast for a reason that has little to do with arithmetic. Each new token needs one forward pass through the whole network, and at batch size 1 that pass is dominated by reading the weights out of memory. Two numbers therefore predict most of what happens: how many bytes the model occupies, and how many bytes per second the memory holding it can deliver. Everything else in local inference, from 4-bit quantization to Apple's unified memory to splitting a model across a GPU and the CPU, is a way of changing one of those two numbers.

Throughout, the note uses one model and a few machines:

| | value |
| --- | --- |
| model | Llama 3.1 8B: 32 layers, model dimension 4,096, 32 query heads, 8 key/value heads |
| weights | Q4_K_M quantization, 4.89 bits per weight, 4.58 GiB (4.92 GB) |
| desktop CPU | dual-channel DDR5-5600: 89.6 GB/s |
| laptops | Apple M5 Pro: 307 GB/s; M5 Max: 614 GB/s (unified memory) |
| GPUs | RTX 4090: 24 GB at 1,008 GB/s; RTX 5090: 32 GB at 1,792 GB/s |

The architecture is from Table 3 of the Llama 3 paper (Grattafiori et al., 2024), and the size and bits per weight are from the table in llama.cpp's quantization README. The DDR5 figure is a calculation: 5,600 million transfers per second, 8 bytes per transfer on each 64-bit channel, two channels. The other bandwidths are the manufacturers' figures, listed with sources in [the snapshot at the end](#where-things-stand).

## Why decoding is limited by memory bandwidth

A matrix–vector product with a weight matrix of $N$ entries does $2N$ floating-point operations, a multiply and an add per weight, and must read all $N$ weights. At 4.89 bits, about 0.61 bytes, per weight, that is roughly 3 operations per byte read. An RTX 4090 is rated at 165.2 trillion 16-bit tensor operations per second (dense, with 32-bit accumulation) against 1,008 GB/s of memory bandwidth, about 160 operations per byte, so while generating one token at a time it mostly waits on memory. This is the slack that speculative decoding exploits: checking several drafted tokens in one pass costs about as much as producing one.

Reading the prompt is different. During *prefill*, all the prompt's tokens go through each layer together, so each weight fetched is used once per token in the prompt and the work becomes limited by arithmetic instead. The benchmarks in llama.cpp's quantization README show the gap for this model at Q4_K_M: 821.81 tokens/s when processing a 512-token prompt, against 71.93 tokens/s when generating, about 11 times faster per token. That is why a long prompt appears quickly and the answer then arrives word by word. The same reasoning explains why servers batch many users together: a batch of 64 sequences reuses each weight 64 times, which a single user at home never does.

## A speed limit from two numbers

If every weight is read once per generated token, the time per token can't be shorter than the model's size divided by the memory bandwidth:

$$
\text{tokens/s} \le \frac{B}{W + K}
$$

where $B$ is the memory bandwidth in bytes per second, $W$ is the size of the weights in bytes, and $K$ is the size of the KV cache read for attention, covered [below](#the-kv-cache). For Llama 3.1 8B on the RTX 5090, with a short context so that $K$ is negligible:

$$
\frac{1792 \text{ GB/s}}{4.92 \text{ GB}} = 364 \text{ tokens/s}
$$

```python
GB = 1e9

def kv_bytes_per_token(layers, kv_heads, head_dim, bytes_per=2):
    return 2 * layers * kv_heads * head_dim * bytes_per  # K and V

def max_tokens_per_s(weight_bytes, bandwidth, kv_bytes=0.0):
    """Every weight, and the KV cache so far, read once per token."""
    return bandwidth / (weight_bytes + kv_bytes)

weights = 4.58 * 2**30              # Llama 3.1 8B, Q4_K_M: 4.58 GiB
kv = kv_bytes_per_token(layers=32, kv_heads=8, head_dim=128)
print(f"weights {weights/GB:.2f} GB, KV {kv/2**10:.0f} KiB/token")
for n in (8_192, 131_072):
    print(f"  KV at {n:>7,} tokens: {n*kv/2**30:.0f} GiB")

hardware = {"DDR5-5600, 2 channels": 89.6, "Apple M5 Pro": 307,
            "Apple M5 Max": 614, "RTX 4090": 1008,
            "RTX 5090": 1792}                              # GB/s
for name, bw in hardware.items():
    short = max_tokens_per_s(weights, bw * GB)
    at_8k = max_tokens_per_s(weights, bw * GB, 8_192 * kv)
    print(f"{name:22s} {short:4.0f} tok/s, at 8k context {at_8k:3.0f}")
```

```text
weights 4.92 GB, KV 128 KiB/token
  KV at   8,192 tokens: 1 GiB
  KV at 131,072 tokens: 16 GiB
DDR5-5600, 2 channels    18 tok/s, at 8k context  15
Apple M5 Pro             62 tok/s, at 8k context  51
Apple M5 Max            125 tok/s, at 8k context 102
RTX 4090                205 tok/s, at 8k context 168
RTX 5090                364 tok/s, at 8k context 299
```

The bound is a ceiling, and real runs land below it: some time goes to dequantizing weights, to attention, to launching kernels, and no memory system sustains its peak rate. The llama.cpp project collects `llama-bench` results from users in two discussion threads, one for Apple Silicon and one for CUDA, both on Llama 2 7B at the simpler Q4_0 format (3.56 GiB). Dividing each measured generation speed by the bound for that file:

```python
# llama-bench generation speed (tg128), Llama 2 7B at Q4_0, from
# the llama.cpp Apple Silicon and CUDA threads; bandwidth in GB/s
weights_gb = 3.56 * 2**30 / 1e9                     # 3.56 GiB
runs = {"M4 Pro (20-core GPU)": (273, 50.74),
        "M5 Pro (20-core GPU)": (307, 66.33),
        "M5 Max (40-core GPU)": (614, 119.92),
        "RTX 4090": (1008, 188.96),
        "RTX 5090": (1792, 300.40)}
for name, (bw, measured) in runs.items():
    bound = bw / weights_gb
    print(f"{name:21s} bound {bound:3.0f}, measured {measured:3.0f}"
          f" tok/s ({measured / bound:.0%})")
```

```text
M4 Pro (20-core GPU)  bound  71, measured  51 tok/s (71%)
M5 Pro (20-core GPU)  bound  80, measured  66 tok/s (83%)
M5 Max (40-core GPU)  bound 161, measured 120 tok/s (75%)
RTX 4090              bound 264, measured 189 tok/s (72%)
RTX 5090              bound 469, measured 300 tok/s (64%)
```

So a reasonable rule of thumb is two-thirds to four-fifths of bandwidth over size. The machines differ by a factor of six in bandwidth, and their measured speeds differ by about the same factor, which is the clearest evidence that bandwidth, not compute, sets the pace. These are single user-submitted runs on different llama.cpp versions, so a few percent between them means nothing.

## Quantization

Llama 3.1 8B has about 8 billion weights. Stored as 16-bit floats it is 14.96 GiB and doesn't fit in a 12 or 16 GB graphics card; at about 4.9 bits it is 4.58 GiB and fits in almost anything. Because speed is bandwidth over size, quantization also makes generation faster. In the same README table, F16 generates at 29.17 tokens/s and Q4_K_M at 71.93, 2.47 times faster for a file 3.27 times smaller; the shortfall is the extra work of unpacking the 4-bit codes.

The simplest scheme in llama.cpp, **Q4_0**, cuts each row of weights into blocks of 32. For each block it stores one 16-bit scale $d$, chosen from the block's largest-magnitude value, and 32 four-bit integers $q$ from 0 to 15, so each weight is reconstructed as $d\,(q - 8)$. That costs $4 + 16/32 = 4.5$ bits per weight. The small blocks matter because weight matrices have outliers: one large value forces a coarse step on everything that shares its scale. A short experiment shows the effect on a 4,096 × 4,096 matrix of Gaussian weights in which 0.1% are 20 times larger than the rest:

```python
import numpy as np

def q4_absmax(w, block):
    """Like Q4_0: w ≈ d·(q − 8), q in 0..15, one d per block."""
    w = w.reshape(-1, block)                      # [n_blocks, block]
    big = w[np.arange(len(w)), np.abs(w).argmax(axis=1)]  # signed max
    d = (big / -8)[:, None]
    q = np.clip(np.floor(w / d + 8.5), 0, 15)
    return (d * (q - 8)).reshape(-1)

rng = np.random.default_rng(1)
w = rng.normal(0, 0.02, 4096 * 4096)          # a 4096×4096 matrix
out = rng.choice(w.size, w.size // 1000, replace=False)
w[out] *= 20                                  # 0.1% outliers
x = rng.normal(0, 1, 4096)                    # one activation vector
y = w.reshape(4096, 4096) @ x

for block in (w.size, 256, 32):
    wq = q4_absmax(w, block)
    yq = wq.reshape(4096, 4096) @ x
    err_w = np.sqrt(np.mean((wq - w) ** 2)) / w.std()
    err_y = np.linalg.norm(yq - y) / np.linalg.norm(y)
    bpw = 4 + 16 / block                    # 4-bit codes, fp16 scale
    name = "whole matrix" if block == w.size else f"block of {block}"
    print(f"{name:>12}: {bpw:.2f} bits/weight, weight error"
          f" {err_w:.3f}, output error {err_y:.3f}")
```

```text
whole matrix: 4.00 bits/weight, weight error 0.849, output error 0.844
block of 256: 4.06 bits/weight, weight error 0.258, output error 0.258
 block of 32: 4.50 bits/weight, weight error 0.113, output error 0.113
```

The errors are root-mean-square, relative to the weights' standard deviation and to the size of the exact output. With one scale for the whole matrix, the step size is set by the largest outlier and the error is almost as large as the weights themselves; with a scale per 32 weights it falls to 11%, for half a bit more per weight.

**k-quants**, added to llama.cpp by Iwan Kawrakow in June 2023, refine this. Q4_K groups weights into *super-blocks* of 256, made of 8 blocks of 32; each block gets a scale and an offset (a minimum), and those are themselves quantized to 6 bits against two 16-bit numbers per super-block, which again comes to 4.5 bits per weight. The named mixes then spend extra bits where they matter most. In the original pull request, Q4_K_M uses the 6-bit Q6_K for half of the attention value and feed-forward output tensors and Q4_K for the rest, so it averages more than 4.5 bits: 4.89 for this model. The files are stored in **GGUF**, the single-file format llama.cpp introduced in August 2023 to replace its earlier GGML files; it holds the tensors, their quantization types and the tokenizer together.

Two methods from the research literature choose the rounding more carefully instead of rounding each weight to the nearest level. **GPTQ** (Frantar et al., 2023) quantizes weights one column at a time and adjusts the remaining ones to compensate, using second-order information from a small calibration set, and reports 3 or 4 bits per weight "with negligible accuracy degradation" on models up to 175 billion parameters. **AWQ** (Lin et al., 2024) observes that protecting about 1% of salient weights greatly reduces the error, and finds those weights from the activations rather than the weights themselves. GPTQ and AWQ checkpoints are common for GPU servers such as vLLM; GGUF files serve llama.cpp and the tools built on it, and llama.cpp's own *importance matrix* option likewise uses calibration activations to weight the rounding.

**The quality cost.** Dettmers and Zettlemoyer (2023) ran more than 35,000 experiments with 16-bit inputs and $k$-bit weights, measuring zero-shot accuracy across model families and sizes, and concluded that "4-bit precision is almost universally optimal for total model bits and zero-shot accuracy": in a fixed amount of memory, a larger model at 4 bits does better than a smaller one at 8 or 16 bits. Of the ways they tried to improve on plain rounding, a small block size helped most, as in the experiment above. Their result doesn't say that a 4-bit model matches its 16-bit original on every task; it says how best to spend a memory budget, which is the local user's problem exactly.

## The KV cache

Attention needs the key and value vectors of every earlier token, at every layer. The **KV cache** keeps them so they aren't recomputed, and it grows linearly with the context. Per token it holds

$$
2 \times n_\text{layers} \times n_\text{kv} \times d_\text{head} \times b
$$

bytes, where $n_\text{kv}$ is the number of key/value heads, $d_\text{head}$ the size of each head ($4096/32 = 128$ here), $b$ the bytes per value, and the 2 counts keys and values. For Llama 3.1 8B at 16 bits:

$$
2 \times 32 \times 8 \times 128 \times 2 = 131{,}072 \text{ bytes}
$$

That is 128 KiB per token, 1 GiB at 8,192 tokens and 16 GiB at the full 131,072-token (128K) context: more than three times the 4.58 GiB of weights. Two consequences follow. The cache takes memory that could hold a larger model, so a long context needs much more memory than the model file suggests. And the whole cache is read for every new token, so speed falls as the context fills: the code above gives 168 tokens/s at 8k context on the RTX 4090, against 205 with an empty one.

Llama 3.1 keeps the cache this small through **grouped-query attention** (Ainslie et al., 2023): its 32 query heads share 8 key/value heads, which shrinks the cache 4 times relative to full multi-head attention. Shazeer's (2019) multi-query attention, the extreme case with a single key/value head, came first. llama.cpp can also store the cache at lower precision with `--cache-type-k` and `--cache-type-v` (for example `q8_0`, which roughly halves it); its default is 16 bits.

## Splitting a model between GPU and CPU

When a model doesn't fit in the graphics card, llama.cpp can keep some layers on the GPU (`--n-gpu-layers`) and run the rest on the CPU from system memory. The layers still run one after another, so their times add, and the slow memory dominates. Llama 3.1 70B at Q4_K_M is 43.1 GB; with 21 GB of it on an RTX 4090 and the rest in dual-channel DDR5, leaving room on the card for the cache:

```python
def tokens_per_s(weight_gb, gpu_gb, gpu_bw, cpu_bw):
    """GPU layers and CPU layers run in turn, so their times add."""
    on_gpu = min(weight_gb, gpu_gb)
    seconds = on_gpu / gpu_bw + (weight_gb - on_gpu) / cpu_bw
    return 1 / seconds

w70 = 43.1                          # Llama 3.1 70B, Q4_K_M, GB
ddr5, rtx4090 = 89.6, 1008          # GB/s
cpu_only = tokens_per_s(w70, 0, rtx4090, ddr5)
split = tokens_per_s(w70, 21, rtx4090, ddr5)
print(f"CPU only:             {cpu_only:5.1f} tok/s")
print(f"21 GB on an RTX 4090: {split:5.1f} tok/s")
print(f"  GPU's share of each token: {21 / rtx4090 * split:.0%}")
for name, bw in {"DGX Spark": 273, "M5 Max": 614}.items():
    # the whole 43.1 GB in unified memory
    print(f"{name:21s} {bw / w70:5.1f} tok/s")
```

```text
CPU only:               2.1 tok/s
21 GB on an RTX 4090:   3.7 tok/s
  GPU's share of each token: 8%
DGX Spark               6.3 tok/s
M5 Max                 14.2 tok/s
```

These are upper bounds, like the ones above. Moving half the model onto a GPU with 11 times the bandwidth less than doubles the speed, because the GPU's half takes only 8% of each token's time and the half left in system memory takes the other 92%. Partial offloading is worth doing, but it makes a model usable rather than fast.

**Mixture-of-experts** models change the arithmetic. Each token passes through only a few of many expert feed-forward blocks, so the bytes read per token follow the *active* parameters while the memory needed follows the *total*. OpenAI's gpt-oss-120b has 116.83 billion parameters but 5.13 billion active per token; its expert weights, over 90% of the total, are stored in the MXFP4 format at 4.25 bits per parameter, which its model card says lets it fit on a single 80 GB GPU, and the 20.91-billion-parameter gpt-oss-20b runs in 16 GB. For such models llama.cpp's `--cpu-moe` and `--n-cpu-moe N` keep the expert weights, or those of the first $N$ layers, in system memory while the attention layers and the cache stay on the GPU. Since each token reads only a small fraction of the experts, the slow memory carries far fewer bytes per token than the dense 70B example above.

## Unified memory and discrete GPUs

A discrete GPU has fast memory and little of it: the RTX 5090's 32 GB at 1,792 GB/s is the most memory and bandwidth of any GeForce card. A system with **unified memory**, where the CPU and GPU share one pool, trades the other way. Apple's M5 Max offers up to 128 GB at 614 GB/s, and NVIDIA's DGX Spark and AMD's Ryzen AI Max+ 395 both put 128 GB on a 256-bit LPDDR5X bus. On the bounds above, the M5 Max runs the whole 70B model at up to 14.2 tokens/s and the DGX Spark at up to 6.3, where the 4090 and DDR5 pair manages 3.7; but for the 8B model the 5090 bound is 364 tokens/s against the M5 Max's 125. The rule that follows is simple: if the model fits in a discrete GPU, the GPU is faster; if it doesn't, unified memory avoids the slow half of a split.

On a Mac the operating system limits how much unified memory the GPU may wire. The mlx-lm documentation notes that models close to the machine's memory can be slow and suggests raising the limit with `sudo sysctl iogpu.wired_limit_mb=N`, where $N$ is larger than the model in megabytes and smaller than the machine's memory.

## Runtimes

- **llama.cpp**, begun by Georgi Gerganov in March 2023, is a C/C++ inference engine with back ends for CPUs, CUDA, Metal on Apple GPUs, Vulkan and others. It defines GGUF and the k-quants, and ships `llama-cli`, an OpenAI-compatible `llama-server` and the `llama-bench` tool used in the measurements above.
- **Ollama** wraps model download and serving behind one command. It runs GGUF models through llama.cpp and, on Apple Silicon, also has an engine built on MLX.
- **MLX** is Apple's array framework for Apple Silicon, built around unified memory, and **mlx-lm** is its package for running and fine-tuning language models, with its own quantized formats.
- **LM Studio** is a desktop application that runs llama.cpp on Mac, Windows and Linux and MLX on Apple Silicon.
- **vLLM** (Kwon et al., 2023) is built for serving many requests at once on GPUs. Its PagedAttention stores the KV cache in fixed-size pages, like virtual memory, so that little of it is wasted to fragmentation; the paper reports 2–4 times the throughput of earlier serving systems at the same latency. That matters when many sequences share a GPU, which is the batched regime from the first section, and much less for one person at a desk.

Two other techniques go faster still. Speculative decoding spends the arithmetic left idle during decoding on checking a small model's guesses, without changing the output; llama.cpp's server supports a draft model directly. Model distillation makes the small model itself, trading some quality for a smaller $W$.

## Where things stand

*This section is a snapshot as of November 2026 and is not kept up to date. Each figure is from the manufacturer's page or the release notes cited, checked on 2026-11-11.*

**Hardware.** The fastest memory in consumer hardware is still in NVIDIA's RTX 50 series, released in early 2025. NVIDIA released no new GeForce desktop cards in 2026; its Computex 2026 announcements were partner versions of existing cards. Tom's Hardware reported in February 2026 that none were planned for the year, and NVIDIA said only that memory supply was constrained. Apple introduced the M5 Pro and M5 Max in MacBook Pros in March 2026, and the M5 Ultra in a Mac Studio that went on sale in September 2026.

| device | memory | bandwidth | released |
| --- | --- | --- | --- |
| RTX 5090 | 32 GB GDDR7 | 1,792 GB/s | January 2025 |
| RTX 5080 | 16 GB GDDR7 | 960 GB/s | January 2025 |
| RTX 5060 Ti 16GB | 16 GB GDDR7 | 448 GB/s | April 2025 |
| RTX 4090 | 24 GB GDDR6X | 1,008 GB/s | October 2022 |
| Radeon RX 9070 XT | 16 GB GDDR6 | up to 640 GB/s | March 2025 |
| Arc B580 | 12 GB GDDR6 | 456 GB/s | late 2024 |
| Apple M5 | unified | 153 GB/s | October 2025 |
| Apple M5 Pro | up to 64 GB unified | 307 GB/s | March 2026 |
| Apple M5 Max | up to 128 GB unified | 614 GB/s | March 2026 |
| Apple M5 Ultra | up to 512 GB unified | 1.2 TB/s | September 2026 |
| NVIDIA DGX Spark | 128 GB LPDDR5X | 273 GB/s | October 2025 |
| AMD Ryzen AI Max+ 395 | up to 128 GB LPDDR5X-8000, 256-bit | not stated by AMD | announced January 2025 |

For the Ryzen AI Max+ 395, 256-bit × 8,000 MT/s works out to 256 GB/s, but AMD's page gives only the bus width and speed. Apple said the 512 GB M5 Ultra configuration would follow in late October 2026; whether it has shipped wasn't checked.

**Software.** llama.cpp releases are numbered by build (b12207 on 8 November 2026). Ollama was at version 0.40.15, MLX at 0.32.4, mlx-lm at 0.32.2 and vLLM at 0.33.0.

## Sources

- A. Grattafiori et al., "The Llama 3 Herd of Models" (2024). [arXiv:2407.21783](https://arxiv.org/abs/2407.21783)
- llama.cpp, quantization README: bits per weight, sizes and speeds for Llama 3.1 8B. [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md)
- llama.cpp discussion 4167, "Performance of llama.cpp on Apple Silicon M-series". [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/discussions/4167)
- llama.cpp discussion 15013, "Performance of llama.cpp on Nvidia CUDA". [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/discussions/15013)
- I. Kawrakow, "k-quants", llama.cpp pull request 1684 (June 2023). [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/pull/1684)
- GGUF specification. [github.com/ggml-org/ggml](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)
- E. Frantar, S. Ashkboos, T. Hoefler, D. Alistarh, "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers", ICLR 2023. [arXiv:2210.17323](https://arxiv.org/abs/2210.17323)
- J. Lin et al., "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration", MLSys 2024. [arXiv:2306.00978](https://arxiv.org/abs/2306.00978)
- T. Dettmers, L. Zettlemoyer, "The case for 4-bit precision: k-bit Inference Scaling Laws", *Proc. ICML 2023*, PMLR 202, 7750–7774. [proceedings.mlr.press](https://proceedings.mlr.press/v202/dettmers23a.html), [arXiv:2212.09720](https://arxiv.org/abs/2212.09720)
- J. Ainslie, J. Lee-Thorp, M. de Jong, Y. Zemlyanskiy, F. Lebrón, S. Sanghai, "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints", *Proc. EMNLP 2023*, 4895–4901. [doi:10.18653/v1/2023.emnlp-main.298](https://doi.org/10.18653/v1/2023.emnlp-main.298), [arXiv:2305.13245](https://arxiv.org/abs/2305.13245)
- N. Shazeer, "Fast Transformer Decoding: One Write-Head is All You Need" (2019). [arXiv:1911.02150](https://arxiv.org/abs/1911.02150)
- OpenAI, "gpt-oss-120b & gpt-oss-20b Model Card" (2025). [arXiv:2508.10925](https://arxiv.org/abs/2508.10925)
- llama.cpp server README: `--n-gpu-layers`, `--cache-type-k`, `--cpu-moe`, `--n-cpu-moe`. [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- mlx-lm README. [github.com/ml-explore/mlx-lm](https://github.com/ml-explore/mlx-lm)
- LM Studio documentation. [lmstudio.ai](https://lmstudio.ai/docs/app)
- W. Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention", *Proc. SOSP 2023*, 611–626. [doi:10.1145/3600006.3613165](https://doi.org/10.1145/3600006.3613165), [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)
- NVIDIA, GeForce graphics card comparison (RTX 50 series). [nvidia.com](https://www.nvidia.com/en-us/geforce/graphics-cards/compare/)
- NVIDIA, "NVIDIA Ada GPU Architecture" whitepaper, Appendix A, Table 2 (RTX 4090). [images.nvidia.com](https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf)
- Tom's Hardware, report on NVIDIA's GeForce plans for 2026, 5 February 2026. [tomshardware.com](https://www.tomshardware.com/pc-components/gpus/report-claims-nvidia-will-not-be-releasing-any-new-rtx-gaming-gpus-in-2026-rtx-60-series-likely-debuting-in-2028)
- NVIDIA, "GeForce RTX 4090 Out Now", 12 October 2022. [nvidia.com](https://www.nvidia.com/en-us/geforce/news/geforce-rtx-4090-out-now)
- NVIDIA, Computex 2026 GeForce RTX announcements. [nvidia.com](https://www.nvidia.com/en-us/geforce/news/gfecnt/20266/computex-2026-nvidia-geforce-rtx-announcements/)
- AMD, press release on the Radeon RX 9000 series launch, 28 February 2025. [ir.amd.com](https://ir.amd.com/news-events/press-releases/detail/1238/amd-unveils-next-generation-amd-rdna-4-architecture-with-the-launch-of-amd-radeon-rx-9000-series-graphics-cards)
- AMD, Radeon RX 9070 XT. [amd.com](https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html)
- Intel, Arc B580 specifications. [intel.com](https://www.intel.com/content/www/us/en/products/sku/241598/intel-arc-b580-graphics/specifications.html)
- Apple, "Apple unleashes M5", 15 October 2025. [apple.com](https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/)
- Apple, "Apple introduces MacBook Pro with all-new M5 Pro and M5 Max", March 2026. [apple.com](https://www.apple.com/newsroom/2026/03/apple-introduces-macbook-pro-with-all-new-m5-pro-and-m5-max/)
- Apple, "Apple introduces new Mac Studio with M5 Max and M5 Ultra", August 2026. [apple.com](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
- NVIDIA, DGX Spark hardware overview. [docs.nvidia.com](https://docs.nvidia.com/dgx/dgx-spark/hardware.html)
- AMD, press release on the Ryzen AI Max series (CES), 6 January 2025. [ir.amd.com](https://ir.amd.com/news-events/press-releases/detail/1232/amd-announces-expanded-consumer-and-commercial-ai-pc-portfolio)
- AMD, Ryzen AI Max+ 395. [amd.com](https://www.amd.com/en/products/processors/laptop/ryzen/ai-300-series/amd-ryzen-ai-max-plus-395.html)
- Release pages: [llama.cpp](https://github.com/ggml-org/llama.cpp/releases), [Ollama](https://github.com/ollama/ollama/releases), [MLX](https://github.com/ml-explore/mlx/releases), [mlx-lm](https://github.com/ml-explore/mlx-lm/releases), [vLLM](https://github.com/vllm-project/vllm/releases)
