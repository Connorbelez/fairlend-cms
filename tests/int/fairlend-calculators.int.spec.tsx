import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import { CALCULATORS, getCalculator } from '@/calculators/catalog'
import { calculate, defaultInputs, hasFiniteNumericOutputs } from '@/calculators/engine'
import { periodicPayment } from '@/calculators/math'
import { CalculatorDirectory } from '@/components/Calculators/CalculatorDirectory.client'
import { CalculatorWorkbench } from '@/components/Calculators/CalculatorWorkbench.client'

function calculator(slug: string) {
  const definition = getCalculator(slug)
  if (!definition) throw new Error(`Missing calculator ${slug}`)
  return definition
}

function workbench(slug: string) {
  const definition = calculator(slug)
  const initialInputs = defaultInputs(definition)
  return <CalculatorWorkbench definition={definition} initialInputs={initialInputs} initialResult={calculate(definition, initialInputs)} />
}

describe('calculator catalog and default scenarios', () => {
  it('publishes every one of the 42 scoped tools at a unique canonical slug', () => {
    expect(CALCULATORS).toHaveLength(42)
    expect(new Set(CALCULATORS.map((item) => item.slug))).toHaveLength(42)
    expect(new Set(CALCULATORS.map((item) => item.title))).toHaveLength(42)
  })

  it.each(CALCULATORS.map((item) => [item.slug] as const))('%s returns every declared result as a finite or intentional non-numeric value', (slug) => {
    const definition = calculator(slug)
    const computed = calculate(definition, defaultInputs(definition))

    expect(hasFiniteNumericOutputs(computed)).toBe(true)
    for (const declared of definition.results) {
      expect(computed.values).toHaveProperty(declared.key)
      expect(computed.values[declared.key]).not.toBeUndefined()
    }
    expect(definition.sources.length).toBeGreaterThan(0)
    expect(definition.sources.every((source) => source.verifiedAt === '2026-07-14')).toBe(true)
  })
})

describe('independent calculator golden cases', () => {
  it('amortizes a zero-rate $120,000 loan to 120 payments of $1,000', () => {
    expect(periodicPayment(120_000, 0, 120)).toBe(1_000)
  })

  it('keeps principal unchanged for an interest-only private mortgage', () => {
    const definition = calculator('private-mortgage-total-cost')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      principal: 500_000,
      interestOnly: true,
      termMonths: 12,
    })

    expect(computed.values.remainingBalance).toBe(500_000)
    expect(computed.values.interestCost).toBeGreaterThan(0)
  })

  it('returns zero net equity cushion when value equals debt plus modeled sale costs', () => {
    const definition = calculator('equity-ltv-cushion')
    const computed = calculate(definition, {
      propertyValueLow: 800_000,
      propertyValueHigh: 800_000,
      existingDebt: 600_000,
      requestedAdvance: 150_000,
      sellingCostRate: 0.0625,
    })

    expect(computed.values.cushionLow).toBe(0)
    expect(computed.values.ltvLow).toBe(0.9375)
  })

  it('rounds 10% of 41 MLI units upward to five units', () => {
    const definition = calculator('mli-select-affordability-commitment')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      affordabilityLevel: 50,
      projectType: 'new',
      totalUnits: 41,
    })

    expect(computed.values.requiredUnits).toBe(5)
  })

  it('uses the lower existing-property energy/GHG tier for MLI points', () => {
    const definition = calculator('mli-select-points-flexibility')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      accessibilityPath: 'none',
      affordableUnits: 0,
      energyReduction: 0.3,
      ghgReduction: 0.2,
      projectType: 'existing',
    })

    expect(computed.values.energyPoints).toBe(20)
    expect(computed.values.points).toBe(20)
  })

  it('awards no accessibility points when the all-unit/common-area baseline fails', () => {
    const definition = calculator('mli-select-points-flexibility')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      accessibilityBaseline: false,
      accessibilityPath: 'level2',
      affordableUnits: 0,
      energyPerformance: 0,
    })

    expect(computed.values.accessibilityPoints).toBe(0)
    expect(computed.warnings.join(' ')).toContain('baseline')
  })

  it('awards no 20-year bonus when no affordability tier is earned', () => {
    const definition = calculator('mli-select-points-flexibility')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      affordableUnits: 0,
      energyPerformance: 0,
      longCommitment: true,
    })

    expect(computed.values.affordabilityPoints).toBe(0)
    expect(computed.values.points).toBe(0)
  })

  it('applies the MLI tier discount by multiplication after the entered premium rate', () => {
    const definition = calculator('mli-select-capital-stack')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      minimumDscr: 1,
      netOperatingIncome: 5_000_000,
      pointsTier: 50,
      premiumRate: 0.04,
      projectCost: 10_000_000,
    })

    expect(computed.values.insuredLoan).toBe(9_500_000)
    expect(computed.values.premium).toBe(342_000)
  })

  it('never distributes more mortgage recovery than net sale proceeds', () => {
    const definition = calculator('ltv-loss-severity')
    const computed = calculate(definition, {
      ...defaultInputs(definition),
      legalCosts: 50_000,
      mortgageBalance: 700_000,
      propertyValue: 600_000,
      saleCostRate: 0.1,
      seniorClaims: 300_000,
    })

    expect(Number(computed.values.netRecovery)).toBeLessThanOrEqual(Number(computed.values.grossSale))
    expect(Number(computed.values.netRecovery)).toBeLessThanOrEqual(700_000)
  })

  it('cannot reduce DSCR-supported project debt when NOI increases', () => {
    const definition = calculator('project-feasibility-sensitivity')
    const base = defaultInputs(definition)
    const lower = calculate(definition, { ...base, monthlyRent: 3_000 })
    const higher = calculate(definition, { ...base, monthlyRent: 4_000 })

    expect(Number(higher.values.maximumLoan)).toBeGreaterThanOrEqual(Number(lower.values.maximumLoan))
  })
})

describe('calculator UI seam', () => {
  afterEach(cleanup)

  it.each(CALCULATORS.map((item) => [item.slug, item.title] as const))('renders the canonical %s workbench with its public controls and disclaimer', (slug, title) => {
    const markup = renderToStaticMarkup(workbench(slug))
    expect(markup).toContain(title)
    expect(markup).toContain('Input docket')
    expect(markup).toContain('Result sheet')
    expect(markup).toContain('Assumption ledger')
    expect(markup).toContain('Preliminary educational scenario only')
  })

  it('updates the labeled input state and can reset the example scenario', () => {
    const view = render(workbench('private-mortgage-total-cost'))
    const principal = view.getByLabelText('Mortgage advance')

    fireEvent.change(principal, { target: { value: '600000' } })
    expect((principal as HTMLInputElement).value).toBe('600000')

    fireEvent.click(view.getByRole('button', { name: 'Reset example' }))
    expect((view.getByLabelText('Mortgage advance') as HTMLInputElement).value).toBe('500000')
  })

  it('filters the directory through its labeled search field', () => {
    const view = render(<CalculatorDirectory />)
    fireEvent.change(view.getByLabelText('Find a tool'), { target: { value: 'loss severity' } })

    expect(view.getByText('LTV vs Loss-Severity Explorer')).toBeTruthy()
    expect(view.queryByText('Draw Schedule Builder')).toBeNull()
  })
})
