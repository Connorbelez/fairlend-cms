import { cn } from '@/utilities/ui'

import { fairlendRouteSelectorAssets } from './assets'
import { FairlendRouteSelectorArrow } from './FairlendRouteSelectorArrow.client'
import { FairlendRouteSelectorMotion } from './FairlendRouteSelectorMotion.client'
import { FairlendRouteCard } from './route-card'
import {
  fairlendRouteChoices,
  fairlendRouteHelpBanner,
  fairlendRouteSelectorCopy,
} from './route-data'
import { FairlendRouteHelpBanner } from './route-help-banner'
import type {
  FairlendRouteChoice,
  FairlendRouteComponentProps,
  FairlendRouteHelpBannerContent,
  FairlendRouteSelectorCopy,
} from './types'
import {
  fairlendRouteHeaderTextVariants,
  fairlendRouteOriginDotVariants,
  fairlendRouteSelectorLayerVariants,
  fairlendRouteSelectorTokenStyles,
  fairlendRouteSelectorVariants,
  type FairlendRouteSelectorStyle,
} from './styles'

type FairlendRouteMotionStyle = FairlendRouteSelectorStyle & {
  '--route-motion-index'?: number
}

type FairlendRouteSelectorProps = Omit<FairlendRouteComponentProps<HTMLElement>, 'title'> &
  Partial<FairlendRouteSelectorCopy> & {
    backgroundImage?: string
    helpBanner?: FairlendRouteHelpBannerContent | null
    routes?: FairlendRouteChoice[]
    selectedRouteId?: string
  }

export function FairlendRouteSelector({
  backgroundImage = fairlendRouteSelectorAssets.background,
  className,
  description = fairlendRouteSelectorCopy.description,
  helpBanner = fairlendRouteHelpBanner,
  kicker = fairlendRouteSelectorCopy.kicker,
  routes = fairlendRouteChoices,
  selectedRouteId = 'private-mortgage',
  style,
  title = fairlendRouteSelectorCopy.title,
  ...props
}: FairlendRouteSelectorProps) {
  return (
    <section
      className={cn(
        fairlendRouteSelectorVariants(),
        'py-[66px] lg:py-[66px] lg:pb-[70px]',
        className,
      )}
      data-fairlend-route-selector
      style={
        {
          ...fairlendRouteSelectorTokenStyles,
          '--route-selector-bg': `url(${backgroundImage})`,
          ...style,
        } as FairlendRouteSelectorStyle
      }
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          fairlendRouteSelectorLayerVariants({ layer: 'map' }),
          'opacity-[0.825] contrast-[1.022]',
        )}
        data-fairlend-route-motion="map"
      />
      <div
        aria-hidden="true"
        className={fairlendRouteSelectorLayerVariants({ layer: 'paper' })}
        data-fairlend-route-motion="paper"
      />

      <FairlendRouteSelectorArrow />
      <FairlendRouteSelectorMotion />

      <div className="relative z-10 mx-auto max-w-[1168px]">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.58fr)] lg:gap-[clamp(28px,4vw,58px)]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left [&_*]:text-center lg:[&_*]:text-left">
            <span
              className={fairlendRouteOriginDotVariants()}
              data-fairlend-route-arrow-origin
              data-fairlend-route-motion="origin"
            />
            <p
              className={fairlendRouteHeaderTextVariants({ role: 'kicker' })}
              data-fairlend-route-motion="kicker"
            >
              {kicker}
            </p>
            <h2
              className={cn(fairlendRouteHeaderTextVariants({ role: 'title' }), 'max-w-[680px]')}
              data-fairlend-route-motion="title"
            >
              {title}
            </h2>
          </div>
          <div
            className="mx-auto border-y border-[rgb(17_17_15_/_14%)] py-[18px] text-center text-[color:var(--fl-route-body-ink)] lg:mx-0 lg:text-left"
            data-fairlend-route-motion="description"
          >
            <strong className="mb-[7px] block text-[12px] leading-none font-black tracking-[0.18em] text-[color:var(--fl-route-kicker-ink)] uppercase">
              Route first
            </strong>
            <span className="mx-auto block max-w-[34ch] text-[14px] leading-[1.36] font-semibold text-[color:var(--fl-route-body-ink)] lg:mx-0">
              {description}
            </span>
          </div>
        </div>

        <div
          className="mt-[34px] grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
          data-fairlend-route-motion="grid"
        >
          {routes.map((route, index) => (
            <FairlendRouteCard
              className="min-h-[528px]"
              key={route.id}
              route={route}
              selected={route.id === selectedRouteId}
              style={{ '--route-motion-index': index } as FairlendRouteMotionStyle}
            />
          ))}
        </div>

        {helpBanner ? (
          <FairlendRouteHelpBanner
            className="mt-5"
            content={helpBanner}
            data-fairlend-route-motion="helper"
          />
        ) : null}
      </div>
    </section>
  )
}

export { fairlendRouteSelectorAssets } from './assets'
export { FairlendRouteCard } from './route-card'
export { fairlendRouteIconBadgeVariants } from './route-icon-badge'
export { FairlendRouteIconBadge } from './route-icon-badge'
export {
  fairlendRouteArrowBoxVariants,
  fairlendRouteBadgeVariants,
  fairlendRouteBenefitIconVariants,
  fairlendRouteCardButtonVariants,
  fairlendRouteCardFooterVariants,
  fairlendRouteCardTextVariants,
  fairlendRouteCardVariants,
  fairlendRouteHeaderTextVariants,
  fairlendRouteHelpBannerVariants,
  fairlendRouteHelpButtonVariants,
  fairlendRouteHelpDividerVariants,
  fairlendRouteHelpTextVariants,
  fairlendRouteIconBadgeSurfaceVariants,
  fairlendRouteOriginDotVariants,
  fairlendRouteSelectorLayerVariants,
  fairlendRouteSelectorTokenStyles,
  fairlendRouteSelectorTokens,
  fairlendRouteSelectorVariants,
  fairlendRouteStepArrowVariants,
  fairlendRouteStepDotVariants,
  fairlendRouteStepLabelVariants,
  fairlendRouteStepLineVariants,
  fairlendRouteStepTrackVariants,
} from './styles'
export {
  fairlendRouteChoices,
  fairlendRouteHelpBanner,
  fairlendRouteSelectorCopy,
} from './route-data'
export { FairlendRouteHelpBanner } from './route-help-banner'
export { FairlendRouteStepTrack } from './route-step-track'
export type { FairlendRouteSelectorStyle } from './styles'
export type {
  FairlendRouteChoice,
  FairlendRouteHelpBannerContent,
  FairlendRouteIcon,
  FairlendRouteImage,
  FairlendRouteSelectorCopy,
} from './types'
