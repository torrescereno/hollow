import { app, ipcMain, shell } from 'electron'
import { validateExternalUrl } from '../utils/urlValidator'

export function registerAppIPC(): void {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('app:get-platform', () => {
    return process.platform
  })

  ipcMain.handle('shell:open-external', async (_event, url: string) => {
    const validation = validateExternalUrl(url)

    if (!validation.isValid) {
      console.warn('Blocked URL:', validation.error)
      return false
    }

    try {
      await shell.openExternal(url)
      return true
    } catch (error) {
      console.error('Failed to open external URL:', error)
      return false
    }
  })
}
