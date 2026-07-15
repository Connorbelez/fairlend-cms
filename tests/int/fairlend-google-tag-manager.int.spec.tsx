import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

async function renderBootstrap(env: {
  disabled?: string
  gaMeasurementId?: string
  gtmId?: string
}): Promise<string> {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_ANALYTICS_DISABLED', env.disabled ?? 'false')
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', env.gaMeasurementId ?? '')
  vi.stubEnv('NEXT_PUBLIC_GTM_ID', env.gtmId ?? '')

  const { GoogleTagManagerBody, GoogleTagManagerHead } = await import(
    '@/components/Analytics/GoogleTagManagerBootstrap'
  )
  return renderToStaticMarkup(
    <>
      <GoogleTagManagerHead />
      <GoogleTagManagerBody />
    </>,
  )
}

describe('Google Tag Manager bootstrap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('renders consent defaults and the ownership-verifiable GTM snippets', async () => {
    const markup = await renderBootstrap({
      gaMeasurementId: 'G-09V5BSS55K',
      gtmId: 'GTM-5HV3MRRW',
    })

    expect(markup).toContain('fairlend-google-consent-default')
    expect(markup).toContain("analytics_storage: 'denied'")
    expect(markup).toContain('fairlend-gtm')
    expect(markup).toContain('GTM-5HV3MRRW')
    expect(markup).toContain('https://www.googletagmanager.com/ns.html?id=GTM-5HV3MRRW')
    expect(markup).toContain('https://www.googletagmanager.com/gtag/js?id=G-09V5BSS55K')
    expect(markup).toContain("gtag('config', \"G-09V5BSS55K\"")
    expect(markup).toContain('send_page_view: false')
  })

  it('renders no Google bootstrap when analytics is disabled', async () => {
    const markup = await renderBootstrap({
      disabled: 'true',
      gaMeasurementId: 'G-09V5BSS55K',
      gtmId: 'GTM-5HV3MRRW',
    })

    expect(markup).toBe('')
  })
})
