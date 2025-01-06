import { CreateLink } from '~/components/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { getInvoices } from '~/queries/invoice.queries';
import { dateFormatter, formatMoney } from '~/utils/shared.utils';
import type { Route } from './+types/invoices-list';

export async function clientLoader() {
	return {
		invoices: await getInvoices(),
	};
}

export default function InvoicesListRoute({
	loaderData,
}: Route.ComponentProps) {
	const invoices = loaderData?.invoices;

	return (
		<section>
			<div className="flex justify-end">
				<CreateLink to="/invoices/create">Create Invoice</CreateLink>
			</div>
			<div className="mt-6">
				{invoices && invoices.items.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Customer Email</TableHead>
								<TableHead>Total Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.items.map(
								({
									invoiceId,
									identifier,
									currencyCountryCode,
									date,
									customer,
									cost,
								}) => (
									<TableRow key={invoiceId}>
										<TableCell>{identifier}</TableCell>
										<TableCell>
											{dateFormatter().format(new Date(date))}
										</TableCell>
										<TableCell>{customer.email}</TableCell>
										<TableCell>
											{formatMoney(cost.totalAmount, currencyCountryCode)}
										</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				) : (
					<p>No invoice found.</p>
				)}
			</div>
		</section>
	);
}
