import type { DiscoveryPersona } from './config'
import { DiscoveryFaq } from './DiscoveryFaq.client'
import styles from './discovery-booking.module.css'

type DiscoveryFaqSectionProps = {
  bookingAnchor: string
  persona: DiscoveryPersona
}

export function DiscoveryFaqSection({ bookingAnchor, persona }: DiscoveryFaqSectionProps) {
  return (
    <section className={styles.faqSection} aria-labelledby="discovery-faq-title">
      <div className={styles.faqLead}>
        <p className={styles.sectionEyebrow}>Before we talk</p>
        <h2 id="discovery-faq-title">{persona.faqTitle}</h2>
      </div>
      <DiscoveryFaq
        bookingHref={bookingAnchor}
        ctaLabel={persona.faqCtaLabel}
        featuredId={persona.faqFeaturedId}
        intro={persona.faqIntro}
        items={persona.faqItems}
      />
    </section>
  )
}
