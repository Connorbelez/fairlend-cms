# FairLend calculator computation research

**Scope:** the 42 calculators and interactive decision tools in `seo-editorial-data-authority-brainstorm.md`  
**Jurisdiction:** Ontario/Canada, with Toronto-specific rules where named  
**Primary-source review date:** 2026-07-14  
**Purpose:** implementation specification, not legal, lending, planning, appraisal, engineering, tax, or investment advice

## Executive findings

The 42 tools should not be implemented as 42 independent calculation systems. They reduce to five shared, independently tested engines:

1. a dated cash-flow and mortgage-amortization engine;
2. a construction sources-and-uses / liquidity engine;
3. a stabilized-property NOI, value, DSCR, and loan-constraint engine;
4. a versioned MLI Select rules engine; and
5. a non-scoring checklist / dependency-graph engine.

Every result must distinguish **computed facts** from **user assumptions**, **contract terms**, and **official time-sensitive rules**. In particular, do not label a FairLend cash-flow IRR as the legally required APR. Ontario's statutory cost-of-borrowing calculation is prescribed by O. Reg. 191/08, fees payable to the brokerage must be included, and disclosure obligations sit with the licensed brokerage ([O. Reg. 191/08](https://www.ontario.ca/laws/regulation/r08191); [FSRA disclosure guidance](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)).

The strongest correctness architecture is a versioned rules/config layer. Each external rule should carry `sourceUrl`, `sourceDocumentId`, `effectiveFrom`, `effectiveTo`, `verifiedAt`, `reviewer`, and `changeNote`. CMHC expressly warns that its MLI Select reference material can change and should be verified before a loan is processed ([CMHC MLI Select fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)).

## Shared computation standards

### Money, dates, and rounding

- Store money as integer cents or an exact decimal type. Never use binary floating point for posted dollar outputs.
- Store rates as decimals (`0.10`, not `10`) and preserve the entered compounding convention.
- Perform calculations at full precision; round only display values to cents and percentages to the explicitly selected precision.
- Use actual calendar dates for irregular cash flows. For annualized scenario return, solve the dated-cash-flow equation on a 365-day basis, matching the published XIRR convention ([Microsoft XIRR specification](https://support.microsoft.com/en-us/office/xirr-function-de1242ec-6477-445b-b11b-a303ad9adc9d)). If the cash flows do not contain at least one positive and one negative value, return “not defined.”

### Rate conversion and amortization

For nominal annual rate `j` compounded `c` times annually and `f` payment periods annually:

```text
periodicRate = (1 + j / c)^(c / f) - 1
payment = principal * periodicRate / (1 - (1 + periodicRate)^(-numberOfPayments))
interest_t = openingBalance_t * periodicRate
principal_t = payment_t - interest_t
closingBalance_t = openingBalance_t - principal_t + capitalizedFees_t
```

At `periodicRate = 0`, `payment = principal / numberOfPayments`. For interest-only debt, payment-period interest is the contractual-period interest and principal remains unchanged until repayment. For simple daily interest, use `principal × annualRate × days / dayCountBasis`; `365`, `366`, `360`, or actual/actual is a **contract input**, not a FairLend default.

The federal Interest Act requires a mortgage using blended principal-and-interest or stipulated repayments to state the principal and an interest rate calculated yearly or half-yearly, not in advance ([Interest Act, s. 6](https://laws-lois.justice.gc.ca/eng/acts/I-15/section-6.html)). The UI must therefore ask for the quoted compounding basis rather than silently assume monthly compounding.

### Dated cash-flow metrics

Use a single signed cash-flow convention: borrower receipts are positive and borrower payments are negative; invert signs for an investor view.

```text
NPV(r) = Σ cashFlow_i / (1 + r)^((date_i - date_0) / 365)
annualizedScenarioCost = the r for which NPV(r) = 0
```

Label this output **annualized scenario cost** or **dated-cash-flow IRR**, never “statutory APR.” Show the complete cash-flow table and excluded items. The federal criminal-rate definition is an APR exceeding 35% on credit advanced, calculated using generally accepted actuarial practices and principles, subject to statutory exceptions ([Criminal Code, s. 347](https://laws-lois.justice.gc.ca/eng/acts/c-46/section-347.html); [Criminal Interest Rate Regulations](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2024-114/FullText.html)). Any product output approaching that boundary requires compliance review; the calculator must not purport to determine legality.

### Property and construction primitives

```text
LTV = securedDebt / propertyValue
equityCushion = propertyValue - securedDebt - dispositionOrEnforcementCosts
effectiveGrossIncome = potentialGrossIncome - vacancyAndCreditLoss + otherIncome
NOI = effectiveGrossIncome - operatingExpenses
annualDebtService = Σ scheduled principalAndInterestPayments over 12 months
DSCR = NOI / annualDebtService
capitalizedValue = NOI / capRate
loanByLTV = eligibleValue * maxLTV
loanByLTC = eligibleCost * maxLTC
loanByDSCR = max principal whose annual debt service <= NOI / minimumDSCR
constrainedLoan = min(all applicable loan constraints)
```

Do not include financing costs, depreciation, income tax, or capital expenditures in NOI unless a clearly named alternative definition is selected. Property value, cap rate, eligible cost, eligible value, and lender haircut are user/lender assumptions—not calculated truth.

### Construction liquidity recurrence

For each dated event `t`:

```text
openingCash_t = priorClosingCash
cashInflows_t = equityContributions + lenderReleases + receipts
cashOutflows_t = projectSpend + deposits + softCosts + financingCosts + debtService + holdbacks
closingCash_t = openingCash_t + cashInflows_t - cashOutflows_t
peakCashGap = max(0, -min(closingCash_t))
minimumLiquidityBuffer = peakCashGap + userContingencyBuffer
```

Ontario's Construction Act requires the payer to retain a basic holdback equal to 10% of the price of services or materials as actually supplied, and the 2026 provisions impose annual holdback-release mechanics in applicable contracts ([Construction Act, ss. 22 and 26](https://www.ontario.ca/laws/statute/90c30)). Prompt-payment rules generally require an owner to pay a proper invoice within 28 days unless the statutory non-payment process applies ([Construction Act, s. 6.4](https://www.ontario.ca/laws/statute/90c30)). These legal rules are not a universal lender advance percentage: model statutory holdback, contractual retainage, lender advance, and timing lag separately.

## A. Private-mortgage decision tools

### 1. Private Mortgage Total-Cost Calculator

**Inputs:** advance amount and date; quoted rate and compounding basis; payment type and dates; amortization; lender/broker fees; legal, appraisal, administration, prepaid interest, renewal/extension, discharge, and payout charges; fee treatment (paid in cash, deducted from advance, or capitalized); actual or planned payout date.

**Model:** generate the contractual balance schedule, then a borrower-view dated cash-flow ledger. Report gross principal, net cash received, periodic payment, interest paid/accrued, each fee, cash needed at closing, payout balance, total financing cost, and annualized scenario cost. `totalFinancingCost = all borrower financing outflows - principal repaid`; principal is not itself a financing cost. If fees are deducted, net credit advanced is reduced; if capitalized, the balance and interest schedule increase.

**Compliance:** Ontario requires mortgage brokerages to disclose cost of borrowing, including brokerage fees, in writing; the prescribed calculation and inclusion/exclusion rules live in O. Reg. 191/08 ([FSRA](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements); [O. Reg. 191/08](https://www.ontario.ca/laws/regulation/r08191)). Display “illustrative—verify against commitment and licensed disclosure.”

### 2. Private Mortgage Exit Runway Calculator

**Inputs:** funding/maturity dates; optional extension period; exit route; route milestones; expected duration and downside duration for each milestone; required lender notice; contingency buffer.

**Model:** work backward from maturity. `latestSafeCompletion = maturity - buffer`; for milestones in reverse dependency order, `latestStart_i = latestStart_successor - duration_i`. Compute base and downside dates, days of slack (`latestSafeDate - plannedDate`), and renewal exposure if downside completion exceeds maturity. Calendar-day/business-day choice and holiday calendar must be explicit.

**Assumptions:** milestone durations are user/project-team estimates. No official source establishes a universal sale, refinance, construction, probate, or lender-review duration. A negative-slack result is a planning flag, not a prediction that renewal or default will occur.

### 3. Blended Cost of a Second Mortgage

**Inputs:** first and second balances, rates, compounding, payment types, payments, fees, remaining terms, and analysis horizon.

**Model:** produce separate schedules and sum their dated cash flows. Report total monthly debt service, interest and fees by lien, combined dollars over the horizon, and balance at horizon. A balance-weighted nominal rate, `(B1×r1 + B2×r2)/(B1+B2)`, may be shown only as a descriptive metric when conventions match; otherwise show effective rates separately. The defensible combined cost is the cash-flow-based annualized scenario cost, not a naive weighted rate.

**Compliance:** include all borrower-paid brokerage fees in the scenario ledger and label outputs as estimates subject to the commitments ([FSRA disclosure guidance](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)).

### 4. Refinance vs Second Mortgage Break-Even Tool

**Inputs:** existing balance/payment/rate; verified payout penalty or estimate; refinance amount/rate/fees/amortization; second-mortgage amount/rate/fees/payment; hold horizon; discount rate.

**Model:** create “refinance whole first” and “retain first + second” ledgers. For each month, compare cumulative net cash cost and remaining debt. Break-even is the first month where the selected economic measure changes sign. Default measure should be `cumulative payments + fees + ending debt - starting debt`; optionally add NPV at a disclosed discount rate. Show “no break-even within horizon” rather than extrapolate.

**Penalty rule:** FCAC says mortgage penalties vary by contract and are commonly the higher of three months' interest and an interest-rate differential; the lender's method can use posted/discounted rates and present value ([FCAC prepayment penalties](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html)). Therefore accept a lender quote as preferred input and mark any formula estimate as approximate.

### 5. Equity and LTV Cushion Visualizer

**Inputs:** low/base/high property values; all registered and proposed mortgage balances; property-tax or other priority claims entered by the user; sale/enforcement cost assumptions.

**Model:** for each value scenario calculate current and post-advance LTV, gross equity, and net cushion. Run a value-decline curve and solve `breakEvenValue = securedDebt + modeledCosts`. Never substitute assessed value for market/appraised value without an explicit label. OSFI expects lenders to use appropriate valuation/appraisal methodology and recalculate LTV on refinancing or when prudent ([OSFI HELOC reporting instructions](https://www.osfi-bsif.gc.ca/en/data-forms/reporting-returns/filing-financial-returns/financial-reporting-instructions/home-equity-lines-credit-helocs-report-j2)).

**Risk framing:** FSRA's investor disclosure warns that property value may decline between appraisal and transaction and affect recovery ([FSRA Form 1](https://www.fsrao.ca/media/6536/download)).

### 6. Renew or Exit a Private Mortgage?

**Inputs:** current balance; renewal rate, fee, term, payment, and maturity; alternative payout amount/penalty, financing fees/rate/payment; expected sale or refinance date; extension probability scenarios.

**Model:** compare dated ledgers for renew, refinance now, and short extension if contractually available. Report cash at decision date, monthly debt service, total cost to each horizon, ending balance, and break-even date. Renewal fees deducted or capitalized must alter net proceeds/balance correctly.

**Constraint:** all renewal and extension terms are contract inputs. Ontario requires disclosure of prepayment rights, penalties, and charges for fixed-date/instalment mortgages ([Mortgage Brokerages, Lenders and Administrators Act, ss. 23–24](https://www.ontario.ca/laws/statute/06m29)).

### 7. Private Mortgage Commitment Comparator

**Inputs:** verbatim data from two or three commitments: advance, deductions, rate/compounding, payments, term/maturity, minimum interest, prepayment, renewal, default rate/fees, conditions, guarantees, and expiry.

**Model:** normalize each financial commitment through the total-cost engine at identical assumed payout dates (for example 6/12/18 months). Produce a difference table and unresolved-field warnings. Never infer a missing term or rank lenders. “Lowest modeled cost” is allowed only for the selected assumptions; “best” is not.

**Compliance:** mortgage information must not be false or deceptive, and material risks and conflicts require disclosure by licensees ([Mortgage Brokerages, Lenders and Administrators Act, s. 43](https://www.ontario.ca/laws/statute/06m29); [FSRA disclosure guidance](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)).

### 8. Private Mortgage Document Readiness Checker

**Inputs:** borrower/entity type, property/use, transaction type, income type, lien position, construction component, and status/date of each document.

**Model:** versioned rule matrix returns `required`, `conditionally required`, `present`, `stale`, `missing`, and `professional verification required`. Readiness percentage, if shown, is `completedRequired / totalRequired`; it must be visually subordinate and never called an approval score. Construction/development loans trigger FSRA Form 1.1 in brokered investor/lender disclosure workflows ([FSRA forms](https://www.fsrao.ca/industry/mortgage-brokering/forms-mortgage-brokering/mortgage-brokerage-disclosure-forms)).

**Assumptions:** lender-specific items belong in configurable templates. Output is a question/checklist, not confirmation of suitability, identity verification, underwriting, or funding.

### 9. Power-of-Sale Cost Sensitivity Model

**Inputs:** value range; sale discount; first and subsequent encumbrances; principal, accrued interest and default charges; legal, property-preservation, carrying, and sale costs; arrears; rent-deposit assumption; time to sale.

**Model:** calculate gross proceeds then apply a configurable waterfall. For a sale under the statutory power, the Mortgages Act orders sale expenses, interest/costs under the enforcing mortgage, principal under that mortgage, subsequent encumbrancers by priority, tenant rent deposits, then residue to mortgagor ([Mortgages Act, s. 27](https://www.ontario.ca/laws/statute/90m40)). Show recovery and loss for each layer across value/time/cost scenarios.

**Legal warning:** a contractual power generally cannot be noticed until default has continued at least 15 days and sale cannot occur for at least 35 days after notice ([Mortgages Act, s. 32](https://www.ontario.ca/laws/statute/90m40)). Those are legal minimums, not a forecast. Priority, enforceability, taxes, liens, possession, duties on sale, and actual costs require Ontario counsel; the calculator must not determine them.

### 10. Debt Consolidation Cost Horizon

**Inputs:** each debt's balance, rate, compounding, minimum/actual payment, fees; proposed secured debt terms/costs; 12/24/36-month horizons; optional re-borrowing and extra-payment scenarios.

**Model:** amortize existing debts and proposed consolidation from the same start date. Compare payment relief, cumulative interest/fees, balance, payoff date, and total net worth impact. Explicitly model any debt rolled into a longer amortization; a lower monthly payment can coexist with higher total cost. Behaviour scenarios are user assumptions, never predictions.

**Compliance:** use the same complete fee ledger and do not present an annualized cost as statutory APR unless the prescribed legal calculation has been implemented and reviewed ([O. Reg. 191/08](https://www.ontario.ca/laws/regulation/r08191)).

## B. Construction and small-builder tools

### 11. Construction Draw Working-Capital Gap Calculator

**Inputs:** dated stage/trade budget; deposits and payment dates; percentage complete required for draw; eligible-cost percentage; statutory holdback; lender holdback; inspection/evidence/release lags; borrower equity timing; contingency and change orders; debt interest/fees.

**Model:** event-level construction liquidity recurrence. A draw request equals eligible completed cost less prior funded eligible cost, lender retainage, and other exclusions; cash is not received until the modeled release date. Accrue interest only on actual outstanding advances unless the contract charges otherwise. Report peak gap, date of peak, cumulative interest, unfunded costs, and minimum liquidity with contingency.

**Law/config:** keep Ontario's 10% statutory holdback distinct from lender advance/retainage ([Construction Act, s. 22](https://www.ontario.ca/laws/statute/90c30)).

### 12. Draw Schedule Builder

**Inputs:** stages, budget categories, planned dates, completion/evidence requirements, advance rules, holdbacks, and responsible party.

**Model:** editable milestone dependency graph plus draw table. Validate that stage budgets sum to total eligible and total project cost; cumulative advances cannot exceed commitment or eligible-cost cap; dates must follow dependencies; final draw includes unresolved holdback/deficiency flags. PDF/CSV is a generated planning artifact, not lender authorization.

**Source-backed fields:** prompt payment and statutory holdback are configurable Ontario legal fields ([Construction Act](https://www.ontario.ca/laws/statute/90c30)); all lender draw rules are commitment-specific.

### 13. Interest Carry by Draw Calculator

**Inputs:** each dated advance/repayment; rate schedule; compounding/day-count; paid-current vs capitalized interest; standby/commitment fees; term end.

**Model:** split the timeline at every cash flow and rate change. `interest_segment = openingBalance × applicableRate × dayFraction`; then post interest/payment/advance. Report monthly interest, capitalized balance, total carry, and comparison with interest on full commitment. Do not accrue on undrawn commitment unless a user-entered standby fee applies.

**Verification:** for a single advance and no payment, result must equal the contract's simple/compound convention; adding a later draw cannot change interest before that date.

### 14. Cost-to-Complete Stress Test

**Inputs:** remaining line-item budget, committed contracts, unpaid work, contingencies, approved undrawn funds, cash, receivables available to project, lender exclusions/holdbacks, overrun scenarios.

**Model:** `fundsAvailable = unrestrictedCash + collectibleReceivables + eligibleUndrawnFunds`; `stressedCostToComplete = remainingCost × (1+overrun) + knownChanges + financingCarry`; `surplus = fundsAvailable - stressedCostToComplete`. Show base and downside by date, not only totals. Avoid double-counting budget contingency already embedded in line items.

**Risk:** construction liens can affect mortgage priority and advances; this tool does not determine lien priority ([Construction Act, s. 78](https://www.ontario.ca/laws/statute/90c30)).

### 15. Change-Order Impact Calculator

**Inputs:** direct change cost/credit, taxes, contractor markup, timing, schedule days, contingency funding, draw eligibility, borrowing rate/fees, and delayed-revenue/soft-cost effects.

**Model:** `allInChange = directCost + markup + taxes + incrementalSoftCosts + incrementalFinancingCarry + delayCost - credits`; reduce remaining contingency and update draw/liquidity schedules. Financing carry must be calculated on dated incremental cash needs, not `changeCost × annualRate × entireProjectTerm`.

**Outputs:** revised budget, contingency remaining, peak gap delta, carry delta, completion-date delta, and any takeout gap delta.

### 16. Construction Delay Carry Calculator

**Inputs:** delay start/length; outstanding debt schedule; rates; monthly fixed soft costs; insurance, taxes, security, utilities, rent/interest lost; expected exit proceeds and transaction costs.

**Model:** extend the base ledger by weekly or daily increments. Incremental delay cost equals incremental debt carry plus time-dependent project costs plus foregone net operating/sale cash flow, with categories shown separately. Do not include lost gross rent without related vacancy/operating assumptions.

**Outputs:** cost per week/month, cumulative delay cost, revised project margin, and break-even sale price/rent change.

### 17. Builder Liquidity Waterfall

**Inputs:** opening unrestricted cash; dated receivables with confidence/timing; equity/loan commitments; payables; payroll; deposits; draws; taxes; holdbacks; restricted cash; minimum operating buffer.

**Model:** weekly liquidity recurrence with inflows weighted only in an explicitly named probability scenario. Restricted cash cannot cure an unrestricted cash deficit. Report first deficit date, peak deficit, lowest buffer, and sources/uses contribution.

**Assumptions:** receivable probability and timing are user estimates. Never call committed but conditional lender funds “available cash.”

### 18. Construction Draw Evidence Pack Generator

**Inputs:** project/stage, lender checklist/template, work completed, documents available, issuer/date/version, and file metadata.

**Model:** rule matrix creates manifest with unique IDs, required/conditional status, owner, received date, freshness, and unresolved discrepancy. It may hash files and detect missing metadata but must not opine that invoices, statutory declarations, permits, title, inspections, or lien status are legally sufficient.

**Regulatory anchor:** brokered construction/development investment disclosure requires the applicable FSRA addendum; this operational pack is not a substitute ([FSRA disclosure forms](https://www.fsrao.ca/industry/mortgage-brokering/forms-mortgage-brokering/mortgage-brokerage-disclosure-forms)).

### 19. Project Feasibility Sensitivity Grid

**Inputs:** land/acquisition, hard/soft/financing costs, schedule, units, rents or sale prices, vacancy, operating expenses, cap rate, debt terms, selling costs, taxes (optional and separately reviewed).

**Model:** for rental, calculate EGI, NOI, value, DSCR, constrained debt, equity need, yield on cost (`NOI/totalProjectCost`), and margin (`value - totalProjectCost`). For sale, calculate net sales proceeds and profit/margin. Run two-dimensional grids such as cost overrun × rent, rate × cap rate, or delay × exit value. Never mix rental capitalized value and for-sale proceeds in one return metric.

**Outputs:** controlling constraint and transparent formula trace, not “feasible/not feasible.”

### 20. Stalled Build Triage Tool

**Inputs:** stage; permits/inspections; title/liens/arrears; contract status; remaining budget; cash/undrawn funds; safety/weatherization; maturity; professional team status.

**Model:** deterministic issue map, not a risk score. Critical answers trigger parallel professional paths: immediate safety/building issue, lawyer/title/lien review, quantity surveyor/cost-to-complete, lender consent/waiver, contractor/procurement, and permit/inspection. Show unresolved dependencies and export questions.

**Legal boundary:** the tool must not conclude lien expiry/priority or permit compliance. Ontario's building authority may issue compliance/unsafe-building orders, and permit/inspection status belongs to the chief building official ([Building Code Act](https://www.ontario.ca/laws/statute/92b23)).

## C. Garden-suite, laneway-suite, and multiplex tools

### 21. Garden Suite Financing Stack Calculator

**Inputs:** hard/soft/servicing/permit/contingency/financing costs; existing secured debt; equity; draw schedule; loan terms; projected rent/vacancy/expenses; appraised-value and takeout assumptions.

**Model:** combine construction liquidity with stabilized NOI/DSCR/loan constraints. Report all-in cost, peak construction gap, interest carry, stabilized NOI, indicative debt service coverage, potential takeout under user LTV/DSCR/value assumptions, and remaining equity gap.

**Planning boundary:** Toronto permits garden suites subject to zoning/performance standards in named residential zones, while former-by-law properties require separate contact/review; no financial input establishes zoning permission ([City of Toronto garden suites](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/)).

### 22. Garden Suite Cost-to-Rent Break-Even Tool

**Inputs:** all-in incremental project cost; financing; rent; vacancy; operating expenses; maintenance/capital reserve; rent/cost growth scenarios; analysis horizon.

**Model:** `annualNOI = rent×12×(1-vacancy) + otherIncome - operatingExpenses`; `simplePayback = allInCost / annualNOI` only when NOI is positive. Also show leveraged cash flow, cumulative undiscounted payback, and NPV at a user-entered discount rate. Do not include property appreciation unless explicitly entered and separately displayed.

**Output label:** scenario estimate—not appraisal, market-rent opinion, tax advice, or investment recommendation.

### 23. Garden Suite Site-and-Finance Readiness Checklist

**Inputs:** municipality/property zone source, lot/access facts, trees, utilities, existing debt/equity, design/permit/evidence status.

**Model:** rule-driven questions and dependencies, never automated approval. Toronto-specific checks include 569-2013 versus former by-law, garden versus laneway context, access/fire route, trees, zoning, drawings/design qualifications, and utilities. Toronto's official permit guide requires building/fire access and prescribed documentation, and directs tree-impact cases to City Planning/Urban Forestry ([Toronto garden-suite permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-garden-suite/)).

### 24. Toronto Multiplex Pro Forma

**Inputs:** existing property cost/value/debt; 2/3/4-unit plan; construction and soft costs; schedule; rents/vacancy/expenses; cap rate; construction and takeout debt terms.

**Model:** same rental feasibility engine, with existing asset and incremental project shown separately. Report total and incremental cost, stabilized NOI, value range, DSCR, construction peak gap, constrained takeout, and equity remaining. Permit/zoning path is an external dependency.

**Planning source:** Toronto's adopted multiplex amendment permits duplexes, triplexes, and fourplexes in RD, RS, and RT zones subject to applicable regulations; setbacks and exceptions remain property-specific ([Toronto Multiplex Study](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/); [City multiplex considerations](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/considerations-when-building-multiplexes/)).

### 25. Density Uplift Scenario Tool

**Inputs:** “as-is” units/rent/value/costs and proposed units/rent/value/costs, schedule, debt, vacancy, cap rate, and disposition costs.

**Model:** calculate both whole-project and incremental deltas: `incrementalNOI`, `incrementalValue`, `incrementalCost`, `incrementalEquity`, `incrementalDebtCapacity`, and `valueCreated = incrementalValue - incrementalCost`. If the existing units lose income during work, include that lost NOI as a dated project cost.

**Boundary:** call results density **financial scenarios**, not entitlement or appraisal conclusions.

### 26. Bridge-to-Takeout Calculator

**Inputs:** construction/bridge balance at stabilization; NOI; value or cap-rate range; takeout rate/amortization; minimum DSCR; LTV cap; eligible costs; fees/premium; closing date.

**Model:** calculate loan-by-value, loan-by-DSCR, and any program/cost cap, then take their minimum. `equityGap = bridgePayout + takeoutCosts - netTakeoutProceeds`. Show which constraint controls and sensitivities for NOI/rate/cap rate.

**Boundary:** maximum loan is a mathematical scenario, not lender/CMHC approval. For MLI Select, use the dedicated versioned product constraints below.

### 27. Permit and Financing Timeline Planner

**Inputs:** municipality/project type/status; zoning/variance/applicable-law dependencies; design milestones; complete-application target; permit review; construction; inspections; occupancy; finance conditions and expiry dates.

**Model:** dependency graph with forward earliest dates and backward latest dates from financing expiry/target start. Distinguish statutory/service-standard review from user allowance and elapsed end-to-end time. In Ontario, a municipality must decide on a complete house permit application within the prescribed timeframe (10 days is the official example), but zoning/applicable-law issues must be resolved before issuance ([Ontario building-permit guide](https://www.ontario.ca/document/citizens-guide-land-use-planning/building-permits)). Toronto says complete house applications are reviewed within 10 business days; incomplete applications have no review timeframe ([Toronto review streams](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-review-streams/)).

**Do not** advertise the 10-day review period as total permit duration.

### 28. Utility/Servicing Allowance Stress Test

**Inputs:** service categories/lengths; contractor/utility quotes and dates; allowances; taxes; contingency; escalation; schedule impacts; financing rate.

**Model:** line-item base/low/high estimate. For each item, use quote if present, otherwise allowance; apply escalation only from estimate date to spend date, then contingency to the specified eligible base. Add incremental delay carry through the delay calculator. Report allowance variance and project/peak-liquidity impact.

**Boundary:** no default cost-per-foot may be described as an official utility price. Output is not a quote; service-provider confirmation is required.

## D. MLI Select and rental-housing tools

### Current official rules to version

CMHC's current product scope includes new and existing standard rental, SRO, supportive housing and retirement homes; student housing may qualify only through energy and accessibility. Projects generally require at least 5 units, except retirement homes require 50 units/beds; non-residential space cannot exceed 30% of gross floor area or 30% of total lending value ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

The current points configuration is:

| Outcome | New construction | Existing property | Points |
|---|---:|---:|---:|
| Affordability level 1 | ≥10% units | ≥40% units | 50 |
| Affordability level 2 | ≥15% units | ≥60% units | 70 |
| Affordability level 3 | ≥25% units | ≥80% units | 100 |
| Affordability duration | 20+ years (10-year minimum otherwise) | same | +30 |
| Energy level 1 | ≥25% better than NECB Tier 1 **or** ≥20% better than NBC Tier 1 | ≥15% reduction in both energy and GHG from baseline | 20 |
| Energy level 2 | ≥50% NECB **or** ≥40% NBC | ≥25% reduction in both | 35 |
| Energy level 3 | ≥60% NECB **or** ≥70% NBC | ≥40% reduction in both | 50 |
| Accessibility level 1 | qualifying pathway plus baseline | same | 20 |
| Accessibility level 2 | higher qualifying pathway plus baseline | same | 30 |

Affordability means rents at or below 30% of the subject market's median renter income; required unit count is `ceil(totalUnits × tierPercentage)` ([CMHC MLI Select fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)). The rent threshold must come from the current CMHC market dataset; when market data is unavailable, CMHC may accept comparable/provincial/rural-centre data, so the calculator must return “CMHC/lender determination required” rather than silently map a market ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

Accessibility points require **all** units to be visitable and common areas barrier-free under CSA B651:23. Level 1 then requires ≥15% accessible units, ≥15% universal-design units, or RHFAC v4.0 score 60–79%. Level 2 requires ≥15% accessible plus ≥85% universal design, 100% universal design, 100% accessible, or RHFAC v4.0 Gold (≥80%) ([CMHC fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)). “Planned” and “professionally documented” must be separate evidence states; CMHC uses qualified-professional attestations for energy and architect/designated-consultant attestations for accessibility ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

| Total points | New construction | Existing property | Max amortization | Recourse | Premium discount |
|---:|---:|---:|---:|---|---:|
| 50–69 | up to 95% LTC | up to 85% LTV | up to 40 years | full | 10% |
| 70–99 | up to 95% LTC | up to 95% LTV | up to 45 years | full | 20% |
| 100+ | up to 95% LTC | up to 95% LTV | up to 50 years | limited | 30% |

Amortization cannot exceed remaining economic life. Minimum DCR is 1.10 for standard rental, 1.20 for other shelter models, and 1.40 for non-residential space ([CMHC fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)). The discounts apply to base premium plus applicable surcharges—not percentage-point reductions in the premium rate ([CMHC Multi-unit Fees and Premiums](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf)).

For 2026, CMHC publishes 2.9% as the recommended Ontario CPI when applicable for MLI Select affordable-rent increases, with a changed “lowest CPI” requirement beginning in 2027; this value must be annual versioned data, not code ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

### 29. MLI Select Points and Flexibility Calculator

**Inputs:** project/shelter/new-or-existing type; units; non-residential GFA/value shares; market and CMHC income-data vintage; proposed rents/unit count; affordability years; energy path/performance; accessibility path; evidence state.

**Model:** run scope flags first. Calculate affordability unit requirements with ceiling and count only entered rents at/below official threshold. Award only the highest supported tier per category; add 30 duration points only if an affordability tier is earned and commitment is ≥20 years. For existing energy, award the lower tier supported by energy and GHG reductions. Enforce accessibility baseline before pathway points. Sum categories, determine 50/70/100 tier, gap to next tier, and published flexibilities.

**Output:** preliminary modeled scenario, unresolved evidence, rules/data version, and source links—not eligibility, approval, premium quote, or commitment.

### 30. MLI Select Capital Stack Model

**Inputs:** verified/modelled tier; eligible cost/value; NOI; bridge balance; rate/amortization; residential/non-residential allocations; current premium and surcharge table; other debt; fees/equity.

**Model:** calculate loan-by-LTC/LTV, loan-by-DSCR, and other entered lender caps; take minimum. Calculate premium from current CMHC schedule by shelter, purpose, and LTV band, add applicable surcharges, then apply tier discount to base plus surcharges. Do not finance provincial premium tax. Build construction-to-term dated sources/uses and report equity/takeout gap.

**Source:** current rates, surcharges, application fees, and discounts are published separately from the points fact sheet and must be versioned ([CMHC Fees and Premiums](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf)).

### 31. MLI Select Affordability Commitment Model

**Inputs:** official market/data vintage and threshold; unit mix; base/proposed rents; selected committed units; 10/20+ years; legal rent-increase regime; scenario CPI/growth.

**Model:** calculate required count by tier, qualifying entered units, annual committed and uncommitted gross rent, and revenue difference by year. Apply the legally/program-permitted annual increase to committed base rent and the user scenario to comparison rent. Do not imply future market rent. Show annual compliance checkpoints and cumulative nominal/discounted revenue trade-off.

**Rule:** affordability uses 30% of median renter income and annual increases are limited by applicable law/regulation or CMHC's applicable CPI rule where none applies ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

### 32. MLI Select DSCR and Maximum-Loan Explorer

**Inputs:** NOI; rate/compounding; amortization up to tier/economic-life cap; selected minimum DCR; value/cost and tier caps.

**Model:** `maxAnnualDebtService = NOI/minDCR`; solve the annuity present value for principal at the selected payment frequency, then constrain by LTV/LTC. If interest-only, principal by DSCR is `maxAnnualDebtService/annualInterestRate` only when convention is compatible. Show controlling constraint and sensitivities. Mixed residential/non-residential income requires separately entered allocation and DCR treatment, not one blended threshold.

**Source:** current DCR and tier caps are in CMHC's fact sheet ([CMHC MLI Select](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)).

### 33. Energy Upgrade Finance Trade-off

**Inputs:** current/target professional energy results; new/existing baseline; upgrade cost/timing; points before/after; financing and premium assumptions; quantified utility savings if supported.

**Model:** use the points engine for tier delta, capital-stack engine for debt/equity/premium delta, and dated cash flows for upgrade cost/savings. Report incremental cost, financing capacity delta, premium delta, cash-flow payback/NPV, and evidence gap. Never translate an undocumentable target into earned points.

**Evidence:** CMHC requires qualified-professional attestation and appropriate energy simulation/certification; local-code modelling is not accepted in place of the specified national baselines ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

### 34. Accessibility Upgrade Finance Trade-off

**Inputs:** all-unit visitability/common-area baseline status; chosen qualifying path; unit counts; professional evidence state; upgrade cost/timing; points/tier before and after; finance assumptions.

**Model:** enforce baseline and path exactly, calculate point/tier delta, then run incremental cost through capital-stack and cash-flow engines. Report cost, financing/premium sensitivity, and unresolved documentation. Do not assign monetary “benefits” to accessibility beyond entered, evidenced cash flows.

**Evidence:** architect/designated accessibility consultant attestation is required at application under current CMHC materials ([CMHC MLI Select](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)).

### 35. MLI Select Document Readiness Matrix

**Inputs:** new/existing; shelter; affordability/energy/accessibility paths; construction timing; application/advance status; document/evidence owner, date, status.

**Model:** versioned matrix maps each commitment to application, pre-advance, post-final-advance, and annual-compliance evidence. CMHC currently distinguishes evidence before application, within 60 days after last insured advance, or within 24 months where improvements use other resources; affordability compliance continues throughout the commitment ([CMHC fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)).

**Output:** missing/stale/owner/dependency list; no approval score.

### 36. Insured Takeout Readiness Tracker

**Inputs:** commitment conditions; construction completion; permits/occupancy; final advance; lease-up/NOI; 12-month stabilization where applicable; appraisals; title/environmental/evidence; bridge maturity.

**Model:** milestone dependency graph with condition status, owner, due date, evidence, and slack against bridge maturity. A financial readiness panel recalculates NOI, DSCR, value, constrained loan, and payout gap; an evidence panel never treats planned items as satisfied.

**Rule:** CMHC's current fact sheet describes guarantee changes after projected rents are achieved and stabilized for 12 consecutive months, subject to underwriting and additional mitigants ([CMHC fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)). Track the condition; do not predict CMHC release.

## E. Private-mortgage investor tools

### 37. Investor Net-Yield Stress Test

**Inputs:** funded amount/date; coupon/payment terms; lender-paid and received fees; servicing/admin/legal costs; payment dates; arrears/delay; extension; recovery proceeds/date; loss; tax excluded unless separately reviewed.

**Model:** investor-view dated cash flows. Report cash coupon received, fees, costs, principal returned, net profit/loss, money-weighted annualized return (XIRR convention), and duration. Stress missed payments, delayed recovery, cost, and loss separately. Accrued interest is not a cash receipt; show accrual and realized cash yield separately.

**Risk disclosure:** FSRA warns mortgage investments are not government/investor-protection-fund insured, payments cannot continue through an administrator if the borrower does not pay, liquidity/resale is not assured, and principal can be lost ([FSRA Form 1](https://www.fsrao.ca/media/6536/download)).

### 38. LTV vs Loss-Severity Explorer

**Inputs:** property-value range; senior claims; subject advance; later claims; sale/enforcement/carry costs; accrued interest; recovery time.

**Model:** apply the legally reviewed waterfall to net proceeds, then calculate subject-mortgage recovery, loss dollars, loss rate, and realized annualized return across value/cost/time. `lossSeverity = max(0, amountDue - recovery)/amountDue`. LTV alone must not replace claim priority and costs.

**Sources:** FSRA expressly warns appraisal value can fall and affect recovery; the Mortgages Act sets a sale-proceeds sequence for a statutory power ([FSRA Form 1](https://www.fsrao.ca/media/6536/download); [Mortgages Act, s. 27](https://www.ontario.ca/laws/statute/90m40)).

### 39. Mortgage Portfolio Concentration Heatmap

**Inputs:** current outstanding principal/commitment and tags for borrower/related group, geography, property/use, lien position, maturity month, administrator/lender, and status.

**Model:** denominator defaults to current outstanding principal; optionally show committed exposure separately. For each dimension, `concentrationShare = exposureInBucket/totalExposure`; show top-N, maturity bands, and Herfindahl-Hirschman Index `Σ share²` only as a descriptive statistic. Related borrowers must be user-mapped; the tool cannot infer control relationships.

**Output:** concentration flags against user/investment-policy limits, not regulatory capital limits or a risk grade.

### 40. Maturity Ladder and Liquidity Planner

**Inputs:** scheduled maturity/principal; contractual extensions; probability/delay scenarios; expected interest; investor cash needs/commitments.

**Model:** monthly low/base/high capital-return schedules. Do not probability-weight unless explicitly selected; show contracted maturity separately from expected receipt. `netLiquidity_t = openingCash + realizedInflows - commitments - expenses`; report first shortfall and cumulative unreturned principal.

**Risk:** FSRA warns early withdrawal can require a new investor and no resale/transfer market is assured; extension terms may prevent opting out ([FSRA Form 1](https://www.fsrao.ca/media/6536/download)).

### 41. First vs Second Mortgage Risk Comparator

**Inputs:** same deal facts for both positions—advance, total senior debt, value range, priority claims, terms, borrower/project, exit, costs, and enforcement assumptions.

**Model:** normalize LTV (`subject balance/value`) and cumulative LTV (`all debt through subject position/value`), then apply the loss-severity waterfall. Compare payment priority, recovery sensitivity, cash-flow return, maturity, and diligence differences. Do not assign a universal numeric score or imply every first mortgage is safer than every second mortgage.

**Source:** FSRA's prescribed disclosure requires transaction-specific property, mortgage, appraisal, borrower, use-of-funds, and risk information ([FSRA Form 1](https://www.fsrao.ca/media/6536/download)).

### 42. Investor File Review Worksheet

**Inputs:** structured fields mirroring current FSRA disclosure plus supporting-document status, reviewer notes, decisions, exceptions, and follow-ups.

**Model:** immutable review snapshot with `present/missing/stale/unverified`, source document, reviewer, and timestamp. Prepopulate sections for parties/relationships/conflicts, property/value/zoning/taxes, mortgage terms/priority, borrower capacity, use/exit, administration, fees, defaults, construction addendum, and legal advice. Completeness can be counted but must not become a suitability or investment score.

**Regulatory anchor:** Form 1 is required for prospective lenders/investors outside the designated class in covered brokered transactions, includes material-risk and conflict disclosure, and generally must be delivered at least two business days before commitment unless the prescribed waiver process applies ([FSRA forms page](https://www.fsrao.ca/industry/mortgage-brokering/forms-mortgage-brokering/mortgage-brokerage-disclosure-forms); [FSRA Form 1](https://www.fsrao.ca/media/6536/download)). The worksheet supplements; it never replaces the prescribed form or independent legal advice.

## Cross-calculator correctness and QA specification

### Golden calculation cases

1. **Zero-rate amortization:** `$120,000`, 120 monthly payments, 0% produces `$1,000` payments and zero interest.
2. **Interest-only:** balance remains constant until payout; total interest equals the sum of contractual-period interest.
3. **Draw timing:** a second draw cannot change interest or liquidity before its date.
4. **Fee treatment:** a fee paid in cash affects closing cash but not balance; a deducted fee reduces net proceeds; a capitalized fee increases balance and later interest.
5. **Break-even:** identical alternatives return break-even at time zero and zero NPV difference.
6. **LTV:** at property value equal to debt plus modeled costs, net cushion is zero.
7. **Construction holdback:** statutory holdback and lender retainage appear as separate ledger lines and are never double-counted.
8. **DSCR:** increasing NOI cannot lower loan-by-DSCR; increasing rate, amortization held constant, cannot raise it.
9. **Constraint:** constrained loan always equals the minimum enabled cap; disabling one cap cannot reduce the result.
10. **MLI unit rounding:** 41 units at 10% requires 5 units (`ceil(4.1)`), not 4.
11. **MLI existing energy:** 30% energy reduction plus 20% GHG reduction earns only the 15%/20-point tier.
12. **MLI accessibility:** qualifying unit percentages with failed all-unit visitability baseline earn zero accessibility points.
13. **MLI affordability bonus:** 20-year selection with no affordability tier earns no 30-point bonus.
14. **Premium discount:** discount is applied after base premium plus applicable surcharges; 10% means multiply by `0.90`, not subtract 10 percentage points from the rate.
15. **Loss waterfall:** proceeds distributed never exceed net sale proceeds; recovery per claim never exceeds amount due.
16. **XIRR:** reject all-positive/all-negative cash flows and surface multiple/no-root cases rather than invent a rate.

### Property-based invariants

- No schedule may create or destroy principal except a modeled advance, repayment, capitalization, or write-off.
- Sum of displayed category costs must reconcile exactly to displayed total cost after rounding allocation.
- Increasing a cost or delaying a receipt, with all else fixed, cannot improve borrower cash flow, project liquidity, or investor recovery.
- Changing only display frequency must not change economics.
- Saved results must reproduce from inputs plus rule/data versions.
- Every external rule-derived number must expose its source, vintage, and verified date.

### Required compliance review before launch

Counsel/compliance should review: use of “APR” and the statutory cost-of-borrowing implementation; Criminal Code rate screening/exceptions; commitment comparison language; power-of-sale waterfall and priority assumptions; lien/holdback prompts; investor suitability/disclosure interactions; privacy/retention of uploaded documents; and every MLI Select eligibility/flexibility statement. The product should state prominently that outputs are preliminary scenarios and do not constitute approval, an offer, a commitment, an appraisal, a zoning determination, or professional advice.

## Primary-source register

- [Interest Act, s. 6](https://laws-lois.justice.gc.ca/eng/acts/I-15/section-6.html)
- [Criminal Code, s. 347](https://laws-lois.justice.gc.ca/eng/acts/c-46/section-347.html)
- [Criminal Interest Rate Regulations](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2024-114/FullText.html)
- [Mortgage Brokerages, Lenders and Administrators Act, 2006](https://www.ontario.ca/laws/statute/06m29)
- [O. Reg. 191/08 — Cost of Borrowing and Disclosure to Borrowers](https://www.ontario.ca/laws/regulation/r08191)
- [FSRA mortgage brokerage disclosure requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements)
- [FSRA mortgage brokerage disclosure forms](https://www.fsrao.ca/industry/mortgage-brokering/forms-mortgage-brokering/mortgage-brokerage-disclosure-forms)
- [FSRA Form 1 — Investor/Lender Disclosure Statement](https://www.fsrao.ca/media/6536/download)
- [FCAC mortgage prepayment penalties](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html)
- [Mortgages Act, R.S.O. 1990, c. M.40](https://www.ontario.ca/laws/statute/90m40)
- [Construction Act, R.S.O. 1990, c. C.30](https://www.ontario.ca/laws/statute/90c30)
- [Building Code Act, 1992](https://www.ontario.ca/laws/statute/92b23)
- [Ontario building-permit guide](https://www.ontario.ca/document/citizens-guide-land-use-planning/building-permits)
- [Toronto Building permit review streams](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-review-streams/)
- [Toronto garden suites](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/)
- [Toronto new garden-suite permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-garden-suite/)
- [Toronto multiplex study](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/)
- [Toronto multiplex considerations](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/considerations-when-building-multiplexes/)
- [CMHC MLI Select product page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect)
- [CMHC MLI Select fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf)
- [CMHC Multi-unit Fees and Premiums](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf)
- [OSFI residential mortgage underwriting guideline B-20](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-2017)
- [Microsoft XIRR specification](https://support.microsoft.com/en-us/office/xirr-function-de1242ec-6477-445b-b11b-a303ad9adc9d)

