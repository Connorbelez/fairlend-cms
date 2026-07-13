import type { Endpoint, PayloadHandler } from 'payload'

import { buildFairlendLeadExportFilename, buildFairlendLeadsCsv } from '@/lib/fairlend-lead-export'

export const exportFairlendLeads: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const result = await req.payload.find({
      collection: 'fairlend-leads',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'createdAt',
    })
    const csv = buildFairlendLeadsCsv(result.docs)

    return new Response(csv, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="${buildFairlendLeadExportFilename()}"`,
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Exported-Count': String(result.docs.length),
      },
      status: 200,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Failed to export FairLend leads' })
    return Response.json({ error: 'Failed to export leads' }, { status: 500 })
  }
}

export const fairlendLeadExportEndpoint: Endpoint = {
  handler: exportFairlendLeads,
  method: 'get',
  path: '/export',
}
