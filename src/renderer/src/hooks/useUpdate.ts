import { useState, useEffect, useCallback } from 'react'
import type { UpdateInfo } from '../schemas/electron.schema'

export function useUpdate(): {
  updateInfo: UpdateInfo | null
  checkForUpdates: () => Promise<void>
  restartNow: () => Promise<void>
  snoozeUpdate: () => Promise<void>
  dismissUpdate: () => void
} {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)

  useEffect(() => {
    if (!window.electronAPI?.update) return

    const unsubscribe = window.electronAPI.update.onStatus((status: UpdateInfo) => {
      setUpdateInfo(status)
    })

    window.electronAPI.update.getStatus().then((status) => {
      if (status.available) {
        setUpdateInfo(status)
      }
    })

    return unsubscribe
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
    setUpdateInfo(null)
    await window.electronAPI.update.snooze()
  }, [])

  const dismissUpdate = useCallback((): void => {
    setUpdateInfo(null)
  }, [])

  return {
    updateInfo,
    checkForUpdates,
    restartNow,
    snoozeUpdate,
    dismissUpdate
  }
}
