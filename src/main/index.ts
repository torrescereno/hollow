import { app, BrowserWindow, nativeImage, Tray } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { setupAutoUpdater, setMainWindow, startPolling, checkPendingUpdate } from './autoUpdater'
import { initDatabase, closeDatabase } from '../database/client'
import {
  registerSessionIPC,
  registerWindowIPC,
  registerConfigIPC,
  registerAppIPC,
  registerUpdateIPC,
  registerNotificationIPC
} from './ipc'
import type { BackgroundTimerSyncPayload } from './ipc/window.ipc'
import type { AppConfig, PendingUpdate } from '../shared/types'
import { initMainI18n } from './i18n'

export interface StoreSchema {
  isPinned: boolean
  config: AppConfig
  pendingUpdate: PendingUpdate | null
}

const store = new Store<StoreSchema>({
  defaults: {
    isPinned: false,
    config: {
      focusMinutes: 25,
      restMinutes: 2,
      soundEnabled: true,
      selectedSound: 'bell',
      confettiEnabled: true,
      backgroundTrayEnabled: false,
      locale: 'en'
    },
    pendingUpdate: null
  }
})

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let backgroundTimerState: BackgroundTimerSyncPayload = {
  isRunning: false,
  timeLeft: 0,
  timerPhase: 'focus'
}
let isBlurBackgroundTaskActive = false
let isBackgroundWindowMode = false

function emitBackgroundTaskState(): void {
  mainWindow?.webContents.send('background-task:active-state', isBackgroundWindowMode)
}

function shouldShowTrayTimer(): boolean {
  if (process.platform !== 'darwin' || !tray) return false
  return backgroundTimerState.isRunning && isBlurBackgroundTaskActive
}

function updateTrayTitle(): void {
  if (process.platform !== 'darwin' || !tray) return

  if (!shouldShowTrayTimer()) {
    tray.setTitle('')
    return
  }

  const timeLeft = Math.max(0, backgroundTimerState.timeLeft)

  if (timeLeft < 60) {
    tray.setTitle(`${timeLeft.toString().padStart(2, '0')}s`)
    return
  }

  const remainingMinutes = Math.floor(timeLeft / 60)
  tray.setTitle(`${remainingMinutes.toString().padStart(2, '0')}m`)
}

function enterBackgroundWindowMode(): void {
  if (process.platform !== 'darwin' || !mainWindow || isBackgroundWindowMode) return

  isBackgroundWindowMode = true
  mainWindow.setSkipTaskbar(true)
  mainWindow.hide()
  app.dock?.hide()
}

function exitBackgroundWindowMode(): void {
  if (process.platform !== 'darwin' || !mainWindow || !isBackgroundWindowMode) return

  isBackgroundWindowMode = false
  app.dock?.show()
  mainWindow.setSkipTaskbar(false)
  mainWindow.show()
  mainWindow.focus()
}

function restoreFromTray(): void {
  isBlurBackgroundTaskActive = false
  emitBackgroundTaskState()
  exitBackgroundWindowMode()
  updateTrayTitle()
}

function syncBackgroundTimerState(payload: BackgroundTimerSyncPayload): void {
  backgroundTimerState = payload

  if (!payload.isRunning) {
    isBlurBackgroundTaskActive = false
    emitBackgroundTaskState()
    exitBackgroundWindowMode()
  }

  updateTrayTitle()
}

function createTray(iconPath: string): void {
  if (process.platform !== 'darwin') return
  if (tray) return

  const trayIcon = nativeImage.createFromPath(iconPath).resize({ height: 18 })
  tray = new Tray(trayIcon)
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', () => {
    if (isBackgroundWindowMode) {
      restoreFromTray()
    }
  })
  updateTrayTitle()
}

function destroyTray(): void {
  if (!tray) return
  tray.destroy()
  tray = null
}

function createWindow(): void {
  const isPinned = store.get('isPinned', false)

  const initWidth = 260
  const initHeight = 160

  let iconPath: string
  if (is.dev) {
    iconPath = join(__dirname, '../../resources/icon.png')
  } else {
    iconPath = join(process.resourcesPath, 'icon.png')
  }

  const icon = nativeImage.createFromPath(iconPath)

  if (process.platform === 'darwin' && !icon.isEmpty()) {
    app.dock?.setIcon(iconPath)
    createTray(iconPath)
  }

  mainWindow = new BrowserWindow({
    icon,
    width: initWidth,
    height: initHeight,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    alwaysOnTop: isPinned,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      // Required by better-sqlite3 (native addon)
      sandbox: false
    }
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('pinned-state', isPinned)
    emitBackgroundTaskState()
  })

  mainWindow.on('blur', () => {
    const config = store.get('config')
    if (store.get('isPinned', false)) return
    if (!config.backgroundTrayEnabled) return
    if (!backgroundTimerState.isRunning) return
    isBlurBackgroundTaskActive = true
    enterBackgroundWindowMode()
    updateTrayTitle()
  })

  mainWindow.on('focus', () => {
    isBlurBackgroundTaskActive = false
    updateTrayTitle()
  })
}

// ── Single instance lock (native Electron API) ──

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      closeDatabase()
      app.quit()
    }
  })

  app.on('before-quit', () => {
    destroyTray()
    closeDatabase()
  })

  app.whenReady().then(() => {
    initMainI18n(store)
    initDatabase()
    registerSessionIPC()
    registerWindowIPC(() => mainWindow, store, {
      syncTimer: syncBackgroundTimerState
    })
    registerConfigIPC(store)
    registerAppIPC()
    registerUpdateIPC()
    registerNotificationIPC()
    createWindow()

    if (!is.dev) {
      if (mainWindow) setupAutoUpdater(mainWindow, store)
      checkPendingUpdate()
      startPolling()
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        if (mainWindow && !is.dev) {
          setMainWindow(mainWindow)
        }
      }
    })
  })
}
