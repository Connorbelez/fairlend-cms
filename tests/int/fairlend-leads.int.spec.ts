import { describe, expect, it } from 'vitest'

import { normalizeLeadPayload } from '@/lib/fairlend-leads'

describe('Fairlend lead normalization', () => {
  it('trims lead fields and keeps valid ids', () => {
    const lead = normalizeLeadPayload({
      address: '  123 Main Street  ',
      email: ' borrower@example.com ',
      id: '8c5b0d5a-7f10-4f8e-a6ed-8b1f6cbe0df4',
      intent: ' build ',
      name: ' Jane Borrower ',
      phone: ' 416-555-0101 ',
      source: ' homepage ',
      status: 'submitted',
    })

    expect(lead).toMatchObject({
      address: '123 Main Street',
      email: 'borrower@example.com',
      id: '8c5b0d5a-7f10-4f8e-a6ed-8b1f6cbe0df4',
      intent: 'build',
      name: 'Jane Borrower',
      phone: '416-555-0101',
      source: 'homepage',
      status: 'submitted',
    })
  })

  it('generates a new id and defaults invalid optional values', () => {
    const lead = normalizeLeadPayload({
      addressDetails: [],
      id: 'not-a-real-id',
      intake: [],
      status: 'done' as never,
    })

    expect(lead.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
    expect(lead.addressDetails).toEqual({})
    expect(lead.intake).toEqual({})
    expect(lead.source).toBe('website')
    expect(lead.status).toBe('started')
  })
})
