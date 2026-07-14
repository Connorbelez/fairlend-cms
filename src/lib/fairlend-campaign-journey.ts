import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

import type { FairlendCampaignAttribution } from '@/lib/fairlend-campaign-attribution'

export const fairlendCampaignJourneyEventTypes = [
  'page_view',
  'page_exit',
  'intake_started',
  'intake_submitted',
  'consultation_booked',
  'form_started',
  'form_submitted',
] as const

export type FairlendCampaignJourneyEventType = (typeof fairlendCampaignJourneyEventTypes)[number]

export type FairlendCampaignJourneyEventInput = {
  durationMs?: null | number
  eventId: string
  eventType: FairlendCampaignJourneyEventType
  formId?: null | string
  formName?: null | string
  intakeType?: null | string
  leadId?: null | string
  pagePath?: null | string
  occurredAt?: null | string
  visitId?: null | string
}

export type CampaignJourneyPerformance = {
  bouncedScanCount: number
  bounceRate: number
  campaign: string
  scanCount: number
  successfulIntakeCount: number
  successfulIntakeRate: number
  trackedScanCount: number
}

export type CampaignPageBreakdown = {
  campaign: string
  pagePath: string
  pageViewCount: number
  uniqueScanCount: number
}

export type CampaignAbandonmentBreakdown = {
  abandonedScanCount: number
  campaign: string
  pagePath: string
}

export type CampaignFormBreakdown = {
  campaign: string
  completionCount: number
  eventType: FairlendCampaignJourneyEventType
  formId: string | null
  formName: string
  intakeType: string | null
}

export type RecentCampaignJourney = {
  campaign: string
  capturedAt: string
  formName: string | null
  outcome: 'bounced' | 'browsing' | 'intake_abandoned' | 'not_tracked' | 'successful_intake'
  pagePaths: string[]
  scanId: string
}

export type FairlendCampaignJourneyAnalytics = {
  abandonments: CampaignAbandonmentBreakdown[]
  forms: CampaignFormBreakdown[]
  pages: CampaignPageBreakdown[]
  performance: CampaignJourneyPerformance[]
  recentJourneys: RecentCampaignJourney[]
}

const successfulEventTypes: FairlendCampaignJourneyEventType[] = [
  'consultation_booked',
  'form_submitted',
  'intake_submitted',
]
const engagementEventTypes: FairlendCampaignJourneyEventType[] = [
  ...successfulEventTypes,
  'form_started',
  'intake_started',
]
const maxEventsPerScan = 1000

let journeySql: NeonQueryFunction<false, false> | null = null
let journeySchemaReady = false

export async function recordFairlendCampaignJourneyEvent({
  attribution,
  event,
}: {
  attribution: FairlendCampaignAttribution
  event: FairlendCampaignJourneyEventInput
}): Promise<void> {
  const normalized = normalizeJourneyEvent(event)
  const sql = getJourneySql()

  await ensureFairlendCampaignJourneySchema(sql)
  await sql`
    INSERT INTO fairlend_campaign_events AS event (
      event_id,
      scan_id,
      campaign,
      event_type,
      page_path,
      visit_id,
      duration_ms,
      form_id,
      form_name,
      intake_type,
      lead_id,
      occurred_at,
      created_at,
      updated_at
    )
    SELECT
      ${normalized.eventId},
      ${attribution.scanId},
      ${attribution.campaign},
      ${normalized.eventType},
      ${normalized.pagePath},
      ${normalized.visitId},
      ${normalized.durationMs},
      ${normalized.formId},
      ${normalized.formName},
      ${normalized.intakeType},
      ${normalized.leadId},
      ${normalized.occurredAt},
      now(),
      now()
    WHERE (
      SELECT count(*)
      FROM fairlend_campaign_events
      WHERE scan_id = ${attribution.scanId}
    ) < ${maxEventsPerScan}
    ON CONFLICT (event_id) DO NOTHING
  `
}

export async function getFairlendCampaignJourneyAnalytics(
  campaigns: string[],
): Promise<FairlendCampaignJourneyAnalytics> {
  if (campaigns.length === 0) {
    return { abandonments: [], forms: [], pages: [], performance: [], recentJourneys: [] }
  }

  const campaignSet = new Set(campaigns)
  const sql = getJourneySql()
  await ensureFairlendCampaignJourneySchema(sql)

  const [performanceRows, pageRows, abandonmentRows, formRows, recentRows] = await Promise.all([
    sql`
      WITH page_views AS (
        SELECT campaign, scan_id, count(*)::int AS page_view_count
        FROM fairlend_campaign_events
        WHERE event_type = 'page_view' AND campaign = ANY(${campaigns})
        GROUP BY campaign, scan_id
      ), successful AS (
        SELECT DISTINCT campaign, scan_id
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${successfulEventTypes}) AND campaign = ANY(${campaigns})
      ), engaged AS (
        SELECT DISTINCT campaign, scan_id
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${engagementEventTypes}) AND campaign = ANY(${campaigns})
      )
      SELECT
        scan.campaign,
        count(*)::int AS scan_count,
        count(page_views.scan_id)::int AS tracked_scan_count,
        count(*) FILTER (
          WHERE successful.scan_id IS NOT NULL OR scan.converted_lead_id IS NOT NULL
        )::int AS successful_intake_count,
        count(*) FILTER (
          WHERE page_views.page_view_count = 1
            AND successful.scan_id IS NULL
            AND engaged.scan_id IS NULL
            AND scan.converted_lead_id IS NULL
        )::int AS bounced_scan_count
      FROM fairlend_campaign_scans scan
      LEFT JOIN page_views ON page_views.scan_id = scan.scan_id
      LEFT JOIN successful ON successful.scan_id = scan.scan_id
      LEFT JOIN engaged ON engaged.scan_id = scan.scan_id
      WHERE scan.campaign = ANY(${campaigns})
      GROUP BY scan.campaign
    `,
    sql`
      SELECT
        campaign,
        page_path,
        count(*)::int AS page_view_count,
        count(DISTINCT scan_id)::int AS unique_scan_count
      FROM fairlend_campaign_events
      WHERE event_type = 'page_view'
        AND page_path IS NOT NULL
        AND campaign = ANY(${campaigns})
      GROUP BY campaign, page_path
      ORDER BY unique_scan_count DESC, page_view_count DESC, page_path ASC
    `,
    sql`
      WITH successful AS (
        SELECT DISTINCT scan_id
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${successfulEventTypes}) AND campaign = ANY(${campaigns})
      ), last_pages AS (
        SELECT DISTINCT ON (scan_id)
          campaign,
          scan_id,
          page_path
        FROM fairlend_campaign_events
        WHERE event_type = 'page_view'
          AND page_path IS NOT NULL
          AND campaign = ANY(${campaigns})
        ORDER BY scan_id, occurred_at DESC
      )
      SELECT
        last_pages.campaign,
        last_pages.page_path,
        count(*)::int AS abandoned_scan_count
      FROM last_pages
      LEFT JOIN successful ON successful.scan_id = last_pages.scan_id
      WHERE successful.scan_id IS NULL
      GROUP BY last_pages.campaign, last_pages.page_path
      ORDER BY abandoned_scan_count DESC, last_pages.page_path ASC
    `,
    sql`
      SELECT
        campaign,
        event_type,
        form_id,
        COALESCE(form_name, intake_type, form_id, 'Unknown intake') AS form_name,
        intake_type,
        count(DISTINCT scan_id)::int AS completion_count
      FROM fairlend_campaign_events
      WHERE event_type = ANY(${successfulEventTypes}) AND campaign = ANY(${campaigns})
      GROUP BY campaign, event_type, form_id, form_name, intake_type
      ORDER BY completion_count DESC, form_name ASC
    `,
    sql`
      WITH successful AS (
        SELECT DISTINCT scan_id
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${successfulEventTypes}) AND campaign = ANY(${campaigns})
      ), engaged AS (
        SELECT DISTINCT scan_id
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${engagementEventTypes}) AND campaign = ANY(${campaigns})
      ), page_rollup AS (
        SELECT
          scan_id,
          array_agg(page_path ORDER BY occurred_at) FILTER (
            WHERE event_type = 'page_view' AND page_path IS NOT NULL
          ) AS page_paths,
          count(*) FILTER (WHERE event_type = 'page_view')::int AS page_view_count
        FROM fairlend_campaign_events
        WHERE campaign = ANY(${campaigns})
        GROUP BY scan_id
      ), form_rollup AS (
        SELECT DISTINCT ON (scan_id)
          scan_id,
          COALESCE(form_name, intake_type, form_id) AS form_name
        FROM fairlend_campaign_events
        WHERE event_type = ANY(${successfulEventTypes}) AND campaign = ANY(${campaigns})
        ORDER BY scan_id, occurred_at DESC
      )
      SELECT
        scan.scan_id,
        scan.campaign,
        scan.captured_at,
        COALESCE(page_rollup.page_paths, ARRAY[]::varchar[]) AS page_paths,
        COALESCE(page_rollup.page_view_count, 0)::int AS page_view_count,
        form_rollup.form_name,
        (engaged.scan_id IS NOT NULL) AS engaged,
        (successful.scan_id IS NOT NULL OR scan.converted_lead_id IS NOT NULL) AS successful
      FROM fairlend_campaign_scans scan
      LEFT JOIN page_rollup ON page_rollup.scan_id = scan.scan_id
      LEFT JOIN form_rollup ON form_rollup.scan_id = scan.scan_id
      LEFT JOIN successful ON successful.scan_id = scan.scan_id
      LEFT JOIN engaged ON engaged.scan_id = scan.scan_id
      WHERE scan.campaign = ANY(${campaigns})
      ORDER BY scan.captured_at DESC
      LIMIT 12
    `,
  ])

  return {
    abandonments: abandonmentRows
      .map(normalizeAbandonmentRow)
      .filter((row) => campaignSet.has(row.campaign)),
    forms: formRows.map(normalizeFormRow).filter((row) => campaignSet.has(row.campaign)),
    pages: pageRows.map(normalizePageRow).filter((row) => campaignSet.has(row.campaign)),
    performance: performanceRows
      .map(normalizePerformanceRow)
      .filter((row) => campaignSet.has(row.campaign)),
    recentJourneys: recentRows
      .map(normalizeRecentJourneyRow)
      .filter((row) => campaignSet.has(row.campaign)),
  }
}

export async function ensureFairlendCampaignJourneySchema(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  if (journeySchemaReady) return

  await sql`
    CREATE TABLE IF NOT EXISTS fairlend_campaign_events (
      id serial PRIMARY KEY,
      event_id varchar NOT NULL,
      scan_id varchar NOT NULL,
      campaign varchar NOT NULL,
      event_type varchar NOT NULL,
      page_path varchar,
      visit_id varchar,
      duration_ms integer,
      form_id varchar,
      form_name varchar,
      intake_type varchar,
      lead_id varchar,
      occurred_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      CONSTRAINT fairlend_campaign_events_event_id_unique UNIQUE(event_id)
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_events_scan_id_idx ON fairlend_campaign_events USING btree (scan_id)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_events_campaign_idx ON fairlend_campaign_events USING btree (campaign)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_events_event_type_idx ON fairlend_campaign_events USING btree (event_type)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_events_page_path_idx ON fairlend_campaign_events USING btree (page_path)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_events_occurred_at_idx ON fairlend_campaign_events USING btree (occurred_at)`
  await ensureCampaignEventLockedDocumentRelation(sql)
  journeySchemaReady = true
}

function getJourneySql(): NeonQueryFunction<false, false> {
  if (journeySql) return journeySql

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required for FairLend campaign journeys')
  }

  journeySql = neon(connectionString)
  return journeySql
}

async function ensureCampaignEventLockedDocumentRelation(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  await sql`
    DO $$
    BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE payload_locked_documents_rels
          ADD COLUMN IF NOT EXISTS fairlend_campaign_events_id integer;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'payload_locked_documents_rels_fairlend_campaign_events_fk'
        ) THEN
          ALTER TABLE payload_locked_documents_rels
            ADD CONSTRAINT payload_locked_documents_rels_fairlend_campaign_events_fk
            FOREIGN KEY (fairlend_campaign_events_id) REFERENCES fairlend_campaign_events(id)
            ON DELETE cascade ON UPDATE no action;
        END IF;
      END IF;
    END $$;
  `
  await sql`
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_fairlend_campaign_events_id_idx
      ON payload_locked_documents_rels USING btree (fairlend_campaign_events_id)
  `
}

function normalizeJourneyEvent(
  event: FairlendCampaignJourneyEventInput,
): Required<Omit<FairlendCampaignJourneyEventInput, 'durationMs'>> & { durationMs: number | null } {
  if (!fairlendCampaignJourneyEventTypes.includes(event.eventType)) {
    throw new Error('Unsupported FairLend campaign journey event type')
  }

  const eventId = normalizeText(event.eventId, 160)
  if (!eventId || !/^[a-zA-Z0-9:_-]+$/.test(eventId)) {
    throw new Error('A valid campaign journey event id is required')
  }

  return {
    durationMs: normalizeDuration(event.durationMs),
    eventId,
    eventType: event.eventType,
    formId: normalizeText(event.formId, 160),
    formName: normalizeText(event.formName, 240),
    intakeType: normalizeText(event.intakeType, 160),
    leadId: normalizeText(event.leadId, 160),
    occurredAt: normalizeDateTime(event.occurredAt) ?? new Date().toISOString(),
    pagePath: normalizePagePath(event.pagePath),
    visitId: normalizeText(event.visitId, 160),
  }
}

function normalizePerformanceRow(row: Record<string, unknown>): CampaignJourneyPerformance {
  const scanCount = toNumber(row.scan_count)
  const trackedScanCount = toNumber(row.tracked_scan_count)
  const successfulIntakeCount = toNumber(row.successful_intake_count)
  const bouncedScanCount = toNumber(row.bounced_scan_count)

  return {
    bouncedScanCount,
    bounceRate: trackedScanCount > 0 ? (bouncedScanCount / trackedScanCount) * 100 : 0,
    campaign: String(row.campaign ?? ''),
    scanCount,
    successfulIntakeCount,
    successfulIntakeRate: scanCount > 0 ? (successfulIntakeCount / scanCount) * 100 : 0,
    trackedScanCount,
  }
}

function normalizePageRow(row: Record<string, unknown>): CampaignPageBreakdown {
  return {
    campaign: String(row.campaign ?? ''),
    pagePath: String(row.page_path ?? '/'),
    pageViewCount: toNumber(row.page_view_count),
    uniqueScanCount: toNumber(row.unique_scan_count),
  }
}

function normalizeAbandonmentRow(row: Record<string, unknown>): CampaignAbandonmentBreakdown {
  return {
    abandonedScanCount: toNumber(row.abandoned_scan_count),
    campaign: String(row.campaign ?? ''),
    pagePath: String(row.page_path ?? '/'),
  }
}

function normalizeFormRow(row: Record<string, unknown>): CampaignFormBreakdown {
  return {
    campaign: String(row.campaign ?? ''),
    completionCount: toNumber(row.completion_count),
    eventType: row.event_type as FairlendCampaignJourneyEventType,
    formId: row.form_id ? String(row.form_id) : null,
    formName: String(row.form_name ?? 'Unknown intake'),
    intakeType: row.intake_type ? String(row.intake_type) : null,
  }
}

function normalizeRecentJourneyRow(row: Record<string, unknown>): RecentCampaignJourney {
  const pageViewCount = toNumber(row.page_view_count)
  const engaged = row.engaged === true
  const successful = row.successful === true

  return {
    campaign: String(row.campaign ?? ''),
    capturedAt: normalizeDateTime(row.captured_at) ?? new Date(0).toISOString(),
    formName: row.form_name ? String(row.form_name) : null,
    outcome: successful
      ? 'successful_intake'
      : engaged
        ? 'intake_abandoned'
        : pageViewCount === 1
          ? 'bounced'
          : pageViewCount > 1
            ? 'browsing'
            : 'not_tracked',
    pagePaths: Array.isArray(row.page_paths) ? row.page_paths.map(String) : [],
    scanId: String(row.scan_id ?? ''),
  }
}

function normalizePagePath(value: unknown): string | null {
  const path = normalizeText(value, 1000)
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null
  return path.split('?')[0]?.split('#')[0] ?? null
}

function normalizeDuration(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return Math.max(0, Math.min(Math.round(value), 1000 * 60 * 60 * 12))
}

function normalizeDateTime(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text ? text.slice(0, maxLength) : null
}

function toNumber(value: unknown): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}
