'use client'

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const READY_FALLBACK_MS = 2200

type FairlendHeroIntroGateProps = {
  children: ReactNode
  className?: string
}

/**
 * Holds hero intro CSS animations until fonts + first paint settle.
 * Without this, fixed animation-delays finish during the blurred load window.
 */
export function FairlendHeroIntroGate({ children, className }: FairlendHeroIntroGateProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      root.dataset.heroIntroReady = 'true'
      return
    }

    let cancelled = false
    let fallbackId = 0
    let frameA = 0
    let frameB = 0

    const arm = () => {
      if (cancelled || root.dataset.heroIntroReady === 'true') return
      root.dataset.heroIntroReady = 'true'
    }

    const armAfterPaint = () => {
      frameA = requestAnimationFrame(() => {
        frameB = requestAnimationFrame(arm)
      })
    }

    const skyline = document.querySelector<HTMLImageElement>(
      '[data-fairlend-motion="toronto-hero"] img[data-toronto-skyline-scroll], [data-fairlend-motion="toronto-hero"] .fairlend-toronto-skyline img',
    )

    const imageReady =
      skyline && !skyline.complete
        ? skyline.decode?.().catch(() => undefined) ??
          new Promise<void>((resolve) => {
            skyline.addEventListener('load', () => resolve(), { once: true })
            skyline.addEventListener('error', () => resolve(), { once: true })
          })
        : Promise.resolve()

    Promise.all([document.fonts?.ready ?? Promise.resolve(), imageReady]).then(() => {
      if (!cancelled) armAfterPaint()
    })

    fallbackId = window.setTimeout(armAfterPaint, READY_FALLBACK_MS)

    return () => {
      cancelled = true
      window.clearTimeout(fallbackId)
      cancelAnimationFrame(frameA)
      cancelAnimationFrame(frameB)
    }
  }, [])

  return (
    <div className={className} data-toronto-hero-copy ref={rootRef}>
      {children}
    </div>
  )
}

export const heroTitleCascadeLines = ['Fast', 'Flexible', 'Fair', 'Financing for:'] as const

export function HeroTitleCascadeLines() {
  return (
    <>
      <span className="max-md:hidden">
        <span className="fairlend-toronto-title-line" style={{ '--line-index': 0 } as CSSProperties}>
          Financing for
        </span>
        <span className="sr-only"> multi-plex, single family, land, and private mortgage</span>
      </span>
      <span className="hidden max-md:block">
        {heroTitleCascadeLines.map((line, index) => (
          <span
            className="fairlend-toronto-title-line"
            key={line}
            style={{ '--line-index': index } as CSSProperties}
          >
            {line}
          </span>
        ))}
        <span className="sr-only"> multi-plex, single family, land, and private mortgage</span>
      </span>
    </>
  )
}
