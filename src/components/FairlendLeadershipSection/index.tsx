import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  ChartNoAxesColumnIncreasing,
  Flag,
  Handshake,
  Landmark,
  MapPin,
  ShieldCheck,
  Trophy,
  UsersRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

const leaderProof = [
  {
    icon: ShieldCheck,
    metric: '25+ years',
    detail: 'Real estate finance experience',
  },
  {
    icon: Landmark,
    metric: '$2B+',
    detail: 'Financing closed across market cycles',
  },
  {
    icon: MapPin,
    metric: 'Toronto based',
    detail: 'Local insight. Relationship driven.',
  },
] as const

const timelineProof = [
  {
    icon: Trophy,
    value: '25+',
    label: 'Years',
    sublabel: 'of experience',
  },
  {
    icon: Landmark,
    value: '$2B+',
    label: 'Financing',
    sublabel: 'closed',
  },
  {
    icon: MapPin,
    value: 'Toronto',
    label: 'Based',
    sublabel: 'local expertise',
  },
] as const

const testimonialCards = [
  {
    quote: 'FairLend stepped in when banks said no. They funded our project fast and kept it moving. True partners.',
    name: 'Michael L.',
    role: 'Mid-rise developer, Toronto',
    icon: Building2,
    partner: 'Developer partner',
  },
  {
    quote:
      'Consistent, transparent, and reliable. FairLend is our go-to lender for complex and time-sensitive deals.',
    name: 'Sarah K.',
    role: 'Private lender',
    icon: Landmark,
    partner: 'Private lender',
  },
  {
    quote:
      'My clients get answers fast and closings done right. That is why I send business to FairLend.',
    name: 'Jason P.',
    role: 'Mortgage broker, GTA',
    icon: UsersRound,
    partner: 'Broker partner',
  },
  {
    quote:
      'FairLend delivers strong risk-adjusted returns with disciplined underwriting and clear communication.',
    name: 'David R.',
    role: 'Private investor',
    icon: ChartNoAxesColumnIncreasing,
    partner: 'Investor',
  },
] as const

const leadershipTeam = [
  {
    initials: 'HG',
    name: 'Harman Grewal',
  },
  {
    initials: 'CD',
    name: 'Capital Desk',
  },
  {
    initials: 'FL',
    name: 'FairLend Capital',
  },
  {
    initials: 'DF',
    name: 'DrawFlow Team',
  },
] as const

function LeadershipAvatar({
  className,
  initials,
  name,
  priority = false,
}: {
  className?: string
  initials: string
  name: string
  priority?: boolean
}) {
  return (
    <div
      aria-label={name}
      className={cn(
        'relative isolate grid overflow-hidden border border-white/22 bg-[#062f35] shadow-[inset_0_1px_0_rgb(255_255_255/18%),0_16px_38px_rgb(0_27_32/28%)]',
        className,
      )}
      role="img"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover opacity-70 mix-blend-luminosity"
        fill
        priority={priority}
        sizes={priority ? '(min-width: 1024px) 31vw, 100vw' : '96px'}
        src="/assets/fairlend-desktop-hero.webp"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_48%_21%,rgb(255_255_255/20%),transparent_24%),linear-gradient(145deg,rgb(2_53_60/15%),rgb(2_28_32/90%)_74%)]"
      />
      <span
        aria-hidden="true"
        className="absolute right-[11%] bottom-[10%] h-[46%] w-[28%] rounded-t-full bg-[linear-gradient(180deg,rgb(244_223_196/74%),rgb(128_86_62/28))] blur-[1px]"
      />
      <span
        aria-hidden="true"
        className="absolute right-[8%] bottom-[-5%] h-[29%] w-[48%] rounded-t-[50%] bg-[linear-gradient(180deg,rgb(7_52_59/92%),rgb(2_29_34/96%))]"
      />
      <span className="relative z-[1] self-end p-5 font-serif text-[clamp(3rem,6.2vw,6.9rem)] leading-none font-bold tracking-normal text-white/86">
        {initials}
      </span>
    </div>
  )
}

function VerticalProofRail() {
  return (
    <aside
      aria-label="Leadership proof navigation"
      className="hidden h-full min-h-0 w-[76px] shrink-0 rounded-[20px] border border-[#eadfd0] bg-[#fffaf2]/78 px-5 py-6 shadow-[0_22px_60px_rgb(47_35_23/8%)] xl:flex xl:flex-col xl:items-center"
    >
      <Flag aria-hidden="true" className="mt-2 size-6 text-[var(--fairlend-orange)]" fill="currentColor" />
      <span className="mt-8 [writing-mode:vertical-rl] text-[clamp(1rem,1.18vw,1.22rem)] leading-none font-extrabold tracking-[0.52em] text-[#082d35] uppercase">
        Proof
      </span>
      <div className="mt-auto grid gap-5 text-center text-[11px] font-extrabold text-[#082d35]/72">
        {['01', '02', '03', '04'].map((item, index) => (
          <div className="grid justify-items-center gap-3" key={item}>
            <span className={cn(index === 0 && 'text-[#082d35]')}>{item}</span>
            <span
              aria-hidden="true"
              className={cn(
                'h-0.5 w-7 bg-[#6f6a61]',
                index === 0 && 'bg-[var(--fairlend-orange)]',
              )}
            />
          </div>
        ))}
        <span className="text-lg leading-none text-[#a7a094]">...</span>
      </div>
    </aside>
  )
}

export function FairlendLeadershipSection() {
  return (
    <section
      aria-labelledby="fairlend-leadership-title"
      className="relative isolate overflow-hidden bg-[rgb(255_253_247)] px-4 py-8 text-[#082d35] sm:px-6 lg:h-[calc(100svh-72px)] lg:min-h-[calc(100svh-72px)] lg:px-6 lg:py-4 xl:px-8"
      data-testid="fairlend-leadership-section"
      id="leadership"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_48rem_32rem_at_22%_22%,rgb(255_255_255/72%),transparent_72%),radial-gradient(ellipse_58rem_34rem_at_78%_74%,rgb(232_242_239/56%),transparent_68%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgb(8_45_53/5%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(8_45_53/4%)_1px,transparent_1px)] opacity-35 [background-size:44px_44px]"
      />

      <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1710px] flex-col gap-4 xl:flex-row xl:items-stretch">
        <div className="relative isolate min-w-0 flex-1 overflow-hidden border border-[rgb(213_226_223/72%)] bg-[rgb(255_253_247/86%)] shadow-[0_26px_80px_rgb(27_48_49/8%)] lg:h-full lg:rounded-[20px]">
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 z-0 hidden h-full w-[31%] object-cover object-left opacity-100 [mask-image:linear-gradient(to_right,transparent_0%,#000_30%,#000_100%)] lg:block"
            fill={false}
            height={1505}
            priority
            src="/assets/fairlend-gta-leadership-background-map.webp"
            width={1045}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgb(255_253_247/0)_0%,rgb(255_253_247/0)_62%,rgb(255_253_247/16%)_73%,rgb(255_253_247/0)_100%)]"
          />

          <div className="relative z-[1] flex flex-col gap-6 lg:grid lg:h-full lg:grid-cols-[minmax(312px,0.92fr)_minmax(126px,0.34fr)_minmax(0,1.5fr)] lg:gap-4 xl:grid-cols-[460px_160px_minmax(0,1fr)]">
            <article className="overflow-hidden bg-[#063d43] text-white shadow-[0_28px_72px_rgb(25_28_20/19%)] lg:h-full lg:rounded-[18px]">
              <LeadershipAvatar
                className="h-[260px] border-x-0 border-t-0 border-b-[#ffffff26] sm:h-[330px] lg:h-[200px]"
                initials="HG"
                name="Harman Grewal"
                priority
              />
              <div className="bg-[linear-gradient(145deg,rgb(2_58_64),rgb(1_42_47)_64%,rgb(1_36_41))] p-6 sm:p-7 lg:p-5">
                <p className="text-[11px] leading-none font-extrabold tracking-[0.26em] text-[var(--fairlend-orange)] uppercase">
                  Leadership
                </p>
                <h2
                  className="mt-2.5 text-[clamp(1.9rem,2.65vw,2.6rem)] leading-[0.92] font-extrabold tracking-normal"
                  id="fairlend-leadership-title"
                >
                  Harman Grewal
                </h2>
                <p className="mt-2 text-[clamp(0.68rem,0.72vw,0.76rem)] font-extrabold tracking-[0.24em] text-white/86 uppercase">
                  Founder &amp; chief executive officer
                </p>
                <span aria-hidden="true" className="mt-3 block h-0.5 w-9 bg-[var(--fairlend-orange)]" />
                <p className="mt-2.5 max-w-[31rem] text-[clamp(0.9rem,0.92vw,0.96rem)] leading-[1.28] font-medium text-white/88">
                  FairLend brings private mortgage capital, construction-draw discipline, and local
                  market judgment into one practical financing conversation.
                </p>

                <div className="mt-3 divide-y divide-white/18 border-y border-white/22">
                  {leaderProof.map(({ detail, icon: Icon, metric }) => (
                    <div className="grid grid-cols-[28px_minmax(104px,0.46fr)_1fr] items-center gap-2.5 py-2" key={metric}>
                      <Icon aria-hidden="true" className="size-5 text-white/88" strokeWidth={1.8} />
                      <span className="text-[0.82rem] leading-none font-extrabold tracking-[0.08em] text-white uppercase">
                        {metric}
                      </span>
                      <span className="text-[0.76rem] leading-[1.2] font-medium text-white/82">{detail}</span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="mt-4 h-10 w-full rounded-md bg-[var(--fairlend-orange)] text-[0.84rem] font-extrabold tracking-[0.02em] text-white shadow-[0_16px_34px_rgb(255_58_25/20%)] transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[var(--fairlend-orange-dark)] hover:shadow-[0_20px_42px_rgb(255_58_25/28%)]"
                  size="clear"
                >
                  <Link href="/contact">
                    Speak with leadership
                    <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.9} />
                  </Link>
                </Button>

                <div className="mt-3 border-t border-white/22 pt-3">
                  <p className="text-[0.68rem] font-extrabold tracking-[0.18em] text-white/78 uppercase">
                    Our leadership team
                  </p>
                  <div className="mt-2.5 grid grid-cols-4 gap-2">
                    {leadershipTeam.map((member) => (
                      <LeadershipAvatar
                        className="aspect-[1.08] rounded-[10px]"
                        initials={member.initials}
                        key={member.name}
                        name={member.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <div className="grid grid-cols-3 gap-0 border-y border-[#dfd2c2] py-5 lg:flex lg:flex-col lg:border-y-0 lg:py-5 xl:w-[160px] xl:shrink-0">
              {timelineProof.map(({ icon: Icon, label, sublabel, value }, index) => (
                <div
                  className="relative grid min-h-[118px] place-items-center px-3 text-center lg:min-h-0 lg:flex-1"
                  key={label}
                >
                  <div className="grid justify-items-center">
                    <Icon aria-hidden="true" className="size-7 text-[#082d35]" strokeWidth={1.45} />
                    <p className="mt-2.5 text-[clamp(1.16rem,1.35vw,1.42rem)] leading-none font-extrabold tracking-normal">
                      {value}
                    </p>
                    <p className="mt-2 text-[0.72rem] leading-[1.12] font-extrabold tracking-[0.18em] uppercase">
                      {label}
                    </p>
                    <p className="mt-1.5 text-[0.6rem] leading-[1.18] font-extrabold tracking-[0.16em] text-[#486572] uppercase">
                      {sublabel}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute bg-[#ddcdbb] lg:left-1/2 lg:h-[46px] lg:w-px lg:-translate-x-1/2',
                      index < timelineProof.length - 1
                        ? 'right-0 h-16 w-px lg:right-auto lg:bottom-[-23px]'
                        : 'hidden',
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-[-4px] hidden size-2 -translate-y-1/2 rounded-full bg-[var(--fairlend-orange)] lg:block"
                  />
                </div>
              ))}
            </div>

            <div className="relative min-w-0 py-0 pr-4 lg:py-3 lg:pr-[clamp(48px,5vw,84px)] xl:py-0 xl:pr-14">
              <div className="relative grid gap-4 lg:gap-3">
                {testimonialCards.map(({ icon: Icon, name, partner, quote, role }) => (
                  <article
                    className="grid gap-5 border border-[#e4d8ca] bg-[#fffdf8]/91 p-5 shadow-[0_18px_44px_rgb(51_38_24/11%)] backdrop-blur-sm sm:grid-cols-[minmax(0,1fr)_132px] sm:p-6 lg:min-h-0 lg:gap-3 lg:rounded-[16px] lg:p-4 xl:grid-cols-[minmax(0,1fr)_96px]"
                    key={name}
                  >
                    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 lg:grid-cols-[36px_minmax(0,1fr)] lg:gap-3">
                      <span className="font-serif text-[5.5rem] leading-[0.68] font-bold text-[#063d43] lg:text-[3.6rem]">“</span>
                      <div>
                        <p className="max-w-[36rem] text-[clamp(1.15rem,1.52vw,1.65rem)] leading-[1.16] font-extrabold tracking-normal text-[#082d35] lg:text-[clamp(0.95rem,0.96vw,1.04rem)] lg:leading-[1.18]">
                          {quote}
                        </p>
                        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] leading-none font-extrabold tracking-[0.18em] text-[#082d35] uppercase lg:mt-3 lg:gap-x-3 lg:text-[0.6rem] lg:tracking-[0.13em]">
                          <span>{name}</span>
                          <span aria-hidden="true" className="h-4 w-px bg-[#cdbfac]" />
                          <span className="text-[#486572]">{role}</span>
                        </p>
                      </div>
                    </div>
                    <div className="grid border-t border-[#ded2c4] pt-5 text-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 lg:pl-3">
                      <span className="mx-auto grid size-16 place-items-center rounded-full border border-[#ddd1c2] text-[#082d35] lg:size-12">
                        <Icon aria-hidden="true" className="size-8 lg:size-6" strokeWidth={1.45} />
                      </span>
                      <p className="mt-3 self-end text-[0.72rem] leading-[1.16] font-extrabold tracking-[0.12em] text-[#082d35] uppercase lg:mt-2 lg:text-[0.6rem] lg:tracking-[0.08em]">
                        {partner}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <VerticalProofRail />
      </div>

      <div className="relative z-[1] mx-auto mt-6 grid w-full max-w-[1710px] gap-3 border-y border-[#dfd2c2] py-4 text-[0.72rem] font-extrabold tracking-[0.18em] text-[#486572] uppercase sm:grid-cols-3 lg:hidden">
        {['Underwriting discipline', 'Capital relationships', 'Local market judgment'].map((item) => (
          <span className="flex items-center gap-2" key={item}>
            <BadgeCheck aria-hidden="true" className="size-4 text-[var(--fairlend-orange)]" />
            {item}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[6%] z-0 hidden h-px w-[36%] bg-[linear-gradient(90deg,transparent,rgb(255_58_25/70%),transparent)] lg:block"
      />
      <Handshake aria-hidden="true" className="absolute right-[7.5%] bottom-[8.5%] z-0 hidden size-8 text-[var(--fairlend-orange)] opacity-55 lg:block" />
      <Banknote aria-hidden="true" className="absolute right-[12%] top-[31%] z-0 hidden size-7 text-[var(--fairlend-orange)] opacity-55 lg:block" />
    </section>
  )
}
