'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

const dotPositions = [
  { className: 'fairlend-landing-rail-dot--top fairlend-landing-rail-dot--left', key: 'top-left' },
  {
    className: 'fairlend-landing-rail-dot--top fairlend-landing-rail-dot--right',
    key: 'top-right',
  },
  {
    className: 'fairlend-landing-rail-dot--bottom fairlend-landing-rail-dot--left',
    key: 'bottom-left',
  },
  {
    className: 'fairlend-landing-rail-dot--bottom fairlend-landing-rail-dot--right',
    key: 'bottom-right',
  },
] as const

type DotKey = (typeof dotPositions)[number]['key']

const initialActiveDots = dotPositions.reduce(
  (acc, { key }) => {
    acc[key] = false
    return acc
  },
  {} as Record<DotKey, boolean>,
)

function hasActiveDotChanged(current: Record<DotKey, boolean>, next: Record<DotKey, boolean>) {
  return dotPositions.some(({ key }) => current[key] !== next[key])
}

export function FairlendRailCrossDots() {
  const [activeDots, setActiveDots] = useState(initialActiveDots)
  const dotRefs = useRef<Record<DotKey, HTMLSpanElement | null>>({
    'bottom-left': null,
    'bottom-right': null,
    'top-left': null,
    'top-right': null,
  })
  const activeDotsRef = useRef(activeDots)

  useEffect(() => {
    activeDotsRef.current = activeDots
  }, [activeDots])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animationFrame = 0
    let pointerX = 0
    let pointerY = 0

    const updateDots = () => {
      animationFrame = 0

      const nextActiveDots = dotPositions.reduce(
        (acc, { key }) => {
          const dot = dotRefs.current[key]

          if (!dot) {
            acc[key] = false
            return acc
          }

          const rect = dot.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distance = Math.hypot(pointerX - centerX, pointerY - centerY)

          acc[key] = distance <= 104
          return acc
        },
        {} as Record<DotKey, boolean>,
      )

      if (hasActiveDotChanged(activeDotsRef.current, nextActiveDots)) {
        setActiveDots(nextActiveDots)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateDots)
      }
    }

    const resetDots = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
      }

      if (hasActiveDotChanged(activeDotsRef.current, initialActiveDots)) {
        setActiveDots(initialActiveDots)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', resetDots)
    document.addEventListener('mouseleave', resetDots)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', resetDots)
      document.removeEventListener('mouseleave', resetDots)
    }
  }, [])

  return (
    <div aria-hidden="true" className="fairlend-landing-rail-dots">
      {dotPositions.map(({ className, key }) => {
        const isActive = activeDots[key]

        return (
          <span
            className={cn('fairlend-landing-rail-dot', className, isActive && 'is-active')}
            key={key}
            ref={(node) => {
              dotRefs.current[key] = node
            }}
          />
        )
      })}
    </div>
  )
}
