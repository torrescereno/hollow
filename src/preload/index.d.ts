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

interface SessionStats {
  today: { count: number; totalMinutes: number }
  week: { count: number; totalMinutes: number }
  total: { count: number; totalMinutes: number }
}

interface FullSessionStats extends SessionStats {
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
  saveConfig: (config: { focusMinutes: number; soundEnabled: boolean }) => Promise<void>
  loadConfig: () => Promise<{
    focusMinutes: number
    soundEnabled: boolean
  }>
  onPinnedState: (callback: (isPinned: boolean) => void) => void
  session: {
    create: (data: NewSession) => Promise<Session>
    getAll: () => Promise<Session[]>
    getStats: () => Promise<SessionStats>
    getFullStats: () => Promise<FullSessionStats>
    clear: () => Promise<void>
    exportCsv: () => Promise<boolean>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
