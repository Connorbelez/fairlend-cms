'use client'

import { useCallback, useMemo, useRef } from 'react'

import {
  DynamicArrowCanvas,
  type DynamicArrowOrigin,
  type DynamicArrowTarget,
} from '@/components/dynamic-arrow/dynamic-arrow-canvas'

import { fairlendRouteSelectorTokens } from './styles'

const routeSelectorAttribute = '[data-fairlend-route-selector]'
const routeOriginAttribute = '[data-fairlend-route-arrow-origin]'
const routeCardAttribute = '[data-fairlend-route-card]'
const routePreviewSignalAttribute = 'data-fairlend-route-preview-signal'
const routePreviewSignalAnimationName = 'routePreviewStepSignal'
const routeStepDotAttribute = '[data-fairlend-route-motion="step-dot"]'

function lockRoutePreviewSignal(routeCard: HTMLElement) {
  routeCard.querySelectorAll<HTMLElement>(routeStepDotAttribute).forEach((stepDot) => {
    stepDot.style.animation = 'none'
  })
}

function armRoutePreviewSignal(routeCard: HTMLElement) {
  routeCard.setAttribute(routePreviewSignalAttribute, '')

  const stepDots = Array.from(routeCard.querySelectorAll<HTMLElement>(routeStepDotAttribute))
  const finalStepDot = stepDots.at(-1)

  if (!finalStepDot) {
    return
  }

  window.requestAnimationFrame(() => {
    const signalAnimation = finalStepDot
      .getAnimations()
      .find(
        (animation) =>
          (animation as CSSAnimation).animationName === routePreviewSignalAnimationName,
      )

    if (!signalAnimation) {
      return
    }

    void signalAnimation.finished.then(
      () => lockRoutePreviewSignal(routeCard),
      () => lockRoutePreviewSignal(routeCard),
    )
  })
}

export function FairlendRouteSelectorArrow() {
  const layerRef = useRef<HTMLDivElement>(null)

  const getLayerElement = useCallback(() => layerRef.current, [])
  const getRouteSelector = useCallback(
    () => layerRef.current?.closest<HTMLElement>(routeSelectorAttribute) ?? null,
    [],
  )
  const getOriginElement = useCallback(
    () => getRouteSelector()?.querySelector<HTMLElement>(routeOriginAttribute) ?? null,
    [getRouteSelector],
  )
  const getTargetElements = useCallback(
    () => Array.from(getRouteSelector()?.querySelectorAll<HTMLElement>(routeCardAttribute) ?? []),
    [getRouteSelector],
  )
  const handleTargetChange = useCallback(
    (activeTarget: HTMLElement | null) => {
      const routeSelector = getRouteSelector()

      if (!routeSelector) {
        return
      }

      const routeCards = routeSelector.querySelectorAll<HTMLElement>(routeCardAttribute)

      routeCards.forEach((routeCard) => {
        const isActiveTarget = routeCard === activeTarget

        if (isActiveTarget && !routeCard.hasAttribute(routePreviewSignalAttribute)) {
          armRoutePreviewSignal(routeCard)
        } else if (!isActiveTarget && routeCard.hasAttribute(routePreviewSignalAttribute)) {
          lockRoutePreviewSignal(routeCard)
        }

        routeCard.toggleAttribute('data-fairlend-route-preview', isActiveTarget)
      })

      if (activeTarget) {
        routeSelector.dataset.routePreview = 'active'
      } else {
        delete routeSelector.dataset.routePreview
      }
    },
    [getRouteSelector],
  )
  const origin = useMemo<DynamicArrowOrigin>(
    () => ({
      getElement: getOriginElement,
      type: 'element',
    }),
    [getOriginElement],
  )
  const target = useMemo<DynamicArrowTarget>(
    () => ({
      getElements: getTargetElements,
      type: 'closest-to-pointer',
    }),
    [getTargetElements],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" ref={layerRef}>
      <DynamicArrowCanvas
        activeOnlyWhenPointerInside
        activationElement={getRouteSelector}
        arrowHeadLength={12}
        className="absolute inset-0"
        dashPattern={[9, 6]}
        edgeOffset={14}
        finePointerOnly
        getScopeElement={getLayerElement}
        lineWidth={1.8}
        maxCurveOffset={180}
        maxOpacity={0.86}
        minOpacity={0.24}
        onTargetChange={handleTargetChange}
        opacityDistance={480}
        origin={origin}
        position="absolute"
        respectReducedMotion
        smoothing={0.16}
        strokeColor={fairlendRouteSelectorTokens.colors.ink}
        target={target}
        targetAnchor="top"
        targetSwitchBuffer={54}
      />
    </div>
  )
}
