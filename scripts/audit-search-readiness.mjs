#!/usr/bin/env node

const requestedOrigin = process.argv[2] || process.env.SEO_AUDIT_ORIGIN || 'https://www.fairlend.ca'
const origin = new URL(requestedOrigin)
const canonicalOrigin = new URL(process.env.SEO_CANONICAL_ORIGIN || origin.origin)
const deploymentBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim()

if (origin.protocol !== 'https:') {
  throw new Error('SEO release audit requires an HTTPS origin')
}

origin.pathname = '/'
origin.search = ''
origin.hash = ''
canonicalOrigin.pathname = '/'
canonicalOrigin.search = ''
canonicalOrigin.hash = ''

const isPreviewAudit = origin.origin !== canonicalOrigin.origin

const errors = []
const warnings = []
const inspected = []
const forbiddenSitemapPatterns = [
  /money-page-blocks-qa/i,
  /\/posts\/(digital-horizons|global-gaze|dollar-and-sense-the-financial-forecast)$/i,
  /\/(admin|api|intake|search|start\/builder)(\/|$)/i,
  /[?&#]/,
]

const expectedRemovedPaths = [
  '/money-page-blocks-qa-2026-07-12',
  '/posts/digital-horizons',
  '/posts/global-gaze',
  '/posts/dollar-and-sense-the-financial-forecast',
  '/fairlend-landing-hero',
]

await auditCrawlerAccess()
await auditMachineReadableContent()
const sitemapUrls = await collectSitemapUrls(new URL('/sitemap.xml', origin).toString())

for (const url of sitemapUrls) {
  await auditSitemapPage(url)
}

if (!isPreviewAudit) {
  for (const path of expectedRemovedPaths) {
    await expectStatus(path, [404, 410], 'removed QA/demo URL')
  }

  await expectStatus('/r/not-a-configured-campaign', [404, 410], 'unknown campaign URL')
}

console.log(
  JSON.stringify(
    {
      errors,
      canonicalOrigin: canonicalOrigin.origin,
      inspectedSitemapPages: inspected.length,
      origin: origin.origin,
      result: errors.length === 0 ? 'PASS' : 'FAIL',
      warnings,
    },
    null,
    2,
  ),
)

if (errors.length > 0) process.exitCode = 1

async function auditCrawlerAccess() {
  const robotsUrl = new URL('/robots.txt', origin).toString()
  const robots = await auditFetch(robotsUrl, { redirect: 'manual' })
  const body = await robots.text()

  if (robots.status !== 200) errors.push(`${robotsUrl} returned ${robots.status}`)
  if (!body.includes(`Sitemap: ${canonicalOrigin.origin}/sitemap.xml`)) {
    errors.push('robots.txt does not declare the authoritative root sitemap')
  }

  const crawlers = [
    'Googlebot',
    'Bingbot',
    'DuckDuckBot',
    'Applebot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'GPTBot',
    'Claude-SearchBot',
    'Claude-User',
    'ClaudeBot',
    'PerplexityBot',
    'Perplexity-User',
  ]

  for (const crawler of crawlers) {
    if (!new RegExp(`User-agent:\\s*${escapeRegExp(crawler)}(?:\\s|$)`, 'i').test(body)) {
      errors.push(`robots.txt does not explicitly declare ${crawler}`)
    }

    const response = await auditFetch(origin, {
      headers: { 'User-Agent': `${crawler} FairLendReleaseAudit/1.0` },
      redirect: 'manual',
    })

    if (response.status !== 200) {
      errors.push(`${crawler} received HTTP ${response.status} for ${origin}`)
    }
  }
}

async function auditMachineReadableContent() {
  const homepage = await auditFetch(origin, {
    headers: { 'User-Agent': 'OAI-SearchBot FairLendReleaseAudit/1.0' },
  })
  const html = await homepage.text()

  if (homepage.status !== 200) {
    errors.push(`machine-readable homepage returned ${homepage.status}`)
    return
  }

  const requiredStaticSignals = [
    'data-fairlend-static-fallback',
    'Where would you like to go with FairLend?',
    'The FairLend build model',
    'The team behind the file.',
    'Frequently asked questions',
  ]

  for (const signal of requiredStaticSignals) {
    if (!html.includes(signal)) {
      errors.push(`homepage initial HTML is missing static signal: ${signal}`)
    }
  }

  for (const path of ['/llms.txt', '/llms-full.txt']) {
    if (!html.includes(path)) errors.push(`homepage does not advertise ${path}`)

    const url = new URL(path, origin)
    const response = await auditFetch(url, {
      headers: { 'User-Agent': 'ChatGPT-User FairLendReleaseAudit/1.0' },
    })
    const body = await response.text()

    if (response.status !== 200) errors.push(`${url} returned ${response.status}`)
    if (!response.headers.get('content-type')?.startsWith('text/plain')) {
      errors.push(`${url} does not return text/plain`)
    }
    if (body.length < (path === '/llms-full.txt' ? 8_000 : 2_000)) {
      errors.push(`${url} is unexpectedly thin (${body.length} characters)`)
    }
  }

  if (!html.includes('"@type":"ItemList"')) {
    errors.push('homepage initial HTML is missing the financing-route ItemList JSON-LD')
  }
}

async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return []
  seen.add(sitemapUrl)

  const response = await auditFetch(toAuditUrl(sitemapUrl), { redirect: 'manual' })
  const xml = await response.text()

  if (response.status !== 200) {
    errors.push(`${sitemapUrl} returned ${response.status}`)
    return []
  }

  const locations = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim()),
  )

  if (/<sitemapindex[\s>]/i.test(xml)) {
    const nested = []
    for (const location of locations) nested.push(...(await collectSitemapUrls(location, seen)))
    return [...new Set(nested)]
  }

  return [...new Set(locations)]
}

async function auditSitemapPage(urlString) {
  let url

  try {
    url = new URL(urlString)
  } catch {
    errors.push(`Invalid sitemap URL: ${urlString}`)
    return
  }

  if (url.protocol !== 'https:' || url.origin !== canonicalOrigin.origin) {
    errors.push(`Non-canonical sitemap origin: ${urlString}`)
  }

  if (forbiddenSitemapPatterns.some((pattern) => pattern.test(`${url.pathname}${url.search}`))) {
    errors.push(`Forbidden sitemap URL: ${urlString}`)
  }

  const response = await auditFetch(toAuditUrl(url), { redirect: 'manual' })
  const html = await response.text()
  inspected.push(urlString)

  if (response.status !== 200) {
    errors.push(`${urlString} returned ${response.status}; sitemap URLs must return 200`)
    return
  }

  if (!isPreviewAudit && response.headers.get('x-robots-tag')?.toLowerCase().includes('noindex')) {
    errors.push(`${urlString} sends X-Robots-Tag: noindex`)
  }

  const robotsMeta = matchTagContent(html, 'meta', 'name', 'robots')
  if (robotsMeta?.toLowerCase().includes('noindex')) {
    errors.push(`${urlString} contains a robots noindex directive`)
  }

  const canonicalHref = matchLinkHref(html, 'canonical')
  if (!canonicalHref) {
    errors.push(`${urlString} has no canonical link`)
  } else if (new URL(canonicalHref, url).toString() !== url.toString()) {
    errors.push(`${urlString} declares a different canonical: ${canonicalHref}`)
  }

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  if (!title) errors.push(`${urlString} has no meaningful title`)
  if (!/<h1[\s>]/i.test(html)) errors.push(`${urlString} has no rendered H1`)

  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length < 250) warnings.push(`${urlString} has less than 250 characters of body text`)
  if (!/<a\s[^>]*href=/i.test(html)) errors.push(`${urlString} has no rendered internal links`)
}

async function expectStatus(path, statuses, label) {
  const url = new URL(path, origin)
  const response = await auditFetch(url, { redirect: 'manual' })
  if (!statuses.includes(response.status)) {
    errors.push(`${label} ${url} returned ${response.status}; expected ${statuses.join(' or ')}`)
  }
}

function matchTagContent(html, tagName, attribute, value) {
  const tag = html.match(
    new RegExp(`<${tagName}\\b[^>]*${attribute}=["']${value}["'][^>]*>`, 'i'),
  )?.[0]
  return tag?.match(/content=["']([^"']*)["']/i)?.[1] || null
}

function matchLinkHref(html, rel) {
  const tag = html.match(new RegExp(`<link\\b[^>]*rel=["']${rel}["'][^>]*>`, 'i'))?.[0]
  return tag?.match(/href=["']([^"']+)["']/i)?.[1] || null
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function auditFetch(input, init = {}) {
  const headers = new Headers(init.headers)

  if (deploymentBypassSecret) {
    headers.set('x-vercel-protection-bypass', deploymentBypassSecret)
  }

  return fetch(input, { ...init, headers })
}

function toAuditUrl(input) {
  const url = new URL(input)

  if (isPreviewAudit && url.origin === canonicalOrigin.origin) {
    return new URL(`${url.pathname}${url.search}${url.hash}`, origin)
  }

  return url
}
