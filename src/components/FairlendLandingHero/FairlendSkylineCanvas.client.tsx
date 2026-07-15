'use client'

import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'

import { cn } from '@/utilities/ui'

type FairlendSkylineCanvasProps = {
  className?: string
  desktopSrc: string
  height?: number
  mobileSrc: string
  width?: number
}

/** Draws decorative skyline art without making it the page's contentful element. */
export function FairlendSkylineCanvas({
  className,
  desktopSrc,
  height = 1000,
  mobileSrc,
  width = 1600,
}: FairlendSkylineCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.getClientRects().length === 0) return

    const image = new Image()
    image.decoding = 'async'
    image.src = window.matchMedia('(max-width: 768px)').matches ? mobileSrc : desktopSrc

    let isCancelled = false
    const draw = () => {
      if (isCancelled) return
      const context = canvas.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }

    if (image.complete) draw()
    else image.addEventListener('load', draw, { once: true })

    return () => {
      isCancelled = true
      image.removeEventListener('load', draw)
    }
  }, [desktopSrc, mobileSrc])

  return (
    <canvas
      aria-hidden="true"
      className={cn('block h-auto w-full', className)}
      height={height}
      ref={canvasRef}
      width={width}
    />
  )
}
