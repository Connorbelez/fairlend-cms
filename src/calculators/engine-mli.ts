import { addMonths, mortgageConstant } from './math'
import { b, countMissing, n, output, s } from './engine-shared'
import type { CalculatorInputs, CalculatorOutput } from './types'

export function calculateMli(model: string, inputs: CalculatorInputs): CalculatorOutput | null {
  switch (model) {
    case 'mli-points': {
      const newConstruction = s(inputs, 'projectType') === 'new'
      const units = n(inputs, 'units')
      const shelter = s(inputs, 'shelterModel')
      const scopeEligible = (shelter === 'retirement' ? units >= 50 : units >= 5) && n(inputs, 'nonResidentialGfa') <= 0.3 && n(inputs, 'nonResidentialValue') <= 0.3
      const affordableShare = units === 0 ? 0 : n(inputs, 'affordableUnits') / units
      const maximumAffordableRent = n(inputs, 'medianRenterIncome') * 0.3 / 12
      const rentQualifies = n(inputs, 'proposedAffordableRent') <= maximumAffordableRent
      const affordabilityThresholds = newConstruction ? [{ share: 0.25, points: 100 }, { share: 0.15, points: 70 }, { share: 0.1, points: 50 }] : [{ share: 0.8, points: 100 }, { share: 0.6, points: 70 }, { share: 0.4, points: 50 }]
      const affordabilityPoints = shelter === 'student' || !rentQualifies ? 0 : affordabilityThresholds.find((threshold) => affordableShare >= threshold.share)?.points ?? 0
      const affordabilityBonus = affordabilityPoints > 0 && b(inputs, 'longCommitment') ? 30 : 0
      let energyPoints = 0
      if (newConstruction) {
        const performance = n(inputs, 'energyPerformance')
        const thresholds = s(inputs, 'energyBaseline') === 'nbc' ? [{ reduction: 0.7, points: 50 }, { reduction: 0.4, points: 35 }, { reduction: 0.2, points: 20 }] : [{ reduction: 0.6, points: 50 }, { reduction: 0.5, points: 35 }, { reduction: 0.25, points: 20 }]
        energyPoints = thresholds.find((threshold) => performance >= threshold.reduction)?.points ?? 0
      } else {
        const supportedReduction = Math.min(n(inputs, 'energyReduction'), n(inputs, 'ghgReduction'))
        energyPoints = supportedReduction >= 0.4 ? 50 : supportedReduction >= 0.25 ? 35 : supportedReduction >= 0.15 ? 20 : 0
      }
      const accessibilityPath = s(inputs, 'accessibilityPath')
      const accessibilityPoints = b(inputs, 'accessibilityBaseline') ? accessibilityPath === 'level2' ? 30 : accessibilityPath === 'level1' ? 20 : 0 : 0
      const points = affordabilityPoints + affordabilityBonus + energyPoints + accessibilityPoints
      const tier = points >= 100 ? '100+' : points >= 70 ? '70–99' : points >= 50 ? '50–69' : 'Below entry'
      const gap = points < 50 ? 50 - points : points < 70 ? 70 - points : points < 100 ? 100 - points : 0
      const warnings: string[] = []
      if (!scopeEligible) warnings.push('One or more basic published scope screens are not met.')
      if (!b(inputs, 'energyDocumented') && energyPoints > 0) warnings.push('Energy points are modeled as planned, not documented.')
      if (!b(inputs, 'accessibilityDocumented') && accessibilityPoints > 0) warnings.push('Accessibility points are modeled as planned, not documented.')
      if (!b(inputs, 'accessibilityBaseline') && accessibilityPath !== 'none') warnings.push('Accessibility pathway points require the published all-unit visitability and common-area baseline.')
      return output({ accessibilityPoints, affordabilityPoints: affordabilityPoints + affordabilityBonus, amortizationYears: points >= 100 ? 50 : points >= 70 ? 45 : points >= 50 ? 40 : null, energyPoints, entryScreen: scopeEligible ? 'Basic scope screen met' : 'Basic scope screen not met', maximumAffordableRent, nextTierGap: gap, points, premiumDiscount: points >= 100 ? 0.3 : points >= 70 ? 0.2 : points >= 50 ? 0.1 : 0, tier, tenure: newConstruction ? 'New construction' : 'Existing property' }, ['Points are a preliminary scenario under the versioned rule set.'], warnings)
    }
    case 'mli-capital-stack': {
      const tier = n(inputs, 'pointsTier')
      const amortization = tier >= 100 ? 50 : tier >= 70 ? 45 : 40
      const annualConstant = mortgageConstant(n(inputs, 'interestRate'), amortization)
      const insuredLoan = Math.max(Math.min(n(inputs, 'projectCost') * 0.95, n(inputs, 'netOperatingIncome') / n(inputs, 'minimumDscr') / annualConstant), 0)
      const premium = insuredLoan * n(inputs, 'premiumRate') * (1 - (tier >= 100 ? 0.3 : tier >= 70 ? 0.2 : 0.1))
      return output({ constructionCarry: n(inputs, 'bridgeDebt') * n(inputs, 'bridgeRate') * n(inputs, 'bridgeMonths') / 12, equityGap: Math.max(n(inputs, 'projectCost') + premium - insuredLoan, 0), insuredLoan, premium, takeoutGap: Math.max(n(inputs, 'bridgeDebt') - insuredLoan, 0) })
    }
    case 'mli-affordability': {
      const level = n(inputs, 'affordabilityLevel')
      const percentages = s(inputs, 'projectType') === 'new' ? { 50: 0.1, 70: 0.15, 100: 0.25 } : { 50: 0.4, 70: 0.6, 100: 0.8 }
      const requiredUnits = Math.ceil(n(inputs, 'totalUnits') * (percentages[level as 50 | 70 | 100] ?? 0))
      const maximumRent = n(inputs, 'medianRenterIncome') * 0.3 / 12
      const qualifying = n(inputs, 'proposedAffordableUnits') >= requiredUnits && n(inputs, 'proposedRent') <= maximumRent
      const annualRevenueDifference = (n(inputs, 'marketRent') - n(inputs, 'proposedRent')) * Math.min(n(inputs, 'proposedAffordableUnits'), n(inputs, 'totalUnits')) * 12
      return output({ annualRevenueDifference, maximumRent, qualifying: qualifying ? 'Modeled threshold met' : 'Threshold not met', requiredUnits })
    }
    case 'mli-maximum-loan': {
      const annualConstant = mortgageConstant(n(inputs, 'interestRate'), n(inputs, 'amortizationYears'))
      const dscrLoan = n(inputs, 'netOperatingIncome') / n(inputs, 'minimumDscr') / annualConstant
      const ltvLoan = n(inputs, 'lendingValue') * n(inputs, 'loanToValue')
      const maximumLoan = Math.max(Math.min(dscrLoan, ltvLoan), 0)
      return output({ annualDebtService: maximumLoan * annualConstant, constraint: dscrLoan < ltvLoan ? 'Debt service coverage' : 'Loan to value', dscrLoan, ltvLoan, maximumLoan })
    }
    case 'upgrade-tradeoff': {
      const currentAmortization = n(inputs, 'currentTier') >= 100 ? 50 : n(inputs, 'currentTier') >= 70 ? 45 : 40
      const targetAmortization = n(inputs, 'targetTier') >= 100 ? 50 : n(inputs, 'targetTier') >= 70 ? 45 : 40
      const currentLoan = n(inputs, 'netOperatingIncome') / n(inputs, 'minimumDscr') / mortgageConstant(n(inputs, 'interestRate'), currentAmortization)
      const targetLoan = n(inputs, 'netOperatingIncome') / n(inputs, 'minimumDscr') / mortgageConstant(n(inputs, 'interestRate'), targetAmortization)
      const incrementalDebtCapacity = Math.max(targetLoan - currentLoan, 0)
      return output({ incrementalDebtCapacity, netCapitalImpact: incrementalDebtCapacity - n(inputs, 'upgradeCost'), targetLoan, upgradeCost: n(inputs, 'upgradeCost') }, ['This isolates amortization sensitivity and does not establish that the upgrade earns points or that the added debt is available.'])
    }
    case 'mli-document-readiness': {
      const status = countMissing(inputs, ['application', 'appraisal', 'environmental', 'affordabilityEvidence', 'energyEvidence', 'accessibilityEvidence', 'borrowerFinancials'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, requiredNext: status.missing.length ? status.missing.join(', ') : 'Core modeled documents recorded' })
    }
    case 'takeout-readiness': {
      const status = countMissing(inputs, ['constructionComplete', 'occupancy', 'leaseUp', 'finalCosts', 'appraisal', 'complianceEvidence', 'insuranceConditions'])
      return output({ completeness: status.completeness, missingCount: status.missing.length, projectedReadyDate: addMonths(s(inputs, 'asOfDate'), status.missing.length * n(inputs, 'monthsPerCondition')), unresolvedConditions: status.missing.length ? status.missing.join(', ') : 'No modeled unresolved conditions' })
    }
    default: return null
  }
}

