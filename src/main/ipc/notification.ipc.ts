import { ipcMain, Notification, nativeImage } from 'electron'
import { join } from 'path'

export function registerNotificationIPC(): void {
  ipcMain.handle('notification:show', (_event, title: string, body: string) => {
    try {
      const iconPath = join(process.resourcesPath, 'icon.png')
      const icon = nativeImage.createFromPath(iconPath)

      const notification = new Notification({
        title,
        body,
        icon: icon.isEmpty() ? undefined : icon
      })

      notification.show()

      return true
    } catch (error) {
      console.error('[Notification] Failed to show notification:', error)
      return false
    }
  })
}
