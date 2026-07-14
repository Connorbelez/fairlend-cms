import { revokeLeadAnalyticsConsent } from '@/lib/analytics/server'

export const runtime = 'nodejs'

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { token?: unknown } | null
  if (!body || typeof body.token !== 'string') {
    return Response.json({ error: 'Revocation token is required' }, { status: 400 })
  }

  try {
    const revoked = await revokeLeadAnalyticsConsent(body.token)
    if (!revoked) return Response.json({ error: 'Invalid revocation token' }, { status: 400 })
    return Response.json({ revoked: true })
  } catch (error) {
    console.error('Failed to revoke FairLend analytics consent', error)
    return Response.json({ error: 'Unable to revoke analytics consent' }, { status: 500 })
  }
}
