import React, { useState } from 'react'
import { TimerView, MenuView } from './sections'
import { useConfig, useSessions, useStats, usePinned, useTimer, useViewTransition } from './hooks'
import type { MenuTab } from './schemas'

export default function App(): React.JSX.Element {
  const [menuTab, setMenuTab] = useState<MenuTab>('stats')

  const { view, switchView, isResizing } = useViewTransition()
  const { isPinned, togglePin } = usePinned()
  const { config, updateConfig, configRef } = useConfig()
  const { sessions, logSession, clearSessions } = useSessions()
  const stats = useStats(sessions)

  const { timeLeft, isRunning, toggleTimer, resetTimer, setTimeLeft } = useTimer(
    config.focusMinutes,
    configRef,
    logSession
  )

  return (
    <div className="app-drag app-container">
      <div
        className={`window ${view === 'timer' ? 'timer-view' : 'menu-view'}`}
        style={{ backgroundColor: '#0f0f0f' }}
      >
        {view === 'timer' && (
          <TimerView
            timeLeft={timeLeft}
            isRunning={isRunning}
            isPinned={isPinned}
            isTransitioning={isResizing}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onTogglePin={togglePin}
            onOpenMenu={() => switchView('menu')}
          />
        )}

        {view === 'menu' && (
          <MenuView
            menuTab={menuTab}
            stats={stats}
            config={config}
            isRunning={isRunning}
            onMenuTabChange={setMenuTab}
            onUpdateConfig={updateConfig}
            onTimeReset={(val) => setTimeLeft(val * 60)}
            onClearSessions={clearSessions}
            onBack={() => switchView('timer')}
          />
        )}
      </div>
    </div>
  )
}
