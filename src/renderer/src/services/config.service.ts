import { electronService } from './electron.service'
import type { AppConfig } from '../schemas'
import { DEFAULT_CONFIG } from '../schemas'

class ConfigService {
  async load(): Promise<AppConfig> {
    const saved = await electronService.loadConfig()
    return saved ?? DEFAULT_CONFIG
  }

  async save(config: AppConfig): Promise<void> {
    await electronService.saveConfig(config)
  }
}

export const configService = new ConfigService()
