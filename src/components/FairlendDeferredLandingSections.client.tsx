'use client'

import type { ComponentType, ReactElement } from 'react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { loadDeferredHomeStyles } from '@/components/loadDeferredHomeStyles.client'

function lazyClientComponent(loader: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await loader() }))
}

const BuildModelRail = lazyClientComponent(async () => {
  const [{ FairlendBuildModelSection }, { FairlendLandingRail }] = await Promise.all([
    import('@/components/FairlendBuildModelSection'),
    import('@/components/FairlendLandingRail'),
  ])

  return function BuildModelRail(): ReactElement {
    return (
      <FairlendLandingRail contentClassName="overflow-visible!" gutterTexture="fabric-of-squares">
        <FairlendBuildModelSection />
      </FairlendLandingRail>
    )
  }
})

const BuilderConsultingRail = lazyClientComponent(async () => {
  const [{ FairlendBuilderConsultingSection }, { FairlendLandingRail }] = await Promise.all([
    import('@/components/FairlendBuilderConsultingSection'),
    import('@/components/FairlendLandingRail'),
  ])

  return function BuilderConsultingRail(): ReactElement {
    return (
      <FairlendLandingRail gutterTexture="debut-light">
        <FairlendBuilderConsultingSection />
      </FairlendLandingRail>
    )
  }
})

const TeamRail = lazyClientComponent(async () => {
  const [{ FairlendLeadershipSection }, { FairlendLandingRail }, { FairlendTeamSection }] =
    await Promise.all([
      import('@/components/FairlendLeadershipSection'),
      import('@/components/FairlendLandingRail'),
      import('@/components/FairlendTeamSection'),
    ])

  return function TeamRail(): ReactElement {
    return (
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendLeadershipSection />
        <FairlendTeamSection />
      </FairlendLandingRail>
    )
  }
})

const EthosRail = lazyClientComponent(async () => {
  const [{ FairlendEthosSection }, { FairlendLandingRail }] = await Promise.all([
    import('@/components/FairlendEthosSection'),
    import('@/components/FairlendLandingRail'),
  ])

  return function EthosRail(): ReactElement {
    return (
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendEthosSection />
      </FairlendLandingRail>
    )
  }
})

const FaqRail = lazyClientComponent(async () => {
  const [{ FairlendFaqSection }, { FairlendLandingRail }] = await Promise.all([
    import('@/components/FairlendFaqSection'),
    import('@/components/FairlendLandingRail'),
  ])

  return function FaqRail(): ReactElement {
    return (
      <FairlendLandingRail gutterTexture="groovepaper">
        <FairlendFaqSection />
      </FairlendLandingRail>
    )
  }
})

const DEFERRED_SECTION_ROOT_MARGIN = '500px 0px'

type DeferredLandingRailProps = {
  component: ComponentType
  estimatedHeight: number
  fallback: ReactElement
  label: string
}

function DeferredLandingRail({
  component: Component,
  estimatedHeight,
  fallback,
  label,
}: DeferredLandingRailProps): ReactElement {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) return

    const anchor = anchorRef.current
    if (!anchor) return

    if (!('IntersectionObserver' in window)) {
      const fallbackTimer = setTimeout(() => {
        void loadDeferredHomeStyles().then(() => setShouldRender(true))
      }, 0)
      return () => clearTimeout(fallbackTimer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        void loadDeferredHomeStyles().then(() => setShouldRender(true))
      },
      { rootMargin: DEFERRED_SECTION_ROOT_MARGIN },
    )

    observer.observe(anchor)
    return () => observer.disconnect()
  }, [shouldRender])

  // Keep the reservation through the lazy-module handoff. Dropping it as
  // soon as `shouldRender` flips makes the null Suspense fallback collapse
  // the rail, which can pull every later observer into range at once.
  return (
    <div
      data-fairlend-deferred-rail={label}
      ref={anchorRef}
      style={{ minHeight: `${estimatedHeight}px` }}
    >
      {shouldRender ? (
        <Suspense fallback={fallback}>
          <Component />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}

/**
 * Loads each below-fold experience independently as it approaches the viewport.
 * Generic touch and wheel events intentionally do not wake the entire homepage.
 */
export function FairlendDeferredLandingSections({
  buildModelFallback,
  builderConsultingFallback,
  ethosFallback,
  faqFallback,
  teamFallback,
}: {
  buildModelFallback: ReactElement
  builderConsultingFallback: ReactElement
  ethosFallback: ReactElement
  faqFallback: ReactElement
  teamFallback: ReactElement
}): ReactElement {
  return (
    <div data-fairlend-deferred-sections>
      <DeferredLandingRail
        component={BuildModelRail}
        estimatedHeight={980}
        fallback={buildModelFallback}
        label="Build financing model"
      />
      <DeferredLandingRail
        component={BuilderConsultingRail}
        estimatedHeight={900}
        fallback={builderConsultingFallback}
        label="Builder consulting"
      />
      <DeferredLandingRail
        component={TeamRail}
        estimatedHeight={1450}
        fallback={teamFallback}
        label="FairLend team"
      />
      <DeferredLandingRail
        component={EthosRail}
        estimatedHeight={900}
        fallback={ethosFallback}
        label="FairLend ethos"
      />
      <DeferredLandingRail
        component={FaqRail}
        estimatedHeight={1500}
        fallback={faqFallback}
        label="Frequently asked questions"
      />
    </div>
  )
}
