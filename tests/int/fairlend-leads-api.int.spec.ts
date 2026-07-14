import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

import {
  fairlendCampaignAttributionCookieName,
  serializeFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'
import type { LeadPayload } from '@/lib/fairlend-leads'

const leadRouteMocks = vi.hoisted(() => ({
  registerLeadAnalyticsConsent: vi.fn(),
  recordFairlendCampaignJourneyEvent: vi.fn(),
  upsertFairlendLead: vi.fn(),
}))

vi.mock('@/lib/fairlend-leads', () => ({
  upsertFairlendLead: leadRouteMocks.upsertFairlendLead,
}))

vi.mock('@/lib/fairlend-campaign-journey', () => ({
  recordFairlendCampaignJourneyEvent: leadRouteMocks.recordFairlendCampaignJourneyEvent,
}))

vi.mock('@/lib/analytics/server', () => ({
  registerLeadAnalyticsConsent: leadRouteMocks.registerLeadAnalyticsConsent,
}))

import { POST } from '@/app/(frontend)/api/leads/route'

describe('Fairlend leads API', () => {
  afterEach(() => {
    leadRouteMocks.upsertFairlendLead.mockReset()
    leadRouteMocks.recordFairlendCampaignJourneyEvent.mockReset()
    leadRouteMocks.registerLeadAnalyticsConsent.mockReset()
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    leadRouteMocks.recordFairlendCampaignJourneyEvent.mockResolvedValue(undefined)
  })

  it('persists the lead before returning a successful response', async () => {
    const payload: LeadPayload = {
      address: '123 Build Lane',
      email: 'owner@example.com',
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
      intake: {
        ctaLabel: 'Start application',
        ctaPath: '/multiplex-financing-gta',
        projectStage: 'Permits submitted',
        referrerPath: '/',
      },
      intent: 'build',
      name: 'Sam Owner',
      phone: '416-555-0199',
      source: 'drawflow-intake',
      status: 'submitted',
    }

    leadRouteMocks.upsertFairlendLead.mockResolvedValue({ id: payload.id })

    const response = await POST(jsonRequest(payload) as never)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ id: payload.id })
    expect(leadRouteMocks.upsertFairlendLead).toHaveBeenCalledWith(payload)
  })

  it('attaches valid QR campaign attribution from the server cookie', async () => {
    const payload: LeadPayload = {
      email: 'owner@example.com',
      source: 'homepage-build-application-form',
      status: 'submitted',
    }
    const attribution = {
      campaign: 'v1',
      capturedAt: '2026-07-08T12:00:00.000Z',
      destination: '/',
      scanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
      source: 'qr-v1',
    }

    leadRouteMocks.upsertFairlendLead.mockResolvedValue({
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
    })

    const response = await POST(
      jsonRequest(payload, {
        cookie: `${fairlendCampaignAttributionCookieName}=${serializeFairlendCampaignAttribution(attribution)}`,
      }) as never,
    )

    expect(response.status).toBe(200)
    expect(leadRouteMocks.upsertFairlendLead).toHaveBeenCalledWith({
      ...payload,
      attribution,
      campaign: 'v1',
      campaignScanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
    })
    expect(leadRouteMocks.recordFairlendCampaignJourneyEvent).toHaveBeenCalledWith({
      attribution,
      event: expect.objectContaining({
        eventType: 'intake_submitted',
        formId: 'homepage-build-application-form',
        leadId: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
      }),
    })
  })

  it('ignores malformed QR campaign attribution cookies', async () => {
    const payload: LeadPayload = {
      email: 'owner@example.com',
      source: 'homepage-build-application-form',
    }

    leadRouteMocks.upsertFairlendLead.mockResolvedValue({
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
    })

    const response = await POST(
      jsonRequest(payload, {
        cookie: `${fairlendCampaignAttributionCookieName}=not-json`,
      }) as never,
    )

    expect(response.status).toBe(200)
    expect(leadRouteMocks.upsertFairlendLead).toHaveBeenCalledWith(payload)
  })

  it('returns a bad request when the request body is not a lead object', async () => {
    const response = await POST(jsonRequest(null) as never)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Lead payload is required' })
    expect(leadRouteMocks.upsertFairlendLead).not.toHaveBeenCalled()
  })

  it('returns a pseudonymous identity only for an affirmatively consented submitted lead', async () => {
    const id = '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4'
    leadRouteMocks.upsertFairlendLead.mockResolvedValue({ id })
    leadRouteMocks.registerLeadAnalyticsConsent.mockResolvedValue({
      distinctId: 'fl_pseudonymous',
      revocationToken: 'signed-revocation-token',
    })

    const response = await POST(
      jsonRequest({
        analyticsContext: { consentGranted: true, schemaVersion: 1 },
        email: 'owner@example.com',
        source: 'test',
        status: 'submitted',
      }) as never,
    )

    await expect(response.json()).resolves.toEqual({
      analytics: {
        distinctId: 'fl_pseudonymous',
        revocationToken: 'signed-revocation-token',
      },
      id,
    })
    expect(leadRouteMocks.registerLeadAnalyticsConsent).toHaveBeenCalledWith(id)
    expect(leadRouteMocks.upsertFairlendLead).toHaveBeenCalledWith(
      expect.not.objectContaining({ analyticsContext: expect.anything() }),
    )
  })

  it.each([
    ['missing context', undefined, 'submitted'],
    ['invalid schema', { consentGranted: true, schemaVersion: 2 }, 'submitted'],
    ['draft status', { consentGranted: true, schemaVersion: 1 }, 'started'],
  ])('does not create analytics identity for %s', async (_label, analyticsContext, status) => {
    leadRouteMocks.upsertFairlendLead.mockResolvedValue({
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
    })

    const response = await POST(
      jsonRequest({ analyticsContext, email: 'owner@example.com', source: 'test', status }) as never,
    )

    expect(response.status).toBe(200)
    expect(leadRouteMocks.registerLeadAnalyticsConsent).not.toHaveBeenCalled()
  })

  it('returns a server error when lead persistence fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    leadRouteMocks.upsertFairlendLead.mockRejectedValue(new Error('database unavailable'))

    const response = await POST(jsonRequest({ email: 'owner@example.com' }) as never)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to persist lead' })
  })
})

function jsonRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/leads', {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    method: 'POST',
  })
}
