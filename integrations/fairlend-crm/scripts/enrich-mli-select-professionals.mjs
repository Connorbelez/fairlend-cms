import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');
const INPUT = 'docs/research/mli-select-early-file-professionals-80-seeds-2026-07-15.json';
const OUTPUT = 'docs/research/mli-select-early-file-professionals-80-enrichment-2026-07-15.json';
const VERIFIED_ON = '2026-07-15';
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 14_000;
const MAX_PAGES = 8;

const PAGE_TERMS = [
  ['contact', 12], ['about', 9], ['team', 9], ['people', 9], ['leadership', 8],
  ['service', 10], ['expertise', 8], ['project', 10], ['portfolio', 9], ['work', 7],
  ['residential', 12], ['housing', 12], ['rental', 14], ['multifamily', 14],
  ['multi-family', 14], ['apartment', 12], ['affordable', 12], ['sustainab', 8],
  ['energy', 10], ['accessib', 10], ['planning', 8], ['development', 8],
];

const EVIDENCE_TERMS = [
  'purpose-built rental', 'purpose built rental', 'multifamily', 'multi-family',
  'multi-residential', 'rental apartment', 'apartment', 'affordable housing',
  'supportive housing', 'residential development', 'mixed-use', 'mixed use',
  'energy modelling', 'energy modeling', 'building performance', 'zero carbon',
  'accessibility', 'universal design', 'cost planning', 'quantity survey',
  'project monitoring', 'development approvals', 'site plan', 'zoning',
  'feasibility', 'pro forma', 'appraisal', 'valuation', 'development land',
  'market study', 'market research', 'planning rationale', 'housing',
];

const decode = (value = '') => String(value)
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&#64;', '@')
  .replaceAll('&#x40;', '@')
  .replaceAll('&#46;', '.')
  .replaceAll('&#x2e;', '.')
  .replaceAll('&nbsp;', ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)));

const cleanText = (html) => decode(html)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
  .replace(/<!--[^]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const unique = (values) => [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
const host = (value) => new URL(value).hostname.replace(/^www\./, '').toLowerCase();
const sameHost = (candidate, website) => {
  try {
    const a = host(candidate);
    const b = host(website);
    return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
  } catch {
    return false;
  }
};

const normalizeEmail = (value) => decode(value).replace(/^mailto:/i, '').split('?')[0].trim().toLowerCase();
const normalizePhone = (value) => decode(value).replace(/^tel:/i, '').replace(/\s+/g, ' ').trim();
const usefulEmail = (value) => {
  const emailHost = value.split('@')[1] ?? '';
  return emailHost
    && !/^(?:user|name|email|yourname|john|jane)@(?:domain|example)\./i.test(value)
    && !['example.com', 'domain.com', 'sentry.io', 'wixpress.com'].some((blocked) => emailHost === blocked || emailHost.endsWith(`.${blocked}`));
};

const contactsFrom = (html) => {
  const decoded = decode(html);
  const emails = unique([
    ...[...decoded.matchAll(/href\s*=\s*["']mailto:([^"'#?]+)(?:\?[^"']*)?["']/gi)].map((match) => normalizeEmail(match[1])),
    ...(decoded.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []).map(normalizeEmail),
  ]).filter(usefulEmail).filter((value) => !/\.(?:png|jpg|jpeg|gif|svg|webp)$/i.test(value));
  const phones = unique([
    ...[...decoded.matchAll(/href\s*=\s*["']tel:([^"']+)["']/gi)].map((match) => normalizePhone(match[1])),
    ...(decoded.match(/(?:\+?1[\s.()-]*)?\(?[2-9]\d{2}\)?[\s.-]\d{3}[\s.-]\d{4}(?:\s*(?:x|ext\.?)\s*\d+)?/gi) ?? []).map(normalizePhone),
  ]);
  return { emails, phones };
};

const pageMeta = (html) => {
  const title = cleanText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = decode(
    html.match(/<meta\b[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
      ?? html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*>/i)?.[1]
      ?? '',
  ).replace(/\s+/g, ' ').trim();
  const headings = unique([...html.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((match) => cleanText(match[1])).filter((value) => value.length >= 3 && value.length <= 180));
  return { title, description, headings };
};

const linksFrom = (html, baseUrl, website) => {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    try {
      const resolved = new URL(decode(match[1]), baseUrl);
      resolved.hash = '';
      if (!['http:', 'https:'].includes(resolved.protocol) || !sameHost(resolved.href, website)) continue;
      if (/\.(?:pdf|jpe?g|png|gif|svg|webp|zip|docx?|xlsx?)$/i.test(resolved.pathname)) continue;
      const label = cleanText(match[2]);
      const haystack = `${resolved.pathname} ${label}`.toLowerCase();
      const score = PAGE_TERMS.reduce((sum, [term, weight]) => sum + (haystack.includes(term) ? weight : 0), 0);
      if (score > 0) links.push({ url: resolved.href, label, score });
    } catch {
      // Ignore invalid and non-HTTP links.
    }
  }
  return [...new Map(links.sort((a, b) => b.score - a.score).map((item) => [item.url, item])).values()];
};

const evidenceSentences = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map((value) => value.trim());
  return unique(sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return sentence.length >= 45 && sentence.length <= 520 && EVIDENCE_TERMS.some((term) => lower.includes(term));
  })).slice(0, 20);
};

const fetchHtml = async (pageUrl) => {
  const response = await fetch(pageUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'accept-language': 'en-CA,en;q=0.9',
      'user-agent': 'FairLend MLI Select partnership research/1.0 (+https://fairlend.ca)',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new Error(`Unsupported content type ${contentType || 'unknown'}`);
  }
  return { finalUrl: response.url, html: await response.text() };
};

const crawl = async (lead) => {
  const pages = [];
  const failures = [];
  let discovered = [];
  try {
    const homepage = await fetchHtml(lead.website);
    const meta = pageMeta(homepage.html);
    const contacts = contactsFrom(homepage.html);
    pages.push({
      requestedUrl: lead.website,
      finalUrl: homepage.finalUrl,
      ...meta,
      ...contacts,
      evidence: evidenceSentences(cleanText(homepage.html)),
    });
    discovered = linksFrom(homepage.html, homepage.finalUrl, lead.website);
  } catch (error) {
    failures.push({ url: lead.website, error: error instanceof Error ? error.message : String(error) });
  }

  const selected = [];
  const selectedKinds = new Set();
  for (const link of discovered) {
    const lower = `${link.url} ${link.label}`.toLowerCase();
    const kind = lower.includes('contact') ? 'contact'
      : /team|people|leadership/.test(lower) ? 'people'
        : /project|portfolio|work/.test(lower) ? 'project'
          : /service|expertise/.test(lower) ? 'service'
            : /residential|housing|rental|multifamily|apartment/.test(lower) ? 'housing'
              : 'other';
    if (selectedKinds.has(kind) && selected.length >= 4) continue;
    selected.push(link);
    selectedKinds.add(kind);
    if (selected.length >= MAX_PAGES - 1) break;
  }

  for (const link of selected) {
    try {
      const page = await fetchHtml(link.url);
      const meta = pageMeta(page.html);
      pages.push({
        requestedUrl: link.url,
        finalUrl: page.finalUrl,
        linkLabel: link.label,
        ...meta,
        ...contactsFrom(page.html),
        evidence: evidenceSentences(cleanText(page.html)),
      });
    } catch (error) {
      failures.push({ url: link.url, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const contactPage = pages.find((page) => /contact|get in touch|connect/i.test(`${page.finalUrl} ${page.title} ${page.headings.join(' ')}`));
  const serviceEvidence = unique(pages.flatMap((page) => page.evidence)).slice(0, 10);
  const projectEvidence = unique(pages
    .filter((page) => /project|portfolio|work|residential|housing|rental|multifamily|apartment/i.test(`${page.finalUrl} ${page.title} ${page.headings.join(' ')}`))
    .flatMap((page) => page.evidence)).slice(0, 10);
  const peopleEvidence = unique(pages
    .filter((page) => /team|people|leadership|about/i.test(`${page.finalUrl} ${page.title} ${page.headings.join(' ')}`))
    .flatMap((page) => page.headings)).slice(0, 20);

  return {
    ...lead,
    verified_on: VERIFIED_ON,
    contact_url: contactPage?.finalUrl ?? pages[0]?.finalUrl ?? lead.website,
    emails: unique(pages.flatMap((page) => page.emails)),
    phones: unique(pages.flatMap((page) => page.phones)),
    service_evidence: serviceEvidence,
    project_evidence: projectEvidence,
    people_evidence: peopleEvidence,
    official_source_urls: unique(pages.map((page) => page.finalUrl)),
    pages,
    failures,
  };
};

const input = JSON.parse(await readFile(resolve(ROOT, INPUT), 'utf8'));
if (!Array.isArray(input) || input.length !== 80) throw new Error(`${INPUT} must contain exactly 80 prospects.`);

const results = new Array(input.length);
let cursor = 0;
const worker = async () => {
  while (cursor < input.length) {
    const index = cursor;
    cursor += 1;
    results[index] = await crawl(input[index]);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const output = {
  version: 1,
  source: INPUT,
  generatedAt: new Date().toISOString(),
  verifiedOn: VERIFIED_ON,
  count: results.length,
  records: results,
};
const outputPath = resolve(ROOT, OUTPUT);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(`Crawled ${results.reduce((sum, record) => sum + record.pages.length, 0)} official pages for ${results.length} MLI Select early-file prospects.`);
console.log(`Captured ${results.reduce((sum, record) => sum + record.emails.length, 0)} email routes and ${results.reduce((sum, record) => sum + record.phones.length, 0)} phone routes.`);
console.log(`Prospects with project/service evidence: ${results.filter((record) => record.project_evidence.length || record.service_evidence.length).length}/${results.length}.`);
console.log(`Generated ${OUTPUT}`);
