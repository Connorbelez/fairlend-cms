#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const targetUrl =
  process.argv.slice(2).find((argument) => /^https?:\/\//.test(argument)) ??
  'http://localhost:4975/'
const desktop = process.argv.includes('--desktop')
const viewport = desktop
  ? { deviceScaleFactor: 1, height: 900, mobile: false, width: 1440 }
  : { deviceScaleFactor: 3, height: 844, mobile: true, width: 390 }
const viewportLabel = desktop ? '1440x900 @1x' : '390x844 @3x'
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

async function waitForSelector(session) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const result = await session.send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('[data-fairlend-route-selector]'))`,
      returnByValue: true,
    })

    if (result.result.value === true) return
    await delay(100)
  }

  throw new Error('Route selector did not render within 10 seconds.')
}

const profileExpression = String.raw`
  (async () => {
    const section = document.querySelector('[data-fairlend-route-selector]');
    if (!(section instanceof HTMLElement)) throw new Error('Route selector not found.');

    await (document.fonts?.ready ?? Promise.resolve());
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const sectionStyle = getComputedStyle(section);
    const sectionRect = section.getBoundingClientRect();
    const fullSectionLayers = [...section.children].filter((child) => {
      if (!(child instanceof HTMLElement)) return false;
      const style = getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      return style.position === 'absolute' && rect.height >= sectionRect.height * 0.9;
    });
    const visibleElement = (element) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number.parseFloat(style.opacity || '1') > 0.95 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    window.scrollTo({ behavior: 'instant', top: Math.max(0, section.offsetTop - 72) });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const mobilePaintRisk =
      sectionRect.height > innerHeight * 2 &&
      sectionStyle.isolation === 'isolate' &&
      sectionStyle.overflowY === 'hidden';
    const title = section.querySelector('h2');
    const serverFrameReady = {
      card: visibleElement(section.querySelector('article')),
      description: visibleElement(title?.parentElement?.nextElementSibling),
      title: visibleElement(title),
    };
    const serverFrameIsComplete = Object.values(serverFrameReady).every(Boolean);

    return {
      computed: {
        backgroundRepeat: sectionStyle.backgroundRepeat,
        backgroundSize: sectionStyle.backgroundSize,
        fullSectionLayers: fullSectionLayers.length,
        isolation: sectionStyle.isolation,
        overflowY: sectionStyle.overflowY,
        sectionHeightPx: Math.round(sectionRect.height),
        viewportHeightPx: innerHeight,
      },
      mobilePaintRisk,
      serverFrameReady,
      verdict: !mobilePaintRisk && serverFrameIsComplete ? 'PASS' : 'FAIL',
    };
  })()
`

async function main() {
  const profileDirectory = await mkdtemp(join(tmpdir(), 'fairlend-route-profile-'))
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
    const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
    if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`)

    const target = await response.json()
    session = new DevToolsSession(target.webSocketDebuggerUrl)
    await session.connect()
    await Promise.all([
      session.send('Page.enable'),
      session.send('Network.enable'),
      session.send('Runtime.enable'),
    ])
    await session.send('Network.setCacheDisabled', { cacheDisabled: true })
    await session.send('Emulation.setDeviceMetricsOverride', {
      ...viewport,
    })
    await session.send(
      'Emulation.setTouchEmulationEnabled',
      desktop ? { enabled: false } : { enabled: true, maxTouchPoints: 5 },
    )
    await session.send('Page.navigate', { url: targetUrl })
    await waitForSelector(session)

    const evaluation = await session.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: profileExpression,
      returnByValue: true,
    })
    const result = evaluation.result.value

    console.log(JSON.stringify({ ...result, url: targetUrl, viewport: viewportLabel }, null, 2))
    if (result.verdict !== 'PASS') process.exitCode = 1
  } finally {
    session?.close()
    if (chrome.exitCode === null) {
      chrome.kill('SIGTERM')
      await Promise.race([once(chrome, 'exit'), delay(2_000)])
    }
    await rm(profileDirectory, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 })
  }
}

await main()
