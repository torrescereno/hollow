import React from 'react'
import { Pause, Pin, PinOff, Play, RotateCcw, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface ControlsProps {
  isPinned: boolean
  isRunning: boolean
  onTogglePin: () => void
  onReset: () => void
  onToggleTimer: () => void
  onOpenMenu: () => void
}

export function Controls({
  isPinned,
  isRunning,
  onTogglePin,
  onReset,
  onToggleTimer,
  onOpenMenu
}: ControlsProps): React.JSX.Element {
  return (
    <div className="app-no-drag flex items-center mt-3 gap-3">
      <button
        onClick={onTogglePin}
        title={isPinned ? 'Desanclar' : 'Anclar'}
        className={`rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 ${
          isPinned
            ? 'text-text-main bg-white/10'
            : 'text-white/25 hover:text-white/60 hover:bg-white/5'
        }`}
      >
        {isPinned ? <PinOff size={14} strokeWidth={1.5} /> : <Pin size={14} strokeWidth={1.5} />}
      </button>

      <button
        onClick={onReset}
        title="Reiniciar"
        className="rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
      >
        <RotateCcw size={14} strokeWidth={1.5} />
      </button>

      <motion.button
        onClick={onToggleTimer}
        animate={{
          boxShadow: isRunning ? '0 0 18px rgba(255,255,255,0.12)' : '0 0 0px rgba(255,255,255,0)'
        }}
        transition={{
          duration: 1.75,
          repeat: isRunning ? Infinity : 0,
          repeatType: 'mirror',
          ease: 'easeInOut',
          type: 'tween'
        }}
        title={isRunning ? 'Pausar' : 'Iniciar'}
        className="flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90 w-9 h-9"
      >
        {isRunning ? (
          <Pause size={15} fill="currentColor" />
        ) : (
          <Play size={15} fill="currentColor" className="ml-0.5" />
        )}
      </motion.button>

      <button
        onClick={onOpenMenu}
        title="Menú"
        className="rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 p-2 text-white/20 hover:text-white/50 hover:bg-white/5"
      >
        <MenuIcon size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
