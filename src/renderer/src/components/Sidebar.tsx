import {
	Building2,
	FileText,
	LayoutDashboard,
	type LucideIcon,
	Receipt,
	Users,
	Wrench,
} from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "~/renderer/utils/cn";

interface SideBarLinkProps {
	to: string;
	name: string;
	icon: LucideIcon;
}

const navigation = [
	{ name: "Dashboard", to: "/", icon: LayoutDashboard },
	{ name: "Companies", to: "/companies", icon: Building2 },
	{ name: "Customers", to: "/customers", icon: Users },
	{ name: "Services", to: "/services", icon: Wrench },
	{ name: "Taxes", to: "/taxes", icon: Receipt },
	// { name: "Invoices", to: "/invoices", icon: FileText },
	// { name: "Settings", to: "/settings", icon: Settings },
];

function NavItem({ to, name, icon: Icon }: SideBarLinkProps) {
	return (
		<NavLink
			className={({ isActive }) =>
				cn(
					"flex items-center gap-2 rounded-lg px-4 py-2 text-muted-foreground text-sm",
					isActive && "bg-primary text-primary-foreground",
					!isActive && "hover:bg-accent hover:text-primary",
				)
			}
			to={to}
		>
			<Icon className="size-4" />
			<span>{name}</span>
		</NavLink>
	);
}

export function Sidebar() {
	return (
		<div className="h-lvh w-64 border-border border-r">
			<div className="flex items-center gap-2 p-6">
				<FileText className="h-8 w-8" />
				<h1 className="font-bold text-xl">Simply Invoice</h1>
			</div>

			<nav className="flex flex-col gap-2 px-4">
				{navigation.map(({ name, to, icon }) => (
					<NavItem icon={icon} key={to} name={name} to={to} />
				))}
			</nav>
		</div>
	);
}
