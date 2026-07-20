# Methodology and limitations

## Method

1. Reused the existing FairLend OpenSEO v0.0.28 project and DataForSEO v3 account; no new project or saved-keyword mutation was created.
2. Carried forward the original business contract: GTA focus, 5+ unit preference, end-to-end partner positioning, DrawFlow differentiation, research-only outputs, and proposal-before-mutation rule.
3. Preserved a USD 0.12 external reserve: USD 0.10 account reserve plus USD 0.02 for the first trial's cost-undisclosed retry.
4. Added a tested continuation workstream to the fail-closed budget governor. All paid calls were serialized, reserved in the ledger before dispatch, and reconciled against provider balance.
5. Ran six one-seed keyword-discovery calls: multiplex feasibility, MLI requirements, garden-suite cost, garden-suite permits, construction-financing requirements, and draw schedules.
6. Requested 102 exact higher-funnel long-tails in one metrics batch. The provider returned 29 rows with null search volume; all absent and null values remain unavailable.
7. Ran two competitor calls: the exact long-tail set returned no overlap; a final seven-keyword broad set returned YouTube across all seven inputs.
8. Ran a four-query Toronto SERP batch. It was charged and returned HTTP 200 at OpenSEO, but caller exit 137 occurred before persistence. Its USD 0.052 debit is recorded as `completed-output-lost`; none of its unseen output is used.
9. Split three representative queries into single-query calls. All three persisted 20 SERP elements successfully.
10. Retained only rows matching the agreed business topics and excluded obvious off-market geographies and unrelated industries. The normalization script and raw provider artifacts remain in the governed workspace.
11. Clustered by search task and proposed page type, not by lexical similarity alone. Only three clusters are marked live-SERP-validated.
12. Built requirements and proposal artifacts only. No finished copy, CMS payload, source-code diff, external account update, or publishing action was produced.

## Budget reconciliation

| Item | USD |
|---|---:|
| Starting provider balance | 0.56756 |
| Continuation hard ceiling | 0.44756 |
| Actual continuation spend | 0.44716 |
| Unused ceiling | 0.00040 |
| Ending provider balance | 0.12040 |
| Protected reserve | 0.12000 |

The USD 0.00040 difference remains unspent because no allowlisted paid operation could safely fit beneath it.

## Material limitations

- Discovery metrics use Canada location code 2124. They are not Toronto-only estimates, even when the phrase names Toronto.
- Five discovery calls returned 150 keyword-idea rows and the draw seed returned six suggestion rows. Keyword-ideas fallback contamination was severe; only 45 deduplicated discovery rows survived filtering.
- Exact metrics returned only 29 of 102 requested phrases, and all 29 had null volume. `null` and missing mean unavailable, never zero.
- Close variants are not additive. The package never sums `toronto zoning` with `toronto zoning bylaw`, or singular/plural construction-loan variants, into a market-size claim.
- Difficulty zero is a provider observation, not proof that ranking is easy. Government, institutional, established local, Reddit, and video results can remain difficult despite a zero.
- Only three representative SERPs were persisted. Other cluster boundaries require live SERP validation before content production.
- The four-query output-lost event proves spend, not result content. It is excluded from findings.
- The competitor endpoint is an overlap heuristic, not a complete competitor census. Its empty exact result and one-domain broad result must not be overinterpreted.
- Cost ranges, official rules, incentives, fees, program points, documentation, and lender requirements are time-sensitive. Each brief includes a refresh/review gate.
- No GSC, Bing Webmaster Tools, GA4, CRM, GBP, backlink graph, rank history, or field CWV data was added in this expansion.
- No DrawFlow case files were supplied. The `up to 50%` claim remains unverified and publication-locked.
- Opportunity scores are capped heuristics for sequencing. Unknown metrics receive a small uncertainty allowance, not fabricated demand. Scores are not forecasts.
- Search results are a point-in-time Toronto/English observation from 2026-07-17 and will change.

## Reproduction pointers

- Governed run: `/Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-expansion-2026-07-17/workspace/run/`
- Normalizer: `/Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-expansion-2026-07-17/workspace/normalize-expansion.mjs`
- Prior package: `/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/trial-2026-07-16/deliverables/`
- This package: `/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/expansion-2026-07-17/deliverables/`
