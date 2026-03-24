import type { AppConfig, ElectronAPI } from '../schemas'
import type { SessionRecord, FullSessionStats } from '../schemas/session.schema'

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

  async syncBackgroundTimer(payload: {
    isRunning: boolean
    timeLeft: number
    timerPhase: 'focus' | 'rest'
  }): Promise<void> {
    await this.api?.backgroundTask.syncTimer(payload)
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

  async getFullSessionStats(): Promise<FullSessionStats> {
    return (
      (await this.api?.session.getFullStats()) ?? {
        today: { sessions: 0, minutes: 0 },
        week: { sessions: 0, minutes: 0 },
        total: { sessions: 0, minutes: 0 },
        streak: 0,
        bestStreak: 0,
        avgPerDay: 0,
        longestSession: 0,
        completionRate: 0,
        weeklyActivity: [],
        dailyActivity: []
      }
    )
  }

  async clearSessions(): Promise<void> {
    await this.api?.session.clear()
  }

  async exportSessionsCsv(): Promise<boolean> {
    return (await this.api?.session.exportCsv()) ?? false
  }

  async openExternal(url: string): Promise<boolean> {
    return (await this.api?.openExternal(url)) ?? false
  }

  async getAppVersion(): Promise<string> {
    return (await this.api?.getAppVersion()) ?? '0.0.0'
  }

  async getPlatform(): Promise<string> {
    return (await this.api?.getPlatform()) ?? 'unknown'
  }
}

export const electronService = new ElectronService()
