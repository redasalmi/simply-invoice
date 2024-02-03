import { useLoaderData, Link } from '@remix-run/react';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { getAllItems, invoicesStore } from '~/lib/stores';
import { cn } from '~/lib/utils';

import type { Invoice } from '~/types';

export async function clientLoader() {
	return {
		invoices: await getAllItems<Invoice>(invoicesStore),
	};
}

const formatter = new Intl.DateTimeFormat('en-GB', {
	month: 'short',
	day: '2-digit',
	year: 'numeric',
});

export default function InvoicesRoutes() {
	const { invoices } = useLoaderData<typeof clientLoader>();

	return (
		<section>
			<div className="flex justify-end">
				<Link
					to="/invoices/new"
					className={cn(
						'rounded-lg bg-blue-300 px-4 py-2',
						buttonVariants({ variant: 'default' }),
					)}
				>
					Create New Invoice
				</Link>
			</div>
			<div className="mt-6">
				{invoices && invoices.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Creation Date</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map(({ id, createdAt, customer }) => (
								<TableRow key={id}>
									<TableCell>{id}</TableCell>
									<TableCell>{formatter.format(new Date(createdAt))}</TableCell>
									<TableCell>{customer.email}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No invoice found.</p>
				)}
			</div>
		</section>
	);
}
