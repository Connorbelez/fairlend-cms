'use client'

import { Mail, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { DecorIcon } from '@/components/decor-icon'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackLeadFailed, trackLeadSubmitted } from '@/lib/analytics/events'
import { cn } from '@/utilities/ui'

const contactMethods = [
  {
    title: 'Call Us Today!',
    value: '+1 (555) 123-4567',
    icon: <Phone />,
  },
  {
    title: 'Send an Email',
    value: 'mail@example.com',
    icon: <Mail />,
  },
]

export function ContactSection() {
  return (
    <div className="relative mx-auto w-full max-w-lg border">
      <div className="border-b px-6 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Get in touch</h1>
          <p className="text-muted-foreground text-sm">
            Have a question, feedback, or want to collaborate? <br /> We&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {contactMethods.map((item) => (
            <div className="flex items-center gap-4 p-2" key={item.title}>
              <div className="[&_svg]:size-5 [&_svg]:text-muted-foreground">{item.icon}</div>
              <div className={cn('flex flex-col gap-y-0.5')}>
                <h2 className="text-sm">{item.title}</h2>
                <p className="text-muted-foreground text-xs">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-8 flex flex-col gap-1.5">
          <h2 className="text-xl font-medium">Send a message</h2>
          <p className="text-muted-foreground text-sm">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
        <ContactForm />
      </div>
      <DecorIcon position="top-left" />
      <DecorIcon position="top-right" />
      <DecorIcon position="bottom-left" />
      <DecorIcon position="bottom-right" />
    </div>
  )
}

function ContactForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.')
      setState('error')
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
          name: [firstName, lastName].filter(Boolean).join(' '),
          phone,
          intent: 'contact',
          source: 'contact-section',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Contact lead POST failed: ${response.status}`)
      }

      event.currentTarget.reset()
      trackLeadSubmitted({
        intent: 'contact',
        source: 'contact-section',
        step: 'contact_submit',
      })
      setState('success')
    } catch (submitError) {
      console.error('Contact lead submission failed', submitError)
      trackLeadFailed({
        intent: 'contact',
        source: 'contact-section',
        step: 'contact_submit',
      })
      setError('We could not send the message. Try again or call FairLend directly.')
      setState('error')
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first-name">First name</FieldLabel>
            <Input autoComplete="given-name" id="first-name" name="firstName" placeholder="John" />
          </Field>
          <Field>
            <FieldLabel htmlFor="last-name">Last name</FieldLabel>
            <Input autoComplete="family-name" id="last-name" name="lastName" placeholder="Doe" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="johndoe@example.com"
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
            autoComplete="tel"
            id="phone"
            name="phone"
            placeholder="+1 (555) 123-4567"
            type="tel"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea autoComplete="off" id="message" name="message" placeholder="Your message" />
        </Field>
      </FieldGroup>
      {state === 'success' ? (
        <p className="mt-4 text-sm font-medium text-muted-foreground" role="status">
          Message received. FairLend has it.
        </p>
      ) : null}
      {state === 'error' ? <FieldError className="mt-4">{error}</FieldError> : null}
      <Button className="mt-8 w-full" disabled={state === 'submitting'} type="submit">
        {state === 'submitting' ? 'Sending...' : 'Submit'}
      </Button>
    </form>
  )
}
