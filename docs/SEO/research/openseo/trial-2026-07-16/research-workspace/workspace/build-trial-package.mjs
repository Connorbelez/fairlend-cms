#!/usr/bin/env node

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspace = dirname(fileURLToPath(import.meta.url));
const runDirectory = join(workspace, "run");
const rawDirectory = join(runDirectory, "raw");
const sourceDirectory = join(workspace, "source-evidence");
const outputDirectory =
  "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/trial-2026-07-16/deliverables";
const generatedAt = "2026-07-16T23:50:00-04:00";
const localObservedAt = "2026-07-16T23:40:00-04:00";

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeText(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

async function writeJson(path, value) {
  await writeText(path, JSON.stringify(value, null, 2));
}

function csvCell(value) {
  const rendered = Array.isArray(value)
    ? value.join(" | ")
    : value && typeof value === "object"
      ? JSON.stringify(value)
      : value ?? "";
  const text = String(rendered);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, columns) {
  return [columns.join(","), ...rows.map((row) => columns.map((key) => csvCell(row[key])).join(","))].join(
    "\n",
  );
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sum(values) {
  return Math.round(values.reduce((total, value) => total + value, 0) * 1_000_000) / 1_000_000;
}

const [
  liveSnapshot,
  auditSnapshot,
  publicSerpSnapshot,
  tracerInitial,
  tracerRetry,
  fiveResearch,
  gardenResearch,
  drawResearch,
  b2bResearch,
  openSeoSerps,
  openSeoSerpRetry,
  openSeoCompetitors,
  operationalLedger,
  balanceBefore,
  balanceAfter,
] = await Promise.all([
  readJson(join(sourceDirectory, "live-site-snapshot-2026-07-16.json")),
  readJson(join(sourceDirectory, "supplied-audit-snapshot-2026-07-14.json")),
  readJson(join(sourceDirectory, "public-serp-snapshot-2026-07-16.json")),
  readJson(join(rawDirectory, "tracer-keyword-metrics.json")),
  readJson(join(rawDirectory, "tracer-keyword-metrics-retry.json")),
  readJson(join(rawDirectory, "five-plus-research.json")),
  readJson(join(rawDirectory, "garden-research.json")),
  readJson(join(rawDirectory, "drawflow-research.json")),
  readJson(join(rawDirectory, "b2b-research.json")),
  readJson(join(rawDirectory, "representative-serps.json")),
  readJson(join(rawDirectory, "serp-retry-five.json")),
  readJson(join(rawDirectory, "portfolio-serp-competitors.json")),
  readJson(join(runDirectory, "spend-ledger.json")),
  readJson(join(runDirectory, "balance-before.json")),
  readJson(join(runDirectory, "balance-after.json")),
]);

const publicSerpMappings = [
  {
    keyword: "multiplex construction financing Toronto",
    slug: "multiplex",
    keywordId: "keyword-multiplex-construction-financing-toronto",
    sourceId: "source-public-serp-multiplex",
  },
  {
    keyword: "garden suite financing Toronto",
    slug: "garden",
    keywordId: "keyword-garden-suite-financing-toronto",
    sourceId: "source-public-serp-garden",
  },
  {
    keyword: "construction draw financing Ontario",
    slug: "draw",
    keywordId: "keyword-construction-draw-financing-ontario",
    sourceId: "source-public-serp-draw",
  },
  {
    keyword: "mortgage broker for realtors Toronto",
    slug: "partners",
    keywordId: "keyword-mortgage-broker-for-realtors-toronto",
    sourceId: "source-public-serp-partners",
  },
];

const publicSerpQueryByKeyword = new Map();
for (const query of publicSerpSnapshot.queries) {
  if (publicSerpQueryByKeyword.has(query.keyword)) {
    throw new Error(`Duplicate public SERP query: ${query.keyword}`);
  }
  publicSerpQueryByKeyword.set(query.keyword, query);
}
const expectedPublicSerpKeywords = new Set(publicSerpMappings.map((mapping) => mapping.keyword));
for (const keyword of publicSerpQueryByKeyword.keys()) {
  if (!expectedPublicSerpKeywords.has(keyword)) {
    throw new Error(`Unexpected public SERP query: ${keyword}`);
  }
}
const publicSerpRecords = publicSerpMappings.map((mapping) => {
  const query = publicSerpQueryByKeyword.get(mapping.keyword);
  if (!query) throw new Error(`Missing public SERP query: ${mapping.keyword}`);
  return { mapping, query };
});

function sourceObservation({
  id,
  sourceType,
  sourceTitle,
  sourceLocator,
  observationAnchor,
  excerpt,
  confidence = "high",
  capturedAt = localObservedAt,
}) {
  return {
    id,
    sourceType,
    sourceTitle,
    sourceLocator,
    capturedAt,
    observationAnchor,
    excerpt,
    confidence,
  };
}

const sourceObservations = [
  ...liveSnapshot.sourceObservations,
  ...auditSnapshot.sourceObservations,
  sourceObservation({
    id: "source-openseo-runtime",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO v0.0.28 self-hosted runtime",
    sourceLocator: "/Users/connor/Dev/open-seo",
    observationAnchor: "mcp-tools-list-and-project",
    excerpt:
      "The loopback MCP exposed 23 tools and the FairLend project used Canada 2124, English, with project ID 7a3d4821-d03c-4be6-aaba-293df92d8ca8.",
  }),
  sourceObservation({
    id: "source-codex-seo-methodology",
    sourceType: "methodology-skill",
    sourceTitle: "Codex SEO Universal SEO Analysis Skill",
    sourceLocator: "/Users/connor/.codex/skills/seo/SKILL.md",
    observationAnchor: "version-1.9.6-research-clustering-geo-planning-and-briefing-methods",
    excerpt:
      "AgriciDaniel's Codex SEO Universal SEO Analysis Skill version 1.9.6 supplied the intent classification, keyword clustering, page planning, GEO/AI-answer, claim/evidence, financial-compliance, and requirements-only briefing methods applied after OpenSEO collection. No installed artifact identifies itself as NotFair, so NotFair-specific workflow provenance remains unproven.",
  }),
  sourceObservation({
    id: "source-dataforseo-account-pricing",
    sourceType: "search-provider",
    sourceTitle: "DataForSEO account balance and price preflight",
    sourceLocator: join(runDirectory, "balance-before.json"),
    observationAnchor: "balance-and-relevant-price-table",
    excerpt:
      "The account started at USD 1.00 with zero day spend; relevant Labs pricing was USD 0.012 per request plus USD 0.00012 per result.",
    capturedAt: balanceBefore.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-tracer-initial",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO exact local long-tail tracer",
    sourceLocator: join(rawDirectory, "tracer-keyword-metrics.json"),
    observationAnchor: "get-keyword-metrics-empty-result",
    excerpt:
      "The exact query multiplex construction financing Toronto returned no metric row; null or absence was retained rather than converted to zero.",
    confidence: "high",
    capturedAt: tracerInitial.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-tracer-metrics",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO live keyword-metrics tracer retry",
    sourceLocator: join(rawDirectory, "tracer-keyword-metrics-retry.json"),
    observationAnchor: "three-exact-canada-keywords",
    excerpt:
      "Canada metrics returned garden suite volume 1,900, MLI Select 1,600, and construction financing 880 with CPC, competition, difficulty, and trends.",
    capturedAt: tracerRetry.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-five-plus-research",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO five-plus and MLI Select expansion",
    sourceLocator: join(rawDirectory, "five-plus-research.json"),
    observationAnchor: "two-seeds-300-fallback-idea-rows",
    excerpt:
      "Two Canada-English seeds returned 300 fallback idea rows; only three rows were MLI-specific and no returned row contained a multiplex unit modifier.",
    confidence: "high",
    capturedAt: fiveResearch.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-garden-research",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO garden and laneway expansion",
    sourceLocator: join(rawDirectory, "garden-research.json"),
    observationAnchor: "two-seeds-300-fallback-idea-rows",
    excerpt:
      "Two Canada-English seeds returned 300 fallback idea rows; Toronto garden-suite terms had live demand while financing-specific and Toronto laneway rows were absent.",
    confidence: "high",
    capturedAt: gardenResearch.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-drawflow-research",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO construction and builder-financing expansion",
    sourceLocator: join(rawDirectory, "drawflow-research.json"),
    observationAnchor: "two-seeds-300-fallback-idea-rows",
    excerpt:
      "Two Canada-English seeds returned 300 fallback idea rows with strong construction-finance demand but no returned keyword containing draw or the named DrawFlow mechanism.",
    confidence: "high",
    capturedAt: drawResearch.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-b2b-research",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO partner and referral expansion",
    sourceLocator: join(rawDirectory, "b2b-research.json"),
    observationAnchor: "one-seed-150-fallback-idea-rows",
    excerpt:
      "The partner seed returned 150 fallback idea rows dominated by consumer mortgage terms and no row containing referral, partnership, or collaboration language.",
    confidence: "high",
    capturedAt: b2bResearch.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-serp-failures",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO Toronto SERP sample failures",
    sourceLocator: join(rawDirectory, "representative-serps.json"),
    observationAnchor: "four-charged-failed-queries",
    excerpt:
      "All four Toronto organic SERP requests returned Internal SE Server Error and zero URLs; the USD 0.014 charge was preserved in the spend ledger.",
    confidence: "high",
    capturedAt: openSeoSerps.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-serp-retry-failure",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO Canada SERP retry failure",
    sourceLocator: join(rawDirectory, "serp-retry-five.json"),
    observationAnchor: "single-cost-undisclosed-timeout",
    excerpt:
      "A serial Canada-location retry timed out and returned no result URL or explicit cost receipt. The immediate provider balance was unchanged, so the USD 0.02 estimate remains committed pending later reconciliation rather than being recorded as zero cost.",
    confidence: "high",
    capturedAt: openSeoSerpRetry.capturedAt,
  }),
  sourceObservation({
    id: "source-openseo-mli-competitors",
    sourceType: "search-provider",
    sourceTitle: "OpenSEO Labs SERP competitor sample",
    sourceLocator: join(rawDirectory, "portfolio-serp-competitors.json"),
    observationAnchor: "mli-select-only-30-domains",
    excerpt:
      "The seven-keyword request returned 30 domains only for MLI Select; CMHC ranked first and commercial, expert, community, and video domains shared the result set.",
    confidence: "high",
    capturedAt: openSeoCompetitors.capturedAt,
  }),
  ...publicSerpRecords.map(({ mapping, query }) =>
    sourceObservation({
      id: mapping.sourceId,
      sourceType: "public-serp",
      sourceTitle: `Live public search sample: ${query.keyword}`,
      sourceLocator: join(sourceDirectory, "public-serp-snapshot-2026-07-16.json"),
      observationAnchor: `query-${mapping.slug}`,
      excerpt: query.interpretation,
      confidence: "medium",
      capturedAt: publicSerpSnapshot.capturedAt,
    }),
  ),
  sourceObservation({
    id: "source-official-cmhc-mli-select",
    sourceType: "official-source",
    sourceTitle: "CMHC MLI Select fact sheet",
    sourceLocator:
      "https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf",
    observationAnchor: "minimum-units-points-leverage-amortization",
    excerpt:
      "MLI Select requires at least five units and 50 points; new construction flexibilities may reach 95% LTC and 40, 45, or 50-year amortization by point level.",
  }),
  sourceObservation({
    id: "source-official-cmhc-mli-live",
    sourceType: "official-source",
    sourceTitle: "CMHC MLI Select live product page",
    sourceLocator:
      "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect",
    observationAnchor: "live-program-summary",
    excerpt:
      "The live page confirms five-plus-unit eligibility and point pathways for affordability, energy efficiency, and accessibility; current underwriting remains project-specific.",
  }),
  sourceObservation({
    id: "source-official-cmhc-premiums",
    sourceType: "official-source",
    sourceTitle: "CMHC multi-unit premium update",
    sourceLocator:
      "https://www.cmhc-schl.gc.ca/media-newsroom/notices/2025/cmhc-to-update-multi-unit-mortgage-loan-insurance-premiums",
    observationAnchor: "july-2025-risk-based-pricing",
    excerpt:
      "Multi-unit insurance premiums moved to a standardized risk-based structure on July 14, 2025; project premium calculations require current approved-lender inputs.",
  }),
  sourceObservation({
    id: "source-official-cmhc-aclp",
    sourceType: "official-source",
    sourceTitle: "CMHC Apartment Construction Loan Program",
    sourceLocator:
      "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/funding-programs/all-funding-programs/apartment-construction-loan-program/standard-rental-housing",
    observationAnchor: "eligibility-monthly-draws-takeout",
    excerpt:
      "The program requires at least five rental units and a minimum loan of CAD 1,000,000, uses monthly construction draws, and requires takeout arrangements.",
  }),
  sourceObservation({
    id: "source-official-cra-pbrh",
    sourceType: "official-source",
    sourceTitle: "CRA purpose-built rental housing rebate",
    sourceLocator:
      "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/gst-hst-rebates/new-residential-rental-property-rebate.html",
    observationAnchor: "qualifying-units-use-and-date-tests",
    excerpt:
      "The federal PBRH rebate generally applies to a building with at least four private apartment units, each with a private kitchen, bathroom, and living area, or at least ten private rooms or suites, together with the applicable 90-percent long-term-rental and date tests; tax-professional review remains required.",
  }),
  sourceObservation({
    id: "source-official-ontario-hst-2026",
    sourceType: "official-source",
    sourceTitle: "Ontario enhanced rental rebate backgrounder",
    sourceLocator: "https://budget.ontario.ca/2026/hst.html",
    observationAnchor: "pending-administration-and-date-window",
    excerpt:
      "Ontario described a temporary enhanced rental rebate with a potential provincial component up to CAD 80,000 per eligible unit; administration remained pending on June 24, 2026.",
  }),
  sourceObservation({
    id: "source-official-toronto-sixplex",
    sourceType: "official-source",
    sourceTitle: "Toronto By-law 654-2025 adoption notice",
    sourceLocator: "https://secure.toronto.ca/nm/api/individual/notice/6426.do",
    observationAnchor: "geographic-and-building-scope",
    excerpt:
      "Fiveplex and sixplex permissions apply only to qualifying low-rise lots in Toronto and East York and Ward 23 under specified zones and building forms.",
  }),
  sourceObservation({
    id: "source-official-toronto-development-charges",
    sourceType: "official-source",
    sourceTitle: "Toronto development charges overview",
    sourceLocator:
      "https://www.toronto.ca/city-government/budget-finances/city-finance/development-charges/development-charges-overview/",
    observationAnchor: "second-through-sixth-unit-exemption",
    excerpt:
      "Toronto states that, where not otherwise exempt, second through sixth units in developments up to six units are exempt from City development charges from July 24, 2025.",
  }),
  sourceObservation({
    id: "source-official-toronto-rental-program",
    sourceType: "official-source",
    sourceTitle: "Toronto Rental Housing Supply Program",
    sourceLocator:
      "https://www.toronto.ca/community-people/housing-shelter/building-affordable-homes/housing-initiatives/rental-housing-supply-program/",
    observationAnchor: "open-arrchi-and-pending-phase-two",
    excerpt:
      "ARRCHI applications were open while detailed Phase 2 timing remained pending; small-project eligibility requires direct City confirmation.",
  }),
  sourceObservation({
    id: "source-official-toronto-garden-suites",
    sourceType: "official-source",
    sourceTitle: "City of Toronto Garden Suites",
    sourceLocator:
      "https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/",
    observationAnchor: "definition-zoning-permit-and-site-tests",
    excerpt:
      "A garden suite is a detached self-contained ancillary unit generally in a rear yard without public-lane frontage and requires address-specific zoning, access, servicing, and permit review.",
  }),
  sourceObservation({
    id: "source-official-toronto-laneway-suites",
    sourceType: "official-source",
    sourceTitle: "City of Toronto Laneway Suites",
    sourceLocator:
      "https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/changing-lanes-laneway-suites-in-toronto/",
    observationAnchor: "public-lane-definition-and-site-tests",
    excerpt:
      "A laneway suite is a self-contained ancillary unit on the same lot as a principal house and abutting a public lane; qualification remains site-specific.",
  }),
  sourceObservation({
    id: "source-official-toronto-preapproved-suites",
    sourceType: "official-source",
    sourceTitle: "Toronto pre-approved garden and laneway plans",
    sourceLocator:
      "https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/pre-approved-garden-and-laneway-suite-plans/",
    observationAnchor: "site-specific-review-still-required",
    excerpt:
      "Pre-reviewed suite plans still require a building permit and site-specific zoning, access, grading, servicing, tree, and applicable-law review.",
  }),
  sourceObservation({
    id: "source-official-toronto-suite-dc-deferral",
    sourceType: "official-source",
    sourceTitle: "Toronto laneway and garden suite DC deferral",
    sourceLocator:
      "https://www.toronto.ca/services-payments/grants-incentives-rebates/laneway-garden-suite-development-charges-deferral-program/",
    observationAnchor: "deferral-and-discontinued-forgivable-loan",
    excerpt:
      "The City describes a 20-year development-charge deferral and states that the former Affordable Laneway Suites forgivable-loan program is discontinued.",
  }),
  sourceObservation({
    id: "source-official-toronto-short-term-rentals",
    sourceType: "official-source",
    sourceTitle: "Toronto short-term rental operator rules",
    sourceLocator:
      "https://www.toronto.ca/community-people/housing-shelter/rental-housing-rights-information/short-term-rentals/short-term-rental-operators-hosts/",
    observationAnchor: "under-28-days-principal-residence",
    excerpt:
      "Toronto defines short-term rental as under 28 consecutive days and restricts it to the operator's principal residence, including ancillary-suite-specific principal-residence rules.",
  }),
  sourceObservation({
    id: "source-official-cmhc-refinance",
    sourceType: "official-source",
    sourceTitle: "CMHC Refinance fact sheet",
    sourceLocator:
      "https://assets.cmhc-schl.gc.ca/sf/project/cmhc/pdfs/factsheets/new/cmhc-refinance.pdf",
    observationAnchor: "up-to-four-units-secondary-suite-boundary",
    excerpt:
      "CMHC Refinance can fund a qualifying self-contained suite within a property of up to four total units, up to 90% LTV and 30 years, with no rental under 90 days.",
  }),
  sourceObservation({
    id: "source-official-fcac-home-equity-options",
    sourceType: "official-source",
    sourceTitle: "Financial Consumer Agency of Canada — Borrowing against home equity",
    sourceLocator:
      "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/borrow-home-equity.html",
    observationAnchor: "refinance-second-mortgage-and-heloc-comparison",
    excerpt:
      "FCAC distinguishes mortgage refinancing, second mortgages, and home-equity lines of credit and warns that the home secures the debt; costs, repayment structure, credit availability, and risk require equivalent-assumption comparison.",
  }),
  sourceObservation({
    id: "source-official-fcac-heloc",
    sourceType: "official-source",
    sourceTitle: "Financial Consumer Agency of Canada — Home equity lines of credit",
    sourceLocator:
      "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/home-equity-line-credit.html",
    observationAnchor: "revolving-secured-credit-and-repayment-risk",
    excerpt:
      "FCAC describes a HELOC as revolving credit secured by the home and identifies repayment, interest, fees, borrowing-limit, and over-borrowing considerations relevant to a construction-funding comparison.",
  }),
  sourceObservation({
    id: "source-official-budget-secondary-suite-cancelled",
    sourceType: "official-source",
    sourceTitle: "Budget 2025 expenditure review annex",
    sourceLocator: "https://www.budget.canada.ca/2025/report-rapport/anx3-en.html",
    observationAnchor: "secondary-suite-loan-not-implemented",
    excerpt:
      "The proposed Canada Secondary Suite Loan Program was not operational and will not be implemented; older availability references are superseded.",
  }),
  sourceObservation({
    id: "source-official-cra-short-term-rental",
    sourceType: "official-source",
    sourceTitle: "CRA short-term-rental deduction rules",
    sourceLocator:
      "https://www.canada.ca/en/revenue-agency/news/newsroom/tax-tips/tax-tips-2025/changes-rules-eligible-deductions-short-term-rental-income.html",
    observationAnchor: "under-90-days-and-compliance",
    excerpt:
      "CRA uses a less-than-90-day definition for this tax rule and may deny deductions for periods when a rental violates applicable permission, registration, or licensing requirements.",
  }),
  sourceObservation({
    id: "source-official-ontario-aru-regulation",
    sourceType: "official-source",
    sourceTitle: "Ontario Regulation 462/24",
    sourceLocator: "https://www.ontario.ca/laws/regulation/r24462",
    observationAnchor: "additional-residential-unit-standards",
    excerpt:
      "Ontario additional-residential-unit standards address lot coverage and floor-space-index limits but do not prove that a specific property can accommodate a suite.",
  }),
  sourceObservation({
    id: "source-official-ontario-construction-act",
    sourceType: "official-source",
    sourceTitle: "Ontario Construction Act",
    sourceLocator: "https://www.ontario.ca/laws/statute/90c30",
    observationAnchor: "prompt-payment-and-holdback",
    excerpt:
      "Ontario's prompt-payment regime and ten-percent statutory holdback create timing constraints relevant to construction working-capital and draw planning.",
  }),
  sourceObservation({
    id: "source-official-canada-guaranty-draws",
    sourceType: "official-source",
    sourceTitle: "Canada Guaranty Progress Draw Advantage",
    sourceLocator: "https://www.canadaguaranty.ca/progress-draw-advantage/",
    observationAnchor: "cash-flow-review-inspections-holdbacks",
    excerpt:
      "The insurer describes plans, budgets, permits, cash-flow review, inspections, authorized draws, and lender-managed holdbacks in a residential insured construction mechanism.",
  }),
  sourceObservation({
    id: "source-official-rbc-construction-mortgage",
    sourceType: "official-source",
    sourceTitle: "RBC construction mortgage",
    sourceLocator: "https://www.rbcroyalbank.com/mortgages/building-your-own-house.html",
    observationAnchor: "milestone-draws-interest-and-holdbacks",
    excerpt:
      "RBC describes inspected milestone draws, interest on outstanding advances, lien holdbacks, and garden, laneway, duplex, and triplex applications.",
  }),
  sourceObservation({
    id: "source-official-fsra-referrals",
    sourceType: "official-source",
    sourceTitle: "FSRA mortgage brokerage disclosure requirements",
    sourceLocator:
      "https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-brokerage-disclosure-requirements",
    observationAnchor: "simple-referral-compensation-and-consent",
    excerpt:
      "FSRA distinguishes simple referrals from co-brokering and describes compensation, role, conflict, consent, and information-use disclosure requirements.",
  }),
  sourceObservation({
    id: "source-official-ontario-brokerage-public-relations",
    sourceType: "official-source",
    sourceTitle: "Ontario Regulation 188/08 — Mortgage Brokerages: Standards of Practice",
    sourceLocator: "https://www.ontario.ca/laws/regulation/080188",
    observationAnchor: "public-relations-materials-sections-5-through-8",
    excerpt:
      "Mortgage-brokerage public relations materials must use the authorized brokerage name and clearly and prominently disclose its licence number; false, misleading, or deceptive information is prohibited.",
  }),
  sourceObservation({
    id: "source-official-ontario-individual-public-relations",
    sourceType: "official-source",
    sourceTitle: "Ontario Regulation 187/08 — Mortgage Brokers and Agents: Standards of Practice",
    sourceLocator: "https://www.ontario.ca/laws/regulation/080187",
    observationAnchor: "individual-public-relations-identification",
    excerpt:
      "When a licensed broker or agent appears in public relations materials, the licensed name, prescribed licence-class title, and authorized brokerage name and licence number require clear and prominent attribution.",
  }),
  sourceObservation({
    id: "source-official-ontario-cost-of-borrowing-advertising",
    sourceType: "official-source",
    sourceTitle: "Ontario Regulation 191/08 — Cost of Borrowing and Disclosure to Borrowers",
    sourceLocator: "https://www.ontario.ca/laws/regulation/080191",
    observationAnchor: "fixed-amount-mortgage-advertising-section-18",
    excerpt:
      "A fixed-amount mortgage advertisement that represents an interest rate, payment, or non-interest charge must also disclose APR and term, with APR at least as prominent, and must use an identified representative example where terms vary.",
  }),
  sourceObservation({
    id: "source-official-reco-financial-benefits",
    sourceType: "official-source",
    sourceTitle: "RECO Bulletin 3.3 Financial Benefits",
    sourceLocator:
      "https://www.reco.on.ca/getmedia/d322a67c-8db8-4de7-bfbc-0811f5b9de71/RECO-Bulletin-3-3-Financial-benefits.pdf",
    observationAnchor: "direct-and-indirect-benefit-disclosure",
    excerpt:
      "Ontario real-estate registrants must disclose direct and indirect financial benefits, including benefits involving mortgage, appraisal, legal, and renovation providers.",
  }),
  sourceObservation({
    id: "source-official-toronto-multiplex-guide",
    sourceType: "official-source",
    sourceTitle: "Toronto multiplex conversion permit guide",
    sourceLocator:
      "https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/additional-dwelling-unit-guides/multiplex-conversion/",
    observationAnchor: "duplex-through-sixplex-professional-documents",
    excerpt:
      "The current Toronto guide covers duplex-through-sixplex permit documents and identifies qualified designer and engineer responsibilities.",
  }),
  sourceObservation({
    id: "source-qualitative-construction-funding-ontario",
    sourceType: "public-serp",
    sourceTitle: "Construction Funding Ontario",
    sourceLocator: "https://constructionfinancingontario.com/",
    observationAnchor: "stopped-draw-and-builder-language",
    excerpt:
      "The competitor uses Ontario market language around halted draws, lender payout, inspection conflict, unfinished builds, flexible schedules, builders, owners, and broker referrals.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-qualitative-cedar-faq",
    sourceType: "public-serp",
    sourceTitle: "Cedar Commercial construction-finance FAQ",
    sourceLocator: "https://cedarcommercial.ca/frequently-asked-questions/",
    observationAnchor: "interest-reserves-gaps-takeout",
    excerpt:
      "The FAQ samples market questions about interest reserves, holdback gaps, equity, cost overruns, stopped advances, takeout planning, and first-time developer documents.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-reddit-builder-material-credit",
    sourceType: "community-qualitative",
    sourceTitle: "Builder asks homeowner to finance materials",
    sourceLocator: "https://www.reddit.com/r/Homebuilding/comments/1qvtlmf/builder_wants_us_to_open_our_own_line_of_credit/",
    observationAnchor: "material-reimbursement-cash-flow-language",
    excerpt:
      "The thread supplies qualitative language about material reimbursement risk, supplier credit, and builder cash-flow pressure; geography and prevalence are not established.",
    confidence: "low",
  }),
  sourceObservation({
    id: "source-reddit-canada-construction-mortgage",
    sourceType: "community-qualitative",
    sourceTitle: "Canadian construction mortgage discussion",
    sourceLocator: "https://www.reddit.com/r/MortgagesCanada/comments/1rv8u1g/construction_mortgage/",
    observationAnchor: "draw-fees-tranches-holdback-refinance",
    excerpt:
      "The discussion samples questions about upfront cash, quotes, draw fees, inspections, private versus bank funding, holdbacks, occupancy, and refinance.",
    confidence: "low",
  }),
  sourceObservation({
    id: "source-reddit-gta-renovation-financing",
    sourceType: "community-qualitative",
    sourceTitle: "GTA renovation construction-mortgage question",
    sourceLocator: "https://www.reddit.com/r/homebuildingcanada/comments/1uq6ewy/construction_mortgage_for_gta_reno/",
    observationAnchor: "timing-builder-budget-and-referral",
    excerpt:
      "A current GTA question asks when to secure financing while permits and a builder budget are being finalized and mentions builder-to-specialist-broker referrals.",
    confidence: "low",
  }),
  sourceObservation({
    id: "source-search-lendsimpl-realtors",
    sourceType: "public-serp",
    sourceTitle: "Lendsimpl realtor partnership page",
    sourceLocator: "https://lendsimpl.ca/mortgage-broker-realtors-toronto",
    observationAnchor: "exact-audience-page-pattern",
    excerpt:
      "The exact-audience page samples Toronto realtor-partner terminology, client updates, complex profiles, referrals, co-branded tools, and pre-approval workflows; performance claims are unverified.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-search-first-source-partners",
    sourceType: "public-serp",
    sourceTitle: "First Source Mortgage partner and project-finance page",
    sourceLocator: "https://firstsourcemortgage.ca/",
    observationAnchor: "brokers-advisers-builders-developers",
    excerpt:
      "The Ontario lender page addresses mortgage brokers, real-estate advisers, builders, and developers, supporting separate borrower and partner routing terminology.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-search-tordon-construction",
    sourceType: "public-serp",
    sourceTitle: "Tordon construction mortgages",
    sourceLocator: "https://www.tordon.com/construction-mortgage",
    observationAnchor: "draw-based-commercial-page",
    excerpt:
      "The Ontario commercial page separates draw-based releases, progress inspections, milestone schedules, and completion financing, supporting commercial and process intent boundaries.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-search-insight-draw-guide",
    sourceType: "public-serp",
    sourceTitle: "Ontario construction draw mortgage guide",
    sourceLocator: "https://insightlawfirm.ca/construction-draw-mortgage-in-ontario/",
    observationAnchor: "informational-process-page",
    excerpt:
      "The guide addresses milestone funding, interest on advances, owner equity, and Ontario holdback risk, supporting a separate informational draw-mechanics intent.",
    confidence: "medium",
  }),
  sourceObservation({
    id: "source-user-positioning",
    sourceType: "user-supplied",
    sourceTitle: "Approved FairLend positioning and scope",
    sourceLocator:
      "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/trial-2026-07-16/research-contract.md",
    observationAnchor: "approved-positioning-and-claim-boundaries",
    excerpt:
      "FairLend is intended to operate end to end with a professional partner network, prioritize five-plus-unit projects, serve builder borrowers, and keep the DrawFlow 50% claim evidence-locked.",
    confidence: "high",
  }),
];

function expansionMap(document) {
  return new Map(
    document.data.results
      .flatMap((result) => result.rows)
      .map((row) => [row.keyword.trim().toLowerCase(), row]),
  );
}

const dataMaps = {
  tracer: new Map(
    tracerRetry.data.keywords.map((row) => [row.keyword.trim().toLowerCase(), row]),
  ),
  five: expansionMap(fiveResearch),
  garden: expansionMap(gardenResearch),
  draw: expansionMap(drawResearch),
  b2b: expansionMap(b2bResearch),
};

function liveMetrics(sourceKey, query) {
  if (!sourceKey) {
    return {
      dataStatus: "unavailable",
      monthlySearches: null,
      cpc: null,
      paidCompetition: null,
      difficulty: null,
      trend: [],
    };
  }
  const row = dataMaps[sourceKey].get(query.toLowerCase());
  if (!row) throw new Error(`Missing ${sourceKey} live row for ${query}`);
  const isTracer = sourceKey === "tracer";
  const trend = (isTracer ? row.monthly_searches : row.trend) ?? [];
  return {
    dataStatus: "live",
    monthlySearches: isTracer ? row.search_volume : row.searchVolume,
    cpc: row.cpc ?? null,
    paidCompetition: row.competition ?? null,
    difficulty: isTracer ? row.keyword_difficulty : row.keywordDifficulty,
    trend: trend.slice(0, 24).map((point) => ({
      year: point.year,
      month: point.month,
      monthlySearches: isTracer ? point.search_volume : point.searchVolume,
    })),
  };
}

const personaTiers = {
  "homeowner-citizen-developer": "tier-1",
  "build-to-hold-mli-select-developer": "tier-1",
  "multiplex-opportunity-purchaser": "tier-1",
  "garden-laneway-suite-homeowner": "tier-1",
  "builder-seeking-flexible-construction-financing": "tier-1",
  "bank-declined-viable-project-borrower": "tier-1",
  "mortgage-broker-referral-partner": "tier-2",
  "realtor-referral-partner": "tier-2",
  "professional-referral-partner": "tier-2",
};

const keywordScoreRationales = [];

function scoreTotal(components) {
  return { ...components, total: Object.values(components).reduce((total, value) => total + value, 0) };
}

function volumeDemandPoints(monthlySearches) {
  if (!Number.isFinite(monthlySearches)) return 0;
  if (monthlySearches >= 1_000) return 20;
  if (monthlySearches >= 500) return 17;
  if (monthlySearches >= 100) return 14;
  if (monthlySearches >= 50) return 11;
  if (monthlySearches >= 10) return 8;
  if (monthlySearches > 0) return 5;
  return 0;
}

function strategicPoints(clusterId) {
  if (["cluster-mli-select-program", "cluster-five-plus-construction-takeout"].includes(clusterId)) return 15;
  if (clusterId === "cluster-construction-financing-ontario") return 15;
  if (clusterId === "cluster-garden-laneway-financing") return 14;
  if (["cluster-draw-mechanics-cash-flow", "cluster-draw-pain-reimbursement-gaps"].includes(clusterId)) return 13;
  if (["cluster-garden-suite-feasibility", "cluster-construction-financing-comparison"].includes(clusterId)) return 11;
  if (clusterId === "cluster-stalled-project-rescue") return 8;
  if (["cluster-mortgage-realtor-referral", "cluster-professional-delivery-partners"].includes(clusterId)) return 7;
  if (clusterId === "cluster-two-to-four-unit-multiplex") return 5;
  return 6;
}

function computeKeywordScores({
  id,
  clusterId,
  persona,
  funnelStage,
  geography,
  intent,
  disposition,
  metrics,
  confidence,
  sourceRefs,
}) {
  const hasMetrics = metrics.dataStatus === "live" && Number.isFinite(metrics.monthlySearches);
  const hasPublicSerp = sourceRefs.some((reference) => reference.startsWith("source-public-serp-"));
  const officialSourceCount = sourceRefs.filter((reference) => reference.startsWith("source-official-")).length;
  const hasCommunity = sourceRefs.some(
    (reference) => reference.startsWith("source-reddit-") || reference.startsWith("source-qualitative-"),
  );
  const excluded = disposition === "exclude" || disposition === "down-rank";
  const evidenceConfidence = excluded
    ? hasMetrics
      ? 3
      : 1
    : Math.min(
        confidence === "high" ? 5 : confidence === "medium" ? 4 : 2,
        hasMetrics && officialSourceCount > 0 && hasPublicSerp
          ? 5
          : hasMetrics && officialSourceCount > 0
            ? 4
            : hasMetrics
              ? 3
              : hasPublicSerp && officialSourceCount > 0
                ? 3
                : officialSourceCount > 0
                  ? 2
                  : 1,
      );

  if (excluded) {
    const leadCaptureScore = scoreTotal({
      intentUrgency: 0,
      qualifiedLeadFit: 0,
      strategicFit: 0,
      localFit: 0,
      commercialEvidence: 0,
      attainability: 0,
      conversionClarity: 0,
      evidenceConfidence,
    });
    const authorityBuildScore = scoreTotal({
      researchDemand: 0,
      topicalImportance: 0,
      aiCitationOpportunity: 0,
      originalExpertise: 0,
      internalLinkValue: 0,
      linkworthiness: 0,
      attainability: 0,
      evidenceConfidence,
    });
    return {
      leadCaptureScore,
      authorityBuildScore,
      rationale: {
        model: "evidence-null-aware-v1",
        inputSummary: "Excluded or down-ranked traffic receives no opportunity value; evidence confidence records only the exclusion evidence quality.",
      },
    };
  }

  const intentUrgency =
    funnelStage === "immediate-transaction-problem"
      ? 24
      : funnelStage === "financing-qualification"
        ? intent === "transactional"
          ? 23
          : 20
        : funnelStage === "planning-comparison"
          ? 11
          : funnelStage === "project-feasibility"
            ? 7
            : 3;
  const qualifiedLeadFit =
    personaTiers[persona] === "tier-1" ? 18 : personaTiers[persona] === "tier-2" ? 11 : 5;
  const strategicFit = strategicPoints(clusterId);
  const localFit =
    geography === "toronto" ? 10 : geography === "gta" ? 9 : geography === "municipality" ? 7 : geography === "ontario" ? 7 : 4;
  let commercialEvidence = 0;
  if (hasMetrics) {
    commercialEvidence = Number.isFinite(metrics.cpc)
      ? metrics.cpc >= 10
        ? 8
        : metrics.cpc >= 5
          ? 7
          : metrics.cpc > 0
            ? 5
            : 2
      : intent === "commercial-investigation" || intent === "transactional"
        ? 3
        : 1;
    if (Number.isFinite(metrics.paidCompetition) && metrics.paidCompetition >= 0.5) {
      commercialEvidence = Math.min(9, commercialEvidence + 1);
    }
  } else if (hasPublicSerp) {
    commercialEvidence = 3;
  } else if (intent === "commercial-investigation" || intent === "transactional") {
    commercialEvidence = 1;
  }
  const attainability = Number.isFinite(metrics.difficulty)
    ? metrics.difficulty <= 10
      ? 6
      : metrics.difficulty <= 30
        ? 5
        : metrics.difficulty <= 60
          ? 3
          : 1
    : hasPublicSerp
      ? 2
      : 1;
  const conversionClarity = ["financing-qualification", "immediate-transaction-problem"].includes(
    funnelStage,
  )
    ? 5
    : funnelStage === "planning-comparison"
      ? 3
      : 2;

  const leadCaptureScore = scoreTotal({
    intentUrgency,
    qualifiedLeadFit,
    strategicFit,
    localFit,
    commercialEvidence,
    attainability,
    conversionClarity,
    evidenceConfidence,
  });

  const topicalImportance = strategicFit;
  const aiCitationOpportunity = officialSourceCount > 0
    ? intent === "informational"
      ? 14
      : 11
    : hasCommunity
      ? 8
      : hasPublicSerp
        ? 6
        : 3;
  const originalExpertise = sourceRefs.includes("source-user-positioning") ? 8 : officialSourceCount > 0 ? 5 : 3;
  const internalLinkValue = strategicFit >= 14 ? 10 : strategicFit >= 11 ? 8 : strategicFit >= 7 ? 6 : 4;
  const linkworthiness =
    intent === "informational" && officialSourceCount > 0
      ? 9
      : officialSourceCount > 0
        ? 6
        : hasCommunity
          ? 5
          : 3;
  const authorityBuildScore = scoreTotal({
    researchDemand: volumeDemandPoints(metrics.monthlySearches),
    topicalImportance,
    aiCitationOpportunity,
    originalExpertise,
    internalLinkValue,
    linkworthiness,
    attainability,
    evidenceConfidence,
  });

  return {
    leadCaptureScore,
    authorityBuildScore,
    rationale: {
      model: "evidence-null-aware-v1",
      inputSummary: `${hasMetrics ? `Measured volume ${metrics.monthlySearches}` : "Volume unavailable"}; ${Number.isFinite(metrics.cpc) ? `CPC ${metrics.cpc}` : "CPC unavailable"}; ${Number.isFinite(metrics.difficulty) ? `difficulty ${metrics.difficulty}` : "difficulty unavailable"}; public SERP ${hasPublicSerp ? "observed" : "not observed"}; official sources ${officialSourceCount}; confidence ${confidence}.`,
      evidenceCaps: "Missing metrics score zero for research demand; missing provider SERP caps attainability and commercial evidence; original-expertise points remain capped until FairLend evidence is supplied.",
    },
  };
}

function keywordRecord({
  id,
  query,
  seedConcept,
  clusterId,
  persona,
  personaDetail = null,
  financingTrigger,
  lifecycleStages,
  funnelStage,
  geography,
  intent,
  disposition = "include",
  exclusionReason = "not-excluded-qualified-project-financing-fit",
  sourceKey = null,
  sourceRefs,
  confidence = sourceKey ? "high" : "medium",
  serpFeatures = [],
}) {
  const metrics = liveMetrics(sourceKey, query);
  const scores = computeKeywordScores({
    id,
    clusterId,
    persona,
    funnelStage,
    geography,
    intent,
    disposition,
    metrics,
    confidence,
    sourceRefs,
  });
  keywordScoreRationales.push({
    recordType: "keyword",
    recordId: id,
    leadCaptureScore: scores.leadCaptureScore.total,
    authorityBuildScore: scores.authorityBuildScore.total,
    model: scores.rationale.model,
    inputSummary: scores.rationale.inputSummary,
    evidenceCaps: scores.rationale.evidenceCaps ?? "Excluded or down-ranked traffic receives no opportunity value.",
  });
  return {
    id,
    query,
    normalizedQuery: query.toLowerCase().replaceAll(/\s+/g, " ").trim(),
    seedConcept,
    clusterId,
    persona,
    personaDetail,
    personaTier:
      persona === "adjacent-discovered-other" ? "adjacent-discovered" : personaTiers[persona],
    financingTrigger,
    lifecycleStages,
    funnelHeadline: ["awareness-education", "project-feasibility", "planning-comparison"].includes(
      funnelStage,
    )
      ? "research"
      : "buying-signal",
    funnelStage,
    geography,
    intent,
    relevanceDisposition: disposition,
    exclusionReason,
    observedAt: sourceKey
      ? {
          tracer: tracerRetry.capturedAt,
          five: fiveResearch.capturedAt,
          garden: gardenResearch.capturedAt,
          draw: drawResearch.capturedAt,
          b2b: b2bResearch.capturedAt,
        }[sourceKey]
      : publicSerpSnapshot.capturedAt,
    metrics,
    serpFeatures,
    leadCaptureScore: scores.leadCaptureScore,
    authorityBuildScore: scores.authorityBuildScore,
    confidence,
    sourceObservationRefs: unique(sourceRefs),
  };
}

const keywords = [
  keywordRecord({
    id: "keyword-mli-select",
    query: "MLI Select",
    seedConcept: "five-plus-mli-select-program",
    clusterId: "cluster-mli-select-program",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "mli-select-takeout",
    lifecycleStages: ["feasibility-capital-takeout-planning", "institutional-takeout"],
    funnelStage: "project-feasibility",
    geography: "canada",
    intent: "informational",
    sourceKey: "tracer",
    sourceRefs: ["source-openseo-tracer-metrics", "source-official-cmhc-mli-select"],
  }),
  keywordRecord({
    id: "keyword-mli-select-financing",
    query: "MLI Select financing",
    seedConcept: "five-plus-mli-select-commercial",
    clusterId: "cluster-mli-select-program",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "mli-select-takeout",
    lifecycleStages: ["feasibility-capital-takeout-planning", "institutional-takeout"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "five",
    sourceRefs: ["source-openseo-five-plus-research", "source-official-cmhc-mli-select"],
  }),
  keywordRecord({
    id: "keyword-cmhc-mli-select-financing",
    query: "CMHC MLI Select financing",
    seedConcept: "five-plus-mli-select-commercial",
    clusterId: "cluster-mli-select-program",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "mli-select-takeout",
    lifecycleStages: ["feasibility-capital-takeout-planning", "institutional-takeout"],
    funnelStage: "planning-comparison",
    geography: "canada",
    intent: "informational",
    sourceKey: "five",
    sourceRefs: ["source-openseo-five-plus-research", "source-official-cmhc-mli-select"],
  }),
  keywordRecord({
    id: "keyword-mli-select-construction-financing",
    query: "MLI Select construction financing",
    seedConcept: "construction-to-insured-takeout",
    clusterId: "cluster-five-plus-construction-takeout",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: [
      "feasibility-capital-takeout-planning",
      "construction-financing-draws",
      "institutional-takeout",
    ],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "five",
    sourceRefs: [
      "source-openseo-five-plus-research",
      "source-official-cmhc-mli-select",
      "source-official-cmhc-aclp",
    ],
  }),
  keywordRecord({
    id: "keyword-multiplex-construction-financing-toronto",
    query: "multiplex construction financing Toronto",
    seedConcept: "toronto-five-plus-multiplex-financing",
    clusterId: "cluster-five-plus-construction-takeout",
    persona: "multiplex-opportunity-purchaser",
    financingTrigger: "construction-financing",
    lifecycleStages: [
      "property-identification-acquisition",
      "feasibility-capital-takeout-planning",
      "construction-financing-draws",
    ],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "transactional",
    sourceRefs: [
      "source-openseo-tracer-initial",
      "source-public-serp-multiplex",
      "source-official-toronto-sixplex",
    ],
    confidence: "medium",
    serpFeatures: ["commercial-specialist-pages", "integrated-design-finance-build-page"],
  }),
  keywordRecord({
    id: "keyword-construction-financing-toronto",
    query: "construction financing Toronto",
    seedConcept: "local-construction-financing",
    clusterId: "cluster-five-plus-construction-takeout",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceKey: "five",
    sourceRefs: ["source-openseo-five-plus-research", "source-public-serp-multiplex"],
  }),
  keywordRecord({
    id: "keyword-multi-family-construction-financing",
    query: "multi family construction financing",
    seedConcept: "five-plus-rental-construction",
    clusterId: "cluster-five-plus-construction-takeout",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws", "institutional-takeout"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-official-cmhc-aclp"],
  }),
  keywordRecord({
    id: "keyword-apartment-construction-financing",
    query: "apartment construction financing",
    seedConcept: "five-plus-rental-construction",
    clusterId: "cluster-five-plus-construction-takeout",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws", "institutional-takeout"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-official-cmhc-aclp"],
  }),
  keywordRecord({
    id: "keyword-fourplex-financing-toronto",
    query: "fourplex financing Toronto",
    seedConcept: "two-to-four-unit-residential-boundary",
    clusterId: "cluster-two-to-four-unit-multiplex",
    persona: "homeowner-citizen-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "project-feasibility",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceRefs: ["source-official-cmhc-refinance", "source-official-toronto-multiplex-guide"],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-duplex-construction-financing-toronto",
    query: "duplex construction financing Toronto",
    seedConcept: "two-to-four-unit-residential-boundary",
    clusterId: "cluster-two-to-four-unit-multiplex",
    persona: "homeowner-citizen-developer",
    financingTrigger: "construction-financing",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "project-feasibility",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceRefs: ["source-official-cmhc-refinance", "source-official-toronto-multiplex-guide"],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-garden-suite",
    query: "garden suite",
    seedConcept: "garden-suite-topic-demand",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "awareness-education",
    geography: "canada",
    intent: "informational",
    sourceKey: "tracer",
    sourceRefs: ["source-openseo-tracer-metrics", "source-official-toronto-garden-suites"],
  }),
  keywordRecord({
    id: "keyword-garden-suites-toronto",
    query: "garden suites Toronto",
    seedConcept: "toronto-garden-suite",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "project-feasibility",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research", "source-official-toronto-garden-suites"],
  }),
  keywordRecord({
    id: "keyword-toronto-garden-suites",
    query: "Toronto garden suites",
    seedConcept: "toronto-garden-suite",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "project-feasibility",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research", "source-official-toronto-garden-suites"],
  }),
  keywordRecord({
    id: "keyword-garden-suite-brampton",
    query: "garden suite Brampton",
    seedConcept: "gta-garden-suite",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "project-feasibility",
    geography: "municipality",
    intent: "navigational",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research"],
    confidence: "medium",
  }),
  keywordRecord({
    id: "keyword-garden-suite-mississauga",
    query: "garden suite Mississauga",
    seedConcept: "gta-garden-suite",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "project-feasibility",
    geography: "municipality",
    intent: "navigational",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research"],
    confidence: "medium",
  }),
  keywordRecord({
    id: "keyword-garden-suites-toronto-update",
    query: "garden suites Toronto update",
    seedConcept: "garden-suite-current-rules",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "awareness-education",
    geography: "toronto",
    intent: "informational",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research", "source-official-toronto-garden-suites"],
  }),
  keywordRecord({
    id: "keyword-garden-suite-financing-toronto",
    query: "garden suite financing Toronto",
    seedConcept: "garden-suite-financing",
    clusterId: "cluster-garden-laneway-financing",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: [
      "feasibility-capital-takeout-planning",
      "pre-construction-readiness",
      "construction-financing-draws",
    ],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "transactional",
    sourceRefs: [
      "source-openseo-garden-research",
      "source-public-serp-garden",
      "source-official-cmhc-refinance",
    ],
    confidence: "medium",
    serpFeatures: ["dedicated-financing-pages", "lender-product-pdf"],
  }),
  keywordRecord({
    id: "keyword-laneway-suite-financing-toronto",
    query: "laneway suite financing Toronto",
    seedConcept: "laneway-suite-financing",
    clusterId: "cluster-garden-laneway-financing",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: [
      "feasibility-capital-takeout-planning",
      "pre-construction-readiness",
      "construction-financing-draws",
    ],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "transactional",
    sourceRefs: [
      "source-openseo-garden-research",
      "source-public-serp-garden",
      "source-official-toronto-laneway-suites",
      "source-official-cmhc-refinance",
    ],
    confidence: "medium",
    serpFeatures: ["dedicated-financing-pages", "lender-product-pdf"],
  }),
  keywordRecord({
    id: "keyword-garden-suite-vs-airbnb-toronto",
    query: "garden suite vs Airbnb Toronto",
    seedConcept: "long-term-versus-short-term-rental",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning", "lease-up-stabilization"],
    funnelStage: "planning-comparison",
    geography: "toronto",
    intent: "informational",
    sourceRefs: [
      "source-official-toronto-short-term-rentals",
      "source-official-cra-short-term-rental",
      "source-official-cmhc-refinance",
    ],
    confidence: "medium",
  }),
  keywordRecord({
    id: "keyword-construction-financing",
    query: "construction financing",
    seedConcept: "builder-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "tracer",
    sourceRefs: ["source-openseo-tracer-metrics", "source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-mortgage",
    query: "construction mortgage",
    seedConcept: "builder-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-official-rbc-construction-mortgage"],
  }),
  keywordRecord({
    id: "keyword-construction-mortgage-ontario",
    query: "construction mortgage Ontario",
    seedConcept: "ontario-builder-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "ontario",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-public-serp-draw"],
  }),
  keywordRecord({
    id: "keyword-construction-financing-canada",
    query: "construction financing Canada",
    seedConcept: "builder-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-commercial-construction-loan",
    query: "commercial construction loan",
    seedConcept: "commercial-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-loan-toronto",
    query: "construction loan Toronto",
    seedConcept: "toronto-project-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-public-serp-draw"],
  }),
  keywordRecord({
    id: "keyword-construction-loan-lender",
    query: "construction loan lender",
    seedConcept: "construction-lender-selection",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "transactional",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-mortgage-lender",
    query: "construction mortgage lender",
    seedConcept: "construction-lender-selection",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "transactional",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-to-permanent-financing",
    query: "construction to permanent financing",
    seedConcept: "construction-takeout-comparison",
    clusterId: "cluster-construction-financing-comparison",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "stabilization-takeout",
    lifecycleStages: ["construction-financing-draws", "institutional-takeout"],
    funnelStage: "planning-comparison",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research", "source-search-insight-draw-guide"],
  }),
  keywordRecord({
    id: "keyword-builder-financing-construction",
    query: "builder financing construction",
    seedConcept: "builder-borrower-financing",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-land-and-construction-financing",
    query: "land and construction financing",
    seedConcept: "acquisition-to-construction",
    clusterId: "cluster-construction-financing-ontario",
    persona: "multiplex-opportunity-purchaser",
    financingTrigger: "property-acquisition",
    lifecycleStages: ["property-identification-acquisition", "construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-draw-financing-ontario",
    query: "construction draw financing Ontario",
    seedConcept: "draw-mechanics-and-project-cash-flow",
    clusterId: "cluster-draw-mechanics-cash-flow",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-draw-cash-flow",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "ontario",
    intent: "commercial-investigation",
    sourceRefs: [
      "source-openseo-serp-failures",
      "source-public-serp-draw",
      "source-official-ontario-construction-act",
      "source-official-canada-guaranty-draws",
    ],
    confidence: "medium",
    serpFeatures: ["commercial-product-pages", "process-explainer"],
  }),
  keywordRecord({
    id: "keyword-construction-draw-reimbursement-gap",
    query: "construction draw reimbursement gap",
    seedConcept: "draw-reimbursement-and-deposit-cash-flow",
    clusterId: "cluster-draw-pain-reimbursement-gaps",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-draw-cash-flow",
    lifecycleStages: ["construction-financing-draws", "rescue-refinance-lender-replacement"],
    funnelStage: "immediate-transaction-problem",
    geography: "ontario",
    intent: "transactional",
    sourceRefs: [
      "source-openseo-drawflow-research",
      "source-reddit-builder-material-credit",
      "source-user-positioning",
    ],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-builder-material-deposit-financing",
    query: "builder material deposit financing",
    seedConcept: "draw-reimbursement-and-deposit-cash-flow",
    clusterId: "cluster-draw-pain-reimbursement-gaps",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-draw-cash-flow",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "immediate-transaction-problem",
    geography: "ontario",
    intent: "transactional",
    sourceRefs: [
      "source-openseo-drawflow-research",
      "source-reddit-builder-material-credit",
      "source-user-positioning",
    ],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-stalled-construction-project-financing",
    query: "stalled construction project financing",
    seedConcept: "distressed-project-rescue",
    clusterId: "cluster-stalled-project-rescue",
    persona: "bank-declined-viable-project-borrower",
    financingTrigger: "rescue-refinance-lender-replacement",
    lifecycleStages: ["rescue-refinance-lender-replacement"],
    funnelStage: "immediate-transaction-problem",
    geography: "ontario",
    intent: "transactional",
    sourceRefs: ["source-qualitative-construction-funding-ontario", "source-qualitative-cedar-faq"],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-lender-stopped-construction-draws",
    query: "lender stopped construction draws",
    seedConcept: "distressed-project-rescue",
    clusterId: "cluster-stalled-project-rescue",
    persona: "bank-declined-viable-project-borrower",
    financingTrigger: "rescue-refinance-lender-replacement",
    lifecycleStages: ["rescue-refinance-lender-replacement"],
    funnelStage: "immediate-transaction-problem",
    geography: "ontario",
    intent: "transactional",
    sourceRefs: ["source-qualitative-construction-funding-ontario", "source-qualitative-cedar-faq"],
    confidence: "low",
  }),
  keywordRecord({
    id: "keyword-mortgage-broker-for-realtors-toronto",
    query: "mortgage broker for realtors Toronto",
    seedConcept: "realtor-referral-partnership",
    clusterId: "cluster-mortgage-realtor-referral",
    persona: "realtor-referral-partner",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition", "feasibility-capital-takeout-planning"],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "commercial-investigation",
    sourceRefs: [
      "source-openseo-serp-failures",
      "source-public-serp-partners",
      "source-search-lendsimpl-realtors",
      "source-official-fsra-referrals",
    ],
    confidence: "medium",
    serpFeatures: ["exact-audience-partner-page", "regulatory-authority"],
  }),
  keywordRecord({
    id: "keyword-mortgage-broker-referral-partnership",
    query: "mortgage broker referral partnership",
    seedConcept: "mortgage-broker-referral-partnership",
    clusterId: "cluster-mortgage-realtor-referral",
    persona: "mortgage-broker-referral-partner",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition", "feasibility-capital-takeout-planning"],
    funnelStage: "financing-qualification",
    geography: "ontario",
    intent: "commercial-investigation",
    sourceRefs: [
      "source-openseo-b2b-research",
      "source-official-fsra-referrals",
      "source-search-first-source-partners",
    ],
    confidence: "medium",
  }),
  keywordRecord({
    id: "keyword-refer-construction-financing-deal-ontario",
    query: "refer a construction financing deal Ontario",
    seedConcept: "professional-project-referral",
    clusterId: "cluster-professional-delivery-partners",
    persona: "professional-referral-partner",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition", "pre-construction-readiness"],
    funnelStage: "financing-qualification",
    geography: "ontario",
    intent: "transactional",
    sourceRefs: [
      "source-official-fsra-referrals",
      "source-official-reco-financial-benefits",
      "source-reddit-gta-renovation-financing",
      "source-search-first-source-partners",
    ],
    confidence: "medium",
  }),
  keywordRecord({
    id: "keyword-mortgage-broker-for-construction-loans",
    query: "mortgage broker for construction loans",
    seedConcept: "builder-borrower-broker-search",
    clusterId: "cluster-construction-financing-ontario",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-mortgage-broker-toronto",
    query: "mortgage broker Toronto",
    seedConcept: "generic-consumer-broker-search",
    clusterId: "cluster-mortgage-realtor-referral",
    persona: "adjacent-discovered-other",
    personaDetail: "Consumer mortgage shopper rather than a referral partner",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition"],
    funnelStage: "financing-qualification",
    geography: "toronto",
    intent: "commercial-investigation",
    disposition: "exclude",
    exclusionReason: "ordinary-home-purchase-mortgage",
    sourceKey: "b2b",
    sourceRefs: ["source-openseo-b2b-research"],
  }),
  keywordRecord({
    id: "keyword-mortgage-calculator",
    query: "mortgage calculator",
    seedConcept: "generic-consumer-mortgage-tool",
    clusterId: "cluster-mortgage-realtor-referral",
    persona: "adjacent-discovered-other",
    personaDetail: "Consumer calculator user without project or referral intent",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition"],
    funnelStage: "awareness-education",
    geography: "canada",
    intent: "informational",
    disposition: "exclude",
    exclusionReason: "ordinary-home-purchase-mortgage",
    sourceKey: "b2b",
    sourceRefs: ["source-openseo-b2b-research"],
  }),
  keywordRecord({
    id: "keyword-realtor-mortgage-calculator",
    query: "realtor mortgage calculator",
    seedConcept: "generic-consumer-mortgage-tool",
    clusterId: "cluster-mortgage-realtor-referral",
    persona: "adjacent-discovered-other",
    personaDetail: "Consumer calculator user without project or referral intent",
    financingTrigger: "b2b-referral",
    lifecycleStages: ["property-identification-acquisition"],
    funnelStage: "awareness-education",
    geography: "canada",
    intent: "informational",
    disposition: "exclude",
    exclusionReason: "ordinary-home-purchase-mortgage",
    sourceKey: "b2b",
    sourceRefs: ["source-openseo-b2b-research"],
  }),
  keywordRecord({
    id: "keyword-grey-gardens-toronto",
    query: "grey gardens Toronto",
    seedConcept: "garden-seed-noise",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "adjacent-discovered-other",
    personaDetail: "Unrelated navigational entertainment or place searcher",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "awareness-education",
    geography: "toronto",
    intent: "navigational",
    disposition: "exclude",
    exclusionReason: "other-no-project-financing-connection",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research"],
  }),
  keywordRecord({
    id: "keyword-garden-suite-edmonton",
    query: "garden suite Edmonton",
    seedConcept: "out-of-market-garden-suite",
    clusterId: "cluster-garden-suite-feasibility",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    lifecycleStages: ["feasibility-capital-takeout-planning"],
    funnelStage: "project-feasibility",
    geography: "municipality",
    intent: "navigational",
    disposition: "down-rank",
    exclusionReason: "other-no-project-financing-connection",
    sourceKey: "garden",
    sourceRefs: ["source-openseo-garden-research"],
  }),
  keywordRecord({
    id: "keyword-roof-financing",
    query: "roof financing",
    seedConcept: "consumer-renovation-noise",
    clusterId: "cluster-construction-financing-ontario",
    persona: "adjacent-discovered-other",
    personaDetail: "Consumer renovation borrower without project-development intent",
    financingTrigger: "construction-financing",
    lifecycleStages: ["construction-financing-draws"],
    funnelStage: "financing-qualification",
    geography: "canada",
    intent: "commercial-investigation",
    disposition: "exclude",
    exclusionReason: "unrelated-consumer-renovation-loan",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
  keywordRecord({
    id: "keyword-construction-lien",
    query: "construction lien",
    seedConcept: "construction-legal-noise",
    clusterId: "cluster-stalled-project-rescue",
    persona: "adjacent-discovered-other",
    personaDetail: "Legal-information searcher without demonstrated financing intent",
    financingTrigger: "rescue-refinance-lender-replacement",
    lifecycleStages: ["rescue-refinance-lender-replacement"],
    funnelStage: "immediate-transaction-problem",
    geography: "canada",
    intent: "informational",
    disposition: "down-rank",
    exclusionReason: "other-no-project-financing-connection",
    sourceKey: "draw",
    sourceRefs: ["source-openseo-drawflow-research"],
  }),
];

function keywordIdsFor(clusterId) {
  return keywords.filter((keyword) => keyword.clusterId === clusterId).map((keyword) => keyword.id);
}

const clusters = [
  {
    id: "cluster-mli-select-program",
    name: "MLI Select five-plus-unit program and eligibility",
    workstream: "five-plus-unit-multiplex-mli-select",
    primaryKeywordId: "keyword-mli-select",
    keywordIds: keywordIdsFor("cluster-mli-select-program"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "high",
    sourceObservationRefs: [
      "source-openseo-tracer-metrics",
      "source-openseo-five-plus-research",
      "source-openseo-mli-competitors",
      "source-official-cmhc-mli-select",
    ],
  },
  {
    id: "cluster-five-plus-construction-takeout",
    name: "Five-plus-unit construction-to-takeout financing",
    workstream: "five-plus-unit-multiplex-mli-select",
    primaryKeywordId: "keyword-mli-select-construction-financing",
    keywordIds: keywordIdsFor("cluster-five-plus-construction-takeout"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "medium",
    sourceObservationRefs: [
      "source-openseo-five-plus-research",
      "source-public-serp-multiplex",
      "source-official-cmhc-mli-select",
      "source-official-cmhc-aclp",
    ],
  },
  {
    id: "cluster-two-to-four-unit-multiplex",
    name: "Two-to-four-unit residential multiplex financing boundary",
    workstream: "five-plus-unit-multiplex-mli-select",
    primaryKeywordId: "keyword-fourplex-financing-toronto",
    keywordIds: keywordIdsFor("cluster-two-to-four-unit-multiplex"),
    pageBoundaryStatus: "unvalidated",
    confidence: "low",
    sourceObservationRefs: [
      "source-official-cmhc-refinance",
      "source-official-toronto-multiplex-guide",
    ],
  },
  {
    id: "cluster-garden-suite-feasibility",
    name: "Toronto and GTA garden-suite feasibility and rental strategy",
    workstream: "garden-laneway-suite-financing",
    primaryKeywordId: "keyword-garden-suites-toronto",
    keywordIds: keywordIdsFor("cluster-garden-suite-feasibility"),
    pageBoundaryStatus: "shared-support",
    confidence: "high",
    sourceObservationRefs: [
      "source-openseo-tracer-metrics",
      "source-openseo-garden-research",
      "source-official-toronto-garden-suites",
    ],
  },
  {
    id: "cluster-garden-laneway-financing",
    name: "Combined garden and laneway-suite financing",
    workstream: "garden-laneway-suite-financing",
    primaryKeywordId: "keyword-garden-suite-financing-toronto",
    keywordIds: keywordIdsFor("cluster-garden-laneway-financing"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "medium",
    sourceObservationRefs: [
      "source-public-serp-garden",
      "source-official-toronto-garden-suites",
      "source-official-toronto-laneway-suites",
      "source-official-cmhc-refinance",
    ],
  },
  {
    id: "cluster-construction-financing-ontario",
    name: "Ontario builder and project construction financing",
    workstream: "drawflow-builder-financing",
    primaryKeywordId: "keyword-construction-mortgage-ontario",
    keywordIds: keywordIdsFor("cluster-construction-financing-ontario"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "high",
    sourceObservationRefs: [
      "source-openseo-tracer-metrics",
      "source-openseo-drawflow-research",
      "source-public-serp-draw",
    ],
  },
  {
    id: "cluster-draw-mechanics-cash-flow",
    name: "Construction draw mechanics and project cash flow",
    workstream: "drawflow-builder-financing",
    primaryKeywordId: "keyword-construction-draw-financing-ontario",
    keywordIds: keywordIdsFor("cluster-draw-mechanics-cash-flow"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "medium",
    sourceObservationRefs: [
      "source-public-serp-draw",
      "source-official-ontario-construction-act",
      "source-official-canada-guaranty-draws",
      "source-search-insight-draw-guide",
    ],
  },
  {
    id: "cluster-draw-pain-reimbursement-gaps",
    name: "Builder reimbursement gaps, deposits, and working-capital pressure",
    workstream: "drawflow-builder-financing",
    primaryKeywordId: "keyword-construction-draw-reimbursement-gap",
    keywordIds: keywordIdsFor("cluster-draw-pain-reimbursement-gaps"),
    pageBoundaryStatus: "unvalidated",
    confidence: "low",
    sourceObservationRefs: [
      "source-openseo-drawflow-research",
      "source-reddit-builder-material-credit",
      "source-user-positioning",
    ],
  },
  {
    id: "cluster-construction-financing-comparison",
    name: "Construction financing structure and takeout comparison",
    workstream: "drawflow-builder-financing",
    primaryKeywordId: "keyword-construction-to-permanent-financing",
    keywordIds: keywordIdsFor("cluster-construction-financing-comparison"),
    pageBoundaryStatus: "shared-support",
    confidence: "medium",
    sourceObservationRefs: [
      "source-openseo-drawflow-research",
      "source-public-serp-draw",
      "source-official-rbc-construction-mortgage",
      "source-search-tordon-construction",
    ],
  },
  {
    id: "cluster-stalled-project-rescue",
    name: "Stalled project and lender-replacement financing",
    workstream: "drawflow-builder-financing",
    primaryKeywordId: "keyword-stalled-construction-project-financing",
    keywordIds: keywordIdsFor("cluster-stalled-project-rescue"),
    pageBoundaryStatus: "unvalidated",
    confidence: "low",
    sourceObservationRefs: [
      "source-qualitative-construction-funding-ontario",
      "source-qualitative-cedar-faq",
    ],
  },
  {
    id: "cluster-mortgage-realtor-referral",
    name: "Mortgage-broker and realtor referral partnership",
    workstream: "b2b-partner-referral",
    primaryKeywordId: "keyword-mortgage-broker-for-realtors-toronto",
    keywordIds: keywordIdsFor("cluster-mortgage-realtor-referral"),
    pageBoundaryStatus: "validated-distinct",
    confidence: "medium",
    sourceObservationRefs: [
      "source-public-serp-partners",
      "source-official-fsra-referrals",
      "source-official-reco-financial-benefits",
      "source-search-lendsimpl-realtors",
    ],
  },
  {
    id: "cluster-professional-delivery-partners",
    name: "Builder-referral and professional delivery partners",
    workstream: "b2b-partner-referral",
    primaryKeywordId: "keyword-refer-construction-financing-deal-ontario",
    keywordIds: keywordIdsFor("cluster-professional-delivery-partners"),
    pageBoundaryStatus: "shared-support",
    confidence: "medium",
    sourceObservationRefs: [
      "source-official-fsra-referrals",
      "source-official-reco-financial-benefits",
      "source-reddit-gta-renovation-financing",
      "source-search-first-source-partners",
    ],
  },
];

const serpEvidence = [
  ...publicSerpRecords.map(({ mapping, query }) => ({
    id: `serp-public-${mapping.slug}`,
    queryId: mapping.keywordId,
    location: query.searcherLocation ?? `not-exposed; query target ${query.queryTarget}`,
    device: "unknown",
    observedAt: publicSerpSnapshot.capturedAt,
    dataStatus: "public-search-observed",
    resultUrls: query.resultUrls,
    features: query.features,
    interpretation: `${query.interpretation} Searcher location, device, and stable rank were not exposed; the geographic label is the query target only.`,
    confidence: "medium",
    sourceObservationRefs: [mapping.sourceId],
  })),
  ...publicSerpMappings.map((mapping) => ({
    id: `serp-openseo-failed-${mapping.slug}`,
    queryId: mapping.keywordId,
    location: "Toronto, Ontario, Canada",
    device: "unknown",
    observedAt: openSeoSerps.capturedAt,
    dataStatus: "unavailable",
    resultUrls: [],
    features: [],
    interpretation:
      "OpenSEO v0.0.28 returned Internal SE Server Error. No page-boundary conclusion is drawn from this failed provider record.",
    confidence: "high",
    sourceObservationRefs: ["source-openseo-serp-failures"],
  })),
];

const competitors = [
  {
    id: "competitor-cmhc-authority",
    name: "Canada Mortgage and Housing Corporation",
    competitorType: "authority",
    domain: "cmhc-schl.gc.ca",
    relevantClusterIds: ["cluster-mli-select-program", "cluster-five-plus-construction-takeout"],
    observation:
      "OpenSEO reported the CMHC domain at position one for MLI Select; official product pages define eligibility and underwriting boundaries.",
    confidence: "high",
    sourceObservationRefs: ["source-openseo-mli-competitors", "source-official-cmhc-mli-select"],
  },
  {
    id: "competitor-mcap-commercial",
    name: "MCAP",
    competitorType: "commercial",
    domain: "mcap.com",
    relevantClusterIds: ["cluster-mli-select-program"],
    observation: "OpenSEO reported MCAP at position five for MLI Select in the Canada-level competitor sample.",
    confidence: "high",
    sourceObservationRefs: ["source-openseo-mli-competitors"],
  },
  {
    id: "competitor-canada-ici-commercial",
    name: "Canada ICI",
    competitorType: "commercial",
    domain: "canadaici.com",
    relevantClusterIds: ["cluster-mli-select-program", "cluster-five-plus-construction-takeout"],
    observation: "OpenSEO reported Canada ICI at position six for MLI Select in the Canada-level competitor sample.",
    confidence: "high",
    sourceObservationRefs: ["source-openseo-mli-competitors"],
  },
  {
    id: "competitor-vanplex-search",
    name: "VanPlex",
    competitorType: "search",
    domain: "vanplex.ca",
    relevantClusterIds: ["cluster-five-plus-construction-takeout"],
    observation:
      "A live exact-query sample surfaced a Toronto multiplex financing lifecycle page, validating the integrated construction-to-takeout information need.",
    confidence: "medium",
    sourceObservationRefs: ["source-public-serp-multiplex"],
  },
  {
    id: "competitor-plexora-commercial",
    name: "Plexora",
    competitorType: "commercial",
    domain: "plexora.ca",
    relevantClusterIds: ["cluster-five-plus-construction-takeout", "cluster-two-to-four-unit-multiplex"],
    observation:
      "The live sample surfaced an integrated Toronto design-finance-build competitor that explicitly separates one-to-four-unit and five-plus paths.",
    confidence: "medium",
    sourceObservationRefs: ["source-public-serp-multiplex"],
  },
  {
    id: "competitor-toronto-authority",
    name: "City of Toronto",
    competitorType: "authority",
    domain: "toronto.ca",
    relevantClusterIds: [
      "cluster-five-plus-construction-takeout",
      "cluster-two-to-four-unit-multiplex",
      "cluster-garden-suite-feasibility",
      "cluster-garden-laneway-financing",
    ],
    observation:
      "City pages control Toronto planning, permit, development-charge, ancillary-suite, and short-term-rental facts and therefore outrank commercial sources for factual authority.",
    confidence: "high",
    sourceObservationRefs: [
      "source-official-toronto-sixplex",
      "source-official-toronto-garden-suites",
      "source-official-toronto-laneway-suites",
    ],
  },
  {
    id: "competitor-garden-suite-home-search",
    name: "Garden Suite Home",
    competitorType: "search",
    domain: "gardensuitehome.ca",
    relevantClusterIds: ["cluster-garden-laneway-financing", "cluster-garden-suite-feasibility"],
    observation: "The live exact-query sample surfaced a dedicated Toronto garden-suite financing-options page.",
    confidence: "medium",
    sourceObservationRefs: ["source-public-serp-garden"],
  },
  {
    id: "competitor-atella-commercial",
    name: "Atella",
    competitorType: "commercial",
    domain: "atella.ca",
    relevantClusterIds: ["cluster-garden-laneway-financing"],
    observation:
      "The live exact-query sample surfaced a suite builder with an embedded finance offer, representing a supplier-led alternative to brokerage financing.",
    confidence: "medium",
    sourceObservationRefs: ["source-public-serp-garden"],
  },
  {
    id: "competitor-tordon-commercial",
    name: "Tordon Mortgages",
    competitorType: "commercial",
    domain: "tordon.com",
    relevantClusterIds: ["cluster-construction-financing-ontario", "cluster-draw-mechanics-cash-flow"],
    observation:
      "The live exact-query sample surfaced an Ontario construction-mortgage page that separates commercial qualification from milestone and inspection mechanics.",
    confidence: "medium",
    sourceObservationRefs: ["source-search-tordon-construction", "source-public-serp-draw"],
  },
  {
    id: "competitor-insight-search",
    name: "Insight Law Firm",
    competitorType: "search",
    domain: "insightlawfirm.ca",
    relevantClusterIds: ["cluster-draw-mechanics-cash-flow"],
    observation:
      "The live sample surfaced a current Ontario draw-mortgage explainer covering mechanics and holdback risk, competing for informational intent.",
    confidence: "medium",
    sourceObservationRefs: ["source-search-insight-draw-guide", "source-public-serp-draw"],
  },
  {
    id: "competitor-construction-funding-commercial",
    name: "Construction Funding Ontario",
    competitorType: "commercial",
    domain: "constructionfinancingontario.com",
    relevantClusterIds: ["cluster-construction-financing-ontario", "cluster-stalled-project-rescue"],
    observation:
      "The competitor targets builders, owners, broker referrals, stopped draws, unfinished builds, and lender replacement; its performance claims remain unverified.",
    confidence: "medium",
    sourceObservationRefs: ["source-qualitative-construction-funding-ontario"],
  },
  {
    id: "competitor-fsra-authority",
    name: "Financial Services Regulatory Authority of Ontario",
    competitorType: "authority",
    domain: "fsrao.ca",
    relevantClusterIds: ["cluster-mortgage-realtor-referral", "cluster-professional-delivery-partners"],
    observation:
      "FSRA controls Ontario mortgage-referral, compensation, disclosure, consent, and co-brokering terminology.",
    confidence: "high",
    sourceObservationRefs: ["source-official-fsra-referrals", "source-public-serp-partners"],
  },
  {
    id: "competitor-lendsimpl-search",
    name: "Lendsimpl",
    competitorType: "search",
    domain: "lendsimpl.ca",
    relevantClusterIds: ["cluster-mortgage-realtor-referral"],
    observation:
      "The exact-audience search result demonstrates a dedicated Toronto realtor-partner page and associated partner-resource pattern.",
    confidence: "medium",
    sourceObservationRefs: ["source-search-lendsimpl-realtors", "source-public-serp-partners"],
  },
  {
    id: "competitor-first-source-commercial",
    name: "First Source Mortgage Corporation",
    competitorType: "commercial",
    domain: "firstsourcemortgage.ca",
    relevantClusterIds: ["cluster-mortgage-realtor-referral", "cluster-professional-delivery-partners"],
    observation:
      "The Ontario lender explicitly addresses brokers, advisers, builders, and developers, showing a combined professional-partner and project-finance acquisition model.",
    confidence: "medium",
    sourceObservationRefs: ["source-search-first-source-partners", "source-public-serp-partners"],
  },
  {
    id: "competitor-reddit-search",
    name: "Reddit",
    competitorType: "search",
    domain: "reddit.com",
    relevantClusterIds: [
      "cluster-mli-select-program",
      "cluster-garden-suite-feasibility",
      "cluster-draw-mechanics-cash-flow",
    ],
    observation:
      "OpenSEO reported Reddit at position eleven for MLI Select and public samples surfaced Toronto suite and construction-finance questions; anecdotes remain qualitative only.",
    confidence: "medium",
    sourceObservationRefs: [
      "source-openseo-mli-competitors",
      "source-reddit-canada-construction-mortgage",
      "source-public-serp-garden",
    ],
  },
];

function aiQuestion({ id, question, clusterId, sourceKind, requiredEvidence, confidence, sourceRefs }) {
  return {
    id,
    question,
    clusterId,
    sourceKind,
    volumeClaimed: false,
    requiredEvidence,
    confidence,
    sourceObservationRefs: sourceRefs,
  };
}

const aiQuestions = [
  aiQuestion({
    id: "question-mli-five-unit-eligibility",
    question: "Which five-plus-unit projects can be evaluated for MLI Select?",
    clusterId: "cluster-mli-select-program",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current CMHC fact sheet", "Approved-lender and FairLend qualification criteria"],
    confidence: "high",
    sourceRefs: ["source-official-cmhc-mli-select"],
  }),
  aiQuestion({
    id: "question-mli-construction-vs-takeout",
    question: "Is MLI Select used during construction, at takeout, or in a staged financing plan?",
    clusterId: "cluster-mli-select-program",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current CMHC product documentation", "Approved-lender process map"],
    confidence: "medium",
    sourceRefs: ["source-official-cmhc-mli-select", "source-official-cmhc-aclp"],
  }),
  aiQuestion({
    id: "question-mli-points-tradeoffs",
    question: "How do affordability, energy, and accessibility commitments affect an MLI Select financing plan?",
    clusterId: "cluster-mli-select-program",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current CMHC scorecard", "Project-specific design and operating assumptions"],
    confidence: "high",
    sourceRefs: ["source-official-cmhc-mli-select"],
  }),
  aiQuestion({
    id: "question-five-plus-acquisition-to-takeout",
    question: "What must be planned before acquisition so a five-plus-unit project can reach construction and takeout financing?",
    clusterId: "cluster-five-plus-construction-takeout",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["FairLend intake criteria", "Current permit, budget, draw, stabilization, and takeout requirements"],
    confidence: "medium",
    sourceRefs: ["source-official-cmhc-aclp", "source-user-positioning"],
  }),
  aiQuestion({
    id: "question-two-four-vs-five-plus",
    question: "How does financing differ between a two-to-four-unit multiplex and a five-plus-unit project?",
    clusterId: "cluster-two-to-four-unit-multiplex",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current residential-insurance boundary", "Current five-plus multi-unit program boundary"],
    confidence: "high",
    sourceRefs: ["source-official-cmhc-refinance", "source-official-cmhc-mli-select"],
  }),
  aiQuestion({
    id: "question-toronto-sixplex-location",
    question: "Where are fiveplexes and sixplexes permitted in Toronto?",
    clusterId: "cluster-five-plus-construction-takeout",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current zoning map", "Address-specific planning review"],
    confidence: "high",
    sourceRefs: ["source-official-toronto-sixplex"],
  }),
  aiQuestion({
    id: "question-garden-suite-property-fit",
    question: "What property facts determine whether a Toronto garden suite is feasible and financeable?",
    clusterId: "cluster-garden-suite-feasibility",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Survey and zoning review", "Access, servicing, tree, budget, and financing criteria"],
    confidence: "high",
    sourceRefs: ["source-official-toronto-garden-suites"],
  }),
  aiQuestion({
    id: "question-garden-suite-rent-qualification",
    question: "Can projected garden-suite rent be considered during mortgage qualification?",
    clusterId: "cluster-garden-laneway-financing",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current lender policy", "Appraisal and market-rent support", "Borrower-specific underwriting"],
    confidence: "low",
    sourceRefs: ["source-public-serp-garden"],
  }),
  aiQuestion({
    id: "question-garden-suite-equity",
    question: "How can existing home equity be evaluated for garden-suite construction financing?",
    clusterId: "cluster-garden-laneway-financing",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current appraisal", "Existing charges", "Budget, contingency, and lender criteria"],
    confidence: "medium",
    sourceRefs: ["source-official-cmhc-refinance", "source-user-positioning"],
  }),
  aiQuestion({
    id: "question-garden-suite-financing-options",
    question: "How should a homeowner compare a HELOC, second mortgage, mortgage refinance, and construction financing for a garden or laneway suite?",
    clusterId: "cluster-garden-laneway-financing",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: [
      "Equivalent project budget and funding schedule",
      "Current rate, APR, fee, repayment, advance, and security assumptions",
      "Approved lender and Principal Broker review",
    ],
    confidence: "high",
    sourceRefs: [
      "source-official-fcac-home-equity-options",
      "source-official-fcac-heloc",
      "source-official-cmhc-refinance",
    ],
  }),
  aiQuestion({
    id: "question-garden-vs-laneway-financing",
    question: "How do financing and permit requirements differ between garden and laneway suites?",
    clusterId: "cluster-garden-laneway-financing",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current municipal definitions", "Address-specific planning and lender review"],
    confidence: "high",
    sourceRefs: ["source-official-toronto-garden-suites", "source-official-toronto-laneway-suites"],
  }),
  aiQuestion({
    id: "question-suite-long-vs-short-rental",
    question: "How does a long-term garden-suite rental compare with short-term rental use in Toronto?",
    clusterId: "cluster-garden-suite-feasibility",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current Toronto rules", "Current tax rules", "Lender and insurer occupancy restrictions"],
    confidence: "high",
    sourceRefs: [
      "source-official-toronto-short-term-rentals",
      "source-official-cra-short-term-rental",
      "source-official-cmhc-refinance",
    ],
  }),
  aiQuestion({
    id: "question-suite-federal-loan-status",
    question: "Is the federal secondary-suite loan available in 2026?",
    clusterId: "cluster-garden-suite-feasibility",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current federal budget and CMHC status"],
    confidence: "high",
    sourceRefs: ["source-official-budget-secondary-suite-cancelled"],
  }),
  aiQuestion({
    id: "question-suite-incentive-verification",
    question: "Which Toronto, Ontario, and federal suite incentives are currently open and project-applicable?",
    clusterId: "cluster-garden-suite-feasibility",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Program status within 30 days", "Project-specific tax, legal, and municipal review"],
    confidence: "medium",
    sourceRefs: [
      "source-official-toronto-suite-dc-deferral",
      "source-official-ontario-hst-2026",
      "source-official-cra-pbrh",
    ],
  }),
  aiQuestion({
    id: "question-construction-project-qualification",
    question: "Which Ontario builder projects qualify for construction financing?",
    clusterId: "cluster-construction-financing-ontario",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved underwriting criteria", "Project, borrower, budget, permit, equity, and exit documentation"],
    confidence: "medium",
    sourceRefs: ["source-openseo-drawflow-research", "source-user-positioning"],
  }),
  aiQuestion({
    id: "question-construction-draw-verification",
    question: "How are construction draws verified and released in Ontario?",
    clusterId: "cluster-draw-mechanics-cash-flow",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved DrawFlow procedure", "Inspection and holdback requirements", "Current facility terms"],
    confidence: "high",
    sourceRefs: ["source-official-canada-guaranty-draws", "source-search-insight-draw-guide"],
  }),
  aiQuestion({
    id: "question-draw-deposits-before-installation",
    question: "Can construction financing fund supplier deposits before materials are installed?",
    clusterId: "cluster-draw-pain-reimbursement-gaps",
    sourceKind: "reddit",
    requiredEvidence: ["Approved eligible-cost policy", "Deposit-verification process", "Current facility exceptions"],
    confidence: "low",
    sourceRefs: ["source-reddit-builder-material-credit", "source-official-canada-guaranty-draws"],
  }),
  aiQuestion({
    id: "question-draw-holdback-cash-flow",
    question: "How does Ontario's construction holdback affect project cash flow?",
    clusterId: "cluster-draw-mechanics-cash-flow",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current Ontario law", "Legal review", "Project-specific cash-flow schedule"],
    confidence: "high",
    sourceRefs: ["source-official-ontario-construction-act"],
  }),
  aiQuestion({
    id: "question-draw-interest-outstanding-balance",
    question: "Is construction-loan interest charged only on funds already advanced?",
    clusterId: "cluster-draw-mechanics-cash-flow",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current facility agreement", "Interest method and fee schedule"],
    confidence: "medium",
    sourceRefs: ["source-official-rbc-construction-mortgage", "source-search-tordon-construction"],
  }),
  aiQuestion({
    id: "question-draw-multiple-projects",
    question: "How should a builder evaluate construction financing while running multiple projects?",
    clusterId: "cluster-draw-pain-reimbursement-gaps",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved liquidity policy", "Project-by-project sources and uses", "Portfolio obligations"],
    confidence: "low",
    sourceRefs: ["source-user-positioning", "source-reddit-builder-material-credit"],
  }),
  aiQuestion({
    id: "question-draw-vs-construction-mortgage",
    question: "How does a draw-based facility compare with a conventional construction mortgage?",
    clusterId: "cluster-construction-financing-comparison",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Equivalent principal and timing assumptions", "Current rates, fees, draw conditions, and exit terms"],
    confidence: "medium",
    sourceRefs: ["source-search-tordon-construction", "source-official-rbc-construction-mortgage"],
  }),
  aiQuestion({
    id: "question-rescue-stopped-draws",
    question: "What information is required when an existing lender stops construction draws?",
    clusterId: "cluster-stalled-project-rescue",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Cost-to-complete", "Lien and payables review", "Current appraisal", "Completion and exit plan"],
    confidence: "medium",
    sourceRefs: ["source-qualitative-construction-funding-ontario", "source-qualitative-cedar-faq"],
  }),
  aiQuestion({
    id: "question-rescue-partial-project-refinance",
    question: "Can a partially completed construction project be refinanced?",
    clusterId: "cluster-stalled-project-rescue",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved rescue policy", "Title, lien, value, budget, liquidity, schedule, and exit evidence"],
    confidence: "low",
    sourceRefs: ["source-qualitative-construction-funding-ontario"],
  }),
  aiQuestion({
    id: "question-partner-simple-referral",
    question: "What is a simple mortgage referral versus mortgage advice or co-brokering in Ontario?",
    clusterId: "cluster-mortgage-realtor-referral",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current FSRA guidance", "FairLend compliance-approved workflow"],
    confidence: "high",
    sourceRefs: ["source-official-fsra-referrals"],
  }),
  aiQuestion({
    id: "question-partner-realtor-disclosure",
    question: "What must an Ontario realtor disclose when a mortgage referral has a financial benefit?",
    clusterId: "cluster-mortgage-realtor-referral",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Current RECO and FSRA guidance", "Legal and compliance approval"],
    confidence: "high",
    sourceRefs: ["source-official-reco-financial-benefits", "source-official-fsra-referrals"],
  }),
  aiQuestion({
    id: "question-partner-builder-borrower-routing",
    question: "When is a builder the borrower versus a referral or delivery partner?",
    clusterId: "cluster-professional-delivery-partners",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Borrower-and-collateral routing rule", "Approved role and compensation policy"],
    confidence: "high",
    sourceRefs: ["source-user-positioning", "source-official-fsra-referrals"],
  }),
  aiQuestion({
    id: "question-partner-projects-to-refer",
    question: "Which construction, acquisition, multiplex, or bank-declined projects may a partner refer?",
    clusterId: "cluster-mortgage-realtor-referral",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved project eligibility matrix", "Referral intake and consent policy"],
    confidence: "medium",
    sourceRefs: ["source-search-first-source-partners", "source-user-positioning"],
  }),
  aiQuestion({
    id: "question-partner-status-updates",
    question: "Which financing-status updates can a referring partner receive with client consent?",
    clusterId: "cluster-mortgage-realtor-referral",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved consent language", "Privacy and information-sharing policy", "FSRA review"],
    confidence: "high",
    sourceRefs: ["source-official-fsra-referrals", "source-search-lendsimpl-realtors"],
  }),
  aiQuestion({
    id: "question-partner-professional-packet",
    question: "What should an architect, planner, contractor, appraiser, or property manager include with a project referral?",
    clusterId: "cluster-professional-delivery-partners",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved intake checklist", "Role-specific documentation map", "Consent requirements"],
    confidence: "medium",
    sourceRefs: ["source-official-toronto-multiplex-guide", "source-user-positioning"],
  }),
  aiQuestion({
    id: "question-partner-bank-declined-triage",
    question: "Which facts should a partner collect before referring a bank-declined project?",
    clusterId: "cluster-professional-delivery-partners",
    sourceKind: "chatgpt-style-prompt",
    requiredEvidence: ["Approved triage matrix", "Borrower consent", "Decline reason and corrective evidence"],
    confidence: "medium",
    sourceRefs: ["source-user-positioning", "source-official-fsra-referrals"],
  }),
];

const aiDiscoveryCoverage = [
  {
    surface: "people-also-ask",
    status: "unvalidated-not-exposed",
    observation: "Paid provider SERPs failed and the public-search fallback did not expose People Also Ask questions.",
    questionIds: [],
    sourceObservationRefs: ["source-openseo-serp-failures"],
    confidence: "high",
    nextValidation: "Run successful mobile Toronto SERPs that return feature and question payloads.",
  },
  {
    surface: "related-searches",
    status: "unvalidated-not-exposed",
    observation: "No provider or public-search response exposed related-search terms; none were inferred.",
    questionIds: [],
    sourceObservationRefs: ["source-openseo-serp-failures"],
    confidence: "high",
    nextValidation: "Collect provider task receipts with related-search result types.",
  },
  {
    surface: "autocomplete",
    status: "unvalidated-not-collected",
    observation: "Autocomplete was outside the paid trial calls and no autocomplete phrases are represented as observed demand.",
    questionIds: [],
    sourceObservationRefs: ["source-codex-seo-methodology"],
    confidence: "high",
    nextValidation: "Collect Canada-English suggestions with timestamp and query-prefix provenance.",
  },
  {
    surface: "reddit",
    status: "observed-qualitative-only",
    observation: "Public search and direct community observations supplied builder-deposit and GTA project language; community evidence is not used as factual authority or volume.",
    questionIds: aiQuestions
      .filter((question) => question.sourceKind === "reddit")
      .map((question) => question.id),
    sourceObservationRefs: [
      "source-reddit-builder-material-credit",
      "source-reddit-gta-renovation-financing",
      "source-public-serp-garden",
      "source-public-serp-multiplex",
    ],
    confidence: "medium",
    nextValidation: "Expand current GTA threads by persona and retain post/comment timestamps and engagement context.",
  },
  {
    surface: "independent-forums",
    status: "unvalidated-not-collected",
    observation: "Competitor FAQ pages were not mislabeled as forums; no independent forum-derived question remains in the canonical dataset.",
    questionIds: [],
    sourceObservationRefs: ["source-codex-seo-methodology"],
    confidence: "high",
    nextValidation: "Collect relevant Canadian builder, landlord, and mortgage forum discussions as qualitative evidence only.",
  },
  {
    surface: "youtube-video",
    status: "partial-domain-only",
    observation: "The MLI competitor response included youtube.com but exposed no video URL, title, result type, or question; no video-intent claim is made.",
    questionIds: [],
    sourceObservationRefs: ["source-openseo-mli-competitors"],
    confidence: "medium",
    nextValidation: "Run successful SERPs with video result types and capture exact URLs and titles.",
  },
  {
    surface: "bing-question",
    status: "unvalidated-not-collected",
    observation: "No live Bing question or Copilot answer surface was collected in the trial.",
    questionIds: [],
    sourceObservationRefs: ["source-codex-seo-methodology"],
    confidence: "high",
    nextValidation: "Collect Bing result and answer surfaces separately from Google evidence.",
  },
  {
    surface: "chatgpt-style-prompts",
    status: "modeled-not-volume-bearing",
    observation: "Decision questions were synthesized from official, provider, user, public-search, and qualitative evidence and all carry volumeClaimed=false.",
    questionIds: aiQuestions
      .filter((question) => question.sourceKind === "chatgpt-style-prompt")
      .map((question) => question.id),
    sourceObservationRefs: ["source-codex-seo-methodology"],
    confidence: "medium",
    nextValidation: "Test citation and answer coverage after evidence-backed pages exist; never convert prompts into search-volume claims.",
  },
  {
    surface: "ai-overview-style-serp",
    status: "unvalidated-not-exposed",
    observation: "No successful provider SERP exposed AI Overview or answer-heavy feature payloads; the trial cannot claim trigger coverage.",
    questionIds: [],
    sourceObservationRefs: ["source-openseo-serp-failures"],
    confidence: "high",
    nextValidation: "Collect successful feature-bearing mobile SERPs and record citations, passages, and source types.",
  },
];

const claims = [
  {
    id: "claim-mli-minimum-five-units",
    claim: "MLI Select requires at least five residential units and a minimum qualifying point score.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current CMHC fact sheet", "Approved-lender confirmation before project-specific use"],
    owner: "FairLend Principal Broker",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-cmhc-mli-select", "source-official-cmhc-mli-live"],
  },
  {
    id: "claim-mli-up-to-leverage-amortization",
    claim: "Qualifying new-construction MLI Select projects may receive up to 95% LTC and up to 50-year amortization at specified point levels.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current CMHC table", "Prominent up-to qualifier", "Project-specific approved-lender decision"],
    owner: "FairLend Principal Broker",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-cmhc-mli-select"],
  },
  {
    id: "claim-toronto-sixplex-not-citywide",
    claim: "Toronto fiveplex and sixplex permissions are not citywide and require address-specific zoning review.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current certified by-law", "Current zoning map", "Address-specific planning review"],
    owner: "FairLend Content Compliance",
    reviewBy: "2026-10-14T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-toronto-sixplex"],
  },
  {
    id: "claim-cmhc-refinance-up-to-four-units",
    claim: "CMHC Refinance is a distinct densification path for qualifying properties with up to four total units and is not MLI Select.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current CMHC Refinance fact sheet", "Project-specific lender and insurer review"],
    owner: "FairLend Principal Broker",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-cmhc-refinance", "source-official-cmhc-mli-select"],
  },
  {
    id: "claim-toronto-suite-definitions",
    claim: "Toronto garden and laneway suites are separate planning concepts with different public-lane and site requirements.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current Toronto pages", "Address-specific zoning and permit review"],
    owner: "FairLend Content Compliance",
    reviewBy: "2026-10-14T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-toronto-garden-suites", "source-official-toronto-laneway-suites"],
  },
  {
    id: "claim-toronto-short-term-rental-boundary",
    claim: "Toronto short-term rentals are under 28 consecutive days and are restricted to the operator's principal residence, including ancillary-suite-specific rules.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current Toronto operator rules", "Address and principal-residence review"],
    owner: "FairLend Content Compliance",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-toronto-short-term-rentals"],
  },
  {
    id: "claim-federal-secondary-suite-loan-available",
    claim: "The proposed federal CAD 80,000 Canada Secondary Suite Loan Program is available.",
    status: "prohibited",
    allowedUsage: "never",
    requiredEvidence: ["A future official federal source explicitly reversing the cancellation"],
    owner: "FairLend Content Compliance",
    reviewBy: null,
    confidence: "high",
    sourceObservationRefs: ["source-official-budget-secondary-suite-cancelled"],
  },
  {
    id: "claim-toronto-forgivable-suite-loan-available",
    claim: "Toronto's former Affordable Laneway Suites forgivable-loan program is currently available.",
    status: "prohibited",
    allowedUsage: "never",
    requiredEvidence: ["A future City source explicitly relaunching the program"],
    owner: "FairLend Content Compliance",
    reviewBy: null,
    confidence: "high",
    sourceObservationRefs: ["source-official-toronto-suite-dc-deferral"],
  },
  {
    id: "claim-ontario-enhanced-rental-rebate",
    claim: "Ontario announced a temporary enhanced rental rebate with a potential provincial component up to CAD 80,000 per eligible unit; current availability and project eligibility are not established by this research.",
    status: "requires-review",
    allowedUsage: "research-only",
    requiredEvidence: ["Current enacted authority and application availability", "Project dates and unit facts", "Tax-professional opinion", "Interaction review with federal rebates", "Explicit prohibition on availability language until these gates pass"],
    owner: "FairLend Content Compliance",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "medium",
    sourceObservationRefs: ["source-official-ontario-hst-2026", "source-official-cra-pbrh"],
  },
  {
    id: "claim-drawflow-on-demand-line",
    claim: "DrawFlow operates like a line of credit whose available funds increase as work is completed and verified, with borrower-controlled draw timing.",
    status: "provisional-unverified",
    allowedUsage: "research-only",
    requiredEvidence: ["Approved product term sheet", "Operating procedure", "Eligible-cost and verification policy", "Legal and compliance review"],
    owner: "FairLend Principal Broker",
    reviewBy: null,
    confidence: "low",
    sourceObservationRefs: ["source-user-positioning", "source-official-canada-guaranty-draws"],
  },
  {
    id: "claim-drawflow-fifty-percent",
    claim: "DrawFlow case studies support up to 50% interest savings under specific comparison assumptions.",
    status: "provisional-unverified",
    allowedUsage: "research-only",
    requiredEvidence: [
      "Underlying approved case files",
      "Period-by-period comparable baseline and actual interest-only calculation",
      "Fees and total financing costs reported separately from interest",
      "Selection-method and maximum-result disclosure",
      "Borrower consent and anonymization review",
      "Principal Broker, legal, and compliance approval",
    ],
    owner: "FairLend Principal Broker",
    reviewBy: null,
    confidence: "low",
    sourceObservationRefs: ["source-user-positioning"],
  },
  {
    id: "claim-one-stop-end-to-end",
    claim: "FairLend proposes to act as a coordinated point of contact for qualified projects while independent specialists perform their regulated work; financing, permits, completion, and takeout remain subject to underwriting, third-party decisions, project facts, and current program rules.",
    status: "provisional-unverified",
    allowedUsage: "research-only",
    requiredEvidence: ["Named partner roles and agreements", "Service boundary and responsibility map", "Project eligibility criteria", "Representative approved outcomes", "Compliance approval"],
    owner: "FairLend Principal Broker",
    reviewBy: null,
    confidence: "medium",
    sourceObservationRefs: ["source-user-positioning", "source-official-toronto-multiplex-guide"],
  },
  {
    id: "claim-referral-compensation-disclosure",
    claim: "Ontario referral and financial-benefit arrangements require role, compensation, conflict, consent, and information-use review under applicable FSRA and RECO requirements.",
    status: "supported",
    allowedUsage: "brief-requirement",
    requiredEvidence: ["Current FSRA guidance", "Current RECO guidance", "FairLend legal and compliance approval"],
    owner: "FairLend Principal Broker",
    reviewBy: "2026-08-15T12:00:00-04:00",
    confidence: "high",
    sourceObservationRefs: ["source-official-fsra-referrals", "source-official-reco-financial-benefits"],
  },
];

const questionIdsByCluster = Object.fromEntries(
  clusters.map((cluster) => [
    cluster.id,
    aiQuestions.filter((question) => question.clusterId === cluster.id).map((question) => question.id),
  ]),
);

const pageScoreRationales = [];

function topKeywordAverage(records, scoreField, limit = 3) {
  const selected = [...records]
    .sort((left, right) => right[scoreField].total - left[scoreField].total)
    .slice(0, limit);
  if (selected.length === 0) return { score: 0, keywordIds: [] };
  return {
    score: Math.round(
      selected.reduce((total, keyword) => total + keyword[scoreField].total, 0) / selected.length,
    ),
    keywordIds: selected.map((keyword) => keyword.id),
  };
}

function opportunity({
  id,
  topic,
  persona,
  financingTrigger,
  clusterIds,
  lifecycleStages,
  funnelStage,
  intent,
  urlDisposition,
  existingUrl,
  proposedUrl,
  pageType,
  primaryConversion,
  qualificationExpectations,
  localEvidence,
  competitorIds,
  claimIds,
  cannibalizationDependencies,
  internalLinkRole,
  requiredOriginalEvidence,
  confidence,
  recommendedPriority,
  nextHumanDecision,
  sourceObservationRefs,
}) {
  const scoringKeywords = unique(clusterIds)
    .flatMap((clusterId) => keywords.filter((keyword) => keyword.clusterId === clusterId))
    .filter((keyword) => keyword.relevanceDisposition === "include");
  const lead = topKeywordAverage(scoringKeywords, "leadCaptureScore");
  const authority = topKeywordAverage(scoringKeywords, "authorityBuildScore");
  pageScoreRationales.push({
    recordType: "page-opportunity",
    recordId: id,
    leadCaptureScore: lead.score,
    authorityBuildScore: authority.score,
    model: "top-three-included-keywords-v1",
    inputSummary: `Lead inputs: ${lead.keywordIds.join(" | ") || "none"}; authority inputs: ${authority.keywordIds.join(" | ") || "none"}.`,
    evidenceCaps: "Only included keywords count; unavailable demand contributes zero research-demand points, and failed provider SERPs cap evidence-dependent components.",
  });
  return {
    id,
    topic,
    persona,
    personaDetail: null,
    personaTier: personaTiers[persona],
    financingTrigger,
    clusterIds,
    lifecycleStages,
    funnelHeadline: ["awareness-education", "project-feasibility", "planning-comparison"].includes(
      funnelStage,
    )
      ? "research"
      : "buying-signal",
    funnelStage,
    intent,
    urlDisposition,
    existingUrl,
    proposedUrl,
    pageType,
    primaryConversion,
    qualificationExpectations,
    localEvidence,
    competitorIds,
    aiQuestionIds: unique(clusterIds.flatMap((clusterId) => questionIdsByCluster[clusterId] ?? [])),
    internalLinkRole,
    requiredOriginalEvidence,
    claimIds,
    cannibalizationDependencies,
    leadCaptureScore: lead.score,
    authorityBuildScore: authority.score,
    confidence,
    recommendedPriority,
    nextHumanDecision,
    sourceObservationRefs: unique(sourceObservationRefs),
  };
}

const pageOpportunities = [
  opportunity({
    id: "opportunity-homepage-pathways",
    topic: "Homepage qualified-project pathways and trust evidence",
    persona: "homeowner-citizen-developer",
    financingTrigger: "construction-financing",
    clusterIds: [
      "cluster-mli-select-program",
      "cluster-garden-laneway-financing",
      "cluster-construction-financing-ontario",
      "cluster-mortgage-realtor-referral",
    ],
    lifecycleStages: ["property-identification-acquisition", "feasibility-capital-takeout-planning"],
    funnelStage: "planning-comparison",
    intent: "commercial-investigation",
    urlDisposition: "preserve",
    existingUrl: "https://www.fairlend.ca/",
    proposedUrl: "/",
    pageType: "homepage",
    primaryConversion: "project-financing-assessment",
    qualificationExpectations: [
      "Owns or has identified a GTA property",
      "Has credible equity or down-payment capital",
      "Plans an income-producing project within approximately twelve months",
    ],
    localEvidence: ["source-observation-live-home-response-2026-07-16", "source-observation-audit-page-20"],
    competitorIds: ["competitor-plexora-commercial", "competitor-first-source-commercial"],
    claimIds: ["claim-one-stop-end-to-end"],
    cannibalizationDependencies: ["site-home", "site-borrowers", "site-partners"],
    internalLinkRole: "brand-root-and-qualified-pathway-router",
    requiredOriginalEvidence: ["Verified licence and service-area identity", "Named partner-role map", "Approved project-qualification matrix"],
    confidence: "medium",
    recommendedPriority: "critical",
    nextHumanDecision: "Approve pathway hierarchy, trust evidence, and routing requirements before any homepage copy proposal.",
    sourceObservationRefs: ["source-user-positioning", "source-observation-audit-page-4", "source-observation-audit-page-18"],
  }),
  opportunity({
    id: "opportunity-five-plus-mli-financing",
    topic: "Five-plus-unit multiplex construction and MLI Select financing",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "mli-select-takeout",
    clusterIds: ["cluster-mli-select-program", "cluster-five-plus-construction-takeout"],
    lifecycleStages: [
      "property-identification-acquisition",
      "feasibility-capital-takeout-planning",
      "construction-financing-draws",
      "lease-up-stabilization",
      "institutional-takeout",
    ],
    funnelStage: "financing-qualification",
    intent: "transactional",
    urlDisposition: "replace",
    existingUrl: "https://www.fairlend.ca/multiplex-financing-gta",
    proposedUrl: "/multiplex-financing-gta",
    pageType: "money-page",
    primaryConversion: "project-financing-assessment",
    qualificationExpectations: [
      "Five or more planned residential units",
      "GTA property or acquisition target with address-specific planning review",
      "Documented equity, liquidity, budget, experience or management plan, and exit strategy",
    ],
    localEvidence: ["source-official-toronto-sixplex", "source-public-serp-multiplex"],
    competitorIds: [
      "competitor-cmhc-authority",
      "competitor-canada-ici-commercial",
      "competitor-vanplex-search",
      "competitor-plexora-commercial",
    ],
    claimIds: [
      "claim-mli-minimum-five-units",
      "claim-mli-up-to-leverage-amortization",
      "claim-toronto-sixplex-not-citywide",
      "claim-one-stop-end-to-end",
    ],
    cannibalizationDependencies: ["site-multiplex-financing-gta", "site-affordable-sustainable-rental-housing"],
    internalLinkRole: "five-plus-commercial-pillar",
    requiredOriginalEvidence: ["Approved five-plus intake criteria", "Construction-to-stabilization-to-takeout process map", "Partner-role evidence", "Current official program sources"],
    confidence: "medium",
    recommendedPriority: "critical",
    nextHumanDecision: "Approve replacement of the low-value page and confirm product, partner, and underwriting evidence owners.",
    sourceObservationRefs: [
      "source-openseo-five-plus-research",
      "source-public-serp-multiplex",
      "source-official-cmhc-mli-select",
      "source-user-positioning",
    ],
  }),
  opportunity({
    id: "opportunity-mli-select-planning-guide",
    topic: "MLI Select eligibility and pre-construction planning guide",
    persona: "build-to-hold-mli-select-developer",
    financingTrigger: "mli-select-takeout",
    clusterIds: ["cluster-mli-select-program"],
    lifecycleStages: ["feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "project-feasibility",
    intent: "informational",
    urlDisposition: "proposed-new",
    existingUrl: null,
    proposedUrl: "/multiplex-financing-gta/mli-select",
    pageType: "resource",
    primaryConversion: "financing-strategy",
    qualificationExpectations: ["Five-plus-unit rental concept", "Willingness to document affordability, energy, accessibility, operations, and takeout assumptions"],
    localEvidence: ["source-official-toronto-sixplex", "source-official-toronto-development-charges"],
    competitorIds: ["competitor-cmhc-authority", "competitor-mcap-commercial", "competitor-reddit-search"],
    claimIds: ["claim-mli-minimum-five-units", "claim-mli-up-to-leverage-amortization", "claim-cmhc-refinance-up-to-four-units"],
    cannibalizationDependencies: ["site-multiplex-financing-gta", "site-affordable-sustainable-rental-housing"],
    internalLinkRole: "five-plus-authority-and-ai-citation-node",
    requiredOriginalEvidence: ["Current scorecard interpretation", "Approved-lender review", "FairLend process diagram", "Current program freshness log"],
    confidence: "high",
    recommendedPriority: "high",
    nextHumanDecision: "Approve the evidence outline and appoint program-fact and compliance reviewers.",
    sourceObservationRefs: ["source-openseo-tracer-metrics", "source-openseo-mli-competitors", "source-official-cmhc-mli-select"],
  }),
  opportunity({
    id: "opportunity-five-plus-financing-roadmap",
    topic: "Five-plus project acquisition-to-takeout financing roadmap",
    persona: "multiplex-opportunity-purchaser",
    financingTrigger: "property-acquisition",
    clusterIds: ["cluster-five-plus-construction-takeout"],
    lifecycleStages: [
      "property-identification-acquisition",
      "feasibility-capital-takeout-planning",
      "pre-construction-readiness",
      "construction-financing-draws",
      "lease-up-stabilization",
      "institutional-takeout",
    ],
    funnelStage: "planning-comparison",
    intent: "commercial-investigation",
    urlDisposition: "proposed-new",
    existingUrl: null,
    proposedUrl: "/multiplex-financing-gta/project-financing-roadmap",
    pageType: "resource",
    primaryConversion: "financing-strategy",
    qualificationExpectations: ["Identified or target property", "Preliminary unit plan, budget, equity, schedule, rents, and exit assumptions"],
    localEvidence: ["source-official-toronto-sixplex", "source-official-toronto-multiplex-guide"],
    competitorIds: ["competitor-vanplex-search", "competitor-plexora-commercial", "competitor-toronto-authority"],
    claimIds: ["claim-toronto-sixplex-not-citywide", "claim-one-stop-end-to-end"],
    cannibalizationDependencies: ["site-multiplex-financing-gta", "site-construction-draw-financing"],
    internalLinkRole: "five-plus-lifecycle-navigation-node",
    requiredOriginalEvidence: ["Stage-gate diagram", "Required-document matrix", "Partner-role and handoff map", "Takeout-readiness checklist"],
    confidence: "medium",
    recommendedPriority: "high",
    nextHumanDecision: "Confirm the stage-gate model and evidence owners before approving the resource structure.",
    sourceObservationRefs: ["source-public-serp-multiplex", "source-official-cmhc-aclp", "source-user-positioning"],
  }),
  opportunity({
    id: "opportunity-garden-laneway-financing",
    topic: "Toronto and GTA garden and laneway-suite financing",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    clusterIds: ["cluster-garden-laneway-financing", "cluster-garden-suite-feasibility"],
    lifecycleStages: [
      "feasibility-capital-takeout-planning",
      "pre-construction-readiness",
      "construction-financing-draws",
      "lease-up-stabilization",
    ],
    funnelStage: "financing-qualification",
    intent: "transactional",
    urlDisposition: "replace",
    existingUrl: "https://www.fairlend.ca/garden-suite-financing-gta",
    proposedUrl: "/garden-suite-financing-gta",
    pageType: "money-page",
    primaryConversion: "project-financing-assessment",
    qualificationExpectations: ["Owns or is acquiring a GTA property", "Has an address-specific feasibility path", "Can document equity, budget, contingency, permits, rent assumptions, and intended use"],
    localEvidence: ["source-official-toronto-garden-suites", "source-official-toronto-laneway-suites", "source-public-serp-garden"],
    competitorIds: ["competitor-garden-suite-home-search", "competitor-atella-commercial", "competitor-toronto-authority"],
    claimIds: [
      "claim-toronto-suite-definitions",
      "claim-cmhc-refinance-up-to-four-units",
      "claim-federal-secondary-suite-loan-available",
      "claim-toronto-forgivable-suite-loan-available",
      "claim-one-stop-end-to-end",
    ],
    cannibalizationDependencies: ["site-garden-suite-financing-gta", "site-garden-suite", "site-private-mortgage-financing"],
    internalLinkRole: "ancillary-suite-commercial-pillar",
    requiredOriginalEvidence: ["Approved suite-financing criteria", "Address-feasibility intake", "Financing-option decision table", "Partner-role and permit handoff map"],
    confidence: "medium",
    recommendedPriority: "critical",
    nextHumanDecision: "Approve a combined garden-and-laneway replacement page and reject separate lexical-variant money pages.",
    sourceObservationRefs: [
      "source-openseo-garden-research",
      "source-public-serp-garden",
      "source-official-cmhc-refinance",
      "source-official-fcac-home-equity-options",
      "source-official-fcac-heloc",
      "source-user-positioning",
    ],
  }),
  opportunity({
    id: "opportunity-garden-suite-feasibility",
    topic: "Garden-suite feasibility and project-readiness guide",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    clusterIds: ["cluster-garden-suite-feasibility"],
    lifecycleStages: ["feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "project-feasibility",
    intent: "informational",
    urlDisposition: "consolidate",
    existingUrl: "https://www.fairlend.ca/garden-suite",
    proposedUrl: "/garden-suite-financing-gta/feasibility",
    pageType: "resource",
    primaryConversion: "financing-strategy",
    qualificationExpectations: ["Toronto or confirmed GTA municipality property", "Willingness to obtain survey, zoning, access, servicing, tree, permit, budget, and rent evidence"],
    localEvidence: ["source-official-toronto-garden-suites", "source-official-toronto-preapproved-suites"],
    competitorIds: ["competitor-toronto-authority", "competitor-garden-suite-home-search", "competitor-reddit-search"],
    claimIds: ["claim-toronto-suite-definitions", "claim-federal-secondary-suite-loan-available", "claim-toronto-forgivable-suite-loan-available", "claim-ontario-enhanced-rental-rebate"],
    cannibalizationDependencies: ["site-garden-suite", "site-garden-suite-financing-gta"],
    internalLinkRole: "ancillary-suite-authority-and-qualification-node",
    requiredOriginalEvidence: ["Address-feasibility checklist", "Municipality-specific evidence standard", "Current incentive-status log", "Expert-reviewed cost and document taxonomy"],
    confidence: "high",
    recommendedPriority: "high",
    nextHumanDecision: "Approve consolidation of the existing informational page into a sourced feasibility resource.",
    sourceObservationRefs: ["source-openseo-tracer-metrics", "source-openseo-garden-research", "source-official-toronto-garden-suites"],
  }),
  opportunity({
    id: "opportunity-suite-rental-comparison",
    topic: "Long-term versus short-term ancillary-suite rental comparison",
    persona: "garden-laneway-suite-homeowner",
    financingTrigger: "garden-laneway-suite-construction",
    clusterIds: ["cluster-garden-suite-feasibility"],
    lifecycleStages: ["feasibility-capital-takeout-planning", "lease-up-stabilization"],
    funnelStage: "planning-comparison",
    intent: "informational",
    urlDisposition: "consolidate",
    existingUrl: null,
    proposedUrl: "/garden-suite-financing-gta/feasibility",
    pageType: "comparison",
    primaryConversion: "financing-strategy",
    qualificationExpectations: ["Toronto property and intended occupancy pattern", "Willingness to obtain municipal, tax, lender, and insurer review"],
    localEvidence: ["source-official-toronto-short-term-rentals", "source-official-toronto-garden-suites"],
    competitorIds: ["competitor-toronto-authority", "competitor-reddit-search"],
    claimIds: ["claim-toronto-short-term-rental-boundary", "claim-cmhc-refinance-up-to-four-units"],
    cannibalizationDependencies: ["site-garden-suite-financing-gta", "site-garden-suite"],
    internalLinkRole: "ancillary-suite-use-case-comparison-node",
    requiredOriginalEvidence: ["Municipal-rule comparison", "Tax and financing decision matrix", "Long-term rent methodology", "Professional review dates"],
    confidence: "high",
    recommendedPriority: "low",
    nextHumanDecision: "Keep this as a comparison module inside the feasibility resource unless a future SERP sample validates a distinct URL.",
    sourceObservationRefs: ["source-official-toronto-short-term-rentals", "source-official-cra-short-term-rental", "source-official-cmhc-refinance"],
  }),
  opportunity({
    id: "opportunity-drawflow-builder-financing",
    topic: "Builder construction financing and DrawFlow qualification",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-draw-cash-flow",
    clusterIds: [
      "cluster-construction-financing-ontario",
      "cluster-draw-mechanics-cash-flow",
      "cluster-draw-pain-reimbursement-gaps",
      "cluster-construction-financing-comparison",
    ],
    lifecycleStages: ["property-identification-acquisition", "pre-construction-readiness", "construction-financing-draws", "institutional-takeout"],
    funnelStage: "financing-qualification",
    intent: "transactional",
    urlDisposition: "replace",
    existingUrl: "https://www.fairlend.ca/construction-draw-financing",
    proposedUrl: "/construction-draw-financing",
    pageType: "money-page",
    primaryConversion: "submit-project-review",
    qualificationExpectations: ["Builder, developer, or project SPV is the borrower", "Identified Ontario project with site control, budget, schedule, permits, equity, liquidity, draw plan, and exit", "Willingness to document existing debt, project obligations, and professional team"],
    localEvidence: ["source-official-ontario-construction-act", "source-public-serp-draw"],
    competitorIds: ["competitor-tordon-commercial", "competitor-construction-funding-commercial", "competitor-insight-search"],
    claimIds: ["claim-drawflow-on-demand-line", "claim-drawflow-fifty-percent", "claim-one-stop-end-to-end"],
    cannibalizationDependencies: ["site-construction-draw-financing", "site-private-mortgage-financing", "site-multiplex-financing-gta"],
    internalLinkRole: "builder-financing-commercial-pillar",
    requiredOriginalEvidence: ["Approved DrawFlow term sheet and operating procedure", "Eligible-cost and verification policy", "Builder qualification matrix", "Case-evidence dossier with locked savings claim"],
    confidence: "high",
    recommendedPriority: "critical",
    nextHumanDecision: "Approve replacement positioning for builder borrowers and keep the savings claim locked until case review.",
    sourceObservationRefs: ["source-openseo-drawflow-research", "source-public-serp-draw", "source-user-positioning", "source-official-ontario-construction-act"],
  }),
  opportunity({
    id: "opportunity-construction-draw-guide",
    topic: "Ontario construction draw mechanics and cash-flow guide",
    persona: "builder-seeking-flexible-construction-financing",
    financingTrigger: "construction-draw-cash-flow",
    clusterIds: [
      "cluster-draw-mechanics-cash-flow",
      "cluster-draw-pain-reimbursement-gaps",
      "cluster-construction-financing-comparison",
    ],
    lifecycleStages: ["pre-construction-readiness", "construction-financing-draws"],
    funnelStage: "planning-comparison",
    intent: "informational",
    urlDisposition: "proposed-new",
    existingUrl: null,
    proposedUrl: "/construction-draw-financing/how-construction-draws-work-ontario",
    pageType: "resource",
    primaryConversion: "financing-strategy",
    qualificationExpectations: ["Ontario project context", "Willingness to document budget, schedule, deposits, trades, inspections, holdbacks, draw timing, and exit"],
    localEvidence: ["source-official-ontario-construction-act", "source-search-insight-draw-guide"],
    competitorIds: ["competitor-insight-search", "competitor-tordon-commercial", "competitor-reddit-search"],
    claimIds: ["claim-drawflow-on-demand-line", "claim-drawflow-fifty-percent"],
    cannibalizationDependencies: ["site-construction-draw-financing"],
    internalLinkRole: "builder-financing-authority-and-ai-citation-node",
    requiredOriginalEvidence: ["Draw request and verification diagram", "Eligible-cost and deposit matrix", "Holdback and cash-flow worksheet", "Approved comparison assumptions"],
    confidence: "medium",
    recommendedPriority: "high",
    nextHumanDecision: "Approve the draw-process evidence model and require product and legal review.",
    sourceObservationRefs: ["source-public-serp-draw", "source-official-canada-guaranty-draws", "source-official-ontario-construction-act"],
  }),
  opportunity({
    id: "opportunity-stalled-project-rescue",
    topic: "Stalled construction and lender-replacement financing",
    persona: "bank-declined-viable-project-borrower",
    financingTrigger: "rescue-refinance-lender-replacement",
    clusterIds: ["cluster-stalled-project-rescue"],
    lifecycleStages: ["rescue-refinance-lender-replacement"],
    funnelStage: "immediate-transaction-problem",
    intent: "transactional",
    urlDisposition: "consolidate",
    existingUrl: null,
    proposedUrl: "/construction-draw-financing",
    pageType: "resource",
    primaryConversion: "submit-project-review",
    qualificationExpectations: ["Viable Ontario project with documented completion status", "Current lender, title, liens, payables, cost-to-complete, appraisal, borrower equity, liquidity gap, schedule, and exit evidence", "Acceptance of enhanced legal, valuation, and underwriting review"],
    localEvidence: ["source-official-ontario-construction-act", "source-qualitative-construction-funding-ontario"],
    competitorIds: ["competitor-construction-funding-commercial"],
    claimIds: ["claim-one-stop-end-to-end"],
    cannibalizationDependencies: ["site-construction-draw-financing", "site-private-mortgage-financing"],
    internalLinkRole: "deferred-distressed-project-qualification-module",
    requiredOriginalEvidence: ["Approved rescue-underwriting policy", "Cost-to-complete and lien checklist", "Qualified completion cases", "Legal and compliance approval"],
    confidence: "low",
    recommendedPriority: "defer",
    nextHumanDecision: "Keep this as a deferred research and qualification module with no standalone URL; reconsider only after direct demand, underwriting policy, and qualifying case evidence are supplied.",
    sourceObservationRefs: ["source-qualitative-construction-funding-ontario", "source-qualitative-cedar-faq"],
  }),
  opportunity({
    id: "opportunity-partner-referrals",
    topic: "Mortgage-broker, realtor, and professional project referrals",
    persona: "mortgage-broker-referral-partner",
    financingTrigger: "b2b-referral",
    clusterIds: ["cluster-mortgage-realtor-referral", "cluster-professional-delivery-partners"],
    lifecycleStages: ["property-identification-acquisition", "feasibility-capital-takeout-planning", "pre-construction-readiness"],
    funnelStage: "financing-qualification",
    intent: "transactional",
    urlDisposition: "replace",
    existingUrl: "https://www.fairlend.ca/partners",
    proposedUrl: "/partners",
    pageType: "partner-page",
    primaryConversion: "refer-discuss-project",
    qualificationExpectations: ["Referring partner has borrower consent", "Project is acquisition, construction, five-plus multiplex, bank-declined, or otherwise within the approved matrix", "Builder borrowers seeking their own debt route to builder financing rather than referrals"],
    localEvidence: ["source-official-fsra-referrals", "source-official-reco-financial-benefits", "source-public-serp-partners"],
    competitorIds: ["competitor-fsra-authority", "competitor-lendsimpl-search", "competitor-first-source-commercial"],
    claimIds: ["claim-referral-compensation-disclosure", "claim-one-stop-end-to-end"],
    cannibalizationDependencies: ["site-partners", "site-borrowers", "site-construction-draw-financing"],
    internalLinkRole: "partner-conversion-and-role-routing-node",
    requiredOriginalEvidence: ["Approved referral policy", "Borrower-versus-partner routing matrix", "Consent and status-update workflow", "Partner-role, compensation, and disclosure approval"],
    confidence: "medium",
    recommendedPriority: "high",
    nextHumanDecision: "Approve the audience and role-routing model; treat the page as authority-led because exact volume is unmeasured.",
    sourceObservationRefs: ["source-public-serp-partners", "source-official-fsra-referrals", "source-search-lendsimpl-realtors", "source-user-positioning"],
  }),
  opportunity({
    id: "opportunity-partner-readiness-resource",
    topic: "Partner project-readiness and referral intake resource",
    persona: "professional-referral-partner",
    financingTrigger: "b2b-referral",
    clusterIds: ["cluster-professional-delivery-partners"],
    lifecycleStages: ["property-identification-acquisition", "pre-construction-readiness"],
    funnelStage: "planning-comparison",
    intent: "informational",
    urlDisposition: "consolidate",
    existingUrl: null,
    proposedUrl: "/partners",
    pageType: "resource",
    primaryConversion: "refer-discuss-project",
    qualificationExpectations: ["Named professional role", "Borrower consent", "Project facts and role-specific documents within the approved intake standard"],
    localEvidence: ["source-official-fsra-referrals", "source-official-toronto-multiplex-guide"],
    competitorIds: ["competitor-fsra-authority", "competitor-first-source-commercial"],
    claimIds: ["claim-referral-compensation-disclosure"],
    cannibalizationDependencies: ["site-partners"],
    internalLinkRole: "partner-authority-and-intake-support-node",
    requiredOriginalEvidence: ["Role-specific intake checklist", "Project eligibility matrix", "Consent and document-sharing policy", "Status-update service standard"],
    confidence: "medium",
    recommendedPriority: "low",
    nextHumanDecision: "Keep this as a readiness module inside the partner page unless exact-audience SERP evidence validates a distinct resource URL.",
    sourceObservationRefs: ["source-official-fsra-referrals", "source-official-toronto-multiplex-guide", "source-reddit-gta-renovation-financing"],
  }),
];

const inventoryById = Object.fromEntries(
  liveSnapshot.siteInventory.map((inventoryRecord) => [inventoryRecord.id, inventoryRecord]),
);

function urlDispositionRecord({
  inventoryId,
  disposition,
  targetUrl,
  decisionStatus,
  linkedOpportunityIds = [],
  decisionBasis,
}) {
  return {
    inventoryId,
    existingUrl: inventoryById[inventoryId].url,
    disposition,
    targetUrl,
    decisionStatus,
    linkedOpportunityIds,
    decisionBasis,
    sourceObservationRefs: [
      "source-observation-live-pages-sitemap-2026-07-16",
      ...linkedOpportunityIds.flatMap(
        (opportunityId) =>
          pageOpportunities.find((opportunity) => opportunity.id === opportunityId)
            ?.sourceObservationRefs ?? [],
      ),
    ],
  };
}

const existingUrlDispositions = [
  urlDispositionRecord({
    inventoryId: "site-home",
    disposition: "preserve",
    targetUrl: "/",
    decisionStatus: "validated-core-surface",
    linkedOpportunityIds: ["opportunity-homepage-pathways"],
    decisionBasis: "Retain the homepage as the brand and qualified-pathway root; future changes remain proposal-only.",
  }),
  urlDispositionRecord({
    inventoryId: "site-affordable-sustainable-rental-housing",
    disposition: "consolidate",
    targetUrl: "/multiplex-financing-gta/mli-select",
    decisionStatus: "proposed-consolidation",
    linkedOpportunityIds: ["opportunity-mli-select-planning-guide"],
    decisionBasis: "Reuse only verified affordability and sustainability evidence inside the MLI planning resource; no distinct SERP-backed page boundary exists.",
  }),
  urlDispositionRecord({
    inventoryId: "site-borrowers",
    disposition: "preserve",
    targetUrl: "/borrowers",
    decisionStatus: "provisional-out-of-trial-scope",
    decisionBasis: "Retain as a future borrower-routing hub until full-scale intent and navigation research determines its winning role.",
  }),
  urlDispositionRecord({
    inventoryId: "site-institutional-mortgage",
    disposition: "preserve",
    targetUrl: "/borrowers/institutional-mortgage",
    decisionStatus: "provisional-out-of-trial-scope",
    linkedOpportunityIds: ["opportunity-mli-select-planning-guide"],
    decisionBasis: "Retain the URL pending broader institutional-intent research; route relevant five-plus support to the MLI resource without assuming full consolidation.",
  }),
  urlDispositionRecord({
    inventoryId: "site-private-mortgage-financing",
    disposition: "preserve",
    targetUrl: "/borrowers/private-mortgage-financing",
    decisionStatus: "provisional-out-of-trial-scope",
    decisionBasis: "Retain as an alternative-financing feeder pending dedicated private-mortgage research; prevent it from absorbing project-specific construction intent.",
  }),
  urlDispositionRecord({
    inventoryId: "site-construction-draw-financing",
    disposition: "replace",
    targetUrl: "/construction-draw-financing",
    decisionStatus: "validated-replacement-proposal",
    linkedOpportunityIds: ["opportunity-drawflow-builder-financing"],
    decisionBasis: "Replace the naive page at the same URL with the evidence-gated builder-financing intent after separate content authorization.",
  }),
  urlDispositionRecord({
    inventoryId: "site-contact",
    disposition: "preserve",
    targetUrl: "/contact",
    decisionStatus: "utility-preserve",
    decisionBasis: "Retain as a utility/contact endpoint; conversion instrumentation and regulatory identity remain separate requirements.",
  }),
  urlDispositionRecord({
    inventoryId: "site-disclosures",
    disposition: "preserve",
    targetUrl: "/disclosures",
    decisionStatus: "legal-preserve",
    decisionBasis: "Retain the legal disclosure surface and subject any revision to Principal Broker and legal review.",
  }),
  urlDispositionRecord({
    inventoryId: "site-privacy-policy",
    disposition: "preserve",
    targetUrl: "/en/brokerage/privacy-policy",
    decisionStatus: "legal-preserve",
    decisionBasis: "Retain the privacy surface; do not consolidate it into marketing pages.",
  }),
  urlDispositionRecord({
    inventoryId: "site-garden-suite-financing-gta",
    disposition: "replace",
    targetUrl: "/garden-suite-financing-gta",
    decisionStatus: "validated-replacement-proposal",
    linkedOpportunityIds: ["opportunity-garden-laneway-financing"],
    decisionBasis: "Replace at the same URL with one combined garden-and-laneway financing intent after evidence and content approval.",
  }),
  urlDispositionRecord({
    inventoryId: "site-garden-suite",
    disposition: "consolidate",
    targetUrl: "/garden-suite-financing-gta/feasibility",
    decisionStatus: "validated-consolidation-proposal",
    linkedOpportunityIds: ["opportunity-garden-suite-feasibility"],
    decisionBasis: "Consolidate reusable feasibility facts into the evidence-led resource and plan a redirect only in a separately authorized implementation proposal.",
  }),
  urlDispositionRecord({
    inventoryId: "site-investing",
    disposition: "preserve",
    targetUrl: "/investing",
    decisionStatus: "out-of-trial-scope",
    decisionBasis: "Retain the investor surface unchanged; investor acquisition is outside the borrower/project-financing trial.",
  }),
  urlDispositionRecord({
    inventoryId: "site-private-mortgage-lending",
    disposition: "preserve",
    targetUrl: "/investing/private-mortgage-lending",
    decisionStatus: "out-of-trial-scope",
    decisionBasis: "Retain the lender/investor surface unchanged and keep securities/investor messaging outside this research scope.",
  }),
  urlDispositionRecord({
    inventoryId: "site-multiplex-financing-gta",
    disposition: "replace",
    targetUrl: "/multiplex-financing-gta",
    decisionStatus: "validated-replacement-proposal",
    linkedOpportunityIds: ["opportunity-five-plus-mli-financing"],
    decisionBasis: "Replace at the same URL with a five-plus-first commercial boundary while keeping two-to-four-unit intent explicit and secondary.",
  }),
  urlDispositionRecord({
    inventoryId: "site-partners",
    disposition: "replace",
    targetUrl: "/partners",
    decisionStatus: "authority-led-replacement-proposal",
    linkedOpportunityIds: ["opportunity-partner-referrals", "opportunity-partner-readiness-resource"],
    decisionBasis: "Replace the generic page with distinct referral roles and a readiness module; exact organic partner volume remains unmeasured.",
  }),
  urlDispositionRecord({
    inventoryId: "site-posts",
    disposition: "preserve",
    targetUrl: "/posts",
    decisionStatus: "provisional-editorial-index",
    decisionBasis: "Retain as the editorial collection endpoint; future taxonomy and indexation decisions require the full content inventory.",
  }),
  urlDispositionRecord({
    inventoryId: "site-terms",
    disposition: "preserve",
    targetUrl: "/terms",
    decisionStatus: "legal-preserve",
    decisionBasis: "Retain the terms surface and keep it outside SEO consolidation decisions.",
  }),
];

function briefFor(opportunityRecord) {
  const short = opportunityRecord.id.replace("opportunity-", "");
  const primaryQuestions = opportunityRecord.aiQuestionIds.slice(0, 3).map(
    (id) => aiQuestions.find((question) => question.id === id)?.question,
  ).filter(Boolean);
  const questions = primaryQuestions.length > 0
    ? primaryQuestions
    : ["What decision must a qualified visitor make before using this conversion path?"];
  return {
    id: `brief-${short}`,
    opportunityId: opportunityRecord.id,
    contentBoundary: "requirements-only",
    pagePurpose: `REQUIREMENT: Define the decisions and evidence a future ${opportunityRecord.topic.toLowerCase()} page must cover.`,
    audience: `REQUIREMENT: Address ${opportunityRecord.persona.replaceAll("-", " ")} visitors who meet the stated qualification expectations.`,
    problemTrigger: `REQUIREMENT: Clarify the ${opportunityRecord.financingTrigger.replaceAll("-", " ")} trigger without assuming project eligibility.`,
    sectionRequirements: [
      {
        id: `section-${short}-fit`,
        headingRequirement: "REQUIREMENT: Define the audience, project boundary, and disqualifying traffic before presenting a path.",
        questions: questions.slice(0, 1).map((question) => `QUESTION: ${question}`),
        evidenceNeeded: [
          `EVIDENCE: ${opportunityRecord.qualificationExpectations.join("; ")}`,
          `EVIDENCE: ${opportunityRecord.requiredOriginalEvidence[0]}`,
        ],
      },
      {
        id: `section-${short}-decision`,
        headingRequirement: "REQUIREMENT: Compare the relevant financing, program, use-case, or role decisions using equivalent and current assumptions.",
        questions: (questions.slice(1, 2).length ? questions.slice(1, 2) : ["Which alternatives must be compared before a qualified next step?"]).map((question) => `QUESTION: ${question}`),
        evidenceNeeded: [
          `EVIDENCE: ${opportunityRecord.requiredOriginalEvidence.slice(0, 3).join("; ")}`,
          `EVIDENCE: Claim records ${opportunityRecord.claimIds.join(", ") || "none"}`,
        ],
      },
      {
        id: `section-${short}-process`,
        headingRequirement: "REQUIREMENT: Describe the stage gates, documents, professional roles, risks, and handoffs without promising approval or outcomes.",
        questions: (questions.slice(2, 3).length ? questions.slice(2, 3) : ["What evidence is required before the next financing or referral decision?"]).map((question) => `QUESTION: ${question}`),
        evidenceNeeded: [
          `EVIDENCE: ${opportunityRecord.requiredOriginalEvidence.join("; ")}`,
          `EVIDENCE: Source observations ${opportunityRecord.localEvidence.join(", ")}`,
        ],
      },
      {
        id: `section-${short}-routing`,
        headingRequirement: "REQUIREMENT: Route only qualified users to the approved conversion and redirect adjacent or excluded intent.",
        questions: ["QUESTION: Which facts must the user submit, and which facts require a professional review?"],
        evidenceNeeded: [
          `EVIDENCE: Approved ${opportunityRecord.primaryConversion.replaceAll("-", " ")} intake specification`,
          "EVIDENCE: Privacy, consent, licensing, and compliance approval",
        ],
      },
    ],
    ctaSpecification: `REQUIREMENT: Route qualified users to ${opportunityRecord.primaryConversion.replaceAll("-", " ")} and state the required intake facts.`,
    internalLinkRequirements: [
      `REQUIREMENT: Connect this ${opportunityRecord.internalLinkRole.replaceAll("-", " ")} to its parent hub, related decision resources, disclosures, and conversion path.`,
      `REQUIREMENT: Clarify cannibalization and redirect dependencies for ${opportunityRecord.cannibalizationDependencies.join(", ") || "no existing URL"}.`,
    ],
    schemaOpportunities: [
      "REQUIREMENT: Evaluate Service, FinancialProduct, FAQPage, Article, and BreadcrumbList only where visible reviewed content satisfies each schema type.",
      "REQUIREMENT: Validate entity, author, reviewer, dateModified, jurisdiction, and source citations for AI and search retrieval.",
      "REQUIREMENT: Specify metadata decision inputs, target intent, jurisdiction, evidence boundaries, and duplication constraints without writing a final title or description.",
    ],
    approvalRequirements: [
      "REQUIREMENT: Obtain Principal Broker and marketing-compliance approval for financial, program, qualification, and outcome statements.",
      "REQUIREMENT: Obtain legal, tax, planning, or privacy review where the evidence register assigns that gate.",
      "REQUIREMENT: Require provisional, prohibited, and research-only claims to remain outside public output.",
      "REQUIREMENT: Validate the FSRA-authorized brokerage name and brokerage licence number and require both to appear clearly and prominently on every future public page.",
      "REQUIREMENT: Require every named broker or agent to use the FSRA-verified licensed name and prescribed licence-class title with clear brokerage attribution.",
      "REQUIREMENT: Require any fixed-amount mortgage rate, payment, or non-interest-charge representation to include APR and term at equal prominence and an identified representative example where terms vary.",
      "REQUIREMENT: Require future public output to exclude absolute approval or outcome promises, false or misleading statements, and regulatory-endorsement framing.",
    ],
    successMeasures: [
      `REQUIREMENT: Measure qualified ${opportunityRecord.primaryConversion.replaceAll("-", " ")} starts and completed submissions separately from raw sessions.`,
      "REQUIREMENT: Measure non-brand impressions, qualified-query coverage, assisted conversions, source citations, and evidence freshness without promising rankings.",
    ],
    confidence: opportunityRecord.confidence,
    sourceObservationRefs: unique([
      ...opportunityRecord.sourceObservationRefs,
      "source-official-ontario-brokerage-public-relations",
      "source-official-ontario-individual-public-relations",
      "source-official-ontario-cost-of-borrowing-advertising",
    ]),
  };
}

const briefs = pageOpportunities.map(briefFor);

function spendEventFromOperational(event, overrides = {}) {
  return {
    id: overrides.id ?? `spend-${event.id.replaceAll("-", "")}`,
    provider: "DataForSEO via OpenSEO",
    operation: overrides.operation ?? event.endpoint,
    providerTaskIds: [],
    workstream: overrides.workstream ?? event.workstream,
    requestedRowCount: overrides.requestedRowCount ?? 0,
    returnedRowCount: overrides.returnedRowCount ?? 0,
    estimatedCost: overrides.estimatedCost ?? event.estimatedCost,
    actualCost: overrides.actualCost ?? event.actualCost,
    currency: "USD",
    occurredAt: event.finishedAt ?? event.startedAt,
    status: overrides.status ?? "returned",
    retryCount: overrides.retryCount ?? 0,
    sourceObservationRefs: overrides.sourceObservationRefs ?? [],
  };
}

function requireOperationalEvent(id, expected) {
  const matches = operationalLedger.filter((event) => event.id === id);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one operational ledger event ${id}; found ${matches.length}`);
  }
  const event = matches[0];
  for (const [field, value] of Object.entries(expected)) {
    if (event[field] !== value) {
      throw new Error(
        `Operational ledger event ${id} has ${field}=${event[field]}; expected ${value}`,
      );
    }
  }
  return event;
}

if (operationalLedger.length !== 9) {
  throw new Error(`Expected nine one-to-one operational ledger events; found ${operationalLedger.length}`);
}

const eventTracerInitial = requireOperationalEvent("75967d89-c6e4-4e15-853a-049c750b3df3", {
  workstream: "tracer",
  endpoint: "dataforseo_labs_google_keyword_overview",
  tool: "get_keyword_metrics",
});
const eventTracerRetry = requireOperationalEvent("fbc804d3-2225-45af-8986-5cc9aa6b665c", {
  workstream: "tracer",
  endpoint: "dataforseo_labs_google_keyword_overview",
  tool: "get_keyword_metrics",
});
const eventFive = requireOperationalEvent("d6e987e0-4b99-4691-bca5-832d74047456", {
  workstream: "five-plus-unit-multiplex-mli-select",
  endpoint: "openseo_research_keywords_labs",
  tool: "research_keywords",
});
const eventGarden = requireOperationalEvent("f50339c6-0dd4-41d8-aa1e-4ef3899f6770", {
  workstream: "garden-laneway-suite-financing",
  endpoint: "openseo_research_keywords_labs",
  tool: "research_keywords",
});
const eventDraw = requireOperationalEvent("814d79ca-09f4-475c-8e6f-9be3905ed0e5", {
  workstream: "drawflow-builder-financing",
  endpoint: "openseo_research_keywords_labs",
  tool: "research_keywords",
});
const eventB2b = requireOperationalEvent("e4008406-97f3-4d8f-a9be-0f4da99071ea", {
  workstream: "b2b-partner-referral",
  endpoint: "openseo_research_keywords_labs",
  tool: "research_keywords",
});
const eventSerps = requireOperationalEvent("f2ffe459-eaf3-49fd-9fc4-e9bd35feee10", {
  workstream: "verification-reserve",
  endpoint: "serp_organic_live_advanced",
  tool: "get_serp_results",
});
const eventCompetitors = requireOperationalEvent("ec40ca38-587d-4926-8d2b-ea56ae185dca", {
  workstream: "verification-reserve",
  endpoint: "dataforseo_labs_google_serp_competitors",
  tool: "find_serp_competitors",
});
const eventSerpRetry = requireOperationalEvent("dba68b0c-0c03-4e0e-978e-22bb40a7fd23", {
  workstream: "verification-reserve",
  endpoint: "serp_organic_live_advanced",
  tool: "get_serp_results",
});

const spendEvents = [
  spendEventFromOperational(eventTracerInitial, {
    id: "spend-tracer-initial",
    operation: "keyword-overview-live",
    requestedRowCount: 1,
    returnedRowCount: 0,
    sourceObservationRefs: ["source-openseo-tracer-initial"],
  }),
  spendEventFromOperational(eventTracerRetry, {
    id: "spend-tracer-retry",
    operation: "keyword-overview-live",
    requestedRowCount: 3,
    returnedRowCount: 3,
    retryCount: 1,
    sourceObservationRefs: ["source-openseo-tracer-metrics"],
  }),
  spendEventFromOperational(eventFive, {
    id: "spend-five-plus-expansion",
    operation: "research-keywords-live",
    requestedRowCount: 300,
    returnedRowCount: 300,
    sourceObservationRefs: ["source-openseo-five-plus-research"],
  }),
  spendEventFromOperational(eventGarden, {
    id: "spend-garden-expansion",
    operation: "research-keywords-live",
    requestedRowCount: 300,
    returnedRowCount: 300,
    sourceObservationRefs: ["source-openseo-garden-research"],
  }),
  spendEventFromOperational(eventDraw, {
    id: "spend-drawflow-expansion",
    operation: "research-keywords-live",
    requestedRowCount: 300,
    returnedRowCount: 300,
    sourceObservationRefs: ["source-openseo-drawflow-research"],
  }),
  spendEventFromOperational(eventB2b, {
    id: "spend-b2b-expansion",
    operation: "research-keywords-live",
    requestedRowCount: 150,
    returnedRowCount: 150,
    sourceObservationRefs: ["source-openseo-b2b-research"],
  }),
  spendEventFromOperational(eventSerps, {
    id: "spend-representative-serp-batch",
    operation: "organic-live-advanced",
    requestedRowCount: 4,
    returnedRowCount: 0,
    status: "failed",
    sourceObservationRefs: ["source-openseo-serp-failures"],
  }),
  spendEventFromOperational(eventCompetitors, {
    id: "spend-mli-competitors",
    operation: "serp-competitors-live",
    requestedRowCount: 30,
    returnedRowCount: 30,
    sourceObservationRefs: ["source-openseo-mli-competitors"],
  }),
  spendEventFromOperational(eventSerpRetry, {
    id: "spend-serp-retry-failed",
    operation: "organic-live-advanced",
    requestedRowCount: 1,
    returnedRowCount: 0,
    status: "failed",
    retryCount: 1,
    sourceObservationRefs: ["source-openseo-serp-retry-failure"],
  }),
];

const spent = sum(spendEvents.map((event) => event.actualCost ?? 0));
const committed = sum(spendEvents.map((event) => event.actualCost ?? event.estimatedCost));
const costUndisclosedEstimate = committed - spent;

const researchPackage = {
  contractVersion: "1.0.0",
  packageId: "fairlend-openseo-trial-2026-07-16",
  generatedAt,
  manifest: {
    runId: "fairlend-openseo-trial-run-2026-07-16",
    status: "complete",
    market: {
      country: "CA",
      language: "en",
      primaryLocation: "Toronto, Ontario, Canada",
      secondaryLocation: "Greater Toronto Area, Ontario, Canada",
    },
    budget: {
      currency: "USD",
      hardCeiling: 0.9,
      spent,
      committed,
      remaining: Math.round((0.9 - committed) * 1_000_000) / 1_000_000,
    },
    authorization: {
      siteMode: "read-only",
      cmsMode: "read-only",
      repositorySourceMode: "read-only",
      platformMode: "read-only",
      externalAccountMode: "read-only",
      allowedWrites: ["research-artifacts"],
    },
    mutations: [],
    contentBoundary: "requirements-only",
    tools: [
      { name: "OpenSEO", version: "0.0.28", commit: "8460df1f2947661f07c0d751e855703dd268023f" },
      { name: "DataForSEO API", version: "v3", commit: "provider-managed-2026-07-16" },
      { name: "Codex SEO Universal SEO Analysis Skill", version: "1.9.6", commit: "v1.9.6-codex.5" },
      { name: "FairLend research contracts", version: "1.0.0", commit: "b9733bce4b74909a2b3285a13829c8ef0e96d403" },
    ],
    sourceObservationRefs: [
      "source-openseo-runtime",
      "source-codex-seo-methodology",
      "source-dataforseo-account-pricing",
      "source-observation-live-pages-sitemap-2026-07-16",
      "source-user-positioning",
    ],
  },
  sourceObservations,
  siteInventory: liveSnapshot.siteInventory,
  auditFindings: auditSnapshot.auditFindings,
  keywords,
  clusters,
  serpEvidence,
  competitors,
  pageOpportunities,
  aiQuestions,
  claims,
  briefs,
  spendEvents,
};

const workstreamByCluster = Object.fromEntries(clusters.map((cluster) => [cluster.id, cluster.workstream]));

function evidenceOwner(requirement) {
  const normalized = requirement.toLowerCase();
  if (/term sheet|financ|lender|underwriting|qualification|eligible-cost|intake criteria/.test(normalized)) {
    return "FairLend Principal Broker";
  }
  if (/partner|referral|consent|compensation|disclosure|privacy/.test(normalized)) {
    return "FairLend compliance";
  }
  if (/legal|compliance/.test(normalized)) {
    return "FairLend legal and compliance";
  }
  if (/case|outcome|testimonial|permission/.test(normalized)) {
    return "FairLend operations and compliance";
  }
  if (/municip|program|tax|permit|planning|zoning|scorecard/.test(normalized)) {
    return "FairLend SEO operator and assigned professional reviewer";
  }
  return "FairLend operations";
}

const evidenceRegister = pageOpportunities.flatMap((page) => {
  const sourcePack = {
    suffix: "external-source-pack",
    requirement: "Recorded external and local source observations supporting the page decision",
    status: page.localEvidence.length > 0 ? "available-general" : "missing",
    owner: "FairLend SEO operator",
    sourceObservationRefs: page.localEvidence,
    gate: "Source URL, timestamp, jurisdiction, anchor, and freshness recorded",
    refreshCadence: "30 days for financial programs; 90 days for planning rules",
  };
  const originalEvidence = page.requiredOriginalEvidence.map((requirement, index) => ({
    suffix: `original-${index + 1}`,
    requirement,
    status: "missing",
    owner: evidenceOwner(requirement),
    sourceObservationRefs: [],
    gate: "Artifact supplied, provenance recorded, limitations stated, and intended public use approved",
    refreshCadence: "before drafting and before publication",
  }));
  const regulatoryEvidence = [
    {
      suffix: "mblaa-brokerage-identity",
      requirement: "FSRA-verified authorized brokerage name and brokerage licence number for clear and prominent display on every public page",
      status: "missing",
      sourceObservationRefs: ["source-official-ontario-brokerage-public-relations"],
      gate: "Principal Broker validates the public registry record and page-level display before drafting and publication",
    },
    {
      suffix: "mblaa-individual-identity",
      requirement: "FSRA-verified licensed names, prescribed licence-class titles, and brokerage attribution for every broker or agent who appears",
      status: "pending-if-individual-named",
      sourceObservationRefs: ["source-official-ontario-individual-public-relations"],
      gate: "Principal Broker validates each identity, title, and attribution or the page names no individual",
    },
    {
      suffix: "mblaa-rate-advertising",
      requirement: "APR, term, equal-prominence, and representative-example control for any fixed-amount mortgage rate, payment, or non-interest-charge representation",
      status: "pending-if-trigger-used",
      sourceObservationRefs: ["source-official-ontario-cost-of-borrowing-advertising"],
      gate: "Principal Broker and compliance approve the calculation and rendered prominence or the page contains no triggering representation",
    },
    {
      suffix: "mblaa-misleading-guarantee-control",
      requirement: "Public-output control excluding guarantees, guaranteed approval or outcomes, false or misleading statements, and regulatory-endorsement framing",
      status: "pending",
      sourceObservationRefs: ["source-official-ontario-brokerage-public-relations"],
      gate: "Principal Broker and compliance complete a rendered-page review before publication",
    },
  ].map((entry) => ({
    ...entry,
    owner: "FairLend Principal Broker and compliance",
    refreshCadence: "before drafting and before publication",
  }));
  const approval = {
    suffix: "approval",
    requirement: "Page-level financial, legal, privacy, planning, tax, and marketing review",
    status: "pending",
    owner: "FairLend compliance",
    sourceObservationRefs: [],
    gate: "All linked claim records and original-evidence requirements cleared for intended usage",
    refreshCadence: "before drafting and before publication",
  };
  return [sourcePack, ...originalEvidence, ...regulatoryEvidence, approval].map((entry) => ({
    evidenceId: `evidence-${page.id.replace("opportunity-", "")}-${entry.suffix}`,
    opportunityId: page.id,
    proposedUrl: page.proposedUrl,
    workstream: workstreamByCluster[page.clusterIds[0]],
    requirement: entry.requirement,
    status: entry.status,
    owner: entry.owner,
    sourceObservationRefs: entry.sourceObservationRefs.join(" | "),
    verificationGate: entry.gate,
    refreshCadence: entry.refreshCadence,
  }));
});

const opportunityScenarios = [
  {
    id: "scenario-drawflow-builder-financing",
    frontier: "lead-capture",
    opportunityIds: [
      "opportunity-drawflow-builder-financing",
      "opportunity-construction-draw-guide",
    ],
    conservativeDemandScenario:
      "90 monthly searches observed for construction loan Toronto; this is an explicit local commercial signal, not a total-addressable-demand estimate.",
    baseDemandScenario:
      "90–170 monthly searches per observed Toronto or Ontario construction-finance term; close variants and overlapping intent must not be added.",
    upsideDemandScenario:
      "Up to 880 monthly searches for the Canada-level construction financing head term; mixed geography and audience prevent treating this as GTA lead demand.",
    clickOpportunity:
      "Unquantified because the paid Toronto SERP failed; the public sample confirms mixed commercial, legal-process, insurer, and bank competition only.",
    rankingHorizonBand:
      "Unknown-to-long for a new domain; establish successful mobile SERPs plus 90 days of indexed GSC history before assigning a month range.",
    expectedLeadQuality:
      "Tier A when a builder or project entity has site control, capital, documentation, a live project, and an exit; mixed for broad consumer or self-build traffic.",
    conversionAssumptions:
      "Conservative: count zero until qualified-assessment completion and source attribution are instrumented. Base: count only completed assessments meeting the qualification contract. Upside: include assisted conversions only after CRM validation. No numerical conversion rate is evidence-supported.",
    confidence: "medium",
    dependencies: [
      "Successful Toronto mobile SERP sample",
      "GSC, GA4, and CRM attribution",
      "Approved builder qualification matrix",
      "Approved DrawFlow product evidence",
    ],
  },
  {
    id: "scenario-five-plus-mli-select",
    frontier: "lead-capture-and-authority",
    opportunityIds: [
      "opportunity-five-plus-mli-financing",
      "opportunity-mli-select-planning-guide",
      "opportunity-five-plus-financing-roadmap",
    ],
    conservativeDemandScenario:
      "10–20 monthly searches per exact MLI Select financing variant; this is the clearest measured buying-intent floor and variants are not additive.",
    baseDemandScenario:
      "Exact financing variants plus adjacent local construction-financing demand may support discovery, but only explicit five-plus qualification can be counted as target demand.",
    upsideDemandScenario:
      "MLI Select has 1,600 Canada-level monthly searches as a topic/authority ceiling, not as a financing-lead estimate.",
    clickOpportunity:
      "Unquantified because the paid Toronto SERP failed; the public sample and MLI competitor set show both institutional/authority and commercial results.",
    rankingHorizonBand:
      "Unknown-to-long; re-estimate after indexation, backlink/authority baseline, successful mobile SERPs, and 90 days of GSC query data.",
    expectedLeadQuality:
      "Tier A for identified five-plus build-to-hold projects with capital and a construction-to-takeout plan; lower for broad program education without a property or timeline.",
    conversionAssumptions:
      "Conservative: count zero until the five-plus intake gate is instrumented. Base: count only completed five-plus assessments. Upside: count authority-assisted assessments only when CRM attribution proves the path. No numerical conversion rate is evidence-supported.",
    confidence: "medium",
    dependencies: [
      "Approved five-plus intake criteria",
      "Current approved-lender program review",
      "Successful Toronto mobile SERP sample",
      "GSC, GA4, CRM, and backlink baselines",
    ],
  },
  {
    id: "scenario-garden-laneway-suite",
    frontier: "lead-capture-and-authority",
    opportunityIds: [
      "opportunity-garden-laneway-financing",
      "opportunity-garden-suite-feasibility",
      "opportunity-suite-rental-comparison",
    ],
    conservativeDemandScenario:
      "Financing-specific monthly demand is unavailable; no numeric financing-demand floor is inferred from topic-only terms.",
    baseDemandScenario:
      "210–590 monthly searches per Toronto garden-suite topic variant show local project interest, with mixed research and commercial intent and no additive total.",
    upsideDemandScenario:
      "Garden suite has 1,900 Canada-level monthly searches as a topic ceiling, not as GTA financing demand.",
    clickOpportunity:
      "Unquantified because the paid Toronto SERP failed; the public sample validates finance/lender participation but not rank, device, or CTR.",
    rankingHorizonBand:
      "Unknown-to-long; re-estimate after indexation, successful mobile SERPs, local authority evidence, and 90 days of GSC data.",
    expectedLeadQuality:
      "Tier A/B when a GTA homeowner has an address, equity, budget, long-term rental intent, and a 12-month plan; low for design-only, rental-listing, or Airbnb-management traffic.",
    conversionAssumptions:
      "Conservative: count zero until address/project qualification is instrumented. Base: count only completed assessments meeting equity, location, and timing gates. Upside: count feasibility-assisted assessments only after CRM validation. No numerical conversion rate is evidence-supported.",
    confidence: "medium",
    dependencies: [
      "Approved suite-financing criteria",
      "Address-feasibility intake",
      "Successful Toronto mobile SERP sample",
      "GSC, GA4, CRM, and municipality evidence",
    ],
  },
  {
    id: "scenario-b2b-partner-referrals",
    frontier: "authority-and-partner-conversion",
    opportunityIds: [
      "opportunity-partner-referrals",
      "opportunity-partner-readiness-resource",
    ],
    conservativeDemandScenario:
      "Exact organic referral demand is unmeasured; the live provider returned zero qualifying referral or partnership rows.",
    baseDemandScenario:
      "Qualitative regulator, competitor, and workflow evidence supports an authority/conversion path but cannot be converted into monthly demand.",
    upsideDemandScenario:
      "Unestimated until exact partner queries, first-party referral counts, and successful SERPs establish a measurable audience.",
    clickOpportunity:
      "Unquantified; broad mortgage-broker volumes are borrower demand and are expressly excluded from the B2B estimate.",
    rankingHorizonBand:
      "Not estimated; validate the partner audience and referral workflow before assigning an organic ranking horizon.",
    expectedLeadQuality:
      "Potential Tier A when a regulated or professional referrer has a live qualified project; demand volume and conversion frequency are unknown.",
    conversionAssumptions:
      "Conservative: zero organic referrals assumed. Base: count only consented live-file referrals meeting project criteria. Upside: unestimated until CRM cohort data exists. No numerical conversion rate is evidence-supported.",
    confidence: "low",
    dependencies: [
      "Approved referral and consent policy",
      "Role-specific intake matrix",
      "CRM referral-source baseline",
      "Successful exact-audience SERP sample",
    ],
  },
  {
    id: "scenario-stalled-project-rescue",
    frontier: "deferred-high-intent",
    opportunityIds: ["opportunity-stalled-project-rescue"],
    conservativeDemandScenario:
      "Exact rescue-financing demand is unmeasured; legal distress terms are not treated as financing demand.",
    baseDemandScenario:
      "Qualitative problem evidence supports research requirements only and does not establish a standalone addressable market.",
    upsideDemandScenario:
      "Unestimated pending exact metrics, successful SERPs, approved policy, and qualifying completed cases.",
    clickOpportunity:
      "Unquantified; no successful rescue SERP or defensible click set exists.",
    rankingHorizonBand:
      "Not estimated while the opportunity remains deferred and unvalidated.",
    expectedLeadQuality:
      "Potentially high urgency but high underwriting risk; qualification evidence is insufficient for a public lead forecast.",
    conversionAssumptions:
      "Conservative/base/upside lead counts are all unestimated until rescue policy, cost-to-complete evidence, and CRM outcomes exist.",
    confidence: "low",
    dependencies: [
      "Approved rescue-underwriting policy",
      "Cost-to-complete and lien checklist",
      "Exact demand and successful SERP evidence",
      "Qualified completion cases",
    ],
  },
];

const successGates = [
  [1, "Live OpenSEO/DataForSEO keyword evidence retrieved and cost-logged", "pass", "research-package.json spendEvents; run-manifest.json"],
  [2, "Each of four workstreams has at least one defensible cluster", "pass", "keyword-clusters.csv; research-slices/*.md"],
  [3, "Persona, trigger, lifecycle, geography, and funnel classifications complete", "pass", "keyword-universe.csv; research-package.json"],
  [4, "Lead Capture and Authority Build scores separate, null-aware, and auditable", "pass", "keyword-universe.csv; score-rationale.csv; executive-strategy.md"],
  [5, "Live SERP sample changes or validates a page boundary", "pass", "serp-evidence.csv; public SERP fallback validates four boundaries while paid failures remain logged"],
  [6, "Commercial, search, and authority competitors distinguished", "pass", "competitor-landscape.csv"],
  [7, "AI questions separate from volume-bearing keywords and AI surfaces truthfully covered", "pass", "ai-question-opportunities.csv; ai-discovery-coverage.csv; volumeClaimed=false"],
  [8, "Every existing URL has a disposition and greenfield opportunities are mapped without content", "pass", "existing-url-dispositions.csv; greenfield-page-map.md; page-opportunities.csv; content-briefs/"],
  [9, "Required evidence and compliance gates explicit", "pass", "evidence-acquisition-register.csv; claims-and-compliance-register.csv"],
  [10, "DrawFlow 50% claim remains provisional", "pass", "claim-drawflow-fifty-percent; case-study-evidence-template.md"],
  [11, "No prohibited site, CMS, source, platform, or account mutation", "pass", "mutation-audit.md; manifest.mutations=[]; only authorized provider spend and research outputs"],
  [12, "Full production research scope and cost estimated", "pass", "full-scale-research-estimate.md"],
].map(([gate, requirement, status, evidence]) => ({ gate, requirement, status, evidence }));

const artifactIndex = [
  ["README.md", "markdown", "human-entrypoint", null],
  ["research-package.json", "json", "contract-valid-canonical-core", null],
  ["run-manifest.json", "json", "run-and-artifact-manifest", null],
  ["keyword-universe.csv", "csv", "keyword-records", keywords.length],
  ["keyword-clusters.csv", "csv", "cluster-records", clusters.length],
  ["score-rationale.csv", "csv", "keyword-and-page-score-rationales", keywordScoreRationales.length + pageScoreRationales.length],
  ["serp-evidence.csv", "csv", "serp-observations", serpEvidence.length],
  ["competitor-landscape.csv", "csv", "competitor-observations", competitors.length],
  ["page-opportunities.csv", "csv", "page-opportunity-records", pageOpportunities.length],
  ["existing-url-dispositions.csv", "csv", "complete-existing-url-decisions", existingUrlDispositions.length],
  ["ai-question-opportunities.csv", "csv", "non-volume-question-records", aiQuestions.length],
  ["ai-discovery-coverage.csv", "csv", "ai-surface-coverage", aiDiscoveryCoverage.length],
  ["opportunity-scenarios.csv", "csv", "demand-and-lead-quality-scenarios", opportunityScenarios.length],
  ["evidence-acquisition-register.csv", "csv", "missing-evidence-and-approval-gates", evidenceRegister.length],
  ["claims-and-compliance-register.csv", "csv", "claim-status-and-compliance-gates", claims.length],
  ["success-gates.csv", "csv", "contract-success-gates", successGates.length],
  ["executive-strategy.md", "markdown", "executive-decision-summary", null],
  ["methodology-and-limitations.md", "markdown", "methodology-and-limitations", null],
  ["greenfield-page-map.md", "markdown", "proposal-only-information-architecture", null],
  ["case-study-evidence-template.md", "markdown", "blank-drawflow-evidence-template", null],
  ["full-scale-research-estimate.md", "markdown", "production-research-estimate", null],
  ["mutation-audit.md", "markdown", "mutation-boundary-audit", null],
  ["content-briefs/", "directory", "requirements-only-content-briefs", briefs.length],
  ["research-slices/", "directory", "workstream-research-slices", 4],
].map(([relativePath, kind, role, recordCount]) => ({
  relativePath,
  kind,
  role,
  recordCount,
}));

const runManifest = {
  runId: researchPackage.manifest.runId,
  generatedAt,
  executionDate: "2026-07-16",
  status: "complete",
  contractVersion: "1.0.0",
  repositories: {
    llmWiki: { path: "/Users/connor/Dev/llm_wiki", baselineCommit: "b9733bce4b74909a2b3285a13829c8ef0e96d403" },
    fairlendCms: { path: "/Users/connor/Dev/fairlend-cms", baselineCommit: "e8e08964234109c54eaa8d56ea7c2a55b1d6e98f", mode: "research-output-only" },
    openSeo: { path: "/Users/connor/Dev/open-seo", commit: "8460df1f2947661f07c0d751e855703dd268023f", version: "0.0.28" },
  },
  tools: researchPackage.manifest.tools,
  market: {
    keywordMetrics: { locationCode: 2124, location: "Canada", languageCode: "en" },
    paidSerpAttempt: { locationCode: 1002451, location: "Toronto,Toronto,Ontario,Canada", languageCode: "en", device: "not-requested-or-exposed" },
    publicSerpFallback: { queryTarget: "Toronto, Ontario, Canada", searcherLocationExposed: false, stableRankExposed: false, deviceExposed: false },
  },
  methodology: {
    tool: "Codex SEO Universal SEO Analysis Skill",
    version: "1.9.6",
    sourceObservationRef: "source-codex-seo-methodology",
    author: "AgriciDaniel",
    notFairWorkflowStatus: "unproven-no-installed-artifact-identifies-as-notfair",
    methodsInvoked: [
      "keyword-research",
      "keyword-clustering",
      "dual-score-opportunity-planning",
      "serp-and-intent-page-boundaries",
      "seo-geo-ai-answer-readiness",
      "greenfield-information-architecture",
      "requirements-only-content-briefing",
      "mblaa-regulatory-claim-gating",
    ],
  },
  budget: {
    currency: "USD",
    includedBalance: 1,
    hardCeiling: 0.9,
    externalReserve: 0.1,
    startingProviderBalance: balanceBefore.balance,
    endingProviderBalance: balanceAfter.balance,
    spent,
    committed,
    hardCeilingRemaining: researchPackage.manifest.budget.remaining,
    accountBalanceRemaining: balanceAfter.balance,
    envelopes: await readJson(join(runDirectory, "budget-plan.json")).then((plan) => plan.envelopes),
  },
  paidOperations: spendEvents,
  artifactIndex,
  failures: [
    "The first exact long-tail metric tracer returned no row; a three-term retry returned three live rows.",
    "Four Toronto OpenSEO SERP tasks failed with Internal SE Server Error after a USD 0.014 charge.",
    "One serial Canada-location SERP retry timed out without an explicit cost receipt; its USD 0.02 estimate remains committed because an unchanged immediate balance does not prove zero cost.",
    "A public-search-observed query-target sample supplied intent/page-boundary evidence without overwriting provider failures or claiming searcher location, device, or stable rank.",
    "The competitor endpoint returned 30 domains only for MLI Select and no coverage for six other requested keywords.",
    "The installed methodology artifact identifies as AgriciDaniel's Codex SEO Universal SEO Analysis Skill v1.9.6, not NotFair; NotFair-specific workflow provenance remains unproven.",
  ],
  authorization: researchPackage.manifest.authorization,
  prohibitedMutations: [],
  allowedWrites: [outputDirectory, workspace],
};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(join(outputDirectory, "content-briefs"), { recursive: true });
await mkdir(join(outputDirectory, "research-slices"), { recursive: true });
await writeJson(join(outputDirectory, "research-package.json"), researchPackage);
await writeJson(join(outputDirectory, "run-manifest.json"), runManifest);

await writeText(
  join(outputDirectory, "keyword-universe.csv"),
  toCsv(
    keywords.map((keyword) => ({
      id: keyword.id,
      query: keyword.query,
      normalizedQuery: keyword.normalizedQuery,
      seedConcept: keyword.seedConcept,
      clusterId: keyword.clusterId,
      workstream: workstreamByCluster[keyword.clusterId],
      persona: keyword.persona,
      personaDetail: keyword.personaDetail,
      personaTier: keyword.personaTier,
      financingTrigger: keyword.financingTrigger,
      lifecycleStages: keyword.lifecycleStages,
      funnelHeadline: keyword.funnelHeadline,
      funnelStage: keyword.funnelStage,
      geography: keyword.geography,
      intent: keyword.intent,
      relevanceDisposition: keyword.relevanceDisposition,
      exclusionReason: keyword.exclusionReason,
      dataStatus: keyword.metrics.dataStatus,
      monthlySearches: keyword.metrics.monthlySearches,
      trendSeasonality: keyword.metrics.trend.map(
        (point) =>
          `${point.year}-${String(point.month).padStart(2, "0")}:${point.monthlySearches}`,
      ),
      cpc: keyword.metrics.cpc,
      paidCompetition: keyword.metrics.paidCompetition,
      difficulty: keyword.metrics.difficulty,
      serpFeatures: keyword.serpFeatures,
      observedAt: keyword.observedAt,
      leadCaptureScore: keyword.leadCaptureScore.total,
      authorityBuildScore: keyword.authorityBuildScore.total,
      confidence: keyword.confidence,
      sourceObservationRefs: keyword.sourceObservationRefs,
    })),
    [
      "id",
      "query",
      "normalizedQuery",
      "seedConcept",
      "clusterId",
      "workstream",
      "persona",
      "personaDetail",
      "personaTier",
      "financingTrigger",
      "lifecycleStages",
      "funnelHeadline",
      "funnelStage",
      "geography",
      "intent",
      "relevanceDisposition",
      "exclusionReason",
      "dataStatus",
      "monthlySearches",
      "trendSeasonality",
      "cpc",
      "paidCompetition",
      "difficulty",
      "serpFeatures",
      "observedAt",
      "leadCaptureScore",
      "authorityBuildScore",
      "confidence",
      "sourceObservationRefs",
    ],
  ),
);
await writeText(
  join(outputDirectory, "keyword-clusters.csv"),
  toCsv(
    clusters.map((cluster) => ({
      ...cluster,
      primaryQuery: keywords.find((keyword) => keyword.id === cluster.primaryKeywordId)?.query,
      keywordCount: cluster.keywordIds.length,
    })),
    ["id", "name", "workstream", "primaryKeywordId", "primaryQuery", "keywordIds", "keywordCount", "pageBoundaryStatus", "confidence", "sourceObservationRefs"],
  ),
);
await writeText(
  join(outputDirectory, "score-rationale.csv"),
  toCsv(
    [...keywordScoreRationales, ...pageScoreRationales],
    [
      "recordType",
      "recordId",
      "leadCaptureScore",
      "authorityBuildScore",
      "model",
      "inputSummary",
      "evidenceCaps",
    ],
  ),
);
await writeText(
  join(outputDirectory, "serp-evidence.csv"),
  toCsv(
    serpEvidence.map((serp) => ({ ...serp, query: keywords.find((keyword) => keyword.id === serp.queryId)?.query })),
    ["id", "queryId", "query", "location", "device", "observedAt", "dataStatus", "resultUrls", "features", "interpretation", "confidence", "sourceObservationRefs"],
  ),
);
await writeText(
  join(outputDirectory, "competitor-landscape.csv"),
  toCsv(competitors, ["id", "name", "competitorType", "domain", "relevantClusterIds", "observation", "confidence", "sourceObservationRefs"]),
);
await writeText(
  join(outputDirectory, "page-opportunities.csv"),
  toCsv(pageOpportunities.map((page) => ({
    ...page,
    competitorEvidence: page.competitorIds.map((competitorId) => {
      const competitor = competitors.find((candidate) => candidate.id === competitorId);
      return competitor ? `${competitor.id}: ${competitor.observation}` : `${competitorId}: missing`;
    }),
  })), [
    "id",
    "topic",
    "proposedUrl",
    "existingUrl",
    "urlDisposition",
    "pageType",
    "persona",
    "personaDetail",
    "personaTier",
    "financingTrigger",
    "funnelHeadline",
    "funnelStage",
    "lifecycleStages",
    "intent",
    "primaryConversion",
    "clusterIds",
    "qualificationExpectations",
    "localEvidence",
    "competitorIds",
    "competitorEvidence",
    "aiQuestionIds",
    "internalLinkRole",
    "requiredOriginalEvidence",
    "claimIds",
    "cannibalizationDependencies",
    "leadCaptureScore",
    "authorityBuildScore",
    "confidence",
    "recommendedPriority",
    "nextHumanDecision",
    "sourceObservationRefs",
  ]),
);
await writeText(
  join(outputDirectory, "existing-url-dispositions.csv"),
  toCsv(existingUrlDispositions, [
    "inventoryId",
    "existingUrl",
    "disposition",
    "targetUrl",
    "decisionStatus",
    "linkedOpportunityIds",
    "decisionBasis",
    "sourceObservationRefs",
  ]),
);
await writeText(
  join(outputDirectory, "ai-question-opportunities.csv"),
  toCsv(aiQuestions, ["id", "question", "clusterId", "sourceKind", "volumeClaimed", "requiredEvidence", "confidence", "sourceObservationRefs"]),
);
await writeText(
  join(outputDirectory, "ai-discovery-coverage.csv"),
  toCsv(aiDiscoveryCoverage, [
    "surface",
    "status",
    "observation",
    "questionIds",
    "sourceObservationRefs",
    "confidence",
    "nextValidation",
  ]),
);
await writeText(
  join(outputDirectory, "evidence-acquisition-register.csv"),
  toCsv(evidenceRegister, ["evidenceId", "opportunityId", "proposedUrl", "workstream", "requirement", "status", "owner", "sourceObservationRefs", "verificationGate", "refreshCadence"]),
);
await writeText(
  join(outputDirectory, "opportunity-scenarios.csv"),
  toCsv(opportunityScenarios, [
    "id",
    "frontier",
    "opportunityIds",
    "conservativeDemandScenario",
    "baseDemandScenario",
    "upsideDemandScenario",
    "clickOpportunity",
    "rankingHorizonBand",
    "expectedLeadQuality",
    "conversionAssumptions",
    "confidence",
    "dependencies",
  ]),
);
await writeText(
  join(outputDirectory, "claims-and-compliance-register.csv"),
  toCsv(claims, ["id", "claim", "status", "allowedUsage", "requiredEvidence", "owner", "reviewBy", "confidence", "sourceObservationRefs"]),
);
await writeText(
  join(outputDirectory, "success-gates.csv"),
  toCsv(successGates, ["gate", "requirement", "status", "evidence"]),
);

function renderBrief(brief) {
  const page = pageOpportunities.find((opportunityRecord) => opportunityRecord.id === brief.opportunityId);
  const pageClusters = page.clusterIds.map((clusterId) =>
    clusters.find((cluster) => cluster.id === clusterId),
  );
  const pageKeywordIds = new Set(pageClusters.flatMap((cluster) => cluster.keywordIds));
  const pageSerps = serpEvidence.filter((serp) => pageKeywordIds.has(serp.queryId));
  const pageCompetitors = page.competitorIds.map((competitorId) =>
    competitors.find((competitor) => competitor.id === competitorId),
  );
  const pageQuestions = page.aiQuestionIds.map((questionId) =>
    aiQuestions.find((question) => question.id === questionId),
  );
  return `# ${page.topic} — requirements-only research brief

- **Boundary:** ${brief.contentBoundary}
- **Opportunity:** ${page.id}
- **Disposition:** ${page.urlDisposition}
- **Existing URL:** ${page.existingUrl ?? "none"}
- **Proposed URL:** ${page.proposedUrl}
- **Priority:** ${page.recommendedPriority}
- **Lead Capture / Authority Build:** ${page.leadCaptureScore} / ${page.authorityBuildScore} (${page.confidence} confidence)

## Classification and qualification

- Funnel: ${page.funnelHeadline} / ${page.funnelStage}
- Lifecycle: ${page.lifecycleStages.join(" | ")}
- Search intent: ${page.intent}
- Primary conversion specification: ${page.primaryConversion}
- Qualification expectations: ${page.qualificationExpectations.join(" | ")}

## Target clusters and evidence status

${pageClusters
  .map(
    (cluster) =>
      `- ${cluster.id}: ${cluster.name}; boundary ${cluster.pageBoundaryStatus}; ${cluster.confidence} confidence; primary query ${keywords.find((keyword) => keyword.id === cluster.primaryKeywordId)?.query ?? "unavailable"}.`,
  )
  .join("\n")}

## SERP, competitor, and AI-question findings

${
  pageSerps.length > 0
    ? pageSerps
        .map(
          (serp) =>
            `- SERP ${serp.id}: ${serp.dataStatus}; ${serp.location}; device ${serp.device}; ${serp.interpretation}`,
        )
        .join("\n")
    : "- SERP: no direct or cluster-level sample; keep the URL decision unvalidated or deferred."
}
${pageCompetitors
  .map(
    (competitor) =>
      `- Competitor ${competitor.id} (${competitor.competitorType}): ${competitor.observation}`,
  )
  .join("\n")}
${pageQuestions.map((question) => `- ${question.id}: ${question.question}`).join("\n")}

## Purpose, audience, and trigger

- ${brief.pagePurpose}
- ${brief.audience}
- ${brief.problemTrigger}

## Section requirements

${brief.sectionRequirements
  .map(
    (section) => `### ${section.id}

- ${section.headingRequirement}
${section.questions.map((question) => `- ${question}`).join("\n")}
${section.evidenceNeeded.map((evidence) => `- ${evidence}`).join("\n")}`,
  )
  .join("\n\n")}

## Conversion, linking, schema, approvals, and measures

- ${brief.ctaSpecification}
${brief.internalLinkRequirements.map((requirement) => `- ${requirement}`).join("\n")}
${brief.schemaOpportunities.map((requirement) => `- ${requirement}`).join("\n")}
${brief.approvalRequirements.map((requirement) => `- ${requirement}`).join("\n")}
${brief.successMeasures.map((requirement) => `- ${requirement}`).join("\n")}

## Source observation references

${brief.sourceObservationRefs.map((reference) => `- ${reference}`).join("\n")}

This artifact specifies research and evidence requirements only. It is not approved copy, a CMS payload, or an implementation diff.
`;
}

for (const brief of briefs) {
  await writeText(join(outputDirectory, "content-briefs", `${brief.id.replace("brief-", "")}.md`), renderBrief(brief));
}

await writeText(
  join(outputDirectory, "greenfield-page-map.md"),
  `# Greenfield page map — proposal only

The homepage remains the brand and routing root. Every path below is a research disposition, not an implementation instruction. Duplicate proposed URLs mean a module belongs inside the named page rather than earning a separate URL.

## Proposed hierarchy

- / — homepage pathways; preserve.
  - /borrowers — provisional borrower-routing hub; preserve pending full-scale research.
  - /multiplex-financing-gta — five-plus-first commercial page; replace at the same URL.
    - /multiplex-financing-gta/mli-select — MLI planning resource; proposed new.
    - /multiplex-financing-gta/project-financing-roadmap — acquisition-to-takeout resource; proposed new.
  - /garden-suite-financing-gta — combined garden and laneway financing page; replace at the same URL.
    - /garden-suite-financing-gta/feasibility — feasibility resource containing the rental-strategy comparison module.
  - /construction-draw-financing — builder construction-financing page; replace at the same URL.
    - /construction-draw-financing/how-construction-draws-work-ontario — mechanics, pain-point, and comparison resource; proposed new.
    - Deferred stalled-project qualification module — no standalone URL; do not add it to the parent page until its evidence gates pass.
  - /partners — partner/referral page containing the readiness module; authority-led replacement proposal.
  - /investing — preserved and outside this borrower/project-financing trial.
  - /contact, /disclosures, /en/brokerage/privacy-policy, /terms — preserved utility/legal surfaces.

## Complete existing-URL disposition matrix

| Existing URL | Disposition | Target | Status | Decision basis |
|---|---|---|---|---|
${existingUrlDispositions
  .map(
    (record) =>
      `| ${record.existingUrl} | ${record.disposition} | ${record.targetUrl} | ${record.decisionStatus} | ${record.decisionBasis} |`,
  )
  .join("\n")}

Redirects, navigation, metadata, source changes, and Payload CMS operations require a later proposal and explicit authorization.
`,
);

const workstreamSlices = [
  {
    slug: "five-plus-multiplex-mli-select",
    title: "Five-plus-unit multiplex and MLI Select",
    workstream: "five-plus-unit-multiplex-mli-select",
    conclusions: [
      "MLI Select is the strongest authority term: Canada volume 1,600; the financing variants returned 20, 20, and 10.",
      "Construction financing Toronto returned 90 with commercial intent, but generic construction terms do not prove five-plus fit.",
      "The official product minimum is five units; two-to-four-unit intent remains a separate residential boundary.",
      "The public SERP validates a five-plus/MLI commercial page; the Canada competitor sample combines official and commercial domains.",
    ],
  },
  {
    slug: "garden-laneway-suite-financing",
    title: "Garden and laneway-suite financing",
    workstream: "garden-laneway-suite-financing",
    conclusions: [
      "Garden suite returned Canada volume 1,900; garden suites Toronto returned 590 and Toronto garden suites 210.",
      "The expansion returned no keyword combining suite and financing, so exact financing volume remains unavailable.",
      "The public SERP contains dedicated financing pages and a lender product, validating a combined garden-and-laneway money page.",
      "Garden and laneway definitions, Toronto rules, short-term-rental limits, and discontinued programs require separate claim gates.",
    ],
  },
  {
    slug: "drawflow-builder-financing",
    title: "DrawFlow and builder construction financing",
    workstream: "drawflow-builder-financing",
    conclusions: [
      "Construction financing returned Canada volume 880; construction mortgage 590; Ontario construction mortgage 170; Toronto construction loan 90.",
      "The expansion returned no draw-specific keyword, so DrawFlow mechanism demand relies on public SERP, official draw mechanics, and qualitative language.",
      "The public SERP validates one builder money page plus an informational draw-mechanics resource.",
      "Stalled-project rescue remains low-confidence and deferred; the up-to-50% claim remains research-only.",
    ],
  },
  {
    slug: "b2b-partner-referral",
    title: "B2B partner and referral demand",
    workstream: "b2b-partner-referral",
    conclusions: [
      "The live expansion returned no referral or partnership keyword and was dominated by consumer mortgage traffic.",
      "The exact-audience public SERP and FSRA/RECO sources validate a distinct authority-led partner path, not a volume-led acquisition page.",
      "Builders seeking their own debt remain builder-financing customers; builders referring or delivering another party's project use the partner path.",
      "The partner page requires consent, role, disclosure, compensation, and status-update governance before drafting.",
    ],
  },
];

for (const slice of workstreamSlices) {
  const sliceClusters = clusters.filter((cluster) => cluster.workstream === slice.workstream);
  const sliceKeywords = keywords.filter((keyword) => workstreamByCluster[keyword.clusterId] === slice.workstream);
  const included = sliceKeywords.filter((keyword) => keyword.relevanceDisposition === "include");
  await writeText(
    join(outputDirectory, "research-slices", `${slice.slug}.md`),
    `# ${slice.title}

## Evidence-backed conclusions

${slice.conclusions.map((conclusion) => `- ${conclusion}`).join("\n")}

## Clusters

${sliceClusters.map((cluster) => `- **${cluster.name}:** ${cluster.pageBoundaryStatus}; ${cluster.confidence} confidence; ${cluster.keywordIds.length} sampled records.`).join("\n")}

## Included live keyword rows

| Query | Volume | CPC | Difficulty | Funnel | Confidence |
|---|---:|---:|---:|---|---|
${included
  .filter((keyword) => keyword.metrics.dataStatus === "live")
  .sort((a, b) => (b.metrics.monthlySearches ?? -1) - (a.metrics.monthlySearches ?? -1))
  .map((keyword) => `| ${keyword.query} | ${keyword.metrics.monthlySearches ?? "unknown"} | ${keyword.metrics.cpc ?? "unknown"} | ${keyword.metrics.difficulty ?? "unknown"} | ${keyword.funnelHeadline} | ${keyword.confidence} |`)
  .join("\n")}

## Boundaries and exclusions

- Exact metrics are Canada-level; Toronto/GTA specificity comes from query wording, official local sources, and the public SERP sample.
- Fallback idea rows are heavily contaminated; excluded and down-ranked records remain in the universe to make filtering auditable.
- AI questions never inherit search volume unless an exact measured query supports them; all current question records use volumeClaimed=false.
- Proposed URLs are research decisions only and require human approval before copy, CMS, source, or platform work.
`,
  );
}

await writeText(
  join(outputDirectory, "case-study-evidence-template.md"),
  `# DrawFlow anonymized case-study evidence template

This is an evidence-acquisition form, not a case study and not public copy. The up-to-50% interest-savings claim remains **provisional-unverified** and **research-only** until every gate below is complete.

## Case identity and permission

- Case ID:
- Observation period:
- Source-document references:
- Non-identifying borrower archetype:
- Coarse geography:
- Borrower permission status:
- Anonymization reviewer and date:
- Selection method and reason this case is included:

## Project facts

- Project type and unit count:
- Project stage at facility start:
- Total budget and contingency:
- Completion status:
- Capital stack:
- Borrower equity and liquidity:
- Construction schedule:
- Stabilization and exit/takeout plan:
- Delays, defaults, liens, disputes, or exceptions:

## Comparable baseline facility

- Facility commitment:
- Requested and assumed draw schedule:
- Rate convention and rates by period:
- Fees included and excluded:
- Interest calculation method:
- Holdback and inspection assumptions:
- Idle-capital assumptions:
- Extension, default, and delay assumptions:
- Source documents and reviewer:

## Actual DrawFlow facility

- Facility commitment:
- Requested, approved, and funded draw dates and amounts:
- Available but undrawn amounts by period:
- Rate convention and rates by period:
- Fees included and excluded:
- Interest calculation method:
- Verification, holdback, and inspection events:
- Delays, defaults, and exceptions:
- Source documents and reviewer:

## Period-by-period calculation

| Period | Baseline opening balance | Baseline advances | Baseline interest | Baseline fees | Actual opening balance | Actual advances | Actual interest | Actual fees | Source reference |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| YYYY-MM-DD to YYYY-MM-DD | | | | | | | | | |

## Result and sensitivity

- Baseline interest:
- Actual interest:
- Interest-dollar difference:
- Interest-savings formula: (baseline interest - actual interest) / baseline interest
- Interest-savings percentage result:
- Interest denominator rationale:
- Baseline fees:
- Actual fees:
- Baseline financing cost:
- Actual financing cost:
- Total-financing-cost dollar difference:
- Total-cost result is reported separately and is not evidence for the interest-savings percentage: yes/no
- Counterfactual assumptions separated from observed facts:
- Sensitivity to draw timing:
- Sensitivity to rate and fee changes:
- Whether the result is typical, median, maximum, or selected:
- Limitations:

## Approval gate

- Finance calculation reviewer:
- Business owner:
- Principal Broker:
- Legal reviewer:
- Marketing compliance reviewer:
- Approval date:
- Approved wording and usage scope:
- Claim record deliberately changed to supported and approved-public-use: yes/no

No public page, metadata, CTA, advertisement, comparison table, or AI answer may use the claim while any field above is missing or unapproved.
`,
);

await writeText(
  join(outputDirectory, "methodology-and-limitations.md"),
  `# Methodology and limitations

## Method

1. Preserved the 2026-07-14 supplied audit and a 2026-07-16 live sitemap/robots snapshot as separate point-in-time evidence.
2. Verified OpenSEO v0.0.28, the FairLend project, and DataForSEO account balance and account-specific prices before paid calls.
3. Applied a fail-closed USD 0.90 governor with isolated workstream envelopes, serial calls, pre-call checks, pending ledger writes, and before/after provider-balance reconciliation.
4. Ran one exact tracer, one evidence-producing retry, seven research seeds across four workstreams, one four-query Toronto SERP batch, one serial retry, and one seven-keyword competitor request.
5. Normalized only a relevance-filtered sample; retained high-volume noise and null metrics to prove exclusions and avoid inflated demand.
6. Added current official sources for program, planning, tax, rental, draw, and referral facts; used community sources only for qualitative language and questions.
7. Used a public-search-observed query-target fallback for page-type and intent boundaries after all four queries in the paid OpenSEO SERP batch failed; preserved the batch failure and its single charge without inventing per-query costs.
8. Scored Lead Capture and Authority Build separately with the null-aware evidence model recorded in score-rationale.csv. Missing metrics contribute zero demand points, failed provider SERPs cap evidence-dependent components, excluded traffic receives no opportunity value, and each page score is the rounded average of its three strongest included keyword records.
9. Produced a complete disposition for all ${existingUrlDispositions.length} discovered URLs, a proposal-only greenfield hierarchy, scenario bands that refuse unsupported lead forecasts, AI-discovery surface coverage, and requirements-only briefs. No finished headings, prose, CMS payload, or implementation diff was created.

## Material limitations

- Keyword metrics are Canada-level (location 2124), not Toronto-only. Local fit is inferred only from exact local query wording, official local sources, and public-search composition.
- Every research seed fell back to DataForSEO Labs keyword ideas. Contamination was severe: automotive financing under MLI, botanical/entertainment terms under garden suites, equipment/consumer renovation under builder finance, and calculators under referrals.
- Exact long-tail terms often returned no metric row. Missing is unavailable, never zero.
- Headline volumes for close variants are not additive. Hyphenated and plural construction variants may share demand.
- Provider difficulty values include measured zeros and many nulls; neither is treated as proof of easy ranking.
- OpenSEO's four Toronto SERP tasks failed after a USD 0.014 batch charge. The serial retry timed out without an explicit cost receipt; its USD 0.02 estimate remains committed because an unchanged immediate balance does not prove zero cost. Public-search fallback results do not expose stable rank or device and therefore validate only broad intent/page boundaries.
- The competitor endpoint returned domains only for MLI Select. Six requested keywords disappeared, so there is no cross-query domain-overlap calculation.
- B2B referral demand is supported by exact-audience public-search composition, regulator sources, competitor patterns, and qualitative workflow evidence—not by exact keyword volume.
- No Search Console, Bing Webmaster Tools, GA4, CRM, GBP, rank history, backlink graph, or field Core Web Vitals data was available.
- No installed skill or workflow artifact identifies itself as NotFair. The actual method source is AgriciDaniel's Codex SEO Universal SEO Analysis Skill v1.9.6; the required NotFair-specific workflow remains unproven and must not be inferred from similar capabilities.
- No DrawFlow case files were supplied. The on-demand mechanism and up-to-50% savings claims remain evidence-locked.
- Official financial, incentive, tax, and planning facts are time-sensitive and not project approvals. Refresh active programs within 30 days and planning rules within 90 days, then obtain appropriate professional review.
- This sampled USD 0.43244 trial prioritizes directional decisions. It is not an exhaustive keyword census, traffic forecast, ranking forecast, lead forecast, or revenue forecast.
`,
);

await writeText(
  join(outputDirectory, "executive-strategy.md"),
  `# Executive strategy

## Outcome

The trial validates a four-path organic architecture for FairLend while keeping the website and Payload CMS untouched:

1. **Five-plus-unit multiplex / MLI Select** is the first strategic priority because FairLend explicitly prefers five-plus projects. MLI Select has Canada volume 1,600; financing variants return 20, 20, and 10. Official evidence establishes the five-unit boundary and the public search surface supports a dedicated construction-to-takeout page plus an MLI planning resource.
2. **Builder construction financing / DrawFlow** has the strongest measured Lead Capture score. Canada demand includes construction financing (880), construction mortgage (590), Ontario construction mortgage (170), and Toronto construction loan (90). The money page should qualify builders and projects; a separate evidence-led guide should answer draw, inspection, holdback, deposit, reimbursement-gap, and cash-flow questions.
3. **Garden and laneway suites** combine into one commercial path. Garden suite has Canada volume 1,900 and Toronto variants 590 and 210; financing-specific volume is unavailable, but dedicated finance and lender results validate commercial intent. One feasibility resource should contain the rental-strategy and HELOC/second-mortgage comparison modules unless later SERP evidence proves a separate URL.
4. **Professional referrals** remain a distinct authority-led path. Exact referral volume is unmeasured, but the exact-audience public result, FSRA/RECO requirements, and market workflow evidence justify a partner-page replacement with its readiness material consolidated into the same URL. Builder borrowers stay in path two; builders referring or delivering another party's project use this path.

Strategic order is not a disguised traffic forecast. The null-aware score remains evidence-led; FairLend's five-plus preference is an explicit business-priority override and tie-breaker.

## Lead Capture frontier

| Priority | Opportunity | Score | Confidence | Decision |
|---:|---|---:|---|---|
| 1 | Five-plus-unit multiplex construction and MLI Select financing | ${pageOpportunities.find((page) => page.id === "opportunity-five-plus-mli-financing").leadCaptureScore} | medium | Strategic priority override: replace the current multiplex page and hard-separate two-to-four-unit intent. |
| 2 | Builder construction financing and DrawFlow qualification | ${pageOpportunities.find((page) => page.id === "opportunity-drawflow-builder-financing").leadCaptureScore} | high | Replace the current construction-draw page; lock unverified product/outcome claims. |
| 3 | Garden and laneway-suite financing | ${pageOpportunities.find((page) => page.id === "opportunity-garden-laneway-financing").leadCaptureScore} | medium | Replace the current garden financing page with one combined money page. |
| 4 | Mortgage-broker, realtor, and professional referrals | ${pageOpportunities.find((page) => page.id === "opportunity-partner-referrals").leadCaptureScore} | medium | Replace the generic partner page as an authority-led role and intake path. |
| 5 | Stalled-project rescue | ${pageOpportunities.find((page) => page.id === "opportunity-stalled-project-rescue").leadCaptureScore} | low | Defer despite urgency until direct demand, policy, and qualifying cases exist. |

## Authority Build frontier

| Priority | Opportunity | Score | Confidence | Evidence asset |
|---:|---|---:|---|---|
| 1 | MLI Select planning guide | ${pageOpportunities.find((page) => page.id === "opportunity-mli-select-planning-guide").authorityBuildScore} | high | Current program matrix, score pathways, five-plus boundary, takeout dependencies. |
| 2 | Garden-suite feasibility guide | ${pageOpportunities.find((page) => page.id === "opportunity-garden-suite-feasibility").authorityBuildScore} | high | Address-readiness checklist, municipality evidence, permit/incentive freshness, and financing comparison. |
| 3 | Suite rental comparison module | ${pageOpportunities.find((page) => page.id === "opportunity-suite-rental-comparison").authorityBuildScore} | high | Toronto, CRA, lender, insurer, and tax decision matrix consolidated into the feasibility URL. |
| 4 | Ontario construction draw guide | ${pageOpportunities.find((page) => page.id === "opportunity-construction-draw-guide").authorityBuildScore} | medium | Draw workflow, holdback worksheet, eligible-cost/deposit matrix, verification model. |
| 5 | Partner referral page | ${pageOpportunities.find((page) => page.id === "opportunity-partner-referrals").authorityBuildScore} | medium | Referral/co-brokering/consent decision tree and role routing. |

## Scenario discipline

| Frontier | Conservative demand interpretation | Ranking horizon | Lead/conversion boundary | Confidence |
|---|---|---|---|---|
${opportunityScenarios
  .map(
    (scenario) =>
      `| ${scenario.frontier} | ${scenario.conservativeDemandScenario} | ${scenario.rankingHorizonBand} | ${scenario.conversionAssumptions} | ${scenario.confidence} |`,
  )
  .join("\n")}

No scenario supplies a numerical click, lead, conversion, or revenue forecast. Successful mobile SERPs plus GSC, GA4, CRM, backlink, and indexation baselines are prerequisites for that model.

## Non-negotiable gates

- Treat five-plus/MLI and two-to-four-unit residential financing as separate product and intent systems.
- Do not create separate garden and laneway money pages from lexical variation.
- Keep the suite rental and HELOC/second-mortgage comparisons inside the feasibility resource unless a successful SERP sample validates distinct URLs.
- Do not treat broad mortgage-broker volume as B2B referral demand.
- Do not publish the DrawFlow on-demand mechanism until product documents and operations approve it.
- Do not publish the up-to-50% savings claim until the case template is complete and deliberately approved.
- Do not advertise the cancelled federal secondary-suite loan or discontinued Toronto forgivable-loan program.
- Do not state a rate, payment, fee, savings, approval, incentive, or project outcome without the linked claim gate and required disclosure/review.
- Use proposal documents for all future page/CMS changes; this run creates no direct update.
`,
);

await writeText(
  join(outputDirectory, "full-scale-research-estimate.md"),
  `# Full-scale production research estimate

## Recommended scope

- 20–30 validated seeds spanning five-plus/MLI, acquisition, construction, draw mechanics, stabilization/takeout, ancillary suites, bank-declined/rescue, and partner roles.
- 800–1,500 normalized Canadian keywords with exact-match metrics, 24-month trends where economical, intent, CPC, competition, difficulty, exclusion, persona, trigger, lifecycle, geography, and dual scores.
- 60–100 serial Toronto/GTA mobile-first SERPs with explicit retry limits, task receipts, result types, and cross-query domain/URL overlap.
- 8–12 competitor cohorts covering commercial, search, authority, Reddit/forum, video, and AI answer sources.
- Toronto plus priority GTA municipality source packs for zoning, permits, incentives, and ancillary-suite terminology.
- Google Search Console, Bing Webmaster Tools, GA4, GBP, backlink, rank, CRM, and field-CWV baselines when access exists.
- Original evidence acquisition: underwriting matrices, product terms, process diagrams, cost/draw tools, partner roles, case dossiers, authors/reviewers, and claim approvals.

## Paid-data budget

The current account price table charges Labs requests at USD 0.012 plus USD 0.00012 per returned row and organic live advanced SERPs at USD 0.002 per request before task-specific behavior. Trial evidence showed fallback expansion may invoke multiple Labs sources.

| Work | Scenario | Estimated provider cost |
|---|---|---:|
| 24 seeds × 150 rows | one Labs source per seed | USD 0.72 |
| 24 seeds × 150 rows | three-source worst case | USD 2.16 |
| 500 curated exact metrics | one overview request | about USD 0.072 |
| 80 serial SERPs | observed/account-price range with retry reserve | USD 0.16–0.40 |
| 8 competitor cohorts × 100 rows | Labs base plus rows | about USD 0.192 |
| Domain/backlink/local/AI verification | endpoint-dependent reserve | USD 1.00–4.00 |
| **Recommended hard cap** | complete production pass | **USD 8.00** |

The remaining trial account balance is USD ${balanceAfter.balance.toFixed(5)}. A production run should use a separate hard cap and may require an account top-up even when estimated consumption is below the provider's funding minimum; unused account balance is not research spend.

## Sequence

1. Supply product, underwriting, partner, case, compliance, and service-area evidence before expanding claims.
2. Connect GSC, Bing, GA4, GBP, and CRM read-only exports; capture zero-data states explicitly.
3. Run serial live keyword expansion and exact metrics with account-price and balance checks around every operation.
4. Run mobile Toronto and selected GTA municipality SERPs; require task receipts and stop on repeated provider failure.
5. Cluster by intent and SERP overlap, then score Lead Capture and Authority independently with lead-quality feedback.
6. Produce proposal-only IA, briefs, evidence registers, internal-link graph, editorial calendar, and implementation tickets for separate approval.

## Additional evidence that most improves confidence

- Current FairLend licence identity, service area, lender/product boundaries, and approved qualification rules.
- DrawFlow term sheet, eligible-cost rules, draw operations, timing evidence, and case files.
- Named professional network, role boundaries, agreements, insurance/licensing, referral compensation, consent, and handoff standards.
- Approved-lender MLI Select workflow, recent anonymized files, and project-level rejection/approval reasons.
- Garden/laneway funded cases, permit and appraisal evidence, rent treatment, budget, and takeout outcomes.
- CRM definitions for qualified lead, project size, unit count, equity, timeline, source, disposition, and funded outcome.

No cost or outcome above is a ranking, traffic, lead, approval, or revenue promise.
`,
);

await writeText(
  join(outputDirectory, "mutation-audit.md"),
  `# Mutation audit

## Authorized writes

- Research scaffolding and execution records under ${workspace}
- Dated research package under ${outputDirectory}
- DataForSEO billing consumption explicitly authorized by the USD 1 trial instruction and limited by the USD 0.90 hard ceiling

## Confirmed non-mutations

- Live FairLend website: no publish, form submission, configuration change, or authenticated action.
- Payload CMS: no document, collection, media, draft, workflow, user, or schema change.
- FairLend repository source: no application/source/configuration edit; only the dated output research directory was added.
- Vercel/platform: no deployment, domain, environment, analytics, firewall, or project-setting change.
- Search platforms: no Search Console, Bing, GBP, analytics, rank tracker, or index-submission change.
- OpenSEO project state: no saved-keyword operation; research requests used the approved project and provider cache behavior only.
- External provider account: no credential, plan, threshold, or settings change; USD ${spent.toFixed(5)} disclosed consumption was observed, and the cost-undisclosed retry's USD ${costUndisclosedEstimate.toFixed(5)} estimate remains committed pending reconciliation.
- Final content: no marketing copy, CMS-ready content, implementation diff, or direct page update.

## Baselines

- LLM Wiki fixed-point commit before implementation: b9733bce4b74909a2b3285a13829c8ef0e96d403
- FairLend CMS source baseline: e8e08964234109c54eaa8d56ea7c2a55b1d6e98f
- OpenSEO runtime commit: 8460df1f2947661f07c0d751e855703dd268023f
- Provider balance: USD ${balanceBefore.balance.toFixed(5)} before; USD ${balanceAfter.balance.toFixed(5)} after; delta USD ${spent.toFixed(5)}

The machine manifest records an empty prohibited-mutation list. Artifact creation and authorized provider consumption are not represented as live-site/CMS/platform mutations.
`,
);

await writeText(
  join(outputDirectory, "README.md"),
  `# FairLend OpenSEO trial research package — 2026-07-16

This is the completed requirements-only handoff for Tickets 02–09. It converts a USD 1 included-budget trial into an auditable keyword portfolio, four research slices, dual-score frontier, greenfield URL proposal, evidence/claim registers, no-copy briefs, and production-run estimate. research-package.json is the contract-valid canonical core; run-manifest.json provides the machine-readable index for the complete handoff, including every sidecar. The package does **not** contain final marketing copy or authorize any site, Payload CMS, repository-source, or platform update.

## Trial result

- OpenSEO v0.0.28 + DataForSEO v3 live provider used: yes.
- Methodology actually used: AgriciDaniel's Codex SEO Universal SEO Analysis Skill v1.9.6; NotFair-specific provenance is unproven because no installed artifact carries that identity.
- Disclosed paid spend: USD ${spent.toFixed(5)} of USD 0.90 hard ceiling.
- Safely committed spend, including the cost-undisclosed retry estimate: USD ${committed.toFixed(5)}.
- Uncommitted hard-ceiling headroom: USD ${researchPackage.manifest.budget.remaining.toFixed(5)}.
- External USD 0.10 reserve preserved: yes; provider account still holds USD ${balanceAfter.balance.toFixed(5)}.
- Research seeds: 7 across 4 workstreams; up to 1,050 returned expansion rows plus exact metrics.
- Normalized keyword sample: ${keywords.length} records, including exclusions and unavailable long tails.
- Clusters: ${clusters.length}; page opportunities: ${pageOpportunities.length}; existing URL dispositions: ${existingUrlDispositions.length}; questions: ${aiQuestions.length}; claims: ${claims.length}; briefs: ${briefs.length}.
- Opportunity scores: null-aware and evidence-capped; every component and page roll-up is recorded in score-rationale.csv.
- Paid OpenSEO SERPs: one charged four-query failed batch plus one timed-out retry whose USD 0.02 cost remains undisclosed and committed; preserved one-to-one in the ledger.
- Page-boundary fallback: public-search-observed query-target sample, clearly labelled and non-rank-bearing; searcher location and device were not exposed.
- DrawFlow up-to-50% claim: provisional-unverified and research-only.

## Start here

1. [Executive strategy](./executive-strategy.md)
2. [Methodology and limitations](./methodology-and-limitations.md)
3. [Greenfield page map and complete existing-URL matrix](./greenfield-page-map.md)
4. [Page opportunity portfolio](./page-opportunities.csv)
5. [Opportunity scenarios](./opportunity-scenarios.csv)
6. [Score rationale](./score-rationale.csv)
7. [AI-discovery coverage](./ai-discovery-coverage.csv)
8. [Evidence acquisition register](./evidence-acquisition-register.csv)
9. [Claims and compliance register](./claims-and-compliance-register.csv)
10. [Content briefs](./content-briefs/)
11. [Full-scale estimate](./full-scale-research-estimate.md)
12. [Mutation audit](./mutation-audit.md)
13. [Blank DrawFlow case-evidence template](./case-study-evidence-template.md)

## Machine-readable and tabular artifacts

- [research-package.json](./research-package.json) — contract-valid canonical core datasets.
- [run-manifest.json](./run-manifest.json) — tools, commits, settings, paid calls, balance, failures, authorization, and the complete machine-readable artifact index.
- [keyword-universe.csv](./keyword-universe.csv) — curated, normalized, classified, scored queries with null-safe metrics.
- [keyword-clusters.csv](./keyword-clusters.csv) — intent/workstream clusters and boundary decisions.
- [score-rationale.csv](./score-rationale.csv) — evidence inputs, caps, and score roll-ups for every keyword and opportunity.
- [serp-evidence.csv](./serp-evidence.csv) — failed OpenSEO records and public-search-observed query-target fallback records.
- [competitor-landscape.csv](./competitor-landscape.csv) — commercial, search, and authority competitors.
- [page-opportunities.csv](./page-opportunities.csv) — greenfield URL and disposition portfolio.
- [existing-url-dispositions.csv](./existing-url-dispositions.csv) — complete decision matrix for all ${existingUrlDispositions.length} URLs found in the live sitemap.
- [greenfield-page-map.md](./greenfield-page-map.md) — proposal-only hierarchy, consolidation boundaries, and deferred URLs.
- [ai-question-opportunities.csv](./ai-question-opportunities.csv) — questions separated from volume claims.
- [ai-discovery-coverage.csv](./ai-discovery-coverage.csv) — observed and unavailable AI/question surfaces without invented evidence.
- [opportunity-scenarios.csv](./opportunity-scenarios.csv) — conservative/base/upside demand interpretations with ranking and conversion prerequisites.
- [evidence-acquisition-register.csv](./evidence-acquisition-register.csv) — page-by-page missing evidence and approval gates.
- [claims-and-compliance-register.csv](./claims-and-compliance-register.csv) — supported, provisional, review-required, and prohibited claims.
- [success-gates.csv](./success-gates.csv) — all twelve contract gates with evidence.

## Research slices

- [Five-plus/MLI Select](./research-slices/five-plus-multiplex-mli-select.md)
- [Garden and laneway suites](./research-slices/garden-laneway-suite-financing.md)
- [DrawFlow and builder financing](./research-slices/drawflow-builder-financing.md)
- [B2B referrals](./research-slices/b2b-partner-referral.md)

## Content boundary

Every brief uses explicit REQUIREMENT:, QUESTION:, and EVIDENCE: markers. Topics, URLs, headings-as-requirements, CTA specifications, schemas, and KPIs are proposals for a later content-production stage. They are not finished copy, implementation instructions, or CMS payloads.
`,
);

console.log(
  JSON.stringify({
    outputDirectory,
    spent,
    remaining: researchPackage.manifest.budget.remaining,
    counts: {
      sources: sourceObservations.length,
      keywords: keywords.length,
      clusters: clusters.length,
      serpEvidence: serpEvidence.length,
      competitors: competitors.length,
      pages: pageOpportunities.length,
      questions: aiQuestions.length,
      claims: claims.length,
      briefs: briefs.length,
      spendEvents: spendEvents.length,
    },
  }),
);
