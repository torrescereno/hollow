import { contextBridge, ipcRenderer } from 'electron'
import type { NewSession, Session, FullSessionStats } from '../database/schema'
import type { AppConfig, UpdateInfo } from '../shared/types'

contextBridge.exposeInMainWorld('electronAPI', {
  setAlwaysOnTop: (isPinned: boolean) => ipcRenderer.invoke('set-always-on-top', isPinned),
  getPinnedState: () => ipcRenderer.invoke('get-pinned-state'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  resizeWindow: (width: number, height: number) =>
    ipcRenderer.invoke('resize-window', width, height),
  saveConfig: (config: AppConfig) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  onPinnedState: (callback: (isPinned: boolean) => void) => {
    ipcRenderer.on('pinned-state', (_event, isPinned: boolean) => callback(isPinned))
  },

  backgroundTask: {
    syncTimer: (payload: { isRunning: boolean; timeLeft: number; timerPhase: 'focus' | 'rest' }) =>
      ipcRenderer.invoke('background-task:sync-timer', payload)
  },

  session: {
    create: (data: NewSession) => ipcRenderer.invoke('session:create', data),
    getAll: (): Promise<Session[]> => ipcRenderer.invoke('session:get-all'),
    getFullStats: (): Promise<FullSessionStats> => ipcRenderer.invoke('session:get-full-stats'),
    clear: () => ipcRenderer.invoke('session:clear'),
    exportCsv: (): Promise<boolean> => ipcRenderer.invoke('session:export-csv')
  },

  notification: {
    show: (title: string, body: string): Promise<boolean> =>
      ipcRenderer.invoke('notification:show', title, body)
  },

  openExternal: (url: string): Promise<boolean> => ipcRenderer.invoke('shell:open-external', url),
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
  getPlatform: (): Promise<string> => ipcRenderer.invoke('app:get-platform'),

  update: {
    check: (): Promise<boolean> => ipcRenderer.invoke('update:check'),
    getStatus: (): Promise<UpdateInfo> => ipcRenderer.invoke('update:get-status'),
    restart: (): Promise<boolean> => ipcRenderer.invoke('update:restart'),
    snooze: (): Promise<boolean> => ipcRenderer.invoke('update:snooze'),
    onStatus: (callback: (status: UpdateInfo) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, status: UpdateInfo): void =>
        callback(status)
      ipcRenderer.on('update-status', handler)
      return (): void => {
        ipcRenderer.removeListener('update-status', handler)
      }
    }
  }
})
