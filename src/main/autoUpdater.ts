import { dialog, shell, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'
import type { UpdateMetadata, UpdatePriority } from '../shared/types'

const RELEASE_URL = 'https://github.com/torrescereno/hollow/releases/latest'
const METADATA_URL =
  'https://github.com/torrescereno/hollow/releases/download/latest/update-metadata.json'

const canAutoUpdate = process.platform !== 'linux' || !!process.env.APPIMAGE

const POLL_INTERVALS = {
  normal: 60 * 60 * 1000,
  security: 15 * 60 * 1000,
  critical: 5 * 60 * 1000
} as const

let checkInterval: NodeJS.Timeout | null = null
let lastPriority: UpdatePriority = 'normal'
let criticalUpdateInfo: { version: string; downloaded: boolean } | null = null
let downloadProgress = 0

export function setupAutoUpdater(mainWindow: BrowserWindow | null): void {
  if (is.dev) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    if (!canAutoUpdate) {
      showLinuxManualUpdateDialog(info.version)
      return
    }

    handleUpdateAvailable(info.version, mainWindow)
  })

  autoUpdater.on('update-not-available', () => {
    sendUpdateStatus(mainWindow, { available: false })
  })

  autoUpdater.on('download-progress', (progress) => {
    downloadProgress = Math.round(progress.percent)
    sendUpdateStatus(mainWindow, {
      available: true,
      progress: downloadProgress
    })
  })

  autoUpdater.on('update-downloaded', () => {
    if (criticalUpdateInfo) {
      criticalUpdateInfo.downloaded = true
    }
    handleUpdateDownloaded()
  })

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error.message)
    sendUpdateStatus(mainWindow, { available: false })
  })
}

async function handleUpdateAvailable(
  version: string,
  mainWindow: BrowserWindow | null
): Promise<void> {
  const metadata = await fetchUpdateMetadata()
  const priority = metadata?.priority || 'normal'

  lastPriority = priority

  if (priority === 'critical') {
    criticalUpdateInfo = { version, downloaded: false }
    autoUpdater.downloadUpdate()
    sendUpdateStatus(mainWindow, {
      available: true,
      version,
      priority,
      message: metadata?.message,
      progress: 0
    })
    return
  }

  if (priority === 'security') {
    autoUpdater.downloadUpdate()
    sendUpdateStatus(mainWindow, {
      available: true,
      version,
      priority,
      message: metadata?.message,
      progress: 0
    })
    return
  }

  sendUpdateStatus(mainWindow, {
    available: true,
    version,
    priority,
    message: metadata?.message
  })
}

function handleUpdateDownloaded(): void {
  if (criticalUpdateInfo && lastPriority === 'critical') {
    showCriticalUpdateDialog()
    return
  }

  if (lastPriority === 'security') {
    showSecurityUpdateDialog()
    return
  }

  showNormalUpdateDialog()
}

async function fetchUpdateMetadata(): Promise<UpdateMetadata | null> {
  try {
    const response = await fetch(METADATA_URL)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.warn('Could not fetch update metadata:', error)
    return null
  }
}

function showLinuxManualUpdateDialog(version: string): void {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: `A new version (${version}) is available. Please download it manually from GitHub.`,
      buttons: ['Open Downloads', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        shell.openExternal(RELEASE_URL)
      }
    })
}

function showCriticalUpdateDialog(): void {
  const message = criticalUpdateInfo?.downloaded
    ? `Critical security update (${criticalUpdateInfo.version}) downloaded. Restart required.`
    : 'A critical security update is being downloaded...'

  dialog
    .showMessageBox({
      type: 'warning',
      title: 'Critical Update Required',
      message,
      detail: 'This update fixes critical security vulnerabilities.',
      buttons: ['Restart Now', 'Restart in 5 minutes']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
}

function showSecurityUpdateDialog(): void {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Security Update Ready',
      message: 'Security update downloaded. Restart to apply.',
      buttons: ['Restart Now', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
}

function showNormalUpdateDialog(): void {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. Restart to apply.',
      buttons: ['Restart Now', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
}

function sendUpdateStatus(
  mainWindow: BrowserWindow | null,
  status: {
    available: boolean
    version?: string
    priority?: UpdatePriority
    message?: string
    progress?: number
  }
): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-status', status)
  }
}

export function checkForUpdates(): void {
  if (is.dev) return

  try {
    autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}

export function startPolling(): void {
  if (is.dev) return

  checkForUpdates()

  const interval = POLL_INTERVALS[lastPriority] || POLL_INTERVALS.normal

  if (checkInterval) {
    clearInterval(checkInterval)
  }

  checkInterval = setInterval(() => {
    checkForUpdates()
  }, interval)
}

export function stopPolling(): void {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

export function getUpdateStatus(): {
  priority: UpdatePriority
  hasCriticalUpdate: boolean
  criticalDownloaded: boolean
} {
  return {
    priority: lastPriority,
    hasCriticalUpdate: criticalUpdateInfo !== null,
    criticalDownloaded: criticalUpdateInfo?.downloaded || false
  }
}

export function forceRestart(): void {
  if (criticalUpdateInfo?.downloaded || lastPriority === 'security') {
    autoUpdater.quitAndInstall()
  }
}

export function snoozeCriticalRestart(): void {
  if (checkInterval) {
    clearInterval(checkInterval)
  }

  setTimeout(
    () => {
      if (criticalUpdateInfo?.downloaded) {
        autoUpdater.quitAndInstall()
      }
    },
    5 * 60 * 1000
  )
}
