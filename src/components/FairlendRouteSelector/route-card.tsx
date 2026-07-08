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
  route,
  selected,
  ...props
}: FairlendRouteCardProps) {
  const isSelected = Boolean(selected)

  return (
    <article
      className={cn(fairlendRouteCardVariants({ selected: isSelected }), className)}
      data-fairlend-route-card={route.id}
      data-fairlend-route-motion="card"
      data-fairlend-route-selected={isSelected ? 'true' : 'false'}
      {...props}
    >
      {route.badge ? <Badge className={fairlendRouteBadgeVariants()}>{route.badge}</Badge> : null}

      <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 max-md:grid-cols-[40px_minmax(0,1fr)] max-md:items-center max-md:gap-3">
        <FairlendRouteIconBadge className="max-md:size-10" icon={route.icon} />
        <h3 className={fairlendRouteCardTextVariants({ role: 'title' })}>{route.title}</h3>
      </div>

      <p className={fairlendRouteCardTextVariants({ role: 'description' })}>{route.description}</p>

      <ul className="mt-4 space-y-2.5 max-md:space-y-2.5">
        {route.bullets.map((bullet) => (
          <li key={bullet} className={fairlendRouteCardTextVariants({ role: 'bullet' })}>
            <span className={fairlendRouteBenefitIconVariants()}>
              <Check aria-hidden="true" className="size-[8px]" strokeWidth={3} />
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <div className="relative mx-[-8px] mt-5 flex h-[112px] items-end justify-center overflow-visible max-md:mt-2 max-md:h-[58px]">
          <Image
            alt={route.illustration.alt}
            className="h-auto max-h-[110px] w-full object-contain object-bottom max-md:max-h-[58px]"
            data-fairlend-route-motion="illustration"
            height={route.illustration.height}
            sizes="(min-width: 1024px) 220px, 70vw"
            src={route.illustration.src}
            width={route.illustration.width}
          />
        </div>

        <FairlendRouteStepTrack
          className="-mt-[7px] max-md:mt-0"
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
              <span>Apply now</span>
              <span className={fairlendRouteArrowBoxVariants({ size: 'card' })}>
                <ArrowUpRight aria-hidden="true" className="size-[19px]" strokeWidth={2.8} />
              </span>
            </a>
          </Button>
          <Button
            asChild
            className={fairlendRouteCardButtonVariants({ selected: false })}
            size="clear"
            variant="outline"
          >
            <a href={route.learnMoreHref}>
              <span>Learn more</span>
              <span className={fairlendRouteArrowBoxVariants({ size: 'card' })}>
                <ArrowUpRight aria-hidden="true" className="size-[19px]" strokeWidth={2.8} />
              </span>
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}
