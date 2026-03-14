import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { ConfigSlider, Toggle, SoundSelector, SliderWarning, Button } from '../../components'
import { useSound } from '../../hooks'
import type { AppConfig, UpdateInfo } from '../../schemas'
import { MIN_MINUTES, MAX_MINUTES, MAX_REST_MINUTES, FOCUS_WARNING_THRESHOLD } from '../../schemas'

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
  const { preview, stop } = useSound()
  const [checking, setChecking] = useState(false)
  const [upToDate, setUpToDate] = useState(false)
  const updateInfoRef = useRef(updateInfo)
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
    if (isReady) return 'Actualización lista'
    if (isDownloading) return `Descargando... ${updateInfo?.progress ?? 0}%`
    if (isUpdating) return 'Actualizando...'
    if (checking) return 'Verificando...'
    if (upToDate) return 'Todo al día'
    return 'Buscar actualizaciones'
  }

  return (
    <div className="app-no-drag flex flex-1 flex-col gap-5 overflow-y-auto pr-2 -mr-2">
      <div>
        <ConfigSlider
          value={config.focusMinutes}
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          label="Duración de enfoque"
          subtitle={`Mínimo ${MIN_MINUTES} minutos`}
          onChange={(val) => {
            onUpdate({ focusMinutes: val })
            if (!isRunning) onTimeReset(val)
          }}
        />
        <SliderWarning
          visible={config.focusMinutes > FOCUS_WARNING_THRESHOLD}
          message="No excedas el tiempo recomendado, cuida tu salud. Sesiones muy largas pueden afectar tu concentración y postura."
        />
      </div>

      <ConfigSlider
        value={config.restMinutes}
        min={MIN_MINUTES}
        max={MAX_REST_MINUTES}
        label="Duración de descanso"
        subtitle={`Mínimo ${MIN_MINUTES} minuto`}
        onChange={(val) => onUpdate({ restMinutes: val })}
      />

      <div className="flex flex-col gap-1">
        <Toggle
          label="Sonido de notificación"
          subtitle="Reproducir sonido al terminar sesión"
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

      <Toggle
        label="Confetti"
        subtitle="Lanzar confetti al completar sesión de enfoque"
        isActive={config.confettiEnabled}
        onToggle={() => onUpdate({ confettiEnabled: !config.confettiEnabled })}
      />

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
