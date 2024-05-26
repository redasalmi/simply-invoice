import { A } from '@solidjs/router';
import type { ParentComponent } from 'solid-js';

type NavItemProps = ParentComponent<{ href: string }>;

const NavItem: NavItemProps = (props) => {
	return (
		<A
			href={props.href}
			class="hover:underline"
			activeClass="text-destructive underline"
		>
			{props.children}
		</A>
	);
};

export const Navbar = () => {
	return (
		<nav class="bg-primary text-primary-foreground py-6 font-bold">
			<div class="container mx-auto flex justify-between">
				<A href="/" class="hover:underline">
					Simply Invoice
				</A>

				<div class="flex gap-12">
					<NavItem href="/companies">Companies</NavItem>
					<NavItem href="/customers">Customers</NavItem>
					<NavItem href="/services">Services</NavItem>
					<NavItem href="/invoices">Invoices</NavItem>
				</div>
			</div>
		</nav>
	);
};
