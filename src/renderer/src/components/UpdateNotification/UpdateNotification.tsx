import React, { useState, useEffect } from 'react'
import type { UpdateInfo } from '../../hooks/useUpdate'

interface UpdateNotificationProps {
  updateInfo: UpdateInfo | null
  onRestart: () => void
  onSnooze: () => void
}

export function UpdateNotification({
  updateInfo,
  onRestart,
  onSnooze
}: UpdateNotificationProps): React.JSX.Element | null {
  const [countdown, setCountdown] = useState(300)
  const [isVisible, setIsVisible] = useState(true)

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
  }, [updateInfo?.available, updateInfo?.priority, onRestart])

  if (!updateInfo?.available) return null

  const isCritical = updateInfo.priority === 'critical'
  const isSecurity = updateInfo.priority === 'security'

  if (!isVisible) return null

  if (isCritical) {
    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="mx-4 flex max-w-sm flex-col rounded-2xl bg-red-900/90 p-6 text-white backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <svg
              className="h-6 w-6 text-red-400"
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
            <h2 className="text-lg font-medium">Critical Update Required</h2>
          </div>

          <p className="mb-4 text-sm text-white/80">
            {updateInfo.message || 'A critical security update needs to be installed.'}
          </p>

          <div className="mb-4 rounded-lg bg-red-950/50 px-3 py-2 text-center">
            <span className="text-2xl font-mono font-bold text-red-300">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <p className="text-xs text-white/60">Automatic restart</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSnooze()}
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/20"
            >
              In 5min
            </button>
            <button
              onClick={() => onRestart()}
              className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-900 transition-colors hover:bg-white/90"
            >
              Restart Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isSecurity) {
    return (
      <div className="absolute left-0 right-0 top-0 z-40 mx-2 mt-2">
        <div className="flex items-center gap-2 rounded-lg bg-orange-900/90 px-3 py-2 text-sm backdrop-blur-sm">
          <svg
            className="h-4 w-4 flex-shrink-0 text-orange-400"
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
            Security update ready
            {updateInfo.version && <span className="text-orange-300"> v{updateInfo.version}</span>}
          </span>

          <button
            onClick={() => setIsVisible(false)}
            className="rounded px-2 py-0.5 text-xs text-white/60 hover:text-white/80"
          >
            Later
          </button>
          <button
            onClick={() => onRestart()}
            className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white hover:bg-white/30"
          >
            Restart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute left-0 right-0 top-0 z-40 mx-2 mt-2">
      <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
        <svg
          className="h-4 w-4 flex-shrink-0 text-white/60"
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
          Update available
          {updateInfo.version && <span className="text-white/60"> v{updateInfo.version}</span>}
        </span>

        {updateInfo.progress !== undefined && updateInfo.progress < 100 ? (
          <div className="flex items-center gap-2">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-white/60 transition-all"
                style={{ width: `${updateInfo.progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40">{updateInfo.progress}%</span>
          </div>
        ) : null}

        <button
          onClick={() => setIsVisible(false)}
          className="rounded px-2 py-0.5 text-xs text-white/40 hover:text-white/60"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
