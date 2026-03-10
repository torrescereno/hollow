import { useState, useEffect, useCallback } from 'react'
import type { AppConfig } from '../schemas'
import { playCompletionSound } from '../utils'
import type { SessionRecord } from '../schemas/session.schema'

interface UseTimerReturn {
  timeLeft: number
  isRunning: boolean
  toggleTimer: () => void
  resetTimer: () => void
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
}

export function useTimer(
  focusMinutes: number,
  configRef: React.MutableRefObject<AppConfig>,
  onSessionComplete: (session: Omit<SessionRecord, 'id' | 'createdAt'>) => void
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setTimeLeft(focusMinutes * 60)
  }, [focusMinutes])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return

    setIsRunning(false)

    const now = new Date()
    const session: Omit<SessionRecord, 'id' | 'createdAt'> = {
      startTime: now.getTime(),
      endTime: now.getTime(),
      durationSeconds: configRef.current.focusMinutes * 60,
      focusMinutes: configRef.current.focusMinutes,
      completed: true
    }

    onSessionComplete(session)

    if (configRef.current.soundEnabled) {
      playCompletionSound(configRef.current.selectedSound)
    }
  }, [timeLeft, isRunning, configRef, onSessionComplete])

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(focusMinutes * 60)
      return
    }
    setIsRunning((r) => !r)
  }, [timeLeft, focusMinutes])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(focusMinutes * 60)
  }, [focusMinutes])

  return {
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    setTimeLeft
  }
}
