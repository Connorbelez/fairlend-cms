import type { NormalizedLeadPayload } from '@/lib/fairlend-leads'

const defaultTwentyApiUrl = 'https://api.twenty.com'
const mortgageLeadEndpoint = 'mortgageLeads'
const requestTimeoutMs = 10_000

export type TwentySyncResult =
  | { status: 'disabled' }
  | { status: 'synced'; recordId: string }
  | { status: 'failed'; error: string }

type FetchImplementation = typeof fetch

export async function syncFairlendLeadToTwenty(
  lead: NormalizedLeadPayload,
  options: { fetchImpl?: FetchImplementation } = {},
): Promise<TwentySyncResult> {
  if (process.env.TWENTY_SYNC_ENABLED !== 'true') {
    return { status: 'disabled' }
  }

  const apiKey = process.env.TWENTY_API_KEY?.trim()
  if (!apiKey) {
    return { status: 'failed', error: 'TWENTY_API_KEY is required when TWENTY_SYNC_ENABLED=true' }
  }

  try {
    const recordId = await upsertTwentyMortgageLead({
      apiKey,
      apiUrl: normalizeApiUrl(process.env.TWENTY_API_URL),
      fetchImpl: options.fetchImpl ?? fetch,
      lead,
    })

    return { status: 'synced', recordId }
  } catch (error) {
    return { status: 'failed', error: sanitizeTwentyError(error) }
  }
}

export function toTwentyMortgageLeadCreateInput(lead: NormalizedLeadPayload): Record<string, unknown> {
  return compactRecord({
    id: lead.id,
    ...toTwentyMortgageLeadUpdateInput(lead),
    workflowStatus: toTwentySelectValue(lead.workflowStatus),
    priority: toTwentySelectValue(lead.priority),
    nextActionAt: lead.nextActionAt,
    adminNotes: lead.adminNotes,
  })
}

export function toTwentyMortgageLeadUpdateInput(lead: NormalizedLeadPayload): Record<string, unknown> {
  return compactRecord({
    name: buildTwentyLeadName(lead),
    fairlendLeadId: lead.id,
    captureStatus: toTwentySelectValue(lead.status),
    intent: lead.intent,
    source: lead.source,
    campaign: lead.campaign,
    campaignScanId: lead.campaignScanId,
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    propertyAddress: toTwentyAddress(lead),
    formattedAddress: lead.formattedAddress ?? lead.address,
    googlePlaceId: lead.placeId,
    intakeType: lead.intakeType,
    requestedAmount: lead.intakeAmount,
    timeline: lead.intakeTimeline,
    projectStage: lead.intakeProjectStage,
    mortgageProduct: lead.intakeMortgageProduct
      ? toTwentySelectValue(lead.intakeMortgageProduct)
      : null,
    mortgageGoal: lead.intakeMortgageGoal,
    financingNeeds: lead.intakeFinancingNeeds,
    propertyValue: lead.intakePropertyValue,
    mortgageBalance: lead.intakeMortgageBalance,
    additionalLiens: lead.intakeAdditionalLiens,
    investmentFocus: lead.intakeInvestmentFocus,
    intakeSummary: lead.intakeSummary,
    intakeDetail: lead.intakeDetail,
    intakePayload: nonEmptyRecord(lead.intake),
    addressPayload: nonEmptyRecord(lead.addressDetails),
    attributionPayload: nonEmptyRecord(lead.attribution),
  })
}

async function upsertTwentyMortgageLead({
  apiKey,
  apiUrl,
  fetchImpl,
  lead,
}: {
  apiKey: string
  apiUrl: string
  fetchImpl: FetchImplementation
  lead: NormalizedLeadPayload
}): Promise<string> {
  const recordUrl = `${apiUrl}/rest/${mortgageLeadEndpoint}/${encodeURIComponent(lead.id)}`
  const updateResponse = await twentyRequest(fetchImpl, recordUrl, apiKey, {
    method: 'PATCH',
    body: JSON.stringify(toTwentyMortgageLeadUpdateInput(lead)),
  })

  if (updateResponse.ok) {
    return extractRecordId(updateResponse, lead.id)
  }

  if (updateResponse.status !== 404) {
    throw await toTwentyApiError(updateResponse, 'update mortgage lead')
  }

  const createResponse = await twentyRequest(
    fetchImpl,
    `${apiUrl}/rest/${mortgageLeadEndpoint}`,
    apiKey,
    {
      method: 'POST',
      body: JSON.stringify(toTwentyMortgageLeadCreateInput(lead)),
    },
  )

  if (createResponse.ok) {
    return extractRecordId(createResponse, lead.id)
  }

  if (createResponse.status === 409) {
    const retryResponse = await twentyRequest(fetchImpl, recordUrl, apiKey, {
      method: 'PATCH',
      body: JSON.stringify(toTwentyMortgageLeadUpdateInput(lead)),
    })

    if (retryResponse.ok) {
      return extractRecordId(retryResponse, lead.id)
    }

    throw await toTwentyApiError(retryResponse, 'update mortgage lead after create conflict')
  }

  throw await toTwentyApiError(createResponse, 'create mortgage lead')
}

async function twentyRequest(
  fetchImpl: FetchImplementation,
  url: string,
  apiKey: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs)

  try {
    return await fetchImpl(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
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

async function toTwentyApiError(response: Response, operation: string): Promise<Error> {
  const requestId = response.headers.get('x-request-id')
  const detail = await response
    .clone()
    .json()
    .then((body: unknown) => extractSafeApiMessage(body))
    .catch(() => null)
  const suffix = [detail, requestId ? `request ${requestId}` : null].filter(Boolean).join('; ')

  return new Error(
    `Twenty API could not ${operation}: HTTP ${response.status}${suffix ? ` (${suffix})` : ''}`,
  )
}

function extractSafeApiMessage(body: unknown): string | null {
  if (!isRecord(body)) return null

  for (const key of ['message', 'error', 'code']) {
    const value = body[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim().slice(0, 240)
    }
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

function buildTwentyLeadName(lead: NormalizedLeadPayload): string {
  const contact = lead.name?.trim()
  const descriptor = lead.intakeMortgageGoal ?? lead.intakeType ?? lead.intent

  if (contact && descriptor) return `${contact} — ${descriptor}`.slice(0, 240)
  if (contact) return contact.slice(0, 240)
  if (lead.address) return lead.address.slice(0, 240)
  return `FairLend lead ${lead.id.slice(0, 8)}`
}

function normalizeApiUrl(value: string | undefined): string {
  return (value?.trim() || defaultTwentyApiUrl).replace(/\/+$/, '')
}

function toTwentySelectValue(value: string): string {
  return value.trim().replace(/[-\s]+/g, '_').toUpperCase()
}

function compactRecord(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  )
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
