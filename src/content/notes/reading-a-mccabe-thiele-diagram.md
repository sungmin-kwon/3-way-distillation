---
title: Reading a McCabe–Thiele diagram
summary: The classic graphical method for designing binary distillation columns — the equations behind the equilibrium curve, q-line, and operating lines, plus Fenske/Underwood/Gilliland for stage and reflux estimates.
date: 2026-11-09
tags: [cheme]
distillate: Draw the equilibrium curve and two straight operating lines on an x–y diagram, then step between them; each step is one theoretical stage. It only holds for binary mixtures with constant molar overflow, so it teaches how columns work rather than designing them.
---

The McCabe–Thiele method designs a binary distillation column on paper: draw a few curves on an x–y diagram and count the stages off graphically. It assumes constant molar overflow, so treat it as an intuition tool — real design happens in a process simulator — but the geometry it teaches is the heart of how columns work.

## The axes

- **x** — mole fraction of the more volatile ("light") component in the **liquid**
- **y** — mole fraction of the light component in the **vapor**

Both run from 0 to 1; everything happens inside the unit square.

## The equations behind the lines

- **Equilibrium curve**: for roughly constant relative volatility $\alpha$,

  $$
  y^* = \frac{\alpha x}{1 + (\alpha - 1)\,x}
  $$

  It always lies above the diagonal $y = x$, because vapor is richer in the light component than the liquid it came from.

- **q-line**: describes the feed's thermal condition $q$ (the fraction of the feed that is liquid):

  $$
  y = \frac{q}{q-1}\,x - \frac{x_F}{q-1}
  $$

  | Feed condition | q | q-line shape |
  | --- | --- | --- |
  | Subcooled liquid | $q > 1$ | steep positive slope |
  | Saturated liquid | $q = 1$ | vertical at $x_F$ |
  | Partially vaporized | $0 < q < 1$ | positive slope |
  | Saturated vapor | $q = 0$ | horizontal at $y_F$ |
  | Superheated vapor | $q < 0$ | negative slope |

- **Rectifying operating line** (above the feed), from the mass balance $V\,y = L\,x + D\,x_D$ with reflux ratio $R = L/D$:

  $$
  y = \frac{R}{R+1}\,x + \frac{x_D}{R+1}
  $$

  It passes through $(x_D, x_D)$ on the diagonal with slope $R/(R+1)$.

- **Stripping operating line** (below the feed):

  $$
  y = \frac{\bar{L}}{\bar{V}}\,x - \frac{B}{\bar{V}}\,x_B
  $$

  passing through $(x_B, x_B)$.

- The two operating lines intersect **on the q-line** — that's where the feed stage goes.

## The diagram (schematic, α ≈ 3.3, saturated-liquid feed)

<svg viewBox="0 0 640 480" role="img" aria-label="Schematic McCabe–Thiele diagram with equilibrium curve, q-line, operating lines, and three stages stepped off" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Schematic McCabe–Thiele diagram</title>
  <line x1="80" y1="420" x2="600" y2="420" stroke="currentColor" stroke-width="1.5"/>
  <line x1="80" y1="40" x2="80" y2="420" stroke="currentColor" stroke-width="1.5"/>
  <line x1="340" y1="420" x2="340" y2="426" stroke="currentColor"/>
  <line x1="600" y1="420" x2="600" y2="426" stroke="currentColor"/>
  <line x1="80" y1="420" x2="80" y2="426" stroke="currentColor"/>
  <line x1="74" y1="230" x2="80" y2="230" stroke="currentColor"/>
  <line x1="74" y1="40" x2="80" y2="40" stroke="currentColor"/>
  <text x="80" y="440" text-anchor="middle" font-size="12" fill="currentColor">0</text>
  <text x="340" y="440" text-anchor="middle" font-size="12" fill="currentColor">0.5</text>
  <text x="600" y="440" text-anchor="middle" font-size="12" fill="currentColor">1</text>
  <text x="66" y="234" text-anchor="end" font-size="12" fill="currentColor">0.5</text>
  <text x="66" y="44" text-anchor="end" font-size="12" fill="currentColor">1</text>
  <text x="340" y="462" text-anchor="middle" font-size="13" fill="currentColor">x — mole fraction of light component in liquid</text>
  <text transform="translate(28, 230) rotate(-90)" text-anchor="middle" font-size="13" fill="currentColor">y — mole fraction of light component in vapor</text>
  <line x1="80" y1="420" x2="600" y2="40" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
  <text x="556" y="64" font-size="11" fill="currentColor" opacity="0.7">y = x</text>
  <polyline points="80,420 184,247 288,158 340,128 392,103 496,67 600,40" fill="none" style="stroke: var(--ink)" stroke-width="2.5"/>
  <text x="196" y="222" font-size="12" style="fill: var(--ink)">equilibrium curve y*(x)</text>
  <line x1="340" y1="230" x2="340" y2="90" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.7"/>
  <text x="348" y="224" font-size="12" fill="currentColor" opacity="0.8">q-line (saturated liquid feed)</text>
  <line x1="574" y1="59" x2="340" y2="135" style="stroke: var(--muted)" stroke-width="2"/>
  <text x="452" y="92" font-size="12" style="fill: var(--muted)">rectifying line, slope R/(R+1)</text>
  <line x1="340" y1="135" x2="106" y2="401" style="stroke: var(--muted)" stroke-width="2" stroke-dasharray="8 4"/>
  <text x="128" y="330" font-size="12" style="fill: var(--muted)">stripping line</text>
  <polyline points="574,59 522,59 522,76 466,76 466,94 415,94 415,110" fill="none" style="stroke: var(--accent)" stroke-width="2.5"/>
  <text x="574" y="50" text-anchor="middle" font-size="12" fill="currentColor">x_D</text>
  <text x="106" y="418" text-anchor="middle" font-size="12" fill="currentColor">x_B</text>
  <text x="340" y="248" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">x_F</text>
</svg>

## Stepping off the stages

Start at $x_D$ on the diagonal. Go **horizontally** to the equilibrium curve — one theoretical stage: the vapor leaving a tray is in equilibrium with the liquid leaving it. Then **vertically** back to the operating line — the mass balance around the top of the column. Each horizontal-plus-vertical pair is one stage. Switch from the rectifying to the stripping line at the feed and repeat until $x_B$. Graphically, you are alternately solving the equilibrium equation and the operating-line equation; the number of steps is the number of theoretical stages required. Actual trays = theoretical stages ÷ tray efficiency.

## Minimum stages and minimum reflux

- **Fenske equation** (total reflux, minimum stages):

  $$
  N_{\min} = \frac{\ln\!\left[\dfrac{x_D}{1-x_D}\cdot\dfrac{1-x_B}{x_B}\right]}{\ln \alpha_{\text{avg}}}
  $$

- **Underwood equations** give $R_{\min}$ — the reflux at which the operating line touches the equilibrium curve at a pinch, where the stage count diverges.
- **Gilliland correlation** relates $N/N_{\min}$ to $(R - R_{\min})/(R + 1)$, giving a quick estimate of the actual stage count at a chosen operating reflux. Industry typically runs at $R \approx 1.1\text{–}1.5 \times R_{\min}$: the classic capital-vs-energy trade-off.

## Why the operating lines are straight: constant molar overflow

If the two components have similar molar latent heats, condensing one mole of vapor releases enough heat to vaporize one mole of liquid. Then the liquid and vapor flow rates $L$ and $V$ are constant within each column section (rectifying/stripping), which is exactly what makes the mass-balance lines straight. When CMO fails — very different latent heats — the operating lines curve and the simple construction needs correction.

## Limits

McCabe–Thiele assumes a binary mixture, CMO, and constant $\alpha$. It breaks down for azeotropes (the equilibrium curve crosses the diagonal), multicomponent feeds, and packed sections with real hydraulics — which is why industry designs in Aspen/HYSYS and uses McCabe–Thiele to *understand* what the simulator is doing.
