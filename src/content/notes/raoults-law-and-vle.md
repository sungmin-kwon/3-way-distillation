---
title: Raoult's law and VLE
summary: Vapor–liquid equilibrium for a nearly ideal binary mixture, worked through on benzene–toluene at 1 atm — Antoine vapor pressures, the bubble and dew curves of a Txy diagram, relative volatility, and where the ideal-mixture assumption breaks down.
date: 2026-11-10
tags: [cheme]
distillate: For a nearly ideal binary such as benzene–toluene, Raoult's law says the total pressure is the mole-fraction-weighted sum of the pure vapor pressures, and the vapor above the liquid is richer in the more volatile component. A liquid with x = 0.40 mole fraction benzene boils at 95.1 °C at 1 atm and gives a vapor with y = 0.62, one equilibrium stage of enrichment at relative volatility α ≈ 2.5. The law assumes an ideal liquid and a nearly ideal vapor at low pressure; real mixtures need activity coefficients, and azeotropes such as ethanol–water break the picture entirely.
model: [Mistral Large 4]
---

Vapor–liquid equilibrium (*VLE*) describes how each component of a boiling mixture splits between liquid and vapor. François-Marie Raoult showed in 1887 that for many mixtures the simplest possible rule captures that split: each component's partial pressure in the vapor equals its mole fraction in the liquid times its pure-component vapor pressure. That rule, **Raoult's law**, combined with the ideal-gas law for the vapor, predicts the boiling behavior of a whole binary mixture at a fixed pressure, and the natural picture of it is the **Txy diagram**: temperature against composition, with a bubble-point curve and a dew-point curve.

Benzene and toluene are the textbook pair for this because they are nearly ideal: the two molecules differ by one methyl group, so the liquid barely deviates from ideality and Raoult's law reproduces the measured diagram closely. The [spirits note](note:how-spirits-distillation-works) covers the opposite extreme, ethanol–water, where the law fails and an azeotrope appears instead.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| mixture | benzene–toluene, binary |
| pressure | $P = 760$ mmHg (1 atm) |
| liquid composition | $x = 0.40$ mole fraction benzene |

## Vapor pressure: the Antoine equation

The vapor pressure of a pure liquid, $P^{\mathrm{sat}}(T)$, rises steeply with temperature $T$. Over a limited range it is fit well by the **Antoine equation**,

$$\log_{10}\!\left(\frac{P^{\mathrm{sat}}}{\mathrm{mmHg}}\right) = A - \frac{B}{C + T}$$

with $T$ in °C, $P^{\mathrm{sat}}$ in mmHg, and one set of constants per component (as tabulated in Geankoplis, 2003, Appendix A.2):

| component | $A$ | $B$ | $C$ |
| --- | --- | --- | --- |
| benzene | 6.90565 | 1211.033 | 220.790 |
| toluene | 6.95464 | 1344.800 | 219.482 |

Setting $P^{\mathrm{sat}} = 760$ mmHg and solving for $T$ returns 80.1 °C for benzene and 110.6 °C for toluene, their normal boiling points. At 95.1 °C, the bubble point found below, the equation gives $P^{\mathrm{sat}}_{\mathrm{benzene}} = 1181.5$ mmHg and $P^{\mathrm{sat}}_{\mathrm{toluene}} = 479.0$ mmHg.

## Raoult's law and the bubble point

For an **ideal liquid**, each component contributes to the total pressure in proportion to its mole fraction: its partial pressure is $p_i = x_i P_i^{\mathrm{sat}}(T)$. For the **vapor** at low pressure, the ideal-gas law (Dalton's law) gives $p_i = y_i P$, where $y_i$ is the component's mole fraction in the vapor. At equilibrium,

$$y_i P = x_i P_i^{\mathrm{sat}}(T)$$

Summing over both components and using $\sum_i x_i = 1$ gives the **bubble-point equation** at fixed pressure,

$$P = \sum_i x_i P_i^{\mathrm{sat}}(T)$$

Given the liquid composition, the boiling temperature is the $T$ that satisfies this equation; the vapor composition then follows from $y_i = x_i P_i^{\mathrm{sat}}(T)/P$. The vapor is always richer in the more volatile component: at the bubble point $P_A^{\mathrm{sat}} > P > P_B^{\mathrm{sat}}$, so $y_A > x_A$.

Worked example, $x = 0.40$ at $P = 760$ mmHg. At $T = 95.1$ °C the Antoine equation gives the two vapor pressures above, and

$$0.40 \times 1181.5 + 0.60 \times 479.0 = 760.0 \text{ mmHg}$$

so the bubble point is $T = 95.1$ °C. The vapor in equilibrium with that liquid is

$$y = \frac{x\, P_{\mathrm{benzene}}^{\mathrm{sat}}}{P} = \frac{0.40 \times 1181.5}{760} = 0.622$$

One equilibrium contact enriches the vapor from $x = 0.40$ to $y = 0.62$ in benzene. Solving the bubble-point equation is a bisection on $T$:

```python
import math

# Antoine constants: log10(P/mmHg) = A - B/(C + T), T in deg C
# benzene and toluene, as tabulated in Geankoplis (2003), App. A.2
A = {'benzene': (6.90565, 1211.033, 220.790),
     'toluene': (6.95464, 1344.800, 219.482)}

def psat(name, T):  # pure-component vapor pressure in mmHg
    a, b, c = A[name]
    return 10 ** (a - b / (c + T))

def bubble_T(x, P=760.0):  # T where x*psat(benzene) + (1-x)*psat(toluene) = P
    lo, hi = 70.0, 120.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if x * psat('benzene', mid) + (1 - x) * psat('toluene', mid) < P:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2

x = 0.40
T = bubble_T(x)
y = x * psat('benzene', T) / 760.0  # Raoult's law: y_i * P = x_i * Psat_i
print(f"bubble point of x = {x}: T = {T:.1f} C, y_benzene = {y:.2f}")
```

which prints `bubble point of x = 0.4: T = 95.1 C, y_benzene = 0.62`.

## The dew point and the Txy diagram

The same equilibrium can be run in reverse. Given a vapor composition $y$, the liquid in equilibrium with it has $x_i = y_i P / P_i^{\mathrm{sat}}(T)$, and the condition $\sum_i x_i = 1$ gives the **dew-point equation**,

$$\sum_i \frac{y_i\, P}{P_i^{\mathrm{sat}}(T)} = 1$$

At fixed pressure, each liquid composition $x$ has one bubble temperature and each vapor composition $y$ has one dew temperature. Plotting temperature against composition gives the Txy diagram: the **bubble-point curve** traces the liquid compositions, the **dew-point curve** traces the vapor compositions, and the two meet at the pure-component boiling points. Below the bubble curve the mixture is all liquid, above the dew curve it is all vapor, and between the curves liquid and vapor coexist.

<svg viewBox="0 0 500 490" role="img" aria-label="Txy diagram for benzene–toluene at 1 atm: bubble-point and dew-point curves computed from Antoine constants, with a tie line at 95.1 °C connecting liquid x = 0.40 to its equilibrium vapor y = 0.62." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Txy diagram for benzene–toluene at 1 atm</title>
  <rect x="64" y="36" width="400" height="400" fill="none" style="stroke: var(--rule)"/>
  <path d="M 64.0,52.2 L 68.0,57.7 L 72.0,63.2 L 76.0,68.6 L 80.0,74.0 L 84.0,79.3 L 88.0,84.6 L 92.0,89.7 L 96.0,94.9 L 100.0,100.0 L 104.0,105.0 L 108.0,110.0 L 112.0,114.9 L 116.0,119.7 L 120.0,124.6 L 124.0,129.3 L 128.0,134.0 L 132.0,138.7 L 136.0,143.3 L 140.0,147.9 L 144.0,152.4 L 148.0,156.9 L 152.0,161.4 L 156.0,165.8 L 160.0,170.1 L 164.0,174.4 L 168.0,178.7 L 172.0,182.9 L 176.0,187.1 L 180.0,191.2 L 184.0,195.3 L 188.0,199.4 L 192.0,203.4 L 196.0,207.4 L 200.0,211.4 L 204.0,215.3 L 208.0,219.2 L 212.0,223.0 L 216.0,226.8 L 220.0,230.6 L 224.0,234.3 L 228.0,238.0 L 232.0,241.7 L 236.0,245.4 L 240.0,249.0 L 244.0,252.5 L 248.0,256.1 L 252.0,259.6 L 256.0,263.1 L 260.0,266.6 L 264.0,270.0 L 268.0,273.4 L 272.0,276.7 L 276.0,280.1 L 280.0,283.4 L 284.0,286.7 L 288.0,289.9 L 292.0,293.2 L 296.0,296.4 L 300.0,299.6 L 304.0,302.7 L 308.0,305.9 L 312.0,309.0 L 316.0,312.0 L 320.0,315.1 L 324.0,318.1 L 328.0,321.1 L 332.0,324.1 L 336.0,327.1 L 340.0,330.0 L 344.0,332.9 L 348.0,335.8 L 352.0,338.7 L 356.0,341.6 L 360.0,344.4 L 364.0,347.2 L 368.0,350.0 L 372.0,352.8 L 376.0,355.5 L 380.0,358.2 L 384.0,360.9 L 388.0,363.6 L 392.0,366.3 L 396.0,368.9 L 400.0,371.6 L 404.0,374.2 L 408.0,376.8 L 412.0,379.4 L 416.0,381.9 L 420.0,384.5 L 424.0,387.0 L 428.0,389.5 L 432.0,392.0 L 436.0,394.4 L 440.0,396.9 L 444.0,399.3 L 448.0,401.8 L 452.0,404.2 L 456.0,406.6 L 460.0,408.9 L 464.0,411.3 L 464.0,411.3 L 460.0,405.2 L 456.0,399.3 L 452.0,393.4 L 448.0,387.7 L 444.0,382.1 L 440.0,376.5 L 436.0,371.1 L 432.0,365.7 L 428.0,360.4 L 424.0,355.2 L 420.0,350.0 L 416.0,345.0 L 412.0,340.0 L 408.0,335.1 L 404.0,330.2 L 400.0,325.5 L 396.0,320.8 L 392.0,316.1 L 388.0,311.5 L 384.0,307.0 L 380.0,302.5 L 376.0,298.1 L 372.0,293.7 L 368.0,289.4 L 364.0,285.1 L 360.0,280.9 L 356.0,276.7 L 352.0,272.6 L 348.0,268.5 L 344.0,264.5 L 340.0,260.5 L 336.0,256.5 L 332.0,252.6 L 328.0,248.7 L 324.0,244.9 L 320.0,241.1 L 316.0,237.4 L 312.0,233.6 L 308.0,230.0 L 304.0,226.3 L 300.0,222.7 L 296.0,219.1 L 292.0,215.6 L 288.0,212.1 L 284.0,208.6 L 280.0,205.1 L 276.0,201.7 L 272.0,198.3 L 268.0,194.9 L 264.0,191.6 L 260.0,188.3 L 256.0,185.0 L 252.0,181.8 L 248.0,178.5 L 244.0,175.3 L 240.0,172.2 L 236.0,169.0 L 232.0,165.9 L 228.0,162.8 L 224.0,159.7 L 220.0,156.7 L 216.0,153.6 L 212.0,150.6 L 208.0,147.6 L 204.0,144.7 L 200.0,141.7 L 196.0,138.8 L 192.0,135.9 L 188.0,133.0 L 184.0,130.1 L 180.0,127.3 L 176.0,124.5 L 172.0,121.7 L 168.0,118.9 L 164.0,116.1 L 160.0,113.4 L 156.0,110.6 L 152.0,107.9 L 148.0,105.2 L 144.0,102.5 L 140.0,99.9 L 136.0,97.2 L 132.0,94.6 L 128.0,92.0 L 124.0,89.4 L 120.0,86.8 L 116.0,84.2 L 112.0,81.7 L 108.0,79.1 L 104.0,76.6 L 100.0,74.1 L 96.0,71.6 L 92.0,69.1 L 88.0,66.7 L 84.0,64.2 L 80.0,61.8 L 76.0,59.4 L 72.0,57.0 L 68.0,54.6 L 64.0,52.2 Z" style="fill: var(--accent)" fill-opacity="0.07"/>
  <text x="64" y="454" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="56" y="416.5" text-anchor="end" font-size="11" fill="currentColor">80</text>
  <text x="164" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.25</text>
  <text x="56" y="298.8" text-anchor="end" font-size="11" fill="currentColor">90</text>
  <text x="264" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.5</text>
  <text x="56" y="181.2" text-anchor="end" font-size="11" fill="currentColor">100</text>
  <text x="364" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.75</text>
  <text x="56" y="63.5" text-anchor="end" font-size="11" fill="currentColor">110</text>
  <text x="464" y="454" text-anchor="middle" font-size="11" fill="currentColor">1</text>
  <text x="264" y="478" text-anchor="middle" font-size="12" fill="currentColor">mole fraction benzene, x (liquid) or y (vapor)</text>
  <text transform="translate(20 236) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">temperature (°C)</text>
  <polyline points="64.0,52.2 68.0,57.7 72.0,63.2 76.0,68.6 80.0,74.0 84.0,79.3 88.0,84.6 92.0,89.7 96.0,94.9 100.0,100.0 104.0,105.0 108.0,110.0 112.0,114.9 116.0,119.7 120.0,124.6 124.0,129.3 128.0,134.0 132.0,138.7 136.0,143.3 140.0,147.9 144.0,152.4 148.0,156.9 152.0,161.4 156.0,165.8 160.0,170.1 164.0,174.4 168.0,178.7 172.0,182.9 176.0,187.1 180.0,191.2 184.0,195.3 188.0,199.4 192.0,203.4 196.0,207.4 200.0,211.4 204.0,215.3 208.0,219.2 212.0,223.0 216.0,226.8 220.0,230.6 224.0,234.3 228.0,238.0 232.0,241.7 236.0,245.4 240.0,249.0 244.0,252.5 248.0,256.1 252.0,259.6 256.0,263.1 260.0,266.6 264.0,270.0 268.0,273.4 272.0,276.7 276.0,280.1 280.0,283.4 284.0,286.7 288.0,289.9 292.0,293.2 296.0,296.4 300.0,299.6 304.0,302.7 308.0,305.9 312.0,309.0 316.0,312.0 320.0,315.1 324.0,318.1 328.0,321.1 332.0,324.1 336.0,327.1 340.0,330.0 344.0,332.9 348.0,335.8 352.0,338.7 356.0,341.6 360.0,344.4 364.0,347.2 368.0,350.0 372.0,352.8 376.0,355.5 380.0,358.2 384.0,360.9 388.0,363.6 392.0,366.3 396.0,368.9 400.0,371.6 404.0,374.2 408.0,376.8 412.0,379.4 416.0,381.9 420.0,384.5 424.0,387.0 428.0,389.5 432.0,392.0 436.0,394.4 440.0,396.9 444.0,399.3 448.0,401.8 452.0,404.2 456.0,406.6 460.0,408.9 464.0,411.3" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <polyline points="64.0,52.2 68.0,54.6 72.0,57.0 76.0,59.4 80.0,61.8 84.0,64.2 88.0,66.7 92.0,69.1 96.0,71.6 100.0,74.1 104.0,76.6 108.0,79.1 112.0,81.7 116.0,84.2 120.0,86.8 124.0,89.4 128.0,92.0 132.0,94.6 136.0,97.2 140.0,99.9 144.0,102.5 148.0,105.2 152.0,107.9 156.0,110.6 160.0,113.4 164.0,116.1 168.0,118.9 172.0,121.7 176.0,124.5 180.0,127.3 184.0,130.1 188.0,133.0 192.0,135.9 196.0,138.8 200.0,141.7 204.0,144.7 208.0,147.6 212.0,150.6 216.0,153.6 220.0,156.7 224.0,159.7 228.0,162.8 232.0,165.9 236.0,169.0 240.0,172.2 244.0,175.3 248.0,178.5 252.0,181.8 256.0,185.0 260.0,188.3 264.0,191.6 268.0,194.9 272.0,198.3 276.0,201.7 280.0,205.1 284.0,208.6 288.0,212.1 292.0,215.6 296.0,219.1 300.0,222.7 304.0,226.3 308.0,230.0 312.0,233.6 316.0,237.4 320.0,241.1 324.0,244.9 328.0,248.7 332.0,252.6 336.0,256.5 340.0,260.5 344.0,264.5 348.0,268.5 352.0,272.6 356.0,276.7 360.0,280.9 364.0,285.1 368.0,289.4 372.0,293.7 376.0,298.1 380.0,302.5 384.0,307.0 388.0,311.5 392.0,316.1 396.0,320.8 400.0,325.5 404.0,330.2 408.0,335.1 412.0,340.0 416.0,345.0 420.0,350.0 424.0,355.2 428.0,360.4 432.0,365.7 436.0,371.1 440.0,376.5 444.0,382.1 448.0,387.7 452.0,393.4 456.0,399.3 460.0,405.2 464.0,411.3" fill="none" style="stroke: var(--accent)" stroke-width="2"/>
  <line x1="224.0" y1="234.3" x2="312.7" y2="234.3" style="stroke: var(--muted)" stroke-width="1.5" stroke-dasharray="3 4"/>
  <circle cx="224.0" cy="234.3" r="3" style="fill: var(--ink)"/>
  <circle cx="312.7" cy="234.3" r="3" style="fill: var(--accent)"/>
  <text x="224.0" y="252.3" text-anchor="middle" font-size="10" style="fill: var(--ink)">x = 0.40</text>
  <text x="312.7" y="220.3" text-anchor="middle" font-size="10" style="fill: var(--accent)">y = 0.62</text>
  <text x="140" y="172" text-anchor="start" font-size="11" style="fill: var(--ink)">bubble-point curve (liquid)</text>
  <text x="140" y="88" text-anchor="start" font-size="11" style="fill: var(--accent)">dew-point curve (vapor)</text>
  <text x="264" y="420" text-anchor="middle" font-size="11" style="fill: var(--muted)">liquid</text>
  <text x="264" y="70" text-anchor="middle" font-size="11" style="fill: var(--muted)">vapor</text>
  <text x="340" y="305" text-anchor="middle" font-size="11" style="fill: var(--muted)">two-phase</text>
  <text x="72" y="44" text-anchor="start" font-size="10" style="fill: var(--muted)">toluene, 110.6 °C</text>
  <text x="456" y="428" text-anchor="end" font-size="10" style="fill: var(--muted)">benzene, 80.1 °C</text>
</svg>

*Txy diagram for benzene–toluene at 1 atm, computed from the Antoine constants above. The dashed tie line at 95.1 °C connects the worked example's liquid (x = 0.40) on the bubble curve to its equilibrium vapor (y = 0.62) on the dew curve.*

A horizontal line on this diagram joins phases in equilibrium at one temperature; it is the Txy counterpart of one step on the x–y diagram. A few points on the two curves, computed the same way:

| $x$ (liquid) | bubble $T$ (°C) | $y$ (vapor) |
| --- | --- | --- |
| 0.20 | 102.1 | 0.38 |
| 0.40 | 95.1 | 0.62 |
| 0.50 | 92.1 | 0.71 |
| 0.60 | 89.3 | 0.79 |
| 0.80 | 84.4 | 0.91 |

Consistency check: the dew-point equation at $y = 0.622$ returns $T = 95.1$ °C, the same temperature as the bubble point of $x = 0.40$, as it must.

## Relative volatility

Under Raoult's law the ratio of the two equilibrium relations gives the **relative volatility**

$$\alpha_{AB} = \frac{P_A^{\mathrm{sat}}}{P_B^{\mathrm{sat}}}$$

For benzene (A) over toluene (B) at 1 atm, $\alpha$ falls from 2.60 at benzene's boiling point to 2.35 at toluene's; at the worked example's 95.1 °C it is $\alpha = 2.47$. Eliminating $T$ gives the familiar x–y relation

$$y = \frac{\alpha x}{1 + (\alpha - 1) x}$$

At $x = 0.40$ and $\alpha = 2.47$: $y = 0.987 / 1.587 = 0.622$, matching the Raoult's-law value above. Because $\alpha$ barely moves across this diagram, the [McCabe–Thiele note](note:reading-a-mccabe-thiele-diagram) can model the pair with a constant $\alpha = 2.5$.

## Where Raoult's law fails

Real liquids deviate from ideality, which is written as $p_i = x_i \gamma_i P_i^{\mathrm{sat}}(T)$ with an **activity coefficient** $\gamma_i$ that equals 1 for an ideal mixture. Benzene–toluene stays within a few percent of $\gamma = 1$ across the whole composition range, which is why Raoult's law works here. Mixtures with unlike molecules deviate more: **positive deviations** ($\gamma > 1$), as in ethanol–water, can produce a minimum-boiling **azeotrope**, where liquid and vapor have the same composition and no further enrichment is possible. At 1 atm the ethanol–water azeotrope is 95.6 wt % ethanol (about 97% ABV) and boils at 78.2 °C, below the boiling point of either pure component; the [spirits note](note:how-spirits-distillation-works) runs into exactly this wall. Negative deviations ($\gamma < 1$), as in chloroform–acetone, give maximum-boiling azeotropes instead. At high pressure the vapor is no longer ideal either, and fugacity coefficients replace partial pressures.

## Limits

Raoult's law assumes a binary mixture, an ideal liquid, and an ideal vapor. At 1 atm the vapor correction is small, but at high pressure it is not. The Antoine equation is an empirical fit with a limited temperature range; here the diagram spans 80.1–110.6 °C. The diagram is drawn at one fixed pressure: higher pressure shifts both curves up, and the fixed-temperature alternative is the Pxy diagram. Real column design replaces Raoult's law with an activity-coefficient model (Wilson, NRTL, UNIQUAC) fitted to measured data, plus enthalpy balances. For similar molecules such as benzene–toluene, Raoult's law is already a good first estimate.
