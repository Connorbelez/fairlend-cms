# M3 implementation plan: publish first-party proof and methodology

Prepared: 2026-07-15  
Scope: `https://www.fairlend.ca/`  
Source baseline: July 15 audit, current CMS/data model, current claims and editorial-review components

Cached inputs reused: `site-meta.json`, `audit-scores.json`, `content-authority-plan.json`, homepage content/geo caches, and `plan.json` from 2026-07-15.

## Outcome

Publish a governed first-party evidence layer that turns retained funded-file records into:

- 3–5 anonymized, compliance-reviewed funded-file case studies;
- one canonical funded-file evidence methodology page;
- one public editorial and corrections policy;
- reproducible aggregate tables/charts covering property/deal type, mortgage position, LTV band, turnaround, and exit outcome;
- a versioned machine-readable aggregate snapshot;
- qualified, date-bounded claims that can be traced to retained evidence and named approvals.

M3 is not a testimonial project. No outcome, volume, speed, experience, or success claim may be published from memory, marketing copy, or an unreviewed spreadsheet.

## Audit requirement

The audit requires:

1. 3–5 anonymized funded-file case studies;
2. methodology for funded volume, LTV bands, review, commitment timing, and data limits;
3. compliance-reviewed aggregate charts/tables by property/deal type, position, LTV band, turnaround, and exit outcome;
4. a correction policy and editorial review cadence;
5. retained-record reproducibility, privacy/compliance review, date bounds, and explicit qualifications.

## Current baseline

- Public proof currently relies heavily on `28+ years` and `$1B+ funded` in `src/lib/fairlend-claims.ts`.
- Those claims are attributed to Principal Broker Elie Soberano’s career and internal funded-file records; they are not yet backed by a public definition, data window, reconciliation record, or correction history.
- Career experience/volume must not be represented as FairLend company production.
- `FairlendEditorialReview` already renders the principal broker, licence numbers, last-reviewed date, methodology text, and primary-source links.
- `MoneyPageProof` already supports case-file, testimony, and verified-outcome variants, but its current fields are too loose for reproducible funded-file evidence.
- Posts already support authors, publication dates, article schema, related posts, and full-width MoneyPage blocks.
- Public author data currently contains only a name; there is no structured reviewer or compliance approval model.
- The public posts sitemap has zero URLs, so publishing the case studies also starts the missing first-party resource corpus.
- No CRM aggregate, funded-file export, or compliance approval packet was available during planning. The implementation must stop rather than fabricate data when those inputs are missing.

## Non-negotiable evidence rules

### 1. Separate person-level and company-level claims

Maintain two namespaces:

| Namespace | Permitted data | Example |
|---|---|---|
| `principal_broker_career` | Retained records attributable to Elie Soberano across his career, with employer/source boundaries documented | `28+ years`, career funded volume if reconciled |
| `fairlend_company` | Files brokered/administered by Fairlend Management Inc. during a defined reporting window | FairLend file mix, LTV bands, turnaround, exit outcomes |

Never combine the two denominators in one chart or label a career claim as “FairLend funded.”

### 2. Keep raw records out of the public repository and CMS

- Source records remain in the approved CRM, mortgage administration system, accounting system, or controlled evidence vault.
- Raw exports, borrower names, addresses, lender names, account numbers, exact dates, and internal file IDs must never enter Git, Payload public fields, analytics, or generated public JSON.
- The repository stores only approved aggregate output, public case-study fields, version metadata, definitions, and a non-sensitive evidence packet reference.
- The compliance evidence vault stores the source export hash, query/workbook version, reconciliation, private file references, approvals, and redaction review.

### 3. Use publication suppression rules

Proposed minimum policy, subject to privacy/compliance approval:

- suppress any aggregate cell with fewer than 10 files;
- suppress secondary cells when totals could reconstruct a suppressed cell;
- report geography no more precisely than an approved municipality group or broad region;
- publish amount and LTV bands, not exact values;
- publish quarter/year or a date range, not exact funding or repayment dates;
- remove borrower, lender, appraiser, lawyer, contractor, and investor identities;
- exclude unusually distinctive files when combined attributes could identify the transaction;
- do not publish client quotes without separate written consent;
- do not publish active litigation, complaint, enforcement, hardship, or vulnerable-client files.

These are FairLend publication controls, not a statement of the legal minimum. The designated privacy/compliance reviewer owns the final threshold.

### 4. Treat every proof asset as regulated public relations material

The website, case studies, charts, tables, methodology, downloadable data, and social excerpts are public relations materials. Apply the following release gate to each asset, not only to the methodology page:

- clearly and prominently identify Fairlend Management Inc. by its FSRA-authorized name and applicable brokerage/administrator licence number;
- when Elie Soberano or another licensee is named, use the licensed name and prescribed licence-class title and identify the sponsoring brokerage;
- prohibit any wording or presentation that is false, misleading, deceptive, or made misleading through omitted qualifications;
- place the data window, denominator, material limitations, and non-representativeness statement beside the claim or visualization; a buried methodology link is insufficient;
- do not imply that FSRA approves, endorses, or has validated FairLend, a case, a methodology, or a result;
- exclude rates, payment amounts, and fee/charge amounts from the initial case-study program by default;
- if a later asset includes a rate, payment, or non-interest charge for a fixed-amount consumer mortgage, require a separate cost-of-borrowing review, APR and term at equal prominence, and a representative example where applicable before release;
- keep borrower-facing brokerage proof and investor-facing administrator/investment content clearly attributed and separated;
- require principal-broker approval of the final public rendering, not merely the underlying spreadsheet;
- retain the approved rendering, substantiation packet, reviewer decision, and publication destinations under FairLend's records-retention policy for at least the applicable statutory period.

These controls operationalize the public-relations requirements in O. Reg. 188/08, the individual identification rules in O. Reg. 187/08, and the cost-of-borrowing advertising trigger in O. Reg. 191/08. The designated compliance reviewer must confirm the current legal requirements at release; this plan is an implementation control, not legal advice.

## Canonical public architecture

### Required URLs

| URL | Purpose | Source system |
|---|---|---|
| `/methodology/funded-file-evidence` | Definitions, inclusion/exclusion rules, calculation logic, privacy controls, limitations, versions, data window | Versioned code + approved snapshot metadata |
| `/editorial-policy` | Author/reviewer roles, source hierarchy, review cadence, conflicts, corrections, changelog policy | Versioned code/CMS content |
| `/data/funded-file-snapshot.json` | Privacy-safe aggregate JSON used by every public chart/table | Generated approved artifact |
| `/posts/private-mortgage-bridge-exit-case-study` | Case study 1, only if a qualifying retained file exists | Payload Post + approved case record |
| `/posts/institutional-decline-alternative-case-study` | Case study 2, only if a qualifying retained file exists | Payload Post + approved case record |
| `/posts/construction-draw-working-capital-case-study` | Case study 3 | Payload Post + approved case record |
| `/posts/multiplex-rental-capital-stack-case-study` | Case study 4 | Payload Post + approved case record |
| `/posts/garden-suite-financing-case-study` | Case study 5 | Payload Post + approved case record |

Slugs are proposed, not permission to invent a file. If no retained record safely supports a theme, substitute a different funded-file theme and document the gap.

### Commercial distribution

| Evidence asset | Embed/link from |
|---|---|
| Private mortgage bridge/exit case | `/borrowers`, `/borrowers/private-mortgage-financing`, `/investing/private-mortgage-lending` |
| Institutional decline/alternative case | `/borrowers`, `/borrowers/institutional-mortgage`, `/borrowers/private-mortgage-financing` |
| Construction draw/working-capital case | `/construction-draw-financing`, `/partners`, `/borrowers` |
| Multiplex/rental capital-stack case | `/multiplex-financing-gta`, `/affordable-sustainable-rental-housing`, `/construction-draw-financing` |
| Garden-suite case | `/garden-suite-financing-gta`, `/garden-suite`, `/construction-draw-financing` |
| Position/LTV/exit aggregates | `/investing/private-mortgage-lending`, `/investing`, `/disclosures` |
| Property/deal-type and turnaround aggregates | `/borrowers`, construction, multiplex, garden-suite financing, affordable-rental pages |
| Methodology and correction policy | Every case study, aggregate module, quantified claim, and editorial-review module |

This distribution must follow the M2 contextual-link rules and count as body content, not footer-only proof.

## Evidence definitions to approve before extraction

The principal broker/data owner and compliance reviewer must approve these definitions in writing before any aggregate is calculated.

### Funded volume

Publish separate metrics rather than one ambiguous total:

- `initial_principal_advanced`: cash principal advanced at initial funding;
- `subsequent_draw_principal`: later construction or facility advances, counted once when disbursed;
- `total_cash_principal_advanced`: initial principal plus unique subsequent draws;
- `gross_originated_principal`: use only if separately defined and reconciled.

Exclude:

- unfunded approvals or commitments;
- fees, interest, legal costs, and non-principal charges;
- duplicate syndicate/participant shares of the same loan-level principal;
- renewals/extensions with no new principal from new-money volume;
- cancelled and declined files.

If historical records cannot support those distinctions, do not publish `$1B+` until a defensible alternate definition and reconciliation are approved.

### LTV

Store and label the calculation event and denominator:

- combined secured debt at funding ÷ approved property value at funding;
- identify whether value is appraised value, purchase price, or the lower of the two;
- separate as-is LTV from completed/as-complete LTV for construction files;
- publish approved bands, recommended initially as `<50%`, `50–59%`, `60–69%`, `70–79%`, and `80%+`;
- never combine incompatible LTV bases without a visible qualification.

### Review and commitment timing

Report calendar days with explicit clocks:

- `initial_response_days`: first complete inquiry to first substantive response;
- `complete_file_to_decision_days`: complete minimum package to written decision;
- `complete_file_to_commitment_days`: complete minimum package to issued commitment;
- `commitment_to_funding_days`: accepted commitment to funding.

Define the minimum complete package. Track borrower-, third-party-, and lender-controlled pauses separately. Do not market an all-in speed claim using only the fastest clock.

### Position

Use mutually exclusive reporting categories:

- first mortgage;
- second mortgage;
- third-or-subsequent mortgage;
- blended/refinance structure;
- unclassified/suppressed.

### Exit outcome

Use a defined observation cutoff and eligible denominator. Suggested categories:

- repaid as scheduled;
- refinanced or sold;
- renewed or extended;
- active and performing at cutoff;
- enforcement/recovery process;
- loss realized;
- unknown/insufficient follow-up.

Do not calculate an exit-success rate by excluding unresolved, active, or missing files. Publish the denominator and observation window beside every outcome percentage.

## Approved aggregate outputs

All public visuals must read from the same generated snapshot.

| Output | Metric | Required context |
|---|---|---|
| File composition table | file count and share by property/deal type | data window, denominator, suppressed cells |
| Position × LTV table | file count by mortgage position and LTV band | LTV basis, denominator, suppressed cells |
| Turnaround distribution | median, 25th/75th percentile, and sample size by deal type | clock definition, pause treatment, data window |
| Exit outcome table | count/share by outcome | observation cutoff, eligible denominator, unknowns |
| Funded-principal summary | approved principal metric by reporting period | definition, reconciliation date, career/company namespace |

Prefer accessible HTML tables. Charts are optional visual summaries and must repeat the denominator, data-through date, and qualification in text. Do not use decorative charts without the underlying table.

## Case-study data contract

Each published case must contain the same fields:

| Field | Public rule |
|---|---|
| Public case reference | Non-sequential, non-source-system ID such as `FL-CS-A7K2` |
| Data/outcome cutoff | Month/quarter or broad date range |
| Starting constraint | Plain-language borrower/project problem, stripped of identifiers |
| Property/deal type | Approved category only |
| Geography | Broad region approved by privacy review |
| Mortgage position | Approved category |
| Principal amount | Approved amount band only |
| LTV | Approved band and basis |
| Funding structure | Explain first/second/draw/bridge structure without naming counterparties |
| Evidence reviewed | General categories: appraisal, budget, permits, income, exit documents |
| Decision point | Why the structure fit or what had to change |
| Timeline | Approved band using a named timing clock |
| Draw/recovery decision | Relevant stage decision, if applicable |
| Exit plan | Planned repayment/refinance/sale path |
| Observed outcome | Factual status at the stated cutoff, including unresolved status |
| Limitations | “One anonymized file; not representative; availability and outcomes vary” plus case-specific limits |
| Review | author, principal-broker reviewer, privacy/compliance reviewer role, approval date, next review date |
| Methodology | Link to methodology version and correction policy |
| Regulatory attribution | Authorized brokerage/administrator name and applicable licence number; licensed name/title where an individual is named |
| Claim qualification | Proximate denominator, data window, non-representativeness statement, and case-specific material limits |
| Cost-of-borrowing fields | Omitted by default; any rate, payment, or fee field requires a separately approved APR/term disclosure payload |

Every public value maps to a private evidence-packet field. Free-form marketing metrics are prohibited.

## Case-study selection plan

Select up to five files after data reconciliation:

1. **Private mortgage bridge and exit:** a funded file where the starting constraint and exit strategy are documented.
2. **Institutional decline or mismatch to an alternative:** a funded file showing policy-fit reasoning without implying that private financing is always the answer.
3. **Construction draw and working-capital sequencing:** a funded project with retained draw evidence, verifier steps, and an observable outcome.
4. **Multiplex or affordable-rental capital stack:** a funded low-rise/missing-middle file with a documented capital-stack decision.
5. **Garden-suite financing:** a funded file with permits/budget/equity/draw constraints and sufficient anonymity.

The investor page should present an investor/administrator lens on one approved borrower case and aggregate position/LTV/outcome data. Do not duplicate one source file into two “separate” case counts.

Selection gates:

- file funded and retained evidence complete;
- public outcome can be stated as of a defined cutoff;
- no active dispute, complaint, litigation, enforcement sensitivity, or privacy concern;
- no distinctive combination likely to re-identify the transaction;
- statements reconcile to source records;
- principal broker, privacy/compliance reviewer, and editorial owner approve publication.

## Evidence manifest and generation pipeline

### Versioned public manifest

Add `src/data/evidence/public-claim-registry.ts`:

```ts
type PublicEvidenceClaim = {
  id: string
  namespace: 'principal_broker_career' | 'fairlend_company'
  publicText: string
  definition: string
  dataFrom: string
  dataThrough: string
  methodologyVersion: string
  snapshotVersion?: string
  evidencePacketRef: string
  sourceArtifactHash: string
  reviewedBy: string
  complianceReviewedByRole: string
  approvedAt: string
  nextReviewAt: string
  status: 'approved' | 'expired' | 'withdrawn'
  limitations: readonly string[]
}
```

The public manifest contains no raw file IDs. `evidencePacketRef` is a non-sensitive lookup key into the controlled evidence vault.

### Private evidence packet

For every claim/snapshot/case, retain outside Git:

- owner and purpose;
- source-system names;
- extraction query or workbook version;
- export timestamp and SHA-256 hash;
- included/excluded record counts;
- reconciliation to source totals;
- field definitions;
- suppression/anonymization report;
- private source-file references;
- principal-broker approval;
- privacy/compliance approval;
- publication version and destinations;
- correction history.

Retain the approved public rendering and public-relations review checklist with the packet so the evidence proves not only the source number but also exactly what consumers saw. Mortgage-transaction records must remain retrievable for the period required by O. Reg. 188/08 s. 48 or O. Reg. 189/08 s. 31, as applicable; the records owner must document the controlling trigger and destruction date rather than applying a generic upload-date calculation.

### Public-relations approval record

Add the following release fields to every case, aggregate snapshot, and quantified claim:

```ts
type PublicRelationsApproval = {
  authorizedEntityName: string
  entityRole: 'mortgage_brokerage' | 'mortgage_administrator' | 'both'
  brokerageLicenceNumber?: string
  administratorLicenceNumber?: string
  namedLicensees: readonly {
    licensedName: string
    prescribedTitle: string
  }[]
  costOfBorrowingTrigger: 'none' | 'rate' | 'payment' | 'non_interest_charge'
  aprDisclosurePacketRef?: string
  principalBrokerApprovedBy: string
  principalBrokerApprovedAt: string
  complianceApprovedByRole: string
  complianceApprovedAt: string
  approvedRenderingHash: string
  approvedDestinations: readonly string[]
}
```

The publishing layer must reject `costOfBorrowingTrigger !== 'none'` unless a current, approved disclosure packet is present. Do not label an asset “compliance approved” publicly unless the approval fields are complete and the retained packet supports that wording.

### Generator

Add `scripts/evidence/build-funded-file-snapshot.mjs`:

1. read a controlled normalized export path supplied by environment variable;
2. validate required fields and allowed enums;
3. calculate metrics using a versioned methodology config;
4. apply primary and secondary suppression;
5. reject direct identifiers and over-precise fields;
6. emit the public aggregate JSON and public case-study payloads;
7. emit a private reconciliation/approval draft into the controlled evidence workspace, not Git;
8. produce deterministic hashes for the approved inputs and outputs.

Only synthetic fixtures may be committed for tests.

## Reuse and extension plan

### `FairlendEditorialReview`

Extend `src/components/SEO/FairlendEditorialReview.tsx`; do not create a duplicate review card.

Add:

- `datePublished` and `dataThrough`;
- `methodologyHref` and version;
- `correctionPolicyHref`;
- author and reviewer safe public fields;
- optional compliance-review role/date;
- evidence claim IDs used on the page.

The component must distinguish “editorially reviewed” from “data/compliance reviewed.”

### `MoneyPageProof`

Extend the existing `caseFile` variant in:

- `src/blocks/MoneyPage/config.ts`
- `src/blocks/MoneyPage/types.ts`
- `src/blocks/MoneyPage/Component.tsx`

Add the structured case-study contract, methodology version, data cutoff, limitations, and approved evidence claim IDs. Keep the testimony variant separate; an anonymized case is not a testimonial.

### Posts and reviewers

Extend `src/collections/Posts/index.ts` and `populateAuthors.ts`:

- content type: `article`, `caseStudy`, `methodology`, `policy`;
- principal-broker reviewer relationship;
- privacy/compliance reviewer role and approval date;
- methodology/snapshot version;
- next review date;
- correction status and correction log;
- safe public author/reviewer fields beyond name.

Do not expose authentication, email, or other private User fields.

### Claims registry

Refactor `src/lib/fairlend-claims.ts` to resolve visible claims from the approved public registry. If `$1B+ funded` or `28+ years` lacks a current approved entry, the claim must not render.

## Methodology page specification

`/methodology/funded-file-evidence` must include:

1. purpose and reporting scope;
2. distinction between Principal Broker career evidence and FairLend company evidence;
3. source systems and retained-record statement;
4. data window and snapshot version;
5. inclusion/exclusion rules;
6. funded-principal definitions and double-count controls;
7. LTV basis and bands;
8. review/decision/commitment/funding timing clocks;
9. property/deal and mortgage-position taxonomies;
10. exit-outcome definitions and observation window;
11. missing-data handling;
12. privacy, anonymization, and cell-suppression policy;
13. aggregate tables and accessible chart summaries;
14. known limitations and non-representativeness;
15. reviewer/approval dates;
16. version history and links to correction policy and machine-readable snapshot.

## Editorial and correction policy specification

`/editorial-policy` must define:

- source hierarchy: retained records, regulators/government, primary program documents, then clearly labelled secondary sources;
- author, subject-matter reviewer, privacy/compliance reviewer, and publisher responsibilities;
- conflicts and commercial-interest disclosure;
- publication and material-update dates;
- quarterly review for aggregate evidence/methodology;
- six-month review for case studies and financial decision pages;
- event-triggered review after material regulatory, program, data-definition, or source-system changes;
- public correction intake through a dedicated contact intent;
- acknowledgement target of five business days;
- verified material correction target of ten business days;
- visible correction log for changes to numbers, definitions, outcomes, or conclusions;
- withdrawal behavior when a claim can no longer be reproduced.
- escalation of any correction alleging misleading mortgage-business content into FairLend's formal complaints process, with the written complaint and response retained separately from the public correction log;
- prohibition on calling a regulatory licence disclosure “FSRA approved” or otherwise implying regulator endorsement.

No silent edits to quantified proof. Minor grammar/style edits may update `dateModified` without a correction entry; material evidence changes require one.

## Work packages

### W0 — Definitions, ownership, and evidence access

Owners:

- Data owner/final subject-matter approval: Principal Broker / Mortgage Administrator
- Public-relations approval and supervision: Principal Broker
- Extraction and reconciliation: designated operations/data owner
- Privacy/compliance approval: designated internal reviewer or external counsel
- Editorial owner: named author/editor
- Engineering owner: CMS/data pipeline implementation

Tasks:

1. approve namespaces and metric definitions;
2. identify source systems and record retention locations;
3. assign privacy/compliance reviewer;
4. approve suppression and case-selection rules;
5. create controlled evidence-vault structure;
6. decide whether current `$1B+` and `28+ years` claims remain visible during verification.
7. approve the public-relations checklist, authorized entity naming, licence attribution, and cost-of-borrowing exclusion policy.

Gate: no extraction or publication begins without named owners and written definitions.

### W1 — Reconcile claims and build the approved dataset

Tasks:

1. export normalized funded-file, draw, commitment, and outcome records;
2. deduplicate files, syndicate shares, renewals, and draws per approved definitions;
3. reconcile totals to accounting/administration records;
4. quantify missing fields and coverage by year;
5. test whether each aggregate meets suppression thresholds;
6. approve or withdraw the existing public claims;
7. create evidence packets and hashes.

Gate: every public number is reproducible from a retained export and approved calculation.

### W2 — Implement evidence infrastructure

Files:

- `src/data/evidence/public-claim-registry.ts`
- `src/data/evidence/funded-file-snapshot.v1.json`
- `scripts/evidence/build-funded-file-snapshot.mjs`
- `scripts/evidence/validate-public-evidence.mjs`
- synthetic fixtures under `tests/fixtures/evidence/`
- `.gitignore` rules for every raw/private evidence path
- `/data/funded-file-snapshot.json` route

Gate:

- deterministic output from synthetic fixtures;
- no direct identifiers in public output;
- suppressed cells cannot be reconstructed;
- source/output hashes are recorded;
- raw-data paths are ignored and absent from Git history.
- public output includes the authorized entity/licence attribution required for its destination.

### W3 — Extend the existing CMS proof/review model

Tasks:

1. extend `FairlendEditorialReview`;
2. extend `MoneyPageProof.caseFile`;
3. add post content/reviewer/version/correction fields;
4. generate Payload types and migration;
5. add server-rendered methodology, limitations, and correction links;
6. preserve current visual variants for existing call sites.

Gate: existing pages do not regress and new proof cannot publish without required review metadata.

### W4 — Publish methodology, policy, and 3–5 case studies

Order:

1. methodology page;
2. editorial/correction policy;
3. aggregate snapshot and tables;
4. construction case;
5. private mortgage case;
6. multiplex/rental case;
7. institutional-alternative case if supported;
8. garden-suite case if supported.

Gate: at least three and no more than five case studies are live, each with an approved evidence packet, visible and proximate qualifications, data cutoff, reviewers, methodology version, correction link, authorized entity/licence attribution, approved rendering hash, and principal-broker public-relations approval. The initial release contains no rate, payment, or fee representations unless the separate APR/term disclosure gate is satisfied.

### W5 — Distribute proof across commercial pages

Tasks:

- query/render approved case summaries by commercial theme;
- render only relevant aggregate slices;
- link every proof statement to methodology and policy;
- link cases back to commercial pillars and siblings per M2;
- replace unsupported generic proof text with approved claims or qualitative copy.

Gate: no commercial page contains an orphaned number or case claim outside the public registry.

### W6 — Production verification and evidence baseline

Add `pnpm seo:evidence` to verify:

- every visible quantified claim exists and is `approved`;
- approval and next-review dates are current;
- all case fields satisfy the public schema;
- every public case has an evidence packet reference and matching approved output hash;
- aggregate cells meet suppression rules;
- all charts/tables use the approved snapshot;
- methodology/policy links resolve directly with 200 status;
- case studies have canonical metadata, Article/BlogPosting schema, author, reviewer, dates, and internal links;
- no raw/private evidence file is tracked.
- authorized entity/licence attribution is present on every rendered public asset;
- named licensees use their licensed names and prescribed titles;
- no asset implies FSRA approval or endorsement;
- rate/payment/fee trigger fields fail closed without an approved APR/term disclosure packet;
- the deployed rendering hash matches the principal-broker-approved rendering.

Store the production evidence baseline in `.seo-cache/content-authority-plan.json` and `.seo-cache/drift.json`.

## Review cadence

| Asset | Scheduled review | Triggered review |
|---|---|---|
| Aggregate snapshot | Quarterly when sufficient new records exist | Source-system, definition, reconciliation, or privacy-rule change |
| Funded-file methodology | Quarterly | Any metric/taxonomy/suppression change |
| Case studies | Every six months | Outcome change, correction, complaint, privacy concern, or source-record conflict |
| Career/company claims | Quarterly | New reporting window, reconciliation issue, or attribution change |
| Commercial financial guidance | Every six months | Material FSRA, CMHC, lender/program, or legal-source change |
| Editorial policy | Annually | Workflow, ownership, correction-SLA, or source-hierarchy change |

Expired evidence automatically stops rendering until re-approved.

## Final acceptance gates

M3 is complete only when all are true:

- 3–5 funded-file case studies are publicly indexable;
- the methodology and editorial-policy pages are public and linked from every proof asset;
- aggregate tables cover property/deal type, position, LTV, turnaround, and exit outcome, or visibly disclose why a category is suppressed/unavailable;
- each number is reproducible from retained records and an approved evidence packet;
- every asset displays data window, last reviewed date, reviewer, methodology version, limitations, and correction path;
- privacy/compliance approval is retained for every case and aggregate release;
- principal-broker public-relations approval, the approved rendering, and publication destinations are retained for every release;
- career claims and FairLend company metrics are never conflated;
- current `$1B+` and `28+ years` claims are either approved through the registry or removed from rendering;
- no small-cell, direct-identifier, exact-address, or exact-date leakage exists;
- authorized entity/licence attribution is clear and prominent, named licensees use licensed names/prescribed titles, and no regulator endorsement is implied;
- the initial release contains no rate, payment, or fee representation unless the applicable APR/term and representative-example review has passed;
- the production evidence audit passes and the accepted baseline is stored.

## Delivery sequence and estimated elapsed time

| Stage | Typical elapsed time | Primary dependency |
|---|---:|---|
| W0 definitions/owners | 3–5 business days | Principal broker and compliance availability |
| W1 extraction/reconciliation | 5–10 business days | Source-system access and record quality |
| W2–W3 engineering/CMS | 5–7 business days | Approved definitions |
| W4 editorial/privacy review | 7–10 business days | Qualifying retained files and approvals |
| W5–W6 distribution/QA | 3–5 business days | Published approved assets |

Expected completion: approximately 4–6 weeks. Data quality or compliance review—not engineering—is the critical path.

## Definition of done

M3 is done when FairLend can answer “Where did this number or outcome come from?” for every public proof statement with a retained evidence packet, an approved reproducible calculation, a visible qualification, and a public correction path.
