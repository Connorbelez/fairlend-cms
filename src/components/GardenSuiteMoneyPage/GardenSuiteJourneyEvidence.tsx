import Image from 'next/image'

import { cn } from '@/utilities/ui'

export type GardenSuiteJourneyMedia = 'consult' | 'permit' | 'drawflow' | 'takeout'

const standardStageImages: Record<
  Exclude<GardenSuiteJourneyMedia, 'permit' | 'drawflow'>,
  string
> = {
  consult: '/assets/garden-suite/journey/initial-consult-v2.png',
  takeout: '/assets/garden-suite/journey/completion-takeout-v2.png',
}

const permitSheets = [
  {
    label: 'Package cover',
    src: '/assets/garden-suite/permits/pre-approved-plan-01.webp',
  },
  {
    label: 'Site plan',
    src: '/assets/garden-suite/permits/pre-approved-plan-02.webp',
  },
  {
    label: 'Ground-floor plan',
    src: '/assets/garden-suite/permits/pre-approved-plan-04.webp',
  },
  {
    label: 'Second-floor plan',
    src: '/assets/garden-suite/permits/pre-approved-plan-05.webp',
  },
  {
    label: 'Building elevations',
    src: '/assets/garden-suite/permits/pre-approved-plan-07.webp',
  },
  {
    label: 'Construction specifications',
    src: '/assets/garden-suite/permits/pre-approved-plan-10.webp',
  },
] as const

const drawFlowCaptures = [
  {
    alt: 'DrawFlow mobile evidence-visit screen showing the project site-location record',
    label: 'Site-location record',
    src: '/assets/garden-suite/journey/drawflow-site-location.png',
  },
  {
    alt: 'DrawFlow mobile evidence-visit screen showing framing and rough-in milestone scope',
    label: 'Milestone visit scope',
    src: '/assets/garden-suite/journey/drawflow-visit-scope.png',
  },
] as const

type GardenSuiteJourneyEvidenceProps = {
  active?: boolean
  artifact: string
  media: GardenSuiteJourneyMedia
  variant?: 'background' | 'ledger' | 'standard'
}

export function GardenSuiteJourneyEvidence({
  active = true,
  artifact,
  media,
  variant = 'ledger',
}: GardenSuiteJourneyEvidenceProps) {
  const frameClassName = cn(
    'relative min-h-[280px] overflow-hidden',
    variant === 'background'
      ? 'absolute inset-0 h-full min-h-0 text-white'
      : variant === 'ledger'
        ? 'bg-[var(--ledger-soft)] text-[var(--ledger-ink)]'
        : 'border-2 border-current bg-[#071522] text-[#fffdf9]',
  )

  if (media === 'permit') {
    return (
      <figure className={frameClassName}>
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                City of Toronto / pre-approved plan package
              </p>
              <p className="mt-1 text-base font-bold">Two-bedroom laneway housing</p>
            </div>
            <span className="shrink-0 border border-current px-2 py-1 text-[0.6875rem] font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
              6 of 16 sheets
            </span>
          </div>

          <div
            aria-label="Selected sheets from the City of Toronto pre-approved laneway housing plan package"
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--ledger-accent)]"
            role="region"
            tabIndex={active ? 0 : -1}
          >
            {permitSheets.map((sheet, index) => (
              <div
                className="w-[88%] shrink-0 snap-center border border-current/35 bg-white p-2 shadow-[5px_5px_0_color-mix(in_srgb,currentColor_18%,transparent)]"
                key={sheet.src}
              >
                <div className="relative aspect-[1224/792] overflow-hidden bg-white">
                  <Image
                    alt={`City of Toronto pre-approved laneway housing plan: ${sheet.label}`}
                    className="object-contain"
                    fill
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 82vw, 28vw"
                    src={sheet.src}
                  />
                </div>
                <p className="mb-0 mt-2 text-[0.6875rem] font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                  {String(index + 1).padStart(2, '0')} / {sheet.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/30 pt-3">
            <figcaption className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
              Original City reference package — sheets are not altered
            </figcaption>
            <a
              className="text-sm font-black underline underline-offset-4"
              href="/assets/garden-suite/permits/city-toronto-pre-approved-laneway-plan.pdf"
              rel="noreferrer"
              tabIndex={active ? 0 : -1}
              target="_blank"
            >
              Open all 16 sheets
            </a>
          </div>
        </div>
      </figure>
    )
  }

  if (media === 'drawflow') {
    return (
      <figure className={cn(frameClassName, 'bg-[#dce9f2] text-[#102b43]')}>
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative p-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                DrawFlow / evidence visit
              </p>
              <p className="mt-1 text-base font-bold">Real project-monitoring screens</p>
            </div>
            <span className="text-[0.6875rem] font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
              02 captures
            </span>
          </div>

          <div
            aria-label="DrawFlow evidence visit captures"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--ledger-accent)]"
            role="region"
            tabIndex={active ? 0 : -1}
          >
            {drawFlowCaptures.map((capture) => (
              <div className="w-[62%] max-w-[220px] shrink-0 snap-center" key={capture.src}>
                <div className="relative aspect-[1260/2622] overflow-hidden">
                  <Image
                    alt={capture.alt}
                    className="object-contain"
                    fill
                    sizes="220px"
                    src={capture.src}
                  />
                </div>
                <p className="mb-0 mt-2 text-[0.6875rem] font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
                  {capture.label}
                </p>
              </div>
            ))}
          </div>

          <figcaption className="border-t border-current/30 pt-3 text-[0.6875rem] font-bold tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
            {artifact}
          </figcaption>
        </div>
      </figure>
    )
  }

  return (
    <figure className={cn(frameClassName, 'bg-[var(--ledger-rail)] text-white')}>
      <Image
        alt=""
        className="object-cover grayscale contrast-[1.08] sepia-[0.12]"
        fill
        sizes="(max-width: 1024px) 100vw, 30vw"
        src={standardStageImages[media]}
      />
      <div
        className={cn(
          'absolute inset-0',
          variant === 'background'
            ? 'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--ledger-rail)_84%,transparent)_0%,color-mix(in_srgb,var(--ledger-rail)_18%,transparent)_36%,color-mix(in_srgb,var(--ledger-rail)_28%,transparent)_62%,color-mix(in_srgb,var(--ledger-rail)_96%,transparent)_100%)]'
            : 'bg-gradient-to-t from-[var(--ledger-rail)] via-transparent to-transparent',
        )}
      />
      <figcaption
        className={cn(
          'absolute z-10 flex items-end justify-between gap-4 border-white/30 bg-[color-mix(in_srgb,var(--ledger-rail)_90%,transparent)] p-4',
          variant === 'background'
            ? 'top-5 right-5 left-5 border backdrop-blur-sm'
            : 'right-0 bottom-0 left-0 border-t',
        )}
      >
        <span className="text-xs font-black tracking-[0.1em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
          Evidence dock
        </span>
        <strong className="text-right text-base">{artifact}</strong>
      </figcaption>
    </figure>
  )
}
