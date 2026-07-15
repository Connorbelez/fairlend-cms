'use client'

import Image from 'next/image'
import { type PointerEvent as ReactPointerEvent, useEffect, useRef } from 'react'

import styles from './WatermelonFooter.module.css'

export function FooterSkyline() {
  const pointerFrameRef = useRef<number | null>(null)
  const pointerPositionRef = useRef({ x: 0, y: 0 })
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current)
    }
  }, [])

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const skyline = event.currentTarget
    pointerPositionRef.current = { x: event.clientX, y: event.clientY }

    if (pointerFrameRef.current !== null) return

    pointerFrameRef.current = requestAnimationFrame(() => {
      const { x, y } = pointerPositionRef.current
      const skylineBounds = skyline.getBoundingClientRect()
      const wordmarkBounds = wordmarkRef.current?.getBoundingClientRect()

      skyline.style.setProperty('--spotlight-x', `${x - skylineBounds.left}px`)
      skyline.style.setProperty('--spotlight-y', `${y - skylineBounds.top}px`)
      skyline.dataset.pointerActive = 'true'

      if (wordmarkBounds) {
        wordmarkRef.current?.style.setProperty(
          '--wordmark-spotlight-x',
          `${x - wordmarkBounds.left}px`,
        )
        wordmarkRef.current?.style.setProperty(
          '--wordmark-spotlight-y',
          `${y - wordmarkBounds.top}px`,
        )
      }

      pointerFrameRef.current = null
    })
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current)
      pointerFrameRef.current = null
    }

    delete event.currentTarget.dataset.pointerActive
  }

  return (
    <section
      aria-label="Toronto after dark"
      className={styles.skyline}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <Image
        alt=""
        aria-hidden="true"
        className={styles.skylineImage}
        fill
        loading="lazy"
        quality={55}
        sizes="100vw"
        src="/assets/footer/fairlend-toronto-waterfront.webp"
      />
      <div
        aria-hidden="true"
        className={styles.wordmark}
        data-text="FAIRLEND"
        ref={wordmarkRef}
      >
        FAIRLEND
      </div>
      <div aria-hidden="true" className={styles.signalGlow} />
      <span className="sr-only">
        Toronto waterfront at night, rendered in monochrome halftone
      </span>
    </section>
  )
}
