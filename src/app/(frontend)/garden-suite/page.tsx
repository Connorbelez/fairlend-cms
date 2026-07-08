import type { Metadata } from 'next'

import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendBuildPropertyTypesAssets } from '@/components/FairlendBuildPropertyTypes'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'

export const metadata: Metadata = {
  title: 'Garden Suite Eligibility Review | FairLend Mortgage',
  description:
    'Check whether the ground, property, permit path, budget, working capital, and rental assumptions can support a garden suite financing review.',
  alternates: { canonical: '/garden-suite' },
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'garden-suite-eligibility',
})

export default function GardenSuitePage() {
  return (
    <FairlendFeedbackContentPage
      config={{
        eyebrow: 'Garden suite',
        title: 'Can the ground support it?',
        subtitle:
          'A garden suite needs more than a good drawing. FairLend reviews the property, permit stage, mortgage and equity position, budget, projected rents, builder context, and GPS/site realities before the financing path is framed.',
        image: {
          ...fairlendBuildPropertyTypesAssets.singleFamily,
          alt: 'Residential lot illustration for garden suite eligibility',
        },
        primaryCta: { href: intakeHref, label: 'Start eligibility intake' },
        secondaryCta: { href: '/garden-suite-financing-gta', label: 'Financing page' },
        proof: ['Legible intake fields', 'GPS/site review', 'Universal licence footer'],
        sections: [
          {
            kicker: 'Eligibility',
            title: 'A usable form, not guesswork',
            body:
              'The eligibility intake uses visible, high-contrast fields and asks for the practical details that decide whether a garden suite file can move forward.',
            checklist: [
              'Property and ownership',
              'Mortgage and available equity',
              'Plans and permit stage',
              'Budget tied to scope',
              'Projected rents with evidence',
              'Builder context',
            ],
          },
          {
            kicker: 'Review',
            title: 'What can block the file',
            panels: [
              {
                title: 'Ground and site constraints',
                body: 'The review starts with whether the ground, access, servicing, setbacks, and site context can support the intended build.',
              },
              {
                title: 'Working capital',
                body: 'Liquidity has to survive reimbursement timing, permit drift, contingency pressure, and draw release timing.',
              },
              {
                title: 'GPS and evidence',
                body: "Site evidence stays attached even when GPS needs review. Bad coordinates should not erase useful proof.",
              },
            ],
          },
        ],
        finalNote:
          'FairLend Mortgage reviews garden suite files with the same legal-name, licence, and privacy disclosure carried through the shared site footer.',
      }}
    />
  )
}
