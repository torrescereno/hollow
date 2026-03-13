import { useState, useEffect, useCallback } from 'react'
import type { UpdateStatus, UpdatePriority } from '../schemas/electron.schema'

export interface UpdateInfo {
  available: boolean
  version?: string
  priority?: UpdatePriority
  message?: string
  progress?: number
}

export function useUpdate(): {
  updateInfo: UpdateInfo | null
  checkForUpdates: () => Promise<void>
  restartNow: () => Promise<void>
  snoozeUpdate: () => Promise<void>
} {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)

  useEffect(() => {
    if (!window.electronAPI?.update) return

    const handleStatus = (status: UpdateStatus): void => {
      setUpdateInfo(status)
    }

    window.electronAPI.update.onStatus(handleStatus)

    window.electronAPI.update.getStatus().then((status) => {
      if (status.hasCriticalUpdate || status.priority !== 'normal') {
        setUpdateInfo({
          available: true,
          priority: status.priority,
          version: undefined
        })
      }
    })

    return () => {
      // IPC listeners cleanup is handled by the main process
    }
  }, [])

  const checkForUpdates = useCallback(async (): Promise<void> => {
    if (!window.electronAPI?.update) return
    await window.electronAPI.update.check()
  }, [])

  const restartNow = useCallback(async (): Promise<void> => {
    if (!window.electronAPI?.update) return
    await window.electronAPI.update.restart()
  }, [])

  const snoozeUpdate = useCallback(async (): Promise<void> => {
    if (!window.electronAPI?.update) return
    await window.electronAPI.update.snooze()
  }, [])

  return {
    updateInfo,
    checkForUpdates,
    restartNow,
    snoozeUpdate
  }
}
