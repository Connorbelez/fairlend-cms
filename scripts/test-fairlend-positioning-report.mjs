import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const workspace = resolve(import.meta.dirname, '..');
const sourcePath = resolve(
  workspace,
  'docs/SEO/research/competitive/fairlend-customer-choice-and-competitive-positioning-2026-07-15.md',
);
const outputPath = resolve(
  workspace,
  'docs/SEO/visual-reports/competitive-positioning-2026-07-15/index.html',
);

const [source, html] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(outputPath, 'utf8'),
]);
const dom = new JSDOM(html);
const { document } = dom.window;

const segments = Array.from(document.querySelectorAll('details.segment-card'));
assert.equal(segments.length, 18, 'The visual report must contain all 18 segment dossiers.');
assert.ok(segments.every((segment) => segment.hasAttribute('open')), 'Every segment must load expanded.');

segments.forEach((segment, index) => {
  assert.equal(segment.id, `segment-${index + 1}`, `Segment ${index + 1} must retain its stable anchor.`);
  assert.equal(
    segment.querySelectorAll('.segment-body > h3').length,
    8,
    `Segment ${index + 1} must contain all eight required analysis layers.`,
  );
});

const expectedEvidenceLabels = Array.from(
  source.matchAll(/`(Verified current fact|First-party FairLend assertion|Competitor-sourced fact|Customer-review signal|Strategic inference|Requires validation|Conflicting source)`/g),
).length;
assert.equal(
  document.querySelectorAll('.evidence-badge').length,
  expectedEvidenceLabels,
  'Every source evidence label must be rendered as a visual badge.',
);

const expectedTables = source
  .split('\n')
  .filter((line) => /^\|\s*:?-{3,}/.test(line)).length;
assert.equal(
  document.querySelectorAll('table.data-table').length,
  expectedTables,
  'Every Markdown table must be rendered as a semantic HTML table.',
);

const requiredSections = [
  'executive-findings',
  'research-methodology-and-evidence-hierarchy',
  'customer-segments',
  'decision-criteria-matrix-across-segments',
  'competitor-and-alternative-matrix',
  'differentiator-scorecard',
  'fairlend-weaknesses-and-likely-loss-conditions',
  'organization-wide-positioning',
  'integrated-model-assessment',
  'proof-and-substantiation-roadmap',
  'claim-conflict-register',
  'prioritized-recommendations',
  'ranked-conclusions',
  'sources',
];
requiredSections.forEach((id) => {
  assert.ok(document.getElementById(id), `Missing required report section #${id}.`);
});

assert.equal(document.querySelectorAll('.diagram-shell').length, 1, 'The integrated model needs one primary flow diagram.');
assert.equal(document.querySelectorAll('.zoom-controls button').length, 5, 'The diagram must expose all zoom controls.');
assert.equal(document.querySelectorAll('#report-toc a[href^="#"]').length, 32, 'The full navigation must cover top-level sections and all segments.');

const renderedText = document.body.textContent.replace(/\s+/g, ' ');
for (const requiredText of [
  'Construction financing for complex small-to-mid-scale Southern Ontario residential projects is the most credible initial wedge.',
  'FairLend is most likely to win this customer when',
  'Top differentiators FairLend can credibly own now',
  'Claims and themes that should be deprioritized',
  'FairLend repository sources',
]) {
  assert.ok(renderedText.includes(requiredText), `Rendered report is missing source content: ${requiredText}`);
}

assert.ok(html.length > 250_000, 'The output is unexpectedly small for the complete report.');
assert.ok(!html.includes('BORROWER_CONSTRUCTION_SEGMENTS'), 'No source placeholder may leak into the visual report.');
assert.ok(!html.includes('TODO'), 'No implementation TODO may leak into the published artifact.');

console.log(JSON.stringify({
  verified: true,
  bytes: Buffer.byteLength(html),
  segments: segments.length,
  segmentSubsections: segments.reduce(
    (total, segment) => total + segment.querySelectorAll('.segment-body > h3').length,
    0,
  ),
  evidenceBadges: document.querySelectorAll('.evidence-badge').length,
  tables: document.querySelectorAll('table.data-table').length,
  navigationLinks: document.querySelectorAll('#report-toc a[href^="#"]').length,
}, null, 2));
