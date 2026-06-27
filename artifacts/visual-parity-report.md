# Fairlend Mobile Landing Page — Visual Parity Report

**Reference:** `/var/folders/cj/7fm1l9_s0554hg50mym_n8xr0000gn/T/images/Codex 2026-06-20 20.10.03.png`  
**Test screenshot:** `/Users/connor/Dev/fairlend-cms/artifacts/mobile-390.png` (390×844 viewport, device-scale-factor 2)  
**Date:** 2026-06-20

## Summary

The refactored mobile landing page at `http://localhost:3000/` matches the reference image closely. Layout order, component presence, typography, colors, and element positioning all align with the reference. A few minor differences remain, mostly around icon choice and exact absolute-position offsets of overlay cards.

## Section-by-section comparison

### 1. Header / navbar

| Element           | Reference                                        | Current                    | Status |
| ----------------- | ------------------------------------------------ | -------------------------- | ------ |
| FAIRLEND wordmark | Left, large bold serif                           | Left, large bold serif     | Match  |
| Tagline           | "BROKERAGE & INVESTMENT COMPANY" stacked 2 lines | Same, 2 lines              | Match  |
| CTA button        | Orange "GET IN TOUCH" pill                       | Orange "GET IN TOUCH" pill | Match  |
| Menu              | Hamburger icon far right                         | Hamburger icon far right   | Match  |
| Background        | Frosted glass rounded bar                        | Frosted glass rounded bar  | Match  |

**Note:** At viewports slightly wider than the reference (~480px) the navbar still fits without overflow after the latest sizing adjustments.

### 2. Hero map + overlays

| Element       | Reference                                                      | Current                              | Status |
| ------------- | -------------------------------------------------------------- | ------------------------------------ | ------ |
| Base image    | 3D isometric Toronto map                                       | `/mobileHero.png`                    | Match  |
| Route line    | Orange animated path with halo nodes                           | Orange animated path with halo nodes | Match  |
| Map labels    | NORTH YORK, SCARBOROUGH, etc.                                  | Same labels visible                  | Match  |
| Process cards | 3 desktop-style cards: Permit 1, Acquisition 2, Construction 3 | Same 3 cards with orange badges      | Match  |
| Goal card     | Bottom-right "Your Goal Multiplex + Garden Suite"              | Same text, bottom-right              | Match  |

**Minor differences:**

- The Construction card in the reference sits a little lower and slightly further right relative to Acquisition than in the current build.
- The goal-card icon in the reference appears to be a custom house glyph; the current build uses the `Building2` Lucide icon. The visual meaning is the same.

### 3. Hero copy

| Element               | Reference                                                                                  | Current               | Status |
| --------------------- | ------------------------------------------------------------------------------------------ | --------------------- | ------ |
| Headline              | "Multi-plex, single family, land Financing"                                                | Identical             | Match  |
| Accent color          | "Financing" in orange                                                                      | "Financing" in orange | Match  |
| Subheadline           | "Fairlend is more than a lender. We're with you from planning to completion. (and beyond)" | Identical             | Match  |
| Accent in subheadline | "(and beyond)" in orange                                                                   | Same                  | Match  |

### 4. CTA row

| Element       | Reference                                    | Current                             | Status |
| ------------- | -------------------------------------------- | ----------------------------------- | ------ |
| Primary CTA   | Dark "GET STARTED" button with right arrow   | Dark button, same text + arrow      | Match  |
| Secondary CTA | Outlined "TALK TO AN EXPERT" with phone icon | Outlined button, same text + icon   | Match  |
| Layout        | Two equal-width buttons side-by-side         | Two flex-equal buttons side-by-side | Match  |

### 5. Application form

| Element              | Reference                                                          | Current                | Status |
| -------------------- | ------------------------------------------------------------------ | ---------------------- | ------ |
| Tabs                 | Build (active/orange), Invest, Get a mortgage                      | Same                   | Match  |
| Active tab indicator | Orange text + top pill                                             | Orange text + top pill | Match  |
| Heading              | "Start your application"                                           | Same                   | Match  |
| Input                | Location pin + "Enter your property address" + orange arrow submit | Same                   | Match  |

### 6. Stats strip

| Element | Reference                                                                                            | Current                       | Status |
| ------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- | ------ |
| Layout  | 4-column row, icon above text                                                                        | 4-column row, icon above text | Match  |
| Labels  | 25+ years of experience; 28+ in lifetime deals; Proudly based in Toronto; End-to-end lending partner | Same labels after text update | Match  |

## Overall verdict

**Match quality: ~95%**

The remaining 5% consists of:

1. Exact pixel offsets of the Construction process card and goal card (minor).
2. Custom vs. stock icon for the goal card (cosmetic).
3. Slight differences in map cropping due to `object-fit: cover` vs. the reference artboard.

No structural or functional discrepancies remain. The page renders correctly at the target mobile viewport (390px) and remains usable up to the 560px mobile breakpoint.
