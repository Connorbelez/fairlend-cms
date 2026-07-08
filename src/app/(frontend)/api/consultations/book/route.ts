import { NextRequest } from 'next/server'

import { bookConsultation, ConsultationBookingError } from '@/lib/fairlend-consultations/service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<Response> {
  const payload = await request.json().catch(() => null)

  try {
    const booking = await bookConsultation({ input: payload })
    return Response.json(booking)
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    console.error('Failed to book consultation', error)
    return Response.json({ error: 'Failed to book consultation' }, { status: 500 })
  }
}
