#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const researchDirectory = path.join(repositoryRoot, "docs/research");
const workingDirectory = path.join(
  researchDirectory,
  "speaker-opportunity-working",
);

const workingFiles = [
  "investor-lanes.json",
  "builder-lanes.json",
  "events-adjacent.json",
];

const records = workingFiles
  .flatMap((file) =>
    JSON.parse(fs.readFileSync(path.join(workingDirectory, file), "utf8")),
  )
  .sort((left, right) => left.researchId.localeCompare(right.researchId));

const inaccessibleSources = new Map([
  ["https://www.albertalandlord.org/2026-upcoming-events.html", "HTTP 404"],
  ["https://www.corpiq.com/fr/evenements-formations/?page=2", "HTTP 404"],
  ["https://www.albertalandlord.org/membership-benefits.html", "HTTP 404"],
  ["https://www.albertalandlord.org/past-events.html", "HTTP 404"],
  ["https://torontonaiop.wildapricot.org/widget/event-6683468", "HTTP 404"],
  ["https://ckhba.ca/membership-application/", "fetch failed"],
  ["https://www.khba.ca/calendar/list/", "fetch failed"],
  ["https://www.khba.ca/", "fetch failed"],
  [
    "https://oca.ca/app/uploads/2026/01/2026-Exhibitors-Package-Nov-2025.pdf",
    "HTTP 404",
  ],
  ["https://condoconference.ca/home/", "HTTP 404"],
  ["https://condoconference.ca/about/", "HTTP 404"],
  ["https://condoconference.ca/contact/", "HTTP 404"],
  ["https://www.ohba.ca/contact-us/", "HTTP 404"],
]);

for (const record of records) {
  for (const source of record.sources) {
    const failure = inaccessibleSources.get(source.url);
    source.accessStatus = failure
      ? "INACCESSIBLE_2026_07_28"
      : "RESOLVED_2026_07_28";
    source.accessNote = failure
      ? `${failure} during the full-corpus live resolution pass; retained as dated source evidence and explicitly flagged for reverification before outreach.`
      : "Resolved during the full-corpus live resolution pass.";
  }
  const inaccessibleRecordSources = record.sources.filter(
    (source) => source.accessStatus === "INACCESSIBLE_2026_07_28",
  );
  if (inaccessibleRecordSources.length > 0) {
    const existingGaps = Array.isArray(record.verification.researchGaps)
      ? record.verification.researchGaps
      : record.verification.researchGaps
        ? [record.verification.researchGaps]
        : [];
    record.verification.researchGaps = [
      ...existingGaps,
      `Reverify inaccessible source URL(s) before outreach: ${inaccessibleRecordSources.map((source) => source.url).join(", ")}`,
    ];
  }
}

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

const counts = (values) =>
  Object.fromEntries(
    [...new Set(values)]
      .sort()
      .map((value) => [value, values.filter((candidate) => candidate === value).length]),
  );

const list = (value) =>
  Array.isArray(value) ? value : value === undefined || value === null || value === "" ? [] : [value];
const contact = (record) => record.contacts?.[0] ?? {};
const csvValue = (value) => {
  const normalized = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${normalized.replaceAll('"', '""')}"`;
};

const canonicalJson = `${JSON.stringify(records, null, 2)}\n`;

const csvColumns = [
  ["researchId", (record) => record.researchId],
  ["organizationName", (record) => record.organizationName],
  ["opportunityName", (record) => record.opportunityName],
  ["lane", laneFor],
  ["primaryType", (record) => record.primaryType],
  ["secondaryTags", (record) => record.secondaryTags],
  ["city", (record) => record.location?.city],
  ["province", (record) => record.location?.province],
  ["country", (record) => record.location?.country],
  ["format", (record) => record.location?.format],
  ["nextDate", (record) => record.timing?.nextDate],
  ["cadence", (record) => record.timing?.cadence],
  ["speakerDeadline", (record) => record.timing?.speakerDeadline],
  ["speakingAccessClass", (record) => record.program?.speakingAccessClass],
  ["speakingMechanism", (record) => record.program?.speakingMechanism],
  ["contactName", (record) => contact(record).name],
  ["contactRole", (record) => contact(record).role],
  ["contactEmail", (record) => contact(record).email],
  ["contactPhone", (record) => contact(record).phone],
  ["contactFormUrl", (record) => contact(record).contactFormUrl],
  ["totalScore", (record) => record.qualification?.totalScore],
  ["tier", (record) => record.qualification?.tier],
  ["specificHook", (record) => record.personalization?.specificHook],
  ["bestTalkTitle", (record) => record.personalization?.bestTalkTitle],
  ["primaryCTA", (record) => record.personalization?.primaryCTA],
  ["recommendedFirstChannel", (record) => record.personalization?.recommendedFirstChannel],
  ["recommendedNextAction", (record) => record.personalization?.recommendedNextAction],
  ["canonicalUrl", (record) => record.canonicalUrl],
  ["sourceUrls", (record) => record.sources?.map((source) => source.url)],
  ["verifiedOn", (record) => record.verification?.verifiedOn],
  ["duplicateCheck", (record) => record.verification?.duplicateCheck],
];

const canonicalCsv = [
  csvColumns.map(([column]) => csvValue(column)).join(","),
  ...records.map((record) =>
    csvColumns.map(([, getter]) => csvValue(getter(record))).join(","),
  ),
].join("\n") + "\n";

const scoreSorted = [...records].sort(
  (left, right) =>
    right.qualification.totalScore - left.qualification.totalScore ||
    left.researchId.localeCompare(right.researchId),
);

const reportLines = [
  "# FairLend speaker opportunity corpus",
  "",
  "Generated: 2026-07-28",
  "",
  "Purpose: a current, evidence-backed, net-new speaker pipeline for Elie covering builders, investors, brokers, real-estate agents, short-term-rental operators, and adjacent professionals. Research only; no outreach or CRM mutation was performed.",
  "",
  "## Reconciliation summary",
  "",
  "| Lane | Qualified opportunities |",
  "| --- | ---: |",
  ...Object.entries(counts(records.map(laneFor))).map(
    ([lane, count]) => `| ${lane} | ${count} |`,
  ),
  `| **Total** | **${records.length}** |`,
  "",
  "## Top 30 speaking opportunities",
  "",
  "| Rank | ID | Opportunity | Type | Location | Access | Score | Recommended talk |",
  "| ---: | --- | --- | --- | --- | --- | ---: | --- |",
  ...scoreSorted.slice(0, 30).map(
    (record, index) =>
      `| ${index + 1} | ${record.researchId} | ${record.opportunityName} | ${record.primaryType} | ${[record.location?.city, record.location?.province].filter(Boolean).join(", ")} | ${record.program?.speakingAccessClass} | ${record.qualification?.totalScore} | ${record.personalization?.bestTalkTitle} |`,
  ),
  "",
  "## Complete opportunity dossiers",
  "",
];

for (const record of records) {
  reportLines.push(
    `## ${record.researchId} — ${record.opportunityName}`,
    "",
    `- Organization: ${record.organizationName}`,
    `- Lane / type: ${laneFor(record)} / ${record.primaryType}`,
    `- Score / tier: ${record.qualification.totalScore} / ${record.qualification.tier}`,
    `- Location / format: ${[record.location?.city, record.location?.province, record.location?.country].filter(Boolean).join(", ")} / ${record.location?.format}`,
    `- Timing: next date ${record.timing?.nextDate || "not published"}; cadence ${record.timing?.cadence || "not published"}; speaker deadline ${record.timing?.speakerDeadline || "not published"}`,
    `- Audience: ${(record.audience?.primarySegments ?? []).join(", ")}`,
    `- Audience evidence: ${record.audience?.fitEvidence}`,
    `- Speaking access: ${record.program?.speakingAccessClass} — ${record.program?.speakingMechanism}`,
    `- Program evidence: ${record.program?.formatEvidence}`,
    `- Contact route: ${[contact(record).name, contact(record).role, contact(record).email, contact(record).phone, contact(record).contactFormUrl].filter(Boolean).join(" · ")}`,
    `- Personalized hook: ${record.personalization?.specificHook}`,
    `- Why now: ${record.personalization?.whyNow}`,
    `- Openness signals: ${list(record.personalization?.opennessSignals).join("; ")}`,
    `- Recommended talk: ${record.personalization?.bestTalkTitle}`,
    `- Talk promise: ${record.personalization?.talkPromise}`,
    `- Front-loaded educational value: ${list(record.personalization?.frontLoadedValue).join("; ")}`,
    `- Audience takeaway: ${record.personalization?.audienceTakeaway}`,
    `- DrawFlow bridge: ${record.personalization?.drawFlowBridge}`,
    `- Proposed offer / format: ${record.personalization?.proposedOffer} / ${record.personalization?.recommendedFormat}`,
    `- CTA: ${record.personalization?.primaryCTA}`,
    `- Likely objections: ${list(record.personalization?.likelyObjections).join("; ")}`,
    `- Objection responses: ${list(record.personalization?.objectionResponses).join("; ")}`,
    `- First channel / next action: ${record.personalization?.recommendedFirstChannel} / ${record.personalization?.recommendedNextAction}`,
    `- Verification: ${record.verification?.activityStatus}; verified ${record.verification?.verifiedOn}; duplicate check ${record.verification?.duplicateCheck}`,
    `- Research gaps: ${list(record.verification?.researchGaps).join("; ") || "None recorded"}`,
    "",
    "Sources:",
    "",
    ...(record.sources ?? []).map(
      (source) =>
        `- [${source.title || source.publisher}](${source.url}) — ${source.sourceType}; ${source.underlyingDate}; verified ${source.verifiedOn}; access ${source.accessStatus}. ${source.proves} ${source.accessNote}`,
    ),
    "",
  );
}

const canonicalMarkdown = `${reportLines.join("\n")}\n`;

const sourceUrls = records.flatMap((record) =>
  record.sources.map((source) => source.url),
);
const reconciliation = {
  generatedOn: "2026-07-28",
  totalQualified: records.length,
  categoryCounts: counts(records.map(laneFor)),
  primaryTypeCounts: counts(records.map((record) => record.primaryType)),
  tierCounts: counts(records.map((record) => record.qualification.tier)),
  accessClassCounts: counts(
    records.map((record) => record.program.speakingAccessClass),
  ),
  uniqueOpportunitySeries: new Set(
    records.map((record) => record.opportunitySeriesKey),
  ).size,
  uniqueEventOccurrences: new Set(
    records.map((record) => record.eventOccurrenceKey),
  ).size,
  distinctOrganizations: new Set(records.map((record) => record.organizationKey))
    .size,
  sourceCount: sourceUrls.length,
  uniqueSourceUrls: new Set(sourceUrls).size,
  resolvedSourceUrls: new Set(sourceUrls).size - inaccessibleSources.size,
  explicitlyInaccessibleSourceUrls: inaccessibleSources.size,
  crmSnapshotCount: 181,
  sourceControlledExclusionRecords: 260,
  sourceControlledExclusionNames: 260,
  withinCorpusDuplicateSeries:
    records.length -
    new Set(records.map((record) => record.opportunitySeriesKey)).size,
  withinCorpusDuplicateOccurrences:
    records.length -
    new Set(records.map((record) => record.eventOccurrenceKey)).size,
  sourceControlledCollisions: 0,
  files: [
    "fairlend-speaker-opportunities-2026-07-28.json",
    "fairlend-speaker-opportunities-2026-07-28.csv",
    "fairlend-speaker-opportunities-2026-07-28.md",
    "fairlend-speaker-opportunities-rejections-watchlist-2026-07-28.md",
  ],
};
const reconciliationJson = `${JSON.stringify(reconciliation, null, 2)}\n`;

const workingNotes = [
  "investor-lanes.md",
  "builder-lanes.md",
  "events-adjacent.md",
].map((file) => fs.readFileSync(path.join(workingDirectory, file), "utf8").trim());
const rejectionsMarkdown = [
  "# FairLend speaker opportunity rejections and watchlist",
  "",
  "Generated: 2026-07-28",
  "",
  "These working logs preserve rejected, deferred, ambiguous, and watchlist candidates considered during the three-lane research pass. Qualified records are canonical only in the final corpus artifacts.",
  "",
  ...workingNotes,
  "",
].join("\n\n");

const outputs = {
  json: canonicalJson,
  csv: canonicalCsv,
  markdown: canonicalMarkdown,
  reconciliation: reconciliationJson,
  rejections: rejectionsMarkdown,
};

const requestedOutput = process.argv[2];
if (!Object.hasOwn(outputs, requestedOutput)) {
  console.error(
    `Usage: node ${path.relative(repositoryRoot, process.argv[1])} <${Object.keys(outputs).join("|")}>`,
  );
  process.exit(1);
}

process.stdout.write(outputs[requestedOutput]);
