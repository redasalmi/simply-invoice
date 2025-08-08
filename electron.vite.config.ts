import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import babel from "vite-plugin-babel";

export default defineConfig({
	main: {
		resolve: {
			alias: {
				"~/db": resolve("src/db"),
				"~/resources": resolve("resources"),
				"~/main": resolve("src/main"),
			},
		},
		plugins: [
			externalizeDepsPlugin({ include: ["electron-devtools-installer"] }),
		],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		build: {
			rollupOptions: {
				input: resolve("src/renderer/index.html"),
			},
		},
		resolve: {
			alias: {
				"~/db": resolve("src/db"),
				"~/renderer": resolve("src/renderer/src"),
				"~/resources": resolve("resources"),
			},
		},
		plugins: [
			react(),
			babel({
				filter: /\.[jt]sx?$/,
				babelConfig: {
					presets: ["@babel/preset-typescript"],
					plugins: [["babel-plugin-react-compiler", {}]],
				},
			}),
			tailwindcss(),
		],
	},
});
