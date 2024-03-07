import * as React from 'react';

import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';

import { Footer } from '~/components/Footer';
import { Navbar } from '~/components/Navbar';

import styles from '~/tailwind.css?url';

export const links = () => {
	return [{ rel: 'stylesheet', href: styles }];
};

type LayoutProps = {
	children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<html lang="en" className="h-[100%]">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="grid h-[100%] grid-rows-[auto_1fr_auto]">
				<Navbar />
				<main className="container mx-auto py-8">{children}</main>
				<Footer />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
