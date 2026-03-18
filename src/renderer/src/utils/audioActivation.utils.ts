let audioContext: AudioContext | null = null
let isAudioActivated = false
const preloadedSounds: Map<string, HTMLAudioElement> = new Map()

export function getAudioContext(): AudioContext | null {
  return audioContext
}

export function isAudioContextActivated(): boolean {
  return isAudioActivated
}

export async function activateAudio(): Promise<boolean> {
  if (isAudioActivated && audioContext) {
    return true
  }

  try {
    if (!audioContext) {
      audioContext = new AudioContext()
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    isAudioActivated = true
    return true
  } catch (error) {
    console.warn('[Audio] Failed to activate audio context:', error)
    return false
  }
}

export function preloadSound(filename: string): void {
  if (preloadedSounds.has(filename)) {
    return
  }

  try {
    const audio = new Audio(`./sounds/${filename}`)
    audio.preload = 'auto'
    audio.load()
    preloadedSounds.set(filename, audio)
  } catch (error) {
    console.warn(`[Audio] Failed to preload sound ${filename}:`, error)
  }
}

export function getPreloadedSound(filename: string): HTMLAudioElement | null {
  return preloadedSounds.get(filename) || null
}

export function resetAudioActivation(): void {
  if (audioContext) {
    audioContext.close().catch(() => {})
    audioContext = null
  }
  isAudioActivated = false
  preloadedSounds.clear()
}
