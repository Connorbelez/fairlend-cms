import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'

import { fairlendFaqGroups } from '@/components/FairlendFaqSection/data'
import { ALIGNED_INTERESTS, ETHOS_COPY } from '@/components/FairlendEthosSection/content'
import {
  fairlendAudiencePaths,
  fairlendBuilderEconomicsTimeline,
  fairlendBuildModelStages,
  fairlendLeadershipTeam,
} from '@/content/fairlend-machine-content'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

const consultationHref = buildFairlendIntakeHref({
  intent: 'consultation',
  source: 'static-homepage-fallback',
})

function StaticSectionShell({
  children,
  className,
  eyebrow,
  intro,
  title,
}: {
  children: ReactNode
  className?: string
  eyebrow: string
  intro: string
  title: string
}): ReactElement {
  return (
    <section
      className={cn(
        'relative isolate flex min-h-[inherit] flex-col justify-center overflow-hidden border-y border-black/12 bg-[#f8f7f5] px-5 py-14 text-[#11110f] md:px-10 md:py-20 lg:px-[clamp(42px,6vw,92px)]',
        className,
      )}
      data-fairlend-static-fallback
    >
      <div className="relative mx-auto w-full max-w-[1240px]">
        <header className="grid gap-5 border-b border-black/15 pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.52fr)] lg:items-end lg:gap-14">
          <div>
            <p className="m-0 text-xs font-black tracking-[0.2em] text-[#4f534a] uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-4 mb-0 max-w-[17ch] font-serif text-[clamp(52px,5vw,72px)] leading-[0.92] font-medium tracking-[-0.04em] text-balance">
              {title}
            </h2>
          </div>
          <p className="m-0 max-w-[52ch] text-[16px] leading-[1.55] font-medium text-[#555950]">
            {intro}
          </p>
        </header>
        {children}
      </div>
    </section>
  )
}

export function FairlendStaticRouteSelector(): ReactElement {
  return (
    <StaticSectionShell
      className="min-h-[2500px] xl:min-h-[720px]"
      eyebrow="Find your fit"
      intro="Whether you are looking to build, borrow, invest, or partner, start with the FairLend option that matches your goals."
      title="Where would you like to go with FairLend?"
    >
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {fairlendAudiencePaths.map((route, index) => (
          <article
            className="flex min-h-[330px] flex-col border border-black/15 bg-white/72 p-5"
            key={route.id}
          >
            <div className="flex items-center justify-between gap-4 border-b border-black/12 pb-4">
              <span className="text-xs font-black tracking-[0.18em] text-[#5b6055] uppercase">
                Route {String(index + 1).padStart(2, '0')}
              </span>
              {route.badge ? (
                <span className="bg-[#b7ff05] px-2 py-1 text-[10px] font-black tracking-[0.12em] uppercase">
                  {route.badge}
                </span>
              ) : null}
            </div>
            <h3 className="mt-5 mb-0 font-serif text-[27px] leading-[0.98] font-semibold tracking-[-0.035em]">
              {route.title}
            </h3>
            <p className="mt-4 mb-0 text-sm leading-[1.5] text-[#555950]">{route.description}</p>
            <ul className="mt-5 grid gap-2 border-t border-black/10 pt-4 text-sm leading-[1.4] text-[#34372f]">
              {route.bullets.map((bullet) => (
                <li className="grid grid-cols-[9px_1fr] gap-2" key={bullet}>
                  <span aria-hidden="true" className="mt-[0.45em] size-[5px] bg-[#8bd100]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              className="mt-auto inline-flex min-h-12 items-center justify-between border-t border-black/15 pt-5 text-[12px] font-black tracking-[0.12em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
              href={route.href}
            >
              {route.ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-6 mb-0 text-[12px] leading-[1.55] text-[#5c6056]">
        Financing and mortgage investments remain subject to underwriting, documentation, available
        capital, property review, lender or investor approval, and applicable risk disclosures.
      </p>
    </StaticSectionShell>
  )
}

export function FairlendStaticBuildModel(): ReactElement {
  return (
    <StaticSectionShell
      eyebrow="The FairLend build model"
      intro="One coordinated file connects feasibility, capital, milestone draws, build support, and the eventual exit instead of treating each decision as a separate transaction."
      title="Model the deal before the deal models you."
    >
      <ol className="mt-8 grid gap-px border border-black/15 bg-black/15 md:grid-cols-2 lg:grid-cols-5">
        {fairlendBuildModelStages.map((stage, index) => (
          <li className="bg-[#fbfaf6] p-5" key={stage.name}>
            <span className="text-xs font-black tracking-[0.16em] text-[#5b6055] uppercase">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-5 mb-0 font-serif text-[27px] leading-none font-semibold">
              {stage.name}
            </h3>
            <p className="mt-4 mb-0 text-sm leading-[1.55] text-[#555950]">{stage.summary}</p>
          </li>
        ))}
      </ol>
      <Link
        className="mt-8 inline-flex min-h-12 w-fit items-center gap-5 border-b-4 border-[#b7ff05] text-[12px] font-black tracking-[0.13em] uppercase"
        href={consultationHref}
      >
        Book a free project review <span aria-hidden="true">→</span>
      </Link>
    </StaticSectionShell>
  )
}

export function FairlendStaticBuilderConsulting(): ReactElement {
  return (
    <StaticSectionShell
      eyebrow="Builder consulting"
      intro="FairLend helps model the financing and business equation around a build while the builder remains in control of cost and execution."
      title="Density changed the equation. Plan accordingly."
    >
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {fairlendBuilderEconomicsTimeline.map((item) => (
          <article className="border border-black/15 bg-white/70 p-6" key={item.label}>
            <h3 className="m-0 font-serif text-[27px] leading-[1.02] font-semibold">
              {item.label}
            </h3>
            <p className="mt-5 mb-0 text-sm leading-[1.55] text-[#555950]">{item.summary}</p>
          </article>
        ))}
      </div>
      <p className="mt-7 mb-0 max-w-[82ch] text-[12px] leading-[1.6] text-[#5c6056]">
        The timeline uses illustrative assumptions, not an appraisal, investment forecast, profit
        projection, or financing commitment. Every site, budget, permit path, and exit requires its
        own review.
      </p>
    </StaticSectionShell>
  )
}

export function FairlendStaticLeadershipTeam(): ReactElement {
  return (
    <StaticSectionShell
      eyebrow="Leadership and accountability"
      intro="Capital alone does not close a complex file. The team aligns mortgage expertise, technology, operations, financial controls, and legal judgment behind it."
      title="The team behind the file."
    >
      <div className="mt-8 grid gap-px border border-black/15 bg-black/15 md:grid-cols-2 lg:grid-cols-4">
        {fairlendLeadershipTeam.map((member) => (
          <article className="bg-[#fbfaf6] p-6" key={member.name}>
            <h3 className="m-0 font-serif text-[27px] leading-none font-semibold">{member.name}</h3>
            <p className="mt-3 mb-0 text-xs font-black tracking-[0.12em] text-[#567d00] uppercase">
              {member.role}
            </p>
            <p className="mt-5 mb-0 text-sm leading-[1.55] text-[#555950]">{member.summary}</p>
          </article>
        ))}
      </div>
      <p className="mt-7 mb-0 max-w-[72ch] text-sm leading-[1.6] text-[#4f534a]">
        FairLend Mortgage is the operating name of Fairlend Management Inc., FSRA mortgage brokerage
        licence #13827 and mortgage administrator licence #13828. Elie Soberano is the Principal
        Broker, licence #M08001537.
      </p>
    </StaticSectionShell>
  )
}

export function FairlendStaticEthos(): ReactElement {
  return (
    <StaticSectionShell
      eyebrow={ETHOS_COPY.eyebrow}
      intro={ETHOS_COPY.opening}
      title={ETHOS_COPY.headline}
    >
      <p className="mt-8 mb-0 max-w-[900px] font-serif text-[clamp(25px,3.2vw,42px)] leading-[1.08] font-medium tracking-[-0.025em]">
        {ETHOS_COPY.pullQuote}
      </p>
      <div className="mt-9 grid gap-px border border-black/15 bg-black/15 md:grid-cols-2 lg:grid-cols-4">
        {ALIGNED_INTERESTS.map((interest) => (
          <article className="bg-[#fbfaf6] p-5" key={interest.code}>
            <span className="text-xs font-black tracking-[0.15em] text-[#5b6055] uppercase">
              {interest.code} / {interest.audience}
            </span>
            <p className="mt-5 mb-0 text-sm leading-[1.55] text-[#454940]">{interest.copy}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 mb-0 max-w-[72ch] text-base leading-[1.65] text-[#555950]">
        {ETHOS_COPY.vision}
      </p>
    </StaticSectionShell>
  )
}

export function FairlendStaticFaq(): ReactElement {
  return (
    <StaticSectionShell
      eyebrow="Frequently asked questions"
      intro="Clear answers for borrowers, investors, builders, and partners remain available even when JavaScript is unavailable."
      title="Your questions, mapped to the financing journey."
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {fairlendFaqGroups.map((group, groupIndex) => (
          <details
            className="group border border-black/15 bg-white/72 p-5 open:bg-white"
            key={group.id}
            open={groupIndex === 0}
          >
            <summary className="cursor-pointer list-none pr-8 font-serif text-[27px] leading-none font-semibold marker:hidden">
              {group.label}
              <span aria-hidden="true" className="float-right font-sans text-lg">
                +
              </span>
            </summary>
            <p className="mt-4 mb-0 text-sm leading-[1.5] text-[#5c6056]">{group.summary}</p>
            <div className="mt-5 grid gap-5 border-t border-black/12 pt-5">
              {group.items.map((item) => (
                <article key={item.id}>
                  <h3 className="m-0 text-sm leading-[1.4] font-bold">{item.question}</h3>
                  <p className="mt-2 mb-0 text-sm leading-[1.55] text-[#555950]">{item.answer}</p>
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>
      <Link
        className="mt-8 inline-flex min-h-12 w-fit items-center gap-5 border-b-4 border-[#b7ff05] text-[12px] font-black tracking-[0.13em] uppercase"
        href={consultationHref}
      >
        Ask FairLend about your file <span aria-hidden="true">→</span>
      </Link>
    </StaticSectionShell>
  )
}
