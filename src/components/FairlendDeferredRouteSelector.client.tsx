'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { loadDeferredHomeStyles } from '@/components/loadDeferredHomeStyles.client'

const DeferredRouteSelector = lazy(
  () =>
    import('@/components/FairlendRouteSelector').then(
      ({ FairlendRouteSelector }) => ({ default: FairlendRouteSelector }),
    ),
)

/** Loads the route selector on first scroll or once its reserved space enters the viewport. */
export function FairlendDeferredRouteSelector() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) return

    const reveal = () => {
      void loadDeferredHomeStyles().then(() => setShouldRender(true))
    }
    const revealFromScroll = () => {
      if (window.scrollY >= 96) reveal()
    }
    const revealFromKeyboard = (event: KeyboardEvent) => {
      if (['ArrowDown', 'End', 'PageDown', ' '].includes(event.key)) reveal()
    }

    window.addEventListener('keydown', revealFromKeyboard, { passive: true })
    window.addEventListener('scroll', revealFromScroll, { passive: true })
    revealFromScroll()

    return () => {
      window.removeEventListener('keydown', revealFromKeyboard)
      window.removeEventListener('scroll', revealFromScroll)
    }
  }, [shouldRender])

  return (
    <FairlendLandingRail gutterTexture="grid-noise">
      <div
        className="min-h-[2500px] bg-[#f8f7f5] xl:min-h-[720px]"
        data-fairlend-deferred-route-selector
        id="services"
        ref={anchorRef}
      >
        {shouldRender ? (
          <Suspense fallback={null}>
            <DeferredRouteSelector />
          </Suspense>
        ) : null}
      </div>
    </FairlendLandingRail>
  )
}
