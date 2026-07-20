import { JsonLd } from '@/components/SEO/JsonLd'

import type { DiscoveryPersona } from './config'
import { DiscoveryBookingHero } from './DiscoveryBookingHero'
import { DiscoveryFaqSection } from './DiscoveryFaqSection'
import { DiscoveryOfferSection } from './DiscoveryOfferSection'
import styles from './discovery-booking.module.css'

type FairlendDiscoveryBookingProps = {
  bookingsUrl: string
  persona: DiscoveryPersona
}

export function FairlendDiscoveryBooking({ bookingsUrl, persona }: FairlendDiscoveryBookingProps) {
  const bookingAnchor = `#${persona.bookingType}-discovery-scheduler`
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: persona.faqItems.map((item) => ({
      '@type': 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
      name: item.question,
    })),
  }

  return (
    <main className={styles.page} data-booking-persona={persona.bookingType}>
      <JsonLd data={faqJsonLd} />
      <DiscoveryBookingHero
        bookingAnchor={bookingAnchor}
        bookingsUrl={bookingsUrl}
        persona={persona}
      />
      <DiscoveryOfferSection bookingAnchor={bookingAnchor} persona={persona} />
      <DiscoveryFaqSection bookingAnchor={bookingAnchor} persona={persona} />
    </main>
  )
}

export { discoveryPersonas } from './config'
