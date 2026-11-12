---
title: Likelihood and Fisher information
summary: How well a parameter value explains the data, and how sharply the data pin it down — likelihood and log-likelihood, cross-entropy as negative log-likelihood, Fisher information, standard errors and Wald intervals, and where the Fisher matrix turns up in machine learning (natural gradient, EWC, Laplace approximations).
date: 2026-11-12
tags: [stats]
distillate: "The likelihood L(θ) is the probability of the observed data read as a function of the parameter, and the maximum likelihood estimate is the value that maximizes it; minimizing cross-entropy loss is the same thing. The Fisher information is the curvature of the log-likelihood, so its inverse square root is the standard error that statistics software reports. For 6 successes in 20 trials, p̂ = 0.3 with Fisher information 95.2 and SE 0.1025, so the Wald 95% interval is (0.099, 0.501) while the likelihood-ratio interval is (0.132, 0.517); the two differ because the log-likelihood is not a parabola at this sample size."
model: [Claude Opus 5.5]
---

A statistical model gives a probability for each possible data set once its parameters are fixed. Turned around, with the data fixed and the parameter free, the same formula is the **likelihood**: a score for how well each parameter value explains what was observed. Fisher set out the method of maximum likelihood in his 1922 paper on the foundations of statistics, and in 1925 worked with the quantity now called the **Fisher information**, which measures how sharply the likelihood singles out one value (Stigler, 2007). Between them, the two ideas produce most of the numbers a fitted model reports: the estimate, its standard error, its confidence interval, and, in machine learning, the training loss.

The note carries one worked example throughout, then fits one regression to show the same machinery in a model with two parameters:

| | value |
| --- | --- |
| trials $n$ | 20 |
| successes $k$ | 6 |
| model | each trial succeeds independently with probability $p$ |

## The likelihood

For independent trials that each succeed with probability $p$, the probability of a particular sequence with $k$ successes in $n$ trials is $p^k (1-p)^{n-k}$. Read as a function of $p$ with $k = 6$ and $n = 20$ held fixed, this is the likelihood:

$$
L(p) = p^{6}\,(1-p)^{14}
$$

The likelihood is **not a probability distribution over $p$**. It is a probability of the data, evaluated at different parameter values, and it need not integrate to 1 over $p$. Only ratios matter: $L(0.3)/L(0.5)$ says how many times better $p = 0.3$ explains these 20 trials than $p = 0.5$ does. For the same reason the binomial coefficient $\binom{20}{6}$, which doesn't depend on $p$, can be dropped without changing anything that follows.

The **maximum likelihood estimate (MLE)** $\hat p$ is the value that makes $L$ largest. Here it is the observed proportion, $\hat p = 6/20 = 0.3$.

## The log-likelihood and the score

Likelihoods are products over observations, so in practice one works with the **log-likelihood** $\ell(p) = \log L(p)$, which turns the product into a sum and has the same maximizer. With natural logs the unit is nats:

$$
\ell(p) = k \log p + (n-k) \log(1-p)
$$

Its derivative with respect to the parameter is the **score**,

$$
s(p) = \frac{d\ell}{dp} = \frac{k}{p} - \frac{n-k}{1-p}
$$

Setting $s(p) = 0$ gives $\hat p = k/n$, the MLE again.

At the true parameter value, the score has **mean zero** over repeated data sets. The proof is short. Write $f(x; \theta)$ for the probability or density of one observation $x$, and $s = \partial \log f / \partial \theta$ for its score. Since $\partial \log f / \partial \theta = (\partial f / \partial \theta) / f$, the $f$ in the expectation cancels:

$$
E[s] = \int \frac{\partial f / \partial \theta}{f}\, f \, dx = \int \frac{\partial f}{\partial \theta}\, dx
$$

$$
= \frac{\partial}{\partial \theta} \int f \, dx = \frac{\partial}{\partial \theta}\, 1 = 0
$$

The step that moves the derivative outside the integral is where the *regularity conditions* come in: the set of possible $x$ must not depend on $\theta$, and $f$ must be smooth enough in $\theta$. A uniform on $[0, \theta]$ fails the first condition, and its score does not have mean zero. For a discrete variable the integral is a sum. For one Bernoulli trial, with $s = 1/p$ when $y = 1$ and $s = -1/(1-p)$ when $y = 0$, the check is $E[s] = p \cdot \tfrac{1}{p} - (1-p) \cdot \tfrac{1}{1-p} = 0$. The score of $n$ independent observations is the sum of their scores, so it has mean zero too. That fact is what the Fisher information is built on.

The code below computes the quantities used in the next three sections, using only the standard library:

```python
import math

n, k = 20, 6                     # 20 trials, 6 successes
p_hat = k / n

def loglik(p):                   # Bernoulli log-likelihood, nats
    return k * math.log(p) + (n - k) * math.log(1 - p)

def score(p):                    # d loglik / dp
    return k / p - (n - k) / (1 - p)

info = n / (p_hat * (1 - p_hat))  # Fisher information I_n(p_hat)
se = 1 / math.sqrt(info)
print(f"p_hat {p_hat}, loglik {loglik(p_hat):.4f}, "
      f"score {score(p_hat):.1e}")
print(f"mean NLL at p_hat {-loglik(p_hat)/n:.4f}, "
      f"at 0.5 {-loglik(0.5)/n:.4f}")
kl = .3 * math.log(.3 / .5) + .7 * math.log(.7 / .5)
print(f"KL(Bern(0.3) || Bern(0.5)) {kl:.4f}")
print(f"I_n(p_hat) {info:.1f}, SE {se:.4f}")
print(f"Wald 95% CI ({p_hat - 1.96*se:.3f}, "
      f"{p_hat + 1.96*se:.3f})")

def lr_end(lo, hi):              # where 2*(l(p_hat)-l(p)) = 3.84
    f = lambda p: 2 * (loglik(p_hat) - loglik(p)) - 3.8415
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if f(lo) * f(mid) > 0 else (lo, mid)
    return lo
print(f"LR 95% CI ({lr_end(1e-9, p_hat):.3f}, "
      f"{lr_end(p_hat, 1 - 1e-9):.3f})")
```

which prints:

```
p_hat 0.3, loglik -12.2173, score 0.0e+00
mean NLL at p_hat 0.6109, at 0.5 0.6931
KL(Bern(0.3) || Bern(0.5)) 0.0823
I_n(p_hat) 95.2, SE 0.1025
Wald 95% CI (0.099, 0.501)
LR 95% CI (0.132, 0.517)
```

## Cross-entropy is negative log-likelihood

Divide $-\ell$ by the number of observations and the result is the **mean negative log-likelihood**. For a model that outputs a probability $q_i$ for each observed label $y_i \in \{0, 1\}$, it is

$$
-\frac{1}{n}\sum_{i=1}^{n} \big[\,y_i \log q_i + (1-y_i)\log(1-q_i)\,\big]
$$

which is exactly the **binary cross-entropy** loss used to train classifiers. With more than two classes and a softmax output it becomes $-\frac{1}{n}\sum_i \log q_{i, y_i}$, the probability the model gave to the label that actually occurred, which is the standard loss for classifiers and for next-token prediction in language models. So minimizing cross-entropy is maximum likelihood estimation, and a reported training loss in nats is a mean negative log-likelihood.

In the worked example, the loss at $\hat p = 0.3$ is 0.6109 nats per trial, and at $p = 0.5$ it is $\log 2 = 0.6931$. The minimum is not zero: it equals the entropy of the observed 30/70 split. The gap above the minimum is the Kullback–Leibler divergence from the data's proportions to the model's, here $\mathrm{KL}(\text{Bern}(0.3)\,\|\,\text{Bern}(0.5)) = 0.0823$ nats. That decomposition holds in general: cross-entropy equals the entropy of the empirical distribution, which the model can't change, plus the KL divergence, which training drives down.

## Fisher information is curvature

The **Fisher information** $I(\theta)$ for a parameter $\theta$ is the variance of the score, and, under the usual regularity conditions, equal to the expected negative second derivative of the log-likelihood:

$$
I(\theta) = E\big[s(\theta)^2\big] = -E\left[\frac{d^2\ell}{d\theta^2}\right]
$$

Both forms follow from the mean-zero score. Because $E[s] = 0$, the variance of the score is just its mean square, $\operatorname{Var}(s) = E[s^2] - E[s]^2 = E[s^2]$. For the second form, differentiate the identity $\int s f \, dx = 0$ once more with respect to $\theta$, using the product rule and $\partial f / \partial \theta = s f$:

$$
0 = \int \frac{\partial s}{\partial \theta}\, f \, dx + \int s \, \frac{\partial f}{\partial \theta}\, dx
$$

$$
= E\left[\frac{\partial s}{\partial \theta}\right] + E\big[s^2\big]
$$

and since $\partial s / \partial \theta$ is the second derivative of the log-likelihood, $E[s^2] = -E[\partial^2 \ell / \partial \theta^2]$. The same regularity conditions are needed here, for the same reason.

The second form explains the name. A log-likelihood that falls off steeply on either side of its peak has large negative curvature, and the data then rule out values close to the estimate: the information is high. A flat peak means many values explain the data nearly as well.

For one Bernoulli trial, the second derivative is $-y/p^2 - (1-y)/(1-p)^2$ for an observed $y \in \{0, 1\}$, and taking its expectation gives

$$
I_1(p) = \frac{1}{p(1-p)}
$$

Information adds over independent observations, so for $n$ trials $I_n(p) = n / (p(1-p))$. At the estimate:

$$
I_n(\hat p) = \frac{20}{0.3 \times 0.7} = 95.2
$$

The distinction between **expected** information (the expectation above) and **observed** information (minus the second derivative at the data actually seen) matters in some models. For the Bernoulli the two coincide at $\hat p$: the observed value is $k/\hat p^2 + (n-k)/(1-\hat p)^2$, which reduces to $n/(\hat p(1-\hat p))$ when $\hat p = k/n$. For logistic regression below they coincide at every $\beta$, because the second derivative there doesn't involve $y$ at all.

The inverse of the information is a floor on precision. The **Cramér–Rao bound** says an unbiased estimator of $\theta$ has variance at least $1/I_n(\theta)$ (Rao, 1945). The sample proportion meets it exactly: $\operatorname{Var}(\hat p) = p(1-p)/n$, which is $1/I_n(p)$.

## Standard errors and Wald intervals

For large samples the MLE is approximately normal, centred on the true value, with variance $1/I_n(\theta)$. The **standard error** of the estimate is therefore

$$
\mathrm{SE}(\hat p) = \frac{1}{\sqrt{I_n(\hat p)}} = \frac{1}{\sqrt{95.2}} = 0.1025
$$

and the **Wald 95% interval** is $\hat p \pm 1.96\,\mathrm{SE}$, which gives $(0.099, 0.501)$. This is the interval most regression software prints by default.

The Wald interval replaces the log-likelihood with a parabola fitted at its peak: $\ell(p) - \ell(\hat p) \approx -\tfrac{1}{2} I_n(\hat p)\,(p - \hat p)^2$. The **likelihood-ratio interval** uses the real curve instead. It keeps every $p$ whose log-likelihood is within $3.84/2 = 1.92$ of the maximum, where 3.84 is the 95% point of a $\chi^2$ distribution with one degree of freedom. For the worked example it is $(0.132, 0.517)$: shifted to the right and asymmetric about 0.3, because the log-likelihood falls off faster toward 0 than toward 1.

<svg viewBox="0 0 640 330" role="img" aria-label="The log-likelihood of p for 6 successes in 20 trials, relative to its maximum at p = 0.3, plotted from p = 0 to 0.7, together with the parabola the Wald interval assumes. The log-likelihood drops faster to the left of 0.3 than the parabola and more slowly to the right. A dashed horizontal line at minus 1.92 marks the 95% cutoff. Below the plot, the Wald interval runs from 0.099 to 0.501 and the likelihood-ratio interval from 0.132 to 0.517." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Log-likelihood for 6 of 20 against its Wald parabola, with both 95% intervals</title>
  <rect x="60" y="30" width="560" height="220" fill="none" style="stroke: var(--rule)"/>
  <line x1="60" y1="126.8" x2="620" y2="126.8" style="stroke: var(--muted)" stroke-dasharray="4 3"/>
  <text x="614" y="121" text-anchor="end" font-size="11" fill="currentColor">&#8722;1.92 (95% cutoff)</text>
  <path d="M60.0 221.4 L64.0 215.8 L68.0 210.2 L72.0 204.7 L76.0 199.3 L80.0 194.0 L84.0 188.9 L88.0 183.8 L92.0 178.8 L96.0 173.9 L100.0 169.0 L104.0 164.3 L108.0 159.7 L112.0 155.2 L116.0 150.8 L120.0 146.4 L124.0 142.2 L128.0 138.0 L132.0 134.0 L136.0 130.0 L140.0 126.2 L144.0 122.4 L148.0 118.8 L152.0 115.2 L156.0 111.7 L160.0 108.3 L164.0 105.0 L168.0 101.9 L172.0 98.8 L176.0 95.8 L180.0 92.9 L184.0 90.0 L188.0 87.3 L192.0 84.7 L196.0 82.2 L200.0 79.8 L204.0 77.4 L208.0 75.2 L212.0 73.0 L216.0 71.0 L220.0 69.0 L224.0 67.2 L228.0 65.4 L232.0 63.8 L236.0 62.2 L240.0 60.7 L244.0 59.3 L248.0 58.0 L252.0 56.9 L256.0 55.8 L260.0 54.8 L264.0 53.9 L268.0 53.0 L272.0 52.3 L276.0 51.7 L280.0 51.2 L284.0 50.8 L288.0 50.4 L292.0 50.2 L296.0 50.0 L300.0 50.0 L304.0 50.0 L308.0 50.2 L312.0 50.4 L316.0 50.8 L320.0 51.2 L324.0 51.7 L328.0 52.3 L332.0 53.0 L336.0 53.9 L340.0 54.8 L344.0 55.8 L348.0 56.9 L352.0 58.0 L356.0 59.3 L360.0 60.7 L364.0 62.2 L368.0 63.8 L372.0 65.4 L376.0 67.2 L380.0 69.0 L384.0 71.0 L388.0 73.0 L392.0 75.2 L396.0 77.4 L400.0 79.8 L404.0 82.2 L408.0 84.7 L412.0 87.3 L416.0 90.0 L420.0 92.9 L424.0 95.8 L428.0 98.8 L432.0 101.9 L436.0 105.0 L440.0 108.3 L444.0 111.7 L448.0 115.2 L452.0 118.8 L456.0 122.4 L460.0 126.2 L464.0 130.0 L468.0 134.0 L472.0 138.0 L476.0 142.2 L480.0 146.4 L484.0 150.8 L488.0 155.2 L492.0 159.7 L496.0 164.3 L500.0 169.0 L504.0 173.9 L508.0 178.8 L512.0 183.8 L516.0 188.9 L520.0 194.0 L524.0 199.3 L528.0 204.7 L532.0 210.2 L536.0 215.8 L540.0 221.4 L544.0 227.2 L548.0 233.0 L552.0 239.0 L556.0 245.0" fill="none" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <path d="M114.9 244.3 L118.7 230.8 L122.6 218.3 L126.5 206.8 L130.4 196.2 L134.3 186.3 L138.2 177.1 L142.1 168.4 L145.9 160.4 L149.8 152.8 L153.7 145.7 L157.6 139.1 L161.5 132.8 L165.4 126.9 L169.3 121.4 L173.1 116.1 L177.0 111.2 L180.9 106.6 L184.8 102.2 L188.7 98.1 L192.6 94.2 L196.5 90.5 L200.3 87.1 L204.2 83.8 L208.1 80.8 L212.0 77.9 L215.9 75.2 L219.8 72.7 L223.7 70.3 L227.5 68.1 L231.4 66.1 L235.3 64.2 L239.2 62.4 L243.1 60.8 L247.0 59.3 L250.9 57.9 L254.7 56.6 L258.6 55.5 L262.5 54.5 L266.4 53.6 L270.3 52.8 L274.2 52.1 L278.1 51.5 L281.9 51.0 L285.8 50.6 L289.7 50.3 L293.6 50.1 L297.5 50.0 L301.4 50.0 L305.3 50.1 L309.1 50.2 L313.0 50.5 L316.9 50.8 L320.8 51.2 L324.7 51.7 L328.6 52.3 L332.5 53.0 L336.3 53.7 L340.2 54.6 L344.1 55.5 L348.0 56.4 L351.9 57.5 L355.8 58.6 L359.7 59.8 L363.5 61.1 L367.4 62.4 L371.3 63.8 L375.2 65.3 L379.1 66.9 L383.0 68.5 L386.9 70.2 L390.7 72.0 L394.6 73.9 L398.5 75.8 L402.4 77.8 L406.3 79.9 L410.2 82.0 L414.1 84.2 L417.9 86.5 L421.8 88.9 L425.7 91.3 L429.6 93.8 L433.5 96.3 L437.4 99.0 L441.3 101.7 L445.1 104.5 L449.0 107.3 L452.9 110.3 L456.8 113.3 L460.7 116.4 L464.6 119.5 L468.5 122.8 L472.3 126.1 L476.2 129.5 L480.1 132.9 L484.0 136.5 L487.9 140.1 L491.8 143.8 L495.7 147.6 L499.5 151.5 L503.4 155.4 L507.3 159.5 L511.2 163.6 L515.1 167.8 L519.0 172.1 L522.9 176.5 L526.7 181.0 L530.6 185.6 L534.5 190.3 L538.4 195.0 L542.3 199.9 L546.2 204.9 L550.1 209.9 L553.9 215.1 L557.8 220.4 L561.7 225.8 L565.6 231.3 L569.5 236.9 L573.4 242.6 L577.3 248.4" fill="none" style="stroke: var(--accent)" stroke-width="2.5"/>
  <line x1="490" y1="62" x2="516" y2="62" style="stroke: var(--accent)" stroke-width="2.5"/>
  <text x="522" y="66" font-size="11" fill="currentColor">log-likelihood</text>
  <line x1="490" y1="82" x2="516" y2="82" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="522" y="86" font-size="11" fill="currentColor">Wald parabola</text>
  <text x="60.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0</text>
  <text x="140.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.1</text>
  <text x="220.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.2</text>
  <text x="300.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.3</text>
  <text x="380.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.4</text>
  <text x="460.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.5</text>
  <text x="540.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.6</text>
  <text x="620.0" y="264" text-anchor="middle" font-size="10" fill="currentColor">0.7</text>
  <text x="54" y="53.5" text-anchor="end" font-size="10" fill="currentColor">0</text>
  <text x="54" y="93.5" text-anchor="end" font-size="10" fill="currentColor">&#8722;1</text>
  <text x="54" y="133.5" text-anchor="end" font-size="10" fill="currentColor">&#8722;2</text>
  <text x="54" y="173.5" text-anchor="end" font-size="10" fill="currentColor">&#8722;3</text>
  <text x="54" y="213.5" text-anchor="end" font-size="10" fill="currentColor">&#8722;4</text>
  <text x="54" y="253.5" text-anchor="end" font-size="10" fill="currentColor">&#8722;5</text>
  <text x="340" y="282" text-anchor="middle" font-size="12" fill="currentColor">p</text>
  <text transform="translate(18 140) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">&#8467;(p) &#8722; &#8467;(0.3)</text>
  <line x1="139.2" y1="300" x2="460.8" y2="300" style="stroke: var(--muted)" stroke-width="3"/>
  <text x="482" y="304" font-size="11" fill="currentColor">Wald 0.099 to 0.501</text>
  <line x1="165.6" y1="318" x2="473.6" y2="318" style="stroke: var(--accent)" stroke-width="3"/>
  <text x="482" y="322" font-size="11" fill="currentColor">LR 0.132 to 0.517</text>
</svg>

*The log-likelihood for 6 successes in 20 trials, shifted so its peak at $\hat p = 0.3$ is 0, against the parabola with curvature $I_n(\hat p) = 95.2$. Each interval is the set of $p$ where its curve stays above the dashed line at $-1.92$. The two agree near the peak and part ways in the tails, so the intervals differ at their ends.*

With more data the log-likelihood gets closer to a parabola, and the two intervals converge. At $n = 20$ the difference is visible, and the Wald interval has a known weakness in this regime: for small $k$ its lower end can fall below 0 (for 1 success in 20 it is $0.05 - 0.095 < 0$), which the likelihood-ratio interval never does.

## Changing the parameter

The information depends on how the parameter is written. In logistic regression and in neural network outputs, a probability is usually parameterized by its **log-odds** $\eta = \log(p/(1-p))$. Information transforms with the square of the derivative, $I(\eta) = I(p)\,(dp/d\eta)^2$, and since $dp/d\eta = p(1-p)$,

$$
I_n(\eta) = n\,p(1-p) = 20 \times 0.3 \times 0.7 = 4.2
$$

so $\hat\eta = -0.847$ with standard error $1/\sqrt{4.2} = 0.488$. A Wald interval built on the log-odds scale and mapped back to $p$ is $(0.141, 0.527)$, a third answer, shifted even further right than the likelihood-ratio interval. The likelihood-ratio interval is the same in either parameterization, because it only asks which values of the likelihood clear the cutoff, and relabelling the parameter doesn't change those values. The Wald interval depends on where the parabola is drawn.

The same issue affects gradient descent, which is where the Fisher information enters optimization.

## Natural gradient

A plain gradient step depends on the parameterization. Starting at $p = 0.5$ and taking one step of size 0.1 uphill on the mean log-likelihood moves $p$ to 0.420 when the step is taken in $p$, but only to 0.495 when the same step is taken in $\eta$ and mapped back. Both are "the gradient step"; they just measure distance differently.

The **natural gradient** fixes this by multiplying the gradient by the inverse Fisher information, $\tilde g = I(\theta)^{-1} g$. The Fisher information is the local metric that measures how much the model's predicted distribution changes when the parameter moves, so the natural gradient is steepest ascent measured in changes of the distribution rather than in raw parameter units (Amari, 1998). In the worked example the natural step lands at $p = 0.480$ whichever parameterization it is taken in. The invariance is exact only in the limit of small steps; for a large step the two routes differ, because the information changes along the way.

For a network with millions of parameters the full Fisher matrix can't be stored, let alone inverted. **K-FAC** (Martens and Grosse, 2015) approximates each layer's block of the Fisher matrix by a Kronecker product of two small matrices, which makes it cheap to invert. A related shortcut, the *empirical Fisher*, averages squared gradients at the observed labels instead of taking the expectation over the model's own predictions. Kunstner, Balles and Hennig (2019) show that it does not in general capture the curvature the true Fisher does, and that the conditions under which the two agree are unlikely to hold in practice.

```python
import math

n, k = 20, 6
sig = lambda e: 1 / (1 + math.exp(-e))

# log-odds eta = log(p / (1-p)): I_n(eta) = n p (1-p)
p = k / n
eta, info_eta = math.log(p / (1 - p)), n * p * (1 - p)
se_eta = 1 / math.sqrt(info_eta)
lo, hi = eta - 1.96 * se_eta, eta + 1.96 * se_eta
print(f"eta_hat {eta:.3f}, I_n(eta) {info_eta:.1f}, "
      f"SE {se_eta:.3f}")
print(f"Wald CI on log-odds, mapped to p: "
      f"({sig(lo):.3f}, {sig(hi):.3f})")

# one step from p = 0.5 on the mean log-likelihood, lr = 0.1
p0, lr = 0.5, 0.1
g_p = (k / n - p0) / (p0 * (1 - p0))   # d(l/n)/dp
g_eta = k / n - p0                      # d(l/n)/d eta
F_p, F_eta = 1 / (p0 * (1 - p0)), p0 * (1 - p0)
print(f"plain step:   via p {p0 + lr*g_p:.3f}, "
      f"via eta {sig(lr*g_eta):.3f}")
print(f"natural step: via p {p0 + lr*g_p/F_p:.3f}, "
      f"via eta {sig(lr*g_eta/F_eta):.3f}")

# Laplace: flat prior gives posterior Beta(k+1, n-k+1)
a, b = k + 1, n - k + 1          # P(Beta(a,b) <= x) as a
cdf = sum(math.comb(a + b - 1, j) * .5**(a + b - 1)
          for j in range(a, a + b))  # binomial tail
z = (0.5 - p) * math.sqrt(n / (p * (1 - p)))
print(f"P(p < 0.5 | data): exact {cdf:.4f}, "
      f"Laplace {0.5 * (1 + math.erf(z / 2**.5)):.4f}")
```

which prints:

```
eta_hat -0.847, I_n(eta) 4.2, SE 0.488
Wald CI on log-odds, mapped to p: (0.141, 0.527)
plain step:   via p 0.420, via eta 0.495
natural step: via p 0.480, via eta 0.480
P(p < 0.5 | data): exact 0.9608, Laplace 0.9745
```

The same code computes the log-odds interval above and the Laplace comparison in the next section.

## Laplace approximation and EWC

A **Laplace approximation** replaces a posterior distribution by a normal centred on its mode, with precision equal to minus the second derivative of the log-posterior there. With a flat prior the log-posterior is the log-likelihood plus a constant, so the mode is the MLE and the precision is the observed information, giving the same normal that the Wald interval uses. For the worked example the exact posterior under a flat prior is Beta(7, 15), and the Laplace approximation is $N(0.3,\ 0.1025^2)$. The exact posterior probability that $p < 0.5$ is 0.9608; the Laplace approximation gives 0.9745. The gap has the same cause as the gap between the Wald and likelihood-ratio intervals: the real posterior is skewed and the normal is not. Daxberger et al. (2021) review variants of the Laplace approximation for deep networks and report that it is competitive with variational Bayes and deep ensembles at lower computational cost.

**Elastic weight consolidation (EWC)** uses the same idea to keep a network from forgetting an earlier task (Kirkpatrick et al., 2017). After training on task A, the posterior over the weights is approximated, following the Laplace approximation, by a Gaussian centred on the trained weights $\theta^*_A$ with a diagonal precision taken from the diagonal of the Fisher information matrix. Training on task B then adds a quadratic penalty:

$$
L(\theta) = L_B(\theta) + \sum_i \frac{\lambda}{2} F_i \,(\theta_i - \theta^*_{A,i})^2
$$

where $F_i$ is the Fisher information for weight $i$ and $\lambda$ sets how much the old task counts against the new one. A weight with high Fisher information is one that task A's likelihood is sensitive to, so it is held close to its old value; a weight with low information is free to move.

## In a fitted model: logistic regression

Everything above carries over to a model with several parameters, with the information becoming a matrix. For logistic regression with design matrix $X$ (one row per observation, a column of ones for the intercept) and fitted probabilities $p_i$, the score and the Fisher information are

$$
s(\beta) = X^\top (y - p)
$$

$$
I_n(\beta) = X^\top W X, \quad W = \mathrm{diag}\big(p_i(1-p_i)\big)
$$

The standard errors are the square roots of the diagonal of $I_n(\hat\beta)^{-1}$. Fitting by Newton's method with the expected information in place of the Hessian is **Fisher scoring**; for logistic regression the two are the same, because $W$ doesn't involve $y$. The code below simulates 200 observations from $\log(p/(1-p)) = -0.5 + 1.0\,x$, fits the model this way, and reports what a regression table reports:

```python
import numpy as np

rng = np.random.default_rng(1)
n = 200
x = rng.normal(size=n)
X = np.column_stack([np.ones(n), x])       # [n, 2]
p_true = 1 / (1 + np.exp(-(-0.5 + 1.0 * x)))
y = (rng.random(n) < p_true).astype(float)

beta = np.zeros(2)
for _ in range(25):                        # Fisher scoring
    p = 1 / (1 + np.exp(-X @ beta))
    score = X.T @ (y - p)                  # [2]
    info = X.T @ (X * (p * (1 - p))[:, None])  # [2, 2]
    beta = beta + np.linalg.solve(info, score)

p = 1 / (1 + np.exp(-X @ beta))
info = X.T @ (X * (p * (1 - p))[:, None])
se = np.sqrt(np.diag(np.linalg.inv(info)))
nll = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))
print("beta_hat", beta.round(3), " SE", se.round(3))
print("Wald 95% CI for slope",
      (beta[1] + np.array([-1.96, 1.96]) * se[1]).round(3))
print("mean NLL (cross-entropy)", nll.round(4))
print("diag of I_n(beta_hat)", np.diag(info).round(1))
```

which prints:

```
beta_hat [-0.462  0.721]  SE [0.152 0.185]
Wald 95% CI for slope [0.358 1.083]
mean NLL (cross-entropy) 0.622
diag of I_n(beta_hat) [43.3 29.4]
```

The estimated slope is 0.721 with standard error 0.185, so the Wald 95% interval is $(0.358, 1.083)$. It contains the true slope of 1.0, near its upper end; with a different seed the estimate would land elsewhere, and about 5% of such intervals would miss. R's `glm(y ~ x, family = binomial)` on the same simulated data gives the same estimates and standard errors, and its `confint.default` gives the same Wald interval. The mean negative log-likelihood, 0.622 nats, is the cross-entropy loss the same model would report if it were trained as a one-layer network. The diagonal of the information matrix, 43.3 for the intercept and 29.4 for the slope, is what EWC would use as $F_i$ if this model were the network being protected (up to the scaling absorbed into $\lambda$).

## Summary

The likelihood scores parameter values by how well they explain the data, the log-likelihood makes it additive, and its maximum is the estimate that cross-entropy training also finds. The Fisher information is the expected curvature of the log-likelihood: its inverse gives the variance of the estimate, hence standard errors and Wald intervals, and the same matrix sets the metric for natural gradient, the precision of a Laplace approximation, and the penalty weights in EWC. The Wald interval, the Laplace approximation and EWC all treat the log-likelihood as a parabola; in the 6-of-20 example that gives (0.099, 0.501) against the likelihood-ratio interval (0.132, 0.517), and the difference is the measure of how far from a parabola it is.

## Sources

- R. A. Fisher, "On the mathematical foundations of theoretical statistics", *Philosophical Transactions of the Royal Society of London, Series A* 222, 309–368 (1922). [doi:10.1098/rsta.1922.0009](https://doi.org/10.1098/rsta.1922.0009)
- S. M. Stigler, "The Epic Story of Maximum Likelihood", *Statistical Science* 22(4), 598–620 (2007). [doi:10.1214/07-STS249](https://doi.org/10.1214/07-STS249), [arXiv:0804.2996](https://arxiv.org/abs/0804.2996)
- C. R. Rao, "Information and the Accuracy Attainable in the Estimation of Statistical Parameters" (1945), reprinted in *Breakthroughs in Statistics*, Springer, 235–247 (1992). [doi:10.1007/978-1-4612-0919-5_16](https://doi.org/10.1007/978-1-4612-0919-5_16)
- S. Amari, "Natural Gradient Works Efficiently in Learning", *Neural Computation* 10(2), 251–276 (1998). [doi:10.1162/089976698300017746](https://doi.org/10.1162/089976698300017746)
- J. Martens, R. Grosse, "Optimizing Neural Networks with Kronecker-factored Approximate Curvature" (2015). [arXiv:1503.05671](https://arxiv.org/abs/1503.05671)
- F. Kunstner, L. Balles, P. Hennig, "Limitations of the Empirical Fisher Approximation for Natural Gradient Descent" (2019). [arXiv:1905.12558](https://arxiv.org/abs/1905.12558)
- E. Daxberger et al., "Laplace Redux – Effortless Bayesian Deep Learning" (2021). [arXiv:2106.14806](https://arxiv.org/abs/2106.14806)
- J. Kirkpatrick et al., "Overcoming catastrophic forgetting in neural networks", *PNAS* 114(13), 3521–3526 (2017). [doi:10.1073/pnas.1611835114](https://doi.org/10.1073/pnas.1611835114), [arXiv:1612.00796](https://arxiv.org/abs/1612.00796)
