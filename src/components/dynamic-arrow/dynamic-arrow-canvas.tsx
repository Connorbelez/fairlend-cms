'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

import { cn } from '@/utilities/ui'

type Point = {
  x: number
  y: number
}

type RgbColor = {
  r: number
  g: number
  b: number
}

type RectBounds = {
  bottom: number
  height: number
  element?: HTMLElement
  left: number
  right: number
  top: number
  width: number
}

type ResolvedTarget = {
  distance: number
  element: HTMLElement | null
  rect: RectBounds
}

export type DynamicArrowOrigin =
  | {
      type: 'pointer'
    }
  | {
      type: 'element'
      getElement: () => HTMLElement | null
    }

export type DynamicArrowTarget =
  | {
      type: 'element'
      getElement: () => HTMLElement | null
    }
  | {
      type: 'closest-to-pointer'
      getElements: () => HTMLElement[]
    }

export type DynamicArrowCanvasProps = {
  activeOnlyWhenPointerInside?: boolean
  activationElement?: () => HTMLElement | null
  arrowHeadLength?: number
  className?: string
  dashPattern?: [number, number]
  edgeOffset?: number
  enabled?: boolean
  fallbackStrokeColor?: RgbColor
  finePointerOnly?: boolean
  getScopeElement?: () => HTMLElement | null
  lineWidth?: number
  maxCurveOffset?: number
  maxOpacity?: number
  minOpacity?: number
  opacityDistance?: number
  origin: DynamicArrowOrigin
  position?: 'absolute' | 'fixed'
  respectReducedMotion?: boolean
  scopeRef?: RefObject<HTMLElement | null>
  smoothing?: number
  strokeColor?: string | RgbColor
  target: DynamicArrowTarget
  targetAnchor?: 'edge' | 'top'
  targetSwitchBuffer?: number
}

const defaultStrokeColor = { r: 128, g: 128, b: 128 } satisfies RgbColor
const settledPointDistance = 0.5

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function pointDistance(from: Point, to: Point) {
  return Math.hypot(from.x - to.x, from.y - to.y)
}

function parseColorString(colorString: string): RgbColor | null {
  const normalizedColor = colorString.trim()

  const rgbMatch = normalizedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)

  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1] ?? '0', 10),
      g: Number.parseInt(rgbMatch[2] ?? '0', 10),
      b: Number.parseInt(rgbMatch[3] ?? '0', 10),
    }
  }

  const hexMatch = normalizedColor.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i)

  if (!hexMatch?.[1]) {
    return null
  }

  const hex = hexMatch[1]
    .split('')
    .map((value) => (hexMatch[1]?.length === 3 ? `${value}${value}` : value))
    .join('')

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function rectToBounds(rect: DOMRect): RectBounds {
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  }
}

function viewportBounds(): RectBounds {
  return {
    bottom: window.innerHeight,
    height: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    top: 0,
    width: window.innerWidth,
  }
}

function pointInsideRect(point: Point, rect: RectBounds) {
  return (
    point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  )
}

function distanceToRect(point: Point, rect: RectBounds) {
  const dx = Math.max(rect.left - point.x, 0, point.x - rect.right)
  const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom)

  return Math.hypot(dx, dy)
}

function rectCenter(rect: RectBounds): Point {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

function lerpPoint(from: Point, to: Point, amount: number): Point {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
  }
}

function resolveTarget(
  target: DynamicArrowTarget,
  pointer: Point,
  activeElement: HTMLElement | null,
  targetSwitchBuffer: number,
): ResolvedTarget | null {
  if (target.type === 'element') {
    const element = target.getElement()
    const rect = element ? rectToBounds(element.getBoundingClientRect()) : null

    return element && rect
      ? {
          distance: distanceToRect(pointer, rect),
          element,
          rect,
        }
      : null
  }

  let activeTarget: ResolvedTarget | null = null
  let closestTarget: ResolvedTarget | null = null
  let closestDistance = Number.POSITIVE_INFINITY

  for (const element of target.getElements()) {
    const rect = rectToBounds(element.getBoundingClientRect())
    const distance = distanceToRect(pointer, rect)
    const resolvedTarget = {
      distance,
      element,
      rect,
    } satisfies ResolvedTarget

    if (element === activeElement) {
      activeTarget = resolvedTarget
    }

    if (distance < closestDistance) {
      closestDistance = distance
      closestTarget = resolvedTarget
    }
  }

  if (
    activeTarget &&
    closestTarget &&
    activeTarget.element !== closestTarget.element &&
    activeTarget.distance <= closestTarget.distance + targetSwitchBuffer
  ) {
    return activeTarget
  }

  return closestTarget
}

function pointOnTarget(
  targetRect: RectBounds,
  originPoint: Point,
  edgeOffset: number,
  targetAnchor: DynamicArrowCanvasProps['targetAnchor'],
): Point {
  if (targetAnchor === 'top') {
    return {
      x: clamp(originPoint.x, targetRect.left + edgeOffset, targetRect.right - edgeOffset),
      y: targetRect.top - edgeOffset,
    }
  }

  const center = rectCenter(targetRect)
  const dx = originPoint.x - center.x
  const dy = originPoint.y - center.y
  const distance = Math.hypot(dx, dy) || 1
  const scale = Math.min(
    targetRect.width / 2 / Math.max(Math.abs(dx), 1),
    targetRect.height / 2 / Math.max(Math.abs(dy), 1),
  )

  return {
    x: center.x + dx * scale + (dx / distance) * edgeOffset,
    y: center.y + dy * scale + (dy / distance) * edgeOffset,
  }
}

export function DynamicArrowCanvas({
  activeOnlyWhenPointerInside = false,
  activationElement,
  arrowHeadLength = 13,
  className,
  dashPattern = [10, 5],
  edgeOffset = 12,
  enabled = true,
  fallbackStrokeColor = defaultStrokeColor,
  finePointerOnly = false,
  getScopeElement,
  lineWidth = 2,
  maxCurveOffset = 200,
  maxOpacity = 1,
  minOpacity = 0,
  opacityDistance = 500,
  origin,
  position = 'fixed',
  respectReducedMotion = false,
  scopeRef,
  smoothing = 1,
  strokeColor = fallbackStrokeColor,
  target,
  targetAnchor = 'edge',
  targetSwitchBuffer = 0,
}: DynamicArrowCanvasProps) {
  const activeTargetRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef<Point | null>(null)
  const scopeBoundsRef = useRef<RectBounds | null>(null)
  const smoothedOriginRef = useRef<Point | null>(null)
  const smoothedTargetRef = useRef<Point | null>(null)
  const strokeColorRef = useRef<RgbColor>(fallbackStrokeColor)
  const [mediaEnabled, setMediaEnabled] = useState(false)

  const setActiveTarget = useCallback((element: HTMLElement | null) => {
    if (activeTargetRef.current === element) {
      return
    }

    activeTargetRef.current = element
  }, [])

  const getCanvasBounds = useCallback(() => {
    const scopeElement = getScopeElement?.() ?? scopeRef?.current ?? null

    if (scopeElement) {
      return rectToBounds(scopeElement.getBoundingClientRect())
    }

    return viewportBounds()
  }, [getScopeElement, scopeRef])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const context = contextRef.current

    if (!canvas || !context) {
      return
    }

    const bounds = getCanvasBounds()
    const pixelRatio = window.devicePixelRatio || 1

    scopeBoundsRef.current = bounds
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio))
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio))
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }, [getCanvasBounds])

  const clearCanvas = useCallback(() => {
    const context = contextRef.current
    const bounds = scopeBoundsRef.current

    if (!context || !bounds) {
      return
    }

    context.clearRect(0, 0, bounds.width, bounds.height)
  }, [])

  const drawArrow = useCallback(() => {
    const context = contextRef.current
    const pointer = pointerRef.current

    if (!context || !pointer) {
      return false
    }

    const scopeBounds = getCanvasBounds()
    scopeBoundsRef.current = scopeBounds

    if (activeOnlyWhenPointerInside) {
      const activatedElement = activationElement?.() ?? null
      const activationRect = activatedElement
        ? rectToBounds(activatedElement.getBoundingClientRect())
        : scopeBounds

      if (!pointInsideRect(pointer, activationRect)) {
        setActiveTarget(null)
        smoothedOriginRef.current = null
        smoothedTargetRef.current = null
        return false
      }
    }

    const originElement = origin.type === 'element' ? origin.getElement() : null
    const originPoint =
      origin.type === 'pointer'
        ? pointer
        : originElement
          ? rectCenter(rectToBounds(originElement.getBoundingClientRect()))
          : null

    if (!originPoint) {
      setActiveTarget(null)
      smoothedOriginRef.current = null
      smoothedTargetRef.current = null
      return false
    }

    const resolvedTarget = resolveTarget(
      target,
      pointer,
      activeTargetRef.current,
      targetSwitchBuffer,
    )

    if (!resolvedTarget) {
      setActiveTarget(null)
      smoothedOriginRef.current = null
      smoothedTargetRef.current = null
      return false
    }

    setActiveTarget(resolvedTarget.element)

    const targetPoint = pointOnTarget(resolvedTarget.rect, originPoint, edgeOffset, targetAnchor)
    const smoothingAmount = clamp(smoothing, 0.01, 1)
    const smoothedOrigin = smoothedOriginRef.current
      ? lerpPoint(smoothedOriginRef.current, originPoint, smoothingAmount)
      : originPoint
    const smoothedTarget = smoothedTargetRef.current
      ? lerpPoint(smoothedTargetRef.current, targetPoint, smoothingAmount)
      : targetPoint

    smoothedOriginRef.current = smoothedOrigin
    smoothedTargetRef.current = smoothedTarget

    const shouldContinueSmoothing =
      smoothingAmount < 1 &&
      (pointDistance(smoothedOrigin, originPoint) > settledPointDistance ||
        pointDistance(smoothedTarget, targetPoint) > settledPointDistance)

    const x0 = smoothedOrigin.x - scopeBounds.left
    const y0 = smoothedOrigin.y - scopeBounds.top
    const x1 = smoothedTarget.x - scopeBounds.left
    const y1 = smoothedTarget.y - scopeBounds.top
    const distance = Math.hypot(x1 - x0, y1 - y0)

    if (distance < 8) {
      return shouldContinueSmoothing
    }

    const midX = (x0 + x1) / 2
    const midY = (y0 + y1) / 2
    const curveOffset = Math.min(maxCurveOffset, distance * 0.5)
    const curveDirection = clamp((y0 - y1) / 200, -1, 1)
    const controlX = midX
    const controlY = midY + curveOffset * curveDirection
    const opacity = clamp(distance / opacityDistance, minOpacity, maxOpacity)
    const stroke = strokeColorRef.current

    context.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${opacity})`
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = lineWidth

    context.save()
    context.beginPath()
    context.moveTo(x0, y0)
    context.quadraticCurveTo(controlX, controlY, x1, y1)
    context.setLineDash(dashPattern)
    context.stroke()
    context.restore()

    const angle = Math.atan2(y1 - controlY, x1 - controlX)

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(
      x1 - arrowHeadLength * Math.cos(angle - Math.PI / 6),
      y1 - arrowHeadLength * Math.sin(angle - Math.PI / 6),
    )
    context.moveTo(x1, y1)
    context.lineTo(
      x1 - arrowHeadLength * Math.cos(angle + Math.PI / 6),
      y1 - arrowHeadLength * Math.sin(angle + Math.PI / 6),
    )
    context.stroke()

    return shouldContinueSmoothing
  }, [
    activeOnlyWhenPointerInside,
    activationElement,
    arrowHeadLength,
    dashPattern,
    edgeOffset,
    getCanvasBounds,
    lineWidth,
    maxCurveOffset,
    maxOpacity,
    minOpacity,
    opacityDistance,
    origin,
    setActiveTarget,
    smoothing,
    target,
    targetAnchor,
    targetSwitchBuffer,
  ])

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMediaEnabled = () => {
      setMediaEnabled(
        (!finePointerOnly || finePointerQuery.matches) &&
          (!respectReducedMotion || !reducedMotionQuery.matches),
      )
    }

    updateMediaEnabled()
    finePointerQuery.addEventListener('change', updateMediaEnabled)
    reducedMotionQuery.addEventListener('change', updateMediaEnabled)

    return () => {
      finePointerQuery.removeEventListener('change', updateMediaEnabled)
      reducedMotionQuery.removeEventListener('change', updateMediaEnabled)
    }
  }, [finePointerOnly, respectReducedMotion])

  useEffect(() => {
    if (typeof strokeColor === 'object') {
      strokeColorRef.current = strokeColor
      return
    }

    const resolver = document.createElement('div')
    resolver.style.display = 'none'
    document.body.appendChild(resolver)

    const updateStrokeColor = () => {
      resolver.style.color = strokeColor
      const resolvedColor = parseColorString(getComputedStyle(resolver).color)
      strokeColorRef.current = resolvedColor ?? fallbackStrokeColor
    }

    updateStrokeColor()

    const observer = new MutationObserver(updateStrokeColor)
    observer.observe(document.documentElement, {
      attributeFilter: ['class', 'style'],
      attributes: true,
    })

    return () => {
      observer.disconnect()
      resolver.remove()
    }
  }, [fallbackStrokeColor, strokeColor])

  useEffect(() => {
    if (!enabled || !mediaEnabled) {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      clearCanvas()
      setActiveTarget(null)
      return
    }

    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    contextRef.current = canvas.getContext('2d')
    resizeCanvas()

    const runFrame = () => {
      frameRef.current = null
      clearCanvas()

      if (drawArrow() && frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(runFrame)
      }
    }

    const scheduleFrame = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(runFrame)
      }
    }

    const resetArrow = () => {
      setActiveTarget(null)
      pointerRef.current = null
      smoothedOriginRef.current = null
      smoothedTargetRef.current = null

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      clearCanvas()
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
      scheduleFrame()
    }

    const handlePointerLeave = () => {
      resetArrow()
    }

    const handleViewportChange = () => {
      resizeCanvas()
      scheduleFrame()
    }

    const handleScroll = () => {
      if (pointerRef.current) {
        scheduleFrame()
      }
    }

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            handleViewportChange()
          })
    const scopeElement = getScopeElement?.() ?? scopeRef?.current ?? null
    const activatedElement = activationElement?.() ?? scopeElement

    if (scopeElement) {
      resizeObserver?.observe(scopeElement)
    }

    if (activatedElement && activatedElement !== scopeElement) {
      resizeObserver?.observe(activatedElement)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleScroll)
      resizeObserver?.disconnect()

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      pointerRef.current = null
      setActiveTarget(null)
      smoothedOriginRef.current = null
      smoothedTargetRef.current = null
      clearCanvas()
    }
  }, [
    activationElement,
    clearCanvas,
    drawArrow,
    enabled,
    getScopeElement,
    mediaEnabled,
    resizeCanvas,
    setActiveTarget,
    scopeRef,
  ])

  return (
    <canvas
      aria-hidden="true"
      className={cn(
        'pointer-events-none',
        position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0 h-full w-full',
        className,
      )}
      ref={canvasRef}
    />
  )
}
