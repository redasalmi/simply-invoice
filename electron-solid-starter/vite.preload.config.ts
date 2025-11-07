import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: 'inline',
    target: 'node20',
    outDir: 'out/preload',
    emptyOutDir: true,
    lib: {
      entry: 'src/preload/index.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});
