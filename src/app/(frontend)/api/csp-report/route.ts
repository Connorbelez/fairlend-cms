import { createHash } from 'crypto'

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_REPORT_BYTES = 64 * 1024
const REPORT_FIELDS = [
  'blocked-uri',
  'column-number',
  'disposition',
  'document-uri',
  'effective-directive',
  'line-number',
  'source-file',
  'status-code',
  'violated-directive',
] as const

const MODERN_REPORT_FIELDS: Record<string, (typeof REPORT_FIELDS)[number]> = {
  blockedURL: 'blocked-uri',
  columnNumber: 'column-number',
  disposition: 'disposition',
  documentURL: 'document-uri',
  effectiveDirective: 'effective-directive',
  lineNumber: 'line-number',
  sourceFile: 'source-file',
  statusCode: 'status-code',
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text()

  if (Buffer.byteLength(body, 'utf8') > MAX_REPORT_BYTES) {
    return new NextResponse(null, { status: 413 })
  }

  try {
    const parsedBody = JSON.parse(body) as unknown
    const reports = (Array.isArray(parsedBody) ? parsedBody.slice(0, 20) : [parsedBody])
      .map(sanitizeCspReport)
      .filter((report) => Object.keys(report).length > 0)

    if (reports.length === 0) {
      return NextResponse.json({ error: 'Invalid CSP report' }, { status: 400 })
    }

    for (const report of reports) {
      const fingerprint = createHash('sha256')
        .update(
          [
            report['effective-directive'] || report['violated-directive'] || 'unknown',
            report['blocked-uri'] || 'unknown',
            report['source-file'] || 'unknown',
          ].join(':'),
        )
        .digest('hex')
        .slice(0, 16)

      console.warn(
        JSON.stringify({
          deployment: process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || null,
          disposition: report.disposition || 'report',
          environment: process.env.VERCEL_ENV || process.env.NODE_ENV || null,
          event: 'security.csp_report',
          fingerprint,
          report,
          timestamp: new Date().toISOString(),
        }),
      )
    }
  } catch {
    return NextResponse.json({ error: 'Invalid CSP report' }, { status: 400 })
  }

  return new NextResponse(null, { status: 204 })
}

function sanitizeCspReport(value: unknown): Record<string, number | string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const envelope = value as Record<string, unknown>
  const rawReport =
    envelope['csp-report'] && typeof envelope['csp-report'] === 'object'
      ? (envelope['csp-report'] as Record<string, unknown>)
      : envelope.body && typeof envelope.body === 'object'
        ? (envelope.body as Record<string, unknown>)
        : envelope

  const normalizedReport = { ...rawReport }

  for (const [modernField, legacyField] of Object.entries(MODERN_REPORT_FIELDS)) {
    if (normalizedReport[legacyField] === undefined && rawReport[modernField] !== undefined) {
      normalizedReport[legacyField] = rawReport[modernField]
    }
  }

  const sanitizedReport: Record<string, number | string> = {}

  for (const field of REPORT_FIELDS) {
    const fieldValue = normalizedReport[field]

    if (typeof fieldValue === 'number') {
      sanitizedReport[field] = fieldValue
      continue
    }

    if (typeof fieldValue !== 'string') {
      continue
    }

    sanitizedReport[field] =
      field.endsWith('-uri') || field === 'source-file'
        ? stripUrlDetails(fieldValue)
        : fieldValue.slice(0, 512)
  }

  return sanitizedReport
}

function stripUrlDetails(value: string): string {
  try {
    const url = new URL(value)
    url.search = ''
    url.hash = ''
    return url.toString().slice(0, 2048)
  } catch {
    return value.slice(0, 512)
  }
}
