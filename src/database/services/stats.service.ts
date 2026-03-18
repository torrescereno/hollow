import { sessionRepository, streakRepository } from '../repositories'

export const statsService = {
  getFullStats: () => {
    const streak = streakRepository.getOrCreate()
    const today = sessionRepository.getTodayStats()
    const week = sessionRepository.getWeekStats()
    const total = sessionRepository.getTotalStats()
    const completionRate = sessionRepository.getCompletionRate()
    const longestSession = sessionRepository.getLongestSession()
    const avgPerDay = sessionRepository.getAvgPerDay()
    const weeklyActivity = sessionRepository.getWeeklyActivity()
    const dailyActivity = sessionRepository.getDailyActivity(365)

    return {
      today: { sessions: today.count, minutes: today.totalMinutes },
      week: { sessions: week.count, minutes: week.totalMinutes },
      total: { sessions: total.count, minutes: total.totalMinutes },
      streak: streak.currentStreak,
      bestStreak: streak.bestStreak,
      avgPerDay,
      longestSession,
      completionRate,
      weeklyActivity,
      dailyActivity
    }
  },

  updateStreakOnSessionComplete: (completedDate: Date) => {
    return streakRepository.updateStreak(completedDate)
  }
}
