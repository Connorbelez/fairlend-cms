'use client'

import type { ReactElement } from 'react'
import { useState } from 'react'

import type { FaqSegment, FaqGroup } from './faq-data'

import './partner-program.css'

/**
 * Section 13 — FAQ.
 *
 * Segmented tabs (brokers · build ecosystem · how it works) above a classic
 * hairline-ruled accordion. Pure client state — no animation library. Reduced
 * motion respected via the CSS transition guards in partner-program.css.
 *
 * Answers per source plan §13.
 */
export function FairlendPartnerFaq({ segments }: { segments: readonly FaqSegment[] }): ReactElement {
  const [activeTab, setActiveTab] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const active = segments[activeTab] ?? segments[0]

  return (
    <section
      aria-labelledby="partner-faq-title"
      className="fairlend-partner partner-faq"
      data-fairlend-partner-faq
    >
      <div className="partner-section">
        <header className="partner-faq__header">
          <p className="partner-kicker partner-kicker--lime">Straight Answers</p>
          <h2 className="partner-display" id="partner-faq-title">
            The questions partners actually ask.
          </h2>
          <p className="partner-subhead">
            Ordered by what stops a partner from picking up the phone — the frame, the broker fear,
            eligibility, and the guarantee question — without weakening the compliance posture.
          </p>
        </header>

        {/* Tabs */}
        <div className="partner-faq__tabs" role="tablist" aria-label="FAQ audience tabs">
          {segments.map((seg, i) => (
            <button
              aria-selected={activeTab === i}
              className={`partner-faq__tab${activeTab === i ? ' partner-faq__tab--active' : ''}`}
              key={seg.id}
              onClick={() => {
                setActiveTab(i)
                setOpenId(null)
              }}
              role="tab"
              type="button"
            >
              {seg.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          aria-labelledby={`partner-faq-tab-${active.id}`}
          className="partner-faq__panel partner-faq__panel--active"
          id={`partner-faq-panel-${active.id}`}
          role="tabpanel"
        >
          {active.items.map((item: FaqGroup) => {
            const isOpen = openId === item.id
            return (
              <div
                className={`partner-faq__item${isOpen ? ' partner-faq__item--open' : ''}`}
                key={item.id}
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    aria-controls={`partner-faq-answer-${item.id}`}
                    aria-expanded={isOpen}
                    className="partner-faq__question"
                    id={`partner-faq-question-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="partner-faq__question-icon" />
                  </button>
                </h3>
                <div
                  className="partner-faq__answer"
                  id={`partner-faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`partner-faq-question-${item.id}`}
                  style={{ maxHeight: isOpen ? '400px' : '0' }}
                >
                  <div className="partner-faq__answer-inner">{item.answer}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
