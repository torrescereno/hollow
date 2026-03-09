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
    <div className="rounded-xl bg-white/2 p-5 border border-white/4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-white/90 font-medium">{label}</p>
          {subtitle && <p className="text-[0.625rem] text-white/30 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-2xl font-light text-text-main tabular-nums">{value}m</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="config-slider w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none"
        disabled={disabled}
      />
      <div className="flex justify-between mt-2 text-[0.5625rem] text-white/20 uppercase tracking-[0.05em]">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  )
}
