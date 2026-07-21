import type { CSSProperties, HTMLAttributes } from 'react'
import type { ImageProps } from 'next/image'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/utilities/ui'

export type DrawflowMilestoneStatus = 'upcoming' | 'active' | 'completed'

export interface DrawflowPoint {
  /** Horizontal position within the desktop blueprint overlay, as a percentage. */
  x: number
  /** Vertical position within the desktop blueprint overlay, as a percentage. */
  y: number
}

export interface DrawflowMilestone {
  id: string
  drawLabel: string
  title: string
  status?: DrawflowMilestoneStatus
  point?: DrawflowPoint
  /** Positions the live label independently of its route point when artwork needs clearance. */
  labelPoint?: DrawflowPoint
  /** Optional bend points between the preceding milestone and this milestone. */
  routeVia?: readonly DrawflowPoint[]
}

export interface DrawflowMilestoneOverlayProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  blueprintSrc: ImageProps['src']
  desktopCompositeSrc?: ImageProps['src']
  blueprintAlt: string
  eyebrow: string
  description: string
  milestones: readonly DrawflowMilestone[]
  activeMilestoneId?: string
  completedMilestoneIds?: readonly string[]
  progressLabel?: string
  imagePriority?: boolean
}

const defaultMilestones: readonly DrawflowMilestone[] = [
  {
    id: 'site-prep',
    drawLabel: 'Draw 1',
    title: 'Permits & Site Prep',
    status: 'completed',
    point: { x: 35, y: 72 },
    labelPoint: { x: 27.3, y: 67 },
  },
  {
    id: 'foundation',
    drawLabel: 'Draw 2',
    title: 'Foundation',
    status: 'completed',
    point: { x: 45, y: 55 },
    labelPoint: { x: 39, y: 44 },
  },
  {
    id: 'framing',
    drawLabel: 'Draw 3',
    title: 'Framing',
    status: 'completed',
    point: { x: 53, y: 37 },
    labelPoint: { x: 53, y: 20 },
    routeVia: [{ x: 46, y: 37 }],
  },
  {
    id: 'lock-up',
    drawLabel: 'Draw 4',
    title: 'Lock-Up',
    status: 'completed',
    point: { x: 71, y: 37 },
    labelPoint: { x: 72, y: 20 },
  },
  {
    id: 'interior',
    drawLabel: 'Draw 5',
    title: 'Interior',
    status: 'upcoming',
    point: { x: 76, y: 56 },
    labelPoint: { x: 76, y: 68 },
  },
  {
    id: 'complete',
    drawLabel: 'Draw 6',
    title: 'Complete',
    status: 'active',
    point: { x: 87.5, y: 74 },
    labelPoint: { x: 87.5, y: 79 },
  },
]

export const defaultDrawflowContent = {
  eyebrow: 'Drawflow+',
  description:
    'Funds released as work progresses—nothing sits idle, nothing gets ahead of the build.',
  milestones: defaultMilestones,
  progressLabel: 'Construction funding progress',
} satisfies Pick<
  DrawflowMilestoneOverlayProps,
  'eyebrow' | 'description' | 'milestones' | 'progressLabel'
>

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))

function getDefaultPoint(index: number, count: number): DrawflowPoint {
  if (count <= 1) return { x: 60, y: 54 }

  return {
    x: 28 + (index / (count - 1)) * 64,
    y: index % 2 === 0 ? 58 : 43,
  }
}

function getStatus(
  milestone: DrawflowMilestone,
  activeMilestoneId: string | undefined,
  completedMilestoneIds: ReadonlySet<string>,
  stateIsControlled: boolean,
): DrawflowMilestoneStatus {
  if (milestone.id === activeMilestoneId) return 'active'
  if (completedMilestoneIds.has(milestone.id)) return 'completed'
  if (stateIsControlled) return 'upcoming'
  return milestone.status ?? 'upcoming'
}

export function DrawflowMilestoneOverlay({
  blueprintSrc,
  blueprintAlt,
  desktopCompositeSrc,
  eyebrow,
  description,
  milestones,
  activeMilestoneId,
  completedMilestoneIds,
  progressLabel = 'Construction funding progress',
  imagePriority = false,
  className,
  ...props
}: DrawflowMilestoneOverlayProps) {
  const completedIds = new Set(completedMilestoneIds ?? [])
  const stateIsControlled = activeMilestoneId !== undefined || completedMilestoneIds !== undefined
  const resolvedMilestones = milestones.map((milestone, index) => ({
    ...milestone,
    point: milestone.point ?? getDefaultPoint(index, milestones.length),
    status: getStatus(milestone, activeMilestoneId, completedIds, stateIsControlled),
  }))
  const reachedCount = resolvedMilestones.filter(
    ({ status }) => status === 'completed' || status === 'active',
  ).length
  const progressValue = milestones.length === 0 ? 0 : (reachedCount / milestones.length) * 100

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border border-[#6a9bc1]/55 bg-[#032c4c] text-white',
        className,
      )}
      {...props}
    >
      <div className="relative min-h-[17rem] min-[900px]:aspect-[181/63]! min-[900px]:min-h-0!">
        <Image
          src={blueprintSrc}
          alt={blueprintAlt}
          fill
          priority={imagePriority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center opacity-90"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(2_33_58/0.92)_0%,rgb(2_33_58/0.74)_26%,rgb(2_33_58/0.12)_64%,rgb(2_33_58/0.3)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(116_190_232/0.22)_1px,transparent_1px),linear-gradient(90deg,rgb(116_190_232/0.22)_1px,transparent_1px)] [background-size:18px_18px]"
        />

        <div className="relative z-10 max-w-[15rem] px-4 pt-4 sm:px-5 sm:pt-5 min-[900px]:w-[28%]! min-[900px]:max-w-none! min-[900px]:-translate-y-[10px]! min-[900px]:px-3! min-[900px]:pt-3!">
          <p className="m-0 font-[family-name:var(--font-oxanium)] text-[11px] leading-none font-black tracking-[0.08em] text-[#a9ff00] uppercase min-[900px]:relative! min-[900px]:left-[3px]! min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[0.855]! min-[900px]:scale-y-[1.333]! min-[900px]:text-[8px]!">
            {eyebrow}
          </p>
          <p className="mt-2 mb-0 text-sm leading-[1.45] font-medium text-white/95 min-[900px]:relative! min-[900px]:-top-[5px]! min-[900px]:left-[4px]! min-[900px]:mt-1! min-[900px]:w-[78px]! min-[900px]:origin-left! min-[900px]:scale-x-[1.08]! min-[900px]:font-[family-name:var(--font-league-gothic)]! min-[900px]:text-[10px]! min-[900px]:leading-[1]! min-[900px]:font-normal!">
            <span className="min-[900px]:hidden">{description}</span>
            <span aria-hidden="true" className="hidden min-[900px]:inline!">
              Funds released as work
              <br />
              progresses—nothing sits
              <br />
              idle, nothing gets ahead
              <br />
              of the build.
            </span>
          </p>
        </div>

        <div aria-hidden="true" className="absolute inset-0 hidden min-[900px]:block!">
          <svg
            className="absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {resolvedMilestones.slice(0, -1).map((milestone, index) => {
              const next = resolvedMilestones[index + 1]
              const routePoints = [milestone.point, ...(next.routeVia ?? []), next.point]

              return (
                <polyline
                  key={`${milestone.id}-${next.id}`}
                  fill="none"
                  points={routePoints
                    .map(({ x, y }) => `${clampPercentage(x)},${clampPercentage(y)}`)
                    .join(' ')}
                  stroke="rgba(255,255,255,0.82)"
                  strokeWidth="1.4"
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>

          {resolvedMilestones.map((milestone, index) => {
            const labelPoint = milestone.labelPoint ?? {
              x: milestone.point.x,
              y: milestone.point.y + (index % 2 === 0 ? 13 : -13),
            }
            const isReached = milestone.status !== 'upcoming'
            const isActive = milestone.status === 'active'
            const position = {
              '--drawflow-x': `${clampPercentage(milestone.point.x)}%`,
              '--drawflow-y': `${clampPercentage(milestone.point.y)}%`,
              '--drawflow-label-x': `${clampPercentage(labelPoint.x)}%`,
              '--drawflow-label-y': `${clampPercentage(labelPoint.y)}%`,
            } as CSSProperties

            return (
              <div key={milestone.id} style={position}>
                <span
                  className={cn(
                    'absolute left-[var(--drawflow-x)] top-[var(--drawflow-y)] z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border min-[900px]:size-1.5!',
                    index === 0 && 'z-30',
                    isReached
                      ? 'border-[#a9ff00] bg-[#a9ff00] shadow-[0_0_0_2px_rgb(3_44_76/0.9)]'
                      : 'border-white bg-[#032c4c]',
                  )}
                />
                <Badge
                  variant="outline"
                  className={cn(
                    'absolute left-[var(--drawflow-label-x)] top-[var(--drawflow-label-y)] z-20 min-w-max -translate-x-1/2 -translate-y-1/2 rounded-none px-1.5 py-1 font-[family-name:var(--font-league-gothic)] text-[11px] leading-[1.1] font-normal tracking-[0.035em] uppercase shadow-none min-[900px]:px-1! min-[900px]:py-0.5! min-[900px]:text-[7px]!',
                    index === 0 && 'min-[900px]:w-[45px]! min-[900px]:min-w-0! min-[900px]:px-0.5!',
                    isActive
                      ? 'border-[#a9ff00] bg-[#a9ff00] text-[#03233d] min-[900px]:min-h-[34px]! min-[900px]:min-w-[48px]! min-[900px]:px-2! min-[900px]:py-1! min-[900px]:text-[10px]!'
                      : 'border-white/80 bg-[#032c4c]/90 text-white',
                  )}
                >
                  <span className="flex flex-col gap-0.5 min-[900px]:gap-px!">
                    <span>{milestone.drawLabel}</span>
                    <span className="normal-case">{milestone.title}</span>
                  </span>
                </Badge>
              </div>
            )
          })}
        </div>
      </div>

      {desktopCompositeSrc ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-1px] left-0 z-50 hidden h-[124px] w-[361px] min-[900px]:block!"
        >
          <Image
            alt=""
            className="select-none object-fill"
            draggable={false}
            fill
            sizes="361px"
            src={desktopCompositeSrc}
            unoptimized
          />
        </span>
      ) : null}

      <ol className="relative z-20 m-0 grid w-full min-w-0 list-none gap-0 overflow-hidden border-t border-[#6a9bc1]/55 bg-[#032c4c]/95 p-0 min-[900px]:sr-only!">
        {resolvedMilestones.map((milestone, index) => (
          <li
            key={milestone.id}
            aria-current={milestone.status === 'active' ? 'step' : undefined}
            className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-1 border-b border-[#6a9bc1]/30 px-4 py-3 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className={cn(
                'row-span-2 grid size-7 place-items-center border font-[family-name:var(--font-oxanium)] text-[11px] font-black',
                milestone.status === 'upcoming'
                  ? 'border-white/55 text-white/70'
                  : 'border-[#a9ff00] bg-[#a9ff00] text-[#03233d]',
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-[family-name:var(--font-oxanium)] text-[11px] font-bold tracking-[0.08em] text-white/65 uppercase">
                {milestone.drawLabel}
              </span>
              <span className="mt-0.5 block min-w-0 break-words text-sm font-semibold">
                {milestone.title}
              </span>
            </span>
            <span className="col-start-2 min-w-0 justify-self-start break-words font-[family-name:var(--font-oxanium)] text-[11px] leading-none font-bold tracking-[0.05em] text-white/70 uppercase">
              {milestone.status}
            </span>
          </li>
        ))}
      </ol>

      <div className="relative z-20 w-full min-w-0 overflow-hidden border-t border-[#6a9bc1]/55 bg-[#032c4c] px-4 py-3 min-[900px]:sr-only!">
        <div className="mb-2 flex min-w-0 items-start justify-between gap-3 font-[family-name:var(--font-oxanium)] text-[11px] font-bold tracking-[0.06em] uppercase">
          <span className="min-w-0 break-words">{progressLabel}</span>
          <span className="shrink-0">{Math.round(progressValue)}%</span>
        </div>
        <Progress
          value={progressValue}
          aria-label={progressLabel}
          className="h-1.5 min-w-0 rounded-none bg-white/20 [&>div]:bg-[#a9ff00]"
        />
      </div>
    </section>
  )
}

export default DrawflowMilestoneOverlay
