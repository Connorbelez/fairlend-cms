# Payload CMS 3.x facts for the SEO operator playbook

Scope: official Payload documentation and Payload's official `v3.82.1` website-template/plugin source only. These are implementation facts and guardrails for an agent-assisted SEO workflow running on Vercel with Payload CMS.

## 1. Agent writes through Payload's Local API

- Payload positions the Local API for server-side usage such as React Server Components, custom Next.js route handlers, hooks, and seed scripts. It also automatically infers generated Payload types ([Local API](https://payloadcms.com/docs/local-api/overview)).
- **Security default:** every Local API operation has `overrideAccess: true` by default. `overrideLock` is also `true` by default, meaning document locks are ignored. An SEO agent must explicitly use `overrideAccess: false`, pass a least-privilege service `user`, and use `overrideLock: false` for writes ([Local API options](https://payloadcms.com/docs/local-api/overview#local-options-available)).
- Pass the existing `req` through nested Local API calls. Payload says this is required to share a transaction where the database supports transactions and is still recommended when transactions are not in use ([Local API transactions](https://payloadcms.com/docs/local-api/overview#transactions)).
- `context` is propagated to hooks. Use a namespaced context flag such as `context: { seoAgent: { runId, source } }` for auditability or to suppress only deliberately redundant downstream behavior; do not globally suppress publish/revalidation hooks ([Local API options](https://payloadcms.com/docs/local-api/overview#local-options-available)).

**Operator guardrail:** expose a narrow, typed SEO application service (`createDraft`, `updateDraft`, `queueAudit`) rather than handing the agent a raw `payload` object. Validate allowed collection, fields, locale, and block types at that boundary.

## 2. Drafts are not, by themselves, a publication safety boundary

- Enabling drafts injects `_status`, whose values are `draft` and `published` ([Drafts](https://payloadcms.com/docs/versions/drafts)).
- On writes, `draft: true` normally skips required-field enforcement and saves updates only to the versions table; omitted/false writes to both the main document and versions. Initial document creation is always written to the main collection because no main document exists yet, though it defaults to `_status: 'draft'` ([Draft API](https://payloadcms.com/docs/versions/drafts#draft-api)).
- **Critical footgun:** `data._status: 'published'` takes precedence over `draft: true` and publishes to the main collection. Therefore `draft: true` is not a publication guard. The SEO service must strip/reject incoming `_status`, set `_status: 'draft'` server-side, and deny service-user publish permission ([Draft parameter and status](https://payloadcms.com/docs/versions/drafts#understanding-draft-parameter-and-status-field)).
- `_status: 'draft'` alone does not relax required-field validation; `draft: true` controls that behavior. Payload also supports `versions.drafts.validate: true` if drafts should always validate ([Draft options and required fields](https://payloadcms.com/docs/versions/drafts#options)).
- For this workflow, prefer fully valid drafts even if Payload permits incomplete ones: content-schema validation is a separate quality gate from publication state.

**Required state machine:** `generated -> validated -> draft-saved -> preview-QA -> human-approved -> published`. The agent may perform every step through `preview-QA`, but only a human-owned identity or explicit approval workflow may transition to `published`.

## 3. Preview and Live Preview

- Payload's Preview feature generates a direct frontend link. Draft Preview is implemented by enabling Next.js Draft Mode and querying Payload with `draft: true` ([Preview](https://payloadcms.com/docs/admin/preview)).
- Payload's official website template protects its preview endpoint with both a `PREVIEW_SECRET` and an authenticated Payload user before enabling Next.js Draft Mode ([official preview route source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/app/%28frontend%29/next/preview/route.ts)). Preserve both checks; a secret-bearing URL alone is weaker than the template's design.
- Live Preview renders the frontend in an Admin iframe and streams unsaved document changes with `window.postMessage`. Dynamic or relative URLs are supported; relative URLs are specifically useful for unknown Vercel preview deployment hosts. Live Preview can also be role-gated by returning `null` from the URL function ([Live Preview](https://payloadcms.com/docs/live-preview/overview)).
- The official page route queries published content with access control enabled and uses draft mode for preview content; it renders a Live Preview listener only in draft mode ([official page route source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/app/%28frontend%29/%5Bslug%5D/page.tsx)).

**Operator QA:** automated browser checks should open the authenticated draft-preview URL, never publish a document just to inspect it. Test desktop and mobile breakpoints, rendered headings/copy/links, metadata, structured data, canonical, `noindex` in preview, and no public discoverability of drafts.

## 4. SEO plugin: useful editor fields, not a complete SEO system

- `@payloadcms/plugin-seo` adds a `meta` group containing title, description, and image by default. The frontend must explicitly render those values into metadata. The group can be extended with fields such as Open Graph values and JSON-LD ([SEO plugin](https://payloadcms.com/docs/plugins/seo)).
- `generateTitle`, `generateDescription`, and `generateImage` are editor-triggered auto-generation callbacks. `generateURL` feeds the search-preview component. These callbacks are not document lifecycle hooks, keyword research, indexing, or automatic metadata rendering ([SEO generation callbacks](https://payloadcms.com/docs/plugins/seo#generatetitle)).
- Source confirms the title/description/URL controls POST the current form data to plugin endpoints when the editor clicks Generate; the endpoints invoke the configured callbacks ([SEO plugin endpoint source](https://github.com/payloadcms/payload/blob/v3.82.1/packages/plugin-seo/src/index.ts), [title control source](https://github.com/payloadcms/payload/blob/v3.82.1/packages/plugin-seo/src/fields/MetaTitle/MetaTitleComponent.tsx)).

**Security/cost caveat:** do not hide unrestricted paid DataForSEO or LLM calls inside these callbacks. If used, require an authenticated editor/service role, rate-limit, cap spend, cache by normalized input, log request/run IDs, and separate research jobs from one-click field suggestions.

## 5. Metadata, canonical, robots, and sitemaps in the official website template

- The official template's page routes call a `generateMeta` utility from Next.js `generateMetadata`. In `v3.82.1`, that utility emits title, description, and Open Graph data from Payload's `meta` fields ([official `generateMeta` source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/utilities/generateMeta.ts)).
- **Template gap:** that utility does not emit `alternates.canonical`, and the template contains no `robots.ts`/`robots.txt` route. Canonical and robots policy therefore require explicit application code; installing the Payload SEO plugin does not create them.
- The template implements separate cached Pages and Posts XML route handlers. Each queries `draft: false`, `overrideAccess: false`, and `_status: published`, then maps canonical public URLs plus `updatedAt`; the cache has a collection-specific tag ([Pages sitemap source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/app/%28frontend%29/%28sitemaps%29/pages-sitemap.xml/route.ts), [Posts sitemap source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/app/%28frontend%29/%28sitemaps%29/posts-sitemap.xml/route.ts)).

**Operator requirements:** every indexable page type needs one self-referential absolute canonical; draft/preview/staging environments must be `noindex`; robots must name the sitemap(s); sitemap queries must include only published, indexable, canonical URLs and exclude redirects, duplicates, thin/blocked pages, and non-production hosts.

## 6. Revalidation hooks must cover every dependent surface

- The official Pages hook revalidates the current route and `pages-sitemap` tag when a page is published. When a previously published page is unpublished or its slug changes, it revalidates the old route too. Delete revalidates the route and sitemap tag ([official Pages revalidation source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/collections/Pages/hooks/revalidatePage.ts)). Posts use the same pattern ([official Posts revalidation source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/collections/Posts/hooks/revalidatePost.ts)).
- These hooks invalidate the document route and its sitemap only. They do not automatically discover every page that embeds, lists, links to, or derives metadata from the changed document.

**Operator guardrail:** maintain explicit cache tags/dependency invalidation for service hubs, location hubs, archive/search pages, related-content blocks, header/footer navigation, media/OG assets, and any internal-link module. A successful Payload update does not prove the Vercel edge is serving the new graph everywhere.

## 7. Redirects plugin

- `@payloadcms/plugin-redirects` creates a managed Redirects collection with `from` and `to` fields and supports internal document references. Optional `redirectTypes` can add choices such as `301` and `302` ([Redirects plugin](https://payloadcms.com/docs/plugins/redirects)).
- **Critical limitation:** the plugin only stores/manages redirects; it does not issue an HTTP redirect. Frontend routing must query the collection and return the status/target ([frontend integration](https://payloadcms.com/docs/plugins/redirects#frontend-integration)).
- The official template caches all redirects and invalidates the `redirects` tag after changes ([redirect query source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/utilities/getRedirects.ts), [redirect revalidation source](https://github.com/payloadcms/payload/blob/v3.82.1/templates/website/src/hooks/revalidateRedirects.ts)).

**Operator rule:** before changing any published slug, create and verify a one-hop permanent redirect from old canonical to new canonical; update internal links; ensure the old URL is removed from the sitemap; reject chains, loops, redirects to 404s, and redirects to non-canonical variants. The frontend must honor the stored permanent/temporary type rather than merely storing it.

## 8. Payload Jobs Queue on Vercel

- Jobs distinguish tasks, workflows, jobs, and named queues. Scheduling and execution are separate: a schedule enqueues work, while a runner executes it. Queue names must match ([Jobs Queue](https://payloadcms.com/docs/jobs-queue/overview)).
- **Vercel rule:** Payload explicitly says never use `autoRun` on serverless platforms. Trigger `/api/payload-jobs/handle-schedules` and `/api/payload-jobs/run` from external cron instead ([serverless jobs guidance](https://payloadcms.com/docs/jobs-queue/overview#using-autorun-on-serverless-platforms)).
- Secure the run endpoint with `jobs.access.run` and `CRON_SECRET`; Vercel sends that secret as a Bearer Authorization header. The official recommendation uses Endpoint + Vercel Cron for production serverless deployments ([Queues: Vercel Cron](https://payloadcms.com/docs/jobs-queue/queues#vercel-cron-example)). Apply equivalent access control to schedule handling.
- Workflows resume from the failed step, reusing successful task outputs; retries should be higher only for idempotent/external calls and lower for non-idempotent operations ([Workflows](https://payloadcms.com/docs/jobs-queue/workflows)).
- Enable concurrency controls and key them by resource, e.g. `seo:{collection}:{documentId}:{locale}`. `exclusive: true` serializes work for the same resource; `supersedes: true` deletes older pending jobs when only the newest regeneration matters ([workflow concurrency](https://payloadcms.com/docs/jobs-queue/workflows#concurrency-controls)).

**Recommended queues:** `seo-research`, `seo-generate`, `seo-audit`, and `seo-measure`. Draft creation should be idempotent on a stable key such as `business + intent cluster + location + page type`, so retries update the intended draft instead of creating duplicate money pages.

## Bottom line for the playbook

Payload should be the typed content-control plane, not the SEO brain. DataForSEO/Google/LLM workflows produce a versioned content brief and valid page payload; a narrow service writes an access-controlled, lock-respecting draft; authenticated preview plus automated QA verifies the rendered result; a human publishes; hooks invalidate all affected pages, sitemaps, and redirects; measurement jobs close the loop.
