'use client'

import { Check } from 'lucide-react'
import {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
  useEffect,
  useRef,
} from 'react'

import { BriefcaseBusinessIcon } from '@/components/ui/briefcase-business'
import { CircleDollarSignIcon } from '@/components/ui/circle-dollar-sign'
import { ClockIcon } from '@/components/ui/clock'
import { HammerIcon } from '@/components/ui/hammer'
import { HomeIcon } from '@/components/ui/home'
import { MapPinHouseIcon } from '@/components/ui/map-pin-house'
import { RefreshCWIcon } from '@/components/ui/refresh-cw'
import { SelectableChip } from '@/components/ui/selectable-chip'
import { ShieldCheckIcon } from '@/components/ui/shield-check'

type AnimatedIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

type AnimatedIconComponent = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> &
    RefAttributes<AnimatedIconHandle> & {
      size?: number
    }
>

type ChoiceIconKind =
  | 'business'
  | 'clock'
  | 'construction'
  | 'home'
  | 'location'
  | 'money'
  | 'refinance'
  | 'shield'

const choiceIcons: Record<ChoiceIconKind, AnimatedIconComponent> = {
  business: BriefcaseBusinessIcon,
  clock: ClockIcon,
  construction: HammerIcon,
  home: HomeIcon,
  location: MapPinHouseIcon,
  money: CircleDollarSignIcon,
  refinance: RefreshCWIcon,
  shield: ShieldCheckIcon,
}

function resolveChoiceIcon(option: string): ChoiceIconKind {
  const normalizedOption = option.toLowerCase()

  if (
    /immediately|day|week|month|year|timing|renewal due|long-term|short-term/.test(normalizedOption)
  ) {
    return 'clock'
  }

  if (/refinanc|renew|transfer|replace|payout|consolidat/.test(normalizedOption)) {
    return 'refinance'
  }

  if (/renovat|construction|lease-up|build|repair|improve/.test(normalizedOption)) {
    return 'construction'
  }

  if (
    /credit|lien|encumbrance|no additional|no current mortgage|unsecured/.test(normalizedOption)
  ) {
    return 'shield'
  }

  if (
    /investor|corporation|partnership|company|business|experience|professional/.test(
      normalizedOption,
    )
  ) {
    return 'business'
  }

  if (
    /\$|amount|capital|income|value|balance|equity|rate|yield|return|debt|fund/.test(
      normalizedOption,
    )
  ) {
    return 'money'
  }

  if (
    /occup|vacant|tenant|unit|mixed-use|student|rooming|rental|property use/.test(normalizedOption)
  ) {
    return 'location'
  }

  return 'home'
}

function motionIsReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function MortgageChoiceOption({
  layout,
  onSelect,
  option,
  selected,
}: {
  layout: 'cards' | 'chips'
  onSelect: (value: string) => void
  option: string
  selected: boolean
}) {
  const iconRef = useRef<AnimatedIconHandle>(null)
  const Icon = choiceIcons[resolveChoiceIcon(option)]

  function startIconAnimation(): void {
    if (!motionIsReduced()) iconRef.current?.startAnimation()
  }

  function stopIconAnimation(): void {
    iconRef.current?.stopAnimation()
  }

  useEffect(() => {
    if (!selected || motionIsReduced()) return

    iconRef.current?.stopAnimation()
    const animationFrame = window.requestAnimationFrame(() => {
      iconRef.current?.startAnimation()
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [selected])

  if (layout === 'chips') {
    return (
      <SelectableChip
        active={selected}
        onBlur={stopIconAnimation}
        onClick={() => onSelect(option)}
        onFocus={startIconAnimation}
        onMouseEnter={startIconAnimation}
        onMouseLeave={stopIconAnimation}
        variant="mortgage"
      >
        <span className="fl-mortgage-chip-option__icon" aria-hidden="true">
          <Icon ref={iconRef} size={17} />
        </span>
        <span>{option}</span>
      </SelectableChip>
    )
  }

  return (
    <button
      aria-pressed={selected}
      className="fl-mortgage-option"
      data-selected={selected}
      onBlur={stopIconAnimation}
      onClick={() => onSelect(option)}
      onFocus={startIconAnimation}
      onMouseEnter={startIconAnimation}
      onMouseLeave={stopIconAnimation}
      type="button"
    >
      <span className="fl-mortgage-option__radio" aria-hidden="true">
        {selected ? <i /> : null}
      </span>
      <span className="fl-mortgage-option__icon" aria-hidden="true">
        <Icon ref={iconRef} size={20} />
      </span>
      <span className="fl-mortgage-option__label">{option}</span>
      <Check aria-hidden="true" className="fl-mortgage-option__check" />
    </button>
  )
}
