'use client'

import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import WatermelonHero1Block from '@/components/watermelon/blocks/hero1/hero1'
import { useHeaderTheme } from '@/providers/HeaderTheme'

type WatermelonHero1Settings = {
  promptPlaceholder?: string | null
  modeLabel?: string | null
  depthLabel?: string | null
  voiceLabel?: string | null
  submitLabel?: string | null
}

type WatermelonHeroProps = Page['hero'] & {
  watermelonHero1?: WatermelonHero1Settings | null
}

export const WatermelonHero1: React.FC<WatermelonHeroProps> = ({
  links,
  richText,
  watermelonHero1,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <WatermelonHero1Block
      className="-mt-16"
      depthLabel={watermelonHero1?.depthLabel}
      links={links}
      modeLabel={watermelonHero1?.modeLabel}
      promptPlaceholder={watermelonHero1?.promptPlaceholder}
      richText={richText}
      submitLabel={watermelonHero1?.submitLabel}
      voiceLabel={watermelonHero1?.voiceLabel}
    />
  )
}
