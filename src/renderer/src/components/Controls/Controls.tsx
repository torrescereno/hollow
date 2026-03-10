import React from 'react'
import { Check, Pause, Pin, PinOff, Play, RotateCcw, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'

const collapseTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

interface ControlsProps {
  isPinned: boolean
  isRunning: boolean
  isCompleted: boolean
  onTogglePin: () => void
  onReset: () => void
  onToggleTimer: () => void
  onOpenMenu: () => void
}

export function Controls({
  isPinned,
  isRunning,
  isCompleted,
  onTogglePin,
  onReset,
  onToggleTimer,
  onOpenMenu
}: ControlsProps): React.JSX.Element {
  return (
    <div className="app-no-drag flex items-center mt-auto">
      <motion.div
        initial={false}
        animate={
          isCompleted
            ? { width: 0, opacity: 0, marginRight: 0 }
            : { width: 'auto', opacity: 1, marginRight: 16 }
        }
        transition={collapseTransition}
        className="flex items-center gap-4 overflow-hidden"
      >
        <button
          onClick={onTogglePin}
          title={isPinned ? 'Unpin window' : 'Pin window'}
          className={`shrink-0 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 ${
            isPinned
              ? 'text-text-main bg-white/10'
              : 'text-white/25 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          {isPinned ? <PinOff size={15} strokeWidth={1.5} /> : <Pin size={15} strokeWidth={1.5} />}
        </button>

        <button
          onClick={onReset}
          title="Reset"
          className="shrink-0 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
        >
          <RotateCcw size={15} strokeWidth={1.5} />
        </button>
      </motion.div>

      <motion.button
        onClick={onToggleTimer}
        animate={{
          boxShadow:
            isRunning && !isCompleted
              ? [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 15px rgba(255,255,255,0.12)',
                  '0 0 0px rgba(255,255,255,0)'
                ]
              : '0 0 0px rgba(255,255,255,0)'
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        title={isCompleted ? 'Dismiss' : isRunning ? 'Pause' : 'Start'}
        className="shrink-0 flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90 w-10 h-10"
      >
        {isCompleted ? (
          <Check size={16} strokeWidth={2.5} />
        ) : isRunning ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </motion.button>

      <motion.div
        initial={false}
        animate={
          isCompleted
            ? { width: 0, opacity: 0, marginLeft: 0 }
            : { width: 'auto', opacity: 1, marginLeft: 16 }
        }
        transition={collapseTransition}
        className="overflow-hidden"
      >
        <button
          onClick={onOpenMenu}
          title="Menu"
          className="shrink-0 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
        >
          <MenuIcon size={15} strokeWidth={1.5} />
        </button>
      </motion.div>
    </div>
  )
}
