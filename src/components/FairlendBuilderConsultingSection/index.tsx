'use client'

import Image from 'next/image'
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
import type { ComponentType, CSSProperties, SVGProps } from 'react'

import { FairlendSectionKicker } from '@/components/FairlendSectionKicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

import { FairlendBuilderConsultingMotion } from './Motion.client'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type BuilderMode = 'problem' | 'solution'
type EquationVariant = 'full' | 'compact'

const states = {
  problem: {
    mode: 'problem',
    eyebrow: 'Builder Consulting',
    headlineTop: 'THE OLD LUXURY HOME',
    headlineBottom: 'MATH STOPPED WORKING.',
    subheadline: 'For many single-family luxury builds, the inputs no longer support the outcome.',
    label: 'THE PROBLEM',
    note: '(the numbers are upside down)',
    panelNote: '(single-family luxury home)',
    cta: 'SEE THE SOLUTION',
    ctaNote: 'Scroll to rebuild the equation',
    cards: [
      { icon: CircleHelp, text: 'What lot should I buy?' },
      { icon: CircleHelp, text: 'How much can I pay?' },
      { icon: CircleHelp, text: 'How large should I build?' },
      { icon: CircleHelp, text: 'What should I spend per sq. ft.?' },
      { icon: CircleHelp, text: 'Will the resale support it?' },
    ],
    stripItems: [
      { icon: Scale, text: 'Luxury home economics have changed' },
      { icon: NotebookPen, text: 'Inputs must be re-underwritten' },
      { icon: TriangleAlert, text: 'Old assumptions create risk' },
    ],
    stripTitle: 'Land. Build. Sell. Lose?',
    stripCopy: 'When the inputs are wrong, the project goes into the red.',
    stripHighlight: 'into the red',
    outcomeLabel: 'EST. LOSS*',
    outcomeValue: '-$412K',
    margin: '-10.8%',
    riskLeft: 'HIGHER RISK',
    riskRight: 'NEGATIVE RETURN',
  },
  solution: {
    mode: 'solution',
    eyebrow: 'Builder Consulting',
    headlineTop: 'THE RIGHT INPUTS',
    headlineBottom: 'CHANGE THE OUTCOME.',
    subheadline:
      'We help builders rework the land, scope, and financing equation so a luxury home can pencil again.',
    label: 'THE SOLUTION',
    note: '(rebuild the equation)',
    panelNote: '(aligned inputs. better outcomes.)',
    cta: 'RUN MY NUMBERS',
    ctaNote: "Let's run your version",
    cards: [
      { icon: MapPinned, text: 'Buy the right lot' },
      { icon: Home, text: 'Right-size the program' },
      { icon: Calculator, text: 'Underwrite build cost' },
      { icon: Goal, text: 'Validate resale value' },
      { icon: Landmark, text: 'Structure the financing' },
    ],
    stripItems: [
      { icon: ClipboardPenLine, text: 'Re-underwritten land strategy' },
      { icon: SlidersHorizontal, text: 'Better cost discipline' },
      { icon: Crosshair, text: 'Smarter exit planning' },
    ],
    stripTitle: 'Land. Build. Sell. Profit.',
    stripCopy: 'When the inputs align, the project moves back into the black.',
    stripHighlight: 'into the black',
    outcomeLabel: 'EST. PROFIT*',
    outcomeValue: '$645K',
    margin: '14.6%',
    riskLeft: 'LOWER RISK',
    riskRight: 'POSITIVE RETURN',
  },
} as const

const equationCards = [
  {
    key: 'land',
    label: 'LAND PRICE',
    problemValue: '$2.45M',
    solutionValue: '$1.85M',
    sublabel: 'PER LOT',
    problemDelta: 32,
    solutionDelta: -24,
    problemHint: 'over feasible lot basis',
    solutionHint: 're-underwritten basis',
    problemScore: 86,
    solutionScore: 62,
    trend: [
      { period: 'A', problem: 72, solution: 54 },
      { period: 'B', problem: 78, solution: 56 },
      { period: 'C', problem: 84, solution: 58 },
      { period: 'D', problem: 91, solution: 55 },
      { period: 'E', problem: 96, solution: 52 },
    ],
  },
  {
    key: 'build',
    label: 'BUILD COST',
    problemValue: '$425',
    solutionValue: '$315',
    sublabel: 'PSF',
    problemDelta: 35,
    solutionDelta: -26,
    problemHint: 'cost drift vs target',
    solutionHint: 'disciplined psf target',
    problemScore: 88,
    solutionScore: 58,
    trend: [
      { period: 'A', problem: 61, solution: 52 },
      { period: 'B', problem: 68, solution: 49 },
      { period: 'C', problem: 74, solution: 46 },
      { period: 'D', problem: 82, solution: 44 },
      { period: 'E', problem: 90, solution: 41 },
    ],
  },
  {
    key: 'home',
    label: 'HOME PROGRAM',
    problemValue: '1 HOME',
    solutionValue: '1 HOME',
    problemSublabel: 'LUXURY SINGLE-FAMILY',
    solutionSublabel: 'RIGHT-SIZED LUXURY',
    problemDelta: -18,
    solutionDelta: 14,
    problemHint: 'scope load on margin',
    solutionHint: 'scope supports exit',
    problemScore: 54,
    solutionScore: 78,
    trend: [
      { period: 'A', problem: 65, solution: 50 },
      { period: 'B', problem: 63, solution: 56 },
      { period: 'C', problem: 59, solution: 61 },
      { period: 'D', problem: 55, solution: 67 },
      { period: 'E', problem: 48, solution: 74 },
    ],
  },
  {
    key: 'sale',
    label: 'EXPECTED SALE',
    problemValue: '$3.65M',
    solutionValue: '$4.65M',
    sublabel: 'AVG. SELL PRICE',
    problemDelta: -11,
    solutionDelta: 27,
    problemHint: 'exit value gap',
    solutionHint: 'validated resale value',
    problemScore: 46,
    solutionScore: 82,
    trend: [
      { period: 'A', problem: 66, solution: 64 },
      { period: 'B', problem: 62, solution: 69 },
      { period: 'C', problem: 59, solution: 74 },
      { period: 'D', problem: 55, solution: 82 },
      { period: 'E', problem: 51, solution: 91 },
    ],
  },
  {
    key: 'soft',
    label: 'SOFT COSTS',
    problemValue: '$310K',
    solutionValue: '$225K',
    sublabel: 'CONSULTANTS + PERMITS',
    problemDelta: 21,
    solutionDelta: -27,
    problemHint: 'uncontrolled allowance',
    solutionHint: 'cleaner allowance',
    problemScore: 76,
    solutionScore: 55,
    trend: [
      { period: 'A', problem: 55, solution: 48 },
      { period: 'B', problem: 61, solution: 44 },
      { period: 'C', problem: 69, solution: 42 },
      { period: 'D', problem: 73, solution: 39 },
      { period: 'E', problem: 79, solution: 36 },
    ],
  },
  {
    key: 'carry',
    label: 'CARRY COSTS',
    problemValue: '$185K',
    solutionValue: '$105K',
    sublabel: 'INTEREST + HOLDING',
    problemDelta: 42,
    solutionDelta: -43,
    problemHint: 'time cost pressure',
    solutionHint: 'tighter hold plan',
    problemScore: 84,
    solutionScore: 48,
    trend: [
      { period: 'A', problem: 52, solution: 42 },
      { period: 'B', problem: 61, solution: 39 },
      { period: 'C', problem: 69, solution: 35 },
      { period: 'D', problem: 76, solution: 33 },
      { period: 'E', problem: 88, solution: 30 },
    ],
  },
  {
    key: 'finance',
    label: 'FINANCE STRUCTURE',
    problemValue: '65%',
    solutionValue: '70%',
    sublabel: 'LTV RANGE',
    problemDelta: -8,
    solutionDelta: 8,
    problemHint: 'misaligned leverage',
    solutionHint: 'capital stack aligned',
    problemScore: 57,
    solutionScore: 72,
    trend: [
      { period: 'A', problem: 62, solution: 56 },
      { period: 'B', problem: 58, solution: 60 },
      { period: 'C', problem: 55, solution: 64 },
      { period: 'D', problem: 51, solution: 68 },
      { period: 'E', problem: 49, solution: 72 },
    ],
  },
] as const

function StateLayer({
  children,
  className,
  mode,
}: {
  children: React.ReactNode
  className?: string
  mode: BuilderMode
}) {
  return (
    <span className={className} data-builder-state={mode}>
      {children}
    </span>
  )
}

function BuilderEyebrow({ mode }: { mode?: BuilderMode }) {
  const label = mode ? states[mode].label.replace('THE ', '') : 'Builder Consulting'

  const content = (
    <span className="builder-eyebrow">
      <span className="builder-eyebrow__icon" aria-hidden="true">
        <PencilRuler className="size-3.5" strokeWidth={1.9} />
      </span>
      {label}
    </span>
  )

  if (!mode) return content
  return <StateLayer mode={mode}>{content}</StateLayer>
}

function BuilderFrameCorners() {
  return (
    <>
      <span aria-hidden="true" className="builder-frame-corner builder-frame-corner--tl" />
      <span aria-hidden="true" className="builder-frame-corner builder-frame-corner--tr" />
      <span aria-hidden="true" className="builder-frame-corner builder-frame-corner--br" />
      <span aria-hidden="true" className="builder-frame-corner builder-frame-corner--bl" />
    </>
  )
}

function BuilderSectionHeader() {
  return (
    <header className="builder-section-header">
      <div className="builder-section-header__copy">
        <div className="builder-model-label" aria-hidden="true">
          <span />
          <strong>The Fairlend Model</strong>
          <em>04 of 04</em>
        </div>
        <FairlendSectionKicker
          className="builder-section-kicker about-kicker-who"
          label="Builder Consulting"
          labelId="builder-consulting-title"
          number="04"
        />
        <p>
          Luxury build inputs, re-underwritten before land, scope, financing, and exit value go
          sideways.
        </p>
      </div>
      <div className="builder-section-ledger" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </header>
  )
}

function BuilderCopy({ mode }: { mode: BuilderMode }) {
  const state = states[mode]

  return (
    <div
      className={cn('builder-copy', `builder-copy--${mode}`)}
      data-builder-copy-panel
      data-builder-state={mode}
    >
      <BuilderEyebrow mode={mode} />
      <h2 className="builder-headline">
        <span>{state.headlineTop}</span>
        <span>{state.headlineBottom}</span>
      </h2>
      <p className="builder-subheadline">{state.subheadline}</p>
      <div className="builder-action-block">
        <p className="builder-state-label">
          <strong>{state.label}</strong>
          <span>{state.note}</span>
        </p>
        <div className="builder-question-list">
          {state.cards.map(({ icon: Icon, text }, index) => (
            <ActionCard icon={Icon} index={index} key={text} mode={mode} text={text} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  index,
  mode,
  text,
}: {
  icon: IconComponent
  index: number
  mode: BuilderMode
  text: string
}) {
  return (
    <div className="builder-action-card-wrap" data-builder-action-card={mode}>
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
          mode === 'solution' && 'builder-action-connector--solution',
        )}
        data-builder-connector
        style={{ '--connector-offset': `${index * 13}px` } as CSSProperties}
      />
    </div>
  )
}

function HouseVisual() {
  return (
    <div className="builder-house-visual" data-builder-house>
      <span className="builder-blueprint-field" aria-hidden="true" />
      <div className="builder-house-crop">
        <Image
          alt=""
          aria-hidden="true"
          className="builder-house-image"
          fill
          loading="eager"
          sizes="(min-width: 1024px) 43vw, 100vw"
          src="/assets/right-house-estate.webp"
        />
      </div>
      <svg className="builder-route-line" aria-hidden="true" viewBox="0 0 520 260">
        <path
          className="builder-route-line__shadow"
          d="M57 180 C95 217 178 237 274 230 C374 224 470 188 487 132"
        />
        <path
          className="builder-route-line__glow"
          d="M57 180 C95 217 178 237 274 230 C374 224 470 188 487 132"
        />
        <circle className="builder-route-line__pin" cx="487" cy="132" r="13" />
        <circle className="builder-route-line__pin-core" cx="487" cy="132" r="5" />
      </svg>
    </div>
  )
}

function MetricSemiGauge({ card }: { card: (typeof equationCards)[number] }) {
  const arcLength = 100
  const problemScore = Math.max(0, Math.min(card.problemScore, 100))

  return (
    <div
      className="builder-semi-gauge"
      data-builder-gauge
      data-problem-score={card.problemScore}
      data-solution-score={card.solutionScore}
    >
      <svg aria-hidden="true" viewBox="0 0 148 86">
        <path className="builder-semi-gauge__rail" d="M18 70 A56 56 0 0 1 130 70" />
        <path
          className="builder-semi-gauge__value"
          data-builder-gauge-value
          d="M18 70 A56 56 0 0 1 130 70"
          pathLength={arcLength}
          strokeDasharray={`${problemScore} ${arcLength - problemScore}`}
        />
        <path
          className="builder-semi-gauge__inner"
          data-builder-gauge-inner
          d="M36 70 A38 38 0 0 1 112 70"
          pathLength={arcLength}
          strokeDasharray={`${Math.max(18, problemScore - 14)} ${arcLength}`}
        />
      </svg>
      <span data-builder-gauge-score>{problemScore}%</span>
      <em>fit score</em>
    </div>
  )
}

function buildMetricLinePath(
  trend: (typeof equationCards)[number]['trend'],
  dataKey: 'problem' | 'solution',
) {
  const width = 180
  const height = 64
  const xPad = 5
  const yPad = 10
  const min = 30
  const max = 100
  const points = trend.map((point, index) => {
    const x = xPad + (index / Math.max(1, trend.length - 1)) * (width - xPad * 2)
    const normalized = (point[dataKey] - min) / (max - min)
    const y = height - yPad - Math.max(0, Math.min(1, normalized)) * (height - yPad * 2)
    return [Number(x.toFixed(2)), Number(y.toFixed(2))]
  })

  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
}

function buildMetricAreaPath(linePath: string) {
  return `${linePath} L 175 58 L 5 58 Z`
}

function MetricLineChart({ card }: { card: (typeof equationCards)[number] }) {
  const problemPath = buildMetricLinePath(card.trend, 'problem')
  const solutionPath = buildMetricLinePath(card.trend, 'solution')
  const problemArea = buildMetricAreaPath(problemPath)
  const solutionArea = buildMetricAreaPath(solutionPath)

  return (
    <div className="builder-metric-line-window">
      <svg
        aria-hidden="true"
        className="builder-metric-line-chart"
        preserveAspectRatio="none"
        viewBox="0 0 180 64"
      >
        <defs>
          <filter id={`builder-line-glow-${card.key}`} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`builder-line-fill-${card.key}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[18, 32, 46, 60].map((y) => (
          <path className="builder-metric-line-chart__grid" d={`M 5 ${y} L 175 ${y}`} key={y} />
        ))}
        <path
          className="builder-metric-line-chart__area"
          d={problemArea}
          data-builder-line-area
          data-problem-path={problemArea}
          data-solution-path={solutionArea}
          fill={`url(#builder-line-fill-${card.key})`}
        />
        <path
          className="builder-metric-line-chart__path"
          d={problemPath}
          data-builder-line
          data-problem-path={problemPath}
          data-solution-path={solutionPath}
          filter={`url(#builder-line-glow-${card.key})`}
        />
      </svg>
      <span className="builder-metric-line-caption">variance trend</span>
    </div>
  )
}

function getEquationCardState(card: (typeof equationCards)[number], mode: BuilderMode) {
  const sublabel = 'sublabel' in card ? card.sublabel : undefined
  const problemSublabel = 'problemSublabel' in card ? card.problemSublabel : sublabel
  const solutionSublabel = 'solutionSublabel' in card ? card.solutionSublabel : sublabel

  return {
    delta: mode === 'problem' ? card.problemDelta : card.solutionDelta,
    hint: mode === 'problem' ? card.problemHint : card.solutionHint,
    score: Math.max(0, Math.min(mode === 'problem' ? card.problemScore : card.solutionScore, 100)),
    sublabel: mode === 'problem' ? problemSublabel : solutionSublabel,
    value: mode === 'problem' ? card.problemValue : card.solutionValue,
  }
}

function formatEquationDelta(delta: number) {
  return `${delta > 0 ? '+' : ''}${delta}%`
}

function EquationCard({
  card,
  dynamic = false,
  mode = 'problem',
  variant = 'full',
}: {
  card: (typeof equationCards)[number]
  dynamic?: boolean
  mode?: BuilderMode
  variant?: EquationVariant
}) {
  const cardState = getEquationCardState(card, mode)
  const problemCardState = getEquationCardState(card, 'problem')
  const solutionCardState = getEquationCardState(card, 'solution')
  const counterKey = card.key === 'home' ? undefined : card.key

  if (variant === 'compact') {
    if (dynamic) {
      return (
        <Card className="builder-equation-card builder-equation-card--compact builder-equation-card--scroll">
          <CardHeader className="builder-equation-card__header">
            <CardTitle>{card.label}</CardTitle>
            <span className="builder-equation-card__delta builder-swap-text">
              <StateLayer mode="problem">{formatEquationDelta(problemCardState.delta)}</StateLayer>
              <StateLayer mode="solution">{formatEquationDelta(solutionCardState.delta)}</StateLayer>
            </span>
          </CardHeader>
          <CardContent className="builder-equation-card__content">
            <strong {...(counterKey ? { 'data-builder-counter': counterKey } : {})}>
              {counterKey ? (
                card.problemValue
              ) : (
                <span className="builder-swap-text">
                  <StateLayer mode="problem">{problemCardState.value}</StateLayer>
                  <StateLayer mode="solution">{solutionCardState.value}</StateLayer>
                </span>
              )}
            </strong>
            <p className="builder-equation-card__static-label builder-swap-text">
              <StateLayer mode="problem">{problemCardState.sublabel}</StateLayer>
              <StateLayer mode="solution">{solutionCardState.sublabel}</StateLayer>
            </p>
            <div
              className="builder-compact-score"
              aria-hidden="true"
              data-builder-compact-score
              data-problem-score={problemCardState.score}
              data-solution-score={solutionCardState.score}
            >
              <span className="builder-compact-score__track">
                <span
                  className="builder-compact-score__fill"
                  data-builder-compact-score-fill
                  style={
                    { '--builder-card-score': `${problemCardState.score}%` } as CSSProperties
                  }
                />
              </span>
              <em data-builder-compact-score-text>{problemCardState.score}%</em>
            </div>
            <p className="builder-equation-card__hint builder-swap-text">
              <StateLayer mode="problem">{problemCardState.hint}</StateLayer>
              <StateLayer mode="solution">{solutionCardState.hint}</StateLayer>
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card
        className={cn(
          'builder-equation-card builder-equation-card--compact',
          `builder-equation-card--${mode}`,
        )}
      >
        <CardHeader className="builder-equation-card__header">
          <CardTitle>{card.label}</CardTitle>
          <span className="builder-equation-card__delta">{formatEquationDelta(cardState.delta)}</span>
        </CardHeader>
        <CardContent className="builder-equation-card__content">
          <strong>{cardState.value}</strong>
          <p className="builder-equation-card__static-label">{cardState.sublabel}</p>
          <div className="builder-compact-score" aria-hidden="true">
            <span className="builder-compact-score__track">
              <span
                className="builder-compact-score__fill"
                style={{ '--builder-card-score': `${cardState.score}%` } as CSSProperties}
              />
            </span>
            <em>{cardState.score}%</em>
          </div>
          <p className="builder-equation-card__hint">{cardState.hint}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="builder-equation-card" data-builder-equation-card>
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
        <CardTitle>{card.label}</CardTitle>
      </CardHeader>
      <CardContent className="builder-equation-card__content">
        <strong {...(counterKey ? { 'data-builder-counter': counterKey } : {})}>
          {card.problemValue}
        </strong>
        <p className="builder-swap-text">
          <StateLayer mode="problem">{problemCardState.sublabel}</StateLayer>
          <StateLayer mode="solution">{solutionCardState.sublabel}</StateLayer>
        </p>
        <div className="builder-metric-visual">
          <MetricSemiGauge card={card} />
        </div>
        <MetricLineChart card={card} />
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

function MiniChart() {
  return (
    <svg className="builder-mini-chart" aria-hidden="true" viewBox="0 0 220 86">
      <defs>
        <linearGradient id="builder-loss-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="builder-profit-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.26" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <g className="builder-mini-chart__loss">
        <path
          d="M8 30 L28 40 L49 39 L70 50 L93 48 L114 59 L137 56 L158 68 L181 65 L208 78 L208 86 L8 86 Z"
          fill="url(#builder-loss-fill)"
        />
        <path d="M8 30 L28 40 L49 39 L70 50 L93 48 L114 59 L137 56 L158 68 L181 65 L208 78" />
      </g>
      <g className="builder-mini-chart__profit">
        <path
          d="M8 72 L31 65 L53 61 L75 52 L98 54 L120 43 L142 46 L164 36 L186 29 L208 20 L208 86 L8 86 Z"
          fill="url(#builder-profit-fill)"
        />
        <path d="M8 72 L31 65 L53 61 L75 52 L98 54 L120 43 L142 46 L164 36 L186 29 L208 20" />
      </g>
    </svg>
  )
}

function OutcomeCard({
  dynamic = false,
  mode = 'problem',
  variant = 'full',
}: {
  dynamic?: boolean
  mode?: BuilderMode
  variant?: EquationVariant
}) {
  const state = states[mode]

  if (variant === 'compact') {
    if (dynamic) {
      return (
        <Card className="builder-outcome-card builder-outcome-card--compact builder-outcome-card--scroll">
          <div className="builder-outcome-card__header">PROJECT OUTCOME</div>
          <div className="builder-outcome-card__body">
            <p className="builder-outcome-card__label builder-swap-text">
              <StateLayer mode="problem">{states.problem.outcomeLabel}</StateLayer>
              <StateLayer mode="solution">{states.solution.outcomeLabel}</StateLayer>
            </p>
            <strong data-builder-counter="outcome">{states.problem.outcomeValue}</strong>
            <p>
              <span data-builder-counter="margin">{states.problem.margin}</span>
              <span> PROJECT MARGIN</span>
            </p>
            <div className="builder-risk-labels">
              <span className="builder-swap-text">
                <StateLayer mode="problem">{states.problem.riskLeft}</StateLayer>
                <StateLayer mode="solution">{states.solution.riskLeft}</StateLayer>
              </span>
              <span className="builder-swap-text">
                <StateLayer mode="problem">{states.problem.riskRight}</StateLayer>
                <StateLayer mode="solution">{states.solution.riskRight}</StateLayer>
              </span>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <Card
        className={cn(
          'builder-outcome-card builder-outcome-card--compact',
          `builder-outcome-card--${mode}`,
        )}
      >
        <div className="builder-outcome-card__header">PROJECT OUTCOME</div>
        <div className="builder-outcome-card__body">
          <p className="builder-outcome-card__label">{state.outcomeLabel}</p>
          <strong>{state.outcomeValue}</strong>
          <p>{state.margin} PROJECT MARGIN</p>
          <div className="builder-risk-labels">
            <span>{state.riskLeft}</span>
            <span>{state.riskRight}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="builder-outcome-card">
      <div className="builder-outcome-card__header">PROJECT OUTCOME</div>
      <div className="builder-outcome-card__body">
        <p className="builder-swap-text builder-outcome-card__label">
          <StateLayer mode="problem">{states.problem.outcomeLabel}</StateLayer>
          <StateLayer mode="solution">{states.solution.outcomeLabel}</StateLayer>
        </p>
        <strong data-builder-counter="outcome">{states.problem.outcomeValue}</strong>
        <p>
          <span data-builder-counter="margin">{states.problem.margin}</span>
          <span> PROJECT MARGIN</span>
        </p>
        <MiniChart />
        <div className="builder-risk-labels">
          <span className="builder-swap-text">
            <StateLayer mode="problem">{states.problem.riskLeft}</StateLayer>
            <StateLayer mode="solution">{states.solution.riskLeft}</StateLayer>
          </span>
          <span className="builder-swap-text">
            <StateLayer mode="problem">{states.problem.riskRight}</StateLayer>
            <StateLayer mode="solution">{states.solution.riskRight}</StateLayer>
          </span>
        </div>
      </div>
    </Card>
  )
}

function MobileScrollEquationBoard() {
  return (
    <div className="builder-mobile-equation-board builder-mobile-equation-board--scroll">
      <div className="builder-mobile-equation-board__backdrop" aria-hidden="true">
        <HouseVisual />
      </div>
      <div className="builder-mobile-equation-board__header">
        <p className="builder-swap-text">
          <StateLayer mode="problem">{states.problem.label}</StateLayer>
          <StateLayer mode="solution">{states.solution.label}</StateLayer>
        </p>
        <span className="builder-swap-text">
          <StateLayer mode="problem">{states.problem.panelNote}</StateLayer>
          <StateLayer mode="solution">{states.solution.panelNote}</StateLayer>
        </span>
      </div>
      <div className="builder-mobile-equation-grid">
        {equationCards.map((card, index) => (
          <div className="builder-mobile-equation-cell" key={card.key}>
            <EquationCard card={card} dynamic variant="compact" />
            {index < equationCards.length - 1 ? <Operator value="+" /> : null}
          </div>
        ))}
        <div className="builder-mobile-equation-cell builder-mobile-equation-cell--outcome">
          <Operator value="=" />
          <OutcomeCard dynamic variant="compact" />
        </div>
      </div>
      <p className="builder-footnote builder-footnote--mobile">
        *Example only. Results vary based on market conditions and project specifics.
      </p>
    </div>
  )
}

function EquationDashboard() {
  return (
    <div className="builder-dashboard" data-builder-dashboard>
      <div className="builder-dashboard__title">
        <p className="builder-swap-text">
          <StateLayer mode="problem">{states.problem.label}</StateLayer>
          <StateLayer mode="solution">{states.solution.label}</StateLayer>
        </p>
        <p className="builder-swap-text builder-note">
          <StateLayer mode="problem">{states.problem.panelNote}</StateLayer>
          <StateLayer mode="solution">{states.solution.panelNote}</StateLayer>
        </p>
      </div>
      <div className="builder-dashboard__panel">
        <div className="builder-equation-row">
          {equationCards.slice(0, 4).map((card, index) => (
            <div className="builder-equation-cell" key={card.key}>
              <EquationCard card={card} />
              {index < 3 ? <Operator value="+" /> : null}
            </div>
          ))}
        </div>
        <div className="builder-equation-row builder-equation-row--bottom">
          {equationCards.slice(4).map((card) => (
            <div className="builder-equation-cell" key={card.key}>
              <EquationCard card={card} />
              <Operator value="+" />
            </div>
          ))}
          <div className="builder-equation-cell">
            <Operator value="=" />
            <OutcomeCard />
          </div>
        </div>
      </div>
      <p className="builder-footnote">
        *Example only. Results vary based on market conditions and project specifics.
      </p>
    </div>
  )
}

function BottomStripLayer({ mode }: { mode: BuilderMode }) {
  const state = states[mode]
  const [beforeHighlight, afterHighlight = ''] = state.stripCopy.split(state.stripHighlight)

  return (
    <div className="builder-bottom-strip__layer" data-builder-state={mode}>
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
        <BottomStripLayer mode="problem" />
        <BottomStripLayer mode="solution" />
      </div>
      <Link className="builder-cta" href="#contact">
        <span className="builder-swap-text">
          <StateLayer mode="problem">{states.problem.cta}</StateLayer>
          <StateLayer mode="solution">{states.solution.cta}</StateLayer>
        </span>
        <span className="builder-cta__icon" aria-hidden="true">
          <ArrowRight className="size-7" strokeWidth={1.55} />
        </span>
      </Link>
      <p className="builder-cta-note builder-note builder-swap-text">
        <StateLayer mode="problem">{states.problem.ctaNote}</StateLayer>
        <StateLayer mode="solution">{states.solution.ctaNote}</StateLayer>
      </p>
    </div>
  )
}

function MobileScrollState() {
  return (
    <article className="builder-mobile-state builder-mobile-state--scroll" data-builder-mobile-card>
      <div className="builder-mobile-copy-window">
        <div
          className="builder-mobile-copy-panel builder-mobile-copy-panel--problem"
          data-builder-mobile-copy
          data-builder-state="problem"
        >
          <BuilderEyebrow mode="problem" />
          <h2 className="builder-headline">
            <span>{states.problem.headlineTop}</span>
            <span>{states.problem.headlineBottom}</span>
          </h2>
          <p className="builder-subheadline">{states.problem.subheadline}</p>
        </div>
        <div
          className="builder-mobile-copy-panel builder-mobile-copy-panel--solution"
          data-builder-mobile-copy
          data-builder-state="solution"
        >
          <BuilderEyebrow mode="solution" />
          <h2 className="builder-headline">
            <span>{states.solution.headlineTop}</span>
            <span>{states.solution.headlineBottom}</span>
          </h2>
          <p className="builder-subheadline">{states.solution.subheadline}</p>
        </div>
      </div>
      <div className="builder-mobile-stage" data-builder-mobile-dashboard>
        <MobileScrollEquationBoard />
      </div>
      <Link className="builder-cta builder-cta--mobile" href="#contact">
        <span className="builder-swap-text">
          <StateLayer mode="problem">{states.problem.cta}</StateLayer>
          <StateLayer mode="solution">{states.solution.cta}</StateLayer>
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
        --builder-line: rgb(8 45 35 / 12%);
        --builder-progress: 0;
        background:
          radial-gradient(circle at 35% 24%, rgb(255 92 52 / 6%), transparent 24rem),
          linear-gradient(180deg, rgb(255 253 247) 0%, rgb(249 243 234) 100%);
        color: var(--builder-forest);
        font-family: Oxanium, var(--font-inter), ui-sans-serif, sans-serif;
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
        font-family: "League Gothic", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
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
        font-family: "Bradley Hand", "Comic Sans MS", cursive;
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
        will-change: transform;
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

      .builder-mini-chart {
        width: 100%;
        max-width: 12.6rem;
        height: 4.9rem;
        margin-top: 0.6rem;
        overflow: hidden;
      }

      .builder-mini-chart path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 4;
      }

      .builder-mini-chart__loss {
        color: var(--builder-coral);
        transform: translateY(calc(var(--builder-progress) * -110%));
      }

      .builder-mini-chart__profit {
        color: var(--builder-green);
        transform: translateY(calc((1 - var(--builder-progress)) * 110%));
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
        will-change: transform;
      }

      .builder-bottom-strip__layer {
        position: relative;
        display: grid;
        height: 50%;
        grid-template-columns: minmax(0, 1.35fr) minmax(21rem, 0.75fr) minmax(16rem, 0.54fr);
        align-items: center;
        gap: clamp(1rem, 2vw, 2.4rem);
        padding: 1rem clamp(1rem, 2.1vw, 2.4rem);
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
        font-size: clamp(1.55rem, 2.2vw, 2.45rem);
        font-weight: 700;
        line-height: 0.9;
      }

      .builder-strip-statement p {
        margin: 0.35rem 0 0;
        max-width: 30rem;
        font-family: var(--font-cormorant), Georgia, serif;
        font-size: clamp(1.05rem, 1.35vw, 1.42rem);
        font-weight: 600;
        line-height: 1.02;
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
        min-width: clamp(15rem, 18vw, 20rem);
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
        display: grid;
        width: clamp(2.35rem, 2.7vw, 3rem);
        height: clamp(2.35rem, 2.7vw, 3rem);
        place-items: center;
        border: 1.5px solid rgb(255 255 255 / 78%);
        border-radius: 999px;
      }

      .builder-cta-note {
        position: absolute;
        right: clamp(2.5rem, 5.3vw, 6rem);
        bottom: -2.1rem;
        z-index: 2;
        margin: 0;
      }

      @media (min-width: 1024px) {
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
          will-change: transform;
        }

        .builder-copy {
          position: absolute;
          inset: 0;
          display: grid;
          height: 100%;
          align-content: start;
          width: 100%;
          will-change: clip-path, transform;
        }

        .builder-copy--problem {
          z-index: 4;
          clip-path: inset(0);
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .builder-copy--solution {
          z-index: 5;
          padding-top: clamp(0.8rem, 1.4vw, 1.4rem);
          clip-path: inset(0 0 100% 0);
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

        .builder-mini-chart {
          height: 3.62rem;
          margin-top: 0.35rem;
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

      @media (max-width: 1023px) {
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
        --about-display: "League Gothic", Impact, "Arial Narrow", sans-serif;
        --about-mono: "Oxanium", "Arial Narrow", system-ui, sans-serif;
        --builder-cream: var(--about-paper);
        --builder-paper: var(--about-paper-warm);
        --builder-forest: oklch(0.182 0.045 166);
        --builder-forest-soft: oklch(0.255 0.026 164);
        --builder-coral: oklch(0.588 0.151 42.5);
        --builder-coral-deep: oklch(0.48 0.14 41);
        --builder-green: oklch(0.39 0.09 153);
        --builder-blue: var(--about-blueprint);
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
        width: min(100%, 1780px);
        min-height: 100svh;
        margin-inline: auto;
        overflow: hidden;
        padding: 30px 20px 36px;
      }

      .builder-frame-corner {
        position: absolute;
        z-index: 6;
        width: 2rem;
        height: 2rem;
        pointer-events: none;
      }

      .builder-frame-corner::before,
      .builder-frame-corner::after {
        position: absolute;
        background: rgb(18 44 37 / 42%);
        content: "";
      }

      .builder-frame-corner::before {
        width: 100%;
        height: 1px;
      }

      .builder-frame-corner::after {
        width: 1px;
        height: 100%;
      }

      .builder-frame-corner--tl {
        top: 18px;
        left: 18px;
      }

      .builder-frame-corner--tr {
        top: 18px;
        right: 18px;
      }

      .builder-frame-corner--br {
        right: 18px;
        bottom: 18px;
      }

      .builder-frame-corner--bl {
        bottom: 18px;
        left: 18px;
      }

      .builder-frame-corner--tr::before,
      .builder-frame-corner--tr::after,
      .builder-frame-corner--br::before,
      .builder-frame-corner--br::after {
        right: 0;
      }

      .builder-frame-corner--br::before,
      .builder-frame-corner--br::after,
      .builder-frame-corner--bl::before,
      .builder-frame-corner--bl::after {
        bottom: 0;
      }

      .builder-section-header {
        position: relative;
        z-index: 2;
        display: grid;
        gap: 1.25rem;
        align-items: end;
        padding: 0 0 1.25rem;
      }

      .builder-model-label {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        margin-bottom: 0.7rem;
        color: rgb(18 44 37 / 70%);
        font-size: 0.72rem;
        font-weight: 850;
        line-height: 1;
        text-transform: uppercase;
      }

      .builder-model-label span {
        width: 2.75rem;
        height: 1px;
        background: var(--builder-coral);
      }

      .builder-model-label strong,
      .builder-model-label em {
        font: inherit;
      }

      .builder-model-label em {
        color: var(--builder-coral);
        font-style: normal;
      }

      .builder-section-kicker {
        --about-text-color: var(--about-ink);
      }

      .builder-consulting .about-section-kicker span {
        font-size: 3.5rem;
      }

      .builder-consulting .about-section-kicker .about-kicker-slash {
        font-size: 2.2rem;
      }

      .builder-consulting .about-section-kicker p {
        font-size: 1.1rem;
      }

      .builder-section-header__copy > p {
        max-width: 43rem;
        margin: 0.9rem 0 0;
        color: rgb(18 44 37 / 82%);
        font-size: 1.08rem;
        font-weight: 800;
        line-height: 1.25;
        text-wrap: pretty;
      }

      .builder-section-ledger {
        display: none;
      }

      .builder-section-ledger span {
        display: block;
        width: 4.2rem;
        height: 0.42rem;
        border: 1px solid rgb(18 44 37 / 32%);
        background: rgb(173 143 111 / 28%);
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
        z-index: 8;
        min-width: 0;
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

      .builder-equation-card [data-slot="card-title"] {
        margin: 0;
        color: rgb(18 44 37 / 68%);
        font-size: 0.68rem;
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
        font-size: 0.58rem;
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

      .builder-metric-line-chart__path {
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
        right: -0.72rem;
        color: rgb(18 44 37 / 86%);
        font-size: 1.55rem;
        font-weight: 950;
      }

      .builder-operator--equals {
        left: -0.72rem;
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

      .builder-mini-chart {
        width: 100%;
        max-width: 11.5rem;
        height: 3.85rem;
        margin-top: 0.45rem;
      }

      .builder-mini-chart path {
        stroke-width: 2.7;
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
        min-height: 6.35rem;
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
        grid-template-columns: minmax(0, 1.24fr) minmax(19rem, 0.58fr) minmax(13rem, 0.32fr);
        align-items: center;
        gap: 1.25rem;
        padding: 0.85rem 1.05rem;
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
        font-family: "DM Serif Display", Georgia, serif;
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 0.95;
      }

      .builder-strip-statement p {
        max-width: 29rem;
        margin: 0.3rem 0 0;
        color: var(--builder-forest);
        font-family: "DM Serif Display", Georgia, serif;
        font-size: 1.02rem;
        font-weight: 600;
        line-height: 1.05;
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
        min-width: 12.5rem;
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
        display: grid;
        width: 2.1rem;
        height: 2.1rem;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 50%;
      }

      .builder-cta-note {
        right: 1.2rem;
        bottom: -1.45rem;
        margin: 0;
        font-size: 0.72rem;
      }

      @media (min-width: 1024px) {
        .builder-editorial-shell {
          height: 100dvh;
          min-height: 0;
          grid-template-rows: auto 2px minmax(0, 1fr);
          padding: 1rem clamp(1.1rem, 2vw, 2rem) 1.1rem;
        }

        .builder-section-header {
          grid-template-columns: minmax(0, 0.7fr) minmax(18rem, 0.3fr);
          min-height: 8.8rem;
          padding: 0.65rem 1rem 1.25rem;
        }

        .builder-section-ledger {
          display: flex;
          justify-content: flex-end;
          align-self: start;
          gap: 0.68rem;
          padding-top: 0.72rem;
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
          grid-template-columns: minmax(25rem, 0.42fr) minmax(47rem, 0.58fr);
          align-items: center;
          gap: 1.05rem;
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
          will-change: transform;
        }

        .builder-copy {
          position: absolute;
          inset: 0;
          display: grid;
          width: 100%;
          height: 100%;
          align-content: start;
          padding: 0.5rem 0 0 0.25rem;
          will-change: clip-path, transform;
        }

        .builder-copy--problem {
          z-index: 4;
          clip-path: inset(0);
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .builder-copy--solution {
          z-index: 5;
          padding-top: 0.5rem;
          clip-path: inset(0 0 100% 0);
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
        .builder-consulting .about-section-kicker span {
          font-size: 3.1rem;
        }

        .builder-consulting .about-section-kicker .about-kicker-slash {
          font-size: 1.95rem;
        }

        .builder-consulting .about-section-kicker p {
          font-size: 0.96rem;
        }

        .builder-section-header {
          min-height: 7.7rem;
          padding-bottom: 0.9rem;
        }

        .builder-section-header__copy > p {
          font-size: 0.94rem;
        }

        .builder-main-grid {
          grid-template-columns: minmax(23rem, 0.4fr) minmax(41rem, 0.6fr);
          gap: 0.8rem;
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

        .builder-mini-chart {
          height: 3.2rem;
        }
      }

      @media (min-width: 1024px) and (max-height: 760px) {
        .builder-editorial-shell {
          padding-top: 0.72rem;
          padding-bottom: 0.78rem;
        }

        .builder-section-header {
          min-height: 6.5rem;
          padding-top: 0.28rem;
          padding-bottom: 0.7rem;
        }

        .builder-model-label {
          margin-bottom: 0.44rem;
          font-size: 0.62rem;
        }

        .builder-consulting .about-section-kicker span {
          font-size: 2.6rem;
        }

        .builder-consulting .about-section-kicker .about-kicker-slash {
          font-size: 1.65rem;
        }

        .builder-consulting .about-section-kicker p {
          font-size: 0.86rem;
        }

        .builder-section-header__copy > p {
          margin-top: 0.5rem;
          font-size: 0.82rem;
        }

        .builder-desktop {
          gap: 0.5rem;
          padding-top: 0.55rem;
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
          margin-bottom: 0.42rem;
        }

        .builder-dashboard__panel {
          padding: 0.64rem;
        }

        .builder-equation-row {
          gap: 0.58rem;
        }

        .builder-equation-row--bottom {
          margin-top: 0.58rem;
        }

        .builder-equation-card,
        .builder-outcome-card {
          min-height: 9.2rem;
        }

        .builder-equation-card strong {
          font-size: 1.08rem;
        }

        .builder-equation-card p {
          font-size: 0.44rem;
        }

        .builder-metric-visual {
          height: 2.55rem;
        }

        .builder-metric-line-window {
          height: 2.04rem;
        }

        .builder-outcome-card strong {
          font-size: 1.72rem;
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

      @media (max-width: 1023px) {
        .builder-consulting {
          overflow: visible;
        }

        .builder-editorial-shell {
          overflow: hidden;
        }

        .builder-consulting .about-section-kicker span {
          font-size: 2.35rem;
        }

        .builder-consulting .about-section-kicker .about-kicker-slash {
          font-size: 1.55rem;
        }

        .builder-consulting .about-section-kicker p {
          font-size: 0.86rem;
        }

        .builder-section-header__copy > p {
          font-size: 0.92rem;
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

      @media (max-width: 1023px) {
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
          will-change: clip-path, opacity, transform;
        }

        .builder-mobile-copy-panel--problem {
          z-index: 4;
          clip-path: inset(0);
          opacity: 1;
        }

        .builder-mobile-copy-panel--solution {
          z-index: 5;
          clip-path: inset(0 0 100% 0);
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
          max-width: 11.2ch;
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
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgb(18 44 37 / 22%);
          background:
            linear-gradient(145deg, rgb(36 94 136 / 7%), transparent 46%),
            linear-gradient(180deg, rgb(255 253 247 / 76%), rgb(250 244 235 / 58%));
          padding: 0.58rem;
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 62%);
        }

        .builder-mobile-equation-board::after {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgb(255 253 247 / 30%), rgb(255 253 247 / 58%));
          content: "";
          pointer-events: none;
        }

        .builder-mobile-equation-board__backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.34;
          pointer-events: none;
        }

        .builder-mobile-equation-board__backdrop .builder-house-visual {
          position: absolute;
          inset: 8% -20% -18% 32%;
          min-height: auto;
          transform: scale(1.04);
        }

        .builder-mobile-equation-board__backdrop .builder-blueprint-field {
          opacity: 0.18;
          filter: blur(4px);
        }

        .builder-mobile-equation-board__backdrop .builder-house-crop {
          inset: -8% -28% -10% -20%;
          filter: blur(3px);
        }

        .builder-mobile-equation-board__backdrop .builder-house-image {
          object-fit: contain;
          opacity: 0.84;
          filter: saturate(0.84) contrast(0.95);
        }

        .builder-mobile-equation-board__backdrop .builder-route-line {
          opacity: 0.16;
          filter: blur(1.2px);
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
          font-family: "Bradley Hand", "Comic Sans MS", cursive;
          font-size: 0.72rem;
          font-weight: 700;
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
          background: rgb(255 253 247 / 78%);
          box-shadow: none;
          backdrop-filter: blur(7px);
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
          padding-inline: 16px;
        }

        .builder-frame-corner {
          width: 1.35rem;
          height: 1.35rem;
        }

        .builder-frame-corner--tl {
          top: 12px;
          left: 12px;
        }

        .builder-frame-corner--tr {
          top: 12px;
          right: 12px;
        }

        .builder-frame-corner--br {
          right: 12px;
          bottom: 12px;
        }

        .builder-frame-corner--bl {
          bottom: 12px;
          left: 12px;
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
          max-width: 10.8ch;
          font-size: clamp(2.28rem, 12vw, 2.75rem);
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

        .builder-mobile-equation-board__backdrop {
          opacity: 0.28;
        }

        .builder-mobile-equation-board__backdrop .builder-house-visual {
          inset: 10% -30% -20% 24%;
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

      @media (prefers-reduced-motion: reduce) {
        .builder-cta {
          transition: none;
        }
      }
    `}</style>
  )
}

export function FairlendBuilderConsultingSection() {
  return (
    <section
      aria-labelledby="builder-consulting-title"
      className="builder-consulting relative isolate scroll-mt-[88px]"
      data-builder-consulting
      id="builder-consulting"
    >
      <BuilderConsultingStyles />
      <FairlendBuilderConsultingMotion />

      <div className="builder-editorial-shell">
        <BuilderFrameCorners />
        <BuilderSectionHeader />
        <span className="builder-section-rule" aria-hidden="true" />

        <div className="builder-desktop">
          <div className="builder-main-grid">
            <div className="builder-left-stage">
              <div className="builder-left-scroll-window">
                <div className="builder-left-track" data-builder-left-track>
                  <BuilderCopy mode="problem" />
                  <BuilderCopy mode="solution" />
                </div>
              </div>
              <HouseVisual />
            </div>
            <EquationDashboard />
          </div>
          <BuilderBottomStrip />
        </div>

        <div className="builder-mobile">
          <MobileScrollState />
        </div>
      </div>
    </section>
  )
}
