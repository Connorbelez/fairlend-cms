# 07 — Synthesize the cross-workstream keyword and opportunity portfolios

**What to build:** Produce one coherent trial portfolio that merges and normalizes all four research slices, resolves duplicate and overlapping intent, applies hard traffic exclusions, validates page boundaries using SERP/intent overlap, and ranks opportunities independently for qualified lead capture and authority building. Include scenario-based demand and lead-quality estimates without presenting them as promises.

**Blocked by:** 03 — Validate the five-plus-unit multiplex and MLI Select opportunity slice; 04 — Validate the garden and laneway-suite financing opportunity slice; 05 — Validate the DrawFlow and builder-financing opportunity slice; 06 — Validate the B2B partner and referral-demand opportunity slice.

**Status:** ready-for-human

- [x] Duplicate queries and clusters are consolidated without losing source provenance.
- [x] Cross-workstream overlaps are assigned a canonical cluster or explicitly marked as shared support.
- [x] Borrower, builder-customer, and referral-partner intents cannot silently merge.
- [x] Lead Capture and Authority Build scores are independently calculated, explainable, and confidence-labelled.
- [x] High-volume but project-irrelevant traffic is excluded or heavily down-ranked.
- [x] SERP evidence changes or validates at least one proposed page boundary.
- [x] AI/question opportunities remain separate from measured keyword demand.
- [x] The output identifies a ranked trial frontier rather than an unprioritized keyword dump.

## Answer

Normalized the four workstreams into 46 provenance-bearing keyword records and 12 canonical clusters, retaining null metrics, exclusions, shared-support decisions, and explicit persona/trigger boundaries. Lead Capture and Authority Build use the separate eight-component `evidence-null-aware-v1` model: missing metrics contribute zero research-demand points, failed provider SERPs cap evidence-dependent components, excluded/down-ranked traffic receives no opportunity value, and page roll-ups use the three strongest included keyword records. Every component and cap is recorded in `score-rationale.csv` and validator-checked.

The resulting frontier gives five-plus/MLI Select the explicit strategic priority requested by FairLend while retaining builder/DrawFlow as the strongest measured Lead Capture score, followed by combined garden/laneway financing. Suite rental comparison is consolidated into the feasibility resource and partner readiness into `/partners`; neither lexical/support module is granted an unsupported standalone URL. High-volume noise such as mortgage calculators, unrelated garden terms, liens, equipment/auto finance, and consumer renovation traffic remains visible as excluded evidence rather than inflating the opportunity.

One USD 0.014 paid four-query OpenSEO SERP batch failed, followed by one timed-out retry without an explicit cost receipt; its USD 0.02 estimate remains committed. The preserved failures plus `public-search-observed` query-target fallbacks support the dedicated five-plus page, combined garden/laneway page, separate draw guide, and separate partner path without claiming rank/device/location evidence. Five conservative/base/upside scenario records describe demand interpretation, ranking prerequisites, and lead quality while explicitly refusing unsupported numerical traffic or lead forecasts. Evidence: `keyword-universe.csv`, `keyword-clusters.csv`, `score-rationale.csv`, `serp-evidence.csv`, `page-opportunities.csv`, `opportunity-scenarios.csv`, and `executive-strategy.md`.

## Comments

- 2026-07-16: AI questions remain a separate 30-record dataset with `volumeClaimed=false`; no question was assigned synthetic search volume.
- 2026-07-16: Moved to `ready-for-human` after duplicate-ID, reference-integrity, score-arithmetic, vocabulary, and no-copy validation passed.
