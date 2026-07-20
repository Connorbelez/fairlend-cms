# Traffic-prioritized five-layer funnel — 2026-07-20

This package enhances the existing FairLend keyword research without overwriting its historical evidence. It merges the highest qualified traffic terms from the July 16–17 OpenSEO datasets into the five-layer borrower funnel, preserves unknown volume as unknown, filters false-positive traffic, and assigns every retained keyword to one canonical URL.

## Start here

1. [`five-layer-funnel-report.md`](five-layer-funnel-report.md) — audit findings, qualified traffic opportunities, five-layer strategy, canonical architecture, and 90-day plan.
2. [`traffic-prioritized-keyword-universe.csv`](traffic-prioritized-keyword-universe.csv) — 85 keyword records with evidence and page assignments.
3. [`page-cluster-map.csv`](page-cluster-map.csv) — 12 canonical page clusters and cannibalization boundaries.
4. [`coverage-qa.csv`](coverage-qa.csv) — validation results.
5. [`research-summary.json`](research-summary.json) — machine-readable package summary.

## Layer definitions

| Layer | Name | Searcher job |
|---|---|---|
| L1 | Awareness and education | Understand the concept and local applicability |
| L2 | Project feasibility | Test property, budget, equity, income, and program fit |
| L3 | Planning and comparison | Compare structures, costs, timelines, and risks |
| L4 | Financing qualification | Select a lender path, verify requirements, and apply |
| L5 | Immediate transaction problem | Resolve a decline, stopped draw, shortfall, or deadline |

## Evidence contract

- `live` and `numeric-discovery-metric` values are dated snapshots, not guaranteed current volumes.
- `unavailable`, `unavailable-not-zero`, `exact-request-returned-no-row`, and `exact-row-returned-volume-unavailable` mean the value is unknown.
- Municipal and CMHC head terms are marked `authority-support` where FairLend should interpret primary sources rather than try to replace them.
- `ambiguous-secondary` means the phrase can support topical relevance but must not be the primary title target.
- Keyword volumes for synonyms must not be summed without deduplication and a fresh provider export.

