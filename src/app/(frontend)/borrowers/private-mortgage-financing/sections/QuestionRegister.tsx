import Link from 'next/link'
import { type ReactElement } from 'react'
import { ArrowDownRight, CircleAlert } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { faqs } from './data'

export function QuestionRegister(): ReactElement {
  return (
    <section className="pm-questions" aria-labelledby="pm-questions-title">
      <div className="pm-questions__lead">
        <p className="pm-label">Question register</p>
        <h2 id="pm-questions-title">Ask the hard questions before taking private money.</h2>
        <p>
          Private mortgage financing should be understood before it is signed. Bring the address,
          deadline, current mortgage, and amount needed to the review.
        </p>

        <div className="pm-questions__warning">
          <CircleAlert aria-hidden="true" />
          <p>
            A private mortgage is not risk-free and approval is not guaranteed. The point of the
            review is to make the tradeoffs visible before you decide.
          </p>
        </div>

        <Link className="pm-questions__cta" href="#private-mortgage-intake">
          Open my private mortgage file
          <ArrowDownRight aria-hidden="true" />
        </Link>
      </div>

      <Accordion className="pm-questions__accordion" collapsible type="single">
        {faqs.map(([question, answer], index) => (
          <AccordionItem
            className="pm-questions__item"
            key={question}
            value={`question-${index + 1}`}
          >
            <AccordionTrigger className="pm-questions__trigger">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {question}
            </AccordionTrigger>
            <AccordionContent className="pm-questions__answer">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
