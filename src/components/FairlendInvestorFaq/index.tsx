import type { ReactElement } from 'react'

import { FaqAccordion, type FaqGroup } from './FaqAccordion.client'

import './investor-faq.css'

const faqGroups: readonly FaqGroup[] = [
  {
    id: 'risk-protection',
    items: [
      {
        answer:
          'No — not bank deposits, not CDIC-insured, not guaranteed, and may not be liquid on demand. What we provide is bank-level process discipline: documented underwriting, legal documentation, administration, payment tracking, reporting, and recovery support.',
        id: 'risk-bank',
        question: 'Is this like putting money in a bank account?',
      },
      {
        answer:
          'Deal rejection, valuation review, conservative LTVs, human-led verification, mortgage documentation, administration, and an available legal recovery path can reduce and manage risk; they do not eliminate it. Principal and payments can be delayed, impaired, or lost. FairLend does not guarantee capital preservation, payment, recovery, or valuation accuracy. You remain responsible for your diligence and for independent legal, financial, tax, and appraisal advice.',
        id: 'risk-protected',
        question: 'What protects my capital?',
      },
      {
        answer:
          'No. Private mortgage investing involves borrower, valuation, market, legal, liquidity, and recovery risk. Our entire model is built around managing that risk — conservative LTV, valuation review, documented terms, and a recovery team — not around promising it away.',
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
          'Yes. You review the full deal package — project details, mortgage position, LTV, valuation support, borrower profile, term, fees, risks, legal documentation, and the recovery plan — before your capital moves.',
        id: 'money-review',
        question: 'Can I review the deal before investing?',
      },
      {
        answer:
          'Depends on the opportunity: whole, syndicated, fractional, first, second, construction financing, or future MIC where appropriate. We describe only what currently ships and never overstate availability.',
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
          'FairLend reviews available appraisals, valuation support, and relevant Southern Ontario comparables where appropriate. Valuation is an estimate, can change, and is not guaranteed. Investors remain responsible for assessing value and obtaining any independent appraisal advice they require.',
        id: 'process-value',
        question: 'How do you know the value is real?',
      },
      {
        answer:
          'Loan-to-value compares the mortgage amount with the reviewed valuation. A lower LTV can reduce some risk exposure; it does not remove borrower, valuation, market, legal, liquidity, or recovery risk.',
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
      id="investor-faq"
    >
      <div className="investor-faq__inner">
        <header className="investor-faq__header">
          <h2 className="investor-faq__title" id="investor-faq-title">
            Straight answers to the questions investors ask first.
          </h2>
        </header>

        <FaqAccordion groups={faqGroups} />
      </div>
    </section>
  )
}
