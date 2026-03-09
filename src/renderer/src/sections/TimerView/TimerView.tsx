import React from 'react'
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

  return (
    <div className="timer-container pinned" style={{ display: isTransitioning ? 'none' : 'flex' }}>
      <Timer minutes={displayMinutes} isRunning={isRunning} />
      <Controls
        isPinned={isPinned}
        isRunning={isRunning}
        onTogglePin={onTogglePin}
        onReset={onResetTimer}
        onToggleTimer={onToggleTimer}
        onOpenMenu={onOpenMenu}
      />
    </div>
  )
}
