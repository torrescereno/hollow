import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import {
  ConfigSlider,
  Toggle,
  SoundSelector,
  SliderWarning,
  Button,
  LanguageSelector
} from '../../components'
import { useSound } from '../../hooks'
import type { AppConfig, UpdateInfo } from '../../schemas'
import { MIN_MINUTES, MAX_MINUTES, MAX_REST_MINUTES, FOCUS_WARNING_THRESHOLD } from '../../schemas'
import { useI18n } from '../../providers'
import { electronService } from '../../services'

interface ConfigSectionProps {
  config: AppConfig
  isRunning: boolean
  onUpdate: (partial: Partial<AppConfig>) => void
  onTimeReset: (minutes: number) => void
  onCheckUpdate: () => void
  updateInfo: UpdateInfo | null
}

export function ConfigSection({
  config,
  isRunning,
  onUpdate,
  onTimeReset,
  onCheckUpdate,
  updateInfo
}: ConfigSectionProps): React.JSX.Element {
  const { t, interpolate } = useI18n()
  const { preview, stop } = useSound()
  const [checking, setChecking] = useState(false)
  const [upToDate, setUpToDate] = useState(false)
  const [isMacOS, setIsMacOS] = useState(false)
  const updateInfoRef = useRef(updateInfo)

  useEffect(() => {
    electronService.getPlatform().then((platform) => {
      setIsMacOS(platform === 'darwin')
    })
  }, [])

  useEffect(() => {
    updateInfoRef.current = updateInfo
  })

  const isUpdating = updateInfo?.available === true
  const isDownloading = isUpdating && !updateInfo.downloaded && (updateInfo.progress ?? 0) < 100
  const isReady = isUpdating && updateInfo.downloaded === true

  const handleCheckUpdate = (): void => {
    setChecking(true)
    setUpToDate(false)
    onCheckUpdate()

    setTimeout(() => {
      setChecking(false)
      if (!updateInfoRef.current?.available) {
        setUpToDate(true)
        setTimeout(() => setUpToDate(false), 3000)
      }
    }, 4000)
  }

  const getUpdateLabel = (): string => {
    if (isReady) return t.config.updateReady
    if (isDownloading)
      return interpolate(t.config.downloading, { progress: updateInfo?.progress ?? 0 })
    if (isUpdating) return t.config.updating
    if (checking) return t.config.checking
    if (upToDate) return t.config.upToDate
    return t.config.checkUpdates
  }

  return (
    <div className="app-no-drag flex flex-1 flex-col gap-5 overflow-y-auto pr-2 -mr-2">
      <div>
        <ConfigSlider
          value={config.focusMinutes}
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          label={t.config.focusDuration}
          subtitle={interpolate(t.config.focusSubtitle, { min: MIN_MINUTES })}
          onChange={(val) => {
            onUpdate({ focusMinutes: val })
            if (!isRunning) onTimeReset(val)
          }}
        />
        <SliderWarning
          visible={config.focusMinutes > FOCUS_WARNING_THRESHOLD}
          message={t.config.healthWarning}
        />
      </div>

      <ConfigSlider
        value={config.restMinutes}
        min={MIN_MINUTES}
        max={MAX_REST_MINUTES}
        label={t.config.restDuration}
        subtitle={interpolate(t.config.restSubtitle, { min: MIN_MINUTES })}
        onChange={(val) => onUpdate({ restMinutes: val })}
      />

      <div className="flex flex-col gap-1">
        <Toggle
          label={t.config.sound}
          subtitle={t.config.soundSubtitle}
          isActive={config.soundEnabled}
          onToggle={() => {
            if (config.soundEnabled) stop()
            onUpdate({ soundEnabled: !config.soundEnabled })
          }}
        />

        {config.soundEnabled && (
          <SoundSelector
            selectedSound={config.selectedSound}
            onSelect={(soundId) => onUpdate({ selectedSound: soundId })}
            onPreview={preview}
          />
        )}
      </div>

      {isMacOS && (
        <Toggle
          label={t.config.backgroundTray}
          subtitle={t.config.backgroundTraySubtitle}
          isActive={config.backgroundTrayEnabled}
          onToggle={() => onUpdate({ backgroundTrayEnabled: !config.backgroundTrayEnabled })}
        />
      )}

      <Toggle
        label={t.config.confetti}
        subtitle={t.config.confettiSubtitle}
        isActive={config.confettiEnabled}
        onToggle={() => onUpdate({ confettiEnabled: !config.confettiEnabled })}
      />

      <div className="flex flex-col gap-1">
        <Toggle
          label={t.config.language}
          subtitle={t.config.languageSubtitle}
          isActive={false}
          onToggle={() => {}}
          showToggle={false}
        />
        <LanguageSelector
          selectedLocale={config.locale}
          onSelect={(locale) => onUpdate({ locale })}
        />
      </div>

      <div className="flex justify-center items-center">
        <Button
          variant="update"
          onClick={handleCheckUpdate}
          disabled={checking || isDownloading}
          className={upToDate ? 'text-green-400/50 w-fit' : 'w-fit'}
        >
          {upToDate ? (
            <Check size={12} strokeWidth={1.5} />
          ) : (
            <RefreshCw
              size={12}
              strokeWidth={1.5}
              className={checking || isDownloading ? 'animate-spin' : ''}
            />
          )}
          {getUpdateLabel()}
        </Button>
      </div>
    </div>
  )
}
