import { Link } from '@remix-run/react';

export function Navbar() {
	return (
		<nav className="container mx-auto py-4">
			<Link className="mr-4 hover:text-blue-500 hover:underline" to="/">
				Home
			</Link>
			<Link className="hover:text-blue-500 hover:underline" to="/pdf">
				PDF
			</Link>
		</nav>
	);
}
