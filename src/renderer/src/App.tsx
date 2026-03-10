import React, { useState } from 'react'
import { useConfig, usePinned, useSessions, useStats, useTimer, useViewTransition } from './hooks'
import type { MenuTab } from './schemas'
import { MenuView, TimerView } from './sections'

export default function App(): React.JSX.Element {
  const [menuTab, setMenuTab] = useState<MenuTab>('stats')

  const { view, switchView, isResizing } = useViewTransition()
  const { isPinned, togglePin } = usePinned()
  const { config, updateConfig, configRef } = useConfig()
  const { stats, refresh: refreshStats } = useStats()
  const { logSession, clearSessions, exportCsv } = useSessions({ onSessionLogged: refreshStats })

  const { timeLeft, isRunning, toggleTimer, resetTimer, setTimeLeft } = useTimer(
    config.focusMinutes,
    configRef,
    logSession
  )

  const windowClass =
    view === 'menu' ? 'w-[700px] h-[500px] rounded-[2rem]' : 'w-[260px] h-[160px] rounded-[1.5rem]'

  return (
    <div className="app-drag flex h-full w-full items-center justify-center">
      <div
        className={`relative overflow-hidden bg-bg-window border-none will-change-auto transform-gpu ${windowClass}`}
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
            onExportCsv={exportCsv}
            onBack={() => switchView('timer')}
          />
        )}
      </div>
    </div>
  )
}
