import { Link } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

export default function Home() {
	const [message, setMessage] = createSignal<string>('');

	onMount(() => {
		if (window.ipcRenderer) {
			window.ipcRenderer.on('main-process-message', (_event, msg: string) => {
				setMessage(`Received from main process: ${msg}`);
			});
		}
	});

	return (
		<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
			<div class="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">
					Welcome to Electron + SolidJS
				</h1>
				<p class="text-lg text-gray-600 mb-6">
					This is a starter app built with Electron, SolidJS, Solid Router, and
					Vite, using the OXC toolchain for linting and formatting.
				</p>
				{message() && (
					<p class="text-sm text-green-600 mb-4 p-3 bg-green-50 rounded">
						{message()}
					</p>
				)}
				<div class="flex gap-4">
					<Link
						href="/about"
						class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Go to About
					</Link>
				</div>
			</div>
		</div>
	);
}
