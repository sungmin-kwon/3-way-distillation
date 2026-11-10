---
title: Mendelian randomization
summary: Using SNPs as instruments to ask causal questions of observational data — the three IV assumptions, the Wald ratio and IVW on a toy LDL-to-CHD example, the real LDL result, and the pleiotropy sensitivity analyses, with a computed scatter figure.
date: 2026-11-10
tags: [genetics]
distillate: Mendelian randomization (MR) uses genetic variants as instruments for an exposure, because alleles are allocated at meiosis, roughly at random with respect to confounders. On a toy example with three LDL-C instruments (effects 0.20, 0.10, 0.30 mmol/L per allele on LDL-C; 0.08, 0.036, 0.126 log-OR on CHD), the Wald ratios are 0.40, 0.36, 0.42 and the IVW estimate is 0.41 log-OR per mmol/L, OR = 1.51 per mmol/L, with F ≈ 4667 (rule of thumb F > 10). The real MR answer for LDL-C and CHD is about OR 0.5 per 1 mmol/L lower LDL. Validity rests on the exclusion-restriction assumption, which horizontal pleiotropy violates.
model: [Mistral Large 4]
---

Observational studies associate many things with disease, but confounding and reverse causation make most of those associations non-causal: HDL cholesterol looks protective observationally yet HDL-raising trials were null, and the same happened for several vitamins and hormone replacement. **Mendelian randomization** (MR) attacks this by using genetic variants as **instruments** for a modifiable exposure: alleles are fixed at conception and allocated by meiosis, so they are roughly independent of environmental confounders, "naturally randomized" (Smith & Ebrahim, 2003; Davey Smith & Hemani, 2014)[^1]. If the variant raises the exposure and disease risk moves accordingly, the exposure is more likely causal. MR builds directly on the [GWAS note](note:genome-wide-association-studies), whose SNP–trait effects are the input.

Throughout, the note uses one worked example: a toy two-sample MR of LDL cholesterol on coronary heart disease.

| | value |
| --- | --- |
| exposure X | LDL-C, mmol/L |
| outcome Y | CHD, log-OR |
| instruments | 3 SNPs, effects below |
| GWAS sizes | N = 100,000 per trait (for the F-statistic) |

[^1]: Smith & Ebrahim (2003), Int J Epidemiol 32, 1–22, doi:10.1093/ije/dyh131; Davey Smith & Hemani (2014), Hum Mol Genet 23(R1), R89–R98, doi:10.1093/hmg/ddu328.

## The three instrument assumptions

An instrument G is valid for exposure X → outcome Y if: (1) **relevance**, G is associated with X (checked by an F-statistic, rule of thumb F > 10); (2) **independence**, G is not associated with confounders of X–Y (plausible because of meiotic randomization, but population stratification must still be corrected); (3) **exclusion restriction**, G affects Y only through X. The third is the fragile one: **horizontal pleiotropy**, where G affects Y through another pathway, violates it and can bias the estimate in either direction.

## The Wald ratio and IVW

With one instrument, the causal effect per unit of X is the **Wald ratio** $\theta = \beta_{GY}/\beta_{XG}$. With several, the inverse-variance-weighted (IVW) estimate with first-order weights $\beta_{XG}^2$ is (Burgess et al., 2013)[^2]:

$$
\hat\theta_{\mathrm{IVW}} = \frac{\sum_j \beta_{XGj}\,\beta_{GYj}}{\sum_j \beta_{XGj}^2}
$$

| SNP | $\beta_{XG}$ (mmol/L) | $\beta_{GY}$ (log-OR) | Wald $\beta_{GY}/\beta_{XG}$ |
| --- | --- | --- | --- |
| SNP1 | 0.20 | 0.080 | 0.40 |
| SNP2 | 0.10 | 0.036 | 0.36 |
| SNP3 | 0.30 | 0.126 | 0.42 |

$$
\hat\theta_{\mathrm{IVW}} = \frac{0.20 \times 0.08 + 0.10 \times 0.036 + 0.30 \times 0.126}{0.20^2 + 0.10^2 + 0.30^2} = \frac{0.0574}{0.14} = 0.41 \text{ log-OR per mmol/L}
$$

i.e. OR $= e^{0.41} = 1.51$ per 1 mmol/L higher LDL-C. The rough F-statistic, $F \approx N \sum_j \beta_{XGj}^2 / k = 100{,}000 \times 0.14 / 3 \approx 4667$, is far above 10, so the instruments are strong. Plotting SNP effects on the outcome against SNP effects on the exposure, the slope through the origin is the IVW estimate:

<svg viewBox="0 0 500 300" role="img" aria-label="Mendelian randomization scatter: three SNP effects on LDL-C (x) vs on CHD log-odds (y), with the IVW slope line through the origin at 0.41 log-OR per mmol/L." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>MR scatter plot</title>
  <rect x="60.0" y="30.0" width="410.0" height="220.0" fill="none" style="stroke: var(--rule)"/>
    <text x="60.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="177.1" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">0.1</text>
  <text x="294.3" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">0.2</text>
  <text x="411.4" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">0.3</text>
    <text x="52.0" y="254.0" text-anchor="end" font-size="11" fill="currentColor">0</text>
  <text x="52.0" y="180.7" text-anchor="end" font-size="11" fill="currentColor">0.05</text>
  <text x="52.0" y="107.3" text-anchor="end" font-size="11" fill="currentColor">0.1</text>
  <text x="52.0" y="34.0" text-anchor="end" font-size="11" fill="currentColor">0.15</text>
  <text x="265.0" y="286.0" text-anchor="middle" font-size="12" fill="currentColor">SNP effect on LDL-C (mmol/L per allele)</text>
  <text transform="translate(16 140.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">SNP effect on CHD (log-OR)</text>
  <line x1="60.0" y1="250.0" x2="437.2" y2="56.4" style="stroke: var(--ink)" stroke-width="2"/>
  <circle cx="294.3" cy="132.7" r="5" style="fill: var(--accent)"/>
  <circle cx="177.1" cy="197.2" r="5" style="fill: var(--accent)"/>
  <circle cx="411.4" cy="65.2" r="5" style="fill: var(--accent)"/>
  <text x="437.2" y="46.4" text-anchor="end" font-size="11" fill="currentColor">IVW slope = 0.41</text>
</svg>

*MR scatter: SNP effects on CHD (log-OR, y) vs on LDL-C (mmol/L, x); the line through the origin has slope 0.41, the IVW causal estimate.*

[^2]: Burgess, Butterworth & Thompson (2013), Genet Epidemiol 37, 658–665, doi:10.1002/gepi.21758.

## A real answer: LDL-C causes CHD

The cleanest MR result in cardiovascular medicine: polymorphisms in NPC1L1, HMGCR or both (the targets of ezetimibe and statins) that lower LDL-C lower CHD risk log-linearly, about OR 0.5 per 1 mmol/L lower LDL-C over a lifetime (Ference et al., 2015, 2×2 factorial MR)[^3], consistent with the EAS consensus that LDL causes atherosclerotic disease (Ference et al., 2017)[^4]. Because the instruments act through different mechanisms, the agreement across genes argues against pleiotropy here.

[^3]: Ference et al. (2015), JAMA 313, 1989–1997, doi:10.1001/jama.2015.0297.
[^4]: Ference et al. (2017), Eur Heart J 38, 2459–2472, doi:10.1093/eurheartj/ehx144.

## Where MR changed minds

MR's value is as much in null results as in positive ones. A variant in LPA that raises HDL cholesterol did not lower myocardial infarction risk, arguing against HDL as a causal target (Voight et al., 2012)[^9]; likewise, CRP-raising variants did not raise CHD risk, so CRP is a marker rather than a cause (Engert et al., 2011)[^10]. These are the cases that made MR persuasive: observational associations that failed under genetic randomization.

[^9]: Voight et al. (2012), Nat Genet 44, 164–170, doi:10.1038/ng.2795.
[^10]: Engert et al. (2011), BMJ 342, d548, doi:10.1136/bmj.d548.

## Two-sample MR and sensitivity analyses

Usually $\beta_{XG}$ and $\beta_{GY}$ come from two different GWAS (two-sample MR, run at scale by MR-Base, Hemani et al., 2018)[^5], which also enables the [PRS note](note:polygenic-risk-scores)'s exposure scores as instruments. Because pleiotropy is the main threat, standard sensitivity analyses are: **MR-Egger** regression, whose intercept estimates average pleiotropy (Bowden et al., 2015)[^6]; the **weighted median**, valid if at least 50% of instruments are valid (Bowden et al., 2016)[^7]; **MR-PRESSO**, which detects and removes pleiotropic outliers (Verbanck et al., 2018)[^8]; leave-one-out and Cochran's Q for heterogeneity. Estimates from these usually agree with IVW when pleiotropy is small, and disagreeing estimates are a red flag.

[^5]: Hemani et al. (2018), Eur J Epidemiol 33, 997–1003, doi:10.1007/s10654-017-0062-x.
[^6]: Bowden et al. (2015), Int J Epidemiol 44, 512–525, doi:10.1093/ije/dyv080.
[^7]: Bowden et al. (2016), Genet Epidemiol 40, 304–314, doi:10.1002/gepi.21965.
[^8]: Verbanck et al. (2018), Nat Genet 50, 1412–1418, doi:10.1038/s41588-018-0099-7.

## The toy MR in Python

```python
import math

# Toy two-sample MR: does LDL-C cause CHD? 3 SNP instruments.
bXG = [0.20, 0.10, 0.30]       # SNP -> LDL-C, mmol/L per allele
bGY = [0.08, 0.036, 0.126]     # SNP -> CHD, log-OR per allele
N, k = 100_000, 3              # GWAS sample size, number of instruments

wald = [g / x for x, g in zip(bXG, bGY)]                    # Wald ratio per SNP
ivw = sum(x * g for x, g in zip(bXG, bGY)) / sum(x * x for x in bXG)  # IVW
F = N * sum(x * x for x in bXG) / k                         # instrument strength
print("Wald ratios:", [f"{w:.2f}" for w in wald])
print(f"IVW = {ivw:.2f} log-OR per mmol/L -> OR = {math.exp(ivw):.2f} per mmol/L")
print(f"F ~ {F:.0f} (rule of thumb: F > 10)")
```

which prints:

```
Wald ratios: ['0.40', '0.36', '0.42']
IVW = 0.41 log-OR per mmol/L -> OR = 1.51 per mmol/L
F ~ 4667 (rule of thumb: F > 10)
```

## Limits

The exclusion restriction cannot be tested directly, only probed by the sensitivity analyses above; horizontal pleiotropy is common, since most variants affect several traits. Weak instruments bias toward the null (winner's-curse-affected $\beta_{XG}$ underestimates strength), which is why F > 10 is required. MR estimates the effect of a **lifetime** difference in the exposure, which can exceed short trial effects (cumulative exposure), and developmental compensation (canalization) can mask genetic effects. As with all genetic analyses, discovery populations are mostly European-ancestry (see the [GWAS note](note:genome-wide-association-studies)), sample overlap between the two GWAS inflates two-sample estimates, and an MR estimate is an association of the instrument, valid only if all three assumptions hold.
