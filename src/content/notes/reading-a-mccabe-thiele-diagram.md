---
title: Reading a McCabe–Thiele diagram
summary: The graphical method for binary distillation, worked from start to finish on a 50/50 benzene–toluene-like feed — equilibrium curve, q-line, operating lines, stepping off stages, and checking the count with Fenske, minimum reflux and Gilliland.
date: 2026-11-09
tags: [cheme]
distillate: Draw the equilibrium curve and two straight operating lines on an x–y diagram, then step between them from the top product down to the bottom product; each step is one theoretical stage. For a 50/50 feed split into 95% and 5% products at α = 2.5 and 1.5 × minimum reflux, that comes to 12 stages. It only holds for binary mixtures with constant molar overflow, so it teaches how a column works rather than designing one.
model: [Mistral Large 4, Claude Opus 5.5]
---

The McCabe–Thiele method (1925) designs a binary distillation column on paper: plot a few lines on an x–y diagram and count the stages off graphically. Process simulators have long since taken over real design, but the geometry is still the clearest picture of what a column does, and it's the picture behind every "number of stages vs. reflux" trade-off.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| mixture | benzene–toluene, modeled with constant relative volatility $\alpha = 2.5$ |
| feed | $F = 100$ kmol/h, $x_F = 0.50$, saturated liquid ($q = 1$) |
| distillate | $x_D = 0.95$ |
| bottoms | $x_B = 0.05$ |
| reflux | $R = 1.5\,R_{\min}$ |

## The axes

- **x**: mole fraction of the more volatile ("light") component in the **liquid**
- **y**: mole fraction of the light component in the **vapor**

Both run from 0 to 1. The diagonal $y = x$ is a reference line: a point on it is a stream whose composition is the same whether you read it as liquid or vapor, which is how the product compositions are marked.

## Overall mass balance first

Before drawing anything, the component and total balances fix the product rates:

$$
F = D + B, \qquad F x_F = D x_D + B x_B
\;\;\Rightarrow\;\;
D = F\,\frac{x_F - x_B}{x_D - x_B} = 100 \cdot \frac{0.45}{0.90} = 50 \text{ kmol/h}
$$

so $B = 50$ kmol/h. A symmetric spec gives a symmetric split.

## The equilibrium curve

For constant relative volatility,

$$
y^* = \frac{\alpha x}{1 + (\alpha - 1)\,x}
$$

At $x = 0.5$ and $\alpha = 2.5$, $y^* = 1.25 / 1.75 = 0.714$. The curve always lies above the diagonal because the vapor is richer in the light component than the liquid it's in equilibrium with. The further it bows away from the diagonal (bigger $\alpha$), the easier the separation and the fewer stages you need.

The formula is only a convenience. When $\alpha$ isn't constant, plot measured VLE data instead and the rest of the method works unchanged; that's how ethanol–water is done. What the diagram can't get past is an azeotrope: there the curve meets the diagonal, the steps pinch, and no number of stages crosses it. Ethanol–water meets exactly that wall at about 97% ABV. And with only one composition axis, the diagram has no room for a third component, so multicomponent columns are solved stage by stage in a simulator.

## The q-line

The feed's thermal condition is $q$, the moles of liquid added to the stripping section per mole of feed (for a two-phase feed, its liquid fraction). The q-line is the locus where the two operating lines can meet:

$$
y = \frac{q}{q-1}\,x - \frac{x_F}{q-1}
$$

It always passes through $(x_F, x_F)$, and its slope is $q/(q-1)$:

| Feed condition | q | slope of q-line |
| --- | --- | --- |
| Subcooled liquid | $q > 1$ | positive, steeper than 1 |
| Saturated liquid | $q = 1$ | vertical, at $x = x_F$ |
| Partly vaporized | $0 < q < 1$ | negative |
| Saturated vapor | $q = 0$ | horizontal, at $y = x_F$ |
| Superheated vapor | $q < 0$ | positive, between 0 and 1 |

Our feed is saturated liquid, so the q-line is the vertical line $x = 0.5$.

## Minimum reflux

Lowering the reflux ratio $R = L/D$ lowers the slope of the rectifying line, so its intersection with the q-line slides down toward the equilibrium curve. When it touches the curve, the steps between the lines get infinitely small near that point (a **pinch**) and the number of stages diverges. That is $R_{\min}$.

For our feed the pinch is at $(0.5,\ 0.714)$. The rectifying line through $(0.95, 0.95)$ and the pinch has slope

$$
\frac{R_{\min}}{R_{\min}+1} = \frac{0.95 - 0.714}{0.95 - 0.5} = 0.524
\;\;\Rightarrow\;\; R_{\min} = 1.10
$$

(For a well-behaved curve like this one, the pinch sits where the q-line meets the curve. For strongly non-ideal mixtures such as ethanol–water, the operating line can touch the curve somewhere else first, a *tangent pinch*, and you have to find it on the diagram.)

We operate at $R = 1.5 \times 1.10 = 1.65$. Typical practice is somewhere around 1.2–1.5 × $R_{\min}$: lower reflux saves energy in the reboiler and condenser, but costs more stages and a taller column.

## The operating lines

**Rectifying section** (above the feed). A mole balance around the top of the column, from any stage up through the condenser, gives $V y = L x + D x_D$. With constant molar overflow (see below) $L$ and $V$ are constant in the section, so

$$
y = \frac{R}{R+1}\,x + \frac{x_D}{R+1} = 0.623\,x + 0.358
$$

It starts at $(x_D, x_D)$ and reaches the q-line at $(0.5,\ 0.670)$.

**Stripping section** (below the feed). Flows: $L = R D = 82.5$, $V = L + D = 132.5$, and with a saturated-liquid feed $\bar L = L + qF = 182.5$ and $\bar V = V - (1-q)F = 132.5$ kmol/h. The balance around the bottom gives

$$
y = \frac{\bar L}{\bar V}\,x - \frac{B\,x_B}{\bar V} = 1.377\,x - 0.019
$$

which runs from $(x_B, x_B)$ to the same point on the q-line. That shared point is no coincidence: the q-line is defined as the place where the two operating lines meet.

## Stepping off the stages

Start at $(x_D, x_D)$. With a total condenser, the vapor leaving the top stage has $y_1 = x_D$.

1. Go **horizontally** to the equilibrium curve. That gives $x_1$, the liquid leaving stage 1 in equilibrium with $y_1$: one theoretical stage.
2. Go **vertically** to the operating line. That gives $y_2$, the vapor rising from stage 2 that passes the liquid $x_1$. This is the mass balance between stages.
3. Repeat. Once a step crosses the q-line, use the stripping line instead. Stop when $x \le x_B$.

The first few steps in numbers (equilibrium inverted as $x = y / (\alpha - (\alpha - 1)y)$):

| stage | $y$ (vapor leaving) | $x$ (liquid leaving) |
| --- | --- | --- |
| 1 | 0.950 | 0.884 |
| 2 | 0.909 | 0.799 |
| 3 | 0.856 | 0.704 |
| 4 | 0.797 | 0.611 |
| 5 | 0.739 | 0.531 |
| 6 (feed) | 0.689 | 0.470 |
| 7 | 0.628 | 0.404 |
| … | … | … |
| 12 | 0.087 | 0.037 |

Stage 6 is the first whose liquid is leaner than the feed, so it's the optimal feed stage: switching lines there keeps every step as large as possible. The construction takes **12 theoretical stages**, and the last overshoots $x_B$ (0.037 < 0.05), so the column slightly over-delivers. If the reboiler counts as one equilibrium stage (a partial reboiler does), that's 11 stages in the column plus the reboiler.

<svg viewBox="0 0 500 490" role="img" aria-label="McCabe–Thiele diagram for the worked example: relative volatility 2.5, saturated-liquid feed at 0.5, distillate 0.95, bottoms 0.05, reflux ratio 1.65. Twelve theoretical stages are stepped off, with the feed on stage 6." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>McCabe–Thiele construction for the worked example</title>
  <rect x="64" y="36" width="400" height="400" fill="none" style="stroke: var(--rule)"/>
  <text x="64" y="454" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="56" y="440" text-anchor="end" font-size="11" fill="currentColor">0</text>
  <text x="164" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.25</text>
  <text x="56" y="340" text-anchor="end" font-size="11" fill="currentColor">0.25</text>
  <text x="264" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.5</text>
  <text x="56" y="240" text-anchor="end" font-size="11" fill="currentColor">0.5</text>
  <text x="364" y="454" text-anchor="middle" font-size="11" fill="currentColor">0.75</text>
  <text x="56" y="140" text-anchor="end" font-size="11" fill="currentColor">0.75</text>
  <text x="464" y="454" text-anchor="middle" font-size="11" fill="currentColor">1</text>
  <text x="56" y="40" text-anchor="end" font-size="11" fill="currentColor">1</text>
  <text x="264" y="478" text-anchor="middle" font-size="12" fill="currentColor">x, light component in the liquid</text>
  <text transform="translate(20 236) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">y, light component in the vapor</text>
  <line x1="64" y1="436" x2="464" y2="36" style="stroke: var(--muted)" stroke-dasharray="3 4"/>
  <polyline points="64.0,436.0 68.0,426.1 72.0,416.6 76.0,407.3 80.0,398.3 84.0,389.5 88.0,381.0 92.0,372.7 96.0,364.6 100.0,356.7 104.0,349.0 108.0,341.6 112.0,334.3 116.0,327.2 120.0,320.3 124.0,313.6 128.0,307.0 132.0,300.5 136.0,294.3 140.0,288.1 144.0,282.2 148.0,276.3 152.0,270.6 156.0,265.0 160.0,259.5 164.0,254.2 168.0,248.9 172.0,243.8 176.0,238.8 180.0,233.9 184.0,229.1 188.0,224.4 192.0,219.8 196.0,215.3 200.0,210.8 204.0,206.5 208.0,202.2 212.0,198.1 216.0,194.0 220.0,189.9 224.0,186.0 228.0,182.1 232.0,178.3 236.0,174.6 240.0,170.9 244.0,167.3 248.0,163.8 252.0,160.3 256.0,156.9 260.0,153.6 264.0,150.3 268.0,147.0 272.0,143.9 276.0,140.7 280.0,137.7 284.0,134.6 288.0,131.7 292.0,128.7 296.0,125.8 300.0,123.0 304.0,120.2 308.0,117.5 312.0,114.8 316.0,112.1 320.0,109.5 324.0,106.9 328.0,104.3 332.0,101.8 336.0,99.4 340.0,96.9 344.0,94.5 348.0,92.2 352.0,89.8 356.0,87.6 360.0,85.3 364.0,83.1 368.0,80.9 372.0,78.7 376.0,76.6 380.0,74.4 384.0,72.4 388.0,70.3 392.0,68.3 396.0,66.3 400.0,64.3 404.0,62.4 408.0,60.5 412.0,58.6 416.0,56.7 420.0,54.8 424.0,53.0 428.0,51.2 432.0,49.4 436.0,47.7 440.0,46.0 444.0,44.2 448.0,42.6 452.0,40.9 456.0,39.2 460.0,37.6 464.0,36.0" fill="none" style="stroke: var(--ink)" stroke-width="2"/>
  <line x1="264.0" y1="236.0" x2="264.0" y2="150.3" style="stroke: var(--muted)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <polyline points="444.0,56.0 264.0,168.1 84.0,416.0" fill="none" style="stroke: var(--muted)" stroke-width="1.5"/>
  <polyline points="444.0,56.0 417.5,56.0 417.5,72.5 383.7,72.5 383.7,93.5 345.7,93.5 345.7,117.2 308.4,117.2 308.4,140.4 276.4,140.4 276.4,160.4 252.0,160.4 252.0,184.7 225.4,184.7 225.4,221.3 190.7,221.3 190.7,269.0 153.1,269.0 153.1,320.8 119.7,320.8 119.7,366.8 94.9,366.8 94.9,401.0 78.8,401.0 78.8,421.2" fill="none" style="stroke: var(--accent)" stroke-width="1.75" stroke-linejoin="round"/>
  <text x="412" y="51" text-anchor="end" font-size="10" style="fill: var(--accent)">1</text>
  <text x="247" y="155" text-anchor="end" font-size="10" style="fill: var(--accent)">6</text>
  <text x="74" y="396" text-anchor="end" font-size="10" style="fill: var(--accent)">12</text>
  <text x="200" y="172" text-anchor="end" font-size="11" style="fill: var(--ink)">equilibrium curve</text>
  <text x="344" y="164" text-anchor="start" font-size="11" style="fill: var(--muted)">rectifying line</text>
  <text x="164" y="356" text-anchor="start" font-size="11" style="fill: var(--muted)">stripping line</text>
  <text x="270" y="212" text-anchor="start" font-size="11" style="fill: var(--muted)">q-line</text>
  <text x="444" y="76" text-anchor="middle" font-size="11" style="fill: currentColor">x_D</text>
  <text x="92" y="430" text-anchor="start" font-size="11" style="fill: currentColor">x_B</text>
  <text x="264" y="254" text-anchor="middle" font-size="11" style="fill: currentColor">x_F</text>
</svg>

*The worked example: α = 2.5, saturated-liquid feed at $x_F = 0.5$, $R = 1.65$. The accent line steps off 12 theoretical stages; stages 1, 6 (feed) and 12 are numbered.*

## Checking the count: Fenske and Gilliland

**Fenske** gives the minimum number of stages, at total reflux (both operating lines collapse onto the diagonal):

$$
N_{\min} = \frac{\ln\!\left[\dfrac{x_D}{1-x_D}\cdot\dfrac{1-x_B}{x_B}\right]}{\ln \alpha}
= \frac{\ln (19 \times 19)}{\ln 2.5} = \frac{5.89}{0.916} = 6.4
$$

**Gilliland** is an empirical correlation between how far you are above $R_{\min}$ and how far above $N_{\min}$. With the Molokanov fit:

$$
X = \frac{R - R_{\min}}{R + 1} = \frac{1.65 - 1.10}{2.65} = 0.21,
\qquad
Y = \frac{N - N_{\min}}{N + 1} = 1 - \exp\!\left[\frac{1 + 54.4X}{11 + 117.2X}\cdot\frac{X - 1}{\sqrt{X}}\right] = 0.45
$$

Solving for $N$ gives $N \approx 12.6$, in good agreement with the 12 steps on the diagram. The shortcut pair (Fenske, Underwood for $R_{\min}$, Gilliland) is how you size a multicomponent column before running a simulator; for a binary like this one, $R_{\min}$ comes straight off the diagram as above.

## From theoretical stages to a real column

Real trays don't reach equilibrium. With an overall tray efficiency of 70%, the 11 in-column stages become $11 / 0.7 \approx 16$ actual trays. For a packed column you divide packed height by the HETP (height equivalent to a theoretical plate) instead; with an HETP of 0.5 m, the 11 stages need about 5.5 m of packing.

Changing the reflux changes the answer a lot. At $R = 1.2\,R_{\min}$ the stage count rises; at total reflux it falls to Fenske's 6.4 but the column makes no product. This is the capital-vs-energy trade-off that every column design settles somewhere in the middle.

## Why the operating lines are straight: constant molar overflow

If the two components have similar molar heats of vaporization (benzene and toluene: about 31 and 33 kJ/mol at their boiling points), then every mole of vapor that condenses on a tray boils off about one mole of liquid. The molar flows $L$ and $V$ then stay constant within each section, which is exactly what makes each mass-balance line straight. When the latent heats differ a lot, the flows change from stage to stage, the operating lines curve, and you need an enthalpy-based method such as Ponchon–Savarit.
