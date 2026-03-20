import React, { useMemo, useState, useCallback } from 'react'
import type { DailyActivity } from '../../schemas'
import type { Translations } from '../../../../shared/i18n'
import { useI18n } from '../../providers'
import type { Locale } from '../../../../shared/types'

type HeatmapLevel = 0 | 1 | 2 | 3 | 4

interface HeatmapCell {
  date: string
  sessions: number
  totalMinutes: number
  level: HeatmapLevel
}

interface ActivityHeatmapProps {
  dailyActivity: DailyActivity[]
}

const WEEKS = 24
const CELL = 10
const GAP = 3
const UNIT = CELL + GAP
const LABEL_W = 20
const LABEL_H = 14

const COLORS: Record<HeatmapLevel, string> = {
  0: 'rgb(255 255 255 / 0.04)',
  1: 'rgb(255 255 255 / 0.12)',
  2: 'rgb(255 255 255 / 0.25)',
  3: 'rgb(255 255 255 / 0.45)',
  4: 'rgb(255 255 255 / 0.85)'
}

const LOCALE_MAP: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES'
}

function getDayLabels(t: Translations): [number, string][] {
  return [
    [1, t.heatmap.mon],
    [3, t.heatmap.wed],
    [5, t.heatmap.fri]
  ]
}

function getMonths(t: Translations): string[] {
  return [
    t.heatmap.jan,
    t.heatmap.feb,
    t.heatmap.mar,
    t.heatmap.apr,
    t.heatmap.may,
    t.heatmap.jun,
    t.heatmap.jul,
    t.heatmap.aug,
    t.heatmap.sep,
    t.heatmap.oct,
    t.heatmap.nov,
    t.heatmap.dec
  ]
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatLong(dateStr: string, locale: Locale): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(LOCALE_MAP[locale], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getLevel(sessions: number, max: number): HeatmapLevel {
  if (sessions === 0) return 0
  if (max <= 1) return 4
  const r = sessions / max
  if (r <= 0.25) return 1
  if (r <= 0.5) return 2
  if (r <= 0.75) return 3
  return 4
}

function buildGrid(
  data: DailyActivity[],
  months: string[]
): {
  weeks: HeatmapCell[][]
  monthLabels: { label: string; col: number }[]
} {
  const lookup = new Map(data.map((d) => [d.date, d]))
  const max = data.reduce((m, d) => Math.max(m, d.sessions), 0)

  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const start = new Date(today)
  start.setDate(start.getDate() - (WEEKS * 7 + today.getDay()))
  start.setHours(12, 0, 0, 0)

  const weeks: HeatmapCell[][] = []
  const monthLabels: { label: string; col: number }[] = []
  let week: HeatmapCell[] = []
  let prevMonth = -1

  const cursor = new Date(start)
  while (cursor <= today) {
    const dateStr = toDateStr(cursor)
    const entry = lookup.get(dateStr)
    const s = entry?.sessions ?? 0

    week.push({
      date: dateStr,
      sessions: s,
      totalMinutes: entry?.totalMinutes ?? 0,
      level: getLevel(s, max)
    })

    if (cursor.getDay() === 0) {
      const month = cursor.getMonth()
      if (month !== prevMonth) {
        monthLabels.push({ label: months[month], col: weeks.length })
        prevMonth = month
      }
    }

    if (week.length === 7) {
      weeks.push(week)
      week = []
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  if (week.length > 0) weeks.push(week)

  const filtered: { label: string; col: number }[] = []
  for (const ml of monthLabels) {
    const last = filtered[filtered.length - 1]
    if (!last || (ml.col - last.col) * UNIT >= 28) {
      filtered.push(ml)
    }
  }

  return { weeks, monthLabels: filtered }
}

export function ActivityHeatmap({ dailyActivity }: ActivityHeatmapProps): React.JSX.Element {
  const { t, locale } = useI18n()

  const dayLabels = useMemo(() => getDayLabels(t), [t])
  const months = useMemo(() => getMonths(t), [t])

  const [tooltip, setTooltip] = useState<{
    cell: HeatmapCell
    x: number
    y: number
  } | null>(null)

  const { weeks, monthLabels } = useMemo(
    () => buildGrid(dailyActivity ?? [], months),
    [dailyActivity, months]
  )

  const handleEnter = useCallback((e: React.MouseEvent, cell: HeatmapCell) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({ cell, x: r.left + r.width / 2, y: r.top - 8 })
  }, [])

  const handleLeave = useCallback(() => setTooltip(null), [])

  return (
    <div className="bg-white/8 rounded-xl p-5 border border-white/10">
      <span className="text-xs text-white/40 uppercase tracking-wider block mb-3">
        {t.heatmap.activity}
      </span>

      {/* Month labels */}
      <div className="relative" style={{ height: LABEL_H, marginLeft: LABEL_W }}>
        {monthLabels.map((ml, i) => (
          <span
            key={i}
            className="text-[10px] text-white/25 absolute"
            style={{ left: ml.col * UNIT }}
          >
            {ml.label}
          </span>
        ))}
      </div>

      {/* Day labels + grid */}
      <div className="flex">
        <div className="shrink-0 flex flex-col" style={{ width: LABEL_W, gap: GAP }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className="text-[10px] text-white/25 flex items-center"
              style={{ height: CELL }}
            >
              {dayLabels.find(([idx]) => idx === i)?.[1] ?? ''}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(7, ${CELL}px)`,
            gridAutoFlow: 'column',
            gridAutoColumns: `${CELL}px`,
            gap: GAP
          }}
        >
          {weeks.flatMap((w) =>
            w.map((cell) => (
              <div
                key={cell.date}
                onMouseEnter={(e) => handleEnter(e, cell)}
                onMouseLeave={handleLeave}
                className="rounded-sm hover:outline hover:outline-1 hover:outline-white/50 hover:-outline-offset-1"
                style={{ background: COLORS[cell.level] }}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-white/25">{t.heatmap.less}</span>
        {([0, 1, 2, 3, 4] as HeatmapLevel[]).map((level) => (
          <div
            key={level}
            className="rounded-sm"
            style={{ width: 8, height: 8, background: COLORS[level] }}
          />
        ))}
        <span className="text-[10px] text-white/25">{t.heatmap.more}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md border border-white/10 pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgb(30 30 30 / 0.95)'
          }}
        >
          <div className="text-xs text-white/80 font-medium">
            {tooltip.cell.sessions === 0
              ? t.heatmap.noSessions
              : `${tooltip.cell.sessions} ${tooltip.cell.sessions === 1 ? t.heatmap.session : t.heatmap.sessions}`}
          </div>
          <div className="text-[10px] text-white/40 capitalize">
            {formatLong(tooltip.cell.date, locale)}
          </div>
        </div>
      )}
    </div>
  )
}
