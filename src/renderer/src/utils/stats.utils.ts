import type { SessionRecord } from '../schemas'
import type { Stats } from '../schemas/stats.schema'

export function formatDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function computeStats(sessions: SessionRecord[]): Stats {
  const now = new Date()
  const todayStr = formatDateStr(now)

  const startOfWeek = new Date(now)
  const dow = startOfWeek.getDay()
  startOfWeek.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
  startOfWeek.setHours(0, 0, 0, 0)

  const todaySessions = sessions.filter((s) => s.date === todayStr)
  const weekSessions = sessions.filter((s) => new Date(s.completedAt) >= startOfWeek)

  let streak = 0
  const sessionDays = new Set(sessions.map((s) => s.date))
  const check = new Date(now)
  check.setHours(0, 0, 0, 0)

  if (!sessionDays.has(formatDateStr(check))) {
    check.setDate(check.getDate() - 1)
  }
  while (sessionDays.has(formatDateStr(check))) {
    streak++
    check.setDate(check.getDate() - 1)
  }

  const uniqueDaysCount = sessionDays.size
  const avgPerDay =
    uniqueDaysCount > 0 ? Math.round((sessions.length / uniqueDaysCount) * 10) / 10 : 0

  const longestSession = sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0

  return {
    today: {
      sessions: todaySessions.length,
      minutes: todaySessions.reduce((sum, s) => sum + s.duration, 0)
    },
    week: {
      sessions: weekSessions.length,
      minutes: weekSessions.reduce((sum, s) => sum + s.duration, 0)
    },
    total: {
      sessions: sessions.length,
      minutes: sessions.reduce((sum, s) => sum + s.duration, 0)
    },
    streak,
    avgPerDay,
    longestSession
  }
}
