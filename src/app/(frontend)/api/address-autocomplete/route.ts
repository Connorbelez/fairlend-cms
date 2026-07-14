import { NextRequest } from 'next/server'

import { googlePlacesErrorResponse } from '../googlePlacesError'

export const runtime = 'nodejs'

type GoogleAutocompleteSuggestion = {
  placePrediction?: {
    placeId?: string
    structuredFormat?: {
      mainText?: { text?: string }
      secondaryText?: { text?: string }
    }
    text?: { text?: string }
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'GOOGLE_MAPS_API_KEY is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const input = typeof body?.input === 'string' ? body.input.trim() : ''
  const sessionToken = typeof body?.sessionToken === 'string' ? body.sessionToken : undefined

  if (input.length < 3) {
    return Response.json({ suggestions: [] })
  }

  const googleResponse = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    body: JSON.stringify({
      includedRegionCodes: ['ca'],
      input: input.slice(0, 240),
      languageCode: 'en',
      sessionToken,
    }),
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
    },
    method: 'POST',
  })

  if (!googleResponse.ok) {
    return googlePlacesErrorResponse(googleResponse, 'Google address autocomplete failed')
  }

  const payload = (await googleResponse.json()) as {
    suggestions?: GoogleAutocompleteSuggestion[]
  }

  const suggestions = (payload.suggestions ?? [])
    .map((suggestion) => {
      const prediction = suggestion.placePrediction
      const placeId = prediction?.placeId
      const text = prediction?.text?.text

      if (!placeId || !text) {
        return null
      }

      return {
        id: placeId,
        mainText: prediction?.structuredFormat?.mainText?.text ?? text,
        placeId,
        secondaryText: prediction?.structuredFormat?.secondaryText?.text,
        text,
      }
    })
    .filter(Boolean)

  return Response.json({ suggestions })
}
