'use client'

import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  type FairlendGenericLeadIntent,
  normalizeFairlendIntakeIntent,
} from '@/lib/fairlend-intake'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'

type LeadCaptureState = 'idle' | 'submitting' | 'success' | 'error'

type LeadCaptureValues = {
  address: string
  amount: string
  documentStatus: string
  email: string
  message: string
  name: string
  phone: string
  role: string
  timeline: string
}

type LeadCaptureErrors = Partial<Record<keyof LeadCaptureValues, string>>

type IntakeCopy = {
  description: string
  detailLabel: string
  detailPlaceholder: string
  kicker: string
  submitLabel: string
  title: string
}

const intakeCopyByIntent: Record<FairlendGenericLeadIntent, IntakeCopy> = {
  contact: {
    description:
      'Send the context once. FairLend will route it to the right mortgage, construction, or partner workflow.',
    detailLabel: 'What should FairLend review?',
    detailPlaceholder: 'Tell us about the property, timing, question, or file.',
    kicker: 'Contact intake',
    submitLabel: 'Send to FairLend',
    title: 'Tell us what you need.',
  },
  consultation: {
    description:
      'Share the practical context before a call so the team can prepare the right financing path.',
    detailLabel: 'What do you want to cover?',
    detailPlaceholder:
      'Project type, address, timing, financing question, or preferred call window.',
    kicker: 'Consultation request',
    submitLabel: 'Request consultation',
    title: 'Request a focused FairLend review.',
  },
  'document-upload': {
    description:
      'List what is ready and what is still missing so FairLend can move the file into document follow-up.',
    detailLabel: 'Document notes',
    detailPlaceholder:
      'Budget, drawings, permits, appraisal, rent roll, photos, or anything still pending.',
    kicker: 'Document follow-up',
    submitLabel: 'Send document status',
    title: 'Send the document picture.',
  },
  invest: {
    description:
      'Tell us the investment lane, target amount, and timing so the investor team can follow up with the right context.',
    detailLabel: 'Investment focus',
    detailPlaceholder:
      'Target yield, preferred term, mortgage position, geography, or available capital.',
    kicker: 'Investor intake',
    submitLabel: 'Submit investor intake',
    title: 'Start the investor conversation.',
  },
  mortgage: {
    description:
      'Share the property and timing. FairLend will review whether a private mortgage structure may fit.',
    detailLabel: 'Borrower situation',
    detailPlaceholder:
      'Renewal, closing deadline, equity access, bridge financing, bank decline, or other context.',
    kicker: 'Mortgage intake',
    submitLabel: 'Submit mortgage request',
    title: 'Start a mortgage review.',
  },
  newsletter: {
    description:
      'Leave an email and any optional context for market updates, capital notes, and FairLend program changes.',
    detailLabel: 'Optional context',
    detailPlaceholder:
      'Topics you care about: private mortgages, construction financing, investment updates.',
    kicker: 'Market updates',
    submitLabel: 'Stay updated',
    title: 'Get FairLend updates.',
  },
  'partner-apply': {
    description:
      'Tell us who you serve and how FairLend could support the files before they harden.',
    detailLabel: 'Partner fit',
    detailPlaceholder:
      'Brokerage, realtor, planner, architect, builder, accountant, lawyer, or advisor context.',
    kicker: 'Partner application',
    submitLabel: 'Apply to become a partner',
    title: 'Start the partner application.',
  },
  'partner-project': {
    description:
      'Bring the client or project context in early. FairLend can route it into construction financing review.',
    detailLabel: 'Project context',
    detailPlaceholder:
      'Site, borrower, build type, land status, permits, budget, timing, and current blocker.',
    kicker: 'Partner project',
    submitLabel: 'Send project to FairLend',
    title: 'Bring us a project.',
  },
  'partner-scenario': {
    description:
      'Use this for a live scenario that needs a fast financing read before the next project decision.',
    detailLabel: 'Scenario',
    detailPlaceholder:
      'What decision is coming up, what is known, and where is the financing uncertainty?',
    kicker: 'Partner scenario',
    submitLabel: 'Talk through scenario',
    title: 'Talk through a live file.',
  },
  'route-helper': {
    description:
      'Answer once and FairLend will decide whether the right path is private mortgage, build financing, investing, or partner support.',
    detailLabel: 'What are you trying to solve?',
    detailPlaceholder:
      'Property, project, role, desired outcome, timing, and any current constraint.',
    kicker: 'Route helper',
    submitLabel: 'Help me choose',
    title: 'Find the right FairLend route.',
  },
}

const roleOptions = [
  'Borrower / owner',
  'Builder / developer',
  'Mortgage broker',
  'Realtor',
  'Architect / planner',
  'Investor',
  'Advisor',
  'Other',
] as const

const documentStatusOptions = [
  'Ready to send',
  'Partially ready',
  'Need help identifying documents',
  'Not started',
] as const

const emptyValues: LeadCaptureValues = {
  address: '',
  amount: '',
  documentStatus: '',
  email: '',
  message: '',
  name: '',
  phone: '',
  role: '',
  timeline: '',
}

export function FairlendLeadIntake() {
  const searchParams = useSearchParams()
  const intent = normalizeFairlendIntakeIntent(
    searchParams.get('intent'),
  ) as FairlendGenericLeadIntent
  const copy = intakeCopyByIntent[intent] ?? intakeCopyByIntent.contact
  const source = searchParams.get('source')?.trim() || `intake-${intent}`
  const initialLeadId = searchParams.get('leadId')?.trim() || null
  const [leadId, setLeadId] = useState<string | null>(initialLeadId)
  const [state, setState] = useState<LeadCaptureState>('idle')
  const [errors, setErrors] = useState<LeadCaptureErrors>({})
  const [values, setValues] = useState<LeadCaptureValues>(() => ({
    ...emptyValues,
    address: searchParams.get('address')?.trim() ?? '',
    email: searchParams.get('email')?.trim() ?? '',
    name: searchParams.get('name')?.trim() ?? '',
    phone: searchParams.get('phone')?.trim() ?? '',
  }))
  const bookingsUrl = getFairlendMicrosoftBookingsUrl()

  const showDocumentStatus = intent === 'document-upload'
  const showAmount = intent === 'invest' || intent === 'mortgage' || intent.startsWith('partner')
  const showAddress =
    intent === 'mortgage' ||
    intent === 'partner-project' ||
    intent === 'partner-scenario' ||
    intent === 'route-helper' ||
    intent === 'consultation' ||
    intent === 'document-upload'
  const requiresName = intent !== 'newsletter'

  function updateField<Key extends keyof LeadCaptureValues>(
    field: Key,
    value: LeadCaptureValues[Key],
  ): void {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
    if (state === 'error') {
      setState('idle')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const validationErrors = validateLeadCapture(values, { requiresName })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setState('submitting')
    setErrors({})

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          address: values.address,
          email: values.email,
          id: leadId ?? undefined,
          intent,
          intake: {
            amount: values.amount,
            detail: values.message,
            documentStatus: values.documentStatus,
            page: '/intake',
            requestedIntent: intent,
            role: values.role,
            source,
            submittedAt: new Date().toISOString(),
            timeline: values.timeline,
          },
          name: values.name,
          phone: values.phone,
          source,
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const payload = (await response.json().catch(() => null)) as { id?: string } | null

      if (!response.ok) {
        throw new Error('Lead capture failed')
      }

      setLeadId(payload?.id ?? leadId)
      setState('success')
    } catch (error) {
      console.error('Fairlend lead intake failed', error)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <main className="min-h-svh bg-[#f8f7f5] px-4 py-16 text-[#08090a] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4f6f10]">
              Intake received
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-none tracking-normal sm:text-6xl">
              FairLend has the context.
            </h1>
            <p className="max-w-xl text-base font-semibold leading-7 text-[#4b5552]">
              FairLend has the details needed to route the request and follow up with the right next
              step.
            </p>
          </div>

          <Card className="rounded-lg border-[#d8c7b6] bg-white/86 shadow-[0_22px_60px_rgb(8_9_10/10%)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#4f6f10]" />
                <CardTitle className="text-2xl">Next step</CardTitle>
              </div>
              <CardDescription>
                FairLend can review the file from here, or you can add a call request to the same
                lead.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row">
              {intent === 'consultation' ? null : (
                <Button
                  asChild
                  className="h-12 rounded-none bg-[#96ec18] font-black text-[#101010] hover:bg-[#a4fb20]"
                >
                  <a href={bookingsUrl} rel="noreferrer" target="_blank">
                    Book a consultation
                    <ArrowRight data-icon="inline-end" />
                  </a>
                </Button>
              )}
              <Button asChild className="h-12 rounded-none" variant="outline">
                <Link href="/">Return home</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-[#f8f7f5] px-4 py-12 text-[#08090a] sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6 pt-2 lg:sticky lg:top-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4f6f10]">
            {copy.kicker}
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-none tracking-normal sm:text-6xl">
            {copy.title}
          </h1>
          <p className="max-w-xl text-base font-semibold leading-7 text-[#4b5552]">
            {copy.description}
          </p>
          <div className="grid max-w-xl grid-cols-1 gap-3 border-y border-[#d8c7b6] py-4 text-sm font-bold text-[#395b5d] sm:grid-cols-3">
            <span>Initial review</span>
            <span>Specialist follow-up</span>
            <span>Clear next steps</span>
          </div>
        </div>

        <Card className="rounded-lg border-[#d8c7b6] bg-white/90 shadow-[0_22px_60px_rgb(8_9_10/10%)]">
          <CardHeader>
            <CardTitle className="text-2xl">Lead details</CardTitle>
            <CardDescription>FairLend will use this to route your request.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent>
              <FieldGroup className="gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    autoComplete="name"
                    error={errors.name}
                    id="lead-name"
                    label="Name"
                    onChange={(value) => updateField('name', value)}
                    required={requiresName}
                    value={values.name}
                  />
                  <TextField
                    autoComplete="email"
                    error={errors.email}
                    id="lead-email"
                    label="Email"
                    onChange={(value) => updateField('email', value)}
                    required
                    type="email"
                    value={values.email}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    autoComplete="tel"
                    id="lead-phone"
                    label="Phone"
                    onChange={(value) => updateField('phone', value)}
                    type="tel"
                    value={values.phone}
                  />
                  <Field>
                    <FieldLabel htmlFor="lead-role">Role</FieldLabel>
                    <Select
                      value={values.role}
                      onValueChange={(value) => updateField('role', value)}
                    >
                      <SelectTrigger id="lead-role">
                        <SelectValue placeholder="Choose closest fit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {showAddress ? (
                  <TextField
                    autoComplete="street-address"
                    id="lead-address"
                    label="Property or project address"
                    onChange={(value) => updateField('address', value)}
                    value={values.address}
                  />
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  {showAmount ? (
                    <TextField
                      id="lead-amount"
                      label="Amount or range"
                      onChange={(value) => updateField('amount', value)}
                      value={values.amount}
                    />
                  ) : null}
                  <TextField
                    id="lead-timeline"
                    label="Timeline"
                    onChange={(value) => updateField('timeline', value)}
                    value={values.timeline}
                  />
                </div>

                {showDocumentStatus ? (
                  <Field>
                    <FieldLabel htmlFor="lead-document-status">Document status</FieldLabel>
                    <Select
                      value={values.documentStatus}
                      onValueChange={(value) => updateField('documentStatus', value)}
                    >
                      <SelectTrigger id="lead-document-status">
                        <SelectValue placeholder="Choose current status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {documentStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : null}

                <Field data-invalid={Boolean(errors.message)}>
                  <FieldLabel htmlFor="lead-message">{copy.detailLabel}</FieldLabel>
                  <Textarea
                    aria-invalid={Boolean(errors.message)}
                    className="min-h-32"
                    id="lead-message"
                    onChange={(event) => updateField('message', event.target.value)}
                    placeholder={copy.detailPlaceholder}
                    value={values.message}
                  />
                  <FieldDescription>
                    Keep private details concise. FairLend can request documents after first review.
                  </FieldDescription>
                  <FieldError>{errors.message}</FieldError>
                </Field>

                {state === 'error' ? (
                  <p
                    className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive"
                    role="alert"
                  >
                    The lead could not be saved. Check the details and try again.
                  </p>
                ) : null}
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3 border-t border-[#d8c7b6] sm:flex-row sm:items-center">
              <Button
                className="h-12 rounded-none bg-[#96ec18] font-black text-[#101010] hover:bg-[#a4fb20]"
                disabled={state === 'submitting'}
                type="submit"
              >
                {state === 'submitting' ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                {copy.submitLabel}
              </Button>
              <p className="text-xs font-semibold leading-5 text-muted-foreground">
                FairLend will use this context only to review and respond to the request.
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>
    </main>
  )
}

function TextField({
  autoComplete,
  error,
  id,
  label,
  onChange,
  required,
  type = 'text',
  value,
}: {
  autoComplete?: string
  error?: string
  id: string
  label: string
  onChange: (value: string) => void
  required?: boolean
  type?: 'email' | 'tel' | 'text'
  value: string
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
      </FieldLabel>
      <Input
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

function validateLeadCapture(
  values: LeadCaptureValues,
  { requiresName }: { requiresName: boolean },
): LeadCaptureErrors {
  const errors: LeadCaptureErrors = {}

  if (requiresName && !values.name.trim()) {
    errors.name = 'Enter a name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Enter an email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email.'
  }

  return errors
}
