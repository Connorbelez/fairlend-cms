# Audit: money-page-plan.md

**Audited:** July 21, 2026 · **Scope:** the plan as a base for copywriting, checked against `research.md`, `competitors.md`, `content.md`, `archive/money-page-copy.md`, and landing-page/conversion criteria.
**Overall verdict:** Strong base — internally rigorous, evidence-disciplined, and correctly wired to the corpus. Ship-blocking issues: **1 self-contradiction (H1)** and **1 requirements gap (government programs)**. Structural risks: no length budget, evidence-dependency load, and comparison-table neutrality.

---

## Executive summary

1. **The H1 violates the plan's own keyword rule.** Section 4 and the Section 21 definition-of-done require `garden suite financing Toronto` in the H1. The specified H1 — `Garden Suite Financing Built Around Your Project` — drops "Toronto." The prior copy pass (`archive/money-page-copy.md`) had it right: "Garden Suite Financing in Toronto…". Fix before copywriting starts. (Severity: high, trivial to fix.)
2. **Government incentive programs are missing from the page.** `content.md` requires the financing comparison to include "currently verified public programs," and the corpus question bank includes `question-suite-federal-loan-status` and `question-suite-incentive-verification`. The plan's Section 13 table (cash/HELOC/refinance/second/DrawFlow) has no program row, and none of the 20 FAQs covers federal secondary-suite loans or Toronto's forgivable-loan program. Competitor and forum content covers these; visitors will ask. (Severity: high — content gap vs. the plan's own source basis.)
3. **No rendered-length budget.** The archive plan targeted 2,600–3,400 words. The new plan specifies 21 sections + 20 FAQs with no length target — realistically 4,500+ words. That collides with the stated goal of a scannable conversion page and is the classic wall-of-text failure mode. (Severity: medium-high.)
4. **The keyword bet is unmeasured — the plan should say so louder.** `research.md`: "No measured query combining suite and financing was returned, so exact financing demand remains unavailable." Section 4 assigns P0/P1 priorities that read like validated demand. The prioritization is a reasonable inference, but the plan should carry the research caveat forward so the 30/56/90-day KPI reviews are interpreted as demand *discovery*, not underperformance. (Severity: medium, framing only.)
5. **Sixteen claim families need evidence packages before launch.** The plan handles this correctly (claim ledger + Section 13 gate, differentiators locked), but as a copywriting base it means the first draft will carry many placeholders. Triage which evidence packages are launch-critical vs. which sections can soften to capability language at v1 — otherwise the gate becomes an indefinite blocker. (Severity: medium, schedule risk.)

## What's solid (keep, don't relitigate)

- **Cannibalization contract (S2)** matches `content.md`'s final IA exactly: one transactional canonical, resource hub owns informational intent, `/garden-suite` 301s, no thin Laneway route. Route-decision history conflicts are resolved consistently.
- **Evidence discipline (S3, S13, S21)** — the claim ledger, "do not invent search volume," and the demonstrated-maximum framing of the 50% claim are exactly right for a regulated YMYL page.
- **Belief-sequence framework (S7)** is a legitimate conversion-psychology spine (relevance → relief → authority → mechanism → economics → control → confidence → action), and each stage has assigned proof.
- **Banned-language list** (no "one stop shop," no vague "flexibility," no unproved "fast/easy") directly answers the corpus's `claim-one-stop-end-to-end` flag.
- **Layout variety is specified, not left to chance**: timeline (S3), engine diagram (S6), two-sided value prop (S7), static HTML tables (S8, S13), workspace UI (S9), checklist (S12, S17). The wall-of-text risk is length, not shape.
- **Laneway handling (S16 + dedicated H2/H3 rule)** respects the research requirement to never collapse the two terms.
- **Technical/analytics/privacy specs (S14, S16, S17)** are complete and correctly scoped (no FAQPage promise, no PII in events).

## Findings and required changes

### F1 — H1 keyword contradiction (fix in plan)
**Where:** S5 metadata vs. S4 placement rules vs. S21 DoD.
**Fix:** `Garden Suite Financing in Toronto, Built Around Your Project` (or restore the archive H1 pattern). Keep "Built Around Your Project" — the differentiation angle is good; it just can't cost the geo term.

### F2 — Government programs gap (add to plan)
**Where:** S13 comparison table, S15, S20 FAQ.
**Fix:** Add one row to the S13 table — `Government programs (verify current status)` — with the same equivalent-assumption treatment and a hard rule: name a program only with a current official source and visible `last reviewed` date (the plan already applies this pattern to CMHC in S15). Add two FAQs: "Is there a federal loan program for building a garden suite?" and "Does Toronto offer forgivable loans or incentives for garden suites?" Both answers link to the resource hub for current status rather than hard-coding program terms. This keeps the money page authoritative without taking on unstable program maintenance.

### F3 — Length budget (add to plan)
**Fix:** Restore an explicit target: ~3,000–3,800 rendered words for the 21 sections, FAQ answers ≤60 words each, per-section body ≤120 words outside the FAQ/table content. State that tables, checklists, and diagram labels do the explaining wherever possible. Without this, 21 mandated sections will each grow a paragraph.

### F4 — Demand caveat (one-line addition)
**Fix:** In S4, above the keyword table, add: "Transactional financing-query volume is unmeasured in the corpus (see research.md); priorities reflect intent-fit inference, not measured demand. Treat 30/56/90-day query discovery as validation."

### F5 — Comparison-table neutrality (soften in plan)
**Where:** S13. DrawFlow's "key limitation" ("requires disciplined milestone evidence") reads as a humble-brag next to the other routes' real costs. The plan itself mandates "do not present a single product as universally superior."
**Fix:** Give DrawFlow at least one honest limitation in kind — e.g., "setup and evidence workflow take longer than a simple upfront advance; best suited to staged builds, not small gaps." This buys credibility for the 50%/$12k claims two sections earlier.

### F6 — Claim-repetition dilution (monitor, not change)
The 15-draw / 50% / $12k trio appears in the hero strip, S8, S19, and FAQ — four placements. S19's "consolidate, not introduce" rule is the right control; enforce it during copywriting by making S19 reference-style (link back to S8's methodology anchors) rather than restating figures a fourth time with fresh wording.

### F7 — Dual primary CTAs (decide before copy)
Hero uses `Plan My Garden Suite Project`; final CTA uses `Request My Project Assessment`; content.md suggested `Get a project financing assessment`. The CRO backlog tests this (item 2), but v1 should ship one primary verb phrase in both positions and let the test change it later. Two different primary CTAs on one page reads as two different offers.

### F8 — No cost anchor anywhere on the money page (consider)
The SERP this page lives near is dominated by cost content ($235k–$550k ranges on 8+ ranking pages). The cannibalization contract correctly sends cost research to the resource hub, but the money page's S14 discusses cost *categories* with zero dollar context. One dated, sourced sentence ("Toronto garden suites commonly run $300K–$400K+ all-in — see our cost model") with the S10 anchor link satisfies the visitor's first question without cannibalizing. The corpus benchmark ($300K–$400K+, permit-record median $180K/avg $260K) is already in `research.md`.

## Base-readiness checklist

| Check | Status |
|---|---|
| IA / route ownership consistent with content.md | ✅ |
| Keyword spec internally consistent | ⚠️ F1 (H1) |
| Required sections cover content.md's required list | ⚠️ F2 (programs) |
| Conversion psychology framework present and proof-mapped | ✅ |
| Scannability protected | ⚠️ F3 (no length budget) |
| Claims evidence-gated, YMYL-safe | ✅ (F5 minor) |
| CTAs coherent | ⚠️ F7 |
| Compliance/legal gates defined | ✅ |
| Measurement plan sound | ✅ (apply F4 framing) |
| Sources traceable, no invented data | ✅ |

**Recommendation:** Apply F1–F4 (and decide F7) as a small plan revision before drafting copy. F5, F6, F8 can be handled during copywriting. Nothing here requires re-research; the base is good.
