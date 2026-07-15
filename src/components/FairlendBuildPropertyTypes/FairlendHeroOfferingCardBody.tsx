import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { cn } from '@/utilities/ui'

export type FairlendHeroOfferingRow = {
  id: string
  title: string
  tagline: string
  image: {
    src: string
    alt?: string
    width: number
    height: number
  }
  imageClassName?: string
  href?: string
}

export function FairlendHeroOfferingCardBody({
  linkTitle,
  row,
  priority,
}: {
  linkTitle: boolean
  row: FairlendHeroOfferingRow
  priority?: boolean
}): ReactElement {
  return (
    <>
      <div className="fairlend-build-property-types__art">
        <Image
          alt={row.image.alt ?? ''}
          className={cn('fairlend-build-property-types__image', row.imageClassName)}
          height={row.image.height}
          loading={priority ? undefined : 'eager'}
          priority={priority}
          sizes="(max-width: 640px) 38vw, (max-width: 1024px) 31vw, 290px"
          src={row.image.src}
          width={row.image.width}
        />
      </div>

      <div aria-hidden="true" className="fairlend-build-property-types__divider" />

      <div className="fairlend-build-property-types__copy">
        <h2 className="fairlend-build-property-types__title">
          {linkTitle && row.href ? (
            <Link
              aria-label={`${row.title}: ${row.tagline}`}
              className="fairlend-hero-offerings-morph__title-link"
              draggable={false}
              href={row.href}
              onDragStart={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
              prefetch={false}
            >
              {row.title}
            </Link>
          ) : (
            row.title
          )}
        </h2>
        <p className="fairlend-build-property-types__tagline">{row.tagline}</p>
      </div>
    </>
  )
}
