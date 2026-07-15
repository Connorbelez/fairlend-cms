import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');
const INPUT = 'docs/research/gta-builders-80-2026-07-15.json';
const OUTPUT = 'docs/research/gta-builders-80-public-contact-enrichment-2026-07-15.json';
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 12_000;

const decode = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&#64;', '@')
  .replaceAll('&#x40;', '@')
  .replaceAll('&#46;', '.')
  .replaceAll('&#x2e;', '.')
  .replaceAll('&nbsp;', ' ');

const normalizeEmail = (value) => decode(value)
  .replace(/^mailto:/i, '')
  .split('?')[0]
  .trim()
  .toLowerCase();

const normalizePhone = (value) => decode(value)
  .replace(/^tel:/i, '')
  .replace(/\s+/g, ' ')
  .trim();

const isUsefulEmail = (value) => {
  const domain = value.split('@')[1] ?? '';
  return ![
    'example.com', 'example.org', 'domain.com', 'mailservice.com', 'mysite.com',
    'sentry.io', 'sentry.wixpress.com', 'sentry-next.wixpress.com',
  ].some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`));
};

const uniqueBy = (values, key) => {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = key(value);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

const companyHost = (value) => new URL(value).hostname.replace(/^www\./, '').toLowerCase();
const sameCompanyHost = (candidate, website) => {
  try {
    const candidateHost = companyHost(candidate);
    const websiteHost = companyHost(website);
    return candidateHost === websiteHost
      || candidateHost.endsWith(`.${websiteHost}`)
      || websiteHost.endsWith(`.${candidateHost}`);
  } catch {
    return false;
  }
};

const extractContacts = (html) => {
  const decoded = decode(html);
  const mailto = [...decoded.matchAll(/href\s*=\s*["']mailto:([^"'#?]+)(?:\?[^"']*)?["']/gi)]
    .map((match) => normalizeEmail(match[1]));
  const visibleEmails = decoded.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  const emails = uniqueBy([...mailto, ...visibleEmails].map(normalizeEmail), (value) => value)
    .filter((value) => !/^(?:example|name|email|yourname|info)@example\./.test(value))
    .filter((value) => !/\.(?:png|jpg|jpeg|gif|svg|webp)$/i.test(value))
    .filter(isUsefulEmail);

  const tel = [...decoded.matchAll(/href\s*=\s*["']tel:([^"']+)["']/gi)]
    .map((match) => normalizePhone(match[1]));
  const visiblePhones = decoded.match(/(?:\+?1[\s.()-]*)?\(?[2-9]\d{2}\)?[\s.-]\d{3}[\s.-]\d{4}(?:\s*(?:x|ext\.?)\s*\d+)?/gi) ?? [];
  const phones = uniqueBy([...tel, ...visiblePhones].map(normalizePhone), (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : '';
  });
  return { emails, phones };
};

const fetchPage = async (pageUrl) => {
  const response = await fetch(pageUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'FairLend partnership research contact verification/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new Error(`Unsupported content type ${contentType || 'unknown'}`);
  }
  return { finalUrl: response.url, html: await response.text() };
};

const sourceUrlsFor = (lead) => [...new Set([
  lead.website,
  lead.contact_url,
  ...(lead.company_source_urls ?? []),
].filter((value) => value && sameCompanyHost(value, lead.website)))].slice(0, 8);

const enrich = async (lead) => {
  const pages = [];
  const failures = [];
  for (const pageUrl of sourceUrlsFor(lead)) {
    try {
      const { finalUrl, html } = await fetchPage(pageUrl);
      pages.push({ requestedUrl: pageUrl, finalUrl, ...extractContacts(html) });
    } catch (error) {
      failures.push({ url: pageUrl, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return {
    name: lead.name,
    website: lead.website,
    scannedOn: new Date().toISOString(),
    emails: uniqueBy([
      ...(lead.contact_email ? [lead.contact_email] : []),
      ...pages.flatMap((page) => page.emails),
    ].map(normalizeEmail), (value) => value).filter(isUsefulEmail),
    phones: uniqueBy([
      ...(lead.contact_phone ? String(lead.contact_phone).split(/[;\n]/) : []),
      ...pages.flatMap((page) => page.phones),
    ].map(normalizePhone), (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 ? digits.slice(-10) : '';
    }),
    pages,
    failures,
  };
};

const input = JSON.parse(await readFile(resolve(ROOT, INPUT), 'utf8'));
if (!Array.isArray(input) || input.length !== 80) throw new Error(`${INPUT} must contain exactly 80 leads.`);

const results = new Array(input.length);
let cursor = 0;
const worker = async () => {
  while (cursor < input.length) {
    const index = cursor;
    cursor += 1;
    results[index] = await enrich(input[index]);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const output = {
  version: 1,
  source: INPUT,
  generatedAt: new Date().toISOString(),
  count: results.length,
  records: results,
};
const outputPath = resolve(ROOT, OUTPUT);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(`Scanned ${results.reduce((sum, record) => sum + record.pages.length, 0)} official pages for ${results.length} builders.`);
console.log(`Captured ${results.reduce((sum, record) => sum + record.emails.length, 0)} email routes and ${results.reduce((sum, record) => sum + record.phones.length, 0)} phone routes.`);
console.log(`Generated ${OUTPUT}`);
