import React from 'react'
import { motion } from 'motion/react'

interface TimerProps {
  minutes: string
  isRunning: boolean
}

export function Timer({ minutes, isRunning }: TimerProps): React.JSX.Element {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className={`font-mono tracking-[-0.05em] text-text-main text-[4rem] font-extralight ${
          isRunning ? 'opacity-100' : 'opacity-45'
        } transition-opacity duration-500`}
      >
        {minutes}
      </span>
      <motion.span
        animate={{ opacity: isRunning ? [0.15, 0.45, 0.15] : 0.15 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="font-mono font-light text-text-main text-xl"
      >
        m
      </motion.span>
    </div>
  )
}
