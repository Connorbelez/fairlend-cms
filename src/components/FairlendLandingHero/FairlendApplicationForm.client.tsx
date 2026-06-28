'use client'

import { ArrowRight, ChartNoAxesCombined, House, HousePlus, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, memo, useCallback, useRef, useState } from 'react'

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
import { cn } from '@/utilities/ui'

const formTabs = [
  { icon: HousePlus, label: 'Build', value: 'build' },
  { icon: ChartNoAxesCombined, label: 'Invest', value: 'invest' },
  { icon: House, label: 'Get a mortgage', value: 'mortgage' },
] as const

type FormTab = (typeof formTabs)[number]['value']

const TAB_META: Record<
  FormTab,
  { description: string; heading: string; submitLabel: string }
> = {
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
    equity: string
  }
}

const INITIAL_VALUES: FormValues = {
  build: { address: '' },
  invest: { name: '', email: '', phone: '', amount: '', focus: '' },
  mortgage: { name: '', email: '', phone: '', address: '', equity: '' },
}

const visuallyHiddenClassName =
  'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]'

const fieldLabelClassName =
  'text-[clamp(10px,0.72vw,11px)] font-extrabold uppercase tracking-[0.04em] text-[#405361]'

const fieldInputClassName =
  'h-[clamp(46px,3.1vw,52px)] w-full min-w-0 rounded-[12px] border border-[var(--fairlend-line)] bg-[rgb(255_253_249/90%)] px-[clamp(14px,1vw,16px)] text-[clamp(14px,0.95vw,15px)] text-[#243944] shadow-none transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] data-[placeholder]:text-[#52616a] placeholder:text-[#52616a] focus:border-[color-mix(in_oklch,var(--fairlend-orange)_42%,var(--fairlend-line))] focus:shadow-[0_0_0_3px_rgb(255_58_25/9%)] focus:outline-none focus-visible:border-[color-mix(in_oklch,var(--fairlend-orange)_42%,var(--fairlend-line))] focus-visible:shadow-[0_0_0_3px_rgb(255_58_25/9%)] focus-visible:outline-none focus-visible:ring-0 hero-mobile:h-[clamp(44px,12vw,50px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:px-[14px]'

const fieldSubmitButtonClassName =
  'mt-1 inline-flex h-[clamp(48px,3.2vw,54px)] w-full items-center justify-center gap-2 rounded-[12px] bg-[oklch(62%_0.25_31)] text-[var(--fairlend-panel)] text-[clamp(14px,0.92vw,15px)] font-extrabold shadow-[0_0_0_3px_oklch(99%_0.012_76/0.96),0_10px_20px_oklch(57%_0.25_30/0.24),0_0_18px_oklch(72%_0.2_36/0.18)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[oklch(59%_0.25_29)] hover:shadow-[0_0_0_3px_oklch(99%_0.012_76/0.98),0_0_0_8px_oklch(75%_0.2_37/0.13),0_18px_30px_oklch(56%_0.25_30/0.32),0_0_28px_oklch(72%_0.21_36/0.24)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[oklch(72%_0.2_36/0.5)] hero-mobile:h-[clamp(46px,12vw,52px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:rounded-[12px] hero-landscape:h-[56px] hero-landscape:text-[16px] hero-landscape:rounded-[14px]'

const fieldsStackClassName = 'flex flex-col gap-[clamp(10px,0.8vw,14px)]'
const fieldRowClassName = 'flex flex-col gap-[6px]'
const currencyAdornmentClassName =
  'pointer-events-none absolute top-1/2 left-[clamp(14px,1vw,16px)] -translate-y-1/2 text-[clamp(14px,0.95vw,15px)] font-bold text-[#52616a]'

type ApplicationTabButtonProps = {
  icon: (typeof formTabs)[number]['icon']
  isActive: boolean
  label: string
  onSelect: (value: FormTab) => void
  value: FormTab
}

const ApplicationTabButton = memo(function ApplicationTabButton({
  icon: Icon,
  isActive,
  label,
  onSelect,
  value,
}: ApplicationTabButtonProps) {
  return (
    <button
      aria-controls={`fairlend-${value}-panel`}
      aria-selected={isActive}
      className="relative z-[1] inline-flex h-[clamp(50px,3.35vw,56px)] min-w-0 cursor-pointer items-center justify-center gap-[clamp(6px,0.52vw,9px)] whitespace-nowrap rounded-none border-0 bg-transparent px-2.5 py-0 text-[clamp(12px,0.82vw,14px)] font-extrabold text-[var(--tabs-text-muted)] shadow-none transition-colors duration-[var(--tabs-dur)] ease-[var(--tabs-ease)] hover:bg-transparent hover:text-[var(--tabs-text-active)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--tabs-text-active)] data-[state=active]:shadow-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_70%,var(--fairlend-panel))] [&_svg]:size-[21px] hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:gap-[7px] hero-tablet:text-[clamp(12px,1.8vw,14px)] hero-tablet:[&_svg]:size-[18px] hero-tablet-landscape-short:h-10 hero-tablet-landscape-short:gap-1.5 hero-tablet-landscape-short:text-[12px] hero-tablet-landscape-short:[&_svg]:size-[17px] hero-mobile:h-11 hero-mobile:gap-1.5 hero-mobile:text-[clamp(11px,3.1vw,12.5px)] hero-mobile:[&_svg]:size-[17px] hero-landscape:h-full hero-landscape:gap-[8px] hero-landscape:bg-transparent hero-landscape:text-[14px] hero-landscape:font-extrabold hero-landscape:text-[oklch(0.182_0.045_166)] hero-landscape:shadow-none hero-landscape:data-[state=active]:z-[3] hero-landscape:data-[state=active]:rounded-[14px] hero-landscape:data-[state=active]:border-transparent hero-landscape:data-[state=active]:bg-white/70 hero-landscape:data-[state=active]:text-[var(--fairlend-orange)] hero-landscape:data-[state=active]:shadow-[0_8px_18px_rgb(8_45_35/7%),inset_0_1px_0_rgb(255_255_255/92%)] hero-landscape:[&_svg]:size-[20px] hero-landscape:[&_svg]:stroke-[2.1] hero-landscape:first:data-[state=active]:rounded-[14px]"
      data-form-tab={value}
      data-state={isActive ? 'active' : 'inactive'}
      id={`fairlend-${value}-tab`}
      onClick={() => onSelect(value)}
      role="tab"
      type="button"
    >
      <Icon
        aria-hidden="true"
        className="size-[23px] hero-tablet:size-[18px] hero-mobile:size-[17px] hero-landscape:size-[20px]"
      />
      <span>{label}</span>
    </button>
  )
})

export function FairlendApplicationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FormTab>('build')
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTab, setSubmittedTab] = useState<FormTab | null>(null)
  const [isAddressAutocompleteOpen, setIsAddressAutocompleteOpen] = useState(false)
  const activeInputRef = useRef<HTMLInputElement>(null)

  const activeMeta = TAB_META[activeTab]
  const shouldLiftForAutocomplete = activeTab !== 'invest' && isAddressAutocompleteOpen

  const handleSelectTab = useCallback((value: FormTab) => {
    setSubmitError('')
    setSubmittedTab(null)
    setIsAddressAutocompleteOpen(false)
    setActiveTab(value)
  }, [])

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

    setIsSubmitting(true)
    setSubmitError('')

    let leadId: string | undefined
    const body: Record<string, unknown> = {
      intent: activeTab,
      source: 'homepage-application-form',
      status: 'started',
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
      const { name, email, phone, address, equity } = values.mortgage
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()
      const trimmedPhone = phone.trim()
      const trimmedAddress = address.trim()
      body.name = trimmedName
      body.email = trimmedEmail
      body.phone = trimmedPhone
      body.address = trimmedAddress
      body.intake = { approximateEquity: equity.trim(), homepageValue: trimmedAddress }
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
        const payload = (await response.json()) as { id?: string }
        leadId = payload.id
      } else {
        setSubmitError('We could not save this yet, but you can continue.')
      }
    } catch {
      setSubmitError('We could not save this yet, but you can continue.')
    } finally {
      setIsSubmitting(false)
    }

    setSubmittedTab(activeTab)

    const params = new URLSearchParams({ intent: activeTab })
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
        'fairlend-hero-application-card pointer-events-auto absolute right-[2.35%] bottom-[calc(5.45%+var(--hero-stats-height,0px))] z-[12] w-[min(30.8%,512px)] min-w-[400px] overflow-visible rounded-[22px] border border-[rgb(236_224_215/88%)] bg-[rgb(255_250_245/93%)] shadow-[0_18px_34px_rgb(52_33_18/12%)] transition-[bottom] duration-300 ease-[var(--hero-ease-quint)] [--card-spacing:0px] [--tabs-bar-bg:transparent] [--tabs-dur:250ms] [--tabs-ease:cubic-bezier(0.22,1,0.36,1)] [--tabs-pill-bg:#ffb9a5] [--tabs-text-active:var(--fairlend-orange)] [--tabs-text-muted:#071e29] motion-safe:animate-[heroPanelIn_680ms_var(--hero-ease-out)_360ms_both] hero-max-1120:min-w-[400px] hero-max-1279:right-4 hero-max-1279:bottom-[18px] hero-max-1279:left-4 hero-max-1279:w-auto hero-max-1279:min-w-0 hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:mt-0 hero-mobile:w-full hero-mobile:min-w-0 hero-tablet:relative hero-tablet:right-auto hero-tablet:bottom-auto hero-tablet:left-auto hero-tablet:mt-[clamp(12px,2vw,16px)] hero-tablet:w-full hero-tablet:min-w-0 hero-tablet:overflow-visible hero-tablet:rounded-[14px] hero-tablet:border hero-tablet:border-[rgb(238_225_213/88%)] hero-tablet:bg-[rgb(255_253_249/84%)] hero-tablet:shadow-[0_10px_22px_rgb(56_35_20/8%)] hero-tablet-landscape:absolute hero-tablet-landscape:right-0 hero-tablet-landscape:bottom-[clamp(34px,5svh,64px)] hero-tablet-landscape:left-auto hero-tablet-landscape:mt-0 hero-tablet-landscape:w-[min(43vw,520px)] hero-tablet-landscape:min-w-[430px] hero-tablet-landscape:max-w-[calc(100vw-48px)] hero-tablet-landscape:rounded-[22px] hero-tablet-landscape:border-[rgb(255_255_255/76%)] hero-tablet-landscape:bg-[rgb(249_243_235/94%)] hero-tablet-landscape:shadow-[0_18px_28px_rgb(8_22_27/14%),0_4px_10px_rgb(62_40_23/8%)] hero-tablet-landscape-short:right-0 hero-tablet-landscape-short:bottom-[18px] hero-tablet-landscape-short:w-[min(42vw,500px)] hero-tablet-landscape-short:min-w-[410px] hero-tablet-landscape-short:rounded-[18px] hero-portrait-wide:relative hero-portrait-wide:right-auto hero-portrait-wide:bottom-auto hero-portrait-wide:left-auto hero-portrait-wide:mt-[clamp(14px,2vw,20px)] hero-portrait-wide:w-full hero-portrait-wide:min-w-0 hero-portrait-wide:overflow-visible hero-portrait-wide:rounded-[16px] hero-portrait-wide:border hero-portrait-wide:border-[rgb(238_225_213/88%)] hero-portrait-wide:bg-[rgb(255_253_249/84%)] hero-portrait-wide:shadow-[0_10px_22px_rgb(56_35_20/8%)] hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:rounded-lg hero-landscape:fixed hero-landscape:right-[clamp(18px,1.9vw,34px)] hero-landscape:bottom-[clamp(18px,1.8vw,32px)] hero-landscape:left-auto hero-landscape:z-[40] hero-landscape:w-[min(30vw,500px)] hero-landscape:min-w-[420px] hero-landscape:max-w-[calc(100vw-48px)] hero-landscape:rounded-[18px] hero-landscape:border-[rgb(8_45_35/14%)] hero-landscape:bg-[linear-gradient(180deg,rgb(255_253_247)_0%,rgb(250_246_238)_100%)] hero-landscape:shadow-[0_22px_60px_rgb(8_45_35/13%),0_8px_22px_rgb(62_40_23/8%),inset_0_1px_0_rgb(255_255_255/86%)]',
        shouldLiftForAutocomplete &&
          'bottom-[calc(5.45%+var(--hero-stats-height,0px)+clamp(78px,7vw,124px))] hero-tablet-landscape:bottom-[calc(clamp(34px,5svh,64px)+clamp(78px,7vw,124px))] hero-tablet-landscape-short:bottom-[calc(18px+clamp(60px,9vw,96px))] hero-landscape:bottom-[calc(clamp(18px,1.8vw,32px)+clamp(78px,7vw,124px))] hero-tablet:bottom-auto hero-portrait-wide:bottom-auto hero-mobile:bottom-auto',
      )}
      data-autocomplete-open={shouldLiftForAutocomplete ? 'true' : 'false'}
      data-testid="fairlend-application-form"
    >
      <div
        className={cn(
          'gap-0 rounded-[inherit] hero-landscape:bg-transparent',
          shouldLiftForAutocomplete ? 'overflow-visible' : 'overflow-hidden',
        )}
      >
        <div
          aria-label="Application type"
          className="relative grid h-[clamp(50px,3.35vw,56px)] w-full grid-cols-[1fr_1.1fr_1.34fr] items-stretch gap-0 rounded-none border-b border-[var(--fairlend-line)] bg-transparent p-0 hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:grid-cols-[1fr_1fr_1.22fr] hero-tablet-landscape-short:h-10 hero-mobile:h-11 hero-mobile:grid-cols-[1fr_1fr_1.24fr] hero-landscape:m-2 hero-landscape:mb-0 hero-landscape:h-[52px] hero-landscape:w-auto hero-landscape:grid-cols-[0.95fr_0.95fr_1.36fr] hero-landscape:gap-1 hero-landscape:rounded-[16px] hero-landscape:border hero-landscape:border-[rgb(8_45_35/8%)] hero-landscape:bg-[rgb(239_233_225/72%)] hero-landscape:p-1 hero-landscape:shadow-[inset_0_1px_0_rgb(255_255_255/58%)]"
          role="tablist"
        >
          {formTabs.map(({ icon: Icon, label, value }) => (
            <ApplicationTabButton
              icon={Icon}
              isActive={activeTab === value}
              key={value}
              label={label}
              onSelect={handleSelectTab}
              value={value}
            />
          ))}
        </div>

        <div className="isolate min-h-[clamp(106px,7.4vw,124px)] px-[clamp(18px,1.45vw,24px)] py-[clamp(14px,1vw,17px)] [&_h2]:m-0 [&_h2]:mb-[12px] [&_h2]:text-balance [&_h2]:text-[clamp(20px,1.28vw,25px)] [&_h2]:leading-[1.1] [&_h2]:font-extrabold [&_h2]:text-[#071d25] hero-tablet:min-h-0 hero-tablet:px-[clamp(18px,2.6vw,22px)] hero-tablet:pt-[clamp(13px,2vw,17px)] hero-tablet:pb-[clamp(11px,1.8vw,15px)] hero-tablet:[&_h2]:mb-[clamp(10px,1.6vw,12px)] hero-tablet:[&_h2]:text-[clamp(21px,3vw,26px)] hero-tablet-landscape-short:px-[16px] hero-tablet-landscape-short:pt-[10px] hero-tablet-landscape-short:pb-[10px] hero-tablet-landscape-short:[&_h2]:mb-[8px] hero-tablet-landscape-short:[&_h2]:text-[22px] hero-mobile:min-h-0 hero-mobile:px-[clamp(16px,4.6vw,20px)] hero-mobile:pt-[clamp(10px,3vw,13px)] hero-mobile:pb-[clamp(7px,2.2vw,10px)] hero-mobile:[&_h2]:mb-[clamp(8px,2.4vw,10px)] hero-mobile:[&_h2]:text-[clamp(18px,5vw,21px)] hero-landscape:relative hero-landscape:mx-3 hero-landscape:mt-2 hero-landscape:mb-3 hero-landscape:min-h-[116px] hero-landscape:rounded-[16px] hero-landscape:border hero-landscape:border-[rgb(8_45_35/9%)] hero-landscape:bg-[rgb(255_253_247/76%)] hero-landscape:bg-clip-padding hero-landscape:px-[18px] hero-landscape:pt-[15px] hero-landscape:pb-[14px] hero-landscape:shadow-[inset_0_1px_0_rgb(255_255_255/88%)] hero-landscape:[&_h2]:ml-[1px] hero-landscape:[&_h2]:mb-[12px] hero-landscape:[&_h2]:font-serif hero-landscape:[&_h2]:text-[24px] hero-landscape:[&_h2]:leading-[1.02] hero-landscape:[&_h2]:tracking-[0] hero-landscape:[&_h2]:text-[oklch(0.182_0.045_166)]">
          <div
            aria-labelledby={`fairlend-${activeTab}-tab`}
            className="m-0"
            id={`fairlend-${activeTab}-panel`}
            role="tabpanel"
          >
            <h2>{activeMeta.heading}</h2>
            <form className="m-0" onSubmit={handleSubmit}>
              <input name="intent" type="hidden" value={activeTab} />
              <span
                className={visuallyHiddenClassName}
                id={`fairlend-${activeTab}-description`}
              >
                {activeMeta.description}
              </span>

              {activeTab === 'build' ? (
                <>
                  <label className={visuallyHiddenClassName} htmlFor="fairlend-build">
                    Property address
                  </label>
                  <div className="grid h-[clamp(52px,3.45vw,58px)] min-w-0 grid-cols-[22px_minmax(0,1fr)_44px] items-center gap-[10px] rounded-[12px] border border-[var(--fairlend-line)] bg-[rgb(255_253_249/90%)] py-0 pr-[clamp(7px,0.5vw,8px)] pl-[clamp(15px,1.15vw,19px)] transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] focus-within:border-[color-mix(in_oklch,var(--fairlend-orange)_42%,var(--fairlend-line))] focus-within:shadow-[0_0_0_3px_rgb(255_58_25/9%),0_10px_22px_rgb(56_35_20/6%)] [&>svg]:size-[20px] [&>svg]:text-[#405361] hero-tablet:h-[clamp(50px,6.8vw,58px)] hero-tablet:grid-cols-[22px_minmax(0,1fr)_44px] hero-tablet:pl-4 hero-tablet-landscape-short:h-[46px] hero-tablet-landscape-short:grid-cols-[20px_minmax(0,1fr)_40px] hero-tablet-landscape-short:pl-3.5 hero-mobile:h-[clamp(48px,13vw,52px)] hero-mobile:grid-cols-[20px_minmax(0,1fr)_44px] hero-mobile:pl-3.5 hero-landscape:ml-[-2px] hero-landscape:mr-[4px] hero-landscape:h-[58px] hero-landscape:grid-cols-[24px_minmax(0,1fr)_50px] hero-landscape:gap-[12px] hero-landscape:rounded-full hero-landscape:border-[rgb(209_199_190/70%)] hero-landscape:bg-[rgb(255_255_251/92%)] hero-landscape:pr-[4px] hero-landscape:pl-[18px] hero-landscape:shadow-[inset_0_1px_0_rgb(255_255_255/90%),0_1px_2px_rgb(18_28_31/3%)] hero-landscape:[&>svg]:size-[24px] hero-landscape:[&>svg]:text-[#111c20] hero-landscape:[&>svg]:stroke-[2.1]">
                    <MapPin aria-hidden="true" />
                    <GoogleAddressAutocomplete
                      ariaDescribedBy="fairlend-build-description fairlend-build-status"
                      autoComplete="section-build street-address"
                      className="contents"
                      id="fairlend-build"
                      inputClassName="h-[clamp(48px,3.25vw,54px)] w-full min-w-0 border-0 bg-transparent p-0 text-[15px] text-[#243944] shadow-none placeholder:text-[#52616a] focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none hero-tablet:h-11 hero-tablet:text-[clamp(13px,1.85vw,15px)] hero-mobile:h-11 hero-mobile:text-[clamp(12px,3.4vw,14px)] hero-landscape:h-[56px] hero-landscape:text-[20px] hero-landscape:font-medium hero-landscape:placeholder:text-[#52616a]"
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
                      className="relative isolate size-11 overflow-visible rounded-full bg-[oklch(62%_0.25_31)] text-[var(--fairlend-panel)] shadow-[0_0_0_3px_oklch(99%_0.012_76/0.96),0_10px_20px_oklch(57%_0.25_30/0.24),0_0_18px_oklch(72%_0.2_36/0.18)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] before:absolute before:inset-[-9px] before:z-[-1] before:rounded-full before:bg-[radial-gradient(circle,oklch(73%_0.2_35/0.4)_0%,oklch(72%_0.2_35/0.18)_42%,transparent_72%)] before:opacity-80 before:blur-[2px] before:content-[''] hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[oklch(59%_0.25_29)] hover:shadow-[0_0_0_3px_oklch(99%_0.012_76/0.98),0_0_0_8px_oklch(75%_0.2_37/0.13),0_18px_30px_oklch(56%_0.25_30/0.32),0_0_28px_oklch(72%_0.21_36/0.24)] active:translate-y-0 active:scale-[0.97] motion-safe:before:animate-[applicationCtaHalo_2200ms_var(--hero-ease-out)_infinite] [&_svg]:size-6 hero-tablet:size-11 hero-tablet-landscape-short:size-10 hero-tablet-landscape-short:before:inset-[-7px] hero-mobile:size-11 hero-mobile:before:inset-[-7px] hero-landscape:size-[56px] hero-landscape:text-white hero-landscape:shadow-[0_0_0_4px_oklch(99%_0.012_76/0.96),0_12px_24px_oklch(57%_0.25_30/0.28),0_0_24px_oklch(71%_0.21_36/0.2)] hero-landscape:before:inset-[-12px] hero-landscape:hover:shadow-[0_0_0_4px_oklch(99%_0.012_76/0.98),0_0_0_10px_oklch(75%_0.2_37/0.13),0_18px_34px_oklch(56%_0.25_30/0.34),0_0_32px_oklch(72%_0.21_36/0.24)] hero-landscape:[&_svg]:size-[34px] hero-landscape:[&_svg]:stroke-[1.8]"
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
                      aria-describedby="fairlend-invest-description fairlend-invest-status"
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
                      required
                      type="email"
                      value={values.invest.email}
                    />
                  </div>
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-invest-phone">
                      Phone number
                    </Label>
                    <Input
                      aria-describedby="fairlend-invest-description fairlend-invest-status"
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
                      required
                      type="tel"
                      value={values.invest.phone}
                    />
                  </div>
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-invest-amount">
                      Amount looking to invest
                    </Label>
                    <div className="relative">
                      <span aria-hidden="true" className={currencyAdornmentClassName}>
                        $
                      </span>
                      <Input
                        aria-describedby="fairlend-invest-description fairlend-invest-status"
                        className={cn(fieldInputClassName, 'pl-[clamp(30px,2vw,34px)]')}
                        id="fairlend-invest-amount"
                        inputMode="numeric"
                        name="investmentAmount"
                        onChange={(event) => {
                          clearTransientStatus()
                          setField('invest', { amount: event.target.value })
                        }}
                        placeholder="Amount"
                        type="text"
                        value={values.invest.amount}
                      />
                    </div>
                  </div>
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
                        <SelectItem value="mic">MIC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className={fieldSubmitButtonClassName}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {activeMeta.submitLabel}
                    <ArrowRight aria-hidden="true" strokeWidth={1.8} />
                  </Button>
                </div>
              ) : (
                <div className={fieldsStackClassName}>
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-mortgage-name">
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
                    <Label className={fieldLabelClassName} htmlFor="fairlend-mortgage-email">
                      Email
                    </Label>
                    <Input
                      aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
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
                      required
                      type="email"
                      value={values.mortgage.email}
                    />
                  </div>
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-mortgage-phone">
                      Phone number
                    </Label>
                    <Input
                      aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
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
                      required
                      type="tel"
                      value={values.mortgage.phone}
                    />
                  </div>
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-mortgage-address">
                      Address
                    </Label>
                    <GoogleAddressAutocomplete
                      ariaDescribedBy="fairlend-mortgage-description fairlend-mortgage-status"
                      autoComplete="section-mortgage street-address"
                      className="contents"
                      id="fairlend-mortgage-address"
                      inputClassName={cn(fieldInputClassName, 'pr-[clamp(36px,2.6vw,42px)]')}
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
                  <div className={fieldRowClassName}>
                    <Label className={fieldLabelClassName} htmlFor="fairlend-mortgage-equity">
                      Approximate equity in home
                    </Label>
                    <div className="relative">
                      <span aria-hidden="true" className={currencyAdornmentClassName}>
                        $
                      </span>
                      <Input
                        aria-describedby="fairlend-mortgage-description fairlend-mortgage-status"
                        className={cn(fieldInputClassName, 'pl-[clamp(30px,2vw,34px)]')}
                        id="fairlend-mortgage-equity"
                        inputMode="numeric"
                        name="approximateEquity"
                        onChange={(event) => {
                          clearTransientStatus()
                          setField('mortgage', { equity: event.target.value })
                        }}
                        placeholder="Approximate equity"
                        type="text"
                        value={values.mortgage.equity}
                      />
                    </div>
                  </div>
                  <Button
                    className={fieldSubmitButtonClassName}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {activeMeta.submitLabel}
                    <ArrowRight aria-hidden="true" strokeWidth={1.8} />
                  </Button>
                </div>
              )}

              <p
                aria-live="polite"
                className="mt-2 min-h-[17px] text-[11px] leading-[1.3] font-bold text-[#6f7980] hero-tablet:hidden hero-mobile:hidden hero-landscape:hidden"
                id={`fairlend-${activeTab}-status`}
              >
                {submittedTab === activeTab
                  ? 'Opening your intake.'
                  : submitError
                    ? submitError
                    : isSubmitting
                      ? 'Saving...'
                      : ''}
              </p>
            </form>
          </div>
        </div>
      </div>
    </Card>
  )
}
