import * as React from 'react';

import { Navbar, SideBar, Footer } from '~/components';

type LayoutProps = {
	children?: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<>
			<Navbar />
			<div className="flex gap-6">
				<SideBar />
				<main className="py-8">{children}</main>
			</div>
			<Footer />
		</>
	);
}
