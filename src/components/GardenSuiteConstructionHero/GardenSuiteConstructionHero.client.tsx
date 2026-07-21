'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  LockKeyhole,
  Minus,
  Nut,
  Phone,
  X,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactElement,
} from 'react'

import { Logo } from '@/components/Logo/Logo'
import {
  FAIRLEND_CONTACT_PHONE_HREF,
  FAIRLEND_CONTACT_PHONE_LABEL,
} from '@/components/FairlendTalkToExpertCta'
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
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'

import { GardenSuiteExperienceMarquee } from './GardenSuiteExperienceMarquee'

type PanelPhase = 'closed' | 'hoisting' | 'aligned'
type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type AssessmentStep = 0 | 1 | 2

type AssessmentValues = {
  address: string
  amount: string
  email: string
  name: string
  phone: string
  stage: string
  timeline: string
}

type AssessmentErrors = Partial<Record<keyof AssessmentValues, string>>

const EMPTY_VALUES: AssessmentValues = {
  address: '',
  amount: '',
  email: '',
  name: '',
  phone: '',
  stage: '',
  timeline: '',
}

const STAGES = [
  { label: 'Exploring feasibility', value: 'feasibility' },
  { label: 'Design or permits underway', value: 'design-permits' },
  { label: 'Construction-ready', value: 'construction-ready' },
  { label: 'Construction has started', value: 'in-construction' },
] as const

const TIMELINES = [
  { label: 'As soon as possible', value: 'asap' },
  { label: 'Within 3 months', value: '0-3-months' },
  { label: 'Within 3–6 months', value: '3-6-months' },
  { label: 'More than 6 months', value: '6-plus-months' },
] as const

const ASSESSMENT_STEPS = [
  { fields: ['address', 'stage'], key: 'project', label: 'Project' },
  { fields: ['amount', 'timeline'], key: 'financing', label: 'Financing' },
  { fields: ['name', 'phone', 'email'], key: 'contact', label: 'Contact' },
] as const satisfies ReadonlyArray<{
  fields: ReadonlyArray<keyof AssessmentValues>
  key: string
  label: string
}>

const STATIC_LAYOUT_QUERY =
  '(prefers-reduced-motion: reduce), (min-width: 721px) and (max-width: 1599px)'
const MOBILE_ASSESSMENT_QUERY = '(max-width: 720px)'
const HOIST_DELAY_MS = 600
const HOIST_DURATION_MS = 1600

function subscribeToStaticLayout(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(STATIC_LAYOUT_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getStaticLayoutSnapshot(): boolean {
  return window.matchMedia(STATIC_LAYOUT_QUERY).matches
}

function getServerStaticLayoutSnapshot(): boolean {
  return false
}

function subscribeToMobileAssessment(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(MOBILE_ASSESSMENT_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getMobileAssessmentSnapshot(): boolean {
  return window.matchMedia(MOBILE_ASSESSMENT_QUERY).matches
}

function getServerMobileAssessmentSnapshot(): boolean {
  return false
}

function validateFields(
  values: AssessmentValues,
  fields: ReadonlyArray<keyof AssessmentValues>,
): AssessmentErrors {
  const errors: AssessmentErrors = {}

  if (fields.includes('address') && !values.address.trim()) {
    errors.address = 'Enter the property address or postal code.'
  }
  if (fields.includes('stage') && !values.stage) {
    errors.stage = 'Choose the current project stage.'
  }
  if (fields.includes('name') && !values.name.trim()) {
    errors.name = 'Enter your name.'
  }
  if (fields.includes('phone') && !values.phone.trim()) {
    errors.phone = 'Enter a phone number.'
  } else if (fields.includes('phone') && values.phone.replace(/[^0-9]/g, '').length < 10) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (fields.includes('email') && !values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (fields.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

function validate(values: AssessmentValues): AssessmentErrors {
  return validateFields(values, ['address', 'stage', 'name', 'phone', 'email'])
}

function validateStep(values: AssessmentValues, step: AssessmentStep): AssessmentErrors {
  return validateFields(values, ASSESSMENT_STEPS[step].fields)
}

function FieldError({ id, message }: { id: string; message?: string }): ReactElement | null {
  if (!message) return null
  return (
    <span className="gsc-assessment__error" id={id} role="alert">
      {message}
    </span>
  )
}

export function GardenSuiteConstructionHero(): ReactElement {
  const [panelPhase, setPanelPhase] = useState<PanelPhase>('hoisting')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [values, setValues] = useState<AssessmentValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<AssessmentErrors>({})
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>(0)
  const panelRef = useRef<HTMLElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const stepStatusRef = useRef<HTMLParagraphElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const motionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusAfterHoistRef = useRef(false)
  const hasTrackedStartRef = useRef(false)
  const usesStaticLayout = useSyncExternalStore(
    subscribeToStaticLayout,
    getStaticLayoutSnapshot,
    getServerStaticLayoutSnapshot,
  )
  const usesMobileAssessment = useSyncExternalStore(
    subscribeToMobileAssessment,
    getMobileAssessmentSnapshot,
    getServerMobileAssessmentSnapshot,
  )

  useEffect(() => {
    if (usesStaticLayout || panelPhase !== 'hoisting') return

    motionTimerRef.current = setTimeout(() => {
      setPanelPhase('aligned')
      if (focusAfterHoistRef.current) {
        focusAfterHoistRef.current = false
        requestAnimationFrame(() => firstInputRef.current?.focus({ preventScroll: true }))
      }
    }, HOIST_DELAY_MS + HOIST_DURATION_MS)

    return () => {
      if (motionTimerRef.current) window.clearTimeout(motionTimerRef.current)
    }
  }, [panelPhase, usesStaticLayout])

  function updateField<K extends keyof AssessmentValues>(
    field: K,
    value: AssessmentValues[K],
  ): void {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function trackStart(): void {
    if (hasTrackedStartRef.current) return
    hasTrackedStartRef.current = true
    trackFairlendEvent('fairlend_intake_started', {
      form_id: 'garden_suite_project_assessment',
      journey_type: 'homeowner_garden_suite',
      source: 'garden-suite-financing-gta',
    })
  }

  function openAssessment(): void {
    if (panelPhase !== 'closed') {
      panelRef.current?.scrollIntoView({
        behavior: usesStaticLayout ? 'auto' : 'smooth',
        block: 'end',
      })
      if (panelPhase === 'aligned') firstInputRef.current?.focus({ preventScroll: true })
      return
    }

    if (usesStaticLayout) {
      setPanelPhase('aligned')
      requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
        firstInputRef.current?.focus({ preventScroll: true })
      })
      return
    }

    focusAfterHoistRef.current = true
    setPanelPhase('hoisting')
  }

  function closeAssessment(): void {
    if (motionTimerRef.current) window.clearTimeout(motionTimerRef.current)
    focusAfterHoistRef.current = false
    setPanelPhase('closed')
    requestAnimationFrame(() => openButtonRef.current?.focus({ preventScroll: true }))
  }

  function focusStepStatus(): void {
    requestAnimationFrame(() => stepStatusRef.current?.focus({ preventScroll: true }))
  }

  function focusFirstError(validationErrors: AssessmentErrors): void {
    const firstInvalidField = Object.keys(validationErrors)[0] as keyof AssessmentValues | undefined
    if (!firstInvalidField) return
    requestAnimationFrame(() => {
      document.getElementById(`garden-suite-${firstInvalidField}`)?.focus({ preventScroll: true })
    })
  }

  function trackValidationFailure(step: AssessmentStep | null): void {
    trackFairlendEvent('fairlend_intake_validation_failed', {
      form_id: 'garden_suite_project_assessment',
      journey_type: 'homeowner_garden_suite',
      source: 'garden-suite-financing-gta',
      step_key: step === null ? 'project-assessment' : ASSESSMENT_STEPS[step].key,
      step_number: step === null ? 1 : step + 1,
      total_steps: step === null ? 1 : ASSESSMENT_STEPS.length,
    })
  }

  function moveToAssessmentStep(nextStep: AssessmentStep): void {
    setAssessmentStep(nextStep)
    focusStepStatus()
  }

  function setCurrentStepErrors(step: AssessmentStep, validationErrors: AssessmentErrors): void {
    setErrors((current) => {
      const nextErrors = { ...current }
      ASSESSMENT_STEPS[step].fields.forEach((field) => delete nextErrors[field])
      return { ...nextErrors, ...validationErrors }
    })
  }

  function handleNextStep(): void {
    const validationErrors = validateStep(values, assessmentStep)
    if (Object.keys(validationErrors).length > 0) {
      setCurrentStepErrors(assessmentStep, validationErrors)
      trackValidationFailure(assessmentStep)
      focusFirstError(validationErrors)
      return
    }

    if (assessmentStep < ASSESSMENT_STEPS.length - 1) {
      moveToAssessmentStep((assessmentStep + 1) as AssessmentStep)
    }
  }

  function handlePreviousStep(): void {
    if (assessmentStep > 0) moveToAssessmentStep((assessmentStep - 1) as AssessmentStep)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const validationErrors = usesMobileAssessment
      ? validateStep(values, assessmentStep)
      : validate(values)

    if (Object.keys(validationErrors).length > 0) {
      if (usesMobileAssessment) {
        setCurrentStepErrors(assessmentStep, validationErrors)
      } else {
        setErrors(validationErrors)
      }
      trackValidationFailure(usesMobileAssessment ? assessmentStep : null)
      focusFirstError(validationErrors)
      return
    }

    if (usesMobileAssessment && assessmentStep < ASSESSMENT_STEPS.length - 1) {
      handleNextStep()
      return
    }

    setSubmitState('submitting')
    setErrors({})

    const leadId =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
      `garden-suite-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          analyticsContext: getAnalyticsContext(),
          address: values.address,
          email: values.email,
          id: leadId,
          intent: 'garden-suite-financing',
          intake: {
            amountNeeded: values.amount,
            page: '/garden-suite-financing-gta',
            projectStage: values.stage,
            projectType: 'garden-suite',
            timeline: values.timeline,
          },
          name: values.name,
          phone: values.phone,
          source: 'garden-suite-financing-gta',
          status: 'submitted',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) throw new Error(`Lead POST failed: ${response.status}`)

      const payload = (await response.json()) as LeadSubmissionResponse
      setSubmitState('success')
      setValues(EMPTY_VALUES)
      setAssessmentStep(0)
      completeLeadAnalytics(payload, {
        completion_status: 'complete',
        form_id: 'garden_suite_project_assessment',
        journey_type: 'homeowner_garden_suite',
        source: 'garden-suite-financing-gta',
      })
    } catch (error) {
      console.error('Garden suite project assessment submission failed', error)
      setSubmitState('error')
      trackLeadFailed({
        form_id: 'garden_suite_project_assessment',
        journey_type: 'homeowner_garden_suite',
        source: 'garden-suite-financing-gta',
      })
    }
  }

  const visualPhase: PanelPhase = usesStaticLayout ? 'aligned' : panelPhase
  const isOpen = visualPhase !== 'closed'

  return (
    <div className="gsc-hero">
      <div aria-hidden="true" className="gsc-hero__scene">
        <picture>
          <source
            media="(max-width: 720px)"
            srcSet="/assets/garden-suite/garden-suite-construction-hero-mobile-v2.webp"
          />
          <source
            media="(min-width: 1100px)"
            srcSet="/assets/garden-suite/garden-suite-construction-hero-21x10-2k-clean.webp"
          />
          <Image
            alt=""
            className="gsc-hero__scene-image"
            fill
            priority
            sizes="100vw"
            src="/assets/garden-suite/garden-suite-construction-hero-16x9-2k-clean.webp"
          />
        </picture>
      </div>
      <div aria-hidden="true" className="gsc-hero__wash" />
      <div aria-hidden="true" className="gsc-hero__survey-grid" />

      <header className="gsc-hero__header">
        <Link aria-label="FairLend Mortgage home" className="gsc-hero__brand" href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <div className="gsc-hero__desk">
          <span>Construction financing desk</span>
          <a href={FAIRLEND_CONTACT_PHONE_HREF}>
            <Phone aria-hidden="true" />
            {FAIRLEND_CONTACT_PHONE_LABEL}
          </a>
        </div>
      </header>

      <section aria-labelledby="garden-suite-hero-title" className="gsc-hero__content">
        <div className="gsc-hero__eyebrow">
          <span>Toronto &amp; GTA Garden and Laneway Suites</span>
          <span aria-hidden="true">/</span>
          <span>Powered by DrawFlow</span>
        </div>

        <h1 id="garden-suite-hero-title">
          Garden Suite Financing
          <span>in Toronto, From First Plan to Final Mortgage</span>
        </h1>

        <p className="gsc-hero__lede">
          FairLend keeps your build plan and financing plan working together. We help you choose the
          right funding, plan milestone draws, coordinate the information lenders need and prepare
          the final mortgage—all through one team.
        </p>

        <div className="gsc-hero__actions">
          <Button
            aria-controls="garden-suite-assessment"
            aria-expanded={isOpen}
            className="gsc-hero__primary-action"
            data-analytics-cta-id="garden-suite-plan-project"
            data-analytics-cta-location="section-1-hero"
            data-analytics-source="garden-suite-financing-gta"
            onClick={openAssessment}
            ref={openButtonRef}
            size="clear"
            type="button"
          >
            Plan My Garden Suite Financing
            <ArrowDown aria-hidden="true" />
          </Button>
          <a
            className="gsc-hero__call-action"
            data-analytics-cta-id="garden-suite-see-project-path"
            data-analytics-cta-location="section-1-hero"
            data-analytics-source="garden-suite-financing-gta"
            href="#section-3"
          >
            See How the Process Works
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <p className="gsc-hero__reassurance">
          <strong>No builder yet?</strong> Start with the property, budget and goal. FairLend can
          help you identify the professionals you need and how to finance each stage.
        </p>

        <div aria-label="Financing route" className="gsc-hero__route">
          <span>Plan</span>
          <Minus aria-hidden="true" />
          <span>Finance</span>
          <Minus aria-hidden="true" />
          <span>Build</span>
          <Minus aria-hidden="true" />
          <span>Final mortgage</span>
        </div>
      </section>

      <div className="gsc-hero__proof-wrap">
        <ul
          aria-label="Garden Suite financing experience and DrawFlow proof"
          className="gsc-hero__proof"
        >
          <li>
            <strong>28 years</strong>
            <span>Mortgage-broker experience</span>
            <small>Principal Broker</small>
          </li>
          <li>
            <strong>30 years</strong>
            <span>Construction experience</span>
            <small>Principal Broker</small>
          </li>
          <li>
            <strong>10+ years</strong>
            <span>Specialist legal experience</span>
            <small>In-house legal team</small>
          </li>
          <li>
            <strong>Up to 15</strong>
            <span>Milestone draws</span>
            <small>Every DrawFlow facility</small>
          </li>
          <li>
            <strong>Up to 50%</strong>
            <span>Interest savings demonstrated</span>
            <small>Case studies · see methodology</small>
          </li>
        </ul>
        <GardenSuiteExperienceMarquee />
        <p className="gsc-hero__mobile-product-proof">
          <strong>Up to 15 milestone draws</strong>
          <span>Interest only on funds advanced</span>
        </p>
        <p className="gsc-hero__trust">
          Fairlend Management Inc. o/a FairLend Mortgage · FSRA Mortgage Brokerage Licence #13827
        </p>
      </div>

      <div aria-hidden="true" className="gsc-hero__dimension">
        <span>GS–FIN / 01</span>
        <i />
        <span>Project capital path</span>
      </div>

      <section
        aria-label="Garden suite project assessment"
        className="gsc-assessment"
        data-open={isOpen}
        data-phase={visualPhase}
        id="garden-suite-assessment"
        ref={panelRef}
      >
        <div aria-hidden="true" className="gsc-assessment__rigging" />
        <div aria-hidden="true" className="gsc-assessment__mounts">
          <span className="gsc-assessment__mount gsc-assessment__mount--primary">
            <Nut />
          </span>
          <span className="gsc-assessment__mount gsc-assessment__mount--secondary">
            <Nut />
          </span>
        </div>

        <div className="gsc-assessment__card">
          <button
            aria-controls="garden-suite-assessment"
            aria-expanded={isOpen}
            className="gsc-assessment__tab"
            disabled={isOpen}
            onClick={isOpen ? undefined : openAssessment}
            type="button"
          >
            <span className="gsc-assessment__tab-index">FILE / GS–01</span>
            <strong>Project review</strong>
            <span className="gsc-assessment__tab-action">
              {visualPhase === 'closed'
                ? 'Open review'
                : visualPhase === 'hoisting'
                  ? 'Opening'
                  : 'Ready'}
              {visualPhase === 'aligned' ? (
                <Check aria-hidden="true" />
              ) : (
                <ChevronDown aria-hidden="true" />
              )}
            </span>
          </button>

          <div className="gsc-assessment__body">
            <div className="gsc-assessment__heading">
              <div>
                <p>Private, no-obligation project review</p>
                <h2>Tell us about your Garden Suite.</h2>
              </div>
              <div className="gsc-assessment__heading-actions">
                <span className="gsc-assessment__verified">
                  <Check aria-hidden="true" /> File aligned
                </span>
                <Button
                  aria-label="Lower project assessment"
                  className="gsc-assessment__close"
                  onClick={closeAssessment}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
            </div>

            {submitState === 'success' ? (
              <div className="gsc-assessment__success" role="status">
                <CheckCircle2 aria-hidden="true" />
                <p>Project details received</p>
                <h3>A Garden Suite specialist will review your project.</h3>
                <span>
                  We will review the property, project stage, financing need and timing before
                  getting in touch.
                </span>
                <Button
                  className="gsc-assessment__secondary-button"
                  onClick={() => {
                    setAssessmentStep(0)
                    setSubmitState('idle')
                  }}
                  size="clear"
                  type="button"
                  variant="outline"
                >
                  Start another review
                </Button>
              </div>
            ) : (
              <form
                aria-describedby={submitState === 'error' ? 'garden-suite-form-status' : undefined}
                className="gsc-assessment__form"
                noValidate
                onFocusCapture={trackStart}
                onSubmit={handleSubmit}
              >
                {submitState === 'error' && (
                  <p className="gsc-assessment__alert" id="garden-suite-form-status" role="alert">
                    The file did not send. Check your connection and try again, or call{' '}
                    <a href={FAIRLEND_CONTACT_PHONE_HREF}>{FAIRLEND_CONTACT_PHONE_LABEL}</a>.
                  </p>
                )}

                <div
                  aria-label="Project review progress"
                  className="gsc-assessment__progress"
                  role="group"
                >
                  <p aria-live="polite" ref={stepStatusRef} tabIndex={-1}>
                    Step {assessmentStep + 1} of {ASSESSMENT_STEPS.length}:{' '}
                    <strong>{ASSESSMENT_STEPS[assessmentStep].label}</strong>
                  </p>
                  <ol>
                    {ASSESSMENT_STEPS.map((step, index) => (
                      <li
                        aria-current={assessmentStep === index ? 'step' : undefined}
                        data-complete={assessmentStep > index}
                        key={step.key}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {step.label}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="gsc-assessment__grid">
                  <div
                    aria-labelledby="garden-suite-project-group-label"
                    className="gsc-assessment__step"
                    data-step-active={assessmentStep === 0}
                    data-step="project"
                    role="group"
                  >
                    <p
                      className="gsc-assessment__step-label"
                      id="garden-suite-project-group-label"
                    >
                      01 / Project
                    </p>
                    <div className="gsc-assessment__field gsc-assessment__field--address">
                      <Label htmlFor="garden-suite-address">Address or postal code *</Label>
                      <Input
                        aria-describedby={errors.address ? 'garden-suite-address-error' : undefined}
                        aria-invalid={Boolean(errors.address)}
                        autoComplete="street-address"
                        id="garden-suite-address"
                        onChange={(event) => updateField('address', event.target.value)}
                        placeholder="123 Main St, Toronto"
                        ref={firstInputRef}
                        value={values.address}
                      />
                      <FieldError id="garden-suite-address-error" message={errors.address} />
                    </div>

                    <div className="gsc-assessment__field">
                      <Label htmlFor="garden-suite-stage">Project stage *</Label>
                      <Select
                        onValueChange={(value) => updateField('stage', value)}
                        value={values.stage}
                      >
                        <SelectTrigger
                          aria-describedby={errors.stage ? 'garden-suite-stage-error' : undefined}
                          aria-invalid={Boolean(errors.stage)}
                          id="garden-suite-stage"
                        >
                          <SelectValue placeholder="Choose a stage" />
                        </SelectTrigger>
                        <SelectContent className="gsc-assessment__select-content">
                          {STAGES.map((stage) => (
                            <SelectItem
                              className="gsc-assessment__select-item"
                              key={stage.value}
                              value={stage.value}
                            >
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError id="garden-suite-stage-error" message={errors.stage} />
                    </div>
                  </div>

                  <div
                    aria-labelledby="garden-suite-financing-group-label"
                    className="gsc-assessment__step"
                    data-step-active={assessmentStep === 1}
                    data-step="financing"
                    role="group"
                  >
                    <p
                      className="gsc-assessment__step-label"
                      id="garden-suite-financing-group-label"
                    >
                      02 / Financing
                    </p>
                    <div className="gsc-assessment__field">
                      <Label htmlFor="garden-suite-amount">Estimated financing needed</Label>
                      <Input
                        id="garden-suite-amount"
                        inputMode="decimal"
                        onChange={(event) => updateField('amount', event.target.value)}
                        placeholder="$250,000"
                        value={values.amount}
                      />
                    </div>

                    <div className="gsc-assessment__field">
                      <Label htmlFor="garden-suite-timeline">Target start</Label>
                      <Select
                        onValueChange={(value) => updateField('timeline', value)}
                        value={values.timeline}
                      >
                        <SelectTrigger id="garden-suite-timeline">
                          <SelectValue placeholder="Choose timing" />
                        </SelectTrigger>
                        <SelectContent className="gsc-assessment__select-content">
                          {TIMELINES.map((timeline) => (
                            <SelectItem
                              className="gsc-assessment__select-item"
                              key={timeline.value}
                              value={timeline.value}
                            >
                              {timeline.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div
                    aria-labelledby="garden-suite-contact-group-label"
                    className="gsc-assessment__step"
                    data-step-active={assessmentStep === 2}
                    data-step="contact"
                    role="group"
                  >
                    <p
                      className="gsc-assessment__step-label"
                      id="garden-suite-contact-group-label"
                    >
                      03 / Contact
                    </p>
                    <div className="gsc-assessment__field">
                      <Label htmlFor="garden-suite-name">Full name *</Label>
                      <Input
                        aria-describedby={errors.name ? 'garden-suite-name-error' : undefined}
                        aria-invalid={Boolean(errors.name)}
                        autoComplete="name"
                        id="garden-suite-name"
                        onChange={(event) => updateField('name', event.target.value)}
                        value={values.name}
                      />
                      <FieldError id="garden-suite-name-error" message={errors.name} />
                    </div>

                    <div className="gsc-assessment__field">
                      <Label htmlFor="garden-suite-phone">Phone *</Label>
                      <Input
                        aria-describedby={errors.phone ? 'garden-suite-phone-error' : undefined}
                        aria-invalid={Boolean(errors.phone)}
                        autoComplete="tel"
                        id="garden-suite-phone"
                        inputMode="tel"
                        onChange={(event) => updateField('phone', event.target.value)}
                        value={values.phone}
                      />
                      <FieldError id="garden-suite-phone-error" message={errors.phone} />
                    </div>

                    <div className="gsc-assessment__field gsc-assessment__field--email">
                      <Label htmlFor="garden-suite-email">Email *</Label>
                      <Input
                        aria-describedby={errors.email ? 'garden-suite-email-error' : undefined}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="email"
                        id="garden-suite-email"
                        inputMode="email"
                        onChange={(event) => updateField('email', event.target.value)}
                        value={values.email}
                      />
                      <FieldError id="garden-suite-email-error" message={errors.email} />
                    </div>
                  </div>
                </div>

                <div className="gsc-assessment__step-actions">
                  {assessmentStep > 0 && (
                    <Button
                      className="gsc-assessment__step-button gsc-assessment__step-button--back"
                      onClick={handlePreviousStep}
                      size="clear"
                      type="button"
                      variant="outline"
                    >
                      <ArrowLeft aria-hidden="true" />
                      Back
                    </Button>
                  )}
                  {assessmentStep < ASSESSMENT_STEPS.length - 1 && (
                    <Button
                      className="gsc-assessment__step-button gsc-assessment__step-button--next"
                      onClick={handleNextStep}
                      size="clear"
                      type="button"
                    >
                      Next
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  )}
                </div>

                <div
                  className="gsc-assessment__footer"
                  data-mobile-final={assessmentStep === ASSESSMENT_STEPS.length - 1}
                >
                  <span>
                    <LockKeyhole aria-hidden="true" /> Private, no obligation · Specialist follow-up
                    after review
                  </span>
                  <Button
                    className="gsc-assessment__submit"
                    disabled={submitState === 'submitting'}
                    size="clear"
                    type="submit"
                  >
                    {submitState === 'submitting' ? (
                      <>
                        <Loader2 aria-hidden="true" className="gsc-assessment__spinner" />
                        Sending project details
                      </>
                    ) : (
                      <>
                        Send for review
                        <ArrowUpRight aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
