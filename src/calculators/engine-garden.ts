import { addMonths, mortgageConstant, safeDivide } from './math'
import { constructionProForma, countMissing, n, output, paymentFor, s } from './engine-shared'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function calculateGarden(model: string, inputs: CalculatorInputs): CalculatorOutput | null {
  switch (model) {
    case 'garden-financing-stack': {
      const totalCost = n(inputs, 'hardCosts') + n(inputs, 'softCosts')
      const constructionDebt = totalCost * n(inputs, 'loanToCost')
      const monthlyDebtService = paymentFor(constructionDebt + n(inputs, 'existingDebt'), n(inputs, 'interestRate'), n(inputs, 'amortizationYears'))
      return output({ constructionDebt, equityGap: Math.max(totalCost - constructionDebt - n(inputs, 'cashEquity'), 0), monthlyDebtService, rentCoverage: safeDivide(n(inputs, 'monthlyRent'), monthlyDebtService), totalCost })
    }
    case 'cost-to-rent': {
      const noi = n(inputs, 'monthlyRent') * 12 * (1 - n(inputs, 'vacancyRate')) - n(inputs, 'annualExpenses')
      const annualDebtService = paymentFor(n(inputs, 'financedAmount'), n(inputs, 'interestRate'), n(inputs, 'amortizationYears')) * 12
      const annualCashFlow = noi - annualDebtService
      const equity = n(inputs, 'allInCost') - n(inputs, 'financedAmount')
      return output({ annualCashFlow, annualDebtService, netOperatingIncome: noi, simplePaybackYears: annualCashFlow <= 0 ? null : equity / annualCashFlow })
    }
    case 'site-readiness': {
      const status = countMissing(inputs, ['municipality', 'survey', 'servicing', 'access', 'budget', 'equity', 'professionalTeam'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, nextQuestion: status.missing.length ? `Confirm ${status.missing[0]}` : 'Core planning and finance questions recorded' }, ['This does not determine zoning or permit compliance.'])
    }
    case 'multiplex-pro-forma': return output({ ...constructionProForma(inputs), projectMonths: n(inputs, 'projectMonths') })
    case 'density-uplift': {
      const addedUnits = Math.max(n(inputs, 'proposedUnits') - n(inputs, 'existingUnits'), 0)
      const incrementalCost = addedUnits * n(inputs, 'costPerUnit')
      const incrementalIncome = (n(inputs, 'proposedMonthlyIncome') - n(inputs, 'existingMonthlyIncome')) * 12
      return output({ addedUnits, capitalRequirement: Math.max(incrementalCost - n(inputs, 'availableCapital'), 0), incrementalCost, incrementalIncome, incrementalValue: n(inputs, 'proposedValue') - n(inputs, 'existingValue'), yieldOnCost: safeDivide(incrementalIncome, incrementalCost) })
    }
    case 'bridge-to-takeout': {
      const annualConstant = mortgageConstant(n(inputs, 'interestRate'), n(inputs, 'amortizationYears'))
      const value = n(inputs, 'capRate') > 0 ? n(inputs, 'netOperatingIncome') / n(inputs, 'capRate') : 0
      const dscrLoan = n(inputs, 'netOperatingIncome') / n(inputs, 'minimumDscr') / annualConstant
      const ltvLoan = value * n(inputs, 'loanToValue')
      const takeoutLoan = Math.max(Math.min(dscrLoan, ltvLoan), 0)
      return output({ constraint: dscrLoan < ltvLoan ? 'Debt service coverage' : 'Loan to value', equityGap: Math.max(n(inputs, 'constructionDebt') - takeoutLoan, 0), stabilizedValue: value, takeoutLoan })
    }
    case 'permit-timeline': {
      const planningComplete = addMonths(s(inputs, 'startDate'), n(inputs, 'planningMonths'))
      const permitComplete = addMonths(planningComplete, n(inputs, 'permitMonths'))
      const financeReady = addMonths(s(inputs, 'startDate'), n(inputs, 'lenderMonths'))
      const constructionStart = financeReady > permitComplete ? financeReady : permitComplete
      return output({ completionDate: addMonths(constructionStart, n(inputs, 'constructionMonths') + n(inputs, 'bufferMonths')), constructionStart, financeReady, permitComplete })
    }
    case 'utility-stress': {
      const lengthEstimate = n(inputs, 'serviceLength') * n(inputs, 'costPerMetre')
      const baseEstimate = Math.max(n(inputs, 'baseAllowance'), n(inputs, 'quotedAmount'), lengthEstimate)
      const stressedAllowance = baseEstimate * (1 + n(inputs, 'contingencyRate') + n(inputs, 'downsideRate'))
      return output({ baseEstimate, lengthEstimate, stressedAllowance, varianceToBudget: stressedAllowance - n(inputs, 'baseAllowance') })
    }
    default: return null
  }
}

