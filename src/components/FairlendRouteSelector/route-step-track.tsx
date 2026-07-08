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
  }

export function FairlendRouteStepTrack({
  activeIndex = 0,
  className,
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

          return (
            <li
              key={`${step}-${index}`}
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
                {index < steps.length - 1 ? (
                  <span aria-hidden="true" className={fairlendRouteStepArrowVariants()}>
                    -&gt;
                  </span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
