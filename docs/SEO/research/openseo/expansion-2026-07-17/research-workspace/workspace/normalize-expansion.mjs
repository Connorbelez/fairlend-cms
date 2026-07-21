#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const workspaceRoot = resolve(
  "/Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-expansion-2026-07-17/workspace",
);
const runRoot = join(workspaceRoot, "run");
const rawRoot = join(runRoot, "raw");
const outputRoot = resolve(
  "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/expansion-2026-07-17/deliverables",
);

const discoveryFiles = [
  "01-multiplex-feasibility.json",
  "02-mli-requirements.json",
  "03-garden-suite-cost.json",
  "04-garden-suite-permits.json",
  "05-construction-financing-requirements.json",
  "06-construction-draw-schedule.json",
];
const exactArgsFile = join(runRoot, "args", "07-exact-longtail-metrics.json");
const exactRawFile = join(rawRoot, "07-exact-longtail-metrics.json");
const serpFiles = [
  "10-serp-garden-suite-cost.json",
  "11-serp-mli-requirements.json",
  "12-serp-draw-schedule.json",
];

const relevancePattern = /(?:multiplex|fourplex|fiveplex|5\s*unit|sixplex|6\s*plex|triplex|duplex|missing middle|development application|building permit|zoning|mli select|cmhc mli|garden suite|laneway suite|secondary suite|accessory dwelling|construction (?:loan|financ|mortgage|draw|budget|takeout|completion|interest|soft cost)|draw schedule|progress draw|reimbursement draw|milestone based|takeout financing|rental property conversion|builder (?:line of credit|working capital|financing)|project finance for contractors|modular|prefab|first time developer|stalled construction|bank declined construction)/i;
const exclusionPattern = /(?:\bottawa\b|\bedmonton\b|\bcalgary\b|\bvancouver\b|\balberta\b|\bcalifornia\b|\bmichigan\b|\btexas\b|\bflorida\b|\bnew york\b|\bcondos?\b|\bcondominium\b|\bchurch\b|\bhotel\b|\bhospital\b|\bequipment\b|\bjohn deere\b|\bauto\b|\bcar\b|\bfurniture\b|\broof financing\b|\bhearth construction\b)/i;

const clusterDefinitions = [
  {
    id: "mli-select-requirements",
    name: "MLI Select requirements, scoring, and takeout readiness",
    pattern: /mli select|cmhc mli/i,
    pageType: "Primary-source-backed program guide + eligibility checklist + scenario calculator",
    priority: "P1",
  },
  {
    id: "garden-suite-cost-feasibility",
    name: "Garden-suite cost, feasibility, permits, rent, and ROI",
    pattern: /garden suite|laneway suite|accessory dwelling|secondary suite/i,
    pageType: "Local feasibility guide + cost model + permit/source navigator",
    priority: "P1",
  },
  {
    id: "draw-schedule-cash-flow",
    name: "Construction draw schedules, cash-flow gaps, and DrawFlow",
    pattern: /draw schedule|construction draws?|progress draw|reimbursement draw|milestone based/i,
    pageType: "Explainer + worked schedule + downloadable template + comparison + video",
    priority: "P1",
  },
  {
    id: "municipal-permits-zoning",
    name: "Toronto/GTA permits, zoning, and development-application navigation",
    pattern: /development application|building permit|zoning|bylaw/i,
    pageType: "Municipal source navigator + step-by-step readiness checklist",
    priority: "P1",
  },
  {
    id: "multiplex-feasibility",
    name: "Multiplex feasibility, conversion, and 5+ unit boundary",
    pattern: /multiplex|fourplex|fiveplex|5\s*unit|sixplex|6\s*plex|triplex|duplex|missing middle/i,
    pageType: "Feasibility guide + property-screening checklist + 2–4 versus 5+ decision tree",
    priority: "P2",
  },
  {
    id: "modular-prefab-financing",
    name: "Modular/prefabricated construction financing",
    pattern: /modular|prefab/i,
    pageType: "Financing-readiness guide for off-site deposits and takeout compatibility",
    priority: "P2",
  },
  {
    id: "rental-conversion-takeout",
    name: "Rental conversion, stabilization, and construction-to-takeout planning",
    pattern: /rental property conversion|takeout|permanent loan|refinance/i,
    pageType: "End-to-end conversion and takeout roadmap",
    priority: "P2",
  },
  {
    id: "builder-capital-readiness",
    name: "Builder working capital and project-readiness",
    pattern: /builder|contractor|working capital|multiple projects|first time developer|stalled construction|bank declined/i,
    pageType: "Builder-readiness guide + document checklist + qualification pathway",
    priority: "P2",
  },
  {
    id: "construction-financing-readiness",
    name: "Construction-financing requirements and process",
    pattern: /construction|land and construction/i,
    pageType: "Requirements guide + budget/document checklist + financing process map",
    priority: "P2",
  },
];

function normalizeKeyword(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");
}

function slug(value) {
  return normalizeKeyword(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function finiteOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function clusterFor(keyword) {
  return (
    clusterDefinitions.find((cluster) => cluster.pattern.test(keyword)) ??
    clusterDefinitions.at(-1)
  );
}

function funnelFor(keyword, clusterId) {
  if (
    /(?:lender|near me|financing compan|rates?|apply|builder toronto|construction financing for|construction loan lender)/i.test(
      keyword,
    )
  ) {
    return "buying-signal";
  }
  if (
    /(?:what|how|can i|requirements?|permit|zoning|bylaw|cost|calculator|template|schedule|process|checklist|guide|soft costs?|interest reserve|contingency|size limit|missing middle|development application)/i.test(
      keyword,
    ) ||
    ["municipal-permits-zoning", "multiplex-feasibility"].includes(clusterId)
  ) {
    return "awareness-research";
  }
  return "feasibility-consideration";
}

function scoreKeyword(record) {
  const volume = record.searchVolume;
  const kd = record.keywordDifficulty;
  const demand =
    volume === null
      ? 5
      : volume >= 1000
        ? 25
        : volume >= 500
          ? 23
          : volume >= 100
            ? 20
            : volume >= 50
              ? 16
              : volume >= 20
                ? 12
                : volume >= 10
                  ? 8
                  : 3;
  const attainability =
    kd === null ? 6 : kd <= 5 ? 25 : kd <= 15 ? 20 : kd <= 30 ? 14 : kd <= 45 ? 8 : 3;
  const local = /toronto|ontario|mississauga|brampton|vaughan|markham|gta|canada/i.test(
    record.keyword,
  )
    ? 15
    : 7;
  const assetFit = /cost|requirements?|permit|zoning|bylaw|calculator|template|schedule|checklist|process|feasibility|how|can i/i.test(
    record.keyword,
  )
    ? 15
    : 9;
  const funnel = record.funnelStage === "buying-signal" ? 10 : 12;
  const strategic = record.priority === "P1" ? 13 : 10;
  return {
    total: Math.min(100, demand + attainability + local + assetFit + funnel + strategic),
    demand,
    attainability,
    local,
    assetFit,
    funnel,
    strategic,
  };
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join(" | ") : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

const discoveryByKeyword = new Map();
let rawDiscoveryRows = 0;
const discoveryRuns = [];
for (const filename of discoveryFiles) {
  const envelope = await readJson(join(rawRoot, filename));
  for (const result of envelope.data.results ?? []) {
    rawDiscoveryRows += result.rows?.length ?? 0;
    discoveryRuns.push({
      seed: result.seed,
      rowCount: result.rowCount,
      source: result.source,
      usedFallback: result.usedFallback,
      file: filename,
    });
    for (const row of result.rows ?? []) {
      const keyword = normalizeKeyword(row.keyword);
      if (!relevancePattern.test(keyword) || exclusionPattern.test(keyword)) continue;
      const existing = discoveryByKeyword.get(keyword);
      const candidate = {
        keyword,
        searchVolume: finiteOrNull(row.searchVolume),
        cpc: finiteOrNull(row.cpc),
        competition: finiteOrNull(row.competition),
        keywordDifficulty: finiteOrNull(row.keywordDifficulty),
        providerIntent: row.intent ?? null,
        trend: row.trend ?? [],
        sourceSeeds: [result.seed],
        sourceFiles: [filename],
      };
      if (!existing) {
        discoveryByKeyword.set(keyword, candidate);
      } else {
        existing.sourceSeeds = [...new Set([...existing.sourceSeeds, result.seed])];
        existing.sourceFiles = [...new Set([...existing.sourceFiles, filename])];
        for (const metric of ["searchVolume", "cpc", "competition", "keywordDifficulty"]) {
          if (existing[metric] === null && candidate[metric] !== null) existing[metric] = candidate[metric];
        }
        if (!existing.providerIntent && candidate.providerIntent) {
          existing.providerIntent = candidate.providerIntent;
        }
      }
    }
  }
}

const exactArgs = await readJson(exactArgsFile);
const exactEnvelope = await readJson(exactRawFile);
const exactByKeyword = new Map(
  (exactEnvelope.data.keywords ?? []).map((row) => [normalizeKeyword(row.keyword), row]),
);

const universe = new Map(discoveryByKeyword);
for (const requested of exactArgs.keywords) {
  const keyword = normalizeKeyword(requested);
  const exact = exactByKeyword.get(keyword);
  const existing = universe.get(keyword) ?? {
    keyword,
    searchVolume: null,
    cpc: null,
    competition: null,
    keywordDifficulty: null,
    providerIntent: null,
    trend: [],
    sourceSeeds: [],
    sourceFiles: [],
  };
  if (exact) {
    for (const metric of ["searchVolume", "cpc", "competition", "keywordDifficulty"]) {
      if (existing[metric] === null && Number.isFinite(exact[metric])) existing[metric] = exact[metric];
    }
    if (!existing.providerIntent && exact.intent) existing.providerIntent = exact.intent;
    existing.exactMetricsReturned = true;
    existing.sourceFiles = [...new Set([...existing.sourceFiles, basename(exactRawFile)])];
  } else {
    existing.exactMetricsReturned = false;
  }
  existing.exactPortfolioRequested = true;
  universe.set(keyword, existing);
}

const keywordRows = [...universe.values()].map((record) => {
  const cluster = clusterFor(record.keyword);
  const funnelStage = funnelFor(record.keyword, cluster.id);
  const metricsStatus =
    record.searchVolume !== null
      ? "numeric-discovery-metric"
      : record.exactMetricsReturned
        ? "exact-row-returned-volume-unavailable"
        : record.exactPortfolioRequested
          ? "exact-request-returned-no-row"
          : "volume-unavailable";
  const scored = {
    ...record,
    id: `keyword-${slug(record.keyword)}`,
    clusterId: cluster.id,
    clusterName: cluster.name,
    priority: cluster.priority,
    proposedPageType: cluster.pageType,
    funnelStage,
    metricsStatus,
    serpValidation:
      cluster.id === "garden-suite-cost-feasibility" ||
      cluster.id === "mli-select-requirements" ||
      cluster.id === "draw-schedule-cash-flow"
        ? "cluster-live-serp-observed"
        : "candidate-needs-live-serp",
  };
  const scores = scoreKeyword(scored);
  return {
    ...scored,
    opportunityScore: scores.total,
    scoreRationale: `demand:${scores.demand}; attainability:${scores.attainability}; local:${scores.local}; asset-fit:${scores.assetFit}; funnel:${scores.funnel}; strategic:${scores.strategic}`,
  };
});
keywordRows.sort(
  (a, b) =>
    b.opportunityScore - a.opportunityScore ||
    (b.searchVolume ?? -1) - (a.searchVolume ?? -1) ||
    a.keyword.localeCompare(b.keyword),
);

const serpRows = [];
for (const filename of serpFiles) {
  const envelope = await readJson(join(rawRoot, filename));
  for (const result of envelope.data.results ?? []) {
    for (const item of result.items ?? []) {
      serpRows.push({
        query: result.keyword,
        location: "Toronto, Ontario, Canada",
        language: "en",
        ok: result.ok,
        rank: item.rank ?? null,
        type: item.type ?? null,
        title: item.title ?? null,
        url: item.url ?? null,
        domain: item.domain ?? null,
        description: item.description ?? null,
        sourceFile: filename,
      });
    }
  }
}

const ledger = await readJson(join(runRoot, "spend-ledger.json"));
const spendRows = ledger.map((event) => ({
  id: event.id,
  startedAt: event.startedAt,
  finishedAt: event.finishedAt ?? null,
  endpoint: event.endpoint,
  tool: event.tool,
  status: event.status,
  estimatedCostUsd: event.estimatedCost,
  actualCostUsd: event.actualCost,
  providerBalanceBefore: event.providerBalanceBefore,
  providerBalanceAfter: event.providerBalanceAfter ?? null,
  reconciliationNote: event.reconciliationNote ?? null,
}));

const clusterRows = clusterDefinitions.map((cluster) => {
  const members = keywordRows.filter((row) => row.clusterId === cluster.id);
  const observed = members.filter((row) => row.searchVolume !== null);
  return {
    id: cluster.id,
    name: cluster.name,
    priority: cluster.priority,
    keywordCount: members.length,
    numericMetricCount: observed.length,
    volumeUnavailableCount: members.length - observed.length,
    highestObservedVolume: observed.length
      ? Math.max(...observed.map((row) => row.searchVolume))
      : null,
    highestObservedKeyword:
      observed.sort((a, b) => b.searchVolume - a.searchVolume)[0]?.keyword ?? null,
    liveSerpStatus: [
      "garden-suite-cost-feasibility",
      "mli-select-requirements",
      "draw-schedule-cash-flow",
    ].includes(cluster.id)
      ? "validated-on-one-representative-query"
      : "not-yet-validated",
    proposedPageType: cluster.pageType,
    funnelCoverage: [...new Set(members.map((row) => row.funnelStage))],
    boundaryDecision:
      cluster.id === "multiplex-feasibility"
        ? "Keep 2–4-unit municipal multiplex education separate from the 5+ unit MLI/takeout path; cross-link with a decision tree."
        : cluster.id === "garden-suite-cost-feasibility"
          ? "One Toronto cost/feasibility hub can support permits, ROI, rent, financing, and municipality-specific child resources without cloning city pages."
          : cluster.id === "draw-schedule-cash-flow"
            ? "Explain conventional draw mechanics first; introduce DrawFlow only at the cash-flow comparison and qualification stage."
            : "Confirm the final page boundary with a live SERP before content production.",
  };
});

const itemTypeCounts = Object.entries(
  serpRows.reduce((counts, row) => {
    counts[row.type] = (counts[row.type] ?? 0) + 1;
    return counts;
  }, {}),
)
  .map(([type, count]) => ({ type, count }))
  .sort((a, b) => b.count - a.count);

const organicDomains = Object.entries(
  serpRows
    .filter((row) => row.type === "organic" && row.domain)
    .reduce((counts, row) => {
      counts[row.domain] = (counts[row.domain] ?? 0) + 1;
      return counts;
    }, {}),
)
  .map(([domain, count]) => ({ domain, count }))
  .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));

const finalBalance = await readJson(join(runRoot, "balance-final.json"));
const actualSpend = Math.round(ledger.reduce((sum, event) => sum + event.actualCost, 0) * 1e6) / 1e6;
const summary = {
  generatedAt: new Date().toISOString(),
  market: { country: "Canada", language: "en", serpLocation: "Toronto, Ontario, Canada" },
  project: { id: "7a3d4821-d03c-4be6-aaba-293df92d8ca8", domain: "fairlend.ca" },
  scope: "Research/proposal only; no content production or external mutation.",
  discovery: {
    seeds: discoveryRuns.length,
    rawRows: rawDiscoveryRows,
    relevantDeduplicatedDiscoveryRows: discoveryByKeyword.size,
    exactKeywordsRequested: exactArgs.keywords.length,
    exactRowsReturned: exactByKeyword.size,
    normalizedUniverse: keywordRows.length,
    runs: discoveryRuns,
  },
  serp: {
    successfulQueries: 3,
    persistedItems: serpRows.length,
    itemTypeCounts,
    organicDomains,
    bulkCallOutputLost: true,
  },
  budget: {
    startingProviderBalance: 0.56756,
    hardCeiling: 0.44756,
    actualSpend,
    unusedHardCeiling: Math.round((0.44756 - actualSpend) * 1e6) / 1e6,
    endingProviderBalance: finalBalance.balance,
    protectedReserve: 0.12,
  },
  clusters: clusterRows,
  topOpportunities: keywordRows.slice(0, 30).map((row) => ({
    keyword: row.keyword,
    clusterId: row.clusterId,
    funnelStage: row.funnelStage,
    searchVolume: row.searchVolume,
    keywordDifficulty: row.keywordDifficulty,
    metricsStatus: row.metricsStatus,
    opportunityScore: row.opportunityScore,
  })),
  caveats: [
    "Discovery metrics are Canada-level; local relevance comes from exact local wording and Toronto SERP validation.",
    "Discovery calls used the keyword-ideas fallback and contain severe noise; only explicitly relevant rows were retained.",
    "Exact keyword metrics returned 29 of 102 requested rows and returned null search volume for all 29; absence or null is unavailable, not zero.",
    "Close variants are not additive. Observed search volume is directional and must not be summed into a traffic forecast.",
    "One paid four-query SERP call completed at the provider but its response was lost after caller exit 137; no unseen result is used.",
    "Opportunity scores are a prioritization heuristic, not a ranking, traffic, lead, or revenue forecast.",
  ],
};

await mkdir(outputRoot, { recursive: true });
await writeFile(
  join(outputRoot, "keyword-universe.csv"),
  `${toCsv(keywordRows, [
    "id",
    "keyword",
    "clusterId",
    "clusterName",
    "priority",
    "funnelStage",
    "providerIntent",
    "searchVolume",
    "keywordDifficulty",
    "cpc",
    "competition",
    "metricsStatus",
    "opportunityScore",
    "scoreRationale",
    "serpValidation",
    "proposedPageType",
    "sourceSeeds",
    "sourceFiles",
  ])}\n`,
);
await writeFile(
  join(outputRoot, "cluster-opportunities.csv"),
  `${toCsv(clusterRows, [
    "id",
    "name",
    "priority",
    "keywordCount",
    "numericMetricCount",
    "volumeUnavailableCount",
    "highestObservedKeyword",
    "highestObservedVolume",
    "liveSerpStatus",
    "funnelCoverage",
    "proposedPageType",
    "boundaryDecision",
  ])}\n`,
);
await writeFile(
  join(outputRoot, "serp-evidence.csv"),
  `${toCsv(serpRows, [
    "query",
    "location",
    "language",
    "ok",
    "rank",
    "type",
    "title",
    "url",
    "domain",
    "description",
    "sourceFile",
  ])}\n`,
);
await writeFile(
  join(outputRoot, "spend-ledger.csv"),
  `${toCsv(spendRows, [
    "id",
    "startedAt",
    "finishedAt",
    "endpoint",
    "tool",
    "status",
    "estimatedCostUsd",
    "actualCostUsd",
    "providerBalanceBefore",
    "providerBalanceAfter",
    "reconciliationNote",
  ])}\n`,
);
await writeFile(join(outputRoot, "research-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

process.stdout.write(
  `${JSON.stringify({
    outputRoot,
    rawDiscoveryRows,
    retainedDiscoveryRows: discoveryByKeyword.size,
    normalizedUniverse: keywordRows.length,
    exactRowsReturned: exactByKeyword.size,
    serpRows: serpRows.length,
    actualSpend,
  })}\n`,
);
