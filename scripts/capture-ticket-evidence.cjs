const { mkdir } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('@playwright/test')

// Use the same hostname that Next's dev server advertises. Accessing these servers
// through 127.0.0.1 causes Next to block the development resources as cross-origin,
// leaving the page server-rendered but unhydrated and invalidating interaction proof.
const beforeBaseUrl = process.env.ISSUE_EVIDENCE_BEFORE_URL || 'http://localhost:4125'
const afterBaseUrl = process.env.ISSUE_EVIDENCE_AFTER_URL || 'http://localhost:4126'
const outputDirectory = path.resolve(
  process.cwd(),
  process.env.ISSUE_EVIDENCE_OUTPUT || 'docs/issue-evidence/tickets',
)

const desktopViewport = { height: 1000, width: 1440 }
const mobileViewport = { height: 844, width: 390 }
const stableStyles = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
  [aria-label='Cookie preferences'] { display: none !important; }
`

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
}

async function open(page, baseUrl, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
  await settle(page)
}

async function click(page, role, name) {
  const locator = page.getByRole(role, { name })
  await locator.waitFor({ state: 'visible' })
  await locator.click()
  await page.waitForTimeout(100)
}

async function fill(page, selector, value) {
  const locator = page.locator(selector)
  await locator.waitFor({ state: 'visible' })
  await locator.fill(value)
}

async function setBuilderProgress(page, progress) {
  const section = page.locator('[data-builder-consulting]')
  await section.waitFor({ state: 'attached' })
  const top = await section.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  )
  await page.evaluate(
    ({ sectionTop, targetProgress }) => {
      window.scrollTo(0, sectionTop + targetProgress * window.innerHeight * 3.1)
    },
    { sectionTop: top, targetProgress: progress },
  )
  await page.waitForTimeout(1300)
}

async function prepareMortgageToProperty(page) {
  await click(page, 'button', /Close a property quickly/)
  const name = page.locator('#mortgage-early-name')
  if (await name.count()) {
    await name.fill('Evidence Borrower')
    await page.locator('#mortgage-early-email').fill('evidence@example.com')
  }
  await click(page, 'button', /continue to property/i)
}

async function prepareMortgageToFinancing(page) {
  await prepareMortgageToProperty(page)
  await click(page, 'button', /Primary residence/)
  await click(page, 'button', /Under \$750K/)
  await click(page, 'button', /continue to mortgage amount/i)
}

async function prepareMortgageToTiming(page) {
  await prepareMortgageToFinancing(page)
  await page
    .getByRole('group', { name: /How much financing do you need/i })
    .getByRole('button', { name: '$250K-$500K', exact: true })
    .click()
  await page
    .getByRole('group', { name: /Current mortgage balance/i })
    .getByRole('button', { name: 'Under $250K', exact: true })
    .click()
  const debt = page.getByRole('group', { name: /Additional (debt|liens)/i })
  if (await debt.count()) {
    const noDebt = debt.getByRole('button', { name: /No additional (debt|liens)/i })
    if (await noDebt.count()) await noDebt.click()
  }
  await click(page, 'button', /continue to timing/i)
}

async function prepareMortgagePastTiming(page) {
  await prepareMortgageToTiming(page)
  await click(page, 'button', /Closing in 2 weeks/)
  await click(page, 'button', /continue to (contact|repayment)/i)
}

async function prepareRentalToProperty(page, refinance = false) {
  if (refinance) {
    const refinanceButton = page.getByRole('button', { name: 'Refinance', exact: true })
    if ((await refinanceButton.count()) && (await refinanceButton.getAttribute('aria-pressed')) !== 'true') {
      await refinanceButton.click()
    }
    await click(page, 'button', /corporation or partnership is on title/i)
    await click(page, 'button', /Partnership \/ joint venture/i)
  } else {
    const acquisition = page.getByRole('button', { name: /Acquisition \/ purchase/i })
    if ((await acquisition.count()) && (await acquisition.getAttribute('aria-pressed')) !== 'true') {
      await acquisition.click()
    }
    await click(page, 'button', /Conditional offer \/ due diligence/i)
    await click(page, 'button', /^Corporation$/i)
  }
  await click(page, 'button', /continue to property/i)
}

async function prepareRentalToFinancing(page, refinance = false, propertyType) {
  await prepareRentalToProperty(page, refinance)
  const address = page.locator('#rental-property-address')
  if (await address.count()) await address.fill('125 Evidence Street, Hamilton, ON')
  await click(page, 'button', propertyType || /5\+ unit apartment/i)
  const units = page.locator('#rental-number-of-units')
  if (await units.count()) await units.fill('8')
  await click(page, 'button', refinance ? /Partially occupied/i : /Fully occupied/i)
  await click(page, 'button', /continue to financing/i)
}

function bySelector(selector, fallbackSelector) {
  return async (page) => {
    const target = page.locator(selector).first()
    if ((await target.count()) && (await target.isVisible())) return target
    if (!fallbackSelector) throw new Error(`Missing selector: ${selector}`)
    return page.locator(fallbackSelector).first()
  }
}

function byText(pattern, parentDepth = 0, fallbackSelector) {
  return async (page) => {
    let target = page.getByText(pattern).first()
    if (!(await target.count())) {
      if (!fallbackSelector) throw new Error(`Missing text: ${pattern}`)
      return page.locator(fallbackSelector).first()
    }
    for (let depth = 0; depth < parentDepth; depth += 1) target = target.locator('xpath=..')
    return target
  }
}

  const mortgageRoute = '/construction-financing?intent=mortgage&source=issue-evidence'
const rentalAcquisitionRoute =
    '/construction-financing?intent=mortgage&source=landing-overview-acquisition-existing-rental-properties'
const rentalRefinanceRoute =
    '/construction-financing?intent=mortgage&source=landing-overview-refinancing-existing-rental-properties'
const builderRoute =
  '/start/builder?intent=build&projectScope=multiplex-financing&source=issue-evidence'

const scenarios = [
  { id: 'FL-WEB-001', route: '/', target: bySelector('aside[aria-label="FairLend proof points"]', '[data-testid="fairlend-toronto-hero"]') },
  { id: 'FL-WEB-002', route: '/', target: bySelector('[data-fairlend-route-card="construction-financing"]', '[data-fairlend-route-selector]') },
  { id: 'FL-WEB-003', route: '/', target: byText(/FairLend is an FSRA-licensed mortgage brokerage/i, 1, '[data-testid="fairlend-landing-overview-section"]') },
  { id: 'FL-WEB-004', route: '/', target: bySelector('[data-finance-group="Core-lending"]', '[data-testid="fairlend-landing-overview-section"]') },
  { id: 'FL-WEB-005', route: '/', target: byText(/Save up to 50% interest with DrawFlow/i, 2, '[data-finance-group="Project-and-rental-programs"]') },
  { id: 'FL-WEB-006', route: '/', target: bySelector('.bm-audience-row--builders', '.bm-scroll-intro') },
  { id: 'FL-WEB-007', route: '/', target: bySelector('.bm-audience-row--first-time', '.bm-scroll-intro') },
  { id: 'FL-WEB-008', route: '/', target: bySelector('.bm-df-more', '.bm-drawflow') },
  { id: 'FL-WEB-009', route: '/', target: bySelector('.bm-milestones', '.bm-drawflow') },
  { id: 'FL-WEB-010', route: '/', target: bySelector('.bm-df-compare', '.bm-drawflow') },
  { id: 'FL-WEB-011', route: '/', target: bySelector('[data-bm-step="plan"] .bm-station-comparison', '[data-bm-step="plan"]') },
  { id: 'FL-WEB-012', route: '/', target: bySelector('[data-bm-step="plan"]', '.bm-scroll-copy') },
  { id: 'FL-WEB-013', route: '/', target: bySelector('[data-bm-step="plan"] .bm-station-note', '[data-bm-step="plan"]') },
  { id: 'FL-WEB-014', route: '/', target: bySelector('[data-bm-step="support"] .bm-station-comparison', '[data-bm-step="support"]') },
  { id: 'FL-WEB-015', route: '/', target: bySelector('.bm-df-flex .bm-tile:nth-child(2)', '.bm-drawflow') },
  { id: 'FL-WEB-016', route: '/', target: bySelector('[data-bm-step="takeout"]', '.bm-scroll-copy') },
  { id: 'FL-WEB-017', route: '/', target: bySelector('[data-bm-step="contingency"]', '.bm-scroll-copy') },
  { id: 'FL-WEB-018', route: '/', target: bySelector('[data-bm-step="takeout"] .bm-station-comparison', '[data-bm-step="takeout"]') },
  { id: 'FL-WEB-019', route: '/', prepare: (page) => setBuilderProgress(page, 0.75), target: bySelector('.builder-footnote', '[data-builder-dashboard]') },
  { id: 'FL-WEB-020', route: '/', prepare: (page) => setBuilderProgress(page, 0.82), target: bySelector('[data-builder-emerging-row="garden-suite"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-021', route: '/', prepare: (page) => setBuilderProgress(page, 0.75), target: bySelector('[data-builder-dashboard]', '[data-builder-consulting]') },
  { id: 'FL-WEB-022', route: '/', prepare: (page) => setBuilderProgress(page, 0.82), target: bySelector('.builder-footnote', '[data-builder-dashboard]') },
  { id: 'FL-WEB-023', route: '/', prepare: (page) => setBuilderProgress(page, 0.43), target: bySelector('.builder-dashboard__title', '[data-builder-dashboard]') },
  { id: 'FL-WEB-024', route: '/', prepare: (page) => setBuilderProgress(page, 0.08), target: bySelector('[data-builder-copy-year="2019"]', '[data-builder-consulting]') },
  { id: 'FL-WEB-025', route: '/', prepare: (page) => setBuilderProgress(page, 0.08), target: bySelector('[data-builder-equation-line="single-family"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-026', route: '/', prepare: (page) => setBuilderProgress(page, 0.08), target: bySelector('[data-builder-equation-line="single-family"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-027', route: '/', prepare: (page) => setBuilderProgress(page, 0.08), target: bySelector('[data-builder-copy-year="2019"]', '[data-builder-consulting]') },
  { id: 'FL-WEB-028', route: '/', prepare: (page) => setBuilderProgress(page, 0.43), target: bySelector('[data-builder-copy-year="2023"]', '[data-builder-consulting]') },
  { id: 'FL-WEB-029', route: '/', prepare: (page) => setBuilderProgress(page, 0.08), target: bySelector('[data-builder-equation-line="single-family"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-030', route: '/', prepare: (page) => setBuilderProgress(page, 0.82), target: bySelector('[data-builder-emerging-row="multiplex"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-031', route: '/', prepare: (page) => setBuilderProgress(page, 0.82), target: bySelector('[data-builder-emerging-row="garden-suite"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-032', route: '/', prepare: (page) => setBuilderProgress(page, 0.82), target: bySelector('[data-builder-emerging-row="garden-suite"]', '[data-builder-dashboard]') },
  { id: 'FL-WEB-033', route: '/', target: bySelector('[data-testid="fairlend-leadership-section"]', 'main') },
  { id: 'FL-WEB-034', route: '/', target: byText(/Bogdan Krystek/i, 2, '[data-testid="fairlend-team-section"]') },
  { id: 'FL-WEB-035', route: '/borrowers/private-mortgage-financing', prepare: (page) => click(page, 'button', /What fees should I expect/i), target: bySelector('.pm-questions', 'main') },
  { id: 'FL-WEB-036', route: '/investing/private-mortgage-lending', prepare: (page) => click(page, 'button', /What protects my capital/i), target: bySelector('[data-investor-faq]', 'main') },
  { id: 'FL-WEB-037', route: mortgageRoute, target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-038', route: '/', target: bySelector('[data-fairlend-route-selector]', 'main') },
  { id: 'FL-WEB-039', route: mortgageRoute, prepare: prepareMortgageToFinancing, target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-040', route: mortgageRoute, prepare: prepareMortgagePastTiming, target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-041', route: '/start/builder', viewport: mobileViewport, target: bySelector('.bp-canvas', '.bp-page') },
  { id: 'FL-WEB-042', route: builderRoute, target: bySelector('.bp-address-autocomplete', '.bp-canvas-form') },
  { id: 'FL-WEB-043', route: builderRoute, target: bySelector('.bp-project-scope-fieldset', '.bp-canvas-form') },
  { id: 'FL-WEB-044', route: rentalAcquisitionRoute, prepare: async (page) => { await prepareRentalToProperty(page, false); await click(page, 'button', /5\+ unit apartment/i) }, target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-045', route: rentalAcquisitionRoute, prepare: (page) => prepareRentalToFinancing(page, false), target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-046', route: rentalRefinanceRoute, prepare: (page) => prepareRentalToFinancing(page, true, /Mixed-use with residential units/i), target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-047', route: '/', target: bySelector('.bm-drawflow', '[data-testid="fairlend-build-model-section"]') },
  { id: 'FL-WEB-048', route: '/', target: byText(/Joel Brenner/i, 2, '[data-testid="fairlend-team-section"]') },
  { id: 'FL-WEB-049', javaScriptEnabled: false, route: builderRoute, target: bySelector('.bp-canvas-form', '.bp-page') },
  { id: 'FL-WEB-050', route: mortgageRoute, prepare: async (page) => { const name = page.locator('#mortgage-early-name'); if (await name.count()) { await name.fill('Evidence Borrower'); await page.locator('#mortgage-early-email').fill('evidence@example.com') } }, target: bySelector('.fl-mortgage-wizard-panel', '.fl-mortgage-wizard-stage') },
  { id: 'FL-WEB-051', route: '/', target: bySelector('[data-fairlend-route-selector]', 'main') },
  { id: 'FL-WEB-052', route: '/', target: bySelector('[data-finance-group="Core-lending"]', '[data-overview-finance-panel]') },
  { id: 'FL-WEB-053', route: '/', target: bySelector('[data-overview-finance-panel]', '[data-testid="fairlend-landing-overview-section"]') },
]

async function captureVersion(browser, scenario, version, baseUrl, pageErrors) {
  const context = await browser.newContext({
    colorScheme: 'light',
    javaScriptEnabled: scenario.javaScriptEnabled !== false,
    reducedMotion: 'no-preference',
    viewport: scenario.viewport || desktopViewport,
  })
  const page = await context.newPage()
  page.on('pageerror', (error) => pageErrors.push(`${scenario.id} ${version}: ${error.message}`))
  await open(page, baseUrl, scenario.route)
  if (scenario.javaScriptEnabled === false) {
    // The App Router wraps the server-rendered intake in a hidden Suspense boundary
    // until hydration. Reveal that boundary only; the pre-change MetalFX action
    // remains hidden by its own inline opacity/visibility state and reproduces the
    // progressive-enhancement regression reported in the review.
    await page.evaluate(() => {
      const intake = document.querySelector('.bp-page')
      intake?.parentElement?.style.setProperty('display', 'block', 'important')
    })
  }
  if (scenario.prepare) await scenario.prepare(page, version)
  if (scenario.javaScriptEnabled !== false) await page.addStyleTag({ content: stableStyles })
  await settle(page)
  const target = await scenario.target(page, version)
  await target.waitFor({ state: 'visible' })
  await target.scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  await target.screenshot({
    animations: 'disabled',
    path: path.join(outputDirectory, `${scenario.id}-${version}.png`),
  })
  await context.close()
}

async function main() {
  await mkdir(outputDirectory, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const pageErrors = []

  const only = process.env.ISSUE_EVIDENCE_ONLY
  const startAt = process.env.ISSUE_EVIDENCE_START_AT
  const startIndex = startAt ? scenarios.findIndex(({ id }) => id === startAt) : 0
  if (startIndex < 0) throw new Error(`Unknown ISSUE_EVIDENCE_START_AT value: ${startAt}`)
  const selectedScenarios = only
    ? scenarios.filter(({ id }) => id === only)
    : scenarios.slice(startIndex)
  if (only && selectedScenarios.length === 0) {
    throw new Error(`Unknown ISSUE_EVIDENCE_ONLY value: ${only}`)
  }

  for (const scenario of selectedScenarios) {
    await captureVersion(browser, scenario, 'before', beforeBaseUrl, pageErrors)
    await captureVersion(browser, scenario, 'after', afterBaseUrl, pageErrors)
    console.log(`${scenario.id}: before + after captured`)
  }

  await browser.close()
  if (pageErrors.length) throw new Error(`Page errors during evidence capture:\n${pageErrors.join('\n')}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
