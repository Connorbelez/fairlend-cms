import type { NextRequest } from 'next/server'

import { getFairlendCampaignAttributionFromRequest } from '@/lib/fairlend-campaign-attribution'
import {
  recordFairlendCampaignJourneyEvent,
  type FairlendCampaignJourneyEventInput,
} from '@/lib/fairlend-campaign-journey'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return Response.json({ error: 'Campaign journey event is too large' }, { status: 413 })
  }

  const attribution = getFairlendCampaignAttributionFromRequest(request)
  if (!attribution) return new Response(null, { status: 204 })

  const event = (await request.json().catch(() => null)) as FairlendCampaignJourneyEventInput | null
  if (!event || typeof event !== 'object') {
    return Response.json({ error: 'Campaign journey event is required' }, { status: 400 })
  }

  try {
    await recordFairlendCampaignJourneyEvent({ attribution, event })
    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error && /required|unsupported|valid/i.test(error.message)) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    console.error('Failed to record FairLend campaign journey event', error)
    return Response.json({ error: 'Failed to record campaign journey event' }, { status: 500 })
  }
}
