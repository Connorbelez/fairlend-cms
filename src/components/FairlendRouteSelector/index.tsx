import { GardenSuiteOpportunityBadge } from '@/components/GardenSuiteOpportunityBadge'
import { cn } from '@/utilities/ui'

import { fairlendRouteSelectorAssets } from './assets'
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

const fairlendRouteDesktopPlacement: Record<string, string> = {
  'construction-financing': 'xl:col-start-1 xl:row-span-3 xl:row-start-1',
  'residential-mortgages': 'xl:col-start-2 xl:row-start-1',
  'garden-laneway-suites': 'xl:col-start-2 xl:row-span-3 xl:row-start-3',
  invest: 'xl:col-start-1 xl:row-span-3 xl:row-start-5 xl:min-h-0',
  'partner-program': 'xl:col-start-2 xl:row-start-7 xl:min-h-0',
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

  return (
    <section
      className={cn(
        fairlendRouteSelectorVariants(),
        'py-10 lg:py-10 xl:min-h-[720px] xl:overflow-visible xl:px-[clamp(18px,2vw,34px)] xl:py-8',
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
      />
      <div aria-hidden="true" className={fairlendRouteSelectorLayerVariants({ layer: 'paper' })} />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-none flex-col">
        <div className="grid shrink-0 items-end gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.58fr)] lg:gap-[clamp(28px,4vw,56px)] xl:grid-cols-[minmax(0,1.58fr)_minmax(300px,0.42fr)]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left [&_*]:text-center lg:[&_*]:text-left">
            <span className={fairlendRouteOriginDotVariants()} />
            <p className={fairlendRouteHeaderTextVariants({ role: 'kicker' })}>{kicker}</p>
            <h2
              className={cn(
                fairlendRouteHeaderTextVariants({ role: 'title' }),
                'max-w-[680px] xl:mt-2 xl:max-w-none',
              )}
            >
              {title}
            </h2>
          </div>
          <div className="mx-auto border-y border-[rgb(17_17_15_/_14%)] py-[18px] text-center text-[color:var(--fl-route-body-ink)] lg:mx-0 lg:text-left xl:py-3">
            <strong className="mb-2 block text-[12px] leading-none font-extrabold tracking-[0.28em] text-[color:var(--fl-route-kicker-ink)] uppercase">
              Route first
            </strong>
            <span className="mx-auto block max-w-[34ch] text-[16px] leading-[1.45] font-medium text-[color:var(--fl-route-body-ink)] lg:mx-0">
              {description}
            </span>
          </div>
        </div>

        <div className="mt-6 grid w-full items-stretch gap-4 xl:mt-5 xl:grid-cols-[minmax(400px,0.92fr)_minmax(0,1.48fr)] xl:grid-rows-[auto_16px_283px_16px_143px_16px_155px] xl:gap-x-4 xl:gap-y-0 xl:overflow-visible">
          {routes.map((route) => (
            <FairlendRouteCard
              className={cn(
                fairlendRouteDesktopPlacement[route.id],
                route.id === featuredRoute?.id &&
                  !fairlendRouteDesktopPlacement[route.id] &&
                  'xl:row-span-2',
                route.span === 'wide' && 'xl:col-span-2',
              )}
              key={route.id}
              layout={
                route.id === featuredRoute?.id
                  ? 'featured'
                  : route.density === 'compact'
                    ? 'compact'
                    : 'supporting'
              }
              route={route}
              selected={route.id === selectedRouteId}
            />
          ))}

          <GardenSuiteOpportunityBadge
            className="pointer-events-none z-30 hidden w-[29%] xl:col-start-2 xl:row-start-3 xl:-mt-[28px] xl:-mr-12 xl:inline-flex xl:rotate-[0.8deg] xl:self-start xl:justify-self-end"
            context="route"
          />
        </div>

        {helpBanner ? <FairlendRouteHelpBanner className="mt-5" content={helpBanner} /> : null}
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
  FairlendRouteHighlight,
  FairlendRouteIcon,
  FairlendRouteImage,
  FairlendRouteService,
  FairlendRouteSelectorCopy,
} from './types'
