import React from 'react'

interface ToggleProps {
  label: string
  subtitle?: string
  isActive: boolean
  onToggle: () => void
}

export function Toggle({ label, subtitle, isActive, onToggle }: ToggleProps): React.JSX.Element {
  return (
    <button onClick={onToggle} className="toggle-btn">
      <div className="toggle-info">
        <p className="config-title">{label}</p>
        {subtitle && <p className="config-subtitle">{subtitle}</p>}
      </div>
      <div className={`toggle-switch ${isActive ? 'active' : 'inactive'}`}>
        <div className="toggle-knob" />
      </div>
    </button>
  )
}
