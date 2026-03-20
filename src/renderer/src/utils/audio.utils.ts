import { SOUND_OPTIONS } from '../schemas'
import {
  getAudioContext,
  isAudioContextActivated,
  getPreloadedSound
} from './audioActivation.utils'
import type { Locale } from '../../../shared/types'
import { getTranslations } from '../../../shared/i18n'

function getAudioPath(filename: string): string {
  return `./sounds/${filename}`
}

export async function playSoundById(soundId: string): Promise<HTMLAudioElement> {
  const sound = SOUND_OPTIONS.find((s) => s.id === soundId)

  if (!sound) {
    throw new Error(`Sound not found: ${soundId}`)
  }

  const preloadedAudio = getPreloadedSound(sound.filename)
  if (preloadedAudio) {
    preloadedAudio.currentTime = 0
    preloadedAudio.volume = 0.5
    await preloadedAudio.play()
    return preloadedAudio
  }

  const audioPath = getAudioPath(sound.filename)
  const audio = new Audio(audioPath)
  audio.volume = 0.5

  await audio.play()

  return audio
}

export async function playCompletionSound(soundId?: string, locale?: Locale): Promise<void> {
  const id = soundId || 'bell'

  try {
    await playSoundById(id)
  } catch {
    try {
      await playFallbackSound()
    } catch {
      await showSystemNotification(locale)
    }
  }
}

async function playFallbackSound(): Promise<void> {
  try {
    const existingContext = getAudioContext()
    const ctx = isAudioContextActivated() && existingContext ? existingContext : new AudioContext()

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch (error) {
    console.warn('[Audio] Fallback sound failed:', error)
    throw error
  }
}

async function showSystemNotification(locale?: Locale): Promise<void> {
  const t = getTranslations(locale ?? 'en')

  try {
    await window.electronAPI?.notification.show(
      t.notifications.timerTitle,
      t.notifications.timerBody
    )
  } catch (error) {
    console.warn('[Notification] System notification failed:', error)
  }
}
