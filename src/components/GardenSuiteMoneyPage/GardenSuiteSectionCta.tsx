import Link from 'next/link'

import { BrutalistCtaButton } from '@/components/ui/brutalist-cta-button'
import { cn } from '@/utilities/ui'

import styles from './GardenSuiteSectionCta.module.css'

type GardenSuiteSectionCtaProps = {
  actionLabel: string
  body: string
  className?: string
  ctaId: string
  ctaLocation: string
  density?: 'compact' | 'standard'
  heading: string
  headingId: string
  href: string
  label: string
  tone?: 'ink' | 'paper' | 'warm'
}

export function GardenSuiteSectionCta({
  actionLabel,
  body,
  className,
  ctaId,
  ctaLocation,
  density = 'standard',
  heading,
  headingId,
  href,
  label,
  tone = 'paper',
}: GardenSuiteSectionCtaProps) {
  return (
    <aside
      aria-labelledby={headingId}
      className={cn(styles.cta, className)}
      data-density={density}
      data-tone={tone}
    >
      <div className={styles.copy}>
        <p>{label}</p>
        <h3 id={headingId}>{heading}</h3>
        <span>{body}</span>
      </div>

      <BrutalistCtaButton
        asChild
        className={styles.action}
        size={density === 'compact' ? 'compact' : 'default'}
      >
        <Link
          data-analytics-cta-id={ctaId}
          data-analytics-cta-location={ctaLocation}
          data-analytics-source="garden-suite-financing-gta"
          href={href}
        >
          {actionLabel}
        </Link>
      </BrutalistCtaButton>
    </aside>
  )
}
