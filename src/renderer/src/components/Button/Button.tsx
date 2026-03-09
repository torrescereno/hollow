import React, { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  title?: string
  className?: string
  variant?: 'icon' | 'play' | 'back' | 'clear'
  isActive?: boolean
  disabled?: boolean
}

export function Button({
  children,
  onClick,
  title,
  className = '',
  variant = 'icon',
  isActive,
  disabled
}: ButtonProps): React.JSX.Element {
  const variantClasses = {
    icon: 'btn-icon',
    play: 'btn-play',
    back: 'btn-back',
    clear: 'btn-clear'
  }

  const stateClasses = isActive ? 'active' : 'inactive'

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${variantClasses[variant]} ${stateClasses} ${className}`}
    >
      {children}
    </button>
  )
}
