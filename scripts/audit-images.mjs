import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

const sourceExtensions = new Set(['.css', '.js', '.jsx', '.mdx', '.scss', '.ts', '.tsx'])
const rasterExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])
const largePngThreshold = 250_000

function walk(directory, extensions) {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(filePath, extensions)
    return extensions.has(path.extname(entry.name).toLowerCase()) ? [filePath] : []
  })
}

const sourceFiles = walk('src', sourceExtensions)
const sourceText = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
const rawImageElements = sourceFiles.flatMap((file) => {
  const contents = fs.readFileSync(file, 'utf8')
  return /\.(jsx|tsx)$/.test(file) && /<img\b/.test(contents) ? [file] : []
})

const thirdPartyTextures = sourceFiles.flatMap((file) => {
  const contents = fs.readFileSync(file, 'utf8')
  return contents.includes('transparenttextures.com') ? [file] : []
})

const rasters = []
for (const file of walk('public', rasterExtensions)) {
  const metadata = await sharp(file).metadata()
  const publicPath = `/${path.relative('public', file).split(path.sep).join('/')}`
  const bytes = fs.statSync(file).size

  rasters.push({
    bytes,
    file,
    format: metadata.format,
    height: metadata.height,
    referenced: sourceText.includes(publicPath),
    width: metadata.width,
  })
}

const referencedLargePngs = rasters.filter(
  (asset) => asset.format === 'png' && asset.referenced && asset.bytes >= largePngThreshold,
)
const unreferencedLargePngs = rasters
  .filter((asset) => asset.format === 'png' && !asset.referenced && asset.bytes >= largePngThreshold)
  .sort((a, b) => b.bytes - a.bytes)

console.log(
  JSON.stringify(
    {
      assets: {
        count: rasters.length,
        totalBytes: rasters.reduce((total, asset) => total + asset.bytes, 0),
      },
      violations: {
        rawImageElements,
        referencedLargePngs,
        thirdPartyTextures,
      },
      warnings: {
        unreferencedLargePngCount: unreferencedLargePngs.length,
        unreferencedLargePngBytes: unreferencedLargePngs.reduce(
          (total, asset) => total + asset.bytes,
          0,
        ),
        largestUnreferencedPngs: unreferencedLargePngs.slice(0, 15),
      },
    },
    null,
    2,
  ),
)

if (rawImageElements.length || referencedLargePngs.length || thirdPartyTextures.length) {
  process.exitCode = 1
}
