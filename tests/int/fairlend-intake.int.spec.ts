import { describe, expect, it } from 'vitest'

import {
  buildFairlendBuildHref,
  buildFairlendConsultationHref,
  buildFairlendContactHref,
  buildFairlendIntakeHref,
  buildFairlendInvestorHref,
  buildFairlendMortgageHref,
  buildFairlendNewsletterHref,
  buildFairlendPartnerHref,
  buildFairlendRouteHelperHref,
  isFairlendGenericLeadIntent,
  normalizeFairlendIntakeIntent,
} from '@/lib/fairlend-intake'

describe('Fairlend intake routing helpers', () => {
  it('normalizes build aliases to DrawFlow build intake', () => {
    expect(normalizeFairlendIntakeIntent(null)).toBe('build')
    expect(normalizeFairlendIntakeIntent('construction')).toBe('build')
    expect(normalizeFairlendIntakeIntent('construction-financing')).toBe('build')
  })

  it('treats non-build CTA intents as generic lead intakes', () => {
    expect(isFairlendGenericLeadIntent('partner-project')).toBe(true)
    expect(isFairlendGenericLeadIntent('mortgage')).toBe(true)
    expect(isFairlendGenericLeadIntent('build')).toBe(false)
  })

  it('builds source-tracked intake links with prefill params', () => {
    expect(
      buildFairlendIntakeHref({
        email: 'owner@example.com',
        intent: 'mortgage',
        leadId: '3dc0811f-139b-49a9-a0d7-6ef364c9a40f',
        source: 'route-selector-private-mortgage',
      }),
    ).toBe(
      '/intake?intent=mortgage&email=owner%40example.com&leadId=3dc0811f-139b-49a9-a0d7-6ef364c9a40f&source=route-selector-private-mortgage',
    )
  })

  it('builds named action CTA hrefs with intent and unique source', () => {
    expect(buildFairlendContactHref('header-nav-contact')).toBe(
      '/intake?intent=contact&source=header-nav-contact',
    )
    expect(buildFairlendConsultationHref('footer-book-consultation')).toBe(
      '/intake?intent=consultation&source=footer-book-consultation',
    )
    expect(buildFairlendInvestorHref('investor-final-cta')).toBe(
      '/intake?intent=invest&source=investor-final-cta',
    )
    expect(buildFairlendMortgageHref('borrower-hero-specialist')).toBe(
      '/intake?intent=mortgage&source=borrower-hero-specialist',
    )
    expect(buildFairlendBuildHref('header-nav-builder-intake')).toBe(
      '/intake?intent=build&source=header-nav-builder-intake',
    )
    expect(buildFairlendPartnerHref('route-selector-partner-program')).toBe(
      '/intake?intent=partner-apply&source=route-selector-partner-program',
    )
    expect(buildFairlendRouteHelperHref('footer-start-application')).toBe(
      '/intake?intent=route-helper&source=footer-start-application',
    )
    expect(buildFairlendNewsletterHref('footer-newsletter')).toBe(
      '/intake?intent=newsletter&source=footer-newsletter',
    )
  })
})
