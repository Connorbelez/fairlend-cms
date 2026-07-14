import { NextRequest } from 'next/server'

import { googlePlacesErrorResponse } from '../googlePlacesError'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'GOOGLE_MAPS_API_KEY is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const placeId = typeof body?.placeId === 'string' ? body.placeId.trim() : ''
  const sessionToken = typeof body?.sessionToken === 'string' ? body.sessionToken : undefined

  if (!placeId) {
    return Response.json({ error: 'placeId is required' }, { status: 400 })
  }

  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`)
  if (sessionToken) {
    url.searchParams.set('sessionToken', sessionToken)
  }

  const googleResponse = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,formattedAddress,addressComponents,location,postalAddress',
    },
    method: 'GET',
  })

  if (!googleResponse.ok) {
    return googlePlacesErrorResponse(googleResponse, 'Google address details failed')
  }

  const details = await googleResponse.json()
  const regionCode =
    typeof details?.postalAddress?.regionCode === 'string'
      ? details.postalAddress.regionCode.trim().toUpperCase()
      : ''

  if (regionCode && regionCode !== 'CA') {
    return Response.json(
      { code: 'NON_CANADIAN_ADDRESS', error: 'Select a Canadian address.' },
      { status: 422 },
    )
  }

  return Response.json({
    addressComponents: details.addressComponents,
    formattedAddress: details.formattedAddress,
    id: details.id,
    location: details.location,
    placeId,
    postalAddress: details.postalAddress,
    regionCode: regionCode || 'CA',
  })
}
