---
title: Polygenic risk scores
summary: How a polygenic risk score turns a GWAS into a risk number for one person — the weighted allele sum and its standardization, clumping and thresholding, AUC under the liability-threshold model, absolute risk, how accuracy grows with GWAS size, and the ancestry portability problem, worked on a toy five-SNP example.
date: 2026-11-10
tags: [genes]
distillate: A polygenic risk score (PRS) is the sum of a person's risk-allele counts weighted by GWAS effect sizes, read against a reference panel of the same ancestry; on the toy five-SNP example, dosages (2, 1, 0, 2, 1) give PRS = 1.05 and z = 1.20. For a disease with 1% prevalence and a score that explains 10% of liability variance, the AUC is 0.73, and z = 1.20 raises this person's risk from 1% to 2.0%; even the top 5% of the score has a risk of only 4.0% and holds 20% of the cases. So a PRS stratifies a population rather than diagnosing a person, its accuracy is capped by GWAS sample size, and it is markedly less accurate outside the European-ancestry samples most GWAS are run in.
model: [Mistral Large 4, Claude Opus 5.5]
reviewed_by: [Claude Opus 5.5]
---

Most common diseases are polygenic: thousands of variants each shift risk a little, and no single one is decisive. A **polygenic risk score** (PRS) adds those small effects into one number per person. The landmark demonstration was the International Schizophrenia Consortium's 2009 study, which showed that a weighted sum of thousands of common variants, most far below genome-wide significance, separated schizophrenia cases from controls in independent samples (Purcell et al., 2009). The score is a relative measure: it ranks people within a population, and turning it into a risk for one person takes a disease model and the prevalence.

Throughout, the note uses one worked example: a toy score built from five SNPs, applied to one person, plus a disease model for the accuracy and risk calculations.

| | value |
| --- | --- |
| SNPs in the toy score | 5, with GWAS effect sizes β = 0.30, 0.20, 0.15, 0.10, 0.05 (log-OR per risk allele) |
| person | dosages (0/1/2 risk alleles) = (2, 1, 0, 2, 1) |
| reference panel | 8 people, for standardizing the score |
| disease model | prevalence $K$ = 1%; the score explains $R^2_L$ = 0.10 of liability variance |

Five SNPs could never explain 10% of liability; in the later sections the toy score stands in for a genome-wide score with that accuracy. The effect sizes are also large for common variants, whose per-allele odds ratios are mostly 1.05–1.2 (log-OR 0.05–0.18).

## The score itself

Each SNP contributes its effect size times the number of risk alleles carried (the **dosage** $g_i$, 0, 1 or 2; imputed genotypes give fractional expected dosages):

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

The raw number has no meaning on its own, because its zero is a person carrying no risk alleles at all. It is read against a reference panel: with the panel's mean 0.7688 and standard deviation 0.2344, the person's z-score is

$$
z = \frac{1.05 - 0.7688}{0.2344} = 1.20
$$

so this person sits 1.2 standard deviations above the panel average. Because the β are log-odds ratios, the gap of $1.05 - 0.7688 = 0.28$ also reads as odds about $e^{0.28} = 1.3$ times those of an average panel member, if the SNPs act multiplicatively on the odds. The panel has to match the person's ancestry: allele frequencies differ between populations, so the same genotype can sit at different percentiles in different panels. The sum also assumes additive effects and misses rare variants of large effect, which a GWAS of common SNPs doesn't see.

## Where the weights come from

The β values are per-allele effect sizes from a **genome-wide association study** (GWAS), one regression per SNP. A SNP is called genome-wide significant at $p < 5 \times 10^{-8}$, but a PRS uses far more than the significant hits, because most of the heritability sits in variants too weak to reach that bar. Using them needs two steps.

**Clumping** handles linkage disequilibrium (LD), the correlation between nearby SNPs. Neighbouring SNPs that tag the same causal variant would otherwise count its effect several times. Clumping takes the most significant SNP in a region as the index, drops every SNP within a window that is correlated with it above an $r^2$ cutoff, and repeats down the list. PRSice-2 defaults to $r^2 > 0.1$ within 250 kb, while PLINK 1.9's `--clump` defaults to $r^2 > 0.5$ within 250 kb. Clumping differs from LD pruning, which thins SNPs by correlation alone without looking at p-values.

**Thresholding** then keeps the clumped SNPs below a p-value cutoff. The best cutoff depends on the trait and on the GWAS size, so the clumping-and-thresholding (C+T) method tries a grid from $5 \times 10^{-8}$ up to 1 and picks the one that predicts best in a validation sample. Accuracy then has to be reported in a third sample that played no part in either the GWAS or the choice of cutoff. Overlap between the GWAS and the test sample inflates the apparent accuracy, sometimes severely (Wray et al., 2013).

## Measuring accuracy

For a binary disease, accuracy is usually stated on the **liability scale**. Falconer (1965) modeled disease as a threshold on an unobserved, normally distributed liability with variance 1: a person is affected when the liability exceeds $T = \Phi^{-1}(1 - K)$, where $K$ is the prevalence and $\Phi$ the standard normal cdf. The share of liability variance that a score explains, $R^2_L$, is comparable across studies with different case fractions, and it can't exceed the SNP heritability. Lee et al. (2012) give the conversion from the $R^2$ observed in a case-control sample to $R^2_L$.

The **AUC** is the probability that a random case scores higher than a random control. Under the liability model it follows from $K$ and $R^2_L$ alone. Write the score, in liability units, as a component $S$ of the liability with variance $R^2_L$. The mean liability of cases is $\varphi(T)/K$, where $\varphi$ is the standard normal pdf, and that of controls is $-\varphi(T)/(1-K)$. The score carries the fraction $R^2_L$ of each mean, so the gap between case and control means, in standard deviations of the score, is

$$
d = \frac{\sqrt{R^2_L}\;\varphi(T)}{K(1-K)}
$$

Treating both groups as normal with equal variance gives $\mathrm{AUC} = \Phi(d/\sqrt{2})$. For the worked example, $K = 0.01$ gives $T = 2.3263$ and $\varphi(T) = 0.02665$, so

$$
d = \frac{0.3162 \times 0.02665}{0.01 \times 0.99} = 0.851, \qquad \mathrm{AUC} = \Phi\!\left(\frac{0.851}{1.4142}\right) = \Phi(0.602) = 0.73
$$

The equal-variance step is an approximation, since selecting on liability narrows the spread of the score among cases. Wray et al. (2010) give the exact expression under the same model, which here gives 0.731, so the approximation costs nothing at this accuracy.

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

*Distributions of the score in controls and cases for K = 1% and a liability-scale R² of 0.10, each scaled to the same peak height (there are 99 controls for every case). The case curve is centered 0.84 SD above the population mean, and the overlap gives AUC = 0.73.*

## From a z-score to an absolute risk

The same model turns one person's z-score into an absolute risk. Given the score, the person's liability has mean $\sqrt{R^2_L}\,z$ and the remaining variance $1 - R^2_L$, so

$$
\text{risk} = \Phi\!\left(\frac{\sqrt{R^2_L}\,z - T}{\sqrt{1 - R^2_L}}\right) = \Phi\!\left(\frac{0.3162 \times 1.20 - 2.3263}{0.9487}\right) = \Phi(-2.05) = 0.020
$$

If the person's $z = 1.20$ came from a score with $R^2_L = 0.10$, their risk would be 2.0%, twice the population's 1%, and they would still be 98% likely to stay unaffected. Integrating the same expression over the top of the score distribution shows what a score with AUC 0.73 can do for a population: the top 1% of scores carries a risk of 6.0% and the top 5% a risk of 4.0%, and that top 5% holds only 20% of all future cases. A score like this **stratifies a population**, for instance to decide who is screened earlier, but it can't tell any one person whether they will get the disease. In a real cohort the absolute risk also needs the score to be calibrated against observed incidence there, since case mix, age and ascertainment shift the baseline.

## How accuracy grows with GWAS size

The β estimates carry sampling error, and with many small effects that error dominates. Daetwyler, Villanueva and Woolliams (2008) derived the expected accuracy of a score built from $N$ people for a trait with heritability $h^2$ spread over $M$ independent effects:

$$
R^2 \approx h^2 \cdot \frac{N h^2}{N h^2 + M}
$$

The score reaches half the heritability when $N = M / h^2$, and the remaining half comes slowly. For a trait with $h^2 = 0.24$ spread over $M = 50{,}000$ independent effects (illustrative values, not estimates for a real trait), half the heritability needs about 208,000 people, and reaching 90% of it needs nine times as many. This is why scores keep improving as GWAS grow from tens of thousands to millions of people, and why a trait with a smaller heritability, or effects spread over more loci, needs a larger GWAS for the same accuracy. For a case-control GWAS, $N$ is an effective sample size that is smaller than the head count when cases are few.

## Real-world accuracy

Accuracy varies widely across traits. For height, the largest GWAS (5.4 million people) found 12,111 independent significant SNPs, which together account for nearly all of the common-SNP heritability, and they explain 40% of height variance in European-ancestry samples but only about 10–20% in other ancestries (Yengo et al., 2022). For schizophrenia, the 2022 Psychiatric Genomics Consortium GWAS (76,755 cases, 243,649 controls, 287 loci) estimated SNP-based heritability of 0.24, with a PRS explaining a median 7.3% of liability variance and an odds ratio of 39 between the top and bottom centiles of the score (Trubetskoy et al., 2022). For coronary artery disease, a genome-wide score in UK Biobank identified 8.0% of the population at more than threefold risk, a risk comparable to that of carrying a monogenic mutation (Khera et al., 2018). Published scores, with their weights and the samples they were validated in, are collected in the [PGS Catalog](https://www.pgscatalog.org/).

An odds ratio between extreme centiles compares the two thin tails of the score and makes a score sound stronger than its AUC suggests. For a person, the absolute risk in their own part of the distribution is what counts, and for a disease near 1% prevalence it stays low even in the top centile, as the worked example's 6.0% for the top 1% shows.

## Beyond clumping and thresholding

C+T discards LD information: it keeps one SNP per region and drops the rest. Methods that model LD instead usually predict better. LDpred (Vilhjálmsson et al., 2015) and PRS-CS (Ge et al., 2019) are the most used. Both take the GWAS summary statistics and an LD reference panel and shrink each β toward zero according to a prior on effect sizes, so that a block of correlated SNPs shares its signal instead of losing all but one. The same two rules apply to them as to C+T: tune and test in separate samples, and expect accuracy to be capped by the GWAS sample size, as in the previous section.

## The portability problem

Most large GWAS have been run in European-ancestry samples, and scores built from them are **several times less accurate** in other ancestries, with the largest drop in African-ancestry samples (Martin et al., 2019). Three things cause it. Allele frequencies differ, so a SNP that varies in one population may barely vary in another. LD patterns differ, so a SNP that tags a causal variant well in Europeans may tag it poorly elsewhere; African-ancestry genomes have shorter LD blocks. And some causal variants are specific to one population. The height numbers above show the size of the effect: 40% of variance explained in European-ancestry samples against 10–20% elsewhere. Martin et al. argue that using today's scores in the clinic would widen health disparities unless discovery samples diversify.

Even within one ancestry, a score can lose accuracy between cohorts that differ in age, recruitment or environment, and UK Biobank volunteers are healthier on average than the UK population. Clinical and personal uses also raise questions beyond accuracy, such as the selection of embryos on a PRS and discrimination by insurers. In the US, the Genetic Information Nondiscrimination Act (2008) bars the use of genetic information in health insurance and employment, but not in life, disability or long-term-care insurance.

## The whole computation in R

```r
# Toy example: 5 SNPs, effect sizes in log-OR per risk allele
beta   <- c(0.30, 0.20, 0.15, 0.10, 0.05)
person <- c(2, 1, 0, 2, 1)             # dosages, 0/1/2 risk alleles
panel  <- rbind(c(0,1,2,0,1), c(2,0,1,2,0), c(1,1,0,1,2),
                c(0,2,1,0,0), c(2,2,0,1,1), c(1,0,2,0,2),
                c(0,1,1,2,0), c(2,1,1,0,1))  # [8 people, 5 SNPs]

prs    <- function(g) drop(g %*% beta) # weighted sum per row
scores <- prs(panel)                   # [8]
z      <- (prs(person) - mean(scores)) / sd(scores)  # sd: n - 1
cat(sprintf("PRS = %.2f; panel mean %.4f, SD %.4f; z = %.2f\n",
            prs(person), mean(scores), sd(scores), z))

# Liability model: prevalence K, score explains R2L of liability
K <- 0.01; R2L <- 0.10
T <- qnorm(1 - K)                          # liability threshold
d <- sqrt(R2L) * dnorm(T) / (K * (1 - K))  # gap in score SDs
cat(sprintf("T = %.4f, phi(T) = %.5f, d = %.3f, AUC = %.2f\n",
            T, dnorm(T), d, pnorm(d / sqrt(2))))

# Absolute risk for this person, and in the top 5% of scores
risk <- function(z) pnorm((sqrt(R2L) * z - T) / sqrt(1 - R2L))
top5 <- integrate(function(s) dnorm(s) * risk(s),
                  qnorm(0.95), Inf)$value    # P(top 5% and affected)
cat(sprintf("risk = %.1f%%; top 5%%: risk %.1f%%, cases %.0f%%\n",
            100 * risk(z), 100 * top5 / 0.05, 100 * top5 / K))
```

which prints:

```
PRS = 1.05; panel mean 0.7688, SD 0.2344; z = 1.20
T = 2.3263, phi(T) = 0.02665, d = 0.851, AUC = 0.73
risk = 2.0%; top 5%: risk 4.0%, cases 20%
```

## Sources

- S. M. Purcell, N. R. Wray, J. L. Stone, et al. (International Schizophrenia Consortium), "Common polygenic variation contributes to risk of schizophrenia and bipolar disorder", *Nature* 460, 748–752 (2009). [doi:10.1038/nature08185](https://doi.org/10.1038/nature08185)
- S. W. Choi, P. F. O'Reilly, "PRSice-2: Polygenic Risk Score software for biobank-scale data", *GigaScience* 8, giz082 (2019). [doi:10.1093/gigascience/giz082](https://doi.org/10.1093/gigascience/giz082); clumping defaults from the [PRSice-2 command reference](https://choishingwan.github.io/PRSice/command_detail/) and the [PLINK 1.9 clumping documentation](https://www.cog-genomics.org/plink/1.9/postproc#clump)
- N. R. Wray, J. Yang, B. J. Hayes, et al., "Pitfalls of predicting complex traits from SNPs", *Nat. Rev. Genet.* 14, 507–515 (2013). [doi:10.1038/nrg3457](https://doi.org/10.1038/nrg3457)
- D. S. Falconer, "The inheritance of liability to certain diseases, estimated from the incidence among relatives", *Ann. Hum. Genet.* 29, 51–76 (1965). [doi:10.1111/j.1469-1809.1965.tb00500.x](https://doi.org/10.1111/j.1469-1809.1965.tb00500.x)
- S. H. Lee, M. E. Goddard, N. R. Wray, P. M. Visscher, "A better coefficient of determination for genetic profile analysis", *Genet. Epidemiol.* 36, 214–224 (2012). [doi:10.1002/gepi.21614](https://doi.org/10.1002/gepi.21614)
- N. R. Wray, J. Yang, M. E. Goddard, P. M. Visscher, "The genetic interpretation of area under the ROC curve in genomic profiling", *PLoS Genet.* 6, e1000864 (2010). [doi:10.1371/journal.pgen.1000864](https://doi.org/10.1371/journal.pgen.1000864)
- H. D. Daetwyler, B. Villanueva, J. A. Woolliams, "Accuracy of predicting the genetic risk of disease using a genome-wide approach", *PLoS ONE* 3, e3395 (2008). [doi:10.1371/journal.pone.0003395](https://doi.org/10.1371/journal.pone.0003395)
- L. Yengo, S. Vedantam, E. Marouli, et al., "A saturated map of common genetic variants associated with human height", *Nature* 610, 704–712 (2022). [doi:10.1038/s41586-022-05275-y](https://doi.org/10.1038/s41586-022-05275-y)
- V. Trubetskoy, A. F. Pardiñas, T. Qi, et al., "Mapping genomic loci implicates genes and synaptic biology in schizophrenia", *Nature* 604, 502–508 (2022). [doi:10.1038/s41586-022-04434-5](https://doi.org/10.1038/s41586-022-04434-5)
- A. V. Khera, M. Chaffin, K. G. Aragam, et al., "Genome-wide polygenic scores for common diseases identify individuals with risk equivalent to monogenic mutations", *Nat. Genet.* 50, 1219–1224 (2018). [doi:10.1038/s41588-018-0183-z](https://doi.org/10.1038/s41588-018-0183-z)
- B. J. Vilhjálmsson, J. Yang, H. K. Finucane, et al., "Modeling linkage disequilibrium increases accuracy of polygenic risk scores", *Am. J. Hum. Genet.* 97, 576–592 (2015). [doi:10.1016/j.ajhg.2015.09.001](https://doi.org/10.1016/j.ajhg.2015.09.001)
- T. Ge, C.-Y. Chen, Y. Ni, Y.-C. A. Feng, J. W. Smoller, "Polygenic prediction via Bayesian regression and continuous shrinkage priors", *Nat. Commun.* 10, 1776 (2019). [doi:10.1038/s41467-019-09718-5](https://doi.org/10.1038/s41467-019-09718-5)
- A. R. Martin, M. Kanai, Y. Kamatani, et al., "Clinical use of current polygenic risk scores may exacerbate health disparities", *Nat. Genet.* 51, 584–591 (2019). [doi:10.1038/s41588-019-0379-x](https://doi.org/10.1038/s41588-019-0379-x)
