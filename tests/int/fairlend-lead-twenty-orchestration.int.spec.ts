import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  markCampaignConverted: vi.fn(async () => undefined),
  sql: vi.fn(async (_strings: TemplateStringsArray, ..._values: unknown[]) => []),
  syncToTwenty: vi.fn(),
}))

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mocks.sql),
}))

vi.mock('@/lib/fairlend-campaign-attribution', () => ({
  ensureCampaignScanLockedDocumentRelation: vi.fn(async () => undefined),
  markFairlendCampaignScanConverted: mocks.markCampaignConverted,
}))

vi.mock('@/lib/twenty/client', () => ({
  syncFairlendLeadToTwenty: mocks.syncToTwenty,
}))

import { upsertFairlendLead } from '@/lib/fairlend-leads'

describe('FairLend lead capture → Twenty orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('persists locally, syncs the normalized lead to Twenty, and records the remote id', async () => {
    const leadId = '607a744e-56e4-464b-8262-734e8d7f399a'
    mocks.syncToTwenty.mockResolvedValue({ status: 'synced', recordId: leadId })

    await expect(
      upsertFairlendLead({
        address: '123 Main Street, Toronto, ON',
        adminNotes: 'Call after 2 PM.',
        email: 'new-lead@example.com',
        id: leadId,
        intake: {
          amountNeeded: '$750,000',
          projectStage: 'Permit ready',
          requestedIntent: 'build',
          timeline: 'Within 30 days',
        },
        intent: 'build',
        name: 'New Lead',
        nextActionAt: '2026-07-15T18:00:00.000Z',
        phone: '416-555-0199',
        source: 'drawflow-intake',
        status: 'started',
      }),
    ).resolves.toEqual({ id: leadId })

    expect(mocks.syncToTwenty).toHaveBeenCalledOnce()
    expect(mocks.syncToTwenty).toHaveBeenCalledWith(
      expect.objectContaining({
        adminNotes: 'Call after 2 PM.',
        email: 'new-lead@example.com',
        id: leadId,
        intakeAmount: '$750,000',
        intakeProjectStage: 'Permit ready',
        intakeTimeline: 'Within 30 days',
        name: 'New Lead',
        nextActionAt: '2026-07-15T18:00:00.000Z',
        phone: '416-555-0199',
        source: 'drawflow-intake',
      }),
    )

    const statements = mocks.sql.mock.calls.map(([strings]) =>
      Array.isArray(strings) ? strings.join(' ') : String(strings),
    )

    expect(statements.some((statement) => statement.includes('INSERT INTO fairlend.leads'))).toBe(
      true,
    )
    expect(statements.some((statement) => statement.includes('INSERT INTO fairlend_leads'))).toBe(
      true,
    )
    expect(
      statements.some(
        (statement) =>
          statement.includes('UPDATE fairlend_leads') &&
          statement.includes("twenty_sync_status = 'synced'"),
      ),
    ).toBe(true)
  })
})
