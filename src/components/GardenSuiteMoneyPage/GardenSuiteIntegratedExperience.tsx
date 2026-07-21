import Link from 'next/link'

import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'

import { GardenSuiteCoordinationChoreography } from './GardenSuiteCoordinationChoreography.client'
import styles from './GardenSuiteIntegratedExperience.module.css'
import { GardenSuiteSectionCta } from './GardenSuiteSectionCta'

const disciplines = [
  {
    detail: 'The approval, milestone draws and final mortgage are planned around the same build.',
    proof: 'Principal Broker with 28 years of mortgage-broker experience',
    title: 'Mortgage and capital',
  },
  {
    detail: 'The budget, schedule, milestones and proof of completed work stay connected.',
    proof: '30 years of build experience plus an in-house build advisory team',
    title: 'Construction advisory',
  },
  {
    detail:
      'Agreements, responsibilities and lender requirements are considered before they cause delays.',
    proof: 'In-house specialist legal team with 10+ years of experience',
    title: 'Specialist legal',
  },
] as const

export function GardenSuiteIntegratedExperience() {
  return (
    <section
      aria-labelledby="garden-integrated-experience-title"
      className={styles.section}
      id="section-4"
    >
      <BackgroundImageTexture className={styles.paper} opacity={0.2} variant="groovepaper">
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              ONE POINT OF CONTACT / FROM PLANNING TO COMPLETION
            </span>
            <h2 id="garden-integrated-experience-title">
              One team for the build plan and the financing plan.
            </h2>
          </div>
          <p>
            A Garden Suite can involve builders, designers, permits, lenders, appraisers and legal
            documents. FairLend keeps those moving parts connected to your budget, timeline and
            goals, so you do not have to carry every question between different people.
          </p>
        </header>

        <GardenSuiteCoordinationChoreography />

        <section aria-labelledby="garden-people-behind-plan-title" className={styles.people}>
          <BackgroundImageTexture
            className={styles.peopleTexture}
            opacity={0.28}
            variant="groovepaper"
          >
            <header>
              <h3 id="garden-people-behind-plan-title">
                Mortgage, construction and legal capability in one coordinated file.
              </h3>
              <p className={styles.peopleFileMark}>
                <span aria-hidden="true">03</span>
                disciplines / one project
              </p>
            </header>
            <div className={styles.disciplines}>
              {disciplines.map((discipline, index) => (
                <article
                  data-discipline={String(index + 1).padStart(2, '0')}
                  key={discipline.title}
                >
                  <span aria-hidden="true" className={styles.disciplineIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4>{discipline.title}</h4>
                  <p>{discipline.proof}</p>
                  <span>{discipline.detail}</span>
                </article>
              ))}
            </div>
            <div className={styles.capabilityFooter}>
              <Link className={styles.teamLink} href="/about#leadership">
                Meet FairLend leadership
              </Link>
            </div>
          </BackgroundImageTexture>
        </section>

        <footer className={styles.footer}>
          <div className={styles.legalCapability}>
            <strong>In-house specialist legal team with 10+ years of experience.</strong>
            <p>
              Defined lender-side and project scope, with your independent legal advice kept clear.
            </p>
            <span className={styles.legalStatus}>
              <span aria-hidden="true">✓</span>
              Scope defined before funding
            </span>
          </div>
          <aside aria-label="Independent legal advice">
            <strong>INDEPENDENT LEGAL ADVICE</strong>
            <p>
              FairLend&apos;s in-house specialist legal team acts for FairLend and the applicable
              lender-side or project parties defined in the engagement. It does not act as your
              lawyer. You should obtain independent legal advice from a lawyer of your choosing
              before signing agreements or authorizing funding decisions.
            </p>
          </aside>
        </footer>

        <GardenSuiteSectionCta
          actionLabel="Talk through my project"
          body="Share the property, current stage and financing need once. FairLend will review how the build plan and financing plan fit together."
          className={styles.integratedCta}
          ctaId="garden-suite-one-team-review"
          ctaLocation="section-4-integrated-experience"
          heading="Bring the build and financing questions to one team"
          headingId="garden-suite-integrated-cta-title"
          href="#garden-suite-assessment"
          label="ONE PROJECT / ONE POINT OF CONTACT"
          tone="warm"
        />
      </BackgroundImageTexture>
    </section>
  )
}
