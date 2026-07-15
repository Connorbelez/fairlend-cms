import type {
  CalculatorAssumption,
  CalculatorDefinition,
  CalculatorField,
  CalculatorResultDefinition,
  CalculatorSource,
} from './types'

const VERIFIED_AT = '2026-07-14'

const sources = {
  constructionAct: {
    organization: 'Government of Ontario',
    title: 'Construction Act, R.S.O. 1990, c. C.30',
    url: 'https://www.ontario.ca/laws/statute/90c30',
    verifiedAt: VERIFIED_AT,
  },
  costOfBorrowing: {
    organization: 'Government of Ontario',
    title: 'O. Reg. 191/08 — Cost of Borrowing and Disclosure to Borrowers',
    url: 'https://www.ontario.ca/laws/regulation/r08191',
    verifiedAt: VERIFIED_AT,
  },
  fsraDisclosure: {
    organization: 'Financial Services Regulatory Authority of Ontario',
    title: 'Mortgage brokerage disclosure requirements',
    url: 'https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements',
    verifiedAt: VERIFIED_AT,
  },
  fsraForm1: {
    organization: 'Financial Services Regulatory Authority of Ontario',
    title: 'Form 1 — Investor/Lender Disclosure Statement',
    url: 'https://www.fsrao.ca/media/6536/download',
    verifiedAt: VERIFIED_AT,
  },
  interestAct: {
    organization: 'Government of Canada',
    title: 'Interest Act, section 6',
    url: 'https://laws-lois.justice.gc.ca/eng/acts/I-15/section-6.html',
    verifiedAt: VERIFIED_AT,
  },
  mortgagesAct: {
    organization: 'Government of Ontario',
    title: 'Mortgages Act, R.S.O. 1990, c. M.40',
    url: 'https://www.ontario.ca/laws/statute/90m40',
    verifiedAt: VERIFIED_AT,
  },
  mli: {
    effectiveDate: '2026-01-01',
    organization: 'Canada Mortgage and Housing Corporation',
    title: 'MLI Select product page and current requirements',
    url: 'https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect',
    verifiedAt: VERIFIED_AT,
  },
  mliFactSheet: {
    organization: 'Canada Mortgage and Housing Corporation',
    title: 'MLI Select fact sheet',
    url: 'https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf',
    verifiedAt: VERIFIED_AT,
  },
  mliPremiums: {
    organization: 'Canada Mortgage and Housing Corporation',
    title: 'MLI Select multi-unit fees and premiums',
    url: 'https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf',
    verifiedAt: VERIFIED_AT,
  },
  ontarioPermits: {
    organization: 'Government of Ontario',
    title: 'Citizen’s guide to building permits',
    url: 'https://www.ontario.ca/document/citizens-guide-land-use-planning/building-permits',
    verifiedAt: VERIFIED_AT,
  },
  torontoGardenSuites: {
    organization: 'City of Toronto',
    title: 'Garden suites',
    url: 'https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/',
    verifiedAt: VERIFIED_AT,
  },
  torontoMultiplex: {
    organization: 'City of Toronto',
    title: 'Multiplex study',
    url: 'https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/',
    verifiedAt: VERIFIED_AT,
  },
} as const satisfies Record<string, CalculatorSource>

const commonAssumptions = [
  { label: 'Currency', status: 'published', value: 'CAD' },
  { label: 'Calculation precision', status: 'illustrative', value: 'Full precision; display rounded' },
] as const satisfies readonly CalculatorAssumption[]

function currency(key: string, label: string, defaultValue: number, group?: string): CalculatorField {
  return { defaultValue, group, key, label, min: 0, step: 100, type: 'currency' }
}

function percent(key: string, label: string, defaultValue: number, group?: string): CalculatorField {
  return { defaultValue, group, key, label, max: 1, min: 0, step: 0.001, type: 'percent' }
}

function numberField(key: string, label: string, defaultValue: number, group?: string, min = 0): CalculatorField {
  return { defaultValue, group, key, label, min, step: 1, type: 'number' }
}

function dateField(key: string, label: string, defaultValue: string, group?: string): CalculatorField {
  return { defaultValue, group, key, label, type: 'date' }
}

function toggle(key: string, label: string, defaultValue = false, group?: string): CalculatorField {
  return { defaultValue, group, key, label, type: 'toggle' }
}

function selectField(key: string, label: string, defaultValue: string, options: readonly string[], group?: string): CalculatorField {
  return {
    defaultValue,
    group,
    key,
    label,
    options: options.map((value) => ({ label: value, value: value.toLowerCase().replaceAll(' ', '-') })),
    type: 'select',
  }
}

function result(key: string, label: string, format: CalculatorResultDefinition['format'], emphasis = false): CalculatorResultDefinition {
  return { emphasis, format, key, label }
}

function definition(
  value: Omit<CalculatorDefinition, 'assumptions'> & { assumptions?: readonly CalculatorAssumption[] },
): CalculatorDefinition {
  return { ...value, assumptions: value.assumptions ?? commonAssumptions }
}

const privateMortgageTools: CalculatorDefinition[] = [
  definition({
    slug: 'private-mortgage-total-cost',
    title: 'Private Mortgage Total-Cost Calculator',
    category: 'private-mortgage', kind: 'calculator', model: 'private-total-cost',
    description: 'See the complete modeled cost stack—not just the stated rate—through a selected payout date.',
    fields: [
      currency('principal', 'Mortgage advance', 500_000, 'Mortgage terms'),
      percent('interestRate', 'Nominal annual rate', 0.1099, 'Mortgage terms'),
      selectField('compounding', 'Compounding basis', 'semi-annually', ['Semi-annually', 'Monthly'], 'Mortgage terms'),
      toggle('interestOnly', 'Interest-only payments', true, 'Mortgage terms'),
      numberField('amortizationYears', 'Amortization', 25, 'Mortgage terms', 1),
      numberField('termMonths', 'Modeled holding period (months)', 12, 'Mortgage terms', 1),
      currency('lenderFee', 'Lender fee', 10_000, 'Closing and exit costs'),
      currency('brokerFee', 'Brokerage fee', 5_000, 'Closing and exit costs'),
      currency('legalFee', 'Legal cost', 2_500, 'Closing and exit costs'),
      currency('appraisalFee', 'Appraisal cost', 750, 'Closing and exit costs'),
      currency('prepaidInterest', 'Prepaid interest', 0, 'Closing and exit costs'),
      currency('renewalFee', 'Renewal or extension fee', 0, 'Closing and exit costs'),
      currency('dischargeFee', 'Discharge or payout charge', 750, 'Closing and exit costs'),
    ],
    results: [result('totalCost', 'Total modeled financing cost', 'currency', true), result('monthlyPayment', 'Monthly payment', 'currency'), result('interestCost', 'Interest over holding period', 'currency'), result('cashAtClosing', 'Cash costs at closing', 'currency'), result('remainingBalance', 'Modeled payout balance', 'currency'), result('annualizedCost', 'Simple annualized scenario cost', 'percent')],
    formulaSummary: ['Convert the quoted nominal rate using its selected compounding basis.', 'Generate the payment and remaining-balance schedule.', 'Add interest and entered fees; principal repayment is not counted as financing cost.'],
    sources: [sources.interestAct, sources.costOfBorrowing, sources.fsraDisclosure],
  }),
  definition({
    slug: 'private-mortgage-exit-runway', title: 'Private Mortgage Exit Runway Calculator',
    category: 'private-mortgage', kind: 'planner', model: 'exit-runway',
    description: 'Work backward from maturity to find the latest modeled start date for the selected exit route.',
    fields: [dateField('closingDate', 'Closing date', '2026-08-01'), numberField('termMonths', 'Initial term (months)', 12, undefined, 1), numberField('extensionMonths', 'Contractual extension modeled (months)', 0), selectField('exitRoute', 'Exit route', 'refinance', ['Refinance', 'Sale', 'Construction']), numberField('refinanceMonths', 'Refinance work time (months)', 4), numberField('saleMonths', 'Sale work time (months)', 5), numberField('constructionMonths', 'Construction completion time (months)', 8), numberField('bufferMonths', 'Contingency buffer (months)', 2)],
    results: [result('latestStartDate', 'Latest modeled start date', 'date', true), result('maturityDate', 'Modeled maturity', 'date'), result('runwayMonths', 'Runway from closing', 'months'), result('riskFlag', 'Planning flag', 'text')],
    formulaSummary: ['Maturity equals closing plus entered term and any selected contractual extension.', 'Latest start equals maturity less route duration and contingency buffer.'], sources: [sources.fsraDisclosure],
  }),
  definition({
    slug: 'blended-cost-second-mortgage', title: 'Blended Cost of a Second Mortgage',
    category: 'private-mortgage', kind: 'calculator', model: 'blended-second',
    description: 'View both liens as one debt position while keeping their separate terms visible.',
    fields: [currency('firstBalance', 'First mortgage balance', 650_000, 'First mortgage'), percent('firstRate', 'First mortgage rate', 0.0499, 'First mortgage'), currency('firstPayment', 'First monthly payment', 3_800, 'First mortgage'), currency('secondBalance', 'Second mortgage advance', 200_000, 'Second mortgage'), percent('secondRate', 'Second mortgage rate', 0.1199, 'Second mortgage'), currency('secondPayment', 'Second monthly payment', 2_000, 'Second mortgage'), currency('secondFee', 'Second mortgage fees', 8_000, 'Second mortgage'), numberField('holdingMonths', 'Analysis horizon (months)', 12)],
    results: [result('monthlyDebtService', 'Combined monthly debt service', 'currency', true), result('weightedRate', 'Balance-weighted stated rate', 'percent'), result('holdingCost', 'Payments plus second-mortgage fee', 'currency'), result('secondMortgageShare', 'Second mortgage share of debt', 'percent')],
    formulaSummary: ['Sum entered monthly debt service.', 'Show a balance-weighted stated rate only as a descriptive metric.', 'Add payments over the selected horizon and entered second-mortgage fee.'], sources: [sources.interestAct, sources.fsraDisclosure],
  }),
  definition({
    slug: 'refinance-vs-second-mortgage', title: 'Refinance vs Second Mortgage Break-Even Tool',
    category: 'private-mortgage', kind: 'comparator', model: 'refinance-vs-second',
    description: 'Compare replacing the first mortgage with retaining it and adding a second mortgage.',
    fields: [currency('existingBalance', 'Existing first balance', 600_000), currency('existingPayment', 'Existing monthly payment', 3_500), currency('newFunds', 'New funds required', 200_000), currency('penalty', 'Verified payout penalty', 18_000), percent('refinanceRate', 'Refinance rate', 0.0599), currency('refinanceFees', 'Refinance fees', 6_000), numberField('amortizationYears', 'Refinance amortization', 25, undefined, 1), percent('secondRate', 'Second mortgage rate', 0.1199), currency('secondFees', 'Second mortgage fees', 8_000), numberField('secondAmortizationYears', 'Second mortgage amortization', 15, undefined, 1), numberField('holdingMonths', 'Analysis horizon (months)', 24, undefined, 1)],
    results: [result('lowerCostScenario', 'Lower modeled cash outflow', 'text', true), result('breakEvenMonths', 'Modeled break-even', 'months'), result('refinancePayment', 'Refinance monthly payment', 'currency'), result('secondCombinedPayment', 'First plus second monthly payment', 'currency'), result('refinanceCost', 'Refinance outflow over horizon', 'currency'), result('secondCost', 'First plus second outflow', 'currency')],
    formulaSummary: ['Calculate amortizing payments from entered terms.', 'Compare upfront costs plus cumulative payments.', 'Break-even is the first whole month where refinance savings recover added upfront cost.'], sources: [sources.costOfBorrowing, sources.fsraDisclosure],
  }),
  definition({
    slug: 'equity-ltv-cushion', title: 'Equity and LTV Cushion Visualizer',
    category: 'private-mortgage', kind: 'calculator', model: 'equity-ltv',
    description: 'Stress total secured debt against a property-value range and modeled disposition costs.',
    fields: [currency('propertyValueLow', 'Low property value', 900_000), currency('propertyValueHigh', 'High property value', 1_100_000), currency('existingDebt', 'Existing secured debt', 600_000), currency('requestedAdvance', 'Requested advance', 150_000), percent('sellingCostRate', 'Disposition or enforcement cost rate', 0.06)],
    results: [result('cushionLow', 'Net cushion at low value', 'currency', true), result('cushionHigh', 'Net cushion at high value', 'currency'), result('ltvLow', 'LTV at low value', 'percent'), result('ltvHigh', 'LTV at high value', 'percent'), result('totalDebt', 'Total modeled secured debt', 'currency')],
    formulaSummary: ['LTV equals secured debt divided by scenario property value.', 'Net cushion equals value less modeled sale costs and secured debt.'], sources: [sources.fsraForm1],
  }),
  definition({
    slug: 'renew-or-exit-private-mortgage', title: 'Renew or Exit a Private Mortgage?',
    category: 'private-mortgage', kind: 'comparator', model: 'renew-or-exit',
    description: 'Compare entered renewal economics with an alternative financing path through an expected sale date.',
    fields: [currency('balance', 'Current balance', 500_000), percent('renewalRate', 'Renewal rate', 0.1199), currency('renewalFee', 'Renewal fee', 7_500), percent('alternativeRate', 'Alternative rate', 0.0749), currency('alternativeFee', 'Alternative fees and penalty', 20_000), numberField('saleMonths', 'Expected hold before sale/refinance (months)', 12, undefined, 1)],
    results: [result('lowerCostScenario', 'Lower modeled cost path', 'text', true), result('renewalCost', 'Renewal interest and fee', 'currency'), result('alternativeCost', 'Alternative interest and fees', 'currency'), result('breakEvenMonths', 'Alternative break-even', 'months')],
    formulaSummary: ['Compare entered interest and fees over the same horizon.', 'Break-even recovers the difference in upfront fees from monthly interest savings.'], sources: [sources.fsraDisclosure],
  }),
  definition({
    slug: 'private-mortgage-commitment-comparator', title: 'Private Mortgage Commitment Comparator',
    category: 'private-mortgage', kind: 'comparator', model: 'commitment-comparator',
    description: 'Normalize up to three commitments at one advance and holding period without ranking lenders.',
    fields: [currency('advance', 'Common advance', 500_000), numberField('termMonths', 'Comparison horizon (months)', 12, undefined, 1), percent('rateA', 'Commitment A rate', 0.0999), currency('feeA', 'Commitment A fees', 12_500), percent('rateB', 'Commitment B rate', 0.1099), currency('feeB', 'Commitment B fees', 8_000), percent('rateC', 'Commitment C rate', 0.0899), currency('feeC', 'Commitment C fees', 18_000)],
    results: [result('lowestCost', 'Lowest modeled cost at selected horizon', 'text', true), result('costA', 'Commitment A cost', 'currency'), result('costB', 'Commitment B cost', 'currency'), result('costC', 'Commitment C cost', 'currency')],
    formulaSummary: ['Apply each stated rate and fee to the same advance and horizon.', 'Lowest modeled cost is scenario-specific and is not a lender ranking.'], sources: [sources.costOfBorrowing, sources.fsraDisclosure],
  }),
  definition({
    slug: 'private-mortgage-document-readiness', title: 'Private Mortgage Document Readiness Checker',
    category: 'private-mortgage', kind: 'checklist', model: 'document-readiness',
    description: 'Identify missing core file information without fabricating an approval score.',
    fields: [toggle('identity', 'Identity and entity documents'), toggle('property', 'Property and use documents'), toggle('mortgage', 'Mortgage statements and terms'), toggle('income', 'Income or cash-flow evidence'), toggle('exitPlan', 'Exit plan evidence'), toggle('taxes', 'Property tax status'), toggle('insurance', 'Insurance evidence')],
    results: [result('missingItems', 'Missing information', 'text', true), result('missingCount', 'Missing items', 'number'), result('completeness', 'Required file completion', 'percent')],
    formulaSummary: ['Count only required items marked present.', 'Completion is informational and never an approval or suitability score.'], sources: [sources.fsraDisclosure],
  }),
  definition({
    slug: 'power-of-sale-cost-sensitivity', title: 'Power-of-Sale Cost Sensitivity Model',
    category: 'private-mortgage', kind: 'calculator', model: 'loss-waterfall',
    description: 'Model an illustrative recovery waterfall after entered sale, enforcement, carry, and priority costs.',
    fields: [currency('propertyValue', 'Modeled sale value', 900_000), percent('saleCostRate', 'Sale cost rate', 0.06), currency('mortgageBalance', 'Subject mortgage amount due', 700_000), currency('priorityClaims', 'Priority claims entered', 40_000), currency('arrears', 'Arrears and charges', 15_000), currency('legalCosts', 'Legal and enforcement costs', 35_000), currency('monthlyCarry', 'Monthly property carry', 4_000), numberField('saleMonths', 'Modeled time to sale (months)', 8, undefined, 1)],
    results: [result('netRecovery', 'Modeled subject recovery', 'currency', true), result('shortfall', 'Modeled shortfall', 'currency'), result('lossSeverity', 'Loss severity', 'percent'), result('saleProceeds', 'Net sale proceeds before enforcement', 'currency'), result('enforcementCosts', 'Modeled priority and enforcement costs', 'currency')],
    formulaSummary: ['Deduct entered sale costs from value.', 'Apply entered priority, arrears, legal, and carry costs before subject recovery.', 'Recovery cannot exceed the amount due or remaining proceeds.'], sources: [sources.mortgagesAct, sources.fsraForm1],
  }),
  definition({
    slug: 'debt-consolidation-cost-horizon', title: 'Debt Consolidation Cost Horizon',
    category: 'private-mortgage', kind: 'calculator', model: 'debt-horizon',
    description: 'Compare payment relief with remaining debt over a fixed horizon.',
    fields: [currency('debtBalance', 'Debts consolidated', 80_000), percent('currentRate', 'Current blended rate', 0.1899), currency('currentPayment', 'Current monthly payments', 2_500), percent('mortgageRate', 'Proposed mortgage rate', 0.0799), numberField('amortizationYears', 'Proposed amortization', 20, undefined, 1), currency('fees', 'Fees added to debt', 5_000), numberField('horizonMonths', 'Comparison horizon (months)', 24, undefined, 1)],
    results: [result('monthlyCashFlowChange', 'Monthly payment relief', 'currency', true), result('proposedPayment', 'Proposed monthly payment', 'currency'), result('currentEndBalance', 'Current debts at horizon', 'currency'), result('proposedEndBalance', 'Proposed mortgage at horizon', 'currency'), result('totalDebtDifference', 'Difference in debt at horizon', 'currency')],
    formulaSummary: ['Amortize current and proposed debt over the same period.', 'Compare both monthly cash flow and ending balances.'], sources: [sources.costOfBorrowing],
  }),
]

const feasibilityFields = [
  currency('land', 'Land or acquisition basis', 1_000_000, 'Project cost'),
  currency('hardCosts', 'Hard costs', 2_400_000, 'Project cost'),
  currency('softCosts', 'Soft and other costs', 600_000, 'Project cost'),
  numberField('units', 'Residential units', 6, 'Operations', 1),
  currency('monthlyRent', 'Monthly rent per unit', 3_200, 'Operations'),
  percent('vacancyRate', 'Vacancy and credit loss', 0.03, 'Operations'),
  percent('operatingExpenseRate', 'Operating expense rate', 0.32, 'Operations'),
  percent('capRate', 'Capitalization rate', 0.05, 'Valuation and debt'),
  percent('interestRate', 'Takeout interest rate', 0.05, 'Valuation and debt'),
  numberField('amortizationYears', 'Takeout amortization', 30, 'Valuation and debt', 1),
  percent('loanToCost', 'Maximum loan to cost', 0.75, 'Valuation and debt'),
  percent('loanToValue', 'Maximum loan to value', 0.75, 'Valuation and debt'),
  numberField('minimumDscr', 'Minimum DSCR', 1.2, 'Valuation and debt', 0.01),
] as const satisfies readonly CalculatorField[]

const feasibilityResults = [
  result('equityRequired', 'Modeled equity requirement', 'currency', true),
  result('maximumLoan', 'Constrained takeout loan', 'currency'),
  result('totalDevelopmentCost', 'Total development cost', 'currency'),
  result('netOperatingIncome', 'Stabilized NOI', 'currency'),
  result('stabilizedValue', 'Capitalized value scenario', 'currency'),
  result('debtServiceCoverage', 'Modeled DSCR', 'ratio'),
] as const

const constructionTools: CalculatorDefinition[] = [
  definition({
    slug: 'construction-working-capital-gap', title: 'Construction Draw Working-Capital Gap Calculator',
    category: 'construction', kind: 'calculator', model: 'working-capital-gap',
    description: 'Estimate the liquidity needed between project spending and lender release.',
    fields: [currency('budget', 'Total project budget', 2_000_000), percent('depositRate', 'Deposits paid ahead', 0.1), currency('monthlySpend', 'Peak monthly spend', 300_000), percent('drawPercentage', 'Eligible cost funded by draws', 0.75), numberField('releaseLagDays', 'Inspection and release lag (days)', 30), percent('holdbackRate', 'Statutory holdback', 0.1), percent('contingencyRate', 'Liquidity contingency', 0.05), percent('interestRate', 'Working-capital rate', 0.1)],
    results: [result('peakCashGap', 'Modeled peak cash gap', 'currency', true), result('minimumLiquidity', 'Liquidity plus 10% buffer', 'currency'), result('retainedHoldback', 'Statutory holdback modeled', 'currency'), result('interestCarry', 'Indicative gap carry', 'currency')],
    formulaSummary: ['Keep statutory holdback separate from lender eligibility and release lag.', 'Combine deposits, unfunded cost, lagged spend, holdback, and user contingency.', 'The aggregate model is a planning approximation; actual draw dates require an event ledger.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'draw-schedule-builder', title: 'Draw Schedule Builder', category: 'construction', kind: 'planner', model: 'draw-schedule',
    description: 'Turn a project budget into an editable milestone-level draw allowance.',
    fields: [currency('budget', 'Eligible construction budget', 1_500_000), numberField('stages', 'Draw stages', 5, undefined, 1), percent('firstDrawShare', 'First draw share of net funds', 0.15), percent('holdbackRate', 'Statutory holdback', 0.1), numberField('monthsPerStage', 'Months per stage', 2, undefined, 1), numberField('releaseLagDays', 'Release lag (days)', 28)],
    results: [result('averageDraw', 'Average net draw', 'currency', true), result('firstDraw', 'Modeled first draw', 'currency'), result('retainedHoldback', 'Retained holdback', 'currency'), result('totalAvailable', 'Net funds before final release', 'currency'), result('releaseMonth', 'Modeled final release month', 'months')],
    formulaSummary: ['Deduct entered holdback from eligible budget.', 'Allocate the selected first-draw share and average remaining availability.', 'Dates and evidence remain commitment-specific.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'interest-carry-by-draw', title: 'Interest Carry by Draw Calculator', category: 'construction', kind: 'calculator', model: 'interest-by-draw',
    description: 'Accrue interest on modeled outstanding advances rather than the full commitment.',
    fields: [currency('commitment', 'Total commitment', 1_500_000), currency('initialDraw', 'Initial draw', 250_000), currency('monthlyDraw', 'Subsequent monthly draw', 150_000), numberField('drawCount', 'Months with draws', 7, undefined, 1), percent('interestRate', 'Annual interest rate', 0.0999), currency('fees', 'Commitment and administration fees', 12_500)],
    results: [result('totalCarry', 'Total interest and fees', 'currency', true), result('totalInterest', 'Interest on drawn balance', 'currency'), result('totalFees', 'Entered fees', 'currency'), result('endingBalance', 'Ending drawn balance', 'currency')],
    formulaSummary: ['Post each modeled draw before that month’s interest.', 'Accrue only on outstanding principal.', 'Stop advances at the entered commitment.'], sources: [sources.interestAct],
  }),
  definition({
    slug: 'cost-to-complete-stress-test', title: 'Cost-to-Complete Stress Test', category: 'construction', kind: 'calculator', model: 'cost-to-complete',
    description: 'Compare available project funds with base and downside cost-to-complete.',
    fields: [currency('remainingBudget', 'Remaining budget', 900_000), currency('cashAvailable', 'Unrestricted project cash', 150_000), currency('approvedUndrawn', 'Eligible approved undrawn funds', 650_000), percent('contingencyRate', 'Remaining contingency', 0.05), percent('overrunRate', 'Downside overrun', 0.15)],
    results: [result('downsideSurplus', 'Downside surplus / shortfall', 'currency', true), result('baseSurplus', 'Base surplus / shortfall', 'currency'), result('availableFunds', 'Modeled available funds', 'currency'), result('fundingNeed', 'Base funding need', 'currency')],
    formulaSummary: ['Available funds equal unrestricted cash plus eligible undrawn funding.', 'Stress remaining cost separately for contingency and downside overrun.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'change-order-impact', title: 'Change-Order Impact Calculator', category: 'construction', kind: 'calculator', model: 'change-order',
    description: 'Translate a change order into direct, financing, and schedule carry impact.',
    fields: [currency('changeOrder', 'Direct change-order amount', 75_000), percent('contractorMarkup', 'Contractor markup and taxes', 0.15), percent('interestRate', 'Incremental borrowing rate', 0.1), numberField('remainingMonths', 'Months financed', 8, undefined, 1), numberField('delayMonths', 'Schedule delay (months)', 1), currency('monthlyCarry', 'Monthly project carry', 25_000)],
    results: [result('totalImpact', 'Total modeled impact', 'currency', true), result('directCost', 'Direct all-in change cost', 'currency'), result('financingCost', 'Incremental financing carry', 'currency'), result('delayCost', 'Schedule carry', 'currency')],
    formulaSummary: ['Gross up direct cost for entered markup/taxes.', 'Carry the incremental cost over the entered remaining period.', 'Add time-dependent project carry for entered delay.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'construction-delay-carry', title: 'Construction Delay Carry Calculator', category: 'construction', kind: 'calculator', model: 'delay-carry',
    description: 'Show the weekly and monthly burden of extending a project timeline.',
    fields: [numberField('delayMonths', 'Delay length (months)', 3, undefined, 1), currency('monthlySoftCosts', 'Monthly fixed project costs', 18_000), currency('debtBalance', 'Average outstanding debt', 1_200_000), percent('interestRate', 'Debt rate', 0.09), currency('monthlyRent', 'Foregone monthly net rent', 12_000)],
    results: [result('totalCarry', 'Total modeled delay cost', 'currency', true), result('weeklyCarry', 'Average cost per week', 'currency'), result('monthlyCarry', 'Average cost per month', 'currency'), result('debtInterest', 'Incremental debt interest', 'currency'), result('lostRent', 'Entered foregone net rent', 'currency')],
    formulaSummary: ['Extend debt interest and fixed project costs for the delay.', 'Add only entered foregone net rent.', 'Convert cumulative cost to comparable weekly and monthly rates.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'builder-liquidity-waterfall', title: 'Builder Liquidity Waterfall', category: 'construction', kind: 'calculator', model: 'builder-liquidity',
    description: 'Stress unrestricted liquidity through a modeled draw-lag window.',
    fields: [currency('cash', 'Unrestricted cash', 250_000), currency('receivables', 'Collectible receivables', 120_000), currency('committedFunds', 'Unconditional committed funds', 400_000), currency('deposits', 'Deposits due', 100_000), currency('payables', 'Current payables', 260_000), currency('weeklyBurn', 'Weekly project cash burn', 80_000), numberField('weeks', 'Analysis horizon (weeks)', 12, undefined, 1), numberField('drawLagWeeks', 'Modeled draw lag (weeks)', 5)],
    results: [result('lowPoint', 'Lowest modeled liquidity', 'currency', true), result('shortfall', 'Peak modeled shortfall', 'currency'), result('startingLiquidity', 'Starting net liquidity', 'currency'), result('minimumBuffer', 'Four-week operating buffer', 'currency')],
    formulaSummary: ['Exclude restricted and conditional cash from starting liquidity.', 'Reduce liquidity by modeled weekly burn through the draw-lag period.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'construction-draw-evidence-pack', title: 'Construction Draw Evidence Pack Generator', category: 'construction', kind: 'checklist', model: 'draw-evidence',
    description: 'Generate an evidence manifest for a draw request without opining on legal sufficiency.',
    fields: [toggle('budget', 'Current budget and cost report'), toggle('invoices', 'Invoices and proof of payment'), toggle('photos', 'Dated progress photos'), toggle('permits', 'Permit and inspection records'), toggle('statutoryDeclaration', 'Required statutory declaration'), toggle('insurance', 'Current insurance evidence'), toggle('inspection', 'Lender or quantity-surveyor inspection')],
    results: [result('uploadManifest', 'Evidence manifest', 'text', true), result('missingCount', 'Missing evidence items', 'number'), result('completeness', 'Pack completion', 'percent')],
    formulaSummary: ['Compare available evidence against a core draw manifest.', 'Do not treat presence as verification or legal sufficiency.'], sources: [sources.constructionAct, sources.fsraDisclosure],
  }),
  definition({
    slug: 'project-feasibility-sensitivity', title: 'Project Feasibility Sensitivity Grid', category: 'construction', kind: 'calculator', model: 'project-feasibility',
    description: 'Connect development cost, rental operations, valuation, debt constraints, and equity.',
    fields: feasibilityFields, results: feasibilityResults,
    formulaSummary: ['Calculate effective gross income and NOI.', 'Capitalize NOI at the entered cap rate.', 'Constrain debt independently by LTC, LTV, and DSCR; use the lowest result.'], sources: [sources.constructionAct],
  }),
  definition({
    slug: 'stalled-build-triage', title: 'Stalled Build Triage Tool', category: 'construction', kind: 'checklist', model: 'stalled-build',
    description: 'Map urgent funding, lien, arrears, permit, and completion dependencies without assigning a risk score.',
    fields: [percent('completionRate', 'Estimated physical completion', 0.55), currency('remainingWork', 'Modeled remaining work', 850_000), currency('liens', 'Known lien claims entered', 75_000), currency('arrears', 'Known arrears entered', 35_000), currency('availableFunds', 'Unrestricted and eligible funds', 600_000), toggle('permitReady', 'Permit and inspection path confirmed')],
    results: [result('priority', 'First modeled professional path', 'text', true), result('fundingGap', 'Modeled funding gap', 'currency'), result('issueCount', 'Triggered issue paths', 'number'), result('remainingStage', 'Estimated work remaining', 'percent')],
    formulaSummary: ['Compare entered remaining obligations with available funds.', 'Trigger deterministic professional paths for permits, liens, arrears, and funding.'], sources: [sources.constructionAct, sources.ontarioPermits],
  }),
]

const gardenSuiteTools: CalculatorDefinition[] = [
  definition({
    slug: 'garden-suite-financing-stack', title: 'Garden Suite Financing Stack Calculator', category: 'garden-suite', kind: 'calculator', model: 'garden-financing-stack',
    description: 'Stack project cost, construction leverage, existing debt, rent, and modeled debt service.',
    fields: [currency('hardCosts', 'Hard construction costs', 350_000), currency('softCosts', 'Soft, permit, servicing, and contingency costs', 100_000), currency('cashEquity', 'Cash equity available', 100_000), currency('existingDebt', 'Existing secured debt included in payment', 500_000), percent('loanToCost', 'Construction loan to cost', 0.75), percent('interestRate', 'Modeled combined debt rate', 0.0599), numberField('amortizationYears', 'Amortization', 25, undefined, 1), currency('monthlyRent', 'Modeled monthly rent', 3_500)],
    results: [result('equityGap', 'Remaining construction equity gap', 'currency', true), result('totalCost', 'All-in project cost', 'currency'), result('constructionDebt', 'Modeled construction debt', 'currency'), result('monthlyDebtService', 'Modeled combined monthly debt service', 'currency'), result('rentCoverage', 'Gross rent / debt service', 'ratio')],
    formulaSummary: ['Combine entered hard and soft project cost.', 'Apply entered construction LTC.', 'Amortize construction plus included existing debt and compare gross rent.'], sources: [sources.torontoGardenSuites],
  }),
  definition({
    slug: 'garden-suite-cost-to-rent', title: 'Garden Suite Cost-to-Rent Break-Even Tool', category: 'garden-suite', kind: 'calculator', model: 'cost-to-rent',
    description: 'Compare stabilized net rent and debt service with the equity invested.',
    fields: [currency('allInCost', 'All-in incremental project cost', 450_000), currency('financedAmount', 'Amount financed', 300_000), currency('monthlyRent', 'Modeled monthly rent', 3_500), percent('vacancyRate', 'Vacancy and credit loss', 0.03), currency('annualExpenses', 'Annual operating expenses and reserve', 8_500), percent('interestRate', 'Financing rate', 0.0599), numberField('amortizationYears', 'Amortization', 25, undefined, 1)],
    results: [result('annualCashFlow', 'Annual leveraged cash flow', 'currency', true), result('netOperatingIncome', 'Annual NOI', 'currency'), result('annualDebtService', 'Annual debt service', 'currency'), result('simplePaybackYears', 'Simple equity payback', 'number')],
    formulaSummary: ['Reduce gross rent for entered vacancy and operating costs.', 'Deduct amortizing annual debt service.', 'Simple payback is equity divided by positive annual cash flow.'], sources: [sources.torontoGardenSuites],
  }),
  definition({
    slug: 'garden-suite-site-finance-readiness', title: 'Garden Suite Site-and-Finance Readiness Checklist', category: 'garden-suite', kind: 'checklist', model: 'site-readiness',
    description: 'Surface the planning, servicing, design, budget, and equity questions that need professional confirmation.',
    fields: [toggle('municipality', 'Municipality and zoning source confirmed'), toggle('survey', 'Current survey and lot facts available'), toggle('servicing', 'Servicing route investigated'), toggle('access', 'Fire and construction access investigated'), toggle('budget', 'Project budget and contingency prepared'), toggle('equity', 'Equity and existing debt documented'), toggle('professionalTeam', 'Designer/planner/lender team identified')],
    results: [result('nextQuestion', 'Next unresolved question', 'text', true), result('missingCount', 'Unresolved core questions', 'number'), result('completeness', 'Question set completed', 'percent')],
    formulaSummary: ['Report unresolved planning and finance questions.', 'Do not infer zoning or permit compliance from financial inputs.'], sources: [sources.torontoGardenSuites, sources.ontarioPermits],
  }),
  definition({
    slug: 'toronto-multiplex-pro-forma', title: 'Toronto Multiplex Pro Forma', category: 'garden-suite', kind: 'calculator', model: 'multiplex-pro-forma',
    description: 'Model a Toronto multiplex rental scenario while keeping zoning and permit conclusions outside the calculator.',
    fields: [...feasibilityFields, numberField('projectMonths', 'Modeled project timeline (months)', 18, 'Project cost', 1)], results: [...feasibilityResults, result('projectMonths', 'Modeled project timeline', 'months')],
    formulaSummary: ['Calculate rental NOI and a cap-rate value scenario.', 'Constrain takeout by LTC, LTV, and DSCR.', 'Treat permit and property-specific zoning as external dependencies.'], sources: [sources.torontoMultiplex, sources.ontarioPermits],
  }),
  definition({
    slug: 'density-uplift-scenario', title: 'Density Uplift Scenario Tool', category: 'garden-suite', kind: 'calculator', model: 'density-uplift',
    description: 'Measure incremental cost, income, value, and capital for an added-unit scenario.',
    fields: [numberField('existingUnits', 'Existing units', 1, 'As-is', 1), currency('existingMonthlyIncome', 'Existing monthly income', 3_000, 'As-is'), currency('existingValue', 'Existing value scenario', 1_000_000, 'As-is'), numberField('proposedUnits', 'Proposed units', 4, 'Proposed', 1), currency('proposedMonthlyIncome', 'Proposed monthly income', 11_000, 'Proposed'), currency('proposedValue', 'Proposed value scenario', 1_650_000, 'Proposed'), currency('costPerUnit', 'Incremental cost per added unit', 180_000, 'Proposed'), currency('availableCapital', 'Capital available', 250_000, 'Proposed')],
    results: [result('capitalRequirement', 'Remaining capital requirement', 'currency', true), result('incrementalValue', 'Incremental modeled value', 'currency'), result('incrementalCost', 'Incremental project cost', 'currency'), result('incrementalIncome', 'Incremental annual gross income', 'currency'), result('yieldOnCost', 'Gross incremental yield on cost', 'percent'), result('addedUnits', 'Added units', 'number')],
    formulaSummary: ['Calculate whole-project deltas between as-is and proposed states.', 'Cost only the net added units.', 'Value remains a user scenario, not an appraisal.'], sources: [sources.torontoMultiplex],
  }),
  definition({
    slug: 'bridge-to-takeout', title: 'Bridge-to-Takeout Calculator', category: 'garden-suite', kind: 'calculator', model: 'bridge-to-takeout',
    description: 'Find the lower of a DSCR-constrained and LTV-constrained takeout loan.',
    fields: [currency('constructionDebt', 'Bridge payout balance', 1_500_000), currency('netOperatingIncome', 'Stabilized annual NOI', 135_000), percent('capRate', 'Capitalization rate', 0.05), percent('interestRate', 'Takeout rate', 0.055), numberField('amortizationYears', 'Takeout amortization', 30, undefined, 1), numberField('minimumDscr', 'Minimum DSCR', 1.2, undefined, 0.01), percent('loanToValue', 'Maximum LTV', 0.75)],
    results: [result('equityGap', 'Bridge payout gap', 'currency', true), result('takeoutLoan', 'Constrained takeout loan', 'currency'), result('stabilizedValue', 'Capitalized value scenario', 'currency'), result('constraint', 'Controlling constraint', 'text')],
    formulaSummary: ['Capitalize NOI at the entered cap rate.', 'Calculate independent debt capacity by DSCR and LTV.', 'Use the lower amount and compare it with bridge payout.'], sources: [sources.mliFactSheet],
  }),
  definition({
    slug: 'permit-financing-timeline', title: 'Permit and Financing Timeline Planner', category: 'garden-suite', kind: 'planner', model: 'permit-timeline',
    description: 'Coordinate planning, permit, lender, construction, and buffer allowances from one start date.',
    fields: [dateField('startDate', 'Planning start date', '2026-08-01'), numberField('planningMonths', 'Design and applicable-law allowance (months)', 4), numberField('permitMonths', 'Permit path allowance (months)', 3), numberField('lenderMonths', 'Financing readiness allowance (months)', 2), numberField('constructionMonths', 'Construction allowance (months)', 10), numberField('bufferMonths', 'Schedule buffer (months)', 2)],
    results: [result('completionDate', 'Modeled buffered completion', 'date', true), result('constructionStart', 'Earliest modeled construction start', 'date'), result('permitComplete', 'Modeled permit-ready date', 'date'), result('financeReady', 'Modeled financing-ready date', 'date')],
    formulaSummary: ['Run permit and financing dependencies in parallel after planning begins.', 'Construction starts after both modeled paths are complete.', 'The official 10-day complete-application review example is not treated as end-to-end permit time.'], sources: [sources.ontarioPermits],
  }),
  definition({
    slug: 'utility-servicing-stress-test', title: 'Utility/Servicing Allowance Stress Test', category: 'garden-suite', kind: 'calculator', model: 'utility-stress',
    description: 'Stress a servicing allowance against length-based and contractor-quote scenarios.',
    fields: [currency('baseAllowance', 'Current servicing allowance', 40_000), numberField('serviceLength', 'Modeled service length (metres)', 25), currency('costPerMetre', 'User-entered cost per metre', 1_800), currency('quotedAmount', 'Current contractor/utility quote', 0), percent('contingencyRate', 'Contingency', 0.15), percent('downsideRate', 'Downside escalation', 0.1)],
    results: [result('stressedAllowance', 'Stressed servicing allowance', 'currency', true), result('varianceToBudget', 'Variance to current allowance', 'currency'), result('baseEstimate', 'Selected base estimate', 'currency'), result('lengthEstimate', 'Length-based user estimate', 'currency')],
    formulaSummary: ['Use the highest entered evidence: allowance, current quote, or user-entered length rate.', 'Apply contingency and downside only after selecting the base.', 'No default is represented as an official utility price.'], sources: [sources.torontoGardenSuites],
  }),
]

const mliTools: CalculatorDefinition[] = [
  definition({
    slug: 'mli-select-points-flexibility', title: 'MLI Select Points and Flexibility Calculator', category: 'mli-select', kind: 'calculator', model: 'mli-points',
    description: 'Run CMHC’s published scope screens, points math, tier gap, and flexibilities under a versioned rule set.',
    fields: [
      selectField('projectType', 'Project type', 'new', ['New', 'Existing'], 'Scope'),
      selectField('shelterModel', 'Shelter model', 'standard', ['Standard', 'Student', 'Retirement'], 'Scope'),
      numberField('units', 'Residential units', 41, 'Scope', 1),
      percent('nonResidentialGfa', 'Non-residential share of gross floor area', 0, 'Scope'),
      percent('nonResidentialValue', 'Non-residential share of lending value', 0, 'Scope'),
      numberField('affordableUnits', 'Units committed at or below threshold', 5, 'Affordability'),
      currency('medianRenterIncome', 'Official median renter income entered', 72_000, 'Affordability'),
      currency('proposedAffordableRent', 'Proposed committed rent', 1_750, 'Affordability'),
      toggle('longCommitment', 'Affordability commitment is 20+ years', false, 'Affordability'),
      selectField('energyBaseline', 'New-construction energy baseline', 'necb', ['NECB', 'NBC'], 'Energy'),
      percent('energyPerformance', 'New-construction improvement over baseline', 0.25, 'Energy'),
      percent('energyReduction', 'Existing-property energy reduction', 0, 'Energy'),
      percent('ghgReduction', 'Existing-property GHG reduction', 0, 'Energy'),
      toggle('energyDocumented', 'Qualified energy evidence exists', false, 'Energy'),
      toggle('accessibilityBaseline', 'All units visitable and common areas barrier-free under CSA B651:23', false, 'Accessibility'),
      selectField('accessibilityPath', 'Qualifying accessibility pathway', 'none', ['None', 'Level1', 'Level2'], 'Accessibility'),
      toggle('accessibilityDocumented', 'Architect/designated consultant evidence exists', false, 'Accessibility'),
    ],
    results: [result('points', 'Total modeled points', 'number', true), result('tier', 'Published points tier', 'text'), result('nextTierGap', 'Points to next tier', 'number'), result('affordabilityPoints', 'Affordability points', 'number'), result('energyPoints', 'Energy points', 'number'), result('accessibilityPoints', 'Accessibility points', 'number'), result('maximumAffordableRent', 'Modeled 30% income rent threshold', 'currency'), result('amortizationYears', 'Published max amortization', 'number'), result('premiumDiscount', 'Published premium discount', 'percent'), result('entryScreen', 'Basic scope screen', 'text')],
    formulaSummary: ['Calculate affordability share and rent threshold; round required unit counts upward.', 'For existing properties, energy points use the lower supported energy/GHG reduction tier.', 'Accessibility points require the all-unit/common-area baseline before a pathway can score.', 'Sum the highest supported category tiers and show the gap to 50, 70, or 100 points.'], sources: [sources.mli, sources.mliFactSheet, sources.mliPremiums],
    assumptions: [{ label: 'Rule set', status: 'published', value: 'CMHC MLI Select — verified 2026-07-14' }, { label: 'Market median income', status: 'user', value: 'Enter current official CMHC market value' }],
  }),
  definition({
    slug: 'mli-select-capital-stack', title: 'MLI Select Capital Stack Model', category: 'mli-select', kind: 'calculator', model: 'mli-capital-stack',
    description: 'Connect a modeled points tier with DSCR-constrained debt, premium, bridge carry, and equity.',
    fields: [numberField('pointsTier', 'Modeled MLI Select points', 70, 'Program scenario', 50), currency('projectCost', 'Eligible project cost', 10_000_000, 'Project'), currency('netOperatingIncome', 'Stabilized annual NOI', 700_000, 'Project'), currency('bridgeDebt', 'Bridge debt at takeout', 7_500_000, 'Bridge'), percent('bridgeRate', 'Bridge rate', 0.07, 'Bridge'), numberField('bridgeMonths', 'Bridge months', 18, 'Bridge', 1), percent('interestRate', 'Insured takeout rate', 0.045, 'Takeout'), numberField('minimumDscr', 'Minimum DCR', 1.1, 'Takeout', 0.01), percent('premiumRate', 'Entered current base premium plus surcharges', 0.04, 'Takeout')],
    results: [result('equityGap', 'Modeled equity requirement', 'currency', true), result('insuredLoan', 'DSCR/LTC constrained insured loan', 'currency'), result('premium', 'Modeled discounted premium', 'currency'), result('takeoutGap', 'Bridge payout gap', 'currency'), result('constructionCarry', 'Bridge interest carry', 'currency')],
    formulaSummary: ['Apply the tier’s published maximum amortization.', 'Constrain debt by 95% LTC and entered minimum DCR.', 'Apply the tier discount after the entered base premium plus surcharges.'], sources: [sources.mliFactSheet, sources.mliPremiums],
  }),
  definition({
    slug: 'mli-select-affordability-commitment', title: 'MLI Select Affordability Commitment Model', category: 'mli-select', kind: 'calculator', model: 'mli-affordability',
    description: 'Calculate required units, the rent threshold, and the first-year revenue difference for a selected affordability tier.',
    fields: [selectField('projectType', 'Project type', 'new', ['New', 'Existing']), numberField('affordabilityLevel', 'Affordability points tier', 50, undefined, 50), numberField('totalUnits', 'Total residential units', 41, undefined, 1), currency('medianRenterIncome', 'Official median renter income entered', 72_000), numberField('proposedAffordableUnits', 'Proposed affordable units', 5, undefined, 0), currency('proposedRent', 'Proposed committed monthly rent', 1_750), currency('marketRent', 'User comparison monthly rent', 2_400)],
    results: [result('qualifying', 'Modeled threshold result', 'text', true), result('requiredUnits', 'Minimum committed units', 'number'), result('maximumRent', 'Modeled maximum committed rent', 'currency'), result('annualRevenueDifference', 'First-year gross revenue difference', 'currency')],
    formulaSummary: ['Required units equal ceiling(total units × published tier share).', 'Maximum monthly rent equals 30% of entered annual median renter income divided by 12.', 'Compare committed and user-entered market rents without forecasting future market rent.'], sources: [sources.mli, sources.mliFactSheet],
  }),
  definition({
    slug: 'mli-select-dscr-maximum-loan', title: 'MLI Select DSCR and Maximum-Loan Explorer', category: 'mli-select', kind: 'calculator', model: 'mli-maximum-loan',
    description: 'Solve debt capacity from NOI and DCR, then apply the selected LTV cap.',
    fields: [currency('netOperatingIncome', 'Annual NOI', 700_000), percent('interestRate', 'Takeout interest rate', 0.045), numberField('amortizationYears', 'Amortization', 45, undefined, 1), numberField('minimumDscr', 'Minimum DCR', 1.1, undefined, 0.01), currency('lendingValue', 'Eligible lending value entered', 10_000_000), percent('loanToValue', 'Published/selected maximum LTV', 0.95)],
    results: [result('maximumLoan', 'Constrained maximum loan scenario', 'currency', true), result('dscrLoan', 'Loan by DCR', 'currency'), result('ltvLoan', 'Loan by LTV', 'currency'), result('annualDebtService', 'Modeled annual debt service', 'currency'), result('constraint', 'Controlling constraint', 'text')],
    formulaSummary: ['Maximum annual debt service equals NOI divided by selected DCR.', 'Solve the amortizing principal supported by that payment.', 'Use the lower of DCR and LTV capacity.'], sources: [sources.mliFactSheet],
  }),
  definition({
    slug: 'energy-upgrade-finance-trade-off', title: 'Energy Upgrade Finance Trade-off', category: 'mli-select', kind: 'calculator', model: 'upgrade-tradeoff',
    description: 'Isolate the financing-capacity sensitivity of moving between modeled MLI Select tiers.',
    fields: [currency('upgradeCost', 'Energy upgrade cost', 500_000), numberField('currentTier', 'Current modeled points', 50, undefined, 50), numberField('targetTier', 'Target modeled points', 70, undefined, 50), currency('netOperatingIncome', 'Annual NOI', 700_000), percent('interestRate', 'Takeout rate', 0.045), numberField('minimumDscr', 'Minimum DCR', 1.1, undefined, 0.01)],
    results: [result('netCapitalImpact', 'Debt capacity less upgrade cost', 'currency', true), result('incrementalDebtCapacity', 'Modeled incremental debt capacity', 'currency'), result('upgradeCost', 'Entered upgrade cost', 'currency'), result('targetLoan', 'Target-tier DCR loan', 'currency')],
    formulaSummary: ['Translate current and target tiers to published maximum amortization.', 'Compare DCR-supported debt at the same NOI and rate.', 'Do not treat the target tier or debt as achieved without professional evidence and underwriting.'], sources: [sources.mli, sources.mliFactSheet],
  }),
  definition({
    slug: 'accessibility-upgrade-finance-trade-off', title: 'Accessibility Upgrade Finance Trade-off', category: 'mli-select', kind: 'calculator', model: 'upgrade-tradeoff',
    description: 'Show the financing-capacity sensitivity of a documented accessibility pathway without assigning a monetary value to accessibility.',
    fields: [currency('upgradeCost', 'Accessibility upgrade cost', 350_000), numberField('currentTier', 'Current modeled points', 50, undefined, 50), numberField('targetTier', 'Target modeled points', 70, undefined, 50), currency('netOperatingIncome', 'Annual NOI', 700_000), percent('interestRate', 'Takeout rate', 0.045), numberField('minimumDscr', 'Minimum DCR', 1.1, undefined, 0.01)],
    results: [result('netCapitalImpact', 'Debt capacity less upgrade cost', 'currency', true), result('incrementalDebtCapacity', 'Modeled incremental debt capacity', 'currency'), result('upgradeCost', 'Entered upgrade cost', 'currency'), result('targetLoan', 'Target-tier DCR loan', 'currency')],
    formulaSummary: ['Translate modeled points tiers to maximum amortization.', 'Compare DCR-supported debt at constant NOI and rate.', 'Professional pathway evidence remains a separate prerequisite.'], sources: [sources.mli, sources.mliFactSheet],
  }),
  definition({
    slug: 'mli-select-document-readiness', title: 'MLI Select Document Readiness Matrix', category: 'mli-select', kind: 'checklist', model: 'mli-document-readiness',
    description: 'Track core application and commitment evidence by pathway without producing an approval score.',
    fields: [toggle('application', 'Application and project package'), toggle('appraisal', 'Current appraisal/value evidence'), toggle('environmental', 'Environmental evidence'), toggle('affordabilityEvidence', 'Affordability unit/rent evidence'), toggle('energyEvidence', 'Qualified energy attestation/model'), toggle('accessibilityEvidence', 'Architect/designated consultant attestation'), toggle('borrowerFinancials', 'Borrower financial and experience package')],
    results: [result('requiredNext', 'Missing modeled evidence', 'text', true), result('missingCount', 'Missing evidence items', 'number'), result('completeness', 'Core evidence completion', 'percent')],
    formulaSummary: ['Map each selected commitment to current evidence.', 'Presence does not establish sufficiency, eligibility, or approval.'], sources: [sources.mli, sources.mliFactSheet],
  }),
  definition({
    slug: 'insured-takeout-readiness', title: 'Insured Takeout Readiness Tracker', category: 'mli-select', kind: 'planner', model: 'takeout-readiness',
    description: 'Track construction, occupancy, lease-up, value, compliance, and insurance conditions toward takeout.',
    fields: [dateField('asOfDate', 'Status date', '2026-08-01'), numberField('monthsPerCondition', 'Planning allowance per unresolved condition', 1, undefined, 1), toggle('constructionComplete', 'Construction completion documented'), toggle('occupancy', 'Occupancy/permit conditions documented'), toggle('leaseUp', 'Lease-up and stabilization evidence'), toggle('finalCosts', 'Final cost certification'), toggle('appraisal', 'Current appraisal/value evidence'), toggle('complianceEvidence', 'MLI commitment evidence complete'), toggle('insuranceConditions', 'Insurance conditions tracked')],
    results: [result('unresolvedConditions', 'Unresolved modeled conditions', 'text', true), result('projectedReadyDate', 'Illustrative readiness date', 'date'), result('missingCount', 'Unresolved conditions', 'number'), result('completeness', 'Tracked condition completion', 'percent')],
    formulaSummary: ['Count only conditions marked documented.', 'Extend an illustrative date by the user’s allowance per unresolved condition.', 'Do not predict CMHC or lender release.'], sources: [sources.mliFactSheet],
  }),
]

const investorTools: CalculatorDefinition[] = [
  definition({
    slug: 'investor-net-yield-stress-test', title: 'Investor Net-Yield Stress Test', category: 'investor', kind: 'calculator', model: 'investor-net-yield',
    description: 'Move from stated coupon to modeled net income after fees, servicing, legal/recovery cost, and loss.',
    fields: [currency('principal', 'Funded principal', 500_000), percent('couponRate', 'Stated coupon', 0.1099), numberField('holdingMonths', 'Modeled holding period (months)', 12, undefined, 1), currency('feeIncome', 'Fees received by investor', 5_000), currency('servicingCost', 'Servicing and administration cost', 3_000), currency('legalCost', 'Legal cost', 0), currency('recoveryCost', 'Recovery and property cost', 0), currency('capitalLoss', 'Principal loss scenario', 0)],
    results: [result('netYield', 'Simple annualized net yield', 'percent', true), result('netIncome', 'Modeled net income', 'currency'), result('grossIncome', 'Coupon plus fee income', 'currency'), result('totalCosts', 'Modeled costs and loss', 'currency')],
    formulaSummary: ['Accrue coupon over the selected holding period.', 'Add entered investor fee income and deduct all entered costs and capital loss.', 'Annualize net income over funded principal; this is not a guaranteed or money-weighted return.'], sources: [sources.fsraForm1],
  }),
  definition({
    slug: 'ltv-loss-severity', title: 'LTV vs Loss-Severity Explorer', category: 'investor', kind: 'calculator', model: 'ltv-loss-severity',
    description: 'Show why value, priority claims, time, and enforcement costs matter beyond a headline LTV.',
    fields: [currency('propertyValue', 'Modeled recovery sale value', 900_000), percent('saleCostRate', 'Sale cost rate', 0.06), currency('mortgageBalance', 'Subject mortgage amount due', 300_000), currency('seniorClaims', 'Senior mortgage and claims', 550_000), currency('taxArrears', 'Tax and other priority arrears entered', 10_000), currency('legalCosts', 'Legal and enforcement costs', 25_000), currency('monthlyCarry', 'Monthly carry', 3_000), numberField('recoveryMonths', 'Recovery timeline (months)', 8, undefined, 1)],
    results: [result('loss', 'Modeled subject loss', 'currency', true), result('lossSeverity', 'Loss severity', 'percent'), result('netRecovery', 'Modeled subject recovery', 'currency'), result('grossSale', 'Net sale proceeds before claims', 'currency'), result('seniorClaims', 'Senior claims and recovery cost', 'currency')],
    formulaSummary: ['Reduce value for entered sale costs.', 'Apply senior claims, arrears, legal, and carry before subject recovery.', 'Cap recovery at both remaining proceeds and amount due.'], sources: [sources.mortgagesAct, sources.fsraForm1],
  }),
  definition({
    slug: 'mortgage-portfolio-concentration', title: 'Mortgage Portfolio Concentration Heatmap', category: 'investor', kind: 'calculator', model: 'portfolio-concentration',
    description: 'Describe exposure concentration without inventing a regulatory limit or risk grade.',
    fields: [percent('share1', 'Largest exposure bucket share', 0.3), percent('share2', 'Second bucket share', 0.22), percent('share3', 'Third bucket share', 0.18), percent('share4', 'Fourth bucket share', 0.12), percent('share5', 'Fifth bucket share', 0.08), percent('secondLienShare', 'Portfolio in second liens', 0.25), percent('maturing12MonthShare', 'Portfolio maturing within 12 months', 0.35)],
    results: [result('concentrationIndex', 'Herfindahl-style concentration index', 'number', true), result('largestShare', 'Largest entered bucket', 'percent'), result('unallocatedShare', 'Unallocated portfolio share', 'percent'), result('flags', 'User-policy review flags', 'number')],
    formulaSummary: ['Square and sum entered bucket shares for a descriptive concentration index.', 'Flag only transparent example policy thresholds; no regulatory or suitability conclusion.'], sources: [sources.fsraForm1],
  }),
  definition({
    slug: 'maturity-ladder-liquidity', title: 'Maturity Ladder and Liquidity Planner', category: 'investor', kind: 'planner', model: 'maturity-liquidity',
    description: 'Separate contractual maturity from expected cash receipt under an entered extension scenario.',
    fields: [currency('maturing3Months', 'Principal scheduled in months 1–3', 250_000), currency('maturing6Months', 'Additional principal in months 4–6', 300_000), currency('maturing12Months', 'Additional principal in months 7–12', 450_000), percent('extensionRate', 'Modeled share extended/delayed', 0.25), currency('cashReserve', 'Current cash reserve', 100_000), currency('requiredLiquidity', 'Liquidity required in first 3 months', 300_000)],
    results: [result('reserveGap', 'Modeled three-month liquidity gap', 'currency', true), result('expected3MonthLiquidity', 'Expected receipts by month 3', 'currency'), result('expected6MonthLiquidity', 'Expected cumulative receipts by month 6', 'currency'), result('expected12MonthLiquidity', 'Expected cumulative receipts by month 12', 'currency')],
    formulaSummary: ['Apply the user-entered delay share to each maturity band.', 'Compare near-term expected receipts plus cash reserve with stated liquidity needs.', 'Contractual maturity remains distinct from expected receipt.'], sources: [sources.fsraForm1],
  }),
  definition({
    slug: 'first-vs-second-mortgage-risk', title: 'First vs Second Mortgage Risk Comparator', category: 'investor', kind: 'comparator', model: 'lien-risk-comparator',
    description: 'Structure lien-position diligence without reducing a transaction to a universal score.',
    fields: [selectField('lienPosition', 'Subject lien position', 'second', ['First', 'Second']), toggle('appraisal', 'Current valuation evidence reviewed'), toggle('titleSearch', 'Title and priority claims reviewed'), toggle('borrowerReview', 'Borrower capacity and credit reviewed'), toggle('exitPlan', 'Exit route and timing stressed'), toggle('insurance', 'Insurance and loss-payee evidence reviewed')],
    results: [result('diligenceFocus', 'Position-specific diligence focus', 'text', true), result('nextStep', 'Next unresolved review step', 'text'), result('missingCount', 'Missing core review items', 'number')],
    formulaSummary: ['Use lien position to change the diligence questions, not to assign a score.', 'Report missing evidence in a deterministic order.'], sources: [sources.fsraForm1, sources.mortgagesAct],
  }),
  definition({
    slug: 'investor-file-review-worksheet', title: 'Investor File Review Worksheet', category: 'investor', kind: 'checklist', model: 'investor-file-review',
    description: 'Create a structured decision record aligned with core disclosure and diligence evidence.',
    fields: [toggle('commitment', 'Commitment and mortgage terms'), toggle('creditSummary', 'Borrower/entity and capacity summary'), toggle('appraisal', 'Appraisal/value evidence'), toggle('titleSearch', 'Title, priority, taxes, and liens'), toggle('insurance', 'Insurance evidence'), toggle('exitEvidence', 'Use-of-funds and exit evidence'), toggle('servicingPlan', 'Administration and servicing plan'), toggle('decisionRecord', 'Reviewer decision, exceptions, and follow-ups')],
    results: [result('missingItems', 'Missing review sections', 'text', true), result('missingCount', 'Missing sections', 'number'), result('completeness', 'Worksheet completion', 'percent')],
    formulaSummary: ['Count completed core review sections.', 'Completion is an audit trail, not a suitability or investment score.'], sources: [sources.fsraForm1, sources.fsraDisclosure],
  }),
]

export const CALCULATORS: readonly CalculatorDefinition[] = [
  ...privateMortgageTools,
  ...constructionTools,
  ...gardenSuiteTools,
  ...mliTools,
  ...investorTools,
]

export function getCalculator(slug: string) {
  return CALCULATORS.find((calculator) => calculator.slug === slug)
}
