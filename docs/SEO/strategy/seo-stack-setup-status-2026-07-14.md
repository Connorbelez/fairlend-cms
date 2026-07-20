# SEO stack setup status

**Assessment date:** 2026-07-14  
**Repositories inspected:** `/Users/connor/Dev/llm_wiki`, `/Users/connor/Dev/fairlend-cms`  
**Production target:** `https://www.fairlend.ca`

## Verdict

**No—the complete agentic SEO stack is not set up.**

The research, architecture, operating playbook, and much of FairLend's website-level technical SEO foundation exist. The live-data/agent workflow—NotFair + OpenSEO + DataForSEO + Google Search Console + GA4 + a controlled Payload draft pipeline—is not installed, configured, connected, or running.

The honest state is:

- **Research and operating design:** complete.
- **FairLend on-site SEO foundation:** substantially implemented, but production readiness currently fails.
- **IndexNow:** implemented and tested locally, but not deployed/configured successfully in production.
- **Agentic research/content/measurement stack:** not set up.

## Component status

| Component | Status | Evidence |
|---|---|---|
| SEO research and stack selection | READY | Research recommends NotFair + OpenSEO + DataForSEO + Codex/Payload and documents the operating model. |
| Operator playbook | READY | Full zero-to-growth playbook, decision trees, compliance constraints, and launch runbook exist under `.scratch/`. |
| Payload SEO fields | READY | `@payloadcms/plugin-seo` 3.82.1 is installed for website content. |
| Metadata/canonical/schema layer | IMPLEMENTED | FairLend contains SEO utilities, route SEO components, structured data, canonical handling, and related tests/docs. |
| XML sitemaps | IMPLEMENTED, DIRTY CORPUS | Sitemap generation exists, but production still advertises QA/demo URLs. |
| Search readiness audit | READY | `pnpm audit:seo` exists and inspects production. Its current result is **FAIL**. |
| IndexNow library/hooks | IMPLEMENTED LOCALLY | Publication notification code, key route, retries, logging, environment contract, and integration tests exist. |
| IndexNow tests | PASS | `tests/int/indexnow.int.spec.ts` and `seo-readiness.int.spec.ts`: 2 files, 6 tests passed. |
| IndexNow production configuration | NOT READY | `https://www.fairlend.ca/indexnow-key.txt` returned HTTP `404` on 2026-07-14. |
| NotFair skill layer | NOT INSTALLED | No executable dependency, plugin configuration, or repository integration found. |
| OpenSEO data/MCP service | NOT INSTALLED | No dependency, checkout, service configuration, MCP registration, container, or running process found. |
| DataForSEO provider | NOT CONFIGURED | No DataForSEO environment declaration or connector found in the inspected repositories. |
| Google Search Console connector | NOT CONFIGURED | No GSC OAuth/service-account environment contract or OpenSEO/mcp-gsc integration found. Property verification outside the repositories remains unknown. |
| GA4 Data API measurement connector | NOT CONFIGURED | Website analytics instrumentation exists, but no agent-facing GA4 reporting connector was found. |
| Codex ↔ OpenSEO MCP connection | NOT CONFIGURED | No OpenSEO MCP server configuration was found. |
| Agent ↔ Payload controlled draft API | NOT IMPLEMENTED | No narrow `createSeoDraft`/`updateSeoDraft`/review-state service was found. |
| SEO evidence store | NOT CREATED | The proposed `seo/strategy.md`, keyword/page maps, briefs, experiments, and snapshots tree is absent from `fairlend-cms`. |
| Scheduled closed-loop SEO jobs | NOT IMPLEMENTED | No operational research → draft → QA → publish → measure loop is running. |
| SEO-related local service/container | NOT RUNNING | No OpenSEO, NotFair, DataForSEO, or IndexNow process/container was detected. |

## What is genuinely working

FairLend is not starting from zero. The website already has a credible technical base:

- Payload SEO fields for pages/posts;
- draft/version/scheduled-publishing capabilities;
- canonical URL helpers;
- Open Graph and search metadata infrastructure;
- schema/structured-data components;
- dynamic sitemap generation;
- redirects and cache invalidation infrastructure;
- Playwright/Vitest testing infrastructure;
- a production search-readiness audit command;
- new IndexNow publication notification code with validation, bounded retries, canonical URL submission, logging, and tests.

Focused verification completed successfully:

```text
tests/int/indexnow.int.spec.ts       3 passed
tests/int/seo-readiness.int.spec.ts  3 passed
Total                               6 passed
```

That validates local code behaviour. It does not prove production deployment, provider credentials, or search-engine receipt.

## What production currently fails

`pnpm audit:seo` inspected 16 production sitemap pages and returned **FAIL** with 12 errors:

1. QA page remains in the sitemap.
2. QA page has no rendered H1.
3. Contact page has no rendered H1.
4. Three generic demo posts remain in the sitemap.
5. The QA page and three demo posts still return `200` instead of `404`/`410`.
6. Retired `/fairlend-landing-hero` returns `307` instead of the audit's required removal status.
7. Unknown campaign URLs under `/r/*` redirect instead of returning `404`/`410`.

Separately, the production IndexNow key route returned:

```text
https://www.fairlend.ca/indexnow-key.txt → HTTP 404
```

Therefore IndexNow is **code-complete locally but not production-operational**.

## What remains before the stack can be called “set up”

### Gate 1 — Clean and deploy the website foundation

- Remove/unpublish the QA page and three Payload demo posts.
- Remove them from sitemaps and internal links.
- Make removed URLs return the intended `404`/`410` status.
- Add a real H1 and useful local/entity content to `/contact`.
- Fix retired and unknown campaign-route behaviour.
- Deploy the local IndexNow implementation.
- Configure a production `INDEXNOW_KEY`.
- Verify `/indexnow-key.txt` returns `200` and only the public key.
- Run `pnpm audit:seo` until it returns zero errors.

### Gate 2 — Establish first-party search and analytics evidence

- Verify the `fairlend.ca` Domain property in Google Search Console.
- Submit the clean root sitemap.
- Configure GSC OAuth/service credentials for read-only query/page/index inspection.
- Confirm GA4 key events and qualified-lead definitions.
- Configure a read-only GA4 Data API connector.
- Record the zero-state baseline.

### Gate 3 — Install the live SEO data plane

- Create and fund a budget-capped DataForSEO account.
- Store credentials outside Git.
- Pin a reviewed OpenSEO commit.
- Install and configure its database/runtime.
- Create the FairLend project with canonical market, language, device, and GTA coordinate rules.
- Connect DataForSEO and GSC.
- Register the OpenSEO MCP server with Codex.
- Smoke-test keyword metrics, SERPs, local results, backlinks, GSC performance, URL inspection, and site audit tools.
- Add cost limits, caching, rate controls, and request logging.

### Gate 4 — Install the workflow and writing layer

- Port/install the selected NotFair SEO skills for Codex.
- Configure NotFair's live-data calls to use OpenSEO rather than invented metrics.
- Configure FairLend business truth, prohibited claims, geography, audiences, voice, reviewers, and compliance gates.
- Verify keyword discovery → intent clustering → page mapping → brief → copy → audit as one repeatable read-only workflow.

### Gate 5 — Add a safe Payload control plane

- Implement narrow typed operations such as `createSeoDraft`, `updateSeoDraft`, `queueSeoAudit`, and `requestReview`.
- Enforce least-privilege Payload access and lock handling.
- Force agent-created content to remain draft-only.
- Add idempotency keys, audit logs, run IDs, budget metadata, and validation.
- Require human approval for publication and external-platform mutations.
- Add preview/render/schema/link/compliance verification before approval.

### Gate 6 — Close the measurement loop

- Create the website-repository evidence store:

```text
seo/
  strategy.md
  keywords.csv
  page-map.csv
  briefs/
  experiments/
  snapshots/
```

- Schedule crawl, ranking, GSC, GA4, and AI-answer observation jobs.
- Join page opportunities to publication dates, impressions, clicks, qualified leads, and funded/won outcomes.
- Produce a weekly operator queue with evidence, recommended action, risk, cost, owner, and approval state.

## Definition of done

The SEO stack is set up only when this end-to-end acceptance test passes:

1. OpenSEO is healthy and reachable through MCP.
2. A live DataForSEO request returns real Toronto/GTA keyword and SERP data within budget.
3. GSC returns FairLend query/page data and URL inspection results.
4. GA4 returns verified organic landing-page and lead-event data.
5. A NotFair workflow consumes that live evidence and produces an intent cluster/page opportunity without fabricating metrics.
6. The agent creates or updates a validated Payload **draft**, never a published page.
7. Preview QA validates rendering, canonical, metadata, schema, links, claims, and conversion tracking.
8. A human approves publication.
9. Publication invalidates the correct caches/sitemaps and sends one logged IndexNow event.
10. The production readiness audit passes with zero errors.
11. The next measurement cycle records the page's GSC/GA4/CRM outcome.

Until all eleven checks pass, the system is a combination of good website SEO infrastructure and excellent documentation—not an operational agentic SEO stack.

## Current readiness summary

```text
Research / architecture       ██████████  complete
Operator documentation        ██████████  complete
Website SEO foundation        ███████░░░  implemented, production defects remain
IndexNow local implementation █████████░  tested locally
IndexNow production           ░░░░░░░░░░  endpoint returns 404
Live SEO data plane           ░░░░░░░░░░  not installed
Workflow / skill layer        ░░░░░░░░░░  not installed
GSC + GA4 measurement         ░░░░░░░░░░  not connected to agent
Safe Payload draft pipeline   ░░░░░░░░░░  not implemented
Closed-loop automation        ░░░░░░░░░░  not running
```

**Overall status: PARTIAL FOUNDATION, NOT SET UP.**
