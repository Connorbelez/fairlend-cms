export const FAIRLEND_TOMBSTONED_PAGE_SLUGS = new Set(['fairlend-landing-hero'])

export const FAIRLEND_SITEMAP_EXCLUDED_PAGE_SLUGS = new Set([
  ...FAIRLEND_TOMBSTONED_PAGE_SLUGS,
  'cmhc-mli-select-multiplex-financing',
  'construction-draws-small-builders',
  'contact',
  'money-page-blocks-qa-2026-07-12',
  'resources/construction-draws-small-builders',
])

export function isFairlendTombstonedPageSlug(slug: string): boolean {
  return FAIRLEND_TOMBSTONED_PAGE_SLUGS.has(slug)
}

export function isFairlendTombstonedPublicPath(path: string): boolean {
  const normalizedPath = path.split(/[?#]/, 1)[0]?.replace(/^\/+|\/+$/g, '') || ''
  return isFairlendTombstonedPageSlug(normalizedPath)
}
