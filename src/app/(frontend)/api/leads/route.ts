import type { NextRequest } from 'next/server'

import {
  fairlendCampaignAttributionCookieName,
  parseFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'
import { upsertFairlendLead, type LeadPayload } from '@/lib/fairlend-leads'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null

  if (!payload || typeof payload !== 'object') {
    return Response.json({ error: 'Lead payload is required' }, { status: 400 })
  }

  try {
    const lead = await upsertFairlendLead(withCampaignAttribution(payload, request))
    return Response.json({ id: lead.id })
  } catch (error) {
    console.error('Failed to persist FairLend lead', error)
    return Response.json({ error: 'Failed to persist lead' }, { status: 500 })
  }
}

function withCampaignAttribution(payload: LeadPayload, request: NextRequest): LeadPayload {
  const attribution = parseFairlendCampaignAttribution(
    request.cookies.get(fairlendCampaignAttributionCookieName)?.value,
  )

  if (!attribution) {
    return payload
  }

  return {
    ...payload,
    attribution: {
      ...(isRecord(payload.attribution) ? payload.attribution : {}),
      ...attribution,
    },
    campaign: payload.campaign ?? attribution.campaign,
    campaignScanId: payload.campaignScanId ?? attribution.scanId,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
