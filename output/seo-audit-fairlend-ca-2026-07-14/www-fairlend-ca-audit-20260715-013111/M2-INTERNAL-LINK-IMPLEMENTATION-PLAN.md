# M2 implementation plan: contextual internal-link architecture

Prepared: 2026-07-15  
Scope: `https://www.fairlend.ca/`  
Source baseline: July 15 audit, current Next.js route tree, current source-level links

Cached inputs reused: `site-meta.json`, `audit-scores.json`, and `sitemap.json` from 2026-07-15; `plan.json` from 2026-07-14, refreshed with this M2 plan.

## Outcome

Build a crawlable, editorially relevant link graph in which:

- every indexable commercial URL has contextual body links from at least three distinct indexable source pages;
- each long-form page carries roughly 3–5 useful internal links per 1,000 words;
- commercial pillars, decision pages, trust content, and resource spokes reinforce one another;
- `/garden-suite` and `/affordable-sustainable-rental-housing` are no longer single-source pages;
- navigation/footer links are measured separately and never used to satisfy the contextual-link requirement;
- crawl depth, anchors, broken links, and distinct inbound body sources are stored in the SEO drift baseline.

## Current baseline

- The audit sitemap contains 17 canonical indexable URLs.
- The posts sitemap contains zero URLs, so the resource-spoke layer does not yet exist.
- `/borrowers` is the only mature commercial hub: its body cards already link to all borrower/build paths.
- Most commercial spokes link only to themselves, a CTA, or their parent hub.
- `/garden-suite` and `/affordable-sustainable-rental-housing` each had one discovered inbound source page in the audit.
- The existing drift cache has no accepted baseline.

## Architectural decisions

### 1. Lock the two garden-suite intents before adding anchors

| URL | Permanent intent | Anchor vocabulary |
|---|---|---|
| `/garden-suite-financing-gta` | Commercial financing decision page: debt structure, equity, permits, budget, draws, liquidity | “garden suite financing review”, “financing a garden suite build”, “garden suite draw planning” |
| `/garden-suite` | Eligibility/readiness tool: property and project-fit assessment leading into builder intake | “check garden suite eligibility”, “garden suite project-readiness check”, “garden suite eligibility tool” |

Do not use the generic anchor “garden suite” when the destination intent would be ambiguous.

### 2. Use a hub-and-spoke graph with cross-pillar bridges

- Borrower hub: `/borrowers`
- Borrower spokes: private, institutional, construction, multiplex, garden-suite financing, garden-suite eligibility, affordable rental
- Investor hub: `/investing`
- Investor spoke: `/investing/private-mortgage-lending`
- Trust node: `/disclosures`
- Resource hub: `/posts`
- Resource spokes: future `/posts/{slug}` URLs, each assigned to one primary commercial pillar and 1–3 sibling resources
- Partner bridge: `/partners`, connecting professional referrals to construction, multiplex, garden-suite, and disclosure content

### 3. Reuse the current page systems

Do not create unrelated link-card components.

- Extend `src/components/FairlendFeedbackContentPage/index.tsx` with an optional `relatedLinks` field on `FeedbackPageSection`. Render descriptive inline links immediately after the section body and before panels/checklists.
- Extend `src/components/FairlendPathHub/index.tsx` with optional `supportingLinks` prose beneath the route cards. Keep the existing route cards as the primary hub links.
- Add ordinary `next/link` links inside the existing bespoke borrower sections where the prose already introduces the adjacent decision.
- Extend the existing `RelatedPosts` system for resource siblings rather than building a second post-card implementation.

Proposed shared types:

```ts
type ContextualInternalLink = {
  href: FairlendCommercialPath
  label: string
  context?: string
}

type FeedbackPageSection = {
  // existing fields
  relatedLinks?: readonly ContextualInternalLink[]
}
```

Keep the allowed commercial paths and default labels in one typed registry:

`src/lib/fairlend-internal-links.ts`

The registry prevents typos, centralizes canonical paths, and supplies the crawler with the list of intentional narrow-page exceptions.

## Required source-to-target link matrix

The table defines the first implementation pass. Anchors may be adjusted to fit sentence grammar, but must retain the stated destination intent.

| Source page | Insertion context | Destination and descriptive anchor |
|---|---|---|
| `/` | Deferred borrower/build/investor overview copy in `FairlendDeferredLandingSections.client.tsx` | `/borrowers` — “compare FairLend’s borrower financing paths”; `/construction-draw-financing` — “plan construction draws before work begins”; `/investing` — “review private mortgage investing paths” |
| `/borrowers` | Existing `FairlendPathHub` cards; add one supporting sentence beneath the grid | Retain all seven spoke links. Add `/posts` — “read FairLend’s mortgage financing guides” once the first post is published |
| `/borrowers/private-mortgage-financing` | `JudgmentDesk` policy-fit discussion | `/borrowers/institutional-mortgage` — “compare institutional mortgage qualification” |
| `/borrowers/private-mortgage-financing` | `ExitRoute` maturity/exit discussion | `/construction-draw-financing` — “plan construction draws and exit financing” |
| `/borrowers/private-mortgage-financing` | `CostXray` rates, fees, and commitment caveat | `/disclosures` — “review FairLend’s financing and commitment disclosures” |
| `/borrowers/institutional-mortgage` | `DeclineDecoder` alternatives after a policy decline | `/borrowers/private-mortgage-financing` — “review private mortgage financing alternatives” |
| `/borrowers/institutional-mortgage` | `MatchingRoute` property/program fit | `/affordable-sustainable-rental-housing` — “review affordable rental housing financing” |
| `/borrowers/institutional-mortgage` | `TermSheet` construction/takeout sequencing | `/construction-draw-financing` — “coordinate construction draws with takeout financing” |
| `/borrowers/institutional-mortgage` | `QuestionRegister` terms and availability caveat | `/disclosures` — “read FairLend’s mortgage brokerage disclosures” |
| `/construction-draw-financing` | “One place for roadmaps, draws and proof” section | `/multiplex-financing-gta` — “apply draw planning to a multiplex project”; `/garden-suite-financing-gta` — “plan garden suite construction financing” |
| `/construction-draw-financing` | Carrying-cost/takeout section | `/affordable-sustainable-rental-housing` — “review rental-project capital and takeout”; `/disclosures` — “review financing availability disclosures” |
| `/multiplex-financing-gta` | Feasibility/roadmap section | `/construction-draw-financing` — “map the construction draw sequence” |
| `/multiplex-financing-gta` | Rental and MLI Select discussion | `/affordable-sustainable-rental-housing` — “compare affordable rental financing paths” |
| `/multiplex-financing-gta` | Project-fit alternatives | `/garden-suite` — “check whether a garden suite project fits instead”; `/borrowers/institutional-mortgage` — “review institutional mortgage qualification” |
| `/garden-suite-financing-gta` | “What the review pulls in” section | `/garden-suite` — “check garden suite project eligibility” |
| `/garden-suite-financing-gta` | “Funding planned before crews wait” section | `/construction-draw-financing` — “review the full construction draw process” |
| `/garden-suite-financing-gta` | “What kills a deal” alternatives | `/multiplex-financing-gta` — “compare multiplex project financing”; `/disclosures` — “review financing limitations and disclosures” |
| `/garden-suite` | Results/readiness explanation | `/garden-suite-financing-gta` — “move from eligibility to a garden suite financing review” |
| `/garden-suite` | Budget/draw readiness explanation | `/construction-draw-financing` — “understand construction draw requirements” |
| `/garden-suite` | Alternative density path | `/multiplex-financing-gta` — “compare a multiplex financing path”; `/affordable-sustainable-rental-housing` — “explore rental housing project financing” |
| `/affordable-sustainable-rental-housing` | “Capital for rentals built to last” section | Retain `/multiplex-financing-gta` with anchor “review multiplex financing” |
| `/affordable-sustainable-rental-housing` | Development and capital-stack section | `/construction-draw-financing` — “plan construction draws and working capital”; `/borrowers/institutional-mortgage` — “review institutional mortgage options” |
| `/affordable-sustainable-rental-housing` | Eligibility/availability caveat | `/disclosures` — “review FairLend’s financing disclosures” |
| `/investing` | Existing investor path cards and supporting copy | Retain `/investing/private-mortgage-lending` and `/posts`; add `/disclosures` — “review investor and administrator disclosures”; add `/borrowers/private-mortgage-financing` — “see how private mortgage files are structured for borrowers” |
| `/investing/private-mortgage-lending` | File-evaluation/risk section | `/borrowers/private-mortgage-financing` — “see the borrower-side private mortgage process” |
| `/investing/private-mortgage-lending` | Existing institutional comparison | Retain `/borrowers/institutional-mortgage` with anchor “compare institutional mortgage underwriting” |
| `/investing/private-mortgage-lending` | Suitability, administration, and risk section | `/disclosures` — “review mortgage administrator and investor disclosures”; `/posts` — “read FairLend’s mortgage investment guides” once resources exist |
| `/disclosures` | After identity/licensing and service-limit sections | `/borrowers` — “review borrower financing paths”; `/investing/private-mortgage-lending` — “review the private mortgage lending process”; `/partners` — “see how FairLend works with professional partners” |
| `/partners` | Site-search, capital-structure, and takeout sections | `/construction-draw-financing` — “bring financing into construction draw planning”; `/multiplex-financing-gta` — “review multiplex project financing”; `/garden-suite-financing-gta` — “review garden suite financing constraints” |
| `/partners` | Relationship/licensing section | `/disclosures` — “verify FairLend’s licensing and service disclosures”; `/posts` — “share FairLend’s financing resources” once resources exist |
| `/posts` | Resource-hub introduction | `/borrowers` — “start with the borrower financing map”; `/construction-draw-financing` — “review construction draw financing”; `/investing` — “review investor paths” |

## Expected inbound-source coverage after the first pass

These are distinct contextual body sources, excluding header, footer, logo, sitemap, breadcrumbs, and repeated global CTAs.

| Target | Minimum qualifying sources after implementation |
|---|---|
| `/garden-suite` | `/borrowers`, `/garden-suite-financing-gta`, `/multiplex-financing-gta` |
| `/affordable-sustainable-rental-housing` | `/borrowers`, `/borrowers/institutional-mortgage`, `/construction-draw-financing`, `/multiplex-financing-gta`, `/garden-suite` |
| `/garden-suite-financing-gta` | `/borrowers`, `/construction-draw-financing`, `/garden-suite`, `/partners` |
| `/construction-draw-financing` | `/`, `/borrowers`, `/borrowers/private-mortgage-financing`, `/borrowers/institutional-mortgage`, `/multiplex-financing-gta`, `/garden-suite-financing-gta`, `/garden-suite`, `/affordable-sustainable-rental-housing`, `/partners`, `/posts` |
| `/multiplex-financing-gta` | `/borrowers`, `/construction-draw-financing`, `/garden-suite-financing-gta`, `/garden-suite`, `/affordable-sustainable-rental-housing`, `/partners` |
| `/borrowers/private-mortgage-financing` | `/borrowers`, `/borrowers/institutional-mortgage`, `/investing`, `/investing/private-mortgage-lending` |
| `/borrowers/institutional-mortgage` | `/borrowers`, `/borrowers/private-mortgage-financing`, `/multiplex-financing-gta`, `/affordable-sustainable-rental-housing`, `/investing/private-mortgage-lending` |
| `/investing/private-mortgage-lending` | `/investing`, `/disclosures`, and the first investor resource spoke; until that spoke exists, add a contextual link from `/partners` |
| `/disclosures` | `/borrowers/private-mortgage-financing`, `/borrowers/institutional-mortgage`, `/construction-draw-financing`, `/garden-suite-financing-gta`, `/affordable-sustainable-rental-housing`, `/investing`, `/investing/private-mortgage-lending`, `/partners` |
| `/posts` | `/investing`, `/borrowers`, `/partners`, `/investing/private-mortgage-lending` after the first post is published |

The implementation crawler, not this forecast, determines final pass/fail.

## Resource-spoke implementation

The resource cluster is a dependency because `posts-sitemap.xml` currently has zero URLs. Build the mechanics during M2; populate it as M3 resources publish.

### Payload schema

Edit `src/collections/Posts/index.ts`:

1. Add required `commercialPillar` select values sourced from `src/lib/fairlend-internal-links.ts`.
2. Keep the existing `relatedPosts` relationship for siblings.
3. Require one commercial pillar and at least one related sibling before a post can move to `published`, once two or more posts exist in that pillar.
4. Add an admin description explaining that the pillar controls the commercial “next decision” link and reverse resource listings.

### Post rendering

Edit `src/app/(frontend)/posts/[slug]/page.tsx` and extend `src/blocks/RelatedPosts/Component.tsx`:

- render a paragraph-style commercial pillar link immediately after the article body;
- keep 1–3 related-post cards as sibling links;
- label the module by intent, for example “Use this guide in your construction financing plan”, not “Related links”;
- query published posts by `commercialPillar` on each commercial page and render no module when no posts exist;
- never manufacture links to draft or noindex posts.

### Initial resource assignments

| Planned resource | Primary commercial pillar | Sibling cluster |
|---|---|---|
| Construction draws for small builders | `/construction-draw-financing` | working capital, holdbacks, project evidence |
| Multiplex and MLI Select financing guide | `/multiplex-financing-gta` | affordable rental, construction draws |
| Private mortgage qualification guide | `/borrowers/private-mortgage-financing` | institutional alternatives, costs and exits |
| Institutional mortgage documentation guide | `/borrowers/institutional-mortgage` | private alternatives, term sheets |
| Private mortgage investor due-diligence guide | `/investing/private-mortgage-lending` | administration, suitability, risk |
| Garden suite readiness checklist | `/garden-suite` | garden-suite financing, construction draws |

## Implementation work packages

### W0 — Capture a truthful pre-change graph

Files:

- `scripts/seo/internal-link-audit.mjs` — new audit command
- `package.json` — `seo:links` script
- `.seo-cache/drift.json` — ignored machine baseline

The crawler must:

1. start from canonical sitemap URLs;
2. fetch rendered HTML without Playwright;
3. classify links as `body`, `breadcrumb`, `header`, `nav`, `footer`, or `cta` using DOM ancestry;
4. normalize host, query, fragment, trailing slash, and redirects;
5. record source URL, target URL, anchor text, DOM region, HTTP status, indexability, canonical, and word count;
6. compute shortest crawl depth from `/` using body and hub-card links;
7. count distinct inbound body sources per target;
8. flag generic anchors such as “learn more”, “click here”, “read more”, bare URLs, and repeated exact-match stuffing;
9. output JSON plus a concise Markdown failure table.

Acceptance:

- baseline contains all 17 indexable URLs;
- current weak-source counts are reproduced or explicitly explained;
- sitewide navigation links do not satisfy body-source thresholds.

### W1 — Add the typed registry and extend reused components

Files:

- `src/lib/fairlend-internal-links.ts`
- `src/components/FairlendFeedbackContentPage/index.tsx`
- `src/components/FairlendPathHub/index.tsx`

Acceptance:

- every configured destination is a canonical internal path;
- links render as server-visible `<a href>` elements;
- labels remain descriptive without requiring adjacent UI text;
- keyboard/focus styling uses the existing component styles;
- no duplicated link-card component is introduced.

### W2 — Repair the two weak targets first

Files:

- `src/app/(frontend)/garden-suite-financing-gta/page.tsx`
- `src/app/(frontend)/garden-suite/page.tsx`
- `src/app/(frontend)/affordable-sustainable-rental-housing/page.tsx`
- `src/app/(frontend)/multiplex-financing-gta/page.tsx`
- `src/app/(frontend)/construction-draw-financing/page.tsx`
- `src/app/(frontend)/borrowers/page.tsx`

Acceptance:

- `/garden-suite` has at least three distinct contextual inbound sources;
- `/affordable-sustainable-rental-housing` has at least three distinct contextual inbound sources;
- every garden-suite anchor clearly distinguishes financing from eligibility;
- reciprocal links are used only when both directions help a reader make the next decision.

### W3 — Connect the remaining commercial and trust nodes

Files:

- homepage deferred section component
- private mortgage section files
- institutional mortgage section files
- `/investing` and `/investing/private-mortgage-lending`
- `/disclosures`
- `/partners`
- `/posts`

Acceptance:

- every non-exempt indexable commercial URL has at least three contextual inbound source pages;
- each edited long-form page stays within 3–5 useful internal links per approximately 1,000 words;
- no page relies exclusively on navigation, breadcrumbs, footer links, or generic CTAs.

### W4 — Wire the resource cluster

Files:

- Posts collection schema and generated Payload types
- post renderer
- existing related-post component
- commercial-page resource queries

Acceptance:

- every published post links to exactly one primary commercial pillar in body content;
- every published post links to 1–3 relevant siblings when siblings exist;
- every pillar links back to its published resources;
- draft, deleted, redirected, and noindex posts never appear in modules.

### W5 — Validate and accept the drift baseline

Run after deployment:

```bash
pnpm seo:links --base-url https://www.fairlend.ca
```

Store in `.seo-cache/drift.json`:

```json
{
  "internal_links": {
    "captured_at": "ISO-8601",
    "indexable_urls": 17,
    "edges": [],
    "inbound_body_sources": {},
    "crawl_depth": {},
    "generic_anchors": [],
    "broken_internal_links": []
  }
}
```

Final hard gates:

- zero broken internal links;
- zero canonical targets reached through a redirect;
- zero generic anchors in M2 additions;
- commercial pillars and spokes at crawl depth 2 or less;
- resource posts at crawl depth 3 or less;
- every non-exempt indexable URL has at least three distinct inbound body sources;
- `/garden-suite` and `/affordable-sustainable-rental-housing` each have at least three;
- the accepted graph is written to the drift baseline.

## Intentional exceptions

Exceptions must live in the typed registry with a reason; they cannot be silently ignored.

| URL class | Reason |
|---|---|
| `/terms` | Narrow legal utility page; contextual support comes from `/disclosures` plus global legal navigation |
| `/en/brokerage/privacy-policy` | Narrow privacy utility page; contextual support comes from `/disclosures`, consent surfaces, and global legal navigation |
| `/contact` | Conversion utility page with contextual CTAs throughout the site; evaluate CTA sources separately from editorial body sources |
| `/intake` and parameter variants | Intentionally noindex and outside the indexable-URL threshold |
| `/posts/page/{n}` | Intentionally noindex archive pagination |

No commercial service, hub, investor, partner, disclosure, or resource page may be exempted.

## Rollout order

1. W0 baseline crawler and current graph.
2. W1 registry and component extensions.
3. W2 weak-target repair.
4. W3 remaining commercial/trust cross-links.
5. Re-run the local rendered-HTML crawl and correct failures.
6. Deploy.
7. W4 activates automatically as M3 resources publish.
8. Run the production crawl and accept W5 drift baseline.

No Playwright, E2E suite, or production build is required for this work. Validation is rendered-HTML crawling, TypeScript, targeted ESLint, and `git diff --check`, matching the project’s marketing-page constraints.

## Definition of done

M2 is complete only when the production crawl—not the source matrix—passes every hard gate, the resource mechanics are deployed, and the production link graph is stored as the accepted drift baseline.
