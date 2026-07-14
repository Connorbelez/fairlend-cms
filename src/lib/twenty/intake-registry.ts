import type { NormalizedLeadPayload } from '@/lib/fairlend-leads'

export type LeadObjectKind =
  | 'mortgage'
  | 'lender'
  | 'construction'
  | 'partner'
  | 'consultation'
  | 'general'
  | 'newsletter'

export type TimestampProvenance = 'source_supplied' | 'inferred_created_at' | 'not_submitted'

export type NormalizedIntakeByKind = {
  mortgage: Record<string, unknown>
  lender: Record<string, unknown>
  construction: Record<string, unknown>
  partner: Record<string, unknown>
  consultation: Record<string, unknown>
  general: Record<string, unknown>
  newsletter: Record<string, unknown>
}

export type IntakeFieldMapping = {
  destinationField: string
  sourceKey: string
}

export const TWENTY_OBJECT_ENDPOINTS: Record<LeadObjectKind, string> = {
  mortgage: 'mortgageBorrowerLeads',
  lender: 'lenderApplications',
  construction: 'constructionApplications',
  partner: 'partnerLeads',
  consultation: 'fairlendConsultations',
  general: 'generalInquiries',
  newsletter: 'newsletterSubscriptions',
}

const direct = (...keys: string[]): IntakeFieldMapping[] =>
  keys.map((key) => ({ sourceKey: key, destinationField: key }))

export const INTAKE_FIELD_REGISTRY: Record<LeadObjectKind, readonly IntakeFieldMapping[]> = {
  mortgage: [
    { sourceKey: 'amountNeeded', destinationField: 'amount' },
    ...direct(
      'amount',
      'mortgageProduct',
      'mortgageGoal',
      'situation',
      'situationType',
      'propertyValue',
      'estimatedValue',
      'homepageValue',
      'currentMortgage',
      'mortgageBalance',
      'additionalLiens',
      'additionalLienDetails',
      'additionalDebtAmount',
      'timeline',
      'propertyUse',
      'occupancyStatus',
      'ownershipStatus',
      'ownershipStructure',
      'numberOfUnits',
      'grossRentalIncome',
      'exitPlan',
      'documentStatus',
    ),
    { sourceKey: 'role', destinationField: 'borrowerRole' },
  ],
  lender: [
    { sourceKey: 'role', destinationField: 'applicantType' },
    { sourceKey: 'amount', destinationField: 'deployableCapital' },
    { sourceKey: 'timeline', destinationField: 'preferredReviewWindow' },
    { sourceKey: 'situation', destinationField: 'lendingExperience' },
    { sourceKey: 'propertyUse', destinationField: 'mortgageLane' },
    { sourceKey: 'exitPlan', destinationField: 'investmentPriority' },
    ...direct('investmentAmount', 'investmentFocus'),
  ],
  construction: direct(
    'intakeVariant',
    'projectScope',
    'buildType',
    'suiteType',
    'projectStage',
    'siteControl',
    'financingNeeds',
    'financingTimeline',
    'requestedLoan',
    'projectCost',
    'borrowerEquity',
    'approximateEquity',
    'borrowerExperience',
    'projectTeam',
    'contactRole',
    'unitCount',
    'occupancy',
    'buildPermitFileName',
    'termsAccepted',
  ),
  partner: [
    { sourceKey: 'requestedIntent', destinationField: 'partnerType' },
    { sourceKey: 'role', destinationField: 'partnerRole' },
    ...direct('amount'),
  ],
  consultation: direct(
    'bookingId',
    'scheduledStart',
    'scheduledEnd',
    'timezone',
    'googleEventId',
    'googleEventLink',
    'syncError',
    'originatingLeadId',
    'amountNeeded',
    'estimatedValue',
    'mortgageBalance',
    'situationType',
    'timeline',
  ),
  general: [
    ...direct('firstName', 'lastName', 'situation', 'documentStatus', 'amount'),
    { sourceKey: 'role', destinationField: 'inquiryRole' },
  ],
  newsletter: direct('list', 'consentSource', 'consentText', 'consentVersion'),
}

export const COMMON_INTAKE_FIELD_KEYS = [
  'companyName',
  'organizationName',
  'page',
  'completionStatus',
  'detail',
  'message',
  'notes',
  'submittedAt',
  'requestedIntent',
] as const

export const KNOWN_INTAKE_KEYS = new Set([
  ...COMMON_INTAKE_FIELD_KEYS,
  ...Object.values(INTAKE_FIELD_REGISTRY).flatMap((mappings) => mappings.map(({ sourceKey }) => sourceKey)),
  'address',
  'email',
  'name',
  'phone',
  'source',
])

const registeredIntents = new Set([
  'build',
  'contact',
  'consultation',
  'document-upload',
  'invest',
  'mortgage',
  'newsletter',
  'partner-apply',
  'partner-project',
  'partner-scenario',
  'route-helper',
])

export function classifyLeadObjectKind(lead: Pick<NormalizedLeadPayload, 'intent' | 'source'>): LeadObjectKind {
  switch (lead.intent) {
    case 'mortgage': return 'mortgage'
    case 'invest': return 'lender'
    case 'build': return 'construction'
    case 'partner-apply':
    case 'partner-project':
    case 'partner-scenario': return 'partner'
    case 'consultation': return 'consultation'
    case 'newsletter': return 'newsletter'
    case 'contact':
    case 'route-helper':
    case 'document-upload': return 'general'
    default:
      if (lead.source.startsWith('borrowers-page') || lead.source.includes('mortgage')) return 'mortgage'
      return 'general'
  }
}

export function isUnknownIntent(intent: string | null): boolean {
  return !intent || !registeredIntents.has(intent)
}

export function normalizeIntakeForKind<K extends LeadObjectKind>(
  kind: K,
  lead: NormalizedLeadPayload,
): NormalizedIntakeByKind[K] {
  const output: Record<string, unknown> = {}

  for (const { sourceKey, destinationField } of INTAKE_FIELD_REGISTRY[kind]) {
    const value = normalizeFieldValue(lead.intake[sourceKey])
    if (value !== null) output[destinationField] = value
  }

  for (const key of ['page', 'completionStatus', 'detail', 'message', 'notes'] as const) {
    const value = normalizeFieldValue(lead.intake[key])
    if (value !== null) output[key] = value
  }

  if (kind === 'partner') {
    const context = normalizeFieldValue(lead.intake.detail ?? lead.intake.message ?? lead.intake.notes)
    if (lead.intent === 'partner-project' && context !== null) output.projectContext = context
    if (lead.intent === 'partner-scenario' && context !== null) output.scenarioContext = context
  }

  if (kind === 'consultation') {
    output.originatingObjectKind = normalizeFieldValue(lead.intake.originatingObjectKind)
  }

  if (kind === 'general') {
    output.inquiryType = lead.intent ?? 'unknown'
    output.classificationStatus = isUnknownIntent(lead.intent) ? 'NEEDS_CLASSIFICATION' : 'CLASSIFIED'
  }

  if (kind === 'newsletter') {
    output.subscribedAt = normalizeFieldValue(lead.intake.submittedAt) ?? lead.submittedAt
  }

  return output as NormalizedIntakeByKind[K]
}

export function toPartnerProjectConstructionFields(lead: NormalizedLeadPayload): Record<string, unknown> {
  const context = normalizeFieldValue(lead.intake.detail ?? lead.intake.message ?? lead.intake.notes)
  return compactRecord({
    projectScope: normalizeFieldValue(lead.intake.projectScope) ?? 'Partner Referred Project',
    projectStage: normalizeFieldValue(lead.intake.projectStage),
    requestedLoan: normalizeFieldValue(lead.intake.requestedLoan ?? lead.intake.amount),
    projectCost: normalizeFieldValue(lead.intake.projectCost),
    siteControl: normalizeFieldValue(lead.intake.siteControl),
    notes: context,
  })
}

export function findUnmappedIntakeKeys(intake: Record<string, unknown>): string[] {
  return Object.keys(intake).filter((key) => !KNOWN_INTAKE_KEYS.has(key)).sort()
}

function normalizeFieldValue(value: unknown): string | boolean | null {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (Array.isArray(value)) {
    const values = value.map((item) => normalizeFieldValue(item)).filter((item): item is string | boolean => item !== null)
    return values.length > 0 ? values.join(', ') : null
  }
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function compactRecord(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ''))
}
