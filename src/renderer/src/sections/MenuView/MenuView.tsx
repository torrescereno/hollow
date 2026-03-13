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
  onExportCsv: () => void
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
  onExportCsv,
  onBack
}: MenuViewProps): React.JSX.Element {
  const menuItems = [
    { key: 'stats' as const, label: 'Estadísticas', Icon: BarChart2 },
    { key: 'config' as const, label: 'Configuración', Icon: Settings }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      className="absolute inset-0 flex bg-bg-window transform-gpu backface-hidden"
    >
      <aside className="app-drag w-56 shrink-0 border-r border-white/5 bg-bg-window p-6 flex flex-col">
        <BackButton onClick={onBack} />
        <MenuNav activeTab={menuTab} onTabChange={onMenuTabChange} items={menuItems} />
      </aside>

      <section className="flex-1 p-10 bg-bg-window overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={menuTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <header>
              <h1 className="text-2xl font-light tracking-[-0.025em] text-text-main mb-1">
                {menuTab === 'stats' ? 'Estadísticas' : 'Configuración'}
              </h1>
              <p className="text-xs text-white/25 tracking-[0.025em] mb-6">
                {menuTab === 'stats'
                  ? 'Tu historial de sesiones de enfoque'
                  : 'Ajusta tus preferencias de temporizador'}
              </p>
            </header>

            {menuTab === 'stats' ? (
              <StatsSection stats={stats} onClear={onClearSessions} onExportCsv={onExportCsv} />
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
      </section>
    </motion.div>
  )
}
