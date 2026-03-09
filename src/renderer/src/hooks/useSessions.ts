import { useState, useEffect } from 'react'
import { sessionsService } from '../services'
import type { SessionRecord } from '../schemas'

interface UseSessionsReturn {
  sessions: SessionRecord[]
  logSession: (session: SessionRecord) => Promise<void>
  clearSessions: () => Promise<void>
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<SessionRecord[]>([])

  useEffect(() => {
    sessionsService.load().then((loaded) => {
      if (loaded) setSessions(loaded)
    })
  }, [])

  const logSession = async (session: SessionRecord): Promise<void> => {
    setSessions((prev) => [...prev, session])
    await sessionsService.log(session)
  }

  const clearSessions = async (): Promise<void> => {
    setSessions([])
    await sessionsService.clear()
  }

  return { sessions, logSession, clearSessions }
}
