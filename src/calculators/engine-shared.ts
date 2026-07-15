import { mortgageConstant, safeDivide } from './math'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function n(inputs: CalculatorInputs, key: string) {
  const value = Number(inputs[key] ?? 0)
  return Number.isFinite(value) ? value : 0
}

export function s(inputs: CalculatorInputs, key: string) {
  return String(inputs[key] ?? '')
}

export function b(inputs: CalculatorInputs, key: string) {
  return Boolean(inputs[key])
}

export function output(
  values: CalculatorOutput['values'],
  notes: readonly string[] = [],
  warnings: readonly string[] = [],
): CalculatorOutput {
  return { notes, values, warnings }
}

export function paymentFor(principal: number, annualRate: number, amortizationYears: number) {
  if (principal <= 0) return 0
  const monthlyRate = annualRate / 12
  const paymentCount = Math.max(amortizationYears * 12, 1)
  if (monthlyRate === 0) return principal / paymentCount
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -paymentCount)
}

export function countMissing(inputs: CalculatorInputs, keys: readonly string[]) {
  const missing = keys.filter((key) => !b(inputs, key))
  return {
    completeness: keys.length === 0 ? 1 : (keys.length - missing.length) / keys.length,
    missing,
  }
}

export function constructionProForma(inputs: CalculatorInputs) {
  const totalCost = n(inputs, 'land') + n(inputs, 'hardCosts') + n(inputs, 'softCosts')
  const grossIncome = n(inputs, 'units') * n(inputs, 'monthlyRent') * 12
  const effectiveIncome = grossIncome * (1 - n(inputs, 'vacancyRate'))
  const noi = effectiveIncome * (1 - n(inputs, 'operatingExpenseRate'))
  const value = n(inputs, 'capRate') > 0 ? noi / n(inputs, 'capRate') : 0
  const annualConstant = mortgageConstant(n(inputs, 'interestRate'), n(inputs, 'amortizationYears'))
  const ltcLoan = totalCost * n(inputs, 'loanToCost')
  const ltvLoan = value * n(inputs, 'loanToValue')
  const dscrLoan = n(inputs, 'minimumDscr') > 0 ? noi / n(inputs, 'minimumDscr') / annualConstant : 0
  const maximumLoan = Math.max(Math.min(ltcLoan, ltvLoan, dscrLoan), 0)
  const annualDebtService = maximumLoan * annualConstant
  return {
    annualDebtService,
    debtServiceCoverage: safeDivide(noi, annualDebtService),
    equityRequired: Math.max(totalCost - maximumLoan, 0),
    grossIncome,
    maximumLoan,
    netOperatingIncome: noi,
    stabilizedValue: value,
    totalDevelopmentCost: totalCost,
  }
}

