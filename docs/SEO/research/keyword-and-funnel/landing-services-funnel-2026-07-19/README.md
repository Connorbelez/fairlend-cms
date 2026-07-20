# FairLend landing-service keyword and five-layer funnel research

Run date: **2026-07-19**  
Market: **Ontario, with Toronto/GTA modifiers where the service is locally constrained**  
Property: **fairlend.ca**  
Status: **Research complete; no production pages or analytics settings changed.**

## Deliverable

This package inventories every offer exposed by the current landing page, deduplicates overlapping UI labels into **16 service lanes**, validates available demand against authenticated Google Search Console and GA4 data, adds Answer Socrates question discovery, checks representative live SERPs, and maps **160 retained keywords** to the repository's established five-stage funnel.

| File | Purpose |
|---|---|
| `executive-findings.md` | Decision-ready priorities and interpretation |
| `keyword-universe.csv` | 160 service keywords with funnel, evidence, scores, and data-state fields |
| `service-opportunities.csv` | One prioritized content opportunity per service |
| `question-bank.csv` | 68 service questions, including four observed Answer Socrates PAA questions |
| `first-party-evidence.csv` | Traceable GSC, GA4, Answer Socrates, and Keyword Planner observations |
| `answer-socrates-observations.csv` | Raw alphabet/PAA observations with retain/exclude decisions |
| `serp-evidence.csv` | Representative result type and URL for all 16 services |
| `coverage-qa.csv` | Mechanical proof that every service and every funnel stage is covered |
| `methodology-and-limitations.md` | Source hierarchy, scoring rubric, exclusions, and constraints |
| `research-summary.json` | Machine-readable counts, priorities, and limitations |
| `run-manifest.json` | Source dates, property IDs, and mutation audit |

## Service inventory

The landing page contains a 10-item financing catalog, an interactive route selector with additional products and audiences, and a dedicated Builder Consulting section. Overlapping labels such as Residential Mortgages/Private Mortgage/Institutional Mortgage/HELOC and Garden Suites/Backyard Rental were normalized into distinct, non-duplicative intent lanes.

1. Residential Mortgages
2. Private Mortgages
3. Institutional Mortgages
4. Home Equity Line of Credit (HELOC)
5. Bridge Loans
6. Residential Refinancing
7. Renovation Financing
8. Construction Financing / DrawFlow
9. Multi-plex Financing
10. Garden & Laneway Suite Financing
11. MLI Select Insured Housing
12. Existing Rental Property Acquisition Financing
13. Existing Rental Property Refinancing
14. Private Mortgage Investing
15. Partner / Referral Program
16. Builder Consulting

## Five-layer funnel

1. `awareness-education` — definitions, programs, concepts, and basic options.
2. `project-feasibility` — cost, eligibility, equity, unit count, rent, and viability.
3. `planning-comparison` — structures, providers, costs, risks, timelines, and next steps.
4. `financing-qualification` — requirements, product/lender selection, application, and take-out.
5. `immediate-transaction-problem` — live property, decline, stopped draw, funding gap, or deadline.

Every keyword has exactly one funnel assignment. Every service has two retained keywords in each stage.
