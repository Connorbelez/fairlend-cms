const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
const productionUrl = 'https://www.fairlend.ca'
const isLocalUrl = (value) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value)
const rawSiteUrl = (
  configuredUrl && !isLocalUrl(configuredUrl)
    ? configuredUrl
    : vercelProductionUrl
      ? `https://${vercelProductionUrl}`
      : productionUrl
).replace(/\/+$/, '')
const siteUrlObject = new URL(rawSiteUrl)

if (siteUrlObject.hostname === 'fairlend.ca') {
  siteUrlObject.hostname = 'www.fairlend.ca'
}

const SITE_URL = siteUrlObject.toString().replace(/\/+$/, '')
const blockedCrawlerPaths = ['/admin/', '/api/', '/next/preview', '/exit-preview']

if (!SITE_URL) {
  throw new Error('NEXT_PUBLIC_SERVER_URL or VERCEL_PROJECT_PRODUCTION_URL is required')
}

if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(SITE_URL) || SITE_URL.includes('example.com')) {
  throw new Error('Sitemap generation requires a production canonical origin')
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: blockedCrawlerPaths,
      },
      { userAgent: 'Googlebot', allow: '/', disallow: blockedCrawlerPaths },
      { userAgent: 'Bingbot', allow: '/', disallow: blockedCrawlerPaths },
      { userAgent: 'DuckDuckBot', allow: '/', disallow: blockedCrawlerPaths },
      { userAgent: 'Applebot', allow: '/', disallow: blockedCrawlerPaths },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: blockedCrawlerPaths },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
