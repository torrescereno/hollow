import { SOUND_OPTIONS } from '../schemas'

function getAudioPath(filename: string): string {
  return `./sounds/${filename}`
}

export async function playSoundById(soundId: string): Promise<HTMLAudioElement> {
  const sound = SOUND_OPTIONS.find((s) => s.id === soundId)

  if (!sound) {
    throw new Error(`Sound not found: ${soundId}`)
  }

  const audioPath = getAudioPath(sound.filename)
  const audio = new Audio(audioPath)
  audio.volume = 0.5

  await audio.play()

  return audio
}

export function playCompletionSound(soundId?: string): void {
  const id = soundId || 'bell'

  playSoundById(id).catch(() => {
    playFallbackSound()
  })
}

function playFallbackSound(): void {
  try {
    const ctx = new AudioContext()
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
  } catch {
    // Audio not available
  }
}
