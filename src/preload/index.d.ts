import type { AppConfig } from '../shared/types'

interface Session {
  id: number
  startTime: Date | null
  endTime: Date | null
  durationSeconds: number
  focusMinutes: number
  completed: boolean | null
  createdAt: Date | null
}

interface NewSession {
  startTime: Date | null
  endTime?: Date | null
  durationSeconds: number
  focusMinutes: number
  completed?: boolean | null
  createdAt?: Date | null
}

interface FullSessionStats {
  today: { sessions: number; minutes: number }
  week: { sessions: number; minutes: number }
  total: { sessions: number; minutes: number }
  streak: number
  bestStreak: number
  avgPerDay: number
  longestSession: number
  completionRate: number
  weeklyActivity: { day: string; active: boolean; isToday: boolean }[]
}

interface ElectronAPI {
  setAlwaysOnTop: (isPinned: boolean) => Promise<boolean>
  getPinnedState: () => Promise<boolean>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  resizeWindow: (width: number, height: number) => Promise<void>
  saveConfig: (config: AppConfig) => Promise<void>
  loadConfig: () => Promise<AppConfig>
  onPinnedState: (callback: (isPinned: boolean) => void) => void
  backgroundTask: {
    syncTimer: (payload: {
      isRunning: boolean
      timeLeft: number
      timerPhase: 'focus' | 'rest'
    }) => Promise<void>
  }
  session: {
    create: (data: NewSession) => Promise<Session>
    getAll: () => Promise<Session[]>
    getFullStats: () => Promise<FullSessionStats>
    clear: () => Promise<void>
    exportCsv: () => Promise<boolean>
  }
  openExternal: (url: string) => Promise<boolean>
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
