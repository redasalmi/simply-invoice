import { useLoaderData, Link } from '@remix-run/react';
import localforage from 'localforage';

import {
	buttonVariants,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { invoicesKey } from '~/constants';
import { cn } from '~/lib/utils';

import type { Invoice, InvoiceField } from '~/types';

export async function clientLoader() {
	return {
		invoices: await localforage.getItem<Array<Invoice>>(invoicesKey),
	};
}

const formatter = new Intl.DateTimeFormat('en-GB', {
	month: 'short',
	day: '2-digit',
	year: 'numeric',
});

const getEmail = (customer: Array<InvoiceField>) => {
	return customer.find(({ label }) => label === 'email')?.value;
};

export default function InvoicesRoutes() {
	const { invoices } = useLoaderData<typeof clientLoader>();

	return (
		<>
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
								<TableHead>Date</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map(({ id, createdAt, customer }) => (
								<TableRow key={id}>
									<TableCell>{id}</TableCell>
									<TableCell>{formatter.format(new Date(createdAt))}</TableCell>
									<TableCell>{getEmail(customer)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No invoice found.</p>
				)}
			</div>
		</>
	);
}
