import { useMemo } from 'react'
import type { SessionRecord } from '../schemas'
import type { Stats } from '../schemas/stats.schema'
import { computeStats } from '../utils'

export function useStats(sessions: SessionRecord[]): Stats {
  return useMemo(() => computeStats(sessions), [sessions])
}
