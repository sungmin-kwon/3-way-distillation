---
title: Rare variants versus common variants
summary: What makes a variant rare, why the genome is mostly made of them, and why they need a different kind of association test. The single-variant power formula says a 0.5% variant carries 50 times less information per person than a 50% one, and one worked gene shows what collapsing buys and where it breaks — the same burden test needs 2,500 people when every variant in the gene raises risk and nothing at any size when half of them protect instead.
date: 2026-11-13
tags: [genes]
distillate: Rare variants (MAF below about 0.5–1%) outnumber common ones because most are young and many are mildly deleterious; selection keeps strongly acting variants rare, so rare variants tend to have larger effects than common ones, with many distinct variants per gene. A variant's noncentrality is N·s(1−s)·2f(1−f)·β², and the factor 2f(1−f) is 50 times smaller at f = 0.5% than at f = 50%, so testing one rare variant needs enormous samples. Collapsing a gene's rare variants into one count raises the effective allele frequency, but its noncentrality, N·s(1−s)·2(Σf_jβ_j)²/Σf_j, is squared in the effects and dies if they point in mixed directions, while a sum of single-variant chi-squares keeps whatever power each variant has. In one toy gene (30 variants at 0.5%, 10 causal, OR 1.5, gene-wide bar 2.5×10⁻⁶), 80% power takes about 75,000 people one variant at a time, 22,500 by the burden test, and 15,800 by the sum test; with five risk and five protective causal variants the burden test has no power at any size and the sum test still needs 15,800.
model: [GLM-5.3]
---

A **common variant** is one carried by a large share of the population; a **rare variant** by only a small one. The line between them is a convention and moves with the field, but the standard cut is a **minor allele frequency** (MAF) of 1%: below that a variant is rare, above 5% comfortably common, and in between low-frequency. The distinction is not just bookkeeping. Rare and common variants are young versus old under different amounts of selection, they carry different effect sizes for the same reason, and the association test that works for one is close to useless for the other. The note works out all three differences and then prices them on one toy gene.

## Why most variants are rare

Sequencing makes the point starkly. In 2,440 exomes from the NHLBI Exome Sequencing Project, Tennessen et al. (2012) found over 500,000 single-nucleotide variants, of which 86% had a MAF below 0.5%, 82% had never been seen before, and 82% were specific to one ancestry group. Among the variants predicted to affect protein function, about 95.7% were rare.

Two forces produce this shape. Most rare variants are simply young: a new mutation starts at frequency $1/2N$ in a population of $N$ diploid people and, without selection in its favour, needs a long time to drift upward, so at any moment most variants have not had the chance to become common. On top of that, the human population grew explosively in the last few thousand generations, which multiplies the number of new mutations without giving any of them time to drift. Tennessen et al. attribute the excess of rare functional variants to this recent growth combined with weak purifying selection, which lets mildly harmful variants linger at low frequency rather than being eliminated immediately. A variant at 0.5% is, in the main, a young variant.

## Selection ties frequency to effect size

Purifying selection is the reason rare variants cannot be dismissed as a long tail of the same thing. In a model of disease loci with mutation, drift and selection against susceptibility alleles, Pritchard (2001) showed that neutral susceptibility alleles are unlikely to reach intermediate frequency, so they contribute little disease variance; instead, most variance should come from loci where susceptibility mutations are mildly deleterious, the mutation rate to new susceptibility alleles is high, and many different alleles at the same locus each raise risk. The stronger selection acts on an allele, the rarer that allele must be, so **frequency and effect size trade against each other**: a variant common enough to have survived selection cannot raise risk very much, while a variant that raises risk strongly is kept rare by selection.

Real genes look the way this argument predicts. Sequencing and genotyping about 150,000 people across five ancestries, Flannick et al. (2014) found 12 different rare protein-truncating variants in SLC30A8, and their carriers collectively had 65% reduced risk of type 2 diabetes (P = 1.7 × 10⁻⁶). That is one gene, twelve distinct rare variants, one effect much larger than any common variant's. This **allelic heterogeneity** is the practical signature of the rare-variant world: the unit of association is not a variant but a gene.

## The arithmetic of one rare allele

Why can't a rare variant be tested the way a common one is? The single-variant test is the same in both cases: an allelic 2×2 table, or a regression of the trait on dosage. What changes is the information per person. For a case-control study of $N$ people with a share $s$ of cases, an allele of frequency $f$ and a log-odds-ratio $\beta$, the expected Wald statistic is

$$
\mu = \beta \sqrt{N\, s(1-s)\, 2f(1-f)}
$$

where $2f(1-f)$ is the variance of the genotype: a person carries information about an allele only insofar as the allele varies. At $f = 0.5$ this factor is 0.50; at $f = 0.005$ it is 0.00995, fifty times smaller. Each person contributes a fiftieth of the evidence, and a rare variant needs roughly fifty times as many people to reach the same power, before any change in $\beta$.

Take the toy gene used throughout: 30 variants each at $f = 0.005$, ten of them causal with odds ratio 1.5 per rare allele, so $\beta = \log 1.5 = 0.405$. A gene-level test needs a bar too; with about 20,000 genes testable in an exome, this note uses $\alpha = 2.5 \times 10^{-6}$, which is $|z| > 4.71$. Power of 80% needs $\mu = 4.71 + 0.84 = 5.55$. For one causal variant at $N = 10{,}000$ (half cases, half controls),

$$
\mu^2 = 10{,}000 \times 0.25 \times 0.00995 \times 0.405^2 = 4.08
$$

a chi-square of about 4, nowhere near the bar; its power is about 0.4%. Reaching $\mu = 5.55$ takes

$$
N = \frac{5.55^2}{0.25 \times 0.00995 \times 0.405^2} \approx 75{,}000
$$

people, for one variant of a modest effect. This is the quantitative content of "rare variants need large samples": not a slogan but the factor $2f(1-f)$.

## The burden test

The fix is to stop testing variants. Li and Leal (2008) proposed **collapsing**: add a person's rare-allele counts across the variants of a gene into one number $C$, and test $C$ as if it were a single variant. The pooled allele frequency is $q = \sum_j f_j$, here $30 \times 0.005 = 0.15$, so the collapsed genotype varies enough to test in an ordinary sample.

Collapsing does not create information; it moves it into the frequency factor at a price in the effect. With per-variant effects $\beta_j$, the score test of $C$ has noncentrality

$$
\mu^2_{\text{burden}} = N\, s(1-s)\, \frac{2\left(\sum_j f_j \beta_j\right)^2}{\sum_j f_j}
$$

which is the single-variant formula with $f$ replaced by the pooled frequency and $\beta$ by the frequency-weighted mean effect $\bar\beta = \sum_j f_j\beta_j / \sum_j f_j$. In the toy gene with all ten causal variants raising risk, $\bar\beta = 10 \times 0.005 \times 0.405 / 0.15 = 0.135$: collapsing raised the frequency thirtyfold but cut the effective effect to a third. At $N = 10{,}000$,

$$
\mu^2_{\text{burden}} = 10{,}000 \times 0.25 \times \frac{2 \times 0.0203^2}{0.15} = 13.7
$$

for a power of 16%, and 80% power needs about 22,500 people. Aggregation bought a factor of three in sample size, not thirty, because the twenty noncausal variants went into the count along with the ten causal ones: they raise $q$ and dilute $\bar\beta$ at the same time.

## One gene, two scenarios

The sum in $\left(\sum_j f_j \beta_j\right)^2$ is the burden test's whole character. Squaring means the signs matter: effects in opposite directions cancel. Give the same gene a second scenario, five causal variants raising risk and five lowering it. The single-variant and burden noncentralities become

$$
\sum_j f_j\beta_j = 0.0203 \quad \text{(all one direction)}, \qquad 0 \quad \text{(five each way)}
$$

and the burden test's noncentrality in the second scenario is zero: no sample size, of any magnitude, gives it power. Its significance rate is stuck at $\alpha$.

The alternative is to aggregate the evidence rather than the genotypes. Test each variant separately, and add the thirty chi-squares into one statistic $Q$. Under the null, with independent variants, $Q$ has a $\chi^2(30)$ distribution, whose $2.5 \times 10^{-6}$ point is 79.3. Under the alternative, $Q$ is noncentral with parameter $\Lambda = \sum_j \mu_j^2$, the sum of the thirty per-variant noncentralities, and adding chi-squares adds their noncentralities whatever the signs: five risk and five protective causal variants contribute exactly as much as ten of one direction. Wu et al. (2011) built this into the sequence kernel association test, a score-based variance-component test whose p-values come analytically from just this kind of quadratic form.

| people needed for 80% power at the gene-wide bar | ten causal, one direction | five risk, five protective | all thirty causal, one direction |
| --- | --- | --- | --- |
| one variant at a time | 75,000 | 75,000 | 75,000 |
| burden test | 22,500 | none at any size | 2,500 |
| sum of chi-squares | 15,800 | 15,800 | 5,300 |

Every number in the table comes from the noncentralities above, read off the noncentral chi-square distributions. The table says three things. Aggregation is the only way to reach rare variants at ordinary sample sizes, which is Li and Leal's point. The burden test is the stronger aggregator only when the direction assumption is nearly right: with all thirty variants causal and aligned it needs 2,500 people, less than half the sum test's 5,300. And the two tests disagree in the middle: with ten of thirty causal, the burden test is dragged down by the dilution of $\bar\beta$ and needs 22,500 people while the sum test, which pays for thirty degrees of freedom but keeps every causal variant's contribution, needs 15,800. Li and Leal's own comparison already showed this split, collapsing powerful and the multivariate test robust to noncausal variants; the variance-component test is the robustness made systematic.

## Where the machinery breaks

The burden test breaks on direction, as the table shows, and the sum test breaks on spread: it wins when many variants each carry a little, but if one variant carries almost everything, its signal is averaged into thirty degrees of freedom and the burden test (or the single-variant test, if that variant is not too rare) finds it with less. Adaptive combinations of the two exist for exactly this reason, at the price of a more complicated null distribution.

Two assumptions deserve flags. The $\chi^2(30)$ null treats the gene's variants as independent, which rare variants nearly are, since two variants that are both rare are rarely inherited together; where they do correlate, the null is a weighted sum of chi-squares instead, and ignoring the weights makes the test anti-conservative. And population structure hurts rare-variant tests more than common-variant ones: Mathieson and McVean (2012) showed that rare variants can show stratification systematically different from, and typically stronger than, common variants', that standard corrections do not necessarily remove it, and that it inflates load-based tests, which is what a burden statistic is. The older a variant, the more its frequency differences reflect deep ancestry that principal components capture; a variant that arose five hundred years ago reflects the town where it arose, and a mismatch of cases and controls across that geography reads as association.

## Sources

- J. A. Tennessen et al., "Evolution and functional impact of rare coding variation from deep sequencing of human exomes", *Science* 337, 64–69 (2012). [doi:10.1126/science.1219240](https://doi.org/10.1126/science.1219240)
- J. K. Pritchard, "Are rare variants responsible for susceptibility to complex diseases?", *Am. J. Hum. Genet.* 69, 124–137 (2001). [doi:10.1086/321272](https://doi.org/10.1086/321272)
- J. Flannick et al., "Loss-of-function mutations in SLC30A8 protect against type 2 diabetes", *Nat. Genet.* 46, 357–363 (2014). [doi:10.1038/ng.2915](https://doi.org/10.1038/ng.2915)
- B. Li, S. M. Leal, "Methods for detecting associations with rare variants for common diseases: application to analysis of sequence data", *Am. J. Hum. Genet.* 83, 311–321 (2008). [doi:10.1016/j.ajhg.2008.06.024](https://doi.org/10.1016/j.ajhg.2008.06.024)
- M. C. Wu et al., "Rare-variant association testing for sequencing data with the sequence kernel association test", *Am. J. Hum. Genet.* 89, 82–93 (2011). [doi:10.1016/j.ajhg.2011.05.029](https://doi.org/10.1016/j.ajhg.2011.05.029)
- I. Mathieson, G. McVean, "Differential confounding of rare and common variants in spatially structured populations", *Nat. Genet.* 44, 243–246 (2012). [doi:10.1038/ng.1074](https://doi.org/10.1038/ng.1074)
