export type ResolvedMortgageProduct = 'institutional' | 'private'

export const institutionalResidentialMortgageGoals = [
  'Purchase a house or property',
  'First-time home buyer',
] as const

export const privateMortgageSituationOptions = [
  'Close a property quickly',
  'A bank or lender said no',
  'Refinance my mortgage',
  'Get a bridge loan',
  'Home Equity Line of Credit (HELOC)',
  'Mortgage financing for my business',
  'Use equity in my property',
  'Pay out an existing mortgage',
  'Something else',
] as const

export const residentialMortgageSituationOptions = [
  ...institutionalResidentialMortgageGoals,
  ...privateMortgageSituationOptions,
] as const

export function resolveResidentialMortgageProduct(
  situation: string,
): ResolvedMortgageProduct | null {
  if (!situation.trim()) return null

  return institutionalResidentialMortgageGoals.some((goal) => goal === situation)
    ? 'institutional'
    : 'private'
}
