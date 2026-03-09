import { app, BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// Fix GPU issues on Linux
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('disable-setuid-sandbox')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-dev-shm-usage')
app.commandLine.appendSwitch('disable-features=VizDisplayCompositor')

interface Config {
  focusMinutes: number
  autoStart: boolean
  soundEnabled: boolean
}

interface StoreSchema {
  isPinned: boolean
  config: Config
  sessions: Record<string, unknown>[]
}

const store = new Store<StoreSchema>({
  defaults: {
    isPinned: false,
    config: {
      focusMinutes: 25,
      autoStart: false,
      soundEnabled: true
    },
    sessions: []
  }
})

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const isPinned = store.get('isPinned', false)

  mainWindow = new BrowserWindow({
    width: 220,
    height: 150,
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
      experimentalFeatures: true,
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ── Pin ──

ipcMain.handle('set-always-on-top', (_event, isPinned: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(isPinned)
    store.set('isPinned', isPinned)
  }
  return isPinned
})

ipcMain.handle('get-pinned-state', () => {
  return store.get('isPinned', false)
})

// ── Window ──

ipcMain.handle('resize-window', async (_event, targetW: number, targetH: number) => {
  if (!mainWindow) return

  const [startW, startH] = mainWindow.getSize()
  const [startX, startY] = mainWindow.getPosition()

  if (startW === targetW && startH === targetH) return

  const centerX = startX + startW / 2
  const centerY = startY + startH / 2

  const x = Math.round(centerX - targetW / 2)
  const y = Math.round(centerY - targetH / 2)

  mainWindow.setBounds({ x, y, width: targetW, height: targetH })
})

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close()
})

// ── Config ──

ipcMain.handle('save-config', (_event, config: Config) => {
  store.set('config', config)
})

ipcMain.handle('load-config', () => {
  return store.get('config')
})

// ── Sessions ──

ipcMain.handle('log-session', (_event, session: Record<string, unknown>) => {
  const sessions = store.get('sessions', [])
  sessions.push(session)
  store.set('sessions', sessions)
})

ipcMain.handle('load-sessions', () => {
  return store.get('sessions', [])
})

ipcMain.handle('clear-sessions', () => {
  store.set('sessions', [])
})
