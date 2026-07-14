import { neon } from '@neondatabase/serverless'

import { normalizeLeadPayload } from '@/lib/fairlend-leads'
import { syncFairlendLeadToTwenty } from '@/lib/twenty/client'

type ReconcileRow = {
  address: string | null
  addressDetails: Record<string, unknown> | null
  attribution: Record<string, unknown> | null
  campaign: string | null
  campaignScanId: string | null
  email: string | null
  formattedAddress: string | null
  intake: Record<string, unknown> | null
  intent: string | null
  leadId: string
  name: string | null
  nextActionAt: string | null
  phone: string | null
  placeId: string | null
  priority: 'high' | 'normal' | 'low'
  source: string
  status: 'draft' | 'started' | 'submitted'
  workflowStatus:
    | 'new'
    | 'contact_attempted'
    | 'contacted'
    | 'qualified'
    | 'consultation_booked'
    | 'working_file'
    | 'closed_won'
    | 'closed_lost'
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) throw new Error('DATABASE_URL or POSTGRES_URL is required')
if (process.env.TWENTY_SYNC_ENABLED !== 'true') {
  throw new Error('Set TWENTY_SYNC_ENABLED=true before running the Twenty reconciliation')
}

const sql = neon(connectionString)
const parsedLimit = Number(process.env.TWENTY_RECONCILE_LIMIT ?? '100')
const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 1000) : 100

const rows = (await sql`
  SELECT
    lead_id AS "leadId", status::text AS status,
    workflow_status::text AS "workflowStatus", priority::text AS priority,
    next_action_at::text AS "nextActionAt", intent, source, name, email, phone, address,
    formatted_address AS "formattedAddress", place_id AS "placeId", intake,
    address_details AS "addressDetails", campaign, campaign_scan_id AS "campaignScanId",
    attribution
  FROM fairlend_leads
  WHERE twenty_sync_status <> 'synced'
  ORDER BY updated_at ASC
  LIMIT ${limit}
`) as ReconcileRow[]

let synced = 0
let failed = 0

for (const [index, row] of rows.entries()) {
  const lead = normalizeLeadPayload({
    address: row.address ?? undefined,
    addressDetails: row.addressDetails ?? undefined,
    attribution: row.attribution ?? undefined,
    campaign: row.campaign ?? undefined,
    campaignScanId: row.campaignScanId ?? undefined,
    email: row.email ?? undefined,
    formattedAddress: row.formattedAddress ?? undefined,
    id: row.leadId,
    intake: row.intake ?? undefined,
    intent: row.intent ?? undefined,
    name: row.name ?? undefined,
    nextActionAt: row.nextActionAt ?? undefined,
    phone: row.phone ?? undefined,
    placeId: row.placeId ?? undefined,
    priority: row.priority,
    source: row.source,
    status: row.status,
    workflowStatus: row.workflowStatus,
  })
  const result = await syncFairlendLeadToTwenty(lead)

  if (result.status === 'synced') {
    synced += 1
    await sql`
      UPDATE fairlend_leads
      SET twenty_sync_status = 'synced', twenty_record_id = ${result.recordId},
          twenty_last_synced_at = now(), twenty_sync_error = NULL
      WHERE lead_id = ${row.leadId}
    `
  } else {
    failed += 1
    const error = result.status === 'failed' ? result.error : 'Twenty sync is disabled'
    await sql`
      UPDATE fairlend_leads
      SET twenty_sync_status = 'failed', twenty_sync_error = ${error}
      WHERE lead_id = ${row.leadId}
    `
  }

  if (index < rows.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, 650))
  }
}

console.info(`Twenty reconciliation complete: ${synced} synced, ${failed} failed, ${rows.length} processed`)
if (failed > 0) process.exitCode = 1
