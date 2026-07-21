'use client'

import { type FormEventHandler, type ReactNode, useId, useMemo, useState } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/ui'

const DEFAULT_CHROME_SRC =
  '/assets/garden-suite-financing-dossier/project-assessment-dossier-chrome.webp'
const DEFAULT_BINDER_CLIP_SRC =
  '/assets/garden-suite-financing-dossier/project-assessment-binder-clip-v2.webp'

export type ProjectAssessmentValues = {
  municipality: string
  projectStage: string
  projectType: string
  propertyAddress: string
}

export type ProjectAssessmentField = keyof ProjectAssessmentValues

export type ProjectAssessmentOption = {
  disabled?: boolean
  label: string
  value: string
}

export type ProjectAssessmentStep = {
  current: number
  label?: string
  total: number
}

export type ProjectAssessmentCta = {
  ariaLabel?: string
  disabled?: boolean
  label: string
}

export type ProjectAssessmentTrustCopy = {
  privacy: ReactNode
  disclaimer: ReactNode
}

export type ProjectAssessmentValueChange = {
  field: ProjectAssessmentField
  value: string
  values: ProjectAssessmentValues
}

export type ProjectAssessmentFolderFormProps = {
  /** Transparent raster containing the paper perimeter, backing, tab, and physical clip. */
  chromeSrc?: string
  className?: string
  cta?: ProjectAssessmentCta
  defaultValues?: Partial<ProjectAssessmentValues>
  description?: ReactNode
  disabled?: boolean
  fileReference?: string
  idPrefix?: string
  municipalityOptions?: readonly ProjectAssessmentOption[]
  onSubmit?: FormEventHandler<HTMLFormElement>
  onValuesChange?: (change: ProjectAssessmentValueChange) => void
  projectStageOptions?: readonly ProjectAssessmentOption[]
  projectTypeOptions?: readonly ProjectAssessmentOption[]
  step?: ProjectAssessmentStep
  title?: ReactNode
  trustCopy?: ProjectAssessmentTrustCopy
  /** Passing values makes the form controlled. Omit to use defaultValues. */
  values?: Partial<ProjectAssessmentValues>
}

const EMPTY_VALUES: ProjectAssessmentValues = {
  municipality: '',
  projectStage: '',
  projectType: '',
  propertyAddress: '',
}

export const gardenSuiteMunicipalityOptions: readonly ProjectAssessmentOption[] = [
  { label: 'City of Toronto', value: 'toronto' },
  { label: 'Mississauga', value: 'mississauga' },
  { label: 'Brampton', value: 'brampton' },
  { label: 'Vaughan', value: 'vaughan' },
  { label: 'Markham', value: 'markham' },
] as const

export const gardenSuiteProjectTypeOptions: readonly ProjectAssessmentOption[] = [
  { label: 'Garden Suite (New Build)', value: 'garden-suite-new-build' },
  { label: 'Laneway Suite (New Build)', value: 'laneway-suite-new-build' },
  { label: 'Detached Garage Conversion', value: 'garage-conversion' },
  { label: 'Existing Suite Refinance', value: 'existing-suite-refinance' },
] as const

export const gardenSuiteProjectStageOptions: readonly ProjectAssessmentOption[] = [
  { label: 'Exploring / Feasibility', value: 'feasibility' },
  { label: 'Pre-Construction / Planning', value: 'pre-construction' },
  { label: 'Permits Submitted', value: 'permits-submitted' },
  { label: 'Permit Ready', value: 'permit-ready' },
  { label: 'Construction Underway', value: 'construction-underway' },
] as const

const DEFAULT_TRUST_COPY: ProjectAssessmentTrustCopy = {
  disclaimer: 'No credit check. This is not a loan application.',
  privacy: 'Your information is secure and never shared.',
}

/**
 * Accessible lead-intake form with the clipped project-file treatment from the
 * financing dossier. It supports both controlled and uncontrolled value state.
 */
export function ProjectAssessmentFolderForm({
  chromeSrc = DEFAULT_CHROME_SRC,
  className,
  cta = { label: 'Plan my garden suite project' },
  defaultValues,
  description = 'Tell us about your property and project.',
  disabled = false,
  fileReference = 'FILE GS-01',
  idPrefix,
  municipalityOptions = gardenSuiteMunicipalityOptions,
  onSubmit,
  onValuesChange,
  projectStageOptions = gardenSuiteProjectStageOptions,
  projectTypeOptions = gardenSuiteProjectTypeOptions,
  step = { current: 1, total: 6 },
  title = 'Project assessment',
  trustCopy = DEFAULT_TRUST_COPY,
  values,
}: ProjectAssessmentFolderFormProps) {
  const generatedId = useId()
  const fieldIdPrefix = idPrefix ?? `project-assessment-${generatedId.replace(/:/g, '')}`
  const [internalValues, setInternalValues] = useState<ProjectAssessmentValues>({
    ...EMPTY_VALUES,
    ...defaultValues,
  })
  const isControlled = values !== undefined
  const resolvedValues = useMemo(
    () => ({ ...EMPTY_VALUES, ...(isControlled ? values : internalValues) }),
    [internalValues, isControlled, values],
  )

  const totalSteps = Math.max(1, Math.floor(step.total))
  const currentStep = Math.min(totalSteps, Math.max(1, Math.floor(step.current)))
  const progressValue = (currentStep / totalSteps) * 100
  const changeValue = (field: ProjectAssessmentField, value: string) => {
    const nextValues = { ...resolvedValues, [field]: value }

    if (!isControlled) {
      setInternalValues(nextValues)
    }

    onValuesChange?.({ field, value, values: nextValues })
  }

  return (
    <div
      className={cn(
        'relative z-0 isolate min-h-[42rem] w-full max-w-[28rem] shrink-0 sm:h-[434px] sm:min-h-0 sm:w-[348px] sm:max-w-[348px]',
        className,
      )}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-11px] left-0 z-0 h-[459px] w-[356px] origin-top-left scale-y-[1.026] select-none object-fill min-[900px]:translate-y-[5.3px]! min-[900px]:scale-x-[0.992]! min-[900px]:scale-y-[1.009]!"
        draggable={false}
        fill
        sizes="(min-width: 640px) 348px, 100vw"
        src={chromeSrc}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[20px] left-0 z-[1] hidden h-[411px] w-[311px] bg-[#f8f7f2] sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[29.5px] left-[6px] z-[2] hidden h-[400px] w-[305px] border border-[#a4a29d] bg-[#fbfaf6] shadow-[2px_3px_0_rgb(20_20_18/0.16)] sm:block"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[48px] z-[1] h-[48px] w-[108px] bg-[#f8f7f2]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[27px] left-[48px] z-[2] h-[21px] w-[108px] bg-[#fbfaf6]"
      />
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-11px] left-[30px] z-[3] h-[46px] w-[40px] select-none object-fill"
        draggable={false}
        height={46}
        src={DEFAULT_BINDER_CLIP_SRC}
        width={44}
      />

      <Card className="absolute bottom-[4%] left-[4%] right-[10%] top-[7%] z-10 rounded-none border-0 bg-transparent text-neutral-950 shadow-none">
        <form className="flex h-full flex-col" onSubmit={onSubmit}>
          <CardHeader className="relative gap-2 px-4 pb-3 pt-5 sm:w-[287px] sm:gap-1.5 sm:pb-0 sm:pt-6">
            <div className="flex flex-nowrap items-center justify-between gap-2">
              <CardTitle className="origin-left scale-x-[1.08] scale-y-[0.84] whitespace-nowrap font-[family-name:var(--font-league-gothic)] text-[24px] font-normal uppercase leading-[0.95] tracking-[-0.015em] [-webkit-text-stroke:0.25px_#fbfaf6] [paint-order:fill_stroke]">
                {title}
              </CardTitle>
              <span className="shrink-0 whitespace-nowrap border border-neutral-800 bg-white/50 px-1.5 py-0.5 font-[family-name:var(--font-oxanium)] text-[9px] font-extrabold uppercase leading-none tracking-[0.1em] sm:relative sm:-top-[2px] sm:flex sm:h-[22px] sm:items-center sm:py-0">
                {fileReference}
              </span>
            </div>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[47px] left-4 hidden h-px w-[255px] bg-neutral-700 sm:block"
            />

            <ProjectAssessmentProgress
              current={currentStep}
              label={step.label}
              total={totalSteps}
              value={progressValue}
            />
          </CardHeader>

          <CardContent className="px-4 pb-3 pt-3 sm:w-[287px] sm:-translate-y-[4px] sm:pb-3 sm:pt-3">
            <p className="relative mb-3 text-xs leading-snug text-neutral-700 sm:-top-[5px] sm:mb-1.5 sm:text-[8px] min-[900px]:origin-left! min-[900px]:scale-x-[0.89]!">
              {description}
            </p>

            <FieldGroup className="gap-2.5 sm:gap-[6px]">
              <SelectField
                disabled={disabled}
                field="municipality"
                id={`${fieldIdPrefix}-municipality`}
                label="Municipality"
                onValueChange={changeValue}
                options={municipalityOptions}
                placeholder="Select a municipality"
                value={resolvedValues.municipality}
              />

              <Field className="gap-1 sm:gap-1">
                <FieldLabel
                  className="relative top-[2px] font-[family-name:var(--font-league-gothic)] text-[11px] font-normal uppercase leading-none tracking-[0.75px] text-neutral-950 sm:text-[9px]"
                  htmlFor={`${fieldIdPrefix}-property-address`}
                >
                  Property address
                </FieldLabel>
                <Input
                  autoComplete="street-address"
                  className="h-9 rounded-none border-[#858585] bg-white/70 px-2 text-xs shadow-[inset_-1px_-1px_0_rgb(0_0_0/0.18)] focus-visible:border-neutral-950 focus-visible:ring-neutral-950/20 sm:h-[22px] sm:text-[7.2px] sm:font-normal min-[900px]:text-[7.2px]!"
                  disabled={disabled}
                  id={`${fieldIdPrefix}-property-address`}
                  name="propertyAddress"
                  onChange={(event) => changeValue('propertyAddress', event.target.value)}
                  placeholder="123 Example St, Toronto, ON"
                  required
                  value={resolvedValues.propertyAddress}
                />
              </Field>

              <SelectField
                disabled={disabled}
                field="projectType"
                id={`${fieldIdPrefix}-project-type`}
                label="Project type"
                onValueChange={changeValue}
                options={projectTypeOptions}
                placeholder="Select a project type"
                value={resolvedValues.projectType}
              />

              <SelectField
                disabled={disabled}
                field="projectStage"
                id={`${fieldIdPrefix}-project-stage`}
                label="Project stage"
                onValueChange={changeValue}
                options={projectStageOptions}
                placeholder="Select a project stage"
                value={resolvedValues.projectStage}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-2 px-4 pb-3 pt-0 sm:w-[287px] sm:translate-y-0 sm:gap-2 sm:pb-1">
            <Button
              aria-label={cta.ariaLabel}
              className={cn(
                'group h-auto min-h-11 w-full justify-between gap-2 overflow-hidden rounded-none border border-neutral-950 sm:min-h-[34px] sm:w-[256px]',
                'bg-[#8cff00] px-3 py-2 text-left text-[9px] font-black uppercase leading-tight tracking-[0.035em] text-neutral-950 sm:py-0 sm:text-[10px]',
                'shadow-[1px_1px_0_#111] hover:-translate-y-0.5 hover:bg-[#9bff24] hover:shadow-[1px_2px_0_#111]',
                'active:translate-y-0 active:shadow-[1px_2px_0_#111] motion-reduce:transform-none',
              )}
              disabled={disabled || cta.disabled}
              type="submit"
            >
              <span className="min-w-0 flex-1 whitespace-nowrap min-[900px]:relative! min-[900px]:left-[3px]! min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[1.044]! min-[900px]:scale-y-[1.43]!">
                {cta.label}
              </span>
              <ProjectCtaArrow />
            </Button>

            <div className="relative grid gap-1 text-[11px] leading-snug text-neutral-700 sm:translate-y-[4px] sm:grid-cols-[1fr_auto] sm:items-center sm:text-[8px]">
              <p className="flex items-start gap-1.5">
                <LockKeyhole
                  aria-hidden="true"
                  className="mt-px h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3"
                />
                <span className="min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[0.82]!">
                  {trustCopy.privacy}
                </span>
              </p>
              <span className="relative right-[8px] -top-[3px] inline-block origin-right scale-x-[0.64] font-[family-name:var(--font-oxanium)] text-[11px] font-extrabold uppercase tracking-[0.14em] text-neutral-950">
                {currentStep} OF {totalSteps}
              </span>
            </div>

            <div className="flex min-h-[27px] items-center gap-1.5 border border-[#16364a] bg-white/50 px-2 py-2 text-[11px] font-semibold leading-snug text-[#16364a] sm:w-[256px] sm:py-1 sm:text-[8px]">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="min-[900px]:inline-block! min-[900px]:origin-left! min-[900px]:scale-x-[0.82]!">
                {trustCopy.disclaimer}
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

type SelectFieldProps = {
  disabled: boolean
  field: Extract<ProjectAssessmentField, 'municipality' | 'projectStage' | 'projectType'>
  id: string
  label: string
  onValueChange: (field: ProjectAssessmentField, value: string) => void
  options: readonly ProjectAssessmentOption[]
  placeholder: string
  value: string
}

function SelectField({
  disabled,
  field,
  id,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: SelectFieldProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <Field className="gap-1 sm:gap-1">
      <FieldLabel
        className="relative top-[2px] font-[family-name:var(--font-league-gothic)] text-[11px] font-normal uppercase leading-none tracking-[0.75px] text-neutral-950 sm:text-[9px]"
        htmlFor={id}
      >
        {label}
      </FieldLabel>
      <Select
        disabled={disabled}
        name={field}
        onValueChange={(nextValue) => onValueChange(field, nextValue)}
        required
        value={value}
      >
        <SelectTrigger
          aria-required="true"
          className="relative h-9 w-full rounded-none border-[#858585] bg-white/70 px-2 text-xs shadow-[inset_-1px_-1px_0_rgb(0_0_0/0.18)] after:absolute after:top-[calc(50%+1px)] after:right-[7px] after:h-0 after:w-0 after:-translate-y-1/2 after:border-x-[2.5px] after:border-t-[3px] after:border-x-transparent after:border-t-black focus-visible:border-neutral-950 focus-visible:ring-neutral-950/20 [&_svg]:hidden sm:h-[22px] sm:text-[7.2px] sm:font-normal"
          id={id}
        >
          <SelectValue placeholder={placeholder}>{selectedLabel ?? placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

function ProjectCtaArrow() {
  return (
    <svg
      aria-hidden="true"
      className="size-marker mr-[-2px] h-[14px] w-[26px] shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
      fill="none"
      viewBox="0 0 26 14"
    >
      <path
        d="M1 7h23M18 1l6 6-6 6"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2"
      />
    </svg>
  )
}

type ProjectAssessmentProgressProps = {
  current: number
  label?: string
  total: number
  value: number
}

function ProjectAssessmentProgress({
  current,
  label,
  total,
  value,
}: ProjectAssessmentProgressProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 font-[family-name:var(--font-oxanium)] text-[11px] font-extrabold uppercase leading-none tracking-[0.14em] sm:text-[9px]">
        <span className="inline-block origin-left sm:scale-x-[0.81]">
          {label ?? `Step ${current} of ${total}`}
        </span>
        <span className="sr-only">{Math.round(value)}% complete</span>
      </div>
      <Progress
        aria-label={label ?? `Project assessment step ${current} of ${total}`}
        className="sr-only"
        value={value}
      />
      <div
        aria-hidden="true"
        className="grid grid-flow-col auto-cols-fr gap-1 sm:ml-px sm:w-[246px] sm:grid-cols-[44px_37px_37px_37px_36px_36px] sm:auto-cols-auto sm:grid-flow-row sm:gap-[3px]"
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            className={cn(
              'h-2 border border-[#14334a] bg-[#e7edf0] sm:h-[7px] sm:-translate-y-[8px]',
              index < current && 'bg-[#8cff00]',
            )}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}
