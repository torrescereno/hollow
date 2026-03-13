import React from 'react'
import { Pause, Pin, PinOff, Play, RotateCcw, SkipForward, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { TimerPhase } from '../../hooks/useTimer'

const collapseTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

interface ControlButtonProps {
  children: React.ReactNode
  onClick: () => void
  title: string
  isActive?: boolean
}

function ControlButton({
  children,
  onClick,
  title,
  isActive = false
}: ControlButtonProps): React.JSX.Element {
  const baseClasses =
    'shrink-0 rounded-full flex items-center justify-center active:scale-95 p-2 focus-ring transition-colors duration-200'

  return (
    <button
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${
        isActive ? 'text-white bg-white/10' : 'text-white/25 hover:text-white/50 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  )
}

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
        <ControlButton
          onClick={onTogglePin}
          title={isPinned ? 'Desanclar Ventana' : 'Anclar ventana'}
          isActive={isPinned}
        >
          {isPinned ? <PinOff size={15} strokeWidth={1.5} /> : <Pin size={15} strokeWidth={1.5} />}
        </ControlButton>

        <ControlButton onClick={onReset} title="Reiniciar">
          <RotateCcw size={15} strokeWidth={1.5} />
        </ControlButton>
      </motion.div>

      <button
        onClick={onToggleTimer}
        title={isRunning ? 'Pausar' : 'Iniciar'}
        className={`shrink-0 flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90 w-10 h-10 focus-ring ${
          isRunning ? 'shadow-[0_0_20px_rgba(255,255,255,0.15)]' : ''
        }`}
      >
        {isRunning ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ width: 'auto', opacity: 1, marginLeft: 16 }}
        transition={collapseTransition}
        className="overflow-hidden"
      >
        {isRest ? (
          <ControlButton onClick={onSkipRest} title="Saltar descanso">
            <SkipForward size={15} strokeWidth={1.5} />
          </ControlButton>
        ) : (
          <ControlButton onClick={onOpenMenu} title="Menu">
            <MenuIcon size={15} strokeWidth={1.5} />
          </ControlButton>
        )}
      </motion.div>
    </div>
  )
}
