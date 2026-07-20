export const analyticsConsentStorageKey = 'fairlend.analytics-consent.v1'
export const analyticsConsentCookieName = 'fairlend_analytics_consent'
export const analyticsConsentStateEventName = 'fairlend:consent-state'
export const analyticsEventName = 'fairlend:analytics-event'
export const analyticsInternalStorageKey = 'fairlend.analytics-internal.v1'

export type AnalyticsConsent = {
  analytics: boolean
  marketing: boolean
}

export type StoredAnalyticsConsent = AnalyticsConsent & {
  updatedAt: string
  version: 1
}

const booleanEnv = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value == null || value === '') return defaultValue
  return value === 'true' || value === '1'
}

const cleanEnv = (value: string | undefined): string => value?.trim() ?? ''

export const analyticsConfig = {
  debug: booleanEnv(process.env.NEXT_PUBLIC_ANALYTICS_DEBUG, false),
  enabled: !booleanEnv(process.env.NEXT_PUBLIC_ANALYTICS_DISABLED, false),
  requireConsent: booleanEnv(process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT, true),

  googleAdsId: cleanEnv(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLeadConversionLabel: cleanEnv(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL),
  gaManagedByGtm: booleanEnv(process.env.NEXT_PUBLIC_GA_MANAGED_BY_GTM, false),
  gaMeasurementId: cleanEnv(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  gtmId: cleanEnv(process.env.NEXT_PUBLIC_GTM_ID),

  linkedinLeadConversionId: cleanEnv(process.env.NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID),
  linkedinPartnerId: cleanEnv(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
  metaPixelId: cleanEnv(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  microsoftUetTagId: cleanEnv(process.env.NEXT_PUBLIC_MICROSOFT_UET_TAG_ID),

  posthogHost: cleanEnv(process.env.NEXT_PUBLIC_POSTHOG_HOST) || 'https://us.i.posthog.com',
  posthogKey: cleanEnv(process.env.NEXT_PUBLIC_POSTHOG_KEY),
}

export const hasAnalyticsDestination =
  analyticsConfig.enabled &&
  Boolean(analyticsConfig.posthogKey || analyticsConfig.gaMeasurementId || analyticsConfig.gtmId)

export const hasMarketingDestination =
  analyticsConfig.enabled &&
  Boolean(
    analyticsConfig.googleAdsId ||
    analyticsConfig.gtmId ||
    analyticsConfig.linkedinPartnerId ||
    analyticsConfig.metaPixelId ||
    analyticsConfig.microsoftUetTagId,
  )

export const hasGoogleDestination =
  analyticsConfig.enabled &&
  Boolean(analyticsConfig.gaMeasurementId || analyticsConfig.googleAdsId || analyticsConfig.gtmId)

export const hasConfiguredAnalytics = hasAnalyticsDestination || hasMarketingDestination
