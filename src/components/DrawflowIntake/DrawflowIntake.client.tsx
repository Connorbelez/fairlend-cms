'use client'

import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  FilePenLine,
  FileText,
  House,
  Landmark,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import type { CSSProperties, ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import './buildpath.css'

import { GoogleAddressAutocomplete } from '@/components/address/GoogleAddressAutocomplete'
import { FairlendBuildModelSection } from '@/components/FairlendBuildModelSection'
import { FairlendApplicationChoiceChips } from '@/components/FairlendLandingHero/FairlendApplicationChoiceChips.client'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { BrutalistCtaButton } from '@/components/ui/brutalist-cta-button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Frame } from '@/components/ui/frame'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SelectableChip } from '@/components/ui/selectable-chip'
import { Slider } from '@/components/ui/slider'
import {
  buildFairlendIntakeHref,
  fairlendProjectScopeOptions,
  getFairlendProjectScopeLabel,
  type FairlendBuildIntakeVariant,
} from '@/lib/fairlend-intake'
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'

const intakeAssetBase = '/assets/drawflow-intake'
const buildProgressFinishedImage = `${intakeAssetBase}/Build Progress Finished-optimized.webp`
const buildProgressFoundationImage = `${intakeAssetBase}/Build Progress Foundation-optimized.webp`
const buildProgressLotImage = `${intakeAssetBase}/Build Progress Lot-optimized.webp`
const buildProgressPolishedImage = `${intakeAssetBase}/Build Progress Polished-optimized.webp`
const buildProgressStructureImage = `${intakeAssetBase}/Build Progress Structure-optimized.webp`
const blueprintImage = `${intakeAssetBase}/Landing Page Blueprint.webp`
const backgroundImage = `${intakeAssetBase}/Landing Page Hero Background.webp`
const multiplexImage = `${intakeAssetBase}/Multiplex Transparent Asset.webp`
const sitePlanBlueprintFieldImage = `${intakeAssetBase}/Property Site Plan Blueprint Field-optimized.webp`
const sitePlanForegroundImage = `${intakeAssetBase}/Property Site Plan Foreground-optimized.webp`

const trustItems = [
  {
    icon: ShieldCheck,
    label: 'No credit check',
  },
  {
    icon: ClipboardList,
    label: 'No documents required',
  },
  {
    icon: Clock3,
    label: 'Takes about 2 minutes',
  },
] as const

const TOTAL_STEPS = 6
const HOMEOWNER_TOTAL_STEPS = 3
const builderStepKeys = [
  'route',
  'project_site',
  'build_profile',
  'financing_path',
  'capital_snapshot',
  'contact',
] as const
const homeownerStepKeys = ['property_suite', 'financing_readiness', 'contact'] as const
const gardenSuiteProjectScopeLabel =
  getFairlendProjectScopeLabel('garden-laneway-suites') || 'Garden & laneway suites'

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7
type HomeownerStep = 1 | 2 | 3 | 4

interface IntakeAnswers {
  address: string
  borrowerEquity: string
  borrowerExperience: string
  buildPermitFileName: string
  buildType: string
  contactRole: string
  email: string
  financingNeeds: string[]
  financingTimeline: string
  name: string
  notes: string
  phone: string
  projectScope: string
  projectCost: string
  projectStage: string
  projectTeam: string[]
  requestedLoan: string
  siteControl: string
  termsAccepted: boolean
  unitCount: string
}

interface HomeownerIntakeAnswers {
  address: string
  approximateEquity: string
  email: string
  financingNeeds: string[]
  name: string
  notes: string
  occupancy: string
  phone: string
  projectScope: string
  projectStage: string
  siteControl: string
  suiteType: string
  termsAccepted: boolean
  timeline: string
}

interface StepVisual {
  image: string
  label: string
  summary: string[]
  title: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => {
    finished: Promise<void>
  }
}

function runIntakeStepTransition(update: () => void): void {
  if (typeof document === 'undefined') {
    update()
    return
  }

  const startViewTransition = (document as ViewTransitionDocument).startViewTransition

  if (typeof startViewTransition !== 'function') {
    update()
    return
  }

  startViewTransition.call(document, () => {
    flushSync(update)
  })
}

function scrollToBuildPathSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const defaultAnswers: IntakeAnswers = {
  address: '',
  buildPermitFileName: '',
  siteControl: '',
  buildType: 'Multi-plex',
  unitCount: '5-6',
  projectStage: 'Permit submitted',
  financingNeeds: ['Construction financing', 'Bridge to CMHC financing'],
  financingTimeline: '31-60 days',
  requestedLoan: '$2.5M-$5M',
  projectCost: '$5M-$10M',
  borrowerEquity: '$1M-$2.5M',
  projectTeam: [],
  borrowerExperience: '',
  contactRole: '',
  termsAccepted: false,
  name: '',
  email: '',
  phone: '',
  projectScope: '',
  notes: '',
}

const defaultHomeownerAnswers: HomeownerIntakeAnswers = {
  address: '',
  approximateEquity: '',
  email: '',
  financingNeeds: [],
  name: '',
  notes: '',
  occupancy: '',
  phone: '',
  projectScope: gardenSuiteProjectScopeLabel,
  projectStage: '',
  siteControl: '',
  suiteType: '',
  termsAccepted: false,
  timeline: '',
}

const intakeStorageKey = 'build-financing-intake'
const leadIdStorageKey = 'fairlend-lead-id'
const homeownerIntakeStorageKey = 'fairlend-garden-suite-intake-v1'
const homeownerLeadIdStorageKey = 'fairlend-garden-suite-lead-id-v1'

const projectScopeIcons = [House, Wrench, Layers3, House, Landmark] as const
const projectScopeOptions = fairlendProjectScopeOptions.map((option, index) => ({
  ...option,
  icon: projectScopeIcons[index] ?? Landmark,
}))

const buildTypeOptions = [
  { label: 'Single Family', value: 'Single Family' },
  { label: 'Renovation', value: 'Renovation' },
  { label: 'Multi-plex', value: 'Multi-plex' },
  { label: 'Garden suite', value: 'Garden suite' },
  { label: 'Refinance', value: 'Refinance' },
  { label: 'Land', value: 'Land' },
  { label: 'Other / unsure', value: 'Other / unsure' },
] as const

const unitCountOptions = ['1', '2', '3-4', '5-6', '7-10', '11-20', '21-50', '51+', 'Not sure']

const projectStageOptions = [
  'Idea / feasibility',
  'Property identified',
  'Owned / under contract',
  'Concept design complete',
  'Zoning/planning reviewed',
  'Permit being prepared',
  'Permit submitted',
  'Permit issued',
  'Construction started',
  'Partially complete',
  'Substantially complete',
  'Stabilized / rented',
]

const financingNeedOptions = [
  'Construction financing',
  'Land acquisition',
  'Pre-development / permit-stage capital',
  'Bridge to construction financing',
  'Bridge to CMHC financing',
  'Completion take-out',
  'Refinance existing debt',
  'Existing lender maturity',
  'Appraisal came in low',
  'Need more leverage',
  'Cost overrun / additional construction funds',
  'Debt consolidation',
  'Equity partner / capital stack help',
  'Not sure',
]

const financingTimelineOptions = [
  'Immediately / under 14 days',
  '15-30 days',
  '31-60 days',
  '61-90 days',
  '3-6 months',
  '6-12 months',
  'No deadline yet / exploratory',
] as const

const financingTimelineScaleLabels = [
  'Now',
  '15–30d',
  '31–60d',
  '61–90d',
  '3–6mo',
  '6–12mo',
  'Explore',
] as const

const loanRangeOptions = [
  'Under $500K',
  '$500K-$1M',
  '$1M-$2.5M',
  '$2.5M-$5M',
  '$5M-$10M',
  '$10M-$25M',
  '$25M+',
  'Not sure',
]

const equityRangeOptions = [
  'Under $100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$2.5M',
  '$2.5M-$5M',
  '$5M+',
  'Equity is mostly in the property / land',
  'Not sure',
]

const homeownerOwnershipOptions = [
  { icon: House, label: 'I/we own the property' },
  { icon: Users, label: 'A family member or related entity owns it' },
  { icon: FilePenLine, label: 'I/we are buying the property' },
  { icon: Search, label: "I don't have a property yet" },
] as const

const homeownerOccupancyOptions = [
  { icon: House, label: 'I/we live there' },
  { icon: Users, label: 'A close relative lives there' },
  { icon: Building2, label: 'It is tenant occupied' },
  { icon: MapPin, label: 'It is vacant' },
  { icon: Search, label: 'Other / not sure' },
] as const

const homeownerSuiteTypeOptions = [
  { icon: House, label: 'Backyard garden suite' },
  { icon: MapPin, label: 'Laneway suite' },
  { icon: Search, label: 'Not sure which fits' },
] as const

const homeownerProjectStageOptions = [
  'Just exploring',
  'Feasibility research started',
  'Designs or plans underway',
  'Permit in progress',
  'Permit issued / ready to build',
  'Construction started',
] as const

const homeownerFinancingNeedOptions = [
  'Check if my property is suitable',
  'Design and permit coordination',
  'Find and coordinate a builder',
  'Construction financing',
  'Mortgage or refinance after the build',
  'Coordinate the whole process',
  'Not sure',
] as const

const homeownerContributionOptions = [
  'Under $50K',
  '$50K-$100K',
  '$100K-$200K',
  '$200K+',
  'Primarily home equity',
  'Not sure',
] as const

const homeownerTimelineOptions = [
  'Ready now',
  'Within 3 months',
  '3-6 months',
  '6-12 months',
  'Later / exploring',
] as const

const stepVisuals: Record<2 | 3 | 4 | 5 | 6 | 7, StepVisual> = {
  2: {
    image: buildProgressFoundationImage,
    label: 'Site identified',
    title: 'Foundation profile',
    summary: ['Site control', 'Lot + foundation', 'Routing starts'],
  },
  3: {
    image: buildProgressLotImage,
    label: 'Build profile',
    title: 'Structure rising',
    summary: ['5-6 unit rental', 'Permit submitted', 'Multi-unit path likely relevant'],
  },
  4: {
    image: buildProgressStructureImage,
    label: 'Financing lane',
    title: 'Capital path forming',
    summary: ['Construction financing', 'Bridge to CMHC', '31-60 days'],
  },
  5: {
    image: buildProgressFinishedImage,
    label: 'Capital snapshot',
    title: 'Budget base',
    summary: ['$2.5M-$5M request', '$5M-$10M cost', 'Equity base added'],
  },
  6: {
    image: buildProgressPolishedImage,
    label: 'Review ready',
    title: 'Lights on',
    summary: ['Contact route', 'No credit check', 'No obligation'],
  },
  7: {
    image: buildProgressPolishedImage,
    label: 'Project received',
    title: 'Finished profile',
    summary: ['Project received', 'Routing next step', 'Calendar ready'],
  },
}

const homeownerStepVisuals: Record<2 | 3 | 4, StepVisual> = {
  2: {
    image: buildProgressFoundationImage,
    label: 'Property direction',
    title: 'A practical starting point',
    summary: ['Property context', 'Support priorities', 'Timing'],
  },
  3: {
    image: buildProgressPolishedImage,
    label: 'Review contact',
    title: 'Ready for human review',
    summary: ['Property check', 'Financing context', 'Next step'],
  },
  4: {
    image: buildProgressFinishedImage,
    label: 'Property check received',
    title: 'FairLend review queued',
    summary: ['Context received', 'Eligibility reviewed', 'Follow-up next'],
  },
}

export function DrawflowIntake({
  variant = 'builder',
}: {
  variant?: FairlendBuildIntakeVariant
}): ReactElement {
  return variant === 'garden-suite-homeowner' ? (
    <GardenSuiteHomeownerIntake />
  ) : (
    <BuilderDrawflowIntake />
  )
}

function BuilderDrawflowIntake(): ReactElement {
  const searchParams = useSearchParams()
  const initialAddress = searchParams.get('address')?.trim() ?? ''
  const initialEmail = searchParams.get('email')?.trim() ?? ''
  const initialLeadId = searchParams.get('leadId')?.trim() ?? null
  const initialName = searchParams.get('name')?.trim() ?? ''
  const initialPhone = searchParams.get('phone')?.trim() ?? ''
  const initialProjectScope = getFairlendProjectScopeLabel(searchParams.get('projectScope'))
  const source = searchParams.get('source')?.trim() || 'drawflow-intake'
  const [step, setStep] = useState<WizardStep>(() =>
    initialAddress || initialProjectScope ? 2 : 1,
  )
  const [answers, setAnswers] = useState<IntakeAnswers>(() => ({
    ...defaultAnswers,
    address: initialAddress,
    email: initialEmail,
    name: initialName,
    phone: initialPhone,
    projectScope: initialProjectScope,
  }))
  const [leadId, setLeadId] = useState<string | null>(initialLeadId)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasHydratedFromEntryRef = useRef(false)
  const didTrackJourneyStartRef = useRef(false)
  const isFormStep = step > 1
  const isSuccessStep = step === 7

  useEffect(() => {
    try {
      window.localStorage.setItem(intakeStorageKey, JSON.stringify(answers))
    } catch {
      // Storage can be unavailable in private browsing or locked-down embedded contexts.
    }
  }, [answers])

  useEffect(() => {
    if (hasHydratedFromEntryRef.current) {
      return
    }

    hasHydratedFromEntryRef.current = true

    const incomingAddress = searchParams.get('address')?.trim()
    const incomingEmail = searchParams.get('email')?.trim()
    const incomingLeadId = searchParams.get('leadId')?.trim()
    const incomingName = searchParams.get('name')?.trim()
    const incomingPhone = searchParams.get('phone')?.trim()
    const incomingProjectScope = getFairlendProjectScopeLabel(searchParams.get('projectScope'))

    const timeout = window.setTimeout(() => {
      try {
        const savedAnswers = window.localStorage.getItem(intakeStorageKey)
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers) as Partial<IntakeAnswers>
          setAnswers((current) => ({
            ...current,
            ...parsedAnswers,
            address: incomingAddress || current.address || parsedAnswers.address || '',
            borrowerExperience: '',
            contactRole: '',
            email: incomingEmail || current.email || parsedAnswers.email || '',
            name: incomingName || current.name || parsedAnswers.name || '',
            phone: incomingPhone || current.phone || parsedAnswers.phone || '',
            projectTeam: [],
            projectScope:
              incomingProjectScope || current.projectScope || parsedAnswers.projectScope || '',
            siteControl: '',
          }))
        } else if (
          incomingAddress ||
          incomingEmail ||
          incomingName ||
          incomingPhone ||
          incomingProjectScope
        ) {
          setAnswers((current) => ({
            ...current,
            address: incomingAddress || current.address,
            email: incomingEmail || current.email,
            name: incomingName || current.name,
            phone: incomingPhone || current.phone,
            projectScope: incomingProjectScope || current.projectScope,
          }))
        }

        const savedLeadId = window.localStorage.getItem(leadIdStorageKey)
        const nextLeadId = incomingLeadId || savedLeadId
        if (nextLeadId) {
          setLeadId(nextLeadId)
          window.localStorage.setItem(leadIdStorageKey, nextLeadId)
        }
      } catch {
        if (
          incomingAddress ||
          incomingEmail ||
          incomingName ||
          incomingPhone ||
          incomingProjectScope
        ) {
          setAnswers((current) => ({
            ...current,
            address: incomingAddress || current.address,
            email: incomingEmail || current.email,
            name: incomingName || current.name,
            phone: incomingPhone || current.phone,
            projectScope: incomingProjectScope || current.projectScope,
          }))
        }
        if (incomingLeadId) {
          setLeadId(incomingLeadId)
        }
      }
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [searchParams])

  useEffect(() => {
    if (didTrackJourneyStartRef.current) return
    let hasSavedDraft = false
    try {
      hasSavedDraft = Boolean(window.localStorage.getItem(intakeStorageKey))
    } catch {
      // Storage is optional.
    }
    if (step === 1 && !hasSavedDraft) return
    didTrackJourneyStartRef.current = true
    const properties = {
      form_id: 'fairlend_builder',
      journey_type: 'builder' as const,
      source,
      step_key: builderStepKeys[Math.min(step, TOTAL_STEPS) - 1],
      step_number: Math.min(step, TOTAL_STEPS),
      total_steps: TOTAL_STEPS,
    }
    trackFairlendEvent(
      hasSavedDraft ? 'fairlend_intake_resumed' : 'fairlend_intake_started',
      properties,
    )
  }, [source, step])

  useEffect(() => {
    if (!leadId || isSuccessStep || !hasHydratedFromEntryRef.current) {
      return
    }

    const timeout = window.setTimeout(() => {
      void persistLeadDraft({ answers, leadId, source, status: 'draft' }).then((result) => {
        if (result?.id && result.id !== leadId) {
          setLeadId(result.id)
          try {
            window.localStorage.setItem(leadIdStorageKey, result.id)
          } catch {
            // Storage can be unavailable in private browsing or locked-down embedded contexts.
          }
        }
      })
    }, 900)

    return () => window.clearTimeout(timeout)
  }, [answers, isSuccessStep, leadId, source])

  useEffect(() => {
    if (step) {
      window.scrollTo({ behavior: 'auto', top: 0 })
    }
    if (step <= TOTAL_STEPS && didTrackJourneyStartRef.current) {
      trackFairlendEvent('fairlend_intake_step_viewed', {
        form_id: 'fairlend_builder',
        journey_type: 'builder',
        source,
        step_key: builderStepKeys[step - 1],
        step_number: step,
        total_steps: TOTAL_STEPS,
      })
    }
  }, [source, step])

  const summaryItems = useMemo(() => buildProjectSummary(answers), [answers])

  const updateAnswer = <Key extends keyof IntakeAnswers>(
    key: Key,
    value: IntakeAnswers[Key],
  ): void => {
    setSubmitError('')
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  const submitProjectLead = useCallback(async (): Promise<void> => {
    if (!answers.name.trim() || !isValidIntakeEmail(answers.email)) {
      setSubmitError('Add your name and a valid email before submitting the project.')
      trackBuilderValidationFailure(step, source)
      return
    }

    if (!answers.termsAccepted) {
      setSubmitError('Confirm the acknowledgement before submitting the project.')
      trackBuilderValidationFailure(step, source)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const result = await persistLeadDraft({
      answers,
      leadId,
      source,
      status: 'submitted',
    })

    if (!result?.id) {
      setIsSubmitting(false)
      setSubmitError(
        'We could not save the project yet. Check the required contact fields and try again.',
      )
      trackLeadFailed({ form_id: 'fairlend_builder', journey_type: 'builder', source })
      return
    }

    setLeadId(result.id)
    try {
      window.localStorage.setItem(leadIdStorageKey, result.id)
    } catch {
      // Storage can be unavailable in private browsing or locked-down embedded contexts.
    }

    setIsSubmitting(false)
    completeLeadAnalytics(result, {
      completion_status: 'complete',
      form_id: 'fairlend_builder',
      journey_type: 'builder',
      source,
    })
    runIntakeStepTransition(() => setStep(7))
  }, [answers, leadId, source, step])

  const goBack = (): void => {
    trackFairlendEvent('fairlend_intake_back_clicked', {
      form_id: 'fairlend_builder',
      journey_type: 'builder',
      source,
      step_key: builderStepKeys[Math.min(step, TOTAL_STEPS) - 1],
      step_number: Math.min(step, TOTAL_STEPS),
      total_steps: TOTAL_STEPS,
    })
    runIntakeStepTransition(() => {
      setStep((current) => {
        if (current <= 2) {
          return 1
        }
        return (current - 1) as WizardStep
      })
    })
  }

  const goForward = (): void => {
    if (!didTrackJourneyStartRef.current) {
      didTrackJourneyStartRef.current = true
      trackFairlendEvent('fairlend_intake_started', {
        form_id: 'fairlend_builder',
        journey_type: 'builder',
        source,
      })
    }
    trackFairlendEvent('fairlend_intake_step_completed', {
      form_id: 'fairlend_builder',
      journey_type: 'builder',
      source,
      step_key: builderStepKeys[Math.min(step, TOTAL_STEPS) - 1],
      step_number: Math.min(step, TOTAL_STEPS),
      total_steps: TOTAL_STEPS,
    })
    runIntakeStepTransition(() => {
      setStep((current) => Math.min(current + 1, 7) as WizardStep)
    })
  }

  return (
    <main className="bp-page bp-page--with-public-header">
      <Frame className="bp-shell">
        <section
          aria-labelledby={isFormStep ? 'bp-form-title' : 'bp-hero-title'}
          className={
            isFormStep
              ? isSuccessStep
                ? `bp-canvas bp-canvas-form bp-canvas-success bp-intake-step-${step}`
                : `bp-canvas bp-canvas-form bp-intake-step-${step}`
              : 'bp-canvas'
          }
        >
          <Image
            alt=""
            aria-hidden="true"
            className="bp-background"
            decoding="async"
            draggable={false}
            fetchPriority="high"
            height={936}
            loading="eager"
            src={backgroundImage}
            width={1681}
          />

          {isSuccessStep ? (
            <BuildPathSuccessStep
              answers={answers}
              onAddAnother={() => {
                runIntakeStepTransition(() => {
                  setAnswers(defaultAnswers)
                  setLeadId(null)
                  try {
                    window.localStorage.removeItem(leadIdStorageKey)
                  } catch {
                    // Storage can be unavailable in private browsing or locked-down embedded contexts.
                  }
                  setStep(1)
                })
              }}
              onBack={() => {
                runIntakeStepTransition(() => setStep(6))
              }}
              leadId={leadId}
              summaryItems={summaryItems}
            />
          ) : isFormStep ? (
            step === 2 ? (
              <BuildPathPropertyStep
                answers={answers}
                onBack={goBack}
                onContinue={() => {
                  if (answers.buildPermitFileName) {
                    runIntakeStepTransition(() => setStep(6))
                    return
                  }
                  goForward()
                }}
                updateAnswer={updateAnswer}
              />
            ) : (
              <BuildPathWizardStep
                answers={answers}
                onBack={goBack}
                onContinue={step === 6 ? () => void submitProjectLead() : goForward}
                isSubmitting={isSubmitting}
                submitError={submitError}
                step={step}
                summaryItems={summaryItems}
                updateAnswer={updateAnswer}
              />
            )
          ) : (
            <BuildPathHeroStart
              onExplore={() => scrollToBuildPathSection('build-model')}
              onStart={() => {
                runIntakeStepTransition(() => setStep(2))
              }}
            />
          )}
        </section>
        {!isFormStep && (
          <FairlendLandingRail
            contentClassName="overflow-visible!"
            gutterTexture="fabric-of-squares"
          >
            <FairlendBuildModelSection startWithDrawFlow />
          </FairlendLandingRail>
        )}
      </Frame>
    </main>
  )
}

function GardenSuiteHomeownerIntake(): ReactElement {
  const searchParams = useSearchParams()
  const initialAddress = searchParams.get('address')?.trim() ?? ''
  const initialEmail = searchParams.get('email')?.trim() ?? ''
  const initialLeadId = searchParams.get('leadId')?.trim() ?? null
  const initialName = searchParams.get('name')?.trim() ?? ''
  const initialPhone = searchParams.get('phone')?.trim() ?? ''
  const source = searchParams.get('source')?.trim() || 'garden-suite-homeowner-intake'
  const [step, setStep] = useState<HomeownerStep>(1)
  const [answers, setAnswers] = useState<HomeownerIntakeAnswers>(() => ({
    ...defaultHomeownerAnswers,
    address: initialAddress,
    email: initialEmail,
    name: initialName,
    phone: initialPhone,
  }))
  const [leadId, setLeadId] = useState<string | null>(initialLeadId)
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const didTrackJourneyStartRef = useRef(false)
  const resumedDraftRef = useRef(false)
  const isSuccessStep = step === 4

  useEffect(() => {
    const incomingAddress = searchParams.get('address')?.trim() ?? ''
    const incomingEmail = searchParams.get('email')?.trim() ?? ''
    const incomingLeadId = searchParams.get('leadId')?.trim() ?? null
    const incomingName = searchParams.get('name')?.trim() ?? ''
    const incomingPhone = searchParams.get('phone')?.trim() ?? ''

    const timeout = window.setTimeout(() => {
      try {
        const savedAnswers = window.localStorage.getItem(homeownerIntakeStorageKey)
        if (savedAnswers) {
          resumedDraftRef.current = true
          const parsedAnswers = JSON.parse(savedAnswers) as Partial<HomeownerIntakeAnswers>
          setAnswers((current) => ({
            ...current,
            ...parsedAnswers,
            address: incomingAddress || parsedAnswers.address || current.address,
            email: incomingEmail || parsedAnswers.email || current.email,
            name: incomingName || parsedAnswers.name || current.name,
            phone: incomingPhone || parsedAnswers.phone || current.phone,
            projectScope: gardenSuiteProjectScopeLabel,
          }))
        } else if (incomingAddress || incomingEmail || incomingName || incomingPhone) {
          setAnswers((current) => ({
            ...current,
            address: incomingAddress || current.address,
            email: incomingEmail || current.email,
            name: incomingName || current.name,
            phone: incomingPhone || current.phone,
          }))
        }

        const savedLeadId = window.localStorage.getItem(homeownerLeadIdStorageKey)
        const nextLeadId = incomingLeadId || savedLeadId
        if (nextLeadId) {
          setLeadId(nextLeadId)
          window.localStorage.setItem(homeownerLeadIdStorageKey, nextLeadId)
        }
      } catch {
        if (incomingAddress || incomingEmail || incomingName || incomingPhone) {
          setAnswers((current) => ({
            ...current,
            address: incomingAddress || current.address,
            email: incomingEmail || current.email,
            name: incomingName || current.name,
            phone: incomingPhone || current.phone,
          }))
        }
        if (incomingLeadId) {
          setLeadId(incomingLeadId)
        }
      } finally {
        setHasHydratedDraft(true)
      }
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [searchParams])

  useEffect(() => {
    if (!hasHydratedDraft || didTrackJourneyStartRef.current) return
    didTrackJourneyStartRef.current = true
    const properties = {
      form_id: 'fairlend_homeowner_garden_suite',
      journey_type: 'homeowner_garden_suite' as const,
      source,
      step_key: homeownerStepKeys[step - 1],
      step_number: step,
      total_steps: HOMEOWNER_TOTAL_STEPS,
    }
    trackFairlendEvent(
      resumedDraftRef.current ? 'fairlend_intake_resumed' : 'fairlend_intake_started',
      properties,
    )
    trackFairlendEvent('fairlend_intake_step_viewed', properties)
  }, [hasHydratedDraft, source, step])

  useEffect(() => {
    if (!hasHydratedDraft || isSuccessStep) return

    try {
      window.localStorage.setItem(homeownerIntakeStorageKey, JSON.stringify(answers))
    } catch {
      // Storage can be unavailable in private browsing or locked-down embedded contexts.
    }
  }, [answers, hasHydratedDraft, isSuccessStep])

  useEffect(() => {
    if (!hasHydratedDraft || !leadId || isSuccessStep) return

    const timeout = window.setTimeout(() => {
      void persistHomeownerLead({ answers, leadId, source, status: 'draft' }).then((result) => {
        if (result?.id && result.id !== leadId) {
          setLeadId(result.id)
          try {
            window.localStorage.setItem(homeownerLeadIdStorageKey, result.id)
          } catch {
            // Storage can be unavailable in private browsing or locked-down embedded contexts.
          }
        }
      })
    }, 900)

    return () => window.clearTimeout(timeout)
  }, [answers, hasHydratedDraft, isSuccessStep, leadId, source])

  useEffect(() => {
    window.scrollTo({ behavior: 'auto', top: 0 })
    window.requestAnimationFrame(() => {
      document.getElementById('bp-form-title')?.focus({ preventScroll: true })
    })
    if (step <= HOMEOWNER_TOTAL_STEPS && didTrackJourneyStartRef.current) {
      trackFairlendEvent('fairlend_intake_step_viewed', {
        form_id: 'fairlend_homeowner_garden_suite',
        journey_type: 'homeowner_garden_suite',
        source,
        step_key: homeownerStepKeys[step - 1],
        step_number: step,
        total_steps: HOMEOWNER_TOTAL_STEPS,
      })
    }
  }, [source, step])

  const summaryItems = useMemo(() => buildHomeownerSummary(answers), [answers])

  const updateAnswer = <Key extends keyof HomeownerIntakeAnswers>(
    key: Key,
    value: HomeownerIntakeAnswers[Key],
  ): void => {
    setSubmitError('')
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  const updateOwnership = (siteControl: string): void => {
    setSubmitError('')
    setAnswers((current) => ({
      ...current,
      occupancy:
        siteControl === "I don't have a property yet"
          ? 'Not applicable'
          : current.occupancy === 'Not applicable'
            ? ''
            : current.occupancy,
      siteControl,
    }))
  }

  const moveForward = (): void => {
    const error = validateHomeownerStep(step, answers)
    if (error) {
      setSubmitError(error)
      trackHomeownerValidationFailure(step, source)
      return
    }

    setSubmitError('')
    trackFairlendEvent('fairlend_intake_step_completed', {
      form_id: 'fairlend_homeowner_garden_suite',
      journey_type: 'homeowner_garden_suite',
      source,
      step_key: homeownerStepKeys[step - 1],
      step_number: step,
      total_steps: HOMEOWNER_TOTAL_STEPS,
    })
    runIntakeStepTransition(() => {
      setStep((current) => Math.min(current + 1, HOMEOWNER_TOTAL_STEPS) as HomeownerStep)
    })
  }

  const moveBack = (): void => {
    setSubmitError('')
    trackFairlendEvent('fairlend_intake_back_clicked', {
      form_id: 'fairlend_homeowner_garden_suite',
      journey_type: 'homeowner_garden_suite',
      source,
      step_key: homeownerStepKeys[step - 1],
      step_number: step,
      total_steps: HOMEOWNER_TOTAL_STEPS,
    })
    runIntakeStepTransition(() => {
      setStep((current) => Math.max(current - 1, 1) as HomeownerStep)
    })
  }

  const submitHomeownerLead = useCallback(async (): Promise<void> => {
    const error = validateHomeownerStep(3, answers)
    if (error) {
      setSubmitError(error)
      trackHomeownerValidationFailure(3, source)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const result = await persistHomeownerLead({
      answers,
      leadId,
      source,
      status: 'submitted',
    })

    if (!result?.id) {
      setIsSubmitting(false)
      setSubmitError('We could not save your property check. Please try again.')
      trackLeadFailed({
        form_id: 'fairlend_homeowner_garden_suite',
        journey_type: 'homeowner_garden_suite',
        source,
      })
      return
    }

    setLeadId(result.id)
    try {
      window.localStorage.setItem(homeownerLeadIdStorageKey, result.id)
    } catch {
      // Storage can be unavailable in private browsing or locked-down embedded contexts.
    }

    setIsSubmitting(false)
    completeLeadAnalytics(result, {
      completion_status: 'complete',
      form_id: 'fairlend_homeowner_garden_suite',
      journey_type: 'homeowner_garden_suite',
      source,
    })
    runIntakeStepTransition(() => setStep(4))
  }, [answers, leadId, source])

  const resetHomeownerIntake = (): void => {
    setAnswers(defaultHomeownerAnswers)
    setLeadId(null)
    setSubmitError('')
    try {
      window.localStorage.removeItem(homeownerIntakeStorageKey)
      window.localStorage.removeItem(homeownerLeadIdStorageKey)
    } catch {
      // Storage can be unavailable in private browsing or locked-down embedded contexts.
    }
    runIntakeStepTransition(() => setStep(1))
  }

  return (
    <main className="bp-page bp-page--with-public-header">
      <Frame className="bp-shell">
        <section
          aria-labelledby="bp-form-title"
          className={`bp-canvas bp-canvas-form bp-homeowner-intake bp-intake-step-${step}${
            isSuccessStep ? ' bp-canvas-success' : ''
          }`}
          data-intake-variant="garden-suite-homeowner"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="bp-background"
            decoding="async"
            draggable={false}
            fetchPriority="high"
            height={936}
            loading="eager"
            src={backgroundImage}
            width={1681}
          />

          {isSuccessStep ? (
            <HomeownerSuccessStep
              answers={answers}
              leadId={leadId}
              onBack={() => runIntakeStepTransition(() => setStep(3))}
              onReset={resetHomeownerIntake}
              source={source}
              summaryItems={summaryItems}
            />
          ) : step === 1 ? (
            <HomeownerPropertyStep
              answers={answers}
              onContinue={moveForward}
              submitError={submitError}
              updateAnswer={updateAnswer}
              updateOwnership={updateOwnership}
            />
          ) : (
            <HomeownerWizardStep
              answers={answers}
              isSubmitting={isSubmitting}
              onBack={moveBack}
              onContinue={step === 3 ? () => void submitHomeownerLead() : moveForward}
              step={step}
              submitError={submitError}
              summaryItems={summaryItems}
              updateAnswer={updateAnswer}
            />
          )}
        </section>
      </Frame>
    </main>
  )
}

function BuildPathStepProgress({
  step,
  total = TOTAL_STEPS,
}: {
  step: number
  total?: number
}): ReactElement {
  return (
    <div className="bp-step">
      <span>
        Step {step} of {total}
      </span>
      <span aria-hidden="true" className="bp-step-dots">
        {Array.from({ length: total }, (_, index) => index + 1).map((dotStep) => (
          <i className={dotStep === step ? 'is-active' : undefined} key={dotStep} />
        ))}
      </span>
    </div>
  )
}

function BuildPathHeroStart({
  onExplore,
  onStart,
}: {
  onExplore: () => void
  onStart: () => void
}): ReactElement {
  return (
    <>
      <div aria-hidden="true" className="bp-annotation bp-annotation-plan">
        Modern multiplex
        <span>6 units</span>
        <span>Lot size&nbsp;&nbsp;60&apos; x 100&apos;</span>
        <span>Zoning&nbsp;&nbsp;RM-2</span>
      </div>
      <div aria-hidden="true" className="bp-annotation bp-annotation-return">
        Smart design.
        <span>Strong returns.</span>
      </div>
      <div aria-hidden="true" className="bp-dashed-arc" />

      <div className="bp-copy">
        <BuildPathStepProgress step={1} />

        <h1 id="bp-hero-title">
          <span className="bp-title-line">
            <span className="bp-title-lockup">Build financing</span> that
          </span>
          <span>moves with the work</span>
        </h1>

        <p className="bp-subtitle">
          Plan draws around real construction progress,{' '}
          <span>not rigid schedules that ignore what is happening on site.</span>
        </p>

        <ul className="bp-trust-row">
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <Card className="bp-trust-chip" key={item.label} render={<li />}>
                <span aria-hidden="true" className="bp-trust-icon">
                  <Icon strokeWidth={1.9} />
                </span>
                <span>{item.label}</span>
              </Card>
            )
          })}
        </ul>
      </div>

      <Image
        alt=""
        aria-hidden="true"
        className="bp-blueprint"
        decoding="async"
        draggable={false}
        fetchPriority="high"
        height={955}
        loading="eager"
        src={blueprintImage}
        width={1328}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="bp-multiplex"
        decoding="async"
        draggable={false}
        fetchPriority="high"
        height={987}
        loading="eager"
        src={multiplexImage}
        width={1418}
      />

      <button
        aria-label="Continue to project review"
        className="bp-orb"
        onClick={onStart}
        type="button"
      >
        <ArrowRight strokeWidth={1.8} />
      </button>

      <div className="bp-cta-stack">
        <BrutalistCtaButton onClick={onStart} size="hero" type="button">
          Start project review
        </BrutalistCtaButton>
        <button className="bp-secondary-cta" onClick={onExplore} type="button">
          I&apos;m just exploring
        </button>
        <p className="bp-secure-note">
          <LockKeyhole aria-hidden="true" strokeWidth={1.9} />
          <span>
            Your information is protected and used only to review your request, respond, and take
            permitted next steps under our Privacy Policy.
          </span>
        </p>
      </div>
    </>
  )
}

function BuildPathSitePlanPanel(): ReactElement {
  return (
    <div className="bp-site-plan-panel">
      <Image
        alt=""
        aria-hidden="true"
        className="bp-site-plan-field"
        decoding="async"
        draggable={false}
        height={1024}
        loading="eager"
        src={sitePlanBlueprintFieldImage}
        width={1536}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="bp-site-plan-foreground"
        decoding="async"
        draggable={false}
        height={1024}
        loading="eager"
        src={sitePlanForegroundImage}
        width={1536}
      />

      <div className="bp-site-plan-notes bp-site-plan-notes-top">
        <p>Property site plan</p>
        <span>Lot area</span>
        <strong>14,200 sq ft</strong>
        <span>Zoning</span>
        <strong>R-3</strong>
        <span>Topography</span>
        <strong>Level</strong>
      </div>

      <div className="bp-buildable-note">
        <span>Buildable area</span>
        <strong>8,560 sq ft</strong>
      </div>

      <div aria-hidden="true" className="bp-site-dimension bp-site-dimension-depth">
        142&apos;-0&quot;
      </div>
      <div aria-hidden="true" className="bp-site-dimension bp-site-dimension-width">
        100&apos;-0&quot;
      </div>
      <div aria-hidden="true" className="bp-site-dimension bp-site-dimension-front">
        <span>Front setback</span>
        <strong>20&apos;-0&quot;</strong>
      </div>

      <div className="bp-site-legend">
        <p>Legend</p>
        <span>
          <i />
          Property line
        </span>
        <span>
          <i />
          Setback line
        </span>
        <span>
          <i />
          Building footprint
        </span>
      </div>

      <div className="bp-site-summary">
        <p>Site summary</p>
        <span>
          <i />
          14,200 sq ft
        </span>
        <span>
          <i />
          0.33 acres
        </span>
        <span>
          <i />
          Level topography
        </span>
      </div>
    </div>
  )
}

function HomeownerPropertyStep({
  answers,
  onContinue,
  submitError,
  updateAnswer,
  updateOwnership,
}: {
  answers: HomeownerIntakeAnswers
  onContinue: () => void
  submitError: string
  updateAnswer: <Key extends keyof HomeownerIntakeAnswers>(
    key: Key,
    value: HomeownerIntakeAnswers[Key],
  ) => void
  updateOwnership: (siteControl: string) => void
}): ReactElement {
  const hasNoProperty = answers.siteControl === "I don't have a property yet"

  return (
    <div className="bp-form-stage bp-homeowner-property-stage">
      <div className="bp-form-progress">
        <BuildPathStepProgress step={1} total={HOMEOWNER_TOTAL_STEPS} />
      </div>
      <BuildPathSitePlanPanel />

      <Card className="bp-form-panel bp-homeowner-panel">
        <div className="bp-form-content">
          <p className="bp-form-kicker">Garden + laneway property check</p>
          <h1 id="bp-form-title" tabIndex={-1}>
            Let&apos;s start with the property.
          </h1>
          <p className="bp-form-subtitle">
            You do not need plans or building experience. Give us the basics and FairLend will
            review what may fit.
          </p>

          <GoogleAddressAutocomplete
            className="bp-address-field bp-address-autocomplete"
            id="garden-suite-property-address"
            label={hasNoProperty ? 'Property address (optional)' : 'Property address'}
            onChange={(nextAddress) => updateAnswer('address', nextAddress)}
            onPlaceSelect={(_suggestion, details) => {
              if (details?.formattedAddress) {
                updateAnswer('address', details.formattedAddress)
              }
            }}
            placeholder="Start typing the property address"
            testId="garden-suite-property-address-input"
            value={answers.address}
          />

          <fieldset className="bp-status-fieldset bp-homeowner-fieldset">
            <legend>What is your connection to the property?</legend>
            <div className="bp-status-grid bp-homeowner-choice-grid">
              {homeownerOwnershipOptions.map((option) => {
                const Icon = option.icon
                const active = answers.siteControl === option.label
                return (
                  <Card
                    className={
                      active
                        ? 'bp-status-option fairlend-choice-pill is-selected'
                        : 'bp-status-option fairlend-choice-pill'
                    }
                    key={option.label}
                    render={
                      <button
                        aria-pressed={active}
                        onClick={() => updateOwnership(option.label)}
                        type="button"
                      />
                    }
                  >
                    <OptionCardIcon icon={Icon} />
                    <span>{option.label}</span>
                    {active ? (
                      <Check aria-hidden="true" className="bp-status-check" strokeWidth={2} />
                    ) : null}
                  </Card>
                )
              })}
            </div>
          </fieldset>

          {!hasNoProperty ? (
            <fieldset className="bp-status-fieldset bp-homeowner-fieldset">
              <legend>Who lives at the property?</legend>
              <div className="bp-status-grid bp-homeowner-choice-grid">
                {homeownerOccupancyOptions.map((option) => {
                  const Icon = option.icon
                  const active = answers.occupancy === option.label
                  return (
                    <Card
                      className={
                        active
                          ? 'bp-status-option fairlend-choice-pill is-selected'
                          : 'bp-status-option fairlend-choice-pill'
                      }
                      key={option.label}
                      render={
                        <button
                          aria-pressed={active}
                          onClick={() => updateAnswer('occupancy', option.label)}
                          type="button"
                        />
                      }
                    >
                      <OptionCardIcon icon={Icon} />
                      <span>{option.label}</span>
                      {active ? (
                        <Check aria-hidden="true" className="bp-status-check" strokeWidth={2} />
                      ) : null}
                    </Card>
                  )
                })}
              </div>
            </fieldset>
          ) : null}

          <fieldset className="bp-status-fieldset bp-homeowner-fieldset">
            <legend>What would you like to add?</legend>
            <div className="bp-option-grid bp-homeowner-suite-grid">
              {homeownerSuiteTypeOptions.map((option) => (
                <SelectableCard
                  active={answers.suiteType === option.label}
                  icon={option.icon}
                  key={option.label}
                  onClick={() => updateAnswer('suiteType', option.label)}
                >
                  {option.label}
                </SelectableCard>
              ))}
            </div>
          </fieldset>

          {submitError ? (
            <p className="bp-submit-error" role="alert">
              {submitError}
            </p>
          ) : null}

          <BrutalistCtaButton
            className="mt-[14px]"
            onClick={onContinue}
            size="compact"
            type="button"
          >
            Continue
          </BrutalistCtaButton>

          <Link className="bp-form-back" href="/">
            <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
            Back to FairLend
          </Link>
        </div>
      </Card>
    </div>
  )
}

function HomeownerWizardStep({
  answers,
  isSubmitting,
  onBack,
  onContinue,
  step,
  submitError,
  summaryItems,
  updateAnswer,
}: {
  answers: HomeownerIntakeAnswers
  isSubmitting: boolean
  onBack: () => void
  onContinue: () => void
  step: 2 | 3
  submitError: string
  summaryItems: string[]
  updateAnswer: <Key extends keyof HomeownerIntakeAnswers>(
    key: Key,
    value: HomeownerIntakeAnswers[Key],
  ) => void
}): ReactElement {
  const isContactStep = step === 3

  return (
    <div className="bp-form-stage bp-wizard-stage bp-homeowner-wizard-stage">
      <div className="bp-form-progress">
        <BuildPathStepProgress step={step} total={HOMEOWNER_TOTAL_STEPS} />
      </div>
      <BuildPathVisualPanel
        answers={answers}
        step={step}
        summaryItems={summaryItems}
        variant="garden-suite-homeowner"
      />

      <Card className="bp-form-panel bp-wizard-panel bp-homeowner-panel">
        <div className="bp-form-content" key={step}>
          <p className="bp-form-kicker">
            {isContactStep ? 'Your property review' : 'Your starting point'}
          </p>
          <h1 id="bp-form-title" tabIndex={-1}>
            {isContactStep ? 'Where should we send the next step?' : 'Where are you starting from?'}
          </h1>
          <p className="bp-form-subtitle">
            {isContactStep
              ? 'A FairLend specialist will review the property and explain the practical next step.'
              : 'Rough answers are enough. You do not need a finished budget, permit, or builder.'}
          </p>

          <div className="bp-wizard-fields">
            {isContactStep ? (
              <>
                <div className="bp-contact-grid">
                  <TextField
                    icon={User}
                    label="Name"
                    name="garden-suite-name"
                    onChange={(value) => updateAnswer('name', value)}
                    placeholder="Your full name"
                    required
                    value={answers.name}
                  />
                  <TextField
                    icon={Mail}
                    label="Email"
                    name="garden-suite-email"
                    onChange={(value) => updateAnswer('email', value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={answers.email}
                  />
                  <TextField
                    icon={Phone}
                    label="Phone (optional)"
                    name="garden-suite-phone"
                    onChange={(value) => updateAnswer('phone', value)}
                    placeholder="Best phone number"
                    type="tel"
                    value={answers.phone}
                  />
                  <label className="bp-text-field bp-notes-field">
                    <span>Anything else we should know? (optional)</span>
                    <textarea
                      name="garden-suite-notes"
                      onChange={(event) => updateAnswer('notes', event.target.value)}
                      placeholder="Questions, property details, or timing constraints"
                      value={answers.notes}
                    />
                  </label>
                  <label className="bp-acknowledgement">
                    <Checkbox
                      checked={answers.termsAccepted}
                      className="bp-acknowledgement-box"
                      onCheckedChange={(checked) => updateAnswer('termsAccepted', checked === true)}
                    />
                    <span>
                      I understand FairLend will use this information to review the property and
                      financing context and respond with relevant next steps. Submission is not an
                      approval, eligibility decision, or financing commitment.
                    </span>
                  </label>
                </div>
                <p className="bp-final-note">
                  <LockKeyhole aria-hidden="true" strokeWidth={1.8} />
                  No credit check and no documents required to start.
                </p>
              </>
            ) : (
              <>
                <FieldGroup label="How far along are you?">
                  <div className="bp-stage-timeline">
                    {homeownerProjectStageOptions.map((option) => (
                      <SelectableChip
                        active={answers.projectStage === option}
                        key={option}
                        onClick={() => updateAnswer('projectStage', option)}
                      >
                        {option}
                      </SelectableChip>
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label="What would you like help with? Select all that apply.">
                  <div className="bp-chip-grid bp-chip-grid-dense">
                    {homeownerFinancingNeedOptions.map((option) => (
                      <SelectableChip
                        active={answers.financingNeeds.includes(option)}
                        key={option}
                        onClick={() =>
                          updateAnswer(
                            'financingNeeds',
                            toggleMultiValue(answers.financingNeeds, option),
                          )
                        }
                      >
                        {option}
                      </SelectableChip>
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label="About how much cash or home equity could you contribute?">
                  <div className="bp-chip-grid">
                    {homeownerContributionOptions.map((option) => (
                      <SelectableChip
                        active={answers.approximateEquity === option}
                        key={option}
                        onClick={() => updateAnswer('approximateEquity', option)}
                      >
                        {option}
                      </SelectableChip>
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label="When would you like to get started?">
                  <div className="bp-option-grid bp-homeowner-timeline-grid">
                    {homeownerTimelineOptions.map((option) => (
                      <SelectableCard
                        active={answers.timeline === option}
                        icon={CalendarClock}
                        key={option}
                        onClick={() => updateAnswer('timeline', option)}
                      >
                        {option}
                      </SelectableCard>
                    ))}
                  </div>
                </FieldGroup>
              </>
            )}
          </div>

          {submitError ? (
            <p className="bp-submit-error" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="bp-wizard-actions">
            <BrutalistCtaButton
              disabled={isSubmitting}
              onClick={onContinue}
              size="compact"
              type="button"
            >
              {isContactStep
                ? isSubmitting
                  ? 'Sending property check...'
                  : 'Send property check'
                : 'Continue'}
            </BrutalistCtaButton>

            <button className="bp-form-back" onClick={onBack} type="button">
              <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
              Back
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function BuildPathPropertyStep({
  answers,
  onBack,
  onContinue,
  updateAnswer,
}: {
  answers: IntakeAnswers
  onBack: () => void
  onContinue: () => void
  updateAnswer: <Key extends keyof IntakeAnswers>(key: Key, value: IntakeAnswers[Key]) => void
}): ReactElement {
  return (
    <div className="bp-form-stage">
      <BuildPathSitePlanPanel />

      <Card className="bp-form-panel bp-builder-journey-panel">
        <div className="bp-form-content">
          <p className="bp-form-kicker">Property / site details</p>
          <h1 id="bp-form-title">Where is the build?</h1>
          <p className="bp-form-subtitle">
            Tell us about the property you plan to build on so we can match you with the right
            financing options.
          </p>

          <div className="bp-wizard-fields bp-property-step-fields">
            <GoogleAddressAutocomplete
              className="bp-address-field bp-address-autocomplete"
              id="intake-property-address"
              label="Project property address"
              onChange={(nextAddress) => updateAnswer('address', nextAddress)}
              onPlaceSelect={(_suggestion, details) => {
                if (details?.formattedAddress) {
                  updateAnswer('address', details.formattedAddress)
                }
              }}
              placeholder="Start typing the project address"
              testId="intake-property-address-input"
              value={answers.address}
            />

            <fieldset className="bp-project-scope-fieldset">
              <legend>What are you looking to finance?</legend>
              <p id="intake-project-scope-description">
                Choose the option that best matches the scope of your project.
              </p>
              <RadioGroup
                aria-describedby="intake-project-scope-description"
                aria-label="Project financing scope"
                className="bp-project-scope-grid"
                name="projectScope"
                onValueChange={(value) => updateAnswer('projectScope', value)}
                required
                value={answers.projectScope}
              >
                {projectScopeOptions.map((option) => {
                  const Icon = option.icon

                  return (
                    <label
                      className="bp-project-scope-option fairlend-choice-pill"
                      key={option.value}
                    >
                      <RadioGroupItem
                        className="bp-project-scope-radio"
                        id={`intake-project-scope-${option.value}`}
                        value={option.label}
                      />
                      <Icon
                        aria-hidden="true"
                        className="bp-project-scope-icon"
                        strokeWidth={1.8}
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                })}
              </RadioGroup>
            </fieldset>

            <BuildPermitDisclosure
              fileName={answers.buildPermitFileName}
              onClear={() => updateAnswer('buildPermitFileName', '')}
              onFileSelected={(fileName) => updateAnswer('buildPermitFileName', fileName)}
            />
          </div>

          <div className="bp-wizard-actions">
            <BrutalistCtaButton
              disabled={!answers.projectScope}
              onClick={onContinue}
              size="compact"
              type="button"
            >
              Continue
            </BrutalistCtaButton>

            <button className="bp-form-back" onClick={onBack} type="button">
              <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
              Back
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function BuildPathWizardStep({
  answers,
  isSubmitting = false,
  onBack,
  onContinue,
  step,
  submitError = '',
  summaryItems,
  updateAnswer,
}: {
  answers: IntakeAnswers
  isSubmitting?: boolean
  onBack: () => void
  onContinue: () => void
  step: WizardStep
  submitError?: string
  summaryItems: string[]
  updateAnswer: <Key extends keyof IntakeAnswers>(key: Key, value: IntakeAnswers[Key]) => void
}): ReactElement {
  const content = getWizardStepContent(step, answers, updateAnswer)

  return (
    <div className="bp-form-stage bp-wizard-stage">
      <BuildPathVisualPanel answers={answers} step={step} summaryItems={summaryItems} />

      <Card className="bp-form-panel bp-wizard-panel bp-builder-journey-panel">
        <div className="bp-form-content" key={step}>
          <p className="bp-form-kicker">{content.kicker}</p>
          <h1 id="bp-form-title">{content.title}</h1>
          <p className="bp-form-subtitle">{content.subtitle}</p>

          <div className="bp-wizard-fields">{content.fields}</div>

          <div className="bp-wizard-actions">
            <BrutalistCtaButton
              disabled={isSubmitting}
              onClick={onContinue}
              size="compact"
              type="button"
            >
              {step === 6 ? (isSubmitting ? 'Submitting...' : 'Submit project') : 'Continue'}
            </BrutalistCtaButton>

            <button className="bp-form-back" onClick={onBack} type="button">
              <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
              Back
            </button>
          </div>
          {submitError ? <p className="bp-submit-error">{submitError}</p> : null}
        </div>
      </Card>
    </div>
  )
}

function getWizardStepContent(
  step: WizardStep,
  answers: IntakeAnswers,
  updateAnswer: <Key extends keyof IntakeAnswers>(key: Key, value: IntakeAnswers[Key]) => void,
): {
  fields: ReactElement
  kicker: string
  subtitle: string
  title: string
} {
  switch (step) {
    case 3:
      return {
        kicker: 'Build profile',
        title: 'What are you building?',
        subtitle:
          'Shape the project profile so we can separate construction, bridge, and take-out paths early.',
        fields: (
          <>
            <FairlendApplicationChoiceChips
              legend="Project type"
              name="buildType"
              onValueChange={(value) => updateAnswer('buildType', value)}
              options={buildTypeOptions}
              required
              value={answers.buildType}
            />

            <FieldGroup label="Units after completion">
              <div className="bp-chip-grid">
                {unitCountOptions.map((option) => (
                  <SelectableChip
                    active={answers.unitCount === option}
                    key={option}
                    onClick={() => updateAnswer('unitCount', option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Current project stage">
              <div className="bp-stage-timeline">
                {projectStageOptions.map((option) => (
                  <SelectableChip
                    active={answers.projectStage === option}
                    key={option}
                    onClick={() => updateAnswer('projectStage', option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>
          </>
        ),
      }
    case 4:
      return {
        kicker: 'Financing path',
        title: 'What do you need financed?',
        subtitle:
          'Select every need that applies. DrawFlow can route a mixed capital stack without forcing one answer too early.',
        fields: (
          <>
            <FieldGroup label="Financing needs">
              <div className="bp-chip-grid bp-chip-grid-dense">
                {financingNeedOptions.map((option) => (
                  <SelectableChip
                    active={answers.financingNeeds.includes(option)}
                    key={option}
                    onClick={() =>
                      updateAnswer(
                        'financingNeeds',
                        toggleMultiValue(answers.financingNeeds, option),
                      )
                    }
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="When do you need funding or guidance?">
              <FinancingTimelineSlider
                onValueChange={(value) => updateAnswer('financingTimeline', value)}
                value={answers.financingTimeline}
              />
            </FieldGroup>
          </>
        ),
      }
    case 5:
      return {
        kicker: 'Capital snapshot',
        title: 'What size is the capital stack?',
        subtitle:
          'Ranges are enough for the first review. This keeps the conversation practical without forcing a polished budget.',
        fields: (
          <>
            <FieldGroup label="Estimated loan request">
              <div className="bp-chip-grid">
                {loanRangeOptions.map((option) => (
                  <SelectableChip
                    active={answers.requestedLoan === option}
                    key={option}
                    onClick={() => updateAnswer('requestedLoan', option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Estimated total project cost">
              <div className="bp-chip-grid">
                {loanRangeOptions.map((option) => (
                  <SelectableChip
                    active={answers.projectCost === option}
                    key={option}
                    onClick={() => updateAnswer('projectCost', option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Borrower equity or cash available">
              <div className="bp-chip-grid bp-chip-grid-dense">
                {equityRangeOptions.map((option) => (
                  <SelectableChip
                    active={answers.borrowerEquity === option}
                    key={option}
                    onClick={() => updateAnswer('borrowerEquity', option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </FieldGroup>
          </>
        ),
      }
    case 6:
      return {
        kicker: 'Review contact',
        title: 'Where should we send the next step?',
        subtitle:
          'A DrawFlow reviewer can use this profile to point you toward suitable construction, bridge, or take-out financing options.',
        fields: (
          <>
            <div className="bp-contact-grid">
              <TextField
                icon={User}
                label="Name"
                name="name"
                onChange={(value) => updateAnswer('name', value)}
                placeholder="Your full name"
                required
                value={answers.name}
              />
              <TextField
                icon={Mail}
                label="Email"
                name="email"
                onChange={(value) => updateAnswer('email', value)}
                placeholder="you@example.com"
                required
                type="email"
                value={answers.email}
              />
              <TextField
                icon={Phone}
                label="Phone (optional)"
                name="phone"
                onChange={(value) => updateAnswer('phone', value)}
                placeholder="Best phone number"
                type="tel"
                value={answers.phone}
              />
              <label className="bp-text-field bp-notes-field">
                <span>Anything else we should know?</span>
                <textarea
                  name="notes"
                  onChange={(event) => updateAnswer('notes', event.target.value)}
                  placeholder="Optional notes about timing, lender conversations, or project constraints"
                  value={answers.notes}
                />
              </label>
              <label className="bp-acknowledgement">
                <Checkbox
                  checked={answers.termsAccepted}
                  className="bp-acknowledgement-box"
                  onCheckedChange={(checked) => updateAnswer('termsAccepted', checked === true)}
                />
                <span>
                  I understand FairLend will timestamp this intake and use the information provided
                  to review the project, request follow-up documents, and respond with the next
                  financing step. This is not a funding approval or commitment.
                </span>
              </label>
            </div>

            <p className="bp-final-note">
              <LockKeyhole aria-hidden="true" strokeWidth={1.8} />
              No credit check, no obligation, and no documents required to start.
            </p>
          </>
        ),
      }
    default:
      return {
        kicker: 'DrawFlow intake',
        title: 'Review your project',
        subtitle: 'Continue through the remaining project details.',
        fields: <></>,
      }
  }
}

function BuildPathVisualPanel({
  answers,
  step,
  summaryItems,
  variant = 'builder',
}: {
  answers: HomeownerIntakeAnswers | IntakeAnswers
  step: HomeownerStep | WizardStep
  summaryItems: string[]
  variant?: FairlendBuildIntakeVariant
}): ReactElement {
  const isHomeowner = variant === 'garden-suite-homeowner'
  const visual = isHomeowner
    ? homeownerStepVisuals[step as keyof typeof homeownerStepVisuals]
    : stepVisuals[(step > 1 ? step : 2) as keyof typeof stepVisuals]
  const splitSummary = !isHomeowner && step >= 4 && step <= 6
  const bottomSummaryItems = summaryItems.slice(0, 5)
  const topSummaryItems = isHomeowner
    ? summaryItems.slice(5, 9)
    : getVisualTopSummaryItems(step as WizardStep, summaryItems)

  return (
    <div className="bp-wizard-visual">
      <Image
        alt=""
        aria-hidden="true"
        className="bp-wizard-art"
        decoding="async"
        draggable={false}
        height={1024}
        key={visual.image}
        loading="eager"
        src={visual.image}
        width={1536}
      />

      <div aria-hidden="true" className="bp-visual-annotation bp-visual-annotation-top">
        {visual.label}
        <span>{visual.title}</span>
      </div>

      <div className="bp-visual-card">
        {isHomeowner ? (
          <>
            <p>Garden + laneway</p>
            <strong>{(answers as HomeownerIntakeAnswers).suiteType || 'Property check'}</strong>
            <span>{answers.projectStage || 'Starting point'}</span>
          </>
        ) : (
          <>
            <p>{(answers as IntakeAnswers).buildType}</p>
            <strong>{(answers as IntakeAnswers).unitCount} units</strong>
            <span>{answers.projectStage}</span>
          </>
        )}
      </div>

      {topSummaryItems.length > 0 ? (
        <div className="bp-visual-summary bp-visual-summary-top">
          {topSummaryItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}

      <div
        className={
          splitSummary ? 'bp-visual-summary bp-visual-summary-bottom' : 'bp-visual-summary'
        }
      >
        {bottomSummaryItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function getVisualTopSummaryItems(step: WizardStep, summaryItems: string[]): string[] {
  switch (step) {
    case 4:
      return summaryItems.slice(4, 7)
    case 5:
      return summaryItems.slice(4, 10)
    case 6:
      return summaryItems.slice(8, 11)
    default:
      return []
  }
}

function BuildPathSuccessStep({
  answers,
  leadId,
  onAddAnother,
  onBack,
  summaryItems,
}: {
  answers: IntakeAnswers
  leadId: string | null
  onAddAnother: () => void
  onBack: () => void
  summaryItems: string[]
}): ReactElement {
  const bookReviewHref = buildFairlendIntakeHref({
    address: answers.address,
    email: answers.email,
    intent: 'consultation',
    leadId,
    name: answers.name,
    phone: answers.phone,
    source: 'drawflow-success-book-review',
  })
  const documentHref = buildFairlendIntakeHref({
    address: answers.address,
    email: answers.email,
    intent: 'document-upload',
    leadId,
    name: answers.name,
    phone: answers.phone,
    source: 'drawflow-success-documents',
  })

  return (
    <div className="bp-form-stage bp-wizard-stage">
      <BuildPathVisualPanel answers={answers} step={7} summaryItems={summaryItems} />

      <Card className="bp-form-panel bp-wizard-panel bp-builder-journey-panel bp-success-panel">
        <p className="bp-form-kicker">Project received</p>
        <h1 id="bp-form-title">Your build profile is ready.</h1>
        <p className="bp-form-subtitle">
          We have enough to route the project for an initial construction financing review and
          identify the likely next documents.
        </p>

        <div className="bp-success-seal">
          <Check aria-hidden="true" strokeWidth={2} />
          Intake complete
        </div>

        <div className="bp-success-summary">
          {summaryItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="bp-success-actions">
          <Link className="bp-form-continue" href={bookReviewHref}>
            <span>Book review call</span>
            <CalendarDays aria-hidden="true" strokeWidth={1.8} />
          </Link>
          <Link className="bp-upload-button" href={documentHref}>
            <Upload aria-hidden="true" strokeWidth={1.8} />
            Send document status
          </Link>
        </div>

        <button className="bp-add-another" onClick={onAddAnother} type="button">
          <Plus aria-hidden="true" strokeWidth={1.8} />
          Start another project
        </button>

        <button className="bp-form-back" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
          Back
        </button>
      </Card>
    </div>
  )
}

function HomeownerSuccessStep({
  answers,
  leadId,
  onBack,
  onReset,
  source,
  summaryItems,
}: {
  answers: HomeownerIntakeAnswers
  leadId: string | null
  onBack: () => void
  onReset: () => void
  source: string
  summaryItems: string[]
}): ReactElement {
  const bookReviewHref = buildFairlendIntakeHref({
    address: answers.address,
    email: answers.email,
    intent: 'consultation',
    leadId,
    name: answers.name,
    phone: answers.phone,
    source: `${source}-success-book-review`,
  })

  return (
    <div className="bp-form-stage bp-wizard-stage bp-homeowner-wizard-stage">
      <BuildPathVisualPanel
        answers={answers}
        step={4}
        summaryItems={summaryItems}
        variant="garden-suite-homeowner"
      />

      <Card className="bp-form-panel bp-wizard-panel bp-success-panel bp-homeowner-panel">
        <p className="bp-form-kicker">Property check received</p>
        <h1 id="bp-form-title" tabIndex={-1}>
          Your property check is in.
        </h1>
        <p className="bp-form-subtitle">
          FairLend will review the address, ownership and occupancy context, starting point, and
          financing needs before confirming what may fit. This is a human review, not an automatic
          eligibility decision.
        </p>

        <div className="bp-success-seal">
          <Check aria-hidden="true" strokeWidth={2} />
          Ready for review
        </div>

        <div className="bp-success-summary">
          {summaryItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="bp-success-actions">
          <Link className="bp-form-continue" href={bookReviewHref}>
            <span>Book a property review</span>
            <CalendarDays aria-hidden="true" strokeWidth={1.8} />
          </Link>
          <Link className="bp-upload-button" href="/">
            <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
            Return to FairLend
          </Link>
        </div>

        <button className="bp-add-another" onClick={onReset} type="button">
          <Plus aria-hidden="true" strokeWidth={1.8} />
          Check another property
        </button>

        <button className="bp-form-back" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
          Back
        </button>
      </Card>
    </div>
  )
}

function FinancingTimelineSlider({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void
  value: string
}): ReactElement {
  const fallbackIndex = financingTimelineOptions.indexOf('31-60 days')
  const matchedIndex = financingTimelineOptions.indexOf(
    value as (typeof financingTimelineOptions)[number],
  )
  const selectedIndex = matchedIndex >= 0 ? matchedIndex : fallbackIndex
  const selectedValue = financingTimelineOptions[selectedIndex]

  return (
    <div className="bp-timeline-slider">
      <output className="bp-timeline-slider-readout">
        <CalendarClock aria-hidden="true" strokeWidth={1.8} />
        <span>Selected timing</span>
        <strong>{selectedValue}</strong>
      </output>

      <Slider
        className="bp-timeline-slider-control"
        max={financingTimelineOptions.length - 1}
        min={0}
        onValueChange={([nextIndex]) => {
          const nextValue = financingTimelineOptions[Math.round(nextIndex ?? selectedIndex)]
          if (nextValue) onValueChange(nextValue)
        }}
        step={1}
        thumbLabel="Funding or guidance timeline"
        thumbValueText={selectedValue}
        value={[selectedIndex]}
      />

      <div aria-hidden="true" className="bp-timeline-slider-scale">
        {financingTimelineScaleLabels.map((label, index) => (
          <span
            className={index === selectedIndex ? 'is-selected' : undefined}
            key={label}
            style={
              {
                '--bp-timeline-position': `${(index / (financingTimelineScaleLabels.length - 1)) * 100}%`,
              } as CSSProperties
            }
          >
            <i />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function FieldGroup({ children, label }: { children: ReactElement; label: string }): ReactElement {
  return (
    <section className="bp-field-group">
      <h2>{label}</h2>
      {children}
    </section>
  )
}

function BuildPermitDisclosure({
  fileName,
  onClear,
  onFileSelected,
}: {
  fileName: string
  onClear: () => void
  onFileSelected: (fileName: string) => void
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <details className="bp-permit-disclosure">
      <summary className="bp-permit-trigger">
        <span className="bp-permit-trigger-icon">
          <Upload aria-hidden="true" strokeWidth={1.8} />
        </span>
        <span className="bp-permit-trigger-copy">
          <strong>Already have a build permit?</strong>
          <small>Upload it now and we&apos;ll skip straight to final contact.</small>
        </span>
        <em>{fileName ? 'Permit attached' : 'Optional fast track'}</em>
        <ChevronDown aria-hidden="true" strokeWidth={1.9} />
      </summary>
      <div className="bp-permit-panel" id="bp-permit-upload-panel">
        <div className="bp-permit-panel-inner">
          <label className="bp-permit-upload">
            <input
              accept=".pdf,.png,.jpg,.jpeg,.webp,.heic"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  onFileSelected(file.name)
                }
              }}
              ref={inputRef}
              type="file"
            />
            <Upload aria-hidden="true" strokeWidth={1.8} />
            <span>Upload build permit</span>
            <small>PDF or image file</small>
          </label>

          {fileName ? (
            <div className="bp-permit-file">
              <FileText aria-hidden="true" strokeWidth={1.8} />
              <span>{fileName}</span>
              <button
                onClick={() => {
                  onClear()
                  if (inputRef.current) {
                    inputRef.current.value = ''
                  }
                }}
                type="button"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  )
}

function SelectableCard({
  active,
  children,
  icon: Icon,
  onClick,
}: {
  active: boolean
  children: string
  icon: LucideIcon
  onClick: () => void
}): ReactElement {
  return (
    <Card
      className={
        active
          ? 'bp-status-option bp-select-card fairlend-choice-pill is-selected'
          : 'bp-status-option bp-select-card fairlend-choice-pill'
      }
      render={<button aria-pressed={active} onClick={onClick} type="button" />}
    >
      <OptionCardIcon icon={Icon} />
      <span>{children}</span>
      {active ? <Check aria-hidden="true" className="bp-status-check" strokeWidth={2} /> : null}
    </Card>
  )
}

function OptionCardIcon({ icon: Icon }: { icon: LucideIcon }): ReactElement {
  return (
    <span aria-hidden="true" className="bp-option-icon">
      <Icon strokeWidth={1.7} />
    </span>
  )
}

function TextField({
  autoComplete,
  icon: Icon,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: {
  autoComplete?: string
  icon: LucideIcon
  label: string
  name?: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  type?: 'email' | 'tel' | 'text'
  value: string
}): ReactElement {
  const resolvedAutoComplete =
    autoComplete ?? (type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'name')
  return (
    <label className="bp-text-field">
      <span>{label}</span>
      <div className="bp-address-input">
        <Icon aria-hidden="true" strokeWidth={1.8} />
        <input
          autoComplete={resolvedAutoComplete}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </div>
    </label>
  )
}

function toggleMultiValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }
  if (value === 'None yet' || value === 'Not sure') {
    return [value]
  }
  return [...values.filter((item) => item !== 'None yet' && item !== 'Not sure'), value]
}

function validateHomeownerStep(step: HomeownerStep, answers: HomeownerIntakeAnswers): string {
  if (step === 1) {
    if (!answers.siteControl) {
      return 'Choose your connection to the property.'
    }
    if (answers.siteControl !== "I don't have a property yet" && !answers.address.trim()) {
      return 'Add the property address so FairLend can review the site.'
    }
    if (answers.siteControl !== "I don't have a property yet" && !answers.occupancy) {
      return 'Choose who currently lives at the property.'
    }
    if (!answers.suiteType) {
      return 'Choose the type of suite you have in mind, or select “Not sure which fits.”'
    }
  }

  if (step === 2) {
    if (!answers.projectStage) {
      return 'Choose the option that best describes where you are starting.'
    }
    if (answers.financingNeeds.length === 0) {
      return 'Choose at least one area where you would like help.'
    }
    if (!answers.approximateEquity) {
      return 'Choose a rough cash or home equity contribution, or select “Not sure.”'
    }
    if (!answers.timeline) {
      return 'Choose when you would like to get started.'
    }
  }

  if (step === 3) {
    if (!answers.name.trim() || !isValidIntakeEmail(answers.email)) {
      return 'Add your name and a valid email before sending the property check.'
    }
    if (!answers.termsAccepted) {
      return 'Confirm the acknowledgement before sending the property check.'
    }
  }

  return ''
}

function trackBuilderValidationFailure(step: WizardStep, source: string): void {
  const safeStep = Math.min(step, TOTAL_STEPS)
  trackFairlendEvent('fairlend_intake_validation_failed', {
    form_id: 'fairlend_builder',
    journey_type: 'builder',
    source,
    step_key: builderStepKeys[safeStep - 1],
    step_number: safeStep,
    total_steps: TOTAL_STEPS,
  })
}

function trackHomeownerValidationFailure(step: HomeownerStep, source: string): void {
  const safeStep = Math.min(step, HOMEOWNER_TOTAL_STEPS)
  trackFairlendEvent('fairlend_intake_validation_failed', {
    form_id: 'fairlend_homeowner_garden_suite',
    journey_type: 'homeowner_garden_suite',
    source,
    step_key: homeownerStepKeys[safeStep - 1],
    step_number: safeStep,
    total_steps: HOMEOWNER_TOTAL_STEPS,
  })
}

async function persistHomeownerLead({
  answers,
  leadId,
  source,
  status,
}: {
  answers: HomeownerIntakeAnswers
  leadId: string | null
  source: string
  status: 'draft' | 'submitted'
}): Promise<LeadSubmissionResponse | null> {
  try {
    const response = await fetch('/api/leads', {
      body: JSON.stringify({
        analyticsContext: status === 'submitted' ? getAnalyticsContext() : undefined,
        address: answers.address,
        email: answers.email,
        id: leadId ?? undefined,
        intake: {
          approximateEquity: answers.approximateEquity,
          completionStatus: status === 'submitted' ? 'complete' : 'partial',
          financingNeeds: answers.financingNeeds,
          intakeVariant: 'garden-suite-homeowner',
          notes: answers.notes,
          occupancy: answers.occupancy,
          projectScope: gardenSuiteProjectScopeLabel,
          projectStage: answers.projectStage,
          siteControl: answers.siteControl,
          suiteType: answers.suiteType,
          termsAccepted: answers.termsAccepted,
          timeline: answers.timeline,
        },
        intent: 'build',
        name: answers.name,
        phone: answers.phone,
        source,
        status,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) return null

    return (await response.json()) as LeadSubmissionResponse
  } catch {
    return null
  }
}

async function persistLeadDraft({
  answers,
  leadId,
  source,
  status,
}: {
  answers: IntakeAnswers
  leadId: string | null
  source: string
  status: 'draft' | 'submitted'
}): Promise<LeadSubmissionResponse | null> {
  try {
    const response = await fetch('/api/leads', {
      body: JSON.stringify({
        analyticsContext: status === 'submitted' ? getAnalyticsContext() : undefined,
        address: answers.address,
        email: answers.email,
        id: leadId ?? undefined,
        intake: {
          ...answers,
          borrowerExperience: '',
          completionStatus: 'complete',
          contactRole: '',
          notes: answers.notes,
          projectTeam: [],
          siteControl: '',
        },
        intent: 'build',
        name: answers.name,
        phone: answers.phone,
        source,
        status,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as LeadSubmissionResponse
  } catch {
    return null
  }
}

function isValidIntakeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function buildProjectSummary(answers: IntakeAnswers): string[] {
  const primaryNeed = answers.financingNeeds[0] ?? 'Financing path'
  const secondaryNeed = answers.financingNeeds[1]
  return [
    answers.address || 'Property details pending',
    answers.projectScope || 'Project scope pending',
    answers.buildType,
    `${answers.unitCount} units`,
    answers.projectStage,
    primaryNeed,
    secondaryNeed,
    answers.financingTimeline,
    `${answers.requestedLoan} request`,
    `${answers.projectCost} total cost`,
    `${answers.borrowerEquity} equity`,
  ].filter(Boolean)
}

function buildHomeownerSummary(answers: HomeownerIntakeAnswers): string[] {
  const supportSummary = answers.financingNeeds.length
    ? `${answers.financingNeeds[0]}${
        answers.financingNeeds.length > 1 ? ` + ${answers.financingNeeds.length - 1} more` : ''
      }`
    : 'Support needs pending'

  return [
    answers.address || 'No specific property yet',
    answers.suiteType || 'Suite type pending',
    answers.siteControl || 'Ownership pending',
    answers.occupancy === 'Not applicable' ? '' : answers.occupancy,
    answers.projectStage || 'Starting point pending',
    supportSummary,
    answers.approximateEquity || 'Contribution pending',
    answers.timeline || 'Timing pending',
  ].filter(Boolean)
}
