import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

      <Separator orientation="vertical" className={fairlendRouteHelpDividerVariants()} />

      <Button asChild className={fairlendRouteHelpButtonVariants()} size="clear">
        <a href={content.href}>
          <span>{content.ctaLabel}</span>
          <span className={fairlendRouteArrowBoxVariants({ size: 'helper' })}>
            <ArrowUpRight aria-hidden="true" className="size-[18px]" strokeWidth={2.8} />
          </span>
        </a>
      </Button>
    </div>
  )
}
