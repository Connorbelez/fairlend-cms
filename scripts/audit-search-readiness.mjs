#!/usr/bin/env node

const requestedOrigin = process.argv[2] || process.env.SEO_AUDIT_ORIGIN || 'https://www.fairlend.ca'
const origin = new URL(requestedOrigin)

if (origin.protocol !== 'https:') {
  throw new Error('SEO release audit requires an HTTPS origin')
}

origin.pathname = '/'
origin.search = ''
origin.hash = ''

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
const sitemapUrls = await collectSitemapUrls(new URL('/sitemap.xml', origin).toString())

for (const url of sitemapUrls) {
  await auditSitemapPage(url)
}

for (const path of expectedRemovedPaths) {
  await expectStatus(path, [404, 410], 'removed QA/demo URL')
}

await expectStatus('/r/not-a-configured-campaign', [404, 410], 'unknown campaign URL')

console.log(
  JSON.stringify(
    {
      errors,
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
  const robots = await fetch(robotsUrl, { redirect: 'manual' })
  const body = await robots.text()

  if (robots.status !== 200) errors.push(`${robotsUrl} returned ${robots.status}`)
  if (!body.includes(`Sitemap: ${origin.origin}/sitemap.xml`)) {
    errors.push('robots.txt does not declare the authoritative root sitemap')
  }

  const crawlers = ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot', 'OAI-SearchBot']

  for (const crawler of crawlers) {
    const response = await fetch(origin, {
      headers: { 'User-Agent': `${crawler} FairLendReleaseAudit/1.0` },
      redirect: 'manual',
    })

    if (response.status !== 200) {
      errors.push(`${crawler} received HTTP ${response.status} for ${origin}`)
    }
  }
}

async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return []
  seen.add(sitemapUrl)

  const response = await fetch(sitemapUrl, { redirect: 'manual' })
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

  if (url.protocol !== 'https:' || url.origin !== origin.origin) {
    errors.push(`Non-canonical sitemap origin: ${urlString}`)
  }

  if (forbiddenSitemapPatterns.some((pattern) => pattern.test(`${url.pathname}${url.search}`))) {
    errors.push(`Forbidden sitemap URL: ${urlString}`)
  }

  const response = await fetch(url, { redirect: 'manual' })
  const html = await response.text()
  inspected.push(urlString)

  if (response.status !== 200) {
    errors.push(`${urlString} returned ${response.status}; sitemap URLs must return 200`)
    return
  }

  if (response.headers.get('x-robots-tag')?.toLowerCase().includes('noindex')) {
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
  const response = await fetch(url, { redirect: 'manual' })
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
