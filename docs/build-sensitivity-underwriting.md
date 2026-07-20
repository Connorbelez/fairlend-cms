# Builder sensitivity underwriting

Snapshot: 2026-07-14

Geography: Greater Toronto Area

Runtime data policy: static snapshot; no request-time market-data calls

The public builder sensitivity console is an illustrative feasibility model. It is not an appraisal, market report, investment forecast, mortgage quote, or financing commitment. Parcel, municipality, tenure, unit mix, affordability program, taxes, HST, fees, borrower strength, and lender underwriting can materially change the result.

## Engine contract

The production UI calls the pure `calculateBuildUnderwriting` engine in `src/components/FairlendBuildModelSection/underwriting.ts`. Market assumptions live separately in `market-data.ts`, including the snapshot date and source URLs. Updating assumptions is therefore an explicit, reviewable release rather than a hidden live-data change.

Invalid, negative, infinite, or non-integral inputs are rejected before calculation. A ratio with no cash denominator returns `null` (`N/M` in the UI), never a fabricated `0.0%`.

## Calculator presets

The console loads on the Multiplex preset. Selecting a different build type resets every editable driver to that preset so values cannot leak between scenarios.

| Preset | Units | Area per unit | Land basis | Hard cost | Monthly rent per unit | Exit value | Default strategy |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Multiplex | 5 | 1,500 ft² | $1.20M | $270/ft² | $3,200 | $4.50M | Exit |
| Garden Suite | 1 | 1,290 ft² | $0 owned-land basis | $420/ft² | $4,200 | N/A | Rent only |
| Single Family Luxury | 1 | 4,500 ft² | $1.20M | $450/ft² | $9,000 | $2.40M* | Exit |
| Single Family | 1 | 2,800 ft² | $1.10M | $300/ft² | $7,500 | $2.20M* | Exit |

`*` The supplied single-family exit values and their modeled profits are presented net of HST. The engine does not deduct HST a second time.

Area per unit is editable from 500–5,000 ft² in 10-ft² increments. Multiplex and Garden Suite retain their existing unit-count ranges. When unit count changes, the exit value scales at the preset or user-selected value per door; for example, the $4.50M five-unit Multiplex preset carries a $900,000 value per door.

## Development uses and construction financing

```text
hard_cost = units × area_per_unit × hard_cost_per_ft²
soft_costs = hard_cost × 12%
contingency = hard_cost × 8%
land_closing = land_basis × 2.5%

construction_loan = (hard_cost + soft_costs + contingency) × 80% LTC

total_development_cost =
  land_basis
  + land_closing
  + hard_cost
  + soft_costs
  + contingency
```

The 12% soft-cost and 8% contingency factors preserve the prior 20% aggregate project allowance while making its components auditable. They remain heuristics. Site work, demolition, development charges, municipal fees, HST treatment, and unusual carrying costs require a project-specific pro forma.

Construction interest is not included in modeled development cost. The public illustration assumes construction financing is refinanced by the permanent takeout mortgage, so neither construction interest nor permanent debt service is deducted from the gross-revenue headline.

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

These operating assumptions are retained only for the internal stabilized-value and takeout-sizing sensitivity. They do not reduce the public gross-revenue result:

```text
gross_monthly_revenue = monthly_rent_per_unit × units
annual_gross_revenue = gross_monthly_revenue × 12
```

The rent-strategy UI displays those gross monthly and annual figures directly. Vacancy, operating expenses, construction interest, and takeout mortgage payments are not deducted from either displayed figure.

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
monthly_takeout_payment = annual_debt_service ÷ 12
annual_cash_flow = NOI - annual_debt_service
net_monthly_cash_flow = annual_cash_flow ÷ 12
```

The UI reports the binding constraint. It also calculates any construction-loan takeout shortfall rather than assuming the permanent loan automatically repays construction debt.

## Equity and return definitions

```text
construction_equity = total_development_cost - construction_loan
stabilized_equity = total_development_cost - takeout_loan
peak_equity_required = max(construction_equity, stabilized_equity)
cash_yield = annual_cash_flow ÷ peak_equity_required
```

Peak equity remains available in the engine for financing sensitivity, but it is not presented as the rent strategy's headline result. The public UI presents gross monthly revenue, annual gross revenue, and the explicit `units × rent per unit` calculation instead of cash yield or net monthly cash flow.

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
- [Altus Group 2026 Canadian Cost Guide](https://www.altusgroup.com/featured-insights/canadian-cost-guide/): source for the GTA construction-cost ranges summarized in `docs/SEO/authority-and-distribution/content-assets/builder-consulting-gta-market-research.md`.

The 5% capitalization rate, 32% operating-expense ratio, 75% LTV, construction LTC, soft costs, contingency, closing costs, and disposition costs are conservative heuristics for sensitivity analysis. They must be replaced with approved property-specific inputs for underwriting.
