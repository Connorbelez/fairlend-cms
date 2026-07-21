# 02 — Prove the budget-governed OpenSEO research path end to end

**What to build:** Run one deliberately minimal Toronto-targeted OpenSEO/DataForSEO tracer that proves connectivity, live keyword evidence, cost prediction/logging, normalization into the approved evidence contracts, and hard-stop behaviour before the four workstreams spend the remaining balance. Allocate non-overlapping workstream envelopes whose maximum total cannot exceed US$0.90.

**Blocked by:** 01 — Establish the read-only research workspace and evidence contracts.

**Status:** ready-for-human

- [x] OpenSEO and its configured live provider are identified and connectivity is verified read-only.
- [x] The available included balance and endpoint charging behaviour are checked before the first paid request.
- [x] One minimal paid request completes from seed to a normalized, provenance-bearing record.
- [x] Estimated and actual/returned cost are logged and cumulative spend is visible.
- [x] Per-workstream ceilings plus reserve total no more than US$0.90.
- [x] Requests fail closed when cost is unknown or a call would exceed its envelope.
- [x] No prohibited site, CMS, source, platform, or external-account mutation occurs.

## Answer

Verified OpenSEO v0.0.28 at commit `8460df1f2947661f07c0d751e855703dd268023f` against its configured live DataForSEO v3 provider and the existing FairLend project. The preflight recorded the sanitized USD 1.00 starting balance, account-specific endpoint prices, Toronto location code `1002451`, Canada location code `2124`, and English market settings before any paid request.

The exact tracer returned no keyword row at USD 0.012; a three-keyword evidence-producing retry returned normalized live metrics at USD 0.01236. A fail-closed governor reserves cost before dispatch, serializes paid calls with a cross-process ledger lock, isolates workstream envelopes, rejects unknown costs, blocks projected overruns, and reconciles estimates against explicit receipts or provider balance deltas. Disclosed trial spend is USD 0.43244. Because the timed-out retry returned no cost receipt and an unchanged immediate balance does not prove zero cost, its USD 0.02 estimate remains committed: total safe commitment is USD 0.45244, leaving USD 0.44756 of uncommitted hard-ceiling headroom and the external USD 0.10 reserve intact.

The canonical ledger preserves the nine actual provider operations one-to-one, including one charged four-query SERP batch; it does not invent per-query costs by splitting batch charges. Evidence: `run-manifest.json`, `research-package.json`, `.scratch/fairlend-openseo-trial/workspace/run/spend-ledger.json`, and the governor/CLI tests.

## Comments

- 2026-07-16: Completed the authorized paid-data path without changing the live site, Payload CMS, application source, Vercel/platform settings, or external-account configuration; authorized provider consumption is recorded separately from prohibited mutations.
- 2026-07-16: Moved to `ready-for-human` after the canonical package validated and all 63 contract/governor/CLI/package-QA tests passed.
