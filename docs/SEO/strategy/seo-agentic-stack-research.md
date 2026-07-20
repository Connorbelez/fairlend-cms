# Open-source agentic SEO stack: primary-source evaluation

Date: 2026-07-13

## Executive conclusion

There is no credible single open-source system that safely does the whole job—market and local keyword discovery, technical SEO, site architecture, conversion copy, publishing, Google platform operations, and closed-loop measurement. The strongest practical solution is a composable stack:

1. **Best workflow/SEO knowledge layer: [NotFair](https://github.com/nowork-studio/NotFair).** Its SEO skills cover full-site and single-page analysis, keyword research, content planning/writing, metadata, schema, broken links, GEO, and CMS setup. Unlike a generic prompt collection, the repository includes reference material, deterministic Python collectors, and eval fixtures. Its connector placeholders let the skills use different GSC/CMS tool providers rather than hard-coding one vendor. It is the best beginner-facing operating playbook and copy-production layer.
2. **Best live SEO data and state layer: [OpenSEO](https://github.com/every-app/open-seo).** Its current MCP implementation exposes real keyword metrics, SERPs, domain/ranking/backlink data, local-business/Maps research, Google Business Q&A, GSC performance and URL inspection, and background site audits. Its bundled skills cover project onboarding, keyword discovery, clustering/page mapping, competitive research, and link prospecting. This is the closest open-source replacement for the agent-facing parts of Semrush/Ahrefs, but it still depends on paid DataForSEO usage.
3. **Best deterministic browser/computer-use layer: Codex inbuilt browser and computer use.** It gives the agent structured page state and deterministic actions through Codex’s built-in browser, supports persistent logged-in profiles or a supervised browser session, and is better suited than screenshot-only automation for repeatable platform work. Use it for exploratory loops and controlled UI verification when no adequate API exists.

4. **Native APIs before browser automation:** use OpenSEO's GSC tools or [mcp-gsc](https://github.com/AminForou/mcp-gsc), the official GA4 Data API, WordPress REST (or the equivalent CMS API), and—after approval—the Google Business Profile APIs. Use Playwright only for a platform surface with no adequate API, OAuth bootstrap, or a supervised one-off UI action.
5. **2026 answer/community/compliance extensions:** add a governed question graph, an engine-specific AI-prompt measurement harness, Bing Webmaster Tools, IndexNow, and Reddit Pro. These are extensions to the same evidence loop—not a replacement “GEO platform.” For this Ontario mortgage site, put an MBLAA/FSRA publication gate in front of every public output.

The recommended orchestrator is the coding agent already responsible for the website repository (Codex is a strong fit): it can combine the skill instructions with live MCP data, edit the actual components/templates, run tests and Lighthouse, publish drafts through an API, and inspect the deployed result. Do **not** put an autonomous browser agent in charge of unsupervised publication, GBP edits, review replies, link outreach, or bulk page generation.

## Evaluation criteria

The target is the complete revenue-SEO loop, not a one-shot audit:

1. Discover high-intent queries, including location modifiers and Maps/local-pack intent.
2. Cluster by actual search intent and SERP overlap; map one cluster to one existing or proposed page.
3. Audit crawlability, indexability, internal links, templates, structured data, speed, and conversion intent.
4. Produce differentiated service/location/comparison pages and supporting content.
5. Implement changes in the website/CMS and validate the rendered result.
6. Measure queries, pages, rankings, organic sessions, and key events; iterate from evidence.
7. Automate external platform work with explicit authorization and approval gates.
8. Discover and answer real buyer questions; measure citations and answer accuracy separately in each AI surface.
9. Operate community research and regulated-finance publishing without scraping, astroturfing, unsupported claims, or autonomous engagement.

I treated repository source, tests, official documentation, and first-party API policies as evidence. Repository descriptions and star counts are discovery signals, not proof that a workflow works.

## Recommended components

### 1. NotFair: best skill and workflow layer

**What is real.** The MIT-licensed repository is active as of 2026-07-13 and exposes a coherent SEO suite: full GSC-aware analysis, a dedicated page audit, keyword discovery and intent clustering, content planning/writing, metadata, schema, broken-link checking, GEO, and CMS setup. The repo's implementation tree contains WordPress, Strapi, Contentful, and Ghost fetchers, PageSpeed/GSC helpers, per-skill references, and eval JSON rather than only top-level prose. The [repository architecture and connector contract](https://github.com/nowork-studio/NotFair#connectors) explicitly makes Search Console and CMS capabilities replaceable; the [content writer](https://github.com/nowork-studio/NotFair/blob/main/seo/content-writer/SKILL.md), [keyword research](https://github.com/nowork-studio/NotFair/blob/main/seo/keyword-research/SKILL.md), and [CMS setup](https://github.com/nowork-studio/NotFair/blob/main/seo/setup-cms/SKILL.md) are inspectable instructions, not closed prompts.

**Why it wins this layer.** It covers the novice's missing process: what to collect, how to classify intent, how to turn research into a page/content plan, how to draft, and how to audit the result. It also degrades when a connector is absent instead of assuming data exists.

**Local verification.** Against the 2026-07-13 checkout used for this evaluation, its Python unit suite completed with `267 passed` (`python3 -m pytest -q test/unit`). This does not validate the quality of model-written copy or live third-party integrations, but it is materially stronger engineering evidence than a prompt repository with no executable tests.

**Limits.** It is primarily distributed as a Claude Code plugin, although its `SKILL.md` assets and scripts are portable. Its SEO intelligence is still instruction-driven; keyword volume, ranking difficulty, SERPs, backlinks, and local-pack evidence must come from OpenSEO/DataForSEO or another real provider. CMS setup gives content access and auditing, not a universal, safety-reviewed publisher for every custom website. Its LLM output must still be checked for factual accuracy, brand voice, legal claims, and genuinely local evidence.

**Verdict:** use its SEO skills as the operating method and writing layer. Do not treat it as the data source.

### Best live SEO provider: DataForSEO

For this agentic stack, **DataForSEO is the best primary third-party provider**. It is the provider OpenSEO is already designed around, exposes the broadest useful surface through one pay-as-you-go account, and does not force an agency-tier subscription before the agent can make API calls.

- Its Google Labs data covers a 4.8-billion-plus keyword database, seed expansion, keyword difficulty, search intent, search volume, CPC, paid competition, monthly history, ranked keywords, domain/page intersections, SERP competitors, and historical SERPs ([DataForSEO Labs overview](https://docs.dataforseo.com/v3/dataforseo_labs-google-overview/)).
- Its SERP API supplies fresh organic results and coordinate-targeted Google Maps results, which is necessary for GTA/local intent rather than country-level keyword guessing ([SERP pricing and modes](https://dataforseo.com/apis/serp-api/pricing); [Google Maps endpoint](https://docs.dataforseo.com/v3/serp-google-maps-task_post/)).
- The same account can provide backlinks, business/profile data, and on-page crawls. Current published prices are pay-as-you-go with a $50 minimum top-up that remains on the account; standard SERPs start at $0.0006 per ten-result SERP, the basic on-page crawl is $0.00015 per page, and a 1,000-row backlink request is approximately $0.06 before optional extras ([general pricing](https://dataforseo.com/pricing); [minimum payment](https://dataforseo.com/help-center/minimum-payment); [on-page costs](https://dataforseo.com/help-center/cost-of-onpage-api-parameters); [backlink pricing](https://dataforseo.com/pricing/backlinks/backlinks)). Set a hard spend limit because browser rendering, deeper SERPs, priority modes, and optional parameters increase cost.

**Why not Semrush first:** its Standard API requires the SEO Business subscription—currently $499/month or $416.66/month billed annually—then separately purchased API units; many legacy SEO reports return CSV and charge per returned line ([API access](https://developer.semrush.com/api/get-started/api-access/); [Business pricing](https://www.semrush.com/pricing/#seo); [SEO API format and charging](https://developer.semrush.com/api/seo/overview/)). Semrush is a strong human-operated suite and its Local APIs may become useful later, but it is poor value as the initial machine data plane.

**Why not Ahrefs first:** Ahrefs API v3 has excellent Site Explorer, Keywords Explorer, SERP, Rank Tracker, and Site Audit coverage, but API access is tied to paid plans and every non-free request has a 50-unit minimum. Current plans with API access start at $129/month, with materially more capacity at higher tiers ([API scope and eligibility](https://docs.ahrefs.com/en/api/docs/introduction); [unit consumption](https://docs.ahrefs.com/en/api/docs/limits-consumption); [plans](https://ahrefs.com/pricing)). Add Ahrefs later if backlink prospecting becomes important enough to justify a second data source; do not pay for it before the first content/measurement loop is working.

DataForSEO does **not** replace first-party truth. Join it with Search Console for the site's actual query/page visibility, GA4 for organic conversions, Google Ads Keyword Planner where account-specific forecasts matter, and Google Business Profile performance for owned local listings.

### 2. OpenSEO: best data/MCP backbone

OpenSEO is MIT licensed, self-hostable, and unusually active: its default branch was updated on 2026-07-13. The README advertises keyword research, rank tracking, competitor/domain insights, backlinks, audits, AI visibility, MCP access, and reusable agent skills, with DataForSEO charged separately ([project README](https://github.com/every-app/open-seo#readme)).

More importantly, the current code is ahead of the README:

- The MCP server registers keyword expansion/saving, domain suggestions, SERPs, rank tracking, backlinks, ranked keywords and SERP competitors ([MCP registration source](https://github.com/every-app/open-seo/blob/main/src/server/mcp/server.ts)).
- `get_keyword_metrics` hydrates as many as 700 known queries with search volume, difficulty, intent, CPC, competition, and monthly trends. `search_local_businesses` queries listings around coordinates, while `get_local_serp_results` runs Google Maps or Local Finder results around coordinates; Google Business questions are also exposed ([DataForSEO research-tool implementation](https://github.com/every-app/open-seo/blob/main/src/server/mcp/tools/dataforseo-research-tools.ts)).
- GSC performance supports query/page/date dimensions, filters, pagination, and query-to-page mapping; URL inspection is exposed separately ([Search Console tool implementation](https://github.com/every-app/open-seo/blob/main/src/server/mcp/tools/search-console-tools.ts)).
- Site audits run asynchronously and expose status, issues, and crawled-page records including indexability, crawl depth, link counts, titles, descriptions, and word counts ([site-audit tool implementation](https://github.com/every-app/open-seo/blob/main/src/server/mcp/tools/site-audit-tools.ts)).
- The clustering skill explicitly uses GSC query/page evidence, SERP overlap, and local SERPs to decide page boundaries rather than merely embedding similar words ([keyword-clustering skill](https://github.com/every-app/open-seo/blob/main/.agents/skills/keyword-clustering/SKILL.md)).

**Limits and maturity risk.** OpenSEO was created in February 2026; it is a fast-moving young project. The README still lists Local SEO and improved/scheduled audits as roadmap items even though portions are already registered in current source. That documentation drift is evidence of velocity and of release-maturity risk. Pin a tested commit, self-host only after a security/config review, and smoke-test every MCP tool against a small project before making it part of a recurring workflow. Its local tooling is research and rank observation—not authorized mutation of the owner's Google Business Profile. Its intelligence is only as good as DataForSEO's coverage and the configured market/location.

**Verdict:** use OpenSEO as the canonical SEO research/state service and feed its output into NotFair workflows.

### 3. Playwright MCP: best browser execution layer

Microsoft's Apache-2.0 server is very actively maintained, has a substantial test tree, and interacts through accessibility snapshots instead of requiring vision for every action. It supports Codex directly, persistent profiles, storage-state files, connecting to a running Chrome/Edge instance, permissions, origin controls, and isolated contexts ([official README](https://github.com/microsoft/playwright-mcp#readme)).

Use it for:

- authenticated read-only inspection where an API is missing;
- OAuth/login bootstrap and verification;
- previewing CMS drafts and checking rendered titles, canonicals, schema, links, responsive layout, and forms;
- supervised changes in niche directories or dashboards without usable APIs;
- deterministic regression scripts for important platform workflows.

Do not confuse browser capability with platform knowledge. The workflow skill must tell the agent what fields mean, what evidence is required, and what actions are allowed. Prefer a recorded Playwright script for recurring work; use exploratory MCP interaction to learn or repair the flow. Browser Use is a capable MIT-licensed autonomous browser library, but it adds another LLM-driven control loop and cloud/runtime surface; it is not the first choice when the existing agent can already drive Playwright ([Browser Use repository](https://github.com/browser-use/browser-use)).

### 4. Native Google and CMS connectors

- **Search Console:** OpenSEO's integrated GSC tools are sufficient for most query/page iteration. Add [mcp-gsc](https://github.com/AminForou/mcp-gsc) if its broader property, sitemap, weekly-report, cannibalization, content-opportunity, and indexing-audit workflows are useful. It is MIT licensed and remains active, but it does not supply general-market keyword demand or publish website content. Google's official API supports Search Analytics, verified sites, and sitemap management ([Search Console API](https://developers.google.com/webmaster-tools)).
- **GA4:** query landing-page organic sessions, engagement and key events through the official Data API; `runReport` supports dimensions, metrics, filters, pagination and date comparisons ([GA4 Data API reporting guide](https://developers.google.com/analytics/devguides/reporting/data/v1/basics)). This is the conversion/outcome half that rank trackers cannot provide.
- **Google Ads / Keyword Planner:** OpenSEO's DataForSEO metrics are the easiest initial route. If the business has an Ads account and approved developer token, Google's `KeywordPlanIdeaService` can generate ideas from keyword, URL, or site seeds with explicit location/language targeting ([Keyword Ideas](https://developers.google.com/google-ads/api/docs/keyword-planning/generate-keyword-ideas)); historical metrics include average monthly searches, competition, and bid ranges ([Historical Metrics](https://developers.google.com/google-ads/api/docs/keyword-planning/generate-historical-metrics)). Use CPC and bid range as commercial-intent evidence, not as proof that an organic page will convert. Google's open-source [Google Ads MCP](https://github.com/googleads/google-ads-mcp) is useful for account reporting, while direct `KeywordPlanIdeaService` access or NotFair's Ads connector is required when the needed Keyword Planner operation is not exposed by the MCP tool set.
- **Official analytics MCP:** Google's experimental Apache-2.0 [Google Analytics MCP](https://github.com/googleanalytics/google-analytics-mcp) wraps the Admin and Data APIs for account/property discovery, core reports, funnel reports, custom dimensions, and realtime reports. Prefer it over browser-driving the GA interface.
- **Google Business Profile:** use the official APIs only after project approval and OAuth setup; access is not public and requires a legitimate business reason ([GBP basic setup](https://developers.google.com/my-business/content/basic-setup)). Google prohibits automated listing edits, review replies, Q&A actions, and similar mutations without the user's prior specific and express consent ([GBP API policies](https://developers.google.com/my-business/content/policies)). A browser is not a loophole around those policies.
- **Payload CMS (this marketing site):** no generic CMS publisher is needed. The `fairlend-cms` workspace already runs Payload 3.82.1 with `@payloadcms/plugin-seo`, SEO metadata on Pages and Posts, versions/drafts, scheduled publishing, live preview, sitemap revalidation, and dedicated `MoneyPageBlocks`. Add a thin, typed NotFair-to-Payload adapter that uses Payload's Local API inside the Next/Payload process; use authenticated REST only when the agent runs outside that trust boundary. Every generated page should be created or updated with `_status: 'draft'` and the API's `draft: true` option, then reviewed in the existing live preview before a human explicitly publishes it ([Payload Local API](https://payloadcms.com/docs/local-api/overview); [draft semantics](https://payloadcms.com/docs/versions/drafts); [SEO plugin](https://payloadcms.com/docs/plugins/seo)). Payload's Local API bypasses access control and document locks by default, so the adapter must set `overrideAccess: false`, pass a least-privilege service `user` or authenticated `req`, and set `overrideLock: false`. It must also reject `_status: 'published'` server-side: Payload documents that `data._status: 'published'` overrides `draft: true`, so draft mode alone is not a publication guard. Validate the typed `MoneyPageBlocks` contract before review. Treat the SEO plugin's generation callbacks as editor conveniences, not save hooks or live keyword-research hooks; keep paid provider calls in a separately authenticated and rate-limited SEO workflow. Recurring research/import work can run as typed Payload jobs with retries and an audit trail ([Payload Jobs Queue](https://payloadcms.com/docs/jobs-queue/overview)). Playwright should verify the rendered preview, not type content into the Admin UI.

## 2026 search expansion: AI answers, questions, Reddit, and regulated finance

### AI Overviews and AI Mode: optimize the source, not a mythical AI switch

Google's current position is refreshingly concrete: the same technical and people-first SEO fundamentals apply to AI Overviews and AI Mode; there is no special AI schema, `llms.txt`, “AI text file,” or separate eligibility protocol. A supporting page must be indexed and eligible to show a snippet. Google may use query fan-out—issuing related searches across subtopics and data sources—so comprehensive topic architecture and precise answer passages matter, but they do not create guaranteed citations ([Google AI features and your site](https://developers.google.com/search/docs/appearance/ai-features); [Google's 2026 optimization resource](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing)).

The implementation contract is therefore:

1. keep important information in crawlable text and link it from the site's real architecture;
2. answer the exact question immediately, then add conditions, evidence, examples, risks, and the next decision;
3. publish original, non-commodity information—calculations, documented process, local/regulatory interpretation by a qualified reviewer, tools, comparison criteria, and first-party evidence;
4. keep structured data accurate and visibly supported, but never create fake discussion, Q&A, review, or financial-product markup;
5. use `nosnippet`, `data-nosnippet`, `max-snippet`, and `noindex` deliberately when content must not be summarized; do not confuse Google-Extended with Search inclusion controls.

Google retired FAQ rich-result support in May 2026. Publisher-authored questions remain excellent content architecture, but `FAQPage` is no longer a Google rich-result tactic. `QAPage` remains for a genuine single question with multiple user answers, not a company's own answer page ([Google Search documentation updates](https://developers.google.com/search/updates); [Q&A structured data](https://developers.google.com/search/docs/appearance/structured-data/qapage)).

### AI visibility measurement: engine-specific, sampled, and revenue-linked

When available on the property, Search Console's new Search Generative AI report exposes AI Overview/AI Mode impressions by page, country, device, and date, but currently not queries or clicks. AI-feature traffic also remains in the ordinary Web performance report. Bing Webmaster Tools' AI Performance preview reports citations, cited pages, grounding queries, and trends; a citation is not proof of rank, authority, placement, or conversion ([Google Search Generative AI report](https://support.google.com/webmasters/answer/16984139?hl=en); [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)).

Maintain a 30–50 prompt minimum-viable library across service, market, persona, constraints, and journey stage. Run the same prompt set, protocol, and repeated samples on the two or three surfaces customers actually use. Store presence, recommendation, link, citation, accuracy, cited sources, competitors, and date **per engine**. Never collapse that into one vendor “AI visibility score.” Join three layers:

- **presence:** was the brand/page present, linked, cited, recommended, and accurately characterized?
- **readiness:** was the source indexable, passage-complete, current, differentiated, and supported by entity/evidence signals?
- **business impact:** did AI referrals, branded demand, assisted conversions, qualified leads, or revenue move?

This measurement design adapts Aleyda Solis's prompt-library and Presence/Readiness/Business Impact model, Kevin Indig's repeated engine-specific sampling, and iPullRank's passage/query-fan-out testing. These are useful practitioner hypotheses and observational frameworks—not Google requirements or guaranteed ranking factors ([Solis checklist](https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist/); [Solis measurement framework](https://www.aleydasolis.com/en/ai-search/a-3-layer-framework-to-measure-ai-presence-readiness-and-business-impact-redefining-metrics-for-the-ai-search-era/); [Indig 2026 research summary](https://www.growth-memo.com/p/2026-growth-memo-research-summary); [iPullRank measurement](https://ipullrank.com/ai-search-measurement)).

### Question-led revenue content

Create one canonical question inventory fed by redacted sales/support language, GSC, CRM objections, GBP Q&A, DataForSEO/PAA, and authorized Reddit research. The useful unit is not “another FAQ page”; it is a customer decision with an owner URL. Each answer unit should contain the exact question, a one-to-three-sentence answer, the conditions under which it changes, evidence or a worked example, risks/non-fit cases, reviewed date and owner, and the appropriate next step.

Marcus Sheridan's “They Ask, You Answer” method is a sound sales-content lens: answer the questions buyers are afraid to ask, especially cost, problems/drawbacks, comparisons, reviews, and best-of decisions ([official overview](https://marcussheridan.com/they-ask-you-answer/)). In financial services, adapt it rather than copying it blindly: numeric rate/cost claims trigger disclosure analysis; comparisons need substantiation; testimonials must be authentic; and “best” pages cannot be disguised self-rankings.

### Reddit: authorized listening and human expertise, never a link farm

Add **Reddit Pro** as the authorized customer-language/listening and owned-account measurement layer. The safe data flow is Reddit Pro plus human reading → paraphrased question hypothesis → DataForSEO/GSC/CRM validation → original expert-reviewed Payload content. Store derived themes, not bulk posts, usernames, profiles, deleted content, or a scraped corpus. Reddit Pro is incomplete, English-only, and not geographically precise, so its signals require validation ([Reddit Pro](https://support.reddithelp.com/hc/en-us/articles/24368510335892-What-is-Reddit-Pro); [Reddit Pro Trends](https://support.reddithelp.com/hc/en-us/articles/47619216411284-Reddit-Pro-Feature-Trends)).

Participation is human-operated. A real employee or qualified expert may answer a current question only when subreddit rules allow it, affiliation is obvious, the answer is complete without a click, and any company link is optional and disclosed. Agents may draft privately; they may not create accounts, scrape, post, comment, vote, DM, simulate customers, coordinate engagement, evade bans, buy moderator treatment, or optimize forum links for PageRank. API automation requires Reddit's approval for the exact commercial use case ([Reddit Rules](https://redditinc.com/policies/reddit-rules); [Reddit spam policy](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam); [Reddit automation rules](https://support.reddithelp.com/hc/en-us/articles/360043512931-Don-t-break-the-site); [Developer Terms](https://redditinc.com/policies/developer-terms)). Measure useful answers, substantive replies, removals, referrals, branded demand, qualified outcomes, and correction rate—not links placed, karma, or Reddit URLs ranked.

### Financial-services/YMYL publication gate

Google gives additional weight to trust for topics that can affect financial stability. Every advice-oriented page therefore needs clear authorship, a qualified reviewer, primary sources, jurisdiction, limitations, and a real review/expiry date ([Google people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)). For FairLend, that quality bar is also a legal operating constraint:

- treat website pages, CMS posts, social responses, GBP content, ads, and email as public-relations materials;
- show the FSRA-authorized brokerage name and licence clearly and prominently; when an individual is named, use the licensed name/title and brokerage details;
- require Principal Broker approval and retain the approved material;
- reject false, misleading, guaranteed, risk-free, regulator-endorsed, rate-bait, or unsubstantiated superlative claims;
- when borrower advertising states an interest rate, payment, or non-interest charge, require APR and term at equal prominence plus a compliant representative example where values vary;
- route investment/MIC/securities-adjacent content to Principal Broker and securities-counsel review;
- apply PIPEDA purpose, sensitivity, minimization, disclosure, retention, and consent controls to lead data; apply CASL to commercial email.

FSRA does not pre-approve advertising; the brokerage and Principal Broker own the review ([FSRA advertising requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/mortgage-industry-public-relations-and-advertising-requirements); [FSRA supervision requirements](https://www.fsrao.ca/industry/mortgage-brokering/compliance-and-other-resources/requirements-supervising-mortgage-brokers-and-agents); [PIPEDA meaningful consent](https://www.priv.gc.ca/en/privacy-topics/business-privacy/collecting-personal-information/consent/gl_omc_201805/)). The existing FairLend MBLAA audit must be closed before scale: reconcile licence status, verify the authorized `FairLend Mortgage` name, gate dynamic CMS publication, substantiate quantitative claims, and obtain securities review for investor content.

### Evidence hierarchy for “growth hacks”

Do not install practitioner advice as folklore. Label every tactic:

| Class | Evidence | Operating rule |
|---|---|---|
| A | Official platform/policy/documentation | Default constraint until rechecked |
| B | FairLend first-party experiment with qualified outcome | May become a local default after replication |
| C | Practitioner/vendor dataset | Time-boxed test; record population and limitations |
| D | Plausible mechanism or anecdote | Backlog hypothesis only; never a claim or control |

Focused pages, proprietary comparison/benchmark data, passage-complete answers, and per-engine prompt tracking are sensible C-level tests from Solis, Indig, and iPullRank. Promote them only when FairLend's own GSC/GA4/CRM or citation/accuracy evidence supports the move.

## Candidate comparison

| Candidate | Best use | Proven capability | Critical gap | License / activity verdict |
|---|---|---|---|---|
| [NotFair](https://github.com/nowork-studio/NotFair) | SEO operating playbook, copy/content, CMS-aware audits | Skills + references + scripts + evals; keyword/content/page/schema/GEO workflows | Needs live SEO provider; Claude-first packaging; publishing remains CMS-specific | MIT; active 2026-07-13; **recommended workflow layer** |
| [OpenSEO](https://github.com/every-app/open-seo) | Keyword/SERP/local/GSC/backlink/audit data and saved state | Current MCP source registers the core research and audit tools | Young, fast-changing, paid DataForSEO dependency, no full copy/publisher | MIT; active 2026-07-13; **recommended data layer** |
| [Codex SEO](https://github.com/AgriciDaniel/codex-seo) | Broad Codex-native audit and specialist routing | 26 workflows, 24 TOML agents, deterministic runners, Google/DataForSEO/Firecrawl integrations and CI checks ([README](https://github.com/AgriciDaniel/codex-seo#readme)) | Mostly audit/planning, not a complete copy/publish loop; contains prescriptive heuristics that are not Google rules; the README says MIT but the repository's root `LICENSE` is proprietary | **Not currently open source despite the README claim; do not adopt or copy without explicit permission** |
| [SEO Machine](https://github.com/TheCraigHewitt/seomachine) | Brand-contextual long-form content production | Commands/agents for research, writing, optimization and WordPress, with GSC/GA4/DataForSEO adapters and a concrete Castos example | Claude-workspace packaging; content-heavy rather than local/technical/platform-complete; only 23 commits and its latest commit was 2026-04-10 when checked | MIT; useful patterns and runner-up for editorial production, but NotFair is broader and more active |
| [mcp-gsc](https://github.com/AminForou/mcp-gsc) | GSC measurement and indexing workflows | Search analytics, URL inspection, sitemaps, properties, reusable SEO report skills | GSC only; no market demand, backlinks, CMS or implementation | MIT; active; **recommended optional Google connector** |
| [DataForSEO MCP](https://github.com/Skobyn/dataforseo-mcp-server) | Maximum raw DataForSEO endpoint coverage | Broad SERP, keywords, labs, backlinks, on-page, content, business and local-falcon tool surface | Hundreds of tools create context/discovery overhead; wrapper changelog acknowledges many endpoint corrections; no workflow or state UI | MIT; active June 2026; use when OpenSEO omits a required endpoint |
| [GEOFlow](https://github.com/yaojingang/GEOFlow) | High-volume editorial queue and WordPress/multi-site distribution | RAG, draft/review/publish workflow, scheduling/retry, WordPress REST and generic HTTP publishers, sitemap/schema/metadata output | Weak keyword intelligence and technical audit; content-factory misuse creates scaled-content risk | Apache-2.0; active July 2026; optional after the strategy loop works |
| [SEO Agency in a Box](https://github.com/z1fex/SEO-AGENCY-IN-A-BOX) | Prompt/workflow inspiration | Large Claude/Obsidian prompt hierarchy and Firecrawl/Tavily workflows | Tavily is not a keyword-volume/rank database; no GSC/GA4/CMS/platform mutation layer or meaningful automated tests; “75 agents” mostly means 75 prompt files | MIT; small/young; do not adopt as production foundation |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Deterministic browser automation | Structured page state, persistent sessions, direct Codex config, tests and security controls | Browser actions remain brittle and policy-sensitive | Apache-2.0; active July 2026; **recommended execution layer** |

## Concrete architecture

```text
Codex / repository-owning agent
  |
  +-- NotFair SEO skills ---------------- method, briefs, copy, QA
  |
  +-- OpenSEO MCP ------------------------ projects, keywords, SERPs, local, audits, GSC
  |     +-- DataForSEO API --------------- paid market/SERP/backlink/local data
  |     `-- Google Search Console -------- first-party query/page/index evidence
  |
  +-- GA4 Data API ----------------------- organic sessions and key events
  +-- Bing Webmaster Tools + IndexNow --- AI citations + change notification
  +-- Reddit Pro ------------------------- authorized listening + owned metrics
  +-- CMS API or git/PR pipeline -------- draft/implementation/publish
  `-- Playwright MCP/CLI ---------------- supervised UI gaps + rendered verification

Evidence store in the website repo:
  seo/questions.csv
  seo/ai-prompts.csv
  seo/claims.yaml
  seo/community-register.yaml
  seo/strategy.md
  seo/keywords.csv
  seo/page-map.csv
  seo/briefs/
  seo/experiments/
  seo/snapshots/
```

The durable unit is a **page opportunity**, not a keyword: intent, location, demand, difficulty, CPC/commercial signal, SERP type, current URL, proposed URL, evidence, conversion action, owner, status, publish date, and pre/post GSC+GA4 metrics. This prevents a model from generating a page for every lexical variant.

## Phased implementation plan

### Phase 0 — guardrails and baseline (day 1)

1. Create a dedicated Google identity with least privilege; connect GSC and GA4 read-only first.
2. Configure OpenSEO against one project and a strict DataForSEO spend cap. Pin a tested OpenSEO commit.
3. Install only the NotFair SEO skills needed for the first loop; do not enable unrelated ad mutation tools.
4. Connect Playwright with a dedicated profile, restricted workspace/output directory, and no stored secrets in the repository.
5. Capture current sitemap, crawl/audit, GSC 16-month query/page export, GA4 organic landing pages/key events, top conversions, and current rankings for the initial market.
6. Close the FairLend MBLAA audit's licence/name contradictions and define Principal Broker, privacy, CASL, and securities-review gates before any public cohort.

### Phase 1 — opportunity map (week 1)

1. Define services, profitable customer types, real service area, exclusions, proof/assets, and primary conversions.
2. Use OpenSEO to expand seeds, hydrate metrics, inspect local and organic SERPs, find actual competitors, and pull existing GSC queries.
3. Use NotFair to classify commercial/transactional/local intent and create clusters. Validate page boundaries with SERP overlap, not word similarity alone.
4. Build a page map: retain/merge/refresh/create; connect every supporting page to a money page and every money page to a conversion action.
5. Select the first 5–10 opportunities by expected business value, attainable difficulty, and available evidence—not raw volume.
6. Build a paraphrased question graph from calls, support, GSC, and Reddit Pro; establish a fixed 30–50-prompt AI baseline on the relevant engines.

### Phase 2 — implement and draft (weeks 2–3)

1. Fix blocking crawl/index/template/internal-link/performance issues before scaling pages.
2. Generate a brief, then a draft, for each approved opportunity. Require original local/service evidence: pricing logic, service boundaries, process, photos, staff expertise, case evidence, FAQs from real calls, and explicit next steps.
3. Implement in code via reviewed changes or publish as a CMS **draft**. Generate schema only when visible page content supports it.
4. Run local tests, crawl the preview, validate canonical/indexability/schema, inspect desktop/mobile with Playwright, and complete a human factual/brand/legal review.
5. Publish small batches. Update navigation/internal links and sitemap; request inspection in GSC. Do not use Google's Indexing API for ordinary service pages: Google limits it to `JobPosting` and livestream `BroadcastEvent` pages ([Indexing API quickstart](https://developers.google.com/search/apis/indexing-api/v3/quickstart)).
6. Notify participating engines of successfully deployed additions, changes, and removals through IndexNow while keeping XML sitemaps. Receipt is not an indexing guarantee ([IndexNow documentation](https://www.indexnow.org/documentation?hl=en)).

### Phase 3 — measure and iterate (weekly/monthly)

1. Weekly: OpenSEO rank/audit drift; GSC impressions, clicks, CTR, position and query-to-page cannibalization; URL inspection for selected pages.
2. Monthly: join GSC page/query outcomes to GA4 organic landing sessions and key events. Refresh titles/content only from an explicit hypothesis.
3. Keep an experiment ledger with before/after snapshots, change, target metric, expected window and result. Roll back regressions.
4. Expand the next batch only when the first pages index, attract relevant impressions, and convert—or when the failed hypothesis is understood.
5. Monthly: rerun the fixed prompt panel per engine and join GSC AI impressions, Bing citations, ordinary search, GA4, and CRM without double counting.
6. Weekly: use Reddit Pro for listening; any community contribution remains disclosed, human-submitted, subreddit-specific, and measured separately.

## Non-negotiable safety and quality gates

1. **No automatic public publishing.** Agent creates a PR or CMS draft; a human approves publication until at least several measured batches establish quality.
2. **No city-name spinning.** Every local page needs standalone value and real service/relevance evidence. Google's official guidance says mass-generating pages without added user value can violate scaled-content-abuse policy ([generative AI content guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content); [spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).
3. **No fake local presence, reviews, citations, authorship, case studies or statistics.** Local ranking is principally relevance, distance and prominence; complete accurate profile information and legitimate reviews/links matter ([Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en-en)).
4. **Explicit approval for external mutations.** GBP edits/replies/Q&A/posts, directory submissions, outreach email, backlink actions, analytics/admin changes and publication each require a scoped approval record.
5. **API-first, browser-second.** Browser automation must not bypass platform terms, CAPTCHAs, access controls or rate limits. Persist an audit log and screenshots for every approved mutation.
6. **Evidence labels.** Distinguish provider data, first-party GSC/GA4 data, observed page facts, model inference and human-supplied facts. Never let inferred volume, rankings or business claims appear as measurements.
7. **Cost and blast-radius controls.** Cap DataForSEO calls, limit crawl depth/page counts, restrict domains, draft rather than publish, run small batches and keep rollback paths.
8. **No cargo-cult GEO.** Do not add special AI files, unsupported schema, fixed answer lengths, synthetic citations, or query-variant page factories. Win on indexability, non-commodity evidence, specificity, and trust.
9. **No autonomous Reddit growth.** No scraping, account creation, posting, commenting, voting, DMs, astroturfing, manufactured consensus, or forum-link KPI. Human experts participate transparently under current community rules.
10. **Regulated-finance gate.** No public draft reaches publish without authorized-name/licence checks, substantiated claims, applicable APR/term treatment, privacy/CASL checks, and named Principal Broker approval; investor content also gets securities review.

## Final recommendation

Start with **NotFair + OpenSEO + DataForSEO + native GSC/GA4/Payload APIs + Playwright**, then add **Bing Webmaster Tools, IndexNow, Reddit Pro, the question/prompt ledgers, and the MBLAA publication gate**. That stack does the most legitimate heavy lifting while keeping real data, implementation, controlled platform execution, community trust, and regulated claims separate. Add mcp-gsc if OpenSEO's GSC surface proves insufficient. Add GEOFlow only if a reviewed, high-volume WordPress editorial pipeline becomes an actual requirement. Do not adopt Codex SEO unless its maintainer replaces the proprietary root license with an actual open-source license.

The most important design decision is not which “autonomous SEO agency” has the most agents. It is enforcing a closed loop in which real market data selects a small page opportunity, the agent implements a differentiated asset, a human approves external changes, and GSC plus GA4 decide what happens next.
