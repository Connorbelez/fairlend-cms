import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd(), '../..');
const JSON_PATH = resolve(ROOT, 'docs/research/fairlend-speaker-opportunities-2026-07-28.json');
const CSV_PATH = resolve(ROOT, 'docs/research/fairlend-speaker-opportunities-2026-07-28.csv');
const MARKDOWN_PATH = resolve(ROOT, 'docs/research/fairlend-speaker-opportunities-2026-07-28.md');
const RECONCILIATION_PATH = resolve(
  ROOT,
  'docs/research/fairlend-speaker-opportunities-reconciliation-2026-07-28.json',
);
const PARTNER_ID_MAP_PATH = resolve(
  process.cwd(),
  'scripts/data/partner-lead-id-map.json',
);
const GTA_BUILDER_MANIFEST_PATH = resolve(
  process.cwd(),
  'scripts/data/gta-builders-80-crm-manifest.json',
);
const MLI_PROFESSIONAL_MANIFEST_PATH = resolve(
  process.cwd(),
  'scripts/data/mli-select-early-file-professionals-80-crm-manifest.json',
);

const EXPECTED_TOTAL = 120;
const EXPECTED_LANES = new Map([
  ['investorGroupsAndMeetups', 20],
  ['investorEducation', 15],
  ['builderGroups', 20],
  ['builderEducation', 15],
  ['tradeEvents', 15],
  ['brokerAgentEducation', 15],
  ['shortTermRental', 10],
  ['adjacentChannels', 10],
]);

const PRIMARY_TYPE_TO_LANE = new Map([
  ['INVESTOR_RECURRING_GROUP', 'investorGroupsAndMeetups'],
  ['INVESTOR_MEETUP', 'investorGroupsAndMeetups'],
  ['INVESTOR_WORKSHOP', 'investorEducation'],
  ['INVESTOR_SEMINAR', 'investorEducation'],
  ['INVESTOR_WEBINAR_SERIES', 'investorEducation'],
  ['BUILDER_ASSOCIATION', 'builderGroups'],
  ['BUILDER_RENOVATOR_GROUP', 'builderGroups'],
  ['BUILDER_MEETUP', 'builderEducation'],
  ['CONSTRUCTION_EDUCATION_SERIES', 'builderEducation'],
  ['TRADE_SHOW', 'tradeEvents'],
  ['CONFERENCE', 'tradeEvents'],
  ['CONVENTION', 'tradeEvents'],
  ['EXPO', 'tradeEvents'],
  ['BROKER_EDUCATION', 'brokerAgentEducation'],
  ['REAL_ESTATE_BOARD_EDUCATION', 'brokerAgentEducation'],
  ['BROKERAGE_TRAINING', 'brokerAgentEducation'],
  ['SHORT_TERM_RENTAL_COMMUNITY', 'shortTermRental'],
  ['SHORT_TERM_RENTAL_EVENT', 'shortTermRental'],
  ['ADJACENT_PROFESSIONAL_EDUCATION', 'adjacentChannels'],
  ['OTHER_SPEAKER_CHANNEL', 'adjacentChannels'],
]);

const REQUIRED_STRING_PATHS = [
  ['researchId'],
  ['organizationName'],
  ['opportunityName'],
  ['primaryType'],
  ['organizationKey'],
  ['opportunitySeriesKey'],
  ['eventOccurrenceKey'],
  ['canonicalUrl'],
  ['location', 'country'],
  ['location', 'timeZone'],
  ['location', 'format'],
  ['timing', 'cadence'],
  ['timing', 'status'],
  ['audience', 'fitEvidence'],
  ['program', 'formatEvidence'],
  ['program', 'speakingAccessClass'],
  ['program', 'speakingMechanism'],
  ['personalization', 'specificHook'],
  ['personalization', 'whyNow'],
  ['personalization', 'bestTalkTitle'],
  ['personalization', 'talkPromise'],
  ['personalization', 'frontLoadedValue'],
  ['personalization', 'audienceTakeaway'],
  ['personalization', 'drawFlowBridge'],
  ['personalization', 'recommendedFormat'],
  ['personalization', 'proposedOffer'],
  ['personalization', 'primaryCTA'],
  ['personalization', 'recommendedFirstChannel'],
  ['personalization', 'recommendedNextAction'],
  ['qualification', 'tier'],
  ['verification', 'verifiedOn'],
  ['verification', 'activityStatus'],
  ['verification', 'duplicateCheck'],
];

const SCORE_FIELDS = [
  'audienceFit',
  'educationFit',
  'speakingAccess',
  'timingRecency',
  'reachInfluence',
  'geographicFit',
  'contactability',
  'repeatability',
];
const SCORE_MAXIMUMS = new Map([
  ['audienceFit', 25],
  ['educationFit', 20],
  ['speakingAccess', 20],
  ['timingRecency', 15],
  ['reachInfluence', 8],
  ['geographicFit', 5],
  ['contactability', 5],
  ['repeatability', 2],
]);

const get = (value, path) => path.reduce((current, key) => current?.[key], value);
const normalize = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const isHttpUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const rootDomain = (value) => {
  if (!value) return '';
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
};

const parseCsv = (input) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];
    if (quoted && character === '"' && nextCharacter === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && character === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && character === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  return rows;
};

const errors = [];
const fail = (message) => errors.push(message);

const [
  jsonText,
  csvText,
  markdown,
  reconciliationText,
  partnerIdMapText,
  gtaBuilderManifestText,
  mliProfessionalManifestText,
] = await Promise.all([
  readFile(JSON_PATH, 'utf8'),
  readFile(CSV_PATH, 'utf8'),
  readFile(MARKDOWN_PATH, 'utf8'),
  readFile(RECONCILIATION_PATH, 'utf8'),
  readFile(PARTNER_ID_MAP_PATH, 'utf8'),
  readFile(GTA_BUILDER_MANIFEST_PATH, 'utf8'),
  readFile(MLI_PROFESSIONAL_MANIFEST_PATH, 'utf8'),
]);

const records = JSON.parse(jsonText);
const reconciliation = JSON.parse(reconciliationText);
const partnerIdMap = JSON.parse(partnerIdMapText);
const gtaBuilderManifest = JSON.parse(gtaBuilderManifestText);
const mliProfessionalManifest = JSON.parse(mliProfessionalManifestText);
const exclusionRecords = [
  ...partnerIdMap,
  ...gtaBuilderManifest.records,
  ...mliProfessionalManifest.records,
];
const exclusionNames = new Set(
  exclusionRecords.flatMap((record) =>
    [record.name, record.companyName].filter(Boolean).map(normalize),
  ),
);
const exclusionDomains = new Set(
  exclusionRecords
    .map((record) => rootDomain(record.companyWebsite))
    .filter(Boolean),
);

if (!Array.isArray(records)) throw new Error('Speaker-opportunity JSON must be a top-level array.');
if (records.length !== EXPECTED_TOTAL) {
  fail(`Expected ${EXPECTED_TOTAL} qualified records; found ${records.length}.`);
}

const uniqueFields = ['researchId', 'opportunitySeriesKey', 'eventOccurrenceKey'];
for (const fieldName of uniqueFields) {
  const values = records.map((record) => record[fieldName]);
  const duplicates = [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
  if (duplicates.length > 0) fail(`Duplicate ${fieldName}: ${duplicates.join(', ')}`);
}

const normalizedOpportunityNames = records.map((record) =>
  normalize(`${record.organizationName} ${record.opportunityName}`),
);
const duplicateNames = [
  ...new Set(
    normalizedOpportunityNames.filter(
      (value, index) => normalizedOpportunityNames.indexOf(value) !== index,
    ),
  ),
];
if (duplicateNames.length > 0) {
  fail(`Duplicate normalized organization/opportunity pairs: ${duplicateNames.join(', ')}`);
}

const laneCounts = Object.fromEntries([...EXPECTED_LANES.keys()].map((lane) => [lane, 0]));

for (const [index, record] of records.entries()) {
  const label = record.researchId || `record ${index + 1}`;

  for (const path of REQUIRED_STRING_PATHS) {
    const value = get(record, path);
    if (typeof value !== 'string' || value.trim() === '') {
      fail(`${label}: ${path.join('.')} must be a non-empty string.`);
    }
  }

  if (!/^SPEAKER-2026-\d{3}$/.test(record.researchId ?? '')) {
    fail(`${label}: researchId must match SPEAKER-2026-NNN.`);
  }

  const lane = PRIMARY_TYPE_TO_LANE.get(record.primaryType);
  if (!lane) {
    fail(`${label}: unsupported primaryType ${record.primaryType}.`);
  } else {
    laneCounts[lane] += 1;
  }

  if (!isHttpUrl(record.canonicalUrl)) fail(`${label}: canonicalUrl is not HTTP(S).`);
  if (!['IN_PERSON', 'VIRTUAL', 'HYBRID'].includes(record.location?.format)) {
    fail(`${label}: location.format is invalid.`);
  }
  if (!['UPCOMING', 'RECURRING_ACTIVE', 'ONGOING_CONFIRM_OPEN'].includes(record.timing?.status)) {
    fail(`${label}: timing.status is invalid.`);
  }
  if (!['A_OPEN_APPLICATION', 'B_PROGRAM_CONTACT', 'C_PROVEN_GUEST_FORMAT', 'D_SPONSOR_EDUCATION', 'E_ORGANIZER_ROUTE_ONLY'].includes(record.program?.speakingAccessClass)) {
    fail(`${label}: speakingAccessClass is missing or not qualified.`);
  }
  if (!['TIER_A', 'TIER_B'].includes(record.qualification?.tier)) {
    fail(`${label}: qualification.tier must be TIER_A or TIER_B.`);
  }
  if (!['NET_NEW', 'EXISTING_ORGANIZATION_NEW_PROGRAM'].includes(record.verification?.duplicateCheck)) {
    fail(`${label}: duplicateCheck is not qualified as net-new.`);
  }
  const normalizedOrganization = normalize(record.organizationName ?? '');
  const normalizedOpportunity = normalize(record.opportunityName ?? '');
  const candidateDomain = rootDomain(record.organizationUrl || record.canonicalUrl);
  if (record.verification?.duplicateCheck === 'NET_NEW') {
    if (exclusionNames.has(normalizedOrganization) || exclusionNames.has(normalizedOpportunity)) {
      fail(`${label}: NET_NEW record duplicates a source-controlled exclusion name.`);
    }
    if (candidateDomain && exclusionDomains.has(candidateDomain)) {
      fail(`${label}: NET_NEW record duplicates source-controlled domain ${candidateDomain}.`);
    }
  } else if (exclusionNames.has(normalizedOpportunity)) {
    fail(`${label}: EXISTING_ORGANIZATION_NEW_PROGRAM reuses an existing opportunity name.`);
  }

  const sourceUrls = new Set((record.sources ?? []).map((source) => source.url));
  if (sourceUrls.size < 2) fail(`${label}: at least two distinct source URLs are required.`);
  if (!(record.sources ?? []).some((source) => source.sourceType === 'PRIMARY')) {
    fail(`${label}: at least one PRIMARY source is required.`);
  }
  for (const source of record.sources ?? []) {
    if (!isHttpUrl(source.url)) fail(`${label}: invalid source URL ${source.url}.`);
    for (const fieldName of [
      'title',
      'publisher',
      'sourceType',
      'underlyingDate',
      'verifiedOn',
      'proves',
      'accessStatus',
      'accessNote',
    ]) {
      if (typeof source[fieldName] !== 'string' || source[fieldName].trim() === '') {
        fail(`${label}: source.${fieldName} must be populated.`);
      }
    }
    if (!['PRIMARY', 'OFFICIAL_SOCIAL', 'PLATFORM', 'SECONDARY'].includes(source.sourceType)) {
      fail(`${label}: source.sourceType is invalid.`);
    }
    if (!['RESOLVED_2026_07_28', 'INACCESSIBLE_2026_07_28'].includes(source.accessStatus)) {
      fail(`${label}: source.accessStatus is invalid.`);
    }
  }

  const usableContacts = (record.contacts ?? []).filter(
    (contact) =>
      ['VERIFIED', 'ROLE_ROUTE_ONLY'].includes(contact.confidence) &&
      [contact.email, contact.phone, contact.linkedInUrl, contact.contactFormUrl].some(
        (value) => typeof value === 'string' && value.trim() !== '',
      ),
  );
  if (usableContacts.length === 0) fail(`${label}: no usable verified or role-based contact route.`);
  for (const contact of record.contacts ?? []) {
    if (contact.sourceUrl && !isHttpUrl(contact.sourceUrl)) {
      fail(`${label}: contact sourceUrl is invalid.`);
    }
  }

  for (const fieldName of SCORE_FIELDS) {
    if (!Number.isFinite(record.qualification?.[fieldName])) {
      fail(`${label}: qualification.${fieldName} must be numeric.`);
    } else if (
      record.qualification[fieldName] < 0 ||
      record.qualification[fieldName] > SCORE_MAXIMUMS.get(fieldName)
    ) {
      fail(
        `${label}: qualification.${fieldName} must be between 0 and ${SCORE_MAXIMUMS.get(fieldName)}.`,
      );
    }
  }
  const penaltyPoints = (record.qualification?.penalties ?? []).reduce((total, penalty) => {
    if (
      typeof penalty?.reason !== 'string' ||
      penalty.reason.trim() === '' ||
      !Number.isFinite(penalty?.points) ||
      penalty.points > 0
    ) {
      fail(`${label}: every penalty must contain a reason and non-positive numeric points.`);
      return total;
    }
    return total + penalty.points;
  }, 0);
  const computedScore =
    SCORE_FIELDS.reduce((total, fieldName) => total + (record.qualification?.[fieldName] ?? 0), 0) +
    penaltyPoints;
  if (record.qualification?.totalScore !== computedScore) {
    fail(
      `${label}: totalScore ${record.qualification?.totalScore} does not equal computed ${computedScore}.`,
    );
  }
  if (computedScore < 60) fail(`${label}: qualified score is below 60.`);
  if (record.qualification?.tier === 'TIER_A' && computedScore < 75) {
    fail(`${label}: TIER_A requires a score of at least 75.`);
  }
  if (record.qualification?.tier === 'TIER_B' && (computedScore < 60 || computedScore > 74)) {
    fail(`${label}: TIER_B requires a score from 60 to 74.`);
  }

  for (const fieldName of [
    'opennessSignals',
    'likelyObjections',
    'objectionResponses',
  ]) {
    if (!Array.isArray(record.personalization?.[fieldName]) || record.personalization[fieldName].length === 0) {
      fail(`${label}: personalization.${fieldName} must contain at least one item.`);
    }
  }
  for (const [path, description] of [
    [['secondaryTags'], 'secondaryTags'],
    [['audience', 'primarySegments'], 'audience.primarySegments'],
    [['program', 'recentTopics'], 'program.recentTopics'],
  ]) {
    const value = get(record, path);
    if (!Array.isArray(value) || value.length === 0) {
      fail(`${label}: ${description} must contain at least one item.`);
    }
  }

  if (!markdown.includes(record.researchId)) fail(`${label}: missing from Markdown report.`);
  if (!markdown.includes(record.opportunityName)) {
    fail(`${label}: opportunity name missing from Markdown report.`);
  }
}

for (const [lane, expected] of EXPECTED_LANES) {
  if (laneCounts[lane] !== expected) {
    fail(`${lane}: expected ${expected}, found ${laneCounts[lane]}.`);
  }
}

const csvRows = parseCsv(csvText.trimEnd());
const csvHeader = csvRows[0] ?? [];
const researchIdColumn = csvHeader.indexOf('researchId');
if (researchIdColumn < 0) fail('CSV must contain a researchId column.');
const csvIds = csvRows.slice(1).map((row) => row[researchIdColumn]);
if (csvIds.length !== records.length) {
  fail(`CSV record count ${csvIds.length} does not match JSON count ${records.length}.`);
}
if (new Set(csvIds).size !== csvIds.length) fail('CSV contains duplicate researchId values.');
for (const record of records) {
  if (!csvIds.includes(record.researchId)) fail(`${record.researchId}: missing from CSV.`);
}

if (reconciliation.totalQualified !== records.length) {
  fail(
    `Reconciliation total ${reconciliation.totalQualified} does not match JSON count ${records.length}.`,
  );
}
for (const [lane, count] of Object.entries(laneCounts)) {
  if (reconciliation.categoryCounts?.[lane] !== count) {
    fail(`${lane}: reconciliation count does not match JSON count ${count}.`);
  }
}
if (reconciliation.uniqueOpportunitySeries !== new Set(records.map((record) => record.opportunitySeriesKey)).size) {
  fail('Reconciliation uniqueOpportunitySeries does not match JSON.');
}
if (reconciliation.crmSnapshotCount !== 181) {
  fail(`Reconciliation must record the verified Twenty snapshot count of 181.`);
}
if (reconciliation.sourceControlledExclusionNames !== exclusionNames.size) {
  fail(
    `Reconciliation sourceControlledExclusionNames must equal computed ${exclusionNames.size}.`,
  );
}

if (errors.length > 0) {
  console.error(`Speaker-opportunity corpus validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Qualified speaker opportunities: ${records.length}`);
  for (const [lane, count] of Object.entries(laneCounts)) console.log(`${lane}: ${count}`);
  console.log(`Unique opportunity series: ${new Set(records.map((record) => record.opportunitySeriesKey)).size}`);
  console.log(`CSV rows: ${csvIds.length}`);
  console.log(`Source-controlled exclusion names: ${exclusionNames.size}`);
  console.log('Twenty read-only snapshot: 181 Partner Leads');
  console.log('Speaker-opportunity corpus validation passed.');
}
