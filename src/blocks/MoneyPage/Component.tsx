import { ArrowRight, Check, FileCheck2 } from 'lucide-react'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { JsonLd } from '@/components/SEO/JsonLd'
import { FairlendLandingRail } from '@/components/FairlendLandingRail'
import { cn } from '@/utilities/ui'

import { MoneyPageDisclosure, MoneyPageFAQ } from './Interactive.client'
import type {
  MoneyPageAction,
  MoneyPageBlockData,
  MoneyPageComparisonData,
  MoneyPageCTAData,
  MoneyPageDisclosureData,
  MoneyPageFAQData,
  MoneyPageFeaturesData,
  MoneyPageHeroData,
  MoneyPageMedia,
  MoneyPageMediaSplitData,
  MoneyPageNarrativeData,
  MoneyPageProcessData,
  MoneyPageProofData,
  MoneyPageRichText,
  MoneyPageSectionHeading,
  MoneyPageTexture,
} from './types'

import './money-page.css'

type MoneyPageBlockProps = MoneyPageBlockData & {
  disableInnerContainer?: boolean
}

const moneyPageBlockTypes = new Set([
  'moneyPageCTA',
  'moneyPageComparison',
  'moneyPageDisclosure',
  'moneyPageFAQ',
  'moneyPageFeatures',
  'moneyPageHero',
  'moneyPageMediaSplit',
  'moneyPageNarrative',
  'moneyPageProcess',
  'moneyPageProof',
])

export const isMoneyPageBlockType = (blockType?: string | null): boolean =>
  Boolean(blockType && moneyPageBlockTypes.has(blockType))

const RichCopy = ({ className, data }: { className?: string; data?: MoneyPageRichText }) =>
  data ? (
    <RichText
      className={cn('money-page-prose max-w-none', className)}
      data={data}
      enableGutter={false}
    />
  ) : null

const SectionHeading = ({
  className,
  heading,
  intro,
  systemLabel,
}: MoneyPageSectionHeading & { className?: string }) => (
  <header className={cn('money-page-heading', className)}>
    {systemLabel ? <p className="money-page-system-label">{systemLabel}</p> : null}
    <h2>{heading}</h2>
    <RichCopy className="money-page-heading__intro" data={intro} />
  </header>
)

const Actions = ({ actions, className }: { actions?: MoneyPageAction[] | null; className?: string }) => {
  if (!actions?.length) return null

  return (
    <div className={cn('money-page-actions', className)}>
      {actions.map(({ id, link }, index) =>
        link ? (
          <CMSLink
            {...link}
            appearance="inline"
            className={cn('money-page-action', index === 0 ? 'is-primary' : 'is-secondary')}
            key={id || `${link.label}-${index}`}
          >
            {index === 0 ? <ArrowRight aria-hidden="true" /> : null}
          </CMSLink>
        ) : null,
      )}
    </div>
  )
}

const EvidenceMedia = ({
  className,
  media,
  poster,
  playback = 'ambient',
}: {
  className?: string
  media?: MoneyPageMedia
  playback?: 'ambient' | 'controls'
  poster?: MoneyPageMedia
}) => {
  if (!media) return null

  return (
    <Media
      className={cn('money-page-media', className)}
      fill
      imgClassName="money-page-media__asset"
      pictureClassName="money-page-media__picture"
      resource={media}
      videoClassName="money-page-media__asset"
      videoOptions={{
        autoPlay: playback === 'ambient',
        controls: playback === 'controls',
        loop: playback === 'ambient',
        muted: playback === 'ambient',
        posterResource: poster,
      }}
    />
  )
}

const Frame = ({
  anchor,
  blockType,
  children,
  presentation,
  presentationSpacing,
  presentationSurface,
  presentationTexture,
  variant,
}: MoneyPageBlockData & { children: React.ReactNode }) => {
  const texture = (presentationTexture || presentation?.texture || 'fabric-of-squares') as MoneyPageTexture
  const surface = presentationSurface || presentation?.surface || 'paper'
  const spacing = presentationSpacing || presentation?.spacing || 'standard'

  return (
    <div
      className={cn(
        'money-page-block',
        `money-page-block--${blockType}`,
        `money-page-block--${surface}`,
        `money-page-block--${spacing}`,
      )}
      data-money-page-block={blockType}
      data-money-page-variant={variant || undefined}
      id={anchor || undefined}
    >
      <FairlendLandingRail gutterTexture={texture}>{children}</FairlendLandingRail>
    </div>
  )
}

const Hero = (props: MoneyPageHeroData) => {
  const HeadingTag = props.headingLevel === 'h2' ? 'h2' : 'h1'
  const playback = props.variant === 'mediaStatement' ? 'ambient' : 'controls'

  return (
    <Frame {...props}>
      <section
        className="money-page-shell money-page-hero"
        aria-labelledby={props.id ? `${props.id}-title` : undefined}
      >
        <div className="money-page-hero__copy">
          {props.routeLabel ? <p className="money-page-route-label">{props.routeLabel}</p> : null}
          <HeadingTag id={props.id ? `${props.id}-title` : undefined}>{props.heading}</HeadingTag>
          <RichCopy className="money-page-hero__summary" data={props.summary} />
          <Actions actions={props.links} />
          {props.proofPoints?.length ? (
            <dl className="money-page-proof-line" aria-label="At-a-glance evidence">
              {props.proofPoints.map((point, index) => (
                <div key={point.id || point.label}>
                  <dt>{point.label}</dt>
                  <dd>{point.detail}</dd>
                  {index < (props.proofPoints?.length || 0) - 1 ? <span aria-hidden="true" /> : null}
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <figure className="money-page-hero__figure">
          <EvidenceMedia media={props.media} playback={playback} />
          {props.mobileMedia ? (
            <EvidenceMedia className="money-page-hero__mobile-media" media={props.mobileMedia} playback={playback} />
          ) : null}
          <span aria-hidden="true" className="money-page-route-trace" />
          {props.mediaCaption ? <figcaption>{props.mediaCaption}</figcaption> : null}
        </figure>
      </section>
    </Frame>
  )
}

const Narrative = (props: MoneyPageNarrativeData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-narrative">
      <SectionHeading {...props} />
      <div className="money-page-narrative__body">
        <RichCopy data={props.content} />
        {props.aside || props.asideTitle ? (
          <aside className="money-page-narrative__aside">
            <span aria-hidden="true">FIELD NOTE</span>
            {props.asideTitle ? <h3>{props.asideTitle}</h3> : null}
            <RichCopy data={props.aside} />
          </aside>
        ) : null}
      </div>
      <Actions actions={props.links} />
    </section>
  </Frame>
)

const MediaSplit = (props: MoneyPageMediaSplitData) => {
  const isVideo = props.variant === 'videoLeft' || props.variant === 'videoRight'

  return (
    <Frame {...props}>
      <section className="money-page-shell money-page-media-split">
        <figure className="money-page-media-split__figure">
          <EvidenceMedia
            media={props.media}
            playback={isVideo && props.videoPlayback === 'controls' ? 'controls' : 'ambient'}
            poster={props.poster}
          />
          <span aria-hidden="true" className="money-page-media-split__registration" />
          {props.caption ? <figcaption>{props.caption}</figcaption> : null}
        </figure>
        <div className="money-page-media-split__copy">
          <SectionHeading {...props} />
          <RichCopy data={props.content} />
          {props.points?.length ? (
            <ul className="money-page-signal-list">
              {props.points.map((point) => (
                <li key={point.id || point.title}>
                  <Check aria-hidden="true" />
                  <span>
                    <strong>{point.title}</strong>
                    {point.detail ? <small>{point.detail}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <Actions actions={props.links} />
        </div>
      </section>
    </Frame>
  )
}

const Features = (props: MoneyPageFeaturesData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-features">
      <SectionHeading {...props} />
      <div className="money-page-features__list">
        {props.items?.map((item, index) => (
          <article className="money-page-feature" key={item.id || item.title}>
            <div className="money-page-feature__index" aria-hidden="true">
              {item.routeCode || String(index + 1).padStart(2, '0')}
            </div>
            <div className="money-page-feature__copy">
              <h3>{item.title}</h3>
              <RichCopy data={item.body} />
              {item.proof ? <p className="money-page-feature__proof">{item.proof}</p> : null}
              <Actions actions={item.links} />
            </div>
            {item.media ? <EvidenceMedia media={item.media} /> : null}
          </article>
        ))}
      </div>
    </section>
  </Frame>
)

const Process = (props: MoneyPageProcessData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-process">
      <SectionHeading {...props} />
      <ol className="money-page-process__route">
        {props.steps?.map((step, index) => (
          <li key={step.id || step.title}>
            <span className="money-page-process__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="money-page-process__copy">
              <h3>{step.title}</h3>
              <RichCopy data={step.body} />
              {step.proof ? <p className="money-page-process__proof">{step.proof}</p> : null}
            </div>
            {step.media ? <EvidenceMedia media={step.media} /> : null}
          </li>
        ))}
      </ol>
      <Actions actions={props.links} />
    </section>
  </Frame>
)

const Proof = (props: MoneyPageProofData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-proof">
      <SectionHeading {...props} />
      <div className="money-page-proof__dossier">
        <div className="money-page-proof__statement">
          <FileCheck2 aria-hidden="true" />
          {props.quote ? <blockquote>“{props.quote}”</blockquote> : null}
          {props.source ? (
            <div className="money-page-proof__source">
              {props.source.portrait ? <EvidenceMedia media={props.source.portrait} /> : null}
              <p>
                {props.source.name ? <strong>{props.source.name}</strong> : null}
                {[props.source.role, props.source.organization].filter(Boolean).join(' · ')}
              </p>
            </div>
          ) : null}
        </div>
        {props.outcomes?.length ? (
          <dl className="money-page-outcomes">
            {props.outcomes.map((outcome) => (
              <div key={outcome.id || `${outcome.label}-${outcome.value}`}>
                <dt>{outcome.label}</dt>
                <dd>{outcome.value}</dd>
                {outcome.context ? <small>{outcome.context}</small> : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      <Actions actions={props.links} />
    </section>
  </Frame>
)

const Comparison = (props: MoneyPageComparisonData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-comparison">
      <SectionHeading {...props} />
      <div className="money-page-comparison__scroll" role="region" aria-label={props.heading} tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Decision factor</th>
              {props.columns?.map((column) => (
                <th className={column.recommended ? 'is-recommended' : undefined} key={column.id || column.title} scope="col">
                  {column.recommended ? <span>Likely fit</span> : null}
                  <strong>{column.title}</strong>
                  {column.summary ? <small>{column.summary}</small> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.criteria?.map((criterion) => (
              <tr key={criterion.id || criterion.label}>
                <th scope="row">{criterion.label}</th>
                {props.columns?.map((column, index) => (
                  <td className={column.recommended ? 'is-recommended' : undefined} key={column.id || index}>
                    {criterion.values?.[index]?.value || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Actions actions={props.links} />
    </section>
  </Frame>
)

const FAQ = (props: MoneyPageFAQData) => {
  const faqData = props.items?.map((item) => ({
    '@type': 'Question',
    acceptedAnswer: {
      '@type': 'Answer',
      text: extractLexicalText(item.answer),
    },
    name: item.question,
  }))

  return (
    <Frame {...props}>
      <section className="money-page-shell money-page-faq">
        {props.enableStructuredData && faqData?.length ? (
          <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqData }} />
        ) : null}
        <SectionHeading {...props} />
        <MoneyPageFAQ items={props.items || []} openFirst={props.openFirst} variant={props.variant} />
      </section>
    </Frame>
  )
}

const CTA = (props: MoneyPageCTAData) => (
  <Frame {...props}>
    <section className="money-page-shell money-page-cta">
      <div className="money-page-cta__copy">
        <SectionHeading {...props} />
        <RichCopy data={props.body} />
        <Actions actions={props.links} />
      </div>
      <div className="money-page-cta__evidence">
        {props.media ? <EvidenceMedia media={props.media} /> : null}
        {props.trustNotes?.length ? (
          <ul>
            {props.trustNotes.map((item) => (
              <li key={item.id || item.note}>
                <Check aria-hidden="true" /> {item.note}
              </li>
            ))}
          </ul>
        ) : null}
        {props.disclosure ? <p className="money-page-cta__disclosure">{props.disclosure}</p> : null}
      </div>
    </section>
  </Frame>
)

export const MoneyPageBlock: React.FC<MoneyPageBlockProps> = (props) => {
  switch (props.blockType) {
    case 'moneyPageHero':
      return <Hero {...(props as MoneyPageHeroData)} />
    case 'moneyPageNarrative':
      return <Narrative {...(props as MoneyPageNarrativeData)} />
    case 'moneyPageMediaSplit':
      return <MediaSplit {...(props as MoneyPageMediaSplitData)} />
    case 'moneyPageFeatures':
      return <Features {...(props as MoneyPageFeaturesData)} />
    case 'moneyPageProcess':
      return <Process {...(props as MoneyPageProcessData)} />
    case 'moneyPageProof':
      return <Proof {...(props as MoneyPageProofData)} />
    case 'moneyPageComparison':
      return <Comparison {...(props as MoneyPageComparisonData)} />
    case 'moneyPageDisclosure':
      const disclosureProps = props as MoneyPageDisclosureData
      return (
        <Frame {...disclosureProps}>
          <section className="money-page-shell money-page-disclosure">
            <SectionHeading {...disclosureProps} />
            <MoneyPageDisclosure
              items={disclosureProps.items || []}
              openFirst={disclosureProps.openFirst}
              variant={disclosureProps.variant}
            />
          </section>
        </Frame>
      )
    case 'moneyPageFAQ':
      return <FAQ {...(props as MoneyPageFAQData)} />
    case 'moneyPageCTA':
      return <CTA {...(props as MoneyPageCTAData)} />
    default:
      return null
  }
}

const extractLexicalText = (value?: MoneyPageRichText): string => {
  if (!value || typeof value !== 'object') return ''

  const visit = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const record = node as Record<string, unknown>
    const ownText = typeof record.text === 'string' ? record.text : ''
    const childText = Array.isArray(record.children) ? record.children.map(visit).join(' ') : ''
    const rootText = record.root ? visit(record.root) : ''
    return [ownText, childText, rootText].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
  }

  return visit(value)
}
