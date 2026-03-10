import type { AppConfig, ElectronAPI } from '../schemas'
import type { SessionRecord, SessionStats, FullSessionStats } from '../schemas/session.schema'

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

  async createSession(session: Omit<SessionRecord, 'id' | 'createdAt'>): Promise<SessionRecord> {
    return (await this.api?.session.create(session as SessionRecord)) ?? ({} as SessionRecord)
  }

  async loadSessions(): Promise<SessionRecord[]> {
    return (await this.api?.session.getAll()) ?? []
  }

  async getSessionStats(): Promise<SessionStats> {
    return (
      (await this.api?.session.getStats()) ?? {
        today: { count: 0, totalMinutes: 0 },
        week: { count: 0, totalMinutes: 0 },
        total: { count: 0, totalMinutes: 0 }
      }
    )
  }

  async getFullSessionStats(): Promise<FullSessionStats> {
    return (
      (await this.api?.session.getFullStats()) ?? {
        today: { count: 0, totalMinutes: 0 },
        week: { count: 0, totalMinutes: 0 },
        total: { count: 0, totalMinutes: 0 },
        streak: 0,
        bestStreak: 0,
        avgPerDay: 0,
        longestSession: 0,
        completionRate: 0,
        weeklyActivity: []
      }
    )
  }

  async clearSessions(): Promise<void> {
    await this.api?.session.clear()
  }

  async exportSessionsCsv(): Promise<boolean> {
    return (await this.api?.session.exportCsv()) ?? false
  }
}

export const electronService = new ElectronService()
