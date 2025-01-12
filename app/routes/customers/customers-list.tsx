import { Outlet, Link } from 'react-router';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CreateLink } from '~/components/CreateLink';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { getCustomers } from '~/routes/customers/queries/customer.queries';
import { Pagination } from '~/components/Pagination';
import { getPaginationParams, itemsPerPage } from '~/lib/pagination';
import type { Route } from './+types/customers-list';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { cursor, paginationType } = getPaginationParams(request.url);

	return {
		customers: await getCustomers(cursor, paginationType), // TODO: remove additional_information if not needed in list
	};
}

export default function CustomersListRoute({
	loaderData,
}: Route.ComponentProps) {
	const customers = loaderData?.customers;

	return (
		<>
			<section>
				<div className="flex items-center justify-between">
					{customers.total ? <p>Total customers: {customers.total}</p> : null}
					<CreateLink to="/customers/create">Create Customer</CreateLink>
				</div>
				<div className="mt-6">
					{customers && customers.items.length > 0 ? (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customers.items.map(({ customerId, email, name }) => (
										<TableRow key={customerId}>
											<TableCell>{name}</TableCell>
											<TableCell>{email}</TableCell>
											<TableCell className="flex items-center gap-4">
												<Link
													to={`/customers/detail/${customerId}`}
													aria-label={`view ${name} customer details`}
												>
													<EyeIcon />
												</Link>
												<Link
													to={`/customers/update/${customerId}`}
													aria-label={`update ${name} customer`}
												>
													<PencilIcon />
												</Link>
												<Link
													to={`/customers/delete/${customerId}/`}
													aria-label={`delete ${name} customer`}
												>
													<TrashIcon />
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{customers.total > itemsPerPage ? (
								<Pagination
									baseUrl="/customers"
									pageInfo={customers.pageInfo}
								/>
							) : null}
						</>
					) : (
						<p>No customers found.</p>
					)}
				</div>
			</section>
			<Outlet />
		</>
	);
}
