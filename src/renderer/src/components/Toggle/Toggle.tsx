import React from 'react'

interface ToggleProps {
  label: string
  subtitle?: string
  isActive: boolean
  onToggle: () => void
}

export function Toggle({ label, subtitle, isActive, onToggle }: ToggleProps): React.JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl bg-white/2 px-5 py-4 border border-white/4 transition-colors duration-200 hover:bg-white/4"
    >
      <div className="text-left">
        <p className="text-sm text-white/90 font-medium">{label}</p>
        {subtitle && <p className="text-[0.625rem] text-white/30 mt-0.5">{subtitle}</p>}
      </div>
      <div
        className={`toggle-switch relative w-9 h-5 rounded-full transition-colors duration-200 ${
          isActive ? 'active bg-white/90' : 'inactive bg-white/10'
        }`}
      >
        <div className="toggle-knob absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200" />
      </div>
    </button>
  )
}
