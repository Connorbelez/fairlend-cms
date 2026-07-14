'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import { ChartNoAxesCombined, House, HousePlus, type LucideIcon } from 'lucide-react'
import { type ReactNode, useLayoutEffect, useRef } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utilities/ui'

export const fairlendApplicationIntents = [
  { icon: HousePlus, label: 'Build', mobileLabel: 'Build', value: 'build' },
  { icon: ChartNoAxesCombined, label: 'Invest', mobileLabel: 'Invest', value: 'invest' },
  { icon: House, label: 'Get a mortgage', mobileLabel: 'Mortgage', value: 'mortgage' },
] as const

export type FairlendApplicationIntent = (typeof fairlendApplicationIntents)[number]['value']

type IntentTab = {
  icon: LucideIcon
  label: string
  mobileLabel: string
  value: FairlendApplicationIntent
}

type FairlendApplicationIntentTabsProps = VariantProps<typeof intentTabsListVariants> & {
  children: ReactNode
  className?: string
  onValueChange: (value: FairlendApplicationIntent) => void
  reduceMotion?: boolean
  tabs?: readonly IntentTab[]
  value: FairlendApplicationIntent
}

const intentTabsListVariants = cva(
  'relative grid w-full items-stretch gap-1 overflow-hidden border-b border-[#deded8] bg-[linear-gradient(180deg,rgb(255_255_255/76%),rgb(248_247_245/72%))] p-[5px] shadow-[inset_0_-1px_0_rgb(8_9_10/4%),inset_0_1px_0_rgb(255_255_255/76%)] hero-tablet:h-[clamp(50px,6.5vw,56px)] hero-tablet-landscape-short:h-[46px] hero-mobile:h-[54px] hero-landscape:m-0 hero-landscape:h-[58px] hero-landscape:gap-0 hero-landscape:rounded-none hero-landscape:border-0 hero-landscape:border-b hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-transparent hero-landscape:p-0 hero-landscape:shadow-none',
  {
    variants: {
      density: {
        balanced: 'h-[clamp(54px,3.65vw,60px)]',
        compact: 'h-[clamp(50px,3.35vw,56px)]',
      },
    },
    defaultVariants: {
      density: 'balanced',
    },
  },
)

const intentTabTriggerVariants = cva(
  'relative z-[1] inline-flex h-full min-w-0 touch-manipulation cursor-pointer select-none items-center justify-center gap-[clamp(7px,0.56vw,10px)] overflow-hidden whitespace-nowrap rounded-[11px] border border-transparent bg-transparent px-2.5 py-0 text-xs leading-none font-semibold tracking-[-0.015em] text-[#494944] shadow-none outline-none transition-[color,transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#08090a] active:translate-y-px data-[state=active]:text-[#08090a] data-[state=active]:[&_svg]:text-[#78c400] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#96ec18] [&_svg]:size-[21px] [&_svg]:shrink-0 [&_svg]:stroke-[1.9] [&_svg]:transition-[color,transform] [&_svg]:duration-200 hover:[&_svg]:-translate-y-px data-[state=active]:hover:[&_svg]:translate-y-0 hero-tablet:gap-[7px] hero-tablet:[&_svg]:size-[19px] hero-tablet-landscape-short:gap-1.5 hero-tablet-landscape-short:[&_svg]:size-[17px] hero-mobile:gap-1.5 hero-mobile:px-1 hero-mobile:[&_svg]:size-[18px] hero-landscape:h-full hero-landscape:gap-[8px] hero-landscape:rounded-none hero-landscape:border-0 hero-landscape:border-r hero-landscape:border-[var(--landing-gutter-line)] hero-landscape:bg-transparent hero-landscape:text-sm hero-landscape:font-extrabold hero-landscape:text-[#101010] hero-landscape:last:border-r-0 hero-landscape:data-[state=active]:z-[3] hero-landscape:data-[state=active]:bg-[rgb(255_255_255/52%)] hero-landscape:data-[state=active]:text-[#101010] hero-landscape:data-[state=active]:shadow-[inset_0_-3px_0_#96ec18] hero-landscape:data-[state=active]:[&_svg]:text-[#101010] hero-landscape:[&_svg]:size-[20px] hero-landscape:[&_svg]:stroke-[2.1]',
)

export function FairlendApplicationIntentTabs({
  children,
  className,
  density,
  onValueChange,
  reduceMotion = false,
  tabs = fairlendApplicationIntents,
  value,
}: FairlendApplicationIntentTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabPillRef = useRef<HTMLSpanElement>(null)
  const hasPositionedTabPillRef = useRef(false)

  useLayoutEffect(() => {
    const tabList = tabListRef.current
    const tabPill = tabPillRef.current
    if (!tabList || !tabPill) return

    const positionPill = (animate: boolean) => {
      const selectedTab = tabList.querySelector<HTMLElement>(`[data-form-tab="${value}"]`)
      if (!selectedTab) return

      const previousTransition = tabPill.style.transition
      if (!animate) tabPill.style.transition = 'none'

      tabPill.style.transform = `translateX(${selectedTab.offsetLeft}px)`
      tabPill.style.width = `${selectedTab.offsetWidth}px`
      tabPill.style.opacity = '1'

      if (!animate) {
        void tabPill.offsetWidth
        tabPill.style.transition = previousTransition
      }
    }

    positionPill(hasPositionedTabPillRef.current && !reduceMotion)
    hasPositionedTabPillRef.current = true

    if (typeof ResizeObserver === 'undefined') return

    const resizeObserver = new ResizeObserver(() => positionPill(false))
    resizeObserver.observe(tabList)

    return () => resizeObserver.disconnect()
  }, [reduceMotion, value])

  return (
    <Tabs
      activationMode="automatic"
      className={cn('gap-0 rounded-[inherit]', className)}
      onValueChange={(nextValue) => onValueChange(nextValue as FairlendApplicationIntent)}
      orientation="horizontal"
      value={value}
    >
      <TabsList
        aria-label="Application type"
        className={cn(
          intentTabsListVariants({ density }),
          tabs.length === 3 &&
            'grid-cols-[1fr_1.1fr_1.34fr] hero-tablet:grid-cols-[1fr_1fr_1.22fr] hero-mobile:grid-cols-3 hero-landscape:grid-cols-[0.95fr_0.95fr_1.36fr]',
        )}
        ref={tabListRef}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[5px] bottom-[5px] left-0 z-0 w-0 rounded-[11px] bg-[#fffdf9] opacity-0 shadow-[0_7px_18px_rgb(8_9_10/8%),inset_0_0_0_1px_rgb(150_236_24/72%),inset_0_1px_0_rgb(255_255_255/94%)] transition-[transform,width,opacity] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full after:bg-[#96ec18] after:content-[\'\'] will-change-transform motion-reduce:transition-none hero-landscape:hidden"
          ref={tabPillRef}
        />
        {tabs.map(({ icon: Icon, label, mobileLabel, value: tabValue }) => (
          <TabsTrigger
            aria-controls={`fairlend-${tabValue}-panel`}
            className={intentTabTriggerVariants()}
            data-form-tab={tabValue}
            id={`fairlend-${tabValue}-tab`}
            key={tabValue}
            value={tabValue}
          >
            <Icon aria-hidden="true" />
            <span className="hero-mobile:hidden">{label}</span>
            <span className="hidden hero-mobile:inline">{mobileLabel}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
