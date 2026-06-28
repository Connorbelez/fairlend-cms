import Image from 'next/image'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
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

import { FairlendSectionKicker } from '@/components/FairlendSectionKicker'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const leadershipAsset = '/assets/elie-headshot.webp'

const leadershipProof = [
  {
    detail: 'Across mortgage brokerage, private lending, and investment finance.',
    Icon: ShieldCheck,
    label: 'Years experience',
    value: '25+',
  },
  {
    detail: 'Residential, commercial, construction, and stabilization capital.',
    Icon: Landmark,
    label: 'Total financed',
    value: '$2B+',
  },
  {
    detail: 'Relationships across borrowers, lenders, brokers, and investors.',
    Icon: UsersRound,
    label: 'Lenders & borrowers',
    value: '160+',
  },
  {
    detail: 'GTA market knowledge with national capital relationships.',
    Icon: MapPin,
    label: 'Toronto-based',
    value: 'GTA',
  },
] satisfies ReadonlyArray<{
  detail: string
  Icon: LucideIcon
  label: string
  value: string
}>

const capabilities = [
  {
    copy: 'FSRA-licensed mortgage brokerage insight across complex borrowing and investing needs.',
    Icon: BadgeCheck,
    title: 'Brokerage expertise',
  },
  {
    copy: 'End-to-end financing for land, construction, renovation, and long-term stabilization.',
    Icon: Building2,
    title: 'Construction finance',
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
    <section
      aria-labelledby="fairlend-leadership-title"
      className="leadership-model-section"
      data-fairlend-motion="leadership"
      data-testid="fairlend-leadership-section"
      id="leadership"
    >
      <style>{`
        .leadership-model-section {
          --leadership-paper: rgb(255 253 247);
          --leadership-paper-soft: rgb(250 244 235);
          --leadership-ink: oklch(0.182 0.045 166);
          --leadership-muted: rgb(74 91 87);
          --leadership-line: rgb(8 45 35 / 34%);
          --leadership-line-soft: rgb(8 45 35 / 20%);
          --leadership-orange: oklch(0.645 0.221 35);
          --leadership-blueprint: oklch(0.464 0.091 243.7);
          --about-ink: var(--leadership-ink);
          --about-orange: var(--leadership-orange);
          --about-display: "League Gothic", Impact, "Arial Narrow", sans-serif;
          --about-mono: "Oxanium", "Arial Narrow", system-ui, sans-serif;

          position: relative;
          isolation: isolate;
          height: 100svh;
          overflow: hidden;
          background:
            radial-gradient(circle at 76% 6%, rgb(255 255 249 / 88%), transparent 30rem),
            radial-gradient(circle at 18% 12%, rgb(255 255 251 / 64%), transparent 23rem),
            radial-gradient(circle at 82% 72%, rgb(255 92 52 / 7%), transparent 30rem),
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
          opacity: 0.23;
          content: "";
        }

        .leadership-model-section::after {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgb(8 45 35 / 4%) 0 1px, transparent 1px 19px),
            radial-gradient(circle at 18% 78%, rgb(70 108 118 / 7%), transparent 26rem);
          mix-blend-mode: multiply;
          opacity: 0.42;
          content: "";
        }

        .leadership-shell {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          width: min(100%, 1780px);
          height: 100svh;
          margin-inline: auto;
          padding: 28px;
        }

        .leadership-shell::before,
        .leadership-shell::after,
        .leadership-frame::before,
        .leadership-frame::after {
          position: absolute;
          z-index: 5;
          width: 32px;
          height: 32px;
          pointer-events: none;
          background:
            linear-gradient(var(--leadership-line), var(--leadership-line)) left top / 100% 2px no-repeat,
            linear-gradient(var(--leadership-line), var(--leadership-line)) left top / 2px 100% no-repeat;
          content: "";
        }

        .leadership-shell::before {
          top: 28px;
          left: 28px;
        }

        .leadership-shell::after {
          right: 28px;
          bottom: 28px;
          transform: rotate(180deg);
        }

        .leadership-frame::before {
          top: 12px;
          right: 12px;
          transform: rotate(90deg);
        }

        .leadership-frame::after {
          bottom: 12px;
          left: 12px;
          transform: rotate(-90deg);
        }

        .leadership-header {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(280px, 0.38fr);
          gap: 40px;
          align-items: end;
          padding: 4px 24px 16px;
        }

        .leadership-kicker {
          gap: 18px;
        }

        .leadership-kicker span {
          font-size: 96px;
        }

        .leadership-kicker p {
          font-size: 29px;
        }

        .leadership-intro {
          max-width: 760px;
          margin: 14px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 18px;
          font-weight: 650;
          line-height: 1.4;
          text-wrap: balance;
        }

        .leadership-header-meta {
          justify-self: end;
          width: min(100%, 380px);
          border-top: 2px solid var(--leadership-line-soft);
          padding-top: 18px;
          text-align: right;
        }

        .leadership-header-meta strong {
          display: block;
          color: var(--leadership-orange);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          line-height: 1;
          text-transform: uppercase;
        }

        .leadership-header-meta span {
          display: block;
          margin-top: 8px;
          color: rgb(45 70 64 / 74%);
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
          margin-bottom: 18px;
        }

        .leadership-ledger-tabs span {
          width: 58px;
          height: 8px;
          border: 2px solid rgb(8 45 35 / 28%);
          background: rgb(200 169 136 / 54%);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 48%);
        }

        .leadership-frame {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.32fr);
          grid-template-rows: minmax(0, 1fr) auto;
          gap: 24px;
          align-self: stretch;
          min-height: 0;
          overflow: hidden;
          border: 2px solid transparent;
          background: rgb(255 253 247 / 62%);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 72%);
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
          grid-template-columns: minmax(330px, 0.46fr) minmax(0, 0.54fr);
          overflow: hidden;
          border-right: 2px solid var(--leadership-line-soft);
          background:
            radial-gradient(circle at 72% 18%, rgb(255 253 247 / 78%), transparent 26rem),
            linear-gradient(180deg, rgb(255 253 247 / 90%), rgb(250 244 235 / 76%));
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
          padding: 28px 32px 22px;
        }

        .leadership-panel-index {
          position: absolute;
          top: 28px;
          right: 28px;
          color: rgb(20 43 36 / 18%);
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .leadership-eyebrow {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 12px;
          color: var(--leadership-orange);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
        }

        .leadership-eyebrow::after {
          display: block;
          width: 72px;
          height: 2px;
          background: var(--leadership-line-soft);
          content: "";
        }

        .leadership-title {
          max-width: 580px;
          margin: 16px 0 0;
          color: var(--leadership-ink);
          font-family: var(--about-display);
          font-size: 64px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
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
          max-width: 560px;
          margin: 16px 0 0;
          color: var(--leadership-muted);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.45;
          text-wrap: pretty;
        }

        .leadership-capabilities {
          position: relative;
          display: grid;
          --leadership-capabilities-left-scale: 1;
          --leadership-capabilities-top-scale: 1;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 18px;
        }

        .leadership-capabilities::before,
        .leadership-capabilities::after {
          position: absolute;
          z-index: 3;
          pointer-events: none;
          background: var(--leadership-line-soft);
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
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
          padding: 14px 14px 14px 0;
          border-right: 2px solid var(--leadership-line-soft);
          border-bottom: 2px solid var(--leadership-line-soft);
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
            rgb(255 92 52 / 10%) 18%,
            rgb(255 92 52 / 34%) 44%,
            rgb(255 219 194 / 48%) 52%,
            rgb(255 92 52 / 24%) 64%,
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
          width: 42px;
          height: 42px;
          place-items: center;
          color: var(--leadership-ink);
        }

        .leadership-capability:nth-child(even) .leadership-capability-icon {
          color: var(--leadership-orange);
        }

        .leadership-capability h3 {
          position: relative;
          z-index: 2;
          margin: 0;
          color: var(--leadership-ink);
          font-size: 13px;
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
          font-size: 12px;
          font-weight: 600;
          line-height: 1.35;
        }

        .leadership-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: auto;
          padding-top: 18px;
        }

        .leadership-cta {
          position: relative;
          min-height: 48px;
          overflow: hidden;
          border: 0;
          border-radius: 999px;
          background: var(--leadership-orange);
          padding: 0 10px 0 22px;
          color: white;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 34%),
            0 16px 34px rgb(255 92 52 / 20%);
        }

        .leadership-cta:hover {
          background: oklch(0.58 0.2 35);
        }

        .leadership-cta span {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 2px solid rgb(255 255 255 / 72%);
          border-radius: 999px;
        }

        .leadership-cta span svg {
          transition: transform 220ms ease;
        }

        .leadership-cta:hover span svg {
          transform: translateX(2px) rotate(10deg);
        }

        .leadership-license {
          margin: 0;
          color: rgb(45 70 64 / 76%);
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
          border-left: 2px solid var(--leadership-line-soft);
          background: rgb(255 253 247 / 36%);
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
            linear-gradient(90deg, rgb(255 253 247 / 82%) 0%, transparent 22%),
            linear-gradient(180deg, rgb(255 253 247 / 74%) 0%, transparent 20%, transparent 78%, rgb(250 244 235 / 70%) 100%);
          content: "";
        }

        .leadership-visual-panel img {
          object-fit: cover;
          object-position: 56% 52%;
          mix-blend-mode: multiply;
          will-change: filter, transform;
        }

        .leadership-visual-grid {
          inset: 0;
          z-index: 3;
          background-image:
            linear-gradient(90deg, rgb(55 91 99 / 15%) 1px, transparent 1px),
            linear-gradient(180deg, rgb(55 91 99 / 15%) 1px, transparent 1px),
            radial-gradient(circle, rgb(8 45 35 / 18%) 1px, transparent 1.5px);
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
            rgb(255 253 247 / 72%) 42%,
            rgb(255 92 52 / 16%) 56%,
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
        }

        .leadership-proof-card {
          position: relative;
          display: grid;
          min-height: 0;
          grid-template-columns: 56px minmax(0, 1fr);
          gap: 16px;
          align-content: center;
          border: 0;
          border-bottom: 2px solid var(--leadership-line-soft);
          border-radius: 0;
          background:
            radial-gradient(circle at 84% 10%, rgb(255 255 251 / 64%), transparent 10rem),
            rgb(255 253 247 / 68%);
          padding: 16px 20px;
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
          background: linear-gradient(90deg, transparent, var(--leadership-orange), transparent);
          transform: scaleX(0);
          transform-origin: left center;
          opacity: 0;
          will-change: opacity, transform;
        }

        .leadership-proof-card:last-child {
          border-bottom: 0;
        }

        .leadership-proof-card::after {
          position: absolute;
          top: 16px;
          right: 18px;
          color: rgb(20 43 36 / 16%);
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
          content: attr(data-proof-index);
        }

        .leadership-proof-icon {
          display: grid;
          width: 56px;
          height: 56px;
          place-items: center;
          border: 2px solid rgb(8 45 35 / 17%);
          border-radius: 8px;
          color: var(--leadership-ink);
          background: rgb(255 253 247 / 68%);
        }

        .leadership-proof-card:nth-child(even) .leadership-proof-icon {
          color: var(--leadership-blueprint);
        }

        .leadership-proof-value {
          display: block;
          color: var(--leadership-ink);
          font-family: var(--about-display);
          font-size: 46px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }

        .leadership-proof-label {
          display: block;
          margin-top: 6px;
          color: var(--leadership-orange);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .leadership-proof-card:nth-child(even) .leadership-proof-label {
          color: var(--leadership-blueprint);
        }

        .leadership-proof-detail {
          grid-column: 2;
          margin: 7px 0 0;
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
          border-top: 2px solid var(--leadership-line);
          background: rgb(255 253 247 / 56%);
          padding: 12px 22px;
        }

        .leadership-quote {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 16px;
          align-items: center;
          margin: 0;
          color: var(--leadership-ink);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 13px;
          font-weight: 650;
          line-height: 1.35;
        }

        .leadership-quote [data-leadership-quote-mark] {
          color: var(--leadership-orange);
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
          border-left: 2px solid var(--leadership-line-soft);
          padding: 0 16px;
          color: var(--leadership-ink);
          font-size: 10px;
          font-weight: 900;
          line-height: 1.16;
        }

        @media (max-width: 1400px) {
          .leadership-shell {
            padding: 24px;
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
            border-bottom: 2px solid var(--leadership-line-soft);
          }

          .leadership-proof-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .leadership-proof-card {
            min-height: 0;
            grid-template-columns: minmax(0, 1fr);
            border-right: 2px solid var(--leadership-line-soft);
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
            padding: 30px 22px;
          }

          .leadership-shell::before,
          .leadership-shell::after,
          .leadership-frame::before,
          .leadership-frame::after {
            display: none;
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
            border-width: 2px;
          }

          .leadership-main-panel {
            grid-template-columns: 1fr;
          }

          .leadership-copy-panel {
            padding: 32px 24px 28px;
          }

          .leadership-title {
            max-width: 620px;
            font-size: 58px;
          }

          .leadership-visual-panel {
            min-height: 390px;
            border-top: 2px solid var(--leadership-line-soft);
            border-left: 0;
            order: -1;
          }

          .leadership-visual-panel::before {
            background:
              linear-gradient(180deg, rgb(255 253 247 / 40%) 0%, transparent 18%, transparent 76%, rgb(250 244 235 / 76%) 100%),
              linear-gradient(90deg, rgb(255 253 247 / 64%) 0%, transparent 22%);
          }

          .leadership-proof-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .leadership-proof-card:nth-child(2) {
            border-right: 0;
          }

          .leadership-proof-card:nth-child(-n + 2) {
            border-bottom: 2px solid var(--leadership-line-soft);
          }

          .leadership-footer {
            grid-template-columns: 1fr;
          }

          .leadership-commitments {
            justify-content: flex-start;
          }

          .leadership-commitment {
            border-left: 0;
            border-right: 2px solid var(--leadership-line-soft);
            padding: 0 16px 0 0;
          }
        }

        @media (max-width: 720px) {
          .leadership-shell {
            padding: 28px 16px;
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
            padding: 26px 18px 24px;
          }

          .leadership-title {
            font-size: 44px;
          }

          .leadership-summary {
            font-size: 14px;
          }

          .leadership-visual-panel {
            min-height: 280px;
          }

          .leadership-capabilities,
          .leadership-proof-grid {
            grid-template-columns: 1fr;
          }

          .leadership-capability {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 12px;
            padding: 15px 12px 15px 0;
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
            border-bottom: 2px solid var(--leadership-line-soft);
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

      <div className="leadership-shell">
        <header className="leadership-header" data-leadership-header>
          <div>
            <FairlendSectionKicker
              className="leadership-kicker"
              label="Leadership"
              labelId="fairlend-leadership-title"
              labelProps={{ 'data-leadership-kicker-label': true }}
              number="05"
              numberProps={{ 'data-leadership-kicker-number': true }}
              slashProps={{ 'data-leadership-kicker-slash': true }}
            />
            <p className="leadership-intro" data-leadership-intro data-leadership-reveal>
              Deal-tested guidance for borrowers, builders, investors, and brokers who need
              disciplined capital advice before the structure gets expensive.
            </p>
          </div>

          <div
            className="leadership-header-meta"
            aria-label="Leadership section status"
            data-leadership-meta
          >
            <div className="leadership-ledger-tabs" aria-hidden="true">
              <span data-leadership-ledger-tab />
              <span data-leadership-ledger-tab />
              <span data-leadership-ledger-tab />
            </div>
            <strong>The FairLend Model</strong>
            <span>05 of 05 / principal broker / capital relationships</span>
          </div>
        </header>

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
                Principal broker
              </span>
              <h3
                className="leadership-title about-text-textured"
                data-leadership-title
              >
                <span className="leadership-title-line" data-leadership-title-line>
                  <span>Trusted guidance built</span>
                </span>
                <span className="leadership-title-line" data-leadership-title-line>
                  <span>on real deal experience.</span>
                </span>
              </h3>
              <p className="leadership-summary" data-leadership-copy-item>
                FairLend combines mortgage brokerage discipline, builder-side insight, and
                practical structuring support to move financing conversations from uncertainty to a
                workable capital plan.
              </p>

              <div className="leadership-capabilities" aria-label="Leadership capabilities">
                {capabilities.map(({ copy, Icon, title }) => (
                  <div className="leadership-capability" data-leadership-capability key={title}>
                    <span
                      className="leadership-capability-flash"
                      aria-hidden="true"
                      data-leadership-capability-flash
                    />
                    <span
                      className="leadership-capability-icon"
                      aria-hidden="true"
                      data-leadership-capability-icon
                    >
                      <Icon size={25} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 data-leadership-capability-title>{title}</h3>
                      <p data-leadership-capability-copy>{copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="leadership-actions" data-leadership-actions>
                <Button asChild className="leadership-cta" size="clear">
                  <Link href="/contact" data-leadership-cta>
                    Meet our leadership
                    <span aria-hidden="true" data-leadership-cta-arrow>
                      <ArrowRight size={21} strokeWidth={1.9} />
                    </span>
                  </Link>
                </Button>
                <p className="leadership-license">Mortgage brokerage & investment leadership</p>
              </div>
            </div>

            <div className="leadership-visual-panel" aria-hidden="true" data-leadership-visual>
              <Image
                alt=""
                decoding="async"
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, (max-width: 1400px) 54vw, 42vw"
                src={leadershipAsset}
              />
              <span className="leadership-visual-grid" data-leadership-visual-grid />
              <span className="leadership-visual-sweep" data-leadership-visual-sweep />
            </div>
          </article>

          <aside
            className="leadership-proof-grid"
            aria-label="Leadership proof points"
            data-leadership-proof-grid
          >
            {leadershipProof.map(({ detail, Icon, label, value }, index) => (
              <Card
                className="leadership-proof-card"
                data-leadership-proof-card
                data-proof-index={String(index + 2).padStart(2, '0')}
                key={label}
                render={<div />}
              >
                <span
                  className="leadership-proof-pulse"
                  aria-hidden="true"
                  data-leadership-proof-pulse
                />
                <span
                  className="leadership-proof-icon"
                  aria-hidden="true"
                  data-leadership-proof-icon
                >
                  <Icon size={30} strokeWidth={1.65} />
                </span>
                <div>
                  <span
                    className="leadership-proof-value"
                    data-leadership-proof-value
                    data-proof-value-target={value}
                  >
                    {value}
                  </span>
                  <span className="leadership-proof-label" data-leadership-proof-label>
                    {label}
                  </span>
                </div>
                <p className="leadership-proof-detail" data-leadership-proof-detail>
                  {detail}
                </p>
              </Card>
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
                <span className="leadership-commitment" data-leadership-commitment key={label}>
                  <Icon aria-hidden="true" size={23} strokeWidth={1.75} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
