import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { v5 as uuidv5 } from 'uuid';

const APP_ID = 'b1f3164c-7f41-4887-87ac-77e494817fbc';
const VERIFIED_ON = '2026-07-15';
const artifactPath = resolve(process.cwd(), '../../docs/research/partner-lead-company-people-verification-2026-07-15.md');
const idMapPath = resolve(process.cwd(), 'scripts/data/partner-lead-id-map.json');

const [markdown, idMapJson] = await Promise.all([
  readFile(artifactPath, 'utf8'),
  readFile(idMapPath, 'utf8'),
]);

const idMap = JSON.parse(idMapJson);
const leadByName = new Map(idMap.map((lead) => [lead.name, lead]));

const normalize = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const stableId = (seed) => uuidv5(seed, APP_ID);
const markdownUrls = (value) => [...value.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
const bareUrls = (value) => [...value.matchAll(/https?:\/\/[^\s<>)]+/g)].map((match) => match[0].replace(/[.,;]+$/, ''));
const urls = (value) => [...new Set([...markdownUrls(value), ...bareUrls(value)])];
const plainText = (value) => value
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const personNameParts = (fullName) => {
  const clean = fullName
    .replace(/,\s*(?:P\.?Eng\.?|PMP|B\.?Arch\.?|MBA|CPA|CA|CEO|PhD|MSc|BSc).*$/i, '')
    .trim();
  const pieces = clean.split(/\s+/);
  return {
    fullName: clean,
    firstName: pieces.slice(0, -1).join(' '),
    lastName: pieces.at(-1) ?? '',
  };
};

const primaryNameAliases = (person) => {
  const aliases = new Set([person.fullName, `${person.firstName} ${person.lastName}`]);
  const givenName = person.firstName.split(/\s+/)[0];
  if (givenName.length > 1) aliases.add(`${givenName} ${person.lastName}`);

  for (const match of person.firstName.matchAll(/[\u201c\u201d"'()]([^\u201c\u201d"'()]+)[\u201c\u201d"'()]/g)) {
    aliases.add(`${match[1]} ${person.lastName}`);
  }

  return [...aliases].map(normalize).filter((alias) => alias.length > 3);
};

const contactFunction = (value) => {
  if (/editor|host|producer|content|programming|speaker|podcast|media/i.test(value)) return 'PROGRAMMING_EDITORIAL';
  if (/sponsor|event|conference|exhibit|activation/i.test(value)) return 'SPONSORSHIP_EVENTS';
  if (/member|community|association|chapter|organizer|club/i.test(value)) return 'MEMBERSHIP_COMMUNITY';
  if (/finance|account|capital|treasur|lending/i.test(value)) return 'FINANCE';
  if (/partner|business development|growth|commercial|sales|relationship/i.test(value)) return 'PARTNERSHIPS_BD';
  if (/founder|owner|president|chief|ceo|executive|principal|director/i.test(value)) return 'EXECUTIVE';
  return 'OTHER';
};

const parsePeople = (cell, primaryCell, notesCell, leadRoute) => {
  const people = [];
  const cellSourceUrls = urls(cell);
  let inheritedSourceUrls = [];
  const regex = /\*\*([^*]+)\*\*\s+—\s+([\s\S]*?);\s+\*\*(High|Medium)\*\*/g;
  for (const match of cell.matchAll(regex)) {
    const name = personNameParts(match[1]);
    if (!name.firstName || !name.lastName || /^(company|exception|primary)$/i.test(name.firstName)) continue;
    const body = plainText(match[2]);
    const directSourceUrls = urls(match[2]);
    const sourceUrls = directSourceUrls.length > 0
      ? directSourceUrls
      : inheritedSourceUrls.length > 0 ? inheritedSourceUrls : cellSourceUrls;
    if (directSourceUrls.length > 0) inheritedSourceUrls = directSourceUrls;
    const directEmail = match[2].match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0] ?? '';
    const profileUrl = sourceUrls.find((url) => /linkedin\.com/i.test(url)) ?? sourceUrls[0] ?? '';
    const confidence = match[3].toUpperCase();
    const needsReverify = /pending|reconfirm|reactivat|stale|outdated|historical|current role is not established/i.test(
      `${match[2]} ${primaryCell} ${notesCell}`,
    );
    const identityKey = stableId(`person:${normalize(name.fullName)}`);
    people.push({
      ...name,
      identityKey,
      titleAtVerification: body.split(';')[0],
      contactFunction: contactFunction(body),
      roleRelevance: body,
      publicEmail: directEmail,
      publicPhone: '',
      profileUrl,
      primaryContactRoute: plainText(leadRoute || notesCell).slice(0, 2_000),
      sourceUrls,
      verifiedOn: VERIFIED_ON,
      confidence,
      verificationStatus: needsReverify ? 'NEEDS_REVERIFY' : 'VERIFIED',
      researchNotes: plainText(`${match[2]} ${notesCell}`).slice(0, 5_000),
      isPrimary: false,
    });
  }

  const primaryText = plainText(primaryCell).replace(/^Primary:\s*/i, '');
  const normalizedPrimaryText = normalize(primaryText);
  const primaryIndex = people.findIndex((person) => (
    primaryNameAliases(person).some((alias) => normalizedPrimaryText.includes(alias))
  ));
  if (primaryIndex >= 0) people[primaryIndex].isPrimary = true;
  return people;
};

const rows = markdown.split('\n').filter((line) => /^\|\s*[BPIMT]\d{2}\s*\|/.test(line));
const leads = rows.map((line) => {
  const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
  if (cells.length !== 6) throw new Error(`Expected six import columns, received ${cells.length}: ${line.slice(0, 160)}`);
  const [researchId, leadName, companyCell, peopleCell, primaryCell, notesCell] = cells;
  const mappedLead = leadByName.get(leadName);
  if (!mappedLead) throw new Error(`No stable FairLend lead ID mapping exists for ${researchId} ${leadName}.`);

  const companyException = /^\*\*Company exception:/i.test(companyCell)
    || /no normalized Company/i.test(primaryCell);
  const companyName = companyException ? '' : companyCell.match(/^\*\*([^*]+)\*\*/)?.[1]?.trim() ?? '';
  if (!companyException && !companyName) throw new Error(`Missing normalized company for ${researchId} ${leadName}.`);
  const publishedDomain = companyCell.match(/`([^`]+)`/)?.[1] ?? '';
  const companyNeedsReverify = /not established|pending|placeholder|verify|current status/i.test(`${companyCell} ${notesCell}`);
  const people = parsePeople(peopleCell, primaryCell, notesCell, mappedLead.contactRoute ?? '');
  const primary = people.find((person) => person.isPrimary);
  const companyMatchKey = companyException ? '' : stableId(`company:${normalize(companyName)}`);

  return {
    researchId,
    leadName,
    fairlendLeadId: mappedLead.fairlendLeadId,
    partnerCategory: mappedLead.partnerCategory,
    company: companyException ? null : {
      name: companyName,
      matchKey: companyMatchKey,
      publishedDomain,
      sourceUrls: urls(companyCell),
      verifiedOn: VERIFIED_ON,
      confidence: companyNeedsReverify ? 'MEDIUM' : 'HIGH',
      primaryContactRoute: plainText(notesCell).slice(0, 2_000),
      researchNotes: plainText(`${companyCell} ${notesCell}`).slice(0, 5_000),
    },
    companyException: companyException ? plainText(`${companyCell} ${primaryCell} ${notesCell}`).slice(0, 5_000) : '',
    companyVerificationStatus: companyException
      ? 'NO_LEGAL_ENTITY_FOUND'
      : companyNeedsReverify ? 'NEEDS_REVERIFY' : 'VERIFIED',
    primaryDecisionMakerStatus: primary
      ? primary.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'NEEDS_REVERIFY'
      : 'PUBLIC_DETAILS_UNAVAILABLE',
    people,
    peopleResearchSummary: plainText(`${peopleCell} ${primaryCell} ${notesCell}`).slice(0, 10_000),
  };
});

const duplicate = (values) => values.find((value, index) => values.indexOf(value) !== index);
const duplicateResearchId = duplicate(leads.map((lead) => lead.researchId));
const duplicateLeadId = duplicate(leads.map((lead) => lead.fairlendLeadId));
if (duplicateResearchId) throw new Error(`Duplicate research ID: ${duplicateResearchId}`);
if (duplicateLeadId) throw new Error(`Duplicate fairlendLeadId: ${duplicateLeadId}`);
if (leads.length !== idMap.length) {
  const missing = idMap.filter((lead) => !leads.some((resolution) => resolution.fairlendLeadId === lead.fairlendLeadId));
  throw new Error(`Entity artifact has ${leads.length}/${idMap.length} leads. Missing: ${missing.map((lead) => lead.name).join(', ')}`);
}

const companies = [...new Map(leads.filter((lead) => lead.company).map((lead) => [lead.company.matchKey, lead.company])).values()];
const people = [...new Map(leads.flatMap((lead) => lead.people).map((person) => [person.identityKey, person])).values()];
const decisionMakerLinks = leads.flatMap((lead) => lead.people.map((person) => ({
  fairlendContactKey: stableId(`partner-contact:${lead.fairlendLeadId}:${person.identityKey}`),
  name: `${lead.leadName} — ${person.fullName}`,
  fairlendLeadId: lead.fairlendLeadId,
  companyMatchKey: lead.company?.matchKey ?? '',
  personIdentityKey: person.identityKey,
  ...person,
})));

process.stdout.write(`${JSON.stringify({
  version: 1,
  verifiedOn: VERIFIED_ON,
  counts: {
    leads: leads.length,
    companyLinks: leads.filter((lead) => lead.company).length,
    companyExceptions: leads.filter((lead) => !lead.company).length,
    uniqueCompanies: companies.length,
    uniquePeople: people.length,
    decisionMakerLinks: decisionMakerLinks.length,
    primaryDecisionMakers: leads.filter((lead) => lead.people.some((person) => person.isPrimary)).length,
  },
  leads,
  companies,
  people,
  decisionMakerLinks,
}, null, 2)}\n`);
