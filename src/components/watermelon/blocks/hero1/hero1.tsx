// @ts-nocheck
'use client'

import React from 'react'

import { cn } from '@/utilities/ui'

import Header, { type WatermelonHeroHeaderProps } from './ui/Header'
import Hero, { type WatermelonHeroPromptProps } from './ui/Hero'

export type WatermelonHero1Props = WatermelonHeroPromptProps & {
  className?: string
  header?: WatermelonHeroHeaderProps
  showHeader?: boolean
}

export const Hero1: React.FC<WatermelonHero1Props> = ({
  className,
  header,
  showHeader = false,
  ...heroProps
}) => {
  return (
    <div className={cn('min-h-[calc(100svh-4rem)] bg-[#111216] font-sans antialiased', className)}>
      <div className="text-neutral-50">
        {showHeader && <Header {...header} />}
        <main className="overflow-hidden">
          <Hero {...heroProps} />
        </main>
      </div>
    </div>
  )
}

export default Hero1
