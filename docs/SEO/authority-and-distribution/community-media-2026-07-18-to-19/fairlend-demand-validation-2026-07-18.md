# FairLend demand validation — 2026-07-18

## Scope and rotation

- **Observation date:** 2026-07-18 ET
- **Market/language requested:** Canada / English
- **Rotated seed:** `private mortgage`
- **Prior-run deduplication:** Available. The cumulative ledger records `construction mortgage` as the 2026-07-17 AnswerThePublic seed and explicitly lists `private mortgage` next. The prior fallback register already contains `private mortgage`, `private lenders for mortgage`, `private mortgage lenders ontario`, and `private mortgage lenders toronto`; those phrases are confirmations, not new signals.
- **External actions:** Read-only search queries only. No account, login, paid entitlement, form submission, post, message, or outreach.

## AnswerThePublic access result

No AnswerThePublic keyword search was submitted. The public homepage returned only a JavaScript application shell, the site's shipped configuration exposed `PUBLIC_SEARCH_TURNSTILE_ENABLED: "true"` and a Cloudflare Turnstile site key for public search, and the available browser-control runtime returned `No browser is available`. A Canada/English query therefore was **not accessible without a working interactive browser challenge**. No login was attempted, no account was created, and no entitlement was consumed.

- **Requested seed:** `private mortgage`
- **Public page inspected:** [AnswerThePublic](https://answerthepublic.com/)
- **Public API reference inspected:** [AnswerThePublic Public API — Reference](https://api.answerthepublic.com/api-docs/public)
- **Exact limitation:** JavaScript/Cloudflare Turnstile protected public-search flow; no browser was available to complete the public challenge.
- **Result:** Zero AnswerThePublic phrases observed; all phrases below are explicitly labeled autocomplete fallback data.

## Autocomplete fallback observations

Google's public suggestion endpoint was queried with `gl=ca&hl=en`; Bing's public OSJSON endpoint was queried with `market=en-CA`. Suggestions are discovery observations, not people, prevalence, freshness, monthly volume, or proof of Canadian intent. Each phrase below appeared in the returned suggestion list on 2026-07-18. No volume was exposed or inferred.

- [Google autocomplete observation URL](https://www.google.com/complete/search?client=firefox&gl=ca&hl=en&q=private%20mortgage)
- [Bing autocomplete observation URL](https://api.bing.com/osjson.aspx?query=private%20mortgage&market=en-CA)

### Material exact wording

| Exact observed phrase | Actual source and input | Result type | Deduplication / interpretation | Recommended content action |
|---|---|---|---|---|
| `private mortgage how does it work` | Google autocomplete; `private mortgage how` | Suggestion | **New phrasing.** Plain-language process intent. | Improve the existing private-mortgage guide with an answer-first mechanics section. |
| `private mortgage what is it` | Google autocomplete; `private mortgage how` and `private mortgage what` | Suggestion | **New phrasing.** Definition intent; consolidate with “how it works.” | Add a concise definition to the same guide; no new page. |
| `what's a private mortgage` | Google autocomplete; `private mortgage what` | Suggestion | **New wording variant**, same definition cluster. | Use as FAQ/audience language, not a standalone page. |
| `private mortgage vs bank` | Google autocomplete; `private mortgage vs` | Suggestion | **New comparison phrasing.** | Add a decision table comparing regulated lender type, underwriting path, cost disclosure, term, and exit planning without implying a universal winner. |
| `private mortgage vs bank mortgage` | Bing autocomplete; `private mortgage vs` | Suggestion | Second surface confirms the bank-comparison cluster; still not prevalence evidence. | Merge with the comparison section above. |
| `pros and cons of private mortgage lenders` | Google autocomplete; `private mortgage why` | Suggestion | **New decision-stage phrasing.** | Add suitability, total-cost, term, payment structure, fees, and exit-plan factors to the existing guide. |
| `private mortgage rates ontario` | Google autocomplete; `private mortgage` and `private mortgage ontario` | Suggestion | **New exact wording**; rate-shopping intent. A rate alone is not total cost. | Improve the total-cost calculator/explainer; do not publish unsupported representative rates. |
| `private mortgage lenders ontario rates` | Google autocomplete; `private mortgage ontario` | Suggestion | **New word order**, same Ontario rate-shopping cluster. | Consolidate with total-cost/APR content. |
| `private mortgage calculator ontario` | Google autocomplete; `private mortgage ontario` | Suggestion | **New location-specific calculator phrasing.** | Prioritize/improve the repository's private-mortgage total-cost calculator and disclose assumptions. |
| `private mortgage rules ontario` | Google autocomplete; `private mortgage ontario` | Suggestion | **New regulatory-intent phrasing.** | Add a reviewed Ontario disclosure/licensing FAQ sourced to FSRA and e-Laws; avoid legal advice. |
| `private mortgage lenders ontario for bad credit` | Google autocomplete; `private mortgage ontario` | Suggestion | **New eligibility phrasing.** High individualized-advice risk. | Add general qualification/readiness factors and suitability boundaries; never imply approval. |
| `what is a private mortgage lender` | Bing autocomplete; `private mortgage what` | Suggestion | **New role-definition phrasing.** | Clarify lender versus brokerage/broker roles in the existing guide. |
| `private mortgage broker ontario` | Google autocomplete; `private mortgage ontario` | Suggestion | **New exact wording.** Provider-selection intent. | Add a licence-check and questions-to-ask checklist; no directory-style “best” claim. |
| `private mortgage lenders ontario` | Google autocomplete; `private mortgage`; Bing autocomplete; `private mortgage ontario` | Suggestion | **Prior-ledger confirmation**, observed on both fallback surfaces. | Improve existing Ontario private-mortgage coverage; do not count as a new signal. |
| `private mortgage lenders toronto` | Google autocomplete; `private mortgage` | Suggestion | **Prior-ledger confirmation.** | Keep Toronto/GTA applicability within the Ontario guide; no city doorway page. |

### Noisy or unsafe-to-generalize wording

- `private mortgage insurance`, `private mortgage insurance pmi`, and related “how much / how to get rid of it” suggestions are heavily US-coded and lexically ambiguous. In Canadian content, distinguish **mortgage loan insurance** from a **private mortgage** and cite CMHC; do not assume users mean a Canadian private-lender product.
- `private mortgage no down payment` appeared for Google input `private mortgage without`. Treat it as a misconception/risk signal, not an eligibility promise. It should not support approval, rate, or minimum-down-payment claims without file-specific lender and insurer review.
- Bing surfaced geographically irrelevant suggestions (for example Australia, Virginia, and Texas). These were excluded and demonstrate that a market parameter does not prove every suggestion has Canadian intent.

## Fresh demand clusters for the main report

The run produced **seven materially useful fresh clusters** after ledger deduplication:

1. What a private mortgage is / how it works.
2. Private mortgage versus bank mortgage.
3. Pros, cons, suitability, and exit planning.
4. Ontario private-mortgage rates versus complete borrowing cost.
5. Ontario private-mortgage calculator intent.
6. Ontario rules, broker/lender roles, disclosure, and licence checks.
7. Bad-credit/eligibility intent, with strong no-guarantee and individualized-advice boundaries.

Repository inspection found an existing route reference for `https://www.fairlend.ca/borrowers/private-mortgage-financing` and catalog entries for a Private Mortgage Total-Cost Calculator, Private Mortgage Exit Runway Calculator, Renew-or-Exit comparator, Commitment Comparator, and Document Readiness Checker. This supports **improving/consolidating existing assets**, not creating one page per isolated phrase. Deployment status of every catalog item was not independently verified in this research lane.

## Primary and authoritative validation

| Source | Date | What it supports | Demand cluster / editorial use |
|---|---|---|---|
| [FSRA — Private Mortgages](https://www.fsrao.ca/privatemortgage) | Undated page; accessed 2026-07-18 | FSRA describes alternative/private mortgages as generally short-term, potentially carrying higher rates, lender fees/commissions, shorter terms, interest-only conditions, and a need for a realistic exit strategy; it tells consumers to verify the broker or agent is FSRA-licensed. | Definition/how-it-works, pros/cons, Ontario rules, broker selection, and exit planning. |
| [FSRA — Mortgage Product Suitability Assessment](https://www.fsrao.ca/mortgage-product-suitability-assessment) | Effective 2024-06-19; status shown as Active when checked 2026-07-18 | FSRA's active guidance interprets Ontario mortgage-product suitability obligations around knowing the client/product, meeting client needs, client understanding, suitability, and documentation. | Supports a suitability-first comparison rather than “best lender” or approval promises. |
| [FSRA — You got your client a private mortgage, but do they have a plan to get out?](https://www.fsrao.ca/industry/mortgage-brokering/regulatory-framework/supervision/you-got-your-client-private-mortgage-do-they-have-plan-get-out) | Undated page; accessed 2026-07-18 | FSRA says a realistic exit strategy is necessary for suitability, speculative price growth is not a valid plan, and renewal fees/high rates can consume equity when borrowers cannot exit. | Strong basis for exit-runway, renew-or-exit, and total-cost content. |
| [Ontario e-Laws — O. Reg. 191/08, Cost of Borrowing and Disclosure to Borrowers](https://www.ontario.ca/laws/regulation/080191) | Consolidated from 2022-03-01 to e-Laws currency date; last amendment 124/22; accessed 2026-07-18 | The regulation defines APR/cost-of-borrowing treatment, included and excluded charges, plain-language written disclosures, and timing. It is the primary legal text; FairLend content should summarize it educationally and avoid legal conclusions. | Ontario rules, rates-versus-APR, fees, calculator assumptions, and disclosure FAQ. |
| [FSRA — Shopping for a Mortgage](https://www.fsrao.ca/consumers/mortgage-brokering/shopping-mortgage) | Undated page; accessed 2026-07-18 | FSRA advises comparing product type, term, amortization, payment features, total cost, prepayment/break fees, setup/discharge/renewal fees, and risks—not merely qualifying or rate. | Private-versus-bank comparison, lender questions, and total-cost calculator inputs. |
| [FCAC — Getting preapproved for a mortgage](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preapproval-qualify-mortgage.html) | 2025-10-15 | FCAC states brokers arrange transactions rather than lend directly, brokers do not all access the same lenders, provinces regulate brokers, and preapproval is not a guarantee. | Clarifies broker/lender roles and supports eligibility/no-guarantee guardrails. |
| [OSFI — Minimum qualifying rate for uninsured mortgages](https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages) | Modified 2026-01-29 | The current MQR is the greater of contract rate +2% or 5.25%; OSFI applies this expectation to federally regulated lenders and notes the straight-switch exception conditions. | Provides a precise bank/federally-regulated-lender comparison boundary. Do not imply the OSFI rule universally governs every private lender. |
| [CMHC — What is CMHC Mortgage Loan Insurance?](https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-is-mortgage-loan-insurance) | Published 2018-06-03; current page checked 2026-07-18 | CMHC explains that mortgage loan insurance protects the lender, is generally required below 20% down subject to program rules, and is distinct from the lender category “private mortgage.” | Corrects the noisy “private mortgage insurance/PMI” autocomplete cluster for Canadian readers. |
| [Bank of Canada — policy-rate decision](https://www.bankofcanada.ca/2026/07/fad-press-release-2026-07-15/) | 2026-07-15 | The Bank held the overnight target at 2.25% (Bank Rate 2.5%, deposit rate 2.20%). This is macro rate context only, not a private-mortgage quote or pricing formula. | Timely context for rate-shopping content; explicitly separate policy rate from a borrower's offered private-mortgage APR and total cost. |

## Recommended content-demand entries

| Audience phrase/question | Source | Intent | Geography | Frequency this run | Existing FairLend answer? | Recommended content action |
|---|---|---|---|---:|---|---|
| `private mortgage how does it work` / `private mortgage what is it` | Google autocomplete fallback | Informational | Canada parameter; intent not proven Canadian | 2 exact suggestions plus one wording variant | Private-mortgage guide route referenced | Improve existing page with definition, process, lender/broker roles, term/payment mechanics, cost, and exit sequence. |
| `private mortgage vs bank` / `private mortgage vs bank mortgage` | Google + Bing autocomplete fallback | Comparison | Canada/en-CA parameters | 2 surface observations | Partial | Add an evidence-led comparison table; include OSFI scope and FSRA suitability/disclosure differences. |
| `pros and cons of private mortgage lenders` | Google autocomplete fallback | Decision support | Canada parameter | 1 suggestion | Partial | Add balanced suitability, total-cost, term, fees, payment structure, and exit-plan factors. |
| `private mortgage rates ontario` / `private mortgage lenders ontario rates` | Google autocomplete fallback | Commercial investigation | Ontario | 2 suggestions | Total-cost calculator catalogued | Improve existing calculator/explainer; show APR/fees/term assumptions, not unsupported market rates. |
| `private mortgage calculator ontario` | Google autocomplete fallback | Tool | Ontario | 1 suggestion | Calculator catalogued; deployment not verified | Verify/publish or improve the existing total-cost calculator with source/version notes and non-quote disclaimer. |
| `private mortgage rules ontario` / `private mortgage broker ontario` | Google autocomplete fallback | Regulatory/provider selection | Ontario | 2 suggestions | No direct regulatory FAQ verified | Add a reviewed Ontario FAQ and licence-check/questions checklist to the existing guide. |
| `private mortgage lenders ontario for bad credit` | Google autocomplete fallback | Eligibility | Ontario | 1 suggestion | General service fit; no approval answer | Add general readiness and suitability factors; state that no phrase-level answer can predict approval or terms. |

## Limitations and quality gate

- No AnswerThePublic result is claimed for this run.
- Autocomplete suggestions were observed exactly, but suggestion ordering, prevalence, freshness, and monthly volume were not inferred.
- Market parameters do not make every suggestion Canadian; non-Canadian/PMI noise was explicitly quarantined.
- Bank of Canada policy-rate data is macro context, not private-mortgage pricing evidence.
- OSFI's MQR source applies to federally regulated lenders; it is not generalized to every private lender.
- FSRA and Ontario e-Laws support educational summaries, not individualized legal, approval, suitability, or enforcement conclusions.
- This file is standalone evidence only. The cumulative ledger and main opportunity report were not edited.
