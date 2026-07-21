export type StaticSitemapRoute = {
  lastmod: string
  path: `/${string}`
}

/**
 * Source-controlled pages do not have a CMS updatedAt value. Their lastmod is the
 * date of the latest committed content change to the route source. CMS records
 * replace matching entries in the sitemap with their authoritative updatedAt.
 */
export const staticIndexableRoutes = [
  { lastmod: '2026-07-14', path: '/' },
  { lastmod: '2026-07-09', path: '/affordable-sustainable-rental-housing' },
  { lastmod: '2026-07-14', path: '/borrowers' },
  { lastmod: '2026-07-14', path: '/borrowers/institutional-mortgage' },
  { lastmod: '2026-07-14', path: '/borrowers/private-mortgage-financing' },
  { lastmod: '2026-07-09', path: '/construction-draw-financing' },
  { lastmod: '2026-07-21', path: '/construction-financing' },
  { lastmod: '2026-07-14', path: '/contact' },
  { lastmod: '2026-07-14', path: '/disclosures' },
  { lastmod: '2026-07-14', path: '/en/brokerage/privacy-policy' },
  { lastmod: '2026-07-27', path: '/garden-suite-financing-gta' },
  { lastmod: '2026-07-09', path: '/garden-suite' },
  { lastmod: '2026-07-14', path: '/investing' },
  { lastmod: '2026-07-14', path: '/investing/private-mortgage-lending' },
  { lastmod: '2026-07-09', path: '/multiplex-financing-gta' },
  { lastmod: '2026-07-14', path: '/partners' },
  { lastmod: '2026-07-14', path: '/posts' },
  { lastmod: '2026-07-14', path: '/terms' },
] as const satisfies readonly StaticSitemapRoute[]
