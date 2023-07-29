import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';

import { Layout } from '~/components';

import styles from '~/tailwind.css';

import type { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: styles,
	},
];

export default function App() {
	return (
		<html lang="en" className="h-[100%]">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="grid h-[100%] grid-rows-[auto_1fr_auto]">
				<Layout>
					<Outlet />
				</Layout>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
