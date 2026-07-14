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
  const compactTrackStyle: CSSProperties = {
    gridTemplateColumns: steps
      .map((_, index) =>
        index < steps.length - 1 ? 'minmax(max-content, 1fr) auto' : 'minmax(max-content, 1fr)',
      )
      .join(' '),
  }

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
      <ol
        className={cn('relative z-10 grid gap-0', detailed && 'grid-cols-4')}
        style={detailed ? undefined : compactTrackStyle}
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const StepIcon = detailedStepIcons[index] ?? ClipboardList

          return (
            <li
              key={`${step}-${index}`}
              className={cn(
                detailed
                  ? 'relative flex flex-col items-center gap-1.5 px-2 text-center'
                  : 'contents',
              )}
              style={
                detailed ? ({ '--route-step-index': index } as FairlendRouteStepStyle) : undefined
              }
            >
              {detailed ? (
                <>
                  <span
                    aria-hidden="true"
                    className={fairlendRouteStepDotVariants({ active: isActive })}
                    data-fairlend-route-motion="step-dot"
                  />
                  <StepIcon aria-hidden="true" className="mt-1 size-5" strokeWidth={1.8} />
                  <span className="text-[12px] leading-none font-bold">{step}</span>
                  <span className="max-w-[15ch] text-[12px] leading-[1.25] font-medium text-[color:var(--fl-route-card-copy-ink)]">
                    {descriptions?.[index]}
                  </span>
                </>
              ) : (
                <span
                  className="relative flex flex-col items-center gap-2"
                  style={{ '--route-step-index': index } as FairlendRouteStepStyle}
                >
                  <span
                    aria-hidden="true"
                    className={fairlendRouteStepDotVariants({ active: isActive })}
                    data-fairlend-route-motion="step-dot"
                  />
                  <span
                    className={fairlendRouteStepLabelVariants()}
                    data-fairlend-route-motion="step-label"
                  >
                    {step}
                  </span>
                </span>
              )}
              {!detailed && index < steps.length - 1 ? (
                <span aria-hidden="true" className={fairlendRouteStepArrowVariants()}>
                  -&gt;
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
