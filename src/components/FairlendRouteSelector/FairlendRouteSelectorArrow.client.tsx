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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" ref={layerRef}>
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
