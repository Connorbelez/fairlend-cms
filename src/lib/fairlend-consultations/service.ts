import { randomUUID } from 'crypto'
import { getPayload, type CollectionSlug, type GlobalSlug, type Payload } from 'payload'
import { z } from 'zod'

import configPromise from '@payload-config'

import { upsertFairlendLead } from '@/lib/fairlend-leads'

import {
  addDaysToDateString,
  defaultConsultationSettings,
  formatDateInTimeZone,
  getAvailabilityForRange,
  normalizeConsultationSettings,
  type BusyInterval,
  type ConsultationAvailabilityDay,
  type ConsultationSettings,
  zonedDateTimeToUtc,
} from './availability'
import {
  createGoogleCalendarEvent,
  isGoogleCalendarConfigured,
  listGoogleBusyIntervals,
} from './google-calendar'

export const consultationBookingsCollection = 'fairlend-consultation-bookings'
export const consultationSettingsGlobal = 'fairlend-consultation-settings'

export type ConsultationAvailabilityResponse = {
  calendarConfigured: boolean
  days: ConsultationAvailabilityDay[]
  timezone: string
}

export const availabilityQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const bookingRequestSchema = z.object({
  email: z.string().email().max(320),
  leadId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(240),
  notes: z.string().trim().max(2000).optional(),
  phone: z.string().trim().max(80).optional(),
  source: z.string().trim().max(80).optional(),
  slotStart: z.string().datetime(),
})

export class ConsultationBookingError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message)
    this.name = 'ConsultationBookingError'
  }
}

type BookingDoc = {
  id: number | string
  scheduledEnd?: string
  scheduledStart?: string
  status?: string
}

export async function getConsultationAvailability({
  from,
  now = new Date(),
  payload,
  to,
}: {
  from: string
  now?: Date
  payload?: Payload
  to: string
}): Promise<ConsultationAvailabilityResponse> {
  const parsed = availabilityQuerySchema.safeParse({ from, to })

  if (!parsed.success || from > to) {
    throw new ConsultationBookingError('A valid availability date range is required')
  }

  const cms = payload ?? (await getCms())
  const settings = await getConsultationSettings(cms)
  const rangeStart = zonedDateStart(from, settings)
  const rangeEnd = zonedDateEnd(to, settings)
  const [googleBusy, bookingBusy] = await Promise.all([
    listGoogleBusyIntervals({ end: rangeEnd, start: rangeStart }),
    listActiveBookingIntervals({ end: rangeEnd, payload: cms, start: rangeStart }),
  ])

  return {
    calendarConfigured: isGoogleCalendarConfigured(),
    days: getAvailabilityForRange({
      busyIntervals: [...googleBusy, ...bookingBusy],
      fromDate: from,
      now,
      settings,
      toDate: to,
    }),
    timezone: settings.timezone,
  }
}

export async function bookConsultation({
  input,
  now = new Date(),
  payload,
}: {
  input: unknown
  now?: Date
  payload?: Payload
}): Promise<{ bookingId: string; googleEventLink: string | null }> {
  const parsed = bookingRequestSchema.safeParse(input)

  if (!parsed.success) {
    throw new ConsultationBookingError('Valid contact details and a selected slot are required')
  }

  const cms = payload ?? (await getCms())
  const settings = await getConsultationSettings(cms)
  const selectedStart = new Date(parsed.data.slotStart)

  if (!isGoogleCalendarConfigured()) {
    const fallbackBookingId = parsed.data.leadId ?? randomUUID()
    await mirrorConsultationBookingLead({
      bookingId: fallbackBookingId,
      email: parsed.data.email,
      leadId: parsed.data.leadId,
      name: parsed.data.name,
      notes: parsed.data.notes,
      phone: parsed.data.phone,
      scheduledEnd: new Date(
        selectedStart.getTime() + settings.slotDurationMinutes * 60_000,
      ).toISOString(),
      scheduledStart: selectedStart.toISOString(),
      source: parsed.data.source ?? 'leadership-cta',
      timezone: settings.timezone,
    })

    throw new ConsultationBookingError('Google Calendar sync is not configured', 503)
  }

  const date = formatDateInTimeZone(selectedStart, settings.timezone)
  const availability = await getConsultationAvailability({
    from: date,
    now,
    payload: cms,
    to: date,
  })
  const selectedSlot = availability.days
    .flatMap((day) => day.slots)
    .find((slot) => slot.start === selectedStart.toISOString())

  if (!selectedSlot?.available) {
    throw new ConsultationBookingError(
      selectedSlot?.reason ?? 'Selected consultation time is unavailable',
      409,
    )
  }

  const bookingId = randomUUID()
  const booking = await cms.create({
    collection: consultationBookingsCollection as CollectionSlug,
    data: {
      bookingId,
      email: parsed.data.email,
      name: parsed.data.name,
      notes: parsed.data.notes ?? null,
      phone: parsed.data.phone ?? null,
      scheduledEnd: selectedSlot.end,
      scheduledStart: selectedSlot.start,
      source: parsed.data.source ?? 'leadership-cta',
      status: 'syncing',
      timezone: settings.timezone,
    },
    overrideAccess: true,
  })

  await mirrorConsultationBookingLead({
    bookingId,
    email: parsed.data.email,
    leadId: parsed.data.leadId,
    name: parsed.data.name,
    notes: parsed.data.notes,
    phone: parsed.data.phone,
    scheduledEnd: selectedSlot.end,
    scheduledStart: selectedSlot.start,
    source: parsed.data.source ?? 'leadership-cta',
    timezone: settings.timezone,
  })

  try {
    const event = await createGoogleCalendarEvent({
      bookingId,
      description: 'Booked from the Fairlend website leadership CTA.',
      email: parsed.data.email,
      end: selectedSlot.end,
      name: parsed.data.name,
      notes: parsed.data.notes,
      phone: parsed.data.phone,
      start: selectedSlot.start,
      timezone: settings.timezone,
    })

    await cms.update({
      id: booking.id,
      collection: consultationBookingsCollection as CollectionSlug,
      data: {
        googleEventId: event.eventId,
        googleEventLink: event.htmlLink,
        status: 'confirmed',
        syncError: null,
      },
      overrideAccess: true,
    })

    await mirrorConsultationBookingLead({
      bookingId,
      email: parsed.data.email,
      googleEventLink: event.htmlLink,
      leadId: parsed.data.leadId,
      name: parsed.data.name,
      notes: parsed.data.notes,
      phone: parsed.data.phone,
      scheduledEnd: selectedSlot.end,
      scheduledStart: selectedSlot.start,
      source: parsed.data.source ?? 'leadership-cta',
      timezone: settings.timezone,
    })

    return { bookingId, googleEventLink: event.htmlLink }
  } catch (error) {
    await cms.update({
      id: booking.id,
      collection: consultationBookingsCollection as CollectionSlug,
      data: {
        status: 'sync_failed',
        syncError: error instanceof Error ? error.message : 'Unknown Google Calendar sync error',
      },
      overrideAccess: true,
    })

    throw new ConsultationBookingError('Failed to sync the booking with Google Calendar', 502)
  }
}

async function mirrorConsultationBookingLead({
  bookingId,
  email,
  googleEventLink,
  leadId,
  name,
  notes,
  phone,
  scheduledEnd,
  scheduledStart,
  source,
  timezone,
}: {
  bookingId: string
  email: string
  googleEventLink?: string | null
  leadId?: string
  name: string
  notes?: string
  phone?: string
  scheduledEnd: string
  scheduledStart: string
  source: string
  timezone: string
}): Promise<void> {
  try {
    await upsertFairlendLead({
      email,
      id: leadId ?? bookingId,
      intake: {
        bookingId,
        googleEventLink: googleEventLink ?? null,
        notes: notes ?? null,
        scheduledEnd,
        scheduledStart,
        timezone,
      },
      intent: 'consultation',
      name,
      nextActionAt: scheduledStart,
      phone,
      source,
      status: 'submitted',
      workflowStatus: 'consultation_booked',
    })
  } catch (error) {
    console.error('Failed to mirror consultation booking into Fairlend leads', error)
  }
}

export async function getConsultationSettings(payload: Payload): Promise<ConsultationSettings> {
  try {
    const settings = await payload.findGlobal({
      slug: consultationSettingsGlobal as GlobalSlug,
      overrideAccess: true,
    })

    return normalizeConsultationSettings(settings)
  } catch {
    return defaultConsultationSettings
  }
}

async function listActiveBookingIntervals({
  end,
  payload,
  start,
}: {
  end: Date
  payload: Payload
  start: Date
}): Promise<BusyInterval[]> {
  const bookings = await payload.find({
    collection: consultationBookingsCollection as CollectionSlug,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        {
          scheduledStart: {
            less_than: end.toISOString(),
          },
        },
        {
          scheduledEnd: {
            greater_than: start.toISOString(),
          },
        },
      ],
    },
  })

  return (bookings.docs as BookingDoc[])
    .filter((booking) => booking.status === 'syncing' || booking.status === 'confirmed')
    .flatMap((booking) => {
      if (!booking.scheduledStart || !booking.scheduledEnd) {
        return []
      }

      return [
        {
          end: booking.scheduledEnd,
          source: 'booking' as const,
          start: booking.scheduledStart,
        },
      ]
    })
}

async function getCms(): Promise<Payload> {
  const config = await configPromise
  return getPayload({ config })
}

function zonedDateStart(date: string, settings: ConsultationSettings): Date {
  return zonedDateTimeToUtc(date, '00:00', settings.timezone)
}

function zonedDateEnd(date: string, settings: ConsultationSettings): Date {
  const nextDate = addDaysToDateString(date, 1)
  return zonedDateTimeToUtc(nextDate, '00:00', settings.timezone)
}
