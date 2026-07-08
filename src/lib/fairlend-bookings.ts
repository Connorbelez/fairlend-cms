export const defaultFairlendMicrosoftBookingsUrl =
  'https://outlook.office.com/book/FairLend1@fairlend.ca/?ismsaljsauthenabled'

export function getFairlendMicrosoftBookingsUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MICROSOFT_BOOKINGS_URL?.trim() || defaultFairlendMicrosoftBookingsUrl
  )
}
