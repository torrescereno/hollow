import React from 'react'
import { Switch } from '@/components/ui/switch'

interface ToggleProps {
  label: string
  subtitle?: string
  isActive: boolean
  onToggle: () => void
  showToggle?: boolean
}

export function Toggle({
  label,
  subtitle,
  isActive,
  onToggle,
  showToggle = true
}: ToggleProps): React.JSX.Element {
  if (!showToggle) {
    return (
      <div className="flex w-full items-center justify-between rounded-xl bg-secondary px-5 py-4 border border-border">
        <div className="text-left">
          <p className="text-sm text-foreground font-medium">{label}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl bg-secondary px-5 py-4 border border-border transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="text-left">
        <p className="text-sm text-foreground font-medium">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <Switch checked={isActive} onCheckedChange={onToggle} aria-label={label} />
    </button>
  )
}
