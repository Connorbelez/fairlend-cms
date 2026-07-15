import { calculateConstruction } from './engine-construction'
import { calculateGarden } from './engine-garden'
import { calculateInvestor } from './engine-investor'
import { calculateMli } from './engine-mli'
import { calculatePrivate } from './engine-private'
import type { CalculatorDefinition, CalculatorInputs, CalculatorOutput } from './types'

export function defaultInputs(definition: CalculatorDefinition): CalculatorInputs {
  return Object.fromEntries(definition.fields.map((field) => [field.key, field.defaultValue]))
}

export function calculate(definition: CalculatorDefinition, inputs: CalculatorInputs): CalculatorOutput {
  const result = definition.category === 'private-mortgage'
    ? calculatePrivate(definition.model, inputs)
    : definition.category === 'construction'
      ? calculateConstruction(definition.model, inputs)
      : definition.category === 'garden-suite'
        ? calculateGarden(definition.model, inputs)
        : definition.category === 'mli-select'
          ? calculateMli(definition.model, inputs)
          : calculateInvestor(definition.model, inputs)

  return result ?? {
    notes: [],
    values: {},
    warnings: ['This calculator model has not been configured.'],
  }
}

export function hasFiniteNumericOutputs(result: CalculatorOutput) {
  return Object.values(result.values).every((value) => typeof value !== 'number' || Number.isFinite(value))
}

