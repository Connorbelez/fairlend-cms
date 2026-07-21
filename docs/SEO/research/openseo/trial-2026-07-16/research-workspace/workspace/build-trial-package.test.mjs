import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const workspace = dirname(fileURLToPath(import.meta.url));
const outputDirectory =
  "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/trial-2026-07-16/deliverables";

const requiredFiles = [
  "README.md",
  "ai-discovery-coverage.csv",
  "ai-question-opportunities.csv",
  "case-study-evidence-template.md",
  "claims-and-compliance-register.csv",
  "competitor-landscape.csv",
  "evidence-acquisition-register.csv",
  "executive-strategy.md",
  "existing-url-dispositions.csv",
  "full-scale-research-estimate.md",
  "keyword-clusters.csv",
  "keyword-universe.csv",
  "methodology-and-limitations.md",
  "mutation-audit.md",
  "opportunity-scenarios.csv",
  "page-opportunities.csv",
  "research-package.json",
  "run-manifest.json",
  "score-rationale.csv",
  "serp-evidence.csv",
  "success-gates.csv",
  "greenfield-page-map.md",
];
const requiredDirectories = ["content-briefs", "research-slices"];

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

test("the live trial generator emits a complete contract-valid handoff", async () => {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, "stale-sentinel.tmp"), "must be removed\n", "utf8");
  const { stdout } = await execFileAsync(process.execPath, [join(workspace, "build-trial-package.mjs")]);
  const summary = JSON.parse(stdout);

  assert.equal(summary.outputDirectory, outputDirectory);
  assert.equal(summary.spent, 0.43244);
  assert.equal(summary.remaining, 0.44756);
  assert.deepEqual(summary.counts, {
    sources: 67,
    keywords: 46,
    clusters: 12,
    serpEvidence: 8,
    competitors: 15,
    pages: 12,
    questions: 30,
    claims: 13,
    briefs: 12,
    spendEvents: 9,
  });

  const emittedFiles = await readdir(outputDirectory);
  assert.deepEqual(
    [...emittedFiles].sort(),
    [...requiredFiles, ...requiredDirectories].sort(),
    "generated package must have the exact declared top-level artifact set",
  );

  const briefs = (await readdir(join(outputDirectory, "content-briefs"))).filter((file) =>
    file.endsWith(".md"),
  );
  const slices = (await readdir(join(outputDirectory, "research-slices"))).filter((file) =>
    file.endsWith(".md"),
  );
  assert.equal(briefs.length, 12);
  assert.equal(slices.length, 4);

  await execFileAsync(process.execPath, [
    join(workspace, "validate-research-package.mjs"),
    join(outputDirectory, "research-package.json"),
  ]);
});

test("the public manifest reconciles the provider balance and normalized spend ledger", async () => {
  const manifest = await readJson(join(outputDirectory, "run-manifest.json"));
  const researchPackage = await readJson(join(outputDirectory, "research-package.json"));
  const operationalLedger = await readJson(join(workspace, "run", "spend-ledger.json"));
  const budgetPlan = await readJson(join(workspace, "run", "budget-plan.json"));
  const disclosedSpend = researchPackage.spendEvents.reduce(
    (total, event) => total + (event.actualCost ?? 0),
    0,
  );
  const committedSpend = researchPackage.spendEvents.reduce(
    (total, event) => total + (event.actualCost ?? event.estimatedCost),
    0,
  );
  const balanceDelta =
    manifest.budget.startingProviderBalance - manifest.budget.endingProviderBalance;

  assert.equal(Number(disclosedSpend.toFixed(5)), 0.43244);
  assert.equal(Number(committedSpend.toFixed(5)), 0.45244);
  assert.equal(Number(balanceDelta.toFixed(5)), 0.43244);
  assert.equal(manifest.budget.spent, 0.43244);
  assert.equal(manifest.budget.committed, 0.45244);
  assert.equal(manifest.budget.hardCeilingRemaining, 0.44756);
  assert.ok(
    manifest.tools.some(
      (tool) => tool.name === "DataForSEO API" && tool.version === "v3",
    ),
    "run manifest must inventory the live DataForSEO provider and version",
  );
  assert.ok(manifest.budget.spent <= manifest.budget.hardCeiling);
  assert.ok(manifest.budget.endingProviderBalance >= manifest.budget.externalReserve);
  assert.equal(researchPackage.spendEvents.length, 9);
  assert.equal(operationalLedger.length, 9);
  assert.deepEqual(manifest.paidOperations, researchPackage.spendEvents);
  assert.equal(
    Number(
      operationalLedger.reduce((total, event) => total + (event.actualCost ?? 0), 0).toFixed(5),
    ),
    0.43244,
  );

  const expectedOperationalMappings = [
    ["spend-tracer-initial", "75967d89-c6e4-4e15-853a-049c750b3df3"],
    ["spend-tracer-retry", "fbc804d3-2225-45af-8986-5cc9aa6b665c"],
    ["spend-five-plus-expansion", "d6e987e0-4b99-4691-bca5-832d74047456"],
    ["spend-garden-expansion", "f50339c6-0dd4-41d8-aa1e-4ef3899f6770"],
    ["spend-drawflow-expansion", "814d79ca-09f4-475c-8e6f-9be3905ed0e5"],
    ["spend-b2b-expansion", "e4008406-97f3-4d8f-a9be-0f4da99071ea"],
    ["spend-representative-serp-batch", "f2ffe459-eaf3-49fd-9fc4-e9bd35feee10"],
    ["spend-mli-competitors", "ec40ca38-587d-4926-8d2b-ea56ae185dca"],
    ["spend-serp-retry-failed", "dba68b0c-0c03-4e0e-978e-22bb40a7fd23"],
  ];
  const canonicalById = new Map(researchPackage.spendEvents.map((event) => [event.id, event]));
  const operationalById = new Map(operationalLedger.map((event) => [event.id, event]));
  for (const [canonicalId, operationalId] of expectedOperationalMappings) {
    const canonical = canonicalById.get(canonicalId);
    const operational = operationalById.get(operationalId);
    assert.ok(canonical, `missing canonical spend event ${canonicalId}`);
    assert.ok(operational, `missing operational spend event ${operationalId}`);
    assert.equal(canonical.workstream, operational.workstream);
    assert.equal(canonical.estimatedCost, operational.estimatedCost);
    assert.equal(canonical.actualCost, operational.actualCost);
    assert.equal(canonical.occurredAt, operational.finishedAt);
  }

  const chargedSerpBatches = researchPackage.spendEvents.filter(
    (event) => event.operation === "organic-live-advanced" && event.actualCost > 0,
  );
  assert.equal(chargedSerpBatches.length, 1);
  assert.equal(chargedSerpBatches[0].actualCost, 0.014);
  assert.equal(chargedSerpBatches[0].requestedRowCount, 4);
  assert.equal(chargedSerpBatches[0].returnedRowCount, 0);
  const undisclosedRetry = canonicalById.get("spend-serp-retry-failed");
  assert.equal(undisclosedRetry.actualCost, null);
  assert.equal(undisclosedRetry.estimatedCost, 0.02);

  assert.equal(
    Number(Object.values(budgetPlan.envelopes).reduce((total, value) => total + value, 0).toFixed(5)),
    0.9,
  );
  for (const [workstream, envelope] of Object.entries(budgetPlan.envelopes)) {
    const workstreamSpend = researchPackage.spendEvents
      .filter((event) => event.workstream === workstream)
      .reduce((total, event) => total + (event.actualCost ?? event.estimatedCost), 0);
    assert.ok(workstreamSpend <= envelope, `${workstream} spend exceeds its isolated envelope`);
  }
  assert.deepEqual(manifest.prohibitedMutations, []);
  assert.deepEqual(researchPackage.manifest.mutations, []);
});

test("README navigation resolves and every brief stays requirements-only", async () => {
  const readme = await readFile(join(outputDirectory, "README.md"), "utf8");
  const relativeLinks = [...readme.matchAll(/\[[^\]]+\]\((\.\/[^)]+)\)/g)].map(
    (match) => match[1],
  );
  assert.ok(relativeLinks.length >= requiredFiles.length - 1);

  for (const relativeLink of relativeLinks) {
    await stat(join(outputDirectory, relativeLink));
  }
  for (const file of requiredFiles.filter((file) => file !== "README.md")) {
    assert.ok(relativeLinks.includes(`./${file}`), `README does not link ${file}`);
  }

  const manifest = await readJson(join(outputDirectory, "run-manifest.json"));
  assert.deepEqual(
    manifest.artifactIndex.map((artifact) => artifact.relativePath).sort(),
    [...requiredFiles.filter((file) => file !== "README.md"), "README.md", ...requiredDirectories.map((directory) => `${directory}/`)].sort(),
  );

  for (const file of await readdir(join(outputDirectory, "content-briefs"))) {
    if (!file.endsWith(".md")) continue;
    const brief = await readFile(join(outputDirectory, "content-briefs", file), "utf8");
    assert.match(brief, /requirements-only research brief/);
    assert.match(brief, /REQUIREMENT:/);
    assert.match(brief, /QUESTION:/);
    assert.match(brief, /EVIDENCE:/);
    assert.match(brief, /not approved copy, a CMS payload, or an implementation diff/);
  }
});

test("decision-support artifacts expose the complete URL, score, AI, and scenario contracts", async () => {
  const researchPackage = await readJson(join(outputDirectory, "research-package.json"));
  const executive = await readFile(join(outputDirectory, "executive-strategy.md"), "utf8");
  const csvContracts = {
    "keyword-universe.csv": [
      "normalizedQuery",
      "seedConcept",
      "personaDetail",
      "personaTier",
      "trendSeasonality",
      "serpFeatures",
      "observedAt",
    ],
    "page-opportunities.csv": [
      "funnelStage",
      "personaDetail",
      "personaTier",
      "lifecycleStages",
      "intent",
      "localEvidence",
      "competitorEvidence",
      "aiQuestionIds",
      "cannibalizationDependencies",
      "sourceObservationRefs",
    ],
    "score-rationale.csv": [
      "recordType",
      "recordId",
      "leadCaptureScore",
      "authorityBuildScore",
      "model",
      "inputSummary",
      "evidenceCaps",
    ],
  };

  for (const [file, requiredHeaders] of Object.entries(csvContracts)) {
    const [header] = (await readFile(join(outputDirectory, file), "utf8")).trim().split("\n");
    const headers = header.split(",");
    for (const requiredHeader of requiredHeaders) {
      assert.ok(headers.includes(requiredHeader), `${file} missing ${requiredHeader}`);
    }
  }

  const keywordUniverse = await readFile(join(outputDirectory, "keyword-universe.csv"), "utf8");
  const liveTrendKeyword = researchPackage.keywords.find(
    (keyword) => keyword.metrics.dataStatus === "live" && keyword.metrics.trend.length > 0,
  );
  assert.ok(liveTrendKeyword, "expected at least one live keyword with trend evidence");
  const firstTrendPoint = liveTrendKeyword.metrics.trend[0];
  assert.match(
    keywordUniverse,
    new RegExp(
      `${firstTrendPoint.year}-${String(firstTrendPoint.month).padStart(2, "0")}:${firstTrendPoint.monthlySearches}`,
    ),
  );
  assert.doesNotMatch(keywordUniverse, /\[object Object\]/);

  const dispositions = await readFile(
    join(outputDirectory, "existing-url-dispositions.csv"),
    "utf8",
  );
  assert.equal(dispositions.trim().split("\n").length - 1, researchPackage.siteInventory.length);
  for (const inventoryRecord of researchPackage.siteInventory) {
    assert.match(dispositions, new RegExp(`(^|,)${inventoryRecord.id}(,|$)`, "m"));
  }

  const scoreRationale = await readFile(join(outputDirectory, "score-rationale.csv"), "utf8");
  assert.equal(
    scoreRationale.trim().split("\n").length - 1,
    researchPackage.keywords.length + researchPackage.pageOpportunities.length,
  );
  const rationaleById = new Map(
    scoreRationale
      .trim()
      .split("\n")
      .slice(1)
      .map((line) => {
        const [recordType, recordId, leadCaptureScore, authorityBuildScore] = line.split(",");
        return [recordId, { recordType, leadCaptureScore, authorityBuildScore }];
      }),
  );
  for (const keyword of researchPackage.keywords) {
    assert.deepEqual(rationaleById.get(keyword.id), {
      recordType: "keyword",
      leadCaptureScore: String(keyword.leadCaptureScore.total),
      authorityBuildScore: String(keyword.authorityBuildScore.total),
    });
  }
  for (const page of researchPackage.pageOpportunities) {
    assert.deepEqual(rationaleById.get(page.id), {
      recordType: "page-opportunity",
      leadCaptureScore: String(page.leadCaptureScore),
      authorityBuildScore: String(page.authorityBuildScore),
    });
  }

  const aiCoverage = await readFile(join(outputDirectory, "ai-discovery-coverage.csv"), "utf8");
  for (const surface of [
    "people-also-ask",
    "related-searches",
    "autocomplete",
    "reddit",
    "independent-forums",
    "youtube-video",
    "bing-question",
    "chatgpt-style-prompts",
    "ai-overview-style-serp",
  ]) {
    assert.match(aiCoverage, new RegExp(`(^|,)${surface}(,|$)`, "m"));
  }

  const scenarios = await readFile(join(outputDirectory, "opportunity-scenarios.csv"), "utf8");
  assert.equal(scenarios.trim().split("\n").length - 1, 5);
  assert.match(executive, /No scenario supplies a numerical click, lead, conversion, or revenue forecast/);
  const pageById = new Map(researchPackage.pageOpportunities.map((page) => [page.id, page]));
  const clusterById = new Map(researchPackage.clusters.map((cluster) => [cluster.id, cluster]));
  const distinctProposedUrls = new Set(
    researchPackage.pageOpportunities.map((page) => page.proposedUrl),
  );
  assert.equal(distinctProposedUrls.size, 9);
  assert.equal([...distinctProposedUrls].filter((url) => url !== "/").length, 8);
  for (const page of researchPackage.pageOpportunities.filter(
    (opportunity) => opportunity.urlDisposition === "proposed-new",
  )) {
    assert.ok(
      page.clusterIds.some(
        (clusterId) => clusterById.get(clusterId)?.pageBoundaryStatus === "validated-distinct",
      ),
      `${page.id} cannot receive a concrete new URL without a validated-distinct cluster`,
    );
  }
  const frontierRows = [
    [1, "Five-plus-unit multiplex construction and MLI Select financing", "opportunity-five-plus-mli-financing", "leadCaptureScore"],
    [2, "Builder construction financing and DrawFlow qualification", "opportunity-drawflow-builder-financing", "leadCaptureScore"],
    [3, "Garden and laneway-suite financing", "opportunity-garden-laneway-financing", "leadCaptureScore"],
    [4, "Mortgage-broker, realtor, and professional referrals", "opportunity-partner-referrals", "leadCaptureScore"],
    [5, "Stalled-project rescue", "opportunity-stalled-project-rescue", "leadCaptureScore"],
    [1, "MLI Select planning guide", "opportunity-mli-select-planning-guide", "authorityBuildScore"],
    [2, "Garden-suite feasibility guide", "opportunity-garden-suite-feasibility", "authorityBuildScore"],
    [3, "Suite rental comparison module", "opportunity-suite-rental-comparison", "authorityBuildScore"],
    [4, "Ontario construction draw guide", "opportunity-construction-draw-guide", "authorityBuildScore"],
    [5, "Partner referral page", "opportunity-partner-referrals", "authorityBuildScore"],
  ];
  for (const [priority, label, opportunityId, scoreField] of frontierRows) {
    const page = pageById.get(opportunityId);
    assert.ok(page, `missing frontier opportunity ${opportunityId}`);
    assert.ok(
      executive.includes(
        `| ${priority} | ${label} | ${page[scoreField]} | ${page.confidence} |`,
      ),
      `executive frontier row drifted for ${opportunityId}`,
    );
  }

  const expectedPublicSerpMappings = new Map([
    ["serp-public-multiplex", ["keyword-multiplex-construction-financing-toronto", "source-public-serp-multiplex"]],
    ["serp-public-garden", ["keyword-garden-suite-financing-toronto", "source-public-serp-garden"]],
    ["serp-public-draw", ["keyword-construction-draw-financing-ontario", "source-public-serp-draw"]],
    ["serp-public-partners", ["keyword-mortgage-broker-for-realtors-toronto", "source-public-serp-partners"]],
  ]);
  for (const [serpId, [queryId, sourceId]] of expectedPublicSerpMappings) {
    const serp = researchPackage.serpEvidence.find((record) => record.id === serpId);
    assert.ok(serp, `missing public SERP ${serpId}`);
    assert.equal(serp.queryId, queryId);
    assert.deepEqual(serp.sourceObservationRefs, [sourceId]);
  }
});
