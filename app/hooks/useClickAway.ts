import * as React from 'react';

export function useClickAway(
	ref: React.RefObject<HTMLElement | null>,
	callback: (event: Event) => void,
) {
	React.useEffect(() => {
		const handler = (event: MouseEvent | TouchEvent) => {
			const element = ref.current;

			if (
				element &&
				event.target instanceof Node &&
				!element.contains(event.target)
			) {
				callback(event);
			}
		};

		document.addEventListener('mousedown', handler);
		document.addEventListener('touchstart', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('touchstart', handler);
		};
	}, [ref, callback]);
}
