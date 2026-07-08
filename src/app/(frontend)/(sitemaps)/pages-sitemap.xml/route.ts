import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const staticIndexableRoutes = [
  '/',
  '/affordable-sustainable-rental-housing',
  '/borrowers/private-mortgage-financing',
  '/construction-draw-financing',
  '/en/brokerage/privacy-policy',
  '/garden-suite-financing-gta',
  '/garden-suite',
  '/investing/private-mortgage-lending',
  '/multiplex-financing-gta',
  '/partners',
  '/posts',
]

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getSitemapSiteUrl()

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const staticSitemap = staticIndexableRoutes.map((route) => ({
      loc: route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`,
    }))

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
              lastmod: page.updatedAt,
            }
          })
      : []

    return Array.from(
      [...staticSitemap, ...sitemap]
        .reduce((entries, entry) => {
          entries.set(entry.loc, entry)
          return entries
        }, new Map<string, { lastmod?: string; loc: string }>())
        .values(),
    )
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}

function getSitemapSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const siteUrl = configuredUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : '')

  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SERVER_URL or VERCEL_PROJECT_PRODUCTION_URL is required')
  }

  return siteUrl.replace(/\/+$/, '')
}
