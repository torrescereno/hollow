import { electronService } from './electron.service'

class WindowService {
  async setAlwaysOnTop(isPinned: boolean): Promise<boolean> {
    return await electronService.setAlwaysOnTop(isPinned)
  }

  async getPinnedState(): Promise<boolean> {
    return await electronService.getPinnedState()
  }

  onPinnedState(callback: (isPinned: boolean) => void): void {
    electronService.onPinnedState(callback)
  }

  async resize(width: number, height: number): Promise<void> {
    await electronService.resizeWindow(width, height)
  }

  async minimize(): Promise<void> {
    await electronService.minimizeWindow()
  }

  async close(): Promise<void> {
    await electronService.closeWindow()
  }
}

export const windowService = new WindowService()
