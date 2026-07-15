import type { CalculatorCategory } from './types'

export const CALCULATOR_CATEGORIES: ReadonlyArray<{
  description: string
  id: CalculatorCategory
  label: string
}> = [
  { id: 'private-mortgage', label: 'Private mortgage decisions', description: 'Compare complete borrowing costs, equity, runway, and documentation.' },
  { id: 'construction', label: 'Construction and builder liquidity', description: 'Model draw timing, cash gaps, delays, and cost-to-complete.' },
  { id: 'garden-suite', label: 'Garden suites and multiplexes', description: 'Connect project cost, rent, permit dependencies, and takeout financing.' },
  { id: 'mli-select', label: 'MLI Select and rental housing', description: 'Model points, affordability, evidence, and constrained insured debt.' },
  { id: 'investor', label: 'Private mortgage investing', description: 'Inspect net yield, loss severity, concentration, and file readiness.' },
]

export function getCalculatorCategory(category: CalculatorCategory) {
  return CALCULATOR_CATEGORIES.find((item) => item.id === category)
}

