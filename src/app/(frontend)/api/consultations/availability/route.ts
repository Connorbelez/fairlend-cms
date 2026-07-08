import { NextRequest } from 'next/server'

import {
  ConsultationBookingError,
  getConsultationAvailability,
} from '@/lib/fairlend-consultations/service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams

  try {
    const availability = await getConsultationAvailability({
      from: searchParams.get('from') ?? '',
      to: searchParams.get('to') ?? '',
    })

    return Response.json(availability)
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    console.error('Failed to load consultation availability', error)
    return Response.json({ error: 'Failed to load availability' }, { status: 500 })
  }
}
