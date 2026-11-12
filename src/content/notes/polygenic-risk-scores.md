---
title: Polygenic risk scores
summary: How a polygenic risk score turns a GWAS into a risk number for one person, and how good that number can be. The note derives the score's accuracy from GWAS size and checks it on a simulation in base R, then shows why the score looks better in its own GWAS sample, when thresholding helps and when it hurts, and how the accuracy turns into AUC and absolute risk under the liability model. Portability to other ancestries falls out of the same derivation as the square of a tagging ratio.
date: 2026-11-10
updated: 2026-11-13
tags: [genes]
distillate: A polygenic risk score (PRS) is a person's risk-allele counts weighted by GWAS effect sizes. Every weight carries estimation noise of variance 1/N, and adding M such weights gives an accuracy of R² = h²·Nh²/(Nh² + M), half the heritability at N = M/h². In a simulation with h² = 0.5 and 2,000 causal SNPs the formula predicts 0.10 to 0.40 for GWAS of 1,000 to 16,000 people, and the scores reach 0.10 to 0.42. Scored in the GWAS sample itself, the same scores appear to explain up to 0.73, above the heritability. Under the liability model, R²_L = 0.10 at 1% prevalence gives AUC 0.73, and a person at z = 1.20 has a risk of 2.0%. When the tag SNPs correlate less with the causal ones in another population, accuracy falls by the square of the ratio of those correlations, 0.40 in the simulation as predicted.
model: [Mistral Large 4, Claude Opus 5.5]
reviewed_by: [Claude Opus 5.5]
---

Most common diseases are polygenic: thousands of variants each shift risk a little, and no single one is decisive. A **polygenic risk score** (PRS) adds those small effects into one number per person. The landmark demonstration was the International Schizophrenia Consortium's 2009 study. A weighted sum of thousands of common variants, most far below genome-wide significance, separated schizophrenia cases from controls in independent samples (Purcell et al., 2009).

The score is easy to compute. The hard questions are how accurate it can be, why it so often looks more accurate than it is, and what its accuracy means for one person. The note answers them with one derivation, the accuracy of a score built from a GWAS of $N$ people, and checks every consequence against a simulation. A five-SNP toy score shows the arithmetic, and a liability model turns accuracy into risk.

| | value |
| --- | --- |
| SNPs in the toy score | 5, with GWAS effect sizes β = 0.30, 0.20, 0.15, 0.10, 0.05 (log-OR per risk allele) |
| person | dosages (0/1/2 risk alleles) = (2, 1, 0, 2, 1) |
| reference panel | 8 people, for standardizing the score |
| disease model | prevalence $K$ = 1%; the score explains $R^2_L$ = 0.10 of liability variance |

| simulation | value |
| --- | --- |
| trait | liability with SNP heritability $h^2 = 0.5$ |
| SNPs | $M$ = 2,000 independent causal SNPs, small normal effects; a sparse version with 100 |
| GWAS sample | 1,000 to 16,000 people |
| target samples | 5,000 new people of the same ancestry; 5,000 whose tag SNPs track the causal ones less well |

## The score itself

Each SNP contributes its effect size times the number of risk alleles carried, the **dosage** $g_i$ (0, 1 or 2; imputed genotypes give fractional expected dosages):

$$
\mathrm{PRS} = \sum_i \beta_i\, g_i
$$

For the toy person, the contributions are $0.30 \times 2$, $0.20 \times 1$, $0.15 \times 0$, $0.10 \times 2$ and $0.05 \times 1$, so

$$
\mathrm{PRS} = 0.60 + 0.20 + 0 + 0.20 + 0.05 = 1.05
$$

The raw number means nothing on its own, because its zero is a person carrying no risk alleles at all. It is read against a reference panel. With the panel's mean 0.7688 and standard deviation 0.2344, the person's z-score is

$$
z = \frac{1.05 - 0.7688}{0.2344} = 1.20
$$

This person sits 1.2 standard deviations above the panel average. The panel has to match the person's ancestry. Allele frequencies differ between populations, so the same genotype can sit at different percentiles in different panels. Five SNPs could never explain 10% of liability; in the later sections the toy score stands in for a genome-wide score with that accuracy.

## How accuracy grows with GWAS size

Every weight in the score is an estimate, and with thousands of small effects the estimation noise dominates. The size of that effect can be derived. Measure each genotype $x_j$ in standard deviations, so it has mean 0 and variance 1. Measure the trait $y$ so that its variance is 1, of which the SNPs explain $h^2$, spread over $M$ independent SNPs with true effects $b_j$. A GWAS of $N$ people estimates each effect by regression:

$$
\hat b_j = \frac{1}{N}\sum_{i=1}^{N} x_{ij}\, y_i = b_j + e_j
$$

Each SNP explains only a sliver of $y$, so the error $e_j$ has variance close to $1/N$ and is independent of $b_j$. Now score a new person with $S = \sum_j \hat b_j x_j$. Their genetic value is $G = \sum_j b_j x_j$, and their noise is independent of the GWAS. Because the SNPs are independent, covariances and variances add SNP by SNP:

$$
\mathrm{Cov}(S, y) = \sum_j b_j \hat b_j \approx h^2
$$

$$
\mathrm{Var}(S) = \sum_j \hat b_j^2 \approx h^2 + \frac{M}{N}
$$

The noise adds $1/N$ to the variance for every SNP in the score but nothing to the covariance, since it is unrelated to the new person's trait. The squared correlation is then

$$
R^2 = \frac{\mathrm{Cov}(S, y)^2}{\mathrm{Var}(S)} = h^2 \cdot \frac{N h^2}{N h^2 + M}
$$

This is the result of Daetwyler, Villanueva and Woolliams (2008). The first factor is the ceiling: no score can explain more than the SNP heritability. The second is the share of that ceiling a GWAS of $N$ people reaches. It is one half at $N = M / h^2$, and the rest comes slowly: reaching 90% takes nine times as many people.

The simulation checks this. It draws 2,000 causal SNPs with $h^2 = 0.5$, runs a GWAS on the first $N$ of 16,000 people, and scores 5,000 new people:

| GWAS size $N$ | $R^2$, formula | $R^2$, new people | $R^2$, the GWAS sample itself |
| --- | --- | --- | --- |
| 1,000 | 0.10 | 0.10 | 0.73 |
| 2,000 | 0.17 | 0.17 | 0.64 |
| 4,000 | 0.25 | 0.26 | 0.57 |
| 8,000 | 0.33 | 0.35 | 0.54 |
| 16,000 | 0.40 | 0.42 | 0.52 |

<svg viewBox="0 0 560 300" role="img" aria-label="Share of trait variance explained by a polygenic score against GWAS sample size, from 1,000 to 16,000 people, on a log scale. In new people the score explains 0.10 at 1,000 and rises to 0.42 at 16,000, following the formula curve, below the heritability ceiling of 0.5. Scored in the GWAS sample itself, it appears to explain 0.73 at 1,000, falling to 0.52 at 16,000, above the ceiling." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>Polygenic score accuracy against GWAS size</title>
  <rect x="50" y="14" width="490" height="236" fill="none" style="stroke: var(--rule)"/>
  <text x="44" y="254.0" text-anchor="end" font-size="11" fill="currentColor">0.0</text>
  <text x="44" y="195.0" text-anchor="end" font-size="11" fill="currentColor">0.2</text>
  <text x="44" y="136.0" text-anchor="end" font-size="11" fill="currentColor">0.4</text>
  <text x="44" y="77.0" text-anchor="end" font-size="11" fill="currentColor">0.6</text>
  <text x="44" y="18.0" text-anchor="end" font-size="11" fill="currentColor">0.8</text>
  <text x="100.0" y="266" text-anchor="middle" font-size="11" fill="currentColor">1,000</text>
  <text x="197.3" y="266" text-anchor="middle" font-size="11" fill="currentColor">2,000</text>
  <text x="294.6" y="266" text-anchor="middle" font-size="11" fill="currentColor">4,000</text>
  <text x="391.8" y="266" text-anchor="middle" font-size="11" fill="currentColor">8,000</text>
  <text x="489.1" y="266" text-anchor="middle" font-size="11" fill="currentColor">16,000</text>
  <text x="295.0" y="290" text-anchor="middle" font-size="12" fill="currentColor">GWAS sample size N (log scale)</text>
  <text transform="translate(14 132.0) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">R² of the score</text>
  <line x1="50" y1="102.5" x2="540" y2="102.5" style="stroke: var(--muted)" stroke-dasharray="5 4"/>
  <text x="534" y="117.5" text-anchor="end" font-size="11" fill="currentColor">h² = 0.5, the ceiling</text>
  <path d="M50.0 228.0 L54.1 227.5 L58.2 226.9 L62.4 226.3 L66.5 225.7 L70.6 225.1 L74.7 224.5 L78.8 223.9 L82.9 223.3 L87.1 222.6 L91.2 222.0 L95.3 221.3 L99.4 220.6 L103.5 219.9 L107.6 219.2 L111.8 218.5 L115.9 217.7 L120.0 217.0 L124.1 216.2 L128.2 215.5 L132.4 214.7 L136.5 213.9 L140.6 213.1 L144.7 212.3 L148.8 211.4 L152.9 210.6 L157.1 209.7 L161.2 208.9 L165.3 208.0 L169.4 207.1 L173.5 206.2 L177.6 205.3 L181.8 204.4 L185.9 203.5 L190.0 202.5 L194.1 201.6 L198.2 200.6 L202.4 199.6 L206.5 198.7 L210.6 197.7 L214.7 196.7 L218.8 195.7 L222.9 194.7 L227.1 193.7 L231.2 192.6 L235.3 191.6 L239.4 190.6 L243.5 189.5 L247.6 188.5 L251.8 187.4 L255.9 186.4 L260.0 185.3 L264.1 184.2 L268.2 183.1 L272.4 182.1 L276.5 181.0 L280.6 179.9 L284.7 178.8 L288.8 177.8 L292.9 176.7 L297.1 175.6 L301.2 174.5 L305.3 173.4 L309.4 172.4 L313.5 171.3 L317.6 170.2 L321.8 169.1 L325.9 168.1 L330.0 167.0 L334.1 165.9 L338.2 164.9 L342.4 163.8 L346.5 162.8 L350.6 161.7 L354.7 160.7 L358.8 159.7 L362.9 158.6 L367.1 157.6 L371.2 156.6 L375.3 155.6 L379.4 154.6 L383.5 153.6 L387.6 152.6 L391.8 151.7 L395.9 150.7 L400.0 149.8 L404.1 148.8 L408.2 147.9 L412.4 147.0 L416.5 146.1 L420.6 145.2 L424.7 144.3 L428.8 143.4 L432.9 142.6 L437.1 141.7 L441.2 140.9 L445.3 140.1 L449.4 139.2 L453.5 138.4 L457.6 137.6 L461.8 136.9 L465.9 136.1 L470.0 135.3 L474.1 134.6 L478.2 133.9 L482.4 133.1 L486.5 132.4 L490.6 131.7 L494.7 131.1 L498.8 130.4 L502.9 129.7 L507.1 129.1 L511.2 128.5 L515.3 127.8 L519.4 127.2 L523.5 126.6 L527.6 126.0 L531.8 125.5 L535.9 124.9 L540.0 124.4" style="stroke: var(--accent)" stroke-width="2" fill="none"/>
  <path d="M100.0 220.5h0M197.3 199.8h0M294.6 173.3h0M391.8 146.8h0M489.1 126.1h0" style="stroke: var(--accent)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M100.0 34.7h0M197.3 61.2h0M294.6 81.9h0M391.8 90.7h0M489.1 96.6h0" style="stroke: var(--ink)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <text x="234.1" y="211.7" font-size="12" fill="currentColor"><tspan style="fill: var(--ink)">●</tspan> scored in the GWAS sample itself</text>
  <text x="234.1" y="229.7" font-size="12" fill="currentColor"><tspan style="fill: var(--accent)">●</tspan> scored in new people; line: formula</text>
</svg>

*Accuracy of the simulated score against GWAS size. In new people (accent) it follows the formula and stays below the heritability. Scored in the GWAS sample (ink), it is highest where the GWAS is smallest, and above the ceiling.*

The last column is the trap. In the GWAS sample, the errors $e_j$ were estimated from those very people's noise, so the score has partly learned that noise, and the covariance gains the term the derivation ruled out for new people. The smaller the GWAS, the larger the error and the more the score fits it: at $N = 1{,}000$ it appears to explain 73% of a trait whose genetic ceiling is 50%. The same leak, smaller, comes from any overlap between the GWAS and the test sample, or from choosing settings on the test sample. That is why a score is tuned in one sample and reported in a third that played no part in the GWAS (Wray et al., 2013).

The formula also places real scores. For schizophrenia, the 2022 Psychiatric Genomics Consortium GWAS (76,755 cases and 243,649 controls) estimated a SNP heritability of 0.24 on the liability scale, and its score explained a median 7.3% of liability (Trubetskoy et al., 2022). That is 30% of the ceiling, short of the halfway point, so by the formula the GWAS is still on the steep part of the curve, where more cases buy accuracy fastest. Height is at the other end. A GWAS of 5.4 million people found 12,111 independent signals, which explain 40% of height variance in European-ancestry samples, nearly all of the common-SNP heritability (Yengo et al., 2022). For a case-control GWAS, $N$ in the formula is an effective sample size, smaller than the head count when cases are few.

## When thresholding helps

Practical scores rarely use every SNP. **Clumping** comes first: neighbouring SNPs in linkage disequilibrium (LD) tag the same causal variant, so a score that kept them all would count its effect several times. Clumping keeps the most significant SNP in a region and drops every SNP within a window that correlates with it above an $r^2$ cutoff. PRSice-2 defaults to $r^2 > 0.1$ within 250 kb, and PLINK 1.9's `--clump` defaults to $r^2 > 0.5$ within 250 kb. **Thresholding** then keeps the clumped SNPs below a p-value cutoff. Together they are the C+T method (Choi and O'Reilly, 2019). The simulated SNPs are independent, so only the thresholding step applies here.

The derivation says when a threshold should help. Each SNP in the score adds $b_j^2$ to the signal and $1/N$ to the noise. When effects are spread over all 2,000 SNPs, each one adds about as much signal as noise, and dropping any of them loses more than it saves. When only 100 SNPs matter, the other 1,900 add only noise, and a threshold that drops most of them helps. The formula can't say where the best cutoff lies, because it depends on how the effects are distributed. The simulation shows how much that matters, for a GWAS of 4,000 people:

| p-value cutoff | $R^2$, 2,000 causal SNPs | $R^2$, 100 causal SNPs |
| --- | --- | --- |
| 5×10⁻⁸ | 0.000 | 0.276 |
| 10⁻⁴ | 0.008 | 0.346 |
| 0.01 | 0.104 | 0.356 |
| 0.1 | 0.193 | 0.274 |
| 1 (all SNPs) | 0.259 | 0.197 |

The genome-wide significance bar is the worst choice for the polygenic trait, where no single SNP clears it, and a good one for the sparse trait. Using all SNPs is the best choice for the first and nearly the worst for the second. (The realized heritabilities differ a little, 0.54 and 0.39, because the effects are random draws.) That is why C+T tries a grid of cutoffs in a validation sample, and why the cutoff found for one trait doesn't carry over to another.

The derivation shows one more thing: multiplying every weight by the same constant leaves $R^2$ unchanged, because a correlation ignores scale. Shrinking all effects toward zero by one factor does nothing. What helps is shrinking each SNP by a different amount, according to how likely it is to matter, which is what thresholding does crudely, with weights of 0 or 1. LDpred (Vilhjálmsson et al., 2015) and PRS-CS (Ge et al., 2019) do it smoothly. Each takes the GWAS summary statistics and an LD reference panel and shrinks each $\hat b_j$ according to a prior on effect sizes, so a block of correlated SNPs shares its signal instead of losing all but one. They still obey the formula's ceiling: no reweighting removes the $1/N$ noise in the estimates.

## From accuracy to AUC

For a disease, accuracy is usually stated on the **liability scale**. Falconer (1965) modeled disease as a threshold on an unobserved, normally distributed liability with variance 1: a person is affected when the liability exceeds $T = \Phi^{-1}(1 - K)$. Here $K$ is the prevalence and $\Phi$ the standard normal distribution function. The share of liability variance a score explains, $R^2_L$, is the $R^2$ of the derivation above. It doesn't depend on the case fraction of a study, which makes it comparable across studies. Lee et al. (2012) give the conversion from the $R^2$ observed in a case-control sample.

The **AUC** is the probability that a random case scores higher than a random control. Under the liability model it follows from $K$ and $R^2_L$ alone. Write the score, in liability units, as a component $S$ of the liability with variance $R^2_L$. The mean liability of cases is $\varphi(T)/K$, where $\varphi$ is the standard normal density, and that of controls is $-\varphi(T)/(1-K)$. The score carries the fraction $R^2_L$ of each mean, so the gap between the case and control means, in standard deviations of the score, is

$$
d = \frac{\sqrt{R^2_L}\;\varphi(T)}{K(1-K)}
$$

Treating both groups as normal with equal variance gives $\mathrm{AUC} = \Phi(d/\sqrt{2})$. For the worked example, $K = 0.01$ gives $T = 2.3263$ and $\varphi(T) = 0.02665$, so

$$
d = \frac{0.3162 \times 0.02665}{0.01 \times 0.99} = 0.851
$$

$$
\mathrm{AUC} = \Phi\!\left(\frac{0.851}{1.4142}\right) = \Phi(0.602) = 0.73
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
\text{risk} = \Phi\!\left(\frac{\sqrt{R^2_L}\,z - T}{\sqrt{1 - R^2_L}}\right)
$$

$$
\text{risk} = \Phi\!\left(\frac{0.3162 \times 1.20 - 2.3263}{0.9487}\right)
$$

which is $\Phi(-2.05) = 0.020$.

If the person's $z = 1.20$ came from a score with $R^2_L = 0.10$, their risk would be 2.0%, twice the population's 1%, and they would still be 98% likely to stay unaffected. Integrating the same expression over the top of the score distribution shows what a score with AUC 0.73 can do for a population. The top 5% of scores carries a risk of 4.0% and holds 20% of all future cases. A score like this **stratifies a population**, for instance to decide who is screened earlier. It can't tell any one person whether they will get the disease. In a real cohort, the absolute risk also needs the score to be calibrated against the incidence observed there, since case mix, age and ascertainment shift the baseline.

Published scores are often summarized by the odds ratio between the top and bottom centiles, and that number flatters them. Under the liability model with $K = 1\%$ and the schizophrenia score's $R^2_L = 0.073$, the AUC is only 0.70. Yet the top centile has a risk of 4.8% against 0.08% in the bottom one, an odds ratio of 63. The ratio compares two thin tails, both far from the people in the middle, and the bottom tail's risk is tiny, so even a weak score gives a large ratio. (The schizophrenia study itself reported an odds ratio of 39, measured in case-control samples, which this calculation doesn't reproduce.) For one person, what counts is the absolute risk in their own part of the distribution, and for a disease near 1% prevalence it stays low even in the top centile.

## Portability to other ancestries

Most large GWAS have been run in European-ancestry samples, and scores built from them are several times less accurate in other ancestries, with the largest drop in African-ancestry samples (Martin et al., 2019). The derivation above shows one reason and how large its effect is.

A GWAS rarely measures the causal SNP itself. It measures a **tag** SNP that correlates with it, with correlation $\rho_D$ in the discovery population. The tag's estimated effect is then $b_j \rho_D$. In a target population where the same tag correlates $\rho_T$ with the causal SNP, the score's covariance with the trait is $\sum_j b_j^2 \rho_D \rho_T$, while its variance is the same as in the discovery population when allele frequencies match. Carried through the same algebra, the accuracy in the target is the discovery accuracy times

$$
\frac{R^2_T}{R^2_D} = \left(\frac{\rho_T}{\rho_D}\right)^2
$$

The ratio enters squared, so a moderate loss of tagging costs a large share of the accuracy. In the simulation, each tag copies its causal SNP with probability 0.95 in the discovery population and 0.6 in the second target, which makes $\rho_D = 0.95$ and $\rho_T = 0.6$. The score built from tags explains 0.371 in the same ancestry and 0.149 in the other. The ratio is 0.40, as predicted by $(0.6/0.95)^2$.

Real populations add two more losses that the simulation leaves out. Allele frequencies differ, so a SNP that varies in one population may barely vary in another, which shrinks its contribution. And some causal variants exist in only one population, so the score has no weight for them at all. LD blocks are shorter in African-ancestry genomes, which lowers $\rho_T$ for tags chosen in European samples. Height shows the combined size: 40% of variance explained in European-ancestry samples, against 10–20% in other ancestries (Yengo et al., 2022). If tagging alone were the cause, that would mean $\rho_T/\rho_D$ of about 0.5 to 0.7. Martin et al. argue that clinical use of today's scores would widen health disparities unless discovery samples diversify. Even within one ancestry, a score can lose accuracy between cohorts that differ in age, recruitment or environment.

## The calculations in R

The toy score, the liability model and the centile comparison:

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

# Top and bottom centiles at R2L = 0.073 (schizophrenia, 2022)
R2L <- 0.073; d <- sqrt(R2L) * dnorm(T) / (K * (1 - K))
c1 <- function(lo, hi)               # risk within a score band
  integrate(function(s) dnorm(s) * risk(s), lo, hi)$value / 0.01
top <- c1(qnorm(0.99), Inf); bot <- c1(-Inf, qnorm(0.01))
cat(sprintf("AUC %.2f; top 1%% %.1f%%, bottom 1%% %.2f%%, OR %.0f\n",
            pnorm(d / sqrt(2)), 100 * top, 100 * bot,
            top / (1 - top) / (bot / (1 - bot))))
```

which prints:

```
PRS = 1.05; panel mean 0.7688, SD 0.2344; z = 1.20
T = 2.3263, phi(T) = 0.02665, d = 0.851, AUC = 0.73
risk = 2.0%; top 5%: risk 4.0%, cases 20%
AUC 0.70; top 1% 4.8%, bottom 1% 0.08%, OR 63
```

The simulation. It uses only base R and takes about half a minute:

```r
set.seed(1)
M <- 2000; h2 <- 0.5                 # independent causal SNPs
f <- runif(M, 0.05, 0.5)             # allele frequencies
b <- rnorm(M, 0, sqrt(h2 / M))       # effects per SD of genotype
haps <- function(n) matrix(rbinom(n * M, 1, rep(f, each = n)), n)
std <- function(G) sweep(sweep(G, 2, 2 * f), 2,
                         sqrt(2 * f * (1 - f)), "/")
tag <- function(H, a)                # copy of H with probability a
  ifelse(matrix(runif(length(H)) < a, nrow(H)), H, haps(nrow(H)))
people <- function(n, a) {           # causal X, tags Z, liability y
  H1 <- haps(n); H2 <- haps(n); X <- std(H1 + H2)
  list(X = X, Z = std(tag(H1, a) + tag(H2, a)),
       y = drop(X %*% b) + rnorm(n, 0, sqrt(1 - h2)))
}
d <- people(16000, 0.95)             # discovery (GWAS) sample
tD <- people(5000, 0.95)             # target, same ancestry
tT <- people(5000, 0.6)              # target, weaker tagging
r2 <- function(s, y) if (all(s == 0)) 0 else cor(s, y)^2
gwas <- function(X, y) drop(crossprod(X, y)) / length(y)
for (N in c(1000, 2000, 4000, 8000, 16000)) {
  i <- 1:N; bh <- gwas(d$X[i, ], d$y[i])
  cat(sprintf("N %5d: in-sample %.2f, new %.2f, formula %.2f\n",
      N, r2(d$X[i, ] %*% bh, d$y[i]), r2(tD$X %*% bh, tD$y),
      h2 * N * h2 / (N * h2 + M)))
}
b2 <- numeric(M); k <- sample(M, 100)  # sparse: 100 causal SNPs
b2[k] <- rnorm(100, 0, sqrt(h2 / 100))
y2 <- drop(d$X %*% b2) + rnorm(16000, 0, sqrt(1 - h2))
t2 <- drop(tD$X %*% b2) + rnorm(5000, 0, sqrt(1 - h2))
cat(sprintf("h2: dense %.2f, sparse %.2f\n", sum(b^2), sum(b2^2)))
i <- 1:4000                          # C+T from a 4,000-person GWAS
ct <- function(y, yt) {
  bh <- gwas(d$X[i, ], y[i]); p <- 2 * pnorm(-abs(bh) * sqrt(4000))
  sapply(cut, function(t) r2(tD$X %*% (bh * (p <= t)), yt))
}
cut <- c(5e-8, 1e-4, 1e-2, 0.1, 1)
print(data.frame(p_cut = cut, dense = round(ct(d$y, tD$y), 3),
                 sparse = round(ct(y2, t2), 3)), row.names = FALSE)
bz <- gwas(d$Z, d$y)                 # GWAS on the tag SNPs
rD <- r2(tD$Z %*% bz, tD$y); rT <- r2(tT$Z %*% bz, tT$y)
cat(sprintf("tags: same %.3f, other %.3f; ratio %.2f vs %.2f\n",
            rD, rT, rT / rD, (0.6 / 0.95)^2))
```

which prints:

```
N  1000: in-sample 0.73, new 0.10, formula 0.10
N  2000: in-sample 0.64, new 0.17, formula 0.17
N  4000: in-sample 0.57, new 0.26, formula 0.25
N  8000: in-sample 0.54, new 0.35, formula 0.33
N 16000: in-sample 0.52, new 0.42, formula 0.40
h2: dense 0.54, sparse 0.39
 p_cut dense sparse
 5e-08 0.000  0.276
 1e-04 0.008  0.346
 1e-02 0.104  0.356
 1e-01 0.193  0.274
 1e+00 0.259  0.197
tags: same 0.371, other 0.149; ratio 0.40 vs 0.40
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
- B. J. Vilhjálmsson, J. Yang, H. K. Finucane, et al., "Modeling linkage disequilibrium increases accuracy of polygenic risk scores", *Am. J. Hum. Genet.* 97, 576–592 (2015). [doi:10.1016/j.ajhg.2015.09.001](https://doi.org/10.1016/j.ajhg.2015.09.001)
- T. Ge, C.-Y. Chen, Y. Ni, Y.-C. A. Feng, J. W. Smoller, "Polygenic prediction via Bayesian regression and continuous shrinkage priors", *Nat. Commun.* 10, 1776 (2019). [doi:10.1038/s41467-019-09718-5](https://doi.org/10.1038/s41467-019-09718-5)
- A. R. Martin, M. Kanai, Y. Kamatani, et al., "Clinical use of current polygenic risk scores may exacerbate health disparities", *Nat. Genet.* 51, 584–591 (2019). [doi:10.1038/s41588-019-0379-x](https://doi.org/10.1038/s41588-019-0379-x)
