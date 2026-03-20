import { ipcMain, dialog, BrowserWindow, Notification, nativeImage } from 'electron'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { sessionRepository, streakRepository } from '../../database/repositories'
import { statsService } from '../../database/services/stats.service'
import type { NewSession } from '../../database/schema'
import { getMainTranslations, interpolate } from '../i18n'

export function registerSessionIPC(): void {
  ipcMain.handle('session:create', (_event, data: NewSession) => {
    try {
      const normalizedData = {
        ...data,
        startTime: typeof data.startTime === 'number' ? new Date(data.startTime) : data.startTime,
        endTime: data.endTime
          ? typeof data.endTime === 'number'
            ? new Date(data.endTime)
            : data.endTime
          : null
      }

      const session = sessionRepository.create(normalizedData)

      if (session.completed) {
        statsService.updateStreakOnSessionComplete(session.startTime)
      }

      return session
    } catch (error) {
      console.error('Failed to create session:', error)
      throw error
    }
  })

  ipcMain.handle('session:get-all', () => {
    try {
      return sessionRepository.findAll()
    } catch (error) {
      console.error('Failed to get all sessions:', error)
      return []
    }
  })

  ipcMain.handle('session:get-full-stats', () => {
    try {
      return statsService.getFullStats()
    } catch (error) {
      console.error('Failed to get full stats:', error)
      return {
        today: { sessions: 0, minutes: 0 },
        week: { sessions: 0, minutes: 0 },
        total: { sessions: 0, minutes: 0 },
        streak: 0,
        bestStreak: 0,
        avgPerDay: 0,
        longestSession: 0,
        completionRate: 0,
        weeklyActivity: [],
        dailyActivity: []
      }
    }
  })

  ipcMain.handle('session:get-streak', () => {
    try {
      return streakRepository.getOrCreate()
    } catch (error) {
      console.error('Failed to get streak:', error)
      return { id: 1, currentStreak: 0, bestStreak: 0, lastSessionDate: null }
    }
  })

  ipcMain.handle('session:clear', () => {
    try {
      sessionRepository.clear()
      streakRepository.reset()
      return true
    } catch (error) {
      console.error('Failed to clear sessions:', error)
      return false
    }
  })

  ipcMain.handle('session:export-csv', async () => {
    try {
      const win = BrowserWindow.getFocusedWindow()
      if (!win) return false

      const { canceled, filePath } = await dialog.showSaveDialog(win, {
        defaultPath: `hollow-sessions-${new Date().toISOString().split('T')[0]}.csv`,
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      })

      if (canceled || !filePath) return false

      const formatDate = (value: Date | number | null | undefined): string => {
        if (!value) return ''
        const d = value instanceof Date ? value : new Date(value)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `${day}-${month}-${year} ${hours}:${minutes}`
      }

      const allSessions = sessionRepository.findAll()
      const header = 'id,start_time,end_time,duration_seconds,focus_minutes,created_at'
      const rows = allSessions.map((s) => {
        return `${s.id},${formatDate(s.startTime)},${formatDate(s.endTime)},${s.durationSeconds},${s.focusMinutes},${formatDate(s.createdAt)}`
      })

      const csv = [header, ...rows].join('\n')
      await writeFile(filePath, csv, 'utf-8')

      const icon = nativeImage.createFromPath(join(process.resourcesPath, 'icon.png'))

      const t = getMainTranslations()

      new Notification({
        title: t.notifications.exportTitle,
        body: interpolate(t.notifications.exportBody, { count: allSessions.length }),
        icon
      }).show()

      return true
    } catch (error) {
      console.error('Failed to export CSV:', error)
      return false
    }
  })
}
