import Link from 'next/link'
import type { ReactElement } from 'react'
import { ArrowRight, Landmark } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { faqs } from './data'

export function QuestionRegister(): ReactElement {
  return (
    <section className="im-questions" aria-labelledby="im-questions-title">
      <div className="im-questions__lead">
        <div className="im-questions__mark" aria-hidden="true">
          <Landmark />
        </div>
        <h2 id="im-questions-title">Bring the complete file into focus.</h2>
        <p>
          Start with approximate answers. FairLend can identify lender fit and the next evidence
          without asking you to upload a document package first.
        </p>
        <Link className="im-questions__cta" href="#institutional-mortgage-intake">
          Start the institutional review <ArrowRight aria-hidden="true" />
        </Link>
        <p className="im-questions__disclaimer">
          All financing is subject to borrower consent, lender review, documentation, valuation,
          applicable conditions, program availability, and final approval.
        </p>
      </div>
      <Accordion className="im-questions__accordion" collapsible type="single">
        {faqs.map(([question, answer], index) => (
          <AccordionItem
            className="im-questions__item"
            key={question}
            value={`question-${index + 1}`}
          >
            <AccordionTrigger className="im-questions__trigger">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {question}
            </AccordionTrigger>
            <AccordionContent className="im-questions__answer">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
