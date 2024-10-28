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
import { Store } from '@tauri-apps/plugin-store';
import Database from '@tauri-apps/plugin-sql';
import { exists } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { SaveDBPath } from '~/components/SaveDBPath';
import { Navbar } from '~/components/Navbar';
import { Footer } from '~/components/Footer';
import { dbPathKey, storeFilename } from '~/lib/store';
import '~/tailwind.css';
import type * as Route from './+types.root';

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
	const store = await Store.load(storeFilename, { autoSave: true });
	window.store = store;

	const dbPath = await store.get<string>(dbPathKey);
	const fileExists = dbPath ? await exists(dbPath) : false;

	if (dbPath && fileExists) {
		await invoke('init_db', { dbPath });
		const db = await Database.load(dbPath);
		window.db = db;
	}

	return {
		store,
		dbAvailable: Boolean(window.db),
		ready: true,
	};
}

function Page({ children }: { children: React.ReactNode }) {
	const loaderData = useLoaderData() as Route.ComponentProps['loaderData'];
	const { dbAvailable, store, ready } = loaderData || {};

	if (!ready) {
		// TODO: add app logo animation or some kind of intro, add timeout because loading is too fast
		return (
			<main>
				<h1>Loading...</h1>
			</main>
		);
	}

	if (!store) {
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
		<>
			<Navbar />
			<main className="container py-8">{children}</main>
			<Footer />
		</>
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
