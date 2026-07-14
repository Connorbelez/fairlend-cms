import { afterEach, describe, expect, it, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({
  reconcilePostHogLifecycle: vi.fn(),
  revokeLeadAnalyticsConsent: vi.fn(),
}))

vi.mock('@/lib/analytics/lifecycle', () => ({
  reconcilePostHogLifecycle: apiMocks.reconcilePostHogLifecycle,
}))

vi.mock('@/lib/analytics/server', () => ({
  revokeLeadAnalyticsConsent: apiMocks.revokeLeadAnalyticsConsent,
}))

import { POST as revoke } from '@/app/(frontend)/api/analytics/consent/revoke/route'
import { GET as reconcile } from '@/app/(frontend)/api/cron/posthog-lifecycle/route'

describe('analytics server endpoints', () => {
  afterEach(() => {
    apiMocks.reconcilePostHogLifecycle.mockReset()
    apiMocks.revokeLeadAnalyticsConsent.mockReset()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('enforces CRON_SECRET before reconciliation', async () => {
    vi.stubEnv('CRON_SECRET', 'expected-secret')
    const response = await reconcile(new Request('http://localhost/api/cron/posthog-lifecycle'))
    expect(response.status).toBe(401)
    expect(apiMocks.reconcilePostHogLifecycle).not.toHaveBeenCalled()
  })

  it('fails monitoring-visible when lifecycle reconciliation has sanitized failures', async () => {
    vi.stubEnv('CRON_SECRET', 'expected-secret')
    apiMocks.reconcilePostHogLifecycle.mockResolvedValue({ captured: 2, checked: 3, failed: 1 })
    vi.spyOn(console, 'info').mockImplementation(() => {})

    const response = await reconcile(
      new Request('http://localhost/api/cron/posthog-lifecycle', {
        headers: { authorization: 'Bearer expected-secret' },
      }),
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toMatchObject({ failed: 1, ok: false })
  })

  it('accepts a valid signed revocation capability and rejects invalid ones', async () => {
    apiMocks.revokeLeadAnalyticsConsent.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    const accepted = await revoke(
      new Request('http://localhost/api/analytics/consent/revoke', {
        body: JSON.stringify({ token: 'valid-token' }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }),
    )
    const rejected = await revoke(
      new Request('http://localhost/api/analytics/consent/revoke', {
        body: JSON.stringify({ token: 'invalid-token' }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }),
    )

    expect(accepted.status).toBe(200)
    expect(rejected.status).toBe(400)
  })
})
