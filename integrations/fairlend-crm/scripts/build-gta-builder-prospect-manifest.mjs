import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { v5 as uuidv5 } from 'uuid';

const ROOT = resolve(process.cwd(), '../..');
const APPLICATION_ID = 'b1f3164c-7f41-4887-87ac-77e494817fbc';
const VERIFIED_ON = '2026-07-15';
const SOURCE = 'research-gta-builders-80-2026-07-15';
const DEFAULT_OWNER_ID = '5dcb0871-7dfe-4fb5-b81d-5c674a143551';
const DEFAULT_OWNER_NAME = 'Connor Beleznay';

const REGIONS = [
  ['Toronto', 'docs/research/gta-builders-80-toronto.json'],
  ['York', 'docs/research/gta-builders-80-york.json'],
  ['Peel–Halton', 'docs/research/gta-builders-80-peel-halton.json'],
  ['Durham', 'docs/research/gta-builders-80-durham.json'],
];

const OUTPUT_JSON = 'docs/research/gta-builders-80-2026-07-15.json';
const OUTPUT_MARKDOWN = 'docs/research/gta-builders-80-personalized-outreach-2026-07-15.md';
const OUTPUT_CRM = 'integrations/fairlend-crm/scripts/data/gta-builders-80-crm-manifest.json';
const OUTPUT_FOLLOW_UPS = 'integrations/fairlend-crm/scripts/data/gta-builders-80-follow-up-manifest.json';
const CONTACT_ENRICHMENT = 'docs/research/gta-builders-80-public-contact-enrichment-2026-07-15.json';

const EXISTING_BUILDERS = [
  'Arctek Design Consultants',
  'ARMADA Design to Build',
  'Artycon',
  'AVL Custom Homes',
  'Buildplan',
  'BVM Homes / BVM Contracting',
  'Civilcan Engineering',
  'Daly Engineering Inc.',
  'Goldcon Project Management',
  'JASH Design & Build',
  'Leprevo Design-Build',
  'Mayfair Homes',
  'Modello Homes',
  'MR Homes Design & Build',
  'Peridot Design Build',
  'Pro Plans',
  'Simpson Design Group',
  'Stratas Design Build',
  'TADU Homes',
  'Waterfront Home Improvements',
];

const REQUIRED_TEXT = [
  'name', 'geography', 'website', 'contact_url', 'verified_on',
  'company_verification_status', 'activity_recency_status', 'activity_evidence',
  'current_build_signal', 'early_file_signal', 'openness_signal', 'priority',
  'primary_hook', 'fit_evidence', 'proposed_offer', 'first_cta',
  'objections_and_risks', 'company_research_notes', 'people_research_summary',
  'outreach_email', 'outreach_linkedin', 'outreach_phone_and_form',
  'outreach_followups', 'outreach_asset', 'outreach_guardrails',
  'primary_decision_maker_status',
];

const normalize = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/\b(?:incorporated|inc|limited|ltd|corporation|corp|company|co)\b/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const url = (value, label) => {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    return parsed;
  } catch {
    throw new Error(`${label} must be a valid http(s) URL; received ${JSON.stringify(value)}.`);
  }
};

const domain = (value) => url(value, 'website').hostname.replace(/^www\./, '').toLowerCase();
const stableId = (seed) => uuidv5(seed, APPLICATION_ID);
const asText = (value) => Array.isArray(value)
  ? value.map((item) => String(item).trim()).filter(Boolean).join('\n')
  : String(value ?? '').trim();
const clip = (value, max) => asText(value).slice(0, max);
const uniqueText = (values) => [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
const allStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
};
const publicEmails = (lead) => uniqueText([
  ...(lead.public_contact_enrichment?.emails ?? []),
  ...allStrings(lead).flatMap((value) => (
    value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
  )),
].map((value) => value.toLowerCase()));
const publicPhones = (lead) => uniqueText([
  ...(lead.public_contact_enrichment?.phones ?? []),
  ...(lead.contact_phone ? String(lead.contact_phone).split(/[;\n]/) : []),
  ...allStrings(lead).flatMap((value) => (
    value.match(/(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]\d{3}[\s.-]\d{4}(?:\s*(?:x|ext\.?)\s*\d+)?/gi) ?? []
  )),
]);
const sourceList = (lead) => [...new Set([
  lead.website,
  lead.contact_url,
  lead.decision_maker_source_url,
  ...(lead.company_source_urls ?? []),
].filter(Boolean))];

const normalizeCompanyVerificationStatus = (value) => {
  if (String(value).startsWith('VERIFIED_FIRST_PARTY')) return 'VERIFIED';
  return value;
};
const normalizeActivityRecencyStatus = (value) => {
  if (String(value).startsWith('CURRENT')) return 'CURRENT';
  return value;
};
const normalizeDecisionMakerStatus = (value) => ({
  ATTRIBUTED_OFFICIAL: 'VERIFIED',
  ATTRIBUTED_ON_OFFICIAL_SITE_CLIENT_TESTIMONIAL: 'NEEDS_REVERIFY',
  NOT_PUBLICLY_ATTRIBUTED: 'PUBLIC_DETAILS_UNAVAILABLE',
}[value] ?? value);

const normalizeStatuses = (lead) => {
  const companyVerificationStatus = normalizeCompanyVerificationStatus(lead.company_verification_status);
  const activityRecencyStatus = normalizeActivityRecencyStatus(lead.activity_recency_status);
  const primaryDecisionMakerStatus = normalizeDecisionMakerStatus(lead.primary_decision_maker_status);
  return {
    ...lead,
    ...(companyVerificationStatus === lead.company_verification_status ? {} : { source_company_verification_status: lead.company_verification_status }),
    ...(activityRecencyStatus === lead.activity_recency_status ? {} : { source_activity_recency_status: lead.activity_recency_status }),
    ...(primaryDecisionMakerStatus === lead.primary_decision_maker_status ? {} : { source_primary_decision_maker_status: lead.primary_decision_maker_status }),
    company_verification_status: companyVerificationStatus,
    activity_recency_status: activityRecencyStatus,
    primary_decision_maker_status: primaryDecisionMakerStatus,
  };
};

const regionPayloads = await Promise.all(REGIONS.map(async ([region, file]) => {
  const path = resolve(ROOT, file);
  const parsed = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array.`);
  if (parsed.length !== 20) throw new Error(`${region} must contain exactly 20 prospects; found ${parsed.length}.`);
  return { region, file, leads: parsed };
}));

let contactEnrichmentByName = new Map();
try {
  const enrichment = JSON.parse(await readFile(resolve(ROOT, CONTACT_ENRICHMENT), 'utf8'));
  if (!Array.isArray(enrichment.records) || enrichment.records.length !== 80) {
    throw new Error(`${CONTACT_ENRICHMENT} must contain exactly 80 records.`);
  }
  contactEnrichmentByName = new Map(enrichment.records.map((record) => [normalize(record.name), {
    emails: uniqueText(record.emails ?? []),
    phones: uniqueText(record.phones ?? []),
    pagesScanned: (record.pages ?? []).map((page) => page.finalUrl ?? page.requestedUrl).filter(Boolean),
    failedPageCount: (record.failures ?? []).length,
    scannedOn: record.scannedOn,
  }]));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const existing = EXISTING_BUILDERS.map(normalize);
const all = [];
const seenNames = new Map();
const seenDomains = new Map();

for (const { region, file, leads } of regionPayloads) {
  for (const [index, sourceLead] of leads.entries()) {
    const lead = normalizeStatuses({
      ...sourceLead,
      public_contact_enrichment: contactEnrichmentByName.get(normalize(sourceLead.name)),
    });
    const label = `${file} row ${index + 1}`;
    for (const field of REQUIRED_TEXT) {
      if (!asText(lead[field])) {
        throw new Error(`${label} (${lead.name ?? 'unnamed'}) is missing required text field ${field}.`);
      }
    }
    if (lead.verified_on !== VERIFIED_ON) throw new Error(`${label} must use verified_on ${VERIFIED_ON}.`);
    if (!Array.isArray(lead.company_source_urls) || lead.company_source_urls.length < 2) {
      throw new Error(`${label} (${lead.name}) needs at least two company_source_urls.`);
    }
    for (const [sourceIndex, sourceUrl] of sourceList(lead).entries()) url(sourceUrl, `${label} source ${sourceIndex + 1}`);
    if (!Number.isFinite(lead.fit_score) || lead.fit_score < 1 || lead.fit_score > 100) {
      throw new Error(`${label} (${lead.name}) fit_score must be a number from 1–100.`);
    }
    if (!['HIGH', 'NORMAL', 'LOW'].includes(lead.priority)) throw new Error(`${label} (${lead.name}) has invalid priority.`);
    if (!['VERIFIED', 'NEEDS_REVERIFY', 'UNVERIFIED', 'NO_LEGAL_ENTITY_FOUND'].includes(lead.company_verification_status)) {
      throw new Error(`${label} (${lead.name}) has invalid company_verification_status.`);
    }
    if (!['CURRENT', 'VERIFY_BEFORE_OUTREACH', 'POSSIBLY_PAUSED', 'STALE', 'NOT_APPLICABLE'].includes(lead.activity_recency_status)) {
      throw new Error(`${label} (${lead.name}) has invalid activity_recency_status.`);
    }
    if (!['VERIFIED', 'NEEDS_REVERIFY', 'UNVERIFIED', 'PUBLIC_DETAILS_UNAVAILABLE'].includes(lead.primary_decision_maker_status)) {
      throw new Error(`${label} (${lead.name}) has invalid primary_decision_maker_status.`);
    }
    if (lead.primary_decision_maker_status === 'VERIFIED' && (!lead.decision_maker_name || !lead.decision_maker_source_url)) {
      throw new Error(`${label} (${lead.name}) marks the decision maker VERIFIED without both a name and source URL.`);
    }

    const key = normalize(lead.name);
    const websiteDomain = domain(lead.website);
    const existingMatch = existing.find((existingKey) => (
      key === existingKey
      || (key.length >= 7 && existingKey.includes(key))
      || (existingKey.length >= 7 && key.includes(existingKey))
    ));
    if (existingMatch) throw new Error(`${label} duplicates an existing CRM builder by normalized/alias match: ${lead.name}.`);
    if (seenNames.has(key)) throw new Error(`${label} duplicates ${seenNames.get(key)} by normalized name: ${lead.name}.`);
    if (seenDomains.has(websiteDomain)) throw new Error(`${label} duplicates ${seenDomains.get(websiteDomain)} by website domain ${websiteDomain}.`);
    seenNames.set(key, `${region}: ${lead.name}`);
    seenDomains.set(websiteDomain, `${region}: ${lead.name}`);
    all.push({ ...lead, research_region: region, research_source_file: file });
  }
}

if (all.length !== 80) throw new Error(`Expected exactly 80 total prospects; found ${all.length}.`);

const ranked = all
  .sort((a, b) => b.fit_score - a.fit_score || a.name.localeCompare(b.name))
  .map((lead, index) => ({ ...lead, rank: index + 1 }));

const businessDateForRank = (rank) => {
  const businessDayIndex = Math.floor((rank - 1) / 10);
  const slot = (rank - 1) % 10;
  const date = new Date('2026-07-16T13:00:00.000Z');
  let remaining = businessDayIndex;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) remaining -= 1;
  }
  date.setUTCMinutes(date.getUTCMinutes() + slot * 15);
  return date.toISOString();
};

const followUpMethod = (lead) => {
  if (
    lead.company_verification_status !== 'VERIFIED'
    || lead.activity_recency_status !== 'CURRENT'
    || lead.primary_decision_maker_status === 'NEEDS_REVERIFY'
  ) return 'RESEARCH';
  if (publicEmails(lead).length > 0) return 'EMAIL';
  if (publicPhones(lead).length > 0) return 'PHONE';
  if (lead.contact_url) return 'CONTACT_FORM';
  return 'OTHER';
};

const followUpRequirements = (lead, method) => clip([
  `Required outcome: ${method === 'RESEARCH' ? 're-verify the organization, current activity, and correct partnership contact before outbound outreach' : `complete the personalized first-touch by ${method.toLowerCase().replace('_', ' ')}`}.`,
  `Information to request: ${lead.first_cta}`,
  `Personalization hook: ${lead.primary_hook}`,
  `Asset to prepare or send: ${lead.outreach_asset}`,
  `Verification: confirm the public contact route, named decision-maker/title, and current build signal against the cited sources immediately before execution.`,
  `Capture on completion: channel used, recipient, response/outcome, requested information received or outstanding, and the next owned Follow-up Action with a due date.`,
  `Guardrails: ${asText(lead.outreach_guardrails)} ${asText(lead.objections_and_risks)}`,
].join('\n'), 12_000);

const followUpPlan = ranked.map((lead, index) => {
  const fairlendLeadId = stableId(`partner-lead:${normalize(lead.name)}`);
  const method = followUpMethod(lead);
  const fairlendTaskKey = stableId(`follow-up:initial:${fairlendLeadId}`);
  return {
    fairlendTaskKey,
    fairlendTaskTargetKey: stableId(`task-target:${fairlendTaskKey}:${fairlendLeadId}`),
    fairlendLeadId,
    companyName: lead.name,
    title: `${method === 'RESEARCH' ? 'Verify and qualify' : `First-touch ${method.toLowerCase().replace('_', ' ')}`} — ${lead.name}`,
    dueAt: businessDateForRank(index + 1),
    status: 'TODO',
    position: index + 1,
    followUpMethod: method,
    followUpOutcome: 'PENDING',
    followUpRequirements: followUpRequirements(lead, method),
    followUpSequenceStep: 1,
    assigneeId: DEFAULT_OWNER_ID,
  };
});

const followUpByLeadId = new Map(followUpPlan.map((followUp) => [followUp.fairlendLeadId, followUp]));

const crmRecords = ranked.map((lead, index) => {
  const nameKey = normalize(lead.name);
  const sources = sourceList(lead);
  const fairlendLeadId = stableId(`partner-lead:${nameKey}`);
  const followUp = followUpByLeadId.get(fairlendLeadId);
  if (!followUp) throw new Error(`Missing Follow-up Action for ${lead.name}.`);
  const emails = publicEmails(lead);
  const phones = publicPhones(lead);
  const publicContactSummary = [
    lead.decision_maker_name
      ? `Decision-maker: ${lead.decision_maker_name}${lead.decision_maker_title ? ` — ${lead.decision_maker_title}` : ''} (${lead.primary_decision_maker_status})`
      : `Decision-maker: no reliable public name identified (${lead.primary_decision_maker_status})`,
    `Website: ${lead.website}`,
    `Contact form / route: ${lead.contact_url}`,
    emails.length > 0 ? `Email(s): ${emails.join('; ')}` : 'Email(s): none publicly identified',
    phones.length > 0 ? `Phone(s): ${phones.join('; ')}` : 'Phone(s): none publicly identified',
    `Service / contact geography: ${lead.geography}`,
  ].join('\n');
  return {
    name: lead.name,
    fairlendLeadId,
    capturedAt: `${VERIFIED_ON}T16:00:00.000Z`,
    intent: 'partner-prospect',
    source: SOURCE,
    contactName: clip(lead.decision_maker_name, 255),
    email: clip(lead.contact_email, 255),
    phone: clip(lead.contact_phone, 255),
    companyName: lead.name,
    projectContext: clip(`${lead.geography}. ${lead.current_build_signal}`, 5_000),
    scenarioContext: clip(lead.early_file_signal, 5_000),
    nextActionAt: followUp.dueAt,
    nextAction: clip(followUp.title, 5_000),
    nextFollowUpMethod: followUp.followUpMethod,
    nextFollowUpRequirements: followUp.followUpRequirements,
    nextFollowUpTaskKey: followUp.fairlendTaskKey,
    primaryHook: clip(lead.primary_hook, 5_000),
    fitEvidence: clip(lead.fit_evidence, 5_000),
    opennessSignal: clip(lead.openness_signal, 5_000),
    contactRoute: clip(lead.contact_url, 2_000),
    companyWebsite: clip(lead.website, 2_000),
    publicContactSummary: clip(publicContactSummary, 10_000),
    allContactEmails: clip(emails.join('\n'), 5_000),
    allContactPhones: clip(phones.join('\n'), 5_000),
    contactFormUrl: clip(lead.contact_url, 2_000),
    contactLocations: clip(lead.geography, 5_000),
    servicesSummary: clip([
      `Current services / build signal: ${lead.current_build_signal}`,
      `Early-file involvement: ${lead.early_file_signal}`,
    ].join('\n'), 10_000),
    buildPortfolioSummary: clip([
      `Activity evidence: ${lead.activity_evidence}`,
      `Current or representative builds: ${lead.current_build_signal}`,
      `Company research: ${lead.company_research_notes}`,
    ].join('\n'), 12_000),
    buildPortfolioSourceUrls: clip(lead.company_source_urls.join('\n'), 10_000),
    sourceUrls: clip(sources.join('\n'), 10_000),
    verificationDate: VERIFIED_ON,
    proposedOffer: clip(lead.proposed_offer, 5_000),
    firstCta: clip(lead.first_cta, 5_000),
    objectionsAndRisks: clip(lead.objections_and_risks, 5_000),
    activityRecencyNotes: clip(lead.activity_evidence, 5_000),
    companyMatchKey: stableId(`company:${nameKey}`),
    companySourceUrls: clip(lead.company_source_urls.join('\n'), 10_000),
    companyVerifiedOn: VERIFIED_ON,
    companyResearchNotes: clip(lead.company_research_notes, 10_000),
    peopleResearchSummary: clip(lead.people_research_summary, 10_000),
    outreachEmail: clip(lead.outreach_email, 12_000),
    outreachLinkedIn: clip(lead.outreach_linkedin, 5_000),
    outreachPhoneAndForm: clip(lead.outreach_phone_and_form, 8_000),
    outreachFollowUps: clip(lead.outreach_followups, 12_000),
    outreachAsset: clip(lead.outreach_asset, 5_000),
    outreachGuardrails: clip(lead.outreach_guardrails, 5_000),
    outreachDossierSources: clip(sources.join('\n'), 10_000),
    activationContext: clip(`Rank ${index + 1}/80; DrawFlow fit ${lead.fit_score}/100; GTA research region ${lead.research_region}.`, 5_000),
    captureStatus: 'SUBMITTED',
    workflowStatus: 'QUALIFIED',
    priority: lead.priority,
    timestampProvenance: 'INFERRED_CREATED_AT',
    consultationMilestone: 'NONE',
    position: index + 1,
    partnerCategory: 'BUILDER_PROFESSIONAL',
    partnershipStage: 'BUILDER_OUTREACH_READY',
    engagementHealth: lead.company_verification_status === 'VERIFIED' && lead.activity_recency_status === 'CURRENT'
      ? 'ACTIVE'
      : 'NEEDS_VERIFICATION',
    responseStatus: 'NOT_CONTACTED',
    lastContactChannel: 'NONE',
    proposalReviewStatus: 'NOT_STARTED',
    activationType: 'NONE',
    activationStatus: 'NOT_PROPOSED',
    activityRecencyStatus: lead.activity_recency_status,
    decisionMakerCount: lead.decision_maker_name ? 1 : 0,
    companyVerificationStatus: lead.company_verification_status,
    primaryDecisionMakerStatus: lead.primary_decision_maker_status,
    ownerId: DEFAULT_OWNER_ID,
  };
});

const markdown = [
  '# GTA builder prospects — 80 personalized DrawFlow partnership dossiers',
  '',
  `Verified ${VERIFIED_ON}. Exactly 80 net-new GTA builder prospects, ranked by FairLend/DrawFlow partnership fit. Public evidence is research, not an endorsement or proof of partnership intent. Re-verify named people and live project claims immediately before outreach.`,
  '',
  '## Ranked index',
  '',
  '| Rank | Builder | Region | Fit | Priority | Public route |',
  '|---:|---|---|---:|---|---|',
  ...ranked.map((lead) => `| ${lead.rank} | ${lead.name.replaceAll('|', '\\|')} | ${lead.research_region} | ${lead.fit_score} | ${lead.priority} | [Contact](${lead.contact_url}) |`),
  '',
  ...ranked.flatMap((lead) => [
    `## ${lead.rank}. ${lead.name}`,
    '',
    `**Territory:** ${lead.geography}  `,
    `**Website:** ${lead.website}  `,
    `**Public contact route:** ${lead.contact_url}${lead.contact_email ? ` · ${lead.contact_email}` : ''}${lead.contact_phone ? ` · ${lead.contact_phone}` : ''}  `,
    `**Decision-maker evidence:** ${lead.decision_maker_name || 'No reliable public name identified'}${lead.decision_maker_title ? ` — ${lead.decision_maker_title}` : ''} (${lead.primary_decision_maker_status})  `,
    `**Fit:** ${lead.fit_score}/100 · ${lead.priority}  `,
    '',
    `**Activity/build signal.** ${lead.activity_evidence} ${lead.current_build_signal}`,

    `**Services.** ${lead.early_file_signal}`,
    '',
    `**Why the files appear early.** ${lead.early_file_signal}`,
    '',
    `**Partner-openness signal.** ${lead.openness_signal}`,
    '',
    `**Personalized hook.** ${lead.primary_hook}`,
    '',
    `**Fit evidence.** ${lead.fit_evidence}`,
    '',
    `**Offer and CTA.** ${lead.proposed_offer} ${lead.first_cta}`,
    '',
    `**Email.** ${lead.outreach_email}`,
    '',
    `**LinkedIn.** ${lead.outreach_linkedin}`,
    '',
    `**Phone / form.** ${lead.outreach_phone_and_form}`,
    '',
    `**Follow-ups.** ${asText(lead.outreach_followups)}`,
    '',
    `**Leave-behind asset.** ${lead.outreach_asset}`,
    '',
    `**Objections / risks.** ${asText(lead.objections_and_risks)}`,
    '',
    `**Guardrails.** ${asText(lead.outreach_guardrails)}`,
    '',
    `**Company research.** ${lead.company_research_notes}`,
    '',
    `**People research.** ${lead.people_research_summary}`,
    '',
    `**Sources (verified ${VERIFIED_ON}).** ${sourceList(lead).map((source) => `[${new URL(source).hostname}](${source})`).join(' · ')}`,
    '',
  ]),
].join('\n');

const outputs = [
  [OUTPUT_JSON, `${JSON.stringify(ranked, null, 2)}\n`],
  [OUTPUT_MARKDOWN, `${markdown}\n`],
  [OUTPUT_CRM, `${JSON.stringify({
    version: 1,
    source: SOURCE,
    verifiedOn: VERIFIED_ON,
    owner: { id: DEFAULT_OWNER_ID, name: DEFAULT_OWNER_NAME },
    count: crmRecords.length,
    records: crmRecords,
  }, null, 2)}\n`],
  [OUTPUT_FOLLOW_UPS, `${JSON.stringify({
    version: 1,
    source: SOURCE,
    generatedOn: VERIFIED_ON,
    timezone: 'America/Toronto',
    assignee: { id: DEFAULT_OWNER_ID, name: DEFAULT_OWNER_NAME },
    count: followUpPlan.length,
    tasks: followUpPlan,
  }, null, 2)}\n`],
];

for (const [file, contents] of outputs) {
  const path = resolve(ROOT, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents, 'utf8');
}

console.log(`Validated ${ranked.length} net-new GTA builder prospects (${REGIONS.map(([region]) => `${region}: 20`).join(', ')}).`);
console.log(`Generated ${OUTPUT_JSON}`);
console.log(`Generated ${OUTPUT_MARKDOWN}`);
console.log(`Generated ${OUTPUT_CRM}`);
console.log(`Generated ${OUTPUT_FOLLOW_UPS}`);
