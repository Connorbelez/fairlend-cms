'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INTRO_READY_FALLBACK_MS = 2200

function armHeroIntroReady(hero: HTMLElement) {
  if (hero.dataset.heroIntroReady === 'true') return
  hero.dataset.heroIntroReady = 'true'
}

function waitForHeroIntroAssets(hero: HTMLElement): Promise<void> {
  const skylineImg =
    hero.querySelector<HTMLImageElement>('[data-toronto-skyline-scroll] img') ??
    hero.querySelector<HTMLImageElement>('.fairlend-toronto-skyline img')

  const imageReady =
    skylineImg && !skylineImg.complete
      ? skylineImg.decode?.().catch(() => undefined) ??
        new Promise<void>((resolve) => {
          skylineImg.addEventListener('load', () => resolve(), { once: true })
          skylineImg.addEventListener('error', () => resolve(), { once: true })
        })
      : Promise.resolve()

  return Promise.all([document.fonts?.ready ?? Promise.resolve(), imageReady]).then(() => undefined)
}

export function FairlendTorontoHeroParallax() {
  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-fairlend-motion="toronto-hero"]')
    if (!hero) return

    let cancelled = false
    let fallbackId = 0
    let frameA = 0
    let frameB = 0

    const markReadyAfterPaint = () => {
      if (cancelled) return
      frameA = requestAnimationFrame(() => {
        frameB = requestAnimationFrame(() => {
          if (!cancelled) armHeroIntroReady(hero)
        })
      })
    }

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      armHeroIntroReady(hero)
      return
    }

    waitForHeroIntroAssets(hero).then(markReadyAfterPaint)
    fallbackId = window.setTimeout(markReadyAfterPaint, INTRO_READY_FALLBACK_MS)

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const skyline = hero.querySelector<HTMLElement>('[data-toronto-skyline-scroll]')
      const copy = hero.querySelector<HTMLElement>('[data-toronto-hero-copy]')
      const lowerCopy = hero.querySelector<HTMLElement>('[data-toronto-lower-copy]')
      const trust = hero.querySelector<HTMLElement>('[data-toronto-trust]')
      const clouds = gsap.utils.toArray<HTMLElement>(
        hero.querySelectorAll('[data-toronto-cloud-scroll]'),
      )

      const timeline = gsap.timeline({
        scrollTrigger: {
          end: 'bottom top',
          invalidateOnRefresh: true,
          scrub: 0.65,
          start: 'top top',
          trigger: hero,
        },
      })

      if (skyline) {
        timeline.to(
          skyline,
          {
            duration: 1,
            ease: 'none',
            scale: 1.01,
            yPercent: -4,
          },
          0,
        )
      }

      if (copy) {
        timeline.to(copy, { autoAlpha: 0.94, duration: 1, ease: 'none', yPercent: -2 }, 0)
      }

      if (lowerCopy) {
        timeline.to(lowerCopy, { autoAlpha: 0.82, duration: 1, ease: 'none', yPercent: -5 }, 0)
      }

      if (trust) {
        timeline.to(trust, { autoAlpha: 0.82, duration: 1, ease: 'none', yPercent: -5 }, 0)
      }

      clouds.forEach((cloud, index) => {
        const depth = Number.parseFloat(cloud.dataset.torontoCloudDepth ?? '0')
        const lateral = index % 2 === 0 ? -4 : 4

        timeline.to(
          cloud,
          {
            ease: 'none',
            duration: 1,
            xPercent: lateral * Math.max(0.3, depth / 40),
            yPercent: -(depth * 0.28),
          },
          0,
        )
      })
    }, hero)

    return () => {
      cancelled = true
      window.clearTimeout(fallbackId)
      cancelAnimationFrame(frameA)
      cancelAnimationFrame(frameB)
      context.revert()
    }
  }, [])

  return null
}
