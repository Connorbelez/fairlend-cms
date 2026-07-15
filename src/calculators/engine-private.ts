import { addMonths, canadianPeriodicRate, monthsBetween, periodicPayment, remainingBalance, safeDivide, subtractMonths } from './math'
import { b, countMissing, n, output, paymentFor, s } from './engine-shared'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function calculatePrivate(model: string, inputs: CalculatorInputs): CalculatorOutput | null {
  switch (model) {
    case 'private-total-cost': {
      const principal = n(inputs, 'principal')
      const termMonths = Math.max(n(inputs, 'termMonths'), 1)
      const rate = n(inputs, 'interestRate')
      const monthlyRate = canadianPeriodicRate(rate, 12, s(inputs, 'compounding') === 'monthly' ? 12 : 2)
      const payment = b(inputs, 'interestOnly') ? principal * monthlyRate : periodicPayment(principal, monthlyRate, Math.max(n(inputs, 'amortizationYears') * 12, termMonths))
      const balance = b(inputs, 'interestOnly') ? principal : remainingBalance(principal, monthlyRate, payment, termMonths)
      const principalRepaid = principal - balance
      const interest = payment * termMonths - principalRepaid
      const upfront = n(inputs, 'lenderFee') + n(inputs, 'brokerFee') + n(inputs, 'legalFee') + n(inputs, 'appraisalFee') + n(inputs, 'prepaidInterest')
      const exit = n(inputs, 'renewalFee') + n(inputs, 'dischargeFee')
      const totalCost = interest + upfront + exit
      return output({ annualizedCost: safeDivide(totalCost, principal) === null ? null : totalCost / principal * (12 / termMonths), cashAtClosing: upfront, interestCost: interest, monthlyPayment: payment, remainingBalance: balance, totalCost }, ['Annualized cost is a simple holding-period cost rate, not a lender APR or IRR.'])
    }
    case 'exit-runway': {
      const maturityDate = addMonths(s(inputs, 'closingDate'), n(inputs, 'termMonths') + n(inputs, 'extensionMonths'))
      const routeMonths = n(inputs, `${s(inputs, 'exitRoute')}Months`)
      const requiredMonths = routeMonths + n(inputs, 'bufferMonths')
      const latestStartDate = subtractMonths(maturityDate, requiredMonths)
      const runwayMonths = monthsBetween(s(inputs, 'closingDate'), latestStartDate)
      return output({ latestStartDate, maturityDate, riskFlag: runwayMonths <= 1 ? 'Immediate action window' : runwayMonths <= 3 ? 'Compressed runway' : 'Runway remains', runwayMonths })
    }
    case 'blended-second': {
      const firstBalance = n(inputs, 'firstBalance')
      const secondBalance = n(inputs, 'secondBalance')
      const totalBalance = firstBalance + secondBalance
      const weightedRate = totalBalance === 0 ? null : (firstBalance * n(inputs, 'firstRate') + secondBalance * n(inputs, 'secondRate')) / totalBalance
      const monthlyDebtService = n(inputs, 'firstPayment') + n(inputs, 'secondPayment')
      return output({ holdingCost: monthlyDebtService * n(inputs, 'holdingMonths') + n(inputs, 'secondFee'), monthlyDebtService, secondMortgageShare: safeDivide(secondBalance, totalBalance), weightedRate })
    }
    case 'refinance-vs-second': {
      const totalRefinance = n(inputs, 'existingBalance') + n(inputs, 'newFunds')
      const refinancePayment = paymentFor(totalRefinance, n(inputs, 'refinanceRate'), n(inputs, 'amortizationYears'))
      const secondPayment = paymentFor(n(inputs, 'newFunds'), n(inputs, 'secondRate'), n(inputs, 'secondAmortizationYears'))
      const secondCombinedPayment = n(inputs, 'existingPayment') + secondPayment
      const refinanceUpfront = n(inputs, 'penalty') + n(inputs, 'refinanceFees')
      const secondUpfront = n(inputs, 'secondFees')
      const monthlySavings = secondCombinedPayment - refinancePayment
      const breakEvenMonths = monthlySavings <= 0 ? null : Math.ceil((refinanceUpfront - secondUpfront) / monthlySavings)
      const hold = n(inputs, 'holdingMonths')
      const refinanceCost = refinanceUpfront + refinancePayment * hold
      const secondCost = secondUpfront + secondCombinedPayment * hold
      return output({ breakEvenMonths, lowerCostScenario: refinanceCost < secondCost ? 'Refinance' : 'Second mortgage', refinanceCost, refinancePayment, secondCost, secondCombinedPayment })
    }
    case 'equity-ltv': {
      const totalDebt = n(inputs, 'existingDebt') + n(inputs, 'requestedAdvance')
      const lowValue = n(inputs, 'propertyValueLow')
      const highValue = n(inputs, 'propertyValueHigh')
      const sellingRate = n(inputs, 'sellingCostRate')
      return output({ cushionHigh: highValue * (1 - sellingRate) - totalDebt, cushionLow: lowValue * (1 - sellingRate) - totalDebt, ltvHigh: safeDivide(totalDebt, highValue), ltvLow: safeDivide(totalDebt, lowValue), totalDebt })
    }
    case 'renew-or-exit': {
      const balance = n(inputs, 'balance')
      const months = n(inputs, 'saleMonths')
      const renewalCost = balance * n(inputs, 'renewalRate') * (months / 12) + n(inputs, 'renewalFee')
      const alternativeCost = balance * n(inputs, 'alternativeRate') * (months / 12) + n(inputs, 'alternativeFee')
      const monthlyDifference = balance * (n(inputs, 'renewalRate') - n(inputs, 'alternativeRate')) / 12
      const breakEvenMonths = monthlyDifference <= 0 ? null : Math.ceil((n(inputs, 'alternativeFee') - n(inputs, 'renewalFee')) / monthlyDifference)
      return output({ alternativeCost, breakEvenMonths, lowerCostScenario: renewalCost <= alternativeCost ? 'Renewal' : 'Alternative financing', renewalCost })
    }
    case 'commitment-comparator': {
      const advance = n(inputs, 'advance')
      const months = n(inputs, 'termMonths')
      const costs = ['A', 'B', 'C'].map((label) => ({ cost: advance * n(inputs, `rate${label}`) * (months / 12) + n(inputs, `fee${label}`), label: `Commitment ${label}` }))
      const lowest = costs.reduce((best, item) => item.cost < best.cost ? item : best)
      return output({ costA: costs[0].cost, costB: costs[1].cost, costC: costs[2].cost, lowestCost: lowest.label })
    }
    case 'document-readiness': {
      const status = countMissing(inputs, ['identity', 'property', 'mortgage', 'income', 'exitPlan', 'taxes', 'insurance'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, missingItems: status.missing.length ? status.missing.join(', ') : 'Core file present' }, ['This is an information checklist, not an approval or underwriting score.'])
    }
    case 'loss-waterfall': {
      const saleProceeds = n(inputs, 'propertyValue') * (1 - n(inputs, 'saleCostRate'))
      const enforcementCosts = n(inputs, 'arrears') + n(inputs, 'legalCosts') + n(inputs, 'monthlyCarry') * n(inputs, 'saleMonths') + n(inputs, 'priorityClaims')
      const recoveryAvailable = Math.max(saleProceeds - enforcementCosts, 0)
      const recovery = Math.min(recoveryAvailable, n(inputs, 'mortgageBalance'))
      const shortfall = Math.max(n(inputs, 'mortgageBalance') - recovery, 0)
      return output({ enforcementCosts, lossSeverity: safeDivide(shortfall, n(inputs, 'mortgageBalance')), netRecovery: recovery, saleProceeds, shortfall })
    }
    case 'debt-horizon': {
      const balance = n(inputs, 'debtBalance')
      const horizon = Math.max(n(inputs, 'horizonMonths'), 1)
      const currentEndBalance = remainingBalance(balance, n(inputs, 'currentRate') / 12, n(inputs, 'currentPayment'), horizon)
      const proposedPayment = paymentFor(balance + n(inputs, 'fees'), n(inputs, 'mortgageRate'), n(inputs, 'amortizationYears'))
      const proposedEndBalance = remainingBalance(balance + n(inputs, 'fees'), n(inputs, 'mortgageRate') / 12, proposedPayment, horizon)
      return output({ currentEndBalance, monthlyCashFlowChange: n(inputs, 'currentPayment') - proposedPayment, proposedEndBalance, proposedPayment, totalDebtDifference: proposedEndBalance - currentEndBalance })
    }
    default: return null
  }
}

