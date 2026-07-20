#!/usr/bin/env node

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const WORKSPACE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const readContract = (name) =>
  JSON.parse(fs.readFileSync(path.join(WORKSPACE_DIRECTORY, "contracts", name), "utf8"));
const VOCABULARIES = readContract("controlled-vocabularies.json");
const RECORD_CONTRACTS = readContract("record-contracts.json");
const COLLECTION_CONTRACTS = RECORD_CONTRACTS.collections;
const REQUIRED_COLLECTIONS = Object.keys(COLLECTION_CONTRACTS);
const STABLE_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const REQUIREMENT_DIRECTIVE_PATTERN = /^(?:Address|Clarify|Compare|Connect|Define|Describe|Document|Evaluate|Explain|Identify|Include|List|Measure|Obtain|Require|Route|Show|Specify|State|Summarize|Validate)\b/;
const QUESTION_PATTERN = /^(?:Can|Could|Do|Does|How|Is|Should|What|When|Where|Which|Who|Why|Will|Would)\b.*\?$/;
const PROMOTIONAL_COPY_PATTERN = /\b(?:best|leading|premier|top[- ]rated|world[- ]class|unmatched|unbeatable|guarantee(?:d|s)?|finance your|your project succeeds)\b/i;
const TORONTO_LOCATION = "Toronto, Ontario, Canada";
const PUBLIC_SEARCH_LOCATION = `not-exposed; query target ${TORONTO_LOCATION}`;

const PROHIBITED_CONTENT_FIELDS = new Set([
  "copy",
  "heroText",
  "finalCopy",
  "marketingCopy",
  "bodyCopy",
  "draftCopy",
  "cmsReadyContent",
  "cmsPayload",
  "implementationDiff",
  "publishedContent",
  "finalHeading",
  "finalHeadings",
]);

function isObjectRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function valueAtPath(value, fieldPath) {
  return fieldPath.split(".").reduce((current, key) => current?.[key], value);
}

function validateEnum(value, vocabularyName, valuePath, errors) {
  const vocabulary = VOCABULARIES[vocabularyName];
  if (!Array.isArray(vocabulary) || !vocabulary.includes(value)) {
    errors.push(`${valuePath}: unapproved value "${value}"`);
  }
}

function isValidCalendarDate(value) {
  const match = typeof value === "string" ? value.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isHostname(value) {
  if (typeof value !== "string" || value.trim() !== value || /[\s/:]/.test(value)) return false;
  try {
    const url = new URL(`https://${value}`);
    return url.hostname === value && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function validateStringFormat(value, format, valuePath, errors) {
  if (format === "stable-id" && !STABLE_ID_PATTERN.test(value)) {
    errors.push(`${valuePath}: expected a stable kebab-case identifier`);
  } else if (format === "http-url" && !isHttpUrl(value)) {
    errors.push(`${valuePath}: expected an absolute HTTP(S) URL`);
  } else if (
    format === "source-locator" &&
    !isHttpUrl(value) &&
    !(value.startsWith("/") && !value.includes("\u0000")) &&
    !/^(?!https?:)[a-z][a-z0-9+.-]*:\/\/\S+$/i.test(value)
  ) {
    errors.push(`${valuePath}: expected an absolute local path or HTTP(S) URL`);
  } else if (format === "hostname" && !isHostname(value)) {
    errors.push(`${valuePath}: expected a hostname without scheme or path`);
  } else if (
    format === "root-relative-url" &&
    (!value.startsWith("/") || value.startsWith("//") || /[\s]/.test(value))
  ) {
    errors.push(`${valuePath}: expected a root-relative URL path`);
  } else if (format === "date" && !isValidCalendarDate(value)) {
    errors.push(`${valuePath}: expected a valid YYYY-MM-DD calendar date`);
  }
}

function validateSchemaValue(value, schema, valuePath, errors) {
  if (!schema) return;
  if (value === null && schema.nullable === true) return;

  if (schema.type === "string") {
    if (typeof value !== "string") {
      errors.push(
        `${valuePath}: expected ${schema.nonEmpty ? "a non-empty string" : "a string"}`,
      );
      return;
    }
    if (schema.nonEmpty && value.trim().length === 0) {
      errors.push(`${valuePath}: expected a non-empty string`);
      return;
    }
    if (schema.format) validateStringFormat(value, schema.format, valuePath, errors);
    return;
  }

  if (schema.type === "number" || schema.type === "integer") {
    const validNumber =
      typeof value === "number" &&
      Number.isFinite(value) &&
      (schema.type !== "integer" || Number.isInteger(value));
    if (!validNumber) {
      errors.push(`${valuePath}: expected a finite ${schema.type}`);
      return;
    }
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${valuePath}: expected a value greater than or equal to ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${valuePath}: expected a value less than or equal to ${schema.maximum}`);
    }
    return;
  }

  if (schema.type === "boolean") {
    if (typeof value !== "boolean") errors.push(`${valuePath}: expected a boolean`);
    return;
  }

  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${valuePath}: expected an array`);
      return;
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${valuePath}: expected at least ${schema.minItems} item(s)`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${valuePath}: expected at most ${schema.maxItems} item(s)`);
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        errors.push(`${valuePath}: expected unique array items`);
      }
    }
    value.forEach((item, index) =>
      validateSchemaValue(item, schema.items, `${valuePath}[${index}]`, errors),
    );
    return;
  }

  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      errors.push(`${valuePath}: expected an object`);
      return;
    }
    const properties = schema.properties ?? {};
    for (const field of schema.required ?? Object.keys(properties)) {
      if (!Object.hasOwn(value, field)) errors.push(`${valuePath}.${field}: required field is missing`);
    }
    if (schema.closed) {
      for (const field of Object.keys(value)) {
        if (!Object.hasOwn(properties, field)) errors.push(`${valuePath}.${field}: field is not allowed`);
      }
    }
    for (const [field, fieldSchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, field)) {
        validateSchemaValue(value[field], fieldSchema, `${valuePath}.${field}`, errors);
      }
    }
  }
}

function validateExactFields(record, contract, recordPath, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${recordPath}: expected an object`);
    return;
  }

  const allowedFields = new Set(contract.requiredFields);
  for (const field of contract.requiredFields) {
    if (!Object.hasOwn(record, field)) {
      errors.push(`${recordPath}.${field}: required field is missing`);
    }
  }
  for (const field of Object.keys(record)) {
    if (!allowedFields.has(field)) {
      errors.push(`${recordPath}.${field}: field is not allowed by the requirements-only contract`);
    }
  }
}

function validateClassifications(record, contract, recordPath, errors) {
  for (const [fieldPath, vocabularyName] of Object.entries(contract.enumFields ?? {})) {
    validateEnum(valueAtPath(record, fieldPath), vocabularyName, `${recordPath}.${fieldPath}`, errors);
  }
  for (const [field, vocabularyName] of Object.entries(contract.arrayEnumFields ?? {})) {
    const values = record?.[field];
    if (!Array.isArray(values) || values.length === 0) {
      errors.push(`${recordPath}.${field}: expected a non-empty array`);
      continue;
    }
    values.forEach((value, index) =>
      validateEnum(value, vocabularyName, `${recordPath}.${field}[${index}]`, errors),
    );
  }
}

function validateTimestamp(value, valuePath, errors, nullable = false) {
  if (nullable && value === null) return;
  const timestampPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
  const match = typeof value === "string" ? value.match(timestampPattern) : null;
  const parts = match?.slice(1, 7).map(Number);
  const calendarDate = parts
    ? new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]))
    : null;
  const calendarMatches =
    calendarDate &&
    calendarDate.getUTCFullYear() === parts[0] &&
    calendarDate.getUTCMonth() === parts[1] - 1 &&
    calendarDate.getUTCDate() === parts[2] &&
    calendarDate.getUTCHours() === parts[3] &&
    calendarDate.getUTCMinutes() === parts[4] &&
    calendarDate.getUTCSeconds() === parts[5];
  if (!match || !calendarMatches || Number.isNaN(Date.parse(value))) {
    errors.push(`${valuePath}: expected an ISO 8601 timestamp with timezone`);
  }
}

function validateRecordTypes(record, contract, recordPath, errors) {
  for (const [field, schema] of Object.entries(contract.fieldSchemas ?? {})) {
    if (Object.hasOwn(record ?? {}, field)) {
      validateSchemaValue(record[field], schema, `${recordPath}.${field}`, errors);
    }
  }
  for (const field of contract.timestampFields ?? []) {
    validateTimestamp(record?.[field], `${recordPath}.${field}`, errors);
  }
  for (const field of contract.nullableTimestampFields ?? []) {
    validateTimestamp(record?.[field], `${recordPath}.${field}`, errors, true);
  }
  for (const field of contract.nonEmptyStringFields ?? []) {
    if (typeof record?.[field] !== "string" || record[field].trim().length === 0) {
      errors.push(`${recordPath}.${field}: expected a non-empty string`);
    }
  }
  for (const field of contract.nonEmptyStringArrayFields ?? []) {
    const values = record?.[field];
    if (
      !Array.isArray(values) ||
      values.length === 0 ||
      values.some((value) => typeof value !== "string" || value.trim().length === 0)
    ) {
      errors.push(`${recordPath}.${field}: expected a non-empty array of non-empty strings`);
    }
  }
}

function validatePersonaAndExclusion(record, recordPath, errors) {
  if (!isObjectRecord(record)) return;
  if (record.persona === "adjacent-discovered-other") {
    if (record.personaTier !== "adjacent-discovered") {
      errors.push(`${recordPath}.personaTier: adjacent personas must use adjacent-discovered`);
    }
    if (typeof record.personaDetail !== "string" || record.personaDetail.trim().length === 0) {
      errors.push(`${recordPath}.personaDetail: adjacent personas require a non-empty detail`);
    }
  } else if (record.personaDetail !== null) {
    errors.push(`${recordPath}.personaDetail: approved seed personas must use null`);
  } else {
    const expectedTier = RECORD_CONTRACTS.personaTierAssignments[record.persona];
    if (expectedTier && record.personaTier !== expectedTier) {
      errors.push(`${recordPath}.personaTier: ${record.persona} must use ${expectedTier}`);
    }
  }

  if (Object.hasOwn(record, "relevanceDisposition")) {
    const isIncluded = record.relevanceDisposition === "include";
    const isNotExcluded = record.exclusionReason === "not-excluded-qualified-project-financing-fit";
    if (isIncluded !== isNotExcluded) {
      errors.push(
        `${recordPath}.exclusionReason: include requires the qualified-fit reason; down-rank/exclude require a traffic-exclusion reason`,
      );
    }
  }

  const expectedHeadline = RECORD_CONTRACTS.funnelHeadlineByStage[record.funnelStage];
  if (expectedHeadline && record.funnelHeadline !== expectedHeadline) {
    errors.push(`${recordPath}.funnelHeadline: ${record.funnelStage} must use ${expectedHeadline}`);
  }
}

function validateStableIds(document, errors) {
  const seen = new Map();
  for (const collection of REQUIRED_COLLECTIONS) {
    if (!Array.isArray(document[collection])) continue;
    document[collection].forEach((record, index) => {
      const recordPath = `${collection}[${index}].id`;
      if (typeof record?.id !== "string" || !STABLE_ID_PATTERN.test(record.id)) {
        errors.push(`${recordPath}: expected a stable kebab-case identifier`);
        return;
      }
      if (seen.has(record.id)) {
        errors.push(`${recordPath}: duplicate identifier also used at ${seen.get(record.id)}`);
      } else {
        seen.set(record.id, recordPath);
      }
    });
  }
}

function collectionIdSets(document) {
  return Object.fromEntries(
    REQUIRED_COLLECTIONS.map((collection) => [
      collection,
      new Set(
        Array.isArray(document[collection])
          ? document[collection]
              .map((record) => record?.id)
              .filter((id) => typeof id === "string")
          : [],
      ),
    ]),
  );
}

function validateReference(value, referenceContract, valuePath, idSets, errors) {
  const targetIds = idSets[referenceContract.target] ?? new Set();
  if (referenceContract.cardinality === "many") {
    if (!Array.isArray(value)) {
      errors.push(`${valuePath}: expected an array of ${referenceContract.target} identifiers`);
      return;
    }
    if (value.length < (referenceContract.minimum ?? 0)) {
      errors.push(`${valuePath}: expected at least ${referenceContract.minimum} reference(s)`);
    }
    const uniqueValues = new Set();
    value.forEach((id, index) => {
      if (uniqueValues.has(id)) errors.push(`${valuePath}[${index}]: duplicate reference "${id}"`);
      uniqueValues.add(id);
      if (!targetIds.has(id)) {
        errors.push(`${valuePath}[${index}]: unknown ${referenceContract.target} id "${id}"`);
      }
    });
    return;
  }

  if (typeof value !== "string" || !targetIds.has(value)) {
    errors.push(`${valuePath}: unknown ${referenceContract.target} id "${value}"`);
  }
}

function validateReferences(document, errors) {
  const idSets = collectionIdSets(document);
  const validateRecordReferences = (record, contract, recordPath) => {
    for (const [field, referenceContract] of Object.entries(contract.referenceFields ?? {})) {
      validateReference(record?.[field], referenceContract, `${recordPath}.${field}`, idSets, errors);
    }
  };

  if (document.manifest) {
    validateRecordReferences(document.manifest, RECORD_CONTRACTS.manifest, "manifest");
  }
  for (const [collection, contract] of Object.entries(COLLECTION_CONTRACTS)) {
    if (!Array.isArray(document[collection])) continue;
    document[collection].forEach((record, index) =>
      validateRecordReferences(record, contract, `${collection}[${index}]`),
    );
  }
}

function validateScoreObject(score, scoreName, scorePath, errors) {
  const componentMaximums = RECORD_CONTRACTS.scoreContracts[scoreName];
  if (!score || typeof score !== "object" || Array.isArray(score)) {
    errors.push(`${scorePath}: expected a score object`);
    return;
  }

  const expectedKeys = new Set([...Object.keys(componentMaximums), "total"]);
  for (const key of expectedKeys) {
    if (!Object.hasOwn(score, key)) errors.push(`${scorePath}.${key}: required score component is missing`);
  }
  for (const key of Object.keys(score)) {
    if (!expectedKeys.has(key)) errors.push(`${scorePath}.${key}: unapproved score component`);
  }

  let expectedTotal = 0;
  for (const [component, maximum] of Object.entries(componentMaximums)) {
    const value = score[component];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > maximum) {
      errors.push(`${scorePath}.${component}: expected a finite number from 0 to ${maximum}`);
      continue;
    }
    expectedTotal += value;
  }
  if (score.total !== expectedTotal) {
    errors.push(`${scorePath}.total: expected ${expectedTotal} from component sum, received ${score.total}`);
  }
}

function validateScores(document, errors) {
  for (const [collection, contract] of Object.entries(COLLECTION_CONTRACTS)) {
    if (!Array.isArray(document[collection])) continue;
    document[collection].forEach((record, index) => {
      for (const scoreName of contract.scoreObjectFields ?? []) {
        validateScoreObject(record?.[scoreName], scoreName, `${collection}[${index}].${scoreName}`, errors);
      }
      for (const scoreName of contract.numericScoreFields ?? []) {
        const score = record?.[scoreName];
        if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) {
          errors.push(`${collection}[${index}].${scoreName}: expected a finite number from 0 to 100`);
        }
      }
    });
  }
}

function findProhibitedContent(value, valuePath, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findProhibitedContent(item, `${valuePath}[${index}]`, errors));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = valuePath ? `${valuePath}.${key}` : key;
    if (PROHIBITED_CONTENT_FIELDS.has(key)) {
      errors.push(`${childPath}: prohibited content field`);
      continue;
    }
    findProhibitedContent(child, childPath, errors);
  }
}

function validateMarkedString(value, prefix, valuePath, errors) {
  if (typeof value !== "string" || !value.startsWith(prefix) || value.length <= prefix.length) {
    errors.push(`${valuePath}: requirements-only text must start with "${prefix}"`);
    return;
  }
  const body = value.slice(prefix.length);
  if (prefix === "REQUIREMENT: " && !REQUIREMENT_DIRECTIVE_PATTERN.test(body)) {
    errors.push(`${valuePath}: requirement text must start with an approved directive verb`);
  }
  if (prefix === "QUESTION: " && !QUESTION_PATTERN.test(body)) {
    errors.push(`${valuePath}: question text must be interrogative and end with a question mark`);
  }
  if (PROMOTIONAL_COPY_PATTERN.test(body)) {
    errors.push(`${valuePath}: promotional/final marketing prose is prohibited`);
  }
}

function validateManifestOperations(document, errors) {
  const manifest = document.manifest;
  const marketFields = ["country", "language", "primaryLocation", "secondaryLocation"];
  validateExactFields(manifest?.market, { requiredFields: marketFields }, "manifest.market", errors);
  const expectedMarket = {
    country: "CA",
    language: "en",
    primaryLocation: "Toronto, Ontario, Canada",
    secondaryLocation: "Greater Toronto Area, Ontario, Canada",
  };
  for (const [field, expected] of Object.entries(expectedMarket)) {
    if (manifest?.market?.[field] !== expected) {
      errors.push(`manifest.market.${field}: expected "${expected}"`);
    }
  }

  const budgetFields = ["currency", "hardCeiling", "spent", "committed", "remaining"];
  validateExactFields(manifest?.budget, { requiredFields: budgetFields }, "manifest.budget", errors);
  const budget = manifest?.budget;
  if (budget?.currency !== "USD") errors.push('manifest.budget.currency: expected "USD"');
  if (budget?.hardCeiling !== 0.9) errors.push("manifest.budget.hardCeiling: expected 0.9");
  for (const field of ["spent", "committed", "remaining"]) {
    if (typeof budget?.[field] !== "number" || !Number.isFinite(budget[field]) || budget[field] < 0) {
      errors.push(`manifest.budget.${field}: expected a non-negative finite number`);
    }
  }
  if (
    typeof budget?.committed === "number" &&
    typeof budget?.remaining === "number" &&
    Math.abs(budget.committed + budget.remaining - 0.9) > 1e-9
  ) {
    errors.push("manifest.budget: committed plus remaining must equal the USD 0.90 hard ceiling");
  }
  if (
    typeof budget?.spent === "number" &&
    typeof budget?.committed === "number" &&
    budget.spent > budget.committed
  ) {
    errors.push("manifest.budget: spent cannot exceed committed cost");
  }

  if (!Array.isArray(manifest?.tools)) {
    errors.push("manifest.tools: expected an array");
  } else {
    manifest.tools.forEach((tool, index) => {
      const toolPath = `manifest.tools[${index}]`;
      validateExactFields(tool, { requiredFields: ["name", "version", "commit"] }, toolPath, errors);
      for (const field of ["name", "version", "commit"]) {
        if (typeof tool?.[field] !== "string" || tool[field].trim().length === 0) {
          errors.push(`${toolPath}.${field}: expected a non-empty string`);
        }
      }
    });
  }

  let recordedSpend = 0;
  let recordedCommitted = 0;
  const spendEvents = Array.isArray(document.spendEvents) ? document.spendEvents : [];
  for (const [index, event] of spendEvents.entries()) {
    const eventPath = `spendEvents[${index}]`;
    for (const field of ["requestedRowCount", "returnedRowCount", "retryCount"]) {
      if (!Number.isInteger(event?.[field]) || event[field] < 0) {
        errors.push(`${eventPath}.${field}: expected a non-negative integer`);
      }
    }
    if (
      typeof event?.estimatedCost !== "number" ||
      !Number.isFinite(event.estimatedCost) ||
      event.estimatedCost < 0
    ) {
      errors.push(`${eventPath}.estimatedCost: expected a non-negative finite number`);
    }
    if (
      event?.actualCost !== null &&
      (typeof event.actualCost !== "number" || !Number.isFinite(event.actualCost) || event.actualCost < 0)
    ) {
      errors.push(`${eventPath}.actualCost: expected null or a non-negative finite number`);
    }
    if (event?.currency !== "USD") errors.push(`${eventPath}.currency: expected "USD"`);
    if (typeof event?.actualCost === "number" && Number.isFinite(event.actualCost)) {
      recordedSpend += event.actualCost;
    }
    if (typeof event?.estimatedCost === "number" && Number.isFinite(event.estimatedCost)) {
      recordedCommitted +=
        typeof event.actualCost === "number" && Number.isFinite(event.actualCost)
          ? event.actualCost
          : event.estimatedCost;
    }
  }
  if (typeof budget?.spent === "number" && Math.abs(recordedSpend - budget.spent) > 1e-9) {
    errors.push(
      `manifest.budget.spent: expected ${recordedSpend} from spendEvents, received ${budget.spent}`,
    );
  }
  if (
    typeof budget?.committed === "number" &&
    Math.abs(recordedCommitted - budget.committed) > 1e-9
  ) {
    errors.push(
      `manifest.budget.committed: expected ${recordedCommitted} from spendEvents, received ${budget.committed}`,
    );
  }
}

function validateBriefBoundaries(document, errors) {
  for (const [index, brief] of (document.briefs ?? []).entries()) {
    const base = `briefs[${index}]`;
    for (const field of ["pagePurpose", "audience", "problemTrigger", "ctaSpecification"]) {
      validateMarkedString(brief?.[field], "REQUIREMENT: ", `${base}.${field}`, errors);
    }
    for (const field of [
      "internalLinkRequirements",
      "schemaOpportunities",
      "approvalRequirements",
      "successMeasures",
    ]) {
      if (!Array.isArray(brief?.[field])) {
        errors.push(`${base}.${field}: expected an array of requirements`);
        continue;
      }
      brief[field].forEach((value, itemIndex) =>
        validateMarkedString(value, "REQUIREMENT: ", `${base}.${field}[${itemIndex}]`, errors),
      );
    }
    if (!Array.isArray(brief?.sectionRequirements) || brief.sectionRequirements.length === 0) {
      errors.push(`${base}.sectionRequirements: expected a non-empty array`);
      continue;
    }
    brief.sectionRequirements.forEach((section, sectionIndex) => {
      const sectionPath = `${base}.sectionRequirements[${sectionIndex}]`;
      const fields = ["id", "headingRequirement", "questions", "evidenceNeeded"];
      validateExactFields(section, { requiredFields: fields }, sectionPath, errors);
      if (typeof section?.id !== "string" || !STABLE_ID_PATTERN.test(section.id)) {
        errors.push(`${sectionPath}.id: expected a stable kebab-case identifier`);
      }
      validateMarkedString(
        section?.headingRequirement,
        "REQUIREMENT: ",
        `${sectionPath}.headingRequirement`,
        errors,
      );
      for (const [field, prefix] of [["questions", "QUESTION: "], ["evidenceNeeded", "EVIDENCE: "]]) {
        if (!Array.isArray(section?.[field]) || section[field].length === 0) {
          errors.push(`${sectionPath}.${field}: expected a non-empty array`);
          continue;
        }
        section[field].forEach((value, itemIndex) =>
          validateMarkedString(value, prefix, `${sectionPath}.${field}[${itemIndex}]`, errors),
        );
      }
    });
  }
}

function normalizeQueryText(value) {
  return typeof value === "string"
    ? value.normalize("NFKC").trim().toLocaleLowerCase("en-CA").replace(/\s+/g, " ")
    : null;
}

function referencedSourceTypes(record, sourceById) {
  return new Set(
    (record?.sourceObservationRefs ?? [])
      .map((id) => sourceById.get(id)?.sourceType)
      .filter(Boolean),
  );
}

function validateCanonicalInvariants(document, errors) {
  const sourceById = new Map(
    (document.sourceObservations ?? [])
      .filter(isObjectRecord)
      .map((source) => [source.id, source]),
  );
  const keywordById = new Map(
    (document.keywords ?? []).filter(isObjectRecord).map((keyword) => [keyword.id, keyword]),
  );

  const seenInventoryUrls = new Set();
  for (const [index, inventory] of (document.siteInventory ?? []).entries()) {
    const recordPath = `siteInventory[${index}]`;
    if (!isObjectRecord(inventory)) continue;
    if (typeof inventory.url === "string") {
      if (seenInventoryUrls.has(inventory.url)) {
        errors.push(`${recordPath}.url: duplicate site-inventory URL`);
      }
      seenInventoryUrls.add(inventory.url);
    }
  }

  for (const [index, keyword] of (document.keywords ?? []).entries()) {
    const recordPath = `keywords[${index}]`;
    if (!isObjectRecord(keyword)) continue;
    if (typeof keyword.query === "string" && keyword.query !== keyword.query.trim()) {
      errors.push(`${recordPath}.query: leading or trailing whitespace is not allowed`);
    }
    const expectedNormalizedQuery = normalizeQueryText(keyword.query);
    if (
      typeof keyword.normalizedQuery === "string" &&
      keyword.normalizedQuery !== expectedNormalizedQuery
    ) {
      errors.push(
        `${recordPath}.normalizedQuery: expected normalized query "${expectedNormalizedQuery}" from query`,
      );
    }

    const metrics = keyword.metrics;
    if (metrics && typeof metrics === "object" && !Array.isArray(metrics)) {
      const trendPeriods = new Set();
      for (const [trendIndex, trend] of (Array.isArray(metrics.trend) ? metrics.trend : []).entries()) {
        if (!trend || typeof trend !== "object" || Array.isArray(trend)) continue;
        const period = `${trend.year}-${trend.month}`;
        if (trendPeriods.has(period)) {
          errors.push(`${recordPath}.metrics.trend[${trendIndex}]: duplicate year/month period ${period}`);
        }
        trendPeriods.add(period);
      }

      if (metrics.dataStatus === "live") {
        if (!Number.isInteger(metrics.monthlySearches) || metrics.monthlySearches < 0) {
          errors.push(`${recordPath}.metrics.monthlySearches: live metrics require measured volume`);
        }
        if (!referencedSourceTypes(keyword, sourceById).has("search-provider")) {
          errors.push(`${recordPath}.sourceObservationRefs: live metrics require search-provider provenance`);
        }
      }
      if (metrics.dataStatus === "fixture-only" || metrics.dataStatus === "unavailable") {
        for (const field of ["monthlySearches", "cpc", "paidCompetition", "difficulty"]) {
          if (metrics[field] !== null) {
            errors.push(`${recordPath}.metrics.${field}: ${metrics.dataStatus} metrics must use null`);
          }
        }
        if (Array.isArray(metrics.trend) && metrics.trend.length !== 0) {
          errors.push(`${recordPath}.metrics.trend: ${metrics.dataStatus} metrics must use an empty array`);
        }
      }
    }
  }

  for (const [index, cluster] of (document.clusters ?? []).entries()) {
    const recordPath = `clusters[${index}]`;
    if (!isObjectRecord(cluster)) continue;
    if (Array.isArray(cluster.keywordIds) && !cluster.keywordIds.includes(cluster.primaryKeywordId)) {
      errors.push(`${recordPath}.primaryKeywordId: primary keyword must also appear in keywordIds`);
    }
    for (const [keywordIndex, keywordId] of (cluster.keywordIds ?? []).entries()) {
      const keyword = keywordById.get(keywordId);
      if (keyword && keyword.clusterId !== cluster.id) {
        errors.push(
          `${recordPath}.keywordIds[${keywordIndex}]: keyword "${keywordId}" points to cluster "${keyword.clusterId}"`,
        );
      }
    }
  }

  for (const [index, serp] of (document.serpEvidence ?? []).entries()) {
    const recordPath = `serpEvidence[${index}]`;
    if (!isObjectRecord(serp)) continue;
    const resultCount = Array.isArray(serp.resultUrls) ? serp.resultUrls.length : 0;
    const featureCount = Array.isArray(serp.features) ? serp.features.length : 0;
    if (serp.dataStatus === "public-search-observed") {
      if (serp.location !== PUBLIC_SEARCH_LOCATION) {
        errors.push(`${recordPath}.location: public search must use "${PUBLIC_SEARCH_LOCATION}"`);
      }
      if (serp.device !== "unknown") {
        errors.push(`${recordPath}.device: public-search-observed evidence must use unknown`);
      }
      if (resultCount === 0) {
        errors.push(`${recordPath}.resultUrls: public-search-observed evidence requires results`);
      }
      if (!referencedSourceTypes(serp, sourceById).has("public-serp")) {
        errors.push(`${recordPath}.sourceObservationRefs: public search evidence requires public-serp provenance`);
      }
    } else if (serp.dataStatus === "live") {
      if (serp.location !== TORONTO_LOCATION) {
        errors.push(`${recordPath}.location: expected "${TORONTO_LOCATION}"`);
      }
      if (serp.device === "unknown") {
        errors.push(`${recordPath}.device: live provider evidence requires an observed device`);
      }
      if (resultCount === 0) {
        errors.push(`${recordPath}.resultUrls: live provider evidence requires results`);
      }
      if (!referencedSourceTypes(serp, sourceById).has("search-provider")) {
        errors.push(`${recordPath}.sourceObservationRefs: live SERP evidence requires search-provider provenance`);
      }
    } else if (serp.dataStatus === "fixture-only" || serp.dataStatus === "unavailable") {
      if (serp.location !== TORONTO_LOCATION) {
        errors.push(`${recordPath}.location: expected "${TORONTO_LOCATION}"`);
      }
      if (resultCount !== 0) {
        errors.push(`${recordPath}.resultUrls: ${serp.dataStatus} evidence must use an empty array`);
      }
      if (featureCount !== 0) {
        errors.push(`${recordPath}.features: ${serp.dataStatus} evidence must use an empty array`);
      }
    }
  }

  for (const [index, opportunity] of (document.pageOpportunities ?? []).entries()) {
    if (!isObjectRecord(opportunity)) continue;
    if (opportunity.existingUrl === null && opportunity.proposedUrl === null) {
      errors.push(`pageOpportunities[${index}]: expected an existingUrl or proposedUrl decision`);
    }
  }

  for (const [index, question] of (document.aiQuestions ?? []).entries()) {
    const recordPath = `aiQuestions[${index}]`;
    if (!isObjectRecord(question)) continue;
    if (
      typeof question.question === "string" &&
      (question.question !== question.question.trim() || !QUESTION_PATTERN.test(question.question))
    ) {
      errors.push(`${recordPath}.question: expected an interrogative question ending with ?`);
    }
    if (question.volumeClaimed !== false) {
      errors.push(`${recordPath}.volumeClaimed: requirements-only trial questions must use false`);
      const exactQuery = normalizeQueryText(question.question?.replace(/\?$/, ""));
      const supportingKeyword = (document.keywords ?? []).find(
        (keyword) =>
          keyword.clusterId === question.clusterId &&
          keyword.normalizedQuery === exactQuery &&
          keyword.metrics?.dataStatus === "live" &&
          Number.isInteger(keyword.metrics?.monthlySearches),
      );
      if (!supportingKeyword) {
        errors.push(
          `${recordPath}.volumeClaimed: no exact normalized live keyword query supports a volume claim`,
        );
      }
    }
  }

  for (const [index, claim] of (document.claims ?? []).entries()) {
    const recordPath = `claims[${index}]`;
    if (!isObjectRecord(claim)) continue;
    if (claim.status === "prohibited" && claim.allowedUsage !== "never") {
      errors.push(`${recordPath}.allowedUsage: prohibited claims must use never`);
    }
    if (
      (claim.status === "provisional-unverified" || claim.status === "requires-review") &&
      claim.allowedUsage === "approved-public-use"
    ) {
      errors.push(`${recordPath}.allowedUsage: unapproved claims cannot use approved-public-use`);
    }
  }

  for (const [index, brief] of (document.briefs ?? []).entries()) {
    if (!isObjectRecord(brief)) continue;
    const seenSectionIds = new Set();
    for (const [sectionIndex, section] of (brief.sectionRequirements ?? []).entries()) {
      if (seenSectionIds.has(section.id)) {
        errors.push(
          `briefs[${index}].sectionRequirements[${sectionIndex}].id: duplicate section identifier`,
        );
      }
      seenSectionIds.add(section.id);
    }
  }
}

function validateAuthorization(manifest, errors) {
  const authorization = manifest?.authorization;
  const expectedFields = [
    "siteMode",
    "cmsMode",
    "repositorySourceMode",
    "platformMode",
    "externalAccountMode",
    "allowedWrites",
  ];
  validateExactFields(authorization, { requiredFields: expectedFields }, "manifest.authorization", errors);
  for (const field of expectedFields.slice(0, -1)) {
    if (authorization?.[field] !== "read-only") {
      errors.push(`manifest.authorization.${field}: expected read-only, received ${authorization?.[field]}`);
    }
  }
  if (
    !Array.isArray(authorization?.allowedWrites) ||
    authorization.allowedWrites.length !== 1 ||
    authorization.allowedWrites[0] !== "research-artifacts"
  ) {
    errors.push("manifest.authorization.allowedWrites: expected only the research-artifacts boundary");
  }
  if (!Array.isArray(manifest?.mutations) || manifest.mutations.length !== 0) {
    errors.push("manifest.mutations: expected an empty array");
  }
}

export function validateResearchPackage(document) {
  const errors = [];
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    return ["package: expected a JSON object"];
  }

  if (
    document.contractVersion !== "1.0.0" ||
    document.contractVersion !== VOCABULARIES.contractVersion ||
    document.contractVersion !== RECORD_CONTRACTS.contractVersion
  ) {
    errors.push('contractVersion: expected matching "1.0.0" contracts');
  }
  if (typeof document.packageId !== "string" || !STABLE_ID_PATTERN.test(document.packageId)) {
    errors.push("packageId: expected a stable kebab-case identifier");
  }
  validateTimestamp(document.generatedAt, "generatedAt", errors);

  const rootFields = new Set(["contractVersion", "packageId", "generatedAt", "manifest", ...REQUIRED_COLLECTIONS]);
  for (const field of rootFields) {
    if (!Object.hasOwn(document, field)) errors.push(`${field}: required package field is missing`);
  }
  for (const field of Object.keys(document)) {
    if (!rootFields.has(field)) errors.push(`${field}: field is not allowed by the package contract`);
  }

  if (!document.manifest || typeof document.manifest !== "object" || Array.isArray(document.manifest)) {
    errors.push("manifest: expected an object");
  } else {
    validateExactFields(document.manifest, RECORD_CONTRACTS.manifest, "manifest", errors);
    validateClassifications(document.manifest, RECORD_CONTRACTS.manifest, "manifest", errors);
    validateRecordTypes(document.manifest, RECORD_CONTRACTS.manifest, "manifest", errors);
    validateAuthorization(document.manifest, errors);
    validateManifestOperations(document, errors);
    if (typeof document.manifest.runId !== "string" || !STABLE_ID_PATTERN.test(document.manifest.runId)) {
      errors.push("manifest.runId: expected a stable kebab-case identifier");
    }
  }

  for (const [collection, contract] of Object.entries(COLLECTION_CONTRACTS)) {
    if (!Array.isArray(document[collection])) {
      errors.push(`${collection}: expected an array`);
      continue;
    }
    document[collection].forEach((record, index) => {
      const recordPath = `${collection}[${index}]`;
      validateExactFields(record, contract, recordPath, errors);
      validateClassifications(record, contract, recordPath, errors);
      validateRecordTypes(record, contract, recordPath, errors);
      if (collection === "keywords" || collection === "pageOpportunities") {
        validatePersonaAndExclusion(record, recordPath, errors);
      }
    });
  }

  validateStableIds(document, errors);
  validateReferences(document, errors);
  validateScores(document, errors);
  validateCanonicalInvariants(document, errors);
  validateBriefBoundaries(document, errors);
  findProhibitedContent(document, "", errors);
  return errors;
}

function runCli(argv) {
  const inputPath = argv[2];
  if (!inputPath) {
    console.error("Usage: validate-research-package.mjs <research-package.json>");
    return 2;
  }
  let document;
  try {
    document = JSON.parse(fs.readFileSync(path.resolve(inputPath), "utf8"));
  } catch (error) {
    console.error(`INVALID unable to read JSON: ${error.message}`);
    return 1;
  }
  const errors = validateResearchPackage(document);
  if (errors.length > 0) {
    console.error(`INVALID ${document.packageId ?? path.basename(inputPath)}`);
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(`VALID ${document.packageId}`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runCli(process.argv);
}
