import Image from 'next/image'
import Link from 'next/link'
import { type ReactElement } from 'react'
import { CircleAlert } from 'lucide-react'

import { reviewInputs, scenarios } from './data'

export function IncidentBoard(): ReactElement {
  return (
    <section
      className="pm-incidents"
      id="what-forced-the-decision"
      aria-labelledby="pm-incidents-title"
    >
      <header className="pm-incidents__header">
        <p className="pm-label">Incoming case signals</p>
        <h2 id="pm-incidents-title">What forced the decision?</h2>
        <p>
          Timing, documentation, credit, income, equity, or file complexity can push you outside a
          conventional bank process. The question is whether the cost, term, risk, and exit plan fit
          the reason you need financing.
        </p>
      </header>

      <div className="pm-incidents__art" aria-hidden="true">
        <Image
          alt=""
          height={600}
          sizes="(max-width: 60rem) 100vw, 34vw"
          src="/assets/fairlend-route-selector/private-mortgage-house-engraving.webp"
          width={800}
        />
      </div>

      <ol className="pm-incidents__list">
        {scenarios.map((scenario, index) => (
          <li key={scenario.title}>
            <span className="pm-incidents__index">{String(index + 1).padStart(2, '0')}</span>
            <blockquote>“{scenario.signal}”</blockquote>
            <div className="pm-incidents__case">
              <h3>{scenario.title}</h3>
              <p>{scenario.body}</p>
            </div>
            <p className="pm-incidents__focus">
              <span>Review focus</span>
              {scenario.focus}
            </p>
          </li>
        ))}
      </ol>

      <div className="pm-incidents__inputs" aria-label="What FairLend reviews">
        <p>
          <strong>What FairLend reviews</strong>
          Used together to give you a practical private mortgage answer.
        </p>
        <ol>
          {reviewInputs.map((input, index) => (
            <li key={input}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {input}
            </li>
          ))}
        </ol>
      </div>

      <div className="pm-incidents__outcome">
        <CircleAlert aria-hidden="true" />
        <p>
          <strong>No guaranteed approval.</strong> A clear yes or no is the point.
        </p>
        <Link href="#private-mortgage-intake">Get a private mortgage review</Link>
      </div>
    </section>
  )
}
