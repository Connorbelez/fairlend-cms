#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v5 as uuidv5 } from "uuid";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const sourcePath = path.join(
  repositoryRoot,
  "docs/research/fairlend-speaker-opportunities-2026-07-28.json",
);
const records = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const APPLICATION_ID = "b1f3164c-7f41-4887-87ac-77e494817fbc";
const VERIFIED_ON = "2026-07-28";
const IMPORT_SOURCE = "research-speaker-opportunities-120-2026-07-28";
const CAMPAIGN = "Elie Speaker Pipeline — 2026-07-28";

const stableId = (seed) => uuidv5(seed, APPLICATION_ID);
const clip = (value, limit = 10_000) =>
  String(value ?? "").slice(0, limit);
const list = (value) =>
  Array.isArray(value)
    ? value
    : value === undefined || value === null || value === ""
      ? []
      : [value];
const lines = (value) => list(value).filter(Boolean).join("\n");

const laneFor = (record) => {
  const number = Number(record.researchId.match(/(\d+)$/)?.[1]);
  if (number <= 20) return "investorGroupsAndMeetups";
  if (number <= 35) return "investorEducation";
  if (number <= 55) return "builderGroups";
  if (number <= 70) return "builderEducation";
  if (number <= 85) return "tradeEvents";
  if (number <= 100) return "brokerAgentEducation";
  if (number <= 110) return "shortTermRental";
  return "adjacentChannels";
};

const isEvent = (record) =>
  ["TRADE_SHOW", "CONFERENCE", "EXPO", "SHORT_TERM_RENTAL_EVENT"].includes(
    record.primaryType,
  );

const partnerCategoryFor = (record, lane) => {
  if (lane === "builderGroups" || lane === "builderEducation") {
    return "BUILDER_PROFESSIONAL";
  }
  if (lane === "investorGroupsAndMeetups" || lane === "investorEducation") {
    return "INVESTOR_GROUP";
  }
  if (isEvent(record) || lane === "tradeEvents") return "TRADE_SHOW_EVENT";
  return "MEETUP_COMMUNITY";
};

const stageFor = (record, lane) => {
  if (lane === "builderGroups" || lane === "builderEducation") {
    return "BUILDER_OUTREACH_READY";
  }
  if (isEvent(record) || lane === "tradeEvents") {
    return "EVENT_PROSPECTUS_REVIEWED";
  }
  return "COMMUNITY_PROGRAM_PROPOSED";
};

const activationTypeFor = (record, lane) => {
  if (isEvent(record) || lane === "tradeEvents") return "EVENT_ACTIVATION";
  if (
    record.primaryType.includes("MEETUP") ||
    record.primaryType.includes("COMMUNITY")
  ) {
    return "MEETUP_SESSION";
  }
  return "MEMBER_PROGRAM";
};

const hasInaccessibleSource = (record) =>
  record.sources.some(
    (source) => source.accessStatus === "INACCESSIBLE_2026_07_28",
  );

const followUpMethodFor = (record) => {
  if (hasInaccessibleSource(record)) return "RESEARCH";
  const channel = record.personalization.recommendedFirstChannel.toLowerCase();
  if (channel.includes("email")) return "EMAIL";
  if (channel.includes("linkedin") || channel.includes("dm")) return "LINKEDIN";
  if (channel.includes("phone") || channel.includes("call")) return "PHONE";
  if (channel.includes("form")) return "CONTACT_FORM";
  return "OTHER";
};

const dueAtFor = (rank) => {
  const date = new Date("2026-07-29T13:00:00.000Z");
  let businessDays = Math.floor((rank - 1) / 8);
  while (businessDays > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) businessDays -= 1;
  }
  return date.toISOString();
};

const contactSummary = (record) =>
  record.contacts
    .map((contact) =>
      [
        contact.name || "Role-based route",
        contact.role,
        contact.organization,
        contact.email,
        contact.phone,
        contact.linkedInUrl,
        contact.contactFormUrl,
        `${contact.routeType} / ${contact.confidence}`,
        contact.sourceUrl ? `Source: ${contact.sourceUrl}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    )
    .join("\n");

const sourceSummary = (record) =>
  record.sources
    .map(
      (source) =>
        `${source.sourceType} | ${source.accessStatus} | ${source.title} | ${source.url} | ${source.proves}`,
    )
    .join("\n");

const emailScript = (record) => `Subject: Speaker idea for ${record.opportunityName}: ${record.personalization.bestTalkTitle}

Hi ${record.contacts[0]?.name || record.contacts[0]?.role || "team"},

${record.personalization.specificHook}

Elie can deliver a practical, education-first session titled “${record.personalization.bestTalkTitle}.” ${record.personalization.talkPromise}

The audience leaves with:
${list(record.personalization.frontLoadedValue)
  .map((item) => `- ${item}`)
  .join("\n")}

The DrawFlow connection comes only after the educational framework: ${record.personalization.drawFlowBridge}

${record.personalization.primaryCTA}

Best,
FairLend`;

const linkedInScript = (record) => `Connection note:
I’ve been following ${record.opportunityName}. ${record.personalization.specificHook} We have an education-first session idea for your audience and I’d value the right programming contact.

Follow-up after acceptance:
Elie’s proposed session is “${record.personalization.bestTalkTitle}.” ${record.personalization.talkPromise} ${record.personalization.primaryCTA}`;

const phoneScript = (record) => `Call / voicemail opener:
I’m calling from FairLend with a speaker idea for ${record.opportunityName}. ${record.personalization.specificHook} Elie can teach “${record.personalization.bestTalkTitle},” focused on ${record.personalization.audienceTakeaway}. Who owns speaker or education programming?

Contact-form version:
${record.personalization.specificHook} We would like to propose Elie for an education-first session, “${record.personalization.bestTalkTitle}.” ${record.personalization.talkPromise} ${record.personalization.primaryCTA}`;

const followUpScript = (record) => `Day 0: Send the primary ${record.personalization.recommendedFirstChannel} outreach with the personalized hook and talk title.
Day 3: Send the one-page talk outline and audience takeaways; ask for the programming owner.
Day 8: Share one anonymized DrawFlow project timeline/interest-exposure example framed as educational proof.
Day 15: Offer two delivery formats and dates; ask for a 15-minute fit call.
Day 30: Close the loop politely and move to nurture tied to the next program cycle.
Guardrail at every step: do not claim approval, rates, savings, rental income, or outcomes are guaranteed.`;

const sorted = [...records].sort(
  (left, right) =>
    right.qualification.totalScore - left.qualification.totalScore ||
    left.researchId.localeCompare(right.researchId),
);

const manifest = sorted.map((record, index) => {
  const lane = laneFor(record);
  const category = partnerCategoryFor(record, lane);
  const inaccessible = record.sources.filter(
    (source) => source.accessStatus === "INACCESSIBLE_2026_07_28",
  );
  const namedContacts = record.contacts.filter((contact) => contact.name);
  const emails = record.contacts.map((contact) => contact.email).filter(Boolean);
  const phones = record.contacts.map((contact) => contact.phone).filter(Boolean);
  const contactForms = record.contacts
    .map((contact) => contact.contactFormUrl)
    .filter(Boolean);
  const followUpMethod = followUpMethodFor(record);
  const researchGaps = list(record.verification.researchGaps);
  const sourceAccessSummary = `${record.sources.length} evidence sources; ${
    record.sources.length - inaccessible.length
  } resolved on ${VERIFIED_ON}; ${inaccessible.length} explicitly inaccessible and queued for reverification.${
    inaccessible.length
      ? `\n${inaccessible.map((source) => `${source.url} — ${source.accessNote}`).join("\n")}`
      : ""
  }`;
  const location = [
    record.location.city,
    record.location.province,
    record.location.country,
    record.location.timeZone,
  ]
    .filter(Boolean)
    .join(", ");
  const opportunityTiming = [
    `Next date: ${record.timing.nextDate}`,
    `Cadence: ${record.timing.cadence}`,
    `Speaker deadline: ${record.timing.speakerDeadline}`,
    `Sponsor deadline: ${record.timing.sponsorDeadline}`,
    `Status: ${record.timing.status}`,
  ].join("\n");
  const audienceProfile = [
    `Primary: ${list(record.audience.primarySegments).join(", ")}`,
    `Secondary: ${list(record.audience.secondarySegments).join(", ")}`,
    `Estimated reach: ${record.audience.estimatedReach}`,
    `Reach basis: ${record.audience.reachBasis}`,
    `Fit evidence: ${record.audience.fitEvidence}`,
  ].join("\n");
  const programEvidence = [
    `Format evidence: ${record.program.formatEvidence}`,
    `Recent topics: ${lines(record.program.recentTopics)}`,
    `Past relevant speakers: ${lines(record.program.pastRelevantSpeakers)}`,
    `Restrictions: ${record.program.restrictions}`,
  ].join("\n");
  const activationContext = [
    `Hook: ${record.personalization.specificHook}`,
    `Why now: ${record.personalization.whyNow}`,
    `Talk: ${record.personalization.bestTalkTitle}`,
    `Promise: ${record.personalization.talkPromise}`,
    `Front-loaded value: ${lines(record.personalization.frontLoadedValue)}`,
    `Audience takeaway: ${record.personalization.audienceTakeaway}`,
    `DrawFlow bridge: ${record.personalization.drawFlowBridge}`,
    `Format: ${record.personalization.recommendedFormat}`,
    `Offer: ${record.personalization.proposedOffer}`,
    `CTA: ${record.personalization.primaryCTA}`,
    `First channel: ${record.personalization.recommendedFirstChannel}`,
    `Next action: ${record.personalization.recommendedNextAction}`,
  ].join("\n\n");

  return {
    name: clip(`${record.opportunityName} — ${record.organizationName}`, 255),
    fairlendLeadId: stableId(`speaker-opportunity:${record.researchId}`),
    capturedAt: `${VERIFIED_ON}T16:00:00.000Z`,
    submittedAt: `${VERIFIED_ON}T16:00:00.000Z`,
    nextActionAt: dueAtFor(index + 1),
    intent: "speaker-partnership-opportunity",
    source: IMPORT_SOURCE,
    page: record.canonicalUrl,
    campaign: CAMPAIGN,
    campaignScanId: record.researchId,
    contactName: clip(record.contacts[0]?.name, 255),
    email: clip(emails[0], 255),
    phone: clip(phones[0], 255),
    companyName: clip(record.organizationName, 255),
    completionStatus: "complete",
    detail: clip(
      `${record.personalization.bestTalkTitle}\n${record.personalization.talkPromise}`,
    ),
    message: clip(record.personalization.primaryCTA),
    notes: clip(activationContext),
    intakeSummary: clip(
      `${record.qualification.tier} speaker opportunity scoring ${record.qualification.totalScore}/100. ${record.audience.fitEvidence} ${record.personalization.talkPromise}`,
    ),
    adminNotes: clip(
      [
        `Research ID: ${record.researchId}`,
        `Duplicate check: ${record.verification.duplicateCheck}`,
        `Activity: ${record.verification.activityStatus}`,
        `Research gaps: ${researchGaps.join("; ") || "None recorded"}`,
      ].join("\n"),
    ),
    intakePayload: {
      schemaVersion: "fairlend-speaker-opportunity-crm-v1",
      importedOn: VERIFIED_ON,
      sourceFile:
        "docs/research/fairlend-speaker-opportunities-2026-07-28.json",
      speakerOpportunity: record,
    },
    attributionPayload: {
      researchId: record.researchId,
      importSource: IMPORT_SOURCE,
      researchDocuments: [
        "docs/research/fairlend-speaker-opportunity-discovery-agent-brief-2026-07-28.md",
        "docs/research/fairlend-speaker-opportunities-2026-07-28.md",
        "docs/research/fairlend-speaker-opportunities-reconciliation-2026-07-28.json",
      ],
    },
    captureStatus: "SUBMITTED",
    workflowStatus: "QUALIFIED",
    priority:
      record.qualification.totalScore >= 85 ? "HIGH" : "NORMAL",
    timestampProvenance: "SOURCE_SUPPLIED",
    partnerType: record.primaryType,
    partnerRole: "Elie speaker / presenter opportunity",
    projectContext: clip(
      `${location} · ${record.location.format} · ${opportunityTiming}`,
    ),
    scenarioContext: clip(audienceProfile),
    consultationMilestone: "NONE",
    position: index + 1,
    followUpCount: 0,
    primaryHook: clip(record.personalization.specificHook),
    fitEvidence: clip(
      `${record.audience.fitEvidence}\n\n${record.personalization.opennessSignals.join("\n")}`,
    ),
    opennessSignal: clip(lines(record.personalization.opennessSignals)),
    contactRoute: clip(contactSummary(record)),
    sourceUrls: clip(record.sources.map((source) => source.url).join("\n")),
    verificationDate: VERIFIED_ON,
    proposedOffer: clip(record.personalization.proposedOffer),
    firstCta: clip(record.personalization.primaryCTA),
    objectionsAndRisks: clip(
      [
        `Objections: ${lines(record.personalization.likelyObjections)}`,
        `Responses: ${lines(record.personalization.objectionResponses)}`,
        `Restrictions: ${record.program.restrictions}`,
      ].join("\n"),
    ),
    activityRecencyNotes: clip(
      `${record.verification.activityStatus}\n${sourceAccessSummary}`,
    ),
    partnerCategory: category,
    partnershipStage: stageFor(record, lane),
    engagementHealth: inaccessible.length
      ? "NEEDS_VERIFICATION"
      : "ACTIVE",
    responseStatus: "NOT_CONTACTED",
    lastContactChannel: "NONE",
    proposalReviewStatus: "READY_TO_SUBMIT",
    activationType: activationTypeFor(record, lane),
    activationStatus: "NOT_PROPOSED",
    activityRecencyStatus: inaccessible.length
      ? "VERIFY_BEFORE_OUTREACH"
      : "CURRENT",
    decisionMakerCount: namedContacts.length,
    companyMatchKey: stableId(`speaker-organization:${record.organizationKey}`),
    companySourceUrls: clip(
      record.sources.map((source) => source.url).join("\n"),
    ),
    companyVerifiedOn: VERIFIED_ON,
    companyResearchNotes: clip(
      `${record.organizationName}\n${record.audience.fitEvidence}\n${programEvidence}`,
    ),
    peopleResearchSummary: clip(contactSummary(record)),
    companyVerificationStatus: inaccessible.length
      ? "NEEDS_REVERIFY"
      : "VERIFIED",
    primaryDecisionMakerStatus: namedContacts.some(
      (contact) => contact.confidence === "VERIFIED",
    )
      ? "VERIFIED"
      : "PUBLIC_DETAILS_UNAVAILABLE",
    outreachEmail: clip(emailScript(record)),
    outreachLinkedIn: clip(linkedInScript(record)),
    outreachPhoneAndForm: clip(phoneScript(record)),
    outreachFollowUps: clip(followUpScript(record)),
    outreachAsset: clip(
      `Elie speaker one-sheet; one-page outline for “${record.personalization.bestTalkTitle}”; anonymized DrawFlow timeline with draw and interest-exposure overlay; audience worksheet.`,
    ),
    outreachGuardrails: clip(
      `Lead with education and the audience's planning problem. Keep DrawFlow as the implementation bridge, not the opening pitch. Do not imply financing approval, rates, savings, rental income, event acceptance, or outcomes are guaranteed. Reverify contacts, deadlines, and inaccessible sources before outreach.`,
    ),
    outreachDossierSources: clip(
      [
        "docs/research/fairlend-speaker-opportunities-2026-07-28.md",
        "docs/research/fairlend-speaker-opportunities-2026-07-28.json",
        sourceSummary(record),
      ].join("\n"),
    ),
    activationContext: clip(activationContext),
    nextFollowUpRequirements: clip(
      [
        `Required outcome: ${followUpMethod === "RESEARCH" ? "reverify inaccessible evidence and the current programming route before outreach" : `complete the personalized first-touch by ${followUpMethod.toLowerCase().replace("_", " ")}`}.`,
        `Information to request: ${record.personalization.primaryCTA}`,
        `Asset to prepare: one-page talk outline plus the anonymized DrawFlow timeline/interest-exposure example.`,
        `Verification: confirm the speaker deadline, organizer, contact route, and current program status immediately before execution.`,
        `Capture on completion: channel, recipient, response, requested information, and next owned action with due date.`,
      ].join("\n"),
    ),
    companyWebsite: clip(record.organizationUrl, 255),
    publicContactSummary: clip(contactSummary(record)),
    allContactEmails: clip(emails.join("\n")),
    allContactPhones: clip(phones.join("\n")),
    contactFormUrl: clip(contactForms[0], 255),
    contactLocations: clip(location),
    servicesSummary: clip(
      `${record.program.formatEvidence}\nAudience: ${list(record.audience.primarySegments).join(", ")}`,
    ),
    nextFollowUpMethod: followUpMethod,
    nextAction: clip(record.personalization.recommendedNextAction),
    speakerLane: lane,
    speakerOpportunityType: record.primaryType,
    opportunitySeriesKey: record.opportunitySeriesKey,
    eventOccurrenceKey: record.eventOccurrenceKey,
    speakerScore: record.qualification.totalScore,
    speakerTier: record.qualification.tier,
    opportunityFormat: record.location.format,
    opportunityTiming: clip(opportunityTiming),
    audienceProfile: clip(audienceProfile),
    programEvidence: clip(programEvidence),
    speakingAccess: clip(
      `${record.program.speakingAccessClass}\n${record.program.speakingMechanism}`,
    ),
    paidAccessDetails: clip(
      `Paid access: ${record.program.paidAccess}\nPublished price: ${record.program.publishedPrice}`,
    ),
    whyNow: clip(record.personalization.whyNow),
    recommendedTalkTitle: clip(
      record.personalization.bestTalkTitle,
      1_000,
    ),
    talkPromise: clip(record.personalization.talkPromise),
    frontLoadedValue: clip(lines(record.personalization.frontLoadedValue)),
    audienceTakeaway: clip(record.personalization.audienceTakeaway),
    drawFlowBridge: clip(record.personalization.drawFlowBridge),
    researchGaps: clip(researchGaps.join("\n")),
    sourceAccessSummary: clip(sourceAccessSummary),
  };
});

if (manifest.length !== 120) {
  throw new Error(`Expected 120 CRM records, found ${manifest.length}.`);
}
if (new Set(manifest.map((record) => record.fairlendLeadId)).size !== 120) {
  throw new Error("Duplicate fairlendLeadId values in speaker CRM manifest.");
}
if (new Set(manifest.map((record) => record.campaignScanId)).size !== 120) {
  throw new Error("Duplicate research IDs in speaker CRM manifest.");
}

const start = process.argv[2] === undefined ? 0 : Number(process.argv[2]);
const count =
  process.argv[3] === undefined ? manifest.length : Number(process.argv[3]);
if (!Number.isInteger(start) || start < 0 || !Number.isInteger(count) || count < 1) {
  throw new Error("Usage: build-speaker-opportunity-crm-manifest.mjs [start] [count]");
}

process.stdout.write(`${JSON.stringify(manifest.slice(start, start + count), null, 2)}\n`);
