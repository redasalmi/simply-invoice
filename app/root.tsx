import * as React from 'react';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	type LinksFunction,
} from 'react-router';
import { SaveDBPath } from '~/components/SaveDBPath';
import { Sidebar } from '~/components/Sidebar';
import { Spinner } from '~/components/Spinner';
import loadDb from '~/lib/loadDb?raw';
import '~/tailwind.css';
import type { Route } from './+types/root';

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

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
		<div className="flex">
			<Sidebar />
			<main className="container py-8">{children}</main>
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-[100%]">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
				<script dangerouslySetInnerHTML={{ __html: loadDb }} />
			</head>
			<body className="grid h-[100%] grid-rows-[auto_1fr_auto]">
				<Page>{children}</Page>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function HydrateFallback() {
	return (
		<div className="flex h-lvh w-lvw items-center justify-center">
			<p>loading the app...</p>
			<Spinner />
		</div>
	);
}
