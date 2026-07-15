import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getCanonicalOrigin } from '@/utilities/seo'
import { FAIRLEND_DEMO_POST_SLUGS } from '@/lib/fairlend-posts'
import { buildPagesSitemapEntries } from '@/lib/pages-sitemap'

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

    const latestPostResult = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1,
      sort: '-updatedAt',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            slug: {
              not_in: [...FAIRLEND_DEMO_POST_SLUGS],
            },
          },
        ],
      },
      select: {
        updatedAt: true,
      },
    })

    const latestPostUpdatedAt = latestPostResult.docs[0]?.updatedAt

    return buildPagesSitemapEntries({
      cmsPages: results.docs,
      latestPostUpdatedAt,
      siteUrl: SITE_URL,
    })
  },
  ['pages-sitemap-v4'],
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
