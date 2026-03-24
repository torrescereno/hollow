import { useState, useEffect, useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
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
  const [timeLeft, setTimeLeftState] = useState(focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('focus')
  const targetEndTimeRef = useRef<number | null>(null)
  const timeLeftRef = useRef(timeLeft)

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  // Sync focusMinutes changes (only during focus phase)
  useEffect(() => {
    if (timerPhase === 'focus') {
      if (isRunning) {
        targetEndTimeRef.current = Date.now() + focusMinutes * 1000 * 60
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeftState(focusMinutes * 60)
    }
  }, [focusMinutes, timerPhase, isRunning])

  // Sync restMinutes changes (only during rest phase when not running)
  useEffect(() => {
    if (timerPhase === 'rest' && !isRunning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeftState(restMinutes * 60)
    }
  }, [restMinutes, timerPhase, isRunning])

  // Countdown (timestamp-based to avoid hidden-window timer drift)
  useEffect(() => {
    if (!isRunning) return

    const syncTimeLeft = (): void => {
      const targetEndTime = targetEndTimeRef.current
      if (targetEndTime === null) return

      const remainingSeconds = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000))
      setTimeLeftState((current) => (current === remainingSeconds ? current : remainingSeconds))
    }

    syncTimeLeft()
    const id = setInterval(syncTimeLeft, 250)
    return () => clearInterval(id)
  }, [isRunning])

  // Completion effect
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsRunning(false)
    targetEndTimeRef.current = null

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
        playCompletionSound(configRef.current.selectedSound, configRef.current.locale)
      }

      // Transition to rest
      setTimerPhase('rest')
      setTimeLeftState(configRef.current.restMinutes * 60)
    } else {
      // Rest completed → play sound and return to focus
      if (configRef.current.soundEnabled) {
        playCompletionSound(configRef.current.selectedSound, configRef.current.locale)
      }

      setTimerPhase('focus')
      setTimeLeftState(configRef.current.focusMinutes * 60)
    }
  }, [timeLeft, isRunning, timerPhase, configRef, onSessionComplete])

  const toggleTimer = useCallback(() => {
    setIsRunning((running) => {
      if (running) {
        const targetEndTime = targetEndTimeRef.current
        const remainingSeconds =
          targetEndTime === null
            ? timeLeftRef.current
            : Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000))
        targetEndTimeRef.current = null
        setTimeLeftState(remainingSeconds)
        return false
      }

      targetEndTimeRef.current = Date.now() + timeLeftRef.current * 1000
      return true
    })
  }, [])

  const resetTimer = useCallback(() => {
    targetEndTimeRef.current = null
    setIsRunning(false)
    setTimerPhase('focus')
    setTimeLeftState(focusMinutes * 60)
  }, [focusMinutes])

  const skipRest = useCallback(() => {
    targetEndTimeRef.current = null
    setIsRunning(false)
    setTimerPhase('focus')
    setTimeLeftState(focusMinutes * 60)
  }, [focusMinutes])

  const setTimeLeft: Dispatch<SetStateAction<number>> = useCallback(
    (value) => {
      setTimeLeftState((current) => {
        const nextValue = typeof value === 'function' ? value(current) : value
        if (isRunning) {
          targetEndTimeRef.current = Date.now() + nextValue * 1000
        }
        return nextValue
      })
    },
    [isRunning]
  )

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
