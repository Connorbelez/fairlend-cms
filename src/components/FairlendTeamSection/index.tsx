import Image from 'next/image'
import type { ReactElement } from 'react'

import { FairlendPaperSection, FairlendPaperShell } from '@/components/FairlendMarketingPrimitives'
import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'

import { FairlendTeamDiscipline } from './FairlendTeamDiscipline'
import { FairlendTeamDisciplineMotion } from './FairlendTeamDisciplineMotion.client'
import './team-section.css'

const teamMembers = [
  {
    discipline: 'Technology & AI',
    initials: 'CB',
    name: 'Connor Beleznay',
    plate: 'technology',
    responsibility:
      'Capital-markets systems and AI infrastructure built around human-led underwriting.',
    role: 'CTO & MIC Director',
  },
  {
    discipline: 'Operations & controls',
    initials: 'BK',
    name: 'Bogdan Krystek',
    plate: 'operations',
    responsibility:
      'Operational discipline and financial oversight across the complete file lifecycle.',
    role: 'COO / CFO',
  },
  {
    discipline: 'Legal & risk',
    initials: 'JB',
    name: 'Joel Brenner',
    plate: 'legal',
    responsibility:
      '20 years in private equity and real estate law, with previous cybersecurity consulting for the Canadian government.',
    role: 'CLO',
  },
] satisfies ReadonlyArray<{
  discipline: string
  initials: string
  name: string
  plate: 'legal' | 'operations' | 'technology'
  responsibility: string
  role: string
}>

export function FairlendTeamSection(): ReactElement {
  return (
    <FairlendPaperSection
      aria-labelledby="fairlend-team-title"
      className="fairlend-team"
      data-testid="fairlend-team-section"
      id="team"
    >
      <BackgroundImageTexture
        className="fairlend-team__texture"
        opacity={0.36}
        variant="groovepaper"
      />

      <FairlendPaperShell className="fairlend-team__shell">
        <FairlendTeamDisciplineMotion />

        <div className="fairlend-team__illustration" aria-hidden="true" data-team-illustration>
          <Image
            alt=""
            className="fairlend-team__illustration-image"
            decoding="async"
            fill
            loading="lazy"
            sizes="(max-width: 760px) 100vw, 300px"
            src="/assets/fairlend-team/team-construction-ink.webp"
          />
          <span className="fairlend-team__illustration-scan" data-team-illustration-scan />
        </div>

        <header className="fairlend-team__statement" data-team-statement>
          <h2 className="fairlend-team__title" id="fairlend-team-title">
            <span data-team-title-line>The team</span>
            <span data-team-title-line>behind</span>
            <span data-team-title-line>the file</span>
          </h2>
          <span
            aria-hidden="true"
            className="fairlend-team__statement-rule"
            data-team-statement-rule
          />
          <p data-team-statement-copy>
            Capital alone does not close a complex file. The right people align the technology,
            operations, financial controls, and legal judgment behind it.
          </p>
        </header>

        <div className="fairlend-team__spine" aria-hidden="true" data-team-spine>
          <span data-team-spine-node />
          <span data-team-spine-node />
          <span data-team-spine-node />
          <span data-team-spine-node />
        </div>

        <div className="fairlend-team__members">
          {teamMembers.map(({ discipline, initials, name, plate, responsibility, role }) => (
            <article className="fairlend-team__member" data-team-member key={name}>
              <div
                aria-label={`Portrait placeholder for ${name}`}
                className="fairlend-team__portrait"
                data-team-portrait
                role="img"
              >
                <span className="fairlend-team__portrait-ink" aria-hidden="true" />
                <span className="fairlend-team__initials" aria-hidden="true">
                  {initials}
                </span>
                <span className="fairlend-team__portrait-label">Portrait placeholder</span>
              </div>

              <div className="fairlend-team__member-copy" data-team-member-copy>
                <h3 data-team-member-name>{name}</h3>
                <p className="fairlend-team__role" data-team-member-role>
                  {role}
                </p>
                <span aria-hidden="true" className="fairlend-team__name-rule" data-team-name-rule />
                <p className="fairlend-team__responsibility" data-team-member-responsibility>
                  {responsibility}
                </p>
              </div>

              <FairlendTeamDiscipline appearance="plate" discipline={discipline} plate={plate} />
            </article>
          ))}
        </div>
      </FairlendPaperShell>
    </FairlendPaperSection>
  )
}
