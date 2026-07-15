# Static rendering and LLM discoverability

Last reviewed: 2026-07-15

## Requirement

Public FairLend content must be useful from the initial HTTP response. Search crawlers, chat-product retrieval agents, text browsers, and users with JavaScript disabled must not depend on React hydration to discover FairLend's audience routes, financing model, leadership, operating principles, FAQs, or canonical detail pages.

The homepage must remain statically generated and retain the deferred rich visual sections used to protect initial render performance.

## Rendering architecture

`src/app/(home)/page.tsx` is forced static. It renders the critical hero and service overview normally, then passes Server Component fallbacks into the deferred Client Component rails.

Each deferred rail follows the same progressive-enhancement contract:

1. The static response contains a styled, semantic fallback with headings, prose, and real links.
2. The browser paints that fallback immediately. It is not an empty skeleton and does not hide content behind animation state.
3. As the rail approaches the viewport, its existing rich module and deferred stylesheet load.
4. The fallback remains mounted as the Suspense fallback until the rich module is ready, preventing collapse during the handoff.
5. A no-JavaScript client keeps the complete static fallback indefinitely.

This is the same content policy for people and crawlers. There is no user-agent rendering fork or bot-only cloaking.

## Machine-readable surfaces

- `/llms.txt` is the concise CommonMark site index.
- `/llms-full.txt` is the complete static site brief containing audience routes, the build model, leadership, operating principles, FAQs, canonical pages, identity, regulatory sources, and citation/risk guidance.
- The root document advertises both documents with `rel="alternate"` and `type="text/plain"` links.
- The root document includes an initial-response Schema.org `ItemList` whose entries are `Service` nodes for the five primary audience routes.
- `robots.txt` explicitly allows Google, Bing, DuckDuckGo, Apple, OpenAI search/user/training agents, Claude search/user/training agents, and Perplexity search/user agents while keeping admin, API, and preview paths disallowed.

Allowing a search or user-directed retrieval agent is separate from endorsing a claim it may generate. All machine-readable content retains the same underwriting, availability, investment-risk, and no-guarantee language used by the public site.

## Release verification

After deploying a preview or production origin, run:

```bash
pnpm audit:seo https://deployment.example
```

For a preview that correctly canonicalizes to production, provide the canonical origin separately:

```bash
SEO_CANONICAL_ORIGIN=https://www.fairlend.ca pnpm audit:seo https://deployment.example
```

The release audit fails when:

- a named crawler does not receive HTTP 200;
- a named crawler is missing from `robots.txt`;
- any required homepage fallback signal is absent from raw HTML;
- `/llms.txt` or `/llms-full.txt` is unavailable, has the wrong content type, or is unexpectedly thin;
- the root HTML does not advertise both text alternatives; or
- the homepage offer-catalog JSON-LD is absent.

For a direct raw-response check, fetch the homepage with JavaScript disabled or use a plain HTTP client and confirm `data-fairlend-static-fallback` appears before any client execution.
