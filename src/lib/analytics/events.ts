'use client'

import {
  analyticsConfig,
  analyticsConsentStorageKey,
  analyticsEventName,
  type AnalyticsConsent,
} from './config'
import { classifyFairlendRoute } from './routes'
import {
  getRemovedAnalyticsPropertyKeys,
  sanitizeAnalyticsProperties,
  type AnalyticsProperties,
} from './sanitize'

export type JourneyType =
  | 'mortgage_private'
  | 'mortgage_institutional'
  | 'mortgage_residential'
  | 'mortgage_rental_acquisition'
  | 'mortgage_rental_refinance'
  | 'investor'
  | 'builder'
  | 'homeowner_garden_suite'
  | 'contact'
  | 'consultation'
  | 'newsletter'
  | 'partner'
  | 'document_upload'
  | 'route_helper'
  | 'other'

type CommonProperties = {
  schema_version?: 1
  deployment_environment?: 'production' | 'preview' | 'development'
  page_path?: string
  page_type?: string
  content_group?: string
  journey_type?: JourneyType
  form_id?: string
  form_variant?: string
  source?: string
  cta_id?: string
  cta_location?: string
  step_key?: string
  step_number?: number
  total_steps?: number
  completion_status?: 'complete' | 'partial'
  failure_type?: 'http' | 'network' | 'validation'
  input_category?: string
  intent?: string
}

type StepProperties = CommonProperties & {
  journey_type: JourneyType
  form_id: string
  step_key: string
  step_number: number
  total_steps: number
}

export interface FairlendAnalyticsEventMap {
  fairlend_cta_clicked: CommonProperties & { cta_id: string; cta_location: string }
  fairlend_route_selected: CommonProperties & { journey_type: JourneyType }
  fairlend_intake_started: CommonProperties & { journey_type: JourneyType; form_id: string }
  fairlend_intake_resumed: StepProperties
  fairlend_intake_step_viewed: StepProperties
  fairlend_intake_step_completed: StepProperties
  fairlend_intake_validation_failed: StepProperties
  fairlend_intake_back_clicked: StepProperties
  fairlend_intake_partial_submitted: CommonProperties & { journey_type: JourneyType; form_id: string }
  fairlend_lead_submitted: CommonProperties & { journey_type: JourneyType; form_id: string }
  fairlend_lead_submission_failed: CommonProperties & { journey_type: JourneyType; form_id: string }
  fairlend_consultation_scheduler_opened: CommonProperties
  fairlend_phone_clicked: CommonProperties
  fairlend_email_clicked: CommonProperties
  fairlend_search_performed: CommonProperties
  fairlend_resource_clicked: CommonProperties
  fairlend_build_model_started: CommonProperties
  fairlend_build_model_changed: CommonProperties & { input_category: string }
  fairlend_build_model_cta_clicked: CommonProperties
  fairlend_lead_qualified: CommonProperties
  fairlend_lead_working_file: CommonProperties
  fairlend_lead_closed_won: CommonProperties
  fairlend_lead_closed_lost: CommonProperties
  fairlend_consent_updated: CommonProperties & { analytics: boolean; marketing: boolean }
}

export type FairlendEventName = keyof FairlendAnalyticsEventMap

export type AnalyticsContext = { consentGranted: true; schemaVersion: 1 }
export type LeadSubmissionResponse = {
  id?: string
  analytics?: { distinctId: string; revocationToken: string }
}

const leadEventNames = new Set<FairlendEventName>(['fairlend_lead_submitted'])
const analyticsRevocationStorageKey = 'fairlend.analytics-revocations.v1'

declare global {
  interface Window {
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    lintrk?: (...args: unknown[]) => void
    posthog?: {
      capture?: (eventName: string, properties?: Record<string, unknown>) => void
      identify?: (distinctId: string, properties?: Record<string, unknown>) => void
      startSessionRecording?: () => void
    }
    uetq?: Array<Record<string, unknown> | unknown[]>
  }
}

function readCurrentConsent(): AnalyticsConsent {
  if (!analyticsConfig.requireConsent) return { analytics: true, marketing: true }
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(analyticsConsentStorageKey) ?? '{}',
    ) as Partial<AnalyticsConsent>
    return { analytics: parsed.analytics === true, marketing: parsed.marketing === true }
  } catch {
    return { analytics: false, marketing: false }
  }
}

function getBaseProperties(): AnalyticsProperties {
  const route = classifyFairlendRoute(window.location.pathname)
  return {
    ...route,
    schema_version: 1,
    deployment_environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }
}

function toGaEventName(eventName: FairlendEventName): string {
  if (leadEventNames.has(eventName)) return 'generate_lead'
  if (eventName === 'fairlend_intake_started') return 'begin_checkout'
  if (eventName === 'fairlend_consultation_scheduler_opened') return 'schedule'
  return eventName
}

export function trackFairlendEvent<K extends FairlendEventName>(
  eventName: K,
  properties: FairlendAnalyticsEventMap[K],
): void {
  if (typeof window === 'undefined' || !analyticsConfig.enabled) return
  const currentConsent = readCurrentConsent()
  const candidateProperties = { ...getBaseProperties(), ...properties }
  const safeProperties = sanitizeAnalyticsProperties(candidateProperties)
  if (process.env.NODE_ENV !== 'production') {
    const removedKeys = getRemovedAnalyticsPropertyKeys(candidateProperties, safeProperties)
    if (removedKeys.length > 0) {
      console.warn(`[analytics] Removed unsafe properties from ${eventName}: ${removedKeys.join(', ')}`)
    }
  }
  const eventPayload = { event: eventName, ...safeProperties }

  window.dispatchEvent(new CustomEvent(analyticsEventName, { detail: eventPayload }))
  if (currentConsent.analytics || currentConsent.marketing) window.dataLayer?.push(eventPayload)
  if (currentConsent.analytics) {
    window.posthog?.capture?.(eventName, safeProperties)
    window.gtag?.('event', toGaEventName(eventName), safeProperties)
    if (
      eventName === 'fairlend_intake_started' ||
      eventName === 'fairlend_intake_validation_failed' ||
      eventName === 'fairlend_lead_submission_failed'
    ) {
      window.posthog?.startSessionRecording?.()
    }
  }
  if (currentConsent.marketing && window.gtag && leadEventNames.has(eventName)) {
    if (analyticsConfig.googleAdsId && analyticsConfig.googleAdsLeadConversionLabel) {
      window.gtag('event', 'conversion', {
        send_to: `${analyticsConfig.googleAdsId}/${analyticsConfig.googleAdsLeadConversionLabel}`,
      })
    }
  }
  if (currentConsent.marketing && window.fbq) {
    if (leadEventNames.has(eventName)) window.fbq('track', 'Lead', safeProperties)
    else window.fbq('trackCustom', eventName, safeProperties)
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
      el: String(safeProperties.source ?? 'fairlend'),
      event: eventName,
    })
  }
}

export function getAnalyticsContext(): AnalyticsContext | undefined {
  if (typeof window === 'undefined' || !readCurrentConsent().analytics) return undefined
  return { consentGranted: true, schemaVersion: 1 }
}

export function completeLeadAnalytics(
  response: LeadSubmissionResponse | null,
  properties: FairlendAnalyticsEventMap['fairlend_lead_submitted'],
): void {
  if (response?.analytics) {
    window.posthog?.identify?.(response.analytics.distinctId, {
      journey_type: properties.journey_type,
      schema_version: 1,
    })
    rememberRevocationToken(response.analytics.revocationToken)
  }
  trackFairlendEvent('fairlend_lead_submitted', properties)
}

export function startDiagnosticRecording(): void {
  if (typeof window !== 'undefined' && readCurrentConsent().analytics) {
    window.posthog?.startSessionRecording?.()
  }
}

export async function revokeStoredAnalyticsIdentities(): Promise<void> {
  if (typeof window === 'undefined') return
  let tokens: string[] = []
  try {
    tokens = JSON.parse(window.localStorage.getItem(analyticsRevocationStorageKey) ?? '[]') as string[]
  } catch {
    tokens = []
  }
  window.localStorage.removeItem(analyticsRevocationStorageKey)
  await Promise.allSettled(
    tokens.slice(0, 20).map((token) =>
      fetch('/api/analytics/consent/revoke', {
        body: JSON.stringify({ token }),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        method: 'POST',
      }),
    ),
  )
}

function rememberRevocationToken(token: string): void {
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(analyticsRevocationStorageKey) ?? '[]',
    ) as string[]
    window.localStorage.setItem(
      analyticsRevocationStorageKey,
      JSON.stringify(Array.from(new Set([...existing, token])).slice(-20)),
    )
  } catch {
    // Storage is progressive enhancement. Consent still gates client capture.
  }
}

export function resolveJourneyType(input: {
  intent?: string
  mortgageProduct?: string
  rentalTransaction?: string
  source?: string
}): JourneyType {
  if (input.intent === 'invest') return 'investor'
  if (input.intent === 'build') {
    return /garden|homeowner/i.test(input.source ?? '') ? 'homeowner_garden_suite' : 'builder'
  }
  if (input.intent === 'mortgage') {
    if (input.mortgageProduct === 'institutional') return 'mortgage_institutional'
    if (input.mortgageProduct === 'residential') return 'mortgage_residential'
    if (input.mortgageProduct === 'rental-property') {
      return input.rentalTransaction === 'refinance'
        ? 'mortgage_rental_refinance'
        : 'mortgage_rental_acquisition'
    }
    return 'mortgage_private'
  }
  if (input.intent === 'consultation') return 'consultation'
  if (input.intent === 'newsletter') return 'newsletter'
  if (input.intent === 'document-upload') return 'document_upload'
  if (input.intent === 'route-helper') return 'route_helper'
  if (input.intent?.startsWith('partner')) return 'partner'
  if (input.intent === 'contact') return 'contact'
  return 'other'
}

export function trackLeadSubmitted(
  properties: FairlendAnalyticsEventMap['fairlend_lead_submitted'],
): void {
  trackFairlendEvent('fairlend_lead_submitted', properties)
}

export function trackLeadFailed(
  properties: FairlendAnalyticsEventMap['fairlend_lead_submission_failed'],
): void {
  startDiagnosticRecording()
  trackFairlendEvent('fairlend_lead_submission_failed', properties)
}
