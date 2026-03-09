import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Volver' }: BackButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className="app-no-drag btn-back flex items-center gap-2.5 text-white/40 transition-colors duration-200 hover:text-white/75 mb-10 w-fit"
    >
      <ArrowLeft size={15} strokeWidth={1.5} className="transition-transform duration-200" />
      <span className="text-xs font-medium tracking-[0.1em] uppercase">{label}</span>
    </button>
  )
}
