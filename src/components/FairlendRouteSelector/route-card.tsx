import { ArrowUpRight, Check } from 'lucide-react'
import Image from 'next/image'
import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const isSupporting = layout === 'supporting'

  return (
    <article
      className={cn(fairlendRouteCardVariants({ layout, selected: isSelected }), className)}
      data-fairlend-route-card={route.id}
      data-fairlend-route-motion="card"
      data-fairlend-route-selected={isSelected ? 'true' : 'false'}
      {...props}
    >
      {route.badge ? <Badge className={fairlendRouteBadgeVariants()}>{route.badge}</Badge> : null}

      <div
        className={cn(
          'grid grid-cols-[44px_minmax(0,1fr)] gap-4 max-md:grid-cols-[40px_minmax(0,1fr)] max-md:items-center max-md:gap-3',
          route.badge && 'pr-16',
        )}
      >
        <FairlendRouteIconBadge className="max-md:size-10" icon={route.icon} />
        <h3
          className={cn(
            fairlendRouteCardTextVariants({ role: 'title' }),
            isFeatured && 'max-w-none text-[42px] leading-[0.9] xl:whitespace-nowrap',
            isSupporting && 'max-w-none text-[29px] leading-[0.94]',
          )}
        >
          {route.title}
        </h3>
      </div>

      <p
        className={cn(
          fairlendRouteCardTextVariants({ role: 'description' }),
          isFeatured && 'max-w-none text-[20px] leading-[1.2]',
          isSupporting && 'mt-3 min-h-0 max-w-[70%] text-[13px] leading-[1.25]',
        )}
      >
        {route.description}
      </p>

      {isSupporting ? (
        <>
          <div className="relative mt-3 min-h-0 flex-1 overflow-hidden">
            <ul className="relative z-10 w-[64%] space-y-1.5">
              {route.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className={cn(
                    fairlendRouteCardTextVariants({ role: 'bullet' }),
                    'gap-1.5 text-[11px] leading-[1.18]',
                  )}
                >
                  <span className={fairlendRouteBenefitIconVariants()}>
                    <Check aria-hidden="true" className="size-[8px]" strokeWidth={3} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="absolute right-[-10px] bottom-0 flex h-[104px] w-[42%] items-end justify-end">
              <Image
                alt={route.illustration.alt}
                className="h-auto max-h-[104px] w-full object-contain object-right-bottom"
                data-fairlend-route-motion="illustration"
                height={route.illustration.height}
                sizes="(min-width: 1280px) 260px, 45vw"
                src={route.illustration.src}
                width={route.illustration.width}
              />
            </div>
          </div>

          <FairlendRouteStepTrack
            className="mt-2 shrink-0"
            density="compact"
            steps={route.steps}
          />

          <div className={cn(fairlendRouteCardFooterVariants(), 'mt-2 pt-2')}>
            <Button
              asChild
              className={fairlendRouteCardButtonVariants({ selected: true })}
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
                    isFeatured && 'gap-3 text-[16px] leading-[1.25]',
                  )}
                >
                  <span
                    className={cn(
                      fairlendRouteBenefitIconVariants(),
                      isFeatured && 'size-[18px]',
                    )}
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
                data-fairlend-route-motion="illustration"
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
                className={fairlendRouteCardButtonVariants({ selected: true })}
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
