#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const corpusPath = path.join(
  repositoryRoot,
  "docs/research/fairlend-speaker-opportunities-2026-07-28.json",
);

const records = JSON.parse(fs.readFileSync(corpusPath, "utf8"));
const sourcesByUrl = new Map();

for (const record of records) {
  for (const source of record.sources) {
    const entry = sourcesByUrl.get(source.url) ?? {
      url: source.url,
      records: [],
      documentedAccessStatuses: [],
    };
    entry.records.push(record.researchId);
    entry.documentedAccessStatuses.push(source.accessStatus ?? "");
    sourcesByUrl.set(source.url, entry);
  }
}

const timeoutMilliseconds = 20_000;
const concurrency = 12;
const reachableStatuses = new Set([401, 403, 405, 406, 409, 429]);

const verify = async (entry) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
  try {
    const response = await fetch(entry.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; FairLendResearchVerifier/1.0; +https://fairlend.ca)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });
    const reachable =
      (response.status >= 200 && response.status < 400) ||
      reachableStatuses.has(response.status);
    return {
      ...entry,
      reachable,
      status: response.status,
      finalUrl: response.url,
      error: "",
    };
  } catch (error) {
    return {
      ...entry,
      reachable: false,
      status: 0,
      finalUrl: "",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
};

const queue = [...sourcesByUrl.values()];
const results = [];
let cursor = 0;

await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (cursor < queue.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await verify(queue[index]);
    }
  }),
);

const failures = results.filter((result) => !result.reachable);
const undocumentedFailures = failures.filter(
  (result) =>
    !result.documentedAccessStatuses.every(
      (status) => status === "INACCESSIBLE_2026_07_28",
    ),
);
const statusCounts = Object.fromEntries(
  [...new Set(results.map((result) => result.status))]
    .sort((left, right) => left - right)
    .map((status) => [
      String(status),
      results.filter((result) => result.status === status).length,
    ]),
);

console.log(
  JSON.stringify(
    {
      verifiedOn: "2026-07-28",
      records: records.length,
      uniqueUrls: results.length,
      reachable: results.length - failures.length,
      inaccessible: failures.length,
      explicitlyDocumentedInaccessible: failures.length - undocumentedFailures.length,
      undocumentedInaccessible: undocumentedFailures.length,
      statusCounts,
      failures,
    },
    null,
    2,
  ),
);

if (undocumentedFailures.length > 0) process.exitCode = 2;
