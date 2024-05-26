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
					<Suspense>{props.children}</Suspense>
					<Footer />
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
