---
title: How spirits distillation works
summary: The thermodynamics and chemistry behind pot stills and cuts — ethanol–water VLE, the 95.6% ABV azeotrope, Rayleigh distillation, reflux, and why congeners separate into heads, hearts, and tails.
date: 2026-11-09
tags: [spirits]
distillate: The vapor above a boiling ethanol–water mix is richer in ethanol than the liquid, and a still exploits that once or many times over. The azeotrope caps purity at 95.6% ABV, and cuts work because congeners come off at different points in the run.
---

Distilling a fermented wash is applied vapor–liquid equilibrium (VLE): ethanol and water (plus hundreds of trace "congener" compounds) have different volatilities, so the vapor above a boiling liquid is always richer in ethanol than the liquid itself. A still is just a device that exploits that difference — once, or many times in a row.

> Home distilling is illegal or license-only in many jurisdictions — check your local law before doing any of this. Never consume foreshots or heads; they concentrate the most volatile solvents.

## Ethanol–water VLE and the azeotrope

At 1 atm, pure ethanol boils at 78.37 °C and water at 100 °C, so you might expect distillation to separate them completely. It can't: ethanol and water form a **minimum-boiling azeotrope at 95.63 wt% ethanol (≈ 95.6% ABV)**, boiling at 78.2 °C — below either pure component. At the azeotropic composition the vapor has the *same* composition as the liquid, so no further enrichment is possible by ordinary distillation. **95.6% ABV is a hard thermodynamic ceiling for any still at atmospheric pressure**; going past it requires molecular sieves, pressure-swing distillation, or similar tricks.

For a binary mixture with roughly constant relative volatility $\alpha$, the equilibrium vapor composition is

$$
y = \frac{\alpha x}{1 + (\alpha - 1)\,x}
$$

For ethanol–water, $\alpha$ is around 7–8 at low ethanol concentration and falls toward 1 as the azeotrope is approached — which is why each successive enrichment step yields less, and why the last few percent of ABV are so expensive.

## What one pot-still run does: Rayleigh distillation

A pot still is essentially **one equilibrium stage** plus a condenser (the swan neck and lyne arm add a little partial reflux). The charge in the pot undergoes simple (Rayleigh) distillation, governed by the differential mass balance

$$
\frac{dW}{W} = \frac{dx}{y - x}
$$

where $W$ is the liquid remaining in the pot, $x$ its ethanol mole fraction, and $y$ the equilibrium vapor composition. Integrating from the initial charge $x_0$ gives the Rayleigh equation:

$$
\ln\frac{W_0}{W} = \frac{1}{\alpha - 1}\left[\ln\frac{x_0}{x} + \alpha \ln\frac{1 - x}{1 - x_0}\right]
$$

The practical consequence: distillate ABV starts high and falls continuously as the pot is depleted. The falling-ABV curve you watch during a spirit run is this equation made visible.

## Reflux stills: stacking stages

A **reflux still** (a packed or plated column mounted above the pot) forces the rising vapor through many partial condensation–revaporization cycles — i.e., many theoretical stages within a single run, the same McCabe–Thiele geometry as an [industrial column](../posts/reading-a-mccabe-thiele-diagram/). More reflux ratio → more effective stages → distillate closer to the azeotrope. A pot still's hearts typically land around 60–75% ABV; a well-run reflux still can approach 95%.

## Why cuts exist: congener volatility

Fermentation produces ethanol plus trace compounds whose boiling points order them in time during a run:

| Compound | BP (°C) | Lands in |
| --- | --- | --- |
| Acetaldehyde | 20.2 | foreshots / heads |
| Acetone | 56.1 | foreshots / heads |
| Methanol | 64.7 | heads |
| Ethyl acetate | 77.1 | heads |
| Ethanol | 78.37 | hearts |
| Water | 100 | everywhere |
| 1-Propanol | 97 | tails |
| Isobutanol | 108 | tails |
| Isoamyl alcohol (fusel oil) | 131 | tails |

- **Foreshots / heads** — the most volatile solvents (acetaldehyde, acetone, ethyl acetate, methanol). Methanol is only a minor fermentation product in grain or sugar washes, but fruit brandies can contain meaningful amounts (pectin hydrolysis), and it concentrates in the heads — one reason heads are discarded rather than kept.
- **Hearts** — mostly ethanol and water, plus the desirable flavor compounds. This is the drinking cut.
- **Tails** — high-boiling fusel oils (propanol, butanol, isoamyl alcohol). Often recycled into the next run; uncontrolled recycling is "tails smearing".

Cut points are chosen by vapor temperature, distillate ABV, and smell/taste. The table is a tendency, not a clean sequence — at hobby scale the nose is the better instrument.

## Measuring and diluting

ABV is measured with a hydrometer in a narrow sample cylinder, **corrected for temperature** (hydrometers are calibrated at 20 °C; a warm sample reads low). Dilution to bottling strength follows

$$
V_{\text{final}} = V_{\text{initial}} \cdot \frac{\mathrm{ABV}_{\text{initial}}}{\mathrm{ABV}_{\text{target}}}
$$

ignoring the ~1–2% volume contraction of ethanol–water mixtures, which is acceptable at hobby scale.

## Summary

Pot still = one VLE stage (Rayleigh); reflux still = many stages in one pass; the 95.6% azeotrope caps every atmospheric still; cuts are congener volatility in time order. It's the same VLE machinery as an industrial column — just at kitchen scale.
