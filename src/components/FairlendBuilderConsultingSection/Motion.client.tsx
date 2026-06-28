'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const counterSpecs = {
  land: { from: 2.45, to: 1.85, format: (value: number) => `$${value.toFixed(2)}M` },
  build: { from: 425, to: 315, format: (value: number) => `$${Math.round(value)}` },
  sale: { from: 3.65, to: 4.65, format: (value: number) => `$${value.toFixed(2)}M` },
  soft: { from: 310, to: 225, format: (value: number) => `$${Math.round(value)}K` },
  carry: { from: 185, to: 105, format: (value: number) => `$${Math.round(value)}K` },
  finance: { from: 65, to: 70, format: (value: number) => `${Math.round(value)}%` },
  outcome: {
    from: -412,
    to: 645,
    format: (value: number) => {
      const rounded = Math.round(value)
      return rounded < 0 ? `-$${Math.abs(rounded)}K` : `$${rounded}K`
    },
  },
  margin: { from: -10.8, to: 14.6, format: (value: number) => `${value.toFixed(1)}%` },
} satisfies Record<string, { from: number; to: number; format: (value: number) => string }>

export function FairlendBuilderConsultingMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-builder-consulting]')
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      const select = gsap.utils.selector(section)
      const leftTrack = section.querySelector<HTMLElement>('[data-builder-left-track]')
      const bottomTrack = section.querySelector<HTMLElement>('[data-builder-bottom-track]')
      const dashboard = section.querySelector<HTMLElement>('[data-builder-dashboard]')
      const problemCopy = section.querySelector<HTMLElement>(
        '[data-builder-copy-panel][data-builder-state="problem"]',
      )
      const solutionCopy = section.querySelector<HTMLElement>(
        '[data-builder-copy-panel][data-builder-state="solution"]',
      )
      const connectorLines = select('[data-builder-connector]')
      const problemActionCards = select('[data-builder-action-card="problem"]')
      const solutionActionCards = select('[data-builder-action-card="solution"]')
      const house = section.querySelector('[data-builder-house]')

      if (!isDesktop) {
        const mobileCard = section.querySelector<HTMLElement>('[data-builder-mobile-card]')
        const mobileDashboard = section.querySelector<HTMLElement>('[data-builder-mobile-dashboard]')
        const mobileProblemCopy = section.querySelector<HTMLElement>(
          '[data-builder-mobile-copy][data-builder-state="problem"]',
        )
        const mobileSolutionCopy = section.querySelector<HTMLElement>(
          '[data-builder-mobile-copy][data-builder-state="solution"]',
        )

        gsap.set(section, { '--builder-progress': 0 })
        if (mobileCard) gsap.set(mobileCard, { y: 0 })
        if (mobileDashboard) gsap.set(mobileDashboard, { scale: 0.992, y: 8 })
        if (mobileProblemCopy) {
          gsap.set(mobileProblemCopy, {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            pointerEvents: 'auto',
            scale: 1,
            transformOrigin: 'left top',
            y: 0,
            zIndex: 4,
          })
        }
        if (mobileSolutionCopy) {
          gsap.set(mobileSolutionCopy, {
            autoAlpha: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
            pointerEvents: 'none',
            scale: 1,
            transformOrigin: 'left top',
            y: 18,
            zIndex: 5,
          })
        }

        const mobileTimeline = gsap.timeline({ defaults: { ease: 'none' } })

        mobileTimeline
          .to(section, { '--builder-progress': 1, duration: 0.74 }, 0.14)
          .to(mobileDashboard, { duration: 0.24, scale: 0.985, y: -8 }, 0.1)
          .to(
            mobileProblemCopy,
            {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 0.24,
              scale: 0.985,
              y: -22,
            },
            0.22,
          )
          .set(mobileProblemCopy, { autoAlpha: 0, pointerEvents: 'none' }, 0.48)
          .set(mobileSolutionCopy, { autoAlpha: 1, pointerEvents: 'auto' }, 0.52)
          .to(
            mobileSolutionCopy,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.28,
              y: 0,
            },
            0.54,
          )
          .to(mobileDashboard, { duration: 0.28, scale: 1, y: 0 }, 0.58)
          .to({}, { duration: 0.28 }, 1)

        Object.entries(counterSpecs).forEach(([key, spec]) => {
          const targets = gsap.utils.toArray<HTMLElement>(select(`[data-builder-counter="${key}"]`))

          targets.forEach((target) => {
            const counter = { value: spec.from }
            target.textContent = spec.format(spec.from)

            mobileTimeline.to(
              counter,
              {
                duration: 0.56,
                onUpdate: () => {
                  target.textContent = spec.format(counter.value)
                },
                value: spec.to,
              },
              0.24,
            )
          })
        })

        gsap.utils.toArray<HTMLElement>(select('[data-builder-compact-score]')).forEach((score) => {
          const fill = score.querySelector<HTMLElement>('[data-builder-compact-score-fill]')
          const scoreText = score.querySelector<HTMLElement>('[data-builder-compact-score-text]')
          const from = Number(score.dataset.problemScore ?? 0)
          const to = Number(score.dataset.solutionScore ?? from)
          const scoreCounter = { value: from }

          if (fill) fill.style.setProperty('--builder-card-score', `${from}%`)
          if (scoreText) scoreText.textContent = `${Math.round(from)}%`

          mobileTimeline.to(
            scoreCounter,
            {
              duration: 0.58,
              onUpdate: () => {
                const value = Math.max(0, Math.min(100, scoreCounter.value))
                if (fill) fill.style.setProperty('--builder-card-score', `${value}%`)
                if (scoreText) scoreText.textContent = `${Math.round(value)}%`
              },
              value: to,
            },
            0.26,
          )
        })

        const mobileScrollTrigger = ScrollTrigger.create({
          animation: mobileTimeline,
          anticipatePin: 1,
          end: '+=185%',
          invalidateOnRefresh: true,
          pin: true,
          refreshPriority: 20,
          scrub: 1,
          start: 'top top',
          trigger: section,
        })

        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          mobileTimeline.progress(mobileScrollTrigger.progress)
        })
        return
      }

      gsap.set(section, { '--builder-progress': 0 })
      if (leftTrack) gsap.set(leftTrack, { yPercent: 0 })
      if (bottomTrack) gsap.set(bottomTrack, { yPercent: 0 })
      if (dashboard) gsap.set(dashboard, { y: 0 })
      if (problemCopy) {
        gsap.set(problemCopy, {
          autoAlpha: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          pointerEvents: 'auto',
          scale: 1,
          transformOrigin: 'left top',
          y: 0,
          zIndex: 4,
        })
      }
      if (solutionCopy) {
        gsap.set(solutionCopy, {
          autoAlpha: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          pointerEvents: 'none',
          scale: 1,
          transformOrigin: 'left top',
          y: 0,
          zIndex: 5,
        })
      }
      gsap.set(problemActionCards, { x: 0, y: 0, rotate: 0, scale: 1 })
      gsap.set(solutionActionCards, { y: 16, scale: 0.985 })
      gsap.set(connectorLines, { scaleX: 0.72, transformOrigin: 'left center' })
      if (house) gsap.set(house, { scale: 0.985, transformOrigin: 'center center' })

      const timeline = gsap.timeline({ defaults: { ease: 'none' } })

      timeline
        .to(connectorLines, { duration: 0.16, scaleX: 1 }, 0)
        .to(house, { duration: 0.24, scale: 1 }, 0)
        .to(section, { '--builder-progress': 1, duration: 0.74 }, 0.18)
        .to(
          problemActionCards,
          {
            duration: 0.2,
            rotate: -1.4,
            scale: 0.955,
            stagger: 0.025,
            x: -24,
            y: -10,
          },
          0.1,
        )
        .to(
          problemCopy,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.24,
            scale: 0.982,
            y: -34,
          },
          0.24,
        )
        .set(problemCopy, { autoAlpha: 0, pointerEvents: 'none' }, 0.49)
        .set(solutionCopy, { autoAlpha: 1, pointerEvents: 'auto' }, 0.53)
        .to(
          solutionCopy,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.26,
            y: 0,
          },
          0.54,
        )
        .to(solutionActionCards, { duration: 0.22, scale: 1, stagger: 0.022, y: 0 }, 0.62)
        .to({}, { duration: 0.3 }, 1)

      if (leftTrack) timeline.to(leftTrack, { duration: 0.01, yPercent: 0 }, 0)
      if (bottomTrack) timeline.to(bottomTrack, { duration: 0.26, yPercent: -50 }, 0.58)

      Object.entries(counterSpecs).forEach(([key, spec]) => {
        const targets = gsap.utils.toArray<HTMLElement>(select(`[data-builder-counter="${key}"]`))

        targets.forEach((target) => {
          const counter = { value: spec.from }
          target.textContent = spec.format(spec.from)

          timeline.to(
            counter,
            {
              duration: 0.56,
              onUpdate: () => {
                target.textContent = spec.format(counter.value)
              },
              value: spec.to,
            },
            0.24,
          )
        })
      })

      gsap.utils.toArray<HTMLElement>(select('[data-builder-gauge]')).forEach((gauge) => {
        const valuePath = gauge.querySelector<SVGPathElement>('[data-builder-gauge-value]')
        const innerPath = gauge.querySelector<SVGPathElement>('[data-builder-gauge-inner]')
        const scoreText = gauge.querySelector<HTMLElement>('[data-builder-gauge-score]')
        const from = Number(gauge.dataset.problemScore ?? 0)
        const to = Number(gauge.dataset.solutionScore ?? from)
        const gaugeCounter = { value: from }

        if (valuePath) valuePath.setAttribute('stroke-dasharray', `${from} ${100 - from}`)
        if (innerPath) innerPath.setAttribute('stroke-dasharray', `${Math.max(18, from - 14)} 100`)
        if (scoreText) scoreText.textContent = `${Math.round(from)}%`

        timeline.to(
          gaugeCounter,
          {
            duration: 0.58,
            onUpdate: () => {
              const value = Math.max(0, Math.min(100, gaugeCounter.value))
              if (valuePath) valuePath.setAttribute('stroke-dasharray', `${value} ${100 - value}`)
              if (innerPath) {
                innerPath.setAttribute('stroke-dasharray', `${Math.max(18, value - 14)} 100`)
              }
              if (scoreText) scoreText.textContent = `${Math.round(value)}%`
            },
            value: to,
          },
          0.26,
        )
      })

      gsap.utils.toArray<SVGPathElement>(select('[data-builder-line]')).forEach((path) => {
        const solutionPath = path.dataset.solutionPath
        if (!solutionPath) return
        timeline.to(path, { attr: { d: solutionPath }, duration: 0.58 }, 0.26)
      })

      gsap.utils.toArray<SVGPathElement>(select('[data-builder-line-area]')).forEach((path) => {
        const solutionPath = path.dataset.solutionPath
        if (!solutionPath) return
        timeline.to(path, { attr: { d: solutionPath }, duration: 0.58 }, 0.26)
      })

      const scrollTrigger = ScrollTrigger.create({
        animation: timeline,
        anticipatePin: 1,
        end: '+=230%',
        invalidateOnRefresh: true,
        pin: true,
        refreshPriority: 20,
        scrub: 1.05,
        start: 'top top',
        trigger: section,
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        timeline.progress(scrollTrigger.progress)
      })
    })

    return () => context.revert()
  }, [])

  return null
}
