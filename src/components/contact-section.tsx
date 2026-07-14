'use client'

import { ArrowUpRight, Clock3, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackLeadFailed, trackLeadSubmitted } from '@/lib/analytics/events'

const contactMethods: Array<{
  detail: string
  href?: string
  icon: LucideIcon
  label: string
}> = [
  {
    detail: '647-831-7605',
    href: 'tel:+16478317605',
    icon: Phone,
    label: 'Call FairLend',
  },
  {
    detail: 'elie@fairlend.ca',
    href: 'mailto:elie@fairlend.ca',
    icon: Mail,
    label: 'Email the capital desk',
  },
  {
    detail: 'Monday–Friday, 9:00 a.m.–5:00 p.m. ET',
    icon: Clock3,
    label: 'Consultation availability',
  },
  {
    detail: 'Ontario, with a focus on Toronto and the GTA',
    icon: MapPin,
    label: 'Service area',
  },
]

export function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8f7f5] text-[#08090a]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[max(1.25rem,calc((100%-86rem)/2))] hidden w-px bg-[#deded8] lg:block"
      />
      <div className="mx-auto grid w-full max-w-[86rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(34rem,1.08fr)]">
        <div className="relative px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-14 lg:pb-28 lg:pt-28">
          <span className="absolute left-0 top-28 hidden size-2 -translate-x-1/2 rotate-45 bg-[#96ec18] lg:block" />
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#203500]">
            Ontario mortgage desk
          </p>
          <h1 className="mt-7 max-w-[12ch] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3.6rem,7vw,6rem)] font-semibold leading-[0.88] tracking-[-0.04em]">
            A clear next step starts here.
          </h1>
          <p className="mt-8 max-w-xl text-base font-medium leading-7 text-[#494944] sm:text-lg sm:leading-8">
            Tell us what you are financing, where the property is, and what has to happen next.
            FairLend will route your file to the right mortgage, construction, or investment
            conversation.
          </p>

          <div className="mt-12 grid border-y border-[#deded8] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {contactMethods.map(({ detail, href, icon: Icon, label }, index) => {
              const content = (
                <>
                  <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#203500]" />
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#768183]">
                      {label}
                    </span>
                    <span className="mt-1.5 block text-sm font-semibold leading-5 text-[#08090a]">
                      {detail}
                    </span>
                  </span>
                  {href ? (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-auto size-4 shrink-0 text-[#6c6c64] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  ) : null}
                </>
              )

              const className = [
                'group flex min-h-28 items-start gap-4 py-5 sm:px-5 lg:px-0 xl:px-5',
                index % 2 === 0 ? 'sm:pr-5 sm:pl-0 lg:pr-0 xl:pr-5 xl:pl-0' : '',
                index % 2 === 1 ? 'sm:border-l sm:border-[#deded8] lg:border-l-0 xl:border-l xl:pl-5' : '',
                index > 1 ? 'border-t border-[#deded8]' : '',
                index === 1 ? 'border-t border-[#deded8] sm:border-t-0 lg:border-t xl:border-t-0' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return href ? (
                <a className={className} href={href} key={label}>
                  {content}
                </a>
              ) : (
                <div className={className} key={label}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative bg-[#08090a] px-5 py-14 text-[#fffdf9] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-end justify-between gap-8 border-b border-white/15 pb-7">
              <div>
                <p className="font-[family-name:var(--font-oxanium)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#96ec18]">
                  File intake
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                  Send the essentials.
                </h2>
              </div>
              <span className="hidden font-[family-name:var(--font-oxanium)] text-xs text-white/50 sm:block">
                CONTACT / ON
              </span>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
              Include the property type, municipality, requested amount, timing, and the main
              constraint. Do not send SINs, banking credentials, or identity documents here.
            </p>
            <ContactForm />
            <p className="mt-7 text-xs leading-5 text-white/50">
              By sending this form, you consent to FairLend contacting you about your inquiry. See
              our{' '}
              <Link className="text-[#fffdf9] underline underline-offset-4" href="/en/brokerage/privacy-policy">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link className="text-[#fffdf9] underline underline-offset-4" href="/terms">
                Website Terms
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

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
      return
    }

    if (!message) {
      setError('Tell us what you need help financing.')
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
    } catch (submitError) {
      console.error('Contact lead submission failed', submitError)
      trackLeadFailed({ intent: 'contact', source: 'contact-page', step: 'contact_submit' })
      setError('We could not send the message. Try again or call FairLend directly.')
      setState('error')
    }
  }

  const fieldClassName =
    'h-12 rounded-none border-0 border-b border-white/25 bg-transparent px-0 text-base text-white shadow-none placeholder:text-white/65 focus-visible:border-[#96ec18] focus-visible:ring-0 focus-visible:outline-none'

  return (
    <form className="mt-10 w-full" noValidate onSubmit={handleSubmit}>
      <FieldGroup className="gap-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-xs font-semibold text-white/70" htmlFor="contact-first-name">
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
            <FieldLabel className="text-xs font-semibold text-white/70" htmlFor="contact-last-name">
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
            <FieldLabel className="text-xs font-semibold text-white/70" htmlFor="contact-email">
              Email <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              aria-invalid={state === 'error' && error.includes('email')}
              autoComplete="email"
              className={fieldClassName}
              id="contact-email"
              name="email"
              placeholder="you@company.ca"
              required
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel className="text-xs font-semibold text-white/70" htmlFor="contact-phone">
              Phone
            </FieldLabel>
            <Input
              autoComplete="tel"
              className={fieldClassName}
              id="contact-phone"
              name="phone"
              placeholder="Phone number"
              type="tel"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel className="text-xs font-semibold text-white/70" htmlFor="contact-message">
            What are you financing? <span aria-hidden="true">*</span>
          </FieldLabel>
          <Textarea
            aria-invalid={state === 'error' && error.includes('financing')}
            className="min-h-32 resize-y rounded-none border-0 border-b border-white/25 bg-transparent px-0 py-3 text-base text-white shadow-none placeholder:text-white/65 focus-visible:border-[#96ec18] focus-visible:ring-0 focus-visible:outline-none"
            id="contact-message"
            name="message"
            placeholder="Property, location, requested amount, timing, and the issue to solve."
            required
          />
        </Field>
      </FieldGroup>
      <div aria-live="polite" className="min-h-12 pt-4">
        {state === 'success' ? (
          <p className="text-sm font-semibold text-[#e8ff9b]" role="status">
            Message received. FairLend will review the file details and follow up.
          </p>
        ) : null}
        {state === 'error' ? <FieldError className="text-[#fffdf9]">{error}</FieldError> : null}
      </div>
      <Button
        className="group mt-2 h-13 w-full rounded-none bg-[#96ec18] px-6 text-sm font-extrabold text-[#030405] shadow-none hover:bg-[#a4fb20] sm:w-auto"
        disabled={state === 'submitting'}
        type="submit"
      >
        {state === 'submitting' ? 'Sending…' : 'Send inquiry'}
        <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Button>
    </form>
  )
}
