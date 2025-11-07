import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,
    target: 'node20',
    outDir: 'out/main',
    emptyOutDir: true,
    lib: {
      entry: 'src/main/index.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});
