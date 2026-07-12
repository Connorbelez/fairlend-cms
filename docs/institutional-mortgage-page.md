# Institutional Mortgage Landing Page

## Route

`/borrowers/institutional-mortgage`

The route is a static marketing page implemented in:

- `src/app/(frontend)/borrowers/institutional-mortgage/page.tsx`
- `src/app/(frontend)/borrowers/institutional-mortgage/institutional-mortgage.css`

The homepage route selector links directly to this page.

## Design intent

The page follows the root FairLend design system in `DESIGN.md`: paper fields, monochrome Toronto
and institutional imagery, technical document rules, Cormorant narrative typography, Inter body
copy, and electric lime used only for action, route, focus, and verified state.

The section sequence is deliberately varied:

1. Toronto underwriting cover sheet with embedded intake.
2. Four-part institutional lender-fit worksheet.
3. Dark decline-diagnosis register.
4. Annotated term-sheet comparison document.
5. Topographic lender-matching route.
6. Institutional-versus-private decision table.
7. Institutional mortgage FAQ and final intake action.

## Reused intake component

The page reuses `FairlendLeadIntake` with `mortgageProduct="institutional"`. The default remains
`mortgageProduct="private"`, preserving every existing caller that omits the prop.

Institutional mode has its own:

- local-storage draft key;
- financing-objective and application-status questions;
- property, value, mortgage-position, income-documentation, credit-range, and timing questions;
- per-step validation and UX copy;
- success-state messaging;
- `mortgageProduct: "institutional"` lead metadata; and
- originating page metadata.

The mode deliberately maps answers onto the existing lead intake payload fields, so it does not
require an API or database schema migration.

## Content and compliance guardrails

- No approval, rate, or funding guarantee is made.
- Rate is presented as one term among amortization, prepayment, fees, conditions, and timing.
- A bank decline is framed as a diagnostic input, not proof of eligibility elsewhere.
- Institutional and private mortgages are treated as different cost-and-risk decisions.
- The form explicitly states that submission is not an approval or financing commitment.
