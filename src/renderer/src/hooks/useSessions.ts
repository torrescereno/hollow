import { useState, useEffect } from 'react'
import { sessionsService } from '../services'
import type { SessionRecord } from '../schemas'

interface UseSessionsReturn {
  sessions: SessionRecord[]
  logSession: (session: Omit<SessionRecord, 'id' | 'createdAt'>) => Promise<void>
  clearSessions: () => Promise<void>
  exportCsv: () => Promise<void>
}

interface UseSessionsOptions {
  onSessionLogged?: () => void
}

export function useSessions(options?: UseSessionsOptions): UseSessionsReturn {
  const [sessions, setSessions] = useState<SessionRecord[]>([])

  useEffect(() => {
    sessionsService.load().then((loaded) => {
      if (loaded) setSessions(loaded)
    })
  }, [])

  const logSession = async (session: Omit<SessionRecord, 'id' | 'createdAt'>): Promise<void> => {
    const created = await sessionsService.create(session)
    setSessions((prev) => [...prev, created])
    options?.onSessionLogged?.()
  }

  const clearSessions = async (): Promise<void> => {
    setSessions([])
    await sessionsService.clear()
  }

  const exportCsv = async (): Promise<void> => {
    await sessionsService.exportCsv()
  }

  return { sessions, logSession, clearSessions, exportCsv }
}
