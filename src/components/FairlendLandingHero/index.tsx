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
import { cn } from '@/utilities/ui'

import { FairlendApplicationArrow } from './FairlendApplicationArrow.client'
import { FairlendApplicationForm } from './FairlendApplicationForm.client'
import { FairlendTorontoHeroParallax } from './FairlendTorontoHeroParallax.client'
import { torontoCloudLayers, torontoHeroAssets } from './toronto-scene-assets'

const proofStats = [
  {
    disclaimer: '*Principal-broker lifetime volume; final figure to be verified.',
    label: 'volume by\nprincipal\nbroker',
    qualifier: '*',
    value: '$2B+',
  },
  {
    disclaimer: '*Available for complete files; timing varies by file.',
    label: 'commitment\ntarget',
    prefix: 'hrs',
    qualifier: '*',
    value: '24',
  },
  {
    disclaimer: '*Principal-broker experience.',
    label: 'years\nexperience',
    qualifier: '*',
    value: '28+',
  },
] as const

const trustedAvatars = [
  {
    className: 'object-[48%_32%] grayscale',
    key: 'borrower',
    style: { '--avatar-rotate': '-7deg' } as CSSProperties,
  },
  {
    className: 'object-[55%_28%] grayscale contrast-[1.04] brightness-[1.05]',
    key: 'builder',
    style: { '--avatar-rotate': '2deg' } as CSSProperties,
  },
  {
    className: 'object-[42%_26%] grayscale contrast-[1.12] brightness-[0.86]',
    key: 'investor',
    style: { '--avatar-rotate': '8deg' } as CSSProperties,
  },
] satisfies Array<{
  className: string
  key: string
  style: CSSProperties
}>

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
          ? 'hidden hero-mobile:relative hero-mobile:z-10 hero-mobile:mt-0 hero-mobile:inline-flex hero-mobile:h-[58px] hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:gap-2 hero-mobile:px-3 hero-mobile:text-[12px] hero-mobile:leading-[1.05]'
          : 'inline-flex hero-mobile:hidden',
      )}
      leadershipCta={false}
      source={
        mobileDocked ? 'homepage-hero-mobile-book-consultation' : 'homepage-hero-book-consultation'
      }
      style={{ '--toronto-delay': '720ms' } as CSSProperties}
    >
      <span className={cn(mobileDocked && 'min-w-0 text-left')}>Book a Free Consultation</span>
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[8px] bg-[#111] text-[#aaff00] transition-transform duration-200 group-hover:rotate-6 max-md:size-8 hero-mobile:size-[30px]">
        <ArrowUpRight aria-hidden="true" className="size-[20px]" strokeWidth={2.25} />
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
          ? 'hidden hero-mobile:relative hero-mobile:z-10 hero-mobile:flex hero-mobile:h-[58px] hero-mobile:w-full hero-mobile:min-w-0 hero-mobile:justify-start hero-mobile:gap-2 hero-mobile:px-3 hero-mobile:[&>span:first-child]:size-[30px] hero-mobile:[&>span:first-child>svg]:size-[17px] hero-mobile:[&>span:last-child]:min-w-0 hero-mobile:[&>span:last-child>span:first-child]:text-[8px] hero-mobile:[&>span:last-child>span:last-child]:text-[12.5px]'
          : 'max-md:w-[min(100%,455px)] max-md:justify-start hero-mobile:hidden',
      )}
      eyebrow="Talk to an expert"
      href={FAIRLEND_CONTACT_PHONE_HREF}
      label={FAIRLEND_CONTACT_PHONE_LABEL}
      style={{ '--toronto-delay': mobileDocked ? '760ms' : '820ms' } as CSSProperties}
    />
  )
}

function HeroDesktopActions() {
  return (
    <div className="mt-[27px] flex flex-wrap items-center gap-3 max-md:mt-5 hero-mobile:hidden">
      <BookConsultationButton />
      <HeroTalkToExpertButton />
    </div>
  )
}

function ProofStats() {
  return (
    <aside
      aria-label="FairLend proof points"
      className="absolute top-[19.4%] right-[4.4%] z-10 hidden w-[270px] flex-col gap-[33px] xl:flex"
    >
      {proofStats.map((stat, index) => (
        <div
          className={cn(
            'fairlend-toronto-copy grid items-center',
            index === 0 && 'grid-cols-[minmax(0,146px)_1fr] gap-[24px]',
            index === 1 && 'ml-[42px] grid-cols-[74px_42px_1fr] gap-[8px]',
            index === 2 && 'mt-[24px] ml-[42px] grid-cols-[minmax(0,126px)_1fr] gap-[24px]',
          )}
          key={stat.value}
          style={{ '--toronto-delay': `${740 + index * 120}ms` } as CSSProperties}
        >
          <strong className="font-serif text-[72px] leading-[0.82] font-normal tracking-[-0.045em] text-[#050506]">
            {stat.value}
            <sup className="ml-[1px] align-super text-[14px] leading-none tracking-normal">
              {stat.qualifier}
            </sup>
          </strong>
          {'prefix' in stat ? (
            <span className="self-center text-[18px] leading-none font-normal text-[#141414]">
              {stat.prefix}
            </span>
          ) : null}
          <span className="text-[18px] leading-[1.17] font-normal text-[#141414]">
            <span className="block whitespace-pre-line">{stat.label}</span>
            <small className="mt-[3px] block max-w-[112px] text-[7px] leading-[1.05] font-medium text-[#141414]/58">
              {stat.disclaimer}
            </small>
          </span>
        </div>
      ))}
    </aside>
  )
}

function MobileAuthorityBar() {
  const mobileStats = [
    {
      label: 'principal broker volume',
      value: proofStats[0].value,
    },
    {
      label: 'years experience',
      value: proofStats[2].value,
    },
    {
      label: 'commitment target',
      value: `${proofStats[1].value} ${proofStats[1].prefix}`,
    },
  ] as const

  return (
    <aside
      aria-label="FairLend authority points"
      className="fairlend-toronto-copy hidden rounded-[9px] border border-[#111]/12 bg-[#f8f7f5]/88 px-3 py-2.5 shadow-[0_10px_24px_rgb(17_17_17/10%)] backdrop-blur-[2px] hero-mobile:grid hero-mobile:grid-cols-3 hero-mobile:gap-2"
      style={{ '--toronto-delay': '780ms' } as CSSProperties}
    >
      {mobileStats.map((stat) => (
        <div
          className="min-w-0 border-l border-[#111]/10 pl-2 first:border-l-0 first:pl-0"
          key={stat.label}
        >
          <strong className="block whitespace-nowrap font-serif text-[22px] leading-none font-normal tracking-[-0.035em] text-[#050506]">
            {stat.value}
          </strong>
          <span className="mt-1 block text-[9px] leading-[1.05] font-semibold tracking-[0.03em] text-[#141414]/72 uppercase">
            {stat.label}
          </span>
        </div>
      ))}
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
            height={height}
            priority
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

function TrustedBy() {
  return (
    <div
      className="fairlend-toronto-copy absolute right-[1.6%] bottom-[7.7%] z-10 hidden items-center gap-[22px] lg:flex"
      data-toronto-trust
      style={{ '--toronto-delay': '1120ms' } as CSSProperties}
    >
      <div className="flex items-center">
        {trustedAvatars.map((avatar, index) => (
          <span
            className="relative -ml-2 first:ml-0 grid size-[45px] overflow-hidden rounded-full border-[2px] border-[#f8f7f5] bg-[#d7d6d2] shadow-[0_6px_14px_rgb(0_0_0/8%)]"
            key={avatar.key}
            style={avatar.style}
          >
            <Image
              alt=""
              className={cn(
                'size-full scale-[1.18] object-cover [transform:rotate(var(--avatar-rotate))_scale(1.18)]',
                avatar.className,
              )}
              height={80}
              loading={index === 0 ? 'eager' : 'lazy'}
              src="/assets/elie-headshot.webp"
              width={80}
            />
          </span>
        ))}
      </div>
      <div className="grid gap-[7px] text-[17px] leading-[1.12] font-normal text-[#111]">
        <svg
          aria-hidden="true"
          className="ml-0.5 size-[13px] fill-[#8dff00] text-[#8dff00]"
          viewBox="0 0 24 24"
        >
          <path d="M12 20.4 10.55 19.1C5.4 14.45 2 11.38 2 7.62 2 4.55 4.42 2.2 7.48 2.2c1.73 0 3.39.8 4.52 2.05A6.04 6.04 0 0 1 16.52 2.2C19.58 2.2 22 4.55 22 7.62c0 3.76-3.4 6.83-8.55 11.48L12 20.4Z" />
        </svg>
        <span>
          trusted by borrowers,
          <br />
          builders &amp; investors
        </span>
      </div>
    </div>
  )
}

export function FairlendLandingHero() {
  return (
    <main className="w-full max-w-full overflow-hidden bg-[var(--landing-hero-paper,#f8f7f5)] text-[#08090a]">
      <section
        aria-labelledby="fairlend-hero-title"
        className="relative isolate min-h-svh w-full max-w-full overflow-hidden rounded-b-[28px] bg-[var(--landing-hero-paper,#f8f7f5)] [font-family:var(--font-inter),Arial,sans-serif]"
        data-fairlend-motion="toronto-hero"
        data-testid="fairlend-toronto-hero"
      >
        <FairlendTorontoHeroParallax />
        <div
          className="fairlend-toronto-hero-canvas relative mx-auto h-[min(100svh,972px)] min-h-[760px] w-full max-w-full overflow-hidden bg-[var(--landing-hero-paper,#f8f7f5)] px-[clamp(24px,4.55vw,60px)] pt-[clamp(28px,4vw,40px)] max-lg:h-svh max-lg:min-h-[860px] max-md:!h-auto max-md:min-h-[calc(100svh+clamp(132px,24svh,184px))] max-md:px-5 max-md:pt-5 max-md:pb-[clamp(40px,7svh,64px)] hero-mobile:flex hero-mobile:flex-col"
          data-toronto-hero-canvas
        >
          <TorontoScene />

          <div
            className="relative z-10 mt-[64px] w-[min(43vw,466px)] max-w-[466px] max-lg:mt-[80px] max-lg:w-[min(62vw,560px)] max-md:mt-[54px] max-md:w-full max-md:max-w-[455px]"
            data-toronto-hero-copy
          >
            <h1
              className="fairlend-toronto-title m-0 font-serif text-[clamp(62px,6.8vw,87px)] leading-[1.07] font-medium tracking-[-0.047em] text-[#030405] max-lg:text-[clamp(58px,8.6vw,82px)] max-md:text-[58px] max-md:leading-[1.03] max-md:tracking-[-0.052em] max-[390px]:text-[51px]"
              id="fairlend-hero-title"
              style={{ '--toronto-delay': '320ms' } as CSSProperties}
            >
              Financing for
              <span className="sr-only">
                {' '}
                multi-plex, single family, land, and private mortgage
              </span>
            </h1>

            <FairlendBuildPropertyTypes
              className="fairlend-toronto-copy mt-[18px] w-full max-w-[466px] shadow-none max-md:mt-4"
              sectionLabel="Multi-plex, single family, land, and private mortgage"
              variant="hero"
            />

            <HeroDesktopActions />
          </div>

          <ProofStats />

          <TrustedBy />
          <FairlendApplicationArrow />

          <div
            className="contents hero-mobile:relative hero-mobile:z-10 hero-mobile:mt-auto hero-mobile:grid hero-mobile:w-full hero-mobile:max-w-[455px] hero-mobile:grid-cols-2 hero-mobile:gap-[10px]"
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
    </main>
  )
}
