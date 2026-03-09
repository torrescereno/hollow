import React, { useState, useEffect, useRef } from 'react'
import { configService } from '../services'
import type { AppConfig } from '../schemas'
import { DEFAULT_CONFIG } from '../schemas'

interface UseConfigReturn {
  config: AppConfig
  updateConfig: (partial: Partial<AppConfig>) => Promise<void>
  configRef: React.MutableRefObject<AppConfig>
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG)
  const configRef = useRef(config)

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    configService.load().then((saved) => {
      if (saved) setConfig(saved)
    })
  }, [])

  const updateConfig = async (partial: Partial<AppConfig>): Promise<void> => {
    const updated = { ...config, ...partial }
    setConfig(updated)
    await configService.save(updated)
  }

  return { config, updateConfig, configRef }
}
