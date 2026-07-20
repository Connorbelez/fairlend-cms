import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveConservativePaidCost,
  evaluatePaidCall,
  reconcileBudget,
  validateBudgetPlan,
} from "./budget-governor.mjs";

const plan = {
  currency: "USD",
  includedBalance: 1,
  hardCeiling: 0.9,
  externalReserve: 0.1,
  envelopes: {
    tracer: 0.05,
    "five-plus-unit-multiplex-mli-select": 0.2,
    "garden-laneway-suite-financing": 0.2,
    "drawflow-builder-financing": 0.2,
    "b2b-partner-referral": 0.1,
    "verification-reserve": 0.15,
  },
};

const expansionPlan = {
  currency: "USD",
  includedBalance: 0.56756,
  hardCeiling: 0.44756,
  externalReserve: 0.12,
  envelopes: {
    "expansion-higher-funnel": 0.44756,
  },
};

const returnedEvent = {
  id: "spend-returned",
  workstream: "five-plus-unit-multiplex-mli-select",
  endpoint: "openseo_research_keywords_labs",
  tool: "research_keywords",
  estimatedCost: 0.09,
  actualCost: 0.04,
};

const undisclosedEvent = {
  id: "spend-undisclosed",
  workstream: "verification-reserve",
  endpoint: "serp_organic_live_advanced",
  tool: "get_serp_results",
  estimatedCost: 0.02,
  actualCost: null,
};

const singleSerpArgs = {
  projectId: "project",
  queries: [{ keyword: "multiplex construction financing Toronto" }],
};

test("the approved envelope plan fits inside both the hard ceiling and included balance", () => {
  assert.deepEqual(validateBudgetPlan(plan), []);
});

test("the continuation plan preserves the account reserve and prior unresolved commitment", () => {
  assert.deepEqual(validateBudgetPlan(expansionPlan), []);
  assert.ok(
    Math.abs(
      expansionPlan.hardCeiling +
        expansionPlan.externalReserve -
        expansionPlan.includedBalance,
    ) < 1e-9,
  );
});

test("the continuation workstream authorizes only the governed expansion operations", () => {
  const cases = [
    {
      endpoint: "dataforseo_labs_google_keyword_overview",
      tool: "get_keyword_metrics",
      args: { keywords: ["garden suite cost Toronto"] },
      estimatedCost: 0.01212,
    },
    {
      endpoint: "openseo_research_keywords_labs",
      tool: "research_keywords",
      args: {
        seeds: [{ seed: "multiplex development feasibility" }],
        resultLimit: 150,
        includeClickstreamData: false,
      },
      estimatedCost: 0.09,
    },
    {
      endpoint: "serp_organic_live_advanced",
      tool: "get_serp_results",
      args: { queries: [{ keyword: "MLI Select requirements" }] },
      estimatedCost: 0.02,
    },
    {
      endpoint: "dataforseo_labs_google_serp_competitors",
      tool: "find_serp_competitors",
      args: { keywords: ["construction financing requirements Ontario"], limit: 30 },
      estimatedCost: 0.0156,
    },
  ];

  for (const operation of cases) {
    const result = evaluatePaidCall({
      plan: expansionPlan,
      ledger: [],
      workstream: "expansion-higher-funnel",
      ...operation,
    });
    assert.equal(result.status, "approved", result.reasons?.join("; "));
  }
});

test("a plan whose envelopes exceed the hard ceiling is rejected", () => {
  const invalid = structuredClone(plan);
  invalid.envelopes.tracer = 0.06;

  assert.match(validateBudgetPlan(invalid).join("\n"), /envelope total 0\.91 exceeds hard ceiling 0\.9/);
});

test("the catalog derives conservative costs for every paid operation used by the trial", () => {
  const cases = [
    {
      endpoint: "dataforseo_labs_google_keyword_overview",
      tool: "get_keyword_metrics",
      args: { keywords: ["construction financing", "garden suite", "MLI Select"] },
      expected: 0.01236,
    },
    {
      endpoint: "openseo_research_keywords_labs",
      tool: "research_keywords",
      args: {
        seeds: [{ seed: "multiplex financing" }, { seed: "MLI Select" }],
        resultLimit: 150,
        includeClickstreamData: false,
      },
      expected: 0.18,
    },
    {
      endpoint: "serp_organic_live_advanced",
      tool: "get_serp_results",
      args: { queries: Array.from({ length: 4 }, (_, index) => ({ keyword: `query ${index}` })) },
      expected: 0.08,
    },
    {
      endpoint: "dataforseo_labs_google_serp_competitors",
      tool: "find_serp_competitors",
      args: { keywords: ["MLI Select"], limit: 30 },
      expected: 0.0156,
    },
  ];

  for (const operation of cases) {
    const result = deriveConservativePaidCost(operation);
    assert.equal(result.status, "approved");
    assert.equal(result.cost, operation.expected);
  }
});

test("a catalogued endpoint-tool pair inside its authorized envelope is approved", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [returnedEvent],
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    args: singleSerpArgs,
    estimatedCost: 0.02,
  });

  assert.equal(result.status, "approved");
  assert.equal(result.catalogMinimumCost, 0.02);
  assert.equal(result.authoritativeEstimatedCost, 0.02);
  assert.equal(result.workstreamCommittedAfter, 0.02);
  assert.equal(result.totalCommittedAfter, 0.06);
});

test("an unknown endpoint fails closed even when the caller claims it is free", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "tracer",
    endpoint: "unknown-provider-operation",
    tool: "save_keywords",
    args: {},
    estimatedCost: 0,
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.authoritativeEstimatedCost, null);
  assert.match(result.reasons.join("\n"), /not allowlisted/);
});

test("a known endpoint paired with the wrong tool fails closed", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "save_keywords",
    args: singleSerpArgs,
    estimatedCost: 0.02,
  });

  assert.equal(result.status, "blocked");
  assert.match(result.reasons.join("\n"), /requires tool "get_serp_results"/);
});

test("an endpoint cannot borrow another workstream's isolated envelope", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "tracer",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    args: singleSerpArgs,
    estimatedCost: 0.02,
  });

  assert.equal(result.status, "blocked");
  assert.match(result.reasons.join("\n"), /not authorized for workstream "tracer"/);
});

test("an underestimated caller-supplied cost is rejected", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "tracer",
    endpoint: "dataforseo_labs_google_keyword_overview",
    tool: "get_keyword_metrics",
    args: { keywords: ["one", "two", "three"] },
    estimatedCost: 0.012,
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.catalogMinimumCost, 0.01236);
  assert.match(result.reasons.join("\n"), /caller estimate 0\.012 is below catalog-derived cost 0\.01236/);
});

test("a conservative caller estimate is retained instead of silently lowered to the catalog floor", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    args: singleSerpArgs,
    estimatedCost: 0.03,
  });

  assert.equal(result.status, "approved");
  assert.equal(result.catalogMinimumCost, 0.02);
  assert.equal(result.authoritativeEstimatedCost, 0.03);
  assert.equal(result.totalCommittedAfter, 0.03);
});

test("malformed operation args fail closed when cost cannot be safely derived", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [],
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    args: { queries: [] },
    estimatedCost: 0.02,
  });

  assert.equal(result.status, "blocked");
  assert.match(result.reasons.join("\n"), /cannot derive a conservative cost/);
});

test("a call that exceeds its isolated workstream envelope is blocked", () => {
  const result = evaluatePaidCall({
    plan,
    ledger: [undisclosedEvent],
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    args: { queries: Array.from({ length: 7 }, (_, index) => ({ keyword: `query ${index}` })) },
    estimatedCost: 0.14,
  });

  assert.equal(result.status, "blocked");
  assert.match(result.reasons.join("\n"), /workstream commitment 0\.16 exceeds envelope 0\.15/);
});

test("reconciliation reserves estimated cost when returned cost is undisclosed", () => {
  const result = reconcileBudget(plan, [returnedEvent, undisclosedEvent]);

  assert.equal(result.spent, 0.04);
  assert.equal(result.committed, 0.06);
  assert.equal(result.remaining, 0.84);
  assert.deepEqual(result.errors, []);
});

test("reconciliation rejects unknown endpoints, endpoint-tool mismatches, and sub-minimum estimates", () => {
  const invalidLedger = [
    {
      id: "unknown",
      workstream: "tracer",
      endpoint: "unknown",
      tool: "get_keyword_metrics",
      estimatedCost: 0,
      actualCost: null,
    },
    {
      id: "mismatch",
      workstream: "verification-reserve",
      endpoint: "serp_organic_live_advanced",
      tool: "save_keywords",
      estimatedCost: 0.02,
      actualCost: null,
    },
    {
      id: "under-minimum",
      workstream: "tracer",
      endpoint: "dataforseo_labs_google_keyword_overview",
      tool: "get_keyword_metrics",
      estimatedCost: 0.001,
      actualCost: null,
    },
  ];

  const result = reconcileBudget(plan, invalidLedger);
  assert.match(result.errors.join("\n"), /non-allowlisted paid endpoint "unknown"/);
  assert.match(result.errors.join("\n"), /requires tool "get_serp_results"/);
  assert.match(result.errors.join("\n"), /below catalog minimum 0\.01212/);
});

test("duplicate spend-event identifiers and over-ceiling ledgers are rejected", () => {
  const oversized = Array.from({ length: 19 }, (_, index) => ({
    id: index === 18 ? "duplicate" : `spend-${index}`,
    workstream: "verification-reserve",
    endpoint: "serp_organic_live_advanced",
    tool: "get_serp_results",
    estimatedCost: 0.05,
    actualCost: index === 17 ? null : 0.05,
  }));
  oversized.push({ ...oversized.at(-1), id: "duplicate" });

  const result = reconcileBudget(plan, oversized);

  assert.match(result.errors.join("\n"), /duplicate spend event id "duplicate"/);
  assert.match(result.errors.join("\n"), /committed cost 1 exceeds hard ceiling 0\.9/);
});
