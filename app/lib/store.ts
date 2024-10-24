import type Database from '@tauri-apps/plugin-sql';
import type { Store } from '@tauri-apps/plugin-store';

declare global {
	interface Window {
		store: Store;
		db: Database;
	}
}

export const storeFilename = 'store.json';
export const dbPathKey = 'db-path';
