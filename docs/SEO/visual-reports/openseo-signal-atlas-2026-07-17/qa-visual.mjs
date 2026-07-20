import { chromium } from 'playwright';

const sourceUrl = process.env.QA_SOURCE_URL ?? 'file:///Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-visual-brief/index.html';
const outputDir = '/Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-visual-brief';
console.error('qa: launching chrome');
const browser = await chromium.launch({
  executablePath: '/Users/connor/.agent-browser/browsers/chrome-151.0.7922.34/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});
console.error('qa: chrome launched');
const results = [];

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  console.error(`qa: opened ${viewport.name} page`);
  const consoleErrors = [];
  const pageErrors = [];
  const badResponses = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  console.error(`qa: loaded ${viewport.name} page`);
  await page.waitForTimeout(1_000);

  const structure = await page.evaluate(() => {
    const sectionIds = [...document.querySelectorAll('section[id]')].map((node) => node.id);
    const navTargets = [...document.querySelectorAll('a[href^="#"]')]
      .map((node) => node.getAttribute('href')?.slice(1))
      .filter(Boolean);
    const missingNavTargets = navTargets.filter((target) => !document.getElementById(target));
    const bodyText = document.body.innerText;
    const overflowingElements = [...document.querySelectorAll('*')]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName.toLowerCase(),
          id: node.id,
          className: typeof node.className === 'string' ? node.className : '',
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
        };
      })
      .filter(({ left, right }) => left < -1 || right > window.innerWidth + 1)
      .slice(0, 20);
    return {
      title: document.title,
      sectionIds,
      navTargets,
      missingNavTargets,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      overflowingElements,
      signalAtlas: {
        renderedRows: document.querySelectorAll('#signal-atlas-body tr').length,
        resultCount: document.getElementById('signal-result-count')?.textContent ?? '',
        activeFilter: document.querySelector('[data-signal-filter][aria-pressed="true"]')?.getAttribute('data-signal-filter') ?? '',
        firstSignals: [...document.querySelectorAll('#signal-atlas-body .signal-query')]
          .slice(0, 6)
          .map((node) => node.textContent?.trim()),
      },
      requiredText: {
        expansion: bodyText.includes('EXPANSION'),
        liveSerps: bodyText.toLowerCase().includes('live serps'),
        disclosedSpend: bodyText.includes('$0.87960'),
        reserve: bodyText.includes('USD 0.12040'),
        drawflowGate: bodyText.includes('Up to 50% interest saved'),
        combinedSignals: bodyText.includes('163 unique signals'),
        expansionRecords: bodyText.includes('130 expansion records'),
        revision: document.querySelector('meta[name="fairlend-brief-revision"]')?.getAttribute('content') === '2026-07-17.2',
      },
    };
  });
  console.error(`qa: evaluated ${viewport.name} page`);

  await page.screenshot({
    path: `${outputDir}/qa-${viewport.name}-hero.png`,
    animations: 'disabled',
    timeout: 10_000,
  });
  console.error(`qa: captured ${viewport.name} hero`);

  for (const sectionId of ['demand', 'expansion', 'live-serps', 'next']) {
    const section = page.locator(`#${sectionId}`);
    if (await section.count()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.screenshot({
        path: `${outputDir}/qa-${viewport.name}-${sectionId}.png`,
        animations: 'disabled',
        timeout: 10_000,
      });
    }
  }

  const atlasControls = page.locator('.signal-controls');
  if (await atlasControls.count()) {
    await atlasControls.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `${outputDir}/qa-${viewport.name}-atlas.png`,
      animations: 'disabled',
      timeout: 10_000,
    });
  }

  results.push({ viewport, structure, consoleErrors, pageErrors, badResponses });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
