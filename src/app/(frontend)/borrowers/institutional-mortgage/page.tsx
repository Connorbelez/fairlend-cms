import Image from 'next/image'
import Link from 'next/link'
import { Suspense, type ReactElement } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CircleAlert,
  FileSearch,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
} from 'lucide-react'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { buildFairlendMetadata } from '@/utilities/seo'

import './institutional-mortgage.css'

export const dynamic = 'force-static'

const pageDescription =
  'FairLend helps Ontario borrowers compare institutional mortgage options across banks, credit unions, trust companies, and monoline lenders with clear qualification criteria, terms, and next steps.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/borrowers/institutional-mortgage',
  title: 'Institutional Mortgage Financing Ontario | FairLend',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Institutional Mortgage Financing Ontario',
  path: '/borrowers/institutional-mortgage',
  serviceType: 'Institutional mortgage brokerage',
}

const lenderFitSignals = [
  {
    detail:
      'How income is earned, documented, and sustained matters as much as the headline number.',
    evidence: 'T4s · NOAs · business financials · leases',
    icon: FileSearch,
    title: 'Borrower income',
  },
  {
    detail:
      'Occupancy, marketability, condition, location, and property type shape the available lender set.',
    evidence: 'Use · appraisal · location · condition',
    icon: Building2,
    title: 'Property profile',
  },
  {
    detail:
      'The requested amount is reviewed against value, existing debt, debt service, and liquidity.',
    evidence: 'LTV · GDS/TDS · net worth · reserves',
    icon: Scale,
    title: 'Mortgage structure',
  },
  {
    detail:
      'A purchase, transfer, refinance, or equity take-out can land in different policies at the same lender.',
    evidence: 'Purpose · deadline · amortization · term',
    icon: Network,
    title: 'Transaction fit',
  },
] as const

const declineReasons = [
  {
    finding:
      'The lender used a rigid income method that did not reflect the complete earning picture.',
    response:
      'Repackage income for a lender that accepts the applicable self-employed, rental, corporate, or multi-source documentation.',
    signal: 'Income does not fit the box',
  },
  {
    finding:
      'The property type, occupancy, location, or condition fell outside one lender’s policy.',
    response:
      'Match the property to an institution whose mandate and appraisal policy cover the actual asset.',
    signal: 'Property policy mismatch',
  },
  {
    finding: 'Debt-service ratios, leverage, or liquidity did not support the amount as submitted.',
    response:
      'Test a different amount, amortization, debt cleanup, borrower structure, or lender policy before reapplying.',
    signal: 'The structure is too tight',
  },
  {
    finding:
      'The deadline arrived before documents, valuation, underwriting, and conditions could be completed.',
    response:
      'Separate the immediate closing problem from the permanent mortgage and build a credible route between them.',
    signal: 'Timing, not credit',
  },
] as const

const termSheetRows = [
  [
    'Interest rate',
    'The quoted rate and whether it is fixed, variable, insured, insurable, or conventional.',
  ],
  [
    'Term + amortization',
    'How long the rate is committed and how long the repayment schedule runs.',
  ],
  [
    'Prepayment',
    'Annual privileges, portability, and how penalties are calculated if you leave early.',
  ],
  [
    'Fees + costs',
    'Broker, lender, appraisal, legal, discharge, registration, and other applicable closing costs.',
  ],
  [
    'Conditions',
    'The income, property, valuation, insurance, legal, and funding evidence still required.',
  ],
  [
    'Funding date',
    'The commitment expiry, document deadlines, and the date funds must be available.',
  ],
] as const

const matchSteps = [
  [
    'Normalize',
    'Build one coherent file from the property, income, credit, debt, purpose, and deadline.',
  ],
  [
    'Screen',
    'Remove programs that do not fit before they consume time or create unnecessary credit activity.',
  ],
  [
    'Match',
    'Place the complete file against applicable institutional lender policy and current appetite.',
  ],
  [
    'Compare',
    'Review rate, amortization, prepayment, fees, conditions, and execution risk together.',
  ],
  [
    'Close',
    'Coordinate the remaining evidence, valuation, legal work, conditions, and funding date.',
  ],
] as const

const comparisonRows = [
  [
    'Primary use',
    'Stable purchase, renewal, transfer, or refinance',
    'Short-term timing, recovery, or qualification gap',
  ],
  [
    'Underwriting',
    'Income, credit, debt service, property, and policy fit',
    'Equity, property, capacity, timing, and exit path',
  ],
  [
    'Typical tradeoff',
    'Lower cost with more documentation and policy constraints',
    'More flexibility with materially higher cost',
  ],
  [
    'Best question',
    'Which institution fits the complete file?',
    'What specific event gets this mortgage repaid?',
  ],
] as const

const faqs = [
  [
    'What is an institutional mortgage?',
    'An institutional mortgage is funded by a regulated or established lending institution such as a bank, credit union, trust company, monoline lender, or other institutional capital provider. Each lender applies its own underwriting, property, documentation, and risk policies.',
  ],
  [
    'Can FairLend help if my bank declined me?',
    'A decline from one bank does not automatically mean every institutional option is closed. The reason matters. FairLend can review whether the issue is lender policy, income documentation, debt service, credit, property type, valuation, leverage, or timing, then identify whether another institutional program is a credible fit.',
  ],
  [
    'Will applying with multiple lenders hurt my credit?',
    'Credit inquiries can affect a credit file, so the goal is not to submit everywhere. FairLend first screens the complete file against lender criteria and discusses consent before applications or credit checks are made.',
  ],
  [
    'What documents will I need?',
    'The exact list depends on the borrower, income type, property, and transaction. Common requests include identification, income evidence, notices of assessment, bank statements, business financials, mortgage statements, property tax information, purchase documents, leases, and an appraisal. You do not need to upload documents to start the review.',
  ],
  [
    'How long does an institutional mortgage take?',
    'Timing depends on the lender, completeness of the file, appraisal, income verification, legal work, and outstanding conditions. A clean file can move quickly, but institutional underwriting is document-driven. Share the real deadline at intake so execution risk is assessed early.',
  ],
  [
    'Is the lowest rate always the best mortgage?',
    'No. Rate matters, but so do prepayment penalties, amortization, portability, fees, conditions, approval certainty, and whether the lender can meet the closing date. FairLend compares the complete mortgage economics and execution requirements.',
  ],
  [
    'When would a private mortgage be considered instead?',
    'Private financing may be considered when the immediate timing, property, credit, or documentation picture does not fit institutional policy and there is enough property support plus a credible repayment or refinance path. It should be evaluated as a different cost-and-risk decision, not presented as the same product.',
  ],
  [
    'Do you guarantee approval or a specific rate?',
    'No. Approval, rate, terms, and funding remain subject to lender review, borrower consent, documentation, credit, property valuation, conditions, available programs, and final underwriting.',
  ],
] as const

export default function InstitutionalMortgagePage(): ReactElement {
  return (
    <div className="im-page" data-institutional-mortgage-page>
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="im-file">
          <InstitutionalCover />
          <LenderFitMatrix />
          <DeclineDecoder />
          <TermSheet />
          <MatchingRoute />
          <FitDecision />
          <QuestionRegister />
        </main>
      </FairlendLandingRail>
    </div>
  )
}

function InstitutionalCover(): ReactElement {
  return (
    <section className="im-cover" aria-labelledby="im-cover-title">
      <div className="im-cover__skyline" aria-hidden="true">
        <Image
          alt=""
          className="im-cover__skyline-image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 72vw"
          src="/assets/fairlend/fairlend-toronto-skyline-hero-21x9.webp"
        />
      </div>
      <svg aria-hidden="true" className="im-cover__route" viewBox="0 0 1200 420">
        <path
          d="M18 334 C210 392 280 176 470 224 S690 390 836 234 S1020 96 1182 126"
          pathLength="1"
        />
      </svg>

      <div className="im-cover__copy">
        <p className="im-system-label">Institutional mortgage / Ontario</p>
        <h1 id="im-cover-title">
          The right mortgage is a <span>policy match.</span>
        </h1>
        <p className="im-cover__lede">
          FairLend organizes the complete file, screens it against institutional lender criteria,
          and helps you compare the terms that matter—not just the first rate you see.
        </p>
        <ul className="im-cover__signals" aria-label="Institutional mortgage review scope">
          <li>
            <Check aria-hidden="true" /> Banks, credit unions, trusts, and monolines
          </li>
          <li>
            <Check aria-hidden="true" /> Purchase, renewal, transfer, and refinance
          </li>
          <li>
            <Check aria-hidden="true" /> One file built for lender-ready review
          </li>
        </ul>
        <a className="im-cover__skip" href="#lender-fit">
          See how lender fit works <ArrowDownRight aria-hidden="true" />
        </a>
      </div>

      <div className="im-cover__intake" id="institutional-mortgage-intake">
        <div className="im-cover__intake-head">
          <span>Live file</span>
          <strong>Start the lender-fit review</strong>
        </div>
        <Suspense fallback={null}>
          <FairlendLeadIntake
            intentOverride="mortgage"
            mortgageProduct="institutional"
            mortgageVariant="hero"
            sourceOverride="institutional-mortgage-hero-review"
          />
        </Suspense>
      </div>
    </section>
  )
}

function LenderFitMatrix(): ReactElement {
  return (
    <section className="im-fit" id="lender-fit" aria-labelledby="im-fit-title">
      <div className="im-fit__lead">
        <Landmark aria-hidden="true" />
        <h2 id="im-fit-title">Institutions do not underwrite one number.</h2>
        <p>
          A credit score or rate quote cannot explain the whole decision. Institutional approval
          comes from the way borrower, property, structure, and transaction fit one lender’s policy
          at the same time.
        </p>
      </div>
      <div className="im-fit__matrix">
        {lenderFitSignals.map(({ detail, evidence, icon: Icon, title }, index) => (
          <article className="im-fit__cell" key={title}>
            <div className="im-fit__cell-head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Icon aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{detail}</p>
            <small>{evidence}</small>
          </article>
        ))}
      </div>
      <div className="im-fit__annotation">
        <BadgeCheck aria-hidden="true" />
        <p>
          <strong>FairLend’s job:</strong> make the file legible before asking a lender to judge it.
        </p>
      </div>
    </section>
  )
}

function DeclineDecoder(): ReactElement {
  return (
    <section className="im-decline" aria-labelledby="im-decline-title">
      <div className="im-decline__art" aria-hidden="true">
        <Image
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 46vw"
          src="/assets/fairlend-route-selector/investor-skyline-engraving.webp"
        />
      </div>
      <div className="im-decline__lead">
        <CircleAlert aria-hidden="true" />
        <h2 id="im-decline-title">A bank “no” is a finding, not a diagnosis.</h2>
        <p>
          The useful question is why the file failed. The answer determines whether another
          institution, a revised structure, more evidence, or a different financing route makes
          sense.
        </p>
      </div>
      <div className="im-decline__register">
        {declineReasons.map(({ finding, response, signal }, index) => (
          <article key={signal}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{signal}</h3>
              <p>{finding}</p>
            </div>
            <div className="im-decline__response">
              <strong>What changes</strong>
              <p>{response}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TermSheet(): ReactElement {
  return (
    <section className="im-terms" aria-labelledby="im-terms-title">
      <div className="im-terms__lead">
        <p className="im-system-label im-system-label--lime">
          Mortgage economics / compare line by line
        </p>
        <h2 id="im-terms-title">The lowest rate can still be the wrong commitment.</h2>
        <p>
          Approval certainty, prepayment rights, fees, conditions, and timing can change the real
          value of a mortgage. Compare the document, not the headline.
        </p>
      </div>
      <div className="im-terms__sheet">
        <header>
          <div>
            <span>Institutional term sheet</span>
            <strong>Comparison copy</strong>
          </div>
          <ShieldCheck aria-hidden="true" />
        </header>
        <div className="im-terms__rows">
          {termSheetRows.map(([label, detail], index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{label}</h3>
              <p>{detail}</p>
              <Check aria-hidden="true" />
            </div>
          ))}
        </div>
        <footer>
          <span>Rate is one field.</span>
          <strong>The commitment is the product.</strong>
        </footer>
      </div>
    </section>
  )
}

function MatchingRoute(): ReactElement {
  return (
    <section className="im-route" aria-labelledby="im-route-title">
      <div className="im-route__lead">
        <h2 id="im-route-title">One complete file. A deliberate lender route.</h2>
        <p>
          The process narrows options before applications spread. Each stage should remove
          uncertainty and make the next decision easier to defend.
        </p>
      </div>
      <ol className="im-route__track">
        {matchSteps.map(([title, detail], index) => (
          <li key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="im-route__network" aria-hidden="true">
        <div className="im-route__node im-route__node--source">FILE</div>
        <i />
        <i />
        <i />
        <div className="im-route__node im-route__node--match">FIT</div>
      </div>
    </section>
  )
}

function FitDecision(): ReactElement {
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
            <p role="cell">{institutional}</p>
            <p role="cell">{privateRoute}</p>
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

function QuestionRegister(): ReactElement {
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
