'use client'

import { useEffect, useRef } from 'react'

const teamSectionSelector = '[data-testid="fairlend-team-section"]'

function revealPlate(row: HTMLElement) {
  row.querySelectorAll<HTMLElement>('[data-team-plate]').forEach((plate) => {
    plate.dataset.teamPlateDrawn = 'true'
  })
}

export function FairlendTeamDisciplineMotion() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = markerRef.current?.closest<HTMLElement>(teamSectionSelector)
    if (!section) return

    const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-team-member]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      section.dataset.teamMotion = 'reduced'
      rows.forEach(revealPlate)
      return () => {
        delete section.dataset.teamMotion
      }
    }

    section.dataset.teamMotion = 'ready'
    const timers = new Set<number>()
    rows.forEach((row) => {
      row.dataset.teamRowState = 'pending'
    })

    const introObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        section.dataset.teamMotion = 'entered'
        introObserver.disconnect()
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.08 },
    )

    const rowObserver = new IntersectionObserver(
      (entries, observer) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).getBoundingClientRect().top -
              (b.target as HTMLElement).getBoundingClientRect().top,
          )
          .forEach((entry, index) => {
            const row = entry.target as HTMLElement
            const timer = window.setTimeout(() => {
              row.dataset.teamRowState = 'entered'
              revealPlate(row)
              timers.delete(timer)
            }, index * 55)
            timers.add(timer)
            observer.unobserve(row)
          })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    introObserver.observe(section)
    rows.forEach((row) => rowObserver.observe(row))

    return () => {
      introObserver.disconnect()
      rowObserver.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
      delete section.dataset.teamMotion
      rows.forEach((row) => {
        delete row.dataset.teamRowState
      })
    }
  }, [])

  return <span aria-hidden="true" className="hidden" ref={markerRef} />
}
