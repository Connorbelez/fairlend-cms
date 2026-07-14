import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getCanonicalUrl } from '@/utilities/seo'
import { buildContactPageJsonLd, fairlendOrganizationJsonLd } from '@/utilities/structuredData'

const originalServerUrl = process.env.NEXT_PUBLIC_SERVER_URL

describe('FairLend SEO readiness metadata', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://fairlend.ca'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = originalServerUrl
  })

  it('normalizes apex URLs to the authoritative www canonical host', () => {
    expect(getCanonicalUrl('/contact')).toBe('https://www.fairlend.ca/contact')
  })

  it('keeps visible contact facts aligned with the Organization graph', () => {
    expect(fairlendOrganizationJsonLd()).toMatchObject({
      '@id': 'https://www.fairlend.ca/#organization',
      '@type': ['Organization', 'FinancialService'],
      contactPoint: {
        contactType: 'mortgage inquiries',
        email: 'elie@fairlend.ca',
        telephone: '+1-647-831-7605',
      },
      legalName: 'Fairlend Management Inc.',
      logo: 'https://www.fairlend.ca/assets/fairlend/fairlend-logo.svg',
      name: 'FairLend Mortgage',
      telephone: '+1-647-831-7605',
    })
  })

  it('describes the contact route as a canonical ContactPage', () => {
    expect(buildContactPageJsonLd()).toMatchObject({
      '@id': 'https://www.fairlend.ca/contact#webpage',
      '@type': 'ContactPage',
      url: 'https://www.fairlend.ca/contact',
    })
  })
})
