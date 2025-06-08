import type { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			db: {
				testUsersDb: () => Promise<void>;
				numberOfUsers: () => Promise<number>;
			};
		};
	}
}
