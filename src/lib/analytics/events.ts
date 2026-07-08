'use client'

import { analyticsConfig, analyticsConsentStorageKey, type AnalyticsConsent } from './config'

type AnalyticsProperties = Record<string, boolean | number | string | null | undefined>

const deniedPropertyPattern =
  /(address|amount|balance|city|email|equity|first.?name|last.?name|message|mortgage|name|note|phone|postal|value)/i

const leadEventNames = new Set([
  'fairlend_lead_submitted',
  'fairlend_consultation_submitted',
  'fairlend_contact_submitted',
])

declare global {
  interface Window {
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    lintrk?: (...args: unknown[]) => void
    posthog?: {
      capture?: (eventName: string, properties?: Record<string, unknown>) => void
    }
    uetq?: Array<Record<string, unknown> | unknown[]>
  }
}

function sanitizeProperties(properties: AnalyticsProperties = {}): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (value == null) return false
      return !deniedPropertyPattern.test(key)
    }),
  )
}

function readCurrentConsent(): AnalyticsConsent {
  if (!analyticsConfig.requireConsent) {
    return {
      analytics: true,
      marketing: true,
    }
  }

  try {
    const rawConsent = window.localStorage.getItem(analyticsConsentStorageKey)
    if (!rawConsent) {
      return {
        analytics: false,
        marketing: false,
      }
    }

    const parsed = JSON.parse(rawConsent) as Partial<AnalyticsConsent>

    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    }
  } catch {
    return {
      analytics: false,
      marketing: false,
    }
  }
}

function toGaEventName(eventName: string): string {
  if (leadEventNames.has(eventName)) return 'generate_lead'
  if (eventName === 'fairlend_lead_started') return 'begin_checkout'
  if (eventName === 'fairlend_scheduler_opened') return 'schedule'
  return eventName
}

export function trackFairlendEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
): void {
  if (typeof window === 'undefined' || !analyticsConfig.enabled) return

  const currentConsent = readCurrentConsent()
  const safeProperties = sanitizeProperties(properties)
  const eventPayload = {
    event: eventName,
    ...safeProperties,
  }

  window.dispatchEvent(
    new CustomEvent('fairlend:analytics-event', {
      detail: eventPayload,
    }),
  )

  if (currentConsent.analytics || currentConsent.marketing) {
    window.dataLayer?.push(eventPayload)
  }

  if (currentConsent.analytics) {
    window.posthog?.capture?.(eventName, safeProperties)

    if (window.gtag) {
      window.gtag('event', toGaEventName(eventName), safeProperties)
    }
  }

  if (currentConsent.marketing && window.gtag) {
    if (
      leadEventNames.has(eventName) &&
      analyticsConfig.googleAdsId &&
      analyticsConfig.googleAdsLeadConversionLabel
    ) {
      window.gtag('event', 'conversion', {
        send_to: `${analyticsConfig.googleAdsId}/${analyticsConfig.googleAdsLeadConversionLabel}`,
      })
    }
  }

  if (currentConsent.marketing && window.fbq) {
    if (leadEventNames.has(eventName)) {
      window.fbq('track', 'Lead', safeProperties)
    } else {
      window.fbq('trackCustom', eventName, safeProperties)
    }
  }

  if (
    currentConsent.marketing &&
    leadEventNames.has(eventName) &&
    window.lintrk &&
    analyticsConfig.linkedinLeadConversionId
  ) {
    window.lintrk('track', { conversion_id: analyticsConfig.linkedinLeadConversionId })
  }

  if (currentConsent.marketing && window.uetq) {
    window.uetq.push({
      ec: leadEventNames.has(eventName) ? 'lead' : 'engagement',
      ea: eventName,
      el: String(safeProperties.intent ?? safeProperties.source ?? 'fairlend'),
      event: eventName,
    })
  }
}

export function trackLeadStarted(properties: AnalyticsProperties = {}): void {
  trackFairlendEvent('fairlend_lead_started', properties)
}

export function trackLeadSubmitted(properties: AnalyticsProperties = {}): void {
  trackFairlendEvent('fairlend_lead_submitted', properties)
}

export function trackLeadFailed(properties: AnalyticsProperties = {}): void {
  trackFairlendEvent('fairlend_lead_failed', properties)
}
