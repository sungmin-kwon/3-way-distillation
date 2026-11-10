---
title: "EHRs in hospital systems: FHIR, OMOP and the CDW"
summary: How hospital EHR data actually moves — HL7 v2 messages and the FHIR API, terminology standards, the clinical data warehouse, and the OMOP CDM that turns EHR data into research-ready form, worked on a tiny three-patient OMOP example with a runnable cohort query.
date: 2026-11-10
tags: [genetics]
distillate: Hospital EHR data reaches research through a pipeline; EHR to HL7 v2 / FHIR interfaces to a clinical data warehouse (CDW), then an ETL into the OMOP CDM (v5.4) with standard vocabularies, where queries like type 2 diabetes (concept 201826) on metformin (concept 1503297) become portable SQL. On the toy three-patient example the T2D count is 2 and the T2D-plus-metformin cohort is 1. FHIR R4 (2019) is the production baseline API and R5 (2023) the latest published version; OMOP is for analytics, FHIR for exchange. Limits cover coding quality, missingness, mapping loss, and privacy law (Korea's PIPA and Bioethics Act, HIPAA, GDPR).
model: [Mistral Large 4]
---

A hospital runs its operations on an **EHR** (in Korea, the broader "hospital information system", HIS), and almost everything clinical ends up stored there: diagnoses, drugs, labs, vitals, imaging, orders. The catch is that this data is locked inside vendor systems and written in local codes, so it is hard to use for anything beyond that patient's care. Making it research-usable is a plumbing job with two standards at its heart: **HL7 FHIR** for exchanging data, and the **OMOP Common Data Model (CDM)** for storing and analyzing it in a **clinical data warehouse (CDW)**. The [GWAS](note:genome-wide-association-studies), [PRS](note:polygenic-risk-scores) and [MR](note:mendelian-randomization) methods in the notes here run on consortium and biobank data (PGC, UK Biobank, GLGC-style summary statistics); hospital CDWs are where they meet routine clinical data, for example in EHR-linked biobanks such as UK Biobank's hospital-record linkage, eMERGE or the Million Veteran Program. Korean tertiary hospitals are well-documented examples of CDW-to-OMOP conversion (Yoon et al., 2016; Park et al., 2023; Ji et al., 2024)[^1].

Throughout, the note uses one worked example: a toy OMOP-style dataset of three patients.

| table | rows in the toy data |
| --- | --- |
| person | 3 people (born 1975, 1980, 1968) |
| condition_occurrence | person 1 and 2: concept 201826 (type 2 diabetes); person 3: concept 320128 (essential hypertension) |
| drug_exposure | person 1 and 3: concept 1503297 (metformin); person 2: no drug row |

[^1]: Yoon et al. (2016), Healthc Inform Res 22, 54–58, doi:10.4258/hir.2016.22.1.54 (EHR-to-CDM conversion and data quality at a Korean tertiary teaching hospital); Park et al. (2023), PLoS ONE 18(1), e0279641, doi:10.1371/journal.pone.0279641 (process mining on OMOP CDM); Ji et al. (2024), JMIR Med Inform 12, e59187, doi:10.2196/59187 (imaging extension of OMOP in lung cancer).

## Exchange standards: HL7 v2 and FHIR

For decades hospitals have exchanged data as **HL7 v2 messages** (ADT for admissions, ORM for orders, ORU for lab results), parsed by an interface engine. **HL7 FHIR** (Fast Healthcare Interoperability Resources) is the modern replacement: discrete **resources** (Patient, Encounter, Observation, Condition, MedicationRequest, DiagnosticReport) served over a REST API, e.g. `GET /fhir/Observation?patient=123&code=loinc|2339-0`, with bulk export for research. FHIR R4 (v4.0.1, 2019) is the production baseline in most countries (it is what US Cures-Act/CMS rules mandate); R5 (v5.0.0) was published in March 2023 as the latest version; **SMART on FHIR** adds OAuth2 app authorization on top (hl7.org/fhir, build.fhir.org/ig/HL7/smart-app-launch)[^2]. In practice most hospital integrations still run HL7 v2, with FHIR APIs growing for portals, apps and research feeds.

[^2]: HL7 FHIR specification, <https://hl7.org/fhir/>; SMART App Launch IG, <https://build.fhir.org/ig/HL7/smart-app-launch/>.

## Terminologies

Every clinical fact needs a code. Diagnoses use ICD-10 (in Korea, KCD, the Korean adaptation) for billing and SNOMED CT as the clinical standard; labs use LOINC; drugs use RxNorm. The OMOP vocabulary maps each source code to one **standard concept**: e.g. ICD-10 E11.9 (source concept 45561952) "maps to" SNOMED concept 201826, so a query on 201826 catches every source system (OHDSI vocabulary documentation, ohdsi.github.io/CommonDataModel)[^3].

[^3]: OMOP CDM and vocabulary docs, <https://ohdsi.github.io/CommonDataModel/>; OHDSI, <https://www.ohdsi.org/> (community founded 2014; Hripcsak et al., 2015, Stud Health Technol Inform 216, 574–578).

## The clinical data warehouse

A **CDW** is the hospital's integrated copy of its own EHR data, loaded by ETL from the interface engine, used for operations, reporting and research:

<svg viewBox="0 0 500 370" role="img" aria-label="Hospital data architecture: the EHR feeds HL7 v2 messages and a FHIR API into an interface engine, which loads a clinical data warehouse; the CDW is transformed to OMOP CDM v5.4 with standard vocabularies, feeding research and analytics; terminologies map source codes to standard concepts." xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <title>From EHR to CDW to OMOP</title>
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" style="fill: var(--accent)"/></marker></defs>
  <rect x="20" y="60" width="120" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="80.0" y="84.5" text-anchor="middle" font-size="11" fill="currentColor">Hospital EHR / HIS</text>
  <text x="80.0" y="97.5" text-anchor="middle" font-size="11" fill="currentColor">(clinical operations)</text>
  <rect x="180" y="60" width="120" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="240.0" y="84.5" text-anchor="middle" font-size="11" fill="currentColor">HL7 v2 messages</text>
  <text x="240.0" y="97.5" text-anchor="middle" font-size="11" fill="currentColor">FHIR API (R4/R5)</text>
  <rect x="340" y="60" width="110" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="395.0" y="91.0" text-anchor="middle" font-size="11" fill="currentColor">Interface engine</text>
  <rect x="20" y="180" width="120" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="80.0" y="204.5" text-anchor="middle" font-size="11" fill="currentColor">CDW</text>
  <text x="80.0" y="217.5" text-anchor="middle" font-size="11" fill="currentColor">(relational store)</text>
  <rect x="180" y="180" width="130" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="245.0" y="204.5" text-anchor="middle" font-size="11" fill="currentColor">OMOP CDM v5.4</text>
  <text x="245.0" y="217.5" text-anchor="middle" font-size="11" fill="currentColor">+ vocabulary</text>
  <rect x="350" y="180" width="130" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="415.0" y="204.5" text-anchor="middle" font-size="11" fill="currentColor">Research & analytics</text>
  <text x="415.0" y="217.5" text-anchor="middle" font-size="11" fill="currentColor">SQL, ATLAS, AI</text>
  <rect x="180" y="290" width="220" height="54" rx="6" fill="none" style="stroke: var(--ink)"/>
  <text x="290.0" y="308.0" text-anchor="middle" font-size="11" fill="currentColor">Terminologies</text>
  <text x="290.0" y="321.0" text-anchor="middle" font-size="11" fill="currentColor">ICD-10/KCD, SNOMED CT,</text>
  <text x="290.0" y="334.0" text-anchor="middle" font-size="11" fill="currentColor">LOINC, RxNorm</text>
  <line x1="140" y1="87" x2="180" y2="87" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
  <line x1="300" y1="87" x2="340" y2="87" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
  <line x1="395" y1="114" x2="80" y2="180" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
  <line x1="140" y1="207" x2="180" y2="207" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
  <line x1="310" y1="207" x2="350" y2="207" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
  <line x1="290" y1="290" x2="245" y2="234" style="stroke: var(--accent)" stroke-width="1.75" marker-end="url(#arr)"/>
</svg>

*Typical hospital pipeline: the EHR feeds HL7 v2 / FHIR interfaces through an interface engine into the CDW; the CDW is transformed into OMOP CDM v5.4 with standard vocabularies; analytics and research run on top. Terminologies map local codes to standard concepts during the ETL.*

Access is governed: in Korea, the Personal Information Protection Act (PIPA) and the Bioethics and Safety Act (IRB approval for research use of identifiable data, with de-identified data exempted); in the US, HIPAA de-identification (45 CFR §164.514); in the EU, GDPR pseudonymization (Art. 4(5)). CDWs usually release **de-identified** or **pseudonymized** extracts through a data-access committee, never live identified data.

## OMOP CDM for research

The OMOP CDM (v5.4, the current widely deployed release) is the relational schema OHDSI standardized for multi-site observational research. Core tables: `person`, `observation_period`, `visit_occurrence`, `condition_occurrence`, `drug_exposure`, `measurement`, `procedure_occurrence`, plus the vocabulary tables (`concept`, `concept_relationship`, `concept_ancestor` for "descendants of" queries). Because every site maps to the same concepts, the same cohort SQL runs unchanged at a Korean tertiary hospital, at a US academic center, or in claims data, and patient-level rows never leave the site; analyses are run locally and only aggregate results shared. The tooling (ATLAS/WebAPI for cohort design, HADES packages for estimation, the Data Quality Dashboard) runs on the CDM (OHDSI Book of OHDSI)[^4].

[^4]: Book of OHDSI, <https://ohdsi.github.io/TheBookOfOhdsi/>.

## The toy cohort query

On the worked example, counting persons with the T2D concept and joining to metformin exposures:

```python
import sqlite3
con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE person (person_id INTEGER, year_of_birth INTEGER);
CREATE TABLE condition_occurrence (person_id INTEGER, condition_concept_id INTEGER, condition_start_date TEXT);
CREATE TABLE drug_exposure (person_id INTEGER, drug_concept_id INTEGER, drug_exposure_start_date TEXT);
INSERT INTO person VALUES (1, 1975), (2, 1980), (3, 1968);
INSERT INTO condition_occurrence VALUES
  (1, 201826, '2023-05-01'),   -- 201826 = type 2 diabetes (SNOMED, standard)
  (2, 201826, '2024-01-15'),
  (3, 320128, '2022-11-20');   -- 320128 = essential hypertension
INSERT INTO drug_exposure VALUES
  (1, 1503297, '2023-05-02'),  -- 1503297 = metformin (RxNorm, standard)
  (3, 1503297, '2022-11-21');
""")
t2d = con.execute("SELECT COUNT(DISTINCT person_id) FROM condition_occurrence"
                  " WHERE condition_concept_id = 201826").fetchone()[0]
cohort = con.execute("""SELECT COUNT(DISTINCT c.person_id) FROM condition_occurrence c
  JOIN drug_exposure d ON d.person_id = c.person_id
  WHERE c.condition_concept_id = 201826 AND d.drug_concept_id = 1503297""").fetchone()[0]
print(f"persons with T2D (concept 201826): {t2d}")
print(f"T2D + metformin cohort: {cohort}")
```

which prints:

```
persons with T2D (concept 201826): 2
T2D + metformin cohort: 1
```

In a real CDM, drug_exposure rows are coded at clinical-drug level (e.g. metformin 500 mg tablets), so a query starts from the ingredient concept (1503297) and walks `concept_ancestor` down to the clinical drugs. Person 2 has the diagnosis but no drug row, and person 3 has the drug but only a hypertension diagnosis: real CDWs are full of exactly this missingness and mismatch, which is why phenotypes are usually defined with rules (e.g., condition plus drug within 90 days, via `concept_ancestor` descendants), not single codes.

## Limits

EHR data reflects coding practice, not ground truth: diagnoses are recorded for billing and care, free-text notes hold much of the signal, and measurements are missing non-randomly. ETL into a CDM is lossy: timestamps, doses and units can be coarsened, and source-to-standard mapping drops or merges codes. FHIR adoption is uneven (v2 messaging still dominates inside hospitals), and versions drift (R4 vs R5). Terminology licensing matters (SNOMED CT requires a license in many countries), and local code systems such as Korea's KCD/EDI must be mapped. And the privacy/utility tension is real: more de-identification, less research value. A CDW is infrastructure, not evidence by itself.
