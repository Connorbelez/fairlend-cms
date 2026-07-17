import { ArrowRight, Check } from 'lucide-react'

import { BookingAnchorLink } from './BookingAnchorLink.client'
import type { DiscoveryPersona } from './config'
import styles from './discovery-booking.module.css'

type DiscoveryOfferSectionProps = {
  bookingAnchor: string
  persona: DiscoveryPersona
}

export function DiscoveryOfferSection({ bookingAnchor, persona }: DiscoveryOfferSectionProps) {
  return (
    <section className={styles.offerSection} aria-labelledby="discovery-offer-title">
      <div className={styles.offerLead}>
        <p className={styles.sectionEyebrow}>{persona.offerEyebrow}</p>
        <h2 id="discovery-offer-title">{persona.offerTitle}</h2>
        <p>{persona.offerIntro}</p>
      </div>

      <div className={styles.pathLedger}>
        <div className={styles.ledgerHeader}>
          {persona.ledgerHeadings.map((heading) => (
            <span key={heading}>{heading}</span>
          ))}
        </div>
        {persona.painPaths.map((path, index) => (
          <div className={styles.pathRow} key={path.title}>
            <div>
              <span className={styles.pathIndex}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{path.title}</h3>
              <p>{path.concern}</p>
            </div>
            <ArrowRight aria-hidden="true" className={styles.pathArrow} />
            <span className={styles.mobilePathLabel}>{persona.ledgerHeadings[1]}</span>
            <p>{path.response}</p>
            <span className={styles.outcomeCheck}>
              <Check aria-hidden="true" />
            </span>
            <span className={styles.mobilePathLabel}>{persona.ledgerHeadings[2]}</span>
            <p>{path.outcome}</p>
          </div>
        ))}
      </div>

      <div className={styles.meetingSequence}>
        <h3>{persona.meetingTitle}</h3>
        <ol>
          {persona.meetingSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
        <BookingAnchorLink href={bookingAnchor}>
          Book your discovery call <ArrowRight aria-hidden="true" />
        </BookingAnchorLink>
      </div>
    </section>
  )
}
