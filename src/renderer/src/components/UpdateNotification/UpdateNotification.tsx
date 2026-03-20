import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { UpdateInfo } from '../../schemas/electron.schema'
import { useI18n } from '../../providers'

interface UpdateNotificationProps {
  updateInfo: UpdateInfo | null
  onRestart: () => void
  onSnooze: () => void
  onDismiss: () => void
}

const RELEASE_URL = 'https://github.com/torrescereno/hollow/releases/latest'

export function UpdateNotification({
  updateInfo,
  onRestart,
  onSnooze,
  onDismiss
}: UpdateNotificationProps): React.JSX.Element | null {
  const { t } = useI18n()
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

  const handleDownload = (): void => {
    window.electronAPI?.openExternal(RELEASE_URL)
    onDismiss()
  }

  if (!updateInfo?.available) return null

  const isCritical = updateInfo.priority === 'critical'
  const isSecurity = updateInfo.priority === 'security'
  const isDownloaded = updateInfo.downloaded === true
  const isManualDownload = updateInfo.manualDownload === true

  if (isCritical) {
    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60

    return (
      <div className="app-no-drag absolute left-0 right-0 top-0 z-50 mx-3 mt-3">
        <div className="flex flex-col gap-1.5 rounded-[1.25rem] bg-red-900/95 px-3.5 py-2.5 text-white backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="flex-1 text-xs font-medium">Critical update</span>
            {!isManualDownload && (
              <span className="rounded-full bg-red-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-red-300">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            )}
          </div>

          <div className="flex gap-1.5">
            {isManualDownload ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="flex-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-[10px]"
                >
                  {t.update.later}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 rounded-full bg-white text-red-900 hover:bg-white/90 text-[10px]"
                >
                  {t.update.download}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSnooze}
                  className="flex-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-[10px]"
                >
                  {t.update.snooze}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onRestart}
                  disabled={!isDownloaded}
                  className="flex-1 rounded-full bg-white text-red-900 hover:bg-white/90 text-[10px]"
                >
                  {isDownloaded ? t.update.restart : t.update.downloading}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isSecurity) {
    return (
      <div className="app-no-drag absolute left-0 right-0 top-0 z-40 mx-3 mt-3">
        <div className="flex items-center gap-1.5 rounded-[1.25rem] bg-orange-900/90 px-3.5 py-2 text-xs backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="rounded-full text-white/60 hover:text-white/80 text-[10px]"
          >
            {t.update.later}
          </Button>
          {isManualDownload ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="rounded-full bg-white/20 text-white hover:bg-white/30 text-[10px]"
            >
              {t.update.download}
            </Button>
          ) : (
            isDownloaded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRestart}
                className="rounded-full bg-white/20 text-white hover:bg-white/30 text-[10px]"
              >
                {t.update.restart}
              </Button>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-no-drag absolute left-0 right-0 top-0 z-40 mx-3 mt-3">
      <div className="flex items-center gap-1.5 rounded-[1.25rem] bg-secondary px-3.5 py-2 text-xs backdrop-blur-sm">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>

        <span className="flex-1 text-foreground/80">
          {t.update.available}
          {updateInfo.version && (
            <span className="text-muted-foreground"> v{updateInfo.version}</span>
          )}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground/60 text-[10px] rounded-full"
        >
          {t.update.skip}
        </Button>
        {isManualDownload ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="bg-white/20 text-white hover:bg-white/30 text-[10px] rounded-full"
          >
            {t.update.download}
          </Button>
        ) : (
          isDownloaded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestart}
              className="bg-white/20 text-white hover:bg-white/30 text-[10px] rounded-full"
            >
              {t.update.restart}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
