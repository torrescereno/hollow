import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  durationSeconds: integer('duration_seconds').notNull(),
  focusMinutes: integer('focus_minutes').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export interface SessionStats {
  today: { count: number; totalMinutes: number }
  week: { count: number; totalMinutes: number }
  total: { count: number; totalMinutes: number }
}

export interface DailyActivity {
  date: string
  sessions: number
  totalMinutes: number
}

export interface FullSessionStats extends SessionStats {
  streak: number
  bestStreak: number
  avgPerDay: number
  longestSession: number
  completionRate: number
  weeklyActivity: { day: string; active: boolean; isToday: boolean }[]
  dailyActivity: DailyActivity[]
}
