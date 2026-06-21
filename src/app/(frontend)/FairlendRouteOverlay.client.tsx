"use client"

import { motion, useReducedMotion } from "motion/react"

import styles from "./page.module.css"

const routePath =
  "M710 383 C800 361 871 382 930 356 C954 346 973 329 989 324 C1018 315 1048 250 1088 208 C1134 161 1197 189 1218 330 C1232 392 1298 419 1340 425 C1368 429 1404 429 1430 425 C1470 419 1505 416 1534 416"

const routeNodes = [
  { cx: 710, cy: 383 },
  { cx: 989, cy: 324 },
  { cx: 1218, cy: 330 },
  { cx: 1430, cy: 425 },
  { cx: 1534, cy: 416 },
]

const guidePath = "M710 383V318M989 324V318M1218 330V324M1430 425V324"

const mobileRoutePath =
  "M58 225 C91 202 122 265 151 251 C181 237 198 206 224 218 C252 231 254 285 290 293 C322 301 331 267 350 278 C364 286 372 293 384 291"

const mobileRouteNodes = [
  { cx: 58, cy: 225 },
  { cx: 151, cy: 251 },
  { cx: 224, cy: 218 },
  { cx: 350, cy: 278 },
  { cx: 384, cy: 291 },
]

export function FairlendRouteOverlay() {
  const reduceMotion = useReducedMotion()
  const drawTransition = reduceMotion
    ? { duration: 0 }
    : { delay: 0.22, duration: 1.35, ease: [0.22, 1, 0.36, 1] as const }
  const stemTransition = reduceMotion
    ? { duration: 0 }
    : { delay: 1.02, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  const gradientTransition = reduceMotion
    ? { duration: 0 }
    : { delay: 1.58, duration: 2.85, ease: "linear" as const, repeat: Infinity }

  function renderRoute({
    filterId,
    gradientId,
    guide,
    nodes,
    path,
  }: {
    filterId: string
    gradientId: string
    guide?: string
    nodes: typeof routeNodes
    path: string
  }) {
    return (
      <>
        <motion.path
          animate={{ pathLength: 1, opacity: 1 }}
          className={styles.routeGlow}
          d={path}
          filter={`url(#${filterId})`}
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
          stroke="#fff0dd"
          strokeLinecap="round"
          strokeWidth="19"
          transition={drawTransition}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 1 }}
          className={styles.routeUnderlay}
          d={path}
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 1 }}
          stroke="#fff7ec"
          strokeLinecap="round"
          strokeWidth="11"
          transition={drawTransition}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 1 }}
          className={styles.routeCore}
          d={path}
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 1 }}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="5.6"
          transition={drawTransition}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 0.42 }}
          className={styles.routeHighlight}
          d={path}
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 0.42 : 0 }}
          stroke="#ffe0cf"
          strokeLinecap="round"
          strokeWidth="1.4"
          transition={drawTransition}
        />

        {guide ? (
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            className={styles.routeStems}
            d={guide}
            initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
            stroke="#ff5b34"
            strokeLinecap="round"
            strokeWidth="2.6"
            transition={stemTransition}
          />
        ) : null}

        {nodes.map(({ cx, cy }, index) => (
          <g key={`${gradientId}-${cx}-${cy}`}>
            <motion.circle
              animate={{ opacity: 0.74, scale: 1 }}
              className={styles.routeNodeHalo}
              cx={cx}
              cy={cy}
              fill="none"
              initial={{ opacity: reduceMotion ? 0.74 : 0, scale: reduceMotion ? 1 : 0.7 }}
              r="10.8"
              stroke="#fff1df"
              strokeWidth="6"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 1.02 + index * 0.08,
                      duration: 0.35,
                      ease: [0.34, 1.36, 0.64, 1] as const,
                    }
              }
              vectorEffect="non-scaling-stroke"
            />
            <motion.circle
              animate={{ opacity: 1, scale: 1 }}
              className={styles.routeNode}
              cx={cx}
              cy={cy}
              fill="#fff7ed"
              initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.65 }}
              r="7.4"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 1.05 + index * 0.08,
                      duration: 0.35,
                      ease: [0.34, 1.36, 0.64, 1] as const,
                    }
              }
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </>
    )
  }

  return (
    <>
      <svg
        aria-hidden="true"
        className={styles.routeSvg}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1670 941"
      >
        <defs>
          <motion.linearGradient
            animate={
              reduceMotion
                ? { x1: 660, x2: 1500 }
                : {
                    x1: [430, 760, 1090, 430],
                    x2: [960, 1290, 1620, 960],
                  }
            }
            gradientUnits="userSpaceOnUse"
            id="fairlendRouteGradient"
            initial={{ x1: 430, x2: 960, y1: 380, y2: 665 }}
            transition={gradientTransition}
            y1="380"
            y2="665"
          >
            <stop offset="0%" stopColor="#ff6a38" />
            <stop offset="28%" stopColor="#ff3217" />
            <stop offset="50%" stopColor="#ff9f74" />
            <stop offset="68%" stopColor="#ff4b22" />
            <stop offset="100%" stopColor="#ff7a44" />
          </motion.linearGradient>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="530"
            id="fairlendRouteFloat"
            width="900"
            x="650"
            y="145"
          >
            <feDropShadow dx="0" dy="8" floodColor="#6c492a" floodOpacity="0.16" stdDeviation="8" />
            <feDropShadow dx="0" dy="1" floodColor="#ffffff" floodOpacity="0.75" stdDeviation="1.2" />
          </filter>
        </defs>
        {renderRoute({
          filterId: "fairlendRouteFloat",
          gradientId: "fairlendRouteGradient",
          guide: guidePath,
          nodes: routeNodes,
          path: routePath,
        })}
      </svg>

      <svg
        aria-hidden="true"
        className={styles.mobileRouteSvg}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 390 590"
      >
        <defs>
          <motion.linearGradient
            animate={
              reduceMotion
                ? { x1: 42, x2: 360 }
                : {
                    x1: [12, 138, 260, 12],
                    x2: [178, 304, 430, 178],
                  }
            }
            gradientUnits="userSpaceOnUse"
            id="fairlendMobileRouteGradient"
            initial={{ x1: 12, x2: 178, y1: 275, y2: 160 }}
            transition={gradientTransition}
            y1="275"
            y2="160"
          >
            <stop offset="0%" stopColor="#ff6a38" />
            <stop offset="28%" stopColor="#ff3217" />
            <stop offset="50%" stopColor="#ff9f74" />
            <stop offset="68%" stopColor="#ff4b22" />
            <stop offset="100%" stopColor="#ff7a44" />
          </motion.linearGradient>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="250"
            id="fairlendMobileRouteFloat"
            width="390"
            x="0"
            y="95"
          >
            <feDropShadow dx="0" dy="7" floodColor="#6c492a" floodOpacity="0.15" stdDeviation="7" />
            <feDropShadow dx="0" dy="1" floodColor="#ffffff" floodOpacity="0.72" stdDeviation="1.1" />
          </filter>
        </defs>
        {renderRoute({
          filterId: "fairlendMobileRouteFloat",
          gradientId: "fairlendMobileRouteGradient",
          nodes: mobileRouteNodes,
          path: mobileRoutePath,
        })}
      </svg>
    </>
  )
}
