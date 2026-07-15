'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { getCalculatorCategory } from '@/calculators/categories'
import type { CalculatorDefinition, CalculatorField, CalculatorInputs, CalculatorInputValue, CalculatorOutput, CalculatorResultFormat } from '@/calculators/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import styles from './CalculatorSuite.module.css'

const formatters = {
  currency: new Intl.NumberFormat('en-CA', { currency: 'CAD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0, style: 'currency' }),
  number: new Intl.NumberFormat('en-CA', { maximumFractionDigits: 2 }),
  percent: new Intl.NumberFormat('en-CA', { maximumFractionDigits: 2, style: 'percent' }),
}

function formatValue(value: number | string | null | undefined, format: CalculatorResultFormat) {
  if (value === null || value === undefined || value === '') return 'Not defined'
  if (typeof value === 'string') {
    if (format === 'date') {
      const date = new Date(`${value}T12:00:00Z`)
      if (!Number.isNaN(date.valueOf())) return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
    }
    return value
  }
  if (!Number.isFinite(value)) return 'Not defined'
  if (format === 'currency') return formatters.currency.format(value)
  if (format === 'percent') return formatters.percent.format(value)
  if (format === 'ratio') return `${formatters.number.format(value)}×`
  if (format === 'months') return `${formatters.number.format(value)} months`
  return formatters.number.format(value)
}

function CalculatorInput({ field, onChange, value }: { field: CalculatorField; onChange: (value: CalculatorInputValue) => void; value: CalculatorInputValue }) {
  const id = `calculator-field-${field.key}`

  if (field.type === 'toggle') {
    return (
      <div className={styles.toggleRow}>
        <Label htmlFor={id}>{field.label}</Label>
        <Switch aria-label={field.label} checked={Boolean(value)} id={id} onCheckedChange={onChange} />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        <Label className={styles.fieldLabel} htmlFor={id}>{field.label}</Label>
        <Select onValueChange={onChange} value={String(value)}>
          <SelectTrigger aria-label={field.label} className={styles.search} id={id}><SelectValue /></SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    )
  }

  const isPercent = field.type === 'percent'
  const inputValue = isPercent && typeof value === 'number' ? value * 100 : value
  const suffix = isPercent ? '%' : field.type === 'currency' ? 'CAD' : field.suffix
  return (
    <div>
      <Label className={styles.fieldLabel} htmlFor={id}>{field.label}</Label>
      <div className={styles.inputRow}>
        <Input
          id={id}
          inputMode={field.type === 'date' ? undefined : 'decimal'}
          max={isPercent && field.max !== undefined ? field.max * 100 : field.max}
          min={isPercent && field.min !== undefined ? field.min * 100 : field.min}
          onChange={(event) => {
            if (field.type === 'date') onChange(event.target.value)
            else {
              const parsed = event.target.value === '' ? 0 : Number(event.target.value)
              onChange(isPercent ? parsed / 100 : parsed)
            }
          }}
          step={isPercent && field.step !== undefined ? field.step * 100 : field.step}
          type={field.type === 'date' ? 'date' : 'number'}
          value={String(inputValue)}
        />
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </div>
      {field.description ? <p className={styles.utility}>{field.description}</p> : null}
    </div>
  )
}

export function CalculatorWorkbench({
  definition,
  initialInputs,
  initialResult,
}: {
  definition: CalculatorDefinition
  initialInputs: CalculatorInputs
  initialResult: CalculatorOutput
}) {
  const [inputs, setInputs] = useState(initialInputs)
  const [calculation, setCalculation] = useState<{ error: string | null; result: CalculatorOutput | null }>({ error: null, result: initialResult })
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/calculators/${definition.slug}`, {
          body: JSON.stringify(inputs),
          headers: { 'content-type': 'application/json' },
          method: 'POST',
          signal: controller.signal,
        })
        const body = await response.json() as { error?: string; result?: CalculatorOutput }
        if (!response.ok || !body.result) throw new Error(body.error ?? 'This scenario could not be calculated.')
        setCalculation({ error: null, result: body.result })
      } catch (error) {
        if (controller.signal.aborted) return
        setCalculation({ error: error instanceof Error ? error.message : 'This scenario could not be calculated.', result: null })
      }
    }, 120)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [definition.slug, inputs])

  const category = getCalculatorCategory(definition.category)
  const groupedFields = definition.fields.reduce<Record<string, CalculatorField[]>>((groups, field) => {
    const group = field.group ?? 'Scenario inputs'
    groups[group] = [...(groups[group] ?? []), field]
    return groups
  }, {})

  return (
    <main className={styles.suite}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/calculators">Calculators</Link><span aria-hidden="true">/</span><span>{category?.label}</span><span aria-hidden="true">/</span><span aria-current="page">{definition.title}</span>
        </nav>

        <header className={styles.toolHero}>
          <div>
            <p className={styles.eyebrow}>{category?.label}</p>
            <h1 className={styles.toolTitle}>{definition.title}</h1>
            <p className={styles.lede}>{definition.description}</p>
          </div>
          <div className={styles.modelStamp}>Preliminary model<br />not a quote</div>
        </header>

        <div className={styles.workbench}>
          <section className={styles.panel} aria-labelledby="inputs-title">
            <div className={styles.panelHeading}>
              <h2 id="inputs-title">Input docket</h2>
              <button className={styles.resetButton} onClick={() => setInputs(initialInputs)} type="button">Reset example</button>
            </div>
            {Object.entries(groupedFields).map(([group, fields]) => (
              <fieldset className={styles.fieldGroup} key={group}>
                <legend><h3>{group}</h3></legend>
                <div className={styles.fieldList}>
                  {fields?.map((field) => (
                    <CalculatorInput field={field} key={field.key} onChange={(value) => setInputs((current) => ({ ...current, [field.key]: value }))} value={inputs[field.key] ?? field.defaultValue} />
                  ))}
                </div>
              </fieldset>
            ))}
          </section>

          <section className={styles.panel} aria-labelledby="results-title" aria-live="polite">
            <div className={styles.panelHeading}><h2 id="results-title">Result sheet</h2><span className={styles.utility}>Live scenario</span></div>
            {calculation.error ? <p className={styles.warning} role="alert">{calculation.error}</p> : (
              <>
                <div className={styles.resultList}>
                  {definition.results.map((item) => (
                    <div className={item.emphasis ? styles.resultItemPrimary : styles.resultItem} key={item.key}>
                      <span className={styles.resultLabel}>{item.label}</span>
                      <strong className={styles.resultValue}>{formatValue(calculation.result?.values[item.key], item.format)}</strong>
                    </div>
                  ))}
                </div>
                {calculation.result?.warnings.map((warning) => <p className={styles.warning} key={warning}>{warning}</p>)}
                {calculation.result?.notes.map((note) => <p className={styles.notice} key={note}>{note}</p>)}
              </>
            )}
          </section>

          <aside className={styles.panel} aria-labelledby="method-title">
            <div className={styles.panelHeading}><h2 id="method-title">Assumption ledger</h2><span className={styles.utility}>v2026.07</span></div>
            <div>
              <div className={styles.ledgerList}>
                {definition.assumptions.map((assumption) => (
                  <div className={styles.ledgerItem} key={assumption.label}>
                    <span>{assumption.label}<small className={styles.ledgerStatus}>{assumption.status}</small></span>
                    <span>{assumption.value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.panelHeading}><h2>Method</h2></div>
              <ol className={styles.formulaList}>{definition.formulaSummary.map((formula) => <li className={styles.formulaItem} key={formula}>{formula}</li>)}</ol>
              <div className={styles.panelHeading}><h2>Primary sources</h2></div>
              <ul className={styles.sourceList}>
                {definition.sources.map((source) => (
                  <li className={styles.sourceItem} key={source.url}>
                    <a href={source.url} rel="noreferrer" target="_blank">{source.title}</a>
                    <span>{source.organization} · verified {source.verifiedAt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className={styles.disclaimer} aria-label="Calculator limitations">
          <strong>Model boundary</strong>
          <p>Preliminary educational scenario only. This output is not an approval, offer, commitment, appraisal, zoning determination, legal opinion, tax advice, insurance quote, or investment recommendation. Verify contract terms, current program rules, value, eligible cost, evidence, priority, and professional requirements before relying on it.</p>
        </section>
      </div>
    </main>
  )
}
