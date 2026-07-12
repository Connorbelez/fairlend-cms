import { BadgeCheck, ClipboardList, Landmark, Search } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import type { CSSProperties } from 'react'

import { cn } from '@/utilities/ui'

import {
  fairlendRouteStepArrowVariants,
  fairlendRouteStepDotVariants,
  fairlendRouteStepLabelVariants,
  fairlendRouteStepLineVariants,
  fairlendRouteStepTrackVariants,
} from './styles'
import type { FairlendRouteComponentProps } from './types'

type FairlendRouteStepStyle = CSSProperties & {
  '--route-step-index'?: number
}

type FairlendRouteStepTrackProps = FairlendRouteComponentProps<HTMLDivElement> &
  VariantProps<typeof fairlendRouteStepTrackVariants> & {
    steps: string[]
    activeIndex?: number
    descriptions?: string[]
    detailed?: boolean
  }

const detailedStepIcons = [ClipboardList, Search, BadgeCheck, Landmark]

export function FairlendRouteStepTrack({
  activeIndex = 0,
  className,
  descriptions,
  detailed = false,
  density,
  steps,
  ...props
}: FairlendRouteStepTrackProps) {
  return (
    <div
      className={cn(fairlendRouteStepTrackVariants({ density }), className)}
      data-fairlend-route-motion="steps"
      {...props}
    >
      <div
        aria-hidden="true"
        className={fairlendRouteStepLineVariants()}
        data-fairlend-route-motion="step-line"
      />
      <ol className="relative z-10 grid grid-cols-4 gap-0">
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const StepIcon = detailedStepIcons[index] ?? ClipboardList

          return (
            <li
              key={`${step}-${index}`}
              className={cn(
                'relative flex flex-col items-center gap-2',
                detailed && 'gap-1.5 px-2 text-center',
              )}
              style={{ '--route-step-index': index } as FairlendRouteStepStyle}
            >
              <span
                aria-hidden="true"
                className={fairlendRouteStepDotVariants({ active: isActive })}
                data-fairlend-route-motion="step-dot"
              />
              {detailed ? (
                <>
                  <StepIcon aria-hidden="true" className="mt-1 size-5" strokeWidth={1.8} />
                  <span className="text-[12px] leading-none font-bold">{step}</span>
                  <span className="max-w-[15ch] text-[9px] leading-[1.2] font-medium text-[color:var(--fl-route-card-copy-ink)]">
                    {descriptions?.[index]}
                  </span>
                </>
              ) : (
                <span
                  className={fairlendRouteStepLabelVariants()}
                  data-fairlend-route-motion="step-label"
                >
                  {step}
                  {index < steps.length - 1 ? (
                    <span aria-hidden="true" className={fairlendRouteStepArrowVariants()}>
                      -&gt;
                    </span>
                  ) : null}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
