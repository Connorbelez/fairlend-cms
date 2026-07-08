/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check } from 'lucide-react'

import { FairlendSectionKicker, FairlendSectionRule } from '@/components/FairlendSectionKicker'
import '@/components/FairlendServicesSection/services-section-density.css'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type PaperSectionProps = ComponentPropsWithoutRef<'section'> & DataAttributes
type PaperShellProps = ComponentPropsWithoutRef<'div'> & DataAttributes

export function FairlendPaperSection({ className, ...props }: PaperSectionProps): ReactElement {
  return <section className={cn(className)} {...props} />
}

export function FairlendPaperShell({ className, ...props }: PaperShellProps): ReactElement {
  return <div className={cn(className)} {...props} />
}

export function FairlendLedgerTabs({
  className,
  count = 3,
  tabClassName,
  tabProps,
}: {
  className: string
  count?: number
  tabClassName?: string
  tabProps?: DataAttributes
}): ReactElement {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span className={tabClassName} key={index} {...tabProps} />
      ))}
    </div>
  )
}

export function FairlendHeaderMeta({
  className,
  detail,
  label,
  tabsClassName,
  tabClassName,
  tabProps,
  ...props
}: ComponentPropsWithoutRef<'div'> &
  DataAttributes & {
    detail: string
    label: string
    tabsClassName: string
    tabClassName?: string
    tabProps?: DataAttributes
  }): ReactElement {
  return (
    <div className={className} {...props}>
      <FairlendLedgerTabs
        className={tabsClassName}
        tabClassName={tabClassName}
        tabProps={tabProps}
      />
      <strong>{label}</strong>
      <span>{detail}</span>
    </div>
  )
}

export function FairlendServicesModelHeader({
  stepStyle,
}: {
  stepStyle: CSSProperties
}): ReactElement {
  return (
    <header className="services-model-header">
      <div className="services-model-header-content">
        <div className="services-model-brand services-reveal" data-services-brand style={stepStyle}>
          <span data-services-logo>The FairLend Model</span>
          <span className="services-model-brand__count" data-services-established>
            01 of 03
          </span>
        </div>
        <FairlendSectionKicker
          className="about-kicker-who"
          label="Our Services"
          labelId="fairlend-services-title"
          labelProps={{
            'data-services-title-label': true,
            'data-services-title-word': true,
          }}
          number="01"
          numberProps={{
            'data-services-title-number': true,
            'data-services-title-word': true,
          }}
          slashProps={{ 'data-services-title-slash': true }}
        />
        <p className="services-model-copy" data-services-copy-line>
          Four specialized desks. One integrated model. Flexible capital solutions for every stage
          of real estate.
        </p>
      </div>

      <FairlendLedgerTabs
        className="services-header-ledger__tabs"
        tabClassName="services-header-ledger__tab"
        tabProps={{ 'data-services-tab': true }}
      />

      <div className="services-model-skyline" data-services-map aria-hidden="true">
        <Image
          alt=""
          className="h-full w-full object-contain object-right-bottom"
          decoding="async"
          fill
          loading="lazy"
          sizes="(max-width: 1180px) 90vw, 58vw"
          src="/assets/about-webp/webp/toronto-skyline-sketch-optimized.webp"
        />
      </div>
    </header>
  )
}

export type FairlendServiceCardData = {
  number: string
  code: string
  kicker: string
  title: string
  image: string
  icon: ElementType
  footer: string
  motion: 'investment' | 'mortgage' | 'construction' | 'partners'
}

export function FairlendServiceModelCard({
  bulletBase,
  bullets,
  colDelay,
  index,
  lineDelayStyle,
  service,
  stepStyle,
}: {
  bulletBase: number
  bullets: readonly string[]
  colDelay: number
  index: number
  lineDelayStyle: (ms: number) => CSSProperties
  service: FairlendServiceCardData
  stepStyle: CSSProperties
}): ReactElement {
  const Icon = service.icon

  return (
    <article
      className="services-model-panel services-reveal"
      data-services-card
      data-services-card-motion={service.motion}
      style={stepStyle}
    >
      {index > 0 && (
        <span
          className="services-line-x services-model-panel-rule--mobile"
          data-services-line-x
          style={lineDelayStyle(colDelay)}
        />
      )}
      {index % 2 === 1 && (
        <span
          className="services-line-y services-model-panel-rule--desktop-y"
          data-services-line-y
          style={lineDelayStyle(colDelay)}
        />
      )}
      {index >= 2 && (
        <span
          className="services-line-x services-model-panel-rule--desktop-x"
          data-services-line-x
          style={lineDelayStyle(colDelay)}
        />
      )}

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

      <div className="services-model-panel-copy">
        <div className="services-card-topline">
          <span className="services-card-icon-box" data-services-icon-box>
            <Icon aria-hidden="true" className="size-[58%]" data-services-icon strokeWidth={1.7} />
          </span>
          <span>
            <span className="services-card-stamp" data-services-kicker>
              {service.kicker}
            </span>
            <span className="services-model-stamp-line" aria-hidden="true" />
          </span>
        </div>

        <h3 className="services-card-title" data-services-card-title>
          {service.title}
        </h3>

        <ul className="services-card-bullets">
          {bullets.map((bullet, bulletIndex) => (
            <li
              key={bullet}
              className="services-card-bullet services-reveal flex"
              data-services-bullet
              style={{ '--i': bulletBase + bulletIndex } as CSSProperties}
            >
              <Check aria-hidden="true" className="shrink-0" strokeWidth={2} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="services-card-media-shell" data-services-media-shell>
        <Image
          alt=""
          decoding="async"
          fill
          loading="lazy"
          sizes="(max-width: 860px) 82vw, (max-width: 1180px) 42vw, 22vw"
          src={service.image}
          data-services-media
        />
      </div>

      <div className="services-card-number-plate" data-services-number-plate>
        <span data-services-number>{service.number}</span>
        <span className="services-card-code" data-services-code>
          {service.code}
        </span>
      </div>

      <span className="sr-only" data-services-cta-label>
        {service.footer}
      </span>
      <ArrowRight aria-hidden="true" className="sr-only" data-services-arrow />
    </article>
  )
}

export function FairlendExpertisePanel({
  items,
}: {
  items: readonly {
    copy: string
    Icon: LucideIcon
    title: string
  }[]
}): ReactElement {
  return (
    <Card
      className="about-expertise-panel"
      data-about-expertise-panel
      data-about-reveal
      render={<aside aria-label="FairLend operating principles" />}
    >
      <span
        aria-hidden="true"
        className="about-expertise-corner is-top-left"
        data-about-expertise-corner
      />
      <span
        aria-hidden="true"
        className="about-expertise-corner is-top-right"
        data-about-expertise-corner
      />
      <span
        aria-hidden="true"
        className="about-expertise-corner is-bottom-left"
        data-about-expertise-corner
      />
      <span
        aria-hidden="true"
        className="about-expertise-corner is-bottom-right"
        data-about-expertise-corner
      />
      {items.map((item, index) => (
        <div
          className="about-expertise-item"
          data-about-expertise-item
          data-about-reveal="child"
          data-feature-index={String(index + 1).padStart(2, '0')}
          key={item.title}
        >
          <span aria-hidden="true" className="about-expertise-icon" data-about-expertise-icon>
            <item.Icon />
          </span>
          <div>
            <h3 className="about-text-textured">{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        </div>
      ))}
    </Card>
  )
}

export function FairlendFinanceCard({
  copy,
  href,
  icon,
  label,
  tag,
  title,
  index,
}: {
  copy: ReactNode
  href: string
  icon: string
  index: number
  label: string
  tag: string
  title: ReactNode
}): ReactElement {
  return (
    <Card
      className="about-finance-card"
      data-about-finance-card
      data-about-reveal
      data-finance-index={String(index + 1).padStart(2, '0')}
      render={<a aria-label={`${label} - learn more`} href={href} />}
    >
      <img
        alt=""
        data-about-finance-icon
        decoding="async"
        draggable={false}
        height={512}
        src={icon}
        width={512}
      />
      <div data-about-finance-copy>
        <span className="about-finance-tag" data-about-finance-tag>
          {tag}
        </span>
        <h3 className="about-text-textured" data-about-finance-title>
          {title}
        </h3>
        <p data-about-finance-description>{copy}</p>
      </div>
      <ArrowRight aria-hidden="true" data-about-finance-arrow />
    </Card>
  )
}

export function FairlendLeadershipHeader(): ReactElement {
  return (
    <>
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
            Principal-broker judgment for borrowers, builders, investors, and brokers who need a
            disciplined capital plan before the structure gets expensive.
          </p>
        </div>

        <FairlendHeaderMeta
          aria-label="Leadership section status"
          className="leadership-header-meta"
          data-leadership-meta
          detail="05 of 05 / principal broker / capital relationships"
          label="The FairLend Model"
          tabsClassName="leadership-ledger-tabs"
          tabProps={{ 'data-leadership-ledger-tab': true }}
        />
      </header>
      <FairlendSectionRule className="leadership-section-rule" />
    </>
  )
}

export function FairlendLeadershipCapabilityCard({
  copy,
  Icon,
  title,
}: {
  copy: string
  Icon: LucideIcon
  title: string
}): ReactElement {
  return (
    <div className="leadership-capability" data-leadership-capability>
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
  )
}

export function FairlendLeadershipProofCard({
  detail,
  disclaimer,
  Icon,
  label,
  qualifier,
  value,
}: {
  detail: string
  disclaimer?: string
  Icon: LucideIcon
  label: string
  qualifier?: string
  value: string
}): ReactElement {
  return (
    <Card
      className="leadership-proof-card"
      data-leadership-proof-card
      render={<div />}
    >
      <span className="leadership-proof-pulse" aria-hidden="true" data-leadership-proof-pulse />
      <span className="leadership-proof-icon" aria-hidden="true" data-leadership-proof-icon>
        <Icon size={30} strokeWidth={1.65} />
      </span>
      <div>
        <span className="inline-flex items-start">
          <span
            className="leadership-proof-value"
            data-leadership-proof-value
            data-proof-value-target={value}
          >
            {value}
          </span>
          {qualifier ? (
            <sup className="ml-[2px] mt-[2px] text-[10px] leading-none font-bold text-current">
              {qualifier}
            </sup>
          ) : null}
        </span>
        <span className="leadership-proof-label" data-leadership-proof-label>
          {label}
        </span>
      </div>
      <p className="leadership-proof-detail" data-leadership-proof-detail>
        {detail}
        {disclaimer ? (
          <small className="mt-[3px] block text-[8px] leading-[1.05] font-semibold text-current opacity-60">
            {disclaimer}
          </small>
        ) : null}
      </p>
    </Card>
  )
}

export function FairlendLeadershipCommitment({
  Icon,
  label,
}: {
  Icon: LucideIcon
  label: string
}): ReactElement {
  return (
    <span className="leadership-commitment" data-leadership-commitment>
      <Icon aria-hidden="true" size={23} strokeWidth={1.75} />
      {label}
    </span>
  )
}
