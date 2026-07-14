import type { ReactElement } from 'react'
import { Landmark, Scale, ShieldCheck } from 'lucide-react'

import { comparisonRows } from './data'

export function FitDecision(): ReactElement {
  return (
    <section className="im-decision" aria-labelledby="im-decision-title">
      <div className="im-decision__lead">
        <h2 id="im-decision-title">Institutional mortgage or private bridge?</h2>
        <p>
          These are different tools. The right route depends on what the file supports today, the
          deadline, the cost, and whether a credible transition exists.
        </p>
      </div>
      <div
        className="im-decision__table"
        role="table"
        aria-label="Institutional and private mortgage comparison"
      >
        <div className="im-decision__row im-decision__row--head" role="row">
          <span role="columnheader">Decision field</span>
          <strong role="columnheader">
            <Landmark aria-hidden="true" /> Institutional
          </strong>
          <strong role="columnheader">
            <ShieldCheck aria-hidden="true" /> Private bridge
          </strong>
        </div>
        {comparisonRows.map(([field, institutional, privateRoute]) => (
          <div className="im-decision__row" role="row" key={field}>
            <span role="rowheader">{field}</span>
            <p data-label="Institutional" role="cell">
              {institutional}
            </p>
            <p data-label="Private bridge" role="cell">
              {privateRoute}
            </p>
          </div>
        ))}
      </div>
      <aside className="im-decision__note">
        <Scale aria-hidden="true" />
        <p>
          <strong>Start with the permanent outcome.</strong> If an institutional mortgage is not
          available today, any interim financing should be evaluated against a specific route out.
        </p>
      </aside>
    </section>
  )
}
