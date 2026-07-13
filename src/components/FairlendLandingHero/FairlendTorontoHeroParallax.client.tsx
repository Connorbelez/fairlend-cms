'use client'

import { useEffect } from 'react'

type GsapContext = { revert: () => void }

export function FairlendTorontoHeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-fairlend-motion="toronto-hero"]')
    if (!hero) return

    let cancelled = false
    let context: GsapContext | undefined
    let timeoutId: number | undefined

    const setupParallax = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
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
              duration: 1,
              ease: 'none',
              xPercent: lateral * Math.max(0.3, depth / 40),
              yPercent: -(depth * 0.28),
            },
            0,
          )
        })
      }, hero)
    }

    const idleId = window.requestIdleCallback?.(() => void setupParallax(), { timeout: 1_500 })
    if (idleId === undefined) timeoutId = window.setTimeout(() => void setupParallax(), 0)

    return () => {
      cancelled = true
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      context?.revert()
    }
  }, [])

  return null
}
