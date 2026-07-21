import { CalendarDays, FileText, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

import { BrutalistCtaButton } from '@/components/ui/brutalist-cta-button'
import { DrawFlowMilestoneRail } from './DrawFlowMilestoneRail.client'
import './drawflow-dossier.css'

type DrawFlowDossierCardProps = {
  className?: string
  cta?: {
    href: string
    id: string
    label: string
    location: string
  }
  headingLevel?: 'h2' | 'h3'
  headingId?: string
  layout?: 'portrait' | 'landscape'
}

export function DrawFlowDossierCard({
  className,
  cta,
  headingLevel = 'h3',
  headingId = 'bm-drawflow-title',
  layout = 'portrait',
}: DrawFlowDossierCardProps) {
  const Heading = headingLevel
  const FeatureHeading = headingLevel === 'h2' ? 'h3' : 'h4'

  return (
    <article
      className={['bm-drawflow', layout === 'landscape' ? 'bm-drawflow--landscape' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={headingId}
    >
      <span className="bm-df-revision" aria-hidden="true">
        <span>FL-LOCREDIT</span>
        <span>REV-01</span>
        <span>05.14.2026</span>
      </span>
      <span className="bm-df-corner-cross" aria-hidden="true" />

      <div className="bm-df-meta">
        <span className="bm-df-label">
          <span className="pip" aria-hidden="true" />
          Powered by DrawFlow
        </span>
        <span className="bm-df-dossier">Garden Suite financing plan</span>
      </div>

      <div className="bm-df-intro">
        <Heading className="bm-df-head" id={headingId}>
          Finance your build, <em>stage by stage.</em>
        </Heading>
        <p className="bm-df-sub">
          Up to 15 draws. Interest only on funds advanced. <b>Fund the work, not the wait.</b>
        </p>
      </div>

      <div className="bm-df-milestone-block">
        <div className="bm-df-section-heading">
          <span className="bm-df-section-label">Construction milestones</span>
          <span className="bm-df-track-status">
            <strong>Illustrative sequence</strong> · checkpoint 6 of 9
          </span>
        </div>
        <DrawFlowMilestoneRail />
        <span className="bm-df-track-hint">
          Scroll or swipe the milestone plan <span aria-hidden="true">→</span>
        </span>
      </div>

      <div className="bm-df-finance">
        <div className="bm-df-compare">
          <div className="bm-df-cmp">
            <div className="bm-df-cmp-tag">Traditional</div>
            <div className="bm-df-cmp-num">3 draws</div>
          </div>
          <div className="bm-df-cmp fairlend">
            <div className="bm-df-cmp-tag">FairLend</div>
            <div className="bm-df-cmp-num">up to 15 draws</div>
          </div>
        </div>

        <div className="bm-df-saved">
          <span className="amt">≈ $12,000</span>
          <span className="lbl">
            <strong>Illustrative interest saved</strong>
            <span>over a typical build.</span>
          </span>
          <span className="caveat">
            *Illustrative only.
            <br /> Every project
            <br /> differs.
          </span>
        </div>
      </div>

      <div className="bm-df-features">
        <div className="bm-df-flex">
          <article className="bm-tile">
            <span className="tile-icon" aria-hidden="true">
              <CalendarDays />
            </span>
            <div className="tile-copy">
              <FeatureHeading className="tile-title">Your build sets the schedule</FeatureHeading>
              <p>
                Set draw dates around the milestones in your build plan—not a one-size-fits-all
                calendar.
              </p>
            </div>
          </article>
          <article className="bm-tile">
            <span className="tile-icon" aria-hidden="true">
              <SlidersHorizontal />
            </span>
            <div className="tile-copy">
              <FeatureHeading className="tile-title">Adjust when the build changes</FeatureHeading>
              <p>
                If approved work or timing changes, update the draw schedule so funds are available
                when needed.
              </p>
            </div>
          </article>
        </div>

        <div className="bm-df-more">
          <span className="tile-icon" aria-hidden="true">
            <FileText />
          </span>
          <div className="tile-copy">
            <FeatureHeading className="tile-title">
              People who understand construction
            </FeatureHeading>
            <p>
              FairLend&apos;s build advisers connect financing to real milestones and can refer
              experienced Ontario project professionals when needed.
            </p>
            {cta ? (
              <BrutalistCtaButton
                asChild
                className="mt-3 w-full !text-[var(--bm-drawflow-base)] [--brutalist-cta-signal-hover:var(--bm-signal)] [--brutalist-cta-signal:var(--bm-signal)] [--brutalist-cta-surface-hover:var(--bm-drawflow-ink)] [--brutalist-cta-surface:var(--bm-drawflow-ink)]"
                size="compact"
              >
                <Link
                  data-analytics-cta-id={cta.id}
                  data-analytics-cta-location={cta.location}
                  data-analytics-source="garden-suite-financing-gta"
                  href={cta.href}
                >
                  {cta.label}
                </Link>
              </BrutalistCtaButton>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
