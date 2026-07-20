# Methodology and limitations

## Scope resolution

The current home page was traced through `src/app/(home)/page.tsx`, `FairlendLandingOverviewSection`, `FairlendRouteSelector/route-data.tsx`, and `FairlendBuilderConsultingSection`. The ten catalog items were combined with route-only offers and the dedicated consulting section, then deduplicated to 16 service lanes.

## Source hierarchy

1. **Authenticated first-party evidence:** Search Console query/page tables and GA4 traffic/linked-search reports.
2. **Observed demand discovery:** Answer Socrates Canada/English results and People Also Ask expansion.
3. **Live SERP validation:** representative results for each service; page-type observations are directional snapshots.
4. **Historical repository metrics:** exact-query metrics from the July 16–17 OpenSEO research package.
5. **Curated semantic expansion:** service language from the landing page, financing triggers, personas, and observed SERP terminology.

No query received a numerical volume, CPC, competition, or difficulty value unless an exact historical observation existed. Missing values are labeled `unavailable-not-zero`.

## Five-layer assignment

The package reuses the exact taxonomy defined in the earlier repository contract:

- `awareness-education`
- `project-feasibility`
- `planning-comparison`
- `financing-qualification`
- `immediate-transaction-problem`

Each service contains two keywords per stage. The assignment is based on the decision the searcher is trying to make, not superficial wording.

## Scoring rubric

Scores are prioritization aids, not traffic or lead forecasts.

| Stage | Lead-capture base | Authority-build base |
|---|---:|---:|
| awareness-education | 20 | 92 |
| project-feasibility | 38 | 80 |
| planning-comparison | 55 | 68 |
| financing-qualification | 78 | 48 |
| immediate-transaction-problem | 94 | 30 |

Validation adjustments:

- +4 when an exact or normalized first-party GSC observation exists.
- +3 when the phrase was observed in Answer Socrates.
- +3 when an exact historical metric exists.
- Representative SERP validation is required for every service but does not inflate the score because it is a service-level, not query-level, observation.
- Scores are capped at 100.

## Relevance filtering

The Answer Socrates export contained many off-intent terms: jobs, foundations, finder's fees, unrelated brands, generic listings, city names, and malformed alphabet-expansion phrases. Those were excluded. Retained discovery concepts include Ontario construction financing, Canadian bridge financing, Ontario renovation financing, residential-property mortgages, home financing, and local financing modifiers.

Brand misspellings and unrelated GSC queries remain in `first-party-evidence.csv` for auditability but are not promoted into the keyword universe.

## Clustering and cannibalization rules

- One canonical service lane owns each retained query.
- Cross-service comparison phrases are assigned to the service that should host the comparison and link to the alternate product.
- Private borrowing and private investing are separated by audience and CTA.
- Rental acquisition and rental refinancing are separated by transaction state.
- Construction financing, multiplex, garden suite, and MLI Select overlap operationally but remain distinct: the canonical page is chosen by the searcher's named project/product entity.
- Broad residential intent should link downward rather than compete with specialized service pages.

A full pairwise SERP-overlap export was not possible without a paid SERP dataset. Clusters are therefore `directional-with-representative-serp-validation`, not statistically proven by URL-overlap percentages.

## Limitations

- GSC coverage is only four visible reporting days; no significance testing is appropriate.
- GA4 has 14 sessions and zero key events.
- Answer Socrates free access allowed one broad seed; service-level question breadth is supplemented with explicitly labeled templated questions.
- Answer Socrates metrics, CSV export, and clustering were paywalled.
- Google Ads Keyword Planner required campaign/payment onboarding; no external account mutation was made.
- Historical keyword estimates are Canada-level and dated July 16–17, not Toronto-only and not refreshed.
- Live SERPs can vary by location, device, personalization, and time.
- Regulatory/program content must be checked against current CMHC, FSRA, municipal, and lender documentation before publication.

