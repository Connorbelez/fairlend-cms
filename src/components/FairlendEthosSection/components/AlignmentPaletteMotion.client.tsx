'use client'

import { useEffect } from 'react'

/**
 * Keeps the aligned-interests surface in sync with the ledger entry nearest
 * the reading line. The ordered ledger remains the accessible source of truth;
 * this component only mirrors each entry's palette through a data attribute.
 */
export function AlignmentPaletteMotion() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const section = document.querySelector<HTMLElement>('[data-ethos-alignment-palette]')
    if (!section) return

    const entries = Array.from(section.querySelectorAll<HTMLElement>('[data-ethos-palette-theme]'))
    if (entries.length === 0) return

    const applyCurrentPalette = () => {
      const readingLine = window.innerHeight * 0.48
      const currentEntry = entries.reduce(
        (closest, entry) => {
          const rect = entry.getBoundingClientRect()
          const entryCenter = rect.top + rect.height / 2
          const distance = Math.abs(entryCenter - readingLine)

          return distance < closest.distance ? { distance, entry } : closest
        },
        { distance: Number.POSITIVE_INFINITY, entry: entries[0] },
      ).entry

      section.dataset.paletteTheme = currentEntry.dataset.ethosPaletteTheme ?? 'ivory'
    }

    const observer = new IntersectionObserver(applyCurrentPalette, {
      rootMargin: '-18% 0px -30% 0px',
      threshold: [0.24, 0.38, 0.52, 0.68],
    })

    entries.forEach((entry) => observer.observe(entry))
    applyCurrentPalette()

    let frame = 0
    const requestPaletteUpdate = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        applyCurrentPalette()
      })
    }

    window.addEventListener('scroll', requestPaletteUpdate, { passive: true })
    window.addEventListener('resize', requestPaletteUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestPaletteUpdate)
      window.removeEventListener('resize', requestPaletteUpdate)
      observer.disconnect()
    }
  }, [])

  return null
}
