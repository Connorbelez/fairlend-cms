import { beforeEach, describe, expect, it, vi } from 'vitest'

import { classifyFairlendRoute } from '@/lib/analytics/routes'
import {
  readAllowlistedCampaignProperties,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsProperties,
  sanitizePostHogEvent,
} from '@/lib/analytics/sanitize'

describe('FairLend analytics privacy contract', () => {
  it('removes query strings and fragments from URLs', () => {
    expect(sanitizeAnalyticsPath('https://fairlend.ca/intake?email=a%40b.ca#contact')).toBe(
      '/intake',
    )
  })

  it('drops PII, financial values, database identifiers, objects, and unexpected numeric values', () => {
    expect(
      sanitizeAnalyticsProperties({
        answer: 'private answer',
        email: 'borrower@example.com',
        firstName: 'Borrower',
        leadId: 'd9428888-122b-4b64-b9fe-88e9d0e34966',
        loan_amount: 500_000,
        metadata: { nested: 'object' },
        page_path: '/intake?propertyValue=1000000',
        source: 'homepage',
        step_number: 2,
      }),
    ).toEqual({ page_path: '/intake', source: 'homepage', step_number: 2 })
  })

  it('allows only bounded campaign values and rejects contact-like values', () => {
    expect(
      readAllowlistedCampaignProperties(
        '?utm_source=linkedin&utm_campaign=builders&email=person%40example.com&source=person%40example.com',
      ),
    ).toEqual({ utm_campaign: 'builders', utm_source: 'linkedin' })
  })

  it('sanitizes PostHog automatic URL and property fields', () => {
    expect(
      sanitizePostHogEvent({
        event: '$pageview',
        properties: {
          $current_url: 'https://fairlend.ca/borrowers?utm_source=private',
          email: 'person@example.com',
          page_path: '/borrowers?intent=mortgage',
        },
      }),
    ).toEqual({
      event: '$pageview',
      properties: { $current_url: '/borrowers', page_path: '/borrowers' },
    })
  })

  it('classifies stable routes without query data', () => {
    expect(classifyFairlendRoute('/start/mortgage?source=homepage')).toEqual({
      content_group: 'conversion',
      page_path: '/start/mortgage',
      page_type: 'intake',
    })
    expect(classifyFairlendRoute('/borrowers/private-mortgage')).toMatchObject({
      content_group: 'borrowers',
      page_type: 'mortgage_product',
    })
  })
})

describe('FairLend server analytics identity', () => {
  beforeEach(() => {
    vi.stubEnv('POSTHOG_PERSON_ID_SALT', 'test-only-analytics-secret-that-is-long-enough')
  })

  it('derives stable pseudonymous identities and idempotent lifecycle IDs', async () => {
    const {
      createAnalyticsRevocationToken,
      deriveLeadAnalyticsDistinctId,
      deriveLifecycleInsertId,
      verifyAnalyticsRevocationToken,
    } = await import('@/lib/analytics/server')
    const leadId = 'd9428888-122b-4b64-b9fe-88e9d0e34966'

    expect(deriveLeadAnalyticsDistinctId(leadId)).toBe(deriveLeadAnalyticsDistinctId(leadId))
    expect(deriveLeadAnalyticsDistinctId(leadId)).not.toContain(leadId)
    expect(deriveLifecycleInsertId(leadId, 'fairlend_lead_qualified')).toBe(
      deriveLifecycleInsertId(leadId, 'fairlend_lead_qualified'),
    )
    const token = createAnalyticsRevocationToken(leadId)
    expect(verifyAnalyticsRevocationToken(token)).toBe(leadId)
    expect(verifyAnalyticsRevocationToken(`${token}tampered`)).toBeNull()
  })
})

describe('FairLend typed event contract', () => {
  it('rejects undeclared and PII event properties at compile time', async () => {
    const { trackFairlendEvent } = await import('@/lib/analytics/events')
    if (false) {
      trackFairlendEvent('fairlend_lead_submitted', {
        // @ts-expect-error email is deliberately absent from the analytics contract.
        email: 'private@example.com',
        form_id: 'test',
        journey_type: 'contact',
      })
    }
    expect(trackFairlendEvent).toBeTypeOf('function')
  })
})
