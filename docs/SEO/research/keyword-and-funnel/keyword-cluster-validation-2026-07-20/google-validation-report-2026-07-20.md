# Google validation of FairLend keyword and cluster architecture

**Validated:** 2026-07-20T05:51:11Z  
**Domain:** fairlend.ca  
**Authenticated Google account:** `c.beleznay@humanfeedback.com`  
**Search Console property:** `sc-domain:fairlend.ca`  
**GA4 property:** `fairlend-root` — property 502729166  
**Scope:** 160 retained keywords, 32 page-level clusters, 16 services  
**Credential path:** Local Google API config absent; authenticated Google consoles used read-only

## Verdict

The architecture is strategically coherent, but Google first-party data validates only a small part of it.

| Validation class | Clusters | Meaning |
|---|---:|---|
| Validated, low sample | 2 | Topic and current page owner have direct Google evidence. |
| Partial page signal | 3 | The live page is visible, but query ownership or content fit is not proven. |
| Topic signal, target unproven | 3 | Google sees the topic, but the proposed target is absent or another page currently owns it. |
| Rework boundary | 1 | The proposed page split conflicts with observed Google ownership. |
| Historical only | 2 | Prior metric evidence exists, but FairLend has no first-party Google signal. |
| Directional, no Google signal | 21 | Retain as roadmap research, not validated demand. |

Only **2 of 32 clusters are directly validated**, and both are low-sample:

1. Construction financing qualification/rescue.
2. Private-mortgage investing qualification/rescue.

Three live pages have useful partial validation: `/garden-suite`, `/borrowers/private-mortgage-financing`, and `/partners`.

The strongest correction is the garden-suite boundary: Google currently recognizes `/garden-suite`; the separate `/garden-suite-financing-gta` URL has no observed signal. The two-page split should be held until independent query demand appears, or consolidated.

## Fresh Google Search Console evidence

The direct Search Console report remains unchanged from the prior capture:

- 2 clicks
- 67 impressions
- 3% CTR
- Average position 31.2
- 23 visible queries
- Last update: 3 hours ago
- Three-month UI filter, but the young property exposes only the initial reporting days

### Relevant query families

| Query | Clicks | Impressions | CTR | Position | Cluster implication |
|---|---:|---:|---:|---:|---|
| construction loan draw schedule | 0 | 3 | 0% | 91.3 | Exact construction topic validation; existing service page owns it today. |
| private mortgage fund | 0 | 2 | 0% | 84.5 | Private-investing topic validation. |
| private mortgage investment | 0 | 1 | 0% | 47.0 | Best non-brand investing position. |
| invest in private mortgages | 0 | 1 | 0% | 53.0 | Supports investor transactional language. |
| private mortgage investing | 0 | 1 | 0% | 90.0 | Supports investor entity coverage. |
| fair market value appraisal for private lending | 0 | 2 | 0% | 96.5 | Supports appraisal/cost depth for the borrower cluster. |

Everything else is brand, misspelling, unrelated entity, or off-strategy noise and remains excluded.

### Page evidence

| Page | Clicks | Impressions | CTR | Position | Decision |
|---|---:|---:|---:|---:|---|
| `https://www.fairlend.ca/` | 2 | 32 | 6.3% | 10.0 | Keep as a routing hub. |
| `https://fairlend.ca/` | 0 | 21 | 0% | 40.8 | Monitor host canonical normalization. |
| `/borrowers/private-mortgage-financing` | 0 | 14 | 0% | 10.1 | Update title/meta and deepen appraisal, costs, qualification, and exits. |
| `/investing/private-mortgage-lending` | 0 | 14 | 0% | 39.4 | Expand risk, structure, and opportunity passages. |
| `/garden-suite` | 0 | 13 | 0% | 2.9 | Highest-priority CTR/snippet correction. |
| `/disclosures` | 0 | 11 | 0% | 2.4 | Non-commercial; do not let it distort cluster prioritization. |
| `/partners` | 0 | 5 | 0% | 5.4 | Good visibility, weak engagement evidence. |
| `/construction-draw-financing` | 0 | 3 | 0% | 91.3 | Topic validated, authority insufficient. |
| `/investing` | 0 | 1 | 0% | 1.0 | Too little data to interpret. |

No query→multiple-page split is exposed by the authenticated UI, and the API credential tier is unavailable. Cannibalization remains preventive rather than empirically proven.

## Fresh GA4 evidence

The rolling window advanced from June 21–July 18 to **June 22–July 19**, so changes below are directional and not same-period growth claims.

### Traffic acquisition

| Channel | Sessions | Engaged sessions | Engagement rate | Average engagement | Events | Key events |
|---|---:|---:|---:|---:|---:|---:|
| Total | 18 | 14 | 77.78% | 37s | 105 | 0 |
| Organic Search | 3 | 2 | 66.67% | 1m 17s | 23 | 0 |
| Direct | 5 | 5 | 100% | 1m 05s | 39 | 0 |
| Unassigned | 7 | 5 | 71.43% | 16s | 33 | 0 |
| Referral | 3 | 2 | 66.67% | 0s | 10 | 0 |

Compared with the prior rolling snapshot, Organic Search moved from 2 to 3 sessions, 1 to 2 engaged sessions, 3 seconds to 1m17s average engagement, and 8 to 23 events. That is encouraging but driven by tiny counts.

### Landing pages

| Landing page | Sessions | Active users | Average engagement | Key events |
|---|---:|---:|---:|---:|
| `/` | 12 | 5 | 35s | 0 |
| `(not set)` | 3 | 1 | 0s | 0 |
| `/contact` | 1 | 1 | 13s | 0 |
| `/investing/private-mortgage-lending` | 1 | 1 | 3m 47s | 0 |
| `/partners` | 1 | 1 | 3s | 0 |

The investor page is the only specialty landing page with meaningful engagement in the current window. It supports maintaining Private Mortgage Investing as P0. The Partners session confirms a visit, not content success.

### Linked Search Console report

- 2 clicks
- 114 impressions
- 1.75% CTR
- Average position 19.61
- 4 active users
- 8 engaged sessions
- 80% engagement rate
- 1m27s average engagement per active user
- 61 events
- 0 key events

The linked report differs from direct Search Console because of date range, anonymization, and reporting thresholds. Direct GSC remains authoritative for query/page totals; GA4 is used for post-click behavior.

## Revised execution decisions

### Ship or update now

- `/borrowers/private-mortgage-financing`
- `/construction-draw-financing`
- `/investing/private-mortgage-lending`
- `/garden-suite` title/meta and search-promise work
- `/partners` snippet and referral-intent clarification

### Create with a strict boundary

- `/resources/construction-loan-draw-schedule`: draw mechanics, milestones, inspections, cash gaps.
- `/resources/private-mortgage-investing-ontario`: education, structures, risks, due diligence.

### Hold or rework

- `/garden-suite-financing-gta`: hold as a separate organic target until it earns distinct queries; otherwise consolidate into `/garden-suite`.
- `/resources/private-mortgage-costs-ontario`: put cost/appraisal/exit content into the existing private page first.
- All 21 clusters with no Google signal: retain as roadmap hypotheses, not validated demand.

### Historical priority, not Google validated

- MLI Select research and service pages remain strategically important because of prior exact-query estimates and business fit, but FairLend has no current GSC/GA4 evidence for them.

## Cluster-by-cluster validation

| Cluster | Google status | Decision | Evidence |
|---|---|---|---|
| residential-mortgages-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-mortgages-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| private-mortgages-research-decision | topic-signal-target-unproven | hold-separate-guide-strengthen-existing-page | 'fair market value appraisal for private lending': 2 impressions at position 96.5; the existing private-mortgage page has 14 impressions at 10.07. Proposed /resources/private-mortgage-costs-ontario is not live. |
| private-mortgages-qualification-rescue | partial-page-signal | update-now | /borrowers/private-mortgage-financing: 14 impressions, position 10.07, 0 clicks. Related query 'fair market value appraisal for private lending': 2 impressions, position 96.5. |
| institutional-mortgages-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| institutional-mortgages-qualification-rescue | directional-no-google-signal | audit-indexation-and-retain-boundary | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| heloc-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| heloc-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| bridge-loans-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| bridge-loans-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-refinancing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| residential-refinancing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| renovation-financing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| renovation-financing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| construction-financing-research-decision | topic-signal-target-unproven | create-with-strict-canonical-boundary | 'construction loan draw schedule': 3 impressions, position 91.3, currently associated by identical metrics with /construction-draw-financing. Proposed /resources/construction-loan-draw-schedule is not live. |
| construction-financing-qualification-rescue | validated-low-sample | update-now | Exact GSC query 'construction loan draw schedule': 3 impressions, position 91.3. /construction-draw-financing: 3 impressions, position 91.33. Identical metrics strongly associate the query with the existing page. |
| multiplex-financing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| multiplex-financing-qualification-rescue | directional-no-google-signal | audit-indexation-and-retain-boundary | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| garden-laneway-suites-research-decision | partial-page-signal | update-snippet-now | /garden-suite: 13 impressions, average position 2.92, 0 clicks. No query string is exposed for this page in the current Search Console UI. |
| garden-laneway-suites-qualification-rescue | rework-boundary | hold-separate-url | /garden-suite has 13 impressions at position 2.92. /garden-suite-financing-gta has no GSC or GA4 signal in the observed reports. |
| mli-select-research-decision | historical-only | retain-priority-not-google-validated | Historical repository estimate: 'MLI Select' 1,600 monthly searches (Canada-level, observed 2026-07-17). No current GSC or GA4 signal. |
| mli-select-qualification-rescue | historical-only | retain-priority-not-google-validated | Historical repository estimate: 'MLI Select financing' 20 monthly searches (Canada-level, observed 2026-07-17). No current GSC or GA4 signal. |
| rental-acquisition-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-acquisition-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-refinancing-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| rental-refinancing-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| private-mortgage-investing-research-decision | topic-signal-target-unproven | create-after-page-brief-review | Private-investing query family totals 5 GSC impressions. The existing investing page has 14 impressions and one highly engaged GA4 visit; the proposed research URL is not live. |
| private-mortgage-investing-qualification-rescue | validated-low-sample | update-now | Private-investing query family: 5 GSC impressions across 'private mortgage fund', 'private mortgage investment', 'invest in private mortgages', and 'private mortgage investing'. Existing page: 14 impressions at position 39.36; GA4: 1 active user, 1 engaged session, 100% engagement, 3m47s average engagement, 15 events. |
| partner-program-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| partner-program-qualification-rescue | partial-page-signal | update-snippet-and-measurement | /partners: 5 impressions, position 5.40, 0 clicks; GA4: 1 active user, 1 engaged session, 100% engagement, 3s average engagement, 7 events. |
| builder-consulting-research-decision | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |
| builder-consulting-qualification-rescue | directional-no-google-signal | retain-roadmap-not-demand-validated | No matching query family, target-page impression, or GA4 landing-page evidence in the fresh Google reports. |

## Measurement blockers

1. GA4 still records **0 key events**. Commercial validation is impossible until application start, form submit, booked consultation, partner referral, and investor-interest events are marked.
2. Local API credentials are absent, preventing combined `query,page` extraction and repeatable automated validation.
3. Search Console has only 67 impressions; absence of evidence is not evidence of zero demand.
4. The rolling GA4 window changed by one day, so movement cannot be attributed to content or rankings.
5. Most proposed pages do not exist; Google cannot validate their target ownership until they are published and indexed.

## Validation protocol going forward

Re-run after either:

- 28 additional days of GSC data, or
- 100 non-brand impressions, whichever comes first.

At the next run:

1. Pull Search Console with dimensions `query,page`.
2. Hydrate striking-distance queries at positions 5–20 if Google Ads/OpenSEO metrics become available.
3. Check whether garden-suite queries split across both URLs.
4. Compare guide-versus-service query ownership for construction and investing.
5. Review GA4 key-event rate by organic landing page.
6. Promote clusters from directional to validated only when topic, target page, and behavior evidence agree.

## Mutation audit

- Read-only Search Console and GA4 reports were used.
- No Google settings, filters, comparisons, key events, ads, saved keywords, or tags were changed.
- No production application files were changed.
