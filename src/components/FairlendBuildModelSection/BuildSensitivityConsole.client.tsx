'use client'

import NumberFlow from '@number-flow/react'
import {
  IconBuildingCommunity,
  IconBuildingCottage,
  IconBuildingEstate,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
} from '@tabler/icons-react'
import { AnimatePresence, motion, type PanInfo, useReducedMotion } from 'motion/react'
import {
  type KeyboardEvent,
  type UIEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

const WHEEL_ITEM_HEIGHT = 38
const OPERATING_EXPENSE_RATIO = 0.2
const CAPITALIZATION_RATE = 0.04
const PROJECT_ALLOWANCE_RATIO = 0.2

type BuildScenario = {
  areaPerUnit: number
  defaultBuildCost: number
  defaultUnits: number
  icon: typeof IconHome
  label: string
  monthlyRentPerUnit: number
  unitsLocked: boolean
}

const buildTypes = [
  {
    label: 'Single family',
    areaPerUnit: 2_800,
    defaultUnits: 1,
    defaultBuildCost: 380,
    monthlyRentPerUnit: 5_500,
    unitsLocked: true,
    icon: IconHome,
  },
  {
    label: 'Single family luxury',
    areaPerUnit: 4_500,
    defaultUnits: 1,
    defaultBuildCost: 500,
    monthlyRentPerUnit: 9_000,
    unitsLocked: true,
    icon: IconBuildingEstate,
  },
  {
    label: 'Garden suite',
    areaPerUnit: 1_000,
    defaultUnits: 1,
    defaultBuildCost: 420,
    monthlyRentPerUnit: 2_700,
    unitsLocked: true,
    icon: IconBuildingCottage,
  },
  {
    label: 'Multi-plex',
    areaPerUnit: 1_500,
    defaultUnits: 4,
    defaultBuildCost: 310,
    monthlyRentPerUnit: 4_000,
    unitsLocked: false,
    icon: IconBuildingCommunity,
  },
] as const satisfies readonly BuildScenario[]

const buildTypeMotion = {
  center: {
    filter: 'blur(0px)',
    opacity: 1,
    rotateY: 0,
    scale: 1,
    x: 0,
  },
  enter: (direction: number) => ({
    filter: 'blur(4px)',
    opacity: 0,
    rotateY: direction * -34,
    scale: 0.84,
    x: direction * 76,
  }),
  exit: (direction: number) => ({
    filter: 'blur(4px)',
    opacity: 0,
    rotateY: direction * 34,
    scale: 0.84,
    x: direction * -76,
  }),
}

const buildTypeLabelMotion = {
  center: { filter: 'blur(0px)', opacity: 1, y: 0 },
  enter: (direction: number) => ({ filter: 'blur(3px)', opacity: 0, y: direction * 12 }),
  exit: (direction: number) => ({ filter: 'blur(3px)', opacity: 0, y: direction * -12 }),
}

const landValues = Array.from({ length: 33 }, (_, index) => 400_000 + index * 50_000)
const multiPlexUnitValues = Array.from({ length: 11 }, (_, index) => index + 2)
const lockedUnitValue = [1] as const
const buildCostValues = Array.from({ length: 61 }, (_, index) => 200 + index * 5)
const exitValueOptions = Array.from({ length: 116 }, (_, index) => 500_000 + index * 100_000)

function formatCompactCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }

  return `$${Math.round(value / 1_000)}K`
}

function formatArea(value: number) {
  return `${new Intl.NumberFormat('en-CA').format(value)} ft²`
}

function roundTo(value: number, increment: number) {
  return Math.round(value / increment) * increment
}

function getScenarioExitValue(scenario: BuildScenario, unitCount: number) {
  const annualGrossRent = scenario.monthlyRentPerUnit * unitCount * 12
  const netOperatingIncome = annualGrossRent * (1 - OPERATING_EXPENSE_RATIO)
  return roundTo(netOperatingIncome / CAPITALIZATION_RATE, 100_000)
}

type ModelDriver = 'buildType' | 'units' | 'land' | 'buildCost' | 'exit'
type ModelColumn = ModelDriver | 'profit'

type ModelState = {
  buildCostOverride: number | null
  buildTypeIndex: number
  exitValuePerUnitOverride: number | null
  impactRevision: number
  landValue: number
  lastDriver: ModelDriver
  unitCount: number
}

type ModelAction =
  | { index: number; type: 'selectBuildType' }
  | { type: 'setUnits'; value: number }
  | { type: 'setLand'; value: number }
  | { type: 'setBuildCost'; value: number }
  | { type: 'setExitValue'; value: number }

const initialModelState: ModelState = {
  buildCostOverride: null,
  buildTypeIndex: 3,
  exitValuePerUnitOverride: null,
  impactRevision: 0,
  landValue: 950_000,
  lastDriver: 'buildType',
  unitCount: 4,
}

const impactedColumns: Record<ModelDriver, readonly ModelColumn[]> = {
  buildType: ['buildType', 'units', 'buildCost', 'exit', 'profit'],
  units: ['buildType', 'units', 'buildCost', 'exit', 'profit'],
  land: ['land', 'profit'],
  buildCost: ['buildCost', 'profit'],
  exit: ['exit', 'profit'],
}

function modelReducer(state: ModelState, action: ModelAction): ModelState {
  switch (action.type) {
    case 'selectBuildType': {
      const nextScenario = buildTypes[action.index]
      if (!nextScenario || action.index === state.buildTypeIndex) return state

      return {
        ...state,
        buildCostOverride: null,
        buildTypeIndex: action.index,
        exitValuePerUnitOverride: null,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'buildType',
        unitCount: nextScenario.defaultUnits,
      }
    }
    case 'setUnits': {
      const currentScenario = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
      if (
        currentScenario.unitsLocked ||
        action.value < 2 ||
        action.value > 12 ||
        action.value === state.unitCount
      ) {
        return state
      }

      return {
        ...state,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'units',
        unitCount: action.value,
      }
    }
    case 'setLand':
      if (action.value === state.landValue) return state
      return {
        ...state,
        impactRevision: state.impactRevision + 1,
        landValue: action.value,
        lastDriver: 'land',
      }
    case 'setBuildCost': {
      const currentScenario = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
      const currentBuildCost = state.buildCostOverride ?? currentScenario.defaultBuildCost
      if (action.value === currentBuildCost) return state

      return {
        ...state,
        buildCostOverride: action.value,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'buildCost',
      }
    }
    case 'setExitValue': {
      const currentScenario = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
      const currentExitValue = state.exitValuePerUnitOverride
        ? roundTo(state.exitValuePerUnitOverride * state.unitCount, 100_000)
        : getScenarioExitValue(currentScenario, state.unitCount)
      if (action.value === currentExitValue) return state

      return {
        ...state,
        exitValuePerUnitOverride: action.value / state.unitCount,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'exit',
      }
    }
  }
}

function DependencyPulse({ pulseKey }: { pulseKey: number }) {
  const shouldReduceMotion = useReducedMotion()
  if (!pulseKey || shouldReduceMotion) return null

  return (
    <motion.span
      animate={{ opacity: 0 }}
      aria-hidden="true"
      className="bm-dependency-pulse"
      initial={{ opacity: 1 }}
      key={pulseKey}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}

function DerivedValues({ values }: { values: readonly string[] }) {
  const shouldReduceMotion = useReducedMotion()
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.span
        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        className="bm-derived-values"
        exit={{ filter: 'blur(2px)', opacity: 0, y: -5 }}
        initial={{ filter: 'blur(2px)', opacity: 0, y: 5 }}
        key={values.join('|')}
        transition={transition}
      >
        {values.map((value) => (
          <small key={value}>{value}</small>
        ))}
      </motion.span>
    </AnimatePresence>
  )
}

type WheelPickerProps = {
  annotation: string
  details: readonly string[]
  disabled?: boolean
  formatValue: (value: number) => string
  label: string
  onChange: (value: number) => void
  options: readonly number[]
  pulseKey: number
  value: number
}

function WheelPicker({
  annotation,
  details,
  disabled = false,
  formatValue,
  label,
  onChange,
  options,
  pulseKey,
  value,
}: WheelPickerProps) {
  const shouldReduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const programmaticTargetRef = useRef<number | null>(null)
  const hasMountedRef = useRef(false)
  const selectedIndex = Math.max(0, options.indexOf(value))
  const labelId = `bm-wheel-label-${label.toLowerCase().replaceAll(' ', '-')}`

  const clearScrollEndTimer = () => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
  }

  const scrollToIndex = (index: number, behavior?: ScrollBehavior) => {
    if (disabled) return
    const nextIndex = Math.min(options.length - 1, Math.max(0, index))
    programmaticTargetRef.current = nextIndex
    clearScrollEndTimer()
    viewportRef.current?.scrollTo({
      top: nextIndex * WHEEL_ITEM_HEIGHT,
      behavior: behavior ?? (shouldReduceMotion ? 'auto' : 'smooth'),
    })
    onChange(options[nextIndex] ?? options[0] ?? value)
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const currentIndex = Math.round(viewport.scrollTop / WHEEL_ITEM_HEIGHT)
    if (currentIndex === selectedIndex) {
      programmaticTargetRef.current = null
      hasMountedRef.current = true
      return
    }

    programmaticTargetRef.current = selectedIndex
    viewport.scrollTo({
      top: selectedIndex * WHEEL_ITEM_HEIGHT,
      behavior: hasMountedRef.current && !shouldReduceMotion ? 'smooth' : 'auto',
    })
    hasMountedRef.current = true

    clearScrollEndTimer()
    scrollEndTimerRef.current = setTimeout(
      () => {
        programmaticTargetRef.current = null
      },
      shouldReduceMotion ? 0 : 520,
    )
  }, [selectedIndex, shouldReduceMotion])

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      clearScrollEndTimer()
    },
    [],
  )

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (disabled) return
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)

    const scrollTop = event.currentTarget.scrollTop
    animationFrameRef.current = requestAnimationFrame(() => {
      const nextIndex = Math.min(
        options.length - 1,
        Math.max(0, Math.round(scrollTop / WHEEL_ITEM_HEIGHT)),
      )

      if (programmaticTargetRef.current !== null) {
        if (
          nextIndex === programmaticTargetRef.current &&
          Math.abs(scrollTop - nextIndex * WHEEL_ITEM_HEIGHT) < 1
        ) {
          clearScrollEndTimer()
          scrollEndTimerRef.current = setTimeout(() => {
            programmaticTargetRef.current = null
          }, 80)
        }
        return
      }

      const nextValue = options[nextIndex]
      if (nextValue !== undefined && nextValue !== value) onChange(nextValue)
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const keyActions: Partial<Record<string, number>> = {
      ArrowDown: selectedIndex + 1,
      ArrowUp: selectedIndex - 1,
      End: options.length - 1,
      Home: 0,
      PageDown: selectedIndex + 5,
      PageUp: selectedIndex - 5,
    }
    const nextIndex = keyActions[event.key]

    if (nextIndex !== undefined) {
      event.preventDefault()
      scrollToIndex(nextIndex)
    }
  }

  return (
    <section className={`bm-sensitivity-variable${disabled ? ' is-locked' : ''}`}>
      <DependencyPulse pulseKey={pulseKey} />
      <span className="bm-sensitivity-label" id={labelId}>
        {label}
      </span>
      <strong className="bm-sensitivity-value" aria-live="polite">
        {formatValue(value)}
      </strong>
      <div className="bm-wheel-shell">
        <span className="bm-wheel-selection" aria-hidden="true" />
        <div
          aria-activedescendant={`${labelId}-${selectedIndex}`}
          aria-disabled={disabled}
          aria-labelledby={labelId}
          aria-orientation="vertical"
          className="bm-wheel-viewport"
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          ref={viewportRef}
          role="listbox"
          tabIndex={disabled ? -1 : 0}
        >
          {options.map((option, index) => {
            const isSelected = option === value

            return (
              <button
                aria-selected={isSelected}
                className="bm-wheel-option"
                disabled={disabled}
                id={`${labelId}-${index}`}
                key={`${label}-${option}`}
                onClick={() => scrollToIndex(index)}
                role="option"
                tabIndex={-1}
                type="button"
              >
                {formatValue(option)}
              </button>
            )
          })}
        </div>
      </div>
      <div className="bm-variable-footer">
        <span className="bm-sensitivity-annotation">{annotation}</span>
        <DerivedValues values={details} />
      </div>
    </section>
  )
}

function BuildTypeCarousel({
  activeIndex,
  details,
  onChange,
  pulseKey,
}: {
  activeIndex: number
  details: readonly string[]
  onChange: (index: number) => void
  pulseKey: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const [direction, setDirection] = useState<-1 | 1>(1)
  const activeType = buildTypes[activeIndex] ?? buildTypes[0]
  const previousType = buildTypes[(activeIndex - 1 + buildTypes.length) % buildTypes.length]
  const nextType = buildTypes[(activeIndex + 1) % buildTypes.length]
  const ActiveIcon = activeType.icon

  const move = (nextDirection: -1 | 1) => {
    setDirection(nextDirection)
    onChange((activeIndex + nextDirection + buildTypes.length) % buildTypes.length)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 34 && Math.abs(info.velocity.x) < 360) return
    move(info.offset.x > 0 ? -1 : 1)
  }

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section className="bm-sensitivity-build-type">
      <DependencyPulse pulseKey={pulseKey} />
      <span className="bm-sensitivity-label" id="bm-build-type-label">
        Build type
      </span>
      <span className="bm-build-type-value" aria-live="polite">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.strong
            animate="center"
            className="bm-sensitivity-value"
            custom={direction}
            exit="exit"
            initial="enter"
            key={activeType.label}
            transition={transition}
            variants={buildTypeLabelMotion}
          >
            {activeType.label}
          </motion.strong>
        </AnimatePresence>
      </span>
      <div
        aria-labelledby="bm-build-type-label"
        aria-roledescription="carousel"
        className="bm-build-carousel"
        role="group"
      >
        <button
          aria-label={`Previous build type: ${previousType.label}`}
          className="bm-build-carousel-button"
          onClick={() => move(-1)}
          type="button"
        >
          <IconChevronLeft aria-hidden="true" />
        </button>
        <div className="bm-build-carousel-stage">
          <span
            className="bm-build-carousel-peek bm-build-carousel-peek--previous"
            aria-hidden="true"
          >
            {previousType.label}
          </span>
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              animate="center"
              aria-atomic="true"
              aria-live="polite"
              className="bm-build-carousel-current"
              custom={direction}
              drag={shouldReduceMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              exit="exit"
              initial="enter"
              key={activeType.label}
              onDragEnd={handleDragEnd}
              transition={transition}
              variants={buildTypeMotion}
            >
              <ActiveIcon aria-hidden="true" />
              <span>{activeType.label}</span>
            </motion.div>
          </AnimatePresence>
          <span className="bm-build-carousel-peek bm-build-carousel-peek--next" aria-hidden="true">
            {nextType.label}
          </span>
        </div>
        <button
          aria-label={`Next build type: ${nextType.label}`}
          className="bm-build-carousel-button"
          onClick={() => move(1)}
          type="button"
        >
          <IconChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="bm-variable-footer">
        <span className="bm-sensitivity-annotation">density +</span>
        <DerivedValues values={details} />
      </div>
    </section>
  )
}

export function BuildSensitivityConsole() {
  const [state, dispatch] = useReducer(modelReducer, initialModelState)
  const buildType = buildTypes[state.buildTypeIndex] ?? buildTypes[0]

  const model = useMemo(() => {
    const buildCost = state.buildCostOverride ?? buildType.defaultBuildCost
    const exitValue = state.exitValuePerUnitOverride
      ? roundTo(state.exitValuePerUnitOverride * state.unitCount, 100_000)
      : getScenarioExitValue(buildType, state.unitCount)
    const totalArea = buildType.areaPerUnit * state.unitCount
    const hardConstructionCost = buildCost * totalArea
    const projectAllowance = hardConstructionCost * PROJECT_ALLOWANCE_RATIO
    const totalDevelopmentCost = state.landValue + hardConstructionCost + projectAllowance
    const rawProfit = exitValue - totalDevelopmentCost
    const profit = roundTo(rawProfit, 10_000)
    const margin = exitValue === 0 ? 0 : (rawProfit / exitValue) * 100
    const valuePerUnit = exitValue / state.unitCount
    const impliedMonthlyRent =
      (exitValue * CAPITALIZATION_RATE) / (state.unitCount * 12 * (1 - OPERATING_EXPENSE_RATIO))

    return {
      buildCost,
      exitValue,
      hardConstructionCost,
      impliedMonthlyRent,
      margin,
      profit,
      projectAllowance,
      totalArea,
      totalDevelopmentCost,
      valuePerUnit,
    }
  }, [
    buildType,
    state.buildCostOverride,
    state.exitValuePerUnitOverride,
    state.landValue,
    state.unitCount,
  ])

  const pulseKey = (column: ModelColumn) =>
    impactedColumns[state.lastDriver].includes(column) ? state.impactRevision : 0

  return (
    <div className="bm-sensitivity-console">
      <div className="bm-sensitivity-grid">
        <BuildTypeCarousel
          activeIndex={state.buildTypeIndex}
          details={[
            `${formatArea(buildType.areaPerUnit)} / unit`,
            buildType.unitsLocked ? '1 dwelling door · fixed' : '2–12 dwelling doors',
          ]}
          onChange={(index) => dispatch({ type: 'selectBuildType', index })}
          pulseKey={pulseKey('buildType')}
        />
        <WheelPicker
          annotation={buildType.unitsLocked ? 'locked 1' : 'doors +'}
          details={[
            `${state.unitCount} dwelling ${state.unitCount === 1 ? 'door' : 'doors'} in one build`,
            `${formatArea(model.totalArea)} total`,
          ]}
          disabled={buildType.unitsLocked}
          formatValue={(value) => `${value}`}
          label="Units"
          onChange={(value) => dispatch({ type: 'setUnits', value })}
          options={buildType.unitsLocked ? lockedUnitValue : multiPlexUnitValues}
          pulseKey={pulseKey('units')}
          value={state.unitCount}
        />
        <WheelPicker
          annotation="basis −"
          details={[
            `${((state.landValue / model.exitValue) * 100).toFixed(1)}% of modeled value`,
            `${formatCompactCurrency(state.landValue)} acquisition basis`,
          ]}
          formatValue={formatCompactCurrency}
          label="Land"
          onChange={(value) => dispatch({ type: 'setLand', value })}
          options={landValues}
          pulseKey={pulseKey('land')}
          value={state.landValue}
        />
        <WheelPicker
          annotation="cost −"
          details={[
            `${formatCompactCurrency(model.hardConstructionCost)} hard cost`,
            `${formatCompactCurrency(model.projectAllowance)} allowance`,
          ]}
          formatValue={(value) => `$${value} / ft²`}
          label="Build cost"
          onChange={(value) => dispatch({ type: 'setBuildCost', value })}
          options={buildCostValues}
          pulseKey={pulseKey('buildCost')}
          value={model.buildCost}
        />
        <WheelPicker
          annotation="value +"
          details={[
            `${formatCompactCurrency(model.valuePerUnit)} value / unit`,
            `${formatCompactCurrency(model.impliedMonthlyRent)} / month implied`,
          ]}
          formatValue={formatCompactCurrency}
          label="Exit value"
          onChange={(value) => dispatch({ type: 'setExitValue', value })}
          options={exitValueOptions}
          pulseKey={pulseKey('exit')}
          value={model.exitValue}
        />
        <section className={`bm-sensitivity-profit${model.profit < 0 ? ' is-negative' : ''}`}>
          <DependencyPulse pulseKey={pulseKey('profit')} />
          <span className="bm-sensitivity-label">Profit</span>
          <div className="bm-profit-orbit">
            <NumberFlow
              aria-label={`Illustrative profit ${formatCompactCurrency(model.profit)}`}
              className="bm-profit-value"
              format={{
                currency: 'CAD',
                currencyDisplay: 'narrowSymbol',
                maximumFractionDigits: 0,
                notation: 'compact',
                style: 'currency',
              }}
              value={model.profit}
            />
            <span className="bm-profit-margin">
              <NumberFlow
                format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }}
                value={model.margin}
              />
              % margin
            </span>
            <span className="bm-profit-total-cost">
              {formatCompactCurrency(model.totalDevelopmentCost)} total cost
            </span>
          </div>
          <span className="bm-profit-disclaimer">
            Illustrative model
            <small>4.0% cap · 20% expenses · 20% project allowance</small>
            <small>Site-specific · not a quote or guarantee</small>
          </span>
        </section>
        <p className="sr-only" aria-live="polite">
          One {buildType.label} build with {state.unitCount}{' '}
          {state.unitCount === 1 ? 'dwelling door' : 'dwelling doors'} creates an estimated{' '}
          {formatArea(model.totalArea)} of floor area, {formatCompactCurrency(model.exitValue)}{' '}
          stabilized value, {formatCompactCurrency(model.totalDevelopmentCost)} total development
          cost, and {formatCompactCurrency(model.profit)} illustrative profit.
        </p>
      </div>
    </div>
  )
}
