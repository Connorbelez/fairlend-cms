import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'
export const themeCookieName = 'payload-theme'
export const themePreferenceChangeEvent = 'payload-theme-change'

export const defaultTheme = 'light'
export type ThemePreference = Theme | 'auto'

export function themePreferenceIsValid(value: null | string): value is ThemePreference {
  return value === 'auto' || value === 'light' || value === 'dark'
}

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}

export const getThemePreference = (): ThemePreference => {
  const preference = window.localStorage.getItem(themeLocalStorageKey)

  return themePreferenceIsValid(preference) ? preference : 'auto'
}

export const resolveThemePreference = (preference: ThemePreference): Theme => {
  if (preference === 'auto') {
    return getImplicitPreference() || defaultTheme
  }

  return preference
}

export const getResolvedTheme = (): Theme => resolveThemePreference(getThemePreference())

export const setThemePreference = (preference: ThemePreference): void => {
  if (preference === 'auto') {
    window.localStorage.removeItem(themeLocalStorageKey)
    document.cookie = `${themeCookieName}=; Max-Age=0; Path=/; SameSite=Lax`
  } else {
    window.localStorage.setItem(themeLocalStorageKey, preference)
    document.cookie = `${themeCookieName}=${preference}; Max-Age=31536000; Path=/; SameSite=Lax`
  }

  document.documentElement.setAttribute('data-theme', resolveThemePreference(preference))
  window.dispatchEvent(new Event(themePreferenceChangeEvent))
}

export const subscribeToThemePreference = (onStoreChange: () => void): (() => void) => {
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

  window.addEventListener('storage', onStoreChange)
  window.addEventListener(themePreferenceChangeEvent, onStoreChange)
  mediaQueryList.addEventListener('change', onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(themePreferenceChangeEvent, onStoreChange)
    mediaQueryList.removeEventListener('change', onStoreChange)
  }
}
