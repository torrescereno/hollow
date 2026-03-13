import React, { useState, useEffect } from 'react'
import type { UpdateInfo } from '../../schemas/electron.schema'

interface UpdateNotificationProps {
  updateInfo: UpdateInfo | null
  onRestart: () => void
  onSnooze: () => void
  onDismiss: () => void
}

export function UpdateNotification({
  updateInfo,
  onRestart,
  onSnooze,
  onDismiss
}: UpdateNotificationProps): React.JSX.Element | null {
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(300)
  }, [updateInfo])

  useEffect(() => {
    if (!updateInfo?.available || updateInfo.priority !== 'critical') return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onRestart()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [updateInfo, onRestart])

  if (!updateInfo?.available) return null

  const isCritical = updateInfo.priority === 'critical'
  const isSecurity = updateInfo.priority === 'security'
  const isDownloaded = updateInfo.downloaded === true

  if (isCritical) {
    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60

    return (
      <div className="absolute left-0 right-0 top-0 z-50 mx-1 mt-1">
        <div className="flex flex-col gap-1.5 rounded-lg bg-red-900/95 px-2.5 py-2 text-white backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="flex-1 text-xs font-medium">Critical update</span>
            <span className="rounded bg-red-950/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-300">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={onSnooze}
              className="flex-1 rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/20"
            >
              5 min
            </button>
            <button
              onClick={onRestart}
              disabled={!isDownloaded}
              className="flex-1 rounded bg-white px-2 py-1 text-[10px] font-medium text-red-900 transition-colors hover:bg-white/90 disabled:opacity-50"
            >
              {isDownloaded ? 'Restart' : 'Downloading...'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isSecurity) {
    return (
      <div className="absolute left-0 right-0 top-0 z-40 mx-1 mt-1">
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-900/90 px-2.5 py-1.5 text-xs backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          <span className="flex-1 text-orange-100">
            Security update
            {updateInfo.version && <span className="text-orange-300"> v{updateInfo.version}</span>}
          </span>

          <button
            onClick={onDismiss}
            className="rounded px-1.5 py-0.5 text-[10px] text-white/60 hover:text-white/80"
          >
            Later
          </button>
          {isDownloaded && (
            <button
              onClick={onRestart}
              className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-white/30"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute left-0 right-0 top-0 z-40 mx-1 mt-1">
      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs backdrop-blur-sm">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>

        <span className="flex-1 text-white/80">
          Update{isDownloaded ? ' ready' : ' available'}
          {updateInfo.version && <span className="text-white/60"> v{updateInfo.version}</span>}
        </span>

        {!isDownloaded && updateInfo.progress !== undefined && updateInfo.progress < 100 ? (
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-12 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-white/60 transition-all"
                style={{ width: `${updateInfo.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-white/40">{updateInfo.progress}%</span>
          </div>
        ) : null}

        {isDownloaded ? (
          <button
            onClick={onRestart}
            className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-white/30"
          >
            Restart
          </button>
        ) : null}

        <button
          onClick={onDismiss}
          className="rounded px-1.5 py-0.5 text-[10px] text-white/40 hover:text-white/60"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
