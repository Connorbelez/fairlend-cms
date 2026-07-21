# Rental property acquisition and refinance intake

The existing-rental cards on the homepage share the mortgage intake route while selecting a
dedicated `rental-property` wizard:

- Acquisition: `/construction-financing?intent=mortgage&source=landing-overview-acquisition-existing-rental-properties`
- Refinance: `/construction-financing?intent=mortgage&source=landing-overview-refinancing-existing-rental-properties`

The header's **Financing → Refinancing & acquisitions** column exposes both branches with
header-specific attribution:

- Acquisition: `/construction-financing?intent=mortgage&source=header-nav-acquisition-existing-rental-properties`
- Refinance: `/construction-financing?intent=mortgage&source=header-nav-refinancing-existing-rental-properties`

The source preselects the transaction but does not lock it. Acquisition and refinance drafts use
separate local-storage keys so a saved file from one homepage card cannot override the other.

## Captured intake data

The five-step flow captures:

1. Transaction, ownership/title status, and expected ownership structure.
2. Address, rental property type, residential unit count, and occupancy.
3. Requested proceeds, purchase price or current value, current mortgage balance for refinances,
   other lenders/liens/encumbrances, and optional capital-stack detail.
4. Gross monthly rent, financing timeline, and optional file context.
5. Required name, email, and phone number.

The public lead request keeps using `POST /api/leads`. The new values live in the existing flexible
`intake` JSON payload, with `mortgageProduct: "rental-property"`; no parallel endpoint or lead table
is introduced. The admin normalizer also recognizes the wizard's `currentMortgage` and
`additionalLienDetails` fields for table-ready mortgage balance and intake-summary data.

## Regression coverage

- `tests/int/fairlend-intake.int.spec.ts` covers source-to-transaction routing.
- `tests/int/fairlend-lead-intake-component.int.spec.tsx` completes and submits both branches.
- `tests/int/fairlend-leads.int.spec.ts` covers admin normalization for rental-property refinance
  debt and encumbrances.
