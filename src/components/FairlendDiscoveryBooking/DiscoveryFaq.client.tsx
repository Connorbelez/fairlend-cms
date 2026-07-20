'use client'

import { ArrowUpRight } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import type { DiscoveryFaqItem } from './config'
import { BookingAnchorLink } from './BookingAnchorLink.client'
import styles from './discovery-booking.module.css'

type DiscoveryFaqProps = {
  bookingHref: string
  ctaLabel: string
  featuredId: string
  intro: string
  items: DiscoveryFaqItem[]
}

export function DiscoveryFaq({
  bookingHref,
  ctaLabel,
  featuredId,
  intro,
  items,
}: DiscoveryFaqProps) {
  return (
    <div className={styles.faqContent}>
      <p className={styles.faqIntro}>{intro}</p>
      <Accordion className={styles.faqList} collapsible defaultValue={featuredId} type="single">
        {items.map((item) => (
          <AccordionItem className={styles.faqItem} key={item.id} value={item.id}>
            <AccordionTrigger className={styles.faqTrigger}>
              <span>{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className={styles.faqAnswer}>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <BookingAnchorLink className={styles.faqCta} href={bookingHref}>
        {ctaLabel}
        <ArrowUpRight aria-hidden="true" />
      </BookingAnchorLink>
    </div>
  )
}
