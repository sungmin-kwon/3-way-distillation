---
title: Attention from scratch
summary: One attention head computed by hand on a three-token sentence — embeddings, queries/keys/values, the scaled score matrix, softmax weights, and the output, plus why the 1/√d_k scaling exists and what multiple heads and masking add.
date: 2026-11-10
updated: 2026-11-10
tags: [ml/llm]
distillate: One attention head computes output = softmax(QKᵀ/√d_k)·V, with Q, K, V the token embeddings projected by learned matrices. On the three-token sentence "the cat sat" with 4-dimensional embeddings and identity weight matrices, "cat" attends 0.4519 to itself and 0.2741 each to "the" and "sat", giving the output (0.7260, 0.7260, 0.2741, 0.2741). With identity weights the scores are proportional to the cosine similarities, and equal to them here because every embedding has norm √2, so its norm squared is 2 = √d_k; the example shows the mechanics, not learned behavior.
model: [Mistral Large 4]
reviewed_by: [Claude Opus 5.5]
---

The transformer block is built from one operation repeated many times: **self-attention**. Vaswani et al. (2017) introduced it in *Attention Is All You Need*[^1] as scaled dot-product attention, and nearly every large language model in wide use today is a transformer built from this operation. A single **attention head** takes a sequence of token embeddings, projects each token into a query, a key, and a value, and lets every token gather information from every other token with learned weights. This note computes one head by hand on a three-token sentence, so every number is visible.

The models in the [distillation note](note:what-is-model-distillation) and the [speculative decoding note](note:speculative-decoding) are stacks of exactly this operation, plus feed-forward layers.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| sentence | *"the cat sat"* (3 tokens) |
| embedding dimension $d_{\mathrm{model}}$ | 4 |
| attention heads | 1, with $d_k = d_v = 4$ |
| weight matrices | $W_Q = W_K = W_V = I_4$ (identity, to keep the arithmetic by hand) |
| masking | none |

[^1]: Vaswani, Shazeer, Parmar, et al. (2017), *Attention Is All You Need*, NeurIPS 2017, <https://arxiv.org/abs/1706.03762>.

## Embeddings

Each token starts as a $d_{\mathrm{model}}$-dimensional vector, its **embedding**. Stack the three token embeddings as rows of the input matrix $X$, an $n \times d_{\mathrm{model}}$ matrix with $n = 3$ here:

| token | embedding $x_i$ |
| --- | --- |
| the | $(1, 0, 1, 0)$ |
| cat | $(1, 1, 0, 0)$ |
| sat | $(0, 1, 0, 1)$ |

$$
X = \begin{pmatrix}
1 & 0 & 1 & 0\\
1 & 1 & 0 & 0\\
0 & 1 & 0 & 1
\end{pmatrix}
$$

Each embedding has norm $\sqrt{2}$, a fact that matters below. In a real model these vectors come from a learned embedding table plus positional encodings; here they are chosen by hand.

## Queries, keys, and values

The head projects every token embedding three ways with learned weight matrices $W_Q$, $W_K$, $W_V$, each $d_{\mathrm{model}} \times d_k$ (and $W_V$ is $d_{\mathrm{model}} \times d_v$):

$$
Q = X W_Q, \qquad K = X W_K, \qquad V = X W_V
$$

Row $i$ of $Q$ is the **query** $q_i$ of token $i$ ("what this token looks for"), row $i$ of $K$ is its **key** $k_i$ ("what this token offers"), and row $i$ of $V$ is its **value** $v_i$ ("what this token passes on"). In this example all three weight matrices are the identity, so $q_i = k_i = v_i = x_i$.

## The score matrix and the $1/\sqrt{d_k}$ scaling

The **score** between query $i$ and key $j$ is their dot product, scaled:

$$
S_{ij} = \frac{q_i \cdot k_j}{\sqrt{d_k}}
$$

With $d_k = 4$ the scale factor is $\sqrt{4} = 2$. Computing all nine dot products of the embeddings above:

$$
S = \frac{1}{2} X X^{\top} = \frac{1}{2}\begin{pmatrix}
2 & 1 & 0\\
1 & 2 & 1\\
0 & 1 & 2
\end{pmatrix} = \begin{pmatrix}
1 & 0.5 & 0\\
0.5 & 1 & 0.5\\
0 & 0.5 & 1
\end{pmatrix}
$$

for example $S_{12} = x_1 \cdot x_2 / 2 = 1/2 = 0.5$. Because every embedding here has norm $\sqrt{2}$, each scaled score is also the **cosine similarity** between the two tokens.

The $1/\sqrt{d_k}$ factor is there because a dot product of two $d_k$-dimensional vectors with independent zero-mean, unit-variance entries has variance $d_k$. At large $d_k$ the raw scores grow large, the softmax below saturates toward one-hot, and its gradients vanish. Dividing by $\sqrt{d_k}$ keeps the variance near 1. This is the scaling Vaswani et al. (2017) proposed.

## Softmax: from scores to weights

Each row of $S$ goes through a **softmax** to become attention weights that sum to 1:

$$
A_{ij} = \frac{e^{S_{ij}}}{\sum_l e^{S_{il}}}
$$

For the middle row, $S_{21} = S_{23} = 0.5$ and $S_{22} = 1$:

$$
e^{0.5} = 1.6487, \quad e^{1} = 2.7183, \quad Z = 1.6487 + 2.7183 + 1.6487 = 6.0157
$$

$$
A_{21} = 1.6487/6.0157 = 0.2741, \quad A_{22} = 2.7183/6.0157 = 0.4519
$$

$$
A_{23} = A_{21} = 0.2741
$$

All three rows give the **attention matrix** (each row sums to 1 up to the last digit of rounding):

$$
A = \begin{pmatrix}
0.5065 & 0.3072 & 0.1863\\
0.2741 & 0.4519 & 0.2741\\
0.1863 & 0.3072 & 0.5065
\end{pmatrix}
$$

Row $i$ says how token $i$ splits its attention over the three tokens.

## The output

The head's output for token $i$ is the attention-weighted sum of the values:

$$
O = A V, \qquad o_i = \sum_j A_{ij}\, v_j
$$

With $V = X$ here, and computing with the 4-decimal weights shown above, the output for "cat" is

$$
o_2 = 0.2741\,x_1 + 0.4519\,x_2 + 0.2741\,x_3 = (0.7260,\ 0.7260,\ 0.2741,\ 0.2741)
$$

and the full output matrix is:

| token | output $o_i$ |
| --- | --- |
| the | (0.8137, 0.4935, 0.5065, 0.1863) |
| cat | (0.7260, 0.7260, 0.2741, 0.2741) |
| sat | (0.4935, 0.8137, 0.1863, 0.5065) |

<svg viewBox="0 0 460 400" role="img" aria-label="Attention weight matrix for the three-token example: rows are the attending (query) token, columns the attended-to (key) token. Weights run from 0.1863 to 0.5065; cell shading is proportional to the weight." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Attention weights for &quot;the cat sat&quot;</title>
  <text x="230.0" y="24" text-anchor="middle" font-size="12" fill="currentColor">key (attended to)</text>
  <text transform="translate(24 206.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">query (attending)</text>
  <text x="130.0" y="42" text-anchor="middle" font-size="13" fill="currentColor">the</text>
  <text x="230.0" y="42" text-anchor="middle" font-size="13" fill="currentColor">cat</text>
  <text x="330.0" y="42" text-anchor="middle" font-size="13" fill="currentColor">sat</text>
  <text x="68" y="111.0" text-anchor="end" font-size="13" fill="currentColor">the</text>
  <text x="68" y="211.0" text-anchor="end" font-size="13" fill="currentColor">cat</text>
  <text x="68" y="311.0" text-anchor="end" font-size="13" fill="currentColor">sat</text>
  <rect x="80" y="56" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.5065" stroke="var(--rule)"/>
  <text x="130.0" y="111.0" text-anchor="middle" font-size="13" fill="currentColor">0.5065</text>
  <rect x="180" y="56" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.3072" stroke="var(--rule)"/>
  <text x="230.0" y="111.0" text-anchor="middle" font-size="13" fill="currentColor">0.3072</text>
  <rect x="280" y="56" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.1863" stroke="var(--rule)"/>
  <text x="330.0" y="111.0" text-anchor="middle" font-size="13" fill="currentColor">0.1863</text>
  <rect x="80" y="156" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.2741" stroke="var(--rule)"/>
  <text x="130.0" y="211.0" text-anchor="middle" font-size="13" fill="currentColor">0.2741</text>
  <rect x="180" y="156" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.4519" stroke="var(--rule)"/>
  <text x="230.0" y="211.0" text-anchor="middle" font-size="13" fill="currentColor">0.4519</text>
  <rect x="280" y="156" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.2741" stroke="var(--rule)"/>
  <text x="330.0" y="211.0" text-anchor="middle" font-size="13" fill="currentColor">0.2741</text>
  <rect x="80" y="256" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.1863" stroke="var(--rule)"/>
  <text x="130.0" y="311.0" text-anchor="middle" font-size="13" fill="currentColor">0.1863</text>
  <rect x="180" y="256" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.3072" stroke="var(--rule)"/>
  <text x="230.0" y="311.0" text-anchor="middle" font-size="13" fill="currentColor">0.3072</text>
  <rect x="280" y="256" width="100" height="100" style="fill: var(--accent)" fill-opacity="0.5065" stroke="var(--rule)"/>
  <text x="330.0" y="311.0" text-anchor="middle" font-size="13" fill="currentColor">0.5065</text>
</svg>

*Attention weights for "the cat sat". Rows are the attending (query) token, columns the attended-to (key) token; cell shading is proportional to the weight. "cat" attends 0.4519 to itself and 0.2741 each to "the" and "sat".*

## Reading the weights

In this toy example the diagonal is largest because $x_i \cdot x_i = 2$ beats every cross dot product, so each token attends most to itself: "the" splits 0.5065 / 0.3072 / 0.1863 over "the" / "cat" / "sat". In a trained model the weight matrices project the embedding space so that *task-relevant* tokens get large dot products; "cat" attending to "sat" (a verb) or to "the" is exactly the kind of relation the learned $W_Q$ and $W_K$ are there to create.

## One head vs. many, and masking

A **multi-head** attention layer runs $h$ such heads in parallel, each with its own $W_Q$, $W_K$, $W_V$ of shape $d_{\mathrm{model}} \times d_k$, concatenates the $h$ outputs, and projects with $W_O$. The head size is usually chosen so that $h \cdot d_v = d_{\mathrm{model}}$; Vaswani et al. (2017) used $d_{\mathrm{model}} = 512$, $h = 8$ heads, and $d_k = d_v = 64$. Different heads can learn different relations, which is why the layer is more than $h$ copies of one head.

In a decoder, self-attention is **masked**: future positions get score $-\infty$ before the softmax, so token $i$ can attend only to positions $\le i$. The example above is unmasked, as in an encoder.

## The whole computation in Python

```python
import math

# Worked example: sentence "the cat sat", d_model = 4, one head,
# W_Q = W_K = W_V = identity, no masking.
tokens = ["the", "cat", "sat"]
X = [[1, 0, 1, 0],   # embedding of "the"   [seq, d_model]
     [1, 1, 0, 0],   # embedding of "cat"
     [0, 1, 0, 1]]   # embedding of "sat"
d_k = 4

def matmul_T(A, B):  # A [seq, d_k] @ B^T, B [seq, d_k] -> [seq, seq]
    return [[sum(a * b for a, b in zip(ra, rb)) for rb in B] for ra in A]

def softmax(row):
    m = max(row)
    e = [math.exp(v - m) for v in row]
    return [v / sum(e) for v in e]

S = [[v / math.sqrt(d_k) for v in row] for row in matmul_T(X, X)]  # scores
A = [[round(v, 4) for v in softmax(row)] for row in S]            # weights, rounded to 4 dp
O = [[sum(A[i][j] * X[j][k] for j in range(3)) for k in range(4)]   # output
     for i in range(3)]

for t, row in zip(tokens, A):
    print(f"{t}: " + "  ".join(f"{v:.4f}" for v in row))
print("output for 'cat':", [f"{v:.4f}" for v in O[1]])
```

which prints:

```
the: 0.5065  0.3072  0.1863
cat: 0.2741  0.4519  0.2741
sat: 0.1863  0.3072  0.5065
output for 'cat': ['0.7260', '0.7260', '0.2741', '0.2741']
```

## Limits

The example uses identity weight matrices, no bias terms, one layer, one head, and no masking, so it shows the mechanics of a head, not learned behavior. The embeddings are chosen by hand; in a real model they are learned, and the original transformer adds sinusoidal **positional encodings** to them because attention itself is permutation-equivariant and carries no word-order information. The scaling factor is doing real work even at $d_k = 4$: without it the middle row's scores would be $(1, 2, 1)$, and softmax would put 0.5761 of the weight on "cat" itself instead of 0.4519 (and 0.6652 on "the" instead of 0.5065). Computing $S$ costs $O(n^2 d_k)$ time and the attention matrix $O(n^2)$ memory per head in sequence length $n$; that quadratic growth is the main practical limit of attention on long sequences. KV caching and the verify-in-one-pass trick in the [speculative decoding note](note:speculative-decoding) attack different costs: caching keeps each token's $K$ and $V$ so a decoding step attends in $O(n)$ instead of recomputing them, and speculative decoding targets the per-token memory-bandwidth cost of reading the weights.
