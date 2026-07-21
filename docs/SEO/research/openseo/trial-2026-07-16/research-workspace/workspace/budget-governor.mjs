const PRECISION = 1_000_000;

const PAID_OPERATION_CATALOG = Object.freeze({
  dataforseo_labs_google_keyword_overview: Object.freeze({
    tool: "get_keyword_metrics",
    workstreams: Object.freeze(["tracer", "expansion-higher-funnel"]),
    absoluteMinimumCost: 0.01212,
    deriveCost(args) {
      const keywords = requireNonEmptyStringArray(args?.keywords, "keywords", 700);
      const clickstreamMultiplier = args?.includeClickstreamData === true ? 2 : 1;
      return money((0.012 + 0.00012 * keywords.length) * clickstreamMultiplier);
    },
  }),
  openseo_research_keywords_labs: Object.freeze({
    tool: "research_keywords",
    workstreams: Object.freeze([
      "five-plus-unit-multiplex-mli-select",
      "garden-laneway-suite-financing",
      "drawflow-builder-financing",
      "b2b-partner-referral",
      "expansion-higher-funnel",
    ]),
    absoluteMinimumCost: 0.09,
    deriveCost(args) {
      if (!Array.isArray(args?.seeds) || args.seeds.length < 1 || args.seeds.length > 5) {
        throw new Error("seeds must contain between 1 and 5 entries");
      }
      for (const [index, seed] of args.seeds.entries()) {
        if (typeof seed?.seed !== "string" || !seed.seed.trim()) {
          throw new Error(`seeds[${index}].seed must be a non-empty string`);
        }
      }
      const resultLimit = args.resultLimit ?? 150;
      if (![150, 300, 500].includes(resultLimit)) {
        throw new Error("resultLimit must be one of 150, 300, or 500");
      }
      const clickstreamMultiplier = args.includeClickstreamData === true ? 2 : 1;
      // OpenSEO fans each seed out to three Labs endpoints. Account-specific
      // pricing observed for the trial was $0.012/request plus $0.00012/row.
      return money(
        args.seeds.length * (0.036 + 0.00036 * resultLimit) * clickstreamMultiplier,
      );
    },
  }),
  serp_organic_live_advanced: Object.freeze({
    tool: "get_serp_results",
    workstreams: Object.freeze(["verification-reserve", "expansion-higher-funnel"]),
    absoluteMinimumCost: 0.02,
    deriveCost(args) {
      if (!Array.isArray(args?.queries) || args.queries.length < 1 || args.queries.length > 10) {
        throw new Error("queries must contain between 1 and 10 entries");
      }
      for (const [index, query] of args.queries.entries()) {
        if (typeof query?.keyword !== "string" || !query.keyword.trim()) {
          throw new Error(`queries[${index}].keyword must be a non-empty string`);
        }
      }
      // Ten times the observed $0.002 request price, preserving the trial's
      // deliberately conservative provider-error/retry allowance.
      return money(0.02 * args.queries.length);
    },
  }),
  dataforseo_labs_google_serp_competitors: Object.freeze({
    tool: "find_serp_competitors",
    workstreams: Object.freeze(["verification-reserve", "expansion-higher-funnel"]),
    absoluteMinimumCost: 0.01212,
    deriveCost(args) {
      requireNonEmptyStringArray(args?.keywords, "keywords", 100);
      const limit = args?.limit ?? 50;
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new Error("limit must be an integer between 1 and 100");
      }
      return money(0.012 + 0.00012 * limit);
    },
  }),
});

function money(value) {
  return Math.round((value + Number.EPSILON) * PRECISION) / PRECISION;
}

function requireNonEmptyStringArray(value, label, maximumLength) {
  if (!Array.isArray(value) || value.length < 1 || value.length > maximumLength) {
    throw new Error(`${label} must contain between 1 and ${maximumLength} entries`);
  }
  for (const [index, entry] of value.entries()) {
    if (typeof entry !== "string" || !entry.trim()) {
      throw new Error(`${label}[${index}] must be a non-empty string`);
    }
  }
  return value;
}

function isKnownCost(value) {
  return Number.isFinite(value) && value >= 0;
}

function formatMoney(value) {
  return String(money(value));
}

function catalogEntry(endpoint) {
  return typeof endpoint === "string" ? PAID_OPERATION_CATALOG[endpoint] : undefined;
}

function hasWorkstream(plan, workstream) {
  return Object.hasOwn(plan?.envelopes ?? {}, workstream);
}

export function deriveConservativePaidCost({ endpoint, tool, args }) {
  const definition = catalogEntry(endpoint);
  if (!definition) {
    return {
      status: "blocked",
      cost: null,
      reasons: [`paid endpoint ${JSON.stringify(endpoint)} is not allowlisted`],
    };
  }
  if (tool !== definition.tool) {
    return {
      status: "blocked",
      cost: null,
      reasons: [
        `endpoint ${JSON.stringify(endpoint)} requires tool ${JSON.stringify(definition.tool)}; received ${JSON.stringify(tool)}`,
      ],
    };
  }

  try {
    const cost = definition.deriveCost(args);
    if (!isKnownCost(cost) || cost < definition.absoluteMinimumCost) {
      return {
        status: "blocked",
        cost: null,
        reasons: [`catalog derivation for ${JSON.stringify(endpoint)} did not produce a safe cost`],
      };
    }
    return { status: "approved", cost, reasons: [] };
  } catch (error) {
    return {
      status: "blocked",
      cost: null,
      reasons: [
        `cannot derive a conservative cost for ${JSON.stringify(endpoint)}: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

export function validateBudgetPlan(plan) {
  const errors = [];

  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    return ["budget plan must be an object"];
  }

  if (plan.currency !== "USD") {
    errors.push('budget plan currency must be "USD"');
  }

  for (const field of ["includedBalance", "hardCeiling", "externalReserve"]) {
    if (!isKnownCost(plan[field])) {
      errors.push(`${field} must be a known non-negative finite number`);
    }
  }

  if (!plan.envelopes || typeof plan.envelopes !== "object" || Array.isArray(plan.envelopes)) {
    errors.push("envelopes must be an object");
    return errors;
  }

  const envelopeEntries = Object.entries(plan.envelopes);
  if (envelopeEntries.length === 0) {
    errors.push("at least one workstream envelope is required");
  }

  for (const [workstream, ceiling] of envelopeEntries) {
    if (!workstream.trim()) {
      errors.push("workstream envelope names must not be blank");
    }
    if (!isKnownCost(ceiling)) {
      errors.push(`envelope ${JSON.stringify(workstream)} must be a known non-negative finite number`);
    }
  }

  if (envelopeEntries.every(([, ceiling]) => isKnownCost(ceiling)) && isKnownCost(plan.hardCeiling)) {
    const envelopeTotal = money(envelopeEntries.reduce((sum, [, ceiling]) => sum + ceiling, 0));
    if (envelopeTotal > plan.hardCeiling) {
      errors.push(
        `envelope total ${formatMoney(envelopeTotal)} exceeds hard ceiling ${formatMoney(plan.hardCeiling)}`,
      );
    }
  }

  if (
    isKnownCost(plan.includedBalance) &&
    isKnownCost(plan.hardCeiling) &&
    isKnownCost(plan.externalReserve) &&
    money(plan.hardCeiling + plan.externalReserve) > plan.includedBalance
  ) {
    errors.push(
      `hard ceiling plus external reserve ${formatMoney(plan.hardCeiling + plan.externalReserve)} exceeds included balance ${formatMoney(plan.includedBalance)}`,
    );
  }

  return errors;
}

export function reconcileBudget(plan, ledger = []) {
  const errors = [...validateBudgetPlan(plan)];
  const events = Array.isArray(ledger) ? ledger : [];
  const seenIds = new Set();
  const byWorkstream = Object.fromEntries(
    Object.keys(plan?.envelopes ?? {}).map((workstream) => [workstream, { spent: 0, committed: 0 }]),
  );

  if (!Array.isArray(ledger)) {
    errors.push("spend ledger must be an array");
  }

  let spent = 0;
  let committed = 0;

  for (const [index, event] of events.entries()) {
    const label = `spend event ${index + 1}`;
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      errors.push(`${label} must be an object`);
      continue;
    }

    if (typeof event.id !== "string" || !event.id.trim()) {
      errors.push(`${label} id must be a non-empty string`);
    } else if (seenIds.has(event.id)) {
      errors.push(`duplicate spend event id ${JSON.stringify(event.id)}`);
    } else {
      seenIds.add(event.id);
    }

    if (!hasWorkstream(plan, event.workstream)) {
      errors.push(`${label} has unknown workstream ${JSON.stringify(event.workstream)}`);
      continue;
    }

    const definition = catalogEntry(event.endpoint);
    if (!definition) {
      errors.push(`${label} has non-allowlisted paid endpoint ${JSON.stringify(event.endpoint)}`);
    } else if (event.tool !== definition.tool) {
      errors.push(
        `${label} endpoint ${JSON.stringify(event.endpoint)} requires tool ${JSON.stringify(definition.tool)}; received ${JSON.stringify(event.tool)}`,
      );
    } else if (!definition.workstreams.includes(event.workstream)) {
      errors.push(
        `${label} endpoint ${JSON.stringify(event.endpoint)} is not authorized for workstream ${JSON.stringify(event.workstream)}`,
      );
    }

    if (!isKnownCost(event.estimatedCost)) {
      errors.push(`${label} estimated cost must be a known non-negative finite number`);
      continue;
    }

    if (definition && event.estimatedCost < definition.absoluteMinimumCost) {
      errors.push(
        `${label} estimated cost ${formatMoney(event.estimatedCost)} is below catalog minimum ${formatMoney(definition.absoluteMinimumCost)}`,
      );
      continue;
    }

    if (
      event.catalogMinimumCost !== undefined &&
      (!isKnownCost(event.catalogMinimumCost) || event.estimatedCost < event.catalogMinimumCost)
    ) {
      errors.push(`${label} estimated cost is below its recorded catalog minimum`);
      continue;
    }

    if (event.actualCost !== null && event.actualCost !== undefined && !isKnownCost(event.actualCost)) {
      errors.push(`${label} actual cost must be null or a known non-negative finite number`);
      continue;
    }

    const hasReturnedCost = isKnownCost(event.actualCost);
    const eventSpent = hasReturnedCost ? event.actualCost : 0;
    const eventCommitted = hasReturnedCost ? event.actualCost : event.estimatedCost;

    spent = money(spent + eventSpent);
    committed = money(committed + eventCommitted);
    byWorkstream[event.workstream].spent = money(byWorkstream[event.workstream].spent + eventSpent);
    byWorkstream[event.workstream].committed = money(
      byWorkstream[event.workstream].committed + eventCommitted,
    );
  }

  for (const [workstream, totals] of Object.entries(byWorkstream)) {
    const ceiling = plan?.envelopes?.[workstream];
    if (isKnownCost(ceiling) && totals.committed > ceiling) {
      errors.push(
        `workstream ${JSON.stringify(workstream)} committed cost ${formatMoney(totals.committed)} exceeds envelope ${formatMoney(ceiling)}`,
      );
    }
  }

  if (isKnownCost(plan?.hardCeiling) && committed > plan.hardCeiling) {
    errors.push(
      `committed cost ${formatMoney(committed)} exceeds hard ceiling ${formatMoney(plan.hardCeiling)}`,
    );
  }

  return {
    currency: plan?.currency ?? null,
    spent,
    committed,
    remaining: isKnownCost(plan?.hardCeiling) ? money(plan.hardCeiling - committed) : null,
    byWorkstream,
    errors,
  };
}

export function evaluatePaidCall({
  plan,
  ledger = [],
  workstream,
  endpoint,
  tool,
  args,
  estimatedCost,
}) {
  const reconciled = reconcileBudget(plan, ledger);
  const reasons = [...reconciled.errors];

  const catalogDecision = deriveConservativePaidCost({ endpoint, tool, args });
  reasons.push(...catalogDecision.reasons);

  if (!hasWorkstream(plan, workstream)) {
    reasons.push(`unknown workstream ${JSON.stringify(workstream)}`);
  }
  const definition = catalogEntry(endpoint);
  if (definition && !definition.workstreams.includes(workstream)) {
    reasons.push(
      `endpoint ${JSON.stringify(endpoint)} is not authorized for workstream ${JSON.stringify(workstream)}`,
    );
  }
  if (!isKnownCost(estimatedCost)) {
    reasons.push("estimated cost must be a known non-negative finite number");
  } else if (isKnownCost(catalogDecision.cost) && estimatedCost < catalogDecision.cost) {
    reasons.push(
      `caller estimate ${formatMoney(estimatedCost)} is below catalog-derived cost ${formatMoney(catalogDecision.cost)}`,
    );
  }

  const authoritativeEstimatedCost =
    isKnownCost(estimatedCost) && isKnownCost(catalogDecision.cost)
      ? money(Math.max(estimatedCost, catalogDecision.cost))
      : null;

  const priorWorkstreamCommitment = reconciled.byWorkstream?.[workstream]?.committed ?? 0;
  const workstreamCommittedAfter = isKnownCost(authoritativeEstimatedCost)
    ? money(priorWorkstreamCommitment + authoritativeEstimatedCost)
    : priorWorkstreamCommitment;
  const totalCommittedAfter = isKnownCost(authoritativeEstimatedCost)
    ? money(reconciled.committed + authoritativeEstimatedCost)
    : reconciled.committed;

  if (
    hasWorkstream(plan, workstream) &&
    isKnownCost(authoritativeEstimatedCost) &&
    workstreamCommittedAfter > plan.envelopes[workstream]
  ) {
    reasons.push(
      `workstream commitment ${formatMoney(workstreamCommittedAfter)} exceeds envelope ${formatMoney(plan.envelopes[workstream])}`,
    );
  }
  if (
    isKnownCost(plan?.hardCeiling) &&
    isKnownCost(authoritativeEstimatedCost) &&
    totalCommittedAfter > plan.hardCeiling
  ) {
    reasons.push(
      `total commitment ${formatMoney(totalCommittedAfter)} exceeds hard ceiling ${formatMoney(plan.hardCeiling)}`,
    );
  }

  return {
    status: reasons.length === 0 ? "approved" : "blocked",
    reasons,
    catalogMinimumCost: catalogDecision.cost,
    authoritativeEstimatedCost,
    workstreamCommittedAfter,
    totalCommittedAfter,
  };
}
