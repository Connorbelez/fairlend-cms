import Image from 'next/image'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react'

import { FairlendBorrowerCta } from '@/components/FairlendBorrowerCta'
import {
  FairlendEditorialReview,
  type FairlendEditorialSource,
} from '@/components/SEO/FairlendEditorialReview'
import {
  FairlendGeoAnswerBlock,
  type FairlendGeoAnswerBlockProps,
} from '@/components/SEO/FairlendGeoAnswerBlock'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export type FeedbackPagePanel = {
  title: string
  body?: ReactNode
  items?: readonly ReactNode[]
}

export type FeedbackPageSection = {
  kicker?: string
  title: string
  body?: ReactNode
  panels?: readonly FeedbackPagePanel[]
  checklist?: readonly ReactNode[]
  /** Section anchor id (e.g. for proof-chip or methodology deep links). */
  id?: string
  /** Free-form server-rendered section body for mixed locked copy that
   *  does not fit the typed panel/checklist/steps/table/faq shapes. */
  content?: ReactNode
  /** Numbered process or mechanism stages. */
  steps?: readonly FeedbackPagePanel[]
  /** Accessible comparison or evidence table. */
  table?: FeedbackPageTable
  /** Visible-HTML question register. Never emits FAQPage structured data. */
  faq?: readonly FeedbackPageFaqItem[]
  /** Inline section-level conversion action. */
  cta?: FeedbackPageSectionCta
}

export type FeedbackPageTableRow = {
  label: ReactNode
  values: readonly ReactNode[]
}

export type FeedbackPageTable = {
  /** Anchor id for deep links to this table. */
  id?: string
  caption: string
  /** Header for the row-label column. Defaults to "Factor". */
  labelHeader?: string
  columns: readonly string[]
  rows: readonly FeedbackPageTableRow[]
  /** Disclosure or methodology note rendered directly below the table. */
  note?: ReactNode
}

export type FeedbackPageFaqItem = {
  question: string
  answer: ReactNode
}

export type FeedbackPageSectionCta = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
  /** Optional secondary action rendered beside the primary CTA. */
  secondary?: {
    label: string
    href: string
  }
}

export type FeedbackPageConfig = {
  eyebrow: string
  title: ReactNode
  subtitle: ReactNode
  image: {
    src: string
    width: number
    height: number
    alt: string
  }
  primaryCta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  /** Content rendered after the hero CTA row: supporting lines, CTA
   *  microcopy, text links and licence/trust disclosures. */
  heroFooter?: ReactNode
  proof?: readonly ReactNode[]
  geoAnswer?: FairlendGeoAnswerBlockProps
  editorial?: {
    dateModified?: string
    methodology?: string
    sources: readonly FairlendEditorialSource[]
  }
  sections: readonly FeedbackPageSection[]
  finalNote?: ReactNode
  /** Risk-reversal microcopy rendered under the final note. */
  finalMicrocopy?: ReactNode
}

export function FairlendFeedbackContentPage({ config }: { config: FeedbackPageConfig }) {
  return (
    <main className="fairlend-feedback-page min-h-svh bg-[#f8f7f5] text-[#08090a]">
      <section className="relative isolate overflow-hidden border-b border-[#d8c7b6] bg-[#fbfaf7]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.34] [background-image:linear-gradient(to_right,rgb(8_9_10/8%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(8_9_10/6%)_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div className="relative mx-auto grid w-full max-w-[1680px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:px-12 lg:py-24">
          <div className="flex max-w-[920px] flex-col justify-center">
            <p className="m-0 text-[12px] font-black tracking-[0.22em] text-[#315a12] uppercase">
              {config.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[860px] font-serif text-[clamp(48px,8vw,118px)] leading-[0.94] font-semibold text-[#08090a]">
              {config.title}
            </h1>
            <p className="mt-7 max-w-[760px] text-[clamp(18px,2.1vw,25px)] leading-[1.34] font-semibold text-[#36433e]">
              {config.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {config.primaryCta ? (
                <FairlendBorrowerCta
                  href={config.primaryCta.href}
                  label={config.primaryCta.label}
                  size="md"
                />
              ) : null}
              {config.secondaryCta ? (
                <FairlendBorrowerCta
                  href={config.secondaryCta.href}
                  label={config.secondaryCta.label}
                  size="md"
                  variant="secondary"
                />
              ) : null}
            </div>
            {config.heroFooter ? (
              <div className="mt-6 flex max-w-[760px] flex-col gap-4">{config.heroFooter}</div>
            ) : null}
          </div>

          <aside className="relative overflow-hidden border border-[#cfc2b3] bg-white/72 p-4 shadow-[0_24px_70px_rgb(8_9_10/8%),inset_0_1px_0_rgb(255_255_255/84%)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1e6]">
              <Image
                alt={config.image.alt}
                className="object-contain p-5"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                src={config.image.src}
              />
            </div>
            {config.proof?.length ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {config.proof.map((item, index) => (
                  <div
                    className="min-h-[82px] border border-[#ded3c8] bg-[#fffdf9] p-3 text-sm font-extrabold leading-tight text-[#18352f]"
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1680px] gap-8 px-5 py-12 sm:px-8 lg:px-12">
        {config.geoAnswer ? <FairlendGeoAnswerBlock {...config.geoAnswer} /> : null}

        {config.sections.map((section, index) => (
          <section
            className={cn(
              'grid gap-7 border-b border-[#ddd1c4] pb-10 last:border-b-0',
              section.panels?.length ? 'lg:grid-cols-[minmax(260px,0.45fr)_minmax(0,1fr)]' : '',
            )}
            id={section.id}
            key={`${section.title}-${index}`}
          >
            <div className="max-w-[620px]">
              {section.kicker ? (
                <p className="m-0 mb-3 text-[11px] font-black tracking-[0.22em] text-[#315a12] uppercase">
                  {section.kicker}
                </p>
              ) : null}
              <h2 className="m-0 font-serif text-[clamp(34px,5.2vw,68px)] leading-[0.98] font-semibold text-[#08090a]">
                {section.title}
              </h2>
              {section.body ? (
                <p className="mt-5 text-[17px] leading-[1.55] font-semibold text-[#41524b]">
                  {section.body}
                </p>
              ) : null}
            </div>

            <FeedbackPageSectionVariants section={section} />
          </section>
        ))}

        {config.editorial ? <FairlendEditorialReview {...config.editorial} /> : null}

        {config.finalNote ? (
          <section className="flex flex-col gap-4 border border-[#cfc2b3] bg-[#10231f] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="m-0 max-w-[900px] text-base leading-7 font-semibold">
                {config.finalNote}
              </div>
              {config.finalMicrocopy ? (
                <p className="m-0 mt-3 max-w-[900px] text-sm leading-6 font-semibold text-[#c9d4c2]">
                  {config.finalMicrocopy}
                </p>
              ) : null}
            </div>
            {config.primaryCta ? (
              <FairlendBorrowerCta
                href={config.primaryCta.href}
                label={config.primaryCta.label}
                size="md"
              />
            ) : (
              <ArrowRight aria-hidden="true" className="size-6 shrink-0 text-[#96ec18]" />
            )}
          </section>
        ) : null}
      </div>
      <style>{`
        @media (max-width: 560px) {
          .fairlend-feedback-page h1 {
            font-size: clamp(42px, 13vw, 58px);
            line-height: 0.98;
            text-wrap: balance;
          }

          .fairlend-feedback-page h2 {
            font-size: clamp(32px, 10vw, 46px);
            line-height: 1.02;
            text-wrap: balance;
          }

          .fairlend-feedback-page a,
          .fairlend-feedback-page button {
            min-height: 44px;
          }
        }
      `}</style>
    </main>
  )
}

function FeedbackPageSectionVariants({ section }: { section: FeedbackPageSection }) {
  return (
    <>
      {section.panels?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {section.panels.map((panel) => (
            <Card
              className="rounded-none border-[#cfc2b3] bg-white/78 p-5 shadow-none"
              key={panel.title}
            >
              <div className="flex items-start gap-3">
                <FileCheck2
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-[#315a12]"
                  strokeWidth={2}
                />
                <div>
                  <h3 className="m-0 text-base font-black text-[#10231f]">{panel.title}</h3>
                  {panel.body ? (
                    <p className="mt-3 text-sm leading-6 font-semibold text-[#485750]">
                      {panel.body}
                    </p>
                  ) : null}
                </div>
              </div>
              {panel.items?.length ? (
                <ul className="mt-4 grid gap-2">
                  {panel.items.map((item, itemIndex) => (
                    <li
                      className="flex gap-2 text-sm leading-5 font-semibold text-[#485750]"
                      key={itemIndex}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-[#315a12]"
                        strokeWidth={2}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      {section.checklist?.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.checklist.map((item, itemIndex) => (
            <li
              className="flex min-h-16 items-start gap-3 border border-[#d6c9bb] bg-white/68 p-4 text-sm leading-5 font-bold text-[#243933]"
              key={itemIndex}
            >
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[#315a12]"
                strokeWidth={2}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.steps?.length ? (
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
          {section.steps.map((step, stepIndex) => (
            <li
              className="flex gap-4 border border-[#d6c9bb] bg-white/68 p-4"
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="font-serif text-3xl leading-none font-semibold text-[#315a12]"
              >
                {stepIndex + 1}
              </span>
              <div>
                <h3 className="m-0 text-base font-black text-[#10231f]">{step.title}</h3>
                {step.body ? (
                  <p className="mt-2 text-sm leading-6 font-semibold text-[#485750]">
                    {step.body}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {section.content ? (
        <div className="grid max-w-[900px] gap-5 text-[17px] leading-[1.55] font-semibold text-[#41524b]">
          {section.content}
        </div>
      ) : null}

      {section.table ? (
        <div id={section.table.id}>
          <div className="overflow-x-auto border border-[#ded3c8]">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="border-b border-[#ded3c8] bg-[#eef1e6] px-4 py-3 text-left text-xs font-extrabold tracking-[0.08em] text-[#18352f] uppercase">
                {section.table.caption}
              </caption>
              <thead className="bg-[#10231f] text-white">
                <tr>
                  <th className="px-4 py-3 font-extrabold" scope="col">
                    {section.table.labelHeader ?? 'Factor'}
                  </th>
                  {section.table.columns.map((column) => (
                    <th className="px-4 py-3 font-extrabold" key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, rowIndex) => (
                  <tr className="border-t border-[#ded3c8] align-top" key={rowIndex}>
                    <th
                      className="bg-[#f8f7f5] px-4 py-3 font-extrabold text-[#18352f]"
                      scope="row"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, valueIndex) => (
                      <td
                        className="px-4 py-3 leading-6 font-semibold text-[#485750]"
                        key={valueIndex}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {section.table.note ? (
            <div className="mt-3 border-l-2 border-[#315a12] bg-[#fffdf9] p-4 text-sm leading-6 font-semibold text-[#485750]">
              {section.table.note}
            </div>
          ) : null}
        </div>
      ) : null}

      {section.faq?.length ? (
        <div className="grid gap-6">
          {section.faq.map((item) => (
            <div key={item.question}>
              <h3 className="m-0 text-lg font-black text-[#10231f]">{item.question}</h3>
              <div className="mt-2 max-w-[76ch] text-base leading-7 font-semibold text-[#485750]">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {section.cta ? (
        <div className="flex flex-wrap items-center gap-4">
          <FairlendBorrowerCta
            href={section.cta.href}
            label={section.cta.label}
            size="md"
            variant={section.cta.variant === 'secondary' ? 'secondary' : 'primary'}
          />
          {section.cta.secondary ? (
            <FairlendBorrowerCta
              href={section.cta.secondary.href}
              label={section.cta.secondary.label}
              size="md"
              variant="secondary"
            />
          ) : null}
        </div>
      ) : null}
    </>
  )
}
