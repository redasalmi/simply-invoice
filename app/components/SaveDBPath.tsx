import { useRevalidator } from 'react-router';
import { save } from '@tauri-apps/plugin-dialog';
import { create } from '@tauri-apps/plugin-fs';
import { homeDir } from '@tauri-apps/api/path';
import type { Store } from '@tauri-apps/plugin-store';
import { Button } from '~/components/ui/button';
import { dbPathKey } from '~/lib/store';

type SaveDBPathProps = {
	store: Store;
};

export function SaveDBPath({ store }: SaveDBPathProps) {
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
			await store.set(dbPathKey, path);
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
