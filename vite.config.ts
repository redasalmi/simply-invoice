import { netlifyPlugin } from '@netlify/remix-adapter/plugin';
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		remix({
			future: {
				unstable_singleFetch: true,
				unstable_fogOfWar: true,
			},
		}),
		netlifyPlugin(),
		tsconfigPaths(),
	],
});
