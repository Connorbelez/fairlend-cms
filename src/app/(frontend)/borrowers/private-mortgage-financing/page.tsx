import Image from 'next/image'
import Link from 'next/link'
import { Suspense, type ReactElement } from 'react'
import {
  ArrowDownRight,
  BadgeCheck,
  CircleAlert,
  MapPinned,
  Route,
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

import './private-mortgage-financing.css'

export const dynamic = 'force-static'

const pageDescription =
  'Need a private mortgage in Ontario? FairLend helps borrowers review first, second, bridge, renewal, and equity-based options with clear costs, timing, and an exit plan.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/borrowers/private-mortgage-financing',
  title: 'Private Mortgage Financing Ontario | FairLend',
})

const serviceSeo = {
  description:
    'Private mortgage financing review for Ontario borrowers considering first, second, bridge, renewal, and equity-based mortgage options.',
  name: 'Private Mortgage Financing Ontario',
  path: '/borrowers/private-mortgage-financing',
  serviceType: 'Private mortgage financing',
}

const decisionQuestions = [
  'Can it work?',
  'What will it cost?',
  'How fast can it close?',
  'How do I get out?',
] as const

const proofPoints = [
  ['Fast answer target', 'Target 24-hour commitment on complete private mortgage files.'],
  ['Options compared', 'First, second, bridge, renewal, and equity-based structures reviewed.'],
  ['Payout terms', 'Low payout fees where applicable.'],
  ['Costs upfront', 'Material mortgage economics discussed before signing.'],
  ['Local review', 'Led by experienced GTA mortgage professionals.'],
] as const

const scenarios = [
  {
    body: 'A maturity date is close and the bank answer is not ready yet. The review starts with the term, cost, and a credible route back to cheaper financing.',
    focus: 'Term cost + refinance path',
    signal: 'My renewal is coming up',
    title: 'Renewal pressure',
  },
  {
    body: 'A purchase, sale, refinance, or private payout has a hard date. FairLend checks whether the money can close on time and how it gets repaid.',
    focus: 'Repayment event + deadline',
    signal: 'I have a fixed closing date',
    title: 'Closing deadline',
  },
  {
    body: 'High-interest debt, tax arrears, or scattered payments may be consolidated when equity, capacity, fees, and the exit path support it.',
    focus: 'Equity + total cost',
    signal: 'My payments are scattered',
    title: 'Debt consolidation',
  },
  {
    body: 'If you have equity but the bank process is too slow or too rigid, FairLend reviews what your property can responsibly support.',
    focus: 'Equity + amount needed',
    signal: 'I need to access equity',
    title: 'Equity access',
  },
  {
    body: 'Bridge financing can help when one transaction depends on another. The key question is whether the repayment event is real and timed properly.',
    focus: 'Bridge amount + repayment event',
    signal: 'I need short-term bridge money',
    title: 'Bridge financing',
  },
  {
    body: 'A second mortgage can solve a specific need when the property value, current mortgage position, and payment plan make the added risk workable.',
    focus: 'Position + payment plan',
    signal: 'I need capital behind my first',
    title: 'Second mortgage',
  },
  {
    body: 'Bruised credit or non-traditional income is not an automatic no. The review still needs property strength, documentation, capacity, and a realistic exit.',
    focus: 'Documents + property strength',
    signal: 'The bank said no',
    title: 'Bank decline',
  },
  {
    body: 'An existing private mortgage can be reviewed for payout rights, renewal pressure, fee exposure, maturity plan, and whether a better structure exists.',
    focus: 'Payout rights + maturity plan',
    signal: 'I already have private money',
    title: 'Existing private mortgage',
  },
] as const

const comparisonRows = [
  [
    'Cost visibility',
    'Fees show up late, after you already feel committed.',
    'Costs are discussed before signing.',
  ],
  [
    'Exit terms',
    'Payout penalties make refinancing or selling harder.',
    'Low payout fees where applicable.',
  ],
  [
    'Payment issues',
    'A missed payment turns into escalating charges.',
    'Administration-focused servicing, not punishment.',
  ],
  [
    'Renewal path',
    'You reach maturity with no clear next move.',
    'Maturity and renewal options are discussed up front.',
  ],
  [
    'Key terms',
    'The real deal is scattered across dense documents.',
    'Material mortgage economics are visible in the commitment.',
  ],
  [
    'Next step',
    'You get funds, but no plan to leave private money.',
    'The exit path is reviewed before funding.',
  ],
] as const

const processSteps = [
  {
    body: 'Share the property, current mortgage, timeline, and why you need financing.',
    phase: 'Intake',
    title: 'Tell us what is happening',
  },
  {
    body: 'FairLend reviews your equity, documentation, payment capacity, property context, and lender fit together.',
    phase: 'Assessment',
    title: 'Review what can work',
  },
  {
    body: 'Rate, fees, payout terms, renewal considerations, risks, and material conditions are discussed in plain language.',
    phase: 'Terms',
    title: 'Map the terms',
  },
  {
    body: 'The maturity path is considered before funding: refinance, sale, renewal, stabilization, debt cleanup, or another realistic route.',
    phase: 'Exit route',
    title: 'Plan the way out',
  },
  {
    body: 'If the structure makes sense, support can continue through closing, PAD payments, servicing, renewals, payouts, and borrower coordination.',
    phase: 'Support',
    title: 'Stay supported after funding',
  },
] as const

const reviewRegisters = [
  ['Borrower', 'Documentation, payment capacity, timing'],
  ['Property', 'Value, appraisal, available equity'],
  ['Mortgage position', 'Current balance, payout terms, renewal path'],
  ['Exit strategy', 'Refinance, sale, renewal, debt cleanup'],
] as const

const operatingStandards = [
  [
    'Connected file review',
    'Property, mortgage position, documentation, lender fit, and exit are reviewed together before a structure is recommended.',
  ],
  [
    'Tradeoffs made visible',
    'Cost, timing, maturity path, and funding conditions are explained before the file moves forward.',
  ],
  [
    'Professional judgment',
    'Technology helps organize the work, but experienced mortgage professionals make the judgment calls.',
  ],
  [
    'Whole-file review',
    'Need, property condition, current mortgage, documents, lender fit, and exit are reviewed as one file.',
  ],
  [
    'Valuation and equity check',
    'Value, mortgage position, and equity are checked carefully so the amount stays grounded in what the property can support.',
  ],
  [
    'Closing and renewal support',
    'Support can continue after funding through payment questions, renewals, payouts, coordination, and administration.',
  ],
] as const

const reviewInputs = [
  'Property value',
  'Available equity',
  'Amount needed',
  'Deadline',
  'Current mortgage',
  'Exit path',
] as const

const faqs = [
  [
    'Is a private mortgage right for me?',
    'It depends on the property, equity, current mortgage, amount needed, payment capacity, timeline, costs, and exit path. FairLend reviews those pieces together so you can see whether private financing solves the problem or creates a bigger one.',
  ],
  [
    'How fast can I get an answer?',
    'FairLend targets a 24-hour application-to-commitment path for complete private mortgage files. Timing depends on complete information, borrower cooperation, property review, appraisal requirements, lender review, available capital, and lender fit.',
  ],
  [
    'What happens in the free review?',
    'The first review looks at your property, timeline, current mortgage, available equity, amount needed, likely costs, payout considerations, and exit path. After that, FairLend can tell you what documents are needed for a clearer answer.',
  ],
  [
    'Can bruised credit or non-traditional income work?',
    'Often, yes. Bruised credit, self-employment, irregular income, or a bank decline do not automatically end the conversation. Approval is never automatic, though. Equity, property value, payment capacity, documentation, timing, and a realistic exit still matter.',
  ],
  [
    'Do you guarantee approval?',
    'No. Responsible private mortgage financing still requires lender review, documentation, property review, valuation, lender fit, available capital, and a realistic repayment or exit path.',
  ],
  [
    'What fees should I expect?',
    'You should expect a plain-language discussion of the full cost picture: rate, broker or lender fees, administration charges, renewal considerations, payout terms, default charges, closing costs, material conditions, and material risks.',
  ],
  [
    'Are there payout fees?',
    'Where the structure allows it, FairLend works to keep payout fees low so leaving for better financing is not treated as the expensive option. Either way, payout terms should be understood before you commit.',
  ],
  [
    'Will legal documents include fees I did not see in the commitment?',
    'You should know the material mortgage economics before closing. The commitment should disclose rate, fees, term, payment structure, payout terms, renewal considerations, default charges, material conditions, and material risks. Third-party legal, appraisal, registration, government, and closing costs may still apply where relevant.',
  ],
  [
    'What is an exit strategy?',
    'An exit strategy is the realistic plan for what happens at maturity: refinance, sale, renewal, income stabilization, credit repair, debt cleanup, construction completion, or another defined path. It should be discussed before funding, not when the term is about to expire.',
  ],
  [
    'What happens after closing?',
    'Support can continue through digital closing workflows, PAD payment collection, servicing, renewals, payouts, borrower coordination, and administration. The goal is practical communication after funding, not a disappearing broker experience.',
  ],
] as const

export default function BorrowerPrivateMortgageFinancingPage(): ReactElement {
  return (
    <div className="pm-page" data-private-mortgage-page>
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendLandingRail gutterTexture="fabric-of-squares">
        <main className="pm-file">
          <CoverSheet />
          <IncidentBoard />
          <CostXray />
          <ExitRoute />
          <JudgmentDesk />
          <QuestionRegister />
        </main>
      </FairlendLandingRail>
    </div>
  )
}

function CoverSheet(): ReactElement {
  return (
    <section className="pm-cover" aria-labelledby="pm-cover-title">
      <div className="pm-cover__skyline" aria-hidden="true">
        <Image
          alt=""
          className="pm-cover__skyline-image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 68vw"
          src="/assets/fairlend/fairlend-toronto-skyline-hero-21x9.webp"
        />
      </div>
      <svg aria-hidden="true" className="pm-cover__route" viewBox="0 0 1000 380">
        <path d="M32 290 C260 350 350 140 570 230 S820 250 968 76" pathLength="1" />
      </svg>

      <div className="pm-cover__copy">
        <p className="pm-label pm-label--dark">Private mortgage financing</p>
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
          property review, appraisal requirements, available capital, and lender fit.
        </p>
      </aside>
    </section>
  )
}

function IncidentBoard(): ReactElement {
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
          Timing, documentation, credit, income, equity, or property complexity can push you outside
          a conventional bank process. The question is whether the cost, term, risk, and exit plan
          fit the reason you need financing.
        </p>
      </header>

      <div className="pm-incidents__art" aria-hidden="true">
        <Image
          alt=""
          height={600}
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

function CostXray(): ReactElement {
  return (
    <section className="pm-xray" aria-labelledby="pm-xray-title">
      <header className="pm-xray__header">
        <p className="pm-label pm-label--light">Cost X-ray</p>
        <h2 id="pm-xray-title">A fast yes is not enough.</h2>
        <p>
          Speed matters. But a private mortgage is still a higher-cost tool. If the costs, payment
          plan, payout rules, renewal path, and exit are unclear, the fast answer can become the
          expensive answer.
        </p>
      </header>

      <div className="pm-xray__equation" aria-label="Total private mortgage cost equation">
        <span>Total private mortgage cost</span>
        <strong>=</strong>
        <p>rate + fees + conditions + payout + renewal + default + closing costs + exit</p>
      </div>

      <div
        className="pm-xray__ledger"
        role="table"
        aria-label="Private mortgage structure comparison"
      >
        <div className="pm-xray__ledger-head" role="row">
          <span role="columnheader">Review axis</span>
          <span role="columnheader">Rushed private money</span>
          <span role="columnheader">Clear private mortgage plan</span>
        </div>
        {comparisonRows.map(([axis, rushed, clear]) => (
          <div className="pm-xray__row" role="row" key={axis}>
            <strong role="rowheader">{axis}</strong>
            <p role="cell">
              <span className="pm-xray__cell-label">Rushed private money</span>
              {rushed}
            </p>
            <p role="cell">
              <span className="pm-xray__cell-label">Clear private mortgage plan</span>
              <BadgeCheck aria-hidden="true" /> {clear}
            </p>
          </div>
        ))}
      </div>

      <p className="pm-xray__closing">
        The deadline may be real. The mortgage still has to make sense before it is signed.
      </p>
    </section>
  )
}

function ExitRoute(): ReactElement {
  return (
    <section className="pm-route" aria-labelledby="pm-route-title">
      <header className="pm-route__header">
        <p className="pm-label">Underwrite backward from maturity</p>
        <h2 id="pm-route-title">You should know the next move before you commit.</h2>
        <p>
          If the structure does not fit, you should know early. If it does fit, the path from review
          to commitment should make the cost, conditions, and exit visible.
        </p>
      </header>

      <div className="pm-route__map">
        <svg aria-hidden="true" viewBox="0 0 1200 620">
          <path
            className="pm-route__track"
            d="M70 92 C250 62 264 260 465 232 S682 84 820 177 S974 450 1135 505"
          />
          <path
            className="pm-route__signal"
            d="M70 92 C250 62 264 260 465 232 S682 84 820 177 S974 450 1135 505"
            pathLength="1"
          />
        </svg>
        <ol>
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className="pm-route__node">{String(index + 1).padStart(2, '0')}</span>
              <p className="pm-micro">{step.phase}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="pm-route__exit-stamp">
          <Route aria-hidden="true" />
          <span>Exit first</span>
          <strong>Refinance · sale · renewal · stabilization</strong>
        </div>
      </div>
      <p className="pm-route__close">
        Start with the free review. A commitment only follows a structure that can be explained.
      </p>
    </section>
  )
}

function JudgmentDesk(): ReactElement {
  return (
    <section className="pm-judgment" aria-labelledby="pm-judgment-title">
      <div className="pm-judgment__image" aria-hidden="true">
        <Image
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 52vw"
          src="/assets/fairlend-principal-broker-background-halftone-key.webp"
        />
      </div>

      <div className="pm-judgment__copy">
        <p className="pm-label pm-label--dark">The judgment desk</p>
        <h2 id="pm-judgment-title">Talk to people who structure private mortgages every day.</h2>
        <p>
          FairLend treats private mortgage financing as accountable brokerage work, not a rushed
          search for a rate quote. The decision still needs human review, plain-language disclosure,
          and a maturity path you can actually use.
        </p>
        <p className="pm-judgment__whole-file">
          FairLend reviews your property, current mortgage, deadline, available equity,
          documentation, payment capacity, fee exposure, payout terms, renewal path, and exit
          together. The goal is a structure that solves the pressure without leaving you stuck at
          maturity.
        </p>

        <dl className="pm-judgment__register">
          {reviewRegisters.map(([label, value], index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pm-judgment__standards">
        <div className="pm-judgment__local">
          <MapPinned aria-hidden="true" />
          <p className="pm-micro">Ontario and GTA mortgage context</p>
          <h3>Local mortgage judgment, explained in borrower language.</h3>
          <p>
            Understand the property, avoid weak structures, explain the tradeoffs, and make the exit
            visible before funding.
          </p>
        </div>

        <ul>
          {operatingStandards.map(([title, body]) => (
            <li key={title}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function QuestionRegister(): ReactElement {
  return (
    <section className="pm-questions" aria-labelledby="pm-questions-title">
      <div className="pm-questions__lead">
        <p className="pm-label">Question register</p>
        <h2 id="pm-questions-title">Ask the hard questions before taking private money.</h2>
        <p>
          Private mortgage financing should be understood before it is signed. Bring your property,
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
