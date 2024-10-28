import { useRevalidator } from 'react-router';
import { save } from '@tauri-apps/plugin-dialog';
import { create } from '@tauri-apps/plugin-fs';
import { homeDir } from '@tauri-apps/api/path';
import { Button } from '~/components/ui/button';
import { dbPathKey } from '~/lib/store';

export function SaveDBPath() {
	const { revalidate } = useRevalidator();

	const openFileDialog = async () => {
		try {
			const home = await homeDir();
			const path = await save({
				filters: [
					{
						name: 'Database',
						extensions: ['db', 'sqlite'],
					},
				],
				defaultPath: home,
			});
			if (!path) {
				return;
			}

			const file = await create(path);
			await file.close();
			await window.store.set(dbPathKey, `sqlite:${path}`);
			revalidate();
		} catch (err) {
			console.log({ err });
		}
	};

	return (
		<div>
			<Button onClick={openFileDialog}>Save DB Path</Button>
		</div>
	);
}
