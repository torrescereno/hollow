import type { AppConfig } from './config.schema'
import type { SessionRecord } from './session.schema'

export interface ElectronAPI {
  setAlwaysOnTop: (isPinned: boolean) => Promise<boolean>
  getPinnedState: () => Promise<boolean>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  resizeWindow: (width: number, height: number) => Promise<void>
  saveConfig: (config: AppConfig) => Promise<void>
  loadConfig: () => Promise<AppConfig>
  logSession: (session: SessionRecord) => Promise<void>
  loadSessions: () => Promise<SessionRecord[]>
  clearSessions: () => Promise<void>
  onPinnedState: (callback: (isPinned: boolean) => void) => void
}
