import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Eye, Pencil, Trash } from 'lucide-react';

import { buttonVariants } from '~/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';

import { db, getPage } from '~/lib/db';

import { cn } from '~/utils/shared';

export async function clientLoader() {
	return {
		customers: await getPage(db.customers, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<Link
					to="/customers/new"
					className={cn(
						'rounded-lg bg-blue-300 px-4 py-2',
						buttonVariants({ variant: 'default' }),
					)}
				>
					Create New Customer
				</Link>
			</div>
		</section>
	);
}

export default function CustomersRoute() {
	const { customers } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<section>
				<div className="flex justify-end">
					<Link
						to="/customers/new"
						className={cn(
							'rounded-lg bg-blue-300 px-4 py-2',
							buttonVariants({ variant: 'default' }),
						)}
					>
						Create New Customer
					</Link>
				</div>
				<div className="mt-6">
					{customers && customers.items.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{customers.items.map(({ id, email, name }) => (
									<TableRow key={id}>
										<TableCell>{name}</TableCell>
										<TableCell>{email}</TableCell>
										<TableCell className="flex items-center gap-4">
											<Link
												to={`/customers/${id}`}
												aria-label={`view ${name} customer details`}
											>
												<Eye />
											</Link>
											<Link
												to={`/customers/${id}/update`}
												aria-label={`update ${name} customer`}
											>
												<Pencil />
											</Link>
											<Link
												to={`/customers/${id}/delete`}
												aria-label={`delete ${name} customer`}
											>
												<Trash />
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p>No Customer found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
