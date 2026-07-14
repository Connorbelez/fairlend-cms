import { PostHog } from 'posthog-node'

import {
  deriveLeadAnalyticsDistinctId,
  deriveLifecycleInsertId,
  listAnalyticsEligibleLifecycleLeads,
} from './server'
import { TWENTY_OBJECT_ENDPOINTS, type LeadObjectKind } from '@/lib/twenty/intake-registry'

type LifecycleEvent =
  | 'fairlend_lead_qualified'
  | 'fairlend_lead_working_file'
  | 'fairlend_lead_closed_won'
  | 'fairlend_lead_closed_lost'

const lifecycleByStatus: Record<string, LifecycleEvent> = {
  QUALIFIED: 'fairlend_lead_qualified',
  APPLICATION_IN_PROGRESS: 'fairlend_lead_working_file',
  UNDERWRITING: 'fairlend_lead_working_file',
  FUNDED: 'fairlend_lead_closed_won',
  COMPLETED: 'fairlend_lead_closed_won',
  DECLINED: 'fairlend_lead_closed_lost',
}

const allowedObjectKinds = new Set<LeadObjectKind>([
  'mortgage',
  'lender',
  'construction',
  'partner',
])

export async function reconcilePostHogLifecycle(limit = 500): Promise<{
  captured: number
  checked: number
  failed: number
}> {
  const projectKey = process.env.POSTHOG_PROJECT_KEY?.trim()
  const apiKey = process.env.TWENTY_API_KEY?.trim()
  if (!projectKey) throw new Error('POSTHOG_PROJECT_KEY is required')
  if (!apiKey) throw new Error('TWENTY_API_KEY is required')

  const posthog = new PostHog(projectKey, {
    host: process.env.POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
    flushAt: 20,
    flushInterval: 0,
  })
  const leads = await listAnalyticsEligibleLifecycleLeads(limit)
  let captured = 0
  let failed = 0

  try {
    for (const lead of leads) {
      try {
        if (!allowedObjectKinds.has(lead.twentyObjectKind as LeadObjectKind)) continue
        const status = await fetchTwentyStatus(
          lead.twentyObjectKind as LeadObjectKind,
          lead.twentyRecordId,
          apiKey,
        )
        const event = mapTwentyLifecycleStatus(status)
        if (!event) continue

        posthog.capture({
          distinctId: deriveLeadAnalyticsDistinctId(lead.leadId),
          event,
          properties: {
            $insert_id: deriveLifecycleInsertId(lead.leadId, event),
            deployment_environment: 'production',
            intent: lead.intent ?? 'unknown',
            schema_version: 1,
            source: lead.source,
          },
        })
        captured += 1
      } catch (error) {
        failed += 1
        console.error('PostHog lifecycle lead reconciliation failed', {
          error: error instanceof Error ? error.message : 'Unknown lifecycle error',
          objectKind: lead.twentyObjectKind,
        })
      }
    }
  } finally {
    await posthog.shutdown()
  }

  return { captured, checked: leads.length, failed }
}

export function mapTwentyLifecycleStatus(status: string | null): LifecycleEvent | undefined {
  return status ? lifecycleByStatus[status] : undefined
}

async function fetchTwentyStatus(
  objectKind: LeadObjectKind,
  recordId: string,
  apiKey: string,
): Promise<string | null> {
  const apiUrl = (process.env.TWENTY_API_URL?.trim() || 'https://api.twenty.com').replace(/\/+$/, '')
  const response = await fetch(
    `${apiUrl}/rest/${TWENTY_OBJECT_ENDPOINTS[objectKind]}/${encodeURIComponent(recordId)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'fairlend-cms/posthog-lifecycle',
      },
      signal: AbortSignal.timeout(10_000),
    },
  )
  if (!response.ok) throw new Error(`Twenty lifecycle lookup returned HTTP ${response.status}`)
  const payload = (await response.json().catch(() => null)) as unknown
  const record = unwrapRecord(payload)
  return normalizeStatus(record?.workflowStatus ?? record?.status)
}

function unwrapRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
    return record.data as Record<string, unknown>
  }
  return record
}

function normalizeStatus(value: unknown): string | null {
  if (typeof value === 'string') return value.trim().toUpperCase()
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    const nested = record.value ?? record.name ?? record.label
    return typeof nested === 'string' ? nested.trim().toUpperCase() : null
  }
  return null
}
