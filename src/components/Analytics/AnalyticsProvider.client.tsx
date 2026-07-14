'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  analyticsConfig,
  analyticsConsentCookieName,
  analyticsConsentStorageKey,
  hasConfiguredAnalytics,
  hasGoogleDestination,
  type AnalyticsConsent,
  type StoredAnalyticsConsent,
} from '@/lib/analytics/config'
import {
  revokeStoredAnalyticsIdentities,
  trackFairlendEvent,
} from '@/lib/analytics/events'
import { classifyFairlendRoute } from '@/lib/analytics/routes'
import {
  readAllowlistedCampaignProperties,
  sanitizePostHogEvent,
} from '@/lib/analytics/sanitize'
import { cn } from '@/utilities/ui'

import { FairlendCampaignJourneyTracker } from './FairlendCampaignJourneyTracker.client'

declare global {
  interface Window {
    _fbq?: unknown
    _linkedin_data_partner_ids?: string[]
    _linkedin_partner_id?: string
    uetq?: Array<Record<string, unknown> | unknown[]>
  }
}

let posthogInitialized = false
const internalAnalyticsStorageKey = 'fairlend.analytics-internal.v1'

const deniedConsent: AnalyticsConsent = {
  analytics: false,
  marketing: false,
}

const grantedConsent: AnalyticsConsent = {
  analytics: true,
  marketing: true,
}

function createStoredConsent(consent: AnalyticsConsent): StoredAnalyticsConsent {
  return {
    ...consent,
    updatedAt: new Date().toISOString(),
    version: 1,
  }
}

function readStoredConsent(): StoredAnalyticsConsent | null {
  try {
    const rawConsent = window.localStorage.getItem(analyticsConsentStorageKey)
    if (!rawConsent) return null

    const parsed = JSON.parse(rawConsent) as Partial<StoredAnalyticsConsent>
    if (parsed.version !== 1) return null

    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      version: 1,
    }
  } catch {
    return null
  }
}

function persistConsent(consent: AnalyticsConsent): void {
  const storedConsent = createStoredConsent(consent)
  window.localStorage.setItem(analyticsConsentStorageKey, JSON.stringify(storedConsent))
  document.cookie = `${analyticsConsentCookieName}=${encodeURIComponent(
    JSON.stringify({
      analytics: storedConsent.analytics,
      marketing: storedConsent.marketing,
      version: storedConsent.version,
    }),
  )}; Max-Age=31536000; Path=/; SameSite=Lax`
}

function clearConsent(): void {
  window.localStorage.removeItem(analyticsConsentStorageKey)
  document.cookie = `${analyticsConsentCookieName}=; Max-Age=0; Path=/; SameSite=Lax`
}

function getGoogleConsentPayload(consent: AnalyticsConsent) {
  return {
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    analytics_storage: consent.analytics ? 'granted' : 'denied',
  }
}

function getCurrentPageProperties(pathname: string) {
  const route = classifyFairlendRoute(pathname)
  return {
    ...route,
    ...readAllowlistedCampaignProperties(window.location.search),
    page_location: `${window.location.origin}${route.page_path}`,
    page_title: document.title,
  }
}

function isReplayBlockedPath(pathname: string): boolean {
  return /^\/(admin|api|account|dashboard|preview)(\/|$)/.test(pathname) ||
    /\/(documents?|uploads?)(\/|$)/.test(pathname)
}

export function AnalyticsProvider(): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false)
  const [hasStoredPreference, setHasStoredPreference] = useState(false)
  const [consent, setConsent] = useState<AnalyticsConsent>(deniedConsent)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [draftConsent, setDraftConsent] = useState<AnalyticsConsent>(deniedConsent)

  const effectiveConsent = useMemo<AnalyticsConsent>(() => {
    if (!analyticsConfig.requireConsent) return grantedConsent
    return consent
  }, [consent])

  useEffect(() => {
    queueMicrotask(() => {
      if (!analyticsConfig.enabled || !hasConfiguredAnalytics) {
        clearConsent()
        setHasLoadedPreference(true)
        return
      }

      if (!analyticsConfig.requireConsent) {
        setConsent(grantedConsent)
        setDraftConsent(grantedConsent)
        setHasLoadedPreference(true)
        return
      }

      const storedConsent = readStoredConsent()
      if (storedConsent) {
        setConsent(storedConsent)
        setDraftConsent(storedConsent)
        setHasStoredPreference(true)
      }
      setHasLoadedPreference(true)
    })
  }, [])

  useEffect(() => {
    if (!hasLoadedPreference || !hasGoogleDestination) return
    window.dataLayer = window.dataLayer ?? []
    window.gtag =
      window.gtag ??
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }

    window.gtag('consent', 'update', getGoogleConsentPayload(effectiveConsent))
  }, [effectiveConsent, hasLoadedPreference])

  useEffect(() => {
    if (!hasLoadedPreference || !analyticsConfig.posthogKey) return

    if (!effectiveConsent.analytics) {
      if (posthogInitialized) {
        posthog.opt_out_capturing()
        posthog.stopSessionRecording()
        posthog.reset()
      }
      return
    }

    if (!posthogInitialized) {
      posthog.init(analyticsConfig.posthogKey, {
        api_host: analyticsConfig.posthogHost,
        autocapture: true,
        before_send: (event) => sanitizePostHogEvent(event),
        capture_exceptions: true,
        capture_pageleave: true,
        capture_pageview: false,
        capture_performance: {
          web_vitals: true,
          web_vitals_allowed_metrics: ['LCP', 'CLS', 'INP', 'FCP'],
        },
        defaults: '2026-05-30',
        disable_session_recording: isReplayBlockedPath(window.location.pathname),
        loaded: (client) => {
          window.posthog = client
          const isInternalUser =
            window.localStorage.getItem(internalAnalyticsStorageKey) === 'true'
          client.register({
            $internal_or_test_user: isInternalUser,
            deployment_environment: 'production',
            is_internal_user: isInternalUser,
            schema_version: 1,
          })
          if (analyticsConfig.debug) client.debug()
        },
        mask_all_element_attributes: false,
        mask_all_text: false,
        mask_personal_data_properties: true,
        person_profiles: 'identified_only',
        property_denylist: [
          'address',
          'amount',
          'email',
          'firstName',
          'lastName',
          'message',
          'name',
          'notes',
          'phone',
        ],
        session_recording: {
          maskAllInputs: true,
          maskTextSelector:
            'input, textarea, [contenteditable="true"], [data-analytics-sensitive], .fl-mortgage-fields, .bp-form-content, .contact-form__message',
          blockSelector:
            '[data-analytics-replay-block], [data-document-upload], [data-account-surface]',
          recordBody: false,
          recordHeaders: false,
        },
      })
      // posthog-js queues captures before its remote configuration finishes loading. Expose the
      // initialized client immediately so first-render journey effects cannot race `loaded`.
      window.posthog = posthog
      posthogInitialized = true
    } else {
      posthog.opt_in_capturing()
      posthog.startSessionRecording()
    }
  }, [effectiveConsent.analytics, hasLoadedPreference])

  useEffect(() => {
    if (!effectiveConsent.analytics || !posthogInitialized) return
    if (isReplayBlockedPath(pathname)) posthog.stopSessionRecording()
    else posthog.startSessionRecording()
  }, [effectiveConsent.analytics, pathname])

  useEffect(() => {
    if (!hasLoadedPreference || !hasConfiguredAnalytics) return

    const pageProperties = getCurrentPageProperties(pathname)
    const internalFlag = new URLSearchParams(searchParamsString).get('analytics_internal')
    const isInternalUser =
      internalFlag === '1' ||
      (internalFlag !== '0' &&
        window.localStorage.getItem(internalAnalyticsStorageKey) === 'true')

    window.dataLayer?.push({
      event: 'page_view',
      ...pageProperties,
    })

    if (effectiveConsent.analytics) {
      if (analyticsConfig.posthogKey && posthogInitialized) {
        posthog.capture('$pageview', {
          $current_url: pageProperties.page_location,
          page_path: pageProperties.page_path,
          page_type: pageProperties.page_type,
          content_group: pageProperties.content_group,
          $internal_or_test_user: isInternalUser,
          is_internal_user: isInternalUser,
        })
      }

      window.gtag?.('event', 'page_view', pageProperties)
    }

    if (effectiveConsent.marketing) {
      window.fbq?.('track', 'PageView')
      window.uetq?.push?.(['event', 'page_view', pageProperties])
    }
  }, [
    effectiveConsent.analytics,
    effectiveConsent.marketing,
    hasLoadedPreference,
    pathname,
    searchParamsString,
  ])

  useEffect(() => {
    if (!hasLoadedPreference) return
    const internalFlag = searchParams.get('analytics_internal')
    if (internalFlag === '1') {
      window.localStorage.setItem(internalAnalyticsStorageKey, 'true')
      if (posthogInitialized) {
        posthog.register({ $internal_or_test_user: true, is_internal_user: true })
      }
    } else if (internalFlag === '0') {
      window.localStorage.removeItem(internalAnalyticsStorageKey)
      if (posthogInitialized) {
        posthog.register({ $internal_or_test_user: false, is_internal_user: false })
      }
    }
  }, [hasLoadedPreference, searchParams])

  useEffect(() => {
    if (!effectiveConsent.analytics) return

    function handleDelegatedClick(event: MouseEvent): void {
      const element = (event.target as Element | null)?.closest<HTMLElement>(
        'a, button, [data-analytics-cta-id]',
      )
      if (!element) return
      const anchor = element instanceof HTMLAnchorElement ? element : element.closest('a')
      const href = anchor?.getAttribute('href') ?? ''
      const source = element.dataset.analyticsSource ?? 'site'
      const ctaId = element.dataset.analyticsCtaId

      if (element.hasAttribute('data-analytics-build-model-cta')) {
        trackFairlendEvent('fairlend_build_model_cta_clicked', { source })
      }
      if (href.startsWith('tel:')) {
        trackFairlendEvent('fairlend_phone_clicked', { source })
      } else if (href.startsWith('mailto:')) {
        trackFairlendEvent('fairlend_email_clicked', { source })
      } else if (/^\/(posts|resources)(\/|$)/.test(href)) {
        trackFairlendEvent('fairlend_resource_clicked', { source })
      } else if (ctaId) {
        trackFairlendEvent('fairlend_cta_clicked', {
          cta_id: ctaId,
          cta_location: element.dataset.analyticsCtaLocation ?? source,
          source,
        })
      }
    }

    document.addEventListener('click', handleDelegatedClick)
    return () => document.removeEventListener('click', handleDelegatedClick)
  }, [effectiveConsent.analytics])

  function setAndPersistConsent(nextConsent: AnalyticsConsent): void {
    const wasAnalyticsGranted = effectiveConsent.analytics
    persistConsent(nextConsent)
    setConsent(nextConsent)
    setDraftConsent(nextConsent)
    setHasStoredPreference(true)
    setIsPreferencesOpen(false)
    trackFairlendEvent('fairlend_consent_updated', {
      analytics: nextConsent.analytics,
      marketing: nextConsent.marketing,
    })
    if (wasAnalyticsGranted && !nextConsent.analytics) {
      void revokeStoredAnalyticsIdentities()
    }
  }

  if (!analyticsConfig.enabled || !hasConfiguredAnalytics || !hasLoadedPreference) {
    return null
  }

  const shouldShowBanner = analyticsConfig.requireConsent && !hasStoredPreference

  return (
    <>
      <FairlendCampaignJourneyTracker enabled={effectiveConsent.analytics} />
      {hasGoogleDestination && (
        <Script id="fairlend-google-consent-default" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
      )}

      {analyticsConfig.gtmId && (effectiveConsent.analytics || effectiveConsent.marketing) && (
        <Script id="fairlend-gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(analyticsConfig.gtmId)});
          `}
        </Script>
      )}

      {(analyticsConfig.gaMeasurementId && effectiveConsent.analytics) ||
      (analyticsConfig.googleAdsId && effectiveConsent.marketing) ? (
        <>
          <Script
            id="fairlend-google-tag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${
              analyticsConfig.gaMeasurementId || analyticsConfig.googleAdsId
            }`}
            strategy="afterInteractive"
          />
          <Script id="fairlend-google-tag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('consent', 'update', ${JSON.stringify(getGoogleConsentPayload(effectiveConsent))});
              ${
                analyticsConfig.gaMeasurementId && effectiveConsent.analytics
                  ? `gtag('config', ${JSON.stringify(analyticsConfig.gaMeasurementId)}, { send_page_view: false });`
                  : ''
              }
              ${
                analyticsConfig.googleAdsId && effectiveConsent.marketing
                  ? `gtag('config', ${JSON.stringify(analyticsConfig.googleAdsId)}, { send_page_view: false });`
                  : ''
              }
            `}
          </Script>
        </>
      ) : null}

      {analyticsConfig.metaPixelId && effectiveConsent.marketing && (
        <>
          <Script id="fairlend-meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', ${JSON.stringify(analyticsConfig.metaPixelId)});
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {analyticsConfig.linkedinPartnerId && effectiveConsent.marketing && (
        <Script id="fairlend-linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = ${JSON.stringify(analyticsConfig.linkedinPartnerId)};
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript"; b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}

      {analyticsConfig.microsoftUetTagId && effectiveConsent.marketing && (
        <Script id="fairlend-microsoft-uet" strategy="afterInteractive">
          {`
            (function(w,d,t,r,u){
              var f,n,i;w[u]=w[u]||[],f=function(){
                var o={ti:${JSON.stringify(analyticsConfig.microsoftUetTagId)}};
                o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
              },n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
                var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
              },i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
            })(window,document,"script","//bat.bing.com/bat.js","uetq");
          `}
        </Script>
      )}

      {shouldShowBanner && (
        <div
          className={cn(
            'fixed bottom-3 left-1/2 z-[70] flex w-[calc(100vw-1.5rem)] max-w-4xl -translate-x-1/2 flex-col gap-4 overflow-hidden rounded-lg border border-[#d8c7b6] bg-[#fffdf8] p-4 text-[#101010] shadow-[0_22px_80px_rgb(8_9_10/20%)] sm:w-[calc(100vw-3rem)] sm:flex-row sm:items-center sm:justify-between',
          )}
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="min-w-0 max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4f6f10]">
              Privacy preferences
            </p>
            <p className="mt-1 break-words text-sm leading-6 font-semibold text-[#34403d]">
              FairLend uses analytics to improve the site and advertising tags to measure or
              retarget campaigns. Optional tracking stays off unless you allow it.
            </p>
          </div>
          <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            <Button
              className="min-h-11 w-full rounded-md border-[#08090a] bg-[#fffdf9] text-[#08090a] hover:bg-[#f7f6f1] hover:text-[#08090a]"
              onClick={() => setAndPersistConsent(deniedConsent)}
              type="button"
              variant="outline"
            >
              Reject optional
            </Button>
            <Button
              className="min-h-11 w-full rounded-md"
              onClick={() => {
                setDraftConsent(consent)
                setIsPreferencesOpen(true)
              }}
              type="button"
              variant="secondary"
            >
              Manage
            </Button>
            <Button
              className="min-h-11 w-full rounded-md"
              onClick={() => setAndPersistConsent(grantedConsent)}
              type="button"
            >
              Accept all
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="rounded-lg border-[#d8c7b6] bg-[#fffdf8]">
          <DialogHeader>
            <DialogTitle>Privacy preferences</DialogTitle>
            <DialogDescription>
              Required site behavior is always on. Optional analytics and retargeting can be changed
              separately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="flex items-center justify-between gap-5 rounded-lg border border-[#e6d8c9] bg-white/70 p-4">
              <div>
                <Label htmlFor="fairlend-consent-analytics">Analytics</Label>
                <p className="mt-1 text-sm text-[#5f6a63]">
                  Pageviews, funnels, click behavior, heatmaps, and replay diagnostics.
                </p>
              </div>
              <Switch
                id="fairlend-consent-analytics"
                checked={draftConsent.analytics}
                onCheckedChange={(analytics) =>
                  setDraftConsent((current) => ({ ...current, analytics }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-5 rounded-lg border border-[#e6d8c9] bg-white/70 p-4">
              <div>
                <Label htmlFor="fairlend-consent-marketing">Advertising</Label>
                <p className="mt-1 text-sm text-[#5f6a63]">
                  Campaign measurement, conversion tracking, and eligible retargeting audiences.
                </p>
              </div>
              <Switch
                id="fairlend-consent-marketing"
                checked={draftConsent.marketing}
                onCheckedChange={(marketing) =>
                  setDraftConsent((current) => ({ ...current, marketing }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setAndPersistConsent(deniedConsent)}
              type="button"
              className="border-[#08090a] bg-[#fffdf9] text-[#08090a] hover:bg-[#f7f6f1] hover:text-[#08090a]"
              variant="outline"
            >
              Reject optional
            </Button>
            <Button onClick={() => setAndPersistConsent(draftConsent)} type="button">
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
