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
  selectedRouteId = 'construction-financing',
  style,
  title = fairlendRouteSelectorCopy.title,
  ...props
}: FairlendRouteSelectorProps) {
  const featuredRoute = routes.find((route) => route.id === 'construction-financing') ?? routes[0]
  const supportingRoutes = routes.filter((route) => route.id !== featuredRoute?.id)

  return (
    <section
      className={cn(
        fairlendRouteSelectorVariants(),
        'py-10 lg:py-10 xl:h-[100svh] xl:min-h-[720px] xl:max-h-[980px] xl:px-[clamp(18px,2vw,34px)] xl:py-5',
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

      <div className="relative z-10 mx-auto flex h-full w-full max-w-none flex-col">
        <div className="grid shrink-0 items-end gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.58fr)] lg:gap-[clamp(28px,4vw,58px)] xl:grid-cols-[minmax(0,1.42fr)_minmax(320px,0.58fr)]">
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
              className={cn(
                fairlendRouteHeaderTextVariants({ role: 'title' }),
                'max-w-[680px] xl:mt-2 xl:max-w-[1050px] xl:text-[52px] xl:leading-[0.9]',
              )}
              data-fairlend-route-motion="title"
            >
              {title}
            </h2>
          </div>
          <div
            className="mx-auto border-y border-[rgb(17_17_15_/_14%)] py-[18px] text-center text-[color:var(--fl-route-body-ink)] lg:mx-0 lg:text-left xl:py-3"
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
          className="mt-6 grid w-full gap-3 xl:mt-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(440px,0.92fr)_minmax(0,1.48fr)]"
          data-fairlend-route-motion="grid"
        >
          {featuredRoute ? (
            <FairlendRouteCard
              key={featuredRoute.id}
              layout="featured"
              route={featuredRoute}
              selected={featuredRoute.id === selectedRouteId}
              style={{ '--route-motion-index': 0 } as FairlendRouteMotionStyle}
            />
          ) : null}

          <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-rows-2">
            {supportingRoutes.map((route, index) => (
              <FairlendRouteCard
                key={route.id}
                layout="supporting"
                route={route}
                selected={route.id === selectedRouteId}
                style={{ '--route-motion-index': index + 1 } as FairlendRouteMotionStyle}
              />
            ))}
          </div>
        </div>

        {helpBanner ? (
          <FairlendRouteHelpBanner
            className="mt-5 xl:hidden"
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
