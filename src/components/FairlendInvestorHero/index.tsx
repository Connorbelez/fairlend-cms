import { Suspense, type ReactElement } from 'react'
import { ArrowDownRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { FairlendLeadIntake } from '@/components/FairlendLeadIntake/FairlendLeadIntake.client'

import './investor-hero.css'

const proofPoints = [
  'Selected private mortgage opportunities',
  'Conservative LTV discipline',
  'Administration from funding through payout',
  'Documented recovery path',
] as const

/**
 * Investor conversion hero.
 *
 * The live investor intake directly reuses the borrower hero wizard shell;
 * only its questions, progress copy, validation, and success state change.
 * The Toronto/property engravings are established root-brand assets, while
 * lime is reserved for route, progress, focus, and action.
 */
export function FairlendInvestorHero(): ReactElement {
  return (
    <section
      aria-labelledby="investor-hero-title"
      className="investor-hero"
      data-investor-hero
      id="investor-hero"
    >
      <div className="investor-hero__grid">
        <div className="investor-hero__story">
          <div className="investor-hero__copy">
            <p className="investor-hero__kicker">
              <span aria-hidden="true" />
              <Link href="/investing">
                Investor overview / Southern Ontario. Registered mortgages. Documented process.
              </Link>
            </p>
            <h1 className="investor-hero__title" id="investor-hero-title">
              Put your capital to work. <em>Through registered mortgage investments.</em>
            </h1>
            <p className="investor-hero__subhead">
              Build a private mortgage portfolio around your capital range, timeline, and risk
              profile. FairLend curates, underwrites, administers, and monitors the file from first
              review through payout or recovery.
            </p>
            <a className="investor-hero__framework-link" href="#investor-protection-stack">
              See the protection framework
              <ArrowDownRight aria-hidden="true" />
            </a>
          </div>

          <div className="investor-hero__ink-scene" aria-hidden="true">
            <div className="investor-hero__skyline">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 960px) 100vw, 55vw"
                src="/assets/fairlend-route-selector/investor-skyline-engraving.webp"
              />
            </div>
            <div className="investor-hero__property">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 960px) 70vw, 34vw"
                src="/assets/fairlend-route-selector/private-mortgage-house-engraving.webp"
              />
            </div>
            <svg
              className="investor-hero__route"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 760 260"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M36 206 C 170 198 190 122 318 136 S 478 194 560 98 S 660 40 726 48" />
              <circle cx="36" cy="206" r="7" />
              <circle cx="318" cy="136" r="7" />
              <circle cx="560" cy="98" r="7" />
              <path className="investor-hero__route-arrow" d="M714 34 738 48 714 62Z" />
            </svg>
          </div>
        </div>

        <div className="investor-hero__form-slot" id="investor-profile">
          <Suspense fallback={<div className="investor-hero__form-loading" aria-hidden="true" />}>
            <FairlendLeadIntake
              intentOverride="invest"
              investorVariant="hero"
              sourceOverride="investor-hero-inline-profile"
            />
          </Suspense>
        </div>
      </div>

      <div className="investor-hero__proof" aria-label="How FairLend manages investor files">
        <p>The rate is not the product. The underwriting is.</p>
        <ul>
          {proofPoints.map((point) => (
            <li key={point}>
              <Check aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="investor-hero__risk-line">
        Private mortgage investments involve borrower, property, market, legal, liquidity, and
        recovery risk. They are not bank deposits or guaranteed-return products. Opportunities are
        subject to investor review, suitability considerations, and availability.
      </p>
    </section>
  )
}
