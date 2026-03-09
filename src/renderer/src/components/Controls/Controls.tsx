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
    <div className="app-no-drag controls pinned">
      <button
        onClick={onTogglePin}
        title={isPinned ? 'Desanclar' : 'Anclar'}
        className={`btn-icon btn-pin ${isPinned ? 'active' : 'inactive'} pinned-size`}
      >
        {isPinned ? <PinOff size={14} strokeWidth={1.5} /> : <Pin size={14} strokeWidth={1.5} />}
      </button>

      <button onClick={onReset} title="Reiniciar" className="btn-icon btn-secondary pinned-size">
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
        className="btn-play pinned-size"
      >
        {isRunning ? (
          <Pause size={15} fill="currentColor" />
        ) : (
          <Play size={15} fill="currentColor" className="play-icon-offset" />
        )}
      </motion.button>

      <button onClick={onOpenMenu} title="Menú" className="btn-icon btn-secondary pinned-size">
        <MenuIcon size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
