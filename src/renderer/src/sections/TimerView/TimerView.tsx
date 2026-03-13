import React from 'react'
import { motion } from 'motion/react'
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

  return (
    <main className="absolute inset-0 flex flex-col items-center justify-center p-5 transform-gpu backface-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className="relative flex items-center justify-center w-full h-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute flex flex-col items-center pb-4"
        >
          {timerPhase === 'rest' && (
            <span className="absolute text-[10px] font-mono text-white/25 tracking-widest uppercase">
              descanso
            </span>
          )}
          <div className="flex">
            <Timer minutes={displayMinutes} isRunning={isRunning} />
          </div>
        </motion.div>
      </motion.div>
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
    </main>
  )
}
