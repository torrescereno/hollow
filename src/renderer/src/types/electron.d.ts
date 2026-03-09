import type { ElectronAPI } from '../schemas/electron.schema'

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
