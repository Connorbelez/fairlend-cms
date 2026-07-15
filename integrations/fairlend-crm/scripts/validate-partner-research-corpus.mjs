import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const corpusPath = resolve(process.cwd(), '../../docs/research/fairlend-partnership-leads-2026-07-15.md');
const markdown = await readFile(corpusPath, 'utf8');

const sections = [
  ['Builders & early-file professionals', '## Builders and early-file professionals — 20 ranked leads'],
  ['Podcasts & media', '## Podcasts — 20 ranked leads'],
  ['Investor groups & associations', '## Investor groups and communities — 20 ranked leads'],
  ['Meetups & recurring communities', '## Meetups and recurring communities — 20 ranked leads'],
  ['Trade shows & events', '## Trade shows and events — 20 ranked leads'],
];

const names = [];
for (const [label, heading] of sections) {
  const start = markdown.indexOf(heading);
  if (start < 0) throw new Error(`Missing research section: ${heading}`);
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  const section = markdown.slice(start, nextHeading < 0 ? undefined : nextHeading);
  const rows = [...section.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/gm)];
  const ranks = rows.map((match) => Number(match[1]));
  if (rows.length !== 20 || ranks.join(',') !== Array.from({ length: 20 }, (_, index) => index + 1).join(',')) {
    throw new Error(`${label} must contain exactly ranks 1–20; found ${rows.length} rows (${ranks.join(', ')}).`);
  }
  names.push(...rows.map((match) => match[2].trim()));
  console.log(`${label}: 20`);
}

if (new Set(names).size !== 100) {
  throw new Error(`The research corpus contains duplicate lead names: ${100 - new Set(names).size} duplicate(s).`);
}

console.log('Total unique researched partnership leads: 100');
