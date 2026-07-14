import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utilities/ui'

import { FairlendRailCrossDots } from './FairlendRailCrossDots'

type FairlendLandingRailProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
  contentClassName?: string
  gutterTexture?: 'fabric-of-squares' | 'grid-noise' | 'inflicted' | 'debut-light' | 'groovepaper'
}

export function FairlendLandingRail({
  children,
  className,
  contentClassName,
  gutterTexture,
  ...props
}: FairlendLandingRailProps) {
  return (
    <div
      className={cn('fairlend-landing-rail', className)}
      data-gutter-texture={gutterTexture}
      {...props}
    >
      <FairlendRailCrossDots />
      <div aria-hidden="true" className="fairlend-landing-gutter fairlend-landing-gutter--left" />
      <div className={cn('fairlend-landing-rail__content', contentClassName)}>{children}</div>
      <div aria-hidden="true" className="fairlend-landing-gutter fairlend-landing-gutter--right" />
    </div>
  )
}
