import { describe, expect, it } from 'vitest'

import {
  buildFairlendIntakeHref,
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
})
