import * as React from 'react';

export function useKeyPress(
	key: string,
	callback: (event: KeyboardEvent) => void,
) {
	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key === key) {
				callback(event);
			}
		};

		document.addEventListener('keydown', handler);

		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [key, callback]);
}
