import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../../hooks/useTimer'
import type { AppConfig } from '../../schemas'
import type { SessionRecord } from '../../schemas/session.schema'
import * as audioUtils from '../../utils/audio.utils'

vi.mock('../../utils/audio.utils', () => ({
  playCompletionSound: vi.fn()
}))

describe('useTimer', () => {
  let mockOnSessionComplete: (session: Omit<SessionRecord, 'id' | 'createdAt'>) => void
  let mockConfigRef: React.MutableRefObject<AppConfig>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    mockOnSessionComplete = vi.fn()
    mockConfigRef = {
      current: {
        focusMinutes: 25,
        restMinutes: 5,
        soundEnabled: true,
        selectedSound: 'bell',
        confettiEnabled: true
      }
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with focus time', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    expect(result.current.timeLeft).toBe(1500)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timerPhase).toBe('focus')
  })

  it('should toggle timer', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    expect(result.current.isRunning).toBe(false)

    act(() => {
      result.current.toggleTimer()
    })

    expect(result.current.isRunning).toBe(true)

    act(() => {
      result.current.toggleTimer()
    })

    expect(result.current.isRunning).toBe(false)
  })

  it('should reset timer', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.toggleTimer()
    })

    expect(result.current.isRunning).toBe(true)

    act(() => {
      result.current.resetTimer()
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.timerPhase).toBe('focus')
    expect(result.current.timeLeft).toBe(1500)
  })

  it('should skip rest', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.skipRest()
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.timerPhase).toBe('focus')
    expect(result.current.timeLeft).toBe(1500)
  })

  it('should countdown correctly', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.toggleTimer()
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.timeLeft).toBe(1500)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(1499)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timeLeft).toBe(1494)
  })

  it('should allow manual time set', () => {
    const { result } = renderHook(() => useTimer(25, 5, mockConfigRef, mockOnSessionComplete))

    expect(result.current.timeLeft).toBe(1500)

    act(() => {
      result.current.setTimeLeft(120)
    })

    expect(result.current.timeLeft).toBe(120)
  })

  it('should sync focus minutes when phase is focus', () => {
    const { result, rerender } = renderHook(
      ({ focusMinutes }: { focusMinutes: number }) =>
        useTimer(focusMinutes, 5, mockConfigRef, mockOnSessionComplete),
      { initialProps: { focusMinutes: 25 } }
    )

    expect(result.current.timeLeft).toBe(1500)

    rerender({ focusMinutes: 30 })

    expect(result.current.timeLeft).toBe(1800)
  })

  it('should countdown while running', () => {
    const { result } = renderHook(() => useTimer(1, 1, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.toggleTimer()
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.timeLeft).toBe(60)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(59)
  })

  it('should transition to rest phase after completing', () => {
    const { result } = renderHook(() => useTimer(1, 1, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.toggleTimer()
    })

    act(() => {
      vi.advanceTimersByTime(60000)
    })

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current.timerPhase).toBe('rest')
    expect(result.current.timeLeft).toBe(60)

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isRunning).toBe(false)
  })

  it('should play sound when timer completes', () => {
    const { result } = renderHook(() => useTimer(1, 1, mockConfigRef, mockOnSessionComplete))

    act(() => {
      result.current.toggleTimer()
    })

    act(() => {
      vi.advanceTimersByTime(60000)
    })

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(audioUtils.playCompletionSound).toHaveBeenCalled()
  })
})
