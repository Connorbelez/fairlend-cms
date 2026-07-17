import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { discoveryPersonas, FairlendDiscoveryBooking } from '@/components/FairlendDiscoveryBooking'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import {
  fairlendBookingTypes,
  getFairlendMicrosoftBookingsUrlForType,
  isFairlendBookingType,
} from '@/lib/fairlend-bookings'
import { buildFairlendMetadata } from '@/utilities/seo'

export const dynamic = 'force-static'
export const dynamicParams = false

type Props = {
  params: Promise<{ bookingtype: string }>
}

export function generateStaticParams() {
  return fairlendBookingTypes.map((bookingtype) => ({ bookingtype }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookingtype } = await params

  if (!isFairlendBookingType(bookingtype)) return {}

  const persona = discoveryPersonas[bookingtype]

  return buildFairlendMetadata({
    description: persona.seoDescription,
    image: persona.heroImage.src,
    path: `/booking/${bookingtype}`,
    title: persona.seoTitle,
  })
}

export default async function BookingPage({ params }: Props) {
  const { bookingtype } = await params

  if (!isFairlendBookingType(bookingtype)) notFound()

  const persona = discoveryPersonas[bookingtype]
  const path = `/booking/${bookingtype}`

  return (
    <>
      <FairlendServiceSeo
        description={persona.seoDescription}
        name={persona.seoTitle}
        path={path}
        serviceType={`${persona.seoTitle} appointment`}
      />
      <FairlendDiscoveryBooking
        bookingsUrl={getFairlendMicrosoftBookingsUrlForType(bookingtype)}
        persona={persona}
      />
    </>
  )
}
