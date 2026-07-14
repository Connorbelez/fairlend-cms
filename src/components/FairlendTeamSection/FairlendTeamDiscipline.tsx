import { cva } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

import { cn } from '@/utilities/ui'

export type FairlendDisciplinePlateKind = 'finance' | 'legal' | 'technology'

const disciplineVariants = cva('fairlend-team__discipline', {
  variants: {
    appearance: {
      icon: 'fairlend-team__discipline--icon',
      plate: 'fairlend-team__discipline--plate',
    },
  },
  defaultVariants: {
    appearance: 'icon',
  },
})

type DisciplineProps =
  | {
      appearance: 'icon'
      className?: string
      discipline: string
      Icon: LucideIcon
      plate?: never
    }
  | {
      appearance?: 'plate'
      className?: string
      discipline: string
      Icon?: never
      plate: FairlendDisciplinePlateKind
    }

const technologySignals = ['System architecture', 'Data', 'Model', 'Human review'] as const
const financeScale = ['00', '25', '50', '75', '100'] as const
const legalIndex = ['001', '002', '003', '004', '005', '006'] as const

function RegistrationMark({ position }: { position: 'bottom' | 'top' }): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn('team-plate__registration', `team-plate__registration--${position}`)}
      data-plate-detail
    >
      <span data-axis="x" data-plate-line />
      <span data-axis="y" data-plate-line />
      <i />
    </span>
  )
}

function TechnologyPlate(): ReactElement {
  return (
    <div className="team-plate team-plate--technology" data-team-plate="technology">
      <span className="team-plate__edge team-plate__edge--top" data-axis="x" data-plate-line />
      <span aria-hidden="true" className="team-plate__diagonal team-plate__diagonal--notch">
        <i data-axis="x" data-plate-line />
      </span>
      <span className="team-plate__edge team-plate__edge--right" data-axis="y" data-plate-line />
      <span className="team-plate__edge team-plate__edge--left" data-axis="y" data-plate-line />

      <div className="team-plate__meta team-plate__meta--top" data-plate-meta>
        <span>File classification plate</span>
        <i data-axis="x" data-plate-line />
      </div>
      <span className="team-plate__file-code" data-plate-meta>
        T-01
      </span>
      <RegistrationMark position="top" />

      <strong className="team-plate__code team-plate__code--technology" data-plate-code>
        T/AI
      </strong>

      <div className="team-plate__signal-list" data-plate-detail>
        {technologySignals.map((signal) => (
          <span className="team-plate__signal-row" key={signal}>
            <span>{signal}</span>
            <i className="team-plate__leader" data-axis="x" data-plate-line />
            <i className="team-plate__signal-tick" data-axis="y" data-plate-line />
            <i className="team-plate__signal-line" data-axis="x" data-plate-line />
            <b data-plate-signal />
          </span>
        ))}
      </div>

      <RegistrationMark position="bottom" />
    </div>
  )
}

function FinancePlate(): ReactElement {
  return (
    <div className="team-plate team-plate--finance" data-team-plate="finance">
      <span className="team-plate__edge team-plate__edge--top" data-axis="x" data-plate-line />
      <span className="team-plate__edge team-plate__edge--right" data-axis="y" data-plate-line />
      <span className="team-plate__edge team-plate__edge--bottom" data-axis="x" data-plate-line />
      <span className="team-plate__edge team-plate__edge--left" data-axis="y" data-plate-line />

      <span className="team-plate__tab" data-plate-detail>
        <span className="team-plate__tab-segment team-plate__tab-segment--top">
          <i className="team-plate__tab-line" data-axis="x" data-plate-line />
        </span>
        <i
          className="team-plate__tab-line team-plate__tab-line--outer"
          data-axis="y"
          data-plate-line
        />
        <span className="team-plate__tab-segment team-plate__tab-segment--bottom">
          <i className="team-plate__tab-line" data-axis="x" data-plate-line />
        </span>
        <b>02</b>
      </span>

      <div className="team-plate__meta team-plate__meta--top" data-plate-meta>
        <span>Financial control register</span>
        <strong>FIN-CTRL-02</strong>
        <i data-axis="x" data-plate-line />
      </div>

      <strong className="team-plate__code team-plate__code--finance" data-plate-code>
        <span>FIN/</span>
        <span>CTRL</span>
      </strong>

      <div className="team-plate__scale" data-plate-detail>
        <i className="team-plate__scale-line" data-axis="x" data-plate-line />
        {financeScale.map((value, index) => (
          <span className={index === 2 ? 'is-active' : undefined} key={value}>
            <i data-axis="y" data-plate-line />
            <b>{value}</b>
          </span>
        ))}
      </div>

      <RegistrationMark position="bottom" />
    </div>
  )
}

function LegalPlate(): ReactElement {
  return (
    <div className="team-plate team-plate--legal" data-team-plate="legal">
      <span className="team-plate__edge team-plate__edge--top" data-axis="x" data-plate-line />
      <span aria-hidden="true" className="team-plate__diagonal team-plate__diagonal--notch-left">
        <i data-axis="x" data-plate-line />
      </span>
      <span className="team-plate__edge team-plate__edge--right" data-axis="y" data-plate-line />
      <span className="team-plate__edge team-plate__edge--left" data-axis="y" data-plate-line />

      <div className="team-plate__meta team-plate__meta--top" data-plate-meta>
        <span>Legal file index</span>
        <strong>LR-03</strong>
        <i data-axis="x" data-plate-line />
      </div>

      <strong className="team-plate__code team-plate__code--legal" data-plate-code>
        L/R
      </strong>

      <div className="team-plate__legal-index" data-plate-detail>
        <i className="team-plate__legal-index-line" data-axis="y" data-plate-line />
        {legalIndex.map((value) => (
          <span className={value === '003' ? 'is-active' : undefined} key={value}>
            <i data-axis="x" data-plate-line />
            <b>{value}</b>
          </span>
        ))}
      </div>

      <div className="team-plate__risk" data-plate-detail>
        <span>
          Risk classification
          <strong>R2 / Moderate</strong>
        </span>
        <i aria-hidden="true" />
      </div>
    </div>
  )
}

function ClassificationPlate({ plate }: { plate: FairlendDisciplinePlateKind }): ReactElement {
  if (plate === 'technology') return <TechnologyPlate />
  if (plate === 'finance') return <FinancePlate />
  return <LegalPlate />
}

export function FairlendTeamDiscipline(props: DisciplineProps): ReactElement {
  if (props.appearance === 'icon') {
    const { className, discipline, Icon } = props

    return (
      <div className={cn(disciplineVariants({ appearance: 'icon' }), className)}>
        <span className="fairlend-team__discipline-icon">
          <Icon aria-hidden="true" strokeWidth={1.55} />
        </span>
        <p>{discipline}</p>
      </div>
    )
  }

  const { className, discipline, plate } = props

  return (
    <div className={cn(disciplineVariants({ appearance: 'plate' }), className)}>
      <ClassificationPlate plate={plate} />
      <p data-team-plate-label>{discipline}</p>
    </div>
  )
}
