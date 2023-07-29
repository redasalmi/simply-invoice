import { Link } from '@remix-run/react';

export function Navbar() {
	return (
		<nav className="bg-blue-300 py-4">
			<div className="container mx-auto ">
				<Link className="mr-4 hover:underline" to="/">
					Simply Invoice
				</Link>
			</div>
		</nav>
	);
}
