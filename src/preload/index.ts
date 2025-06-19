import { electronAPI } from "@electron-toolkit/preload";
import type { InsertTax, PaginationType } from "@types";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
	db: {
		taxes: {
			create: (tax: InsertTax) => {
				return ipcRenderer.invoke("create-tax", tax);
			},
			get: (cursor: string | null, paginationType: PaginationType | null) => {
				return ipcRenderer.invoke("get-taxes", cursor, paginationType);
			},
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
