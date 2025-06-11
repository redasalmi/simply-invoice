import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import type { InsertTax } from "../db/schema";

// Custom APIs for renderer
const api = {
	db: {
		getTaxes: (cursor?: string, pageSize?: number) => {
			return ipcRenderer.invoke("get-taxes", cursor, pageSize);
		},
		getTaxesCount: () => {
			return ipcRenderer.invoke("get-taxes-count");
		},
		createTax: (tax: InsertTax) => {
			return ipcRenderer.invoke("create-tax", tax);
		},
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
