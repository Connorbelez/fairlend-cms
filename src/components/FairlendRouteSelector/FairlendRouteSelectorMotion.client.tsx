'use client'

import { useEffect, useRef } from 'react'

const routeSelectorAttribute = '[data-fairlend-route-selector]'
const minimumVisibleRatio = 0.08

function getVisibleRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

  return Math.max(0, Math.min(visibleHeight, rect.height)) / Math.max(rect.height, 1)
}

function isReadyToAnimate(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  return (
    rect.bottom > viewportHeight * 0.08 &&
    rect.top < viewportHeight * 0.88 &&
    getVisibleRatio(element) >= minimumVisibleRatio
  )
}

export function FairlendRouteSelectorMotion() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = markerRef.current?.closest<HTMLElement>(routeSelectorAttribute)

    if (!section) {
      return
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotionQuery.matches) {
      section.dataset.routeMotionState = 'reduced'
      return
    }

    const activate = () => {
      section.dataset.routeMotionState = 'active'
    }

    if (isReadyToAnimate(section)) {
      activate()
      return
    }

    section.dataset.routeMotionState = 'idle'

    if (typeof IntersectionObserver === 'undefined') {
      activate()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !isReadyToAnimate(section)) {
          return
        }

        activate()
        observer.disconnect()
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: [0, minimumVisibleRatio, 0.18],
      },
    )

    observer.observe(section)

    const handleViewportChange = () => {
      if (section.dataset.routeMotionState === 'active') {
        return
      }

      if (isReadyToAnimate(section)) {
        activate()
        observer.disconnect()
        window.removeEventListener('scroll', handleViewportChange)
        window.removeEventListener('resize', handleViewportChange)
      }
    }

    window.addEventListener('scroll', handleViewportChange, { passive: true })
    window.addEventListener('resize', handleViewportChange)

    const idleFallback = window.setTimeout(() => {
      if (section.dataset.routeMotionState === 'idle' && getVisibleRatio(section) > 0) {
        activate()
        observer.disconnect()
      }
    }, 1800)

    const handleMotionPreferenceChange = () => {
      if (reducedMotionQuery.matches) {
        section.dataset.routeMotionState = 'reduced'
        observer.disconnect()
        window.clearTimeout(idleFallback)
        window.removeEventListener('scroll', handleViewportChange)
        window.removeEventListener('resize', handleViewportChange)
      }
    }

    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      observer.disconnect()
      window.clearTimeout(idleFallback)
      window.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  return <span ref={markerRef} hidden />
}
