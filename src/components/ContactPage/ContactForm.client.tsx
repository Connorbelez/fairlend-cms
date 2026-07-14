'use client'

import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackLeadFailed, trackLeadSubmitted } from '@/lib/analytics/events'

type ContactFormState = 'idle' | 'submitting' | 'success' | 'error'

const fieldClassName =
  'contact-form__control h-12 rounded-none border-0 border-b border-white/30 bg-transparent px-0 text-base text-white shadow-none placeholder:text-white/70 focus-visible:border-[#96ec18] focus-visible:ring-0 focus-visible:outline-none'

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>('idle')
  const [error, setError] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      setState('error')
      emailRef.current?.focus()
      return
    }

    if (!message) {
      setError('Tell us what you need help financing.')
      setState('error')
      messageRef.current?.focus()
      return
    }

    setState('submitting')
    setError('')

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          email,
          intake: {
            firstName,
            lastName,
            message,
            submittedAt: new Date().toISOString(),
          },
          intent: 'contact',
          name: [firstName, lastName].filter(Boolean).join(' '),
          phone,
          source: 'contact-page',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Contact lead POST failed: ${response.status}`)
      }

      form.reset()
      trackLeadSubmitted({ intent: 'contact', source: 'contact-page', step: 'contact_submit' })
      setState('success')
    } catch {
      trackLeadFailed({ intent: 'contact', source: 'contact-page', step: 'contact_submit' })
      setError('We could not send the message. Try again or call FairLend directly.')
      setState('error')
    }
  }

  const emailHasError = state === 'error' && error.includes('email')
  const messageHasError = state === 'error' && error.includes('financing')

  return (
    <form
      aria-busy={state === 'submitting'}
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field>
            <FieldLabel className="contact-form__label" htmlFor="contact-first-name">
              First name
            </FieldLabel>
            <Input
              autoComplete="given-name"
              className={fieldClassName}
              id="contact-first-name"
              name="firstName"
              placeholder="Elie"
            />
          </Field>
          <Field>
            <FieldLabel className="contact-form__label" htmlFor="contact-last-name">
              Last name
            </FieldLabel>
            <Input
              autoComplete="family-name"
              className={fieldClassName}
              id="contact-last-name"
              name="lastName"
              placeholder="Soberano"
            />
          </Field>
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field>
            <FieldLabel className="contact-form__label" htmlFor="contact-email">
              Email <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              aria-describedby={emailHasError ? 'contact-form-message' : undefined}
              aria-invalid={emailHasError}
              autoComplete="email"
              className={fieldClassName}
              id="contact-email"
              name="email"
              placeholder="you@company.ca"
              ref={emailRef}
              required
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel className="contact-form__label" htmlFor="contact-phone">
              Phone
            </FieldLabel>
            <Input
              autoComplete="tel"
              className={fieldClassName}
              id="contact-phone"
              inputMode="tel"
              name="phone"
              placeholder="647-555-0123"
              type="tel"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel className="contact-form__label" htmlFor="contact-message">
            What are you financing? <span aria-hidden="true">*</span>
          </FieldLabel>
          <Textarea
            aria-describedby={messageHasError ? 'contact-form-message' : 'contact-message-help'}
            aria-invalid={messageHasError}
            className="contact-form__control min-h-32 resize-y rounded-none border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white shadow-none placeholder:text-white/70 focus-visible:border-[#96ec18] focus-visible:ring-0 focus-visible:outline-none"
            id="contact-message"
            name="message"
            placeholder="Property, location, requested amount, timing, and the issue to solve."
            ref={messageRef}
            required
          />
          <p className="sr-only" id="contact-message-help">
            Include the property, location, requested amount, timing, and main constraint.
          </p>
        </Field>
      </FieldGroup>

      <div aria-live="polite" className="contact-form__message" id="contact-form-message">
        {state === 'success' ? (
          <p className="contact-form__success" role="status">
            <Check aria-hidden="true" />
            Message received. FairLend will review the file details and follow up.
          </p>
        ) : null}
        {state === 'error' ? <FieldError className="text-[#fffdf9]">{error}</FieldError> : null}
      </div>

      <Button
        className="contact-form__submit group"
        disabled={state === 'submitting'}
        size="clear"
        type="submit"
      >
        <span>{state === 'submitting' ? 'Sending inquiry' : 'Send inquiry'}</span>
        {state === 'submitting' ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : state === 'success' ? (
          <Check aria-hidden="true" />
        ) : (
          <ArrowUpRight aria-hidden="true" />
        )}
      </Button>
    </form>
  )
}
