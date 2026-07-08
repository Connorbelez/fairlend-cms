import { z } from 'zod'

export const consultationTimeZone = 'America/Toronto'

export const weekdayKeys = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

export type WeekdayKey = (typeof weekdayKeys)[number]

export type BusyInterval = {
  end: string
  source?: 'booking' | 'google'
  start: string
}

export type ConsultationSlot = {
  available: boolean
  date: string
  end: string
  reason?: string
  start: string
}

export type ConsultationAvailabilityDay = {
  date: string
  slots: ConsultationSlot[]
}

export type ConsultationSettings = {
  blackoutDates: ConsultationBlackout[]
  bookingWindowDays: number
  bufferMinutes: number
  extraAvailability: ConsultationAvailabilityWindow[]
  minimumNoticeHours: number
  slotDurationMinutes: number
  timezone: string
  weeklyAvailability: ConsultationWeeklyAvailability[]
}

export type ConsultationWeeklyAvailability = {
  enabled: boolean
  endTime: string
  startTime: string
  weekday: WeekdayKey
}

export type ConsultationAvailabilityWindow = {
  date: string
  enabled: boolean
  endTime: string
  label?: string
  startTime: string
}

export type ConsultationBlackout = {
  allDay: boolean
  date: string
  endTime?: string
  label?: string
  startTime?: string
}

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const weeklyAvailabilitySchema = z.object({
  enabled: z.boolean().default(true),
  endTime: timeSchema,
  startTime: timeSchema,
  weekday: z.enum(weekdayKeys),
})

const availabilityWindowSchema = z.object({
  date: dateSchema,
  enabled: z.boolean().default(true),
  endTime: timeSchema,
  label: z.string().optional(),
  startTime: timeSchema,
})

const blackoutSchema = z.object({
  allDay: z.boolean().default(true),
  date: dateSchema,
  endTime: timeSchema.optional(),
  label: z.string().optional(),
  startTime: timeSchema.optional(),
})

const settingsSchema = z.object({
  blackoutDates: z.array(blackoutSchema).default([]),
  bookingWindowDays: z.coerce.number().int().min(1).max(180).default(30),
  bufferMinutes: z.coerce.number().int().min(0).max(240).default(15),
  extraAvailability: z.array(availabilityWindowSchema).default([]),
  minimumNoticeHours: z.coerce.number().int().min(0).max(720).default(24),
  slotDurationMinutes: z.coerce.number().int().min(15).max(240).default(30),
  timezone: z.string().min(1).default(consultationTimeZone),
  weeklyAvailability: z.array(weeklyAvailabilitySchema).default([]),
})

export const defaultWeeklyAvailability: ConsultationWeeklyAvailability[] = [
  { enabled: false, endTime: '17:00', startTime: '09:00', weekday: 'sunday' },
  { enabled: true, endTime: '17:00', startTime: '09:00', weekday: 'monday' },
  { enabled: true, endTime: '17:00', startTime: '09:00', weekday: 'tuesday' },
  { enabled: true, endTime: '17:00', startTime: '09:00', weekday: 'wednesday' },
  { enabled: true, endTime: '17:00', startTime: '09:00', weekday: 'thursday' },
  { enabled: true, endTime: '17:00', startTime: '09:00', weekday: 'friday' },
  { enabled: false, endTime: '17:00', startTime: '09:00', weekday: 'saturday' },
]

export const defaultConsultationSettings: ConsultationSettings = {
  blackoutDates: [],
  bookingWindowDays: 30,
  bufferMinutes: 15,
  extraAvailability: [],
  minimumNoticeHours: 24,
  slotDurationMinutes: 30,
  timezone: consultationTimeZone,
  weeklyAvailability: defaultWeeklyAvailability,
}

export function normalizeConsultationSettings(input: unknown): ConsultationSettings {
  const parsed = settingsSchema.safeParse({
    ...defaultConsultationSettings,
    ...(isRecord(input) ? input : {}),
  })

  if (!parsed.success) {
    return defaultConsultationSettings
  }

  return {
    ...parsed.data,
    weeklyAvailability:
      parsed.data.weeklyAvailability.length > 0
        ? parsed.data.weeklyAvailability
        : defaultWeeklyAvailability,
  }
}

export function getAvailabilityForRange({
  busyIntervals,
  fromDate,
  now = new Date(),
  settings,
  toDate,
}: {
  busyIntervals: BusyInterval[]
  fromDate: string
  now?: Date
  settings: ConsultationSettings
  toDate: string
}): ConsultationAvailabilityDay[] {
  const range = enumerateDateRange(fromDate, toDate)
  const latestStart = addHours(now, settings.minimumNoticeHours)
  const latestBookableDate = addDaysToDateString(formatDateInTimeZone(now, settings.timezone), settings.bookingWindowDays)

  return range.map((date) => ({
    date,
    slots: getSlotsForDate({
      busyIntervals,
      date,
      latestBookableDate,
      latestStart,
      now,
      settings,
    }),
  }))
}

export function getSlotsForDate({
  busyIntervals,
  date,
  latestBookableDate,
  latestStart,
  settings,
}: {
  busyIntervals: BusyInterval[]
  date: string
  latestBookableDate: string
  latestStart: Date
  now: Date
  settings: ConsultationSettings
}): ConsultationSlot[] {
  const windows = getWindowsForDate(date, settings)
  const blackoutIntervals = getBlackoutIntervalsForDate(date, settings)

  return windows.flatMap((window) => {
    const slots: ConsultationSlot[] = []
    const slotDurationMs = settings.slotDurationMinutes * 60_000
    const stepMs = (settings.slotDurationMinutes + settings.bufferMinutes) * 60_000
    let cursor = zonedDateTimeToUtc(date, window.startTime, settings.timezone)
    const windowEnd = zonedDateTimeToUtc(date, window.endTime, settings.timezone)

    while (cursor.getTime() + slotDurationMs <= windowEnd.getTime()) {
      const start = new Date(cursor)
      const end = new Date(cursor.getTime() + slotDurationMs)
      const reason = getUnavailableReason({
        blackoutIntervals,
        busyIntervals,
        date,
        end,
        latestBookableDate,
        latestStart,
        start,
      })

      slots.push({
        available: !reason,
        date,
        end: end.toISOString(),
        reason,
        start: start.toISOString(),
      })

      cursor = new Date(cursor.getTime() + stepMs)
    }

    return slots
  })
}

export function formatDateInTimeZone(date: Date, timeZone: string): string {
  const parts = getZonedParts(date, timeZone)
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

export function addDaysToDateString(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number)
  const utc = Date.UTC(year, month - 1, day + days)
  return new Date(utc).toISOString().slice(0, 10)
}

export function enumerateDateRange(fromDate: string, toDate: string): string[] {
  if (!dateSchema.safeParse(fromDate).success || !dateSchema.safeParse(toDate).success) {
    return []
  }

  const dates: string[] = []
  let cursor = fromDate

  while (cursor <= toDate && dates.length < 62) {
    dates.push(cursor)
    cursor = addDaysToDateString(cursor, 1)
  }

  return dates
}

export function zonedDateTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const targetLocalMs = Date.UTC(year, month - 1, day, hour, minute)
  let utcMs = targetLocalMs

  for (let index = 0; index < 3; index += 1) {
    const parts = getZonedParts(new Date(utcMs), timeZone)
    const actualLocalMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute)
    utcMs += targetLocalMs - actualLocalMs
  }

  return new Date(utcMs)
}

function getWindowsForDate(
  date: string,
  settings: ConsultationSettings,
): Array<{ endTime: string; startTime: string }> {
  const weekday = getWeekdayForDate(date, settings.timezone)
  const weekly = settings.weeklyAvailability
    .filter((window) => window.enabled && window.weekday === weekday)
    .map(({ endTime, startTime }) => ({ endTime, startTime }))
  const extras = settings.extraAvailability
    .filter((window) => window.enabled && window.date === date)
    .map(({ endTime, startTime }) => ({ endTime, startTime }))

  return [...weekly, ...extras].filter((window) => window.startTime < window.endTime)
}

function getBlackoutIntervalsForDate(
  date: string,
  settings: ConsultationSettings,
): Array<{ end: Date; start: Date }> {
  return settings.blackoutDates
    .filter((blackout) => blackout.date === date)
    .map((blackout) => {
      const startTime = blackout.allDay ? '00:00' : (blackout.startTime ?? '00:00')
      const endTime = blackout.allDay ? '23:59' : (blackout.endTime ?? '23:59')

      return {
        end: zonedDateTimeToUtc(date, endTime, settings.timezone),
        start: zonedDateTimeToUtc(date, startTime, settings.timezone),
      }
    })
}

function getUnavailableReason({
  blackoutIntervals,
  busyIntervals,
  date,
  end,
  latestBookableDate,
  latestStart,
  start,
}: {
  blackoutIntervals: Array<{ end: Date; start: Date }>
  busyIntervals: BusyInterval[]
  date: string
  end: Date
  latestBookableDate: string
  latestStart: Date
  start: Date
}): string | undefined {
  if (date > latestBookableDate) {
    return 'Outside booking window'
  }

  if (start < latestStart) {
    return 'Minimum notice'
  }

  if (blackoutIntervals.some((interval) => intervalsOverlap(start, end, interval.start, interval.end))) {
    return 'Blackout'
  }

  const busy = busyIntervals.find((interval) =>
    intervalsOverlap(start, end, new Date(interval.start), new Date(interval.end)),
  )

  if (busy?.source === 'booking') {
    return 'Already booked'
  }

  if (busy) {
    return 'Calendar busy'
  }

  return undefined
}

function getWeekdayForDate(date: string, timeZone: string): WeekdayKey {
  const midday = zonedDateTimeToUtc(date, '12:00', timeZone)
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' })
    .format(midday)
    .toLowerCase()

  return weekdayKeys.includes(weekday as WeekdayKey) ? (weekday as WeekdayKey) : 'monday'
}

function getZonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  })
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  )

  return {
    day: Number(parts.day),
    hour: Number(parts.hour === '24' ? '0' : parts.hour),
    minute: Number(parts.minute),
    month: Number(parts.month),
    year: Number(parts.year),
  }
}

function intervalsOverlap(start: Date, end: Date, busyStart: Date, busyEnd: Date): boolean {
  return start < busyEnd && end > busyStart
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
