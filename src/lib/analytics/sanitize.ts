export type AnalyticsPrimitive = boolean | number | string | null | undefined

export type AnalyticsProperties = Record<string, AnalyticsPrimitive>

const prohibitedKeyPattern =
  /(^|[_-])(address|amount|answer|balance|city|company|debt|document|email|equity|file|first[_-]?name|last[_-]?name|lead[_-]?id|message|model[_-]?value|name|note|phone|postal|property[_-]?value|street|value)($|[_-])/i

const emailValuePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const uuidValuePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const phoneValuePattern = /^\+?[\d(). -]{7,}$/

function isSensitiveString(value: string): boolean {
  return (
    emailValuePattern.test(value) || uuidValuePattern.test(value) || phoneValuePattern.test(value)
  )
}

const allowedCampaignKeys = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'source',
  'intent',
])

const safeValuePattern = /^[\p{L}\p{N} ._:/+-]+$/u

export function sanitizeAnalyticsPath(value: string): string {
  try {
    const url = new URL(value, 'https://www.fairlend.ca')
    return url.pathname || '/'
  } catch {
    return value.split(/[?#]/, 1)[0]?.slice(0, 300) || '/'
  }
}

export function sanitizeAnalyticsProperties(
  properties: Record<string, unknown> = {},
): Record<string, boolean | number | string> {
  const safe: Record<string, boolean | number | string> = {}

  for (const [key, value] of Object.entries(properties)) {
    if (value == null || prohibitedKeyPattern.test(key)) continue
    if (typeof value === 'boolean') {
      safe[key] = value
      continue
    }
    if (typeof value === 'number') {
      if (Number.isFinite(value) && !/(amount|balance|equity|value|cost|loan|price)/i.test(key)) {
        safe[key] = value
      }
      continue
    }
    if (typeof value !== 'string') continue

    const normalized = /(^|_)(page_path|path|url)($|_)/i.test(key)
      ? sanitizeAnalyticsPath(value)
      : value.trim().slice(0, allowedCampaignKeys.has(key) ? 100 : 160)

    if (!normalized) continue
    if (isSensitiveString(normalized)) continue
    if (allowedCampaignKeys.has(key) && !safeValuePattern.test(normalized)) continue
    safe[key] = normalized
  }

  return safe
}

export function getRemovedAnalyticsPropertyKeys(
  properties: Record<string, unknown>,
  sanitized: Record<string, boolean | number | string>,
): string[] {
  return Object.keys(properties).filter(
    (key) => properties[key] != null && !Object.prototype.hasOwnProperty.call(sanitized, key),
  )
}

export function sanitizePostHogEvent<T extends { event?: string; properties?: Record<string, unknown> }>(
  event: T | null,
): T | null {
  if (!event?.properties) return event

  const properties = { ...event.properties }
  for (const key of ['$current_url', '$pathname', '$referrer', '$referring_domain', 'page_path']) {
    const value = properties[key]
    if (typeof value === 'string') properties[key] = sanitizeAnalyticsPath(value)
  }

  for (const key of Object.keys(properties)) {
    const value = properties[key]
    if (
      prohibitedKeyPattern.test(key) ||
      (typeof value === 'object' && value !== null) ||
      (typeof value === 'string' && isSensitiveString(value.trim()))
    ) {
      delete properties[key]
    }
  }

  return { ...event, properties }
}

export function readAllowlistedCampaignProperties(search: string): AnalyticsProperties {
  const params = new URLSearchParams(search)
  const properties: AnalyticsProperties = {}
  for (const key of allowedCampaignKeys) {
    const value = params.get(key)
    if (value) properties[key] = value
  }
  return sanitizeAnalyticsProperties(properties)
}
