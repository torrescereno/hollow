# Hollow

A minimal Pomodoro timer for desktop.

## Quick Start

```bash
bun install
bun run dev
```

## Build

```bash
bun run build        # Build for current OS
bun run build:win    # Windows
bun run build:mac    # macOS
bun run build:linux  # Linux
```

## Architecture

```mermaid
graph TB
    subgraph Electron
        MAIN[Main Process]
        PRELOAD[Preload]
    end

    subgraph React App
        APP[App]

        subgraph Views
            TIMER[TimerView]
            MENU[MenuView]
            CONFIG[ConfigSection]
            STATS[StatsSection]
        end

        subgraph Components
            TIMER_COMP[Timer]
            CONTROLS[Controls]
            BUTTON[Button]
            TOGGLE[Toggle]
            SLIDER[ConfigSlider]
            STAT_CARD[StatCard]
            MENU_NAV[MenuNav]
            BACK[BackButton]
        end

        subgraph State
            HOOKS[Hooks<br/>useTimer, useConfig<br/>useSessions, useStats]
            SERVICES[Services<br/>config, sessions<br/>electron, window]
        end

        subgraph Data
            SCHEMAS[Schemas<br/>config, session<br/>stats, view]
            STORE[Electron Store]
        end
    end

    MAIN --> PRELOAD
    PRELOAD --> APP
    APP --> TIMER
    APP --> MENU
    MENU --> CONFIG
    MENU --> STATS

    TIMER --> TIMER_COMP
    TIMER --> CONTROLS
    TIMER --> BUTTON
    TIMER --> TOGGLE

    CONFIG --> SLIDER
    STATS --> STAT_CARD
    MENU --> MENU_NAV

    CONFIG --> BACK
    STATS --> BACK

    HOOKS --> SERVICES
    SERVICES --> SCHEMAS
    SERVICES --> STORE
    STORE --> MAIN
```
