import type { Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const fairlendLandingPath = '/fairlend-landing-hero'
const round = process.env.ROUND || '1'
const strict = process.env.RESPONSIVE_HERO_STRICT !== '0'
const artifactDir = path.join(process.cwd(), 'artifacts', 'responsive-hero', `round-${round}`)

const viewports = [
  { height: 1100, id: 'compact-687', mode: 'compact', width: 687 },
  { height: 1100, id: 'compact-870', mode: 'compact', width: 870 },
  { height: 1100, id: 'compact-993', mode: 'compact', width: 993 },
  { height: 768, id: 'tablet-landscape-short-1024', mode: 'tabletLandscape', width: 1024 },
  { height: 650, id: 'tablet-landscape-short-1114', mode: 'tabletLandscape', width: 1114 },
  { height: 720, id: 'tablet-landscape-short-1279', mode: 'tabletLandscape', width: 1279 },
  { height: 1100, id: 'tablet-landscape-1114', mode: 'tabletLandscape', width: 1114 },
  { height: 920, id: 'tablet-landscape-1201', mode: 'tabletLandscape', width: 1201 },
  { height: 1100, id: 'tablet-landscape-1236', mode: 'tabletLandscape', width: 1236 },
  { height: 1079, id: 'tablet-landscape-1243', mode: 'tabletLandscape', width: 1243 },
  { height: 1800, id: 'portrait-1280', mode: 'compact', width: 1280 },
  { height: 2048, id: 'portrait-1366', mode: 'compact', width: 1366 },
  { height: 900, id: 'desktop-1280', mode: 'desktop', width: 1280 },
  { height: 1079, id: 'desktop-1341', mode: 'desktop', width: 1341 },
  { height: 1101, id: 'desktop-1454', mode: 'desktop', width: 1454 },
  { height: 1079, id: 'desktop-1542', mode: 'desktop', width: 1542 },
  { height: 1166, id: 'desktop-screenshot-1590', mode: 'desktop', width: 1590 },
  { height: 1079, id: 'desktop-1670', mode: 'desktop', width: 1670 },
  { height: 1079, id: 'desktop-1804', mode: 'desktop', width: 1804 },
  { height: 1163, id: 'desktop-screenshot-1819', mode: 'desktop', width: 1819 },
  { height: 1175, id: 'desktop-1909', mode: 'desktop', width: 1909 },
  { height: 1161, id: 'desktop-screenshot-1914', mode: 'desktop', width: 1914 },
  { height: 1079, id: 'desktop-1929', mode: 'desktop', width: 1929 },
  { height: 1079, id: 'desktop-2061', mode: 'desktop', width: 2061 },
] as const

const selectors = {
  application: '[data-testid="fairlend-application-form"]',
  compactPanel: '[data-testid="hero-compact-panel"]',
  compactStats: '[data-testid="hero-compact-stats-strip"]',
  copy: '[data-fairlend-hero-copy]',
  desktopProcess: '[data-testid="hero-process-bar"]',
  desktopStats: '[data-testid="hero-desktop-stats-strip"]',
  header: 'header',
  handwritten: '[data-testid="hero-handwritten-insertion"]:visible',
  handwrittenAnchor: '[data-testid="hero-financing-caret-anchor"]:visible',
  handwrittenConnector: '[data-testid="hero-handwritten-connector"]:visible',
  hero: '[data-fairlend-hero-scroll]',
  map: '[data-testid="hero-map-frame"]',
  mobileProcess: '[data-testid="hero-mobile-process-bar"]',
  stage: '[data-fairlend-hero-pin]',
  subtitle: '[data-fairlend-hero-copy] p:visible',
  title: '#fairlend-hero-title',
}

type Viewport = (typeof viewports)[number]
type SelectorName = keyof typeof selectors

type RawBox = {
  height: number
  width: number
  x: number
  y: number
}

type Box = RawBox & {
  bottom: number
  left: number
  right: number
  top: number
}

type Metrics = {
  bodyScrollWidth: number
  boxes: Record<SelectorName, Box | null>
  currentImage: string
  failures: string[]
  frameworkOverlay: string | null
  processCards: Box[]
  processCardSelector: string
  scrollWidth: number
  visibility: Record<'desktopProcess' | 'mobileProcess', boolean>
  visibleRatios: Record<SelectorName, number | null>
  viewport: Viewport
}

function toBox(box: RawBox | null): Box | null {
  if (!box) return null

  return {
    ...box,
    bottom: box.y + box.height,
    left: box.x,
    right: box.x + box.width,
    top: box.y,
  }
}

function visibleRatio(box: Box | null, viewport: { height: number; width: number }) {
  if (!box || box.width <= 0 || box.height <= 0) return null

  const overlapWidth = Math.max(0, Math.min(box.right, viewport.width) - Math.max(box.left, 0))
  const overlapHeight = Math.max(0, Math.min(box.bottom, viewport.height) - Math.max(box.top, 0))

  return (overlapWidth * overlapHeight) / (box.width * box.height)
}

function overlapArea(leftBox: Box | null, rightBox: Box | null) {
  if (!leftBox || !rightBox) return 0

  const overlapWidth = Math.max(
    0,
    Math.min(leftBox.right, rightBox.right) - Math.max(leftBox.left, rightBox.left),
  )
  const overlapHeight = Math.max(
    0,
    Math.min(leftBox.bottom, rightBox.bottom) - Math.max(leftBox.top, rightBox.top),
  )

  return overlapWidth * overlapHeight
}

function boxWithinViewport(
  box: Box | null,
  viewport: { height: number; width: number },
  label: string,
  tolerance = 2,
) {
  const failures: string[] = []

  if (!box) {
    return [`${label} missing`]
  }

  if (box.left < -tolerance) {
    failures.push(`${label} left ${box.left.toFixed(1)} < 0`)
  }

  if (box.top < -tolerance) {
    failures.push(`${label} top ${box.top.toFixed(1)} < 0`)
  }

  if (box.right > viewport.width + tolerance) {
    failures.push(`${label} right ${box.right.toFixed(1)} > ${viewport.width}`)
  }

  if (box.bottom > viewport.height + tolerance) {
    failures.push(`${label} bottom ${box.bottom.toFixed(1)} > ${viewport.height}`)
  }

  return failures
}

function boxInsideBox(inner: Box | null, outer: Box | null, label: string, tolerance = 1) {
  const failures: string[] = []

  if (!inner || !outer) {
    return [`${label} missing containment boxes`]
  }

  if (inner.left < outer.left - tolerance) {
    failures.push(`${label} left ${inner.left.toFixed(1)} < container ${outer.left.toFixed(1)}`)
  }

  if (inner.right > outer.right + tolerance) {
    failures.push(`${label} right ${inner.right.toFixed(1)} > container ${outer.right.toFixed(1)}`)
  }

  if (inner.top < outer.top - tolerance) {
    failures.push(`${label} top ${inner.top.toFixed(1)} < container ${outer.top.toFixed(1)}`)
  }

  if (inner.bottom > outer.bottom + tolerance) {
    failures.push(
      `${label} bottom ${inner.bottom.toFixed(1)} > container ${outer.bottom.toFixed(1)}`,
    )
  }

  return failures
}

async function readBoxes(page: Page) {
  const entries = await Promise.all(
    Object.entries(selectors).map(async ([key, selector]) => {
      const box = await page.evaluate((rawSelector) => {
        const cssSelector = rawSelector.replaceAll(':visible', '')
        const elements = Array.from(document.querySelectorAll(cssSelector))

        for (const element of elements) {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)

          if (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            Number(style.opacity) !== 0
          ) {
            return { height: rect.height, width: rect.width, x: rect.x, y: rect.y }
          }
        }

        return null
      }, selector)

      return [key, toBox(box)] as const
    }),
  )

  return Object.fromEntries(entries) as Record<SelectorName, Box | null>
}

function readVisibleRatios(boxes: Metrics['boxes'], viewport: Viewport) {
  const entries = Object.keys(selectors).map((key) => {
    const selectorName = key as SelectorName

    return [selectorName, visibleRatio(boxes[selectorName], viewport)] as const
  })

  return Object.fromEntries(entries) as Metrics['visibleRatios']
}

async function readProcessCards(page: Page, viewport: Viewport) {
  const processCardSelector =
    viewport.mode === 'desktop'
      ? '[data-testid="hero-process-segment"]'
      : '[data-testid="hero-mobile-process-segment"]'
  const cards = page.locator(processCardSelector)
  const count = await cards.count()
  const boxes: Box[] = []

  for (let index = 0; index < count; index += 1) {
    const box = toBox(await cards.nth(index).boundingBox())

    if (box) {
      boxes.push(box)
    }
  }

  return { boxes, processCardSelector }
}

async function readFrameworkOverlay(page: Page) {
  return page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal')
    const text = portal?.shadowRoot?.textContent ?? ''

    return /Build Error|Console Error|Runtime Error|Unhandled Runtime Error|Hydration/.test(text)
      ? text.slice(0, 500)
      : null
  })
}

async function readHeroMetrics(page: Page, viewport: Viewport): Promise<Metrics> {
  const [
    boxes,
    scrollWidths,
    currentImage,
    processCards,
    desktopProcessVisible,
    mobileProcessVisible,
    frameworkOverlay,
  ] =
    await Promise.all([
      readBoxes(page),
      page.evaluate(() => ({
        body: document.body.scrollWidth,
        document: document.documentElement.scrollWidth,
      })),
      page
        .locator('main > section picture img')
        .evaluate((image) => (image as HTMLImageElement).currentSrc),
      readProcessCards(page, viewport),
      page.locator(selectors.desktopProcess).isVisible(),
      page.locator(selectors.mobileProcess).isVisible(),
      readFrameworkOverlay(page),
    ])

  return {
    bodyScrollWidth: scrollWidths.body,
    boxes,
    currentImage,
    failures: [],
    frameworkOverlay,
    processCards: processCards.boxes,
    processCardSelector: processCards.processCardSelector,
    scrollWidth: scrollWidths.document,
    visibility: {
      desktopProcess: desktopProcessVisible,
      mobileProcess: mobileProcessVisible,
    },
    visibleRatios: readVisibleRatios(boxes, viewport),
    viewport,
  }
}

function collectCoreFailures(metrics: Metrics, viewport: Viewport) {
  const failures: string[] = []

  if (metrics.scrollWidth > viewport.width + 1) {
    failures.push(`horizontal overflow: scrollWidth ${metrics.scrollWidth} > ${viewport.width}`)
  }

  if (metrics.bodyScrollWidth > viewport.width + 1) {
    failures.push(`body horizontal overflow: scrollWidth ${metrics.bodyScrollWidth} > ${viewport.width}`)
  }

  if (metrics.frameworkOverlay) {
    failures.push(`framework overlay visible: ${metrics.frameworkOverlay}`)
  }

  for (const name of [
    'title',
    'copy',
    'application',
    'stage',
    'handwritten',
    'handwrittenAnchor',
    'handwrittenConnector',
  ] as const) {
    const ratio = metrics.visibleRatios[name] ?? 0

    if (ratio < 0.98) {
      failures.push(`${name} visible ratio ${ratio.toFixed(3)} < 0.98`)
    }

    failures.push(...boxWithinViewport(metrics.boxes[name], viewport, name))
  }

  failures.push(...collectHandwrittenAnchorFailures(metrics))

  return failures
}

function collectHandwrittenAnchorFailures(metrics: Metrics) {
  const failures: string[] = []
  const anchor = metrics.boxes.handwrittenAnchor
  const connector = metrics.boxes.handwrittenConnector
  const note = metrics.boxes.handwritten

  if (!anchor || !connector || !note) {
    return ['handwritten anchor alignment missing boxes']
  }

  const anchorCenter = anchor.left + anchor.width / 2
  const connectorCenter = connector.left + connector.width / 2
  const noteCenter = note.left + note.width / 2
  const connectorDelta = Math.abs(connectorCenter - anchorCenter)
  const noteDelta = Math.abs(noteCenter - anchorCenter)

  if (connectorDelta > 4) {
    failures.push(`handwritten connector center delta ${connectorDelta.toFixed(1)} > 4`)
  }

  if (noteDelta > 4) {
    failures.push(`handwritten note center delta ${noteDelta.toFixed(1)} > 4`)
  }

  return failures
}

function collectCompactFailures(metrics: Metrics, viewport: Viewport) {
  const failures: string[] = []

  if (!metrics.currentImage.includes('mobileHero.webp')) {
    failures.push(`expected mobileHero.webp below 1280, got ${metrics.currentImage}`)
  }

  if (!metrics.visibility.mobileProcess) {
    failures.push('compact mobile process is hidden')
  }

  if (metrics.visibility.desktopProcess) {
    failures.push('compact desktop process is visible')
  }

  for (const name of ['compactPanel', 'compactStats', 'subtitle'] as const) {
    const ratio = metrics.visibleRatios[name] ?? 0

    if (ratio < 0.98) {
      failures.push(`${name} visible ratio ${ratio.toFixed(3)} < 0.98`)
    }

    failures.push(...boxWithinViewport(metrics.boxes[name], viewport, name))
  }

  failures.push(...boxInsideBox(metrics.boxes.copy, metrics.boxes.compactPanel, 'copy in compact panel'))
  failures.push(
    ...boxInsideBox(metrics.boxes.application, metrics.boxes.compactPanel, 'application in compact panel'),
  )
  failures.push(
    ...boxInsideBox(metrics.boxes.compactStats, metrics.boxes.compactPanel, 'stats in compact panel'),
  )

  if (metrics.boxes.copy && metrics.boxes.application) {
    const copyApplicationGap = metrics.boxes.application.top - metrics.boxes.copy.bottom

    if (copyApplicationGap < 8) {
      failures.push(`compact copy/application vertical gap ${copyApplicationGap.toFixed(1)} < 8`)
    }
  }

  if (metrics.boxes.application && metrics.boxes.compactStats) {
    const formStatsGap = metrics.boxes.compactStats.top - metrics.boxes.application.bottom

    if (formStatsGap < -1) {
      failures.push(`compact form overlaps stats by ${Math.abs(formStatsGap).toFixed(1)}px`)
    }
  }

  if (metrics.processCards.length !== 4) {
    failures.push(`compact process card count ${metrics.processCards.length} !== 4`)
  }

  metrics.processCards.forEach((box, index) => {
    failures.push(...boxWithinViewport(box, viewport, `compact process card ${index + 1}`))

    const ratio = visibleRatio(box, viewport) ?? 0

    if (ratio < 0.98) {
      failures.push(`compact process card ${index + 1} visible ratio ${ratio.toFixed(3)} < 0.98`)
    }
  })

  return failures
}

function collectTabletLandscapeFailures(metrics: Metrics, viewport: Viewport) {
  const failures: string[] = []

  if (!metrics.currentImage.includes('fairlend-hero-jun-26-2026.webp')) {
    failures.push(`expected desktop image in tablet landscape, got ${metrics.currentImage}`)
  }

  if (!metrics.visibility.mobileProcess) {
    failures.push('tablet landscape process layer is hidden')
  }

  if (metrics.visibility.desktopProcess) {
    failures.push('tablet landscape desktop process is visible')
  }

  if (metrics.boxes.compactStats) {
    failures.push('tablet landscape compact stats strip should be hidden')
  }

  failures.push(...boxWithinViewport(metrics.boxes.map, viewport, 'tablet landscape map'))
  failures.push(...boxWithinViewport(metrics.boxes.handwrittenConnector, viewport, 'handwritten connector'))

  if (metrics.boxes.copy && metrics.boxes.application) {
    const copyFormGap = metrics.boxes.application.left - metrics.boxes.copy.right

    if (copyFormGap < 28) {
      failures.push(`tablet landscape copy/form horizontal gap ${copyFormGap.toFixed(1)} < 28`)
    }
  }

  if (metrics.boxes.application && metrics.boxes.map) {
    const minimumRightAnchor = viewport.width * 0.48
    const visualClusterGap = metrics.boxes.application.top - metrics.boxes.map.bottom
    const minimumClusterDepth = metrics.boxes.map.top + metrics.boxes.map.height * 0.45

    if (metrics.boxes.application.left < minimumRightAnchor) {
      failures.push(
        `tablet landscape application left ${metrics.boxes.application.left.toFixed(
          1,
        )} < right-side image anchor ${minimumRightAnchor.toFixed(1)}`,
      )
    }

    if (metrics.boxes.application.top < minimumClusterDepth) {
      failures.push(
        `tablet landscape form top ${metrics.boxes.application.top.toFixed(
          1,
        )} < visual cluster depth ${minimumClusterDepth.toFixed(1)}`,
      )
    }

    if (visualClusterGap > 92) {
      failures.push(`tablet landscape form detached from image by ${visualClusterGap.toFixed(1)}px`)
    }
  }

  const copyApplicationOverlap = overlapArea(metrics.boxes.copy, metrics.boxes.application)
  const titleApplicationOverlap = overlapArea(metrics.boxes.title, metrics.boxes.application)

  if (copyApplicationOverlap > 16) {
    failures.push(`tablet landscape copy/application overlap area ${Math.round(copyApplicationOverlap)}px2`)
  }

  if (titleApplicationOverlap > 16) {
    failures.push(`tablet landscape title/application overlap area ${Math.round(titleApplicationOverlap)}px2`)
  }

  if (metrics.processCards.length !== 4) {
    failures.push(`tablet landscape process card count ${metrics.processCards.length} !== 4`)
  }

  metrics.processCards.forEach((box, index) => {
    failures.push(...boxWithinViewport(box, viewport, `tablet landscape process card ${index + 1}`))

    const ratio = visibleRatio(box, viewport) ?? 0

    if (ratio < 0.98) {
      failures.push(`tablet landscape process card ${index + 1} visible ratio ${ratio.toFixed(3)} < 0.98`)
    }
  })

  return failures
}

function collectDesktopFailures(metrics: Metrics, viewport: Viewport) {
  const failures: string[] = []

  if (!metrics.currentImage.includes('fairlend-hero-jun-26-2026.webp')) {
    failures.push(`expected fairlend-hero-jun-26-2026.webp at desktop, got ${metrics.currentImage}`)
  }

  if (!metrics.visibility.desktopProcess) {
    failures.push('desktop process is hidden')
  }

  if (metrics.visibility.mobileProcess) {
    failures.push('desktop mobile process is visible')
  }

  const copyApplicationOverlap = overlapArea(metrics.boxes.copy, metrics.boxes.application)
  const titleApplicationOverlap = overlapArea(metrics.boxes.title, metrics.boxes.application)
  const copyMapOverlap = overlapArea(metrics.boxes.copy, metrics.boxes.map)
  const titleMapOverlap = overlapArea(metrics.boxes.title, metrics.boxes.map)

  if (copyApplicationOverlap > 16) {
    failures.push(`desktop copy/application overlap area ${Math.round(copyApplicationOverlap)}px2`)
  }

  if (titleApplicationOverlap > 16) {
    failures.push(`desktop title/application overlap area ${Math.round(titleApplicationOverlap)}px2`)
  }

  if (copyMapOverlap > 16) {
    failures.push(`desktop copy/map overlap area ${Math.round(copyMapOverlap)}px2`)
  }

  if (titleMapOverlap > 16) {
    failures.push(`desktop title/map overlap area ${Math.round(titleMapOverlap)}px2`)
  }

  if (metrics.boxes.copy && metrics.boxes.application) {
    const copyRightEdge = metrics.boxes.copy.right
    const formLeftEdge = metrics.boxes.application.left

    if (formLeftEdge - copyRightEdge < 18) {
      failures.push(`desktop copy/application horizontal gap ${(formLeftEdge - copyRightEdge).toFixed(1)} < 18`)
    }
  }

  if (metrics.boxes.application) {
    const minimumRightAnchor = viewport.width * 0.58
    const minimumMapDepth = viewport.height * 0.52

    if (metrics.boxes.application.left < minimumRightAnchor) {
      failures.push(
        `desktop application left ${metrics.boxes.application.left.toFixed(
          1,
        )} < right-side house anchor ${minimumRightAnchor.toFixed(1)}`,
      )
    }

    if (metrics.boxes.application.top < minimumMapDepth) {
      failures.push(
        `desktop application top ${metrics.boxes.application.top.toFixed(
          1,
        )} < below-house depth ${minimumMapDepth.toFixed(1)}`,
      )
    }
  }

  if (metrics.processCards.length !== 4) {
    failures.push(`desktop process card count ${metrics.processCards.length} !== 4`)
  }

  metrics.processCards.forEach((box, index) => {
    failures.push(...boxWithinViewport(box, viewport, `desktop process card ${index + 1}`))

    const headerBottom = metrics.boxes.header?.bottom ?? 0

    if (box.top < headerBottom + 6) {
      failures.push(
        `desktop process card ${index + 1} top ${box.top.toFixed(1)} < header clearance ${(
          headerBottom + 6
        ).toFixed(1)}`,
      )
    }
  })

  return failures
}

function collectFailures(metrics: Metrics, viewport: Viewport) {
  const modeFailures =
    viewport.mode === 'compact'
      ? collectCompactFailures(metrics, viewport)
      : viewport.mode === 'tabletLandscape'
        ? collectTabletLandscapeFailures(metrics, viewport)
        : collectDesktopFailures(metrics, viewport)

  return [
    ...collectCoreFailures(metrics, viewport),
    ...modeFailures,
  ]
}

async function attachArtifact(testInfo: TestInfo, name: string, contentType: string, artifactPath: string) {
  await testInfo.attach(name, {
    contentType,
    path: artifactPath,
  })
}

async function captureViewport(page: Page, testInfo: TestInfo, viewport: Viewport) {
  await page.setViewportSize({ height: viewport.height, width: viewport.width })
  await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })
  await expect(page.locator(selectors.title)).toBeVisible()
  await page.waitForTimeout(900)

  const metrics = await readHeroMetrics(page, viewport)
  const failures = collectFailures(metrics, viewport)
  const output = { ...metrics, failures }
  const metricsPath = path.join(artifactDir, `${viewport.id}.json`)
  const screenshotPath = path.join(artifactDir, `${viewport.id}.png`)

  await writeFile(metricsPath, `${JSON.stringify(output, null, 2)}\n`)
  await page.screenshot({ fullPage: false, path: screenshotPath })
  await attachArtifact(testInfo, `${viewport.id}-metrics`, 'application/json', metricsPath)
  await attachArtifact(testInfo, `${viewport.id}-screenshot`, 'image/png', screenshotPath)

  if (strict) {
    expect(failures, `${viewport.id} responsive failures`).toEqual([])
  }
}

async function writeContactSheet() {
  const figures = viewports
    .map(
      (viewport) => `
        <figure>
          <a href="./${viewport.id}.png"><img src="./${viewport.id}.png" alt="${viewport.id}" /></a>
          <figcaption>
            <strong>${viewport.id}</strong>
            <span>${viewport.width}x${viewport.height} - ${viewport.mode}</span>
            <a href="./${viewport.id}.json">metrics</a>
          </figcaption>
        </figure>
      `,
    )
    .join('\n')

  await writeFile(
    path.join(artifactDir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fairlend Hero Responsive Audit - ${round}</title>
    <style>
      body {
        margin: 0;
        background: #fffdf7;
        color: #08252c;
        font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 24px;
        padding: 24px;
      }
      figure {
        margin: 0;
        overflow: hidden;
        border: 1px solid color-mix(in oklab, #08252c 12%, transparent);
        border-radius: 14px;
        background: white;
        box-shadow: 0 14px 40px rgb(8 37 44 / 10%);
      }
      img {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        object-position: top center;
      }
      figcaption {
        display: grid;
        gap: 2px;
        padding: 12px 14px 14px;
      }
      figcaption span,
      figcaption a {
        color: #47626b;
      }
    </style>
  </head>
  <body>
    <main>${figures}</main>
  </body>
</html>
`,
  )
}

function createViewportTest(viewport: Viewport) {
  return async ({ page }: { page: Page }, testInfo: TestInfo) => {
    test.slow()
    await captureViewport(page, testInfo, viewport)
  }
}

test.describe('Fairlend hero handwritten caret reduced motion', () => {
  for (const viewport of viewports.filter(({ id }) =>
    ['compact-687', 'tablet-landscape-short-1024', 'portrait-1280', 'desktop-1280'].includes(id),
  )) {
    test(`aligns handwritten caret with financing gap under reduced motion at ${viewport.id}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      await page.goto(fairlendLandingPath, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(selectors.title)).toBeVisible()

      const metrics = await readHeroMetrics(page, viewport)
      const failures = [
        ...boxWithinViewport(metrics.boxes.handwritten, viewport, 'handwritten'),
        ...boxWithinViewport(metrics.boxes.handwrittenConnector, viewport, 'handwritten connector'),
        ...collectHandwrittenAnchorFailures(metrics),
      ]

      expect(failures, `${viewport.id} reduced-motion handwritten failures`).toEqual([])
    })
  }
})

test.describe('Fairlend hero responsive audit capture', () => {
  test.beforeAll(async () => {
    await mkdir(artifactDir, { recursive: true })
  })

  test.afterAll(async () => {
    await writeContactSheet()
  })

  for (const viewport of viewports) {
    test(`captures ${viewport.id}`, createViewportTest(viewport))
  }
})
