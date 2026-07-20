import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked, Renderer } from 'marked';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, '..');
const sourcePath = resolve(
  workspace,
  'docs/SEO/research/competitive/fairlend-customer-choice-and-competitive-positioning-2026-07-15.md',
);
const outputDirectory = resolve(
  workspace,
  'docs/SEO/visual-reports/competitive-positioning-2026-07-15',
);
const outputPath = resolve(outputDirectory, 'index.html');
const diagramDirectory = resolve(process.env.HOME, '.agent/diagrams');
const diagramPath = resolve(diagramDirectory, 'fairlend-competitive-positioning-report.html');

const [markdown, styles, clientScript, mermaidScript] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(resolve(scriptDirectory, 'fairlend-positioning-report.css'), 'utf8'),
  readFile(resolve(scriptDirectory, 'fairlend-positioning-report-client.js'), 'utf8'),
  readFile(resolve(scriptDirectory, 'fairlend-positioning-report-mermaid.js'), 'utf8'),
]);

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const slugify = (value) => value
  .toLowerCase()
  .replace(/&[a-z]+;/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'section';

const evidenceLabels = new Set([
  'Verified current fact',
  'First-party FairLend assertion',
  'Competitor-sourced fact',
  'Customer-review signal',
  'Strategic inference',
  'Requires validation',
  'Conflicting source',
]);

const slugCounts = new Map();
const uniqueSlug = (value) => {
  const base = slugify(value);
  const count = (slugCounts.get(base) || 0) + 1;
  slugCounts.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
};

const renderer = new Renderer();
const baseTable = renderer.table;

renderer.heading = function heading(token) {
  const id = uniqueSlug(token.text || 'section');
  const content = this.parser.parseInline(token.tokens);
  return `<h${token.depth} id="${id}">${content}</h${token.depth}>\n`;
};

renderer.codespan = function codespan(token) {
  const text = token.text || '';
  if (evidenceLabels.has(text)) {
    return `<code class="evidence-badge evidence--${slugify(text)}">${escapeHtml(text)}</code>`;
  }
  return `<code>${escapeHtml(text)}</code>`;
};

renderer.link = function link(token) {
  const text = this.parser.parseInline(token.tokens);
  const href = token.href || '';
  const title = token.title ? ` title="${escapeHtml(token.title)}"` : '';
  const external = /^https?:\/\//.test(href)
    ? ' target="_blank" rel="noreferrer noopener"'
    : '';
  return `<a href="${escapeHtml(href)}"${title}${external}>${text}</a>`;
};

renderer.table = function table(token) {
  const tableHtml = baseTable.call(this, token).replace('<table>', '<table class="data-table">');
  return `<div class="table-wrap"><div class="table-scroll">${tableHtml}</div></div>`;
};

marked.use({ gfm: true, breaks: false, renderer });

function parseTopLevelBlocks(source) {
  const lines = source.split('\n');
  const firstHeadingIndex = lines.findIndex((line) => line.startsWith('## '));
  const preamble = lines.slice(0, firstHeadingIndex).join('\n').trim();
  const blocks = [];
  let active = null;

  for (const line of lines.slice(firstHeadingIndex)) {
    if (line.startsWith('## ')) {
      if (active) blocks.push(active);
      active = { title: line.slice(3).trim(), lines: [] };
    } else if (active) {
      active.lines.push(line);
    }
  }
  if (active) blocks.push(active);

  return { preamble, blocks };
}

const { preamble, blocks } = parseTopLevelBlocks(markdown);
const blockByTitle = new Map(blocks.map((block) => [block.title, block]));
const segmentBlocks = blocks.filter((block) => /^Segment \d+\s+—/.test(block.title));

const sourceMeta = preamble
  .split('\n')
  .filter((line) => /^\*\*[^*]+:\*\*/.test(line.trim()))
  .map((line) => {
    const match = line.trim().match(/^\*\*([^*]+):\*\*\s*(.+?)\s{0,2}$/);
    return match ? { label: match[1], value: match[2] } : null;
  })
  .filter(Boolean);

const wordCount = markdown.trim().split(/\s+/).length;
const publicSourceCount = new Set(
  Array.from(markdown.matchAll(/\]\((https?:\/\/[^)]+)\)/g), (match) => match[1]),
).size;
const evidenceCount = Array.from(
  markdown.matchAll(/`(Verified current fact|First-party FairLend assertion|Competitor-sourced fact|Customer-review signal|Strategic inference|Requires validation|Conflicting source)`/g),
).length;
const tableRowCount = markdown.split('\n').filter((line) => line.startsWith('|')).length;
const conflictBlock = blockByTitle.get('Claim-conflict register');
const conflictCount = conflictBlock
  ? Math.max(0, conflictBlock.lines.filter((line) => line.startsWith('|')).length - 2)
  : 0;

const majorSections = [
  ['Executive findings', 'Executive findings'],
  ['Research methodology and evidence hierarchy', 'Evidence method'],
  ['Decision-criteria matrix across segments', 'Decision matrix'],
  ['Competitor and alternative matrix', 'Competitor matrix'],
  ['Differentiator scorecard', 'Differentiators'],
  ['FairLend weaknesses and likely loss conditions', 'Weaknesses and losses'],
  ['Organization-wide positioning', 'Organization position'],
  ['Integrated-model assessment', 'Integrated model'],
  ['Proof and substantiation roadmap', 'Proof roadmap'],
  ['Claim-conflict register', 'Claim conflicts'],
  ['Prioritized recommendations', 'Recommendations'],
  ['Ranked conclusions', 'Ranked conclusions'],
];

const sectionIds = new Map(majorSections.map(([title]) => [title, slugify(title)]));
sectionIds.set('Customer-segment analyses', 'customer-segments');
sectionIds.set('Sources', 'sources');

const renderMarkdown = (value) => marked.parse(value.trim());

function sectionHeading(title, index, kicker = 'Research module') {
  return `
    <header class="section-heading">
      <div>
        <div class="section-kicker">${escapeHtml(kicker)}</div>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="section-index" aria-hidden="true">${String(index).padStart(2, '0')}</div>
    </header>`;
}

function renderMajorSection(title, index) {
  const block = blockByTitle.get(title);
  if (!block) throw new Error(`Missing source section: ${title}`);
  const id = sectionIds.get(title);
  let content = renderMarkdown(block.lines.join('\n'));

  if (title === 'Research methodology and evidence hierarchy') {
    content = `
      <div class="method-banner">
        <div class="method-banner__statement">Internal material is evidence of what FairLend says—not independent proof that the claim is true.</div>
        <div class="method-banner__rule"><strong>Evidence rule</strong><br>Competitor claims establish the competitor's published offer. Customer-review signals remain anecdotal. Outcome superiority requires operating data.</div>
      </div>${content}`;
  }

  if (title === 'Integrated-model assessment') {
    content = `${renderIntegratedModelDiagram()}${content}`;
  }

  return `
    <section class="major-section" id="${id}" data-key="${id}" style="--i:${Math.min(index, 8)}">
      ${sectionHeading(title, index)}
      <div class="section-content">${content}</div>
    </section>`;
}

function segmentFamily(number) {
  if (number <= 5) return { key: 'borrower', label: 'Borrower and homeowner' };
  if (number <= 12) return { key: 'builder', label: 'Builder and project owner' };
  return { key: 'capital-partner', label: 'Capital and professional partner' };
}

function renderSegments(index) {
  const cards = segmentBlocks.map((block) => {
    const match = block.title.match(/^Segment (\d+)\s+—\s+(.+)$/);
    if (!match) throw new Error(`Invalid segment heading: ${block.title}`);
    const number = Number(match[1]);
    const title = match[2];
    const family = segmentFamily(number);
    return `
      <details class="segment-card" id="segment-${number}" data-family="${family.key}" open>
        <summary>
          <span class="segment-number">${String(number).padStart(2, '0')}</span>
          <span>
            <span class="family-label">${family.label}</span>
            <span class="segment-title">${escapeHtml(title)}</span>
          </span>
          <span class="segment-chevron" aria-hidden="true">+</span>
        </summary>
        <div class="segment-body">${renderMarkdown(block.lines.join('\n'))}</div>
      </details>`;
  }).join('\n');

  return `
    <section class="segments-section" id="customer-segments" data-key="customer-segments" style="--i:${Math.min(index, 8)}">
      ${sectionHeading('Customer-segment analyses', index, '18 complete decision dossiers')}
      <div class="report-controls" aria-label="Customer segment controls">
        <label class="segment-search" for="segment-search">
          <span class="tool-label" style="position:absolute;left:-9999px">Filter report segments</span>
          <input id="segment-search" type="search" placeholder="Filter by customer, objection, alternative, proof, or competitor…" autocomplete="off">
          <span class="segment-search__count" id="segment-visible-count">18/18</span>
        </label>
        <div class="control-actions">
          <button type="button" data-action="open-segments">Open all</button>
          <button type="button" data-action="close-segments">Close all</button>
          <button type="button" data-action="print-report">Print / PDF</button>
        </div>
      </div>
      <div class="family-filters" aria-label="Filter by customer family">
        <button class="family-filter" type="button" data-family-filter="all" aria-pressed="true">All 18 segments</button>
        <button class="family-filter" type="button" data-family-filter="borrower" aria-pressed="false">Borrowers and homeowners</button>
        <button class="family-filter" type="button" data-family-filter="builder" aria-pressed="false">Builders and project owners</button>
        <button class="family-filter" type="button" data-family-filter="capital-partner" aria-pressed="false">Capital and professional partners</button>
      </div>
      <div class="segment-list">${cards}</div>
    </section>`;
}

function renderIntegratedModelDiagram() {
  return `
    <div class="diagram-intro">
      <div class="diagram-intro__lead">The potential system advantage is continuity of decisions and evidence across stages—not the phrase “one-stop shop.”</div>
      <div class="diagram-intro__limit"><strong>Boundary:</strong> FairLend can own the financing record and coordination. It does not control permits, professional opinions, construction performance, third-party capital approval, CMHC decisions, market outcomes, or recovery proceeds.</div>
    </div>
    <section class="diagram-shell" aria-labelledby="integrated-model-diagram-title">
      <p class="diagram-shell__hint" id="integrated-model-diagram-title">Ctrl/Cmd + wheel to zoom. Scroll or drag to pan. Click or use expand to open the full diagram.</p>
      <div class="mermaid-wrap">
        <div class="zoom-controls">
          <button type="button" data-action="zoom-in" title="Zoom in">+</button>
          <button type="button" data-action="zoom-out" title="Zoom out">−</button>
          <button type="button" data-action="zoom-fit" title="Smart fit">↻</button>
          <button type="button" data-action="zoom-one" title="One-to-one zoom">1:1</button>
          <button type="button" data-action="zoom-expand" title="Open full size">⛶</button>
          <span class="zoom-label">Loading…</span>
        </div>
        <div class="mermaid-viewport"><div class="mermaid mermaid-canvas"></div></div>
      </div>
      <script type="text/plain" class="diagram-source">
        flowchart TD
          S["Project intent<br/>property, borrower, site"] --> P
          subgraph FL["FairLend accountable financing file"]
            direction TD
            P["Plan<br/>feasibility and project equation"] --> F["Finance<br/>capital-path comparison and structure"]
            F --> U["Underwrite<br/>conditions, valuation logic, exit"]
            U --> C["Close and administer<br/>security, payments, obligations"]
            C --> B["Build support<br/>milestones, draws, execution evidence"]
            B --> T["Takeout and servicing<br/>readiness, renewal, payout"]
            T --> R["Recovery and learning<br/>triage, enforcement coordination, feedback"]
            R -. "outcomes improve future rules" .-> P
          end
          X1["Independent professionals<br/>architect, planner, engineer, cost consultant"] -. "inputs and attestations" .-> P
          X2["Independent appraisal and legal"] -. "valuation, title, security" .-> U
          X3["Lenders, investors, CMHC"] -. "approval and capital" .-> F
          X3 -. "takeout decision" .-> T
          X4["Municipality, builder, trades, market"] -. "external execution conditions" .-> B
          classDef fair fill:#96ec1822,stroke:#96ec18,stroke-width:2px
          classDef external fill:#00294912,stroke:#002949,stroke-width:1px,stroke-dasharray:5 4
          class P,F,U,C,B,T,R fair
          class X1,X2,X3,X4 external
      </script>
    </section>`;
}

function renderSources(index) {
  const publicSources = blockByTitle.get('Primary public source index');
  const repositorySources = blockByTitle.get('FairLend repository source index');
  if (!publicSources || !repositorySources) throw new Error('Missing source index section.');
  return `
    <section class="sources-section" id="sources" data-key="sources" style="--i:8">
      ${sectionHeading('Source index', index, 'Exact evidence references')}
      <div class="section-content">
        <div class="source-column"><h3>Primary public sources</h3>${renderMarkdown(publicSources.lines.join('\n'))}</div>
        <div class="source-column"><h3>FairLend repository sources</h3>${renderMarkdown(repositorySources.lines.join('\n'))}</div>
      </div>
    </section>`;
}

function renderHero() {
  const metaHtml = sourceMeta.map((item) => `
    <p><strong>${escapeHtml(item.label)}:</strong> ${marked.parseInline(item.value)}</p>`).join('');

  return `
    <header class="report-hero" id="report-top" style="--i:0">
      <div class="hero-skyline" aria-hidden="true">
        <svg viewBox="0 0 1200 430" preserveAspectRatio="none" fill="none">
          <g stroke="currentColor" stroke-opacity=".22" stroke-width="1">
            <path d="M0 366H1200M0 332H1200M0 298H1200M0 264H1200M0 230H1200M0 196H1200M0 162H1200"/>
            <path d="M85 430V279H154V430M171 430V244H250V430M272 430V312H338V430M361 430V218H420V430M438 430V280H516V430M540 430V187H618V430M642 430V295H706V430M734 430V228H801V430M830 430V271H895V430M920 430V320H1002V430M1028 430V247H1116V430"/>
            <path d="M666 430V169M652 169H680M660 169L666 66L672 169M656 120H676M662 66L666 23L670 66"/>
            <path d="M0 378C142 350 204 394 351 362C487 333 588 387 720 354C868 316 995 378 1200 338"/>
          </g>
        </svg>
      </div>
      <div class="hero-content">
        <div class="hero-kicker">Internal research base · full visual edition</div>
        <h1>Customer choice &amp; competitive position</h1>
        <p class="hero-deck">The complete evidence-led report on where FairLend can win, where competitors are structurally stronger, and what must be operationalized before the integrated builder model becomes defensible.</p>
        <div class="hero-rule" aria-hidden="true"></div>
        <div class="hero-meta" aria-label="Report coverage">
          <div class="hero-stat"><div class="hero-stat__value">18</div><div class="hero-stat__label">Customer segments</div></div>
          <div class="hero-stat"><div class="hero-stat__value">${wordCount.toLocaleString('en-CA')}</div><div class="hero-stat__label">Source words rendered</div></div>
          <div class="hero-stat"><div class="hero-stat__value">${evidenceCount}</div><div class="hero-stat__label">Evidence labels</div></div>
          <div class="hero-stat"><div class="hero-stat__value">${publicSourceCount}</div><div class="hero-stat__label">External source URLs</div></div>
        </div>
        <div class="source-meta">${metaHtml}</div>
      </div>
    </header>`;
}

function renderToc() {
  const topLinks = [
    ['Executive findings', 'Overview'],
    ['Research methodology and evidence hierarchy', 'Evidence method'],
  ];
  const afterSegmentLinks = majorSections.slice(2);
  const segmentLinks = segmentBlocks.map((block) => {
    const match = block.title.match(/^Segment (\d+)\s+—\s+(.+)$/);
    return `<a href="#segment-${match[1]}">${String(match[1]).padStart(2, '0')} · ${escapeHtml(match[2])}</a>`;
  }).join('');

  return `
    <nav class="report-toc" id="report-toc" aria-label="Report contents">
      <div class="toc-brand">
        <span class="toc-brand__mark">FL</span>
        <span><span class="toc-brand__name">FairLend</span><span class="toc-brand__meta">Research field guide</span></span>
      </div>
      <div class="toc-title">Report contents</div>
      ${topLinks.map(([title, label]) => `<a href="#${sectionIds.get(title)}">${label}</a>`).join('')}
      <a href="#customer-segments">Customer segments</a>
      <div class="toc-subtitle">18 segment dossiers</div>
      <div class="toc-segments">${segmentLinks}</div>
      ${afterSegmentLinks.map(([title, label]) => `<a href="#${sectionIds.get(title)}">${label}</a>`).join('')}
      <a href="#sources">Sources</a>
      <div class="toc-tools">
        <button type="button" data-action="toggle-theme">Dark mode</button>
        <button type="button" data-action="print-report">Print</button>
      </div>
    </nav>`;
}

let sectionIndex = 1;
const renderedSections = [];
renderedSections.push(renderMajorSection('Executive findings', sectionIndex++));
renderedSections.push(renderMajorSection('Research methodology and evidence hierarchy', sectionIndex++));
renderedSections.push(renderSegments(sectionIndex++));
for (const [title] of majorSections.slice(2)) {
  renderedSections.push(renderMajorSection(title, sectionIndex++));
}
renderedSections.push(renderSources(sectionIndex++));

const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Full FairLend customer choice and competitive positioning research report across 18 customer segments.">
  <meta name="color-scheme" content="light dark">
  <title>FairLend customer choice and competitive positioning — full visual report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
  <div class="report-shell">
    ${renderToc()}
    <main class="report-main">
      ${renderHero()}
      ${renderedSections.join('\n')}
      <footer class="report-footer">
        <span class="report-status">Complete source coverage · ${wordCount.toLocaleString('en-CA')} words · ${tableRowCount} table rows · ${conflictCount} registered claim conflicts</span>
        <a class="back-to-top" href="#report-top">Back to top</a>
      </footer>
    </main>
  </div>
  <script>${clientScript}</script>
  <script type="module">${mermaidScript}</script>
</body>
</html>\n`;

await Promise.all([
  mkdir(outputDirectory, { recursive: true }),
  mkdir(diagramDirectory, { recursive: true }),
]);
await Promise.all([
  writeFile(outputPath, html, 'utf8'),
  writeFile(diagramPath, html, 'utf8'),
]);

console.log(JSON.stringify({
  sourcePath,
  outputPath,
  diagramPath,
  bytes: Buffer.byteLength(html),
  wordCount,
  segments: segmentBlocks.length,
  publicSourceCount,
  evidenceCount,
  tableRowCount,
  conflictCount,
}, null, 2));
