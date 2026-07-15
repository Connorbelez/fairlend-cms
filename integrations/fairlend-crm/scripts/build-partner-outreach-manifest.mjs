import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');
const MASTER_SOURCE = 'docs/research/fairlend-personalized-multichannel-outreach-2026-07-15.md';
const PODCAST_SOURCE = 'docs/research/outreach-podcasts-personalized-2026-07-15.md';
const EVENT_SOURCE = 'docs/research/outreach-events-personalized-2026-07-15.md';

const [master, podcasts, events, idMapJson] = await Promise.all([
  readFile(resolve(ROOT, MASTER_SOURCE), 'utf8'),
  readFile(resolve(ROOT, PODCAST_SOURCE), 'utf8'),
  readFile(resolve(ROOT, EVENT_SOURCE), 'utf8'),
  readFile(resolve(process.cwd(), 'scripts/data/partner-lead-id-map.json'), 'utf8'),
]);

const idMap = JSON.parse(idMapJson);
const normalize = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const aliases = new Map([
  ['AIC National Conference', 'Appraisal Institute of Canada National Conference'],
  ['OAA Conference', 'Ontario Association of Architects Conference'],
  ['Missing Middle Conference Toronto', 'Missing Middle Conference / Developers Den'],
]);

const parseSections = (markdown, headingPattern, category, sourcePaths, boundaryPattern = headingPattern) => {
  const matches = [...markdown.matchAll(headingPattern)];
  const boundaries = [...markdown.matchAll(boundaryPattern)].map((match) => match.index);
  return matches.map((match) => ({
    title: match[1].trim(),
    category,
    sourcePaths,
    dossier: markdown.slice(
      match.index,
      boundaries.find((boundary) => boundary > match.index) ?? markdown.length,
    ).trim(),
  }));
};

const podcastSections = parseSections(
  podcasts,
  /^##\s+\d+\.\s+(.+)$/gm,
  'PODCAST_MEDIA',
  [PODCAST_SOURCE, MASTER_SOURCE],
  /^##\s+.+$/gm,
);
const eventSections = parseSections(
  events,
  /^##\s+\d+\.\s+(.+)$/gm,
  'TRADE_SHOW_EVENT',
  [EVENT_SOURCE, MASTER_SOURCE],
  /^##\s+.+$/gm,
);
const builderLibrary = master.slice(
  master.indexOf('## Dossier library C'),
  master.indexOf('## Dossier library D'),
);
const builderSections = parseSections(
  builderLibrary,
  /^##\s+\d+\.\s+(.+)$/gm,
  'BUILDER_PROFESSIONAL',
  [MASTER_SOURCE],
);
const communityLibrary = master.slice(master.indexOf('## Dossier library D'));
const communityMatches = [...communityLibrary.matchAll(/^###\s+([IM])\d{2}\s+—\s+(.+)$/gm)];
const communitySections = communityMatches.map((match, index) => ({
  title: match[2].trim(),
  category: match[1] === 'I' ? 'INVESTOR_GROUP' : 'MEETUP_COMMUNITY',
  sourcePaths: [MASTER_SOURCE],
  dossier: communityLibrary.slice(match.index, communityMatches[index + 1]?.index ?? communityLibrary.length).trim(),
}));
const investorSections = communitySections.filter((section) => section.category === 'INVESTOR_GROUP');
const meetupSections = communitySections.filter((section) => section.category === 'MEETUP_COMMUNITY');

const sections = [
  ...podcastSections,
  ...eventSections,
  ...builderSections,
  ...investorSections,
  ...meetupSections,
];

const sectionForLead = (lead) => {
  const target = normalize(aliases.get(lead.name) ?? lead.name);
  const candidates = sections.filter((section) => section.category === lead.partnerCategory);
  const exact = candidates.find((section) => normalize(section.title) === target);
  if (exact) return exact;
  const contained = candidates.filter((section) => {
    const title = normalize(section.title);
    return title.includes(target) || target.includes(title);
  });
  if (contained.length === 1) return contained[0];
  throw new Error(`Expected one outreach dossier for ${lead.partnerCategory} ${lead.name}; found ${contained.length}.`);
};

const extractBlock = (dossier, startPattern, endPattern, limit = 12_000) => {
  const start = dossier.match(startPattern);
  if (!start || start.index === undefined) return '';
  const tail = dossier.slice(start.index);
  const afterStart = tail.slice(start[0].length);
  const end = afterStart.match(endPattern);
  const endIndex = end?.index === undefined ? tail.length : start[0].length + end.index;
  return tail.slice(0, endIndex).trim().slice(0, limit);
};

const extractLines = (dossier, pattern, limit) => dossier
  .split(/\n+/)
  .map((line) => line.trim())
  .filter((line) => pattern.test(line))
  .join('\n')
  .slice(0, limit);

const records = idMap.map((lead) => {
  const section = sectionForLead(lead);
  const dossier = section.dossier;
  return {
    ...lead,
    dossier,
    dossierSourcePaths: section.sourcePaths,
    outreachEmail: extractBlock(
      dossier,
      /^\*\*(?:Day 1 email|Email 1 subject|Email — subject|Email —|Email subject|Subject(?:\/application title)?)[^\n]*$/im,
      /^\*\*(?:LinkedIn|DM|Contact|Form|Phone|Voicemail|Follow-up)/im,
    ),
    outreachLinkedIn: extractBlock(
      dossier,
      /^\*\*LinkedIn[^\n]*$/im,
      /^\*\*(?:DM|Contact|Community|Form|Phone|Voicemail|Follow-up)/im,
      6_000,
    ),
    outreachPhoneAndForm: extractLines(
      dossier,
      /(contact[ -]?form|community\/contact form|\*\*(?:form|phone|voicemail)|phone opener|voicemail)/i,
      6_000,
    ),
    outreachFollowUps: extractBlock(
      dossier,
      /^\*\*(?:Follow-up|F1:)[^\n]*$/im,
      /^\*\*(?:Guest|CTA|Asset|Bespoke|Risk|Avoid|Close)/im,
      8_000,
    ) || extractLines(dossier, /(follow-up|\*\*F[12]:|value-add|close(?:-| )the(?:-| )loop|close-loop|day (?:3|4|6|7|8|9|10|14|15|16|17|21|24))/i, 8_000),
    outreachAsset: extractLines(
      dossier,
      /(asset|build\.|bespoke|calculator|scorecard|checklist|worksheet|one-page|pdf|mock activation|source pack)/i,
      6_000,
    ),
    outreachGuardrails: extractLines(
      dossier,
      /(risk|limits?\.|CTA\/asset\/limits|claims? to avoid|\*\*avoid|do not|never |no approval|no guarantee|consent|endorsement|exclusive|confidential)/i,
      8_000,
    ),
  };
});

const counts = records.reduce((result, record) => {
  result[record.partnerCategory] = (result[record.partnerCategory] ?? 0) + 1;
  return result;
}, {});

process.stdout.write(`${JSON.stringify({
  counts,
  records,
  coverage: {
    dossiers: records.filter((record) => record.dossier.length > 0).length,
    email: records.filter((record) => record.outreachEmail.length > 0).length,
    linkedIn: records.filter((record) => record.outreachLinkedIn.length > 0).length,
    phoneOrForm: records.filter((record) => record.outreachPhoneAndForm.length > 0).length,
    followUps: records.filter((record) => record.outreachFollowUps.length > 0).length,
    assets: records.filter((record) => record.outreachAsset.length > 0).length,
    guardrails: records.filter((record) => record.outreachGuardrails.length > 0).length,
  },
})}\n`);
