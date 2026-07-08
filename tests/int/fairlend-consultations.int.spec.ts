import { describe, expect, it } from 'vitest'

import {
  defaultConsultationSettings,
  getAvailabilityForRange,
  normalizeConsultationSettings,
  zonedDateTimeToUtc,
} from '@/lib/fairlend-consultations/availability'

describe('Fairlend consultation availability', () => {
  it('generates buffered 30 minute weekday slots from the managed schedule', () => {
    const availability = getAvailabilityForRange({
      busyIntervals: [],
      fromDate: '2026-07-07',
      now: new Date('2026-07-06T12:00:00.000Z'),
      settings: {
        ...defaultConsultationSettings,
        minimumNoticeHours: 0,
      },
      toDate: '2026-07-07',
    })

    expect(availability[0].slots).toHaveLength(11)
    expect(availability[0].slots[0]).toMatchObject({
      available: true,
      date: '2026-07-07',
      start: zonedDateTimeToUtc('2026-07-07', '09:00', 'America/Toronto').toISOString(),
    })
    expect(availability[0].slots[1].start).toBe(
      zonedDateTimeToUtc('2026-07-07', '09:45', 'America/Toronto').toISOString(),
    )
  })

  it('marks blackout intervals unavailable without removing the time from the display', () => {
    const availability = getAvailabilityForRange({
      busyIntervals: [],
      fromDate: '2026-07-07',
      now: new Date('2026-07-06T12:00:00.000Z'),
      settings: {
        ...defaultConsultationSettings,
        blackoutDates: [
          {
            allDay: false,
            date: '2026-07-07',
            endTime: '11:00',
            startTime: '10:30',
          },
        ],
        minimumNoticeHours: 0,
      },
      toDate: '2026-07-07',
    })

    const blackoutSlot = availability[0].slots.find(
      (slot) =>
        slot.start === zonedDateTimeToUtc('2026-07-07', '10:30', 'America/Toronto').toISOString(),
    )

    expect(blackoutSlot).toMatchObject({
      available: false,
      reason: 'Blackout',
    })
  })

  it('marks Google busy intervals unavailable', () => {
    const availability = getAvailabilityForRange({
      busyIntervals: [
        {
          end: zonedDateTimeToUtc('2026-07-07', '10:15', 'America/Toronto').toISOString(),
          source: 'google',
          start: zonedDateTimeToUtc('2026-07-07', '09:45', 'America/Toronto').toISOString(),
        },
      ],
      fromDate: '2026-07-07',
      now: new Date('2026-07-06T12:00:00.000Z'),
      settings: {
        ...defaultConsultationSettings,
        minimumNoticeHours: 0,
      },
      toDate: '2026-07-07',
    })

    expect(availability[0].slots[1]).toMatchObject({
      available: false,
      reason: 'Calendar busy',
    })
  })

  it('marks existing bookings unavailable to reject double-booking', () => {
    const bookedStart = zonedDateTimeToUtc('2026-07-07', '12:00', 'America/Toronto')
    const bookedEnd = zonedDateTimeToUtc('2026-07-07', '12:30', 'America/Toronto')
    const availability = getAvailabilityForRange({
      busyIntervals: [
        {
          end: bookedEnd.toISOString(),
          source: 'booking',
          start: bookedStart.toISOString(),
        },
      ],
      fromDate: '2026-07-07',
      now: new Date('2026-07-06T12:00:00.000Z'),
      settings: {
        ...defaultConsultationSettings,
        minimumNoticeHours: 0,
      },
      toDate: '2026-07-07',
    })

    const bookedSlot = availability[0].slots.find((slot) => slot.start === bookedStart.toISOString())

    expect(bookedSlot).toMatchObject({
      available: false,
      reason: 'Already booked',
    })
  })

  it('normalizes invalid managed JSON back to safe defaults', () => {
    const settings = normalizeConsultationSettings({
      blackoutDates: 'not-array',
      bookingWindowDays: -1,
      weeklyAvailability: [],
    })

    expect(settings).toMatchObject(defaultConsultationSettings)
  })
})
