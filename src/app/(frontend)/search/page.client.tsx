'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { trackFairlendEvent } from '@/lib/analytics/events'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const searchParams = useSearchParams()
  const hasQuery = Boolean(searchParams.get('q')?.trim())

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  useEffect(() => {
    if (hasQuery) trackFairlendEvent('fairlend_search_performed', { source: 'site-search' })
  }, [hasQuery])
  return <React.Fragment />
}

export default PageClient
