export type CalculatorCategory =
  | 'private-mortgage'
  | 'construction'
  | 'garden-suite'
  | 'mli-select'
  | 'investor'

export type CalculatorKind = 'calculator' | 'comparator' | 'planner' | 'checklist'

export type CalculatorFieldType =
  | 'currency'
  | 'date'
  | 'number'
  | 'percent'
  | 'select'
  | 'toggle'

export type CalculatorFieldOption = {
  label: string
  value: string
}

export type CalculatorField = {
  defaultValue: boolean | number | string
  description?: string
  group?: string
  key: string
  label: string
  max?: number
  min?: number
  options?: readonly CalculatorFieldOption[]
  step?: number
  suffix?: string
  type: CalculatorFieldType
}

export type CalculatorResultFormat =
  | 'currency'
  | 'date'
  | 'months'
  | 'number'
  | 'percent'
  | 'ratio'
  | 'text'

export type CalculatorResultDefinition = {
  description?: string
  emphasis?: boolean
  format: CalculatorResultFormat
  key: string
  label: string
}

export type CalculatorSource = {
  effectiveDate?: string
  organization: string
  title: string
  url: string
  verifiedAt: string
}

export type AssumptionStatus = 'illustrative' | 'published' | 'unresolved' | 'user'

export type CalculatorAssumption = {
  label: string
  status: AssumptionStatus
  value: string
}

export type CalculatorDefinition = {
  assumptions: readonly CalculatorAssumption[]
  category: CalculatorCategory
  description: string
  fields: readonly CalculatorField[]
  formulaSummary: readonly string[]
  kind: CalculatorKind
  model: string
  results: readonly CalculatorResultDefinition[]
  slug: string
  sources: readonly CalculatorSource[]
  title: string
}

export type CalculatorInputValue = boolean | number | string
export type CalculatorInputs = Record<string, CalculatorInputValue>
export type CalculatorOutputValue = number | string | null

export type CalculatorOutput = {
  notes: readonly string[]
  values: Record<string, CalculatorOutputValue>
  warnings: readonly string[]
}

