import { clamp, safeDivide } from './math'
import { b, countMissing, n, output, s } from './engine-shared'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function calculateInvestor(model: string, inputs: CalculatorInputs): CalculatorOutput | null {
  switch (model) {
    case 'investor-net-yield': {
      const principal = n(inputs, 'principal')
      const interestIncome = principal * n(inputs, 'couponRate') * n(inputs, 'holdingMonths') / 12
      const feeIncome = n(inputs, 'feeIncome')
      const costs = n(inputs, 'servicingCost') + n(inputs, 'legalCost') + n(inputs, 'recoveryCost') + n(inputs, 'capitalLoss')
      const netIncome = interestIncome + feeIncome - costs
      return output({ grossIncome: interestIncome + feeIncome, netIncome, netYield: safeDivide(netIncome, principal) === null ? null : netIncome / principal * (12 / n(inputs, 'holdingMonths')), totalCosts: costs })
    }
    case 'ltv-loss-severity': {
      const grossSale = n(inputs, 'propertyValue') * (1 - n(inputs, 'saleCostRate'))
      const seniorClaims = n(inputs, 'seniorClaims') + n(inputs, 'taxArrears') + n(inputs, 'legalCosts') + n(inputs, 'monthlyCarry') * n(inputs, 'recoveryMonths')
      const recovery = Math.min(Math.max(grossSale - seniorClaims, 0), n(inputs, 'mortgageBalance'))
      const loss = Math.max(n(inputs, 'mortgageBalance') - recovery, 0)
      return output({ grossSale, loss, lossSeverity: safeDivide(loss, n(inputs, 'mortgageBalance')), netRecovery: recovery, seniorClaims })
    }
    case 'portfolio-concentration': {
      const shares = ['share1', 'share2', 'share3', 'share4', 'share5'].map((key) => n(inputs, key))
      const hhi = shares.reduce((sum, share) => sum + share ** 2, 0)
      const largestShare = Math.max(...shares)
      const flags = [largestShare > 0.25, n(inputs, 'secondLienShare') > 0.35, n(inputs, 'maturing12MonthShare') > 0.4].filter(Boolean).length
      return output({ concentrationIndex: hhi, flags, largestShare, unallocatedShare: Math.max(1 - shares.reduce((sum, share) => sum + share, 0), 0) }, ['The concentration index is a descriptive Herfindahl-style measure, not a universal risk limit.'])
    }
    case 'maturity-liquidity': {
      const extension = clamp(n(inputs, 'extensionRate'), 0, 1)
      const expected3 = n(inputs, 'maturing3Months') * (1 - extension)
      const expected6 = expected3 + n(inputs, 'maturing6Months') * (1 - extension)
      const expected12 = expected6 + n(inputs, 'maturing12Months') * (1 - extension)
      return output({ expected12MonthLiquidity: expected12, expected3MonthLiquidity: expected3, expected6MonthLiquidity: expected6, reserveGap: Math.max(n(inputs, 'requiredLiquidity') - n(inputs, 'cashReserve') - expected3, 0) })
    }
    case 'lien-risk-comparator': {
      const missing = countMissing(inputs, ['appraisal', 'titleSearch', 'borrowerReview', 'exitPlan', 'insurance'])
      const nextStep = !b(inputs, 'titleSearch') ? 'Confirm title and priority claims' : !b(inputs, 'appraisal') ? 'Obtain valuation evidence' : !b(inputs, 'exitPlan') ? 'Stress-test the exit route' : 'Review remaining conditions'
      return output({ diligenceFocus: s(inputs, 'lienPosition') === 'second' ? 'Priority, senior-debt, standstill, and enforcement interactions' : 'Value, title, borrower, servicing, and exit evidence', missingCount: missing.missing.length, nextStep }, ['This comparison does not assign a universal risk score.'])
    }
    case 'investor-file-review': {
      const status = countMissing(inputs, ['commitment', 'creditSummary', 'appraisal', 'titleSearch', 'insurance', 'exitEvidence', 'servicingPlan', 'decisionRecord'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, missingItems: status.missing.length ? status.missing.join(', ') : 'Review file recorded' })
    }
    default: return null
  }
}

