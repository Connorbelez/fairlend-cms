import Image from 'next/image'
import Link from 'next/link'
import { Suspense, type ReactElement } from 'react'
import { ArrowDownRight } from 'lucide-react'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'

import { decisionQuestions, proofPoints } from './data'

export function CoverSheet(): ReactElement {
  return (
    <section className="pm-cover" aria-labelledby="pm-cover-title">
      <div className="pm-cover__skyline" aria-hidden="true">
        <Image
          alt=""
          className="pm-cover__skyline-image"
          fill
          priority
          sizes="(max-width: 60rem) 100vw, 68vw"
          src="/assets/fairlend/fairlend-toronto-skyline-hero-21x9.webp"
        />
      </div>
      <svg aria-hidden="true" className="pm-cover__route" viewBox="0 0 1000 380">
        <path d="M32 290 C260 350 350 140 570 230 S820 250 968 76" pathLength="1" />
      </svg>

      <div className="pm-cover__copy">
        <p className="pm-label pm-label--dark">
          <Link href="/borrowers">Borrower overview</Link> / Private mortgage financing
        </p>
        <h1 id="pm-cover-title">Get a clear private mortgage answer before your deadline.</h1>
        <p className="pm-cover__lede">
          If a bank timeline, renewal problem, closing date, debt pressure, or equity need has you
          looking at private money, FairLend helps you understand what can work, what it may cost,
          and how you get back out.
        </p>

        <ol className="pm-cover__questions" aria-label="Private mortgage review questions">
          {decisionQuestions.map((question, index) => (
            <li key={question}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {question}
            </li>
          ))}
        </ol>
        <a className="pm-cover__skip" href="#what-forced-the-decision">
          Read the file <ArrowDownRight aria-hidden="true" />
        </a>
      </div>

      <div className="pm-cover__intake" id="private-mortgage-intake">
        <p className="pm-file-tab">Live file / start here</p>
        <Suspense fallback={null}>
          <FairlendLeadIntake
            intentOverride="mortgage"
            mortgageVariant="hero"
            sourceOverride="borrower-hero-inline-review"
          />
        </Suspense>
        <p className="pm-cover__intake-note">
          Start with the situation. Approximate answers are enough, and no documents are needed
          right now.
        </p>
      </div>

      <aside className="pm-cover__proof" aria-labelledby="pm-proof-title">
        <div>
          <p className="pm-micro">Before you commit</p>
          <h2 id="pm-proof-title">Know the costs, timing, and exit before you move.</h2>
        </div>
        <dl>
          {proofPoints.map(([label, detail]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="pm-cover__qualifier">
          Commitments are subject to file completeness, borrower cooperation, lender review,
          valuation and appraisal requirements, available capital, and lender fit.
        </p>
      </aside>
    </section>
  )
}
