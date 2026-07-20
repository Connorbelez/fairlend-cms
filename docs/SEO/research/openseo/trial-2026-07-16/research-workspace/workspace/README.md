# FairLend OpenSEO trial research workspace

This workspace contains the read-only evidence contracts, fail-closed paid-call runner, live trial records, deterministic package generator, and validation suite for the approved FairLend OpenSEO trial. It keeps every research slice compatible, provenance-bearing, budget-aware, and stopped before content creation or implementation.

Ticket 01 created the scaffold without paid calls. Tickets 02–09 subsequently used OpenSEO's configured DataForSEO provider under the approved USD 0.90 ceiling; the final one-to-one ledger records USD 0.43244 of disclosed spend and USD 0.45244 of safe commitment across nine operations.

Paid calls are serialized across processes with an owner-token ledger lock. Every request reserves its conservative estimate before dispatch. When an immediate balance snapshot is unchanged and the provider returns no explicit cost receipt, `actualCost` stays `null` and the estimate remains committed; zero is recorded only when an explicit receipt confirms zero.

## Public validation seam

Validate a complete research package:

```sh
node .scratch/fairlend-openseo-trial/workspace/validate-research-package.mjs \
  .scratch/fairlend-openseo-trial/workspace/fixtures/valid-research-package.json
```

Run the behavioural contract tests:

```sh
node --test .scratch/fairlend-openseo-trial/workspace/validate-research-package.test.mjs
```

Regenerate and validate the complete dated handoff:

```sh
node .scratch/fairlend-openseo-trial/workspace/build-trial-package.mjs
node .scratch/fairlend-openseo-trial/workspace/validate-research-package.mjs \
  /Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/trial-2026-07-16/deliverables/research-package.json
node --test .scratch/fairlend-openseo-trial/workspace/*.test.mjs
```

The CLI exits `0` only when a package satisfies the scaffold contract. Invalid JSON, duplicate IDs, invalid timestamps/provenance strings, dangling cross-dataset references, invalid dual-score arithmetic, persona-tier/exclusion mismatches, budget/spend drift, unsupported fields, unmarked or promotional brief prose, CMS payloads, implementation diffs, or write authorization return a non-zero exit code with record paths.

## Workspace structure

```text
workspace/
├── README.md
├── budget-governor.mjs
├── budget-governor.test.mjs
├── build-trial-package.mjs
├── build-trial-package.test.mjs
├── contracts/
│   ├── controlled-vocabularies.json
│   ├── dataset-contracts.md
│   └── record-contracts.json
├── fixtures/
│   └── valid-research-package.json
├── source-evidence/
│   ├── live-site-snapshot-2026-07-16.json
│   ├── public-serp-snapshot-2026-07-16.json
│   └── supplied-audit-snapshot-2026-07-14.json
├── run/
│   ├── args/
│   ├── raw/
│   ├── budget-plan.json
│   └── spend-ledger.json
├── openseo-trial-cli.mjs
├── openseo-trial-cli.test.mjs
├── validate-research-package.mjs
└── validate-research-package.test.mjs
```

## Source-observation rules

1. Every decision-bearing record links to at least one declared research source observation.
2. A source observation identifies source type, title, locator, capture time, source-section hint, bounded excerpt, and confidence.
3. Official program facts, live provider estimates, public SERPs, community language, user assertions, supplied audit findings, and fixtures are distinct source types.
4. `fixture-only` records validate shape; they are not market findings and may not be used to justify a page.
5. Missing evidence stays missing. It is never inferred or generated.
6. The DrawFlow up-to-50% savings statement remains `provisional-unverified` until the case files, comparison method, assumptions, limitations, and approval are available.

`sourceObservations` is intentionally lightweight and must not be confused with LLM Wiki's canonical `EvidenceReference`, Source Revision, Source Block, or Citation resolution model.

## Content and mutation boundaries

The only authorized writes are research artifacts inside the approved output boundary plus the explicitly authorized provider consumption recorded in the ledger. A valid package keeps the site, Payload CMS, repository source, and platform settings in `read-only` mode and records an empty prohibited-mutation list. Provider credentials, plan, thresholds, and configuration remain unchanged; balance consumption is audited separately.

Briefs may contain requirements, questions, evidence needs, CTA specifications, internal-link requirements, schema/metadata opportunities, approval requirements, and measures. Every brief string is structurally marked as a requirement, question, or evidence need, and undeclared fields are rejected. Briefs may not contain final marketing copy, final headings presented as approved copy, CMS payloads, implementation diffs, or published content.

## Current source snapshots

The live source snapshot was captured from FairLend's public robots and sitemap endpoints on 2026-07-16. It contains all 17 URLs then advertised by the pages sitemap. The posts sitemap was valid and empty. The apex redirected to the canonical `www` host, and Googlebot, Bingbot, Applebot, and OAI-SearchBot received successful homepage responses.

The supplied audit snapshot preserves point-in-time findings from the 32-page `FairLend-SEO-Audit-2026-07-14.pdf`. The audit's evidence window was July 14, 2026 EDT and its report date was July 15, 2026. Audit findings remain explicitly point-in-time; the live sitemap snapshot supersedes earlier URL-inventory assumptions where they differ.

## Later ticket workflow

Each research ticket must:

1. copy or assemble a package using these contracts;
2. add source observations before adding a decision record;
3. keep paid events inside its allocated envelope;
4. validate the package through the CLI;
5. preserve the requirements-only boundary; and
6. hand its compatible slice to cross-workstream synthesis.
