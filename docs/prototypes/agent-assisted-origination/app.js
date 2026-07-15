const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

const state = {
  claimed: false,
  completed: false,
  rate: false,
  booked: false,
  submitted: false,
  selectedTime: '',
}

const dialogs = {
  claim: $('#claim-dialog'),
  complete: $('#complete-dialog'),
  rate: $('#rate-dialog'),
  booking: $('#booking-dialog'),
  submit: $('#submit-dialog'),
  privacy: $('#privacy-dialog'),
}

function showDialog(dialog) {
  if (typeof dialog.showModal === 'function') dialog.showModal()
}

function showToast(message) {
  const toast = $('#toast')
  toast.textContent = message
  toast.hidden = false
  window.clearTimeout(showToast.timeout)
  showToast.timeout = window.setTimeout(() => { toast.hidden = true }, 4200)
}

function setStep(active) {
  $$('.journey li').forEach((item, index) => {
    const step = index + 1
    item.classList.toggle('is-complete', step < active)
    item.classList.toggle('is-active', step === active)
  })
}

function appendAgentMessage(html, extraClass = '') {
  const article = document.createElement('article')
  article.className = `message message-agent ${extraClass}`
  article.innerHTML = `<div class="avatar agent-avatar" aria-hidden="true">F</div><div class="bubble">${html}</div>`
  $('#conversation').append(article)
  requestAnimationFrame(() => article.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}

function claimApplication() {
  state.claimed = true
  $('#locked-file').hidden = true
  $('#application-file').hidden = false
  const status = $('#session-status')
  status.classList.add('is-claimed')
  status.innerHTML = '<i></i> Claimed · connor@brickline.ca'
  setStep(3)
  appendAgentMessage(`
    <p class="message-label">ACCOUNT CONNECTED</p>
    <p>Your FairLend account is connected, and I created draft <strong>FL–26–0715</strong>. I saved only the facts shown in your preview.</p>
    <div class="notice"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5m0 3.4v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><p>No credit report was accessed. You still have <strong>3 facts to confirm</strong> before an indicative range can be requested.</p></div>
    <div class="message-actions"><button class="button button-primary inline-complete" type="button">Review missing items <span>→</span></button></div>
  `)
  $('.inline-complete').addEventListener('click', () => showDialog(dialogs.complete))
  showToast('Draft created securely. Agent access is limited to this application.')
}

function completeApplication() {
  state.completed = true
  const ring = $('.completion-ring')
  ring.style.setProperty('--progress', 100)
  ring.setAttribute('aria-label', 'Application 100% complete')
  $('#completion-number').textContent = '100%'
  $('#completion-label').textContent = 'Ready for indicative pricing'
  $('#missing-section').innerHTML = '<h3>Readiness checks</h3><ul><li><span style="background:var(--signal);border-color:var(--signal)"></span>Core facts confirmed</li><li><span style="background:var(--signal);border-color:var(--signal)"></span>Draw prerequisites mapped</li><li><span style="background:var(--signal);border-color:var(--signal)"></span>No credit report requested</li></ul>'
  $('#complete-button').hidden = true
  $('#rate-button').hidden = false
  appendAgentMessage(`
    <p class="message-label">DRAFT UPDATED / VERSION 3</p>
    <p>Your core construction facts are complete. I can now request an <strong>indicative rate range</strong> from today’s FairLend pricing rules.</p>
    <p class="source-note">You’ll see and approve every input first. This is still not a quote, held rate, or pre-approval.</p>
    <div class="message-actions"><button class="button button-primary inline-rate" type="button">Preview pricing request <span>→</span></button></div>
  `)
  $('.inline-rate').addEventListener('click', () => showDialog(dialogs.rate))
  showToast('Three facts confirmed and saved with user provenance.')
}

function showRateResult() {
  state.rate = true
  $('#rate-button').hidden = true
  $('#submit-button').hidden = false
  setStep(4)
  appendAgentMessage(`
    <p class="message-label">INDICATIVE RATE RANGE</p>
    <div class="rate-result">
      <p>Based on your self-attested facts and today’s construction pricing snapshot:</p>
      <div class="rate-band"><strong>8.15%–9.25%</strong><span>annual interest · interest-only during construction</span></div>
      <div class="result-meta"><span>Pricing: Jul 15, 2026 · 2:42 PM ET</span><span>Expires: Jul 17, 2026</span><span>Rules: CON-4.8</span></div>
      <p class="source-note">Potential lender fee: 1.0%–2.0%. Legal, appraisal, inspection, and brokerage fees excluded. Final terms depend on document and professional review.</p>
    </div>
    <div class="notice"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5m0 3.4v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><p><strong>Indicative—not a pre-approval.</strong> No rate is held and no lender has reviewed this file.</p></div>
    <div class="message-actions"><button class="button button-primary inline-book" type="button">Book a file review <span>→</span></button><button class="button button-secondary inline-submit" type="button">Submit draft for review</button></div>
  `, 'rate-message')
  $('.inline-book').addEventListener('click', () => showDialog(dialogs.booking))
  $('.inline-submit').addEventListener('click', () => showDialog(dialogs.submit))
  showToast('Indicative range generated from pricing rules CON-4.8.')
}

function bookConsultation() {
  state.booked = true
  appendAgentMessage(`
    <span class="success-mark" aria-hidden="true">✓</span>
    <p class="message-label">CONSULTATION BOOKED</p>
    <p><strong>${state.selectedTime}</strong> is confirmed with Maya Chen, Construction Finance Specialist.</p>
    <p class="source-note">A calendar invitation was sent to connor@brickline.ca and linked to application FL–26–0715.</p>
  `, 'success-panel')
  showToast('Consultation booked. One calendar event and CRM record were created.')
}

function submitForReview() {
  state.submitted = true
  $('#submit-button').disabled = true
  $('#submit-button').textContent = 'Submitted for review'
  $('#completion-label').textContent = 'Submitted · awaiting human review'
  appendAgentMessage(`
    <span class="success-mark" aria-hidden="true">✓</span>
    <p class="message-label">SUBMITTED FOR FAIRLEND REVIEW</p>
    <p>Your draft is now with a licensed FairLend professional. They’ll check fit, evidence, and next steps—no lender submission has occurred.</p>
    <p class="source-note">Application FL–26–0715 · version 4 · submitted Jul 15, 2026 at 2:48 PM ET</p>
  `, 'success-panel')
  showToast('Application submitted for human review.')
}

$('#save-draft-button').addEventListener('click', () => showDialog(dialogs.claim))
$('#privacy-button').addEventListener('click', () => showDialog(dialogs.privacy))
$('#edit-assumptions-button').addEventListener('click', () => {
  $('#composer-input').value = 'Update the project cost to $650,000 and show me the draw impact.'
  $('#composer-input').focus()
})
$('#complete-button').addEventListener('click', () => showDialog(dialogs.complete))
$('#edit-file-button').addEventListener('click', () => showDialog(dialogs.complete))
$('#rate-button').addEventListener('click', () => showDialog(dialogs.rate))
$('#submit-button').addEventListener('click', () => showDialog(dialogs.submit))
$('#revoke-button').addEventListener('click', () => showToast('Access controls would open on a FairLend-owned account page.'))

$('#claim-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!event.currentTarget.reportValidity()) return
  dialogs.claim.close()
  claimApplication()
})
$('#complete-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!event.currentTarget.reportValidity()) return
  dialogs.complete.close()
  completeApplication()
})
$('#rate-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!event.currentTarget.reportValidity()) return
  dialogs.rate.close()
  showRateResult()
})
$('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!state.selectedTime) return
  dialogs.booking.close()
  bookConsultation()
})
$('#submit-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!event.currentTarget.reportValidity()) return
  dialogs.submit.close()
  submitForReview()
})

$$('.time-grid button').forEach((button) => {
  button.addEventListener('click', () => {
    $$('.time-grid button').forEach((item) => item.setAttribute('aria-checked', 'false'))
    button.setAttribute('aria-checked', 'true')
    const day = button.closest('div').querySelector('strong').textContent
    state.selectedTime = `${day}, July ${day.includes('20') ? '20' : day.includes('21') ? '21' : '22'} at ${button.textContent} ET`
    $('#confirm-booking').disabled = false
    $('#confirm-booking').textContent = `Book ${button.textContent}`
  })
})

$('#composer-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const input = $('#composer-input')
  const value = input.value.trim()
  if (!value) return
  const user = document.createElement('article')
  user.className = 'message message-user'
  user.innerHTML = `<div class="avatar user-avatar" aria-hidden="true">CM</div><div class="bubble"><p></p></div>`
  $('p', user).textContent = value
  $('#conversation').append(user)
  input.value = ''
  appendAgentMessage('<p>I’ve added that as a conversation note. In the live service, I would recalculate through the versioned FairLend calculator before suggesting any change to your draft.</p>')
})

$('#menu-button').addEventListener('click', (event) => {
  event.stopPropagation()
  const menu = $('#session-menu')
  menu.hidden = !menu.hidden
  event.currentTarget.setAttribute('aria-expanded', String(!menu.hidden))
})
document.addEventListener('click', () => { $('#session-menu').hidden = true; $('#menu-button').setAttribute('aria-expanded', 'false') })
$('#restart-button').addEventListener('click', () => window.location.reload())

$$('.modal').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect()
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
    if (outside) dialog.close()
  })
})

$$('.modal-close').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault()
    button.closest('dialog').close()
  })
})
