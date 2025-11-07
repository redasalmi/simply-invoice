import { Link } from '@solidjs/router';

export default function About() {
	return (
		<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-8">
			<div class="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">About</h1>
				<p class="text-lg text-gray-600 mb-6">
					This application is built with:
				</p>
				<ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
					<li>Electron - Cross-platform desktop app framework</li>
					<li>SolidJS - Reactive UI library</li>
					<li>Solid Router - Routing for SolidJS</li>
					<li>Vite - Fast build tool and dev server</li>
					<li>OXC Toolchain - Modern linting and formatting</li>
				</ul>
				<Link
					href="/"
					class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
