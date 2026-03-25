import { ipcMain } from 'electron'
import {
  checkForUpdates,
  getUpdateStatus,
  forceRestart,
  snoozeCriticalRestart,
  runBrewUpgrade
} from '../autoUpdater'

export function registerUpdateIPC(): void {
  ipcMain.handle('update:check', () => {
    checkForUpdates()
    return true
  })

  ipcMain.handle('update:get-status', () => {
    return getUpdateStatus()
  })

  ipcMain.handle('update:restart', () => {
    forceRestart()
    return true
  })

  ipcMain.handle('update:snooze', () => {
    snoozeCriticalRestart()
    return true
  })

  ipcMain.handle('update:brew-upgrade', () => {
    runBrewUpgrade()
    return true
  })
}
