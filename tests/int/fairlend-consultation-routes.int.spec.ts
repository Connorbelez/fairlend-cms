import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  bookConsultation,
  ConsultationBookingError,
  getConsultationAvailability,
} from '@/lib/fairlend-consultations/service'
import { GET } from '@/app/(frontend)/api/consultations/availability/route'
import { POST } from '@/app/(frontend)/api/consultations/book/route'

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
})
