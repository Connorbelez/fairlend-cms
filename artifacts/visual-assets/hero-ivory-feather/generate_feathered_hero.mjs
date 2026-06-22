import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const sourcePath = path.join(root, 'public/assets/fairlend-desktop-hero.webp')
const outputPath = path.join(root, 'public/assets/fairlend-desktop-hero-baseplate-preserved.webp')
const previewPath = path.join(root, 'artifacts/visual-assets/hero-ivory-feather/preview-on-ivory.png')
const checkerPath = path.join(root, 'artifacts/visual-assets/hero-ivory-feather/preview-on-checker.png')
const mattePath = path.join(root, 'artifacts/visual-assets/hero-ivory-feather/alpha-matte.png')
const reportPath = path.join(root, 'artifacts/visual-assets/hero-ivory-feather/report.json')

const ivory = [255, 253, 247]
const sampleSize = 42

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function saturation(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

function distanceTo(color, r, g, b) {
  return Math.hypot((r - color[0]) * 0.75, (g - color[1]) * 0.95, (b - color[2]) * 1.18)
}

function backgroundAffinity(bg, r, g, b) {
  const lum = luma(r, g, b)
  const sat = saturation(r, g, b)
  const dist = distanceTo(bg, r, g, b)
  const distanceMatch = 1 - smoothstep(42, 118, dist)
  const lumaMatch = smoothstep(174, 236, lum)
  const saturationMatch = 1 - smoothstep(36, 92, sat)

  return Math.max(0, Math.min(1, distanceMatch * lumaMatch * saturationMatch))
}

function colorAt(data, width, x, y) {
  const i = (y * width + x) * 4
  return [data[i], data[i + 1], data[i + 2]]
}

function pointInPolygon(x, y, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]
    const xj = polygon[j][0]
    const yj = polygon[j][1]
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function distanceToSegment(x, y, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const lengthSquared = dx * dx + dy * dy
  if (lengthSquared === 0) return Math.hypot(x - ax, y - ay)

  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / lengthSquared))
  const px = ax + t * dx
  const py = ay + t * dy
  return Math.hypot(x - px, y - py)
}

function distanceToPolygon(x, y, polygon) {
  let distance = Number.POSITIVE_INFINITY
  for (let i = 0; i < polygon.length; i++) {
    const [ax, ay] = polygon[i]
    const [bx, by] = polygon[(i + 1) % polygon.length]
    distance = Math.min(distance, distanceToSegment(x, y, ax, ay, bx, by))
  }
  return distance
}

function estimateBackground(data, width, height) {
  const samples = []
  const corners = [
    [0, 0],
    [width - sampleSize, 0],
    [0, height - sampleSize],
    [width - sampleSize, height - sampleSize],
  ]

  for (const [startX, startY] of corners) {
    for (let y = startY; y < startY + sampleSize; y += 3) {
      for (let x = startX; x < startX + sampleSize; x += 3) {
        samples.push(colorAt(data, width, x, y))
      }
    }
  }

  return [0, 1, 2].map((channel) => {
    const values = samples.map((sample) => sample[channel]).sort((a, b) => a - b)
    return values[Math.floor(values.length / 2)]
  })
}

async function buildChecker(width, height) {
  const tile = 24
  const data = Buffer.alloc(width * height * 3)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const light = (Math.floor(x / tile) + Math.floor(y / tile)) % 2 === 0
      const v = light ? 236 : 204
      const i = (y * width + x) * 3
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
    }
  }
  return sharp(data, { raw: { width, height, channels: 3 } }).png().toBuffer()
}

async function main() {
  const image = sharp(sourcePath).ensureAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const bg = estimateBackground(data, width, height)
  const protectedBaseplatePolygon = [
    [346, 135],
    [1014, 133],
    [1167, 171],
    [1294, 212],
    [1394, 245],
    [1448, 278],
    [1448, 498],
    [1398, 526],
    [1284, 541],
    [1160, 565],
    [1043, 596],
    [968, 626],
    [906, 661],
    [808, 711],
    [696, 746],
    [568, 787],
    [392, 792],
    [212, 764],
    [92, 697],
    [7, 620],
    [7, 496],
    [75, 444],
    [96, 386],
    [128, 334],
    [210, 260],
  ]

  const output = Buffer.alloc(width * height * 4)
  const matte = Buffer.alloc(width * height)
  let transparentPixels = 0
  let partialPixels = 0
  let ivoryShiftedPixels = 0
  let protectedPixels = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x
      const i = p * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const insideBaseplate = pointInPolygon(x, y, protectedBaseplatePolygon)

      const outsideDistance = insideBaseplate
        ? 0
        : distanceToPolygon(x, y, protectedBaseplatePolygon)
      const outsideFeather = insideBaseplate ? 1 : 1 - smoothstep(0, 142, outsideDistance)
      const topAirDissolve = insideBaseplate ? 1 : smoothstep(0, height * 0.105, y)
      const bottomWaterDissolve = insideBaseplate
        ? 1
        : 1 - smoothstep(height * 0.69, height * 0.995, y) * 0.94
      const leftBackgroundFalloff = insideBaseplate
        ? 1
        : Math.max(0.08, smoothstep(width * 0.025, width * 0.18, x))
      const alpha = Math.max(
        0,
        Math.min(1, outsideFeather * topAirDissolve * bottomWaterDissolve * leftBackgroundFalloff),
      )

      const edgeDecontamination = insideBaseplate ? 0 : Math.pow(1 - alpha, 0.78) * 0.9
      const ivoryCorrection = insideBaseplate ? 0 : backgroundAffinity(bg, r, g, b) * 0.62
      const ivoryBlend = Math.max(edgeDecontamination, ivoryCorrection)
      if (insideBaseplate) protectedPixels++
      if (ivoryBlend > 0.08) ivoryShiftedPixels++

      output[i] = Math.round(r * (1 - ivoryBlend) + ivory[0] * ivoryBlend)
      output[i + 1] = Math.round(g * (1 - ivoryBlend) + ivory[1] * ivoryBlend)
      output[i + 2] = Math.round(b * (1 - ivoryBlend) + ivory[2] * ivoryBlend)
      output[i + 3] = Math.round(alpha * 255)
      matte[p] = output[i + 3]

      if (output[i + 3] < 8) transparentPixels++
      else if (output[i + 3] < 248) partialPixels++
    }
  }

  const finalImage = sharp(output, { raw: { width, height, channels: 4 } })
  await finalImage.webp({ lossless: true, effort: 6 }).toFile(outputPath)
  await sharp(matte, { raw: { width, height, channels: 1 } }).png().toFile(mattePath)

  const compositedOnIvory = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: ivory[0], g: ivory[1], b: ivory[2] },
    },
  })
    .composite([{ input: output, raw: { width, height, channels: 4 } }])
    .png()
    .toBuffer()

  const checker = await buildChecker(width, height)
  const compositedOnChecker = await sharp(checker)
    .composite([{ input: output, raw: { width, height, channels: 4 } }])
    .png()
    .toBuffer()

  await fs.writeFile(previewPath, compositedOnIvory)
  await fs.writeFile(checkerPath, compositedOnChecker)

  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        sourcePath,
        outputPath,
        previewPath,
        checkerPath,
        mattePath,
        width,
        height,
        estimatedSourceBackgroundRgb: bg,
        targetIvoryRgb: ivory,
        protectedBaseplatePolygon,
        exteriorFeather: {
          fullOpacityAtProtectedBoundary: true,
          transparentAfterDistancePx: 142,
        },
        topAirDissolve: {
          fullOpacityAtY: Math.round(height * 0.105),
        },
        bottomWaterDissolve: {
          startsAtY: Math.round(height * 0.69),
          minimumOpacityAtBottom: 0.06,
        },
        transparentPixels,
        partialPixels,
        protectedPixels,
        ivoryShiftedPixels,
      },
      null,
      2,
    )}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
