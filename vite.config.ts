import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		babel({
			filter: /\.[jt]sx?$/,
			babelConfig: {
				presets: ['@babel/preset-typescript'],
				plugins: [
					[
						'babel-plugin-react-compiler',
						{
							target: '18',
						},
					],
				],
			},
		}),
	],
});
