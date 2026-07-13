#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const targetUrl = process.argv[2] ?? 'http://localhost:3000/'
const runCount = Number.parseInt(process.argv[3] ?? '3', 10)

if (!Number.isInteger(runCount) || runCount < 1) {
  throw new Error('Run count must be a positive integer.')
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

class DevToolsSession {
  #id = 0
  #pending = new Map()
  #socket

  constructor(url) {
    this.#socket = new WebSocket(url)
    this.#socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (!message.id) return

      const pending = this.#pending.get(message.id)
      if (!pending) return

      this.#pending.delete(message.id)
      if (message.error) pending.reject(new Error(message.error.message))
      else pending.resolve(message.result)
    })
  }

  async connect() {
    if (this.#socket.readyState === WebSocket.OPEN) return
    await new Promise((resolve, reject) => {
      this.#socket.addEventListener('open', resolve, { once: true })
      this.#socket.addEventListener('error', reject, { once: true })
    })
  }

  close() {
    this.#socket.close()
  }

  send(method, params = {}) {
    const id = ++this.#id
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { reject, resolve })
      this.#socket.send(JSON.stringify({ id, method, params }))
    })
  }
}

async function waitForDevToolsPort(profileDirectory) {
  const activePortFile = join(profileDirectory, 'DevToolsActivePort')
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await readFile(activePortFile, 'utf8')).trim().split('\n')
      if (port) return Number.parseInt(port, 10)
    } catch {
      // Chrome creates the file once its debugging endpoint is ready.
    }
    await delay(50)
  }
  throw new Error('Chrome DevTools endpoint did not become ready.')
}

async function createPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: 'PUT',
  })
  if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`)
  return response.json()
}

const instrumentation = `
  (() => {
    const metrics = {
      cls: 0,
      heroComplete: null,
      heroFirstVisible: null,
      introReady: null,
      lcp: null,
      lcpElement: null,
      lcpSize: null,
      lcpUrl: null,
    };

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) metrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        metrics.lcp = last.startTime;
        metrics.lcpElement = last.element
          ? last.element.tagName.toLowerCase() + '.' + String(last.element.className).trim().replaceAll(/\\s+/g, '.')
          : null;
        metrics.lcpSize = last.size;
        metrics.lcpUrl = last.url || null;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    const isVisible = (element, minimumOpacity = 0.98) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number.parseFloat(style.opacity || '1') >= minimumOpacity &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const sampleHero = () => {
      const hero = document.querySelector('[data-fairlend-motion="toronto-hero"]');
      if (!hero) {
        requestAnimationFrame(sampleHero);
        return;
      }

      const titleLines = [...hero.querySelectorAll('.fairlend-toronto-title-line')];
      const copy = hero.querySelector('.fairlend-toronto-copy');
      const application = hero.querySelector('[data-testid="fairlend-application-form"]');
      const skyline = hero.querySelector('.fairlend-toronto-skyline');
      const titleIsVisible = titleLines.length > 0 && titleLines.every((line) => isVisible(line));

      if (metrics.heroFirstVisible === null && titleLines.some((line) => isVisible(line, 0.5))) {
        metrics.heroFirstVisible = performance.now();
      }
      if (metrics.introReady === null && hero.dataset.heroIntroReady === 'true') {
        metrics.introReady = performance.now();
      }
      if (
        metrics.heroComplete === null &&
        titleIsVisible &&
        isVisible(copy) &&
        isVisible(application) &&
        isVisible(skyline)
      ) {
        metrics.heroComplete = performance.now();
      }

      if (performance.now() < 10_000 && metrics.heroComplete === null) {
        requestAnimationFrame(sampleHero);
      }
    };

    requestAnimationFrame(sampleHero);
    window.__fairlendHeroPerformance = metrics;
  })();
`

async function profileOnce(runNumber) {
  const profileDirectory = await mkdtemp(join(tmpdir(), 'fairlend-hero-profile-'))
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-extensions',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDirectory}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  let session
  try {
    const port = await waitForDevToolsPort(profileDirectory)
    const target = await createPage(port)
    session = new DevToolsSession(target.webSocketDebuggerUrl)
    await session.connect()

    await Promise.all([
      session.send('Page.enable'),
      session.send('Network.enable'),
      session.send('Runtime.enable'),
    ])
    await session.send('Page.bringToFront')
    await session.send('Network.setCacheDisabled', { cacheDisabled: true })
    await session.send('Network.emulateNetworkConditions', {
      connectionType: 'cellular4g',
      downloadThroughput: 500_000,
      latency: 20,
      offline: false,
      uploadThroughput: 375_000,
    })
    await session.send('Emulation.setDeviceMetricsOverride', {
      deviceScaleFactor: 1,
      height: 900,
      mobile: false,
      width: 1440,
    })
    await session.send('Page.addScriptToEvaluateOnNewDocument', {
      source: instrumentation,
    })
    await session.send('Page.navigate', { url: targetUrl })

    await delay(7_000)

    const evaluation = await session.send('Runtime.evaluate', {
      expression: `JSON.stringify({
        debug: {
          currentUrl: location.href,
          heroFound: Boolean(document.querySelector('[data-fairlend-motion="toronto-hero"]')),
          titleLineCount: document.querySelectorAll('.fairlend-toronto-title-line').length,
          visibilityState: document.visibilityState,
        },
        metrics: window.__fairlendHeroPerformance,
        navigation: performance.getEntriesByType('navigation')[0]?.toJSON(),
        paints: performance.getEntriesByType('paint').map((entry) => entry.toJSON()),
      })`,
      returnByValue: true,
    })
    const result = JSON.parse(evaluation.result.value)
    const firstContentfulPaint = result.paints.find(
      (entry) => entry.name === 'first-contentful-paint',
    )?.startTime
    const firstContentfulPaintMs = Math.round(firstContentfulPaint ?? 0)
    const heroCompleteMs = Math.round(result.metrics.heroComplete ?? 0)
    const lcpMs = Math.round(result.metrics.lcp ?? 0)

    return {
      cls: Number(result.metrics.cls.toFixed(4)),
      domContentLoadedMs: Math.round(result.navigation.domContentLoadedEventEnd),
      firstContentfulPaintMs,
      heroCompleteMs,
      heroFirstVisibleMs: Math.round(result.metrics.heroFirstVisible ?? 0),
      heroSettleAfterFcpMs: Math.max(0, heroCompleteMs - firstContentfulPaintMs),
      introReadyMs: Math.round(result.metrics.introReady ?? 0),
      lcpAfterFcpMs: Math.max(0, lcpMs - firstContentfulPaintMs),
      lcpMs,
      lcpElement: result.metrics.lcpElement,
      lcpSize: result.metrics.lcpSize,
      lcpUrl: result.metrics.lcpUrl,
      loadMs: Math.round(result.navigation.loadEventEnd),
      run: runNumber,
      ...result.debug,
    }
  } finally {
    session?.close()
    if (chrome.exitCode === null) {
      chrome.kill('SIGTERM')
      await Promise.race([once(chrome, 'exit'), delay(2_000)])
    }
    await rm(profileDirectory, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 })
  }
}

const results = []
for (let run = 1; run <= runCount; run += 1) {
  results.push(await profileOnce(run))
}

const average = (key) =>
  Math.round(results.reduce((total, result) => total + result[key], 0) / results.length)

console.log(
  JSON.stringify(
    {
      average: {
        cls: Number(
          (results.reduce((total, result) => total + result.cls, 0) / results.length).toFixed(4),
        ),
        firstContentfulPaintMs: average('firstContentfulPaintMs'),
        heroCompleteMs: average('heroCompleteMs'),
        heroFirstVisibleMs: average('heroFirstVisibleMs'),
        heroSettleAfterFcpMs: average('heroSettleAfterFcpMs'),
        lcpAfterFcpMs: average('lcpAfterFcpMs'),
        lcpMs: average('lcpMs'),
      },
      network: 'Fast 4G (4 Mbps down / 3 Mbps up / 20 ms RTT)',
      results,
      url: targetUrl,
      viewport: '1440x900 @1x',
    },
    null,
    2,
  ),
)
