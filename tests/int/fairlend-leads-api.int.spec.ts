import { afterEach, describe, expect, it, vi } from 'vitest'

import type { LeadPayload } from '@/lib/fairlend-leads'

const leadRouteMocks = vi.hoisted(() => ({
  upsertFairlendLead: vi.fn(),
}))

vi.mock('@/lib/fairlend-leads', () => ({
  upsertFairlendLead: leadRouteMocks.upsertFairlendLead,
}))

import { POST } from '@/app/(frontend)/api/leads/route'

describe('Fairlend leads API', () => {
  afterEach(() => {
    leadRouteMocks.upsertFairlendLead.mockReset()
    vi.restoreAllMocks()
  })

  it('persists the lead before returning a successful response', async () => {
    const payload: LeadPayload = {
      address: '123 Build Lane',
      email: 'owner@example.com',
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
      intake: { projectStage: 'Permits submitted' },
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

  it('returns a bad request when the request body is not a lead object', async () => {
    const response = await POST(jsonRequest(null) as never)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Lead payload is required' })
    expect(leadRouteMocks.upsertFairlendLead).not.toHaveBeenCalled()
  })

  it('returns a server error when lead persistence fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    leadRouteMocks.upsertFairlendLead.mockRejectedValue(new Error('database unavailable'))

    const response = await POST(jsonRequest({ email: 'owner@example.com' }) as never)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to persist lead' })
  })
})

function jsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/leads', {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  })
}
