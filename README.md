<div align="center">
  <img src="resources/icon.png" alt="Hollow Logo" width="120" height="120">

  <h1>Hollow</h1>

  <p><strong>A minimalist Pomodoro timer for desktop</strong></p>

  <p>
    <em>Focus on what matters. Time flows.</em>
  </p>

  <p>
    <a href="https://electronjs.org">
      <img alt="Electron" src="https://img.shields.io/badge/Electron-33-9FEAF9?style=flat-square&logo=electron">
    </a>
    <a href="https://react.dev">
      <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react">
    </a>
    <a href="https://www.typescriptlang.org">
      <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript">
    </a>
    <a href="https://bun.sh">
      <img alt="Bun" src="https://img.shields.io/badge/Bun-1.1-000000?style=flat-square&logo=bun">
    </a>
    <a href="https://codecov.io/gh/torrescereno/hollow">
      <img alt="Coverage" src="https://img.shields.io/codecov/c/github/torrescereno/hollow?style=flat-square&logo=codecov&label=coverage">
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## ✨ Features

| ⏱️ **Smart Timer**                     | 📊 **Detailed Statistics**                                 |
| :------------------------------------- | :--------------------------------------------------------- |
| Customizable focus and break intervals | Complete session history and streaks                       |
| **⚙️ Flexible Configuration**          | **🔄 Automatic Updates**                                   |
| Duration, sounds, and window behavior  | Smart updates with critical, security, and normal priority |
| **💾 Local Storage**                   |                                                            |
| Private data, no internet connection   |                                                            |

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                  |
| ------------------- | ------------------------ |
| **React 19**        | UI Framework             |
| **TypeScript**      | Static typing            |
| **Tailwind CSS v4** | Styles                   |
| **shadcn/ui**       | Primitive UI components  |
| **Radix UI**        | Accessibility primitives |
| **Motion**          | Animations               |
| **Lucide React**    | Icons                    |

### Desktop

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| **Electron 33**    | Desktop framework         |
| **Electron Store** | Configuration persistence |

### Build

| Tool                 | Purpose         |
| -------------------- | --------------- |
| **Vite**             | Build tool      |
| **Bun**              | Package manager |
| **Electron Builder** | Packaging       |

---

## 🏗️ Architecture

Hollow follows a **layered architecture** with clear separation of concerns:

### System Overview

```mermaid
graph TB
    subgraph Electron
        MAIN[Main Process]
        AUTOUPDATE[AutoUpdater<br/>priority polling<br/>critical handling]
        IPC[IPC Handlers<br/>app, window, config<br/>session, update]
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
            MENU_FOOTER[MenuFooter]
            SOUND_SELECTOR[SoundSelector]
            BACK[BackButton]
            UPDATE_NOTIF[UpdateNotification]
        end

        subgraph UI Primitives[UI Primitives - shadcn/ui]
            UI_BUTTON[Button<br/>icon, play, back<br/>clear, export, update]
            UI_SWITCH[Switch]
            UI_SLIDER[Slider]
            UI_TABS[Tabs]
            UI_CARD[Card]
            UI_ALERT[Alert]
        end

        subgraph State
            HOOKS[Hooks<br/>useTimer, useConfig<br/>useSessions, useStats<br/>usePinned, useSound<br/>useViewTransition<br/>useUpdate]
            SERVICES[Services<br/>config, sessions<br/>electron, window]
        end

        subgraph Data
            SCHEMAS[Schemas<br/>config, session, stats<br/>view, electron]
            STORE[Electron Store]
        end

        subgraph Database
            DB_SCHEMA[Schema<br/>session, streak]
            DB_REPO[Repositories<br/>session, streak]
            DB_SERVICE[Services<br/>stats]
        end
    end

    MAIN --> PRELOAD
    PRELOAD --> APP
    IPC --> MAIN
    AUTOUPDATE --> MAIN
    AUTOUPDATE --> |update-status| APP

    APP --> TIMER
    APP --> MENU
    APP --> UPDATE_NOTIF
    MENU --> CONFIG
    MENU --> STATS

    TIMER --> TIMER_COMP
    TIMER --> CONTROLS
    TIMER --> BUTTON
    TIMER --> TOGGLE

    CONFIG --> SLIDER
    CONFIG --> SOUND_SELECTOR
    STATS --> STAT_CARD
    MENU --> MENU_NAV
    MENU --> MENU_FOOTER

    CONFIG --> BACK
    STATS --> BACK

    HOOKS --> SERVICES
    SERVICES --> SCHEMAS
    SERVICES --> STORE
    SERVICES --> DB_SERVICE
    DB_SERVICE --> DB_REPO
    DB_REPO --> DB_SCHEMA
    STORE --> MAIN
```

### Update System

```mermaid
sequenceDiagram
    participant Store as Electron Store
    participant App as React App
    participant Main as Main Process
    participant GitHub as GitHub Releases
    participant User as User

    Main->>Store: checkPendingUpdate()
    alt Pending update exists
        Store-->>Main: pendingUpdate data
        Main->>App: update-status (downloaded)
        App->>User: Show notification
        User->>App: Restart or Skip
    end

    Main->>GitHub: startPolling()

    alt Normal Update
        GitHub-->>Main: Update available (metadata)
        Main->>Main: Auto-download in background
        Main->>Store: Save pendingUpdate
        Main->>App: update-status (normal)
        App->>User: Show banner notification
    else Security Update
        GitHub-->>Main: Update available (security)
        Main->>Main: Auto-download in background
        Main->>Store: Save pendingUpdate
        Main->>App: update-status (security)
        App->>User: Show orange banner
    else Critical Update
        GitHub-->>Main: Update available (critical)
        Main->>Main: Auto-download in background
        Main->>Store: Save pendingUpdate
        Main->>App: update-status (critical)
        App->>User: Show blocking modal
    end
```

### Update Priority Levels

| Priority     | Interval | Behavior                                                                  |
| ------------ | -------- | ------------------------------------------------------------------------- |
| **Normal**   | 60 min   | Silent download, notify. Skip actually skips, re-shows on restart         |
| **Security** | 15 min   | Silent download, notify with recommended action. Persists across restarts |
| **Critical** | 5 min    | Silent download, blocking modal with countdown and snooze                 |

### Layer Summary

| Layer          | Responsibility               | Technologies                      |
| -------------- | ---------------------------- | --------------------------------- |
| **Views**      | UI and presentation          | React, TypeScript                 |
| **Components** | Application components       | React, shadcn/ui                  |
| **Primitives** | Reusable UI primitives       | shadcn/ui, Radix UI, Tailwind CSS |
| **State**      | Business logic and data flow | Custom Hooks                      |
| **Services**   | External integrations        | Electron API                      |
| **Data**       | Persistence and schemas      | Electron Store, Zod               |
| **Database**   | Structured storage           | Better-SQLite3, Drizzle ORM       |

---

## 🎨 Design System

Hollow uses **shadcn/ui** as the base for UI components, built on **Radix UI** for accessibility and **Tailwind CSS v4** for styling.

### UI Components

| Component  | Based on         | Description                                         |
| ---------- | ---------------- | --------------------------------------------------- |
| **Button** | shadcn/ui Button | 6 variants: icon, play, back, clear, export, update |
| **Switch** | Radix UI Switch  | Configuration toggle                                |
| **Slider** | Radix UI Slider  | Slider control for durations                        |
| **Tabs**   | Radix UI Tabs    | Section navigation                                  |
| **Card**   | shadcn/ui Card   | Statistics container                                |
| **Alert**  | shadcn/ui Alert  | Warning notifications                               |

### Dark Theme

The minimalist design uses an opacity system on a dark background:

```css
--background: #0f0f0f;
--foreground: #ffffff;
--secondary: rgb(255 255 255 / 0.05);
--accent: rgb(255 255 255 / 0.1);
```

---

## 📸 Screenshots

<div align="center">

|                       Timer View                        |                       Config View                        |
| :-----------------------------------------------------: | :------------------------------------------------------: |
| <img width="360" src="resources/screenshots/timer.png"> | <img width="360" src="resources/screenshots/config.png"> |

|                       Stats View                        |
| :-----------------------------------------------------: |
| <img width="360" src="resources/screenshots/stats.png"> |

</div>

---

## 🚀 Installation

### Downloads

Download the latest version from [GitHub Releases](https://github.com/torrescereno/hollow/releases/latest).

| Platform    | Architecture  | Format             |
| ----------- | ------------- | ------------------ |
| **Windows** | x64           | `.msi`             |
| **Linux**   | x64           | `.AppImage` `.deb` |
| **macOS**   | Apple Silicon | `.dmg` `.zip`      |
| **macOS**   | Intel         | `.dmg` `.zip`      |

#### macOS: First Run

The app is not signed with Apple Developer. After installing, run in Terminal:

```bash
xattr -cr /Applications/Hollow.app
```

> **Note:** Automatic updates are not available on macOS (requires Apple Developer signature). Download new versions manually from [Releases](https://github.com/torrescereno/hollow/releases/latest).

### Development

#### Prerequisites

- **Node.js** >= 18.x
- **Bun** >= 1.0 (recommended) or npm

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/torrescereno/hollow.git
cd hollow

# Install dependencies
bun install

# Run in development mode
bun run dev
```

<details>
<summary><b>📖 Development Scripts</b></summary>

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `bun run dev`         | Development server with hot reload |
| `bun run build`       | Production build (auto-detects OS) |
| `bun run build:win`   | Build for Windows (.exe)           |
| `bun run build:mac`   | Build for macOS (.dmg)             |
| `bun run build:linux` | Build for Linux (.AppImage, .deb)  |

</details>

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/torrescereno">torrescereno</a></sub>
</div>
