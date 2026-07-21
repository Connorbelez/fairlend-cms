import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Building2,
  ChartNoAxesColumnIncreasing,
  FileCheck2,
  Handshake,
  Landmark,
  MapPin,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'

import { FairlendConsultationBookingDialog } from '@/components/FairlendConsultationBooking/FairlendConsultationBookingDialog.client'
import {
  FairlendLeadershipCapabilityCard,
  FairlendLeadershipCommitment,
  FairlendLeadershipProofCard,
  FairlendPaperSection,
  FairlendPaperShell,
} from '@/components/FairlendMarketingPrimitives'
import { fairlendPrincipalBrokerClaims } from '@/lib/fairlend-claims'

import { LeadershipMotion } from './LeadershipMotion.client'
import './leadership-motion.css'

const leadershipPortraitAsset = '/assets/elie-soberano-headshot.webp'
const leadershipSceneAsset = '/assets/fairlend-principal-broker-background-halftone-key.webp'

const leadershipProof = [
  {
    detail: 'Across mortgage brokerage, private lending, and investment finance.',
    disclaimer: `*${fairlendPrincipalBrokerClaims.experienceDisclosure}`,
    Icon: ShieldCheck,
    label: 'Years experience',
    qualifier: '*',
    value: fairlendPrincipalBrokerClaims.experienceValue,
  },
  {
    detail: 'Lifetime funded deals by Principal Broker.',
    disclaimer: `*${fairlendPrincipalBrokerClaims.volumeDisclosure}`,
    Icon: Landmark,
    label: 'Principal Broker volume',
    qualifier: '*',
    value: fairlendPrincipalBrokerClaims.volumeValue,
  },
  {
    detail: 'Relationships across borrowers, lenders, brokers, and investors.',
    Icon: UsersRound,
    label: 'Lenders & borrowers',
    value: '160+',
  },
  {
    detail: 'Southern Ontario market knowledge with national capital relationships.',
    Icon: MapPin,
    label: 'Southern Ontario-based',
    value: 'LOCAL',
  },
] satisfies ReadonlyArray<{
  detail: string
  disclaimer?: string
  Icon: LucideIcon
  label: string
  qualifier?: string
  value: string
}>

const capabilities = [
  {
    copy: 'FSRA-licensed mortgage brokerage insight across complex borrowing and investing needs.',
    Icon: BadgeCheck,
    title: 'Brokerage expertise',
  },
  {
    copy: 'Builder perspective from 20+ homes built, paired with land, construction, renovation, and stabilization financing.',
    Icon: Building2,
    title: 'Builder / 20+ homes built',
  },
  {
    copy: 'Strategic access to insured rental-housing programs, leverage, and flexibility.',
    Icon: FileCheck2,
    title: 'MLI Select planning',
  },
  {
    copy: 'Compliant structures that align risk, cash flow, lender appetite, and exit strategy.',
    Icon: Handshake,
    title: 'Deal structuring',
  },
] satisfies ReadonlyArray<{
  copy: string
  Icon: LucideIcon
  title: string
}>

const commitments = [
  {
    Icon: ShieldCheck,
    label: 'Regulated. Trusted. Accountable.',
  },
  {
    Icon: UsersRound,
    label: 'Client-first approach',
  },
  {
    Icon: BadgeCheck,
    label: 'Transparent communication',
  },
  {
    Icon: ChartNoAxesColumnIncreasing,
    label: 'Results that speak for themselves',
  },
] satisfies ReadonlyArray<{
  Icon: LucideIcon
  label: string
}>

export function FairlendLeadershipSection() {
  return (
    <FairlendPaperSection
      aria-labelledby="fairlend-leadership-title"
      className="leadership-model-section"
      data-fairlend-motion="leadership"
      data-testid="fairlend-leadership-section"
      id="leadership"
    >
      <style>{`
        .leadership-model-section {
          --leadership-paper: #f8f7f5;
          --leadership-paper-soft: #ffffff;
          --leadership-panel: #ffffff;
          --leadership-ink: #08090a;
          --leadership-muted: rgb(73 73 68);
          --leadership-line: rgb(8 9 10 / 22%);
          --leadership-line-soft: rgb(8 9 10 / 14%);
          --leadership-signal: #96ec18;
          --leadership-signal-muted: rgb(150 236 24 / 14%);
          --leadership-orange: var(--leadership-signal);
          --leadership-blueprint: var(--leadership-ink);
          --about-ink: var(--leadership-ink);
          --about-orange: var(--leadership-orange);
          --about-display: var(--font-cormorant), Georgia, serif;
          --about-mono: var(--font-inter), ui-sans-serif, sans-serif;

          position: relative;
          isolation: isolate;
          min-height: 100svh;
          overflow: hidden;
          background:
            radial-gradient(circle at 78% 18%, rgb(255 255 255 / 58%), transparent 27rem),
            radial-gradient(circle at 18% 12%, rgb(255 255 255 / 72%), transparent 26rem),
            linear-gradient(90deg, rgb(255 255 255 / 88%) 0%, rgb(255 255 255 / 26%) 48%, rgb(255 255 255 / 72%) 100%),
            linear-gradient(180deg, var(--leadership-paper) 0%, var(--leadership-paper-soft) 100%);
          color: var(--leadership-ink);
          font-family: var(--about-mono);
          scroll-margin-top: 96px;
        }

        .leadership-model-section::before {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            url('/assets/heatherpapertexture.png'),
            url('/assets/diagonal_paperTexture.png');
          background-repeat: repeat;
          background-size: 560px 560px, 360px 360px;
          mix-blend-mode: multiply;
          opacity: 0.18;
          content: "";
        }

        .leadership-model-section::after {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgb(8 9 10 / 6%) 1px, transparent 1px),
            linear-gradient(180deg, rgb(8 9 10 / 5%) 1px, transparent 1px);
          background-size: 120px 120px, 120px 120px;
          mix-blend-mode: multiply;
          opacity: 0.35;
          content: "";
        }

        .leadership-shell {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: minmax(0, 1fr);
          width: min(100%, 1800px);
          min-height: 100svh;
          margin-inline: auto;
          padding: 0 30px 30px;
        }

        .leadership-header {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(280px, 0.38fr);
          gap: 40px;
          align-items: end;
          padding: 2px 20px 18px;
        }

        .leadership-kicker {
          gap: 18px;
        }

        .leadership-kicker span {
          font-size: 82px;
        }

        .leadership-kicker p {
          font-size: 27px;
        }

        .leadership-intro {
          max-width: 760px;
          margin: 10px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 17px;
          font-weight: 650;
          line-height: 1.4;
          text-wrap: balance;
        }

        .leadership-header-meta {
          justify-self: end;
          width: min(100%, 380px);
          border-top: 1px solid var(--leadership-line);
          padding-top: 18px;
          text-align: right;
        }

        .leadership-header-meta strong {
          display: block;
          color: var(--leadership-ink);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
        }

        .leadership-header-meta span {
          display: block;
          margin-top: 8px;
          color: rgb(73 73 68 / 86%);
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.16em;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .leadership-ledger-tabs {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-bottom: 16px;
        }

        .leadership-ledger-tabs span {
          width: 54px;
          height: 5px;
          border: 1px solid rgb(8 9 10 / 22%);
          background: linear-gradient(90deg, var(--leadership-signal), var(--leadership-panel));
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 70%);
        }

        .leadership-frame {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.27fr);
          grid-template-rows: minmax(min-content, 1fr) auto;
          gap: 0;
          align-self: stretch;
          min-height: 100svh;
          overflow: hidden;
          border: 1px solid rgb(8 9 10 / 16%);
          background: rgb(255 255 255 / 58%);
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 78%),
            0 28px 90px rgb(8 9 10 / 8%);
          will-change: clip-path, opacity, transform;
        }

        .leadership-frame-line {
          position: absolute;
          z-index: 8;
          pointer-events: none;
          background: var(--leadership-line);
          opacity: 0.95;
          will-change: opacity, transform;
        }

        .leadership-frame-line[data-leadership-frame-line="top"],
        .leadership-frame-line[data-leadership-frame-line="bottom"] {
          right: 0;
          left: 0;
          height: 2px;
          transform-origin: left center;
        }

        .leadership-frame-line[data-leadership-frame-line="top"] {
          top: 0;
        }

        .leadership-frame-line[data-leadership-frame-line="bottom"] {
          bottom: 0;
          transform-origin: right center;
        }

        .leadership-frame-line[data-leadership-frame-line="right"],
        .leadership-frame-line[data-leadership-frame-line="left"] {
          top: 0;
          bottom: 0;
          width: 2px;
          transform-origin: center top;
        }

        .leadership-frame-line[data-leadership-frame-line="right"] {
          right: 0;
        }

        .leadership-frame-line[data-leadership-frame-line="left"] {
          left: 0;
          transform-origin: center bottom;
        }

        .leadership-main-panel {
          position: relative;
          display: grid;
          min-height: 0;
          grid-template-columns: minmax(360px, 0.43fr) minmax(0, 0.57fr);
          overflow: hidden;
          border-right: 1px solid var(--leadership-line-soft);
          background: linear-gradient(180deg, rgb(255 255 255 / 94%), rgb(248 247 245 / 80%));
        }

        .leadership-main-panel::before,
        .leadership-main-panel::after {
          position: absolute;
          inset-inline: 0;
          z-index: 3;
          height: 2px;
          background: var(--leadership-line-soft);
          content: "";
        }

        .leadership-main-panel::before {
          top: 0;
        }

        .leadership-main-panel::after {
          bottom: 0;
        }

        .leadership-copy-panel {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          padding: clamp(24px, 2.2vw, 36px) clamp(24px, 2.4vw, 40px) clamp(22px, 2vw, 30px);
        }

        .leadership-panel-index {
          position: absolute;
          top: 28px;
          right: 28px;
          color: rgb(8 9 10 / 12%);
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .leadership-eyebrow {
          display: inline-flex;
          box-sizing: border-box;
          width: 100%;
          align-items: center;
          gap: 12px;
          padding-right: 78px;
          color: rgb(8 9 10 / 74%);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .leadership-eyebrow::after {
          display: block;
          width: auto;
          min-width: 24px;
          max-width: 72px;
          flex: 1 1 72px;
          height: 2px;
          background: linear-gradient(90deg, var(--leadership-signal), transparent);
          content: "";
        }

        .leadership-title {
          max-width: 520px;
          margin: 0;
          color: var(--leadership-ink);
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(42px, 3.7vw, 70px);
          font-weight: 700;
          letter-spacing: 0;
          line-height: 0.92;
          text-transform: none;
          text-wrap: balance;
        }

        .leadership-title-line {
          display: block;
          overflow: hidden;
        }

        .leadership-title-line > span {
          display: block;
          will-change: opacity, transform;
        }

        .leadership-summary {
          max-width: 520px;
          margin: 14px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          line-height: 1.42;
          text-wrap: pretty;
        }

        .leadership-capabilities {
          position: relative;
          display: grid;
          --leadership-capabilities-left-scale: 1;
          --leadership-capabilities-top-scale: 1;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        .leadership-capabilities::before,
        .leadership-capabilities::after {
          position: absolute;
          z-index: 3;
          pointer-events: none;
          background: transparent;
          content: "";
          will-change: transform;
        }

        .leadership-capabilities::before {
          top: 0;
          right: 0;
          left: 0;
          height: 2px;
          transform: scaleX(var(--leadership-capabilities-top-scale));
          transform-origin: left center;
        }

        .leadership-capabilities::after {
          top: 0;
          bottom: 0;
          left: 0;
          width: 2px;
          transform: scaleY(var(--leadership-capabilities-left-scale));
          transform-origin: center top;
        }

        .leadership-capability {
          position: relative;
          display: grid;
          min-width: 0;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-content: start;
          overflow: hidden;
          padding: 11px;
          border: 1px solid rgb(8 9 10 / 10%);
          background: rgb(255 255 255 / 58%);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 76%);
        }

        .leadership-capability-flash {
          position: absolute;
          inset: 0 auto 0 0;
          z-index: 1;
          width: 118%;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgb(150 236 24 / 8%) 18%,
            rgb(150 236 24 / 32%) 44%,
            rgb(231 255 188 / 44%) 52%,
            rgb(150 236 24 / 20%) 64%,
            transparent 100%
          );
          mix-blend-mode: multiply;
          transform: translateX(-110%);
          opacity: 0;
          content: "";
        }

        .leadership-capability-icon {
          display: grid;
          position: relative;
          z-index: 2;
          width: 34px;
          height: 34px;
          place-items: center;
          color: var(--leadership-ink);
          background: rgb(150 236 24 / 13%);
        }

        .leadership-capability:nth-child(even) .leadership-capability-icon {
          color: var(--leadership-ink);
        }

        .leadership-capability h3 {
          position: relative;
          z-index: 2;
          margin: 0;
          color: var(--leadership-ink);
          font-size: 11.5px;
          font-weight: 900;
          line-height: 1.05;
          text-transform: uppercase;
        }

        .leadership-capability p {
          position: relative;
          z-index: 2;
          margin: 7px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 10.8px;
          font-weight: 600;
          line-height: 1.3;
        }

        .leadership-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: 18px;
          padding-top: 0;
        }

        .leadership-cta {
          position: relative;
          min-height: 48px;
          overflow: hidden;
          border: 0;
          border-radius: 999px;
          background: var(--leadership-signal);
          padding: 0 9px 0 22px;
          color: var(--leadership-ink);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 34%),
            0 18px 40px rgb(150 236 24 / 28%);
        }

        .leadership-cta:hover {
          background: rgb(118 234 0);
        }

        .leadership-cta span {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 1px solid rgb(8 9 10 / 24%);
          border-radius: 999px;
          background: rgb(8 9 10 / 9%);
        }

        .leadership-cta span svg {
          transition: transform 220ms ease;
        }

        .leadership-cta:hover span svg {
          transform: translateX(2px) rotate(10deg);
        }

        .leadership-license {
          margin: 0;
          color: rgb(73 73 68 / 78%);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.12em;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .leadership-visual-panel {
          position: relative;
          z-index: 1;
          min-width: 0;
          overflow: hidden;
          border-left: 1px solid var(--leadership-line-soft);
          background: rgb(255 255 255 / 48%);
        }

        .leadership-visual-grid,
        .leadership-visual-sweep {
          position: absolute;
          pointer-events: none;
        }

        .leadership-visual-panel::before {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgb(255 255 255 / 72%) 0%, transparent 30%),
            linear-gradient(180deg, rgb(255 255 255 / 64%) 0%, transparent 22%);
          content: "";
        }

        .leadership-scene-image {
          object-fit: cover;
          object-position: 64% 0%;
          opacity: 0.94;
          mix-blend-mode: multiply;
          filter: saturate(0.96) contrast(1.03) brightness(1.01);
          will-change: filter, transform;
        }

        .leadership-portrait-card {
          position: absolute;
          bottom: clamp(22px, 7%, 58px);
          left: clamp(22px, 7%, 58px);
          z-index: 5;
          width: min(34%, 250px);
          min-width: 172px;
          overflow: hidden;
          border: 1px solid rgb(8 9 10 / 18%);
          background: rgb(255 255 255 / 80%);
          box-shadow:
            0 24px 70px rgb(8 9 10 / 14%),
            inset 0 1px 0 rgb(255 255 255 / 86%);
        }

        .leadership-portrait-card::after {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border: 10px solid rgb(255 255 255 / 46%);
          content: "";
        }

        .leadership-portrait-media {
          position: relative;
          aspect-ratio: 4 / 4.5;
          overflow: hidden;
        }

        .leadership-portrait-media img {
          object-fit: cover;
          object-position: 52% 48%;
          filter: saturate(0.78) contrast(0.98) brightness(1.04);
        }

        .leadership-portrait-caption {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 3px;
          border-top: 1px solid rgb(8 9 10 / 12%);
          padding: 12px 14px 14px;
          color: var(--leadership-ink);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.1;
        }

        .leadership-portrait-caption span {
          color: var(--leadership-muted);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .leadership-visual-grid {
          inset: 0;
          z-index: 3;
          background-image:
            linear-gradient(90deg, rgb(8 9 10 / 10%) 1px, transparent 1px),
            linear-gradient(180deg, rgb(8 9 10 / 10%) 1px, transparent 1px),
            radial-gradient(circle, rgb(8 9 10 / 14%) 1px, transparent 1.5px);
          background-position: center;
          background-size: 74px 74px, 74px 74px, 18px 18px;
          mix-blend-mode: multiply;
          opacity: 0;
          will-change: opacity, transform;
        }

        .leadership-visual-sweep {
          top: -18%;
          bottom: -18%;
          left: 0;
          z-index: 4;
          width: 38%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgb(255 255 255 / 72%) 42%,
            rgb(150 236 24 / 18%) 56%,
            transparent 100%
          );
          mix-blend-mode: screen;
          transform: translateX(-140%) skewX(-12deg);
          opacity: 0;
          will-change: opacity, transform;
        }

        .leadership-proof-grid {
          display: grid;
          min-width: 0;
          grid-template-columns: minmax(0, 1fr);
          grid-auto-rows: minmax(0, 1fr);
          gap: 0;
          background: rgb(255 255 255 / 46%);
        }

        .leadership-proof-card {
          position: relative;
          display: grid;
          min-height: 0;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 14px;
          align-content: center;
          border: 0;
          border-bottom: 1px solid var(--leadership-line-soft);
          border-radius: 0;
          background: rgb(255 255 255 / 50%);
          padding: 18px 18px;
          box-shadow: none;
          transform-style: preserve-3d;
          will-change: opacity, transform;
        }

        .leadership-proof-pulse {
          position: absolute;
          top: -2px;
          right: 0;
          left: 0;
          height: 2px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, var(--leadership-signal), transparent);
          transform: scaleX(0);
          transform-origin: left center;
          opacity: 0;
          will-change: opacity, transform;
        }

        .leadership-proof-card:last-child {
          border-bottom: 0;
        }

        .leadership-proof-icon {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgb(8 9 10 / 14%);
          border-radius: 999px;
          color: var(--leadership-ink);
          background: rgb(150 236 24 / 12%);
        }

        .leadership-proof-card:nth-child(even) .leadership-proof-icon {
          color: var(--leadership-blueprint);
        }

        .leadership-proof-value {
          display: block;
          color: var(--leadership-ink);
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(38px, 3vw, 54px);
          font-weight: 700;
          letter-spacing: 0;
          line-height: 0.84;
          text-transform: uppercase;
        }

        .leadership-proof-label {
          display: block;
          margin-top: 6px;
          color: rgb(8 9 10 / 76%);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .leadership-proof-card:nth-child(even) .leadership-proof-label {
          color: var(--leadership-blueprint);
        }

        .leadership-proof-detail {
          grid-column: 2;
          margin: 8px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.35;
        }

        .leadership-footer {
          display: grid;
          grid-column: 1 / -1;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          border-top: 1px solid var(--leadership-line);
          background:
            linear-gradient(90deg, rgb(255 255 255 / 84%), rgb(255 255 255 / 42%)),
            rgb(248 247 245 / 72%);
          padding: 14px 22px;
        }

        .leadership-quote {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 16px;
          align-items: center;
          margin: 0;
          color: var(--leadership-ink);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 13.5px;
          font-weight: 650;
          line-height: 1.35;
        }

        .leadership-quote [data-leadership-quote-mark] {
          color: var(--leadership-ink);
          font-family: Georgia, serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1;
        }

        .leadership-quote-copy {
          display: block;
          overflow: hidden;
        }

        .leadership-quote-copy > span {
          display: block;
          will-change: opacity, transform;
        }

        .leadership-commitments {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 0;
        }

        .leadership-commitment {
          display: inline-grid;
          grid-template-columns: 24px minmax(0, 110px);
          gap: 10px;
          align-items: center;
          min-height: 40px;
          border-left: 1px solid var(--leadership-line-soft);
          padding: 0 16px;
          color: var(--leadership-ink);
          font-size: 10px;
          font-weight: 900;
          line-height: 1.16;
        }

        @media (max-width: 1400px) {
          .leadership-shell {
            padding: 0 24px 24px;
          }

          .leadership-header {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .leadership-header-meta {
            justify-self: start;
            text-align: left;
          }

          .leadership-frame {
            grid-template-columns: 1fr;
          }

          .leadership-main-panel {
            border-right: 0;
            border-bottom: 1px solid var(--leadership-line-soft);
          }

          .leadership-proof-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .leadership-proof-card {
            min-height: 0;
            grid-template-columns: minmax(0, 1fr);
            border-right: 1px solid var(--leadership-line-soft);
            border-bottom: 0;
          }

          .leadership-proof-card:last-child {
            border-right: 0;
          }

          .leadership-proof-detail {
            grid-column: auto;
          }
        }

        @media (max-width: 1024px) {
          .leadership-model-section,
          .leadership-shell {
            min-height: 0;
            height: auto;
          }

          .leadership-shell {
            padding: 0 22px 30px;
          }

          .leadership-header {
            padding: 0 0 24px;
          }

          .leadership-kicker span {
            font-size: 64px;
          }

          .leadership-kicker p {
            font-size: 22px;
          }

          .leadership-intro {
            max-width: 660px;
            font-size: 17px;
          }

          .leadership-frame {
            min-height: 0;
            border-width: 2px;
          }

          .leadership-main-panel {
            grid-template-columns: 1fr;
          }

          .leadership-copy-panel {
            padding: 26px 22px 24px;
          }

          .leadership-title {
            max-width: 620px;
            font-size: clamp(38px, 5.7vw, 52px);
          }

          .leadership-summary {
            max-width: 620px;
            margin-top: 12px;
          }

          .leadership-visual-panel {
            min-height: 320px;
            border-top: 1px solid var(--leadership-line-soft);
            border-left: 0;
            order: -1;
          }

          .leadership-visual-panel::before {
            background:
              linear-gradient(180deg, rgb(255 255 255 / 40%) 0%, transparent 18%),
              linear-gradient(90deg, rgb(255 255 255 / 64%) 0%, transparent 22%);
          }

          .leadership-proof-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .leadership-proof-card:nth-child(2) {
            border-right: 0;
          }

          .leadership-proof-card:nth-child(-n + 2) {
            border-bottom: 1px solid var(--leadership-line-soft);
          }

          .leadership-footer {
            grid-template-columns: 1fr;
          }

          .leadership-commitments {
            justify-content: flex-start;
          }

          .leadership-commitment {
            border-left: 0;
            border-right: 1px solid var(--leadership-line-soft);
            padding: 0 16px 0 0;
          }
        }

        @media (max-width: 720px) {
          .leadership-shell {
            padding: 0 16px 28px;
          }

          .leadership-header {
            gap: 18px;
          }

          .leadership-ledger-tabs {
            justify-content: flex-start;
          }

          .leadership-ledger-tabs span {
            width: 46px;
          }

          .leadership-kicker {
            gap: 12px;
          }

          .leadership-kicker span {
            font-size: 46px;
          }

          .leadership-kicker p {
            font-size: 18px;
          }

          .leadership-intro {
            margin-top: 16px;
            font-size: 15px;
            line-height: 1.44;
          }

          .leadership-copy-panel {
            padding: 22px 16px 22px;
          }

          .leadership-eyebrow {
            gap: 8px;
            padding-right: 62px;
            font-size: clamp(8px, 2.6vw, 11px);
            letter-spacing: 0.12em;
          }

          .leadership-panel-index {
            right: 16px;
          }

          .leadership-eyebrow::after {
            min-width: 16px;
          }

          .leadership-title {
            font-size: 38px;
          }

          .leadership-summary {
            font-size: 14px;
          }

          .leadership-visual-panel {
            min-height: 280px;
          }

          .leadership-portrait-card {
            width: min(42%, 190px);
            min-width: 138px;
          }

          .leadership-portrait-caption {
            padding: 10px 11px 11px;
            font-size: 11px;
          }

          .leadership-capabilities,
          .leadership-proof-grid {
            grid-template-columns: 1fr;
          }

          .leadership-capability {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 12px;
            padding: 14px;
          }

          .leadership-capability-icon {
            width: 36px;
            height: 36px;
          }

          .leadership-actions {
            align-items: flex-start;
            flex-direction: column;
          }

          .leadership-proof-card,
          .leadership-proof-card:nth-child(2),
          .leadership-proof-card:nth-child(-n + 2) {
            min-height: 0;
            grid-template-columns: 48px minmax(0, 1fr);
            border-right: 0;
            border-bottom: 1px solid var(--leadership-line-soft);
            padding: 20px 18px;
          }

          .leadership-proof-card:last-child {
            border-bottom: 0;
          }

          .leadership-proof-icon {
            width: 48px;
            height: 48px;
          }

          .leadership-proof-value {
            font-size: 46px;
          }

          .leadership-proof-detail {
            grid-column: 2;
          }

          .leadership-footer {
            padding: 18px;
          }

          .leadership-quote {
            grid-template-columns: 1fr;
            gap: 6px;
            font-size: 12px;
          }

          .leadership-commitments {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .leadership-commitment {
            min-height: 0;
            grid-template-columns: 24px minmax(0, 1fr);
            border-right: 0;
            padding: 0;
          }
        }
      `}</style>

      <FairlendPaperShell className="leadership-shell">
        <LeadershipMotion />
        <h2 id="fairlend-leadership-title" className="sr-only">
          Leadership
        </h2>

        <div className="leadership-frame" data-leadership-frame>
          <span className="leadership-frame-line" data-leadership-frame-line="top" />
          <span className="leadership-frame-line" data-leadership-frame-line="right" />
          <span className="leadership-frame-line" data-leadership-frame-line="bottom" />
          <span className="leadership-frame-line" data-leadership-frame-line="left" />
          <article className="leadership-main-panel" data-leadership-main data-leadership-reveal>
            <div className="leadership-copy-panel">
              <span className="leadership-panel-index" aria-hidden="true" data-leadership-index>
                01
              </span>
              <span className="leadership-eyebrow" data-leadership-copy-item>
                Founder, Principal Broker & MIC Director
              </span>
              <h3 className="leadership-title" data-leadership-title>
                <span className="leadership-title-line" data-leadership-title-line>
                  <span>The equation is clearer.</span>
                </span>
                <span className="leadership-title-line" data-leadership-title-line>
                  <span>It still needs a team.</span>
                </span>
              </h3>
              <p className="leadership-summary" data-leadership-copy-item>
                We have mapped the problem and the financing path. Construction capital is still a
                moving equation of site, budget, draw timing, lender appetite, and exit plan. Meet
                the people who help turn those variables into a structure that can actually close.
              </p>

              <div className="leadership-capabilities" aria-label="Leadership capabilities">
                {capabilities.map(({ copy, Icon, title }) => (
                  <FairlendLeadershipCapabilityCard
                    copy={copy}
                    Icon={Icon}
                    key={title}
                    title={title}
                  />
                ))}
              </div>

              <div className="leadership-actions" data-leadership-actions>
                <FairlendConsultationBookingDialog />
                <p className="leadership-license">Mortgage brokerage & investment leadership</p>
              </div>
            </div>

            <div className="leadership-visual-panel" data-leadership-visual>
              <Image
                className="leadership-scene-image"
                alt=""
                aria-hidden="true"
                decoding="async"
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, (max-width: 1400px) 54vw, 46vw"
                src={leadershipSceneAsset}
              />
              <div className="leadership-portrait-card">
                <div className="leadership-portrait-media">
                  <Image
                    alt="Elie Soberano, FairLend founder, principal broker and MIC director"
                    decoding="async"
                    fill
                    priority={false}
                    sizes="(max-width: 720px) 42vw, 250px"
                    src={leadershipPortraitAsset}
                    title="Elie Soberano — FairLend Founder, Principal Broker and MIC Director"
                  />
                </div>
                <div className="leadership-portrait-caption">
                  Elie Soberano
                  <span>Founder, Principal Broker & MIC Director</span>
                </div>
              </div>
              <span className="leadership-visual-grid" data-leadership-visual-grid />
              <span className="leadership-visual-sweep" data-leadership-visual-sweep />
            </div>
          </article>

          <aside
            className="leadership-proof-grid"
            aria-label="Leadership proof points"
            data-leadership-proof-grid
          >
            {leadershipProof.map(({ detail, disclaimer, Icon, label, qualifier, value }) => (
              <FairlendLeadershipProofCard
                detail={detail}
                disclaimer={disclaimer}
                Icon={Icon}
                key={label}
                label={label}
                qualifier={qualifier}
                value={value}
              />
            ))}
          </aside>

          <div className="leadership-footer" data-leadership-footer data-leadership-reveal>
            <p className="leadership-quote" data-leadership-quote>
              <span aria-hidden="true" data-leadership-quote-mark>
                “
              </span>
              <span className="leadership-quote-copy">
                <span data-leadership-quote-copy>
                  Our commitment is simple: align with your goals, manage risk intelligently, and
                  deliver financing that creates long-term value.
                </span>
              </span>
            </p>
            <div className="leadership-commitments" aria-label="Leadership commitments">
              {commitments.map(({ Icon, label }) => (
                <FairlendLeadershipCommitment Icon={Icon} key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      </FairlendPaperShell>
    </FairlendPaperSection>
  )
}
