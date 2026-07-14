import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { FairlendConsultationBookingDialog } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingDialog.client'
import { FairlendBuildPropertyTypes } from '@/components/FairlendBuildPropertyTypes'
import {
  FAIRLEND_CONTACT_PHONE_HREF,
  FAIRLEND_CONTACT_PHONE_LABEL,
  FairlendTalkToExpertCta,
} from '@/components/FairlendTalkToExpertCta'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'
import { cn } from '@/utilities/ui'

import { FairlendApplicationArrow } from './FairlendApplicationArrow.client'
import { FairlendApplicationForm } from './FairlendApplicationForm.client'
import { torontoCloudLayers, torontoHeroAssets } from './toronto-scene-assets'

const proofStats = [
  {
    disclaimer: `*${fairlendPrincipalBrokerClaims.volumeDisclosure}`,
    label: 'volume by\nprincipal\nbroker',
    qualifier: '*',
    value: fairlendPrincipalBrokerClaims.volumeValue,
  },
  {
    disclaimer: '*Available for complete files; timing varies by file.',
    label: 'commitment\ntarget',
    prefix: 'hrs',
    qualifier: '*',
    value: '24',
  },
  {
    disclaimer: `*${fairlendPrincipalBrokerClaims.experienceDisclosure}`,
    label: 'years\nexperience',
    qualifier: '*',
    value: fairlendPrincipalBrokerClaims.experienceValue,
  },
] as const

type TorontoCloudLayerProps = {
  className: string
  cloudKey: string
  delay: string
  driftDuration: string
  driftX: string
  driftY: string
  enterX: string
  enterY: string
  height: number
  src: string
  width: number
  zIndex: number
}

function BookConsultationButton({ mobileDocked = false }: { mobileDocked?: boolean }) {
  return (
    <FairlendConsultationBookingDialog
      ariaLabel="Book a free FairLend consultation"
      className={cn(
        'fairlend-toronto-copy group h-[55px] items-center gap-[12px] rounded-[9px] bg-[#96ec18] py-0 pr-5 pl-[18px] text-[17px] leading-none font-normal text-[#101010] shadow-[0_10px_24px_rgb(118_205_0/12%)] outline-none transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#a4fb20] hover:shadow-[0_14px_32px_rgb(118_205_0/18%)] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f7f5] max-md:h-12 max-md:w-[min(100%,455px)] max-md:justify-between max-md:px-4 max-md:text-[15px]',
        mobileDocked
          ? 'hidden hero-mobile:relative hero-mobile:z-10 hero-mobile:mt-0 hero-mobile:inline-flex hero-mobile:h-[46px] hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:gap-1.5 hero-mobile:rounded-[8px] hero-mobile:px-2.5 hero-mobile:text-[11px] hero-mobile:leading-none'
          : 'inline-flex hero-mobile:hidden',
      )}
      leadershipCta={false}
      source={
        mobileDocked ? 'homepage-hero-mobile-book-consultation' : 'homepage-hero-book-consultation'
      }
      style={{ '--toronto-delay': '320ms' } as CSSProperties}
    >
      <span className={cn(mobileDocked && 'min-w-0 text-left')}>
        {mobileDocked ? 'Book Consultation' : 'Book a Free Consultation'}
      </span>
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[8px] bg-[#111] text-[#aaff00] transition-transform duration-200 group-hover:rotate-6 max-md:size-8 hero-mobile:size-[24px]">
        <ArrowUpRight
          aria-hidden="true"
          className="size-[20px] hero-mobile:size-[15px]"
          strokeWidth={2.25}
        />
      </span>
    </FairlendConsultationBookingDialog>
  )
}

function HeroTalkToExpertButton({ mobileDocked = false }: { mobileDocked?: boolean }) {
  return (
    <FairlendTalkToExpertCta
      aria-label={`Call FairLend at ${FAIRLEND_CONTACT_PHONE_LABEL}`}
      className={cn(
        'fairlend-toronto-copy h-[55px] rounded-[9px] bg-[#111] px-[18px] py-0 text-[#f8f7f5] shadow-[0_10px_24px_rgb(17_17_17/12%)] hover:bg-[#050607] hover:shadow-[0_14px_32px_rgb(17_17_17/18%)] focus-visible:outline-[#111] focus-visible:outline-offset-4 [&>span:first-child]:bg-[#96ec18] [&>span:first-child]:text-[#111] [&>span:first-child]:shadow-none [&>span:last-child>span:first-child]:text-[#b8c6cc] [&>span:last-child>span:last-child]:text-[15px]',
        mobileDocked
          ? 'hidden hero-mobile:relative hero-mobile:z-10 hero-mobile:flex hero-mobile:h-[46px] hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:justify-start hero-mobile:gap-1.5 hero-mobile:rounded-[8px] hero-mobile:px-2.5 hero-mobile:[&>span:first-child]:size-[24px] hero-mobile:[&>span:first-child>svg]:size-[14px] hero-mobile:[&>span:last-child]:min-w-0 hero-mobile:[&>span:last-child>span:first-child]:hidden hero-mobile:[&>span:last-child>span:last-child]:text-[11px] hero-mobile:[&>span:last-child>span:last-child]:leading-none'
          : 'max-md:w-[min(100%,455px)] max-md:justify-start hero-mobile:hidden',
      )}
      eyebrow="Talk to an expert"
      href={FAIRLEND_CONTACT_PHONE_HREF}
      label={FAIRLEND_CONTACT_PHONE_LABEL}
      style={{ '--toronto-delay': mobileDocked ? '380ms' : '360ms' } as CSSProperties}
    />
  )
}

function HeroDesktopActions() {
  return (
    <div className="mt-0 flex flex-wrap items-center gap-3 hero-mobile:hidden">
      <BookConsultationButton />
      <HeroTalkToExpertButton />
    </div>
  )
}

function ProofStats() {
  return (
    <aside
      aria-label="FairLend proof points"
      className="animate-authority-variant-two delight-proof absolute top-[18%] right-[4.4%] z-10 hidden w-[294px] border border-[#08090a] bg-[#f8f7f5]/96 p-4 shadow-[8px_8px_0_#96ec18] xl:block"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.34] mix-blend-multiply"
        style={{ backgroundImage: "url('/textures/grid-noise.png')" }}
      />
      <div className="relative flex items-center justify-between pb-3">
        <span
          aria-hidden="true"
          className="authority-rule absolute inset-x-0 bottom-0 h-px bg-[#08090a]"
        />
        <p className="m-0 text-[10px] font-extrabold tracking-[0.16em] uppercase">Authority file</p>
        <span className="delight-stamp border border-[#72b900] px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] text-[#72b900] opacity-60 transition-[transform,opacity] duration-300">
          VERIFIED
        </span>
      </div>
      <div className="relative divide-y divide-[#08090a]/25">
        {proofStats.map((stat) => (
          <div
            className="delight-row grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3 py-4 transition-transform duration-300 ease-out"
            key={stat.value}
          >
            <strong className="text-[54px] leading-[0.82] font-normal tracking-[-0.04em] [font-family:var(--font-dm-serif-display),Georgia,serif]">
              {stat.value}
              {'prefix' in stat ? (
                <span className="ml-1 font-sans text-[12px] font-extrabold tracking-[0.08em] uppercase">
                  {stat.prefix}
                </span>
              ) : null}
              <sup className="text-[10px]">{stat.qualifier}</sup>
            </strong>
            <span className="text-[14px] leading-[1.08] font-bold uppercase whitespace-pre-line">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      <p className="relative mt-2 border-t border-[#08090a]/25 pt-2 text-[8px] leading-[1.25] font-semibold text-[#141414]/65">
        *Career funded-mortgage volume uses internal funded-file records; experience and volume
        reviewed {fairlendPrincipalBrokerClaims.asOfDate}. Commitment timing varies by complete
        file.
      </p>
    </aside>
  )
}

function MobileAuthorityBar() {
  const statValueClassName =
    'whitespace-nowrap text-[clamp(22px,7.4vw,30px)] leading-[0.82] font-normal tracking-[-0.04em] text-[#050506] [font-family:var(--font-dm-serif-display),Georgia,serif]'
  const statLabelClassName =
    'min-h-[30px] text-[8px] leading-[1.06] font-bold tracking-[0.08em] text-[#141414]/72 uppercase hero-compact:text-[7px]'

  return (
    <aside
      aria-label="FairLend authority points"
      className="fairlend-toronto-copy relative isolate hidden w-full overflow-hidden rounded-[9px] border border-[#08090a] bg-[#f8f7f5]/96 p-3 shadow-[6px_6px_0_#96ec18] hero-compact:p-2.5 hero-mobile:block"
      style={{ '--toronto-delay': '420ms' } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.34] mix-blend-multiply"
        style={{ backgroundImage: "url('/textures/grid-noise.png')" }}
      />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-[#08090a] pb-2">
          <p className="m-0 text-[9px] font-extrabold tracking-[0.16em] uppercase hero-compact:text-[8px]">
            Authority file
          </p>
          <span className="border border-[#72b900] px-1.5 py-1 text-[7px] leading-none font-extrabold tracking-[0.12em] text-[#5e9800] uppercase">
            Verified
          </span>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-[#08090a]/25 pt-2.5">
          {proofStats.map((stat) => (
            <div
              className="flex min-w-0 flex-col justify-between px-2 first:pl-0 last:pr-0"
              key={stat.value}
            >
              <dt className={cn(statLabelClassName, 'order-2 mt-2 whitespace-pre-line')}>
                {stat.label}
              </dt>
              <dd className="order-1 flex items-baseline gap-1">
                <strong className={statValueClassName}>
                  {stat.value}
                  <sup className="align-top text-[8px] tracking-normal">{stat.qualifier}</sup>
                </strong>
                {'prefix' in stat ? (
                  <span className="text-[11px] leading-none font-bold tracking-[-0.02em] text-[#050506]">
                    {stat.prefix}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2.5 border-t border-[#08090a]/25 pt-2 text-[8px] leading-[1.15] font-medium tracking-[0.01em] text-[#141414]/65">
          *Career funded-mortgage volume uses internal funded-file records; experience and volume
          reviewed {fairlendPrincipalBrokerClaims.asOfDate}. Commitment timing varies by complete
          file.
        </p>
      </div>
    </aside>
  )
}

function CloudLayer({
  className,
  cloudKey,
  delay,
  driftDuration,
  driftX,
  driftY,
  enterX,
  enterY,
  height,
  src,
  width,
  zIndex,
}: TorontoCloudLayerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('fairlend-toronto-cloud absolute block max-md:hidden', className)}
      data-toronto-cloud={cloudKey}
      style={
        {
          '--cloud-delay': delay,
          '--cloud-drift-duration': driftDuration,
          '--cloud-drift-x': driftX,
          '--cloud-drift-y': driftY,
          '--cloud-enter-x': enterX,
          '--cloud-enter-y': enterY,
          zIndex,
        } as CSSProperties
      }
    >
      <span
        className="block"
        data-toronto-cloud-depth={zIndex >= 4 ? '28' : '16'}
        data-toronto-cloud-scroll
      >
        <span className="fairlend-toronto-cloud-drift block">
          <Image
            alt=""
            className="block h-auto w-full select-none object-contain opacity-[0.82] [filter:contrast(0.76)_brightness(1.16)] [-webkit-user-drag:none]"
            decoding="async"
            fetchPriority="low"
            height={height}
            loading="lazy"
            sizes="(max-width: 768px) 35vw, 28vw"
            src={src}
            width={width}
          />
        </span>
      </span>
    </span>
  )
}

function TorontoScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      data-testid="toronto-hero-scene"
    >
      <div className="absolute inset-0 mx-auto h-full w-full max-w-full overflow-hidden">
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full object-cover opacity-[0.42] mix-blend-multiply max-md:hidden"
          decoding="async"
          height={941}
          preload
          sizes="100vw"
          src="/assets/fairlend-toronto-contour-map.webp"
          width={1672}
        />

        {torontoCloudLayers
          .filter((layer) => layer.zIndex < 4)
          .map((layer) => (
            <CloudLayer {...layer} cloudKey={layer.key} key={layer.key} />
          ))}

        <div
          className="fairlend-toronto-skyline absolute top-[8.2%] left-0 z-[3] w-full max-w-full -translate-y-[60px] max-lg:top-[16%] max-lg:left-1/2 max-lg:w-[118%] max-lg:-translate-x-1/2 max-lg:translate-y-0 max-md:top-[27%] max-md:w-[156%]"
          data-toronto-skyline
        >
          <div data-toronto-skyline-scroll>
            <Image
              alt=""
              className="block h-auto w-full select-none object-contain opacity-[0.88] [filter:contrast(0.86)_brightness(1.13)] [-webkit-user-drag:none]"
              decoding="async"
              fetchPriority="high"
              height={1000}
              priority
              sizes="(max-width: 576px) 260vw, (max-width: 768px) 178vw, (max-width: 1024px) 122vw, (min-width: 1536px) 83vw, 1280px"
              src={torontoHeroAssets.skyline}
              width={1600}
            />
          </div>
        </div>

        {torontoCloudLayers
          .filter((layer) => layer.zIndex >= 4)
          .map((layer) => (
            <CloudLayer {...layer} cloudKey={layer.key} key={layer.key} />
          ))}
      </div>
    </div>
  )
}

export function FairlendLandingHero() {
  return (
    <div className="w-full max-w-full overflow-hidden bg-[var(--landing-hero-paper,#f8f7f5)] text-[#08090a]">
      <section
        aria-labelledby="fairlend-hero-title"
        className="relative isolate w-full max-w-full overflow-hidden rounded-b-[28px] bg-[var(--landing-hero-paper,#f8f7f5)] [font-family:var(--font-inter),Arial,sans-serif]"
        data-fairlend-motion="toronto-hero"
        data-testid="fairlend-toronto-hero"
      >
        <style>{`
          @keyframes fairlendTorontoTitleLineIn {
            from {
              opacity: 0.68;
              transform: translate3d(0, 0.12em, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes fairlendTorontoCopySettle {
            from {
              opacity: 0.72;
              filter: blur(2px);
              transform: translate3d(0, 6px, 0);
            }
            to {
              opacity: 1;
              filter: blur(0);
              transform: translate3d(0, 0, 0);
            }
          }
          .fairlend-toronto-title-line {
            display: block;
            padding-bottom: 0.02em;
          }
          .fairlend-toronto-title-highlight {
            position: relative;
            display: inline-block;
            isolation: isolate;
          }
          .fairlend-toronto-title-highlight::after {
            position: absolute;
            right: -0.035em;
            bottom: 0.035em;
            left: -0.035em;
            z-index: -1;
            height: 0.09em;
            border-radius: 999px 72% 999px 64%;
            background: #96ec18;
            box-shadow: 0 0.045em 0 -0.018em rgb(150 236 24 / 78%);
            content: '';
            transform: rotate(-1.2deg);
          }
          .fairlend-toronto-title[data-title-cascade] {
            animation: none;
            opacity: 1;
          }
          @media (prefers-reduced-motion: no-preference) {
            [data-fairlend-motion='toronto-hero'] .fairlend-toronto-title-line {
              animation: fairlendTorontoTitleLineIn 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
              animation-delay: calc(var(--toronto-delay, 20ms) + (var(--line-index, 0) * 55ms));
              backface-visibility: hidden;
              will-change: opacity, transform;
            }
            [data-fairlend-motion='toronto-hero'] .fairlend-toronto-copy {
              animation: fairlendTorontoCopySettle 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
              animation-delay: var(--toronto-delay, 240ms);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .fairlend-toronto-title-line {
              animation: none !important;
              clip-path: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
        <div
          className="fairlend-toronto-hero-canvas relative mx-auto h-[min(100svh,972px)] min-h-[760px] w-full max-w-full overflow-hidden bg-[var(--landing-hero-paper,#f8f7f5)] px-[clamp(24px,4.55vw,60px)] pt-[clamp(28px,4vw,40px)] max-lg:h-svh max-lg:min-h-[860px] max-md:!h-auto max-md:min-h-[calc(100svh+clamp(36px,6svh,64px))] max-md:px-5 max-md:pt-5 max-md:pb-[clamp(40px,7svh,64px)] hero-mobile:flex hero-mobile:flex-col"
          data-toronto-hero-canvas
        >
          <TorontoScene />

          <div
            className="relative z-10 mt-[64px] w-[min(43vw,466px)] max-w-[466px] max-lg:mt-[80px] max-lg:w-[min(62vw,560px)] max-md:mt-[54px] max-md:w-full max-md:max-w-[455px] hero-mobile:pointer-events-none"
            data-toronto-hero-copy
          >
            <h1
              className="fairlend-toronto-title m-0 font-serif text-[clamp(64px,5.35vw,82px)] leading-[0.98] font-semibold tracking-[-0.04em] text-[#030405] max-lg:text-[clamp(58px,7vw,72px)] max-md:text-[58px] max-md:leading-[1.03] max-md:font-bold max-[390px]:text-[51px]"
              data-title-cascade
              id="fairlend-hero-title"
              style={{ '--toronto-delay': '20ms' } as CSSProperties}
            >
              {(['Fast', 'Flexible', 'Fair', 'Financing for:'] as const).map((line, index) => (
                <span
                  className="fairlend-toronto-title-line"
                  key={line}
                  style={{ '--line-index': index } as CSSProperties}
                >
                  {line === 'Fair' ? (
                    <span className="fairlend-toronto-title-highlight">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
              <span className="sr-only">
                {' '}
                multi-plex, single family, land, and private mortgage
              </span>
            </h1>

            <div
              className="fairlend-toronto-copy mt-[18px] w-full max-w-[466px] max-md:mt-3 hero-mobile:mt-3"
              style={{ '--toronto-delay': '240ms' } as CSSProperties}
            >
              <FairlendBuildPropertyTypes
                className="w-full shadow-none"
                sectionLabel="Multi-plex, single family, land, and private mortgage"
                variant="hero"
              />
            </div>

            <HeroDesktopActions />
          </div>

          <ProofStats />

          <FairlendApplicationArrow />

          <div
            className="contents hero-mobile:relative hero-mobile:z-10 hero-mobile:mt-1 hero-mobile:grid hero-mobile:w-full hero-mobile:max-w-[455px] hero-mobile:grid-cols-2 hero-mobile:gap-2"
            data-toronto-mobile-application
          >
            <BookConsultationButton mobileDocked />
            <HeroTalkToExpertButton mobileDocked />
            <div className="hidden hero-mobile:col-span-2 hero-mobile:block">
              <MobileAuthorityBar />
            </div>
            <FairlendApplicationForm />
          </div>
        </div>
      </section>
    </div>
  )
}
