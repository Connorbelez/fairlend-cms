export type BorrowerDossierRow = {
  /** Short field label on the dossier, e.g. "Property value". */
  label: string
  /** Plain-language description of what FairLend reviews under that field. */
  detail: string
  /** Marks the rows that pin the page's exit-first thesis; rendered with a lime marker. */
  emphasis?: boolean
  /**
   * When true, this row is hidden on small screens to keep the dossier
   * scannable. Rows beyond `rowsToShowOnMobile` are also hidden by default.
   * Emphasis rows (e.g. Exit path) are always shown.
   */
  hiddenOnMobile?: boolean
}

export type BorrowerHeroProofPoint = {
  /** Short proof label used in the hero strip. */
  label: string
  /** Compliance-reviewed proof copy. */
  detail: string
}

export const borrowerHeroDecisionPoints: readonly string[] = [
  'Can it work?',
  'What will it cost?',
  'How fast can it close?',
  'How do I get out?',
]

/**
 * Hero dossier rows. The dossier reads like a private mortgage file opened in
 * front of the borrower; the goal is to make the "important economics visible
 * before signing" promise concrete on first paint. Order matters: it walks from
 * property → current position → need → cost → payout → maturity → exit.
 */
export const borrowerDossierRows: readonly BorrowerDossierRow[] = [
  {
    detail: 'Your property value and available equity are checked against the amount you need.',
    label: 'Available equity',
  },
  {
    detail: 'Your current first, second, or registered charge shapes what can fit behind it.',
    label: 'Current mortgage',
  },
  {
    detail:
      'First, second, bridge, renewal, or equity-based options are matched to the reason you need funds.',
    hiddenOnMobile: true,
    label: 'Best-fit option',
  },
  {
    detail: 'Rate, fees, administration, and closing costs are discussed in plain language.',
    label: 'Expected cost',
  },
  {
    detail: 'Low payout fees where applicable, so leaving for better financing is not punished.',
    label: 'Payout terms',
  },
  {
    detail:
      'Term length, payment structure, and renewal considerations are set out before closing.',
    hiddenOnMobile: true,
    label: 'Term plan',
  },
  {
    detail: 'Refinance, sale, renewal, or stabilization is reviewed before funding.',
    emphasis: true,
    label: 'Exit path',
  },
]

export const borrowerHeroProofPoints: readonly BorrowerHeroProofPoint[] = [
  {
    detail: 'Target 24-hour commitment on complete private mortgage files.',
    // COMPLIANCE: approved wording. Fallback if not approved: "A clear answer quickly once the file is complete."
    label: 'Fast answer target',
  },
  {
    detail: 'First, second, bridge, renewal, and equity-based structures reviewed.',
    label: 'Options compared',
  },
  {
    detail: 'Low payout fees where applicable.',
    label: 'Payout terms',
  },
  {
    detail: 'Material mortgage economics discussed before signing.',
    label: 'Costs upfront',
  },
  {
    detail: 'Led by experienced GTA mortgage professionals.',
    // Exact principal-broker years / volume claims require approved attribution before publishing.
    label: 'Local review',
  },
]

export const borrowerHeroComplianceQualifier =
  'Commitments are subject to file completeness, borrower cooperation, lender review, property review, appraisal requirements, available capital, and lender fit.'
