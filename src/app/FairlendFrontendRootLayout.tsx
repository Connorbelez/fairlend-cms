import type { Metadata } from 'next'
import {
  Architects_Daughter,
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  League_Gothic,
  Oxanium,
} from 'next/font/google'
import React, { Suspense } from 'react'

import {
  AnalyticsProvider,
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from '@/components/Analytics'
import { FairlendConsultationBookingModalInterceptor } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingModalInterceptor.client'
import { FAIRLEND_LOGO_SRC } from '@/components/Logo/Logo'
import { JsonLd } from '@/components/SEO/JsonLd'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/Footer/Component'
import { FairlendDeferredFooter } from '@/Footer/FairlendDeferredFooter.client'
import { Providers } from '@/providers'
import { defaultTheme } from '@/providers/Theme/shared'
import { cn } from '@/utilities/ui'
import { fairlendSeo, getCanonicalOrigin } from '@/utilities/seo'
import {
  fairlendOrganizationJsonLd,
  fairlendPrincipalBrokerJsonLd,
  fairlendWebsiteJsonLd,
} from '@/utilities/structuredData'

import { FrontendChrome } from './(frontend)/FrontendChrome.client'

const inter = Inter({
  preload: false,
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
})

const cormorantGaramond = Cormorant_Garamond({
  preload: false,
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
})

// These display faces previously came from a render-blocking Google Fonts @import.
// Keep them self-hosted and out of the critical preload queue; the browser fetches
// each face only on routes that actually render it.
const architectsDaughter = Architects_Daughter({
  display: 'swap',
  preload: false,
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
})

const dmSerifDisplay = DM_Serif_Display({
  display: 'swap',
  preload: false,
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif-display',
  weight: '400',
})

const leagueGothic = League_Gothic({
  display: 'swap',
  preload: false,
  subsets: ['latin'],
  variable: '--font-league-gothic',
  weight: '400',
})

const oxanium = Oxanium({
  display: 'swap',
  preload: false,
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['400', '500', '600', '700', '800'],
})

export function FairlendFrontendRootLayout({
  children,
  deferFooter = false,
}: {
  children: React.ReactNode
  deferFooter?: boolean
}) {
  return (
    <html
      className={cn(
        inter.variable,
        cormorantGaramond.variable,
        architectsDaughter.variable,
        dmSerifDisplay.variable,
        leagueGothic.variable,
        oxanium.variable,
      )}
      data-theme={defaultTheme}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href={FAIRLEND_LOGO_SRC} rel="icon" type="image/svg+xml" />
        <GoogleTagManagerHead />
      </head>
      <body>
        <GoogleTagManagerBody />
        <JsonLd
          data={[
            fairlendOrganizationJsonLd(),
            fairlendWebsiteJsonLd(),
            fairlendPrincipalBrokerJsonLd(),
          ]}
        />
        <Providers initialTheme={defaultTheme}>
          <FrontendChrome footer={deferFooter ? <FairlendDeferredFooter /> : <Footer />}>
            {children}
          </FrontendChrome>
          <FairlendConsultationBookingModalInterceptor />
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}

export const fairlendFrontendMetadata: Metadata = {
  description: fairlendSeo.defaultDescription,
  metadataBase: new URL(getCanonicalOrigin()),
  openGraph: {
    locale: fairlendSeo.locale,
    siteName: fairlendSeo.siteName,
    type: 'website',
  },
  title: fairlendSeo.siteName,
  twitter: {
    card: 'summary_large_image',
  },
}
