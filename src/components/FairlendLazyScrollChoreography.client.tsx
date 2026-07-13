'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

type ChoreographyComponent = ComponentType<{ surface?: 'home' | 'investor' }>

export function FairlendLazyScrollChoreography() {
  const [Choreography, setChoreography] = useState<ChoreographyComponent | null>(null)

  useEffect(() => {
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
