'use client'

import { ArrowRight, ChartNoAxesCombined, House, HousePlus, MapPin, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, memo, useCallback, useRef, useState } from 'react'

import { GoogleAddressAutocomplete } from '@/components/address/GoogleAddressAutocomplete'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'

const formTabs = [
  {
    description: 'Tell us where you are building.',
    heading: 'Start your application',
    icon: HousePlus,
    inputMode: 'text',
    label: 'Build',
    name: 'buildAddress',
    placeholder: 'Enter your property address',
    submitLabel: 'Start build application',
    type: 'text',
    value: 'build',
  },
  {
    description: 'Share the opportunity you want reviewed.',
    heading: 'Investor intake',
    icon: ChartNoAxesCombined,
    inputMode: 'text',
    label: 'Invest',
    name: 'investmentFocus',
    placeholder: 'Target neighbourhood or deal type',
    submitLabel: 'Start investor intake',
    type: 'text',
    value: 'invest',
  },
  {
    description: 'Start with the property or your phone number.',
    heading: 'Mortgage request',
    icon: House,
    inputMode: 'text',
    label: 'Get a mortgage',
    name: 'mortgageAddress',
    placeholder: 'Enter property address or phone',
    submitLabel: 'Start mortgage request',
    type: 'text',
    value: 'mortgage',
  },
] as const

type FormTab = (typeof formTabs)[number]['value']

const initialValues = Object.fromEntries(formTabs.map((tab) => [tab.value, ''])) as Record<
  FormTab,
  string
>

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
      className="relative z-[1] inline-flex h-[clamp(50px,3.35vw,56px)] min-w-0 cursor-pointer items-center justify-center gap-[clamp(6px,0.52vw,9px)] whitespace-nowrap rounded-none border-0 bg-transparent px-2.5 py-0 text-[clamp(12px,0.82vw,14px)] font-extrabold text-[var(--tabs-text-muted)] shadow-none transition-colors duration-[var(--tabs-dur)] ease-[var(--tabs-ease)] hover:bg-transparent hover:text-[var(--tabs-text-active)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--tabs-text-active)] data-[state=active]:shadow-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_70%,var(--fairlend-panel))] [&_svg]:size-[21px] hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:gap-[7px] hero-tablet:text-[clamp(12px,1.8vw,14px)] hero-tablet:[&_svg]:size-[18px] hero-mobile:h-11 hero-mobile:gap-1.5 hero-mobile:text-[clamp(11px,3.1vw,12.5px)] hero-mobile:[&_svg]:size-[17px] hero-landscape:h-[58px] hero-landscape:gap-[12px] hero-landscape:bg-transparent hero-landscape:text-[18px] hero-landscape:font-extrabold hero-landscape:shadow-none hero-landscape:[text-shadow:0_1px_0_rgb(255_255_255/62%)] hero-landscape:data-[state=active]:z-[3] hero-landscape:data-[state=active]:rounded-t-[26px] hero-landscape:data-[state=active]:border-transparent hero-landscape:data-[state=active]:bg-[rgb(250_246_241)] hero-landscape:data-[state=active]:shadow-[inset_0_1px_0_rgb(255_255_255/90%)] hero-landscape:[&_svg]:size-[25px] hero-landscape:[&_svg]:stroke-[2.3] hero-landscape:first:data-[state=active]:rounded-tl-[26px] hero-landscape:first:data-[state=active]:rounded-tr-[24px]"
      data-form-tab={value}
      data-state={isActive ? 'active' : 'inactive'}
      id={`fairlend-${value}-tab`}
      onClick={() => onSelect(value)}
      role="tab"
      type="button"
    >
      <Icon
        aria-hidden="true"
        className="size-[23px] hero-tablet:size-[18px] hero-mobile:size-[17px] hero-landscape:size-[28px]"
      />
      <span>{label}</span>
    </button>
  )
})

export function FairlendApplicationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FormTab>('build')
  const [activeValue, setActiveValue] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTab, setSubmittedTab] = useState<FormTab | null>(null)
  const [isAddressAutocompleteOpen, setIsAddressAutocompleteOpen] = useState(false)
  const activeInputRef = useRef<HTMLInputElement>(null)
  const valuesRef = useRef<Record<FormTab, string>>({ ...initialValues })

  const activeConfig = formTabs.find((tab) => tab.value === activeTab) ?? formTabs[0]
  const shouldLiftForAutocomplete = activeTab !== 'invest' && isAddressAutocompleteOpen
  const handleSelectTab = useCallback(
    (value: FormTab) => {
      valuesRef.current[activeTab] = activeValue
      setSubmitError('')
      setSubmittedTab(null)
      setIsAddressAutocompleteOpen(false)
      setActiveValue(valuesRef.current[value])
      setActiveTab(value)
    },
    [activeTab, activeValue],
  )
  const handleAddressAutocompleteOpenChange = useCallback((open: boolean) => {
    setIsAddressAutocompleteOpen(open)
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const capturedValue = activeValue.trim()

    if (!capturedValue) {
      document.getElementById(`fairlend-${activeConfig.value}`)?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    let leadId: string | undefined

    try {
      const response = await fetch('/api/leads', {
        body: JSON.stringify({
          address: activeTab === 'invest' ? undefined : capturedValue,
          intent: activeTab,
          intake: {
            homepageValue: capturedValue,
          },
          source: 'homepage-application-form',
          status: 'started',
        }),
        headers: {
          'content-type': 'application/json',
        },
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
    })

    if (activeTab !== 'invest') {
      params.set('address', capturedValue)
    }

    if (leadId) {
      params.set('leadId', leadId)
    }

    router.push(`/intake?${params.toString()}`)
  }

  return (
    <Card
      className={cn(
        'pointer-events-auto absolute right-[2.35%] bottom-[calc(5.45%+var(--hero-stats-height,0px))] z-[12] w-[min(30.8%,512px)] min-w-[400px] overflow-visible rounded-[22px] border border-[rgb(236_224_215/88%)] bg-[rgb(255_250_245/93%)] shadow-[0_18px_34px_rgb(52_33_18/12%)] transition-[bottom] duration-300 ease-[var(--hero-ease-quint)] [--card-spacing:0px] [--tabs-bar-bg:transparent] [--tabs-dur:250ms] [--tabs-ease:cubic-bezier(0.22,1,0.36,1)] [--tabs-pill-bg:#ffb9a5] [--tabs-text-active:var(--fairlend-orange)] [--tabs-text-muted:#071e29] motion-safe:animate-[heroPanelIn_680ms_var(--hero-ease-out)_360ms_both] hero-max-1120:min-w-[400px] hero-max-1279:right-4 hero-max-1279:bottom-[18px] hero-max-1279:left-4 hero-max-1279:w-auto hero-max-1279:min-w-0 hero-tablet:relative hero-tablet:right-auto hero-tablet:bottom-auto hero-tablet:left-auto hero-tablet:mt-[clamp(12px,2vw,16px)] hero-tablet:w-full hero-tablet:min-w-0 hero-tablet:overflow-visible hero-tablet:rounded-[14px] hero-tablet:border hero-tablet:border-[rgb(238_225_213/88%)] hero-tablet:bg-[rgb(255_253_249/84%)] hero-tablet:shadow-[0_10px_22px_rgb(56_35_20/8%)] hero-mobile:relative hero-mobile:right-auto hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:rounded-lg hero-mobile:border-0 hero-mobile:bg-transparent hero-mobile:shadow-none hero-landscape:right-[2.2%] hero-landscape:bottom-[calc(3.2%+var(--hero-stats-height,0px))] hero-landscape:w-[min(32.8vw,560px)] hero-landscape:min-w-[462px] hero-landscape:max-w-[calc(100vw-48px)] hero-landscape:rounded-[26px] hero-landscape:border-[rgb(255_255_255/74%)] hero-landscape:bg-[rgb(249_243_235)] hero-landscape:shadow-[0_12px_18px_rgb(8_22_27/16%),0_4px_10px_rgb(62_40_23/8%)]',
        shouldLiftForAutocomplete &&
          'bottom-[calc(5.45%+var(--hero-stats-height,0px)+clamp(78px,7vw,124px))] hero-landscape:bottom-[calc(3.2%+var(--hero-stats-height,0px)+clamp(78px,7vw,124px))] hero-tablet:bottom-auto hero-mobile:bottom-auto',
      )}
      data-autocomplete-open={shouldLiftForAutocomplete ? 'true' : 'false'}
      data-testid="fairlend-application-form"
    >
      <div
        className={cn(
          'gap-0 rounded-[inherit] hero-landscape:bg-[rgb(249_243_235)]',
          shouldLiftForAutocomplete ? 'overflow-visible' : 'overflow-hidden',
        )}
      >
        <div
          aria-label="Application type"
          className="relative grid h-[clamp(50px,3.35vw,56px)] w-full grid-cols-[1fr_1.1fr_1.34fr] items-stretch gap-0 rounded-none border-b border-[var(--fairlend-line)] bg-transparent p-0 hero-tablet:h-[clamp(46px,6vw,52px)] hero-tablet:grid-cols-[1fr_1fr_1.22fr] hero-mobile:h-11 hero-mobile:grid-cols-[1fr_1fr_1.24fr] hero-landscape:h-[58px] hero-landscape:grid-cols-[0.96fr_0.96fr_1.4fr] hero-landscape:border-transparent hero-landscape:bg-transparent hero-landscape:before:absolute hero-landscape:before:inset-0 hero-landscape:before:z-0 hero-landscape:before:rounded-t-[26px] hero-landscape:before:bg-[rgb(239_233_225)] hero-landscape:before:shadow-[inset_0_-9px_14px_rgb(86_64_45/5%),inset_0_1px_0_rgb(255_255_255/44%)] hero-landscape:before:content-['']"
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

        <div className="isolate min-h-[clamp(106px,7.4vw,124px)] px-[clamp(18px,1.45vw,24px)] py-[clamp(14px,1vw,17px)] [&_h2]:m-0 [&_h2]:mb-[12px] [&_h2]:text-balance [&_h2]:text-[clamp(20px,1.28vw,25px)] [&_h2]:leading-[1.1] [&_h2]:font-extrabold [&_h2]:text-[#071d25] hero-tablet:min-h-0 hero-tablet:px-[clamp(18px,2.6vw,22px)] hero-tablet:pt-[clamp(13px,2vw,17px)] hero-tablet:pb-[clamp(11px,1.8vw,15px)] hero-tablet:[&_h2]:mb-[clamp(10px,1.6vw,12px)] hero-tablet:[&_h2]:text-[clamp(21px,3vw,26px)] hero-mobile:min-h-0 hero-mobile:px-[clamp(16px,4.6vw,20px)] hero-mobile:pt-[clamp(10px,3vw,13px)] hero-mobile:pb-[clamp(7px,2.2vw,10px)] hero-mobile:[&_h2]:mb-[clamp(8px,2.4vw,10px)] hero-mobile:[&_h2]:text-[clamp(18px,5vw,21px)] hero-landscape:relative hero-landscape:mx-[14px] hero-landscape:mt-[7px] hero-landscape:mb-[9px] hero-landscape:min-h-[132px] hero-landscape:rounded-[18px] hero-landscape:border hero-landscape:border-[rgb(221_207_195/74%)] hero-landscape:bg-[rgb(250_246_241)] hero-landscape:bg-clip-padding hero-landscape:px-[20px] hero-landscape:pt-[17px] hero-landscape:pb-[15px] hero-landscape:shadow-[inset_0_1px_0_rgb(255_255_255/88%)] hero-landscape:[&_h2]:ml-[3px] hero-landscape:[&_h2]:mb-[14px] hero-landscape:[&_h2]:text-[28px] hero-landscape:[&_h2]:leading-[1.02] hero-landscape:[&_h2]:tracking-[0]">
          <div
            aria-labelledby={`fairlend-${activeConfig.value}-tab`}
            className="m-0"
            id={`fairlend-${activeConfig.value}-panel`}
            role="tabpanel"
          >
            <h2>{activeConfig.heading}</h2>
            <form className="m-0" onSubmit={handleSubmit}>
              <input name="intent" type="hidden" value={activeConfig.value} />
              <label
                className="absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
                htmlFor={`fairlend-${activeConfig.value}`}
              >
                {activeConfig.placeholder}
              </label>
              <span
                className="absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
                id={`fairlend-${activeConfig.value}-description`}
              >
                {activeConfig.description}
              </span>
              <div className="grid h-[clamp(52px,3.45vw,58px)] grid-cols-[22px_minmax(0,1fr)_44px] items-center gap-[10px] rounded-[12px] border border-[var(--fairlend-line)] bg-[rgb(255_253_249/90%)] py-0 pr-[clamp(7px,0.5vw,8px)] pl-[clamp(15px,1.15vw,19px)] transition-[border-color,box-shadow] duration-[220ms] ease-[var(--hero-ease-quint)] focus-within:border-[color-mix(in_oklch,var(--fairlend-orange)_42%,var(--fairlend-line))] focus-within:shadow-[0_0_0_3px_rgb(255_58_25/9%),0_10px_22px_rgb(56_35_20/6%)] [&>svg]:size-[20px] [&>svg]:text-[#405361] hero-tablet:h-[clamp(50px,6.8vw,58px)] hero-tablet:grid-cols-[22px_minmax(0,1fr)_44px] hero-tablet:pl-4 hero-mobile:h-[clamp(48px,13vw,52px)] hero-mobile:grid-cols-[20px_minmax(0,1fr)_44px] hero-mobile:pl-3.5 hero-landscape:ml-[-2px] hero-landscape:mr-[4px] hero-landscape:h-[58px] hero-landscape:grid-cols-[24px_minmax(0,1fr)_50px] hero-landscape:gap-[12px] hero-landscape:rounded-full hero-landscape:border-[rgb(209_199_190/70%)] hero-landscape:bg-[rgb(255_255_251/92%)] hero-landscape:pr-[4px] hero-landscape:pl-[18px] hero-landscape:shadow-[inset_0_1px_0_rgb(255_255_255/90%),0_1px_2px_rgb(18_28_31/3%)] hero-landscape:[&>svg]:size-[24px] hero-landscape:[&>svg]:text-[#111c20] hero-landscape:[&>svg]:stroke-[2.1]">
                {activeTab === 'mortgage' ? (
                  <Phone aria-hidden="true" />
                ) : (
                  <MapPin aria-hidden="true" />
                )}
                {activeTab === 'invest' ? (
                  <Input
                    aria-describedby={`fairlend-${activeConfig.value}-description fairlend-${activeConfig.value}-status`}
                    autoComplete="organization"
                    className="h-[clamp(48px,3.25vw,54px)] border-0 bg-transparent p-0 text-[15px] text-[#67727a] shadow-none placeholder:text-[#7f8081] focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none hero-tablet:h-11 hero-tablet:text-[clamp(13px,1.85vw,15px)] hero-mobile:h-11 hero-mobile:text-[clamp(12px,3.4vw,14px)] hero-landscape:h-[56px] hero-landscape:text-[20px] hero-landscape:font-medium hero-landscape:placeholder:text-[#8d8d8d]"
                    id={`fairlend-${activeConfig.value}`}
                    inputMode={activeConfig.inputMode}
                    name={activeConfig.name}
                    onChange={(event) => {
                      setSubmittedTab(null)
                      setSubmitError('')
                      setActiveValue(event.target.value)
                      valuesRef.current[activeTab] = event.target.value
                    }}
                    placeholder={activeConfig.placeholder}
                    ref={activeInputRef}
                    required
                    type={activeConfig.type}
                    value={activeValue}
                  />
                ) : (
                  <GoogleAddressAutocomplete
                    ariaDescribedBy={`fairlend-${activeConfig.value}-description fairlend-${activeConfig.value}-status`}
                    className="contents"
                    id={`fairlend-${activeConfig.value}`}
                    inputClassName="h-[clamp(48px,3.25vw,54px)] border-0 bg-transparent p-0 text-[15px] text-[#67727a] shadow-none placeholder:text-[#7f8081] focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none hero-tablet:h-11 hero-tablet:text-[clamp(13px,1.85vw,15px)] hero-mobile:h-11 hero-mobile:text-[clamp(12px,3.4vw,14px)] hero-landscape:h-[56px] hero-landscape:text-[20px] hero-landscape:font-medium hero-landscape:placeholder:text-[#8d8d8d]"
                    inputMode={activeConfig.inputMode}
                    name={activeConfig.name}
                    onChange={(nextValue) => {
                      setSubmittedTab(null)
                      setSubmitError('')
                      setActiveValue(nextValue)
                      valuesRef.current[activeTab] = nextValue
                    }}
                    onOpenChange={handleAddressAutocompleteOpenChange}
                    placeholder={activeConfig.placeholder}
                    required
                    type={activeConfig.type}
                    value={activeValue}
                  />
                )}
                <Button
                  aria-label={activeConfig.submitLabel}
                  className="relative isolate size-11 overflow-visible rounded-full bg-[oklch(62%_0.25_31)] text-[var(--fairlend-panel)] shadow-[0_0_0_3px_oklch(99%_0.012_76/0.96),0_10px_20px_oklch(57%_0.25_30/0.24),0_0_18px_oklch(72%_0.2_36/0.18)] transition-[background-color,box-shadow,transform,filter] duration-[260ms] ease-[var(--hero-ease-quint)] before:absolute before:inset-[-9px] before:z-[-1] before:rounded-full before:bg-[radial-gradient(circle,oklch(73%_0.2_35/0.4)_0%,oklch(72%_0.2_35/0.18)_42%,transparent_72%)] before:opacity-80 before:blur-[2px] before:content-[''] hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[oklch(59%_0.25_29)] hover:shadow-[0_0_0_3px_oklch(99%_0.012_76/0.98),0_0_0_8px_oklch(75%_0.2_37/0.13),0_18px_30px_oklch(56%_0.25_30/0.32),0_0_28px_oklch(72%_0.21_36/0.24)] active:translate-y-0 active:scale-[0.97] motion-safe:before:animate-[applicationCtaHalo_2200ms_var(--hero-ease-out)_infinite] [&_svg]:size-6 hero-tablet:size-11 hero-mobile:size-11 hero-mobile:before:inset-[-7px] hero-landscape:size-[56px] hero-landscape:text-white hero-landscape:shadow-[0_0_0_4px_oklch(99%_0.012_76/0.96),0_12px_24px_oklch(57%_0.25_30/0.28),0_0_24px_oklch(71%_0.21_36/0.2)] hero-landscape:before:inset-[-12px] hero-landscape:hover:shadow-[0_0_0_4px_oklch(99%_0.012_76/0.98),0_0_0_10px_oklch(75%_0.2_37/0.13),0_18px_34px_oklch(56%_0.25_30/0.34),0_0_32px_oklch(72%_0.21_36/0.24)] hero-landscape:[&_svg]:size-[34px] hero-landscape:[&_svg]:stroke-[1.8]"
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
              <p
                aria-live="polite"
                className="mt-2 min-h-[17px] text-[11px] leading-[1.3] font-bold text-[#6f7980] hero-tablet:hidden hero-mobile:hidden hero-landscape:hidden"
                id={`fairlend-${activeConfig.value}-status`}
              >
                {submittedTab === activeTab
                  ? 'Opening your intake.'
                  : submitError
                    ? submitError
                    : isSubmitting
                      ? 'Saving your address...'
                      : ''}
              </p>
            </form>
          </div>
        </div>
      </div>
    </Card>
  )
}
