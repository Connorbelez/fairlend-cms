import type { HTMLAttributes, ReactNode } from 'react'

import { BackgroundImageTexture, type TextureVariant } from '@/components/ui/bg-image-texture'
import { cn } from '@/utilities/ui'

export type DossierTone = 'paper' | 'blueprint' | 'forest' | 'ink' | 'lime'

interface DossierChapterProps extends HTMLAttributes<HTMLElement> {
  chapter: string
  children: ReactNode
  description: string
  label: string
  tone?: DossierTone
}

interface CopySectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  file: string
  heading: string
  headingAs?: 'h2' | 'h3'
  intro?: ReactNode
}

export function DossierChapter({
  chapter,
  children,
  className,
  description,
  label,
  tone = 'paper',
  ...props
}: DossierChapterProps) {
  const textureByTone: Record<DossierTone, TextureVariant> = {
    blueprint: 'fabric-of-squares',
    forest: 'inflicted',
    ink: 'grid-noise',
    lime: 'groovepaper',
    paper: 'groovepaper',
  }

  return (
    <section
      className={cn(
        'relative isolate border-b border-[var(--gs-ink)] bg-[var(--gs-paper)]',
        className,
      )}
      data-chapter={chapter}
      data-tone={tone}
      {...props}
    >
      <BackgroundImageTexture
        className="relative"
        opacity={tone === 'paper' || tone === 'lime' ? 0.36 : 0.15}
        variant={textureByTone[tone]}
      >
        <div
          className="absolute inset-y-0 left-0 z-[1] hidden w-14 flex-col items-center gap-[18px] border-e border-[var(--gs-ink)] bg-[rgb(248_247_242/70%)] py-6 min-[720px]:flex"
          aria-hidden="true"
        >
          <span className="text-[0.6875rem] leading-none font-extrabold tracking-[0.14em] [font-family:var(--font-oxanium),ui-monospace,monospace] [writing-mode:vertical-rl]">
            {chapter}
          </span>
          <i className="w-px flex-1 bg-[var(--gs-ink)] opacity-25" />
          <span className="text-[0.6875rem] leading-none font-extrabold tracking-[0.14em] [font-family:var(--font-oxanium),ui-monospace,monospace] [writing-mode:vertical-rl]">
            GS / TORONTO
          </span>
        </div>
        <div className="mx-auto w-full max-w-[1848px] min-[720px]:ps-14">
          <header className="flex items-end justify-between gap-6 px-[clamp(20px,4vw,56px)] pt-[clamp(32px,5vw,72px)] max-[719px]:flex-col max-[719px]:items-start">
            <p className="m-0 text-[0.6875rem] leading-none font-extrabold tracking-[0.14em] uppercase [font-family:var(--font-oxanium),ui-monospace,monospace]">
              {label}
            </p>
            <div className="max-w-[33ch] text-right text-[clamp(1.5rem,2.2vw,2.25rem)] leading-[0.95] font-extrabold tracking-[-0.025em] text-balance [font-family:var(--font-inter),Arial,sans-serif] max-[719px]:max-w-[26ch] max-[719px]:text-left">
              {description}
            </div>
          </header>
          <div className="flex flex-col">{children}</div>
        </div>
      </BackgroundImageTexture>
    </section>
  )
}

export function CopySection({
  children,
  className,
  file,
  heading,
  headingAs: Heading = 'h2',
  intro,
  ...props
}: CopySectionProps) {
  return (
    <article className={cn('gs-copy-section', className)} {...props}>
      <header className="gs-copy-section__header">
        <p className="gs-file-label">{file}</p>
        <Heading>{heading}</Heading>
        {intro ? <div className="gs-copy-section__intro">{intro}</div> : null}
      </header>
      <div className="gs-copy-section__content">{children}</div>
    </article>
  )
}

export function FileCard({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('gs-file-card', className)} {...props}>
      {children}
    </div>
  )
}

export function EvidenceGate({ children, owner }: { children: ReactNode; owner: string }) {
  return (
    <aside className="gs-evidence-gate" data-evidence-gate>
      <span>Evidence gate · {owner}</span>
      <p>{children}</p>
    </aside>
  )
}

export function RouteArrow({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('gs-route-arrow', reverse && 'gs-route-arrow--reverse')}
      viewBox="0 0 520 54"
    >
      <path d="M8 27 C120 4 205 49 318 27 C390 13 440 14 506 27" pathLength="1" />
      <circle cx="8" cy="27" r="5" />
      <path className="gs-route-arrow__head" d="m493 18 14 9-14 9" />
    </svg>
  )
}
