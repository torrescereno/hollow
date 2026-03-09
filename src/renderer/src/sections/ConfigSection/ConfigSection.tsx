import React from 'react'
import { ConfigSlider, Toggle } from '../../components'
import type { AppConfig } from '../../schemas'
import { MIN_MINUTES, MAX_MINUTES } from '../../schemas'

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
  return (
    <div className="app-no-drag tab-content">
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

      <div className="toggle-group">
        <Toggle
          label="Auto-iniciar sesión"
          subtitle="Comenzar automáticamente al terminar"
          isActive={config.autoStart}
          onToggle={() => onUpdate({ autoStart: !config.autoStart })}
        />

        <Toggle
          label="Sonido de notificación"
          subtitle="Reproducir sonido al terminar sesión"
          isActive={config.soundEnabled}
          onToggle={() => onUpdate({ soundEnabled: !config.soundEnabled })}
        />
      </div>
    </div>
  )
}
