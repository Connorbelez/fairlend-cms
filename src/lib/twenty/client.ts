import { createHash } from 'crypto'

import type { NormalizedLeadPayload } from '@/lib/fairlend-leads'
import {
  classifyLeadObjectKind,
  findUnmappedIntakeKeys,
  isUnknownIntent,
  normalizeIntakeForKind,
  toPartnerProjectConstructionFields,
  TWENTY_OBJECT_ENDPOINTS,
  type LeadObjectKind,
} from '@/lib/twenty/intake-registry'

const defaultTwentyApiUrl = 'https://api.twenty.com'
const requestTimeoutMs = 10_000
const originKinds: readonly LeadObjectKind[] = ['mortgage', 'lender', 'construction', 'partner']

export type TwentyRelatedRecord = { objectKind: LeadObjectKind | 'campaignTouch' | 'person' | 'company'; recordId: string }

export type TwentySyncResult =
  | { status: 'disabled' }
  | {
      status: 'synced'
      recordId: string
      objectKind: LeadObjectKind
      relatedRecords: TwentyRelatedRecord[]
    }
  | { status: 'failed'; error: string }

type FetchImplementation = typeof fetch
type TwentyClientContext = {
  apiKey: string
  apiUrl: string
  fetchImpl: FetchImplementation
}

export async function syncFairlendLeadToTwenty(
  lead: NormalizedLeadPayload,
  options: { fetchImpl?: FetchImplementation } = {},
): Promise<TwentySyncResult> {
  if (process.env.TWENTY_SYNC_ENABLED !== 'true') return { status: 'disabled' }

  const apiKey = process.env.TWENTY_API_KEY?.trim()
  if (!apiKey) {
    return { status: 'failed', error: 'TWENTY_API_KEY is required when TWENTY_SYNC_ENABLED=true' }
  }

  const context: TwentyClientContext = {
    apiKey,
    apiUrl: normalizeApiUrl(process.env.TWENTY_API_URL),
    fetchImpl: options.fetchImpl ?? fetch,
  }

  try {
    const unmappedFields = findUnmappedIntakeKeys(lead.intake)
    if (unmappedFields.length > 0) {
      console.warn('Twenty intake mapping received unmapped fields', {
        leadId: lead.id,
        intent: lead.intent,
        unmappedFields,
      })
    }

    if (lead.intent === 'document-upload') {
      const origin = await findOriginatingApplication(context, lead.id)
      if (origin) {
        await createDocumentStatusNote(context, origin, lead)
        return {
          status: 'synced',
          recordId: origin.recordId,
          objectKind: origin.objectKind,
          relatedRecords: [],
        }
      }
    }

    const objectKind = classifyLeadObjectKind(lead)
    const relatedRecords: TwentyRelatedRecord[] = []
    const personId = await findOrCreatePerson(context, lead)
    if (personId) relatedRecords.push({ objectKind: 'person', recordId: personId })
    const companyId = await findOrCreateExplicitCompany(context, lead)
    if (companyId) relatedRecords.push({ objectKind: 'company', recordId: companyId })

    let relationOverrides: Record<string, unknown> = {}
    if (objectKind === 'consultation') {
      const originLeadId = textValue(lead.intake.originatingLeadId)
      if (originLeadId) {
        const origin = await findOriginatingApplication(context, originLeadId)
        if (origin) {
          relationOverrides = { [`${objectSingular(origin.objectKind)}Id`]: origin.recordId }
          await patchRecord(context, TWENTY_OBJECT_ENDPOINTS[origin.objectKind], origin.recordId, {
            consultationMilestone: 'SCHEDULED',
          })
          relatedRecords.push({ objectKind: origin.objectKind, recordId: origin.recordId })
        }
      }
    }

    const primaryInput = toTwentyObjectUpdateInput(lead, objectKind, {
      companyId,
      personId,
      relationOverrides,
    })
    const primaryCreateInput = toTwentyObjectCreateInput(lead, objectKind, {
      companyId,
      personId,
      relationOverrides,
    })
    const recordId = await upsertTwentyRecord(
      context,
      TWENTY_OBJECT_ENDPOINTS[objectKind],
      lead.id,
      primaryInput,
      primaryCreateInput,
      objectLabel(objectKind),
    )

    if (objectKind === 'partner' && lead.intent === 'partner-project') {
      const constructionInput = compactRecord({
        ...toTwentyObjectUpdateInput(lead, 'construction', { companyId, personId }),
        ...toPartnerProjectConstructionFields(lead),
        referringPartnerId: recordId,
      })
      const constructionId = await upsertTwentyRecord(
        context,
        TWENTY_OBJECT_ENDPOINTS.construction,
        lead.id,
        constructionInput,
        compactRecord({
          id: lead.id,
          ...constructionInput,
          workflowStatus: 'NEW',
          priority: toTwentySelectValue(lead.priority),
          nextActionAt: lead.nextActionAt,
        }),
        objectLabel('construction'),
      )
      relatedRecords.push({ objectKind: 'construction', recordId: constructionId })
    }

    const campaignTouchId = await upsertCampaignTouch(context, lead, objectKind, recordId)
    if (campaignTouchId) relatedRecords.push({ objectKind: 'campaignTouch', recordId: campaignTouchId })

    return { status: 'synced', recordId, objectKind, relatedRecords }
  } catch (error) {
    return { status: 'failed', error: sanitizeTwentyError(error) }
  }
}

export function toTwentyObjectCreateInput(
  lead: NormalizedLeadPayload,
  objectKind: LeadObjectKind,
  relations: { personId?: string | null; companyId?: string | null; relationOverrides?: Record<string, unknown> } = {},
): Record<string, unknown> {
  const workflowField = workflowFieldName(objectKind)
  return compactRecord({
    id: lead.id,
    ...toTwentyObjectUpdateInput(lead, objectKind, relations),
    [workflowField]: initialWorkflowValue(objectKind, lead),
    priority: toTwentySelectValue(lead.priority),
    nextActionAt: lead.nextActionAt,
    adminNotes: lead.adminNotes,
  })
}

export function toTwentyObjectUpdateInput(
  lead: NormalizedLeadPayload,
  objectKind: LeadObjectKind,
  relations: { personId?: string | null; companyId?: string | null; relationOverrides?: Record<string, unknown> } = {},
): Record<string, unknown> {
  const companyName = explicitCompanyName(lead)
  const common = compactRecord({
    name: buildTwentyLeadName(lead, objectKind),
    fairlendLeadId: lead.id,
    captureStatus: toTwentySelectValue(lead.status),
    capturedAt: lead.capturedAt,
    submittedAt: lead.submittedAt,
    timestampProvenance: toTwentySelectValue(lead.timestampProvenance),
    intent: lead.intent,
    source: lead.source,
    page: textValue(lead.intake.page),
    campaign: lead.campaign,
    campaignScanId: lead.campaignScanId,
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    companyName,
    propertyAddress: toTwentyAddress(lead),
    formattedAddress: lead.formattedAddress ?? lead.address,
    googlePlaceId: lead.placeId,
    completionStatus: textValue(lead.intake.completionStatus),
    detail: textValue(lead.intake.detail),
    message: textValue(lead.intake.message),
    notes: textValue(lead.intake.notes),
    intakeSummary: lead.intakeSummary,
    intakePayload: nonEmptyRecord(lead.intake),
    addressPayload: nonEmptyRecord(lead.addressDetails),
    attributionPayload: nonEmptyRecord(lead.attribution),
    personId: relations.personId,
    companyId: relations.companyId,
    ...normalizeIntakeForKind(objectKind, lead),
    ...relations.relationOverrides,
  })

  if (objectKind === 'consultation') {
    common.status = initialWorkflowValue('consultation', lead)
  }

  return common
}

/** @deprecated Use toTwentyObjectCreateInput with the mortgage object kind. */
export const toTwentyMortgageLeadCreateInput = (lead: NormalizedLeadPayload): Record<string, unknown> =>
  toTwentyObjectCreateInput(lead, 'mortgage')

/** @deprecated Use toTwentyObjectUpdateInput with the mortgage object kind. */
export const toTwentyMortgageLeadUpdateInput = (lead: NormalizedLeadPayload): Record<string, unknown> =>
  toTwentyObjectUpdateInput(lead, 'mortgage')

async function upsertTwentyRecord(
  context: TwentyClientContext,
  endpoint: string,
  recordId: string,
  updateInput: Record<string, unknown>,
  createInput: Record<string, unknown>,
  label: string,
): Promise<string> {
  const recordUrl = `${context.apiUrl}/rest/${endpoint}/${encodeURIComponent(recordId)}`
  const updateResponse = await twentyRequest(context, recordUrl, {
    method: 'PATCH',
    body: JSON.stringify(updateInput),
  })

  if (updateResponse.ok) return extractRecordId(updateResponse, recordId)
  if (updateResponse.status !== 404) throw await toTwentyApiError(updateResponse, `update ${label}`)

  const createResponse = await twentyRequest(context, `${context.apiUrl}/rest/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(createInput),
  })
  if (createResponse.ok) return extractRecordId(createResponse, recordId)

  if (createResponse.status === 409) {
    const retryResponse = await twentyRequest(context, recordUrl, {
      method: 'PATCH',
      body: JSON.stringify(updateInput),
    })
    if (retryResponse.ok) return extractRecordId(retryResponse, recordId)
    throw await toTwentyApiError(retryResponse, `update ${label} after create conflict`)
  }

  throw await toTwentyApiError(createResponse, `create ${label}`)
}

async function patchRecord(
  context: TwentyClientContext,
  endpoint: string,
  recordId: string,
  input: Record<string, unknown>,
): Promise<void> {
  const response = await twentyRequest(
    context,
    `${context.apiUrl}/rest/${endpoint}/${encodeURIComponent(recordId)}`,
    { method: 'PATCH', body: JSON.stringify(input) },
  )
  if (!response.ok) throw await toTwentyApiError(response, `update ${endpoint}`)
}

async function findOriginatingApplication(
  context: TwentyClientContext,
  recordId: string,
): Promise<{ objectKind: LeadObjectKind; recordId: string } | null> {
  for (const objectKind of originKinds) {
    const response = await twentyRequest(
      context,
      `${context.apiUrl}/rest/${TWENTY_OBJECT_ENDPOINTS[objectKind]}/${encodeURIComponent(recordId)}`,
      { method: 'GET' },
    )
    if (response.ok) return { objectKind, recordId: await extractRecordId(response, recordId) }
    if (response.status !== 404) throw await toTwentyApiError(response, `find originating ${objectLabel(objectKind)}`)
  }
  return null
}

async function createDocumentStatusNote(
  context: TwentyClientContext,
  origin: { objectKind: LeadObjectKind; recordId: string },
  lead: NormalizedLeadPayload,
): Promise<void> {
  const documentStatus = textValue(lead.intake.documentStatus) ?? 'Document update received'
  const detail = textValue(lead.intake.detail ?? lead.intake.message ?? lead.intake.notes)
  const noteResponse = await twentyRequest(context, `${context.apiUrl}/rest/notes`, {
    method: 'POST',
    body: JSON.stringify({
      position: 'first',
      title: `FairLend document update — ${documentStatus}`,
      bodyV2: { markdown: [documentStatus, detail, `Captured: ${lead.capturedAt}`].filter(Boolean).join('\n\n') },
    }),
  })
  if (!noteResponse.ok) throw await toTwentyApiError(noteResponse, 'create document status note')
  const noteId = await extractRecordId(noteResponse, '')
  const targetField = `target${capitalize(objectSingular(origin.objectKind))}Id`
  const targetResponse = await twentyRequest(context, `${context.apiUrl}/rest/noteTargets`, {
    method: 'POST',
    body: JSON.stringify({ position: 'first', noteId, [targetField]: origin.recordId }),
  })
  if (!targetResponse.ok) throw await toTwentyApiError(targetResponse, 'attach document status note')
}

async function findOrCreatePerson(
  context: TwentyClientContext,
  lead: NormalizedLeadPayload,
): Promise<string | null> {
  const email = lead.email?.trim().toLowerCase()
  if (!email) return null

  const existing = await findFirstRecord(
    context,
    'people',
    `emails.primaryEmail[eq]:${JSON.stringify(email)}`,
  )
  if (existing) return existing

  const { firstName, lastName } = splitContactName(lead.name)
  const response = await twentyRequest(context, `${context.apiUrl}/rest/people`, {
    method: 'POST',
    body: JSON.stringify(compactRecord({
      position: 'first',
      name: { firstName, lastName },
      emails: { primaryEmail: email, additionalEmails: [] },
      phones: lead.phone
        ? { primaryPhoneNumber: lead.phone, primaryPhoneCountryCode: 'CA', primaryPhoneCallingCode: '+1', additionalPhones: [] }
        : undefined,
    })),
  })
  if (response.ok) {
    const createdId = await extractRecordId(response, '')
    return createdId || findFirstRecord(context, 'people', `emails.primaryEmail[eq]:${JSON.stringify(email)}`)
  }
  if (response.status === 409) return findFirstRecord(context, 'people', `emails.primaryEmail[eq]:${JSON.stringify(email)}`)
  throw await toTwentyApiError(response, 'create person')
}

async function findOrCreateExplicitCompany(
  context: TwentyClientContext,
  lead: NormalizedLeadPayload,
): Promise<string | null> {
  const companyName = explicitCompanyName(lead)
  if (!companyName) return null
  const existing = await findFirstRecord(context, 'companies', `name[eq]:${JSON.stringify(companyName)}`)
  if (existing) return existing

  const response = await twentyRequest(context, `${context.apiUrl}/rest/companies`, {
    method: 'POST',
    body: JSON.stringify({ position: 'first', name: companyName }),
  })
  if (response.ok) {
    const createdId = await extractRecordId(response, '')
    return createdId || findFirstRecord(context, 'companies', `name[eq]:${JSON.stringify(companyName)}`)
  }
  if (response.status === 409) return findFirstRecord(context, 'companies', `name[eq]:${JSON.stringify(companyName)}`)
  throw await toTwentyApiError(response, 'create company')
}

async function findFirstRecord(
  context: TwentyClientContext,
  endpoint: string,
  filter: string,
): Promise<string | null> {
  const url = new URL(`${context.apiUrl}/rest/${endpoint}`)
  url.searchParams.set('filter', filter)
  url.searchParams.set('limit', '1')
  const response = await twentyRequest(context, url.toString(), { method: 'GET' })
  if (!response.ok) throw await toTwentyApiError(response, `find ${endpoint}`)
  const body = (await response.clone().json().catch(() => null)) as unknown
  const records = extractRecords(body, endpoint)
  return records.length > 0 && typeof records[0]?.id === 'string' ? records[0].id : null
}

async function upsertCampaignTouch(
  context: TwentyClientContext,
  lead: NormalizedLeadPayload,
  objectKind: LeadObjectKind,
  recordId: string,
): Promise<string | null> {
  if (!lead.campaignScanId) return null
  const id = deterministicUuid(`campaign-touch:${lead.campaignScanId}`)
  const relationField = `${objectSingular(objectKind)}Id`
  const input = compactRecord({
    name: `${lead.campaign ?? 'FairLend'} — ${lead.campaignScanId}`.slice(0, 240),
    scanId: lead.campaignScanId,
    campaign: lead.campaign,
    source: textValue(lead.attribution.source) ?? lead.source,
    destination: textValue(lead.attribution.destination),
    referrer: textValue(lead.attribution.referrer),
    userAgent: textValue(lead.attribution.userAgent),
    hashedIp: textValue(lead.attribution.hashedIp),
    queryParams: recordValue(lead.attribution.queryParams),
    capturedAt: textValue(lead.attribution.capturedAt) ?? lead.capturedAt,
    convertedAt: lead.submittedAt,
    [relationField]: recordId,
  })
  return upsertTwentyRecord(
    context,
    'campaignTouches',
    id,
    input,
    { id, ...input },
    'campaign touch',
  )
}

async function twentyRequest(
  context: TwentyClientContext,
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs)
  try {
    return await context.fetchImpl(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${context.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'fairlend-cms/twenty-sync',
      },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function extractRecordId(response: Response, fallbackId: string): Promise<string> {
  const body = (await response.clone().json().catch(() => null)) as unknown
  if (!isRecord(body)) return fallbackId
  if (typeof body.id === 'string') return body.id
  if (isRecord(body.data) && typeof body.data.id === 'string') return body.data.id
  return fallbackId
}

function extractRecords(body: unknown, endpoint: string): Array<Record<string, unknown>> {
  if (Array.isArray(body)) return body.filter(isRecord)
  if (!isRecord(body)) return []
  if (Array.isArray(body.data)) return body.data.filter(isRecord)
  if (isRecord(body.data)) {
    const candidate = body.data[endpoint]
    if (Array.isArray(candidate)) return candidate.filter(isRecord)
  }
  const candidate = body[endpoint]
  return Array.isArray(candidate) ? candidate.filter(isRecord) : []
}

async function toTwentyApiError(response: Response, operation: string): Promise<Error> {
  const requestId = response.headers.get('x-request-id')
  const detail = await response.clone().json().then(extractSafeApiMessage).catch(() => null)
  const suffix = [detail, requestId ? `request ${requestId}` : null].filter(Boolean).join('; ')
  return new Error(`Twenty API could not ${operation}: HTTP ${response.status}${suffix ? ` (${suffix})` : ''}`)
}

function extractSafeApiMessage(body: unknown): string | null {
  if (!isRecord(body)) return null
  for (const key of ['message', 'error', 'code']) {
    const value = body[key]
    if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 240)
  }
  return null
}

function toTwentyAddress(lead: NormalizedLeadPayload): Record<string, unknown> | null {
  const details = lead.addressDetails
  const address = compactRecord({
    addressStreet1: textValue(details.addressStreet1) ?? lead.address,
    addressStreet2: textValue(details.addressStreet2),
    addressCity: textValue(details.addressCity) ?? textValue(details.city),
    addressState: textValue(details.addressState) ?? textValue(details.province),
    addressPostcode: textValue(details.addressPostcode) ?? textValue(details.postalCode),
    addressCountry: textValue(details.addressCountry) ?? textValue(details.country),
    addressLat: numberValue(details.addressLat) ?? numberValue(details.latitude),
    addressLng: numberValue(details.addressLng) ?? numberValue(details.longitude),
  })
  return Object.keys(address).length > 0 ? address : null
}

function buildTwentyLeadName(lead: NormalizedLeadPayload, objectKind: LeadObjectKind): string {
  const contact = lead.name?.trim()
  const descriptor = textValue(lead.intake.mortgageGoal)
    ?? textValue(lead.intake.projectScope)
    ?? textValue(lead.intake.requestedIntent)
    ?? lead.intent
  if (contact && descriptor) return `${contact} — ${descriptor}`.slice(0, 240)
  if (contact) return contact.slice(0, 240)
  if (lead.address) return lead.address.slice(0, 240)
  return `${objectLabel(objectKind)} ${lead.id.slice(0, 8)}`
}

function initialWorkflowValue(objectKind: LeadObjectKind, lead: NormalizedLeadPayload): string {
  if (objectKind === 'consultation') {
    if (textValue(lead.intake.googleEventLink) || textValue(lead.intake.googleEventId)) return 'CONFIRMED'
    if (textValue(lead.intake.scheduledStart)) return 'SCHEDULED'
    return 'REQUESTED'
  }
  if (objectKind === 'newsletter') return 'SUBSCRIBED'
  if (objectKind === 'general') return 'NEW'

  const common: Partial<Record<NormalizedLeadPayload['workflowStatus'], string>> = {
    new: 'NEW',
    contact_attempted: 'CONTACT_ATTEMPTED',
    contacted: 'CONTACTED',
    qualified: 'QUALIFIED',
    working_file: objectKind === 'construction' ? 'UNDERWRITING' : objectKind === 'mortgage' ? 'APPLICATION_IN_PROGRESS' : 'NEW',
    closed_won: objectKind === 'construction' ? 'COMPLETED' : objectKind === 'mortgage' ? 'FUNDED' : 'ACTIVE',
    closed_lost: 'DECLINED',
  }
  return common[lead.workflowStatus] ?? 'NEW'
}

function workflowFieldName(objectKind: LeadObjectKind): 'workflowStatus' | 'status' {
  return objectKind === 'consultation' || objectKind === 'newsletter' ? 'status' : 'workflowStatus'
}

function objectSingular(objectKind: LeadObjectKind): string {
  return TWENTY_OBJECT_ENDPOINTS[objectKind].replace(/s$/, '').replace(/ie$/, 'y')
}

function objectLabel(objectKind: LeadObjectKind): string {
  return {
    mortgage: 'mortgage borrower lead', lender: 'lender application', construction: 'construction application',
    partner: 'partner lead', consultation: 'consultation request', general: 'general inquiry', newsletter: 'newsletter subscription',
  }[objectKind]
}

function explicitCompanyName(lead: NormalizedLeadPayload): string | null {
  return textValue(lead.intake.organizationName) ?? textValue(lead.intake.companyName)
}

function splitContactName(name: string | null): { firstName: string; lastName: string } {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return { firstName: 'Unknown', lastName: 'FairLend Lead' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts.at(-1) ?? '' }
}

function deterministicUuid(seed: string): string {
  const hex = createHash('sha256').update(`fairlend-crm:${seed}`).digest('hex').slice(0, 32).split('')
  hex[12] = '5'
  hex[16] = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  const value = hex.join('')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function normalizeApiUrl(value: string | undefined): string {
  return (value?.trim() || defaultTwentyApiUrl).replace(/\/+$/, '')
}

function toTwentySelectValue(value: string): string {
  return value.trim().replace(/[-\s]+/g, '_').toUpperCase()
}

function compactRecord(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ''))
}

function nonEmptyRecord(value: Record<string, unknown>): Record<string, unknown> | null {
  return Object.keys(value).length > 0 ? value : null
}

function textValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string' || !value.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function recordValue(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null
}

function capitalize(value: string): string {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}

function sanitizeTwentyError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return 'Twenty API request timed out'
    return error.message.slice(0, 500)
  }
  return 'Unknown Twenty API sync failure'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
