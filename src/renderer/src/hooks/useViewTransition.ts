import { useState, useRef, useCallback } from 'react'
import { windowService } from '../services'
import { TIMER_SIZE, MENU_SIZE } from '../constants'
import type { View } from '../schemas'

type TransitionPhase = 'idle' | 'exiting' | 'entering'

interface UseViewTransitionReturn {
  view: View
  switchView: (target: View) => Promise<void>
  transitionPhase: TransitionPhase
  onExitComplete: () => void
}

const SAFETY_TIMEOUT = 500

export function useViewTransition(): UseViewTransitionReturn {
  const [view, setView] = useState<View>('timer')
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')
  const isTransitioning = useRef(false)
  const exitResolveRef = useRef<(() => void) | null>(null)

  const onExitComplete = useCallback(() => {
    exitResolveRef.current?.()
    exitResolveRef.current = null
  }, [])

  const waitForExit = useCallback((): Promise<void> => {
    return Promise.race([
      new Promise<void>((resolve) => {
        exitResolveRef.current = resolve
      }),
      new Promise<void>((resolve) => {
        setTimeout(resolve, SAFETY_TIMEOUT)
      })
    ])
  }, [])

  const switchView = useCallback(
    async (target: View): Promise<void> => {
      if (isTransitioning.current) return
      isTransitioning.current = true

      const size = target === 'menu' ? MENU_SIZE : TIMER_SIZE

      // Phase 1: fade out current view
      setTransitionPhase('exiting')
      await waitForExit()

      // Phase 2: snap resize (content is invisible)
      await windowService.resize(size.w, size.h)

      // Phase 3: switch view and fade in
      setView(target)
      setTransitionPhase('entering')

      // Wait for enter animation to finish before unlocking
      await new Promise<void>((resolve) => setTimeout(resolve, 180))
      setTransitionPhase('idle')
      isTransitioning.current = false
    },
    [waitForExit]
  )

  return { view, switchView, transitionPhase, onExitComplete }
}
