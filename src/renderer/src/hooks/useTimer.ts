import { useState, useEffect, useCallback } from 'react'
import type { AppConfig } from '../schemas'
import { playCompletionSound } from '../utils'
import type { SessionRecord } from '../schemas/session.schema'

export type TimerPhase = 'focus' | 'rest'

interface UseTimerReturn {
  timeLeft: number
  isRunning: boolean
  timerPhase: TimerPhase
  toggleTimer: () => void
  resetTimer: () => void
  skipRest: () => void
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
}

export function useTimer(
  focusMinutes: number,
  restMinutes: number,
  configRef: React.MutableRefObject<AppConfig>,
  onSessionComplete: (session: Omit<SessionRecord, 'id' | 'createdAt'>) => void
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('focus')

  // Sync focusMinutes changes (only during focus phase)
  useEffect(() => {
    if (timerPhase === 'focus') {
      setTimeLeft(focusMinutes * 60)
    }
  }, [focusMinutes, timerPhase])

  // Sync restMinutes changes (only during rest phase when not running)
  useEffect(() => {
    if (timerPhase === 'rest' && !isRunning) {
      setTimeLeft(restMinutes * 60)
    }
  }, [restMinutes, timerPhase, isRunning])

  // Countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [isRunning, timeLeft])

  // Completion effect
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return

    setIsRunning(false)

    if (timerPhase === 'focus') {
      // Log session
      const now = new Date()
      const session: Omit<SessionRecord, 'id' | 'createdAt'> = {
        startTime: now.getTime(),
        endTime: now.getTime(),
        durationSeconds: configRef.current.focusMinutes * 60,
        focusMinutes: configRef.current.focusMinutes,
        completed: true
      }
      onSessionComplete(session)

      // Play sound
      if (configRef.current.soundEnabled) {
        playCompletionSound(configRef.current.selectedSound)
      }

      // Transition to rest
      setTimerPhase('rest')
      setTimeLeft(configRef.current.restMinutes * 60)
    } else {
      // Rest completed → play sound and return to focus
      if (configRef.current.soundEnabled) {
        playCompletionSound(configRef.current.selectedSound)
      }

      setTimerPhase('focus')
      setTimeLeft(configRef.current.focusMinutes * 60)
    }
  }, [timeLeft, isRunning, timerPhase, configRef, onSessionComplete])

  const toggleTimer = useCallback(() => {
    setIsRunning((r) => !r)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimerPhase('focus')
    setTimeLeft(focusMinutes * 60)
  }, [focusMinutes])

  const skipRest = useCallback(() => {
    setIsRunning(false)
    setTimerPhase('focus')
    setTimeLeft(focusMinutes * 60)
  }, [focusMinutes])

  return {
    timeLeft,
    isRunning,
    timerPhase,
    toggleTimer,
    resetTimer,
    skipRest,
    setTimeLeft
  }
}
