export type Locale = 'en' | 'es'

export interface AppConfig {
  focusMinutes: number
  restMinutes: number
  soundEnabled: boolean
  selectedSound: string
  confettiEnabled: boolean
  locale: Locale
}
