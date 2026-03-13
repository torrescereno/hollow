import React, { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
import { electronService } from '../../services/electron.service'

export function MenuFooter(): React.JSX.Element {
  const [version, setVersion] = useState<string>('...')

  useEffect(() => {
    electronService.getAppVersion().then((v) => setVersion(v))
  }, [])

  const handleGithubClick = async (): Promise<void> => {
    await electronService.openExternal('https://github.com/torrescereno/hollow')
  }

  return (
    <div className="app-no-drag mt-auto pt-4 border-t border-white/5">
      <div className="flex items-center justify-between gap-3 px-3">
        <button
          onClick={handleGithubClick}
          className="text-white/25 hover:text-white/40 transition-colors duration-200 cursor-pointer focus-ring rounded"
          aria-label="Visit GitHub repository"
        >
          <Github size={15} strokeWidth={1.5} />
        </button>
        <span className="text-xs text-white/25 font-light tracking-[0.025em]">v{version}</span>
      </div>
    </div>
  )
}
