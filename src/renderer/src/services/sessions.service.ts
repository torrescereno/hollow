import { electronService } from './electron.service'
import type { SessionRecord } from '../schemas'

class SessionsService {
  async load(): Promise<SessionRecord[]> {
    return await electronService.loadSessions()
  }

  async log(session: SessionRecord): Promise<void> {
    await electronService.logSession(session)
  }

  async clear(): Promise<void> {
    await electronService.clearSessions()
  }
}

export const sessionsService = new SessionsService()
