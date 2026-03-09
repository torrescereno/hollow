import React from 'react'

interface ConfigSliderProps {
  value: number
  min: number
  max: number
  label: string
  subtitle?: string
  onChange: (value: number) => void
  disabled?: boolean
}

export function ConfigSlider({
  value,
  min,
  max,
  label,
  subtitle,
  onChange,
  disabled
}: ConfigSliderProps): React.JSX.Element {
  return (
    <div className="config-card">
      <div className="config-header">
        <div>
          <p className="config-title">{label}</p>
          {subtitle && <p className="config-subtitle">{subtitle}</p>}
        </div>
        <span className="config-value">{value}m</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="config-slider"
        disabled={disabled}
      />
      <div className="slider-labels">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  )
}
