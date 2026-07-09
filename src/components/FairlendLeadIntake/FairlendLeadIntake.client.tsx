'use client'

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
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
import { type FormEvent, useEffect, useRef, useState } from 'react'

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
import { Frame } from '@/components/ui/frame'
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
type MortgageIntakeVariant = 'hero' | 'page'

type FairlendLeadIntakeProps = {
  intentOverride?: FairlendGenericLeadIntent
  mortgageVariant?: MortgageIntakeVariant
  sourceOverride?: string
}

type LeadCaptureValues = {
  address: string
  amount: string
  currentMortgage: string
  documentStatus: string
  email: string
  exitPlan: string
  message: string
  name: string
  phone: string
  propertyUse: string
  propertyValue: string
  role: string
  situation: string
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

/**
 * Investor-specific single-select chip rows. These map onto the same lead
 * fields the API already understands so no schema change is needed:
 *   - investorType   → values.role
 *   - capitalRange   → values.amount
 *   - preferredTerm  → values.timeline
 */
const investorTypeOptions = [
  'Individual investor',
  'Family office',
  'Mortgage investment corp.',
  'Syndicate / JV',
  'Self-directed (RRSP/TFSA)',
] as const

const investorCapitalOptions = ['$50K – $250K', '$250K – $1M', '$1M – $5M', '$5M+'] as const

const investorTermOptions = ['6–12 months', '12–24 months', 'Open / flexible'] as const

const investorProtectionPoints = [
  'Target LTVs under 75% with double valuation review',
  'Registered first-mortgage position',
  'Dedicated legal recovery path',
  'Administered reporting & tax-ready export',
] as const

const investorPreviewRows = [
  { label: 'Position', detail: 'First mortgage · registered' },
  { label: 'Loan-to-value', detail: '68% · double valuation' },
  { label: 'Term', detail: '12 months · interest only' },
  { label: 'Borrower', detail: 'Equity-based file · GTA' },
] as const

const investorRoute = ['Review fit', 'Discuss criteria', 'Confirm next step'] as const

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

const mortgageSituationOptions = [
  'Close a property quickly',
  'A bank or lender said no',
  'Use equity in my property',
  'Pay out an existing mortgage',
  'Something else',
] as const

const mortgagePropertyUseOptions = ['Primary residence', 'Rental property', 'Other'] as const

const mortgagePropertyValueOptions = ['Under $750K', '$750K-$1.5M', '$1.5M+ / not sure'] as const

const mortgageCurrentBalanceOptions = [
  'No current mortgage',
  'Under $250K',
  '$250K-$750K',
  '$750K+ / not sure',
] as const

const mortgageExitPlanOptions = [
  'Refinance with a bank',
  'Sell the property',
  'Repay from other funds',
  'Not sure yet',
] as const

const mortgageDraftStorageKey = 'fairlend-private-mortgage-intake-v1'
const mortgageTotalSteps = 5

const emptyValues: LeadCaptureValues = {
  address: '',
  amount: '',
  currentMortgage: '',
  documentStatus: '',
  email: '',
  exitPlan: '',
  message: '',
  name: '',
  phone: '',
  propertyUse: '',
  propertyValue: '',
  role: '',
  situation: '',
  timeline: '',
}

export function FairlendLeadIntake({
  intentOverride,
  mortgageVariant = 'page',
  sourceOverride,
}: FairlendLeadIntakeProps = {}) {
  const searchParams = useSearchParams()
  const intent =
    intentOverride ??
    (normalizeFairlendIntakeIntent(searchParams.get('intent')) as FairlendGenericLeadIntent)
  const isMortgageIntent = intent === 'mortgage'
  const isInvestorIntent = intent === 'invest'
  const copy = intakeCopyByIntent[intent] ?? intakeCopyByIntent.contact
  const source = sourceOverride?.trim() || searchParams.get('source')?.trim() || `intake-${intent}`
  const initialLeadId = searchParams.get('leadId')?.trim() || null
  const [leadId, setLeadId] = useState<string | null>(initialLeadId)
  const [state, setState] = useState<LeadCaptureState>('idle')
  const [errors, setErrors] = useState<LeadCaptureErrors>({})
  const [mortgageStep, setMortgageStep] = useState(1)
  const [mortgageDraftHydrated, setMortgageDraftHydrated] = useState(false)
  const [values, setValues] = useState<LeadCaptureValues>(() => ({
    ...emptyValues,
    address: searchParams.get('address')?.trim() ?? '',
    email: searchParams.get('email')?.trim() ?? '',
    name: searchParams.get('name')?.trim() ?? '',
    phone: searchParams.get('phone')?.trim() ?? '',
  }))

  useEffect(() => {
    if (!isMortgageIntent) return

    const hydrateFrame = window.requestAnimationFrame(() => {
      try {
        const savedDraft = window.localStorage.getItem(mortgageDraftStorageKey)
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft) as {
            step?: number
            values?: Partial<LeadCaptureValues>
          }

          if (parsedDraft.values) {
            setValues((current) => ({
              ...current,
              ...parsedDraft.values,
              address: current.address || parsedDraft.values?.address || '',
              email: current.email || parsedDraft.values?.email || '',
              name: current.name || parsedDraft.values?.name || '',
              phone: current.phone || parsedDraft.values?.phone || '',
            }))
          }

          if (typeof parsedDraft.step === 'number') {
            setMortgageStep(Math.min(Math.max(parsedDraft.step, 1), mortgageTotalSteps))
          }
        }
      } catch {
        // Draft storage can be unavailable or contain stale data. The form still works without it.
      } finally {
        setMortgageDraftHydrated(true)
      }
    })

    return () => window.cancelAnimationFrame(hydrateFrame)
  }, [isMortgageIntent])

  useEffect(() => {
    if (!isMortgageIntent || !mortgageDraftHydrated || state === 'success') return

    try {
      window.localStorage.setItem(
        mortgageDraftStorageKey,
        JSON.stringify({ step: mortgageStep, values }),
      )
    } catch {
      // Autosave is progressive enhancement; submission does not depend on it.
    }
  }, [isMortgageIntent, mortgageDraftHydrated, mortgageStep, state, values])
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

  function resetMortgageDraft(): void {
    setValues({
      ...emptyValues,
      address: searchParams.get('address')?.trim() ?? '',
      email: searchParams.get('email')?.trim() ?? '',
      name: searchParams.get('name')?.trim() ?? '',
      phone: searchParams.get('phone')?.trim() ?? '',
    })
    setMortgageStep(1)
    setErrors({})
    setState('idle')

    try {
      window.localStorage.removeItem(mortgageDraftStorageKey)
    } catch {
      // The form is still reset in memory if storage is unavailable.
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
            currentMortgage: values.currentMortgage,
            detail: values.message,
            documentStatus: values.documentStatus,
            exitPlan: values.exitPlan,
            page: '/intake',
            propertyUse: values.propertyUse,
            propertyValue: values.propertyValue,
            requestedIntent: intent,
            role: values.role,
            situation: values.situation,
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
      if (isMortgageIntent) {
        try {
          window.localStorage.removeItem(mortgageDraftStorageKey)
        } catch {
          // The request is already saved; clearing the local draft is best effort.
        }
      }
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

  if (state === 'success' && isMortgageIntent) {
    return (
      <MortgageIntakeSuccess
        consultationFollowUpHref={consultationFollowUpHref}
        values={values}
        variant={mortgageVariant}
      />
    )
  }

  if (state === 'success') {
    return (
      <main className="fl-intake-page fl-intake-page--success" data-intent={intent}>
        <section className="fl-intake-shell fl-intake-shell--success">
          {isInvestorIntent ? (
            <InvestorBrief copy={copy} compact />
          ) : (
            <BorrowerDossier
              copy={copy}
              dossierItems={dossierItems}
              isMortgageIntent={isMortgageIntent}
              stateLabel="Request received"
            />
          )}

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

  if (isMortgageIntent) {
    return (
      <MortgageIntakeWizard
        errors={errors}
        onReset={resetMortgageDraft}
        onSubmit={handleSubmit}
        setStep={setMortgageStep}
        state={state}
        step={mortgageStep}
        updateField={updateField}
        values={values}
        variant={mortgageVariant}
      />
    )
  }

  return (
    <main className="fl-intake-page" data-intent={intent}>
      <section className="fl-intake-shell">
        {isInvestorIntent ? (
          <InvestorBrief copy={copy} />
        ) : (
          <BorrowerDossier
            copy={copy}
            dossierItems={dossierItems}
            isMortgageIntent={isMortgageIntent}
            stateLabel={copy.kicker}
          />
        )}

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
                {isInvestorIntent ? (
                  <>
                    {/* Investor fit — single-select chip rows. */}
                    <div className="fl-intake-form-section">
                      <div className="fl-intake-section-heading">
                        <span>Investor fit</span>
                        <p>Pick what is closest. Refine the details with a specialist later.</p>
                      </div>
                      <ChipSelector
                        label="Investor type"
                        onSelect={(value) => updateField('role', value)}
                        options={investorTypeOptions}
                        selectedValue={values.role}
                      />
                      <ChipSelector
                        label="Capital range"
                        onSelect={(value) => updateField('amount', value)}
                        options={investorCapitalOptions}
                        selectedValue={values.amount}
                      />
                      <ChipSelector
                        label="Preferred term"
                        onSelect={(value) => updateField('timeline', value)}
                        options={investorTermOptions}
                        selectedValue={values.timeline}
                      />
                    </div>

                    {/* Investment focus — freeform detail. */}
                    <div className="fl-intake-form-section fl-intake-form-section--priority">
                      <div className="fl-intake-section-heading">
                        <span>{copy.detailLabel}</span>
                        <p>Share enough for a focused first conversation.</p>
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
                          Avoid account numbers or sensitive documents. FairLend can explain what is
                          needed after first contact.
                        </FieldDescription>
                        <FieldError className="fl-intake-error">{errors.message}</FieldError>
                      </Field>
                    </div>
                  </>
                ) : (
                  <>
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
                          label={
                            isMortgageIntent ? 'Property address' : 'Property or project address'
                          }
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
                  </>
                )}

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
                    {!isMortgageIntent && !isInvestorIntent ? (
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
                FairLend will use this information to review your request, respond, and identify
                relevant next steps. Submission is not an approval or financing commitment. See our{' '}
                <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>
    </main>
  )
}

function MortgageIntakeSuccess({
  consultationFollowUpHref,
  values,
  variant,
}: {
  consultationFollowUpHref: string
  values: LeadCaptureValues
  variant: MortgageIntakeVariant
}) {
  const successPanel = (
    <Card
      className="fl-mortgage-wizard-panel fl-mortgage-success-panel"
      data-mortgage-variant={variant}
    >
      <div className="fl-mortgage-success-content">
        <div className="fl-mortgage-success-mark" aria-hidden="true">
          <Check />
        </div>
        <p className="fl-mortgage-step-label">Request received</p>
        <h1 id="fl-mortgage-success-title">Your mortgage file is with FairLend.</h1>
        <p className="fl-mortgage-success-lede">
          A specialist can now review the property, amount, timing, and repayment path before the
          next conversation.
        </p>

        <ol className="fl-mortgage-success-route" aria-label="What happens next">
          <li>
            <span>01</span>
            <strong>Review the file</strong>
            <p>FairLend checks the context and identifies the practical financing lane.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Prepare the options</strong>
            <p>A specialist organizes the questions and next documents, if any are needed.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Talk through the next step</strong>
            <p>You get a clear response without having to repeat the file from the beginning.</p>
          </li>
        </ol>

        <div className="fl-mortgage-success-actions">
          <Button asChild className="fl-mortgage-continue">
            <Link href={consultationFollowUpHref}>
              Request a consultation
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild className="fl-mortgage-back" variant="ghost">
            <Link href="/">Return home</Link>
          </Button>
        </div>

        <p className="fl-mortgage-consent">
          FairLend will use these details only to review and respond to your request.
        </p>
      </div>
    </Card>
  )

  if (variant === 'hero') {
    return (
      <div className="fl-mortgage-hero-embed fl-mortgage-hero-embed--success">{successPanel}</div>
    )
  }

  return (
    <main className="fl-mortgage-wizard-page fl-mortgage-wizard-page--success">
      <Frame className="fl-mortgage-wizard-frame">
        <section aria-labelledby="fl-mortgage-success-title" className="fl-mortgage-wizard-stage">
          <MortgageFileVisual step={mortgageTotalSteps} values={values} />
          {successPanel}
        </section>
      </Frame>
    </main>
  )
}

function MortgageIntakeWizard({
  errors,
  onReset,
  onSubmit,
  setStep,
  state,
  step,
  updateField,
  values,
  variant,
}: {
  errors: LeadCaptureErrors
  onReset: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setStep: (step: number) => void
  state: LeadCaptureState
  step: number
  updateField: <Key extends keyof LeadCaptureValues>(
    field: Key,
    value: LeadCaptureValues[Key],
  ) => void
  values: LeadCaptureValues
  variant: MortgageIntakeVariant
}) {
  const [stepError, setStepError] = useState('')
  const previousStep = useRef(step)

  const stepContent = getMortgageStepContent(step)

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step

    const focusFrame = window.requestAnimationFrame(() => {
      const wizardPage = document.querySelector(
        variant === 'hero' ? '.fl-mortgage-hero-embed' : '.fl-mortgage-wizard-page',
      )
      const stepTitle = document.getElementById('fl-mortgage-step-title')
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      wizardPage?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      stepTitle?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [step, variant])

  function choose<Key extends keyof LeadCaptureValues>(
    field: Key,
    value: LeadCaptureValues[Key],
  ): void {
    updateField(field, value)
    setStepError('')
  }

  function moveForward(): void {
    const nextError = validateMortgageStep(step, values)
    if (nextError) {
      setStepError(nextError)
      return
    }

    setStep(Math.min(step + 1, mortgageTotalSteps))
    setStepError('')
  }

  function handleWizardSubmit(event: FormEvent<HTMLFormElement>): void {
    if (step < mortgageTotalSteps) {
      event.preventDefault()
      moveForward()
      return
    }

    void onSubmit(event)
  }

  const RootElement = variant === 'hero' ? 'div' : 'main'

  return (
    <RootElement
      className={variant === 'hero' ? 'fl-mortgage-hero-embed' : 'fl-mortgage-wizard-page'}
      data-step={step}
    >
      <Frame className="fl-mortgage-wizard-frame">
        <section aria-labelledby="fl-mortgage-step-title" className="fl-mortgage-wizard-stage">
          {variant === 'page' ? (
            <MortgageFileVisual step={step} values={values} />
          ) : (
            <div className="fl-mortgage-hero-filebar" aria-live="polite">
              <span>Your mortgage file</span>
              <strong>
                {step === 1
                  ? 'Start with the situation'
                  : `${step - 1} ${step === 2 ? 'section' : 'sections'} complete`}
              </strong>
            </div>
          )}

          <Card className="fl-mortgage-wizard-panel" data-mortgage-variant={variant}>
            <form className="fl-mortgage-wizard-form" noValidate onSubmit={handleWizardSubmit}>
              <div className="fl-mortgage-progress" aria-label={`Step ${step} of 5`}>
                <span>
                  Step {step} of {mortgageTotalSteps}
                </span>
                <span className="fl-mortgage-progress__track" aria-hidden="true">
                  <i style={{ transform: `scaleX(${step / mortgageTotalSteps})` }} />
                </span>
              </div>

              <div className="fl-mortgage-step-copy" key={step}>
                <p className="fl-mortgage-step-label">{stepContent.label}</p>
                <h1 id="fl-mortgage-step-title" tabIndex={-1}>
                  {stepContent.title}
                </h1>
                <p>{stepContent.description}</p>
              </div>

              <div className="fl-mortgage-fields" key={`fields-${step}`}>
                {step === 1 ? (
                  <>
                    <MortgageChoiceGroup
                      label="What would you like this mortgage to solve?"
                      onSelect={(value) => choose('situation', value)}
                      options={mortgageSituationOptions}
                      selectedValue={values.situation}
                    />
                    <Field className="fl-mortgage-field fl-mortgage-situation-context">
                      <FieldLabel htmlFor="mortgage-situation-context">
                        Anything useful to add? <span>Optional</span>
                      </FieldLabel>
                      <Textarea
                        className="fl-mortgage-textarea"
                        id="mortgage-situation-context"
                        onChange={(event) => choose('message', event.target.value)}
                        placeholder="A short note about the deadline, decline, payout, or property."
                        value={values.message}
                      />
                    </Field>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <GoogleAddressAutocomplete
                      autoComplete="street-address"
                      className="fl-mortgage-field fl-mortgage-address"
                      id="mortgage-property-address"
                      inputClassName="fl-mortgage-input"
                      label="Property address"
                      labelClassName="fl-mortgage-field-label"
                      onChange={(value) => choose('address', value)}
                      placeholder="Start typing the property address"
                      value={values.address}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="How is the property used?"
                      onSelect={(value) => choose('propertyUse', value)}
                      options={mortgagePropertyUseOptions}
                      selectedValue={values.propertyUse}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Estimated property value"
                      onSelect={(value) => choose('propertyValue', value)}
                      options={mortgagePropertyValueOptions}
                      selectedValue={values.propertyValue}
                    />
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="How much financing do you need?"
                      onSelect={(value) => choose('amount', value)}
                      options={mortgageAmountRangeOptions}
                      selectedValue={values.amount}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Current mortgage balance"
                      onSelect={(value) => choose('currentMortgage', value)}
                      options={mortgageCurrentBalanceOptions}
                      selectedValue={values.currentMortgage}
                    />
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="When do you need an answer?"
                      onSelect={(value) => choose('timeline', value)}
                      options={mortgageTimelineOptions}
                      selectedValue={values.timeline}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="How do you expect to repay the mortgage?"
                      onSelect={(value) => choose('exitPlan', value)}
                      options={mortgageExitPlanOptions}
                      selectedValue={values.exitPlan}
                    />
                  </>
                ) : null}

                {step === 5 ? (
                  <>
                    <div className="fl-mortgage-contact-grid">
                      <TextField
                        autoComplete="name"
                        error={errors.name}
                        id="mortgage-name"
                        label="Name"
                        onChange={(value) => choose('name', value)}
                        required
                        value={values.name}
                      />
                      <TextField
                        autoComplete="email"
                        error={errors.email}
                        id="mortgage-email"
                        label="Email"
                        onChange={(value) => choose('email', value)}
                        required
                        type="email"
                        value={values.email}
                      />
                      <TextField
                        autoComplete="tel"
                        id="mortgage-phone"
                        label="Phone"
                        onChange={(value) => choose('phone', value)}
                        type="tel"
                        value={values.phone}
                      />
                    </div>
                    <p className="fl-mortgage-consent">
                      FairLend will use these details to review your request and respond with
                      relevant next steps. Submission is not an approval or financing commitment.
                      See our <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
                    </p>
                  </>
                ) : null}
              </div>

              {stepError ? (
                <p className="fl-mortgage-step-error" role="alert">
                  {stepError}
                </p>
              ) : null}

              {state === 'error' ? (
                <p className="fl-mortgage-step-error" role="alert">
                  We could not save the request. Check your connection and try again.
                </p>
              ) : null}

              <div className="fl-mortgage-wizard-actions">
                {step > 1 ? (
                  <Button
                    className="fl-mortgage-back"
                    onClick={() => {
                      setStep(Math.max(step - 1, 1))
                      setStepError('')
                    }}
                    type="button"
                    variant="ghost"
                  >
                    <ArrowLeft aria-hidden="true" />
                    Back
                  </Button>
                ) : (
                  <span aria-hidden="true" />
                )}

                <Button
                  className="fl-mortgage-continue"
                  disabled={state === 'submitting'}
                  type={step === mortgageTotalSteps ? 'submit' : 'button'}
                  onClick={step === mortgageTotalSteps ? undefined : moveForward}
                >
                  {state === 'submitting' ? (
                    <Loader2 aria-hidden="true" className="fl-intake-spinner" />
                  ) : null}
                  {state === 'submitting' ? 'Sending your mortgage file' : stepContent.action}
                  {state !== 'submitting' ? <ArrowRight aria-hidden="true" /> : null}
                </Button>
              </div>

              <div className="fl-mortgage-draft-controls">
                <p className="fl-mortgage-autosave">
                  <CheckCircle2 aria-hidden="true" />
                  Saved automatically on this device
                </p>
                {step > 1 ? (
                  <button className="fl-mortgage-start-over" onClick={onReset} type="button">
                    Start over
                  </button>
                ) : null}
              </div>
            </form>
          </Card>
        </section>
      </Frame>
    </RootElement>
  )
}

function MortgageChoiceGroup({
  compact = false,
  label,
  onSelect,
  options,
  selectedValue,
}: {
  compact?: boolean
  label: string
  onSelect: (value: string) => void
  options: readonly string[]
  selectedValue: string
}) {
  return (
    <fieldset className="fl-mortgage-choice-group">
      <legend>{label}</legend>
      <div className={compact ? 'fl-mortgage-options is-compact' : 'fl-mortgage-options'}>
        {options.map((option) => {
          const isSelected = selectedValue === option

          return (
            <button
              aria-pressed={isSelected}
              className="fl-mortgage-option"
              data-selected={isSelected}
              key={option}
              onClick={() => onSelect(option)}
              type="button"
            >
              <span className="fl-mortgage-option__radio" aria-hidden="true">
                {isSelected ? <i /> : null}
              </span>
              <span>{option}</span>
              {isSelected ? (
                <Check aria-hidden="true" className="fl-mortgage-option__check" />
              ) : null}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function MortgageFileVisual({ step, values }: { step: number; values: LeadCaptureValues }) {
  const stages = [
    { complete: Boolean(values.situation), label: 'Situation', value: values.situation },
    {
      complete: Boolean(values.propertyUse && values.propertyValue),
      label: 'Property',
      value: [values.propertyUse, values.propertyValue].filter(Boolean).join(' · '),
    },
    {
      complete: Boolean(values.amount && values.currentMortgage),
      label: 'Amount',
      value: values.amount,
    },
    {
      complete: Boolean(values.timeline && values.exitPlan),
      label: 'Timing',
      value: values.timeline,
    },
    {
      complete: Boolean(values.name && values.email),
      label: 'Contact',
      value: values.name,
    },
  ]

  const capturedRows = [
    { label: 'Situation', value: values.situation },
    { label: 'Property address', value: values.address },
    { label: 'Property use', value: values.propertyUse },
    { label: 'Estimated value', value: values.propertyValue },
    { label: 'Amount requested', value: values.amount },
    { label: 'Current mortgage', value: values.currentMortgage },
    { label: 'Timing', value: values.timeline },
    { label: 'Expected exit', value: values.exitPlan },
    { label: 'Applicant', value: values.name },
  ].filter((row) => row.value)
  const latestCapturedRow = capturedRows[capturedRows.length - 1]

  return (
    <aside className="fl-mortgage-file-visual" aria-label="Your mortgage file progress">
      <header className="fl-mortgage-file-heading">
        <h2>Your mortgage file</h2>
        <p>File builds as you answer</p>
      </header>

      <ol className="fl-mortgage-file-stages">
        {stages.map((stage, index) => {
          const stageNumber = index + 1
          const isActive = stageNumber === step

          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={isActive ? 'is-active' : stage.complete ? 'is-complete' : undefined}
              key={stage.label}
            >
              <span className="fl-mortgage-file-stage-mark" aria-hidden="true">
                {stage.complete ? <Check /> : stageNumber}
              </span>
              <span>
                <strong>{stage.label}</strong>
                {stage.value ? <small>{stage.value}</small> : null}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="fl-mortgage-file-mobile-summary" aria-live="polite">
        <span>{capturedRows.length} details captured</span>
        <strong>
          {latestCapturedRow
            ? `${latestCapturedRow.label}: ${latestCapturedRow.value}`
            : 'Your answers will collect here as you continue.'}
        </strong>
      </div>

      <div className="fl-mortgage-file-stack" data-step={step}>
        <span
          className="fl-mortgage-file-sheet fl-mortgage-file-sheet--back-3"
          aria-hidden="true"
        />
        <span
          className="fl-mortgage-file-sheet fl-mortgage-file-sheet--back-2"
          aria-hidden="true"
        />
        <span
          className="fl-mortgage-file-sheet fl-mortgage-file-sheet--back-1"
          aria-hidden="true"
        />

        <article
          className="fl-mortgage-file-sheet fl-mortgage-file-sheet--front"
          aria-live="polite"
        >
          <div className="fl-mortgage-file-sheet__head">
            <span>Private mortgage review</span>
            <strong>{String(capturedRows.length).padStart(2, '0')} details captured</strong>
          </div>

          {capturedRows.length > 0 ? (
            <dl className="fl-mortgage-file-rows">
              {capturedRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                  <Check aria-hidden="true" />
                </div>
              ))}
            </dl>
          ) : (
            <p className="fl-mortgage-file-empty">
              Each answer becomes part of the file a specialist reviews.
            </p>
          )}

          <div className="fl-mortgage-file-property-art" data-active={step >= 2}>
            <Image
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 820px) 45vw, 30vw"
              src="/assets/fairlend-build-property-types/single-family-house-engraving.webp"
            />
          </div>

          <footer>
            <span>FairLend</span>
            <span>Updated automatically</span>
          </footer>
        </article>

        <div className="fl-mortgage-file-tabs" aria-hidden="true">
          {stages.map((stage, index) => (
            <span
              className={
                index + 1 === step ? 'is-active' : stage.complete ? 'is-complete' : undefined
              }
              key={stage.label}
            >
              {stage.label}
            </span>
          ))}
        </div>
      </div>

      <p className="fl-mortgage-file-note">
        <ShieldCheck aria-hidden="true" />
        No documents needed right now.
      </p>
    </aside>
  )
}

function getMortgageStepContent(step: number): {
  action: string
  description: string
  label: string
  title: string
} {
  const content = [
    {
      action: 'Continue to property',
      description: 'Choose the closest answer. You can add context without writing an essay.',
      label: 'Situation',
      title: 'What would you like this mortgage to solve?',
    },
    {
      action: 'Continue to mortgage amount',
      description: 'Approximate answers are fine. A specialist can confirm the details later.',
      label: 'Property details',
      title: 'Tell us about the property.',
    },
    {
      action: 'Continue to timing',
      description: 'Ranges are enough for this review. Exact statements can come later.',
      label: 'Mortgage amount',
      title: 'What does the financing need to cover?',
    },
    {
      action: 'Continue to contact',
      description: 'Timing and the repayment path help FairLend structure practical options.',
      label: 'Timing and exit',
      title: 'When do you need an answer?',
    },
    {
      action: 'Review my mortgage options',
      description: 'A mortgage specialist will use the file you built to prepare the next step.',
      label: 'Contact',
      title: 'Where should FairLend reach you?',
    },
  ] as const

  return content[Math.min(Math.max(step, 1), mortgageTotalSteps) - 1]
}

function validateMortgageStep(step: number, values: LeadCaptureValues): string {
  if (step === 1 && !values.situation) {
    return 'Choose the closest reason for the mortgage so we can build the right file.'
  }

  if (step === 2 && (!values.propertyUse || !values.propertyValue)) {
    return 'Choose the property use and approximate value. The address can be added later.'
  }

  if (step === 3 && (!values.amount || !values.currentMortgage)) {
    return 'Choose an amount range and the closest current mortgage balance.'
  }

  if (step === 4 && (!values.timeline || !values.exitPlan)) {
    return 'Choose the timing and the most likely repayment path.'
  }

  return ''
}

/**
 * Investor brief — the left rail of the investor intake. Carries the
 * editorial copy plus a "reporting preview" dossier card that mirrors the
 * portal mock on the investor landing page, so the page that sent the user
 * here reads continuously into this one.
 */
function InvestorBrief({ copy, compact = false }: { copy: IntakeCopy; compact?: boolean }) {
  return (
    <aside className="fl-intake-investor" aria-label="FairLend investor inquiry context">
      <div className="fl-intake-kicker">
        <span aria-hidden="true" />
        {copy.kicker}
      </div>
      <h1>{copy.title}</h1>
      <p className="fl-intake-lede">{copy.description}</p>

      {!compact ? (
        <div className="fl-intake-preview" data-investor-portal-mock>
          <header className="fl-intake-preview__head">
            <div className="fl-intake-preview__title-cluster">
              <span className="fl-intake-preview__eyebrow">Reporting preview</span>
              <span className="fl-intake-preview__file">Illustrative mortgage file</span>
            </div>
            <div className="fl-intake-preview__stat-line">
              <span className="fl-intake-preview__stat">
                <strong>~$2B</strong>
                <em>funded</em>
              </span>
              <span className="fl-intake-preview__stat">
                <strong>~30 yrs</strong>
                <em>GTA</em>
              </span>
            </div>
          </header>

          <div className="fl-intake-preview__deal">
            <div className="fl-intake-preview__deal-top">
              <span className="fl-intake-preview__deal-stamp">Preview · first mortgage</span>
              <span className="fl-intake-preview__deal-chip">
                <span aria-hidden="true" className="fl-intake-preview__deal-chip-dot" />
                Disbursement tracked
              </span>
            </div>
            <dl className="fl-intake-preview__rows">
              {investorPreviewRows.map((row) => (
                <div className="fl-intake-preview__row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="fl-intake-preview__payment" aria-label="PAD collection status timeline">
              <span className="fl-intake-preview__payment-label">PAD collection</span>
              <div className="fl-intake-preview__payment-track">
                <span className="fl-intake-preview__payment-segment is-paid" title="Paid" />
                <span className="fl-intake-preview__payment-segment is-paid" title="Paid" />
                <span className="fl-intake-preview__payment-segment is-paid" title="Paid" />
                <span className="fl-intake-preview__payment-segment is-current" title="Current" />
                <span className="fl-intake-preview__payment-segment" title="Scheduled" />
                <span className="fl-intake-preview__payment-segment" title="Scheduled" />
              </div>
            </div>
          </div>

          <footer className="fl-intake-preview__foot">
            <span className="fl-intake-preview__foot-item">
              <Check aria-hidden="true" size={14} strokeWidth={2.4} />
              Tax-ready export context
            </span>
            <span className="fl-intake-preview__foot-cta">
              Preview file
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2.25} />
            </span>
          </footer>
        </div>
      ) : null}

      <ul className="fl-intake-protection" aria-label="What sits behind every FairLend opportunity">
        {investorProtectionPoints.map((point) => (
          <li className="fl-intake-protection-item" key={point}>
            <span aria-hidden="true" className="fl-intake-protection-mark" />
            {point}
          </li>
        ))}
      </ul>

      {!compact ? (
        <ol className="fl-intake-investor-route" aria-label="Investor review route">
          {investorRoute.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      ) : null}

      <p className="fl-intake-risk-line">
        Private mortgage investments involve risk and are not bank deposits or guaranteed-return
        products. FairLend reviews investor fit before presenting opportunities.
      </p>
    </aside>
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
      )}

      <ol className="fl-intake-review-route" aria-label="Private mortgage review route">
        {reviewRoute.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
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

/**
 * Single-select chip selector used for the investor fit questions.
 * Accessible: each chip is a toggle button with aria-pressed reflecting state.
 */
function ChipSelector({
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
    <div className="fl-intake-chip-selector">
      <span className="fl-intake-chip-selector__label">{label}</span>
      <div className="fl-intake-chip-row fl-intake-chip-row--wrap" role="group" aria-label={label}>
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
