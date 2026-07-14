export const FAIRLEND_DEMO_POST_SLUGS = [
  'digital-horizons',
  'global-gaze',
  'dollar-and-sense-the-financial-forecast',
] as const

export function isFairlendDemoPostSlug(slug: string): boolean {
  return (FAIRLEND_DEMO_POST_SLUGS as readonly string[]).includes(slug)
}
