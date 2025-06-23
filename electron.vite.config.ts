import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

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
		resolve: {
			alias: {
				"~/db": resolve("src/db"),
				"~/renderer": resolve("src/renderer/src"),
				"~/resources": resolve("resources"),
			},
		},
		plugins: [
			react({
				babel: {
					plugins: [["babel-plugin-react-compiler", {}]],
				},
			}),
			tailwindcss(),
		],
	},
});
