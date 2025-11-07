import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
	plugins: [solid()],
	base: './',
	root: '.',
	server: {
		port: 5173,
		strictPort: true,
	},
	build: {
		target: 'esnext',
		outDir: 'dist',
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
});
