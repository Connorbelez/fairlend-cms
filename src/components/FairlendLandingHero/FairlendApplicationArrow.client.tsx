'use client'

import { useMemo } from 'react'

import {
  DynamicArrowCanvas,
  type DynamicArrowOrigin,
  type DynamicArrowTarget,
} from '@/components/dynamic-arrow'

import { getFairlendApplicationElement } from './application-target'

const HERO_CANVAS_SELECTOR = '[data-toronto-hero-canvas]'

function getHeroCanvas() {
  return document.querySelector<HTMLElement>(HERO_CANVAS_SELECTOR)
}

export function FairlendApplicationArrow() {
  const arrowOrigin = useMemo<DynamicArrowOrigin>(
    () => ({
      type: 'pointer',
    }),
    [],
  )

  const arrowTarget = useMemo<DynamicArrowTarget>(
    () => ({
      getElement: getFairlendApplicationElement,
      type: 'element',
    }),
    [],
  )

  return (
    <DynamicArrowCanvas
      activeOnlyWhenPointerInside
      activationElement={getHeroCanvas}
      arrowHeadLength={16}
      className="z-[50]"
      dashPattern={[12, 7]}
      edgeOffset={0}
      fallbackStrokeColor={{ r: 150, g: 236, b: 24 }}
      finePointerOnly
      getScopeElement={getHeroCanvas}
      lineWidth={2.5}
      maxCurveOffset={170}
      maxOpacity={0.72}
      minOpacity={0.12}
      opacityDistance={560}
      origin={arrowOrigin}
      position="absolute"
      respectReducedMotion
      smoothing={0.18}
      strokeColor={{ r: 150, g: 236, b: 24 }}
      target={arrowTarget}
      targetAnchor="top"
      targetSwitchBuffer={24}
    />
  )
}
