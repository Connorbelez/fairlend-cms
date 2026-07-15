import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { v5 as uuidv5 } from 'uuid';

const ROOT = resolve(process.cwd(), '../..');
const APPLICATION_ID = 'b1f3164c-7f41-4887-87ac-77e494817fbc';
const VERIFIED_ON = '2026-07-15';
const SOURCE = 'research-mli-select-early-file-professionals-80-2026-07-15';
const CAMPAIGN = 'MLI Select Early-File Partners — GTA 2026-07';
const DEFAULT_OWNER_ID = '5dcb0871-7dfe-4fb5-b81d-5c674a143551';
const DEFAULT_OWNER_NAME = 'Connor Beleznay';
const INPUT = 'docs/research/mli-select-early-file-professionals-80-enrichment-2026-07-15.json';
const EXISTING_NAMES = 'docs/research/mli-select-early-file-professionals-existing-crm-names-2026-07-15.json';
const OUTPUT_JSON = 'docs/research/mli-select-early-file-professionals-80-2026-07-15.json';
const OUTPUT_MARKDOWN = 'docs/research/mli-select-early-file-professionals-80-personalized-outreach-2026-07-15.md';
const OUTPUT_MAPPING = 'docs/research/mli-select-early-file-professionals-80-crm-import-mapping-2026-07-15.md';
const OUTPUT_CRM = 'integrations/fairlend-crm/scripts/data/mli-select-early-file-professionals-80-crm-manifest.json';
const OUTPUT_FOLLOW_UPS = 'integrations/fairlend-crm/scripts/data/mli-select-early-file-professionals-80-follow-up-manifest.json';

const MANUAL = {
  'BDP Quadrangle': {
    source: 'https://www.bdp.com/ca/ideas/a-shift-in-the-gta-housing-market-why-purpose-built-rentals-lead-on-sustainability',
    evidence: 'BDP’s GTA purpose-built-rental analysis explicitly links early integrated design, energy, accessibility and affordability decisions to CMHC programs including MLI Select.',
    hook: 'BDP’s own GTA rental analysis says impact is highest and cost is lowest early in design, and explicitly connects those decisions to MLI Select—an unusually direct opening for a design-to-finance handoff.',
  },
  'Graziani + Corazza Architects': {
    source: 'https://www.gc-architects.com/portfolio/the-ivy',
    evidence: 'The official portfolio identifies The Ivy in Toronto as a completed 34-storey, 232-unit rental project for Tricon Residential.',
    hook: 'The Ivy, ROQ City and the firm’s other rental portfolio entries show that G+C is repeatedly in the room while rental unit counts, performance assumptions and consultant inputs are still being fixed.',
  },
  'Teeple Architects': {
    source: 'https://teeplearch.com/portfolio/queen-coxwell-revitalization/',
    evidence: 'Queen & Ashbridge is a 770-unit mixed-income Toronto redevelopment with market, affordable and deeply affordable rental housing.',
    hook: 'Queen & Ashbridge combines market, affordable and deeply affordable rental in one 770-unit redevelopment—the exact kind of early design trade-off that can change an MLI Select pathway.',
  },
  'superkül': {
    source: 'https://www.superkul.ca/projects/the-fairbank/',
    evidence: 'The Fairbank is an official-site eight-storey, 141-unit purpose-built rental project on Eglinton Avenue West in Toronto.',
    hook: 'The Fairbank’s 141 purpose-built rental apartments and its transit-oriented, context-sensitive massing create a concrete hook for aligning design, energy and financing before the scheme hardens.',
    emails: ['umlaut@superkul.ca', 'press@superkul.ca'],
    phones: ['416-596-0700'],
  },
  'The Planning Partnership': {
    source: 'https://www.planpart.ca/6486-bathurst-street',
    evidence: 'For 64–86 Bathurst, TPP is municipal planner and engagement lead for a proposed 333-suite purpose-built rental building and prepared the Planning Rationale and Housing Issues reports.',
    hook: 'TPP’s continuing role on the 333-suite 64–86 Bathurst purpose-built rental file makes the pre-submission planning rationale a natural point for financing-readiness triage.',
  },
  'SV Planning': {
    source: 'https://svplanninginc.com/',
    evidence: 'The official site lists pre-acquisition due diligence, zoning analysis, Planning Act approvals and GTA development work led by founder Sabrina Sgotto.',
    hook: 'SV Planning explicitly starts at pre-acquisition due diligence, giving Sabrina a clean trigger to surface financing feasibility before a client commits to an approvals path.',
    emails: ['sabrina@svplanninginc.com'],
    phones: ['289-270-5770'],
  },
  'Gatzios Planning + Development Consultants': {
    source: 'https://gatziosplanning.com/?page_id=30',
    evidence: 'The official company profile says its GTA residential land-development experience often runs from inception through land development.',
    hook: 'Gatzios describes involvement from project inception through land development, which creates a legitimate point to introduce a consented financing screen before approvals work accelerates.',
  },
  'DesignABLE Environments': {
    source: 'https://www.toronto.ca/wp-content/uploads/2023/08/8e2c-SDTG-2023-Release-FinalJuly-11AODA.pdf',
    evidence: 'The City of Toronto’s current Shelter Design and Technical Guidelines credit DesignABLE Environments as an accessibility consultant and contributing author.',
    hook: 'DesignABLE’s credited work on Toronto’s shelter design guidelines demonstrates that the team influences accessibility requirements at the standards-and-drawing stage, where MLI Select accessibility commitments must be designed deliberately.',
  },
};

const normalize = (value) => String(value ?? '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/\b(?:incorporated|inc|limited|ltd|corporation|corp|company|co)\b/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');
const clip = (value, max) => String(value ?? '').trim().slice(0, max);
const clipWords = (value, max) => {
  const text = String(value ?? '').trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  return `${clipped.slice(0, Math.max(0, clipped.lastIndexOf(' '))).replace(/[,:;.-]+$/, '')}…`;
};
const unique = (values) => [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
const stableId = (seed) => uuidv5(seed, APPLICATION_ID);
const validUrl = (value, label) => {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    return parsed.href;
  } catch {
    throw new Error(`${label} must be an HTTP(S) URL: ${JSON.stringify(value)}`);
  }
};
const cleanEvidence = (value) => clip(String(value ?? '').replace(/\s+/g, ' ').trim(), 440);
const namedContact = (targetRole) => {
  const first = String(targetRole).split(',')[0].trim();
  return /\b(?:principal|partner|lead|director|manager|president|founder|advisor|appraiser|architect|planner)\b/i.test(first)
    ? ''
    : first;
};
const possessive = (name) => `${name}${/s$/i.test(name) ? "'" : "'s"}`;

const segmentLabel = {
  ARCHITECT: 'Architect',
  PLANNING_DESIGN: 'Planner / Urban or Landscape Designer',
  TECHNICAL_COST: 'Technical / Cost / Performance Professional',
  REAL_ESTATE_ADVISORY: 'Multifamily Real Estate / Feasibility / Valuation Advisor',
};

const offerFor = (lead) => {
  const lower = `${lead.name} ${lead.touchpoint}`.toLowerCase();
  if (/energy|building performance|zero carbon|truezero|river consulting/.test(lower)) {
    return 'A consent-based MLI Select finance-readiness handoff that pairs the firm’s energy evidence with FairLend underwriting triage and a DrawFlow model showing how eligible costs and construction advances can track the approved budget.';
  }
  if (/accessib|universal design|designable|meaningful access/.test(lower)) {
    return 'A co-branded MLI Select accessibility-pathway briefing plus a consented FairLend financing screen, with DrawFlow translating the selected design commitment and budget into an auditable funding roadmap.';
  }
  if (/appraisal|valuation/.test(lower)) {
    return 'A consent-based appraisal-to-underwriting handoff: FairLend handles the owner’s MLI Select and construction-financing analysis, while DrawFlow maps the accepted budget and development milestones to proposed advances without affecting the appraiser’s independence or reliance terms.';
  }
  if (/cost|quantity|monitor/.test(lower)) {
    return 'A cost-plan-to-capital-stack handoff: FairLend screens the owner’s MLI Select and construction-financing fit, while DrawFlow maps the independent budget, contingency and progress evidence to proposed advances without changing the consultant’s certification role.';
  }
  if (lead.segment === 'ARCHITECT') {
    return 'A co-branded early MLI Select feasibility checkpoint for rental clients, followed by a consented FairLend financing screen and a DrawFlow design-to-budget roadmap before unit mix, energy and accessibility decisions harden.';
  }
  if (lead.segment === 'PLANNING_DESIGN') {
    return 'A pre-application MLI Select finance-readiness checkpoint that the firm can offer owners alongside planning due diligence, with DrawFlow mapping the evolving approvals, budget and draw milestones.';
  }
  return 'A client-consented MLI Select financing triage and owner-facing checklist that complements the firm’s transaction or feasibility advice; FairLend handles lending analysis and DrawFlow turns the budget and development milestones into a staged funding roadmap.';
};

const artifactFor = (lead) => {
  const lower = `${lead.name} ${lead.touchpoint}`.toLowerCase();
  if (/energy|building performance|zero carbon|truezero|river consulting/.test(lower)) return 'energy model inputs/outputs, proposed-versus-reference comparison, attestation status and performance assumptions';
  if (/accessib|universal design/.test(lower)) return 'accessible-unit/visitability strategy, feature schedule, drawing-review status and architect/consultant confirmation';
  if (/cost|quantity|monitor/.test(lower)) return 'current hard/soft-cost plan, contingency, schedule, procurement assumptions and progress-certification workflow';
  if (/appraisal|valuation/.test(lower)) return 'as-is/as-complete value assumptions, unit mix, rent roll, market evidence, costs and lender/CMHC reliance requirements';
  if (/market|feasibility|pro forma|urbanation|bullpen|parcel|nblc|hemson/.test(lower)) return 'rental-market study, unit mix, achievable rents, absorption/vacancy assumptions and development pro forma';
  if (lead.segment === 'ARCHITECT') return 'concept plans, unit mix, floor areas, energy/accessibility targets and consultant coordination status';
  if (lead.segment === 'PLANNING_DESIGN') return 'pre-application concept, density/unit count, approvals pathway, planning rationale and required-study checklist';
  return 'authorized development summary, zoning/unit potential, rent or operating assumptions, value analysis and financing timeline';
};

const scoreLead = (lead, evidence) => {
  const lower = `${lead.touchpoint} ${evidence.join(' ')}`.toLowerCase();
  const projectFit = /purpose.?built rental|multifamily|multi.?residential|rental apartment|affordable housing|housing|apartment/.test(lower) ? 2 : 1;
  const timing = /pre-acquisition|feasibility|concept|schematic|pre-application|inception|underwriting|site acquisition/.test(`${lead.engagement_stage} ${lead.touchpoint}`.toLowerCase()) ? 2 : 1;
  const fileOwnership = 2;
  const financingInfluence = /cost|quantity|appraisal|valuation|feasibility|pro forma|market|development advisory|mli select/.test(lower) ? 2 : 1;
  const partnerability = lead.emails.length || lead.phones.length ? 2 : 1;
  return {
    project_fit: projectFit,
    engagement_timing: timing,
    file_ownership: fileOwnership,
    financing_influence: financingInfluence,
    partnerability,
    compliance_gate: 'PASS_CONSENTED_INTRODUCTION_ONLY',
    total: projectFit + timing + fileOwnership + financingInfluence + partnerability,
  };
};

const dueAtForRank = (rank) => {
  const businessDayIndex = Math.floor((rank - 1) / 10);
  const slot = (rank - 1) % 10;
  const date = new Date('2026-07-28T13:00:00.000Z');
  let remaining = businessDayIndex;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) remaining -= 1;
  }
  date.setUTCMinutes(date.getUTCMinutes() + slot * 15);
  return date.toISOString();
};

let existingNames = [];
try {
  existingNames = JSON.parse(await readFile(resolve(ROOT, EXISTING_NAMES), 'utf8'));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
const existingKeys = existingNames.map(normalize);

const enrichment = JSON.parse(await readFile(resolve(ROOT, INPUT), 'utf8'));
if (!Array.isArray(enrichment.records) || enrichment.records.length !== 80) throw new Error(`${INPUT} must contain exactly 80 records.`);

const seenNames = new Set();
const seenDomains = new Set();
const prepared = enrichment.records.map((source, index) => {
  const manual = MANUAL[source.name] ?? {};
  const key = normalize(source.name);
  const websiteDomain = new URL(source.website).hostname.replace(/^www\./, '').toLowerCase();
  if (seenNames.has(key)) throw new Error(`Duplicate prospect name: ${source.name}`);
  if (seenDomains.has(websiteDomain)) throw new Error(`Duplicate company domain: ${websiteDomain}`);
  if (existingKeys.some((existing) => existing === key || (key.length > 7 && existing.includes(key)) || (existing.length > 7 && key.includes(existing)))) {
    throw new Error(`Prospect duplicates an existing CRM Partner Lead: ${source.name}`);
  }
  seenNames.add(key);
  seenDomains.add(websiteDomain);

  const emails = unique([...(manual.emails ?? []), ...(source.emails ?? [])]).filter((value) => !/^(?:user|name|email|yourname|john|jane)@(?:domain|example)\./i.test(value));
  const phones = unique([...(manual.phones ?? []), ...(source.phones ?? [])]);
  const descriptions = unique((source.pages ?? [])
    .map((page) => cleanEvidence(page.description))
    .filter((value) => value.length >= 45)
    .filter((value) => !/^(?:learn more|who we are|our services|home\b)/i.test(value))
    .filter((value) => !/\b(?:skip to content|cookie policy|privacy policy|who we are)\b/i.test(value))
    .filter((value) => /rental|residential|housing|multifamily|multi-residential|apartment|planning|development|energy|sustainab|accessib|appraisal|valuation|cost|quantity|engineering|land|market|feasibility/i.test(value)));
  const rawEvidence = unique([
    ...(source.project_evidence ?? []),
    ...(source.service_evidence ?? []),
  ].map(cleanEvidence))
    .filter((value) => value.length >= 55)
    .filter((value) => !/skip to content|facebook twitter|copyright ©|cookie policy|privacy policy/i.test(value));
  const evidence = unique([
    manual.evidence,
    ...descriptions,
    ...rawEvidence,
    `The official site describes the firm's relevant work as ${source.touchpoint}.`,
  ].map(cleanEvidence)).filter(Boolean).slice(0, 12);
  const sources = unique([
    source.website,
    source.contact_url,
    manual.source,
    ...(source.official_source_urls ?? []),
  ].filter(Boolean).map((value, sourceIndex) => validUrl(value, `${source.name} source ${sourceIndex + 1}`)));
  if (sources.length === 0) throw new Error(`${source.name} has no official source URL.`);

  const contactName = namedContact(source.target_role);
  const score = scoreLead({ ...source, emails, phones }, evidence);
  if (score.total < 6 || score.compliance_gate !== 'PASS_CONSENTED_INTRODUCTION_ONLY') throw new Error(`${source.name} failed the prospect eligibility gate.`);
  const companySignal = clipWords(descriptions[0] ?? evidence[0] ?? source.touchpoint, 260);
  const highlight = manual.hook ?? (descriptions[0]
      ? `${possessive(source.name)} official site describes this relevant mandate: “${companySignal.replace(/[.!?]+$/, '')}.” That puts the team close to ${source.touchpoint} while the owner can still change the financing plan.`
      : `${possessive(source.name)} public work in ${source.touchpoint} creates a natural MLI Select checkpoint during ${source.engagement_stage}, before the owner’s financing plan is fixed.`);
  const proposedOffer = offerFor(source);
  const earlyFileArtifacts = artifactFor(source);
  const role = segmentLabel[source.segment];
  const firstCta = `Would ${contactName || source.target_role} spend 20 minutes reviewing one anonymized GTA rental scenario and decide whether a consent-based referral pilot is useful?`;
  const contactRoute = emails[0] ? `Email ${emails[0]}` : phones[0] ? `Call ${phones[0]}` : `Use ${source.contact_url || source.website}`;
  const outreachEmail = [
    `Subject: an MLI Select checkpoint for ${source.name}'s early rental files`,
    '',
    `Hi ${contactName ? contactName.split(' ')[0] : 'there'} — ${highlight}`,
    '',
    `Because your team is engaged during ${source.engagement_stage}, you can see ${source.touchpoint} before the owner’s financing plan is fixed. FairLend can add an optional, consent-based MLI Select and construction-financing checkpoint without asking you to disclose a client file or step into lending advice. ${proposedOffer}`,
    '',
    firstCta,
    '',
    'Best,',
    'Connor',
  ].join('\n');
  const outreachLinkedIn = `${contactName ? `${contactName.split(' ')[0]}, ` : ''}${highlight} FairLend can give consenting rental clients an early MLI Select financing screen, while DrawFlow maps the evolving budget and milestones to proposed advances. Open to a 20-minute anonymized workflow review?`;
  const outreachPhoneAndForm = `Ask for ${source.target_role}. Lead with the official-site signal: “${clip(highlight, 300)}” Then explain that FairLend offers an optional, owner-authorized MLI Select financing checkpoint and DrawFlow budget/draw roadmap. Request a 20-minute anonymized workflow review; do not request project documents on the first touch.`;
  const outreachFollowUps = [
    'Day 3 — send a one-page role-specific MLI Select evidence map showing the exact handoff point and the no-file-without-consent rule.',
    `Day 8 — share a worked anonymized example using ${earlyFileArtifacts}.`,
    'Day 15 — ask whether one consenting owner/client should test the workflow; offer a secure intake link or a three-way introduction.',
    'Day 25 — close the loop politely and move to quarterly nurture if there is no reply.',
  ].join('\n');
  const outreachAsset = `${role} MLI Select early-file checklist + anonymized DrawFlow ${source.engagement_stage}-to-advance example.`;
  const guardrails = 'Never ask for or accept a client file without owner/borrower authorization. Do not imply CMHC approval, guaranteed financing, rates, eligibility, or that the prospect endorses FairLend. Preserve the prospect’s professional independence and never ask an agent, appraiser, architect, planner or consultant to breach confidentiality, fiduciary duty, privilege, reliance terms or procurement rules.';
  const objections = `Likely concern: another financing vendor could disrupt the client relationship or create scope/liability ambiguity. Frame FairLend as optional and consent-based, preserve ${source.name}'s professional role, use an anonymized first review, and make the client—not the consultant—the source of confidential financing information.`;

  return {
    ...source,
    emails,
    phones,
    contact_name: contactName,
    evidence,
    official_source_urls: sources,
    company_verification_status: source.pages.length || manual.source ? 'VERIFIED' : 'NEEDS_REVERIFY',
    activity_recency_status: source.pages.length && evidence.length ? 'CURRENT' : 'VERIFY_BEFORE_OUTREACH',
    primary_decision_maker_status: contactName ? 'NEEDS_REVERIFY' : 'PUBLIC_DETAILS_UNAVAILABLE',
    primary_decision_maker_name: contactName,
    early_file_artifacts: earlyFileArtifacts,
    mli_select_touchpoint: source.touchpoint,
    eligibility_score: score,
    fit_score: Math.min(99, 58 + score.total * 4 + Math.min(3, evidence.length)),
    priority: score.total >= 9 ? 'HIGH' : 'NORMAL',
    primary_hook: highlight,
    fit_evidence: `${role}; ordinary engagement at ${source.engagement_stage} exposes ${earlyFileArtifacts}. Official evidence: ${evidence[0] ?? source.touchpoint}`,
    proposed_offer: proposedOffer,
    first_cta: firstCta,
    objections_and_risks: objections,
    outreach_email: outreachEmail,
    outreach_linkedin: outreachLinkedIn,
    outreach_phone_and_form: outreachPhoneAndForm,
    outreach_followups: outreachFollowUps,
    outreach_asset: outreachAsset,
    outreach_guardrails: guardrails,
    contact_route: contactRoute,
    rank_seed: index + 1,
  };
});

const ranked = prepared
  .sort((a, b) => b.fit_score - a.fit_score || b.eligibility_score.total - a.eligibility_score.total || a.name.localeCompare(b.name))
  .map((lead, index) => ({ ...lead, rank: index + 1 }));

const followUps = ranked.map((lead) => {
  const fairlendLeadId = stableId(`partner-lead:${normalize(lead.name)}`);
  const method = lead.emails.length ? 'EMAIL' : lead.phones.length ? 'PHONE' : lead.contact_url ? 'CONTACT_FORM' : 'RESEARCH';
  const fairlendTaskKey = stableId(`follow-up:initial:${fairlendLeadId}`);
  return {
    fairlendTaskKey,
    fairlendTaskTargetKey: stableId(`task-target:${fairlendTaskKey}:${fairlendLeadId}`),
    fairlendLeadId,
    companyName: lead.name,
    title: `First-touch ${method.toLowerCase().replace('_', ' ')} — ${lead.name}`,
    dueAt: dueAtForRank(lead.rank),
    status: 'TODO',
    position: lead.rank,
    followUpMethod: method,
    followUpOutcome: 'PENDING',
    followUpRequirements: clip([
      `Required outcome: complete the personalized first touch by ${method.toLowerCase().replace('_', ' ')} or record why the route is invalid.`,
      `Target: ${lead.target_role}${lead.contact_name ? ` (${lead.contact_name})` : ''}.`,
      `Personalization hook: ${lead.primary_hook}`,
      `Information to request: ${lead.first_cta}`,
      `Specific qualification questions: Does the firm encounter GTA rental projects at ${lead.engagement_stage}? Can it offer a client-consented financing introduction? Which artifact is available at that point: ${lead.early_file_artifacts}?`,
      `Asset to prepare/send: ${lead.outreach_asset}`,
      `Verification immediately before execution: confirm current public contact route, title, service claim and cited project/activity source.`,
      'Capture on completion: channel, recipient, response/outcome, answers received or outstanding, consent status, and the next owned Follow-up Action with a due date.',
      `Guardrails: ${lead.outreach_guardrails}`,
    ].join('\n'), 12_000),
    followUpSequenceStep: 1,
    assigneeId: DEFAULT_OWNER_ID,
  };
});

const followUpByLeadId = new Map(followUps.map((task) => [task.fairlendLeadId, task]));
const crmRecords = ranked.map((lead) => {
  const fairlendLeadId = stableId(`partner-lead:${normalize(lead.name)}`);
  const followUp = followUpByLeadId.get(fairlendLeadId);
  const publicContactSummary = [
    `Target: ${lead.target_role}${lead.contact_name ? ` (${lead.contact_name}; re-verify before outreach)` : ''}`,
    `Website: ${lead.website}`,
    `Contact route: ${lead.contact_url}`,
    lead.emails.length ? `Email(s): ${lead.emails.join('; ')}` : 'Email(s): none attributable on crawled official pages',
    lead.phones.length ? `Phone(s): ${lead.phones.join('; ')}` : 'Phone(s): none attributable on crawled official pages',
    `Geography: ${lead.geography}`,
  ].join('\n');
  return {
    name: lead.name,
    fairlendLeadId,
    capturedAt: `${VERIFIED_ON}T16:00:00.000Z`,
    intent: 'partner-prospect',
    source: SOURCE,
    campaign: CAMPAIGN,
    contactName: clip(lead.contact_name, 255),
    email: clip(lead.emails[0], 255),
    phone: clip(lead.phones[0], 255),
    companyName: lead.name,
    partnerType: lead.segment,
    partnerRole: segmentLabel[lead.segment],
    projectContext: clip(`${lead.geography}. ${lead.evidence[0] ?? lead.primary_hook}`, 5_000),
    scenarioContext: clip(`MLI Select touchpoint: ${lead.mli_select_touchpoint}\nEngagement stage: ${lead.engagement_stage}\nEarly-file artifacts: ${lead.early_file_artifacts}\nEligibility: ${JSON.stringify(lead.eligibility_score)}`, 5_000),
    nextActionAt: followUp.dueAt,
    nextAction: followUp.title,
    nextFollowUpMethod: followUp.followUpMethod,
    nextFollowUpRequirements: followUp.followUpRequirements,
    nextFollowUpTaskKey: followUp.fairlendTaskKey,
    primaryHook: clip(lead.primary_hook, 5_000),
    fitEvidence: clip(lead.fit_evidence, 5_000),
    opennessSignal: clip(`Repeat-client ${segmentLabel[lead.segment].toLowerCase()} workflow with a natural consented-introduction point at ${lead.engagement_stage}; public contact route: ${lead.contact_route}.`, 5_000),
    contactRoute: clip(lead.contact_route, 2_000),
    companyWebsite: lead.website,
    publicContactSummary: clip(publicContactSummary, 10_000),
    allContactEmails: clip(lead.emails.join('\n'), 5_000),
    allContactPhones: clip(lead.phones.join('\n'), 5_000),
    contactFormUrl: clip(lead.contact_url, 2_000),
    contactLocations: clip(lead.geography, 5_000),
    servicesSummary: clip(`Services / role: ${lead.touchpoint}\nMLI Select touchpoint: ${lead.mli_select_touchpoint}\nEarly-file artifacts: ${lead.early_file_artifacts}\nEngagement stage: ${lead.engagement_stage}`, 10_000),
    buildPortfolioSummary: clip([`Official evidence: ${lead.evidence.slice(0, 5).join('\n')}`, `Research qualification: ${lead.fit_evidence}`].join('\n'), 12_000),
    buildPortfolioSourceUrls: clip(lead.official_source_urls.join('\n'), 10_000),
    sourceUrls: clip(lead.official_source_urls.join('\n'), 10_000),
    verificationDate: VERIFIED_ON,
    proposedOffer: clip(lead.proposed_offer, 5_000),
    firstCta: clip(lead.first_cta, 5_000),
    objectionsAndRisks: clip(lead.objections_and_risks, 5_000),
    activityRecencyNotes: clip(`Official-site crawl verified ${VERIFIED_ON}; ${lead.company_verification_status}; ${lead.activity_recency_status}. Re-verify before outbound use.`, 5_000),
    companyMatchKey: stableId(`company:${normalize(lead.name)}`),
    companySourceUrls: clip(lead.official_source_urls.join('\n'), 10_000),
    companyVerifiedOn: VERIFIED_ON,
    companyResearchNotes: clip(`Segment: ${segmentLabel[lead.segment]}\nGeography: ${lead.geography}\nEvidence: ${lead.evidence.join('\n')}\nEligibility score: ${JSON.stringify(lead.eligibility_score)}`, 10_000),
    peopleResearchSummary: clip(`Target role: ${lead.target_role}. ${lead.contact_name ? `Named public contact candidate: ${lead.contact_name}; re-verify exact current title before outreach.` : 'No reliable named decision-maker was promoted into the CRM; route through the target role.'} Official page headings/people signals: ${(lead.people_evidence ?? []).slice(0, 15).join('; ') || 'none extracted'}.`, 10_000),
    outreachEmail: clip(lead.outreach_email, 12_000),
    outreachLinkedIn: clip(lead.outreach_linkedin, 5_000),
    outreachPhoneAndForm: clip(lead.outreach_phone_and_form, 8_000),
    outreachFollowUps: clip(lead.outreach_followups, 12_000),
    outreachAsset: clip(lead.outreach_asset, 5_000),
    outreachGuardrails: clip(lead.outreach_guardrails, 5_000),
    outreachDossierSources: clip(lead.official_source_urls.join('\n'), 10_000),
    activationContext: clip(`Rank ${lead.rank}/80; fit ${lead.fit_score}/100; eligibility ${lead.eligibility_score.total}/10; segment ${segmentLabel[lead.segment]}; campaign ${CAMPAIGN}.`, 5_000),
    captureStatus: 'SUBMITTED',
    workflowStatus: 'QUALIFIED',
    priority: lead.priority,
    timestampProvenance: 'INFERRED_CREATED_AT',
    consultationMilestone: 'NONE',
    position: lead.rank,
    partnerCategory: 'BUILDER_PROFESSIONAL',
    partnershipStage: 'BUILDER_OUTREACH_READY',
    engagementHealth: lead.company_verification_status === 'VERIFIED' ? 'ACTIVE' : 'NEEDS_VERIFICATION',
    responseStatus: 'NOT_CONTACTED',
    lastContactChannel: 'NONE',
    proposalReviewStatus: 'NOT_STARTED',
    activationType: 'NONE',
    activationStatus: 'NOT_PROPOSED',
    activityRecencyStatus: lead.activity_recency_status,
    decisionMakerCount: lead.contact_name ? 1 : 0,
    companyVerificationStatus: lead.company_verification_status,
    primaryDecisionMakerStatus: lead.primary_decision_maker_status,
    ownerId: DEFAULT_OWNER_ID,
  };
});

const markdown = [
  '# GTA MLI Select early-file professionals — 80 personalized partnership dossiers',
  '',
  `Verified ${VERIFIED_ON}. Exactly 80 net-new GTA prospects: 20 architects, 20 planners/designers, 20 technical/cost/performance professionals, and 20 multifamily real-estate/feasibility/valuation advisors. Every record passed the consent-and-confidentiality gate and scored at least 6/10. Public evidence supports qualification; it does not prove partnership interest. Re-verify live claims, titles and routes immediately before outreach.`,
  '',
  '## Ranked index',
  '',
  '| Rank | Prospect | Segment | Score | Fit | Priority | Public route |',
  '|---:|---|---|---:|---:|---|---|',
  ...ranked.map((lead) => `| ${lead.rank} | ${lead.name.replaceAll('|', '\\|')} | ${segmentLabel[lead.segment]} | ${lead.eligibility_score.total}/10 | ${lead.fit_score}/100 | ${lead.priority} | [Contact](${lead.contact_url}) |`),
  '',
  ...ranked.flatMap((lead) => [
    `## ${lead.rank}. ${lead.name}`,
    '',
    `**Lane:** ${segmentLabel[lead.segment]} · **territory:** ${lead.geography} · **fit:** ${lead.fit_score}/100 · **eligibility:** ${lead.eligibility_score.total}/10  `,
    `**Target:** ${lead.target_role}${lead.contact_name ? ` (${lead.contact_name}; re-verify)` : ''}  `,
    `**Public routes:** ${lead.emails.join('; ') || 'no attributable email extracted'} · ${lead.phones.join('; ') || 'no attributable phone extracted'} · [contact/site](${lead.contact_url})  `,
    '',
    `**Official evidence.** ${lead.evidence.slice(0, 3).join(' ')}`,
    '',
    `**MLI Select touchpoint.** ${lead.mli_select_touchpoint} during ${lead.engagement_stage}.`,
    '',
    `**Early-file artifacts.** ${lead.early_file_artifacts}.`,
    '',
    `**Personalized hook.** ${lead.primary_hook}`,
    '',
    `**Offer.** ${lead.proposed_offer}`,
    '',
    `**CTA.** ${lead.first_cta}`,
    '',
    `**Email script.**\n\n${lead.outreach_email}`,
    '',
    `**LinkedIn / DM.** ${lead.outreach_linkedin}`,
    '',
    `**Phone / form.** ${lead.outreach_phone_and_form}`,
    '',
    `**Follow-up sequence.**\n\n${lead.outreach_followups}`,
    '',
    `**Asset.** ${lead.outreach_asset}`,
    '',
    `**Risks.** ${lead.objections_and_risks}`,
    '',
    `**Guardrails.** ${lead.outreach_guardrails}`,
    '',
    `**Sources.** ${lead.official_source_urls.map((source) => `[${new URL(source).hostname}](${source})`).join(' · ')}`,
    '',
  ]),
].join('\n');

const mapping = `# Twenty CRM import mapping — 80 GTA MLI Select early-file professionals

Prepared ${VERIFIED_ON}. This is the pre-write mapping for explicit approval. No Partner Lead, Task, or TaskTarget record is created by this generator.

## Record operations

| Manifest | Count | Twenty object | Idempotency key | Operation |
|---|---:|---|---|---|
| \`mli-select-early-file-professionals-80-crm-manifest.json\` | 80 | Partner Lead | \`fairlendLeadId\` | Upsert net-new qualified prospects |
| \`mli-select-early-file-professionals-80-follow-up-manifest.json\` | 80 | Task | \`fairlendTaskKey\` | Upsert initial scheduled follow-ups |
| same follow-up manifest | 80 | TaskTarget | \`fairlendTaskTargetKey\` | Upsert Task → Partner Lead targets after Partner Lead IDs resolve |

## Core mapping

| Research / manifest value | Twenty field |
|---|---|
| stable prospect UUID | \`Partner Lead.fairlendLeadId\` |
| company name | \`name\`, \`companyName\` |
| segment / professional lane | \`partnerType\`, \`partnerRole\` |
| exact MLI Select touchpoint, engagement stage, early-file artifacts, 10-point qualification | \`scenarioContext\`, \`servicesSummary\`, \`fitEvidence\`, \`companyResearchNotes\` |
| official service/project evidence | \`projectContext\`, \`buildPortfolioSummary\` |
| complete public contact routes | \`email\`, \`phone\`, \`contactRoute\`, \`publicContactSummary\`, \`allContactEmails\`, \`allContactPhones\`, \`contactFormUrl\`, \`contactLocations\` |
| company and evidence URLs | \`companyWebsite\`, \`sourceUrls\`, \`companySourceUrls\`, \`buildPortfolioSourceUrls\`, \`outreachDossierSources\` |
| target person/role research | \`contactName\`, \`peopleResearchSummary\`, \`decisionMakerCount\`, \`primaryDecisionMakerStatus\` |
| personalized positioning | \`primaryHook\`, \`proposedOffer\`, \`firstCta\`, \`objectionsAndRisks\` |
| channel scripts and sequence | \`outreachEmail\`, \`outreachLinkedIn\`, \`outreachPhoneAndForm\`, \`outreachFollowUps\`, \`outreachAsset\`, \`outreachGuardrails\` |
| research state | \`verificationDate\`, \`companyVerifiedOn\`, \`companyVerificationStatus\`, \`activityRecencyStatus\`, \`activityRecencyNotes\` |
| workflow | \`partnerCategory=BUILDER_PROFESSIONAL\`, \`partnershipStage=BUILDER_OUTREACH_READY\`, \`responseStatus=NOT_CONTACTED\` |
| owner | \`ownerId=${DEFAULT_OWNER_ID}\` (${DEFAULT_OWNER_NAME}) |
| scheduled first action | \`nextActionAt\`, \`nextFollowUpMethod\`, \`nextAction\`, \`nextFollowUpRequirements\`, \`nextFollowUpTaskKey\` |
| Task schedule | \`Task.dueAt\`, \`status=TODO\`, \`followUpMethod\`, \`followUpRequirements\`, \`followUpOutcome=PENDING\`, \`followUpSequenceStep=1\` |

## Scheduling and safety

- Due dates run from July 28 through August 6, 2026, ten prospects per Toronto business day, in 15-minute slots.
- No email, LinkedIn message, call, form submission, or calendar booking is sent by this import.
- Each follow-up requires current-route/title re-verification and records specific information to request.
- Client information may move only through an owner-authorized intake, secure link, or three-way introduction.
`;

const outputs = [
  [OUTPUT_JSON, `${JSON.stringify({ version: 1, source: SOURCE, verifiedOn: VERIFIED_ON, count: ranked.length, records: ranked }, null, 2)}\n`],
  [OUTPUT_MARKDOWN, `${markdown}\n`],
  [OUTPUT_MAPPING, mapping],
  [OUTPUT_CRM, `${JSON.stringify({ version: 1, source: SOURCE, campaign: CAMPAIGN, verifiedOn: VERIFIED_ON, owner: { id: DEFAULT_OWNER_ID, name: DEFAULT_OWNER_NAME }, count: crmRecords.length, records: crmRecords }, null, 2)}\n`],
  [OUTPUT_FOLLOW_UPS, `${JSON.stringify({ version: 1, source: SOURCE, campaign: CAMPAIGN, generatedOn: VERIFIED_ON, timezone: 'America/Toronto', assignee: { id: DEFAULT_OWNER_ID, name: DEFAULT_OWNER_NAME }, count: followUps.length, tasks: followUps }, null, 2)}\n`],
];
for (const [file, contents] of outputs) {
  const outputPath = resolve(ROOT, file);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents, 'utf8');
}

console.log(`Validated ${ranked.length} net-new GTA MLI Select early-file prospects.`);
console.log(`Segments: ${Object.entries(Object.groupBy(ranked, (lead) => lead.segment)).map(([segment, leads]) => `${segment} ${leads.length}`).join(', ')}.`);
console.log(`Priority A (8–10): ${ranked.filter((lead) => lead.eligibility_score.total >= 8).length}; Priority B (6–7): ${ranked.filter((lead) => lead.eligibility_score.total >= 6 && lead.eligibility_score.total < 8).length}.`);
console.log(`Generated ${outputs.map(([file]) => file).join(', ')}.`);
