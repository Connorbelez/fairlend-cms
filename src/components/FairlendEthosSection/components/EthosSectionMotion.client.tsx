'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

const ETHOS_SELECTOR = '[data-testid="fairlend-ethos-section"]'
const ENTRANCE_EASE = 'power4.out'

function createOperatingClauseTimeline(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('[data-ethos-block="operating-standard"]')
  const file = section?.querySelector<HTMLElement>('[data-ethos-operating-file]')
  const scan = section?.querySelector<HTMLElement>('.fairlend-ethos__operating-scan')
  const header = section?.querySelector<HTMLElement>('.fairlend-ethos__operating-header')
  const statement = section?.querySelector<HTMLElement>('.fairlend-ethos__operating-statement')
  const rows = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('[data-ethos-fee-row]') ?? [],
  )
  const statuses = rows
    .map((row) => row.querySelector<HTMLElement>('dd'))
    .filter((status): status is HTMLElement => status !== null)
  const relationship = section?.querySelector<HTMLElement>(
    '.fairlend-ethos__relationship-clause > p:first-child',
  )
  const clauseStatus = section?.querySelector<HTMLElement>('.fairlend-ethos__clause-status')
  const clauseRule = clauseStatus?.querySelector<HTMLElement>('span')

  if (!section || !file || !scan || !header || !statement) return

  gsap.set(file, { rotation: 0.16, transformOrigin: '50% 0%', x: 10, y: 10 })
  gsap.set(header, { clipPath: 'inset(0 0 12% 0)' })
  gsap.set(statement, { filter: 'blur(1.4px)', opacity: 0.58, y: 18 })
  if (rows.length) gsap.set(rows, { opacity: 0.68, x: 10 })
  if (statuses.length) {
    gsap.set(statuses, { opacity: 0.48, scale: 0.78, transformOrigin: '50% 50%' })
  }
  if (relationship) gsap.set(relationship, { opacity: 0.58, y: 12 })
  if (clauseStatus) gsap.set(clauseStatus, { opacity: 0.56, x: 10 })
  if (clauseRule) gsap.set(clauseRule, { scaleX: 0.08, transformOrigin: '0% 50%' })
  gsap.set(scan, { opacity: 0, y: 0 })

  const timeline = gsap.timeline({
    defaults: { ease: ENTRANCE_EASE },
    onComplete: () => {
      section.dataset.ethosMotion = 'complete'
    },
    scrollTrigger: {
      once: true,
      start: 'top 74%',
      trigger: section,
    },
  })

  timeline
    .to(file, { duration: 0.62, rotation: 0, x: 0, y: 0 }, 0)
    .to(header, { clipPath: 'inset(0 0 0% 0)', duration: 0.42 }, 0.08)
    .to(scan, { duration: 0.08, opacity: 0.95 }, 0.1)
    .to(
      scan,
      {
        duration: 1.35,
        ease: 'power2.inOut',
        y: () => Math.max(0, file.offsetHeight - scan.offsetHeight),
      },
      0.1,
    )
    .to(statement, { duration: 0.68, filter: 'blur(0px)', opacity: 1, y: 0 }, 0.24)

  rows.forEach((row, index) => {
    timeline.to(row, { duration: 0.42, opacity: 1, x: 0 }, 0.46 + index * 0.16)
  })

  statuses.forEach((status, index) => {
    timeline.to(status, { duration: 0.3, opacity: 1, scale: 1 }, 0.56 + index * 0.16)
  })

  if (relationship) {
    timeline.to(relationship, { duration: 0.55, opacity: 1, y: 0 }, 0.92)
  }
  if (clauseStatus) {
    timeline.to(clauseStatus, { duration: 0.46, opacity: 1, x: 0 }, 1.04)
  }
  if (clauseRule) {
    timeline.to(clauseRule, { duration: 0.46, scaleX: 1 }, 1.08)
  }

  timeline.to(scan, { duration: 0.18, opacity: 0 }, 1.38)
}

function createCapitalDiagnosisTimeline(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('[data-ethos-block="capital-audit"]')
  const copy = section?.querySelector<HTMLElement>('.fairlend-ethos__capital-audit-copy')
  const plate = section?.querySelector<HTMLElement>('.fairlend-ethos__capital-audit-plate')
  const specimen = section?.querySelector<HTMLElement>(
    '.fairlend-ethos__capital-audit-specimen img',
  )
  const markers = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('.fairlend-ethos__capital-audit-marker') ?? [],
  )
  const leaders = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('.fairlend-ethos__capital-audit-leader') ?? [],
  )
  const findings = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('.fairlend-ethos__capital-findings li') ?? [],
  )
  const findingCodes = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('.fairlend-ethos__capital-finding-code') ?? [],
  )
  const bridgeCopy = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>(
      '.fairlend-ethos__reallocation-label, .fairlend-ethos__reallocation-bridge strong',
    ) ?? [],
  )
  const trace = section?.querySelector<HTMLElement>('.fairlend-ethos__reallocation-trace')
  const arrow = section?.querySelector<HTMLElement>('.fairlend-ethos__reallocation-arrow')
  const skyline = section?.querySelector<HTMLElement>('.fairlend-ethos__capital-skyline img')

  if (!section || !copy || !plate || !specimen) return

  gsap.set(copy, { opacity: 0.62, y: 16 })
  gsap.set(plate, { opacity: 0.72, x: 18 })
  gsap.set(specimen, {
    filter: 'grayscale(1) contrast(1.04) brightness(0.82)',
    opacity: 0.2,
    scale: 1.07,
    transformOrigin: '50% 50%',
  })
  if (markers.length) {
    gsap.set(markers, { opacity: 0.36, scale: 0.68, transformOrigin: '50% 50%' })
  }
  if (leaders.length) gsap.set(leaders, { scaleX: 0.04, transformOrigin: '100% 50%' })
  if (findings.length) gsap.set(findings, { opacity: 0.5, x: -14 })
  if (findingCodes.length) {
    gsap.set(findingCodes, { opacity: 0.5, scale: 0.76, transformOrigin: '50% 50%' })
  }
  if (bridgeCopy.length) gsap.set(bridgeCopy, { opacity: 0.52, y: 8 })
  if (trace) gsap.set(trace, { scaleX: 0.03, transformOrigin: '0% 50%' })
  if (arrow) gsap.set(arrow, { opacity: 0.4, rotation: -12, x: -14, y: -10 })
  if (skyline) gsap.set(skyline, { opacity: 0.2, scale: 1.035, y: 38 })

  const timeline = gsap.timeline({
    defaults: { ease: ENTRANCE_EASE },
    onComplete: () => {
      section.dataset.ethosMotion = 'complete'
    },
    scrollTrigger: {
      once: true,
      start: 'top 72%',
      trigger: section,
    },
  })

  timeline
    .to(copy, { duration: 0.62, opacity: 1, y: 0 }, 0)
    .to(plate, { duration: 0.72, opacity: 1, x: 0 }, 0.05)
    .to(
      specimen,
      {
        duration: 0.9,
        filter: 'grayscale(1) contrast(1.32) brightness(1.08)',
        opacity: 0.5,
        scale: 1,
      },
      0.08,
    )

  markers.forEach((marker, index) => {
    const lockAt = 0.4 + index * 0.34
    timeline.to(marker, { duration: 0.28, opacity: 1, scale: 1 }, lockAt)
    if (leaders[index]) {
      timeline.to(leaders[index], { duration: 0.4, scaleX: 1 }, lockAt + 0.06)
    }
    if (findings[index]) {
      timeline.to(findings[index], { duration: 0.48, opacity: 1, x: 0 }, lockAt + 0.14)
    }
    if (findingCodes[index]) {
      timeline.to(findingCodes[index], { duration: 0.28, opacity: 1, scale: 1 }, lockAt + 0.18)
    }
  })

  if (trace) timeline.to(trace, { duration: 0.56, scaleX: 1 }, 1.02)
  if (bridgeCopy.length) {
    timeline.to(bridgeCopy, { duration: 0.48, opacity: 1, stagger: 0.06, y: 0 }, 1.06)
  }
  if (arrow) {
    timeline.to(arrow, { duration: 0.44, opacity: 1, rotation: 0, x: 0, y: 0 }, 1.18)
  }
  if (skyline) {
    timeline.to(skyline, { duration: 0.82, opacity: 0.68, scale: 1, y: 0 }, 1.02)
  }
}

function createManifestoTimeline(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('[data-ethos-block="manifesto"]')
  const press = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-press')
  const sealLine = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-seal span')
  const housing = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-housing img')
  const proposition = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-proposition')
  const model = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-model')
  const success = section?.querySelector<HTMLElement>('.fairlend-ethos__manifesto-success')
  const vision = section?.querySelector<HTMLElement>('.fairlend-ethos__vision')
  const outcomes = gsap.utils.toArray<HTMLElement>(
    section?.querySelectorAll<HTMLElement>('.fairlend-ethos__vision-outcomes li') ?? [],
  )

  if (!section || !press || !sealLine || !housing || !proposition || !model || !success) return

  gsap.set(press, { opacity: 0, x: () => -press.offsetWidth * 1.5 })
  gsap.set(sealLine, { scaleX: 0.05, transformOrigin: '0% 50%' })
  gsap.set(housing, {
    filter: 'grayscale(1) contrast(1.08)',
    opacity: 0.1,
    scale: 1.14,
    transformOrigin: '50% 50%',
    x: 24,
  })
  gsap.set([proposition, model, success], {
    filter: 'blur(1.6px)',
    opacity: 0.56,
    y: 18,
  })
  gsap.set(success, {
    '--ethos-registration-left-opacity': 0.34,
    '--ethos-registration-left-x': '-7px',
    '--ethos-registration-left-y': '3px',
    '--ethos-registration-right-opacity': 0.24,
    '--ethos-registration-right-x': '6px',
    '--ethos-registration-right-y': '-2px',
  })
  if (vision) gsap.set(vision, { opacity: 0.58, y: 12 })
  if (outcomes.length) {
    gsap.set(outcomes, { opacity: 0.5, scaleY: 0.94, transformOrigin: '50% 0%', y: 10 })
  }

  const timeline = gsap.timeline({
    defaults: { ease: ENTRANCE_EASE },
    onComplete: () => {
      section.dataset.ethosMotion = 'complete'
    },
    scrollTrigger: {
      once: true,
      start: 'top 74%',
      trigger: section,
    },
  })

  timeline
    .to(press, { duration: 0.08, opacity: 0.14 }, 0)
    .to(
      press,
      {
        duration: 0.92,
        ease: 'power2.inOut',
        x: () => section.clientWidth + press.offsetWidth * 0.5,
      },
      0,
    )
    .to(press, { duration: 0.14, opacity: 0 }, 0.82)
    .to(sealLine, { duration: 0.5, scaleX: 1 }, 0.08)
    .to(
      housing,
      {
        duration: 0.88,
        filter: 'grayscale(1) contrast(1.72)',
        opacity: 0.28,
        scale: 1.065,
        x: 0,
      },
      0.06,
    )
    .to(proposition, { duration: 0.5, filter: 'blur(0px)', opacity: 1, y: 0 }, 0.26)
    .to(model, { duration: 0.58, filter: 'blur(0px)', opacity: 1, y: 0 }, 0.46)
    .to(success, { duration: 0.62, filter: 'blur(0px)', opacity: 1, y: 0 }, 0.68)
    .to(
      success,
      {
        '--ethos-registration-left-opacity': 0,
        '--ethos-registration-left-x': '0px',
        '--ethos-registration-left-y': '0px',
        '--ethos-registration-right-opacity': 0,
        '--ethos-registration-right-x': '0px',
        '--ethos-registration-right-y': '0px',
        duration: 0.52,
      },
      0.76,
    )

  if (vision) timeline.to(vision, { duration: 0.58, opacity: 1, y: 0 }, 0.94)
  if (outcomes.length) {
    timeline.to(outcomes, { duration: 0.44, opacity: 1, scaleY: 1, stagger: 0.07, y: 0 }, 1.04)
  }
}

export function EthosSectionMotion() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const root = markerRef.current?.closest<HTMLElement>(ETHOS_SELECTOR)
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      createOperatingClauseTimeline(root)
      createCapitalDiagnosisTimeline(root)
      createManifestoTimeline(root)
    }, root)

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      context.revert()
    }
  }, [])

  return <span ref={markerRef} hidden />
}
