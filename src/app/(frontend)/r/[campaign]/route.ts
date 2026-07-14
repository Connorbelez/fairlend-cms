import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  createFairlendCampaignAttribution,
  fairlendCampaignAttributionCookieName,
  fairlendCampaignAttributionMarkerCookieName,
  fairlendCampaignAttributionMaxAgeSeconds,
  getFairlendCampaignConfig,
  getFairlendCampaignRequestMetadata,
  persistFairlendCampaignScan,
  serializeFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'

export const runtime = 'nodejs'

type Args = {
  params: Promise<{
    campaign?: string
  }>
}

export async function GET(request: NextRequest, { params }: Args): Promise<NextResponse> {
  const { campaign = '' } = await params
  const config = getFairlendCampaignConfig(campaign)

  if (!config) {
    return new NextResponse(null, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
      status: 404,
    })
  }

  const destination = config.destination
  const redirectUrl = new URL(destination, request.nextUrl.origin)
  const response = NextResponse.redirect(redirectUrl, 302)

  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Robots-Tag', 'noindex')

  const attribution = createFairlendCampaignAttribution(config)

  response.cookies.set(
    fairlendCampaignAttributionCookieName,
    serializeFairlendCampaignAttribution(attribution),
    {
      httpOnly: true,
      maxAge: fairlendCampaignAttributionMaxAgeSeconds,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  )
  response.cookies.set(fairlendCampaignAttributionMarkerCookieName, '1', {
    httpOnly: false,
    maxAge: fairlendCampaignAttributionMaxAgeSeconds,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  try {
    await persistFairlendCampaignScan({
      ...attribution,
      ...getFairlendCampaignRequestMetadata(request),
    })
  } catch (error) {
    console.error('Failed to persist FairLend QR campaign scan', error)
  }

  return response
}
