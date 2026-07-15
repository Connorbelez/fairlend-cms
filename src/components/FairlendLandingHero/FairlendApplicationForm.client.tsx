'use client'

import { ArrowRight, LoaderCircle, MapPin } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useRef, useState } from 'react'

import { GoogleAddressAutocomplete } from '@/components/address/GoogleAddressAutocomplete'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  resolveJourneyType,
  trackFairlendEvent,
  trackLeadFailed,
  type LeadSubmissionResponse,
} from '@/lib/analytics/events'
import { cn } from '@/utilities/ui'

import { fairlendApplicationId } from './application-target'
import {
  FairlendApplicationIntentTabs,
  fairlendApplicationIntents,
  type FairlendApplicationIntent,
} from './FairlendApplicationIntentTabs.client'
import {
  FairlendApplicationChoiceChips,
  type FairlendApplicationChoice,
} from './FairlendApplicationChoiceChips.client'
import { FairlendSubmissionSuccess } from './FairlendSubmissionSuccess.client'

type FormTab = FairlendApplicationIntent

const INVESTMENT_AMOUNT_OPTIONS: readonly FairlendApplicationChoice[] = [
  { label: '$50K – $250K', value: '$50K – $250K' },
  { label: '$250K – $1M', value: '$250K – $1M' },
  { label: '$1M – $5M', value: '$1M – $5M' },
  { label: '$5M+', value: '$5M+' },
]

const MORTGAGE_PRODUCT_OPTIONS: readonly FairlendApplicationChoice[] = [
  { label: 'First mortgage', value: 'first-mortgage' },
  { label: 'Second mortgage', value: 'second-mortgage' },
  { label: 'Bridge financing', value: 'bridge-financing' },
  { label: 'Refinance', value: 'refinance' },
  { label: 'Debt consolidation', value: 'debt-consolidation' },
  { label: 'HELOC', value: 'heloc' },
  { label: 'Not sure yet', value: 'not-sure' },
]

const MORTGAGE_AMOUNT_OPTIONS: readonly FairlendApplicationChoice[] = [
  { label: 'Under $250K', value: 'Under $250K' },
  { label: '$250K – $500K', value: '$250K – $500K' },
  { label: '$500K – $1M', value: '$500K – $1M' },
  { label: '$1M – $3M', value: '$1M – $3M' },
  { label: '$3M+', value: '$3M+' },
]

const MORTGAGE_PRODUCTS_REQUIRING_BALANCE = new Set([
  'second-mortgage',
  'bridge-financing',
  'refinance',
  'debt-consolidation',
  'heloc',
])

const MORTGAGE_PRODUCT_LANES: Record<string, 'institutional' | 'private' | undefined> = {
  'first-mortgage': 'institutional',
  'second-mortgage': 'private',
  'bridge-financing': 'private',
  refinance: 'private',
  'debt-consolidation': 'private',
  heloc: 'institutional',
  'not-sure': undefined,
}

const CONTACT_REQUIRED_ERROR = 'Enter an email address or phone number so we can follow up.'

const MORTGAGE_TIMELINE_OPTIONS = [
  'Within 2 weeks',
  'Within 30 days',
  '1–3 months',
  'Exploring options',
] as const

const applicationPanelVariants = {
  center: { filter: 'blur(0px)', opacity: 1, x: 0 },
  enter: (direction: number) => ({
    filter: 'blur(2px)',
    opacity: 0,
    x: direction * 8,
  }),
  exit: (direction: number) => ({
    filter: 'blur(2px)',
    opacity: 0,
    x: direction * -8,
  }),
}

const TAB_META: Record<FormTab, { description: string; heading: string; submitLabel: string }> = {
  build: {
    description: 'Tell us where you are building.',
    heading: 'Start your application',
    submitLabel: 'Start build application',
  },
  invest: {
    description: 'Tell us about you and your investment goals.',
    heading: 'Investor intake',
    submitLabel: 'Start investor intake',
  },
  mortgage: {
    description: 'Share your details and property.',
    heading: 'Mortgage request',
    submitLabel: 'Start mortgage request',
  },
}

type FormValues = {
  build: { address: string }
  invest: { name: string; email: string; phone: string; amount: string; focus: string }
  mortgage: {
    name: string
    email: string
    phone: string
    address: string
    product: string
    amount: string
    currentMortgage: string
    timeline: string
  }
}

const INITIAL_VALUES: FormValues = {
  build: { address: '' },
  invest: { name: '', email: '', phone: '', amount: '', focus: '' },
  mortgage: {
    name: '',
    email: '',
    phone: '',
    address: '',
    product: '',
    amount: '',
    currentMortgage: '',
    timeline: '',
  },
}

const visuallyHiddenClassName =
  'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]'

const fieldLabelClassName =
  'text-[clamp(10px,0.72vw,11px)] font-extrabold uppercase tracking-[0.04em] text-[#2f3b39]'

const fieldInputClassName =
  'h-[clamp(46px,3.1vw,52px)] w-full min-w-0 rounded-[12px] border border-[#dededb] bg-[rgb(255_253_249/92%)] px-[clamp(14px,1vw,16px)] text-[clamp(14px,0.95vw,15px)] text-[#15201f] shadow-none transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] data-[placeholder]:text-[#586562] placeholder:text-[#586562] focus:border-[#96ec18] focus:shadow-[0_0_0_3px_rgb(150_236_24/18%)] focus:outline-none focus-visible:border-[#96ec18] focus-visible:shadow-[0_0_0_3px_rgb(150_236_24/18%)] focus-visible:outline-none focus-visible:ring-0 hero-mobile:h-[clamp(44px,12vw,50px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:px-[14px]'

const fieldSubmitButtonClassName =
  'mt-1 inline-flex h-[clamp(48px,3.2vw,54px)] w-full items-center justify-center gap-2 rounded-[12px] bg-[#96ec18] text-[#101010] text-[clamp(14px,0.92vw,15px)] font-extrabold shadow-[0_0_0_3px_rgb(255_253_247/96%),0_10px_20px_rgb(118_205_0/18%)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[#a4fb20] hover:shadow-[0_0_0_3px_rgb(255_253_247/98%),0_0_0_8px_rgb(150_236_24/15%),0_18px_30px_rgb(118_205_0/22%)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#111] hero-mobile:h-[clamp(46px,12vw,52px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:rounded-[12px] hero-landscape:h-[56px] hero-landscape:text-[16px] hero-landscape:rounded-[14px]'

const fieldsStackClassName = 'flex flex-col gap-[clamp(10px,0.8vw,14px)]'
const fieldRowClassName = 'flex flex-col gap-[6px]'
const compactFieldsGridClassName =
  'grid min-w-0 grid-cols-2 gap-x-[10px] gap-y-[clamp(10px,0.8vw,14px)] hero-mobile:grid-cols-1'
const currencyAdornmentClassName =
  'pointer-events-none absolute top-1/2 left-[clamp(14px,1vw,16px)] -translate-y-1/2 text-[clamp(14px,0.95vw,15px)] font-bold text-[#586562]'

export function FairlendApplicationForm() {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<FormTab>('build')
  const [tabDirection, setTabDirection] = useState(0)
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTab, setSubmittedTab] = useState<FormTab | null>(null)
  const [isAddressAutocompleteOpen, setIsAddressAutocompleteOpen] = useState(false)
  const activeInputRef = useRef<HTMLInputElement>(null)

  const activeMeta = TAB_META[activeTab]
  const shouldLiftForAutocomplete = activeTab !== 'invest' && isAddressAutocompleteOpen
  const showDirectSuccess =
    submittedTab === activeTab && (activeTab === 'invest' || activeTab === 'mortgage')
  const hasContactError = submitError === CONTACT_REQUIRED_ERROR
  const shouldAskForMortgageBalance =
    activeTab === 'mortgage' && MORTGAGE_PRODUCTS_REQUIRING_BALANCE.has(values.mortgage.product)

  const handleSelectTab = useCallback(
    (value: FormTab) => {
      const currentIndex = fairlendApplicationIntents.findIndex((tab) => tab.value === activeTab)
      const nextIndex = fairlendApplicationIntents.findIndex((tab) => tab.value === value)

      setSubmitError('')
      setSubmittedTab(null)
      setIsAddressAutocompleteOpen(false)
      setTabDirection(Math.sign(nextIndex - currentIndex))
      setActiveTab(value)
      trackFairlendEvent('fairlend_route_selected', {
        journey_type: resolveJourneyType({ intent: value }),
        source: 'homepage-application-form',
      })
    },
    [activeTab],
  )

  const handleAddressAutocompleteOpenChange = useCallback((open: boolean) => {
    setIsAddressAutocompleteOpen(open)
  }, [])

  function setField<Tab extends FormTab>(tab: Tab, update: Partial<FormValues[Tab]>): void {
    setValues((prev) => {
      const next = { ...prev[tab], ...update }
      return { ...prev, [tab]: next }
    })
  }

  function clearTransientStatus() {
    setSubmittedTab(null)
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (activeTab === 'build') {
      const address = values.build.address.trim()
      if (!address) {
        const target = activeInputRef.current ?? document.getElementById('fairlend-build')
        target?.focus()
        return
      }
    }

    if (activeTab === 'invest' || activeTab === 'mortgage') {
      const { email, phone } = values[activeTab]
      if (!email.trim() && !phone.trim()) {
        setSubmittedTab(null)
        setSubmitError(CONTACT_REQUIRED_ERROR)
        document.getElementById(`fairlend-${activeTab}-email`)?.focus()
        return
      }
    }

    setIsSubmitting(true)
    setSubmitError('')
    const journeyType = resolveJourneyType({
      intent: activeTab,
      mortgageProduct:
        activeTab === 'mortgage' ? MORTGAGE_PRODUCT_LANES[values.mortgage.product] : undefined,
    })
    const formId = `fairlend_homepage_${activeTab}`
    trackFairlendEvent('fairlend_intake_started', {
      form_id: formId,
      journey_type: journeyType,
      source: `homepage-${activeTab}-application-form`,
    })

    let leadId: string | undefined
    const isDirectLeadIntake = activeTab === 'invest' || activeTab === 'mortgage'
    const body: Record<string, unknown> = {
      analyticsContext: isDirectLeadIntake ? getAnalyticsContext() : undefined,
      intent: activeTab,
      source: `homepage-${activeTab}-application-form`,
      status: isDirectLeadIntake ? 'submitted' : 'started',
    }
    let routeAddress = ''
    let routeName = ''
    let routeEmail = ''
    let routePhone = ''

    if (activeTab === 'build') {
      const address = values.build.address.trim()
      body.address = address
      body.intake = { homepageValue: address }
      routeAddress = address
    } else if (activeTab === 'invest') {
      const { name, email, phone, amount, focus } = values.invest
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()
      const trimmedPhone = phone.trim()
      body.name = trimmedName
      body.email = trimmedEmail
      body.phone = trimmedPhone
      body.intake = { investmentAmount: amount.trim(), investmentFocus: focus }
      routeName = trimmedName
      routeEmail = trimmedEmail
      routePhone = trimmedPhone
    } else {
      const { name, email, phone, address, product, amount, currentMortgage, timeline } =
        values.mortgage
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()
      const trimmedPhone = phone.trim()
      const trimmedAddress = address.trim()
      const mortgageGoal =
        MORTGAGE_PRODUCT_OPTIONS.find((option) => option.value === product)?.label ?? product
      body.name = trimmedName
      body.email = trimmedEmail
      body.phone = trimmedPhone
      body.address = trimmedAddress
      body.intake = {
        amount: amount.trim(),
        currentMortgage: currentMortgage.trim(),
        homepageValue: trimmedAddress,
        mortgageGoal,
        mortgageProduct: MORTGAGE_PRODUCT_LANES[product],
        timeline,
      }
      routeAddress = trimmedAddress
      routeName = trimmedName
      routeEmail = trimmedEmail
      routePhone = trimmedPhone
    }

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      })

      if (response.ok) {
        const payload = (await response.json()) as LeadSubmissionResponse
        leadId = payload.id
        if (isDirectLeadIntake) {
          completeLeadAnalytics(payload, {
            completion_status: 'complete',
            form_id: formId,
            journey_type: journeyType,
            source: `homepage-${activeTab}-application-form`,
          })
        }
      } else {
        trackLeadFailed({
          failure_type: 'http',
          form_id: formId,
          journey_type: journeyType,
          source: `homepage-${activeTab}-application-form`,
        })
        setSubmitError(
          isDirectLeadIntake
            ? 'We could not submit this. Please try again.'
            : 'We could not save this yet, but you can continue.',
        )
        if (isDirectLeadIntake) {
          return
        }
      }
    } catch {
      trackLeadFailed({
        failure_type: 'network',
        form_id: formId,
        journey_type: journeyType,
        source: `homepage-${activeTab}-application-form`,
      })
      setSubmitError(
        isDirectLeadIntake
          ? 'We could not submit this. Please try again.'
          : 'We could not save this yet, but you can continue.',
      )
      if (isDirectLeadIntake) {
        return
      }
    } finally {
      setIsSubmitting(false)
    }

    setSubmittedTab(activeTab)

    if (isDirectLeadIntake) {
      return
    }

    const params = new URLSearchParams({
      intent: activeTab,
      source: `homepage-${activeTab}-application-form`,
    })
    if (leadId) params.set('leadId', leadId)
    if (routeAddress) params.set('address', routeAddress)
    if (routeName) params.set('name', routeName)
    if (routeEmail) params.set('email', routeEmail)
    if (routePhone) params.set('phone', routePhone)

    router.push(`/intake?${params.toString()}`)
  }

  return (
    <Card
      className={cn(
        'fairlend-hero-application-card pointer-events-auto absolute right-[2.35%] bottom-[calc(5.45%+var(--hero-stats-height,0px))] z-[12] w-[min(30.8%,512px)] min-w-[400px] scroll-mt-20 overflow-visible rounded-[22px] border border-[#dededb] bg-[rgb(251_250_248/94%)] shadow-[0_18px_34px_rgb(5_5_6/10%)] transition-[top,bottom] duration-300 ease-[var(--hero-ease-quint)] [--card-spacing:0px] focus:outline-2 focus:outline-offset-4 focus:outline-[#08090a] motion-safe:animate-[heroPanelIn_420ms_var(--hero-ease-out)_120ms_both] hero-max-1120:min-w-[400px] hero-max-1279:right-4 hero-max-1279:bottom-[18px] hero-max-1279:left-4 hero-max-1279:w-auto hero-max-1279:min-w-0 hero-mobile:relative hero-mobile:col-span-2 hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:mt-0 hero-mobile:w-full hero-mobile:min-w-0 hero-tablet:relative hero-tablet:right-auto hero-tablet:bottom-auto hero-tablet:left-auto hero-tablet:mt-[clamp(12px,2vw,16px)] hero-tablet:w-full hero-tablet:min-w-0 hero-tablet:overflow-visible hero-tablet:rounded-[14px] hero-tablet:border hero-tablet:border-[#dededb] hero-tablet:bg-[rgb(255_253_249/86%)] hero-tablet:shadow-[0_10px_22px_rgb(5_5_6/7%)] hero-tablet-landscape:absolute hero-tablet-landscape:right-0 hero-tablet-landscape:bottom-[clamp(34px,5svh,64px)] hero-tablet-landscape:left-auto hero-tablet-landscape:mt-0 hero-tablet-landscape:w-[min(43vw,520px)] hero-tablet-landscape:min-w-[430px] hero-tablet-landscape:max-w-[calc(100vw-48px)] hero-tablet-landscape:rounded-[22px] hero-tablet-landscape:border-[rgb(255_255_255/76%)] hero-tablet-landscape:bg-[rgb(251_250_248/94%)] hero-tablet-landscape:shadow-[0_18px_28px_rgb(8_22_27/12%),0_4px_10px_rgb(5_5_6/6%)] hero-tablet-landscape-short:right-0 hero-tablet-landscape-short:bottom-[18px] hero-tablet-landscape-short:w-[min(42vw,500px)] hero-tablet-landscape-short:min-w-[410px] hero-tablet-landscape-short:rounded-[18px] hero-portrait-wide:relative hero-portrait-wide:right-auto hero-portrait-wide:bottom-auto hero-portrait-wide:left-auto hero-portrait-wide:mt-[clamp(14px,2vw,20px)] hero-portrait-wide:w-full hero-portrait-wide:min-w-0 hero-portrait-wide:overflow-visible hero-portrait-wide:rounded-[16px] hero-portrait-wide:border hero-portrait-wide:border-[#dededb] hero-portrait-wide:bg-[rgb(255_253_249/86%)] hero-portrait-wide:shadow-[0_10px_22px_rgb(5_5_6/7%)] hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:rounded-[16px] hero-mobile:shadow-[0_16px_30px_rgb(5_5_6/9%)] hero-landscape:fixed hero-landscape:right-[calc((100vw-var(--landing-rail-content-width))/2)] hero-landscape:bottom-[clamp(18px,1.8vw,32px)] hero-landscape:left-auto hero-landscape:z-[40] hero-landscape:w-[min(30vw,500px)] hero-landscape:min-w-[420px] hero-landscape:max-w-[var(--landing-rail-content-width)] hero-landscape:rounded-none hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-[rgb(248_247_245/82%)] hero-landscape:shadow-none hero-landscape:backdrop-blur-[3px]',
        shouldLiftForAutocomplete &&
          'bottom-[calc(5.45%+var(--hero-stats-height,0px)+clamp(78px,7vw,124px))] hero-tablet-landscape:bottom-[calc(clamp(34px,5svh,64px)+clamp(78px,7vw,124px))] hero-tablet-landscape-short:bottom-[calc(18px+clamp(60px,9vw,96px))] hero-landscape:bottom-[calc(clamp(18px,1.8vw,32px)+clamp(78px,7vw,124px))] hero-tablet:bottom-auto hero-portrait-wide:bottom-auto hero-mobile:bottom-auto',
      )}
      data-autocomplete-open={shouldLiftForAutocomplete ? 'true' : 'false'}
      data-testid="fairlend-application-form"
      id={fairlendApplicationId}
      tabIndex={-1}
    >
      <FairlendApplicationIntentTabs
        className={cn(
          'rounded-[inherit] hero-landscape:bg-transparent',
          shouldLiftForAutocomplete ? 'overflow-visible' : 'overflow-hidden',
        )}
        onValueChange={handleSelectTab}
        reduceMotion={shouldReduceMotion ?? false}
        value={activeTab}
      >
        <motion.div
          className="relative isolate min-h-[clamp(106px,7.4vw,124px)] px-[clamp(18px,1.45vw,24px)] py-[clamp(14px,1vw,17px)] [&_h2]:m-0 [&_h2]:mb-[12px] [&_h2]:text-balance [&_h2]:text-[clamp(20px,1.28vw,25px)] [&_h2]:leading-[1.1] [&_h2]:font-extrabold [&_h2]:text-[#071d25] hero-tablet:min-h-0 hero-tablet:px-[clamp(18px,2.6vw,22px)] hero-tablet:pt-[clamp(13px,2vw,17px)] hero-tablet:pb-[clamp(11px,1.8vw,15px)] hero-tablet:[&_h2]:mb-[clamp(10px,1.6vw,12px)] hero-tablet:[&_h2]:text-[clamp(21px,3vw,26px)] hero-tablet-landscape-short:px-[16px] hero-tablet-landscape-short:pt-[10px] hero-tablet-landscape-short:pb-[10px] hero-tablet-landscape-short:[&_h2]:mb-[8px] hero-tablet-landscape-short:[&_h2]:text-[22px] hero-mobile:min-h-0 hero-mobile:px-[clamp(16px,4.6vw,20px)] hero-mobile:pt-[clamp(10px,3vw,13px)] hero-mobile:pb-[clamp(7px,2.2vw,10px)] hero-mobile:[&_h2]:mb-[clamp(8px,2.4vw,10px)] hero-mobile:[&_h2]:text-[clamp(18px,5vw,21px)] hero-landscape:m-0 hero-landscape:min-h-[128px] hero-landscape:border-0 hero-landscape:bg-[linear-gradient(to_right,rgb(8_9_10/4%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(8_9_10/3%)_1px,transparent_1px)] hero-landscape:px-[20px] hero-landscape:pt-[16px] hero-landscape:pb-[18px] hero-landscape:shadow-none hero-landscape:[background-size:72px_72px] hero-landscape:[&_h2]:ml-0 hero-landscape:[&_h2]:mb-[13px] hero-landscape:[&_h2]:font-serif hero-landscape:[&_h2]:text-[24px] hero-landscape:[&_h2]:leading-[1.02] hero-landscape:[&_h2]:tracking-[0] hero-landscape:[&_h2]:text-[oklch(0.182_0.045_166)]"
          layout="size"
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <AnimatePresence
            custom={shouldReduceMotion ? 0 : tabDirection}
            initial={false}
            mode="popLayout"
          >
            <motion.div
              aria-labelledby={`fairlend-${activeTab}-tab`}
              animate="center"
              className="m-0"
              custom={shouldReduceMotion ? 0 : tabDirection}
              exit="exit"
              id={`fairlend-${activeTab}-panel`}
              initial={shouldReduceMotion ? false : 'enter'}
              key={activeTab}
              role="tabpanel"
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }
              }
              variants={applicationPanelVariants}
            >
              <h2>{activeMeta.heading}</h2>
              <form className="m-0" onSubmit={handleSubmit}>
                <input name="intent" type="hidden" value={activeTab} />
                <span className={visuallyHiddenClassName} id={`fairlend-${activeTab}-description`}>
                  {activeMeta.description}
                </span>

                <AnimatePresence initial={false} mode="wait">
                  {showDirectSuccess ? (
                    <FairlendSubmissionSuccess
                      intent={activeTab === 'invest' ? 'invest' : 'mortgage'}
                      key={`${activeTab}-success`}
                    />
                  ) : (
                    <motion.div
                      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                      exit={
                        shouldReduceMotion
                          ? undefined
                          : { filter: 'blur(4px)', opacity: 0, scale: 0.985, y: -8 }
                      }
                      initial={
                        shouldReduceMotion ? false : { filter: 'blur(3px)', opacity: 0, y: 6 }
                      }
                      key={`${activeTab}-fields`}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {activeTab === 'build' ? (
                        <>
                          <label className={visuallyHiddenClassName} htmlFor="fairlend-build">
                            Property address
                          </label>
                          <div className="grid h-[clamp(52px,3.45vw,58px)] min-w-0 grid-cols-[22px_minmax(0,1fr)_44px] items-center gap-[10px] rounded-[12px] border border-[#dededb] bg-[rgb(255_253_249/92%)] py-0 pr-[clamp(7px,0.5vw,8px)] pl-[clamp(15px,1.15vw,19px)] transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] focus-within:border-[#96ec18] focus-within:shadow-[0_0_0_3px_rgb(150_236_24/18%),0_10px_22px_rgb(5_5_6/5%)] [&>svg]:size-[20px] [&>svg]:text-[#111c20] hero-tablet:h-[clamp(50px,6.8vw,58px)] hero-tablet:grid-cols-[22px_minmax(0,1fr)_44px] hero-tablet:pl-4 hero-tablet-landscape-short:h-[46px] hero-tablet-landscape-short:grid-cols-[20px_minmax(0,1fr)_40px] hero-tablet-landscape-short:pl-3.5 hero-mobile:h-[clamp(48px,13vw,52px)] hero-mobile:grid-cols-[20px_minmax(0,1fr)_44px] hero-mobile:pl-3.5 hero-landscape:ml-0 hero-landscape:mr-0 hero-landscape:h-[58px] hero-landscape:grid-cols-[48px_minmax(0,1fr)_58px] hero-landscape:gap-0 hero-landscape:rounded-none hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-[rgb(255_255_255/52%)] hero-landscape:p-0 hero-landscape:shadow-none hero-landscape:[&>svg]:mx-auto hero-landscape:[&>svg]:size-[24px] hero-landscape:[&>svg]:text-[#111c20] hero-landscape:[&>svg]:stroke-[2.1]">
                            <MapPin aria-hidden="true" />
                            <GoogleAddressAutocomplete
                              ariaDescribedBy="fairlend-build-description fairlend-build-status"
                              autoComplete="section-build street-address"
                              className="contents"
                              id="fairlend-build"
                              inputClassName="h-[clamp(48px,3.25vw,54px)] w-full min-w-0 border-0 bg-transparent p-0 text-[15px] text-[#15201f] shadow-none placeholder:text-[#586562] focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none hero-tablet:h-11 hero-tablet:text-[clamp(13px,1.85vw,15px)] hero-mobile:h-11 hero-mobile:text-[clamp(12px,3.4vw,14px)] hero-landscape:h-[56px] hero-landscape:px-[16px] hero-landscape:text-[20px] hero-landscape:font-medium hero-landscape:placeholder:text-[#586562]"
                              inputMode="text"
                              name="buildAddress"
                              onChange={(nextValue) => {
                                clearTransientStatus()
                                setField('build', { address: nextValue })
                              }}
                              onOpenChange={handleAddressAutocompleteOpenChange}
                              placeholder="Property address"
                              required
                              type="text"
                              value={values.build.address}
                            />
                            <Button
                              aria-label={activeMeta.submitLabel}
                              className="relative isolate size-11 overflow-visible rounded-full bg-[#96ec18] text-[#101010] shadow-[0_0_0_3px_rgb(255_253_247/96%),0_10px_20px_rgb(118_205_0/18%)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] before:absolute before:inset-[-9px] before:z-[-1] before:rounded-full before:bg-[radial-gradient(circle,rgb(150_236_24/34%)_0%,rgb(150_236_24/14%)_42%,transparent_72%)] before:opacity-80 before:blur-[2px] before:content-[''] hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#a4fb20] hover:shadow-[0_0_0_3px_rgb(255_253_247/98%),0_0_0_8px_rgb(150_236_24/15%),0_18px_30px_rgb(118_205_0/22%)] active:translate-y-0 active:scale-[0.97] motion-safe:before:animate-[applicationCtaHalo_2200ms_var(--hero-ease-out)_infinite] [&_svg]:size-6 hero-tablet:size-11 hero-tablet-landscape-short:size-10 hero-tablet-landscape-short:before:inset-[-7px] hero-mobile:size-11 hero-mobile:before:inset-[-7px] hero-landscape:size-[58px] hero-landscape:rounded-none hero-landscape:border-l hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:shadow-none hero-landscape:before:hidden hero-landscape:hover:shadow-none hero-landscape:[&_svg]:size-[34px] hero-landscape:[&_svg]:stroke-[1.8]"
                              data-fairlend-application-submit
                              disabled={isSubmitting}
                              size="icon"
                              type="submit"
                            >
                              <ArrowRight
                                aria-hidden="true"
                                className="size-6 hero-landscape:size-[34px]"
                                strokeWidth={1.8}
                              />
                            </Button>
                          </div>
                        </>
                      ) : activeTab === 'invest' ? (
                        <div className={fieldsStackClassName}>
                          <div className={fieldRowClassName}>
                            <Label className={fieldLabelClassName} htmlFor="fairlend-invest-name">
                              Name
                            </Label>
                            <Input
                              aria-describedby="fairlend-invest-description fairlend-invest-status"
                              autoComplete="section-invest name"
                              className={fieldInputClassName}
                              id="fairlend-invest-name"
                              name="name"
                              onChange={(event) => {
                                clearTransientStatus()
                                setField('invest', { name: event.target.value })
                              }}
                              placeholder="Full name"
                              required
                              type="text"
                              value={values.invest.name}
                            />
                          </div>
                          <div className={fieldRowClassName}>
                            <Label className={fieldLabelClassName} htmlFor="fairlend-invest-email">
                              Email
                            </Label>
                            <Input
                              aria-describedby="fairlend-invest-description fairlend-invest-contact-hint fairlend-invest-status"
                              aria-invalid={hasContactError || undefined}
                              autoComplete="section-invest email"
                              className={fieldInputClassName}
                              id="fairlend-invest-email"
                              inputMode="email"
                              name="email"
                              onChange={(event) => {
                                clearTransientStatus()
                                setField('invest', { email: event.target.value })
                              }}
                              placeholder="you@example.com"
                              type="email"
                              value={values.invest.email}
                            />
                          </div>
                          <div className={fieldRowClassName}>
                            <Label className={fieldLabelClassName} htmlFor="fairlend-invest-phone">
                              Phone number
                            </Label>
                            <Input
                              aria-describedby="fairlend-invest-description fairlend-invest-contact-hint fairlend-invest-status"
                              aria-invalid={hasContactError || undefined}
                              autoComplete="section-invest tel"
                              className={fieldInputClassName}
                              id="fairlend-invest-phone"
                              inputMode="tel"
                              name="tel"
                              onChange={(event) => {
                                clearTransientStatus()
                                setField('invest', { phone: event.target.value })
                              }}
                              placeholder="(555) 555-5555"
                              type="tel"
                              value={values.invest.phone}
                            />
                          </div>
                          <p
                            className={cn(
                              '-mt-1 text-xs leading-[1.3] font-semibold',
                              hasContactError ? 'text-[#a33a2a]' : 'text-[#6f7980]',
                            )}
                            id="fairlend-invest-contact-hint"
                          >
                            Email or phone number required.
                          </p>
                          <FairlendApplicationChoiceChips
                            describedBy="fairlend-invest-description fairlend-invest-status"
                            legend="Amount looking to invest"
                            name="investmentAmount"
                            onValueChange={(nextValue) => {
                              clearTransientStatus()
                              setField('invest', { amount: nextValue })
                            }}
                            options={INVESTMENT_AMOUNT_OPTIONS}
                            required
                            value={values.invest.amount}
                          />
                          <div className={fieldRowClassName}>
                            <Label className={fieldLabelClassName} htmlFor="fairlend-invest-focus">
                              Investment focus
                            </Label>
                            <Select
                              name="investmentFocus"
                              required
                              value={values.invest.focus}
                              onValueChange={(nextValue) => {
                                clearTransientStatus()
                                setField('invest', { focus: nextValue })
                              }}
                            >
                              <SelectTrigger
                                aria-describedby="fairlend-invest-description fairlend-invest-status"
                                className={fieldInputClassName}
                                id="fairlend-invest-focus"
                              >
                                <SelectValue placeholder="Investment focus" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="construction">Construction financing</SelectItem>
                                <SelectItem value="private-mortgages">Private mortgages</SelectItem>
                                <SelectItem value="investor-fit-review">
                                  Investor-fit review
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            className={fieldSubmitButtonClassName}
                            data-fairlend-application-submit
                            disabled={isSubmitting}
                            type="submit"
                          >
                            {isSubmitting ? (
                              <>
                                <LoaderCircle
                                  aria-hidden="true"
                                  className="animate-spin"
                                  strokeWidth={1.8}
                                />
                                Sending securely
                              </>
                            ) : (
                              <>
                                {activeMeta.submitLabel}
                                <ArrowRight aria-hidden="true" strokeWidth={1.8} />
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className={fieldsStackClassName}>
                          <FairlendApplicationChoiceChips
                            describedBy="fairlend-mortgage-description fairlend-mortgage-status"
                            legend="Mortgage product"
                            name="mortgageProduct"
                            onValueChange={(nextValue) => {
                              clearTransientStatus()
                              setField('mortgage', {
                                product: nextValue,
                                ...(MORTGAGE_PRODUCTS_REQUIRING_BALANCE.has(nextValue)
                                  ? {}
                                  : { currentMortgage: '' }),
                              })
                            }}
                            options={MORTGAGE_PRODUCT_OPTIONS}
                            required
                            value={values.mortgage.product}
                          />

                          <div className={compactFieldsGridClassName}>
                            <div className={fieldRowClassName}>
                              <Label
                                className={fieldLabelClassName}
                                htmlFor="fairlend-mortgage-name"
                              >
                                Name
                              </Label>
                              <Input
                                aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
                                autoComplete="section-mortgage name"
                                className={fieldInputClassName}
                                id="fairlend-mortgage-name"
                                name="name"
                                onChange={(event) => {
                                  clearTransientStatus()
                                  setField('mortgage', { name: event.target.value })
                                }}
                                placeholder="Full name"
                                required
                                type="text"
                                value={values.mortgage.name}
                              />
                            </div>
                            <div className={fieldRowClassName}>
                              <Label
                                className={fieldLabelClassName}
                                htmlFor="fairlend-mortgage-email"
                              >
                                Email
                              </Label>
                              <Input
                                aria-describedby="fairlend-mortgage-description fairlend-mortgage-contact-hint fairlend-mortgage-status"
                                aria-invalid={hasContactError || undefined}
                                autoComplete="section-mortgage email"
                                className={fieldInputClassName}
                                id="fairlend-mortgage-email"
                                inputMode="email"
                                name="email"
                                onChange={(event) => {
                                  clearTransientStatus()
                                  setField('mortgage', { email: event.target.value })
                                }}
                                placeholder="you@example.com"
                                type="email"
                                value={values.mortgage.email}
                              />
                            </div>
                            <div className={fieldRowClassName}>
                              <Label
                                className={fieldLabelClassName}
                                htmlFor="fairlend-mortgage-phone"
                              >
                                Phone number
                              </Label>
                              <Input
                                aria-describedby="fairlend-mortgage-description fairlend-mortgage-contact-hint fairlend-mortgage-status"
                                aria-invalid={hasContactError || undefined}
                                autoComplete="section-mortgage tel"
                                className={fieldInputClassName}
                                id="fairlend-mortgage-phone"
                                inputMode="tel"
                                name="tel"
                                onChange={(event) => {
                                  clearTransientStatus()
                                  setField('mortgage', { phone: event.target.value })
                                }}
                                placeholder="(555) 555-5555"
                                type="tel"
                                value={values.mortgage.phone}
                              />
                            </div>
                            <div className={fieldRowClassName}>
                              <Label
                                className={fieldLabelClassName}
                                htmlFor="fairlend-mortgage-address"
                              >
                                Address
                              </Label>
                              <GoogleAddressAutocomplete
                                ariaDescribedBy="fairlend-mortgage-description fairlend-mortgage-status"
                                autoComplete="section-mortgage street-address"
                                className="contents"
                                id="fairlend-mortgage-address"
                                inputClassName={cn(
                                  fieldInputClassName,
                                  'pr-[clamp(36px,2.6vw,42px)]',
                                )}
                                inputMode="text"
                                name="mortgageAddress"
                                onChange={(nextValue) => {
                                  clearTransientStatus()
                                  setField('mortgage', { address: nextValue })
                                }}
                                onOpenChange={handleAddressAutocompleteOpenChange}
                                placeholder="Property address"
                                required
                                type="text"
                                value={values.mortgage.address}
                              />
                            </div>
                            <p
                              className={cn(
                                'col-span-full -mt-1 text-xs leading-[1.3] font-semibold',
                                hasContactError ? 'text-[#a33a2a]' : 'text-[#6f7980]',
                              )}
                              id="fairlend-mortgage-contact-hint"
                            >
                              Email or phone number required.
                            </p>
                          </div>

                          <FairlendApplicationChoiceChips
                            describedBy="fairlend-mortgage-description fairlend-mortgage-status"
                            legend="Amount needed"
                            name="amountNeeded"
                            onValueChange={(nextValue) => {
                              clearTransientStatus()
                              setField('mortgage', { amount: nextValue })
                            }}
                            options={MORTGAGE_AMOUNT_OPTIONS}
                            required
                            value={values.mortgage.amount}
                          />

                          <div
                            className={cn(
                              compactFieldsGridClassName,
                              !shouldAskForMortgageBalance && 'grid-cols-1',
                            )}
                          >
                            {shouldAskForMortgageBalance ? (
                              <motion.div
                                animate={{ opacity: 1, y: 0 }}
                                className={fieldRowClassName}
                                initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                                }
                              >
                                <Label
                                  className={fieldLabelClassName}
                                  htmlFor="fairlend-mortgage-current-balance"
                                >
                                  Current mortgage balance
                                </Label>
                                <div className="relative">
                                  <span aria-hidden="true" className={currencyAdornmentClassName}>
                                    $
                                  </span>
                                  <Input
                                    aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
                                    className={cn(fieldInputClassName, 'pl-[clamp(30px,2vw,34px)]')}
                                    id="fairlend-mortgage-current-balance"
                                    inputMode="decimal"
                                    name="currentMortgageBalance"
                                    onChange={(event) => {
                                      clearTransientStatus()
                                      setField('mortgage', {
                                        currentMortgage: event.target.value,
                                      })
                                    }}
                                    placeholder="0 if none"
                                    type="text"
                                    value={values.mortgage.currentMortgage}
                                  />
                                </div>
                              </motion.div>
                            ) : null}
                            <div className={fieldRowClassName}>
                              <Label
                                className={fieldLabelClassName}
                                htmlFor="fairlend-mortgage-timeline"
                              >
                                Timing
                              </Label>
                              <Select
                                name="mortgageTimeline"
                                onValueChange={(nextValue) => {
                                  clearTransientStatus()
                                  setField('mortgage', { timeline: nextValue })
                                }}
                                required
                                value={values.mortgage.timeline}
                              >
                                <SelectTrigger
                                  aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
                                  className={fieldInputClassName}
                                  id="fairlend-mortgage-timeline"
                                >
                                  <SelectValue placeholder="Select timing" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MORTGAGE_TIMELINE_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            className={fieldSubmitButtonClassName}
                            data-fairlend-application-submit
                            disabled={isSubmitting}
                            type="submit"
                          >
                            {isSubmitting ? (
                              <>
                                <LoaderCircle
                                  aria-hidden="true"
                                  className="animate-spin"
                                  strokeWidth={1.8}
                                />
                                Sending securely
                              </>
                            ) : (
                              <>
                                {activeMeta.submitLabel}
                                <ArrowRight aria-hidden="true" strokeWidth={1.8} />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p
                  aria-live="polite"
                  className="mt-2 min-h-[17px] text-xs leading-[1.3] font-bold text-[#6f7980] hero-tablet:hidden hero-mobile:hidden hero-landscape:hidden"
                  id={`fairlend-${activeTab}-status`}
                >
                  {submittedTab === activeTab
                    ? activeTab === 'invest' || activeTab === 'mortgage'
                      ? ''
                      : 'Opening your intake.'
                    : submitError
                      ? submitError
                      : isSubmitting
                        ? 'Saving...'
                        : ''}
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </FairlendApplicationIntentTabs>
    </Card>
  )
}
