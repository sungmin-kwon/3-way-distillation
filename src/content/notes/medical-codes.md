---
title: "Medical codes: ICD, SNOMED CT, LOINC, RxNorm and phecodes"
summary: "How a diagnosis, a lab test and a drug become codes in a health record, and how genetic studies turn those codes back into phenotypes — classifications vs terminologies, ICD-9 to ICD-11, SNOMED CT, LOINC, RxNorm, phecodes, and case and control rules, worked on one type 2 diabetes record and a ten-patient toy cohort."
date: 2026-11-10
tags: [genes]
distillate: "Health records store facts as codes from several systems with different jobs. ICD classifies diagnoses into bins for statistics and billing (type 2 diabetes is 250.00 in ICD-9-CM, E11.9 in ICD-10-CM, 5A11 in ICD-11), SNOMED CT describes them in clinical detail (44054006), LOINC names lab tests (HbA1c is 4548-4) and RxNorm names drugs (metformin is 6809). Genetic studies regroup ICD codes into phecodes and apply case and control rules; on the ten-patient toy cohort, a one-code rule gives 3 cases and 7 controls, and a stricter rule gives 2 cases and 3 controls. The strictness pays for itself: if only 80% of code-defined cases are real, the toy GWAS's odds ratio of 1.49 shrinks to 1.38 and the sample it needs grows from about 1,500 to about 2,300 people."
model: [Claude Opus 5.5]
---

A health record is mostly codes. When a doctor diagnoses type 2 diabetes, orders an HbA1c test and prescribes metformin, each of those facts is stored as a code from a different system, maintained by a different body for a different purpose. The [EHR note](note:ehrs-fhir-omop-cdw) describes how those records move and get standardized; this note is about the codes themselves, and about the step that genetic studies depend on: turning codes back into a **phenotype**, a yes-or-no label for "has the disease", that a [GWAS](note:genome-wide-association-studies), a [polygenic risk score](note:polygenic-risk-scores) or a [Mendelian randomization](note:mendelian-randomization) analysis can use.

Throughout, the note uses one worked example: a patient with type 2 diabetes, and a ten-patient toy cohort to which three case definitions are applied.

| | value |
| --- | --- |
| diagnosis | type 2 diabetes, without complications |
| lab test | HbA1c 7.8 % (diagnostic threshold 6.5 %) |
| drug | metformin hydrochloride 500 mg oral tablet |
| toy cohort | 10 patients: diagnosis codes with dates, metformin yes or no, highest HbA1c |

## Classifications and terminologies

The codes split into two kinds, and most confusion comes from mixing them up. A **classification** sorts every case into exactly one of a fixed set of bins, so that the bins can be counted: deaths by cause, admissions by diagnosis, claims by condition. It needs catch-all bins ("other", "unspecified") so that nothing falls outside it, and it changes slowly, in numbered revisions, so that counts stay comparable over years. ICD is a classification.

A **terminology** tries to name every clinical idea at whatever detail a clinician needs, and to relate the names to each other ("type 2 diabetes *is a* diabetes mellitus", "*finding site*: pancreas"). It has no requirement that categories be exclusive, and it grows continuously. SNOMED CT is a terminology. In practice a hospital uses both: a clinician picks a SNOMED-coded term in the problem list, and a coder or the billing system assigns an ICD code for the claim.

The worked example's three facts, coded:

| fact | system | code | name in that system |
| --- | --- | --- | --- |
| diagnosis | ICD-9-CM (US, to 2015) | 250.00 | Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled |
| | ICD-10-CM (US, since 2015) | E11.9 | Type 2 diabetes mellitus without complications |
| | ICD-11 (WHO, since 2022) | 5A11 | Type 2 diabetes mellitus |
| | SNOMED CT | 44054006 | Diabetes mellitus type 2 (disorder) |
| | phecode | 250.2 | Type 2 diabetes |
| lab test | LOINC | 4548-4 | Hemoglobin A1c/Hemoglobin.total in Blood |
| drug | RxNorm, ingredient | 6809 | metformin |
| | RxNorm, clinical drug | 861007 | metformin hydrochloride 500 MG Oral Tablet |
| | ATC (WHO) | A10BA02 | metformin |

The names are quoted from each system's own browser or API where one could be opened (NLM Clinical Tables for ICD-9-CM and ICD-10-CM, loinc.org, RxNav, the WHO ATC index), from a national SNOMED CT browser, and from the WHO ICD-11 browser.

## ICD: ICD-9, ICD-10 and ICD-11

The **International Classification of Diseases** descends from a list of causes of death drawn up in the 1890s and is now maintained by the WHO. Its revisions are long-lived: ICD-10 was adopted by the World Health Assembly in May 1990 and took effect on 1 January 1993, and ICD-11 was adopted in May 2019 and took effect on 1 January 2022 (WHO). Countries move to a new revision on their own schedule, mostly years late, so ICD-10 is still the working classification almost everywhere.

Many countries use a **national modification** that adds detail. The US used ICD-9-CM for diagnoses until 1 October 2015, when it switched to ICD-10-CM for diagnoses and ICD-10-PCS for inpatient procedures (CMS); Korea uses KCD, its adaptation of ICD-10. The code shapes differ between revisions. ICD-9-CM diagnosis codes are three digits plus up to two decimals (250.00: the fourth digit 0 means no complication, the fifth digit 0 means type 2 or unspecified and not stated as uncontrolled). ICD-10 codes are a letter, two digits and decimals (E11.9), and ICD-10-CM extends them to up to seven characters for detail such as laterality and encounter type. ICD-11 codes start with a digit and a letter (5A11).

Two facts about ICD matter for research. First, a code is assigned for reimbursement and administration, so coding practice follows payment rules as well as clinical truth: a "rule-out" diagnosis entered to justify a test looks just like a confirmed one. Second, a change of revision breaks a time series. A US cohort running from 2010 to 2020 has ICD-9-CM codes before October 2015 and ICD-10-CM codes after, and the two do not map one-to-one, so a phenotype must be defined in both or the cases appear to change at the switch.

## SNOMED CT

**SNOMED CT** is the largest clinical terminology, with more than 360,000 concepts in its international edition, maintained by SNOMED International and free to use in its member countries (Korea joined in August 2020). Each concept has a numeric identifier, one fully specified name ("Diabetes mellitus type 2 (disorder)", where the word in parentheses is the semantic tag), several synonyms, and typed relationships to other concepts. The *is a* relationships form a polyhierarchy: a concept can have more than one parent, so "type 2 diabetes with diabetic nephropathy" sits under both type 2 diabetes and kidney disease. That structure is what lets a query ask for "type 2 diabetes and everything beneath it".

The identifiers carry their own integrity check. The last digit of a SNOMED CT identifier is a Verhoeff check digit, and the two digits before it say what kind of component the identifier names, with 00 meaning a concept (SNOMED CT Technical Implementation Guide). In 44054006 the partition is 00 and the check digit is 6; changing the last digit to 7 makes the identifier fail the check. Similar checks exist in LOINC (below), which is why typos in codes copied by hand tend to be caught rather than silently mapped to a different concept.

## LOINC for tests and observations

A lab result needs two codes' worth of information: what was measured, and the value. **LOINC** (Logical Observation Identifiers Names and Codes, started in 1994 by Clem McDonald at the Regenstrief Institute) codes the first. A LOINC term is defined by six parts, the last of them optional: the component (what is measured), the property (mass concentration, mass fraction, and so on), the timing (a point in time or a collection period), the system (the specimen, such as blood or urine), the scale (quantitative, ordinal, nominal) and, optionally, the method. HbA1c, 4548-4, is component "Hemoglobin A1c/Hemoglobin.total", property mass fraction, timing point, system blood, scale quantitative, with no method (loinc.org). Two assays that differ in any part get different codes, which is the point: a glucose in blood (2339-0) and a glucose in serum or plasma are not interchangeable numbers.

The value (7.8) and its unit (%) are stored next to the code, not in it. The number after the hyphen is a mod-10 check digit, computed the same way as on a credit card: double every second digit from the right, add the digits, and take what is needed to reach the next multiple of 10. For 4548, the 8 doubles to 16 (digit sum 7) and the 5 doubles to 10 (digit sum 1), so the sum is 7 + 4 + 1 + 4 = 16 and the check digit is 4.

## RxNorm and ATC for drugs

Drug data are messier than diagnoses because the same medicine appears under many brand names, strengths and package codes. **RxNorm**, produced by the US National Library of Medicine, gives normalized names for clinical drugs and links them at several levels. The ingredient metformin is RxCUI 6809 (term type IN); "metformin hydrochloride 500 MG Oral Tablet" is RxCUI 861007, a semantic clinical drug (SCD), which is the level that prescriptions and dispensing records usually reach. A query for "anyone on metformin" therefore starts at the ingredient and collects every clinical drug and branded product beneath it.

Outside the US, national drug codes (Korea's insurance claim codes, the UK's dm+d) carry the same information and are mapped to RxNorm for international work. The WHO's **ATC** classification groups drugs by organ system and mechanism instead: A10BA02 reads as alimentary tract and metabolism (A), drugs used in diabetes (A10), blood-glucose-lowering drugs excluding insulins (A10B), biguanides (A10BA), metformin (02). RxNorm answers "which product", ATC answers "which class".

## Phecodes: codes regrouped for genetics

ICD is too fine and too billing-shaped for genetic analysis. Tens of thousands of ICD-10-CM codes split one disease across many codes (E11.9 is only one of the E11 codes for type 2 diabetes), while other codes lump unrelated conditions. **Phecodes** regroup ICD codes into clinically meaningful phenotypes. They were built at Vanderbilt for the first **phenome-wide association study** (PheWAS), which reverses a GWAS: instead of testing many SNPs against one trait, it tests one SNP against every phenotype in the record (Denny et al., 2010). The version described by Wei et al. (2017) has 1,866 hierarchical phecodes grouping 15,558 ICD-9-CM codes; ICD-10 and ICD-10-CM codes were mapped to it later (Wu et al., 2019), and **phecodeX** (Shuey et al., 2023) is a revision built for ICD-10-era data.

Phecodes add two rules that matter as much as the grouping. The first is a **case rule**: a patient usually counts as a case only with the code on at least two different dates, which filters out one-off rule-out codes. The second is a **control exclusion range**: a patient with a related code is left out of the controls rather than counted as one. For type 2 diabetes (phecode 250.2), the exclusion range is phecodes 249–250.99, which covers every form of diabetes, so someone with type 1 diabetes or a single unconfirmed diabetes code is neither a case nor a control (phecode 250.2 as listed in ExPRSweb). Without the exclusion, controls are contaminated with people who have the disease or something close to it.

## From codes to cases and controls

A phenotype definition is a rule over codes, drugs and labs. The toy cohort shows how much the rule matters. Each patient has their diagnosis codes with dates, whether metformin is on their drug list, and their highest HbA1c:

| patient | diagnosis codes | metformin | highest HbA1c (%) |
| --- | --- | --- | --- |
| 1 | E11.9 on 3 dates | yes | 7.8 |
| 2 | E11.9 on 1 date | no | 5.4 |
| 3 | none | yes | 5.6 |
| 4 | E11.9 on 2 dates | yes | 6.9 |
| 5 | none | no | 5.2 |
| 6 | E10.9 (type 1) on 3 dates | no | 8.5 |
| 7 | none | no | 6.8 |
| 8 | none | no | not measured |
| 9 | none | no | 5.0 |
| 10 | none | no | 5.7 |

Three rules, from loose to strict:

1. **One code:** a case has any type 2 diabetes code; everyone else is a control.
2. **Two dates, with exclusions:** a case has type 2 codes on at least two dates and no type 1 code; anyone else with a diabetes code is excluded; the rest are controls.
3. **Codes plus drugs plus labs:** a case meets rule 2 and also takes metformin or has HbA1c of at least 6.5 %; a control has no diabetes code, no metformin and a measured HbA1c below 6.5 %; everyone else is excluded.

```python
people = {  # id: (codes with dates, on metformin, highest HbA1c %)
    1: ({"E11.9": ["2023-03-01", "2023-06-10", "2024-01-05"]}, True, 7.8),
    2: ({"E11.9": ["2024-02-20"]}, False, 5.4),
    3: ({}, True, 5.6),
    4: ({"E11.9": ["2022-09-14", "2023-09-02"]}, True, 6.9),
    5: ({}, False, 5.2),
    6: ({"E10.9": ["2021-01-11", "2021-04-30", "2022-02-02"]}, False, 8.5),
    7: ({}, False, 6.8), 8: ({}, False, None), 9: ({}, False, 5.0), 10: ({}, False, 5.7),
}
def label(codes, metformin, hba1c, rule):
    t2d_dates = {d for c, ds in codes.items() if c.startswith("E11") for d in ds}
    any_dm = any(c[:3] in {"E10", "E11", "E13"} for c in codes)  # exclusion range
    type1 = any(c.startswith("E10") for c in codes)
    if rule == 1:
        return "case" if t2d_dates else "control"
    is_case = len(t2d_dates) >= 2 and not type1
    if rule == 2:
        return "case" if is_case else ("excluded" if any_dm else "control")
    if is_case and (metformin or (hba1c or 0) >= 6.5):
        return "case"
    if not any_dm and not metformin and hba1c is not None and hba1c < 6.5:
        return "control"
    return "excluded"

for rule in (1, 2, 3):
    out = {p: label(*v, rule) for p, v in people.items()}
    print(rule, {k: [p for p in out if out[p] == k] for k in ("case", "control", "excluded")})
```

which prints:

```
1 {'case': [1, 2, 4], 'control': [3, 5, 6, 7, 8, 9, 10], 'excluded': []}
2 {'case': [1, 4], 'control': [3, 5, 7, 8, 9, 10], 'excluded': [2, 6]}
3 {'case': [1, 4], 'control': [5, 9, 10], 'excluded': [2, 3, 6, 7, 8]}
```

Rule 1 calls patient 2, with one unconfirmed code and a normal HbA1c, a case, and calls patient 6, who has type 1 diabetes, a control. Rule 2 fixes both. Rule 3 also drops patient 7, whose HbA1c of 6.8 % suggests diabetes that was never coded, and patient 3, who takes metformin without a diabetes code (metformin is also prescribed for other conditions, such as polycystic ovary syndrome, so the drug alone proves nothing). It loses patient 8 too, for lack of a lab value. The stricter the rule, the cleaner the groups and the fewer the people: 3 cases and 7 controls, then 2 and 6, then 2 and 3.

Real algorithms look like rule 3. The eMERGE network's type 2 diabetes algorithm combined diagnosis codes, medications and glucose or HbA1c values, and was run unchanged across several institutions' EHRs to assemble cases and controls for a GWAS (Kho et al., 2012). Validated algorithms of this kind are shared on PheKB (Kirby et al., 2016).

## Why a clean phenotype is statistical power

Misclassified cases dilute the signal a GWAS looks for. Take the toy SNP from the [GWAS note](note:genome-wide-association-studies): the risk allele has frequency 0.55 in true cases and 0.45 in controls, which gives an allelic odds ratio of 1.49 and needs about 1,500 people to reach $p < 5 \times 10^{-8}$. Now suppose the case definition has a **positive predictive value** (PPV) of 0.8: 80% of the people labeled cases have the disease, and the other 20% are really controls. The allele frequency among labeled cases becomes

$$
p_{\text{case}} = 0.8 \times 0.55 + 0.2 \times 0.45 = 0.53
$$

where $p_{\text{case}}$ is the risk-allele frequency in the labeled cases. With 200 labeled cases and 200 controls, the allele counts are 212/188 in cases and 180/220 in controls, so the odds ratio falls to $(212/188)/(180/220) = 1.38$ and the chi-square statistic from 8.0 to 5.1. The sample needed to reach the genome-wide threshold ($\chi^2 \approx 29.7$) grows in proportion:

| PPV of case label | allele frequency in labeled cases | odds ratio | $\chi^2$ at 400 people | people needed |
| --- | --- | --- | --- | --- |
| 1.0 | 0.55 | 1.49 | 8.0 | about 1,500 |
| 0.9 | 0.54 | 1.43 | 6.5 | about 1,800 |
| 0.8 | 0.53 | 1.38 | 5.1 | about 2,300 |
| 0.7 | 0.52 | 1.32 | 3.9 | about 3,000 |

The required sample grows roughly as $1/\mathrm{PPV}^2$, because the allele-frequency difference shrinks in proportion to the PPV and the chi-square grows with its square. Contaminated controls do the same damage from the other side, which is what exclusion ranges prevent. So a strict definition that leaves many people out can still be the better choice: a smaller, cleaner sample can carry more information than a larger, noisier one.

The same dilution reaches the other methods in the section. A [polygenic risk score](note:polygenic-risk-scores) evaluated against code-defined outcomes shows a lower AUC than against true disease status, because some "cases" have nothing for the score to detect. In [Mendelian randomization](note:mendelian-randomization), an outcome GWAS built on a leaky phenotype has attenuated SNP–outcome effects, which pulls the causal estimate toward the null.

## Where the codes meet the data model

In an OMOP database, described in the [EHR note](note:ehrs-fhir-omop-cdw), each source code is kept and also mapped to one **standard concept**: diagnoses to SNOMED CT, drugs to RxNorm, lab tests to LOINC. ICD-10-CM E11.9 maps to the standard concept 201826, "Type 2 diabetes mellitus", whose source is SNOMED CT 44054006. A phenotype is then written once against standard concepts and their descendants, and runs on data that started as ICD-9-CM, ICD-10-CM or KCD. The mapping is many-to-one and sometimes lossy, so phenotypes that were validated on ICD codes, including phecodes, are often still run on the source codes, which OMOP keeps alongside.

## Sources

- WHO, *International Classification of Diseases* (revision history: ICD-10 adopted May 1990, in effect 1 January 1993; ICD-11 adopted May 2019, in effect 1 January 2022). [who.int](https://www.who.int/standards/classifications/classification-of-diseases)
- WHO, *ICD-11 for Mortality and Morbidity Statistics*, 5A11 Type 2 diabetes mellitus. [icd.who.int](https://icd.who.int/browse/latest-release/mms/en#119724091)
- CMS, *ICD-10 codes* (the US transition on 1 October 2015). [cms.gov](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- NLM Clinical Tables, ICD-10-CM and ICD-9-CM code lookups. [E11.9](https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=E11.9), [250.00](https://clinicaltables.nlm.nih.gov/api/icd9cm_dx/v3/search?terms=250.00)
- SNOMED International, *What is SNOMED CT* (over 360,000 concepts) and *Republic of Korea* member page. [snomed.org](https://www.snomed.org/what-is-snomed-ct), [snomed.org/members/republic-of-korea](https://www.snomed.org/members/republic-of-korea); concept 44054006 in a national browser: [terminologie.nictiz.nl](https://terminologie.nictiz.nl/terminology/snomed/viewConcept/44054006)
- SNOMED International, *SNOMED CT Technical Implementation Guide* (identifiers, partition and check digit). [confluence.ihtsdotools.org](https://confluence.ihtsdotools.org/display/DOCTIG)
- Regenstrief Institute, LOINC [4548-4](https://loinc.org/4548-4), [term structure](https://loinc.org/kb/faq/structure/), [history](https://loinc.org/about/); LOINC 2.83 (August 2026) has over 112,000 terms, [loinc.org](https://loinc.org/)
- NLM, *RxNorm*. [nlm.nih.gov/research/umls/rxnorm](https://www.nlm.nih.gov/research/umls/rxnorm/); RxCUIs [6809](https://rxnav.nlm.nih.gov/REST/rxcui/6809/properties.json) and [861007](https://rxnav.nlm.nih.gov/REST/rxcui/861007/properties.json)
- WHO Collaborating Centre for Drug Statistics Methodology, *ATC/DDD index*, A10BA02. [atcddd.fhi.no](https://atcddd.fhi.no/atc_ddd_index/?code=A10BA02)
- J. C. Denny, M. D. Ritchie, M. A. Basford, J. M. Pulley et al., "PheWAS: demonstrating the feasibility of a phenome-wide scan to discover gene–disease associations", *Bioinformatics* 26, 1205–1210 (2010). [doi:10.1093/bioinformatics/btq126](https://doi.org/10.1093/bioinformatics/btq126)
- W.-Q. Wei, L. A. Bastarache, R. J. Carroll, J. E. Marlo et al., "Evaluating phecodes, clinical classification software, and ICD-9-CM codes for phenome-wide association studies in the electronic health record", *PLoS ONE* 12, e0175508 (2017). [doi:10.1371/journal.pone.0175508](https://doi.org/10.1371/journal.pone.0175508)
- P. Wu, A. Gifford, X. Meng, X. Li et al., "Mapping ICD-10 and ICD-10-CM codes to phecodes: workflow development and initial evaluation", *JMIR Med. Inform.* 7, e14325 (2019). [doi:10.2196/14325](https://doi.org/10.2196/14325)
- M. M. Shuey et al., "Next-generation phenotyping: introducing phecodeX for enhanced discovery research in medical phenomics", *Bioinformatics* 39, btad655 (2023). [doi:10.1093/bioinformatics/btad655](https://doi.org/10.1093/bioinformatics/btad655)
- ExPRSweb, phecode 250.2 Type 2 diabetes (exclusion range 249–250.99, mapped ICD codes). [csg.sph.umich.edu](https://csg.sph.umich.edu/larsf/exprsweb/phecodes/250.2)
- A. N. Kho, M. G. Hayes, L. Rasmussen-Torvik, J. A. Pacheco et al., "Use of diverse electronic medical record systems to identify genetic risk for type 2 diabetes within a genome-wide association study", *J. Am. Med. Inform. Assoc.* 19, 212–218 (2012). [doi:10.1136/amiajnl-2011-000439](https://doi.org/10.1136/amiajnl-2011-000439)
- J. C. Kirby et al., "PheKB: a catalog and workflow for creating electronic phenotype algorithms for transportability", *J. Am. Med. Inform. Assoc.* 23, 1046–1052 (2016). [doi:10.1093/jamia/ocv202](https://doi.org/10.1093/jamia/ocv202)
