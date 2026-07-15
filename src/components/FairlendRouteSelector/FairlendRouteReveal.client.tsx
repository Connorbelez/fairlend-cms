'use client'

import { useEffect, useRef } from 'react'

const revealSequenceMs = 700

export function FairlendRouteReveal() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = markerRef.current?.closest<HTMLElement>('[data-fairlend-route-selector]')
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return

    const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-route-reveal-card]'))
    const timers = new Set<number>()

    cards.forEach((card) => {
      card.dataset.routeRevealState = 'pending'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)
          .forEach((entry) => {
            const card = entry.target as HTMLElement
            if (card.dataset.routeRevealState !== 'pending') return

            const delay = Number.parseInt(
              getComputedStyle(card).getPropertyValue('--route-reveal-delay'),
              10,
            )
            card.dataset.routeRevealState = 'revealing'
            observer.unobserve(card)

            const timer = window.setTimeout(
              () => {
                card.dataset.routeRevealState = 'entered'
                timers.delete(timer)
              },
              revealSequenceMs + (Number.isFinite(delay) ? delay : 0),
            )
            timers.add(timer)
          })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    const observationFrame = window.requestAnimationFrame(() => {
      cards.forEach((card) => observer.observe(card))
    })

    return () => {
      window.cancelAnimationFrame(observationFrame)
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
      cards.forEach((card) => delete card.dataset.routeRevealState)
    }
  }, [])

  return <span ref={markerRef} hidden />
}
