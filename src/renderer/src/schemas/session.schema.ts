export interface SessionRecord {
  id?: number
  startTime: Date | number
  endTime?: Date | number | null
  durationSeconds: number
  focusMinutes: number
  completed: boolean
  createdAt?: Date | number | null
}

export interface DailyActivity {
  date: string
  sessions: number
  totalMinutes: number
}

export interface FullSessionStats {
  today: { sessions: number; minutes: number }
  week: { sessions: number; minutes: number }
  total: { sessions: number; minutes: number }
  streak: number
  bestStreak: number
  avgPerDay: number
  longestSession: number
  completionRate: number
  weeklyActivity: { day: string; active: boolean; isToday: boolean }[]
  dailyActivity: DailyActivity[]
}
