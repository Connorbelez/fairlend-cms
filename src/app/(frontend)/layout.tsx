import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { AnalyticsProvider } from '@/components/Analytics'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(inter.variable, cormorantGaramond.variable)}
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
          <AnalyticsProvider />
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
