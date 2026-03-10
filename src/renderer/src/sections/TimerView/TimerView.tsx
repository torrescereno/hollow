import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Timer, Controls } from '../../components'

interface TimerViewProps {
  timeLeft: number
  isRunning: boolean
  isPinned: boolean
  isTransitioning: boolean
  onToggleTimer: () => void
  onResetTimer: () => void
  onTogglePin: () => void
  onOpenMenu: () => void
}

export function TimerView({
  timeLeft,
  isRunning,
  isPinned,
  isTransitioning,
  onToggleTimer,
  onResetTimer,
  onTogglePin,
  onOpenMenu
}: TimerViewProps): React.JSX.Element {
  const displayMinutes = Math.ceil(timeLeft / 60).toString()
  const isCompleted = timeLeft === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 transform-gpu backface-hidden"
      style={{ display: isTransitioning ? 'none' : 'flex' }}
    >
      <div className="relative flex flex-1 items-center justify-center w-full">
        <AnimatePresence initial={false}>
          {isCompleted ? (
            <motion.span
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute font-mono text-text-main text-lg font-light"
            >
              Sesión terminada
            </motion.span>
          ) : (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute flex items-baseline gap-1"
            >
              <Timer minutes={displayMinutes} isRunning={isRunning} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Controls
        isPinned={isPinned}
        isRunning={isRunning}
        isCompleted={isCompleted}
        onTogglePin={onTogglePin}
        onReset={onResetTimer}
        onToggleTimer={onToggleTimer}
        onOpenMenu={onOpenMenu}
      />
    </motion.div>
  )
}
