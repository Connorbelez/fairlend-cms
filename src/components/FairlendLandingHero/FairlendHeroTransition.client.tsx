'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function findHeroElement<T extends HTMLElement>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector)
}

export function FairlendHeroTransition() {
  useGSAP(() => {
    const root = findHeroElement<HTMLElement>(document, '[data-fairlend-hero-transition]')
    const section = root
      ? findHeroElement<HTMLElement>(root, '[data-fairlend-hero-scroll]')
      : null
    const pinEl = root ? findHeroElement<HTMLElement>(root, '[data-fairlend-hero-pin]') : null
    const progressEl = root
      ? findHeroElement<HTMLElement>(root, '[data-fairlend-hero-progress]')
      : null
    const nextSection = root?.nextElementSibling instanceof HTMLElement ? root.nextElementSibling : null

    if (!(root && section && pinEl && progressEl)) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopMedia = window.matchMedia('(min-width: 1024px)')

    if (reducedMotion.matches) {
      root.dataset.fairlendHeroReduced = 'true'
      return () => {
        delete root.dataset.fairlendHeroReduced
      }
    }

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })

    const animatedEls = [pinEl, nextSection].filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    )

    gsap.set(animatedEls, {
      force3D: true,
      transformOrigin: '50% 50%',
    })

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        anticipatePin: desktopMedia.matches ? 1 : 0,
        end: desktopMedia.matches ? '+=145%' : '+=92%',
        invalidateOnRefresh: true,
        pin: desktopMedia.matches ? pinEl : false,
        scrub: true,
        start: 'top top',
        trigger: section,
      },
    })

    timeline.to(
      pinEl,
      {
        duration: desktopMedia.matches ? 0.38 : 0.28,
        opacity: desktopMedia.matches ? 0.86 : 0.88,
        rotate: desktopMedia.matches ? -2.8 : -1.8,
        scale: desktopMedia.matches ? 0.88 : 0.9,
        yPercent: desktopMedia.matches ? -3 : -2,
      },
      desktopMedia.matches ? 0.62 : 0.72,
    )

    if (nextSection) {
      timeline.fromTo(
        nextSection,
        {
          scale: desktopMedia.matches ? 0.97 : 0.98,
          y: () => window.innerHeight * (desktopMedia.matches ? 0.16 : 0.12),
        },
        {
          duration: desktopMedia.matches ? 0.38 : 0.28,
          scale: 1,
          y: 0,
        },
        desktopMedia.matches ? 0.62 : 0.72,
      )
    }

    timeline.fromTo(
      progressEl,
      { scaleX: 0, transformOrigin: '0% 50%' },
      { duration: 1, scaleX: 1 },
      0,
    )

    let active = true
    const refreshScene = () => {
      if (!active) return

      ScrollTrigger.refresh()
      timeline.scrollTrigger?.update()
    }

    const refreshFrame = requestAnimationFrame(refreshScene)

    Promise.all([
      ...Array.from(section.querySelectorAll('img'), (image) =>
        image.complete ? Promise.resolve() : image.decode?.().catch(() => undefined),
      ),
      document.fonts?.ready ?? Promise.resolve(),
    ]).then(refreshScene)

    return () => {
      active = false
      cancelAnimationFrame(refreshFrame)
    }
  }, [])

  return null
}
