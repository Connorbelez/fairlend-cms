import { describe, expect, it } from 'vitest'

import {
  calculateBuilderEconomics,
  ILLUSTRATIVE_CAP_RATE,
  southernOntarioBuilderPresets,
} from '@/components/FairlendBuilderConsultingSection/model'

describe('builder consulting economics', () => {
  it('returns a nonzero cash yield when the five-unit reproduction has positive cash flow', () => {
    const result = calculateBuilderEconomics({
      ...southernOntarioBuilderPresets.multiplexRental,
      annualDebtService: 133_000,
      exitValue: 0,
      loanAmount: 2_350_000,
    })

    expect(result.annualCashFlow).toBe(23_000)
    expect(result.cashInvested).toBe(1_000_000)
    expect(result.cashYield).toBeCloseTo(0.023, 6)
  })

  it('handles zero and negative rental cash flow deterministically', () => {
    const base = {
      ...southernOntarioBuilderPresets.multiplexRental,
      exitValue: 0,
      loanAmount: 2_350_000,
    }

    expect(calculateBuilderEconomics({ ...base, annualDebtService: 156_000 }).cashYield).toBe(0)
    expect(calculateBuilderEconomics({ ...base, annualDebtService: 180_000 }).cashYield).toBe(-0.024)
  })

  it('uses the 5% illustrative capitalization rate in derived valuation', () => {
    const result = calculateBuilderEconomics({
      ...southernOntarioBuilderPresets.multiplexRental,
      exitValue: 0,
    })

    expect(ILLUSTRATIVE_CAP_RATE).toBe(0.05)
    expect(result.netOperatingIncome).toBe(156_000)
    expect(result.capitalizedValue).toBe(3_120_000)
  })

  it('includes soft costs exactly once in total cost and profit', () => {
    const result = calculateBuilderEconomics(southernOntarioBuilderPresets.luxuryInfill2019)

    expect(result.hardCosts).toBe(1_520_000)
    expect(result.softCosts).toBe(190_000)
    expect(result.totalCost).toBe(2_710_000)
    expect(result.profit).toBe(940_000)
  })
})
