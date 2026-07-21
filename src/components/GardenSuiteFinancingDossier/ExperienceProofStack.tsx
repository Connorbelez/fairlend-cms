import type { ComponentType, SVGProps } from 'react'
import Image from 'next/image'

import { cn } from '@/utilities/ui'

const DEFAULT_CHROME_SRC =
  '/assets/garden-suite-financing-dossier/experience-proof-stack-chrome.webp'
const DEFAULT_BINDER_CLIP_SRC =
  '/assets/garden-suite-financing-dossier/project-assessment-binder-clip-v2.webp'
const DEFAULT_DESKTOP_COMPOSITE_SRC =
  '/assets/garden-suite-financing-dossier/experience-proof-reference-composite.png'

const PROOF_SLOT_POSITIONS = [
  { height: '19.2%', top: '13%' },
  { height: '18.5%', top: '36.5%' },
  { height: '18.5%', top: '56.5%' },
  { height: '19.2%', top: '76.4%' },
] as const

export type ExperienceProofItem = {
  /** Short proof point shown as the largest text on the card. */
  value: string
  /** Descriptor rendered below the value, for example “years mortgage”. */
  label: string
  /** Optional small qualifier rendered above the value, for example “up to”. */
  eyebrow?: string
  /** A compact line icon. Lucide icons work without an adapter. */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconClassName?: string
  /** @deprecated The generated chrome owns paper rotation. Retained for API compatibility. */
  rotation?: number
}

function ClockIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9.6" />
      <path d="M12 5.2v7.1l5.1 3" />
    </svg>
  )
}

function CraneIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 28 34"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 32h17M8 32V10m6 22V10M2 10h24M8 14l6 4-6 4 6 4-6 4M2 10l12-7 9 7M23 10v10m-2 0h4m-2 0v4" />
    </svg>
  )
}

function ScaleIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 28 30"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 3v24M6 7h16M14 5l-8 3-4 12m4-12 5 12M22 7l4 13m-4-13-5 13M1.5 20h9c-.6 4-2.1 6-4.5 6S2.1 24 1.5 20Zm16 0h9c-.6 4-2.1 6-4.5 6s-3.9-2-4.5-6ZM8 28h12" />
    </svg>
  )
}

function DocumentIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 30 36"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 2h13l7 8v24H5zM18 2v9h7M10 17h10M10 23h10M10 29h8" />
    </svg>
  )
}

export const gardenSuiteExperienceProofItems: readonly ExperienceProofItem[] = [
  {
    icon: ClockIcon,
    iconClassName: 'sm:relative! sm:top-[3px]! sm:left-[2px]! sm:h-[31px]! sm:w-[27px]!',
    label: 'years mortgage',
    rotation: -1.2,
    value: '28',
  },
  {
    icon: CraneIcon,
    iconClassName: 'sm:relative! sm:top-[2px]! sm:left-[2px]! sm:h-[34px]! sm:w-[27px]!',
    label: 'years construction',
    rotation: 1.1,
    value: '30',
  },
  {
    icon: ScaleIcon,
    iconClassName: 'sm:relative! sm:top-px! sm:left-px! sm:h-[29px]! sm:w-[25px]!',
    label: 'years legal',
    rotation: -0.8,
    value: '10+',
  },
  {
    eyebrow: 'up to',
    icon: DocumentIcon,
    iconClassName: 'sm:relative! sm:-top-[6px]! sm:left-[4px]! sm:h-[33px]! sm:w-[33px]!',
    label: 'draws',
    rotation: 0.65,
    value: '15',
  },
] as const

export type ExperienceProofStackProps = {
  /** Accessible name for the proof-point list. */
  ariaLabel?: string
  /** Transparent raster containing the blank paper slips and physical binder clip. */
  chromeSrc?: string
  className?: string
  items?: readonly ExperienceProofItem[]
  /** Hides or shows the complete clipped-paper chrome layer. */
  showBinderClip?: boolean
}

/**
 * A clipped stack of compact experience proof cards.
 *
 * The content is intentionally data-driven so the same dossier treatment can
 * be reused with different underwriting, construction, or advisory proof.
 */
export function ExperienceProofStack({
  ariaLabel = 'Garden suite financing experience',
  chromeSrc = DEFAULT_CHROME_SRC,
  className,
  items = gardenSuiteExperienceProofItems,
  showBinderClip = true,
}: ExperienceProofStackProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'relative z-0 isolate h-[338px] w-[144px] shrink-0 sm:h-[282px] sm:w-[120px]',
        className,
      )}
    >
      {showBinderClip ? (
        <>
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 size-full origin-left translate-x-px translate-y-[2px] scale-x-[0.9] select-none object-fill [clip-path:inset(0_0_64%_0)] min-[900px]:hidden!"
            draggable={false}
            fill
            sizes="(min-width: 640px) 120px, 144px"
            src={chromeSrc}
          />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 size-full origin-left translate-x-[3px] translate-y-[2px] scale-x-[0.92] select-none object-fill [clip-path:inset(32%_0_44%_0)] min-[900px]:hidden!"
            draggable={false}
            fill
            sizes="(min-width: 640px) 120px, 144px"
            src={chromeSrc}
          />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 size-full origin-left translate-x-[3px] translate-y-[11px] scale-x-[0.925] select-none object-fill [clip-path:inset(53%_0_22%_0)] min-[900px]:hidden!"
            draggable={false}
            fill
            sizes="(min-width: 640px) 120px, 144px"
            src={chromeSrc}
          />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 size-full origin-left translate-y-[5px] scale-x-[0.925] select-none object-fill [clip-path:inset(75%_0_4px_0)] min-[900px]:hidden!"
            draggable={false}
            fill
            sizes="(min-width: 640px) 120px, 144px"
            src={chromeSrc}
          />
        </>
      ) : null}

      {showBinderClip ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-[23%] z-[1] h-[18%] w-[42%] bg-[#f8f7f2] min-[900px]:hidden!"
          />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[-2px] left-[30%] z-40 h-[18.4%] w-[31.5%] select-none object-fill"
            draggable={false}
            height={50}
            src={DEFAULT_BINDER_CLIP_SRC}
            width={48}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[39px] left-[36px] z-[41] hidden h-[10px] w-[13px] bg-[#fbfaf6] min-[900px]:block!"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[39px] left-[61px] z-[41] hidden h-[10px] w-[13px] bg-[#fbfaf6] min-[900px]:block!"
          />
        </>
      ) : null}

      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[25px] left-[-4px] z-30 hidden h-[260px] w-[120px] select-none object-fill min-[900px]:block!"
        draggable={false}
        height={260}
        src={DEFAULT_DESKTOP_COMPOSITE_SRC}
        unoptimized
        width={120}
      />

      <ol className="absolute inset-0 z-10 list-none p-0">
        {items.map((item, index) => {
          const Icon = item.icon
          const slot = PROOF_SLOT_POSITIONS[index] ?? PROOF_SLOT_POSITIONS.at(-1)!

          return (
            <li
              className="absolute left-[15%] right-[4%] flex items-center gap-1.5 text-neutral-950 sm:gap-[10px]"
              key={`${item.value}-${item.label}`}
              style={{ height: slot.height, top: slot.top }}
            >
              <div
                aria-hidden="true"
                className="flex w-8 shrink-0 items-center justify-center sm:w-6"
              >
                <Icon
                  className={cn(
                    'h-6 w-6 max-w-none! shrink-0 stroke-[1] sm:size-[22px]',
                    item.iconClassName,
                  )}
                />
              </div>

              <div className="flex min-w-0 flex-col font-sans leading-none sm:relative sm:left-px sm:w-[45px]">
                {item.eyebrow ? (
                  <span className="mb-px text-[10px] font-normal tracking-[0.04em] sm:text-[9px]">
                    {item.eyebrow}
                  </span>
                ) : null}
                <span className="inline-block origin-left font-[family-name:var(--font-cormorant)] text-[26px] font-normal tracking-[-0.04em] sm:scale-x-[0.92] sm:text-[24px]">
                  {item.value}
                </span>
                <span
                  className={cn(
                    'mt-px max-w-[45px] origin-left text-[10px] font-normal leading-[1.05] tracking-[-0.02em] sm:text-[9px]',
                    item.label === 'years construction' && 'scale-x-[0.75]',
                  )}
                >
                  {item.label.startsWith('years ') ? (
                    <>
                      years
                      <br />
                      {item.label.slice(6)}
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
