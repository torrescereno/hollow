import { useEffect, useRef } from 'react'
import { activateAudio, preloadSound } from '../utils/audioActivation.utils'
import { SOUND_OPTIONS } from '../schemas'

export function useAudioActivation(): void {
  const hasActivated = useRef(false)

  useEffect(() => {
    if (hasActivated.current) return

    const handleUserInteraction = (): void => {
      if (hasActivated.current) return
      hasActivated.current = true

      activateAudio().then((success) => {
        if (success) {
          document.removeEventListener('click', handleUserInteraction)
          document.removeEventListener('keydown', handleUserInteraction)
          document.removeEventListener('touchstart', handleUserInteraction)

          SOUND_OPTIONS.forEach((sound) => {
            preloadSound(sound.filename)
          })
        }
      })
    }

    document.addEventListener('click', handleUserInteraction, { once: false })
    document.addEventListener('keydown', handleUserInteraction, { once: false })
    document.addEventListener('touchstart', handleUserInteraction, { once: false })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])
}
