import React, { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import {
  useConfig,
  usePinned,
  useSessions,
  useStats,
  useTimer,
  useViewTransition,
  useUpdate
} from './hooks'
import type { MenuTab } from './schemas'
import { MenuView, TimerView } from './sections'
import { TIMER_SIZE, MENU_SIZE } from './constants'
import { UpdateNotification } from './components'

export default function App(): React.JSX.Element {
  const [menuTab, setMenuTab] = useState<MenuTab>('stats')

  const { view, switchView, transitionPhase, onExitComplete } = useViewTransition()
  const { isPinned, togglePin } = usePinned()
  const { config, updateConfig, configRef } = useConfig()
  const { stats, refresh: refreshStats } = useStats()
  const { logSession, clearSessions, exportCsv } = useSessions({ onSessionLogged: refreshStats })

  const { timeLeft, isRunning, timerPhase, toggleTimer, resetTimer, skipRest, setTimeLeft } =
    useTimer(config.focusMinutes, config.restMinutes, configRef, logSession)

  const { updateInfo, checkForUpdates, restartNow, snoozeUpdate, dismissUpdate } = useUpdate()

  const size = view === 'menu' ? MENU_SIZE : TIMER_SIZE
  const borderRadius = view === 'menu' ? 'rounded-[2rem]' : 'rounded-[1.5rem]'

  return (
    <div className="app-drag flex h-full w-full items-center justify-center">
      <div
        style={{ width: size.w, height: size.h }}
        className={`window-container relative overflow-hidden bg-bg-window border-none ${borderRadius}`}
      >
        <UpdateNotification
          updateInfo={updateInfo}
          onRestart={restartNow}
          onSnooze={snoozeUpdate}
          onDismiss={dismissUpdate}
        />
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {view === 'timer' && transitionPhase !== 'exiting' ? (
            <TimerView
              key="timer"
              timeLeft={timeLeft}
              isRunning={isRunning}
              isPinned={isPinned}
              timerPhase={timerPhase}
              confettiEnabled={config.confettiEnabled}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onSkipRest={skipRest}
              onTogglePin={togglePin}
              onOpenMenu={() => switchView('menu')}
            />
          ) : null}

          {view === 'menu' && transitionPhase !== 'exiting' ? (
            <MenuView
              key="menu"
              menuTab={menuTab}
              stats={stats}
              config={config}
              isRunning={isRunning}
              onMenuTabChange={setMenuTab}
              onUpdateConfig={updateConfig}
              onTimeReset={(val) => setTimeLeft(val * 60)}
              onClearSessions={clearSessions}
              onExportCsv={exportCsv}
              onCheckUpdate={checkForUpdates}
              updateInfo={updateInfo}
              onBack={() => switchView('timer')}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
