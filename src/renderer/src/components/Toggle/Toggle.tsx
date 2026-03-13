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
      className="flex w-full items-center justify-between rounded-xl bg-white/5 px-5 py-4 border border-white/5 transition-colors duration-200 hover:bg-white/10 focus-ring"
    >
      <div className="text-left">
        <p className="text-sm text-white/80 font-medium">{label}</p>
        {subtitle && <p className="text-[0.625rem] text-white/25 mt-0.5">{subtitle}</p>}
      </div>
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-200
          ${isActive ? 'bg-white/80' : 'bg-white/10'}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200
            ${isActive ? 'left-[1.125rem] bg-black' : 'left-0.5 bg-white/50'}`}
        />
      </div>
    </button>
  )
}
