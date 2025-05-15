export interface ElectronAPI {
	setTitle: (title: string) => Promise<void>;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}
