# Builder sensitivity underwriting

Snapshot: 2026-07-14

Geography: Greater Toronto Area

Runtime data policy: static snapshot; no request-time market-data calls

The public builder sensitivity console is an illustrative feasibility model. It is not an appraisal, market report, investment forecast, mortgage quote, or financing commitment. Parcel, municipality, tenure, unit mix, affordability program, taxes, HST, fees, borrower strength, and lender underwriting can materially change the result.

## Engine contract

The production UI calls the pure `calculateBuildUnderwriting` engine in `src/components/FairlendBuildModelSection/underwriting.ts`. Market assumptions live separately in `market-data.ts`, including the snapshot date and source URLs. Updating assumptions is therefore an explicit, reviewable release rather than a hidden live-data change.

Invalid, negative, infinite, or non-integral inputs are rejected before calculation. A ratio with no cash denominator returns `null` (`N/M` in the UI), never a fabricated `0.0%`.

## Development uses and construction financing

```text
hard_cost = units × area_per_unit × hard_cost_per_ft²
soft_costs = hard_cost × 12%
contingency = hard_cost × 8%
land_closing = land_basis × 2.5%

construction_loan = (hard_cost + soft_costs + contingency) × 80% LTC
construction_interest = construction_loan × 10% × 50% average draw × 1 year

total_development_cost =
  land_basis
  + land_closing
  + hard_cost
  + soft_costs
  + contingency
  + construction_interest
```

The 12% soft-cost and 8% contingency factors preserve the prior 20% aggregate project allowance while making its components auditable. They remain heuristics. Site work, demolition, development charges, municipal fees, HST treatment, and unusual carrying costs require a project-specific pro forma.

## Rental operations and value

```text
gross_potential_rent = monthly_rent_per_unit × units × 12
vacancy_allowance = gross_potential_rent × 3%
effective_gross_income = gross_potential_rent - vacancy_allowance
operating_expenses = effective_gross_income × 32%
NOI = effective_gross_income - operating_expenses
stabilized_value = NOI ÷ 5% capitalization rate
```

The operating-expense allowance represents a blended provision for property tax, insurance, utilities paid by the owner, management, repairs, maintenance, and replacement reserves. It is not a substitute for an operating budget.

## Permanent takeout sizing

The previous equation sized takeout debt only against 75% of capitalized value, capped it at total development cost, and charged interest-only payments. When value exceeded cost, that could produce 100% financing, `$0 equity required`, positive cash flow, and a false `0.0% cash yield`.

The replacement sizes takeout debt independently under three constraints:

```text
annual_mortgage_constant = monthly-amortizing payment constant at 5% / 30 years

cost_basis_limit = total_development_cost × 100%
LTV_limit = stabilized_value × 75%
DSCR_limit = (NOI ÷ 1.20 minimum DSCR) ÷ annual_mortgage_constant

takeout_loan = min(cost_basis_limit, LTV_limit, DSCR_limit)
annual_debt_service = takeout_loan × annual_mortgage_constant
annual_cash_flow = NOI - annual_debt_service
```

The UI reports the binding constraint. It also calculates any construction-loan takeout shortfall rather than assuming the permanent loan automatically repays construction debt.

## Equity and return definitions

```text
construction_equity = total_development_cost - construction_loan
stabilized_equity = total_development_cost - takeout_loan
peak_equity_required = max(construction_equity, stabilized_equity)
cash_yield = annual_cash_flow ÷ peak_equity_required
```

Peak equity is the denominator because it represents the maximum modeled cash the project must fund. A strong appraisal cannot erase the cash needed during construction. When peak equity is genuinely zero, cash yield is not mathematically meaningful and the UI displays `N/M`.

For an exit strategy, the model deducts a 4% disposition-cost allowance before calculating profit and margin:

```text
net_sale_proceeds = gross_exit_value × (1 - 4%)
profit = net_sale_proceeds - total_development_cost
margin = profit ÷ net_sale_proceeds
```

## Static market evidence

- [CMHC 2025 Rental Market Report](https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/market-reports/rental-market-reports-major-centres?ap=a1-p1): Toronto CMA purpose-built vacancy was 3.0% in 2025.
- [CMHC MLI Select at-a-glance](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf): published minimum DCR is 1.10 for standard rental and 1.20 for other shelter models; the public illustration uses the more conservative 1.20 threshold.
- [Bank of Canada, June 10, 2026](https://www.bankofcanada.ca/2026/06/fad-press-release-2026-06-10/): overnight policy rate 2.25%. The model's 5.0% takeout rate is an illustrative all-in rate, not a quoted product rate.
- [Altus Group 2026 Canadian Cost Guide](https://www.altusgroup.com/featured-insights/canadian-cost-guide/): source for the GTA construction-cost ranges summarized in `docs/builder-consulting-gta-market-research.md`.

The 5% capitalization rate, 32% operating-expense ratio, 75% LTV, construction terms, soft costs, contingency, closing costs, and disposition costs are conservative heuristics for sensitivity analysis. They must be replaced with approved property-specific inputs for underwriting.
