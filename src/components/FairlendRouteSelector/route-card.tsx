import { ArrowUpRight, Check } from 'lucide-react'
import Image from 'next/image'
import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GardenSuiteOpportunityBadge } from '@/components/GardenSuiteOpportunityBadge'
import { cn } from '@/utilities/ui'

import { FairlendRouteIconBadge } from './route-icon-badge'
import { FairlendRouteStepTrack } from './route-step-track'
import {
  fairlendRouteArrowBoxVariants,
  fairlendRouteBadgeVariants,
  fairlendRouteBenefitIconVariants,
  fairlendRouteCardButtonVariants,
  fairlendRouteCardFooterVariants,
  fairlendRouteCardTextVariants,
  fairlendRouteCardVariants,
} from './styles'
import type { FairlendRouteChoice, FairlendRouteComponentProps } from './types'

type FairlendRouteCardProps = FairlendRouteComponentProps<HTMLElement> &
  VariantProps<typeof fairlendRouteCardVariants> & {
    route: FairlendRouteChoice
  }

export function FairlendRouteCard({
  className,
  layout = 'default',
  route,
  selected,
  ...props
}: FairlendRouteCardProps) {
  const isSelected = Boolean(selected)
  const isFeatured = layout === 'featured'
  const isCompact = layout === 'compact'
  const isSupporting = layout === 'supporting' || isCompact
  const hasServices = Boolean(route.services?.length)
  const hasHighlights = Boolean(route.highlights?.length)
  const isInvestRoute = route.id === 'invest'
  const titleId = `fairlend-route-${route.id}-title`
  const badgeLabel = isSelected ? 'Start here' : route.badge

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        fairlendRouteCardVariants({ layout, selected: isSelected }),
        hasHighlights && 'xl:p-3',
        isInvestRoute && 'xl:p-[14px]',
        isCompact && 'xl:gap-x-5 xl:p-3',
        className,
      )}
      {...props}
    >
      {badgeLabel ? (
        <Badge
          className={cn(fairlendRouteBadgeVariants(), hasHighlights && 'xl:right-[calc(29%+28px)]')}
        >
          {badgeLabel}
        </Badge>
      ) : null}

      <div
        className={cn(
          'grid grid-cols-[44px_minmax(0,1fr)] gap-4 max-md:grid-cols-[40px_minmax(0,1fr)] max-md:items-center max-md:gap-3',
          badgeLabel && (hasHighlights ? 'pr-32' : 'pr-16'),
          hasServices && 'md:pr-[260px]',
          isCompact && 'xl:col-start-1 xl:row-start-1',
        )}
      >
        <FairlendRouteIconBadge className="max-md:size-10" icon={route.icon} />
        <h3
          className={cn(
            fairlendRouteCardTextVariants({ role: 'title' }),
            isFeatured && 'max-w-[12ch] text-[clamp(2.375rem,3vw,2.625rem)] leading-[0.9]',
            isSupporting && 'max-w-none',
          )}
          id={titleId}
        >
          {route.title}
        </h3>
      </div>

      <p
        className={cn(
          fairlendRouteCardTextVariants({ role: 'description' }),
          isFeatured && 'max-w-none text-[20px] leading-[1.3]',
          isSupporting && 'mt-3 min-h-0 max-w-[70%]',
          hasServices && 'max-w-[72ch] md:max-w-[58%]',
          hasHighlights && 'max-w-full sm:max-w-[68%] xl:mt-1 xl:max-w-[68%]',
          isInvestRoute && 'xl:mt-2 xl:text-[14px] xl:leading-[1.3]',
          isCompact &&
            'xl:col-start-1 xl:row-start-2 xl:mt-2 xl:max-w-full xl:self-start xl:text-[14px] xl:leading-[1.3]',
        )}
      >
        {route.description}
      </p>

      {hasServices ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-4 hidden h-[104px] w-[245px] items-start justify-end md:flex"
        >
          <Image
            alt=""
            className="h-auto max-h-[104px] w-full object-contain object-right-top"
            height={route.illustration.height}
            sizes="245px"
            src={route.illustration.src}
            width={route.illustration.width}
          />
        </div>
      ) : null}

      {isSupporting ? (
        <>
          {hasServices ? (
            <div className="mt-4 flex flex-1 flex-col md:mt-12">
              <ul className="mb-4 grid gap-2 sm:grid-cols-3">
                {route.bullets.map((bullet) => (
                  <li
                    className={cn(
                      fairlendRouteCardTextVariants({ role: 'bullet' }),
                      'gap-1.5 leading-[1.18]',
                    )}
                    key={bullet}
                  >
                    <span className={fairlendRouteBenefitIconVariants()}>
                      <Check aria-hidden="true" className="size-[8px]" strokeWidth={3} />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-2.5 text-[12px] leading-none font-extrabold tracking-[0.28em] text-[color:var(--fl-route-kicker-ink)] uppercase">
                Three ways to borrow
              </p>
              <div className="grid overflow-hidden border-y border-[color:var(--fl-route-rule)] divide-y divide-[color:var(--fl-route-rule)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {route.services?.map((service) => (
                  <a
                    className="group/service flex min-h-[128px] flex-col justify-between p-3.5 transition-[background-color,color] duration-200 ease-[var(--route-motion-ease)] hover:bg-[color:var(--fl-route-lime-soft)] focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[color:var(--fl-route-lime)] focus-visible:outline-none"
                    href={service.href}
                    key={service.title}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <strong className="font-serif text-[27px] leading-[0.94] font-semibold text-[color:var(--fl-route-ink)]">
                        {service.title}
                      </strong>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform group-hover/service:translate-x-0.5 group-hover/service:-translate-y-0.5"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="mt-3 text-[14px] leading-[1.4] font-medium text-[color:var(--fl-route-card-copy-ink)]">
                      {service.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'relative mt-3 min-h-[104px] flex-1',
                hasHighlights && 'sm:min-h-[210px] xl:mt-1 xl:min-h-[178px]',
                isInvestRoute && 'xl:mt-2 xl:min-h-[86px] xl:flex-none',
                isCompact &&
                  'xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:mt-0 xl:min-h-0 xl:self-center',
              )}
            >
              <ul
                className={cn(
                  'relative z-10 w-[64%] space-y-1.5',
                  hasHighlights && 'w-full sm:w-[68%]',
                  isInvestRoute && 'xl:space-y-1',
                  isCompact && 'xl:w-full',
                )}
              >
                {route.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={cn(
                      fairlendRouteCardTextVariants({ role: 'bullet' }),
                      'gap-1.5',
                      isInvestRoute && 'xl:leading-[1.25]',
                    )}
                  >
                    <span className={fairlendRouteBenefitIconVariants()}>
                      <Check aria-hidden="true" className="size-[8px]" strokeWidth={3} />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {route.callout === 'garden-suite-rental-income' ? (
                <GardenSuiteOpportunityBadge
                  className="relative z-10 mt-5 sm:w-[72%] xl:hidden"
                  context="route"
                />
              ) : null}

              {hasHighlights ? (
                <dl className="relative z-10 mt-5 grid w-full border-y border-[color:var(--fl-route-rule)] sm:w-[72%] sm:grid-cols-3 sm:divide-x sm:divide-[color:var(--fl-route-rule)] xl:mt-3">
                  {route.highlights?.map((highlight) => (
                    <div
                      className="px-3 py-3.5 first:pl-0 last:pr-0 xl:py-2.5"
                      key={highlight.label}
                    >
                      <dt className="text-[10px] leading-[1.15] font-extrabold tracking-[0.08em] text-[color:var(--fl-route-card-copy-ink)] uppercase xl:text-[9px]">
                        {highlight.label}
                      </dt>
                      <dd className="mt-1.5 font-serif text-[27px] leading-[0.94] font-semibold text-[color:var(--fl-route-ink)] xl:text-[24px]">
                        {highlight.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div
                className={cn(
                  'absolute right-[-10px] bottom-0 flex h-[104px] w-[42%] items-end justify-end',
                  hasHighlights && 'hidden h-[190px] w-[30%] sm:flex md:h-[230px] md:w-[29%]',
                  isInvestRoute && 'xl:h-[86px]',
                  isCompact && 'xl:hidden',
                )}
              >
                <Image
                  alt={route.illustration.alt}
                  className={cn(
                    'h-auto max-h-[104px] w-full object-contain object-right-bottom',
                    hasHighlights && 'max-h-[190px] md:max-h-[230px]',
                    isInvestRoute && 'xl:max-h-[86px]',
                  )}
                  height={route.illustration.height}
                  sizes="(min-width: 1280px) 260px, 45vw"
                  src={route.illustration.src}
                  width={route.illustration.width}
                />
              </div>

              {route.disclaimer ? (
                <p className="relative z-10 mt-3 max-w-full text-[12px] leading-[1.45] font-medium text-[color:var(--fl-route-card-copy-ink)] opacity-80 sm:max-w-[72%] xl:mt-2 xl:text-[11px] xl:leading-[1.35]">
                  {route.disclaimer}
                </p>
              ) : null}
            </div>
          )}

          <FairlendRouteStepTrack
            className={cn(
              'mt-2 shrink-0',
              hasServices && 'mt-4',
              hasHighlights && 'xl:mt-1',
              isInvestRoute && 'xl:mt-1',
              isCompact && 'xl:col-start-3 xl:row-start-1 xl:mt-0 xl:self-start',
            )}
            density="compact"
            steps={route.steps}
          />

          <div
            className={cn(
              fairlendRouteCardFooterVariants(),
              'mt-2 pt-2',
              hasHighlights && 'xl:mt-1 xl:pt-0',
              isInvestRoute && 'xl:mt-1 xl:pt-1',
              isCompact &&
                'xl:col-start-3 xl:row-start-2 xl:mt-0 xl:self-end xl:border-t-0 xl:pt-0',
            )}
          >
            <Button
              asChild
              className={fairlendRouteCardButtonVariants({ selected: isSelected })}
              size="clear"
              variant="default"
            >
              <a href={route.href}>
                <span>{route.ctaLabel}</span>
                <span className={fairlendRouteArrowBoxVariants({ size: 'card' })}>
                  <ArrowUpRight aria-hidden="true" className="size-[19px]" strokeWidth={2.8} />
                </span>
              </a>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              isFeatured
                ? 'relative mt-6 min-h-0 flex-1 overflow-hidden'
                : 'mt-4 flex flex-1 flex-col',
            )}
          >
            <ul
              className={cn(
                'relative z-10 space-y-2.5 max-md:space-y-2.5',
                isFeatured && 'w-full space-y-3',
              )}
            >
              {route.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className={cn(
                    fairlendRouteCardTextVariants({ role: 'bullet' }),
                    isFeatured && 'gap-3 text-[16px] leading-[1.35]',
                  )}
                >
                  <span
                    className={cn(fairlendRouteBenefitIconVariants(), isFeatured && 'size-[18px]')}
                  >
                    <Check aria-hidden="true" className="size-[10px]" strokeWidth={3} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div
              className={cn(
                'flex items-end overflow-visible max-md:mt-2 max-md:h-[58px]',
                isFeatured
                  ? 'absolute right-[-20px] bottom-0 h-[min(34vh,330px)] w-[58%] justify-end max-md:relative max-md:right-auto max-md:bottom-auto max-md:h-[clamp(160px,35vw,220px)] max-md:w-full max-md:justify-center'
                  : 'relative mx-[-8px] mt-auto h-[112px] justify-center',
              )}
            >
              <Image
                alt={route.illustration.alt}
                className={cn(
                  'h-auto w-full object-contain object-bottom max-md:max-h-[58px]',
                  isFeatured
                    ? 'max-h-[min(34vh,330px)] object-right-bottom max-md:max-h-[clamp(160px,35vw,220px)] max-md:object-center'
                    : 'max-h-[110px]',
                )}
                height={route.illustration.height}
                sizes={isFeatured ? '(min-width: 1280px) 560px, 70vw' : '220px'}
                src={route.illustration.src}
                width={route.illustration.width}
              />
            </div>
          </div>

          <div className="shrink-0">
            <FairlendRouteStepTrack
              className={cn(isFeatured ? 'mt-3' : '-mt-[7px] max-md:mt-0')}
              descriptions={route.stepDescriptions}
              detailed={isFeatured}
              steps={route.steps}
            />

            <div className={fairlendRouteCardFooterVariants()}>
              <Button
                asChild
                className={fairlendRouteCardButtonVariants({ selected: isSelected })}
                size="clear"
                variant="default"
              >
                <a href={route.href}>
                  <span>{route.ctaLabel}</span>
                  <span className={fairlendRouteArrowBoxVariants({ size: 'card' })}>
                    <ArrowUpRight aria-hidden="true" className="size-[19px]" strokeWidth={2.8} />
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </>
      )}
    </article>
  )
}
