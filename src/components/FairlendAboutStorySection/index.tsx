/* eslint-disable @next/next/no-img-element */
import { ArrowRight, type LucideIcon, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import type { ReactElement } from 'react'

import { FairlendSectionKicker } from '@/components/FairlendSectionKicker'
import { Card } from '@/components/ui/card'

const aboutAssetBase = '/assets/about-webp/webp'

const aboutAssets = {
  bridgeLoansIcon: `${aboutAssetBase}/finance-icon-bridge-loans.webp`,
  gardenSuitesIcon: `${aboutAssetBase}/finance-icon-garden-suites.webp`,
  mortgageInvestmentsIcon: `${aboutAssetBase}/finance-icon-mortgage-investments.webp`,
  multiplexFinancingIcon: `${aboutAssetBase}/finance-icon-multiplex-financing.webp`,
  purposeBuiltRentalsIcon: `${aboutAssetBase}/finance-icon-purpose-built-rentals.webp`,
  residentialMortgagesIcon: `${aboutAssetBase}/finance-icon-residential-private-mortgages.webp`,
  torontoSkyline: `${aboutAssetBase}/toronto-skyline-sketch-optimized.webp`,
} as const

const expertiseItems = [
  {
    copy: 'Grounded in communities across Canada.',
    Icon: Users,
    title: 'Local Expertise',
  },
  {
    copy: 'Rigorous underwriting aligned with outcomes.',
    Icon: ShieldCheck,
    title: 'Disciplined Approach',
  },
  {
    copy: 'We invest alongside our lending and investor partners.',
    Icon: TrendingUp,
    title: 'Aligned Interests',
  },
] satisfies ReadonlyArray<{
  copy: string
  Icon: LucideIcon
  title: string
}>

const financeItems = [
  {
    copy: (
      <>
        1st, 2nds, 3rd+. Fully
        <br />
        automated digital servicing.
      </>
    ),
    href: '/contact',
    icon: aboutAssets.residentialMortgagesIcon,
    label: 'Residential Private Mortgages',
    tag: 'Private lending',
    title: (
      <>
        Residential Private
        <br />
        Mortgages
      </>
    ),
  },
  {
    copy: (
      <>
        Short-term capital to bridge
        <br />
        gaps and close fast with our
        <br />
        72-hour commitment SLA.
      </>
    ),
    href: '/construction-draw-financing',
    icon: aboutAssets.bridgeLoansIcon,
    label: 'Bridge Loans',
    tag: 'Time-sensitive capital',
    title: (
      <>
        Bridge
        <br />
        Loans
      </>
    ),
  },
  {
    copy: (
      <>
        Permit-smart capital backed
        <br />
        by GTA contractors and
        <br />
        suppliers to finish on budget.
      </>
    ),
    href: '/construction-draw-financing',
    icon: aboutAssets.mortgageInvestmentsIcon,
    label: 'Renovation Financing',
    tag: 'Construction capital',
    title: (
      <>
        Renovation
        <br />
        Financing
      </>
    ),
  },
  {
    copy: (
      <>
        Local GTA expertise for 3-20
        <br />
        unit properties, from permits
        <br />
        to digital deal-room funding.
      </>
    ),
    href: '/multiplex-financing-gta',
    icon: aboutAssets.multiplexFinancingIcon,
    label: 'Multi-plex Financing',
    tag: 'Housing supply',
    title: (
      <>
        Multi-plex
        <br />
        Financing
      </>
    ),
  },
  {
    copy: (
      <>
        Backyard and laneway homes
        <br />
        financed by a team that knows
        <br />
        permits, budgets and timelines.
      </>
    ),
    href: '/garden-suite-financing-gta',
    icon: aboutAssets.gardenSuitesIcon,
    label: 'Garden & Laneway Suites',
    tag: 'Infill housing',
    title: (
      <>
        Garden & Laneway
        <br />
        Suites
      </>
    ),
  },
  {
    copy: (
      <>
        Insured rental-housing capital
        <br />
        with streamlined underwriting
        <br />
        and phone-ready closing.
      </>
    ),
    href: '/affordable-sustainable-rental-housing',
    icon: aboutAssets.purposeBuiltRentalsIcon,
    label: 'MLI-Select Insured Housing',
    tag: 'Insured rental',
    title: (
      <>
        MLI-Select Insured
        <br />
        Housing
      </>
    ),
  },
] as const

export function FairlendAboutStorySection(): ReactElement {
  return (
    <section className="about-page about-page--embedded" aria-label="About Fairlend">
      <div className="about-story" data-about-motion="story">
        <section
          aria-labelledby="about-who-title"
          className="about-who-section"
          data-about-section="about-who"
          id="about-who"
        >
          <FairlendSectionKicker
            className="about-kicker-who"
            data-about-reveal
            label="Who We Are"
            labelId="about-who-title"
            labelProps={{ 'data-about-kicker-label': 'who' }}
            number="02"
            numberProps={{ 'data-about-kicker-number': 'who' }}
            slashProps={{ 'data-about-kicker-slash': 'who' }}
          />

          <div className="about-who-layout" data-about-who-layout>
            <div className="about-who-main" data-about-reveal>
              <div className="about-who-copy">
                <p data-about-who-copy-line>
                  We are a team of seasoned professionals with deep expertise in private lending,
                  real estate finance, and capital markets.
                </p>
                <p data-about-who-copy-line>
                  As a brokerage and investment company, we connect borrowers with flexible capital
                  and investors with attractive, risk-adjusted opportunities.
                </p>
                <p data-about-who-copy-line>
                  Our approach blends disciplined underwriting, innovative structures, and local
                  market knowledge to create lasting value.
                </p>
              </div>
            </div>

            <Card
              className="about-expertise-panel"
              data-about-expertise-panel
              data-about-reveal
              render={<aside aria-label="Fairlend operating principles" />}
            >
              <span
                aria-hidden="true"
                className="about-expertise-corner is-top-left"
                data-about-expertise-corner
              />
              <span
                aria-hidden="true"
                className="about-expertise-corner is-top-right"
                data-about-expertise-corner
              />
              <span
                aria-hidden="true"
                className="about-expertise-corner is-bottom-left"
                data-about-expertise-corner
              />
              <span
                aria-hidden="true"
                className="about-expertise-corner is-bottom-right"
                data-about-expertise-corner
              />
              {expertiseItems.map((item, index) => (
                <div
                  className="about-expertise-item"
                  data-about-expertise-item
                  data-about-reveal="child"
                  data-feature-index={String(index + 1).padStart(2, '0')}
                  key={item.title}
                >
                  <span
                    aria-hidden="true"
                    className="about-expertise-icon"
                    data-about-expertise-icon
                  >
                    <item.Icon />
                  </span>
                  <div>
                    <h3 className="about-text-textured">{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <img
            alt=""
            className="about-skyline"
            data-about-skyline
            decoding="async"
            draggable={false}
            height={847}
            src={aboutAssets.torontoSkyline}
            width={1681}
          />
        </section>

        <section
          aria-labelledby="about-finance-title"
          className="about-finance-section"
          data-about-section="about-finance"
          id="about-finance"
        >
          <FairlendSectionKicker
            className="about-kicker-finance"
            data-about-reveal
            label="What We Finance"
            labelId="about-finance-title"
            labelProps={{ 'data-about-kicker-label': 'finance' }}
            number="03"
            numberProps={{ 'data-about-kicker-number': 'finance' }}
            slashProps={{ 'data-about-kicker-slash': 'finance' }}
          />

          <div className="about-finance" data-about-finance-grid>
            {financeItems.map((item, index) => (
              <Card
                className="about-finance-card"
                data-about-finance-card
                data-about-reveal
                data-finance-index={String(index + 1).padStart(2, '0')}
                key={item.label}
                render={<a aria-label={`${item.label} - learn more`} href={item.href} />}
              >
                <img
                  alt=""
                  data-about-finance-icon
                  decoding="async"
                  draggable={false}
                  height={512}
                  src={item.icon}
                  width={512}
                />
                <div data-about-finance-copy>
                  <span className="about-finance-tag" data-about-finance-tag>
                    {item.tag}
                  </span>
                  <h3 className="about-text-textured" data-about-finance-title>
                    {item.title}
                  </h3>
                  <p data-about-finance-description>{item.copy}</p>
                </div>
                <ArrowRight aria-hidden="true" data-about-finance-arrow />
              </Card>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
