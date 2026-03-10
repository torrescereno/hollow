export interface SessionRecord {
  id?: number
  startTime: Date | number
  endTime?: Date | number | null
  durationSeconds: number
  focusMinutes: number
  completed: boolean
  createdAt?: Date | number | null
}

export interface SessionStats {
  today: { count: number; totalMinutes: number }
  week: { count: number; totalMinutes: number }
  total: { count: number; totalMinutes: number }
}

export interface FullSessionStats extends SessionStats {
  streak: number
  bestStreak: number
  avgPerDay: number
  longestSession: number
  completionRate: number
  weeklyActivity: { day: string; active: boolean; isToday: boolean }[]
}
