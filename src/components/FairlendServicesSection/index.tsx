import Image from 'next/image'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { ArrowRight, Check, Building2, Home, Shield, Users } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import {
  FairlendPaperSection,
  FairlendPaperShell,
  FairlendServiceModelCard,
  FairlendServicesModelHeader,
} from '@/components/FairlendMarketingPrimitives'
import { fairlendRouteSelectorAssets } from '@/components/FairlendRouteSelector/assets'
import { cn } from '@/utilities/ui'

const assetBase = '/assets/service-concepts'

const step = (i: number) => ({ '--i': i }) as CSSProperties
const lineDelay = (ms: number) => ({ '--line-delay': `${ms}ms` }) as CSSProperties

type Service = {
  number: string
  code: string
  kicker: string
  title: string
  image: string
  width: number
  height: number
  icon: ElementType
  bullets: string[]
  footer: string
  motion: 'investment' | 'mortgage' | 'construction' | 'partners'
}

const services: Service[] = [
  {
    number: '01',
    code: 'INVEST',
    kicker: 'Capital Desk',
    title: 'Private Mortgage Investments',
    image: fairlendRouteSelectorAssets.investorSkyline.src,
    width: fairlendRouteSelectorAssets.investorSkyline.width,
    height: fairlendRouteSelectorAssets.investorSkyline.height,
    icon: Shield,
    bullets: [
      'End-to-end digital servicing',
      'Digital deal closing',
      'Review and close deals from your phone',
    ],
    footer: 'Investing with confidence',
    motion: 'investment',
  },
  {
    number: '02',
    code: 'LEND',
    kicker: 'Borrower Desk',
    title: 'Mortgage Financing',
    image: fairlendRouteSelectorAssets.privateMortgageHouse.src,
    width: fairlendRouteSelectorAssets.privateMortgageHouse.width,
    height: fairlendRouteSelectorAssets.privateMortgageHouse.height,
    icon: Home,
    bullets: [
      '1st, 2nd, and 3rd mortgages for borrowers',
      'Loan commitment within 24 hours',
      'Low payout fees where applicable',
      '$50 missed payment fee',
      'Flexible workout plans',
    ],
    footer: 'Fast. Flexible. Reliable.',
    motion: 'mortgage',
  },
  {
    number: '03',
    code: 'BUILD',
    kicker: 'Construction Desk',
    title: 'Construction Financing',
    image: fairlendRouteSelectorAssets.constructionBuilding.src,
    width: fairlendRouteSelectorAssets.constructionBuilding.width,
    height: fairlendRouteSelectorAssets.constructionBuilding.height,
    icon: Building2,
    bullets: [
      'Invest in or finance a construction project',
      'CMHC MLI Select available',
      '8-14% returns',
      'Make your own draw schedule',
      'Complimentary build and finance consultants',
      'Access to a network of contractors, professionals, and suppliers',
    ],
    footer: 'Built for builders',
    motion: 'construction',
  },
  {
    number: '04',
    code: 'ALLY',
    kicker: 'Partner Desk',
    title: 'Partners',
    image: fairlendRouteSelectorAssets.partnerHandshake.src,
    width: fairlendRouteSelectorAssets.partnerHandshake.width,
    height: fairlendRouteSelectorAssets.partnerHandshake.height,
    icon: Users,
    bullets: [
      'For architects, real estate agents, contractors, and other professionals joining our partner program',
      'For brokers looking to co-broker deals',
    ],
    footer: 'Stronger together',
    motion: 'partners',
  },
]

const posterPanelVariants = cva('poster-services-panel relative isolate overflow-hidden', {
  variants: {
    tone: {
      dark: 'bg-[oklch(0.182_0.045_166)] text-white',
      light: 'bg-[rgb(255_253_247)] text-[oklch(0.182_0.045_166)]',
    },
    layout: {
      invest: '',
      mortgage: '',
      construction: '',
      partners: '',
    },
  },
})

type PosterPanelVariantProps = VariantProps<typeof posterPanelVariants>

type PosterPanelProps = {
  service: Service
  imageClassName?: string
  tone: NonNullable<PosterPanelVariantProps['tone']>
  layout: NonNullable<PosterPanelVariantProps['layout']>
  children?: ReactNode
}

function FairlendLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn('grid size-10 place-items-center rounded border border-current/20', className)}
    >
      <svg aria-hidden="true" className="size-6 fill-current" viewBox="0 0 40 40">
        <path d="M10 30V10h5v7h5v-7h5v9h5v11h-5V24h-5v6h-5v-6h-5v6h-5z" />
      </svg>
    </div>
  )
}

function PosterSectionStyles() {
  return (
    <style>{`
      .poster-services-section {
        --poster-cream: rgb(255 253 247);
        --poster-paper: rgb(250 246 238);
        --poster-forest: oklch(0.182 0.045 166);
        --poster-forest-soft: oklch(0.224 0.06 160);
        --poster-orange: oklch(0.645 0.221 35);
        --poster-orange-soft: oklch(0.75 0.17 35);
        --poster-line: rgb(8 45 35 / 10%);
        width: 100%;
        background:
          radial-gradient(circle at 52% 34%, rgb(255 88 52 / 7%), transparent 22rem),
          linear-gradient(180deg, rgb(255 253 247) 0%, rgb(250 244 235) 100%);
      }

      .poster-services-shell {
        display: grid;
        grid-template-columns: minmax(18rem, 28%) minmax(0, 1fr);
        width: 100%;
        min-height: 42rem;
        overflow: hidden;
        border-block: 1px solid var(--poster-line);
        box-shadow: 0 30px 80px rgb(8 45 35 / 8%);
      }

      .poster-services-intro {
        position: relative;
        z-index: 3;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        overflow: hidden;
        background:
          linear-gradient(180deg, rgb(255 253 247 / 94%), rgb(250 246 238 / 96%)),
          radial-gradient(circle at 20% 0%, rgb(255 88 52 / 10%), transparent 16rem);
      }

      .poster-services-kicker {
        color: var(--poster-orange);
        font-size: clamp(0.72rem, 0.8vw, 0.95rem);
        font-weight: 850;
        letter-spacing: 0.3em;
        line-height: 1;
        text-transform: uppercase;
      }

      .poster-services-kicker::after {
        display: block;
        width: 4.8rem;
        height: 0.2rem;
        margin-top: 1.15rem;
        background: var(--poster-orange);
        content: "";
      }

      .poster-services-title {
        margin-top: clamp(1.7rem, 2.3vw, 2.7rem);
        font-family: "League Gothic", Impact, sans-serif;
        font-size: clamp(7rem, 10vw, 11.1rem);
        font-weight: 400;
        letter-spacing: 0.005em;
        line-height: 0.78;
        text-transform: uppercase;
      }

      .poster-services-title span {
        display: block;
        width: min-content;
        transform: scaleX(0.72);
        transform-origin: left center;
      }

      .poster-services-title span:first-child {
        color: var(--poster-forest);
      }

      .poster-services-title span:last-child {
        color: var(--poster-orange);
      }

      .poster-services-body {
        max-width: 15rem;
        color: var(--poster-forest-soft);
        font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
        font-size: clamp(1rem, 1.2vw, 1.25rem);
        font-weight: 500;
        line-height: 1.28;
      }

      .poster-services-body::before {
        display: block;
        width: 4.6rem;
        height: 0.18rem;
        margin-bottom: 2rem;
        background: var(--poster-forest);
        content: "";
      }

      .poster-services-cta-band {
        display: flex;
        align-items: center;
        gap: 1.65rem;
        min-height: 8.8rem;
        background: var(--poster-forest);
        color: white;
        padding: clamp(1.35rem, 2vw, 2.2rem) clamp(1.4rem, 3vw, 3rem);
        clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
      }

      .poster-services-arrow {
        display: grid;
        width: 3.65rem;
        height: 3.65rem;
        flex: 0 0 auto;
        place-items: center;
        border: 2px solid var(--poster-orange);
        border-radius: 999px;
        color: var(--poster-orange);
      }

      .poster-services-grid {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
        grid-template-rows: minmax(20rem, 1fr) minmax(20rem, 0.96fr);
        min-width: 0;
        background: rgb(255 253 247);
      }

      .poster-services-panel {
        min-height: 20rem;
        padding: clamp(1.45rem, 2.15vw, 2.65rem);
      }

      .poster-services-panel::before {
        position: absolute;
        inset: 0;
        z-index: -2;
        background:
          radial-gradient(circle at 22% 20%, rgb(255 255 255 / 12%), transparent 13rem),
          linear-gradient(135deg, rgb(255 255 255 / 4%) 0 1px, transparent 1px 18px);
        content: "";
        opacity: 0.72;
      }

      .poster-services-panel[data-tone="light"]::before {
        background:
          radial-gradient(circle at 72% 10%, rgb(255 88 52 / 9%), transparent 14rem),
          linear-gradient(135deg, rgb(8 45 35 / 4%) 0 1px, transparent 1px 18px);
        opacity: 0.52;
      }

      .poster-services-panel[data-poster-service="invest"] {
        grid-column: 1;
        grid-row: 1;
        margin-left: 0;
        padding-left: clamp(2.2rem, 3.4vw, 4.1rem);
        clip-path: polygon(6% 0, 88% 0, 100% 100%, 0 100%, 0 22%);
      }

      .poster-services-panel[data-poster-service="mortgage"] {
        grid-column: 2;
        grid-row: 1;
      }

      .poster-services-panel[data-poster-service="construction"] {
        grid-column: 1;
        grid-row: 2;
        margin-left: 0;
        padding-left: clamp(1.6rem, 3.2vw, 3.2rem);
        clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 13% 0);
        filter: drop-shadow(-16px -16px 24px rgb(8 45 35 / 14%));
        z-index: 6;
      }

      .poster-services-panel[data-poster-service="partners"] {
        grid-column: 2;
        grid-row: 2;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 100%, 64% 100%, 0 100%);
      }

      .poster-services-content {
        position: relative;
        z-index: 3;
        display: grid;
        align-content: start;
        max-width: 22rem;
      }

      .poster-services-panel[data-poster-service="invest"] .poster-services-content,
      .poster-services-panel[data-poster-service="partners"] .poster-services-content {
        color: white;
      }

      .poster-services-panel[data-poster-service="invest"] .poster-services-content {
        max-width: min(20.5rem, 63%);
      }

      .poster-services-panel[data-poster-service="mortgage"] .poster-services-content {
        margin-left: 0.3rem;
        max-width: min(24rem, 60%);
      }

      .poster-services-panel[data-poster-service="construction"] .poster-services-content {
        margin-left: auto;
        max-width: min(24rem, 53%);
        padding-left: 1.1rem;
      }

      .poster-services-panel[data-poster-service="partners"] .poster-services-content {
        max-width: min(25rem, 57%);
      }

      .poster-services-number {
        position: absolute;
        z-index: 0;
        color: var(--poster-orange);
        font-family: "League Gothic", Impact, sans-serif;
        font-size: clamp(9rem, 14.5vw, 15.5rem);
        font-weight: 400;
        letter-spacing: 0.015em;
        line-height: 0.72;
        opacity: 0.74;
        pointer-events: none;
      }

      .poster-services-panel[data-tone="dark"] .poster-services-number {
        color: rgb(255 255 255 / 17%);
      }

      .poster-services-panel[data-poster-service="invest"] .poster-services-number {
        top: 1rem;
        right: clamp(1.5rem, 4vw, 5rem);
      }

      .poster-services-panel[data-poster-service="mortgage"] .poster-services-number {
        top: 2.3rem;
        right: 2.1rem;
        color: var(--poster-orange-soft);
      }

      .poster-services-panel[data-poster-service="construction"] .poster-services-number {
        top: 1.9rem;
        left: clamp(3.8rem, 7vw, 8.4rem);
      }

      .poster-services-panel[data-poster-service="partners"] .poster-services-number {
        top: 1.2rem;
        right: clamp(2rem, 4.8vw, 5.6rem);
      }

      .poster-services-badge {
        display: grid;
        width: clamp(3.1rem, 4.1vw, 4.7rem);
        height: clamp(3.1rem, 4.1vw, 4.7rem);
        place-items: center;
        border-radius: 999px;
        background:
          radial-gradient(circle at 35% 25%, rgb(255 255 255 / 38%), transparent 28%),
          linear-gradient(180deg, rgb(255 106 72), rgb(255 70 45));
        color: white;
        box-shadow: 0 14px 30px rgb(255 88 52 / 22%);
      }

      .poster-services-heading {
        margin-top: clamp(1.2rem, 1.8vw, 2rem);
        font-family: "League Gothic", Impact, sans-serif;
        font-size: clamp(3rem, 4.2vw, 5rem);
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: 0.01em;
        text-transform: uppercase;
      }

      .poster-services-panel[data-poster-service="invest"] .poster-services-heading {
        font-size: clamp(2.8rem, 3.7vw, 4.4rem);
      }

      .poster-services-panel[data-poster-service="construction"] .poster-services-heading {
        font-size: clamp(2.8rem, 3.6vw, 4.2rem);
      }

      .poster-services-panel[data-poster-service="partners"] .poster-services-heading {
        font-size: clamp(3.1rem, 4vw, 4.8rem);
      }

      .poster-services-list {
        display: grid;
        gap: 0.54rem;
        margin-top: clamp(1rem, 1.55vw, 1.85rem);
        font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
      }

      .poster-services-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.52rem;
        color: currentColor;
        font-size: clamp(0.78rem, 0.8vw, 0.94rem);
        font-weight: 650;
        line-height: 1.3;
      }

      .poster-services-panel[data-tone="dark"] .poster-services-list li {
        color: rgb(255 255 255 / 86%);
      }

      .poster-services-check {
        display: grid;
        width: 1.12rem;
        height: 1.12rem;
        flex: 0 0 auto;
        place-items: center;
        margin-top: 0.08rem;
        border: 1.5px solid var(--poster-orange);
        border-radius: 999px;
        color: var(--poster-orange);
      }

      .poster-services-image {
        position: absolute;
        z-index: 2;
        pointer-events: none;
        filter: drop-shadow(0 28px 38px rgb(8 45 35 / 22%));
      }

      .poster-services-image img {
        object-fit: contain;
      }

      .poster-services-panel[data-poster-service="invest"] .poster-services-image {
        right: -0.4rem;
        bottom: 1.05rem;
        width: min(36%, 18rem);
        height: 47%;
      }

      .poster-services-panel[data-poster-service="mortgage"] .poster-services-image {
        right: 6.3rem;
        bottom: 1.35rem;
        width: min(32%, 19rem);
        height: 42%;
      }

      .poster-services-panel[data-poster-service="construction"] .poster-services-image {
        left: 1.2rem;
        bottom: -0.25rem;
        width: min(39%, 22rem);
        height: 51%;
      }

      .poster-services-panel[data-poster-service="partners"] .poster-services-image {
        right: 4.7rem;
        bottom: 1.25rem;
        width: min(34%, 20rem);
        height: 47%;
      }

      .poster-services-phone {
        position: absolute;
        right: 1.6rem;
        bottom: 2rem;
        z-index: 4;
        width: clamp(3.8rem, 5.1vw, 5.6rem);
        aspect-ratio: 0.58;
        border: 0.34rem solid var(--poster-forest);
        border-radius: 1rem;
        background: rgb(255 255 255 / 96%);
        box-shadow: 0 18px 28px rgb(8 45 35 / 26%);
      }

      .poster-services-phone::before {
        position: absolute;
        top: 0.52rem;
        left: 50%;
        width: 36%;
        height: 0.22rem;
        border-radius: 999px;
        background: rgb(8 45 35 / 18%);
        content: "";
        transform: translateX(-50%);
      }

      .poster-services-phone-check {
        display: grid;
        width: 2.45rem;
        height: 2.45rem;
        place-items: center;
        margin: 2.35rem auto 0.45rem;
        border: 2px solid oklch(0.48 0.1 190);
        border-radius: 999px;
        color: oklch(0.48 0.1 190);
      }

      .poster-services-phone-label {
        color: var(--poster-forest);
        font-size: 0.58rem;
        font-weight: 850;
        text-align: center;
      }

      .poster-services-sign {
        position: absolute;
        right: 2.1rem;
        bottom: 1.45rem;
        z-index: 4;
        display: grid;
        width: clamp(6.1rem, 7.4vw, 8.4rem);
        aspect-ratio: 0.78;
        place-items: center;
        border: 1px solid rgb(255 255 255 / 35%);
        border-radius: 0.55rem;
        background:
          linear-gradient(180deg, rgb(248 241 229 / 92%), rgb(226 213 194 / 94%)),
          radial-gradient(circle at 40% 10%, rgb(255 255 255 / 58%), transparent 50%);
        color: var(--poster-forest);
        box-shadow: 0 20px 36px rgb(8 45 35 / 28%);
      }

      .poster-services-sign span {
        display: block;
        font-size: clamp(0.82rem, 1.1vw, 1.1rem);
        font-weight: 900;
        letter-spacing: 0.02em;
        line-height: 1;
        text-align: center;
        text-transform: uppercase;
      }

      .poster-services-dots {
        position: absolute;
        left: 2.3rem;
        bottom: 4.4rem;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(7, 0.16rem);
        gap: 0.75rem;
        color: var(--poster-orange);
        opacity: 0.55;
      }

      .poster-services-dots span {
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 999px;
        background: currentColor;
      }

      .poster-services-footer-bars {
        position: absolute;
        right: 2.4rem;
        bottom: 1.2rem;
        display: flex;
        gap: 0.62rem;
        color: var(--poster-orange);
      }

      .poster-services-footer-bars span {
        width: 1px;
        height: 2.2rem;
        background: currentColor;
        opacity: 0.76;
      }

      @media (max-width: 1180px) {
        .poster-services-shell {
          grid-template-columns: 1fr;
          min-height: 0;
          overflow: hidden;
        }

        .poster-services-intro {
          grid-template-rows: auto;
        }

        .poster-services-intro-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.45fr);
          align-items: end;
          gap: 2rem;
        }

        .poster-services-title {
          font-size: clamp(7rem, 18vw, 12rem);
        }

        .poster-services-cta-band {
          clip-path: none;
        }

        .poster-services-grid {
          grid-template-rows: minmax(24rem, 1fr) minmax(24rem, 1fr);
        }

        .poster-services-panel[data-poster-service="invest"],
        .poster-services-panel[data-poster-service="construction"] {
          margin-left: 0;
          clip-path: none;
          filter: none;
        }
      }

      @media (min-width: 1024px) {
        .poster-services-section {
          padding-block: 0;
        }

        .poster-services-shell {
          height: min(100svh, 56.25vw);
          min-height: 0;
          max-height: 100svh;
          grid-template-columns: minmax(17.5rem, 28vw) minmax(0, 1fr);
        }

        .poster-services-intro {
          min-height: 0;
          overflow: visible;
          grid-template-rows: minmax(0, 1fr) clamp(7.75rem, 8.4vw, 10rem);
        }

        .poster-services-intro-main {
          min-height: 0;
          padding: clamp(2rem, 2.7vw, 3.4rem) clamp(2.2rem, 4vw, 5rem);
        }

        .poster-services-kicker {
          font-size: clamp(0.68rem, 0.72vw, 0.88rem);
        }

        .poster-services-kicker::after {
          margin-top: clamp(0.8rem, 1vw, 1.1rem);
        }

        .poster-services-title {
          margin-top: clamp(1.2rem, 1.8vw, 2.2rem);
          font-size: clamp(6rem, 10.4vw, 11.2rem);
        }

        .poster-services-body {
          max-width: min(18rem, 82%);
          font-size: clamp(0.92rem, 1.15vw, 1.28rem);
        }

        .poster-services-body::before {
          margin-bottom: clamp(1.35rem, 1.8vw, 2rem);
        }

        .poster-services-cta-band {
          min-height: 0;
          height: 100%;
          position: relative;
          z-index: 5;
          padding: clamp(1rem, 1.7vw, 1.9rem) clamp(1.8rem, 3.2vw, 4rem);
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          box-shadow: 16px -14px 30px rgb(8 45 35 / 13%);
        }

        .poster-services-grid {
          height: 100%;
          min-height: 0;
          grid-template-rows: minmax(0, 1fr) minmax(0, 0.96fr);
          overflow: visible;
        }

        .poster-services-panel {
          min-height: 0;
          padding: clamp(1.15rem, 1.65vw, 2.25rem);
        }

        .poster-services-panel[data-poster-service="construction"] {
          margin-left: clamp(-2.5rem, -2.6vw, -1.25rem);
          padding-left: clamp(2.4rem, 4vw, 4.4rem);
          clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 13% 0);
          filter: drop-shadow(-22px -18px 28px rgb(8 45 35 / 16%));
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-content {
          max-width: min(22rem, 43%);
          padding-left: 0;
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-image {
          left: clamp(2.1rem, 3vw, 3.8rem);
          bottom: clamp(0.6rem, 1vw, 1.2rem);
          width: min(52%, 31rem);
          height: 66%;
        }

        .poster-services-number {
          font-size: clamp(7rem, 13.2vw, 15rem);
        }

        .poster-services-heading {
          font-size: clamp(2.5rem, 4.2vw, 5rem);
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-heading {
          font-size: clamp(2rem, 2.75vw, 3.2rem);
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-number {
          top: clamp(0.4rem, 1vw, 1rem);
          left: clamp(3.3rem, 4.9vw, 5.8rem);
          font-size: clamp(6.2rem, 10vw, 11rem);
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-badge {
          width: clamp(2.6rem, 3.2vw, 3.8rem);
          height: clamp(2.6rem, 3.2vw, 3.8rem);
          margin-left: clamp(7.2rem, 10.5vw, 12rem);
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-list {
          gap: clamp(0.34rem, 0.52vw, 0.62rem);
          margin-top: clamp(0.75rem, 1vw, 1.15rem);
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-list li {
          font-size: clamp(0.64rem, 0.68vw, 0.82rem);
          line-height: 1.28;
        }

        .poster-services-list li {
          font-size: clamp(0.68rem, 0.78vw, 0.94rem);
        }
      }

      @media (max-width: 760px) {
        .poster-services-shell,
        .poster-services-grid,
        .poster-services-intro-main {
          display: block;
        }

        .poster-services-panel {
          min-height: 35rem;
          padding: 2rem 1.35rem;
          clip-path: none !important;
        }

        .poster-services-panel[data-poster-service="invest"],
        .poster-services-panel[data-poster-service="construction"] {
          padding-left: 1.35rem;
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-content {
          margin-left: 0;
        }

        .poster-services-image {
          opacity: 0.98;
        }

        .poster-services-panel[data-poster-service="invest"] .poster-services-image,
        .poster-services-panel[data-poster-service="mortgage"] .poster-services-image,
        .poster-services-panel[data-poster-service="construction"] .poster-services-image,
        .poster-services-panel[data-poster-service="partners"] .poster-services-image {
          right: 0.5rem;
          bottom: 1rem;
          left: auto;
          width: min(72%, 22rem);
          height: 42%;
        }

        .poster-services-panel[data-poster-service="construction"] .poster-services-image {
          left: -0.3rem;
          right: auto;
          width: min(82%, 24rem);
        }

        .poster-services-number {
          font-size: clamp(6.5rem, 31vw, 10rem);
        }

        .poster-services-phone,
        .poster-services-sign {
          right: 1rem;
          bottom: 1rem;
        }

        .poster-services-title {
          font-size: clamp(4.8rem, 24vw, 7rem);
        }

        .poster-services-body {
          margin-top: 2rem;
        }
      }
    `}</style>
  )
}

function PosterIconBadge({ icon: Icon }: { icon: ElementType }) {
  return (
    <span className="poster-services-badge" aria-hidden="true">
      <Icon className="size-[54%]" strokeWidth={1.7} />
    </span>
  )
}

function PosterCheckIcon() {
  return (
    <span className="poster-services-check" aria-hidden="true">
      <Check className="size-3" strokeWidth={2.5} />
    </span>
  )
}

function PosterServicePanel({ service, tone, layout, imageClassName, children }: PosterPanelProps) {
  const Icon = service.icon

  return (
    <article
      className={posterPanelVariants({ tone, layout })}
      data-poster-service={layout}
      data-tone={tone}
    >
      <span className="poster-services-number" aria-hidden="true">
        {service.number}
      </span>
      <div className="poster-services-content">
        <PosterIconBadge icon={Icon} />
        <h3 className="poster-services-heading">{service.title}</h3>
        <ul className="poster-services-list">
          {service.bullets.map((bullet) => (
            <li key={bullet}>
              <PosterCheckIcon />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn('poster-services-image', imageClassName)} aria-hidden="true">
        <Image
          alt=""
          className="object-contain"
          decoding="async"
          fill
          loading="lazy"
          sizes="(max-width: 760px) 72vw, (max-width: 1180px) 38vw, 28vw"
          src={service.image}
        />
      </div>
      {children}
    </article>
  )
}

function getServicesModelBullets(service: Service) {
  if (service.motion === 'construction') {
    return [
      'Invest in or finance a construction project',
      '8-14% returns',
      'Make your own draw schedule',
      'Contractor, professional, and supplier access',
    ]
  }

  if (service.motion === 'mortgage') {
    return service.bullets.filter((bullet) => bullet !== '$50 missed payment fee')
  }

  if (service.motion === 'partners') {
    return ['Professionals joining our partner program', 'Brokers looking to co-broker deals']
  }

  return service.bullets
}

export function FairlendServicesSection() {
  return (
    <FairlendPaperSection
      id="fairlend-services"
      aria-labelledby="fairlend-services-title"
      className={cn(
        'services-model-section relative isolate overflow-hidden text-[oklch(0.182_0.045_166)]',
        '[font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif]',
        'scroll-mt-[96px]',
      )}
      data-fairlend-motion="services"
      data-testid="services-section"
    >
      <style>{`
        .services-model-section {
          --services-paper: rgb(255 253 247);
          --services-paper-soft: rgb(250 244 235);
          --services-forest: oklch(0.182 0.045 166);
          --services-forest-soft: oklch(0.295 0.038 166);
          --services-line: rgb(8 45 35 / 34%);
          --services-line-soft: rgb(8 45 35 / 22%);
          --services-orange: oklch(0.645 0.221 35);
          --about-ink: var(--services-forest);
          --about-orange: var(--services-orange);
          --about-display: "League Gothic", Impact, "Arial Narrow", sans-serif;
          --about-mono: "Oxanium", "Arial Narrow", system-ui, sans-serif;
          min-height: 100dvh;
          background:
            radial-gradient(circle at 78% 6%, rgb(255 255 249 / 90%), transparent 30rem),
            radial-gradient(circle at 24% 18%, rgb(255 255 251 / 68%), transparent 24rem),
            linear-gradient(180deg, var(--services-paper) 0%, var(--services-paper-soft) 100%);
        }
        .services-model-section::before {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            url('/assets/heatherpapertexture.png'),
            url('/assets/diagonal_paperTexture.png');
          background-size: 560px 560px, 360px 360px;
          background-position: center, 0 0;
          background-repeat: repeat;
          mix-blend-mode: multiply;
          opacity: 0.24;
          content: "";
        }
        .services-model-section::after {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgb(8 45 35 / 4%) 0 1px, transparent 1px 19px),
            radial-gradient(circle at 83% 18%, rgb(255 92 52 / 6%), transparent 26rem);
          mix-blend-mode: multiply;
          opacity: 0.44;
          content: "";
        }
        .services-model-shell {
          position: relative;
          z-index: 1;
          width: min(100%, 1780px);
          min-height: 100dvh;
          margin-inline: auto;
          padding: clamp(1.25rem, 2.4vw, 2.75rem);
        }
        .services-model-shell::before,
        .services-model-shell::after,
        .services-model-grid::before,
        .services-model-grid::after {
          position: absolute;
          z-index: 5;
          width: 2rem;
          height: 2rem;
          pointer-events: none;
          background:
            linear-gradient(var(--services-line), var(--services-line)) left 50% / 100% 1px no-repeat,
            linear-gradient(var(--services-line), var(--services-line)) 50% top / 1px 100% no-repeat;
          content: "";
          opacity: 0.75;
        }
        .services-model-shell::before {
          top: clamp(1rem, 2vw, 2rem);
          right: clamp(1rem, 2vw, 2rem);
        }
        .services-model-shell::after {
          right: clamp(1rem, 2vw, 2rem);
          bottom: clamp(1rem, 2vw, 2rem);
        }
        .services-model-header {
          position: relative;
          display: grid;
          min-height: clamp(18rem, 30vh, 23rem);
          grid-template-columns: minmax(0, 0.92fr) minmax(22rem, 0.72fr);
          align-items: stretch;
          gap: clamp(2rem, 6vw, 7rem);
          padding: clamp(1.5rem, 3vw, 3rem) clamp(0.75rem, 1vw, 1.25rem) clamp(2rem, 3.4vw, 3.75rem);
        }
        .services-model-header-content {
          position: relative;
          z-index: 2;
          display: grid;
          min-height: 100%;
          grid-template-rows: auto auto minmax(0, 1fr);
          align-content: stretch;
        }
        .services-model-brand {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.75rem;
          color: color-mix(in oklch, var(--services-forest) 74%, transparent);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .services-model-brand::before {
          width: 2.3rem;
          height: 1px;
          background: var(--services-orange);
          content: "";
        }
        .services-model-brand__count {
          color: var(--services-orange);
        }
        .services-model-kicker {
          align-items: flex-end;
          gap: clamp(1rem, 2vw, 2.65rem);
          margin-top: clamp(0.8rem, 1.6vw, 1.35rem);
        }
        .services-model-kicker > span.about-text-textured:first-child {
          font-size: clamp(5.55rem, min(9.8vw, 15.8vh), 11.9rem);
          line-height: 0.78;
        }
        .services-model-kicker .about-kicker-slash {
          font-size: clamp(5.55rem, min(9.8vw, 15.8vh), 11.9rem);
          line-height: 0.78;
          transform: translateY(0);
        }
        .services-model-kicker p {
          padding-bottom: 0.1em;
          font-size: clamp(2.05rem, min(3.95vw, 6.9vh), 4.65rem);
          line-height: 0.88;
          letter-spacing: 0.03em;
        }
        .services-model-copy {
          position: relative;
          align-self: end;
          max-width: 42rem;
          margin-top: clamp(1.1rem, 1.8vw, 1.7rem);
          padding-top: 1.25rem;
          color: var(--services-forest);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: clamp(1rem, 1.45vw, 1.32rem);
          font-weight: 560;
          line-height: 1.42;
          letter-spacing: -0.02em;
        }
        .services-model-copy::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 4.25rem;
          height: 0.2rem;
          background: var(--services-orange);
          content: "";
        }
        .services-model-skyline {
          position: absolute;
          right: clamp(1rem, 2vw, 2rem);
          bottom: -0.35rem;
          width: min(58vw, 58rem);
          height: min(22vw, 19rem);
          opacity: 0.26;
          filter: grayscale(1) sepia(0.18) blur(0.15px);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 9%, black 38%, black 100%);
          mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 9%, black 38%, black 100%);
        }
        .services-header-ledger__tabs {
          position: absolute;
          top: clamp(1.5rem, 2.6vw, 2.8rem);
          right: clamp(3rem, 4.2vw, 4.8rem);
          display: flex;
          gap: 0.8rem;
          z-index: 3;
        }
        .services-header-ledger__tab {
          width: clamp(2.6rem, 4vw, 4.5rem);
          height: 0.66rem;
          border: 1px solid rgb(8 45 35 / 40%);
          background: color-mix(in oklch, oklch(0.66 0.095 58) 42%, var(--services-paper));
        }
        .services-model-main-rule {
          background: var(--services-line);
          height: 2px;
        }
        .services-model-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 2px solid rgb(8 45 35 / 0%);
          background: rgb(255 253 247 / 22%);
          --services-grid-corner-alpha: 0;
        }
        .services-model-grid-edge {
          position: absolute;
          z-index: 4;
          pointer-events: none;
          background: var(--services-line);
          opacity: 0.75;
          will-change: transform;
        }
        .services-model-grid-edge--top,
        .services-model-grid-edge--bottom {
          left: -2px;
          right: -2px;
          height: 2px;
        }
        .services-model-grid-edge--top {
          top: -2px;
          transform-origin: left center;
        }
        .services-model-grid-edge--bottom {
          bottom: -2px;
          transform-origin: right center;
        }
        .services-model-grid-edge--left,
        .services-model-grid-edge--right {
          top: -2px;
          bottom: -2px;
          width: 2px;
        }
        .services-model-grid-edge--left {
          left: -2px;
          transform-origin: center top;
        }
        .services-model-grid-edge--right {
          right: -2px;
          transform-origin: center bottom;
        }
        .services-model-grid::before {
          top: -0.42rem;
          left: -0.42rem;
          opacity: var(--services-grid-corner-alpha);
        }
        .services-model-grid::after {
          right: -0.42rem;
          bottom: -0.42rem;
          opacity: var(--services-grid-corner-alpha);
        }
        @media (prefers-reduced-motion: reduce) {
          .services-model-grid {
            --services-grid-corner-alpha: 0.75;
          }
          .services-model-grid-edge {
            transform: none !important;
          }
        }
        .services-model-panel {
          position: relative;
          isolation: isolate;
          display: grid;
          min-height: clamp(21rem, 25vw, 30rem);
          grid-template-columns: minmax(0, 0.96fr) minmax(13rem, 0.78fr);
          align-items: center;
          gap: clamp(1rem, 2.2vw, 2.6rem);
          overflow: hidden;
          padding: clamp(1.45rem, 2.4vw, 2.8rem);
          background:
            radial-gradient(circle at 76% 22%, var(--services-card-glow, transparent), transparent 37%),
            linear-gradient(180deg, rgb(255 253 247 / 58%), rgb(250 244 235 / 32%));
          transition:
            background-color 260ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 360ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .services-model-panel::before {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(135deg, rgb(8 45 35 / 4%) 0 1px, transparent 1px 18px),
            radial-gradient(circle at 14% 18%, rgb(255 253 247 / 54%), transparent 31%);
          content: "";
          opacity: 0.5;
        }
        .services-model-panel:hover {
          background-color: rgb(255 253 247 / 64%);
          box-shadow: inset 0 0 0 1px rgb(8 45 35 / 8%);
          transform: translateY(-2px);
        }
        [data-services-card-motion="investment"] {
          --services-card-glow: oklch(0.841 0.238 128.85 / 14%);
          --services-card-stamp-bg: oklch(0.841 0.238 128.85 / 14%);
          --services-card-stamp-ink: oklch(0.405 0.101 131.063);
          --services-card-icon-border: oklch(0.405 0.101 131.063 / 38%);
        }
        [data-services-card-motion="mortgage"] {
          --services-card-glow: oklch(0.58 0.118 250 / 14%);
          --services-card-stamp-bg: oklch(0.58 0.118 250 / 15%);
          --services-card-stamp-ink: oklch(0.36 0.09 245);
          --services-card-icon-border: oklch(0.36 0.09 245 / 38%);
        }
        [data-services-card-motion="construction"] {
          --services-card-glow: oklch(0.66 0.095 58 / 22%);
          --services-card-stamp-bg: oklch(0.66 0.095 58 / 19%);
          --services-card-stamp-ink: oklch(0.37 0.075 62);
          --services-card-icon-border: oklch(0.37 0.075 62 / 38%);
        }
        [data-services-card-motion="partners"] {
          --services-card-glow: oklch(0.35 0.09 145 / 14%);
          --services-card-stamp-bg: oklch(0.35 0.09 145 / 13%);
          --services-card-stamp-ink: oklch(0.224 0.06 160);
          --services-card-icon-border: oklch(0.224 0.06 160 / 34%);
        }
        .services-model-panel-copy {
          position: relative;
          z-index: 2;
          max-width: 34rem;
        }
        .services-card-topline {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: clamp(1rem, 1.8vw, 1.45rem);
        }
        .services-card-icon-box {
          display: grid;
          width: clamp(3.35rem, 4.4vw, 4.4rem);
          height: clamp(3.35rem, 4.4vw, 4.4rem);
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid var(--services-card-icon-border);
          border-radius: 0.55rem;
          background:
            linear-gradient(180deg, rgb(255 253 247 / 70%), rgb(250 244 235 / 54%)),
            var(--services-card-stamp-bg);
          color: var(--services-card-stamp-ink);
          box-shadow: inset 0 -1px 0 rgb(8 45 35 / 9%);
        }
        .services-card-stamp {
          display: inline-flex;
          color: var(--services-card-stamp-ink);
          font-size: clamp(0.68rem, 0.82vw, 0.82rem);
          font-weight: 850;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }
        .services-model-stamp-line {
          display: block;
          width: clamp(5rem, 8vw, 8.25rem);
          height: 1px;
          margin-top: 0.55rem;
          background: var(--services-card-stamp-ink);
          opacity: 0.48;
        }
        .services-card-title {
          max-width: 13ch;
          margin: 0 0 clamp(1.15rem, 1.7vw, 1.6rem);
          color: var(--services-forest);
          font-size: clamp(1.9rem, 3.1vw, 3.65rem);
          font-weight: 900;
          line-height: 0.94;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }
        .services-card-bullets {
          display: grid;
          gap: 0.78rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .services-card-bullet {
          align-items: flex-start;
          gap: 0.8rem;
          color: color-mix(in oklch, var(--services-forest) 88%, black);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: clamp(0.88rem, 1vw, 1rem);
          font-weight: 620;
          line-height: 1.42;
          letter-spacing: -0.015em;
        }
        .services-card-bullet svg {
          margin-top: 0.1rem;
          width: 1rem;
          height: 1rem;
          color: var(--services-card-stamp-ink);
        }
        .services-card-media-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: clamp(12rem, 17vw, 21rem);
          align-self: center;
          overflow: visible;
        }
        .services-card-media-shell [data-services-media] {
          object-fit: contain;
          object-position: center bottom;
          filter: drop-shadow(0 18px 26px rgb(8 45 35 / 12%));
        }
        [data-services-card-motion="investment"] .services-card-media-shell {
          transform: translateX(-0.15rem) scale(1.1);
        }
        [data-services-card-motion="mortgage"] .services-card-media-shell {
          transform: translateX(-0.2rem) scale(1.12);
        }
        [data-services-card-motion="construction"] .services-card-media-shell {
          transform: translateX(-0.35rem) scale(1.12);
        }
        [data-services-card-motion="partners"] .services-card-media-shell {
          transform: translateX(-0.1rem) scale(1.16);
        }
        .services-card-corner {
          position: absolute;
          z-index: 4;
          width: 1.75rem;
          height: 1.75rem;
          pointer-events: none;
        }
        .services-card-corner::before,
        .services-card-corner::after {
          position: absolute;
          background: rgb(8 45 35 / 42%);
          content: "";
        }
        .services-card-corner::before {
          width: 100%;
          height: 1px;
          transform: scaleX(var(--services-corner-x, 1));
        }
        .services-card-corner::after {
          width: 1px;
          height: 100%;
          transform: scaleY(var(--services-corner-y, 1));
        }
        .services-card-corner--tl {
          top: 0.8rem;
          left: 0.8rem;
        }
        .services-card-corner--tr {
          top: 0.8rem;
          right: 0.8rem;
        }
        .services-card-corner--br {
          right: 0.8rem;
          bottom: 0.8rem;
        }
        .services-card-corner--bl {
          bottom: 0.8rem;
          left: 0.8rem;
        }
        .services-card-corner--tl::before,
        .services-card-corner--tl::after {
          top: 0;
          left: 0;
          transform-origin: 0 0;
        }
        .services-card-corner--tr::before,
        .services-card-corner--tr::after {
          top: 0;
          right: 0;
          transform-origin: 100% 0;
        }
        .services-card-corner--br::before,
        .services-card-corner--br::after {
          right: 0;
          bottom: 0;
          transform-origin: 100% 100%;
        }
        .services-card-corner--bl::before,
        .services-card-corner--bl::after {
          bottom: 0;
          left: 0;
          transform-origin: 0 100%;
        }
        .services-card-number-plate {
          position: absolute;
          top: clamp(1.25rem, 1.8vw, 1.9rem);
          right: clamp(1.2rem, 1.8vw, 1.9rem);
          z-index: 2;
          display: grid;
          justify-items: end;
          gap: 0.18rem;
          color: rgb(8 45 35 / 24%);
          line-height: 1;
          text-align: right;
          pointer-events: none;
        }
        .services-card-number-plate [data-services-number] {
          font-size: clamp(1.5rem, 2.2vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.05em;
        }
        .services-card-code {
          color: rgb(8 45 35 / 38%);
          font-size: 0.56rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .services-model-panel-rule--desktop-y {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          display: block;
          width: 2px;
          height: 100%;
          background: var(--services-line);
        }
        .services-model-panel-rule--desktop-x {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          display: block;
          width: 100%;
          height: 2px;
          background: var(--services-line);
        }
        .services-model-panel-rule--mobile {
          display: none;
        }
        .services-model-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-right: 2px solid var(--services-line-soft);
          border-bottom: 2px solid var(--services-line-soft);
          border-left: 2px solid var(--services-line-soft);
          padding: 0.82rem clamp(1rem, 2vw, 1.8rem);
          color: rgb(8 45 35 / 48%);
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .services-model-footer strong {
          color: var(--services-forest);
        }
        @media (min-width: 1024px) {
          .services-model-section {
            height: 100dvh;
            min-height: 0;
          }
          .services-model-shell {
            display: grid;
            height: 100dvh;
            min-height: 0;
            grid-template-rows: minmax(11.75rem, 26dvh) 2px minmax(0, 1fr) auto;
            overflow: hidden;
            padding: clamp(0.9rem, 2vh, 1.45rem) clamp(1rem, 2vw, 2rem);
          }
          .services-model-header {
            min-height: 0;
            align-items: start;
            padding: clamp(0.75rem, 1.5vh, 1.1rem) clamp(0.5rem, 0.9vw, 1rem) clamp(1.45rem, 2.8vh, 2.25rem);
          }
          .services-model-header-content {
            min-height: 100%;
          }
          .services-model-kicker {
            gap: clamp(0.85rem, 1.6vw, 2.1rem);
            margin-top: clamp(0.42rem, 0.9vh, 0.8rem);
          }
          .services-model-kicker > span.about-text-textured:first-child {
            font-size: clamp(4.3rem, min(8.05vw, 14.2vh), 10.3rem);
          }
          .services-model-kicker .about-kicker-slash {
            font-size: clamp(4.3rem, min(8.05vw, 14.2vh), 10.3rem);
          }
          .services-model-kicker p {
            font-size: clamp(1.72rem, min(3.25vw, 5.9vh), 3.9rem);
          }
          .services-model-brand {
            font-size: clamp(0.56rem, 0.82vw, 0.66rem);
          }
          .services-model-copy {
            max-width: 38rem;
            margin-top: clamp(0.65rem, 1.2vh, 1rem);
            padding-top: clamp(0.65rem, 1.1vh, 0.9rem);
            font-size: clamp(0.88rem, min(1.16vw, 1.8vh), 1.12rem);
            line-height: 1.34;
          }
          .services-model-copy::before {
            width: 3.6rem;
            height: 0.16rem;
          }
          .services-model-skyline {
            width: min(54vw, 52rem);
            height: min(17vw, 17vh);
          }
          .services-header-ledger__tabs {
            top: clamp(0.75rem, 1.45vh, 1.25rem);
            right: clamp(2rem, 3.2vw, 4rem);
            gap: 0.56rem;
          }
          .services-header-ledger__tab {
            width: clamp(2rem, 3.4vw, 3.8rem);
            height: 0.46rem;
          }
          .services-model-grid {
            min-height: 0;
            grid-template-rows: repeat(2, minmax(0, 1fr));
          }
          .services-model-panel {
            min-height: 0;
            grid-template-columns: minmax(0, 1fr) minmax(8.5rem, 0.68fr);
            gap: clamp(0.75rem, min(1.5vw, 2vh), 1.7rem);
            padding: clamp(1rem, min(1.65vw, 2.1vh), 1.9rem);
          }
          .services-card-topline {
            gap: clamp(0.65rem, 1vw, 0.9rem);
            margin-bottom: clamp(0.62rem, 1.15vh, 1rem);
          }
          .services-card-icon-box {
            width: clamp(2.55rem, min(3.6vw, 6vh), 3.6rem);
            height: clamp(2.55rem, min(3.6vw, 6vh), 3.6rem);
            border-radius: 0.45rem;
          }
          .services-card-stamp {
            font-size: clamp(0.56rem, min(0.72vw, 1.15vh), 0.74rem);
          }
          .services-model-stamp-line {
            width: clamp(4.1rem, 6vw, 6.9rem);
            margin-top: 0.42rem;
          }
          .services-card-title {
            max-width: 13ch;
            margin-bottom: clamp(0.55rem, 0.9vh, 0.85rem);
            font-size: clamp(1.62rem, min(2.65vw, 4.8vh), 3.2rem);
            line-height: 0.96;
          }
          .services-card-bullets {
            gap: clamp(0.38rem, 0.85vh, 0.65rem);
          }
          .services-card-bullet {
            gap: 0.58rem;
            font-size: clamp(0.72rem, min(0.9vw, 1.55vh), 0.9rem);
            line-height: 1.32;
          }
          .services-card-bullet svg {
            width: 0.88rem;
            height: 0.88rem;
          }
          .services-card-media-shell {
            height: clamp(8.5rem, 22vh, 16.5rem);
            min-height: 0;
          }
          .services-card-corner {
            width: 1.2rem;
            height: 1.2rem;
          }
          .services-card-corner--tl {
            top: 0.55rem;
            left: 0.55rem;
          }
          .services-card-corner--tr {
            top: 0.55rem;
            right: 0.55rem;
          }
          .services-card-corner--br {
            right: 0.55rem;
            bottom: 0.55rem;
          }
          .services-card-corner--bl {
            bottom: 0.55rem;
            left: 0.55rem;
          }
          .services-card-number-plate {
            top: clamp(0.8rem, 1.35vh, 1.15rem);
            right: clamp(0.8rem, 1.35vh, 1.15rem);
          }
          .services-card-number-plate [data-services-number] {
            font-size: clamp(1rem, min(1.8vw, 3vh), 1.8rem);
          }
          .services-card-code {
            font-size: 0.48rem;
          }
          .services-model-footer {
            min-height: 1.65rem;
            padding: clamp(0.35rem, 0.65vh, 0.55rem) clamp(0.75rem, 1.2vw, 1.1rem);
            font-size: clamp(0.5rem, 0.62vw, 0.58rem);
          }
        }
        @media (min-width: 1024px) and (max-height: 760px) {
          .services-model-shell {
            grid-template-rows: auto 2px minmax(0, 1fr) auto;
            padding-block: 0.45rem;
          }
          .services-model-brand {
            display: none;
          }
          .services-model-kicker {
            margin-top: 0;
          }
          .services-model-kicker > span.about-text-textured:first-child {
            font-size: clamp(3.75rem, min(7.15vw, 12vh), 7.8rem);
          }
          .services-model-kicker .about-kicker-slash {
            font-size: clamp(3.75rem, min(7.15vw, 12vh), 7.8rem);
          }
          .services-model-kicker p {
            font-size: clamp(1.48rem, min(2.75vw, 4.8vh), 3rem);
          }
          .services-model-copy {
            max-width: 34rem;
          }
          .services-card-media-shell {
            height: clamp(7.5rem, 19vh, 12.5rem);
          }
        }
        @media (max-width: 1023px) {
          .services-model-header {
            grid-template-columns: 1fr;
            min-height: auto;
            padding-bottom: clamp(7rem, 14vw, 11rem);
          }
          .services-model-header-content {
            min-height: 0;
            display: block;
          }
          .services-model-copy {
            align-self: auto;
          }
          .services-model-skyline {
            width: min(90vw, 54rem);
            height: min(34vw, 17rem);
          }
          .services-header-ledger__tabs {
            top: auto;
            right: auto;
            bottom: clamp(2rem, 4vw, 3rem);
            left: clamp(0.75rem, 1vw, 1.25rem);
          }
          .services-model-panel {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          .services-card-media-shell {
            min-height: clamp(13rem, 38vw, 23rem);
            order: -1;
          }
        }
        @media (max-width: 860px) {
          .services-model-shell {
            padding: 0.75rem;
          }
          .services-model-header {
            padding: 0.85rem 0.5rem clamp(7rem, 32vw, 10rem);
          }
          .services-model-kicker {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: start;
            gap: 0.85rem 1.15rem;
          }
          .services-model-kicker p {
            grid-column: 1 / -1;
          }
          .services-model-copy {
            max-width: 29rem;
            font-size: 1rem;
          }
          .services-model-grid {
            grid-template-columns: 1fr;
          }
          .services-model-panel {
            padding: 1.45rem;
          }
          .services-model-panel-rule--desktop-y,
          .services-model-panel-rule--desktop-x {
            display: none;
          }
          .services-model-panel-rule--mobile {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            display: block;
            width: 100%;
            height: 2px;
            background: var(--services-line);
          }
          .services-card-number-plate {
            top: 1rem;
            right: 1rem;
          }
          .services-model-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <FairlendPaperShell className="services-model-shell">
        <FairlendServicesModelHeader stepStyle={step(0)} />

        <span
          className="services-line-x services-model-main-rule relative z-10 block h-px w-full"
          data-services-line-x
          style={lineDelay(280)}
        />

        <div className="services-model-grid relative z-10" data-services-grid>
          <span
            aria-hidden="true"
            className="services-model-grid-edge services-model-grid-edge--top"
            data-services-grid-edge="top"
          />
          <span
            aria-hidden="true"
            className="services-model-grid-edge services-model-grid-edge--right"
            data-services-grid-edge="right"
          />
          <span
            aria-hidden="true"
            className="services-model-grid-edge services-model-grid-edge--bottom"
            data-services-grid-edge="bottom"
          />
          <span
            aria-hidden="true"
            className="services-model-grid-edge services-model-grid-edge--left"
            data-services-grid-edge="left"
          />
          {services.map((service, index) => {
            const colDelay = 420 + index * 100
            const bulletBase = 9 + index * 6
            const bullets = getServicesModelBullets(service)

            return (
              <FairlendServiceModelCard
                bulletBase={bulletBase}
                bullets={bullets}
                colDelay={colDelay}
                index={index}
                key={service.number}
                lineDelayStyle={lineDelay}
                service={service}
                stepStyle={step(5 + index)}
              />
            )
          })}
        </div>

        <div
          className="services-model-footer services-reveal"
          data-services-bottom
          style={step(40)}
        >
          <strong>The FairLend Model</strong>
          <span>Capital desk / borrower desk / construction desk / partner desk</span>
        </div>
      </FairlendPaperShell>
    </FairlendPaperSection>
  )
}

export function FairlendServicesSectionLegacy() {
  return (
    <section
      id="fairlend-services"
      aria-labelledby="fairlend-services-title"
      className={cn(
        'relative isolate overflow-hidden bg-[rgb(255_253_247)] text-[oklch(0.141_0.005_285.823)]',
        '[font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif]',
        'scroll-mt-[96px]',
      )}
      data-fairlend-motion="services"
      data-testid="services-section"
    >
      {/* Header */}
      <div className="relative z-10 grid lg:grid-cols-[minmax(220px,18%)_1fr]">
        {/* Dark green brand panel */}
        <div
          className="services-reveal flex flex-row items-center justify-between gap-6 bg-[oklch(0.182_0.045_166)] p-6 text-white lg:flex-col lg:items-start lg:justify-between lg:p-8 xl:p-10"
          data-services-brand
          style={step(0)}
        >
          <div className="flex items-center gap-3" data-services-logo>
            <FairlendLogoMark />
            <div className="text-[10px] font-semibold leading-tight tracking-[0.18em] uppercase">
              <div>FairLend</div>
              <div>Mortgage</div>
            </div>
          </div>
          <div
            className="text-[10px] font-bold tracking-[0.18em] uppercase text-[oklch(0.645_0.221_35)]"
            data-services-established
          >
            Est. 2015
          </div>
        </div>

        {/* Header right */}
        <div className="services-header-ledger" data-services-report>
          <style>{`
            .services-header-ledger {
              position: relative;
              z-index: 10;
              display: grid;
              grid-template-columns: minmax(0, 1fr) auto;
              gap: clamp(1.25rem, 3vw, 2.5rem);
              align-items: start;
              padding: clamp(1.5rem, 3vw, 2.5rem);
              overflow: hidden;
              background: transparent;
            }
            .services-header-ledger::after {
              position: absolute;
              inset: 0;
              z-index: 1;
              pointer-events: none;
              background: linear-gradient(90deg, transparent 0, transparent calc(100% - 15rem), color-mix(in oklch, oklch(0.66 0.095 58) 14%, transparent) 100%);
              content: "";
            }
            .services-header-ledger > :not(style):not([data-services-map]) {
              position: relative;
              z-index: 2;
            }
            .services-header-ledger [data-services-map] {
              z-index: 0;
              filter: blur(0.35px);
              -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, rgb(0 0 0 / 8%) 43%, rgb(0 0 0 / 48%) 58%, black 76%, black 100%);
              mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, rgb(0 0 0 / 8%) 43%, rgb(0 0 0 / 48%) 58%, black 76%, black 100%);
            }
            [data-services-card] {
              position: relative;
              isolation: isolate;
              background:
                linear-gradient(180deg, rgb(255 253 247 / 92%) 0%, rgb(250 244 235 / 86%) 100%),
                radial-gradient(circle at 80% 8%, var(--services-card-glow, transparent), transparent 42%);
              transition:
                background-color 240ms cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 360ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            [data-services-card]::before {
              position: absolute;
              inset: 0;
              z-index: -1;
              background:
                linear-gradient(135deg, rgb(8 45 35 / 7%) 0 1px, transparent 1px 18px),
                radial-gradient(circle at 14% 18%, rgb(255 253 247 / 70%), transparent 30%);
              content: "";
              opacity: 0.5;
            }
            [data-services-card]:hover {
              background-color: rgb(255 253 247);
              box-shadow: inset 0 0 0 1px rgb(8 45 35 / 14%), 0 30px 68px rgb(8 45 35 / 9%);
              transform: translateY(-3px);
            }
            [data-services-card-motion="investment"] {
              --services-card-glow: oklch(0.841 0.238 128.85 / 18%);
              --services-card-stamp-bg: oklch(0.841 0.238 128.85 / 16%);
              --services-card-stamp-ink: oklch(0.405 0.101 131.063);
              --services-card-plate: oklch(0.841 0.238 128.85 / 11%);
              --services-card-plate-ink: oklch(0.224 0.06 160);
              --services-card-number-ink: oklch(0.645 0.221 35);
            }
            [data-services-card-motion="mortgage"] {
              --services-card-glow: oklch(0.58 0.118 250 / 16%);
              --services-card-stamp-bg: oklch(0.58 0.118 250 / 18%);
              --services-card-stamp-ink: oklch(0.36 0.09 245);
              --services-card-plate: oklch(0.58 0.118 250 / 10%);
              --services-card-plate-ink: oklch(0.224 0.06 160);
              --services-card-number-ink: oklch(0.58 0.118 250);
            }
            [data-services-card-motion="construction"] {
              --services-card-glow: oklch(0.66 0.095 58 / 24%);
              --services-card-stamp-bg: oklch(0.66 0.095 58 / 26%);
              --services-card-stamp-ink: oklch(0.37 0.075 62);
              --services-card-plate: oklch(0.66 0.095 58 / 12%);
              --services-card-plate-ink: oklch(0.224 0.06 160);
              --services-card-number-ink: oklch(0.645 0.221 35);
            }
            [data-services-card-motion="partners"] {
              --services-card-glow: oklch(0.35 0.09 145 / 17%);
              --services-card-stamp-bg: oklch(0.35 0.09 145 / 18%);
              --services-card-stamp-ink: oklch(0.224 0.06 160);
              --services-card-plate: oklch(0.35 0.09 145 / 9%);
              --services-card-plate-ink: oklch(0.224 0.06 160);
              --services-card-number-ink: oklch(0.35 0.09 145);
            }
            .services-card-topline {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 0.75rem;
              margin-bottom: 0.9rem;
            }
            .services-card-number-plate {
              display: grid;
              min-width: clamp(72px, 7vw, 98px);
              gap: 0.28rem;
              border: 1px solid rgb(8 45 35 / 14%);
              background: var(--services-card-plate);
              padding: 0.5rem 0.62rem 0.48rem;
              color: var(--services-card-plate-ink);
              box-shadow: inset 0 -1px 0 rgb(8 45 35 / 10%);
            }
            .services-card-number-plate [data-services-number] {
              font-size: clamp(34px, 4vw, 50px);
              font-weight: 850;
              line-height: 0.82;
              letter-spacing: 0;
              color: var(--services-card-number-ink);
            }
            .services-card-code {
              font-size: 0.58rem;
              font-weight: 850;
              letter-spacing: 0.14em;
              line-height: 1;
              text-transform: uppercase;
              opacity: 0.7;
            }
            .services-card-stamp {
              display: inline-flex;
              align-items: center;
              min-height: 1.65rem;
              border: 1px solid rgb(8 45 35 / 11%);
              background: var(--services-card-stamp-bg);
              padding: 0 0.62rem;
              color: var(--services-card-stamp-ink);
              font-size: 0.58rem;
              font-weight: 850;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              transform: rotate(-0.7deg);
            }
            .services-card-icon-box {
              display: grid;
              width: 2.25rem;
              height: 2.25rem;
              place-items: center;
              border: 1px solid rgb(8 45 35 / 14%);
              background: rgb(255 253 247 / 64%);
              box-shadow: inset 0 -1px 0 rgb(8 45 35 / 8%);
            }
            .services-card-media-shell {
              position: relative;
              margin-bottom: 1rem;
              aspect-ratio: 16 / 9;
              width: 100%;
              overflow: hidden;
              border: 1px solid rgb(8 45 35 / 13%);
              background:
                linear-gradient(180deg, rgb(255 253 247 / 68%), rgb(239 230 214 / 58%)),
                radial-gradient(circle at 50% 70%, var(--services-card-glow), transparent 52%);
              box-shadow: inset 0 -18px 34px rgb(8 45 35 / 5%);
            }
            .services-card-corner {
              position: absolute;
              z-index: 2;
              pointer-events: none;
            }
            .services-card-corner::before,
            .services-card-corner::after {
              position: absolute;
              background: rgb(8 45 35 / 46%);
              content: "";
            }
            .services-card-corner::before { transform: scaleX(var(--services-corner-x, 1)); }
            .services-card-corner::after { transform: scaleY(var(--services-corner-y, 1)); }
            .services-card-corner--tl {
              top: 0.55rem;
              left: 0.55rem;
            }
            .services-card-corner--tr {
              top: 0.55rem;
              right: 0.55rem;
            }
            .services-card-corner--br {
              right: 0.55rem;
              bottom: 0.55rem;
            }
            .services-card-corner--bl {
              bottom: 0.55rem;
              left: 0.55rem;
            }
            .services-card-corner--tl::before,
            .services-card-corner--tr::before,
            .services-card-corner--br::before,
            .services-card-corner--bl::before {
              width: 1.35rem;
              height: 1px;
            }
            .services-card-corner--tl::after,
            .services-card-corner--tr::after,
            .services-card-corner--br::after,
            .services-card-corner--bl::after {
              width: 1px;
              height: 1.35rem;
            }
            .services-card-corner--tl::before,
            .services-card-corner--tl::after {
              top: 0;
              left: 0;
              transform-origin: 0 0;
            }
            .services-card-corner--tr::before,
            .services-card-corner--tr::after {
              top: 0;
              right: 0;
              transform-origin: 100% 0;
            }
            .services-card-corner--br::before,
            .services-card-corner--br::after {
              right: 0;
              bottom: 0;
              transform-origin: 100% 100%;
            }
            .services-card-corner--bl::before,
            .services-card-corner--bl::after {
              bottom: 0;
              left: 0;
              transform-origin: 0 100%;
            }
            .services-card-title {
              margin: 0 0 0.65rem;
              font-size: clamp(17px, 1.55vw, 23px);
              font-weight: 900;
              line-height: 0.98;
              letter-spacing: 0;
              text-transform: uppercase;
              color: oklch(0.182 0.045 166);
            }
            .services-card-bullets {
              margin-bottom: 0.8rem;
              display: flex;
              flex-direction: column;
              gap: 0.42rem;
            }
            .services-card-bullet {
              align-items: flex-start;
              gap: 0.52rem;
              font-size: 0.79rem;
              font-weight: 650;
              line-height: 1.28;
              color: oklch(0.18 0.026 160);
            }
            .services-card-bullet svg {
              margin-top: 0.08rem;
              width: 1rem;
              height: 1rem;
              padding: 0.12rem;
              background: var(--services-card-stamp-bg);
              color: var(--services-card-stamp-ink);
            }
            .services-card-cta {
              min-height: 2.7rem;
              align-items: center;
              border-top: 1px solid transparent;
              font-size: 0.68rem;
              letter-spacing: 0.14em;
            }
            .services-card-cta [data-services-arrow] {
              width: 1.15rem;
              height: 1.15rem;
              transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            [data-services-card]:hover .services-card-cta [data-services-arrow] {
              transform: translateX(4px);
            }
            .services-header-ledger__title {
              margin: 0;
              font-size: clamp(44px, 7.4vw, 106px);
              line-height: 0.86;
              letter-spacing: -0.045em;
              font-weight: 650;
              color: oklch(0.182 0.045 166);
            }
            .services-header-ledger__title-line { display: block; overflow: hidden; padding-bottom: 0.04em; }
            .services-header-ledger__word { display: inline-block; will-change: transform, opacity; }
            .services-header-ledger__word--orange { color: oklch(0.645 0.221 35); }
            .services-header-ledger__copy { display: grid; max-width: 34ch; gap: 1rem; justify-items: end; text-align: right; }
            .services-header-ledger__tabs { display: flex; gap: 0.4rem; justify-content: flex-end; }
            .services-header-ledger__tab { width: 2.75rem; height: 0.55rem; border: 1px solid oklch(0.224 0.06 160 / 38%); background: color-mix(in oklch, oklch(0.66 0.095 58) 50%, oklch(0.975 0.021 80)); }
            .services-header-ledger__body { margin: 0; color: oklch(0.365 0.032 163); font-size: 0.94rem; line-height: 1.5; font-weight: 550; }
            .services-header-ledger__note { display: inline-flex; align-items: center; gap: 0.55rem; color: oklch(0.224 0.06 160); font-size: 0.62rem; font-weight: 850; letter-spacing: 0.16em; text-transform: uppercase; }
            .services-header-ledger__note::after { content: ""; width: 2rem; height: 0.18rem; background: oklch(0.645 0.221 35); }
            .services-header-ledger__mini { position: absolute; right: clamp(1.5rem, 3vw, 2.5rem); bottom: 1rem; color: color-mix(in oklch, oklch(0.224 0.06 160) 45%, transparent); font-size: 0.58rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
            @media (max-width: 900px) {
              .services-header-ledger { grid-template-columns: 1fr; background: transparent; }
              .services-header-ledger__copy { justify-items: start; text-align: left; }
              .services-header-ledger__tabs { justify-content: flex-start; }
              .services-header-ledger__mini { position: static; }
              .services-card-title { font-size: clamp(20px, 6vw, 30px); }
            }
          `}</style>
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.09]"
            data-services-map
          >
            <Image
              alt=""
              className="h-full w-full object-contain object-right-top grayscale"
              decoding="async"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 54vw, 74vw"
              src={`${assetBase}/toronto-cityscape-map-landscape.webp`}
            />
          </div>
          <h2 id="fairlend-services-title" className="services-header-ledger__title">
            <span className="services-header-ledger__title-line">
              <span className="services-header-ledger__word" data-services-title-word>
                OUR
              </span>
            </span>
            <span className="services-header-ledger__title-line">
              <span
                className="services-header-ledger__word services-header-ledger__word--orange"
                data-services-title-word
              >
                SERVICES
              </span>
            </span>
          </h2>
          <div className="services-header-ledger__copy" data-services-copy>
            <div className="services-header-ledger__tabs" aria-hidden="true">
              <span className="services-header-ledger__tab" data-services-tab />
              <span className="services-header-ledger__tab" data-services-tab />
              <span className="services-header-ledger__tab" data-services-tab />
            </div>
            <p className="services-header-ledger__body" data-services-copy-line>
              Flexible financing and investment solutions for borrowers, builders, and investors,
              kept close to the numbers.
            </p>
            <div className="services-header-ledger__note" data-services-copy-line>
              Real outcomes
            </div>
          </div>
          <div className="services-header-ledger__mini" aria-hidden="true" data-services-copy-line>
            Permit, capital, build
          </div>
        </div>
      </div>

      {/* Top full-width divider */}
      <span
        className="services-line-x relative z-10 block h-px w-full bg-[oklch(0.92_0.004_286.32)]"
        style={lineDelay(360)}
        data-services-line-x
      />

      {/* Service columns */}
      <div className="relative z-10 grid auto-rows-fr grid-cols-1 items-stretch md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const Icon = service.icon
          const colDelay = 420 + index * 100
          const bulletBase = 9 + index * 6

          return (
            <article
              key={service.number}
              className="services-reveal relative flex h-full flex-col"
              data-services-card
              data-services-card-motion={service.motion}
              style={step(5 + index)}
            >
              {/* Desktop vertical dividers */}
              {index > 0 && (
                <span
                  className="services-line-y absolute left-0 top-0 z-20 hidden h-full w-px bg-[oklch(0.92_0.004_286.32)] lg:block"
                  data-services-line-y
                  style={lineDelay(colDelay)}
                />
              )}

              {/* Tablet row divider for the second row */}
              {index >= 2 && (
                <span
                  className="services-line-x absolute left-0 top-0 z-20 hidden h-px w-full bg-[oklch(0.92_0.004_286.32)] md:block lg:hidden"
                  data-services-line-x
                  style={lineDelay(colDelay)}
                />
              )}

              {/* Tablet vertical divider between the two columns */}
              {index % 2 === 1 && (
                <span
                  className="services-line-y absolute left-0 top-0 z-20 hidden h-full w-px bg-[oklch(0.92_0.004_286.32)] md:block lg:hidden"
                  data-services-line-y
                  style={lineDelay(colDelay)}
                />
              )}

              <div className="flex flex-1 flex-col p-4 lg:p-5 xl:p-6">
                <div className="services-card-topline">
                  <div className="services-card-number-plate" data-services-number-plate>
                    <span data-services-number>{service.number}</span>
                    <span className="services-card-code" data-services-code>
                      {service.code}
                    </span>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    <span className="services-card-stamp" data-services-kicker>
                      {service.kicker}
                    </span>
                    <span className="services-card-icon-box" data-services-icon-box>
                      <Icon
                        aria-hidden="true"
                        className="size-6 text-[oklch(0.141_0.005_285.823)]"
                        data-services-icon
                        strokeWidth={1.7}
                      />
                    </span>
                  </div>
                </div>

                <div className="services-card-media-shell" data-services-media-shell>
                  <Image
                    alt=""
                    className="object-contain"
                    decoding="async"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 22vw"
                    src={service.image}
                    data-services-media
                  />
                  <span
                    aria-hidden="true"
                    className="services-card-corner services-card-corner--tl"
                    data-services-corner="tl"
                  />
                  <span
                    aria-hidden="true"
                    className="services-card-corner services-card-corner--tr"
                    data-services-corner="tr"
                  />
                  <span
                    aria-hidden="true"
                    className="services-card-corner services-card-corner--br"
                    data-services-corner="br"
                  />
                  <span
                    aria-hidden="true"
                    className="services-card-corner services-card-corner--bl"
                    data-services-corner="bl"
                  />
                </div>

                <h3 className="services-card-title" data-services-card-title>
                  {service.title}
                </h3>

                <span
                  className="services-line-x mb-3 block h-px w-full bg-[oklch(0.92_0.004_286.32)]"
                  data-services-line-x
                  style={lineDelay(colDelay + 80)}
                />

                <ul className="services-card-bullets">
                  {service.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="services-card-bullet services-reveal flex"
                      data-services-bullet
                      style={step(bulletBase + bulletIndex)}
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-[oklch(0.645_0.221_35)]"
                        strokeWidth={2}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="services-card-cta services-reveal relative mt-auto flex justify-between pt-3 font-bold uppercase text-[oklch(0.141_0.005_285.823)]"
                  data-services-cta
                  style={step(bulletBase + service.bullets.length)}
                >
                  <span
                    className="services-line-x absolute top-0 left-0 h-px w-full bg-[oklch(0.92_0.004_286.32)]"
                    data-services-line-x
                    style={lineDelay(colDelay + 160)}
                  />
                  <span data-services-cta-label>{service.footer}</span>
                  <ArrowRight aria-hidden="true" className="size-4" data-services-arrow />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Bottom brand strip */}
      <div
        className="services-reveal relative z-10 flex flex-col items-center justify-between gap-4 border-t border-[oklch(0.92_0.004_286.32)] px-6 py-4 lg:flex-row lg:px-10 xl:px-14"
        data-services-bottom
        style={step(40)}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold tracking-[0.14em] uppercase text-[oklch(0.552_0.016_285.938)]">
          <span>Transparency</span>
          <span className="text-[oklch(0.645_0.221_35)]">•</span>
          <span>Integrity</span>
          <span className="text-[oklch(0.645_0.221_35)]">•</span>
          <span>Performance</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden h-px w-24 bg-[oklch(0.92_0.004_286.32)] lg:block" />
          <div className="grid size-8 place-items-center rounded border border-[oklch(0.92_0.004_286.32)]">
            <span className="text-[10px] font-bold tracking-tight">FL</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FairlendServicesPosterSection() {
  const [investment, mortgage, construction, partners] = services

  return (
    <section
      aria-labelledby="fairlend-services-poster-title"
      className={cn(
        'poster-services-section relative isolate overflow-hidden py-10 text-[oklch(0.182_0.045_166)] sm:py-14 lg:py-0',
        '[font-family:Oxanium,var(--font-inter),ui-sans-serif,sans-serif]',
      )}
      data-testid="services-poster-section"
    >
      <PosterSectionStyles />
      <div className="w-full">
        <div className="poster-services-shell">
          <aside className="poster-services-intro">
            <div className="poster-services-intro-main px-6 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-14">
              <div>
                <p className="poster-services-kicker">What we do</p>
                <h2 id="fairlend-services-poster-title" className="poster-services-title">
                  <span>Our</span>
                  <span>Services</span>
                </h2>
              </div>
              <p className="poster-services-body">
                FairLend provides flexible financing and investment solutions designed for
                borrowers, builders, and investors.
              </p>
            </div>
            <div className="poster-services-cta-band">
              <span className="poster-services-arrow" aria-hidden="true">
                <ArrowRight className="size-8" strokeWidth={1.7} />
              </span>
              <p className="m-0 font-[var(--font-inter)] text-[clamp(1rem,1.18vw,1.25rem)] leading-tight font-semibold">
                Built on <strong className="font-black">trust.</strong>
                <br />
                Driven by <strong className="font-black">results.</strong>
              </p>
            </div>
          </aside>

          <div className="poster-services-grid">
            <PosterServicePanel
              imageClassName=""
              layout="invest"
              service={investment}
              tone="dark"
            />

            <PosterServicePanel imageClassName="" layout="mortgage" service={mortgage} tone="light">
              <div className="poster-services-phone" aria-hidden="true">
                <span className="poster-services-phone-check">
                  <Check className="size-6" strokeWidth={2.4} />
                </span>
                <span className="poster-services-phone-label">Deal Closed</span>
              </div>
            </PosterServicePanel>

            <PosterServicePanel
              imageClassName=""
              layout="construction"
              service={construction}
              tone="light"
            >
              <div className="poster-services-dots" aria-hidden="true">
                {Array.from({ length: 35 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
            </PosterServicePanel>

            <PosterServicePanel imageClassName="" layout="partners" service={partners} tone="dark">
              <div className="poster-services-sign" aria-hidden="true">
                <div>
                  <Users className="mx-auto mb-3 size-8" strokeWidth={1.65} />
                  <span>FairLend</span>
                  <span className="mt-1 text-[0.62em] tracking-[0.2em]">Partner</span>
                </div>
              </div>
              <div className="poster-services-footer-bars" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
            </PosterServicePanel>
          </div>
        </div>
      </div>
    </section>
  )
}
