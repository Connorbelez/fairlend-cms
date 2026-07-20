import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seoRoot = path.join(root, 'docs/SEO')
const outputPath = path.join(seoRoot, 'FILE-INDEX.md')
const excluded = new Set(['.DS_Store', 'FILE-INDEX.md'])

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) return walk(absolute)
      return entry.isFile() ? [absolute] : []
    })
}

function labelFor(relativePath) {
  const extension = path.extname(relativePath).slice(1).toUpperCase() || 'FILE'
  if (relativePath.includes('/raw/')) return `${extension} · raw evidence`
  if (relativePath.includes('/args/')) return `${extension} · request payload`
  if (relativePath.includes('/workspace/')) return `${extension} · research workspace`
  if (relativePath.includes('/deliverables/')) return `${extension} · deliverable`
  if (extension === 'HTML') return 'HTML · visual report'
  if (extension === 'CSV') return 'CSV · structured dataset'
  if (extension === 'JSON') return 'JSON · structured evidence or manifest'
  if (extension === 'MD') return 'Markdown · report or documentation'
  return extension
}

const files = walk(seoRoot)
  .map(absolute => ({
    absolute,
    relative: path.relative(seoRoot, absolute).replaceAll(path.sep, '/'),
  }))
  .filter(file => !excluded.has(file.relative))
  .sort((left, right) => left.relative.localeCompare(right.relative))

const categoryCounts = new Map()
for (const file of files) {
  const category = file.relative.split('/')[0]
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
}

const categoryTable = [...categoryCounts]
  .map(([category, count]) => `| [${category}/](${category}/) | ${count} |`)
  .join('\n')

const fileTable = files
  .map(file => {
    const bytes = fs.statSync(file.absolute).size
    const encoded = file.relative.split('/').map(encodeURIComponent).join('/')
    return `| [${file.relative}](${encoded}) | ${labelFor(file.relative)} | ${bytes.toLocaleString('en-CA')} |`
  })
  .join('\n')

const markdown = `# Complete SEO file index

Generated from the canonical \`docs/SEO\` tree. Run \`node scripts/research/build-seo-docs-index.mjs\` after changing the corpus.

**Indexed files:** ${files.length}  
**Generated:** 2026-07-20

## Category counts

| Category | Files |
|---|---:|
${categoryTable}

## Complete inventory

| File | Classification | Bytes |
|---|---|---:|
${fileTable}
`

fs.writeFileSync(outputPath, markdown)
console.log(JSON.stringify({ outputPath, files: files.length, categories: Object.fromEntries(categoryCounts) }, null, 2))
