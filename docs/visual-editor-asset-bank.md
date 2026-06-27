# Visual Editor Asset Bank

This project uses `components.json` with the shadcn registry plus community registries for building reusable page sections and visual-editor-ready blocks.

## Registry Survey

| Registry | Result | Notes |
| --- | --- | --- |
| `@shadcn` | Added primitives | Best source for stable UI foundations used by CMS blocks and section components. Added every clean primitive that did not overwrite local UI files. |
| `@efferd` | Added section blocks and preserved variants | Strongest fit for page-builder sections. All 196 indexed items were attempted. 98 generated reusable files, 6 were dependency-only/empty, and 92 were token-gated or failed. Preserved variants live under `src/components/registry-assets/efferd`. |
| `@watermelon` | Added dashboard/page blocks and preserved variants | Strong fit for app-style visual editor sections, admin surfaces, finance workflows, and dashboard page layouts. All 18 indexed blocks were checked. 17 generated reusable assets; `workflow-management-dashboard` failed because its registry dependency `@shadcn/combobox` resolves to a missing shadcn item for this project style. Preserved blocks live under `src/components/registry-assets/watermelon`. |
| `@evilcharts` | Added chart components | Useful for finance/lending metric sections and dashboards. |
| `@ncdai` | Added content and motion sections | Added team, social links, text flip, glow grid, scroll fade, and dot-grid spotlight. `metrics-01` was rejected because its large chart stack failed this repo's React compiler lint rules. |
| `@react-bits` | Added logo loop | Useful as a motion primitive for social proof and partner sections. |
| `@coss` | Explored, not added | Mostly primitive demos and form/control examples; useful later for admin/editor controls, less valuable as page sections. |
| `@eldoraui` | Blocked by missing dependency item | Several blocks depend on `@shadcn/marquee`, which resolves to a missing registry item for this project style. |
| `@kokonutui` | Added creative components | Added flip/stack cards, typewriter/dynamic text, and background effects. `bento-grid` was rejected because it failed this repo's React compiler lint rules. |
| `@kibo-ui` | Explored, no indexed items returned | Existing project already has `src/components/kibo-ui/marquee`. |
| `@magicui` | Explored, no indexed items returned | MCP registry listing returned no items for this config. |
| `@reui` | Blocked | Registry index failed at `https://reui.io/r/new-york-v4/registry.json`. |

## Added Primitives

The following shadcn primitives were added under `src/components/ui`:

- `accordion`
- `alert`
- `aspect-ratio`
- `avatar`
- `badge`
- `dialog`
- `navigation-menu`
- `progress`
- `radio-group`
- `scroll-area`
- `separator`
- `sheet`
- `skeleton`
- `slider`
- `switch`
- `tooltip`
- `field`
- `breadcrumb`
- `collapsible`
- `context-menu`
- `drawer`
- `dropdown-menu`
- `empty`
- `hover-card`
- `input-otp`
- `kbd`
- `menubar`
- `popover`
- `resizable`
- `sonner`
- `spinner`
- `table`
- `toggle`
- `toggle-group`
- `chart`
- `input-group`
- `item`
- `sidebar`
- Efferd support utilities: `grid-pattern`, `infinite-slider`, `progressive-blur`

Skipped direct primitive installs that would overwrite existing local files: `alert-dialog`, `button-group`, `calendar`, `command`, and `carousel`. `chart`, `input-group`, `item`, and `sidebar` were generated in a temp project and copied in without overwriting local primitives. `native-select` resolved to a missing registry item for this project style.

## Added Sections And Components

The reusable section/component assets now available under `src/components` include:

- `FeatureSection` from `src/components/feature-section.tsx`
- `FaqsSection` from `src/components/faqs-page.tsx`
- `TestimonialsSection` from `src/components/testimonials-section.tsx`
- `LogoCloud` from `src/components/logo-cloud.tsx`
- `BlogsSection` from `src/components/blogs-section.tsx`
- `ImageGallery` from `src/components/image-gallery.tsx`
- `CallToAction` from `src/components/cta.tsx`
- `ContactSection` from `src/components/contact-section.tsx`
- `LogoLoop` from `src/components/LogoLoop.tsx`
- `LineChart` from `src/components/evilcharts/charts/line-chart.tsx`
- `BarChart` from `src/components/evilcharts/charts/bar-chart.tsx`
- `Footer` from `src/components/footer.tsx`
- `Integrations` from `src/components/integrations.tsx`
- `Team01` from `src/components/team-01.tsx`
- `SocialLinks01` from `src/components/social-links-01.tsx`
- `TextFlip` from `src/components/text-flip.tsx`
- `GlowCardGrid` from `src/components/glow-card-grid.tsx`
- `ScrollFadeEffect` from `src/components/scroll-fade-effect.tsx`
- `DotGridSpotlight` from `src/components/dot-grid-spotlight.tsx`
- Kokonut creative assets under `src/components/kokonutui`: `card-flip`, `card-stack`, `type-writer`, `dynamic-text`, `background-paths`, and `beams-background`.

Supporting chart primitives live in `src/components/evilcharts`.

## Preserved Efferd Variants

Efferd free variants often write to generic filenames such as `feature-section.tsx`, `logo-cloud.tsx`, and `contact.tsx`. To avoid clobbering the active components, those variants are preserved under `src/components/registry-assets/efferd`.

The Efferd bank currently contains 99 top-level folders and 344 TypeScript/TSX files:

- `app-shell`: 5 variants
- `auth`: 6 variants/support folders
- `blogs`: 3 variants
- `contact`: 5 variants
- `cta`: 5 variants
- `dashboard`: 5 variants
- `faqs`: 3 variants
- `features`: 6 variants
- `footer`: 6 variants
- `header`: 3 variants
- `hero`: 3 variants
- `integrations`: 5 variants
- `logo-cloud`: 5 variants
- `not-found`: 1 variant
- `pricing`: 4 variants
- `testimonials`: 6 variants
- `support`: 28 support component/icon/helper folders

Several generated Efferd files needed repo-specific compatibility fixes:

- Rewrote intra-Efferd imports so preserved variants point at local or Efferd-bank support files instead of clobber-prone top-level component names.
- Added missing generated support for `custom-sidebar-trigger` and `desktop-nav` in the affected header/hero/app-shell variants.
- Normalized non-local shadcn API assumptions such as `Button` sizes, `DropdownMenuItem variant`, sidebar collapsible values, and chart wrapper typings.
- Removed React compiler lint failures from generated lazy image, portal, and random animation helpers.

Efferd items checked but not added:

- Paid/token-gated or failed: 92 items, including many later `hero`, `features`, `cta`, `pricing`, `testimonials`, `logo-cloud`, `footer`, `integration`, `dashboard`, `header`, and `contact` variants.
- Dependency-only or no reusable component emitted in this project shape: 6 items.

## Preserved Watermelon Blocks

Watermelon is mostly complete dashboard and operations UI. These blocks were preserved under `src/components/registry-assets/watermelon` instead of being promoted directly into `src/components`, because they are larger page-level assets with their own nested support files.

The Watermelon bank currently contains 17 top-level block folders and 155 TypeScript/TSX files:

- `business-management`
- `business-operations-dashboard`
- `e-commerce-dashboard`
- `erp-dashboard`
- `hero1`
- `hrm`
- `incident-management`
- `invoice-generator-dashboard`
- `invoice-manager-dashboard`
- `issue-tracking`
- `lead-dashboard`
- `mail-dashboard`
- `meetings-dashboard`
- `payment-operations-dashboard`
- `project-management-dashboard`
- `sales-dashboard`
- `task-management-dashboard`

Watermelon support dependencies added to the project:

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`
- `@tabler/icons-react`

Several generated Watermelon files needed repo-specific compatibility fixes:

- Replaced React Router path reads with `next/navigation` where generated sidebars assumed `react-router-dom`.
- Normalized unsupported local primitive API assumptions: `SelectTrigger size`, `Button size="icon-xs"`, `Button size="icon-sm"`, `DropdownMenuItem variant="destructive"`, `TabsList variant`, `DialogContent showCloseButton`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, and `PaginationLink href`.
- Added a missing local `invoiceData` fixture for `invoice-manager-dashboard`, because the generated block imported `./data` without emitting the file.
- Converted one generated random chart-height helper to deterministic values so React compiler lint stays clean.
- Escaped generated demo copy where JSX text would otherwise fail lint.

Watermelon items checked but not added:

- `workflow-management-dashboard`: failed generation because `@shadcn/combobox` resolves to `https://ui.shadcn.com/r/styles/default/combobox.json`, which is not available for this project style.

## Notes For Payload Blocks

- Treat these as section assets first. Wire them into Payload block schemas only after deciding the editable field shape for each section.
- Use the existing `src/blocks` pattern when turning one into an editor block: `config.ts` for fields and `Component.tsx` for rendering.
- Preserve project-local shadcn primitives. The registry wanted to refresh `button`, `card`, `dialog`, `input`, `label`, `separator`, and `textarea`; those were left intact because they already had local worktree changes.
- Replace demo copy and remote demo images/logos before exposing these sections to content editors.
