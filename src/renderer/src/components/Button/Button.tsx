import React, { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  title?: string
  className?: string
  variant?: 'icon' | 'play' | 'back' | 'clear' | 'export'
  isActive?: boolean
  disabled?: boolean
}

const variantStyles = {
  icon: 'rounded-full transition-all duration-200 flex items-center justify-center active:scale-95',
  play: 'flex items-center justify-center rounded-full bg-text-main text-black transition-all duration-200 active:scale-95 hover:bg-white/90',
  back: 'btn-back flex items-center gap-2.5 text-white/40 transition-colors duration-200 hover:text-white/75 mb-10 w-fit',
  clear:
    'flex items-center gap-2 text-[0.6875rem] transition-colors duration-200 text-white/15 hover:text-red-400/50 mt-4',
  export:
    'flex items-center gap-2 text-[0.6875rem] transition-colors duration-200 text-white/15 hover:text-green-400/50 mt-4'
} as const

export function Button({
  children,
  onClick,
  title,
  className = '',
  variant = 'icon',
  isActive,
  disabled
}: ButtonProps): React.JSX.Element {
  const stateClasses =
    variant === 'icon' && isActive !== undefined ? (isActive ? 'active' : 'inactive') : ''

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${variantStyles[variant]} ${stateClasses} ${className}`}
    >
      {children}
    </button>
  )
}
