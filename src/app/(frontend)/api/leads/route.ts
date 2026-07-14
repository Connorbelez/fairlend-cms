import type { NextRequest } from 'next/server'

import {
  getFairlendCampaignAttributionFromRequest,
  getFairlendRequestPagePath,
} from '@/lib/fairlend-campaign-attribution'
import { recordFairlendCampaignJourneyEvent } from '@/lib/fairlend-campaign-journey'
import { upsertFairlendLead, type LeadPayload } from '@/lib/fairlend-leads'
import { registerLeadAnalyticsConsent } from '@/lib/analytics/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const payload = (await request.json().catch(() => null)) as
    | (LeadPayload & {
        analyticsContext?: { consentGranted?: unknown; schemaVersion?: unknown }
      })
    | null

  if (!payload || typeof payload !== 'object') {
    return Response.json({ error: 'Lead payload is required' }, { status: 400 })
  }

  try {
    const { analyticsContext, ...leadPayload } = payload
    const attribution = getFairlendCampaignAttributionFromRequest(request)
    const attributedPayload = withCampaignAttribution(leadPayload, attribution)
    const lead = await upsertFairlendLead(attributedPayload)

    if (attribution) {
      await recordFairlendCampaignJourneyEvent({
        attribution,
        event: {
          eventId: `lead:${lead.id}:${attributedPayload.status === 'submitted' ? 'submitted' : 'started'}`,
          eventType:
            attributedPayload.status === 'submitted' ? 'intake_submitted' : 'intake_started',
          formId: attributedPayload.source,
          formName: attributedPayload.source,
          intakeType: attributedPayload.intent,
          leadId: lead.id,
          pagePath: getFairlendRequestPagePath(request),
        },
      }).catch((error) => {
        console.error('Failed to record lead campaign journey event', error)
      })
    }

    const analytics =
      analyticsContext?.consentGranted === true &&
      analyticsContext.schemaVersion === 1 &&
      attributedPayload.status === 'submitted'
        ? await registerLeadAnalyticsConsent(lead.id)
        : undefined

    return Response.json({ id: lead.id, analytics })
  } catch (error) {
    console.error('Failed to persist FairLend lead', error)
    return Response.json({ error: 'Failed to persist lead' }, { status: 500 })
  }
}

function withCampaignAttribution(
  payload: LeadPayload,
  attribution: ReturnType<typeof getFairlendCampaignAttributionFromRequest>,
): LeadPayload {
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
