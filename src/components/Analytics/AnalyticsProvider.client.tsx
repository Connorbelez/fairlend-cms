'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getFairlendApplicationElement } from '@/components/FairlendLandingHero/application-target'
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
  analyticsConsentStateEventName,
  analyticsConsentStorageKey,
  hasConfiguredAnalytics,
  hasGoogleDestination,
  type AnalyticsConsent,
  type StoredAnalyticsConsent,
} from '@/lib/analytics/config'
import { revokeStoredAnalyticsIdentities, trackFairlendEvent } from '@/lib/analytics/events'
import { classifyFairlendRoute } from '@/lib/analytics/routes'
import { readAllowlistedCampaignProperties, sanitizePostHogEvent } from '@/lib/analytics/sanitize'
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

type PostHogClient = (typeof import('posthog-js'))['default']

let posthogClient: PostHogClient | null = null
let posthogInitialized = false
let posthogLoadPromise: Promise<PostHogClient> | null = null
const internalAnalyticsStorageKey = 'fairlend.analytics-internal.v1'

function loadPostHog(): Promise<PostHogClient> {
  posthogLoadPromise ??= import('posthog-js').then(({ default: client }) => {
    posthogClient = client
    return client
  })

  return posthogLoadPromise
}

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
  return (
    /^\/(admin|api|account|dashboard|preview)(\/|$)/.test(pathname) ||
    /\/(documents?|uploads?)(\/|$)/.test(pathname)
  )
}

function focusHomepageApplication(): boolean {
  const application = getFairlendApplicationElement()
  if (!application) return false

  application.scrollIntoView({ block: 'nearest' })
  application.focus({ preventScroll: true })
  return true
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
  const [posthogReady, setPosthogReady] = useState(false)
  const hasSignaledGoogleAnalyticsReady = useRef(false)
  const shouldFocusApplicationAfterConsentRef = useRef(false)

  const effectiveConsent = useMemo<AnalyticsConsent>(() => {
    if (!analyticsConfig.requireConsent) return grantedConsent
    return consent
  }, [consent])

  const shouldShowBanner =
    analyticsConfig.enabled &&
    hasConfiguredAnalytics &&
    hasLoadedPreference &&
    analyticsConfig.requireConsent &&
    !hasStoredPreference

  useEffect(() => {
    document.documentElement.toggleAttribute('data-fairlend-consent-pending', shouldShowBanner)
    window.dispatchEvent(
      new CustomEvent(analyticsConsentStateEventName, {
        detail: { pending: shouldShowBanner },
      }),
    )

    return () => {
      document.documentElement.removeAttribute('data-fairlend-consent-pending')
    }
  }, [shouldShowBanner])

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

    if (!effectiveConsent.analytics) {
      hasSignaledGoogleAnalyticsReady.current = false
      return
    }

    if (
      analyticsConfig.gaManagedByGtm &&
      analyticsConfig.gtmId &&
      !hasSignaledGoogleAnalyticsReady.current
    ) {
      window.dataLayer.push({ event: 'fairlend_analytics_ready' })
      hasSignaledGoogleAnalyticsReady.current = true
    }
  }, [effectiveConsent, hasLoadedPreference])

  useEffect(() => {
    if (!hasLoadedPreference || !analyticsConfig.posthogKey) return

    if (!effectiveConsent.analytics) {
      if (posthogInitialized && posthogClient) {
        posthogClient.opt_out_capturing()
        posthogClient.stopSessionRecording()
        posthogClient.reset()
      }
      return
    }

    let cancelled = false

    void loadPostHog().then((posthog) => {
      if (cancelled) return

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
        // PostHog queues captures before remote configuration finishes loading. Expose the
        // initialized client immediately so first-render journey effects cannot race `loaded`.
        window.posthog = posthog
        posthogInitialized = true
      } else {
        posthog.opt_in_capturing()
        posthog.startSessionRecording()
      }

      setPosthogReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [effectiveConsent.analytics, hasLoadedPreference])

  useEffect(() => {
    if (!effectiveConsent.analytics || !posthogReady || !posthogClient) return
    if (isReplayBlockedPath(pathname)) posthogClient.stopSessionRecording()
    else posthogClient.startSessionRecording()
  }, [effectiveConsent.analytics, pathname, posthogReady])

  useEffect(() => {
    if (!hasLoadedPreference || !hasConfiguredAnalytics) return

    const pageProperties = getCurrentPageProperties(pathname)
    const internalFlag = new URLSearchParams(searchParamsString).get('analytics_internal')
    const isInternalUser =
      internalFlag === '1' ||
      (internalFlag !== '0' && window.localStorage.getItem(internalAnalyticsStorageKey) === 'true')

    if (effectiveConsent.analytics) {
      if (analyticsConfig.posthogKey && posthogReady && posthogClient) {
        posthogClient.capture('$pageview', {
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
    posthogReady,
    searchParamsString,
  ])

  useEffect(() => {
    if (!hasLoadedPreference) return
    const internalFlag = searchParams.get('analytics_internal')
    if (internalFlag === '1') {
      window.localStorage.setItem(internalAnalyticsStorageKey, 'true')
      if (posthogReady && posthogClient) {
        posthogClient.register({ $internal_or_test_user: true, is_internal_user: true })
      }
    } else if (internalFlag === '0') {
      window.localStorage.removeItem(internalAnalyticsStorageKey)
      if (posthogReady && posthogClient) {
        posthogClient.register({ $internal_or_test_user: false, is_internal_user: false })
      }
    }
  }, [hasLoadedPreference, posthogReady, searchParams])

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

    shouldFocusApplicationAfterConsentRef.current = Boolean(getFairlendApplicationElement())
    if (!isPreferencesOpen && shouldFocusApplicationAfterConsentRef.current) {
      queueMicrotask(() => {
        focusHomepageApplication()
        shouldFocusApplicationAfterConsentRef.current = false
      })
    }
  }

  if (!analyticsConfig.enabled || !hasConfiguredAnalytics || !hasLoadedPreference) {
    return null
  }

  return (
    <>
      <FairlendCampaignJourneyTracker enabled={effectiveConsent.analytics} />
      {!analyticsConfig.gaManagedByGtm &&
      analyticsConfig.googleAdsId &&
      effectiveConsent.marketing ? (
        <>
          {!analyticsConfig.gaMeasurementId ? (
            <Script
              id="fairlend-google-ads-tag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAdsId}`}
              strategy="afterInteractive"
            />
          ) : null}
          <Script id="fairlend-google-ads-tag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('consent', 'update', ${JSON.stringify(getGoogleConsentPayload(effectiveConsent))});
              gtag('config', ${JSON.stringify(analyticsConfig.googleAdsId)}, { send_page_view: false });
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
          aria-describedby="fairlend-consent-description"
          aria-labelledby="fairlend-consent-title"
          className={cn(
            'fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-[70] flex w-[calc(100vw-1rem)] max-w-3xl -translate-x-1/2 flex-col gap-2.5 overflow-hidden rounded-lg border border-[#d8c7b6] bg-[#fffdf8] p-3 text-[#101010] shadow-[0_18px_60px_rgb(8_9_10/18%)] sm:bottom-3 sm:w-[calc(100vw-3rem)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4',
          )}
          data-fairlend-consent-banner
          role="dialog"
        >
          <div className="min-w-0 max-w-2xl">
            <p
              className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f6f10] sm:text-sm"
              id="fairlend-consent-title"
            >
              Privacy preferences
            </p>
            <p
              className="mt-1 break-words text-xs leading-5 font-semibold text-[#34403d] sm:text-sm sm:leading-6"
              id="fairlend-consent-description"
            >
              Optional analytics and advertising stay off unless you allow them.
            </p>
          </div>
          <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:w-auto">
            <Button
              aria-label="Reject optional cookies"
              className="min-h-11 w-full rounded-md border-[#08090a] bg-[#fffdf9] text-[#08090a] hover:bg-[#f7f6f1] hover:text-[#08090a]"
              onClick={() => setAndPersistConsent(deniedConsent)}
              type="button"
              variant="outline"
            >
              <span className="sm:hidden">Reject</span>
              <span className="hidden sm:inline">Reject optional</span>
            </Button>
            <Button
              aria-label="Manage cookie preferences"
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
              aria-label="Accept all cookies"
              className="min-h-11 w-full rounded-md"
              onClick={() => setAndPersistConsent(grantedConsent)}
              type="button"
            >
              <span className="sm:hidden">Accept</span>
              <span className="hidden sm:inline">Accept all</span>
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent
          className="rounded-lg border-[#d8c7b6] bg-[#fffdf8]"
          onCloseAutoFocus={(event) => {
            if (!shouldFocusApplicationAfterConsentRef.current) return
            event.preventDefault()
            shouldFocusApplicationAfterConsentRef.current = false
            focusHomepageApplication()
          }}
        >
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
