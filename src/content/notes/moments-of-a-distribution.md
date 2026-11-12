---
title: Moments of a distribution
summary: The numbers that summarize a distribution's shape, borrowed from mechanics — raw, central and standardized moments, mean, variance, skewness and kurtosis worked out for Binomial(10, 0.05), moment-generating functions and cumulants, the method of moments against maximum likelihood, and where moments appear in optimizers.
date: 2026-11-12
tags: [stats]
distillate: "The r-th moment of a distribution is the expected r-th power of its variable: the first raw moment E[X] is the mean, the second central moment E[(X − μ)²] is the variance, and the third and fourth, divided by σ³ and σ⁴, are skewness and kurtosis. For Binomial(10, 0.05) they are 0.5, 0.475, 1.306 and 4.505, where a normal has skewness 0 and kurtosis 3, and the excess over 3 measures the tails, not the peak. Matching sample moments to a model's is a quick way to fit it, but for a gamma shape it gives estimates with standard deviation 0.244 against 0.195 for maximum likelihood."
model: [Claude Opus 5.5]
---

A **moment** in mechanics is a force or a mass weighted by its distance from a point: a weight far from a pivot turns a lever more than the same weight close to it. Probability borrowed the word because a distribution is a unit of mass spread along the number line, and the same weighted sums describe it. Karl Pearson used moments in 1894 to split a measured frequency curve into a mixture of normal curves, by matching what he called the "higher moments" of the data to those of the model (Pearson, 1894). The mean, the variance, skewness and kurtosis are all moments, and so is a good deal of what an optimizer such as Adam keeps track of.

The note uses a binomial hit count as its worked example, and a gamma sample for fitting:

| | value |
| --- | --- |
| $X$: significant results among 10 independent null tests at $\alpha = 0.05$ | Binomial(10, 0.05) |
| $P(X = k)$ for $k = 0, 1, 2, 3, 4$ | 0.5987, 0.3151, 0.0746, 0.0105, 0.0010 |
| sample for the method of moments | 200 draws from a gamma with shape 2, scale 3 |

## Moments in mechanics

Put masses $m_i$ at positions $x_i$ along a rod. The $r$-th moment of the arrangement about a point $a$ is

$$
\sum_i m_i\,(x_i - a)^r
$$

Each power answers a different question. The zeroth moment is the total mass. The first moment about $a$ is the turning effect of the weights around a pivot at $a$, and it is zero when the pivot sits at the **centre of mass**, $\bar x = \sum_i m_i x_i / \sum_i m_i$, where the rod balances. The second moment about the centre of mass is the **moment of inertia**, which measures how hard the rod is to spin about that point: mass far from the centre counts with the square of its distance.

A probability distribution is the same picture with total mass 1. For the running example, mass 0.5987 sits at 0, 0.3151 at 1, and so on. The first moment puts the balance point at the mean, and the second moment about that point is the variance.

<svg viewBox="0 0 640 230" role="img" aria-label="The Binomial(10, 0.05) probabilities drawn as weights standing on a beam at positions 0 to 4: 0.5987 at 0, 0.3151 at 1, 0.0746 at 2, 0.0105 at 3 and 0.0010 at 4. A fulcrum under the beam at 0.5, the mean, balances it." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Binomial(10, 0.05) as masses on a beam, balanced at the mean 0.5</title>
  <line x1="70.0" y1="160" x2="622.0" y2="160" style="stroke: var(--ink)" stroke-width="3"/>
  <rect x="88.0" y="38.8" width="36" height="119.7" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="106.0" y="32.8" text-anchor="middle" font-size="11" fill="currentColor">0.5987</text>
  <text x="106.0" y="178" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <rect x="208.0" y="95.5" width="36" height="63.0" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="226.0" y="89.5" text-anchor="middle" font-size="11" fill="currentColor">0.3151</text>
  <text x="226.0" y="178" text-anchor="middle" font-size="11" fill="currentColor">1</text>
  <rect x="328.0" y="143.6" width="36" height="14.9" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="346.0" y="137.6" text-anchor="middle" font-size="11" fill="currentColor">0.0746</text>
  <text x="346.0" y="178" text-anchor="middle" font-size="11" fill="currentColor">2</text>
  <rect x="448.0" y="156.4" width="36" height="2.1" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="466.0" y="150.4" text-anchor="middle" font-size="11" fill="currentColor">0.0105</text>
  <text x="466.0" y="178" text-anchor="middle" font-size="11" fill="currentColor">3</text>
  <rect x="568.0" y="158.3" width="36" height="0.2" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="586.0" y="152.3" text-anchor="middle" font-size="11" fill="currentColor">0.0010</text>
  <text x="586.0" y="178" text-anchor="middle" font-size="11" fill="currentColor">4</text>
  <path d="M166.0 161.5 L154.0 184 L178.0 184 Z" fill="var(--muted)"/>
  <text x="166.0" y="202" text-anchor="middle" font-size="12" fill="currentColor">balance point E[X] = 0.5</text>
  <text x="622.0" y="178" text-anchor="end" font-size="12" fill="currentColor">k</text>
  <line x1="166.0" y1="220" x2="346.0" y2="220" style="stroke: var(--muted)" stroke-width="1.5"/>
  <line x1="166.0" y1="215" x2="166.0" y2="225" style="stroke: var(--muted)" stroke-width="1.5"/>
  <line x1="346.0" y1="215" x2="346.0" y2="225" style="stroke: var(--muted)" stroke-width="1.5"/>
  <text x="356.0" y="224" font-size="11" fill="currentColor">arm 2 &#8722; 0.5 = 1.5</text>
</svg>

*Binomial(10, 0.05) as weights on a beam. The beam balances on a fulcrum at 0.5, the mean: the weight at 0 pulls left with arm 0.5, and the weights at 1, 2, 3 and 4 pull right with arms 0.5, 1.5, 2.5 and 3.5 (with weights beyond 4 too light to draw), and the turning effects cancel.*

## Raw moments: the mean

The $r$-th **raw moment** of a random variable $X$ is the moment about zero,

$$
\mu'_r = E[X^r] = \sum_k k^r\, p(k)
$$

for a discrete variable with probability mass function $p(k)$, and $\int x^r f(x)\, dx$ for a continuous one with density $f(x)$. The zeroth raw moment is always 1, the total probability. The first is the **mean** $\mu = E[X]$, the balance point. For the running example

$$
\mu = \sum_k k\, p(k) = np = 10 \times 0.05 = 0.5
$$

The higher raw moments are less interpretable on their own: $E[X^2] = 0.725$ mixes the spread of $X$ with its distance from zero. The code below computes the first four raw and central moments of the running example directly from its probabilities, using only the standard library:

```python
import math

n, p = 10, 0.05                  # X ~ Binomial(10, 0.05)
pmf = {k: math.comb(n, k) * p**k * (1 - p)**(n - k)
       for k in range(n + 1)}

def raw(r):                      # E[X^r]
    return sum(k**r * w for k, w in pmf.items())

def central(r):                  # E[(X - mu)^r]
    return sum((k - mu)**r * w for k, w in pmf.items())

mu = raw(1)
for r in range(5):
    print(f"r={r}  raw {raw(r):.4f}  central {central(r):.4f}")

sd = math.sqrt(central(2))
skew = central(3) / sd**3
kurt = central(4) / sd**4
print(f"sd {sd:.4f}  skewness {skew:.4f}  "
      f"kurtosis {kurt:.4f}  excess {kurt - 3:.4f}")

q = 1 - p                        # one Bernoulli(0.05) trial
b_skew = (1 - 2*p) / math.sqrt(p * q)
b_exc = (1 - 6*p*q) / (p * q)
print(f"Bernoulli: skewness {b_skew:.4f}  excess {b_exc:.4f}")
print(f"  / sqrt(10) {b_skew / math.sqrt(n):.4f}  "
      f"/ 10 {b_exc / n:.4f}")
```

which prints:

```
r=0  raw 1.0000  central 1.0000
r=1  raw 0.5000  central 0.0000
r=2  raw 0.7250  central 0.4750
r=3  raw 1.2650  central 0.4275
r=4  raw 2.6465  central 1.0165
sd 0.6892  skewness 1.3059  kurtosis 4.5053  excess 1.5053
Bernoulli: skewness 4.1295  excess 15.0526
  / sqrt(10) 1.3059  / 10 1.5053
```

## Central moments: the variance

The $r$-th **central moment** is the moment about the mean,

$$
\mu_r = E\big[(X - \mu)^r\big]
$$

The first is always 0, which is the balance condition again. The second is the **variance**, $\sigma^2 = \mu_2$, the moment of inertia about the balance point, and its square root $\sigma$ is the standard deviation. Central moments don't change when $X$ is shifted by a constant, so they describe shape and spread without position.

Expanding the square gives the variance from raw moments:

$$
\sigma^2 = E[X^2] - \mu^2 = 0.725 - 0.5^2 = 0.475
$$

which is $np(1-p)$ for the binomial. In mechanics this is the **parallel axis theorem**: the moment of inertia about zero, 0.725, is the moment of inertia about the centre of mass, 0.475, plus the total mass times the squared distance between the two points, $1 \times 0.5^2$. The third and fourth central moments expand the same way, by the binomial theorem:

$$
\mu_3 = \mu'_3 - 3\mu\,\mu'_2 + 2\mu^3
$$

$$
= 1.265 - 3(0.5)(0.725) + 2(0.5)^3 = 0.4275
$$

and $\mu_4 = \mu'_4 - 4\mu\,\mu'_3 + 6\mu^2\mu'_2 - 3\mu^4 = 1.0165$, matching the direct sums in the output above.

These identities are exact, but the shortcut $E[X^2] - \mu^2$ is a poor way to compute a variance from data in floating point. When the mean is large compared with the spread, both terms are huge and nearly equal, and subtracting them throws away the digits that held the answer. Four values near $10^9$ with a true variance of 22.5 show it:

```python
import math

x = [1e9 + v for v in (4, 7, 13, 16)]   # true variance 22.5
n = len(x)
m = sum(x) / n
naive = sum(v * v for v in x) / n - m * m   # E[X^2] - E[X]^2
two_pass = sum((v - m)**2 for v in x) / n   # E[(X - mean)^2]

mean, m2 = 0.0, 0.0              # Welford: one pass, updated
for i, v in enumerate(x, 1):
    d = v - mean
    mean += d / i
    m2 += d * (v - mean)
print(f"naive {naive}  two-pass {two_pass}  "
      f"Welford {m2 / n}")
```

which prints:

```
naive 0.0  two-pass 22.5  Welford 22.5
```

The one-pass formula returns exactly 0. Subtracting the mean first (two passes over the data) is safe, and so is **Welford's** update (Welford, 1962), which keeps a running mean and a running sum of squared deviations in one pass. Numerically careful libraries use a two-pass or Welford-style method for this reason.

## Standardized moments: skewness and kurtosis

Dividing a central moment by $\sigma^r$ removes the units and the scale, so what is left describes shape alone. The $r$-th **standardized moment** is $\mu_r / \sigma^r$, the $r$-th moment of $Z = (X - \mu)/\sigma$. The first two are always 0 and 1. The next two have names.

**Skewness** is the third standardized moment,

$$
\gamma_1 = \frac{\mu_3}{\sigma^3} = \frac{0.4275}{0.475^{3/2}} = 1.306
$$

Cubing keeps the sign of each deviation, and large deviations dominate, so skewness is positive when the long tail is on the right, negative when it is on the left, and zero for any distribution symmetric about its mean. The running example can't go below zero but runs up to 10, so it is right-skewed.

**Kurtosis** is the fourth standardized moment,

$$
\beta_2 = \frac{\mu_4}{\sigma^4} = \frac{1.0165}{0.475^{2}} = 4.505
$$

Every normal distribution has skewness 0 and kurtosis 3, so kurtosis is often reported as **excess kurtosis** $\beta_2 - 3$, here 1.505. Software differs on which one it prints under the name "kurtosis" (the NIST e-Handbook uses the plain fourth moment and calls the other excess kurtosis), so check before comparing numbers.

These two numbers explain a gap that the mean and variance alone can't. The normal $N(0.5, 0.475)$ matches the binomial's mean and variance exactly, yet it gives $P(Y \ge 2.5) = 0.0019$ against the binomial's $P(X \ge 3) = 0.0115$. The normal has skewness 0 and kurtosis 3; the binomial has 1.306 and 4.505. The first two moments fix location and scale, and the shape they leave free is what the third and fourth moments begin to describe.

## Kurtosis measures tails, not the peak

Kurtosis is often described as the "peakedness" of a distribution. That reading is wrong, and the reason takes one line. For the standardized variable $Z$, split the fourth moment at $|Z| = 1$:

$$
\beta_2 = E\big[Z^4;\ |Z| \le 1\big] + E\big[Z^4;\ |Z| > 1\big]
$$

Inside $|Z| \le 1$, $Z^4 \le 1$, so the first term is at most the probability of that region, which is at most 1. Whatever the peak looks like, it contributes less than 1 to the kurtosis; everything above that comes from values more than one standard deviation from the mean. The code below integrates three densities with mean 0 and variance 1, the uniform, the normal and the Laplace (double exponential), on a fine grid:

```python
import math

r2, r3 = math.sqrt(2), math.sqrt(3)
dens = {                         # each has mean 0, variance 1
    "uniform": lambda z: 1 / (2 * r3) if abs(z) <= r3 else 0.0,
    "normal": lambda z: math.exp(-z * z / 2) / math.sqrt(2 * math.pi),
    "Laplace": lambda z: math.exp(-r2 * abs(z)) / r2,
}
h = 1e-3
grid = [-20 + h * (i + 0.5) for i in range(40_000)]
for name, f in dens.items():
    w = [(z, f(z) * h) for z in grid]
    var = sum(z**2 * p for z, p in w)
    kurt = sum(z**4 * p for z, p in w)
    inner = sum(z**4 * p for z, p in w if abs(z) <= 1)
    tail = sum(p for z, p in w if abs(z) > 3)
    print(f"{name:8} var {var:.3f}  kurtosis {kurt:.3f}  "
          f"from |z|<=1 {inner:.3f}  P(|Z|>3) {tail:.4f}")
```

which prints:

```
uniform  var 1.000  kurtosis 1.800  from |z|<=1 0.115  P(|Z|>3) 0.0000
normal   var 1.000  kurtosis 3.000  from |z|<=1 0.112  P(|Z|>3) 0.0027
Laplace  var 1.000  kurtosis 6.000  from |z|<=1 0.089  P(|Z|>3) 0.0144
```

The region $|z| \le 1$ contributes 0.115, 0.112 and 0.089 to kurtosis values of 1.8, 3 and 6. The difference between the three is almost entirely in the tails, as the probability beyond three standard deviations shows: none for the uniform, 0.0027 for the normal and 0.0144 for the Laplace. The figure shows both views.

<svg viewBox="0 0 640 280" role="img" aria-label="Three densities with mean 0 and variance 1: uniform (kurtosis 1.8), normal (3) and Laplace (6). Left, on an ordinary scale from z = -4 to 4, the Laplace has the tallest, sharpest peak and the uniform is flat out to plus or minus 1.73. Right, the log of the density for z from 0 to 5: the uniform stops at 1.73, the normal falls off as a parabola, and the Laplace falls along a straight line and stays far above the normal beyond z = 3." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Uniform, normal and Laplace densities with variance 1, on linear and log scales</title>
  <rect x="44" y="20" width="256" height="210" fill="none" style="stroke: var(--rule)"/>
  <path d="M44.0 230.0 L116.6 230.0 L116.6 154.2 L227.4 154.2 L227.4 230.0 L300.0 230.0" fill="none" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <path d="M44.0 230.0 L45.6 230.0 L47.2 229.9 L48.8 229.9 L50.4 229.9 L52.0 229.9 L53.6 229.9 L55.2 229.9 L56.8 229.8 L58.4 229.8 L60.0 229.8 L61.6 229.7 L63.2 229.7 L64.8 229.6 L66.4 229.5 L68.0 229.5 L69.6 229.4 L71.2 229.3 L72.8 229.1 L74.4 229.0 L76.0 228.8 L77.6 228.7 L79.2 228.4 L80.8 228.2 L82.4 227.9 L84.0 227.6 L85.6 227.3 L87.2 226.9 L88.8 226.4 L90.4 225.9 L92.0 225.4 L93.6 224.8 L95.2 224.1 L96.8 223.4 L98.4 222.6 L100.0 221.7 L101.6 220.7 L103.2 219.6 L104.8 218.5 L106.4 217.2 L108.0 215.8 L109.6 214.4 L111.2 212.8 L112.8 211.1 L114.4 209.3 L116.0 207.4 L117.6 205.3 L119.2 203.2 L120.8 200.9 L122.4 198.5 L124.0 196.0 L125.6 193.4 L127.2 190.7 L128.8 187.9 L130.4 185.0 L132.0 182.1 L133.6 179.0 L135.2 175.9 L136.8 172.8 L138.4 169.7 L140.0 166.5 L141.6 163.3 L143.2 160.2 L144.8 157.0 L146.4 154.0 L148.0 151.0 L149.6 148.0 L151.2 145.2 L152.8 142.5 L154.4 140.0 L156.0 137.6 L157.6 135.4 L159.2 133.3 L160.8 131.5 L162.4 129.9 L164.0 128.5 L165.6 127.4 L167.2 126.4 L168.8 125.8 L170.4 125.4 L172.0 125.3 L173.6 125.4 L175.2 125.8 L176.8 126.4 L178.4 127.4 L180.0 128.5 L181.6 129.9 L183.2 131.5 L184.8 133.3 L186.4 135.4 L188.0 137.6 L189.6 140.0 L191.2 142.5 L192.8 145.2 L194.4 148.0 L196.0 151.0 L197.6 154.0 L199.2 157.0 L200.8 160.2 L202.4 163.3 L204.0 166.5 L205.6 169.7 L207.2 172.8 L208.8 175.9 L210.4 179.0 L212.0 182.1 L213.6 185.0 L215.2 187.9 L216.8 190.7 L218.4 193.4 L220.0 196.0 L221.6 198.5 L223.2 200.9 L224.8 203.2 L226.4 205.3 L228.0 207.4 L229.6 209.3 L231.2 211.1 L232.8 212.8 L234.4 214.4 L236.0 215.8 L237.6 217.2 L239.2 218.5 L240.8 219.6 L242.4 220.7 L244.0 221.7 L245.6 222.6 L247.2 223.4 L248.8 224.1 L250.4 224.8 L252.0 225.4 L253.6 225.9 L255.2 226.4 L256.8 226.9 L258.4 227.3 L260.0 227.6 L261.6 227.9 L263.2 228.2 L264.8 228.4 L266.4 228.7 L268.0 228.8 L269.6 229.0 L271.2 229.1 L272.8 229.3 L274.4 229.4 L276.0 229.5 L277.6 229.5 L279.2 229.6 L280.8 229.7 L282.4 229.7 L284.0 229.8 L285.6 229.8 L287.2 229.8 L288.8 229.9 L290.4 229.9 L292.0 229.9 L293.6 229.9 L295.2 229.9 L296.8 229.9 L298.4 230.0 L300.0 230.0" fill="none" style="stroke: var(--ink)" stroke-width="2" />
  <path d="M44.0 229.4 L45.6 229.3 L47.2 229.3 L48.8 229.2 L50.4 229.1 L52.0 229.1 L53.6 229.0 L55.2 228.9 L56.8 228.9 L58.4 228.8 L60.0 228.7 L61.6 228.6 L63.2 228.5 L64.8 228.4 L66.4 228.3 L68.0 228.1 L69.6 228.0 L71.2 227.8 L72.8 227.7 L74.4 227.5 L76.0 227.3 L77.6 227.1 L79.2 226.9 L80.8 226.7 L82.4 226.5 L84.0 226.2 L85.6 225.9 L87.2 225.6 L88.8 225.3 L90.4 225.0 L92.0 224.6 L93.6 224.2 L95.2 223.8 L96.8 223.3 L98.4 222.8 L100.0 222.3 L101.6 221.7 L103.2 221.1 L104.8 220.5 L106.4 219.8 L108.0 219.0 L109.6 218.2 L111.2 217.4 L112.8 216.4 L114.4 215.4 L116.0 214.4 L117.6 213.2 L119.2 212.0 L120.8 210.7 L122.4 209.3 L124.0 207.7 L125.6 206.1 L127.2 204.4 L128.8 202.5 L130.4 200.5 L132.0 198.3 L133.6 196.0 L135.2 193.5 L136.8 190.8 L138.4 188.0 L140.0 184.9 L141.6 181.6 L143.2 178.0 L144.8 174.2 L146.4 170.1 L148.0 165.7 L149.6 161.0 L151.2 156.0 L152.8 150.5 L154.4 144.7 L156.0 138.5 L157.6 131.8 L159.2 124.6 L160.8 116.9 L162.4 108.6 L164.0 99.7 L165.6 90.1 L167.2 79.9 L168.8 68.9 L170.4 57.1 L172.0 44.4 L173.6 57.1 L175.2 68.9 L176.8 79.9 L178.4 90.1 L180.0 99.7 L181.6 108.6 L183.2 116.9 L184.8 124.6 L186.4 131.8 L188.0 138.5 L189.6 144.7 L191.2 150.5 L192.8 156.0 L194.4 161.0 L196.0 165.7 L197.6 170.1 L199.2 174.2 L200.8 178.0 L202.4 181.6 L204.0 184.9 L205.6 188.0 L207.2 190.8 L208.8 193.5 L210.4 196.0 L212.0 198.3 L213.6 200.5 L215.2 202.5 L216.8 204.4 L218.4 206.1 L220.0 207.7 L221.6 209.3 L223.2 210.7 L224.8 212.0 L226.4 213.2 L228.0 214.4 L229.6 215.4 L231.2 216.4 L232.8 217.4 L234.4 218.2 L236.0 219.0 L237.6 219.8 L239.2 220.5 L240.8 221.1 L242.4 221.7 L244.0 222.3 L245.6 222.8 L247.2 223.3 L248.8 223.8 L250.4 224.2 L252.0 224.6 L253.6 225.0 L255.2 225.3 L256.8 225.6 L258.4 225.9 L260.0 226.2 L261.6 226.5 L263.2 226.7 L264.8 226.9 L266.4 227.1 L268.0 227.3 L269.6 227.5 L271.2 227.7 L272.8 227.8 L274.4 228.0 L276.0 228.1 L277.6 228.3 L279.2 228.4 L280.8 228.5 L282.4 228.6 L284.0 228.7 L285.6 228.8 L287.2 228.9 L288.8 228.9 L290.4 229.0 L292.0 229.1 L293.6 229.1 L295.2 229.2 L296.8 229.3 L298.4 229.3 L300.0 229.4" fill="none" style="stroke: var(--accent)" stroke-width="2" />
  <text x="44.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">-4</text>
  <text x="108.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">-2</text>
  <text x="172.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <text x="236.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">2</text>
  <text x="300.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">4</text>
  <text x="38" y="233.5" text-anchor="end" font-size="10" fill="currentColor">0.0</text>
  <text x="38" y="181.0" text-anchor="end" font-size="10" fill="currentColor">0.2</text>
  <text x="38" y="128.5" text-anchor="end" font-size="10" fill="currentColor">0.4</text>
  <text x="38" y="76.0" text-anchor="end" font-size="10" fill="currentColor">0.6</text>
  <text x="38" y="23.5" text-anchor="end" font-size="10" fill="currentColor">0.8</text>
  <text x="172.0" y="260" text-anchor="middle" font-size="12" fill="currentColor">z</text>
  <text x="44" y="12" font-size="12" fill="currentColor">density</text>
  <line x1="52" y1="36" x2="74" y2="36" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="79" y="40" font-size="10" fill="currentColor">uniform, 1.8</text>
  <line x1="52" y1="52" x2="74" y2="52" style="stroke: var(--ink)" stroke-width="2" />
  <text x="79" y="56" font-size="10" fill="currentColor">normal, 3</text>
  <line x1="52" y1="68" x2="74" y2="68" style="stroke: var(--accent)" stroke-width="2" />
  <text x="79" y="72" font-size="10" fill="currentColor">Laplace, 6</text>
  <rect x="380" y="20" width="240" height="210" fill="none" style="stroke: var(--rule)"/>
  <path d="M380.0 38.9 L463.1 38.9 L463.1 230" fill="none" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <path d="M380.0 34.0 L382.4 34.0 L384.8 34.0 L387.2 34.1 L389.6 34.3 L392.0 34.4 L394.4 34.7 L396.8 34.9 L399.2 35.2 L401.6 35.5 L404.0 35.9 L406.4 36.3 L408.8 36.7 L411.2 37.2 L413.6 37.7 L416.0 38.2 L418.4 38.8 L420.8 39.5 L423.2 40.1 L425.6 40.8 L428.0 41.6 L430.4 42.3 L432.8 43.2 L435.2 44.0 L437.6 44.9 L440.0 45.8 L442.4 46.8 L444.8 47.8 L447.2 48.9 L449.6 49.9 L452.0 51.1 L454.4 52.2 L456.8 53.4 L459.2 54.7 L461.6 55.9 L464.0 57.2 L466.4 58.6 L468.8 60.0 L471.2 61.4 L473.6 62.9 L476.0 64.4 L478.4 65.9 L480.8 67.5 L483.2 69.1 L485.6 70.8 L488.0 72.4 L490.4 74.2 L492.8 75.9 L495.2 77.7 L497.6 79.6 L500.0 81.5 L502.4 83.4 L504.8 85.3 L507.2 87.3 L509.6 89.4 L512.0 91.4 L514.4 93.6 L516.8 95.7 L519.2 97.9 L521.6 100.1 L524.0 102.4 L526.4 104.7 L528.8 107.0 L531.2 109.4 L533.6 111.8 L536.0 114.2 L538.4 116.7 L540.8 119.3 L543.2 121.8 L545.6 124.4 L548.0 127.1 L550.4 129.7 L552.8 132.5 L555.2 135.2 L557.6 138.0 L560.0 140.8 L562.4 143.7 L564.8 146.6 L567.2 149.6 L569.6 152.5 L572.0 155.6 L574.4 158.6 L576.8 161.7 L579.2 164.9 L581.6 168.0 L584.0 171.2 L586.4 174.5 L588.8 177.8 L591.2 181.1 L593.6 184.5 L596.0 187.9 L598.4 191.3 L600.8 194.8 L603.2 198.3 L605.6 201.9 L608.0 205.4 L610.4 209.1 L612.8 212.7 L615.2 216.4 L617.6 220.2 L620.0 224.0" fill="none" style="stroke: var(--ink)" stroke-width="2" />
  <path d="M380.0 25.3 L382.4 26.3 L384.8 27.4 L387.2 28.5 L389.6 29.6 L392.0 30.6 L394.4 31.7 L396.8 32.8 L399.2 33.9 L401.6 34.9 L404.0 36.0 L406.4 37.1 L408.8 38.2 L411.2 39.2 L413.6 40.3 L416.0 41.4 L418.4 42.5 L420.8 43.5 L423.2 44.6 L425.6 45.7 L428.0 46.8 L430.4 47.8 L432.8 48.9 L435.2 50.0 L437.6 51.1 L440.0 52.1 L442.4 53.2 L444.8 54.3 L447.2 55.4 L449.6 56.4 L452.0 57.5 L454.4 58.6 L456.8 59.7 L459.2 60.7 L461.6 61.8 L464.0 62.9 L466.4 64.0 L468.8 65.0 L471.2 66.1 L473.6 67.2 L476.0 68.3 L478.4 69.3 L480.8 70.4 L483.2 71.5 L485.6 72.6 L488.0 73.6 L490.4 74.7 L492.8 75.8 L495.2 76.9 L497.6 77.9 L500.0 79.0 L502.4 80.1 L504.8 81.2 L507.2 82.2 L509.6 83.3 L512.0 84.4 L514.4 85.5 L516.8 86.5 L519.2 87.6 L521.6 88.7 L524.0 89.8 L526.4 90.8 L528.8 91.9 L531.2 93.0 L533.6 94.1 L536.0 95.1 L538.4 96.2 L540.8 97.3 L543.2 98.4 L545.6 99.4 L548.0 100.5 L550.4 101.6 L552.8 102.7 L555.2 103.7 L557.6 104.8 L560.0 105.9 L562.4 107.0 L564.8 108.0 L567.2 109.1 L569.6 110.2 L572.0 111.3 L574.4 112.3 L576.8 113.4 L579.2 114.5 L581.6 115.6 L584.0 116.6 L586.4 117.7 L588.8 118.8 L591.2 119.9 L593.6 120.9 L596.0 122.0 L598.4 123.1 L600.8 124.2 L603.2 125.2 L605.6 126.3 L608.0 127.4 L610.4 128.5 L612.8 129.5 L615.2 130.6 L617.6 131.7 L620.0 132.8" fill="none" style="stroke: var(--accent)" stroke-width="2" />
  <text x="380.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <text x="428.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">1</text>
  <text x="476.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">2</text>
  <text x="524.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">3</text>
  <text x="572.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">4</text>
  <text x="620.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">5</text>
  <text x="374" y="23.5" text-anchor="end" font-size="10" fill="currentColor">1</text>
  <text x="374" y="93.5" text-anchor="end" font-size="10" fill="currentColor">10<tspan dy="-4" font-size="8">&#8722;2</tspan></text>
  <text x="374" y="163.5" text-anchor="end" font-size="10" fill="currentColor">10<tspan dy="-4" font-size="8">&#8722;4</tspan></text>
  <text x="374" y="233.5" text-anchor="end" font-size="10" fill="currentColor">10<tspan dy="-4" font-size="8">&#8722;6</tspan></text>
  <line x1="524.0" y1="20" x2="524.0" y2="230" style="stroke: var(--rule)" stroke-dasharray="3 3"/>
  <text x="500.0" y="260" text-anchor="middle" font-size="12" fill="currentColor">z</text>
  <text x="380" y="12" font-size="12" fill="currentColor">density, log scale</text>
</svg>

*Left, three densities with mean 0 and variance 1, labelled with their kurtosis. Right, the same densities for $z \ge 0$ on a log scale: the normal's log-density falls as a parabola and the Laplace's along a straight line, so beyond the dashed line at $z = 3$ the Laplace has far more probability. The Laplace also has the sharpest peak, but the code above shows the peak region adds less than 0.1 to its kurtosis.*

## Moment-generating functions

All the raw moments can be packed into one function. The **moment-generating function (MGF)** of $X$ is

$$
M(t) = E\big[e^{tX}\big] = \sum_{r=0}^{\infty} \frac{t^r}{r!}\, E[X^r]
$$

where the second form expands $e^{tX}$ as a power series. The $r$-th derivative at $t = 0$ picks out the $r$-th raw moment, $M^{(r)}(0) = E[X^r]$. For one Bernoulli trial, $M(t) = 1 - p + p e^t$. The MGF of a sum of independent variables is the product of their MGFs, because $e^{t(X+Y)} = e^{tX} e^{tY}$ and expectations of independent factors multiply, so the binomial, a sum of $n$ Bernoulli trials, has

$$
M(t) = \big(1 - p + p e^t\big)^n
$$

Differentiating once and twice and setting $t = 0$:

$$
M'(0) = np = 0.5
$$

$$
M''(0) = np + n(n-1)p^2 = 0.5 + 0.225 = 0.725
$$

which are the first two raw moments from the code. The product rule for sums makes the MGF the natural tool for sums of independent variables (Blitzstein and Hwang, 2019, chapter 6).

Its logarithm, $K(t) = \log M(t)$, is the **cumulant-generating function**, and its derivatives at zero are the **cumulants** $\kappa_r$. The first three are the mean, the variance and the third central moment; the fourth is $\kappa_4 = \mu_4 - 3\mu_2^2$, so excess kurtosis is $\kappa_4 / \kappa_2^2$. Because the logarithm turns the product into a sum, **cumulants of independent variables add**. For a sum of $n$ independent copies of one variable, $\kappa_3$ and $\kappa_2$ both grow by a factor $n$, so

$$
\text{skewness} = \frac{n\kappa_3}{(n\kappa_2)^{3/2}} = \frac{\gamma_1}{\sqrt n}
$$

and excess kurtosis falls as $1/n$. One Bernoulli(0.05) trial has skewness 4.129 and excess kurtosis 15.05, and dividing by $\sqrt{10}$ and 10 gives the binomial's 1.306 and 1.505, as the code above confirms. A normal $N(\mu, \sigma^2)$ has $K(t) = \mu t + \sigma^2 t^2/2$, so all its cumulants beyond the second are zero. Shrinking higher cumulants of a standardized sum is one way to see the central limit theorem at work: the sum's shape drifts toward the one shape whose higher cumulants vanish.

Moments don't always pin a distribution down. When the MGF is finite on an interval around $t = 0$, the moments determine the distribution (Blitzstein and Hwang, 2019, chapter 6). The lognormal has every moment finite but an MGF that is infinite for every $t > 0$, and Heyde (1963) showed that other distributions share all of its moments. The Cauchy has no mean at all. The *characteristic function* $E[e^{itX}]$, with $i$ the imaginary unit, exists for every distribution and is used in proofs when the MGF does not.

## The method of moments

Moments of data are averages. The $r$-th **sample moment** of $x_1, \dots, x_n$ is $\frac{1}{n} \sum_i x_i^r$, and the sample skewness and kurtosis are the same standardized ratios computed from sample central moments, with $n$ in the denominators (NIST e-Handbook, section 1.3.5.11). The **method of moments** fits a model by setting as many sample moments equal to the model's moments as there are parameters, and solving.

For a gamma distribution with shape $k$ and scale $\theta$, the mean is $k\theta$ and the variance $k\theta^2$. Setting them equal to the sample mean $\bar x$ and sample variance $s^2$ and solving gives

$$
\hat k = \frac{\bar x^2}{s^2}, \quad \hat\theta = \frac{s^2}{\bar x}
$$

in closed form. Maximum likelihood for the same model has no closed form for the shape: it solves $\log k - \psi(k) = \log \bar x - \overline{\log x}$, where $\psi$ is the digamma function, the derivative of $\log \Gamma$, and $\overline{\log x}$ is the mean of the logged data. The code fits one sample of 200 draws from a gamma with $k = 2$ and $\theta = 3$ both ways, then repeats the fit on 2,000 fresh samples to see how much each estimate varies:

```python
import math
import numpy as np

rng = np.random.default_rng(1)
k_true, theta_true, n = 2.0, 3.0, 200

def mom(x):                      # match mean k*theta, var k*theta^2
    m, v = x.mean(), x.var()
    return m * m / v, v / m

def digamma(a, h=1e-5):          # derivative of log Gamma
    return (math.lgamma(a + h) - math.lgamma(a - h)) / (2 * h)

def mle_shape(x):                # log k - digamma(k) = s
    s = math.log(x.mean()) - np.log(x).mean()
    lo, hi = 1e-3, 1e3
    for _ in range(60):          # bisection; left side decreases
        mid = math.sqrt(lo * hi)
        if math.log(mid) - digamma(mid) > s:
            lo = mid
        else:
            hi = mid
    return lo

x = rng.gamma(k_true, theta_true, size=n)   # [200]
z = (x - x.mean()) / x.std()
print(f"mean {x.mean():.3f}  var {x.var():.3f}  "
      f"skew {np.mean(z**3):.3f}  excess {np.mean(z**4) - 3:.3f}")
k_m, th_m = mom(x)
k_l = mle_shape(x)
print(f"MoM: k {k_m:.3f} theta {th_m:.3f}   "
      f"MLE: k {k_l:.3f} theta {x.mean() / k_l:.3f}")

reps = [rng.gamma(k_true, theta_true, size=n) for _ in range(2000)]
k_mom = np.array([mom(r)[0] for r in reps])
k_mle = np.array([mle_shape(r) for r in reps])
def skew(r):
    return np.mean(((r - r.mean()) / r.std())**3)
sk = np.array([skew(r) for r in reps])
print(f"sample skewness over 2000 samples: "
      f"mean {sk.mean():.3f}  sd {sk.std():.3f}")
for name, k in (("MoM", k_mom), ("MLE", k_mle)):
    print(f"{name} shape over 2000 samples: mean {k.mean():.3f}"
          f"  sd {k.std():.3f}")
```

which prints:

```
mean 5.632  var 13.862  skew 1.933  excess 7.675
MoM: k 2.288 theta 2.461   MLE: k 2.402 theta 2.344
sample skewness over 2000 samples: mean 1.352  sd 0.343
MoM shape over 2000 samples: mean 2.049  sd 0.244
MLE shape over 2000 samples: mean 2.034  sd 0.195
```

For the first sample, the method of moments gives $\hat k = 5.632^2 / 13.862 = 2.288$ and $\hat\theta = 13.862 / 5.632 = 2.461$; maximum likelihood gives 2.402 and 2.344. Over 2,000 samples both estimates centre near the true shape of 2, but the moment estimate has standard deviation 0.244 against 0.195. The ratio of variances is $0.244^2 / 0.195^2 = 1.57$, so if both variances fall as $1/n$ the method of moments needs about 1.57 times as many observations for the same precision in this setting. Maximum likelihood uses the whole likelihood; the method of moments uses only the first two moments, and the sample variance is sensitive to the long right tail.

<svg viewBox="0 0 640 260" role="img" aria-label="Histograms of the gamma shape estimate over 2000 simulated samples of 200 draws with true shape 2. The maximum likelihood estimates cluster more tightly around 2 (standard deviation 0.195) than the method of moments estimates (0.244)." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Spread of method-of-moments and maximum likelihood estimates of a gamma shape</title>
  <rect x="50" y="20" width="570" height="190" fill="none" style="stroke: var(--rule)"/>
  <path d="M50.0 210 L50.0 210.0 L71.9 210.0 L71.9 210.0 L93.8 210.0 L93.8 209.6 L115.8 209.6 L115.8 208.7 L137.7 208.7 L137.7 206.6 L159.6 206.6 L159.6 198.6 L181.5 198.6 L181.5 177.1 L203.5 177.1 L203.5 141.6 L225.4 141.6 L225.4 82.9 L247.3 82.9 L247.3 85.9 L269.2 85.9 L269.2 58.0 L291.2 58.0 L291.2 84.2 L313.1 84.2 L313.1 135.7 L335.0 135.7 L335.0 159.8 L356.9 159.8 L356.9 177.5 L378.8 177.5 L378.8 188.9 L400.8 188.9 L400.8 199.9 L422.7 199.9 L422.7 205.8 L444.6 205.8 L444.6 206.6 L466.5 206.6 L466.5 208.7 L488.5 208.7 L488.5 210.0 L510.4 210.0 L510.4 209.6 L532.3 209.6 L532.3 210.0 L554.2 210.0 L554.2 210.0 L576.2 210.0 L576.2 210.0 L598.1 210.0 L598.1 210.0 L620.0 210.0 L620.0 210" fill="none" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="5 3"/>
  <path d="M50.0 210 L50.0 210.0 L71.9 210.0 L71.9 210.0 L93.8 210.0 L93.8 210.0 L115.8 210.0 L115.8 210.0 L137.7 210.0 L137.7 209.6 L159.6 209.6 L159.6 208.3 L181.5 208.3 L181.5 193.1 L203.5 193.1 L203.5 143.3 L225.4 143.3 L225.4 69.0 L247.3 69.0 L247.3 47.9 L269.2 47.9 L269.2 41.5 L291.2 41.5 L291.2 72.4 L313.1 72.4 L313.1 136.1 L335.0 136.1 L335.0 170.3 L356.9 170.3 L356.9 187.6 L378.8 187.6 L378.8 201.6 L400.8 201.6 L400.8 207.0 L422.7 207.0 L422.7 208.7 L444.6 208.7 L444.6 209.6 L466.5 209.6 L466.5 210.0 L488.5 210.0 L488.5 210.0 L510.4 210.0 L510.4 210.0 L532.3 210.0 L532.3 209.6 L554.2 209.6 L554.2 210.0 L576.2 210.0 L576.2 210.0 L598.1 210.0 L598.1 210.0 L620.0 210.0 L620.0 210" fill="var(--accent)" fill-opacity="0.25" style="stroke: var(--accent)" stroke-width="2" />
  <line x1="269.2" y1="20" x2="269.2" y2="210" style="stroke: var(--ink)" stroke-dasharray="3 3"/>
  <text x="274.2" y="34" font-size="10" fill="currentColor">true k = 2</text>
  <text x="50.0" y="224" text-anchor="middle" font-size="10" fill="currentColor">1.0</text>
  <text x="159.6" y="224" text-anchor="middle" font-size="10" fill="currentColor">1.5</text>
  <text x="269.2" y="224" text-anchor="middle" font-size="10" fill="currentColor">2.0</text>
  <text x="378.8" y="224" text-anchor="middle" font-size="10" fill="currentColor">2.5</text>
  <text x="488.5" y="224" text-anchor="middle" font-size="10" fill="currentColor">3.0</text>
  <text x="598.1" y="224" text-anchor="middle" font-size="10" fill="currentColor">3.5</text>
  <text x="44" y="213.5" text-anchor="end" font-size="10" fill="currentColor">0</text>
  <text x="44" y="171.3" text-anchor="end" font-size="10" fill="currentColor">100</text>
  <text x="44" y="129.1" text-anchor="end" font-size="10" fill="currentColor">200</text>
  <text x="44" y="86.8" text-anchor="end" font-size="10" fill="currentColor">300</text>
  <text x="44" y="44.6" text-anchor="end" font-size="10" fill="currentColor">400</text>
  <text x="335.0" y="244" text-anchor="middle" font-size="12" fill="currentColor">estimated shape k</text>
  <text transform="translate(14 115) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">samples</text>
  <rect x="433.7" y="40" width="22" height="10" fill="var(--accent)" fill-opacity="0.25" style="stroke: var(--accent)" stroke-width="2"/>
  <text x="461.7" y="49" font-size="11" fill="currentColor">MLE, sd 0.195</text>
  <line x1="433.7" y1="66" x2="455.7" y2="66" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="461.7" y="70" font-size="11" fill="currentColor">MoM, sd 0.244</text>
</svg>

*The shape estimate from each of 2,000 simulated samples of 200 draws, true shape 2, in bins of width 0.1. Maximum likelihood (shaded) clusters more tightly than the method of moments (dashed).*

The same output shows how noisy higher sample moments are. The gamma with $k = 2$ has skewness $2/\sqrt{k} = 1.414$ and excess kurtosis $6/k = 3$, but the first sample gives 1.933 and 7.675, and across the 2,000 samples the sample skewness has mean 1.352 and standard deviation 0.343. A fourth power magnifies whatever a few large observations do, so a sample kurtosis from a few hundred points says little on its own.

The method of moments is still useful: it is fast, needs no iteration, and gives a starting point for the iterative search that maximum likelihood needs.

## Moments in machine learning

Two common deep learning components are moment estimators. **Adam** (Kingma and Ba, 2014) keeps, for every parameter, an exponential moving average of the gradient and of the squared gradient. The paper calls them estimates of the first moment (the mean) and the second raw moment (the uncentered variance) of the gradient, and each step divides the first by the square root of the second. Because the second moment is raw rather than central, a parameter whose gradient is consistently large and one whose gradient is noisy both get a large denominator.

**Batch normalization** (Ioffe and Szegedy, 2015) standardizes each feature with the first two moments of the current mini-batch, $\hat x = (x - \mu_B)/\sqrt{\sigma_B^2 + \epsilon}$, where $\mu_B$ and $\sigma_B^2$ are the mini-batch mean and variance (with denominator $m$, the batch size) and $\epsilon$ is a small constant for numerical safety. That is the standardization of the previous sections, with sample moments in place of true ones.

Moments also sit under likelihood theory: the score has first moment zero at the true parameter, and the Fisher information is its second moment, $E[s^2]$.

## Sources

- K. Pearson, "Contributions to the Mathematical Theory of Evolution", *Philosophical Transactions of the Royal Society of London, Series A* 185, 71–110 (1894). [doi:10.1098/rsta.1894.0003](https://doi.org/10.1098/rsta.1894.0003)
- B. P. Welford, "Note on a Method for Calculating Corrected Sums of Squares and Products", *Technometrics* 4(3), 419–420 (1962). [doi:10.1080/00401706.1962.10490022](https://doi.org/10.1080/00401706.1962.10490022)
- NIST/SEMATECH e-Handbook of Statistical Methods, "1.3.5.11. Measures of Skewness and Kurtosis". [itl.nist.gov, 1.3.5.11](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35b.htm)
- J. K. Blitzstein, J. Hwang, *Introduction to Probability*, 2nd ed., Chapman & Hall/CRC, 2019, chapter 6, "Moments". [doi:10.1201/9780429428357](https://doi.org/10.1201/9780429428357)
- C. C. Heyde, "On a Property of the Lognormal Distribution", *Journal of the Royal Statistical Society, Series B* 25(2), 392–393 (1963). [doi:10.1111/j.2517-6161.1963.tb00521.x](https://doi.org/10.1111/j.2517-6161.1963.tb00521.x)
- D. P. Kingma, J. Ba, "Adam: A Method for Stochastic Optimization", ICLR 2015. [arXiv:1412.6980](https://arxiv.org/abs/1412.6980)
- S. Ioffe, C. Szegedy, "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift" (2015). [arXiv:1502.03167](https://arxiv.org/abs/1502.03167)
