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
  'text-[clamp(10px,0.72vw,11px)] font-extrabold uppercase tracking-[0.04em] text-[#2f3b39]'

const fieldInputClassName =
  'h-[clamp(46px,3.1vw,52px)] w-full min-w-0 rounded-[12px] border border-[#dededb] bg-[rgb(255_253_249/92%)] px-[clamp(14px,1vw,16px)] text-[clamp(14px,0.95vw,15px)] text-[#15201f] shadow-none transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] data-[placeholder]:text-[#586562] placeholder:text-[#586562] focus:border-[#96ec18] focus:shadow-[0_0_0_3px_rgb(150_236_24/18%)] focus:outline-none focus-visible:border-[#96ec18] focus-visible:shadow-[0_0_0_3px_rgb(150_236_24/18%)] focus-visible:outline-none focus-visible:ring-0 hero-mobile:h-[clamp(44px,12vw,50px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:px-[14px]'

const fieldSubmitButtonClassName =
  'mt-1 inline-flex h-[clamp(48px,3.2vw,54px)] w-full items-center justify-center gap-2 rounded-[12px] bg-[#96ec18] text-[#101010] text-[clamp(14px,0.92vw,15px)] font-extrabold shadow-[0_0_0_3px_rgb(255_253_247/96%),0_10px_20px_rgb(118_205_0/18%)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[#a4fb20] hover:shadow-[0_0_0_3px_rgb(255_253_247/98%),0_0_0_8px_rgb(150_236_24/15%),0_18px_30px_rgb(118_205_0/22%)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#111] hero-mobile:h-[clamp(46px,12vw,52px)] hero-mobile:text-[clamp(13px,3.6vw,15px)] hero-mobile:rounded-[12px] hero-landscape:h-[56px] hero-landscape:text-[16px] hero-landscape:rounded-[14px]'

const fieldsStackClassName = 'flex flex-col gap-[clamp(10px,0.8vw,14px)]'
const fieldRowClassName = 'flex flex-col gap-[6px]'
const currencyAdornmentClassName =
  'pointer-events-none absolute top-1/2 left-[clamp(14px,1vw,16px)] -translate-y-1/2 text-[clamp(14px,0.95vw,15px)] font-bold text-[#586562]'

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
      className="relative z-[1] inline-flex h-[clamp(50px,3.35vw,56px)] min-w-0 cursor-pointer items-center justify-center gap-[clamp(6px,0.52vw,9px)] whitespace-nowrap rounded-none border-0 bg-transparent px-2.5 py-0 text-[clamp(12px,0.82vw,14px)] font-extrabold text-[var(--tabs-text-muted)] shadow-none transition-colors duration-[var(--tabs-dur)] ease-[var(--tabs-ease)] hover:bg-transparent hover:text-[var(--tabs-text-active)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--tabs-text-active)] data-[state=active]:shadow-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#96ec18] [&_svg]:size-[21px] hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:gap-[7px] hero-tablet:text-[clamp(12px,1.8vw,14px)] hero-tablet:[&_svg]:size-[18px] hero-tablet-landscape-short:h-10 hero-tablet-landscape-short:gap-1.5 hero-tablet-landscape-short:text-[12px] hero-tablet-landscape-short:[&_svg]:size-[17px] hero-mobile:h-11 hero-mobile:gap-1.5 hero-mobile:text-[clamp(11px,3.1vw,12.5px)] hero-mobile:[&_svg]:size-[17px] hero-landscape:h-full hero-landscape:gap-[8px] hero-landscape:border-r hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-transparent hero-landscape:text-[14px] hero-landscape:font-extrabold hero-landscape:text-[#101010] hero-landscape:shadow-none hero-landscape:last:border-r-0 hero-landscape:data-[state=active]:z-[3] hero-landscape:data-[state=active]:bg-[rgb(255_255_255/46%)] hero-landscape:data-[state=active]:text-[#101010] hero-landscape:data-[state=active]:shadow-[inset_0_-2px_0_rgb(150_236_24/100%)] hero-landscape:[&_svg]:size-[20px] hero-landscape:[&_svg]:stroke-[2.1]"
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
      source: `homepage-${activeTab}-application-form`,
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
        'fairlend-hero-application-card pointer-events-auto absolute right-[2.35%] bottom-[calc(5.45%+var(--hero-stats-height,0px))] z-[12] w-[min(30.8%,512px)] min-w-[400px] overflow-visible rounded-[22px] border border-[#dededb] bg-[rgb(251_250_248/94%)] shadow-[0_18px_34px_rgb(5_5_6/10%)] transition-[top,bottom] duration-300 ease-[var(--hero-ease-quint)] [--card-spacing:0px] [--tabs-bar-bg:transparent] [--tabs-dur:250ms] [--tabs-ease:cubic-bezier(0.22,1,0.36,1)] [--tabs-pill-bg:#96ec18] [--tabs-text-active:#101010] [--tabs-text-muted:#10201b] motion-safe:animate-[heroPanelIn_680ms_var(--hero-ease-out)_360ms_both] hero-max-1120:min-w-[400px] hero-max-1279:right-4 hero-max-1279:bottom-[18px] hero-max-1279:left-4 hero-max-1279:w-auto hero-max-1279:min-w-0 hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:mt-0 hero-mobile:w-full hero-mobile:min-w-0 hero-tablet:relative hero-tablet:right-auto hero-tablet:bottom-auto hero-tablet:left-auto hero-tablet:mt-[clamp(12px,2vw,16px)] hero-tablet:w-full hero-tablet:min-w-0 hero-tablet:overflow-visible hero-tablet:rounded-[14px] hero-tablet:border hero-tablet:border-[#dededb] hero-tablet:bg-[rgb(255_253_249/86%)] hero-tablet:shadow-[0_10px_22px_rgb(5_5_6/7%)] hero-tablet-landscape:absolute hero-tablet-landscape:right-0 hero-tablet-landscape:bottom-[clamp(34px,5svh,64px)] hero-tablet-landscape:left-auto hero-tablet-landscape:mt-0 hero-tablet-landscape:w-[min(43vw,520px)] hero-tablet-landscape:min-w-[430px] hero-tablet-landscape:max-w-[calc(100vw-48px)] hero-tablet-landscape:rounded-[22px] hero-tablet-landscape:border-[rgb(255_255_255/76%)] hero-tablet-landscape:bg-[rgb(251_250_248/94%)] hero-tablet-landscape:shadow-[0_18px_28px_rgb(8_22_27/12%),0_4px_10px_rgb(5_5_6/6%)] hero-tablet-landscape-short:right-0 hero-tablet-landscape-short:bottom-[18px] hero-tablet-landscape-short:w-[min(42vw,500px)] hero-tablet-landscape-short:min-w-[410px] hero-tablet-landscape-short:rounded-[18px] hero-portrait-wide:relative hero-portrait-wide:right-auto hero-portrait-wide:bottom-auto hero-portrait-wide:left-auto hero-portrait-wide:mt-[clamp(14px,2vw,20px)] hero-portrait-wide:w-full hero-portrait-wide:min-w-0 hero-portrait-wide:overflow-visible hero-portrait-wide:rounded-[16px] hero-portrait-wide:border hero-portrait-wide:border-[#dededb] hero-portrait-wide:bg-[rgb(255_253_249/86%)] hero-portrait-wide:shadow-[0_10px_22px_rgb(5_5_6/7%)] hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:rounded-[16px] hero-mobile:shadow-[0_16px_30px_rgb(5_5_6/9%)] hero-landscape:fixed hero-landscape:right-[var(--landing-gutter-width)] hero-landscape:bottom-[clamp(18px,1.8vw,32px)] hero-landscape:left-auto hero-landscape:z-[40] hero-landscape:w-[min(30vw,500px)] hero-landscape:min-w-[420px] hero-landscape:max-w-[calc(100vw-var(--landing-gutter-width)-var(--landing-gutter-width))] hero-landscape:rounded-none hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-[rgb(248_247_245/82%)] hero-landscape:shadow-none hero-landscape:backdrop-blur-[3px]',
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
          className="relative grid h-[clamp(50px,3.35vw,56px)] w-full grid-cols-[1fr_1.1fr_1.34fr] items-stretch gap-0 rounded-none border-b border-[#dededb] bg-transparent p-0 hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:grid-cols-[1fr_1fr_1.22fr] hero-tablet-landscape-short:h-10 hero-mobile:h-11 hero-mobile:grid-cols-[1fr_1fr_1.24fr] hero-landscape:m-0 hero-landscape:h-[58px] hero-landscape:w-full hero-landscape:grid-cols-[0.95fr_0.95fr_1.36fr] hero-landscape:gap-0 hero-landscape:rounded-none hero-landscape:border-0 hero-landscape:border-b hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-transparent hero-landscape:p-0 hero-landscape:shadow-none"
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

        <div className="isolate min-h-[clamp(106px,7.4vw,124px)] px-[clamp(18px,1.45vw,24px)] py-[clamp(14px,1vw,17px)] [&_h2]:m-0 [&_h2]:mb-[12px] [&_h2]:text-balance [&_h2]:text-[clamp(20px,1.28vw,25px)] [&_h2]:leading-[1.1] [&_h2]:font-extrabold [&_h2]:text-[#071d25] hero-tablet:min-h-0 hero-tablet:px-[clamp(18px,2.6vw,22px)] hero-tablet:pt-[clamp(13px,2vw,17px)] hero-tablet:pb-[clamp(11px,1.8vw,15px)] hero-tablet:[&_h2]:mb-[clamp(10px,1.6vw,12px)] hero-tablet:[&_h2]:text-[clamp(21px,3vw,26px)] hero-tablet-landscape-short:px-[16px] hero-tablet-landscape-short:pt-[10px] hero-tablet-landscape-short:pb-[10px] hero-tablet-landscape-short:[&_h2]:mb-[8px] hero-tablet-landscape-short:[&_h2]:text-[22px] hero-mobile:min-h-0 hero-mobile:px-[clamp(16px,4.6vw,20px)] hero-mobile:pt-[clamp(10px,3vw,13px)] hero-mobile:pb-[clamp(7px,2.2vw,10px)] hero-mobile:[&_h2]:mb-[clamp(8px,2.4vw,10px)] hero-mobile:[&_h2]:text-[clamp(18px,5vw,21px)] hero-landscape:relative hero-landscape:m-0 hero-landscape:min-h-[128px] hero-landscape:border-0 hero-landscape:bg-[linear-gradient(to_right,rgb(8_9_10/4%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(8_9_10/3%)_1px,transparent_1px)] hero-landscape:px-[20px] hero-landscape:pt-[16px] hero-landscape:pb-[18px] hero-landscape:shadow-none hero-landscape:[background-size:72px_72px] hero-landscape:[&_h2]:ml-0 hero-landscape:[&_h2]:mb-[13px] hero-landscape:[&_h2]:font-serif hero-landscape:[&_h2]:text-[24px] hero-landscape:[&_h2]:leading-[1.02] hero-landscape:[&_h2]:tracking-[0] hero-landscape:[&_h2]:text-[oklch(0.182_0.045_166)]">
          <div
            aria-labelledby={`fairlend-${activeTab}-tab`}
            className="m-0"
            id={`fairlend-${activeTab}-panel`}
            role="tabpanel"
          >
            <h2>{activeMeta.heading}</h2>
            <form className="m-0" onSubmit={handleSubmit}>
              <input name="intent" type="hidden" value={activeTab} />
              <span className={visuallyHiddenClassName} id={`fairlend-${activeTab}-description`}>
                {activeMeta.description}
              </span>

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
                    data-fairlend-application-submit
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
                    data-fairlend-application-submit
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
