import type { ReactElement } from 'react'

import { FaqAccordion, type FaqGroup } from './FaqAccordion.client'

import './investor-faq.css'

const faqGroups: readonly FaqGroup[] = [
  {
    id: 'risk-protection',
    items: [
      {
        answer:
          'No — not bank deposits, not CDIC-insured, not guaranteed, and may not be liquid on demand. What we provide is bank-level process discipline: documented underwriting, registered security, administration, payment tracking, reporting, and recovery support.',
        id: 'risk-bank',
        question: 'Is this like putting money in a bank account?',
      },
      {
        answer:
          'The six-layer framework: deal rejection, double valuation, conservative LTVs, AI-assisted and human-led verification, mortgage security with a power-of-sale path, and a dedicated legal recovery team. These reduce and manage risk; they do not eliminate it.',
        id: 'risk-protected',
        question: 'What protects my capital?',
      },
      {
        answer:
          'No. Private mortgage investing involves borrower, property, market, legal, liquidity, and recovery risk. Our entire model is built around managing that risk — conservative LTV, real valuation, security, and a recovery team — not around promising it away.',
        id: 'risk-guaranteed',
        question: 'Are returns guaranteed?',
      },
      {
        answer:
          'Private mortgages solve needs banks handle inefficiently: speed, bridge timing, construction, complex but real income, or non-standard files. Higher income potential compensates for private-credit risk, shorter terms, illiquidity, and complexity.',
        id: 'risk-rate',
        question: 'Why are rates higher than bank products?',
      },
    ],
    title: 'Risk & protection',
  },
  {
    id: 'money-movement',
    items: [
      {
        answer:
          'Our administration layer runs PAD collection from borrowers and automated disbursements to you, with servicing, renewals, payouts, reporting, and default escalation — all visible in your portal and exportable for taxes and QuickBooks.',
        id: 'money-payments',
        question: 'Who handles payments and my disbursements?',
      },
      {
        answer:
          'Not a daily-liquid product. Expect capital committed for the term unless a payout, sale, transfer, or other permitted exit occurs. The portal always shows the current status and term.',
        id: 'money-liquid',
        question: 'How liquid is it?',
      },
      {
        answer:
          'Yes. You review the full deal package — property, mortgage position, LTV, valuation support, borrower profile, term, fees, risks, security, and the recovery plan — before your capital moves.',
        id: 'money-review',
        question: 'Can I review the deal before investing?',
      },
      {
        answer:
          'Depends on the opportunity: whole, syndicated, fractional, first, second, construction-backed, or future MIC where appropriate. We describe only what currently ships and never overstate availability.',
        id: 'money-structure',
        question: 'Individual mortgages or pooled?',
      },
    ],
    title: 'How money moves',
  },
  {
    id: 'process-regulation',
    items: [
      {
        answer:
          'Appraisal review plus a double-valuation process where appropriate, with local GTA comparables — so the LTV is grounded in market reality, not optimistic assumptions.',
        id: 'process-value',
        question: 'How do you know the value is real?',
      },
      {
        answer:
          'Loan-to-value is the mortgage amount against the property value. A lower LTV means more equity cushion beneath your position; it does not remove all risk.',
        id: 'process-ltv',
        question: 'What does LTV mean?',
      },
      {
        answer:
          'We administer, track, communicate with the investor, and follow a defined default-response process. If the situation is not cured, we coordinate legal enforcement, including power of sale where applicable.',
        id: 'process-default',
        question: 'What if a borrower misses payments?',
      },
      {
        answer:
          'FairLend operates as a mortgage brokerage and mortgage administrator in Ontario. Relevant licence information and documentation are provided during investor onboarding.',
        id: 'process-regulated',
        question: 'Is FairLend regulated?',
      },
    ],
    title: 'Process & regulation',
  },
]

/**
 * Section 13 — FAQ / Objection Handling (Concept A, grouped accordion).
 *
 * Three groups — Risk & protection, How money moves, Process & regulation — to
 * keep a long answer bank scannable. First question opens by default to show
 * the pattern. Compliance copy locked from the plan's Appendix A5.
 */
export function FairlendInvestorFaq(): ReactElement {
  return (
    <section
      aria-labelledby="investor-faq-title"
      className="investor-faq"
      data-investor-faq
    >
      <div className="investor-faq__inner">
        <header className="investor-faq__header">
          <p className="investor-faq__eyebrow">FAQ</p>
          <h2 className="investor-faq__title" id="investor-faq-title">
            Straight answers to the questions investors ask first.
          </h2>
        </header>

        <FaqAccordion groups={faqGroups} />
      </div>
    </section>
  )
}
