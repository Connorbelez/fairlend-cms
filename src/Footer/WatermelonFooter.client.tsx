'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { buildFairlendConsultationHref } from '@/lib/fairlend-intake'
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'
import { ArrowRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import styles from './WatermelonFooter.module.css'

const newsletterConsentText =
  'By submitting, you agree to receive FairLend market updates by email. You can unsubscribe at any time. See our Privacy Policy.'
const newsletterConsentVersion = 'footer-newsletter-casl-v1'
const consultationHref = buildFairlendConsultationHref('reference-footer-apply-now')

const footerColumns = [
  {
    title: 'Build',
    links: [
      { label: 'Construction Draw Financing', href: '/construction-draw-financing' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'Garden Suite Financing', href: '/garden-suite-financing-gta' },
      { label: 'Private Bridge Financing', href: '/borrowers/private-mortgage-financing' },
      { label: 'Institutional Mortgages', href: '/borrowers/institutional-mortgage' },
      { label: 'Project Advisory', href: '/partners' },
    ],
  },
  {
    title: 'Borrow',
    links: [
      { label: 'Borrower Overview', href: '/borrowers' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'How It Works', href: '/intake' },
      { label: 'Private Mortgage Guide', href: '/borrowers/private-mortgage-financing' },
      { label: 'Privacy Policy', href: '/en/brokerage/privacy-policy' },
      { label: 'Apply Now', href: consultationHref },
    ],
  },
  {
    title: 'Invest',
    links: [
      { label: 'Investor Overview', href: '/investing' },
      {
        label: 'Investment Approach',
        href: '/investing/private-mortgage-lending#investor-primer',
      },
      {
        label: 'Opportunities',
        href: '/investing/private-mortgage-lending#investor-opportunities',
      },
      {
        label: 'Underwriting Process',
        href: '/investing/private-mortgage-lending#investor-underwriting',
      },
      { label: 'Investor Resources', href: '/posts' },
      { label: 'Partner With Us', href: consultationHref },
    ],
  },
  {
    title: 'Insights',
    links: [
      { label: 'Market Commentary', href: '/posts' },
      { label: 'Toronto Field Guide', href: '/garden-suite-financing-gta' },
      { label: 'Multiplex Financing', href: '/multiplex-financing-gta' },
      { label: 'Construction Draw Financing', href: '/construction-draw-financing' },
      { label: 'Contact FairLend', href: '/contact' },
      { label: 'Regulatory Disclosures', href: '/disclosures' },
    ],
  },
] as const

export function WatermelonFooter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const pointerFrameRef = useRef<number | null>(null)
  const pointerPositionRef = useRef({ x: 0, y: 0 })
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const hasTrackedNewsletterStartRef = useRef(false)

  function trackNewsletterStart(): void {
    if (hasTrackedNewsletterStartRef.current) return
    hasTrackedNewsletterStartRef.current = true
    trackFairlendEvent('fairlend_intake_started', {
      form_id: 'fairlend_footer_newsletter',
      journey_type: 'newsletter',
      source: 'footer-newsletter',
    })
  }

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current)
    }
  }, [])

  function handleSkylinePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const skyline = event.currentTarget
    pointerPositionRef.current = { x: event.clientX, y: event.clientY }

    if (pointerFrameRef.current !== null) return

    pointerFrameRef.current = requestAnimationFrame(() => {
      const { x, y } = pointerPositionRef.current
      const skylineBounds = skyline.getBoundingClientRect()
      const wordmarkBounds = wordmarkRef.current?.getBoundingClientRect()

      skyline.style.setProperty('--spotlight-x', `${x - skylineBounds.left}px`)
      skyline.style.setProperty('--spotlight-y', `${y - skylineBounds.top}px`)
      skyline.dataset.pointerActive = 'true'

      if (wordmarkBounds) {
        wordmarkRef.current?.style.setProperty(
          '--wordmark-spotlight-x',
          `${x - wordmarkBounds.left}px`,
        )
        wordmarkRef.current?.style.setProperty(
          '--wordmark-spotlight-y',
          `${y - wordmarkBounds.top}px`,
        )
      }

      pointerFrameRef.current = null
    })
  }

  function handleSkylinePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current)
      pointerFrameRef.current = null
    }
    delete event.currentTarget.dataset.pointerActive
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setState('error')
      trackFairlendEvent('fairlend_intake_validation_failed', {
        form_id: 'fairlend_footer_newsletter',
        journey_type: 'newsletter',
        source: 'footer-newsletter',
        step_key: 'contact',
        step_number: 1,
        total_steps: 1,
      })
      return
    }

    setState('submitting')

    try {
      const submittedAt = new Date().toISOString()
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          analyticsContext: getAnalyticsContext(),
          email: normalizedEmail,
          intent: 'newsletter',
          intake: {
            consentSource: 'footer-newsletter',
            consentText: newsletterConsentText,
            consentVersion: newsletterConsentVersion,
            list: 'market-updates',
            submittedAt,
          },
          source: 'footer-newsletter',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) throw new Error(`Newsletter lead POST failed: ${response.status}`)

      const payload = (await response.json()) as LeadSubmissionResponse

      setEmail('')
      completeLeadAnalytics(payload, {
        completion_status: 'complete',
        form_id: 'fairlend_footer_newsletter',
        journey_type: 'newsletter',
        source: 'footer-newsletter',
      })
      setState('success')
    } catch (error) {
      console.error('Footer newsletter lead failed', error)
      trackLeadFailed({
        form_id: 'fairlend_footer_newsletter',
        journey_type: 'newsletter',
        source: 'footer-newsletter',
      })
      setState('error')
    }
  }

  return (
    <footer className={styles.footer}>
      <section
        aria-label="Toronto after dark"
        className={styles.skyline}
        onPointerLeave={handleSkylinePointerLeave}
        onPointerMove={handleSkylinePointerMove}
      >
        <Image
          alt=""
          aria-hidden="true"
          className={styles.skylineImage}
          fill
          loading="lazy"
          sizes="100vw"
          src="/assets/footer/fairlend-toronto-waterfront.webp"
        />
        <div aria-hidden="true" className={styles.wordmark} data-text="FAIRLEND" ref={wordmarkRef}>
          FAIRLEND
        </div>
        <div aria-hidden="true" className={styles.signalGlow} />
        <span className="sr-only">
          Toronto waterfront at night, rendered in monochrome halftone
        </span>
      </section>

      <div className={styles.content}>
        <div className={styles.primaryRow}>
          <section className={styles.brandPanel}>
            <p className={styles.statement}>
              FAST
              <br />
              FLEXIBLE
              <br />
              FAIR
              <br />
              FINANCING
            </p>
            <Link aria-label="FairLend home" className={styles.brandLockup} href="/">
              <span className={styles.brandMark}>F</span>
              <span className={styles.brandName}>FAIRLEND</span>
            </Link>
          </section>

          <nav aria-label="Footer navigation" className={styles.navigation}>
            {footerColumns.map((column) => (
              <section className={styles.navColumn} key={column.title}>
                <h2>{column.title}</h2>
                <span aria-hidden="true" className={styles.columnRule} />
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <section className={styles.contactPanel}>
            <h2>Speak with an expert</h2>
            <form
              className={styles.form}
              onFocusCapture={trackNewsletterStart}
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <Input
                autoComplete="email"
                className={styles.emailInput}
                id="footer-email"
                name="email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (state !== 'idle') setState('idle')
                }}
                placeholder="Email address"
                type="email"
                value={email}
              />
              <Button
                aria-label="Request expert contact"
                className={styles.submitButton}
                disabled={state === 'submitting'}
                type="submit"
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>
            <p aria-live="polite" className={styles.formStatus}>
              {state === 'success'
                ? 'Thank you. We’ll be in touch.'
                : state === 'error'
                  ? 'Enter a valid email address.'
                  : '\u00a0'}
            </p>
            <div className={styles.contactRule} />
            <div className={styles.contactDetails}>
              <span className={styles.phoneIcon}>
                <Phone aria-hidden="true" />
              </span>
              <p>
                <a href="tel:+16478317605">647-831-7605</a>
                <br />
                <a href="mailto:elie@fairlend.ca">elie@fairlend.ca</a>
              </p>
            </div>
          </section>
        </div>

        <div className={styles.legalRow}>
          <div className={styles.coordinates}>
            <span aria-hidden="true" className={styles.crosshair} />
            <span>TORONTO&nbsp;&nbsp;43.6532° N</span>
          </div>
          <span aria-hidden="true" className={styles.centerTick} />
          <div aria-label="FairLend licence information" className={styles.legalLinks}>
            <span className="sr-only">
              Fairlend Management Inc. operating as FairLend Mortgage.
            </span>
            <a
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13827~"
              rel="noreferrer"
              target="_blank"
            >
              FSRA brokerage licence #13827
            </a>
            <span aria-hidden="true" className={styles.verticalRule} />
            <a
              href="https://mbsweblist.fsco.gov.on.ca/ShowLicence.aspx?13828~"
              rel="noreferrer"
              target="_blank"
            >
              FSRA administrator licence #13828
            </a>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/en/brokerage/privacy-policy">Privacy</Link>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/terms">Terms</Link>
            <span aria-hidden="true" className={styles.verticalRule} />
            <Link href="/contact">Contact</Link>
            <span aria-hidden="true" className={styles.crosshair} />
          </div>
        </div>
      </div>
    </footer>
  )
}
