import React from 'react'
import { Pause, Pin, PinOff, Play, RotateCcw, SkipForward, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { TimerPhase } from '../../hooks/useTimer'

const collapseTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

interface ControlsProps {
  isPinned: boolean
  isRunning: boolean
  timerPhase: TimerPhase
  onTogglePin: () => void
  onReset: () => void
  onToggleTimer: () => void
  onSkipRest: () => void
  onOpenMenu: () => void
}

export function Controls({
  isPinned,
  isRunning,
  timerPhase,
  onTogglePin,
  onReset,
  onToggleTimer,
  onSkipRest,
  onOpenMenu
}: ControlsProps): React.JSX.Element {
  const isRest = timerPhase === 'rest'

  return (
    <div className="app-no-drag flex items-center mt-auto">
      {/* Left section: pin + reset (focus only) */}
      <motion.div
        initial={false}
        animate={
          isRest
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

      {/* Center: play/pause */}
      <motion.button
        onClick={onToggleTimer}
        animate={{
          boxShadow: isRunning
            ? [
                '0 0 0px rgba(255,255,255,0)',
                '0 0 15px rgba(255,255,255,0.12)',
                '0 0 0px rgba(255,255,255,0)'
              ]
            : '0 0 0px rgba(255,255,255,0)'
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        title={isRunning ? 'Pause' : 'Start'}
        className="shrink-0 flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90 w-10 h-10"
      >
        {isRunning ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </motion.button>

      {/* Right section: menu (focus) or skip (rest) */}
      <motion.div
        initial={false}
        animate={{ width: 'auto', opacity: 1, marginLeft: 16 }}
        transition={collapseTransition}
        className="overflow-hidden"
      >
        {isRest ? (
          <button
            onClick={onSkipRest}
            title="Skip rest"
            className="shrink-0 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
          >
            <SkipForward size={15} strokeWidth={1.5} />
          </button>
        ) : (
          <button
            onClick={onOpenMenu}
            title="Menu"
            className="shrink-0 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
          >
            <MenuIcon size={15} strokeWidth={1.5} />
          </button>
        )}
      </motion.div>
    </div>
  )
}
