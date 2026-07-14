import { NextResponse } from 'next/server'

import { getIndexNowKey } from '@/lib/indexnow'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export function GET(): NextResponse {
  const key = getIndexNowKey()

  if (!key) {
    return new NextResponse(null, {
      headers: { 'X-Robots-Tag': 'noindex' },
      status: 404,
    })
  }

  return new NextResponse(key, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
    },
    status: 200,
  })
}
