# Schema and Structured Data Implementation

Date: July 14, 2026  
Target: `https://www.fairlend.ca`  
Status: source implementation complete; deployed-URL validation remains post-deploy

## Outcome

The structured-data layer now emits a connected entity graph instead of isolated schema objects. All 17 source-controlled routes in the static sitemap receive a stable `WebPage` node or the more specific `ContactPage` subtype. CMS pages and published posts receive the same treatment through their shared route templates.

The implementation resolves the schema recommendations from the audit:

- stable `@id` values for organization, website, people, webpages, breadcrumbs, services, and articles;
- every page belongs to the `WebSite` through `isPartOf` and describes FairLend through `about`;
- service pages connect `WebPage.mainEntity` to the route's `Service` node;
- post pages connect `WebPage.mainEntity` and `BlogPosting.mainEntityOfPage` in both directions;
- post authors come from Payload's public `populatedAuthors` field and receive individual `Person` nodes;
- Elie Soberano resolves to one principal-broker `Person` entity whether referenced as founder, reviewer, or CMS author;
- the principal-broker entity includes the licence credential already displayed on the site;
- review relationships are emitted only on pages that visibly render the “Reviewed by Elie Soberano” panel;
- breadcrumbs now have stable IDs that their page nodes can reference;
- contact, legal, resource-hub, path-hub, homepage, service, CMS page, and article templates are covered centrally.

## Entity graph

| Node | Stable ID pattern | Key relationships |
|---|---|---|
| Organization + FinancialService | `/#organization` | founder, contact point, licences, area served |
| WebSite | `/#website` | publisher → Organization |
| Principal broker | `/#elie-soberano` | worksFor → Organization, credential → FSRA |
| WebPage | `{canonical}#webpage` | isPartOf → WebSite, about → Organization |
| BreadcrumbList | `{canonical}#breadcrumb` | referenced by WebPage |
| Service | `{canonical}#service` | provider → Organization, main entity of WebPage |
| BlogPosting | `{canonical}#article` | publisher → Organization, author → Person/Organization, mainEntityOfPage → WebPage |

## Deliberate exclusions

- No ratings, reviews, offers, prices, storefront address, or other unsupported commercial claims were added.
- No `ProfilePage` claim was added because FairLend does not currently publish a dedicated author profile route.
- No reviewer relationship is emitted for content that does not visibly identify a reviewer.
- No page schema was added to `noindex` pagination, search, or intake/funnel routes.
- Existing FAQ markup remains semantic markup only; this implementation does not claim broad Google FAQ rich-result eligibility.

## Verification

- Targeted ESLint: pass.
- Prettier check: pass.
- `git diff --check`: pass.
- Production-origin TypeScript execution of representative Organization, Website, Person, WebPage, ContactPage, BreadcrumbList, Service, and BlogPosting nodes: pass.
- JSON serialization and parse: pass.
- Graph reference audit: 13 representative nodes, 0 unresolved `@id` references.
- Static sitemap coverage review: 17 of 17 source-controlled indexable routes covered.
- Repository restriction observed: no build, Playwright, E2E, or test suite was run for these marketing-page changes.

The final live checks must run after deployment because the current public URLs do not contain these source changes. Validate representative homepage, reviewed service, contact, and article URLs with the [Schema.org Markup Validator](https://validator.schema.org/) and validate article/breadcrumb eligibility with Google's [Rich Results Test](https://search.google.com/test/rich-results). Google's current Article guidance recommends explicit author, date, headline, and image data; this implementation supplies those values when present in Payload. See [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) and [Schema.org reviewedBy](https://schema.org/reviewedBy).

## Design-hook review

An automated design hook reported three existing token findings in `src/app/(frontend)/globals.css`. This schema task does not change that stylesheet or introduce visual design values, so those findings were classified as unrelated and left unsuppressed.
