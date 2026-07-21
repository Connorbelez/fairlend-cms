import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  torontoCloudLayers,
  torontoHeroAssets,
} from '@/components/FairlendLandingHero/toronto-scene-assets'
import { GardenSuiteOpportunityBadge } from '@/components/GardenSuiteOpportunityBadge'
import { Highlighter } from '@/components/ui/highlighter'
import {
  buildFairlendIntakeHref,
  fairlendRentalPropertyAcquisitionSource,
  fairlendRentalPropertyRefinanceSource,
} from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

import { DrawFlowInterestBadge, MliSelectReadinessBadge } from './DrawFlowInterestBadge'
import styles from './overview-section.module.css'

const assetBase = '/assets/about-webp/webp'

const overviewAssets = {
  bridgeLoansIcon: `${assetBase}/finance-icon-bridge-loans.webp`,
  gardenSuitesIcon: `${assetBase}/finance-icon-garden-suites.webp`,
  mortgageInvestmentsIcon: `${assetBase}/finance-icon-mortgage-investments.webp`,
  multiplexFinancingIcon: `${assetBase}/finance-icon-multiplex-financing.webp`,
  purposeBuiltRentalsIcon: `${assetBase}/finance-icon-purpose-built-rentals.webp`,
  residentialMortgagesIcon: `${assetBase}/finance-icon-residential-private-mortgages.webp`,
} as const

const overviewCloudKeys = [
  'upper-west',
  'upper-east',
  'mid-west',
  'mid-east',
  'low-west',
  'low-east',
  'far-east',
] as const

type OverviewCloudLayerProps = {
  className: string
  height: number
  src: string
  width: number
}

type FinanceCopyEmphasis = {
  action: 'highlight' | 'underline'
  phrase: string
}

const expertiseItems = [
  {
    copy: 'Grounded in communities across Canada.',
    Icon: UsersRound,
    title: 'Local Expertise',
    withHeart: true,
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
  withHeart?: boolean
}>

export const financeItems = [
  {
    code: '01',
    copy: 'Institutional and private residential mortgage options, including purchases, first homes, and equity access.',
    emphasis: { action: 'highlight', phrase: 'Institutional and private' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'landing-overview-residential-mortgages',
    }),
    image: overviewAssets.residentialMortgagesIcon,
    title: 'Residential Mortgages',
  },
  {
    code: '02',
    copy: 'Flexible revolving credit reviewed around available home equity, property value, mortgage position, and repayment capacity.',
    emphasis: { action: 'underline', phrase: 'Flexible revolving credit' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'landing-overview-heloc',
    }),
    image: overviewAssets.residentialMortgagesIcon,
    title: 'Home Equity Line of Credit (HELOC)',
  },
  {
    code: '03',
    copy: 'Short-term capital to bridge gaps and close fast with our 24-hour target for commitment.',
    emphasis: { action: 'highlight', phrase: '24-hour target for commitment' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'landing-overview-bridge-loans',
    }),
    image: overviewAssets.bridgeLoansIcon,
    title: 'Bridge Loans',
  },
  {
    code: '04',
    copy: 'Residential home refinancing to renew a mortgage, consolidate obligations, or unlock equity with terms reviewed around the property and exit plan.',
    emphasis: { action: 'underline', phrase: 'Residential home refinancing' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'landing-overview-residential-refinancing',
    }),
    image: overviewAssets.residentialMortgagesIcon,
    title: 'Residential Refinancing',
  },
  {
    code: '05',
    copy: 'Financing and guidance for renovations, with local contractor and supplier connections to keep the project on track.',
    emphasis: { action: 'highlight', phrase: 'Financing and guidance' },
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'renovation-financing',
      source: 'landing-overview-renovation-financing',
    }),
    image: overviewAssets.mortgageInvestmentsIcon,
    title: 'Renovation Financing',
  },
  {
    code: '06',
    copy: 'Financing and guidance with local expertise for five-unit to multi-tower complexes. From permits through completion and CMHC takeout, FairLend coordinates the financing path.',
    emphasis: { action: 'underline', phrase: 'five-unit to multi-tower complexes' },
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'multiplex-financing',
      source: 'landing-overview-multiplex-financing',
    }),
    image: overviewAssets.multiplexFinancingIcon,
    title: 'Multi-plex Financing',
  },
  {
    callout: 'garden-suite-opportunity',
    code: '07',
    copy: 'Backyard and laneway homes financed by a team that knows permits, budgets, and timelines.',
    emphasis: { action: 'highlight', phrase: 'knows permits, budgets, and timelines' },
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'garden-laneway-suites',
      source: 'landing-overview-garden-laneway-suites',
    }),
    image: overviewAssets.gardenSuitesIcon,
    title: 'Garden & Laneway Suites',
  },
  {
    callout: 'mli-select-readiness',
    code: '08',
    copy: 'One-stop financing, planning, and MLI\u00a0Select\u00a0guidance—plus access to the partner consultants and professionals needed to prepare for qualification.',
    emphasis: {
      action: 'underline',
      phrase: 'One-stop financing, planning, and MLI\u00a0Select\u00a0guidance',
    },
    href: buildFairlendIntakeHref({
      intent: 'build',
      projectScope: 'mli-select-insured-housing',
      source: 'landing-overview-mli-select-insured-housing',
    }),
    image: overviewAssets.purposeBuiltRentalsIcon,
    title: 'MLI-Select Insured Housing',
  },
  {
    code: '09',
    copy: 'Flexible acquisition financing for stabilized rental properties, underwritten around income, asset quality, and closing timelines.',
    emphasis: { action: 'highlight', phrase: 'Flexible acquisition financing' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: fairlendRentalPropertyAcquisitionSource,
    }),
    image: overviewAssets.purposeBuiltRentalsIcon,
    title: 'Acquisition of Existing Rental Properties',
  },
  {
    code: '10',
    copy: 'Refinance existing rental properties to renew debt, unlock equity, or improve the capital stack without disrupting operations.',
    emphasis: { action: 'underline', phrase: 'Refinance existing rental properties' },
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: fairlendRentalPropertyRefinanceSource,
    }),
    image: overviewAssets.residentialMortgagesIcon,
    title: 'Refinancing of Existing Rental Properties',
  },
] as const

const financeGroups = [
  {
    items: financeItems.slice(0, 4),
    label: 'Core lending',
    withDrawFlowInterestBadge: false,
  },
  {
    items: financeItems.slice(4, 8),
    label: 'Project and rental programs',
    withDrawFlowInterestBadge: true,
  },
  {
    items: financeItems.slice(8),
    label: 'Refinancing & Acquisitions',
    withDrawFlowInterestBadge: false,
  },
] as const

const electricLime = '#9DFF00'

function SectionLabel({ children, number }: { children: string; number: string }) {
  return (
    <div
      className="grid grid-cols-1 justify-items-center gap-[12px] text-center md:grid-cols-[auto_minmax(92px,0.45fr)_minmax(128px,0.55fr)] md:items-center md:justify-items-stretch md:gap-[22px] md:text-left"
      data-overview-section-label
    >
      <p className="m-0 shrink-0 text-[12.5px] leading-none font-bold tracking-[0.08em] text-[#050506] uppercase">
        <span
          className="mr-2 text-[18px] font-extrabold tracking-normal"
          style={{ color: electricLime }}
        >
          {number}
        </span>
        <span
          className="mr-3 text-[18px] font-normal tracking-normal"
          style={{ color: electricLime }}
        >
          /
        </span>
        {children}
      </p>
      <span aria-hidden="true" className="hidden h-px bg-[#08090a]/42 md:block" />
      <span aria-hidden="true" className="hidden h-px bg-[#08090a]/42 md:block" />
    </div>
  )
}

function ExpertiseCard({
  copy,
  Icon,
  title,
  withHeart,
}: {
  copy: string
  Icon: LucideIcon
  title: string
  withHeart?: boolean
}) {
  return (
    <article
      className={cn(
        'grid min-h-0 grid-cols-[44px_minmax(0,1fr)] grid-rows-none items-center gap-x-3 border border-[#08090a] bg-[#9DFF00] px-4 py-4 text-left shadow-[3px_3px_0_#08090a] md:min-h-[148px] md:grid-cols-none md:grid-rows-[42px_auto_1fr] md:items-start md:gap-x-0 md:px-[10px] md:py-[18px]',
        styles.expertiseCard,
      )}
      data-overview-expertise-card
    >
      <span
        className="relative grid size-[38px] place-items-center text-[#08090a]"
        data-overview-expertise-icon
      >
        <Icon aria-hidden="true" className="size-[31px]" strokeWidth={1.7} />
        {withHeart ? (
          <Heart
            aria-hidden="true"
            className="absolute -top-0.5 -right-2 size-[14px] fill-[#08090a] text-[#08090a]"
            strokeWidth={2.2}
          />
        ) : null}
      </span>
      <h3 className="m-0 max-w-none text-[15px] leading-[1.03] font-extrabold tracking-[0.01em] text-[#08090a] uppercase md:max-w-[126px]">
        {title}
      </h3>
      <p
        className={cn(
          'col-start-2 m-0 mt-[4px] max-w-none text-[13px] leading-[1.28] font-medium text-[#08090a] md:col-start-auto md:mt-[10px] md:max-w-[138px]',
          styles.expertiseCopy,
        )}
        data-overview-expertise-copy
      >
        {copy}
      </p>
    </article>
  )
}

function FinanceCopy({ copy, emphasis }: { copy: string; emphasis: FinanceCopyEmphasis }) {
  const phraseStart = copy.indexOf(emphasis.phrase)

  if (phraseStart === -1) return copy

  const before = copy.slice(0, phraseStart)
  const phrase = copy.slice(phraseStart, phraseStart + emphasis.phrase.length)
  const after = copy.slice(phraseStart + emphasis.phrase.length)
  const isHighlight = emphasis.action === 'highlight'

  return (
    <>
      {before}
      <strong className="font-semibold text-[#08090a]">
        <Highlighter
          action={emphasis.action}
          animate={false}
          color={isHighlight ? 'rgba(150, 236, 24, 0.52)' : '#96ec18'}
          iterations={isHighlight ? 1 : 2}
          padding={isHighlight ? 2 : 1}
          strokeWidth={isHighlight ? 2.2 : 2.6}
        >
          {phrase}
        </Highlighter>
      </strong>
      {after}
    </>
  )
}

function FinanceCard({
  callout,
  code,
  copy,
  emphasis,
  href,
  image,
  title,
}: {
  callout?: 'garden-suite-opportunity' | 'mli-select-readiness'
  code: string
  copy: string
  emphasis: FinanceCopyEmphasis
  href: string
  image: string
  title: string
}) {
  return (
    <article className="h-full" data-overview-finance-card>
      <Link
        aria-label={`${title} financing details`}
        className={cn(
          'group relative isolate flex h-full min-h-[289px] flex-col overflow-hidden p-3 text-[#08090a] no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96ec18]',
          styles.financeDossierCard,
        )}
        href={href}
      >
        <div className="absolute inset-3 translate-x-1 translate-y-1 rotate-[0.8deg] border border-[#08090a]/28 bg-[#d8d7d0]" />
        <div
          className={cn(
            'relative z-10 flex h-full flex-1 flex-col border border-[#08090a] bg-[#f8f7f5] p-[15px]',
            styles.financeDossierSheet,
          )}
        >
          <div className="flex items-start justify-between border-b border-[#08090a]/25 pb-3">
            <div>
              <p className="m-0 text-[10px] font-extrabold tracking-[0.16em] text-[#72b900] uppercase">
                File {code}
              </p>
              <h3 className="mt-2 mb-0 max-w-[175px] text-[19px] leading-[0.96] font-extrabold uppercase">
                {title}
              </h3>
            </div>
            <Image
              alt=""
              aria-hidden="true"
              className="h-[70px] w-[82px] object-contain mix-blend-multiply [filter:grayscale(1)_contrast(1.18)]"
              data-overview-finance-image
              height={512}
              loading="lazy"
              sizes="82px"
              src={image}
              width={512}
            />
          </div>
          <p className="my-4 w-full text-[13px] leading-[1.42] text-[#08090a]/78 text-pretty">
            <FinanceCopy copy={copy} emphasis={emphasis} />
          </p>
          {callout === 'garden-suite-opportunity' ? (
            <GardenSuiteOpportunityBadge className="mb-4" />
          ) : null}
          {callout === 'mli-select-readiness' ? <MliSelectReadinessBadge className="mb-4" /> : null}
          <span className="mt-auto flex items-center justify-between border-t border-[#08090a]/25 pt-3 text-[10px] font-extrabold tracking-[0.09em] uppercase">
            Open deal file <ArrowRight className="size-5 text-[#72b900]" />
          </span>
        </div>
      </Link>
    </article>
  )
}

function OverviewCloudLayer({ className, height, src, width }: OverviewCloudLayerProps) {
  return (
    <span aria-hidden="true" className={cn('absolute block', className)} data-overview-cloud>
      <span className="block">
        <Image
          alt=""
          className="block h-auto w-full select-none object-contain opacity-[0.58] [filter:contrast(1.04)_brightness(1.04)] [-webkit-user-drag:none]"
          height={height}
          loading="lazy"
          sizes="(max-width: 1024px) 36vw, 18vw"
          src={src}
          width={width}
        />
      </span>
    </span>
  )
}

function TorontoIllustration() {
  const clouds = torontoCloudLayers.filter((layer) =>
    overviewCloudKeys.includes(layer.key as (typeof overviewCloudKeys)[number]),
  )
  const cloudPositions: Record<(typeof overviewCloudKeys)[number], string> = {
    'far-east': 'right-[3%] top-[47%] w-[12%] min-w-[86px] opacity-[0.42]',
    'low-east': 'right-[9%] top-[32%] w-[17%] min-w-[128px] opacity-[0.44]',
    'low-west': 'left-[33%] top-[39%] w-[18%] min-w-[150px] opacity-[0.42]',
    'mid-east': 'right-[23%] top-[40%] w-[9%] min-w-[78px] opacity-[0.4]',
    'mid-west': 'left-[51%] top-[14%] w-[22%] min-w-[180px] opacity-[0.44]',
    'upper-east': 'right-[1%] top-[16%] w-[22%] min-w-[194px] opacity-[0.4]',
    'upper-west': 'left-[56%] top-[51%] w-[13%] min-w-[110px] opacity-[0.36]',
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
    >
      {clouds.map((layer) => (
        <OverviewCloudLayer
          {...layer}
          className={cloudPositions[layer.key as (typeof overviewCloudKeys)[number]]}
          key={layer.key}
        />
      ))}
      <div className="fairlend-toronto-skyline absolute inset-0">
        <Image
          alt=""
          aria-hidden="true"
          className="absolute bottom-[-28px] left-[-14%] h-auto w-[160%] max-w-none opacity-[0.82] grayscale [filter:grayscale(1)_contrast(1.12)_brightness(1.02)]"
          data-overview-skyline
          height={1000}
          loading="lazy"
          sizes="58vw"
          src={torontoHeroAssets.skyline}
          width={1600}
        />
      </div>
    </div>
  )
}

export function FairlendLandingOverviewSection() {
  return (
    <section
      aria-label="FairLend company and finance overview"
      className="relative isolate overflow-x-clip bg-[#fbfaf7] px-5 py-10 text-[#08090a] [font-family:var(--font-inter),Arial,sans-serif] sm:px-8 lg:min-h-[100svh] lg:px-[49px] lg:py-[58px]"
      data-fairlend-section="landing-overview"
      data-testid="fairlend-landing-overview-section"
      id="overview"
    >
      <div className="mx-auto grid w-full max-w-[1672px] gap-12 lg:min-h-[calc(100svh-116px)] lg:grid-cols-2 lg:items-start lg:gap-0 2xl:grid-cols-[minmax(0,1fr)_660px]">
        <div
          className="relative isolate flex min-h-[760px] min-w-0 flex-col overflow-hidden lg:sticky lg:top-[58px] lg:min-h-[calc(100svh-116px)] lg:self-start"
          data-overview-who-panel
        >
          <TorontoIllustration />

          <div className="relative z-10 mx-auto max-w-[622px] text-center md:mx-0 md:text-left">
            <SectionLabel number="01">Who We Are</SectionLabel>
            <h2
              className="mx-auto mt-[29px] mb-0 max-w-[600px] text-wrap font-serif text-[clamp(58px,5.28vw,82px)] leading-[1.06] font-medium tracking-[-0.055em] text-[#050506] md:mx-0 md:leading-[0.95]"
              data-overview-title
            >
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span className="block" data-overview-title-line>
                  Building the future
                </span>
              </span>
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span className="block" data-overview-title-line>
                  of Fair Lending
                </span>
              </span>
            </h2>

            <div
              className="mx-auto mt-[28px] max-w-[388px] space-y-[14px] text-[14px] leading-[1.45] font-normal text-[#08090a] md:mx-0"
              data-overview-copy
            >
              <p className="m-0">
                FairLend is an{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="underline"
                    animate={false}
                    color="#96ec18"
                    iterations={3}
                    padding={3}
                    strokeWidth={3}
                  >
                    FSRA-licensed
                  </Highlighter>
                </strong>{' '}
                mortgage brokerage and administrator specializing in{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="highlight"
                    animate={false}
                    color="rgba(150, 236, 24, 0.52)"
                    iterations={2}
                    padding={4}
                    strokeWidth={2.4}
                  >
                    residential mortgages
                  </Highlighter>
                </strong>
                {', '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="highlight"
                    animate={false}
                    color="rgba(150, 236, 24, 0.56)"
                    iterations={2}
                    padding={4}
                    strokeWidth={2.4}
                  >
                    private lending
                  </Highlighter>
                </strong>{' '}
                and{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="highlight"
                    animate={false}
                    color="rgba(150, 236, 24, 0.62)"
                    iterations={2}
                    padding={4}
                    strokeWidth={2.6}
                  >
                    construction financing
                  </Highlighter>
                </strong>
                {'.'}
              </p>
              <p className="m-0">
                We combine seasoned mortgage judgment with modern technology and clear processes,
                helping borrowers, builders, and investors move faster without losing the human
                diligence private lending depends on.
              </p>
              <p className="m-0">
                With borrower consent, open banking lets us{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="underline"
                    animate={false}
                    color="#96ec18"
                    iterations={2}
                    padding={2}
                    strokeWidth={2.8}
                  >
                    analyze up to 4,500 financial data points
                  </Highlighter>
                </strong>{' '}
                to assess creditworthiness using cash-flow patterns and other signals conventional
                bank underwriting can miss.
              </p>
              <p className="m-0">
                Private lending should be{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="underline"
                    animate={false}
                    color="#96ec18"
                    iterations={2}
                    padding={3}
                    strokeWidth={3.2}
                  >
                    practical, transparent, and fair
                  </Highlighter>
                </strong>{' '}
                for everyone involved.
              </p>
            </div>
          </div>

          <div
            className={cn(
              'relative z-10 mx-auto mt-[36px] grid w-full max-w-[420px] gap-3 md:mx-0 md:mt-[52px] md:max-w-[486px] md:grid-cols-3 md:gap-[6px]',
              styles.expertiseGrid,
            )}
            data-overview-expertise-grid
          >
            {expertiseItems.map((item) => (
              <ExpertiseCard key={item.title} {...item} />
            ))}
          </div>

          <div className="relative mt-auto block h-[320px] lg:hidden" data-overview-mobile-skyline>
            <Image
              alt=""
              aria-hidden="true"
              className="object-contain object-bottom opacity-[0.82] grayscale [filter:grayscale(1)_contrast(0.86)_brightness(1.15)]"
              fill
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), 0px"
              src={torontoHeroAssets.skyline}
            />
          </div>
        </div>

        <div
          className="relative z-10 flex min-h-[760px] min-w-0 flex-col lg:min-h-[calc(100svh-116px)]"
          data-overview-finance-panel
        >
          <div className="mx-auto max-w-[560px] text-center lg:ml-[35px] lg:text-left">
            <SectionLabel number="02">What We Finance</SectionLabel>
            <h2
              className="mx-auto mt-[42px] mb-0 max-w-[520px] text-wrap font-serif text-[clamp(48px,4.05vw,63px)] leading-[0.96] font-medium tracking-[-0.052em] text-[#050506] lg:mx-0"
              data-overview-title
            >
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span className="block" data-overview-title-line>
                  Flexible capital for
                </span>
              </span>
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span className="block" data-overview-title-line>
                  every situation.
                </span>
              </span>
            </h2>
            <p
              className="mx-auto mt-[14px] mb-0 max-w-[430px] text-[14px] leading-[1.42] font-medium text-[#08090a] lg:mx-0"
              data-overview-summary
            >
              From private mortgages to permit-heavy rental projects, these are the financing paths
              FairLend supports across Southern Ontario.
            </p>
          </div>

          <div className="mt-[22px] grid gap-[15px]">
            {financeGroups.map((group) => (
              <div
                className="grid gap-[8px] rounded-sm border border-transparent data-[finance-group='Core-lending']:border-[#08090a]/12 data-[finance-group='Core-lending']:bg-white/45 data-[finance-group='Core-lending']:p-3 data-[finance-group='Core-lending']:shadow-[3px_3px_0_rgba(8,9,10,0.08)]"
                data-finance-group={group.label.replaceAll(' ', '-')}
                key={group.label}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <p
                    className="m-0 grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-[12px] text-[11px] leading-none font-extrabold tracking-[0.14em] text-[#08090a]/68 uppercase"
                    data-overview-finance-label
                  >
                    <span>{group.label}</span>
                    <span aria-hidden="true" className="h-px bg-[#08090a]/18" />
                  </p>
                  {group.withDrawFlowInterestBadge ? <DrawFlowInterestBadge /> : null}
                </div>
                <div className="grid gap-[14px] sm:grid-cols-2">
                  {group.items.map((item) => (
                    <FinanceCard key={item.code} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] ml-[52px]">
            <span
              aria-hidden="true"
              className="mb-[10px] block h-[2px] w-[38px]"
              data-overview-connector
              style={{ backgroundColor: electricLime }}
            />
            <p
              className="m-0 font-serif text-[21px] leading-[1.18] font-medium tracking-[-0.025em] text-[#050506]"
              data-overview-summary
            >
              Disciplined capital. Local insight.
              <br />
              Aligned outcomes.
            </p>
          </div>

          <div aria-hidden="true" className="mt-[-12px] hidden h-[34px] justify-end lg:flex">
            <span
              className="mr-[78px] mt-0 grid w-[292px] gap-[9px]"
              style={{ color: electricLime }}
            >
              <span
                className="block h-px w-[270px] origin-right rotate-[-2deg] bg-current"
                data-overview-connector
              />
              <span
                className="ml-auto block h-px w-[210px] origin-right rotate-[2deg] bg-current"
                data-overview-connector
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
