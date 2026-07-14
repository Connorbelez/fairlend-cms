import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/ui'

import { fairlendRouteIconBadgeSurfaceVariants, fairlendRouteIconBadgeVariants } from './styles'
import type { FairlendRouteComponentProps, FairlendRouteIcon } from './types'

export { fairlendRouteIconBadgeVariants } from './styles'

type FairlendRouteIconBadgeProps = FairlendRouteComponentProps<HTMLSpanElement> &
  VariantProps<typeof fairlendRouteIconBadgeVariants> & {
    icon: FairlendRouteIcon
  }

export function FairlendRouteIconBadge({
  className,
  icon: Icon,
  size,
  ...props
}: FairlendRouteIconBadgeProps) {
  return (
    <span className={cn(fairlendRouteIconBadgeVariants({ size }), className)} {...props}>
      <span
        aria-hidden="true"
        className={fairlendRouteIconBadgeSurfaceVariants({ layer: 'base' })}
      />
      <span
        aria-hidden="true"
        className={fairlendRouteIconBadgeSurfaceVariants({ layer: 'glow' })}
      />
      <Icon
        aria-hidden="true"
        className={cn(size === 'compact' ? 'size-[18px]' : 'size-[23px]')}
        strokeWidth={2.9}
      />
    </span>
  )
}
