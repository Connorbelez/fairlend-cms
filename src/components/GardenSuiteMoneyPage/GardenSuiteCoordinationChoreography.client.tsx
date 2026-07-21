'use client'

import { useEffect, useRef, useState } from 'react'

import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'
import { trackFairlendEvent } from '@/lib/analytics/events'

import styles from './GardenSuiteIntegratedExperience.module.css'

const buildCoordinationItems = [
  'Review the plans, permit path and required reports',
  'Compare the scope, budget and contractor quotes',
  'Connect you with the project professionals you need',
  'Review progress and proof of completed milestones',
  'Show how approved changes affect the budget and timing',
] as const

const financingCoordinationItems = [
  'Match the project with a suitable financing option',
  'Prepare the financing plan and milestone draw schedule',
  'Coordinate the documents required for draw requests',
  'Update the financing plan when approved costs change',
  'Plan the final mortgage before the build is finished',
] as const

type NetworkStage = 'complete' | 'connected' | 'entry'

function ChecklistPanel({
  items,
  label,
  question,
}: {
  items: readonly string[]
  label: string
  question: string
}) {
  return (
    <section className={styles.world}>
      <span className={styles.eyebrow}>{label}</span>
      <h3>{question}</h3>
      <p className={styles.checklistLead}>FairLend helps you:</p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span aria-hidden="true" className={styles.check}>
              <i aria-hidden="true" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GardenSuiteCoordinationChoreography() {
  const choreographyRef = useRef<HTMLDivElement>(null)
  const analyticsSentRef = useRef(false)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [stage, setStage] = useState<NetworkStage>('complete')

  useEffect(() => {
    const choreography = choreographyRef.current
    if (!choreography) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrowLayout = window.matchMedia('(max-width: 56rem)')
    const shortViewport = window.matchMedia('(max-height: 42.5rem)')
    let animationFrame = 0

    const updateStage = () => {
      if (reducedMotion.matches || narrowLayout.matches || shortViewport.matches) {
        setMotionEnabled(false)
        setStage('complete')
        return
      }

      setMotionEnabled(true)
      const rect = choreography.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))

      setStage(progress < 0.28 ? 'entry' : progress < 0.62 ? 'connected' : 'complete')
    }

    const requestStageUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateStage)
    }

    updateStage()
    window.addEventListener('scroll', requestStageUpdate, { passive: true })
    window.addEventListener('resize', requestStageUpdate)
    reducedMotion.addEventListener('change', requestStageUpdate)
    narrowLayout.addEventListener('change', requestStageUpdate)
    shortViewport.addEventListener('change', requestStageUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestStageUpdate)
      window.removeEventListener('resize', requestStageUpdate)
      reducedMotion.removeEventListener('change', requestStageUpdate)
      narrowLayout.removeEventListener('change', requestStageUpdate)
      shortViewport.removeEventListener('change', requestStageUpdate)
    }
  }, [])

  useEffect(() => {
    const section = choreographyRef.current?.closest<HTMLElement>('#section-4')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || analyticsSentRef.current) return
        analyticsSentRef.current = true
        trackFairlendEvent('garden_credentials_view', {
          content_group: 'garden_suite_credentials',
          journey_type: 'homeowner_garden_suite',
          source: 'section_4_integrated_experience',
        })
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={styles.choreography}
      data-motion={motionEnabled ? 'true' : 'false'}
      data-stage={stage}
      ref={choreographyRef}
    >
      <div className={styles.map}>
        <ChecklistPanel
          items={buildCoordinationItems}
          label="THE BUILD"
          question="What needs to happen on the property?"
        />

        <div className={styles.coreFrame}>
          <BackgroundImageTexture
            className={styles.core}
            opacity={0.68}
            variant="fabric-of-squares"
          >
            <span className={styles.coreLabel}>YOUR SINGLE POINT OF CONTACT</span>
            <strong>FairLend</strong>
            <p>
              We keep the build plan, financing plan and your goals aligned, so you are not the
              go-between.
            </p>
            <span>28 years mortgage-broker experience</span>
            <span>30 years build experience</span>
            <span>In-house build advisory team</span>
          </BackgroundImageTexture>
        </div>

        <ChecklistPanel
          items={financingCoordinationItems}
          label="THE FINANCING"
          question="What needs to be ready for the money?"
        />
      </div>
    </div>
  )
}
