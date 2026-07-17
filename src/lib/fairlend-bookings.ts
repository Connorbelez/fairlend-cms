export const defaultFairlendMicrosoftBookingsUrl =
  'https://outlook.office.com/book/FairLend1@fairlend.ca/?ismsaljsauthenabled'

export const fairlendBookingTypes = ['partners', 'lenders', 'borrowers', 'builders'] as const

export type FairlendBookingType = (typeof fairlendBookingTypes)[number]

export const defaultFairlendMicrosoftBookingsUrlsByType: Record<FairlendBookingType, string> = {
  partners:
    'https://outlook.office.com/book/FairLend1@fairlend.ca/s/bWqqdoHUfEKW2zUNB-i24A2?ismsaljsauthenabled',
  lenders:
    'https://outlook.office.com/book/FairLend1@fairlend.ca/s/CCZlHqWodEWB1M6K7mPCKQ2?ismsaljsauthenabled',
  borrowers:
    'https://outlook.office.com/book/FairLend1@fairlend.ca/s/8wIOUslWcEC-t5aOIrs0Qw2?ismsaljsauthenabled',
  builders:
    'https://outlook.office.com/book/FairLend1@fairlend.ca/s/ohxdHFxKu0Ca57NU3hynVQ2?ismsaljsauthenabled',
}

const fairlendMicrosoftBookingsEnvironmentKeysByType: Record<FairlendBookingType, string> = {
  partners: 'NEXT_PUBLIC_MICROSOFT_BOOKINGS_PARTNERS_URL',
  lenders: 'NEXT_PUBLIC_MICROSOFT_BOOKINGS_LENDERS_URL',
  borrowers: 'NEXT_PUBLIC_MICROSOFT_BOOKINGS_BORROWERS_URL',
  builders: 'NEXT_PUBLIC_MICROSOFT_BOOKINGS_BUILDERS_URL',
}

function getPersonaEnvironmentUrl(bookingType: FairlendBookingType): string | undefined {
  if (bookingType === 'partners') return process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_PARTNERS_URL
  if (bookingType === 'lenders') return process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_LENDERS_URL
  if (bookingType === 'borrowers') return process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_BORROWERS_URL
  return process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_BUILDERS_URL
}

function assertMicrosoftBookingsServiceUrl(value: string, label: string): string {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error(`${label} must be a valid URL.`)
  }

  const isMicrosoftBookingsService =
    url.protocol === 'https:' &&
    url.hostname === 'outlook.office.com' &&
    url.pathname.startsWith('/book/') &&
    url.pathname.includes('/s/')

  if (!isMicrosoftBookingsService || value.includes('replace-with-')) {
    throw new Error(`${label} must be a published Microsoft Bookings service URL.`)
  }

  return url.toString()
}

export function getFairlendMicrosoftBookingsUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_URL?.trim() || defaultFairlendMicrosoftBookingsUrl
  )
}

export function getFairlendMicrosoftBookingsUrlForType(bookingType: FairlendBookingType): string {
  const environmentUrl = getPersonaEnvironmentUrl(bookingType)?.trim()
  const url = environmentUrl || defaultFairlendMicrosoftBookingsUrlsByType[bookingType]
  const label = environmentUrl
    ? fairlendMicrosoftBookingsEnvironmentKeysByType[bookingType]
    : `Default ${bookingType} Microsoft Bookings URL`

  return assertMicrosoftBookingsServiceUrl(url, label)
}

export function isFairlendBookingType(value: string): value is FairlendBookingType {
  return fairlendBookingTypes.includes(value as FairlendBookingType)
}
