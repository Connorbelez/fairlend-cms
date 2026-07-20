import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const workspace = path.dirname(fileURLToPath(import.meta.url));
const validator = path.join(workspace, "validate-research-package.mjs");

function validateFixture(name) {
  return spawnSync(process.execPath, [validator, path.join(workspace, "fixtures", name)], {
    encoding: "utf8",
  });
}

function validateMutation(mutator) {
  const document = JSON.parse(
    fs.readFileSync(path.join(workspace, "fixtures", "valid-research-package.json"), "utf8"),
  );
  mutator(document);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fairlend-research-package-"));
  const fixture = path.join(directory, "fixture.json");
  fs.writeFileSync(fixture, JSON.stringify(document));
  return spawnSync(process.execPath, [validator, fixture], { encoding: "utf8" });
}

test("a complete requirements-only research package validates through the CLI", () => {
  const result = validateFixture("valid-research-package.json");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VALID fairlend-openseo-trial-fixture/);
});

test("a decision record without provenance is rejected with its record path", () => {
  const result = validateMutation((document) => {
    document.keywords[0].sourceObservationRefs = [];
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.sourceObservationRefs: expected at least 1 reference\(s\)/);
});

test("a score whose components do not equal its reported total is rejected", () => {
  const result = validateMutation((document) => {
    document.keywords[0].leadCaptureScore.intentUrgency = 21;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.leadCaptureScore\.total: expected 71 from component sum, received 70/);
});

test("a brief containing final marketing copy is rejected", () => {
  const result = validateMutation((document) => {
    document.briefs[0].finalCopy = "FairLend is the financing partner that guarantees your project succeeds.";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /briefs\[0\]\.finalCopy: prohibited content field/);
});

test("copy hidden under an arbitrary field is rejected by the closed record contract", () => {
  const result = validateMutation((document) => {
    document.briefs[0].salesNarrative = "FairLend gets every qualifying project funded from end to end.";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /briefs\[0\]\.salesNarrative: field is not allowed by the requirements-only contract/);
});

test("final prose in an allowed brief field is rejected without a requirement marker", () => {
  const result = validateMutation((document) => {
    document.briefs[0].sectionRequirements[0].headingRequirement =
      "Finance your multiplex from acquisition through takeout with FairLend.";
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /briefs\[0\]\.sectionRequirements\[0\]\.headingRequirement: requirements-only text must start with "REQUIREMENT: "/,
  );
});

test("a requirement marker cannot disguise promotional final copy", () => {
  const result = validateMutation((document) => {
    document.briefs[0].pagePurpose =
      "REQUIREMENT: Explain why FairLend is the best one-stop financing partner in Toronto.";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /briefs\[0\]\.pagePurpose: promotional\/final marketing prose is prohibited/);
});

test("a package granting CMS write access is rejected", () => {
  const result = validateMutation((document) => {
    document.manifest.authorization.cmsMode = "write";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /manifest\.authorization\.cmsMode: expected read-only, received write/);
});

test("the run manifest enforces the approved market, USD 0.90 ceiling, and spend reconciliation", () => {
  const result = validateMutation((document) => {
    document.manifest.market.country = "US";
    document.manifest.budget = {
      currency: "CAD",
      hardCeiling: 999,
      spent: -2,
      committed: 1000,
      remaining: 1,
    };
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /manifest\.market\.country: expected "CA"/);
  assert.match(result.stderr, /manifest\.budget\.currency: expected "USD"/);
  assert.match(result.stderr, /manifest\.budget\.hardCeiling: expected 0\.9/);
  assert.match(result.stderr, /manifest\.budget\.spent: expected a non-negative finite number/);
});

test("a safely estimated provider cost may remain undisclosed without inventing an actual charge", () => {
  const result = validateMutation((document) => {
    document.manifest.budget = {
      currency: "USD",
      hardCeiling: 0.9,
      spent: 0,
      committed: 0.1,
      remaining: 0.8,
    };
    document.spendEvents.push({
      id: "spend-undisclosed-returned-cost",
      provider: "DataForSEO",
      operation: "keyword-overview",
      providerTaskIds: ["provider-task-fixture"],
      workstream: "five-plus-unit-multiplex-mli-select",
      requestedRowCount: 10,
      returnedRowCount: 10,
      estimatedCost: 0.1,
      actualCost: null,
      currency: "USD",
      occurredAt: "2026-07-16T13:00:00-04:00",
      status: "returned",
      retryCount: 0,
      sourceObservationRefs: [],
    });
  });

  assert.equal(result.status, 0, result.stderr);
});

test("unstable identifiers and unapproved classification values are rejected", () => {
  const result = validateMutation((document) => {
    document.keywords[0].id = "Bad Keyword ID";
    document.keywords[0].funnelStage = "ready-to-buy-someday";
    document.keywords[0].confidence = "certain";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.id: expected a stable kebab-case identifier/);
  assert.match(result.stderr, /keywords\[0\]\.funnelStage: unapproved value "ready-to-buy-someday"/);
  assert.match(result.stderr, /keywords\[0\]\.confidence: unapproved value "certain"/);
});

test("unapproved personas and exclusion classifications are rejected", () => {
  const result = validateMutation((document) => {
    document.keywords[0].persona = "anyone-with-money";
    document.keywords[0].relevanceDisposition = "chase-volume";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.persona: unapproved value "anyone-with-money"/);
  assert.match(
    result.stderr,
    /keywords\[0\]\.relevanceDisposition: unapproved value "chase-volume"/,
  );
});

test("adjacent personas require an explicit detail and exclusion states stay coherent", () => {
  const result = validateMutation((document) => {
    document.keywords[0].persona = "adjacent-discovered-other";
    document.keywords[0].personaTier = "tier-1";
    document.keywords[0].personaDetail = null;
    document.keywords[0].relevanceDisposition = "exclude";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.personaTier: adjacent personas must use adjacent-discovered/);
  assert.match(result.stderr, /keywords\[0\]\.personaDetail: adjacent personas require a non-empty detail/);
  assert.match(
    result.stderr,
    /keywords\[0\]\.exclusionReason: include requires the qualified-fit reason/,
  );
});

test("approved seed personas are coupled to their approved tier", () => {
  const result = validateMutation((document) => {
    document.keywords[0].personaTier = "tier-2";
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /keywords\[0\]\.personaTier: build-to-hold-mli-select-developer must use tier-1/,
  );
});

test("funnel headline and stage must follow the approved research versus buying-signal split", () => {
  const result = validateMutation((document) => {
    document.keywords[0].funnelHeadline = "research";
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /keywords\[0\]\.funnelHeadline: financing-qualification must use buying-signal/,
  );
});

test("null, impossible, or timezone-free observation timestamps are rejected", () => {
  const result = validateMutation((document) => {
    document.sourceObservations[0].capturedAt = "2026-02-30T22:03:00-04:00";
    document.keywords[0].observedAt = "2026-07-16T12:00:00";
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /sourceObservations\[0\]\.capturedAt: expected an ISO 8601 timestamp with timezone/,
  );
  assert.match(
    result.stderr,
    /keywords\[0\]\.observedAt: expected an ISO 8601 timestamp with timezone/,
  );
});

test("source observations require non-empty locators, anchors, excerpts, and titles", () => {
  const result = validateMutation((document) => {
    document.sourceObservations[0].sourceTitle = null;
    document.sourceObservations[0].sourceLocator = "";
    document.sourceObservations[0].observationAnchor = null;
    document.sourceObservations[0].excerpt = " ";
  });

  assert.equal(result.status, 1);
  for (const field of ["sourceTitle", "sourceLocator", "observationAnchor", "excerpt"]) {
    assert.match(
      result.stderr,
      new RegExp(`sourceObservations\\[0\\]\\.${field}: expected a non-empty string`),
    );
  }
});

test("duplicate identifiers are rejected across the whole package", () => {
  const result = validateMutation((document) => {
    document.competitors[0].id = document.keywords[0].id;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /competitors\[0\]\.id: duplicate identifier also used at keywords\[0\]\.id/);
});

test("dangling cross-dataset references are rejected", () => {
  const result = validateMutation((document) => {
    document.keywords[0].clusterId = "cluster-does-not-exist";
    document.briefs[0].opportunityId = "opportunity-does-not-exist";
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.clusterId: unknown clusters id "cluster-does-not-exist"/);
  assert.match(
    result.stderr,
    /briefs\[0\]\.opportunityId: unknown pageOpportunities id "opportunity-does-not-exist"/,
  );
});

test("unknown source observations are rejected", () => {
  const result = validateMutation((document) => {
    document.claims[0].sourceObservationRefs = ["source-observation-missing"];
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /claims\[0\]\.sourceObservationRefs\[0\]: unknown sourceObservations id "source-observation-missing"/,
  );
});

test("score objects reject arbitrary components and component values above their approved maxima", () => {
  const result = validateMutation((document) => {
    document.keywords[0].leadCaptureScore.magic = 1;
    document.keywords[0].leadCaptureScore.intentUrgency = 26;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.leadCaptureScore\.magic: unapproved score component/);
  assert.match(
    result.stderr,
    /keywords\[0\]\.leadCaptureScore\.intentUrgency: expected a finite number from 0 to 25/,
  );
});

test("page-opportunity summary scores must stay within zero and one hundred", () => {
  const result = validateMutation((document) => {
    document.pageOpportunities[0].leadCaptureScore = 999;
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /pageOpportunities\[0\]\.leadCaptureScore: expected a finite number from 0 to 100/,
  );
});

test("a record missing a required contract field is rejected", () => {
  const result = validateMutation((document) => {
    delete document.keywords[0].query;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.query: required field is missing/);
});

test("page opportunities require funnel stage and qualification expectations", () => {
  const result = validateMutation((document) => {
    delete document.pageOpportunities[0].funnelStage;
    delete document.pageOpportunities[0].qualificationExpectations;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /pageOpportunities\[0\]\.funnelStage: required field is missing/);
  assert.match(
    result.stderr,
    /pageOpportunities\[0\]\.qualificationExpectations: required field is missing/,
  );
});

test("page-opportunity qualification expectations must be a non-empty list of statements", () => {
  const result = validateMutation((document) => {
    document.pageOpportunities[0].qualificationExpectations = [];
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /pageOpportunities\[0\]\.qualificationExpectations: expected a non-empty array of non-empty strings/,
  );
});

test("nulls are rejected for required primitive string fields", () => {
  const result = validateMutation((document) => {
    document.keywords[0].query = null;
    document.competitors[0].name = null;
    document.auditFindings[0].finding = null;
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.query: expected a non-empty string/);
  assert.match(result.stderr, /competitors\[0\]\.name: expected a non-empty string/);
  assert.match(result.stderr, /auditFindings\[0\]\.finding: expected a non-empty string/);
});

test("numeric strings are not coerced into keyword metrics or spend numbers", () => {
  const result = validateMutation((document) => {
    document.keywords[0].metrics.monthlySearches = "1600";
    document.keywords[0].metrics.cpc = "10.25";
    document.spendEvents.push({
      id: "spend-numeric-string-regression",
      provider: "DataForSEO",
      operation: "keyword-overview",
      providerTaskIds: [],
      workstream: "tracer",
      requestedRowCount: "1",
      returnedRowCount: 0,
      estimatedCost: "0.012",
      actualCost: null,
      currency: "USD",
      occurredAt: "2026-07-16T13:00:00-04:00",
      status: "failed",
      retryCount: 0,
      sourceObservationRefs: [],
    });
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.metrics\.monthlySearches: expected a finite integer/);
  assert.match(result.stderr, /keywords\[0\]\.metrics\.cpc: expected a finite number/);
  assert.match(result.stderr, /spendEvents\[0\]\.requestedRowCount: expected a finite integer/);
  assert.match(result.stderr, /spendEvents\[0\]\.estimatedCost: expected a finite number/);
});

test("keyword normalization and trend periods remain deterministic", () => {
  const result = validateMutation((document) => {
    document.keywords[0].query = "MLI   Select";
    document.keywords[0].normalizedQuery = "MLI Select";
    document.keywords[0].metrics.trend = [
      { year: 2026, month: 6, monthlySearches: 10 },
      { year: 2026, month: 6, monthlySearches: 20 },
    ];
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /keywords\[0\]\.normalizedQuery: expected normalized query "mli select" from query/,
  );
  assert.match(
    result.stderr,
    /keywords\[0\]\.metrics\.trend\[1\]: duplicate year\/month period 2026-6/,
  );
});

test("bogus nested arrays and array members are rejected instead of passing structural checks", () => {
  const result = validateMutation((document) => {
    document.keywords[0].metrics.trend = ["not-a-trend-record"];
    document.keywords[0].serpFeatures = [42];
    document.serpEvidence[0].resultUrls = [42];
    document.aiQuestions[0].requiredEvidence = [null];
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /keywords\[0\]\.metrics\.trend\[0\]: expected an object/);
  assert.match(result.stderr, /keywords\[0\]\.serpFeatures\[0\]: expected a non-empty string/);
  assert.match(result.stderr, /serpEvidence\[0\]\.resultUrls\[0\]: expected a non-empty string/);
  assert.match(result.stderr, /aiQuestions\[0\]\.requiredEvidence\[0\]: expected a non-empty string/);
});

test("bogus canonical collection members produce validation errors without crashing the CLI", () => {
  const result = validateMutation((document) => {
    document.keywords[0] = null;
    document.sourceObservations[0] = "not-a-record";
  });

  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stderr, /TypeError|Cannot read properties/);
  assert.match(result.stderr, /keywords\[0\]: expected an object/);
  assert.match(result.stderr, /sourceObservations\[0\]: expected an object/);
});

test("AI opportunities must be actual questions ending with a question mark", () => {
  const result = validateMutation((document) => {
    document.aiQuestions[0].question = "Construction financing requirements for five units";
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /aiQuestions\[0\]\.question: expected an interrogative question ending with \?/,
  );
});

test("AI questions cannot claim volume in the requirements-only trial", () => {
  const result = validateMutation((document) => {
    document.aiQuestions[0].volumeClaimed = true;
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /aiQuestions\[0\]\.volumeClaimed: requirements-only trial questions must use false/,
  );
  assert.match(
    result.stderr,
    /aiQuestions\[0\]\.volumeClaimed: no exact normalized live keyword query supports a volume claim/,
  );
});

test("public search observations use truthful status, unknown device, and public-SERP provenance", () => {
  const validResult = validateMutation((document) => {
    document.sourceObservations[3].sourceType = "public-serp";
    document.sourceObservations[3].sourceLocator = "https://www.google.ca/search?q=multiplex+financing";
    document.serpEvidence[0].dataStatus = "public-search-observed";
    document.serpEvidence[0].location =
      "not-exposed; query target Toronto, Ontario, Canada";
    document.serpEvidence[0].device = "unknown";
    document.serpEvidence[0].resultUrls = ["https://example.com/multiplex-financing"];
    document.serpEvidence[0].features = ["organic-result"];
  });
  assert.equal(validResult.status, 0, validResult.stderr);

  const mislabeledResult = validateMutation((document) => {
    document.sourceObservations[3].sourceType = "public-serp";
    document.serpEvidence[0].dataStatus = "public-search-observed";
    document.serpEvidence[0].location =
      "not-exposed; query target Toronto, Ontario, Canada";
    document.serpEvidence[0].device = "desktop";
    document.serpEvidence[0].resultUrls = ["https://example.com/multiplex-financing"];
  });
  assert.equal(mislabeledResult.status, 1);
  assert.match(
    mislabeledResult.stderr,
    /serpEvidence\[0\]\.device: public-search-observed evidence must use unknown/,
  );
});

test("operational spend workstreams are allowed only in the spend ledger", () => {
  const validResult = validateMutation((document) => {
    document.spendEvents.push(
      {
        id: "spend-tracer-regression",
        provider: "DataForSEO",
        operation: "keyword-overview",
        providerTaskIds: [],
        workstream: "tracer",
        requestedRowCount: 1,
        returnedRowCount: 0,
        estimatedCost: 0,
        actualCost: 0,
        currency: "USD",
        occurredAt: "2026-07-16T13:00:00-04:00",
        status: "returned",
        retryCount: 0,
        sourceObservationRefs: [],
      },
      {
        id: "spend-verification-reserve-regression",
        provider: "DataForSEO",
        operation: "serp-verification-reserve",
        providerTaskIds: [],
        workstream: "verification-reserve",
        requestedRowCount: 0,
        returnedRowCount: 0,
        estimatedCost: 0,
        actualCost: 0,
        currency: "USD",
        occurredAt: "2026-07-16T13:01:00-04:00",
        status: "cancelled",
        retryCount: 0,
        sourceObservationRefs: [],
      },
    );
  });
  assert.equal(validResult.status, 0, validResult.stderr);

  const clusterResult = validateMutation((document) => {
    document.clusters[0].workstream = "tracer";
  });
  assert.equal(clusterResult.status, 1);
  assert.match(clusterResult.stderr, /clusters\[0\]\.workstream: unapproved value "tracer"/);
});

test("methodology skills are an explicit source type with resolvable locator syntax", () => {
  const result = validateMutation((document) => {
    document.sourceObservations[3].sourceType = "methodology-skill";
    document.sourceObservations[3].sourceLocator = "skill://notfair-seo/1.9.6";
  });

  assert.equal(result.status, 0, result.stderr);
});
