import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';

import { Footer, Navbar } from '~/components';
import '~/tailwind.css';

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
				<Navbar />
				<main className="container mx-auto py-8">
					<Outlet />
				</main>
				<Footer />
				<ScrollRestoration />
				<LiveReload />
				<Scripts />
			</body>
		</html>
	);
}
