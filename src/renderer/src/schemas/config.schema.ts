export interface SoundOption {
  id: string
  name: string
  filename: string
}

export interface AppConfig {
  focusMinutes: number
  soundEnabled: boolean
  selectedSound: string
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: 'bell', name: 'Campana Clásica', filename: 'bell.wav' },
  { id: 'digital', name: 'Pitido Digital', filename: 'digital.wav' },
  { id: 'wood', name: 'Bloque de Madera', filename: 'wood.wav' },
  { id: 'bowl', name: 'Cuenco Tibetano', filename: 'bowl.wav' }
]

export const DEFAULT_CONFIG: AppConfig = {
  focusMinutes: 25,
  soundEnabled: true,
  selectedSound: 'bell'
}

export const MIN_MINUTES = 1
export const MAX_MINUTES = 90
