import { clamp, safeDivide } from './math'
import { b, constructionProForma, countMissing, n, output } from './engine-shared'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function calculateConstruction(model: string, inputs: CalculatorInputs): CalculatorOutput | null {
  switch (model) {
    case 'working-capital-gap': {
      const budget = n(inputs, 'budget')
      const lagMonths = n(inputs, 'releaseLagDays') / 30.4375
      const holdback = budget * n(inputs, 'holdbackRate')
      const peakCashGap = budget * n(inputs, 'depositRate') + n(inputs, 'monthlySpend') * lagMonths + holdback + budget * n(inputs, 'contingencyRate') + budget * (1 - n(inputs, 'drawPercentage'))
      return output({ interestCarry: peakCashGap * n(inputs, 'interestRate') * Math.max(lagMonths, 1) / 12, minimumLiquidity: peakCashGap * 1.1, peakCashGap, retainedHoldback: holdback })
    }
    case 'draw-schedule': {
      const budget = n(inputs, 'budget')
      const stages = Math.max(Math.round(n(inputs, 'stages')), 1)
      const retainedHoldback = budget * n(inputs, 'holdbackRate')
      const netAvailable = budget - retainedHoldback
      return output({ averageDraw: netAvailable / stages, firstDraw: netAvailable * n(inputs, 'firstDrawShare'), releaseMonth: Math.ceil(stages * n(inputs, 'monthsPerStage') + n(inputs, 'releaseLagDays') / 30.4375), retainedHoldback, totalAvailable: netAvailable })
    }
    case 'interest-by-draw': {
      const draws = Math.max(Math.round(n(inputs, 'drawCount')), 1)
      let outstanding = n(inputs, 'initialDraw')
      let interest = 0
      for (let month = 0; month < draws; month += 1) {
        if (month > 0) outstanding = Math.min(outstanding + n(inputs, 'monthlyDraw'), n(inputs, 'commitment'))
        interest += outstanding * n(inputs, 'interestRate') / 12
      }
      return output({ endingBalance: outstanding, totalCarry: interest + n(inputs, 'fees'), totalFees: n(inputs, 'fees'), totalInterest: interest })
    }
    case 'cost-to-complete': {
      const available = n(inputs, 'cashAvailable') + n(inputs, 'approvedUndrawn')
      const baseNeed = n(inputs, 'remainingBudget') * (1 + n(inputs, 'contingencyRate'))
      const downsideNeed = n(inputs, 'remainingBudget') * (1 + n(inputs, 'contingencyRate') + n(inputs, 'overrunRate'))
      return output({ availableFunds: available, baseSurplus: available - baseNeed, downsideSurplus: available - downsideNeed, fundingNeed: baseNeed })
    }
    case 'change-order': {
      const directCost = n(inputs, 'changeOrder') * (1 + n(inputs, 'contractorMarkup'))
      const financingCost = directCost * n(inputs, 'interestRate') * n(inputs, 'remainingMonths') / 12
      const delayCost = n(inputs, 'monthlyCarry') * n(inputs, 'delayMonths')
      return output({ delayCost, directCost, financingCost, totalImpact: directCost + financingCost + delayCost })
    }
    case 'delay-carry': {
      const months = n(inputs, 'delayMonths')
      const debtInterest = n(inputs, 'debtBalance') * n(inputs, 'interestRate') * months / 12
      const lostRent = n(inputs, 'monthlyRent') * months
      const totalCarry = debtInterest + n(inputs, 'monthlySoftCosts') * months + lostRent
      return output({ debtInterest, lostRent, monthlyCarry: safeDivide(totalCarry, months), totalCarry, weeklyCarry: totalCarry / Math.max(months * 4.345, 1) })
    }
    case 'builder-liquidity': {
      const startingLiquidity = n(inputs, 'cash') + n(inputs, 'receivables') + n(inputs, 'committedFunds') - n(inputs, 'deposits') - n(inputs, 'payables')
      const lowPoint = startingLiquidity - n(inputs, 'weeklyBurn') * Math.min(n(inputs, 'weeks'), n(inputs, 'drawLagWeeks'))
      return output({ lowPoint, minimumBuffer: n(inputs, 'weeklyBurn') * 4, shortfall: Math.max(-lowPoint, 0), startingLiquidity })
    }
    case 'draw-evidence': {
      const status = countMissing(inputs, ['budget', 'invoices', 'photos', 'permits', 'statutoryDeclaration', 'insurance', 'inspection'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, uploadManifest: status.missing.length ? `Add: ${status.missing.join(', ')}` : 'Evidence pack complete' })
    }
    case 'project-feasibility': return output(constructionProForma(inputs))
    case 'stalled-build': {
      const fundingGap = Math.max(n(inputs, 'remainingWork') + n(inputs, 'liens') + n(inputs, 'arrears') - n(inputs, 'availableFunds'), 0)
      const issueCount = [n(inputs, 'liens') > 0, n(inputs, 'arrears') > 0, !b(inputs, 'permitReady'), fundingGap > 0].filter(Boolean).length
      return output({ fundingGap, issueCount, priority: !b(inputs, 'permitReady') ? 'Resolve permit status' : n(inputs, 'liens') > 0 ? 'Obtain legal lien advice' : fundingGap > 0 ? 'Reconcile cost-to-complete funding' : 'Rebuild completion schedule', remainingStage: 1 - clamp(n(inputs, 'completionRate'), 0, 1) })
    }
    default: return null
  }
}

