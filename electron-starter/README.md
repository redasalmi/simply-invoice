# Electron + Solid.js Starter App

A modern starter app built with:
- **Electron** - Cross-platform desktop apps
- **Electron Forge** - Complete tooling for Electron apps
- **Solid.js** - Reactive UI framework
- **Solid Router** - Routing for Solid.js
- **Vite** - Fast build tool and dev server
- **oxlint** - Fast linter from the oxc toolchain
- **TypeScript** - Type safety

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

### Linting

Run the linter:

```bash
npm run lint
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

### Building

Package the app:

```bash
npm run package
```

Create distributables:

```bash
npm run make
```

## Project Structure

```
electron-starter/
├── src/
│   ├── main/           # Main process (Electron)
│   │   └── main.ts
│   ├── preload/        # Preload scripts
│   │   └── preload.ts
│   └── renderer/       # Renderer process (Solid.js app)
│       ├── index.html
│       ├── index.tsx
│       ├── App.tsx
│       ├── index.css
│       └── pages/       # Route pages
│           ├── Home.tsx
│           └── About.tsx
├── forge.config.js     # Electron Forge configuration
├── vite.*.config.ts    # Vite configurations
├── tsconfig.json       # TypeScript configuration
└── oxlint.json         # oxlint configuration
```

## Features

- ✅ Hot Module Replacement (HMR) in development
- ✅ TypeScript support
- ✅ Routing with Solid Router
- ✅ Modern CSS styling
- ✅ Electron Forge for packaging and distribution
- ✅ oxlint for fast linting

## License

ISC
