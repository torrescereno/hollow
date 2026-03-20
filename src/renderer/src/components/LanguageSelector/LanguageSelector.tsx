import React from 'react'
import { cn } from '@/lib/utils'
import type { Locale } from '../../../../shared/types'

interface LanguageOption {
  id: Locale
  label: string
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' }
]

interface LanguageSelectorProps {
  selectedLocale: Locale
  onSelect: (locale: Locale) => void
}

export function LanguageSelector({
  selectedLocale,
  onSelect
}: LanguageSelectorProps): React.JSX.Element {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {LANGUAGE_OPTIONS.map((lang) => {
        const isSelected = selectedLocale === lang.id

        return (
          <button
            key={lang.id}
            onClick={() => onSelect(lang.id)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSelected
                ? 'bg-accent border-white/15'
                : 'bg-secondary border-border hover:bg-accent'
            )}
          >
            <span
              className={cn(
                'text-xs transition-colors duration-200',
                isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {lang.label}
            </span>

            {isSelected && (
              <div className="w-1.5 h-1.5 rounded-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
