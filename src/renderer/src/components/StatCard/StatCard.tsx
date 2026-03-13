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
  const isSecondary = variant === 'secondary'

  return (
    <div
      className={`rounded-xl p-4 border flex flex-col items-center justify-center text-center
        ${isSecondary ? 'bg-white/3 border-white/5 px-4 py-3' : 'bg-white/5 border-white/5'}`}
    >
      <p className="text-[0.625rem] text-white/25 uppercase tracking-widest mb-1 whitespace-nowrap">
        {label}
      </p>
      <p className={`font-light text-text-main ${isSecondary ? 'text-lg' : 'text-2xl'}`}>{value}</p>
      {subtext && <p className="text-[0.625rem] text-white/25 mt-0.5">{subtext}</p>}
    </div>
  )
}
