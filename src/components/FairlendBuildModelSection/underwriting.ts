import { BUILD_MODEL_ASSUMPTIONS, type BuildModelAssumptions } from './market-data'

export type UnderwritingStrategy = 'exit' | 'rent'
export type TakeoutConstraint = 'costBasis' | 'debtServiceCoverage' | 'loanToValue'

export type BuildUnderwritingInput = {
  areaPerUnit: number
  buildCostPerSquareFoot: number
  exitValue: number
  landBasis: number
  monthlyRentPerUnit: number
  strategy: UnderwritingStrategy
  units: number
}

function assertFiniteNonNegative(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite number greater than or equal to zero`)
  }
}

function assertRatio(name: string, value: number, allowOne = false) {
  const maximum = allowOne ? 1 : 1 - Number.EPSILON
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new RangeError(`${name} must be between zero and ${allowOne ? 'one' : 'less than one'}`)
  }
}

function validateAssumptions(assumptions: BuildModelAssumptions) {
  assertRatio('capitalizationRate', assumptions.capitalizationRate)
  assertRatio('constructionLoanToCost', assumptions.constructionLoanToCost, true)
  assertRatio('contingencyRate', assumptions.contingencyRate, true)
  assertRatio('dispositionCostRate', assumptions.dispositionCostRate, true)
  assertRatio('landClosingCostRate', assumptions.landClosingCostRate, true)
  assertFiniteNonNegative(
    'minimumDebtServiceCoverageRatio',
    assumptions.minimumDebtServiceCoverageRatio,
  )
  assertRatio('operatingExpenseRate', assumptions.operatingExpenseRate)
  assertFiniteNonNegative('permanentAmortizationYears', assumptions.permanentAmortizationYears)
  assertRatio('softCostRate', assumptions.softCostRate, true)
  assertRatio('takeoutCostBasisLimit', assumptions.takeoutCostBasisLimit, true)
  assertFiniteNonNegative('takeoutInterestRate', assumptions.takeoutInterestRate)
  assertRatio('takeoutLoanToValue', assumptions.takeoutLoanToValue, true)
  assertRatio('vacancyRate', assumptions.vacancyRate)

  if (assumptions.capitalizationRate === 0) {
    throw new RangeError('capitalizationRate must be greater than zero')
  }
  if (assumptions.minimumDebtServiceCoverageRatio === 0) {
    throw new RangeError('minimumDebtServiceCoverageRatio must be greater than zero')
  }
  if (assumptions.permanentAmortizationYears === 0) {
    throw new RangeError('permanentAmortizationYears must be greater than zero')
  }
}

function validate(input: BuildUnderwritingInput, assumptions: BuildModelAssumptions) {
  assertFiniteNonNegative('areaPerUnit', input.areaPerUnit)
  assertFiniteNonNegative('buildCostPerSquareFoot', input.buildCostPerSquareFoot)
  assertFiniteNonNegative('exitValue', input.exitValue)
  assertFiniteNonNegative('landBasis', input.landBasis)
  assertFiniteNonNegative('monthlyRentPerUnit', input.monthlyRentPerUnit)

  if (!Number.isInteger(input.units) || input.units <= 0) {
    throw new RangeError('units must be a positive integer')
  }

  validateAssumptions(assumptions)
}

function roundTo(value: number, increment: number) {
  return Math.round(value / increment) * increment
}

/** Annual payment per dollar of principal for a monthly amortizing loan. */
export function getAnnualMortgageConstant(annualRate: number, amortizationYears: number) {
  assertFiniteNonNegative('annualRate', annualRate)
  assertFiniteNonNegative('amortizationYears', amortizationYears)
  if (amortizationYears === 0) throw new RangeError('amortizationYears must be greater than zero')
  if (annualRate === 0) return 1 / amortizationYears

  const monthlyRate = annualRate / 12
  const paymentCount = amortizationYears * 12
  const growth = (1 + monthlyRate) ** paymentCount
  return ((monthlyRate * growth) / (growth - 1)) * 12
}

export function estimateStabilizedValue(
  monthlyRentPerUnit: number,
  units: number,
  assumptions: BuildModelAssumptions = BUILD_MODEL_ASSUMPTIONS,
) {
  assertFiniteNonNegative('monthlyRentPerUnit', monthlyRentPerUnit)
  if (!Number.isInteger(units) || units <= 0)
    throw new RangeError('units must be a positive integer')
  validateAssumptions(assumptions)

  const grossPotentialRent = monthlyRentPerUnit * units * 12
  const effectiveGrossIncome = grossPotentialRent * (1 - assumptions.vacancyRate)
  const netOperatingIncome = effectiveGrossIncome * (1 - assumptions.operatingExpenseRate)
  return netOperatingIncome / assumptions.capitalizationRate
}

export function estimateMonthlyRentForValue(
  value: number,
  units: number,
  assumptions: BuildModelAssumptions = BUILD_MODEL_ASSUMPTIONS,
) {
  assertFiniteNonNegative('value', value)
  if (!Number.isInteger(units) || units <= 0)
    throw new RangeError('units must be a positive integer')
  validateAssumptions(assumptions)

  const incomeFactor =
    units * 12 * (1 - assumptions.vacancyRate) * (1 - assumptions.operatingExpenseRate)
  return (value * assumptions.capitalizationRate) / incomeFactor
}

/**
 * Deterministic, static-market-snapshot development underwriting.
 *
 * Permanent debt is constrained independently by cost basis, LTV, and DSCR.
 * Cash yield uses peak project equity required, so refinancing proceeds cannot
 * turn a non-zero cash flow into a fabricated zero-percent return.
 */
export function calculateBuildUnderwriting(
  input: BuildUnderwritingInput,
  assumptions: BuildModelAssumptions = BUILD_MODEL_ASSUMPTIONS,
) {
  validate(input, assumptions)

  const totalArea = input.areaPerUnit * input.units
  const hardConstructionCost = input.buildCostPerSquareFoot * totalArea
  const softCosts = hardConstructionCost * assumptions.softCostRate
  const contingency = hardConstructionCost * assumptions.contingencyRate
  const projectAllowance = softCosts + contingency
  const financedConstructionCost = hardConstructionCost + projectAllowance
  const constructionLoan = financedConstructionCost * assumptions.constructionLoanToCost
  const landClosingCosts = input.landBasis * assumptions.landClosingCostRate
  const totalDevelopmentCost =
    input.landBasis +
    landClosingCosts +
    hardConstructionCost +
    softCosts +
    contingency

  const grossPotentialRent = input.monthlyRentPerUnit * input.units * 12
  const vacancyAllowance = grossPotentialRent * assumptions.vacancyRate
  const effectiveGrossIncome = grossPotentialRent - vacancyAllowance
  const operatingExpenses = effectiveGrossIncome * assumptions.operatingExpenseRate
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses
  const stabilizedValue = netOperatingIncome / assumptions.capitalizationRate

  const annualMortgageConstant = getAnnualMortgageConstant(
    assumptions.takeoutInterestRate,
    assumptions.permanentAmortizationYears,
  )
  const takeoutLimits: ReadonlyArray<{ amount: number; constraint: TakeoutConstraint }> = [
    {
      amount: totalDevelopmentCost * assumptions.takeoutCostBasisLimit,
      constraint: 'costBasis',
    },
    {
      amount: stabilizedValue * assumptions.takeoutLoanToValue,
      constraint: 'loanToValue',
    },
    {
      amount:
        netOperatingIncome / assumptions.minimumDebtServiceCoverageRatio / annualMortgageConstant,
      constraint: 'debtServiceCoverage',
    },
  ]
  const bindingTakeoutLimit = takeoutLimits.reduce((lowest, candidate) =>
    candidate.amount < lowest.amount ? candidate : lowest,
  )
  const takeoutLoan = Math.max(bindingTakeoutLimit.amount, 0)
  const annualDebtService = takeoutLoan * annualMortgageConstant
  const monthlyTakeoutPayment = annualDebtService / 12
  const debtServiceCoverageRatio =
    annualDebtService === 0 ? null : netOperatingIncome / annualDebtService
  const annualCashFlow = netOperatingIncome - annualDebtService
  const grossMonthlyRent = grossPotentialRent / 12
  const netMonthlyCashFlow = annualCashFlow / 12

  const constructionEquityRequired = Math.max(totalDevelopmentCost - constructionLoan, 0)
  const stabilizedEquity = Math.max(totalDevelopmentCost - takeoutLoan, 0)
  const requiredEquity = Math.max(constructionEquityRequired, stabilizedEquity)
  const additionalEquityAtTakeout = Math.max(stabilizedEquity - constructionEquityRequired, 0)
  const equityReturnedAtTakeout = Math.max(constructionEquityRequired - stabilizedEquity, 0)
  const takeoutShortfall = Math.max(constructionLoan - takeoutLoan, 0)
  const cashYield = requiredEquity === 0 ? null : annualCashFlow / requiredEquity

  const dispositionCosts = input.exitValue * assumptions.dispositionCostRate
  const netSaleProceeds = input.exitValue - dispositionCosts
  const rawExitProfit = netSaleProceeds - totalDevelopmentCost
  const exitMargin = netSaleProceeds === 0 ? null : rawExitProfit / netSaleProceeds
  const result = input.strategy === 'rent' ? annualCashFlow : rawExitProfit
  const returnRate =
    input.strategy === 'rent'
      ? cashYield === null
        ? null
        : cashYield * 100
      : exitMargin === null
        ? null
        : exitMargin * 100

  return {
    additionalEquityAtTakeout,
    annualCashFlow,
    annualDebtService,
    annualMortgageConstant,
    cashYield,
    constructionEquityRequired,
    constructionLoan,
    contingency,
    debtServiceCoverageRatio,
    dispositionCosts,
    effectiveGrossIncome,
    equityReturnedAtTakeout,
    exitMargin,
    grossPotentialRent,
    grossMonthlyRent,
    hardConstructionCost,
    landClosingCosts,
    loanToCost: totalDevelopmentCost === 0 ? null : takeoutLoan / totalDevelopmentCost,
    loanToValue: stabilizedValue === 0 ? null : takeoutLoan / stabilizedValue,
    netOperatingIncome,
    netMonthlyCashFlow,
    netSaleProceeds,
    operatingExpenses,
    projectAllowance,
    requiredEquity,
    result: roundTo(result, input.strategy === 'rent' ? 1_000 : 10_000),
    returnRate,
    softCosts,
    stabilizedEquity,
    stabilizedValue,
    takeoutLoan,
    takeoutLoanConstraint: bindingTakeoutLimit.constraint,
    monthlyTakeoutPayment,
    takeoutShortfall,
    totalArea,
    totalDevelopmentCost,
    vacancyAllowance,
  }
}
