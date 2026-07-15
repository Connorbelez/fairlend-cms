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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trackFairlendEvent } from '@/lib/analytics/events'
import { BUILD_MODEL_ASSUMPTIONS } from './market-data'
import {
  calculateBuildUnderwriting,
  estimateMonthlyRentForValue,
  type UnderwritingStrategy,
} from './underwriting'
import {
  type KeyboardEvent,
  type WheelEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

const WHEEL_ITEM_HEIGHT = 38
type Strategy = UnderwritingStrategy

type BuildScenario = {
  defaultAreaPerUnit: number
  defaultBuildCost: number
  defaultExitValue: number | null
  defaultLandValue: number
  defaultMonthlyRentPerUnit: number
  defaultStrategy: Strategy
  defaultUnits: number
  icon: typeof IconHome
  label: string
  maximumUnits: number
  minimumUnits: number
  netOfHstExit: boolean
  rentOnly: boolean
  assumesOwnedLand: boolean
  unitsLocked: boolean
}

const buildTypes = [
  {
    label: 'Single family',
    defaultAreaPerUnit: 2_800,
    defaultUnits: 1,
    defaultBuildCost: 300,
    defaultExitValue: 2_200_000,
    defaultLandValue: 1_100_000,
    defaultMonthlyRentPerUnit: 7_500,
    defaultStrategy: 'exit',
    minimumUnits: 1,
    maximumUnits: 1,
    netOfHstExit: true,
    rentOnly: false,
    assumesOwnedLand: false,
    unitsLocked: true,
    icon: IconHome,
  },
  {
    label: 'Single family luxury',
    defaultAreaPerUnit: 4_500,
    defaultUnits: 1,
    defaultBuildCost: 450,
    defaultExitValue: 2_400_000,
    defaultLandValue: 1_200_000,
    defaultMonthlyRentPerUnit: 9_000,
    defaultStrategy: 'exit',
    minimumUnits: 1,
    maximumUnits: 1,
    netOfHstExit: true,
    rentOnly: false,
    assumesOwnedLand: false,
    unitsLocked: true,
    icon: IconBuildingEstate,
  },
  {
    label: 'Garden suite',
    defaultAreaPerUnit: 1_290,
    defaultUnits: 1,
    defaultBuildCost: 420,
    defaultExitValue: null,
    defaultLandValue: 0,
    defaultMonthlyRentPerUnit: 4_200,
    defaultStrategy: 'rent',
    minimumUnits: 1,
    maximumUnits: 4,
    netOfHstExit: false,
    rentOnly: true,
    assumesOwnedLand: true,
    unitsLocked: false,
    icon: IconBuildingCottage,
  },
  {
    label: 'Multiplex',
    defaultAreaPerUnit: 1_500,
    defaultUnits: 5,
    defaultBuildCost: 270,
    defaultExitValue: 4_500_000,
    defaultLandValue: 1_200_000,
    defaultMonthlyRentPerUnit: 3_200,
    defaultStrategy: 'exit',
    minimumUnits: 2,
    maximumUnits: 12,
    netOfHstExit: false,
    rentOnly: false,
    assumesOwnedLand: false,
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
const areaPerUnitValues = Array.from({ length: 451 }, (_, index) => 500 + index * 10)
const buildCostValues = Array.from({ length: 61 }, (_, index) => 200 + index * 5)
const exitValueOptions = Array.from({ length: 116 }, (_, index) => 500_000 + index * 100_000)
const monthlyRentOptions = Array.from({ length: 141 }, (_, index) => 1_000 + index * 100)

function formatCompactCurrency(value: number) {
  const absoluteValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absoluteValue >= 1_000_000) {
    return `${sign}$${(absoluteValue / 1_000_000).toFixed(absoluteValue % 1_000_000 === 0 ? 0 : 1)}M`
  }

  return `${sign}$${Math.round(absoluteValue / 1_000)}K`
}

function formatArea(value: number) {
  return `${new Intl.NumberFormat('en-CA').format(value)} ft²`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-CA', {
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatMonthlyCurrency(value: number) {
  return `${formatCurrency(value)} / mo`
}

function roundTo(value: number, increment: number) {
  return Math.round(value / increment) * increment
}

type ModelDriver = 'buildType' | 'units' | 'area' | 'land' | 'buildCost' | 'strategy' | 'return'
type ModelColumn = ModelDriver | 'profit'

type ModelState = {
  areaPerUnit: number
  buildCost: number
  buildTypeIndex: number
  exitValuePerUnit: number | null
  impactRevision: number
  landValue: number
  lastDriver: ModelDriver
  monthlyRentPerUnit: number
  strategy: Strategy
  unitCount: number
}

type ModelAction =
  | { index: number; type: 'selectBuildType' }
  | { type: 'setUnits'; value: number }
  | { type: 'setAreaPerUnit'; value: number }
  | { type: 'setLand'; value: number }
  | { type: 'setBuildCost'; value: number }
  | { type: 'setExitValue'; value: number }
  | { type: 'setMonthlyRent'; value: number }
  | { type: 'setStrategy'; value: Strategy }

const INITIAL_BUILD_TYPE_INDEX = 3
const initialBuildType = buildTypes[INITIAL_BUILD_TYPE_INDEX]

const initialModelState: ModelState = {
  areaPerUnit: initialBuildType.defaultAreaPerUnit,
  buildCost: initialBuildType.defaultBuildCost,
  buildTypeIndex: INITIAL_BUILD_TYPE_INDEX,
  exitValuePerUnit:
    initialBuildType.defaultExitValue === null
      ? null
      : initialBuildType.defaultExitValue / initialBuildType.defaultUnits,
  impactRevision: 0,
  landValue: initialBuildType.defaultLandValue,
  lastDriver: 'buildType',
  monthlyRentPerUnit: initialBuildType.defaultMonthlyRentPerUnit,
  strategy: initialBuildType.defaultStrategy,
  unitCount: initialBuildType.defaultUnits,
}

const impactedColumns: Record<ModelDriver, readonly ModelColumn[]> = {
  buildType: ['buildType', 'units', 'area', 'land', 'buildCost', 'strategy', 'return', 'profit'],
  units: ['buildType', 'units', 'area', 'land', 'buildCost', 'strategy', 'return', 'profit'],
  area: ['area', 'buildCost', 'strategy', 'return', 'profit'],
  land: ['land', 'profit'],
  buildCost: ['buildCost', 'profit'],
  strategy: ['strategy', 'return', 'profit'],
  return: ['return', 'profit'],
}

function modelReducer(state: ModelState, action: ModelAction): ModelState {
  switch (action.type) {
    case 'selectBuildType': {
      const nextScenario = buildTypes[action.index]
      if (!nextScenario || action.index === state.buildTypeIndex) return state

      return {
        ...state,
        areaPerUnit: nextScenario.defaultAreaPerUnit,
        buildCost: nextScenario.defaultBuildCost,
        buildTypeIndex: action.index,
        exitValuePerUnit:
          nextScenario.defaultExitValue === null
            ? null
            : nextScenario.defaultExitValue / nextScenario.defaultUnits,
        impactRevision: state.impactRevision + 1,
        landValue: nextScenario.defaultLandValue,
        lastDriver: 'buildType',
        monthlyRentPerUnit: nextScenario.defaultMonthlyRentPerUnit,
        strategy: nextScenario.defaultStrategy,
        unitCount: nextScenario.defaultUnits,
      }
    }
    case 'setUnits': {
      const currentScenario = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
      if (
        currentScenario.unitsLocked ||
        action.value < currentScenario.minimumUnits ||
        action.value > currentScenario.maximumUnits ||
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
    case 'setAreaPerUnit':
      if (action.value === state.areaPerUnit) return state
      return {
        ...state,
        areaPerUnit: action.value,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'area',
      }
    case 'setLand':
      if ((buildTypes[state.buildTypeIndex] ?? buildTypes[0]).assumesOwnedLand) return state
      if (action.value === state.landValue) return state
      return {
        ...state,
        impactRevision: state.impactRevision + 1,
        landValue: action.value,
        lastDriver: 'land',
      }
    case 'setBuildCost': {
      if (action.value === state.buildCost) return state

      return {
        ...state,
        buildCost: action.value,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'buildCost',
      }
    }
    case 'setExitValue': {
      const currentExitValue =
        state.exitValuePerUnit === null
          ? 0
          : roundTo(state.exitValuePerUnit * state.unitCount, 100_000)
      if (action.value === currentExitValue) return state

      return {
        ...state,
        exitValuePerUnit: action.value / state.unitCount,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'return',
      }
    }
    case 'setMonthlyRent': {
      if (action.value === state.monthlyRentPerUnit) return state

      return {
        ...state,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'return',
        monthlyRentPerUnit: action.value,
      }
    }
    case 'setStrategy': {
      const currentScenario = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
      if (currentScenario.rentOnly || action.value === state.strategy) return state
      return {
        ...state,
        impactRevision: state.impactRevision + 1,
        lastDriver: 'strategy',
        strategy: action.value,
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
  const wheelCooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerStartYRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)
  const selectedIndex = Math.max(0, options.indexOf(value))
  const visibleOptions = options
    .map((option, index) => ({ index, offset: index - selectedIndex, option }))
    .filter(({ offset }) => Math.abs(offset) <= 2)
  const labelId = `bm-wheel-label-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  const scrollToIndex = (index: number) => {
    if (disabled) return
    const nextIndex = Math.min(options.length - 1, Math.max(0, index))
    onChange(options[nextIndex] ?? options[0] ?? value)
  }

  useEffect(
    () => () => {
      if (wheelCooldownRef.current) clearTimeout(wheelCooldownRef.current)
    },
    [],
  )

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (disabled || Math.abs(event.deltaY) < 4 || wheelCooldownRef.current) return
    event.preventDefault()
    scrollToIndex(selectedIndex + (event.deltaY > 0 ? 1 : -1))
    wheelCooldownRef.current = setTimeout(() => {
      wheelCooldownRef.current = null
    }, 110)
  }

  const handlePointerUp = (clientY: number) => {
    const pointerStartY = pointerStartYRef.current
    pointerStartYRef.current = null
    if (disabled || pointerStartY === null) return

    const offset = clientY - pointerStartY
    if (Math.abs(offset) < 18) return

    suppressClickRef.current = true
    scrollToIndex(selectedIndex + (offset < 0 ? 1 : -1))
    setTimeout(() => {
      suppressClickRef.current = false
    }, 0)
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
          aria-disabled={disabled}
          aria-labelledby={labelId}
          aria-roledescription="wheel picker"
          className="bm-wheel-viewport"
          onKeyDown={handleKeyDown}
          onPointerCancel={() => {
            pointerStartYRef.current = null
          }}
          onPointerDown={(event) => {
            pointerStartYRef.current = event.clientY
            suppressClickRef.current = false
          }}
          onPointerUp={(event) => handlePointerUp(event.clientY)}
          onWheel={handleWheel}
          role="group"
          tabIndex={disabled ? -1 : 0}
        >
          <AnimatePresence initial={false}>
            {visibleOptions.map(({ index, offset, option }) => {
              const isSelected = option === value

              return (
                <motion.button
                  animate={{
                    filter: isSelected ? 'blur(0px)' : 'blur(0.35px)',
                    opacity: isSelected ? 1 : Math.abs(offset) === 1 ? 0.38 : 0.14,
                    scale: isSelected ? 1 : 0.9,
                    y: offset * WHEEL_ITEM_HEIGHT,
                  }}
                  aria-label={`${formatValue(option)}${isSelected ? ', selected' : ''}`}
                  aria-pressed={isSelected}
                  className="bm-wheel-option"
                  disabled={disabled}
                  exit={{ opacity: 0, y: offset * WHEEL_ITEM_HEIGHT }}
                  id={`${labelId}-${index}`}
                  key={`${label}-${option}`}
                  onClick={() => {
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false
                      return
                    }
                    scrollToIndex(index)
                  }}
                  tabIndex={-1}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                  }
                  type="button"
                >
                  {formatValue(option)}
                </motion.button>
              )
            })}
          </AnimatePresence>
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

function StrategySelector({
  details,
  locked,
  onChange,
  pulseKey,
  value,
}: {
  details: readonly string[]
  locked?: boolean
  onChange: (value: Strategy) => void
  pulseKey: number
  value: Strategy
}) {
  return (
    <section
      className={`bm-sensitivity-variable bm-strategy-variable${locked ? ' is-locked' : ''}`}
    >
      <DependencyPulse pulseKey={pulseKey} />
      <span className="bm-sensitivity-label" id="bm-strategy-label">
        Strategy
      </span>
      <strong className="bm-sensitivity-value" aria-live="polite">
        {value === 'rent' ? 'Rent' : 'Exit'}
      </strong>
      <ToggleGroup
        aria-labelledby="bm-strategy-label"
        className="bm-strategy-toggle"
        disabled={locked}
        onValueChange={(nextValue) => {
          if (nextValue === 'rent' || nextValue === 'exit') onChange(nextValue)
        }}
        type="single"
        value={value}
      >
        <ToggleGroupItem aria-label="Rent and hold" value="rent">
          Rent
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Sell at exit" value="exit">
          Exit
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="bm-variable-footer">
        <span className="bm-sensitivity-annotation">path ±</span>
        <DerivedValues values={details} />
      </div>
    </section>
  )
}

export function BuildSensitivityConsole() {
  const [state, dispatch] = useReducer(modelReducer, initialModelState)
  const hasTrackedStartRef = useRef(false)
  const changeEventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateModel(action: ModelAction, inputCategory: ModelDriver): void {
    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true
      trackFairlendEvent('fairlend_build_model_started', { source: 'build-model' })
    }
    dispatch(action)
    if (changeEventTimeoutRef.current) clearTimeout(changeEventTimeoutRef.current)
    changeEventTimeoutRef.current = setTimeout(() => {
      trackFairlendEvent('fairlend_build_model_changed', {
        input_category: inputCategory,
        source: 'build-model',
      })
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (changeEventTimeoutRef.current) clearTimeout(changeEventTimeoutRef.current)
    }
  }, [])
  const buildType = buildTypes[state.buildTypeIndex] ?? buildTypes[0]
  const unitOptions = useMemo(
    () =>
      Array.from(
        { length: buildType.maximumUnits - buildType.minimumUnits + 1 },
        (_, index) => buildType.minimumUnits + index,
      ),
    [buildType.maximumUnits, buildType.minimumUnits],
  )

  const model = useMemo(() => {
    const exitValue =
      state.exitValuePerUnit === null
        ? 0
        : roundTo(state.exitValuePerUnit * state.unitCount, 100_000)
    const landValue = buildType.assumesOwnedLand ? 0 : state.landValue
    const underwriting = calculateBuildUnderwriting({
      areaPerUnit: state.areaPerUnit,
      buildCostPerSquareFoot: state.buildCost,
      exitValue,
      landBasis: landValue,
      monthlyRentPerUnit: state.monthlyRentPerUnit,
      strategy: state.strategy,
      units: state.unitCount,
    })
    const valuePerUnit = exitValue / state.unitCount
    const impliedMonthlyRent = estimateMonthlyRentForValue(exitValue, state.unitCount)

    return {
      exitValue,
      impliedMonthlyRent,
      landValue,
      valuePerUnit,
      ...underwriting,
    }
  }, [
    buildType,
    state.areaPerUnit,
    state.buildCost,
    state.exitValuePerUnit,
    state.landValue,
    state.monthlyRentPerUnit,
    state.strategy,
    state.unitCount,
  ])

  const displayedResult = state.strategy === 'rent' ? model.grossMonthlyRent : model.result
  const isNetOfHstExit = state.strategy === 'exit' && buildType.netOfHstExit

  const pulseKey = (column: ModelColumn) =>
    impactedColumns[state.lastDriver].includes(column) ? state.impactRevision : 0

  return (
    <div className="bm-sensitivity-console">
      <div className="bm-sensitivity-grid">
        <BuildTypeCarousel
          activeIndex={state.buildTypeIndex}
          details={[
            buildType.unitsLocked
              ? '1 dwelling door · fixed'
              : `${buildType.minimumUnits}–${buildType.maximumUnits} dwelling doors`,
            buildType.rentOnly ? 'Exit value N/A · rent only' : 'Rent or exit strategy',
          ]}
          onChange={(index) => updateModel({ type: 'selectBuildType', index }, 'buildType')}
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
          onChange={(value) => updateModel({ type: 'setUnits', value }, 'units')}
          options={unitOptions}
          pulseKey={pulseKey('units')}
          value={state.unitCount}
        />
        <WheelPicker
          annotation="area ±"
          details={[
            `${formatArea(model.totalArea)} total floor area`,
            `${state.unitCount} × ${formatArea(state.areaPerUnit)}`,
          ]}
          formatValue={formatArea}
          label="Sq. ft. / unit"
          onChange={(value) => updateModel({ type: 'setAreaPerUnit', value }, 'area')}
          options={areaPerUnitValues}
          pulseKey={pulseKey('area')}
          value={state.areaPerUnit}
        />
        <WheelPicker
          annotation={buildType.assumesOwnedLand ? 'owned · $0' : 'basis −'}
          details={
            buildType.assumesOwnedLand
              ? ['Borrower already owns the property', '$0 land cost in this model']
              : [
                  `${((model.landValue / model.exitValue) * 100).toFixed(1)}% of modeled value`,
                  `${formatCompactCurrency(model.landValue)} acquisition basis`,
                ]
          }
          disabled={buildType.assumesOwnedLand}
          formatValue={formatCompactCurrency}
          label="Land"
          onChange={(value) => updateModel({ type: 'setLand', value }, 'land')}
          options={buildType.assumesOwnedLand ? [0] : landValues}
          pulseKey={pulseKey('land')}
          value={model.landValue}
        />
        <WheelPicker
          annotation="cost −"
          details={[
            `${formatCompactCurrency(model.hardConstructionCost)} hard cost`,
            `${formatCompactCurrency(model.softCosts)} soft costs`,
            `${formatCompactCurrency(model.contingency)} contingency`,
          ]}
          formatValue={(value) => `$${value} / ft²`}
          label="Build cost"
          onChange={(value) => updateModel({ type: 'setBuildCost', value }, 'buildCost')}
          options={buildCostValues}
          pulseKey={pulseKey('buildCost')}
          value={state.buildCost}
        />
        <StrategySelector
          details={
            state.strategy === 'rent'
              ? [
                  `${formatMonthlyCurrency(model.grossMonthlyRent)} gross monthly revenue`,
                  `${formatCompactCurrency(model.grossPotentialRent)} annual gross revenue`,
                  buildType.rentOnly ? 'Exit value N/A · rent only' : 'Hold-and-rent strategy',
                ]
              : ['Construction loan repaid on sale', 'No takeout financing required']
          }
          locked={buildType.rentOnly}
          onChange={(value) => updateModel({ type: 'setStrategy', value }, 'strategy')}
          pulseKey={pulseKey('strategy')}
          value={state.strategy}
        />
        {state.strategy === 'rent' ? (
          <WheelPicker
            annotation="income +"
            details={[
              `${formatMonthlyCurrency(model.grossMonthlyRent)} gross monthly revenue`,
              `${formatCompactCurrency(model.grossPotentialRent)} annual gross revenue`,
            ]}
            formatValue={formatMonthlyCurrency}
            label="Rent / unit"
            onChange={(value) => updateModel({ type: 'setMonthlyRent', value }, 'return')}
            options={monthlyRentOptions}
            pulseKey={pulseKey('return')}
            value={state.monthlyRentPerUnit}
          />
        ) : (
          <WheelPicker
            annotation="value +"
            details={[
              `${formatCompactCurrency(model.valuePerUnit)} value / unit`,
              `${formatCompactCurrency(model.impliedMonthlyRent)} / month implied`,
            ]}
            formatValue={(value) =>
              `${formatCompactCurrency(value)}${buildType.netOfHstExit ? '*' : ''}`
            }
            label="Exit value"
            onChange={(value) => updateModel({ type: 'setExitValue', value }, 'return')}
            options={exitValueOptions}
            pulseKey={pulseKey('return')}
            value={model.exitValue}
          />
        )}
        <section className={`bm-sensitivity-profit${displayedResult < 0 ? ' is-negative' : ''}`}>
          <DependencyPulse pulseKey={pulseKey('profit')} />
          <span className="bm-sensitivity-label">
            {state.strategy === 'rent' ? 'Gross monthly' : 'Profit'}
          </span>
          <div className="bm-profit-orbit">
            <span aria-hidden="true" className="bm-profit-orbit-radar">
              <i className="bm-profit-ring bm-profit-ring--outer" />
              <i className="bm-profit-ring bm-profit-ring--inner" />
              <i className="bm-profit-orbit-arcs" />
              <i className="bm-profit-orbit-nodes" />
            </span>
            <span className="bm-profit-value-row">
              <NumberFlow
                aria-label={`Illustrative ${state.strategy === 'rent' ? 'gross monthly revenue' : 'profit'} ${formatCurrency(displayedResult)}${isNetOfHstExit ? ', net of HST' : ''}`}
                className="bm-profit-value"
                format={{
                  currency: 'CAD',
                  currencyDisplay: 'narrowSymbol',
                  maximumFractionDigits: 0,
                  notation: state.strategy === 'rent' ? 'standard' : 'compact',
                  style: 'currency',
                }}
                value={displayedResult}
              />
              {isNetOfHstExit ? (
                <sup aria-hidden="true" className="bm-profit-hst-mark">
                  *
                </sup>
              ) : null}
            </span>
            <span className="bm-profit-margin">
              {state.strategy === 'rent' ? (
                <>
                  <NumberFlow
                    aria-label={`${formatCurrency(model.grossPotentialRent)} annual gross revenue`}
                    format={{
                      currency: 'CAD',
                      currencyDisplay: 'narrowSymbol',
                      maximumFractionDigits: 0,
                      notation: 'compact',
                      style: 'currency',
                    }}
                    value={model.grossPotentialRent}
                  />{' '}
                  annual gross revenue
                </>
              ) : model.returnRate === null ? (
                <span aria-label="margin not meaningful">
                  N/M margin
                </span>
              ) : (
                <>
                  <NumberFlow
                    aria-label={`${model.returnRate.toFixed(1)} percent margin`}
                    format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }}
                    value={model.returnRate}
                  />
                  % margin
                </>
              )}
            </span>
            <span className="bm-profit-total-cost">
              {state.strategy === 'rent'
                ? `${state.unitCount} ${state.unitCount === 1 ? 'unit' : 'units'} × ${formatMonthlyCurrency(state.monthlyRentPerUnit)}`
                : `${formatCompactCurrency(model.totalDevelopmentCost)} total cost`}
            </span>
          </div>
          <span className="bm-profit-disclaimer">
            {state.strategy === 'rent' ? 'Illustrative gross revenue' : 'Illustrative model'}
            {state.strategy === 'rent' ? (
              <>
                <small>{formatMonthlyCurrency(state.monthlyRentPerUnit)} rent per unit</small>
                <small>{state.unitCount} rental {state.unitCount === 1 ? 'unit' : 'units'}</small>
                <small>{formatCompactCurrency(model.grossPotentialRent)} annual gross revenue</small>
                <small>Before vacancy, operating expenses, and financing costs</small>
              </>
            ) : (
              <>
                {isNetOfHstExit ? <small className="bm-profit-hst-note">*Net of HST</small> : null}
                <small>
                  {(BUILD_MODEL_ASSUMPTIONS.dispositionCostRate * 100).toFixed(1)}% disposition costs
                </small>
              </>
            )}
            <small>Site-specific · not a quote or guarantee</small>
          </span>
        </section>
        <p className="sr-only" aria-live="polite">
          One {buildType.label} build with {state.unitCount}{' '}
          {state.unitCount === 1 ? 'dwelling door' : 'dwelling doors'} creates an estimated{' '}
          {formatArea(model.totalArea)} of floor area and{' '}
          {formatCompactCurrency(model.totalDevelopmentCost)} total development cost. The{' '}
          {state.strategy === 'rent' ? 'rent strategy produces' : 'exit strategy produces'}{' '}
          {state.strategy === 'rent'
            ? formatMonthlyCurrency(model.grossMonthlyRent)
            : formatCompactCurrency(model.result)}{' '}
          {state.strategy === 'rent' ? 'illustrative gross monthly revenue' : 'illustrative profit'}.
        </p>
      </div>
    </div>
  )
}
