/**
 * Static underwriting snapshot used by the public sensitivity model.
 *
 * This file is deliberately data-only: the browser never calls a market-data
 * service. Updating market assumptions is an explicit, reviewable code change.
 */
export const GTA_UNDERWRITING_MARKET_SNAPSHOT = {
  geography: 'Greater Toronto Area',
  id: 'gta-2026-07-14',
  snapshotDate: '2026-07-14',
  assumptions: {
    capitalizationRate: 0.05,
    constructionLoanToCost: 0.8,
    contingencyRate: 0.08,
    dispositionCostRate: 0.04,
    landClosingCostRate: 0.025,
    minimumDebtServiceCoverageRatio: 1.2,
    operatingExpenseRate: 0.32,
    permanentAmortizationYears: 30,
    softCostRate: 0.12,
    takeoutCostBasisLimit: 1,
    takeoutInterestRate: 0.05,
    takeoutLoanToValue: 0.75,
    vacancyRate: 0.03,
  },
  sources: [
    {
      id: 'cmhc-rental-market-2025',
      observation: 'Toronto CMA purpose-built rental vacancy was 3.0% in 2025.',
      title: 'CMHC 2025 Rental Market Report',
      url: 'https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/market-reports/rental-market-reports-major-centres?ap=a1-p1',
    },
    {
      id: 'cmhc-mli-select-2025',
      observation:
        'MLI Select publishes minimum DCR requirements of 1.10 for standard rental and 1.20 for other shelter models; this illustration uses the more conservative 1.20 threshold.',
      title: 'CMHC MLI Select at-a-glance',
      url: 'https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf',
    },
    {
      id: 'bank-of-canada-2026-06-10',
      observation:
        'The overnight policy rate was 2.25% on June 10, 2026. The 5.0% takeout rate is a conservative illustrative all-in rate, not a quoted product rate.',
      title: 'Bank of Canada policy-rate decision',
      url: 'https://www.bankofcanada.ca/2026/06/fad-press-release-2026-06-10/',
    },
    {
      id: 'altus-cost-guide-2026',
      observation:
        'The repository research records a $210-$330/ft² GTA low-rise wood-frame benchmark; site-specific infill can cost more.',
      title: 'Altus Group 2026 Canadian Cost Guide',
      url: 'https://www.altusgroup.com/featured-insights/canadian-cost-guide/',
    },
  ],
} as const

export type BuildModelAssumptions = {
  capitalizationRate: number
  constructionLoanToCost: number
  contingencyRate: number
  dispositionCostRate: number
  landClosingCostRate: number
  minimumDebtServiceCoverageRatio: number
  operatingExpenseRate: number
  permanentAmortizationYears: number
  softCostRate: number
  takeoutCostBasisLimit: number
  takeoutInterestRate: number
  takeoutLoanToValue: number
  vacancyRate: number
}

export const BUILD_MODEL_ASSUMPTIONS: BuildModelAssumptions =
  GTA_UNDERWRITING_MARKET_SNAPSHOT.assumptions
