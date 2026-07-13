import type { ReactElement } from 'react'

import { ALIGNED_INTERESTS, ETHOS_COPY, type AlignedInterest } from '../content'
import { AlignmentPaletteMotion } from './AlignmentPaletteMotion.client'

const INTEREST_PALETTE_THEMES = ['ivory', 'electric-lime', 'builder-blueprint', 'ivory'] as const

type InterestPaletteTheme = (typeof INTEREST_PALETTE_THEMES)[number]

type InterestLedgerEntryProps = {
  interest: AlignedInterest
  paletteTheme: InterestPaletteTheme
}

function InterestLedgerEntry({ interest, paletteTheme }: InterestLedgerEntryProps): ReactElement {
  const headingId = `fairlend-ethos-interest-${interest.code}`

  return (
    <li className="fairlend-ethos__interest-row" data-ethos-palette-theme={paletteTheme}>
      <article aria-labelledby={headingId} className="fairlend-ethos__interest-entry">
        <div className="fairlend-ethos__interest-heading">
          <span className="fairlend-ethos__interest-code">{interest.code}</span>
          <h4 id={headingId}>{interest.audience}</h4>
        </div>

        <p className="fairlend-ethos__interest-copy">{interest.copy}</p>

        <ul
          aria-label={`${interest.audience} alignment fields`}
          className="fairlend-ethos__interest-fields"
        >
          {interest.fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>

        <p className="fairlend-ethos__interest-status">
          <span aria-hidden="true" />
          Interest aligned
        </p>
      </article>
    </li>
  )
}

export function AlignedInterestsBlock(): ReactElement {
  return (
    <section
      aria-labelledby="fairlend-ethos-alignment-title"
      className="fairlend-ethos__alignment"
      data-ethos-block="alignment"
      data-ethos-alignment-palette
      data-palette-theme="ivory"
      id="ethos-aligned-interests"
    >
      <AlignmentPaletteMotion />

      <div className="fairlend-ethos__alignment-spine">
        <div className="fairlend-ethos__alignment-spine-meta">
          <span>01 / Shared mortgage file</span>
          <span>Four parties / One outcome</span>
        </div>
        <h3 id="fairlend-ethos-alignment-title">{ETHOS_COPY.alignmentHeading}</h3>
        <p className="fairlend-ethos__alignment-filing-note">
          The mortgage works when nobody has to lose for someone else to win.
        </p>
      </div>

      <ol className="fairlend-ethos__interest-ledger">
        {ALIGNED_INTERESTS.map((interest, index) => (
          <InterestLedgerEntry
            interest={interest}
            key={interest.audience}
            paletteTheme={INTEREST_PALETTE_THEMES[index] ?? 'ivory'}
          />
        ))}
      </ol>
    </section>
  )
}
