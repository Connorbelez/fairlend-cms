const { mkdir } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('@playwright/test')

const baseUrl = process.env.ISSUE_EVIDENCE_BASE_URL || 'http://127.0.0.1:4123'
const outputDirectory = path.resolve(
  process.cwd(),
  process.env.ISSUE_EVIDENCE_OUTPUT || 'docs/issue-evidence/after',
)

const stableStyles = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
`

async function settle(page) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.addStyleTag({ content: stableStyles })
      await page.evaluate(() => document.fonts.ready)
      break
    } catch (error) {
      if (attempt === 3 || !String(error).includes('Execution context was destroyed')) throw error
      await page.waitForLoadState('domcontentloaded')
    }
  }
  await page.waitForTimeout(150)
}

async function open(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
  await settle(page)
}

async function captureLocator(page, selector, fileName) {
  const locator = page.locator(selector).first()
  await locator.waitFor({ state: 'visible' })
  await locator.screenshot({ path: path.join(outputDirectory, fileName) })
}

async function captureViewportAt(page, selector, fileName) {
  const locator = page.locator(selector).first()
  await locator.waitFor({ state: 'visible' })
  await locator.evaluate((element) => element.scrollIntoView({ block: 'start' }))
  await page.waitForTimeout(100)
  await page.screenshot({ path: path.join(outputDirectory, fileName) })
}

async function main() {
  await mkdir(outputDirectory, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const desktop = await browser.newPage({
    reducedMotion: 'reduce',
    viewport: { height: 1000, width: 1440 },
  })
  const pageErrors = []
  desktop.on('pageerror', (error) => pageErrors.push(error.message))

  await open(desktop, '/')
  await captureLocator(desktop, '[data-testid="fairlend-toronto-hero"]', 'home-hero.png')
  await captureLocator(desktop, '[data-fairlend-route-selector]', 'home-services.png')
  await captureLocator(
    desktop,
    '[data-testid="fairlend-landing-overview-section"]',
    'home-overview.png',
  )
  await captureViewportAt(
    desktop,
    '[data-testid="fairlend-build-model-section"]',
    'build-model-top.png',
  )
  await captureLocator(desktop, '.bm-drawflow', 'build-model-drawflow.png')
  await captureLocator(desktop, '.bm-thesis', 'build-model-thesis.png')
  await captureLocator(desktop, '[data-builder-consulting]', 'builder-consulting.png')
  await captureLocator(
    desktop,
    '[data-testid="fairlend-leadership-section"]',
    'leadership.png',
  )
  await captureLocator(desktop, '[data-testid="fairlend-team-section"]', 'team.png')
  await captureViewportAt(desktop, '[data-testid="fairlend-faq-section"]', 'home-faq.png')

  await open(desktop, '/borrowers/private-mortgage-financing')
  await captureLocator(desktop, '.fl-mortgage-wizard-stage', 'borrower-wizard.png')
  await desktop.getByRole('button', { name: 'What fees should I expect?' }).click()
  await captureLocator(desktop, '.pm-questions', 'borrower-faq.png')

  await open(desktop, '/investing/private-mortgage-lending')
  await desktop.getByRole('button', { name: 'What protects my capital?' }).click()
  await captureLocator(desktop, '[data-investor-faq]', 'investor-faq.png')

  await open(
    desktop,
    '/start/builder?intent=build&projectScope=multiplex-financing&source=issue-evidence',
  )
  await captureLocator(desktop, '.bp-canvas-form', 'intake-desktop.png')

  const mobile = await browser.newPage({
    reducedMotion: 'reduce',
    viewport: { height: 736, width: 390 },
  })
  mobile.on('pageerror', (error) => pageErrors.push(error.message))
  await open(mobile, '/start/builder')
  await mobile.screenshot({ path: path.join(outputDirectory, 'intake-mobile.png') })

  await browser.close()

  if (pageErrors.length > 0) {
    throw new Error(`Page errors during evidence capture:\n${pageErrors.join('\n')}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
