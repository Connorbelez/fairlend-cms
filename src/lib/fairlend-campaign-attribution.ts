import { createHash, createHmac, randomUUID, timingSafeEqual } from 'crypto'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import type { NextRequest } from 'next/server'

export const fairlendCampaignAttributionCookieName = 'fairlend_campaign_attribution'
export const fairlendCampaignAttributionMarkerCookieName = 'fairlend_campaign_session'
export const fairlendCampaignAttributionMaxAgeSeconds = 60 * 60 * 24 * 30

export type FairlendCampaignConfig = {
  campaign: string
  destination: string
  source: string
}

export type FairlendCampaignAttribution = {
  campaign: string
  capturedAt: string
  destination: string
  scanId: string
  source: string
}

export type FairlendCampaignScanInput = FairlendCampaignAttribution & {
  hashedIp?: null | string
  queryParams?: Record<string, string | string[]>
  referrer?: null | string
  userAgent?: null | string
}

const fairlendCampaigns: Record<string, FairlendCampaignConfig> = {
  v1: {
    campaign: 'v1',
    destination: '/',
    source: 'qr-v1',
  },
}

let scanSql: NeonQueryFunction<false, false> | null = null
let scanSchemaReady = false

export function getFairlendCampaignConfig(campaign: string): FairlendCampaignConfig | null {
  const normalized = normalizeCampaignSlug(campaign)
  return normalized ? (fairlendCampaigns[normalized] ?? null) : null
}

export function getFairlendCampaignConfigs(): FairlendCampaignConfig[] {
  return Object.values(fairlendCampaigns)
}

export function createFairlendCampaignAttribution(
  config: FairlendCampaignConfig,
): FairlendCampaignAttribution {
  return {
    campaign: config.campaign,
    capturedAt: new Date().toISOString(),
    destination: config.destination,
    scanId: randomUUID(),
    source: config.source,
  }
}

export function serializeFairlendCampaignAttribution(
  attribution: FairlendCampaignAttribution,
): string {
  const payload = Buffer.from(JSON.stringify(attribution), 'utf8').toString('base64url')
  return `${payload}.${signAttributionPayload(payload)}`
}

export function parseFairlendCampaignAttribution(
  value?: null | string,
): FairlendCampaignAttribution | null {
  if (!value) {
    return null
  }

  try {
    const [payload, signature, ...extra] = value.split('.')

    if (
      !payload ||
      !signature ||
      extra.length > 0 ||
      !hasValidAttributionSignature(payload, signature)
    ) {
      return null
    }

    const parsed = parseAttributionCookieValue(payload)
    const campaign = normalizeCampaignSlug(parsed.campaign)
    const source = normalizeText(parsed.source, 80)
    const scanId = normalizeUuid(parsed.scanId)
    const destination = normalizeDestination(parsed.destination)
    const capturedAt = normalizeDateTime(parsed.capturedAt)

    if (!campaign || !source || !scanId || !destination || !capturedAt) {
      return null
    }

    return {
      campaign,
      capturedAt,
      destination,
      scanId,
      source,
    }
  } catch {
    return null
  }
}

function parseAttributionCookieValue(value: string): Partial<FairlendCampaignAttribution> {
  return JSON.parse(
    Buffer.from(value, 'base64url').toString('utf8'),
  ) as Partial<FairlendCampaignAttribution>
}

function signAttributionPayload(payload: string): string {
  return createHmac('sha256', getAttributionSigningSecret()).update(payload).digest('base64url')
}

function hasValidAttributionSignature(payload: string, signature: string): boolean {
  const expected = Buffer.from(signAttributionPayload(payload), 'utf8')
  const received = Buffer.from(signature, 'utf8')

  return expected.length === received.length && timingSafeEqual(expected, received)
}

function getAttributionSigningSecret(): string {
  const secret = process.env.FAIRLEND_ATTRIBUTION_SECRET || process.env.PAYLOAD_SECRET

  if (!secret) {
    throw new Error('FAIRLEND_ATTRIBUTION_SECRET or PAYLOAD_SECRET is required for QR attribution')
  }

  return secret
}

export function getFairlendCampaignAttributionFromRequest(
  request: NextRequest,
): FairlendCampaignAttribution | null {
  return parseFairlendCampaignAttribution(
    request.cookies.get(fairlendCampaignAttributionCookieName)?.value,
  )
}

export function getFairlendRequestPagePath(request: NextRequest): string | null {
  const referrer = request.headers.get('referer')

  if (!referrer) {
    return null
  }

  try {
    const url = new URL(referrer)
    return normalizeDestination(url.pathname)
  } catch {
    return null
  }
}

export function getFairlendCampaignRequestMetadata(request: NextRequest): {
  hashedIp: string | null
  queryParams: Record<string, string | string[]>
  referrer: string | null
  userAgent: string | null
} {
  return {
    hashedIp: hashIp(getClientIp(request)),
    queryParams: getQueryParams(request.nextUrl.searchParams),
    referrer: normalizeText(request.headers.get('referer'), 2000),
    userAgent: normalizeText(request.headers.get('user-agent'), 2000),
  }
}

export async function persistFairlendCampaignScan(input: FairlendCampaignScanInput): Promise<void> {
  const normalized = normalizeCampaignScanInput(input)
  const sql = getScanSql()

  await ensureFairlendCampaignScanSchema(sql)

  await sql`
    INSERT INTO fairlend_campaign_scans AS scan (
      scan_id,
      campaign,
      source,
      destination,
      referrer,
      user_agent,
      hashed_ip,
      query_params,
      captured_at,
      created_at,
      updated_at
    )
    VALUES (
      ${normalized.scanId},
      ${normalized.campaign},
      ${normalized.source},
      ${normalized.destination},
      ${normalized.referrer},
      ${normalized.userAgent},
      ${normalized.hashedIp},
      ${JSON.stringify(normalized.queryParams)}::jsonb,
      ${normalized.capturedAt},
      now(),
      now()
    )
    ON CONFLICT (scan_id) DO UPDATE SET
      campaign = EXCLUDED.campaign,
      source = EXCLUDED.source,
      destination = EXCLUDED.destination,
      referrer = EXCLUDED.referrer,
      user_agent = EXCLUDED.user_agent,
      hashed_ip = EXCLUDED.hashed_ip,
      query_params = EXCLUDED.query_params,
      captured_at = EXCLUDED.captured_at,
      updated_at = now()
  `
}

export async function markFairlendCampaignScanConverted({
  campaignScanId,
  leadId,
}: {
  campaignScanId?: null | string
  leadId: string
}): Promise<void> {
  const scanId = normalizeUuid(campaignScanId)

  if (!scanId) {
    return
  }

  const sql = getScanSql()

  await ensureFairlendCampaignScanSchema(sql)

  await sql`
    UPDATE fairlend_campaign_scans
    SET
      converted_lead_id = ${leadId},
      converted_at = COALESCE(converted_at, now()),
      updated_at = now()
    WHERE scan_id = ${scanId}
  `
}

function getScanSql(): NeonQueryFunction<false, false> {
  if (scanSql) {
    return scanSql
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required to persist FairLend campaign scans')
  }

  scanSql = neon(connectionString)
  return scanSql
}

async function ensureFairlendCampaignScanSchema(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  if (scanSchemaReady) {
    return
  }

  await sql`
    CREATE TABLE IF NOT EXISTS fairlend_campaign_scans (
      id serial PRIMARY KEY,
      scan_id varchar NOT NULL,
      campaign varchar NOT NULL,
      source varchar NOT NULL,
      destination varchar NOT NULL DEFAULT '/',
      referrer varchar,
      user_agent varchar,
      hashed_ip varchar,
      query_params jsonb NOT NULL DEFAULT '{}'::jsonb,
      converted_lead_id varchar,
      converted_at timestamp(3) with time zone,
      captured_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      CONSTRAINT fairlend_campaign_scans_scan_id_unique UNIQUE(scan_id)
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_scans_scan_id_idx ON fairlend_campaign_scans USING btree (scan_id)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_scans_campaign_idx ON fairlend_campaign_scans USING btree (campaign)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_scans_source_idx ON fairlend_campaign_scans USING btree (source)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_scans_converted_lead_id_idx ON fairlend_campaign_scans USING btree (converted_lead_id)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_campaign_scans_created_at_idx ON fairlend_campaign_scans USING btree (created_at)`
  await ensureCampaignScanLockedDocumentRelation(sql)

  scanSchemaReady = true
}

export async function ensureCampaignScanLockedDocumentRelation(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  await sql`
    DO $$
    BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE payload_locked_documents_rels
          ADD COLUMN IF NOT EXISTS fairlend_campaign_scans_id integer;

        IF to_regclass('public.fairlend_campaign_scans') IS NOT NULL AND NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'payload_locked_documents_rels_fairlend_campaign_scans_fk'
        ) THEN
          ALTER TABLE payload_locked_documents_rels
            ADD CONSTRAINT payload_locked_documents_rels_fairlend_campaign_scans_fk
            FOREIGN KEY (fairlend_campaign_scans_id) REFERENCES fairlend_campaign_scans(id)
            ON DELETE cascade ON UPDATE no action;
        END IF;
      END IF;
    END $$;
  `
  await sql`
    DO $$
    BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_fairlend_campaign_scans_id_idx
          ON payload_locked_documents_rels USING btree (fairlend_campaign_scans_id);
      END IF;
    END $$;
  `
}

function normalizeCampaignScanInput(input: FairlendCampaignScanInput): FairlendCampaignScanInput {
  return {
    campaign: normalizeCampaignSlug(input.campaign) ?? 'unknown',
    capturedAt: normalizeDateTime(input.capturedAt) ?? new Date().toISOString(),
    destination: normalizeDestination(input.destination) ?? '/',
    hashedIp: normalizeText(input.hashedIp, 128),
    queryParams: normalizeQueryParams(input.queryParams),
    referrer: normalizeText(input.referrer, 2000),
    scanId: normalizeUuid(input.scanId) ?? randomUUID(),
    source: normalizeText(input.source, 80) ?? 'qr',
    userAgent: normalizeText(input.userAgent, 2000),
  }
}

function normalizeQueryParams(value: unknown): Record<string, string | string[]> {
  if (!isRecord(value)) {
    return {}
  }

  const queryParams: Record<string, string | string[]> = {}

  for (const [key, rawValue] of Object.entries(value)) {
    const normalizedKey = normalizeText(key, 120)

    if (!normalizedKey) {
      continue
    }

    if (typeof rawValue === 'string') {
      queryParams[normalizedKey] = rawValue.slice(0, 2000)
      continue
    }

    if (Array.isArray(rawValue)) {
      queryParams[normalizedKey] = rawValue
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.slice(0, 2000))
    }
  }

  return queryParams
}

function normalizeCampaignSlug(value: unknown): string | null {
  const text = normalizeText(value, 80)?.toLowerCase()

  if (!text || !/^[a-z0-9][a-z0-9-]*$/.test(text)) {
    return null
  }

  return text
}

function normalizeDestination(value: unknown): string | null {
  const text = normalizeText(value, 2000)

  if (!text || !text.startsWith('/')) {
    return null
  }

  return text
}

function normalizeUuid(value: unknown): string | null {
  if (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  ) {
    return value
  }

  return null
}

function normalizeDateTime(value: unknown): string | null {
  const text = normalizeText(value, 80)
  if (!text) {
    return null
  }

  const date = new Date(text)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  return trimmed.slice(0, maxLength)
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]
  return (
    normalizeText(forwardedFor, 80) ??
    normalizeText(request.headers.get('x-real-ip'), 80) ??
    normalizeText(request.headers.get('cf-connecting-ip'), 80)
  )
}

function hashIp(ip: string | null): string | null {
  if (!ip) {
    return null
  }

  return createHash('sha256').update(ip).digest('hex')
}

function getQueryParams(searchParams: URLSearchParams): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {}

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key)
    params[key] = values.length > 1 ? values : (values[0] ?? '')
  }

  return params
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
