import * as React from 'react';

import { Navbar, Footer } from '~/components';

type LayoutProps = {
	children?: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<>
			<Navbar />
			<main className="container mx-auto py-8">{children}</main>
			<Footer />
		</>
	);
}
