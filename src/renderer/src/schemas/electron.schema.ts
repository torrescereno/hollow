import type { AppConfig } from './config.schema'
import type { SessionRecord, FullSessionStats } from './session.schema'

export type UpdatePriority = 'normal' | 'security' | 'critical'

export interface UpdateStatus {
  available: boolean
  version?: string
  priority?: UpdatePriority
  message?: string
  progress?: number
}

export interface ElectronAPI {
  setAlwaysOnTop: (isPinned: boolean) => Promise<boolean>
  getPinnedState: () => Promise<boolean>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  resizeWindow: (width: number, height: number) => Promise<void>
  saveConfig: (config: AppConfig) => Promise<void>
  loadConfig: () => Promise<AppConfig>
  onPinnedState: (callback: (isPinned: boolean) => void) => void
  session: {
    create: (data: Omit<SessionRecord, 'id' | 'createdAt'>) => Promise<SessionRecord>
    getAll: () => Promise<SessionRecord[]>
    getFullStats: () => Promise<FullSessionStats>
    clear: () => Promise<void>
    exportCsv: () => Promise<boolean>
  }
  openExternal: (url: string) => Promise<boolean>
  getAppVersion: () => Promise<string>
  update: {
    check: () => Promise<boolean>
    getStatus: () => Promise<{
      priority: UpdatePriority
      hasCriticalUpdate: boolean
      criticalDownloaded: boolean
    }>
    restart: () => Promise<boolean>
    snooze: () => Promise<boolean>
    onStatus: (callback: (status: UpdateStatus) => void) => void
  }
}
