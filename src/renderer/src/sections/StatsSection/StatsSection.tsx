import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { StatCard } from '../../components'
import type { Stats } from '../../schemas'

interface StatsSectionProps {
  stats: Stats
  onClear: () => void
}

export function StatsSection({ stats, onClear }: StatsSectionProps): React.JSX.Element {
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = (): void => {
    if (confirmClear) {
      onClear()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const getMotivationalMessage = (): string => {
    const daysLeft = stats.bestStreak - stats.streak

    if (stats.bestStreak === 0) return '¡Comienza tu primera racha hoy!'
    if (stats.streak === 0) return `¡Vuelve al ritmo! Récord: ${stats.bestStreak} días`
    if (daysLeft <= 0) return '¡Estás en tu mejor racha histórica!'
    if (stats.streak <= 3) return `¡Buen comienzo! A ${daysLeft} días de tu récord`
    return `¡Vas en racha! A ${daysLeft} días de tu récord`
  }

  return (
    <div className="app-no-drag flex flex-1 flex-col gap-5 overflow-y-auto pr-3">
      <div className="streak-card bg-white/5 rounded-xl p-5 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">Racha Actual</span>
            <span className="text-sm text-white/60">{getMotivationalMessage()}</span>
          </div>
          <span className="text-4xl font-extralight text-white tabular-nums">{stats.streak}</span>
        </div>

        <div className="flex gap-2">
          {stats.weeklyActivity.map((d, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                d.active
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-white/20'
              } ${d.isToday ? 'relative' : ''}`}
            >
              {d.day}
              {d.isToday && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Hoy"
          value={stats.today?.sessions || 0}
          subtext={`${stats.today?.minutes || 0} min`}
        />
        <StatCard
          label="Esta semana"
          value={stats.week?.sessions || 0}
          subtext={`${stats.week?.minutes || 0} min`}
        />
        <StatCard
          label="Total"
          value={stats.total?.sessions || 0}
          subtext={`${Math.round((stats.total?.minutes || 0) / 60)}h total`}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Racha" value={`${stats.streak || 0} días`} variant="secondary" />
        <StatCard label="Prom / día" value={stats.avgPerDay || 0} variant="secondary" />
        <StatCard label="Más larga" value={`${stats.longestSession || 0}m`} variant="secondary" />
      </div>

      {(stats.total?.sessions || 0) > 0 && (
        <button
          onClick={handleClear}
          className={`app-no-drag flex items-center gap-2 text-[0.6875rem] transition-colors duration-200 mt-4 ${
            confirmClear ? 'text-red-400/70' : 'text-white/15 hover:text-red-400/50'
          }`}
        >
          <Trash2 size={12} strokeWidth={1.5} />
          {confirmClear ? 'Clic para confirmar' : 'Borrar datos'}
        </button>
      )}
    </div>
  )
}
