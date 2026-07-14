import { sanitizeAnalyticsPath } from './sanitize'

export type FairlendPageType =
  | 'home'
  | 'borrower_hub'
  | 'mortgage_product'
  | 'construction_product'
  | 'investing'
  | 'partner'
  | 'intake'
  | 'contact'
  | 'resource'
  | 'legal'
  | 'other'

export function classifyFairlendRoute(input: string): {
  content_group: string
  page_path: string
  page_type: FairlendPageType
} {
  const page_path = sanitizeAnalyticsPath(input)
  if (page_path === '/') return { content_group: 'marketing', page_path, page_type: 'home' }
  if (page_path === '/borrowers') {
    return { content_group: 'borrowers', page_path, page_type: 'borrower_hub' }
  }
  if (/^\/borrowers\//.test(page_path)) {
    return { content_group: 'borrowers', page_path, page_type: 'mortgage_product' }
  }
  if (/construction|multiplex|garden-suite|mli-select|rental-housing/.test(page_path)) {
    return { content_group: 'construction', page_path, page_type: 'construction_product' }
  }
  if (page_path.startsWith('/investing')) {
    return { content_group: 'investing', page_path, page_type: 'investing' }
  }
  if (page_path.startsWith('/partners')) {
    return { content_group: 'partners', page_path, page_type: 'partner' }
  }
  if (page_path === '/intake' || page_path.startsWith('/start/')) {
    return { content_group: 'conversion', page_path, page_type: 'intake' }
  }
  if (page_path === '/contact') {
    return { content_group: 'conversion', page_path, page_type: 'contact' }
  }
  if (/privacy|terms|disclosure/.test(page_path)) {
    return { content_group: 'legal', page_path, page_type: 'legal' }
  }
  if (/posts|resources|search/.test(page_path)) {
    return { content_group: 'content', page_path, page_type: 'resource' }
  }
  return { content_group: 'other', page_path, page_type: 'other' }
}
