import { ipcMain, type BrowserWindow } from 'electron'
import type Store from 'electron-store'
import type { StoreSchema } from '../index'

export type TimerPhase = 'focus' | 'rest'

export interface BackgroundTimerSyncPayload {
  isRunning: boolean
  timeLeft: number
  timerPhase: TimerPhase
}

interface BackgroundTaskController {
  syncTimer: (payload: BackgroundTimerSyncPayload) => void
}

export function registerWindowIPC(
  getWindow: () => BrowserWindow | null,
  store: Store<StoreSchema>,
  backgroundTaskController: BackgroundTaskController
): void {
  ipcMain.handle('set-always-on-top', (_event, isPinned: boolean) => {
    try {
      const win = getWindow()
      if (win) {
        win.setAlwaysOnTop(isPinned)
        store.set('isPinned', isPinned)
      }
      return isPinned
    } catch (error) {
      console.error('Failed to set always on top:', error)
      return false
    }
  })

  ipcMain.handle('get-pinned-state', () => {
    try {
      return store.get('isPinned', false)
    } catch (error) {
      console.error('Failed to get pinned state:', error)
      return false
    }
  })

  ipcMain.handle('resize-window', async (_event, targetW: number, targetH: number) => {
    try {
      const win = getWindow()
      if (!win) return

      const [startW, startH] = win.getSize()
      const [startX, startY] = win.getPosition()

      if (startW === targetW && startH === targetH) return

      const centerX = startX + startW / 2
      const centerY = startY + startH / 2
      const x = Math.round(centerX - targetW / 2)
      const y = Math.round(centerY - targetH / 2)

      win.setBounds({ x, y, width: targetW, height: targetH })
    } catch (error) {
      console.error('Failed to resize window:', error)
    }
  })

  ipcMain.handle('minimize-window', () => {
    try {
      const win = getWindow()
      if (win) win.minimize()
    } catch (error) {
      console.error('Failed to minimize window:', error)
    }
  })

  ipcMain.handle('close-window', () => {
    try {
      const win = getWindow()
      if (win) win.close()
    } catch (error) {
      console.error('Failed to close window:', error)
    }
  })

  ipcMain.handle('background-task:sync-timer', (_event, payload: BackgroundTimerSyncPayload) => {
    try {
      backgroundTaskController.syncTimer(payload)
    } catch (error) {
      console.error('Failed to sync background timer:', error)
    }
  })
}
