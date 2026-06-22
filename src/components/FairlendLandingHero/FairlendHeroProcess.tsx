import type { CSSProperties } from 'react'
import { ClipboardCheck, Construction, KeyRound, MapPinned, type LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

export type FairlendHeroProcessStep = {
  label: string
  number: string
  step: 'permit' | 'acquisition' | 'construction' | 'completion'
}

const processDetails = {
  acquisition: {
    description: 'Find the right opportunity',
    icon: ClipboardCheck,
  },
  completion: {
    description: 'Close & transition to long-term success',
    icon: KeyRound,
  },
  construction: {
    description: 'Finance your build and manage risk',
    icon: Construction,
  },
  permit: {
    description: 'From planning to approval',
    icon: MapPinned,
  },
} satisfies Record<FairlendHeroProcessStep['step'], { description: string; icon: LucideIcon }>

const desktopRouteAnchors = {
  acquisition: {
    leaderHeight: 'clamp(98px,11.8svh,132px)',
    x: 41.92,
    y: 37.29,
  },
  completion: {
    leaderHeight: 'clamp(178px,25svh,286px)',
    x: 86.6,
    y: 56.26,
  },
  construction: {
    leaderHeight: 'clamp(118px,15.2svh,168px)',
    x: 59.25,
    y: 40.06,
  },
  permit: {
    leaderHeight: 'clamp(84px,10.2svh,120px)',
    x: 22.1,
    y: 35.54,
  },
} satisfies Record<
  FairlendHeroProcessStep['step'],
  {
    leaderHeight: string
    x: number
    y: number
  }
>

const mobileRouteAnchors = {
  acquisition: {
    cardX: 43.5,
    cardY: 12,
    lineBendY: 43.2,
    lineStartY: 19.8,
    shortDescription: 'Find the site',
    x: 31.03,
    y: 47.67,
  },
  completion: {
    cardX: 72.5,
    cardY: 22,
    lineBendY: 56,
    lineStartY: 29.8,
    shortDescription: 'Close cleanly',
    x: 80.02,
    y: 60.47,
  },
  construction: {
    cardX: 58.5,
    cardY: 17,
    lineBendY: 44.8,
    lineStartY: 24.8,
    shortDescription: 'Finance build',
    x: 49.95,
    y: 49.1,
  },
  permit: {
    cardX: 27,
    cardY: 7,
    lineBendY: 43.7,
    lineStartY: 15.4,
    shortDescription: 'Plan approval',
    x: 13.3,
    y: 50.18,
  },
} satisfies Record<
  FairlendHeroProcessStep['step'],
  {
    cardX: number
    cardY: number
    lineBendY: number
    lineStartY: number
    shortDescription: string
    x: number
    y: number
  }
>

const mobileCardHalfWidth = 19.5
const mobileCardWidth = mobileCardHalfWidth * 2

function getMobileCardGlowX({
  cardX,
  x,
}: (typeof mobileRouteAnchors)[FairlendHeroProcessStep['step']]) {
  return Math.max(14, Math.min(86, 50 + ((x - cardX) / mobileCardWidth) * 100))
}

function getMobileLeaderPath({
  cardX,
  lineBendY,
  lineStartY,
  x,
  y,
}: (typeof mobileRouteAnchors)[FairlendHeroProcessStep['step']]) {
  const routePointSitsUnderCard = Math.abs(cardX - x) <= mobileCardHalfWidth

  return {
    d: routePointSitsUnderCard
      ? `M ${x} ${lineStartY} V ${y}`
      : `M ${cardX} ${lineStartY} V ${lineBendY} H ${x} V ${y}`,
    type: routePointSitsUnderCard ? 'straight' : 'staggered',
  }
}

function MobileRouteProcessLayer({ steps }: { steps: readonly FairlendHeroProcessStep[] }) {
  const sortedSteps = [...steps].sort((a, b) => Number(a.number) - Number(b.number))

  return (
    <div
      aria-label="Fairlend mobile project process"
      className="pointer-events-none absolute inset-0 z-[6] hidden hero-max-1279:block"
      data-testid="hero-mobile-process-bar"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {sortedSteps.map(({ step }, index) => {
          const anchor = mobileRouteAnchors[step]
          const leader = getMobileLeaderPath(anchor)

          return (
            <path
              className="opacity-0 [vector-effect:non-scaling-stroke] motion-safe:animate-[leaderGrowSvg_900ms_var(--hero-ease-out)_calc(500ms+var(--leader-stagger)*160ms)_forwards,leaderPulse_2200ms_ease-in-out_calc(500ms+var(--leader-stagger)*160ms+900ms)_infinite]"
              d={leader.d}
              data-mobile-route-leader-step={step}
              data-mobile-route-leader-type={leader.type}
              data-testid="hero-mobile-route-leader"
              key={`${step}-leader`}
              pathLength="1"
              stroke="var(--fairlend-orange)"
              strokeDasharray="1"
              strokeDashoffset="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.45"
              style={{ '--leader-stagger': index } as CSSProperties}
            />
          )
        })}
      </svg>

      {sortedSteps.map(({ step }) => {
        const anchor = mobileRouteAnchors[step]

        return (
          <span
            aria-hidden="true"
            className="absolute grid size-[24px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--fairlend-orange)] shadow-[0_4px_10px_rgb(255_58_25/24%),0_0_0_3px_rgb(255_255_255/86%)]"
            data-mobile-route-anchor-x={anchor.x}
            data-mobile-route-anchor-y={anchor.y}
            data-mobile-route-step={step}
            data-testid="hero-mobile-route-marker"
            key={`${step}-marker`}
            style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
          >
            <span className="block size-[12px] rounded-full border-[2.5px] border-white bg-[var(--fairlend-orange)]" />
          </span>
        )
      })}

      {sortedSteps.map(({ label, number, step }, index) => {
        const anchor = mobileRouteAnchors[step]

        return (
          <Card
            aria-hidden="true"
            className="absolute isolate min-h-[clamp(62px,17vw,74px)] w-[clamp(140px,39vw,168px)] -translate-x-1/2 origin-bottom scale-95 overflow-hidden rounded-[15px] border border-[rgb(255_255_255/82%)] bg-[rgb(255_253_249/99%)] py-[9px] pr-[10px] pl-[47px] text-[#07191f] opacity-0 shadow-[0_18px_30px_rgb(62_40_23/16%),0_5px_11px_rgb(62_40_23/8%),inset_0_1px_0_rgb(255_255_255/94%)] [border-bottom-color:rgb(255_92_52/16%)] backdrop-blur-[12px] motion-safe:animate-[routeCardGrow_700ms_var(--hero-ease-out)_calc(900ms+var(--card-stagger)*160ms)_forwards] hero-tablet:min-h-[clamp(60px,6vw,72px)] hero-tablet:w-[clamp(132px,16vw,176px)]"
            data-mobile-process-step={step}
            data-testid="hero-mobile-process-segment"
            key={`${step}-card`}
            style={
              {
                '--card-stagger': index,
                '--mobile-card-glow-x': `${getMobileCardGlowX(anchor)}%`,
                left: `${anchor.cardX}%`,
                top: `${anchor.cardY}%`,
              } as CSSProperties
            }
          >
            <span
              aria-hidden="true"
              className="hidden"
            />
            <span
              aria-hidden="true"
              className="hidden"
            />
            <span
              aria-hidden="true"
              className="hidden"
            />
            <span className="absolute top-[9px] left-[9px] z-10 grid size-[29px] place-items-center rounded-full bg-[var(--fairlend-orange)] text-[13px] font-extrabold leading-none text-[var(--fairlend-panel)] shadow-[0_7px_14px_rgb(255_58_25/20%),inset_0_1px_0_rgb(255_255_255/36%)]">
              {number}
            </span>
            <h3 className="relative z-10 m-0 min-w-0 font-sans text-[clamp(12px,3.28vw,14px)] leading-[1.05] font-extrabold whitespace-nowrap text-[#07191f] hero-tablet:text-[clamp(12px,1.2vw,14px)]">
              {label}
            </h3>
            <p className="relative z-10 mt-[7px] mb-0 font-sans text-[clamp(9.5px,2.55vw,11px)] leading-[1.08] font-semibold whitespace-nowrap text-[#36515a] hero-tablet:text-[clamp(9.5px,0.95vw,11px)]">
              {anchor.shortDescription}
            </p>
          </Card>
        )
      })}
    </div>
  )
}

function DesktopProcessCard({ label, number, step, index }: FairlendHeroProcessStep & { index: number }) {
  const { description, icon: Icon } = processDetails[step]
  const anchor = desktopRouteAnchors[step]

  return (
    <div
      className="absolute z-[6] hidden size-0 hero-landscape:block"
      data-process-step={step}
      style={
        {
          '--route-leader-delay': `${600 + index * 180}ms`,
          '--route-leader-height': anchor.leaderHeight,
          left: `${anchor.x}%`,
          top: `${anchor.y}%`,
        } as CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className="absolute bottom-[13px] left-0 h-[var(--route-leader-height)] w-[3px] origin-bottom -translate-x-1/2 scale-y-0 rounded-full bg-[var(--fairlend-orange)] shadow-[0_0_0_1px_rgb(255_246_236/82%),0_8px_18px_rgb(255_58_25/20%)] motion-safe:animate-[routeLeaderGrow_900ms_var(--hero-ease-out)_var(--route-leader-delay)_forwards,leaderPulse_2200ms_ease-in-out_calc(var(--route-leader-delay)+900ms)_infinite]"
      />

      <span
        aria-hidden="true"
        className="absolute top-0 left-0 grid size-[28px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--fairlend-orange)] shadow-[0_4px_12px_rgb(255_58_25/24%),0_0_0_3px_rgb(255_255_255/86%)]"
        data-route-anchor-x={anchor.x}
        data-route-anchor-y={anchor.y}
        data-route-step={step}
        data-testid="hero-route-marker"
      >
        <span className="block size-[15px] rounded-full border-[3px] border-white bg-[var(--fairlend-orange)]" />
      </span>

      <Card
        className="absolute bottom-[calc(var(--route-leader-height)+13px)] left-0 min-h-[clamp(98px,6.8vw,118px)] w-[clamp(132px,10.6vw,178px)] -translate-x-1/2 origin-bottom scale-95 overflow-visible rounded-[14px] border border-[rgb(255_255_255/80%)] bg-[rgb(255_248_241/90%)] p-0 text-[#07191f] opacity-0 shadow-[0_17px_34px_rgb(89_61_39/13%),0_5px_12px_rgb(89_61_39/9%),inset_0_1px_0_rgb(255_255_255/88%)] backdrop-blur-[10px] motion-safe:animate-[routeCardGrow_700ms_var(--hero-ease-out)_calc(var(--route-leader-delay)+650ms)_forwards]"
        data-process-step={step}
        data-testid="hero-process-segment"
      >
        <span
          aria-hidden="true"
          className="hidden"
        />
        <div className="grid min-h-[inherit] grid-cols-[30px_minmax(0,1fr)] gap-x-[7px] px-[10px] py-[13px]">
          <div className="flex flex-col items-center gap-[8px]">
            <span className="grid size-[27px] place-items-center rounded-full bg-[var(--fairlend-orange)] text-[16px] font-extrabold leading-none text-white shadow-[0_8px_16px_rgb(255_58_25/20%),inset_0_1px_0_rgb(255_255_255/36%)]">
              {number}
            </span>
            <Icon
              aria-hidden="true"
              className="size-[25px] text-[var(--fairlend-orange)]"
              strokeWidth={2}
            />
          </div>
          <div className="pt-[8px]">
            <h3 className="m-0 font-sans text-[clamp(15px,1.08vw,20px)] leading-[1.04] font-extrabold tracking-normal text-[#07191f]">
              {label}
            </h3>
            <p className="mt-[8px] mb-0 max-w-[122px] text-[clamp(11px,0.7vw,13px)] leading-[1.14] font-medium text-[#112a35]">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function FairlendHeroProcess({
  mobileRouteOnly = false,
  mobileOnly = false,
  steps,
}: {
  desktopOnly?: boolean
  mobileRouteOnly?: boolean
  mobileOnly?: boolean
  steps: readonly FairlendHeroProcessStep[]
}) {
  const sortedSteps = [...steps].sort((a, b) => Number(a.number) - Number(b.number))

  return (
    <>
      {!mobileOnly && !mobileRouteOnly ? (
        <div
          aria-label="Fairlend project process"
          className="pointer-events-none absolute inset-0 z-[6] hidden overflow-visible hero-landscape:block"
          data-testid="hero-process-bar"
        >
          {sortedSteps.map((step, index) => (
            <DesktopProcessCard key={step.number} index={index} {...step} />
          ))}
        </div>
      ) : null}
      {mobileRouteOnly ? <MobileRouteProcessLayer steps={sortedSteps} /> : null}
    </>
  )
}
