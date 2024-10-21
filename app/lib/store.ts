import { Store } from '@tauri-apps/plugin-store';

const settingsFilename = 'settings.json';
export const dbPathKey = 'db-path';

export async function clientLoader() {
	const store = await Store.load(settingsFilename, { autoSave: true });
	const dbPath = await store.get<string>(dbPathKey);

	return {
		store,
		dbPath,
		ready: true,
	};
}
