import * as React from 'react';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from 'react-router';
import { Button } from '~/components/ui/button';
import { SaveDBPath } from '~/components/SaveDBPath';
import { LoadDB } from '~/components/LoadDB';
import { Sidebar } from '~/components/Sidebar';
import '~/inter.css';
import '~/tailwind.css';
import type { Route } from './+types/root';

export async function clientLoader() {
	return {
		storeAvailable: Boolean(window.store),
		dbAvailable: Boolean(window.db),
	};
}

function Page({ children }: { children: React.ReactNode }) {
	const loaderData = useLoaderData() as Route.ComponentProps['loaderData'];
	const { dbAvailable, storeAvailable } = loaderData || {};

	if (!loaderData) {
		// TODO: add app logo animation or some kind of intro, add timeout because loading is too fast
		return (
			<main>
				<h1>Loading...</h1>
			</main>
		);
	}

	if (!storeAvailable) {
		return (
			<main>
				<p>Something went wrong, please restart the application</p>
				<Button onClick={() => window.location.reload()}>
					Restart Application
				</Button>
			</main>
		);
	}

	if (!dbAvailable) {
		return (
			<main>
				<SaveDBPath />
			</main>
		);
	}

	return (
		<div className="root flex">
			<Sidebar />
			<main className="container py-8">{children}</main>
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Page>{children}</Page>
				<ScrollRestoration />
				<LoadDB />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
