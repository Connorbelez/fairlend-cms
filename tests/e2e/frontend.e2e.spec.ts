import { expect, test } from '@playwright/test'

const fairlendLandingPath = '/fairlend-landing-hero'

type Viewport = {
  height: number
  width: number
}

function assertBoxWithinViewport(
  box: { height: number; width: number; x: number; y: number } | null,
  viewport: Viewport,
  label: string,
  tolerance = 1,
) {
  expect(box, `${label} rect at ${viewport.width}px`).not.toBeNull()
  expect(box!.x, `${label} left at ${viewport.width}px`).toBeGreaterThanOrEqual(-tolerance)
  expect(box!.y, `${label} top at ${viewport.width}px`).toBeGreaterThanOrEqual(-tolerance)
  expect(box!.x + box!.width, `${label} right at ${viewport.width}px`).toBeLessThanOrEqual(
    viewport.width + tolerance,
  )
  expect(box!.y + box!.height, `${label} bottom at ${viewport.width}px`).toBeLessThanOrEqual(
    viewport.height + tolerance,
  )
}

test.describe('Frontend', () => {
  test('can load homepage with the original lending hero', async ({ page }) => {
    await page.setViewportSize({ width: 1672, height: 941 })
    await page.goto(fairlendLandingPath)
    await expect(page).toHaveTitle(/Fairlend/)
    const processBar = page.getByTestId('hero-process-bar')
    const judgmentSection = page.getByTestId('judgment-section')
    const testimonials = page.getByTestId('testimonials-marquee-section')

    await expect(page.locator('h1').first()).toContainText(
      /multi-plex,?\s*single family,?\s*land/i,
    )
    await expect(page.getByRole('link', { name: /Get in touch/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Start your application/i })).toBeVisible()
    await expect(processBar).toBeVisible()
    await expect(processBar.getByRole('heading', { name: 'Permit' })).toBeVisible()
    await expect(processBar.getByRole('heading', { name: 'Acquisition' })).toBeVisible()
    await expect(processBar.getByRole('heading', { name: 'Construction' })).toBeVisible()
    await expect(processBar.getByRole('heading', { name: 'Completion' })).toBeVisible()
    await expect(page.getByTestId('hero-process-segment')).toHaveCount(4)
    await expect(page.getByTestId('hero-route-marker')).toHaveCount(4)
    await expect(judgmentSection).toBeVisible()
    await expect(testimonials).toBeVisible()
    await expect(
      testimonials.getByRole('heading', {
        name: /Trusted across builds, investments, and brokered files/i,
      }),
    ).toBeVisible()
    await expect(
      testimonials.getByTestId('testimonials-desktop-grid').getByText('Toronto Infill Builder'),
    ).toBeVisible()
    await expect(page.getByLabel('FairLend licence information').first()).toContainText(
      'Fairlend Management Inc. operating as FairLend Mortgage',
    )
    await expect(page.getByLabel('FairLend licence information').first()).toContainText(
      /FSRA brokerage licence\s*#13827/,
    )
    await expect(page.getByLabel('FairLend licence information').first()).toContainText(
      /FSRA administrator licence\s*#13828/,
    )
    await expect(page.getByRole('contentinfo')).toContainText('FairLend Mortgage')
    await expect(page.getByRole('contentinfo')).toContainText(/FSRA brokerage licence\s*#13827/)
    await expect(page.getByRole('contentinfo')).toContainText(
      /FSRA administrator licence\s*#13828/,
    )
    await expect
      .poll(() =>
        page.evaluate(() => {
          const hero = document.querySelector('main')
          const judgmentSection = document.querySelector('[data-testid="judgment-section"]')
          const testimonialsSection = document.querySelector(
            '[data-testid="testimonials-marquee-section"]',
          )
          const testimonialsRoot = hero?.nextElementSibling

          return (
            Boolean(testimonialsRoot?.contains(testimonialsSection)) &&
            testimonialsRoot?.nextElementSibling === judgmentSection
          )
        }),
      )
      .toBe(true)
    await expect
      .poll(() => processBar.evaluate((element) => getComputedStyle(element).display))
      .toBe('block')
    await expect
      .poll(() =>
        page.evaluate(() => {
          return [...document.querySelectorAll('[data-testid="hero-process-bar"] > [data-process-step]')]
            .map((stepRoot) => {
              const leader = stepRoot.children.item(0)
              const marker = stepRoot.querySelector('[data-testid="hero-route-marker"]')
              const card = stepRoot.querySelector('[data-testid="hero-process-segment"]')

              if (!(leader instanceof HTMLElement) || !marker || !card) {
                return false
              }

              const leaderRect = leader.getBoundingClientRect()
              const markerRect = marker.getBoundingClientRect()
              const cardRect = card.getBoundingClientRect()
              const markerCenterX = markerRect.left + markerRect.width / 2
              const cardCenterX = cardRect.left + cardRect.width / 2

              return (
                leaderRect.height > 40 &&
                Math.abs(cardCenterX - markerCenterX) < 1 &&
                Math.abs(leaderRect.top - cardRect.bottom) < 1
              )
            })
            .every(Boolean)
        }),
      )
      .toBe(true)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(1672)
    await expect
      .poll(() =>
        page
          .locator('main > section picture img')
          .evaluate((image) => (image as HTMLImageElement).currentSrc),
      )
      .toContain('fairlend-hero-jun-26-2026.webp')
  })

  test('keeps the desktop hero layout bounded from 1280px up', async ({ page }) => {
    test.slow()

    const viewports = [
      { height: 1101, width: 1566 },
      { height: 1101, width: 1454 },
      { height: 1101, width: 1331 },
      { height: 900, width: 1280 },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })

      await expect(page.getByTestId('hero-process-bar')).toBeVisible()
      await expect(page.getByTestId('hero-mobile-process-bar')).toBeHidden()
      await expect(page.getByTestId('fairlend-application-form')).toBeVisible()
      await expect(page.getByTestId('hero-desktop-stats-strip')).toBeVisible()
      await expect
        .poll(() =>
          page
            .locator('main > section picture img')
            .evaluate((image) => (image as HTMLImageElement).currentSrc),
        )
        .toContain('fairlend-hero-jun-26-2026.webp')

      const title = await page.locator('#fairlend-hero-title').boundingBox()
      const subtitle = await page.getByText('We guide you from permit').boundingBox()
      const applicationForm = await page.getByTestId('fairlend-application-form').boundingBox()
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)

      expect(scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        viewport.width,
      )
      assertBoxWithinViewport(title, viewport, 'desktop title')
      assertBoxWithinViewport(subtitle, viewport, 'desktop subtitle')
      assertBoxWithinViewport(applicationForm, viewport, 'desktop application form')

      const copyRightEdge = Math.max(title!.x + title!.width, subtitle!.x + subtitle!.width)
      expect(
        applicationForm!.x - copyRightEdge,
        `desktop copy/form gap at ${viewport.width}px`,
      ).toBeGreaterThanOrEqual(18)
    }
  })

  test('uses the compact hero treatment below 1024px', async ({ page }) => {
    test.slow()

    const viewports = [
      { height: 1100, width: 687 },
      { height: 1100, width: 870 },
      { height: 1100, width: 993 },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })

      await expect(page.getByTestId('hero-mobile-process-bar')).toBeVisible()
      await expect(page.getByTestId('hero-process-bar')).toBeHidden()
      await expect(page.getByTestId('hero-compact-panel')).toBeVisible()
      await expect(page.getByTestId('fairlend-application-form')).toBeVisible()
      await expect(page.getByTestId('hero-compact-stats-strip')).toBeVisible()
      await expect
        .poll(() =>
          page
            .locator('main > section picture img')
            .evaluate((image) => (image as HTMLImageElement).currentSrc),
        )
        .toContain('mobileHero.webp')

      const title = await page.locator('#fairlend-hero-title').boundingBox()
      const subtitle = await page.getByText(/Fairlend is more than a lender/i).boundingBox()
      const compactPanel = await page.getByTestId('hero-compact-panel').boundingBox()
      const applicationForm = await page.getByTestId('fairlend-application-form').boundingBox()
      const statsStrip = await page.getByTestId('hero-compact-stats-strip').boundingBox()
      const processCards = page.getByTestId('hero-mobile-process-segment')
      const processCardCount = await processCards.count()
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)

      expect(processCardCount).toBe(4)
      expect(scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        viewport.width,
      )
      assertBoxWithinViewport(compactPanel, viewport, 'compact panel')
      assertBoxWithinViewport(title, viewport, 'compact title')
      assertBoxWithinViewport(subtitle, viewport, 'compact subtitle')
      assertBoxWithinViewport(applicationForm, viewport, 'compact application form')
      assertBoxWithinViewport(statsStrip, viewport, 'compact stats strip')
      expect(title!.x).toBeGreaterThanOrEqual(compactPanel!.x - 1)
      expect(title!.x + title!.width).toBeLessThanOrEqual(compactPanel!.x + compactPanel!.width + 1)

      for (let index = 0; index < processCardCount; index += 1) {
        const card = await processCards.nth(index).boundingBox()

        assertBoxWithinViewport(card, viewport, `compact process card ${index + 1}`)
      }
    }
  })

  test('uses the tablet-landscape right-image hero from 1024px through 1279px', async ({
    page,
  }) => {
    test.slow()

    const viewports = [
      { height: 1100, width: 1114 },
      { height: 920, width: 1201 },
      { height: 1100, width: 1236 },
      { height: 1079, width: 1243 },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })

      await expect(page.getByTestId('hero-mobile-process-bar')).toBeVisible()
      await expect(page.getByTestId('hero-process-bar')).toBeHidden()
      await expect(page.getByTestId('fairlend-application-form')).toBeVisible()
      await expect(page.getByTestId('hero-compact-stats-strip')).toBeHidden()
      await expect
        .poll(() =>
          page
            .locator('main > section picture img')
            .evaluate((image) => (image as HTMLImageElement).currentSrc),
        )
        .toContain('fairlend-hero-jun-26-2026.webp')

      const title = await page.locator('#fairlend-hero-title').boundingBox()
      const subtitle = await page.getByText(/Fairlend is more than a lender/i).boundingBox()
      const copy = await page.locator('[data-fairlend-hero-copy]').boundingBox()
      const handwrittenNote = page.locator('[data-testid="hero-handwritten-insertion"]:visible').first()
      const applicationForm = await page.getByTestId('fairlend-application-form').boundingBox()
      const mapFrame = await page.getByTestId('hero-map-frame').boundingBox()
      const processCards = page.getByTestId('hero-mobile-process-segment')
      const processCardCount = await processCards.count()
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)

      expect(processCardCount).toBe(4)
      expect(scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        viewport.width,
      )
      assertBoxWithinViewport(title, viewport, 'tablet-landscape title')
      assertBoxWithinViewport(subtitle, viewport, 'tablet-landscape subtitle')
      assertBoxWithinViewport(copy, viewport, 'tablet-landscape copy')
      assertBoxWithinViewport(applicationForm, viewport, 'tablet-landscape application form')
      assertBoxWithinViewport(mapFrame, viewport, 'tablet-landscape map frame')
      await expect(handwrittenNote).toBeVisible()

      expect(
        applicationForm!.x,
        `tablet-landscape form right anchor at ${viewport.width}px`,
      ).toBeGreaterThanOrEqual(viewport.width * 0.48)
      expect(
        applicationForm!.y,
        `tablet-landscape form depth in visual cluster at ${viewport.width}px`,
      ).toBeGreaterThanOrEqual(mapFrame!.y + mapFrame!.height * 0.45)
      expect(
        applicationForm!.y - (mapFrame!.y + mapFrame!.height),
        `tablet-landscape form detached from image at ${viewport.width}px`,
      ).toBeLessThanOrEqual(92)
      expect(
        applicationForm!.x - (copy!.x + copy!.width),
        `tablet-landscape copy/form gap at ${viewport.width}px`,
      ).toBeGreaterThanOrEqual(28)

      for (let index = 0; index < processCardCount; index += 1) {
        const card = await processCards.nth(index).boundingBox()

        assertBoxWithinViewport(card, viewport, `tablet-landscape process card ${index + 1}`)
      }
    }
  })

  test('renders the judgment section as a separate responsive section', async ({ page }) => {
    for (const viewport of [
      { height: 941, width: 1672 },
      { height: 844, width: 390 },
      { height: 932, width: 430 },
    ]) {
      await page.setViewportSize(viewport)
      await page.goto(fairlendLandingPath)

      const judgmentSection = page.getByTestId('judgment-section')
      await judgmentSection.scrollIntoViewIfNeeded()

      await expect(
        judgmentSection.getByRole('heading', { name: /Judgment,\s*made\s*measurable\./i }),
      ).toBeVisible()
      await expect(judgmentSection.getByText('About Fairlend')).toBeVisible()
      await expect(judgmentSection.getByRole('link', { name: /See our method/i })).toBeVisible()
      await expect(judgmentSection.getByTestId('judgment-proof-points')).toContainText(
        'Risk reviewed',
      )
      await expect(judgmentSection.getByTestId('judgment-proof-points')).toContainText(
        'Terms clear',
      )
      await expect(judgmentSection.getByTestId('judgment-proof-points')).toContainText(
        'Draws managed',
      )
      await expect
        .poll(() =>
          judgmentSection
            .locator('img')
            .evaluate((image) => (image as HTMLImageElement).currentSrc),
        )
        .toContain('fairlend-judgment-desk.webp')
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(viewport.width)
    }
  })

  test('keeps service card artwork clear of text on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1422, height: 800 })
    await page.goto(fairlendLandingPath)

    const servicesSection = page.getByTestId('services-section')
    await servicesSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await expect(page.getByTestId('service-card')).toHaveCount(5)

    const cardLayout = await servicesSection.evaluate((section) =>
      Array.from(section.querySelectorAll('[data-testid="service-card"]')).map((card) => {
        const image = card.querySelector('img')
        const title = card.querySelector('[data-testid="service-card-title"]')
        const cardRect = card.getBoundingClientRect()
        const imageRect = image?.getBoundingClientRect()
        const titleRect = title?.getBoundingClientRect()

        return {
          imageTitleGap:
            imageRect && titleRect ? Math.round(titleRect.top - imageRect.bottom) : null,
          left: Math.floor(cardRect.left),
          right: Math.ceil(cardRect.right),
          title: title?.textContent?.trim(),
          viewportWidth: window.innerWidth,
        }
      }),
    )

    expect(cardLayout).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: '1st, 2nd, 3rd+ Mortgages' }),
        expect.objectContaining({ title: 'Invest in a Construction Project' }),
        expect.objectContaining({ title: 'Get Build Financing' }),
        expect.objectContaining({ title: 'Partners' }),
      ]),
    )

    for (const card of cardLayout) {
      expect(card.imageTitleGap, `${card.title} image/title gap`).not.toBeNull()
      expect(card.imageTitleGap, `${card.title} image/title gap`).toBeGreaterThanOrEqual(10)
      expect(card.left, `${card.title} left edge`).toBeGreaterThanOrEqual(0)
      expect(card.right, `${card.title} right edge`).toBeLessThanOrEqual(card.viewportWidth)
    }
  })

  test('renders enlarged services map artwork with an edge fade', async ({ page }) => {
    await page.setViewportSize({ width: 1422, height: 800 })
    await page.goto(fairlendLandingPath)

    const servicesSection = page.getByTestId('services-section')
    await servicesSection.scrollIntoViewIfNeeded()

    const artwork = page.getByTestId('services-map-artwork')
    await expect(artwork).toBeVisible()

    const artworkStyles = await artwork.evaluate((element) => {
      const section = element.closest('[data-testid="services-section"]')
      const image = element.querySelector('img')
      const fade = element.querySelector('[data-testid="services-map-fade"]')
      const rect = element.getBoundingClientRect()
      const sectionRect = section?.getBoundingClientRect()
      const imageStyles = image ? getComputedStyle(image) : null
      const fadeStyles = fade ? getComputedStyle(fade) : null

      return {
        bottomOffset: sectionRect ? Math.round(sectionRect.bottom - rect.bottom) : null,
        fadeBackground: fadeStyles?.backgroundImage ?? '',
        heightRatio: sectionRect ? rect.height / sectionRect.height : null,
        leftOffset: sectionRect ? Math.round(rect.left - sectionRect.left) : null,
        maskImage: imageStyles?.webkitMaskImage || imageStyles?.maskImage || '',
        widthRatio: sectionRect ? rect.width / sectionRect.width : null,
      }
    })

    expect(artworkStyles.leftOffset).toBe(0)
    expect(artworkStyles.bottomOffset).toBe(0)
    expect(artworkStyles.widthRatio).toBeGreaterThanOrEqual(0.64)
    expect(artworkStyles.widthRatio).toBeLessThanOrEqual(0.66)
    expect(artworkStyles.heightRatio).toBeGreaterThanOrEqual(0.49)
    expect(artworkStyles.heightRatio).toBeLessThanOrEqual(0.5)
    expect(artworkStyles.maskImage).toContain('radial-gradient')
    expect(artworkStyles.fadeBackground).toContain('radial-gradient')
    expect(artworkStyles.fadeBackground).toContain('linear-gradient')
  })

  test('expands a service card into a how-it-works panel and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 1422, height: 800 })
    await page.goto(fairlendLandingPath)

    const servicesSection = page.getByTestId('services-section')
    await servicesSection.scrollIntoViewIfNeeded()

    const privateMortgageCard = servicesSection
      .getByTestId('service-card')
      .filter({ hasText: 'Private Mortgage Investments' })
    const howItWorksTrigger = privateMortgageCard.getByRole('button', {
      name: 'Open how Private Mortgage Investments works',
    })

    await expect(howItWorksTrigger).toBeVisible()
    await howItWorksTrigger.click()

    const expandedCard = page.getByTestId('service-expanded-card')
    await expect(expandedCard).toBeVisible()
    await expect(expandedCard).toContainText('A clear path from first review to follow-through.')
    await expect(expandedCard).toContainText('Review the deal')
    await expect(expandedCard).toContainText('Digital deal closing')
    await expect(page.getByTestId('services-card-grid')).not.toHaveAttribute('aria-hidden', 'true')

    const expandedLayout = await expandedCard.evaluate((card) => {
      const rect = card.getBoundingClientRect()

      return {
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }
    })

    expect(expandedLayout.left).toBeGreaterThanOrEqual(0)
    expect(expandedLayout.right).toBeLessThanOrEqual(expandedLayout.viewportWidth)
    expect(expandedLayout.scrollWidth).toBeLessThanOrEqual(expandedLayout.viewportWidth)

    await expandedCard.getByRole('button', { name: 'Close how it works' }).click()
    await expect(page.getByTestId('service-expanded-card')).toHaveCount(0)
    await expect(page.getByTestId('services-card-grid')).not.toHaveAttribute('aria-hidden', 'true')
    await expect(howItWorksTrigger).toBeVisible()
  })

  test('preserves the original desktop services bento geometry', async ({ page }) => {
    await page.setViewportSize({ width: 1422, height: 800 })
    await page.goto(fairlendLandingPath)

    const servicesSection = page.getByTestId('services-section')
    await servicesSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    const readBentoGeometry = async () =>
      servicesSection.evaluate(() => {
        const grid = document.querySelector('[data-testid="services-card-grid"]')
        const gridRect = grid?.getBoundingClientRect()
        const frameRect = grid?.parentElement?.getBoundingClientRect()
        const cards = Array.from(document.querySelectorAll('[data-testid="service-card"]')).map(
          (card) => {
            const rect = card.getBoundingClientRect()
            const title = card
              .querySelector('[data-testid="service-card-title"]')
              ?.textContent?.trim()

            return {
              height: Math.round(rect.height),
              left: frameRect ? Math.round(rect.left - frameRect.left) : Math.round(rect.left),
              title,
              top: frameRect ? Math.round(rect.top - frameRect.top) : Math.round(rect.top),
              width: Math.round(rect.width),
            }
          },
        )

        return {
          cards,
          gridHeight: gridRect ? Math.round(gridRect.height) : 0,
          gridWidth: gridRect ? Math.round(gridRect.width) : 0,
        }
      })

    const closedGeometry = await readBentoGeometry()
    expect(closedGeometry.cards).toHaveLength(5)
    expect(closedGeometry.gridWidth).toBeGreaterThan(840)
    expect(closedGeometry.gridHeight).toBeGreaterThan(620)

    const topRow = closedGeometry.cards.slice(0, 3)
    const bottomRow = closedGeometry.cards.slice(3)
    const topRowTops = topRow.map((card) => card.top)
    const bottomRowTops = bottomRow.map((card) => card.top)

    expect(Math.max(...topRowTops) - Math.min(...topRowTops)).toBeLessThanOrEqual(12)
    expect(Math.max(...bottomRowTops) - Math.min(...bottomRowTops)).toBeLessThanOrEqual(12)
    expect(bottomRow[0].top).toBeGreaterThan(topRow[0].top)

    for (const card of topRow) {
      expect(card.width).toBeGreaterThan(240)
      expect(card.width).toBeLessThan(330)
      expect(card.height).toBeGreaterThan(300)
    }

    for (const card of bottomRow) {
      expect(card.width).toBeGreaterThan(380)
      expect(card.width).toBeLessThan(510)
      expect(card.height).toBeGreaterThan(300)
    }

    const buildFinancingCard = servicesSection
      .getByTestId('service-card')
      .filter({ hasText: 'Get Build Financing' })
    await buildFinancingCard
      .getByRole('button', { name: 'Open how Get Build Financing works' })
      .click()
    await expect(page.getByTestId('service-expanded-card')).toBeVisible()
    await page.waitForTimeout(400)

    const openGeometry = await readBentoGeometry()
    expect(openGeometry.cards).toHaveLength(closedGeometry.cards.length)
    expect(openGeometry.gridWidth).toBe(closedGeometry.gridWidth)
    expect(openGeometry.gridHeight).toBe(closedGeometry.gridHeight)
    for (const [index, card] of openGeometry.cards.entries()) {
      const closedCard = closedGeometry.cards[index]

      expect(card.title).toBe(closedCard.title)
      expect(card.left).toBe(closedCard.left)
      expect(card.width).toBe(closedCard.width)
      expect(card.height).toBe(closedCard.height)
      expect(Math.abs(card.top - closedCard.top), `${card.title} top shift`).toBeLessThanOrEqual(24)
    }
  })

  test('keeps the services section readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(fairlendLandingPath)

    const servicesSection = page.getByTestId('services-section')
    await servicesSection.scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible()
    await expect(page.getByTestId('service-card')).toHaveCount(5)

    const mobileLayout = await servicesSection.evaluate((section) => {
      const sectionRect = section.getBoundingClientRect()
      const proofPoints = Array.from(
        section.querySelectorAll('[data-testid="services-proof-point"]'),
      )
      const cards = Array.from(section.querySelectorAll('[data-testid="service-card"]')).map(
        (card) => {
          const rect = card.getBoundingClientRect()
          const title = card
            .querySelector('[data-testid="service-card-title"]')
            ?.textContent?.trim()

          return {
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            title,
            width: Math.round(rect.width),
          }
        },
      )

      return {
        cards,
        proofPointWidths: proofPoints.map((item) => Math.round(item.getBoundingClientRect().width)),
        scrollWidth: document.documentElement.scrollWidth,
        sectionWidth: Math.round(sectionRect.width),
        viewportWidth: window.innerWidth,
      }
    })

    expect(mobileLayout.scrollWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth)
    expect(mobileLayout.proofPointWidths.every((width) => width >= 280)).toBe(true)

    for (const card of mobileLayout.cards) {
      expect(card.width, `${card.title} card width`).toBeGreaterThanOrEqual(340)
      expect(card.left, `${card.title} left edge`).toBeGreaterThanOrEqual(0)
      expect(card.right, `${card.title} right edge`).toBeLessThanOrEqual(mobileLayout.viewportWidth)
    }
  })
})
