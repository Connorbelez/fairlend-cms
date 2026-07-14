import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import ts from 'typescript'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeLeadPayload } from '@/lib/fairlend-leads'
import { syncFairlendLeadToTwenty } from '@/lib/twenty/client'
import {
  classifyLeadObjectKind,
  findUnmappedIntakeKeys,
  KNOWN_INTAKE_KEYS,
  normalizeIntakeForKind,
} from '@/lib/twenty/intake-registry'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('FairLend intake routing registry', () => {
  it.each([
    ['mortgage', 'mortgage'],
    ['invest', 'lender'],
    ['build', 'construction'],
    ['partner-apply', 'partner'],
    ['partner-project', 'partner'],
    ['partner-scenario', 'partner'],
    ['consultation', 'consultation'],
    ['contact', 'general'],
    ['route-helper', 'general'],
    ['document-upload', 'general'],
    ['newsletter', 'newsletter'],
    ['new-future-intent', 'general'],
  ] as const)('routes %s to %s', (intent, expected) => {
    expect(classifyLeadObjectKind({ intent, source: 'website' })).toBe(expected)
  })

  it('quarantines unknown intents and reports only genuinely unmapped fields', () => {
    const lead = normalizeLeadPayload({ intent: 'future-product', intake: { mysteryValue: 'x' } })
    expect(normalizeIntakeForKind('general', lead)).toMatchObject({
      inquiryType: 'future-product',
      classificationStatus: 'NEEDS_CLASSIFICATION',
    })
    expect(findUnmappedIntakeKeys(lead.intake)).toEqual(['mysteryValue'])
  })

  it('promotes a draft in place while keeping captured time immutable and Submitted At write-once', () => {
    const draft = normalizeLeadPayload({ id: '9e26d818-30fb-4f06-bf89-bf4b6a47e6a5', status: 'draft' })
    expect(draft.submittedAt).toBeNull()
    expect(draft.timestampProvenance).toBe('not_submitted')

    const submitted = normalizeLeadPayload({
      id: draft.id,
      intake: { submittedAt: '2026-07-14T17:00:00.000Z' },
      status: 'submitted',
    })
    expect(submitted.id).toBe(draft.id)
    expect(submitted.submittedAt).toBe('2026-07-14T17:00:00.000Z')
    expect(submitted.timestampProvenance).toBe('source_supplied')
  })

  it('covers every statically emitted intake object key with a promoted column or shared field', () => {
    const emittedKeys = collectIntakeObjectKeys(path.join(process.cwd(), 'src'))
    const uncovered = [...emittedKeys].filter((key) => !KNOWN_INTAKE_KEYS.has(key)).sort()
    expect(uncovered).toEqual([])
  })
})

describe('Twenty multi-object orchestration', () => {
  it('creates a linked Construction Application for partner-project', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-key')
    const lead = normalizeLeadPayload({
      id: '8b4677fb-4f9e-4aac-97b0-e2ff250af94e',
      intent: 'partner-project',
      intake: { amount: '$900,000', detail: 'Six-unit infill project' },
      name: 'Referral Partner',
      source: 'partner-program',
      status: 'submitted',
    })
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (init?.method === 'PATCH') return new Response(null, { status: 404 })
      if (url.endsWith('/rest/partnerLeads')) return Response.json({ id: lead.id }, { status: 201 })
      if (url.endsWith('/rest/constructionApplications')) return Response.json({ id: lead.id }, { status: 201 })
      return new Response(null, { status: 500 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })
    expect(result).toMatchObject({ status: 'synced', objectKind: 'partner', recordId: lead.id })
    expect(result.status === 'synced' ? result.relatedRecords : []).toContainEqual({
      objectKind: 'construction',
      recordId: lead.id,
    })
    const constructionCreate = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/rest/constructionApplications'))
    expect(JSON.parse(String(constructionCreate?.[1]?.body))).toMatchObject({
      referringPartnerId: lead.id,
      projectScope: 'Partner Referred Project',
      requestedLoan: '$900,000',
      notes: 'Six-unit infill project',
    })
  })

  it('links a Consultation Request and advances the source consultation milestone only', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-key')
    const originId = 'f7b71fbb-7c6f-449f-a9e8-9bb039fc320d'
    const bookingId = '27c2ad43-a840-46a3-af86-b699d5ba7c11'
    const lead = normalizeLeadPayload({
      id: bookingId,
      intent: 'consultation',
      intake: {
        bookingId,
        originatingLeadId: originId,
        scheduledStart: '2026-07-20T14:00:00.000Z',
      },
      status: 'submitted',
    })
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.endsWith(`/rest/mortgageBorrowerLeads/${originId}`) && init?.method === 'GET') {
        return Response.json({ id: originId })
      }
      if (url.endsWith(`/rest/mortgageBorrowerLeads/${originId}`) && init?.method === 'PATCH') {
        expect(JSON.parse(String(init.body))).toEqual({ consultationMilestone: 'SCHEDULED' })
        return Response.json({ id: originId })
      }
      if (url.endsWith(`/rest/fairlendConsultations/${bookingId}`)) return Response.json({ id: bookingId })
      return new Response(null, { status: 500 })
    })

    const result = await syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch })
    expect(result).toMatchObject({ status: 'synced', objectKind: 'consultation', recordId: bookingId })
    const consultationPatch = fetchMock.mock.calls.find(([url]) => String(url).endsWith(`/rest/fairlendConsultations/${bookingId}`))
    expect(JSON.parse(String(consultationPatch?.[1]?.body))).toMatchObject({
      mortgageBorrowerLeadId: originId,
      status: 'SCHEDULED',
    })
  })

  it('attaches document status as a note when the originating application exists', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-key')
    const lead = normalizeLeadPayload({
      id: 'be8fa52d-f72a-463f-a776-4939c283879f',
      intent: 'document-upload',
      intake: { documentStatus: 'Ready to send', detail: 'Permit package assembled' },
      status: 'submitted',
    })
    const noteId = 'a578c8cb-2928-4935-9ee8-215419208cc8'
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.endsWith(`/rest/mortgageBorrowerLeads/${lead.id}`)) return Response.json({ id: lead.id })
      if (url.endsWith('/rest/notes')) return Response.json({ id: noteId }, { status: 201 })
      if (url.endsWith('/rest/noteTargets')) {
        expect(JSON.parse(String(init?.body))).toMatchObject({ noteId, targetMortgageBorrowerLeadId: lead.id })
        return Response.json({ id: 'target-id' }, { status: 201 })
      }
      return new Response(null, { status: 500 })
    })

    await expect(syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }))
      .resolves.toMatchObject({ status: 'synced', objectKind: 'mortgage', recordId: lead.id })
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/rest/generalInquiries'))).toBe(false)
  })

  it('creates Companies only from an explicit organization name', async () => {
    vi.stubEnv('TWENTY_SYNC_ENABLED', 'true')
    vi.stubEnv('TWENTY_API_KEY', 'test-key')
    const lead = normalizeLeadPayload({
      id: 'cb9d2523-2bcb-4475-af3e-33961626e9d8',
      email: 'partner@explicitco.ca',
      intent: 'partner-apply',
      intake: { organizationName: 'Explicit Co.' },
      status: 'submitted',
    })
    const personId = '9c649f20-bac4-4c78-a4aa-17359b4edffc'
    const companyId = '7afde256-448e-4abc-9936-abab7dc63c06'
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/rest/people?')) return Response.json({ data: { people: [{ id: personId }] } })
      if (url.includes('/rest/companies?')) return Response.json({ data: { companies: [] } })
      if (url.endsWith('/rest/companies')) return Response.json({ id: companyId }, { status: 201 })
      if (url.includes(`/rest/partnerLeads/${lead.id}`)) {
        expect(JSON.parse(String(init?.body))).toMatchObject({ companyId, personId, companyName: 'Explicit Co.' })
        return Response.json({ id: lead.id })
      }
      return new Response(null, { status: 500 })
    })

    await expect(syncFairlendLeadToTwenty(lead, { fetchImpl: fetchMock as unknown as typeof fetch }))
      .resolves.toMatchObject({ status: 'synced', objectKind: 'partner' })
  })
})

function collectIntakeObjectKeys(root: string): Set<string> {
  const keys = new Set<string>()
  for (const file of walkTypeScriptFiles(root)) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    )
    const visit = (node: ts.Node): void => {
      if (ts.isPropertyAssignment(node) && propertyName(node.name) === 'intake' && ts.isObjectLiteralExpression(node.initializer)) {
        collectObjectKeys(node.initializer, keys)
      }
      if (
        ts.isBinaryExpression(node)
        && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isPropertyAccessExpression(node.left)
        && node.left.name.text === 'intake'
        && ts.isObjectLiteralExpression(node.right)
      ) {
        collectObjectKeys(node.right, keys)
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  return keys
}

function collectObjectKeys(object: ts.ObjectLiteralExpression, output: Set<string>): void {
  const objectKeys = object.properties
    .filter((property): property is ts.PropertyAssignment | ts.ShorthandPropertyAssignment =>
      ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property))
    .map((property) => propertyName(property.name))
    .filter((key): key is string => Boolean(key))
  const intakeMarkers = new Set([
    'bookingId', 'completionStatus', 'investmentAmount', 'investmentFocus', 'mortgageProduct',
    'projectScope', 'requestedIntent', 'submittedAt',
  ])
  if (!objectKeys.some((key) => intakeMarkers.has(key))) return

  for (const property of object.properties) {
    if (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) {
      const key = propertyName(property.name)
      if (key) output.add(key)
    }
  }
}

function propertyName(name: ts.PropertyName): string | null {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : null
}

function walkTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return walkTypeScriptFiles(absolute)
    return /\.tsx?$/.test(entry.name) ? [absolute] : []
  })
}
