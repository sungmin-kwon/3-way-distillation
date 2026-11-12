---
title: Qubits, entanglement and Shor's algorithm
summary: An introduction to quantum computing, worked through on factoring 15 — amplitudes and measurement, interference, entanglement and Bell tests, Shor's period finding, and where the hardware stood in November 2026.
date: 2026-11-10
tags: [qi/qc]
distillate: "A qubit holds two complex amplitudes whose squared sizes give the odds of reading 0 or 1, and n qubits hold 2ⁿ of them, but a measurement returns only one outcome, so a quantum speedup has to come from interference, not from trying every answer at once. Shor's algorithm uses that interference to find the period of aˣ mod N: for N = 15 and a = 7 the period is 4, each run succeeds with probability 1/2, and gcd(7² ± 1, 15) gives the factors 3 and 5. As of November 2026 the best error-corrected memories hold one logical qubit on about a hundred physical ones, while published estimates for breaking 2048-bit RSA need roughly 10⁴ to 10⁶ physical qubits."
model: [Claude Opus 5.5]
---

A **qubit** is the quantum version of a bit: a two-level system, such as two energy levels of an ion or two current states of a superconducting circuit, that can be in a weighted combination of 0 and 1 instead of just one of them. The word first appeared in print in Schumacher (1995). What makes qubits worth building is that some problems have quantum algorithms far faster than any known classical one. The best known is Peter Shor's 1994 algorithm for factoring integers (journal version Shor, 1997), which would break the RSA encryption that much of the internet relied on when it was published.

This note builds up to Shor's algorithm from the ground: what a qubit is, what superposition and measurement mean, what entanglement is and how it was tested, and then the algorithm itself, run on the smallest interesting case. It closes with a dated look at where the hardware stands. Factoring is only one application: the same period-finding method also solves discrete logarithms, which breaks elliptic-curve cryptography, and other quantum algorithms, such as simulating molecules and materials, or Grover's search with its smaller, quadratic speedup, aren't covered here.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| number to factor | $N = 15$ |
| chosen base | $a = 7$ |
| counting register | 8 qubits, holding $x = 0, \dots, 255$ ($q = 2^8 = 256$) |
| work register | 4 qubits, holding $7^x \bmod 15$ |
| period to find | $r = 4$ |

## A qubit is two amplitudes

A classical bit is 0 or 1. A qubit's state is a vector

$$
\lvert\psi\rangle = \alpha\,\lvert 0\rangle + \beta\,\lvert 1\rangle, \qquad \lvert\alpha\rvert^2 + \lvert\beta\rvert^2 = 1
$$

where $\lvert 0\rangle$ and $\lvert 1\rangle$ are the two basis states (the *ket* notation $\lvert\cdot\rangle$ just marks a state vector) and $\alpha$ and $\beta$ are complex numbers called **amplitudes**. Reading the qubit out, a **measurement**, gives 0 with probability $\lvert\alpha\rvert^2$ and 1 with probability $\lvert\beta\rvert^2$. This is the *Born rule*.

For example, $\lvert\psi\rangle = \tfrac{\sqrt{3}}{2}\lvert 0\rangle + \tfrac{i}{2}\lvert 1\rangle$ reads 0 with probability $3/4 = 0.75$ and 1 with probability $1/4 = 0.25$. The factor $i$ on the second amplitude doesn't change those odds, but it is not decoration: it is a **relative phase**, and it changes what happens when the qubit is processed further. Only an overall phase, the same factor on both amplitudes, has no effect at all. With the overall phase removed, a qubit's state is fixed by two real angles, which is why it is often drawn as a point on a sphere (the *Bloch sphere*).

A qubit holds a continuum of states, but one measurement yields one bit, and the measurement leaves the qubit in the state it reported, $\lvert 0\rangle$ or $\lvert 1\rangle$. The amplitudes themselves can't be read off; they can only be estimated statistically by preparing the same state many times.

## Superposition and interference

A state like $\tfrac{\sqrt{3}}{2}\lvert 0\rangle + \tfrac{i}{2}\lvert 1\rangle$ with both amplitudes nonzero is a **superposition**. The standard way to make one is the **Hadamard gate** $H$, which acts as

$$
H\lvert 0\rangle = \frac{\lvert 0\rangle + \lvert 1\rangle}{\sqrt{2}} \equiv \lvert +\rangle, \qquad
H\lvert 1\rangle = \frac{\lvert 0\rangle - \lvert 1\rangle}{\sqrt{2}} \equiv \lvert -\rangle
$$

Measuring $\lvert +\rangle$ gives 0 or 1 with probability 1/2 each, like a fair coin. But apply $H$ a second time instead of measuring:

$$
H\lvert +\rangle = \frac{1}{\sqrt{2}}\left(\frac{\lvert 0\rangle + \lvert 1\rangle}{\sqrt{2}} + \frac{\lvert 0\rangle - \lvert 1\rangle}{\sqrt{2}}\right) = \lvert 0\rangle
$$

The two contributions to $\lvert 1\rangle$ have opposite signs and cancel, and the two contributions to $\lvert 0\rangle$ add. This is **interference**, and it is what separates a qubit from a coin: a coin flipped twice is still random, but a qubit put through $H$ twice comes back to $\lvert 0\rangle$ with certainty. The states $\lvert +\rangle$ and $\lvert -\rangle$ give identical statistics when measured directly, and they differ only in relative phase, yet after $H$ one becomes $\lvert 0\rangle$ and the other $\lvert 1\rangle$.

With $n$ qubits the state is a superposition over all $2^n$ bit strings, with one amplitude for each. Applying $H$ to each of the 8 counting qubits of the worked example, starting from all zeros, gives

$$
\lvert\psi\rangle = \frac{1}{16} \sum_{x=0}^{255} \lvert x\rangle
$$

an equal superposition of all 256 values, each with amplitude $1/\sqrt{256} = 1/16$ and probability $1/256$. The amplitude count grows fast: 50 qubits have $2^{50} \approx 1.1 \times 10^{15}$ amplitudes, about 18 petabytes at 16 bytes per complex number, which is why simulating even modest quantum computers classically is hard.

**This is where the usual story goes wrong.** It is often said that a quantum computer "tries every answer in parallel". Measuring the 8-qubit state above gives one value of $x$, uniformly at random, which is no better than picking one classically. Exponentially many amplitudes are only useful if the computation then makes the amplitudes of wrong answers cancel and those of useful answers add, so that a measurement is likely to return something useful. Very few problems are known to have structure that allows this, which is why quantum speedups are special rather than general.

## Entanglement

Gates on two qubits can create states that don't factor into a state for each qubit. The workhorse two-qubit gate is the **CNOT** (controlled NOT): it flips the second qubit if the first is 1 and leaves it alone otherwise. Applying $H$ to the first of two qubits in $\lvert 00\rangle$ and then a CNOT gives

$$
\lvert 00\rangle \;\xrightarrow{\;H\;}\; \frac{\lvert 00\rangle + \lvert 10\rangle}{\sqrt{2}} \;\xrightarrow{\;\text{CNOT}\;}\; \frac{\lvert 00\rangle + \lvert 11\rangle}{\sqrt{2}} \equiv \lvert\Phi^+\rangle
$$

a **Bell state**. It can't be written as one state for qubit A times one for qubit B. If it could, $(\alpha_0\lvert 0\rangle + \alpha_1\lvert 1\rangle)(\beta_0\lvert 0\rangle + \beta_1\lvert 1\rangle)$ would need $\alpha_0\beta_1 = 0$ (no $\lvert 01\rangle$ term) while $\alpha_0\beta_0$ and $\alpha_1\beta_1$ are both nonzero, which is impossible. A state with this property is **entangled**.

Measured in the $\{\lvert 0\rangle, \lvert 1\rangle\}$ basis, each qubit of $\lvert\Phi^+\rangle$ gives a random bit, 0 or 1 with probability 1/2, but the two bits always agree, however far apart the qubits are. That alone could be faked by two coins secretly glued to the same face. The difference shows up when the two sides can each choose between several measurement settings. Bell (1964) showed that no model in which each qubit carries pre-set answers, and neither side's choice affects the other, can reproduce all the quantum correlations. In the form of Clauser, Horne, Shimony and Holt (1969), a combination $S$ of correlations between two settings per side obeys $S \le 2$ for any such model, while quantum mechanics allows up to $2\sqrt{2} \approx 2.83$ (Cirel'son, 1980). Hensen et al. (2015) measured $S = 2.42 \pm 0.20$ on electron spins 1.3 km apart, closing the main loopholes of earlier tests at once.

Entanglement doesn't let either side send a message: each side alone sees only random bits, whatever the other does. The correlation shows up only when results are compared over an ordinary channel. What entanglement does provide is a resource. Teleportation and some quantum cryptography protocols consume entangled pairs, and entanglement distillation is how noisy pairs are upgraded. Inside a quantum computer, entanglement between registers is how one part of a computation comes to carry information about another, as the work and counting registers of Shor's algorithm do below.

## Shor's algorithm: factoring as period finding

Shor's algorithm has a classical outer part and a quantum core. The classical part rests on a fact from number theory. Choose $a$ less than $N$ with no common factor with $N$. The powers $a^x \bmod N$ repeat with some **period**, or *order*, $r$: the smallest $r > 0$ with $a^r \equiv 1 \pmod N$. If $r$ is even, then

$$
a^r - 1 = \left(a^{r/2} - 1\right)\left(a^{r/2} + 1\right) \equiv 0 \pmod N
$$

so $N$ divides the product, and unless $a^{r/2} \equiv -1 \pmod N$ it doesn't divide either factor alone. Then $\gcd(a^{r/2} \pm 1, N)$, computed quickly with Euclid's algorithm, are nontrivial factors of $N$. For a random choice of $a$ this works with probability at least 1/2 when $N$ is odd and not a prime power (Shor, 1997).

For the example, the powers of 7 modulo 15 run

| $x$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $7^x \bmod 15$ | 1 | 7 | 4 | 13 | 1 | 7 | 4 | 13 |

so $r = 4$. Then $7^2 = 49 \equiv 4 \pmod{15}$, and

$$
\gcd(4 - 1, 15) = \gcd(3, 15) = 3, \qquad \gcd(4 + 1, 15) = \gcd(5, 15) = 5
$$

which are the factors. For 15 the table is easy to write out. For a 2048-bit $N$ the period can be about as large as $N$ itself, and no known classical method finds it efficiently; that is the step the quantum computer does.

## The quantum part: finding the period

The quantum core takes four steps.

1. **Superpose.** Hadamards on the counting register give $\frac{1}{16} \sum_{x} \lvert x\rangle$, as above, with the work register in $\lvert 0\rangle$.
2. **Compute the function into the work register.** A reversible circuit for modular exponentiation maps $\lvert x\rangle\lvert 0\rangle$ to $\lvert x\rangle\lvert 7^x \bmod 15\rangle$, giving
   $$
   \frac{1}{16} \sum_{x=0}^{255} \lvert x\rangle \, \lvert 7^x \bmod 15\rangle
   $$
   The two registers are now entangled: each value in the work register is tied to the set of $x$ that produce it.
3. **Apply the quantum Fourier transform** (QFT) to the counting register. It is the discrete Fourier transform acting on amplitudes,
   $$
   \lvert x\rangle \;\mapsto\; \frac{1}{\sqrt{q}} \sum_{y=0}^{q-1} e^{2\pi i\, x y / q} \, \lvert y\rangle
   $$
   and it can be built from about $t^2/2$ one- and two-qubit gates for a $t$-qubit register, here $t = 8$.
4. **Measure** the counting register, getting some $y$.

To see what step 3 does, suppose the work register were measured after step 2 and gave 4 (the result is the same if it is never measured). The counting register is left in an equal superposition of the $x$ with $7^x \bmod 15 = 4$, namely $x = 2, 6, 10, \dots, 254$: a comb of 64 values spaced $r = 4$ apart. The Fourier transform of a comb with spacing 4 on 256 points is a comb with spacing $256/4 = 64$. For every other $y$, the 64 phases $e^{2\pi i x y/256}$ point evenly around the circle and cancel. So the measurement gives $y = 0, 64, 128$ or $192$, each with probability exactly $1/4$. This is interference doing the work: the outcomes that would carry no information about $r$ have zero amplitude.

Each outcome satisfies $y/q = k/r$ for a random integer $k$. Reducing the fraction gives a guess at $r$, and checking the guess classically is easy:

| outcome $y$ | $y/256$ | reduced | guess for $r$ | $7^r \equiv 1 \pmod{15}$? |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | none | – |
| 64 | 0.25 | 1/4 | 4 | yes |
| 128 | 0.5 | 1/2 | 2 | no ($7^2 \equiv 4$) |
| 192 | 0.75 | 3/4 | 4 | yes |

Two of the four equally likely outcomes give $r = 4$ directly, so a run succeeds with probability $1/2$. A failed run is simply repeated, and outcomes like 128 still help: they give a divisor of $r$, and the least common multiple of guesses from a few runs recovers it.

The distribution can be checked by simulating the state directly. This sums the amplitudes for each outcome, grouping the $x$ by their work-register value:

```python
import numpy as np
from fractions import Fraction

def shor_outcomes(N, a, t):
    """Probability of each counting-register outcome y in Shor's algorithm."""
    q = 2**t
    f = np.array([pow(a, x, N) for x in range(q)])  # work register, [q]
    probs = np.zeros(q)
    for v in set(f):  # each work-register value, measured or not
        xs = np.flatnonzero(f == v)  # the x that share it, [m]
        # amplitude of y after the QFT: sum over xs of e^{2πi xy/q} / q
        amp = np.exp(2j * np.pi * np.outer(np.arange(q), xs) / q).sum(1) / q
        probs += np.abs(amp)**2
    return probs  # [q], sums to 1

P = shor_outcomes(15, 7, 8)
for y in np.flatnonzero(P > 1e-9):
    guess = Fraction(int(y), 256).limit_denominator(15)
    print(y, round(P[y], 3), guess, "r =", guess.denominator)
```

It prints the four outcomes 0, 64, 128 and 192, each with probability 0.25, and the guesses $r = 1, 4, 2, 4$.

### When the period doesn't divide the register

For 15 the peaks are exact because $r = 4$ divides $q = 256$. In general it doesn't, and the peaks spread over the integers next to $q k / r$. The counting register is made large enough, at least $N^2$ values, that the nearest integer still pins down $k/r$, and the fraction is then recovered with continued fractions (Python's `limit_denominator` above does exactly this). Factoring $N = 21$ with $a = 2$, whose period is $r = 6$, on a 9-qubit counting register ($q = 512 \ge 21^2 = 441$) shows the effect:

<svg viewBox="0 0 500 290" role="img" aria-label="Bar chart of the probability of each counting-register outcome y from 0 to 511 for Shor's algorithm on N equals 21 with a equals 2. There are peaks of height 0.167 at 0 and 256, and four lower peaks of about 0.11 near 85, 171, 341 and 427 on the dashed lines at multiples of 512 over 6. A zoomed panel shows the peak near 85: 512 over 6 is 85.3, and the probability is spread over outcomes 83 to 87, largest at 85." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Outcome probabilities for Shor's algorithm on N = 21, a = 2</title>
  <rect x="64" y="36" width="220" height="200" fill="none" style="stroke: var(--rule)"/>
  <line x1="100.7" y1="36" x2="100.7" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <line x1="137.3" y1="36" x2="137.3" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <line x1="174.0" y1="36" x2="174.0" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <line x1="210.7" y1="36" x2="210.7" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <line x1="247.3" y1="36" x2="247.3" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <line x1="64.0" y1="236" x2="64.0" y2="69.3" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="99.7" y1="236" x2="99.7" y2="233.7" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="100.1" y1="236" x2="100.1" y2="228.9" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="100.5" y1="236" x2="100.5" y2="122.0" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="101.0" y1="236" x2="101.0" y2="207.5" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="101.4" y1="236" x2="101.4" y2="231.4" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="136.6" y1="236" x2="136.6" y2="231.4" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="137.0" y1="236" x2="137.0" y2="207.5" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="137.5" y1="236" x2="137.5" y2="122.0" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="137.9" y1="236" x2="137.9" y2="228.9" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="138.3" y1="236" x2="138.3" y2="233.7" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="174.0" y1="236" x2="174.0" y2="69.3" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="209.7" y1="236" x2="209.7" y2="233.7" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="210.1" y1="236" x2="210.1" y2="228.9" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="210.5" y1="236" x2="210.5" y2="122.0" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="211.0" y1="236" x2="211.0" y2="207.5" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="211.4" y1="236" x2="211.4" y2="231.4" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="246.6" y1="236" x2="246.6" y2="231.4" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="247.0" y1="236" x2="247.0" y2="207.5" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="247.5" y1="236" x2="247.5" y2="122.0" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="247.9" y1="236" x2="247.9" y2="228.9" style="stroke: var(--ink)" stroke-width="1.5"/>
  <line x1="248.3" y1="236" x2="248.3" y2="233.7" style="stroke: var(--ink)" stroke-width="1.5"/>
  <text x="64.0" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">0</text>
  <text x="174.0" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">256</text>
  <text x="284.0" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">512</text>
  <text x="56" y="240.0" text-anchor="end" font-size="11" style="fill: currentColor">0.00</text>
  <text x="56" y="190.0" text-anchor="end" font-size="11" style="fill: currentColor">0.05</text>
  <text x="56" y="140.0" text-anchor="end" font-size="11" style="fill: currentColor">0.10</text>
  <text x="56" y="90.0" text-anchor="end" font-size="11" style="fill: currentColor">0.15</text>
  <text x="56" y="40.0" text-anchor="end" font-size="11" style="fill: currentColor">0.20</text>
  <text x="174" y="278" text-anchor="middle" font-size="12" style="fill: currentColor">outcome y, all 512</text>
  <rect x="314" y="36" width="160" height="200" fill="none" style="stroke: var(--rule)"/>
  <line x1="391.8" y1="36" x2="391.8" y2="236" style="stroke: var(--accent)" stroke-dasharray="3 4"/>
  <text x="395.8" y="50" text-anchor="start" font-size="11" style="fill: var(--accent)">512/6</text>
  <rect x="316.7" y="235.6" width="6" height="0.4" style="fill: var(--ink)"/>
  <rect x="330.0" y="235.3" width="6" height="0.7" style="fill: var(--ink)"/>
  <rect x="343.3" y="234.9" width="6" height="1.1" style="fill: var(--ink)"/>
  <rect x="356.7" y="233.7" width="6" height="2.3" style="fill: var(--ink)"/>
  <rect x="370.0" y="228.9" width="6" height="7.1" style="fill: var(--ink)"/>
  <rect x="383.3" y="122.0" width="6" height="114.0" style="fill: var(--ink)"/>
  <rect x="396.7" y="207.5" width="6" height="28.5" style="fill: var(--ink)"/>
  <rect x="410.0" y="231.4" width="6" height="4.6" style="fill: var(--ink)"/>
  <rect x="423.3" y="234.2" width="6" height="1.8" style="fill: var(--ink)"/>
  <rect x="436.7" y="235.1" width="6" height="0.9" style="fill: var(--ink)"/>
  <rect x="450.0" y="235.4" width="6" height="0.6" style="fill: var(--ink)"/>
  <rect x="463.3" y="235.6" width="6" height="0.4" style="fill: var(--ink)"/>
  <text x="320.7" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">80</text>
  <text x="387.3" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">85</text>
  <text x="454.0" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">90</text>
  <text x="394" y="278" text-anchor="middle" font-size="12" style="fill: currentColor">zoom, y = 80–91</text>
  <text transform="translate(18 136) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">probability</text>
</svg>

*Outcome probabilities for $N = 21$, $a = 2$, $q = 512$. Left, all outcomes, with dashed lines at $512k/6$ for $k = 1, \dots, 5$; right, the peak near $512/6 = 85.3$ enlarged. Outcomes 0 and 256 ($k = 0$ and $k = 3$) each have probability 0.167; the other four peaks fall between integers, and the nearest integer, such as 85 for $512/6 = 85.3$, gets 0.114 with the rest spread over its neighbours.*

Continued fractions turn 85 into $1/6$ and 171 into $1/3$. The outcomes near $k = 1$ and $k = 5$ give $r = 6$ directly, which happens on 31% of runs; then $2^3 = 8$, and $\gcd(7, 21) = 7$ and $\gcd(9, 21) = 3$.

### Why it is fast, and what has actually been run

Every step above can be done with a number of gates that grows polynomially in the number of digits of $N$. The modular exponentiation dominates, and with schoolbook arithmetic it takes on the order of $n^3$ gates for an $n$-bit number. The best known classical method, the number field sieve, takes time that grows faster than any polynomial in $n$. That gap, polynomial against super-polynomial, is the exponential speedup Shor's algorithm is known for. It is not a proof that factoring is classically hard; no such proof exists. And "polynomial" hides constants. The worked example assumes perfect gates and treats modular exponentiation as a black box, but building that circuit reversibly, and doing it fault-tolerantly, is where nearly all the cost in the resource estimates below comes from, and that cost can still mean very large hardware.

**The experiments are smaller than the headlines suggest.** Vandersypen et al. (2001) factored 15 on a 7-qubit nuclear magnetic resonance device, and many later "factoring" demonstrations followed. Most used circuits simplified with knowledge of the answer. Smolin, Smith and Vargo (2013) showed that this kind of compiling can "factor" arbitrarily large numbers with just two qubits, and argued that the right measure of a demonstration is the length of the period found, not the size of the number. No experiment has yet run Shor's algorithm on a number that is hard to factor classically.

## Where things stand

*This section is a snapshot of the field as of November 2026 and is not kept up to date. Each claim is from the source cited, checked on 2026-11-10.*

Physical qubits are noisy: every gate has some chance of error, and a qubit loses its state within a limited coherence time. Preskill (2018) named the machines of the late 2010s, with 50–100 noisy qubits and no error correction, *noisy intermediate-scale quantum* (NISQ) devices. Shor's algorithm on a 2048-bit number needs billions of gates, so it can't run on noisy qubits directly. It needs **quantum error correction**: spreading one *logical* qubit across many physical ones, and repeatedly measuring checks that reveal errors without revealing the encoded state. It only helps if the physical error rate is below a *threshold*, so that adding qubits lowers the logical error rather than raising it.

**Error correction below threshold has now been shown.** Google Quantum AI and collaborators (2025) ran a surface code on a 101-qubit distance-7 patch, about a hundred physical qubits for one logical qubit, with a logical error of $0.143\%$ per cycle of error correction. Each step up in code distance by two cut the logical error by a factor $\Lambda = 2.14$, and the logical qubit outlived the device's best physical qubit by a factor of 2.4. That is one logical qubit kept in memory, not a computation. On the computation side, Bluvstein et al. (2024) used up to 280 physical qubits, neutral atoms moved by optical tweezers, to run circuits on up to 48 logical qubits.

**The estimated cost of breaking RSA-2048 keeps falling.** These are design studies with assumed hardware, not machines:

| source | physical qubits | runtime | main assumption |
| --- | --- | --- | --- |
| Gidney and Ekerå (2021) | 20 million | 8 hours | surface code, $10^{-3}$ gate error, 1 µs cycle |
| Gidney (2025, preprint) | under 1 million | under a week | surface code, $10^{-3}$ gate error, 1 µs cycle |
| Webster et al. (2026, preprint) | under 100,000 | not in abstract | quantum LDPC codes, $10^{-3}$ error, 1 µs cycle |
| Cain et al. (2026, preprint) | as few as 10,000 | 10–100 times a few days | reconfigurable neutral-atom qubits |

The gap between the largest error-corrected demonstrations, around a hundred physical qubits per logical qubit and a few dozen logical qubits in total, and the $10^4$ to $10^6$ physical qubits running reliably for days that these estimates require is still the open engineering problem. The direction of travel is clear enough that the response is already under way: in August 2024 NIST published its first post-quantum cryptography standards, FIPS 203 (ML-KEM, for key establishment), FIPS 204 (ML-DSA) and FIPS 205 (SLH-DSA), both for digital signatures, built on problems for which no efficient quantum algorithm is known.

## Sources

- B. Schumacher, "Quantum coding", *Phys. Rev. A* 51, 2738 (1995). [doi:10.1103/PhysRevA.51.2738](https://doi.org/10.1103/PhysRevA.51.2738)
- P. W. Shor, "Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer", *SIAM J. Comput.* 26, 1484 (1997). [arXiv:quant-ph/9508027](https://arxiv.org/abs/quant-ph/9508027)
- J. S. Bell, "On the Einstein Podolsky Rosen paradox", *Physics Physique Fizika* 1, 195 (1964). [doi:10.1103/PhysicsPhysiqueFizika.1.195](https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195)
- J. F. Clauser, M. A. Horne, A. Shimony, R. A. Holt, "Proposed experiment to test local hidden-variable theories", *Phys. Rev. Lett.* 23, 880 (1969). [doi:10.1103/PhysRevLett.23.880](https://doi.org/10.1103/PhysRevLett.23.880)
- B. S. Cirel'son, "Quantum generalizations of Bell's inequality", *Lett. Math. Phys.* 4, 93 (1980). [doi:10.1007/BF00417500](https://doi.org/10.1007/BF00417500)
- B. Hensen et al., "Loophole-free Bell inequality violation using electron spins separated by 1.3 kilometres", *Nature* 526, 682 (2015). [arXiv:1508.05949](https://arxiv.org/abs/1508.05949)
- L. M. K. Vandersypen, M. Steffen, G. Breyta, C. S. Yannoni, M. H. Sherwood, I. L. Chuang, "Experimental realization of Shor's quantum factoring algorithm using nuclear magnetic resonance", *Nature* 414, 883 (2001). [doi:10.1038/414883a](https://doi.org/10.1038/414883a)
- J. A. Smolin, G. Smith, A. Vargo, "Oversimplifying quantum factoring", *Nature* 499, 163 (2013). [arXiv:1301.7007](https://arxiv.org/abs/1301.7007)
- J. Preskill, "Quantum computing in the NISQ era and beyond", *Quantum* 2, 79 (2018). [arXiv:1801.00862](https://arxiv.org/abs/1801.00862)
- Google Quantum AI and collaborators, "Quantum error correction below the surface code threshold", *Nature* 638, 920 (2025). [arXiv:2408.13687](https://arxiv.org/abs/2408.13687)
- D. Bluvstein et al., "Logical quantum processor based on reconfigurable atom arrays", *Nature* 626, 58 (2024). [arXiv:2312.03982](https://arxiv.org/abs/2312.03982)
- C. Gidney, M. Ekerå, "How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits", *Quantum* 5, 433 (2021). [arXiv:1905.09749](https://arxiv.org/abs/1905.09749)
- C. Gidney, "How to factor 2048 bit RSA integers with less than a million noisy qubits" (preprint, 2025). [arXiv:2505.15917](https://arxiv.org/abs/2505.15917)
- P. Webster et al., "The Pinnacle Architecture: reducing the cost of breaking RSA-2048 to 100 000 physical qubits using quantum LDPC codes" (preprint, 2026). [arXiv:2602.11457](https://arxiv.org/abs/2602.11457)
- M. Cain et al., "Shor's algorithm is possible with as few as 10,000 reconfigurable atomic qubits" (preprint, 2026). [arXiv:2603.28627](https://arxiv.org/abs/2603.28627)
- NIST, "NIST releases first 3 finalized post-quantum encryption standards", 13 August 2024. [nist.gov](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards)
