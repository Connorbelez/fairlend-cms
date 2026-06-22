'use client'

import { curveCatmullRom, line } from 'd3-shape'
import { motion, useReducedMotion } from 'motion/react'

type RoutePoint = { x: number; y: number }
type ViewBox = { height: number; width: number }
type SvgPoint = { x: number; y: number }

type RouteGeometry = {
  branchPaths?: string[]
  filterBounds: { height: number; width: number; x: number; y: number }
  guideGradient?: { y1: number; y2: number }
  guideSegments?: Array<{ d: string; progress: number }>
  nodeProgress: number[]
  nodes: SvgPoint[]
  path: string
  routeGradient: {
    x1End: number
    x1Start: number
    x2End: number
    x2Start: number
    y1: number
    y2: number
  }
  viewBox: ViewBox
}

const routeLine = line<SvgPoint>()
  .x((point) => point.x)
  .y((point) => point.y)
  .curve(curveCatmullRom.alpha(0.5))

const routeDrawDelay = 0.22
const routeDrawDuration = 2.4
const nodeTransitionEase = [0.22, 1, 0.36, 1] as const

const desktopViewBox = { width: 1670, height: 941 }
const mobileViewBox = { width: 390, height: 590 }

function toSvgPoint(point: RoutePoint, viewBox: ViewBox): SvgPoint {
  return {
    x: (point.x / 100) * viewBox.width,
    y: (point.y / 100) * viewBox.height,
  }
}

function progressByX(point: SvgPoint, first: SvgPoint, last: SvgPoint) {
  const span = last.x - first.x

  if (span === 0) {
    return 0
  }

  return Math.min(Math.max((point.x - first.x) / span, 0), 1)
}

function compactSvgPath(path: string) {
  return path.replace(/-?\d+\.\d{3,}/g, (value) =>
    Number(value)
      .toFixed(2)
      .replace(/\.?0+$/, ''),
  )
}

function getFilterBounds(points: SvgPoint[], viewBox: ViewBox) {
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const paddingX = viewBox.width * 0.065
  const paddingY = viewBox.height * 0.105

  return {
    x: Math.max(0, minX - paddingX),
    y: Math.max(0, minY - paddingY),
    width: Math.min(viewBox.width, maxX + paddingX) - Math.max(0, minX - paddingX),
    height: Math.min(viewBox.height, maxY + paddingY) - Math.max(0, minY - paddingY),
  }
}

function createRouteGeometry({
  branchPointSets = [],
  extraNodePoints = [],
  guideEndY,
  guideNodeIndexes = [],
  nodeIndexes,
  points,
  viewBox,
}: {
  branchPointSets?: RoutePoint[][]
  extraNodePoints?: RoutePoint[]
  guideEndY?: number
  guideNodeIndexes?: number[]
  nodeIndexes: number[]
  points: RoutePoint[]
  viewBox: ViewBox
}): RouteGeometry {
  const svgPoints = points.map((point) => toSvgPoint(point, viewBox))
  const first = svgPoints[0]
  const last = svgPoints.at(-1) ?? first
  const path = compactSvgPath(routeLine(svgPoints) ?? '')
  const branchPointGroups = branchPointSets.map((pointSet) =>
    pointSet.map((point) => toSvgPoint(point, viewBox)),
  )
  const branchPaths = branchPointGroups.map((pointSet) => compactSvgPath(routeLine(pointSet) ?? ''))
  const extraNodes = extraNodePoints.map((point) => toSvgPoint(point, viewBox))
  const nodes = [...nodeIndexes.map((index) => svgPoints[index]).filter(Boolean), ...extraNodes]
  const nodeProgress = nodes.map((node) => progressByX(node, first, last))
  const routeSpan = Math.max(last.x - first.x, viewBox.width * 0.12)
  const guideY = typeof guideEndY === 'number' ? (guideEndY / 100) * viewBox.height : undefined
  const guideSegments =
    typeof guideY === 'number'
      ? guideNodeIndexes
          .map((pointIndex) => {
            const point = svgPoints[pointIndex]

            if (!point) {
              return null
            }

            return {
              d: `M${point.x} ${point.y}V${guideY}`,
              progress: progressByX(point, first, last),
            }
          })
          .filter(Boolean)
      : undefined

  return {
    branchPaths,
    filterBounds: getFilterBounds(svgPoints, viewBox),
    guideGradient:
      typeof guideY === 'number'
        ? {
            y1: Math.max(...guideNodeIndexes.map((index) => svgPoints[index]?.y ?? guideY)),
            y2: guideY,
          }
        : undefined,
    guideSegments: guideSegments as Array<{ d: string; progress: number }> | undefined,
    nodeProgress,
    nodes,
    path,
    routeGradient: {
      x1End: last.x,
      x1Start: first.x,
      x2End: last.x + routeSpan,
      x2Start: last.x,
      y1: first.y,
      y2: last.y,
    },
    viewBox,
  }
}

const desktopRoute = createRouteGeometry({
  guideEndY: 31.25,
  guideNodeIndexes: [0, 3, 5, 7],
  nodeIndexes: [0, 3, 5, 7, 8],
  points: [
    { x: 42.5, y: 40.7 },
    { x: 50.5, y: 39.7 },
    { x: 55.7, y: 39.0 },
    { x: 59.2, y: 38.2 },
    { x: 65.2, y: 37.6 },
    { x: 72.9, y: 38.4 },
    { x: 80.2, y: 44.9 },
    { x: 85.6, y: 45.2 },
    { x: 91.9, y: 44.2 },
  ],
  viewBox: desktopViewBox,
})

const mobileRoute = createRouteGeometry({
  nodeIndexes: [1, 3, 5],
  points: [
    { x: 2, y: 40.2 },
    { x: 20, y: 47.2 },
    { x: 40, y: 40.2 },
    { x: 60, y: 48.2 },
    { x: 80.0, y: 47.2 },
    { x: 100.0, y: 51.2 },
    { x: 130.0, y: 51.2 },
  ],
  viewBox: mobileViewBox,
})

const compactMobileRoute = createRouteGeometry({
  nodeIndexes: [3, 5, 7],
  points: [
    { x: -2.5, y: 13.2 },
    { x: 6.5, y: 20.5 },
    { x: 18.5, y: 28.2 },
    { x: 30.0, y: 33.5 },
    { x: 39.5, y: 39.0 },
    { x: 52.0, y: 41.8 },
    { x: 62.5, y: 42.4 },
    { x: 73.0, y: 41.8 },
  ],
  viewBox: mobileViewBox,
})

export function FairlendRouteOverlay() {
  const reduceMotion = useReducedMotion()
  const drawTransition = reduceMotion
    ? { duration: 0 }
    : { delay: routeDrawDelay, duration: routeDrawDuration, ease: 'linear' as const }
  const gradientTransition = reduceMotion
    ? { duration: 0 }
    : {
        delay: routeDrawDelay + routeDrawDuration,
        duration: 3.2,
        ease: 'linear' as const,
        repeat: Infinity,
      }

  function renderRoute({
    filterId,
    gradientId,
    guideGradientId,
    route,
  }: {
    filterId: string
    gradientId: string
    guideGradientId?: string
    route: RouteGeometry
  }) {
    const routePaths = [route.path, ...(route.branchPaths ?? [])].filter(Boolean)

    return (
      <>
        {routePaths.map((pathData, index) => (
          <g key={`${gradientId}-path-${index}`}>
            <motion.path
              animate={{ pathLength: 1, opacity: 1 }}
              className="opacity-[0.62] [vector-effect:non-scaling-stroke]"
              d={pathData}
              filter={`url(#${filterId})`}
              initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
              stroke="#fff0dd"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="10"
              transition={drawTransition}
            />
            <motion.path
              animate={{ pathLength: 1, opacity: 1 }}
              className="opacity-[0.82] [vector-effect:non-scaling-stroke]"
              d={pathData}
              initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 1 }}
              stroke="#fff7ec"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
              transition={drawTransition}
            />
            <motion.path
              animate={{ pathLength: 1, opacity: 1 }}
              className="opacity-90 [filter:drop-shadow(0_2px_3px_rgb(114_61_28/14%))] [vector-effect:non-scaling-stroke]"
              d={pathData}
              initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 1 }}
              stroke={`url(#${gradientId})`}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              transition={drawTransition}
            />
            <motion.path
              animate={{ pathLength: 1, opacity: 0.42 }}
              className="mix-blend-soft-light [vector-effect:non-scaling-stroke]"
              d={pathData}
              initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 0.42 : 0 }}
              stroke="#ffe0cf"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.4"
              transition={drawTransition}
            />
          </g>
        ))}

        {route.guideSegments?.map((segment) => (
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            className="opacity-[0.88] [filter:drop-shadow(0_4px_5px_rgb(73_44_20/12%))] [vector-effect:non-scaling-stroke]"
            d={segment.d}
            initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
            key={`${guideGradientId}-${segment.d}`}
            stroke={guideGradientId ? `url(#${guideGradientId})` : `url(#${gradientId})`}
            strokeLinecap="round"
            strokeWidth="2.6"
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: routeDrawDelay + routeDrawDuration * segment.progress,
                    duration: 0.34,
                    ease: nodeTransitionEase,
                  }
            }
          />
        ))}

        {route.nodes.map(({ x, y }, index) => (
          <g key={`${gradientId}-${x}-${y}`}>
            <motion.circle
              animate={{ opacity: 0.74, scale: 1 }}
              className="origin-center opacity-[0.74] [filter:drop-shadow(0_8px_10px_rgb(73_44_20/10%))] [transform-box:fill-box]"
              cx={x}
              cy={y}
              fill="none"
              initial={{ opacity: reduceMotion ? 0.74 : 0, scale: reduceMotion ? 1 : 0.7 }}
              r="10.8"
              stroke="#fff1df"
              strokeWidth="6"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay:
                        routeDrawDelay +
                        routeDrawDuration *
                          (route.nodeProgress[index] ?? index / route.nodes.length),
                      duration: 0.3,
                      ease: nodeTransitionEase,
                    }
              }
              vectorEffect="non-scaling-stroke"
            />
            <motion.circle
              animate={{ opacity: 1, scale: 1 }}
              className="origin-center opacity-[0.92] [filter:drop-shadow(0_5px_7px_rgb(73_44_20/13%))] [transform-box:fill-box]"
              cx={x}
              cy={y}
              fill="#fff7ed"
              initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.65 }}
              r="7.4"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay:
                        routeDrawDelay +
                        routeDrawDuration *
                          (route.nodeProgress[index] ?? index / route.nodes.length),
                      duration: 0.3,
                      ease: nodeTransitionEase,
                    }
              }
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </>
    )
  }

  function renderRouteSvg({
    className,
    filterId,
    gradientId,
    guideGradientId,
    route,
  }: {
    className: string
    filterId: string
    gradientId: string
    guideGradientId?: string
    route: RouteGeometry
  }) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        preserveAspectRatio="none"
        viewBox={`0 0 ${route.viewBox.width} ${route.viewBox.height}`}
      >
        <defs>
          <motion.linearGradient
            animate={
              reduceMotion
                ? {
                    x1: route.routeGradient.x1Start,
                    x2: route.routeGradient.x2Start,
                  }
                : {
                    x1: [route.routeGradient.x1Start, route.routeGradient.x1End],
                    x2: [route.routeGradient.x2Start, route.routeGradient.x2End],
                  }
            }
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            initial={{
              x1: route.routeGradient.x1Start,
              x2: route.routeGradient.x2Start,
              y1: route.routeGradient.y1,
              y2: route.routeGradient.y2,
            }}
            transition={gradientTransition}
            y1={route.routeGradient.y1}
            y2={route.routeGradient.y2}
          >
            <stop offset="0%" stopColor="#ff3217" />
            <stop offset="42%" stopColor="#ff5b34" />
            <stop offset="76%" stopColor="#ffb295" />
            <stop offset="100%" stopColor="#fff7ec" />
          </motion.linearGradient>
          {guideGradientId && route.guideGradient ? (
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={guideGradientId}
              x1="0"
              x2="0"
              y1={route.guideGradient.y1}
              y2={route.guideGradient.y2}
            >
              <stop offset="0%" stopColor="#ff3217" />
              <stop offset="58%" stopColor="#ff5b34" />
              <stop offset="100%" stopColor="#fff7ec" />
            </linearGradient>
          ) : null}
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height={route.filterBounds.height}
            id={filterId}
            width={route.filterBounds.width}
            x={route.filterBounds.x}
            y={route.filterBounds.y}
          >
            <feDropShadow dx="0" dy="8" floodColor="#6c492a" floodOpacity="0.16" stdDeviation="8" />
            <feDropShadow
              dx="0"
              dy="1"
              floodColor="#ffffff"
              floodOpacity="0.75"
              stdDeviation="1.2"
            />
          </filter>
        </defs>
        {renderRoute({
          filterId,
          gradientId,
          guideGradientId,
          route,
        })}
      </svg>
    )
  }

  return (
    <>
      {renderRouteSvg({
        className: 'absolute inset-0 z-[3] size-full hero-max-1279:hidden',
        filterId: 'fairlendRouteFloat',
        gradientId: 'fairlendRouteGradient',
        guideGradientId: 'fairlendGuideGradient',
        route: desktopRoute,
      })}

      {renderRouteSvg({
        className:
          'absolute inset-0 z-[3] hidden size-full hero-max-1279:block hero-tablet:z-[5] hero-mobile:z-[5] hero-compact:hidden',
        filterId: 'fairlendMobileRouteFloat',
        gradientId: 'fairlendMobileRouteGradient',
        route: mobileRoute,
      })}

      {renderRouteSvg({
        className:
          'absolute inset-0 z-[3] hidden size-full hero-compact:block hero-compact-short:-translate-y-7 hero-tablet:z-[5] hero-mobile:z-[5]',
        filterId: 'fairlendCompactMobileRouteFloat',
        gradientId: 'fairlendCompactMobileRouteGradient',
        route: compactMobileRoute,
      })}
    </>
  )
}
