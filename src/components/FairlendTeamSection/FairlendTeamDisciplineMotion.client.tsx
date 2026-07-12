'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

const teamSectionSelector = '[data-testid="fairlend-team-section"]'

const animatedElementSelector = [
  '[data-team-illustration]',
  '[data-team-illustration-scan]',
  '[data-team-title-line]',
  '[data-team-statement-rule]',
  '[data-team-statement-copy]',
  '[data-team-spine]',
  '[data-team-spine-node]',
  '[data-team-member]',
  '[data-team-portrait]',
  '[data-team-member-copy]',
  '[data-team-name-rule]',
  '[data-plate-line]',
  '[data-plate-meta]',
  '[data-plate-code]',
  '[data-plate-detail]',
  '[data-plate-signal]',
  '[data-team-plate-label]',
].join(', ')

function revealImmediately(section: HTMLElement) {
  gsap.set(section.querySelectorAll(animatedElementSelector), { clearProps: 'all' })
  section.querySelectorAll<HTMLElement>('[data-team-plate]').forEach((plate) => {
    plate.dataset.teamPlateDrawn = 'true'
  })
  section.dataset.teamMotion = 'reduced'
}

function addPlateDraft(timeline: gsap.core.Timeline, plate: HTMLElement, position: number) {
  const discipline = plate.closest<HTMLElement>('.fairlend-team__discipline')
  if (!discipline) return

  const horizontalLines = gsap.utils.toArray<HTMLElement>(
    plate.querySelectorAll<HTMLElement>('[data-plate-line][data-axis="x"]'),
  )
  const verticalLines = gsap.utils.toArray<HTMLElement>(
    plate.querySelectorAll<HTMLElement>('[data-plate-line][data-axis="y"]'),
  )
  const meta = gsap.utils.toArray<HTMLElement>(
    plate.querySelectorAll<HTMLElement>('[data-plate-meta]'),
  )
  const code = plate.querySelector<HTMLElement>('[data-plate-code]')
  const details = gsap.utils.toArray<HTMLElement>(
    plate.querySelectorAll<HTMLElement>('[data-plate-detail]'),
  )
  const signals = gsap.utils.toArray<HTMLElement>(
    plate.querySelectorAll<HTMLElement>('[data-plate-signal]'),
  )
  const label = discipline.querySelector<HTMLElement>('[data-team-plate-label]')

  if (horizontalLines.length) {
    gsap.set(horizontalLines, { scaleX: 0.08, transformOrigin: '0% 50%' })
  }
  if (verticalLines.length) {
    gsap.set(verticalLines, { scaleY: 0.08, transformOrigin: '50% 0%' })
  }
  if (meta.length) gsap.set(meta, { opacity: 0.42, y: 4 })
  if (code) gsap.set(code, { clipPath: 'inset(0 72% 0 0)', opacity: 0.45 })
  if (details.length) gsap.set(details, { opacity: 0.38, y: 4 })
  if (signals.length) {
    gsap.set(signals, { opacity: 0.32, scale: 0.45, transformOrigin: '50% 50%' })
  }
  if (label) gsap.set(label, { clipPath: 'inset(0 68% 0 0)', opacity: 0.45 })

  if (horizontalLines.length) {
    timeline.to(
      horizontalLines,
      { duration: 0.32, ease: 'power3.out', scaleX: 1, stagger: 0.018 },
      position,
    )
  }
  if (verticalLines.length) {
    timeline.to(
      verticalLines,
      { duration: 0.34, ease: 'power3.out', scaleY: 1, stagger: 0.018 },
      position + 0.06,
    )
  }
  if (meta.length) {
    timeline.to(
      meta,
      { duration: 0.24, ease: 'power3.out', opacity: 1, stagger: 0.025, y: 0 },
      position + 0.12,
    )
  }

  if (code) {
    timeline.to(
      code,
      { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power4.out', opacity: 1 },
      position + 0.2,
    )
  }

  if (details.length) {
    timeline.to(
      details,
      { duration: 0.28, ease: 'power3.out', opacity: 1, stagger: 0.025, y: 0 },
      position + 0.42,
    )
  }
  if (signals.length) {
    timeline.to(
      signals,
      { duration: 0.22, ease: 'power3.out', opacity: 1, scale: 1, stagger: 0.035 },
      position + 0.56,
    )
  }

  if (label) {
    timeline.to(
      label,
      { clipPath: 'inset(0 0% 0 0)', duration: 0.32, ease: 'power4.out', opacity: 1 },
      position + 0.64,
    )
  }
}

export function FairlendTeamDisciplineMotion() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const section = markerRef.current?.closest<HTMLElement>(teamSectionSelector)
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches) {
      revealImmediately(section)
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    section.dataset.teamMotion = 'ready'

    const context = gsap.context(() => {
      const illustration = section.querySelector<HTMLElement>('[data-team-illustration]')
      const illustrationImage = section.querySelector<HTMLElement>(
        '.fairlend-team__illustration-image',
      )
      const scan = section.querySelector<HTMLElement>('[data-team-illustration-scan]')
      const titleLines = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll<HTMLElement>('[data-team-title-line]'),
      )
      const statementRule = section.querySelector<HTMLElement>('[data-team-statement-rule]')
      const statementCopy = section.querySelector<HTMLElement>('[data-team-statement-copy]')
      const spine = section.querySelector<HTMLElement>('[data-team-spine]')
      const spineNodes = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll<HTMLElement>('[data-team-spine-node]'),
      )

      gsap.set(titleLines, { opacity: 0.48, yPercent: 24 })
      if (statementRule) {
        gsap.set(statementRule, { scaleX: 0.12, transformOrigin: '0% 50%' })
      }
      if (statementCopy) gsap.set(statementCopy, { opacity: 0.58, y: 12 })
      if (illustrationImage) {
        gsap.set(illustrationImage, {
          filter: 'grayscale(1) contrast(0.88) brightness(1.08)',
          scale: 1.055,
          transformOrigin: '0% 50%',
          x: -10,
        })
      }
      if (scan) gsap.set(scan, { opacity: 0, x: 0 })
      if (spine) gsap.set(spine, { scaleY: 0.06, transformOrigin: '50% 0%' })
      gsap.set(spineNodes, { opacity: 0.35, scale: 0.45 })

      const intro = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: {
          once: true,
          start: 'top 74%',
          trigger: section,
        },
      })

      if (illustrationImage) {
        intro.to(
          illustrationImage,
          {
            duration: 1.05,
            filter: 'grayscale(1) contrast(1) brightness(1)',
            scale: 1,
            x: 0,
          },
          0,
        )
      }
      if (scan && illustration) {
        intro
          .to(scan, { duration: 0.12, opacity: 0.72 }, 0.08)
          .to(
            scan,
            { duration: 0.82, ease: 'power2.inOut', x: () => illustration.clientWidth * 0.78 },
            0.08,
          )
          .to(scan, { duration: 0.18, opacity: 0 }, 0.78)
      }

      intro.to(titleLines, { duration: 0.7, opacity: 1, stagger: 0.08, yPercent: 0 }, 0.1)
      if (statementRule) intro.to(statementRule, { duration: 0.52, scaleX: 1 }, 0.38)
      if (statementCopy) {
        intro.to(statementCopy, { duration: 0.68, opacity: 1, y: 0 }, 0.44)
      }

      if (spine) {
        gsap.to(spine, {
          ease: 'none',
          scaleY: 1,
          scrollTrigger: {
            end: 'bottom 72%',
            scrub: 0.45,
            start: 'top 68%',
            trigger: section,
          },
        })
      }

      spineNodes.forEach((node) => {
        gsap.to(node, {
          duration: 0.24,
          ease: 'power3.out',
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            once: true,
            start: 'top 80%',
            trigger: node,
          },
        })
      })

      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll<HTMLElement>('[data-team-member]'),
      )

      rows.forEach((row) => {
        const portrait = row.querySelector<HTMLElement>('[data-team-portrait]')
        const portraitInk = row.querySelector<HTMLElement>('.fairlend-team__portrait-ink')
        const copy = row.querySelector<HTMLElement>('[data-team-member-copy]')
        const copyItems = gsap.utils.toArray<HTMLElement>(
          row.querySelectorAll<HTMLElement>(
            '[data-team-member-name], [data-team-member-role], [data-team-member-responsibility]',
          ),
        )
        const nameRule = row.querySelector<HTMLElement>('[data-team-name-rule]')
        const plate = row.querySelector<HTMLElement>('[data-team-plate]')

        gsap.set(row, { opacity: 0.78, y: 18 })
        if (portrait) gsap.set(portrait, { clipPath: 'inset(0 12% 0 0)' })
        if (portraitInk) gsap.set(portraitInk, { scale: 1.045, xPercent: -2 })
        if (copy) gsap.set(copy, { opacity: 0.74 })
        gsap.set(copyItems, { y: 8 })
        if (nameRule) gsap.set(nameRule, { scaleX: 0.1, transformOrigin: '0% 50%' })

        const rowTimeline = gsap.timeline({
          onComplete: () => {
            if (plate) plate.dataset.teamPlateDrawn = 'true'
            const completedTargets = [
              row,
              portrait,
              portraitInk,
              copy,
              ...copyItems,
              nameRule,
            ].filter((target): target is HTMLElement => target !== null)
            gsap.set(completedTargets, {
              clearProps: 'willChange',
            })
          },
          scrollTrigger: {
            once: true,
            start: 'top 82%',
            trigger: row,
          },
        })

        rowTimeline
          .to(row, { duration: 0.62, ease: 'power4.out', opacity: 1, y: 0 }, 0)
          .to(copyItems, { duration: 0.48, ease: 'power4.out', stagger: 0.045, y: 0 }, 0.12)

        if (portrait) {
          rowTimeline.to(
            portrait,
            { clipPath: 'inset(0 0% 0 0)', duration: 0.58, ease: 'power4.out' },
            0.04,
          )
        }
        if (portraitInk) {
          rowTimeline.to(
            portraitInk,
            { duration: 0.72, ease: 'power3.out', scale: 1, xPercent: 0 },
            0.04,
          )
        }
        if (copy) {
          rowTimeline.to(copy, { duration: 0.5, ease: 'power3.out', opacity: 1 }, 0.12)
        }
        if (nameRule) {
          rowTimeline.to(nameRule, { duration: 0.42, ease: 'power4.out', scaleX: 1 }, 0.24)
        }

        if (plate) addPlateDraft(rowTimeline, plate, 0.2)
      })
    }, section)

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      context.revert()
      delete section.dataset.teamMotion
    }
  }, [])

  return <span ref={markerRef} hidden />
}
