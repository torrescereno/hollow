import React from 'react'

interface StatCardProps {
  label: string
  value: number | string
  subtext?: string
  variant?: 'primary' | 'secondary'
}

export function StatCard({
  label,
  value,
  subtext,
  variant = 'primary'
}: StatCardProps): React.JSX.Element {
  if (variant === 'secondary') {
    return (
      <div className="stat-card-secondary">
        <p className="stat-label-secondary">{label}</p>
        <p className="stat-value-secondary">{value}</p>
      </div>
    )
  }

  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {subtext && <p className="stat-subtext">{subtext}</p>}
    </div>
  )
}
