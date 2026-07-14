import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { buildFairlendConsultationHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

import {
  fairlendRouteArrowBoxVariants,
  fairlendRouteHelpBannerVariants,
  fairlendRouteHelpButtonVariants,
  fairlendRouteHelpDividerVariants,
  fairlendRouteHelpTextVariants,
} from './styles'
import type { FairlendRouteComponentProps, FairlendRouteHelpBannerContent } from './types'

type FairlendRouteHelpBannerProps = Omit<FairlendRouteComponentProps<HTMLDivElement>, 'content'> & {
  content: FairlendRouteHelpBannerContent
}

export function FairlendRouteHelpBanner({
  className,
  content,
  ...props
}: FairlendRouteHelpBannerProps) {
  return (
    <div className={cn(fairlendRouteHelpBannerVariants(), className)} {...props}>
      <div className="relative flex h-[62px] items-center justify-center max-md:h-[56px]">
        <Image
          alt={content.image.alt}
          className="h-[62px] w-auto object-contain max-md:h-[56px]"
          height={content.image.height}
          sizes="96px"
          src={content.image.src}
          width={content.image.width}
        />
      </div>

      <div className="min-w-0">
        <h3 className={fairlendRouteHelpTextVariants({ role: 'title' })}>{content.title}</h3>
        <p className={fairlendRouteHelpTextVariants({ role: 'body' })}>{content.body}</p>
      </div>

      <div aria-hidden="true" className={fairlendRouteHelpDividerVariants()} />

      <Button asChild className={fairlendRouteHelpButtonVariants()} size="clear" variant="default">
        <a
          aria-label="Book a free FairLend consultation to choose the right route"
          href={buildFairlendConsultationHref('route-selector-helper-book-consultation')}
        >
          <span>{content.ctaLabel}</span>
          <span className={fairlendRouteArrowBoxVariants({ size: 'helper' })}>
            <ArrowUpRight aria-hidden="true" className="size-[18px]" strokeWidth={2.8} />
          </span>
        </a>
      </Button>
    </div>
  )
}
