---
title: Magic state distillation
summary: "Why an error-corrected quantum computer still needs a non-Clifford ingredient, and how it is purified — the Gottesman–Knill theorem, T gates fed by magic states, the 15-to-1 protocol worked from 1% error, its cost, how it differs from entanglement distillation, and the experiments as of November 2026."
date: 2026-11-10
tags: [qi/qc]
distillate: "Clifford gates are cheap to protect with error correction but can be simulated efficiently on a classical computer, so a useful quantum computer also needs a non-Clifford gate such as T, which it applies by consuming a magic state. Bravyi and Kitaev's 15-to-1 protocol turns 15 magic states with error ε into one with error about 35ε³: from ε = 0.01, one round gives 3.6 × 10⁻⁵ for about 17 inputs, and two rounds give 1.6 × 10⁻¹² for about 262. The protocol assumes perfect Clifford operations and stops working above an input error of 0.141, and in a real machine a distillation factory takes up a large share of the hardware, which is why cheaper routes such as magic state cultivation are now being tested."
model: [Claude Opus 5.5]
---

Quantum error correction protects some operations far more easily than others. In the codes that most hardware is built around, the **Clifford** gates (Hadamard, the phase gate $S$, and CNOT) and Pauli measurements can be done on encoded qubits with low error, but those operations alone can be simulated efficiently on an ordinary computer, so they can't give any quantum speedup. The missing ingredient is a non-Clifford gate, usually the $T$ gate, and the standard way to supply it is to prepare special ancilla states, **magic states**, and consume one per $T$ gate. Bravyi and Kitaev (2005) named them and showed that noisy copies can be purified using only Clifford operations, by **magic state distillation**.

It is the second kind of distillation in this notebook's quantum notes. The [qubits introduction](note:qubits-entanglement-and-shors-algorithm) covers the basics used here (amplitudes, Hadamard, CNOT, error correction), and [entanglement distillation](note:entanglement-distillation) purifies a different resource; the two are compared near the end.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| state to distill | $\lvert A\rangle = (\lvert 0\rangle + e^{i\pi/4}\lvert 1\rangle)/\sqrt{2}$ |
| raw magic states | error $\varepsilon = 0.01$ each (the dephased model below) |
| goal | error per $T$ gate below $10^{-10}$ |
| operations | perfect Clifford gates and Pauli measurements |
| protocol | Bravyi–Kitaev 15-to-1, repeated as needed |

The goal is set by the size of a computation: with $10^8$ $T$ gates, an error of $10^{-10}$ on each gives a total chance of about $10^8 \times 10^{-10} = 1\%$ that any of them fails.

## Why Clifford gates aren't enough

The Clifford gates are the ones that map Pauli operators ($X$, $Y$, $Z$ and their tensor products) to Pauli operators under conjugation: $H X H = Z$, $S X S^\dagger = Y$, and a CNOT copies an $X$ on its control to its target. Hadamard, $S = \mathrm{diag}(1, i)$ and CNOT generate them all.

That property is what makes them easy to simulate. A state made from $\lvert 0\cdots 0\rangle$ by Clifford gates is a **stabilizer state**: it is fixed by $n$ independent Pauli operators, its *stabilizers*. A Clifford gate just rewrites each stabilizer as another Pauli string, and a Pauli measurement can be worked out from the list as well. So instead of $2^n$ amplitudes, a simulation stores $n$ strings of $n$ Paulis each, which grows as $n^2$. This is the **Gottesman–Knill theorem**: any circuit of Clifford gates, Pauli measurements, and Clifford gates conditioned on measurement results can be simulated in polynomial time on a classical computer (Gottesman, 1998, who credits the observation to Knill). Aaronson and Gottesman (2004) gave a fast algorithm and code for it.

Clifford circuits still produce entanglement: the Bell state of the qubits note is a stabilizer state, fixed by $X \otimes X$ and $Z \otimes Z$. So entanglement alone doesn't give a speedup; something outside the Clifford group is needed. The usual choice is

$$
T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix}
$$

the square root of $S$. It is not Clifford: $T X T^\dagger = (X + Y)/\sqrt{2}$, which is not a Pauli operator. Clifford gates together with $T$ can approximate any quantum gate to any accuracy.

**Why not just protect $T$ as well?** In a code, the easiest fault-tolerant gates are *transversal*: apply the same gate to every physical qubit, so one fault touches only one qubit of each code block. Eastin and Knill (2009) proved that no code able to detect an arbitrary error on any single qubit has a universal set of transversal gates. Some gate always has to be done another way. In the surface code, the leading candidate for hardware, Clifford operations are done by *lattice surgery* and similar tricks, and $T$ is the gate that is left over.

## A T gate from a magic state

A $T$ gate can be applied using only Clifford operations if a copy of the magic state

$$
\lvert A\rangle = T\lvert +\rangle = \frac{\lvert 0\rangle + e^{i\pi/4}\lvert 1\rangle}{\sqrt{2}}
$$

is available. Take a data qubit in $\alpha\lvert 0\rangle + \beta\lvert 1\rangle$ and a magic qubit in $\lvert A\rangle$, apply a CNOT with the magic qubit as control and the data qubit as target, and measure the data qubit in the $\{\lvert 0\rangle, \lvert 1\rangle\}$ basis. Writing $\omega = e^{i\pi/4}$, the state before measurement is

$$
\frac{1}{\sqrt{2}}\Big(\lvert 0\rangle \otimes \left(\alpha\lvert 0\rangle + \omega\beta\lvert 1\rangle\right) + \lvert 1\rangle \otimes \left(\beta\lvert 0\rangle + \omega\alpha\lvert 1\rangle\right)\Big)
$$

with the data qubit first. Outcome 0, with probability 1/2, leaves the magic qubit in $\alpha\lvert 0\rangle + \omega\beta\lvert 1\rangle = T(\alpha\lvert 0\rangle + \beta\lvert 1\rangle)$, which is the goal. Outcome 1 leaves $\beta\lvert 0\rangle + \omega\alpha\lvert 1\rangle$, and the Clifford correction $SX$ turns it into the same $T(\alpha\lvert 0\rangle + \beta\lvert 1\rangle)$ up to an overall phase. Both cases were checked numerically on a random input state.

So a fault-tolerant computer can run entirely on Clifford operations, which the code protects, plus a supply of magic states. The magic state is the one ingredient that can't be made fault-tolerantly by Clifford operations alone, so the problem moves from "apply $T$ reliably" to "prepare $\lvert A\rangle$ reliably". A magic state can be *injected* into a code by preparing it on a physical qubit and growing the code around it, but its error is then roughly that of the physical operations, many orders of magnitude above the $10^{-10}$ that a computation with $10^8$ $T$ gates needs.

A faulty magic state produces a faulty gate. If the magic qubit is $Z\lvert A\rangle = (\lvert 0\rangle - \omega\lvert 1\rangle)/\sqrt{2}$ instead, the same circuit outputs $ZT(\alpha\lvert 0\rangle + \beta\lvert 1\rangle)$: the $T$ gate followed by an unwanted $Z$ error.

## The noise model

Bravyi and Kitaev assume the Clifford operations are perfect and all the noise is in the magic states. A noisy copy can be brought to a simple standard form with one more Clifford trick. The operator $e^{-i\pi/4} S X$ has $\lvert A\rangle$ as an eigenvector with eigenvalue $+1$ and $Z\lvert A\rangle$ with eigenvalue $-1$; applying it or not at random, with probability 1/2 each, removes any coherence between the two and leaves

$$
\rho = (1 - \varepsilon)\,\lvert A\rangle\langle A\rvert + \varepsilon\, Z\lvert A\rangle\langle A\rvert Z
$$

so each raw magic state is either correct or carries a $Z$ error, with probability $\varepsilon$. Here $\varepsilon = 0.01$. The random Clifford can always enforce this form, but the threshold of 0.141 below is for this model, and the real input error depends on how injection is done.

A word on names: Bravyi and Kitaev call this an *H-type* magic state, since it is a Clifford rotation of the $+1$ eigenstate of the Hadamard gate, and they reserve $\lvert T\rangle$ for a different state, pointing along $(1, 1, 1)$ on the Bloch sphere. Most later papers call $\lvert A\rangle$ "the T state" because it implements the $T$ gate.

## The 15-to-1 protocol

The protocol uses a 15-qubit error-correcting code with an unusual property: applying $T$ to each of its 15 qubits applies a $T$ gate (in fact $T^\dagger$, which serves equally well) to the encoded qubit. This **15-qubit Reed–Muller code** therefore has a transversal $T$. By Eastin and Knill it must lack something else, and it does: it has no transversal Hadamard. That is why it isn't used for the whole computation, but it is ideal for making magic states.

The code is easiest to describe through its checks. Label the 15 qubits by the nonzero 4-bit strings $0001$ to $1111$. There are four $X$-type checks: check $k$ is the product of $X$ on every qubit whose label has bit $k$ set, so each covers 8 qubits. A $Z$ error on a set of qubits flips check $k$ when an odd number of those qubits have bit $k$ set. The code's logical operators are $X$ and $Z$ on all 15 qubits. One round runs:

1. Prepare the encoded $\lvert +\rangle$. This uses only Clifford operations, so it is perfect in this model.
2. Apply $T$ to each of the 15 qubits by the circuit above, consuming 15 raw magic states. Each faulty one leaves a $Z$ error on its qubit.
3. Measure the four $X$-type checks. If any reads $-1$, discard everything.
4. Otherwise decode, with Clifford operations, to a single qubit. It holds $T^\dagger\lvert +\rangle$, and one $S$ gate turns that into $\lvert A\rangle$, since $S T^\dagger = T$.

Which error patterns get through? A pattern of $Z$ errors passes the checks when every check sees an even number of them. Those patterns are the codewords of the $[15, 11, 3]$ Hamming code, and their weights were counted by enumerating all $2^{15}$ patterns:

| weight | 0 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| patterns that pass | 1 | 35 | 105 | 168 | 280 | 435 | 435 | 280 | 168 | 105 | 35 | 1 |
| of which harmful | 0 | 35 | 0 | 168 | 0 | 435 | 0 | 280 | 0 | 105 | 0 | 1 |

The even-weight patterns that pass are themselves $Z$-type checks of the code, so they do nothing to the encoded state. The odd-weight ones act as a logical $Z$ and turn the output into $Z\lvert A\rangle$. One or two errors are always caught; the smallest harmful patterns have three errors, and there are 35 of them. To leading order, then,

$$
\varepsilon_{\text{out}} \approx 35\,\varepsilon^3 = 35 \times (0.01)^3 = 3.5 \times 10^{-5}
$$

The exact value, summing every row of the table, is

$$
\varepsilon_{\text{out}} = \frac{\sum_{w\ \text{harmful}} N_w\, \varepsilon^w (1-\varepsilon)^{15-w}}{\sum_{w\ \text{pass}} N_w\, \varepsilon^w (1-\varepsilon)^{15-w}} = 3.6 \times 10^{-5}
$$

where $N_w$ is the number of patterns of weight $w$ in the table. The denominator is the probability that a round is accepted, which Bravyi and Kitaev give in closed form as

$$
p_{\text{acc}} = \frac{1 + 15\,(1 - 2\varepsilon)^8}{16} = \frac{1 + 15 \times 0.98^8}{16} = 0.860
$$

so 14% of rounds are thrown away, and each accepted output costs $15 / 0.860 \approx 17$ raw magic states.

## Repeating it

One round is not enough for the goal of $10^{-10}$, so the outputs of the first round are fed into a second. Sorting the numbers by round:

| | input error | output error | acceptance | raw states per output |
| --- | --- | --- | --- | --- |
| round 1 | 0.01 | $3.6 \times 10^{-5}$ | 0.860 | 17 |
| round 2 | $3.6 \times 10^{-5}$ | $1.6 \times 10^{-12}$ | 0.9995 | 262 |

The second round uses the first round's outputs at $3.6 \times 10^{-5}$, so $35 \times (3.6 \times 10^{-5})^3 = 1.6 \times 10^{-12}$, past the goal. It accepts almost every time, and each final state costs $17.4 \times 15 / 0.9995 \approx 262$ raw ones. The cubic suppression is what makes this work: the exponent of the error roughly triples each round, from $10^{-2}$ to about $10^{-4.4}$ and then about $10^{-11.8}$, with the factor 35 taking a little off each time.

<svg viewBox="0 0 500 320" role="img" aria-label="Log-log plot of output error against input error for the 15-to-1 protocol. The input error axis runs from 0.001 to 0.5 and the output error axis from 10 to the minus 12 up to 1. A dashed diagonal shows output equal to input. The one-round curve lies far below the diagonal at small input error and meets it at the threshold of 0.141, a dashed vertical line; above the threshold it lies above the diagonal and levels off at 0.5. The two-round curve is steeper still. The worked example at input error 0.01 is marked: one round gives 3.6 times 10 to the minus 5 and two rounds give 1.6 times 10 to the minus 12." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Output error against input error for 15-to-1 distillation</title>
  <rect x="64" y="36" width="400" height="240" fill="none" style="stroke: var(--rule)"/>
  <line x1="64" y1="236" x2="464" y2="236" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="196" x2="464" y2="196" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="156" x2="464" y2="156" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="116" x2="464" y2="116" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="64" y1="76" x2="464" y2="76" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="212.2" y1="36" x2="212.2" y2="276" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="360.4" y1="36" x2="360.4" y2="276" style="stroke: var(--rule)" stroke-dasharray="2 4"/>
  <line x1="382.7" y1="36" x2="382.7" y2="276" style="stroke: var(--muted)" stroke-dasharray="4 4"/>
  <line x1="64.0" y1="96.0" x2="464.0" y2="42.0" style="stroke: var(--muted)" stroke-width="1.5" stroke-dasharray="6 4"/>
  <polyline points="64.0,185.1 70.8,182.3 77.6,179.6 84.3,176.8 91.1,174.1 97.9,171.4 104.7,168.6 111.5,165.9 118.2,163.1 125.0,160.3 131.8,157.6 138.6,154.8 145.4,152.1 152.1,149.3 158.9,146.6 165.7,143.8 172.5,141.1 179.3,138.3 186.0,135.5 192.8,132.8 199.6,130.0 206.4,127.2 213.2,124.5 219.9,121.7 226.7,118.9 233.5,116.1 240.3,113.3 247.1,110.5 253.8,107.8 260.6,104.9 267.4,102.1 274.2,99.3 280.9,96.5 287.7,93.7 294.5,90.8 301.3,87.9 308.1,85.1 314.8,82.2 321.6,79.3 328.4,76.4 335.2,73.4 342.0,70.5 348.7,67.5 355.5,64.6 362.3,61.6 369.1,58.7 375.9,55.8 382.6,53.0 389.4,50.4 396.2,48.1 403.0,46.1 409.8,44.5 416.5,43.4 423.3,42.7 430.1,42.3 436.9,42.1 443.7,42.0 450.4,42.0 457.2,42.0 464.0,42.0" fill="none" style="stroke: var(--accent)" stroke-width="2"/>
  <polyline points="212.2,271.7 213.2,270.5 219.9,262.2 226.7,253.8 233.5,245.5 240.3,237.1 247.1,228.8 253.8,220.4 260.6,212.0 267.4,203.5 274.2,195.1 280.9,186.6 287.7,178.0 294.5,169.5 301.3,160.9 308.1,152.2 314.8,143.5 321.6,134.8 328.4,126.0 335.2,117.1 342.0,108.1 348.7,99.0 355.5,89.8 362.3,80.4 369.1,71.1 375.9,61.8 382.6,53.1 389.4,46.4 396.2,43.1 403.0,42.2 409.8,42.0 416.5,42.0 423.3,42.0 430.1,42.0 436.9,42.0 443.7,42.0 450.4,42.0 457.2,42.0 464.0,42.0" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <circle cx="212.2" cy="124.9" r="4" style="fill: var(--accent)"/>
  <circle cx="212.2" cy="271.7" r="4" style="fill: var(--ink)"/>
  <text x="222" y="146" text-anchor="start" font-size="11" style="fill: var(--accent)">3.6 × 10<tspan dy="-5" font-size="8">−5</tspan></text>
  <text x="204" y="268" text-anchor="end" font-size="11" style="fill: var(--ink)">1.6 × 10<tspan dy="-5" font-size="8">−12</tspan></text>
  <text x="96" y="70" text-anchor="start" font-size="11" style="fill: var(--muted)">output = input</text>
  <text x="96" y="196" text-anchor="start" font-size="11" style="fill: var(--accent)">one round</text>
  <text x="300" y="214" text-anchor="start" font-size="11" style="fill: var(--ink)">two rounds</text>
  <text x="378" y="262" text-anchor="end" font-size="11" style="fill: var(--muted)">threshold 0.141</text>
  <text x="64.0" y="294" text-anchor="middle" font-size="11" style="fill: currentColor">0.001</text>
  <text x="212.2" y="294" text-anchor="middle" font-size="11" style="fill: currentColor">0.01</text>
  <text x="360.4" y="294" text-anchor="middle" font-size="11" style="fill: currentColor">0.1</text>
  <text x="464.0" y="294" text-anchor="middle" font-size="11" style="fill: currentColor">0.5</text>
  <text x="56" y="280" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−12</tspan></text>
  <text x="56" y="240" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−10</tspan></text>
  <text x="56" y="200" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−8</tspan></text>
  <text x="56" y="160" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−6</tspan></text>
  <text x="56" y="120" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−4</tspan></text>
  <text x="56" y="80" text-anchor="end" font-size="11" style="fill: currentColor">10<tspan dy="-5" font-size="8">−2</tspan></text>
  <text x="56" y="40" text-anchor="end" font-size="11" style="fill: currentColor">1</text>
  <text x="264" y="314" text-anchor="middle" font-size="12" style="fill: currentColor">input error ε (log scale)</text>
  <text transform="translate(16 156) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">output error</text>
</svg>

*Output error against input error for one and two rounds of 15-to-1, from the exact weight count above. Below the threshold at 0.141 each round lowers the error; above it, each round raises it, toward the useless value 0.5. The dots are the worked example at ε = 0.01.*

**There is a threshold.** Setting $\varepsilon_{\text{out}} = \varepsilon$ in the exact formula and solving numerically gives $\varepsilon = 0.141$, the value Bravyi and Kitaev report. Below it, repeated rounds drive the error toward 0; above it, they make it worse. The leading-order formula alone would put the crossing at $1/\sqrt{35} = 0.169$, which overstates it, because at that size the higher-weight patterns matter.

## What it costs

Each round multiplies the number of raw states by 15 (a little more, with rejections) and roughly triples the exponent of the error. Reaching a target error $\varepsilon_t$ from $\varepsilon$ takes about $\log_3\!\big(\log(1/\varepsilon_t) / \log(1/\varepsilon)\big)$ rounds, so the number of raw states per output grows as

$$
\left(\frac{\log(1/\varepsilon_t)}{\log(1/\varepsilon)}\right)^{\gamma}, \qquad \gamma = \frac{\log 15}{\log 3} = 2.46
$$

Hastings and Haah (2018) define this exponent for a protocol built on a code with $n$ inputs, $k$ outputs and distance $d$ as $\gamma = \log(n/k)/\log d$. Lowering it has been a long line of work. Bravyi and Haah (2012) got the degree down to $\log_2 3 \approx 1.6$; Hastings and Haah (2018) got below 1, $\gamma < 0.678$, though the smallest code that does it has about $2^{58}$ qubits; and Wills, Hsieh and Yamasaki (2024, preprint) gave qubit protocols with constant overhead, $\gamma = 0$, built from codes on 1024-level systems with each one represented as 10 qubits. These are asymptotic results. For practical error targets, small protocols like 15-to-1 remain the reference point.

**The real cost is in space and time, not in states counted.** In a fault-tolerant machine, each of the 15 qubits is itself a logical qubit made of many physical ones, and the Clifford operations are slow multi-step procedures, so a distillation *factory* occupies a large part of the chip. Litinski (2019) worked out compact factory layouts that use smaller codes inside the factory than the main computation needs. At a physical error rate of $10^{-4}$, the smallest 15-to-1 layout in his table uses 810 physical qubits for 18.1 code cycles and outputs magic states with error $4.4 \times 10^{-8}$. This counts every fault in the factory, so it is a hardware estimate, unlike the idealized one-round figure of $35 \times (10^{-4})^3 = 3.5 \times 10^{-11}$, which Litinski quotes for comparison. The gap is the floor set by the factory's own Clifford operations, which are error-corrected logical operations with a small error rate of their own. Time matters as much as space: a computation stalls if it waits for magic states, so the factories' output has to keep up with the rate of $T$ gates, which can mean running several at once.

## Two kinds of distillation

Magic state distillation and entanglement distillation share the name for good reasons. Both start with many noisy copies of a state that can't be made directly with the cheap operations available, both use those cheap operations to check the copies against each other, and both keep the result only when the checks pass. Both work in rounds, both need the round's input to beat a threshold, and both assume the cheap operations themselves are perfect. In the language of *resource theories*, each distills a state that the allowed operations can't create: an entangled pair, which local operations and classical messages can't make, and a non-stabilizer state, which Clifford operations can't make.

They differ in what is cheap, where the qubits are, and how fast the error falls.

| | entanglement distillation | magic state distillation |
| --- | --- | --- |
| resource | entangled pairs (Bell states) | magic states (non-stabilizer states) |
| free operations | local operations, classical messages | Clifford gates, Pauli measurements |
| where | two labs, far apart | one machine |
| noise source | the channel and memories | injection into the code |
| typical protocol | BBPSSW, DEJMPS, hashing | 15-to-1, 5-to-1 |
| error suppression near perfect | ×0.67 per round (BBPSSW), roughly squared (DEJMPS) | cubed (15-to-1) |
| used for | teleportation, quantum networks | non-Clifford gates in a computer |

The suppression rates in the table come from iterating the maps in the entanglement note at infidelity $10^{-3}$: one BBPSSW round on Werner pairs lowers it only to $6.7 \times 10^{-4}$, because the two-pair check misses phase errors, a third of a Werner pair's error, and a phase error on either pair passes to the kept one, so about two-thirds of the error survives; meanwhile DEJMPS falls roughly quadratically, to $8.9 \times 10^{-7}$ after its second round. A two-copy check can catch one error at most, so at best it squares the error; the 15-qubit code catches any two, so it cubes it. The link between the two is also formal. Bennett, DiVincenzo, Smolin and Wootters (1996) showed that entanglement distillation with one-way classical communication is equivalent to a quantum error-correcting code, and magic state distillation is built directly on one.

## Where things stand

*This section is a snapshot of the field as of November 2026 and is not kept up to date. Each claim is from the source cited, checked on 2026-11-10.*

**Distillation on logical qubits has been demonstrated.** Sales Rodriguez et al. (2025) ran Bravyi and Kitaev's 5-to-1 protocol, which distills the $(1, 1, 1)$-pointing state that Bravyi and Kitaev call $\lvert T\rangle$, on a neutral-atom processor, with each of the five inputs encoded in a color code. At distance 3 the logical magic state fidelity rose from 95.1% to 99.4%, and at distance 5 from 92.5% to 98.6%, infidelity suppression of about 8 and 6 times as the paper quotes it. The inputs were well inside the protocol's fidelity threshold of 83%. The output fidelities hold after discarding runs flagged by the code's checks and the factory's, so the gain comes partly from postselection.

**Cultivation may be cheaper than distillation.** Gidney, Shutty and Jones (2024, preprint) proposed **magic state cultivation**: inject a magic state into a small color code, check it repeatedly while growing the code, discard on any sign of error, and graft the survivor into a surface code. Their simulations put its cost at roughly that of a lattice-surgery CNOT of the same reliability, about an order of magnitude fewer qubit-rounds than distillation, reaching a logical error of $2 \times 10^{-9}$ under $10^{-3}$ circuit noise, or $4 \times 10^{-11}$ at $5 \times 10^{-4}$. Rosenfeld et al. (2025, preprint), from Google Quantum AI, ran its first steps on a Willow processor: starting in a distance-3 color code and grafting into a distance-5 surface code, cultivation cut the state's infidelity about 40-fold, to a fidelity of 0.9999(1), while keeping 8% of attempts.

Earlier experiments prepared encoded magic states without distilling them. Gupta et al. (2024) on IBM hardware encoded a magic state with higher fidelity than the device could prepare on any of its bare qubits.

Cultivation is not the only alternative. Switching between codes with complementary transversal gates also avoids distillation, and which approach wins on real hardware isn't settled.

## Sources

- S. Bravyi, A. Kitaev, "Universal quantum computation with ideal Clifford gates and noisy ancillas", *Phys. Rev. A* 71, 022316 (2005). [arXiv:quant-ph/0403025](https://arxiv.org/abs/quant-ph/0403025)
- D. Gottesman, "The Heisenberg representation of quantum computers" (1998). [arXiv:quant-ph/9807006](https://arxiv.org/abs/quant-ph/9807006)
- S. Aaronson, D. Gottesman, "Improved simulation of stabilizer circuits", *Phys. Rev. A* (2004). [doi:10.1103/PhysRevA.70.052328](https://doi.org/10.1103/PhysRevA.70.052328), [arXiv:quant-ph/0406196](https://arxiv.org/abs/quant-ph/0406196)
- B. Eastin, E. Knill, "Restrictions on transversal encoded quantum gate sets", *Phys. Rev. Lett.* (2009). [doi:10.1103/PhysRevLett.102.110502](https://doi.org/10.1103/PhysRevLett.102.110502), [arXiv:0811.4262](https://arxiv.org/abs/0811.4262)
- S. Bravyi, J. Haah, "Magic state distillation with low overhead", *Phys. Rev. A* (2012). [doi:10.1103/PhysRevA.86.052329](https://doi.org/10.1103/PhysRevA.86.052329), [arXiv:1209.2426](https://arxiv.org/abs/1209.2426)
- M. B. Hastings, J. Haah, "Distillation with sublogarithmic overhead", *Phys. Rev. Lett.* 120, 050504 (2018). [arXiv:1709.03543](https://arxiv.org/abs/1709.03543)
- A. Wills, M.-H. Hsieh, H. Yamasaki, "Constant-overhead magic state distillation" (preprint, 2024). [arXiv:2408.07764](https://arxiv.org/abs/2408.07764)
- D. Litinski, "Magic state distillation: not as costly as you think", *Quantum* 3, 205 (2019). [arXiv:1905.06903](https://arxiv.org/abs/1905.06903)
- C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, W. K. Wootters, "Mixed-state entanglement and quantum error correction", *Phys. Rev. A* 54, 3824 (1996). [arXiv:quant-ph/9604024](https://arxiv.org/abs/quant-ph/9604024)
- P. Sales Rodriguez et al., "Experimental demonstration of logical magic state distillation", *Nature* 645, 620–625 (2025). [doi:10.1038/s41586-025-09367-3](https://doi.org/10.1038/s41586-025-09367-3), [arXiv:2412.15165](https://arxiv.org/abs/2412.15165)
- C. Gidney, N. Shutty, C. Jones, "Magic state cultivation: growing T states as cheap as CNOT gates" (preprint, 2024). [arXiv:2409.17595](https://arxiv.org/abs/2409.17595)
- E. Rosenfeld et al., "Magic state cultivation on a superconducting quantum processor" (preprint, 2025). [arXiv:2512.13908](https://arxiv.org/abs/2512.13908)
- R. S. Gupta et al., "Encoding a magic state with beyond break-even fidelity", *Nature* 625, 259–263 (2024). [doi:10.1038/s41586-023-06846-3](https://doi.org/10.1038/s41586-023-06846-3), [arXiv:2305.13581](https://arxiv.org/abs/2305.13581)
