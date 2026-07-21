import type { ReactElement, ReactNode } from 'react'
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/utilities/ui'

import './borrower-faq.css'

export type FairlendGroupedFaqItem = {
  id: string
  question: string
  answer: string
}

export type FairlendGroupedFaqGroup = {
  id?: string
  title: string
  summary?: string
  items: readonly FairlendGroupedFaqItem[]
}

type FairlendGroupedFaqProps = {
  afterHeader?: ReactNode
  className?: string
  groupIdPrefix?: string
  groups: readonly FairlendGroupedFaqGroup[]
  headingId: string
  id?: string
  intro: string
  kicker: string
  openFirstQuestion?: boolean
  showGroupMeta?: boolean
  sideNote: ReactNode
  title: string
  variant?: 'borrower' | 'gardenSuite'
}

const faqGroups: readonly FairlendGroupedFaqGroup[] = [
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
 * Reusable ruled FAQ register. The borrower section remains the default
 * variant; Garden Suite financing supplies its own content and visual modifier.
 */
export function FairlendGroupedFaq({
  afterHeader,
  className,
  groupIdPrefix = 'faq',
  groups,
  headingId,
  id,
  intro,
  kicker,
  openFirstQuestion = true,
  showGroupMeta = false,
  sideNote,
  title,
  variant = 'borrower',
}: FairlendGroupedFaqProps): ReactElement {
  return (
    <section
      aria-labelledby={headingId}
      className={cn('borrower-faq', variant === 'gardenSuite' && 'garden-suite-faq', className)}
      data-borrower-faq={variant === 'borrower' ? '' : undefined}
      data-faq-variant={variant}
      id={id}
    >
      <div className="borrower-faq__inner">
        <div className="borrower-faq__header">
          <p className="borrower-faq__kicker">{kicker}</p>
          <h2 className="borrower-faq__title" id={headingId}>
            {title}
          </h2>
          <p className="borrower-faq__intro">{intro}</p>
        </div>

        {afterHeader}

        <div className="borrower-faq__content">
          <div className="borrower-faq__side-note">
            <ShieldAlert aria-hidden="true" size={20} strokeWidth={1.7} />
            <p>{sideNote}</p>
          </div>

          <div
            className="borrower-faq__groups"
            id={variant === 'gardenSuite' ? 'garden-suite-faq-groups' : undefined}
          >
            {groups.map((group, groupIndex) => (
              variant === 'gardenSuite' ? (
                <details
                  className="borrower-faq__group"
                  data-faq-group
                  id={group.id ? `${groupIdPrefix}-${group.id}` : undefined}
                  key={group.id || group.title}
                  open={groupIndex === 0}
                >
                  <summary className="borrower-faq__group-title">
                    <HelpCircle aria-hidden="true" size={17} strokeWidth={1.8} />
                    <span className="borrower-faq__group-heading" role="heading" aria-level={3}>
                      {group.title}
                    </span>
                    {showGroupMeta ? (
                      <span className="borrower-faq__group-count">
                        {group.items.length} {group.items.length === 1 ? 'question' : 'questions'}
                      </span>
                    ) : null}
                    <ChevronDown aria-hidden="true" className="borrower-faq__group-chevron" />
                  </summary>
                  <div className="borrower-faq__group-body">
                    {group.summary ? (
                      <p className="borrower-faq__group-summary">{group.summary}</p>
                    ) : null}
                    <div className="borrower-faq__accordion">
                      {group.items.map((item) => (
                        <details
                          className="borrower-faq__item"
                          data-faq-question
                          key={item.id}
                        >
                          <summary className="borrower-faq__trigger">
                            <span>{item.question}</span>
                            <ChevronDown aria-hidden="true" />
                          </summary>
                          <div className="borrower-faq__answer">
                            {item.answer.split('\n\n').map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                    <a className="borrower-faq__back-to-topics" href="#garden-suite-faq-topics">
                      Back to topics <span aria-hidden="true">↑</span>
                    </a>
                  </div>
                </details>
              ) : (
                <section className="borrower-faq__group" key={group.id || group.title}>
                  <h3 className="borrower-faq__group-title">
                    <HelpCircle aria-hidden="true" size={17} strokeWidth={1.8} />
                    <span>{group.title}</span>
                  </h3>
                  <Accordion
                    className="borrower-faq__accordion"
                    collapsible
                    defaultValue={
                      openFirstQuestion && groupIndex === 0 ? group.items[0]?.id : undefined
                    }
                    type="single"
                  >
                    {group.items.map((item) => (
                      <AccordionItem className="borrower-faq__item" key={item.id} value={item.id}>
                        <AccordionTrigger className="borrower-faq__trigger">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="borrower-faq__answer">
                          {item.answer.split('\n\n').map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Section 8 - FAQ / objections.
 *
 * The hard answers live here: no guaranteed approval, timing qualifiers, total
 * cost, legal document economics, payout terms, and exit strategy.
 */
export function FairlendBorrowerFaq(): ReactElement {
  return (
    <FairlendGroupedFaq
      groups={faqGroups}
      headingId="borrower-faq-title"
      intro="Private mortgage financing should be understood before it is signed. Start here, then bring your property, deadline, current mortgage, and amount needed to the consultation."
      kicker="Hard answers"
      sideNote="A private mortgage is not risk-free and approval is not guaranteed. The point of the review is to make the tradeoffs visible before you decide."
      title="Questions to ask before taking private money."
    />
  )
}
