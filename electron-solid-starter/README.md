# Electron + Solid + Vite Starter

This sub-project wraps an Electron Forge setup tuned for Solid, Solid Router, and Vite. It includes TypeScript by default and uses the Oxc toolchain (`oxlint`, `oxfmt`) for linting and formatting.

## Quick start

```bash
npm install
npm run start
```

The `start` script launches Electron Forge with the Vite plugin. Solid's fast refresh works out of the box.

## Available scripts

- `npm run start` — start Electron Forge with Vite in development mode.
- `npm run package` — build the app without making installers.
- `npm run make` — generate platform-specific installers using the default makers.
- `npm run lint` — run `oxlint` with zero-warnings policy over the `src` directory.
- `npm run lint:fix` — apply auto-fixes with `oxlint`.
- `npm run format` — format project sources via `oxfmt`.
- `npm run format:check` — dry-run formatting to confirm files are already formatted.

## Project layout

```
src/
  main/      # Electron main process
  preload/   # Isolated preload bridge (exposes `window.electronAPI`)
  renderer/  # Solid application with Solid Router
```

The renderer ships with three starter routes (`/`, `/getting-started`, `/system`) to demonstrate navigation, styling, and preload access.

## Tooling notes

- `@electron-forge/plugin-vite` handles main, preload, and renderer builds via the three Vite configs (`vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`).
- `oxlint` uses `.oxlintrc.json` to enable ECMAScript 2022 features while linting both browser and Node contexts.
- `oxfmt` targets TypeScript, JavaScript, CSS, JSON, and HTML files under `src/`.

## Packaging

Forge makers are preconfigured for Squirrel (Windows), ZIP (macOS), DEB, and RPM packages. Adjust `forge.config.ts` if you need additional targets or custom metadata.
