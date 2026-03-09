import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BarChart2, Settings } from 'lucide-react'
import { BackButton, MenuNav } from '../../components'
import { StatsSection } from '../StatsSection'
import { ConfigSection } from '../ConfigSection'
import type { Stats, AppConfig, MenuTab } from '../../schemas'

interface MenuViewProps {
  menuTab: MenuTab
  stats: Stats
  config: AppConfig
  isRunning: boolean
  onMenuTabChange: (tab: MenuTab) => void
  onUpdateConfig: (partial: Partial<AppConfig>) => void
  onTimeReset: (minutes: number) => void
  onClearSessions: () => void
  onBack: () => void
}

export function MenuView({
  menuTab,
  stats,
  config,
  isRunning,
  onMenuTabChange,
  onUpdateConfig,
  onTimeReset,
  onClearSessions,
  onBack
}: MenuViewProps): React.JSX.Element {
  const menuItems = [
    { key: 'stats' as const, label: 'Estadisticas', Icon: BarChart2 },
    { key: 'config' as const, label: 'Configuracion', Icon: Settings }
  ]

  return (
    <div className="absolute inset-0 flex bg-bg-window transform-gpu backface-hidden">
      <div className="app-drag w-56 shrink-0 border-r border-white/5 bg-bg-window p-6 flex flex-col">
        <BackButton onClick={onBack} />
        <MenuNav activeTab={menuTab} onTabChange={onMenuTabChange} items={menuItems} />
      </div>

      <div className="flex-1 p-10 bg-bg-window overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={menuTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            <h2 className="text-2xl font-light tracking-[-0.025em] text-text-main mb-1">
              {menuTab === 'stats' ? 'Estadisticas' : 'Configuracion'}
            </h2>
            <p className="text-xs text-white/25 tracking-[0.025em] mb-6">
              {menuTab === 'stats'
                ? 'Tu historial de sesiones de enfoque'
                : 'Ajusta tus preferencias de temporizador'}
            </p>

            {menuTab === 'stats' ? (
              <StatsSection stats={stats} onClear={onClearSessions} />
            ) : (
              <ConfigSection
                config={config}
                isRunning={isRunning}
                onUpdate={onUpdateConfig}
                onTimeReset={onTimeReset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
