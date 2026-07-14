import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeLeadPayload } from '@/lib/fairlend-leads'
import {
  syncFairlendLeadToTwenty,
  toTwentyObjectCreateInput,
  toTwentyObjectUpdateInput,
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
    submittedAt: '2026-07-14T15:00:00.000Z',
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

const personId = '89537ee7-3454-473b-bc68-130e7d3fd016'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('Twenty operational intake mapping', () => {
  it('maps normalized mortgage fields, timestamps, and stable identifiers into typed columns', () => {
    expect(toTwentyObjectCreateInput(lead, 'mortgage')).toMatchObject({
      id: lead.id,
      fairlendLeadId: lead.id,
      captureStatus: 'SUBMITTED',
      workflowStatus: 'QUALIFIED',
      priority: 'HIGH',
      capturedAt: lead.capturedAt,
      submittedAt: '2026-07-14T15:00:00.000Z',
      timestampProvenance: 'SOURCE_SUPPLIED',
      adminNotes: 'Borrower requested an afternoon call.',
      nextActionAt: '2026-07-15T18:00:00.000Z',
      mortgageProduct: 'private',
      amount: '$1,200,000',
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
    const update = toTwentyObjectUpdateInput(lead, 'mortgage')
    expect(update).not.toHaveProperty('workflowStatus')
    expect(update).not.toHaveProperty('priority')
    expect(update).not.toHaveProperty('nextActionAt')
    expect(update).not.toHaveProperty('adminNotes')
  })
})

describe('Twenty operational intake sync', () => {
  it('is explicitly disabled unless configured', async () => {
    const fetchMock = vi.fn()
    await expect(syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }))
      .resolves.toEqual({ status: 'disabled' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('deduplicates the person and patches the deterministic object record', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/rest/people?')) return Response.json({ data: { people: [{ id: personId }] } })
      if (url.includes('/rest/mortgageBorrowerLeads/')) return Response.json({ data: { id: lead.id } })
      if (url.includes('/rest/campaignTouches/')) return Response.json({ data: { id: lead.id } })
      return new Response(null, { status: 500 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })
    expect(result).toMatchObject({ status: 'synced', recordId: lead.id, objectKind: 'mortgage' })
    expect(result.status === 'synced' ? result.relatedRecords : []).toEqual([
      { objectKind: 'person', recordId: personId },
      { objectKind: 'campaignTouch', recordId: lead.id },
    ])
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes(`/rest/mortgageBorrowerLeads/${lead.id}`))).toBe(true)
  })

  it('creates missing Person, application, and campaign-touch records', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/rest/people?')) return Response.json({ data: { people: [] } })
      if (url.endsWith('/rest/people') && init?.method === 'POST') return Response.json({ id: personId }, { status: 201 })
      if (url.includes(`/rest/mortgageBorrowerLeads/${lead.id}`)) return new Response(null, { status: 404 })
      if (url.endsWith('/rest/mortgageBorrowerLeads')) return Response.json({ id: lead.id }, { status: 201 })
      if (url.includes('/rest/campaignTouches/')) return new Response(null, { status: 404 })
      if (url.endsWith('/rest/campaignTouches')) return Response.json({ id: lead.id }, { status: 201 })
      return new Response(null, { status: 500 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })
    expect(result).toMatchObject({ status: 'synced', recordId: lead.id, objectKind: 'mortgage' })

    const createCall = fetchMock.mock.calls.find(([url, init]) =>
      String(url).endsWith('/rest/mortgageBorrowerLeads') && init?.method === 'POST')
    expect(createCall).toBeDefined()
    expect(JSON.parse(String(createCall?.[1]?.body))).toMatchObject({
      id: lead.id,
      personId,
      workflowStatus: 'QUALIFIED',
      priority: 'HIGH',
      adminNotes: 'Borrower requested an afternoon call.',
      nextActionAt: '2026-07-15T18:00:00.000Z',
    })
  })

  it('re-reads a newly created Person when Twenty omits its id from the create response', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    let personLookupCount = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/rest/people?')) {
        personLookupCount += 1
        return Response.json({ data: { people: personLookupCount === 1 ? [] : [{ id: personId }] } })
      }
      if (url.endsWith('/rest/people') && init?.method === 'POST') {
        return Response.json({ data: {} }, { status: 201 })
      }
      if (url.includes(`/rest/mortgageBorrowerLeads/${lead.id}`)) return Response.json({ id: lead.id })
      if (url.includes('/rest/campaignTouches/')) return Response.json({ id: lead.id })
      return new Response(null, { status: 500 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })

    expect(personLookupCount).toBe(2)
    expect(result).toMatchObject({
      status: 'synced',
      relatedRecords: expect.arrayContaining([{ objectKind: 'person', recordId: personId }]),
    })
    const updateCall = fetchMock.mock.calls.find(([url]) =>
      String(url).includes(`/rest/mortgageBorrowerLeads/${lead.id}`))
    expect(JSON.parse(String(updateCall?.[1]?.body))).toMatchObject({ personId })
  })

  it('returns a bounded operational error without failing lead capture', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-api-key')
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('/rest/people?')) return Response.json({ data: { people: [{ id: personId }] } })
      return Response.json({ message: 'API key cannot access mortgageBorrowerLeads' }, { status: 403 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })
    expect(result).toEqual({
      status: 'failed',
      error: 'Twenty API could not update mortgage borrower lead: HTTP 403 (API key cannot access mortgageBorrowerLeads)',
    })
  })
})
