import React from 'react'
import Link from 'next/link'

import type { Media as MediaType, Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

import { isWatermelonHeroSectionType } from './fields'

type LinkItem = {
  label?: string | null
  url?: string | null
}

type ProofPoint = {
  value?: string | null
  label?: string | null
}

type FeatureCard = {
  title?: string | null
  description?: string | null
  media?: number | MediaType | null
}

type WatermelonHeroFields = {
  accentText?: string | null
  backgroundMedia?: number | MediaType | null
  brandLabel?: string | null
  description?: string | null
  eyebrow?: string | null
  featureCards?: FeatureCard[] | null
  foregroundMedia?: number | MediaType | null
  headline?: string | null
  logoMedia?: number | MediaType | null
  navItems?: LinkItem[] | null
  primaryActionLabel?: string | null
  primaryActionUrl?: string | null
  proofPoints?: ProofPoint[] | null
  secondaryActionLabel?: string | null
  secondaryActionUrl?: string | null
}

type WatermelonHeroProps = Page['hero'] & {
  watermelonHeroSection?: WatermelonHeroFields
}

const fallbackProofPoints: ProofPoint[] = [
  { value: '39', label: 'Hero sections' },
  { value: '17', label: 'Body layouts' },
  { value: '0', label: 'Preview crashes' },
]

const fallbackFeatures: FeatureCard[] = [
  {
    title: 'Typed Payload fields',
    description: 'The selected Watermelon section now exposes editable content and asset controls.',
  },
  {
    title: 'Preview-safe renderer',
    description: 'The frontend no longer depends on registry demo state or router context.',
  },
]
const fallbackWatermelonHeroActionHref = buildFairlendIntakeHref({
  intent: 'contact',
  source: 'watermelon-hero-fallback',
})

const getVariantNumber = (type?: string | null): number => {
  const match = type?.match(/watermelonHeroSection(\d+)$/)
  return match ? Number(match[1]) : 1
}

const getMediaResource = (media?: number | MediaType | null): MediaType | null =>
  media && typeof media === 'object' ? media : null

const getHeroTone = (variant: number) => {
  const tones = [
    {
      background: 'bg-[#f7f4ed] text-neutral-950',
      panel: 'border-neutral-950/10 bg-white/72',
      accent: 'text-emerald-700',
      button: 'bg-neutral-950 text-white hover:bg-neutral-800',
    },
    {
      background: 'bg-neutral-950 text-white',
      panel: 'border-white/12 bg-white/8',
      accent: 'text-lime-300',
      button: 'bg-lime-300 text-neutral-950 hover:bg-lime-200',
    },
    {
      background: 'bg-[#eef3f8] text-slate-950',
      panel: 'border-slate-950/10 bg-white/80',
      accent: 'text-blue-700',
      button: 'bg-blue-700 text-white hover:bg-blue-800',
    },
    {
      background: 'bg-[#fff7ed] text-stone-950',
      panel: 'border-stone-950/10 bg-white/75',
      accent: 'text-rose-700',
      button: 'bg-stone-950 text-white hover:bg-stone-800',
    },
  ]

  return tones[(variant - 1) % tones.length]
}

const getHeroLayoutClass = (variant: number) => {
  const layouts = [
    'lg:grid-cols-[1.05fr_0.95fr]',
    'lg:grid-cols-[0.88fr_1.12fr]',
    'lg:grid-cols-[1fr_1fr]',
  ]

  return layouts[(variant - 1) % layouts.length]
}

export const WatermelonRegistryHero: React.FC<WatermelonHeroProps> = (props) => {
  const { type, watermelonHeroSection } = props || {}

  if (!isWatermelonHeroSectionType(type)) return null

  const variant = getVariantNumber(type)
  const tone = getHeroTone(variant)
  const proofPoints = watermelonHeroSection?.proofPoints?.length
    ? watermelonHeroSection.proofPoints
    : fallbackProofPoints
  const features = watermelonHeroSection?.featureCards?.length
    ? watermelonHeroSection.featureCards
    : fallbackFeatures
  const backgroundMedia = getMediaResource(watermelonHeroSection?.backgroundMedia)
  const foregroundMedia = getMediaResource(watermelonHeroSection?.foregroundMedia)
  const logoMedia = getMediaResource(watermelonHeroSection?.logoMedia)
  const navItems = watermelonHeroSection?.navItems?.filter((item) => item?.label) || []

  return (
    <section className={cn('relative isolate overflow-hidden', tone.background)}>
      {backgroundMedia && (
        <Media
          fill
          imgClassName="object-cover opacity-18"
          priority
          resource={backgroundMedia}
          className="absolute inset-0 -z-10"
        />
      )}

      <div className="mx-auto flex min-h-[72vh] w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-current/10 pb-4">
          <Link className="flex items-center gap-3 font-semibold" href="/">
            {logoMedia ? (
              <Media
                resource={logoMedia}
                imgClassName="size-9 rounded-md object-cover"
                className="size-9 overflow-hidden rounded-md"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-md border border-current/15 text-sm">
                {watermelonHeroSection?.brandLabel?.slice(0, 1) || 'F'}
              </span>
            )}
            <span>{watermelonHeroSection?.brandLabel || 'FairLend'}</span>
          </Link>

          {navItems.length > 0 && (
            <nav className="hidden items-center gap-5 text-sm text-current/70 md:flex">
              {navItems.map((item, index) => (
                <a href={item.url || '/'} key={`${item.label}-${index}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <div
          className={cn(
            'grid flex-1 items-center gap-10 py-12 lg:grid-cols-2',
            getHeroLayoutClass(variant),
          )}
        >
          <div className="max-w-3xl">
            {watermelonHeroSection?.eyebrow && (
              <p
                className={cn(
                  'mb-5 text-xs font-semibold uppercase tracking-[0.24em]',
                  tone.accent,
                )}
              >
                {watermelonHeroSection.eyebrow}
              </p>
            )}
            <h1 className="text-balance text-5xl font-semibold leading-[0.96] tracking-normal sm:text-6xl lg:text-7xl">
              {watermelonHeroSection?.headline ||
                'Build the page from editable Watermelon sections.'}{' '}
              {watermelonHeroSection?.accentText && (
                <span className={tone.accent}>{watermelonHeroSection.accentText}</span>
              )}
            </h1>
            {watermelonHeroSection?.description && (
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-current/70">
                {watermelonHeroSection.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {watermelonHeroSection?.primaryActionLabel && (
                <a
                  className={cn(
                    'inline-flex h-11 items-center rounded-md px-5 text-sm font-semibold',
                    tone.button,
                  )}
                  href={watermelonHeroSection.primaryActionUrl || fallbackWatermelonHeroActionHref}
                >
                  {watermelonHeroSection.primaryActionLabel}
                </a>
              )}
              {watermelonHeroSection?.secondaryActionLabel && (
                <a
                  className="inline-flex h-11 items-center rounded-md border border-current/15 px-5 text-sm font-semibold"
                  href={watermelonHeroSection.secondaryActionUrl || '/posts'}
                >
                  {watermelonHeroSection.secondaryActionLabel}
                </a>
              )}
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-current/10 border-y border-current/10">
              {proofPoints.slice(0, 3).map((point, index) => (
                <div
                  className="py-4 pr-4 first:pl-0 not-first:pl-4"
                  key={`${point.value}-${index}`}
                >
                  <p className="text-2xl font-semibold">{point.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-current/55">
                    {point.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'relative min-h-[420px] overflow-hidden rounded-lg border p-4 shadow-sm',
              tone.panel,
            )}
          >
            {foregroundMedia ? (
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={foregroundMedia}
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,currentColor_0.5px,transparent_0.5px)] bg-[length:18px_18px] opacity-[0.08]" />
            )}

            <div className="relative mt-auto grid h-full content-end gap-3">
              {features.slice(0, 3).map((feature, index) => {
                const media = getMediaResource(feature.media)

                return (
                  <article
                    className="rounded-md border border-current/10 bg-background/90 p-4 text-foreground shadow-sm backdrop-blur"
                    key={`${feature.title}-${index}`}
                  >
                    {media && (
                      <Media
                        resource={media}
                        imgClassName="mb-3 aspect-[16/9] rounded-md object-cover"
                        className="mb-3 overflow-hidden rounded-md"
                      />
                    )}
                    <h2 className="text-sm font-semibold">{feature.title}</h2>
                    {feature.description && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
