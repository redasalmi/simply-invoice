import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

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
					<>
						Cool, you have {invoices.length} invoices
						{invoices.length > 1 ? 's' : ''}
					</>
				) : (
					<p>No invoices found.</p>
				)}
			</div>
		</>
	);
}
