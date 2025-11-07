# Electron + SolidJS + Solid Router + Vite Starter

A modern starter template for building desktop applications with Electron, SolidJS, Solid Router, and Vite, using the OXC toolchain for linting and formatting.

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **SolidJS** - Reactive UI library
- **Solid Router** - Routing for SolidJS
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **OXC Toolchain** - Modern linting (oxlint) and formatting (oxc)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
npm install
```

### Development

Run the app in development mode:

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron

### Building

Build the renderer and electron main process:

```bash
npm run build:all
```

Build a distributable app:

```bash
npm run electron:build
```

### Other Commands

- `npm run dev` - Start Vite dev server only (for web development)
- `npm run build` - Build renderer only
- `npm run lint` - Run oxlint
- `npm run format` - Format code with oxc
- `npm run typecheck` - Type check with TypeScript

## Project Structure

```
.
├── electron/          # Electron main process files
│   ├── main.ts       # Main process entry point
│   ├── preload.ts    # Preload script
│   └── vite.config.ts # Electron build config
├── src/              # SolidJS application source
│   ├── pages/        # Route pages
│   ├── App.tsx       # Root component with routes
│   ├── index.tsx     # Application entry point
│   └── index.html    # HTML template
├── dist/             # Built renderer (output)
├── dist-electron/    # Built electron files (output)
└── release/          # Packaged app (output)
```

## Features

- ✅ Hot Module Replacement (HMR) in development
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ OXC toolchain for linting and formatting
- ✅ Electron Builder for packaging
- ✅ Modern ES modules

## License

MIT
