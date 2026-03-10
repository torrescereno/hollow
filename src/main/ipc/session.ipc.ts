import { ipcMain, dialog, BrowserWindow, Notification } from 'electron'
import { writeFile } from 'fs/promises'
import { sessionRepository, streakRepository } from '../../database/repositories'
import { statsService } from '../../database/services/stats.service'
import type { NewSession } from '../../database/schema'

export function registerSessionIPC(): void {
  ipcMain.handle('session:create', (_event, data: NewSession) => {
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
  })

  ipcMain.handle('session:get-all', () => {
    return sessionRepository.findAll()
  })

  ipcMain.handle('session:get-stats', () => {
    const today = sessionRepository.getTodayStats()
    const week = sessionRepository.getWeekStats()
    const total = sessionRepository.getTotalStats()

    return { today, week, total }
  })

  ipcMain.handle('session:get-full-stats', () => {
    return statsService.getFullStats()
  })

  ipcMain.handle('session:get-streak', () => {
    return streakRepository.getOrCreate()
  })

  ipcMain.handle('session:clear', () => {
    sessionRepository.clear()
    streakRepository.reset()
    return true
  })

  ipcMain.handle('session:export-csv', async () => {
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

    new Notification({
      title: 'Exportación completada',
      body: `Se exportaron ${allSessions.length} sesiones a CSV`
    }).show()

    return true
  })
}
