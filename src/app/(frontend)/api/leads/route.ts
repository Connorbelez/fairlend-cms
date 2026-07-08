import type { NextRequest } from 'next/server'

import { upsertFairlendLead, type LeadPayload } from '@/lib/fairlend-leads'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null

  if (!payload || typeof payload !== 'object') {
    return Response.json({ error: 'Lead payload is required' }, { status: 400 })
  }

  try {
    const lead = await upsertFairlendLead(payload)
    return Response.json({ id: lead.id })
  } catch (error) {
    console.error('Failed to persist Fairlend lead', error)
    return Response.json({ error: 'Failed to persist lead' }, { status: 500 })
  }
}
