import type { Locale } from '../types'
import type { Translations } from './types'
import { en } from './en'
import { es } from './es'

export type { Translations }
export { en, es }

const locales: Record<Locale, Translations> = { en, es }

export function getTranslations(locale: Locale): Translations {
  return locales[locale] ?? en
}

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    values[key] !== undefined ? String(values[key]) : `{{${key}}}`
  )
}
