# FairLend SEO Audit — Authority, Visual, Mobile, Local, Google, and Drift Lane

Analyzed: 2026-07-15 01:30 UTC  
Target: [https://fairlend.ca](https://fairlend.ca) → [https://www.fairlend.ca/](https://www.fairlend.ca/)  
Scope: live desktop/mobile rendering, consent and CTA geometry, accessibility surface, local applicability and NAP, licensing and authority, backlink-source coverage, Google credential coverage, and drift availability.

## Lane summary

| Specialist | Result | Score / status | Confidence |
|---|---|---:|---|
| Visual/mobile | Strong desktop; first-visit mobile consent obscures proof and application | 72/100 | High for captured viewport |
| Local SEO | Hybrid appointment-only office + Ontario service area; material NAP/schema/GBP gaps | 44/100 | Moderate-low without GBP data |
| Backlinks/authority | Common Crawl did not return the domain; paid/free APIs not configured | Insufficient data | Low |
| Google APIs | No API key, GSC service account, or GA4 property | Setup required (tier −1) | High for credential state |
| Drift | No database/baseline | No baseline | High |

The strongest verified authority signal is regulatory: FairLend’s corporate licences are active, its principal broker is authorized, and the site exposes those facts clearly. The weakest surface is external authority discovery: the domain is absent from the current Common Crawl graph sample, exact-brand searches are ambiguous, no review proof is visible, and an old directory still maps the current phone number to Mortgage Intelligence.

## 1. Visual and mobile audit — 72/100

### Captures

- [Desktop 1920×1080](/Users/connor/Dev/fairlend-cms/.seo-cache/work/headless/www-fairlend-ca-audit-20260715-011958/screenshots/www-fairlend-ca-desktop.png)
- [Laptop 1366×768](/Users/connor/Dev/fairlend-cms/.seo-cache/work/headless/www-fairlend-ca-audit-20260715-011958/screenshots/www-fairlend-ca-laptop.png)
- [Tablet 768×1024](/Users/connor/Dev/fairlend-cms/.seo-cache/work/headless/www-fairlend-ca-audit-20260715-011958/screenshots/www-fairlend-ca-tablet.png)
- [Mobile 375×812 CSS px at 2× DPR](/Users/connor/Dev/fairlend-cms/.seo-cache/work/headless/www-fairlend-ca-audit-20260715-011958/screenshots/www-fairlend-ca-mobile.png)

The captures were inspected directly. Exact geometry below came from a fresh live Chrome DevTools Protocol render; no Playwright test, E2E suite, project build, or app mutation was run.

### Above-the-fold evidence

Desktop 1440×900:

- H1 is fully visible at `x=145, y=104, 466×308.1` CSS px.
- Primary “Book a free FairLend consultation” control is above the fold at `x=145, y=736.1, 281.4×55`.
- Authority file and application module are both visible; the privacy strip stays near the bottom edge and does not cover the primary CTA.
- The visual story communicates Toronto, property type, authority, and a direct next action without horizontal overflow.

Mobile 375×812:

- H1 is fully visible at `x=20, y=60.6, 335×225.7`; computed size is `55.875px`.
- Consultation and phone CTAs are both visible at `y=520.1`, each `163.5×46`, meeting a 44px touch-height target.
- Authority file starts at `y=588.8`. Privacy actions occupy `y=695–791`; the first-visit panel therefore covers the detailed authority proof and overlaps the application tabs at `y=757.6`.
- `documentElement.scrollWidth = clientWidth = 375`: no horizontal overflow.
- All sampled above-fold interactive controls had programmatic names.
- The page is 44,265 CSS px tall on mobile, so the obscured application step is expensive to rediscover.

### Accessibility surface

| Check | Evidence | Status |
|---|---|---|
| Accessible names | All sampled above-fold links/buttons had a name; consent actions are “Reject optional,” “Manage,” and “Accept all” | Pass |
| Consent choice targets | All three consent buttons are 44px tall | Pass |
| Hero CTAs | Consultation and phone are 46px tall | Pass |
| Header touch targets | Expert-call control is 30×30; menu is 34×34 | Medium issue |
| Typography | “Verified” is 7px; authority labels/footnote are 8–9px; CTA label/phone are 11px | Medium issue |
| Horizontal scroll | 0px overflow at 375px | Pass |

### Visual issues

1. **High — consent interrupts the mobile conversion sequence.** The panel visually covers the substantiation behind “Authority File” and the start-application module. Keep legally equivalent reject/accept choices, but reduce the occupied height or reflow the mobile hero so the application entry remains discoverable in the first viewport.
2. **Medium — header controls miss touch-target guidance.** Increase the interactive boxes for call and menu to at least 44×44 CSS px without necessarily enlarging the icons.
3. **Medium — proof text is too small to function as proof.** Bring critical authority labels, footnotes, phone text, and CTA text to a legible mobile size; 7–11px materially weakens both accessibility and trust.
4. **Low — exceptional page length.** Preserve the rich content, but add stronger section navigation or a persistent return-to-task affordance.

## 2. Local applicability and local SEO — 44/100

### Business type

Local analysis applies. Fresh page evidence changes the cached “online-first SAB” classification to **hybrid**:

- [Contact page](https://www.fairlend.ca/contact): “Toronto office,” “Visits By appointment,” and the physical office address.
- Homepage/schema: `areaServed` includes Ontario, Toronto, and the Greater Toronto Area.
- [Homepage](https://www.fairlend.ca/): CARTO/OpenStreetMap office map plus [Google Maps directions](https://www.google.com/maps/dir/?api=1&destination=890%20Sheppard%20Ave%20W%2C%20North%20York%2C%20ON%20M3H%206B9).

Industry route: mortgage brokerage and mortgage administration. `FinancialService` is the correct available local subtype; the main problem is incomplete properties, not the subtype.

### Dimension score

| Dimension | Score | Evidence |
|---|---:|---|
| GBP signals | 5/25 | Directions link and office/map evidence; no listing URL, Place ID, review widget, category, photos, posts, or verified hours |
| Reviews/reputation | 2/20 | No rating, review count, testimonial block, review schema, or visible third-party review proof on five sampled pages |
| Local on-page | 17/20 | Ontario title targeting, dedicated service pages, visible NAP, `tel:` CTA, contact page, office map/directions |
| NAP/citations | 9/15 | Name/phone/licensing align; Unit 2 is missing on-site; schema lacks address; legacy citation uses old brand |
| Local schema | 6/10 | `FinancialService`, areaServed, hours, contact point, phone/email present; address/geo absent |
| Local authority | 5/10 | Strong FSRA verification; sparse external brand evidence and no Common Crawl graph record |

### NAP and licensing audit

| Source | Name | Address | Phone | Result |
|---|---|---|---|---|
| Website footer/contact | Fairlend Management Inc. operating as FairLend Mortgage | 890 Sheppard Ave W, North York, ON M3H 6B9 | 647-831-7605 | Missing Unit 2 |
| JSON-LD | `name`: FairLend Mortgage; `legalName`: Fairlend Management Inc. | **Missing** | +1-647-831-7605 | Address cannot be reconciled |
| [FSRA brokerage 13827](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~) | Fairlend Management Inc. operating as FairLend Mortgage | 890 SHEPPARD AVE W, **unit 2**, North York ON M3H6B9 | 647-831-7605 | Licensed; current July 14, 2026 |
| [FSRA administrator 13828](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~) | Fairlend Management Inc. | 890 SHEPPARD AVE W, **Unit 2**, North York ON M3H6B9 | 647-831-7605 | Licensed; current July 14, 2026 |
| [FSRA broker M08001537](https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?M08001537~) | Elie Soberano, Fairlend Management Inc. operating as FairLend Mortgage | — | — | Principal Broker; Authorized to Sell; expires March 31, 2027 |

This is a real NAP defect, not a speculative one: both corporate FSRA records include Unit 2; the site and its directions destination omit it.

### Schema status

Detected organization entity:

- `@type`: `Organization`, `FinancialService`
- Present: name, legal name, telephone, email, URL, logo, area served, opening hours, contact point, licence-registry `sameAs` links.
- Missing/weak: `address`, `geo`, distinct business `image`, `priceRange`; no legitimate rating/review source to support `aggregateRating`.
- `openingHoursSpecification` says Monday–Friday 09:00–17:00, while visible copy says office visits are by appointment. Identify the structured hours as office, appointment, or phone/service hours and make all profiles consistent.

### GBP, reviews, and citations

- No GBP listing URL or Place ID is exposed. The map is CARTO/OpenStreetMap; the Google link is a generic directions destination.
- No sampled page exposes Google rating, review count, review recency, response evidence, or testimonials.
- Exact-brand public searches did not surface a clear BBB, Yelp, LinkedIn company, or Facebook business result. This means “not detected,” not “does not exist”; Yelp itself blocked crawling.
- [A legacy directory profile](https://mortgagebrokersandagents.com/ontario/elie-soberano/) lists Elie Soberano and the correct cell `647-831-7605`, but attributes him to Mortgage Intelligence. That is a concrete citation/entity-cleanup target.
- Exact-brand searches also surfaced unrelated Australian and software-project entities, showing that FairLend’s external entity disambiguation is weak.

### Local priorities

1. **High:** Add Unit 2 to all visible address instances and the Google directions destination.
2. **High:** Add `PostalAddress` and `GeoCoordinates` to `FinancialService`; retain the Ontario/Toronto/GTA `areaServed` values.
3. **High:** Verify/claim GBP, Bing Places, and Apple Business Connect with the regulated entity, exact phone/address, and accurate appointment/service hours.
4. **High:** Update legacy citations that still use Mortgage Intelligence.
5. **High:** Build a policy-compliant review request/response program; never gate reviews.
6. **Medium:** Add verified authoritative `sameAs` profiles and local citations after NAP cleanup.
7. **Medium:** Pursue Toronto/Ontario mortgage, builder, housing, and community editorial mentions rather than generic directory volume.

## 3. Backlink and external authority lane

### Health score: INSUFFICIENT DATA

Credential detection returned tier 0 only:

- Moz: unavailable.
- Bing Webmaster: unavailable.
- DataForSEO: unavailable.
- Common Crawl: available, 0.50 confidence.
- Verification crawler: available, but no known-link list was supplied.

Common Crawl query (`cc-main-2026-jan-feb-mar`, cached query timestamp 2026-07-14 21:42 UTC):

| Metric | Result |
|---|---|
| In crawl | false |
| In rankings | false |
| PageRank | null |
| Harmonic centrality | null |
| Referring domain sample | 0 |

Interpretation: FairLend is below that graph release’s inclusion/ranking threshold or has not been crawled into it. **This is not proof of zero backlinks.** Fewer than four of seven factors are scoreable, so a numeric health score would be misleading. Anchor distribution, toxic-link ratio, follow ratio, geography, linked pages, competitor gap, and new/lost velocity are unavailable; no disavow action is supportable.

Recommended next evidence: configure Moz (free) and Bing Webmaster, export any known links for direct verification, correct the stale Mortgage Intelligence citation, and build links through regulated-industry resources, builder/housing partnerships, local news, useful original data, and community work.

## 4. Google API lane

`python3 scripts/google_auth.py --check --json` returned credential tier **−1: no credentials configured**.

Unavailable:

- PageSpeed Insights, CrUX, and CrUX History.
- Search Console queries, clicks, impressions, CTR, average position, sitemap status, URL Inspection, and canonical selection.
- GA4 organic traffic, landing pages, and conversion evidence.

Therefore this lane makes no field-CWV, indexation, traffic, ranking, or conversion claim. Any deterministic performance estimates elsewhere in the full audit are lab heuristics, not Google field evidence. Configure an API key (tier 0), a Search Console service account for `sc-domain:fairlend.ca` (tier 1), and GA4 Viewer/property access (tier 2).

## 5. Drift lane

`python3 scripts/drift_history.py https://fairlend.ca` found no database, baselines, or comparisons. Drift analysis is conditional and was not run because no known-good snapshot exists.

After the present audit findings are accepted or repaired, capture a baseline for title, meta description, canonical, robots, headings, schema, Open Graph, status, HTML hash, and schema hash. Add CWV fields only after Google credentials are available.

## Consolidated action order

| Priority | Action | Impact |
|---|---|---|
| High | Normalize the official address including Unit 2 across website, schema, directions, and business profiles | Entity consistency, local trust, directions |
| High | Prevent the mobile consent panel from covering authority proof and the application entry | Conversion and mobile SXO |
| High | Verify/claim GBP and Bing Places; expose a stable listing/Place ID where appropriate | Local pack and AI/local entity confidence |
| High | Correct the legacy Mortgage Intelligence citation | Entity disambiguation and NAP consistency |
| High | Establish a compliant review acquisition/response program | Reputation and local conversion |
| Medium | Add `PostalAddress` + `geo` and clarify appointment versus service hours | Structured local understanding |
| Medium | Increase mobile header targets to 44×44 and trust/CTA text to readable sizes | Accessibility and trust |
| Medium | Configure Google, Moz, and Bing evidence sources | Makes future scores and decisions defensible |
| Medium | Capture the first SEO drift baseline after remediation | Deployment regression control |
| Ongoing | Earn local/regulatory/editorial mentions and distinctive brand profiles | Authority, citations, and external entity clarity |

## Limitations

- No Google API, GSC, GA4, GBP, Moz, Bing Webmaster, or DataForSEO credentials.
- No geo-grid or live local-pack measurement.
- No authenticated GBP categories, reviews, photos, posts, hours, Insights, or response data.
- Common Crawl is partial, domain-level, and lagged.
- Public search “not detected” findings do not prove absence; Yelp blocked crawling.
- No drift baseline exists, so no regression is claimed.
- Screenshot findings apply to the captured first-visit state and specified viewports.
