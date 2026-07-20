# FairLend research dataset contracts

**Contract version:** `1.0.0`

The executable validator is authoritative for package acceptance. This document defines the semantic meaning of each record so later agents do not satisfy syntax while changing the research model.

## Common conventions

| Convention | Contract |
|---|---|
| Stable ID | Lowercase kebab case matching `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`. IDs never encode rank or mutable ordering. |
| Timestamp | ISO 8601 with timezone. Point-in-time observations retain the observed timezone. |
| Confidence | `low`, `medium`, or `high`; confidence describes evidence quality, not optimism. |
| Research source observation reference | Array of IDs declared in the package's `sourceObservations` collection. Decision-bearing records require at least one. This lightweight research record is deliberately distinct from LLM Wiki's canonical `EvidenceReference` domain object. |
| Unknown metric | JSON `null`, never zero. Zero means the provider measured zero. |
| Fixture | `dataStatus: fixture-only` plus fixture evidence. Fixtures cannot justify recommendations. |
| Text | Factual observations or requirements only. Finished marketing prose is prohibited. |
| Primitive types | Values are never coerced. Numeric strings, `null` in required strings, non-boolean flags, and malformed nested array members fail validation. |
| Arrays | Decision-bearing arrays are non-empty where the model requires evidence or classification; every array member is type checked and identifier/URL lists are unique. Deliberately empty observations (for example, unavailable SERP results) remain empty arrays. |
| URL and locator formats | Public URLs use absolute HTTP(S) URLs, proposed routes use root-relative paths, competitor domains omit schemes and paths, and source locators use absolute paths or resolvable URI syntax. |

## Canonical core package

`research-package.json` is the contract-valid canonical core described below. The complete dated handoff also contains decision-support CSV/Markdown sidecars; `run-manifest.json.artifactIndex` is the machine-readable inventory for that complete package.

Required top-level fields:

| Field | Type | Meaning |
|---|---|---|
| `contractVersion` | string | Must equal `1.0.0`. |
| `packageId` | stable ID | Unique identity for the assembled research package. |
| `generatedAt` | timestamp | Package assembly time. |
| `manifest` | object | Run identity, market, budget, authorization, tools, and source observations. |
| `sourceObservations` | array | Lightweight, point-in-time research provenance records. |
| `siteInventory` | array | Canonical production URL observations. |
| `auditFindings` | array | Dated findings from supplied or live audits. |
| `keywords` | array | Normalized query observations and classifications. |
| `clusters` | array | Intent/SERP-based keyword groups. |
| `serpEvidence` | array | Localized search-result observations. |
| `competitors` | array | Commercial, search, or authority competitors. |
| `pageOpportunities` | array | Keyword-to-page-to-conversion decisions. |
| `aiQuestions` | array | Question/answer opportunities kept separate from volume claims. |
| `claims` | array | Claim status, usage boundary, evidence, owner, and review. |
| `briefs` | array | Requirements-only content briefs. |
| `spendEvents` | array | Paid provider task and cost ledger. |

## Manifest

Required fields:

- `runId`: stable ID.
- `status`: controlled run status.
- `market`: country, language, primary location, and secondary location.
- `budget`: currency, hard ceiling, disclosed spend, committed cost, and remaining headroom.
- `authorization`: the five read-only modes and `allowedWrites: ["research-artifacts"]`.
- `mutations`: must be an empty array in this trial.
- `contentBoundary`: must be `requirements-only`.
- `tools`: tool/version/commit records when available.
- `sourceObservationRefs`: source observations supporting run configuration.

The manifest is closed to undeclared fields. The trial market is fixed to English-language Toronto/GTA research, currency is `USD`, and the hard ceiling is `0.90`. `spent` reconciles to disclosed actual costs. `committed` reconciles to actual cost when exposed and otherwise the safely predicted estimate; `committed + remaining` must equal the ceiling. This preserves budget headroom without inventing a provider charge. Tool records require non-empty name, version, and commit identifiers.

## Research source observation

This is a trial-specific research transport record, not the repository's canonical `EvidenceReference`. It does not claim Source Revision, Source Block, Section Locator, resolution-state, or citation-reanchoring semantics.

| Field | Type | Meaning |
|---|---|---|
| `id` | stable ID | Source-observation identity. |
| `sourceType` | controlled string | Distinguishes live site, supplied audit, official source, provider, SERP, community, user assertion, required methodology skill, or fixture. |
| `sourceTitle` | string | Human-verifiable source name. |
| `sourceLocator` | string | URL or absolute local source locator. |
| `capturedAt` | timestamp | When the source was observed. |
| `observationAnchor` | string | Human-verifiable page number, heading slug, result position, or endpoint-local record hint; it is not a canonical Section Locator or Citation Anchor. |
| `excerpt` | string | Bounded evidence statement; not a whole source dump. |
| `confidence` | controlled string | Observation reliability. |

## Site inventory

Required fields: `id`, `url`, `sitemap`, `lastmod` (nullable), `expectedCanonical`, `httpStatus`, `indexability`, and `sourceObservationRefs`.

The live sitemap proves advertised membership, not indexation. HTTP/canonical/indexability values require their own crawl/audit evidence when asserted.

## Audit finding

Required fields: `id`, `category`, `severity`, `status`, `finding`, `observedAt`, and `sourceObservationRefs`.

Findings from the supplied PDF use `point-in-time`. A later live check may add a new record or mark the old one `superseded`; it must not silently rewrite history.

## Keyword

Required fields:

- identity: `id`, `query`, `normalizedQuery`, `seedConcept`, `clusterId`;
- audience: `persona`, `personaDetail`, `personaTier`, `financingTrigger`;
- classification: `lifecycleStages`, `funnelHeadline`, `funnelStage`, `geography`, `intent`, `relevanceDisposition`, `exclusionReason`;
- observation: `observedAt`, `metrics`, `serpFeatures`, `confidence`, `sourceObservationRefs`;
- priority: component-bearing `leadCaptureScore` and `authorityBuildScore`.

`metrics.dataStatus` distinguishes live, estimated, unavailable, and fixture-only evidence. `query` and `normalizedQuery` are non-empty strings, and the normalized value must equal the NFKC-normalized, trimmed, lowercased, whitespace-collapsed query. Monthly searches are nullable non-negative integers; CPC is a nullable non-negative finite number; paid competition is nullable from 0 through 1; difficulty is nullable from 0 through 100. Each trend item is a closed `{year, month, monthlySearches}` record with a unique year/month period. Live metrics require measured monthly-search volume and search-provider provenance. Unavailable and fixture-only metrics use `null` rather than invented zeroes and carry no trend values. SERP-feature values are unique non-empty strings. Synthetic AI prompts never receive fabricated volume metrics.

The approved Tier 1 and Tier 2 persona seeds are controlled values and each seed is coupled to its approved tier. A genuinely new persona uses `persona: adjacent-discovered-other`, `personaTier: adjacent-discovered`, and a non-empty `personaDetail`; this preserves the contract's open discovery boundary without accepting arbitrary persona values. Every keyword also records `relevanceDisposition` and an approved `exclusionReason`, so broad traffic cannot bypass the project-financing relevance filter.

## Cluster

Required fields: `id`, `name`, `workstream`, `primaryKeywordId`, `keywordIds`, `pageBoundaryStatus`, `confidence`, and `sourceObservationRefs`.

Clusters are defined by user intent and SERP overlap, not lexical similarity alone. Two-to-four-unit and five-plus-unit multiplex intent must remain explicitly separable.

## SERP evidence

Required fields: `id`, `queryId`, `location`, `device`, `observedAt`, `dataStatus`, `resultUrls`, `features`, `interpretation`, `confidence`, and `sourceObservationRefs`.

Provider queries in this trial target exactly `Toronto, Ontario, Canada`. Provider-observed live SERPs use the observed `mobile` or `desktop` device, require result URLs, and require search-provider provenance. Public search fallback evidence uses `dataStatus: public-search-observed`, `device: unknown`, and `location: not-exposed; query target Toronto, Ontario, Canada` because the surface exposed the query's geographic target but not a stable searcher location or device; it requires at least one valid HTTP(S) result URL and public-SERP provenance. Fixture-only or unavailable provider SERPs retain the explicit Toronto target, carry empty result and feature arrays, and may not validate a page boundary on their own. Result URLs and feature labels are unique and type checked.

## Competitor

Required fields: `id`, `name`, `competitorType`, `domain`, `relevantClusterIds`, `observation`, `confidence`, and `sourceObservationRefs`.

The three competitor types are commercial, search, and authority. A single organization may have multiple records when it plays multiple evidenced roles.

## Page opportunity

Required fields: `id`, `topic`, `persona`, `personaDetail`, `personaTier`, `financingTrigger`, `clusterIds`, `lifecycleStages`, `funnelHeadline`, `funnelStage`, `intent`, `urlDisposition`, `existingUrl`, `proposedUrl`, `pageType`, `primaryConversion`, `qualificationExpectations`, `localEvidence`, `competitorIds`, `aiQuestionIds`, `internalLinkRole`, `requiredOriginalEvidence`, `claimIds`, `cannibalizationDependencies`, `leadCaptureScore`, `authorityBuildScore`, `confidence`, `recommendedPriority`, `nextHumanDecision`, and `sourceObservationRefs`. `qualificationExpectations` is a non-empty array of non-empty statements.

Page scores are deterministic roll-ups of the three strongest included keyword records across the opportunity's assigned clusters, calculated independently for Lead Capture and Authority Build and rounded to the nearest integer. They do not introduce an untraceable third ranking model: `score-rationale.csv` records the contributing keyword IDs and evidence caps. A proposed URL is a research decision, not authorization to create a page.

## AI question

Required fields: `id`, `question`, `clusterId`, `sourceKind`, `volumeClaimed`, `requiredEvidence`, `confidence`, and `sourceObservationRefs`.

`question` is a trimmed interrogative string ending in `?`. `volumeClaimed` must be `false` throughout this requirements-only trial. The validator also checks the stronger future invariant: if that boundary is ever relaxed, a claim still requires a live, volume-bearing keyword in the same cluster whose normalized query exactly matches the normalized question text. Related or loosely similar queries never transfer volume.

## Claim

Required fields: `id`, `claim`, `status`, `allowedUsage`, `requiredEvidence`, `owner`, `reviewBy` (nullable), `confidence`, and `sourceObservationRefs`.

`provisional-unverified` claims are research inputs only. The DrawFlow up-to-50% savings statement starts in this state.

## Content brief

Required fields: `id`, `opportunityId`, `contentBoundary`, `pagePurpose`, `audience`, `problemTrigger`, `sectionRequirements`, `ctaSpecification`, `internalLinkRequirements`, `schemaOpportunities`, `approvalRequirements`, `successMeasures`, `confidence`, and `sourceObservationRefs`.

Each section requirement contains an ID, a decision-oriented heading requirement, questions, and evidence needed. Requirement text must carry the deterministic `REQUIREMENT:`, `QUESTION:`, or `EVIDENCE:` marker defined by its field. Requirement bodies must begin with an approved directive verb, questions must be interrogative, and promotional/final-copy patterns are rejected even when placed after a valid marker. Records are closed to undeclared fields, so `copy`, `heroText`, finished headings, paragraphs, CMS payloads, and implementation diffs fail validation rather than being silently accepted.

## Spend event

Required when a paid task occurs: `id`, `provider`, `operation`, `providerTaskIds`, `workstream`, `requestedRowCount`, `returnedRowCount`, `estimatedCost`, `actualCost`, `currency`, `occurredAt`, `status`, `retryCount`, and `sourceObservationRefs` when the provider exposes a receipt. `actualCost` is `null` when the provider does not expose it; it is never guessed or coerced to zero.

Spend events use the dedicated `spendWorkstream` vocabulary. It includes the four research workstreams plus operational `tracer` and `verification-reserve` events so the raw provider ledger can be preserved one-to-one. Research clusters continue to use the narrower `workstream` vocabulary and therefore cannot be classified as tracer or reserve activity. Counts are non-negative integers, costs are non-negative finite USD numbers, provider task IDs are unique non-empty strings when present, and timestamps include a timezone.

No spend event exists in Ticket 01 because no paid endpoint is called.

## Dual-score arithmetic

Every score object uses the exact component names below. Every component is non-negative and cannot exceed its assigned maximum. The component sum must equal `total`. Page-opportunity summary scores must be finite numbers from 0 through 100.

The trial uses `evidence-null-aware-v1`: unavailable metrics contribute zero recurring-demand points; missing provider SERPs cap commercial-evidence and attainability components; excluded or down-ranked traffic receives no opportunity value; and original-expertise credit stays capped until FairLend supplies the required first-party evidence. The generated score-rationale sidecar makes those inputs and caps auditable.

All record IDs are globally unique. Dataset references are validated against their target collection; dangling cluster, keyword, query, competitor, page-opportunity, AI-question, claim, inventory, and source-observation references fail the package.

Funnel classifications are coupled: awareness/education, feasibility, and planning/comparison use `research`; financing qualification and immediate transaction/problem use `buying-signal`.

Lead Capture components:

- intent and urgency: maximum 25;
- qualified-lead fit: maximum 20;
- strategic fit: maximum 15;
- Toronto/GTA fit: maximum 10;
- commercial evidence: maximum 10;
- attainability: maximum 10;
- conversion clarity: maximum 5;
- evidence confidence: maximum 5.

Authority Build components:

- recurring research demand: maximum 20;
- topical importance: maximum 15;
- AI citation opportunity: maximum 15;
- original expertise: maximum 15;
- internal-link value: maximum 10;
- linkworthiness: maximum 10;
- attainability: maximum 10;
- evidence confidence: maximum 5.
