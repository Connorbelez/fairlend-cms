# Payload Page Builder Blocks And Heroes Playbook

## Current Inventory

### Pages

Pages use two separate extension points:

- `src/heros/config.ts` defines the `hero` group. Current selectable types are `none`, `highImpact`, `mediumImpact`, `lowImpact`, and `watermelonHero1`.
- `src/collections/Pages/index.ts` defines the page layout builder at `layout`, a Payload `blocks` field. Current layout blocks are `CallToAction`, `Content`, `MediaBlock`, `Archive`, and `FormBlock`.

Rendering is also split:

- `src/heros/RenderHero.tsx` maps `hero.type` to a React hero component.
- `src/blocks/RenderBlocks.tsx` maps each layout block `blockType` to a React block component.

### Posts

Posts do not use the shared page hero group. `src/collections/Posts/index.ts` has a `heroImage` upload and rich text `content`. The frontend renders this through `src/heros/PostHero/index.tsx`.

Post body blocks live inside Lexical rich text, not the page layout builder. The allowed post content blocks are configured through `BlocksFeature({ blocks: [Banner, Code, MediaBlock] })` in `src/collections/Posts/index.ts`, then rendered through the block converters in `src/components/RichText/index.tsx`.

That means adding a block to Pages does not automatically add it to Posts, and adding a Lexical block to Posts does not automatically add it to the page layout drawer.

## Add A Page Layout Block

1. Search before building.
   Use the shadCN MCP first when the block is visual/UI-heavy. If a suitable registry block or existing local component exists, adapt it instead of rebuilding it from scratch.

2. Create the Payload block config.
   Add `src/blocks/YourBlock/config.ts` exporting a `Block` with:
   - stable `slug`
   - `interfaceName`
   - editor-facing fields
   - optional `labels`, `admin.group`, or `images.thumbnail` for better drawer UX

3. Create or adapt the renderer.
   Add `src/blocks/YourBlock/Component.tsx`. Reuse primitives under `src/components/` and existing block/component patterns. Handle relationship/upload fields defensively because Payload may return either IDs or populated objects depending query depth.

4. Surface it in Pages.
   Import the block config in `src/collections/Pages/index.ts` and add it to the `layout.blocks` array.

5. Wire the renderer.
   Import the component in `src/blocks/RenderBlocks.tsx` and add a `blockType` map entry whose key exactly matches the Payload block `slug`.

6. Regenerate types.
   Run `pnpm generate:types`. Commit the resulting `src/payload-types.ts` changes.

7. Verify.
   Run targeted lint on changed files, `pnpm exec tsc --noEmit --pretty false`, and `pnpm build` when the change affects rendered app behavior.

## Add A Post Rich Text Block

1. Create/reuse the same `Block` config and renderer.

2. Import the block config into `src/collections/Posts/index.ts`.

3. Add it to the Lexical `BlocksFeature({ blocks: [...] })` list.

4. Update `src/components/RichText/index.tsx`.
   Add a converter under `blocks` using the block slug as the key. Without this, the editor can store the block but the frontend will not render it.

5. Regenerate types and verify.

## Add A Page Hero Type

1. Add a new option in `src/heros/config.ts`.
   Use a stable `value`; that value is stored in content and becomes the key used by `RenderHero`.

2. Add conditional fields only if the hero needs its own controls.
   Put type-specific fields in a conditional group such as:

   ```ts
   {
     name: 'yourHero',
     type: 'group',
     admin: {
       condition: (_, { type } = {}) => type === 'yourHero',
     },
     fields: [...]
   }
   ```

3. Add a renderer under `src/heros/YourHero/index.tsx`.
   If it uses hooks, browser APIs, or motion state, add `'use client'`. If it changes the header contrast, use `useHeaderTheme()` like the existing high-impact hero.

4. Register it in `src/heros/RenderHero.tsx`.
   The key must equal the select option value.

5. Regenerate Payload types and verify.

## Add Hero Types To Posts

Posts currently have no hero type selector. To support post hero variants, add a new post hero field in `src/collections/Posts/index.ts` and either:

- make `PostHero` branch on that field, or
- introduce a `RenderPostHero` mapping that mirrors `RenderHero`.

Do not assume page hero types apply to posts. They are separate content models today.

## Watermelon Hero 1 Test Implementation

Tested workflow:

1. Queried the shadCN MCP registries and found `@watermelon/hero1`.
2. Installed it with `pnpm dlx shadcn@latest add @watermelon/hero1`.
3. Adapted the installed component instead of recreating it:
   - `src/components/watermelon/blocks/hero1/hero1.tsx`
   - `src/components/watermelon/blocks/hero1/ui/Header.tsx`
   - `src/components/watermelon/blocks/hero1/ui/Hero.tsx`
4. Added `watermelonHero1` to the Payload hero type select in `src/heros/config.ts`.
5. Added conditional Watermelon settings for prompt, mode, depth, voice, and submit labels.
6. Added `src/heros/WatermelonHero1/index.tsx` to map Payload `richText`, `links`, and settings into the Watermelon component.
7. Registered the hero in `src/heros/RenderHero.tsx`.
8. Regenerated `src/payload-types.ts`.

Verification run:

- `pnpm generate:types`
- `pnpm exec eslint src/heros/config.ts src/heros/RenderHero.tsx src/heros/WatermelonHero1/index.tsx src/components/watermelon/blocks/hero1/hero1.tsx src/components/watermelon/blocks/hero1/ui/Header.tsx src/components/watermelon/blocks/hero1/ui/Hero.tsx`
- `pnpm exec tsc --noEmit --pretty false`
- `pnpm build`

Full `pnpm lint` is currently blocked by an unrelated existing error in `src/components/ui/ink-reveal.tsx`.

## Watermelon Registry Bulk Extraction

Current extracted Watermelon registry inventory:

- 39 Watermelon UI hero sections from `@watermelon/hero-1` through `@watermelon/hero-39`.
- 17 non-hero Watermelon registry blocks exposed as page layout blocks under the `Watermelon layouts` admin group.

Implementation notes:

- The original `watermelonHero1` from `@watermelon/hero1` is preserved.
- Watermelon UI hero sections use `watermelonHeroSection1` through `watermelonHeroSection39` to avoid colliding with `watermelonHero1`.
- `src/heros/WatermelonRegistryHero/index.tsx` maps the 39 hero select values to the installed registry components.
- `src/blocks/WatermelonLayouts/config.ts` defines the 17 Payload body layout blocks.
- `src/blocks/WatermelonLayouts/Component.tsx` maps those layout block slugs to the installed Watermelon demos.
- `@watermelon/workflow-management-dashboard` currently references a stale upstream `combobox` registry dependency, so its first-party files were extracted directly from `https://registry.watermelon.sh/r/workflow-management-dashboard.json` and wired manually.
- Imported registry demo files are marked `// @ts-nocheck` so registry-local prop variants do not force changes into shared shadcn primitives.

Editable page-builder contract:

- Watermelon hero sections share the `hero.watermelonHeroSection` group, which exposes editable eyebrow, brand label, headline, accent text, description, CTAs, nav items, proof points, feature cards, and upload fields for background, foreground, logo, and card media.
- Watermelon layout blocks share a generated block field set with editable eyebrow, heading, description, theme, CTAs, primary media, secondary media, metrics, and item/card repeaters with item-level media.
- `src/heros/WatermelonRegistryHero/index.tsx` and `src/blocks/WatermelonLayouts/Component.tsx` intentionally render from Payload fields instead of importing registry demos directly. The registry demo components remain available as source references, but direct demo rendering can crash preview because some demos assume router/provider context and hard-coded assets.
- All 17 Watermelon layout blocks have generated `Watermelon*Block` and `Watermelon*BlockSelect` interfaces in `src/payload-types.ts`.

## Gotchas

- Pages and Posts have different block systems in this repo. Pages use a top-level `layout` blocks field; Posts use Lexical `BlocksFeature`.
- Payload stores the block `slug` as `blockType`. Renaming a block slug breaks existing content unless you migrate stored JSON.
- `interfaceName` controls generated TypeScript names. Add it to new blocks so `src/payload-types.ts` stays readable.
- Every new or changed Payload field needs `pnpm generate:types`.
- A block config only changes the admin/data model. You still need a frontend renderer.
- A frontend renderer only changes display. You still need to add the block config to the correct collection field.
- Lexical blocks need two registrations: `BlocksFeature` for the editor and `RichText` converters for frontend rendering.
- `admin.condition` is admin UI logic. Do not rely on it for access control or as a complete validation model.
- Required fields hidden by `admin.condition` can become awkward for alternate variants. Prefer optional variant-specific fields plus renderer fallbacks unless the field is always required for every variant where it appears.
- Upload and relationship fields can be IDs or populated objects. Always guard before rendering.
- Registry components often need cleanup: add `'use client'`, fix aliases, remove hard-coded demo content, replace manual SVGs with the project icon library, review dependencies, and check accessibility.
- Avoid duplicating global site chrome inside a hero. Many registry heroes include demo nav/header components that should be optional in this app.
- Custom admin components require import map updates; ordinary frontend render components usually do not.
- Build and typecheck can modify generated cache files such as `tsconfig.tsbuildinfo`; keep that out of meaningful review diffs when possible.

## References

- Payload Blocks Field: https://payloadcms.com/docs/fields/blocks
- Payload Rich Text overview: https://payloadcms.com/docs/rich-text/overview
- Payload Lexical official features, including `BlocksFeature`: https://payloadcms.com/docs/rich-text/official-features
- Payload Fields overview and conditional logic: https://payloadcms.com/docs/fields/overview
