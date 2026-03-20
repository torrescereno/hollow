import React, { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type confetti from 'canvas-confetti'
import { Timer, Controls } from '../../components'
import { createConfetti } from '../../utils'
import type { TimerPhase } from '../../hooks/useTimer'
import { useI18n } from '../../providers'

interface TimerViewProps {
  timeLeft: number
  isRunning: boolean
  isPinned: boolean
  timerPhase: TimerPhase
  confettiEnabled: boolean
  onToggleTimer: () => void
  onResetTimer: () => void
  onSkipRest: () => void
  onTogglePin: () => void
  onOpenMenu: () => void
}

export function TimerView({
  timeLeft,
  isRunning,
  isPinned,
  timerPhase,
  confettiEnabled,
  onToggleTimer,
  onResetTimer,
  onSkipRest,
  onTogglePin,
  onOpenMenu
}: TimerViewProps): React.JSX.Element {
  const { t } = useI18n()
  const prevPhaseRef = useRef<TimerPhase>(timerPhase)
  const confettiFnRef = useRef<confetti.CreateTypes | null>(null)

  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      confettiFnRef.current = createConfetti(canvas)
    } else {
      confettiFnRef.current = null
    }
  }, [])

  useEffect(() => {
    if (prevPhaseRef.current === 'focus' && timerPhase === 'rest' && confettiEnabled) {
      confettiFnRef.current?.({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    prevPhaseRef.current = timerPhase
  }, [timerPhase, confettiEnabled])

  const isLastMinute = timeLeft < 60
  const displayValue = isLastMinute ? timeLeft.toString() : Math.floor(timeLeft / 60).toString()
  const displayUnit: 'm' | 's' = isLastMinute ? 's' : 'm'
  const showTimer = timerPhase !== 'rest' || isRunning

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-5 transform-gpu backface-hidden"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute flex flex-col items-center pb-4">
          <div className="flex">
            <AnimatePresence mode="wait">
              {showTimer ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <Timer value={displayValue} unit={displayUnit} isRunning={isRunning} />
                </motion.div>
              ) : (
                <motion.span
                  key="rest-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-4xl font-light text-white/75"
                >
                  {t.timer.rest}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Controls
        isPinned={isPinned}
        isRunning={isRunning}
        timerPhase={timerPhase}
        onTogglePin={onTogglePin}
        onReset={onResetTimer}
        onToggleTimer={onToggleTimer}
        onSkipRest={onSkipRest}
        onOpenMenu={onOpenMenu}
      />
    </motion.main>
  )
}
