import { Link, NavLink } from "react-router";
import { cn } from "~/renderer/utils/cn";

interface SideBarLinkProps {
	to: string;
	children: React.ReactNode;
}

function NavItem({ to, children }: SideBarLinkProps) {
	return (
		<NavLink
			className={({ isActive }) =>
				cn("hover:underline", isActive && "underline")
			}
			to={to}
		>
			{children}
		</NavLink>
	);
}

export function Sidebar() {
	return (
		<nav className="flex h-lvh flex-col gap-8 text-nowrap border-gray-200 border-r-2 p-6 font-bold">
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
