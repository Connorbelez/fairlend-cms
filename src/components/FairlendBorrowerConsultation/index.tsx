import type { ReactElement } from 'react'
import { Phone } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

import { ConsultationForm } from './ConsultationForm.client'
import './borrower-consultation.css'

const reassuranceBullets: readonly { label: string; detail: string }[] = [
  {
    label: 'A real mortgage specialist reviews it.',
    detail: 'Credit, income, equity, deadlines, and exit options are considered together.',
  },
  {
    label: 'Costs before commitment.',
    detail:
      'Rate, fees, lender conditions, payout terms, and the repayment path are discussed before signing.',
  },
  {
    label: 'Complex situations are welcome.',
    detail:
      'Bank declines, renewals, second mortgages, bridge needs, and equity access are handled plainly.',
  },
]
const borrowerSpecialistIntakeHref = buildFairlendIntakeHref({
  intent: 'mortgage',
  source: 'borrower-specialist-cta',
})

/**
 * Section 9 — Final CTA (consultation form).
 *
 * Two-column close: left = headline + reassurance, right = bordered paper
 * panel with the consultation form. The form posts to the existing `/api/leads`
 * route handler with `source: 'borrowers-page'`, so the lead appears in the
 * Payload admin Operations group. Copy locked from the section breakdown.
 */
export function FairlendBorrowerConsultation(): ReactElement {
  return (
    <section
      aria-labelledby="borrower-consultation-title"
      className="borrower-consultation"
      data-borrower-consultation
      id="consultation"
    >
      <div className="borrower-consultation__inner">
        <div className="borrower-consultation__copy">
          <p className="borrower-consultation__kicker">Free consultation</p>
          <h2 className="borrower-consultation__title" id="borrower-consultation-title">
            Get your private mortgage options before the deadline.
          </h2>
          <p className="borrower-consultation__body">
            Facing a renewal problem, closing deadline, debt pressure, equity need, or bank decline?
            FairLend reviews your property, balance, timeline, costs, risks, and exit plan before
            recommending a move.
          </p>

          <ul className="borrower-consultation__reassurance">
            {reassuranceBullets.map((bullet) => (
              <li className="borrower-consultation__reassurance-item" key={bullet.label}>
                <span aria-hidden="true" className="borrower-consultation__reassurance-mark" />
                <span className="borrower-consultation__reassurance-copy">
                  <strong>{bullet.label}</strong>
                  <span>{bullet.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="borrower-consultation__support">
            You leave with a clearer answer, the terms to watch, and the next step to act on.
          </p>

          <div className="borrower-consultation__specialist">
            <FairlendBorrowerCta
              href={borrowerSpecialistIntakeHref}
              label="Speak With a Mortgage Specialist"
              size="md"
              variant="secondary"
            />
            <span className="borrower-consultation__phone">
              <Phone aria-hidden="true" size={14} strokeWidth={1.75} />
              <span>Prefer a call? We will route your request to a specialist.</span>
            </span>
          </div>
        </div>

        <div className="borrower-consultation__form-panel" data-borrower-form-panel>
          <ConsultationForm />
        </div>
      </div>
    </section>
  )
}
