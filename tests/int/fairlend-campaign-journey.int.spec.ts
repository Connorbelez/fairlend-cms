import { neon } from '@neondatabase/serverless'
import { randomUUID } from 'node:crypto'
import { afterAll, describe, expect, it } from 'vitest'

import {
  persistFairlendCampaignScan,
  type FairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'
import {
  getFairlendCampaignJourneyAnalytics,
  recordFairlendCampaignJourneyEvent,
} from '@/lib/fairlend-campaign-journey'

const testCampaign = `journey-test-${randomUUID().slice(0, 8)}`

describe('FairLend campaign journey persistence and reporting', () => {
  afterAll(async () => {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')
    await sql`DELETE FROM fairlend_campaign_events WHERE campaign = ${testCampaign}`
    await sql`DELETE FROM fairlend_campaign_scans WHERE campaign = ${testCampaign}`
  })

  it('reports page paths, abandonment, intake forms, bounces, and successful outcomes', async () => {
    const successfulScan = await createScan()
    const bouncedScan = await createScan()

    await recordFairlendCampaignJourneyEvent({
      attribution: successfulScan,
      event: pageView('/', 'success-home'),
    })
    await recordFairlendCampaignJourneyEvent({
      attribution: successfulScan,
      event: pageView('/construction-financing', 'success-intake'),
    })
    await recordFairlendCampaignJourneyEvent({
      attribution: successfulScan,
      event: {
        eventId: `intake:${randomUUID()}`,
        eventType: 'intake_submitted',
        formId: 'drawflow-intake',
        formName: 'Drawflow intake',
        intakeType: 'mortgage',
        leadId: randomUUID(),
        pagePath: '/construction-financing',
      },
    })
    await recordFairlendCampaignJourneyEvent({
      attribution: bouncedScan,
      event: pageView('/borrowers', 'bounce-borrowers'),
    })

    const analytics = await getFairlendCampaignJourneyAnalytics([testCampaign])

    expect(analytics.performance).toEqual([
      expect.objectContaining({
        bouncedScanCount: 1,
        bounceRate: 50,
        campaign: testCampaign,
        scanCount: 2,
        successfulIntakeCount: 1,
        successfulIntakeRate: 50,
        trackedScanCount: 2,
      }),
    ])
    expect(analytics.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pagePath: '/', uniqueScanCount: 1 }),
        expect.objectContaining({ pagePath: '/borrowers', uniqueScanCount: 1 }),
        expect.objectContaining({ pagePath: '/construction-financing', uniqueScanCount: 1 }),
      ]),
    )
    expect(analytics.abandonments).toContainEqual(
      expect.objectContaining({ abandonedScanCount: 1, pagePath: '/borrowers' }),
    )
    expect(analytics.forms).toContainEqual(
      expect.objectContaining({ completionCount: 1, formName: 'Drawflow intake' }),
    )
    expect(analytics.recentJourneys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ outcome: 'successful_intake', scanId: successfulScan.scanId }),
        expect.objectContaining({ outcome: 'bounced', scanId: bouncedScan.scanId }),
      ]),
    )
  })
})

async function createScan(): Promise<FairlendCampaignAttribution> {
  const attribution: FairlendCampaignAttribution = {
    campaign: testCampaign,
    capturedAt: new Date().toISOString(),
    destination: '/',
    scanId: randomUUID(),
    source: 'qr-journey-test',
  }
  await persistFairlendCampaignScan(attribution)
  return attribution
}

function pageView(pagePath: string, label: string) {
  return {
    eventId: `page-view:${label}:${randomUUID()}`,
    eventType: 'page_view' as const,
    pagePath,
    visitId: randomUUID(),
  }
}
