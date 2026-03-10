import { electronService } from './electron.service'
import type { SessionRecord, SessionStats, FullSessionStats } from '../schemas'

class SessionsService {
  async load(): Promise<SessionRecord[]> {
    return await electronService.loadSessions()
  }

  async create(session: Omit<SessionRecord, 'id' | 'createdAt'>): Promise<SessionRecord> {
    return await electronService.createSession(session)
  }

  async getStats(): Promise<SessionStats> {
    return await electronService.getSessionStats()
  }

  async getFullStats(): Promise<FullSessionStats> {
    return await electronService.getFullSessionStats()
  }

  async clear(): Promise<void> {
    await electronService.clearSessions()
  }

  async exportCsv(): Promise<boolean> {
    return await electronService.exportSessionsCsv()
  }
}

export const sessionsService = new SessionsService()
