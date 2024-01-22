import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

import { buttonVariants } from '~/components/ui';
import { cn } from '~/lib/utils';

import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = () => {
	return json([]);
};

export default function InvoicesRoutes() {
	const invoices = useLoaderData<typeof loader>();

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
				{invoices.length > 0 ? (
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
