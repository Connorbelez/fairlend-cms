import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type AnalyticsModule = typeof import('@/lib/analytics/events')

const analyticsEnv = {
  NEXT_PUBLIC_ANALYTICS_DISABLED: 'false',
  NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT: 'true',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-FAIRLEND',
  NEXT_PUBLIC_GOOGLE_ADS_ID: 'AW-FAIRLEND',
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL: 'lead-label',
  NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID: '123456',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_test',
}

async function importAnalytics(): Promise<AnalyticsModule> {
  vi.resetModules()
  Object.assign(process.env, analyticsEnv)
  return import('@/lib/analytics/events')
}

function setConsent(consent: { analytics: boolean; marketing: boolean }): void {
  window.localStorage.setItem(
    'fairlend.analytics-consent.v1',
    JSON.stringify({
      ...consent,
      updatedAt: '2026-07-08T00:00:00.000Z',
      version: 1,
    }),
  )
}

function installLocalStorage(): void {
  const storage = new Map<string, string>()

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => {
        storage.delete(key)
      },
      setItem: (key: string, value: string) => {
        storage.set(key, value)
      },
    },
  })
}

function installVendorGlobals() {
  const posthogCapture = vi.fn()
  const gtag = vi.fn()
  const fbq = vi.fn()
  const lintrk = vi.fn()
  const dataLayer: unknown[] = []
  const uetq: unknown[] = []

  window.dataLayer = dataLayer
  window.fbq = fbq
  window.gtag = gtag
  window.lintrk = lintrk
  window.posthog = { capture: posthogCapture }
  window.uetq = uetq as Array<Record<string, unknown> | unknown[]>

  return {
    dataLayer,
    fbq,
    gtag,
    lintrk,
    posthogCapture,
    uetq,
  }
}

describe('FairLend analytics events', () => {
  beforeEach(() => {
    installLocalStorage()
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    window.localStorage.clear()
    delete window.dataLayer
    delete window.fbq
    delete window.gtag
    delete window.lintrk
    delete window.posthog
    delete window.uetq
  })

  it('does not send vendor events before optional consent is granted', async () => {
    const { trackLeadSubmitted } = await importAnalytics()
    const vendors = installVendorGlobals()

    trackLeadSubmitted({
      email: 'borrower@example.com',
      intent: 'mortgage',
      phone: '555-555-5555',
      source: 'homepage',
    })

    expect(vendors.dataLayer).toHaveLength(0)
    expect(vendors.posthogCapture).not.toHaveBeenCalled()
    expect(vendors.gtag).not.toHaveBeenCalled()
    expect(vendors.fbq).not.toHaveBeenCalled()
    expect(vendors.lintrk).not.toHaveBeenCalled()
    expect(vendors.uetq).toHaveLength(0)
  })

  it('sends analytics events without ad pixels when only analytics consent is granted', async () => {
    setConsent({ analytics: true, marketing: false })
    const { trackLeadSubmitted } = await importAnalytics()
    const vendors = installVendorGlobals()

    trackLeadSubmitted({
      email: 'borrower@example.com',
      intent: 'mortgage',
      phone: '555-555-5555',
      source: 'intake',
    })

    expect(vendors.dataLayer).toEqual([
      {
        event: 'fairlend_lead_submitted',
        intent: 'mortgage',
        source: 'intake',
      },
    ])
    expect(vendors.posthogCapture).toHaveBeenCalledWith('fairlend_lead_submitted', {
      intent: 'mortgage',
      source: 'intake',
    })
    expect(vendors.gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      intent: 'mortgage',
      source: 'intake',
    })
    expect(vendors.fbq).not.toHaveBeenCalled()
    expect(vendors.lintrk).not.toHaveBeenCalled()
    expect(vendors.uetq).toHaveLength(0)
  })

  it('sends retargeting conversions without leaking sensitive lead fields', async () => {
    setConsent({ analytics: true, marketing: true })
    const { trackLeadSubmitted } = await importAnalytics()
    const vendors = installVendorGlobals()

    trackLeadSubmitted({
      address: '123 Main Street',
      amountNeeded: '500000',
      email: 'borrower@example.com',
      intent: 'consultation',
      message: 'Private file details',
      name: 'Borrower Name',
      phone: '555-555-5555',
      propertyValue: '1000000',
      source: 'borrowers-page',
      step: 'borrower_consultation_submit',
    })

    const safeProperties = {
      intent: 'consultation',
      source: 'borrowers-page',
      step: 'borrower_consultation_submit',
    }

    expect(vendors.posthogCapture).toHaveBeenCalledWith(
      'fairlend_lead_submitted',
      safeProperties,
    )
    expect(vendors.gtag).toHaveBeenCalledWith('event', 'generate_lead', safeProperties)
    expect(vendors.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-FAIRLEND/lead-label',
    })
    expect(vendors.fbq).toHaveBeenCalledWith('track', 'Lead', safeProperties)
    expect(vendors.lintrk).toHaveBeenCalledWith('track', { conversion_id: '123456' })
    expect(vendors.uetq).toEqual([
      {
        ea: 'fairlend_lead_submitted',
        ec: 'lead',
        el: 'consultation',
        event: 'fairlend_lead_submitted',
      },
    ])
    expect(vendors.dataLayer[0]).toEqual({
      event: 'fairlend_lead_submitted',
      ...safeProperties,
    })
  })
})
