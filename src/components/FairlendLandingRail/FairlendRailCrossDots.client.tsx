'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

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
  const reduceMotion = useReducedMotion()
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
    if (reduceMotion) return

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
  }, [reduceMotion])

  return (
    <div aria-hidden="true" className="fairlend-landing-rail-dots">
      {dotPositions.map(({ className, key }) => {
        const isActive = activeDots[key]

        return (
          <motion.span
            animate={{
              backgroundColor: isActive ? 'var(--landing-hero-lime)' : 'var(--landing-rail-dot)',
              borderRadius: isActive ? '999px' : '2px',
              boxShadow: isActive
                ? '0 0 18px rgb(150 236 24 / 0.72), 0 0 34px rgb(150 236 24 / 0.34)'
                : '0 0 0 rgb(150 236 24 / 0)',
              scale: isActive ? 1.55 : 1,
            }}
            className={cn('fairlend-landing-rail-dot', className)}
            key={key}
            ref={(node) => {
              dotRefs.current[key] = node
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}
