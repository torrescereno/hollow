import React from 'react'
import { motion } from 'motion/react'

interface TimerProps {
  minutes: string
  isRunning: boolean
}

export function Timer({ minutes, isRunning }: TimerProps): React.JSX.Element {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-baseline gap-1">
        <span
          className={`font-mono tracking-[-0.05em] text-text-main transition-[font-size] duration-[180ms] ease-in-out will-change-[font-size] backface-hidden text-[3.2rem] font-light ${
            isRunning ? 'opacity-100' : 'opacity-45'
          } transition-opacity duration-200`}
        >
          {minutes}
        </span>
        <motion.span
          animate={{ opacity: isRunning ? 0.45 : 0.15 }}
          transition={{
            duration: 2,
            repeat: isRunning ? Infinity : 0,
            repeatType: 'mirror',
            ease: 'easeInOut',
            type: 'tween'
          }}
          className="font-mono font-light text-text-main transition-[font-size] duration-[180ms] ease-in-out text-lg"
        >
          m
        </motion.span>
      </div>
    </div>
  )
}
