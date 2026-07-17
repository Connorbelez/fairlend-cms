import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock3,
  LockKeyhole,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { MicrosoftBookingsEmbed } from '@/components/FairlendConsultationBooking/MicrosoftBookingsEmbed.client'

import { BookingAnchorLink } from './BookingAnchorLink.client'
import type { DiscoveryPersona } from './config'
import styles from './discovery-booking.module.css'

type DiscoveryBookingHeroProps = {
  bookingAnchor: string
  bookingsUrl: string
  persona: DiscoveryPersona
}

export function DiscoveryBookingHero({
  bookingAnchor,
  bookingsUrl,
  persona,
}: DiscoveryBookingHeroProps) {
  return (
    <section className={styles.bookingHero} aria-labelledby="discovery-booking-title">
      <div className={styles.heroGrid}>
        <div className={styles.heroIntro}>
          <p className={styles.audience}>{persona.audience}</p>
          <h1 className={styles.heroTitle} id="discovery-booking-title">
            {persona.title}
          </h1>
          <p className={styles.heroDescription}>{persona.description}</p>

          <div className={styles.proofNote}>
            <BadgeCheck aria-hidden="true" />
            <p>
              <strong>{persona.proof}</strong>
              <span>*Internal funded-file records; reviewed July 14, 2026.</span>
            </p>
          </div>

          <div className={styles.meetingMeta}>
            <span>
              <Clock3 aria-hidden="true" /> 30 minutes
            </span>
            <span>
              <UserRound aria-hidden="true" /> One-to-one
            </span>
          </div>
          <BookingAnchorLink className={styles.mobileAvailabilityCta} href={bookingAnchor}>
            See live availability <ArrowRight aria-hidden="true" />
          </BookingAnchorLink>
        </div>

        <div className={styles.heroDetails}>
          <div className={styles.heroArtwork}>
            <Image
              alt={persona.heroImage.alt}
              className={styles.heroArtworkImage}
              height={persona.heroImage.height}
              loading="lazy"
              sizes="(max-width: 899px) 100vw, 34vw"
              src={persona.heroImage.src}
              width={persona.heroImage.width}
            />
          </div>

          <div className={styles.prepareBlock}>
            <h2>Before our call, have what you know.</h2>
            <ul>
              {persona.preparation.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className={styles.privacyNote}>
            <LockKeyhole aria-hidden="true" />
            Rough details are enough. Do not upload sensitive documents through Microsoft Bookings;
            we’ll provide a secure next step if documents are needed.
          </p>
        </div>

        <div
          aria-labelledby="discovery-scheduler-title"
          className={styles.schedulerColumn}
          id={`${persona.bookingType}-discovery-scheduler`}
          role="region"
          tabIndex={-1}
        >
          <div className={styles.schedulerIntro}>
            <div>
              <p>Live availability</p>
              <h2 id="discovery-scheduler-title">Choose a time that works.</h2>
            </div>
            <div className={styles.schedulerAssurance}>
              <div className={styles.hostNote}>
                <BadgeCheck aria-hidden="true" />
                <span>
                  Hosted by <strong>Elie Soberano</strong>, Principal Broker
                </span>
              </div>
              <a
                className={styles.directBookingLink}
                data-analytics-cta-id="microsoft-bookings-external"
                data-analytics-cta-location="scheduler-intro"
                data-analytics-source={`${persona.bookingType}-discovery`}
                href={bookingsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open in a new tab <ArrowUpRight aria-hidden="true" />
                <span className={styles.srOnly}> in Microsoft Bookings</span>
              </a>
            </div>
          </div>
          <p className={styles.expectationStrip}>
            <strong>{persona.callOutcome}</strong> Microsoft provides the scheduler and processes
            the booking details you enter. The call is not an approval, financing commitment, or
            capital commitment.
          </p>
          <MicrosoftBookingsEmbed
            className={styles.schedulerEmbed}
            title={`FairLend ${persona.bookingType} discovery call scheduler`}
            url={bookingsUrl}
          />
          <p className={styles.schedulerFallback}>
            Prefer a separate window?{' '}
            <a href={bookingsUrl} rel="noreferrer" target="_blank">
              Open Microsoft Bookings <ArrowUpRight aria-hidden="true" />
              <span className={styles.srOnly}> in a new tab</span>
            </a>
            . No suitable time? <a href="mailto:elie@fairlend.ca">Email Elie</a> or{' '}
            <a href="tel:+16478317605">call 647-831-7605</a>.
          </p>
          <details className={styles.bookingDetails}>
            <summary>Booking, privacy &amp; licensing details</summary>
            <div className={styles.bookingAftercare}>
              <p>
                <strong>After you book:</strong> Microsoft sends the calendar invitation and the
                link to reschedule or cancel. If a next step requires documents, FairLend will send
                a separate secure path.
              </p>
              <p>
                Review FairLend’s <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>,{' '}
                <Link href="/disclosures">regulatory disclosures</Link>, or Microsoft’s{' '}
                <a
                  href="https://privacy.microsoft.com/en-ca/privacystatement"
                  rel="noreferrer"
                  target="_blank"
                >
                  Privacy Statement<span className={styles.srOnly}> (opens in a new tab)</span>
                </a>
                .
              </p>
              <p className={styles.registrationNote}>
                Fairlend Management Inc., operating as FairLend Mortgage · Ontario FSRA brokerage
                #13827 · administrator #13828
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}
