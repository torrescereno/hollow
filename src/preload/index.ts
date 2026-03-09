import { contextBridge, ipcRenderer } from 'electron'

interface Config {
  focusMinutes: number
  autoStart: boolean
  soundEnabled: boolean
}

contextBridge.exposeInMainWorld('electronAPI', {
  setAlwaysOnTop: (isPinned: boolean) => ipcRenderer.invoke('set-always-on-top', isPinned),
  getPinnedState: () => ipcRenderer.invoke('get-pinned-state'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  resizeWindow: (width: number, height: number) =>
    ipcRenderer.invoke('resize-window', width, height),
  saveConfig: (config: Config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  logSession: (session: Record<string, unknown>) => ipcRenderer.invoke('log-session', session),
  loadSessions: () => ipcRenderer.invoke('load-sessions'),
  clearSessions: () => ipcRenderer.invoke('clear-sessions'),
  onPinnedState: (callback: (isPinned: boolean) => void) => {
    ipcRenderer.on('pinned-state', (_event, isPinned: boolean) => callback(isPinned))
  }
})
