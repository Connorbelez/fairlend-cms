import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { trackFairlendEvent } from '@/lib/analytics/events'

const vercelMocks = vi.hoisted(() => ({
  analyticsProps: vi.fn(),
  pathname: '/',
  speedInsightsProps: vi.fn(),
  track: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => vercelMocks.pathname,
}))

vi.mock('@vercel/analytics', () => ({
  track: vercelMocks.track,
}))

vi.mock('@vercel/analytics/next', () => ({
  Analytics: (props: unknown) => {
    vercelMocks.analyticsProps(props)
    return null
  },
}))

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: (props: unknown) => {
    vercelMocks.speedInsightsProps(props)
    return null
  },
}))

import { FairlendVercelTelemetry } from '@/components/Analytics/FairlendVercelTelemetry.client'

type BeforeSend = (event: { type: string; url: string }) => { type: string; url: string } | null

function getBeforeSend(mock: ReturnType<typeof vi.fn>): BeforeSend {
  const props = mock.mock.lastCall?.[0] as { beforeSend?: BeforeSend } | undefined
  if (!props?.beforeSend) throw new Error('Expected Vercel telemetry to provide beforeSend')
  return props.beforeSend
}

function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: state,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

function installLocalStorage(): void {
  const storage = new Map<string, string>()

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  })
}

describe('FairLend Vercel telemetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    installLocalStorage()
    vercelMocks.analyticsProps.mockClear()
    vercelMocks.speedInsightsProps.mockClear()
    vercelMocks.track.mockClear()
    vercelMocks.pathname = '/construction-financing'
    window.localStorage.clear()
    window.history.replaceState({}, '', '/construction-financing')
    setVisibility('visible')
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    window.localStorage.clear()
  })

  it('mounts anonymous Web Analytics and Speed Insights and removes query data', () => {
    render(<FairlendVercelTelemetry />)

    const pageview = {
      type: 'pageview',
      url: 'https://www.fairlend.ca/construction-financing?email=borrower%40example.com#application',
    }

    expect(getBeforeSend(vercelMocks.analyticsProps)(pageview)).toEqual({
      type: 'pageview',
      url: 'https://www.fairlend.ca/construction-financing',
    })
    expect(getBeforeSend(vercelMocks.speedInsightsProps)({ ...pageview, type: 'vital' })).toEqual({
      type: 'vital',
      url: 'https://www.fairlend.ca/construction-financing',
    })
  })

  it('is mounted by both public route groups and excluded from Payload Admin', async () => {
    const root = process.cwd()
    const [frontendRoot, homeLayout, frontendLayout, payloadLayout] = await Promise.all([
      readFile(join(root, 'src/app/FairlendFrontendRootLayout.tsx'), 'utf8'),
      readFile(join(root, 'src/app/(home)/layout.tsx'), 'utf8'),
      readFile(join(root, 'src/app/(frontend)/layout.tsx'), 'utf8'),
      readFile(join(root, 'src/app/(payload)/layout.tsx'), 'utf8'),
    ])

    expect(frontendRoot).toContain('<FairlendVercelTelemetry />')
    expect(homeLayout).toContain('<FairlendFrontendRootLayout')
    expect(frontendLayout).toContain('<FairlendFrontendRootLayout')
    expect(payloadLayout).not.toContain('FairlendVercelTelemetry')
  })

  it('discards persisted and query-flagged internal traffic', () => {
    window.localStorage.setItem('fairlend.analytics-internal.v1', 'true')
    render(<FairlendVercelTelemetry />)

    const beforeSend = getBeforeSend(vercelMocks.analyticsProps)
    expect(beforeSend({ type: 'pageview', url: 'https://www.fairlend.ca/borrowers' })).toBeNull()

    window.localStorage.removeItem('fairlend.analytics-internal.v1')
    expect(
      beforeSend({
        type: 'pageview',
        url: 'https://www.fairlend.ca/borrowers?analytics_internal=1',
      }),
    ).toBeNull()

    window.localStorage.setItem('fairlend.analytics-internal.v1', 'true')
    trackFairlendEvent('fairlend_lead_submitted', {
      form_id: 'fairlend_application',
      journey_type: 'mortgage_private',
    })
    expect(vercelMocks.track).not.toHaveBeenCalled()
  })

  it('honors the global analytics kill switch', async () => {
    cleanup()
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_DISABLED', 'true')
    const { FairlendVercelTelemetry: DisabledVercelTelemetry } =
      await import('@/components/Analytics/FairlendVercelTelemetry.client')

    render(<DisabledVercelTelemetry />)
    act(() => vi.advanceTimersByTime(90_000))
    window.dispatchEvent(
      new CustomEvent('fairlend:analytics-event', {
        detail: {
          event: 'fairlend_lead_submitted',
          form_id: 'fairlend_application',
          journey_type: 'mortgage_private',
        },
      }),
    )

    expect(vercelMocks.analyticsProps).not.toHaveBeenCalled()
    expect(vercelMocks.speedInsightsProps).not.toHaveBeenCalled()
    expect(vercelMocks.track).not.toHaveBeenCalled()
  })

  it('forwards only anonymous intake starts and successful lead submissions', () => {
    render(<FairlendVercelTelemetry />)

    trackFairlendEvent('fairlend_intake_started', {
      form_id: 'fairlend_application',
      journey_type: 'mortgage_private',
    })
    trackFairlendEvent('fairlend_cta_clicked', {
      cta_id: 'application-hero',
      cta_location: 'hero',
    })
    trackFairlendEvent('fairlend_lead_submitted', {
      form_id: 'fairlend_application',
      journey_type: 'mortgage_private',
    })
    window.dispatchEvent(
      new CustomEvent('fairlend:analytics-event', {
        detail: {
          email: 'borrower@example.com',
          event: 'fairlend_lead_submitted',
          form_id: 'contact_form',
          journey_type: 'contact',
          lead_id: 'internal-record-id',
        },
      }),
    )

    expect(vercelMocks.track.mock.calls).toEqual([
      [
        'fairlend_intake_started',
        { form_id: 'fairlend_application', journey_type: 'mortgage_private' },
      ],
      [
        'fairlend_lead_submitted',
        { form_id: 'fairlend_application', journey_type: 'mortgage_private' },
      ],
      ['fairlend_lead_submitted', { form_id: 'contact_form', journey_type: 'contact' }],
    ])
  })

  it('emits 30-second and 90-second active engagement milestones once per pageview', () => {
    render(<FairlendVercelTelemetry />)

    act(() => vi.advanceTimersByTime(29_999))
    expect(vercelMocks.track).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(vercelMocks.track).toHaveBeenLastCalledWith('fairlend_page_engaged_30s')

    act(() => vi.advanceTimersByTime(60_000))
    expect(vercelMocks.track).toHaveBeenLastCalledWith('fairlend_page_engaged_90s')

    act(() => vi.advanceTimersByTime(120_000))
    expect(vercelMocks.track.mock.calls).toEqual([
      ['fairlend_page_engaged_30s'],
      ['fairlend_page_engaged_90s'],
    ])
  })

  it('pauses engagement time in background tabs', () => {
    render(<FairlendVercelTelemetry />)

    act(() => vi.advanceTimersByTime(20_000))
    act(() => setVisibility('hidden'))
    act(() => vi.advanceTimersByTime(120_000))
    expect(vercelMocks.track).not.toHaveBeenCalled()

    act(() => setVisibility('visible'))
    act(() => vi.advanceTimersByTime(9_999))
    expect(vercelMocks.track).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(vercelMocks.track).toHaveBeenCalledWith('fairlend_page_engaged_30s')
  })

  it('starts a fresh engagement clock after client-side navigation', () => {
    const view = render(<FairlendVercelTelemetry />)

    act(() => vi.advanceTimersByTime(30_000))
    expect(vercelMocks.track).toHaveBeenCalledTimes(1)

    vercelMocks.pathname = '/borrowers/private-mortgage-financing'
    view.rerender(<FairlendVercelTelemetry />)
    act(() => vi.advanceTimersByTime(29_999))
    expect(vercelMocks.track).toHaveBeenCalledTimes(1)

    act(() => vi.advanceTimersByTime(1))
    expect(vercelMocks.track.mock.calls).toEqual([
      ['fairlend_page_engaged_30s'],
      ['fairlend_page_engaged_30s'],
    ])
  })

  it('cleans up engagement timers and the conversion bridge when unmounted', () => {
    const view = render(<FairlendVercelTelemetry />)

    act(() => vi.advanceTimersByTime(29_000))
    view.unmount()
    act(() => vi.advanceTimersByTime(120_000))
    trackFairlendEvent('fairlend_lead_submitted', {
      form_id: 'fairlend_application',
      journey_type: 'mortgage_private',
    })

    expect(vercelMocks.track).not.toHaveBeenCalled()
  })
})
