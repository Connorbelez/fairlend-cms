'use client'

import type { ReactElement } from 'react'
import { lazy, Suspense, useEffect, useState } from 'react'

import {
  FairlendHeroOfferingCardBody,
  type FairlendHeroOfferingRow,
} from './FairlendHeroOfferingCardBody'

const FairlendHeroOfferingsMorph = lazy(
  () =>
    import('./FairlendHeroOfferingsMorph.client').then(
      ({ FairlendHeroOfferingsMorph: Component }) => ({ default: Component }),
    ),
)

const ENHANCEMENT_DELAY_MS = 2_000

type FairlendHeroOfferingsDeferredProps = {
  rows: readonly FairlendHeroOfferingRow[]
}

function FairlendHeroOfferingsStatic({
  rows,
}: FairlendHeroOfferingsDeferredProps): ReactElement {
  return (
    <div
      className="fairlend-hero-offerings-morph"
      data-offerings-layout="list"
      data-viewport-mode="unresolved"
      data-fairlend-offerings-static
    >
      <div className="fairlend-build-property-types__list fairlend-hero-offerings-morph__stack">
        {rows.map((row, index) => (
          <div
            className={`fairlend-build-property-types__row fairlend-hero-offerings-morph__row fairlend-hero-offerings-morph__card pointer-events-auto${
              index === 0 ? ' fairlend-hero-offerings-morph__card--top' : ''
            }`}
            data-offering-id={row.id}
            key={row.id}
          >
            <div className="fairlend-hero-offerings-morph__surface">
              <FairlendHeroOfferingCardBody linkTitle priority={index === 0} row={row} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Keeps the server-rendered offering cards visible on first paint, then adds
 * the Motion-powered deck after a short presentation window. The same static
 * tree remains visible while the deferred chunk resolves, avoiding a blank
 * frame at the Suspense boundary.
 */
export function FairlendHeroOfferingsDeferred({
  rows,
}: FairlendHeroOfferingsDeferredProps): ReactElement {
  const [isEnhanced, setIsEnhanced] = useState(false)

  useEffect(() => {
    if (isEnhanced) return

    const timer = window.setTimeout(() => setIsEnhanced(true), ENHANCEMENT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [isEnhanced])

  if (isEnhanced) {
    return (
      <Suspense fallback={<FairlendHeroOfferingsStatic rows={rows} />}>
        <FairlendHeroOfferingsMorph rows={rows} />
      </Suspense>
    )
  }

  return <FairlendHeroOfferingsStatic rows={rows} />
}
