import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/(frontend)/api/campaign-journey/route'
import {
  fairlendCampaignAttributionCookieName,
  serializeFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'

const journeyMocks = vi.hoisted(() => ({
  recordFairlendCampaignJourneyEvent: vi.fn(),
}))

vi.mock('@/lib/fairlend-campaign-journey', () => ({
  recordFairlendCampaignJourneyEvent: journeyMocks.recordFairlendCampaignJourneyEvent,
}))

const attribution = {
  campaign: 'v1',
  capturedAt: '2026-07-14T12:00:00.000Z',
  destination: '/',
  scanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
  source: 'qr-v1',
}

describe('FairLend campaign journey API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('records privacy-limited events against signed QR attribution', async () => {
    const event = {
      eventId: 'page-view:6fe6de20-b2c8-4da9-8454-369884340f98',
      eventType: 'page_view' as const,
      pagePath: '/borrowers/construction-financing?email=never-store-this',
      visitId: '73356da0-d2a6-457a-b637-33e1ffb61868',
    }

    const response = await POST(requestWithAttribution(event))

    expect(response.status).toBe(204)
    expect(journeyMocks.recordFairlendCampaignJourneyEvent).toHaveBeenCalledWith({
      attribution,
      event,
    })
  })

  it('does nothing when no signed campaign attribution exists', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/campaign-journey', {
        body: JSON.stringify({ eventId: 'ignored', eventType: 'page_view', pagePath: '/' }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }),
    )

    expect(response.status).toBe(204)
    expect(journeyMocks.recordFairlendCampaignJourneyEvent).not.toHaveBeenCalled()
  })

  it('returns a bad request for missing event input', async () => {
    const response = await POST(requestWithAttribution(null))

    expect(response.status).toBe(400)
    expect(journeyMocks.recordFairlendCampaignJourneyEvent).not.toHaveBeenCalled()
  })

  it('rejects oversized event payloads before parsing attribution', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/campaign-journey', {
        body: JSON.stringify({ eventId: 'oversized', eventType: 'page_view' }),
        headers: {
          'content-length': '16385',
          'content-type': 'application/json',
        },
        method: 'POST',
      }),
    )

    expect(response.status).toBe(413)
    expect(journeyMocks.recordFairlendCampaignJourneyEvent).not.toHaveBeenCalled()
  })
})

function requestWithAttribution(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/campaign-journey', {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      cookie: `${fairlendCampaignAttributionCookieName}=${serializeFairlendCampaignAttribution(attribution)}`,
    },
    method: 'POST',
  })
}
