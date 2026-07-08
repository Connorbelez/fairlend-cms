'use client'

import type { ReactElement } from 'react'
import { HelpCircle, ShieldAlert } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import './borrower-faq.css'

type FaqItem = {
  id: string
  question: string
  answer: string
}

type FaqGroup = {
  title: string
  items: readonly FaqItem[]
}

const faqGroups: readonly FaqGroup[] = [
  {
    title: 'Fit and process',
    items: [
      {
        answer:
          'It depends on the property, equity, current mortgage, amount needed, payment capacity, timeline, costs, and exit path. FairLend reviews those pieces together so you can see whether private financing solves the problem or creates a bigger one.',
        id: 'fit',
        question: 'Is a private mortgage right for me?',
      },
      {
        answer:
          'FairLend targets a 24-hour application-to-commitment path for complete private mortgage files. Timing depends on complete information, borrower cooperation, property review, appraisal requirements, lender review, available capital, and lender fit.',
        id: 'timing',
        question: 'How fast can I get an answer?',
      },
      {
        answer:
          'The first review looks at your property, timeline, current mortgage, available equity, amount needed, likely costs, payout considerations, and exit path. After that, FairLend can tell you what documents are needed for a clearer answer.',
        id: 'review',
        question: 'What happens in the free review?',
      },
      {
        answer:
          'Often, yes. Bruised credit, self-employment, irregular income, or a bank decline do not automatically end the conversation. Approval is never automatic, though. Equity, property value, payment capacity, documentation, timing, and a realistic exit still matter.',
        id: 'credit-income',
        question: 'Can bruised credit or non-traditional income work?',
      },
      {
        answer:
          'No. Responsible private mortgage financing still requires lender review, documentation, property review, valuation, lender fit, available capital, and a realistic repayment or exit path.',
        id: 'approval',
        question: 'Do you guarantee approval?',
      },
    ],
  },
  {
    title: 'Cost, fees, and exit',
    items: [
      {
        answer:
          'You should expect a plain-language discussion of the full cost picture: rate, broker or lender fees, administration charges, renewal considerations, payout terms, default charges, closing costs, material conditions, and material risks.',
        id: 'fees',
        question: 'What fees should I expect?',
      },
      {
        answer:
          'Where the structure allows it, FairLend works to keep payout fees low so leaving for better financing is not treated as the expensive option. Either way, payout terms should be understood before you commit.',
        id: 'payout',
        question: 'Are there payout fees?',
      },
      {
        answer:
          'You should know the material mortgage economics before closing. The commitment should disclose rate, fees, term, payment structure, payout terms, renewal considerations, default charges, material conditions, and material risks. Third-party legal, appraisal, registration, government, and closing costs may still apply where relevant.',
        id: 'legal-docs',
        question: 'Will legal documents include fees I did not see in the commitment?',
      },
      {
        answer:
          'An exit strategy is the realistic plan for what happens at maturity: refinance, sale, renewal, income stabilization, credit repair, debt cleanup, construction completion, or another defined path. It should be discussed before funding, not when the term is about to expire.',
        id: 'exit',
        question: 'What is an exit strategy?',
      },
      {
        answer:
          'Support can continue through digital closing workflows, PAD payment collection, servicing, renewals, payouts, borrower coordination, and administration. The goal is practical communication after funding, not a disappearing broker experience.',
        id: 'after-closing',
        question: 'What happens after closing?',
      },
    ],
  },
]

/**
 * Section 8 - FAQ / objections.
 *
 * The hard answers live here: no guaranteed approval, timing qualifiers, total
 * cost, legal document economics, payout terms, and exit strategy.
 */
export function FairlendBorrowerFaq(): ReactElement {
  return (
    <section aria-labelledby="borrower-faq-title" className="borrower-faq" data-borrower-faq>
      <div className="borrower-faq__inner">
        <div className="borrower-faq__header">
          <p className="borrower-faq__kicker">Hard answers</p>
          <h2 className="borrower-faq__title" id="borrower-faq-title">
            Questions to ask before taking private money.
          </h2>
          <p className="borrower-faq__intro">
            Private mortgage financing should be understood before it is signed. Start here, then
            bring your property, deadline, current mortgage, and amount needed to the consultation.
          </p>
        </div>

        <div className="borrower-faq__content">
          <div className="borrower-faq__side-note">
            <ShieldAlert aria-hidden="true" size={20} strokeWidth={1.7} />
            <p>
              A private mortgage is not risk-free and approval is not guaranteed. The point of the
              review is to make the tradeoffs visible before you decide.
            </p>
          </div>

          <div className="borrower-faq__groups">
            {faqGroups.map((group) => (
              <section className="borrower-faq__group" key={group.title}>
                <h3 className="borrower-faq__group-title">
                  <HelpCircle aria-hidden="true" size={17} strokeWidth={1.8} />
                  {group.title}
                </h3>
                <Accordion
                  className="borrower-faq__accordion"
                  collapsible
                  defaultValue={group.items[0]?.id}
                  type="single"
                >
                  {group.items.map((item) => (
                    <AccordionItem className="borrower-faq__item" key={item.id} value={item.id}>
                      <AccordionTrigger className="borrower-faq__trigger">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="borrower-faq__answer">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
