---
title: "EHRs in hospital systems: FHIR, OMOP and the CDW"
summary: How hospital EHR data actually moves — HL7 v2 messages and the FHIR API, the clinical data warehouse, what a common data model is and why research networks need one, and the OMOP CDM, worked on a tiny three-patient example from two hospitals with a runnable cohort query.
date: 2026-11-10
tags: []
distillate: Hospital EHR data reaches research through a pipeline; EHR to HL7 v2 / FHIR interfaces to a clinical data warehouse (CDW), then an ETL into a common data model (CDM). Every hospital's CDW has its own tables and codes, so a study across 10 hospitals and 5 questions needs 50 site-specific programs; with a shared CDM it needs 10 conversions and 5 programs, and patient rows never leave the sites. OMOP is the CDM that also standardizes vocabulary, so a query for type 2 diabetes (concept 201826) on metformin (concept 1503297) runs unchanged everywhere; on the toy three-patient example the T2D count is 2 and the T2D-plus-metformin cohort is 1.
model: [Mistral Large 4, Claude Opus 5.5]
---

A hospital runs its operations on an **EHR** (in Korea, the broader "hospital information system", HIS), and almost everything clinical ends up stored there: diagnoses, drugs, labs, vitals, imaging, orders. The catch is that this data is locked inside vendor systems and written in local codes, so it is hard to use for anything beyond that patient's care. Making it research-usable is a plumbing job: **HL7 FHIR** and older messaging standards for exchanging data, a **clinical data warehouse (CDW)** for keeping an integrated copy, and a **common data model (CDM)**, most often OMOP, for making that copy look the same as every other hospital's. Genetic methods such as GWAS, polygenic scores and Mendelian randomization mostly run on consortium and biobank data (PGC, UK Biobank, GLGC-style summary statistics); hospital CDWs are where they meet routine clinical data, for example in EHR-linked biobanks such as UK Biobank's hospital-record linkage, eMERGE or the Million Veteran Program.

Throughout, the note uses one worked example: three patients from two hospitals, which store them differently until both are converted to OMOP.

| table | rows in the toy data |
| --- | --- |
| person | 3 people (born 1975, 1980, 1968); persons 1 and 2 from hospital A, person 3 from hospital B |
| condition_occurrence | person 1 and 2: concept 201826 (type 2 diabetes); person 3: concept 320128 (essential hypertension) |
| drug_exposure | person 1 and 3: concept 1503297 (metformin); person 2: no drug row |


## Exchange standards: HL7 v2 and FHIR

For decades hospitals have exchanged data as **HL7 v2 messages** (ADT for admissions, ORM for orders, ORU for lab results), parsed by an interface engine. **HL7 FHIR** (Fast Healthcare Interoperability Resources) is the modern replacement: discrete **resources** (Patient, Encounter, Observation, Condition, MedicationRequest, DiagnosticReport) served over a REST API, e.g. `GET /fhir/Observation?patient=123&code=loinc|2339-0`, with bulk export for research. FHIR R4 (v4.0.1, 2019) is the production baseline in most countries (it is what US Cures-Act/CMS rules mandate); R5 (v5.0.0) was published in March 2023 as the latest version; **SMART on FHIR** adds OAuth2 app authorization on top (HL7 FHIR specification; SMART App Launch). In practice most hospital integrations still run HL7 v2, with FHIR APIs growing for portals, apps and research feeds.


## Terminologies

Every clinical fact needs a code: diagnoses in ICD-10 (in Korea, KCD, the Korean adaptation) for billing and SNOMED CT for clinical detail, labs in LOINC, drugs in RxNorm or a national drug code. Here one fact matters: two hospitals rarely code the same thing the same way, and some codes are purely local, so somewhere in the pipeline they must be mapped to a shared set.

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

Access is governed: in Korea, the Personal Information Protection Act (PIPA) and the Bioethics and Safety Act (IRB approval for research use of identifiable data, with de-identified data exempted); in the US, HIPAA de-identification (45 CFR §164.514); in the EU, GDPR pseudonymization (Art. 4(5)). CDWs usually release **de-identified** or **pseudonymized** extracts through a data-access committee, never live identified data. Each step of de-identification (date shifting, generalized ages, dropped free text) also removes research value.

## Why a common data model

A CDW solves one hospital's problem: all its data in one place. It does not solve the multi-site problem, because every CDW has its own schema and codes. In the worked example, hospital A keeps diagnoses in a table `dx_list(pat, icd10cm, dx_dt)` with ICD-10-CM codes and drugs under its own formulary codes; hospital B keeps a problem list `diag(patient_no, snomed_id, visit_date)` with SNOMED CT codes and drugs under national product codes. "Type 2 diabetes" is `icd10cm LIKE 'E11%'` at A and a set of SNOMED descendants of 44054006 at B, and the table and column names differ too. A study question has to be rewritten, and revalidated, for each site.

A **common data model** fixes this by agreeing in advance on one schema, and ideally one vocabulary, that every site converts its data into. Each site writes one ETL (extract, transform, load) from its own CDW to the CDM; after that, any analysis written against the CDM runs at every site unchanged. The arithmetic is the whole argument:

| | programs to write for 10 sites and 5 studies |
| --- | --- |
| no CDM: one program per site per study | $10 \times 5 = 50$ |
| with a CDM: one ETL per site, one program per study | $10 + 5 = 15$ |

and every later study costs one program instead of ten. The CDM also makes **distributed** research possible: the analysis code travels to the sites, runs locally, and only aggregate results come back, so patient-level rows never leave the hospital. That is often the only arrangement that privacy law and hospital governance allow.

CDMs differ in how much they standardize. The FDA's Sentinel CDM and the PCORnet CDM fix the tables and fields but keep source codes, ICD or national drug codes, with a field saying which system each code comes from, so an analysis must still list codes for each system (Sentinel and PCORnet CDM specifications). OMOP also standardizes **content**: every source code is mapped to a standard concept, so the query is written once against concepts. That second step is more work in the ETL and loses some detail, but it is what lets a single cohort definition run on data that began as ICD-9-CM, ICD-10-CM, KCD or SNOMED CT. OMOP began as the CDM of the Observational Medical Outcomes Partnership, a public–private drug-safety research project (Overhage et al., 2012), and was shown to work across disparate US claims and EHR databases (Voss et al., 2015); a comparison of several CDMs for a research registry also favored it (Garza et al., 2016).


## OMOP CDM for research

The OMOP CDM is now maintained by OHDSI, the open community that took it over in 2014 (The Book of OHDSI); v5.4 is the version most existing databases run, and OHDSI's documentation lists v5.5 as current as of November 2026. Core tables: `person`, `observation_period`, `visit_occurrence`, `condition_occurrence`, `drug_exposure`, `measurement`, `procedure_occurrence`, plus the vocabulary tables (`concept`, `concept_relationship`, `concept_ancestor` for "descendants of" queries). In the worked example, hospital A's E11.9 rows land in `condition_occurrence` as concept 201826, as would a SNOMED-coded type 2 diabetes from hospital B; hospital B's hypertension for person 3 lands as 320128, and both hospitals' metformin products roll up to the ingredient concept 1503297. Because every site maps to the same concepts, the same cohort SQL runs unchanged at a Korean tertiary hospital, at a US academic center, or in claims data. The conversion is lossy: timestamps, doses and units can be coarsened, and source-to-standard mapping drops or merges codes. The tooling (ATLAS/WebAPI for cohort design, HADES packages for estimation, the Data Quality Dashboard) runs on the CDM (The Book of OHDSI).


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

In a real CDM, drug_exposure rows are coded at clinical-drug level (e.g. metformin 500 mg tablets), so a query starts from the ingredient concept (1503297) and walks `concept_ancestor` down to the clinical drugs. Person 2 has the diagnosis but no drug row, and person 3 has the drug but only a hypertension diagnosis: real CDWs are full of exactly this missingness and mismatch, which is why phenotypes are usually defined with rules (e.g., condition plus drug within 90 days, via `concept_ancestor` descendants), not single codes. And a code reflects billing and care practice rather than ground truth: much of the clinical signal sits in free-text notes, and measurements are missing for reasons tied to the patient's state.

## Sources

- HL7 International, *FHIR specification*. [hl7.org/fhir](https://hl7.org/fhir/)
- HL7 International, *SMART App Launch implementation guide*. [build.fhir.org/ig/HL7/smart-app-launch](https://build.fhir.org/ig/HL7/smart-app-launch/)
- FDA Sentinel Initiative, *Sentinel Common Data Model*. [sentinelinitiative.org](https://www.sentinelinitiative.org/methods-data-tools/sentinel-common-data-model)
- PCORnet, *PCORnet Common Data Model*. [pcornet.org](https://pcornet.org/data/common-data-model/)
- J. M. Overhage, P. B. Ryan, C. G. Reich, A. G. Hartzema et al., "Validation of a common data model for active safety surveillance research", *J. Am. Med. Inform. Assoc.* 19, 54–60 (2012). [doi:10.1136/amiajnl-2011-000376](https://doi.org/10.1136/amiajnl-2011-000376)
- E. A. Voss, R. Makadia, A. Matcho, Q. Ma et al., "Feasibility and utility of applications of the common data model to multiple, disparate observational health databases", *J. Am. Med. Inform. Assoc.* 22, 553–564 (2015). [PubMed 25670757](https://pubmed.ncbi.nlm.nih.gov/25670757/)
- M. Garza, G. Del Fiol, J. Tenenbaum, A. Walden et al., "Evaluating common data models for use with a longitudinal community registry", *J. Biomed. Inform.* 64, 333–341 (2016). [doi:10.1016/j.jbi.2016.10.016](https://doi.org/10.1016/j.jbi.2016.10.016)
- OHDSI, *OMOP Common Data Model* documentation. [ohdsi.github.io/CommonDataModel](https://ohdsi.github.io/CommonDataModel/)
- OHDSI, *The Book of OHDSI*. [ohdsi.github.io/TheBookOfOhdsi](https://ohdsi.github.io/TheBookOfOhdsi/)
