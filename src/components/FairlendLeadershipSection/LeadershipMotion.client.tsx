'use client'

import { useEffect } from 'react'

const leadershipProofNumberPattern = /^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/

type LeadershipCounter = {
  delay: number
  element: HTMLElement
  finalValue: string
  prefix: string
  suffix: string
  target: number
}

const counterDuration = 480

function formatCounterValue(counter: LeadershipCounter, value: number): string {
  const formattedValue = Number.isInteger(counter.target)
    ? Math.round(value).toString()
    : value.toFixed(1)

  return `${counter.prefix}${formattedValue}${counter.suffix}`
}

/**
 * Replays the former Leadership GSAP timeline once when the section enters the viewport.
 * CSS owns the visual sequence; this controller owns the viewport trigger and proof counters.
 */
export function LeadershipMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-fairlend-motion="leadership"]')
    if (!section) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !('IntersectionObserver' in window)) return

    const counters = Array.from(
      section.querySelectorAll<HTMLElement>('[data-leadership-proof-value]'),
    ).flatMap<LeadershipCounter>((element, index) => {
      const finalValue = element.dataset.proofValueTarget ?? element.textContent?.trim() ?? ''
      const numericValue = finalValue.match(leadershipProofNumberPattern)
      if (!numericValue) return []

      return [
        {
          delay: 1_620 + index * 130,
          element,
          finalValue,
          prefix: numericValue[1],
          suffix: numericValue[3],
          target: Number(numericValue[2]),
        },
      ]
    })

    let animationFrame = 0
    let played = false

    const restoreCounters = () => {
      counters.forEach((counter) => {
        counter.element.textContent = counter.finalValue
      })
    }

    const stopCounterAnimation = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const playCounters = (timelineStart: number) => {
      const update = (now: number) => {
        let hasPendingCounter = false

        counters.forEach((counter) => {
          const elapsed = now - timelineStart - counter.delay
          const progress = Math.min(1, Math.max(0, elapsed / counterDuration))
          const easedProgress = 1 - (1 - progress) ** 2

          counter.element.textContent = formatCounterValue(counter, counter.target * easedProgress)
          if (progress < 1) hasPendingCounter = true
        })

        animationFrame = hasPendingCounter ? window.requestAnimationFrame(update) : 0
      }

      animationFrame = window.requestAnimationFrame(update)
    }

    const play = () => {
      if (played) return
      played = true
      observer?.disconnect()
      section.dataset.leadershipMotionState = 'entered'
      playCounters(performance.now())
    }

    const disableMotion = () => {
      observer?.disconnect()
      stopCounterAnimation()
      restoreCounters()
      section.removeAttribute('data-leadership-motion-state')
    }

    counters.forEach((counter) => {
      counter.element.textContent = formatCounterValue(counter, 0)
    })
    section.dataset.leadershipMotionState = 'ready'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play()
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.01,
      },
    )
    observer.observe(section)

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) disableMotion()
    }
    motionPreference.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      observer?.disconnect()
      stopCounterAnimation()
      restoreCounters()
      section.removeAttribute('data-leadership-motion-state')
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  return null
}
