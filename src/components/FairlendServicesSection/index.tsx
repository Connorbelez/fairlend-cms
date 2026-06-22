'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Clock3, ShieldCheck, Target, UsersRound, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Expandable, ExpandableContent, useExpandable } from '@/components/ui/expandable'
import { cn } from '@/utilities/ui'

const assetBase = '/assets/service-concepts'

const serviceCards = [
  {
    audience: 'Private mortgage investors',
    cta: 'Invest Now',
    height: 929,
    howItWorks: {
      benefit: 'Deploy capital with a clear return profile and servicing handled after close.',
      outcomes: ['8-14% return framing', 'Digital deal closing', 'Servicing handled'],
      steps: [
        {
          detail:
            'Fairlend surfaces mortgage opportunities with the borrower, property, term, security, and exit path already organized for review.',
          title: 'Review the deal',
        },
        {
          detail:
            'Compare risk, return, loan position, timeline, and documentation before choosing where your capital fits.',
          title: 'Choose your position',
        },
        {
          detail:
            'Complete the commitment and closing flow digitally, with the paperwork and funds coordinated through the platform.',
          title: 'Close digitally',
        },
        {
          detail:
            'Receive servicing, updates, payout coordination, and reinvestment paths without chasing the file yourself.',
          title: 'Track through payout',
        },
      ],
    },
    id: 'private-mortgage-investments',
    image: `${assetBase}/private-mortgage-investments-icon.webp`,
    items: [
      'Digital / automated servicing',
      'Digital deal closing',
      'Find and close from your phone',
      '8-14% returns',
    ],
    number: '1',
    span: 'third',
    title: 'Private Mortgage Investments',
    width: 1097,
  },
  {
    audience: 'Private mortgage applicants',
    cta: 'Get Financed',
    height: 896,
    howItWorks: {
      benefit: 'Move from property details to a workable private mortgage path quickly.',
      outcomes: ['Commitment within 72 hours', '$0 payout fee', 'Flexible workout plans'],
      steps: [
        {
          detail:
            'Start with the property, mortgage position, timeline, and the issue that needs solving: purchase, refinance, payout, arrears, or bridge.',
          title: 'Submit the property',
        },
        {
          detail:
            'Fairlend reviews equity, income story, exit strategy, and lender fit instead of forcing a bank-style box.',
          title: 'Match the structure',
        },
        {
          detail:
            'You get the rate, fees, term, conditions, and timeline in plain language before committing.',
          title: 'Review the commitment',
        },
        {
          detail:
            'Closing, payout, renewal, or workout steps are coordinated so the file keeps moving after approval.',
          title: 'Close and manage',
        },
      ],
    },
    id: 'private-mortgage-applicants',
    image: `${assetBase}/multi-mortgage-house-shield-icon.webp`,
    items: [
      'Loan Commitment within 72 hours',
      '$0 payout fee',
      '$50 missed payment fee',
      'Flexible workout plans',
    ],
    number: '2',
    span: 'third',
    title: '1st, 2nd, 3rd+ Mortgages',
    width: 1133,
  },
  {
    audience: 'Builder investors',
    cta: 'View Projects',
    height: 889,
    howItWorks: {
      benefit:
        'Back construction opportunities with the build path, borrower story, and exit plan visible.',
      outcomes: ['Curated projects', 'Construction context', 'Clear exit strategy'],
      steps: [
        {
          detail:
            'Review projects by location, permit stage, budget, borrower experience, loan requirement, and expected exit.',
          title: 'See the project path',
        },
        {
          detail:
            'Fairlend packages the construction budget, security, draw logic, and borrower plan so the opportunity is easier to underwrite.',
          title: 'Underwrite the build',
        },
        {
          detail:
            'Choose whether the deal fits your return target, risk tolerance, timeline, and available capital.',
          title: 'Commit to the file',
        },
        {
          detail:
            'Stay informed through funding, draws, completion milestones, refinance, sale, or payout.',
          title: 'Track completion',
        },
      ],
    },
    id: 'construction-project-investing',
    image: `${assetBase}/construction-project-crane-icon.webp`,
    items: ['CMHC MLI Select available', '8-14% returns'],
    number: '3',
    span: 'third',
    title: 'Invest in a Construction Project',
    width: 981,
  },
  {
    audience: 'Builder borrowers',
    cta: 'Start Your Build',
    height: 854,
    howItWorks: {
      benefit: 'Turn a build plan into a financeable draw schedule and capital structure.',
      outcomes: ['Custom draw schedule', 'Build consultants', 'Contractor network'],
      steps: [
        {
          detail:
            'Share the site, permit stage, budget, purchase status, current financing, and completion goal.',
          title: 'Map the build stage',
        },
        {
          detail:
            'Fairlend designs the loan, equity stack, draw schedule, and exit strategy around how the project actually gets built.',
          title: 'Structure the capital',
        },
        {
          detail:
            'The commitment lays out funds available, conditions, fees, timing, and how draws will be handled.',
          title: 'Lock the plan',
        },
        {
          detail:
            'Draws, professionals, supplier access, and refinancing or sale paths stay connected through completion.',
          title: 'Fund through completion',
        },
      ],
    },
    id: 'build-financing',
    image: `${assetBase}/build-financing-plans-icon.webp`,
    items: [
      'Make your own draw schedule',
      'End-to-end complimentary build and finance consultants',
      'Access to network of contractors, professionals and suppliers',
    ],
    number: '4',
    span: 'half',
    title: 'Get Build Financing',
    width: 1264,
  },
  {
    audience: 'Referral and funding partners',
    cta: 'Partner With Us',
    height: 793,
    howItWorks: {
      benefit: 'Bring files into a specialist process without losing relationship visibility.',
      outcomes: ['Co-broker support', 'Specialist review', 'Aligned pipeline'],
      steps: [
        {
          detail:
            'Send the client, property, construction context, or investor opportunity with enough detail for an initial fit review.',
          title: 'Introduce the file',
        },
        {
          detail:
            'Fairlend identifies the financing, investor, broker, contractor, or professional path that best fits the situation.',
          title: 'Route the opportunity',
        },
        {
          detail:
            'The relationship, terms, timelines, and responsibilities are clarified before work moves forward.',
          title: 'Coordinate the handoff',
        },
        {
          detail:
            'Stay aligned through closing, follow-up, repeat files, and future opportunities.',
          title: 'Grow the relationship',
        },
      ],
    },
    id: 'partners',
    image: `${assetBase}/partners-handshake-puzzle-icon.webp`,
    items: [
      'Partner program for architects, real estate agents, contractors, and co-brokering for brokers',
    ],
    number: '5',
    span: 'half',
    title: 'Partners',
    width: 1050,
  },
] as const

type ServiceCardProps = (typeof serviceCards)[number]

type ServiceOverlayRect = {
  height: number
  left: number
  top: number
  width: number
}

type ActiveServiceOverlay = {
  id: ServiceCardProps['id']
  origin: ServiceOverlayRect
  target: ServiceOverlayRect
}

function ServiceArtwork({
  height,
  image,
  number,
  width,
  expanded = false,
}: Pick<ServiceCardProps, 'height' | 'image' | 'number' | 'width'> & { expanded?: boolean }) {
  return (
    <div
      className={cn(
        'pointer-events-none relative flex shrink-0 items-start justify-center',
        expanded
          ? 'h-[220px] md:h-[250px] lg:h-[min(38vh,318px)]'
          : 'mb-5 h-[196px] md:h-[224px] lg:mb-4 lg:h-[148px]',
      )}
      data-testid="service-card-media"
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/72 bg-[radial-gradient(circle_at_50%_45%,rgb(226_215_203/52%)_0%,rgb(239_231_222/42%)_54%,rgb(255_255_255/18%)_73%,transparent_74%)] shadow-[inset_0_1px_0_rgb(255_255_255/82%),0_18px_46px_rgb(92_66_42/7%)]',
          expanded
            ? 'h-[210px] w-[210px] md:h-[250px] md:w-[250px] lg:h-[286px] lg:w-[286px]'
            : 'h-[202px] w-[202px] md:h-[230px] md:w-[230px] lg:h-[154px] lg:w-[154px]',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(222_211_199/42%)_0%,rgb(238_229_219/22%)_48%,transparent_72%)] blur-[2px]',
          expanded
            ? 'h-[188px] w-[280px] md:h-[226px] md:w-[330px] lg:h-[248px] lg:w-[410px]'
            : 'h-[178px] w-[245px] md:h-[210px] md:w-[292px] lg:h-[138px] lg:w-[210px]',
        )}
      />
      <Image
        alt=""
        className={cn(
          'pointer-events-none relative z-[1] mx-auto object-contain drop-shadow-[0_20px_22px_rgb(64_45_26/10%)]',
          !expanded &&
            number === '1' &&
            'h-[192px] w-[236px] md:h-[220px] md:w-[266px] lg:h-[148px] lg:w-[180px]',
          !expanded &&
            number === '2' &&
            'h-[192px] w-[242px] md:h-[220px] md:w-[272px] lg:h-[148px] lg:w-[184px]',
          !expanded &&
            number === '3' &&
            'h-[196px] w-[226px] md:h-[226px] md:w-[266px] lg:h-[152px] lg:w-[180px]',
          !expanded &&
            number === '4' &&
            '-mt-3 h-[190px] w-[318px] md:-mt-8 md:h-[238px] md:w-[424px] lg:-mt-3 lg:h-[148px] lg:w-[260px]',
          !expanded &&
            number === '5' &&
            '-mt-4 h-[190px] w-[302px] md:-mt-8 md:h-[238px] md:w-[392px] lg:-mt-4 lg:h-[148px] lg:w-[304px]',
          expanded &&
            number === '1' &&
            'h-[212px] w-[260px] md:h-[248px] md:w-[300px] lg:h-[292px] lg:w-[354px]',
          expanded &&
            number === '2' &&
            'h-[212px] w-[266px] md:h-[248px] md:w-[306px] lg:h-[292px] lg:w-[364px]',
          expanded &&
            number === '3' &&
            'h-[218px] w-[252px] md:h-[256px] md:w-[300px] lg:h-[300px] lg:w-[354px]',
          expanded &&
            number === '4' &&
            '-mt-3 h-[214px] w-[358px] md:-mt-6 md:h-[270px] md:w-[480px] lg:-mt-3 lg:h-[294px] lg:w-[516px]',
          expanded &&
            number === '5' &&
            '-mt-4 h-[214px] w-[342px] md:-mt-6 md:h-[270px] md:w-[446px] lg:-mt-4 lg:h-[294px] lg:w-[590px]',
        )}
        decoding="async"
        height={height}
        loading="lazy"
        sizes={
          expanded
            ? '(min-width: 1024px) 38vw, (min-width: 768px) 56vw, 86vw'
            : '(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 80vw'
        }
        src={image}
        width={width}
      />
    </div>
  )
}

function ServiceBenefits({ items }: Pick<ServiceCardProps, 'items'>) {
  return (
    <ul className="mt-4 grid gap-2.5 text-[15px] font-medium leading-[1.2] text-[#263f4b] md:text-[15.5px] lg:mt-3 lg:gap-2 lg:text-[14px]">
      {items.map((item) => (
        <li className="grid grid-cols-[14px_1fr] gap-2.5" key={item}>
          <Check
            aria-hidden="true"
            className="mt-[1px] size-[14px] text-[var(--fairlend-ink)]"
            strokeWidth={2}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function HowItWorksTrigger({ id, title }: Pick<ServiceCardProps, 'id' | 'title'>) {
  const { isExpanded, toggleExpand } = useExpandable()

  return (
    <button
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? 'Close' : 'Open'} how ${title} works`}
      className="inline-flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-full border border-[rgb(255_58_25/18%)] bg-[rgb(255_246_240/84%)] px-4 text-[14px] font-extrabold text-[var(--fairlend-orange-text)] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-px hover:border-[rgb(255_58_25/34%)] hover:bg-[rgb(255_239_232/95%)] hover:text-[var(--fairlend-orange-text-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_72%,white)] lg:min-h-11 lg:text-[13px]"
      data-service-expand-trigger={id}
      onClick={toggleExpand}
      type="button"
    >
      <span>{isExpanded ? 'Close details' : 'How it works'}</span>
      <ArrowRight
        aria-hidden="true"
        className={cn('size-4 transition-transform duration-200', isExpanded && 'rotate-90')}
        strokeWidth={2.2}
      />
    </button>
  )
}

function CollapsedServiceCard({
  cta,
  height,
  id,
  image,
  items,
  number,
  title,
  width,
}: ServiceCardProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute top-5 left-5 z-20 grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_36%_24%,#ff876f_0%,#ff4b2b_42%,#f73516_100%)] text-[21px] font-extrabold leading-none text-white shadow-[0_10px_20px_rgb(255_58_25/28%),0_2px_4px_rgb(154_33_17/12%),inset_0_1px_0_rgb(255_255_255/48%),inset_0_-5px_10px_rgb(170_24_11/12%)] [text-shadow:0_1px_1px_rgb(130_25_12/18%)] md:size-[42px] lg:top-4 lg:left-4 lg:size-9 lg:text-[18px]"
      >
        {number}
      </span>
      <CardContent className="relative z-10 flex h-full w-full flex-col p-5 pt-4 md:p-6 lg:p-4 lg:pt-3">
        <ServiceArtwork height={height} image={image} number={number} width={width} />
        <div className="flex min-h-0 flex-1 flex-col">
          <h3
            className="m-0 max-w-full text-balance text-[20px] font-extrabold leading-[1.12] text-[var(--fairlend-ink)] md:text-[21px] lg:text-[18px]"
            data-testid="service-card-title"
          >
            {title}
          </h3>
          <ServiceBenefits items={items} />
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 lg:pt-4">
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-[16px] font-extrabold text-[var(--fairlend-orange-text)] no-underline transition-colors duration-200 hover:text-[var(--fairlend-orange-text-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_72%,white)] lg:text-[15px]"
              href="/"
            >
              <span>{cta}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
            <HowItWorksTrigger id={id} title={title} />
          </div>
        </div>
      </CardContent>
    </>
  )
}

function ExpandedServicePanel({
  onClose,
  service,
}: {
  onClose: () => void
  service: ServiceCardProps
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <Card
      className="group relative isolate flex min-h-full w-full overflow-hidden rounded-[24px] border border-[rgb(224_211_198/76%)] bg-[#fffaf4] bg-[radial-gradient(110%_90%_at_24%_0%,rgb(255_255_255/98%)_0%,rgb(255_253_248/94%)_46%,rgb(250_241_232/88%)_100%)] shadow-[0_1px_1px_rgb(95_63_35/5%),0_28px_72px_rgb(83_55_29/13%),0_82px_148px_rgb(83_55_29/11%),inset_0_1px_0_rgb(255_255_255/98%),inset_0_-34px_58px_rgb(228_211_193/14%)] outline-none before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(78%_58%_at_24%_0%,rgb(255_255_255/86%)_0%,transparent_74%)] after:pointer-events-none after:absolute after:inset-x-6 after:top-0 after:z-0 after:h-px after:bg-[rgb(255_255_255/92%)]"
      data-testid="service-expanded-card"
    >
      <div
        aria-label={`${service.title} how it works`}
        className="relative z-10 flex min-h-full w-full outline-none"
        ref={panelRef}
        role="region"
        tabIndex={-1}
      >
        <button
          aria-label="Close how it works"
          className="absolute top-4 right-4 z-30 grid size-11 cursor-pointer place-items-center rounded-full border border-[rgb(221_207_195/76%)] bg-[rgb(255_250_244/92%)] text-[var(--fairlend-ink)] shadow-[0_10px_20px_rgb(63_38_18/8%),inset_0_1px_0_rgb(255_255_255/86%)] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white hover:text-[var(--fairlend-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_70%,white)]"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-5" strokeWidth={2.2} />
        </button>

        <CardContent className="relative z-10 grid h-full w-full gap-6 p-5 pt-12 md:p-7 md:pt-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-9 lg:p-8 xl:gap-12 xl:p-10">
          <div className="flex min-h-0 flex-col">
            <span
              aria-hidden="true"
              className="mb-5 grid size-11 place-items-center rounded-full bg-[radial-gradient(circle_at_36%_24%,#ff876f_0%,#ff4b2b_42%,#f73516_100%)] text-[21px] font-extrabold leading-none text-white shadow-[0_10px_20px_rgb(255_58_25/28%),0_2px_4px_rgb(154_33_17/12%),inset_0_1px_0_rgb(255_255_255/48%),inset_0_-5px_10px_rgb(170_24_11/12%)]"
            >
              {service.number}
            </span>
            <p className="m-0 text-[12px] font-extrabold tracking-[0.22em] text-[var(--fairlend-orange-text)] uppercase">
              {service.audience}
            </p>
            <h3
              className="mt-4 mb-0 max-w-[620px] text-balance text-[clamp(31px,7vw,54px)] font-extrabold leading-[0.96] text-[var(--fairlend-ink)] lg:text-[clamp(38px,3.45vw,58px)]"
              data-testid="service-card-title"
            >
              {service.title}
            </h3>
            <p className="mt-5 max-w-[520px] text-[18px] font-semibold leading-[1.28] text-[#173844] md:text-[20px] lg:text-[21px]">
              {service.howItWorks.benefit}
            </p>
            <ServiceArtwork
              expanded
              height={service.height}
              image={service.image}
              number={service.number}
              width={service.width}
            />
            <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
              {service.howItWorks.outcomes.map((outcome) => (
                <span
                  className="rounded-full border border-[rgb(224_211_198/78%)] bg-[rgb(255_252_248/86%)] px-3.5 py-2 text-[13px] font-extrabold text-[#173844] shadow-[inset_0_1px_0_rgb(255_255_255/84%)]"
                  key={outcome}
                >
                  {outcome}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-[20px] border border-[rgb(229_214_199/66%)] bg-[linear-gradient(180deg,rgb(255_252_248/82%)_0%,rgb(250_243_236/72%)_100%)] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/92%)] md:p-5 lg:p-5 xl:p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="m-0 text-[13px] font-extrabold tracking-[0.2em] text-[var(--fairlend-orange-text)] uppercase">
                  How it works
                </p>
                <h4 className="mt-3 mb-0 text-balance text-[27px] font-extrabold leading-[1] text-[var(--fairlend-ink)] md:text-[32px] lg:text-[34px] xl:text-[38px]">
                  A clear path from first review to follow-through.
                </h4>
              </div>
            </div>

            <ExpandableContent keepMounted preset="blur-sm" stagger staggerChildren={0.055}>
              <ol className="mt-6 grid gap-3">
                {service.howItWorks.steps.map((step, index) => (
                  <li
                    className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 rounded-[16px] border border-[rgb(224_211_198/62%)] bg-[rgb(255_250_244/72%)] p-3.5 shadow-[0_8px_20px_rgb(63_38_18/4%),inset_0_1px_0_rgb(255_255_255/80%)] xl:p-4"
                    key={step.title}
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(180deg,#06444b_0%,#052c31_100%)] text-[15px] font-extrabold text-white shadow-[0_10px_20px_rgb(5_44_49/14%),inset_0_1px_0_rgb(255_255_255/14%)]">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-[17px] font-extrabold leading-[1.1] text-[var(--fairlend-ink)] md:text-[18px]">
                        {step.title}
                      </strong>
                      <span className="mt-2 block text-[14.5px] font-medium leading-[1.32] text-[#28434f] md:text-[15px] xl:text-[16px]">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-[11px] bg-[var(--fairlend-orange)] px-5 text-[15px] font-extrabold text-white shadow-[0_12px_24px_rgb(255_58_25/18%)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-[var(--fairlend-orange-dark)]"
                >
                  <Link href="/">
                    {service.cta}
                    <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.9} />
                  </Link>
                </Button>
                <button
                  className="h-11 cursor-pointer rounded-[11px] border border-[rgb(224_211_198/76%)] bg-[rgb(255_252_248/84%)] px-5 text-[15px] font-extrabold text-[var(--fairlend-ink)] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white hover:text-[var(--fairlend-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklch,var(--fairlend-orange)_70%,white)]"
                  onClick={onClose}
                  type="button"
                >
                  Back to services
                </button>
              </div>
            </ExpandableContent>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function ServiceCard({
  active,
  onOpen,
  service,
}: {
  active: boolean
  onOpen: (origin: ServiceOverlayRect) => void
  service: ServiceCardProps
}) {
  const reduceMotion = useReducedMotion()
  const { span } = service
  const cardRef = useRef<HTMLDivElement | null>(null)

  return (
    <Expandable
      className={cn(
        'relative h-full min-h-[392px] md:min-h-[408px] lg:min-h-0',
        span === 'third' && 'lg:col-span-4',
        span === 'half' && 'lg:col-span-6',
        Number(service.number) <= 3 ? 'lg:z-20' : 'lg:z-10',
      )}
      expanded={active}
      onToggle={() => {
        const rect = cardRef.current?.getBoundingClientRect()

        onOpen({
          height: rect?.height ?? 392,
          left: rect?.left ?? 0,
          top: rect?.top ?? 0,
          width: rect?.width ?? 320,
        })
      }}
      transitionDuration={reduceMotion ? 0 : 0.42}
      easeType={[0.22, 1, 0.36, 1]}
    >
      <motion.div
        className="h-full min-h-[392px] md:min-h-[408px] lg:min-h-0"
        data-testid="service-card-slot"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
        transition={{
          delay: reduceMotion ? 0 : Math.min(Number(service.number) - 1, 4) * 0.055,
          duration: reduceMotion ? 0 : 0.42,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ amount: 0.18, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Card
          className={cn(
            'group relative isolate flex h-full min-h-[392px] w-full overflow-hidden rounded-[18px] border border-[rgb(224_211_198/58%)] bg-[#fffaf4] bg-[radial-gradient(120%_95%_at_50%_-8%,rgb(255_255_255/96%)_0%,rgb(255_253_248/88%)_42%,rgb(251_244_236/72%)_100%)] shadow-[0_1px_1px_rgb(95_63_35/5%),0_18px_48px_rgb(83_55_29/8%),0_54px_108px_rgb(83_55_29/7%),inset_0_1px_0_rgb(255_255_255/98%),inset_0_-34px_58px_rgb(228_211_193/13%)] backdrop-blur-[8px] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(95%_62%_at_50%_0%,rgb(255_255_255/78%)_0%,transparent_70%)] before:opacity-95 after:pointer-events-none after:absolute after:inset-x-5 after:top-0 after:z-0 after:h-px after:bg-[rgb(255_255_255/88%)] hover:-translate-y-1 hover:shadow-[0_1px_1px_rgb(95_63_35/5%),0_24px_62px_rgb(83_55_29/10%),0_64px_126px_rgb(83_55_29/9%),inset_0_1px_0_rgb(255_255_255/100%),inset_0_-34px_58px_rgb(228_211_193/15%)] md:min-h-[408px] lg:min-h-0',
            Number(service.number) <= 3 ? 'z-20' : 'z-10',
          )}
          data-testid="service-card"
          ref={cardRef}
        >
          <CollapsedServiceCard {...service} />
        </Card>
      </motion.div>
    </Expandable>
  )
}

function ExpandedServiceOverlay({
  onClose,
  reduceMotion,
  service,
}: {
  onClose: () => void
  overlay: ActiveServiceOverlay
  reduceMotion: boolean
  service: ServiceCardProps
}) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute inset-0 z-50 overflow-y-auto overscroll-contain"
      data-testid="service-expanded-layer"
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.985, y: reduceMotion ? 0 : 10 }}
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.985, y: reduceMotion ? 0 : 10 }}
      style={{ transformOrigin: 'top left' }}
      transition={
        reduceMotion
          ? { duration: 0, type: 'tween' }
          : {
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
              type: 'tween',
            }
      }
    >
      <Expandable
        className="flex min-h-full w-full"
        easeType={[0.22, 1, 0.36, 1]}
        expanded
        onToggle={onClose}
        transitionDuration={reduceMotion ? 0 : 0.32}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-full w-full"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{
            delay: reduceMotion ? 0 : 0.12,
            duration: reduceMotion ? 0 : 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ExpandedServicePanel onClose={onClose} service={service} />
        </motion.div>
      </Expandable>
    </motion.div>
  )
}

function ProofPoint({
  children,
  icon: Icon,
}: {
  children: React.ReactNode
  icon: typeof ShieldCheck
}) {
  return (
    <div
      className="grid grid-cols-[30px_1fr] items-center gap-3"
      data-testid="services-proof-point"
    >
      <Icon
        aria-hidden="true"
        className="size-[27px] text-[var(--fairlend-ink)]"
        strokeWidth={1.8}
      />
      <span className="text-[13px] font-extrabold leading-[1.05] text-[var(--fairlend-ink)]">
        {children}
      </span>
    </div>
  )
}

export function FairlendServicesSection() {
  const [activeOverlay, setActiveOverlay] = useState<ActiveServiceOverlay | null>(null)
  const bentoFrameRef = useRef<HTMLDivElement | null>(null)
  const lastOpenedServiceIdRef = useRef<string | null>(null)
  const reduceMotion = useReducedMotion()
  const activeService = serviceCards.find((service) => service.id === activeOverlay?.id)

  function openService(serviceId: ServiceCardProps['id'], cardRect: ServiceOverlayRect) {
    const frameRect = bentoFrameRef.current?.getBoundingClientRect()
    const origin = frameRect
      ? {
          height: cardRect.height,
          left: cardRect.left - frameRect.left,
          top: cardRect.top - frameRect.top,
          width: cardRect.width,
        }
      : cardRect
    const target = frameRect
      ? {
          height: frameRect.height,
          left: 0,
          top: 0,
          width: frameRect.width,
        }
      : {
          height: cardRect.height,
          left: 0,
          top: 0,
          width: cardRect.width,
        }

    lastOpenedServiceIdRef.current = serviceId
    setActiveOverlay({ id: serviceId, origin, target })
  }

  function closeService() {
    setActiveOverlay(null)
    window.requestAnimationFrame(() => {
      const trigger = document.querySelector<HTMLButtonElement>(
        `[data-service-expand-trigger="${lastOpenedServiceIdRef.current}"]`,
      )

      trigger?.focus({ preventScroll: true })
    })
  }

  useEffect(() => {
    if (!activeOverlay) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeService()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeOverlay])

  return (
    <section
      aria-labelledby="fairlend-services-title"
      className="relative z-10 isolate overflow-hidden bg-transparent px-0 py-14 text-[var(--fairlend-ink)] md:py-20 lg:h-screen lg:overflow-hidden lg:pt-[46px] lg:pb-0"
      data-fairlend-motion="services"
      data-testid="services-section"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[320px] w-[125%] sm:h-[380px] sm:w-full lg:h-[49.4%] lg:w-[65%]"
        data-testid="services-map-artwork"
      >
        <Image
          alt=""
          className="h-full w-full object-contain object-left-bottom opacity-95 drop-shadow-[0_24px_34px_rgb(77_55_33/12%)] [-webkit-mask-image:radial-gradient(ellipse_78%_74%_at_36%_67%,black_0%,black_50%,rgb(0_0_0/78%)_64%,rgb(0_0_0/32%)_80%,transparent_100%)] [mask-image:radial-gradient(ellipse_78%_74%_at_36%_67%,black_0%,black_50%,rgb(0_0_0/78%)_64%,rgb(0_0_0/32%)_80%,transparent_100%)]"
          decoding="async"
          height={948}
          loading="lazy"
          sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 58vw, 120vw"
          src={`${assetBase}/toronto-cityscape-map-landscape.webp`}
          width={1659}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_76%_72%_at_34%_66%,rgb(251_243_234/0%)_0%,rgb(251_243_234/0%)_52%,rgb(251_243_234/44%)_78%,var(--fairlend-cream)_100%),linear-gradient(to_top,rgb(251_243_234/0%)_0%,rgb(251_243_234/0%)_68%,var(--fairlend-cream)_100%),linear-gradient(to_right,rgb(251_243_234/0%)_0%,rgb(251_243_234/0%)_70%,var(--fairlend-cream)_100%)]"
          data-testid="services-map-fade"
        />
      </div>

      <div className="fairlend-view-reveal relative z-10 mx-auto h-full w-full max-w-[1528px] px-5 sm:px-8 xl:px-8">
        <div className="grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 xl:gap-8">
          <div className="relative z-10 flex min-h-0 flex-col justify-start lg:col-span-4 lg:min-h-0">
            <div className="relative z-20 w-full max-w-[430px] px-0 pt-2 lg:pt-7 lg:pt-3">
              <span
                aria-hidden="true"
                className="mb-6 block h-0.5 w-10 bg-[var(--fairlend-orange)]"
              />
              <p className="m-0 text-[15px] font-extrabold uppercase tracking-[0.34em] text-[var(--fairlend-orange-text)]">
                Our Services
              </p>
              <h2
                className="mt-6 mb-0 font-serif text-[clamp(58px,17vw,76px)] font-bold leading-[0.91] tracking-normal text-[var(--fairlend-ink)] md:text-[clamp(70px,9vw,92px)] lg:text-[clamp(70px,7vw,102px)]"
                id="fairlend-services-title"
              >
                Our
                <br />
                Services
              </h2>
              <p className="mt-7 max-w-[420px] text-[clamp(21px,6vw,24px)] font-semibold leading-[1.15] text-[#0d2a36] lg:mt-5 lg:text-[24px]">
                Financing, investing, build support, and partnerships on one platform.
              </p>

              <div className="mt-10 grid max-w-[420px] grid-cols-1 gap-3 min-[430px]:grid-cols-3 lg:mt-8 lg:grid-cols-3 lg:gap-4">
                <ProofPoint icon={ShieldCheck}>
                  Secure
                  <br />
                  &amp; Compliant
                </ProofPoint>
                <ProofPoint icon={Clock3}>
                  Fast
                  <br />
                  Turnaround
                </ProofPoint>
                <ProofPoint icon={UsersRound}>
                  Aligned
                  <br />
                  Partnerships
                </ProofPoint>
              </div>

              <Card className="mt-10 w-full max-w-[420px] rounded-[17px] border-[rgb(229_214_199/62%)] bg-[#fffaf4] bg-[radial-gradient(118%_95%_at_50%_-10%,rgb(255_255_255/96%),rgb(255_250_244/91%)_52%,rgb(250_242_234/86%)_100%)] shadow-[0_1px_1px_rgb(95_63_35/5%),0_20px_46px_rgb(63_38_18/9%),0_52px_96px_rgb(63_38_18/6%),inset_0_1px_0_rgb(255_255_255/96%),inset_0_-24px_44px_rgb(228_211_193/10%)] lg:mt-6 lg:max-w-[345px]">
                <CardContent className="grid grid-cols-[50px_1fr] gap-4 p-4 sm:grid-cols-[58px_1fr] sm:p-5 lg:grid-cols-[58px_1fr] lg:p-4">
                  <span className="grid size-[54px] place-items-center rounded-full border border-[#f7c7b6] bg-[#fff6ef] text-[var(--fairlend-orange)]">
                    <Target aria-hidden="true" className="size-7" strokeWidth={2.1} />
                  </span>
                  <div>
                    <p className="m-0 text-[14px] font-extrabold leading-[1.18] text-[var(--fairlend-ink)]">
                      One Platform. More Possibilities.
                    </p>
                    <p className="mt-2 mb-0 text-[15px] font-medium leading-[1.35] text-[#28434f]">
                      Whether you&apos;re building, investing, or partnering, we make it simple.
                    </p>
                    <Button
                      asChild
                      className="relative mt-5 h-11 w-full justify-between rounded-[10px] border border-white/[0.12] bg-[linear-gradient(180deg,#06444b_0%,#052c31_100%)] px-5 text-[16px] font-extrabold text-white shadow-[0_12px_24px_rgb(5_44_49/18%),0_1px_0_rgb(255_255_255/14%)_inset,0_-1px_0_rgb(0_0_0/12%)_inset] before:pointer-events-none before:absolute before:-inset-[6px] before:-z-10 before:rounded-[16px] before:bg-[radial-gradient(100%_100%_at_50%_50%,rgb(255_250_244/75%),transparent_55%)] before:blur-[8px] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:bg-[radial-gradient(85%_85%_at_50%_50%,transparent_55%,rgb(255_255_255/10%)_100%)] hover:bg-[linear-gradient(180deg,#07525a_0%,#06363c_100%)] lg:mt-4 lg:h-11 lg:text-[15px]"
                    >
                      <Link href="/">
                        Explore Opportunities
                        <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative z-10 min-h-0 lg:col-span-8" ref={bentoFrameRef}>
            <div
              className={cn(
                'grid h-full min-h-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5',
                activeService && 'pointer-events-none select-none',
              )}
              data-testid="services-card-grid"
            >
              {serviceCards.map((card) => (
                <ServiceCard
                  active={activeOverlay?.id === card.id}
                  key={card.number}
                  onOpen={(origin) => openService(card.id, origin)}
                  service={card}
                />
              ))}
            </div>

            <AnimatePresence>
              {activeService && activeOverlay ? (
                <ExpandedServiceOverlay
                  key={activeService.id}
                  onClose={closeService}
                  overlay={activeOverlay}
                  reduceMotion={Boolean(reduceMotion)}
                  service={activeService}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
