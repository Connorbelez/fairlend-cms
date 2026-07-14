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

import './lead-intake.css'

import { MortgageChoiceOption } from './MortgageChoiceOption.client'

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
import {
  completeLeadAnalytics,
  getAnalyticsContext,
  resolveJourneyType,
  trackFairlendEvent,
  trackLeadFailed,
  type JourneyType,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'
import { getFairlendMicrosoftBookingsUrl } from '@/lib/fairlend-bookings'
import {
  buildFairlendIntakeHref,
  type FairlendRentalPropertyTransaction,
  type FairlendGenericLeadIntent,
  normalizeFairlendIntakeIntent,
  resolveFairlendRentalPropertyTransaction,
} from '@/lib/fairlend-intake'
import {
  institutionalResidentialMortgageGoals,
  privateMortgageSituationOptions,
  residentialMortgageSituationOptions,
  resolveResidentialMortgageProduct,
  type ResolvedMortgageProduct,
} from '@/lib/fairlend-mortgage'

type LeadCaptureState = 'idle' | 'submitting' | 'success' | 'error'
type MortgageIntakeVariant = 'hero' | 'page'
type InvestorIntakeVariant = 'hero' | 'page'
type SubmittedMortgageProduct = ResolvedMortgageProduct | 'rental-property'
type MortgageProduct = SubmittedMortgageProduct | 'residential'

type FairlendLeadIntakeProps = {
  intentOverride?: FairlendGenericLeadIntent
  investorVariant?: InvestorIntakeVariant
  mortgageProduct?: MortgageProduct
  mortgageVariant?: MortgageIntakeVariant
  rentalPropertyTransaction?: FairlendRentalPropertyTransaction
  sourceOverride?: string
}

type LeadCaptureValues = {
  address: string
  additionalDebtAmount: string
  additionalLiens: string
  additionalLienDetails: string
  amount: string
  currentMortgage: string
  documentStatus: string
  email: string
  exitPlan: string
  grossRentalIncome: string
  message: string
  name: string
  numberOfUnits: string
  occupancyStatus: string
  ownershipStatus: string
  ownershipStructure: string
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
  'Individual',
  'Family office',
  'MIC / investment fund',
  'Syndicate / JV',
  'Self-directed capital',
] as const

const investorCapitalOptions = ['$50K – $250K', '$250K – $1M', '$1M – $5M', '$5M+'] as const

const investorTermOptions = ['6–12 months', '12–24 months', 'Open / flexible'] as const

const investorExperienceOptions = [
  'New to private lending',
  '1–3 mortgage deals',
  'Experienced lender',
  'Professional investor',
] as const

const investorMortgageTypeOptions = [
  'First mortgages',
  'Second mortgages',
  'Construction financing',
  'Open to the right file',
] as const

const investorPriorityOptions = [
  'Conservative LTV',
  'Income consistency',
  'Shorter terms',
  'Hands-off administration',
] as const

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
  { label: 'Borrower', detail: 'Equity-based file · Southern Ontario' },
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

const mortgagePropertyUseOptions = ['Primary residence', 'Rental property', 'Other'] as const

const mortgagePropertyValueOptions = ['Under $750K', '$750K-$1.5M', '$1.5M+ / not sure'] as const

const mortgageCurrentBalanceOptions = [
  'No current mortgage',
  'Under $250K',
  '$250K-$750K',
  '$750K+ / not sure',
] as const

const mortgageAdditionalLiensOptions = [
  'No additional debt',
  'Under $50K',
  '$50K-$100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$750K',
  '$750K+ / not sure',
] as const

const institutionalMortgageGoalOptions = [
  ...institutionalResidentialMortgageGoals,
  'Renew or transfer a mortgage',
  'Refinance for a better structure',
  'Access equity',
  'Consolidate debt',
] as const

const institutionalApplicationStatusOptions = [
  'Exploring before I apply',
  'My bank declined the file',
  'My bank terms do not fit',
  'My renewal is approaching',
  'I already have an approval to compare',
] as const

const institutionalPropertyUseOptions = [
  'Owner-occupied home',
  'Residential rental',
  'Multi-unit residential',
  'Mixed-use or commercial',
  'Other / not sure',
] as const

const institutionalPropertyValueOptions = [
  'Under $750K',
  '$750K-$1.5M',
  '$1.5M-$3M',
  '$3M+ / not sure',
] as const

const institutionalMortgageAmountOptions = [
  'Under $250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$3M',
  '$3M+ / not sure',
] as const

const institutionalIncomeOptions = [
  'Salaried / T4 income',
  'Self-employed',
  'Business or corporate income',
  'Rental or investment income',
  'Multiple income sources',
] as const

const institutionalCreditOptions = [
  'Excellent (720+)',
  'Good (680-719)',
  'Fair (620-679)',
  'Below 620',
  'Not sure',
] as const

const institutionalTimelineOptions = [
  'Closing in under 30 days',
  'Closing in 30-60 days',
  'Renewal within 90 days',
  'Planning 3+ months ahead',
] as const

const rentalPropertyTransactionOptions = ['Acquisition / purchase', 'Refinance'] as const

const rentalAcquisitionStatusOptions = [
  'Property identified — no offer yet',
  'Conditional offer / due diligence',
  'Firm purchase agreement',
  'Still searching',
] as const

const rentalRefinanceStatusOptions = [
  'I am on title',
  'My corporation or partnership is on title',
  'I represent the registered owner',
  'An ownership or title change is planned',
] as const

const rentalOwnershipStructureOptions = [
  'Individual / joint ownership',
  'Corporation',
  'Partnership / joint venture',
  'Trust',
  'To be determined / other',
] as const

const rentalPropertyTypeOptions = [
  '2–4 unit rental',
  '5+ unit apartment',
  'Mixed-use with residential units',
  'Student / rooming house',
  'Other existing rental',
] as const

const rentalPropertyTypesWithUnitCount = new Set<string>([
  'Mixed-use with residential units',
  'Student / rooming house',
  'Other existing rental',
])

const rentalAmountRangeOptions = [
  'Under $250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$2.5M',
  '$2.5M-$5M',
  '$5M+ / not sure',
] as const

const rentalPropertyValueRangeOptions = [
  'Under $750K',
  '$750K-$1.5M',
  '$1.5M-$3M',
  '$3M-$5M',
  '$5M-$10M',
  '$10M+ / not sure',
] as const

const rentalMortgageBalanceRangeOptions = [
  'No current mortgage',
  ...rentalAmountRangeOptions,
] as const

const rentalOccupancyOptions = [
  'Fully occupied',
  'Partially occupied',
  'Vacant',
  'Under renovation / lease-up',
] as const

const rentalAcquisitionFinancingOptions = [
  'No other financing arranged',
  'Bank / institutional lender reviewing',
  'Private lender reviewing',
  'Vendor take-back or secondary financing',
  'Financing already approved / committed',
] as const

const rentalRefinanceEncumbranceOptions = [
  'Existing first mortgage only',
  'First mortgage plus other liens / encumbrances',
  'Tax, construction, or judgment lien',
  'Other debt (unsecured or non-property debt)',
  'Another lender is reviewing this refinance',
  'Not sure',
] as const

const rentalFinancingTimelineOptions = [
  'Within 30 days',
  '31–60 days',
  '61–90 days',
  'More than 90 days / exploring',
] as const

const mortgageDraftStorageKey = 'fairlend-private-mortgage-intake-v1'
const institutionalMortgageDraftStorageKey = 'fairlend-institutional-mortgage-intake-v1'
const residentialMortgageDraftStorageKey = 'fairlend-residential-mortgage-intake-v1'
const rentalPropertyAcquisitionDraftStorageKey = 'fairlend-rental-property-acquisition-intake-v1'
const rentalPropertyRefinanceDraftStorageKey = 'fairlend-rental-property-refinance-intake-v1'
const mortgageTotalSteps = 5
const investorDraftStorageKey = 'fairlend-private-mortgage-investor-intake-v1'
const investorTotalSteps = 4

const mortgageStepKeys = ['objective', 'property', 'financing', 'qualification', 'contact'] as const
const investorStepKeys = ['investor_fit', 'capital_timing', 'deal_criteria', 'contact'] as const

function getLeadIntakeStepKey(journeyType: JourneyType, step: number): string {
  const keys = journeyType === 'investor' ? investorStepKeys : mortgageStepKeys
  return keys[step - 1] ?? `step_${step}`
}

const emptyValues: LeadCaptureValues = {
  address: '',
  additionalDebtAmount: '',
  additionalLienDetails: '',
  additionalLiens: '',
  amount: '',
  currentMortgage: '',
  documentStatus: '',
  email: '',
  exitPlan: '',
  grossRentalIncome: '',
  message: '',
  name: '',
  numberOfUnits: '',
  occupancyStatus: '',
  ownershipStatus: '',
  ownershipStructure: '',
  phone: '',
  propertyUse: '',
  propertyValue: '',
  role: '',
  situation: '',
  timeline: '',
}

export function FairlendLeadIntake({
  intentOverride,
  investorVariant = 'page',
  mortgageProduct = 'private',
  mortgageVariant = 'page',
  rentalPropertyTransaction,
  sourceOverride,
}: FairlendLeadIntakeProps = {}) {
  const searchParams = useSearchParams()
  const intent =
    intentOverride ??
    (normalizeFairlendIntakeIntent(searchParams.get('intent')) as FairlendGenericLeadIntent)
  const isMortgageIntent = intent === 'mortgage'
  const isInstitutionalMortgage = isMortgageIntent && mortgageProduct === 'institutional'
  const isResidentialMortgage = isMortgageIntent && mortgageProduct === 'residential'
  const isRentalPropertyMortgage = isMortgageIntent && mortgageProduct === 'rental-property'
  const isInvestorIntent = intent === 'invest'
  const isInvestorHero = isInvestorIntent && investorVariant === 'hero'
  const isDraftedWizard = isMortgageIntent || isInvestorHero
  const wizardTotalSteps = isInvestorHero ? investorTotalSteps : mortgageTotalSteps
  const copy = intakeCopyByIntent[intent] ?? intakeCopyByIntent.contact
  const source = sourceOverride?.trim() || searchParams.get('source')?.trim() || `intake-${intent}`
  const initialRentalPropertyTransaction =
    rentalPropertyTransaction ?? resolveFairlendRentalPropertyTransaction(source)
  const initialRentalSituation =
    initialRentalPropertyTransaction === 'acquisition'
      ? rentalPropertyTransactionOptions[0]
      : initialRentalPropertyTransaction === 'refinance'
        ? rentalPropertyTransactionOptions[1]
        : ''
  const wizardDraftStorageKey = isInvestorHero
    ? investorDraftStorageKey
    : isInstitutionalMortgage
      ? institutionalMortgageDraftStorageKey
      : isResidentialMortgage
        ? residentialMortgageDraftStorageKey
        : isRentalPropertyMortgage
          ? initialRentalPropertyTransaction === 'refinance'
            ? rentalPropertyRefinanceDraftStorageKey
            : rentalPropertyAcquisitionDraftStorageKey
          : mortgageDraftStorageKey
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
    situation: initialRentalSituation,
  }))
  const resolvedMortgageProduct: SubmittedMortgageProduct | null =
    mortgageProduct === 'residential'
      ? resolveResidentialMortgageProduct(values.situation)
      : mortgageProduct
  const journeyType = resolveJourneyType({
    intent,
    mortgageProduct,
    rentalTransaction: initialRentalPropertyTransaction ?? undefined,
    source,
  })
  const formId = `fairlend_${journeyType}`
  const didTrackStart = useRef(false)
  const resumedDraft = useRef(false)

  useEffect(() => {
    if (!isDraftedWizard) return

    const hydrateFrame = window.requestAnimationFrame(() => {
      try {
        const savedDraft = window.localStorage.getItem(wizardDraftStorageKey)
        if (savedDraft) {
          resumedDraft.current = true
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
            setMortgageStep(Math.min(Math.max(parsedDraft.step, 1), wizardTotalSteps))
          }
        }
      } catch {
        // Draft storage can be unavailable or contain stale data. The form still works without it.
      } finally {
        setMortgageDraftHydrated(true)
      }
    })

    return () => window.cancelAnimationFrame(hydrateFrame)
  }, [isDraftedWizard, wizardDraftStorageKey, wizardTotalSteps])

  useEffect(() => {
    if (didTrackStart.current || (isDraftedWizard && !mortgageDraftHydrated)) return
    didTrackStart.current = true
    const stepNumber = isDraftedWizard ? mortgageStep : 1
    const properties = {
      form_id: formId,
      form_variant: isDraftedWizard ? (isInvestorHero ? investorVariant : mortgageVariant) : 'single',
      journey_type: journeyType,
      source,
      step_key: getLeadIntakeStepKey(journeyType, stepNumber),
      step_number: stepNumber,
      total_steps: isDraftedWizard ? wizardTotalSteps : 1,
    }
    if (resumedDraft.current) {
      trackFairlendEvent('fairlend_intake_resumed', properties)
    } else {
      trackFairlendEvent('fairlend_intake_started', properties)
    }
    trackFairlendEvent('fairlend_intake_step_viewed', properties)
  }, [
    formId,
    intent,
    investorVariant,
    isDraftedWizard,
    isInvestorHero,
    journeyType,
    mortgageDraftHydrated,
    mortgageStep,
    mortgageVariant,
    source,
    wizardTotalSteps,
  ])

  useEffect(() => {
    if (!isDraftedWizard || !mortgageDraftHydrated || state === 'success') return

    try {
      window.localStorage.setItem(
        wizardDraftStorageKey,
        JSON.stringify({ step: mortgageStep, values }),
      )
    } catch {
      // Autosave is progressive enhancement; submission does not depend on it.
    }
  }, [isDraftedWizard, mortgageDraftHydrated, mortgageStep, state, values, wizardDraftStorageKey])
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
      situation: initialRentalSituation,
    })
    setMortgageStep(1)
    setErrors({})
    setState('idle')

    try {
      window.localStorage.removeItem(wizardDraftStorageKey)
    } catch {
      // The form is still reset in memory if storage is unavailable.
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement> | null,
    completionStatus: 'complete' | 'partial' = 'complete',
  ): Promise<void> {
    event?.preventDefault()

    const validationErrors = validateLeadCapture(values, {
      requiresName,
      requiresPhone: isRentalPropertyMortgage,
    })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      trackFairlendEvent('fairlend_intake_validation_failed', {
        form_id: formId,
        journey_type: journeyType,
        source,
        step_key: getLeadIntakeStepKey(journeyType, isDraftedWizard ? mortgageStep : 1),
        step_number: isDraftedWizard ? mortgageStep : 1,
        total_steps: isDraftedWizard ? wizardTotalSteps : 1,
      })
      return
    }

    setState('submitting')
    setErrors({})

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          analyticsContext: getAnalyticsContext(),
          address: values.address,
          email: values.email,
          id: leadId ?? undefined,
          intent,
          intake: {
            additionalDebtAmount: values.additionalDebtAmount,
            additionalLiens: values.additionalLiens,
            additionalLienDetails: values.additionalLienDetails,
            amount: values.amount,
            currentMortgage: values.currentMortgage,
            completionStatus,
            detail:
              completionStatus === 'partial'
                ? ['[Partial intake]', values.message].filter(Boolean).join(' ')
                : values.message,
            documentStatus: values.documentStatus,
            exitPlan: values.exitPlan,
            grossRentalIncome: values.grossRentalIncome,
            page: isInstitutionalMortgage ? '/borrowers/institutional-mortgage' : '/intake',
            mortgageProduct: isMortgageIntent ? resolvedMortgageProduct : undefined,
            numberOfUnits: values.numberOfUnits,
            occupancyStatus: values.occupancyStatus,
            ownershipStatus: values.ownershipStatus,
            ownershipStructure: values.ownershipStructure,
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

      const payload = (await response.json().catch(() => null)) as LeadSubmissionResponse | null

      if (!response.ok) {
        throw new Error('Lead capture failed')
      }

      setLeadId(payload?.id ?? leadId)
      if (completionStatus === 'partial') {
        trackFairlendEvent('fairlend_intake_partial_submitted', {
          completion_status: 'partial',
          form_id: formId,
          journey_type: journeyType,
          source,
        })
      }
      completeLeadAnalytics(payload, {
        completion_status: completionStatus,
        form_id: formId,
        journey_type: journeyType,
        source,
      })
      setState('success')
      if (isDraftedWizard) {
        try {
          window.localStorage.removeItem(wizardDraftStorageKey)
        } catch {
          // The request is already saved; clearing the local draft is best effort.
        }
      }
    } catch (error) {
      console.error('FairLend lead intake failed', error)
      trackLeadFailed({
        form_id: formId,
        journey_type: journeyType,
        source,
      })
      setState('error')
    }
  }

  if (state === 'success' && isMortgageIntent) {
    return (
      <MortgageIntakeSuccess
        consultationFollowUpHref={consultationFollowUpHref}
        product={resolvedMortgageProduct ?? 'private'}
        values={values}
        variant={mortgageVariant}
      />
    )
  }

  if (state === 'success' && isInvestorHero) {
    return <InvestorIntakeSuccess consultationFollowUpHref={consultationFollowUpHref} />
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
                    data-consultation-booking=""
                    data-consultation-booking-source={`${source}-scheduler`}
                    href={bookingsUrl}
                    onClick={() =>
                      trackFairlendEvent('fairlend_consultation_scheduler_opened', {
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
        formId={formId}
        journeyType={journeyType}
        onReset={resetMortgageDraft}
        onSubmit={handleSubmit}
        setStep={setMortgageStep}
        state={state}
        step={mortgageStep}
        updateField={updateField}
        values={values}
        variant={mortgageVariant}
        mode={
          isInstitutionalMortgage
            ? 'institutional'
            : isResidentialMortgage
              ? 'residential'
              : isRentalPropertyMortgage
                ? 'rental-property'
                : 'mortgage'
        }
      />
    )
  }

  if (isInvestorHero) {
    return (
      <MortgageIntakeWizard
        errors={errors}
        formId={formId}
        journeyType={journeyType}
        onReset={resetMortgageDraft}
        onSubmit={handleSubmit}
        setStep={setMortgageStep}
        state={state}
        step={mortgageStep}
        updateField={updateField}
        values={values}
        variant="hero"
        mode="investor"
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
  product,
  values,
  variant,
}: {
  consultationFollowUpHref: string
  product: SubmittedMortgageProduct
  values: LeadCaptureValues
  variant: MortgageIntakeVariant
}) {
  const isInstitutional = product === 'institutional'
  const isRentalProperty = product === 'rental-property'
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
        <h1 id="fl-mortgage-success-title">
          Your{' '}
          {isRentalProperty
            ? 'rental property financing'
            : `${isInstitutional ? 'institutional ' : ''}mortgage`}{' '}
          file is with FairLend.
        </h1>
        <p className="fl-mortgage-success-lede">
          {isRentalProperty
            ? 'A specialist can now review the transaction, ownership, property, rent, existing debt, requested proceeds, and timing before the first conversation.'
            : isInstitutional
              ? 'A specialist can now review the property, financing request, income profile, credit range, and timing before matching the file to institutional lender criteria.'
              : 'A specialist can now review the property, amount, timing, and repayment path before the next conversation.'}
        </p>

        <ol className="fl-mortgage-success-route" aria-label="What happens next">
          <li>
            <span>01</span>
            <strong>Review the file</strong>
            <p>FairLend checks the context and identifies the practical financing lane.</p>
          </li>
          <li>
            <span>02</span>
            <strong>{isInstitutional ? 'Match lender criteria' : 'Prepare the options'}</strong>
            <p>
              {isInstitutional
                ? 'A specialist identifies the institutional programs that fit the complete file.'
                : 'A specialist organizes the questions and next documents, if any are needed.'}
            </p>
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
          <MortgageFileVisual product={product} step={mortgageTotalSteps} values={values} />
          {successPanel}
        </section>
      </Frame>
    </main>
  )
}

function InvestorIntakeSuccess({ consultationFollowUpHref }: { consultationFollowUpHref: string }) {
  return (
    <div
      className="fl-mortgage-hero-embed fl-mortgage-hero-embed--success"
      data-intake-mode="investor"
    >
      <Card className="fl-mortgage-wizard-panel fl-mortgage-success-panel">
        <div className="fl-mortgage-success-content">
          <div className="fl-mortgage-success-mark" aria-hidden="true">
            <Check />
          </div>
          <p className="fl-mortgage-step-label">Investor profile received</p>
          <h1 id="fl-investor-success-title">Your investor review is with FairLend.</h1>
          <p className="fl-mortgage-success-lede">
            The investor team can now review your capital range, experience, timeline, and deal
            preferences before the first conversation.
          </p>

          <ol className="fl-mortgage-success-route" aria-label="What happens next">
            <li>
              <span>01</span>
              <strong>Review investor fit</strong>
              <p>FairLend checks whether private mortgage investing matches your stated profile.</p>
            </li>
            <li>
              <span>02</span>
              <strong>Discuss the criteria</strong>
              <p>Walk through security, LTV, term, administration, and private-credit risk.</p>
            </li>
            <li>
              <span>03</span>
              <strong>Confirm the next step</strong>
              <p>You will know what information is needed before reviewing any opportunity.</p>
            </li>
          </ol>

          <div className="fl-mortgage-success-actions">
            <Button asChild className="fl-mortgage-continue">
              <Link href={consultationFollowUpHref}>
                Request an investor consultation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <p className="fl-mortgage-consent">
            Private mortgage investments involve risk and are not bank deposits or guaranteed-return
            products.
          </p>
        </div>
      </Card>
    </div>
  )
}

function MortgageIntakeWizard({
  errors,
  formId,
  journeyType,
  mode,
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
  formId: string
  journeyType: JourneyType
  mode: 'institutional' | 'investor' | 'mortgage' | 'rental-property' | 'residential'
  onReset: () => void
  onSubmit: (
    event: FormEvent<HTMLFormElement> | null,
    completionStatus?: 'complete' | 'partial',
  ) => Promise<void>
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
  const isInvestor = mode === 'investor'
  const isResidential = mode === 'residential'
  const isRentalProperty = mode === 'rental-property'
  const isRentalRefinance = values.situation === rentalPropertyTransactionOptions[1]
  const residentialProduct = isResidential
    ? resolveResidentialMortgageProduct(values.situation)
    : null
  const isInstitutional = mode === 'institutional' || residentialProduct === 'institutional'
  const isPrivateMortgage = mode === 'mortgage' || residentialProduct === 'private'
  const totalSteps = isInvestor ? investorTotalSteps : mortgageTotalSteps
  const canSkipAndSubmit =
    !isInvestor &&
    step > 1 &&
    step < totalSteps &&
    Boolean(values.situation && values.name.trim() && isValidEmail(values.email)) &&
    (!isRentalProperty || Boolean(values.phone.trim()))

  const stepContent = isInvestor
    ? getInvestorStepContent(step)
    : isRentalProperty
      ? getRentalPropertyStepContent(step, values.situation)
      : isResidential && step === 1
        ? getResidentialMortgageStepContent()
        : isInstitutional
          ? getInstitutionalMortgageStepContent(step)
          : getMortgageStepContent(step)

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step

    trackFairlendEvent('fairlend_intake_step_viewed', {
      form_id: formId,
      journey_type: journeyType,
      step_key: getLeadIntakeStepKey(journeyType, step),
      step_number: step,
      total_steps: totalSteps,
    })

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
  }, [formId, journeyType, step, totalSteps, variant])

  function choose<Key extends keyof LeadCaptureValues>(
    field: Key,
    value: LeadCaptureValues[Key],
  ): void {
    updateField(field, value)
    setStepError('')
  }

  function chooseResidentialSituation(value: string): void {
    const previousProduct = resolveResidentialMortgageProduct(values.situation)
    const nextProduct = resolveResidentialMortgageProduct(value)

    choose('situation', value)
    if (previousProduct && previousProduct !== nextProduct) {
      choose('additionalLiens', '')
      choose('amount', '')
      choose('currentMortgage', '')
      choose('documentStatus', '')
      choose('exitPlan', '')
      choose('propertyUse', '')
      choose('propertyValue', '')
      choose('role', '')
      choose('timeline', '')
    }
  }

  function chooseRentalPropertyTransaction(value: string): void {
    if (values.situation && values.situation !== value) {
      choose('additionalDebtAmount', '')
      choose('additionalLienDetails', '')
      choose('additionalLiens', '')
      choose('currentMortgage', '')
      choose('ownershipStatus', '')
      choose('propertyValue', '')
    }
    choose('situation', value)
  }

  function chooseRentalPropertyUse(value: string): void {
    if (!rentalPropertyTypesWithUnitCount.has(value)) {
      choose('numberOfUnits', '')
    }
    choose('propertyUse', value)
  }

  function chooseRentalEncumbrance(value: string): void {
    if (values.additionalLiens !== value) {
      choose('additionalDebtAmount', '')
      choose('additionalLienDetails', '')
    }
    choose('additionalLiens', value)
  }

  function moveForward(): void {
    const nextError = isInvestor
      ? validateInvestorStep(step, values)
      : isRentalProperty
        ? validateRentalPropertyStep(step, values)
        : isInstitutional
          ? validateInstitutionalMortgageStep(step, values)
          : validateMortgageStep(step, values)
    if (nextError) {
      setStepError(nextError)
      trackFairlendEvent('fairlend_intake_validation_failed', {
        form_id: formId,
        journey_type: journeyType,
        step_key: getLeadIntakeStepKey(journeyType, step),
        step_number: step,
        total_steps: totalSteps,
      })
      return
    }

    trackFairlendEvent('fairlend_intake_step_completed', {
      form_id: formId,
      journey_type: journeyType,
      step_key: getLeadIntakeStepKey(journeyType, step),
      step_number: step,
      total_steps: totalSteps,
    })
    setStep(Math.min(step + 1, totalSteps))
    setStepError('')
  }

  function handleWizardSubmit(event: FormEvent<HTMLFormElement>): void {
    if (step < totalSteps) {
      event.preventDefault()
      moveForward()
      return
    }

    void onSubmit(event, 'complete')
  }

  const RootElement = variant === 'hero' ? 'div' : 'main'

  return (
    <RootElement
      className={variant === 'hero' ? 'fl-mortgage-hero-embed' : 'fl-mortgage-wizard-page'}
      data-intake-mode={mode}
      data-step={step}
    >
      <Frame className="fl-mortgage-wizard-frame">
        <section aria-labelledby="fl-mortgage-step-title" className="fl-mortgage-wizard-stage">
          {variant === 'page' ? (
            <MortgageFileVisual
              product={
                isRentalProperty
                  ? 'rental-property'
                  : isInstitutional
                    ? 'institutional'
                    : isPrivateMortgage
                      ? 'private'
                      : 'residential'
              }
              step={step}
              values={values}
            />
          ) : (
            <div className="fl-mortgage-hero-filebar" aria-live="polite">
              <span>
                {isInvestor
                  ? 'Your investor profile'
                  : isInstitutional
                    ? 'Your institutional mortgage file'
                    : isResidential && isPrivateMortgage
                      ? 'Your private mortgage file'
                      : 'Your mortgage file'}
              </span>
              <strong>
                {step === 1
                  ? isInvestor
                    ? 'Start with your fit'
                    : 'Start with the situation'
                  : `${step - 1} ${step === 2 ? 'section' : 'sections'} complete`}
              </strong>
            </div>
          )}

          <Card className="fl-mortgage-wizard-panel" data-mortgage-variant={variant}>
            <form className="fl-mortgage-wizard-form" noValidate onSubmit={handleWizardSubmit}>
              <div className="fl-mortgage-progress" aria-label={`Step ${step} of ${totalSteps}`}>
                <span>
                  Step {step} of {totalSteps}
                </span>
                <span className="fl-mortgage-progress__track" aria-hidden="true">
                  <i style={{ transform: `scaleX(${step / totalSteps})` }} />
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
                {isRentalProperty && step === 1 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="Is this a purchase or a refinance?"
                      onSelect={chooseRentalPropertyTransaction}
                      options={rentalPropertyTransactionOptions}
                      selectedValue={values.situation}
                    />
                    <MortgageChoiceGroup
                      label={
                        isRentalRefinance
                          ? 'What is your ownership status?'
                          : 'Where are you in the acquisition?'
                      }
                      onSelect={(value) => choose('ownershipStatus', value)}
                      options={
                        isRentalRefinance
                          ? rentalRefinanceStatusOptions
                          : rentalAcquisitionStatusOptions
                      }
                      selectedValue={values.ownershipStatus}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="How is the property owned or expected to be owned?"
                      onSelect={(value) => choose('ownershipStructure', value)}
                      options={rentalOwnershipStructureOptions}
                      selectedValue={values.ownershipStructure}
                    />
                  </>
                ) : null}

                {isRentalProperty && step === 2 ? (
                  <>
                    <GoogleAddressAutocomplete
                      autoComplete="street-address"
                      className="fl-mortgage-field fl-mortgage-address"
                      id="rental-property-address"
                      inputClassName="fl-mortgage-input"
                      label="Property address"
                      labelClassName="fl-mortgage-field-label"
                      onChange={(value) => choose('address', value)}
                      placeholder="Start typing the rental property address"
                      value={values.address}
                    />
                    <MortgageChoiceGroup
                      label="What type of rental property is it?"
                      onSelect={chooseRentalPropertyUse}
                      options={rentalPropertyTypeOptions}
                      selectedValue={values.propertyUse}
                    />
                    {rentalPropertyTypesWithUnitCount.has(values.propertyUse) ? (
                      <div className="fl-mortgage-contact-grid">
                        <TextField
                          appearance="mortgage"
                          id="rental-number-of-units"
                          inputMode="numeric"
                          label="Number of residential units"
                          onChange={(value) => choose('numberOfUnits', value)}
                          placeholder="e.g. 12"
                          required
                          value={values.numberOfUnits}
                        />
                      </div>
                    ) : null}
                    <MortgageChoiceGroup
                      compact
                      label="What is the current occupancy?"
                      onSelect={(value) => choose('occupancyStatus', value)}
                      options={rentalOccupancyOptions}
                      selectedValue={values.occupancyStatus}
                    />
                  </>
                ) : null}

                {isRentalProperty && step === 3 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="Amount required (CAD)"
                      onSelect={(value) => choose('amount', value)}
                      options={rentalAmountRangeOptions}
                      selectedValue={values.amount}
                    />
                    <MortgageChoiceGroup
                      compact
                      label={
                        isRentalRefinance ? 'Estimated current value (CAD)' : 'Purchase price (CAD)'
                      }
                      onSelect={(value) => choose('propertyValue', value)}
                      options={rentalPropertyValueRangeOptions}
                      selectedValue={values.propertyValue}
                    />
                    {isRentalRefinance ? (
                      <MortgageChoiceGroup
                        compact
                        label="Current mortgage balance (CAD)"
                        onSelect={(value) => choose('currentMortgage', value)}
                        options={rentalMortgageBalanceRangeOptions}
                        selectedValue={values.currentMortgage}
                      />
                    ) : null}
                    <MortgageChoiceGroup
                      label={
                        isRentalRefinance
                          ? 'Other lenders, liens, or encumbrances'
                          : 'What other financing is involved?'
                      }
                      onSelect={chooseRentalEncumbrance}
                      options={
                        isRentalRefinance
                          ? rentalRefinanceEncumbranceOptions
                          : rentalAcquisitionFinancingOptions
                      }
                      selectedValue={values.additionalLiens}
                    />
                    {values.additionalLiens === 'Other debt (unsecured or non-property debt)' ? (
                      <MortgageChoiceGroup
                        compact
                        label="Approximate other debt amount"
                        onSelect={(value) => choose('additionalDebtAmount', value)}
                        options={rentalAmountRangeOptions}
                        selectedValue={values.additionalDebtAmount}
                      />
                    ) : null}
                    <Field className="fl-mortgage-field">
                      <FieldLabel htmlFor="rental-encumbrance-details">
                        Lender, lien, or financing details <span>Optional</span>
                      </FieldLabel>
                      <Textarea
                        className="fl-mortgage-textarea"
                        id="rental-encumbrance-details"
                        onChange={(event) => choose('additionalLienDetails', event.target.value)}
                        placeholder="Lender names, registered positions, balances, commitment status, or anything else we should know."
                        value={values.additionalLienDetails}
                      />
                    </Field>
                  </>
                ) : null}

                {isRentalProperty && step === 4 ? (
                  <>
                    <div className="fl-mortgage-contact-grid">
                      <TextField
                        appearance="mortgage"
                        id="rental-gross-rent"
                        inputMode="decimal"
                        label="Current gross monthly rent (CAD)"
                        onChange={(value) => choose('grossRentalIncome', value)}
                        placeholder="e.g. $18,500"
                        required
                        value={values.grossRentalIncome}
                      />
                    </div>
                    <MortgageChoiceGroup
                      compact
                      label={
                        isRentalRefinance
                          ? 'When do you need the refinance completed?'
                          : 'When is the expected closing?'
                      }
                      onSelect={(value) => choose('timeline', value)}
                      options={rentalFinancingTimelineOptions}
                      selectedValue={values.timeline}
                    />
                    <Field className="fl-mortgage-field">
                      <FieldLabel htmlFor="rental-review-context">
                        Anything else that affects the file? <span>Optional</span>
                      </FieldLabel>
                      <Textarea
                        className="fl-mortgage-textarea"
                        id="rental-review-context"
                        onChange={(event) => choose('message', event.target.value)}
                        placeholder="Closing date, rent-roll changes, property work, use of proceeds, or other deal context."
                        value={values.message}
                      />
                    </Field>
                  </>
                ) : null}

                {isRentalProperty && step === 5 ? (
                  <>
                    <div className="fl-mortgage-contact-grid">
                      <TextField
                        autoComplete="name"
                        error={errors.name}
                        id="rental-contact-name"
                        label="Name"
                        onChange={(value) => choose('name', value)}
                        required
                        value={values.name}
                      />
                      <TextField
                        autoComplete="email"
                        error={errors.email}
                        id="rental-contact-email"
                        label="Email"
                        onChange={(value) => choose('email', value)}
                        required
                        type="email"
                        value={values.email}
                      />
                      <TextField
                        autoComplete="tel"
                        error={errors.phone}
                        id="rental-contact-phone"
                        label="Phone"
                        onChange={(value) => choose('phone', value)}
                        required
                        type="tel"
                        value={values.phone}
                      />
                    </div>
                    <p className="fl-mortgage-consent">
                      FairLend will use these details to review the property and financing request
                      and respond with relevant next steps. Submission is not an approval or
                      financing commitment. See our{' '}
                      <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
                    </p>
                  </>
                ) : null}

                {(mode === 'mortgage' || isResidential) && step === 1 ? (
                  <>
                    <MortgageChoiceGroup
                      label="What would you like this mortgage to solve?"
                      layout="chips"
                      onSelect={(value) =>
                        isResidential
                          ? chooseResidentialSituation(value)
                          : choose('situation', value)
                      }
                      options={
                        isResidential
                          ? residentialMortgageSituationOptions
                          : privateMortgageSituationOptions
                      }
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

                {isPrivateMortgage && step === 2 ? (
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

                {isPrivateMortgage && step === 3 ? (
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
                    <MortgageChoiceGroup
                      compact
                      label="Additional debt"
                      onSelect={(value) => choose('additionalLiens', value)}
                      options={mortgageAdditionalLiensOptions}
                      selectedValue={values.additionalLiens}
                    />
                  </>
                ) : null}

                {isPrivateMortgage && step === 4 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="When do you need an answer?"
                      onSelect={(value) => choose('timeline', value)}
                      options={mortgageTimelineOptions}
                      selectedValue={values.timeline}
                    />
                  </>
                ) : null}

                {isPrivateMortgage && step === 5 ? (
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

                {isInstitutional && step === 1 ? (
                  <>
                    {!isResidential ? (
                      <MortgageChoiceGroup
                        label="What are you financing?"
                        onSelect={(value) => choose('situation', value)}
                        options={institutionalMortgageGoalOptions}
                        selectedValue={values.situation}
                      />
                    ) : null}
                    <MortgageChoiceGroup
                      compact
                      label="Where is the application today?"
                      onSelect={(value) => choose('exitPlan', value)}
                      options={institutionalApplicationStatusOptions}
                      selectedValue={values.exitPlan}
                    />
                  </>
                ) : null}

                {isInstitutional && step === 2 ? (
                  <>
                    <GoogleAddressAutocomplete
                      autoComplete="street-address"
                      className="fl-mortgage-field fl-mortgage-address"
                      id="institutional-property-address"
                      inputClassName="fl-mortgage-input"
                      label="Property address"
                      labelClassName="fl-mortgage-field-label"
                      onChange={(value) => choose('address', value)}
                      placeholder="Start typing the property address"
                      value={values.address}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="What type of property is it?"
                      onSelect={(value) => choose('propertyUse', value)}
                      options={institutionalPropertyUseOptions}
                      selectedValue={values.propertyUse}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Estimated property value"
                      onSelect={(value) => choose('propertyValue', value)}
                      options={institutionalPropertyValueOptions}
                      selectedValue={values.propertyValue}
                    />
                  </>
                ) : null}

                {isInstitutional && step === 3 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="How much financing are you seeking?"
                      onSelect={(value) => choose('amount', value)}
                      options={institutionalMortgageAmountOptions}
                      selectedValue={values.amount}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Current mortgage balance"
                      onSelect={(value) => choose('currentMortgage', value)}
                      options={mortgageCurrentBalanceOptions}
                      selectedValue={values.currentMortgage}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Other registered debt on the property"
                      onSelect={(value) => choose('additionalLiens', value)}
                      options={mortgageAdditionalLiensOptions}
                      selectedValue={values.additionalLiens}
                    />
                  </>
                ) : null}

                {isInstitutional && step === 4 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="How is your income documented?"
                      onSelect={(value) => choose('role', value)}
                      options={institutionalIncomeOptions}
                      selectedValue={values.role}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="Approximate credit range"
                      onSelect={(value) => choose('documentStatus', value)}
                      options={institutionalCreditOptions}
                      selectedValue={values.documentStatus}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="When do you need the financing?"
                      onSelect={(value) => choose('timeline', value)}
                      options={institutionalTimelineOptions}
                      selectedValue={values.timeline}
                    />
                  </>
                ) : null}

                {isInstitutional && step === 5 ? (
                  <>
                    <div className="fl-mortgage-contact-grid">
                      <TextField
                        autoComplete="name"
                        error={errors.name}
                        id="institutional-name"
                        label="Name"
                        onChange={(value) => choose('name', value)}
                        required
                        value={values.name}
                      />
                      <TextField
                        autoComplete="email"
                        error={errors.email}
                        id="institutional-email"
                        label="Email"
                        onChange={(value) => choose('email', value)}
                        required
                        type="email"
                        value={values.email}
                      />
                      <TextField
                        autoComplete="tel"
                        id="institutional-phone"
                        label="Phone"
                        onChange={(value) => choose('phone', value)}
                        type="tel"
                        value={values.phone}
                      />
                    </div>
                    <Field className="fl-mortgage-field">
                      <FieldLabel htmlFor="institutional-review-context">
                        Anything useful to add? <span>Optional</span>
                      </FieldLabel>
                      <Textarea
                        className="fl-mortgage-textarea"
                        id="institutional-review-context"
                        onChange={(event) => choose('message', event.target.value)}
                        placeholder="A lender condition, renewal date, income detail, or question you want compared."
                        value={values.message}
                      />
                    </Field>
                    <p className="fl-mortgage-consent">
                      FairLend will use these details to assess lender fit and respond with relevant
                      next steps. Submission is not an approval or financing commitment. See our{' '}
                      <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
                    </p>
                  </>
                ) : null}

                {isInvestor && step === 1 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="How are you investing?"
                      onSelect={(value) => choose('role', value)}
                      options={investorTypeOptions}
                      selectedValue={values.role}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="What is your private mortgage experience?"
                      onSelect={(value) => choose('situation', value)}
                      options={investorExperienceOptions}
                      selectedValue={values.situation}
                    />
                  </>
                ) : null}

                {isInvestor && step === 2 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="Approximate investable amount"
                      onSelect={(value) => choose('amount', value)}
                      options={investorCapitalOptions}
                      selectedValue={values.amount}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="When would you like to review opportunities?"
                      onSelect={(value) => choose('timeline', value)}
                      options={investorTermOptions}
                      selectedValue={values.timeline}
                    />
                  </>
                ) : null}

                {isInvestor && step === 3 ? (
                  <>
                    <MortgageChoiceGroup
                      compact
                      label="Which mortgage lane interests you most?"
                      onSelect={(value) => choose('propertyUse', value)}
                      options={investorMortgageTypeOptions}
                      selectedValue={values.propertyUse}
                    />
                    <MortgageChoiceGroup
                      compact
                      label="What matters most in the first review?"
                      onSelect={(value) => choose('exitPlan', value)}
                      options={investorPriorityOptions}
                      selectedValue={values.exitPlan}
                    />
                    <Field className="fl-mortgage-field">
                      <FieldLabel htmlFor="investor-review-context">
                        Anything useful to add? <span>Optional</span>
                      </FieldLabel>
                      <Textarea
                        className="fl-mortgage-textarea"
                        id="investor-review-context"
                        onChange={(event) => choose('message', event.target.value)}
                        placeholder="Return target, geography, position, or a question you want answered."
                        value={values.message}
                      />
                    </Field>
                  </>
                ) : null}

                {isInvestor && step === 4 ? (
                  <>
                    <div className="fl-mortgage-contact-grid">
                      <TextField
                        autoComplete="name"
                        error={errors.name}
                        id="investor-name"
                        label="Name"
                        onChange={(value) => choose('name', value)}
                        required
                        value={values.name}
                      />
                      <TextField
                        autoComplete="email"
                        error={errors.email}
                        id="investor-email"
                        label="Email"
                        onChange={(value) => choose('email', value)}
                        required
                        type="email"
                        value={values.email}
                      />
                      <TextField
                        autoComplete="tel"
                        id="investor-phone"
                        label="Phone"
                        onChange={(value) => choose('phone', value)}
                        type="tel"
                        value={values.phone}
                      />
                    </div>
                    <p className="fl-mortgage-consent">
                      FairLend uses these details to review investor fit and respond with relevant
                      next steps. Private mortgage investments involve risk and are not bank
                      deposits or guaranteed-return products. See our{' '}
                      <Link href="/en/brokerage/privacy-policy">Privacy Policy</Link>.
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
                      trackFairlendEvent('fairlend_intake_back_clicked', {
                        form_id: formId,
                        journey_type: journeyType,
                        step_key: getLeadIntakeStepKey(journeyType, step),
                        step_number: step,
                        total_steps: totalSteps,
                      })
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
                  type={step === totalSteps ? 'submit' : 'button'}
                  onClick={step === totalSteps ? undefined : moveForward}
                >
                  {state === 'submitting' ? (
                    <Loader2 aria-hidden="true" className="fl-intake-spinner" />
                  ) : null}
                  {state === 'submitting'
                    ? isInvestor
                      ? 'Sending your investor profile'
                      : isInstitutional
                        ? 'Sending your institutional mortgage file'
                        : 'Sending your mortgage file'
                    : stepContent.action}
                  {state !== 'submitting' ? <ArrowRight aria-hidden="true" /> : null}
                </Button>
                {canSkipAndSubmit ? (
                  <Button
                    className="fl-mortgage-skip-submit"
                    disabled={state === 'submitting'}
                    onClick={() => void onSubmit(null, 'partial')}
                    type="button"
                    variant="outline"
                  >
                    Skip and submit
                  </Button>
                ) : null}
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
  layout = 'cards',
  onSelect,
  options,
  selectedValue,
}: {
  compact?: boolean
  label: string
  layout?: 'cards' | 'chips'
  onSelect: (value: string) => void
  options: readonly string[]
  selectedValue: string
}) {
  const optionsClassName = [
    'fl-mortgage-options',
    compact ? 'is-compact' : '',
    layout === 'chips' ? 'is-chip-grid' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <fieldset className="fl-mortgage-choice-group">
      <legend>{label}</legend>
      <div className={optionsClassName}>
        {options.map((option) => {
          const isSelected = selectedValue === option

          return (
            <MortgageChoiceOption
              key={option}
              layout={layout}
              onSelect={onSelect}
              option={option}
              selected={isSelected}
            />
          )
        })}
      </div>
    </fieldset>
  )
}

function MortgageFileVisual({
  product = 'private',
  step,
  values,
}: {
  product?: MortgageProduct
  step: number
  values: LeadCaptureValues
}) {
  const isInstitutional = product === 'institutional'
  const isResidential = product === 'residential'
  const isRentalProperty = product === 'rental-property'
  const stages = isRentalProperty
    ? [
        {
          complete: Boolean(
            values.situation && values.ownershipStatus && values.ownershipStructure,
          ),
          label: 'Transaction',
          value: values.situation,
        },
        {
          complete: Boolean(
            values.address && values.propertyUse && values.numberOfUnits && values.occupancyStatus,
          ),
          label: 'Property',
          value: [values.numberOfUnits && `${values.numberOfUnits} units`, values.occupancyStatus]
            .filter(Boolean)
            .join(' · '),
        },
        {
          complete: Boolean(
            values.amount &&
            values.propertyValue &&
            values.additionalLiens &&
            (values.situation !== rentalPropertyTransactionOptions[1] || values.currentMortgage),
          ),
          label: 'Financing',
          value: values.amount,
        },
        {
          complete: Boolean(values.grossRentalIncome && values.timeline),
          label: 'Income & timing',
          value: values.timeline,
        },
        {
          complete: Boolean(values.name && values.email && values.phone),
          label: 'Contact',
          value: values.name,
        },
      ]
    : [
        { complete: Boolean(values.situation), label: 'Situation', value: values.situation },
        {
          complete: Boolean(values.propertyUse && values.propertyValue),
          label: 'Property',
          value: [values.propertyUse, values.propertyValue].filter(Boolean).join(' · '),
        },
        {
          complete: Boolean(values.amount && values.currentMortgage && values.additionalLiens),
          label: 'Amount',
          value: values.amount,
        },
        {
          complete: isInstitutional
            ? Boolean(values.role && values.documentStatus && values.timeline)
            : Boolean(values.timeline && values.exitPlan),
          label: isInstitutional ? 'Qualification' : 'Timing',
          value: isInstitutional ? values.role : values.timeline,
        },
        {
          complete: Boolean(values.name && values.email),
          label: 'Contact',
          value: values.name,
        },
      ]

  const capturedRows = [
    { label: isRentalProperty ? 'Transaction' : 'Situation', value: values.situation },
    ...(isRentalProperty
      ? [
          { label: 'Ownership status', value: values.ownershipStatus },
          { label: 'Ownership structure', value: values.ownershipStructure },
        ]
      : []),
    ...(isInstitutional ? [{ label: 'Application status', value: values.exitPlan }] : []),
    { label: 'Property address', value: values.address },
    { label: 'Property use', value: values.propertyUse },
    ...(isRentalProperty
      ? [
          { label: 'Number of units', value: values.numberOfUnits },
          { label: 'Occupancy', value: values.occupancyStatus },
        ]
      : []),
    { label: 'Estimated value', value: values.propertyValue },
    { label: 'Amount requested', value: values.amount },
    { label: 'Current mortgage', value: values.currentMortgage },
    { label: 'Additional debt', value: values.additionalLiens },
    ...(isRentalProperty
      ? [
          { label: 'Other debt amount', value: values.additionalDebtAmount },
          { label: 'Financing details', value: values.additionalLienDetails },
          { label: 'Gross monthly rent', value: values.grossRentalIncome },
          { label: 'Timing', value: values.timeline },
        ]
      : []),
    ...(!isRentalProperty && isInstitutional
      ? [
          { label: 'Income documentation', value: values.role },
          { label: 'Credit range', value: values.documentStatus },
          { label: 'Timing', value: values.timeline },
        ]
      : !isRentalProperty
        ? [
            { label: 'Timing', value: values.timeline },
            { label: 'Expected exit', value: values.exitPlan },
          ]
        : []),
    { label: 'Applicant', value: values.name },
  ].filter((row) => row.value)
  const latestCapturedRow = capturedRows[capturedRows.length - 1]

  return (
    <aside className="fl-mortgage-file-visual" aria-label="Your mortgage file progress">
      <header className="fl-mortgage-file-heading">
        <h2>
          Your{' '}
          {isRentalProperty
            ? 'rental property file'
            : `${isInstitutional ? 'institutional ' : ''}mortgage file`}
        </h2>
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
        {stages.slice(1).map((stage, index) => {
          const layer = index + 1
          const stageNumber = index + 2
          const tabState =
            stageNumber === step ? ' is-active' : stage.complete ? ' is-complete' : ''

          return (
            <span
              className={`fl-mortgage-file-sheet fl-mortgage-file-sheet--back-${layer}`}
              aria-hidden="true"
              key={stage.label}
            >
              <span
                className={`fl-mortgage-file-tab fl-mortgage-file-tab--${stageNumber}${tabState}`}
              >
                {stage.label}
              </span>
            </span>
          )
        })}

        <article
          className="fl-mortgage-file-sheet fl-mortgage-file-sheet--front"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className={`fl-mortgage-file-tab fl-mortgage-file-tab--1${
              step === 1 ? ' is-active' : stages[0].complete ? ' is-complete' : ''
            }`}
          >
            {stages[0].label}
          </span>

          <div className="fl-mortgage-file-sheet__head">
            <span>
              {isInstitutional
                ? 'Institutional lender review'
                : isRentalProperty
                  ? 'Rental property financing review'
                  : isResidential
                    ? 'Residential mortgage review'
                    : 'Private mortgage review'}
            </span>
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
      </div>

      <p className="fl-mortgage-file-note">
        <ShieldCheck aria-hidden="true" />
        {isInstitutional || isRentalProperty
          ? 'No documents needed to start.'
          : 'No documents needed right now.'}
      </p>
    </aside>
  )
}

function getResidentialMortgageStepContent(): {
  action: string
  description: string
  label: string
  title: string
} {
  return {
    action: 'Continue to property',
    description:
      'Choose the closest answer. FairLend will route the next questions to the right residential mortgage lane.',
    label: 'Mortgage goal',
    title: 'What would you like this mortgage to solve?',
  }
}

function getRentalPropertyStepContent(
  step: number,
  situation: string,
): {
  action: string
  description: string
  label: string
  title: string
} {
  const isRefinance = situation === rentalPropertyTransactionOptions[1]
  const content = [
    {
      action: 'Continue to property',
      description:
        'Confirm the transaction and title picture so FairLend starts in the right financing lane.',
      label: 'Transaction and ownership',
      title: 'Are you acquiring or refinancing?',
    },
    {
      action: 'Continue to financing',
      description:
        'The unit count, property type, and occupancy establish the asset FairLend will review.',
      label: 'Rental property',
      title: 'Tell us about the property.',
    },
    {
      action: 'Continue to income and timing',
      description:
        'Approximate figures are enough. Exact statements, commitments, and registrations can come later.',
      label: 'Capital stack',
      title: isRefinance
        ? 'What needs to be refinanced?'
        : 'How should the acquisition be financed?',
    },
    {
      action: 'Continue to contact',
      description:
        'Current rent and the funding deadline help FairLend assess leverage and lender fit.',
      label: 'Income and timing',
      title: isRefinance
        ? 'When does the refinance need to close?'
        : 'When does the acquisition need to close?',
    },
    {
      action: 'Request a rental property financing review',
      description: 'A specialist will use this file to prepare the first financing conversation.',
      label: 'Contact',
      title: 'Where should FairLend reach you?',
    },
  ] as const

  return content[Math.min(Math.max(step, 1), mortgageTotalSteps) - 1]
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

function getInstitutionalMortgageStepContent(step: number): {
  action: string
  description: string
  label: string
  title: string
} {
  const content = [
    {
      action: 'Continue to property',
      description:
        'The objective and current application status determine which lender programs are worth reviewing.',
      label: 'Financing objective',
      title: 'Start with the decision in front of you.',
    },
    {
      action: 'Continue to financing',
      description:
        'Approximate answers are enough to begin matching the property to institutional lender criteria.',
      label: 'Property profile',
      title: 'Tell us what the lender will be financing.',
    },
    {
      action: 'Continue to qualification',
      description:
        'Ranges help establish leverage and the likely lender lane before documents are requested.',
      label: 'Financing request',
      title: 'Define the mortgage position.',
    },
    {
      action: 'Continue to contact',
      description:
        'Income documentation, credit range, and timing help a specialist screen the file against real lender policy.',
      label: 'Qualification picture',
      title: 'Show us how the file qualifies.',
    },
    {
      action: 'Request an institutional mortgage review',
      description:
        'A mortgage specialist will use this file to identify lender fit and the next documents, if any.',
      label: 'Contact',
      title: 'Where should FairLend reach you?',
    },
  ] as const

  return content[Math.min(Math.max(step, 1), mortgageTotalSteps) - 1]
}

function getInvestorStepContent(step: number): {
  action: string
  description: string
  label: string
  title: string
} {
  const content = [
    {
      action: 'Continue to capital',
      description: 'Choose the closest answers. The investor team can refine the profile with you.',
      label: 'Investor fit',
      title: 'Start with how you invest.',
    },
    {
      action: 'Continue to preferences',
      description: 'Approximate ranges are enough for an initial suitability conversation.',
      label: 'Capital and timing',
      title: 'What mandate are you considering?',
    },
    {
      action: 'Continue to contact',
      description: 'These preferences help FairLend make the first review relevant and specific.',
      label: 'Deal criteria',
      title: 'What should the first review prioritize?',
    },
    {
      action: 'Request investor access',
      description:
        'An investor specialist will review the profile before presenting any opportunity.',
      label: 'Contact',
      title: 'Where should FairLend reach you?',
    },
  ] as const

  return content[Math.min(Math.max(step, 1), investorTotalSteps) - 1]
}

function validateMortgageStep(step: number, values: LeadCaptureValues): string {
  if (step === 1 && !values.situation) {
    return 'Choose the closest reason for the mortgage so we can build the right file.'
  }

  if (step === 2 && (!values.propertyUse || !values.propertyValue)) {
    return 'Choose the property use and approximate value. The address can be added later.'
  }

  if (step === 3 && (!values.amount || !values.currentMortgage || !values.additionalLiens)) {
    return 'Choose an amount range, current mortgage balance, and any additional debt.'
  }

  if (step === 4 && !values.timeline) {
    return 'Choose when you need an answer.'
  }

  return ''
}

function validateRentalPropertyStep(step: number, values: LeadCaptureValues): string {
  const isRefinance = values.situation === rentalPropertyTransactionOptions[1]

  if (step === 1 && (!values.situation || !values.ownershipStatus || !values.ownershipStructure)) {
    return 'Choose the transaction, ownership status, and ownership structure.'
  }

  const requiresUnitCount = rentalPropertyTypesWithUnitCount.has(values.propertyUse)

  if (
    step === 2 &&
    (!values.address ||
      !values.propertyUse ||
      (requiresUnitCount && !values.numberOfUnits) ||
      !values.occupancyStatus)
  ) {
    return requiresUnitCount
      ? 'Add the address, property type, number of units, and current occupancy.'
      : 'Add the address, property type, and current occupancy.'
  }

  if (step === 2 && requiresUnitCount && !/^[1-9]\d*$/.test(values.numberOfUnits.trim())) {
    return 'Enter the residential unit count as a whole number greater than zero.'
  }

  if (
    step === 3 &&
    (!values.amount ||
      !values.propertyValue ||
      !values.additionalLiens ||
      (values.additionalLiens === 'Other debt (unsecured or non-property debt)' &&
        !values.additionalDebtAmount) ||
      (isRefinance && !values.currentMortgage))
  ) {
    return isRefinance
      ? 'Add the requested amount, current value, mortgage balance, and other encumbrances.'
      : 'Add the requested amount, purchase price, and any other financing involved.'
  }

  if (step === 4 && (!values.grossRentalIncome || !values.timeline)) {
    return 'Add the current gross monthly rent and expected financing timeline.'
  }

  return ''
}

function validateInstitutionalMortgageStep(step: number, values: LeadCaptureValues): string {
  if (step === 1 && (!values.situation || !values.exitPlan)) {
    return 'Choose the financing objective and current application status so we can route the file.'
  }

  if (step === 2 && (!values.propertyUse || !values.propertyValue)) {
    return 'Choose the property type and approximate value. The address can be added later.'
  }

  if (step === 3 && (!values.amount || !values.currentMortgage || !values.additionalLiens)) {
    return 'Choose the requested amount, current mortgage balance, and other registered debt.'
  }

  if (step === 4 && (!values.role || !values.documentStatus || !values.timeline)) {
    return 'Choose how income is documented, the approximate credit range, and the financing timeline.'
  }

  return ''
}

function validateInvestorStep(step: number, values: LeadCaptureValues): string {
  if (step === 1 && (!values.role || !values.situation)) {
    return 'Choose your investor type and private mortgage experience to build the profile.'
  }

  if (step === 2 && (!values.amount || !values.timeline)) {
    return 'Choose an approximate investable amount and preferred timeline.'
  }

  if (step === 3 && (!values.propertyUse || !values.exitPlan)) {
    return 'Choose a mortgage lane and the priority for your first review.'
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
                <em>Southern Ontario</em>
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
  appearance = 'default',
  autoComplete,
  error,
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  required,
  type = 'text',
  value,
}: {
  appearance?: 'default' | 'mortgage'
  autoComplete?: string
  error?: string
  id: string
  inputMode?: 'decimal' | 'numeric'
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: 'email' | 'tel' | 'text'
  value: string
}) {
  return (
    <Field
      className={appearance === 'mortgage' ? 'fl-mortgage-field' : 'fl-intake-field'}
      data-invalid={Boolean(error)}
    >
      <FieldLabel
        className={appearance === 'mortgage' ? undefined : 'fl-intake-label'}
        htmlFor={id}
      >
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
      </FieldLabel>
      <Input
        aria-invalid={Boolean(error)}
        aria-required={required}
        autoComplete={autoComplete}
        className={appearance === 'mortgage' ? 'fl-mortgage-input' : 'fl-intake-input'}
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <FieldError className="fl-intake-error">{error}</FieldError>
    </Field>
  )
}

function validateLeadCapture(
  values: LeadCaptureValues,
  { requiresName, requiresPhone = false }: { requiresName: boolean; requiresPhone?: boolean },
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

  if (requiresPhone && !values.phone.trim()) {
    errors.phone = 'Please enter a phone number so a financing specialist can reach you.'
  }

  return errors
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
