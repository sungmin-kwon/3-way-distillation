---
title: Crude oil distillation and its products
summary: How a refinery splits crude into fuels by boiling range, worked through on one real assay of Johan Sverdrup crude — the TBP curve, cut points, the atmospheric and vacuum columns, and where each cut goes next.
date: 2026-11-10
tags: [cheme]
distillate: "A crude unit doesn't separate compounds; it slices a continuous boiling curve into cuts at chosen temperatures, first at about atmospheric pressure and then under vacuum so the heavy half can boil off below the temperatures where it would start to crack. For Johan Sverdrup crude, 50.3 wt % boils above 375 °C and 20.2 wt % still remains above 565 °C, so half the barrel needs the vacuum column. Almost none of the straight-run cuts is a finished product: sulfur rises from 0.00 wt % in the light naphtha to 1.84 wt % in the vacuum residue, and each cut goes on to further treatment."
model: [Claude Opus 5.5]
---

Crude oil is a mixture of more hydrocarbons than anyone can list, boiling from below room temperature to well beyond any temperature you can reach without decomposing it. The first unit in every refinery, the crude distillation unit, doesn't try to separate those compounds. It cuts the mixture into a handful of fractions by boiling range, and every later unit (reformer, hydrotreater, cracker, coker) works on one of those fractions. Atmospheric distillation of crude goes back to the first refineries of the 1860s, and vacuum distillation followed in the 1870s, first to make lubricants (OSHA Technical Manual, Section IV, Chapter 2).

Binary-column tools such as the McCabe–Thiele diagram don't apply directly, because there is no "light component" with a mole fraction to plot. What replaces the x–y diagram is the boiling curve of the whole crude.

Throughout, the worked example is TotalEnergies' published assay of Johan Sverdrup, a Norwegian North Sea crude (assay date April 2021):

| | value |
| --- | --- |
| crude | Johan Sverdrup, Norway |
| density at 15 °C | 882.8 kg/m³ (28.7 °API) |
| sulfur | 0.81 wt % |
| atmospheric cut point | 375 °C |
| vacuum cut point | 565 °C |

All yields in this note are weight percent of the whole crude, and all temperatures are true boiling point temperatures as defined below, from the assay sheet[^assay]. An assay is one sample of one crude at one time, and crude quality drifts as a field ages.

## The true boiling point curve

The **true boiling point (TBP) curve** is the temperature at which each fraction of the crude boils off in a laboratory column good enough that the cuts are nearly sharp. ASTM D2892 defines it: a column of 14–18 theoretical plates at a reflux ratio of 5:1, run up to 400 °C. Beyond that, ASTM D5236 continues under vacuum in a potstill, up to about 565 °C for most samples. Temperatures measured under vacuum are reported as an **atmospheric equivalent temperature (AET)**, the temperature at which the same material would boil at 1 atm, so the whole curve sits on one scale.

Plotting temperature against the cumulative amount distilled gives a smooth rising curve, with no plateaus, because there are no dominant components. For Johan Sverdrup the assay gives:

| TBP, °C | 80 | 175 | 230 | 375 | 565 |
| --- | --- | --- | --- | --- | --- |
| cumulative distilled, wt % | 5.5 | 15.9 | 23.2 | 49.7 | 79.7 |

The 80 °C value is printed in the assay; the others are linear interpolations between its 20 °C steps (for example 160 °C at 14.1 wt % and 180 °C at 16.5 wt % give 15.9 wt % at 175 °C), which carries about ±0.1 wt % of interpolation error.

A crude's character is mostly in that curve. A light crude or a condensate reaches 50 wt % at a much lower temperature; a heavy crude may have less than half of itself boiling below 375 °C. Johan Sverdrup is a medium crude: 28.7 °API, where API gravity is $141.5/\mathrm{SG} - 131.5$ and SG is the specific gravity relative to water at 60 °F. With SG ≈ 0.883 that gives about 28.8, matching the assay to the precision of the density basis.

## Cut points and the product slate

A **cut** is the material that boils between two TBP temperatures, the **cut points**. They are a refiner's choice, not a property of the crude: moving the kerosene–gas oil cut point from 230 °C to 250 °C makes more kerosene and less diesel. The assay reports several alternative cuts for exactly that reason. Picking one set and adding the light gases (ethane through butane, 2.1 wt % in total) gives a complete product slate:

| cut | TBP range, °C | yield, wt % | density at 15 °C, kg/m³ | sulfur, wt % |
| --- | --- | --- | --- | --- |
| gases (C2–C4) | | 2.1 | | |
| light naphtha | 15–80 | 3.5 | 661 | 0.00 |
| heavy naphtha | 80–175 | 10.3 | 761 | 0.01 |
| kerosene | 175–230 | 7.3 | 819 | 0.05 |
| gas oil | 230–375 | 26.5 | 877 | 0.49 |
| vacuum gas oil | 375–565 | 30.1 | 931 | 1.00 |
| vacuum residue | > 565 | 20.2 | 1033 | 1.84 |
| **total** | | **100.0** | | |

The yields add to 100.0 wt %, and they agree with the cumulative curve: 23.2 − 15.9 = 7.3 wt % of kerosene, and 79.7 − 49.7 = 30.0 wt % of vacuum gas oil against the 30.1 the assay reports (the difference is the interpolation).

A second check is the sulfur balance. Each cut's yield times its sulfur content, summed, should give back the crude's sulfur:

$$
S_{\text{crude}} = \sum_i w_i\,S_i = \frac{10.3 \times 0.01 + 7.3 \times 0.05 + 26.5 \times 0.49 + 30.1 \times 1.00 + 20.2 \times 1.84}{100} = 0.81 \text{ wt \%}
$$

where $w_i$ is the yield of cut $i$ in wt % and $S_i$ its sulfur content in wt %. It matches the whole-crude value of 0.81 wt % exactly. It also shows where the sulfur is: 37.2 of the 80.7 units in the numerator, almost half, sit in the vacuum residue, which is a fifth of the crude.

<svg viewBox="0 0 500 500" role="img" aria-label="True boiling point curve of Johan Sverdrup crude: TBP temperature in degrees Celsius against cumulative weight percent distilled, from 80 °C at 5.5 wt% to 580 °C at 81.6 wt%. Vertical bands mark the cuts: gases 2.1, light naphtha 3.5, heavy naphtha 10.3, kerosene 7.3, gas oil 26.5, vacuum gas oil 30.1 and vacuum residue 20.2 wt%." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>TBP curve and product cuts for Johan Sverdrup crude</title>
  <rect x="72.4" y="36" width="13.6" height="400" style="fill: var(--rule)" fill-opacity="0.5"/>
  <rect x="127.6" y="36" width="29.2" height="400" style="fill: var(--rule)" fill-opacity="0.5"/>
  <rect x="262.6" y="36" width="120.3" height="400" style="fill: var(--rule)" fill-opacity="0.5"/>
  <rect x="64" y="36" width="400" height="400" fill="none" style="stroke: var(--rule)"/>
  <text x="64" y="454" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="164" y="454" text-anchor="middle" font-size="11" fill="currentColor">25</text>
  <text x="264" y="454" text-anchor="middle" font-size="11" fill="currentColor">50</text>
  <text x="364" y="454" text-anchor="middle" font-size="11" fill="currentColor">75</text>
  <text x="464" y="454" text-anchor="middle" font-size="11" fill="currentColor">100</text>
  <text x="56" y="440" text-anchor="end" font-size="11" fill="currentColor">0</text>
  <text x="56" y="373" text-anchor="end" font-size="11" fill="currentColor">100</text>
  <text x="56" y="307" text-anchor="end" font-size="11" fill="currentColor">200</text>
  <text x="56" y="240" text-anchor="end" font-size="11" fill="currentColor">300</text>
  <text x="56" y="173" text-anchor="end" font-size="11" fill="currentColor">400</text>
  <text x="56" y="107" text-anchor="end" font-size="11" fill="currentColor">500</text>
  <text x="56" y="40" text-anchor="end" font-size="11" fill="currentColor">600</text>
  <text x="264" y="478" text-anchor="middle" font-size="12" fill="currentColor">cumulative distilled, wt %</text>
  <text transform="translate(20 236) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">TBP temperature, °C</text>
  <line x1="64" y1="319.3" x2="127.6" y2="319.3" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <line x1="64" y1="282.7" x2="156.8" y2="282.7" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <line x1="64" y1="186.0" x2="262.6" y2="186.0" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <line x1="64" y1="59.3" x2="382.9" y2="59.3" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <polyline points="86.0,382.7 90.4,376.0 95.2,369.3 103.6,356.0 111.6,342.7 120.4,329.3 130.0,316.0 140.0,302.7 150.8,289.3 162.8,276.0 175.6,262.7 190.0,249.3 206.0,236.0 222.4,222.7 238.8,209.3 253.6,196.0 265.6,182.7 276.8,169.3 288.8,156.0 302.0,142.7 316.0,129.3 330.4,116.0 344.4,102.7 357.6,89.3 369.6,76.0 380.4,62.7 390.4,49.3" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <line x1="262.6" y1="36" x2="262.6" y2="436" style="stroke: var(--accent)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <text x="256.6" y="52" text-anchor="end" font-size="11" style="fill: var(--accent)">atmospheric</text>
  <text x="268.6" y="52" text-anchor="start" font-size="11" style="fill: var(--accent)">vacuum</text>
  <text transform="translate(72.2 428) rotate(-90)" text-anchor="start" font-size="10" fill="currentColor">gas</text>
  <text transform="translate(83.2 428) rotate(-90)" text-anchor="start" font-size="10" fill="currentColor">LN</text>
  <text transform="translate(110.8 428) rotate(-90)" text-anchor="start" font-size="10" fill="currentColor">HN</text>
  <text transform="translate(146.2 428) rotate(-90)" text-anchor="start" font-size="10" fill="currentColor">kero</text>
  <text x="209.7" y="428" text-anchor="middle" font-size="11" fill="currentColor">gas oil</text>
  <text x="322.8" y="428" text-anchor="middle" font-size="11" fill="currentColor">VGO</text>
  <text x="423.4" y="428" text-anchor="middle" font-size="11" fill="currentColor">vac. residue</text>
  <text x="394.4" y="43.3" text-anchor="start" font-size="10" style="fill: var(--muted)">580 °C, end of data</text>
</svg>

*Johan Sverdrup TBP curve from the TotalEnergies assay (data from 80 °C to 580 °C, linear between points). Bands mark the cuts in the table above; the dashed accent line at 375 °C is where the atmospheric column stops and the vacuum column takes over.*

## Why there are two columns

The obvious way to split crude is one column that boils off everything up to the residue. It fails because the heavy end decomposes before it boils. Above roughly 370 °C, large molecules start to **crack** thermally into lighter ones and coke, fouling the furnace tubes and changing the products. OSHA's manual gives a crude heating temperature of 650–700 °F (343–371 °C) for this reason.

So the crude unit is two columns in series:

1. The **atmospheric column** runs at slightly above atmospheric pressure, with the crude heated to about 343–371 °C. It takes off gases, naphtha, kerosene and gas oil, and leaves the **atmospheric residue**, the material boiling above about 375 °C on the TBP scale. For our crude that is 100 − 49.7 = 50.3 wt %, half the barrel.
2. The **vacuum column** takes that residue and distills it at an absolute pressure of roughly 10–40 mmHg, a few percent of an atmosphere. Lower pressure lowers every boiling point, so material with an AET of 565 °C comes off while the actual temperature stays below the cracking range. It splits the atmospheric residue into 30.1 wt % vacuum gas oil and 20.2 wt % vacuum residue.

A 565 °C cut point is where the vacuum column, like the D5236 lab method, typically runs out: going deeper means hotter oil or lower pressure, and the residue's own sensitivity sets the limit. Everything above it leaves the crude unit as residue.

## What the column looks like inside

The atmospheric column is not five binary columns stacked up. It is one tall column with **side draws**: liquid taken off trays at several heights, each one a product. The top gives naphtha and gas, and lower draws give kerosene and gas oil. Most of the heat enters with the feed, as a partly vaporized stream from the furnace, rather than through a reboiler, and stripping steam injected at the bottom lowers the hydrocarbons' partial pressure so more of the residue's light material comes off.

Each side draw goes to a small **side stripper**, a few stages with steam, which boils the lightest material in the draw back into the main column. Without it, a kerosene draw would contain enough naphtha to fail its flash point. **Pumparounds** take liquid off at several heights, cool it, and return it higher up. They remove heat along the column instead of all at the condenser, which evens out vapor traffic and lets the heat be recovered at useful temperatures to preheat the crude.

The real cuts are not sharp. Adjacent products in a crude column overlap in boiling range: the heaviest part of the kerosene boils above the lightest part of the gas oil. A refiner specifies the separation by that overlap (or, when it's positive, the gap) between the end of one product's laboratory distillation and the start of the next, rather than by stage counts and mole fractions. The TBP column, at 15 plates and 5:1 reflux, is the near-sharp limit those real cuts fall short of, the same way McCabe–Thiele's total-reflux Fenske count is a limit a real column never reaches. So a refinery running Johan Sverdrup at these nominal cut points gets similar but not identical volumes.

Nothing in this note models the column itself. Designing one means representing the crude as dozens of **pseudo-components**, each a narrow TBP slice with an assigned boiling point and density, and solving the stage-by-stage balances in a simulator. That is the multicomponent case McCabe–Thiele can't handle.

## Where each cut goes

The crude unit's products are **straight-run** streams. Each is a feedstock, and the assay numbers show why:

- **Gases.** Propane and butane go to LPG; butane is also blended into gasoline in winter for vapor pressure.
- **Light naphtha** (15–80 °C) has a research octane number (RON) of only 71.6, against the 95 minimum of standard European gasoline.[^en228] It is blended into gasoline after isomerization, which rearranges straight-chain pentanes and hexanes into branched ones with higher octane, or used as petrochemical feed.
- **Heavy naphtha** (80–175 °C) is the feed for the **catalytic reformer**, which turns naphthenes (36.1 vol % of this cut) into aromatics and hydrogen. It's the refinery's main octane source and also its main hydrogen supply.
- **Kerosene** (175–230 °C) becomes jet fuel after hydrotreating or sweetening. This cut's freezing point, −55 °C, already beats the Jet A-1 limit of −47 °C in ASTM D1655. Its smoke point, 19 mm, is below that standard's general minimum of 25 mm, so it qualifies only under the alternative of 18 mm with low naphthalenes, or after blending.[^d1655]
- **Gas oil** (230–375 °C) becomes diesel and heating oil. Its sulfur, 0.49 wt %, is 4,900 mg/kg, and road diesel in Europe (EN 590) and the US is limited to 10–15 mg/kg, so it must be hydrotreated to remove about 99.7–99.8% of its sulfur.[^diesel-s] Its cetane index of 45.0 is close to the EN 590 minimum of 46 before treatment (EN 590 also sets a minimum cetane *number* of 51, measured in an engine).[^diesel-s]
- **Vacuum gas oil** (375–565 °C) is too heavy for any fuel by itself. It is the feed for the **fluid catalytic cracker** or the **hydrocracker**, which break it into gasoline and diesel, or, from suitable crudes, for lubricant base oils.
- **Vacuum residue** (> 565 °C) is denser than water (1033 kg/m³), with a Conradson carbon residue of 19.0 wt % and 78 mg/kg of nickel and vanadium. Those metals and that carbon-forming tendency poison and coke cracking catalysts, so it goes to a coker, to bitumen for roads, or to heavy fuel oil.

The pattern across the table is the useful part: density, sulfur, nitrogen and metals all rise with boiling point, so the heavier the cut, the more work it needs before it's sellable. A refinery's configuration is largely a choice of how much of that bottom half it can turn into light products.

[^assay]: TotalEnergies Trading, *Johan Sverdrup* crude assay, assay date 1 April 2021, [PDF](https://trading.totalenergies.com/wp-content/uploads/2025/11/JOHAN-SVERDRUP.pdf). The sheet is published for information only. Light-gas yields: ethane 0.1, propane 0.6, isobutane 0.4, n-butane 1.0 wt %.
[^en228]: EN 228 unleaded petrol, RON 95.0 minimum, as listed in a supplier's [specification sheet for IS EN 228:2012](https://inverenergy.ie/wp-content/uploads/2019/11/Petrol.pdf). The standard itself is paywalled and wasn't checked.
[^d1655]: ASTM D1655 limits as listed in ExxonMobil's [jet fuel product data sheet](https://www.mobil.com/en-us/commercial-fuel/pds/gl-xx-jetfuel-series) (August 2022): freezing point −47 °C maximum for Jet A-1 (−40 °C for Jet A); smoke point either 25 mm minimum, or 18 mm minimum with naphthalenes at most 3.0 vol %. The standard itself is paywalled and wasn't checked.
[^diesel-s]: EN 590 (sulfur 10 mg/kg maximum since 2009, cetane index 46 minimum, cetane number 51 minimum): DieselNet, [EU fuel regulations: automotive diesel](https://dieselnet.com/standards/eu/fuel_automotive.php). US on-road diesel at 15 ppm: EPA, [Diesel fuel standards and rulemakings](https://www.epa.gov/diesel-fuel-standards/diesel-fuel-standards-rulemakings), and grade S15 in ASTM D975 per DieselNet, [US diesel fuel](https://dieselnet.com/standards/us/fuel_diesel.php).
