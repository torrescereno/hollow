import React from 'react'
import { Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SoundOption } from '../../schemas'
import { SOUND_OPTIONS } from '../../schemas'
import { useI18n } from '../../providers'

interface SoundSelectorProps {
  selectedSound: string
  onSelect: (soundId: string) => void
  onPreview: (soundId: string) => void
}

export function SoundSelector({
  selectedSound,
  onSelect,
  onPreview
}: SoundSelectorProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {SOUND_OPTIONS.map((sound: SoundOption) => {
        const isSelected = selectedSound === sound.id
        const soundName = t.sounds[sound.id as keyof typeof t.sounds] ?? sound.id

        return (
          <button
            key={sound.id}
            onClick={() => {
              onSelect(sound.id)
              onPreview(sound.id)
            }}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSelected
                ? 'bg-accent border-white/15'
                : 'bg-secondary border-border hover:bg-accent'
            )}
          >
            <div className="flex items-center gap-2">
              <Music
                size={12}
                strokeWidth={1.5}
                className={cn(
                  'transition-colors duration-200',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs transition-colors duration-200',
                  isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {soundName}
              </span>
            </div>

            {isSelected && (
              <div className="w-1.5 h-1.5 rounded-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
