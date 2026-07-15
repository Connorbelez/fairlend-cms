import { FAIRLEND_SITEMAP_EXCLUDED_PAGE_SLUGS } from '@/lib/fairlend-routes'
import { staticIndexableRoutes } from '@/lib/static-sitemap-routes'

export type PageSitemapEntry = {
  lastmod: string
  loc: string
}

type CmsPageSitemapSource = {
  slug?: null | string
  updatedAt: string
}

export function buildPagesSitemapEntries({
  cmsPages,
  latestPostUpdatedAt,
  siteUrl,
}: {
  cmsPages: CmsPageSitemapSource[]
  latestPostUpdatedAt?: null | string
  siteUrl: string
}): PageSitemapEntry[] {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '')
  const staticSitemap = staticIndexableRoutes.map(({ lastmod, path }) => ({
    lastmod: path === '/posts' ? getLatestLastmod(latestPostUpdatedAt, lastmod) : lastmod,
    loc: path === '/' ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}${path}`,
  }))
  const staticLocations = new Set(staticSitemap.map(({ loc }) => loc))

  const cmsSitemap = cmsPages.flatMap((page) => {
    if (!page.slug || FAIRLEND_SITEMAP_EXCLUDED_PAGE_SLUGS.has(page.slug)) {
      return []
    }

    const loc = page.slug === 'home' ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}/${page.slug}`

    return staticLocations.has(loc) ? [] : [{ lastmod: page.updatedAt, loc }]
  })

  return [...staticSitemap, ...cmsSitemap]
}

function getLatestLastmod(candidate: null | string | undefined, baseline: string): string {
  if (!candidate) {
    return baseline
  }

  const candidateTime = Date.parse(candidate)
  const baselineTime = Date.parse(baseline)

  return Number.isFinite(candidateTime) && candidateTime > baselineTime ? candidate : baseline
}
