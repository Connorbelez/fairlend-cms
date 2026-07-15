import type { ReactElement } from 'react'
import Image from 'next/image'

type HeroLifecycleColumn = {
  step: string
  label: string
  summary: string
  src: string
  alt: string
  position?: string
}

const heroLifecycleColumns: HeroLifecycleColumn[] = [
  {
    step: '01',
    label: 'Site',
    summary: 'Find the site with the capital path already in view.',
    src: '/assets/partners/partner-lifecycle-site.webp',
    alt: 'Aerial view of a residential infill site outlined among GTA neighbourhood homes.',
    position: '50% 50%',
  },
  {
    step: '02',
    label: 'Finance',
    summary: 'Structure the mortgage, bridge, draw stack, and exit before the build hardens.',
    src: '/assets/partners/partner-lifecycle-finance.webp',
    alt: 'Residential blueprints and financing documents arranged on a desk.',
    position: '50% 54%',
  },
  {
    step: '03',
    label: 'Build',
    summary: 'Keep draw timing, project reality, and construction progress aligned.',
    src: '/assets/partners/partner-lifecycle-build.webp',
    alt: 'A modern residential construction project in exposed timber framing.',
    position: '50% 50%',
  },
  {
    step: '04',
    label: 'Exit',
    summary: 'Plan the refinance, sale, or takeout while the project is still moving.',
    src: '/assets/partners/partner-lifecycle-exit.webp',
    alt: 'Finished contemporary residential home with brick, dark windows, and landscaping.',
    position: '50% 50%',
  },
]

export function HeroLifecycleColumns(): ReactElement {
  return (
    <div className="partner-hero-lifecycle" aria-label="FairLend lifecycle from site to exit">
      {heroLifecycleColumns.map((column, index) => (
        <article
          aria-label={`${column.label}: ${column.summary}`}
          className="partner-hero-lifecycle__column"
          key={column.label}
          tabIndex={0}
        >
          <Image
            alt={column.alt}
            className="partner-hero-lifecycle__image"
            fill
            priority={index === 0}
            quality={60}
            sizes="(max-width: 560px) 62vw, (max-width: 1024px) 82vw, 25vw"
            src={column.src}
            style={{ objectPosition: column.position }}
          />
          <div className="partner-hero-lifecycle__scrim" aria-hidden="true" />
          <div className="partner-hero-lifecycle__content">
            <span className="partner-hero-lifecycle__rule" aria-hidden="true" />
            <span className="partner-hero-lifecycle__step">{column.step}</span>
            <span className="partner-hero-lifecycle__label">{column.label}</span>
            <p className="partner-hero-lifecycle__summary">{column.summary}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
