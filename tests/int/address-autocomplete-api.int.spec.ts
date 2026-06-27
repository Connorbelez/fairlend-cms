import { afterEach, describe, expect, it, vi } from 'vitest'

import { POST as autocompletePost } from '@/app/(frontend)/api/address-autocomplete/route'
import { POST as detailsPost } from '@/app/(frontend)/api/address-details/route'

const originalGoogleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY

describe('address autocomplete API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    process.env.GOOGLE_MAPS_API_KEY = originalGoogleMapsApiKey
  })

  it('returns no suggestions before the minimum query length', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-key'
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const response = await autocompletePost(jsonRequest({ input: '12' }) as never)

    await expect(response.json()).resolves.toEqual({ suggestions: [] })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('maps Google place predictions into compact suggestions', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        suggestions: [
          {
            placePrediction: {
              placeId: 'ChIJ-test',
              structuredFormat: {
                mainText: { text: '123 Main Street' },
                secondaryText: { text: 'Toronto, ON, Canada' },
              },
              text: { text: '123 Main Street, Toronto, ON, Canada' },
            },
          },
        ],
      }),
    )

    const response = await autocompletePost(
      jsonRequest({ input: '123 Main', sessionToken: 'session-1' }) as never,
    )

    await expect(response.json()).resolves.toEqual({
      suggestions: [
        {
          id: 'ChIJ-test',
          mainText: '123 Main Street',
          placeId: 'ChIJ-test',
          secondaryText: 'Toronto, ON, Canada',
          text: '123 Main Street, Toronto, ON, Canada',
        },
      ],
    })
  })

  it('surfaces Google Places API enablement failures in non-production responses', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-key'
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        {
          error: {
            code: 403,
            details: [
              {
                '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                metadata: {
                  activationUrl:
                    'https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=test',
                  service: 'places.googleapis.com',
                  serviceTitle: 'Places API (New)',
                },
                reason: 'SERVICE_DISABLED',
              },
            ],
            message: 'Places API (New) has not been used or is disabled.',
            status: 'PERMISSION_DENIED',
          },
        },
        { status: 403 },
      ),
    )

    const response = await autocompletePost(jsonRequest({ input: '1117 Haig' }) as never)

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toMatchObject({
      error: 'Google address autocomplete failed',
      googleActivationUrl:
        'https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=test',
      googleMessage: 'Places API (New) has not been used or is disabled.',
      googleReason: 'SERVICE_DISABLED',
      googleStatus: 'PERMISSION_DENIED',
      upstreamStatus: 403,
    })
  })

  it('returns selected place details', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        addressComponents: [{ longText: 'Toronto' }],
        formattedAddress: '123 Main Street, Toronto, ON, Canada',
        id: 'ChIJ-test',
        location: { latitude: 43.65, longitude: -79.38 },
      }),
    )

    const response = await detailsPost(
      jsonRequest({ placeId: 'ChIJ-test', sessionToken: 'session-1' }) as never,
    )

    await expect(response.json()).resolves.toMatchObject({
      addressComponents: [{ longText: 'Toronto' }],
      formattedAddress: '123 Main Street, Toronto, ON, Canada',
      id: 'ChIJ-test',
      location: { latitude: 43.65, longitude: -79.38 },
      placeId: 'ChIJ-test',
    })
  })
})

function jsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  })
}
