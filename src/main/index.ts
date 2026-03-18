import { app, BrowserWindow, nativeImage } from 'electron'
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
import type { AppConfig, PendingUpdate } from '../shared/types'

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
      confettiEnabled: true
    },
    pendingUpdate: null
  }
})

let mainWindow: BrowserWindow | null = null

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
    closeDatabase()
  })

  app.whenReady().then(() => {
    initDatabase()
    registerSessionIPC()
    registerWindowIPC(() => mainWindow, store)
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
