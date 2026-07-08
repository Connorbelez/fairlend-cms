'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function FairlendTorontoHeroParallax() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>('[data-fairlend-motion="toronto-hero"]')

      if (!hero) return

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
    })

    return () => context.revert()
  }, [])

  return null
}
