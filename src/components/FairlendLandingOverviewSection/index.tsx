import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Heart, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  torontoCloudLayers,
  torontoHeroAssets,
} from '@/components/FairlendLandingHero/toronto-scene-assets'
import { Highlighter } from '@/components/ui/highlighter'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

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
  delay: string
  driftDuration: string
  driftX: string
  driftY: string
  enterX: string
  enterY: string
  height: number
  src: string
  width: number
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

const financeItems = [
  {
    code: '01',
    copy: '1st, 2nds, 3rd+, fully automated digital servicing.',
    href: buildFairlendIntakeHref({
      intent: 'mortgage',
      source: 'landing-overview-residential-private-mortgages',
    }),
    image: overviewAssets.residentialMortgagesIcon,
    title: 'Residential Private Mortgages',
  },
  {
    code: '02',
    copy: 'Short-term capital to bridge gaps and close fast with our 72-hour commitment SLA.',
    href: buildFairlendIntakeHref({
      intent: 'build',
      source: 'landing-overview-bridge-loans',
    }),
    image: overviewAssets.bridgeLoansIcon,
    title: 'Bridge Loans',
  },
  {
    code: '03',
    copy: 'Permit-smart capital backed by GTA contractors and suppliers to finish on budget.',
    href: buildFairlendIntakeHref({
      intent: 'build',
      source: 'landing-overview-renovation-financing',
    }),
    image: overviewAssets.mortgageInvestmentsIcon,
    title: 'Renovation Financing',
  },
  {
    code: '04',
    copy: 'Local GTA expertise for 3-20 unit properties, from permits to digital deal-room funding.',
    href: buildFairlendIntakeHref({
      intent: 'build',
      source: 'landing-overview-multiplex-financing',
    }),
    image: overviewAssets.multiplexFinancingIcon,
    title: 'Multi-plex Financing',
  },
  {
    code: '05',
    copy: 'Backyard and laneway homes financed by a team that knows permits, budgets and timelines.',
    href: buildFairlendIntakeHref({
      intent: 'build',
      source: 'landing-overview-garden-laneway-suites',
    }),
    image: overviewAssets.gardenSuitesIcon,
    title: 'Garden & Laneway Suites',
  },
  {
    code: '06',
    copy: 'Insured rental-housing capital with streamlined underwriting and phone-ready closing.',
    href: buildFairlendIntakeHref({
      intent: 'invest',
      source: 'landing-overview-mli-select-insured-housing',
    }),
    image: overviewAssets.purposeBuiltRentalsIcon,
    title: 'MLI-Select Insured Housing',
  },
] as const

const financeGroups = [
  {
    items: financeItems.slice(0, 2),
    label: 'Core lending',
  },
  {
    items: financeItems.slice(2),
    label: 'Project and rental programs',
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
      className="grid min-h-0 grid-cols-[44px_minmax(0,1fr)] grid-rows-none items-center gap-x-3 border border-[#08090a]/14 px-4 py-4 text-left md:min-h-[148px] md:grid-cols-none md:grid-rows-[42px_auto_1fr] md:items-start md:gap-x-0 md:border-0 md:border-l md:px-[10px] md:py-[18px] md:first:border-l-0"
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
            className="absolute -top-0.5 -right-2 size-[14px]"
            strokeWidth={2.2}
            style={{ color: electricLime, fill: electricLime }}
          />
        ) : null}
      </span>
      <h3
        className="m-0 max-w-none text-[15px] leading-[1.03] font-extrabold tracking-[0.01em] uppercase md:max-w-[126px]"
        style={{ color: electricLime }}
      >
        {title}
      </h3>
      <p className="col-start-2 m-0 mt-[4px] max-w-none text-[13px] leading-[1.28] font-medium text-[#08090a] md:col-start-auto md:mt-[10px] md:max-w-[138px]">
        {copy}
      </p>
    </article>
  )
}

function FinanceCard({
  code,
  copy,
  href,
  image,
  title,
}: {
  code: string
  copy: string
  href: string
  image: string
  title: string
}) {
  return (
    <article className="h-full" data-overview-finance-card>
      <Link
        aria-label={`${title} financing details`}
        className="group relative isolate grid h-full min-h-[172px] grid-cols-[96px_minmax(0,1fr)] gap-[15px] overflow-hidden border border-[#08090a]/16 bg-[#fbfaf7]/72 px-[14px] py-[14px] text-inherit no-underline transition-[border-color,background-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-[#08090a]/34 hover:bg-[#fbfaf7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08090a] sm:grid-cols-[106px_minmax(0,1fr)]"
        href={href}
      >
        <div aria-hidden="true" className="relative self-center">
          <Image
            alt=""
            className="h-auto w-full object-contain grayscale [filter:grayscale(1)_contrast(1.34)_brightness(0.86)]"
            data-overview-finance-image
            height={512}
            loading="lazy"
            sizes="110px"
            src={image}
            width={512}
          />
        </div>

        <div className="min-w-0">
          <p
            className="m-0 text-[18px] leading-none font-extrabold tracking-[0.02em]"
            style={{ color: electricLime }}
          >
            {code}
          </p>
          <h3 className="mt-[8px] mb-0 max-w-[154px] text-[15.3px] leading-[1.05] font-extrabold tracking-[0.006em] text-[#050506] uppercase">
            {title}
          </h3>
          <p className="mt-[7px] mb-0 max-w-[206px] text-[13px] leading-[1.24] font-normal text-[#08090a]">
            {copy}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="absolute right-[9px] bottom-[8px] grid size-11 place-items-center"
        >
          <span
            className="grid size-[28px] place-items-center transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
            style={{ color: electricLime }}
          >
            <ArrowRight aria-hidden="true" className="size-[22px]" strokeWidth={2} />
          </span>
        </span>
      </Link>
    </article>
  )
}

function OverviewCloudLayer({
  className,
  delay,
  driftDuration,
  driftX,
  driftY,
  enterX,
  enterY,
  height,
  src,
  width,
}: OverviewCloudLayerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('fairlend-toronto-cloud absolute block', className)}
      data-overview-cloud
      style={
        {
          '--cloud-delay': delay,
          '--cloud-drift-duration': driftDuration,
          '--cloud-drift-x': driftX,
          '--cloud-drift-y': driftY,
          '--cloud-enter-x': enterX,
          '--cloud-enter-y': enterY,
        } as CSSProperties
      }
    >
      <span className="fairlend-toronto-cloud-drift block">
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
      className="relative isolate overflow-hidden bg-[#fbfaf7] px-5 py-10 text-[#08090a] [font-family:var(--font-inter),Arial,sans-serif] sm:px-8 lg:min-h-[100svh] lg:px-[49px] lg:py-[58px]"
      data-fairlend-motion="landing-overview"
      data-testid="fairlend-landing-overview-section"
      id="overview"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <span
          className="absolute top-[34%] left-0 block h-px w-full origin-left bg-[#9DFF00]/80 opacity-0 mix-blend-multiply"
          data-overview-scan="x"
        />
        <span
          className="absolute top-0 left-[58%] hidden h-full w-px origin-top bg-[#9DFF00]/70 opacity-0 mix-blend-multiply lg:block"
          data-overview-scan="y"
        />
      </div>
      <div className="mx-auto grid w-full max-w-[1672px] gap-12 lg:min-h-[calc(100svh-116px)] lg:grid-cols-2 lg:gap-0 2xl:grid-cols-[minmax(0,1fr)_660px]">
        <div
          className="relative isolate flex min-h-[760px] min-w-0 flex-col overflow-hidden lg:min-h-[calc(100svh-116px)]"
          data-overview-who-panel
        >
          <TorontoIllustration />

          <div className="relative z-10 mx-auto max-w-[622px] text-center md:mx-0 md:text-left">
            <SectionLabel number="01">Who We Are</SectionLabel>
            <h2
              className="mx-auto mt-[29px] mb-0 max-w-[600px] text-wrap font-serif text-[clamp(58px,5.28vw,82px)] leading-[1.06] font-medium tracking-[-0.055em] text-[#050506] md:mx-0 md:leading-[0.95]"
              data-overview-title
            >
              <span className="block overflow-hidden">
                <span className="block" data-overview-title-line>
                  Licensed. Focused.
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block" data-overview-title-line>
                  Built for private lending.
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
                    animationDuration={950}
                    color="#96ec18"
                    isView
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
                    animationDuration={800}
                    color="rgba(150, 236, 24, 0.56)"
                    isView
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
                    animationDuration={860}
                    color="rgba(150, 236, 24, 0.62)"
                    isView
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
                Private lending should be{' '}
                <strong className="font-extrabold">
                  <Highlighter
                    action="underline"
                    animationDuration={1000}
                    color="#96ec18"
                    isView
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

          <div className="relative z-10 mx-auto mt-[36px] grid w-full max-w-[420px] gap-3 border-t border-[#08090a]/18 bg-[#fbfaf7] md:mx-0 md:mt-[52px] md:max-w-[486px] md:grid-cols-3 md:gap-0">
            {expertiseItems.map((item) => (
              <ExpertiseCard key={item.title} {...item} />
            ))}
          </div>

          <div className="relative mt-auto block h-[320px] lg:hidden" data-overview-mobile-skyline>
            <Image
              alt=""
              className="object-contain object-bottom opacity-[0.82] grayscale [filter:grayscale(1)_contrast(0.86)_brightness(1.15)]"
              fill
              sizes="100vw"
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
              <span className="block overflow-hidden">
                <span className="block" data-overview-title-line>
                  Flexible capital for
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block" data-overview-title-line>
                  every project.
                </span>
              </span>
            </h2>
            <p
              className="mx-auto mt-[14px] mb-0 max-w-[430px] text-[14px] leading-[1.42] font-medium text-[#08090a] lg:mx-0"
              data-overview-summary
            >
              From private mortgages to permit-heavy rental projects, these are the financing paths
              FairLend supports across the GTA.
            </p>
          </div>

          <div className="mt-[22px] grid gap-[15px]">
            {financeGroups.map((group) => (
              <div className="grid gap-[8px]" key={group.label}>
                <p
                  className="m-0 grid grid-cols-[auto_1fr] items-center gap-[12px] text-[11px] leading-none font-extrabold tracking-[0.14em] text-[#08090a]/68 uppercase"
                  data-overview-finance-label
                >
                  <span>{group.label}</span>
                  <span aria-hidden="true" className="h-px bg-[#08090a]/18" />
                </p>
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
