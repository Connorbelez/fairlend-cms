# Blog author attribution

Every Payload post publishes the same author and freshness signals in visible content and structured data.

## Editorial requirements

1. Complete the author profile under **Users** with a public name, official title, and mini bio.
2. Assign at least one author in the post sidebar. The relationship is required for every draft and release.
3. Use `publishedAt` as the original release date. Payload preserves the first value when a draft is published.
4. The post `updatedAt` timestamp is shown as the update date and emitted as `dateModified` in structured data.

The mini bio should be concise, factual, relevant to the subject, and no more than 320 characters. Titles and credentials must match the author’s current public role.

## Rendering and schema

- Standard articles show the author name plus release/update dates in the hero and the complete author attribution after the article body.
- SEO money-page posts show the complete author attribution after their block content.
- Each complete human author is emitted as a Schema.org `Person` with `name`, `jobTitle`, `description`, and `worksFor`.
- Each post is emitted as a `BlogPosting` with `datePublished`, `dateModified`, and references to its author entities.
- A legacy post with no complete human profile receives an explicit FairLend Mortgage organization attribution. Editors should replace that fallback by completing and assigning the responsible human author.

## Deployment

Migration `20260720_120000_blog_author_attribution` adds the author profile columns and backfills the known FairLend leadership profiles. Run registered Payload migrations as part of the normal deployment before editors save the new fields.
