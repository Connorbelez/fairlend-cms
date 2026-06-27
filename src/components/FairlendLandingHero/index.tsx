import type { CSSProperties } from 'react'
import { Handshake, MapPin, ShieldCheck, UsersRound } from 'lucide-react'

import { FairlendRegistrationDisclosure } from '@/components/FairlendRegistrationDisclosure'
import { FairlendTalkToExpertCta } from '@/components/FairlendTalkToExpertCta'
import { Card } from '@/components/ui/card'
import { DiaTextReveal } from '@/components/ui/dia-text'
import { cn } from '@/utilities/ui'

import { FairlendApplicationForm } from './FairlendApplicationForm.client'
import { FairlendHeroProcess } from './FairlendHeroProcess'
import { HeroHandwrittenInsertion } from './HeroHandwrittenInsertion.client'

type MapLabelLocation =
  | 'etobicoke'
  | 'markham'
  | 'mississauga'
  | 'northYork'
  | 'scarborough'
  | 'vaughan'

const mapLabels = [
  { label: 'VAUGHAN', location: 'vaughan' },
  { label: 'MARKHAM', location: 'markham' },
  { label: 'NORTH\nYORK', location: 'northYork' },
  { label: 'SCARBOROUGH', location: 'scarborough' },
  { label: 'ETOBICOKE', location: 'etobicoke' },
  { label: 'MISSISSAUGA', location: 'mississauga' },
] satisfies Array<{ label: string; location: MapLabelLocation }>

const processSteps = [
  { label: 'Permit', number: '1', step: 'permit' },
  { label: 'Acquisition', number: '2', step: 'acquisition' },
  { label: 'Construction', number: '3', step: 'construction' },
  { label: 'Completion', number: '4', step: 'completion' },
] as const

const stats = [
  { icon: ShieldCheck, text: '25+ years\nof experience' },
  { icon: Handshake, text: '$2B+ in\nfinancing closed' },
  { icon: MapPin, text: 'Proudly based\nin Toronto' },
  { icon: UsersRound, text: 'End-to-end\nlending partner' },
]

const mobileStats = [
  { icon: ShieldCheck, text: '25+ years\nof experience' },
  { icon: Handshake, text: '$2B+ in\nfinancing closed' },
  { icon: MapPin, text: 'Proudly based\nin Toronto' },
  { icon: UsersRound, text: 'End-to-end\nlending partner' },
]

const heroStageClassName =
  'relative h-[var(--hero-stage-height)] min-h-[var(--hero-stage-height)] overflow-hidden [--hero-header-clearance:72px] [--hero-stage-height:min(100svh,56.35vw)] [--hero-stage-width:min(100%,177.47svh)] hero-tablet:block hero-tablet:h-[calc(100svh-116px)] hero-tablet:min-h-[720px] hero-tablet:max-h-[900px] hero-tablet:overflow-hidden hero-tablet-landscape:h-[calc(100svh-86px)] hero-tablet-landscape:min-h-[760px] hero-tablet-landscape:max-h-none hero-tablet-landscape:[--hero-stats-height:0px] hero-tablet-landscape-short:h-[calc(100svh-68px)] hero-tablet-landscape-short:min-h-0 hero-tablet-landscape-short:max-h-none hero-portrait-wide:h-[calc(100svh-104px)] hero-portrait-wide:min-h-[calc(100svh-104px)] hero-portrait-wide:max-h-none hero-mobile:block hero-mobile:!h-svh hero-mobile:!min-h-svh hero-mobile:overflow-hidden hero-mobile-short:!min-h-svh hero-landscape:box-border hero-landscape:grid hero-landscape:h-svh hero-landscape:min-h-svh hero-landscape:max-h-none hero-landscape:grid-cols-12 hero-landscape:grid-rows-1 hero-landscape:gap-x-0 hero-landscape:[--hero-grid-gap:0px] hero-landscape:[--hero-grid-pad-x:clamp(32px,3.2vw,64px)] hero-landscape:[--hero-stage-height:100svh] hero-landscape-mid:[--hero-grid-gap:0px] hero-landscape-mid:[--hero-grid-pad-x:clamp(24px,2.4vw,42px)] hero-landscape:[--hero-stats-height:clamp(64px,5.5vw,92px)]'

const mapLayerClassName =
  'pointer-events-none absolute top-0 left-1/2 z-[1] h-full w-[var(--hero-stage-width)] origin-bottom-right [transform:scale(0.94)_translate(-19.48%,14.4%)] hero-max-1279:absolute hero-max-1279:inset-0 hero-max-1279:m-0 hero-max-1279:h-full hero-max-1279:w-full hero-max-1279:translate-x-0 hero-max-1279:transform-none hero-max-1279:overflow-hidden hero-tablet-landscape:top-[clamp(12px,2svh,28px)] hero-tablet-landscape:right-[clamp(-36px,-2.2vw,-18px)] hero-tablet-landscape:bottom-auto hero-tablet-landscape:left-auto hero-tablet-landscape:h-[min(58svh,620px)] hero-tablet-landscape:w-[min(62vw,790px)] hero-tablet-landscape:overflow-visible hero-tablet-landscape-short:top-[4px] hero-tablet-landscape-short:h-[clamp(250px,44svh,360px)] hero-tablet-landscape-short:w-[min(58vw,700px)] hero-portrait-wide:absolute hero-portrait-wide:inset-0 hero-portrait-wide:m-0 hero-portrait-wide:h-full hero-portrait-wide:w-full hero-portrait-wide:translate-x-0 hero-portrait-wide:transform-none hero-portrait-wide:overflow-hidden hero-mobile:left-1/2 hero-mobile:w-screen hero-mobile:-translate-x-1/2 hero-landscape:inset-0 hero-landscape:left-0 hero-landscape:h-full hero-landscape:w-full hero-landscape:origin-center hero-landscape:translate-x-0 hero-landscape:transform-none'

const mapFrameClassName =
  'absolute top-0 left-[98px] z-[1] h-[766px] w-[1577px] max-w-none overflow-visible motion-safe:animate-[heroMapIn_760ms_var(--hero-ease-out)_20ms_both] hero-max-1279:inset-0 hero-max-1279:h-full hero-max-1279:w-full hero-max-1279:max-w-full hero-max-1279:translate-x-0 hero-max-1279:overflow-hidden hero-tablet-landscape:inset-0 hero-tablet-landscape:h-full hero-tablet-landscape:w-full hero-tablet-landscape:max-w-full hero-tablet-landscape:overflow-visible hero-portrait-wide:inset-0 hero-portrait-wide:h-full hero-portrait-wide:w-full hero-portrait-wide:max-w-full hero-portrait-wide:translate-x-0 hero-portrait-wide:overflow-hidden hero-landscape:inset-x-0 hero-landscape:top-[var(--hero-header-clearance)] hero-landscape:bottom-0 hero-landscape:h-auto hero-landscape:w-full hero-landscape:max-w-none hero-landscape:translate-x-0 hero-landscape:overflow-hidden'

const heroCopyClassName =
  'absolute top-[calc(var(--hero-header-clearance)+clamp(18px,3.8svh,54px))] left-[clamp(28px,4vw,76px)] z-[5] flex w-[min(43vw,700px)] max-w-[700px] flex-col items-start gap-0 [translate:0] motion-safe:animate-[heroCopyIn_780ms_var(--hero-ease-out)_180ms_both] hero-max-1120:w-fit hero-max-1279:relative hero-max-1279:top-auto hero-max-1279:left-auto hero-max-1279:z-[5] hero-max-1279:mt-0 hero-max-1279:h-auto hero-max-1279:w-[min(100%,590px)] hero-max-1279:[translate:0] hero-tablet:block hero-tablet:h-auto hero-tablet:w-full hero-tablet:max-w-[640px] hero-tablet-landscape:absolute hero-tablet-landscape:top-[clamp(168px,22svh,230px)] hero-tablet-landscape:left-0 hero-tablet-landscape:w-[min(45vw,560px)] hero-tablet-landscape:max-w-none hero-tablet-landscape:[translate:0] hero-tablet-landscape-short:top-[clamp(82px,14svh,110px)] hero-tablet-landscape-short:w-[min(46vw,500px)] hero-portrait-wide:absolute hero-portrait-wide:top-[calc(var(--hero-header-clearance)+clamp(18px,3svh,44px))] hero-portrait-wide:left-[clamp(28px,5vw,68px)] hero-portrait-wide:z-[5] hero-portrait-wide:mt-0 hero-portrait-wide:block hero-portrait-wide:h-auto hero-portrait-wide:w-[min(43vw,680px)] hero-portrait-wide:max-w-[680px] hero-portrait-wide:[translate:0] hero-mobile:block hero-mobile:h-auto hero-mobile:w-full hero-landscape:absolute hero-landscape:top-[calc(var(--hero-header-clearance)+clamp(18px,3.4svh,48px))] hero-landscape:left-[clamp(32px,4.2vw,80px)] hero-landscape:col-auto hero-landscape:row-auto hero-landscape:self-auto hero-landscape:w-[min(43vw,700px)] hero-landscape:max-w-[700px] hero-landscape:[translate:0]'

const heroTitleClassName =
  'm-0 flex h-auto w-full min-w-0 max-w-full flex-col p-0 text-balance font-serif text-[clamp(58px,5.2vw,96px)] leading-[0.98] font-black tracking-normal text-[var(--fairlend-ink)] [text-shadow:0_1px_0_rgb(255_255_255/62%),0_14px_34px_rgb(42_24_11/5%)] hero-max-1279:h-auto hero-max-1279:w-auto hero-max-1279:min-w-0 hero-max-1279:text-[clamp(46px,6.6vw,64px)] hero-tablet:block hero-tablet:h-auto hero-tablet:w-auto hero-tablet:min-w-0 hero-tablet:leading-none hero-tablet-landscape:text-[clamp(62px,6.7vw,82px)] hero-tablet-landscape:leading-[0.97] hero-tablet-landscape-short:text-[clamp(44px,5.2vw,58px)] hero-tablet-landscape-short:leading-[0.96] hero-portrait-wide:block hero-portrait-wide:h-auto hero-portrait-wide:w-auto hero-portrait-wide:min-w-0 hero-portrait-wide:text-[clamp(52px,5vw,76px)] hero-portrait-wide:leading-none hero-mobile:block hero-mobile:h-auto hero-mobile:w-auto hero-mobile:min-w-0 hero-mobile:text-[clamp(42px,12.5vw,58px)] hero-mobile:leading-none hero-mobile-short:text-[clamp(36px,11.5vw,46px)] hero-landscape:min-w-0 hero-landscape:text-[clamp(58px,4.8vw,92px)] hero-landscape:leading-[0.98]'

const heroDiaColors = [
  'oklch(58% 0.23 31)',
  'oklch(72% 0.23 38)',
  'oklch(86% 0.16 70)',
  'oklch(98% 0.035 88)',
  'oklch(64% 0.22 24)',
]

function heroDelayToSeconds(delay: string) {
  const value = Number.parseFloat(delay)

  if (!Number.isFinite(value)) return 0

  return delay.trim().endsWith('ms') ? value / 1000 : value
}

function MapLabel({ label, location }: { label: string; location: MapLabelLocation }) {
  return (
    <span
      className={cn(
        'absolute z-[4] hidden flex-col text-[clamp(10px,0.78vw,14px)] leading-[1.08] font-extrabold text-[#6a7478] uppercase [text-shadow:0_1px_0_rgb(255_255_255/76%),0_7px_12px_rgb(69_54_38/9%)] motion-safe:animate-[heroLabelIn_560ms_var(--hero-ease-out)_680ms_both] hero-tablet:z-[4] hero-tablet:flex hero-tablet:text-[clamp(9px,1.45vw,11px)] hero-tablet:tracking-normal hero-tablet:opacity-90 hero-mobile:z-0 hero-mobile:flex hero-mobile:text-[clamp(8px,2.3vw,9.5px)] hero-mobile:tracking-normal hero-mobile:opacity-90',
        location === 'vaughan' && 'top-[17.45%] left-[45.1%] hero-tablet:hidden hero-mobile:hidden',
        location === 'markham' && 'top-[17.35%] left-[76.7%] hero-tablet:hidden hero-mobile:hidden',
        location === 'northYork' &&
          'top-[16.15%] left-[64.6%] hero-mobile:top-[31.7%] hero-mobile:left-[46.6%]',
        location === 'scarborough' &&
          'top-[17.55%] left-[87.1%] hero-mobile:top-[33.9%] hero-mobile:left-[69.6%]',
        location === 'etobicoke' &&
          'top-[55.8%] left-[36.8%] hero-mobile:top-[59.6%] hero-mobile:left-[5.4%]',
        location === 'mississauga' &&
          'top-[73.8%] left-[37.9%] hero-mobile:top-[68.1%] hero-mobile:left-[30.2%]',
      )}
    >
      {label.split('\n').map((line) => (
        <span key={line}>{line}</span>
      ))}
    </span>
  )
}

function StatItem({
  icon: Icon,
  isLast,
  text,
}: {
  icon: typeof ShieldCheck
  isLast: boolean
  text: string
}) {
  return (
    <div className="relative grid grid-cols-[clamp(28px,2.15vw,36px)_1fr] items-center gap-[clamp(8px,0.72vw,12px)] text-[#0d2732] [&>span:not(.stat-divider)]:whitespace-pre-line [&>span:not(.stat-divider)]:text-[clamp(10px,0.78vw,14px)] [&>span:not(.stat-divider)]:leading-[1.36] [&>span:not(.stat-divider)]:font-bold hero-tablet:min-w-0 hero-tablet:grid-cols-[minmax(0,1fr)] hero-tablet:content-center hero-tablet:justify-items-center hero-tablet:gap-x-0 hero-tablet:gap-y-[3px] hero-tablet:text-center hero-tablet:[&>span:not(.stat-divider)]:max-w-[92px] hero-tablet:[&>span:not(.stat-divider)]:text-[clamp(8.8px,1.45vw,10.5px)] hero-tablet:[&>span:not(.stat-divider)]:leading-[1.12] hero-tablet:[&>span:not(.stat-divider)]:font-extrabold hero-mobile:min-w-0 hero-mobile:grid-cols-[minmax(0,1fr)] hero-mobile:content-center hero-mobile:justify-items-center hero-mobile:gap-x-1.5 hero-mobile:gap-y-0.5 hero-mobile:text-center hero-mobile:[&>span:not(.stat-divider)]:max-w-[72px] hero-mobile:[&>span:not(.stat-divider)]:text-[clamp(8px,2.35vw,9.6px)] hero-mobile:[&>span:not(.stat-divider)]:leading-[1.12] hero-mobile:[&>span:not(.stat-divider)]:font-extrabold hero-landscape-narrow:grid-cols-[28px_minmax(0,1fr)] hero-landscape-narrow:gap-2 hero-landscape-narrow:[&>span:not(.stat-divider)]:text-[clamp(10px,0.95vw,12px)] hero-landscape-narrow:[&>span:not(.stat-divider)]:leading-[1.22]">
      <Icon
        aria-hidden="true"
        className="size-[clamp(26px,1.98vw,33px)] hero-tablet:size-[clamp(18px,3vw,24px)] hero-mobile:size-[clamp(14px,5.2vw,22px)]"
        strokeWidth={1.85}
      />
      <span>{text}</span>
      {!isLast ? (
        <span
          aria-hidden="true"
          className="stat-divider absolute top-1/2 right-[clamp(7px,0.72vw,12px)] h-[clamp(34px,2.64vw,44px)] w-px -translate-y-1/2 bg-[#ddd2c8] hero-landscape-narrow:hidden hero-tablet:right-0 hero-tablet:block hero-tablet:h-[34px] hero-mobile:right-0 hero-mobile:block hero-mobile:h-8"
        />
      ) : null}
    </div>
  )
}

function HeroTitleLine({
  children,
  className,
  delay,
}: {
  children: string
  className?: string
  delay: string
}) {
  const diaDelay = heroDelayToSeconds(delay) + 0.08

  return (
    <span
      className={cn(
        'block whitespace-nowrap motion-safe:animate-[heroTitleLineIn_680ms_var(--hero-ease-out)_var(--hero-title-delay)_both]',
        className,
      )}
      style={{ '--hero-title-delay': delay } as CSSProperties}
    >
      <DiaTextReveal
        className="block"
        colors={heroDiaColors}
        delay={diaDelay}
        duration={0.96}
        solidAfterReveal
        text={children}
        textColor="var(--fairlend-ink)"
        triggerOnView={false}
      />
    </span>
  )
}

function HeroFinancingLine({ className, delay }: { className: string; delay: string }) {
  const diaDelay = heroDelayToSeconds(delay) + 0.08

  return (
    <span
      className={cn(
        'whitespace-nowrap motion-safe:animate-[heroTitleLineIn_680ms_var(--hero-ease-out)_var(--hero-title-delay)_both]',
        className,
      )}
      style={{ '--hero-title-delay': delay } as CSSProperties}
    >
      <span className="text-[var(--fairlend-orange)] [text-shadow:0_1px_0_rgb(255_237_226/70%),0_12px_28px_rgb(255_58_25/10%)]">
        <DiaTextReveal
          className="inline-block"
          colors={heroDiaColors}
          delay={diaDelay}
          duration={0.96}
          solidAfterReveal
          text="Financing"
          textColor="var(--fairlend-orange)"
          triggerOnView={false}
        />
        <span
          aria-hidden="true"
          className="relative inline-block h-[1em] w-[0.18em] align-baseline"
          data-testid="hero-financing-caret-anchor"
        >
          {' '}
          <HeroHandwrittenInsertion />
        </span>
        <DiaTextReveal
          className="inline-block"
          colors={heroDiaColors}
          delay={diaDelay + 0.12}
          duration={0.72}
          solidAfterReveal
          text="for:"
          textColor="var(--fairlend-orange)"
          triggerOnView={false}
        />
      </span>
    </span>
  )
}

function StatsStrip() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[14] hidden h-[clamp(190px,16vw,260px)] bg-[linear-gradient(to_bottom,rgb(255_253_247/0%)_0%,rgb(235_245_244/18%)_20%,rgb(245_249_247/42%)_43%,rgb(255_253_247/82%)_78%,rgb(255_253_247)_100%)] hero-landscape:block"
      />
      <div
        className="absolute right-0 bottom-0 left-0 z-[15] flex h-[clamp(64px,5.5vw,92px)] items-center justify-center overflow-visible bg-transparent motion-safe:animate-[heroPanelIn_680ms_var(--hero-ease-out)_460ms_both] hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden"
        data-testid="hero-desktop-stats-strip"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-54px] bottom-0 z-0 bg-[linear-gradient(to_bottom,rgb(246_251_250/0%)_0%,rgb(246_251_250/20%)_28%,rgb(255_253_247/62%)_62%,rgb(255_253_247/94%)_100%)] shadow-[0_-12px_36px_rgb(27_48_49/4%)] backdrop-blur-[10px] backdrop-saturate-[0.94] [-webkit-mask-image:linear-gradient(to_bottom,rgb(0_0_0/0%)_0%,rgb(0_0_0/46%)_34%,rgb(0_0_0)_58%,rgb(0_0_0)_100%)] [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0%)_0%,rgb(0_0_0/46%)_34%,rgb(0_0_0)_58%,rgb(0_0_0)_100%)]"
        />
        <div className="relative z-10 grid w-full max-w-[min(1280px,88vw)] grid-cols-[minmax(300px,0.85fr)_minmax(520px,1.45fr)] items-center gap-[clamp(24px,2.8vw,48px)] px-[clamp(24px,2.8vw,48px)]">
          <FairlendRegistrationDisclosure className="m-0 min-w-0 border-[rgb(255_250_244/62%)] bg-[rgb(255_250_244/46%)] shadow-none backdrop-blur-sm" />
          <div className="grid grid-cols-4 items-center gap-4">
            {stats.map(({ icon: Icon, text }, index) => (
              <StatItem icon={Icon} isLast={index === stats.length - 1} key={text} text={text} />
            ))}
          </div>
        </div>
      </div>
      <Card
        className="hidden items-center border border-[rgb(241_229_217/88%)] bg-[rgb(255_250_244/90%)] shadow-[0_18px_36px_rgb(56_35_20/8%)] motion-safe:animate-[heroPanelIn_680ms_var(--hero-ease-out)_460ms_both] hero-tablet:relative hero-tablet:bottom-auto hero-tablet:left-auto hero-tablet:mt-1 hero-tablet:grid hero-tablet:min-h-[clamp(54px,8vw,66px)] hero-tablet:w-full hero-tablet:min-w-0 hero-tablet:grid-cols-4 hero-tablet:gap-0 hero-tablet:rounded-none hero-tablet:border-0 hero-tablet:bg-transparent hero-tablet:p-0 hero-tablet:shadow-none hero-tablet-landscape:hidden hero-portrait-wide:relative hero-portrait-wide:bottom-auto hero-portrait-wide:left-auto hero-portrait-wide:mt-2 hero-portrait-wide:grid hero-portrait-wide:min-h-[clamp(58px,5.2vw,74px)] hero-portrait-wide:w-full hero-portrait-wide:min-w-0 hero-portrait-wide:grid-cols-4 hero-portrait-wide:gap-0 hero-portrait-wide:rounded-none hero-portrait-wide:border-0 hero-portrait-wide:bg-transparent hero-portrait-wide:p-0 hero-portrait-wide:shadow-none hero-mobile:relative hero-mobile:bottom-auto hero-mobile:left-auto hero-mobile:mt-0.5 hero-mobile:grid hero-mobile:min-h-[clamp(52px,15vw,62px)] hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:grid-cols-4 hero-mobile:gap-0 hero-mobile:rounded-none hero-mobile:border-0 hero-mobile:bg-transparent hero-mobile:p-0 hero-mobile:shadow-none"
        data-testid="hero-compact-stats-strip"
      >
        {mobileStats.map(({ icon: Icon, text }, index) => (
          <StatItem icon={Icon} isLast={index === mobileStats.length - 1} key={text} text={text} />
        ))}
      </Card>
    </>
  )
}

export function FairlendLandingHero() {
  return (
    <main
      className="min-h-svh overflow-hidden bg-[rgb(255_253_247)] hero-mobile:!h-svh hero-mobile:!min-h-svh font-sans text-[var(--fairlend-ink)] antialiased [--fairlend-hero-warm-cream:#fffdf7] [--fairlend-hero-warm-cream-soft:#f8fbf8] [--fairlend-navy:#0d2746] [--hero-ease-out:cubic-bezier(0.16,1,0.3,1)] [--hero-ease-quint:cubic-bezier(0.22,1,0.36,1)] [font-family:var(--font-inter),Arial,sans-serif] [font-kerning:normal] [font-optical-sizing:auto] [text-rendering:geometricPrecision] hero-max-1279:overflow-visible"
    >
      <section
        aria-labelledby="fairlend-hero-title"
        className="relative isolate overflow-hidden bg-[rgb(255_253_247)] hero-max-1279:min-h-svh hero-max-1279:overflow-hidden hero-mobile:!h-svh hero-mobile:!min-h-svh hero-max-1279:pt-[92px] hero-max-1279:pb-5 hero-tablet:pt-[96px] hero-tablet:pb-5 hero-tablet-landscape:pt-[86px] hero-tablet-landscape:pb-0 hero-tablet-landscape-short:pt-[68px] hero-portrait-wide:min-h-svh hero-portrait-wide:pt-[96px] hero-portrait-wide:pb-0 hero-mobile:pt-0 hero-mobile:!pb-0"
      >
        <div className={heroStageClassName}>
          <div className={mapLayerClassName}>
            <div className={mapFrameClassName} data-testid="hero-map-frame">
              <div
                className="absolute inset-0 overflow-hidden hero-max-1279:top-0 hero-max-1279:right-0 hero-max-1279:bottom-auto hero-max-1279:left-0 hero-max-1279:h-full hero-tablet-landscape:overflow-visible"
                data-testid="hero-mobile-route-frame"
              >
                <picture>
                  <source
                    height={1672}
                    media="(max-width: 1023px), (orientation: portrait)"
                    srcSet="/assets/mobileHero.png"
                    width={941}
                  />
                  <img
                    alt=""
                    className="block size-full max-w-none border-none object-cover object-center hero-tablet:object-[50%_35%] hero-tablet-landscape:object-contain hero-tablet-landscape:object-center hero-tablet-landscape:drop-shadow-[0_26px_42px_rgb(64_44_28/12%)] hero-tablet-landscape:[-webkit-mask-image:radial-gradient(ellipse_70%_52%_at_61%_43%,black_0%,black_50%,rgb(0_0_0/78%)_61%,rgb(0_0_0/34%)_74%,transparent_94%)] hero-tablet-landscape:[mask-image:radial-gradient(ellipse_70%_52%_at_61%_43%,black_0%,black_50%,rgb(0_0_0/78%)_61%,rgb(0_0_0/34%)_74%,transparent_94%)] hero-mobile:object-center hero-mobile:-translate-y-[50px]"
                    decoding="async"
                    fetchPriority="high"
                    height={821}
                    src="/assets/fairlend-hero-jun-26-2026.png"
                    width={1916}
                  />
                </picture>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[2] hidden"
                />
                <FairlendHeroProcess mobileRouteOnly steps={processSteps} />
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[-38px] bottom-[-38px] left-[-198px] z-[3] hidden w-[430px]"
              />
              <div className="hero-landscape:hidden">
                <FairlendHeroProcess desktopOnly steps={processSteps} />
              </div>
            </div>

            {mapLabels.map(({ label, location }) => (
              <MapLabel key={label} label={label} location={location} />
            ))}
            <FairlendHeroProcess mobileOnly steps={processSteps} />
          </div>

          <span aria-hidden="true" className="hidden" />
          <div
            className="contents hero-mobile:absolute hero-mobile:inset-x-0 hero-mobile:bottom-0 hero-mobile:z-10 hero-mobile:mx-3 hero-mobile:flex hero-mobile:!h-[50svh] hero-mobile:max-h-[50svh] hero-mobile:flex-col hero-mobile:overflow-y-auto hero-mobile:rounded-[22px] hero-mobile:border hero-mobile:border-[rgb(255_255_255/92%)] hero-mobile:bg-[radial-gradient(ellipse_110%_170%_at_15%_140%,oklch(99%_0.014_82/0.82)_72%,oklch(98.5%_0.022_80/0.74)_82%,oklch(97.2%_0.031_78/0.38)_90%,oklch(97.2%_0.031_78/0.1)_95%,oklch(97.2%_0.031_78/0.08)_100%),linear-gradient(to_bottom,oklch(98.8%_0.018_82/0.34)_0%,var(--fairlend-hero-warm-cream)_100%)] hero-mobile:px-[clamp(18px,5vw,24px)] hero-mobile:pt-[clamp(12px,3.2vw,18px)] hero-mobile:pb-[clamp(14px,4vw,22px)] hero-mobile:shadow-[0_24px_40px_rgb(62_40_23/14%),0_4px_12px_rgb(62_40_23/10%),inset_0_1px_0_rgb(255_255_255/78%)] hero-tablet:absolute hero-tablet:right-[clamp(18px,3.6vw,34px)] hero-tablet:bottom-[clamp(14px,2.4vw,24px)] hero-tablet:left-[clamp(18px,3.6vw,34px)] hero-tablet:z-10 hero-tablet:mx-auto hero-tablet:flex hero-tablet:max-w-[760px] hero-tablet:flex-col hero-tablet:rounded-[22px] hero-tablet:border hero-tablet:border-[rgb(255_255_255/92%)] hero-tablet:bg-[radial-gradient(ellipse_110%_170%_at_15%_140%,oklch(99%_0.014_82/0.82)_72%,oklch(98.5%_0.022_80/0.74)_82%,oklch(97.2%_0.031_78/0.38)_90%,oklch(97.2%_0.031_78/0.1)_95%,oklch(97.2%_0.031_78/0.08)_100%),linear-gradient(to_bottom,oklch(98.8%_0.018_82/0.34)_0%,var(--fairlend-hero-warm-cream)_100%)] hero-tablet:px-[clamp(16px,2.8vw,24px)] hero-tablet:pt-[clamp(14px,2.2vw,20px)] hero-tablet:pb-[clamp(8px,1.4vw,12px)] hero-tablet:shadow-[0_24px_40px_rgb(62_40_23/14%),0_4px_12px_rgb(62_40_23/10%),inset_0_1px_0_rgb(255_255_255/78%)] hero-tablet-landscape:contents hero-tablet-landscape:border-0 hero-tablet-landscape:bg-transparent hero-tablet-landscape:p-0 hero-tablet-landscape:shadow-none hero-portrait-wide:absolute hero-portrait-wide:right-[clamp(28px,5vw,68px)] hero-portrait-wide:bottom-[clamp(28px,3svh,54px)] hero-portrait-wide:left-[clamp(28px,5vw,68px)] hero-portrait-wide:z-10 hero-portrait-wide:mx-auto hero-portrait-wide:flex hero-portrait-wide:max-w-[800px] hero-portrait-wide:flex-col hero-portrait-wide:rounded-[24px] hero-portrait-wide:border hero-portrait-wide:border-[rgb(255_255_255/92%)] hero-portrait-wide:bg-[radial-gradient(ellipse_110%_170%_at_15%_140%,oklch(99%_0.014_82/0.82)_72%,oklch(98.5%_0.022_80/0.74)_82%,oklch(97.2%_0.031_78/0.38)_90%,oklch(97.2%_0.031_78/0.1)_95%,oklch(97.2%_0.031_78/0.08)_100%),linear-gradient(to_bottom,oklch(98.8%_0.018_82/0.34)_0%,var(--fairlend-hero-warm-cream)_100%)] hero-portrait-wide:px-[clamp(20px,3vw,30px)] hero-portrait-wide:pt-[clamp(18px,2.4vw,26px)] hero-portrait-wide:pb-[clamp(10px,1.6vw,16px)] hero-portrait-wide:shadow-[0_24px_40px_rgb(62_40_23/14%),0_4px_12px_rgb(62_40_23/10%),inset_0_1px_0_rgb(255_255_255/78%)] hero-mobile:absolute hero-mobile:right-0 hero-mobile:bottom-0 hero-mobile:left-0 hero-mobile:z-10 hero-mobile:-mx-2.5 hero-mobile:flex hero-mobile:w-auto hero-mobile:flex-col hero-mobile:rounded-t-[20px] hero-mobile:border hero-mobile:border-white hero-mobile:bg-[radial-gradient(ellipse_110%_170%_at_15%_140%,oklch(99%_0.014_82/0.82)_72%,oklch(98.5%_0.022_80/0.74)_82%,oklch(97.2%_0.031_78/0.38)_90%,oklch(97.2%_0.031_78/0.1)_95%,oklch(97.2%_0.031_78/0.08)_100%),linear-gradient(to_bottom,oklch(98.8%_0.018_82/0.34)_0%,var(--fairlend-hero-warm-cream)_100%)] hero-mobile:px-3 hero-mobile:pt-3 hero-mobile:pb-2.5 hero-mobile:shadow-[0_24px_40px_rgb(62_40_23/16%),0_4px_12px_rgb(62_40_23/12%),inset_0_1px_0_rgb(255_255_255/78%)] hero-mobile-short:pt-2.5"
            data-testid="hero-compact-panel"
          >
            <div className={heroCopyClassName} data-fairlend-hero-copy>
              <span
                aria-hidden="true"
                className="mt-[22px] block h-0.5 w-[43px] bg-[var(--fairlend-orange)] hero-tablet:hidden hero-tablet-landscape:block hero-tablet-landscape-short:hidden hero-mobile:hidden"
              />
              <h1 id="fairlend-hero-title" className={heroTitleClassName}>
                <HeroFinancingLine
                  className="block hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden"
                  delay="220ms"
                />
                <HeroTitleLine
                  className="hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden"
                  delay="320ms"
                >
                  Multiplex
                </HeroTitleLine>
                <HeroTitleLine
                  className="hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden"
                  delay="420ms"
                >
                  Single Family
                </HeroTitleLine>
                <HeroTitleLine
                  className="hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden"
                  delay="520ms"
                >
                  Land Purchase
                </HeroTitleLine>
                <HeroFinancingLine
                  className="hidden hero-tablet:block hero-portrait-wide:block hero-mobile:block"
                  delay="220ms"
                />
                <HeroTitleLine
                  className="hidden hero-tablet:block hero-portrait-wide:block hero-mobile:block"
                  delay="320ms"
                >
                  Multiplex
                </HeroTitleLine>
                <HeroTitleLine
                  className="hidden hero-tablet:block hero-portrait-wide:block hero-mobile:block"
                  delay="420ms"
                >
                  Single Family
                </HeroTitleLine>
                <HeroTitleLine
                  className="hidden hero-tablet:block hero-portrait-wide:block hero-mobile:block"
                  delay="520ms"
                >
                  Land Purchase
                </HeroTitleLine>
              </h1>
              <p className="block w-[511px] pt-5 pb-0 hero-tablet:hidden hero-portrait-wide:hidden hero-mobile:hidden hero-landscape:w-full hero-landscape:pt-4">
                <span className="block">
                  We guide you from permit or planning through acquisition, construction,
                </span>
                <span className="block">
                  completion,{' '}
                  <strong className="font-semibold text-[var(--fairlend-orange)] hero-tablet:font-bold hero-mobile:font-bold">
                    (and beyond)
                  </strong>
                </span>
              </p>
              <p className="hidden max-w-[520px] pb-2 hero-tablet:block hero-tablet-landscape-short:max-w-[430px] hero-tablet-landscape-short:pb-0 hero-tablet-landscape-short:text-[15px] hero-tablet-landscape-short:leading-[1.3] hero-portrait-wide:block hero-mobile:block">
                <span className="block">Fairlend is more than a lender.</span>
                <span className="block">
                  We&apos;re with you from planning to completion{' '}
                  <strong className="font-semibold text-[var(--fairlend-orange)] hero-tablet:font-bold hero-mobile:font-bold">
                    (and beyond)
                  </strong>
                </span>
              </p>
              <FairlendTalkToExpertCta className="mt-3 hero-tablet:hidden hero-tablet-landscape:flex hero-tablet-landscape-short:hidden hero-mobile:hidden" />
            </div>
            <div className="contents" data-fairlend-hero-application>
              <FairlendApplicationForm />
            </div>
            <StatsStrip />
          </div>
        </div>
      </section>
    </main>
  )
}
