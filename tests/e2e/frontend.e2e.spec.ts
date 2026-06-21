import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Fairlend/)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText(/Multiplex,\s*Single Family,\s*Land\s*Financing/)
    await expect(page.getByRole('link', { name: /Get in touch/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Start your application/i })).toBeVisible()
  })

  test('shows the mobile overlay header without pushing the hero down', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const header = page.locator('main > section header')
    await expect(header).toBeVisible()
    await expect(page.getByRole('button', { name: /Open menu/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Multiplex,/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Start your application/i })).toBeVisible()

    await expect
      .poll(() => header.evaluate((element) => getComputedStyle(element).position))
      .toBe('absolute')
  })
})
