'use client'

import { PencilRuler } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'

import {
  CircleDollarSignIcon,
  type CircleDollarSignIconHandle,
} from '@/components/ui/circle-dollar-sign'
import { HammerIcon, type HammerIconHandle } from '@/components/ui/hammer'
import { HomeIcon, type HomeIconHandle } from '@/components/ui/home'
import { MapPinHouseIcon, type MapPinHouseIconHandle } from '@/components/ui/map-pin-house'

type EquationVariableKey = 'land' | 'build' | 'soft' | 'incentives' | 'home' | 'sale'
type AnimatedEquationIconHandle =
  | CircleDollarSignIconHandle
  | HammerIconHandle
  | HomeIconHandle
  | MapPinHouseIconHandle

export function EquationVariableIcon({ variableKey }: { variableKey: EquationVariableKey }) {
  const iconRef = useRef<AnimatedEquationIconHandle>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<number | null>(null)
  const replayTimeoutRef = useRef<number | null>(null)

  const replayAnimation = useCallback(() => {
    iconRef.current?.stopAnimation()
    if (replayTimeoutRef.current) window.clearTimeout(replayTimeoutRef.current)
    replayTimeoutRef.current = window.setTimeout(() => {
      iconRef.current?.startAnimation()
    }, 60)
  }, [])

  useEffect(() => {
    const target = wrapperRef.current
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const stopLoop = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const startLoop = () => {
      replayAnimation()
      stopLoop()
      intervalRef.current = window.setInterval(replayAnimation, 3200)
    }

    window.addEventListener('fairlend-builder-equation-icons-replay', replayAnimation)

    if (!('IntersectionObserver' in window)) {
      startLoop()
      return () => {
        window.removeEventListener('fairlend-builder-equation-icons-replay', replayAnimation)
        stopLoop()
        if (replayTimeoutRef.current) window.clearTimeout(replayTimeoutRef.current)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) startLoop()
        else {
          stopLoop()
          iconRef.current?.stopAnimation()
        }
      },
      { threshold: 0.42 },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
      window.removeEventListener('fairlend-builder-equation-icons-replay', replayAnimation)
      stopLoop()
      if (replayTimeoutRef.current) window.clearTimeout(replayTimeoutRef.current)
    }
  }, [replayAnimation])

  const iconProps = {
    className: 'builder-equation-card__animated-icon-inner',
    onMouseEnter: replayAnimation,
    size: 18,
  }

  return (
    <span className="builder-equation-card__animated-icon" aria-hidden="true" ref={wrapperRef}>
      {variableKey === 'land' ? (
        <MapPinHouseIcon {...iconProps} ref={iconRef} />
      ) : variableKey === 'build' ? (
        <HammerIcon {...iconProps} ref={iconRef} />
      ) : variableKey === 'soft' ? (
        <PencilRuler className={iconProps.className} size={iconProps.size} />
      ) : variableKey === 'home' ? (
        <HomeIcon {...iconProps} ref={iconRef} />
      ) : (
        <CircleDollarSignIcon {...iconProps} ref={iconRef} />
      )}
    </span>
  )
}
