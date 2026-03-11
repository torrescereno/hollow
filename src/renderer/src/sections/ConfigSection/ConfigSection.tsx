import React from 'react'
import { ConfigSlider, Toggle, SoundSelector } from '../../components'
import { useSound } from '../../hooks'
import type { AppConfig } from '../../schemas'
import { MIN_MINUTES, MAX_MINUTES, MAX_REST_MINUTES } from '../../schemas'

interface ConfigSectionProps {
  config: AppConfig
  isRunning: boolean
  onUpdate: (partial: Partial<AppConfig>) => void
  onTimeReset: (minutes: number) => void
}

export function ConfigSection({
  config,
  isRunning,
  onUpdate,
  onTimeReset
}: ConfigSectionProps): React.JSX.Element {
  const { isPlaying, preview, stop } = useSound()

  return (
    <div className="app-no-drag flex flex-1 flex-col gap-5 overflow-y-auto pr-2 -mr-2">
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
            isPlaying={isPlaying}
            onSelect={(soundId) => onUpdate({ selectedSound: soundId })}
            onPreview={preview}
          />
        )}
      </div>
    </div>
  )
}
