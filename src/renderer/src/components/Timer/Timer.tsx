import React from 'react'
import { motion } from 'motion/react'

interface TimerProps {
  minutes: string
  isRunning: boolean
}

export function Timer({ minutes, isRunning }: TimerProps): React.JSX.Element {
  return (
    <div className="timer-display-wrapper">
      <div className="timer-display">
        <span className={`timer-minutes pinned ${isRunning ? 'running' : 'paused'}`}>
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
          className="timer-m pinned"
        >
          m
        </motion.span>
      </div>
    </div>
  )
}
