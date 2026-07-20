import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = process.cwd()
const observedAt = '2026-07-20'
const outputDir = path.join(root, 'docs/SEO/master-report/fairlend-seo-master-report-2026-07-20')
const sourceDirs = [
  'docs/SEO/research/keyword-and-funnel/landing-services-funnel-2026-07-19',
  'docs/SEO/research/keyword-and-funnel/keyword-cluster-validation-2026-07-20',
  'docs/SEO/research/keyword-and-funnel/mortgage-borrower-strategy-2026-07-20',
]

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        cell += character
      }
    } else if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(cell)
      cell = ''
    } else if (character === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (character !== '\r') {
      cell += character
    }
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const headers = rows.shift() || []
  return {
    headers,
    rows: rows
      .filter(values => values.some(value => value !== ''))
      .map(values => Object.fromEntries(headers.map((header, column) => [header, values[column] ?? '']))),
  }
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function makeCsv(rows, headers = rows[0] ? Object.keys(rows[0]) : []) {
  return [
    headers.map(csvCell).join(','),
    ...rows.map(row => headers.map(header => csvCell(row[header])).join(',')),
  ].join('\n') + '\n'
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function markdownCell(value) {
  const normalized = String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('\r\n', '<br>')
    .replaceAll('\n', '<br>')
  return normalized || '—'
}

function markdownTable(headers, rows) {
  if (!headers.length) return '_No tabular fields._'
  const header = `| ${headers.map(markdownCell).join(' | ')} |`
  const separator = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map(row => `| ${headers.map(key => markdownCell(row[key])).join(' | ')} |`).join('\n')
  return `${header}\n${separator}${body ? `\n${body}` : ''}`
}

function escapeFence(text) {
  return text.replaceAll('```', '``\\`')
}

function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .replaceAll('-', ' ')
    .replace(/\b\w/g, match => match.toUpperCase())
}

function readCsv(relativePath) {
  return parseCsv(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function splitList(value) {
  return String(value || '').split(/\s*[;|]\s*/).map(item => item.trim()).filter(Boolean)
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function slugTitle(name) {
  return name
    .replace(/\bOntario\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const outlineDetail = {
  'How it works': 'Give the mechanism in chronological order, show who does what, and distinguish conditional approval from funded completion.',
  'A-lender qualification': 'State the income, credit, debt-service, down-payment, property, and documentation dimensions without presenting universal approval thresholds.',
  'A vs B vs private': 'Use one side-by-side lender-tier matrix covering qualification, speed, rate, fees, term, flexibility, and the route back to lower-cost capital.',
  'B vs private': 'Compare total economics and exit feasibility rather than headline rate; show when a B route is unavailable or less responsible.',
  'Bank vs private': 'Explain the firm-sale, timing, property, and underwriting differences; show the decision criteria in a visible matrix.',
  'HELOC vs home equity loan': 'Contrast revolving versus lump-sum access, payment structure, combined LTV, re-borrowing, fees, and exit.',
  'Immediate steps': 'Lead with a calm first-24-hours checklist: identify the deadline, preserve notices, gather documents, contact legal counsel where appropriate, and avoid unverifiable promises.',
  'What power of sale is': 'Use Ontario terminology, date the legal review, cite primary law/regulator sources, and state clearly that the page is financing information—not legal advice.',
  'Rates and fees': 'Show the whole cost stack: lender rate, lender fee, brokerage fee, legal, appraisal, discharge/break costs, and any extension or renewal exposure.',
  'Costs': 'Use a worked Ontario example and a transparent assumptions panel; never convert unavailable keyword metrics into invented market claims.',
  'Documents': 'Give a scenario-specific checklist and explain why each item matters to underwriting, timing, valuation, or the exit plan.',
  'Process': 'Use a step-by-step timeline with evidence gates, responsible party, typical dependency, and what can delay the file.',
  'Risks': 'Name downside cases, extension risk, enforcement risk, rate/reset risk, valuation risk, and exit-plan failure without fear-based sales copy.',
  'Examples': 'Use anonymized scenarios with assumptions, dates, property/equity inputs, costs, decision, and exit. Never imply representative outcomes without evidence.',
  'Decision matrix': 'Turn the comparison into a decision tool with borrower-fit criteria, disqualifiers, total-cost factors, and escalation prompts.',
  'Side-by-side matrix': 'Present exact comparison dimensions and end each row with the borrower condition that changes the answer.',
  'Urgent timeline': 'Separate what can be assessed quickly from what still requires documents, appraisal, lender approval, legal work, and funding logistics.',
  'Exit': 'Treat the exit as an underwriting requirement: source, date, conditions, fallback, and cost if the planned exit slips.',
  'exit': 'Treat the exit as an underwriting requirement: source, date, conditions, fallback, and cost if the planned exit slips.',
  'draws': 'Show inspection, progress, holdback, contractor, contingency, and working-capital implications at each draw.',
  'Draws': 'Show inspection, progress, holdback, contractor, contingency, and working-capital implications at each draw.',
  'appraisal': 'Explain current/as-is value, as-improved value where relevant, appraisal independence, LTV implications, and valuation uncertainty.',
  'Appraisal': 'Explain current/as-is value, as-improved value where relevant, appraisal independence, LTV implications, and valuation uncertainty.',
}

function sectionRecommendation(section, cluster) {
  if (outlineDetail[section]) return outlineDetail[section]
  const lower = section.toLowerCase()
  const mapped = Object.entries(outlineDetail).find(([key]) => lower.includes(key.toLowerCase()))
  if (mapped) return mapped[1]
  if (/qualif|eligib|credit|income|equity|ltv|debt service/.test(lower)) {
    return 'Explain each underwriting input, identify which inputs are lender-specific, and pair the prose with a scenario checklist rather than an approval promise.'
  }
  if (/rate|fee|cost|payment|penalt|interest/.test(lower)) {
    return 'Disclose the all-in economics, date every assumption, provide a worked example, and state that actual pricing depends on the verified file.'
  }
  if (/alternative|option|compare|vs|tier/.test(lower)) {
    return 'Show the realistic routes in one comparison structure, including when each route does not fit and what evidence changes the decision.'
  }
  if (/timeline|timing|term|closing|maturity/.test(lower)) {
    return 'Map dates, dependencies, verification gates, delays, and the contingency plan; distinguish desired speed from a fundable timeline.'
  }
  if (/use case|designed for|borrower|who/.test(lower)) {
    return `Use specific ${cluster.segments.replaceAll('|', ', ')} borrower scenarios, not demographic generalizations; include both fit and non-fit examples.`
  }
  return 'Answer the section question directly, add Ontario-specific evidence, show one decision rule or example, and end with the next logical action—not a generic sales claim.'
}

const corpusFiles = sourceDirs.flatMap(directory => fs.readdirSync(path.join(root, directory))
  .filter(filename => fs.statSync(path.join(root, directory, filename)).isFile())
  .sort()
  .map(filename => path.join(directory, filename)))

const manifest = corpusFiles.map(relativePath => {
  const absolutePath = path.join(root, relativePath)
  const buffer = fs.readFileSync(absolutePath)
  const extension = path.extname(relativePath).slice(1).toLowerCase()
  let recordCount = ''
  if (extension === 'csv') recordCount = parseCsv(buffer.toString('utf8')).rows.length
  if (extension === 'json') {
    const data = JSON.parse(buffer.toString('utf8'))
    recordCount = Array.isArray(data) ? data.length : Array.isArray(data.rows) ? data.rows.length : Object.keys(data).length
  }
  return {
    sourcePath: relativePath,
    format: extension,
    bytes: buffer.byteLength,
    sha256: sha256(buffer),
    recordsOrTopLevelKeys: recordCount,
    bodyDisposition: extension === 'html' ? 'Presentation derivative inventoried; its underlying findings are embedded from the canonical Markdown/CSV/JSON sources.' : 'Embedded in full below.',
  }
})

const borrowerBase = 'docs/SEO/research/keyword-and-funnel/mortgage-borrower-strategy-2026-07-20'
const borrowerKeywords = readCsv(`${borrowerBase}/keyword-universe.csv`).rows
const borrowerClusters = readCsv(`${borrowerBase}/page-cluster-map.csv`).rows
const competitiveClusters = readCsv(`${borrowerBase}/competitive-cluster-landscape.csv`).rows
const strategies = readCsv(`${borrowerBase}/competitive-keyword-outranking-strategy.csv`).rows
const questions = readCsv(`${borrowerBase}/question-bank.csv`).rows
const domainLandscape = readCsv(`${borrowerBase}/competitor-domain-landscape.csv`).rows
const serpScan = JSON.parse(fs.readFileSync(path.join(root, borrowerBase, 'live-serp-scan-2026-07-20.json'), 'utf8'))

const clusterById = new Map(borrowerClusters.map(cluster => [cluster.id, cluster]))
const competitiveById = new Map(competitiveClusters.map(cluster => [cluster.clusterId, cluster]))
const strategiesByCluster = Map.groupBy(strategies, strategy => strategy.clusterId)
const keywordsByCluster = Map.groupBy(borrowerKeywords, keyword => keyword.clusterId)
const questionsByCluster = Map.groupBy(questions, question => question.clusterId)

function outlineFor(cluster, ordinal) {
  const competitive = competitiveById.get(cluster.id) || {}
  const clusterKeywords = keywordsByCluster.get(cluster.id) || []
  const clusterStrategies = strategiesByCluster.get(cluster.id) || []
  const clusterQuestions = questionsByCluster.get(cluster.id) || []
  const primaryStrategy = clusterStrategies.find(strategy => strategy.query.toLowerCase() === cluster.primary.toLowerCase()) || clusterStrategies[0] || {}
  const assetCounts = new Map()
  for (const strategy of clusterStrategies) {
    assetCounts.set(strategy.recommendedSectionOrAsset, (assetCounts.get(strategy.recommendedSectionOrAsset) || 0) + 1)
  }
  const assets = [...assetCounts].sort((a, b) => b[1] - a[1]).map(([asset, count]) => `${asset} (${count} keyword${count === 1 ? '' : 's'})`)
  const pageSections = splitList(cluster.sections)
  const recommendedTitle = `${slugTitle(cluster.name)} | FairLend`
  const recommendedH1 = cluster.name.replace(/\bguide$/i, 'guide for Ontario borrowers')
  const recommendedMeta = `${cluster.outcome} Compare realistic Ontario mortgage routes, total costs, requirements, risks, and next steps with FairLend.`.slice(0, 158)
  const keywordRows = clusterKeywords.map(keyword => ({
    keywordId: keyword.id,
    query: keyword.query,
    funnelLayer: `${keyword.primaryFunnelLayer} — ${keyword.layerName}`,
    intent: keyword.intent,
    priority: keyword.priority,
    recommendedSectionOrAsset: (clusterStrategies.find(strategy => strategy.keywordId === keyword.id) || {}).recommendedSectionOrAsset || '',
    winner1: (clusterStrategies.find(strategy => strategy.keywordId === keyword.id) || {}).winner1Url || '',
  }))
  const faqRows = clusterQuestions.map(question => ({
    questionId: question.id,
    question: question.question,
    layer: question.primaryFunnelLayer,
    answerFormat: question.answerFormat,
    schemaCandidate: question.schemaCandidate,
  }))

  return `## ${ordinal + 1}. ${cluster.name}

### Page control

| Field | Production specification |
|---|---|
| Canonical owner | \`${cluster.path}\` |
| Status | ${cluster.status} |
| Priority | ${cluster.priority} |
| Page type | ${cluster.type} |
| Borrower segments | ${cluster.segments.replaceAll('|', ', ')} |
| Funnel ownership | ${cluster.layers} |
| Primary keyword | ${cluster.primary} |
| Search problem | ${cluster.problem} |
| Borrower outcome | ${cluster.outcome} |
| Canonical boundary | ${cluster.boundary} |
| Evidence confidence | ${cluster.evidenceConfidence} |
| Market metrics | ${cluster.marketMetricStatus} |
| Ranking-validation scope | ${cluster.rankingValidationScope} |

### Current winning landscape

| Competitive signal | Finding |
|---|---|
| Live result references | ${competitive.liveResultReferences || '—'} |
| Recurring ranking domains | ${competitive.topRecurringDomains || '—'} |
| Top-one domains | ${competitive.top1Domains || '—'} |
| Dominant winner types | ${competitive.dominantWinnerTypes || '—'} |
| Winning formats | ${competitive.winningFormats || '—'} |
| What must be matched | ${competitive.whatToMatch || primaryStrategy.matchWhatWorks || '—'} |
| What can be improved | ${primaryStrategy.improveWhatWorks || 'Use the complete per-keyword prescriptions in the strategy ledger below.'} |
| FairLend opening | ${competitive.fairlendOpening || primaryStrategy.fairlendUniqueEdge || '—'} |
| Proof gate | ${competitive.proofGate || primaryStrategy.proofRequirements || '—'} |

### Search snippet and opening recommendation

- **Recommended title tag:** ${recommendedTitle}
- **Recommended H1:** ${recommendedH1}
- **Recommended meta description:** ${recommendedMeta}
- **Answer-first opening:** In 40–60 words, answer “${cluster.primary}” in Ontario terms. State the practical borrower fit, the central trade-off, and the next decision. Do not begin with FairLend history or a generic mortgage definition.
- **Core editorial thesis:** ${primaryStrategy.outrankPlan || competitive.fairlendOpening || cluster.outcome}
- **Primary CTA:** ${cluster.cta}

### Detailed content outline

${pageSections.map((section, index) => `#### H2.${index + 1} — ${section}\n\n${sectionRecommendation(section, cluster)}\n\n- **Evidence treatment:** Cite the relevant FSRA, FCAC, CMHC, Ontario, lender, or first-party source inline and display its review date.\n- **Decision support:** Add a concise rule, checklist, comparison row, timeline step, or worked scenario that helps the borrower act.\n- **Conversion handoff:** Keep the page educational until the section has answered the query; then point to \`${cluster.path}\` or the next canonical owner without duplicating another page’s intent.`).join('\n\n')}

#### Closing decision module

- Restate who the page is for and who should choose a different route.
- Show the focused document list needed for a meaningful review.
- Offer the page CTA—**${cluster.cta}**—as a free 30-minute scenario triage with no application, credit inquiry, or obligation.
- Disclose that financing depends on the verified borrower, property, documents, appraisal, lender criteria, costs, and exit plan; never promise approval, funding speed, or a recovery outcome.

### Original assets and interactive content

${assets.length ? assets.map(asset => `- ${asset}`).join('\n') : `- ${competitive.recommendedOriginalAsset || 'Answer-first decision aid + worked Ontario example'}`}
- Reuse FairLend’s existing calculator and decision-asset library where it fits: private mortgage cost, exit runway, blended second, refinance vs second, equity/LTV cushion, renew or exit, commitment comparator, document readiness, power-of-sale sensitivity, and debt-consolidation horizon.
- Expose every calculator assumption, date variable market inputs, and give the result a non-advisory interpretation plus a clear “what changes this result?” note.

### Proof, expertise, and compliance package

- Display FairLend brokerage licence **#13827** and administrator licence **#13828** where commercial intent is present.
- Attribute **28+ years** and **$1B+ funded** to the principal broker and link to the methodology reviewed **July 14, 2026**; do not turn either claim into an approval or outcome guarantee.
- Show the route-selection expertise across private, institutional, bridge, refinance, equity take-out, purchase, and construction only where it changes the borrower’s decision.
- Include whole-cost disclosure: rate, lender fee, brokerage fee, legal, appraisal, conditions, renewal/extension exposure, and exit costs.
- For project financing, cover scope, budget, permits, contractor evidence, draws, working capital, valuation, contingency, and takeout.
- For arrears or enforcement content, require Ontario legal review, distinguish mortgage guidance from legal advice, and avoid “stop power of sale” or similar guaranteed-outcome language.
- **Page-specific proof requirement:** ${competitive.proofGate || primaryStrategy.proofRequirements || 'Primary-source citations, one anonymized scenario, transparent assumptions, and named editorial review.'}

### Internal-link architecture

- **Required links:** ${splitList(cluster.links).map(link => `\`${link}\``).join(', ') || 'No links recorded.'}
- Link back to this canonical owner from every supporting question answer and relevant service/guide page using intent-specific anchor text.
- Do not recreate the full A/B/private matrix, HELOC/refinance comparison, bridge mechanics, or rescue/legal explanation on adjacent pages; excerpt the decision and link to its sole owner.
- Add contextual links to the next lower- and higher-intent funnel layer so an L1 reader can progress without forcing a lead form.

### Structured data and on-page implementation

- **Primary structured data:** ${primaryStrategy.structuredData || 'Article or Service, selected to match the visible page purpose.'}
- Use FAQPage only for questions visibly answered on the page and only when current Google policy permits; never generate hidden FAQ markup.
- Add BreadcrumbList, Organization/MortgageBroker identity where eligible, author/reviewer, datePublished/dateModified, and calculator WebApplication markup only for functioning visible tools.
- Keep one descriptive H1, descriptive H2/H3 hierarchy, indexable answer copy, self-referencing canonical, shareable calculator states where feasible, and accessible table labels.

### Full keyword-to-section coverage

${markdownTable(['keywordId', 'query', 'funnelLayer', 'intent', 'priority', 'recommendedSectionOrAsset', 'winner1'], keywordRows)}

### Full question and FAQ candidate set

${faqRows.length ? markdownTable(['questionId', 'question', 'layer', 'answerFormat', 'schemaCandidate'], faqRows) : '_No dedicated question-bank rows were assigned to this cluster; use the keyword strategy rows and visible SERP follow-ups as the question source._'}

### Publication acceptance checklist

- Every retained keyword above appears once in a relevant heading, answer, example, comparison, FAQ, or asset—without keyword stuffing.
- The 40–60 word primary answer is accurate, Ontario-aware, and independently useful before the CTA.
- Current winner strengths are matched, and the documented FairLend improvement is visibly present.
- All material financial, qualification, legal, timing, and performance claims have an attributable source and review date.
- Every number has an assumption and date; unavailable search-volume/CPC/difficulty values remain unavailable—not zero.
- The original asset is functional, accessible, mobile-safe, and instrumented.
- Internal links obey the canonical boundary and do not create a competing page for the same intent.
- GSC page/query performance, GA4 organic landing sessions, engaged sessions, qualified CTA events, and key events are measured after launch.
- Review cadence: ${primaryStrategy.updateCadence || 'Semiannual, and immediately after a material policy, regulatory, product, or rate change.'}
`
}

function sourceSection(relativePath, index) {
  const absolutePath = path.join(root, relativePath)
  const extension = path.extname(relativePath).slice(1).toLowerCase()
  const text = fs.readFileSync(absolutePath, 'utf8')
  const entry = manifest.find(item => item.sourcePath === relativePath)
  let rendered = ''
  if (extension === 'md') {
    rendered = text
  } else if (extension === 'csv') {
    const parsed = parseCsv(text)
    rendered = `${markdownTable(parsed.headers, parsed.rows)}\n\n<details>\n<summary>Exact raw CSV source — ${entry.bytes.toLocaleString()} bytes · SHA-256 ${entry.sha256}</summary>\n\n\`\`\`csv\n${escapeFence(text)}\`\`\`\n\n</details>`
  } else if (extension === 'json') {
    rendered = `\`\`\`json\n${escapeFence(text)}\`\`\``
  } else if (extension === 'html') {
    rendered = `This file is a presentation derivative of the canonical Markdown, CSV, and JSON findings embedded in this report. Its source code is not repeated as research prose; the immutable artifact is inventoried by byte size and SHA-256 in the source manifest.\n\n- **Bytes:** ${entry.bytes.toLocaleString()}\n- **SHA-256:** \`${entry.sha256}\`\n- **Source path:** \`${relativePath}\``
  } else {
    rendered = `\`\`\`text\n${escapeFence(text)}\`\`\``
  }
  return `## ${index + 1}. ${titleFromFilename(relativePath)}\n\n**Canonical artifact:** \`${relativePath}\`  \n**Format:** ${extension.toUpperCase()} · **Bytes:** ${entry.bytes.toLocaleString()} · **SHA-256:** \`${entry.sha256}\`\n\n${rendered}`
}

const serpRows = serpScan.rows.flatMap(row => row.winners.map(winner => ({
  keywordId: row.id,
  query: row.query,
  segmentId: row.segmentId,
  layer: row.layer,
  clusterId: row.clusterId,
  targetPath: row.targetPath,
  priority: row.priority,
  rank: winner.rank,
  title: winner.title,
  url: winner.url,
  domain: winner.domain || (() => { try { return new URL(winner.url).hostname.replace(/^www\./, '') } catch { return '' } })(),
  observedAt: row.observedAt || serpScan.observedAt || observedAt,
})))

const embeddedFiles = manifest.filter(item => item.format !== 'html')
const csvRows = manifest.filter(item => item.format === 'csv').reduce((sum, item) => sum + Number(item.recordsOrTopLevelKeys || 0), 0)
const totalBytes = manifest.reduce((sum, item) => sum + item.bytes, 0)
const outlines = borrowerClusters.map(outlineFor).join('\n\n---\n\n')
const sourceSections = corpusFiles.map(sourceSection).join('\n\n---\n\n')
const borrowerClusterControlRows = borrowerClusters.map(cluster => ({
  clusterId: cluster.id,
  pageOwner: cluster.name,
  canonicalPath: cluster.path,
  status: cluster.status,
  priority: cluster.priority,
  pageType: cluster.type,
  funnelLayers: cluster.layers,
  segments: cluster.segments,
  primaryKeyword: cluster.primary,
  canonicalBoundary: cluster.boundary,
}))

const master = `# FairLend SEO master report: keyword intelligence, five-layer funnel, competitive landscape, and content production system

**Research period:** 2026-07-19 to ${observedAt}  
**Market:** Ontario mortgage borrowers with Canada/Ontario/Toronto query localization  
**First-party account used:** c.beleznay@humanfeedback.com  
**Corpus contract:** One authoritative, row-complete edition of the service-funnel, clustering, GSC/GA4 validation, borrower-keyword, live-SERP, competitor, and per-keyword outranking artifacts generated in this workstream.

This is the report—not a summary. Every substantive Markdown finding, every CSV record, and every JSON payload from the three research packages is embedded below. The earlier HTML presentation artifact is inventoried by hash while its canonical findings are preserved through the underlying Markdown, CSV, and JSON sources. Blank market-volume, CPC, difficulty, traffic, and backlink fields mean **unavailable—not zero**.

## Report contract and corpus integrity

| Measure | Complete value |
|---|---:|
| Source artifacts inventoried | ${manifest.length} |
| Source artifacts embedded in full | ${embeddedFiles.length} |
| Presentation derivatives hash-inventoried | ${manifest.length - embeddedFiles.length} |
| Total source bytes inventoried | ${totalBytes.toLocaleString()} |
| Parsed CSV records embedded | ${csvRows.toLocaleString()} |
| Service-funnel keywords | ${readCsv('docs/SEO/research/keyword-and-funnel/landing-services-funnel-2026-07-19/keyword-universe.csv').rows.length} |
| Landing-service page clusters | ${readCsv('docs/SEO/research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/page-cluster-map.csv').rows.length} |
| Borrower keywords | ${borrowerKeywords.length} |
| Borrower canonical page owners | ${borrowerClusters.length} |
| Per-keyword outranking strategies | ${strategies.length} |
| Captured live SERP result references | ${serpRows.length} |
| Unique observed ranking domains | ${domainLandscape.length} |
| Borrower questions | ${questions.length} |
| Production-ready page outlines | ${borrowerClusters.length} |

### Source manifest

${markdownTable(['sourcePath', 'format', 'bytes', 'sha256', 'recordsOrTopLevelKeys', 'bodyDisposition'], manifest)}

### Evidence rules carried throughout the report

- GSC and GA4 metrics are first-party observations for FairLend, not market-demand estimates.
- Live search results identify currently ranking pages and observable content patterns; they do not provide traffic, backlink authority, or exact local rank guarantees.
- Answer Socrates contributes question and phrasing discovery, not authoritative market-volume metrics.
- Search volume, CPC, difficulty, competitor traffic, and backlink strength remain blank or explicitly unavailable where no credentialed provider was callable.
- Mortgage, rate, qualification, enforcement, and legal content must expose dates, assumptions, evidence, geography, and confidence.
- FairLend’s commercial differentiation must be tied to verifiable licensing, principal-broker experience, transparent underwriting logic, whole-cost disclosure, original decision tools, and a defensible exit—not generic “fast approval” language.

# Content and SEO production proposal

## Portfolio architecture and publishing sequence

The 18 borrower page owners below are the canonical production system. Existing service URLs are updated rather than displaced; proposed guides and service pages fill distinct intents; comparison pages own cross-product decisions; the power-of-sale guide stays on hold until Ontario legal review. Priority is inherited from the validated cluster maps and per-keyword strategy, not re-scored here.

\`\`\`mermaid
flowchart TD
  L1["L1 · Problem awareness<br/>definitions, risks, route discovery"] --> L2["L2 · Feasibility<br/>income, credit, equity, property, timing"]
  L2 --> L3["L3 · Comparison<br/>whole cost, lender tier, flexibility, exit"]
  L3 --> L4["L4 · Provider evaluation<br/>process, documents, proof, conditions"]
  L4 --> L5["L5 · Action and rescue<br/>focused triage, deadline, escalation"]
  L1 --> Guides["Canonical guides<br/>education and feasibility owners"]
  L2 --> Guides
  L3 --> Comparisons["Canonical comparisons<br/>cross-route decision owners"]
  L4 --> Services["Canonical services<br/>commercial and application owners"]
  L5 --> Triage["Canonical triage<br/>decline, urgency, legal-review gates"]
  Guides --> Services
  Comparisons --> Services
  Triage --> Services
\`\`\`

### Complete canonical cluster control plane

${markdownTable(['clusterId', 'pageOwner', 'canonicalPath', 'status', 'priority', 'pageType', 'funnelLayers', 'segments', 'primaryKeyword', 'canonicalBoundary'], borrowerClusterControlRows)}

### Publishing waves

1. **P0 existing-owner and decision pages:** strengthen the existing private and institutional owners, publish the mortgage-declined triage owner and A/B/private comparison, and preserve every canonical boundary.
2. **P1 route-expansion pages:** complete alternative, residential, renovation, bridge, HELOC/equity, private-cost/qualification, and cross-option comparison coverage with original tools and internal links.
3. **P2 depth page:** publish the private exit-strategy guide after the core private service and cost/qualification pages can link into it.
4. **Hold:** do not publish the power-of-sale owner until Ontario-law review, dated citations, disclaimers, escalation language, and non-guarantee gates are signed off.

### Page system shared by every owner

- Answer the exact query in the opening 40–60 words.
- Mirror the current winning format where it serves the borrower, then add a decision tool, transparent Ontario scenario, complete cost/qualification logic, and a route beyond one product.
- Keep service pages commercial and guides educational; comparison pages own full matrices; urgent/legal content owns triage and escalation.
- Put the focused CTA after material query satisfaction. The default offer is a free 30-minute borrower scenario triage with no application, credit inquiry, or obligation.
- Use original calculators and decision aids as linkable assets, not decorative widgets. Record assumptions, explain results, and prevent misleading precision.
- Instrument organic landing sessions, engaged sessions, qualified CTA events, completed triage requests, and GSC page/query performance; the current GA4 baseline has no key events and cannot yet validate lead quality.

## Measurement and iteration specification

| Layer | Primary user state | Search/content job | Core measurement | Optimization decision |
|---|---|---|---|---|
| L1 | Unaware / problem-aware | Define the problem and the relevant mortgage route in Ontario terms. | GSC impressions, non-brand queries, engaged organic entrances, scroll/search engagement. | Expand answer coverage and clarify the canonical route; do not force a commercial conversion. |
| L2 | Solution-aware / feasibility | Help the borrower determine whether income, credit, equity, property, or timing could fit. | Qualified calculator/checklist engagement, return visits, assisted CTA events. | Improve decision rules, assumptions, examples, and document readiness. |
| L3 | Comparison / decision | Compare A, B, private, HELOC, refinance, renovation, and bridge routes on whole cost and exit. | Comparison interactions, next-page progression, assisted triage requests. | Strengthen matrices, break-even logic, scenario coverage, and canonical linking. |
| L4 | Provider / application | Prove expertise, process, documents, pricing logic, and responsible fit. | Focused CTA starts/completions, engaged service sessions, GSC commercial-query movement. | Reduce ambiguity, disclose conditions, and align the handoff with the verified file. |
| L5 | Urgent action / rescue | Triage deadlines and preserve responsible options without guarantees. | Time-sensitive triage events, legal-referral/escalation interactions, qualified outcomes. | Improve deadline clarity, sober risk language, required evidence, and escalation paths. |

### Reporting cadence

- **Weekly for the first 30 days:** indexation, canonical status, coverage, internal links, structured data, event firing, and obvious query mismatch.
- **At 28 and 56 days:** GSC page/query discovery, intent coverage, CTR, position distribution, and cannibalization review; treat small samples as directional.
- **At 90 days:** compare organic entrances, engaged sessions, qualified CTA events, and assisted conversions against the pre-launch baseline; decide whether to refine, consolidate, expand, or hold.
- **Quarterly or on material change:** re-scan live winners for rate, fee, legal, enforcement, qualification, and policy-sensitive clusters. Re-validate all calculator inputs and reviewed claims.

# Complete page-by-page content recommendations and outlines

${outlines}

# Complete live SERP result ledger

This normalized table exposes all ${serpRows.length} captured result references from the live scan in one searchable view. The exact source JSON is also embedded later in the source-artifact corpus.

${markdownTable(['keywordId', 'query', 'segmentId', 'layer', 'clusterId', 'targetPath', 'priority', 'rank', 'title', 'url', 'domain', 'observedAt'], serpRows)}

# Complete source-artifact corpus

The following sections preserve every substantive source artifact generated by the service-funnel, cluster-validation, and borrower/competitive workstreams. Markdown is reproduced verbatim. CSVs appear first as complete accessible tables and then as exact raw source. JSON appears as exact raw source. The earlier HTML derivative is identified by its content hash while its canonical data and findings are included through the underlying sources.

${sourceSections}
`

fs.mkdirSync(outputDir, { recursive: true })
const masterPath = path.join(outputDir, 'fairlend-seo-master-report.md')
fs.writeFileSync(masterPath, master)

const qa = []
function check(gate, pass, detail) {
  qa.push({ gate, status: pass ? 'PASS' : 'FAIL', detail })
  if (!pass) process.exitCode = 1
}

check('source-artifact-inventory', manifest.length === corpusFiles.length && manifest.length >= 38, `${manifest.length} source artifacts inventoried across three workstream directories.`)
check('embedded-source-coverage', embeddedFiles.every(item => master.includes(item.sourcePath) && master.includes(item.sha256)), `${embeddedFiles.length} canonical Markdown/CSV/JSON/text artifacts are identified by path and SHA-256 in the master.`)
check('service-keyword-coverage', readCsv('docs/SEO/research/keyword-and-funnel/landing-services-funnel-2026-07-19/keyword-universe.csv').rows.length === 160, 'All 160 landing-service funnel keyword rows included.')
check('landing-cluster-coverage', readCsv('docs/SEO/research/keyword-and-funnel/keyword-cluster-validation-2026-07-20/page-cluster-map.csv').rows.length === 32, 'All 32 landing-service cluster rows included.')
check('borrower-keyword-coverage', borrowerKeywords.length === 160 && borrowerKeywords.every(keyword => master.includes(keyword.id) && master.includes(keyword.query)), 'All 160 borrower keyword IDs and queries included.')
check('per-keyword-strategy-coverage', strategies.length === 160 && strategies.every(strategy => master.includes(strategy.keywordId) && master.includes(strategy.outrankPlan)), 'All 160 keyword-level outrank plans included.')
check('canonical-outline-coverage', borrowerClusters.length === 18 && borrowerClusters.every(cluster => master.includes(`## ${borrowerClusters.indexOf(cluster) + 1}. ${cluster.name}`)), 'All 18 canonical page owners have complete production outlines.')
check('serp-reference-coverage', serpRows.length === 800 && serpRows.every(row => master.includes(row.url)), `All ${serpRows.length} captured ranking URLs included.`)
check('competitor-domain-coverage', domainLandscape.length === 221 && domainLandscape.every(domain => master.includes(domain.domain)), `All ${domainLandscape.length} observed competitor domains included.`)
check('question-coverage', questions.length === 120 && questions.every(question => master.includes(question.question)), 'All 120 borrower questions included.')
check('canonical-owner-integrity', borrowerKeywords.every(keyword => clusterById.get(keyword.clusterId)?.path === keyword.targetPath), 'Every borrower keyword retains the canonical owner defined by its cluster.')
check('market-metric-honesty', borrowerKeywords.every(keyword => keyword.marketMetricStatus === 'unavailable-not-zero'), 'Unavailable search volume/CPC/difficulty remains explicitly unavailable-not-zero.')
check('html-derivative-provenance', manifest.filter(item => item.format === 'html').every(item => master.includes(item.sha256) && master.includes('Presentation derivative')), 'HTML presentation derivatives are inventoried without duplicating source code as research prose.')

fs.writeFileSync(path.join(outputDir, 'master-report-source-manifest.csv'), makeCsv(manifest))
fs.writeFileSync(path.join(outputDir, 'master-report-coverage-qa.csv'), makeCsv(qa))
fs.writeFileSync(path.join(outputDir, 'master-report-build.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  observedAt,
  masterPath: path.relative(root, masterPath),
  masterBytes: Buffer.byteLength(master),
  masterSha256: sha256(Buffer.from(master)),
  sourceDirectories: sourceDirs,
  sourceArtifacts: manifest.length,
  embeddedArtifacts: embeddedFiles.length,
  sourceBytes: totalBytes,
  parsedCsvRows: csvRows,
  counts: {
    serviceFunnelKeywords: 160,
    landingServiceClusters: 32,
    borrowerKeywords: borrowerKeywords.length,
    borrowerClusters: borrowerClusters.length,
    perKeywordStrategies: strategies.length,
    liveSerpReferences: serpRows.length,
    competitorDomains: domainLandscape.length,
    borrowerQuestions: questions.length,
    contentOutlines: borrowerClusters.length,
  },
  qa,
}, null, 2) + '\n')

console.log(JSON.stringify({
  masterPath,
  bytes: Buffer.byteLength(master),
  sha256: sha256(Buffer.from(master)),
  sourceArtifacts: manifest.length,
  qaPassed: qa.filter(item => item.status === 'PASS').length,
  qaTotal: qa.length,
  failed: qa.filter(item => item.status === 'FAIL'),
}, null, 2))
