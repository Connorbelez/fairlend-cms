import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { AnalyticsProvider } from '@/components/Analytics'
import { Footer } from '@/Footer/Component'
import { Providers } from '@/providers'
import { defaultTheme, themeCookieName } from '@/providers/Theme/shared'
import { themeIsValid } from '@/providers/Theme/types'
import { Toaster } from '@/components/ui/sonner'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cookies } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { FrontendChrome } from './FrontendChrome.client'

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
        <Providers initialTheme={initialTheme}>
          <FrontendChrome footer={<Footer />}>
            {children}
          </FrontendChrome>
          <AnalyticsProvider />
          <Toaster richColors />
        </Providers>
      {/* impeccable-live-start */}
<Script src="http://localhost:8400/live.js" strategy="afterInteractive" />
{/* impeccable-live-end */}
</body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
