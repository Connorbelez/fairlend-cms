'use client'

import { useRef, useState, type FormEvent, type ReactElement } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'
import { cn } from '@/utilities/ui'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type SituationOption = {
  value: string
  label: string
}

const situationOptions: readonly SituationOption[] = [
  { label: 'Renewal problem', value: 'renewal' },
  { label: 'Closing deadline', value: 'closing' },
  { label: 'Debt consolidation', value: 'debt-consolidation' },
  { label: 'Equity access', value: 'equity-access' },
  { label: 'Bridge financing', value: 'bridge' },
  { label: 'Second mortgage', value: 'second-mortgage' },
  { label: 'Bank decline', value: 'bank-decline' },
  { label: 'Other', value: 'other' },
]

type FormErrors = Partial<Record<keyof ConsultationFormValues, string>>

export type ConsultationFormValues = {
  name: string
  phone: string
  email: string
  propertyCity: string
  estimatedValue: string
  mortgageBalance: string
  amountNeeded: string
  timeline: string
  situationType: string
  notes: string
}

const EMPTY_VALUES: ConsultationFormValues = {
  amountNeeded: '',
  email: '',
  estimatedValue: '',
  mortgageBalance: '',
  name: '',
  notes: '',
  phone: '',
  propertyCity: '',
  situationType: '',
  timeline: '',
}

const SUCCESS_COPY =
  'A FairLend mortgage specialist will review your property, balance, timeline, and exit route before responding with the practical path.'
const ERROR_COPY =
  'The request did not send. Check your connection and try again, or call FairLend directly.'
const REVIEW_PROMISE =
  'Share what is happening and the core numbers. FairLend uses them only to review your request.'

function validate(values: ConsultationFormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.phone.trim()) {
    errors.phone = 'Please enter a phone number.'
  } else if (values.phone.replace(/[^0-9]/g, '').length < 10) {
    errors.phone = 'Please enter a valid phone number.'
  }
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.propertyCity.trim()) errors.propertyCity = 'Please enter a city or address.'
  if (!values.situationType) errors.situationType = 'Please choose a situation.'
  return errors
}

/**
 * Borrower consultation form.
 *
 * Posts to the existing `/api/leads` route handler, which upserts into the
 * `fairlend-leads` Payload collection via `upsertFairlendLead`. The form
 * attaches `source: 'borrowers-page'` and carries all consultation-specific
 * fields inside `intake`, so it slots into the existing lead model without a
 * backend change.
 *
 * States: default → submitting → success | error, with per-field validation.
 */
export function ConsultationForm(): ReactElement {
  const [values, setValues] = useState<ConsultationFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const hasTrackedStartRef = useRef(false)

  function trackStart(): void {
    if (hasTrackedStartRef.current) return
    hasTrackedStartRef.current = true
    trackFairlendEvent('fairlend_intake_started', {
      form_id: 'fairlend_borrower_consultation',
      journey_type: 'consultation',
      source: 'borrowers-page',
    })
  }

  function updateField<K extends keyof ConsultationFormValues>(
    field: K,
    value: ConsultationFormValues[K],
  ): void {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      trackFairlendEvent('fairlend_intake_validation_failed', {
        form_id: 'fairlend_borrower_consultation',
        journey_type: 'consultation',
        source: 'borrowers-page',
        step_key: 'contact',
        step_number: 1,
        total_steps: 1,
      })
      return
    }

    setSubmitState('submitting')
    setErrors({})

    const leadId =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
      `borrower-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          analyticsContext: getAnalyticsContext(),
          address: values.propertyCity,
          email: values.email,
          id: leadId,
          // Situation type doubles as the lead intent for admin filtering.
          intent: values.situationType,
          intake: {
            amountNeeded: values.amountNeeded,
            estimatedValue: values.estimatedValue,
            mortgageBalance: values.mortgageBalance,
            notes: values.notes,
            page: '/borrowers/private-mortgage-financing',
            situationType: values.situationType,
            timeline: values.timeline,
          },
          name: values.name,
          phone: values.phone,
          source: 'borrowers-page',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Lead POST failed: ${response.status}`)
      }

      const payload = (await response.json()) as LeadSubmissionResponse

      setSubmitState('success')
      completeLeadAnalytics(payload, {
        completion_status: 'complete',
        form_id: 'fairlend_borrower_consultation',
        journey_type: 'consultation',
        source: 'borrowers-page',
      })
      setValues(EMPTY_VALUES)
    } catch (error) {
      console.error('Borrower consultation form submission failed', error)
      trackLeadFailed({
        form_id: 'fairlend_borrower_consultation',
        journey_type: 'consultation',
        source: 'borrowers-page',
      })
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div
        className="consultation-form consultation-form--success"
        data-consultation-success
        role="status"
      >
        <CheckCircle2 aria-hidden="true" className="consultation-form__success-icon" />
        <p className="consultation-form__success-kicker">Review request received</p>
        <h3 className="consultation-form__success-title">A specialist will review your options.</h3>
        <p className="consultation-form__success-copy">{SUCCESS_COPY}</p>
        <p className="consultation-form__success-note">No obligation to proceed.</p>
        <Button
          onClick={() => setSubmitState('idle')}
          className="mt-4"
          size="clear"
          variant="outline"
          type="button"
        >
          Submit another request
        </Button>
      </div>
    )
  }

  return (
    <form
      aria-describedby={
        submitState === 'error'
          ? 'consultation-form-review-promise consultation-form-status'
          : 'consultation-form-review-promise'
      }
      className="consultation-form"
      data-consultation-form
      onFocusCapture={trackStart}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="consultation-form__heading">
        <p className="consultation-form__eyebrow">Free private mortgage review</p>
        <h3 className="consultation-form__title">Tell us what you need to solve.</h3>
        <p className="consultation-form__promise" id="consultation-form-review-promise">
          {REVIEW_PROMISE}
        </p>
      </div>

      {submitState === 'error' && (
        <p className="consultation-form__alert" role="alert" id="consultation-form-status">
          <strong>Submission failed.</strong>
          <span>{ERROR_COPY}</span>
        </p>
      )}

      <div className="consultation-form__grid">
        <Field label="Full name" htmlFor="borrower-name" error={errors.name} required>
          <Input
            autoComplete="name"
            id="borrower-name"
            onChange={(e) => updateField('name', e.target.value)}
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'borrower-name-error' : undefined}
          />
        </Field>

        <Field label="Phone number" htmlFor="borrower-phone" error={errors.phone} required>
          <Input
            autoComplete="tel"
            id="borrower-phone"
            inputMode="tel"
            onChange={(e) => updateField('phone', e.target.value)}
            value={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'borrower-phone-error' : undefined}
          />
        </Field>

        <Field label="Email address" htmlFor="borrower-email" error={errors.email} required>
          <Input
            autoComplete="email"
            id="borrower-email"
            inputMode="email"
            onChange={(e) => updateField('email', e.target.value)}
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'borrower-email-error' : undefined}
          />
        </Field>

        <Field
          label="Property city or address"
          htmlFor="borrower-city"
          error={errors.propertyCity}
          required
        >
          <Input
            autoComplete="address-level2"
            id="borrower-city"
            onChange={(e) => updateField('propertyCity', e.target.value)}
            value={values.propertyCity}
            placeholder="Toronto or property address"
            aria-invalid={Boolean(errors.propertyCity)}
            aria-describedby={errors.propertyCity ? 'borrower-city-error' : undefined}
          />
        </Field>

        <Field label="Estimated property value" htmlFor="borrower-value">
          <Input
            id="borrower-value"
            inputMode="numeric"
            onChange={(e) => updateField('estimatedValue', e.target.value)}
            value={values.estimatedValue}
            placeholder="$750,000"
          />
        </Field>

        <Field label="Current mortgage balance" htmlFor="borrower-balance">
          <Input
            id="borrower-balance"
            inputMode="numeric"
            onChange={(e) => updateField('mortgageBalance', e.target.value)}
            value={values.mortgageBalance}
            placeholder="$420,000"
          />
        </Field>

        <Field label="Amount needed" htmlFor="borrower-amount">
          <Input
            id="borrower-amount"
            inputMode="numeric"
            onChange={(e) => updateField('amountNeeded', e.target.value)}
            value={values.amountNeeded}
            placeholder="$100,000"
          />
        </Field>

        <Field label="Timeline" htmlFor="borrower-timeline">
          <Input
            id="borrower-timeline"
            onChange={(e) => updateField('timeline', e.target.value)}
            value={values.timeline}
            placeholder="Within 2 weeks or by date"
          />
        </Field>

        <Field
          label="Situation"
          htmlFor="borrower-situation"
          error={errors.situationType}
          required
          className="consultation-form__field--full"
        >
          <Select
            value={values.situationType}
            onValueChange={(value) => updateField('situationType', value)}
          >
            <SelectTrigger
              id="borrower-situation"
              aria-invalid={Boolean(errors.situationType)}
              aria-describedby={errors.situationType ? 'borrower-situation-error' : undefined}
              className="h-12"
            >
              <SelectValue placeholder="Choose the closest fit" />
            </SelectTrigger>
            <SelectContent>
              {situationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Additional context"
          htmlFor="borrower-notes"
          className="consultation-form__field--full"
        >
          <Textarea
            id="borrower-notes"
            onChange={(e) => updateField('notes', e.target.value)}
            value={values.notes}
            placeholder="Deadline, lender issue, credit concern, or exit plan."
            rows={3}
          />
        </Field>
      </div>

      <div className="consultation-form__actions">
        <Button
          className="consultation-form__submit"
          disabled={submitState === 'submitting'}
          size="clear"
          type="submit"
        >
          {submitState === 'submitting' ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              <span>Sending…</span>
            </>
          ) : (
            <span>Request a free consultation</span>
          )}
        </Button>
        <p className="consultation-form__microcopy">
          FairLend uses this information to review your request, respond, and identify relevant next
          steps. Submission is not an approval or commitment to finance. See our{' '}
          <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  )
}

function Field({
  children,
  className,
  error,
  htmlFor,
  label,
  required,
}: {
  children: ReactElement
  className?: string
  error?: string
  htmlFor: string
  label: string
  required?: boolean
}): ReactElement {
  return (
    <div className={cn('consultation-form__field', className)}>
      <Label htmlFor={htmlFor} className="consultation-form__label">
        {label}
        {required && (
          <span aria-hidden="true" className="consultation-form__required">
            {' '}
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <span className="consultation-form__error" id={`${htmlFor}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
