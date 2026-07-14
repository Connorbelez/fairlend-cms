import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeLeadPayload } from '@/lib/fairlend-leads'
import {
  syncFairlendLeadToTwenty,
  toTwentyMortgageLeadCreateInput,
  toTwentyMortgageLeadUpdateInput,
} from '@/lib/twenty/client'

const lead = normalizeLeadPayload({
  address: '123 Main Street, Toronto, ON',
  addressDetails: {
    addressCity: 'Toronto',
    addressCountry: 'CA',
    addressPostcode: 'M5V 2T6',
    addressState: 'ON',
    latitude: 43.64,
    longitude: -79.39,
  },
  attribution: { campaign: 'builder-guide', source: 'qr' },
  campaign: 'builder-guide',
  campaignScanId: 'scan-123',
  email: 'borrower@example.com',
  formattedAddress: '123 Main St, Toronto, ON M5V 2T6, Canada',
  id: 'ad432c0c-b47c-4ed7-bc54-bd78d77e156d',
  intake: {
    additionalLiens: '$50,000',
    amountNeeded: '$1,200,000',
    mortgageProduct: 'private',
    projectScope: 'multiplex-financing',
    projectStage: 'Permits submitted',
    situation: 'Close a property quickly',
    timeline: 'Within 30 days',
  },
  intent: 'mortgage',
  name: 'Alex Borrower',
  phone: '+14165550123',
  placeId: 'ChIJ123',
  priority: 'high',
  adminNotes: 'Borrower requested an afternoon call.',
  nextActionAt: '2026-07-15T18:00:00.000Z',
  source: 'multiplex-financing-gta',
  status: 'submitted',
  workflowStatus: 'qualified',
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('Twenty mortgage lead mapping', () => {
  it('maps normalized intake fields and stable identifiers into the app schema', () => {
    expect(toTwentyMortgageLeadCreateInput(lead)).toMatchObject({
      id: lead.id,
      fairlendLeadId: lead.id,
      captureStatus: 'SUBMITTED',
      workflowStatus: 'QUALIFIED',
      priority: 'HIGH',
      adminNotes: 'Borrower requested an afternoon call.',
      nextActionAt: '2026-07-15T18:00:00.000Z',
      mortgageProduct: 'PRIVATE',
      requestedAmount: '$1,200,000',
      additionalLiens: '$50,000',
      source: 'multiplex-financing-gta',
      propertyAddress: {
        addressCity: 'Toronto',
        addressCountry: 'CA',
        addressPostcode: 'M5V 2T6',
        addressState: 'ON',
        addressStreet1: '123 Main Street, Toronto, ON',
        addressLat: 43.64,
        addressLng: -79.39,
      },
    })
  })

  it('does not overwrite CRM-owned workflow fields during website updates', () => {
    const update = toTwentyMortgageLeadUpdateInput(lead)

    expect(update).not.toHaveProperty('workflowStatus')
    expect(update).not.toHaveProperty('priority')
    expect(update).not.toHaveProperty('nextActionAt')
    expect(update).not.toHaveProperty('adminNotes')
  })
})

describe('Twenty mortgage lead sync', () => {
  it('is explicitly disabled unless configured', async () => {
    const fetchMock = vi.fn()

    await expect(
      syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }),
    ).resolves.toEqual({ status: 'disabled' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('patches the deterministic FairLend lead id when the record already exists', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json({ data: { id: lead.id } }),
    )

    await expect(
      syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }),
    ).resolves.toEqual({ status: 'synced', recordId: lead.id })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `https://api.twenty.com/rest/mortgageLeads/${lead.id}`,
    )
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'PATCH' })
  })

  it('creates a missing record and seeds CRM-owned workflow defaults once', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi
      .fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response())
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(Response.json({ id: lead.id }, { status: 201 }))

    await expect(
      syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }),
    ).resolves.toEqual({ status: 'synced', recordId: lead.id })

    const createInit = fetchMock.mock.calls[1]?.[1] as RequestInit
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://api.twenty.com/rest/mortgageLeads')
    expect(createInit.method).toBe('POST')
    expect(JSON.parse(String(createInit.body))).toMatchObject({
      id: lead.id,
      workflowStatus: 'QUALIFIED',
      priority: 'HIGH',
      adminNotes: 'Borrower requested an afternoon call.',
      nextActionAt: '2026-07-15T18:00:00.000Z',
    })
  })

  it('returns a bounded operational error instead of failing lead capture', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi.fn(async () =>
      Response.json({ message: 'API key cannot access mortgageLeads' }, { status: 403 }),
    )

    const result = await syncFairlendLeadToTwenty(lead, {
      fetchImpl: fetchMock as unknown as typeof fetch,
    })

    expect(result).toEqual({
      status: 'failed',
      error:
        'Twenty API could not update mortgage lead: HTTP 403 (API key cannot access mortgageLeads)',
    })
  })
})
