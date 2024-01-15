import { NavLink } from '@remix-run/react';

import { cn } from '~/lib/utils';

type SideBarLinkProps = {
	to: string;
	text: string;
};

function SideBarLink({ to, text }: SideBarLinkProps) {
	return (
		<NavLink
			className={({ isActive }) =>
				cn(
					'hover:text-primary hover:underline',
					isActive && 'text-destructive underline',
				)
			}
			to={to}
		>
			{text}
		</NavLink>
	);
}

export function SideBar() {
	return (
		<section className="py-8">
			<nav className="flex flex-col gap-4 px-8">
				<SideBarLink to="/invoices" text="Invoices" />
				<SideBarLink to="/companies" text="Companies" />
				<SideBarLink to="/clients" text="Clients" />
				<SideBarLink to="/services" text="Services" />
			</nav>
		</section>
	);
}
