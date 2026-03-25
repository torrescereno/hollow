import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { UpdateInfo } from '../../schemas/electron.schema'
import { useI18n } from '../../providers'

interface UpdateNotificationProps {
  updateInfo: UpdateInfo | null
  onRestart: () => void
  onSnooze: () => void
  onBrewUpgrade: () => void
  onDismiss: () => void
}

export function UpdateNotification({
  updateInfo,
  onRestart,
  onSnooze,
  onBrewUpgrade,
  onDismiss
}: UpdateNotificationProps): React.JSX.Element | null {
  const { t } = useI18n()
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(300)
  }, [updateInfo])

  useEffect(() => {
    if (!updateInfo?.available || updateInfo.priority !== 'critical' || updateInfo.brewUpdate) return

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

  if (updateInfo.brewUpdate) {
    return (
      <BrewUpdateBanner
        updateInfo={updateInfo}
        isCritical={isCritical}
        isSecurity={isSecurity}
        onBrewUpgrade={onBrewUpgrade}
        onDismiss={onDismiss}
        t={t}
      />
    )
  }

  const isDownloaded = updateInfo.downloaded === true
  const isDownloading = !isDownloaded && (updateInfo.progress ?? 0) > 0
  const progress = updateInfo.progress ?? 0

  if (isCritical) {
    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60

    return (
      <div className="app-no-drag absolute left-0 right-0 top-0 z-50 mx-3 mt-3">
        <div className="flex flex-col gap-1.5 rounded-[1.25rem] bg-red-900/95 px-3.5 py-2.5 text-white backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <WarningIcon className="text-red-400" />
            <span className="flex-1 text-xs font-medium">Critical update</span>
            <span className="rounded-full bg-red-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-red-300">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-1.5">
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
              {isDownloaded ? t.update.restart : `${t.update.downloading} ${progress}%`}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isSecurity) {
    return (
      <div className="app-no-drag absolute left-0 right-0 top-0 z-40 mx-3 mt-3">
        <div className="flex items-center gap-1.5 rounded-[1.25rem] bg-orange-900/90 px-3.5 py-2 text-xs backdrop-blur-sm">
          <LockIcon className="text-orange-400" />

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
          {isDownloaded ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestart}
              className="rounded-full bg-white/20 text-white hover:bg-white/30 text-[10px]"
            >
              {t.update.restart}
            </Button>
          ) : isDownloading ? (
            <span className="text-[10px] text-orange-300 font-mono">
              {t.update.downloading} {progress}%
            </span>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="app-no-drag absolute left-0 right-0 top-0 z-40 mx-3 mt-3">
      <div className="flex items-center gap-1.5 rounded-[1.25rem] bg-secondary px-3.5 py-2 text-xs backdrop-blur-sm">
        <CloudIcon className="text-muted-foreground" />

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
        {isDownloaded ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="bg-white/20 text-white hover:bg-white/30 text-[10px] rounded-full"
          >
            {t.update.restart}
          </Button>
        ) : isDownloading ? (
          <span className="text-[10px] text-muted-foreground font-mono">
            {t.update.downloading} {progress}%
          </span>
        ) : null}
      </div>
    </div>
  )
}

interface BrewUpdateBannerProps {
  updateInfo: UpdateInfo
  isCritical: boolean
  isSecurity: boolean
  onBrewUpgrade: () => void
  onDismiss: () => void
  t: {
    update: {
      available: string
      skip: string
      brewHint: string
      update: string
      updating: string
      brewFailed: string
    }
  }
}

function BrewUpdateBanner({
  updateInfo,
  isCritical,
  isSecurity,
  onBrewUpgrade,
  onDismiss,
  t
}: BrewUpdateBannerProps): React.JSX.Element {
  const isUpdating = updateInfo.brewUpdating === true
  const hasError = !!updateInfo.brewError

  const bg = isCritical
    ? 'bg-red-900/95'
    : isSecurity
      ? 'bg-orange-900/90'
      : 'bg-secondary'
  const textColor = isCritical
    ? 'text-white'
    : isSecurity
      ? 'text-orange-100'
      : 'text-foreground/80'
  const versionColor = isCritical
    ? 'text-red-300'
    : isSecurity
      ? 'text-orange-300'
      : 'text-muted-foreground'
  const skipBtnColor = isCritical || isSecurity
    ? 'text-white/60 hover:text-white/80'
    : 'text-muted-foreground hover:text-foreground/60'
  const updateBtnColor = isCritical
    ? 'bg-white/20 text-white hover:bg-white/30'
    : isSecurity
      ? 'bg-white/20 text-white hover:bg-white/30'
      : 'bg-white/20 text-white hover:bg-white/30'
  const errorColor = isCritical
    ? 'text-red-300/60'
    : isSecurity
      ? 'text-orange-300/60'
      : 'text-muted-foreground/60'
  const spinnerColor = isCritical
    ? 'border-red-300/30 border-t-red-200'
    : isSecurity
      ? 'border-orange-300/30 border-t-orange-200'
      : 'border-white/20 border-t-white/60'

  const Icon = isCritical ? WarningIcon : isSecurity ? LockIcon : CloudIcon
  const iconColor = isCritical
    ? 'text-red-400'
    : isSecurity
      ? 'text-orange-400'
      : 'text-muted-foreground'

  return (
    <div className={`app-no-drag absolute left-0 right-0 top-0 ${isCritical ? 'z-50' : 'z-40'} mx-3 mt-3`}>
      <div className={`flex flex-col gap-0.5 rounded-[1.25rem] ${bg} px-3.5 py-2 text-xs backdrop-blur-sm`}>
        <div className="flex items-center gap-1.5">
          <Icon className={iconColor} />
          <span className={`flex-1 ${textColor}`}>
            {isUpdating ? t.update.updating : t.update.available}
            {!isUpdating && updateInfo.version && (
              <span className={versionColor}> v{updateInfo.version}</span>
            )}
          </span>

          {isUpdating ? (
            <div
              className={`h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 ${spinnerColor}`}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className={`${skipBtnColor} text-[10px] rounded-full`}
              >
                {t.update.skip}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBrewUpgrade}
                className={`${updateBtnColor} text-[10px] rounded-full`}
              >
                {t.update.update}
              </Button>
            </>
          )}
        </div>

        {hasError && (
          <span className={`${errorColor} text-[10px] pl-5`}>
            {t.update.brewFailed}
          </span>
        )}
      </div>
    </div>
  )
}

function WarningIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
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
  )
}

function LockIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
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
  )
}

function CloudIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
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
  )
}
