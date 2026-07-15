import { describe, expect, it } from 'vitest'

import { BUILD_MODEL_ASSUMPTIONS } from '@/components/FairlendBuildModelSection/market-data'
import {
  calculateBuildUnderwriting,
  getAnnualMortgageConstant,
} from '@/components/FairlendBuildModelSection/underwriting'

const screenshotScenario = {
  areaPerUnit: 1_500,
  buildCostPerSquareFoot: 310,
  exitValue: 0,
  landBasis: 950_000,
  monthlyRentPerUnit: 4_000,
  strategy: 'rent' as const,
  units: 7,
}

describe('build sensitivity underwriting', () => {
  it('returns gross rental revenue without vacancy, expense, or financing deductions', () => {
    const result = calculateBuildUnderwriting(screenshotScenario)

    expect(result.hardConstructionCost).toBe(3_255_000)
    expect(result.softCosts).toBe(390_600)
    expect(result.contingency).toBe(260_400)
    expect(result.totalDevelopmentCost).toBe(4_879_750)
    expect(result.grossMonthlyRent).toBe(28_000)
    expect(result.grossPotentialRent).toBe(336_000)
    expect(result.netOperatingIncome).toBeCloseTo(221_625.6, 4)
    expect(result.takeoutLoanConstraint).toBe('debtServiceCoverage')
    expect(result.takeoutLoan).toBeCloseTo(2_866_998.27, 2)
    expect(result.annualDebtService).toBeCloseTo(184_688, 2)
    expect(result.debtServiceCoverageRatio).toBeCloseTo(1.2, 8)
    expect(result.annualCashFlow).toBeCloseTo(36_937.6, 4)
    expect(result.requiredEquity).toBeCloseTo(2_012_751.73, 2)
    expect(result.cashYield).toBeCloseTo(0.01835179, 7)
    expect(result.returnRate).toBeCloseTo(1.835179, 6)
  })

  it('uses amortizing debt service instead of interest-only payments', () => {
    const result = calculateBuildUnderwriting(screenshotScenario)
    const interestOnlyPayment = result.takeoutLoan * BUILD_MODEL_ASSUMPTIONS.takeoutInterestRate

    expect(result.annualMortgageConstant).toBeCloseTo(getAnnualMortgageConstant(0.05, 30), 10)
    expect(result.annualDebtService).toBeGreaterThan(interestOnlyPayment)
  })

  it('never maps positive cash flow to zero yield when cost basis repays all development cost', () => {
    const result = calculateBuildUnderwriting(
      {
        ...screenshotScenario,
        landBasis: 0,
        monthlyRentPerUnit: 20_000,
      },
      {
        ...BUILD_MODEL_ASSUMPTIONS,
        minimumDebtServiceCoverageRatio: 1,
        takeoutLoanToValue: 1,
      },
    )

    expect(result.takeoutLoanConstraint).toBe('costBasis')
    expect(result.annualCashFlow).toBeGreaterThan(0)
    expect(result.constructionEquityRequired).toBeGreaterThan(0)
    expect(result.requiredEquity).toBe(result.constructionEquityRequired)
    expect(result.cashYield).not.toBeNull()
    expect(result.returnRate).not.toBe(0)
  })

  it('returns not-meaningful instead of zero percent when no cash is invested', () => {
    const result = calculateBuildUnderwriting({
      areaPerUnit: 0,
      buildCostPerSquareFoot: 0,
      exitValue: 0,
      landBasis: 0,
      monthlyRentPerUnit: 4_000,
      strategy: 'rent',
      units: 1,
    })

    expect(result.requiredEquity).toBe(0)
    expect(result.annualCashFlow).toBeGreaterThan(0)
    expect(result.cashYield).toBeNull()
    expect(result.returnRate).toBeNull()
  })

  it('rejects invalid financial inputs before they can produce NaN output', () => {
    expect(() => calculateBuildUnderwriting({ ...screenshotScenario, units: 0 })).toThrow(
      'units must be a positive integer',
    )
    expect(() =>
      calculateBuildUnderwriting({ ...screenshotScenario, landBasis: Number.NaN }),
    ).toThrow('landBasis must be a finite number')
  })
})
