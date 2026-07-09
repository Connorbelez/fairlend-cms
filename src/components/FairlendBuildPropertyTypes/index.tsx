import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'

import { FairlendHeroOfferingsMorph } from './FairlendHeroOfferingsMorph.client'
import './fairlend-build-property-types.css'

export type FairlendBuildPropertyTypeAsset = {
  src: string
  alt?: string
  width: number
  height: number
}

export type FairlendBuildPropertyTypeRow = {
  id: string
  title: string
  tagline: string
  image: FairlendBuildPropertyTypeAsset
  imageClassName?: string
  href?: string
}

export type FairlendBuildPropertyTypesProps = {
  rows?: readonly FairlendBuildPropertyTypeRow[]
  foliageAsset?: FairlendBuildPropertyTypeAsset
  className?: string
  sectionLabel?: string
  variant?: 'feature' | 'hero' | 'board'
}

export const fairlendBuildPropertyTypesAssets = {
  multiplex: {
    src: '/assets/fairlend-build-property-types/multiplex-building-engraving.webp',
    alt: '',
    width: 1164,
    height: 918,
  },
  singleFamily: {
    src: '/assets/fairlend-build-property-types/single-family-house-engraving.webp',
    alt: '',
    width: 1212,
    height: 757,
  },
  land: {
    src: '/assets/fairlend-build-property-types/land-parcel-plan-engraving.webp',
    alt: '',
    width: 1303,
    height: 744,
  },
  privateMortgage: {
    src: '/assets/fairlend-route-selector/private-mortgage-house-engraving.webp',
    alt: '',
    width: 900,
    height: 378,
  },
  cornerFoliage: {
    src: '/assets/fairlend-build-property-types/corner-foliage-engraving.webp',
    alt: '',
    width: 1209,
    height: 742,
  },
} as const satisfies Record<string, FairlendBuildPropertyTypeAsset>

export const fairlendBuildPropertyTypesRows = [
  {
    id: 'multi-plex',
    title: 'Multi-plex',
    tagline: 'Financing & Execution support',
    image: fairlendBuildPropertyTypesAssets.multiplex,
    href: '/start/builder',
  },
  {
    id: 'single-family',
    title: 'Single family',
    tagline: 'Build for generations',
    image: fairlendBuildPropertyTypesAssets.singleFamily,
    href: '/start/builder',
  },
  {
    id: 'land',
    title: 'Land',
    tagline: 'Unlock possibility',
    image: fairlendBuildPropertyTypesAssets.land,
    imageClassName: 'fairlend-build-property-types__image--land',
    href: '/start/builder',
  },
  {
    id: 'private-mortgage',
    title: 'Mortgage',
    tagline: 'The FairLend Mortgage',
    image: fairlendBuildPropertyTypesAssets.privateMortgage,
    href: '/borrowers/private-mortgage-financing',
  },
] as const satisfies readonly FairlendBuildPropertyTypeRow[]

function PropertyTypesList({
  rows,
}: {
  rows: readonly FairlendBuildPropertyTypeRow[]
}): ReactElement {
  return (
    <ul className="fairlend-build-property-types__list">
      {rows.map((row, index) => {
        const content = (
          <>
            <div className="fairlend-build-property-types__art">
              <Image
                alt={row.image.alt ?? ''}
                className={cn('fairlend-build-property-types__image', row.imageClassName)}
                height={row.image.height}
                priority={index === 0}
                sizes="(max-width: 640px) 38vw, (max-width: 1024px) 31vw, 290px"
                src={row.image.src}
                width={row.image.width}
              />
            </div>

            <Separator
              className="fairlend-build-property-types__divider"
              decorative
              orientation="vertical"
            />

            <div className="fairlend-build-property-types__copy">
              <h2 className="fairlend-build-property-types__title">{row.title}</h2>
              <p className="fairlend-build-property-types__tagline">{row.tagline}</p>
            </div>
          </>
        )

        return (
          <li className="fairlend-build-property-types__row" key={row.id}>
            {row.href ? (
              <Link
                aria-label={`${row.title}: ${row.tagline}`}
                className="fairlend-build-property-types__link"
                href={row.href}
              >
                {content}
              </Link>
            ) : (
              <div className="fairlend-build-property-types__link">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function FairlendBuildPropertyTypes({
  rows = fairlendBuildPropertyTypesRows,
  foliageAsset = fairlendBuildPropertyTypesAssets.cornerFoliage,
  className,
  sectionLabel = 'Build property type selector',
  variant = 'feature',
}: FairlendBuildPropertyTypesProps): ReactElement {
  const list = <PropertyTypesList rows={rows} />

  return (
    <section
      aria-label={sectionLabel}
      className={cn(
        'fairlend-build-property-types',
        variant === 'hero' && 'fairlend-build-property-types--hero',
        variant === 'board' && 'fairlend-build-property-types--board',
        className,
      )}
      data-fairlend-build-property-types
      data-variant={variant}
    >
      <div className="fairlend-build-property-types__paper" aria-hidden="true" />
      {variant === 'hero' ? (
        <Image
          alt=""
          aria-hidden="true"
          className="fairlend-build-property-types__mobile-image"
          fill
          priority
          sizes="(max-width: 576px) 100vw, 1px"
          src="/assets/fairlend/mobile-hero-property-path.webp"
        />
      ) : null}

      {variant === 'hero' ? (
        <div className="pointer-events-auto absolute inset-0 z-[1]">
          <FairlendHeroOfferingsMorph rows={rows} />
        </div>
      ) : (
        list
      )}

      {variant === 'feature' ? (
        <Image
          alt={foliageAsset.alt ?? ''}
          aria-hidden="true"
          className="fairlend-build-property-types__foliage"
          height={foliageAsset.height}
          sizes="(max-width: 640px) 32vw, 180px"
          src={foliageAsset.src}
          width={foliageAsset.width}
        />
      ) : null}
    </section>
  )
}

export default FairlendBuildPropertyTypes
