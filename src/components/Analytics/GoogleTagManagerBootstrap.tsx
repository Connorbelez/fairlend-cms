import type { ReactElement } from 'react'

import { analyticsConfig, hasGoogleDestination } from '@/lib/analytics/config'

/**
 * Installs Google Consent Mode before GTM and exposes the published container in
 * the initial document so Google Search Console can use it for ownership proof.
 *
 * GTM is deliberately present before optional consent. If GA delivery is later
 * moved into GTM, its Google Tag must fire only on the `fairlend_analytics_ready`
 * custom event emitted by AnalyticsProvider after analytics consent is granted.
 */
export function GoogleTagManagerHead(): ReactElement | null {
  if (!hasGoogleDestination) return null

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
        `,
        }}
        id="fairlend-google-consent-default"
      />

      {analyticsConfig.enabled && analyticsConfig.gtmId ? (
        // eslint-disable-next-line @next/next/next-script-for-ga
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(analyticsConfig.gtmId)});
          `,
          }}
          id="fairlend-gtm"
        />
      ) : null}

      {!analyticsConfig.gaManagedByGtm && analyticsConfig.gaMeasurementId ? (
        <>
          <script
            async
            id="fairlend-google-tag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
              analyticsConfig.gaMeasurementId,
            )}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(analyticsConfig.gaMeasurementId)}, {
                send_page_view: false
              });
            `,
            }}
            id="fairlend-google-tag-init"
          />
        </>
      ) : null}
    </>
  )
}

export function GoogleTagManagerBody(): ReactElement | null {
  if (!analyticsConfig.enabled || !analyticsConfig.gtmId) return null

  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
          analyticsConfig.gtmId,
        )}`}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
        width="0"
      />
    </noscript>
  )
}
