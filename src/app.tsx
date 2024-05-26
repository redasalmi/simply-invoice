import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import { Navbar } from '~/components/Navbar';
import { Footer } from '~/components/Footer';

import './app.css';

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<Navbar />
					<main class="container mx-auto">
						<Suspense>{props.children}</Suspense>
					</main>
					<Footer />
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
