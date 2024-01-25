import * as React from 'react';

type ClientOnly = {
	fallback: React.ReactNode;
	children: React.ReactNode;
};

let isHydrating = true;

export function ClientOnly({ fallback, children }: ClientOnly) {
	const [isHydrated, setIsHydrated] = React.useState(!isHydrating);

	React.useEffect(() => {
		isHydrating = false;
		setIsHydrated(true);
	}, []);

	if (isHydrated) {
		return children;
	} else {
		return fallback;
	}
}
