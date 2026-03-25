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
    <a href="https://codecov.io/gh/blas-works/hollow">
      <img alt="Coverage" src="https://img.shields.io/codecov/c/github/blas-works/hollow?style=flat-square&logo=codecov&label=coverage">
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## ✨ Features

| Feature                       | Description                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ⏱️ **Smart Timer**            | Customizable focus (1-90 min) and rest (1-30 min) intervals. Pause, resume, reset, and skip rest. Health warning for sessions over 30 min. |
| 📊 **Detailed Statistics**    | Session history with streaks, 24-week activity heatmap, weekly view, CSV export, and clear data options.                                   |
| ⚙️ **Flexible Configuration** | 4 notification sounds, confetti toggle, always-on-top pinning, background tray mode (macOS), multi-language (EN/ES).                       |
| 🔄 **Automatic Updates**      | Smart priority updates (critical, security, normal) with countdown and snooze option.                                                      |
| 💾 **Local Storage**          | SQLite + Drizzle ORM, offline-first, privacy-focused. No internet required.                                                                |

## 🚀 Installation

### Homebrew (macOS/Linux)

Install Hollow via [Homebrew](https://brew.sh):

**Option 1 — Add tap first (recommended):**

```bash
brew tap blas-works/apps
brew install --cask hollow
```

**Option 2 — One-liner without tap:**

```bash
brew install --cask blas-works/apps/hollow
```

To upgrade to the latest version:

```bash
brew upgrade --cask hollow
```

### Manual Download

Download the latest version from [GitHub Releases](https://github.com/blas-works/hollow/releases/latest).

| Platform    | Architecture  | Format                    |
| ----------- | ------------- | ------------------------- |
| **Windows** | x64           | `.exe` (NSIS)             |
| **Linux**   | x64           | `.AppImage` `.deb` `.rpm` |
| **macOS**   | Apple Silicon | `.dmg`                    |
| **macOS**   | Intel         | `.dmg`                    |

#### macOS: First Run

The app is not signed with Apple Developer. After installing, run in Terminal:

```bash
xattr -cr /Applications/Hollow.app
```

> **Note:** Automatic updates are not available on macOS (requires Apple Developer signature). Download new versions manually from [Releases](https://github.com/blas-works/hollow/releases/latest).

### Development

#### Prerequisites

- **Node.js** >= 18.x
- **Bun** >= 1.0 (recommended) or npm

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/blas-works/hollow.git
cd hollow

# Install dependencies
bun install

# Run in development mode
bun run dev
```

<details>
<summary><b>📖 Development Scripts</b></summary>

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `bun run dev`           | Development server with hot reload |
| `bun run build`         | Production build (auto-detects OS) |
| `bun run build:win`     | Build for Windows (.exe)           |
| `bun run build:mac`     | Build for macOS (.dmg)             |
| `bun run build:linux`   | Build for Linux (.AppImage, .deb)  |
| `bun run test`          | Run tests in watch mode            |
| `bun run test:run`      | Run tests once                     |
| `bun run test:coverage` | Run tests with coverage report     |
| `bun run lint`          | Lint code with ESLint              |
| `bun run typecheck`     | Type check with TypeScript         |

</details>
