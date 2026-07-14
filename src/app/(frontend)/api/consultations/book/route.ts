import { NextRequest } from 'next/server'

import { bookConsultation, ConsultationBookingError } from '@/lib/fairlend-consultations/service'
import {
  getFairlendCampaignAttributionFromRequest,
  getFairlendRequestPagePath,
} from '@/lib/fairlend-campaign-attribution'
import { recordFairlendCampaignJourneyEvent } from '@/lib/fairlend-campaign-journey'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const payload = await request.json().catch(() => null)
  const attribution = getFairlendCampaignAttributionFromRequest(request)

  try {
    const booking = await bookConsultation({ attribution, input: payload })

    if (attribution) {
      await recordFairlendCampaignJourneyEvent({
        attribution,
        event: {
          eventId: `consultation:${booking.bookingId}:booked`,
          eventType: 'consultation_booked',
          formId: getBookingSource(payload),
          formName: 'Consultation scheduler',
          intakeType: 'consultation',
          leadId: booking.bookingId,
          pagePath: getFairlendRequestPagePath(request),
        },
      }).catch((error) => {
        console.error('Failed to record consultation campaign attribution', error)
      })
    }

    return Response.json(booking)
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    console.error('Failed to book consultation', error)
    return Response.json({ error: 'Failed to book consultation' }, { status: 500 })
  }
}

function getBookingSource(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const source = (payload as Record<string, unknown>).source
  return typeof source === 'string' ? source : null
}
