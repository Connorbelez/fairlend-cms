import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { AnalyticsProvider } from '@/components/Analytics'
import { JsonLd } from '@/components/SEO/JsonLd'
import { Footer } from '@/Footer/Component'
import { Providers } from '@/providers'
import { defaultTheme, themeCookieName } from '@/providers/Theme/shared'
import { themeIsValid } from '@/providers/Theme/types'
import { Toaster } from '@/components/ui/sonner'
import { cookies } from 'next/headers'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const themePreference = cookieStore.get(themeCookieName)?.value ?? null
  const initialTheme = themeIsValid(themePreference) ? themePreference : defaultTheme

  return (
    <html
      className={cn(inter.variable, cormorantGaramond.variable)}
      data-theme={initialTheme}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <JsonLd data={[fairlendOrganizationJsonLd(), fairlendWebsiteJsonLd()]} />
        <Providers initialTheme={initialTheme}>
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
