import { google, type calendar_v3 } from 'googleapis'

import type { BusyInterval } from './availability'

export type GoogleCalendarEventInput = {
  bookingId: string
  description: string
  email: string
  end: string
  name: string
  notes?: string | null
  phone?: string | null
  start: string
  timezone: string
}

export type GoogleCalendarEventResult = {
  eventId: string
  htmlLink: string | null
}

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID &&
      process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
  )
}

export async function listGoogleBusyIntervals({
  end,
  start,
}: {
  end: Date
  start: Date
}): Promise<BusyInterval[]> {
  if (!isGoogleCalendarConfigured()) {
    return []
  }

  const calendar = getCalendarClient()
  const response = await calendar.freebusy.query({
    requestBody: {
      items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      timeMax: end.toISOString(),
      timeMin: start.toISOString(),
    },
  })

  const busy = response.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || '']?.busy ?? []

  return busy.flatMap((interval) => {
    if (!interval.start || !interval.end) {
      return []
    }

    return [{ end: interval.end, source: 'google' as const, start: interval.start }]
  })
}

export async function createGoogleCalendarEvent({
  bookingId,
  description,
  email,
  end,
  name,
  notes,
  phone,
  start,
  timezone,
}: GoogleCalendarEventInput): Promise<GoogleCalendarEventResult> {
  if (!isGoogleCalendarConfigured()) {
    throw new Error('Google Calendar is not configured')
  }

  const calendar = getCalendarClient()
  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      attendees: [{ email, displayName: name }],
      description: [
        description,
        phone ? `Phone: ${phone}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
      end: { dateTime: end, timeZone: timezone },
      extendedProperties: {
        private: {
          bookingId,
          source: 'fairlend-website',
        },
      },
      start: { dateTime: start, timeZone: timezone },
      summary: `Fairlend consultation - ${name}`,
    },
  })

  if (!response.data.id) {
    throw new Error('Google Calendar did not return an event id')
  }

  return {
    eventId: response.data.id,
    htmlLink: response.data.htmlLink ?? null,
  }
}

function getCalendarClient(): calendar_v3.Calendar {
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return google.calendar({ auth, version: 'v3' })
}
