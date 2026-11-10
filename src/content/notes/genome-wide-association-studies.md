---
title: Genome-wide association studies
summary: What a GWAS actually does — one SNP-by-SNP test across the genome, the 2×2 odds ratio and chi-square, the 5×10⁻⁸ multiple-testing bar and the Manhattan plot, stratification correction, imputation and meta-analysis, and where the hits go next, worked on a toy 200-vs-200 case-control study.
date: 2026-11-10
tags: [genetics]
distillate: A GWAS tests each common SNP for association with a trait in a large sample. The toy example (200 cases vs 200 controls, allele counts 220/180 vs 180/220) gives OR = 1.49, χ² = 8.0, p = 0.0047, far from the genome-wide bar of 5×10⁻⁸ (−log₁₀ p = 7.3), which needs χ² ≈ 29.7, about 1,500 people at this effect size. Real studies use hundreds of thousands of people (UK Biobank ≈ 500,000), impute to reference panels, correct for stratification, and their hits feed polygenic risk scores, covered in the PRS note.
model: [Mistral Large 4]
---

A **genome-wide association study** (GWAS) asks a simple question of every common genetic variant: in this population, does carrying this allele change the trait? The method took off in 2005–2007, when the first robust hits appeared (complement factor H in age-related macular degeneration, Klein et al., 2005)[^1] and the Wellcome Trust Case Control Consortium ran 14,000 cases of seven diseases against 3,000 shared controls on a 500k-SNP array (WTCCC, 2007)[^2], followed the same year by FTO for obesity (Frayling et al., 2007)[^3]. Every published association is now indexed in the [GWAS Catalog](https://www.ebi.ac.uk/gwas/) (MacArthur et al., 2017)[^4].

Throughout, the note uses one worked example: a toy case-control study of one SNP.

| | value |
| --- | --- |
| design | 200 cases, 200 controls |
| one SNP, allele counts | cases: A = 220, a = 180; controls: A = 180, a = 220 |
| significance bar | $p < 5 \times 10^{-8}$ (genome-wide) |

[^1]: Klein et al. (2005), Science 308, 1469–1473, doi:10.1126/science.1121671.
[^2]: WTCCC (2007), Nature 447, 661–678, doi:10.1038/nature05911.
[^3]: Frayling et al. (2007), Science 316, 889–894, doi:10.1126/science.1141927.
[^4]: MacArthur et al. (2017), Nucleic Acids Res 45, D896–D901, doi:10.1093/nar/gkw1133.

## The single-SNP test

For one SNP, the data collapse into a 2×2 table of allele counts, and the **allelic odds ratio** compares allele frequencies:

$$
\mathrm{OR} = \frac{220/180}{180/220} = \frac{220 \times 220}{180 \times 180} = 1.49
$$

Under the null hypothesis of no association, each cell's expected count is its row total times its column total divided by N; the **chi-square** statistic sums the squared deviations:

$$
\chi^2 = \sum \frac{(O - E)^2}{E} = 4 \times \frac{20^2}{200} = 8.0
$$

With 1 degree of freedom, $\chi^2 = 8.0$ gives $p = 0.0047$. A real association at this sample size would look exactly like this: suggestive, but nowhere near decisive.

## Multiple testing and the 5×10⁻⁸ bar

A GWAS tests around a million common SNPs (and more after imputation), so even with no true effects, ~0.05 × 10⁶ = 50,000 false positives appear at p < 0.05. The field's standard is a **Bonferroni-corrected** $p < 5 \times 10^{-8}$, i.e. $-\log_{10} p > 7.3$ on the Manhattan plot, where each SNP is a point at its genomic position:

<svg viewBox="0 0 500 300" role="img" aria-label="Toy Manhattan plot: 24 SNPs, y is minus log10 p-value; the dashed line is the genome-wide threshold 5 times 10 to the minus 8 at 7.3. The strongest toy hit, chi-square 8 with p 0.0047 at 2.3, sits far below the line." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Toy Manhattan plot</title>
  <rect x="56.0" y="30.0" width="420.0" height="220.0" fill="none" style="stroke: var(--rule)"/>
  <text x="56" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">1</text>
  <text x="266.0" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">12</text>
  <text x="459.2" y="268.0" text-anchor="middle" font-size="11" fill="currentColor">24</text>
  <text x="48.0" y="254.0" text-anchor="end" font-size="11" fill="currentColor">0</text>
  <text x="48.0" y="150.5" text-anchor="end" font-size="11" fill="currentColor">4</text>
  <text x="48.0" y="46.9" text-anchor="end" font-size="11" fill="currentColor">8</text>
  <text x="266.0" y="284.0" text-anchor="middle" font-size="12" fill="currentColor">SNP (toy order)</text>
  <text transform="translate(16 140.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">−log₁₀(p)</text>
  <line x1="56.0" y1="61.0" x2="476.0" y2="61.0" style="stroke: var(--ink)" stroke-dasharray="5 4"/>
  <text x="472.0" y="55.0" text-anchor="end" font-size="11" fill="currentColor">5×10⁻⁸</text>
  <circle cx="72.8" cy="242.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="89.6" cy="236.2" r="3.5" style="fill: var(--muted)"/>
  <circle cx="106.4" cy="245.2" r="3.5" style="fill: var(--muted)"/>
  <circle cx="123.2" cy="228.5" r="3.5" style="fill: var(--muted)"/>
  <circle cx="140.0" cy="239.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="156.8" cy="232.2" r="3.5" style="fill: var(--muted)"/>
  <circle cx="173.6" cy="246.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="190.4" cy="220.0" r="3.5" style="fill: var(--muted)"/>
  <circle cx="207.2" cy="238.0" r="3.5" style="fill: var(--muted)"/>
  <circle cx="224.0" cy="230.0" r="3.5" style="fill: var(--muted)"/>
  <circle cx="240.8" cy="244.0" r="3.5" style="fill: var(--muted)"/>
  <circle cx="257.6" cy="189.7" r="3.5" style="fill: var(--accent)"/>
  <circle cx="274.4" cy="233.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="291.2" cy="241.7" r="3.5" style="fill: var(--muted)"/>
  <circle cx="308.0" cy="224.9" r="3.5" style="fill: var(--muted)"/>
  <circle cx="324.8" cy="238.9" r="3.5" style="fill: var(--muted)"/>
  <circle cx="341.6" cy="235.4" r="3.5" style="fill: var(--muted)"/>
  <circle cx="358.4" cy="245.2" r="3.5" style="fill: var(--muted)"/>
  <circle cx="375.2" cy="215.9" r="3.5" style="fill: var(--muted)"/>
  <circle cx="392.0" cy="237.1" r="3.5" style="fill: var(--muted)"/>
  <circle cx="408.8" cy="240.7" r="3.5" style="fill: var(--muted)"/>
  <circle cx="425.6" cy="230.7" r="3.5" style="fill: var(--muted)"/>
  <circle cx="442.4" cy="242.8" r="3.5" style="fill: var(--muted)"/>
  <circle cx="459.2" cy="227.7" r="3.5" style="fill: var(--muted)"/>
</svg>

*Toy Manhattan plot for 24 SNPs. The dashed line is the genome-wide bar 5×10⁻⁸ (7.3 on the −log₁₀ p axis); the strongest toy hit (χ² = 8.0, p = 0.0047, accent point) sits at 2.3, far below it.*

For 1 df, $p = 5 \times 10^{-8}$ corresponds to $\chi^2 \approx 29.7$. Since $\chi^2$ grows roughly linearly with sample size at a fixed effect, the toy effect (OR 1.49, 400 people, χ² = 8.0 on 800 alleles) would need about $29.7/8.0 \approx 3.7$× the sample, roughly 1,500 people total, to clear the bar. That scaling is why GWAS sample sizes grew from thousands (WTCCC) to hundreds of thousands (UK Biobank, ≈ 500,000 participants, Bycroft et al., 2018)[^5].

[^5]: Bycroft et al. (2018), Nature 562, 203–209, doi:10.1038/s41586-018-0579-z.

## Confounding and population stratification

The main false-positive source is **population stratification**: if cases and controls differ in ancestry, any allele that differs between ancestries looks associated with the disease. Standard practice is to include the top principal components of the genotype matrix as covariates (EIGENSTRAT; Price et al., 2006)[^6], plus age, sex and genotyping batch, and to check genomic-control inflation λ (Devlin & Roeder, 1999)[^7]. LD score regression (Bulik-Sullivan et al., 2015)[^8] goes further: its intercept estimates confounding separately from polygenic signal, so a high intercept flags stratification rather than true polygenicity.

[^6]: Price et al. (2006), Nat Genet 38, 904–909, doi:10.1038/ng1847.
[^7]: Devlin & Roeder (1999), Biometrics 55, 997–1004.
[^8]: Bulik-Sullivan et al. (2015), Nat Genet 47, 291–295, doi:10.1038/ng.3211.

## Genotyping, imputation, meta-analysis

Arrays measure ~0.5–2 million SNPs directly (WTCCC used the Affymetrix 500K). Because SNPs are correlated (linkage disequilibrium, LD), the measured SNPs **impute** the rest against a reference panel (1000 Genomes, 2015)[^9]; the HRC (2016)[^10] and TOPMed panels now underlie most studies, giving dosage (0–2) for tens of millions of variants. Cohorts are then combined by inverse-variance-weighted meta-analysis of per-SNP effect sizes and standard errors.

[^9]: 1000 Genomes Project Consortium (2015), Nature 526, 68–74, doi:10.1038/nature15394.
[^10]: McCarthy et al. (2016), Nat Genet 48, 1279–1283, doi:10.1038/ng.3643.

## From hits to biology

An associated SNP is rarely the causal one: it may just be in LD with the causal variant, so a locus usually contains many correlated hits. **Fine-mapping** (FINEMAP, SuSiE) computes credible sets of likely-causal variants (Benner et al., 2016; Wang et al., 2020)[^11]. Follow-up then links loci to genes via eQTLs (GTEx Consortium, 2017)[^12] and colocalization. Effect sizes from discovery are also inflated by the **winner's curse**, so estimates shrink in replication (Wray et al., 2013)[^13]. The hits feed downstream tools: clumping and thresholding, and ultimately the polygenic risk scores of the [PRS note](note:polygenic-risk-scores).

[^11]: Benner et al. (2016), Bioinformatics 32, 1493–1501, doi:10.1093/bioinformatics/btw331; Wang, Sarkar, Carbonetto & Stephens (2020), JRSS B 82, 1273–1300, doi:10.1111/rssb.12388.
[^12]: GTEx Consortium (2017), Nature 550, 204–213, doi:10.1038/nature24277.
[^13]: Wray et al. (2013), Nat Rev Genet 14, 507–515, doi:10.1038/nrg3457.

## What GWAS showed about architecture

Beyond individual loci, GWAS quantified the polygenic architecture: SNP-based heritability (GREML/GCTA; Yang et al., 2011)[^14] showed common SNPs capture a large share of heritability for many traits, resolving part of the "missing heritability" debate (Manolio et al., 2009)[^15]. Height's common-SNP heritability is 40–50% (Yengo et al., 2022), schizophrenia's is about 0.24 (Trubetskoy et al., 2022), and thousands of loci exist per trait, most of tiny effect.

[^14]: Yang et al. (2011), Am J Hum Genet 88, 76–82, doi:10.1016/j.ajhg.2010.11.011.
[^15]: Manolio et al. (2009), Nature 461, 747–753, doi:10.1038/nature08494.

## The toy test in Python

```python
import math

# Toy case-control GWAS: one SNP, allele counts (A, a) in 200 cases and 200 controls.
a_c, b_c, a_n, b_n = 220, 180, 180, 220
N = a_c + b_c + a_n + b_n

OR = (a_c * b_n) / (b_c * a_n)                 # allelic odds ratio
E = [(a_c + b_c) * (a_c + a_n) / N, (a_c + b_c) * (b_c + b_n) / N,
     (a_n + b_n) * (a_c + a_n) / N, (a_n + b_n) * (b_c + b_n) / N]  # expected counts
chi2 = sum((o - e) ** 2 / e for o, e in zip([a_c, b_c, a_n, b_n], E))
p = math.erfc(math.sqrt(chi2 / 2))             # chi-square, 1 df, upper tail
print(f"OR = {OR:.2f}, chi2 = {chi2:.1f}, p = {p:.4f}, -log10(p) = {-math.log10(p):.2f}")

thr = 5e-8                                      # genome-wide significance
def erfcinv(y):                                 # invert erfc by bisection
    lo, hi = 0.0, 6.0
    for _ in range(80):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if math.erfc(mid) > y else (lo, mid)
    return (lo + hi) / 2
chi2_thr = 2 * erfcinv(thr) ** 2
print(f"genome-wide: p < {thr:g} needs chi2 ~ {chi2_thr:.1f}; at this effect size "
      f"that is ~{round((N // 2) * chi2_thr / chi2, -2):.0f} people total")  # N counts alleles
```

which prints:

```
OR = 1.49, chi2 = 8.0, p = 0.0047, -log10(p) = 2.33
genome-wide: p < 5e-08 needs chi2 ~ 29.7; at this effect size that is ~1500 people total
```

## Limits

GWAS covers common variants on arrays plus imputed common variation; rare variants (below ~0.5% frequency) need sequencing, and gene–environment interaction is mostly invisible at these sample sizes. Case-control ascertainment inflates observed effect sizes, so disease effects must be converted to the liability scale before comparison with heritability (see the [PRS note](note:polygenic-risk-scores)). Accuracy and hit counts are strongly ancestry-dependent: most GWAS samples are European-ancestry, which both limits discovery and, as the [PRS note](note:polygenic-risk-scores) explains, degrades portability. And a p-value is not an effect size: at 5×10⁻⁸ the typical effect is tiny, which is exactly why scores aggregate thousands of loci.
