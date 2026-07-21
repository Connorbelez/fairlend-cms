import assert from "node:assert/strict";
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  assertAllowedFreeMcpTool,
  computeBalanceDelta,
  extractDataForSeoAccount,
  resolveDisclosedActualCost,
  resolveApprovedRunRoot,
  resolveContainedPath,
  resolveTrialPath,
  unwrapMcpToolResult,
  withLedgerLock,
} from "./openseo-trial-cli.mjs";

const trialRunRoot = fileURLToPath(new URL("./run/", import.meta.url));

test("an explicit continuation run root overrides the default run without ambiguity", () => {
  const defaultRoot = "/tmp/openseo/default-run";
  assert.equal(resolveApprovedRunRoot(undefined, defaultRoot), defaultRoot);
  assert.equal(resolveApprovedRunRoot("  ", defaultRoot), defaultRoot);
  assert.equal(
    resolveApprovedRunRoot("continuation-run", defaultRoot),
    "/tmp/openseo/continuation-run",
  );
});

test("only the explicit free, read-only MCP tool allowlist is callable without the paid governor", () => {
  for (const tool of ["whoami", "list_projects", "list_saved_keywords", "get_rank_tracker"]) {
    assert.equal(assertAllowedFreeMcpTool(tool), tool);
  }

  for (const tool of [
    "save_keywords",
    "research_keywords",
    "get_serp_results",
    "run_site_audit",
    "unknown_tool",
    "",
  ]) {
    assert.throws(
      () => assertAllowedFreeMcpTool(tool),
      /not allowlisted as a free, read-only operation/,
    );
  }
});

test("path resolution accepts existing and future files contained by the approved real root", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "openseo-cli-root-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const nested = join(root, "raw");
  const existing = join(nested, "existing.json");
  await mkdir(nested);
  await writeFile(existing, "{}\n", "utf8");
  const canonicalRoot = await realpath(root);

  assert.equal(
    await resolveContainedPath(existing, { root, mustExist: true, label: "input" }),
    join(canonicalRoot, "raw", "existing.json"),
  );
  assert.equal(
    await resolveContainedPath(join(nested, "future", "result.json"), {
      root,
      label: "output",
    }),
    join(canonicalRoot, "raw", "future", "result.json"),
  );
});

test("path resolution rejects traversal and absolute paths outside the approved root", async (t) => {
  const parent = await mkdtemp(join(tmpdir(), "openseo-cli-boundary-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const root = join(parent, "run");
  const outside = join(parent, "outside");
  await mkdir(root);
  await mkdir(outside);

  await assert.rejects(
    resolveContainedPath(join(root, "..", "outside", "result.json"), {
      root,
      label: "output",
    }),
    /must remain inside approved run root/,
  );
  await assert.rejects(
    resolveContainedPath(join(outside, "result.json"), { root, label: "output" }),
    /must remain inside approved run root/,
  );
});

test("real-path containment rejects a symlinked parent that escapes the approved root", async (t) => {
  const parent = await mkdtemp(join(tmpdir(), "openseo-cli-symlink-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const root = join(parent, "run");
  const outside = join(parent, "outside");
  const escape = join(root, "escape");
  await mkdir(root);
  await mkdir(outside);
  await symlink(outside, escape, "dir");

  await assert.rejects(
    resolveContainedPath(join(escape, "result.json"), { root, label: "output" }),
    /must remain inside approved run root/,
  );
});

test("trial path roles prevent output writes from overwriting plan, ledger, or args", async () => {
  assert.match(
    await resolveTrialPath(join(trialRunRoot, "args", "tracer-keyword-metrics.json"), "args"),
    /run\/args\/tracer-keyword-metrics\.json$/,
  );
  assert.match(
    await resolveTrialPath(join(trialRunRoot, "raw", "future-result.json"), "raw-output"),
    /run\/raw\/future-result\.json$/,
  );
  assert.match(
    await resolveTrialPath(join(trialRunRoot, "budget-plan.json"), "budget-plan"),
    /run\/budget-plan\.json$/,
  );
  assert.match(
    await resolveTrialPath(join(trialRunRoot, "spend-ledger.json"), "spend-ledger"),
    /run\/spend-ledger\.json$/,
  );
  assert.match(
    await resolveTrialPath(join(trialRunRoot, "balance-review.json"), "balance-output"),
    /run\/balance-review\.json$/,
  );

  await assert.rejects(
    resolveTrialPath(join(trialRunRoot, "budget-plan.json"), "raw-output"),
    /must remain inside approved run root/,
  );
  await assert.rejects(
    resolveTrialPath(join(trialRunRoot, "spend-ledger.json"), "balance-output"),
    /must be a run\/balance-\*\.json snapshot file/,
  );
  await assert.rejects(
    resolveTrialPath(join(trialRunRoot, "raw", "representative-serps.json"), "args"),
    /must remain inside approved run root/,
  );
});

test("extractDataForSeoAccount returns only the auditable account fields", () => {
  const result = extractDataForSeoAccount({
    tasks: [
      {
        cost: 0,
        result: [
          {
            money: {
              balance: 0.9876,
              total: 1,
              statistics: {
                day: { total: 0.0124, total_serp: 0, total_dataforseo_labs: 0.0124 },
                minute: { total: 0.0124, total_serp: 0, total_dataforseo_labs: 0.0124 },
              },
            },
            price: {
              serp: { live: { advanced: { priority_normal: [{ cost_type: "per_request", cost: 0.002 }] } } },
              dataforseo_labs: {
                keyword_ideas: { live: { priority_normal: [{ cost_type: "per_request", cost: 0.012 }] } },
              },
            },
            login: "must-not-leak@example.com",
          },
        ],
      },
    ],
  });

  assert.deepEqual(result, {
    balance: 0.9876,
    total: 1,
    statistics: {
      day: { total: 0.0124, totalSerp: 0, totalDataForSeoLabs: 0.0124 },
      minute: { total: 0.0124, totalSerp: 0, totalDataForSeoLabs: 0.0124 },
    },
    price: {
      serpOrganicLiveAdvanced: [{ cost_type: "per_request", cost: 0.002 }],
      labsKeywordOverview: null,
      labsRelatedKeywords: null,
      labsKeywordSuggestions: null,
      labsKeywordIdeas: [{ cost_type: "per_request", cost: 0.012 }],
      labsSerpCompetitors: null,
    },
  });
  assert.doesNotMatch(JSON.stringify(result), /must-not-leak/);
});

test("balance delta is stable at currency precision and never negative", () => {
  assert.equal(computeBalanceDelta(1, 0.974999999), 0.025);
  assert.equal(computeBalanceDelta(0.9, 0.91), 0);
});

test("an unchanged immediate balance preserves the estimate unless a receipt confirms zero", () => {
  assert.equal(
    resolveDisclosedActualCost({ beforeBalance: 1, afterBalance: 1, receiptCost: null }),
    null,
  );
  assert.equal(
    resolveDisclosedActualCost({ beforeBalance: 1, afterBalance: 1, receiptCost: 0 }),
    0,
  );
  assert.equal(
    resolveDisclosedActualCost({ beforeBalance: 1, afterBalance: 0.988, receiptCost: null }),
    0.012,
  );
  assert.equal(
    resolveDisclosedActualCost({ beforeBalance: 1, afterBalance: 0.988, receiptCost: 0.01 }),
    0.012,
  );
  assert.throws(
    () => resolveDisclosedActualCost({ beforeBalance: 1, afterBalance: 1, receiptCost: -1 }),
    /receipt cost must be null or a non-negative finite number/,
  );
});

test("the cross-process ledger lock serializes concurrent paid-call critical sections", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "openseo-ledger-lock-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const ledgerPath = join(directory, "spend-ledger.json");
  let active = 0;
  let maximumActive = 0;
  const order = [];

  await Promise.all(
    ["first", "second", "third"].map((label) =>
      withLedgerLock(
        ledgerPath,
        async () => {
          active += 1;
          maximumActive = Math.max(maximumActive, active);
          order.push(`${label}:start`);
          await new Promise((resolve) => setTimeout(resolve, 20));
          order.push(`${label}:end`);
          active -= 1;
        },
        { timeoutMs: 2_000, retryMs: 5 },
      ),
    ),
  );

  assert.equal(maximumActive, 1);
  for (const label of ["first", "second", "third"]) {
    assert.ok(order.indexOf(`${label}:start`) < order.indexOf(`${label}:end`));
  }
});

test("unwrapMcpToolResult parses the structured result and rejects tool errors", () => {
  const parsed = unwrapMcpToolResult({
    jsonrpc: "2.0",
    id: 1,
    result: {
      content: [{ type: "text", text: '{"keywords":[{"keyword":"test"}]}' }],
      structuredContent: { keywords: [{ keyword: "test" }] },
    },
  });
  assert.deepEqual(parsed, { keywords: [{ keyword: "test" }] });

  assert.throws(
    () =>
      unwrapMcpToolResult({
        jsonrpc: "2.0",
        id: 2,
        result: { isError: true, content: [{ type: "text", text: "provider failed" }] },
      }),
    /provider failed/,
  );
});
