(function () {
  'use strict'
  const core = window.DrawflowPrototype
  const $ = (selector, parent = document) => parent.querySelector(selector)
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector))
  let currentStep = 1
  let result = null

  function values() {
    return {
      budget: Number($('#budget').value),
      capital: Number($('#capital').value),
      rate: Number($('#rate').value),
      fee: Number($('#fee').value),
      lag: Number($('#lag').value),
      reserve: Number($('#reserve').value),
      startDate: $('#startDate').value,
      completionDate: $('#completionDate').value,
    }
  }

  function showToast(message) {
    const toast = $('#toast')
    toast.textContent = message
    toast.hidden = false
    clearTimeout(showToast.timeout)
    showToast.timeout = setTimeout(() => { toast.hidden = true }, 3200)
  }

  function clearErrors() {
    $$('.field.error').forEach((field) => field.classList.remove('error'))
    $$('.field-error').forEach((error) => error.remove())
  }

  function showErrors(errors) {
    clearErrors()
    Object.entries(errors).forEach(([id, message]) => {
      const input = $('#' + id)
      if (!input) return
      const field = input.closest('.field')
      field.classList.add('error')
      const error = document.createElement('small')
      error.className = 'field-error'
      error.textContent = message
      field.appendChild(error)
    })
    const first = $('.field.error input')
    if (first) first.focus()
  }

  function setStep(step, pushFocus = true) {
    currentStep = step
    $$('.step-panel').forEach((panel) => panel.classList.toggle('active', Number(panel.dataset.step) === step))
    $$('[data-step-indicator]').forEach((indicator) => {
      const n = Number(indicator.dataset.stepIndicator)
      indicator.classList.toggle('active', n === step)
      indicator.classList.toggle('complete', n < step)
    })
    if (step === 3) renderResult()
    if (pushFocus) {
      const target = $(`[data-step="${step}"] h2`)
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }) }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function syncRail() {
    const input = values()
    $('#railBudget').textContent = core.money(input.budget)
    $('#railCapital').textContent = core.money(input.capital)
    $('#railRate').textContent = `${input.rate || 0}%`
    $('#railFee').textContent = core.money(input.fee)
  }

  function renderResult() {
    const input = values()
    result = core.calculate(input)
    const set = (id, value) => { const node = $('#' + id); if (node) node.textContent = value }
    set('baseInterest', core.money(result.baseInterest))
    set('drawInterest', core.money(result.drawInterest))
    set('tableBaseInterest', core.money(result.baseInterest))
    set('tableDrawInterest', core.money(result.drawInterest))
    set('interestDelta', `${core.money(Math.abs(result.baseInterest - result.drawInterest))} ${result.baseInterest >= result.drawInterest ? 'less' : 'more'}`)
    set('baseFees', core.money(result.baseFees)); set('drawFees', core.money(result.drawFees))
    set('feeDelta', `${core.money(Math.abs(result.drawFees - result.baseFees))} ${result.drawFees >= result.baseFees ? 'more' : 'less'}`)
    set('baseCost', core.money(result.baseCost)); set('drawCost', core.money(result.drawCost))
    set('basePeakCash', core.money(result.basePeak)); set('drawPeakCash', core.money(result.drawPeak))
    const positive = result.difference >= 0
    set('differenceValue', core.money(Math.abs(result.difference)))
    set('differencePercent', result.percent == null ? 'Percentage unavailable' : `${Math.abs(result.percent).toFixed(1)}% ${positive ? 'lower' : 'higher'}`)
    set('costDelta', `${core.money(Math.abs(result.difference))} ${positive ? 'lower' : 'higher'}`)
    const banner = $('#outcomeBanner')
    banner.classList.toggle('unfavorable', !positive)
    const conventionalInfeasible = !result.baseFeasible
    if (conventionalInfeasible && result.drawFeasible) {
      set('outcomeExplanation', `The conventional schedule also requires ${core.money(result.baseShortfall)} in additional available cash to reach its next draw threshold. DrawFlow remains feasible.`)
    } else if (!result.drawFeasible) {
      set('outcomeExplanation', `Both schedules exceed available working capital. Add at least ${core.money(result.drawShortfall)} or revise project timing before relying on the comparison.`)
    } else {
      set('outcomeExplanation', positive ? 'Milestone-timed releases reduce interest exposure enough to offset three additional draw fees.' : 'The additional draw fees exceed the modeled interest difference for this scenario.')
    }
    const warning = $('#cashWarning')
    warning.innerHTML = result.baseShortfall > 0 ? `<b>${core.money(result.baseShortfall)} additional cash required</b> to reach the next draw threshold.` : '<b>Schedule is feasible</b> with the supplied working capital and reserve.'
    renderStress()
  }

  function renderStress() {
    if (!result) return
    const rate = Number($('#stressRate').value)
    const stress = core.calculate({ ...values(), rate })
    $('#stressRateLabel').textContent = `${rate.toFixed(2)}%`
    $('#stressDifference').textContent = core.money(Math.abs(stress.difference))
  }

  $$('[data-go-step]').forEach((button) => button.addEventListener('click', () => {
    const step = Number(button.dataset.goStep)
    if (step > currentStep && step === 2) {
      const errors = core.validateInputs(values())
      if (Object.keys(errors).length) { showErrors(errors); return }
    }
    setStep(step)
  }))

  $$('[data-next-step]').forEach((button) => button.addEventListener('click', () => {
    const errors = core.validateInputs(values())
    if (Object.keys(errors).length) { showErrors(errors); return }
    clearErrors(); setStep(Number(button.dataset.nextStep))
  }))

  $('#comparisonForm').addEventListener('submit', (event) => {
    event.preventDefault()
    if (!$('#confirmSchedule').checked) { showToast('Review and confirm the generated schedule first.'); $('#confirmSchedule').focus(); return }
    const loading = $('#resultLoading')
    const content = $('#resultContent')
    setStep(3, false); loading.hidden = false; content.hidden = true
    setTimeout(() => { loading.hidden = true; content.hidden = false; renderResult(); $('h2', content).tabIndex = -1; $('h2', content).focus() }, 650)
  })

  $$('.project-option input').forEach((input) => input.addEventListener('change', () => {
    $$('.project-option').forEach((option) => option.classList.toggle('selected', $('input', option).checked))
  }))

  $$('input, select', $('#comparisonForm')).forEach((input) => input.addEventListener('input', () => {
    syncRail()
    if (input.closest('.field')) input.closest('.field').classList.remove('error')
  }))

  $$('.advanced-toggle, .assumptions-toggle').forEach((button) => button.addEventListener('click', () => {
    const content = $('#' + button.getAttribute('aria-controls'))
    const open = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!open)); content.hidden = open
    button.lastElementChild.textContent = open ? '＋' : '−'
  }))

  $$('[data-result-tab]').forEach((tab) => tab.addEventListener('click', () => {
    $$('[data-result-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)))
    $$('[data-result-view]').forEach((view) => view.classList.toggle('active', view.dataset.resultView === tab.dataset.resultTab))
  }))

  $$('[data-show-accessible-table]').forEach((button) => button.addEventListener('click', () => {
    const table = $('#' + button.dataset.showAccessibleTable)
    table.hidden = !table.hidden; button.textContent = table.hidden ? 'View accessible data table' : 'Hide accessible data table'
  }))

  $('#stressRate').addEventListener('input', renderStress)
  $('#helpButton').addEventListener('click', () => $('#infoDialog').showModal())
  $('#policyButton').addEventListener('click', () => $('#infoDialog').showModal())
  $$('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => $('#infoDialog').close()))
  $('#saveButton').addEventListener('click', () => showToast('Prototype: result saved to this browser.'))
  $('#shareButton').addEventListener('click', () => showToast('Secure share link copied. No contact details included.'))
  $$('.download-button').forEach((button) => button.addEventListener('click', () => showToast('Prototype: release schedule CSV prepared.')))
  syncRail()
  setStep(1, false)
})()
