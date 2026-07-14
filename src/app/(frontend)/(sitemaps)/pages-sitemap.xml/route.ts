import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getCanonicalOrigin } from '@/utilities/seo'

const staticIndexableRoutes = [
  '/',
  '/affordable-sustainable-rental-housing',
  '/borrowers',
  '/borrowers/institutional-mortgage',
  '/borrowers/private-mortgage-financing',
  '/cmhc-mli-select-multiplex-financing',
  '/construction-draw-financing',
  '/contact',
  '/disclosures',
  '/en/brokerage/privacy-policy',
  '/garden-suite-financing-gta',
  '/garden-suite',
  '/investing',
  '/investing/private-mortgage-lending',
  '/multiplex-financing-gta',
  '/partners',
  '/posts',
  '/resources/construction-draws-small-builders',
  '/terms',
]

const excludedPayloadPageSlugs = new Set(['contact', 'money-page-blocks-qa-2026-07-12'])

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
          .filter((page) => Boolean(page?.slug) && !excludedPayloadPageSlugs.has(page.slug))
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
  return getCanonicalOrigin()
}
