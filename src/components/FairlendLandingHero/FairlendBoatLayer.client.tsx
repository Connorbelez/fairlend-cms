'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'

const boatAssets = {
  lowerLeft: '/sailboat-lower-left.webp',
  upperCenter: '/sailboat-upper-center.webp',
} as const

type BoatPath = {
  assetRatio: number
  centerX: number
  centerY: number
  endAngleDeg: number
  phaseOffset?: number
  radiusX: number
  radiusY: number
  startAngleDeg: number
  width: number
}

type BoatFrame = {
  rotate: number
  scaleX: 1 | -1
  width: number
  x: number
  y: number
}

type BoatLayerSize = {
  height: number
  width: number
}

type BoatViewBox = {
  height: number
  width: number
}

// Both WebP sprites naturally point east-northeast: bow vector is about 26deg
// above the horizontal stern line, so rotations subtract that native heading.
const boatNativeHeadingDeg = -26
const boatAssetRatio = {
  lowerLeft: 1084 / 695,
  upperCenter: 1042 / 703,
} as const

function normalizeAngle(angle: number) {
  let next = angle

  while (next > 180) {
    next -= 360
  }

  while (next < -180) {
    next += 360
  }

  return next
}

function easeInOutSine(progress: number) {
  return 0.5 - Math.cos(Math.PI * progress) / 2
}

function getBoatFrame(
  image: BoatPath,
  cycleProgress: number,
  layerSize: BoatLayerSize,
  viewBox: BoatViewBox,
): BoatFrame {
  const scaleX = layerSize.width / viewBox.width
  const scaleY = layerSize.height / viewBox.height
  const outbound = cycleProgress < 0.5
  const legProgress = outbound ? cycleProgress * 2 : (1 - cycleProgress) * 2
  const easedProgress = easeInOutSine(legProgress)
  const angleRange = image.endAngleDeg - image.startAngleDeg
  const angleDirection = (outbound ? 1 : -1) * Math.sign(angleRange || 1)
  const angleDeg = image.startAngleDeg + angleRange * easedProgress
  const angle = (angleDeg * Math.PI) / 180
  const pointX = (image.centerX + image.radiusX * Math.cos(angle)) * scaleX
  const pointY = (image.centerY + image.radiusY * Math.sin(angle)) * scaleY
  const tangentX = -angleDirection * image.radiusX * Math.sin(angle) * scaleX
  const tangentY = angleDirection * image.radiusY * Math.cos(angle) * scaleY
  const tangentHeadingDeg = (Math.atan2(tangentY, tangentX) * 180) / Math.PI
  const rotate = outbound
    ? tangentHeadingDeg - boatNativeHeadingDeg
    : 180 - tangentHeadingDeg - boatNativeHeadingDeg
  const width = image.width * scaleX
  const height = width * image.assetRatio

  return {
    rotate: normalizeAngle(rotate),
    scaleX: outbound ? 1 : -1,
    width,
    x: pointX - width / 2,
    y: pointY - height / 2,
  }
}

const desktopLowerBoat = {
  assetRatio: boatAssetRatio.lowerLeft,
  centerX: 1452,
  centerY: 548,
  endAngleDeg: 335,
  phaseOffset: 2,
  radiusX: 112,
  radiusY: 22,
  startAngleDeg: 205,
  width: 27,
} satisfies BoatPath

const desktopUpperBoat = {
  assetRatio: boatAssetRatio.upperCenter,
  centerX: 1000,
  centerY: 655,
  endAngleDeg: 330,
  phaseOffset: 6,
  radiusX: 82,
  radiusY: 14,
  startAngleDeg: 210,
  width: 21.5,
} satisfies BoatPath

const mobileLowerBoat = {
  assetRatio: boatAssetRatio.lowerLeft,
  centerX: 352,
  centerY: 355,
  endAngleDeg: 335,
  phaseOffset: 1,
  radiusX: 28,
  radiusY: 5,
  startAngleDeg: 205,
  width: 13.5,
} satisfies BoatPath

const mobileUpperBoat = {
  assetRatio: boatAssetRatio.upperCenter,
  centerX: 363,
  centerY: 425,
  endAngleDeg: 325,
  phaseOffset: 4,
  radiusX: 20,
  radiusY: 4,
  startAngleDeg: 210,
  width: 10.5,
} satisfies BoatPath

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<BoatLayerSize>({ height: 0, width: 0 })

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const updateSize = () => {
      setSize({
        height: element.clientHeight,
        width: element.clientWidth,
      })
    }
    const observer = new ResizeObserver(updateSize)

    updateSize()
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { ref, size }
}

function BoatImage({
  duration,
  image,
  layerSize,
  loop,
  viewBox,
}: {
  duration: number
  image: BoatPath
  layerSize: BoatLayerSize
  loop: (typeof boatAssets)[keyof typeof boatAssets]
  viewBox: BoatViewBox
}) {
  const reduceMotion = useReducedMotion()
  const staticFrame = getBoatFrame(image, 0, layerSize, viewBox)
  const rotate = useMotionValue(staticFrame.rotate)
  const scaleX = useMotionValue(staticFrame.scaleX)
  const width = useMotionValue(staticFrame.width)
  const x = useMotionValue(staticFrame.x)
  const y = useMotionValue(staticFrame.y)

  useEffect(() => {
    if (layerSize.height === 0 || layerSize.width === 0) {
      return
    }

    const frame = getBoatFrame(image, 0, layerSize, viewBox)

    rotate.set(frame.rotate)
    scaleX.set(frame.scaleX)
    width.set(frame.width)
    x.set(frame.x)
    y.set(frame.y)
  }, [image, layerSize.height, layerSize.width, rotate, scaleX, viewBox, width, x, y])

  useAnimationFrame((time) => {
    if (reduceMotion || layerSize.height === 0 || layerSize.width === 0) {
      return
    }

    const cycleProgress = ((time / 1000 + (image.phaseOffset ?? 0)) % duration) / duration
    const frame = getBoatFrame(image, cycleProgress, layerSize, viewBox)

    rotate.set(frame.rotate)
    scaleX.set(frame.scaleX)
    width.set(frame.width)
    x.set(frame.x)
    y.set(frame.y)
  })

  return (
    <motion.img
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 block h-auto max-w-none select-none opacity-100 drop-shadow-[0_15px_11px_rgb(41_30_19/32%)] will-change-transform [filter:drop-shadow(0_15px_11px_rgb(41_30_19/32%))_drop-shadow(0_3px_2px_rgb(78_53_30/18%))_drop-shadow(0_-1px_1px_rgb(255_255_255/86%))]"
      draggable={false}
      src={loop}
      style={{ rotate, scaleX, transformOrigin: 'center', width, x, y }}
    />
  )
}

function BoatLayer({
  boats,
  className,
  viewBox,
}: {
  boats: Array<{
    duration: number
    image: BoatPath
    loop: (typeof boatAssets)[keyof typeof boatAssets]
  }>
  className: string
  viewBox: BoatViewBox
}) {
  const { ref, size } = useElementSize()

  return (
    <div aria-hidden="true" className={className} ref={ref}>
      {boats.map((boat) => (
        <BoatImage
          duration={boat.duration}
          image={boat.image}
          key={`${boat.loop}-${boat.duration}`}
          layerSize={size}
          loop={boat.loop}
          viewBox={viewBox}
        />
      ))}
    </div>
  )
}

export function FairlendBoatLayer() {
  return (
    <>
      <BoatLayer
        boats={[
          {
            duration: 27,
            image: desktopLowerBoat,
            loop: boatAssets.lowerLeft,
          },
          {
            duration: 18,
            image: desktopUpperBoat,
            loop: boatAssets.upperCenter,
          },
        ]}
        className="absolute inset-0 z-[2] size-full overflow-visible hero-max-1279:hidden"
        viewBox={{ height: 941, width: 1670 }}
      />

      <BoatLayer
        boats={[
          {
            duration: 22,
            image: mobileLowerBoat,
            loop: boatAssets.lowerLeft,
          },
          {
            duration: 15,
            image: mobileUpperBoat,
            loop: boatAssets.upperCenter,
          },
        ]}
        className="absolute inset-0 z-[2] hidden size-full overflow-visible hero-max-1279:block hero-tablet:z-[11] hero-mobile:z-[11]"
        viewBox={{ height: 590, width: 390 }}
      />
    </>
  )
}
