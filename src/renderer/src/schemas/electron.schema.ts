import type { AppConfig } from './config.schema'
import type { SessionRecord, SessionStats, FullSessionStats } from './session.schema'

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
    getStats: () => Promise<SessionStats>
    getFullStats: () => Promise<FullSessionStats>
    clear: () => Promise<void>
    exportCsv: () => Promise<boolean>
  }
}
