import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useConfig } from '../../hooks/useConfig'
import { configService } from '../../services'
import type { AppConfig } from '../../schemas'

vi.mock('../../services', () => ({
  configService: {
    load: vi.fn(),
    save: vi.fn()
  }
}))

describe('useConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load config on mount', async () => {
    const mockConfig: AppConfig = {
      focusMinutes: 30,
      restMinutes: 10,
      soundEnabled: false,
      selectedSound: 'chime',
      confettiEnabled: true
    }

    vi.mocked(configService.load).mockResolvedValue(mockConfig)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config).toEqual(mockConfig)
    })

    expect(configService.load).toHaveBeenCalled()
  })

  it('should return default config when no saved config', async () => {
    vi.mocked(configService.load).mockResolvedValue(undefined as never)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config.focusMinutes).toBeDefined()
      expect(result.current.config.restMinutes).toBeDefined()
    })
  })

  it('should update config', async () => {
    vi.mocked(configService.load).mockResolvedValue(undefined as never)
    vi.mocked(configService.save).mockResolvedValue(undefined)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config).toBeDefined()
    })

    await act(async () => {
      await result.current.updateConfig({ focusMinutes: 45 })
    })

    expect(result.current.config.focusMinutes).toBe(45)
    expect(configService.save).toHaveBeenCalled()
  })

  it('should merge partial config updates', async () => {
    const initialConfig: AppConfig = {
      focusMinutes: 25,
      restMinutes: 5,
      soundEnabled: true,
      selectedSound: 'bell',
      confettiEnabled: true
    }

    vi.mocked(configService.load).mockResolvedValue({} as AppConfig)
    vi.mocked(configService.save).mockResolvedValue(undefined)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config).toBeDefined()
    })

    await act(async () => {
      await result.current.updateConfig(initialConfig)
    })

    await act(async () => {
      await result.current.updateConfig({ focusMinutes: 30, soundEnabled: false })
    })

    expect(result.current.config.focusMinutes).toBe(30)
    expect(result.current.config.soundEnabled).toBe(false)
    expect(result.current.config.restMinutes).toBe(5)
  })

  it('should keep configRef in sync', async () => {
    vi.mocked(configService.load).mockResolvedValue(undefined as never)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config).toBeDefined()
    })

    expect(result.current.configRef.current).toEqual(result.current.config)

    await act(async () => {
      await result.current.updateConfig({ focusMinutes: 40 })
    })

    expect(result.current.configRef.current.focusMinutes).toBe(40)
  })

  it('should save config to storage', async () => {
    vi.mocked(configService.load).mockResolvedValue(undefined as never)
    vi.mocked(configService.save).mockResolvedValue(undefined)

    const { result } = renderHook(() => useConfig())

    await waitFor(() => {
      expect(result.current.config).toBeDefined()
    })

    const newConfig = {
      focusMinutes: 50,
      restMinutes: 15,
      soundEnabled: true,
      selectedSound: 'bell' as const
    }

    await act(async () => {
      await result.current.updateConfig(newConfig)
    })

    expect(configService.save).toHaveBeenCalledWith(
      expect.objectContaining({
        focusMinutes: 50,
        restMinutes: 15
      })
    )
  })
})
