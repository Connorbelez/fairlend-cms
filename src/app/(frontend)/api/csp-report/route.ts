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

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text()

  if (Buffer.byteLength(body, 'utf8') > MAX_REPORT_BYTES) {
    return new NextResponse(null, { status: 413 })
  }

  try {
    const report = sanitizeCspReport(JSON.parse(body))
    console.warn(JSON.stringify({ event: 'security.csp_report', report }))
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
      : envelope

  const sanitizedReport: Record<string, number | string> = {}

  for (const field of REPORT_FIELDS) {
    const fieldValue = rawReport[field]

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
