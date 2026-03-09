import type { AppConfig, ElectronAPI } from '../schemas'
import type { SessionRecord } from '../schemas/session.schema'

class ElectronService {
  private get api(): ElectronAPI | undefined {
    return window.electronAPI
  }

  async setAlwaysOnTop(isPinned: boolean): Promise<boolean> {
    return (await this.api?.setAlwaysOnTop(isPinned)) ?? false
  }

  async getPinnedState(): Promise<boolean> {
    return (await this.api?.getPinnedState()) ?? false
  }

  onPinnedState(callback: (isPinned: boolean) => void): void {
    this.api?.onPinnedState(callback)
  }

  async resizeWindow(width: number, height: number): Promise<void> {
    await this.api?.resizeWindow(width, height)
  }

  async minimizeWindow(): Promise<void> {
    await this.api?.minimizeWindow()
  }

  async closeWindow(): Promise<void> {
    await this.api?.closeWindow()
  }

  async saveConfig(config: AppConfig): Promise<void> {
    await this.api?.saveConfig(config)
  }

  async loadConfig(): Promise<AppConfig | undefined> {
    return await this.api?.loadConfig()
  }

  async logSession(session: SessionRecord): Promise<void> {
    await this.api?.logSession(session)
  }

  async loadSessions(): Promise<SessionRecord[]> {
    return (await this.api?.loadSessions()) ?? []
  }

  async clearSessions(): Promise<void> {
    await this.api?.clearSessions()
  }
}

export const electronService = new ElectronService()
