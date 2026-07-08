import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'

type LeadStatus = 'draft' | 'started' | 'submitted'
type LeadWorkflowStatus =
  | 'new'
  | 'contact_attempted'
  | 'contacted'
  | 'qualified'
  | 'consultation_booked'
  | 'working_file'
  | 'closed_won'
  | 'closed_lost'
type LeadPriority = 'high' | 'normal' | 'low'
type LeadJsonRecord = Record<string, unknown>

export interface LeadPayload {
  address?: string
  addressDetails?: unknown
  adminNotes?: string
  formattedAddress?: string
  id?: string
  intent?: string
  intake?: unknown
  name?: string
  nextActionAt?: string
  phone?: string
  placeId?: string
  priority?: LeadPriority
  source?: string
  status?: LeadStatus
  workflowStatus?: LeadWorkflowStatus
  email?: string
}

export interface NormalizedLeadPayload {
  address: string | null
  addressDetails: LeadJsonRecord
  adminNotes: string | null
  email: string | null
  formattedAddress: string | null
  id: string
  intake: LeadJsonRecord
  intent: string | null
  name: string | null
  nextActionAt: string | null
  phone: string | null
  placeId: string | null
  priority: LeadPriority
  source: string
  status: LeadStatus
  workflowStatus: LeadWorkflowStatus
}

export type FairlendLeadAdminData = {
  address: string | null
  addressDetails: LeadJsonRecord
  adminNotes: string | null
  email: string | null
  formattedAddress: string | null
  intake: LeadJsonRecord
  intent: string | null
  leadId: string
  name: string | null
  nextActionAt: string | null
  phone: string | null
  placeId: string | null
  priority: LeadPriority
  source: string
  status: LeadStatus
  workflowStatus: LeadWorkflowStatus
}

export type PersistedFairlendLead = {
  id: string
  normalized: NormalizedLeadPayload
}

type ExistingFairlendLeadAdminData = Partial<
  Omit<FairlendLeadAdminData, 'addressDetails' | 'intake'>
> & {
  addressDetails?: unknown
  intake?: unknown
}

let leadSql: NeonQueryFunction<false, false> | null = null
let schemaReady = false
let adminSchemaReady = false

export function normalizeLeadPayload(payload: LeadPayload): NormalizedLeadPayload {
  const id = normalizeId(payload.id)

  return {
    address: normalizeText(payload.address, 2000),
    addressDetails: isRecord(payload.addressDetails) ? payload.addressDetails : {},
    adminNotes: normalizeText(payload.adminNotes, 4000),
    email: normalizeText(payload.email, 320),
    formattedAddress: normalizeText(payload.formattedAddress, 2000),
    id,
    intake: isRecord(payload.intake) ? payload.intake : {},
    intent: normalizeText(payload.intent, 80),
    name: normalizeText(payload.name, 240),
    nextActionAt: normalizeDateTime(payload.nextActionAt),
    phone: normalizeText(payload.phone, 80),
    placeId: normalizeText(payload.placeId, 255),
    priority: normalizePriority(payload.priority),
    source: normalizeText(payload.source, 80) ?? 'website',
    status: normalizeStatus(payload.status),
    workflowStatus: normalizeWorkflowStatus(payload.workflowStatus),
  }
}

export async function persistFairlendLead(payload: LeadPayload): Promise<PersistedFairlendLead> {
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

  return { id: normalized.id, normalized }
}

export async function upsertFairlendLead(payload: LeadPayload): Promise<{ id: string }> {
  const lead = await persistFairlendLead(payload)

  await syncFairlendLeadAdminRecord(lead.normalized)

  return { id: lead.id }
}

export function toFairlendLeadAdminData(payload: NormalizedLeadPayload): FairlendLeadAdminData {
  return {
    address: payload.address,
    addressDetails: payload.addressDetails,
    adminNotes: payload.adminNotes,
    email: payload.email,
    formattedAddress: payload.formattedAddress,
    intake: payload.intake,
    intent: payload.intent,
    leadId: payload.id,
    name: payload.name,
    nextActionAt: payload.nextActionAt,
    phone: payload.phone,
    placeId: payload.placeId,
    priority: payload.priority,
    source: payload.source,
    status: payload.status,
    workflowStatus: payload.workflowStatus,
  }
}

export function mergeFairlendLeadAdminData(
  incoming: FairlendLeadAdminData,
  existing?: ExistingFairlendLeadAdminData,
): FairlendLeadAdminData {
  if (!existing) {
    return incoming
  }

  return {
    ...incoming,
    address: incoming.address ?? existing.address ?? null,
    addressDetails: hasRecordValues(incoming.addressDetails)
      ? incoming.addressDetails
      : (recordOrNull(existing.addressDetails) ?? incoming.addressDetails),
    adminNotes: existing.adminNotes ?? incoming.adminNotes ?? null,
    email: incoming.email ?? existing.email ?? null,
    formattedAddress: incoming.formattedAddress ?? existing.formattedAddress ?? null,
    intake: hasRecordValues(incoming.intake)
      ? incoming.intake
      : (recordOrNull(existing.intake) ?? incoming.intake),
    intent: incoming.intent ?? existing.intent ?? null,
    name: incoming.name ?? existing.name ?? null,
    nextActionAt: existing.nextActionAt ?? incoming.nextActionAt ?? null,
    phone: incoming.phone ?? existing.phone ?? null,
    placeId: incoming.placeId ?? existing.placeId ?? null,
    priority: existing.priority ?? incoming.priority,
    workflowStatus: existing.workflowStatus ?? incoming.workflowStatus,
  }
}

export async function syncFairlendLeadAdminRecord(payload: NormalizedLeadPayload): Promise<void> {
  const data = toFairlendLeadAdminData(payload)
  const sql = getLeadSql()

  await ensureFairlendLeadAdminSchema(sql)

  await sql`
    INSERT INTO fairlend_leads AS lead (
      lead_id,
      status,
      workflow_status,
      priority,
      next_action_at,
      intent,
      source,
      name,
      email,
      phone,
      address,
      formatted_address,
      place_id,
      intake,
      address_details,
      admin_notes,
      created_at,
      updated_at
    )
    VALUES (
      ${data.leadId},
      ${data.status}::text::enum_fairlend_leads_status,
      ${data.workflowStatus}::text::enum_fairlend_leads_workflow_status,
      ${data.priority}::text::enum_fairlend_leads_priority,
      ${data.nextActionAt},
      ${data.intent},
      ${data.source},
      ${data.name},
      ${data.email},
      ${data.phone},
      ${data.address},
      ${data.formattedAddress},
      ${data.placeId},
      ${JSON.stringify(data.intake)}::jsonb,
      ${JSON.stringify(data.addressDetails)}::jsonb,
      ${data.adminNotes},
      now(),
      now()
    )
    ON CONFLICT (lead_id) DO UPDATE SET
      status = EXCLUDED.status,
      workflow_status = lead.workflow_status,
      priority = lead.priority,
      next_action_at = COALESCE(lead.next_action_at, EXCLUDED.next_action_at),
      admin_notes = COALESCE(lead.admin_notes, EXCLUDED.admin_notes),
      intent = COALESCE(EXCLUDED.intent, lead.intent),
      source = EXCLUDED.source,
      name = COALESCE(EXCLUDED.name, lead.name),
      email = COALESCE(EXCLUDED.email, lead.email),
      phone = COALESCE(EXCLUDED.phone, lead.phone),
      address = COALESCE(EXCLUDED.address, lead.address),
      formatted_address = COALESCE(EXCLUDED.formatted_address, lead.formatted_address),
      place_id = COALESCE(EXCLUDED.place_id, lead.place_id),
      intake = CASE
        WHEN EXCLUDED.intake = '{}'::jsonb THEN lead.intake
        ELSE EXCLUDED.intake
      END,
      address_details = CASE
        WHEN EXCLUDED.address_details = '{}'::jsonb THEN lead.address_details
        ELSE EXCLUDED.address_details
      END,
      updated_at = now()
  `
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

async function ensureFairlendLeadAdminSchema(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  if (adminSchemaReady) {
    return
  }

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_status') THEN
        CREATE TYPE enum_fairlend_leads_status AS ENUM('draft', 'started', 'submitted');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_workflow_status') THEN
        CREATE TYPE enum_fairlend_leads_workflow_status AS ENUM(
          'new',
          'contact_attempted',
          'contacted',
          'qualified',
          'consultation_booked',
          'working_file',
          'closed_won',
          'closed_lost'
        );
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_fairlend_leads_priority') THEN
        CREATE TYPE enum_fairlend_leads_priority AS ENUM('high', 'normal', 'low');
      END IF;
    END $$;
  `
  await sql`
    CREATE TABLE IF NOT EXISTS fairlend_leads (
      id serial PRIMARY KEY,
      lead_id varchar NOT NULL,
      status enum_fairlend_leads_status NOT NULL DEFAULT 'started',
      workflow_status enum_fairlend_leads_workflow_status NOT NULL DEFAULT 'new',
      priority enum_fairlend_leads_priority NOT NULL DEFAULT 'normal',
      next_action_at timestamp(3) with time zone,
      admin_notes varchar,
      intent varchar,
      source varchar NOT NULL DEFAULT 'website',
      name varchar,
      email varchar,
      phone varchar,
      address varchar,
      formatted_address varchar,
      place_id varchar,
      intake jsonb,
      address_details jsonb,
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      CONSTRAINT fairlend_leads_lead_id_unique UNIQUE(lead_id)
    )
  `
  await sql`
    ALTER TABLE fairlend_leads
      ADD COLUMN IF NOT EXISTS workflow_status enum_fairlend_leads_workflow_status NOT NULL DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS priority enum_fairlend_leads_priority NOT NULL DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS next_action_at timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS admin_notes varchar
  `
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_lead_id_idx ON fairlend_leads USING btree (lead_id)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_status_idx ON fairlend_leads USING btree (status)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_intent_idx ON fairlend_leads USING btree (intent)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_email_idx ON fairlend_leads USING btree (email)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_address_idx ON fairlend_leads USING btree (address)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_updated_at_idx ON fairlend_leads USING btree (updated_at)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_created_at_idx ON fairlend_leads USING btree (created_at)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_workflow_status_idx ON fairlend_leads USING btree (workflow_status)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_priority_idx ON fairlend_leads USING btree (priority)`
  await sql`CREATE INDEX IF NOT EXISTS fairlend_leads_next_action_at_idx ON fairlend_leads USING btree (next_action_at)`

  adminSchemaReady = true
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

function normalizeWorkflowStatus(status: unknown): LeadWorkflowStatus {
  if (
    status === 'new' ||
    status === 'contact_attempted' ||
    status === 'contacted' ||
    status === 'qualified' ||
    status === 'consultation_booked' ||
    status === 'working_file' ||
    status === 'closed_won' ||
    status === 'closed_lost'
  ) {
    return status
  }

  return 'new'
}

function normalizePriority(priority: unknown): LeadPriority {
  if (priority === 'high' || priority === 'normal' || priority === 'low') {
    return priority
  }

  return 'normal'
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasRecordValues(value: Record<string, unknown>): boolean {
  return Object.keys(value).length > 0
}

function recordOrNull(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null
}
