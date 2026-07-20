#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { lstat, mkdir, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { evaluatePaidCall, reconcileBudget } from "./budget-governor.mjs";

const OPEN_SEO_MCP_URL = process.env.OPEN_SEO_MCP_URL ?? "http://127.0.0.1:3001/mcp";
const DATAFORSEO_ACCOUNT_URL = "https://api.dataforseo.com/v3/appendix/user_data";
const DATAFORSEO_SERP_LOCATIONS_URL = "https://api.dataforseo.com/v3/serp/google/locations";
const PRECISION = 1_000_000;
const DEFAULT_RUN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "run");

export function resolveApprovedRunRoot(candidate, defaultRoot = DEFAULT_RUN_ROOT) {
  const resolvedDefaultRoot = resolve(defaultRoot);
  if (typeof candidate !== "string" || !candidate.trim()) return resolvedDefaultRoot;
  return resolve(dirname(resolvedDefaultRoot), candidate.trim());
}

const APPROVED_RUN_ROOT = resolveApprovedRunRoot(process.env.OPEN_SEO_TRIAL_RUN_ROOT);
const APPROVED_ARGS_ROOT = resolve(APPROVED_RUN_ROOT, "args");
const APPROVED_RAW_ROOT = resolve(APPROVED_RUN_ROOT, "raw");
const FREE_READ_ONLY_MCP_TOOLS = new Set([
  "get_rank_tracker",
  "list_projects",
  "list_saved_keywords",
  "whoami",
]);

function round(value) {
  return Math.round((value + Number.EPSILON) * PRECISION) / PRECISION;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function canonicalizePotentialPath(path) {
  let cursor = path;
  const missingSegments = [];
  while (true) {
    try {
      const existingCanonicalPath = await realpath(cursor);
      return resolve(existingCanonicalPath, ...missingSegments.reverse());
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      const parent = dirname(cursor);
      if (parent === cursor) throw error;
      missingSegments.push(basename(cursor));
      cursor = parent;
    }
  }
}

export async function resolveContainedPath(
  candidate,
  { root = APPROVED_RUN_ROOT, mustExist = false, label = "path" } = {},
) {
  if (typeof candidate !== "string" || !candidate.trim()) {
    throw new Error(`${label} must be a non-empty path`);
  }

  const canonicalRoot = await realpath(resolve(root));
  const absoluteCandidate = resolve(candidate);
  const canonicalCandidate = mustExist
    ? await realpath(absoluteCandidate)
    : await canonicalizePotentialPath(absoluteCandidate);
  const pathFromRoot = relative(canonicalRoot, canonicalCandidate);
  if (
    pathFromRoot === ".." ||
    pathFromRoot.startsWith(`..${sep}`) ||
    isAbsolute(pathFromRoot)
  ) {
    throw new Error(`${label} must remain inside approved run root ${canonicalRoot}`);
  }
  return canonicalCandidate;
}

export async function resolveTrialPath(candidate, role) {
  if (role === "args") {
    return resolveContainedPath(candidate, {
      root: APPROVED_ARGS_ROOT,
      mustExist: true,
      label: "args path",
    });
  }
  if (role === "raw-output") {
    return resolveContainedPath(candidate, {
      root: APPROVED_RAW_ROOT,
      label: "raw output path",
    });
  }
  if (role === "budget-plan" || role === "spend-ledger") {
    const filename = role === "budget-plan" ? "budget-plan.json" : "spend-ledger.json";
    const expectedLexicalPath = resolve(APPROVED_RUN_ROOT, filename);
    if (resolve(candidate) !== expectedLexicalPath) {
      throw new Error(`${role} path must be the approved run/${filename} file`);
    }
    try {
      if ((await lstat(expectedLexicalPath)).isSymbolicLink()) {
        throw new Error(`${role} path must not be a symbolic link`);
      }
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const safePath = await resolveContainedPath(candidate, {
      mustExist: role === "budget-plan",
      label: `${role} path`,
    });
    const expectedPath = await canonicalizePotentialPath(expectedLexicalPath);
    if (safePath !== expectedPath) {
      throw new Error(`${role} path must be the approved run/${filename} file`);
    }
    return safePath;
  }
  if (role === "balance-output") {
    const safePath = await resolveContainedPath(candidate, { label: "balance output path" });
    const canonicalRunRoot = await realpath(APPROVED_RUN_ROOT);
    const pathFromRoot = relative(canonicalRunRoot, safePath);
    if (!/^balance-[a-z0-9][a-z0-9-]*\.json$/i.test(pathFromRoot)) {
      throw new Error("balance output path must be a run/balance-*.json snapshot file");
    }
    return safePath;
  }
  throw new Error(`unknown trial path role ${JSON.stringify(role)}`);
}

export function assertAllowedFreeMcpTool(tool) {
  if (!FREE_READ_ONLY_MCP_TOOLS.has(tool)) {
    throw new Error(
      `MCP tool ${JSON.stringify(tool)} is not allowlisted as a free, read-only operation`,
    );
  }
  return tool;
}

async function atomicWriteJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function withLedgerLock(
  ledgerPath,
  callback,
  { timeoutMs = 30_000, retryMs = 50 } = {},
) {
  const lockPath = `${ledgerPath}.lock`;
  const ownerPath = join(lockPath, "owner");
  const ownerToken = `${process.pid}:${randomUUID()}`;
  const startedAt = Date.now();
  while (true) {
    try {
      await mkdir(lockPath);
      try {
        await writeFile(ownerPath, ownerToken, { encoding: "utf8", flag: "wx" });
      } catch (error) {
        await rm(lockPath, { recursive: true, force: true });
        throw error;
      }
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(`timed out waiting for paid-call ledger lock ${lockPath}`);
      }
      await wait(retryMs);
    }
  }

  try {
    return await callback();
  } finally {
    try {
      const currentOwner = await readFile(ownerPath, "utf8");
      if (currentOwner === ownerToken) {
        await rm(lockPath, { recursive: true, force: true });
      }
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
}

async function persistExistingLedgerEvent(ledgerPath, event) {
  const ledger = await readJson(ledgerPath);
  const matchingIndexes = ledger
    .map((candidate, index) => (candidate.id === event.id ? index : -1))
    .filter((index) => index >= 0);
  if (matchingIndexes.length !== 1) {
    throw new Error(
      `cannot reconcile spend event ${event.id}; expected one reserved ledger record, found ${matchingIndexes.length}`,
    );
  }
  ledger[matchingIndexes[0]] = event;
  await atomicWriteJson(ledgerPath, ledger);
  return ledger;
}

function credential() {
  const value = process.env.DATAFORSEO_API_KEY ?? process.env.DATA_FOR_SEO_BASE64_LOGIN;
  if (!value?.trim()) {
    throw new Error("DATAFORSEO_API_KEY or DATA_FOR_SEO_BASE64_LOGIN is required");
  }
  return value.trim().replace(/^Basic\s+/i, "");
}

async function fetchJson(url, init, timeoutMs = 120_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}: ${text.slice(0, 500)}`);
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

export function extractDataForSeoAccount(envelope) {
  const account = envelope?.tasks?.[0]?.result?.[0];
  const money = account?.money;
  if (!money || !Number.isFinite(money.balance)) {
    throw new Error("DataForSEO user_data response did not disclose a finite money.balance");
  }
  const pickNormalLivePrice = (value) => value?.live?.priority_normal ?? null;
  return {
    balance: money.balance,
    total: money.total ?? null,
    statistics: money.statistics
      ? {
          day: {
            total: money.statistics.day?.total ?? null,
            totalSerp: money.statistics.day?.total_serp ?? null,
            totalDataForSeoLabs: money.statistics.day?.total_dataforseo_labs ?? null,
          },
          minute: {
            total: money.statistics.minute?.total ?? null,
            totalSerp: money.statistics.minute?.total_serp ?? null,
            totalDataForSeoLabs: money.statistics.minute?.total_dataforseo_labs ?? null,
          },
        }
      : null,
    price: account.price
      ? {
          serpOrganicLiveAdvanced: account.price.serp?.live?.advanced?.priority_normal ?? null,
          labsKeywordOverview: pickNormalLivePrice(account.price.dataforseo_labs?.keyword_overview),
          labsRelatedKeywords: pickNormalLivePrice(account.price.dataforseo_labs?.related_keywords),
          labsKeywordSuggestions: pickNormalLivePrice(account.price.dataforseo_labs?.keyword_suggestions),
          labsKeywordIdeas: pickNormalLivePrice(account.price.dataforseo_labs?.keyword_ideas),
          labsSerpCompetitors: pickNormalLivePrice(account.price.dataforseo_labs?.serp_competitors),
        }
      : null,
  };
}

export function computeBalanceDelta(before, after) {
  if (!Number.isFinite(before) || !Number.isFinite(after)) {
    throw new Error("before and after balances must be finite numbers");
  }
  return Math.max(0, round(before - after));
}

export function resolveDisclosedActualCost({ beforeBalance, afterBalance, receiptCost = null }) {
  const balanceDelta = computeBalanceDelta(beforeBalance, afterBalance);
  if (receiptCost !== null && receiptCost !== undefined) {
    if (!Number.isFinite(receiptCost) || receiptCost < 0) {
      throw new Error("receipt cost must be null or a non-negative finite number");
    }
    return round(Math.max(receiptCost, balanceDelta));
  }
  return balanceDelta > 0 ? balanceDelta : null;
}

function explicitReceiptCost(data) {
  for (const candidate of [
    data?.actualCost,
    data?.actual_cost,
    data?.totalCost,
    data?.total_cost,
    data?.cost,
    data?.meta?.actualCost,
    data?.meta?.actual_cost,
    data?.meta?.totalCost,
    data?.meta?.total_cost,
    data?.meta?.cost,
  ]) {
    if (candidate !== null && candidate !== undefined) return candidate;
  }
  return null;
}

export function unwrapMcpToolResult(envelope) {
  if (envelope?.error) {
    throw new Error(envelope.error.message ?? JSON.stringify(envelope.error));
  }
  const result = envelope?.result;
  if (!result) {
    throw new Error("OpenSEO MCP response did not contain a result");
  }
  const text = result.content?.find((entry) => entry.type === "text")?.text;
  if (result.isError) {
    throw new Error(text || "OpenSEO MCP tool returned isError=true");
  }
  if (result.structuredContent !== undefined) {
    return result.structuredContent;
  }
  if (typeof text === "string") {
    try {
      return JSON.parse(text);
    } catch {
      return { text };
    }
  }
  return result;
}

async function getDataForSeoAccount() {
  const envelope = await fetchJson(DATAFORSEO_ACCOUNT_URL, {
    method: "GET",
    headers: { Authorization: `Basic ${credential()}` },
  });
  return extractDataForSeoAccount(envelope);
}

async function mcpCall(tool, args) {
  const envelope = await fetchJson(OPEN_SEO_MCP_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: randomUUID(),
      method: "tools/call",
      params: { name: tool, arguments: args },
    }),
  });
  return { envelope, data: unwrapMcpToolResult(envelope) };
}

async function runBalance(outputPath) {
  const safeOutputPath = outputPath
    ? await resolveTrialPath(outputPath, "balance-output")
    : null;
  const account = await getDataForSeoAccount();
  const snapshot = { capturedAt: new Date().toISOString(), ...account };
  if (safeOutputPath) await atomicWriteJson(safeOutputPath, snapshot);
  process.stdout.write(`${JSON.stringify(snapshot)}\n`);
}

async function runFindLocation(query) {
  if (!query?.trim()) throw new Error("find-location requires a non-empty query");
  const envelope = await fetchJson(DATAFORSEO_SERP_LOCATIONS_URL, {
    method: "GET",
    headers: { Authorization: `Basic ${credential()}` },
  });
  const candidates = (envelope?.tasks?.[0]?.result ?? [])
    .filter((entry) =>
      [entry.location_name, entry.location_name_parent, entry.country_iso_code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .map((entry) => ({
      locationCode: entry.location_code,
      locationName: entry.location_name,
      locationNameParent: entry.location_name_parent ?? null,
      countryIsoCode: entry.country_iso_code ?? null,
      locationType: entry.location_type ?? null,
    }));
  process.stdout.write(`${JSON.stringify({ query, candidates }, null, 2)}\n`);
}

async function runMcp(tool, argsPath, outputPath) {
  assertAllowedFreeMcpTool(tool);
  const safeArgsPath = await resolveTrialPath(argsPath, "args");
  const safeOutputPath = await resolveTrialPath(outputPath, "raw-output");
  const args = await readJson(safeArgsPath);
  const { data } = await mcpCall(tool, args);
  const record = { capturedAt: new Date().toISOString(), tool, args, data };
  await atomicWriteJson(safeOutputPath, record);
  process.stdout.write(
    `${JSON.stringify({ status: "completed", tool, outputPath: safeOutputPath })}\n`,
  );
}

async function runPaid(argv) {
  const [planPath, ledgerPath, workstream, endpoint, estimatedCostRaw, tool, argsPath, outputPath] = argv;
  if (argv.length !== 8 || argv.some((value) => typeof value !== "string" || !value.trim())) {
    throw new Error(
      "paid usage: <plan> <ledger> <workstream> <endpoint> <estimatedCost> <tool> <args> <output>",
    );
  }

  const safePlanPath = await resolveTrialPath(planPath, "budget-plan");
  const safeLedgerPath = await resolveTrialPath(ledgerPath, "spend-ledger");
  const safeArgsPath = await resolveTrialPath(argsPath, "args");
  const safeOutputPath = await resolveTrialPath(outputPath, "raw-output");

  return withLedgerLock(safeLedgerPath, async () => {
  const plan = await readJson(safePlanPath);
  let ledger;
  try {
    ledger = await readJson(safeLedgerPath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    ledger = [];
  }
  const args = await readJson(safeArgsPath);
  const requestedEstimatedCost = Number(estimatedCostRaw);
  const decision = evaluatePaidCall({
    plan,
    ledger,
    workstream,
    endpoint,
    tool,
    args,
    estimatedCost: requestedEstimatedCost,
  });
  if (decision.status !== "approved") {
    throw new Error(`paid call blocked before dispatch: ${decision.reasons.join("; ")}`);
  }
  const estimatedCost = decision.authoritativeEstimatedCost;

  const before = await getDataForSeoAccount();
  if (before.balance < estimatedCost) {
    throw new Error(
      `paid call blocked before dispatch: provider balance ${before.balance} is below estimated cost ${estimatedCost}`,
    );
  }

  const event = {
    id: randomUUID(),
    workstream,
    endpoint,
    tool,
    estimatedCost,
    requestedEstimatedCost,
    catalogMinimumCost: decision.catalogMinimumCost,
    actualCost: null,
    status: "dispatched",
    startedAt: new Date().toISOString(),
    providerBalanceBefore: before.balance,
  };
  ledger.push(event);
  await atomicWriteJson(safeLedgerPath, ledger);

  let call;
  let callError;
  try {
    call = await mcpCall(tool, args);
  } catch (error) {
    callError = error;
  }

  let after;
  try {
    after = await getDataForSeoAccount();
  } catch (error) {
    event.status = callError ? "failed-cost-undisclosed" : "completed-cost-undisclosed";
    event.finishedAt = new Date().toISOString();
    event.error = callError?.message ?? null;
    event.reconciliationError = error.message;
    ledger = await persistExistingLedgerEvent(safeLedgerPath, event);
    if (call) {
      await atomicWriteJson(safeOutputPath, {
        capturedAt: event.finishedAt,
        tool,
        args,
        data: call.data,
      });
    }
    throw new Error(
      `post-call balance reconciliation failed; estimate remains reserved: ${error.message}`,
    );
  }

  event.actualCost = resolveDisclosedActualCost({
    beforeBalance: before.balance,
    afterBalance: after.balance,
    receiptCost: explicitReceiptCost(call?.data),
  });
  event.providerBalanceAfter = after.balance;
  event.finishedAt = new Date().toISOString();
  event.status = callError
    ? event.actualCost === null
      ? "failed-cost-undisclosed"
      : "failed"
    : event.actualCost === null
      ? "completed-cost-undisclosed"
      : "completed";
  if (event.actualCost === null) {
    event.reconciliationNote =
      "Immediate provider balance was unchanged and no explicit cost receipt was returned; estimated cost remains committed pending later reconciliation.";
  }
  if (callError) event.error = callError.message;
  ledger = await persistExistingLedgerEvent(safeLedgerPath, event);
  const reconciled = reconcileBudget(plan, ledger);

  if (call) {
    await atomicWriteJson(safeOutputPath, {
      capturedAt: event.finishedAt,
      tool,
      args,
      data: call.data,
    });
  }

  if (callError) throw callError;
  if (reconciled.errors.length > 0) {
    throw new Error(`post-call budget reconciliation failed: ${reconciled.errors.join("; ")}`);
  }

  process.stdout.write(
    `${JSON.stringify({
      status: "completed",
      eventId: event.id,
      tool,
      requestedEstimatedCost,
      estimatedCost,
      actualCost: event.actualCost,
      providerBalanceAfter: after.balance,
      totalCommitted: reconciled.committed,
      hardCeilingRemaining: reconciled.remaining,
      outputPath: safeOutputPath,
    })}\n`,
  );
  });
}

async function main() {
  const [command, ...argv] = process.argv.slice(2);
  if (command === "balance") return runBalance(argv[0]);
  if (command === "find-location") return runFindLocation(argv.join(" "));
  if (command === "mcp") return runMcp(argv[0], argv[1], argv[2]);
  if (command === "paid") return runPaid(argv);
  throw new Error("usage: openseo-trial-cli.mjs <balance|find-location|mcp|paid> ...");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
