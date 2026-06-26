'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function isElement(element: Element | null): element is Element {
  return element !== null
}

const leadershipProofNumberPattern = /^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/

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

      const bridge = document.querySelector<HTMLElement>(
        '[data-fairlend-motion="editorial-bridge"]',
      )

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

      const services = document.querySelector<HTMLElement>('[data-fairlend-motion="services"]')

      if (services) {
        const select = gsap.utils.selector(services)
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches
        const serviceGrid = services.querySelector<HTMLElement>('[data-services-grid]')
        const gridEdgesX = select(
          '[data-services-grid-edge="top"], [data-services-grid-edge="bottom"]',
        )
        const gridEdgesY = select(
          '[data-services-grid-edge="left"], [data-services-grid-edge="right"]',
        )
        const linesX = select('[data-services-line-x]')
        const linesY = select('[data-services-line-y]')
        const cards = gsap.utils.toArray<HTMLElement>(select('[data-services-card]'))
        const titleWords = select('[data-services-title-word]')
        const titleNumber =
          services.querySelector<HTMLElement>('[data-services-title-number]') ??
          (titleWords[0] instanceof HTMLElement ? titleWords[0] : null)
        const titleSlash =
          services.querySelector<HTMLElement>('[data-services-title-slash]') ??
          services.querySelector<HTMLElement>('.services-model-kicker .about-kicker-slash')
        const titleLabel =
          services.querySelector<HTMLElement>('[data-services-title-label]') ??
          (titleWords[1] instanceof HTMLElement ? titleWords[1] : null)
        const copyLines = select('[data-services-copy-line]')
        const tabs = select('[data-services-tab]')
        const graphPaths = gsap.utils.toArray<SVGPathElement>(select('[data-services-graph]'))

        graphPaths.forEach((path) => {
          const length = path.getTotalLength()

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          })
        })

        gsap.set(select('[data-services-brand]'), {
          autoAlpha: 0,
          transformOrigin: 'left center',
          xPercent: -14,
        })
        gsap.set(select('[data-services-logo]'), { autoAlpha: 0, scale: 0.88, y: 10 })
        gsap.set(select('[data-services-established]'), { autoAlpha: 0, y: 10 })
        if (titleNumber) {
          gsap.set(titleNumber, {
            autoAlpha: 0,
            clipPath: 'inset(100% 0% 0% 0%)',
            display: 'inline-block',
            yPercent: 28,
          })
        }
        if (titleSlash) {
          gsap.set(titleSlash, {
            autoAlpha: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
            display: 'inline-block',
            scaleY: 0.72,
            transformOrigin: '50% 100%',
            yPercent: -4,
          })
        }
        if (titleLabel) {
          gsap.set(titleLabel, {
            autoAlpha: 0,
            clipPath: 'inset(0% 100% 0% 0%)',
            x: -18,
          })
        }
        gsap.set(tabs, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(copyLines, { autoAlpha: 0, filter: 'blur(4px)', y: 16 })
        gsap.set(select('[data-services-map]'), { autoAlpha: 0, scale: 1.04, xPercent: 6 })
        if (serviceGrid) {
          gsap.set(serviceGrid, {
            '--services-grid-corner-alpha': 0,
            borderColor: 'rgb(8 45 35 / 0%)',
          })
        }
        gsap.set(gridEdgesX, { scaleX: 0 })
        gsap.set(gridEdgesY, { scaleY: 0 })
        gsap.set(linesX, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(linesY, { scaleY: 0, transformOrigin: 'top center' })
        gsap.set(select('[data-services-bottom]'), { autoAlpha: 0, y: 18 })

        cards.forEach((card) => {
          const rate = card.querySelector('[data-services-rate]')
          const shieldPulse = card.querySelector('[data-services-shield-pulse]')
          const shieldCheck = card.querySelector('[data-services-shield-check]')
          const craneLine = card.querySelector('[data-services-crane-line]')
          const craneHook = card.querySelector('[data-services-crane-hook]')
          const puzzlePiece = card.querySelector('[data-services-puzzle-piece]')
          const handshakeLine = card.querySelector('[data-services-handshake-line]')
          const corners = card.querySelectorAll('[data-services-corner]')

          gsap.set(card, {
            autoAlpha: 0,
            clipPath: 'inset(8% 0% 8% 0%)',
            y: 24,
          })
          gsap.set(card.querySelector('[data-services-number-plate]'), {
            autoAlpha: 0,
            clipPath: 'inset(50% 50% 50% 50%)',
            transformOrigin: 'center center',
          })
          gsap.set(card.querySelector('[data-services-number]'), { autoAlpha: 0, y: -10 })
          gsap.set(card.querySelector('[data-services-code]'), { autoAlpha: 0, y: 6 })
          gsap.set(card.querySelector('[data-services-kicker]'), {
            autoAlpha: 0,
            rotate: -4,
            y: -6,
          })
          gsap.set(card.querySelector('[data-services-icon-box]'), {
            autoAlpha: 0,
            scale: 0.82,
          })
          gsap.set(card.querySelector('[data-services-icon]'), {
            autoAlpha: 0,
            rotate: -8,
            scale: 0.74,
          })
          gsap.set(card.querySelector('[data-services-media-shell]'), {
            autoAlpha: 0,
            clipPath: 'inset(50% 50% 50% 50%)',
            transformOrigin: 'center center',
          })
          gsap.set(card.querySelector('[data-services-media]'), {
            autoAlpha: 0,
            filter: 'blur(8px)',
            scale: 0.86,
            y: 32,
          })
          corners.forEach((corner) => {
            gsap.set(corner, { autoAlpha: 0 })
            gsap.set(corner, { '--services-corner-x': 0, '--services-corner-y': 0 })
          })
          gsap.set(card.querySelector('[data-services-card-title]'), { autoAlpha: 0, x: -16 })
          gsap.set(card.querySelectorAll('[data-services-bullet]'), { autoAlpha: 0, x: -10 })
          gsap.set(card.querySelector('[data-services-cta-label]'), { autoAlpha: 0, y: 10 })
          gsap.set(card.querySelector('[data-services-arrow]'), { autoAlpha: 0, x: -8 })

          if (rate) gsap.set(rate, { autoAlpha: 0, y: 6 })
          if (shieldPulse) {
            gsap.set(shieldPulse, {
              autoAlpha: 0,
              scale: 0.6,
            })
          }
          if (shieldCheck) {
            gsap.set(shieldCheck, {
              autoAlpha: 0,
              scale: 0.42,
            })
          }
          if (craneLine) gsap.set(craneLine, { scaleY: 0 })
          if (craneHook) gsap.set(craneHook, { autoAlpha: 0, y: -16 })
          if (puzzlePiece) {
            gsap.set(puzzlePiece, {
              autoAlpha: 0,
              rotate: -8,
              x: 24,
              y: 12,
            })
          }
          if (handshakeLine) gsap.set(handshakeLine, { scaleX: 0 })
        })

        const scrollTrigger = isDesktop
          ? {
              anticipatePin: 1,
              end: '+=105%',
              pin: true,
              scrub: 0.9,
              start: 'top top',
              trigger: services,
            }
          : {
              once: true,
              start: 'top 72%',
              trigger: services,
            }

        const timeline = gsap.timeline({
          defaults: {
            duration: 1,
            ease: 'expo.out',
          },
          scrollTrigger,
        })

        timeline
          .to(select('[data-services-brand]'), { autoAlpha: 1, duration: 0.42, xPercent: 0 }, 0)
          .to(
            select('[data-services-logo]'),
            { autoAlpha: 1, duration: 0.32, scale: 1, y: 0 },
            0.08,
          )
          .to(select('[data-services-established]'), { autoAlpha: 1, duration: 0.28, y: 0 }, 0.18)

        if (titleNumber) {
          timeline.to(
            titleNumber,
            {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.34,
              ease: 'power3.out',
              yPercent: 0,
            },
            0.12,
          )
        }

        if (titleSlash) {
          timeline
            .to(
              titleSlash,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.32,
                ease: 'power3.inOut',
                scaleY: 1,
                yPercent: 0,
              },
              0.28,
            )
            .to(titleSlash, { duration: 0.08, ease: 'none', x: 3 }, 0.58)
            .to(titleSlash, { duration: 0.14, ease: 'power2.out', x: 0 }, 0.66)
        }

        if (titleLabel) {
          timeline.to(
            titleLabel,
            {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.46,
              ease: 'power3.out',
              x: 0,
            },
            0.46,
          )
        }

        timeline
          .to(tabs, { duration: 0.38, scaleX: 1, stagger: 0.08 }, 0.56)
          .to(copyLines, { autoAlpha: 1, duration: 0.42, filter: 'blur(0px)', y: 0 }, 0.66)
          .to(
            select('[data-services-map]'),
            { autoAlpha: 1, duration: 0.58, scale: 1, xPercent: 0 },
            0.72,
          )
          .to(
            serviceGrid ? [serviceGrid] : [],
            {
              '--services-grid-corner-alpha': 0.75,
              duration: 0.24,
              ease: 'power2.out',
            },
            0.76,
          )
          .to(
            gridEdgesX,
            {
              duration: 0.56,
              ease: 'power2.inOut',
              scaleX: 1,
              stagger: 0.045,
            },
            0.74,
          )
          .to(
            gridEdgesY,
            {
              duration: 0.56,
              ease: 'power2.inOut',
              scaleY: 1,
              stagger: 0.045,
            },
            0.82,
          )
          .to(
            linesX,
            {
              duration: 0.78,
              ease: 'power2.inOut',
              scaleX: 1,
              stagger: 0.045,
            },
            0.9,
          )
          .to(
            linesY,
            {
              duration: 0.72,
              ease: 'power2.inOut',
              scaleY: 1,
              stagger: 0.055,
            },
            0.98,
          )
          .to(
            cards,
            {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.52,
              ease: 'power3.out',
              stagger: 0.075,
              y: 0,
            },
            1.12,
          )

        cards.forEach((card, index) => {
          const at = 1.2 + index * 0.075
          const bullets = card.querySelectorAll('[data-services-bullet]')
          const cardGraphPaths = gsap.utils.toArray<SVGPathElement>(
            card.querySelectorAll('[data-services-graph]'),
          )
          const motion = card.dataset.servicesCardMotion
          const rate = card.querySelector<HTMLElement>('[data-services-rate]')
          const corners = card.querySelectorAll('[data-services-corner]')

          timeline
            .to(
              card.querySelector('[data-services-number-plate]'),
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.34,
                ease: 'power2.inOut',
              },
              at,
            )
            .to(
              card.querySelector('[data-services-number]'),
              { autoAlpha: 1, duration: 0.22, y: 0 },
              at + 0.03,
            )
            .to(
              card.querySelector('[data-services-code]'),
              { autoAlpha: 1, duration: 0.2, y: 0 },
              at + 0.06,
            )
            .to(
              card.querySelector('[data-services-kicker]'),
              { autoAlpha: 1, duration: 0.26, rotate: -0.7, y: 0 },
              at + 0.07,
            )
            .to(
              card.querySelector('[data-services-icon-box]'),
              { autoAlpha: 1, duration: 0.24, scale: 1 },
              at + 0.08,
            )
            .to(
              card.querySelector('[data-services-icon]'),
              { autoAlpha: 1, duration: 0.26, rotate: 0, scale: 1 },
              at + 0.12,
            )
            .to(
              card.querySelector('[data-services-media-shell]'),
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.42,
                ease: 'power2.inOut',
              },
              at + 0.07,
            )
            .to(
              card.querySelector('[data-services-media]'),
              {
                autoAlpha: 1,
                duration: 0.42,
                filter: 'blur(0px)',
                scale: 1,
                y: 0,
              },
              at + 0.1,
            )
            .to(corners, { autoAlpha: 1, duration: 0.12, stagger: 0.018 }, at + 0.1)
            .to(
              corners,
              {
                '--services-corner-x': 1,
                '--services-corner-y': 1,
                duration: 0.46,
                ease: 'power2.inOut',
                stagger: {
                  amount: 0.11,
                  from: 'center',
                },
              },
              at + 0.12,
            )
            .to(
              card.querySelector('[data-services-card-title]'),
              { autoAlpha: 1, duration: 0.28, x: 0 },
              at + 0.2,
            )
            .to(bullets, { autoAlpha: 1, duration: 0.34, stagger: 0.035, x: 0 }, at + 0.29)
            .to(
              card.querySelector('[data-services-cta-label]'),
              { autoAlpha: 1, duration: 0.24, y: 0 },
              at + 0.39,
            )
            .to(
              card.querySelector('[data-services-arrow]'),
              { autoAlpha: 1, duration: 0.24, x: 0 },
              at + 0.43,
            )

          if (motion === 'investment' && rate) {
            const counter = { value: 0 }

            timeline
              .to(rate, { autoAlpha: 1, duration: 0.24, y: 0 }, at + 0.18)
              .to(
                cardGraphPaths,
                {
                  duration: 0.46,
                  strokeDashoffset: 0,
                },
                at + 0.19,
              )
              .to(
                counter,
                {
                  duration: 0.5,
                  onUpdate: () => {
                    rate.textContent = `${counter.value.toFixed(2)}%`
                  },
                  value: 8.14,
                },
                at + 0.19,
              )
          }

          if (motion === 'mortgage') {
            timeline
              .to(
                card.querySelector('[data-services-shield-pulse]'),
                { autoAlpha: 1, duration: 0.24, scale: 1.1 },
                at + 0.18,
              )
              .to(
                card.querySelector('[data-services-shield-pulse]'),
                { autoAlpha: 0, duration: 0.26, scale: 1.52 },
                at + 0.34,
              )
              .to(
                card.querySelector('[data-services-shield-check]'),
                { autoAlpha: 1, duration: 0.24, scale: 1 },
                at + 0.32,
              )
          }

          if (motion === 'construction') {
            timeline
              .to(
                card.querySelector('[data-services-crane-line]'),
                { duration: 0.32, scaleY: 1 },
                at + 0.18,
              )
              .to(
                card.querySelector('[data-services-crane-hook]'),
                { autoAlpha: 1, duration: 0.34, y: 0 },
                at + 0.28,
              )
              .to(
                card.querySelector('[data-services-media]'),
                { duration: 0.26, rotate: 0.45, yoyo: true, repeat: 1 },
                at + 0.4,
              )
          }

          if (motion === 'partners') {
            timeline
              .to(
                card.querySelector('[data-services-puzzle-piece]'),
                { autoAlpha: 1, duration: 0.34, rotate: 0, x: 0, y: 0 },
                at + 0.18,
              )
              .to(
                card.querySelector('[data-services-handshake-line]'),
                { duration: 0.3, scaleX: 1 },
                at + 0.38,
              )
          }
        })

        timeline.to(select('[data-services-bottom]'), { autoAlpha: 1, duration: 0.42, y: 0 }, 1.92)

        gsap.to(select('[data-services-map]'), {
          ease: 'none',
          scrollTrigger: {
            end: 'bottom top',
            scrub: 1,
            start: 'top bottom',
            trigger: services,
          },
          xPercent: -3,
          yPercent: 2,
        })
      }

      const leadership = document.querySelector<HTMLElement>('[data-fairlend-motion="leadership"]')

      if (leadership) {
        const select = gsap.utils.selector(leadership)
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches
        const kickerNumber = select('[data-leadership-kicker-number]')
        const kickerSlash = select('[data-leadership-kicker-slash]')
        const kickerLabel = select('[data-leadership-kicker-label]')
        const intro = select('[data-leadership-intro]')
        const meta = select('[data-leadership-meta]')
        const ledgerTabs = select('[data-leadership-ledger-tab]')
        const frame = select('[data-leadership-frame]')
        const frameLinesX = select(
          '[data-leadership-frame-line="top"], [data-leadership-frame-line="bottom"]',
        )
        const frameLinesY = select(
          '[data-leadership-frame-line="right"], [data-leadership-frame-line="left"]',
        )
        const mainPanel = select('[data-leadership-main]')
        const visualPanel = leadership.querySelector<HTMLElement>('[data-leadership-visual]')
        const visualImage = visualPanel?.querySelector('img')
        const visualGrid = select('[data-leadership-visual-grid]')
        const visualSweep = select('[data-leadership-visual-sweep]')
        const routeOverlay = select('[data-leadership-route-overlay]')
        const routePaths = gsap.utils.toArray<SVGPathElement>(
          leadership.querySelectorAll('[data-leadership-route-path]'),
        )
        const routeDots = select('.leadership-route-dot')
        const indexMark = select('[data-leadership-index]')
        const copyItems = select('[data-leadership-copy-item]')
        const titleLines = select('[data-leadership-title-line] > span')
        const capabilities = select('[data-leadership-capability]')
        const capabilityIcons = select('[data-leadership-capability-icon]')
        const capabilityTitles = select('[data-leadership-capability-title]')
        const capabilityCopy = select('[data-leadership-capability-copy]')
        const capabilityFlashes = select('[data-leadership-capability-flash]')
        const actions = select('[data-leadership-actions]')
        const cta = select('[data-leadership-cta]')
        const ctaArrow = select('[data-leadership-cta-arrow]')
        const proofGrid = select('[data-leadership-proof-grid]')
        const proofCards = gsap.utils.toArray<HTMLElement>(select('[data-leadership-proof-card]'))
        const footer = select('[data-leadership-footer]')
        const quoteMark = select('[data-leadership-quote-mark]')
        const quoteCopy = select('[data-leadership-quote-copy]')
        const commitments = select('[data-leadership-commitment]')

        gsap.set(kickerNumber, {
          autoAlpha: 0.16,
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 28,
        })
        gsap.set(kickerSlash, {
          autoAlpha: 0.18,
          clipPath: 'inset(0% 0% 100% 0%)',
          scaleY: 0.58,
          transformOrigin: '50% 100%',
        })
        gsap.set(kickerLabel, {
          autoAlpha: 0.12,
          clipPath: 'inset(0% 100% 0% 0%)',
          x: -24,
        })
        gsap.set(intro, { autoAlpha: 0.2, filter: 'blur(5px)', y: 22 })
        gsap.set(meta, {
          autoAlpha: 0.18,
          clipPath: 'inset(0% 0% 0% 100%)',
          x: 18,
        })
        gsap.set(ledgerTabs, {
          autoAlpha: 0.16,
          scaleX: 0.08,
          transformOrigin: 'left center',
        })
        gsap.set(frame, {
          autoAlpha: 1,
          borderColor: 'rgb(8 45 35 / 0%)',
          y: 18,
        })
        gsap.set(frameLinesX, { scaleX: 0 })
        gsap.set(frameLinesY, { scaleY: 0 })
        gsap.set(mainPanel, {
          autoAlpha: 0.2,
          clipPath: 'inset(0% 100% 0% 0%)',
          filter: 'blur(4px)',
          x: -22,
        })
        if (visualPanel) {
          gsap.set(visualPanel, {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 100%)',
            x: 24,
          })
        }
        if (visualImage) {
          gsap.set(visualImage, {
            filter: 'saturate(0.5) contrast(0.88) brightness(1.08)',
            scale: 1.1,
            yPercent: -2,
          })
        }
        gsap.set(visualGrid, { autoAlpha: 0, xPercent: -5 })
        gsap.set(visualSweep, { autoAlpha: 0, skewX: -12, xPercent: -150 })
        gsap.set(routeOverlay, { autoAlpha: 0 })
        routePaths.forEach((path) => {
          const length = path.getTotalLength()

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          })
        })
        gsap.set(routeDots, { autoAlpha: 0, scale: 0.42, transformOrigin: '50% 50%' })
        gsap.set(indexMark, { autoAlpha: 0, scale: 1.24, x: 18 })
        gsap.set(copyItems, { autoAlpha: 0.16, filter: 'blur(5px)', y: 24 })
        gsap.set(titleLines, { autoAlpha: 0.24, yPercent: 112 })
        gsap.set(capabilities, {
          autoAlpha: 0.16,
          clipPath: 'inset(0% 0% 100% 0%)',
          y: 18,
        })
        gsap.set(capabilityIcons, {
          autoAlpha: 0,
          rotate: -8,
          scale: 0.78,
          transformOrigin: '50% 50%',
        })
        gsap.set([...capabilityTitles, ...capabilityCopy], { autoAlpha: 0, y: 8 })
        gsap.set(capabilityFlashes, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center' })
        gsap.set(actions, { autoAlpha: 0.12, scale: 0.96, y: 18 })
        gsap.set(cta, { clipPath: 'inset(0% 100% 0% 0%)' })
        gsap.set(ctaArrow, { rotate: -24, scale: 0.82, transformOrigin: '50% 50%', x: -8 })
        gsap.set(proofGrid, { autoAlpha: 1, x: isDesktop ? 24 : 0, y: isDesktop ? 0 : 18 })
        gsap.set(proofCards, {
          autoAlpha: 0,
          rotateX: isDesktop ? -8 : 0,
          transformPerspective: 1000,
          x: isDesktop ? 36 : 0,
          y: 26,
        })
        proofCards.forEach((card) => {
          const proofValue = card.querySelector<HTMLElement>('[data-leadership-proof-value]')
          const rawValue = proofValue?.dataset.proofValueTarget ?? proofValue?.textContent?.trim()
          const numericValue = rawValue?.match(leadershipProofNumberPattern)

          if (proofValue && numericValue) {
            proofValue.textContent = `${numericValue[1]}0${numericValue[3]}`
          }

          gsap.set(card.querySelector('[data-leadership-proof-pulse]'), {
            autoAlpha: 0,
            scaleX: 0,
          })
          gsap.set(card.querySelector('[data-leadership-proof-icon]'), {
            autoAlpha: 0,
            scale: 0.82,
            x: -12,
          })
          gsap.set(card.querySelector('[data-leadership-proof-value]'), {
            autoAlpha: 0,
            scale: 0.82,
            transformOrigin: 'left bottom',
            y: 10,
          })
          gsap.set(card.querySelector('[data-leadership-proof-label]'), {
            autoAlpha: 0,
            y: 8,
          })
          gsap.set(card.querySelector('[data-leadership-proof-detail]'), {
            autoAlpha: 0,
            filter: 'blur(4px)',
            y: 10,
          })
        })
        gsap.set(footer, {
          autoAlpha: 0.18,
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 18,
        })
        gsap.set(quoteMark, { autoAlpha: 0, scale: 0.7, transformOrigin: 'left center', x: -10 })
        gsap.set(quoteCopy, { autoAlpha: 0.18, x: -24 })
        gsap.set(commitments, { autoAlpha: 0.12, x: 18 })

        const leadershipTimeline = gsap.timeline({
          defaults: { duration: 0.62, ease: 'power3.out' },
          scrollTrigger: isDesktop
            ? {
                anticipatePin: 1,
                end: '+=145%',
                pin: true,
                scrub: 0.85,
                start: 'top top',
                trigger: leadership,
              }
            : {
                end: 'top 22%',
                scrub: 0.6,
                start: 'top 88%',
                trigger: leadership,
              },
        })

        leadershipTimeline
          .to(frameLinesX, { duration: 0.46, ease: 'power2.inOut', scaleX: 1, stagger: 0.08 }, 0)
          .to(
            frameLinesY,
            { duration: 0.48, ease: 'power2.inOut', scaleY: 1, stagger: 0.08 },
            0.08,
          )
          .to(frame, { borderColor: 'rgb(8 45 35 / 34%)', duration: 0.22, y: 0 }, 0.2)
          .to(kickerNumber, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 }, 0)
          .to(
            kickerSlash,
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', scaleY: 1 },
            0.12,
          )
          .to(kickerSlash, { duration: 0.08, ease: 'none', x: 4 }, 0.34)
          .to(kickerSlash, { duration: 0.14, ease: 'power2.out', x: 0 }, 0.42)
          .to(kickerLabel, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', x: 0 }, 0.2)
          .to(intro, { autoAlpha: 1, filter: 'blur(0px)', y: 0 }, 0.3)
          .to(meta, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', x: 0 }, 0.32)
          .to(ledgerTabs, { autoAlpha: 1, scaleX: 1, stagger: 0.045 }, 0.4)
          .to(
            mainPanel,
            {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: 'blur(0px)',
              x: 0,
            },
            0.52,
          )
          .to(
            visualPanel,
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', x: 0 },
            0.66,
          )
          .to(
            visualImage ? [visualImage] : [],
            {
              duration: 0.92,
              filter: 'saturate(1) contrast(1) brightness(1)',
              scale: 1.025,
              yPercent: 0,
            },
            0.68,
          )
          .to(visualGrid, { autoAlpha: 0.58, duration: 0.42, xPercent: 0 }, 0.72)
          .to(visualSweep, { autoAlpha: 0.82, duration: 0.18 }, 0.8)
          .to(
            visualSweep,
            { duration: 0.74, ease: 'power2.inOut', xPercent: 320 },
            0.82,
          )
          .to(visualSweep, { autoAlpha: 0, duration: 0.18 }, 1.42)
          .to(routeOverlay, { autoAlpha: 1, duration: 0.22 }, 0.9)
          .to(
            routePaths,
            { duration: 0.72, ease: 'power2.inOut', strokeDashoffset: 0 },
            0.92,
          )
          .to(
            routeDots,
            { autoAlpha: 1, duration: 0.18, scale: 1, stagger: 0.055 },
            1.18,
          )
          .to(visualGrid, { autoAlpha: 0.28, duration: 0.32 }, 1.34)
          .to(indexMark, { autoAlpha: 1, scale: 1, x: 0 }, 0.72)
          .to(copyItems, { autoAlpha: 1, filter: 'blur(0px)', stagger: 0.06, y: 0 }, 0.76)
          .to(
            titleLines,
            {
              autoAlpha: 1,
              duration: 0.64,
              ease: 'expo.out',
              stagger: 0.08,
              yPercent: 0,
            },
            0.86,
          )

        capabilities.forEach((capability, index) => {
          const at = 1.28 + index * 0.075
          const icon = capability.querySelector('[data-leadership-capability-icon]')
          const title = capability.querySelector('[data-leadership-capability-title]')
          const copy = capability.querySelector('[data-leadership-capability-copy]')
          const flash = capability.querySelector('[data-leadership-capability-flash]')

          leadershipTimeline
            .to(
              capability,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.42,
                y: 0,
              },
              at,
            )
            .to(icon, { autoAlpha: 1, duration: 0.24, rotate: 0, scale: 1, x: 0 }, at + 0.04)
            .to(title, { autoAlpha: 1, duration: 0.24, y: 0 }, at + 0.08)
            .to(copy, { autoAlpha: 1, duration: 0.3, y: 0 }, at + 0.12)
            .to(flash, { autoAlpha: 1, duration: 0.1, scaleX: 1 }, at + 0.1)
            .to(flash, { autoAlpha: 0, duration: 0.28, xPercent: 92 }, at + 0.2)
        })

        leadershipTimeline
          .to(actions, { autoAlpha: 1, duration: 0.34, scale: 1, y: 0 }, 1.74)
          .to(cta, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32 }, 1.78)
          .to(ctaArrow, { duration: 0.3, rotate: 0, scale: 1, x: 0 }, 1.86)
          .to(proofGrid, { autoAlpha: 1, duration: 0.36, x: 0, y: 0 }, 1.36)

        proofCards.forEach((card, index) => {
          const at = 1.5 + index * 0.13
          const proofValue = card.querySelector<HTMLElement>('[data-leadership-proof-value]')
          const rawValue = proofValue?.dataset.proofValueTarget ?? proofValue?.textContent?.trim()
          const numericValue = rawValue?.match(leadershipProofNumberPattern)

          leadershipTimeline
            .to(
              card,
              {
                autoAlpha: 1,
                duration: 0.46,
                ease: 'power3.out',
                rotateX: 0,
                x: 0,
                y: 0,
              },
              at,
            )
            .to(
              card.querySelector('[data-leadership-proof-icon]'),
              { autoAlpha: 1, duration: 0.24, scale: 1, x: 0 },
              at + 0.04,
            )
            .to(
              card.querySelector('[data-leadership-proof-value]'),
              { autoAlpha: 1, duration: 0.24, scale: 1, y: 0 },
              at + 0.1,
            )
            .to(
              card.querySelector('[data-leadership-proof-label]'),
              { autoAlpha: 1, duration: 0.2, y: 0 },
              at + 0.16,
            )
            .to(
              card.querySelector('[data-leadership-proof-detail]'),
              { autoAlpha: 1, duration: 0.3, filter: 'blur(0px)', y: 0 },
              at + 0.2,
            )
            .to(
              card.querySelector('[data-leadership-proof-pulse]'),
              { autoAlpha: 0.8, duration: 0.1, scaleX: 1 },
              at + 0.24,
            )
            .to(
              card.querySelector('[data-leadership-proof-pulse]'),
              { autoAlpha: 0, duration: 0.26, xPercent: 92 },
              at + 0.34,
            )

          if (proofValue && numericValue) {
            const [, prefix, target, suffix] = numericValue
            const targetValue = Number(target)
            const counter = { value: 0 }

            leadershipTimeline.to(
              counter,
              {
                duration: 0.48,
                ease: 'power2.out',
                onUpdate: () => {
                  const current = Number.isInteger(targetValue)
                    ? Math.round(counter.value).toString()
                    : counter.value.toFixed(1)

                  proofValue.textContent = `${prefix}${current}${suffix}`
                },
                value: targetValue,
              },
              at + 0.12,
            )
          }
        })

        leadershipTimeline
          .to(footer, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 }, 2.18)
          .to(quoteMark, { autoAlpha: 1, duration: 0.26, scale: 1, x: 0 }, 2.28)
          .to(quoteCopy, { autoAlpha: 1, duration: 0.44, x: 0 }, 2.36)
          .to(commitments, { autoAlpha: 1, duration: 0.34, stagger: 0.055, x: 0 }, 2.48)

        if (visualImage) {
          gsap.to(visualPanel ? [visualPanel] : [], {
            ease: 'none',
            scrollTrigger: {
              end: 'bottom top',
              scrub: 1,
              start: isDesktop ? 'top top' : 'top bottom',
              trigger: leadership,
            },
            yPercent: isDesktop ? -2 : -1,
          })
        }

        gsap.to(proofGrid, {
          ease: 'none',
          scrollTrigger: {
            end: 'bottom top',
            scrub: 1,
            start: isDesktop ? 'top top' : 'top bottom',
            trigger: leadership,
          },
          yPercent: isDesktop ? 1.5 : 0.75,
        })
      }

      const aboutStory = document.querySelector<HTMLElement>('[data-about-motion="story"]')

      if (aboutStory) {
        const select = gsap.utils.selector(aboutStory)
        const whoSection =
          aboutStory.querySelector<HTMLElement>('[data-about-section="about-who"]') ?? aboutStory
        const financeSection =
          aboutStory.querySelector<HTMLElement>('[data-about-section="about-finance"]') ??
          aboutStory
        const whoNumber = select('[data-about-kicker-number="who"]')
        const whoSlash = select('[data-about-kicker-slash="who"]')
        const whoLabel = select('[data-about-kicker-label="who"]')
        const financeNumber = select('[data-about-kicker-number="finance"]')
        const financeSlash = select('[data-about-kicker-slash="finance"]')
        const financeLabel = select('[data-about-kicker-label="finance"]')
        const whoCopyLines = select('[data-about-who-copy-line]')
        const skyline = aboutStory.querySelector<HTMLElement>('[data-about-skyline]')
        const expertisePanel = aboutStory.querySelector<HTMLElement>('[data-about-expertise-panel]')
        const expertiseCorners = select('[data-about-expertise-corner]')
        const expertiseItems = gsap.utils.toArray<HTMLElement>(
          select('[data-about-expertise-item]'),
        )
        const expertiseIcons = select('[data-about-expertise-icon]')
        const financeCards = gsap.utils.toArray<HTMLElement>(select('[data-about-finance-card]'))

        const revealDefaults = {
          duration: 0.72,
          ease: 'power3.out',
        }

        const primeWhoReveal = () => {
          gsap.set(whoNumber, {
            autoAlpha: 0.12,
            clipPath: 'inset(100% 0% 0% 0%)',
          })
          gsap.set(whoSlash, {
            autoAlpha: 0.12,
            clipPath: 'inset(0% 0% 100% 0%)',
            scaleY: 0.72,
            transformOrigin: '50% 100%',
          })
          gsap.set(whoLabel, {
            autoAlpha: 0.12,
            clipPath: 'inset(0% 100% 0% 0%)',
            x: -18,
          })
          if (skyline) {
            gsap.set(skyline, {
              autoAlpha: 0.2,
              scale: 1.04,
              yPercent: 10,
            })
          }
          gsap.set(whoCopyLines, {
            autoAlpha: 0.16,
            filter: 'blur(5px)',
            x: -26,
          })
          if (expertisePanel) {
            gsap.set(expertisePanel, {
              autoAlpha: 0.16,
              clipPath: 'inset(0% 100% 0% 0%)',
              x: -22,
            })
          }
          gsap.set(expertiseCorners, {
            autoAlpha: 0,
            scale: 0.82,
          })
          gsap.set(expertiseItems, {
            autoAlpha: 0.16,
            rotateX: -5,
            transformPerspective: 900,
            y: 22,
          })
          gsap.set(expertiseIcons, {
            rotate: -6,
            scale: 0.78,
          })
        }

        const primeFinanceReveal = () => {
          gsap.set(financeNumber, {
            autoAlpha: 0.12,
            clipPath: 'inset(100% 0% 0% 0%)',
          })
          gsap.set(financeSlash, {
            autoAlpha: 0.12,
            clipPath: 'inset(0% 0% 100% 0%)',
            scaleY: 0.72,
            transformOrigin: '50% 100%',
          })
          gsap.set(financeLabel, {
            autoAlpha: 0.12,
            clipPath: 'inset(0% 100% 0% 0%)',
            x: -18,
          })
          gsap.set(financeCards, {
            autoAlpha: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
            rotateX: -4,
            transformPerspective: 900,
            y: 34,
          })

          financeCards.forEach((card) => {
            gsap.set(card.querySelector('[data-about-finance-icon]'), {
              autoAlpha: 0,
              scale: 0.78,
              x: -18,
            })
            gsap.set(card.querySelector('[data-about-finance-tag]'), {
              autoAlpha: 0,
              x: -12,
            })
            gsap.set(card.querySelector('[data-about-finance-title]'), {
              autoAlpha: 0,
              clipPath: 'inset(0% 100% 0% 0%)',
              x: -16,
            })
            gsap.set(card.querySelector('[data-about-finance-description]'), {
              autoAlpha: 0,
              filter: 'blur(4px)',
              x: -12,
            })
            gsap.set(card.querySelector('[data-about-finance-arrow]'), {
              autoAlpha: 0,
              scale: 0.72,
              x: -12,
            })
          })
        }

        const animateWho = (timeline: gsap.core.Timeline, offset = 0) => {
          timeline
            .fromTo(
              whoNumber,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(100% 0% 0% 0%)',
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.34,
              },
              offset,
            )
            .fromTo(
              whoSlash,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(0% 0% 100% 0%)',
                scaleY: 0.72,
                transformOrigin: '50% 100%',
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.3,
                scaleY: 1,
              },
              offset + 0.16,
            )
            .fromTo(
              whoLabel,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(0% 100% 0% 0%)',
                x: -18,
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.44,
                x: 0,
              },
              offset + 0.32,
            )
            .fromTo(
              skyline ? [skyline] : [],
              {
                autoAlpha: 0.2,
                scale: 1.04,
                yPercent: 10,
              },
              {
                autoAlpha: 1,
                duration: 0.72,
                scale: 1,
                yPercent: 0,
              },
              offset + 0.36,
            )
            .fromTo(
              whoCopyLines,
              {
                autoAlpha: 0.16,
                filter: 'blur(5px)',
                x: -26,
              },
              {
                autoAlpha: 1,
                duration: 0.58,
                filter: 'blur(0px)',
                stagger: 0.08,
                x: 0,
              },
              offset + 0.52,
            )
            .fromTo(
              expertisePanel ? [expertisePanel] : [],
              {
                autoAlpha: 0.16,
                clipPath: 'inset(0% 100% 0% 0%)',
                x: -22,
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.58,
                x: 0,
              },
              offset + 0.78,
            )
            .fromTo(
              expertiseCorners,
              {
                autoAlpha: 0,
                scale: 0.82,
              },
              {
                autoAlpha: 1,
                duration: 0.24,
                scale: 1,
                stagger: 0.035,
              },
              offset + 0.92,
            )
            .fromTo(
              expertiseItems,
              {
                autoAlpha: 0.16,
                rotateX: -5,
                transformPerspective: 900,
                y: 22,
              },
              {
                autoAlpha: 1,
                duration: 0.48,
                rotateX: 0,
                stagger: 0.075,
                y: 0,
              },
              offset + 0.98,
            )
            .fromTo(
              expertiseIcons,
              {
                rotate: -6,
                scale: 0.78,
              },
              {
                duration: 0.34,
                rotate: 0,
                scale: 1,
                stagger: 0.075,
              },
              offset + 1.06,
            )
        }

        const animateFinance = (timeline: gsap.core.Timeline, offset = 0) => {
          timeline
            .fromTo(
              financeNumber,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(100% 0% 0% 0%)',
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.32,
              },
              offset,
            )
            .fromTo(
              financeSlash,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(0% 0% 100% 0%)',
                scaleY: 0.72,
                transformOrigin: '50% 100%',
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.28,
                scaleY: 1,
              },
              offset + 0.14,
            )
            .fromTo(
              financeLabel,
              {
                autoAlpha: 0.12,
                clipPath: 'inset(0% 100% 0% 0%)',
                x: -18,
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.42,
                x: 0,
              },
              offset + 0.28,
            )
            .fromTo(
              financeCards,
              {
                autoAlpha: 0.16,
                clipPath: 'inset(0% 0% 100% 0%)',
                rotateX: -4,
                transformPerspective: 900,
                y: 34,
              },
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.46,
                ease: 'power3.out',
                rotateX: 0,
                stagger: 0.065,
                y: 0,
              },
              offset + 0.42,
            )

          financeCards.forEach((card, index) => {
            const at = offset + 0.5 + index * 0.065

            timeline
              .fromTo(
                card.querySelector('[data-about-finance-icon]'),
                {
                  autoAlpha: 0,
                  scale: 0.78,
                  x: -18,
                },
                {
                  autoAlpha: 1,
                  duration: 0.28,
                  scale: 1,
                  x: 0,
                },
                at,
              )
              .fromTo(
                card.querySelector('[data-about-finance-tag]'),
                {
                  autoAlpha: 0,
                  x: -12,
                },
                {
                  autoAlpha: 1,
                  duration: 0.22,
                  x: 0,
                },
                at + 0.04,
              )
              .fromTo(
                card.querySelector('[data-about-finance-title]'),
                {
                  autoAlpha: 0,
                  clipPath: 'inset(0% 100% 0% 0%)',
                  x: -16,
                },
                {
                  autoAlpha: 1,
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: 0.3,
                  x: 0,
                },
                at + 0.08,
              )
              .fromTo(
                card.querySelector('[data-about-finance-description]'),
                {
                  autoAlpha: 0,
                  filter: 'blur(4px)',
                  x: -12,
                },
                {
                  autoAlpha: 1,
                  duration: 0.3,
                  filter: 'blur(0px)',
                  x: 0,
                },
                at + 0.15,
              )
              .fromTo(
                card.querySelector('[data-about-finance-arrow]'),
                {
                  autoAlpha: 0,
                  scale: 0.72,
                  x: -12,
                },
                {
                  autoAlpha: 1,
                  duration: 0.22,
                  scale: 1,
                  x: 0,
                },
                at + 0.2,
              )
          })
        }

        const aboutMedia = gsap.matchMedia()

        aboutMedia.add('(min-width: 1401px)', () => {
          primeWhoReveal()
          primeFinanceReveal()

          const storyTimeline = gsap.timeline({
            defaults: revealDefaults,
            scrollTrigger: {
              anticipatePin: 1,
              end: '+=105%',
              pin: true,
              scrub: 0.85,
              start: 'top top',
              trigger: aboutStory,
            },
          })

          animateWho(storyTimeline, 0)
          animateFinance(storyTimeline, 1.28)
        })

        aboutMedia.add('(max-width: 1400px)', () => {
          primeWhoReveal()
          primeFinanceReveal()

          const whoTimeline = gsap.timeline({
            defaults: revealDefaults,
            scrollTrigger: {
              once: true,
              start: 'top 72%',
              trigger: whoSection,
            },
          })
          const financeTimeline = gsap.timeline({
            defaults: revealDefaults,
            scrollTrigger: {
              once: true,
              start: 'top 48%',
              trigger: financeSection,
            },
          })

          animateWho(whoTimeline, 0)
          animateFinance(financeTimeline, 0)
        })

        if (skyline) {
          gsap.to(skyline, {
            ease: 'none',
            scrollTrigger: {
              end: 'bottom top',
              scrub: 1,
              start: 'top bottom',
              trigger: aboutStory,
            },
            xPercent: 2.5,
            yPercent: -4,
          })
        }
      }
    })

    window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => context.revert()
  }, [])

  return null
}
