'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const years = ['2019', '2023', '2026'] as const

const primaryRowStates = [
  {
    cta: 'SEE THE TIMELINE',
    ctaNote: 'Scroll through the build math',
    margin: '9.8%',
    note: 'Single home still profitable',
    riskLeft: 'LOWER RISK',
    riskRight: 'PROFITABLE',
    year: '2019',
  },
  {
    cta: 'RUN MY NUMBERS',
    ctaNote: 'Find the break-even point',
    margin: '-10.8%',
    note: 'Single home no longer profitable',
    riskLeft: 'HIGHER RISK',
    riskRight: 'NEGATIVE RETURN',
    year: '2023',
  },
  {
    cta: 'RUN MY NUMBERS',
    ctaNote: "Let's run your version",
    margin: '-13.1%',
    note: 'Single family still not profitable',
    riskLeft: 'HIGHER RISK',
    riskRight: 'STILL NEGATIVE',
    year: '2026',
  },
] as const

const counterSpecs = {
  'single-build': {
    format: (value: number) => `$${Math.round(value)}/ft²`,
    values: [285, 425, 440],
  },
  'single-land': {
    format: (value: number) => `$${value.toFixed(2)}M`,
    values: [1.45, 2.45, 2.55],
  },
  'single-margin': {
    format: (value: number) => `${value.toFixed(1)}%`,
    values: [9.8, -10.8, -13.1],
  },
  'single-profit': {
    format: (value: number) => {
      const rounded = Math.round(value)
      return rounded < 0 ? `-$${Math.abs(rounded)}K` : `+$${rounded}K`
    },
    values: [380, -412, -520],
  },
  'single-sale': {
    format: (value: number) => `$${value.toFixed(2)}M`,
    values: [3.65, 3.65, 3.7],
  },
} satisfies Record<string, { values: readonly [number, number, number]; format: (value: number) => string }>

function setText(targets: HTMLElement[], value: string) {
  targets.forEach((target) => {
    target.textContent = value
  })
}

export function FairlendBuilderConsultingMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-builder-consulting]')
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      const isPhone = window.matchMedia('(max-width: 767px)').matches
      if (isPhone) {
        section.dataset.builderPhoneStatic = 'true'
        return
      }
      const select = gsap.utils.selector(section)
      const leftTrack = section.querySelector<HTMLElement>('[data-builder-left-track]')
      const bottomTrack = section.querySelector<HTMLElement>('[data-builder-bottom-track]')
      const dashboard = section.querySelector<HTMLElement>('[data-builder-dashboard]')
      const house = section.querySelector('[data-builder-house]')
      const mobileCard = section.querySelector<HTMLElement>('[data-builder-mobile-card]')
      const mobileDashboard = section.querySelector<HTMLElement>('[data-builder-mobile-dashboard]')
      const connectorLines = select('[data-builder-connector]')
      const primaryRows = gsap.utils.toArray<HTMLElement>(
        select('[data-builder-equation-line="single-family"]'),
      )
      const emergingRows = gsap.utils.toArray<HTMLElement>(select('[data-builder-emerging-row]'))
      const primaryYearLabels = gsap.utils.toArray<HTMLElement>(select('[data-builder-primary-year]'))
      const primaryNotes = gsap.utils.toArray<HTMLElement>(select('[data-builder-primary-note]'))
      const primaryRiskLeft = gsap.utils.toArray<HTMLElement>(
        select('[data-builder-equation-line="single-family"] [data-builder-primary-risk="left"]'),
      )
      const primaryRiskRight = gsap.utils.toArray<HTMLElement>(
        select('[data-builder-equation-line="single-family"] [data-builder-primary-risk="right"]'),
      )
      const ctaLabels = gsap.utils.toArray<HTMLElement>(select('[data-builder-cta-label]'))
      const ctaNotes = gsap.utils.toArray<HTMLElement>(select('[data-builder-cta-note]'))
      const yearLayers = Object.fromEntries(
        years.map((year) => [
          year,
          gsap.utils.toArray<HTMLElement>(select(`[data-builder-year="${year}"]`)),
        ]),
      ) as Record<(typeof years)[number], HTMLElement[]>
      const desktopCopyPanels = Object.fromEntries(
        years.map((year) => [
          year,
          section.querySelector<HTMLElement>(`[data-builder-copy-year="${year}"]`),
        ]),
      ) as Record<(typeof years)[number], HTMLElement | null>
      const mobileCopyPanels = Object.fromEntries(
        years.map((year) => [
          year,
          section.querySelector<HTMLElement>(`[data-builder-mobile-copy-year="${year}"]`),
        ]),
      ) as Record<(typeof years)[number], HTMLElement | null>

      let activePrimaryIndex = -1
      const replayEquationIcons = () => {
        window.dispatchEvent(new CustomEvent('fairlend-builder-equation-icons-replay'))
      }

      const syncPrimaryRow = (index: number) => {
        if (activePrimaryIndex === index) return
        activePrimaryIndex = index
        const state = primaryRowStates[index]
        setText(primaryYearLabels, state.year)
        setText(primaryNotes, state.note)
        setText(primaryRiskLeft, state.riskLeft)
        setText(primaryRiskRight, state.riskRight)
        setText(ctaLabels, state.cta)
        setText(ctaNotes, state.ctaNote)
        replayEquationIcons()
      }

      const syncFromProgress = (progress: number) => {
        if (progress < 0.32) {
          syncPrimaryRow(0)
        } else if (progress < 0.58) {
          syncPrimaryRow(1)
        } else {
          syncPrimaryRow(2)
        }
      }

      const setInitialCopyPanel = (panel: HTMLElement | null, year: (typeof years)[number]) => {
        if (!panel) return
        gsap.set(panel, {
          autoAlpha: year === '2019' ? 1 : 0,
          clipPath: year === '2019' ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
          pointerEvents: year === '2019' ? 'auto' : 'none',
          scale: year === '2019' ? 1 : 0.985,
          transformOrigin: 'left top',
          y: year === '2019' ? 0 : 26,
          zIndex: year === '2026' ? 6 : year === '2023' ? 5 : 4,
        })
      }

      const animateCopySwap = (
        timeline: gsap.core.Timeline,
        panels: Record<(typeof years)[number], HTMLElement | null>,
        fromYear: (typeof years)[number],
        toYear: (typeof years)[number],
        at: number,
      ) => {
        const fromPanel = panels[fromYear]
        const toPanel = panels[toYear]
        if (fromPanel) {
          timeline
            .to(
              fromPanel,
              {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 0.18,
                scale: 0.982,
                y: -26,
              },
              at,
            )
            .set(fromPanel, { autoAlpha: 0, pointerEvents: 'none' }, at + 0.18)
        }
        if (toPanel) {
          timeline
            .set(toPanel, { autoAlpha: 1, pointerEvents: 'auto' }, at + 0.14)
            .to(
              toPanel,
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.22,
                scale: 1,
                y: 0,
              },
              at + 0.16,
            )
        }
      }

      const animateYearSwap = (
        timeline: gsap.core.Timeline,
        fromYear: (typeof years)[number],
        toYear: (typeof years)[number],
        at: number,
      ) => {
        timeline
          .to(yearLayers[fromYear], { autoAlpha: 0, duration: 0.14, yPercent: -115 }, at)
          .fromTo(
            yearLayers[toYear],
            { autoAlpha: 0, yPercent: 115 },
            { autoAlpha: 1, duration: 0.16, yPercent: 0 },
            at + 0.03,
          )
      }

      Object.entries(yearLayers).forEach(([year, targets]) => {
        gsap.set(targets, {
          autoAlpha: year === '2019' ? 1 : 0,
          yPercent: year === '2019' ? 0 : 115,
        })
      })
      years.forEach((year) => {
        setInitialCopyPanel(desktopCopyPanels[year], year)
        setInitialCopyPanel(mobileCopyPanels[year], year)
      })
      gsap.set(section, { '--builder-progress': 1 })
      gsap.set(primaryRows, { '--row-tone': 1 })
      gsap.set(emergingRows, {
        autoAlpha: 0,
        clipPath: 'inset(0% 0% 100% 0%)',
        height: 'auto',
        marginTop: isDesktop ? 6 : 7,
        transformOrigin: 'top center',
        y: 10,
      })
      gsap.set(connectorLines, { scaleX: 0.72, transformOrigin: 'left center' })
      if (leftTrack) gsap.set(leftTrack, { yPercent: 0 })
      if (bottomTrack) gsap.set(bottomTrack, { yPercent: 0 })
      if (dashboard) gsap.set(dashboard, { y: 0 })
      if (mobileCard) gsap.set(mobileCard, { y: 0 })
      if (mobileDashboard) gsap.set(mobileDashboard, { scale: 0.992, y: 8 })
      if (house) gsap.set(house, { scale: 0.985, transformOrigin: 'center center' })
      syncPrimaryRow(0)

      const timeline = gsap.timeline({ defaults: { ease: 'none' } })

      timeline
        .to(connectorLines, { duration: 0.12, scaleX: 1 }, 0)
        .to(section, { '--builder-progress': 0, duration: 0.26 }, 0.18)
        .to(primaryRows, { '--row-tone': 0, duration: 0.26 }, 0.2)
        .to(section, { '--builder-progress': 1, duration: 0.28 }, 0.58)
        .to(
          emergingRows,
          {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.28,
            stagger: 0.045,
            y: 0,
          },
          0.66,
        )
        .call(replayEquationIcons, [], 0.66)
        .call(replayEquationIcons, [], 0.74)
        .to({}, { duration: 0.18 }, 1)

      if (house) timeline.to(house, { duration: 0.2, scale: 1 }, 0)
      if (mobileDashboard) {
        timeline.to(mobileDashboard, { duration: 0.2, scale: 0.985, y: -6 }, 0.12)
        timeline.to(mobileDashboard, { duration: 0.28, scale: 1, y: 0 }, 0.64)
      }

      animateYearSwap(timeline, '2019', '2023', 0.24)
      animateYearSwap(timeline, '2023', '2026', 0.58)
      animateCopySwap(timeline, desktopCopyPanels, '2019', '2023', 0.2)
      animateCopySwap(timeline, desktopCopyPanels, '2023', '2026', 0.54)
      animateCopySwap(timeline, mobileCopyPanels, '2019', '2023', 0.2)
      animateCopySwap(timeline, mobileCopyPanels, '2023', '2026', 0.54)

      if (bottomTrack) {
        timeline.to(bottomTrack, { duration: 0.2, yPercent: -33.333333 }, 0.3)
        timeline.to(bottomTrack, { duration: 0.24, yPercent: -66.666667 }, 0.64)
      }

      Object.entries(counterSpecs).forEach(([key, spec]) => {
        const targets = gsap.utils.toArray<HTMLElement>(select(`[data-builder-counter="${key}"]`))
        if (!targets.length) return

        const counter = { value: spec.values[0] }
        targets.forEach((target) => {
          target.textContent = spec.format(spec.values[0])
        })

        timeline
          .to(
            counter,
            {
              duration: 0.28,
              onUpdate: () => {
                targets.forEach((target) => {
                  target.textContent = spec.format(counter.value)
                })
              },
              value: spec.values[1],
            },
            0.22,
          )
          .to(
            counter,
            {
              duration: 0.3,
              onUpdate: () => {
                targets.forEach((target) => {
                  target.textContent = spec.format(counter.value)
                })
              },
              value: spec.values[2],
            },
            0.58,
          )
      })

      const scrollTrigger = ScrollTrigger.create({
        animation: timeline,
        anticipatePin: 1,
        end: isDesktop ? '+=310%' : isPhone ? 'bottom top' : '+=245%',
        invalidateOnRefresh: true,
        onUpdate: (self) => syncFromProgress(self.progress),
        pin: !isPhone,
        refreshPriority: 20,
        scrub: isDesktop ? 1.05 : 1,
        start: isPhone ? 'top 74%' : 'top top',
        trigger: section,
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        timeline.progress(scrollTrigger.progress)
        syncFromProgress(scrollTrigger.progress)
      })
    })

    return () => context.revert()
  }, [])

  return null
}
