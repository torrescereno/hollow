import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useStats } from '../../hooks/useStats'
import { sessionsService } from '../../services'
import type { Stats } from '../../schemas/stats.schema'

vi.mock('../../services', () => ({
  sessionsService: {
    getFullStats: vi.fn()
  }
}))

describe('useStats', () => {
  const mockStats: Stats = {
    today: { sessions: 5, minutes: 125 },
    week: { sessions: 25, minutes: 625 },
    total: { sessions: 100, minutes: 2500 },
    streak: 7,
    bestStreak: 12,
    avgPerDay: 4.2,
    longestSession: 45,
    completionRate: 85,
    weeklyActivity: [
      { day: 'Lu', active: true, isToday: false },
      { day: 'Ma', active: false, isToday: false },
      { day: 'Mi', active: true, isToday: false },
      { day: 'Ju', active: false, isToday: false },
      { day: 'Vi', active: true, isToday: true },
      { day: 'Sa', active: false, isToday: false },
      { day: 'Do', active: false, isToday: false }
    ],
    dailyActivity: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load stats on mount', async () => {
    vi.mocked(sessionsService.getFullStats).mockResolvedValue(mockStats)

    const { result } = renderHook(() => useStats())

    await waitFor(() => {
      expect(result.current.stats.today.sessions).toBe(5)
    })

    expect(sessionsService.getFullStats).toHaveBeenCalled()
  })

  it('should initialize with default stats', () => {
    vi.mocked(sessionsService.getFullStats).mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useStats())

    expect(result.current.stats).toEqual({
      today: { sessions: 0, minutes: 0 },
      week: { sessions: 0, minutes: 0 },
      total: { sessions: 0, minutes: 0 },
      streak: 0,
      bestStreak: 0,
      avgPerDay: 0,
      longestSession: 0,
      completionRate: 0,
      weeklyActivity: []
    })
  })

  it('should refresh stats', async () => {
    vi.mocked(sessionsService.getFullStats)
      .mockResolvedValueOnce(mockStats)
      .mockResolvedValueOnce({
        ...mockStats,
        today: { sessions: 10, minutes: 250 }
      })

    const { result } = renderHook(() => useStats())

    await waitFor(() => {
      expect(result.current.stats.today.sessions).toBe(5)
    })

    await act(async () => {
      await result.current.refresh()
    })

    expect(sessionsService.getFullStats).toHaveBeenCalledTimes(2)
    expect(result.current.stats.today.sessions).toBe(10)
  })

  it('should handle empty stats', async () => {
    const emptyStats: Stats = {
      today: { sessions: 0, minutes: 0 },
      week: { sessions: 0, minutes: 0 },
      total: { sessions: 0, minutes: 0 },
      streak: 0,
      bestStreak: 0,
      avgPerDay: 0,
      longestSession: 0,
      completionRate: 0,
      weeklyActivity: [
        { day: 'Lu', active: false, isToday: false },
        { day: 'Ma', active: false, isToday: false },
        { day: 'Mi', active: false, isToday: false },
        { day: 'Ju', active: false, isToday: false },
        { day: 'Vi', active: false, isToday: true },
        { day: 'Sa', active: false, isToday: false },
        { day: 'Do', active: false, isToday: false }
      ],
      dailyActivity: []
    }

    vi.mocked(sessionsService.getFullStats).mockResolvedValue(emptyStats)

    const { result } = renderHook(() => useStats())

    await waitFor(() => {
      expect(result.current.stats).toEqual(emptyStats)
    })
  })

  it('should return all stats properties', async () => {
    vi.mocked(sessionsService.getFullStats).mockResolvedValue(mockStats)

    const { result } = renderHook(() => useStats())

    await waitFor(() => {
      expect(result.current.stats).toBeDefined()
    })

    expect(result.current.stats.today).toBeDefined()
    expect(result.current.stats.week).toBeDefined()
    expect(result.current.stats.total).toBeDefined()
    expect(result.current.stats.streak).toBeDefined()
    expect(result.current.stats.bestStreak).toBeDefined()
    expect(result.current.stats.avgPerDay).toBeDefined()
    expect(result.current.stats.longestSession).toBeDefined()
    expect(result.current.stats.completionRate).toBeDefined()
    expect(result.current.stats.weeklyActivity).toBeDefined()
  })
})
