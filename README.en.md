# ScoopClient

A native desktop GUI client for Scoop, built with Electron + Next.js.

## Features

- **App Management** - View, update, and uninstall installed apps
- **Search & Install** - Search for and install apps from Scoop buckets
- **Bucket Management** - Add, remove, and manage Scoop sources
- **Version Switching** - Switch runtime versions for JDK, Node.js, Python, etc. (with reset support)
- **System Cleanup** - Remove old app versions to free disk space

## Project Structure

```text
scoop-client/
├── main/                    # Electron main process
│   ├── background.ts        # Main process entry, window management, and IPC handling
│   ├── preload.ts           # Preload script exposing secure APIs
│   └── database.ts          # Database operations (optional)
├── renderer/                # Next.js renderer process
│   ├── pages/               # Page components
│   │   ├── index.tsx        # Installed apps list
│   │   ├── search.tsx       # Search and installation
│   │   ├── buckets.tsx      # Bucket management
│   │   └── settings.tsx     # Settings and version management
│   ├── components/          # Reusable components
│   │   ├── Sidebar.tsx      # Sidebar navigation
│   │   ├── Toast.tsx        # Toast notification component
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   └── useToast.ts      # Toast state management
│   ├── lib/                 # Utility functions and type definitions
│   └── styles/              # Global styles
├── resources/               # App icon assets
└── scripts/                 # Build scripts
```

## Development Environment

### Prerequisites

- Node.js 16+
- npm or yarn
- Windows (Scoop required)

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

After startup, an Electron window opens automatically with hot reload enabled.

### Shortcut

- `Ctrl+Shift+Alt+O` - Toggle Developer Tools

## Build & Packaging

### Windows

```bash
npm run build              # Build Next.js
npm run electron:pack:win  # Package Windows installer
```

Build artifacts are generated in the `release/` directory.

### macOS

```bash
npm run build
npm run electron:pack:mac  # Package macOS DMG
```

**Note**: After building the Windows package, run `npm rebuild better-sqlite3` to restore the development environment.

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **Next.js** - React framework for the renderer process
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

## Configuration

- `nextron.config.js` - Nextron configuration
- `renderer/next.config.js` - Next.js configuration (static export)
- `electron-builder.yml` - Electron Builder packaging configuration

## Development Notes

1. **Routing paths** - Production uses the `file://` protocol, so all routes need trailing slashes.
2. **Native modules** - `better-sqlite3` must be rebuilt for the Electron ABI.
3. **Static export** - Next.js uses `output: 'export'`, so server-side features are not supported.
4. **IPC communication** - Main and renderer processes communicate via `window.electronAPI`.
