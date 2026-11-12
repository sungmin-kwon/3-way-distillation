---
title: Discrete and continuous distributions
summary: The split that organizes probability, countable outcomes vs. a continuous scale — PMF vs. PDF, the CDF as the common object, binomial, Poisson and normal worked end to end in Python, with means, variances, quantiles and a sampling check.
date: 2026-11-10
tags: [stats]
distillate: "A random quantity is described by a distribution: a mass function p(k) over countable outcomes when the variable is discrete, a density f(x) whose areas give probabilities when it is continuous, and a cumulative distribution F(x) = P(X ≤ x) that covers both. In the worked example, 10 independent tests at p = 0.05 each give a hit count X ~ Binomial(10, 0.05) with P(X ≥ 1) = 0.4013, while a standardized statistic under the null is Z ~ N(0, 1) with P(|Z| > 1.96) = 0.0500; the Poisson(0.5) approximates the first at 0.3935. Means and variances summarize a distribution (np = 0.5 and np(1-p) = 0.475 for the binomial, μ and σ² for the normal) but two distributions can share them and still differ in the tails."
model: [Mistral Large 4]
---

A **probability distribution** assigns probabilities to the possible outcomes of a random quantity. The outcomes come in two kinds. If they are countable, a list of numbers: how many tests out of ten come back significant, the number on a die, the count of calls in an hour, the variable is *discrete* and the distribution is a **probability mass function (PMF)**. If the outcome is a measurement on a continuous scale, a temperature, a concentration, a reaction time, the variable is *continuous* and the distribution is a **probability density function (PDF)**. Much of applied statistics and machine learning rests on one of these: the p-values of a genome-wide scan are draws from a known distribution under the null hypothesis, and a language model's next-token probabilities are a discrete distribution over a vocabulary.

The families have deep roots: the binomial goes back to Bernoulli's *Ars Conjectandi* (1713), De Moivre derived the normal curve in 1733 as an approximation to the binomial, Laplace generalized it in 1812, Gauss made it the model of measurement error in 1809, and Poisson introduced his count distribution in 1837 (Hald, 2007). The NIST e-Handbook's gallery lists the common ones, split into exactly these two groups (NIST/SEMATECH e-Handbook, section 1.3.6.6).

The note carries one worked example of each kind through every section:

| | value |
| --- | --- |
| $X$: significant results among 10 independent null tests, per-test level $\alpha = 0.05$ | Binomial(10, 0.05) |
| $Z$: a standardized test statistic under the null | N(0, 1) |

## Discrete distributions: the PMF

A discrete random variable $X$ takes values in a countable set, here the integers $k = 0, 1, \dots, n$. Its **PMF** is $p(k) = P(X = k)$: each value is non-negative and together they sum to one,

$$
\sum_k p(k) = 1
$$

The simplest case is the **Bernoulli** variable: one trial with success probability $p$, so $p(1) = p$ and $p(0) = 1 - p$. The sum of $n$ independent Bernoulli trials with the same $p$ is **Binomial(n, p)**, where $n$ is the number of trials and $p$ the per-trial success probability:

$$
P(X = k) = \binom{n}{k} p^{k} (1-p)^{n-k}
$$

For the running example, $n = 10$ and $p = 0.05$, so the probability of at least one hit is

$$
P(X \ge 1) = 1 - (1-p)^{n} = 1 - 0.95^{10} = 0.4013
$$

Ten tests that are all truly null still produce at least one "significant" result 40% of the time. That probability is the **family-wise error rate**, and it is why genome-wide studies set their bar far below 0.05. A Bonferroni correction divides the level by the number of tests $m$, here $0.05 / 10 = 0.005$ per test, giving

$$
P(X \ge 1) = 1 - 0.995^{10} = 0.0489 \le 0.05
$$

The binomial's mean and variance follow from its construction as a sum of $n$ Bernoulli variables: $\mu = np = 0.5$ and $\sigma^2 = np(1-p) = 0.475$ (NIST e-Handbook, binomial page).

When events are rare, so that $n$ is large, $p$ is small and $np$ stays moderate, the binomial is well approximated by the **Poisson** distribution with $\lambda = np$, the expected count:

$$
p(k) = e^{-\lambda} \frac{\lambda^{k}}{k!}
$$

Here $\lambda = 0.5$ and

$$
P(X \ge 1) = 1 - e^{-0.5} = 0.3935
$$

against the exact binomial 0.4013, while $P(X = 1)$ is 0.3033 against 0.3151. This "law of rare events" is why the Poisson models counts: calls per hour, mutations per genome, hits per scan. Its mean and variance are both $\lambda$ (NIST e-Handbook, Poisson page).

## Continuous distributions: the PDF

A continuous variable $X$ takes values in an interval of the real line. Its **PDF** $f(x)$ satisfies $f(x) \ge 0$ and $\int_{-\infty}^{\infty} f(x)\, dx = 1$, but $f(x)$ itself is not a probability: $P(X = x) = 0$ for any single value, and probabilities are areas (Blitzstein and Hwang, 2019),

$$
P(a \le X \le b) = \int_a^b f(x)\, dx
$$

A density can exceed 1; only the area is constrained. The other two families you meet first are the *uniform*, flat on an interval, and the *exponential*, $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$, the distribution of waiting times (NIST e-Handbook, section 1.3.6.6).

The **normal** (or Gaussian) distribution, written $N(\mu, \sigma^2)$ with mean $\mu$ and variance $\sigma^2$ (standard deviation $\sigma$), has density

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

The case $\mu = 0$, $\sigma^2 = 1$ is the **standard normal**, with density $\phi(z) = e^{-z^2/2} / \sqrt{2\pi}$ and CDF $\Phi(z)$. For the running example $Z \sim N(0, 1)$:

$$
P(|Z| > 1.96) = 2\,(1 - \Phi(1.96)) = 0.0500
$$

$$
P(Z > 1.645) = 1 - \Phi(1.645) = 0.0500
$$

so 1.96 is the two-sided 5% critical value and 1.645 the one-sided one. The 68–95–99.7 rule is the same computation at other cutoffs: $P(|Z| \le 1) = 0.6827$, $P(|Z| \le 2) = 0.9545$, $P(|Z| \le 3) = 0.9973$.

Why is the normal everywhere? The **central limit theorem** says the mean of many independent, comparable-sized contributions is approximately normal whatever the original distribution is, which is why averages of measurements look bell-shaped (NIST e-Handbook, normal page). De Moivre's 1733 result is the special case for binomials: when $n$ is large and $p$ is not near 0 or 1, Binomial(n, p) is approximately $N(np,\, np(1-p))$. The code below checks how good that is: for Binomial(100, 0.5), $P(X \ge 60)$ is 0.0284 exactly, 0.0287 with the continuity correction (compare against $Z = (59.5 - 50)/5 = 1.90$) and 0.0228 without it. For the running Binomial(10, 0.05), though, $np = 0.5$ is far from that regime: the distribution is skewed, and the Poisson, not the normal, is the right approximation there.

## The CDF covers both

The object that treats both kinds the same way is the **cumulative distribution function (CDF)** $F(x) = P(X \le x)$. For a discrete variable it is a step function that jumps by $p(k)$ at each attainable $k$:

$$
F(x) = \sum_{k \le x} p(k)
$$

For a continuous variable it is the running area under the density:

$$
F(x) = \int_{-\infty}^{x} f(t)\, dt
$$

Either way $F$ is non-decreasing, right-continuous, and runs from 0 to 1. For the running binomial, $F(0) = 0.5987$, $F(1) = 0.9139$ and $F(2) = 0.9885$, so ten null tests produce at most two hits in 98.85% of runs.

The inverse direction, the **quantile function** $Q(u) = \inf\{x : F(x) \ge u\}$, answers "which value is exceeded with probability $1 - u$?". For the standard normal, $Q(0.95) = 1.645$ and $Q(0.975) = 1.96$. QQ plots, such as those that check a genome-wide scan, plot the quantiles of an observed sample against the quantiles of a reference distribution; if the sample really comes from that distribution, the points fall on the diagonal.

## Means and variances summarize, not determine

The two numbers usually quoted for a distribution are its **mean** $\mu = E[X]$ and its **variance** $\sigma^2 = \operatorname{Var}(X) = E[(X - \mu)^2]$. The expectation is a sum over outcomes for a discrete variable and an integral for a continuous one:

$$
E[X] = \sum_k k\, p(k) \quad \text{(discrete)}
$$

$$
E[X] = \int x f(x)\, dx \quad \text{(continuous)}
$$

For the running binomial, $\mu = np = 0.5$ and $\sigma^2 = np(1-p) = 0.475$; for the normal they are exactly the parameters $\mu$ and $\sigma^2$ (NIST e-Handbook, normal page).

But the pair $(\mu, \sigma^2)$ does not determine a distribution. The normal $N(0.5, 0.475)$, with standard deviation $\sigma = 0.6892$, has exactly the binomial's mean and variance, yet it puts 0.2341 of its probability below zero, where a count can't go, and its upper tail is far too thin: $P(Y \ge 2.5) = 0.0019$ with the continuity correction, against the binomial's $P(X \ge 3) = 0.0115$. The Poisson(0.5) is closer, since it shares the mean and nearly the variance (0.5 against 0.475), and it gives 0.0144. The distribution is the object, and the moments are a summary.

## Sampling makes it concrete

The numbers above are exact, but a distribution is also something to draw from. The code below computes them using only the standard library, then simulates 100,000 draws of each running example, seeded so the output is reproducible:

```python
import math
import random

n, p = 10, 0.05                       # 10 independent null tests, each at alpha = 0.05
binom = lambda k: math.comb(n, k) * p**k * (1 - p) ** (n - k)
pois = lambda k, lam: math.exp(-lam) * lam**k / math.factorial(k)   # lam = n * p
Phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))              # standard normal CDF

print("Binomial(10, 0.05):")
for k in range(4):
    print(f"  P(X={k}) = {binom(k):.4f}")
print(f"  P(X>=1) = {1 - binom(0):.4f},  P(X>=3) = {sum(binom(k) for k in range(3, 11)):.4f}")
print(f"  mean = {n*p},  variance = {n*p*(1-p):.3f}")
print(f"Poisson(0.5): P(X=1) = {pois(1, 0.5):.4f},  "
      f"P(X>=1) = {1 - pois(0, 0.5):.4f},  "
      f"P(X>=3) = {sum(pois(k, 0.5) for k in range(3, 20)):.4f}")
print(f"Bonferroni (per-test 0.005): P(X>=1) = {1 - 0.995**n:.4f}")
print(f"Normal(0,1): P(|Z|>1.96) = {2*(1 - Phi(1.96)):.4f},  "
      f"P(Z>1.645) = {1 - Phi(1.645):.4f}")
print(f"  P(|Z|<=1) = {Phi(1) - Phi(-1):.4f},  P(|Z|<=2) = {Phi(2) - Phi(-2):.4f},  "
      f"P(|Z|<=3) = {Phi(3) - Phi(-3):.4f}")

# normal approximation to Binomial(100, 0.5), with and without continuity correction
exact = sum(math.comb(100, k) * 0.5**100 for k in range(60, 101))
print(f"Binomial(100, 0.5) P(X>=60): exact {exact:.4f}, "
      f"normal cc {1 - Phi((59.5 - 50) / 5):.4f}, no cc {1 - Phi((60 - 50) / 5):.4f}")

# a normal with the running binomial's mean and variance, N(0.5, 0.475)
sig = math.sqrt(0.475)
print(f"N(0.5, 0.475): sd {sig:.4f}, P(Y<0) = {Phi(-0.5/sig):.4f}, "
      f"P(Y>=2.5) = {1 - Phi(2.0/sig):.4f}")

rng = random.Random(1)
trials = 100_000
# draws from Binomial(10, 0.05) and from N(0, 1)
x = [sum(rng.random() < p for _ in range(n)) for _ in range(trials)]
z = [rng.gauss(0, 1) for _ in range(trials)]
mx = sum(x) / trials
print(f"sampled {trials:,} draws: X mean {mx:.3f}, "
      f"P(X>=1) {sum(v >= 1 for v in x)/trials:.4f}")
mz = sum(z) / trials
sd = (sum((v - mz)**2 for v in z) / trials) ** 0.5
print(f"                    Z mean {mz:.3f}, sd {sd:.3f}, "
      f"P(|Z|>1.96) {sum(abs(v) > 1.96 for v in z)/trials:.4f}")
```

which prints:

```
Binomial(10, 0.05):
  P(X=0) = 0.5987
  P(X=1) = 0.3151
  P(X=2) = 0.0746
  P(X=3) = 0.0105
  P(X>=1) = 0.4013,  P(X>=3) = 0.0115
  mean = 0.5,  variance = 0.475
Poisson(0.5): P(X=1) = 0.3033,  P(X>=1) = 0.3935,  P(X>=3) = 0.0144
Bonferroni (per-test 0.005): P(X>=1) = 0.0489
Normal(0,1): P(|Z|>1.96) = 0.0500,  P(Z>1.645) = 0.0500
  P(|Z|<=1) = 0.6827,  P(|Z|<=2) = 0.9545,  P(|Z|<=3) = 0.9973
Binomial(100, 0.5) P(X>=60): exact 0.0284, normal cc 0.0287, no cc 0.0228
N(0.5, 0.475): sd 0.6892, P(Y<0) = 0.2341, P(Y>=2.5) = 0.0019
sampled 100,000 draws: X mean 0.498, P(X>=1) 0.4000
                    Z mean 0.002, sd 0.998, P(|Z|>1.96) 0.0504
```

The empirical frequencies land within sampling noise of the exact values: $P(X \ge 1)$ comes out 0.4000 against 0.4013, and $P(|Z| > 1.96)$ comes out 0.0504 against 0.0500, with the sample mean of $X$ at 0.498 against 0.5 and the sample standard deviation of $Z$ at 0.998 against 1. The figure shows the same two distributions:

<svg viewBox="0 0 640 280" role="img" aria-label="Two panels. Left: bar chart of the Binomial(10, 0.05) probability mass function with P(X=0) = 0.5987, P(X=1) = 0.3151, P(X=2) = 0.0746 and smaller bars after; the tail beyond zero sums to 0.4013. Right: the standard normal density with the two tails beyond plus or minus 1.96 shaded, together holding 0.0500 of the probability." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Binomial(10, 0.05) PMF and N(0, 1) density with the 5% tails shaded</title>
  <text x="44" y="12" font-size="12" fill="currentColor">Binomial(10, 0.05) PMF</text>
  <rect x="44" y="20" width="256" height="210" fill="none" style="stroke: var(--rule)"/>
  <text x="38" y="233.5" text-anchor="end" font-size="10" fill="currentColor">0.0</text>
  <text x="38" y="173.5" text-anchor="end" font-size="10" fill="currentColor">0.2</text>
  <text x="38" y="113.5" text-anchor="end" font-size="10" fill="currentColor">0.4</text>
  <text x="38" y="53.5" text-anchor="end" font-size="10" fill="currentColor">0.6</text>
  <rect x="50.3" y="50.4" width="30" height="179.6" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="65.3" y="244" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <rect x="93.0" y="135.5" width="30" height="94.5" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="108.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">1</text>
  <rect x="135.7" y="207.6" width="30" height="22.4" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="150.7" y="244" text-anchor="middle" font-size="10" fill="currentColor">2</text>
  <rect x="178.3" y="226.9" width="30" height="3.1" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="193.3" y="244" text-anchor="middle" font-size="10" fill="currentColor">3</text>
  <rect x="221.0" y="229.7" width="30" height="0.3" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="236.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">4</text>
  <rect x="263.7" y="230.0" width="30" height="0.0" fill="var(--accent)" fill-opacity="0.75"/>
  <text x="278.7" y="244" text-anchor="middle" font-size="10" fill="currentColor">5</text>
  <text x="172.0" y="260" text-anchor="middle" font-size="12" fill="currentColor">k</text>
  <text transform="translate(13 125.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">P(X=k)</text>
  <text x="292" y="36" text-anchor="end" font-size="10" fill="currentColor">P(X &#8805; 1) = 0.4013</text>
  <text x="380" y="12" font-size="12" fill="currentColor">N(0, 1) density</text>
  <rect x="380" y="20" width="240" height="210" fill="none" style="stroke: var(--rule)"/>
  <path d="M380.0 230.0 L380.0 229.6 L381.3 229.5 L382.6 229.5 L384.0 229.4 L385.3 229.3 L386.6 229.2 L387.9 229.1 L389.2 229.0 L390.6 228.9 L391.9 228.7 L393.2 228.5 L394.5 228.4 L395.8 228.2 L397.2 227.9 L398.5 227.7 L399.8 227.4 L401.1 227.1 L402.4 226.8 L403.8 226.4 L405.1 226.0 L406.4 225.5 L407.7 225.0 L409.0 224.5 L410.4 223.9 L411.7 223.3 L413.0 222.6 L414.3 221.8 L415.6 221.0 L417.0 220.1 L418.3 219.1 L419.6 218.1 L420.9 217.0 L422.2 215.8 L423.6 214.5 L424.9 213.1 L426.2 211.6 L427.5 210.1 L428.8 208.4 L430.2 206.6 L431.5 204.7 L432.8 202.7 L432.8 230.0 Z" fill="var(--accent)" fill-opacity="0.18"/>
  <path d="M567.2 230.0 L567.2 202.7 L568.5 204.7 L569.8 206.6 L571.2 208.4 L572.5 210.1 L573.8 211.6 L575.1 213.1 L576.4 214.5 L577.8 215.8 L579.1 217.0 L580.4 218.1 L581.7 219.1 L583.0 220.1 L584.4 221.0 L585.7 221.8 L587.0 222.6 L588.3 223.3 L589.6 223.9 L591.0 224.5 L592.3 225.0 L593.6 225.5 L594.9 226.0 L596.2 226.4 L597.6 226.8 L598.9 227.1 L600.2 227.4 L601.5 227.7 L602.8 227.9 L604.2 228.2 L605.5 228.4 L606.8 228.5 L608.1 228.7 L609.4 228.9 L610.8 229.0 L612.1 229.1 L613.4 229.2 L614.7 229.3 L616.0 229.4 L617.4 229.5 L618.7 229.5 L620.0 229.6 L620.0 230.0 Z" fill="var(--accent)" fill-opacity="0.18"/>
  <path d="M380.0 229.6 L382.4 229.5 L384.8 229.3 L387.2 229.2 L389.6 229.0 L392.0 228.7 L394.4 228.4 L396.8 228.0 L399.2 227.5 L401.6 227.0 L404.0 226.3 L406.4 225.5 L408.8 224.6 L411.2 223.5 L413.6 222.2 L416.0 220.7 L418.4 219.0 L420.8 217.1 L423.2 214.9 L425.6 212.3 L428.0 209.5 L430.4 206.3 L432.8 202.7 L435.2 198.8 L437.6 194.5 L440.0 189.7 L442.4 184.6 L444.8 179.1 L447.2 173.1 L449.6 166.8 L452.0 160.1 L454.4 153.1 L456.8 145.8 L459.2 138.3 L461.6 130.6 L464.0 122.7 L466.4 114.8 L468.8 106.9 L471.2 99.2 L473.6 91.6 L476.0 84.3 L478.4 77.3 L480.8 70.8 L483.2 64.9 L485.6 59.5 L488.0 54.9 L490.4 51.0 L492.8 47.9 L495.2 45.6 L497.6 44.3 L500.0 43.8 L502.4 44.3 L504.8 45.6 L507.2 47.9 L509.6 51.0 L512.0 54.9 L514.4 59.5 L516.8 64.9 L519.2 70.8 L521.6 77.3 L524.0 84.3 L526.4 91.6 L528.8 99.2 L531.2 106.9 L533.6 114.8 L536.0 122.7 L538.4 130.6 L540.8 138.3 L543.2 145.8 L545.6 153.1 L548.0 160.1 L550.4 166.8 L552.8 173.1 L555.2 179.1 L557.6 184.6 L560.0 189.7 L562.4 194.5 L564.8 198.8 L567.2 202.7 L569.6 206.3 L572.0 209.5 L574.4 212.3 L576.8 214.9 L579.2 217.1 L581.6 219.0 L584.0 220.7 L586.4 222.2 L588.8 223.5 L591.2 224.6 L593.6 225.5 L596.0 226.3 L598.4 227.0 L600.8 227.5 L603.2 228.0 L605.6 228.4 L608.0 228.7 L610.4 229.0 L612.8 229.2 L615.2 229.3 L617.6 229.5 L620.0 229.6" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <line x1="432.8" y1="230" x2="432.8" y2="202.7" style="stroke: var(--muted)" stroke-dasharray="3 3"/>
  <text x="432.8" y="244" text-anchor="middle" font-size="10" fill="currentColor">-1.96</text>
  <line x1="567.2" y1="230" x2="567.2" y2="202.7" style="stroke: var(--muted)" stroke-dasharray="3 3"/>
  <text x="567.2" y="244" text-anchor="middle" font-size="10" fill="currentColor">1.96</text>
  <text x="397.1" y="244" text-anchor="middle" font-size="10" fill="currentColor">-3</text>
  <text x="465.7" y="244" text-anchor="middle" font-size="10" fill="currentColor">-1</text>
  <text x="500.0" y="244" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <text x="534.3" y="244" text-anchor="middle" font-size="10" fill="currentColor">1</text>
  <text x="602.9" y="244" text-anchor="middle" font-size="10" fill="currentColor">3</text>
  <text x="374" y="233.5" text-anchor="end" font-size="10" fill="currentColor">0.0</text>
  <text x="374" y="140.2" text-anchor="end" font-size="10" fill="currentColor">0.2</text>
  <text x="374" y="46.8" text-anchor="end" font-size="10" fill="currentColor">0.4</text>
  <text x="500.0" y="260" text-anchor="middle" font-size="12" fill="currentColor">z</text>
  <text transform="translate(350 125.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">density</text>
  <text x="612" y="36" text-anchor="end" font-size="10" fill="currentColor">5% in the shaded tails</text>
</svg>

*Left, the Binomial(10, 0.05) PMF from the code above: $P(X = 0) = 0.5987$, and the tail $P(X \ge 1) = 0.4013$. Right, the $N(0, 1)$ density; the shaded areas beyond $\pm 1.96$ hold 0.0500 of the probability, 0.0250 per tail.*

## Summary

A random quantity needs a distribution, and the split is over the outcomes: countable outcomes get a PMF whose values are probabilities and sum to 1, continuous outcomes get a PDF whose areas are probabilities and which integrates to 1. The CDF $F(x) = P(X \le x)$ and its inverse, the quantile function, cover both kinds; means and variances summarize but do not determine the shape; and any claim about a distribution can be checked by sampling from it, as the code above does. Which family to use is a modeling decision: the binomial for counts of independent trials, the Poisson for rare events, the normal for averages and measurements, and a wrong choice shows up first in the tails, as the Binomial(10, 0.05) versus Poisson(0.5) comparison shows.

## Sources

- NIST/SEMATECH e-Handbook of Statistical Methods, "1.3.6.6. Gallery of Distributions". [itl.nist.gov, 1.3.6.6](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm)
- NIST/SEMATECH e-Handbook of Statistical Methods, "1.3.6.6.1. Normal Distribution" (density, CDF, central limit theorem, moments). [itl.nist.gov, 1.3.6.6.1](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm)
- NIST/SEMATECH e-Handbook of Statistical Methods, "1.3.6.6.18. Binomial Distribution" (PMF, mean np). [itl.nist.gov, 1.3.6.6.18](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm)
- NIST/SEMATECH e-Handbook of Statistical Methods, "1.3.6.6.19. Poisson Distribution" (PMF, mean λ). [itl.nist.gov, 1.3.6.6.19](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm)
- J. K. Blitzstein, J. Hwang, *Introduction to Probability*, 2nd ed., Chapman & Hall/CRC, 2019. [doi:10.1201/9780429428357](https://doi.org/10.1201/9780429428357)
- A. Hald, *A History of Parametric Statistical Inference from Bernoulli to Fisher, 1713–1935*, Springer, 2007. [doi:10.1007/978-0-387-46409-1](https://doi.org/10.1007/978-0-387-46409-1)
