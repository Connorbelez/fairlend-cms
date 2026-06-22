'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function isElement(element: Element | null): element is Element {
  return element !== null
}

export function FairlendScrollChoreography() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })

    const context = gsap.context(() => {
      const clientSignals = document.querySelector<HTMLElement>(
        '[data-fairlend-motion="client-signals"]',
      )

      if (clientSignals) {
        const copyItems = [
          clientSignals.querySelector('[data-fairlend-client-eyebrow]'),
          clientSignals.querySelector('[data-fairlend-client-title]'),
          clientSignals.querySelector('[data-fairlend-client-summary]'),
        ].filter(isElement)

        if (copyItems.length > 0) {
          gsap.fromTo(
            copyItems,
            { autoAlpha: 0.72, filter: 'blur(3px)', y: 18 },
            {
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power3.out',
              filter: 'blur(0px)',
              stagger: 0.08,
              y: 0,
              scrollTrigger: {
                once: true,
                start: 'top 72%',
                trigger: clientSignals,
              },
            },
          )
        }

        const cards = gsap.utils.toArray<HTMLElement>(
          clientSignals.querySelectorAll('[data-fairlend-signal-card]'),
        )

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { autoAlpha: 0.86, rotateX: -2, transformPerspective: 900, y: 18 },
            {
              autoAlpha: 1,
              duration: 0.82,
              ease: 'power3.out',
              rotateX: 0,
              stagger: 0.035,
              y: 0,
              scrollTrigger: {
                once: true,
                start: 'top 66%',
                trigger: clientSignals,
              },
            },
          )
        }

        const marqueeShell = clientSignals.querySelector('[data-fairlend-marquee-shell]')

        if (marqueeShell) {
          gsap.to(marqueeShell, {
            ease: 'none',
            scrollTrigger: {
              end: 'bottom top',
              scrub: 0.7,
              start: 'top bottom',
              trigger: clientSignals,
            },
            yPercent: -4,
          })
        }
      }

      const bridge = document.querySelector<HTMLElement>('[data-fairlend-motion="editorial-bridge"]')

      if (bridge) {
        const bridgeItems = Array.from(bridge.children)

        if (bridgeItems.length > 0) {
          gsap.fromTo(
            bridgeItems,
            { autoAlpha: 0.78, y: 22 },
            {
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.05,
              y: 0,
              scrollTrigger: {
                once: true,
                start: 'top 78%',
                trigger: bridge,
              },
            },
          )
        }
      }

      const about = document.querySelector<HTMLElement>('[data-fairlend-motion="about-fairlend"]')

      if (about) {
        const photo = about.querySelector('[data-fairlend-about-photo]')
        const panel = about.querySelector('[data-fairlend-about-panel]')
        const rule = about.querySelector('[data-fairlend-about-rule]')
        const copy = [
          about.querySelector('[data-fairlend-about-copy] p'),
          about.querySelector('[data-fairlend-about-title]'),
          about.querySelector('[data-fairlend-about-summary]'),
          about.querySelector('[data-fairlend-about-copy] a'),
        ].filter(isElement)
        const proofItems = gsap.utils.toArray<HTMLElement>(
          about.querySelectorAll('[data-fairlend-about-proof] > div'),
        )
        const cropMarks = gsap.utils.toArray<HTMLElement>(
          about.querySelectorAll('[data-testid="judgment-crop-mark"]'),
        )

        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.075, yPercent: -1.5 },
            {
              ease: 'none',
              scale: 1.01,
              scrollTrigger: {
                end: 'bottom top',
                scrub: 0.85,
                start: 'top bottom',
                trigger: about,
              },
              yPercent: 1.5,
            },
          )
        }

        if (panel) {
          gsap.fromTo(
            panel,
            { backgroundPosition: '50% 0%' },
            {
              backgroundPosition: '50% 10%',
              ease: 'none',
              scrollTrigger: {
                end: 'bottom top',
                scrub: 1,
                start: 'top bottom',
                trigger: about,
              },
            },
          )
        }

        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0.18, transformOrigin: 'left center' },
            {
              duration: 0.76,
              ease: 'power3.out',
              scaleX: 1,
              scrollTrigger: {
                once: true,
                start: 'top 70%',
                trigger: about,
              },
            },
          )
        }

        if (copy.length > 0) {
          gsap.fromTo(
            copy,
            { autoAlpha: 0.76, filter: 'blur(4px)', y: 24 },
            {
              autoAlpha: 1,
              duration: 0.95,
              ease: 'power3.out',
              filter: 'blur(0px)',
              stagger: 0.08,
              y: 0,
              scrollTrigger: {
                once: true,
                start: 'top 68%',
                trigger: about,
              },
            },
          )
        }

        if (proofItems.length > 0) {
          gsap.fromTo(
            proofItems,
            { autoAlpha: 0.74, y: 16 },
            {
              autoAlpha: 1,
              duration: 0.72,
              ease: 'power3.out',
              stagger: 0.08,
              y: 0,
              scrollTrigger: {
                once: true,
                start: 'top 54%',
                trigger: about,
              },
            },
          )
        }

        if (cropMarks.length > 0) {
          gsap.fromTo(
            cropMarks,
            { autoAlpha: 0.28, scale: 0.92 },
            {
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power2.out',
              scale: 1,
              stagger: 0.06,
              scrollTrigger: {
                once: true,
                start: 'top 64%',
                trigger: about,
              },
            },
          )
        }
      }
    })

    window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => context.revert()
  }, [])

  return null
}
