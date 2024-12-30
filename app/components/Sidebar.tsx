import { Link, NavLink } from 'react-router';
import { cn } from '~/utils/shared.utils';

type SideBarLinkProps = {
	to: string;
	children: React.ReactNode;
};

function NavItem({ to, children }: SideBarLinkProps) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn('hover:underline', isActive && 'underline')
			}
		>
			{children}
		</NavLink>
	);
}

export function Sidebar() {
	return (
		<nav className="flex h-lvh flex-col gap-8 border-r-2 border-gray-200 p-6 font-bold text-nowrap">
			<Link className="py-10 hover:underline" to="/">
				Simply Invoice
			</Link>
			<NavItem to="/companies">Companies</NavItem>
			<NavItem to="/customers">Customers</NavItem>
			<NavItem to="/services">Services</NavItem>
			<NavItem to="/taxes">Taxes</NavItem>
			<NavItem to="/invoices">Invoices</NavItem>
		</nav>
	);
}
