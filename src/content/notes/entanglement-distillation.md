---
title: Entanglement distillation
summary: Turning many noisy Bell pairs into fewer, better ones — fidelity and Werner states, the bilateral-CNOT check, BBPSSW and DEJMPS worked from F = 0.80, the cost in raw pairs, and hashing.
date: 2026-11-10
tags: [qi/qc]
distillate: Two parties who share noisy entangled pairs can sacrifice some of them, using only local operations and classical messages, to raise the fidelity of the rest. Starting from Werner pairs at F = 0.80, BBPSSW needs five rounds and about 76 raw pairs per kept pair to pass 0.95, while DEJMPS reaches 0.988 in three rounds for about 16. Recurrence protocols pay at least a factor of two per round, so high fidelity is expensive, and real gate and memory errors put a ceiling on what can be reached.
model: [Claude Opus 5.5]
---

A Bell pair shared between two distant labs is the raw material of quantum communication: with one pair and two classical bits, a qubit can be teleported from one side to the other. Pairs sent through real fibre or stored in real memories arrive noisy, and a noisy pair teleports badly. **Entanglement distillation** (also called *entanglement purification*) is the fix: the two sides, usually called Alice and Bob, spend some of their pairs, using only local quantum operations and classical messages, to make the remaining ones closer to perfect. The first protocol is from Bennett, Brassard, Popescu, Schumacher, Smolin and Wootters (1996), known by their initials as BBPSSW.

The name is apt. Like a still, a distillation protocol trades quantity for purity, works in repeated stages, and has a cost that climbs steeply as the target purity approaches 1.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| target state | ${\lvert\Phi^+\rangle} = (\lvert 00\rangle + \lvert 11\rangle)/\sqrt{2}$ |
| raw pairs | Werner state, fidelity $F_0 = 0.80$ |
| goal | fidelity of at least 0.95 |
| operations | perfect local gates and measurements, classical messages both ways |

## Fidelity and the Werner state

The **fidelity** of a two-qubit state $\rho$ is its overlap with the target, $F = \langle \Phi^+ \rvert \rho \lvert \Phi^+ \rangle$, the probability that a test for ${\lvert\Phi^+\rangle}$ passes. The four Bell states

$$
{\lvert\Phi^\pm\rangle} = \frac{\lvert 00\rangle \pm \lvert 11\rangle}{\sqrt{2}}, \qquad
{\lvert\Psi^\pm\rangle} = \frac{\lvert 01\rangle \pm \lvert 10\rangle}{\sqrt{2}}
$$

form a basis, and a convenient noise model mixes them. A **Werner state** keeps ${\lvert\Phi^+\rangle}$ with weight $F$ and spreads the rest evenly over the other three:

$$
\rho_W(F) = F\,{\lvert\Phi^+\rangle}\langle\Phi^+\rvert + \frac{1-F}{3}\Big({\lvert\Psi^-\rangle}\langle\Psi^-\rvert + {\lvert\Psi^+\rangle}\langle\Psi^+\rvert + {\lvert\Phi^-\rangle}\langle\Phi^-\rvert\Big)
$$

It is what a fully depolarizing channel produces, and any two-qubit state can be brought to this form without changing $F$ by having Alice apply a randomly chosen rotation $U$ to her qubit, Bob apply its complex conjugate $U^*$ to his, and both forget which one it was. This step, called *twirling*, throws away information about the noise, which matters later.

Each non-target Bell state is a named error. Read in the computational basis, ${\lvert\Psi^\pm\rangle}$ has the two qubits disagreeing, a **bit-flip error**, and ${\lvert\Phi^-\rangle}$ has them agreeing but with the wrong relative sign, a **phase error**. ${\lvert\Psi^-\rangle}$ carries both.

A Werner pair is entangled exactly when $F > 1/2$, and teleporting through it gives an average fidelity of $(2F+1)/3$ (Horodecki, Horodecki and Horodecki, 1999). That beats the classical limit of 2/3 by the same condition, $F > 1/2$. For the raw pairs it is $(2 \cdot 0.80 + 1)/3 = 0.867$; at the 0.95 goal it would be 0.967.

## The check: a bilateral CNOT

Every recurrence protocol is built from one move. Take two pairs. Alice applies a CNOT from her half of pair 1 (the *source*) to her half of pair 2 (the *target*), and Bob does the same on his side. Both then measure their target qubit in the computational basis and phone each other the result. If the results agree, they keep pair 1; if not, they throw it away. Pair 2 is always consumed.

What this does is easiest to see by labelling each Bell state with two bits: a **parity bit** (0 for $\Phi$, 1 for $\Psi$) and a **phase bit** (0 for $+$, 1 for $-$). The bilateral CNOT acts on these bits classically:

- the target's parity becomes the XOR of both parities, so the measurement reveals whether the two pairs had the same parity;
- the source's phase becomes the XOR of both phases, so a phase error on the target is copied back onto the source.

So a bit-flip error on exactly one of the two pairs is caught. Two bit-flip errors cancel and slip through. A phase error is never caught, and a phase error on the sacrificed pair ends up on the kept one. The check purifies the parity at the cost of muddying the phase.

## BBPSSW

BBPSSW twirls the pairs to Werner form, runs the check, and twirls the survivors again, so a single number $F$ describes the state at every stage. The original paper targets the singlet ${\lvert\Psi^-\rangle}$ and converts to ${\lvert\Phi^+\rangle}$ with a local rotation before the CNOTs; with ${\lvert\Phi^+\rangle}$ as the target throughout, the formulas are the same. Working through the sixteen combinations of two Werner pairs gives the probability that the check passes,

$$
p = F^2 + \frac{2F(1-F)}{3} + \frac{5(1-F)^2}{9}
$$

and the fidelity of a kept pair,

$$
F' = \frac{F^2 + (1-F)^2/9}{p}
$$

For the raw pairs:

$$
p = 0.64 + 0.1067 + 0.0222 = 0.7689, \qquad
F' = \frac{0.64 + 0.0044}{0.7689} = \frac{0.6444}{0.7689} = 0.838
$$

So 77% of attempts pass, and those that do lift the fidelity from 0.80 to 0.838. Each attempt uses two pairs, so one round leaves $0.7689/2 = 0.384$ kept pairs per raw pair, or 2.6 raw pairs per kept one.

$F' > F$ for every $F$ between 1/2 and 1, and both ends are fixed points, so repeating the round climbs toward 1 from any entangled start, with steps that shrink as it goes. Stepping between the map and the diagonal, much as one steps off stages on a [McCabe–Thiele diagram](note:reading-a-mccabe-thiele-diagram), shows the climb from 0.80:

<svg viewBox="0 0 500 490" role="img" aria-label="Cobweb plot of the BBPSSW fidelity map. The output fidelity after one round lies just above the diagonal for every input fidelity between one half and one. Starting at 0.80, five rounds step up the staircase to 0.950." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Five BBPSSW rounds stepped off on the fidelity map</title>
  <rect x="64" y="36" width="400" height="400" fill="none" style="stroke: var(--rule)"/>
  <text x="64" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">0.5</text>
  <text x="56" y="440" text-anchor="end" font-size="11" style="fill: currentColor">0.5</text>
  <text x="144" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">0.6</text>
  <text x="56" y="360" text-anchor="end" font-size="11" style="fill: currentColor">0.6</text>
  <text x="224" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">0.7</text>
  <text x="56" y="280" text-anchor="end" font-size="11" style="fill: currentColor">0.7</text>
  <text x="304" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">0.8</text>
  <text x="56" y="200" text-anchor="end" font-size="11" style="fill: currentColor">0.8</text>
  <text x="384" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">0.9</text>
  <text x="56" y="120" text-anchor="end" font-size="11" style="fill: currentColor">0.9</text>
  <text x="464" y="454" text-anchor="middle" font-size="11" style="fill: currentColor">1.0</text>
  <text x="56" y="40" text-anchor="end" font-size="11" style="fill: currentColor">1.0</text>
  <text x="264" y="478" text-anchor="middle" font-size="12" style="fill: currentColor">F, fidelity going into a round</text>
  <text transform="translate(20 236) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">F′, fidelity of a kept pair</text>
  <line x1="64" y1="436" x2="464" y2="36" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <polyline points="64.0,436.0 68.0,431.2 72.0,426.4 76.0,421.6 80.0,416.7 84.0,411.9 88.0,407.1 92.0,402.2 96.0,397.4 100.0,392.6 104.0,387.7 108.0,382.9 112.0,378.1 116.0,373.2 120.0,368.4 124.0,363.6 128.0,358.8 132.0,354.0 136.0,349.2 140.0,344.4 144.0,339.6 148.0,334.9 152.0,330.1 156.0,325.4 160.0,320.7 164.0,316.0 168.0,311.3 172.0,306.6 176.0,302.0 180.0,297.4 184.0,292.7 188.0,288.2 192.0,283.6 196.0,279.0 200.0,274.5 204.0,270.0 208.0,265.5 212.0,261.0 216.0,256.6 220.0,252.2 224.0,247.8 228.0,243.4 232.0,239.0 236.0,234.7 240.0,230.4 244.0,226.2 248.0,221.9 252.0,217.7 256.0,213.5 260.0,209.4 264.0,205.2 268.0,201.1 272.0,197.1 276.0,193.0 280.0,189.0 284.0,185.0 288.0,181.0 292.0,177.1 296.0,173.2 300.0,169.3 304.0,165.5 308.0,161.7 312.0,157.9 316.0,154.1 320.0,150.4 324.0,146.7 328.0,143.0 332.0,139.4 336.0,135.8 340.0,132.2 344.0,128.7 348.0,125.2 352.0,121.7 356.0,118.2 360.0,114.8 364.0,111.4 368.0,108.0 372.0,104.7 376.0,101.4 380.0,98.1 384.0,94.9 388.0,91.7 392.0,88.5 396.0,85.3 400.0,82.2 404.0,79.1 408.0,76.0 412.0,73.0 416.0,70.0 420.0,67.0 424.0,64.0 428.0,61.1 432.0,58.2 436.0,55.3 440.0,52.5 444.0,49.7 448.0,46.9 452.0,44.1 456.0,41.4 460.0,38.7 464.0,36.0" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <polyline points="304.0,196.0 304.0,165.5 334.5,165.5 334.5,137.1 362.9,137.1 362.9,112.4 387.6,112.4 387.6,92.0 408.0,92.0 408.0,76.0 424.0,76.0" fill="none" style="stroke: var(--accent)" stroke-width="1.75" stroke-linejoin="round"/>
  <text x="310" y="214" text-anchor="start" font-size="11" style="fill: var(--accent)">start, 0.80</text>
  <text x="410.006" y="53.9939" text-anchor="end" font-size="11" style="fill: var(--accent)">after 5 rounds, 0.950</text>
  <text x="110" y="200" text-anchor="start" font-size="11" style="fill: var(--ink)">one round of BBPSSW</text>
  <text x="300" y="300" text-anchor="start" font-size="11" style="fill: var(--muted)">no change, F′ = F</text>
</svg>

*The BBPSSW map for Werner pairs. Each step up the accent staircase is one round: across to the curve gives the new fidelity, back to the diagonal makes it the next input. From 0.80 the steps shrink as $F$ rises, and five rounds reach 0.950.*

| round | fidelity | success probability | raw pairs per kept pair |
| --- | --- | --- | --- |
| 0 | 0.800 | | 1 |
| 1 | 0.838 | 0.769 | 2.6 |
| 2 | 0.874 | 0.807 | 6.4 |
| 3 | 0.905 | 0.846 | 15.2 |
| 4 | 0.930 | 0.881 | 34.6 |
| 5 | 0.950 | 0.911 | 75.9 |

Five rounds pass the 0.95 goal, at about 76 raw pairs per kept pair. The cost is the product of $2/p$ over the rounds, so it at least doubles each round, while the gain per round keeps shrinking.

## DEJMPS

The slow climb has a clear cause. After one round, the kept pairs have weights 0.838 on ${\lvert\Phi^+\rangle}$, 0.012 on each ${\lvert\Psi^\pm\rangle}$, and 0.139 on ${\lvert\Phi^-\rangle}$: the bit-flip errors fell from 0.067 each to 0.012, as the check promised, but the phase error doubled, from 0.067 to 0.139. Twirling then smears that lopsided state back into a Werner state, discarding the knowledge that almost all the remaining error is now of one kind.

Deutsch, Ekert, Jozsa, Macchiavello, Popescu and Sanpera (1996) dropped the twirl and added a rotation. Before each round, Alice rotates her qubits by $+\pi/2$ about the x axis and Bob by $-\pi/2$. This swaps ${\lvert\Phi^-\rangle}$ and ${\lvert\Psi^-\rangle}$, turning phase errors into errors the next check can see. With weights $A, B, C, D$ on ${\lvert\Phi^+\rangle}, {\lvert\Psi^-\rangle}, {\lvert\Psi^+\rangle}, {\lvert\Phi^-\rangle}$, one round maps

$$
A' = \frac{A^2 + B^2}{N}, \quad B' = \frac{2CD}{N}, \quad C' = \frac{C^2 + D^2}{N}, \quad D' = \frac{2AB}{N}
$$

with success probability $N = (A+B)^2 + (C+D)^2$.

For Werner input, $B = C = D$ and the rotation only permutes equal weights, so the first round matches BBPSSW exactly. The second round is where it pays off: from $(0.838, 0.012, 0.012, 0.139)$ the rotation moves the large phase error into $B$, where the check catches it unless both pairs carry it. That rare case is the $B^2$ term in $A'$.

| round | fidelity | success probability | raw pairs per kept pair |
| --- | --- | --- | --- |
| 0 | 0.800 | | 1 |
| 1 | 0.838 | 0.769 | 2.6 |
| 2 | 0.944 | 0.745 | 7.0 |
| 3 | 0.988 | 0.901 | 15.5 |

Three rounds take DEJMPS past the goal to 0.988, at about 16 raw pairs per kept pair, roughly a fifth of what BBPSSW spends to reach 0.950.

<svg viewBox="0 0 500 290" role="img" aria-label="Fidelity against raw pairs used per kept pair, on a log scale, for the worked example. BBPSSW needs five rounds and about 76 raw pairs to pass 0.95. DEJMPS reaches 0.944 after two rounds and 0.988 after three, at about 16 raw pairs. One round followed by hashing gives near-perfect pairs at about 11 raw pairs each." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Fidelity against cost for BBPSSW, DEJMPS and recurrence plus hashing</title>
  <rect x="64" y="36" width="400" height="200" fill="none" style="stroke: var(--rule)"/>
  <text x="64" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">1</text>
  <text x="159.4" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">3</text>
  <text x="264" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">10</text>
  <text x="359.4" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">30</text>
  <text x="464" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">100</text>
  <text x="56" y="240" text-anchor="end" font-size="11" style="fill: currentColor">0.80</text>
  <text x="56" y="190" text-anchor="end" font-size="11" style="fill: currentColor">0.85</text>
  <text x="56" y="140" text-anchor="end" font-size="11" style="fill: currentColor">0.90</text>
  <text x="56" y="90" text-anchor="end" font-size="11" style="fill: currentColor">0.95</text>
  <text x="56" y="40" text-anchor="end" font-size="11" style="fill: currentColor">1.00</text>
  <text x="264" y="278" text-anchor="middle" font-size="12" style="fill: currentColor">raw pairs used per kept pair (log scale)</text>
  <text transform="translate(16 136) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">fidelity</text>
  <line x1="64" y1="86" x2="464" y2="86" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <polyline points="64.0,236.0 147.0,197.8 225.8,162.4 300.6,131.5 371.8,106.0 440.1,86.0" fill="none" style="stroke: var(--muted)" stroke-width="2"/>
  <circle cx="147.0" cy="197.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="225.8" cy="162.4" r="3.5" style="fill: var(--muted)"/>
  <circle cx="300.6" cy="131.5" r="3.5" style="fill: var(--muted)"/>
  <circle cx="371.8" cy="106.0" r="3.5" style="fill: var(--muted)"/>
  <circle cx="440.1" cy="86.0" r="3.5" style="fill: var(--muted)"/>
  <polyline points="64.0,236.0 147.0,197.8 232.9,92.4 302.1,48.0" fill="none" style="stroke: var(--accent)" stroke-width="2"/>
  <circle cx="147.0" cy="197.8" r="3.5" style="fill: var(--accent)"/>
  <circle cx="232.9" cy="92.4" r="3.5" style="fill: var(--accent)"/>
  <circle cx="302.1" cy="48.0" r="3.5" style="fill: var(--accent)"/>
  <rect x="266.1" y="32.0" width="8" height="8" style="fill: var(--ink)"/>
  <text x="260.1" y="52" text-anchor="end" font-size="11" style="fill: var(--ink)">1 round + hashing, F → 1</text>
  <text x="396" y="140" text-anchor="start" font-size="11" style="fill: var(--muted)">BBPSSW</text>
  <text x="318" y="72" text-anchor="start" font-size="11" style="fill: var(--accent)">DEJMPS</text>
  <text x="80" y="80" text-anchor="start" font-size="11" style="fill: var(--muted)">0.95</text>
  <text x="132" y="231" text-anchor="start" font-size="11" style="fill: currentColor">raw pairs, 0.80</text>
</svg>

*Cost against fidelity for the worked example, one marker per round. BBPSSW needs five rounds and about 76 raw pairs to pass 0.95; DEJMPS passes it in three rounds and about 16, landing at 0.988. The square is one recurrence round followed by hashing, an asymptotic figure for large blocks.*

The numbers in both tables come from iterating the two maps:

```python
import math

def bbpssw(F):
    """One BBPSSW round on Werner pairs: returns (p, F')."""
    p = F**2 + 2*F*(1 - F)/3 + 5*(1 - F)**2/9
    return p, (F**2 + (1 - F)**2/9) / p

def dejmps(c):
    """One DEJMPS round; c = weights of (Φ+, Ψ-, Ψ+, Φ-)."""
    A, B, C, D = c
    N = (A + B)**2 + (C + D)**2  # success probability
    return N, ((A*A + B*B)/N, 2*C*D/N, (C*C + D*D)/N, 2*A*B/N)

def hashing_yield(c):
    """Hashing yield 1 - S for Bell-diagonal weights c."""
    return 1 + sum(x * math.log2(x) for x in c if x > 0)

F0 = 0.80
F, c, cost_b, cost_d = F0, (F0,) + ((1 - F0)/3,)*3, 1.0, 1.0
for r in range(1, 6):
    p, F = bbpssw(F); cost_b *= 2 / p
    if r <= 3:
        q, c = dejmps(c); cost_d *= 2 / q
        print(f"round {r}: BBPSSW F={F:.3f} ({cost_b:.1f} pairs)  "
              f"DEJMPS F={c[0]:.3f} ({cost_d:.1f} pairs)")
    else:
        print(f"round {r}: BBPSSW F={F:.3f} ({cost_b:.1f} pairs)")
werner = (F0,) + ((1 - F0)/3,)*3
print(f"hashing on raw pairs: {hashing_yield(werner):.3f}")
```

The two maps were also checked against a direct four-qubit density-matrix simulation of the gates and measurements; they agree.

## Hashing: a nonzero yield

A recurrence protocol keeps at most half its pairs each round, so pushing the fidelity toward 1 drives the yield toward 0. Bennett, DiVincenzo, Smolin and Wootters (1996) gave a different kind of protocol, **hashing**, that works on a large block of $n$ pairs at once. Alice and Bob measure random parities across the block, compare results to learn about the errors, and correct them. For Bell-diagonal pairs it yields, as $n \to \infty$, perfect pairs at a rate

$$
Y = 1 - S(\rho), \qquad S(\rho) = -\sum_i \lambda_i \log_2 \lambda_i
$$

where $\lambda_i$ are the four Bell weights and $S$ is the von Neumann entropy. It needs only one-way classical communication.

For Werner pairs, $Y > 0$ only above $F = 0.811$. The raw pairs fall just short: $Y = -0.039$, so hashing alone gets nothing from them. One recurrence round fixes that. Its kept pairs, at $(0.838, 0.012, 0.012, 0.139)$, have $Y = 0.242$, so the combination gives $0.384 \times 0.242 \approx 0.093$ perfect pairs per raw pair, or about 11 raw pairs each. That is the square in the figure above. The original BBPSSW paper already used recurrence to prepare pairs for a second, asymptotic method (*breeding*, which has the same $1 - S$ yield for Werner pairs); hashing removes the need for a pre-purified supply.

## Limits

- **Perfect gates are assumed.** Every number above takes the CNOTs and measurements to be flawless. With noisy local operations, each round adds error, and the fidelity stops climbing at a ceiling set by the gate error rate instead of approaching 1. Briegel, Dür, Cirac and Zoller (1998) analysed this for quantum repeaters.
- **Memories wait.** Each round needs a round trip of classical messages, and the kept pairs decohere while Alice and Bob wait, which costs more the longer the link.
- **"Raw pairs per kept pair" is an average.** Recurrence pairs up survivors of the same round, so a real run needs enough pairs at each level and loses some to odd counts. Hashing's yield holds only in the limit of large blocks.
- **The Werner model is a choice.** Real noise is often dominated by one error type, and a protocol tuned to it can do much better than these figures. For any entangled two-qubit state, some protocol can distill it (Horodecki, Horodecki and Horodecki, 1997), but the best possible yield, the *distillable entanglement*, is not known in closed form even for Werner states.

Experiments have shown the idea working with photons (Pan et al., 2003) and between two nitrogen-vacancy centres in diamond acting as network nodes (Kalb et al., 2017).

## Sources

- C. H. Bennett, G. Brassard, S. Popescu, B. Schumacher, J. A. Smolin, W. K. Wootters, "Purification of noisy entanglement and faithful teleportation via noisy channels", *Phys. Rev. Lett.* 76, 722 (1996). [arXiv:quant-ph/9511027](https://arxiv.org/abs/quant-ph/9511027)
- D. Deutsch, A. Ekert, R. Jozsa, C. Macchiavello, S. Popescu, A. Sanpera, "Quantum privacy amplification and the security of quantum cryptography over noisy channels", *Phys. Rev. Lett.* 77, 2818 (1996). [arXiv:quant-ph/9604039](https://arxiv.org/abs/quant-ph/9604039)
- C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, W. K. Wootters, "Mixed-state entanglement and quantum error correction", *Phys. Rev. A* 54, 3824 (1996). [arXiv:quant-ph/9604024](https://arxiv.org/abs/quant-ph/9604024)
- M. Horodecki, P. Horodecki, R. Horodecki, "Inseparable two spin-1/2 density matrices can be distilled to a singlet form", *Phys. Rev. Lett.* 78, 574 (1997). [arXiv:quant-ph/9607009](https://arxiv.org/abs/quant-ph/9607009)
- H.-J. Briegel, W. Dür, J. I. Cirac, P. Zoller, "Quantum repeaters: the role of imperfect local operations in quantum communication", *Phys. Rev. Lett.* 81, 5932 (1998). [arXiv:quant-ph/9803056](https://arxiv.org/abs/quant-ph/9803056)
- M. Horodecki, P. Horodecki, R. Horodecki, "General teleportation channel, singlet fraction, and quasidistillation", *Phys. Rev. A* 60, 1888 (1999). [arXiv:quant-ph/9807091](https://arxiv.org/abs/quant-ph/9807091)
- J.-W. Pan, S. Gasparoni, R. Ursin, G. Weihs, A. Zeilinger, "Experimental entanglement purification of arbitrary unknown states", *Nature* 423, 417 (2003). [doi:10.1038/nature01623](https://doi.org/10.1038/nature01623)
- N. Kalb et al., "Entanglement distillation between solid-state quantum network nodes", *Science* 356, 928 (2017). [arXiv:1703.03244](https://arxiv.org/abs/1703.03244)
