const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
const SITE_URL = (configuredUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : '')).replace(
  /\/+$/,
  '',
)

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
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
