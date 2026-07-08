export const fairlendBuildIntent = 'build'

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

export function isFairlendGenericLeadIntent(
  intent?: string | null,
): intent is FairlendGenericLeadIntent {
  return genericIntentSet.has(normalizeFairlendIntakeIntent(intent))
}

export function buildFairlendIntakeHref({
  address,
  email,
  intent = fairlendBuildIntent,
  leadId,
  name,
  phone,
  source,
}: {
  address?: string | null
  email?: string | null
  intent?: FairlendIntakeIntent | string | null
  leadId?: string | null
  name?: string | null
  phone?: string | null
  source?: string | null
} = {}): string {
  const params = new URLSearchParams()
  params.set('intent', normalizeFairlendIntakeIntent(intent))

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
