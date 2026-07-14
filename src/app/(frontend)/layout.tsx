import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import {
  Architects_Daughter,
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  League_Gothic,
  Oxanium,
} from 'next/font/google'
import React, { Suspense } from 'react'

import { AnalyticsProvider } from '@/components/Analytics'
import { FairlendConsultationBookingModalInterceptor } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingModalInterceptor.client'
import { FAIRLEND_LOGO_SRC } from '@/components/Logo/Logo'
import { JsonLd } from '@/components/SEO/JsonLd'
import { Footer } from '@/Footer/Component'
import { Providers } from '@/providers'
import { defaultTheme } from '@/providers/Theme/shared'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'
import { FrontendChrome } from './FrontendChrome.client'
import { buildFairlendMetadata, getCanonicalOrigin } from '@/utilities/seo'
import { fairlendOrganizationJsonLd, fairlendWebsiteJsonLd } from '@/utilities/structuredData'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
})

const cormorantGaramond = Cormorant_Garamond({
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      </head>
      <body>
        <JsonLd data={[fairlendOrganizationJsonLd(), fairlendWebsiteJsonLd()]} />
        <Providers initialTheme={defaultTheme}>
          <FrontendChrome footer={<Footer />}>{children}</FrontendChrome>
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

export const metadata: Metadata = {
  ...buildFairlendMetadata({ path: '/' }),
  metadataBase: new URL(getCanonicalOrigin()),
}
