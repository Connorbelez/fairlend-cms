import { neon } from '@neondatabase/serverless'
import { getPayload, type Payload } from 'payload'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { FairlendLeads } from '@/collections/FairlendLeads'
import { persistFairlendCampaignScan } from '@/lib/fairlend-campaign-attribution'
import {
  deriveFairlendLeadIntakeDetails,
  mergeFairlendLeadAdminData,
  normalizeLeadPayload,
  toFairlendLeadAdminData,
  upsertFairlendLead,
} from '@/lib/fairlend-leads'

let payload: Payload | null = null
const dbBackedDescribe = process.env.POSTGRES_URL ? describe : describe.skip
const createdLeadIds = new Set<string>()
const createdScanIds = new Set<string>()

describe('Fairlend lead normalization', () => {
  it('trims lead fields and keeps valid ids', () => {
    const lead = normalizeLeadPayload({
      address: '  123 Main Street  ',
      email: ' borrower@example.com ',
      id: '8c5b0d5a-7f10-4f8e-a6ed-8b1f6cbe0df4',
      intent: ' build ',
      name: ' Jane Borrower ',
      phone: ' 416-555-0101 ',
      priority: 'high',
      attribution: { capturedAt: '2026-07-08T12:00:00.000Z' },
      campaign: ' v1 ',
      campaignScanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
      source: ' homepage ',
      status: 'submitted',
      workflowStatus: 'qualified',
    })

    expect(lead).toMatchObject({
      address: '123 Main Street',
      email: 'borrower@example.com',
      id: '8c5b0d5a-7f10-4f8e-a6ed-8b1f6cbe0df4',
      intent: 'build',
      name: 'Jane Borrower',
      phone: '416-555-0101',
      priority: 'high',
      attribution: { capturedAt: '2026-07-08T12:00:00.000Z' },
      campaign: 'v1',
      campaignScanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
      source: 'homepage',
      status: 'submitted',
      workflowStatus: 'qualified',
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
    expect(lead.attribution).toEqual({})
    expect(lead.campaign).toBeNull()
    expect(lead.campaignScanId).toBeNull()
    expect(lead.intake).toEqual({})
    expect(lead.priority).toBe('normal')
    expect(lead.source).toBe('website')
    expect(lead.status).toBe('started')
    expect(lead.workflowStatus).toBe('new')
  })

  it('extracts table-ready details from variable intake payloads', () => {
    const details = deriveFairlendLeadIntakeDetails(
      {
        additionalLiens: 'No additional liens',
        amount: '$250K-$500K',
        detail: 'Bank declined the file, closing in two weeks.',
        requestedIntent: 'mortgage',
        timeline: 'Closing in 2 weeks',
      },
      'mortgage',
    )

    expect(details).toEqual({
      intakeAdditionalLiens: 'No additional liens',
      intakeAmount: '$250K-$500K',
      intakeDetail: 'Bank declined the file, closing in two weeks.',
      intakeFinancingNeeds: null,
      intakeInvestmentFocus: null,
      intakeMortgageGoal: null,
      intakeMortgageBalance: null,
      intakeMortgageProduct: null,
      intakeProjectStage: null,
      intakePropertyValue: null,
      intakeSummary:
        'Type: mortgage | Amount: $250K-$500K | Timeline: Closing in 2 weeks | Additional liens: No additional liens | Notes: Bank declined the file, closing in two weeks.',
      intakeTimeline: 'Closing in 2 weeks',
      intakeType: 'mortgage',
    })
  })

  it('normalizes the residential mortgage lane and step-one goal for admin routing', () => {
    const details = deriveFairlendLeadIntakeDetails(
      {
        mortgageProduct: 'institutional',
        requestedIntent: 'mortgage',
        situation: 'First-time home buyer',
      },
      'mortgage',
    )

    expect(details).toMatchObject({
      intakeMortgageGoal: 'First-time home buyer',
      intakeMortgageProduct: 'institutional',
      intakeSummary:
        'Type: mortgage | Mortgage lane: institutional | Mortgage goal: First-time home buyer',
    })
  })

  it('summarizes rental-property refinance debt for admin review', () => {
    const details = deriveFairlendLeadIntakeDetails(
      {
        additionalLienDetails: 'Second mortgage balance is approximately $95,000.',
        additionalLiens: 'First mortgage plus other liens / encumbrances',
        amount: '$900,000',
        currentMortgage: '$700,000',
        mortgageProduct: 'rental-property',
        propertyValue: '$1,600,000',
        requestedIntent: 'mortgage',
        situation: 'Refinance',
        timeline: 'Within 30 days',
      },
      'mortgage',
    )

    expect(details).toMatchObject({
      intakeAdditionalLiens: 'First mortgage plus other liens / encumbrances',
      intakeAmount: '$900,000',
      intakeDetail: 'Second mortgage balance is approximately $95,000.',
      intakeMortgageBalance: '$700,000',
      intakeMortgageGoal: 'Refinance',
      intakeMortgageProduct: 'rental-property',
      intakePropertyValue: '$1,600,000',
      intakeTimeline: 'Within 30 days',
    })
    expect(details.intakeSummary).toContain('Mortgage lane: rental-property')
    expect(details.intakeSummary).toContain('Balance: $700,000')
  })

  it('uses the selected project scope as the build intake type', () => {
    const details = deriveFairlendLeadIntakeDetails(
      {
        projectScope: 'Garden & laneway suites',
        projectStage: 'Permit submitted',
      },
      'build',
    )

    expect(details.intakeType).toBe('Garden & laneway suites')
    expect(details.intakeSummary).toBe('Type: Garden & laneway suites | Stage: Permit submitted')
  })

  it('maps normalized leads to the Payload admin collection shape', () => {
    const lead = normalizeLeadPayload({
      address: '88 Build Lane',
      addressDetails: { city: 'Toronto' },
      email: 'owner@example.com',
      formattedAddress: '88 Build Lane, Toronto, ON, Canada',
      id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
      intake: { projectStage: 'Permits submitted' },
      intent: 'build',
      attribution: { campaign: 'v1' },
      campaign: 'v1',
      campaignScanId: 'abf75b9b-86ca-4912-a0e7-d717fcfa51b9',
      name: 'Sam Owner',
      phone: '416-555-0199',
      placeId: 'place-88-build',
      source: 'drawflow-intake',
      status: 'submitted',
    })

    expect(toFairlendLeadAdminData(lead)).toEqual({
      address: '88 Build Lane',
      addressDetails: { city: 'Toronto' },
      adminNotes: null,
      attribution: { campaign: 'v1' },
      campaign: 'v1',
      campaignScanId: 'abf75b9b-86ca-4912-a0e7-d717fcfa51b9',
      email: 'owner@example.com',
      formattedAddress: '88 Build Lane, Toronto, ON, Canada',
      intake: { projectStage: 'Permits submitted' },
      intakeAdditionalLiens: null,
      intakeAmount: null,
      intakeDetail: null,
      intakeFinancingNeeds: null,
      intakeInvestmentFocus: null,
      intakeMortgageGoal: null,
      intakeMortgageBalance: null,
      intakeMortgageProduct: null,
      intakeProjectStage: 'Permits submitted',
      intakePropertyValue: null,
      intakeSummary: 'Type: build | Stage: Permits submitted',
      intakeTimeline: null,
      intakeType: 'build',
      intent: 'build',
      leadId: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
      name: 'Sam Owner',
      nextActionAt: null,
      phone: '416-555-0199',
      placeId: 'place-88-build',
      priority: 'normal',
      source: 'drawflow-intake',
      status: 'submitted',
      workflowStatus: 'new',
    })
  })

  it('exposes mortgage routing fields and additional liens in the Payload admin table columns', () => {
    expect(FairlendLeads.admin?.defaultColumns).toContain('intakeAdditionalLiens')
    expect(FairlendLeads.admin?.defaultColumns).toContain('intakeMortgageGoal')
    expect(FairlendLeads.admin?.defaultColumns).toContain('intakeMortgageProduct')
  })

  it('preserves existing admin contact and JSON data when later drafts omit it', () => {
    const existing = toFairlendLeadAdminData(
      normalizeLeadPayload({
        email: 'saved@example.com',
        id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
        attribution: { campaign: 'v1', scanId: '5ff32066-e323-4bba-986a-61c86b3bfb50' },
        campaign: 'v1',
        campaignScanId: '5ff32066-e323-4bba-986a-61c86b3bfb50',
        intake: { projectStage: 'Permit ready' },
        name: 'Saved Lead',
        phone: '416-555-0100',
        priority: 'high',
        source: 'homepage-application-form',
        status: 'started',
        workflowStatus: 'qualified',
      }),
    )
    existing.adminNotes = 'Call after permit package arrives.'
    existing.nextActionAt = '2026-07-07T15:00:00.000Z'
    const incoming = toFairlendLeadAdminData(
      normalizeLeadPayload({
        id: '5ab72f3d-7bb1-4b44-a4f1-c5b4f5453ad4',
        source: 'drawflow-intake',
        status: 'draft',
      }),
    )

    expect(mergeFairlendLeadAdminData(incoming, existing)).toMatchObject({
      email: 'saved@example.com',
      intake: { projectStage: 'Permit ready' },
      intakeProjectStage: 'Permit ready',
      intakeSummary: 'Stage: Permit ready',
      adminNotes: 'Call after permit package arrives.',
      attribution: { campaign: 'v1', scanId: '5ff32066-e323-4bba-986a-61c86b3bfb50' },
      campaign: 'v1',
      campaignScanId: '5ff32066-e323-4bba-986a-61c86b3bfb50',
      name: 'Saved Lead',
      nextActionAt: '2026-07-07T15:00:00.000Z',
      phone: '416-555-0100',
      priority: 'high',
      source: 'drawflow-intake',
      status: 'draft',
      workflowStatus: 'qualified',
    })
  })
})

dbBackedDescribe('Fairlend lead admin visibility', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 60_000)

  afterEach(async () => {
    if (!payload || (createdLeadIds.size === 0 && createdScanIds.size === 0)) {
      return
    }

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')

    await Promise.all(
      [...createdLeadIds].map(async (leadId) => {
        const existing = await payload!.find({
          collection: 'fairlend-leads',
          limit: 10,
          overrideAccess: true,
          pagination: false,
          where: {
            leadId: {
              equals: leadId,
            },
          },
        })

        await Promise.all(
          existing.docs.map((doc) =>
            payload!.delete({
              id: doc.id,
              collection: 'fairlend-leads',
              overrideAccess: true,
            }),
          ),
        )

        await sql`DELETE FROM fairlend.leads WHERE id = ${leadId}`
      }),
    )

    await Promise.all(
      [...createdScanIds].map(async (scanId) => {
        await sql`DELETE FROM fairlend_campaign_scans WHERE scan_id = ${scanId}`
      }),
    )

    createdLeadIds.clear()
    createdScanIds.clear()
  })

  it('mirrors submitted intake leads into the Payload admin collection', async () => {
    const leadId = '3dc0811f-139b-49a9-a0d7-6ef364c9a40f'
    createdLeadIds.add(leadId)

    await upsertFairlendLead({
      address: '101 Admin View Road',
      email: 'lead-admin-visibility@example.com',
      id: leadId,
      intake: {
        additionalLiens: 'No additional liens',
        financingNeeds: ['Construction financing'],
        projectStage: 'Permit ready',
      },
      intent: 'build',
      name: 'Admin Visible Lead',
      phone: '416-555-0142',
      source: 'drawflow-intake',
      status: 'submitted',
    })

    const leads = await payload!.find({
      collection: 'fairlend-leads',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        leadId: {
          equals: leadId,
        },
      },
    })

    expect(leads.docs).toHaveLength(1)
    expect(leads.docs[0]).toMatchObject({
      address: '101 Admin View Road',
      email: 'lead-admin-visibility@example.com',
      intake: {
        additionalLiens: 'No additional liens',
        financingNeeds: ['Construction financing'],
        projectStage: 'Permit ready',
      },
      intakeAdditionalLiens: 'No additional liens',
      intakeFinancingNeeds: 'Construction financing',
      intakeProjectStage: 'Permit ready',
      intakeSummary:
        'Type: build | Stage: Permit ready | Financing: Construction financing | Additional liens: No additional liens',
      intakeType: 'build',
      intent: 'build',
      leadId,
      name: 'Admin Visible Lead',
      phone: '416-555-0142',
      priority: 'normal',
      source: 'drawflow-intake',
      status: 'submitted',
      workflowStatus: 'new',
    })
  }, 60_000)

  it('keeps earlier admin contact data when a later autosave omits it', async () => {
    const leadId = 'deefe7e1-fc9a-44e8-97a8-9f3757ec9842'
    createdLeadIds.add(leadId)

    await upsertFairlendLead({
      email: 'preserved-admin-lead@example.com',
      id: leadId,
      intake: {
        projectStage: 'Zoning review',
      },
      name: 'Preserved Admin Lead',
      phone: '416-555-0188',
      source: 'homepage-application-form',
      status: 'started',
    })

    await upsertFairlendLead({
      id: leadId,
      source: 'drawflow-intake',
      status: 'draft',
    })

    const leads = await payload!.find({
      collection: 'fairlend-leads',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        leadId: {
          equals: leadId,
        },
      },
    })

    expect(leads.docs).toHaveLength(1)
    expect(leads.docs[0]).toMatchObject({
      email: 'preserved-admin-lead@example.com',
      intake: {
        projectStage: 'Zoning review',
      },
      intakeProjectStage: 'Zoning review',
      intakeSummary: 'Stage: Zoning review',
      leadId,
      name: 'Preserved Admin Lead',
      phone: '416-555-0188',
      source: 'drawflow-intake',
      status: 'draft',
    })
  }, 60_000)

  it('marks a QR campaign scan as converted when the attributed lead is submitted', async () => {
    const leadId = '876706d4-ad36-49f1-8a37-12fdf5c6b30d'
    const scanId = 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb'
    createdLeadIds.add(leadId)
    createdScanIds.add(scanId)

    await persistFairlendCampaignScan({
      campaign: 'v1',
      capturedAt: '2026-07-08T12:00:00.000Z',
      destination: '/',
      scanId,
      source: 'qr-v1',
    })

    await upsertFairlendLead({
      campaign: 'v1',
      campaignScanId: scanId,
      email: 'qr-converted@example.com',
      id: leadId,
      intent: 'build',
      source: 'homepage-build-application-form',
      status: 'submitted',
    })

    const scans = await payload!.find({
      collection: 'fairlend-campaign-scans',
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        scanId: {
          equals: scanId,
        },
      },
    })

    expect(scans.docs).toHaveLength(1)
    expect(scans.docs[0]).toMatchObject({
      campaign: 'v1',
      convertedLeadId: leadId,
      scanId,
      source: 'qr-v1',
    })
    expect(scans.docs[0]?.convertedAt).toBeTruthy()
  }, 60_000)
})
