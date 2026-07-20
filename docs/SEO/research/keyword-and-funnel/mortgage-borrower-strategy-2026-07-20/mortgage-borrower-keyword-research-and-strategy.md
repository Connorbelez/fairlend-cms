# FairLend mortgage-borrower keyword research, five-layer clustering, and content proposal

**Market:** Ontario, with Toronto/GTA differentiation only where material  
**Observed:** 2026-07-20  
**Google account:** c.beleznay@humanfeedback.com  
**Coverage:** 8 borrower/service segments · 5 funnel layers · 160 retained keywords · 18 canonical page clusters · 120 questions

## Executive decision

FairLend should build a borrower decision system, not a collection of near-duplicate mortgage pages. The immediate P0 is to strengthen the existing `/borrowers/private-mortgage-financing` owner, publish one A-vs-B-vs-private decision page, and add a mortgage-decline triage guide that routes commercial urgency back to the private owner. The existing institutional page should be sharpened as the prime/A owner. B, HELOC, bridge, and renovation each need a bounded guide/service pair. Generic residential expansion is P2 because the current 67-impression GSC sample shows no demand signal for it.

Market search volume, CPC, and difficulty could not be retrieved from a callable provider. Those cells are deliberately blank and marked **unavailable-not-zero**. Current ranking-page evidence is attached at the segment/cluster-primary level; the dataset does not misrepresent a cluster SERP as an exact rank for every long-tail variant.

## First-party Google validation

- GSC property `sc-domain:fairlend.ca`: **2 clicks / 67 impressions / 3% CTR / average position 31.2**. This is a small diagnostic sample, not market demand.
- Existing private borrower page: **14 impressions / 0 clicks / average position 10.07**. It is the strongest direct borrower-page signal and must remain the canonical commercial owner.
- Exact visible query `fair market value appraisal for private lending`: **2 impressions / 0 clicks / average position 96.5**. This supports an appraisal/equity section, not a new page.
- GA4 property `502729166`, 2026-06-22–2026-07-19: **18 sessions, 14 engaged; organic 3 sessions, 2 engaged, 66.67% engagement, 77s average engagement, 23 events, 0 key events**.
- Measurement blocker: zero configured key events means GA4 cannot validate lead quality yet.

## Search-demand and ranking validation status

| Validation field | Coverage | Interpretation |
|---|---:|---|
| Retained keywords | 160 | Every keyword has one segment, funnel layer, cluster, and canonical owner. |
| Exact-query FairLend GSC observations | 1 | One exact borrower query was visible; the other 159 are marked not observed, not zero. |
| Market volume / CPC / difficulty | 0 provider-backed rows | No callable provider was available; values remain blank and unavailable-not-zero. |
| Current ranking-page references | 160 rows | Each row carries three representative pages from its segment/cluster-primary SERP. |
| Exact long-tail rank positions | unavailable | No compliant bulk Google rank source was accessible; representative SERP evidence is never presented as exact rank. |

The complete row-level validation is in `keyword-demand-and-ranking-validation.csv`. It keeps market demand, FairLend visibility, and external ranking-page evidence separate.

## Evidence taxonomy

1. **Fresh numeric first-party:** authenticated GSC/GA4 UI observations.
2. **Current ranking-page / SERP pattern:** current pages appearing for representative cluster queries; used for content type and boundary decisions.
3. **Third-party discovery:** Answer Socrates/PAA-style question expansion; qualitative only.
4. **Semantic hypothesis:** unobserved long-tail variants retained because they express a distinct borrower question inside a validated page owner.
5. **Unavailable-not-zero:** no connected paid keyword metrics source. Blank volume/CPC/KD cells are unknown, never zero.

## Five-layer funnel

| Layer | Name | Job |
|---|---|---|
| L1 | awareness-education | Understand the category, language, risks, and fit. |
| L2 | problem-project-feasibility | Determine whether the borrower or project can work. |
| L3 | evaluation-planning-comparison | Compare structures, lenders, costs, and trade-offs. |
| L4 | qualification-commercial-investigation | Investigate requirements, documents, pricing, and providers. |
| L5 | transaction-urgency-rescue | Act against a deadline, decline, shortfall, or enforcement risk. |

## Service opportunity matrix

| Priority | Service | First-party evidence | Action |
|---|---|---|---|
| P1 | A / prime institutional mortgages | Existing institutional route; no segment-level Google signal | Refocus existing institutional page on prime owner; build requirements guide |
| P1 | B / alternative institutional mortgages | No matching first-party query/page signal in 67-impression sample | Create tightly bounded guide and service owner for B / alternative institutional mortgages |
| P0 | Private mortgages | 14 GSC impressions at avg position 10.07 on existing private page | Update existing service now; defer separate guide until owner is stronger |
| P2 | Residential mortgages | No matching first-party query/page signal in 67-impression sample | Create tightly bounded guide and service owner for Residential mortgages |
| P1 | Renovation financing | No matching first-party query/page signal in 67-impression sample | Create tightly bounded guide and service owner for Renovation financing |
| P1 | Bridge financing | No matching first-party query/page signal in 67-impression sample | Create tightly bounded guide and service owner for Bridge financing |
| P1 | HELOC / home equity | No matching first-party query/page signal in 67-impression sample | Create tightly bounded guide and service owner for HELOC / home equity |
| P0 | Bank-declined / rescue borrowers | Private service has page signal; no distinct rescue query signal | Publish a decline triage guide; keep commercial/urgent CTA on private service; legal review power-of-sale guide |

## Canonical architecture

| Priority | Canonical path | Status | Page owner | Layers | Evidence confidence | Boundary |
|---|---|---|---|---|---|---|
| P2 | `/resources/ontario-residential-mortgage-guide` | proposed-create | Ontario residential mortgage guide | L1-L3 | directional — current SERP pattern, no first-party cluster signal | Broad residential education only; A/B/private pages own lender-tier qualification and rescue intent. |
| P2 | `/borrowers/residential-mortgage-financing` | proposed-create | Residential mortgage financing | L4-L5 | directional — current SERP pattern, no first-party cluster signal | Owns generic residential commercial intent; does not target A, B, private, HELOC, bridge, or rescue head terms. |
| P1 | `/resources/a-lender-mortgage-requirements-ontario` | proposed-create | A-lender requirements guide | L1-L2 | directional — current SERP pattern, no first-party cluster signal | Prime-policy education; residential guide remains broad and B/private pages own non-prime routes. |
| P1 | `/borrowers/institutional-mortgage` | existing-update | Institutional mortgage service | L4-L5 | low-medium — existing owner, limited query evidence | Prime institutional owner. Alternative B and private commercial intent must not be blended into the title/H1. |
| P1 | `/resources/b-lender-mortgage-ontario` | proposed-create | B-lender mortgage guide | L1-L2 | directional — current SERP pattern, no first-party cluster signal | Institutional alternative only; no equity-first private promises or generic residential head terms. |
| P1 | `/borrowers/alternative-mortgage` | proposed-create | Alternative mortgage service | L4-L5 | directional — current SERP pattern, no first-party cluster signal | Owns B-lender commercial intent. Bank-declined private/rescue terms route to private service. |
| Hold | `/resources/private-mortgage-costs-ontario` | hold-until-service-strengthened | Private mortgage costs and fit guide | L1-L2 | directional — current SERP pattern, no first-party cluster signal | Publish only after the existing service owner is strengthened; never compete for “private mortgage lenders Ontario.” |
| P0 | `/borrowers/private-mortgage-financing` | existing-update | Private mortgage financing | L4-L5 | medium — direct page signal, small sample | Single commercial owner for private and urgent bank-declined intent; rescue guide educates and triages, never duplicates the service pitch. |
| P1 | `/resources/renovation-financing-ontario` | proposed-create | Renovation financing options guide | L1-L2 | directional — current SERP pattern, no first-party cluster signal | Existing dwelling improvements only; ground-up builds and major construction draws belong to construction financing. |
| P1 | `/borrowers/renovation-financing` | proposed-create | Renovation financing service | L4-L5 | directional — current SERP pattern, no first-party cluster signal | Commercial renovation intent; no ground-up construction or general revolving-equity head terms. |
| P1 | `/resources/bridge-financing-ontario` | proposed-create | Ontario bridge financing guide | L1-L3 | directional — current SERP pattern, no first-party cluster signal | Temporary closing/liquidity gap only; ongoing equity borrowing belongs to HELOC and broad private needs belong to private. |
| P1 | `/borrowers/bridge-financing` | proposed-create | Bridge financing service | L4-L5 | directional — current SERP pattern, no first-party cluster signal | Owns bridge commercial terms; “no firm sale” is a subsection/variant, not a duplicate private-bridge page. |
| P1 | `/resources/heloc-ontario-guide` | proposed-create | HELOC and home-equity guide | L1-L2 | directional — current SERP pattern, no first-party cluster signal | Revolving home-equity education; refinance and renovation pages own their distinct outcomes. |
| P1 | `/borrowers/heloc` | proposed-create | HELOC / home-equity financing | L4-L5 | directional — current SERP pattern, no first-party cluster signal | Owns HELOC/home-equity commercial intent; urgent bad-credit second-mortgage variants link to private rather than spawning duplicates. |
| P0 | `/resources/mortgage-declined-ontario` | proposed-create | Mortgage declined in Ontario: recovery plan | L1-L4 | directional — current SERP pattern, no first-party cluster signal | Educational triage owner only; all commercial “private lender” intent belongs to the existing private service. |
| Hold | `/resources/power-of-sale-options-ontario` | hold-pending-legal-review | Power-of-sale options guide | L1-L5 | directional — current SERP pattern, no first-party cluster signal | Legal/enforcement intent only. Requires Ontario-law review and must never promise to “stop” enforcement. |
| P0 | `/resources/a-vs-b-vs-private-mortgage` | proposed-create | A vs B vs private mortgage comparison | L3 | directional — current SERP pattern, no first-party cluster signal | Sole A/B/private comparison owner; individual service pages explain their tier but do not recreate the full matrix. |
| P1 | `/resources/heloc-vs-refinance-vs-renovation` | proposed-create | HELOC vs refinance vs renovation financing | L3 | directional — current SERP pattern, no first-party cluster signal | Sole cross-option equity comparison owner; service pages answer provider/qualification intent. |

## Cannibalization contract

| Boundary | Rule |
|---|---|
| Residential vs A/institutional | Residential owns broad home-mortgage education and service intent; A/institutional owns prime lender qualification and bank-grade placement. |
| A vs B vs private | One comparison page owns the matrix; A and B are institutional tiers, while private is equity/exit-led. Each service page owns only its tier. |
| Private vs bank-declined | The existing private service owns commercial and urgent financing. The decline guide diagnoses and routes; it must not become a second private-lender service page. |
| HELOC vs refinance vs renovation | One comparison page owns cross-option trade-offs. HELOC owns revolving equity, refinance replaces a first mortgage, renovation owns project-specific outcomes. |
| Bridge vs private | Bridge owns a temporary proceeds/closing gap. “No firm sale” is a private bridge variant within the bridge owner, not a new generic private page. |
| Renovation vs construction | Renovation owns improvements to an existing dwelling. Ground-up/major structural progress draws remain with construction financing. |
| Guide vs service vs rescue | Guides educate, comparisons decide, services qualify/convert, rescue triages urgency. Only the canonical service page makes the full commercial pitch. |
| Ontario vs Toronto/GTA | Ontario is canonical by default. Add Toronto/GTA sections/examples only when lender policy, property type, timelines, or observed demand materially differs; do not clone city pages. |

## Cluster briefs

### Ontario residential mortgage guide — P2

- **Canonical owner:** `/resources/ontario-residential-mortgage-guide` (proposed-create)
- **Primary query:** how do mortgages work in Ontario
- **Segments / layers:** residential; L1-L3
- **Borrower problem:** Understand affordability, qualification, product structure, and the broker-vs-bank decision.
- **Promised outcome:** Choose the right residential path before submitting an application.
- **Required sections:** Mortgage fundamentals; affordability and stress test; down payment; product types; broker vs bank; documents; next steps
- **CTA:** Build my mortgage plan
- **Internal links:** /borrowers/residential-mortgage-financing; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-RESIDENTIAL
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Broad residential education only; A/B/private pages own lender-tier qualification and rescue intent.

### Residential mortgage financing — P2

- **Canonical owner:** `/borrowers/residential-mortgage-financing` (proposed-create)
- **Primary query:** residential mortgage broker Ontario
- **Segments / layers:** residential; L4-L5
- **Borrower problem:** Secure an ordinary residential mortgage with a documented plan and closing timeline.
- **Promised outcome:** Submit a financeable application and close.
- **Required sections:** Who it is for; purchase and renewal scenarios; qualification; document checklist; process; FAQs
- **CTA:** Get a residential mortgage assessment
- **Internal links:** /resources/ontario-residential-mortgage-guide; /borrowers/institutional-mortgage
- **Evidence references:** SERP-RESIDENTIAL
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Owns generic residential commercial intent; does not target A, B, private, HELOC, bridge, or rescue head terms.

### A-lender requirements guide — P1

- **Canonical owner:** `/resources/a-lender-mortgage-requirements-ontario` (proposed-create)
- **Primary query:** A lender mortgage requirements Ontario
- **Segments / layers:** prime-a; L1-L2
- **Borrower problem:** Know whether credit, income, down payment, and debt service meet prime policy.
- **Promised outcome:** Identify gaps before a prime application.
- **Required sections:** What A means; credit; income; debt service; stress test; property; documents; graduation plan
- **CTA:** Check prime eligibility
- **Internal links:** /borrowers/institutional-mortgage; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-PRIME-A|SITE-01
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Prime-policy education; residential guide remains broad and B/private pages own non-prime routes.

### Institutional mortgage service — P1

- **Canonical owner:** `/borrowers/institutional-mortgage` (existing-update)
- **Primary query:** institutional mortgage lenders Ontario
- **Segments / layers:** prime-a; L4-L5
- **Borrower problem:** Place a bank-grade or monoline mortgage and plan a return from alternative financing.
- **Promised outcome:** Close with the strongest institutional option the borrower can support.
- **Required sections:** Prime fit; institutional lender types; qualification; switch/graduation; documents; process; FAQs
- **CTA:** Review institutional options
- **Internal links:** /resources/a-lender-mortgage-requirements-ontario; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-PRIME-A|SITE-01
- **Evidence confidence:** low-medium — existing owner, limited query evidence
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Prime institutional owner. Alternative B and private commercial intent must not be blended into the title/H1.

### B-lender mortgage guide — P1

- **Canonical owner:** `/resources/b-lender-mortgage-ontario` (proposed-create)
- **Primary query:** B lender mortgage requirements Ontario
- **Segments / layers:** alternative-b; L1-L2
- **Borrower problem:** Understand when an alternative institutional lender fits and what it costs.
- **Promised outcome:** Determine whether B financing is feasible before moving private.
- **Required sections:** What B means; borrower profiles; income; credit; equity; rates and fees; terms; exit strategy
- **CTA:** Check alternative eligibility
- **Internal links:** /borrowers/alternative-mortgage; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-ALTERNATIVE-B
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Institutional alternative only; no equity-first private promises or generic residential head terms.

### Alternative mortgage service — P1

- **Canonical owner:** `/borrowers/alternative-mortgage` (proposed-create)
- **Primary query:** B lender mortgage broker Ontario
- **Segments / layers:** alternative-b; L4-L5
- **Borrower problem:** Recover a financeable institutional path after bank policy rejection.
- **Promised outcome:** Place a B mortgage with a documented route back to prime.
- **Required sections:** Fit; common bank-policy mismatches; lender options; pricing; documents; exit plan; timeline
- **CTA:** Get an alternative mortgage assessment
- **Internal links:** /resources/b-lender-mortgage-ontario; /resources/a-vs-b-vs-private-mortgage; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-ALTERNATIVE-B
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Owns B-lender commercial intent. Bank-declined private/rescue terms route to private service.

### Private mortgage costs and fit guide — Hold

- **Canonical owner:** `/resources/private-mortgage-costs-ontario` (hold-until-service-strengthened)
- **Primary query:** private mortgage costs Ontario
- **Segments / layers:** private; L1-L2
- **Borrower problem:** Understand equity-led underwriting, appraisals, fees, risks, and exit requirements.
- **Promised outcome:** Decide whether private financing is proportionate and viable.
- **Required sections:** How it works; first vs second; equity and appraisal; rates and fees; term; risks; exit; alternatives
- **CTA:** Review a private mortgage scenario
- **Internal links:** /borrowers/private-mortgage-financing; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-PRIVATE|FP-GSC-02
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Publish only after the existing service owner is strengthened; never compete for “private mortgage lenders Ontario.”

### Private mortgage financing — P0

- **Canonical owner:** `/borrowers/private-mortgage-financing` (existing-update)
- **Primary query:** private mortgage lenders Ontario
- **Segments / layers:** private|rescue; L4-L5
- **Borrower problem:** Solve an equity-supported financing need outside institutional policy or against a deadline.
- **Promised outcome:** Reach a defensible approval and exit plan quickly.
- **Required sections:** Scenarios; equity and appraisal; first/second position; rates and fees; exit; bank decline; arrears triage; timeline; risks
- **CTA:** Request an urgent private mortgage assessment
- **Internal links:** /resources/private-mortgage-costs-ontario; /resources/mortgage-declined-ontario; /resources/a-vs-b-vs-private-mortgage
- **Evidence references:** SERP-PRIVATE|FP-GSC-02|SERP-RESCUE
- **Evidence confidence:** medium — direct page signal, small sample
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Single commercial owner for private and urgent bank-declined intent; rescue guide educates and triages, never duplicates the service pitch.

### Renovation financing options guide — P1

- **Canonical owner:** `/resources/renovation-financing-ontario` (proposed-create)
- **Primary query:** home renovation financing options Canada
- **Segments / layers:** renovation; L1-L2
- **Borrower problem:** Match an existing-home improvement scope to an appropriate funding structure.
- **Promised outcome:** Choose HELOC, refinance, purchase-plus-improvements, or other financing.
- **Required sections:** Project scope; options; budgets and quotes; appraisal; draw mechanics; cost overruns; construction boundary
- **CTA:** Choose a renovation financing route
- **Internal links:** /borrowers/renovation-financing; /resources/heloc-vs-refinance-vs-renovation
- **Evidence references:** SERP-RENOVATION
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Existing dwelling improvements only; ground-up builds and major construction draws belong to construction financing.

### Renovation financing service — P1

- **Canonical owner:** `/borrowers/renovation-financing` (proposed-create)
- **Primary query:** renovation financing lender Ontario
- **Segments / layers:** renovation; L4-L5
- **Borrower problem:** Finance a defined renovation, acquisition-plus-improvements, or cost overrun.
- **Promised outcome:** Fund the work with clear conditions and release mechanics.
- **Required sections:** Eligible projects; financing structures; qualification; quote/budget pack; appraisal; draws; timeline; FAQs
- **CTA:** Finance my renovation
- **Internal links:** /resources/renovation-financing-ontario; /resources/heloc-vs-refinance-vs-renovation; /borrowers/heloc
- **Evidence references:** SERP-RENOVATION
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Commercial renovation intent; no ground-up construction or general revolving-equity head terms.

### Ontario bridge financing guide — P1

- **Canonical owner:** `/resources/bridge-financing-ontario` (proposed-create)
- **Primary query:** how does a bridge loan work Ontario
- **Segments / layers:** bridge; L1-L3
- **Borrower problem:** Understand how to cover a temporary property transaction timing gap.
- **Promised outcome:** Choose bank bridge, private bridge, HELOC, or another structure.
- **Required sections:** How it works; firm-sale requirement; amount; term; costs; bank vs private; alternatives; risks; examples
- **CTA:** Map my closing gap
- **Internal links:** /borrowers/bridge-financing; /borrowers/private-mortgage-financing; /borrowers/heloc
- **Evidence references:** SERP-BRIDGE
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Temporary closing/liquidity gap only; ongoing equity borrowing belongs to HELOC and broad private needs belong to private.

### Bridge financing service — P1

- **Canonical owner:** `/borrowers/bridge-financing` (proposed-create)
- **Primary query:** bridge mortgage lender Ontario
- **Segments / layers:** bridge; L4-L5
- **Borrower problem:** Close a purchase or transaction before expected proceeds arrive.
- **Promised outcome:** Fund the verified gap on the required timeline.
- **Required sections:** Use cases; firm sale vs no firm sale; collateral; amount and term; documents; fees; process; urgent timeline
- **CTA:** Get a bridge financing assessment
- **Internal links:** /resources/bridge-financing-ontario; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-BRIDGE
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Owns bridge commercial terms; “no firm sale” is a subsection/variant, not a duplicate private-bridge page.

### HELOC and home-equity guide — P1

- **Canonical owner:** `/resources/heloc-ontario-guide` (proposed-create)
- **Primary query:** what is a HELOC in Canada
- **Segments / layers:** heloc-equity; L1-L2
- **Borrower problem:** Understand revolving equity credit, qualification, costs, and risks.
- **Promised outcome:** Know whether HELOC or lump-sum financing fits the use case.
- **Required sections:** HELOC mechanics; available equity; credit and income; rates; repayment; readvanceable products; risks; alternatives
- **CTA:** Estimate my equity options
- **Internal links:** /borrowers/heloc; /resources/heloc-vs-refinance-vs-renovation
- **Evidence references:** SERP-HELOC-EQUITY
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Revolving home-equity education; refinance and renovation pages own their distinct outcomes.

### HELOC / home-equity financing — P1

- **Canonical owner:** `/borrowers/heloc` (proposed-create)
- **Primary query:** HELOC lender Ontario
- **Segments / layers:** heloc-equity; L4-L5
- **Borrower problem:** Access home equity when a bank HELOC or conventional route does not fit.
- **Promised outcome:** Secure suitable revolving or lump-sum equity financing.
- **Required sections:** Use cases; HELOC vs home equity loan; qualification; combined LTV; documents; rates and fees; bank-declined options
- **CTA:** Review my home-equity options
- **Internal links:** /resources/heloc-ontario-guide; /resources/heloc-vs-refinance-vs-renovation; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-HELOC-EQUITY
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Owns HELOC/home-equity commercial intent; urgent bad-credit second-mortgage variants link to private rather than spawning duplicates.

### Mortgage declined in Ontario: recovery plan — P0

- **Canonical owner:** `/resources/mortgage-declined-ontario` (proposed-create)
- **Primary query:** mortgage declined Ontario options
- **Segments / layers:** rescue; L1-L4
- **Borrower problem:** Diagnose why financing failed and choose a proportionate recovery route.
- **Promised outcome:** Move from decline to a documented A, B, private, equity, or sale plan.
- **Required sections:** Immediate steps; decline reasons; documents; A vs B vs private; closing deadlines; arrears; decision tree; escalation
- **CTA:** Triage my mortgage decline
- **Internal links:** /borrowers/alternative-mortgage; /borrowers/private-mortgage-financing; /resources/power-of-sale-options-ontario
- **Evidence references:** SERP-RESCUE|FP-GSC-02
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Educational triage owner only; all commercial “private lender” intent belongs to the existing private service.

### Power-of-sale options guide — Hold

- **Canonical owner:** `/resources/power-of-sale-options-ontario` (hold-pending-legal-review)
- **Primary query:** options before power of sale Ontario
- **Segments / layers:** rescue; L1-L5
- **Borrower problem:** Understand time-sensitive options when mortgage enforcement has started or is imminent.
- **Promised outcome:** Preserve optionality and obtain legal/financing advice without false guarantees.
- **Required sections:** What power of sale is; notices and timing; cure/refinance/sale paths; documents; lender communication; legal help; urgent assessment
- **CTA:** Request a time-sensitive assessment
- **Internal links:** /resources/mortgage-declined-ontario; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-RESCUE|FP-GSC-02
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Legal/enforcement intent only. Requires Ontario-law review and must never promise to “stop” enforcement.

### A vs B vs private mortgage comparison — P0

- **Canonical owner:** `/resources/a-vs-b-vs-private-mortgage` (proposed-create)
- **Primary query:** A lender vs B lender vs private mortgage Ontario
- **Segments / layers:** prime-a|alternative-b|private; L3
- **Borrower problem:** Choose the least-cost lender tier that can actually approve the scenario.
- **Promised outcome:** Understand qualification, speed, pricing, term, and exit trade-offs.
- **Required sections:** Side-by-side matrix; qualification; income; credit; equity; speed; costs; term; exit; scenarios
- **CTA:** Find my lender tier
- **Internal links:** /borrowers/institutional-mortgage; /borrowers/alternative-mortgage; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-PRIME-A|SITE-01|SERP-ALTERNATIVE-B|SERP-PRIVATE|FP-GSC-02
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Sole A/B/private comparison owner; individual service pages explain their tier but do not recreate the full matrix.

### HELOC vs refinance vs renovation financing — P1

- **Canonical owner:** `/resources/heloc-vs-refinance-vs-renovation` (proposed-create)
- **Primary query:** HELOC vs refinance for renovations
- **Segments / layers:** heloc-equity|renovation; L3
- **Borrower problem:** Choose between revolving equity, replacing the first mortgage, and project-specific financing.
- **Promised outcome:** Match cost, flexibility, timeline, and project scope to one route.
- **Required sections:** Decision matrix; total cost; flexibility; qualification; appraisal; draws; break penalties; examples
- **CTA:** Compare my financing options
- **Internal links:** /borrowers/heloc; /borrowers/renovation-financing; /borrowers/private-mortgage-financing
- **Evidence references:** SERP-HELOC-EQUITY|SERP-RENOVATION
- **Evidence confidence:** directional — current SERP pattern, no first-party cluster signal
- **Market metrics:** unavailable-not-zero
- **Ranking validation scope:** representative cluster-primary SERP; exact long-tail rank not claimed
- **Boundary:** Sole cross-option equity comparison owner; service pages answer provider/qualification intent.

## 90-day operating plan

### Days 1–14 — measurement and owner repair

- Configure GA4 key events for assessment start, completed lead form, phone/email click, and qualified-lead handoff.
- Confirm canonical host and indexation for the two existing service owners.
- Rewrite `/borrowers/private-mortgage-financing` around borrower scenarios, equity/appraisal, costs, exit, urgency, and a single assessment CTA.
- Refocus `/borrowers/institutional-mortgage` as the prime/A service owner.
- Add GSC annotations and a query→page export process.

### Days 15–30 — decision and rescue layer

- Publish `/resources/a-vs-b-vs-private-mortgage`.
- Publish `/resources/mortgage-declined-ontario` as a triage guide, not a duplicate service page.
- Build reusable comparison matrix, document checklist, evidence callout, and urgent-assessment modules.
- Obtain legal review before any power-of-sale content; keep its URL on Hold until approved.

### Days 31–60 — alternative and equity system

- Publish the B-lender guide and alternative-mortgage service owner.
- Publish HELOC guide/service plus the HELOC-vs-refinance-vs-renovation comparison.
- Publish renovation guide/service with explicit construction boundary.
- Add internal links from guides → comparison → canonical service; link service FAQs back to evidence guides.

### Days 61–90 — bridge, residential, and validation

- Publish bridge guide/service with firm-sale vs no-firm-sale modules.
- Publish A-lender requirements guide.
- Create residential guide/service only after P0/P1 owners are indexed and conversion tracking works.
- Re-run GSC/GA4 at 28 days and again at day 90. Import market volume/CPC/KD when a provider becomes available; reprioritize without changing canonical ownership casually.

## Measurement specification

| KPI | Source | Cadence | Decision threshold |
|---|---|---|---|
| Non-brand impressions by cluster | GSC query→page export | Weekly | First signal; diagnose page/query mismatch |
| CTR at positions 4–15 | GSC | Biweekly | Rewrite title/meta when impressions are sufficient |
| Organic engaged sessions | GA4 | Weekly | Validate landing-page consumption |
| Assessment starts/completions | GA4 key events | Weekly | Primary conversion signal after setup |
| Qualified lead rate | CRM + GA4 join | Monthly | Determines commercial priority |
| Cannibalization | GSC query→page | Monthly | Two pages repeatedly sharing one query family triggers consolidation |

## How to use the CSVs

- `keyword-universe.csv` is the one-row-per-query source of truth. Every retained query has one segment, layer, cluster, and owner.
- `keyword-demand-and-ranking-validation.csv` isolates market-metric availability, exact FairLend GSC visibility, and scoped current ranking-page references for all retained keywords.
- `page-cluster-map.csv` is the page brief and canonical contract for strategy, writing, design, and development.
- `question-bank.csv` drives FAQ, answer-first sections, comparison tables, and triage checklists.
- `evidence-ledger.csv` separates numeric observation from qualitative discovery and semantic inference.
- `service-opportunity-matrix.csv` is the prioritization view.
- `coverage-qa.csv` records automated gates.

## Limitations

- No market-volume provider was callable; volume/CPC/KD are unavailable, not zero.
- The current GSC sample is only 67 impressions and cannot validate broad demand.
- Direct GSC UI did not provide a combined query→page export in this run, so cannibalization rules are preventive architecture, not an observed collision diagnosis.
- SERP URLs validate representative page types and entities at segment/cluster level; exact rank positions for all 160 long-tail queries were not available from a compliant bulk Google rank source.
- Power-of-sale content requires Ontario legal review; this report is not legal advice.
- Investor-only private mortgage intent is excluded. All retained queries serve borrowers.
