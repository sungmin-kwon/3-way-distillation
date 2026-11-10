---
title: How spirits distillation works
summary: The physical chemistry behind pot stills and cuts, with numbers — ethanol–water VLE and the azeotrope at about 97% ABV, a stripping run and a spirit run worked through with real equilibrium data, reflux columns, why congeners don't simply sort by boiling point, and measuring and diluting.
date: 2026-11-09
tags: [spirits]
distillate: The vapor above a boiling ethanol–water mixture is richer in ethanol than the liquid, and a still exploits that once (a pot still) or many times over (a column). A single pot-still pass turns an 8% wash into low wines of about 20%, and a second pass gives hearts near 70%. The azeotrope at about 97% ABV (95.6% by mass) caps every still at atmospheric pressure, and cuts work because congeners come off at different points in the run, governed by their volatility in the mixture rather than by their boiling points alone.
---

Distilling a fermented wash is applied vapor–liquid equilibrium (VLE). Ethanol and water, plus hundreds of trace *congeners*, have different volatilities, so the vapor above a boiling liquid has a different composition from the liquid. For ethanol it is always richer, right up to the azeotrope. A still is a device for exploiting that difference, once or many times in a row.

> Home distilling is illegal or requires a license in many places, so check the law where you live; [a separate note](note:home-brewing-and-distilling-law) goes through the rules country by country. Separately, foreshots and heads collect the most volatile compounds, such as acetaldehyde and ethyl acetate, and are not for drinking.

## Three ways to say "how much alcohol"

Distillers quote **ABV** (percent by volume at 20 °C). VLE data and mass balances use **mole fraction** or **mass fraction**. They differ a lot because ethanol is lighter per mole than you'd guess from its volume, and because ethanol and water shrink when mixed:

| | ABV | wt % | mole fraction $x$ |
| --- | --- | --- | --- |
| typical beer-strength wash | 8% | 6.4% | 0.026 |
| low wines | 28% | 22.9% | 0.104 |
| bottling strength | 40% | 33.3% | 0.163 |
| azeotrope | ≈ 97% | 95.6% | 0.894 |

The often-quoted "95.6%" for the azeotrope is a **mass** percentage; by volume it is about 97%.

## Ethanol–water VLE and the azeotrope

At 1 atm, pure ethanol boils at 78.4 °C and water at 100 °C. Ethanol and water form a **minimum-boiling azeotrope** at 95.6 wt% ethanol that boils at 78.2 °C, slightly below pure ethanol. At that composition the vapor is identical to the liquid, so ordinary distillation can't enrich it any further. That makes about 97% ABV a hard ceiling for any still at atmospheric pressure. Getting past it takes a third component (azeotropic distillation), molecular sieves, or pressure-swing distillation. In practice, a column still makes "neutral spirit" at around 95–96% ABV.

Selected equilibrium data at 1 atm (Carey and Lewis, 1932, as tabulated in standard textbooks), with the ABV of each phase if condensed:

| liquid ABV | vapor ABV | boiling point (°C) | relative volatility $\alpha$ |
| --- | --- | --- | --- |
| 5.9% | 41.2% | 95.5 | 10.6 |
| 20.4% | 69.6% | 89.0 | 8.2 |
| 32.2% | 76.4% | 85.3 | 6.3 |
| 51.5% | 81.6% | 82.7 | 3.9 |
| 70.3% | 85.6% | 80.7 | 2.4 |
| 88.9% | 91.6% | 78.7 | 1.35 |
| 97.1% | 97.1% | 78.2 | 1.00 |

The relative volatility, $\alpha = \dfrac{y/(1-y)}{x/(1-x)}$, falls from over 10 in a dilute wash to exactly 1 at the azeotrope. Two practical consequences follow. A dilute wash is easy to enrich: the first condensed vapor from a 6% liquid is already above 40%. And each additional percent near the top costs more stages than the last.

The pot temperature also tells you the pot's composition, since a boiling binary mixture at fixed pressure has only one composition for each temperature. At 95.5 °C the pot is around 6% ABV; at 89 °C it is around 20%.

## What one pot-still run does: Rayleigh distillation

A pot still is roughly **one equilibrium stage** plus a condenser. The neck and lyne arm condense and return a little vapor, which adds some extra enrichment, but one stage is a good first model. As vapor leaves, the pot is depleted of ethanol, so its vapor gets leaner too. This is *simple* or *Rayleigh* distillation, governed by the differential balance on the ethanol:

$$
\frac{dW}{W} = \frac{dx}{y^*(x) - x}
\quad\Longrightarrow\quad
\ln\frac{W_0}{W} = \int_{x}^{x_0} \frac{dx'}{y^*(x') - x'}
$$

where $W$ is the moles of liquid in the pot, $x$ its ethanol mole fraction, and $y^*(x)$ the equilibrium vapor composition. For a constant $\alpha$ the integral has a closed form, but for ethanol–water $\alpha$ varies by a factor of ten over a run, so it's better to integrate numerically using the equilibrium data above. Here are two runs done that way, with single-stage equilibrium and ABV conversion at 20 °C.

**Stripping run: 20 L of wash at 8% ABV.** The first distillate comes off at about 46% ABV, with the pot at 94.6 °C.

| distillate ABV right now | collected so far | its average ABV | ethanol recovered | pot ABV |
| --- | --- | --- | --- | --- |
| 46% | 0 L | 46% | 0% | 8.0% |
| 40% | 1.2 L | 43% | 33% | 5.7% |
| 30% | 2.3 L | 40% | 56% | 4.0% |
| 20% | 3.4 L | 35% | 74% | 2.5% |
| 10% | 5.1 L | 28% | 89% | 1.2% |
| 2% | 8.0 L | 20% | 98% | 0.2% |

Running until the distillate is nearly water gives about 8 L of *low wines* at about 20% ABV, which recovers almost all the ethanol. That matches Scotch malt practice, where a wash of about 8% becomes low wines in the low 20s.

**Spirit run: 10 L of low wines at 28% ABV.** The first distillate comes off at about 75% ABV.

| distillate ABV right now | collected so far | its average ABV | ethanol recovered | pot ABV |
| --- | --- | --- | --- | --- |
| 75% | 0 L | 75% | 0% | 28% |
| 70% | 1.3 L | 73% | 35% | 21% |
| 65% | 1.9 L | 71% | 49% | 18% |
| 60% | 2.4 L | 69% | 60% | 15% |
| 50% | 3.3 L | 66% | 76% | 9.7% |
| 40% | 3.9 L | 62% | 88% | 5.7% |

If the hearts are cut from the start of the run (after setting aside a small heads fraction) down to 60%, you get about 2.4 L averaging 69%, holding 60% of the ethanol. The rest goes into the tails (also called feints) and is usually added to the next spirit run, so it isn't lost. A real pot still with some reflux in the neck gives slightly stronger distillate than this one-stage model, but the shape is right: the strength starts high and falls continuously. The ABV curve you watch at the spirit safe is the Rayleigh equation made visible.

## Reflux stills: stacking stages

A **reflux still** puts a packed or plated column between the pot and the condenser and returns part of the condensate down it. The rising vapor goes through many cycles of partial condensation and re-boiling, so a single run gets many theoretical stages. It's the same staircase as an [industrial column](note:reading-a-mccabe-thiele-diagram), drawn on the ethanol–water curve, where the steps pinch together as they approach the azeotrope. More stages and more reflux bring the distillate closer to 97% but strip out flavor along with the congeners. That's why vodka and neutral spirit come off columns and most whisky and brandy come off pots.

## Why cuts exist: congener volatility

Fermentation makes ethanol plus small amounts of other compounds. Their boiling points are a useful first guide to when they come over:

| Compound | Boiling point (°C) | Tends to land in |
| --- | --- | --- |
| Acetaldehyde | 20.2 | foreshots / heads |
| Acetone | 56.1 | heads |
| Ethyl acetate | 77.1 | heads |
| Methanol | 64.7 | spread across the run |
| Ethanol | 78.4 | hearts |
| 1-Propanol | 97 | late hearts / tails |
| Isobutanol | 108 | tails |
| Isoamyl alcohol | 131 | tails |

But the pure-component boiling point isn't what decides it. What matters is each compound's volatility **relative to ethanol in the ethanol–water liquid actually in the pot**, and that depends strongly on how much ethanol is present.

- **Fusel alcohols** (propanol, isobutanol, isoamyl alcohol) are poorly soluble in water. In a liquid that is mostly water they are pushed out into the vapor and can be *more* volatile than ethanol, despite their high boiling points; isoamyl alcohol and water form a heterogeneous azeotrope that boils near 95 °C. In a liquid rich in ethanol they dissolve easily and are less volatile than ethanol. Early in a spirit run the pot is relatively strong and they mostly stay behind. Late in the run the pot is mostly water and they come over. That's why they arrive in the tails, where the oily, solventy fusel notes are easy to smell.
- **Esters and aldehydes** (ethyl acetate, acetaldehyde) are much more volatile than ethanol at every composition, so they really do concentrate at the start.
- **Methanol** behaves a lot like ethanol and water, since it hydrogen-bonds with both, so it doesn't concentrate cleanly in the heads, contrary to the common story. It comes over across the run. Grain and sugar washes contain very little. Fruit mashes contain more, from the breakdown of pectin, and the way to keep it low is in the fruit and the fermentation rather than the cut.

Cut points are chosen by distillate ABV, temperature, and above all smell and taste. The table shows a tendency, not a clean sequence. At hobby scale the nose is the better instrument.

## Measuring and diluting

ABV is measured with an alcoholmeter (a hydrometer scaled in ABV) floating in a narrow cylinder. These are calibrated at 20 °C. A warm sample is less dense, so the meter sinks deeper and **reads high**, and a cold sample reads low. Correct with the temperature tables that come with the meter, or bring the sample to 20 °C first.

To dilute, the ethanol volume stays the same, so

$$
V_{\text{final}} = V_{\text{initial}} \cdot \frac{\mathrm{ABV}_{\text{initial}}}{\mathrm{ABV}_{\text{target}}}
$$

For the 2.4 L of 69% hearts above, bringing them to 40% means a final volume of $2.4 \times 69/40 = 4.14$ L, so you add about 1.74 L of water. Because ethanol–water mixtures shrink by a few percent on mixing, the result is slightly *stronger* than 40%. Add most of the water, let it rest and come to temperature, measure, and then top up.

## Summary

A pot still is one VLE stage worked through Rayleigh distillation: an 8% wash becomes about 20% low wines, which become hearts around 70%. A reflux still stacks many stages into one run. The azeotrope at about 97% ABV (95.6 wt%) caps every atmospheric still. Cuts follow congener volatility in the changing pot liquid, not boiling points alone. It's the same equilibrium machinery as an industrial column, at kitchen scale.
