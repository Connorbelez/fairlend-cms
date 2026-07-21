# FairLend SEO money-page block manifest

Here, **money page** uses the SEO meaning: a commercial-intent page designed to rank for a valuable query and convert qualified traffic. This catalog turns Payload Pages and Posts into those brand-native, conversion-oriented pages without code changes. It follows the root landing page’s Toronto Financing Field Guide system: continuous paper rails, monochrome ink evidence, restrained topographic material, and electric lime used only for routes, verified state, focus, and conversion.

## Authoring modes

- **Pages**: all money-page blocks are available in the existing `layout` builder. Set the standard Page hero to `None` when `Money page hero` supplies the page H1.
- **Posts · Article**: preserves the existing Post hero and 48rem Tailwind Typography article body.
- **Posts · SEO money page**: suppresses the standard Post hero and renders the new full-width `moneyPageLayout` builder. Existing Posts remain Article mode by default.

Every money-page block owns its spacing and responsive layout. Do not wrap these sections in a generic prose width or add universal vertical margins between them.

## Shared presentation controls

Every block exposes:

- `anchor`: validated URL-fragment ID for deep linking.
- `surface`: landing paper, white dossier, or ink field.
- `texture`: one of the root-approved paper-gutter materials.
- `spacing`: compact, standard, or immersive rhythm.
- `systemLabel`: optional factual label; it must identify a real route, file, decision, or technical system.
- Payload media relationships, captions, rich text, actions, and repeatable evidence fields appropriate to the block.

Assets use the existing Payload Media collection, focal-point crops, generated sizes, Blob-safe URLs, captions, and accessible alt text. Video variants also expose a poster asset and user-controlled or muted ambient playback.

## Block families and variants

### 1. Money page hero

The opening thesis and sole H1 when the generic Page/Post hero is disabled.

- `Route field`: Z-pattern claim + topographic/image evidence.
- `Split dossier`: claim + deal-file proof panel.
- `Media statement`: cinematic image/video with a disciplined paper title field.

Fields: route/service label, H1/H2 semantic choice, heading, summary, up to four proof points, two actions, desktop media, optional mobile crop, evidence caption.

### 2. Narrative section

The Tailwind Typography workhorse for high-intent explanatory copy.

- `Field note`: focused long-form body with marginal note.
- `Split brief`: F-pattern explanation + takeaway.
- `Pull quote`: thesis-led editorial break with supporting prose.

Fields: heading, intro, narrative rich text, takeaway/pull-quote copy, one action.

### 3. Media split

Use adjacent split blocks in alternating directions to create a deliberate Z-path. Do not alternate isolated sections arbitrarily.

- `Image left · content right`
- `Image right · content left`
- `Image above · wide evidence plate`
- `Video left · content right`
- `Video right · content left`

Fields: heading, intro, rich text, up to five evidence points, two actions, image/video upload, poster image, playback mode, caption.

### 4. Feature and benefit section

Explains mechanisms and benefits without an identical icon-card grid.

- `Alternating evidence`: art-directed Z-pattern rows.
- `Route ledger`: connected financing paths.
- `Underwriting index`: dense, ruled evidence list.

Each item exposes a route code, title, rich text, optional evidence asset, concise proof, and one action.

### 5. Process section

Only use when order is meaningful; generated numbers encode the actual sequence.

- `Topographic route`: horizontal journey that stacks cleanly.
- `Z-pattern stages`: alternating stage/evidence sequence.
- `Deal file`: compact technical dossier sequence.

Each step exposes a title, explanation, deliverable/decision, and optional asset.

### 6. Proof section

Place proof immediately after the mechanism or claim it substantiates.

- `Case file`: client/project story + outcomes.
- `Testimony dossier`: quote, portrait, source, outcomes.
- `Verified outcomes`: evidence-led result ledger.

Fields: quote, named source, portrait/project asset, up to five contextual outcomes, one action. Use verifiable facts; avoid unexplained vanity metrics.

### 7. Comparison section

Uses a semantic HTML table with keyboard-scrollable overflow, row headers, column headers, and a redundant “Likely fit” state.

- `Fit check`: who the route is and is not for.
- `Route comparison`: side-by-side financing paths.
- `Decision matrix`: detailed criteria table.

Fields: two to four columns, repeatable criteria, ordered cell values, recommended-column state, one action.

### 8. Progressive disclosure section

Core offer and eligibility information must remain outside disclosure. Use these interactions for depth, comparison, and scenario-specific detail.

- `Accordion`: scan, then expand.
- `Evidence tabs`: compare related views.
- `Decision path`: guided scenario selector.

Each panel exposes label, heading, rich text, state/fit signal, optional media, and one action. All panel content is server-rendered; interaction changes presentation only.

### 9. Money page FAQ

- `Route map`: expansive, topographic FAQ field.
- `Compact ledger`: dense question index.

Fields: visible question/answer pairs, initial-open control, and optional `FAQPage` JSON-LD. Disable structured data when another FAQ schema source already exists on the route.

### 10. Money page CTA

- `Application desk`: decisive conversion panel.
- `Expert route`: consultation-led close.
- `Split contact`: action + trust evidence.

Fields: heading, intro, body, two actions, optional trust/project asset, trust notes, regulatory/qualification disclosure.

## Recommended persuasion sequences

### Commercial service page

1. Hero · Route field
2. Proof · Verified outcomes
3. Narrative · Split brief
4. Process · Topographic route
5. Proof · Case file
6. Alternating image/video splits
7. Comparison · Fit check
8. Progressive disclosure · Decision path
9. FAQ · Route map
10. CTA · Application desk

### Local SEO page

1. Location-specific hero
2. Local narrative with explicit service area and problem framing
3. Media split with local property/map evidence
4. Progressive disclosure with common local scenarios
5. Process route
6. Local case file
7. Fit comparison
8. Visible local FAQ with structured data
9. Expert-route CTA

### Comparison page

1. Hero · Split dossier
2. Above-fold semantic comparison
3. Methodology narrative
4. Route ledger
5. Scenario tabs
6. Case-file proof
7. Objection-handling FAQ
8. Application CTA

### Educational guide with commercial intent

1. Hero · Media statement
2. Field-note narrative
3. Wide annotated media
4. Deal-file process
5. User-controlled video + caption
6. Mid-page expert-route CTA
7. Progressive disclosure for advanced detail
8. FAQ
9. Application CTA

## Psychology and layout rules

- Match the search intent and concrete outcome before introducing company claims.
- Explain the mechanism before asking the visitor to believe the result.
- Place proof immediately after the mechanism it validates.
- Qualify fit before handling objections.
- Offer a conversion action after the first credible proof and again at the close.
- Use Z-pattern layouts for high-intent thesis/media sections, F-patterns for explanation, and explicit alternation only across adjacent media splits.
- Progressive disclosure is for optional depth, not essential comprehension.
- Keep every primary heading, answer, comparison cell, and route result in the server-rendered document.

## SEO, semantics, and accessibility

- Use exactly one H1. Money-page sections use H2, with repeated items at H3.
- Keep existing Payload SEO title, description, image, preview, canonical, draft, scheduling, and revalidation workflows.
- Use validated anchors for internal jump links and relationship-backed CMS links for internal routes.
- FAQ JSON-LD is generated only from visible FAQ content when enabled.
- Standard Posts continue to emit `BlogPosting`; commercial service/location pages should ordinarily use the Pages collection.
- Body copy remains at least 16px with a 65–72ch measure and AA contrast.
- Controls provide visible focus, keyboard semantics, and practical 44px+ touch targets.
- Motion reveals route, evidence, or state; content is visible by default and `prefers-reduced-motion` removes movement.
- Lime is never paragraph text or a decorative full-section fill.
