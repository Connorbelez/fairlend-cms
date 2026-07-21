'use client'

import { Search, X } from 'lucide-react'
import { useCallback, useEffect, useId, useState } from 'react'

const faqRootSelector = '#garden-suite-faq'

function openHashTarget() {
  const hash = window.location.hash.slice(1)
  if (!hash) return

  const target = document.getElementById(hash)
  if (target instanceof HTMLDetailsElement && target.matches('[data-faq-group]')) {
    target.open = true
    target.scrollIntoView({ block: 'start' })
  }
}

export function GardenSuiteFaqControls() {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [resultCount, setResultCount] = useState<number | null>(null)

  const filterQuestions = useCallback((nextQuery: string) => {
    const root = document.querySelector<HTMLElement>(faqRootSelector)
    if (!root) return

    const normalizedQuery = nextQuery.trim().toLocaleLowerCase()
    const groups = root.querySelectorAll<HTMLDetailsElement>('[data-faq-group]')
    const activeGroupId = window.location.hash.slice(1)
    const hasActiveGroup = Array.from(groups).some((group) => group.id === activeGroupId)
    let matches = 0

    groups.forEach((group, groupIndex) => {
      let groupMatches = 0
      group.querySelectorAll<HTMLDetailsElement>('[data-faq-question]').forEach((question) => {
        const isMatch =
          normalizedQuery.length === 0 ||
          question.textContent?.toLocaleLowerCase().includes(normalizedQuery) === true

        question.hidden = !isMatch
        if (isMatch) groupMatches += 1
      })

      group.hidden = groupMatches === 0
      if (normalizedQuery && groupMatches > 0) {
        group.open = true
      } else if (!normalizedQuery) {
        group.open = hasActiveGroup ? group.id === activeGroupId : groupIndex === 0
      }
      matches += groupMatches
    })

    setResultCount(matches)
  }, [])

  useEffect(() => {
    const syncHashTarget = () => {
      setQuery('')
      filterQuestions('')
      openHashTarget()
    }
    const topicIndex = document.getElementById('garden-suite-faq-topics')
    const syncCurrentTopic = (event: Event) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#garden-suite-faq-"]')
          : null

      if (link?.hash === window.location.hash) syncHashTarget()
    }

    syncHashTarget()
    window.addEventListener('hashchange', syncHashTarget)
    topicIndex?.addEventListener('click', syncCurrentTopic)
    return () => {
      window.removeEventListener('hashchange', syncHashTarget)
      topicIndex?.removeEventListener('click', syncCurrentTopic)
    }
  }, [filterQuestions])

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    filterQuestions(nextQuery)
  }

  return (
    <div className="garden-suite-faq__controls" role="search">
      <label htmlFor={inputId}>Search the decision file</label>
      <div className="garden-suite-faq__search-field">
        <Search aria-hidden="true" />
        <input
          aria-controls="garden-suite-faq-groups"
          autoComplete="off"
          id={inputId}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Try “permits”, “budget”, or “draws”"
          type="search"
          value={query}
        />
        {query ? (
          <button aria-label="Clear FAQ search" onClick={() => updateQuery('')} type="button">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p aria-live="polite">
        {resultCount === null || query.trim().length === 0
          ? 'Search all 90 project questions.'
          : `${resultCount} ${resultCount === 1 ? 'question' : 'questions'} found.`}
      </p>
    </div>
  )
}
