import { sql, and, gte, lte } from 'drizzle-orm'
import { getDb } from '../client'
import { sessions, type Session, type NewSession } from '../schema/session.schema'

function getStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export const sessionRepository = {
  create: (data: NewSession): Session => {
    const db = getDb()
    return db.insert(sessions).values(data).returning().get()
  },

  findAll: (): Session[] => {
    const db = getDb()
    return db.select().from(sessions).all()
  },

  findByDateRange: (start: Date, end: Date): Session[] => {
    const db = getDb()
    return db
      .select()
      .from(sessions)
      .where(and(gte(sessions.startTime, start), lte(sessions.startTime, end)))
      .all()
  },

  getTodayStats: (): { count: number; totalMinutes: number } => {
    const db = getDb()
    const today = getStartOfDay(new Date())

    const result = db
      .select({
        count: sql<number>`count(*)`.as('count'),
        totalMinutes: sql<number>`sum(${sessions.focusMinutes})`.as('totalMinutes')
      })
      .from(sessions)
      .where(gte(sessions.startTime, today))
      .get()

    return {
      count: result?.count ?? 0,
      totalMinutes: result?.totalMinutes ?? 0
    }
  },

  getWeekStats: (): { count: number; totalMinutes: number } => {
    const db = getDb()
    const weekStart = getStartOfWeek(new Date())

    const result = db
      .select({
        count: sql<number>`count(*)`.as('count'),
        totalMinutes: sql<number>`sum(${sessions.focusMinutes})`.as('totalMinutes')
      })
      .from(sessions)
      .where(gte(sessions.startTime, weekStart))
      .get()

    return {
      count: result?.count ?? 0,
      totalMinutes: result?.totalMinutes ?? 0
    }
  },

  getTotalStats: (): { count: number; totalMinutes: number } => {
    const db = getDb()

    const result = db
      .select({
        count: sql<number>`count(*)`.as('count'),
        totalMinutes: sql<number>`sum(${sessions.focusMinutes})`.as('totalMinutes')
      })
      .from(sessions)
      .get()

    return {
      count: result?.count ?? 0,
      totalMinutes: result?.totalMinutes ?? 0
    }
  },

  getCompletionRate: (): number => {
    const db = getDb()
    const result = db
      .select({
        total: sql<number>`count(*)`.as('total'),
        completed: sql<number>`sum(CASE WHEN ${sessions.completed} = 1 THEN 1 ELSE 0 END)`.as(
          'completed'
        )
      })
      .from(sessions)
      .get()

    if (!result || result.total === 0) return 0
    return Math.round((result.completed / result.total) * 100)
  },

  getLongestSession: (): number => {
    const db = getDb()
    const result = db
      .select({
        maxDuration: sql<number>`max(${sessions.focusMinutes})`.as('maxDuration')
      })
      .from(sessions)
      .get()

    return result?.maxDuration ?? 0
  },

  getAvgPerDay: (): number => {
    const db = getDb()
    const result = db
      .select({
        date: sql<string>`date(${sessions.startTime})`.as('date'),
        count: sql<number>`count(*)`.as('count')
      })
      .from(sessions)
      .groupBy(sql`date(${sessions.startTime})`)
      .all()

    if (result.length === 0) return 0

    const totalSessions = result.reduce((sum, r) => sum + (r.count ?? 0), 0)
    return Math.round((totalSessions / result.length) * 10) / 10
  },

  getWeeklyActivity: (): { day: string; active: boolean; isToday: boolean }[] => {
    const db = getDb()
    const today = new Date()
    const weekStart = getStartOfWeek(today)

    const activeDays = new Set<string>()
    const sessionsThisWeek = db
      .select({
        date: sql<string>`date(${sessions.startTime})`.as('date')
      })
      .from(sessions)
      .where(gte(sessions.startTime, weekStart))
      .all()

    sessionsThisWeek.forEach((s) => activeDays.add(s.date))

    const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
    const result: { day: string; active: boolean; isToday: boolean }[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      result.push({
        day: days[i],
        active: activeDays.has(dateStr),
        isToday: dateStr === today.toISOString().split('T')[0]
      })
    }

    return result
  },

  getDailyActivity: (
    daysBack: number = 365
  ): { date: string; sessions: number; totalMinutes: number }[] => {
    const db = getDb()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    startDate.setHours(0, 0, 0, 0)

    const rows = db
      .select({
        startTime: sessions.startTime,
        focusMinutes: sessions.focusMinutes
      })
      .from(sessions)
      .where(gte(sessions.startTime, startDate))
      .all()

    const dayMap = new Map<string, { sessions: number; totalMinutes: number }>()

    for (const row of rows) {
      const d = row.startTime instanceof Date ? row.startTime : new Date((row.startTime as number) * 1000)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const existing = dayMap.get(dateStr)
      if (existing) {
        existing.sessions++
        existing.totalMinutes += row.focusMinutes
      } else {
        dayMap.set(dateStr, { sessions: 1, totalMinutes: row.focusMinutes })
      }
    }

    return Array.from(dayMap.entries()).map(([date, data]) => ({
      date,
      sessions: data.sessions,
      totalMinutes: data.totalMinutes
    }))
  },

  clear: (): void => {
    const db = getDb()
    db.delete(sessions).run()
  }
}
