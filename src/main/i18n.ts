import type Store from 'electron-store'
import type { StoreSchema } from './index'
import type { Translations } from '../shared/i18n'
import { getTranslations, interpolate } from '../shared/i18n'

let storeRef: Store<StoreSchema> | null = null

export function initMainI18n(store: Store<StoreSchema>): void {
  storeRef = store
}

export function getMainTranslations(): Translations {
  const locale = storeRef?.get('config.locale', 'en') as 'en' | 'es'
  return getTranslations(locale ?? 'en')
}

export { interpolate }
