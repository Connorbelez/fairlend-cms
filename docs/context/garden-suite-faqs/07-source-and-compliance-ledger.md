# Garden Suite FAQ Source and Compliance Ledger

Last reviewed: July 27, 2026

This ledger separates current public facts from company claims that still need internal evidence. It is an editorial control, not legal advice.

## Primary public sources

| ID | Source | What it supports | Review trigger |
|---|---|---|---|
| TOR-GS | [City of Toronto: Garden Suites](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/) | Definition, residential zones, building permit requirement, zoning review, emergency access, tree rules, current policy context | Recheck when the page date changes or Toronto amends the by-law |
| TOR-ZBL | [Toronto Zoning By-law 569-2013, Chapter 150.7](https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter150_7.htm) | Use rules, one Garden or Laneway Suite per lot, setbacks, landscaping, parking, bicycle parking | Recheck before publishing exact dimensions or quantitative rules |
| TOR-PERMIT | [City of Toronto: New Garden Suite permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-garden-suite/) | Permit application, drawings, access, forms, online submission, current fee schedule | Recheck fees and submission requirements at least quarterly |
| TOR-PLANS | [City of Toronto: Pre-Approved Garden and Laneway Suite Plans](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/pre-approved-garden-and-laneway-suite-plans/) | Plan catalogue, remaining site review, modification limits, permit still required | Recheck when plans or program terms change |
| TOR-DC | [City of Toronto: Laneway and Garden Suite Development Charges Deferral Program](https://www.toronto.ca/services-payments/grants-incentives-rebates/laneway-garden-suite-development-charges-deferral-program/) | Deferral eligibility, 20-year conditions, discontinued Affordable Laneway Suites Program | Recheck before describing any incentive or forgivable amount |
| ON-PERMIT | [Ontario: Citizen's guide to building permits](https://www.ontario.ca/document/citizens-guide-land-use-planning/building-permits) | General permit purpose and municipal administration | Recheck when Ontario Building Code guidance changes |
| CAN-REFI | [Department of Finance Canada: Mortgage insurance rule changes for secondary suites](https://www.canada.ca/en/department-finance/news/2024/10/mortgage-insurance-rule-changes-to-enable-homeowners-to-add-secondary-suites.html) | Federal insured-refinance framework and effective date | Prefer the current CMHC product page for live qualification |
| CMHC-REFI | [CMHC Refinance for Building Secondary Suites](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/refinance) | Current borrower, property, loan-to-value, value, amortization, credit, debt-service, and advance requirements | Recheck before publishing any number or eligibility statement |
| CMHC-AR25 | [CMHC 2025 Annual Report](https://assets.cmhc-schl.gc.ca/sites/cmhc/about-cmhc/corporate-reporting/annual-report/2025/cmhc-annual-report-2025-en.pdf) | Canada Secondary Suite Loan Program was not implemented | Recheck if a later federal budget or CMHC release announces a replacement |
| FSRA-DISC | [FSRA: Mortgage brokerage disclosure requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements) | Brokerage disclosure and conflict-management context | Recheck when FSRA guidance changes |

## Local source material

| ID | Source | Use |
|---|---|---|
| FL-PRODUCT | `PRODUCT.md` | Audience, product purpose, brand voice, and accessibility standards |
| FL-DESIGN | `DESIGN.md` | Dossier design system and content presentation principles |
| FL-SEO | `docs/SEO/synthesis/GardenSuites/money-page-copy.md` | Current page argument, existing FAQ bank, financing-route comparison, and draft proof claims |
| FL-PAGE | `src/components/GardenSuiteMoneyPage/` | Current service language, project journey, CTA, and DrawFlow presentation |
| FL-CLAIMS | `src/lib/fairlend-claims.ts` | Approved claim wording and evidence-owner notes |
| FL-CALC | `src/calculators/catalog.ts` and calculator engines | Calculator input definitions, official source links, and assumption discipline |

## Publication status for important claims

| Claim | Status | Editorial instruction |
|---|---|---|
| Toronto permits Garden Suites in many residential zones, subject to requirements | READY WITH DATE | Cite TOR-GS and avoid implying every property qualifies |
| A building permit is required | READY | Cite TOR-GS or TOR-PERMIT |
| Pre-approved plans still require a permit and site-specific review | READY | Cite TOR-PLANS |
| A lot cannot contain both a Garden Suite and a Laneway Suite | READY WITH BY-LAW CHECK | Cite TOR-ZBL |
| No parking space is required for the Garden Suite under the current city-wide rule | READY WITH BY-LAW CHECK | Cite TOR-ZBL and avoid applying it to an unresolved former-by-law property |
| The Affordable Laneway Suites Program is discontinued | READY WITH DATE | Cite TOR-DC and do not call it a current funding source |
| The Canada Secondary Suite Loan Program offers an $80,000 loan | HOLD | CMHC's 2025 Annual Report says the announced program was not implemented |
| CMHC Refinance can support eligible secondary-suite construction | READY WITH QUALIFICATION | Cite CMHC-REFI. Approval remains with the lender and insurer |
| DrawFlow provides up to 15 milestone draws | INTERNAL VERIFY | Confirm against current product and lender agreements before publication |
| Interest accrues only on advanced capital | INTERNAL VERIFY | State only as subject to the executed loan agreement, fees, and advance mechanics |
| Up to 50 percent construction-period interest savings | HOLD | Requires the completed case ledger, baseline, distribution, dates, and methodology |
| Approximately $12,000 saved | HOLD | Requires a reproducible worked model with approved assumptions and reviewer |
| Daily drone footage and weekly inspections | INTERNAL VERIFY | Confirm operational scope, availability, privacy consent, and reviewer qualifications |
| FairLend can review and release draws without lender permission each time | HOLD | Requires approved lender-agreement wording and legal review |
| Software trained on thousands of Toronto builds | HOLD | Requires dataset definition, count, provenance, and approved substantiation |
| Principal Broker experience figures | USE APPROVED CLAIM FILE ONLY | Copy exact approved wording and attribution from FL-CLAIMS |
| Specialist legal team experience | INTERNAL VERIFY | Confirm entity, role boundary, experience attribution, and legal-services disclosure |
| Projected rent can help a borrower qualify | READY AS CONDITIONAL | Say treatment varies by lender, appraisal method, documentation, and program |
| A Garden Suite will increase property value | PROHIBITED AS A PROMISE | Value is determined by the market and appraiser. Use conditional language only |

## High-risk wording replacements

| Avoid | Use |
|---|---|
| Your property qualifies | Your property can be assessed against current zoning, access, site, and lender requirements |
| Get approved | Prepare a financing file for lender review |
| Guaranteed funding | A financing route subject to lender approval and final documentation |
| Your rent will cover the payment | Model how a lender may treat supported rental income and ongoing costs |
| The suite adds this much value | An appraiser may consider the completed legal suite and available market evidence |
| Pre-approved plans mean fast approval | Pre-approved designs can reduce repeated design review, but the site and permit application still require review |
| Government funding will cover the build | Verify whether a current program applies before including it in the capital plan |
| We inspect the building code | Municipal authorities perform code inspections. FairLend may review project progress for financing purposes |
| Interest only applies to what you use | Interest treatment depends on the facility, advance dates, fees, and executed agreement |

## Review checklist before page publication

- Confirm every current program against its live official source.
- Confirm every number against a dated source.
- Remove all `HOLD` claims unless the named evidence has been approved.
- Keep municipal, lender, insurer, appraiser, builder, and FairLend roles separate.
- Verify that FAQPage structured data exactly matches visible FAQ content.
- Make each answer understandable without the question list around it.
- Keep links descriptive and point deep claims to their evidence section.
- Send mortgage product, rate, approval, and savings claims through compliance review.
