import type { ReactElement } from 'react'

import type { BorrowerDossierRow } from './dossier-data'

/**
 * The hero's right-hand "borrower dossier": a semantic mortgage-file panel
 * rendered as labelled hairline rows. Decorative SVG line work (a quiet
 * detached-home motif) sits behind it. The dossier turns the page thesis
 * ("important economics visible before signing") into the visual object.
 *
 * Pure presentational component — no client state. Rows come in from data so
 * the CMS / compliance can edit without touching markup.
 */
export function BorrowerDossier({
  rows,
  rowsToShowOnMobile = 4,
}: {
  rows: readonly BorrowerDossierRow[]
  rowsToShowOnMobile?: number
}): ReactElement {
  return (
    <div className="borrower-dossier" data-borrower-dossier>
      {/* Decorative detached-home line motif. aria-hidden; purely atmospheric. */}
      <svg
        aria-hidden="true"
        className="borrower-dossier__motif"
        fill="none"
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Roof */}
        <path
          d="M40 92 L160 32 L280 92"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        {/* Walls */}
        <path d="M64 84 L64 168 L256 168 L256 84" stroke="currentColor" strokeWidth="1" />
        {/* Door */}
        <path d="M140 168 L140 124 L172 124 L172 168" stroke="currentColor" strokeWidth="1" />
        {/* Windows */}
        <path d="M88 108 L120 108 L120 134 L88 134 Z" stroke="currentColor" strokeWidth="1" />
        <path d="M200 108 L232 108 L232 134 L200 134 Z" stroke="currentColor" strokeWidth="1" />
        {/* Ground line */}
        <path d="M16 168 L304 168" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="borrower-dossier__head" data-borrower-dossier-head>
        <span className="borrower-dossier__stamp">Private mortgage options</span>
        <span className="borrower-dossier__file">Reviewed before you commit</span>
      </div>

      <p className="borrower-dossier__summary">
        See whether your equity, timeline, and exit support a private mortgage before you sign.
      </p>

      <dl className="borrower-dossier__rows">
        {rows.map((row, index) => (
          <div
            className="borrower-dossier__row"
            data-borrower-dossier-row
            data-borrower-dossier-row-emphasis={row.emphasis ? 'true' : undefined}
            data-borrower-dossier-row-index={index}
            // Hide the less-critical middle rows on small screens to keep the
            // dossier readable; the exit path is always visible.
            hidden={row.hiddenOnMobile ? index >= rowsToShowOnMobile : undefined}
            key={row.label}
          >
            <dt className="borrower-dossier__label">
              {row.emphasis && <span aria-hidden="true" className="borrower-dossier__marker" />}
              {row.label}
            </dt>
            <dd className="borrower-dossier__detail">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
