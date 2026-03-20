import { Download, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { ActivityHeatmap, Button, StatCard } from '../../components'
import type { Stats } from '../../schemas'
import { useI18n } from '../../providers'

interface StatsSectionProps {
  stats: Stats
  onClear: () => void
  onExportCsv: () => void
}

export function StatsSection({
  stats,
  onClear,
  onExportCsv
}: StatsSectionProps): React.JSX.Element {
  const { t, interpolate } = useI18n()
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

    if (stats.bestStreak === 0) return t.motivational.startFirst
    if (stats.streak === 0)
      return interpolate(t.motivational.getBack, { best: stats.bestStreak })
    if (daysLeft <= 0) return t.motivational.bestStreak
    if (stats.streak <= 3)
      return interpolate(t.motivational.goodStart, { left: daysLeft })
    return interpolate(t.motivational.onStreak, { left: daysLeft })
  }

  return (
    <div className="app-no-drag flex flex-1 flex-col gap-5 overflow-y-auto pr-3">
      <div className="streak-card bg-white/8 rounded-xl p-5 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              {t.stats.currentStreak}
            </span>
            <span className="text-sm text-white/60">{getMotivationalMessage()}</span>
          </div>
          <span className="text-4xl font-extralight text-white tabular-nums">{stats.streak}</span>
        </div>

        <div className="flex gap-2">
          {stats.weeklyActivity.map((d, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors
                ${
                  d.active
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'bg-white/5 text-white/25'
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

      <ActivityHeatmap dailyActivity={stats.dailyActivity} />

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t.stats.today}
          value={stats.today?.sessions || 0}
          subtext={`${stats.today?.minutes || 0} min`}
        />
        <StatCard
          label={t.stats.thisWeek}
          value={stats.week?.sessions || 0}
          subtext={`${stats.week?.minutes || 0} min`}
        />
        <StatCard
          label={t.stats.total}
          value={stats.total?.sessions || 0}
          subtext={`${Math.round((stats.total?.minutes || 0) / 60)}h ${t.stats.totalHours}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t.stats.streak}
          value={`${stats.streak || 0} ${t.stats.days}`}
          variant="secondary"
        />
        <StatCard label={t.stats.avgPerDay} value={stats.avgPerDay || 0} variant="secondary" />
        <StatCard
          label={t.stats.longest}
          value={`${stats.longestSession || 0}m`}
          variant="secondary"
        />
      </div>

      {(stats.total?.sessions || 0) > 0 && (
        <div className="flex items-center gap-4 mt-4">
          <Button variant="export" onClick={onExportCsv}>
            <Download size={12} strokeWidth={1.5} />
            {t.stats.exportCsv}
          </Button>
          <Button
            variant="clear"
            onClick={handleClear}
            className={confirmClear ? 'text-red-400/75' : ''}
          >
            <Trash2 size={12} strokeWidth={1.5} />
            {confirmClear ? t.stats.confirmClear : t.stats.clearData}
          </Button>
        </div>
      )}
    </div>
  )
}
