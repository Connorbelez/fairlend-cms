'use client'

import React, { createContext, useCallback, use, useEffect, useSyncExternalStore } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme, getResolvedTheme, setThemePreference, subscribeToThemePreference } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({
  children,
  initialTheme = defaultTheme,
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) => {
  const theme = useSyncExternalStore(
    subscribeToThemePreference,
    getResolvedTheme,
    () => initialTheme,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    setThemePreference(themeToSet || 'auto')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
