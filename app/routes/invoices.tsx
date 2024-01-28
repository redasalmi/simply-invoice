import { useLoaderData, Link } from '@remix-run/react';
import localforage from 'localforage';

import { buttonVariants } from '~/components/ui';
import { cn } from '~/lib/utils';
import { Invoice } from '~/types';

export async function clientLoader() {
	return {
		invoices: await localforage.getItem<Array<Invoice>>('invoices'),
	};
}

export default function InvoicesRoutes() {
	const { invoices } = useLoaderData<typeof clientLoader>();

	return (
		<>
			<Link
				to="/invoices/new"
				className={cn(
					'rounded-lg bg-blue-300 px-4 py-2',
					buttonVariants({ variant: 'default' }),
				)}
			>
				Create New Invoice
			</Link>
			<div className="mt-6">
				{invoices && invoices.length > 0 ? (
					<p>
						Cool, you have {invoices.length} invoice
						{invoices.length > 1 ? 's' : ''}
					</p>
				) : (
					<p>No invoice found.</p>
				)}
			</div>
		</>
	);
}
