import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
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

  return (
    <div className="tab-content">
      <div className="stats-grid-main">
        <StatCard label="Hoy" value={stats.today.sessions} subtext={`${stats.today.minutes} min`} />
        <StatCard
          label="Esta semana"
          value={stats.week.sessions}
          subtext={`${stats.week.minutes} min`}
        />
        <StatCard
          label="Total"
          value={stats.total.sessions}
          subtext={`${Math.round(stats.total.minutes / 60)}h total`}
        />
      </div>

      <div className="stats-grid-secondary">
        <StatCard label="Racha" value={`${stats.streak} días`} variant="secondary" />
        <StatCard label="Prom / día" value={stats.avgPerDay} variant="secondary" />
        <StatCard label="Más larga" value={`${stats.longestSession}m`} variant="secondary" />
      </div>

      {stats.total.sessions > 0 && (
        <button
          onClick={handleClear}
          className={`app-no-drag btn-clear ${confirmClear ? 'confirm' : ''}`}
        >
          <Trash2 size={12} strokeWidth={1.5} />
          {confirmClear ? 'Clic para confirmar' : 'Borrar datos'}
        </button>
      )}
    </div>
  )
}
