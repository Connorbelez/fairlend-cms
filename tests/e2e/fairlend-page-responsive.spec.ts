import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const fairlendLandingPath = '/'
const round = process.env.ROUND || '1'
const artifactDir = path.join(process.cwd(), 'artifacts', 'responsive-page', `round-${round}`)

const viewports = [
  { height: 1100, id: 'compact-687', width: 687 },
  { height: 1100, id: 'compact-870', width: 870 },
  { height: 1100, id: 'compact-993', width: 993 },
  { height: 900, id: 'tablet-landscape-1114', width: 1114 },
  { height: 920, id: 'tablet-landscape-1201', width: 1201 },
  { height: 920, id: 'tablet-landscape-1236', width: 1236 },
  { height: 1079, id: 'tablet-landscape-1243', width: 1243 },
  { height: 2048, id: 'portrait-1366', width: 1366 },
  { height: 900, id: 'desktop-1280', width: 1280 },
  { height: 1101, id: 'desktop-1454', width: 1454 },
  { height: 1079, id: 'desktop-1670', width: 1670 },
  { height: 1175, id: 'desktop-1909', width: 1909 },
  { height: 1079, id: 'desktop-2061', width: 2061 },
] as const

const sections = [
  {
    desktopMustFit: true,
    essentials: ['#fairlend-hero-title', '[data-testid="fairlend-application-form"]'],
    id: 'hero',
    selector: '[data-fairlend-hero-pin]',
  },
  {
    desktopMustFit: false,
    essentials: ['#fairlend-testimonials-title'],
    id: 'testimonials',
    selector: '[data-testid="testimonials-marquee-section"]',
  },
  {
    desktopMustFit: false,
    essentials: ['[data-testid="fairlend-editorial-bridge"]'],
    id: 'editorial-bridge',
    selector: '[data-testid="fairlend-editorial-bridge"]',
  },
  {
    desktopMustFit: true,
    essentials: ['#fairlend-services-title'],
    id: 'services',
    selector: '[data-testid="services-section"]',
  },
  {
    desktopMustFit: true,
    essentials: ['#fairlend-judgment-title', '[data-testid="judgment-proof-points"]'],
    id: 'judgment',
    selector: '[data-testid="judgment-section"]',
  },
] as const

type Rect = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

function visibleRatio(rect: Rect | null, viewport: { height: number; width: number }) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return 0

  const visibleWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0))
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0))

  return (visibleWidth * visibleHeight) / (rect.width * rect.height)
}

function assertHorizontalBounds(
  rect: Rect | null,
  viewport: { width: number },
  label: string,
  tolerance = 2,
) {
  expect(rect, `${label} rect`).not.toBeNull()
  expect(rect!.left, `${label} left`).toBeGreaterThanOrEqual(-tolerance)
  expect(rect!.right, `${label} right`).toBeLessThanOrEqual(viewport.width + tolerance)
  expect(rect!.width, `${label} width`).toBeLessThanOrEqual(viewport.width + tolerance)
}

async function rectFor(page: import('@playwright/test').Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => {
      const rect = element.getBoundingClientRect()

      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      }
    }) as Promise<Rect>
}

async function frameworkOverlayFor(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal')
    const text = portal?.shadowRoot?.textContent ?? ''

    return /Build Error|Console Error|Runtime Error|Unhandled Runtime Error|Hydration/.test(text)
      ? text.slice(0, 500)
      : null
  })
}

async function writeContactSheet() {
  const figures = viewports
    .flatMap((viewport) =>
      sections.map(
        (section) => `
          <figure>
            <a href="./${viewport.id}-${section.id}.png">
              <img src="./${viewport.id}-${section.id}.png" alt="${viewport.id} ${section.id}" />
            </a>
            <figcaption>
              <strong>${viewport.id}</strong>
              <span>${viewport.width}x${viewport.height} - ${section.id}</span>
            </figcaption>
          </figure>
        `,
      ),
    )
    .join('\n')

  await writeFile(
    path.join(artifactDir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fairlend Page Responsive Audit - ${round}</title>
    <style>
      body { margin: 0; background: #fffdf7; color: #08252c; font: 14px/1.45 system-ui, sans-serif; }
      main { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; padding: 20px; }
      figure { margin: 0; overflow: hidden; border: 1px solid rgb(8 37 44 / 12%); border-radius: 12px; background: white; }
      img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top center; }
      figcaption { display: grid; gap: 2px; padding: 10px 12px 12px; }
      figcaption span { color: #47626b; }
    </style>
  </head>
  <body>
    <main>${figures}</main>
  </body>
</html>
`,
  )
}

test.describe('Fairlend page responsive section audit', () => {
  test.beforeAll(async () => {
    await mkdir(artifactDir, { recursive: true })
  })

  test.afterAll(async () => {
    await writeContactSheet()
  })

  for (const viewport of viewports) {
    test(`keeps all landing sections composed at ${viewport.id}`, async ({ page }, testInfo) => {
      test.slow()

      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(800)

      await expect
        .poll(() => frameworkOverlayFor(page), {
          message: `${viewport.id} should not show a framework error overlay`,
        })
        .toBeNull()

      for (const section of sections) {
        const sectionLocator = page.locator(section.selector).first()

        if (section.id === 'hero') {
          await page.evaluate(() => window.scrollTo(0, 0))
        } else {
          await sectionLocator.evaluate((element) =>
            element.scrollIntoView({ block: 'start', inline: 'nearest' }),
          )
        }

        await page.waitForTimeout(450)

        const [scrollWidths, rect] = await Promise.all([
          page.evaluate(() => ({
            body: document.body.scrollWidth,
            document: document.documentElement.scrollWidth,
          })),
          rectFor(page, section.selector),
        ])
        const screenshotPath = path.join(artifactDir, `${viewport.id}-${section.id}.png`)

        await page.screenshot({ fullPage: false, path: screenshotPath })
        await testInfo.attach(`${viewport.id}-${section.id}`, {
          contentType: 'image/png',
          path: screenshotPath,
        })

        expect(
          scrollWidths.document,
          `${section.id} document horizontal overflow at ${viewport.id}`,
        ).toBeLessThanOrEqual(viewport.width + 1)
        expect(
          scrollWidths.body,
          `${section.id} body horizontal overflow at ${viewport.id}`,
        ).toBeLessThanOrEqual(viewport.width + 1)

        assertHorizontalBounds(rect, viewport, `${viewport.id} ${section.id}`)

        if (viewport.width >= 1024 && section.desktopMustFit) {
          expect(
            rect.height,
            `${section.id} should fit a desktop/tablet-landscape viewport at ${viewport.id}`,
          ).toBeLessThanOrEqual(viewport.height * 1.12)
        }

        for (const essentialSelector of section.essentials) {
          const essential = page.locator(essentialSelector).first()
          const essentialRect = await essential.boundingBox()

          expect(essentialRect, `${section.id} essential ${essentialSelector}`).not.toBeNull()
          assertHorizontalBounds(
            {
              bottom: essentialRect!.y + essentialRect!.height,
              height: essentialRect!.height,
              left: essentialRect!.x,
              right: essentialRect!.x + essentialRect!.width,
              top: essentialRect!.y,
              width: essentialRect!.width,
            },
            viewport,
            `${viewport.id} ${section.id} ${essentialSelector}`,
          )

          if ((viewport.width >= 1024 && section.desktopMustFit) || section.id === 'hero') {
            const ratio = visibleRatio(
              {
                bottom: essentialRect!.y + essentialRect!.height,
                height: essentialRect!.height,
                left: essentialRect!.x,
                right: essentialRect!.x + essentialRect!.width,
                top: essentialRect!.y,
                width: essentialRect!.width,
              },
              viewport,
            )

            expect(
              ratio,
              `${section.id} essential ${essentialSelector} visible ratio at ${viewport.id}`,
            ).toBeGreaterThanOrEqual(0.85)
          }
        }
      }
    })
  }
})
