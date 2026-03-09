import { useState, useEffect, useRef } from 'react'
import { windowService } from '../services'

interface UsePinnedReturn {
  isPinned: boolean
  togglePin: () => Promise<void>
}

export function usePinned(): UsePinnedReturn {
  const [isPinned, setIsPinned] = useState(false)
  const isTransitioning = useRef(false)

  useEffect(() => {
    windowService.getPinnedState().then(setIsPinned)
    windowService.onPinnedState(setIsPinned)
  }, [])

  const togglePin = async (): Promise<void> => {
    if (isTransitioning.current) return
    isTransitioning.current = true

    const newPinned = !isPinned
    setIsPinned(newPinned)
    await windowService.setAlwaysOnTop(newPinned)

    isTransitioning.current = false
  }

  return { isPinned, togglePin }
}
