import { Link, useLoaderData } from '@remix-run/react';
import { CreateLink } from '~/components/entity/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { db, getPage } from '~/lib/db';

export async function clientLoader() {
	return {
		invoices: await getPage(db.invoices, 1),
	};
}

export function HydrateFallback() {
	return (
		<section>
			<div className="flex justify-end">
				<CreateLink to="/invoices/new">Create New Invoice</CreateLink>
			</div>
		</section>
	);
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
				<CreateLink to="/invoices/new">Create New Invoice</CreateLink>
			</div>
			<div className="mt-6">
				{invoices && invoices.items.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Creation Date</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.items.map(({ id, createdAt, customer }) => (
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
