import { createHmac, timingSafeEqual } from 'crypto'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

const tokenVersion = 'v1'
let analyticsSql: NeonQueryFunction<false, false> | null = null
let analyticsSchemaReady = false

export type LeadAnalyticsIdentity = {
  distinctId: string
  revocationToken: string
}

export function deriveLeadAnalyticsDistinctId(leadId: string): string {
  return `fl_${hmac(`distinct:${leadId}`).slice(0, 43)}`
}

export function deriveLifecycleInsertId(leadId: string, eventName: string): string {
  return `fl_evt_${hmac(`event:${leadId}:${eventName}`).slice(0, 43)}`
}

export function createAnalyticsRevocationToken(leadId: string): string {
  const encodedLeadId = Buffer.from(leadId, 'utf8').toString('base64url')
  const payload = `${tokenVersion}.${encodedLeadId}`
  return `${payload}.${hmac(`revoke:${payload}`)}`
}

export function verifyAnalyticsRevocationToken(token: string): string | null {
  const [version, encodedLeadId, suppliedSignature] = token.split('.')
  if (version !== tokenVersion || !encodedLeadId || !suppliedSignature) return null
  const payload = `${version}.${encodedLeadId}`
  const expectedSignature = hmac(`revoke:${payload}`)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null
  try {
    const leadId = Buffer.from(encodedLeadId, 'base64url').toString('utf8')
    return /^[0-9a-f-]{36}$/i.test(leadId) ? leadId : null
  } catch {
    return null
  }
}

export async function registerLeadAnalyticsConsent(
  leadId: string,
): Promise<LeadAnalyticsIdentity> {
  const sql = getAnalyticsSql()
  await ensureAnalyticsSchema(sql)
  await sql`
    UPDATE fairlend_leads
    SET analytics_eligible = true, analytics_consented_at = now(),
        analytics_revoked_at = NULL, updated_at = now()
    WHERE lead_id = ${leadId}
  `
  return {
    distinctId: deriveLeadAnalyticsDistinctId(leadId),
    revocationToken: createAnalyticsRevocationToken(leadId),
  }
}

export async function revokeLeadAnalyticsConsent(token: string): Promise<boolean> {
  const leadId = verifyAnalyticsRevocationToken(token)
  if (!leadId) return false
  const sql = getAnalyticsSql()
  await ensureAnalyticsSchema(sql)
  await sql`
    UPDATE fairlend_leads
    SET analytics_eligible = false, analytics_revoked_at = now(), updated_at = now()
    WHERE lead_id = ${leadId}
  `
  return true
}

export async function listAnalyticsEligibleLifecycleLeads(limit = 500): Promise<
  Array<{
    intent: string | null
    leadId: string
    source: string
    twentyObjectKind: string
    twentyRecordId: string
  }>
> {
  const sql = getAnalyticsSql()
  await ensureAnalyticsSchema(sql)
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 1000)
  return (await sql`
    SELECT lead_id AS "leadId", intent, source,
           twenty_object_kind AS "twentyObjectKind",
           twenty_record_id AS "twentyRecordId"
    FROM fairlend_leads
    WHERE analytics_eligible = true
      AND analytics_revoked_at IS NULL
      AND twenty_sync_status = 'synced'
      AND twenty_record_id IS NOT NULL
      AND twenty_object_kind IS NOT NULL
    ORDER BY updated_at ASC
    LIMIT ${safeLimit}
  `) as Array<{
    intent: string | null
    leadId: string
    source: string
    twentyObjectKind: string
    twentyRecordId: string
  }>
}

function hmac(value: string): string {
  const secret = process.env.POSTHOG_PERSON_ID_SALT?.trim()
  if (!secret || secret.length < 32) {
    throw new Error('POSTHOG_PERSON_ID_SALT must contain at least 32 characters')
  }
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function getAnalyticsSql(): NeonQueryFunction<false, false> {
  if (analyticsSql) return analyticsSql
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) throw new Error('DATABASE_URL or POSTGRES_URL is required')
  analyticsSql = neon(connectionString)
  return analyticsSql
}

async function ensureAnalyticsSchema(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (analyticsSchemaReady) return
  await sql`
    ALTER TABLE fairlend_leads
      ADD COLUMN IF NOT EXISTS analytics_eligible boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS analytics_consented_at timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS analytics_revoked_at timestamp(3) with time zone
  `
  await sql`
    CREATE INDEX IF NOT EXISTS fairlend_leads_analytics_eligible_idx
      ON fairlend_leads USING btree (analytics_eligible)
  `
  analyticsSchemaReady = true
}
