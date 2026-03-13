import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Timer, Controls } from '../../components'
import type { TimerPhase } from '../../hooks/useTimer'

interface TimerViewProps {
  timeLeft: number
  isRunning: boolean
  isPinned: boolean
  timerPhase: TimerPhase
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
  onToggleTimer,
  onResetTimer,
  onSkipRest,
  onTogglePin,
  onOpenMenu
}: TimerViewProps): React.JSX.Element {
  const displayMinutes = Math.ceil(timeLeft / 60).toString()
  const showTimer = timerPhase !== 'rest' || isRunning

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-5 transform-gpu backface-hidden"
    >
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
                  <Timer minutes={displayMinutes} isRunning={isRunning} />
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
                  Descanso
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
