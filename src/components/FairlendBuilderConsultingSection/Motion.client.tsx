'use client'

import { useEffect, useRef } from 'react'

import { torontoLuxury2019Model } from './model'

const years = ['2019', '2023', '2026'] as const
type BuilderYear = (typeof years)[number]

const primaryRowStates = [
  {
    cta: 'SEE THE TIMELINE',
    ctaNote: 'Scroll through the build math',
    note: 'Illustrative Southern Ontario luxury infill model',
    riskLeft: 'EST. PROFIT',
    riskRight: 'POSITIVE RETURN',
    year: '2019',
  },
  {
    cta: 'RUN MY NUMBERS',
    ctaNote: 'Find the break-even point',
    note: 'Illustrative Southern Ontario assumptions',
    riskLeft: 'EST. LOSS',
    riskRight: 'MIDPOINT COST',
    year: '2023',
  },
  {
    cta: 'RUN MY NUMBERS',
    ctaNote: "Let's run your version",
    note: 'Illustrative Southern Ontario assumptions',
    riskLeft: 'EST. LOSS',
    riskRight: 'MIDPOINT COST',
    year: '2026',
  },
] as const

const counterStates = {
  'single-build': [torontoLuxury2019Model.build, '$450/ft²', '$400/ft²'],
  'single-land': [torontoLuxury2019Model.land, '$1.46M', '$1.36M'],
  'single-margin': [torontoLuxury2019Model.margin, '-9.6%*', '-9.1%*'],
  'single-profit': [torontoLuxury2019Model.profit, '-$298K*', '-$258K*'],
  'single-sale': [torontoLuxury2019Model.sale, '$3.10M', '$2.85M'],
  'single-soft': [torontoLuxury2019Model.soft, '$60/ft²', '$60/ft²'],
} as const satisfies Record<string, readonly [string, string, string]>

function setText(targets: NodeListOf<HTMLElement>, value: string) {
  targets.forEach((target) => {
    target.textContent = value
  })
}

export function FairlendBuilderConsultingMotion() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = markerRef.current?.closest<HTMLElement>('[data-builder-consulting]')
    if (!section) return

    const isPhone = window.matchMedia('(max-width: 767px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      if (isPhone) section.dataset.builderPhoneStatic = 'true'
      return () => {
        delete section.dataset.builderPhoneStatic
      }
    }

    const phaseMarkers = Array.from(
      section.querySelectorAll<HTMLElement>('[data-builder-phase-marker]'),
    )
    if (!phaseMarkers.length) return

    let activeYear: BuilderYear | null = null

    const applyPhase = (year: BuilderYear) => {
      if (activeYear === year) return
      activeYear = year
      const index = years.indexOf(year)
      const state = primaryRowStates[index]

      section.dataset.builderPhase = year
      setText(section.querySelectorAll<HTMLElement>('[data-builder-primary-year]'), state.year)
      setText(section.querySelectorAll<HTMLElement>('[data-builder-primary-note]'), state.note)
      setText(
        section.querySelectorAll<HTMLElement>('[data-builder-primary-risk="left"]'),
        state.riskLeft,
      )
      setText(
        section.querySelectorAll<HTMLElement>('[data-builder-primary-risk="right"]'),
        state.riskRight,
      )
      setText(section.querySelectorAll<HTMLElement>('[data-builder-cta-label]'), state.cta)
      setText(section.querySelectorAll<HTMLElement>('[data-builder-cta-note]'), state.ctaNote)

      Object.entries(counterStates).forEach(([key, values]) => {
        setText(
          section.querySelectorAll<HTMLElement>(`[data-builder-counter="${key}"]`),
          values[index],
        )
      })

      window.dispatchEvent(new CustomEvent('fairlend-builder-equation-icons-replay'))
    }

    const syncToViewport = () => {
      const viewportTarget = window.innerHeight * 0.5
      const activeMarker = phaseMarkers.find((marker) => {
        const bounds = marker.getBoundingClientRect()
        return bounds.top <= viewportTarget && bounds.bottom > viewportTarget
      })

      const year = activeMarker?.dataset.builderPhaseMarker as BuilderYear | undefined
      if (year && years.includes(year)) applyPhase(year)
    }

    section.dataset.builderMotionReady = 'true'
    delete section.dataset.builderPhoneStatic
    applyPhase('2019')

    const observer = new IntersectionObserver(syncToViewport, {
      rootMargin: '-49% 0px -49% 0px',
      threshold: 0,
    })
    phaseMarkers.forEach((marker) => observer.observe(marker))
    window.addEventListener('resize', syncToViewport, { passive: true })
    requestAnimationFrame(syncToViewport)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncToViewport)
      delete section.dataset.builderMotionReady
      delete section.dataset.builderPhase
      delete section.dataset.builderPhoneStatic
    }
  }, [])

  return <span aria-hidden="true" className="hidden" ref={markerRef} />
}
