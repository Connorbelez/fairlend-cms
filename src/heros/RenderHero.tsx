import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { WatermelonHero1 } from '@/heros/WatermelonHero1'
import { WatermelonRegistryHero } from '@/heros/WatermelonRegistryHero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  watermelonHero1: WatermelonHero1,
  watermelonHeroSection1: WatermelonRegistryHero,
  watermelonHeroSection2: WatermelonRegistryHero,
  watermelonHeroSection3: WatermelonRegistryHero,
  watermelonHeroSection4: WatermelonRegistryHero,
  watermelonHeroSection5: WatermelonRegistryHero,
  watermelonHeroSection6: WatermelonRegistryHero,
  watermelonHeroSection7: WatermelonRegistryHero,
  watermelonHeroSection8: WatermelonRegistryHero,
  watermelonHeroSection9: WatermelonRegistryHero,
  watermelonHeroSection10: WatermelonRegistryHero,
  watermelonHeroSection11: WatermelonRegistryHero,
  watermelonHeroSection12: WatermelonRegistryHero,
  watermelonHeroSection13: WatermelonRegistryHero,
  watermelonHeroSection14: WatermelonRegistryHero,
  watermelonHeroSection15: WatermelonRegistryHero,
  watermelonHeroSection16: WatermelonRegistryHero,
  watermelonHeroSection17: WatermelonRegistryHero,
  watermelonHeroSection18: WatermelonRegistryHero,
  watermelonHeroSection19: WatermelonRegistryHero,
  watermelonHeroSection20: WatermelonRegistryHero,
  watermelonHeroSection21: WatermelonRegistryHero,
  watermelonHeroSection22: WatermelonRegistryHero,
  watermelonHeroSection23: WatermelonRegistryHero,
  watermelonHeroSection24: WatermelonRegistryHero,
  watermelonHeroSection25: WatermelonRegistryHero,
  watermelonHeroSection26: WatermelonRegistryHero,
  watermelonHeroSection27: WatermelonRegistryHero,
  watermelonHeroSection28: WatermelonRegistryHero,
  watermelonHeroSection29: WatermelonRegistryHero,
  watermelonHeroSection30: WatermelonRegistryHero,
  watermelonHeroSection31: WatermelonRegistryHero,
  watermelonHeroSection32: WatermelonRegistryHero,
  watermelonHeroSection33: WatermelonRegistryHero,
  watermelonHeroSection34: WatermelonRegistryHero,
  watermelonHeroSection35: WatermelonRegistryHero,
  watermelonHeroSection36: WatermelonRegistryHero,
  watermelonHeroSection37: WatermelonRegistryHero,
  watermelonHeroSection38: WatermelonRegistryHero,
  watermelonHeroSection39: WatermelonRegistryHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
