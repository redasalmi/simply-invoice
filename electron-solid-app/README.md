# Electron + Solid.js Starter

A modern desktop application starter template built with Electron, Solid.js, Vite, and the OXC toolchain.

## 🚀 Features

- ⚡ **Electron** - Build cross-platform desktop apps
- 🎯 **Solid.js** - Fine-grained reactivity without Virtual DOM
- ⚡ **Vite** - Lightning-fast HMR and builds
- 🧭 **Solid Router** - Client-side routing for Solid.js
- 🔧 **Electron Forge** - Complete toolchain for Electron apps
- ✨ **OXC Toolchain** - Ultra-fast linting and formatting
- 📘 **TypeScript** - Full type safety
- 🎨 **Modern UI** - Beautiful gradient design out of the box

## 📦 Tech Stack

- [Electron](https://www.electronjs.org/) - Desktop application framework
- [Solid.js](https://www.solidjs.com/) - Reactive UI library
- [Solid Router](https://github.com/solidjs/solid-router) - Routing for Solid.js
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Electron Forge](https://www.electronforge.io/) - Complete Electron toolchain
- [OXC](https://oxc-project.github.io/) - Rust-based JavaScript toolchain
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd electron-solid-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Start the development server:
```bash
npm start
```

This will launch the Electron app with hot module replacement enabled.

### Building

Package the application for distribution:
```bash
npm run package
```

Create distributable installers:
```bash
npm run make
```

## 🧰 Available Scripts

- `npm start` - Start the development server
- `npm run package` - Package the app for the current platform
- `npm run make` - Create distributable installers
- `npm run lint` - Lint code with OXLint
- `npm run format` - Format code with OXC Formatter
- `npm run typecheck` - Type check with TypeScript

## 📁 Project Structure

```
electron-solid-app/
├── src/
│   ├── main/              # Electron main process
│   │   └── main.ts
│   ├── preload/           # Electron preload scripts
│   │   └── preload.ts
│   └── renderer/          # Solid.js frontend
│       ├── pages/         # Page components
│       │   ├── Home.tsx
│       │   ├── About.tsx
│       │   └── Counter.tsx
│       ├── App.tsx        # Main app component
│       ├── index.tsx      # Entry point
│       ├── index.html     # HTML template
│       └── index.css      # Global styles
├── forge.config.ts        # Electron Forge configuration
├── vite.main.config.ts    # Vite config for main process
├── vite.preload.config.ts # Vite config for preload
├── vite.renderer.config.ts # Vite config for renderer
├── tsconfig.json          # TypeScript configuration
├── oxlint.json           # OXLint configuration
├── .oxc_config.json      # OXC Formatter configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Customization

### Adding New Routes

1. Create a new page component in `src/renderer/pages/`
2. Import and add the route in `src/renderer/App.tsx`
3. Add a navigation link in the sidebar

Example:
```tsx
// src/renderer/pages/NewPage.tsx
import { Component } from 'solid-js';

const NewPage: Component = () => {
  return (
    <div class="page">
      <h2>New Page</h2>
      <p>Your content here</p>
    </div>
  );
};

export default NewPage;

// In App.tsx
import NewPage from './pages/NewPage';

// Add route
<Route path="/new" component={NewPage} />

// Add nav link
<li>
  <A href="/new" activeClass="active">
    New Page
  </A>
</li>
```

### Styling

The app uses vanilla CSS with a modern gradient design. Modify `src/renderer/index.css` to customize the appearance.

### Electron IPC

To add communication between main and renderer processes:

1. Add handlers in `src/main/main.ts`
2. Expose APIs in `src/preload/preload.ts`
3. Use the exposed APIs in your Solid components

## 🔧 Configuration

### OXC Linting

Configure linting rules in `oxlint.json`.

### OXC Formatting

Configure formatting options in `.oxc_config.json`.

### TypeScript

Adjust TypeScript settings in `tsconfig.json`.

### Electron Forge

Modify build and packaging settings in `forge.config.ts`.

## 📚 Learn More

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Solid.js Documentation](https://www.solidjs.com/docs/latest)
- [Solid Router Documentation](https://github.com/solidjs/solid-router)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Electron Forge Documentation](https://www.electronforge.io/)
- [OXC Documentation](https://oxc-project.github.io/)

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Electron, Solid.js, and Vite
