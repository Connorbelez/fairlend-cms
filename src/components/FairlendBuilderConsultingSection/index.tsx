import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CircleHelp,
  ClipboardPenLine,
  Crosshair,
  Goal,
  Home,
  Landmark,
  MapPinned,
  NotebookPen,
  PencilRuler,
  Scale,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react'
import { type ComponentType, type CSSProperties, type SVGProps } from 'react'

import { FairlendPaperSection, FairlendPaperShell } from '@/components/FairlendMarketingPrimitives'
import { BackgroundImageTexture } from '@/components/ui/bg-image-texture'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildFairlendIntakeHref } from '@/lib/fairlend-intake'
import { cn } from '@/utilities/ui'

import { EquationVariableIcon } from './EquationVariableIcon.client'
import { FairlendBuilderConsultingMotion } from './Motion.client'
import { torontoLuxury2019Model } from './model'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type BuilderYear = '2019' | '2023' | '2026'
type EquationVariant = 'full' | 'compact'
type EquationVariableKey = 'land' | 'build' | 'soft' | 'incentives' | 'home' | 'sale'
type RequiredEquationVariableKey = Exclude<EquationVariableKey, 'incentives'>
type EquationRowKey = 'single-family' | 'multiplex' | 'garden-suite'
type ProfitTone = 'profit' | 'loss' | 'neutral'

type EquationVariable = {
  key: EquationVariableKey
  label: string
  sublabel: string
  hint: string
}

type EquationRow = {
  key: EquationRowKey
  label: string
  note: string
  year: BuilderYear
  tone: ProfitTone
  values: Record<RequiredEquationVariableKey, string> & Partial<Record<'incentives', string>>
  profit: string
  margin: string
  riskLeft: string
  riskRight: string
  sublabels?: Partial<Record<EquationVariableKey, string>>
  labels?: Partial<Record<EquationVariableKey, string>>
  hints?: Partial<Record<EquationVariableKey, string>>
  outcomeHeading?: string
  outcomeLabel?: string
  marginLabel?: string
}

const timelineYears = ['2019', '2023', '2026'] as const satisfies readonly BuilderYear[]
const builderConsultingIntakeHref = buildFairlendIntakeHref({
  intent: 'build',
  source: 'builder-consulting-cta',
})

const states = {
  '2019': {
    year: '2019',
    eyebrow: 'Builder Consulting',
    headlineTop: 'You focus on',
    headlineBottom: 'building.',
    subheadline:
      'FairLend helps model the financing and business equation around your build. You remain in control of cost and execution.',
    label: '2019',
    note: '(Toronto luxury home. positive estimated return)',
    panelNote: '(illustrative 3,800 ft² luxury infill model)',
    cta: 'SEE THE TIMELINE',
    ctaNote: 'Scroll through the build math',
    cards: [
      { icon: CircleHelp, text: 'Illustrative land basis: $1.00M' },
      { icon: CircleHelp, text: 'Luxury hard cost: $400/ft²' },
      { icon: CircleHelp, text: 'Soft costs: $50/ft² incl. financing' },
      { icon: CircleHelp, text: 'Luxury-home exit: $3.65M' },
    ],
    stripItems: [
      { icon: Scale, text: 'Luxury infill land basis' },
      { icon: NotebookPen, text: 'Builder hard-cost assumption' },
      { icon: Home, text: 'Consistent 3,800 ft² model' },
    ],
    stripTitle: 'Land. Build. Sell. Profit.',
    stripCopy: 'In 2019, the Toronto luxury single-family equation still finished in the green.',
    stripHighlight: 'in the green',
  },
  '2023': {
    year: '2023',
    eyebrow: 'Builder Consulting',
    headlineTop: '2023: COSTS',
    headlineBottom: 'REPRICE THE DEAL.',
    subheadline:
      'Southern Ontario acquisition, construction, and financing assumptions moved sharply. The estimated return shows how quickly the equation changed.',
    label: '2023',
    note: '(higher inputs. estimated return)',
    panelNote: '(Southern Ontario assumptions)',
    cta: 'RUN MY NUMBERS',
    ctaNote: 'Find the break-even point',
    cards: [
      { icon: TriangleAlert, text: 'Detached proxy averaged $1.46M' },
      { icon: Calculator, text: 'Hard costs ranged $205-$280/ft²' },
      { icon: Home, text: 'New-home benchmark was $1.60M' },
      { icon: Goal, text: 'Policy rate reached 5.00%' },
    ],
    stripItems: [
      { icon: TriangleAlert, text: 'Acquisition benchmark increased' },
      { icon: SlidersHorizontal, text: 'Published hard costs increased' },
      { icon: Crosshair, text: 'Financing changed materially' },
    ],
    stripTitle: 'Land. Cost. Capital. Reprice.',
    stripCopy:
      'By 2023, higher acquisition, construction, and capital costs compressed the return.',
    stripHighlight: 'compressed the return',
  },
  '2026': {
    year: '2026',
    eyebrow: 'Builder Consulting',
    headlineTop: '2026: DENSITY',
    headlineBottom: 'CHANGES THE MODEL.',
    subheadline:
      'Southern Ontario permits more low-rise housing options. The same assumptions show how 5 or more units can change the estimated return.',
    label: '2026',
    note: '(more housing options. estimated returns)',
    panelNote: '(multiplex + garden-suite benchmarks)',
    cta: 'RUN MY NUMBERS',
    ctaNote: "Let's run your version",
    cards: [
      { icon: MapPinned, text: 'Detached proxy averaged $1.36M' },
      { icon: Landmark, text: 'Single-home hard costs: $150-$275/ft²' },
      { icon: ClipboardPenLine, text: 'Multiplex models start at 5 or more units' },
      { icon: Crosshair, text: 'Garden suites often total $400K–$600K' },
    ],
    stripItems: [
      { icon: ClipboardPenLine, text: 'Single-family estimate remains negative' },
      { icon: Home, text: 'Multiplex can create 5 or more units' },
      { icon: SlidersHorizontal, text: 'Garden suite adds rental capacity' },
    ],
    stripTitle: 'Land. Build. Add Density. Model.',
    stripCopy: 'In 2026, multiplex and garden-suite options expand output, not guaranteed profit.',
    stripHighlight: 'not guaranteed profit',
  },
} as const satisfies Record<
  BuilderYear,
  {
    year: BuilderYear
    eyebrow: string
    headlineTop: string
    headlineBottom: string
    subheadline: string
    label: string
    note: string
    panelNote: string
    cta: string
    ctaNote: string
    cards: readonly { icon: IconComponent; text: string }[]
    stripItems: readonly { icon: IconComponent; text: string }[]
    stripTitle: string
    stripCopy: string
    stripHighlight: string
  }
>

const equationVariables = [
  {
    key: 'land',
    label: 'LAND',
    sublabel: 'LOT BASIS',
    hint: 'acquisition input',
  },
  {
    key: 'build',
    label: 'BUILD COST',
    sublabel: 'PER FT²',
    hint: 'construction input',
  },
  {
    key: 'soft',
    label: 'SOFT COSTS',
    sublabel: 'PROJECT COSTS',
    hint: 'consulting + financing input',
  },
  {
    key: 'incentives',
    label: 'INCENTIVES',
    sublabel: 'PROGRAM SUPPORT',
    hint: 'project-specific input',
  },
  {
    key: 'home',
    label: 'HOMES',
    sublabel: 'OUTPUT',
    hint: 'housing form',
  },
  {
    key: 'sale',
    label: 'EXIT VALUE',
    sublabel: 'EXIT VALUE',
    hint: 'resale input',
  },
] as const satisfies readonly EquationVariable[]

const singleFamilyTimelineRows = [
  {
    key: 'single-family',
    label: 'Single family',
    note: 'Illustrative Toronto luxury infill model',
    year: '2019',
    tone: 'profit',
    values: {
      land: torontoLuxury2019Model.land,
      build: torontoLuxury2019Model.build,
      soft: torontoLuxury2019Model.soft,
      home: '1 HOME',
      sale: torontoLuxury2019Model.sale,
    },
    profit: torontoLuxury2019Model.profit,
    margin: torontoLuxury2019Model.margin,
    riskLeft: 'EST. PROFIT',
    riskRight: 'POSITIVE RETURN',
    hints: {
      land: 'illustrative infill basis',
      build: `${torontoLuxury2019Model.buildArea} builder model`,
      soft: 'includes financing allowance',
      home: torontoLuxury2019Model.buildArea,
      sale: 'illustrative luxury exit',
    },
    outcomeHeading: 'RETURN',
    outcomeLabel: 'EST. RETURN*',
    marginLabel: 'EST. MARGIN',
  },
  {
    key: 'single-family',
    label: 'Single family',
    note: 'Illustrative Southern Ontario assumptions',
    year: '2023',
    tone: 'neutral',
    values: {
      land: '$1.46M',
      build: '$450/ft²',
      soft: '$60/ft²',
      home: '1 HOME',
      sale: '$3.10M',
    },
    profit: '-$298K*',
    margin: '-9.6%*',
    riskLeft: 'EST. LOSS',
    riskRight: 'MIDPOINT COST',
    hints: {
      land: 'detached resale proxy',
      build: 'luxury hard-cost estimate',
      soft: 'consulting + financing allowance',
      sale: 'lower illustrative end value',
    },
    outcomeHeading: 'RETURN',
    outcomeLabel: 'EST. RETURN*',
    marginLabel: 'EST. MARGIN',
  },
  {
    key: 'single-family',
    label: 'Single family',
    note: 'Illustrative Southern Ontario assumptions',
    year: '2026',
    tone: 'neutral',
    values: {
      land: '$1.36M',
      build: '$400/ft²',
      soft: '$60/ft²',
      home: '1 HOME',
      sale: '$2.85M',
    },
    profit: '-$258K*',
    margin: '-9.1%*',
    riskLeft: 'EST. LOSS',
    riskRight: 'MIDPOINT COST',
    hints: {
      land: 'detached resale proxy',
      build: 'single-family hard-cost estimate',
      soft: 'consulting + financing allowance',
      sale: 'illustrative end value',
    },
    outcomeHeading: 'RETURN',
    outcomeLabel: 'EST. RETURN*',
    marginLabel: 'EST. MARGIN',
  },
] as const satisfies readonly EquationRow[]

const finalOpportunityRows = [
  {
    key: 'multiplex',
    label: 'Multiplex',
    note: 'Southern Ontario 5+ unit option',
    year: '2026',
    tone: 'profit',
    values: {
      land: '$1.36M',
      build: '$210–330/ft²',
      soft: '$450–650K',
      incentives: 'AVAILABLE',
      home: '5+ UNITS',
      sale: '$6.18M*',
    },
    profit: '+$972K*',
    margin: '15.7%*',
    riskLeft: 'DENSITY ADDED',
    riskRight: 'EST. POSITIVE',
    hints: {
      land: 'detached resale proxy',
      build: 'closest low-rise benchmark',
      soft: 'illustrative project allowance',
      sale: '5+ unit benchmark exit',
    },
    outcomeHeading: 'RETURN',
    outcomeLabel: 'EST. RETURN*',
    marginLabel: 'EST. MARGIN',
  },
  {
    key: 'garden-suite',
    label: 'Garden suite',
    note: 'Southern Ontario garden suite',
    year: '2026',
    tone: 'profit',
    values: {
      land: 'EXISTING LOT',
      build: '$400–600K',
      soft: 'INCLUDED',
      home: '1 HOME',
      sale: '$4.50K/MO',
    },
    profit: '+$54K/YR*',
    margin: '10.8%*',
    riskLeft: 'GROSS RENT',
    riskRight: 'EST. YIELD',
    labels: {
      sale: 'EST. RENT',
    },
    sublabels: {
      build: 'TOTAL BUILD COST',
      sale: 'MONTHLY RENT',
    },
    hints: {
      land: 'incremental analysis',
      build: 'industry-reported actuals',
      soft: 'included once in total build cost',
      sale: '1-bedroom GTA average per unit',
    },
    outcomeHeading: 'RETURN',
    outcomeLabel: 'EST. RETURN*',
    marginLabel: 'GROSS YIELD',
  },
] as const satisfies readonly EquationRow[]

const initialSingleFamilyRow = singleFamilyTimelineRows[0]

function StateLayer({
  children,
  className,
  year,
}: {
  children: React.ReactNode
  className?: string
  year: BuilderYear
}) {
  return (
    <span className={className} data-builder-year={year}>
      {children}
    </span>
  )
}

function BuilderEyebrow({ year }: { year?: BuilderYear }) {
  const label = year ? states[year].label : 'Builder Consulting'

  const content = (
    <span className="builder-eyebrow">
      <span className="builder-eyebrow__icon" aria-hidden="true">
        <PencilRuler className="size-3.5" strokeWidth={1.9} />
      </span>
      {label}
    </span>
  )

  if (!year) return content
  return <StateLayer year={year}>{content}</StateLayer>
}

function BuilderCopy({ year }: { year: BuilderYear }) {
  const state = states[year]

  return (
    <div
      className={cn('builder-copy', `builder-copy--${year}`)}
      data-builder-copy-panel
      data-builder-copy-year={year}
    >
      <BuilderEyebrow year={year} />
      <h2 className="builder-headline">
        <span>{state.headlineTop}</span>
        <span>{state.headlineBottom}</span>
      </h2>
      <p className="builder-subheadline">{state.subheadline}</p>
      {year === '2026' ? (
        <Link className="builder-related-link" href="/garden-suite-financing-gta">
          Garden Suite financing <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
      <div className="builder-action-block">
        <p className="builder-state-label">
          <strong>{state.label}</strong>
          <span>{state.note}</span>
        </p>
        <div className="builder-question-list">
          {state.cards.map(({ icon: Icon, text }, index) => (
            <ActionCard icon={Icon} index={index} key={text} year={year} text={text} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  index,
  year,
  text,
}: {
  icon: IconComponent
  index: number
  year: BuilderYear
  text: string
}) {
  return (
    <div className="builder-action-card-wrap" data-builder-action-card={year}>
      <Card className="builder-action-card">
        <span className="builder-action-icon">
          <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
        </span>
        <span>{text}</span>
      </Card>
      <span
        aria-hidden="true"
        className={cn(
          'builder-action-connector',
          year === '2026' && 'builder-action-connector--solution',
        )}
        data-builder-connector
        style={{ '--connector-offset': `${index * 13}px` } as CSSProperties}
      />
    </div>
  )
}

function EquationCard({
  row,
  variable,
  dynamic = false,
  variant = 'full',
}: {
  row: EquationRow
  variable: EquationVariable
  dynamic?: boolean
  variant?: EquationVariant
}) {
  const value = row.values[variable.key]
  if (value === undefined) return null
  const counterKey =
    dynamic && row.key === 'single-family' && variable.key !== 'home'
      ? `single-${variable.key}`
      : undefined
  const cardClassName = cn(
    'builder-equation-card builder-equation-card--timeline',
    variant === 'compact' && 'builder-equation-card--compact',
    dynamic && 'builder-equation-card--scroll',
    value.length >= 8 && 'builder-equation-card--dense-value',
    value.length >= 10 && 'builder-equation-card--extra-dense-value',
  )
  const label = row.labels?.[variable.key] ?? variable.label
  const sublabel = row.sublabels?.[variable.key] ?? variable.sublabel
  const hint = row.hints?.[variable.key] ?? variable.hint

  if (variant === 'compact') {
    return (
      <Card className={cardClassName}>
        <CardHeader className="builder-equation-card__header">
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent className="builder-equation-card__content">
          <strong {...(counterKey ? { 'data-builder-counter': counterKey } : {})}>{value}</strong>
          <p className="builder-equation-card__static-label">{sublabel}</p>
          <p className="builder-equation-card__hint">{hint}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cardClassName} data-builder-equation-card>
      <span
        aria-hidden="true"
        className="builder-equation-card__corner builder-equation-card__corner--tl"
      />
      <span
        aria-hidden="true"
        className="builder-equation-card__corner builder-equation-card__corner--tr"
      />
      <span
        aria-hidden="true"
        className="builder-equation-card__corner builder-equation-card__corner--br"
      />
      <span
        aria-hidden="true"
        className="builder-equation-card__corner builder-equation-card__corner--bl"
      />
      <CardHeader className="builder-equation-card__header">
        <CardTitle>{label}</CardTitle>
        <EquationVariableIcon variableKey={variable.key} />
      </CardHeader>
      <CardContent className="builder-equation-card__content">
        <strong {...(counterKey ? { 'data-builder-counter': counterKey } : {})}>{value}</strong>
        <p>{sublabel}</p>
        <p className="builder-equation-card__hint">{hint}</p>
      </CardContent>
    </Card>
  )
}

function Operator({ value }: { value: '+' | '=' }) {
  return (
    <span className={cn('builder-operator', value === '=' && 'builder-operator--equals')}>
      {value}
    </span>
  )
}

function OutcomeCard({
  row,
  dynamic = false,
  variant = 'full',
}: {
  row: EquationRow
  dynamic?: boolean
  variant?: EquationVariant
}) {
  const profitCounterKey = dynamic && row.key === 'single-family' ? 'single-profit' : undefined
  const marginCounterKey = dynamic && row.key === 'single-family' ? 'single-margin' : undefined
  const cardClassName = cn(
    'builder-outcome-card',
    variant === 'compact' && 'builder-outcome-card--compact',
    dynamic && 'builder-outcome-card--scroll',
    row.profit.length >= 9 && 'builder-outcome-card--dense-value',
    !row.profit.includes('$') && 'builder-outcome-card--textual',
  )
  const outcomeHeading = row.outcomeHeading ?? 'PROFIT'
  const outcomeLabel = row.outcomeLabel ?? 'EST. PROFIT*'
  const marginLabel = row.marginLabel ?? 'PROJECT MARGIN'

  if (variant === 'compact') {
    return (
      <Card className={cardClassName}>
        <div className="builder-outcome-card__header">{outcomeHeading}</div>
        <div className="builder-outcome-card__body">
          <p className="builder-outcome-card__label">{outcomeLabel}</p>
          <strong {...(profitCounterKey ? { 'data-builder-counter': profitCounterKey } : {})}>
            {row.profit}
          </strong>
          <p>
            <span {...(marginCounterKey ? { 'data-builder-counter': marginCounterKey } : {})}>
              {row.margin}
            </span>
            <span> {marginLabel}</span>
          </p>
          <div className="builder-risk-labels">
            <span data-builder-primary-risk="left">{row.riskLeft}</span>
            <span data-builder-primary-risk="right">{row.riskRight}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cardClassName}>
      <div className="builder-outcome-card__header">{outcomeHeading}</div>
      <div className="builder-outcome-card__body">
        <p className="builder-outcome-card__label">{outcomeLabel}</p>
        <strong {...(profitCounterKey ? { 'data-builder-counter': profitCounterKey } : {})}>
          {row.profit}
        </strong>
        <p>
          <span {...(marginCounterKey ? { 'data-builder-counter': marginCounterKey } : {})}>
            {row.margin}
          </span>
          <span> {marginLabel}</span>
        </p>
        <div className="builder-risk-labels">
          <span data-builder-primary-risk="left">{row.riskLeft}</span>
          <span data-builder-primary-risk="right">{row.riskRight}</span>
        </div>
      </div>
    </Card>
  )
}

function TimelineYearSwap({
  className,
  field,
}: {
  className?: string
  field: 'label' | 'panelNote' | 'cta' | 'ctaNote'
}) {
  return (
    <span className={cn('builder-swap-text', className)}>
      {timelineYears.map((year) => (
        <StateLayer key={year} year={year}>
          {states[year][field]}
        </StateLayer>
      ))}
    </span>
  )
}

function BuilderEquationLine({
  dynamic = false,
  emerging = false,
  row,
  variant = 'full',
}: {
  dynamic?: boolean
  emerging?: boolean
  row: EquationRow
  variant?: EquationVariant
}) {
  const isCompact = variant === 'compact'
  const rowVariables = equationVariables.filter(
    (variable) => row.values[variable.key] !== undefined,
  )
  const hasIncentives = row.values.incentives !== undefined

  return (
    <div
      className={cn(
        'builder-equation-line',
        `builder-equation-line--${row.tone}`,
        dynamic && 'builder-equation-line--primary',
        emerging && 'builder-equation-line--emerging',
        hasIncentives && 'builder-equation-line--has-incentives',
      )}
      data-builder-emerging-row={emerging ? row.key : undefined}
      data-builder-equation-line={row.key}
      style={
        {
          '--row-tone': row.tone === 'profit' ? 1 : row.tone === 'loss' ? 0 : 0.5,
        } as CSSProperties
      }
    >
      <div
        className={cn(
          'builder-equation-label',
          row.label.length >= 11 && 'builder-equation-label--dense',
        )}
        aria-atomic={dynamic ? 'true' : undefined}
        aria-live={dynamic ? 'polite' : undefined}
      >
        <span data-builder-primary-year={dynamic ? '' : undefined}>{row.year}</span>
        <strong>{row.label}</strong>
        <em data-builder-primary-note={dynamic ? '' : undefined}>{row.note}</em>
      </div>
      {rowVariables.map((variable, index) => (
        <div className="builder-equation-cell" key={variable.key}>
          <EquationCard dynamic={dynamic} row={row} variable={variable} variant={variant} />
          {index < rowVariables.length - 1 ? <Operator value="+" /> : null}
        </div>
      ))}
      <div className="builder-equation-cell builder-equation-cell--profit">
        <Operator value="=" />
        <OutcomeCard dynamic={dynamic} row={row} variant={variant} />
      </div>
      {isCompact ? null : <span className="builder-equation-line__rail" aria-hidden="true" />}
    </div>
  )
}

function EquationRows({ variant = 'full' }: { variant?: EquationVariant }) {
  const finalSingleFamilyRow = singleFamilyTimelineRows[2]

  return (
    <div className="builder-equation-lines">
      <BuilderEquationLine dynamic row={initialSingleFamilyRow} variant={variant} />
      <BuilderEquationLine emerging row={finalOpportunityRows[0]} variant={variant} />
      <BuilderEquationLine emerging row={finalOpportunityRows[1]} variant={variant} />
      <div className="sr-only" aria-live="polite">
        Final 2026 single-family comparison: {finalSingleFamilyRow.profit} estimated return.
      </div>
    </div>
  )
}

function EquationNarrative({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn('builder-equation-narrative', compact && 'builder-equation-narrative--compact')}
      data-builder-equation-narrative
      data-builder-equation-narrative-compact={compact ? '' : undefined}
    >
      <Card className="builder-equation-narrative__card">
        <BackgroundImageTexture
          className="builder-equation-narrative__texture"
          opacity={0.88}
          variant="groovepaper"
        />
        <span aria-hidden="true" className="builder-equation-narrative__notch" />
        <div className="builder-equation-narrative__viewport">
          <div className="builder-equation-narrative__track" data-builder-equation-track>
            <div
              aria-hidden="true"
              className="builder-equation-narrative__message builder-equation-narrative__message--premise"
            >
              <p>
                <span className="builder-equation-narrative__lead">the equation:</span>
                <strong>value − land − soft cost − build cost = profit.</strong>
                <span className="builder-equation-narrative__coda">
                  Used to be <em>reliably positive.</em>
                </span>
              </p>
            </div>
            <div
              aria-hidden="true"
              className="builder-equation-narrative__message builder-equation-narrative__message--loss"
            >
              <p>
                <strong>
                  <span>By 2023,</span> higher land, construction, and soft costs—plus lower end
                  values—turned modeled profit into a loss.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <p className="sr-only">
        The equation: value minus land minus soft cost minus build cost equals profit. It used to be
        reliably positive. By 2023, higher land, construction, and soft costs, plus lower end
        values, turned modeled profit into a loss.
      </p>
    </div>
  )
}

function MobileScrollEquationBoard() {
  return (
    <div className="builder-mobile-equation-board builder-mobile-equation-board--scroll">
      <div className="builder-mobile-equation-board__header">
        <p>
          <TimelineYearSwap field="label" />
        </p>
        <TimelineYearSwap field="panelNote" />
      </div>
      <EquationRows variant="compact" />
      <EquationNarrative compact />
      <p className="builder-footnote builder-footnote--mobile">
        *Entirely illustrative, not guaranteed, and provided only to explain the concept—not as an
        appraisal, investment forecast, profit projection, or financing commitment. Southern Ontario
        assumptions snapshot: July 13, 2026. Rental valuation uses a 5% capitalization rate.
      </p>
    </div>
  )
}

function EquationDashboard() {
  return (
    <div className="builder-dashboard" data-builder-dashboard>
      <div className="builder-dashboard__title">
        <p>
          <TimelineYearSwap field="label" />
        </p>
        <p className="builder-note">
          <TimelineYearSwap field="panelNote" />
        </p>
      </div>
      <div className="builder-dashboard__panel">
        <EquationRows />
        <EquationNarrative />
      </div>
      <p className="builder-footnote">
        *Entirely illustrative, not guaranteed, and provided only to explain the concept—not as an
        appraisal, investment forecast, profit projection, or financing commitment. Southern Ontario
        assumptions snapshot: July 13, 2026. Rental valuation uses a 5% capitalization rate.
      </p>
    </div>
  )
}

function BottomStripLayer({ year }: { year: BuilderYear }) {
  const state = states[year]
  const [beforeHighlight, afterHighlight = ''] = state.stripCopy.split(state.stripHighlight)

  return (
    <div className="builder-bottom-strip__layer" data-builder-strip-year={year}>
      <div className="builder-strip-proof">
        {state.stripItems.map(({ icon: Icon, text }) => (
          <div className="builder-strip-proof__item" key={text}>
            <Icon aria-hidden="true" className="size-9" strokeWidth={1.55} />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div className="builder-strip-statement">
        <h3>{state.stripTitle}</h3>
        <p>
          {beforeHighlight}
          <strong>{state.stripHighlight}</strong>
          {afterHighlight}
        </p>
      </div>
    </div>
  )
}

function BuilderBottomStrip() {
  return (
    <div className="builder-bottom-strip">
      <div className="builder-bottom-strip__track" data-builder-bottom-track>
        {timelineYears.map((year) => (
          <BottomStripLayer key={year} year={year} />
        ))}
      </div>
      <Link className="builder-cta" href={builderConsultingIntakeHref}>
        <span className="builder-cta__label" data-builder-cta-label>
          {states['2019'].cta}
        </span>
        <span className="builder-cta__icon" aria-hidden="true">
          <ArrowRight className="size-7" strokeWidth={1.55} />
        </span>
      </Link>
      <p className="builder-cta-note builder-note">
        <span data-builder-cta-note>{states['2019'].ctaNote}</span>
      </p>
    </div>
  )
}

function MobileScrollState() {
  return (
    <article className="builder-mobile-state builder-mobile-state--scroll" data-builder-mobile-card>
      <div className="builder-mobile-copy-window">
        {timelineYears.map((year) => (
          <div
            className={cn('builder-mobile-copy-panel', `builder-mobile-copy-panel--${year}`)}
            data-builder-mobile-copy
            data-builder-mobile-copy-year={year}
            key={year}
          >
            <BuilderEyebrow year={year} />
            <h2 className="builder-headline">
              <span>{states[year].headlineTop}</span>
              <span>{states[year].headlineBottom}</span>
            </h2>
            <p className="builder-subheadline">{states[year].subheadline}</p>
            {year === '2026' ? (
              <Link className="builder-related-link" href="/garden-suite-financing-gta">
                Garden Suite financing <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      <div className="builder-mobile-stage" data-builder-mobile-dashboard>
        <MobileScrollEquationBoard />
      </div>
      <Link className="builder-cta builder-cta--mobile" href={builderConsultingIntakeHref}>
        <span className="builder-cta__label" data-builder-cta-label>
          {states['2019'].cta}
        </span>
        <span className="builder-cta__icon" aria-hidden="true">
          <ArrowRight className="size-6" strokeWidth={1.55} />
        </span>
      </Link>
    </article>
  )
}

function BuilderConsultingStyles() {
  return (
    <style>{`
      .builder-consulting {
        --builder-cream: rgb(255 253 247);
        --builder-paper: rgb(255 250 241);
        --builder-forest: oklch(0.182 0.045 166);
        --builder-forest-soft: oklch(0.224 0.06 160);
        --builder-coral: oklch(0.645 0.221 35);
        --builder-coral-deep: oklch(0.53 0.205 34);
        --builder-green: oklch(0.43 0.12 153);
        --builder-blue: oklch(0.52 0.145 255);
        --builder-loss: oklch(0.61 0.22 31);
        --builder-loss-deep: oklch(0.45 0.18 29);
        --builder-line: rgb(8 45 35 / 12%);
        --builder-progress: 0;
        background:
          radial-gradient(circle at 35% 24%, rgb(255 92 52 / 6%), transparent 24rem),
          linear-gradient(180deg, rgb(255 253 247) 0%, rgb(249 243 234) 100%);
        color: var(--builder-forest);
        font-family: var(--font-inter), ui-sans-serif, sans-serif;
        scroll-margin-top: calc(var(--fairlend-public-header-height, 72px) + 1rem);
      }

      .builder-desktop {
        display: none;
      }

      .builder-mobile {
        display: grid;
        gap: 1rem;
        padding: 5rem 1rem;
      }

      .builder-mobile-state {
        overflow: hidden;
        border: 1px solid var(--builder-line);
        border-radius: 24px;
        background: rgb(255 250 241 / 88%);
        padding: clamp(1rem, 5vw, 1.5rem);
        box-shadow: 0 18px 46px rgb(8 45 35 / 8%);
      }

      .builder-mobile-state--solution {
        border-color: oklch(0.43 0.12 153 / 22%);
      }

      .builder-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        width: fit-content;
        border: 1px solid oklch(0.52 0.145 255 / 36%);
        border-radius: 999px;
        background: oklch(0.52 0.145 255 / 7%);
        padding: 0.42rem 0.82rem;
        color: oklch(0.48 0.16 255);
        font-size: clamp(0.68rem, 0.74vw, 0.82rem);
        font-weight: 900;
        letter-spacing: 0.18em;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-eyebrow__icon {
        display: grid;
        place-items: center;
        width: 1.25rem;
        height: 1.25rem;
        border: 1px solid currentColor;
        border-radius: 0.24rem;
      }

      .builder-headline {
        margin: clamp(1rem, 1.8vw, 1.45rem) 0 0;
        max-width: 12ch;
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: clamp(4.6rem, 7.55vw, 8.9rem);
        font-weight: 400;
        letter-spacing: 0.01em;
        line-height: 0.9;
        text-transform: uppercase;
      }

      .builder-headline span {
        display: block;
        transform: scaleX(0.74);
        transform-origin: left center;
        white-space: nowrap;
      }

      .builder-headline span:first-child {
        color: var(--builder-forest);
      }

      .builder-headline span:last-child {
        color: var(--builder-coral);
      }

      .builder-subheadline {
        max-width: 36rem;
        margin: clamp(0.9rem, 1.5vw, 1.25rem) 0 0;
        color: var(--builder-forest-soft);
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: clamp(1.35rem, 1.75vw, 2rem);
        font-weight: 600;
        line-height: 1.06;
      }

      .builder-related-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        width: fit-content;
        margin-top: 0.8rem;
        color: var(--builder-blue);
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0.08em;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 0.2rem;
        text-transform: uppercase;
      }

      .builder-related-link:hover {
        color: var(--builder-coral);
      }

      .builder-related-link:focus-visible {
        outline: 3px solid oklch(0.52 0.145 255 / 72%);
        outline-offset: 4px;
      }

      .builder-state-label {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 1.7rem 0 0.9rem;
      }

      .builder-state-label strong {
        color: var(--builder-coral);
        font-size: 0.86rem;
        font-weight: 950;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .builder-note,
      .builder-state-label span {
        color: var(--builder-blue);
        font-family: var(--font-inter), ui-sans-serif, sans-serif;
        font-size: clamp(0.88rem, 1vw, 1.08rem);
        font-weight: 700;
        letter-spacing: 0;
        text-transform: none;
      }

      .builder-question-list,
      .builder-mobile-list {
        display: grid;
        gap: 0.5rem;
      }

      .builder-action-card-wrap {
        position: relative;
        width: min(19rem, 56%);
      }

      .builder-action-card {
        display: flex;
        min-height: 3.05rem;
        align-items: center;
        gap: 0.76rem;
        border: 1px solid rgb(8 45 35 / 9%);
        border-radius: 10px;
        background: rgb(255 253 247 / 88%);
        padding: 0.74rem 0.86rem;
        color: var(--builder-forest);
        box-shadow: 0 12px 26px rgb(8 45 35 / 7%), inset 0 1px 0 rgb(255 255 255 / 74%);
        font-size: clamp(0.78rem, 0.86vw, 0.92rem);
        font-weight: 800;
        line-height: 1.15;
      }

      .builder-action-icon {
        display: grid;
        flex: 0 0 auto;
        width: 1.45rem;
        height: 1.45rem;
        place-items: center;
        border: 2px solid var(--builder-coral);
        border-radius: 999px;
        color: var(--builder-coral);
      }

      .builder-action-connector {
        display: none;
        position: absolute;
        top: 50%;
        left: calc(100% + 0.2rem);
        width: clamp(3.8rem, 6.4vw, 7.3rem);
        height: calc(2.1rem + var(--connector-offset));
        border-top: 2px dashed var(--builder-coral);
        border-right: 2px dashed var(--builder-coral);
        border-radius: 0 18px 0 0;
        opacity: 0.68;
        transform: translateY(-1px);
      }

      .builder-action-connector--solution {
        opacity: 0.74;
      }

      .builder-action-connector::after {
        position: absolute;
        right: -0.33rem;
        bottom: -0.33rem;
        width: 0.58rem;
        height: 0.58rem;
        border: 2px solid var(--builder-coral);
        border-radius: 999px;
        background: var(--builder-cream);
        content: "";
      }

      .builder-house-visual {
        position: relative;
        min-height: clamp(19rem, 27vw, 31rem);
        overflow: visible;
      }

      .builder-blueprint-field {
        position: absolute;
        inset: 3% -2% 5% 8%;
        background:
          linear-gradient(30deg, rgb(37 107 180 / 10%) 1px, transparent 1px 34px),
          linear-gradient(120deg, rgb(37 107 180 / 7%) 1px, transparent 1px 42px);
        opacity: 0.48;
        transform: skewY(-13deg) rotate(-4deg);
        -webkit-mask-image: radial-gradient(ellipse at 54% 54%, black 0 48%, transparent 75%);
        mask-image: radial-gradient(ellipse at 54% 54%, black 0 48%, transparent 75%);
      }

      .builder-house-crop {
        position: absolute;
        inset: -2% -12% -7% -4%;
        filter: drop-shadow(0 34px 42px rgb(8 45 35 / 18%));
      }

      .builder-house-image {
        object-fit: contain;
        object-position: center bottom;
      }

      .builder-route-line {
        position: absolute;
        right: -2%;
        bottom: 8%;
        z-index: 3;
        width: min(86%, 39rem);
        overflow: visible;
      }

      .builder-route-line__shadow,
      .builder-route-line__glow {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .builder-route-line__shadow {
        stroke: rgb(8 45 35 / 18%);
        stroke-width: 15;
      }

      .builder-route-line__glow {
        stroke: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 100%), var(--builder-green) calc(var(--builder-progress) * 100%));
        stroke-width: 7;
        filter: drop-shadow(0 0 8px rgb(247 86 62 / 42%));
      }

      .builder-route-line__pin {
        fill: var(--builder-coral);
        stroke: white;
        stroke-width: 5;
      }

      .builder-route-line__pin-core {
        fill: white;
      }

      .builder-dashboard__title {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        margin: 0 0 0.9rem 0.4rem;
      }

      .builder-dashboard {
        position: relative;
        z-index: 8;
      }

      .builder-dashboard__title > p:first-child {
        min-width: 8rem;
        margin: 0;
        color: var(--builder-forest);
        font-size: 0.95rem;
        font-weight: 950;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .builder-dashboard__panel {
        position: relative;
        z-index: 8;
        border: 1px solid var(--builder-line);
        border-radius: 18px;
        background:
          radial-gradient(circle at 80% 18%, rgb(255 255 255 / 88%), transparent 22rem),
          rgb(255 250 241 / 96%);
        padding: clamp(1rem, 1.45vw, 1.55rem);
        box-shadow: 0 22px 58px rgb(8 45 35 / 9%), inset 0 1px 0 rgb(255 255 255 / 82%);
      }

      .builder-equation-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: clamp(0.9rem, 1.45vw, 1.45rem);
      }

      .builder-equation-row--bottom {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: clamp(1rem, 1.55vw, 1.7rem);
      }

      .builder-equation-cell {
        position: relative;
        display: grid;
        min-width: 0;
      }

      .builder-equation-card,
      .builder-outcome-card {
        position: relative;
        overflow: hidden;
        border: 1px solid rgb(8 45 35 / 14%);
        border-radius: 8px;
        background:
          linear-gradient(180deg, rgb(255 253 247 / 78%), rgb(244 237 224 / 62%)),
          radial-gradient(circle at 50% 72%, color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 11%), var(--builder-green) calc(var(--builder-progress) * 10%)), transparent 58%);
        box-shadow: inset 0 -18px 34px rgb(8 45 35 / 5%), inset 0 1px 0 rgb(255 255 255 / 78%);
      }

      .builder-equation-card {
        display: flex;
        flex-direction: column;
        min-height: clamp(13.2rem, 14.4vw, 15.9rem);
        padding: 0;
      }

      .builder-equation-card::before {
        position: absolute;
        top: 0;
        right: 0.7rem;
        left: 0.7rem;
        height: 1px;
        background: rgb(8 45 35 / 18%);
        content: "";
      }

      .builder-equation-card__corner {
        position: absolute;
        z-index: 5;
        width: 1.42rem;
        height: 1.42rem;
        opacity: 0.98;
        pointer-events: none;
      }

      .builder-equation-card__corner::before,
      .builder-equation-card__corner::after {
        position: absolute;
        border-radius: 999px;
        background: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 92%), var(--builder-green) calc(var(--builder-progress) * 84%));
        box-shadow: 0 0 0 1px rgb(255 253 247 / 82%), 0 0 12px color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 30%), var(--builder-green) calc(var(--builder-progress) * 28%));
        content: "";
      }

      .builder-equation-card__corner::before {
        width: 100%;
        height: 3px;
      }

      .builder-equation-card__corner::after {
        width: 3px;
        height: 100%;
      }

      .builder-equation-card__corner--tl {
        top: 0;
        left: 0;
      }

      .builder-equation-card__corner--tr {
        top: 0;
        right: 0;
      }

      .builder-equation-card__corner--tr::before,
      .builder-equation-card__corner--tr::after {
        right: 0;
      }

      .builder-equation-card__corner--br {
        right: 0;
        bottom: 0;
      }

      .builder-equation-card__corner--br::before,
      .builder-equation-card__corner--br::after {
        right: 0;
        bottom: 0;
      }

      .builder-equation-card__corner--bl {
        bottom: 0;
        left: 0;
      }

      .builder-equation-card__corner--bl::before,
      .builder-equation-card__corner--bl::after {
        bottom: 0;
      }

      .builder-equation-card__header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.6rem;
        padding: clamp(0.82rem, 0.98vw, 1.05rem) clamp(0.86rem, 1.05vw, 1.12rem) 0;
      }

      .builder-equation-card [data-slot="card-title"] {
        margin: 0;
        color: rgb(8 45 35 / 68%);
        font-size: clamp(0.66rem, 0.74vw, 0.82rem);
        font-weight: 900;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-equation-card__content {
        display: grid;
        flex: 1;
        align-content: start;
        gap: 0.22rem;
        padding: 0.58rem clamp(0.82rem, 1vw, 1.08rem) 0;
      }

      .builder-equation-card strong {
        display: block;
        color: var(--builder-forest);
        font-size: clamp(1.45rem, 2vw, 2.35rem);
        font-weight: 950;
        line-height: 1;
        letter-spacing: -0.045em;
        text-align: left;
      }

      .builder-equation-card p {
        margin: 0;
        min-height: 1.2em;
        color: var(--builder-forest);
        font-size: clamp(0.58rem, 0.66vw, 0.72rem);
        font-weight: 900;
        line-height: 1.08;
        text-align: left;
        text-transform: uppercase;
      }

      .builder-metric-visual {
        position: relative;
        height: clamp(3.5rem, 4.15vw, 4.8rem);
        overflow: hidden;
      }

      .builder-semi-gauge {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: minmax(4.2rem, 0.9fr) minmax(0, 0.74fr);
        grid-template-rows: auto auto;
        align-items: center;
        column-gap: 0.35rem;
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 100%), var(--builder-green) calc(var(--builder-progress) * 100%));
      }

      .builder-semi-gauge svg {
        grid-row: 1 / 3;
        width: 100%;
        overflow: visible;
      }

      .builder-semi-gauge path {
        fill: none;
        stroke-linecap: round;
      }

      .builder-semi-gauge__rail {
        stroke: rgb(8 45 35 / 9%);
        stroke-width: 15;
      }

      .builder-semi-gauge__value {
        stroke: currentColor;
        stroke-width: 15;
        filter: drop-shadow(0 5px 8px rgb(8 45 35 / 12%));
      }

      .builder-semi-gauge__inner {
        stroke: color-mix(in oklch, currentColor 34%, white);
        stroke-width: 4;
        opacity: 0.9;
      }

      .builder-semi-gauge span {
        align-self: end;
        color: var(--builder-forest);
        font-size: clamp(1rem, 1.35vw, 1.55rem);
        font-weight: 950;
        letter-spacing: -0.035em;
        line-height: 0.95;
        font-variant-numeric: tabular-nums;
      }

      .builder-semi-gauge em {
        align-self: start;
        min-width: 0;
        overflow: hidden;
        color: rgb(8 45 35 / 58%);
        font-style: normal;
        font-size: clamp(0.48rem, 0.54vw, 0.6rem);
        font-weight: 850;
        letter-spacing: 0.04em;
        line-height: 1.08;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .builder-metric-line-window {
        position: relative;
        height: clamp(3rem, 3.35vw, 3.8rem);
        margin-top: 0.04rem;
        overflow: hidden;
      }

      .builder-metric-line-chart {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 100%), var(--builder-green) calc(var(--builder-progress) * 100%));
      }

      .builder-metric-line-chart__grid {
        fill: none;
        stroke: rgb(8 45 35 / 6%);
        stroke-dasharray: 3 7;
        stroke-linecap: round;
      }

      .builder-metric-line-chart__area {
        color: currentColor;
        fill: currentColor;
        opacity: 0.14;
      }

      .builder-metric-line-chart__path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 4;
      }

      .builder-metric-line-caption {
        position: absolute;
        right: 0.05rem;
        bottom: 0.05rem;
        color: rgb(8 45 35 / 42%);
        font-size: clamp(0.46rem, 0.52vw, 0.58rem);
        font-weight: 850;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-swap-text {
        position: relative;
        display: inline-grid;
        min-width: max-content;
        overflow: hidden;
      }

      .builder-swap-text [data-builder-state] {
        grid-area: 1 / 1;
      }

      .builder-swap-text [data-builder-state="problem"] {
        transform: translateY(calc(var(--builder-progress) * -115%));
      }

      .builder-swap-text [data-builder-state="solution"] {
        transform: translateY(calc((1 - var(--builder-progress)) * 115%));
      }

      .builder-operator {
        position: absolute;
        top: 43%;
        right: calc(-0.82rem - clamp(0.32rem, 0.45vw, 0.55rem));
        z-index: 2;
        color: var(--builder-forest);
        font-size: clamp(1.35rem, 1.7vw, 2rem);
        font-weight: 950;
        line-height: 1;
      }

      .builder-operator--equals {
        right: auto;
        left: calc(-0.9rem - clamp(0.32rem, 0.45vw, 0.55rem));
        color: var(--builder-forest);
        font-size: clamp(1.65rem, 2.1vw, 2.5rem);
      }

      .builder-sale-sign {
        position: relative;
        width: 5.2rem;
        height: 5.4rem;
        margin-top: 0.6rem;
      }

      .builder-sale-sign__post {
        position: absolute;
        top: 0.15rem;
        left: 1.1rem;
        width: 0.32rem;
        height: 4.7rem;
        border-radius: 999px;
        background: rgb(8 45 35 / 16%);
      }

      .builder-sale-sign__arm {
        position: absolute;
        top: 0.3rem;
        left: 1.1rem;
        width: 3.5rem;
        height: 0.28rem;
        border-radius: 999px;
        background: rgb(8 45 35 / 16%);
      }

      .builder-sale-sign__board {
        position: absolute;
        top: 1rem;
        left: 1.9rem;
        display: grid;
        width: 2.75rem;
        height: 2.15rem;
        place-items: center;
        border: 3px solid white;
        background: var(--builder-coral);
        box-shadow: 0 12px 18px rgb(8 45 35 / 14%);
        color: white;
        font-size: 0.68rem;
        font-weight: 950;
        line-height: 0.9;
        text-align: center;
      }

      .builder-sale-sign__board [data-builder-state="solution"] {
        background: var(--builder-green);
      }

      .builder-coin-stack {
        position: relative;
        width: 5.5rem;
        height: 5.35rem;
        margin-top: 0.64rem;
      }

      .builder-coin-stack span {
        position: absolute;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: linear-gradient(180deg, rgb(227 217 201), rgb(170 158 137));
        color: rgb(8 45 35 / 58%);
        box-shadow: 0 10px 16px rgb(8 45 35 / 12%);
        font-weight: 950;
      }

      .builder-coin-stack span:nth-child(1) {
        left: 0.9rem;
        bottom: 0.4rem;
        width: 2rem;
        height: 3.8rem;
      }

      .builder-coin-stack span:nth-child(2) {
        right: 0.8rem;
        bottom: 0.35rem;
        width: 1.9rem;
        height: 2.5rem;
      }

      .builder-coin-stack span:nth-child(3) {
        right: 0.95rem;
        bottom: 1.8rem;
        width: 2rem;
        height: 2rem;
        border: 2px solid rgb(255 253 247 / 70%);
      }

      .builder-outcome-card {
        min-height: clamp(13.2rem, 14.4vw, 15.9rem);
        text-align: center;
      }

      .builder-outcome-card__header {
        border-bottom: 1px solid color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 24%), var(--builder-green) calc(var(--builder-progress) * 20%));
        background:
          linear-gradient(
            180deg,
            color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 12%), var(--builder-green) calc(var(--builder-progress) * 10%)),
            rgb(255 253 247 / 72%)
          );
        padding: 0.75rem 0.5rem;
        font-size: clamp(0.66rem, 0.74vw, 0.82rem);
        font-weight: 950;
        letter-spacing: 0.09em;
      }

      .builder-outcome-card__body {
        display: grid;
        justify-items: center;
        padding: 0.9rem 0.68rem 0.7rem;
      }

      .builder-outcome-card__label {
        margin: 0;
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 100%), var(--builder-green) calc(var(--builder-progress) * 100%));
        font-size: clamp(0.76rem, 0.9vw, 1rem);
        font-weight: 950;
        letter-spacing: 0.13em;
      }

      .builder-outcome-card strong {
        display: block;
        margin-top: 0.4rem;
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--builder-progress)) * 100%), var(--builder-forest) calc(var(--builder-progress) * 100%));
        font-size: clamp(2rem, 3.3vw, 3.85rem);
        font-weight: 950;
        line-height: 0.88;
        letter-spacing: -0.05em;
      }

      .builder-outcome-card__body > p:not(.builder-outcome-card__label) {
        margin: 0.55rem 0 0;
        color: var(--builder-forest);
        font-size: clamp(0.66rem, 0.78vw, 0.86rem);
        font-weight: 950;
      }

      .builder-outcome-card__body > p:not(.builder-outcome-card__label) span:first-child {
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 100%), var(--builder-green) calc(var(--builder-progress) * 100%));
        font-size: 1.34em;
      }

      .builder-risk-labels {
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: rgb(8 45 35 / 58%);
        font-size: 0.58rem;
        font-weight: 900;
      }

      .builder-footnote {
        margin: 0.62rem 0 0 0.4rem;
        color: rgb(8 45 35 / 52%);
        font-size: clamp(0.63rem, 0.75vw, 0.82rem);
        font-weight: 650;
      }

      .builder-bottom-strip {
        position: relative;
        min-height: clamp(6.6rem, 7.7vw, 8.5rem);
        overflow: hidden;
        border: 1px solid rgb(8 45 35 / 8%);
        border-radius: 14px;
        background: rgb(250 246 238 / 86%);
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 74%);
      }

      .builder-bottom-strip__track {
        position: absolute;
        inset: 0;
        height: 200%;
      }

      .builder-bottom-strip__layer {
        position: relative;
        display: grid;
        height: 50%;
        grid-template-columns: minmax(0, 1.28fr) minmax(24rem, 0.86fr) minmax(16rem, 0.48fr);
        align-items: center;
        gap: clamp(1rem, 2vw, 2.4rem);
        padding: 0.82rem clamp(1rem, 2.1vw, 2.4rem);
      }

      .builder-strip-proof {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .builder-strip-proof__item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 0.85rem;
        min-width: 0;
        color: var(--builder-forest);
      }

      .builder-strip-proof__item:not(:last-child) {
        border-right: 1px solid rgb(8 45 35 / 18%);
        padding-right: 0.85rem;
      }

      .builder-strip-proof__item span {
        font-size: clamp(0.72rem, 0.86vw, 0.94rem);
        font-weight: 850;
        line-height: 1.26;
      }

      .builder-strip-statement h3 {
        margin: 0;
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: clamp(1.42rem, 1.75vw, 1.98rem);
        font-weight: 700;
        line-height: 0.94;
      }

      .builder-strip-statement p {
        margin: 0.35rem 0 0;
        max-width: 30rem;
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: clamp(0.92rem, 1.05vw, 1.12rem);
        font-weight: 600;
        line-height: 1.08;
      }

      .builder-strip-statement strong {
        color: var(--builder-coral);
        font-weight: 700;
      }

      .builder-cta {
        position: absolute;
        top: 50%;
        right: clamp(1rem, 2.6vw, 3.2rem);
        z-index: 4;
        display: inline-flex;
        width: max-content;
        min-width: clamp(16.25rem, 19vw, 21rem);
        max-width: min(22rem, calc(100% - 2rem));
        min-height: clamp(3.8rem, 4.4vw, 4.9rem);
        align-items: center;
        justify-content: space-between;
        gap: 1.2rem;
        border: 2px solid rgb(255 255 255 / 75%);
        border-radius: 999px;
        background: linear-gradient(180deg, oklch(0.68 0.23 35), var(--builder-coral));
        padding: 0.58rem 0.7rem 0.58rem clamp(1.3rem, 1.7vw, 1.8rem);
        color: rgb(255 253 247);
        box-shadow: 0 16px 32px rgb(247 86 62 / 25%), inset 0 1px 0 rgb(255 255 255 / 42%);
        font-size: clamp(0.86rem, 1.05vw, 1.15rem);
        font-weight: 950;
        letter-spacing: 0.02em;
        text-decoration: none;
        transform: translateY(-50%);
        transition: background 180ms ease-out, box-shadow 180ms ease-out, transform 180ms ease-out;
      }

      .builder-cta:hover {
        background: linear-gradient(180deg, oklch(0.72 0.23 35), oklch(0.66 0.23 35));
        box-shadow: 0 19px 38px rgb(247 86 62 / 31%), inset 0 1px 0 rgb(255 255 255 / 46%);
        transform: translateY(-50%) translateX(0.12rem);
      }

      .builder-cta:active {
        transform: translateY(-50%) translateX(0.12rem) scale(0.985);
      }

      .builder-cta:focus-visible {
        outline: 3px solid oklch(0.52 0.145 255 / 72%);
        outline-offset: 4px;
      }

      .builder-cta__icon {
        flex: 0 0 auto;
        display: grid;
        width: clamp(2.35rem, 2.7vw, 3rem);
        height: clamp(2.35rem, 2.7vw, 3rem);
        place-items: center;
        border: 1.5px solid rgb(255 255 255 / 78%);
        border-radius: 999px;
      }

      .builder-cta__label {
        display: block;
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .builder-cta-note {
        position: absolute;
        right: clamp(2.5rem, 5.3vw, 6rem);
        bottom: -2.1rem;
        z-index: 2;
        margin: 0;
      }

      @media (min-width: 1371px) {
        .builder-consulting {
          min-height: 100svh;
          overflow: hidden;
        }

        .builder-desktop {
          display: grid;
          min-height: 100svh;
          grid-template-rows: minmax(0, 1fr) auto;
          gap: clamp(0.85rem, 1.3vw, 1.3rem);
          padding: clamp(1.2rem, 2vw, 2.6rem) clamp(1.8rem, 3vw, 3.4rem) clamp(2.3rem, 2.8vw, 3.4rem);
        }

        .builder-mobile {
          display: none;
        }

        .builder-main-grid {
          display: grid;
          grid-template-columns: minmax(29rem, 0.95fr) minmax(46rem, 1.15fr);
          align-items: center;
          gap: clamp(1.35rem, 2vw, 2.5rem);
          min-height: 0;
        }

        .builder-left-stage {
          position: relative;
          min-height: min(43rem, calc(100svh - 12rem));
          overflow: visible;
        }

        .builder-left-scroll-window {
          position: absolute;
          inset: 0;
          z-index: 4;
          overflow: hidden;
        }

        .builder-left-track {
          position: relative;
          height: 100%;
        }

        .builder-copy {
          position: absolute;
          inset: 0;
          display: grid;
          height: 100%;
          align-content: start;
          width: 100%;
        }

        .builder-copy--problem {
          z-index: 4;
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .builder-copy--solution {
          z-index: 5;
          padding-top: clamp(0.8rem, 1.4vw, 1.4rem);
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        .builder-left-stage .builder-house-visual {
          position: absolute;
          right: -10%;
          bottom: -3rem;
          left: 45%;
          z-index: 2;
          min-height: clamp(18rem, 25vw, 29rem);
        }
      }

      @media (max-width: 1280px) and (min-width: 1024px) {
        .builder-desktop {
          padding-inline: 1.2rem;
          padding-top: 1rem;
        }

        .builder-main-grid {
          grid-template-columns: minmax(26rem, 0.88fr) minmax(41rem, 1.12fr);
          gap: 1rem;
        }

        .builder-headline {
          font-size: clamp(4.8rem, 7.3vw, 6.4rem);
        }

        .builder-action-card-wrap {
          width: 58%;
        }

        .builder-equation-card,
        .builder-outcome-card {
          min-height: 12.6rem;
        }

        .builder-strip-proof__item svg {
          width: 1.8rem;
          height: 1.8rem;
        }
      }

      @media (min-width: 1024px) and (max-height: 760px) {
        .builder-desktop {
          gap: 0.58rem;
          padding-top: 0.72rem;
          padding-bottom: 1.4rem;
        }

        .builder-main-grid {
          align-items: start;
        }

        .builder-left-stage {
          min-height: calc(100svh - 9.6rem);
        }

        .builder-left-stage .builder-house-visual {
          right: -8%;
          bottom: -2.35rem;
          left: 48%;
          min-height: clamp(15rem, 22vw, 24rem);
        }

        .builder-headline {
          margin-top: 0.72rem;
          font-size: clamp(4rem, 6.45vw, 5.6rem);
        }

        .builder-subheadline {
          margin-top: 0.62rem;
          max-width: 30rem;
          font-size: clamp(1.05rem, 1.35vw, 1.42rem);
        }

        .builder-state-label {
          margin-top: 0.98rem;
          margin-bottom: 0.58rem;
        }

        .builder-action-card {
          min-height: 2.55rem;
          padding-block: 0.52rem;
          font-size: 0.72rem;
        }

        .builder-question-list,
        .builder-mobile-list {
          gap: 0.36rem;
        }

        .builder-dashboard__title {
          margin-bottom: 0.48rem;
        }

        .builder-dashboard__panel {
          padding: 0.82rem;
        }

        .builder-equation-row {
          gap: 0.72rem;
        }

        .builder-equation-row--bottom {
          margin-top: 0.72rem;
        }

        .builder-equation-card,
        .builder-outcome-card {
          min-height: 10.7rem;
          border-radius: 12px;
        }

        .builder-equation-card__header {
          padding-top: 0.58rem;
        }

        .builder-equation-card__content {
          gap: 0.13rem;
          padding-top: 0.42rem;
        }

        .builder-equation-card strong {
          font-size: clamp(1.08rem, 1.52vw, 1.52rem);
        }

        .builder-equation-card p {
          font-size: 0.5rem;
        }

        .builder-metric-visual {
          height: 3.15rem;
        }

        .builder-metric-line-window {
          height: 2.58rem;
        }

        .builder-outcome-card__header {
          padding-block: 0.56rem;
        }

        .builder-outcome-card__body {
          padding-top: 0.62rem;
        }

        .builder-outcome-card strong {
          font-size: clamp(1.72rem, 2.55vw, 2.72rem);
        }

        .builder-bottom-strip {
          min-height: 5.15rem;
        }

        .builder-bottom-strip__layer {
          padding-block: 0.55rem;
        }

        .builder-strip-proof__item svg {
          width: 1.55rem;
          height: 1.55rem;
        }

        .builder-strip-proof__item span {
          font-size: 0.66rem;
        }

        .builder-strip-statement h3 {
          font-size: 1.55rem;
        }

        .builder-strip-statement p {
          font-size: 0.98rem;
        }

        .builder-cta {
          min-width: 12.6rem;
          min-height: 3rem;
          font-size: 0.82rem;
        }

        .builder-cta__icon {
          width: 2.15rem;
          height: 2.15rem;
        }
      }

      @media (max-width: 1370px) {
        .builder-headline {
          max-width: 9.3ch;
          font-size: clamp(3.7rem, 17vw, 6.8rem);
        }

        .builder-subheadline {
          font-size: clamp(1.25rem, 6vw, 1.8rem);
        }

        .builder-mobile-stage {
          position: relative;
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .builder-mobile-stage .builder-house-visual {
          min-height: 18rem;
        }

        .builder-mobile-stage .builder-house-crop {
          inset: -2% -22% -8% -22%;
        }

        .builder-mobile-list {
          position: relative;
          z-index: 4;
        }

        .builder-mobile-outcome {
          display: grid;
          gap: 0.2rem;
          margin-top: 1rem;
          border: 1px solid rgb(8 45 35 / 10%);
          border-radius: 16px;
          background: rgb(255 253 247 / 86%);
          padding: 1rem;
          text-align: center;
          box-shadow: 0 14px 30px rgb(8 45 35 / 7%);
        }

        .builder-mobile-outcome p,
        .builder-mobile-outcome span {
          margin: 0;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .builder-mobile-state--problem .builder-mobile-outcome p,
        .builder-mobile-state--problem .builder-mobile-outcome strong,
        .builder-mobile-state--problem .builder-mobile-outcome span {
          color: var(--builder-coral);
        }

        .builder-mobile-state--solution .builder-mobile-outcome p,
        .builder-mobile-state--solution .builder-mobile-outcome strong,
        .builder-mobile-state--solution .builder-mobile-outcome span {
          color: var(--builder-green);
        }

        .builder-mobile-outcome strong {
          font-size: clamp(2.6rem, 15vw, 4.2rem);
          font-weight: 950;
          letter-spacing: -0.05em;
          line-height: 0.95;
        }

        .builder-cta--mobile {
          position: relative;
          top: auto;
          right: auto;
          width: 100%;
          min-width: 0;
          margin-top: 1rem;
          transform: none;
        }

        .builder-cta--mobile:hover,
        .builder-cta--mobile:active {
          transform: none;
        }
      }

      .builder-consulting {
        --about-paper: rgb(255 253 247);
        --about-paper-soft: rgb(250 244 235);
        --about-paper-warm: rgb(255 250 241);
        --about-ink: oklch(0.235 0.026 164);
        --about-orange: oklch(0.588 0.151 42.5);
        --about-blueprint: oklch(0.464 0.091 243.7);
        --about-display: var(--font-cormorant), Georgia, serif;
        --about-mono: var(--font-inter), ui-sans-serif, sans-serif;
        --builder-cream: var(--about-paper);
        --builder-paper: var(--about-paper-warm);
        --builder-forest: oklch(0.182 0.045 166);
        --builder-forest-soft: oklch(0.255 0.026 164);
        --builder-coral: oklch(0.588 0.151 42.5);
        --builder-coral-deep: oklch(0.48 0.14 41);
        --builder-green: oklch(0.39 0.09 153);
        --builder-blue: var(--about-blueprint);
        --builder-loss: oklch(0.61 0.22 31);
        --builder-loss-deep: oklch(0.45 0.18 29);
        --builder-line: rgb(18 44 37 / 28%);
        --builder-line-soft: rgb(18 44 37 / 16%);
        --builder-progress: 0;
        min-height: 100svh;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 19%, rgb(255 255 251 / 58%), transparent 31%),
          radial-gradient(circle at 82% 54%, rgb(255 92 52 / 7%), transparent 35%),
          linear-gradient(90deg, rgb(255 253 247 / 88%), rgb(250 244 235 / 62%)),
          url("/assets/heatherpapertexture.png"),
          url("/assets/diagonal_paperTexture.png"),
          linear-gradient(180deg, var(--about-paper) 0%, var(--about-paper-soft) 100%);
        background-blend-mode: normal, normal, normal, multiply, multiply, normal;
        background-size: auto, auto, auto, 420px 420px, 220px 220px, auto;
        color: var(--builder-forest);
        font-family: var(--about-mono);
      }

      .builder-consulting *,
      .builder-consulting *::before,
      .builder-consulting *::after {
        box-sizing: border-box;
        letter-spacing: 0;
      }

      .builder-editorial-shell {
        position: relative;
        z-index: 1;
        display: grid;
        width: 100%;
        max-width: none;
        min-height: 100svh;
        margin-inline: 0;
        overflow: hidden;
        padding: 30px 20px 36px;
      }

      .builder-section-rule {
        display: block;
        width: 100%;
        height: 2px;
        background: rgb(18 44 37 / 28%);
        transform-origin: left center;
      }

      .builder-desktop {
        display: none;
      }

      .builder-mobile {
        display: grid;
        gap: 1rem;
        padding: 1.15rem 0 0;
      }

      .builder-mobile-state {
        position: relative;
        overflow: hidden;
        border: 2px solid rgb(35 56 49 / 24%);
        border-radius: 0;
        background:
          linear-gradient(145deg, rgb(36 94 136 / 4%), transparent 42%),
          linear-gradient(180deg, rgb(255 253 247 / 76%), rgb(250 244 235 / 52%));
        padding: 1rem;
        box-shadow: none;
      }

      .builder-mobile-state--solution {
        border-color: rgb(35 56 49 / 28%);
      }

      .builder-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        width: fit-content;
        border: 0;
        border-radius: 0;
        background: transparent;
        padding: 0;
        color: var(--builder-coral);
        font-size: 0.76rem;
        font-weight: 900;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-eyebrow__icon {
        display: grid;
        width: 1.85rem;
        height: 1.85rem;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 4px;
        background: rgb(255 253 247 / 62%);
      }

      .builder-headline {
        max-width: 11.5ch;
        margin: 0.95rem 0 0;
        color: var(--builder-forest);
        font-family: var(--about-display);
        font-size: 3.55rem;
        font-weight: 400;
        line-height: 0.9;
        text-transform: uppercase;
        text-wrap: balance;
      }

      .builder-headline span {
        display: block;
        transform: none;
        transform-origin: left center;
        white-space: normal;
      }

      .builder-headline span:last-child {
        color: var(--builder-coral);
      }

      .builder-subheadline {
        max-width: 22rem;
        margin: 0.86rem 0 0;
        color: rgb(18 44 37 / 82%);
        font-family: var(--about-mono);
        font-size: 1.04rem;
        font-weight: 800;
        line-height: 1.22;
        text-wrap: pretty;
      }

      .builder-state-label {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.68rem;
        margin: 1.15rem 0 0.75rem;
      }

      .builder-state-label strong {
        color: var(--builder-coral);
        font-size: 0.72rem;
        font-weight: 950;
        text-transform: uppercase;
      }

      .builder-note,
      .builder-state-label span {
        color: rgb(36 94 136 / 82%);
        font-family: var(--about-mono);
        font-size: 0.8rem;
        font-weight: 800;
        line-height: 1.1;
        text-transform: none;
      }

      .builder-question-list,
      .builder-mobile-list {
        display: grid;
        gap: 0.5rem;
      }

      .builder-action-card-wrap {
        position: relative;
        width: min(17.5rem, 60%);
      }

      .builder-action-card {
        display: flex;
        min-height: 2.9rem;
        align-items: center;
        gap: 0.72rem;
        border: 1px solid rgb(18 44 37 / 20%);
        border-radius: 4px;
        background: rgb(255 253 247 / 72%);
        padding: 0.66rem 0.76rem;
        color: var(--builder-forest);
        box-shadow: none;
        font-size: 0.84rem;
        font-weight: 850;
        line-height: 1.18;
      }

      .builder-action-icon {
        display: grid;
        flex: 0 0 auto;
        width: 1.45rem;
        height: 1.45rem;
        place-items: center;
        border: 1.5px solid var(--builder-coral);
        border-radius: 50%;
        color: var(--builder-coral);
      }

      .builder-action-connector {
        position: absolute;
        top: 50%;
        left: calc(100% + 0.2rem);
        width: clamp(3.5rem, 6vw, 7rem);
        height: calc(1.85rem + var(--connector-offset));
        border-top: 1px dashed rgb(193 75 43 / 70%);
        border-right: 1px dashed rgb(193 75 43 / 70%);
        border-radius: 0;
        opacity: 0.72;
        transform: translateY(-1px);
      }

      .builder-action-connector::after {
        right: -0.25rem;
        bottom: -0.25rem;
        width: 0.46rem;
        height: 0.46rem;
        border: 1px solid var(--builder-coral);
        border-radius: 50%;
        background: var(--builder-cream);
      }

      .builder-house-visual {
        position: relative;
        min-height: 18rem;
        overflow: visible;
      }

      .builder-blueprint-field {
        position: absolute;
        inset: 2% 1% 8% 4%;
        border: 1px solid rgb(36 94 136 / 16%);
        background:
          linear-gradient(30deg, rgb(36 94 136 / 9%) 1px, transparent 1px 34px),
          linear-gradient(120deg, rgb(36 94 136 / 6%) 1px, transparent 1px 42px);
        opacity: 0.58;
        transform: skewY(-10deg) rotate(-3deg);
        -webkit-mask-image: radial-gradient(ellipse at 54% 54%, black 0 52%, transparent 76%);
        mask-image: radial-gradient(ellipse at 54% 54%, black 0 52%, transparent 76%);
      }

      .builder-house-crop {
        position: absolute;
        inset: -3% -12% -8% -5%;
        filter: grayscale(0.08) saturate(0.88) contrast(0.95) drop-shadow(0 24px 28px rgb(18 44 37 / 12%));
      }

      .builder-house-image {
        object-fit: contain;
        object-position: center bottom;
      }

      .builder-route-line {
        position: absolute;
        right: -2%;
        bottom: 8%;
        z-index: 3;
        width: min(80%, 35rem);
        overflow: visible;
      }

      .builder-route-line__shadow {
        stroke: rgb(18 44 37 / 16%);
        stroke-width: 8;
      }

      .builder-route-line__glow {
        stroke: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 88%), var(--builder-green) calc(var(--builder-progress) * 72%));
        stroke-width: 4;
        filter: none;
      }

      .builder-route-line__pin {
        fill: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 92%), var(--builder-green) calc(var(--builder-progress) * 80%));
        stroke: var(--builder-cream);
        stroke-width: 3;
      }

      .builder-dashboard {
        position: relative;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        z-index: 8;
        min-width: 0;
        width: 100%;
        height: 100%;
      }

      .builder-dashboard__title {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.85rem;
        margin: 0 0 0.62rem;
      }

      .builder-dashboard__title > p:first-child {
        min-width: 0;
        margin: 0;
        color: var(--builder-forest);
        font-size: 0.78rem;
        font-weight: 950;
        text-transform: uppercase;
      }

      .builder-dashboard__panel {
        position: relative;
        z-index: 8;
        min-height: 0;
        border: 2px solid rgb(18 44 37 / 18%);
        border-radius: 0;
        background:
          radial-gradient(circle at 79% 19%, rgb(255 255 251 / 58%), transparent 23rem),
          linear-gradient(180deg, rgb(255 253 247 / 64%), rgb(250 244 235 / 38%));
        padding: 0.9rem;
        box-shadow: none;
      }

      .builder-equation-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.74rem;
      }

      .builder-equation-row--bottom {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: 0.74rem;
      }

      .builder-equation-cell {
        position: relative;
        display: grid;
        min-width: 0;
      }

      .builder-equation-card,
      .builder-outcome-card {
        position: relative;
        overflow: hidden;
        border: 1px solid rgb(18 44 37 / 20%);
        border-radius: 0;
        background:
          linear-gradient(145deg, rgb(36 94 136 / 4%), transparent 42%),
          linear-gradient(180deg, rgb(255 253 247 / 72%), rgb(250 244 235 / 54%));
        box-shadow: none;
      }

      .builder-equation-card {
        display: flex;
        flex-direction: column;
        min-height: 12.4rem;
        padding: 0;
      }

      .builder-equation-card::before {
        right: 0.55rem;
        left: 0.55rem;
        background: rgb(18 44 37 / 16%);
      }

      .builder-equation-card__corner {
        width: 1.2rem;
        height: 1.2rem;
        opacity: 1;
      }

      .builder-equation-card__corner::before,
      .builder-equation-card__corner::after {
        border-radius: 0;
        background: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 70%), var(--builder-green) calc(var(--builder-progress) * 58%));
        box-shadow: none;
      }

      .builder-equation-card__corner::before {
        height: 2px;
      }

      .builder-equation-card__corner::after {
        width: 2px;
      }

      .builder-equation-card__header {
        padding: 0.76rem 0.78rem 0;
      }

      .builder-equation-card__animated-icon {
        display: grid;
        place-items: center;
        width: 1.45rem;
        height: 1.45rem;
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 70%), var(--builder-green) calc(var(--builder-progress) * 64%));
        opacity: 0.88;
      }

      .builder-equation-card [data-slot="card-title"] {
        margin: 0;
        color: rgb(18 44 37 / 68%);
        font-size: 0.78rem;
        font-weight: 900;
        line-height: 1.02;
        text-transform: uppercase;
      }

      .builder-equation-card__content {
        display: grid;
        flex: 1;
        align-content: start;
        gap: 0.16rem;
        padding: 0.5rem 0.78rem 0;
      }

      .builder-equation-card strong {
        display: block;
        color: var(--builder-forest);
        font-size: 1.65rem;
        font-weight: 950;
        line-height: 1;
        text-align: left;
        font-variant-numeric: tabular-nums;
      }

      .builder-equation-card p {
        min-height: 1.2em;
        margin: 0;
        color: var(--builder-forest);
        font-size: 0.64rem;
        font-weight: 900;
        line-height: 1.12;
        text-align: left;
        text-transform: uppercase;
      }

      .builder-metric-visual {
        height: 3.38rem;
        overflow: hidden;
      }

      .builder-semi-gauge {
        grid-template-columns: minmax(3.7rem, 0.92fr) minmax(0, 0.72fr);
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 86%), var(--builder-green) calc(var(--builder-progress) * 74%));
      }

      .builder-semi-gauge__rail {
        stroke: rgb(18 44 37 / 10%);
        stroke-width: 13;
      }

      .builder-semi-gauge__value {
        stroke-width: 13;
        filter: none;
      }

      .builder-semi-gauge span {
        color: var(--builder-forest);
        font-size: 1.02rem;
        font-weight: 950;
        line-height: 0.95;
        font-variant-numeric: tabular-nums;
      }

      .builder-semi-gauge em {
        color: rgb(18 44 37 / 58%);
        font-size: 0.5rem;
        font-weight: 850;
        line-height: 1.1;
        text-transform: uppercase;
      }

      .builder-metric-line-window {
        height: 2.8rem;
        margin-top: 0;
      }

      .builder-metric-line-chart {
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 86%), var(--builder-green) calc(var(--builder-progress) * 74%));
      }

      .builder-metric-line-chart__area {
        fill: currentColor;
        opacity: 0.14;
      }

      .builder-metric-line-chart__path {
        fill: none;
        stroke-width: 2.5;
        filter: none;
      }

      .builder-metric-line-caption {
        right: 0;
        bottom: 0;
        color: rgb(18 44 37 / 42%);
        font-size: 0.48rem;
        font-weight: 850;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-swap-text {
        min-width: max-content;
      }

      .builder-operator {
        top: 42%;
        right: calc(var(--builder-equation-gap, 1.44rem) / -2);
        color: rgb(18 44 37 / 86%);
        font-size: 1.55rem;
        font-weight: 950;
        transform: translateX(50%);
      }

      .builder-operator--equals {
        left: auto;
        font-size: 1.85rem;
      }

      .builder-outcome-card {
        min-height: 12.4rem;
        text-align: center;
      }

      .builder-outcome-card__header {
        border-bottom: 1px solid color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 20%), var(--builder-green) calc(var(--builder-progress) * 18%));
        background: rgb(255 253 247 / 58%);
        padding: 0.66rem 0.5rem;
        font-size: 0.66rem;
        font-weight: 950;
      }

      .builder-outcome-card__body {
        display: grid;
        justify-items: center;
        padding: 0.78rem 0.58rem 0.58rem;
      }

      .builder-outcome-card__label {
        margin: 0;
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 88%), var(--builder-green) calc(var(--builder-progress) * 76%));
        font-size: 0.76rem;
        font-weight: 950;
      }

      .builder-outcome-card strong {
        display: block;
        margin-top: 0.35rem;
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--builder-progress)) * 100%), var(--builder-forest) calc(var(--builder-progress) * 100%));
        font-size: 2.55rem;
        font-weight: 950;
        line-height: 0.9;
        font-variant-numeric: tabular-nums;
      }

      .builder-outcome-card__body > p:not(.builder-outcome-card__label) {
        margin: 0.42rem 0 0;
        color: var(--builder-forest);
        font-size: 0.68rem;
        font-weight: 950;
      }

      .builder-outcome-card__body > p:not(.builder-outcome-card__label) span:first-child {
        color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--builder-progress)) * 88%), var(--builder-green) calc(var(--builder-progress) * 76%));
        font-size: 1.25em;
      }

      .builder-risk-labels {
        color: rgb(18 44 37 / 58%);
        font-size: 0.52rem;
        font-weight: 900;
      }

      .builder-footnote {
        margin: 0.58rem 0 0;
        color: rgb(18 44 37 / 56%);
        font-size: 0.72rem;
        font-weight: 650;
      }

      .builder-bottom-strip {
        position: relative;
        min-height: 6.85rem;
        margin-bottom: 8px;
        overflow: hidden;
        border: 2px solid rgb(18 44 37 / 16%);
        border-radius: 0;
        background:
          linear-gradient(90deg, rgb(255 253 247 / 82%), rgb(250 244 235 / 58%)),
          rgb(255 250 241 / 54%);
        box-shadow: none;
      }

      .builder-bottom-strip__layer {
        display: grid;
        height: 50%;
        grid-template-columns: minmax(0, 1.18fr) minmax(22rem, 0.7fr) minmax(14rem, 0.36fr);
        align-items: center;
        gap: 1.25rem;
        padding: 0.68rem 1.05rem;
      }

      .builder-strip-proof {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .builder-strip-proof__item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 0.72rem;
        color: var(--builder-forest);
      }

      .builder-strip-proof__item:not(:last-child) {
        border-right: 1px solid rgb(18 44 37 / 18%);
        padding-right: 0.75rem;
      }

      .builder-strip-proof__item svg {
        width: 1.85rem;
        height: 1.85rem;
        color: rgb(18 44 37 / 86%);
      }

      .builder-strip-proof__item span {
        font-size: 0.76rem;
        font-weight: 850;
        line-height: 1.22;
      }

      .builder-strip-statement h3 {
        margin: 0;
        color: var(--builder-forest);
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: 1.48rem;
        font-weight: 700;
        line-height: 0.96;
      }

      .builder-strip-statement p {
        max-width: 29rem;
        margin: 0.3rem 0 0;
        color: var(--builder-forest);
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.08;
      }

      .builder-strip-statement strong {
        color: var(--builder-coral);
      }

      .builder-cta {
        position: absolute;
        top: 50%;
        right: 1.05rem;
        z-index: 4;
        display: inline-flex;
        width: max-content;
        min-width: 13.75rem;
        max-width: min(18rem, calc(100% - 2rem));
        min-height: 3.18rem;
        align-items: center;
        justify-content: space-between;
        gap: 0.9rem;
        border: 1px solid rgb(193 75 43 / 82%);
        border-radius: 4px;
        background: rgb(193 75 43 / 10%);
        padding: 0.52rem 0.52rem 0.52rem 0.92rem;
        color: var(--builder-coral-deep);
        box-shadow: none;
        font-size: 0.82rem;
        font-weight: 950;
        text-decoration: none;
        transform: translateY(-50%);
        transition:
          background 180ms ease-out,
          border-color 180ms ease-out,
          color 180ms ease-out,
          transform 180ms ease-out;
      }

      .builder-cta:hover {
        border-color: var(--builder-coral);
        background: rgb(193 75 43 / 16%);
        box-shadow: none;
        transform: translateY(-50%) translateX(0.12rem);
      }

      .builder-cta:active {
        transform: translateY(-50%) translateX(0.12rem) scale(0.985);
      }

      .builder-cta:focus-visible {
        outline: 2px solid rgb(36 94 136 / 72%);
        outline-offset: 3px;
      }

      .builder-cta__icon {
        flex: 0 0 auto;
        display: grid;
        width: 2.1rem;
        height: 2.1rem;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 50%;
      }

      .builder-cta__label {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .builder-cta-note {
        right: 1.2rem;
        bottom: -1.45rem;
        margin: 0;
        font-size: 0.72rem;
      }

      @media (min-width: 1371px) {
        .builder-editorial-shell {
          height: 100dvh;
          min-height: 0;
          grid-template-rows: 2px minmax(0, 1fr);
          padding: 1rem clamp(0.55rem, 0.8vw, 0.95rem) 1.1rem clamp(1.1rem, 2vw, 2rem);
        }

        .builder-desktop {
          display: grid;
          min-height: 0;
          grid-template-rows: minmax(0, 1fr) auto;
          gap: 0.78rem;
          padding: 0.78rem 0 0;
        }

        .builder-mobile {
          display: none;
        }

        .builder-main-grid {
          display: grid;
          min-height: 0;
          grid-template-columns: minmax(20rem, 0.29fr) minmax(0, 0.71fr);
          align-items: stretch;
          gap: 0.85rem;
          overflow: hidden;
        }

        .builder-dashboard {
          margin-right: 0;
        }

        .builder-left-stage {
          position: relative;
          min-height: min(34rem, calc(100dvh - 17.5rem));
          overflow: visible;
        }

        .builder-left-scroll-window {
          position: absolute;
          inset: 0;
          z-index: 4;
          overflow: hidden;
        }

        .builder-left-track {
          position: relative;
          height: 100%;
        }

        .builder-copy {
          position: absolute;
          inset: 0;
          display: grid;
          width: 100%;
          height: 100%;
          align-content: start;
          padding: 0.5rem 0 0 0.25rem;
        }

        .builder-copy--problem {
          z-index: 4;
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .builder-copy--solution {
          z-index: 5;
          padding-top: 0.5rem;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        .builder-left-stage .builder-house-visual {
          position: absolute;
          right: -3%;
          bottom: -0.8rem;
          left: 49%;
          z-index: 2;
          min-height: 20rem;
        }
      }

      @media (max-width: 1370px) and (min-width: 1024px) {
        .builder-main-grid {
          grid-template-columns: minmax(17.5rem, 0.28fr) minmax(0, 0.72fr);
          gap: 0.7rem;
        }

        .builder-left-stage {
          min-height: min(31rem, calc(100dvh - 16.5rem));
        }

        .builder-headline {
          font-size: 2.95rem;
        }

        .builder-subheadline {
          font-size: 0.92rem;
        }

        .builder-action-card-wrap {
          width: min(16.5rem, 58%);
        }

        .builder-action-card {
          min-height: 2.52rem;
          padding-block: 0.5rem;
          font-size: 0.74rem;
        }

        .builder-left-stage .builder-house-visual {
          left: 50%;
          min-height: 17.5rem;
        }

        .builder-equation-card,
        .builder-outcome-card {
          min-height: 10.6rem;
        }

        .builder-equation-card__header {
          padding-top: 0.58rem;
        }

        .builder-equation-card__content {
          padding-top: 0.38rem;
        }

        .builder-equation-card strong {
          font-size: 1.24rem;
        }

        .builder-equation-card p {
          font-size: 0.49rem;
        }

        .builder-metric-visual {
          height: 2.95rem;
        }

        .builder-metric-line-window {
          height: 2.34rem;
        }

        .builder-outcome-card strong {
          font-size: 2.06rem;
        }

      }

      @media (min-width: 1024px) and (max-height: 760px) {
        .builder-editorial-shell {
          padding-top: 0.72rem;
          padding-bottom: 0.78rem;
        }

        .builder-desktop {
          gap: 0.5rem;
          padding-top: 0.55rem;
        }

        .builder-main-grid {
          align-items: start;
        }

        .builder-left-stage {
          min-height: calc(100dvh - 13.8rem);
        }

        .builder-headline {
          margin-top: 0.62rem;
          font-size: 2.55rem;
        }

        .builder-subheadline {
          margin-top: 0.52rem;
          font-size: 0.82rem;
        }

        .builder-state-label {
          margin-top: 0.78rem;
          margin-bottom: 0.46rem;
        }

        .builder-action-card {
          min-height: 2.24rem;
          padding-block: 0.42rem;
          font-size: 0.66rem;
        }

        .builder-left-stage .builder-house-visual {
          bottom: -1.35rem;
          min-height: 17.4rem;
        }

        .builder-dashboard__title {
          margin-bottom: 0.34rem;
        }

        .builder-dashboard__panel {
          padding: 0.48rem;
        }

        .builder-equation-line + .builder-equation-line {
          margin-top: 0.38rem;
        }

        .builder-equation-row {
          gap: 0.58rem;
        }

        .builder-equation-row--bottom {
          margin-top: 0.58rem;
        }

        .builder-equation-card,
        .builder-outcome-card {
          min-height: 6.35rem;
        }

        .builder-equation-line .builder-equation-card,
        .builder-equation-line .builder-outcome-card {
          min-height: 6.35rem;
        }

        .builder-equation-card strong {
          font-size: 0.98rem;
        }

        .builder-equation-card p {
          font-size: 0.44rem;
        }

        .builder-metric-visual {
          height: 2.55rem;
        }

        .builder-metric-line-window {
          height: 1.55rem;
          margin-top: 0.16rem;
        }

        .builder-outcome-card strong {
          font-size: 1.34rem;
        }

        .builder-outcome-card__header {
          padding-block: 0.34rem;
        }

        .builder-outcome-card__body {
          padding: 0.42rem 0.42rem 0.36rem;
        }

        .builder-outcome-card__label {
          font-size: 0.54rem;
        }

        .builder-outcome-card__body > p:not(.builder-outcome-card__label) {
          margin-top: 0.22rem;
          font-size: 0.5rem;
        }

        .builder-risk-labels {
          font-size: 0.4rem;
        }

        .builder-bottom-strip {
          min-height: 5.15rem;
        }

        .builder-bottom-strip__layer {
          padding-block: 0.48rem;
        }

        .builder-strip-proof__item svg {
          width: 1.42rem;
          height: 1.42rem;
        }

        .builder-strip-proof__item span {
          font-size: 0.62rem;
        }

        .builder-strip-statement h3 {
          font-size: 1.3rem;
        }

        .builder-strip-statement p {
          font-size: 0.82rem;
        }

        .builder-cta {
          min-height: 2.6rem;
          min-width: 10.8rem;
          font-size: 0.72rem;
        }
      }

      @media (max-width: 1370px) {
        .builder-consulting {
          overflow: visible;
        }

        .builder-editorial-shell {
          overflow: hidden;
        }

        .builder-headline {
          max-width: 10.5ch;
          font-size: 3.15rem;
        }

        .builder-subheadline {
          font-size: 0.96rem;
        }

        .builder-mobile-stage {
          position: relative;
          display: grid;
          gap: 0.86rem;
          margin-top: 0.9rem;
        }

        .builder-mobile-stage .builder-house-visual {
          min-height: 15rem;
        }

        .builder-mobile-stage .builder-house-crop {
          inset: -4% -18% -9% -18%;
        }

        .builder-mobile-list {
          position: relative;
          z-index: 4;
        }

        .builder-mobile .builder-action-card {
          width: 100%;
          min-height: 2.62rem;
          font-size: 0.78rem;
        }

        .builder-mobile-outcome {
          display: grid;
          gap: 0.18rem;
          margin-top: 0.92rem;
          border: 1px solid rgb(18 44 37 / 20%);
          border-radius: 0;
          background: rgb(255 253 247 / 68%);
          padding: 0.86rem;
          box-shadow: none;
          text-align: left;
        }

        .builder-mobile-outcome p,
        .builder-mobile-outcome span {
          margin: 0;
          font-size: 0.68rem;
          font-weight: 950;
        }

        .builder-mobile-state--problem .builder-mobile-outcome p,
        .builder-mobile-state--problem .builder-mobile-outcome strong,
        .builder-mobile-state--problem .builder-mobile-outcome span {
          color: var(--builder-coral-deep);
        }

        .builder-mobile-state--solution .builder-mobile-outcome p,
        .builder-mobile-state--solution .builder-mobile-outcome strong,
        .builder-mobile-state--solution .builder-mobile-outcome span {
          color: var(--builder-green);
        }

        .builder-mobile-outcome strong {
          font-size: 2.7rem;
          font-weight: 950;
          line-height: 0.95;
          font-variant-numeric: tabular-nums;
        }

        .builder-cta--mobile {
          position: relative;
          top: auto;
          right: auto;
          width: 100%;
          min-width: 0;
          margin-top: 0.92rem;
          transform: none;
        }

        .builder-cta--mobile:hover,
        .builder-cta--mobile:active {
          transform: none;
        }
      }

      @media (max-width: 1370px) {
        .builder-mobile-state {
          display: grid;
          padding: clamp(0.78rem, 2.9vw, 1rem);
        }

        .builder-mobile-state--scroll {
          min-height: calc(100svh - clamp(8.5rem, 24vw, 12rem));
          align-content: start;
          grid-template-rows: auto minmax(0, 1fr) auto;
          gap: 0.68rem;
        }

        .builder-mobile-copy-window {
          position: relative;
          min-height: clamp(9.2rem, 35vw, 12.4rem);
          overflow: hidden;
        }

        .builder-mobile-copy-panel {
          position: absolute;
          inset: 0;
          display: grid;
          align-content: start;
        }

        .builder-mobile-copy-panel--problem {
          z-index: 4;
          opacity: 1;
        }

        .builder-mobile-copy-panel--solution {
          z-index: 5;
          opacity: 0;
          visibility: hidden;
        }

        .builder-mobile-copy-panel > [data-builder-state] {
          display: block;
          width: fit-content;
        }

        .builder-mobile-state > .builder-eyebrow {
          position: relative;
          z-index: 3;
          padding: 0.28rem 0.5rem;
          font-size: 0.62rem;
        }

        .builder-mobile-state .builder-headline {
          max-width: 100%;
          margin-top: 0.52rem;
          font-size: clamp(2.75rem, 11.8vw, 4.15rem);
          line-height: 0.84;
        }

        .builder-mobile-state .builder-subheadline {
          max-width: 25rem;
          margin-top: 0.45rem;
          font-size: clamp(0.88rem, 3.5vw, 1.08rem);
          line-height: 1.04;
        }

        .builder-mobile-stage {
          display: block;
          margin-top: 0;
          min-height: 0;
        }

        .builder-mobile-equation-board {
          --builder-green: var(--builder-coral) !important;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgb(18 44 37 / 22%);
          background:
            linear-gradient(145deg, rgb(36 94 136 / 6%), transparent 46%),
            linear-gradient(180deg, rgb(255 253 247), rgb(250 244 235));
          padding: 0.58rem;
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 62%);
        }

        .builder-mobile-equation-board::after {
          content: none;
        }

        .builder-mobile-equation-board__header,
        .builder-mobile-equation-grid,
        .builder-footnote--mobile {
          position: relative;
          z-index: 2;
        }

        .builder-mobile-equation-board__header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.48rem;
        }

        .builder-mobile-equation-board__header p {
          margin: 0;
          color: var(--builder-forest);
          font-size: 0.6rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .builder-mobile-equation-board__header span {
          color: var(--builder-blue);
          font-family: var(--font-inter), ui-sans-serif, sans-serif;
          font-size: 0.72rem;
          font-weight: 900;
          line-height: 1;
        }

        .builder-mobile-equation-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.38rem;
        }

        .builder-mobile-equation-cell {
          position: relative;
          min-width: 0;
        }

        .builder-mobile-equation-cell--outcome {
          grid-column: 1 / -1;
        }

        .builder-mobile-equation-cell .builder-operator {
          right: 0.28rem;
          bottom: 0.28rem;
          top: auto;
          z-index: 4;
          display: grid;
          width: 1.05rem;
          height: 1.05rem;
          place-items: center;
          border: 1px solid rgb(18 44 37 / 20%);
          background: rgb(255 253 247 / 74%);
          color: rgb(18 44 37 / 72%);
          font-size: 0.72rem;
          line-height: 1;
        }

        .builder-mobile-equation-cell--outcome .builder-operator {
          top: 0.46rem;
          right: auto;
          bottom: auto;
          left: 0.48rem;
          width: 1.2rem;
          height: 1.2rem;
        }

        .builder-mobile .builder-equation-card--compact,
        .builder-mobile .builder-outcome-card--compact {
          border: 1px solid rgb(18 44 37 / 18%);
          border-radius: 0;
          background: rgb(255 253 247);
          box-shadow: none;
          backdrop-filter: none;
        }

        .builder-mobile .builder-equation-card--compact {
          min-height: 4.25rem;
        }

        .builder-mobile .builder-equation-card--compact .builder-equation-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.34rem;
          padding: 0.44rem 0.5rem 0;
        }

        .builder-mobile .builder-equation-card--compact [data-slot="card-title"] {
          color: rgb(18 44 37 / 72%);
          font-size: 0.5rem;
          line-height: 1;
          white-space: normal;
        }

        .builder-equation-card__delta {
          flex: none;
          font-size: 0.5rem;
          font-weight: 950;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .builder-mobile-state--problem .builder-equation-card__delta,
        .builder-mobile-state--problem .builder-outcome-card--compact strong {
          color: var(--builder-coral-deep);
        }

        .builder-mobile-state--solution .builder-equation-card__delta,
        .builder-mobile-state--solution .builder-outcome-card--compact strong {
          color: var(--builder-green);
        }

        .builder-mobile .builder-equation-card--compact .builder-equation-card__content {
          display: grid;
          gap: 0.12rem;
          padding: 0.28rem 0.5rem 0.48rem;
        }

        .builder-mobile .builder-equation-card--compact strong {
          overflow-wrap: anywhere;
          color: var(--builder-forest);
          font-size: clamp(0.92rem, 4.6vw, 1.18rem);
          line-height: 0.95;
        }

        .builder-mobile .builder-equation-card--compact strong .builder-swap-text {
          display: grid;
          min-width: 0;
        }

        .builder-equation-card__static-label,
        .builder-equation-card__hint {
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .builder-equation-card__static-label {
          color: rgb(18 44 37 / 58%);
          font-size: 0.48rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .builder-equation-card__hint {
          color: rgb(18 44 37 / 66%);
          font-size: 0.52rem;
          font-weight: 750;
          line-height: 1.05;
        }

        .builder-mobile .builder-equation-card__static-label.builder-swap-text,
        .builder-mobile .builder-equation-card__hint.builder-swap-text,
        .builder-mobile .builder-outcome-card__label.builder-swap-text,
        .builder-mobile .builder-risk-labels .builder-swap-text,
        .builder-mobile-equation-board__header .builder-swap-text {
          display: grid;
          min-width: 0;
        }

        .builder-compact-score {
          display: flex;
          align-items: center;
          gap: 0.28rem;
          min-width: 0;
        }

        .builder-compact-score__track {
          position: relative;
          display: block;
          flex: 1;
          height: 0.22rem;
          overflow: hidden;
          background: rgb(18 44 37 / 12%);
        }

        .builder-compact-score__fill {
          display: block;
          width: var(--builder-card-score);
          height: 100%;
          background: color-mix(
            in oklch,
            var(--builder-coral) calc((1 - var(--builder-progress)) * 70%),
            var(--builder-green) calc(var(--builder-progress) * 68%)
          );
        }

        .builder-mobile-state--problem .builder-compact-score__fill {
          background: var(--builder-coral-deep);
        }

        .builder-mobile-state--solution .builder-compact-score__fill {
          background: var(--builder-green);
        }

        .builder-compact-score em {
          flex: none;
          color: rgb(18 44 37 / 58%);
          font-size: 0.48rem;
          font-style: normal;
          font-weight: 900;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .builder-mobile .builder-outcome-card--compact {
          min-height: 4.8rem;
        }

        .builder-mobile .builder-outcome-card--compact .builder-outcome-card__header {
          padding: 0.42rem 0.62rem 0;
          background: transparent;
          color: rgb(18 44 37 / 64%);
          font-size: 0.54rem;
          line-height: 1;
          text-align: right;
        }

        .builder-mobile .builder-outcome-card--compact .builder-outcome-card__body {
          display: grid;
          gap: 0.1rem;
          padding: 0.18rem 0.62rem 0.58rem;
        }

        .builder-mobile .builder-outcome-card--compact .builder-outcome-card__label,
        .builder-mobile .builder-outcome-card--compact p {
          margin: 0;
          color: rgb(18 44 37 / 68%);
          font-size: 0.55rem;
          font-weight: 950;
          letter-spacing: 0.1em;
          line-height: 1;
          text-transform: uppercase;
        }

        .builder-mobile .builder-outcome-card--compact strong {
          font-size: clamp(1.7rem, 8.4vw, 2.45rem);
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }

        .builder-mobile .builder-outcome-card--compact .builder-risk-labels {
          display: flex;
          justify-content: space-between;
          gap: 0.6rem;
          margin-top: 0.08rem;
          color: rgb(18 44 37 / 58%);
          font-size: 0.52rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }

        .builder-footnote--mobile {
          margin: 0.42rem 0 0;
          color: rgb(18 44 37 / 50%);
          font-size: 0.52rem;
          font-weight: 650;
          line-height: 1.2;
        }

        .builder-cta--mobile {
          min-height: 2.72rem;
          margin-top: 0.64rem;
          font-size: 0.72rem;
        }

        .builder-mobile-state--scroll .builder-cta--mobile {
          margin-top: 0;
        }

        .builder-mobile-state--scroll .builder-equation-card__delta,
        .builder-mobile-state--scroll .builder-outcome-card--compact strong {
          color: color-mix(
            in oklch,
            var(--builder-coral-deep) calc((1 - var(--builder-progress)) * 100%),
            var(--builder-green) calc(var(--builder-progress) * 100%)
          );
        }

        .builder-mobile-state--scroll .builder-outcome-card__label {
          color: color-mix(
            in oklch,
            var(--builder-coral) calc((1 - var(--builder-progress)) * 88%),
            var(--builder-green) calc(var(--builder-progress) * 76%)
          );
        }

        .builder-mobile-state--scroll .builder-cta {
          border-color: color-mix(
            in oklch,
            var(--builder-coral) calc((1 - var(--builder-progress)) * 82%),
            var(--builder-green) calc(var(--builder-progress) * 72%)
          );
          color: color-mix(
            in oklch,
            var(--builder-coral-deep) calc((1 - var(--builder-progress)) * 100%),
            var(--builder-green) calc(var(--builder-progress) * 92%)
          );
        }
      }

      @media (max-width: 520px) {
        .builder-editorial-shell {
          padding-inline: 12px;
        }

        .builder-headline {
          font-size: 2.65rem;
        }

        .builder-mobile-state {
          padding: 0.86rem;
        }
      }

      @media (max-width: 520px) {
        .builder-mobile-state {
          padding: 0.72rem;
        }

        .builder-mobile-state > .builder-eyebrow {
          padding: 0.24rem 0.44rem;
          font-size: 0.56rem;
        }

        .builder-mobile-copy-window {
          min-height: 8.6rem;
        }

        .builder-mobile-state .builder-headline {
          max-width: 100%;
          font-size: clamp(2.28rem, 12vw, 2.75rem);
        }

        .builder-mobile-state .builder-headline span {
          transform: none;
          white-space: normal;
          text-wrap: balance;
        }

        .builder-mobile-state .builder-subheadline {
          max-width: 21rem;
          margin-top: 0.38rem;
          font-size: 0.82rem;
        }

        .builder-mobile-stage {
          margin-top: 0.52rem;
        }

        .builder-mobile-equation-board {
          padding: 0.48rem;
        }

        .builder-mobile-equation-board__header {
          margin-bottom: 0.36rem;
        }

        .builder-mobile-equation-board__header p {
          font-size: 0.54rem;
        }

        .builder-mobile-equation-board__header span {
          font-size: 0.64rem;
        }

        .builder-mobile-equation-grid {
          gap: 0.32rem;
        }

        .builder-mobile .builder-equation-card--compact {
          min-height: 3.95rem;
        }

        .builder-mobile .builder-equation-card--compact .builder-equation-card__header {
          padding: 0.38rem 0.42rem 0;
        }

        .builder-mobile .builder-equation-card--compact .builder-equation-card__content {
          gap: 0.1rem;
          padding: 0.22rem 0.42rem 0.42rem;
        }

        .builder-mobile .builder-equation-card--compact strong {
          font-size: 0.94rem;
        }

        .builder-equation-card__static-label,
        .builder-equation-card__hint,
        .builder-compact-score em {
          font-size: 0.46rem;
        }

        .builder-mobile .builder-outcome-card--compact {
          min-height: 4.35rem;
        }

        .builder-mobile .builder-outcome-card--compact .builder-outcome-card__header {
          padding: 0.38rem 0.54rem 0;
          font-size: 0.5rem;
        }

        .builder-mobile .builder-outcome-card--compact .builder-outcome-card__body {
          padding: 0.16rem 0.54rem 0.52rem;
        }

        .builder-mobile .builder-outcome-card--compact strong {
          font-size: 1.76rem;
        }

        .builder-footnote--mobile {
          font-size: 0.48rem;
        }

        .builder-cta--mobile {
          min-height: 2.48rem;
          margin-top: 0.52rem;
        }
      }

      @media (max-width: 767px) {
        .builder-mobile {
          padding-block: clamp(3.2rem, 13vw, 4.5rem);
        }

        .builder-mobile-state--scroll {
          min-height: calc(100svh - clamp(6.4rem, 20vw, 8.4rem));
          grid-template-rows: auto minmax(0, 1fr) auto;
        }

        .builder-mobile-copy-window {
          min-height: clamp(10.5rem, 45vw, 13.5rem);
        }

        .builder-mobile-stage {
          min-height: 0;
          margin-top: 0.72rem;
          overflow: hidden;
        }

        .builder-mobile-state--scroll .builder-equation-line .builder-equation-card--compact,
        .builder-mobile-state--scroll .builder-equation-line .builder-outcome-card--compact {
          min-height: 3.45rem;
        }

        .builder-mobile-state--scroll .builder-equation-line .builder-equation-card--compact strong {
          font-size: clamp(0.82rem, 3.7vw, 1.02rem);
        }

        .builder-mobile-state--scroll .builder-equation-line .builder-outcome-card--compact strong {
          font-size: clamp(1.18rem, 6.1vw, 1.6rem);
        }

        .builder-mobile-state--scroll .builder-cta--mobile {
          margin-top: 0.72rem;
        }
      }

      .builder-consulting {
        --builder-progress: 1;
      }

      .builder-swap-text [data-builder-year] {
        grid-area: 1 / 1;
        opacity: 0;
        transform: translateY(115%);
      }

      .builder-swap-text [data-builder-year="2019"] {
        opacity: 1;
        transform: translateY(0);
      }

      .builder-copy--2019,
      .builder-mobile-copy-panel--2019 {
        z-index: 4;
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
      }

      .builder-copy--2023,
      .builder-copy--2026,
      .builder-mobile-copy-panel--2023,
      .builder-mobile-copy-panel--2026 {
        z-index: 5;
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      }

      .builder-copy--2026,
      .builder-mobile-copy-panel--2026 {
        z-index: 6;
      }

      .builder-equation-lines {
        display: block;
      }

      .builder-bottom-strip__track {
        height: 300%;
      }

      .builder-bottom-strip__layer {
        height: 33.333333%;
      }

      .builder-equation-line {
        --builder-equation-gap: clamp(0.64rem, 0.82vw, 0.92rem);
        --row-tone: 1;
        position: relative;
        display: grid;
        grid-template-columns: minmax(8.8rem, 0.72fr) repeat(6, minmax(0, 1fr));
        align-items: stretch;
        gap: var(--builder-equation-gap);
        min-width: 0;
      }

      .builder-equation-line--has-incentives {
        --builder-equation-gap: clamp(0.38rem, 0.48vw, 0.56rem);
        grid-template-columns:
          minmax(8.8rem, 0.72fr)
          repeat(3, minmax(0, 1fr))
          minmax(0, 1.55fr)
          repeat(3, minmax(0, 1fr));
      }

      .builder-equation-line + .builder-equation-line {
        margin-top: clamp(0.36rem, 0.52vw, 0.58rem);
      }

      .builder-equation-line--emerging {
        height: 0;
        max-height: 0;
        margin-top: 0;
        overflow: hidden;
        opacity: 0;
        transform: translateY(1.15rem);
      }

      .builder-equation-label {
        position: relative;
        display: grid;
        min-width: 0;
        align-content: center;
        gap: 0.26rem;
        overflow: hidden;
        border: 1px solid color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 26%), var(--builder-green) calc(var(--row-tone) * 24%));
        border-radius: 8px;
        background:
          linear-gradient(
            145deg,
            color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 11%), var(--builder-green) calc(var(--row-tone) * 10%)),
            transparent 62%
          ),
          rgb(255 253 247 / 78%);
        padding: clamp(0.42rem, 0.58vw, 0.62rem);
        text-transform: uppercase;
      }

      .builder-equation-line--primary .builder-equation-label {
        border-color: color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 42%), var(--builder-green) calc(var(--row-tone) * 26%)) !important;
        background:
          linear-gradient(
            145deg,
            color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 13%), var(--builder-green) calc(var(--row-tone) * 10%)),
            transparent 62%
          ),
          rgb(255 253 247 / 78%) !important;
      }

      .builder-equation-label span {
        width: fit-content;
        border: 1px solid color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 42%), var(--builder-green) calc(var(--row-tone) * 42%));
        border-radius: 999px;
        padding: 0.18rem 0.48rem;
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%));
        font-size: clamp(0.55rem, 0.62vw, 0.68rem);
        font-weight: 950;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .builder-equation-line--primary .builder-equation-label span {
        border-color: color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 52%), var(--builder-green) calc(var(--row-tone) * 42%)) !important;
        color: color-mix(in oklch, var(--builder-loss-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%)) !important;
      }

      .builder-equation-label strong {
        color: var(--builder-forest);
        font-size: clamp(0.82rem, 0.9vw, 1rem);
        font-weight: 950;
        line-height: 1;
      }

      .builder-equation-label--dense strong {
        font-size: clamp(0.72rem, 0.78vw, 0.9rem);
        letter-spacing: -0.02em;
      }

      .builder-copy .builder-eyebrow,
      .builder-mobile-copy-panel .builder-eyebrow {
        border-width: 2px;
        padding: 0.58rem 1rem;
        font-size: clamp(0.82rem, 0.92vw, 1rem);
        font-variant-numeric: tabular-nums;
      }

      .builder-dashboard__panel {
        display: block;
      }

      .builder-equation-narrative {
        position: absolute;
        inset: clamp(7rem, 7.4vw, 8.2rem) clamp(1.1rem, 2.8vw, 3rem) clamp(1rem, 1.4vw, 1.35rem);
        z-index: 4;
        display: grid;
        place-items: center;
        pointer-events: none;
      }

      .builder-equation-narrative__card {
        position: relative;
        isolation: isolate;
        display: block;
        width: min(88%, 52rem);
        height: clamp(8rem, 9.2vw, 10rem);
        overflow: visible;
        border: 2px solid var(--builder-forest);
        border-radius: 0;
        background: var(--landing-hero-lime, #96ec18);
        padding: 0;
        box-shadow: clamp(0.42rem, 0.6vw, 0.62rem) clamp(0.42rem, 0.6vw, 0.62rem) 0
          var(--builder-forest);
        color: var(--builder-forest);
      }

      .builder-equation-narrative__texture {
        position: absolute;
        inset: 0;
        z-index: 3;
        overflow: hidden;
        pointer-events: none;
        mix-blend-mode: multiply;
      }

      .builder-equation-narrative__texture > [aria-hidden='true'] {
        background-size: 18.75rem 18.75rem;
        filter: contrast(2.1) brightness(0.86);
      }

      .builder-equation-narrative__notch {
        position: absolute;
        top: -2px;
        right: -2px;
        width: clamp(1.2rem, 1.6vw, 1.65rem);
        height: clamp(0.8rem, 1vw, 1rem);
        z-index: 4;
        background: var(--builder-forest);
        clip-path: polygon(0 0, 62% 0, 62% 42%, 100% 42%, 100% 100%, 0 100%);
      }

      .builder-equation-narrative__viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .builder-equation-narrative__track {
        display: grid;
        width: 100%;
        height: 200%;
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      .builder-equation-narrative__message {
        display: grid;
        width: 100%;
        min-height: 0;
        align-content: center;
        padding: clamp(1.15rem, 1.8vw, 1.75rem) clamp(1.35rem, 2.4vw, 2.5rem);
      }

      .builder-equation-narrative__message--loss {
        background: var(--builder-loss);
      }

      .builder-equation-narrative__message p {
        display: grid;
        justify-items: start;
        gap: clamp(0.28rem, 0.48vw, 0.5rem);
        margin: 0;
        text-align: left;
      }

      .builder-equation-narrative__lead,
      .builder-equation-narrative__coda {
        display: block;
        color: var(--builder-forest);
        font-family: var(--font-inter), ui-sans-serif, sans-serif;
        text-wrap: balance;
      }

      .builder-equation-narrative__lead {
        font-size: clamp(0.78rem, 0.9vw, 0.98rem);
        font-weight: 850;
        letter-spacing: -0.015em;
        line-height: 1;
      }

      .builder-equation-narrative__message--premise strong {
        display: block;
        color: var(--builder-forest);
        font-size: clamp(1.18rem, 1.65vw, 1.9rem);
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1.05;
        text-wrap: balance;
      }

      .builder-equation-narrative__coda {
        font-size: clamp(0.98rem, 1.3vw, 1.42rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1;
      }

      .builder-equation-narrative__coda em {
        font-style: normal;
        font-size: 1.45em;
        font-weight: 950;
        letter-spacing: -0.045em;
      }

      .builder-equation-narrative__message--loss strong {
        display: block;
        max-width: 57ch;
        color: var(--builder-forest);
        font-size: clamp(1.08rem, 1.55vw, 1.72rem);
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1.08;
        text-wrap: balance;
      }

      .builder-equation-narrative__message--loss strong > span {
        font-size: 1.32em;
        font-weight: 950;
      }

      .builder-equation-narrative--compact {
        position: relative;
        inset: auto;
        z-index: 3;
        min-height: clamp(7rem, 23vw, 10rem);
        overflow: hidden;
        padding: clamp(0.8rem, 3vw, 1.2rem) clamp(0.55rem, 2.8vw, 0.85rem)
          clamp(1rem, 3.8vw, 1.35rem);
      }

      .builder-equation-narrative--compact .builder-equation-narrative__card {
        width: calc(100% - 0.45rem);
        height: clamp(7rem, 24vw, 8.6rem);
        box-shadow: 0.34rem 0.34rem 0 var(--builder-forest);
      }

      .builder-equation-narrative--compact .builder-equation-narrative__message {
        padding: clamp(0.78rem, 3.2vw, 1.05rem) clamp(0.85rem, 3.6vw, 1.25rem);
      }

      .builder-equation-narrative--compact .builder-equation-narrative__lead {
        font-size: clamp(0.66rem, 2.5vw, 0.78rem);
      }

      .builder-equation-narrative--compact .builder-equation-narrative__message--premise strong {
        font-size: clamp(0.88rem, 3.55vw, 1.12rem);
        line-height: 1.08;
      }

      .builder-equation-narrative--compact .builder-equation-narrative__coda {
        font-size: clamp(0.78rem, 3.1vw, 0.98rem);
      }

      .builder-equation-narrative--compact .builder-equation-narrative__message--loss strong {
        font-size: clamp(0.84rem, 3.35vw, 1.04rem);
        line-height: 1.1;
      }

      .builder-equation-line .builder-equation-label > span {
        padding: 0.28rem 0.62rem;
        font-size: clamp(0.72rem, 0.82vw, 0.9rem);
      }

      .builder-equation-label em {
        overflow: hidden;
        color: rgb(8 45 35 / 62%);
        font-size: clamp(0.54rem, 0.62vw, 0.68rem);
        font-style: normal;
        font-weight: 800;
        line-height: 1.12;
        text-overflow: ellipsis;
      }

      .builder-equation-line .builder-equation-card__header {
        padding: clamp(0.48rem, 0.56vw, 0.64rem) clamp(0.62rem, 0.78vw, 0.84rem) 0;
      }

      .builder-equation-line .builder-equation-card [data-slot="card-title"] {
        color: rgb(18 44 37 / 74%);
        font-size: clamp(0.78rem, 0.86vw, 0.98rem);
        letter-spacing: 0.1em;
      }

      .builder-equation-line .builder-equation-card__animated-icon {
        width: clamp(1.18rem, 1.34vw, 1.5rem);
        height: clamp(1.18rem, 1.34vw, 1.5rem);
      }

      .builder-equation-line .builder-equation-card,
      .builder-equation-line .builder-outcome-card {
        min-height: clamp(5rem, 5.6vw, 6.2rem);
        border-color: color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 30%), var(--builder-green) calc(var(--row-tone) * 28%));
        background:
          linear-gradient(180deg, rgb(255 253 247 / 82%), rgb(244 237 224 / 62%)),
          radial-gradient(circle at 50% 72%, color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 13%), var(--builder-green) calc(var(--row-tone) * 12%)), transparent 58%);
      }

      .builder-equation-line--primary .builder-equation-card,
      .builder-equation-line--primary .builder-outcome-card {
        border-color: color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 46%), var(--builder-green) calc(var(--row-tone) * 28%)) !important;
        background:
          linear-gradient(180deg, rgb(255 253 247 / 86%), rgb(244 237 224 / 66%)),
          radial-gradient(circle at 50% 72%, color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 16%), var(--builder-green) calc(var(--row-tone) * 12%)), transparent 58%) !important;
      }

      .builder-equation-line--primary .builder-equation-card__corner::before,
      .builder-equation-line--primary .builder-equation-card__corner::after {
        background: color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 92%), var(--builder-green) calc(var(--row-tone) * 84%)) !important;
        box-shadow:
          0 0 0 1px rgb(255 253 247 / 82%),
          0 0 12px color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 30%), var(--builder-green) calc(var(--row-tone) * 28%)) !important;
      }

      .builder-equation-card--timeline .builder-equation-card__content {
        gap: 0.16rem;
        padding-top: 0.34rem;
        padding-bottom: 0.42rem;
      }

      .builder-equation-card--timeline strong {
        min-width: 0;
        overflow-wrap: normal;
        color: var(--builder-forest);
        font-size: clamp(0.78rem, 18cqw, 1.82rem);
        letter-spacing: 0;
        white-space: nowrap;
      }

      .builder-equation-card--timeline {
        container-type: inline-size;
      }

      .builder-equation-line .builder-equation-card--dense-value strong {
        font-size: clamp(0.86rem, 1.08vw, 1.28rem);
        line-height: 1;
      }

      .builder-equation-card--timeline p {
        font-size: clamp(0.62rem, 0.7vw, 0.8rem);
      }

      .builder-equation-card__hint {
        color: rgb(8 45 35 / 62%);
        font-size: clamp(0.6rem, 0.68vw, 0.78rem);
        font-weight: 750;
        line-height: 1.08;
        text-transform: uppercase;
      }

      .builder-equation-line .builder-outcome-card__header {
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%));
      }

      .builder-equation-line--primary .builder-outcome-card__header {
        color: color-mix(in oklch, var(--builder-loss-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%)) !important;
      }

      .builder-equation-line .builder-outcome-card__label {
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%));
        font-size: clamp(0.62rem, 0.72vw, 0.82rem);
      }

      .builder-equation-line--primary .builder-outcome-card__label {
        color: color-mix(in oklch, var(--builder-loss-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%)) !important;
      }

      .builder-equation-line .builder-outcome-card strong {
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%));
        font-size: clamp(1.56rem, 2.16vw, 2.52rem);
      }

      .builder-equation-line .builder-outcome-card--textual strong {
        max-width: 100%;
        font-size: clamp(0.82rem, 1.06vw, 1.2rem);
        line-height: 1;
        letter-spacing: 0.01em;
        overflow-wrap: anywhere;
        text-align: center;
      }

      .builder-equation-line--primary .builder-outcome-card strong {
        color: color-mix(in oklch, var(--builder-loss-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%)) !important;
      }

      .builder-equation-line .builder-outcome-card__body > p:not(.builder-outcome-card__label) span:first-child {
        color: color-mix(in oklch, var(--builder-coral-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%));
      }

      .builder-equation-line--primary .builder-outcome-card__body > p:not(.builder-outcome-card__label) span:first-child {
        color: color-mix(in oklch, var(--builder-loss-deep) calc((1 - var(--row-tone)) * 100%), var(--builder-green) calc(var(--row-tone) * 100%)) !important;
      }

      .builder-equation-line .builder-operator--equals {
        right: calc(var(--builder-equation-gap) / -2);
        left: auto;
        transform: translateX(50%);
      }

      @media (min-width: 1024px) and (max-height: 760px) {
        .builder-equation-narrative {
          inset-block: 6.35rem 0.75rem;
        }

        .builder-equation-narrative__card {
          height: 6.35rem;
        }

        .builder-equation-narrative__message {
          padding-block: 0.8rem;
        }

        .builder-equation-line .builder-equation-card,
        .builder-equation-line .builder-outcome-card {
          min-height: 4.85rem;
        }

        .builder-equation-card--timeline .builder-equation-card__content {
          gap: 0.1rem;
          padding-top: 0.26rem;
          padding-bottom: 0.3rem;
        }

        .builder-equation-line .builder-equation-card [data-slot="card-title"] {
          font-size: 0.72rem;
        }

        .builder-equation-card--timeline strong {
          font-size: 1.12rem;
        }

        .builder-equation-card--timeline p,
        .builder-equation-card__hint {
          font-size: 0.52rem;
        }

        .builder-equation-line .builder-outcome-card strong {
          font-size: 1.42rem;
        }
      }

      @media (max-width: 1370px) {
        .builder-equation-lines {
          display: block;
        }

        .builder-equation-line {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.34rem;
        }

        .builder-equation-line--has-incentives {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .builder-equation-line + .builder-equation-line {
          margin-top: 0.44rem;
        }

        .builder-equation-label,
        .builder-equation-cell--profit {
          grid-column: 1 / -1;
        }

        .builder-equation-label {
          min-height: 0;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: baseline;
          column-gap: 0.48rem;
          background:
            linear-gradient(
              145deg,
              color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 11%), var(--builder-green) calc(var(--row-tone) * 10%)),
              transparent 62%
            ),
            rgb(255 253 247);
          padding: 0.46rem 0.52rem;
        }

        .builder-equation-line--primary .builder-equation-label {
          background:
            linear-gradient(
              145deg,
              color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 13%), var(--builder-green) calc(var(--row-tone) * 10%)),
              transparent 62%
            ),
            rgb(255 253 247) !important;
        }

        .builder-equation-label em {
          grid-column: 1 / -1;
        }

        .builder-equation-line .builder-equation-card--compact,
        .builder-equation-line .builder-outcome-card--compact {
          min-height: 4.55rem;
          background:
            linear-gradient(180deg, rgb(255 253 247), rgb(244 237 224)),
            radial-gradient(circle at 50% 72%, color-mix(in oklch, var(--builder-coral) calc((1 - var(--row-tone)) * 13%), var(--builder-green) calc(var(--row-tone) * 12%)), transparent 58%) !important;
          backdrop-filter: none;
        }

        .builder-equation-line--primary .builder-equation-card--compact,
        .builder-equation-line--primary .builder-outcome-card--compact {
          background:
            linear-gradient(180deg, rgb(255 253 247), rgb(244 237 224)),
            radial-gradient(circle at 50% 72%, color-mix(in oklch, var(--builder-loss) calc((1 - var(--row-tone)) * 16%), var(--builder-green) calc(var(--row-tone) * 12%)), transparent 58%) !important;
        }

        .builder-equation-line .builder-equation-card--compact strong {
          font-size: clamp(0.9rem, 4.1vw, 1.16rem);
        }

        .builder-equation-line .builder-equation-card--compact.builder-equation-card--dense-value strong {
          font-size: clamp(0.72rem, 3.15vw, 0.92rem);
        }

        .builder-equation-line .builder-operator {
          top: auto;
          right: 0.28rem;
          bottom: 0.28rem;
          left: auto;
        }

        .builder-equation-line .builder-operator--equals {
          right: 0.28rem;
          left: auto;
        }
      }

      @media (max-width: 520px) {
        .builder-equation-label {
          padding: 0.4rem 0.46rem;
        }

        .builder-equation-line .builder-equation-card--compact,
        .builder-equation-line .builder-outcome-card--compact {
          min-height: 4.12rem;
        }

        .builder-equation-line .builder-outcome-card--compact strong {
          font-size: clamp(1.34rem, 7vw, 1.82rem);
        }

        .builder-equation-line .builder-outcome-card--compact.builder-outcome-card--textual strong {
          font-size: clamp(0.88rem, 4.6vw, 1.12rem);
        }
      }

      @media (max-width: 767px) {
        .builder-consulting[data-builder-phone-static='true'] {
          --builder-progress: 0;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile {
          padding-block: 3.2rem;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-state--scroll {
          display: block;
          min-height: 0;
          padding: 0.92rem;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-copy-window {
          display: block;
          min-height: 0;
          overflow: visible;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-copy-panel {
          position: static;
          display: block;
          transform: none !important;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-copy-panel--2019 {
          clip-path: none !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-copy-panel--2023,
        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-copy-panel--2026 {
          display: none !important;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-state .builder-headline {
          max-width: 100%;
          margin-top: 0.56rem;
          font-size: clamp(2.18rem, 11vw, 2.65rem);
          line-height: 0.86;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-state .builder-subheadline {
          max-width: 24rem;
          font-size: 0.84rem;
          line-height: 1.14;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-stage {
          margin-top: 0.9rem;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile-equation-board {
          padding: 0.5rem;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile .builder-equation-card--compact,
        .builder-consulting[data-builder-phone-static='true'] .builder-mobile .builder-outcome-card--compact {
          min-height: 0;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile .builder-equation-card--compact strong {
          font-size: clamp(0.88rem, 4vw, 1.04rem);
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-mobile .builder-outcome-card--compact strong {
          font-size: clamp(1.48rem, 7.4vw, 2rem);
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-equation-card__static-label,
        .builder-consulting[data-builder-phone-static='true'] .builder-equation-card__hint {
          white-space: normal;
        }

        .builder-consulting[data-builder-phone-static='true'] .builder-cta--mobile {
          margin-top: 0.78rem;
        }
      }

      /* Keep outcome copy inside the card when the equation grid narrows. */
      .builder-outcome-card {
        min-width: 0;
        container-type: inline-size;
      }

      .builder-outcome-card__body,
      .builder-outcome-card strong,
      .builder-outcome-card__body > p:not(.builder-outcome-card__label) {
        min-width: 0;
        max-width: 100%;
      }

      .builder-outcome-card__header,
      .builder-outcome-card__body {
        overflow: hidden;
      }

      .builder-outcome-card:not(.builder-outcome-card--compact) strong {
        width: 100%;
        overflow-wrap: normal;
        white-space: nowrap;
        font-size: clamp(0.85rem, 16cqw, 3.85rem);
        letter-spacing: -0.065em;
      }

      .builder-outcome-card--dense-value strong {
        overflow-wrap: normal;
        white-space: nowrap;
      }

      .builder-outcome-card--dense-value:not(.builder-outcome-card--compact) strong {
        font-size: clamp(0.5rem, 14cqw, 2.9rem);
      }

      .builder-outcome-card--textual:not(.builder-outcome-card--compact) strong {
        font-size: clamp(0.82rem, 8.5cqw, 1.2rem);
        line-height: 1;
        letter-spacing: 0.01em;
      }

      .builder-outcome-card--compact.builder-outcome-card--textual strong {
        font-size: clamp(0.88rem, 4.6vw, 1.12rem);
        line-height: 1;
        letter-spacing: 0.01em;
      }

      .builder-equation-card--compact.builder-equation-card--dense-value strong {
        font-size: clamp(0.72rem, 3.15vw, 0.92rem);
        line-height: 1;
      }

      .builder-equation-card--dense-value {
        container-type: inline-size;
      }

      .builder-equation-card--timeline.builder-equation-card--dense-value strong {
        overflow-wrap: normal;
        white-space: nowrap;
        font-size: clamp(0.55rem, 13cqw, 1.28rem);
        letter-spacing: -0.02em;
      }

      .builder-equation-card--timeline.builder-equation-card--extra-dense-value strong {
        font-size: clamp(0.5rem, 9cqw, 1rem);
      }

      .builder-outcome-card__body > p:not(.builder-outcome-card__label) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 0.25em;
        line-height: 1.1;
        text-align: center;
      }

      .builder-risk-labels {
        min-width: 0;
        gap: 0.5rem;
        font-size: clamp(0.32rem, 5.3cqw, 0.58rem);
      }

      .builder-risk-labels > span {
        min-width: 0;
        flex: 1 1 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .builder-risk-labels > span:last-child {
        text-align: right;
      }

      @media (min-width: 1024px) and (max-width: 1370px) {
        .builder-outcome-card--dense-value:not(.builder-outcome-card--compact) strong {
          font-size: clamp(0.5rem, 12.5cqw, 2.9rem);
        }

        .builder-risk-labels > span {
          overflow: visible;
          text-overflow: clip;
          white-space: normal;
        }
      }

      .builder-equation-cell--profit {
        grid-template-columns: 1.35rem minmax(0, 1fr);
        align-items: center;
        column-gap: 0.38rem;
      }

      .builder-equation-cell--profit .builder-operator--equals {
        position: static;
        grid-column: 1;
        grid-row: 1;
        justify-self: center;
        width: auto;
        height: auto;
        border: 0;
        background: transparent;
        font-size: 1.35rem;
        transform: none;
      }

      .builder-equation-cell--profit .builder-outcome-card {
        grid-column: 2;
        grid-row: 1;
      }

      @media (min-width: 1371px) {
        .builder-equation-line {
          grid-template-columns: minmax(8.8rem, 0.72fr) repeat(5, minmax(0, 1fr));
          align-items: start;
        }

        .builder-equation-line--has-incentives {
          --builder-equation-gap: clamp(0.38rem, 0.48vw, 0.56rem);
          grid-template-columns:
            minmax(8.8rem, 0.72fr)
            repeat(3, minmax(0, 1fr))
            minmax(0, 1.55fr)
            repeat(2, minmax(0, 1fr));
        }

        .builder-equation-cell--profit {
          grid-column: 2 / -1;
        }

        .builder-equation-line .builder-equation-card {
          min-height: 5.8rem;
        }

        .builder-equation-cell--profit .builder-outcome-card {
          display: grid;
          height: 3.6rem !important;
          min-height: 3.6rem !important;
          grid-template-columns: minmax(5.6rem, 0.2fr) minmax(0, 1fr);
          text-align: left;
        }

        .builder-equation-cell--profit .builder-outcome-card__header {
          display: grid;
          place-items: center;
          border-right: 1px solid var(--builder-line);
          border-bottom: 0;
          padding: 0.2rem 0.5rem;
        }

        .builder-equation-cell--profit .builder-outcome-card__body {
          display: grid;
          grid-template-columns: auto auto;
          align-items: center;
          justify-content: start;
          justify-items: start;
          gap: 0.2rem 1rem;
          padding: 0.2rem 0.7rem;
        }

        .builder-equation-cell--profit .builder-outcome-card__label,
        .builder-equation-cell--profit .builder-risk-labels {
          display: none;
        }

        .builder-equation-cell--profit .builder-outcome-card strong,
        .builder-equation-cell--profit
          .builder-outcome-card__body
          > p:not(.builder-outcome-card__label) {
          margin: 0;
        }

        .builder-equation-cell--profit .builder-outcome-card strong {
          font-size: 1.4rem !important;
          line-height: 1;
        }

        .builder-equation-cell--profit
          .builder-outcome-card__body
          > p:not(.builder-outcome-card__label) {
          justify-content: flex-start;
          text-align: left;
        }
      }

      @media (min-width: 1371px) and (max-height: 850px) {
        .builder-consulting[data-builder-phase='2026']
          .builder-desktop
          .builder-equation-card__hint {
          display: none;
        }

        .builder-consulting[data-builder-phase='2026']
          .builder-desktop
          .builder-equation-card__content {
          padding-bottom: 0.3rem;
        }
      }

      .builder-motion-phases {
        display: none;
      }

      .builder-consulting[data-builder-motion-ready='true'] {
        min-height: 300svh;
        overflow: clip;
      }

      .builder-consulting[data-builder-motion-ready='true'] .builder-editorial-shell {
        position: sticky;
        top: 0;
        z-index: 2;
        height: 100svh;
      }

      .builder-consulting[data-builder-motion-ready='true'] .builder-motion-phases {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: grid;
        grid-template-rows: repeat(3, minmax(0, 1fr));
        pointer-events: none;
      }

      .builder-consulting[data-builder-motion-ready='true'] [data-builder-phase-marker] {
        display: block;
        min-height: 1px;
      }

      .builder-consulting[data-builder-motion-ready='true'] .builder-copy,
      .builder-consulting[data-builder-motion-ready='true'] .builder-mobile-copy-panel {
        opacity: 0;
        pointer-events: none;
        transform: translateY(12px);
        transition:
          opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s linear 380ms;
        visibility: hidden;
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2019'] .builder-copy--2019,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] .builder-copy--2023,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-copy--2026,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2019'] .builder-mobile-copy-panel--2019,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] .builder-mobile-copy-panel--2023,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-mobile-copy-panel--2026 {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
        transition-delay: 0ms;
        visibility: visible;
      }

      .builder-consulting[data-builder-motion-ready='true'] .builder-swap-text [data-builder-year] {
        opacity: 0;
        transform: translateY(12px);
        transition:
          opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2019'] [data-builder-year='2019'],
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] [data-builder-year='2023'],
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] [data-builder-year='2026'] {
        opacity: 1;
        transform: translateY(0);
      }

      .builder-consulting[data-builder-motion-ready='true'] .builder-bottom-strip__track,
      .builder-consulting[data-builder-motion-ready='true'] .builder-equation-narrative__track,
      .builder-consulting[data-builder-motion-ready='true'] .builder-equation-line--emerging,
      .builder-consulting[data-builder-motion-ready='true'] .builder-equation-narrative {
        transition:
          opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
          max-height 380ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2019'] {
        --builder-progress: 1;
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] {
        --builder-progress: 0;
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] {
        --builder-progress: 1;
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] .builder-equation-line--primary,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-equation-line--primary {
        --row-tone: 0;
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] .builder-bottom-strip__track {
        transform: translateY(-33.333333%);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-bottom-strip__track {
        transform: translateY(-66.666667%);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023'] .builder-equation-narrative__track,
      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-equation-narrative__track {
        transform: translateY(-50%);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-equation-narrative {
        opacity: 0;
        transform: translateY(-12px);
      }

      .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026'] .builder-equation-line--emerging {
        height: auto;
        max-height: 14rem;
        margin-top: clamp(0.36rem, 0.52vw, 0.58rem);
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 1370px) {
        .builder-consulting[data-builder-motion-ready='true'] {
          min-height: 300svh;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--primary {
          display: none;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-narrative {
          display: none;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging {
          max-height: 15rem;
          gap: 0.22rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-label em,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__static-label,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__hint,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-outcome-card__label,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-risk-labels {
          display: none;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-label {
          padding-block: 0.25rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card--compact {
          min-height: 2.35rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__header {
          padding: 0.22rem 0.42rem 0;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__content {
          gap: 0;
          padding: 0.08rem 0.42rem 0.24rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-outcome-card--compact {
          min-height: 2.85rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-outcome-card__header {
          padding: 0.2rem 0.5rem 0;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-outcome-card__body {
          gap: 0.04rem;
          padding: 0.08rem 0.5rem 0.24rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-outcome-card--compact strong {
          font-size: clamp(1rem, 5vw, 1.35rem);
        }
      }

      @media (max-width: 767px) {
        .builder-consulting[data-builder-motion-ready='true'] .builder-editorial-shell {
          top: var(--fairlend-public-header-height, 72px);
          height: calc(100svh - var(--fairlend-public-header-height, 72px));
          min-height: 0;
          grid-template-rows: 2px minmax(0, 1fr);
          padding: 0.75rem 0.75rem 1rem;
        }

        .builder-consulting[data-builder-motion-ready='true'] .builder-mobile {
          min-height: 0;
          padding: 0.75rem 0 0;
        }

        .builder-consulting[data-builder-motion-ready='true'] .builder-mobile-state--scroll {
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2023']
          .builder-mobile-copy-window,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-mobile-copy-window {
          min-height: clamp(12.75rem, 55vw, 14.5rem);
        }

        .builder-consulting[data-builder-motion-ready='true'] .builder-mobile-stage {
          min-height: 0;
          margin-top: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding-bottom: 0.25rem;
          scrollbar-color: var(--builder-forest) transparent;
          scrollbar-width: thin;
        }

        .builder-consulting[data-builder-motion-ready='true'] .builder-mobile-equation-board {
          overflow: visible;
        }

        .builder-consulting[data-builder-motion-ready='true']
          .builder-mobile-state--scroll
          .builder-equation-cell--profit {
          grid-template-columns: 1rem minmax(0, 1fr);
          column-gap: 0.25rem;
        }

        .builder-consulting[data-builder-motion-ready='true']
          .builder-mobile-state--scroll
          .builder-outcome-card--compact {
          min-height: 4rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-label em,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__static-label,
        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card__hint {
          display: block !important;
          overflow: visible;
          text-overflow: clip;
          white-space: normal;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging
          .builder-equation-card--compact {
          min-height: 3.5rem;
        }

        .builder-consulting[data-builder-motion-ready='true'][data-builder-phase='2026']
          .builder-equation-line--emerging {
          max-height: 60rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .builder-cta {
          transition: none;
        }

        .builder-consulting[data-builder-motion-ready='true'] *,
        .builder-consulting[data-builder-motion-ready='true'] *::before,
        .builder-consulting[data-builder-motion-ready='true'] *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  )
}

export function FairlendBuilderConsultingSection() {
  return (
    <FairlendPaperSection
      aria-label="Builder Consulting"
      className="builder-consulting relative isolate"
      data-builder-consulting
      data-builder-phase="2019"
      id="builder-consulting"
    >
      <BuilderConsultingStyles />
      <FairlendBuilderConsultingMotion />

      <FairlendPaperShell className="builder-editorial-shell">
        <span className="builder-section-rule" aria-hidden="true" />

        <div className="builder-desktop">
          <div className="builder-main-grid">
            <div className="builder-left-stage">
              <div className="builder-left-scroll-window">
                <div className="builder-left-track" data-builder-left-track>
                  {timelineYears.map((year) => (
                    <BuilderCopy key={year} year={year} />
                  ))}
                </div>
              </div>
            </div>
            <EquationDashboard />
          </div>
          <BuilderBottomStrip />
        </div>

        <div className="builder-mobile">
          <MobileScrollState />
        </div>
      </FairlendPaperShell>

      <div aria-hidden="true" className="builder-motion-phases">
        {timelineYears.map((year) => (
          <span data-builder-phase-marker={year} key={year} />
        ))}
      </div>
    </FairlendPaperSection>
  )
}
