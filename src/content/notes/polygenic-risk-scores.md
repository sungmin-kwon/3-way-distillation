---
title: Polygenic risk scores
summary: How a polygenic risk score turns a GWAS into an individual risk number — the weighted allele sum, clumping and p-value thresholding, liability-scale R² and AUC with real accuracy numbers, and the ancestry portability problem, worked on a toy five-SNP example.
date: 2026-11-10
tags: [genetics]
distillate: A polygenic risk score (PRS) is the sum of a person's risk-allele counts weighted by GWAS effect sizes, standardized against a reference panel; on the toy five-SNP example a person with dosages (2, 1, 0, 2, 1) scores PRS = 1.05, z = 1.20 above the panel. For a disease with 1% prevalence, a score explaining 10% of liability variance gives AUC = 0.73. Real scores range from height (common SNPs explain 40–50%) to schizophrenia (PRS liability R² about 7.3%, top- vs bottom-centile OR 39) to coronary disease (AUC 0.79–0.81), but all are most accurate in European-ancestry samples. The model is additive and the score is only as good as the match between discovery and target populations.
model: [Mistral Large 4]
---

Most common diseases are polygenic: thousands of variants each shift risk a little, and no single one is decisive. A **polygenic risk score** (PRS) adds those small effects into one number per person. The landmark demonstration was the International Schizophrenia Consortium's 2009 GWAS, which showed that common variants collectively carry schizophrenia risk and that a weighted sum of them separated cases from controls (Purcell et al., 2009)[^1]. Since then PRS has become a standard tool in human genetics: risk stratification, cohort selection for sequencing, and study design.

Throughout, the note uses one worked example: a toy score built from five SNPs, applied to one person, plus a disease model for the accuracy calculation.

| | value |
| --- | --- |
| SNPs in the toy score | 5, with GWAS effect sizes β = 0.30, 0.20, 0.15, 0.10, 0.05 (log-OR per risk allele) |
| person | dosages (0/1/2 risk alleles) = (2, 1, 0, 2, 1) |
| reference panel | 8 people, for standardizing the score |
| disease model | prevalence K = 1%, score explains R²_L = 0.10 of liability variance |

[^1]: Purcell, Wray, Stone, et al. (2009), Nature 460, 748–752, doi:10.1038/nature08185.

## The score itself

Each SNP contributes its effect size times the number of risk alleles carried (the **dosage**, 0, 1 or 2):

$$
\mathrm{PRS} = \sum_i \beta_i\, g_i
$$

| SNP | effect size $\beta_i$ (log-OR) | dosage $g_i$ | contribution $\beta_i g_i$ |
| --- | --- | --- | --- |
| SNP1 | 0.30 | 2 | 0.60 |
| SNP2 | 0.20 | 1 | 0.20 |
| SNP3 | 0.15 | 0 | 0.00 |
| SNP4 | 0.10 | 2 | 0.20 |
| SNP5 | 0.05 | 1 | 0.05 |

so the person's raw score is

$$
\mathrm{PRS} = 0.60 + 0.20 + 0 + 0.20 + 0.05 = 1.05
$$

To make the score interpretable, it is standardized against a reference panel: with the panel's mean 0.7688 and SD 0.2344, the person's z-score is

$$
z = \frac{1.05 - 0.7688}{0.2344} = 1.20
$$

so this person sits about 1.2 standard deviations above the panel average on this toy score.

## Where the weights come from

The β values are per-allele effect sizes from a **genome-wide association study** (GWAS): one regression per SNP across thousands of people. A SNP is called genome-wide significant at $p < 5 \times 10^{-8}$. But a PRS uses far more than the significant hits, so two steps matter. **Clumping** (LD pruning, e.g. keeping SNPs with $r^2 < 0.2$ in a 250 kb window, as in PLINK) removes SNPs that merely tag each other, which would otherwise double-count the same signal (Purcell et al., 2007)[^2]. **Thresholding** then keeps all clumped SNPs below a p-value cutoff; because the best cutoff varies by trait, the standard clumping-and-thresholding (C+T) method sweeps a grid (5×10⁻⁸ up to 1.0) and picks the one with the best AUC in a held-out sample.

[^2]: Purcell, Neale, Todd-Brown, et al. (2007), PLINK, Am J Hum Genet 81, 559–575, doi:10.1086/519795.

## Measuring accuracy

For a binary disease, accuracy is usually reported on the **liability scale**: Falconer (1965)[^3] modeled disease as a threshold on a continuous, normally distributed liability, and the R² of a PRS on that liability scale is directly comparable to heritability. Lee et al. (2011, 2012)[^4] give the conversion between observed-scale and liability-scale R² given the prevalence and the case fraction of the sample. For the AUC, Dudbridge (2013)[^5] gives the equal-variance (binormal) approximation; the exact liability-threshold value is given by Wray et al. (2010)[^15] and is 0.731 here, so 0.73 stands. The formula:

$$
\mathrm{AUC} = \Phi\!\left(\frac{\sqrt{R_L^2}\,\varphi(T)}{K(1-K)\,\sqrt{2}}\right), \qquad T = \Phi^{-1}(1-K)
$$

where $K$ is the disease prevalence, $\varphi$ and $\Phi$ the normal pdf and cdf, and $R_L^2$ the liability-scale R². For the worked example, $K = 0.01$ gives $T = 2.3263$ and $\varphi(T) = 0.0267$, so with $R_L^2 = 0.10$:

$$
\mathrm{AUC} = \Phi\!\left(\frac{0.3162 \times 0.0267}{0.0099 \times 1.4142}\right) = \Phi(0.603) = 0.73
$$

The case and control distributions of the score are two shifted normal curves:

<svg viewBox="0 0 500 300" role="img" aria-label="Distribution of a polygenic risk score in controls and cases for a disease with 1% prevalence whose score explains 10% of liability variance: controls centered near 0, cases shifted right to about 0.84 standard deviations, giving AUC 0.73." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>PRS distribution in controls and cases</title>
  <rect x="56.0" y="30.0" width="420.0" height="220.0" fill="none" style="stroke: var(--rule)"/>
  <text x="116.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">-2</text>
  <text x="176.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">-1</text>
  <text x="236.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">0</text>
  <text x="296.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">1</text>
  <text x="356.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">2</text>
  <text x="416.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">3</text>
  <text x="476.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">4</text>
  <text x="266.0" y="286.0" text-anchor="middle" font-size="12" fill="currentColor">PRS (standard deviations)</text>
  <polyline points="56.0,247.8 59.5,247.4 63.0,246.9 66.5,246.3 70.0,245.7 73.5,244.9 77.0,244.0 80.5,243.1 84.0,241.9 87.5,240.7 91.0,239.3 94.5,237.7 98.0,235.9 101.5,233.9 105.0,231.7 108.5,229.2 112.0,226.5 115.5,223.6 119.0,220.4 122.5,216.9 126.0,213.1 129.5,209.0 133.0,204.7 136.5,200.0 140.0,195.0 143.5,189.8 147.0,184.3 150.5,178.5 154.0,172.5 157.5,166.2 161.0,159.8 164.5,153.1 168.0,146.4 171.5,139.6 175.0,132.7 178.5,125.8 182.0,118.9 185.5,112.2 189.0,105.5 192.5,99.1 196.0,92.9 199.5,87.1 203.0,81.6 206.5,76.4 210.0,71.8 213.5,67.6 217.0,64.0 220.5,61.0 224.0,58.5 227.5,56.7 231.0,55.5 234.5,55.0 238.0,55.1 241.5,55.9 245.0,57.4 248.5,59.5 252.0,62.2 255.5,65.5 259.0,69.4 262.5,73.8 266.0,78.6 269.5,83.9 273.0,89.6 276.5,95.6 280.0,101.9 283.5,108.4 287.0,115.1 290.5,121.9 294.0,128.8 297.5,135.7 301.0,142.5 304.5,149.3 308.0,156.0 311.5,162.6 315.0,168.9 318.5,175.1 322.0,181.0 325.5,186.7 329.0,192.1 332.5,197.2 336.0,202.1 339.5,206.6 343.0,210.8 346.5,214.8 350.0,218.4 353.5,221.8 357.0,224.9 360.5,227.7 364.0,230.3 367.5,232.7 371.0,234.8 374.5,236.7 378.0,238.4 381.5,239.9 385.0,241.3 388.5,242.5 392.0,243.5 395.5,244.4 399.0,245.2 402.5,245.9 406.0,246.6 409.5,247.1 413.0,247.5 416.5,247.9 420.0,248.3 423.5,248.6 427.0,248.8 430.5,249.0 434.0,249.2 437.5,249.3 441.0,249.4 444.5,249.5 448.0,249.6 451.5,249.7 455.0,249.8 458.5,249.8 462.0,249.8 465.5,249.9 469.0,249.9 472.5,249.9 476.0,249.9" fill="none" style="stroke: var(--muted)" stroke-width="2"/>
  <polyline points="56.0,249.9 59.5,249.8 63.0,249.8 66.5,249.8 70.0,249.7 73.5,249.6 77.0,249.6 80.5,249.5 84.0,249.3 87.5,249.2 91.0,249.0 94.5,248.8 98.0,248.6 101.5,248.3 105.0,248.0 108.5,247.6 112.0,247.2 115.5,246.7 119.0,246.1 122.5,245.4 126.0,244.6 129.5,243.7 133.0,242.6 136.5,241.5 140.0,240.1 143.5,238.6 147.0,237.0 150.5,235.1 154.0,233.0 157.5,230.7 161.0,228.2 164.5,225.4 168.0,222.3 171.5,219.0 175.0,215.4 178.5,211.5 182.0,207.3 185.5,202.8 189.0,198.0 192.5,192.9 196.0,187.6 199.5,182.0 203.0,176.1 206.5,170.0 210.0,163.6 213.5,157.1 217.0,150.4 220.5,143.6 224.0,136.8 227.5,129.9 231.0,123.0 234.5,116.2 238.0,109.5 241.5,102.9 245.0,96.6 248.5,90.5 252.0,84.8 255.5,79.4 259.0,74.5 262.5,70.0 266.0,66.1 269.5,62.7 273.0,59.9 276.5,57.7 280.0,56.1 283.5,55.2 287.0,55.0 290.5,55.4 294.0,56.4 297.5,58.2 301.0,60.5 304.5,63.5 308.0,67.0 311.5,71.1 315.0,75.7 318.5,80.7 322.0,86.2 325.5,92.0 329.0,98.1 332.5,104.5 336.0,111.1 339.5,117.8 343.0,124.7 346.5,131.6 350.0,138.4 353.5,145.3 357.0,152.1 360.5,158.7 364.0,165.2 367.5,171.5 371.0,177.5 374.5,183.3 378.0,188.9 381.5,194.2 385.0,199.2 388.5,203.9 392.0,208.3 395.5,212.5 399.0,216.3 402.5,219.8 406.0,223.1 409.5,226.1 413.0,228.8 416.5,231.3 420.0,233.5 423.5,235.6 427.0,237.4 430.5,239.0 434.0,240.5 437.5,241.8 441.0,242.9 444.5,243.9 448.0,244.8 451.5,245.5 455.0,246.2 458.5,246.8 462.0,247.3 465.5,247.7 469.0,248.1 472.5,248.4 476.0,248.7" fill="none" style="stroke: var(--accent)" stroke-width="2"/>
  <text x="229.5" y="45.0" text-anchor="end" font-size="11" style="fill: var(--muted)">controls</text>
  <text x="294.6" y="45.0" text-anchor="start" font-size="11" style="fill: var(--accent)">cases</text>
  <text x="468.0" y="46.0" text-anchor="end" font-size="11" fill="currentColor">AUC = 0.73</text>
</svg>

*PRS distributions in controls and cases for K = 1% and R²_L = 0.10: the case curve is shifted right by about 0.84 SD, and the overlap gives AUC = 0.73.*

[^3]: Falconer (1965), Ann Hum Genet 29, 51–76, doi:10.1111/j.1469-1809.1965.tb00500.x.
[^4]: Lee, Wray, Goddard & Visscher (2011), Am J Hum Genet 88, 294–305, doi:10.1016/j.ajhg.2011.02.002; Lee, Goddard, Wray & Visscher (2012), Genet Epidemiol 36, 214–224, doi:10.1002/gepi.21614.
[^5]: Dudbridge (2013), PLoS Genet 9(3), e1003348, doi:10.1371/journal.pgen.1003348.

## Real-world accuracy

Accuracy varies enormously by trait and sample size. For height, the largest GWAS (5.4 million people) found 12,111 significant SNPs and estimated that common SNPs explain 40–50% of height variation (Yengo et al., 2022)[^6]. For schizophrenia, the 2022 PGC GWAS (76,755 cases, 243,649 controls, 287 loci) estimated SNP-based heritability of 0.24 in Europeans, with a PRS at p < 0.05 explaining a median 7.3% of liability variance and a top- vs bottom-centile odds ratio of 39 (Trubetskoy et al., 2022)[^7]. In UK Biobank, genome-wide scores reached AUC 0.79–0.81 for coronary artery disease and identified 8.0% of the population at more than threefold CAD risk (Khera et al., 2018)[^8]. Published scores and their metadata are cataloged in the [PGS Catalog](https://www.pgscatalog.org/).

[^6]: Yengo et al. (2022), Nature 610, 704–712, doi:10.1038/s41586-022-05275-y.
[^7]: Trubetskoy et al. (2022), Nature 604, 502–508, doi:10.1038/s41586-022-04434-5.
[^8]: Khera et al. (2018), Nat Genet 50, 1219–1224, doi:10.1038/s41588-018-0183-z.

## Beyond clumping and thresholding

C+T throws away LD information. Methods that model it instead usually predict better: LDpred (Vilhjálmsson et al., 2015)[^9], lassosum (Mak et al., 2017)[^10], PRS-CS (Ge et al., 2019)[^11], and SBayesR (Lloyd-Jones et al., 2019)[^12] all adjust the GWAS effect sizes for LD and shrink them, each with its own tuning. The practical lesson from Wray et al. (2013)[^13] still stands: report accuracy in a held-out sample, not in the discovery sample, or the numbers are inflated.

[^9]: Vilhjálmsson et al. (2015), Am J Hum Genet 97, 576–592, doi:10.1016/j.ajhg.2015.09.001.
[^10]: Mak et al. (2017), Genet Epidemiol 41, 469–480, doi:10.1002/gepi.22050.
[^11]: Ge et al. (2019), Nat Commun 10, 1776, doi:10.1038/s41467-019-09718-5.
[^12]: Lloyd-Jones et al. (2019), Nat Commun 10, 5086, doi:10.1038/s41467-019-12653-0.
[^13]: Wray, Yang, Hayes, et al. (2013), Nat Rev Genet 14, 507–515, doi:10.1038/nrg3457.

## The portability problem

Almost all large GWAS have been run in European-ancestry cohorts, and a PRS trained there is **several times less accurate** in other ancestries, because allele frequencies and LD patterns differ and the tagged variants differ (Martin et al., 2019)[^14]. Using today's scores clinically would therefore widen health disparities unless discovery cohorts diversify. Within an ancestry, scores can also miscalibrate across cohorts because of ascertainment (e.g. the UK Biobank's healthy-volunteer bias).

[^14]: Martin, Kanai, Kamatani, et al. (2019), Nat Genet 51, 584–591, doi:10.1038/s41588-019-0379-x.
[^15]: Wray, Yang, Goddard & Visscher (2010), PLoS Genet 6, e1000864, doi:10.1371/journal.pgen.1000864.

## The whole computation in Python

```python
import math

# Toy worked example: 5 SNPs, GWAS effect sizes in log-OR per risk allele.
beta = [0.30, 0.20, 0.15, 0.10, 0.05]
person = [2, 1, 0, 2, 1]          # dosages (0/1/2 risk alleles)
panel = [[0,1,2,0,1],[2,0,1,2,0],[1,1,0,1,2],[0,2,1,0,0],
         [2,2,0,1,1],[1,0,2,0,2],[0,1,1,2,0],[2,1,1,0,1]]  # reference panel

def prs(g): return sum(b * x for b, x in zip(beta, g))   # [n_snps]

scores = [prs(g) for g in panel]
mean = sum(scores) / len(scores)
sd = math.sqrt(sum((s - mean) ** 2 for s in scores) / (len(scores) - 1))
p = prs(person)
print(f"PRS = {p:.2f}; panel mean {mean:.4f}, SD {sd:.4f}; z = {(p - mean) / sd:.2f}")

# AUC from liability-scale R^2 and prevalence K (Dudbridge 2013)
K, R2L = 0.01, 0.10
T = 2.3263                              # Phi^-1(1 - K) for K = 1%
phi_T = math.exp(-T * T / 2) / math.sqrt(2 * math.pi)
x = math.sqrt(R2L) * phi_T / (K * (1 - K) * math.sqrt(2))
print(f"AUC = {0.5 * (1 + math.erf(x / math.sqrt(2))):.2f} at K = {K:.0%}, R2_L = {R2L:.2f}")
```

which prints:

```
PRS = 1.05; panel mean 0.7688, SD 0.2344; z = 1.20
AUC = 0.73 at K = 1%, R2_L = 0.10
```

## Limits

The score assumes effects are additive and ignores gene–environment interaction and rare variants of large effect; the β estimates carry sampling error, which caps accuracy regardless of method. Accuracy numbers are only valid when the target sample resembles the discovery sample in ancestry and ascertainment. An AUC of 0.7–0.8 stratifies populations but does not determine an individual's outcome; absolute risk also needs prevalence and calibration. Uses raise real ethical questions: preimplantation embryo selection on PRS, psychological impact of receiving a score, and discrimination (in the US, GINA 2008 bars health-insurance and employment use of genetic information, but not life insurance). A PRS is a summary of current genetic knowledge, not a verdict.
