interface ElectronAPI {
  setAlwaysOnTop: (isPinned: boolean) => Promise<boolean>
  getPinnedState: () => Promise<boolean>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  resizeWindow: (width: number, height: number) => Promise<void>
  saveConfig: (config: {
    focusMinutes: number
    autoStart: boolean
    soundEnabled: boolean
  }) => Promise<void>
  loadConfig: () => Promise<{
    focusMinutes: number
    autoStart: boolean
    soundEnabled: boolean
  }>
  logSession: (session: Record<string, unknown>) => Promise<void>
  loadSessions: () => Promise<Record<string, unknown>[]>
  clearSessions: () => Promise<void>
  onPinnedState: (callback: (isPinned: boolean) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
