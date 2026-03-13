import React from 'react'

interface TimerProps {
  minutes: string
  isRunning: boolean
}

export function Timer({ minutes, isRunning }: TimerProps): React.JSX.Element {
  const opacityClass = isRunning ? 'opacity-100' : 'opacity-25'

  return (
    <div className="flex items-baseline gap-1">
      <span
        className={`font-mono tracking-[-0.05em] text-[4rem] font-extralight text-text-main ${opacityClass} transition-opacity duration-500`}
      >
        {minutes}
      </span>
      <span className="font-mono font-light text-xl text-text-main opacity-25">m</span>
    </div>
  )
}
