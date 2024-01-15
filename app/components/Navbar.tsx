import { Link } from '@remix-run/react';

export function Navbar() {
	return (
		<nav className="bg-primary py-4">
			<div className="container mx-auto ">
				<Link className="mr-4 text-primary-foreground hover:underline" to="/">
					Simply Invoice
				</Link>
			</div>
		</nav>
	);
}
