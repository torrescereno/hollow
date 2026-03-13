import React from 'react'
import { motion } from 'motion/react'
import { Music } from 'lucide-react'
import type { SoundOption } from '../../schemas'
import { SOUND_OPTIONS } from '../../schemas'

interface SoundSelectorProps {
  selectedSound: string
  isPlaying: boolean
  onSelect: (soundId: string) => void
  onPreview: (soundId: string) => void
}

export function SoundSelector({
  selectedSound,
  onSelect,
  onPreview
}: SoundSelectorProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mt-3 grid grid-cols-2 gap-2">
        {SOUND_OPTIONS.map((sound: SoundOption) => {
          const isSelected = selectedSound === sound.id

          return (
            <button
              key={sound.id}
              onClick={() => {
                onSelect(sound.id)
                onPreview(sound.id)
              }}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors duration-200 focus-ring
                ${
                  isSelected
                    ? 'bg-white/10 border-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
            >
              <div className="flex items-center gap-2">
                <Music
                  size={12}
                  strokeWidth={1.5}
                  className={`transition-colors duration-200 ${isSelected ? 'text-white' : 'text-white/25'}`}
                />
                <span
                  className={`text-xs transition-colors duration-200
                    ${isSelected ? 'text-white font-medium' : 'text-white/50'}`}
                >
                  {sound.name}
                </span>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
