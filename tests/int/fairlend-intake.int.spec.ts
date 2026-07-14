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
  fairlendRentalPropertyAcquisitionHeaderSource,
  fairlendRentalPropertyRefinanceHeaderSource,
  isFairlendGenericLeadIntent,
  normalizeFairlendIntakeIntent,
  normalizeFairlendProjectScope,
  resolveFairlendBuildIntakeVariant,
  resolveFairlendIntakeIntent,
  resolveFairlendRentalPropertyTransaction,
} from '@/lib/fairlend-intake'
import {
  privateMortgageSituationOptions,
  resolveResidentialMortgageProduct,
} from '@/lib/fairlend-mortgage'

describe('Fairlend intake routing helpers', () => {
  it('covers every reviewed private-loan purpose and keeps each one on the private path', () => {
    expect(privateMortgageSituationOptions).toEqual(
      expect.arrayContaining([
        'Refinance my mortgage',
        'Get a bridge loan',
        'Home Equity Line of Credit (HELOC)',
        'Mortgage-backed financing for my business',
      ]),
    )

    for (const purpose of privateMortgageSituationOptions) {
      expect(resolveResidentialMortgageProduct(purpose)).toBe('private')
    }
  })

  it('normalizes build aliases to DrawFlow build intake', () => {
    expect(normalizeFairlendIntakeIntent(null)).toBe('build')
    expect(normalizeFairlendIntakeIntent('construction')).toBe('build')
    expect(normalizeFairlendIntakeIntent('construction-financing')).toBe('build')
  })

  it('routes the bridge-loan attribution source to residential mortgage intake', () => {
    expect(resolveFairlendIntakeIntent('build', 'landing-overview-bridge-loans')).toBe('mortgage')
    expect(resolveFairlendIntakeIntent('mortgage', 'landing-overview-bridge-loans')).toBe(
      'mortgage',
    )
    expect(resolveFairlendIntakeIntent('build', 'landing-overview-garden-laneway-suites')).toBe(
      'build',
    )
  })

  it('resolves acquisition and refinance homepage sources into the rental-property intake', () => {
    expect(
      resolveFairlendRentalPropertyTransaction(
        'landing-overview-acquisition-existing-rental-properties',
      ),
    ).toBe('acquisition')
    expect(
      resolveFairlendRentalPropertyTransaction(
        'landing-overview-refinancing-existing-rental-properties',
      ),
    ).toBe('refinance')
    expect(resolveFairlendRentalPropertyTransaction('landing-overview-residential-mortgages')).toBe(
      null,
    )
    expect(
      resolveFairlendRentalPropertyTransaction(fairlendRentalPropertyAcquisitionHeaderSource),
    ).toBe('acquisition')
    expect(
      resolveFairlendRentalPropertyTransaction(fairlendRentalPropertyRefinanceHeaderSource),
    ).toBe('refinance')
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

  it('normalizes and serializes project-scope prefills', () => {
    expect(normalizeFairlendProjectScope('multiplex')).toBe('multiplex-financing')
    expect(normalizeFairlendProjectScope('unknown-scope')).toBeNull()
    expect(
      buildFairlendIntakeHref({
        intent: 'build',
        projectScope: 'garden-laneway-suites',
        source: 'landing-overview-garden-laneway-suites',
      }),
    ).toBe(
      '/intake?intent=build&projectScope=garden-laneway-suites&source=landing-overview-garden-laneway-suites',
    )
  })

  it('routes every Garden and Laneway scope alias to the homeowner build variant', () => {
    for (const scope of [
      'garden-laneway-suites',
      'garden-suites',
      'laneway-suites',
      ' GARDEN-LANEWAY-SUITES ',
      'GARDEN-SUITES',
    ]) {
      expect(resolveFairlendBuildIntakeVariant(scope)).toBe('garden-suite-homeowner')
    }

    expect(resolveFairlendBuildIntakeVariant('multiplex-financing')).toBe('builder')
    expect(resolveFairlendBuildIntakeVariant('unknown-scope')).toBe('builder')
    expect(resolveFairlendBuildIntakeVariant(null)).toBe('builder')
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
