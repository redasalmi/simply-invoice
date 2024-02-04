import { Link, useLoaderData } from '@remix-run/react';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { customersStore, getAllItems } from '~/lib/stores';
import { cn } from '~/lib/utils';

import type { Customer } from '~/types';

export async function clientLoader() {
	return {
		customers: await getAllItems<Customer>(customersStore),
	};
}

export default function CustomersRoute() {
	const { customers } = useLoaderData<typeof clientLoader>();

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
			<div className="mt-6">
				{customers && customers.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{customers.map(({ id, email, name }) => (
								<TableRow key={id}>
									<TableCell>{name}</TableCell>
									<TableCell>{email}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No Customer found.</p>
				)}
			</div>
		</section>
	);
}
