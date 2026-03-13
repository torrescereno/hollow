import React from 'react'
import { AlertCircle } from 'lucide-react'

interface SliderWarningProps {
  visible: boolean
  message: string
}

export function SliderWarning({ visible, message }: SliderWarningProps): React.JSX.Element {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        gridTemplateRows: visible ? '1fr' : '0fr',
        opacity: visible ? 1 : 0
      }}
    >
      <div className="overflow-hidden">
        <div
          className="flex items-start gap-2 rounded-lg px-4 py-3 text-xs leading-relaxed mt-3"
          style={{
            backgroundColor: 'rgba(255, 165, 0, 0.08)',
            border: '1px solid rgba(255, 165, 0, 0.15)',
            color: 'rgba(255, 180, 50, 0.9)'
          }}
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  )
}
