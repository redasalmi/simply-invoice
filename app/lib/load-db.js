(async () => {
	const { Store } = window.__TAURI__.store;
	const { exists } = window.__TAURI__.fs;
	const Database = window.__TAURI__.sql;
	const { invoke } = window.__TAURI__.core;

	const store = await Store.load('store.json', { autoSave: true });
	window.store = store;

	const dbPath = await store.get('db-path');
	const fileExists = dbPath ? await exists(dbPath) : false;

	if (dbPath && fileExists) {
		await invoke('init_db', { dbPath });
		const db = await Database.load(dbPath);
		window.db = db;
	}
})();
