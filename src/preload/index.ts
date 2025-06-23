import { electronAPI } from "@electron-toolkit/preload";
import type { CreateTaxInput, PaginationType, UpdateTaxInput } from "@types";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
	db: {
		taxes: {
			create: (tax: CreateTaxInput) => {
				return ipcRenderer.invoke("create-tax", tax);
			},
			get: (cursor: string | null, paginationType: PaginationType | null) => {
				return ipcRenderer.invoke("get-taxes", cursor, paginationType);
			},
			getById: (taxId: string) => {
				return ipcRenderer.invoke("get-tax", taxId);
			},
			update: (tax: UpdateTaxInput) => {
				return ipcRenderer.invoke("update-tax", tax);
			},
			delete: (taxId: string) => {
				return ipcRenderer.invoke("delete-tax", taxId);
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
