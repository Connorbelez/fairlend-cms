import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fairlendCampaignAttributionCookieName,
  serializeFairlendCampaignAttribution,
} from '@/lib/fairlend-campaign-attribution'

import {
  bookConsultation,
  ConsultationBookingError,
  getConsultationAvailability,
} from '@/lib/fairlend-consultations/service'
import { GET } from '@/app/(frontend)/api/consultations/availability/route'
import { POST } from '@/app/(frontend)/api/consultations/book/route'

const journeyMocks = vi.hoisted(() => ({
  recordFairlendCampaignJourneyEvent: vi.fn(),
}))

vi.mock('@/lib/fairlend-campaign-journey', () => ({
  recordFairlendCampaignJourneyEvent: journeyMocks.recordFairlendCampaignJourneyEvent,
}))

vi.mock('@/lib/fairlend-consultations/service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/fairlend-consultations/service')>()

  return {
    ...actual,
    bookConsultation: vi.fn(),
    getConsultationAvailability: vi.fn(),
  }
})

const mockedGetConsultationAvailability = vi.mocked(getConsultationAvailability)
const mockedBookConsultation = vi.mocked(bookConsultation)

describe('consultation API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    journeyMocks.recordFairlendCampaignJourneyEvent.mockResolvedValue(undefined)
  })

  it('returns computed availability', async () => {
    mockedGetConsultationAvailability.mockResolvedValueOnce({
      calendarConfigured: true,
      days: [
        {
          date: '2026-07-07',
          slots: [
            {
              available: true,
              date: '2026-07-07',
              end: '2026-07-07T13:30:00.000Z',
              start: '2026-07-07T13:00:00.000Z',
            },
          ],
        },
      ],
      timezone: 'America/Toronto',
    })

    const response = await GET(
      new NextRequest(
        'http://localhost/api/consultations/availability?from=2026-07-07&to=2026-07-07',
      ),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      calendarConfigured: true,
      timezone: 'America/Toronto',
    })
  })

  it('maps booking validation errors to their intended HTTP status', async () => {
    mockedBookConsultation.mockRejectedValueOnce(
      new ConsultationBookingError('Selected consultation time is unavailable', 409),
    )

    const response = await POST(
      new NextRequest('http://localhost/api/consultations/book', {
        body: JSON.stringify({}),
        method: 'POST',
      }),
    )

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toEqual({
      error: 'Selected consultation time is unavailable',
    })
  })

  it('returns confirmed booking ids', async () => {
    mockedBookConsultation.mockResolvedValueOnce({
      bookingId: 'booking-123',
      googleEventLink: 'https://calendar.google.com/event?eid=123',
    })

    const response = await POST(
      new NextRequest('http://localhost/api/consultations/book', {
        body: JSON.stringify({
          email: 'builder@example.com',
          name: 'Build Owner',
          slotStart: '2026-07-07T13:00:00.000Z',
        }),
        method: 'POST',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      bookingId: 'booking-123',
      googleEventLink: 'https://calendar.google.com/event?eid=123',
    })
  })

  it('carries signed QR attribution into consultation bookings and their outcome event', async () => {
    const attribution = {
      campaign: 'v1',
      capturedAt: '2026-07-14T12:00:00.000Z',
      destination: '/',
      scanId: 'd11da39e-21d6-49ef-9d09-9fe6e5e347fb',
      source: 'qr-v1',
    }
    mockedBookConsultation.mockResolvedValueOnce({
      bookingId: 'booking-qr-123',
      googleEventLink: 'https://calendar.google.com/event?eid=qr123',
    })

    const response = await POST(
      new NextRequest('http://localhost/api/consultations/book', {
        body: JSON.stringify({
          email: 'builder@example.com',
          name: 'Build Owner',
          slotStart: '2026-07-07T13:00:00.000Z',
          source: 'header-consultation',
        }),
        headers: {
          cookie: `${fairlendCampaignAttributionCookieName}=${serializeFairlendCampaignAttribution(attribution)}`,
          referer: 'http://localhost/borrowers/construction-financing',
        },
        method: 'POST',
      }),
    )

    expect(response.status).toBe(200)
    expect(mockedBookConsultation).toHaveBeenCalledWith({ attribution, input: expect.any(Object) })
    expect(journeyMocks.recordFairlendCampaignJourneyEvent).toHaveBeenCalledWith({
      attribution,
      event: expect.objectContaining({
        eventType: 'consultation_booked',
        formId: 'header-consultation',
        pagePath: '/borrowers/construction-financing',
      }),
    })
  })
})
