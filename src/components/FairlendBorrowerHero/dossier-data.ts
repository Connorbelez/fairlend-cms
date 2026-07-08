export type BorrowerDossierRow = {
  /** Short field label on the dossier, e.g. "Property value". */
  label: string
  /** Plain-language description of what FairLend reviews under that field. */
  detail: string
  /** Marks the rows that pin the page's exit-first thesis; rendered with a lime marker. */
  emphasis?: boolean
  /**
   * When true (default), non-emphasis rows beyond `rowsToShowOnMobile` are
   * hidden on small screens to keep the dossier scannable. Emphasis rows
   * (e.g. Exit path) are always shown.
   */
  hiddenOnMobile?: boolean
}

/**
 * Hero dossier rows. The dossier reads like a private mortgage file opened in
 * front of the borrower; the goal is to make the "important economics visible
 * before signing" promise concrete on first paint. Order matters: it walks from
 * property → current position → need → cost → payout → maturity → exit.
 */
export const borrowerDossierRows: readonly BorrowerDossierRow[] = [
  {
    detail: 'Detached home, multiplex, or residential property in Ontario.',
    label: 'Property value',
  },
  {
    detail: 'Existing first, second, or registered charge against title.',
    label: 'Current mortgage position',
  },
  {
    detail: 'First, second, bridge, renewal, or equity-based structure.',
    label: 'Amount needed',
  },
  {
    detail: 'Rate, fees, administration, and closing discussed plainly.',
    label: 'Total cost and fees',
  },
  {
    detail: '$0 payout fees where applicable — leaving is not punished.',
    // COMPLIANCE: approved wording. Fallback if not approved: "Payout terms discussed before you commit."
    label: 'Payout terms',
  },
  {
    detail: 'Term length, payment structure, and renewal considerations.',
    label: 'Maturity plan',
  },
  {
    detail: 'Refinance, sale, or stabilization — reviewed before funding.',
    emphasis: true,
    label: 'Exit path',
  },
]

export const borrowerHeroProofPoints: readonly string[] = [
  // COMPLIANCE: approved wording. Fallback if not approved: "A clear answer quickly once the file is complete."
  'Target 3-day commitment on complete private mortgage files',
  'First, second, bridge, renewal, and equity-based structures',
  // COMPLIANCE: approved wording. Fallback: "Payout terms discussed before you commit."
  '$0 payout fees where applicable',
  'Material mortgage economics discussed before signing',
  // COMPLIANCE: approved wording. Fallback: "Led by experienced GTA mortgage professionals."
  'GTA mortgage professionals with decades of experience',
]

export const borrowerHeroComplianceQualifier =
  'Commitments are subject to file completeness, borrower cooperation, underwriting, property review, appraisal requirements, available capital, and lender fit.'
