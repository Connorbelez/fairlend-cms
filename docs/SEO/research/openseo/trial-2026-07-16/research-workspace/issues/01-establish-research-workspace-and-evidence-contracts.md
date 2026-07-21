# 01 — Establish the read-only research workspace and evidence contracts

**What to build:** Create a verifiable research-package scaffold that converts the approved contract, current FairLend site inventory, and supplied audit into normalized research contracts before paid research begins. The result must define compatible keyword, cluster, SERP, competitor, page-opportunity, AI-question, source-observation, claim, brief, spend, and run-manifest records and prove the no-copy/no-mutation boundaries with representative fixtures.

**Blocked by:** None — can start immediately.

**Status:** ready-for-human

- [x] The current canonical URL inventory and audit findings are represented as dated source evidence rather than assumed facts.
- [x] Every required dataset has a documented schema, stable identifiers, provenance fields, confidence fields, and validation rules.
- [x] Funnel, lifecycle, persona, geography, dual-score, exclusion, and claim-status vocabularies match the approved contract.
- [x] A deterministic validation check rejects final marketing prose, missing provenance, invalid score totals, and prohibited mutation states.
- [x] A representative fixture passes validation without consuming paid-data budget.
- [x] The live site, Payload CMS, repository source, platform settings, and external accounts remain untouched.

## Answer

Implemented a self-contained, read-only research workspace with documented dataset contracts, declarative record contracts, controlled vocabularies, a requirements-only fixture spanning every record type, and a dependency-free CLI validator. The validator fails closed on duplicate or unstable IDs, dangling cross-dataset references, missing source observations, null/invalid timestamps, incorrect or unapproved score components, out-of-range page scores, arbitrary personas, incoherent traffic exclusions, undeclared fields, unmarked brief prose, prohibited copy/implementation fields, write authorization, and missing required fields.

The trial uses lightweight `sourceObservations` rather than the repository's canonical `EvidenceReference` domain object. This avoids claiming Source Revision, Source Block, Section Locator, Citation reanchoring, or resolution-state semantics that the research transport does not implement.

Captured two dated source inputs without paid SEO calls: a 17-URL live sitemap/robots/crawler snapshot and page-anchored findings from the supplied 32-page SEO audit. Fixture records are explicitly labelled `fixture-only`; the DrawFlow up-to-50% claim remains `provisional-unverified`.

Verification:

- Package validator: pass.
- Source snapshot integrity: 17 sitemap-advertised URL records and 8 audit findings.
- Contract tests: 25/25 pass.
- Repository typecheck: pass.
- Full deterministic repository suite: 2,607 pass; one unrelated pre-existing failure in the dirty Project OS worktree (`logical-board-surface.dom.test.tsx`, standalone text lookup for “Marketing Site”).
- Paid OpenSEO/DataForSEO spend: USD 0.00.

## Comments

- 2026-07-16: Claimed as the current frontier after the user approved the nine-ticket dependency graph.
- 2026-07-16: Implementation completed without starting Ticket 02 or making any site, CMS, platform, external-account, or application-source mutation; moved to `ready-for-human` under the repository's canonical tracker labels.
- 2026-07-16: Standards/specification review corrected canonical provenance and Citation Anchor naming collisions, unsupported sitemap-derived HTTP/indexability/canonical claims, incomplete/cross-wired persona and exclusion contracts, missing referential-integrity and strict timestamp checks, page-opportunity funnel/qualification omissions, run-manifest budget/spend gaps, score validation gaps, and the bypassable no-copy gate.
