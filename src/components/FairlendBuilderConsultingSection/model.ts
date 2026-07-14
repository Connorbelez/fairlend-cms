export const BUILDER_MODEL_SNAPSHOT = '2026-07-13'
export const ILLUSTRATIVE_CAP_RATE = 0.05

export type BuilderEconomicsInput = {
  annualDebtService?: number
  buildAreaSquareFeet: number
  buildCostPerSquareFoot: number
  exitValue: number
  landBasis: number
  loanAmount?: number
  monthlyRentPerUnit?: number
  operatingExpenseRate?: number
  softCostPerSquareFoot: number
  units?: number
}

export function calculateBuilderEconomics(input: BuilderEconomicsInput) {
  const hardCosts = input.buildAreaSquareFeet * input.buildCostPerSquareFoot
  const softCosts = input.buildAreaSquareFeet * input.softCostPerSquareFoot
  const totalCost = input.landBasis + hardCosts + softCosts
  const profit = input.exitValue - totalCost
  const margin = input.exitValue === 0 ? 0 : profit / input.exitValue
  const grossAnnualRent = (input.monthlyRentPerUnit ?? 0) * (input.units ?? 0) * 12
  const netOperatingIncome = grossAnnualRent * (1 - (input.operatingExpenseRate ?? 0))
  const annualCashFlow = netOperatingIncome - (input.annualDebtService ?? 0)
  const cashInvested = Math.max(totalCost - (input.loanAmount ?? 0), 0)
  const cashYield = cashInvested === 0 ? 0 : annualCashFlow / cashInvested
  const capitalizedValue = netOperatingIncome / ILLUSTRATIVE_CAP_RATE

  return {
    annualCashFlow,
    capitalizedValue,
    cashInvested,
    cashYield,
    grossAnnualRent,
    hardCosts,
    margin,
    netOperatingIncome,
    profit,
    softCosts,
    totalCost,
  }
}

export const southernOntarioBuilderPresets = {
  gardenSuite: {
    geography: 'Southern Ontario',
    snapshot: BUILDER_MODEL_SNAPSHOT,
    totalBuildCostRange: [400_000, 600_000],
    units: 1,
  },
  luxuryInfill2019: {
    buildAreaSquareFeet: 3_800,
    buildCostPerSquareFoot: 400,
    exitValue: 3_650_000,
    landBasis: 1_000_000,
    softCostPerSquareFoot: 50,
  },
  multiplexRental: {
    buildAreaSquareFeet: 7_500,
    buildCostPerSquareFoot: 250,
    landBasis: 1_100_000,
    monthlyRentPerUnit: 4_000,
    operatingExpenseRate: 0.35,
    softCostPerSquareFoot: 50,
    units: 5,
  },
} as const

const torontoLuxury2019Inputs = southernOntarioBuilderPresets.luxuryInfill2019
const torontoLuxury2019Results = calculateBuilderEconomics(torontoLuxury2019Inputs)

function formatSignedMillions(value: number) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${(Math.abs(value) / 1_000_000).toFixed(2)}M*`
}

export const torontoLuxury2019Model = {
  build: `$${torontoLuxury2019Inputs.buildCostPerSquareFoot}/ft²`,
  buildArea: `${torontoLuxury2019Inputs.buildAreaSquareFeet.toLocaleString('en-CA')} ft²`,
  land: `$${(torontoLuxury2019Inputs.landBasis / 1_000_000).toFixed(2)}M`,
  margin: `${(torontoLuxury2019Results.margin * 100).toFixed(1)}%*`,
  profit: formatSignedMillions(torontoLuxury2019Results.profit),
  sale: `$${(torontoLuxury2019Inputs.exitValue / 1_000_000).toFixed(2)}M`,
  soft: `$${torontoLuxury2019Inputs.softCostPerSquareFoot}/ft²`,
} as const
