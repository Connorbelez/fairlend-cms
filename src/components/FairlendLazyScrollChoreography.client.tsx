'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

type ChoreographyComponent = ComponentType<{ surface?: 'home' | 'investor' }>

export function FairlendLazyScrollChoreography() {
  const [Choreography, setChoreography] = useState<ChoreographyComponent | null>(null)

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 768px)')
    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)')

    // The page is fully rendered without GSAP. On phones, importing and initializing the
    // homepage-wide choreography blocks Safari's main thread during the first scroll and can
    // leave only compositor layers (such as the sticky header) painted for several seconds.
    if (!desktopViewport.matches || !motionAllowed.matches) return

    let cancelled = false

    const load = () => {
      void import('./FairlendScrollChoreography.client').then((module) => {
        if (!cancelled) setChoreography(() => module.FairlendScrollChoreography)
      })
    }

    const idleCallback = window.requestIdleCallback?.(load, { timeout: 2_000 })
    const timeout = idleCallback === undefined ? window.setTimeout(load, 1) : undefined

    return () => {
      cancelled = true
      if (idleCallback !== undefined) window.cancelIdleCallback?.(idleCallback)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [])

  return Choreography ? <Choreography /> : null
}
