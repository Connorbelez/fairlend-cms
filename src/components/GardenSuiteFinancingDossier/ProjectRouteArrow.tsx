'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useId, type SVGProps } from 'react'

import { cn } from '@/utilities/ui'

export interface ProjectRouteArrowProps extends Omit<SVGProps<SVGSVGElement>, 'color' | 'path'> {
  animate?: boolean
  color?: string
  dashArray?: string
  duration?: number
  label?: string
  path?: string
  shadowColor?: string
  strokeWidth?: number
}

const defaultPath = 'M 1 82 C 54 87 116 94 173 85 C 220 78 239 57 260 35 C 281 13 302 8 333 16'

export function ProjectRouteArrow({
  animate = true,
  className,
  color = '#a8ff00',
  dashArray = '6 6',
  duration = 2.4,
  label,
  path = defaultPath,
  shadowColor = '#111712',
  strokeWidth = 2,
  ...props
}: ProjectRouteArrowProps) {
  const markerId = useId().replace(/:/g, '')
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = animate && !shouldReduceMotion

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn('pointer-events-none block h-auto w-full overflow-visible', className)}
      fill="none"
      preserveAspectRatio="none"
      role={label ? 'img' : undefined}
      viewBox="0 0 343 102"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <marker
          id={markerId}
          markerHeight="11.1"
          markerUnits="strokeWidth"
          markerWidth="9.5"
          orient="auto"
          preserveAspectRatio="none"
          refX="6.4"
          refY="4"
          viewBox="0 0 8 8"
        >
          <path
            d="M 0.8 0.8 L 7 4 L 0.8 7.2"
            fill="none"
            stroke={color}
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="1.2"
          />
        </marker>
      </defs>

      <path
        d={path}
        opacity="0.72"
        stroke={shadowColor}
        strokeDasharray={dashArray}
        strokeLinecap="square"
        strokeWidth={strokeWidth + 2}
        vectorEffect="non-scaling-stroke"
      />
      <motion.path
        animate={shouldAnimate ? { strokeDashoffset: [0, -30] } : { strokeDashoffset: 0 }}
        d={path}
        markerEnd={`url(#${markerId})`}
        stroke={color}
        strokeDasharray={dashArray}
        strokeLinecap="square"
        strokeWidth={strokeWidth}
        transition={
          shouldAnimate
            ? { duration, ease: 'linear', repeat: Number.POSITIVE_INFINITY }
            : { duration: 0 }
        }
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
