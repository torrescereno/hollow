<div align="center">
  <img src="resources/icon.png" alt="Hollow Logo" width="120" height="120">

  <h1>Hollow</h1>

  <p><strong>Un temporizador Pomodoro minimalista para escritorio</strong></p>

  <p>
    <em>Enfócate en lo importante. El tiempo fluye.</em>
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
    <a href="#features">Características</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Arquitectura</a> •
    <a href="#instalación">Instalación</a>
  </p>
</div>

---

## ✨ Características

| ⏱️ **Timer Inteligente**                      | 📊 **Estadísticas Detalladas**                                |
| :-------------------------------------------- | :------------------------------------------------------------ |
| Intervalos personalizables de focus y break   | Historial completo de sesiones y rachas                       |
| **⚙️ Configuración Flexible**                 | **🔄 Actualizaciones Automáticas**                            |
| Duración, sonidos y comportamiento de ventana | Updates inteligentes con prioridad crítica, security y normal |
| **💾 Storage Local**                          |                                                               |
| Datos privados, sin conexión a internet       |                                                               |

---

## 🛠️ Tech Stack

### Frontend

| Tecnología          | Propósito       |
| ------------------- | --------------- |
| **React 19**        | Framework UI    |
| **TypeScript**      | Tipado estático |
| **Tailwind CSS v4** | Estilos         |
| **Motion**          | Animaciones     |
| **Lucide React**    | Iconos          |

### Desktop

| Tecnología         | Propósito                     |
| ------------------ | ----------------------------- |
| **Electron 33**    | Framework de escritorio       |
| **Electron Store** | Persistencia de configuración |

### Build

| Herramienta          | Propósito       |
| -------------------- | --------------- |
| **Vite**             | Build tool      |
| **Bun**              | Package manager |
| **Electron Builder** | Empaquetado     |

---

## 🏗️ Arquitectura

Hollow sigue una **arquitectura en capas** con separación clara de responsabilidades:

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
    participant App as React App
    participant Main as Main Process
    participant GitHub as GitHub Releases
    participant User as User

    App->>Main: setupAutoUpdater()
    Main->>GitHub: Check for updates (polling)

    alt Normal Update
        GitHub-->>Main: Update available (metadata)
        Main->>App: update-status (normal)
        App->>User: Show banner notification
        User->>App: Download & Restart
    else Security Update
        GitHub-->>Main: Update available (security)
        Main->>Main: Auto-download
        Main->>App: update-status (security)
        App->>User: Show orange banner
        User->>App: Restart now or later
    else Critical Update
        GitHub-->>Main: Update available (critical)
        Main->>Main: Auto-download
        Main->>App: update-status (critical)
        App->>User: Show blocking modal
        User->>App: Restart now or snooze 5min
        App->>Main: forceRestart() or snooze()
    end
```

### Update Priority Levels

| Prioridad    | Intervalo | Comportamiento                                   |
| ------------ | --------- | ------------------------------------------------ |
| **Normal**   | 60 min    | Check periódico, notificar al usuario            |
| **Security** | 15 min    | Auto-descargar, notificar con acción recomendada |
| **Critical** | 5 min     | Auto-descargar, modal bloqueante con countdown   |

### Resumen de Capas

| Capa           | Responsabilidad                    | Tecnologías                 |
| -------------- | ---------------------------------- | --------------------------- |
| **Views**      | UI y presentación                  | React, TypeScript           |
| **Components** | Primitivos UI reutilizables        | React                       |
| **State**      | Lógica de negocio y flujo de datos | Custom Hooks                |
| **Services**   | Integraciones externas             | Electron API                |
| **Data**       | Persistencia y esquemas            | Electron Store, Zod         |
| **Database**   | Almacenamiento estructurado        | Better-SQLite3, Drizzle ORM |

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

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.x
- **Bun** >= 1.0 (recomendado) o npm

### Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/torrescereno/hollow.git
cd hollow

# Instalar dependencias
bun install

# Ejecutar en modo desarrollo
bun run dev
```

<details>
<summary><b>📖 Scripts de Desarrollo</b></summary>

| Comando               | Descripción                             |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Servidor de desarrollo con hot reload   |
| `bun run build`       | Build para producción (auto-detecta OS) |
| `bun run build:win`   | Build para Windows (.exe)               |
| `bun run build:mac`   | Build para macOS (.dmg)                 |
| `bun run build:linux` | Build para Linux (.AppImage, .deb)      |

</details>

---

<div align="center">
  <sub>Hecho con ❤️ por <a href="https://github.com/torrescereno">torrescereno</a></sub>
</div>
