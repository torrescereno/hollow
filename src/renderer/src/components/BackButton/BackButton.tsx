import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Volver' }: BackButtonProps): React.JSX.Element {
  return (
    <button onClick={onClick} className="app-no-drag btn-back">
      <ArrowLeft size={15} strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  )
}
