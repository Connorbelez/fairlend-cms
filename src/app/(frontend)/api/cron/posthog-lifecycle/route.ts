import { reconcilePostHogLifecycle } from '@/lib/analytics/lifecycle'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: Request): Promise<Response> {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await reconcilePostHogLifecycle()
    console.info('PostHog lifecycle reconciliation complete', result)
    return Response.json({ ok: result.failed === 0, ...result }, { status: result.failed ? 500 : 200 })
  } catch (error) {
    console.error('PostHog lifecycle reconciliation failed', error)
    return Response.json({ error: 'Lifecycle reconciliation failed', ok: false }, { status: 500 })
  }
}
