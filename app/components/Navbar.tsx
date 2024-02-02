import { Link, NavLink } from '@remix-run/react';

import { cn } from '~/lib/utils';

type SideBarLinkProps = {
	to: string;
	children: React.ReactNode;
};

function NavItem({ to, children }: SideBarLinkProps) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn('hover:underline', isActive && 'text-destructive underline')
			}
		>
			{children}
		</NavLink>
	);
}

export function Navbar() {
	return (
		<nav className="bg-primary py-6 font-bold text-primary-foreground">
			<div className="container mx-auto flex justify-between">
				<Link className="hover:underline" to="/">
					Simply Invoice
				</Link>

				<div className="flex gap-12">
					<NavItem to="/companies">Companies</NavItem>
					<NavItem to="/customers">Customers</NavItem>
					<NavItem to="/services">Services</NavItem>
					<NavItem to="/invoices">Invoices</NavItem>
				</div>
			</div>
		</nav>
	);
}
