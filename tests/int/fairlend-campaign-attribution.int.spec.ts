import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const campaignMocks = vi.hoisted(() => ({
  persistFairlendCampaignScan: vi.fn(),
}))

vi.mock('@/lib/fairlend-campaign-attribution', async () => {
  const actual = await vi.importActual<typeof import('@/lib/fairlend-campaign-attribution')>(
    '@/lib/fairlend-campaign-attribution',
  )

  return {
    ...actual,
    persistFairlendCampaignScan: campaignMocks.persistFairlendCampaignScan,
  }
})

import {
  fairlendCampaignAttributionCookieName,
  parseFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'
import { GET } from '@/app/(frontend)/r/[campaign]/route'

describe('FairLend QR campaign attribution route', () => {
  afterEach(() => {
    campaignMocks.persistFairlendCampaignScan.mockReset()
    vi.restoreAllMocks()
  })

  it('records /r/v1 scans, sets attribution cookie, and redirects home', async () => {
    campaignMocks.persistFairlendCampaignScan.mockResolvedValue(undefined)

    const response = await GET(
      new NextRequest('https://fairlend.test/r/v1?placement=mailer', {
        headers: {
          referer: 'https://example.com/source',
          'user-agent': 'Vitest QR Scanner',
          'x-forwarded-for': '203.0.113.10',
        },
      }),
      { params: Promise.resolve({ campaign: 'v1' }) },
    )

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://fairlend.test/')
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-robots-tag')).toBe('noindex')

    const cookie = response.cookies.get(fairlendCampaignAttributionCookieName)
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.path).toBe('/')
    expect(cookie?.sameSite).toBe('lax')

    const attribution = parseFairlendCampaignAttribution(cookie?.value)
    expect(attribution).toMatchObject({
      campaign: 'v1',
      destination: '/',
      source: 'qr-v1',
    })
    expect(attribution?.scanId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
    expect(campaignMocks.persistFairlendCampaignScan).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign: 'v1',
        destination: '/',
        queryParams: { placement: 'mailer' },
        referrer: 'https://example.com/source',
        source: 'qr-v1',
        userAgent: 'Vitest QR Scanner',
      }),
    )
    expect(campaignMocks.persistFairlendCampaignScan.mock.calls[0][0].hashedIp).toMatch(
      /^[a-f0-9]{64}$/,
    )
  })

  it('still redirects and sets attribution when scan persistence fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    campaignMocks.persistFairlendCampaignScan.mockRejectedValue(new Error('database unavailable'))

    const response = await GET(new NextRequest('https://fairlend.test/r/v1'), {
      params: Promise.resolve({ campaign: 'v1' }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://fairlend.test/')
    expect(response.cookies.get(fairlendCampaignAttributionCookieName)?.value).toBeTruthy()
  })

  it('redirects unknown campaigns home without setting attribution', async () => {
    const response = await GET(new NextRequest('https://fairlend.test/r/not-real'), {
      params: Promise.resolve({ campaign: 'not-real' }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://fairlend.test/')
    expect(response.cookies.get(fairlendCampaignAttributionCookieName)).toBeUndefined()
    expect(campaignMocks.persistFairlendCampaignScan).not.toHaveBeenCalled()
  })
})
