'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { loadDeferredHomeStyles } from '@/components/loadDeferredHomeStyles.client'

const DeferredWatermelonFooter = lazy(() =>
  import('./WatermelonFooter.client').then(({ WatermelonFooter }) => ({
    default: WatermelonFooter,
  })),
)

export function FairlendDeferredFooter() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor || shouldRender) return

    if (!('IntersectionObserver' in window)) {
      void loadDeferredHomeStyles().then(() => setShouldRender(true))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        void loadDeferredHomeStyles().then(() => setShouldRender(true))
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(anchor)
    return () => observer.disconnect()
  }, [shouldRender])

  return (
    <div ref={anchorRef} style={shouldRender ? undefined : { minHeight: '560px' }}>
      {shouldRender ? (
        <Suspense fallback={null}>
          <DeferredWatermelonFooter />
        </Suspense>
      ) : null}
    </div>
  )
}
