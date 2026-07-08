'use client'

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Landmark,
  Loader2,
  ShieldCheck,
  TimerReset,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { GoogleAddressAutocomplete } from '@/components/address/GoogleAddressAutocomplete'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { trackFairlendEvent, trackLeadFailed, trackLeadSubmitted } from '@/lib/analytics/events'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import {
  buildFairlendIntakeHref,
  type FairlendGenericLeadIntent,
  normalizeFairlendIntakeIntent,
} from '@/lib/fairlend-intake'

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

type DossierItem = {
  icon: LucideIcon
  label: string
  text: string
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
      'List what is ready and what is still missing so FairLend can see the document picture.',
    detailLabel: 'Document notes',
    detailPlaceholder:
      'Budget, drawings, permits, appraisal, rent roll, photos, or anything still pending.',
    kicker: 'Document status',
    submitLabel: 'Send document status',
    title: 'Send the document picture.',
  },
  invest: {
    description:
      'Share your capital range, timing, and questions so the first conversation starts with useful context.',
    detailLabel: 'What kind of investing are you considering?',
    detailPlaceholder:
      'Capital range, preferred term, mortgage position, geography, property type, or questions you want answered.',
    kicker: 'Investor inquiry',
    submitLabel: 'Send investor inquiry',
    title: 'Explore private mortgage investing with FairLend.',
  },
  mortgage: {
    description:
      'Share the basics before the consultation so FairLend can come prepared with private mortgage options that fit the property, timing, and amount.',
    detailLabel: 'Add context',
    detailPlaceholder:
      'Example: I need to close in two weeks, my bank declined the file, and there is equity in the property.',
    kicker: 'Private mortgage help',
    submitLabel: 'Ask FairLend to review my options',
    title: 'The FairLend Mortgage',
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

const mortgageTimelineOptions = [
  'Need funds in days',
  'Closing in 2 weeks',
  'Renewal / payout coming up',
  'Not urgent yet',
] as const

const mortgageAmountRangeOptions = [
  '$50K-$100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M+',
  'Not sure yet',
] as const

const mortgageBenefitPoints = [
  'Same day commitments available',
  'Flexible financing options',
  'Transparent terms',
  'No hidden fees',
  'Complimentary exit planning',
] as const

const documentStatusOptions = [
  'Ready to send',
  'Partially ready',
  'Need help identifying documents',
  'Not started',
] as const

const mortgageDossierItems: DossierItem[] = [
  {
    icon: TimerReset,
    label: 'Prepared around your deadline',
    text: 'Closing, renewal, payout, and bridge timing shape the options FairLend brings to the consultation.',
  },
  {
    icon: Home,
    label: 'Options, not another form',
    text: 'The basics help the specialist focus the conversation on practical private mortgage routes.',
  },
  {
    icon: ShieldCheck,
    label: 'No documents up front',
    text: 'Start with property, amount, and timing. FairLend can ask for documents after the consultation if needed.',
  },
]

const genericDossierItems: DossierItem[] = [
  {
    icon: ClipboardCheck,
    label: 'Initial review',
    text: 'FairLend reads the request and routes it to the appropriate specialist lane.',
  },
  {
    icon: Landmark,
    label: 'Specialist review',
    text: 'The team can respond with mortgage, construction, investor, or partner context.',
  },
  {
    icon: BadgeCheck,
    label: 'Clear next steps',
    text: 'You will know what FairLend needs next instead of guessing at documents.',
  },
]

const investorDossierItems: DossierItem[] = [
  {
    icon: ClipboardCheck,
    label: 'Show your fit',
    text: 'Share your investing preferences so the first conversation can focus on the relevant private mortgage lane.',
  },
  {
    icon: Landmark,
    label: 'Review the criteria',
    text: 'FairLend can walk through term, position, geography, security, and how each file is reviewed.',
  },
  {
    icon: BadgeCheck,
    label: 'Clear next step',
    text: 'You will know what happens next before any documents, funds, or commitments are involved.',
  },
]

const reviewRoute = ['Situation', 'Property', 'Timing', 'Next step'] as const

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
  const isMortgageIntent = intent === 'mortgage'
  const isInvestorIntent = intent === 'invest'
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
  const consultationFollowUpHref = buildFairlendIntakeHref({
    address: values.address,
    email: values.email,
    intent: 'consultation',
    leadId,
    name: values.name,
    phone: values.phone,
    source: `${source}-success-consultation`,
  })

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
  const dossierItems = isMortgageIntent
    ? mortgageDossierItems
    : isInvestorIntent
      ? investorDossierItems
      : genericDossierItems

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
      trackLeadSubmitted({
        has_existing_lead: Boolean(leadId),
        intent,
        source,
        step: 'intake_submit',
      })
      setState('success')
    } catch (error) {
      console.error('FairLend lead intake failed', error)
      trackLeadFailed({
        intent,
        source,
        step: 'intake_submit',
      })
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <main className="fl-intake-page fl-intake-page--success">
        <section className="fl-intake-shell fl-intake-shell--success">
          <BorrowerDossier
            copy={copy}
            dossierItems={dossierItems}
            isMortgageIntent={isMortgageIntent}
            stateLabel="Request received"
          />

          <Card className="fl-intake-card fl-intake-card--success">
            <CardHeader className="fl-intake-card-header">
              <div className="fl-intake-success-mark" aria-hidden="true">
                <CheckCircle2 />
              </div>
              <CardTitle className="fl-intake-card-title">
                {isInvestorIntent
                  ? 'FairLend received your investor inquiry.'
                  : isMortgageIntent
                    ? 'FairLend has your mortgage context.'
                    : 'FairLend has the context.'}
              </CardTitle>
              <CardDescription>
                {intent === 'consultation'
                  ? 'Your consultation request is saved. Continue to the scheduler now that the lead record exists.'
                  : isInvestorIntent
                    ? 'The team will review your preferences and come back with the practical path for private mortgage investing.'
                    : isMortgageIntent
                      ? 'The team can review the basics before the consultation and come prepared with private mortgage options.'
                      : 'FairLend has enough context to route the request and respond with the right next step.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="fl-intake-success-body">
              <div className="fl-intake-next-strip">
                {isMortgageIntent ? (
                  <>
                    <span>Review basics</span>
                    <span>Prepare options</span>
                    <span>Talk next step</span>
                  </>
                ) : isInvestorIntent ? (
                  <>
                    <span>Review fit</span>
                    <span>Discuss criteria</span>
                    <span>Confirm next step</span>
                  </>
                ) : (
                  <>
                    <span>Check fit</span>
                    <span>Clarify docs</span>
                    <span>Talk next step</span>
                  </>
                )}
              </div>
              <p>
                {isInvestorIntent
                  ? 'FairLend will use these details only to respond to your inquiry. A team member can explain the investor review process and what information is needed next.'
                  : isMortgageIntent
                    ? 'FairLend will use these details only to prepare for the consultation and respond to your request.'
                    : 'FairLend will use these details only to review and respond to the request. The team can ask for any relevant documents later.'}
              </p>
            </CardContent>
            <CardFooter className="fl-intake-card-footer fl-intake-card-footer--success">
              <Button asChild className="fl-intake-submit">
                {intent === 'consultation' ? (
                  <a
                    href={bookingsUrl}
                    onClick={() =>
                      trackFairlendEvent('fairlend_scheduler_opened', {
                        intent,
                        source: `${source}-scheduler`,
                      })
                    }
                    rel="noreferrer"
                    target="_blank"
                  >
                    Continue to scheduler
                    <ArrowRight data-icon="inline-end" />
                  </a>
                ) : (
                  <Link href={consultationFollowUpHref}>
                    Request a consultation
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                )}
              </Button>
              <Button asChild className="fl-intake-secondary-action" variant="outline">
                <Link href="/">Return home</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    )
  }

  return (
    <main className="fl-intake-page">
      <section className="fl-intake-shell">
        <BorrowerDossier
          copy={copy}
          dossierItems={dossierItems}
          isMortgageIntent={isMortgageIntent}
          stateLabel={copy.kicker}
        />

        <Card className="fl-intake-card">
          <CardHeader className="fl-intake-card-header">
            <div className="fl-intake-card-topline">
              <span>
                {isMortgageIntent
                    ? 'Private mortgage request'
                    : isInvestorIntent
                      ? 'Investor inquiry'
                      : 'File context'}
              </span>
              <span>
                {isMortgageIntent || isInvestorIntent ? 'Usually 2 minutes' : 'Quick routing'}
              </span>
            </div>
            <CardTitle className="fl-intake-card-title">
              {isMortgageIntent
                ? 'Share the basics.'
                : isInvestorIntent
                  ? 'Tell us how you want to invest.'
                  : 'Put the useful facts on the table.'}
            </CardTitle>
            <CardDescription className="fl-intake-card-description">
              {isMortgageIntent
                ? 'This is not a full application. A few details now help FairLend come prepared with options for your consultation.'
                : isInvestorIntent
                  ? 'No commitment and no sensitive documents here. Give the basics so the conversation is useful.'
                  : 'Give enough context to route the request cleanly. No essays, no full application.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="fl-intake-card-content">
              <FieldGroup className="fl-intake-field-group">
                {!isMortgageIntent ? (
                  <div className="fl-intake-form-section fl-intake-form-section--priority">
                    <div className="fl-intake-section-heading">
                      <span>{copy.detailLabel}</span>
                      <p>
                        {isInvestorIntent
                          ? 'Share enough for a focused first conversation.'
                          : 'Short context is enough to get the request moving.'}
                      </p>
                    </div>

                    <Field className="fl-intake-field" data-invalid={Boolean(errors.message)}>
                      <FieldLabel className="fl-intake-label" htmlFor="lead-message">
                        {copy.detailLabel}
                      </FieldLabel>
                      <Textarea
                        aria-invalid={Boolean(errors.message)}
                        className="fl-intake-input fl-intake-textarea"
                        id="lead-message"
                        onChange={(event) => updateField('message', event.target.value)}
                        placeholder={copy.detailPlaceholder}
                        value={values.message}
                      />
                      <FieldDescription className="fl-intake-description">
                        {isInvestorIntent
                          ? 'Avoid account numbers or sensitive documents. FairLend can explain what is needed after first contact.'
                          : 'Keep private details concise. FairLend can request documents after first review.'}
                      </FieldDescription>
                      <FieldError className="fl-intake-error">{errors.message}</FieldError>
                    </Field>
                  </div>
                ) : null}

                <div className="fl-intake-form-section">
                  <div className="fl-intake-section-heading">
                    <span>
                      {isMortgageIntent
                        ? 'Property, amount, and timing'
                        : isInvestorIntent
                          ? 'Capital, timing, and preferences'
                          : 'Request context'}
                    </span>
                    <p>
                      {isMortgageIntent
                        ? 'Approximate numbers are fine. Confirm the details with a specialist later.'
                        : isInvestorIntent
                          ? 'Approximate ranges are fine. The goal is to understand which investor lane fits.'
                          : 'Give FairLend the practical details needed to route the request.'}
                    </p>
                  </div>

                  {showAddress ? (
                    <AddressField
                      autoComplete="street-address"
                      id="lead-address"
                      label={isMortgageIntent ? 'Property address' : 'Property or project address'}
                      onChange={(value) => updateField('address', value)}
                      value={values.address}
                    />
                  ) : null}

                  <div
                    className={
                      isMortgageIntent ? 'fl-intake-grid' : 'fl-intake-grid fl-intake-grid--two'
                    }
                  >
                    {showAmount ? (
                      isMortgageIntent ? (
                        <AmountRangeSelector
                          label="Amount needed or equity available"
                          onSelect={(value) => updateField('amount', value)}
                          selectedValue={values.amount}
                        />
                      ) : (
                        <TextField
                          id="lead-amount"
                          label={isInvestorIntent ? 'Capital range' : 'Amount or range'}
                          onChange={(value) => updateField('amount', value)}
                          value={values.amount}
                        />
                      )
                    ) : null}
                    {!isMortgageIntent ? (
                      <TextField
                        id="lead-timeline"
                        label={isInvestorIntent ? 'Preferred timing' : 'Timeline'}
                        onChange={(value) => updateField('timeline', value)}
                        value={values.timeline}
                      />
                    ) : null}
                  </div>

                  {isMortgageIntent ? (
                    <QuickPickRow
                      label="Deadline"
                      options={mortgageTimelineOptions}
                      selectedValue={values.timeline}
                      onSelect={(option) => updateField('timeline', option)}
                    />
                  ) : null}
                </div>

                {showDocumentStatus ? (
                  <Field className="fl-intake-field">
                    <FieldLabel className="fl-intake-label" htmlFor="lead-document-status">
                      Document status
                    </FieldLabel>
                    <Select
                      value={values.documentStatus}
                      onValueChange={(value) => updateField('documentStatus', value)}
                    >
                      <SelectTrigger className="fl-intake-input" id="lead-document-status">
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

                <div className="fl-intake-form-section">
                  <div className="fl-intake-section-heading">
                    <span>Contact</span>
                    <p>
                      {isInvestorIntent
                        ? 'An investor team member responds if there is a fit.'
                        : isMortgageIntent
                          ? 'A specialist uses this to prepare for your consultation.'
                          : 'A specialist responds with the right next step.'}
                    </p>
                  </div>
                  <div className="fl-intake-grid fl-intake-grid--two">
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
                    <TextField
                      autoComplete="tel"
                      id="lead-phone"
                      label="Phone"
                      onChange={(value) => updateField('phone', value)}
                      type="tel"
                      value={values.phone}
                    />
                    {!isMortgageIntent ? (
                      <Field className="fl-intake-field">
                        <FieldLabel className="fl-intake-label" htmlFor="lead-role">
                          {isInvestorIntent ? 'Investor type' : 'Your role'}
                        </FieldLabel>
                        <Select
                          value={values.role}
                          onValueChange={(value) => updateField('role', value)}
                        >
                          <SelectTrigger className="fl-intake-input" id="lead-role">
                            <SelectValue placeholder="Choose if different" />
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
                    ) : null}
                  </div>
                </div>

                {state === 'error' ? (
                  <p className="fl-intake-alert" role="alert">
                    We could not save the request. Check the details and try again.
                  </p>
                ) : null}
              </FieldGroup>
            </CardContent>
            <CardFooter className="fl-intake-card-footer">
              <Button className="fl-intake-submit" disabled={state === 'submitting'} type="submit">
                {state === 'submitting' ? (
                  <Loader2
                    aria-hidden="true"
                    className="fl-intake-spinner"
                    data-icon="inline-start"
                  />
                ) : null}
                {state === 'submitting' ? 'Sending review context' : copy.submitLabel}
              </Button>
              <p className="fl-intake-privacy-note">
                {isInvestorIntent
                  ? 'FairLend uses this information only to respond to your investor inquiry.'
                  : isMortgageIntent
                    ? 'FairLend uses this context only to prepare for the consultation and respond to your request.'
                    : 'FairLend uses this context only to review and respond to the request.'}
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>
    </main>
  )
}

function BorrowerDossier({
  copy,
  dossierItems,
  isMortgageIntent,
  stateLabel,
}: {
  copy: IntakeCopy
  dossierItems: DossierItem[]
  isMortgageIntent: boolean
  stateLabel: string
}) {
  return (
    <aside className="fl-intake-dossier" aria-label="FairLend request review context">
      <div className="fl-intake-kicker">
        <span aria-hidden="true" />
        {stateLabel}
      </div>
      <h1>{copy.title}</h1>
      {isMortgageIntent ? (
        <MortgageReviewDesk description={copy.description} />
      ) : (
        <>
          <p className="fl-intake-lede">{copy.description}</p>
          <div className="fl-intake-illustration" aria-hidden="true">
            <Image
              alt=""
              className="fl-intake-house"
              height={520}
              priority
              src="/assets/fairlend-route-selector/private-mortgage-house-engraving.webp"
              width={720}
            />
            <div className="fl-intake-file-stamp">
              <span>FairLend</span>
              <strong>Start here</strong>
            </div>
            <svg className="fl-intake-route-ink" viewBox="0 0 420 160">
              <path d="M18 118 C84 26 132 138 194 72 S310 36 398 100" />
              <circle cx="18" cy="118" r="8" />
              <circle cx="194" cy="72" r="8" />
              <circle cx="398" cy="100" r="8" />
            </svg>
          </div>

          <ol className="fl-intake-review-route" aria-label="Private mortgage review route">
            {reviewRoute.map((step) => (
              <li key={step}>
                <span aria-hidden="true" />
                {step}
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="fl-intake-dossier-list">
        {dossierItems.map((item) => {
          const Icon = item.icon

          return (
            <div className="fl-intake-dossier-item" key={item.label}>
              <Icon aria-hidden="true" />
              <div>
                <h2>{item.label}</h2>
                <p>{item.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

function MortgageReviewDesk({ description }: { description: string }) {
  return (
    <div className="fl-mortgage-desk">
      <div className="fl-mortgage-desk__header">
        <span>Prepared mortgage consultation</span>
        <strong>Basic details first</strong>
      </div>

      <div className="fl-mortgage-desk__body">
        <div className="fl-mortgage-desk__copy">
          <p>{description}</p>
          <ul>
            {mortgageBenefitPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="fl-mortgage-collateral" aria-hidden="true">
          <div className="fl-mortgage-collateral__stamp">
            <span>Private mortgage</span>
            <strong>Start here</strong>
          </div>
          <Image
            alt=""
            className="fl-mortgage-collateral__house"
            height={520}
            priority
            src="/assets/fairlend-route-selector/private-mortgage-house-engraving.webp"
            width={720}
          />
        </div>
      </div>

      <ol className="fl-mortgage-route" aria-label="Private mortgage review route">
        {reviewRoute.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </div>
  )
}

function QuickPickRow({
  label,
  onSelect,
  options,
  selectedValue,
}: {
  label: string
  onSelect: (value: string) => void
  options: readonly string[]
  selectedValue: string
}) {
  return (
    <div className="fl-intake-quickpick">
      <span>{label}</span>
      <div className="fl-intake-chip-row">
        {options.map((option) => (
          <button
            aria-pressed={selectedValue === option}
            className="fl-intake-chip"
            data-selected={selectedValue === option}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function AddressField({
  autoComplete,
  id,
  label,
  onChange,
  value,
}: {
  autoComplete?: string
  id: string
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <GoogleAddressAutocomplete
      autoComplete={autoComplete}
      className="fl-intake-field fl-intake-address-autocomplete"
      id={id}
      inputClassName="fl-intake-input"
      label={label}
      labelClassName="fl-intake-label"
      onChange={(nextValue) => onChange(nextValue)}
      placeholder="Start typing the property address"
      value={value}
    />
  )
}

function AmountRangeSelector({
  label,
  onSelect,
  selectedValue,
}: {
  label: string
  onSelect: (value: string) => void
  selectedValue: string
}) {
  return (
    <fieldset className="fl-intake-field fl-intake-amount-field">
      <legend className="fl-intake-label">{label}</legend>
      <RadioGroup className="fl-intake-amount-grid" onValueChange={onSelect} value={selectedValue}>
        {mortgageAmountRangeOptions.map((option, index) => {
          const optionId = `lead-amount-${index}`

          return (
            <label
              className="fl-intake-amount-chip"
              data-selected={selectedValue === option}
              htmlFor={optionId}
              key={option}
            >
              <RadioGroupItem className="fl-intake-amount-radio" id={optionId} value={option} />
              <span>{option}</span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
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
    <Field className="fl-intake-field" data-invalid={Boolean(error)}>
      <FieldLabel className="fl-intake-label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
      </FieldLabel>
      <Input
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className="fl-intake-input"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
      <FieldError className="fl-intake-error">{error}</FieldError>
    </Field>
  )
}

function validateLeadCapture(
  values: LeadCaptureValues,
  { requiresName }: { requiresName: boolean },
): LeadCaptureErrors {
  const errors: LeadCaptureErrors = {}

  if (requiresName && !values.name.trim()) {
    errors.name = 'Please enter your name so FairLend knows who to contact.'
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter an email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email address needs an @ symbol, like name@example.com.'
  }

  return errors
}
