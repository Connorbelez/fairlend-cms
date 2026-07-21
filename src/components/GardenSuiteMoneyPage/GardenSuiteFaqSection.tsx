import { FairlendGroupedFaq } from '@/components/FairlendBorrowerFaq'
import { JsonLd } from '@/components/SEO/JsonLd'

import { GardenSuiteSectionCta } from './GardenSuiteSectionCta'
import { GardenSuiteFaqControls } from './GardenSuiteFaqControls.client'
import { gardenSuiteFaqGroups, gardenSuiteFaqItems } from './garden-suite-faq-data'
import './garden-suite-faq.css'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: gardenSuiteFaqItems.map((item) => ({
    '@type': 'Question',
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
    name: item.question,
  })),
}

export function GardenSuiteFaqSection() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <FairlendGroupedFaq
        afterHeader={
          <>
            <GardenSuiteFaqControls />
            <nav
              aria-label="Garden Suite FAQ topics"
              className="garden-suite-faq__index"
              id="garden-suite-faq-topics"
            >
              {gardenSuiteFaqGroups.map((group, index) => (
                <a href={`#garden-suite-faq-${group.id}`} key={group.id}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{group.title}</strong>
                  <small>{group.items.length} questions</small>
                </a>
              ))}
            </nav>
          </>
        }
        groupIdPrefix="garden-suite-faq"
        groups={gardenSuiteFaqGroups}
        headingId="garden-suite-faq-title"
        id="garden-suite-faq"
        intro="Start with the decisions that determine whether the property, budget, and financing route can work. Then open the deeper files on Toronto rules, costs, construction draws, appraisal, rent, and completion."
        kicker="Garden Suite decision file"
        showGroupMeta
        sideNote="These answers are planning guidance, not a financing approval. Municipal requirements, lender conditions, appraisal conclusions, and government programs can change."
        title="Every question that can change the financing plan."
        variant="gardenSuite"
      />
      <div className="garden-suite-faq__cta-wrap">
        <GardenSuiteSectionCta
          actionLabel="Review my property and financing route"
          body="Bring the property, current mortgage, project stage, and rough budget. The first review identifies what is known, what is missing, and which financing routes deserve a closer look."
          ctaId="garden-suite-faq-assessment"
          ctaLocation="garden-suite-faq"
          heading="Turn the answers into a project-specific plan"
          headingId="garden-suite-faq-cta-title"
          href="#garden-suite-assessment"
          label="Next file"
          tone="ink"
        />
      </div>
    </>
  )
}
