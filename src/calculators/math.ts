const DAYS_PER_YEAR = 365

export function assertFinite(name: string, value: number, minimum = 0) {
  if (!Number.isFinite(value) || value < minimum) {
    throw new RangeError(`${name} must be a finite number greater than or equal to ${minimum}`)
  }
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function canadianPeriodicRate(
  nominalAnnualRate: number,
  paymentsPerYear = 12,
  compoundingPeriodsPerYear = 2,
) {
  assertFinite('nominalAnnualRate', nominalAnnualRate)
  assertFinite('paymentsPerYear', paymentsPerYear, 1)
  assertFinite('compoundingPeriodsPerYear', compoundingPeriodsPerYear, 1)
  return (1 + nominalAnnualRate / compoundingPeriodsPerYear) **
    (compoundingPeriodsPerYear / paymentsPerYear) - 1
}

export function periodicPayment(
  principal: number,
  periodicRate: number,
  paymentCount: number,
) {
  assertFinite('principal', principal)
  assertFinite('periodicRate', periodicRate)
  assertFinite('paymentCount', paymentCount, 1)
  if (periodicRate === 0) return principal / paymentCount
  return (principal * periodicRate) / (1 - (1 + periodicRate) ** -paymentCount)
}

export function remainingBalance(
  principal: number,
  periodicRate: number,
  payment: number,
  paymentsMade: number,
) {
  assertFinite('principal', principal)
  assertFinite('periodicRate', periodicRate)
  assertFinite('payment', payment)
  assertFinite('paymentsMade', paymentsMade)
  if (periodicRate === 0) return Math.max(principal - payment * paymentsMade, 0)
  const growth = (1 + periodicRate) ** paymentsMade
  return Math.max(principal * growth - payment * ((growth - 1) / periodicRate), 0)
}

export function mortgageConstant(annualRate: number, amortizationYears: number) {
  assertFinite('annualRate', annualRate)
  assertFinite('amortizationYears', amortizationYears, 1)
  const monthlyRate = annualRate / 12
  return periodicPayment(1, monthlyRate, amortizationYears * 12) * 12
}

export function simpleInterest(principal: number, annualRate: number, days: number) {
  assertFinite('principal', principal)
  assertFinite('annualRate', annualRate)
  assertFinite('days', days)
  return principal * annualRate * (days / DAYS_PER_YEAR)
}

export function monthsBetween(start: string, end: string) {
  const startDate = new Date(`${start}T12:00:00Z`)
  const endDate = new Date(`${end}T12:00:00Z`)
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) return 0
  return Math.max(
    (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
      endDate.getUTCMonth() -
      startDate.getUTCMonth(),
    0,
  )
}

export function addMonths(date: string, months: number) {
  const value = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(value.valueOf())) return ''
  value.setUTCMonth(value.getUTCMonth() + months)
  return value.toISOString().slice(0, 10)
}

export function subtractMonths(date: string, months: number) {
  return addMonths(date, -months)
}

export function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? null : numerator / denominator
}

