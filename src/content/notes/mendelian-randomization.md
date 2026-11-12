---
title: Mendelian randomization
summary: Using SNPs as instruments to ask causal questions of observational data — the three IV assumptions, the Wald ratio and IVW on a toy LDL-to-CHD example, the real LDL result, and the pleiotropy sensitivity analyses, with a computed scatter figure and the toy example in R.
date: 2026-11-10
tags: []
distillate: Mendelian randomization (MR) uses genetic variants as instruments for an exposure, because alleles are allocated at meiosis, roughly at random with respect to confounders. On a toy example with three LDL-C instruments (effects 0.20, 0.10, 0.30 mmol/L per allele on LDL-C; 0.08, 0.036, 0.126 log-OR on CHD), the Wald ratios are 0.40, 0.36, 0.42 and the IVW estimate is 0.41 log-OR per mmol/L, OR = 1.51 per mmol/L, with F ≈ 4667 (rule of thumb F > 10). The real MR answer for LDL-C and CHD is about OR 0.5 per 1 mmol/L lower LDL. Validity rests on the exclusion-restriction assumption, which horizontal pleiotropy violates.
model: [Mistral Large 4, Claude Opus 5.5]
---

Observational studies associate many things with disease, but confounding and reverse causation make most of those associations non-causal: HDL cholesterol looks protective observationally yet HDL-raising trials were null, and the same happened for several vitamins and hormone replacement. **Mendelian randomization** (MR) attacks this by using genetic variants as **instruments** for a modifiable exposure: alleles are fixed at conception and allocated by meiosis, so they are roughly independent of environmental confounders, "naturally randomized" (Davey Smith and Ebrahim, 2003). If the variant raises the exposure and disease risk moves accordingly, the exposure is more likely causal. MR builds directly on genome-wide association studies, whose SNP–trait effects are its input.

Throughout, the note uses one worked example: a toy two-sample MR of LDL cholesterol on coronary heart disease.

| | value |
| --- | --- |
| exposure X | LDL-C, mmol/L |
| outcome Y | CHD, log-OR |
| instruments | 3 SNPs, effects below |
| GWAS sizes | N = 100,000 per trait (for the F-statistic) |

## The three instrument assumptions

An instrument G is valid for exposure X → outcome Y if: (1) **relevance**, G is associated with X (checked by an F-statistic, rule of thumb F > 10); (2) **independence**, G is not associated with confounders of X–Y (plausible because of meiotic randomization, but population stratification must still be corrected); (3) **exclusion restriction**, G affects Y only through X. The third is the fragile one: **horizontal pleiotropy**, where G affects Y through another pathway, violates it and can bias the estimate in either direction.

## The Wald ratio and IVW

With one instrument, the causal effect per unit of X is the **Wald ratio** $\theta = \beta_{GY}/\beta_{XG}$. With several, the inverse-variance-weighted (IVW) estimate with first-order weights $\beta_{XG}^2$ is (Burgess, Butterworth and Thompson, 2013):

$$
\hat\theta_{\mathrm{IVW}} = \frac{\sum_j \beta_{XGj}\,\beta_{GYj}}{\sum_j \beta_{XGj}^2}
$$

| SNP | $\beta_{XG}$ (mmol/L) | $\beta_{GY}$ (log-OR) | Wald $\beta_{GY}/\beta_{XG}$ |
| --- | --- | --- | --- |
| SNP1 | 0.20 | 0.080 | 0.40 |
| SNP2 | 0.10 | 0.036 | 0.36 |
| SNP3 | 0.30 | 0.126 | 0.42 |

$$
\hat\theta_{\mathrm{IVW}} = \frac{0.20 \times 0.08 + 0.10 \times 0.036 + 0.30 \times 0.126}{0.20^2 + 0.10^2 + 0.30^2} = \frac{0.0574}{0.14}
$$

$$
= 0.41 \text{ log-OR per mmol/L}
$$

i.e. OR $= e^{0.41} = 1.51$ per 1 mmol/L higher LDL-C. The rough F-statistic, $F \approx N \sum_j \beta_{XGj}^2 / k = 100{,}000 \times 0.14 / 3 \approx 4667$ (omitting genotype and exposure variance, so an overestimate), is far above 10, so the instruments are strong. Weak instruments (F below about 10) bias a two-sample estimate toward the null, and winner's curse makes the check optimistic: it inflates $\beta_{XG}$ in the discovery GWAS, which overstates F. Plotting SNP effects on the outcome against SNP effects on the exposure, the slope through the origin is the IVW estimate:

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

## A real answer: LDL-C causes CHD

The cleanest MR result in cardiovascular medicine: polymorphisms in NPC1L1, HMGCR or both (the targets of ezetimibe and statins) that lower LDL-C lower CHD risk log-linearly, about OR 0.5 per 1 mmol/L lower LDL-C over a lifetime (Ference et al., 2015, a 2×2 factorial MR). Because the instruments act through different mechanisms, the agreement across genes argues against pleiotropy here. The genetic effect is much larger than the roughly 20% lower risk per mmol/L seen over five years of statin trials, because MR estimates the effect of a **lifetime** difference in exposure, not of a short intervention.

## Where MR changed minds

MR's value is as much in null results as in positive ones. A variant in LIPG (endothelial lipase, Asn396Ser) that raises HDL cholesterol did not lower myocardial infarction risk, arguing against HDL as a causal target (Voight et al., 2012); likewise, CRP-raising variants did not raise CHD risk, so CRP is a marker rather than a cause (C Reactive Protein CHD Genetics Collaboration, 2011). These are the cases that made MR persuasive: observational associations that failed under genetic randomization.

## Two-sample MR and sensitivity analyses

Usually $\beta_{XG}$ and $\beta_{GY}$ come from two different GWAS (two-sample MR, run at scale by MR-Base and its R package TwoSampleMR, Hemani et al., 2018), and an exposure polygenic score can be used as a single combined instrument. Two-sample MR assumes the two GWAS are independent samples from similar (mostly European-ancestry) populations; sample overlap pushes the estimate back toward the confounded observational association. Because pleiotropy is the main threat, and the exclusion restriction cannot be tested directly, only probed, standard sensitivity analyses are: **MR-Egger** regression, whose intercept estimates average pleiotropy (Bowden, Davey Smith and Burgess, 2015); the **weighted median**, valid if at least 50% of instruments are valid (Bowden et al., 2016); **MR-PRESSO**, which detects and removes pleiotropic outliers (Verbanck et al., 2018); leave-one-out and Cochran's Q for heterogeneity. Estimates from these usually agree with IVW when pleiotropy is small, and disagreeing estimates are a red flag.

## The toy MR in R

The IVW estimate is a regression of $\beta_{GY}$ on $\beta_{XG}$ through the origin, so in R it is one call to `lm()`. The toy assumes every SNP's outcome effect has the same standard error; with real summary statistics the call becomes `lm(bGY ~ 0 + bXG, weights = 1 / seGY^2)`, and dropping the `0 +` gives MR-Egger, whose intercept is the pleiotropy estimate above. The TwoSampleMR package wraps these and the other sensitivity analyses.

```r
# Toy two-sample MR: does LDL-C cause CHD? 3 SNP instruments.
bXG <- c(0.20, 0.10, 0.30)     # SNP -> LDL-C, mmol/L per allele
bGY <- c(0.08, 0.036, 0.126)   # SNP -> CHD, log-OR per allele
N <- 100000                    # GWAS sample size
k <- length(bXG)               # number of instruments

wald  <- bGY / bXG                      # Wald ratio per SNP
ivw   <- sum(bXG * bGY) / sum(bXG^2)    # IVW estimate
Fstat <- N * sum(bXG^2) / k             # instrument strength

# The same IVW estimate as a regression through the origin
slope <- coef(lm(bGY ~ 0 + bXG))[["bXG"]]

cat(sprintf("Wald ratios: %s\n", toString(sprintf("%.2f", wald))))
cat(sprintf("IVW = %.2f log-OR per mmol/L -> OR = %.2f per mmol/L\n",
            ivw, exp(ivw)))
cat(sprintf("lm slope through origin = %.2f\n", slope))
cat(sprintf("F ~ %.0f (rule of thumb: F > 10)\n", Fstat))
```

which prints:

```
Wald ratios: 0.40, 0.36, 0.42
IVW = 0.41 log-OR per mmol/L -> OR = 1.51 per mmol/L
lm slope through origin = 0.41
F ~ 4667 (rule of thumb: F > 10)
```

## Sources

- G. Davey Smith, S. Ebrahim, "'Mendelian randomization': can genetic epidemiology contribute to understanding environmental determinants of disease?", *Int. J. Epidemiol.* 32, 1–22 (2003). [doi:10.1093/ije/dyg070](https://doi.org/10.1093/ije/dyg070)
- S. Burgess, A. Butterworth, S. G. Thompson, "Mendelian randomization analysis with multiple genetic variants using summarized data", *Genet. Epidemiol.* 37, 658–665 (2013). [doi:10.1002/gepi.21758](https://doi.org/10.1002/gepi.21758)
- B. A. Ference et al., "Effect of naturally random allocation to lower low-density lipoprotein cholesterol on the risk of coronary heart disease mediated by polymorphisms in NPC1L1, HMGCR, or both", *J. Am. Coll. Cardiol.* 65, 1552–1561 (2015). [doi:10.1016/j.jacc.2015.02.020](https://doi.org/10.1016/j.jacc.2015.02.020)
- B. F. Voight et al., "Plasma HDL cholesterol and risk of myocardial infarction: a mendelian randomisation study", *Lancet* 380, 572–580 (2012). [doi:10.1016/S0140-6736(12)60312-2](https://doi.org/10.1016/S0140-6736(12)60312-2)
- C Reactive Protein Coronary Heart Disease Genetics Collaboration, "Association between C reactive protein and coronary heart disease: mendelian randomisation analysis based on individual participant data", *BMJ* 342, d548 (2011). [doi:10.1136/bmj.d548](https://doi.org/10.1136/bmj.d548)
- G. Hemani et al., "The MR-Base platform supports systematic causal inference across the human phenome", *eLife* 7, e34408 (2018). [doi:10.7554/eLife.34408](https://doi.org/10.7554/eLife.34408)
- J. Bowden, G. Davey Smith, S. Burgess, "Mendelian randomization with invalid instruments: effect estimation and bias detection through Egger regression", *Int. J. Epidemiol.* 44, 512–525 (2015). [doi:10.1093/ije/dyv080](https://doi.org/10.1093/ije/dyv080)
- J. Bowden et al., "Consistent estimation in Mendelian randomization with some invalid instruments using a weighted median estimator", *Genet. Epidemiol.* 40, 304–314 (2016). [doi:10.1002/gepi.21965](https://doi.org/10.1002/gepi.21965)
- M. Verbanck et al., "Detection of widespread horizontal pleiotropy in causal relationships inferred from Mendelian randomization between complex traits and diseases", *Nat. Genet.* 50, 693–698 (2018). [doi:10.1038/s41588-018-0099-7](https://doi.org/10.1038/s41588-018-0099-7)
