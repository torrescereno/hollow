import React from 'react'
import { Pause, Pin, PinOff, Play, RotateCcw, SkipForward, Menu as MenuIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import type { TimerPhase } from '../../hooks/useTimer'
import { useI18n } from '../../providers'

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
  const { t } = useI18n()
  const isRest = timerPhase === 'rest'

  return (
    <div className="app-no-drag relative z-10 flex items-center mt-auto">
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
        <Button
          variant="icon"
          size="icon-sm"
          onClick={onTogglePin}
          aria-label={isPinned ? t.controls.unpinWindow : t.controls.pinWindow}
          isActive={isPinned}
          className="focus:ring-0 focus-visible:ring-0 focus:outline-none focus:ring-offset-0"
        >
          {isPinned ? <PinOff size={15} strokeWidth={1.5} /> : <Pin size={15} strokeWidth={1.5} />}
        </Button>

        <Button variant="icon" size="icon-sm" onClick={onReset} aria-label={t.controls.reset}>
          <RotateCcw size={15} strokeWidth={1.5} />
        </Button>
      </motion.div>

      <Button
        variant="play"
        size="icon"
        onClick={onToggleTimer}
        aria-label={isRunning ? t.controls.pause : t.controls.start}
        data-role="primary-timer-action"
        className={isRunning ? 'shadow-[0_0_20px_rgba(255,255,255,0.15)]' : ''}
      >
        {isRunning ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </Button>

      <motion.div
        initial={false}
        animate={{ width: 'auto', opacity: 1, marginLeft: 16 }}
        transition={collapseTransition}
        className="overflow-hidden"
      >
        {isRest ? (
          <Button
            variant="icon"
            size="icon-sm"
            onClick={onSkipRest}
            aria-label={t.controls.skipRest}
          >
            <SkipForward size={15} strokeWidth={1.5} />
          </Button>
        ) : (
          <Button variant="icon" size="icon-sm" onClick={onOpenMenu} aria-label={t.controls.menu}>
            <MenuIcon size={15} strokeWidth={1.5} />
          </Button>
        )}
      </motion.div>
    </div>
  )
}
