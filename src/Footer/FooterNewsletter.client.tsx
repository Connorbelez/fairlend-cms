'use client'

import { ArrowRight } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'

import styles from './WatermelonFooter.module.css'

const newsletterConsentText =
  'By submitting, you agree to receive FairLend market updates by email. You can unsubscribe at any time. See our Privacy Policy.'
const newsletterConsentVersion = 'footer-newsletter-casl-v1'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const hasTrackedStartRef = useRef(false)

  function trackStart(): void {
    if (hasTrackedStartRef.current) return
    hasTrackedStartRef.current = true
    trackFairlendEvent('fairlend_intake_started', {
      form_id: 'fairlend_footer_newsletter',
      journey_type: 'newsletter',
      source: 'footer-newsletter',
    })
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
    <>
      <form className={styles.form} onFocusCapture={trackStart} onSubmit={handleSubmit}>
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
    </>
  )
}
