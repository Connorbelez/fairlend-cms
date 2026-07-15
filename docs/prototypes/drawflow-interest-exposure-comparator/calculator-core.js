(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  root.DrawflowPrototype = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const CAD = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  })

  function money(value) {
    return CAD.format(Math.round(Number(value) || 0)).replace('CA', '')
  }

  function validateInputs(input) {
    const errors = {}
    if (!Number.isFinite(input.budget) || input.budget < 100000) errors.budget = 'Enter a budget of at least $100,000.'
    if (!Number.isFinite(input.capital) || input.capital < 0) errors.capital = 'Working capital cannot be negative.'
    if (!Number.isFinite(input.rate) || input.rate <= 0 || input.rate > 30) errors.rate = 'Enter an annual rate between 0% and 30%.'
    if (!Number.isFinite(input.fee) || input.fee < 0) errors.fee = 'Draw fee cannot be negative.'
    if (!input.startDate || !input.completionDate || new Date(input.completionDate) <= new Date(input.startDate)) errors.completionDate = 'Completion must be after the construction start.'
    return errors
  }

  function calculate(input) {
    const budgetFactor = input.budget / 1250000
    const rateFactor = input.rate / 9.25
    const durationDays = Math.max(1, Math.round((new Date(input.completionDate) - new Date(input.startDate)) / 86400000))
    const durationFactor = durationDays / 228
    const baseInterest = 51780 * budgetFactor * rateFactor * durationFactor
    const drawInterest = 37440 * budgetFactor * rateFactor * durationFactor
    const baseFees = input.fee * 3
    const drawFees = input.fee * 6
    const baseCost = baseInterest + baseFees
    const drawCost = drawInterest + drawFees
    const difference = baseCost - drawCost
    const percent = baseCost > 0 ? (difference / baseCost) * 100 : null
    const basePeak = input.budget * 0.3368
    const drawPeak = input.budget * 0.1952
    const reserve = Number.isFinite(input.reserve) ? input.reserve : 25000
    const available = Math.max(0, input.capital - reserve)
    return {
      baseInterest,
      drawInterest,
      baseFees,
      drawFees,
      baseCost,
      drawCost,
      difference,
      percent,
      basePeak,
      drawPeak,
      baseShortfall: Math.max(0, basePeak - available),
      drawShortfall: Math.max(0, drawPeak - available),
      baseFeasible: available >= basePeak,
      drawFeasible: available >= drawPeak,
      durationDays,
    }
  }

  return { money, validateInputs, calculate }
})
