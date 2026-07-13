'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const DeferredLandingSectionsContent = lazy(async () => {
  const [
    { FairlendBuildModelSection },
    { FairlendBuilderConsultingSection },
    { FairlendEthosSection },
    { FairlendFaqSection },
    { FairlendLandingRail },
    { FairlendLandingOverviewSection },
    { FairlendLeadershipSection },
    { FairlendTeamSection },
  ] = await Promise.all([
    import('@/components/FairlendBuildModelSection'),
    import('@/components/FairlendBuilderConsultingSection'),
    import('@/components/FairlendEthosSection'),
    import('@/components/FairlendFaqSection'),
    import('@/components/FairlendLandingRail'),
    import('@/components/FairlendLandingOverviewSection'),
    import('@/components/FairlendLeadershipSection'),
    import('@/components/FairlendTeamSection'),
  ])

  return {
    default: function DeferredLandingSections() {
      return (
        <>
          <FairlendLandingRail gutterTexture="inflicted">
            <FairlendLandingOverviewSection />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="fabric-of-squares">
            <FairlendBuildModelSection />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="debut-light">
            <FairlendBuilderConsultingSection />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="groovepaper">
            <FairlendLeadershipSection />
            <FairlendTeamSection />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="groovepaper">
            <FairlendEthosSection />
          </FairlendLandingRail>
          <FairlendLandingRail gutterTexture="groovepaper">
            <FairlendFaqSection />
          </FairlendLandingRail>
        </>
      )
    },
  }
})

export function FairlendDeferredLandingSections() {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary || !('IntersectionObserver' in window)) {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldRender(true)
        observer.disconnect()
      },
      { rootMargin: '1200px 0px' },
    )

    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  if (shouldRender) {
    return (
      <Suspense fallback={<div aria-hidden="true" className="min-h-px" />}>
        <DeferredLandingSectionsContent />
      </Suspense>
    )
  }

  return <div aria-hidden="true" className="min-h-px" ref={boundaryRef} />
}
