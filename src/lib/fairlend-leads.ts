import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'

type LeadStatus = 'draft' | 'started' | 'submitted'

export interface LeadPayload {
  address?: string
  addressDetails?: unknown
  formattedAddress?: string
  id?: string
  intent?: string
  intake?: unknown
  name?: string
  phone?: string
  placeId?: string
  source?: string
  status?: LeadStatus
  email?: string
}

export interface NormalizedLeadPayload {
  address: string | null
  addressDetails: unknown
  email: string | null
  formattedAddress: string | null
  id: string
  intake: unknown
  intent: string | null
  name: string | null
  phone: string | null
  placeId: string | null
  source: string
  status: LeadStatus
}

let leadSql: NeonQueryFunction<false, false> | null = null
let schemaReady = false

export function normalizeLeadPayload(payload: LeadPayload): NormalizedLeadPayload {
  const id = normalizeId(payload.id)

  return {
    address: normalizeText(payload.address, 2000),
    addressDetails: isRecord(payload.addressDetails) ? payload.addressDetails : {},
    email: normalizeText(payload.email, 320),
    formattedAddress: normalizeText(payload.formattedAddress, 2000),
    id,
    intake: isRecord(payload.intake) ? payload.intake : {},
    intent: normalizeText(payload.intent, 80),
    name: normalizeText(payload.name, 240),
    phone: normalizeText(payload.phone, 80),
    placeId: normalizeText(payload.placeId, 255),
    source: normalizeText(payload.source, 80) ?? 'website',
    status: normalizeStatus(payload.status),
  }
}

export async function upsertFairlendLead(payload: LeadPayload): Promise<{ id: string }> {
  const normalized = normalizeLeadPayload(payload)
  const sql = getLeadSql()

  await ensureFairlendLeadSchema(sql)

  await sql`
    INSERT INTO fairlend.leads AS lead (
      id,
      source,
      intent,
      status,
      address,
      formatted_address,
      google_place_id,
      address_payload,
      intake_payload,
      name,
      email,
      phone
    )
    VALUES (
      ${normalized.id},
      ${normalized.source},
      ${normalized.intent},
      ${normalized.status},
      ${normalized.address},
      ${normalized.formattedAddress},
      ${normalized.placeId},
      ${JSON.stringify(normalized.addressDetails)},
      ${JSON.stringify(normalized.intake)},
      ${normalized.name},
      ${normalized.email},
      ${normalized.phone}
    )
    ON CONFLICT (id) DO UPDATE SET
      source = EXCLUDED.source,
      intent = COALESCE(EXCLUDED.intent, lead.intent),
      status = EXCLUDED.status,
      address = COALESCE(EXCLUDED.address, lead.address),
      formatted_address = COALESCE(EXCLUDED.formatted_address, lead.formatted_address),
      google_place_id = COALESCE(EXCLUDED.google_place_id, lead.google_place_id),
      address_payload = CASE
        WHEN EXCLUDED.address_payload = '{}'::jsonb THEN lead.address_payload
        ELSE EXCLUDED.address_payload
      END,
      intake_payload = CASE
        WHEN EXCLUDED.intake_payload = '{}'::jsonb THEN lead.intake_payload
        ELSE EXCLUDED.intake_payload
      END,
      name = COALESCE(EXCLUDED.name, lead.name),
      email = COALESCE(EXCLUDED.email, lead.email),
      phone = COALESCE(EXCLUDED.phone, lead.phone),
      updated_at = now()
  `

  return { id: normalized.id }
}

function getLeadSql(): NeonQueryFunction<false, false> {
  if (leadSql) {
    return leadSql
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required to persist Fairlend leads')
  }

  leadSql = neon(connectionString)
  return leadSql
}

async function ensureFairlendLeadSchema(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (schemaReady) {
    return
  }

  await sql`CREATE SCHEMA IF NOT EXISTS fairlend`
  await sql`
    CREATE TABLE IF NOT EXISTS fairlend.leads (
      id varchar(36) PRIMARY KEY,
      source varchar(80) NOT NULL DEFAULT 'website',
      intent varchar(80),
      status varchar(40) NOT NULL DEFAULT 'started',
      address text,
      formatted_address text,
      google_place_id varchar(255),
      address_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
      intake_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
      name varchar(240),
      email varchar(320),
      phone varchar(80),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON fairlend.leads (created_at)`
  await sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON fairlend.leads (status)`
  await sql`CREATE INDEX IF NOT EXISTS leads_email_idx ON fairlend.leads (email)`

  schemaReady = true
}

function normalizeId(id: unknown): string {
  if (
    typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  ) {
    return id
  }

  return randomUUID()
}

function normalizeStatus(status: unknown): LeadStatus {
  if (status === 'draft' || status === 'started' || status === 'submitted') {
    return status
  }

  return 'started'
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
