import { useState, useEffect, useCallback } from 'react'
import type { AppConfig } from '../schemas'
import { playCompletionSound } from '../utils'
import { formatDateStr } from '../utils/stats.utils'
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
  onSessionComplete: (session: SessionRecord) => void
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

    const session: SessionRecord = {
      date: formatDateStr(new Date()),
      duration: configRef.current.focusMinutes,
      completedAt: Date.now()
    }

    onSessionComplete(session)

    if (configRef.current.soundEnabled) {
      playCompletionSound()
    }

    if (configRef.current.autoStart) {
      setTimeout(() => {
        setTimeLeft(configRef.current.focusMinutes * 60)
        setIsRunning(true)
      }, 1500)
    }
  }, [timeLeft, isRunning, configRef, onSessionComplete])

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(focusMinutes * 60)
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
