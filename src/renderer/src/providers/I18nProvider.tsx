import React, { createContext, useContext, useMemo } from 'react'
import type { Locale } from '../../../shared/types'
import type { Translations } from '../../../shared/i18n'
import { getTranslations, interpolate } from '../../../shared/i18n'

interface I18nContextValue {
  t: Translations
  locale: Locale
  interpolate: (template: string, values: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  locale: Locale
  children: React.ReactNode
}

export function I18nProvider({ locale, children }: I18nProviderProps): React.JSX.Element {
  const value = useMemo<I18nContextValue>(
    () => ({
      t: getTranslations(locale),
      locale,
      interpolate
    }),
    [locale]
  )

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
