import { useState, useEffect } from 'react'
import { windowService } from '../services'

interface UsePinnedReturn {
  isPinned: boolean
  togglePin: () => Promise<void>
}

export function usePinned(): UsePinnedReturn {
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    windowService.getPinnedState().then(setIsPinned)
    windowService.onPinnedState(setIsPinned)
  }, [])

  const togglePin = async (): Promise<void> => {
    const newPinned = !isPinned
    await windowService.setAlwaysOnTop(newPinned)
    setIsPinned(newPinned)
  }

  return {
    isPinned,
    togglePin
  }
}
