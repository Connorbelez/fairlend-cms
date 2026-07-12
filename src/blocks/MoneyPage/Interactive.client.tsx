'use client'

import { ArrowRight, Check, Plus } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type {
  MoneyPageAction,
  MoneyPageDisclosureItem,
  MoneyPageFAQItem,
  MoneyPageRichText,
} from './types'

const RevealedCopy = ({ data }: { data?: MoneyPageRichText }) =>
  data ? (
    <RichText
      className="money-page-prose money-page-disclosure__prose max-w-none"
      data={data}
      enableGutter={false}
    />
  ) : null

const RevealedActions = ({ actions }: { actions?: MoneyPageAction[] | null }) => {
  if (!actions?.length) return null

  return (
    <div className="money-page-actions">
      {actions.map(({ id, link }) =>
        link ? (
          <CMSLink
            {...link}
            appearance="inline"
            className="money-page-action is-secondary"
            key={id || link.label}
          >
            <ArrowRight aria-hidden="true" />
          </CMSLink>
        ) : null,
      )}
    </div>
  )
}

const RevealedPanel = ({ item }: { item: MoneyPageDisclosureItem }) => (
  <div className="money-page-disclosure__panel">
    <div className="money-page-disclosure__copy">
      <h3>{item.title}</h3>
      <RevealedCopy data={item.body} />
      {item.signal ? (
        <p className="money-page-disclosure__signal">
          <Check aria-hidden="true" /> {item.signal}
        </p>
      ) : null}
      <RevealedActions actions={item.links} />
    </div>
    {item.media ? (
      <Media
        className="money-page-media money-page-disclosure__media"
        fill
        imgClassName="money-page-media__asset"
        pictureClassName="money-page-media__picture"
        resource={item.media}
        videoClassName="money-page-media__asset"
        videoOptions={{ autoPlay: false, controls: true, loop: false, muted: false }}
      />
    ) : null}
  </div>
)

export function MoneyPageDisclosure({
  items,
  openFirst = true,
  variant,
}: {
  items: MoneyPageDisclosureItem[]
  openFirst?: boolean | null
  variant?: string | null
}) {
  if (!items.length) return null

  if (variant === 'accordion') {
    return (
      <Accordion
        className="money-page-accordion"
        defaultValue={openFirst ? items[0]?.id || 'item-0' : undefined}
        type="single"
        collapsible
      >
        {items.map((item, index) => {
          const value = item.id || `item-${index}`
          return (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>
                <span>
                  <small>{item.label}</small>
                  <strong>{item.title}</strong>
                </span>
              </AccordionTrigger>
              <AccordionContent forceMount>
                <RevealedPanel item={item} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    )
  }

  const defaultValue = items[0]?.id || 'item-0'

  return (
    <Tabs
      className={variant === 'decisionPath' ? 'money-page-tabs is-decision-path' : 'money-page-tabs'}
      defaultValue={defaultValue}
      orientation={variant === 'decisionPath' ? 'vertical' : 'horizontal'}
    >
      <TabsList aria-label="Choose a view">
        {items.map((item, index) => {
          const value = item.id || `item-${index}`
          return (
            <TabsTrigger key={value} value={value}>
              {variant === 'decisionPath' ? <ArrowRight aria-hidden="true" /> : null}
              <span>{item.label}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>
      <div className="money-page-tabs__panels">
        {items.map((item, index) => {
          const value = item.id || `item-${index}`
          return (
            <TabsContent forceMount key={value} value={value}>
              <RevealedPanel item={item} />
            </TabsContent>
          )
        })}
      </div>
    </Tabs>
  )
}

export function MoneyPageFAQ({
  items,
  openFirst = true,
  variant,
}: {
  items: MoneyPageFAQItem[]
  openFirst?: boolean | null
  variant?: string | null
}) {
  if (!items.length) return null

  return (
    <div
      className={variant === 'compactLedger' ? 'money-page-faq-list is-compact' : 'money-page-faq-list'}
    >
      {items.map((item, index) => {
        const value = item.id || `faq-${index}`
        return (
          <details key={value} open={Boolean(openFirst && index === 0)}>
            <summary>
              <span className="money-page-faq-list__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="money-page-faq-list__question">{item.question}</span>
              <Plus aria-hidden="true" className="money-page-faq-list__plus" />
            </summary>
            <div className="money-page-faq-list__answer">
              <RevealedCopy data={item.answer} />
            </div>
          </details>
        )
      })}
    </div>
  )
}
