'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion, type PanInfo, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'

import { cn } from '@/utilities/ui'

export type FairlendHeroOfferingRow = {
  id: string
  title: string
  tagline: string
  image: {
    src: string
    alt?: string
    width: number
    height: number
  }
  imageClassName?: string
  href?: string
}

type OfferingsLayout = 'list' | 'stack'

const MORPH_DELAY_MS = 4000
const AMBIENT_INTERVAL_MS = 3200
const SWIPE_THRESHOLD = 50
const MOBILE_HERO_QUERY = '(max-width: 576px)'

type FairlendHeroOfferingsMorphProps = {
  rows: readonly FairlendHeroOfferingRow[]
  className?: string
}

type StackCard = FairlendHeroOfferingRow & {
  stackPosition: number
}

type ViewportMode = 'unresolved' | 'mobile' | 'desktop'

function OfferingCardBody({
  linkTitle,
  row,
  priority,
}: {
  linkTitle: boolean
  row: FairlendHeroOfferingRow
  priority?: boolean
}): ReactElement {
  return (
    <>
      <div className="fairlend-build-property-types__art">
        <Image
          alt={row.image.alt ?? ''}
          className={cn('fairlend-build-property-types__image', row.imageClassName)}
          height={row.image.height}
          priority={priority}
          sizes="(max-width: 640px) 38vw, (max-width: 1024px) 31vw, 290px"
          src={row.image.src}
          width={row.image.width}
        />
      </div>

      <div aria-hidden="true" className="fairlend-build-property-types__divider" />

      <div className="fairlend-build-property-types__copy">
        <h2 className="fairlend-build-property-types__title">
          {linkTitle && row.href ? (
            <Link
              aria-label={`${row.title}: ${row.tagline}`}
              className="fairlend-hero-offerings-morph__title-link"
              draggable={false}
              href={row.href}
              onDragStart={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              {row.title}
            </Link>
          ) : (
            row.title
          )}
        </h2>
        <p className="fairlend-build-property-types__tagline">{row.tagline}</p>
      </div>
    </>
  )
}

function getStackOrder(rows: readonly FairlendHeroOfferingRow[], activeIndex: number): StackCard[] {
  const reordered: StackCard[] = []
  for (let i = 0; i < rows.length; i += 1) {
    const index = (activeIndex + i) % rows.length
    const row = rows[index]
    if (!row) continue
    reordered.push({ ...row, stackPosition: i })
  }
  return reordered.reverse()
}

function getStackStyles(stackPosition: number, total: number) {
  // Subtle deck peek: mostly vertical, tiny x drift, almost no rotate
  return {
    left: stackPosition * 5,
    opacity: stackPosition === 0 ? 1 : Math.max(0.55, 1 - stackPosition * 0.14),
    rotate: stackPosition * 0.6,
    scale: 1 - stackPosition * 0.012,
    top: stackPosition * 7,
    zIndex: total - stackPosition,
  }
}

export function FairlendHeroOfferingsMorph({
  rows,
  className,
}: FairlendHeroOfferingsMorphProps): ReactElement | null {
  const rootRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [desktopLayout, setDesktopLayout] = useState<OfferingsLayout>('list')
  const [viewportMode, setViewportMode] = useState<ViewportMode>('unresolved')
  const [viewportMotionReady, setViewportMotionReady] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [manualRotationKey, setManualRotationKey] = useState(0)
  const [liveText, setLiveText] = useState(() => {
    const first = rows[0]
    return first ? `1 of ${rows.length}: ${first.title}. ${first.tagline}` : ''
  })

  const isDraggingRef = useRef(false)
  const isInViewRef = useRef(true)
  const isVisibleRef = useRef(true)
  const layout: OfferingsLayout =
    viewportMode === 'desktop' && !shouldReduceMotion ? desktopLayout : 'stack'

  const announce = useCallback(
    (index: number) => {
      const row = rows[index]
      if (row) setLiveText(`${index + 1} of ${rows.length}: ${row.title}. ${row.tagline}`)
    },
    [rows],
  )

  const selectCard = useCallback(
    (index: number) => {
      setActiveIndex(index)
      announce(index)
      setManualRotationKey((current) => current + 1)
    },
    [announce],
  )

  useLayoutEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_HERO_QUERY)

    const syncViewportMode = () => {
      setViewportMode(mobileQuery.matches ? 'mobile' : 'desktop')
    }

    syncViewportMode()
    mobileQuery.addEventListener('change', syncViewportMode)

    return () => {
      mobileQuery.removeEventListener('change', syncViewportMode)
    }
  }, [])

  useEffect(() => {
    if (viewportMode === 'unresolved') return

    const frame = window.requestAnimationFrame(() => {
      setViewportMotionReady(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [viewportMode])

  useEffect(() => {
    if (viewportMode !== 'desktop' || shouldReduceMotion) return

    const timer = window.setTimeout(() => {
      setDesktopLayout('stack')
    }, MORPH_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [shouldReduceMotion, viewportMode])

  useEffect(() => {
    if (layout !== 'stack' || rows.length < 2) return
    if (shouldReduceMotion) return

    const root = rootRef.current
    if (!root) return

    const onVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry?.isIntersecting ?? true
      },
      { threshold: 0.2 },
    )
    observer.observe(root)

    const interval = window.setInterval(() => {
      if (isDraggingRef.current) return
      if (!isInViewRef.current || !isVisibleRef.current) return

      setActiveIndex((prev) => {
        const next = (prev + 1) % rows.length
        announce(next)
        return next
      })
    }, AMBIENT_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [announce, layout, manualRotationKey, rows.length, shouldReduceMotion])

  if (!rows.length) return null

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => {
        const next = (prev + 1) % rows.length
        announce(next)
        return next
      })
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => {
        const next = (prev - 1 + rows.length) % rows.length
        announce(next)
        return next
      })
    }

    isDraggingRef.current = false
    setManualRotationKey((current) => current + 1)
  }

  const displayCards: StackCard[] =
    layout === 'stack'
      ? getStackOrder(rows, activeIndex)
      : rows.map((row, index) => ({ ...row, stackPosition: index }))

  return (
    <div
      className={cn('fairlend-hero-offerings-morph', className)}
      data-offerings-layout={layout}
      ref={rootRef}
    >
      <LayoutGroup>
        <motion.div
          className={cn(
            'fairlend-build-property-types__list',
            layout === 'stack' && 'fairlend-hero-offerings-morph__stack',
          )}
          layout
        >
          <AnimatePresence mode="popLayout">
            {displayCards.map((card, index) => {
              const isTopCard = layout === 'stack' && card.stackPosition === 0
              const stackStyles =
                layout === 'stack' ? getStackStyles(card.stackPosition, rows.length) : undefined

              const body = (
                <OfferingCardBody
                  linkTitle={layout === 'list' || isTopCard}
                  priority={index === 0 || isTopCard}
                  row={card}
                />
              )

              return (
                <motion.div
                  animate={
                    layout === 'stack'
                      ? {
                          left: stackStyles?.left ?? 0,
                          opacity: stackStyles?.opacity ?? 1,
                          rotate: stackStyles?.rotate ?? 0,
                          scale: stackStyles?.scale ?? 1,
                          top: stackStyles?.top ?? 0,
                          x: 0,
                          zIndex: stackStyles?.zIndex ?? 1,
                        }
                      : {
                          opacity: 1,
                          rotate: 0,
                          scale: 1,
                          x: 0,
                        }
                  }
                  className={cn(
                    'fairlend-build-property-types__row',
                    'fairlend-hero-offerings-morph__row',
                    'pointer-events-auto',
                    layout === 'stack' && 'fairlend-hero-offerings-morph__card',
                    isTopCard && 'fairlend-hero-offerings-morph__card--top',
                  )}
                  data-offering-id={card.id}
                  drag={isTopCard && !shouldReduceMotion ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.55}
                  exit={{ opacity: 0, scale: 0.96, x: -80 }}
                  initial={false}
                  key={card.id}
                  layoutId={card.id}
                  onDragEnd={handleDragEnd}
                  onDragStart={() => {
                    isDraggingRef.current = true
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : !viewportMotionReady
                        ? { duration: 0 }
                      : {
                          layout: {
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          opacity: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                          rotate: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                          scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                          x: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                          default: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                        }
                  }
                  whileDrag={{ cursor: 'grabbing', scale: 1.015 }}
                >
                  <div
                    aria-hidden={layout === 'stack' && !isTopCard}
                    className="fairlend-hero-offerings-morph__surface"
                  >
                    {body}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {layout === 'stack' && rows.length > 1 ? (
        <div className="fairlend-hero-offerings-morph__controls pointer-events-auto">
          <span aria-hidden="true" className="fairlend-hero-offerings-morph__count">
            {activeIndex + 1} / {rows.length}
          </span>
          <div
            aria-label="Select a financing option"
            className="fairlend-hero-offerings-morph__dots"
            role="group"
          >
            {rows.map((row, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  aria-label={`Show ${row.title}`}
                  aria-pressed={isActive}
                  className="fairlend-hero-offerings-morph__dot"
                  data-active={isActive ? 'true' : 'false'}
                  key={row.id}
                  onClick={() => selectCard(index)}
                  type="button"
                >
                  <span aria-hidden="true">{isActive ? '●' : '○'}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  )
}
