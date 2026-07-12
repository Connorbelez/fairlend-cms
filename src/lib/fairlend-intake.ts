export const fairlendBuildIntent = 'build'
export const fairlendBridgeLoanSource = 'landing-overview-bridge-loans'
export const fairlendRentalPropertyAcquisitionSource =
  'landing-overview-acquisition-existing-rental-properties'
export const fairlendRentalPropertyRefinanceSource =
  'landing-overview-refinancing-existing-rental-properties'
export const fairlendRentalPropertyAcquisitionHeaderSource =
  'header-nav-acquisition-existing-rental-properties'
export const fairlendRentalPropertyRefinanceHeaderSource =
  'header-nav-refinancing-existing-rental-properties'

export type FairlendRentalPropertyTransaction = 'acquisition' | 'refinance'

export const fairlendProjectScopeOptions = [
  { label: 'Renovation financing', value: 'renovation-financing' },
  { label: 'Multi-plex financing', value: 'multiplex-financing' },
  { label: 'Garden & laneway suites', value: 'garden-laneway-suites' },
  { label: 'MLI-Select insured housing', value: 'mli-select-insured-housing' },
] as const

export type FairlendProjectScope = (typeof fairlendProjectScopeOptions)[number]['value']

const projectScopeAliases = new Map<string, FairlendProjectScope>([
  ['renovation', 'renovation-financing'],
  ['multi-plex-financing', 'multiplex-financing'],
  ['multiplex', 'multiplex-financing'],
  ['garden-suites', 'garden-laneway-suites'],
  ['laneway-suites', 'garden-laneway-suites'],
  ['mli-select', 'mli-select-insured-housing'],
])

const projectScopeSet = new Set<string>(fairlendProjectScopeOptions.map(({ value }) => value))

export const fairlendGenericLeadIntents = [
  'invest',
  'mortgage',
  'partner-apply',
  'partner-project',
  'partner-scenario',
  'route-helper',
  'contact',
  'consultation',
  'document-upload',
  'newsletter',
] as const

export type FairlendGenericLeadIntent = (typeof fairlendGenericLeadIntents)[number]
export type FairlendIntakeIntent = typeof fairlendBuildIntent | FairlendGenericLeadIntent

const genericIntentSet = new Set<string>(fairlendGenericLeadIntents)

export function normalizeFairlendIntakeIntent(intent?: string | null): FairlendIntakeIntent {
  if (!intent) {
    return fairlendBuildIntent
  }

  const normalized = intent.trim().toLowerCase()

  if (normalized === 'construction' || normalized === 'construction-financing') {
    return fairlendBuildIntent
  }

  if (normalized === fairlendBuildIntent || genericIntentSet.has(normalized)) {
    return normalized as FairlendIntakeIntent
  }

  return 'contact'
}

/**
 * Resolves legacy or manually-authored intake URLs where the attribution source
 * is more specific than the generic intent parameter.
 */
export function resolveFairlendIntakeIntent(
  intent?: string | null,
  source?: string | null,
): FairlendIntakeIntent {
  const normalizedIntent = normalizeFairlendIntakeIntent(intent)
  const normalizedSource = source?.trim().toLowerCase()

  if (normalizedIntent === fairlendBuildIntent && normalizedSource === fairlendBridgeLoanSource) {
    return 'mortgage'
  }

  return normalizedIntent
}

/**
 * Identifies the dedicated existing-rental intake and preserves which homepage
 * card sent the borrower so the transaction can be preselected without locking
 * them into the wrong path.
 */
export function resolveFairlendRentalPropertyTransaction(
  source?: string | null,
): FairlendRentalPropertyTransaction | null {
  const normalizedSource = source?.trim().toLowerCase()

  if (
    normalizedSource === fairlendRentalPropertyAcquisitionSource ||
    normalizedSource === fairlendRentalPropertyAcquisitionHeaderSource
  ) {
    return 'acquisition'
  }

  if (
    normalizedSource === fairlendRentalPropertyRefinanceSource ||
    normalizedSource === fairlendRentalPropertyRefinanceHeaderSource
  ) {
    return 'refinance'
  }

  return null
}

export function isFairlendGenericLeadIntent(
  intent?: string | null,
): intent is FairlendGenericLeadIntent {
  return genericIntentSet.has(normalizeFairlendIntakeIntent(intent))
}

export function normalizeFairlendProjectScope(scope?: string | null): FairlendProjectScope | null {
  if (!scope) {
    return null
  }

  const normalized = scope.trim().toLowerCase()
  const alias = projectScopeAliases.get(normalized)

  if (alias) {
    return alias
  }

  return projectScopeSet.has(normalized) ? (normalized as FairlendProjectScope) : null
}

export function getFairlendProjectScopeLabel(scope?: string | null): string {
  const normalized = normalizeFairlendProjectScope(scope)

  return fairlendProjectScopeOptions.find(({ value }) => value === normalized)?.label ?? ''
}

export function buildFairlendIntakeHref({
  address,
  email,
  intent = fairlendBuildIntent,
  leadId,
  name,
  phone,
  projectScope,
  source,
}: {
  address?: string | null
  email?: string | null
  intent?: FairlendIntakeIntent | string | null
  leadId?: string | null
  name?: string | null
  phone?: string | null
  projectScope?: FairlendProjectScope | string | null
  source?: string | null
} = {}): string {
  const params = new URLSearchParams()
  params.set('intent', normalizeFairlendIntakeIntent(intent))

  const normalizedProjectScope = normalizeFairlendProjectScope(projectScope)
  if (normalizedProjectScope) {
    params.set('projectScope', normalizedProjectScope)
  }

  const optionalParams = {
    address,
    email,
    leadId,
    name,
    phone,
    source,
  }

  for (const [key, value] of Object.entries(optionalParams)) {
    const normalized = typeof value === 'string' ? value.trim() : ''
    if (normalized) {
      params.set(key, normalized)
    }
  }

  return `/intake?${params.toString()}`
}

export function buildFairlendContactHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'contact', source })
}

export function buildFairlendConsultationHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'consultation', source })
}

export function buildFairlendInvestorHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'invest', source })
}

export function buildFairlendMortgageHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'mortgage', source })
}

export function buildFairlendBuildHref(source: string): string {
  return buildFairlendIntakeHref({ intent: fairlendBuildIntent, source })
}

export function buildFairlendPartnerHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'partner-apply', source })
}

export function buildFairlendRouteHelperHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'route-helper', source })
}

export function buildFairlendNewsletterHref(source: string): string {
  return buildFairlendIntakeHref({ intent: 'newsletter', source })
}
