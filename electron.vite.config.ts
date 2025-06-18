import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
	main: {
		resolve: {
			alias: {
				"@db": resolve("src/db"),
				"@resources": resolve("resources"),
				"@main": resolve("src/main"),
			},
		},
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				"@db": resolve("src/db"),
				"@renderer": resolve("src/renderer/src"),
				"@resources": resolve("resources"),
			},
		},
		plugins: [react(), tailwindcss()],
	},
});
