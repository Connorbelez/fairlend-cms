'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'
import { BrutalistCtaButton } from '@/components/ui/brutalist-cta-button'
import { trackFairlendEvent } from '@/lib/analytics/events'
import { cn } from '@/utilities/ui'

import {
  GardenSuiteJourneyEvidence,
  type GardenSuiteJourneyMedia,
} from './GardenSuiteJourneyEvidence'
import { GardenSuiteSectionCta } from './GardenSuiteSectionCta'

type JourneyComparison = {
  items: readonly string[]
  summary: string
}

type JourneyPlan = {
  sections: readonly {
    items: readonly string[]
    title: string
  }[]
  summary: string
}

type JourneyStage = {
  artifact: string
  cta: {
    body: string
    href: string
    id: string
    label: string
  }
  media: GardenSuiteJourneyMedia
  operation: string
  short: string
  title: string
  withFairlend: JourneyPlan
  without: JourneyComparison
}

type JourneyPalette = {
  accent: string
  canvas: string
  dock: string
  ink: string
  paper: string
  rail: string
  rule: string
  soft: string
}

const journeyStages: readonly JourneyStage[] = [
  {
    title: 'Initial consult',
    short:
      'Define the outcome, test whether the build pencils and plan the capital from construction through the final mortgage.',
    without: {
      items: [
        'Define the project requirements yourself',
        'Explain your finances to each adviser separately',
        'Estimate the timeline and full project cost',
        'Compare construction and final mortgage options',
        'Reconcile the budget, risks and draw schedule',
      ],
      summary: 'You assemble the project and financing plan yourself.',
    },
    withFairlend: {
      sections: [
        {
          title: 'We start with you',
          items: [
            'Your goals, intended outcome and any special requirements',
            'Your financial position, available capital and assets to protect',
          ],
        },
        {
          title: 'We build the plan together',
          items: [
            'Test whether the build pencils across zoning, regulatory, soft and construction costs',
            'Structure capital to control cost and keep funds available when needed',
            'Walk through the risks, failure points and contingency requirements',
          ],
        },
        {
          title: 'You leave with',
          items: [
            'A preliminary construction budget, roadmap and timeline',
            'A construction and final mortgage plan with costs and an optimized draw schedule',
          ],
        },
      ],
      summary:
        'Know what the project should cost, how long it should take and how it will be funded.',
    },
    media: 'consult',
    operation: 'Start with the property',
    artifact: 'Budget + capital plan',
    cta: {
      body: 'Start with your goals, property and finances.',
      href: '#garden-suite-assessment',
      id: 'garden-suite-stage-consult',
      label: 'Start with my property and goals',
    },
  },
  {
    title: 'Plan the build',
    short:
      'Turn the project into a permit-ready, financeable sequence of people, costs, milestones and draws.',
    without: {
      items: [
        'Find the missing builders, trades and professionals',
        'Coordinate drawings, reports and the permit application',
        'Sequence every construction sub-milestone',
        'Negotiate and interpret the construction loan terms',
        'Align the budget, timeline and draw schedule',
        'Create your own system for monitoring the build',
      ],
      summary: 'You coordinate the team, permit, loan and build plan.',
    },
    withFairlend: {
      sections: [
        {
          title: 'We start with you',
          items: ['Review your plans, permit status, budget, financing and current project team'],
        },
        {
          title: 'We build the plan together',
          items: [
            'Fill gaps across builders, trades, suppliers and pre-build professionals',
            'Coordinate the professionals, documents and steps required to obtain the permit',
            'Break the build into detailed sub-milestones with a cost and draw for each',
            'Finalize the loan terms and align the budget, timeline and draw schedule',
            'Onboard your team into DrawFlow and teach you how to use it',
          ],
        },
        {
          title: 'You leave with',
          items: [
            'A ready-to-build team, permit, loan, milestone plan and configured DrawFlow portal',
          ],
        },
      ],
      summary: 'Every person, cost, milestone and draw is aligned before construction starts.',
    },
    media: 'permit',
    operation: 'Plan the build',
    artifact: 'Permit + build plan',
    cta: {
      body: 'Pressure-test the budget before permits and contracts are locked in.',
      href: '/garden-suite-financing-gta#garden-suite-faq-budget',
      id: 'garden-suite-stage-planning',
      label: 'Review costs and feasibility',
    },
  },
  {
    title: 'Financing & monitoring',
    short:
      'Close the loan, monitor the live build and release capital as each milestone is completed.',
    without: {
      items: [
        'Coordinate the loan closing and construction start',
        'Keep the project team updated across separate channels',
        'Validate completed work against the plans',
        'Collect evidence and arrange progress inspections',
        'Request, reconcile and reforecast every draw',
      ],
      summary: 'You monitor the build and administer every draw.',
    },
    withFairlend: {
      sections: [
        {
          title: 'We start with you',
          items: ['Close the construction loan, unlock the first milestone and break ground'],
        },
        {
          title: 'We run the build together',
          items: [
            'Connect you, FairLend, builders, contractors and lenders in one live workspace',
            'Validate completed work against the plans, quality requirements and milestone conditions',
            'Build the evidence package with progress records, invoices, photos and approvals',
            'Provide same-day 4K drone footage or a same-week visit from an in-house inspector',
            'Let you draw any amount from zero to the unlocked limit, whenever you choose',
          ],
        },
        {
          title: 'You leave with',
          items: ['A completed build with a reconciled budget and auditable progress record'],
        },
      ],
      summary:
        'Every DrawFlow facility includes 15 borrower-controlled draws. Case studies show up to 50% lower construction-period interest, averaging about $12,000 saved.',
    },
    media: 'drawflow',
    operation: 'Fund each stage',
    artifact: 'Live build + draw record',
    cta: {
      body: 'Align the loan, milestones and draws before breaking ground.',
      href: '#garden-suite-assessment',
      id: 'garden-suite-stage-financing',
      label: 'Plan my financing and draw schedule',
    },
  },
  {
    title: 'Completion & final mortgage',
    short:
      'Resolve the final issues and replace construction financing with a lower-rate, longer-term mortgage.',
    without: {
      items: [
        'Validate completion and required inspections',
        'Find and resolve outstanding deficiencies',
        'Collect invoices, receipts and project documents',
        'Assemble the final mortgage evidence package',
        'Source and coordinate the final mortgage',
      ],
      summary: 'You prove completion and arrange the final mortgage.',
    },
    withFairlend: {
      sections: [
        {
          title: 'We start with you',
          items: ['Plan the final mortgage early and review the remaining work and inspections'],
        },
        {
          title: 'We complete the transition together',
          items: [
            'Validate completion and coordinate the resolution of deficiencies or missing evidence',
            'Compile invoices, receipts, reports, approvals and draw history in DrawFlow',
            'Broker the lower-rate, longer-term mortgage for the completed property',
            'Manage the application, supporting documents and outstanding conditions',
          ],
        },
        {
          title: 'You leave with',
          items: [
            'A validated completion record and one auditable digital project package',
            'A funded final mortgage with the construction financing repaid',
          ],
        },
      ],
      summary:
        'The completed build becomes a lender-ready final mortgage file without a document chase.',
    },
    media: 'takeout',
    operation: 'Move to the final mortgage',
    artifact: 'Completion + final mortgage',
    cta: {
      body: 'Plan the final mortgage before construction is complete.',
      href: '#garden-suite-assessment',
      id: 'garden-suite-stage-completion',
      label: 'Plan my completion mortgage',
    },
  },
] as const

/** The approved four-file rotation: evergreen, blueprint, ochre and plum. */
const journeyPalettes: readonly JourneyPalette[] = [
  {
    canvas: '#0c2928',
    rail: '#071f27',
    paper: '#e9eee7',
    dock: '#d8e0d8',
    soft: '#dfe9e2',
    ink: '#0c2928',
    rule: '#315451',
    accent: '#b9f56b',
  },
  {
    canvas: '#11283e',
    rail: '#081827',
    paper: '#e7edf2',
    dock: '#d3dfe8',
    soft: '#dce9f2',
    ink: '#102b43',
    rule: '#47657d',
    accent: '#7ed8ff',
  },
  {
    canvas: '#432d16',
    rail: '#251a10',
    paper: '#f0e8d8',
    dock: '#dfd1b8',
    soft: '#ece0ca',
    ink: '#3b2816',
    rule: '#735938',
    accent: '#ffc84a',
  },
  {
    canvas: '#37273c',
    rail: '#201724',
    paper: '#eee8ef',
    dock: '#ded1e0',
    soft: '#e8ddea',
    ink: '#35223a',
    rule: '#6c5271',
    accent: '#ef9ddd',
  },
] as const

function getPaletteStyle(palette: JourneyPalette) {
  return {
    '--ledger-accent': palette.accent,
    '--ledger-canvas': palette.canvas,
    '--ledger-dock': palette.dock,
    '--ledger-ink': palette.ink,
    '--ledger-paper': palette.paper,
    '--ledger-rail': palette.rail,
    '--ledger-rule': palette.rule,
    '--ledger-soft': palette.soft,
  } as React.CSSProperties
}

function getJourneyScrollMetrics(section: HTMLElement) {
  const chapterNavHeight =
    Number.parseFloat(
      window.getComputedStyle(section).getPropertyValue('--gs-chapter-stack-height'),
    ) || 50
  const stickyHeight = Math.max(1, window.innerHeight - chapterNavHeight)

  return {
    chapterNavHeight,
    distance: Math.max(1, section.offsetHeight - stickyHeight),
  }
}

function JourneyComparisonPanel({
  active,
  comparison,
  connected,
}: {
  active: boolean
  comparison: JourneyComparison | JourneyPlan
  connected: boolean
}) {
  const sections = 'sections' in comparison ? comparison.sections : null
  const items = 'items' in comparison ? comparison.items : null

  return (
    <section
      aria-label={connected ? 'With FairLend' : 'Without FairLend'}
      className={cn(
        'grid min-w-0 content-start border p-4',
        connected
          ? 'border-[var(--ledger-rule)] motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]'
          : 'border-[color-mix(in_srgb,var(--ledger-rule)_50%,transparent)] bg-[color-mix(in_srgb,var(--ledger-paper)_76%,#d7d8d5)]',
        connected &&
          (active
            ? 'bg-[color-mix(in_srgb,var(--ledger-dock)_76%,var(--ledger-accent))] shadow-[6px_6px_0_color-mix(in_srgb,var(--ledger-ink)_18%,transparent)] motion-safe:-translate-y-1 motion-safe:delay-150'
            : 'bg-[color-mix(in_srgb,var(--ledger-paper)_58%,var(--ledger-dock))] shadow-none'),
      )}
      data-comparison-side={connected ? 'with' : 'without'}
      data-settled={active ? 'true' : 'false'}
    >
      <header>
        <p
          className={cn(
            'm-0 text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]',
            !connected && 'opacity-65',
          )}
        >
          {connected ? 'One coordinated plan' : 'You coordinate it alone'}
        </p>
        <h4 className="mt-2 text-xl font-black">
          {connected ? 'With FairLend' : 'Without FairLend'}
        </h4>
      </header>

      {sections ? (
        <div className="mt-4 grid gap-4">
          {sections.map((section) => (
            <div
              className="border-t border-[color-mix(in_srgb,var(--ledger-rule)_42%,transparent)] pt-3 first:border-t-0 first:pt-0"
              key={section.title}
            >
              <p className="m-0 text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                {section.title}
              </p>
              <ul className="m-0 mt-1 grid list-none p-0">
                {section.items.map((item) => (
                  <li
                    className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2 py-1.5"
                    key={item}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-[1.125rem] place-items-center border border-[var(--ledger-ink)] bg-[var(--ledger-accent)] text-xs leading-none font-black text-[var(--ledger-ink)]"
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-5 font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : items ? (
        <ul className="m-0 mt-4 grid list-none p-0">
          {items.map((item) => (
            <li
              className="grid min-h-11 grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-3 border-t border-dashed border-[color-mix(in_srgb,var(--ledger-rule)_34%,transparent)] py-2.5 first:border-t-0"
              key={item}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-[1.125rem] place-items-center text-sm font-black text-[color-mix(in_srgb,var(--ledger-ink)_68%,transparent)]"
              >
                —
              </span>
              <span className="text-sm leading-5 font-semibold">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p
        className={cn(
          'm-0 mt-3 border-t pt-3 text-sm leading-5 font-black',
          connected
            ? 'border-[var(--ledger-ink)]'
            : 'border-dashed border-[color-mix(in_srgb,var(--ledger-rule)_52%,transparent)]',
        )}
      >
        {comparison.summary}
      </p>
    </section>
  )
}

function StageEvidence({
  active = true,
  background = false,
  stage,
}: {
  active?: boolean
  background?: boolean
  stage: JourneyStage
}) {
  return (
    <GardenSuiteJourneyEvidence
      active={active}
      artifact={stage.artifact}
      media={stage.media}
      variant={background ? 'background' : 'ledger'}
    />
  )
}

function JourneyStagePanel({
  active = true,
  compact = false,
  index,
  stage,
}: {
  active?: boolean
  compact?: boolean
  index: number
  stage: JourneyStage
}) {
  const palette = journeyPalettes[index]!
  const hasFullBleedEvidence = stage.media === 'consult' || stage.media === 'takeout'

  return (
    <div
      className={cn(
        'bg-[var(--ledger-paper)] text-[var(--ledger-ink)]',
        compact
          ? 'overflow-hidden border-0'
          : 'h-full min-h-0 overflow-hidden border border-[var(--ledger-rule)]',
      )}
      style={getPaletteStyle(palette)}
    >
      <BackgroundImageTexture
        className={cn(
          compact
            ? 'min-h-full [&>div:last-child]:min-h-full'
            : 'h-full min-h-0 [&>div:last-child]:h-full [&>div:last-child]:min-h-0',
        )}
        opacity={0.16}
        variant="inflicted"
      >
        <article
          aria-hidden={!active}
          className={cn(
            'grid xl:grid-cols-[minmax(180px,.55fr)_minmax(500px,1.7fr)_minmax(300px,.9fr)]',
            compact ? 'min-h-full' : 'h-full min-h-0',
          )}
        >
          <div
            className={cn(
              'flex flex-col justify-between bg-[var(--ledger-rail)] p-6 text-[var(--ledger-paper)]',
              compact && 'hidden',
            )}
          >
            <div>
              <p className="text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                Stage 0{index + 1}
              </p>
              <p className="mt-6 text-xl leading-tight font-black">{stage.operation}</p>
            </div>
            <div className="mt-12 border-t border-white/30 pt-4">
              <p className="text-xs tracking-[0.1em] uppercase opacity-75 [font-family:var(--font-oxanium),ui-monospace,monospace]">
                What this stage prepares
              </p>
              <p className="mt-2 text-base font-bold">{stage.artifact}</p>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden px-[clamp(24px,4vw,56px)] pt-[clamp(24px,4vw,56px)] pb-[clamp(14px,2vw,24px)]">
            <div className="grid gap-5 border-b-2 border-[var(--ledger-ink)] pb-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p
                  className={cn(
                    'text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]',
                    compact && 'hidden',
                  )}
                >
                  Your Garden Suite path / Stage 0{index + 1} of 04
                </p>
                <h3 className="mt-4 max-w-[15ch] text-[clamp(2.5rem,4.3vw,5.4rem)] leading-[0.9] font-black tracking-[-0.04em]">
                  {stage.title}
                </h3>
              </div>
              <p className="max-w-[30ch] text-base leading-relaxed font-semibold">{stage.short}</p>
            </div>

            <div
              className={cn(
                'grid flex-1 items-stretch gap-4 py-6 md:grid-cols-2',
                !compact && 'min-h-0 overflow-y-auto [scrollbar-gutter:stable]',
              )}
            >
              <JourneyComparisonPanel
                active={active}
                comparison={stage.without}
                connected={false}
              />
              <JourneyComparisonPanel active={active} comparison={stage.withFairlend} connected />
            </div>

            <div className="mt-auto grid gap-3 border-t-2 border-current/60 pt-3 sm:grid-cols-[minmax(0,1fr)_minmax(17rem,24rem)] sm:items-end">
              <p className="m-0 line-clamp-2 max-w-[42ch] text-sm leading-5 font-semibold">
                {stage.cta.body}
              </p>
              <BrutalistCtaButton
                asChild
                className="max-w-[24rem] !text-[var(--ledger-paper)] [--brutalist-cta-signal-hover:var(--ledger-accent)] [--brutalist-cta-signal:var(--ledger-accent)] [--brutalist-cta-surface-hover:var(--ledger-ink)] [--brutalist-cta-surface:var(--ledger-rail)] sm:justify-self-end"
                size="compact"
              >
                <Link
                  data-analytics-cta-id={stage.cta.id}
                  data-analytics-cta-location={`section-3-stage-${index + 1}`}
                  data-analytics-source="garden-suite-financing-gta"
                  href={stage.cta.href}
                  tabIndex={active ? 0 : -1}
                >
                  {stage.cta.label}
                </Link>
              </BrutalistCtaButton>
            </div>
          </div>

          <div
            className={cn(
              'relative grid content-between overflow-hidden border-t border-[var(--ledger-rule)] p-5 xl:border-t-0 xl:border-l',
              hasFullBleedEvidence
                ? 'min-h-[24rem] content-end bg-[var(--ledger-rail)] text-white xl:min-h-[34rem]'
                : 'bg-[var(--ledger-dock)]',
            )}
          >
            <StageEvidence active={active} background={hasFullBleedEvidence} stage={stage} />
          </div>
        </article>
      </BackgroundImageTexture>
    </div>
  )
}

export function GardenSuiteJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hasTrackedView = useRef(false)
  const [active, setActive] = useState(0)
  const activePalette = journeyPalettes[active]!

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const trackView = () => {
      if (hasTrackedView.current) return
      hasTrackedView.current = true
      trackFairlendEvent('garden_journey_view', {
        journey_type: 'homeowner_garden_suite',
        source: 'garden-suite-financing-gta',
      })
    }

    if (!('IntersectionObserver' in window)) {
      trackView()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        trackView()
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollSection = scrollRef.current
    const track = trackRef.current
    if (!scrollSection || !track) return

    const desktopLayout = window.matchMedia('(min-width: 1280px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const updateProgress = () => {
      animationFrame = 0

      if (!desktopLayout.matches || reducedMotion.matches) {
        track.style.transform = 'translate3d(0%, 0, 0)'
        setActive((current) => (current === 0 ? current : 0))
        return
      }

      const { chapterNavHeight, distance } = getJourneyScrollMetrics(scrollSection)
      const progress = Math.min(
        1,
        Math.max(0, (chapterNavHeight - scrollSection.getBoundingClientRect().top) / distance),
      )
      const nextStage = Math.round(progress * (journeyStages.length - 1))

      track.style.transform = `translate3d(${-progress * 75}%, 0, 0)`
      setActive((current) => (current === nextStage ? current : nextStage))
    }

    const requestProgressUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateProgress)
    }

    requestProgressUpdate()
    window.addEventListener('pageshow', requestProgressUpdate)
    window.addEventListener('resize', requestProgressUpdate)
    window.addEventListener('scroll', requestProgressUpdate, { passive: true })
    desktopLayout.addEventListener('change', requestProgressUpdate)
    reducedMotion.addEventListener('change', requestProgressUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pageshow', requestProgressUpdate)
      window.removeEventListener('resize', requestProgressUpdate)
      window.removeEventListener('scroll', requestProgressUpdate)
      desktopLayout.removeEventListener('change', requestProgressUpdate)
      reducedMotion.removeEventListener('change', requestProgressUpdate)
    }
  }, [])

  const selectStage = (index: number) => {
    const scrollSection = scrollRef.current
    if (!scrollSection) return

    const { chapterNavHeight, distance } = getJourneyScrollMetrics(scrollSection)
    const sectionTop = window.scrollY + scrollSection.getBoundingClientRect().top
    const progress = index / Math.max(1, journeyStages.length - 1)

    setActive(index)
    window.scrollTo({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      top: sectionTop - chapterNavHeight + distance * progress,
    })
  }

  return (
    <section
      aria-labelledby="garden-suite-journey-title"
      className="relative scroll-mt-[var(--gs-chapter-stack-height)] border-t-2 border-[var(--gs-ink)] bg-[var(--gs-paper)] pt-[clamp(76px,9vw,136px)] text-[var(--gs-ink)]"
      id="section-3"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-2px] h-2">
        <span className="absolute top-0 left-0 h-2 w-[clamp(84px,8vw,128px)] bg-[var(--gs-ink)]" />
        <span className="absolute top-0 left-[clamp(84px,8vw,128px)] h-2 w-8 bg-[var(--gs-lime)]" />
      </div>

      <header className="mx-auto w-full max-w-[1420px] px-[clamp(20px,4vw,56px)]">
        <p className="m-0 text-xs leading-[1.25] font-extrabold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
          HOW IT WORKS / FROM FIRST CALL TO FINAL MORTGAGE
        </p>
        <h2
          className="mt-[clamp(20px,3vw,36px)] max-w-[15ch] text-[clamp(2.45rem,5vw,4.65rem)] leading-[0.96] font-semibold tracking-[-0.035em] text-balance [font-family:var(--font-cormorant),Georgia,serif] max-[520px]:text-[clamp(2.3rem,12vw,3.15rem)]"
          id="garden-suite-journey-title"
        >
          How Garden Suite financing works
        </h2>
        <p className="mt-[26px] max-w-[64ch] text-[clamp(1rem,1.4vw,1.18rem)] leading-normal font-semibold">
          Follow the four stages from your first project conversation to construction draws and the
          final mortgage. At every stage, see what you would coordinate alone and what FairLend
          helps keep connected.
        </p>
      </header>

      <section
        aria-label="Garden Suite operations board"
        className="relative mt-[clamp(56px,7vw,104px)] bg-[var(--ledger-canvas)]"
        style={getPaletteStyle(activePalette)}
      >
        <div className="relative xl:motion-safe:h-[500vh]" ref={scrollRef}>
          <div className="grid gap-3 p-4 xl:hidden xl:motion-reduce:grid">
            {journeyStages.map((stage, index) => {
              const palette = journeyPalettes[index]!

              return (
                <details
                  className="group border border-[var(--ledger-rule)] bg-[var(--ledger-paper)] text-[var(--ledger-ink)]"
                  key={stage.title}
                  open={index === 0}
                  style={getPaletteStyle(palette)}
                >
                  <summary className="grid min-h-14 cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-[var(--ledger-rail)] px-4 py-3 text-[var(--ledger-paper)] [&::-webkit-details-marker]:hidden">
                    <span className="text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                      0{index + 1}
                    </span>
                    <span>
                      <strong className="block text-base leading-tight">{stage.operation}</strong>
                      <small className="mt-1 block text-xs leading-tight opacity-75">
                        {stage.artifact}
                      </small>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xl text-[var(--ledger-accent)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <div className="p-2">
                    <JourneyStagePanel compact index={index} stage={stage} />
                  </div>
                </details>
              )
            })}
          </div>

          <div className="sticky top-[var(--gs-chapter-stack-height)] hidden h-[calc(100svh-var(--gs-chapter-stack-height))] overflow-hidden xl:motion-safe:flex xl:motion-safe:flex-col">
            <ol
              aria-label="Garden Suite project stages"
              className="grid h-14 shrink-0 grid-cols-4 border-t border-[var(--ledger-rule)] bg-[var(--ledger-rail)] text-[var(--ledger-paper)]"
            >
              {journeyStages.map((stage, index) => (
                <li
                  className="min-w-0 border-r border-[var(--ledger-rule)] last:border-r-0"
                  key={stage.title}
                >
                  <button
                    aria-controls={`garden-suite-journey-panel-${index + 1}`}
                    aria-current={index === active ? 'step' : undefined}
                    className={cn(
                      'flex h-full w-full items-center gap-3 px-4 text-left text-xs leading-tight font-bold uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]',
                      index === active && 'bg-[var(--ledger-accent)] text-[var(--ledger-ink)]',
                    )}
                    id={`garden-suite-journey-tab-${index + 1}`}
                    onClick={() => selectStage(index)}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <span>{stage.operation}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div
                className="flex h-full w-[400%] will-change-transform"
                ref={trackRef}
                style={{ transform: 'translate3d(0%, 0, 0)' }}
              >
                {journeyStages.map((stage, index) => (
                  <div
                    aria-hidden={index !== active}
                    aria-labelledby={`garden-suite-journey-tab-${index + 1}`}
                    className="h-full min-h-0 w-1/4 shrink-0 overflow-hidden p-4 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--ledger-accent)]"
                    id={`garden-suite-journey-panel-${index + 1}`}
                    key={stage.title}
                    role="tabpanel"
                    tabIndex={index === active ? 0 : -1}
                  >
                    <JourneyStagePanel active={index === active} index={index} stage={stage} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="m-0 border-t border-[var(--ledger-rule)] bg-[var(--ledger-rail)] px-4 py-4 text-sm leading-relaxed font-semibold text-[var(--ledger-paper)]">
          FairLend coordinates the file. Municipal, lender, legal, appraisal, design, inspection and
          construction decisions remain subject to the responsible third parties and applicable
          approvals.
        </p>
      </section>

      <GardenSuiteSectionCta
        actionLabel="Tell FairLend where my project stands"
        body="Share where the property, permits, budget and financing stand. FairLend will use that context to identify the most useful next step."
        ctaId="garden-suite-map-project-stage"
        ctaLocation="section-3-project-path"
        heading="Find the next practical step for your Garden Suite"
        headingId="garden-suite-journey-cta-title"
        href="#garden-suite-assessment"
        label="YOUR NEXT STEP"
        tone="ink"
      />
    </section>
  )
}
