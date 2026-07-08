'use client'

import { useState } from 'react'
import type { ReactElement } from 'react'
import { Minus, Plus } from 'lucide-react'

import { cn } from '@/utilities/ui'

import './investor-faq.css'

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type FaqGroup = {
  id: string
  title: string
  items: readonly FaqItem[]
}

export function FaqAccordion({
  groups,
}: {
  groups: readonly FaqGroup[]
}): ReactElement {
  const [openId, setOpenId] = useState<string | null>(groups[0]?.items[0]?.id ?? null)

  return (
    <div className="investor-faq__groups">
      {groups.map((group) => (
        <div className="investor-faq__group" key={group.id}>
          <h3 className="investor-faq__group-title">{group.title}</h3>
          <ul className="investor-faq__list">
            {group.items.map((item) => {
              const isOpen = openId === item.id
              return (
                <li className="investor-faq__item" key={item.id}>
                  <button
                    aria-controls={`investor-faq-panel-${item.id}`}
                    aria-expanded={isOpen}
                    className={cn('investor-faq__question', isOpen && 'is-open')}
                    id={`investor-faq-trigger-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="investor-faq__icon">
                      {isOpen ? <Minus size={16} strokeWidth={2.25} /> : <Plus size={16} strokeWidth={2.25} />}
                    </span>
                  </button>
                  <div
                    aria-labelledby={`investor-faq-trigger-${item.id}`}
                    className={cn('investor-faq__panel', isOpen && 'is-open')}
                    id={`investor-faq-panel-${item.id}`}
                    role="region"
                  >
                    <div className="investor-faq__panel-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
