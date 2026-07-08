import { FairlendFeedbackContentPage } from '@/components/FairlendFeedbackContentPage'
import { fairlendRouteSelectorAssets } from '@/components/FairlendRouteSelector/assets'
import { FairlendServiceSeo } from '@/components/SEO/FairlendRouteSeo'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { buildFairlendMetadata } from '@/utilities/seo'

const pageDescription =
  'FairLend uses DrawFlow to organize roadmaps, draw requests, milestone proof, lender review, admin approval, and release records.'

export const metadata = buildFairlendMetadata({
  description: pageDescription,
  path: '/construction-draw-financing',
  title: 'Construction Draw Financing | DrawFlow',
})

const serviceSeo = {
  description: pageDescription,
  name: 'Construction Draw Financing',
  path: '/construction-draw-financing',
  serviceType: 'Construction draw financing',
}

const intakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'construction-draw-financing',
})

export default function ConstructionDrawFinancingPage() {
  return (
    <>
      <FairlendServiceSeo {...serviceSeo} />
      <FairlendFeedbackContentPage
        config={{
          eyebrow: 'Construction draw financing',
          title: 'One place for roadmaps, draws and proof',
          subtitle:
            'DrawFlow keeps the promise narrow on purpose: work first, evidence next, review after that, and fund release only once approved.',
          image: {
            ...fairlendRouteSelectorAssets.constructionBuilding,
            alt: 'Construction draw financing process illustration',
          },
          primaryCta: { href: intakeHref, label: 'Start draw review' },
          secondaryCta: {
            href: '/resources/construction-draws-small-builders',
            label: 'Read builder guide',
          },
          proof: ['Work first', 'Evidence next', 'Admin approval'],
          sections: [
            {
              kicker: 'Draw logic',
              title: 'How a draw should move',
              checklist: [
                'Milestone scope is completed before a draw is requested',
                'Photos, invoices, notes, and location data stay attached to the request',
                'The file moves through review after evidence is attached',
                'Final approval rests with the lender. Interest begins accruing on the draw only once the funds are released',
              ],
            },
            {
              kicker: 'Control plane',
              title: 'Roadmaps, draws and proof together',
              body: 'Capital decisions get harder to trust when the file is scattered. One view of the roadmap, draws, evidence, and site status keeps the decision whole.',
              panels: [
                {
                  title: 'Milestone rail',
                  body: "See every milestone's status at a glance — done, blocked, evidenced, or approved.",
                },
                {
                  title: 'Draw groups',
                  body: 'Shows which completed milestones get funded together in a single draw.',
                },
                {
                  title: 'Budget revisions',
                  body: 'Every budget revision is saved. The last approved version is never overwritten.',
                },
                {
                  title: 'Audit events',
                  body: 'Every override and release is logged — who did it, their role, the time, what changed, and why. Nothing moves without a record.',
                },
              ],
            },
            {
              kicker: 'GPS review',
              title: "PROOF STAYS ATTACHED — EVEN WHEN GPS DOESN'T",
              body: "Field reality is messy. GPS drops, signals fail, sites are dead zones. DrawFlow keeps the evidence package intact regardless, flags it clearly when location can't be verified, and moves it to staff review, a site visit, or admin sign-off. Bad coordinates never cost you the proof.",
              checklist: [
                'A failed location check never deletes your proof',
                'Unverified locations get escalated to a lender or admin, not auto-rejected.',
                'Verified work stays on record through every review.',
                'Connected systems update automatically. No one re-keys the same status twice.',
              ],
            },
          ],
          finalNote:
            'Contact FairLend Mortgage when draw timing, evidence, working capital, and release authority need to be organized before the next funding request.',
        }}
      />
    </>
  )
}
