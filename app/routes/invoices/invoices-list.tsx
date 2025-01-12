import { Link, Outlet } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { CreateLink } from '~/components/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { getInvoices } from '~/routes/invoices/queries/invoice.queries';
import { dateFormatter, formatMoney } from '~/utils/shared.utils';
import { Pagination } from '~/components/Pagination';
import { getPaginationParams, itemsPerPage } from '~/lib/pagination';
import type { Route } from './+types/invoices-list';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		invoices: await getInvoices(cursor, paginationType),
	};
}

export default function InvoicesListRoute({
	loaderData,
}: Route.ComponentProps) {
	const invoices = loaderData?.invoices;

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{invoices.total ? <p>Total invoices: {invoices.total}</p> : null}
					<CreateLink to="/invoices/create">Create Invoice</CreateLink>
				</div>
				<div className="mt-6">
					{invoices && invoices.items.length > 0 ? (
						<>
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
													{formatMoney({
														amount: cost.totalAmount,
														options: {
															currency: currencyCountryCode,
														},
													})}
												</TableCell>
												<TableCell className="flex items-center gap-4">
													<Link
														to={`/invoices/detail/${invoiceId}`}
														aria-label={`view invoice details`}
													>
														<EyeIcon />
													</Link>
													<Link
														to={`/invoices/download/${invoiceId}`}
														aria-label={`download invoice`}
													>
														<DownloadIcon />
													</Link>
													<Link
														to={`/invoices/update/${invoiceId}`}
														aria-label={`update invoice`}
													>
														<PencilIcon />
													</Link>
													<Link
														to={`/invoices/delete/${invoiceId}`}
														aria-label={`delete invoice`}
													>
														<TrashIcon />
													</Link>
												</TableCell>
											</TableRow>
										),
									)}
								</TableBody>
							</Table>
							{invoices.total > itemsPerPage ? (
								<Pagination baseUrl="/invoices" pageInfo={invoices.pageInfo} />
							) : null}
						</>
					) : (
						<p>No invoice found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
