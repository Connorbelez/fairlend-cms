'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { CALCULATOR_CATEGORIES } from '@/calculators/categories'
import { CALCULATORS } from '@/calculators/catalog'
import type { CalculatorCategory } from '@/calculators/types'

import styles from './CalculatorSuite.module.css'

type Filter = 'all' | CalculatorCategory

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function CalculatorDirectory() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const normalized = normalizeSearch(query)
    return CALCULATORS.filter((calculator) => {
      const categoryMatches = filter === 'all' || calculator.category === filter
      const queryMatches = !normalized || normalizeSearch(`${calculator.title} ${calculator.description}`).includes(normalized)
      return categoryMatches && queryMatches
    })
  }, [filter, query])

  return (
    <main className={styles.suite}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>FairLend decision tools</p>
            <h1 className={styles.title}>Put the assumptions on the table.</h1>
            <p className={styles.lede}>
              Mortgage, construction, rental-housing, and investor models built as transparent working papers. Every result keeps its formula, evidence state, and source in view.
            </p>
          </div>
          <div className={styles.heroCount} aria-label={`${CALCULATORS.length} calculators and decision tools`}>
            <strong>{CALCULATORS.length}</strong>
            <span>calculators, planners, comparators, and evidence checklists in one underwriting workbench</span>
          </div>
        </section>

        <section className={styles.directoryLayout} aria-label="Calculator directory">
          <aside className={styles.filterRail}>
            <div className={styles.searchWrap}>
              <label htmlFor="calculator-search">Find a tool</label>
              <Input id="calculator-search" className={styles.search} onChange={(event) => setQuery(event.target.value)} placeholder="Cost, draw, DSCR…" type="search" value={query} />
            </div>
            <div className={styles.filters} aria-label="Filter by workflow">
              <button className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`} onClick={() => setFilter('all')} type="button">All tools</button>
              {CALCULATOR_CATEGORIES.map((category) => (
                <button className={`${styles.filterButton} ${filter === category.id ? styles.filterButtonActive : ''}`} key={category.id} onClick={() => setFilter(category.id)} type="button">{category.label}</button>
              ))}
            </div>
          </aside>

          <div className={styles.directoryMain}>
            <div className={styles.directoryHeader}>
              <h2>{filter === 'all' ? 'The complete desk' : CALCULATOR_CATEGORIES.find((item) => item.id === filter)?.label}</h2>
              <span className={styles.utility} aria-live="polite">{visible.length} tools</span>
            </div>
            {visible.length ? (
              <div className={styles.cards}>
                {visible.map((calculator) => {
                  const index = CALCULATORS.findIndex((item) => item.slug === calculator.slug) + 1
                  return (
                    <Link className={styles.card} href={`/calculators/${calculator.slug}`} key={calculator.slug}>
                      <div className={styles.cardTop}>
                        <span className={styles.kind}>{calculator.kind}</span>
                        <span className={styles.cardIndex}>{String(index).padStart(2, '0')} / {CALCULATORS.length}</span>
                      </div>
                      <h3>{calculator.title}</h3>
                      <p>{calculator.description}</p>
                      <span className={styles.cardAction}>Open workbench <ArrowUpRight aria-hidden="true" size={15} /></span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                <h3>No tool matches that search.</h3>
                <p>Try a broader term such as “mortgage,” “draw,” “rent,” or “MLI.”</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
