import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: 'src/renderer',
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    outDir: '../../out/renderer',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@renderer': resolve(rootDir, 'src/renderer'),
      '@main': resolve(rootDir, 'src/main'),
      '@preload': resolve(rootDir, 'src/preload')
    }
  },
  server: {
    port: 5173
  }
});
