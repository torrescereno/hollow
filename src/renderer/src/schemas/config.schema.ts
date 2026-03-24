export type { AppConfig } from '../../../shared/types'
import type { AppConfig } from '../../../shared/types'

export interface SoundOption {
  id: string
  filename: string
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: 'bell', filename: 'bell.wav' },
  { id: 'digital', filename: 'digital.wav' },
  { id: 'wood', filename: 'wood.wav' },
  { id: 'bowl', filename: 'bowl.wav' }
]

export const DEFAULT_CONFIG: AppConfig = {
  focusMinutes: 25,
  restMinutes: 2,
  soundEnabled: true,
  selectedSound: 'bell',
  confettiEnabled: true,
  backgroundTrayEnabled: false,
  locale: 'en'
}

export const FOCUS_WARNING_THRESHOLD = 30
export const MIN_MINUTES = 1
export const MAX_MINUTES = 90
export const MAX_REST_MINUTES = 30
