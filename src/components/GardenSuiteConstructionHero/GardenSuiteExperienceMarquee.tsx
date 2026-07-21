'use client'

import { useEffect, useState } from 'react'

import styles from './GardenSuiteExperienceMarquee.module.css'

const CREDENTIALS = [
  {
    detail: 'Principal Broker',
    label: 'Mortgage-broker experience',
    value: '28 years',
  },
  {
    detail: 'Principal Broker',
    label: 'Construction experience',
    value: '30 years',
  },
  {
    detail: 'In-house legal team',
    label: 'Specialist legal experience',
    value: '10+ years',
  },
] as const

function CredentialItems() {
  return CREDENTIALS.map(({ detail, label, value }) => (
    <li className={styles.credential} key={`${value}-${label}`}>
      <strong className={styles.value}>{value}</strong>
      <span className={styles.label}>{label}</span>
      <span className={styles.detail}>{detail}</span>
    </li>
  ))
}

/**
 * Mobile-only, continuously scrolling proof rail for the Garden Suite hero.
 *
 * The second list is a visual-only duplicate that makes the CSS animation
 * seamless without measuring the viewport or track in JavaScript.
 */
export function GardenSuiteExperienceMarquee() {
  const [isDocumentHidden, setIsDocumentHidden] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const syncVisibility = () => setIsDocumentHidden(document.hidden)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => setPrefersReducedMotion(reducedMotion.matches)

    syncVisibility()
    syncMotionPreference()
    document.addEventListener('visibilitychange', syncVisibility)
    reducedMotion.addEventListener('change', syncMotionPreference)
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility)
      reducedMotion.removeEventListener('change', syncMotionPreference)
    }
  }, [])

  return (
    <section
      aria-label="Garden Suite financing and construction experience"
      className={styles.marquee}
      data-paused={isPaused || isDocumentHidden}
      id="garden-suite-experience"
    >
      <div className={styles.controls}>
        <span>Experience file</span>
        {prefersReducedMotion ? (
          <span className={styles.motionState}>Motion off</span>
        ) : (
          <button
            aria-pressed={isPaused}
            onClick={() => setIsPaused((current) => !current)}
            type="button"
          >
            {isPaused ? 'Play proof rail' : 'Pause proof rail'}
          </button>
        )}
      </div>
      <div className={styles.viewport} onPointerDown={() => setIsPaused(true)}>
        <div className={styles.track}>
          <ul className={styles.list}>
            <CredentialItems />
          </ul>
          <ul aria-hidden="true" className={styles.list}>
            <CredentialItems />
          </ul>
        </div>
      </div>
    </section>
  )
}
